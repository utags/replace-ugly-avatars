import {
  getSettingsValue,
  initSettings,
  saveSettingsValues,
} from 'browser-extension-settings'
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
  runOnce,
  runWhenHeadExists,
  setAttributes,
  throttle,
} from 'browser-extension-utils'
import styleText from 'data-text:./content.scss'

import { allAvatarStyleList, getRandomAvatar } from './avatar'
import { changeIcon } from './common'
import { i } from './messages'
import { initRamdomAvatar as initRamdomGfriendsAvatar } from './modules/gfriends'
import { initRamdomAvatar as initRamdomUglyAvatar } from './modules/ugly-avatar'
import { currentSite } from './sites'
import {
  clearAvatarData,
  getChangedAavatar,
  initStorage,
  saveAvatar,
  saveAvatars,
} from './storage'

const host = location.host
const suffix = host.includes('v2ex') ? '' : '_' + host

const isEnabledByDefault = () => {
  if (host.includes('xxxxxxxx')) {
    return false
  }

  return true
}

const settingsTable = {
  [`enableCurrentSite_${host}`]: {
    title: i('settings.enableCurrentSite'),
    defaultValue: isEnabledByDefault(),
  },

  [`style-adventurer${suffix}`]: {
    title: 'Adventurer',
    icon: 'https://api.dicebear.com/6.x/adventurer/svg?seed=JD',
    defaultValue: true,
    group: 2,
  },
  [`style-adventurer-neutral${suffix}`]: {
    title: 'Adventurer Neutral',
    icon: 'https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=JD',
    defaultValue: false,
    group: 2,
  },
  [`style-avataaars${suffix}`]: {
    title: 'Avataaars',
    icon: 'https://api.dicebear.com/6.x/avataaars/svg?seed=JD',
    defaultValue: false,
    group: 2,
  },
  [`style-avataaars-neutral${suffix}`]: {
    title: 'Avataaars Neutral',
    icon: 'https://api.dicebear.com/6.x/avataaars-neutral/svg?seed=JD',
    defaultValue: false,
    group: 2,
  },
  [`style-big-ears${suffix}`]: {
    title: 'Big Ears',
    icon: 'https://api.dicebear.com/6.x/big-ears/svg?seed=JD',
    defaultValue: false,
    group: 2,
  },
  [`style-big-ears-neutral${suffix}`]: {
    title: 'Big Ears Neutral',
    icon: 'https://api.dicebear.com/6.x/big-ears-neutral/svg?seed=JD',
    defaultValue: false,
    group: 2,
  },
  [`style-big-smile${suffix}`]: {
    title: 'Big Smile',
    icon: 'https://api.dicebear.com/6.x/big-smile/svg?seed=JD',
    defaultValue: false,
    group: 2,
  },
  [`style-bottts${suffix}`]: {
    title: 'Bottts',
    icon: 'https://api.dicebear.com/6.x/bottts/svg?seed=JD',
    defaultValue: false,
    group: 2,
  },
  [`style-bottts-neutral${suffix}`]: {
    title: 'Bottts Neutral',
    icon: 'https://api.dicebear.com/6.x/bottts-neutral/svg?seed=JD',
    defaultValue: false,
    group: 2,
  },
  [`style-croodles${suffix}`]: {
    title: 'Croodles',
    icon: 'https://api.dicebear.com/6.x/croodles/svg?seed=JD',
    defaultValue: false,
    group: 2,
  },
  [`style-croodles-neutral${suffix}`]: {
    title: 'Croodles Neutral',
    icon: 'https://api.dicebear.com/6.x/croodles-neutral/svg?seed=JD',
    defaultValue: false,
    group: 2,
  },
  [`style-fun-emoji${suffix}`]: {
    title: 'Fun Emoji',
    icon: 'https://api.dicebear.com/6.x/fun-emoji/svg?seed=JD',
    defaultValue: false,
    group: 2,
  },
  [`style-icons${suffix}`]: {
    title: 'Icons',
    icon: 'https://api.dicebear.com/6.x/icons/svg?seed=JD',
    defaultValue: false,
    group: 2,
  },
  [`style-identicon${suffix}`]: {
    title: 'Identicon',
    icon: 'https://api.dicebear.com/6.x/identicon/svg?seed=JD',
    defaultValue: false,
    group: 2,
  },
  [`style-initials${suffix}`]: {
    title: 'Initials',
    icon: 'https://api.dicebear.com/6.x/initials/svg?seed=JD',
    defaultValue: false,
    group: 2,
  },
  [`style-lorelei${suffix}`]: {
    title: 'Lorelei',
    icon: 'https://api.dicebear.com/6.x/lorelei/svg?seed=JD',
    defaultValue: false,
    group: 2,
  },
  [`style-lorelei-neutral${suffix}`]: {
    title: 'Lorelei Neutral',
    icon: 'https://api.dicebear.com/6.x/lorelei-neutral/svg?seed=JD',
    defaultValue: false,
    group: 2,
  },
  [`style-micah${suffix}`]: {
    title: 'Micah',
    icon: 'https://api.dicebear.com/6.x/micah/svg?seed=JD',
    defaultValue: false,
    group: 2,
  },
  [`style-miniavs${suffix}`]: {
    title: 'Miniavs',
    icon: 'https://api.dicebear.com/6.x/miniavs/svg?seed=JD',
    defaultValue: false,
    group: 2,
  },
  [`style-notionists${suffix}`]: {
    title: 'Notionists',
    icon: 'https://api.dicebear.com/6.x/notionists/svg?seed=JD',
    defaultValue: false,
    group: 2,
  },
  [`style-notionists-neutral${suffix}`]: {
    title: 'Notionists Neutral',
    icon: 'https://api.dicebear.com/6.x/notionists-neutral/svg?seed=JD',
    defaultValue: false,
    group: 2,
  },
  [`style-open-peeps${suffix}`]: {
    title: 'Open Peeps',
    icon: 'https://api.dicebear.com/6.x/open-peeps/svg?seed=JD',
    defaultValue: false,
    group: 2,
  },
  [`style-personas${suffix}`]: {
    title: 'Personas',
    icon: 'https://api.dicebear.com/6.x/personas/svg?seed=JD',
    defaultValue: false,
    group: 2,
  },
  [`style-pixel-art${suffix}`]: {
    title: 'Pixel Art',
    icon: 'https://api.dicebear.com/6.x/pixel-art/svg?seed=JD',
    defaultValue: false,
    group: 2,
  },
  [`style-pixel-art-neutral${suffix}`]: {
    title: 'Pixel Art Neutral',
    icon: 'https://api.dicebear.com/6.x/pixel-art-neutral/svg?seed=JD',
    defaultValue: false,
    group: 2,
  },
  [`style-shapes${suffix}`]: {
    title: 'Shapes',
    icon: 'https://api.dicebear.com/6.x/shapes/svg?seed=JD',
    defaultValue: false,
    group: 2,
  },
  [`style-thumbs${suffix}`]: {
    title: 'Thumbs',
    icon: 'https://api.dicebear.com/6.x/thumbs/svg?seed=JD',
    defaultValue: false,
    group: 2,
  },
  [`style-ugly-avatar${suffix}`]: {
    title: 'Ugly Avatar',
    icon: 'https://cdn.jsdelivr.net/gh/utags/ugly-avatar-generated@main/svg/00/0010afd433ff844eb3da1d22515a96f8.svg',
    defaultValue: false,
    group: 2,
  },
  [`style-gfriends${suffix}`]: {
    title: 'Japan Girl Friends (NSFW)',
    icon: 'https://wsrv.nl/?url=cdn.jsdelivr.net/gh/gfriends/gfriends@master/Content/8-Honnaka/%E8%91%89%E6%9C%88%E3%81%BF%E3%82%8A%E3%81%82.jpg%3Ft%3D1644908887&w=96&h=96&dpr=2&fit=cover&a=focal&fpy=0.35&output=webp',
    defaultValue: false,
    group: 2,
  },

  [`autoReplaceAll${suffix}`]: {
    title: i('settings.autoReplaceAll'),
    defaultValue: false,
    onConfirmChange(checked: boolean) {
      if (checked) {
        return confirm(i('settings.autoReplaceAll.confirm'))
      }

      return true
    },
    group: 3,
  },

  clearData: {
    title: i('settings.clearData'),
    type: 'action',
    async onclick() {
      if (confirm(i('settings.clearData.confirm'))) {
        await clearAvatarData()
        setTimeout(() => {
          alert(i('settings.clearData.done'))
        })
      }
    },
    group: 4,
  },
}

