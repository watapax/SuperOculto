import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import AppHeader from '../components/AppHeader'
import PageTransition from '../components/PageTransition'
import PlayerZone from '../components/PlayerZone'
import { GAMES } from '../data/kofData'
import { shortGameYear } from '../lib/gameLabel'
import { staggerContainer } from '../lib/motionVariants'
import { useStore } from '../store/useStore'

interface Projectile {
  id: number
  x0: number
  y0: number
  x1: number
  y1: number
  attackerSide: 0 | 1
  character: string
}

const DOT = 22
const PROJECTILE_DURATION_MS = 300
// Cantidad de "ecos" fantasma que forman la estela detrás de la cabeza del proyectil.
const TRAIL_COUNT = 5
// Cuánto se retrasa cada eco respecto al anterior (ms). A mayor valor, estela más larga.
const TRAIL_STAGGER_MS = 26

/**
 * Proyectil con estela, pensado para renderizar bien en mobile.
 *
 * Ojo: el efecto anterior dependía de animar `box-shadow` con blur junto al
 * `transform`. Eso se ve bien en desktop porque el navegador puede repintar
 * el blur en cada frame sin problema, pero `box-shadow` no compone en la GPU
 * como sí lo hacen `transform`/`opacity` — en Safari/iOS y en WebViews
 * Android de gama media el motor termina salteando esos repintados para no
 * trabar la animación, y el brillo/estela directamente no se ve.
 *
 * Por eso acá:
 * - El movimiento se hace en un único contenedor animado solo por `x`/`y`
 *   (transform puro, compositable en GPU en cualquier plataforma).
 * - El halo usa `filter: blur()` FIJO (el valor no cambia entre frames, solo
 *   se mueve junto con el contenedor), que sí es GPU-friendly.
 * - La estela es real: varias copias fantasma retrasadas unos ms, que se
 *   desvanecen con `opacity`/`scale` (nunca con blur animado).
 */
function FlyingHit({ p }: { p: Projectile }) {
  const dx = p.x1 - p.x0
  const dy = p.y1 - p.y0

  return (
    <motion.div
      className="pointer-events-none absolute z-40"
      style={{ left: p.x0, top: p.y0, willChange: 'transform' }}
      initial={{ x: 0, y: 0 }}
      animate={{ x: dx, y: dy }}
      transition={{ duration: PROJECTILE_DURATION_MS / 1000, ease: [0.3, 0, 0.2, 1] }}
    >
      {/* Halo: blur estático, no animado -> compositable en GPU */}
      <div
        className="absolute rounded-full"
        style={{
          width: DOT * 2.4,
          height: DOT * 2.4,
          left: -DOT * 1.2,
          top: -DOT * 1.2,
          background: 'radial-gradient(circle, rgba(255,214,10,0.9), rgba(255,59,92,0.55) 55%, transparent 75%)',
          filter: 'blur(6px)',
        }}
      />

      {/* Estela: ecos retrasados que se desvanecen (solo opacity/scale) */}
      {Array.from({ length: TRAIL_COUNT }, (_, i) => {
        const echoIndex = i + 1
        const size = DOT * (1 - echoIndex * 0.13)
        return (
          <motion.div
            key={echoIndex}
            className="pointer-events-none absolute rounded-full"
            style={{
              width: size,
              height: size,
              left: -size / 2,
              top: -size / 2,
              background: 'radial-gradient(circle, #ffd60a, #ff3b5c 85%)',
              willChange: 'transform, opacity',
            }}
            initial={{ x: -dx, y: -dy, opacity: 0 }}
            animate={{ x: 0, y: 0, opacity: [0, 0.55, 0] }}
            transition={{
              duration: (PROJECTILE_DURATION_MS * 0.55) / 1000,
              delay: (echoIndex * TRAIL_STAGGER_MS) / 1000,
              ease: 'easeOut',
            }}
          />
        )
      })}

      {/* Cabeza del proyectil */}
      <div
        className="absolute rounded-full"
        style={{
          width: DOT,
          height: DOT,
          left: -DOT / 2,
          top: -DOT / 2,
          background: 'radial-gradient(circle, #fff, #ffd60a 45%, #ff3b5c 90%)',
        }}
      />
    </motion.div>
  )
}

