import CharacterAvatar from './CharacterAvatar'
import { shortCharacterName } from '../lib/characterName'
import type { GameTeam } from '../types'

const MAX_CHARACTERS = 3

function TeamPicker({
  teams,
  selected,
  onChange,
}: {
  teams: GameTeam[]
  selected: string[]
  onChange: (next: string[]) => void
}) {
  function isTeamSelected(team: GameTeam) {
    return team.characters.length === selected.length && team.characters.every((c) => selected.includes(c))
  }

  return (
    <div className="max-h-72 space-y-1.5 overflow-y-auto rounded-xl border border-edge/50 bg-ink/40 p-1.5">
      {teams.map((team) => {
        const active = isTeamSelected(team)
        return (
          <button
            type="button"
            key={team.name}
            onClick={() => onChange(active ? [] : team.characters)}
            className={`flex w-full items-center gap-2 rounded-lg p-1.5 transition-all ${
              active ? 'bg-brand/20 ring-1 ring-brand' : 'hover:bg-panel-2 active:scale-[0.98]'
            }`}
          >
            <div className="flex -space-x-2">
              {team.characters.map((c) => (
                <CharacterAvatar key={c} name={c} size="sm" character />
              ))}
            </div>
            <span className="flex-1 truncate text-left text-sm font-bold text-white/90">{team.name}</span>
            {active && <span className="shrink-0 text-lime">✓</span>}
          </button>
        )
      })}
    </div>
  )
}

export default function CharacterPicker({
  options,
  teams,
  selected,
  onChange,
}: {
  options: string[]
  teams?: GameTeam[]
  selected: string[]
  onChange: (next: string[]) => void
}) {
  const atMax = selected.length >= MAX_CHARACTERS

  function toggle(character: string) {
    if (selected.includes(character)) {
      onChange(selected.filter((c) => c !== character))
      return
    }
    if (atMax) return
    onChange([...selected, character])
  }

  if (teams && teams.length > 0) {
    return (
      <div>
        <p className="mb-2 text-[11px] font-medium text-white/50">Este juego se elige por equipo completo.</p>
        <TeamPicker teams={teams} selected={selected} onChange={onChange} />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-end">
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
      <div className="grid max-h-72 grid-cols-4 gap-0.5 overflow-y-auto rounded-xl border border-edge/50 bg-ink/40 p-1">
        {options.map((c) => {
          const active = selected.includes(c)
          const disabled = !active && atMax
          return (
            <button
              type="button"
              key={c}
              onClick={() => toggle(c)}
              disabled={disabled}
              className={`flex flex-col items-center gap-0.5 rounded-lg p-0.5 text-center transition-all ${
                active
                  ? 'bg-brand/20'
                  : disabled
                    ? 'opacity-30'
                    : 'hover:bg-panel-2 active:scale-95'
              }`}
            >
              <CharacterAvatar name={c} size="md" selected={active} character />
              <span className="line-clamp-1 text-[11px] font-medium leading-tight text-white/80">
                {shortCharacterName(c)}
              </span>
            </button>
          )
        })}
        {options.length === 0 && (
          <span className="col-span-full py-2 text-center text-sm text-white/40">Sin resultados</span>
        )}
      </div>
    </div>
  )
}
