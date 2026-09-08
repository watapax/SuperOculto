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

export interface GameTeam {
  name: string
  characters: string[]
}

export interface GameInfo {
  id: GameId
  name: string
  year: number
  characters: string[]
  /** Solo en juegos donde se elige un equipo fijo de 3 en vez de personajes sueltos (ej. KOF '94). */
  teams?: GameTeam[]
}

export interface Player {
  id: string
  name: string
  createdAt: number
  avatar?: string | null
}

export interface FightSide {
  playerId: string
  characters: string[]
  hits: number
}

/** Un golpe conectado: qué lado atacó y con qué personaje. No se muestra aún en la UI, se guarda para futuras estadísticas. */
export interface HitLogEntry {
  attackerSide: 0 | 1
  character: string
}

export interface Fight {
  id: string
  gameId: GameId
  createdAt: number
  finishedAt: number | null
  status: 'live' | 'finished'
  sides: [FightSide, FightSide]
  hitsLog: HitLogEntry[]
}
