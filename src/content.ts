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
  runWhenHeadExists,
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
    $(".change_button.quick", container) ||
    addElement(container, "button", {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      innerHTML: changeIcon,
      class: "change_button quick",
      async onclick() {
        addClass(changeButton, "active")
        setTimeout(() => {
          removeClass(changeButton, "active")
        }, 200)
        const userName = currentTarget.dataset.ruaUserName || "noname"
        const avatarUrl = getRandomAvatar(userName)
        changeAvatar(currentTarget, avatarUrl, true)
        await saveAvatar(userName, avatarUrl)
      },
    })

  const changeButton2 =
    $(".change_button.advanced", container) ||
    addElement(container, "button", {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      innerHTML: changeIcon,
      class: "change_button advanced",
      async onclick() {
        addClass(changeButton2, "active")
        setTimeout(() => {
          removeClass(changeButton2, "active")
        }, 200)
        const userName = currentTarget.dataset.ruaUserName || "noname"
        const avatarUrl = prompt("请输入头像链接", "")
        // const avatarUrl = getRandomAvatar(userName)
        if (avatarUrl) {
          changeAvatar(currentTarget, avatarUrl, true)
          await saveAvatar(userName, avatarUrl)
        }
      },
    })

  removeClass(changeButton, "hide")
  removeClass(changeButton2, "hide")

  const pos = getOffsetPosition(element)
  const leftOffset =
    element.clientWidth - changeButton.clientWidth > 20
      ? element.clientWidth - changeButton.clientWidth
      : element.clientWidth - 1
  changeButton.style.top = pos.top + "px"
  changeButton.style.left = pos.left + leftOffset + "px"

  changeButton2.style.top = pos.top + changeButton.clientHeight + "px"
  changeButton2.style.left = pos.left + leftOffset + "px"

  const mouseoutHandler = () => {
    addClass(changeButton, "hide")
    addClass(changeButton2, "hide")
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
    const userName = (/member\/(\w+)/.exec(userNameElement.href) || [])[1]
    if (userName) {
      return userName.toLowerCase()
    }

    return
  }

  return getUserName(element.parentElement!)
}

function changeAvatar(
  element: HTMLImageElement,
  src: string,
  animation = false
) {
  if (element.ruaLoading) {
    return
  }

  if (!element.dataset.orgSrc) {
    const orgSrc = element.dataset.src /* v2hot */ || element.src
    element.dataset.orgSrc = orgSrc
  }

  element.ruaLoading = true

  const imgOnloadHandler = () => {
    element.ruaLoading = false
    removeClass(element, "rua_fadeout")
    removeEventListener(element, "load", imgOnloadHandler)
    removeEventListener(element, "error", imgOnloadHandler)
  }

  addEventListener(element, "load", imgOnloadHandler)
  addEventListener(element, "error", imgOnloadHandler)

  const width = element.clientWidth
  const height = element.clientHeight
  if (width > 1) {
    element.style.width = width + "px"
  }

  if (height > 1) {
    element.style.height = height + "px"
  }

  if (animation) {
    addClass(element, "rua_fadeout")
  } else {
    // white image placeholder
    element.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
  }

  setTimeout(() => {
    element.src = src
  })
  if (element.dataset.src) {
    /* v2hot */
    element.dataset.src = src
  }
}

function scanAvatars() {
  // console.log("scanAvatars")
  const avatars = $$(`.avatar,a[href*="/member/"] img`) as HTMLImageElement[]
  for (const avatar of avatars) {
    let userName = avatar.dataset.ruaUserName
    if (!userName) {
      userName = getUserName(avatar)
      if (!userName) {
        console.error("Can't get username", avatar, userName)
        continue
      }

      // console.log(avatar, userName)
      avatar.dataset.ruaUserName = userName
    }

    const newAvatarSrc = getChangedAavatar(userName)
    if (newAvatarSrc && avatar.src !== newAvatarSrc) {
      // console.log("change", userName)
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

  runWhenHeadExists(() => {
    addElement("style", {
      textContent: styleText,
      id: "rua_tyle",
    })
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
