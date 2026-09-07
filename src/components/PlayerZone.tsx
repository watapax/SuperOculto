import { useRef, useState } from 'react'
import CharacterAvatar from './CharacterAvatar'
import { useTapEffects } from '../hooks/useTapEffects'

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
    zone: 'bg-gradient-to-b from-[#3a0a0a] to-[#1c0505]',
    bar: 'bg-black/35',
  },
  bottom: {
    zone: 'bg-gradient-to-t from-[#0a1830] to-[#050d1c]',
    bar: 'bg-black/35',
  },
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
    <div className={`flex items-center justify-between px-4 py-2 ${accent.bar}`}>
      <span className="truncate font-display text-sm tracking-wide text-white">{playerName}</span>
      <div className="flex items-center gap-2">
        <span className="font-display text-3xl leading-none text-accent">{hits}</span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onUndo()
          }}
          aria-label="Deshacer último golpe"
          className="rounded-full bg-black/40 px-2 py-1 text-xs text-white/60 hover:text-white"
        >
          ↺
        </button>
      </div>
    </div>
  )

  const grid = (
    <div className="flex flex-1 flex-wrap content-center items-center justify-center gap-3 p-4">
      {characters.map((c) => (
        <div key={c} className="flex flex-col items-center gap-1">
          <CharacterAvatar name={c} size="lg" />
          <span className="max-w-[64px] truncate text-center text-[10px] text-white/60">{c}</span>
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
