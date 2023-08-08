import {
  getSettingsValue,
  initSettings,
  showSettings,
} from "browser-extension-settings"
import {
  $,
  $$,
  addClass,
  addElement,
  addEventListener,
  doc,
  getOffsetPosition,
  registerMenuCommand,
  removeClass,
  removeEventListener,
  runWhenHeadExists,
  throttle,
} from "browser-extension-utils"
import styleText from "data-text:./content.scss"

import { getRandomAvatar } from "./avatar"
import { changeIcon } from "./common"
import {
  clearAvatarData,
  getChangedAavatar,
  initStorage,
  saveAvatar,
} from "./storage"

const host = location.host

const isEnabledByDefault = () => {
  if (host.includes("xxxxxxxx")) {
    return false
  }

  return true
}

const settingsTable = {
  [`enableCurrentSite_${host}`]: {
    title: "Enable current site",
    defaultValue: isEnabledByDefault(),
  },
  clearData: {
    title: "清空被替换的头像数据",
    type: "action",
    async onclick() {
      if (confirm("确定要删除所有被替换的头像数据吗？")) {
        await clearAvatarData()
        setTimeout(() => {
          alert("删除完毕!")
        })
      }
    },
    group: 2,
  },
}

function onSettingsChange() {
  if (getSettingsValue(`enableCurrentSite_${host}`)) {
    scanAvatars()
  } else {
    for (const element of $$("img[data-rua-org-src]") as HTMLImageElement[]) {
      if (
        element.dataset.ruaOrgSrc &&
        element.src !== element.dataset.ruaOrgSrc
      ) {
        element.src = element.dataset.ruaOrgSrc
      }
    }
  }
}

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

  if (!element.dataset.ruaOrgSrc) {
    const orgSrc = element.dataset.src /* v2hot */ || element.src
    element.dataset.ruaOrgSrc = orgSrc
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
    } else if (
      !newAvatarSrc &&
      avatar.dataset.ruaOrgSrc &&
      avatar.src !== avatar.dataset.ruaOrgSrc
    ) {
      avatar.src = avatar.dataset.ruaOrgSrc
    }
  }
}

async function main() {
  if ($("#rua_tyle")) {
    // already running
    return
  }

  await initSettings({
    id: "replace-ugly-avatars",
    title: "赐你个头像吧",
    footer: `
    <p>After change settings, reload the page to take effect</p>
    <p>
    <a href="https://github.com/utags/replace-ugly-avatars/issues" target="_blank">
    Report and Issue...
    </a></p>
    <p>Made with ❤️ by
    <a href="https://www.pipecraft.net/" target="_blank">
      Pipecraft
    </a></p>`,
    settingsTable,
    async onValueChange() {
      onSettingsChange()
    },
  })

  registerMenuCommand("⚙️ 设置", showSettings, "o")

  if (!getSettingsValue(`enableCurrentSite_${host}`)) {
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