export default function LiveFightPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const fight = useStore((s) => s.fights.find((f) => f.id === id))
  const players = useStore((s) => s.players)
  const addHit = useStore((s) => s.addHit)
  const undoHit = useStore((s) => s.undoHit)
  const finishFight = useStore((s) => s.finishFight)
  const discardFight = useStore((s) => s.discardFight)

  const containerRef = useRef<HTMLDivElement>(null)
  const topZoneElRef = useRef<HTMLDivElement | null>(null)
  const bottomZoneElRef = useRef<HTMLDivElement | null>(null)
  const nextId = useRef(0)
  const timeouts = useRef(new Set<ReturnType<typeof setTimeout>>())
  const [projectiles, setProjectiles] = useState<Projectile[]>([])
  const [p1HitTrigger, setP1HitTrigger] = useState(0)
  const [p2HitTrigger, setP2HitTrigger] = useState(0)

  useEffect(
    () => () => {
      timeouts.current.forEach((t) => clearTimeout(t))
    },
    [],
  )

  if (!fight) {
    return (
      <PageTransition className="mx-auto flex h-dvh max-w-md flex-col">
        <AppHeader title="Pelea" onBack="home" />
        <div className="flex-1 px-4 py-8 text-center text-sm text-white/60">
          No se encontró esta pelea. Puede que ya haya sido finalizada o cancelada.
        </div>
      </PageTransition>
    )
  }

  const game = GAMES[fight.gameId]
  const p1 = players.find((p) => p.id === fight.sides[0].playerId)
  const p2 = players.find((p) => p.id === fight.sides[1].playerId)

  function handleCharacterTap(attackerSide: 0 | 1, character: string, el: HTMLElement) {
    const containerEl = containerRef.current
    const defenderZoneEl = attackerSide === 0 ? bottomZoneElRef.current : topZoneElRef.current
    if (!containerEl || !defenderZoneEl) return

    const containerRect = containerEl.getBoundingClientRect()
    const sourceRect = el.getBoundingClientRect()
    const targetRect = defenderZoneEl.getBoundingClientRect()

    const projectile: Projectile = {
      id: nextId.current++,
      x0: sourceRect.left + sourceRect.width / 2 - containerRect.left,
      y0: sourceRect.top + sourceRect.height / 2 - containerRect.top,
      x1: targetRect.left + targetRect.width / 2 - containerRect.left,
      y1: targetRect.top + targetRect.height / 2 - containerRect.top,
      attackerSide,
      character,
    }
    setProjectiles((prev) => [...prev, projectile])

    const timeoutId = setTimeout(() => {
      timeouts.current.delete(timeoutId)
      handleArrive(projectile)
    }, PROJECTILE_DURATION_MS)
    timeouts.current.add(timeoutId)
  }

  function handleArrive(p: Projectile) {
    setProjectiles((prev) => prev.filter((x) => x.id !== p.id))
    if (p.attackerSide === 0) {
      setP2HitTrigger((k) => k + 1)
    } else {
      setP1HitTrigger((k) => k + 1)
    }
    addHit(fight!.id, p.attackerSide, p.character)
  }

  async function handleBack() {
    if (confirm('¿Cancelar esta pelea? No se va a guardar el resultado.')) {
      try {
        await discardFight(fight!.id)
      } catch (err) {
        alert(err instanceof Error ? err.message : 'No se pudo cancelar la pelea')
      }
      navigate('/')
    }
  }

  async function handleFinish() {
    const [s1, s2] = fight!.sides
    const summary = `${p1?.name ?? '?'}: ${s1.hits} golpes\n${p2?.name ?? '?'}: ${s2.hits} golpes\n\n¿Finalizar y guardar la pelea?`
    if (confirm(summary)) {
      try {
        await finishFight(fight!.id)
        navigate('/estadisticas')
      } catch (err) {
        alert(err instanceof Error ? err.message : 'No se pudo finalizar la pelea')
      }
    }
  }

  return (
    <PageTransition className="mx-auto flex h-dvh max-w-md flex-col">
      <AppHeader
        title={`KOF ${shortGameYear(game.year)}`}
        onBack={handleBack}
        right={
          <button
            type="button"
            onClick={handleFinish}
            className="shrink-0 rounded-xl bg-gradient-to-br from-brand to-brand-2 px-4 py-2 font-display text-sm tracking-wide text-ink shadow-[0_2px_12px_-2px_var(--color-brand)] active:scale-95"
          >
            Finalizar
          </button>
        }
      />

      <motion.div
        ref={containerRef}
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="relative flex flex-1 flex-col overflow-hidden"
      >
        <PlayerZone
          position="top"
          playerName={p1?.name ?? 'Jugador 1'}
          characters={fight.sides[0].characters}
          hits={fight.sides[0].hits}
          onCharacterTap={(character, el) => handleCharacterTap(0, character, el)}
          onUndo={() => undoHit(fight.id, 0)}
          hitTrigger={p1HitTrigger}
          zoneRef={(el) => {
            topZoneElRef.current = el
          }}
        />

        <div className="relative z-20 h-3 bg-ink shadow-[0_0_16px_4px_rgba(0,0,0,0.7)]" />

        <PlayerZone
          position="bottom"
          playerName={p2?.name ?? 'Jugador 2'}
          characters={fight.sides[1].characters}
          hits={fight.sides[1].hits}
          onCharacterTap={(character, el) => handleCharacterTap(1, character, el)}
          onUndo={() => undoHit(fight.id, 1)}
          hitTrigger={p2HitTrigger}
          zoneRef={(el) => {
            bottomZoneElRef.current = el
          }}
        />

        {projectiles.map((p) => (
          <FlyingHit key={p.id} p={p} />
        ))}

        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
          <span
            className="font-display text-[7rem] leading-none text-accent"
            style={{
              WebkitTextStroke: '3px #0a0714',
              textShadow: '0 0 50px rgba(255,214,10,0.85), 0 4px 16px rgba(0,0,0,0.9)',
            }}
          >
            VS
          </span>
        </div>
      </motion.div>
    </PageTransition>
  )
}
