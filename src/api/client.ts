import type { Fight, GameId, Player } from '../types'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? `Error ${res.status} en ${path}`)
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export const api = {
  getPlayers: () => request<Player[]>('/players'),
  createPlayer: (name: string) => request<Player>('/players', { method: 'POST', body: JSON.stringify({ name }) }),
  renamePlayer: (id: string, name: string) =>
    request<Player>(`/players/${id}`, { method: 'PATCH', body: JSON.stringify({ name }) }),
  removePlayer: (id: string) => request<void>(`/players/${id}`, { method: 'DELETE' }),

  getFights: () => request<Fight[]>('/fights'),
  createFight: (params: {
    gameId: GameId
    player1Id: string
    player1Characters: string[]
    player2Id: string
    player2Characters: string[]
  }) => request<Fight>('/fights', { method: 'POST', body: JSON.stringify(params) }),
  addHit: (fightId: string, side: 0 | 1) =>
    request<Fight>(`/fights/${fightId}/hit`, { method: 'POST', body: JSON.stringify({ side }) }),
  undoHit: (fightId: string, side: 0 | 1) =>
    request<Fight>(`/fights/${fightId}/undo`, { method: 'POST', body: JSON.stringify({ side }) }),
  finishFight: (fightId: string) => request<Fight>(`/fights/${fightId}/finish`, { method: 'POST' }),
  discardFight: (fightId: string) => request<void>(`/fights/${fightId}`, { method: 'DELETE' }),
}
