import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname } from 'node:path'

const DIST_DIR = new URL('./dist/', import.meta.url)
const PORT = process.env.PORT || 8080

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json',
  '.ico': 'image/x-icon',
}

async function serveStatic(req, res) {
  const urlPath = req.url === '/' ? '/index.html' : req.url.split('?')[0]

  try {
    const data = await readFile(new URL('.' + urlPath, DIST_DIR))
    res.writeHead(200, { 'Content-Type': MIME_TYPES[extname(urlPath)] || 'application/octet-stream' })
    res.end(data)
  } catch {
    res.writeHead(404)
    res.end('Not found')
  }
}

async function proxyEspn(req, res) {
  const target = 'https://site.api.espn.com' + req.url.replace(/^\/espn-api/, '')
  const response = await fetch(target, { headers: { 'User-Agent': 'curl/8.0' } })
  const body = await response.arrayBuffer()
  res.writeHead(response.status, { 'Content-Type': response.headers.get('content-type') || 'application/json' })
  res.end(Buffer.from(body))
}

const server = createServer((req, res) => {
  const handler = req.url.startsWith('/espn-api') ? proxyEspn : serveStatic
  handler(req, res).catch((err) => {
    res.writeHead(502)
    res.end('Server error: ' + err.message)
  })
})

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use by another program.`)
    console.error(`Pick a different one, e.g.:  PORT=8081 npm start`)
    process.exit(1)
  }
  throw err
})

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Varsity CFB running at http://localhost:${PORT}`)
})
