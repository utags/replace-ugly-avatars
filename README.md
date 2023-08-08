# Replace Ugly Avatars | 赐你个头像吧

![avatar](https://api.dicebear.com/6.x/adventurer/svg?seed=RUA&size=48&backgroundColor=b6e3f4) ![avatar](https://api.dicebear.com/6.x/big-ears-neutral/svg?seed=RUA&size=48&backgroundColor=c0aede) ![avatar](https://api.dicebear.com/6.x/bottts-neutral/svg?seed=RUA&size=48) ![avatar](https://api.dicebear.com/6.x/croodles-neutral/svg?seed=RUA&size=48&backgroundColor=ffd5dc) ![avatar](https://api.dicebear.com/6.x/micah/svg?seed=RUA&size=48&backgroundColor=ffdfbf)

🔃 Replace specified user's avatar (profile photo) and username (nickname).

🔃 换掉别人的头像与昵称。

## 应用场景

这个脚本可能有以下几种应用场景。

- 看到某人的头像 🤡 感到不适，给他换一个人畜无害的头像 🥸
- 看到某人的言论总是很白痴、很恶心，给他一个 🐷 猪头头像，下次看到直接跳过
- 到哪里都能看到某些摸鱼王，由于太眼熟，注意力不知不觉地总落在他那里。换个头像，强制产生陌生感，分散注意力
- 某些平台一堆 momo 头像，政治关联的头像。给它们换个随机头像，不受它们的干扰 （其他网站后续会支持）
- 强迫症，把所有人都换成统一风格的头像 （批量自动替换的功能后续推出）
- 无聊时，消磨时间，头像换呀换呀换 🔃

![screenshots](./assets/replace-ugly-avatars-screenshots.gif)

## Installation

- Chrome Extension: [Manual Installation](manual-installation.md)
- Edge Extension: [Manual Installation](manual-installation.md)
- Firefox Addon: [Manual Installation](manual-installation.md)
- Userscript: [https://greasyfork.org/scripts/472616-replace-ugly-avatars](https://greasyfork.org/scripts/472616-replace-ugly-avatars)

## Avatar Source

We use [DiceBear](https://www.dicebear.com/)'s API to generate random avatars. Thanks to the [DiceBear](https://github.com/dicebear/dicebear) project and [designers](https://www.dicebear.com/licenses) for the great works.

## Release Notes

- 0.1.0
  - Add settings, add enable option, add clear data option
- 0.0.6
  - Add more random parameters
- 0.0.5
  - Add image change animation, convert username to lowercase
- 0.0.1
  - Change the avatars on [V2EX](https://wwww.v2ex.com)

## Development

This extension/userscript is built from [Browser Extension Starter and Userscript Starter](https://github.com/utags/browser-extension-starter)

## Features

- One codebase for Chrome extesions, Firefox addons, Userscripts, Bookmarklets and simple JavaScript modules
- Live-reload and React HMR
- [Plasmo](https://www.plasmo.com/) - The Browser Extension Framework
- [esbuild](https://esbuild.github.io/) - Bundler
- React
- TypeScript
- [Prettier](https://github.com/prettier/prettier) - Code Formatter
- [XO](https://github.com/xojs/xo) - JavaScript/TypeScript linter

## Showcases

- [🏷️ UTags - Add usertags to links](https://github.com/utags/utags) - Allow users to add custom tags to links.
- [🔗 Links Helper](https://github.com/utags/links-helper) - Open external links in a new tab, open internal links matching the specified rules in a new tab, convert text to hyperlinks, convert image links to image tags, parse Markdown style links and image tags, parse BBCode style links and image tags

## How To Make A New Extension

1. Fork [this starter repo](https://github.com/utags/browser-extension-starter), and rename repo to your extension name

2. Clone your repo

3. Install dependencies

```bash
pnpm install
# or
npm install
```

## Getting Started

First, run the development server:

```bash
pnpm dev
# or
npm run dev
```

Open your browser and load the appropriate development build. For example, if you are developing for the chrome browser, using manifest v3, use: `build/chrome-mv3-dev`.

You can start editing the popup by modifying `popup.tsx`. It should auto-update as you make changes. To add an options page, simply add a `options.tsx` file to the root of the project, with a react component default exported. Likewise to add a content page, add a `content.ts` file to the root of the project, importing some module and do some logic, then reload the extension on your browser.

For further guidance, [visit our Documentation](https://docs.plasmo.com/)

## Making production build

Run the following:

```bash
pnpm build
# or
npm run build
```

This should create a production bundle for your extension, ready to be zipped and published to the stores.

## Submit to the webstores

The easiest way to deploy your Plasmo extension is to use the built-in [bpp](https://bpp.browser.market) GitHub action. Prior to using this action however, make sure to build your extension and upload the first version to the store to establish the basic credentials. Then, simply follow [this setup instruction](https://docs.plasmo.com/framework/workflows/submit) and you should be on your way for automated submission!

## License

Copyright (c) 2023 [Pipecraft](https://www.pipecraft.net). Licensed under the [MIT License](LICENSE).

## >\_

[![Pipecraft](https://img.shields.io/badge/site-pipecraft-brightgreen)](https://www.pipecraft.net)
[![UTags](https://img.shields.io/badge/site-UTags-brightgreen)](https://utags.pipecraft.net)
[![DTO](https://img.shields.io/badge/site-DTO-brightgreen)](https://dto.pipecraft.net)
[![BestXTools](https://img.shields.io/badge/site-bestxtools-brightgreen)](https://www.bestxtools.com)
