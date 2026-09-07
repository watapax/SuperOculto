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

export interface CharacterStat {
  character: string
  timesUsed: number
}

export function computeCharacterStats(fights: Fight[]): CharacterStat[] {
  const stats = new Map<string, CharacterStat>()

  for (const fight of fights) {
    for (const side of fight.sides) {
      for (const character of side.characters) {
        const existing = stats.get(character) ?? { character, timesUsed: 0 }
        existing.timesUsed += 1
        stats.set(character, existing)
      }
    }
  }

  return [...stats.values()].sort((a, b) => b.timesUsed - a.timesUsed)
}
