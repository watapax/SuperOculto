import type { GameId, Match, Player } from '../types'

export const POINTS_PER_WIN = 3
export const POINTS_PER_LOSS = 0

export interface StandingRow {
  player: Player
  matchesPlayed: number
  wins: number
  losses: number
  points: number
  roundsWon: number
  roundsLost: number
  winRate: number
}

export interface MatchFilter {
  seasonId?: string | null
  gameId?: GameId | 'all'
}

export function filterMatches(matches: Match[], filter: MatchFilter): Match[] {
  return matches.filter((m) => {
    if (filter.seasonId && m.seasonId !== filter.seasonId) return false
    if (filter.gameId && filter.gameId !== 'all' && m.gameId !== filter.gameId) return false
    return true
  })
}

export function computeStandings(players: Player[], matches: Match[]): StandingRow[] {
  const rows = new Map<string, StandingRow>()
  for (const p of players) {
    rows.set(p.id, {
      player: p,
      matchesPlayed: 0,
      wins: 0,
      losses: 0,
      points: 0,
      roundsWon: 0,
      roundsLost: 0,
      winRate: 0,
    })
  }

  for (const m of matches) {
    const r1 = rows.get(m.player1Id)
    const r2 = rows.get(m.player2Id)
    if (r1) {
      r1.matchesPlayed += 1
      r1.roundsWon += m.player1Score
      r1.roundsLost += m.player2Score
      if (m.winnerId === m.player1Id) {
        r1.wins += 1
        r1.points += POINTS_PER_WIN
      } else {
        r1.losses += 1
        r1.points += POINTS_PER_LOSS
      }
    }
    if (r2) {
      r2.matchesPlayed += 1
      r2.roundsWon += m.player2Score
      r2.roundsLost += m.player1Score
      if (m.winnerId === m.player2Id) {
        r2.wins += 1
        r2.points += POINTS_PER_WIN
      } else {
        r2.losses += 1
        r2.points += POINTS_PER_LOSS
      }
    }
  }

  for (const r of rows.values()) {
    r.winRate = r.matchesPlayed > 0 ? r.wins / r.matchesPlayed : 0
  }

  return [...rows.values()].sort((a, b) => b.points - a.points || b.winRate - a.winRate)
}

export interface CharacterStat {
  character: string
  timesUsed: number
  wins: number
  losses: number
  winRate: number
}

export function computeCharacterStats(matches: Match[]): CharacterStat[] {
  const stats = new Map<string, CharacterStat>()

  function bump(character: string, won: boolean) {
    const existing = stats.get(character) ?? { character, timesUsed: 0, wins: 0, losses: 0, winRate: 0 }
    existing.timesUsed += 1
    if (won) existing.wins += 1
    else existing.losses += 1
    stats.set(character, existing)
  }

  for (const m of matches) {
    bump(m.player1Character, m.winnerId === m.player1Id)
    bump(m.player2Character, m.winnerId === m.player2Id)
  }

  for (const s of stats.values()) {
    s.winRate = s.timesUsed > 0 ? s.wins / s.timesUsed : 0
  }

  return [...stats.values()].sort((a, b) => b.timesUsed - a.timesUsed)
}