let avatarStyleList: string[] = []
function updateAvatarStyleList() {
  avatarStyleList = allAvatarStyleList.filter((style) =>
    getSettingsValue(`style-${style}${suffix}`)
  )

  if (avatarStyleList.length === 0 && !doc.hidden) {
    setTimeout(async () => {
      alert(i('alert.needsSelectOneAavatar'))

      await saveSettingsValues({
        [`style-adventurer${suffix}`]: true,
      })

      const firstStyleOption = $(
        `.browser_extension_settings_container [data-key="style-adventurer${suffix}"]`
      )
      if (firstStyleOption) {
        firstStyleOption.scrollIntoView({ block: 'nearest' })
      }
    }, 200)
  }

  if (getSettingsValue(`style-ugly-avatar${suffix}`)) {
    setTimeout(initRamdomUglyAvatar)
  }

  if (getSettingsValue(`style-gfriends${suffix}`)) {
    setTimeout(initRamdomGfriendsAvatar)
  }
}

let lastValueOfEnableCurrentSite = true
let lastValueOfAutoReplaceAll = false
async function onSettingsChange() {
  if (getSettingsValue(`enableCurrentSite_${host}`)) {
    if (!lastValueOfEnableCurrentSite) {
      if ($('#rua_tyle')) {
        scanAvatars()
      } else {
        await main()
      }
    }
  } else if (lastValueOfEnableCurrentSite) {
    for (const element of $$('img[data-rua-org-src]') as HTMLImageElement[]) {
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
    getSettingsValue(`autoReplaceAll${suffix}`) &&
    !lastValueOfAutoReplaceAll &&
    !doc.hidden
  ) {
    lastValueOfAutoReplaceAll = true
    scanAvatars()
  }

  lastValueOfAutoReplaceAll = getSettingsValue(
    `autoReplaceAll${suffix}`
  ) as boolean

  updateAvatarStyleList()
}

function isAvatar(element: HTMLElement) {
  if (!element || element.tagName !== 'IMG') {
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
    $('#rua_container') ||
    addElement(doc.body, 'div', {
      id: 'rua_container',
    })

  const changeButton =
    $('.change_button.quick', container) ||
    addElement(container, 'button', {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      innerHTML: changeIcon,
      class: 'change_button quick',
      async onclick() {
        addClass(changeButton, 'active')
        setTimeout(() => {
          removeClass(changeButton, 'active')
        }, 200)
        const userName = currentTarget.dataset.ruaUserName || 'noname'
        const avatarUrl = getRandomAvatar(userName, avatarStyleList)
        if (avatarUrl) {
          changeAvatar(currentTarget, avatarUrl, true)
          await saveAvatar(userName, avatarUrl)
        }
      },
    })

  const changeButton2 =
    $('.change_button.advanced', container) ||
    addElement(container, 'button', {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      innerHTML: changeIcon,
      class: 'change_button advanced',
      async onclick() {
        addClass(changeButton2, 'active')
        setTimeout(() => {
          removeClass(changeButton2, 'active')
        }, 200)
        const userName = currentTarget.dataset.ruaUserName || 'noname'
        const avatarUrl = prompt(i('prompt.enterAvatarLink'), '')
        // const avatarUrl = getRandomAvatar(userName)
        if (avatarUrl) {
          changeAvatar(currentTarget, avatarUrl, true)
          await saveAvatar(userName, avatarUrl)
        }
      },
    })

  removeClass(changeButton, 'hide')
  removeClass(changeButton2, 'hide')

  const pos = getOffsetPosition(element)
  const leftOffset =
    element.clientWidth - changeButton.clientWidth > 20
      ? element.clientWidth - changeButton.clientWidth
      : element.clientWidth - 1
  changeButton.style.top = pos.top + 'px'
  changeButton.style.left = pos.left + leftOffset + 'px'

  changeButton2.style.top = pos.top + changeButton.clientHeight + 'px'
  changeButton2.style.left = pos.left + leftOffset + 'px'

  const mouseoutHandler = () => {
    addClass(changeButton, 'hide')
    addClass(changeButton2, 'hide')
    removeEventListener(element, 'mouseout', mouseoutHandler)
  }

  addEventListener(element, 'mouseout', mouseoutHandler)
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
    // The original image has finished loading or an error has occurred
    if (element.src !== src) {
      return
    }

    element.ruaLoading = false
    removeClass(element, 'rua_fadeout')
    removeEventListener(element, 'load', imgOnloadHandler)
    removeEventListener(element, 'error', imgOnloadHandler)
  }

  // const width = element.clientWidth
  // const height = element.clientHeight
  // if (width > 1) {
  //   element.style.width = width + "px"
  //   element.style.height = width + "px"
  // }

  // if (height > 1 && width === 0) {
  //   element.style.height = height + "px"
  //   element.style.width = height + "px"
  //   // element.style.height = "unset"
  //   // element.style.maxHeight = "unset"
  // }

  if (animation) {
    addClass(element, 'rua_fadeout')
  } else {
    // white image placeholder, to cancel loading original images
    element.src =
      'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
  }

  addEventListener(element, 'load', imgOnloadHandler)
  addEventListener(element, 'error', imgOnloadHandler)

  element.src = src
  // setTimeout(() => {
  //   element.src = src
  // }, 100)
  // if (element.dataset.src) {
  //   /* v2hot */
  //   element.dataset.src = src
  // }
}

const scanAvatars = throttle(async () => {
  if (doc.hidden || !getSettingsValue(`enableCurrentSite_${host}`)) {
    return
  }

  const newValues = {}
  // console.log("scanAvatars", lastValueOfAutoReplaceAll, new Date())
  const avatars = currentSite.getAvatarElements()
  for (const avatar of avatars) {
    let userName: string | undefined = avatar.dataset.ruaUserName
    if (!userName) {
      userName = currentSite.getUserName(avatar)
      if (!userName) {
        console.error("Can't get username", avatar, userName)
        continue
      }

      // console.log(avatar, userName)
      avatar.dataset.ruaUserName = userName

      // Use lazy loading, because of th API limit the number of requests per second to 50
      setAttributes(avatar, {
        loading: 'lazy',
        decoding: 'async',
        referrerpolicy: 'no-referrer',
        rel: 'noreferrer',
      })
    }

    const newAvatarSrc = getChangedAavatar(userName)
    if (newAvatarSrc && avatar.src !== newAvatarSrc) {
      // console.log("change", userName)
      // console.log(avatar)
      changeAvatar(avatar, newAvatarSrc)
    } else if (!newAvatarSrc) {
      if (avatar.dataset.ruaOrgSrc && avatar.src !== avatar.dataset.ruaOrgSrc) {
        avatar.src = avatar.dataset.ruaOrgSrc
      }

      if (lastValueOfAutoReplaceAll && Object.keys(newValues).length < 3) {
        // console.log("replace", userName)
        const avatarUrl = getRandomAvatar(userName, avatarStyleList)
        if (avatarUrl) {
          newValues[userName] = avatarUrl
        } else {
          // Not ready, try later
          setTimeout(scanAvatars, 100)
        }
      }
    }
  }

  if (lastValueOfAutoReplaceAll && Object.keys(newValues).length > 0) {
    await saveAvatars(newValues)
  }
}, 300)

async function main() {
  await runOnce('main', async () => {
    await initSettings({
      id: 'replace-ugly-avatars',
      title: i('settings.title'),
      footer: `
    <p>${i('settings.information')}</p>
    <p>
    <a href="https://github.com/utags/replace-ugly-avatars/issues" target="_blank">
    ${i('settings.report')}
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
  })

  lastValueOfEnableCurrentSite = getSettingsValue(
    `enableCurrentSite_${host}`
  ) as boolean
  lastValueOfAutoReplaceAll = getSettingsValue(
    `autoReplaceAll${suffix}`
  ) as boolean

  if (!getSettingsValue(`enableCurrentSite_${host}`)) {
    return
  }

  updateAvatarStyleList()

  runWhenHeadExists(() => {
    addElement('style', {
      textContent: styleText,
      id: 'rua_tyle',
    })
  })

  addEventListener(doc, 'mouseover', (event: Event) => {
    const target = event.target as HTMLElement
    if (!isAvatar(target)) {
      return
    }

    // console.log(target)
    addChangeButton(target as HTMLImageElement)
  })

  addEventListener(doc, 'visibilitychange', () => {
    if (!doc.hidden) {
      scanAvatars()
    }
  })

  await initStorage({
    avatarValueChangeListener() {
      scanAvatars()
    },
  })

  if ($('img')) {
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

runWhenHeadExists(async () => {
  if (doc.documentElement.dataset.replaceUglyAvatars === undefined) {
    doc.documentElement.dataset.replaceUglyAvatars = `${host}`
    await main()
  }
})
