# Varsity CFB

Author: Marcus Wagner

A simple app that displays scores and stats from college football. Easy. Simple. That's it.

**Live site:** https://marcus-wagner-2016.github.io/varsity-cfb/

## How it works

- `react/` — the app source (React + Vite)
- `index.html`, `assets/`, etc. at the repo root — the built app that GitHub Pages serves (don't edit these by hand)
- `.github/workflows/deploy.yml` — rebuilds the app and refreshes the root files on every push to `main`

Scores come from ESPN's public scoreboard API, fetched directly from the browser.
The Vite dev server proxies those requests (`/espn-api`) because ESPN's bot
protection rejects non-browser clients; production builds call ESPN directly.

## Local development

```bash
cd react
npm install
npm run dev
```

## Production build

```bash
cd react
npm run build
```

To preview a production build locally with the ESPN proxy, `npm start` runs
`react/server.js`, a dependency-free Node server that serves `dist/` on port 8080.

## Deploying

Push to `main`. The GitHub Actions workflow builds with
`--base=/varsity-cfb/`, commits the fresh build to the repo root
(which GitHub Pages serves), and also uploads it as a Pages artifact.
