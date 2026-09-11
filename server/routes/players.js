import { Router } from 'express'
import { randomUUID } from 'node:crypto'
import { pool } from '../db.js'

export const playersRouter = Router()

function serializePlayer(row) {
  return { id: row.id, name: row.name, createdAt: Number(row.created_at), avatar: row.avatar ?? null }
}

playersRouter.get('/', async (_req, res) => {
  const { rows } = await pool.query('SELECT * FROM players ORDER BY created_at ASC')
  res.json(rows.map(serializePlayer))
})

playersRouter.post('/', async (req, res) => {
  const name = String(req.body?.name ?? '').trim()
  if (!name) return res.status(400).json({ error: 'name es requerido' })
  const avatar = req.body?.avatar ? String(req.body.avatar) : null

  const id = randomUUID()
  const createdAt = Date.now()
  const { rows } = await pool.query(
    'INSERT INTO players (id, name, created_at, avatar) VALUES ($1, $2, $3, $4) RETURNING *',
    [id, name, createdAt, avatar],
  )
  res.status(201).json(serializePlayer(rows[0]))
})

playersRouter.patch('/:id', async (req, res) => {
  const hasName = req.body?.name !== undefined
  const hasAvatar = req.body?.avatar !== undefined
  if (!hasName && !hasAvatar) return res.status(400).json({ error: 'nada que actualizar' })

  const name = hasName ? String(req.body.name).trim() : null
  if (hasName && !name) return res.status(400).json({ error: 'name es requerido' })
  const avatar = hasAvatar ? (req.body.avatar ? String(req.body.avatar) : null) : null

  const { rows } = await pool.query(
    `UPDATE players SET
      name = COALESCE($1, name),
      avatar = CASE WHEN $2 THEN $3 ELSE avatar END
    WHERE id = $4 RETURNING *`,
    [name, hasAvatar, avatar, req.params.id],
  )
  if (rows.length === 0) return res.status(404).json({ error: 'jugador no encontrado' })
  res.json(serializePlayer(rows[0]))
})

playersRouter.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM players WHERE id = $1', [req.params.id])
  res.status(204).end()
})
