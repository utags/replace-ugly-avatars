import {
  $,
  $$,
  addClass,
  addElement,
  addEventListener,
  doc,
  getOffsetPosition,
  removeClass,
  removeEventListener,
  throttle,
} from "browser-extension-utils"
import styleText from "data-text:./content.scss"

import { getRandomAvatar } from "./avatar"
import { changeIcon } from "./common"
import { getChangedAavatar, initStorage, saveAvatar } from "./storage"

function isAvatar(element: HTMLElement) {
  if (!element || element.tagName !== "IMG") {
    return false
  }

  if (element.dataset.ruaUserName) {
    return true
  }

  return false
}

let currentTarget: HTMLImageElement
function addChangeButton(element: HTMLImageElement) {
  currentTarget = element
  const container =
    $("#rua_container") ||
    addElement(doc.body, "div", {
      id: "rua_container",
    })
  const changeButton =
    $(".change_button", container) ||
    addElement(container, "button", {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      innerHTML: changeIcon,
      class: "change_button",
      async onclick() {
        /* TODO: add rotate icon effect */
        addClass(changeButton, "active")
        setTimeout(() => {
          removeClass(changeButton, "active")
        }, 200)
        const userName = currentTarget.dataset.ruaUserName || "noname"
        const avatarUrl = getRandomAvatar(userName)
        changeAvatar(currentTarget, avatarUrl)
        await saveAvatar(userName, avatarUrl)
      },
    })

  removeClass(changeButton, "delay_hide")
  const pos = getOffsetPosition(element)
  changeButton.style.top = pos.top + "px"
  changeButton.style.left =
    pos.left + element.clientWidth - changeButton.clientWidth + "px"

  const mouseoutHandler = () => {
    addClass(changeButton, "delay_hide")
    removeEventListener(element, "mouseout", mouseoutHandler)
  }

  addEventListener(element, "mouseout", mouseoutHandler)
}

function getUserName(element: HTMLElement) {
  if (!element) {
    return
  }

  const userNameElement = $('a[href*="/member/"]', element) as HTMLAnchorElement
  if (userNameElement) {
    return (/member\/(\w+)/.exec(userNameElement.href) || [])[1]
  }

  return getUserName(element.parentElement!)
}

function changeAvatar(element: HTMLImageElement, src: string) {
  if (!element.dataset.orgSrc) {
    const orgSrc = element.dataset.src /* v2hot */ || element.src
    element.dataset.orgSrc = orgSrc
  }

  element.src = src
  if (element.dataset.src) {
    /* v2hot */
    element.dataset.src = src
  }
}

function scanAvatars() {
  console.log("scanAvatars")
  const avatars = $$(`.avatar,a[href*="/member/"] img`) as HTMLImageElement[]
  for (const avatar of avatars) {
    let userName = avatar.dataset.ruaUserName
    if (!userName) {
      userName = getUserName(avatar)
      if (!userName) {
        console.error(avatar, userName)
        continue
      }

      // console.log(avatar, userName)
      avatar.dataset.ruaUserName = userName
    }

    const newAvatarSrc = getChangedAavatar(userName)
    if (newAvatarSrc && avatar.src !== newAvatarSrc) {
      console.log("change", userName)
      // console.log(avatar)
      changeAvatar(avatar, newAvatarSrc)
    }
  }
}

async function main() {
  if ($("#rua_tyle")) {
    // already running
    return
  }

  addElement("style", {
    textContent: styleText,
    id: "rua_tyle",
  })

  addEventListener(doc, "mouseover", (event: Event) => {
    const target = event.target as HTMLElement
    if (!isAvatar(target)) {
      return
    }

    // console.log(target)
    addChangeButton(target as HTMLImageElement)
  })

  await initStorage({
    avatarValueChangeListener() {
      scanAvatars()
    },
  })

  scanAvatars()

  const observer = new MutationObserver(
    throttle(async () => {
      scanAvatars()
    }, 500) as MutationCallback
  )

  observer.observe(doc, {
    childList: true,
    subtree: true,
  })
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises, unicorn/prefer-top-level-await
main()
