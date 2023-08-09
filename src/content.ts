import {
  getSettingsValue,
  initSettings,
  saveSettingsValues,
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
  runOnce,
  runWhenHeadExists,
  setAttributes,
  throttle,
} from "browser-extension-utils"
import styleText from "data-text:./content.scss"

import { allAvatarStyleList, getRandomAvatar } from "./avatar"
import { changeIcon } from "./common"
import {
  clearAvatarData,
  getChangedAavatar,
  initStorage,
  saveAvatar,
  saveAvatars,
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

  "style-adventurer": {
    title: "Adventurer",
    icon: "https://api.dicebear.com/6.x/adventurer/svg?seed=JD",
    defaultValue: true,
    group: 2,
  },
  "style-adventurer-neutral": {
    title: "Adventurer Neutral",
    icon: "https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=JD",
    defaultValue: true,
    group: 2,
  },
  "style-avataaars": {
    title: "Avataaars",
    icon: "https://api.dicebear.com/6.x/avataaars/svg?seed=JD",
    defaultValue: true,
    group: 2,
  },
  "style-avataaars-neutral": {
    title: "Avataaars Neutral",
    icon: "https://api.dicebear.com/6.x/avataaars-neutral/svg?seed=JD",
    defaultValue: true,
    group: 2,
  },
  "style-big-ears": {
    title: "Big Ears",
    icon: "https://api.dicebear.com/6.x/big-ears/svg?seed=JD",
    defaultValue: true,
    group: 2,
  },
  "style-big-ears-neutral": {
    title: "Big Ears Neutral",
    icon: "https://api.dicebear.com/6.x/big-ears-neutral/svg?seed=JD",
    defaultValue: true,
    group: 2,
  },
  "style-big-smile": {
    title: "Big Smile",
    icon: "https://api.dicebear.com/6.x/big-smile/svg?seed=JD",
    defaultValue: true,
    group: 2,
  },
  "style-bottts": {
    title: "Bottts",
    icon: "https://api.dicebear.com/6.x/bottts/svg?seed=JD",
    defaultValue: true,
    group: 2,
  },
  "style-bottts-neutral": {
    title: "Bottts Neutral",
    icon: "https://api.dicebear.com/6.x/bottts-neutral/svg?seed=JD",
    defaultValue: true,
    group: 2,
  },
  "style-croodles": {
    title: "Croodles",
    icon: "https://api.dicebear.com/6.x/croodles/svg?seed=JD",
    defaultValue: true,
    group: 2,
  },
  "style-croodles-neutral": {
    title: "Croodles Neutral",
    icon: "https://api.dicebear.com/6.x/croodles-neutral/svg?seed=JD",
    defaultValue: true,
    group: 2,
  },
  "style-fun-emoji": {
    title: "Fun Emoji",
    icon: "https://api.dicebear.com/6.x/fun-emoji/svg?seed=JD",
    defaultValue: true,
    group: 2,
  },
  "style-icons": {
    title: "Icons",
    icon: "https://api.dicebear.com/6.x/icons/svg?seed=JD",
    defaultValue: true,
    group: 2,
  },
  "style-identicon": {
    title: "Identicon",
    icon: "https://api.dicebear.com/6.x/identicon/svg?seed=JD",
    defaultValue: true,
    group: 2,
  },
  "style-initials": {
    title: "Initials",
    icon: "https://api.dicebear.com/6.x/initials/svg?seed=JD",
    defaultValue: true,
    group: 2,
  },
  "style-lorelei": {
    title: "Lorelei",
    icon: "https://api.dicebear.com/6.x/lorelei/svg?seed=JD",
    defaultValue: true,
    group: 2,
  },
  "style-lorelei-neutral": {
    title: "Lorelei Neutral",
    icon: "https://api.dicebear.com/6.x/lorelei-neutral/svg?seed=JD",
    defaultValue: true,
    group: 2,
  },
  "style-micah": {
    title: "Micah",
    icon: "https://api.dicebear.com/6.x/micah/svg?seed=JD",
    defaultValue: true,
    group: 2,
  },
  "style-miniavs": {
    title: "Miniavs",
    icon: "https://api.dicebear.com/6.x/miniavs/svg?seed=JD",
    defaultValue: true,
    group: 2,
  },
  "style-notionists": {
    title: "Notionists",
    icon: "https://api.dicebear.com/6.x/notionists/svg?seed=JD",
    defaultValue: true,
    group: 2,
  },
  "style-notionists-neutral": {
    title: "Notionists Neutral",
    icon: "https://api.dicebear.com/6.x/notionists-neutral/svg?seed=JD",
    defaultValue: true,
    group: 2,
  },
  "style-open-peeps": {
    title: "Open Peeps",
    icon: "https://api.dicebear.com/6.x/open-peeps/svg?seed=JD",
    defaultValue: true,
    group: 2,
  },
  "style-personas": {
    title: "Personas",
    icon: "https://api.dicebear.com/6.x/personas/svg?seed=JD",
    defaultValue: true,
    group: 2,
  },
  "style-pixel-art": {
    title: "Pixel Art",
    icon: "https://api.dicebear.com/6.x/pixel-art/svg?seed=JD",
    defaultValue: true,
    group: 2,
  },
  "style-pixel-art-neutral": {
    title: "Pixel Art Neutral",
    icon: "https://api.dicebear.com/6.x/pixel-art-neutral/svg?seed=JD",
    defaultValue: true,
    group: 2,
  },
  "style-shapes": {
    title: "Shapes",
    icon: "https://api.dicebear.com/6.x/shapes/svg?seed=JD",
    defaultValue: true,
    group: 2,
  },
  "style-thumbs": {
    title: "Thumbs",
    icon: "https://api.dicebear.com/6.x/thumbs/svg?seed=JD",
    defaultValue: true,
    group: 2,
  },

  autoReplaceAll: {
    title: "自动替换全部头像",
    defaultValue: false,
    group: 3,
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
    group: 4,
  },
}

