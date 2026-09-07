import { create } from 'zustand'
import { api } from '../api/client'
import type { Fight, GameId, Player } from '../types'

interface State {
  players: Player[]
  fights: Fight[]
  hydrated: boolean
  hydrationError: string | null
}

interface Actions {
  hydrate: () => Promise<void>

  addPlayer: (name: string, avatar?: string | null) => Promise<void>
  updatePlayer: (id: string, patch: { name?: string; avatar?: string | null }) => Promise<void>
  removePlayer: (id: string) => Promise<void>

  createFight: (params: {
    gameId: GameId
    player1Id: string
    player1Characters: string[]
    player2Id: string
    player2Characters: string[]
  }) => Promise<string>

  addHit: (fightId: string, side: 0 | 1) => void
  undoHit: (fightId: string, side: 0 | 1) => void
  finishFight: (fightId: string) => Promise<void>
  discardFight: (fightId: string) => Promise<void>
}

function patchFight(fights: Fight[], fightId: string, updater: (f: Fight) => Fight): Fight[] {
  return fights.map((f) => (f.id === fightId ? updater(f) : f))
}

export const useStore = create<State & Actions>()((set) => ({
  players: [],
  fights: [],
  hydrated: false,
  hydrationError: null,

  hydrate: async () => {
    try {
      const [players, fights] = await Promise.all([api.getPlayers(), api.getFights()])
      set({ players, fights, hydrated: true, hydrationError: null })
    } catch (err) {
      set({ hydrated: true, hydrationError: err instanceof Error ? err.message : 'Error al cargar datos' })
    }
  },

  addPlayer: async (name, avatar) => {
    const player = await api.createPlayer(name, avatar)
    set((s) => ({ players: [...s.players, player] }))
  },

  updatePlayer: async (id, patch) => {
    const player = await api.updatePlayer(id, patch)
    set((s) => ({ players: s.players.map((p) => (p.id === id ? player : p)) }))
  },

  removePlayer: async (id) => {
    await api.removePlayer(id)
    set((s) => ({
      players: s.players.filter((p) => p.id !== id),
      fights: s.fights.filter((f) => f.sides[0].playerId !== id && f.sides[1].playerId !== id),
    }))
  },

  createFight: async ({ gameId, player1Id, player1Characters, player2Id, player2Characters }) => {
    const fight = await api.createFight({ gameId, player1Id, player1Characters, player2Id, player2Characters })
    set((s) => ({ fights: [...s.fights, fight] }))
    return fight.id
  },

  addHit: (fightId, side) => {
    set((s) => ({
      fights: patchFight(s.fights, fightId, (f) => {
        const sides = [...f.sides] as [Fight['sides'][0], Fight['sides'][1]]
        sides[side] = { ...sides[side], hits: sides[side].hits + 1 }
        return { ...f, sides }
      }),
    }))
    api.addHit(fightId, side).catch((err) => {
      console.error('No se pudo guardar el golpe:', err)
    })
  },

  undoHit: (fightId, side) => {
    set((s) => ({
      fights: patchFight(s.fights, fightId, (f) => {
        const sides = [...f.sides] as [Fight['sides'][0], Fight['sides'][1]]
        sides[side] = { ...sides[side], hits: Math.max(0, sides[side].hits - 1) }
        return { ...f, sides }
      }),
    }))
    api.undoHit(fightId, side).catch((err) => {
      console.error('No se pudo deshacer el golpe:', err)
    })
  },

  finishFight: async (fightId) => {
    const fight = await api.finishFight(fightId)
    set((s) => ({ fights: patchFight(s.fights, fightId, () => fight) }))
  },

  discardFight: async (fightId) => {
    await api.discardFight(fightId)
    set((s) => ({ fights: s.fights.filter((f) => f.id !== fightId) }))
  },
}))