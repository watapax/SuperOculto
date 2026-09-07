import { Router } from 'express'
import { randomUUID } from 'node:crypto'
import { pool } from '../db.js'

export const fightsRouter = Router()

function serializeFight(row) {
  return {
    id: row.id,
    gameId: row.game_id,
    createdAt: Number(row.created_at),
    finishedAt: row.finished_at === null ? null : Number(row.finished_at),
    status: row.status,
    sides: [
      { playerId: row.side1_player_id, characters: row.side1_characters, hits: row.side1_hits },
      { playerId: row.side2_player_id, characters: row.side2_characters, hits: row.side2_hits },
    ],
  }
}

function parseSide(value) {
  const side = Number(value)
  return side === 0 || side === 1 ? side : null
}

fightsRouter.get('/', async (_req, res) => {
  const { rows } = await pool.query('SELECT * FROM fights ORDER BY created_at DESC')
  res.json(rows.map(serializeFight))
})

fightsRouter.post('/', async (req, res) => {
  const { gameId, player1Id, player1Characters, player2Id, player2Characters } = req.body ?? {}

  if (!gameId || !player1Id || !player2Id || player1Id === player2Id) {
    return res.status(400).json({ error: 'gameId, player1Id y player2Id (distintos) son requeridos' })
  }
  if (!Array.isArray(player1Characters) || player1Characters.length === 0) {
    return res.status(400).json({ error: 'player1Characters no puede estar vacío' })
  }
  if (!Array.isArray(player2Characters) || player2Characters.length === 0) {
    return res.status(400).json({ error: 'player2Characters no puede estar vacío' })
  }

  const id = randomUUID()
  const createdAt = Date.now()
  const { rows } = await pool.query(
    `INSERT INTO fights (id, game_id, created_at, status, side1_player_id, side1_characters, side2_player_id, side2_characters)
     VALUES ($1, $2, $3, 'live', $4, $5, $6, $7) RETURNING *`,
    [id, gameId, createdAt, player1Id, JSON.stringify(player1Characters), player2Id, JSON.stringify(player2Characters)],
  )
  res.status(201).json(serializeFight(rows[0]))
})

fightsRouter.post('/:id/hit', async (req, res) => {
  const side = parseSide(req.body?.side)
  if (side === null) return res.status(400).json({ error: 'side debe ser 0 o 1' })

  const column = side === 0 ? 'side1_hits' : 'side2_hits'
  const { rows } = await pool.query(
    `UPDATE fights SET ${column} = ${column} + 1 WHERE id = $1 RETURNING *`,
    [req.params.id],
  )
  if (rows.length === 0) return res.status(404).json({ error: 'pelea no encontrada' })
  res.json(serializeFight(rows[0]))
})

fightsRouter.post('/:id/undo', async (req, res) => {
  const side = parseSide(req.body?.side)
  if (side === null) return res.status(400).json({ error: 'side debe ser 0 o 1' })

  const column = side === 0 ? 'side1_hits' : 'side2_hits'
  const { rows } = await pool.query(
    `UPDATE fights SET ${column} = GREATEST(${column} - 1, 0) WHERE id = $1 RETURNING *`,
    [req.params.id],
  )
  if (rows.length === 0) return res.status(404).json({ error: 'pelea no encontrada' })
  res.json(serializeFight(rows[0]))
})

fightsRouter.post('/:id/finish', async (req, res) => {
  const { rows } = await pool.query(
    `UPDATE fights SET status = 'finished', finished_at = $2 WHERE id = $1 RETURNING *`,
    [req.params.id, Date.now()],
  )
  if (rows.length === 0) return res.status(404).json({ error: 'pelea no encontrada' })
  res.json(serializeFight(rows[0]))
})

fightsRouter.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM fights WHERE id = $1', [req.params.id])
  res.status(204).end()
})
