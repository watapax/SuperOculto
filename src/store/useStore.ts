import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GameId, Match, Player, PlayerGameProfile, Season } from '../types'

function makeId() {
  return crypto.randomUUID()
}

const EMPTY_CHARACTERS: string[] = []

interface State {
  players: Player[]
  seasons: Season[]
  activeSeasonId: string | null
  profiles: PlayerGameProfile[]
  matches: Match[]
}

interface Actions {
  addPlayer: (name: string) => void
  renamePlayer: (id: string, name: string) => void
  removePlayer: (id: string) => void

  addSeason: (name: string) => void
  renameSeason: (id: string, name: string) => void
  setActiveSeason: (id: string) => void
  archiveSeason: (id: string) => void

  setPlayerCharacters: (playerId: string, gameId: GameId, characters: string[]) => void
  getPlayerCharacters: (playerId: string, gameId: GameId) => string[]

  addMatch: (match: Omit<Match, 'id' | 'createdAt'>) => void
  removeMatch: (id: string) => void
}

const DEFAULT_SEASON_ID = makeId()

export const useStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      players: [],
      seasons: [{ id: DEFAULT_SEASON_ID, name: 'Temporada 1', createdAt: Date.now(), archived: false }],
      activeSeasonId: DEFAULT_SEASON_ID,
      profiles: [],
      matches: [],

      addPlayer: (name) =>
        set((s) => ({
          players: [...s.players, { id: makeId(), name: name.trim(), createdAt: Date.now() }],
        })),

      renamePlayer: (id, name) =>
        set((s) => ({
          players: s.players.map((p) => (p.id === id ? { ...p, name: name.trim() } : p)),
        })),

      removePlayer: (id) =>
        set((s) => ({
          players: s.players.filter((p) => p.id !== id),
          profiles: s.profiles.filter((p) => p.playerId !== id),
          matches: s.matches.filter((m) => m.player1Id !== id && m.player2Id !== id),
        })),

      addSeason: (name) =>
        set((s) => {
          const id = makeId()
          return {
            seasons: [...s.seasons, { id, name: name.trim(), createdAt: Date.now(), archived: false }],
            activeSeasonId: id,
          }
        }),

      renameSeason: (id, name) =>
        set((s) => ({
          seasons: s.seasons.map((se) => (se.id === id ? { ...se, name: name.trim() } : se)),
        })),

      setActiveSeason: (id) => set({ activeSeasonId: id }),

      archiveSeason: (id) =>
        set((s) => ({
          seasons: s.seasons.map((se) => (se.id === id ? { ...se, archived: true } : se)),
        })),

      setPlayerCharacters: (playerId, gameId, characters) =>
        set((s) => {
          const existing = s.profiles.find((p) => p.playerId === playerId && p.gameId === gameId)
          if (existing) {
            return {
              profiles: s.profiles.map((p) =>
                p.playerId === playerId && p.gameId === gameId ? { ...p, characters } : p,
              ),
            }
          }
          return { profiles: [...s.profiles, { playerId, gameId, characters }] }
        }),

      getPlayerCharacters: (playerId, gameId) =>
        get().profiles.find((p) => p.playerId === playerId && p.gameId === gameId)?.characters ?? EMPTY_CHARACTERS,

      addMatch: (match) =>
        set((s) => ({
          matches: [...s.matches, { ...match, id: makeId(), createdAt: Date.now() }],
        })),

      removeMatch: (id) =>
        set((s) => ({
          matches: s.matches.filter((m) => m.id !== id),
        })),
    }),
    { name: 'kof-torneo-storage' },
  ),
)
