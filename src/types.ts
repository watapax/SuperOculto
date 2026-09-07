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

export interface FightSide {
  playerId: string
  characters: string[]
  hits: number
}

export interface Fight {
  id: string
  gameId: GameId
  createdAt: number
  finishedAt: number | null
  status: 'live' | 'finished'
  sides: [FightSide, FightSide]
}
