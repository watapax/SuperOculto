import pg from 'pg'

const { Pool } = pg

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL no está seteada. Agregá un plugin de Postgres en Railway (o corré uno local).')
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false },
})

// Idle clients emit 'error' on connection blips (DB restart, network hiccup).
// Without a listener here, that's an uncaught exception that kills the whole process.
pool.on('error', (err) => {
  console.error('Postgres pool error (conexión idle):', err)
})

export async function migrate() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS players (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      created_at BIGINT NOT NULL
    );

    ALTER TABLE players ADD COLUMN IF NOT EXISTS avatar TEXT;

    CREATE TABLE IF NOT EXISTS fights (
      id TEXT PRIMARY KEY,
      game_id TEXT NOT NULL,
      created_at BIGINT NOT NULL,
      finished_at BIGINT,
      status TEXT NOT NULL DEFAULT 'live',
      side1_player_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
      side1_characters JSONB NOT NULL DEFAULT '[]',
      side1_hits INTEGER NOT NULL DEFAULT 0,
      side2_player_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
      side2_characters JSONB NOT NULL DEFAULT '[]',
      side2_hits INTEGER NOT NULL DEFAULT 0
    );
  `)
}
