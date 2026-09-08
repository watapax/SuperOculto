import type { Fight, Player } from '../types'

export interface HitStanding {
  player: Player
  fights: number
  hitsReceived: number
  avgHitsPerFight: number
}

export function computeHitStandings(players: Player[], fights: Fight[]): HitStanding[] {
  const rows = new Map<string, HitStanding>()
  for (const p of players) {
    rows.set(p.id, { player: p, fights: 0, hitsReceived: 0, avgHitsPerFight: 0 })
  }

  for (const fight of fights) {
    for (const side of fight.sides) {
      const row = rows.get(side.playerId)
      if (!row) continue
      row.fights += 1
      row.hitsReceived += side.hits
    }
  }

  for (const row of rows.values()) {
    row.avgHitsPerFight = row.fights > 0 ? row.hitsReceived / row.fights : 0
  }

  return [...rows.values()].sort((a, b) => b.hitsReceived - a.hitsReceived)
}

export interface CharacterHitStanding {
  character: string
  hits: number
}

/** Ranking de personajes por cantidad de movimientos especiales marcados (conectados), no por veces elegido. */
export function computeCharacterHitStandings(fights: Fight[]): CharacterHitStanding[] {
  const hits = new Map<string, number>()

  for (const fight of fights) {
    for (const entry of fight.hitsLog) {
      hits.set(entry.character, (hits.get(entry.character) ?? 0) + 1)
    }
  }

  return [...hits.entries()]
    .map(([character, hits]) => ({ character, hits }))
    .sort((a, b) => b.hits - a.hits)
}
