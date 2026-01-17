import linux_do from './linux.do'
import v2ex_com from './v2ex.com'

type Site = {
  matches: RegExp
  getAvatarElements: () => HTMLImageElement[]
  getUserName: (element: HTMLElement) => string | undefined
}

const sites: Site[] = [
  //
  v2ex_com,
  linux_do,
]

const defaultSite = {
  matches: /.*/,
  getAvatarElements() {
    return []
  },
  getUserName(element: HTMLElement) {
    return ''
  },
}

function matchedSite(hostname: string) {
  for (const s of sites) {
    if (s.matches.test(hostname)) {
      return s
    }
  }

  return defaultSite
}

const hostname = location.hostname
export const currentSite: Site = matchedSite(hostname)
