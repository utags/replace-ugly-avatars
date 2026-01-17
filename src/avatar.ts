import { getRamdomAvatar as getRamdomGfriendsAvatar } from './modules/gfriends'
import { getRamdomAvatar as getRamdomUglyAvatar } from './modules/ugly-avatar'
import { getRandomInt } from './utils'

const styles = [
  'adventurer',
  'adventurer-neutral',
  'avataaars',
  'avataaars-neutral',
  'big-ears',
  'big-ears-neutral',
  'big-smile',
  'bottts',
  'bottts-neutral',
  'croodles',
  'croodles-neutral',
  'fun-emoji',
  'icons',
  'identicon',
  'initials',
  'lorelei',
  'lorelei-neutral',
  'micah',
  'miniavs',
  'notionists',
  'notionists-neutral',
  'open-peeps',
  'personas',
  'pixel-art',
  'pixel-art-neutral',
  'shapes',
  'thumbs',
  'ugly-avatar',
  'gfriends',
]

export const allAvatarStyleList = styles

function getRandomFlipParameter(style?: string) {
  if (style === 'initials' || style === 'identicon') {
    return ''
  }

  const values = [false, false, false, false, true]
  const value = values[getRandomInt(0, values.length)]
  return value ? '&flip=true' : ''
}

function getRandomRadiusParameter(style?: string) {
  const values = [0, 0, 0, 10, 10, 10, 20, 20, 30, 50]
  const value = values[getRandomInt(0, values.length)]
  return value ? '&radius=' + value : ''
}

function getRandomBackgroundColorParameter(style?: string) {
  const values = [
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    'ffffff',
    'b6e3f4',
    'c0aede',
    'd1d4f9',
    'ffd5dc',
    'ffdfbf',
  ]
  let value = values[getRandomInt(0, values.length)]
  if ((style === 'initials' || style === 'icons') && value === 'ffffff') {
    value = ''
  }

  return value ? '&backgroundColor=' + value : ''
}

export function getRandomAvatar(prefix: string, styleList?: string[]) {
  const styles =
    !styleList || styleList.length === 0 ? allAvatarStyleList : styleList
  const randomStyle = styles[getRandomInt(0, styles.length)]
  if (randomStyle === 'ugly-avatar') {
    return getRamdomUglyAvatar()
  }

  if (randomStyle === 'gfriends') {
    return getRamdomGfriendsAvatar()
  }

  return (
    `https://api.dicebear.com/6.x/${randomStyle}/svg?seed=${prefix}.${Date.now()}` +
    getRandomFlipParameter(randomStyle) +
    getRandomRadiusParameter(randomStyle) +
    getRandomBackgroundColorParameter(randomStyle)
  )
}
