import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import CharacterAvatar from './CharacterAvatar'
import { useTapEffects } from '../hooks/useTapEffects'
import { shortCharacterName } from '../lib/characterName'
import { getCharacterFullImageUrl } from '../data/characterFullImages'
import { staggerItem, zoneContentStagger, zoneSlideInBottom, zoneSlideInTop } from '../lib/motionVariants'

interface Props {
  position: 'top' | 'bottom'
  playerName: string
  characters: string[]
  hits: number
  /** El jugador de ESTA zona ejecutó el movimiento con `character`; el elemento tocado se usa como origen del proyectil. */
  onCharacterTap: (character: string, el: HTMLElement) => void
  onUndo: () => void
  /** Se incrementa cuando ESTE jugador recibe un golpe (llega el proyectil) — dispara explosión + shake. */
  hitTrigger: number
  zoneRef?: (el: HTMLDivElement | null) => void
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

export default function PlayerZone({
  position,
  playerName,
  characters,
  hits,
  onCharacterTap,
  onUndo,
  hitTrigger,
  zoneRef,
}: Props) {
  const { bursts, shakeKey, trigger } = useTapEffects()
  const zoneElRef = useRef<HTMLDivElement | null>(null)
  const shakeWrapRef = useRef<HTMLDivElement>(null)
  const [flashKey, setFlashKey] = useState(0)
  const [pulseKey, setPulseKey] = useState(0)
  const prevHits = useRef(hits)
  const accent = ACCENTS[position]
  const isBottom = position === 'bottom'
  const zoneVariants = isBottom ? zoneSlideInBottom : zoneSlideInTop

  useEffect(() => {
    if (hits > prevHits.current) setPulseKey((k) => k + 1)
    prevHits.current = hits
  }, [hits])

  useEffect(() => {
    if (hitTrigger === 0) return
    const rect = zoneElRef.current?.getBoundingClientRect()
    trigger(rect ? rect.width / 2 : 0, rect ? rect.height / 2 : 0)
    setFlashKey((k) => k + 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hitTrigger])

  useEffect(() => {
    if (shakeKey === 0) return
    const el = shakeWrapRef.current
    if (!el) return
    el.classList.remove('animate-shake')
    void el.offsetWidth
    el.classList.add('animate-shake')
  }, [shakeKey])

  const labelBar = (
    <motion.div
      variants={staggerItem}
      className={`flex items-center justify-between gap-2 px-4 py-2 ${accent.bar} ${position === 'top' ? 'pt-14' : ''}`}
    >
      <span className={`truncate font-display text-3xl tracking-wide ${accent.text}`}>{playerName}</span>
      <div className="flex items-center gap-2">
        <span
          key={`hits-${pulseKey}`}
          className={`font-display leading-none text-accent ${pulseKey > 0 ? 'animate-pulse-scale' : ''}`}
          style={{ fontSize: '5rem', textShadow: '0 0 20px rgba(255,214,10,0.95), 0 0 46px rgba(255,214,10,0.55)' }}
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
    </motion.div>
  )

  const grid = (
    <div className="grid flex-1 grid-cols-3 gap-2 p-2">
      {characters.map((c) => (
        <motion.div
          key={c}
          variants={staggerItem}
          onClick={(e) => onCharacterTap(c, e.currentTarget)}
          className="relative h-full cursor-pointer touch-manipulation overflow-hidden rounded-lg transition-transform active:scale-[0.96] active:brightness-110"
        >
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
        </motion.div>
      ))}
    </div>
  )

  return (
    <motion.div
      ref={(el) => {
        zoneElRef.current = el
        zoneRef?.(el)
      }}
      variants={zoneVariants}
      className={`relative flex flex-1 select-none flex-col overflow-hidden ${accent.zone}`}
    >
      <motion.div
        ref={shakeWrapRef}
        variants={zoneContentStagger}
        className={`flex flex-1 ${isBottom ? 'flex-col-reverse' : 'flex-col'}`}
      >
        {labelBar}
        {grid}
      </motion.div>

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
    </motion.div>
  )
}
