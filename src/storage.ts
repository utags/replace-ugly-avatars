import {
  addValueChangeListener,
  getValue,
  setValue,
} from "browser-extension-storage"

const host = location.host
const storageKey = "avatar:v2ex.com"

export async function saveAvatar(userName: string, src: string) {
  const values = (await getValue(storageKey)) || {}
  values[userName] = src
  await setValue(storageKey, values)
}

let cachedValues = {}
async function reloadCachedValues() {
  cachedValues = (await getValue(storageKey)) || {}
}

export function getChangedAavatar(userName: string) {
  return cachedValues[userName] as string | undefined
}

export async function initStorage(options?: Record<string, unknown>) {
  addValueChangeListener(storageKey, async () => {
    await reloadCachedValues()
    if (options && typeof options.avatarValueChangeListener === "function") {
      options.avatarValueChangeListener()
    }
  })
  await reloadCachedValues()
}
