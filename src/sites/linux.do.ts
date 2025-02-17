import { $$, getAttribute } from "browser-extension-utils"

const site = {
  matches: /^linux\.do$/,
  getAvatarElements() {
    return $$(
      'img[src^="https://linux.do/user_avatar/linux.do/"],img[src^="/user_avatar/linux.do/"],img[src^="https://linux.do/letter_avatar_proxy/"],img[src^="/letter_avatar_proxy/"],img[data-rua-org-src]'
    ) as HTMLImageElement[]
  },
  getUserName(element: HTMLElement) {
    const src =
      getAttribute(element, "data-rua-org-src") || getAttribute(element, "src")
    if (!src) {
      return
    }

    // https://linux.do/letter_avatar_proxy/v4/letter/p/a9a28c/48.png
    if (src.includes("letter_avatar_proxy")) {
      const name = src.replace(
        /.*\/letter_avatar_proxy\/v4\/letter\/(\w\/[^/]+)\/.*/,
        "$1"
      )
      return name.toLowerCase()
    }

    const name = src.replace(/.*\/user_avatar\/linux\.do\/([^/]+)\/.*/, "$1")
    return name.toLowerCase()
  },
}

export default site
