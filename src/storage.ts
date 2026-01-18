import {
  addValueChangeListener,
  deleteValue,
  getValue,
  setValue,
} from 'browser-extension-storage'

const host = location.host
const storageKey = host.includes('v2ex') ? 'avatar:v2ex.com' : `avatar:${host}`

export async function saveAvatar(userName: string, src: string) {
  const values = (await getValue(storageKey)) || {}
  values[userName] = src
  await setValue(storageKey, values)
}

export async function removeAvatar(userName: string) {
  const values = (await getValue(storageKey)) || {}
  const newValues: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(values)) {
    if (key !== userName) {
      newValues[key] = value
    }
  }

  await setValue(storageKey, newValues)
}

export async function saveAvatars(newValues: Record<string, unknown>) {
  let values = (await getValue(storageKey)) || {}
  values = Object.assign(values, newValues)
  await setValue(storageKey, values)
}

export async function clearAvatarData() {
  await deleteValue(storageKey)
}

let cachedValues = {}
async function reloadCachedValues() {
  cachedValues = (await getValue(storageKey)) || {}
}

export function getChangedAavatar(userName: string) {
  return cachedValues[userName] as string | undefined
}

export async function initStorage(options?: Record<string, unknown>) {
  await addValueChangeListener(storageKey, async () => {
    await reloadCachedValues()
    if (options && typeof options.avatarValueChangeListener === 'function') {
      options.avatarValueChangeListener()
    }
  })
  await reloadCachedValues()
  console.log(
    'The number of avatars that have been replaced:',
    Object.keys(cachedValues).length
  )
}