let avatarStyleList: string[] = []
function updateAvatarStyleList() {
  avatarStyleList = allAvatarStyleList.filter((style) =>
    getSettingsValue(`style-${style}`)
  )

  if (avatarStyleList.length === 0 && !doc.hidden) {
    setTimeout(async () => {
      alert("至少需要启用一种头像风格")

      await saveSettingsValues({
        "style-adventurer": true,
      })

      const firstStyleOption = $(
        '.browser_extension_settings_container [data-key="style-adventurer"]'
      )
      if (firstStyleOption) {
        firstStyleOption.scrollIntoView({ block: "nearest" })
      }
    }, 200)
  }
}

let lastValueOfEnableCurrentSite = true
let lastValueOfAutoReplaceAll = false
async function onSettingsChange() {
  if (getSettingsValue(`enableCurrentSite_${host}`)) {
    if (!lastValueOfEnableCurrentSite) {
      if ($("#rua_tyle")) {
        scanAvatars()
      } else {
        await main()
      }
    }
  } else if (lastValueOfEnableCurrentSite) {
    for (const element of $$("img[data-rua-org-src]") as HTMLImageElement[]) {
      if (
        element.dataset.ruaOrgSrc &&
        element.src !== element.dataset.ruaOrgSrc
      ) {
        element.src = element.dataset.ruaOrgSrc
      }
    }
  }

  lastValueOfEnableCurrentSite = getSettingsValue(
    `enableCurrentSite_${host}`
  ) as boolean

  if (
    getSettingsValue("autoReplaceAll") &&
    !lastValueOfAutoReplaceAll &&
    !doc.hidden
  ) {
    if (confirm("确定要自动替换全部头像吗？")) {
      lastValueOfAutoReplaceAll = getSettingsValue("autoReplaceAll") as boolean
      scanAvatars()
    } else {
      await saveSettingsValues({
        autoReplaceAll: false,
      })
    }
  }

  lastValueOfAutoReplaceAll = getSettingsValue("autoReplaceAll") as boolean

  updateAvatarStyleList()
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
        const avatarUrl = getRandomAvatar(userName, avatarStyleList)
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
  }, 100)
  if (element.dataset.src) {
    /* v2hot */
    element.dataset.src = src
  }
}

const scanAvatars = throttle(async () => {
  if (doc.hidden || !getSettingsValue(`enableCurrentSite_${host}`)) {
    return
  }

  const newValues = {}
  // console.log("scanAvatars", lastValueOfAutoReplaceAll)
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

    // Use lazy loading, because of th API limit the number of requests per second to 50
    setAttributes(avatar, {
      loading: "lazy",
      referrerpolicy: "no-referrer",
      rel: "noreferrer",
    })

    const newAvatarSrc = getChangedAavatar(userName)
    if (newAvatarSrc && avatar.src !== newAvatarSrc) {
      // console.log("change", userName)
      // console.log(avatar)
      changeAvatar(avatar, newAvatarSrc)
    } else if (!newAvatarSrc) {
      if (avatar.dataset.ruaOrgSrc && avatar.src !== avatar.dataset.ruaOrgSrc) {
        avatar.src = avatar.dataset.ruaOrgSrc
      }

      if (lastValueOfAutoReplaceAll && Object.entries(newValues).length < 3) {
        // console.log("replace", userName)
        const avatarUrl = getRandomAvatar(userName, avatarStyleList)
        newValues[userName] = avatarUrl
      }
    }
  }

  if (lastValueOfAutoReplaceAll) {
    await saveAvatars(newValues)
  }
}, 100)

async function main() {
  if ($("#rua_tyle")) {
    // already running
    return
  }

  await runOnce("main", async () => {
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
        await onSettingsChange()
      },
    })

    registerMenuCommand("⚙️ 设置", showSettings, "o")
  })

  lastValueOfEnableCurrentSite = getSettingsValue(
    `enableCurrentSite_${host}`
  ) as boolean
  lastValueOfAutoReplaceAll = getSettingsValue("autoReplaceAll") as boolean

  if (!getSettingsValue(`enableCurrentSite_${host}`)) {
    return
  }

  updateAvatarStyleList()

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

  addEventListener(doc, "visibilitychange", () => {
    if (!doc.hidden) {
      scanAvatars()
    }
  })

  await initStorage({
    avatarValueChangeListener() {
      scanAvatars()
    },
  })

  if ($("img")) {
    scanAvatars()
  }

  const observer = new MutationObserver(() => {
    scanAvatars()
  })

  observer.observe(doc, {
    childList: true,
    subtree: true,
  })
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises, unicorn/prefer-top-level-await
main()
