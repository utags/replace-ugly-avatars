// Fetch from https://github.com/utags/ugly-avatar-generated

import { getValue, setValue } from 'browser-extension-storage'
import { sleep } from 'browser-extension-utils'

import { getRandomInt } from '../utils'

let cachedData: string[]

export function getRamdomAvatar() {
  if (cachedData && cachedData.length > 0) {
    const avatar = cachedData[getRandomInt(0, cachedData.length)]
    return `https://cdn.jsdelivr.net/gh/utags/ugly-avatar-generated@main/${avatar}`
  }

  setTimeout(initRamdomAvatar)
}

let retryCount = 0
async function fetchRamdomAvatar() {
  const url = `https://cdn.jsdelivr.net/gh/utags/random-avatars@2025021816/public/ugly-avatar/ugly-avatar-${getRandomInt(
    1,
    11
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
      return fetchRamdomAvatar()
    }
  }
}

const storageKey = 'uglyAvatarData'
export async function initRamdomAvatar() {
  if (cachedData && cachedData.length > 0) {
    return
  }

  // console.log("initRamdomAvatar")
  cachedData = await getValue(storageKey)
  if (cachedData) {
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
