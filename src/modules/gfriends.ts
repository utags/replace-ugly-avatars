// Fetch from https://github.com/gfriends/gfriends

import { getValue, setValue } from 'browser-extension-storage'
import { sleep } from 'browser-extension-utils'

import { getRandomInt } from '../utils'

let cachedData: string[]

export function getRamdomAvatar() {
  if (cachedData && cachedData.length > 0) {
    let avatar = cachedData[getRandomInt(0, cachedData.length)]
    avatar = encodeURIComponent(avatar).replaceAll('%2F', '/')
    // return `https://cdn.jsdelivr.net/gh/gfriends/gfriends@master/Content/${avatar.replaceAll("%3Ft%3D", "?t=")}`
    return `https://wsrv.nl/?url=cdn.jsdelivr.net/gh/gfriends/gfriends@master/Content/${avatar}&w=96&h=96&dpr=2&fit=cover&a=focal&fpy=0.35&output=webp`
  }

  setTimeout(initRamdomAvatar)
}

let retryCount = 0
async function fetchRamdomAvatar(): Promise<string[] | undefined> {
  const url = `https://cdn.jsdelivr.net/gh/utags/random-avatars@2025021816/public/gfriends-${getRandomInt(
    1,
    101
  )}.json`
  try {
    const response = await fetch(url)

    if (response.status === 200) {
      return (await response.json()) as string[]
    }
  } catch (error) {
    console.error(error)
    retryCount++
    if (retryCount < 3) {
      await sleep(1000)
      const data = await fetchRamdomAvatar()
      return data
    }
  }
}

const storageKey = 'gfriendsData'
export async function initRamdomAvatar() {
  if (cachedData && cachedData.length > 0) {
    return
  }

  // console.log("initRamdomAvatar")
  const data = await getValue<string[]>(storageKey)
  if (data && Array.isArray(data) && data.length > 0) {
    cachedData = data
    setTimeout(async () => {
      const data = await fetchRamdomAvatar()
      if (data) {
        await setValue(storageKey, data)
      }
    }, 1000 * 60)
  } else {
    const data = await fetchRamdomAvatar()
    if (data) {
      cachedData = data
      await setValue(storageKey, data)
    }
  }
}
