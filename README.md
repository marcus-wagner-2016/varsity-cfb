# Varsity CFB — deploy package

## What's in here

- `dist/` — the built app (HTML, JS, CSS, logo, web manifest)
- `server.js` — serves `dist/` and proxies `/espn-api/*` to ESPN
- `package.json` — defines `npm start`

No `npm install` is needed. `server.js` uses only Node built-ins and the
app is already compiled into `dist/`.

## Requirements

Node 18 or newer (`node --version`).

## Run it

```bash
npm start
```

Then open http://localhost:8080.

To use a different port:

```bash
PORT=8081 npm start
```

If the port is already taken, the server exits with a message telling you so.

## Deploy it

Upload this whole folder to any host that runs Node (Render, Railway, Fly.io,
a VPS, etc.) and set the start command to `npm start`. Those platforms set the
`PORT` environment variable for you automatically.

**This must run through `server.js`.** The app fetches `/espn-api/*`, which
`server.js` forwards to ESPN — browsers cannot call ESPN's API directly (it is
blocked by CORS and bot protection). Static-only hosts (Netlify drag-and-drop,
GitHub Pages, S3 buckets) will not work with this package.

## Rebuilding after code changes

In the repo's `react/` folder:

```bash
npm run build
```

Then copy the new `dist/` (and `server.js` if it changed) into this package.
