// ==UserScript==
// @name                 Replace Ugly Avatars
// @name:zh-CN           赐你个头像吧
// @namespace            https://github.com/utags/replace-ugly-avatars
// @homepageURL          https://github.com/utags/replace-ugly-avatars#readme
// @supportURL           https://github.com/utags/replace-ugly-avatars/issues
// @version              0.0.1
// @description          Replace specified user's avatar (profile photo) and username (nickname)
// @description:zh-CN    换掉别人的头像与昵称
// @icon                 data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%230d6efd' class='bi bi-arrow-repeat' viewBox='0 0 16 16'%3E %3Cpath d='M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z'/%3E %3Cpath fill-rule='evenodd' d='M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z'/%3E %3C/svg%3E
// @author               Pipecraft
// @license              MIT
// @match                https://*.v2ex.com/*
// @match                https://v2hot.pipecraft.net/*
// @run-at               document-start
// @grant                GM_addElement
// @grant                GM.getValue
// @grant                GM.setValue
// @grant                GM_addValueChangeListener
// @grant                GM_removeValueChangeListener
// ==/UserScript==
//
;(() => {
  "use strict"
  var doc = document
  if (typeof String.prototype.replaceAll !== "function") {
    String.prototype.replaceAll = String.prototype.replace
  }
  var $ = (selectors, element) => (element || doc).querySelector(selectors)
  var $$ = (selectors, element) => [
    ...(element || doc).querySelectorAll(selectors),
  ]
  var getRootElement = (type) =>
    type === 1
      ? doc.head || doc.body || doc.documentElement
      : type === 2
      ? doc.body || doc.documentElement
      : doc.documentElement
  var createElement = (tagName, attributes) =>
    setAttributes(doc.createElement(tagName), attributes)
  var addElement = (parentNode, tagName, attributes) => {
    if (typeof parentNode === "string") {
      return addElement(null, parentNode, tagName)
    }
    if (!tagName) {
      return
    }
    if (!parentNode) {
      parentNode = /^(script|link|style|meta)$/.test(tagName)
        ? getRootElement(1)
        : getRootElement(2)
    }
    if (typeof tagName === "string") {
      const element = createElement(tagName, attributes)
      parentNode.append(element)
      return element
    }
    setAttributes(tagName, attributes)
    parentNode.append(tagName)
    return tagName
  }
  var addEventListener = (element, type, listener, options) => {
    if (!element) {
      return
    }
    if (typeof type === "object") {
      for (const type1 in type) {
        if (Object.hasOwn(type, type1)) {
          element.addEventListener(type1, type[type1])
        }
      }
    } else if (typeof type === "string" && typeof listener === "function") {
      element.addEventListener(type, listener, options)
    }
  }
  var removeEventListener = (element, type, listener, options) => {
    if (!element) {
      return
    }
    if (typeof type === "object") {
      for (const type1 in type) {
        if (Object.hasOwn(type, type1)) {
          element.removeEventListener(type1, type[type1])
        }
      }
    } else if (typeof type === "string" && typeof listener === "function") {
      element.removeEventListener(type, listener, options)
    }
  }
  var setAttribute = (element, name, value) =>
    element ? element.setAttribute(name, value) : void 0
  var setAttributes = (element, attributes) => {
    if (element && attributes) {
      for (const name in attributes) {
        if (Object.hasOwn(attributes, name)) {
          const value = attributes[name]
          if (value === void 0) {
            continue
          }
          if (/^(value|textContent|innerText)$/.test(name)) {
            element[name] = value
          } else if (/^(innerHTML)$/.test(name)) {
            element[name] = createHTML(value)
          } else if (name === "style") {
            setStyle(element, value, true)
          } else if (/on\w+/.test(name)) {
            const type = name.slice(2)
            addEventListener(element, type, value)
          } else {
            setAttribute(element, name, value)
          }
        }
      }
    }
    return element
  }
  var addClass = (element, className) => {
    if (!element || !element.classList) {
      return
    }
    element.classList.add(className)
  }
  var removeClass = (element, className) => {
    if (!element || !element.classList) {
      return
    }
    element.classList.remove(className)
  }
  var setStyle = (element, values, overwrite) => {
    if (!element) {
      return
    }
    const style = element.style
    if (typeof values === "string") {
      style.cssText = overwrite ? values : style.cssText + ";" + values
      return
    }
    if (overwrite) {
      style.cssText = ""
    }
    for (const key in values) {
      if (Object.hasOwn(values, key)) {
        style[key] = values[key].replace("!important", "")
      }
    }
  }
  var throttle = (func, interval) => {
    let timeoutId = null
    let next = false
    const handler = (...args) => {
      if (timeoutId) {
        next = true
      } else {
        func.apply(void 0, args)
        timeoutId = setTimeout(() => {
          timeoutId = null
          if (next) {
            next = false
            handler()
          }
        }, interval)
      }
    }
    return handler
  }
  if (typeof Object.hasOwn !== "function") {
    Object.hasOwn = (instance, prop) =>
      Object.prototype.hasOwnProperty.call(instance, prop)
  }
  var getOffsetPosition = (element, referElement) => {
    const position = { top: 0, left: 0 }
    referElement = referElement || doc.body
    while (element && element !== referElement) {
      position.top += element.offsetTop
      position.left += element.offsetLeft
      element = element.offsetParent
    }
    return position
  }
  var escapeHTMLPolicy =
    typeof trustedTypes !== "undefined" &&
    typeof trustedTypes.createPolicy === "function"
      ? trustedTypes.createPolicy("beuEscapePolicy", {
          createHTML: (string) => string,
        })
      : void 0
  var createHTML = (html) => {
    return escapeHTMLPolicy ? escapeHTMLPolicy.createHTML(html) : html
  }
  var addElement2 =
    typeof GM_addElement === "function"
      ? (parentNode, tagName, attributes) => {
          if (typeof parentNode === "string") {
            return addElement2(null, parentNode, tagName)
          }
          if (!tagName) {
            return
          }
          if (!parentNode) {
            parentNode = /^(script|link|style|meta)$/.test(tagName)
              ? getRootElement(1)
              : getRootElement(2)
          }
          if (typeof tagName === "string") {
            let attributes2
            if (attributes) {
              const entries1 = []
              const entries2 = []
              for (const entry of Object.entries(attributes)) {
                if (/^(on\w+|innerHTML)$/.test(entry[0])) {
                  entries2.push(entry)
                } else {
                  entries1.push(entry)
                }
              }
              attributes = Object.fromEntries(entries1)
              attributes2 = Object.fromEntries(entries2)
            }
            const element = GM_addElement(null, tagName, attributes)
            setAttributes(element, attributes2)
            parentNode.append(element)
            return element
          }
          setAttributes(tagName, attributes)
          parentNode.append(tagName)
          return tagName
        }
      : addElement
  var content_default =
    "#rua_container .change_button{position:absolute;box-sizing:border-box;width:20px;height:20px;padding:1px;border:1px solid;cursor:pointer;color:#0d6efd}#rua_container .change_button.advanced{color:#00008b;display:none}#rua_container .change_button.hide{display:none}#rua_container .change_button:active,#rua_container .change_button.active{opacity:50%;transition:all .2s}#rua_container:hover .change_button{display:block}#Main .header .fr a img{width:73px;height:73px}"
  var styles = [
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
  ]
  function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
  }
  function getRandomAvatar(prefix) {
    const randomStyle = styles[getRandomInt(0, styles.length)]
    return "https://api.dicebear.com/6.x/"
      .concat(randomStyle, "/svg?seed=")
      .concat(prefix, ".")
      .concat(Date.now())
  }
  var changeIcon =
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-repeat" viewBox="0 0 16 16">\n<path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>\n<path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>\n</svg>'
  var listeners = {}
  var getValue = async (key) => {
    const value = await GM.getValue(key)
    return value && value !== "undefined" ? JSON.parse(value) : void 0
  }
  var setValue = async (key, value) => {
    if (value !== void 0) {
      const newValue = JSON.stringify(value)
      if (listeners[key]) {
        const oldValue = await GM.getValue(key)
        await GM.setValue(key, newValue)
        if (newValue !== oldValue) {
          for (const func of listeners[key]) {
            func(key, oldValue, newValue)
          }
        }
      } else {
        await GM.setValue(key, newValue)
      }
    }
  }
  var _addValueChangeListener = (key, func) => {
    listeners[key] = listeners[key] || []
    listeners[key].push(func)
    return () => {
      if (listeners[key] && listeners[key].length > 0) {
        for (let i = listeners[key].length - 1; i >= 0; i--) {
          if (listeners[key][i] === func) {
            listeners[key].splice(i, 1)
          }
        }
      }
    }
  }
  var addValueChangeListener = (key, func) => {
    if (typeof GM_addValueChangeListener !== "function") {
      console.warn("Do not support GM_addValueChangeListener!")
      return _addValueChangeListener(key, func)
    }
    const listenerId = GM_addValueChangeListener(key, func)
    return () => {
      GM_removeValueChangeListener(listenerId)
    }
  }
  var host = location.host
  var storageKey = "avatar:v2ex.com"
  async function saveAvatar(userName, src) {
    const values = (await getValue(storageKey)) || {}
    values[userName] = src
    await setValue(storageKey, values)
  }
  var cachedValues = {}
  async function reloadCachedValues() {
    cachedValues = (await getValue(storageKey)) || {}
  }
  function getChangedAavatar(userName) {
    return cachedValues[userName]
  }
  async function initStorage(options) {
    addValueChangeListener(storageKey, async () => {
      await reloadCachedValues()
      if (options && typeof options.avatarValueChangeListener === "function") {
        options.avatarValueChangeListener()
      }
    })
    await reloadCachedValues()
  }
  function isAvatar(element) {
    if (!element || element.tagName !== "IMG") {
      return false
    }
    if (element.dataset.ruaUserName) {
      return true
    }
    return false
  }
  var currentTarget
  function addChangeButton(element) {
    currentTarget = element
    const container =
      $("#rua_container") ||
      addElement2(doc.body, "div", {
        id: "rua_container",
      })
    const changeButton =
      $(".change_button.quick", container) ||
      addElement2(container, "button", {
        innerHTML: changeIcon,
        class: "change_button quick",
        async onclick() {
          addClass(changeButton, "active")
          setTimeout(() => {
            removeClass(changeButton, "active")
          }, 200)
          const userName = currentTarget.dataset.ruaUserName || "noname"
          const avatarUrl = getRandomAvatar(userName)
          changeAvatar(currentTarget, avatarUrl)
          await saveAvatar(userName, avatarUrl)
        },
      })
    const changeButton2 =
      $(".change_button.advanced", container) ||
      addElement2(container, "button", {
        innerHTML: changeIcon,
        class: "change_button advanced",
        async onclick() {
          addClass(changeButton2, "active")
          setTimeout(() => {
            removeClass(changeButton2, "active")
          }, 200)
          const userName = currentTarget.dataset.ruaUserName || "noname"
          const avatarUrl = prompt(
            "\u8BF7\u8F93\u5165\u5934\u50CF\u94FE\u63A5",
            ""
          )
          if (avatarUrl) {
            changeAvatar(currentTarget, avatarUrl)
            await saveAvatar(userName, avatarUrl)
          }
        },
      })
    removeClass(changeButton, "hide")
    removeClass(changeButton2, "hide")
    const pos = getOffsetPosition(element)
    changeButton.style.top = pos.top + "px"
    changeButton.style.left =
      pos.left + element.clientWidth - changeButton.clientWidth + "px"
    changeButton2.style.top = pos.top + changeButton.clientHeight + "px"
    changeButton2.style.left =
      pos.left + element.clientWidth - changeButton.clientWidth + "px"
    const mouseoutHandler = () => {
      addClass(changeButton, "hide")
      addClass(changeButton2, "hide")
      removeEventListener(element, "mouseout", mouseoutHandler)
    }
    addEventListener(element, "mouseout", mouseoutHandler)
  }
  function getUserName(element) {
    if (!element) {
      return
    }
    const userNameElement = $('a[href*="/member/"]', element)
    if (userNameElement) {
      return (/member\/(\w+)/.exec(userNameElement.href) || [])[1]
    }
    return getUserName(element.parentElement)
  }
  function changeAvatar(element, src) {
    if (!element.dataset.orgSrc) {
      const orgSrc = element.dataset.src || element.src
      element.dataset.orgSrc = orgSrc
    }
    element.src = src
    if (element.dataset.src) {
      element.dataset.src = src
    }
  }
  function scanAvatars() {
    const avatars = $$('.avatar,a[href*="/member/"] img')
    for (const avatar of avatars) {
      let userName = avatar.dataset.ruaUserName
      if (!userName) {
        userName = getUserName(avatar)
        if (!userName) {
          console.error("Can't get username", avatar, userName)
          continue
        }
        avatar.dataset.ruaUserName = userName
      }
      const newAvatarSrc = getChangedAavatar(userName)
      if (newAvatarSrc && avatar.src !== newAvatarSrc) {
        changeAvatar(avatar, newAvatarSrc)
      }
    }
  }
  async function main() {
    if ($("#rua_tyle")) {
      return
    }
    addElement2("style", {
      textContent: content_default,
      id: "rua_tyle",
    })
    addEventListener(doc, "mouseover", (event) => {
      const target = event.target
      if (!isAvatar(target)) {
        return
      }
      addChangeButton(target)
    })
    await initStorage({
      avatarValueChangeListener() {
        scanAvatars()
      },
    })
    scanAvatars()
    const observer = new MutationObserver(
      throttle(async () => {
        scanAvatars()
      }, 500)
    )
    observer.observe(doc, {
      childList: true,
      subtree: true,
    })
  }
  main()
})()
