import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { dirname, extname, join, resolve, sep } from 'node:path'
import { Readable } from 'node:stream'
import { fileURLToPath, pathToFileURL } from 'node:url'

const currentDir = dirname(fileURLToPath(import.meta.url))
const distDir = resolve(currentDir, '..', 'dist')
const clientDir = join(distDir, 'client')
const serverDir = join(distDir, 'server')
const serverEntry = await findServerEntry()
const port = Number(process.env.PORT ?? '3000')
const host = process.env.HOST ?? 'localhost'

process.env.TSS_CLIENT_OUTPUT_DIR = clientDir

const serverModule = await import(pathToFileURL(serverEntry).href)
const handler = serverModule.default?.default ?? serverModule.default

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.cjs': 'text/javascript; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
}

createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? '/', `http://${req.headers.host ?? host}`)
    const staticFile = await findStaticFile(url.pathname)

    if (staticFile) {
      res.writeHead(200, {
        'content-length': staticFile.size,
        'content-type': mimeTypes[extname(staticFile.path)] ?? 'application/octet-stream',
      })

      if (req.method === 'HEAD') {
        res.end()
        return
      }

      createReadStream(staticFile.path).pipe(res)
      return
    }

    const response = await handler.fetch(
      new Request(url, {
        body: req.method === 'GET' || req.method === 'HEAD' ? undefined : req,
        duplex: req.method === 'GET' || req.method === 'HEAD' ? undefined : 'half',
        headers: toHeaders(req.headers),
        method: req.method,
      }),
    )

    res.writeHead(response.status, Object.fromEntries(response.headers.entries()))

    if (req.method === 'HEAD' || !response.body) {
      res.end()
      return
    }

    Readable.fromWeb(response.body).pipe(res)
  } catch (error) {
    console.error(error)
    res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' })
    res.end('Internal Server Error')
  }
}).listen(port, host, () => {
  console.log(`Preview server listening at http://${host}:${port}`)
})

async function findStaticFile(pathname) {
  let decodedPathname
  try {
    decodedPathname = decodeURIComponent(pathname)
  } catch {
    return undefined
  }

  const requestedPath = decodedPathname === '/' ? '/index.html' : decodedPathname
  const candidates = [
    resolveStaticPath(clientDir, requestedPath),
    requestedPath === '/server-mf-manifest.json'
      ? resolveStaticPath(serverDir, '/mf-manifest.json')
      : undefined,
    requestedPath.endsWith('.cjs')
      ? resolveStaticPath(serverDir, requestedPath)
      : undefined,
    requestedPath.startsWith('/static/')
      ? resolveStaticPath(serverDir, requestedPath)
      : undefined,
  ].filter(Boolean)

  for (const filePath of candidates) {
    try {
      const stats = await stat(filePath)

      if (!stats.isFile()) {
        continue
      }

      return {
        path: filePath,
        size: stats.size,
      }
    } catch {
      continue
    }
  }

  return undefined
}

function resolveStaticPath(rootDir, requestedPath) {
  const filePath = resolve(rootDir, `.${requestedPath}`)
  const root = rootDir.endsWith(sep) ? rootDir : `${rootDir}${sep}`

  if (!filePath.startsWith(root)) {
    return undefined
  }

  return filePath
}

function toHeaders(headers) {
  const result = new Headers()

  for (const [key, value] of Object.entries(headers)) {
    if (typeof value === 'string') {
      result.set(key, value)
    } else if (Array.isArray(value)) {
      for (const item of value) {
        result.append(key, item)
      }
    }
  }

  return result
}

async function findServerEntry() {
  const candidates = [join(serverDir, 'index.cjs'), join(serverDir, 'index.js')]

  for (const candidate of candidates) {
    try {
      const stats = await stat(candidate)

      if (stats.isFile()) {
        return candidate
      }
    } catch {
      continue
    }
  }

  throw new Error('Could not find dist/server/index.cjs or dist/server/index.js')
}
