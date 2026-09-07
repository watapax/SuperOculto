import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Fight, GameId, Player } from '../types'

function makeId() {
  return crypto.randomUUID()
}

interface State {
  players: Player[]
  fights: Fight[]
}

interface Actions {
  addPlayer: (name: string) => void
  renamePlayer: (id: string, name: string) => void
  removePlayer: (id: string) => void

  createFight: (params: {
    gameId: GameId
    player1Id: string
    player1Characters: string[]
    player2Id: string
    player2Characters: string[]
  }) => string

  addHit: (fightId: string, side: 0 | 1) => void
  undoHit: (fightId: string, side: 0 | 1) => void
  finishFight: (fightId: string) => void
  discardFight: (fightId: string) => void
}

export const useStore = create<State & Actions>()(
  persist(
    (set) => ({
      players: [],
      fights: [],

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
          fights: s.fights.filter((f) => f.sides[0].playerId !== id && f.sides[1].playerId !== id),
        })),

      createFight: ({ gameId, player1Id, player1Characters, player2Id, player2Characters }) => {
        const id = makeId()
        const fight: Fight = {
          id,
          gameId,
          createdAt: Date.now(),
          finishedAt: null,
          status: 'live',
          sides: [
            { playerId: player1Id, characters: player1Characters, hits: 0 },
            { playerId: player2Id, characters: player2Characters, hits: 0 },
          ],
        }
        set((s) => ({ fights: [...s.fights, fight] }))
        return id
      },

      addHit: (fightId, side) =>
        set((s) => ({
          fights: s.fights.map((f) => {
            if (f.id !== fightId) return f
            const sides = [...f.sides] as [Fight['sides'][0], Fight['sides'][1]]
            sides[side] = { ...sides[side], hits: sides[side].hits + 1 }
            return { ...f, sides }
          }),
        })),

      undoHit: (fightId, side) =>
        set((s) => ({
          fights: s.fights.map((f) => {
            if (f.id !== fightId) return f
            const sides = [...f.sides] as [Fight['sides'][0], Fight['sides'][1]]
            sides[side] = { ...sides[side], hits: Math.max(0, sides[side].hits - 1) }
            return { ...f, sides }
          }),
        })),

      finishFight: (fightId) =>
        set((s) => ({
          fights: s.fights.map((f) =>
            f.id === fightId ? { ...f, status: 'finished', finishedAt: Date.now() } : f,
          ),
        })),

      discardFight: (fightId) =>
        set((s) => ({
          fights: s.fights.filter((f) => f.id !== fightId),
        })),
    }),
    { name: 'super-ocultos-storage' },
  ),
)
