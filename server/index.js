import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { migrate } from './db.js'
import { playersRouter } from './routes/players.js'
import { fightsRouter } from './routes/fights.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.join(__dirname, '..', 'dist')
const port = process.env.PORT || 8787

const app = express()
app.use(express.json())

app.use('/api/players', playersRouter)
app.use('/api/fights', fightsRouter)

app.use(express.static(distDir))
app.use((req, res, next) => {
  if (req.method !== 'GET' || req.path.startsWith('/api/')) return next()
  res.sendFile(path.join(distDir, 'index.html'))
})

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: 'internal_error' })
})

await migrate()
app.listen(port, () => {
  console.log(`Super Ocultos server listening on :${port}`)
})
