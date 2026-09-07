import { useRef, useState } from 'react'
import CharacterAvatar from './CharacterAvatar'
import { useTapEffects } from '../hooks/useTapEffects'
import { shortCharacterName } from '../lib/characterName'
import { getCharacterFullImageUrl } from '../data/characterFullImages'

interface Props {
  position: 'top' | 'bottom'
  playerName: string
  characters: string[]
  hits: number
  onHit: () => void
  onUndo: () => void
}

const ACCENTS = {
  top: {
    zone: 'bg-gradient-to-b from-[#5c0a2e] via-[#3a0a1c] to-[#1c0510]',
    bar: 'bg-black/30',
    text: 'text-brand-2',
  },
  bottom: {
    zone: 'bg-gradient-to-t from-[#062a4a] via-[#0a1a30] to-[#050d1c]',
    bar: 'bg-black/30',
    text: 'text-cyan',
  },
}

function ColumnArt({ name }: { name: string }) {
  const fullUrl = getCharacterFullImageUrl(name)
  if (!fullUrl) return <CharacterAvatar name={name} selected character fill />
  return <img src={fullUrl} alt={name} className="h-full w-full object-cover object-top" />
}

export default function PlayerZone({ position, playerName, characters, hits, onHit, onUndo }: Props) {
  const { bursts, shakeKey, trigger } = useTapEffects()
  const zoneRef = useRef<HTMLDivElement>(null)
  const [flashKey, setFlashKey] = useState(0)
  const accent = ACCENTS[position]
  const isBottom = position === 'bottom'

  function handleTap(e: React.MouseEvent<HTMLDivElement>) {
    const rect = zoneRef.current?.getBoundingClientRect()
    const x = rect ? e.clientX - rect.left : 0
    const y = rect ? e.clientY - rect.top : 0
    trigger(x, y)
    setFlashKey((k) => k + 1)
    onHit()
  }

  const labelBar = (
    <div className={`flex items-center justify-between gap-2 px-4 py-2 ${accent.bar}`}>
      <span className={`truncate font-display text-3xl tracking-wide ${accent.text}`}>{playerName}</span>
      <div className="flex items-center gap-2">
        <span
          className="font-display leading-none text-accent"
          style={{ fontSize: '3.75rem', textShadow: '0 0 18px rgba(255,214,10,0.9), 0 0 40px rgba(255,214,10,0.5)' }}
        >
          {hits}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onUndo()
          }}
          aria-label="Deshacer último golpe"
          className="rounded-full bg-black/40 px-2.5 py-1.5 text-sm text-white/60 hover:text-white"
        >
          ↺
        </button>
      </div>
    </div>
  )

  const grid = (
    <div className="grid flex-1 grid-cols-3 gap-1 p-1">
      {characters.map((c) => (
        <div key={c} className="relative h-full overflow-hidden rounded-lg">
          <ColumnArt name={c} />
          <span
            className={`pointer-events-none absolute inset-x-0 truncate text-center text-xs font-bold text-white ${
              isBottom
                ? 'bottom-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent px-1 pb-1.5 pt-6'
                : 'top-0 bg-gradient-to-b from-black/85 via-black/30 to-transparent px-1 pb-6 pt-1.5'
            }`}
          >
            {shortCharacterName(c)}
          </span>
        </div>
      ))}
    </div>
  )

  return (
    <div
      ref={zoneRef}
      onClick={handleTap}
      className={`relative flex flex-1 cursor-pointer select-none touch-manipulation flex-col overflow-hidden ${accent.zone} active:brightness-110`}
    >
      <div
        key={`shake-${shakeKey}`}
        className={`flex flex-1 ${isBottom ? 'flex-col-reverse' : 'flex-col'} ${shakeKey > 0 ? 'animate-shake' : ''}`}
      >
        {labelBar}
        {grid}
      </div>

      {flashKey > 0 && (
        <div key={`flash-${flashKey}`} className="hit-flash pointer-events-none absolute inset-0 bg-white" />
      )}

      {bursts.map((burst) => (
        <div key={`burst-${burst.id}`} className="pointer-events-none absolute" style={{ left: burst.x, top: burst.y }}>
          {burst.particles.map((p, i) => {
            const rad = (p.angle * Math.PI) / 180
            const tx = Math.cos(rad) * p.distance
            const ty = Math.sin(rad) * p.distance
            return (
              <span
                key={i}
                className="particle"
                style={
                  {
                    width: p.size,
                    height: p.size,
                    background: p.color,
                    left: -p.size / 2,
                    top: -p.size / 2,
                    '--tx': `${tx}px`,
                    '--ty': `${ty}px`,
                  } as React.CSSProperties
                }
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}
