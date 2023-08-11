import { getValue, setValue } from "browser-extension-storage"
import { sleep } from "browser-extension-utils"

const styles = [
  "adventurer",
  "adventurer-neutral",
  "avataaars",
  "avataaars-neutral",
  "big-ears",
  "big-ears-neutral",
  "big-smile",
  "bottts",
  "bottts-neutral",
  "croodles",
  "croodles-neutral",
  "fun-emoji",
  "icons",
  "identicon",
  "initials",
  "lorelei",
  "lorelei-neutral",
  "micah",
  "miniavs",
  "notionists",
  "notionists-neutral",
  "open-peeps",
  "personas",
  "pixel-art",
  "pixel-art-neutral",
  "shapes",
  "thumbs",
  "gfriends",
]

export const allAvatarStyleList = styles

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min // 不含最大值，含最小值
}

function getRandomFlipParameter(style?: string) {
  if (style === "initials" || style === "identicon") {
    return ""
  }

  const values = [false, false, false, false, true]
  const value = values[getRandomInt(0, values.length)]
  return value ? "&flip=true" : ""
}

function getRandomRadiusParameter(style?: string) {
  const values = [0, 0, 0, 10, 10, 10, 20, 20, 30, 50]
  const value = values[getRandomInt(0, values.length)]
  return value ? "&radius=" + value : ""
}

function getRandomBackgroundColorParameter(style?: string) {
  const values = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "ffffff",
    "b6e3f4",
    "c0aede",
    "d1d4f9",
    "ffd5dc",
    "ffdfbf",
  ]
  const value = values[getRandomInt(0, values.length)]
  return value ? "&backgroundColor=" + value : ""
}

let cachedGfirendsData: string[]

function getRamdomGfirendsAvatar() {
  if (cachedGfirendsData && cachedGfirendsData.length > 0) {
    let avatar = cachedGfirendsData[getRandomInt(0, cachedGfirendsData.length)]
    avatar = encodeURIComponent(avatar).replaceAll("%2F", "/")
    // return `https://cdn.jsdelivr.net/gh/gfriends/gfriends@master/Content/${avatar.replaceAll("%3Ft%3D", "?t=")}`
    return `https://wsrv.nl/?url=cdn.jsdelivr.net/gh/gfriends/gfriends@master/Content/${avatar}&w=96&h=96&dpr=2&fit=cover&a=focal&fpy=0.35&output=webp`
  }

  setTimeout(initRamdomGfirendsAvatar)
}

let retryCount = 0
async function fetchRamdomGfirendsAvatar() {
  const url = `https://cdn.jsdelivr.net/gh/utags/random-avatars@main/public/gfriends-${getRandomInt(
    1,
    101
  )}.json`
  try {
    const response = await fetch(url)

    if (response.status === 200) {
      return await response.json()
    }
  } catch (error) {
    console.error(error)
    retryCount++
    if (retryCount < 3) {
      await sleep(1000)
      return fetchRamdomGfirendsAvatar() as Promise<string>
    }
  }
}

const gfriendsStorageKey = "gfriendsData"
export async function initRamdomGfirendsAvatar() {
  if (cachedGfirendsData) {
    return
  }

  // console.log("initRamdomGfirendsAvatar")
  cachedGfirendsData = await getValue(gfriendsStorageKey)
  if (cachedGfirendsData) {
    setTimeout(async () => {
      const data = await fetchRamdomGfirendsAvatar()
      if (data) {
        await setValue(gfriendsStorageKey, data)
      }
    }, 1000 * 60)
  } else {
    const data = await fetchRamdomGfirendsAvatar()
    if (data) {
      cachedGfirendsData = data
      await setValue(gfriendsStorageKey, data)
    }
  }
}

export function getRandomAvatar(prefix: string, styleList?: string[]) {
  const styles =
    !styleList || styleList.length === 0 ? allAvatarStyleList : styleList
  const randomStyle = styles[getRandomInt(0, styles.length)]
  if (randomStyle === "gfriends") {
    return getRamdomGfirendsAvatar()
  }

  return (
    `https://api.dicebear.com/6.x/${randomStyle}/svg?seed=${prefix}.${Date.now()}` +
    getRandomFlipParameter(randomStyle) +
    getRandomRadiusParameter(randomStyle) +
    getRandomBackgroundColorParameter(randomStyle)
  )
}
