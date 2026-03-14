# AI Travel Guide

This project is an AI guide hub built with Cloudflare Workers and Durable Objects.
https://aitravelguide.jiachanli910.workers.dev/

## What changed in this version

- Keeps the AI chat box as the main interface.
- Connects the chat to your two travel websites.
- Opens the Boston guide and aquarium guide in separate pages from clickable chat options.
- Uses a simple structured response format: `message + options + action`.
- Fixes the broken `package.json` so the project can be installed and deployed normally.

## Connected site routes in this repo

These external site folders are now bundled into `public/sites` so they can be opened from the deployed Worker:

- `/sites/boston/html/index.html`
- `/sites/boston/html/Foodies.html`
- `/sites/boston/html/Arts-culture.html`
- `/sites/boston/html/Outdoors.html`
- `/sites/boston/html/Support.html`
- `/sites/aquariums/html/index.html`
- `/sites/aquariums/html/page1.html`
- `/sites/aquariums/html/page2.html`
- `/sites/aquariums/html/page3.html`

## Project structure

```text
public/
  index.html
  style.css
  app.js
  sites/
    boston/
    aquariums/
src/
  index.js
  chatroom.js
package.json
wrangler.toml
```

## Run locally

```bash
npm install
npx wrangler login
npm run dev
```

## Deploy

```bash
npm run deploy
```
