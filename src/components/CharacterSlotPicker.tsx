import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import CharacterAvatar from './CharacterAvatar'
import { shortCharacterName } from '../lib/characterName'
import { easeOutSine } from '../lib/motionVariants'
import type { GameTeam } from '../types'

export const REQUIRED_CHARACTERS = 3
const FLIGHT_MS = 420

interface Flyer {
  id: number
  character: string
  x0: number
  y0: number
  x1: number
  y1: number
  fromSize: number
  toSize: number
}

/** El "thumb" que viaja desde la celda tocada hasta el slot, con la misma técnica GPU-safe (solo transform/opacity) de la estela de golpes en la pelea en vivo. */
function FlyingThumb({ f }: { f: Flyer }) {
  const dx = f.x1 - f.x0
  const dy = f.y1 - f.y0
  return (
    <motion.div
      className="pointer-events-none absolute z-30"
      style={{ left: f.x0, top: f.y0, willChange: 'transform' }}
      initial={{ x: 0, y: 0 }}
      animate={{ x: dx, y: dy }}
      transition={{ duration: FLIGHT_MS / 1000, ease: easeOutSine }}
    >
      <motion.div
        className="absolute rounded-2xl"
        style={{ left: -f.fromSize / 2, top: -f.fromSize / 2 }}
        initial={{ width: f.fromSize, height: f.fromSize, scale: 1 }}
        animate={{ width: f.fromSize, height: f.fromSize, scale: f.toSize / f.fromSize }}
        transition={{ duration: FLIGHT_MS / 1000, ease: easeOutSine }}
      >
        <CharacterAvatar name={f.character} character fill selected />
      </motion.div>
    </motion.div>
  )
}

