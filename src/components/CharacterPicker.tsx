import { useMemo, useState } from 'react'
import CharacterAvatar from './CharacterAvatar'
import { Input } from './ui'

const MAX_CHARACTERS = 3

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
  const atMax = selected.length >= MAX_CHARACTERS

  function toggle(character: string) {
    if (selected.includes(character)) {
      onChange(selected.filter((c) => c !== character))
      return
    }
    if (atMax) return
    onChange([...selected, character])
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
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 font-display text-sm tracking-wide ${
            atMax ? 'bg-lime/20 text-lime' : 'bg-panel-2 text-white/60'
          }`}
        >
          {selected.length}/{MAX_CHARACTERS}
        </span>
      </div>
      {atMax && (
        <p className="mb-2 text-[11px] font-medium text-lime">Equipo completo — sacá uno para elegir otro.</p>
      )}
      <div className="grid max-h-64 grid-cols-3 gap-2 overflow-y-auto rounded-xl border border-edge/50 bg-ink/40 p-2">
        {filtered.map((c) => {
          const active = selected.includes(c)
          const disabled = !active && atMax
          return (
            <button
              type="button"
              key={c}
              onClick={() => toggle(c)}
              disabled={disabled}
              className={`flex flex-col items-center gap-1 rounded-xl p-1.5 text-center transition-all ${
                active
                  ? 'bg-brand/20'
                  : disabled
                    ? 'opacity-30'
                    : 'hover:bg-panel-2 active:scale-95'
              }`}
            >
              <CharacterAvatar name={c} size="sm" selected={active} character />
              <span className="line-clamp-2 text-[11px] font-medium leading-tight text-white/80">{c}</span>
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
