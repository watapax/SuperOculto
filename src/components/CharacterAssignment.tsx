import { useMemo, useState } from 'react'
import { GAME_LIST } from '../data/kofData'
import { useStore } from '../store/useStore'
import type { GameId } from '../types'
import { Input, Select } from './ui'

export default function CharacterAssignment({ playerId }: { playerId: string }) {
  const [gameId, setGameId] = useState<GameId>(GAME_LIST[0].id)
  const [search, setSearch] = useState('')
  const setPlayerCharacters = useStore((s) => s.setPlayerCharacters)
  const characters = useStore((s) => s.getPlayerCharacters(playerId, gameId))

  const game = GAME_LIST.find((g) => g.id === gameId)!
  const filtered = useMemo(
    () => game.characters.filter((c) => c.toLowerCase().includes(search.toLowerCase())),
    [game, search],
  )

  function toggle(character: string) {
    const next = characters.includes(character)
      ? characters.filter((c) => c !== character)
      : [...characters, character]
    setPlayerCharacters(playerId, gameId, next)
  }

  return (
    <div className="mt-3 border-t border-edge/50 pt-3">
      <div className="mb-3 flex flex-wrap gap-2">
        <Select value={gameId} onChange={(e) => setGameId(e.target.value as GameId)}>
          {GAME_LIST.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </Select>
        <Input
          placeholder="Buscar personaje..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[160px]"
        />
        <span className="self-center text-xs text-white/50">{characters.length} seleccionado(s)</span>
      </div>
      <div className="grid max-h-56 grid-cols-2 gap-1 overflow-y-auto rounded-md border border-edge/40 p-2 sm:grid-cols-3 md:grid-cols-4">
        {filtered.map((c) => {
          const active = characters.includes(c)
          return (
            <label
              key={c}
              className={`flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm transition-colors ${
                active ? 'bg-brand/20 text-accent' : 'hover:bg-panel-2'
              }`}
            >
              <input type="checkbox" checked={active} onChange={() => toggle(c)} className="accent-orange-600" />
              <span className="truncate">{c}</span>
            </label>
          )
        })}
        {filtered.length === 0 && <span className="col-span-full py-2 text-center text-sm text-white/40">Sin resultados</span>}
      </div>
    </div>
  )
}
