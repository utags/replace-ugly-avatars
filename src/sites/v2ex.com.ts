import { $, $$ } from 'browser-extension-utils'

const site = {
  matches: /v2ex\.com$|^v2hot\.|v2ex\.co$/,
  getAvatarElements() {
    return $$(`.avatar,a[href*="/member/"] img`) as HTMLImageElement[]
  },
  getUserName,
}

function getUserName(element: HTMLElement): string | undefined {
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

export default site
