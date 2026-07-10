import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import hpp from 'hpp'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { existsSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()

const PORT = parseInt(process.env.PORT, 10) || 3001
const NODE_ENV = process.env.NODE_ENV || 'development'
const IS_PROD = NODE_ENV === 'production'
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,https://temp-email-app.onrender.com,https://mailo.dpdns.org')
  .split(',').map(s => s.trim()).filter(Boolean)
const POMAILBOX_PROXY = process.env.POMAILBOX_PROXY || 'https://fasttoolshq.com/tools/temp-email-2/temp-email-api.php'
const CLIENT_DIST = join(__dirname, '..', 'client', 'dist')
const FETCH_TIMEOUT_MS = parseInt(process.env.FETCH_TIMEOUT_MS, 10) || 20000

app.set('trust proxy', 1)

app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      'default-src': ["'self'"],
      'script-src': ["'self'"],
      'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      'img-src': ["'self'", 'data:', 'https:'],
      'connect-src': ["'self'"],
      'font-src': ["'self'", 'https://fonts.gstatic.com'],
      'object-src': ["'none'"],
      'frame-ancestors': ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  strictTransportSecurity: IS_PROD
    ? { maxAge: 31536000, includeSubDomains: true, preload: true }
    : false,
}))

app.use((_req, res, next) => {
  res.setHeader('Permissions-Policy', "camera=(), microphone=(), geolocation=(), browsing-topics=(), interest-cohort=()")
  next()
})

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true)
    if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true)
    cb(null, false)
  },
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  maxAge: 86400,
}))

app.use(express.json({ limit: '16kb' }))
app.use(hpp())

function clientKey(req) {
  const cf = req.headers['cf-connecting-ip']
  if (cf) return cf
  const xff = req.headers['x-forwarded-for']
  if (typeof xff === 'string' && xff.length) return xff.split(',')[0].trim()
  return req.ip || req.socket.remoteAddress
}

app.use('/api', rateLimit({
  windowMs: 60_000,
  max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 30,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/api/health',
  keyGenerator: clientKey,
  message: { success: false, error: 'Too many requests, please try again later.' },
}))

async function proxyFetch(url) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    const res = await fetch(url, { signal: controller.signal })
    const text = await res.text()
    let data
    try { data = JSON.parse(text) } catch { data = null }
    return { status: res.status, ok: res.ok, data, body: text }
  } finally {
    clearTimeout(timer)
  }
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: Date.now(), env: NODE_ENV })
})

app.post('/api/generate', async (_req, res) => {
  try {
    const { status, data } = await proxyFetch(`${POMAILBOX_PROXY}?action=generate`)
    res.status(status).json(data || { success: false, error: 'Invalid upstream response' })
  } catch (error) {
    if (error.name === 'AbortError') return res.status(504).json({ success: false, error: 'Upstream timed out' })
    if (!IS_PROD) console.error('Generate error:', error)
    res.status(502).json({ success: false, error: 'Upstream service unavailable' })
  }
})

app.post('/api/inbox', async (req, res) => {
  const { email, password } = req.body || {}
  if (!email || !password) return res.status(400).json({ success: false, error: 'Email and password required' })
  try {
    const url = `${POMAILBOX_PROXY}?action=inbox&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
    const { status, data } = await proxyFetch(url)
    res.status(status).json(data || { success: false, error: 'Invalid upstream response' })
  } catch (error) {
    if (error.name === 'AbortError') return res.status(504).json({ success: false, error: 'Upstream timed out' })
    if (!IS_PROD) console.error('Inbox error:', error)
    res.status(502).json({ success: false, error: 'Upstream service unavailable' })
  }
})

app.delete('/api/delete', async (req, res) => {
  const { email } = req.body || {}
  if (!email) return res.status(400).json({ success: false, error: 'Email required' })
  try {
    const url = `${POMAILBOX_PROXY}?action=delete&email=${encodeURIComponent(email)}`
    const { status, data } = await proxyFetch(url)
    res.status(status).json(data || { success: false, error: 'Invalid upstream response' })
  } catch (error) {
    if (error.name === 'AbortError') return res.status(504).json({ success: false, error: 'Upstream timed out' })
    if (!IS_PROD) console.error('Delete error:', error)
    res.status(502).json({ success: false, error: 'Upstream service unavailable' })
  }
})

app.use('/api', (_req, res) => res.status(404).json({ success: false, error: 'Not found' }))

if (IS_PROD) {
  if (existsSync(CLIENT_DIST)) {
    app.use(express.static(CLIENT_DIST, {
      maxAge: '1y', immutable: true,
      setHeaders: (res, path) => { if (path.endsWith('.html')) res.setHeader('Cache-Control', 'no-cache') },
    }))
    app.get(/^(?!\/api).*/, (_req, res) => res.sendFile(join(CLIENT_DIST, 'index.html')))
    console.log(`[prod] Serving static client from ${CLIENT_DIST}`)
  } else {
    console.warn('[prod] Client dist not found — run `cd client && npm run build` first')
  }
}

app.use((err, _req, res, _next) => {
  if (!IS_PROD) console.error('Unhandled error:', err)
  res.status(err.status || 500).json({ success: false, error: IS_PROD ? 'Internal server error' : err.message })
})

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Temp Email API — ${NODE_ENV} — http://0.0.0.0:${PORT}`)
})

const shutdown = (signal) => {
  console.log(`\n[${signal}] Shutting down...`)
  server.close(() => { console.log('Server closed.'); process.exit(0) })
  setTimeout(() => { console.error('Force exit'); process.exit(1) }, 10_000)
}
process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))
