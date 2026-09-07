import { useMemo, useState } from 'react'
import CharacterAvatar from './CharacterAvatar'
import { Input } from './ui'

export default function CharacterPicker({
  options,
  selected,
  onChange,
}: {
  options: string[]
  selected: string[]
  onChange: (next: string[]) => void
}) {
  const [search, setSearch] = useState('')
  const filtered = useMemo(
    () => options.filter((c) => c.toLowerCase().includes(search.toLowerCase())),
    [options, search],
  )

  function toggle(character: string) {
    onChange(selected.includes(character) ? selected.filter((c) => c !== character) : [...selected, character])
  }

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <Input
          placeholder="Buscar personaje..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <span className="shrink-0 text-xs text-white/50">{selected.length} elegido(s)</span>
      </div>
      <div className="grid max-h-64 grid-cols-3 gap-2 overflow-y-auto rounded-md border border-edge/40 p-2">
        {filtered.map((c) => {
          const active = selected.includes(c)
          return (
            <button
              type="button"
              key={c}
              onClick={() => toggle(c)}
              className={`flex flex-col items-center gap-1 rounded-lg p-1.5 text-center transition-colors ${
                active ? 'bg-brand/25 ring-1 ring-brand' : 'hover:bg-panel-2'
              }`}
            >
              <CharacterAvatar name={c} size="sm" />
              <span className="line-clamp-2 text-[11px] leading-tight text-white/80">{c}</span>
            </button>
          )
        })}
        {filtered.length === 0 && (
          <span className="col-span-full py-2 text-center text-sm text-white/40">Sin resultados</span>
        )}
      </div>
    </div>
  )
}