function Slot({
  character,
  index,
  pulseKey,
  onRemove,
  slotRef,
}: {
  character: string | null
  index: number
  pulseKey: number
  onRemove: () => void
  slotRef: (el: HTMLDivElement | null) => void
}) {
  return (
    <div
      ref={slotRef}
      className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-2 transition-colors ${
        character ? 'border-transparent' : 'border-dashed border-edge/70 bg-ink/40'
      }`}
    >
      <AnimatePresence mode="popLayout">
        {character ? (
          <motion.button
            key={`${character}-${pulseKey}`}
            type="button"
            onClick={onRemove}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.15 } }}
            transition={{ duration: 0.28, ease: easeOutSine }}
            className="group absolute inset-0"
          >
            <CharacterAvatar name={character} character fill selected />
            <span className="absolute inset-0 flex items-center justify-center bg-ink/0 opacity-0 transition-opacity group-active:bg-ink/50 group-active:opacity-100">
              <X className="h-5 w-5 text-white" strokeWidth={3} />
            </span>
          </motion.button>
        ) : (
          <span className="flex h-full w-full items-center justify-center font-display text-lg text-white/20">
            {index + 1}
          </span>
        )}
      </AnimatePresence>
    </div>
  )
}

function SlotDock({
  slots,
  pulseKeys,
  onRemove,
  slotRefs,
  playerName,
  accentText,
}: {
  slots: (string | null)[]
  pulseKeys: number[]
  onRemove: (character: string) => void
  slotRefs: (el: HTMLDivElement | null, index: number) => void
  playerName?: string
  accentText: string
}) {
  return (
    <div className="flex flex-col items-center gap-2 py-3">
      <div className="flex gap-3">
        {slots.map((character, i) => (
          <Slot
            key={i}
            character={character}
            index={i}
            pulseKey={pulseKeys[i]}
            onRemove={() => character && onRemove(character)}
            slotRef={(el) => slotRefs(el, i)}
          />
        ))}
      </div>
      {playerName && <span className={`font-display text-sm tracking-widest ${accentText}`}>{playerName.toUpperCase()}</span>}
    </div>
  )
}

export default function CharacterSlotPicker({
  options,
  teams,
  selected,
  onChange,
  playerName,
  accentText,
}: {
  options: string[]
  teams?: GameTeam[]
  selected: string[]
  onChange: (next: string[]) => void
  playerName?: string
  accentText: string
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const cellRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const slotRefs = useRef<(HTMLDivElement | null)[]>([])
  const selectedRef = useRef(selected)
  const [pending, setPending] = useState<string[]>([])
  const [flyers, setFlyers] = useState<Flyer[]>([])
  const [pulseKeys, setPulseKeys] = useState([0, 0, 0])
  const nextId = useRef(0)
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>())

  // Mantiene siempre la última selección confirmada disponible para los
  // callbacks async de `commit` (los refs se acceden en efectos, no en render).
  useEffect(() => {
    selectedRef.current = selected
  }, [selected])

  useEffect(
    () => () => {
      timers.current.forEach((t) => clearTimeout(t))
    },
    [],
  )

  // Un personaje puede quedar en `pending` desde que se tocó hasta que
  // termina de "volar"; una vez que el padre confirma la selección (llega
  // por props), se lo deriva como ya no pendiente en este mismo render.
  const visiblePending = pending.filter((c) => !selected.includes(c))
  const effectiveSelected = [...selected, ...visiblePending]
  const atMax = effectiveSelected.length >= REQUIRED_CHARACTERS

  function rectCenter(el: HTMLElement | null) {
    const root = rootRef.current
    if (!el || !root) return null
    const r = el.getBoundingClientRect()
    const rootR = root.getBoundingClientRect()
    return { x: r.left + r.width / 2 - rootR.left, y: r.top + r.height / 2 - rootR.top, size: r.width }
  }

  function flyTo(character: string, sourceEl: HTMLElement | null, slotIndex: number, delay: number) {
    const src = rectCenter(sourceEl)
    const dst = rectCenter(slotRefs.current[slotIndex])
    if (!src || !dst) {
      commit(character)
      return
    }
    const id = nextId.current++
    const start = setTimeout(() => {
      timers.current.delete(start)
      setFlyers((prev) => [
        ...prev,
        { id, character, x0: src.x, y0: src.y, x1: dst.x, y1: dst.y, fromSize: src.size, toSize: dst.size },
      ])
    }, delay)
    timers.current.add(start)

    const arrive = setTimeout(
      () => {
        timers.current.delete(arrive)
        setFlyers((prev) => prev.filter((f) => f.id !== id))
        setPulseKeys((prev) => {
          const next = [...prev]
          next[slotIndex] += 1
          return next
        })
        commit(character)
      },
      delay + FLIGHT_MS,
    )
    timers.current.add(arrive)
  }

  function commit(character: string) {
    if (selectedRef.current.includes(character)) return
    const next = [...selectedRef.current, character]
    selectedRef.current = next
    onChange(next)
  }

  function handleTapCharacter(character: string) {
    if (selected.includes(character)) {
      onChange(selected.filter((c) => c !== character))
      return
    }
    if (visiblePending.includes(character) || atMax) return
    const slotIndex = selected.length + visiblePending.length
    setPending((prev) => [...prev, character])
    flyTo(character, cellRefs.current[character], slotIndex, 0)
  }

  function handleRemove(character: string) {
    onChange(selected.filter((c) => c !== character))
  }

  function handleToggleTeam(team: GameTeam, sourceEl: HTMLElement | null) {
    const isActive = team.characters.length === selected.length && team.characters.every((c) => selected.includes(c))
    if (isActive) {
      onChange([])
      setPending([])
      return
    }
    onChange([])
    setPending([...team.characters])
    team.characters.forEach((c, i) => flyTo(c, sourceEl, i, i * 90))
  }

  const slots: (string | null)[] = [0, 1, 2].map((i) => selected[i] ?? null)

  if (teams && teams.length > 0) {
    return (
      <div ref={rootRef} className="relative">
        <p className="mb-2 text-[11px] font-medium text-white/50">Este juego se elige por equipo completo.</p>
        <div className="max-h-64 space-y-1.5 overflow-y-auto rounded-xl border border-edge/50 bg-ink/40 p-1.5">
          {teams.map((team) => {
            const active = team.characters.length === selected.length && team.characters.every((c) => selected.includes(c))
            return (
              <button
                type="button"
                key={team.name}
                onClick={(e) => handleToggleTeam(team, e.currentTarget)}
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

        <SlotDock
          slots={slots}
          pulseKeys={pulseKeys}
          onRemove={handleRemove}
          slotRefs={(el, i) => {
            slotRefs.current[i] = el
          }}
          playerName={playerName}
          accentText={accentText}
        />

        {flyers.map((f) => (
          <FlyingThumb key={f.id} f={f} />
        ))}
      </div>
    )
  }

  return (
    <div ref={rootRef} className="relative">
      <div className="grid max-h-[46vh] grid-cols-4 gap-px overflow-y-auto rounded-xl border border-edge/50 bg-ink/40 p-0.5">
        {options.map((c) => {
          const active = selected.includes(c)
          const isPending = visiblePending.includes(c)
          const disabled = !active && (atMax || isPending)
          return (
            <button
              type="button"
              key={c}
              ref={(el) => {
                cellRefs.current[c] = el
              }}
              onClick={() => handleTapCharacter(c)}
              disabled={disabled}
              className={`flex flex-col items-center gap-0.5 rounded-lg p-px text-center transition-all ${
                active ? 'bg-brand/20' : disabled ? 'opacity-30' : 'hover:bg-panel-2 active:scale-95'
              }`}
            >
              <CharacterAvatar name={c} size="lg" selected={active} character />
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

      <SlotDock
        slots={slots}
        pulseKeys={pulseKeys}
        onRemove={handleRemove}
        slotRefs={(el, i) => {
          slotRefs.current[i] = el
        }}
        playerName={playerName}
        accentText={accentText}
      />

      {flyers.map((f) => (
        <FlyingThumb key={f.id} f={f} />
      ))}
    </div>
  )
}
