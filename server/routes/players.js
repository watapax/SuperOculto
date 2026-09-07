import { Router } from 'express'
import { randomUUID } from 'node:crypto'
import { pool } from '../db.js'

export const playersRouter = Router()

function serializePlayer(row) {
  return { id: row.id, name: row.name, createdAt: Number(row.created_at) }
}

playersRouter.get('/', async (_req, res) => {
  const { rows } = await pool.query('SELECT * FROM players ORDER BY created_at ASC')
  res.json(rows.map(serializePlayer))
})

playersRouter.post('/', async (req, res) => {
  const name = String(req.body?.name ?? '').trim()
  if (!name) return res.status(400).json({ error: 'name es requerido' })

  const id = randomUUID()
  const createdAt = Date.now()
  const { rows } = await pool.query(
    'INSERT INTO players (id, name, created_at) VALUES ($1, $2, $3) RETURNING *',
    [id, name, createdAt],
  )
  res.status(201).json(serializePlayer(rows[0]))
})

playersRouter.patch('/:id', async (req, res) => {
  const name = String(req.body?.name ?? '').trim()
  if (!name) return res.status(400).json({ error: 'name es requerido' })

  const { rows } = await pool.query('UPDATE players SET name = $1 WHERE id = $2 RETURNING *', [
    name,
    req.params.id,
  ])
  if (rows.length === 0) return res.status(404).json({ error: 'jugador no encontrado' })
  res.json(serializePlayer(rows[0]))
})

playersRouter.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM players WHERE id = $1', [req.params.id])
  res.status(204).end()
})
