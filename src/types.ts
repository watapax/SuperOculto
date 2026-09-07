export type GameId =
  | 'kof94'
  | 'kof95'
  | 'kof96'
  | 'kof97'
  | 'kof98'
  | 'kof99'
  | 'kof2000'
  | 'kof2001'
  | 'kof2002'

export interface GameInfo {
  id: GameId
  name: string
  year: number
  characters: string[]
}

export interface Player {
  id: string
  name: string
  createdAt: number
}

/** Personajes asignados a un jugador para un juego puntual. */
export interface PlayerGameProfile {
  playerId: string
  gameId: GameId
  characters: string[]
}

export interface Season {
  id: string
  name: string
  createdAt: number
  archived: boolean
}

export interface Match {
  id: string
  seasonId: string
  gameId: GameId
  createdAt: number
  player1Id: string
  player1Character: string
  player1Score: number
  player2Id: string
  player2Character: string
  player2Score: number
  winnerId: string
  notes?: string
}
