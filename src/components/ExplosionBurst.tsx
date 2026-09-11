import { useEffect, useMemo, type CSSProperties } from 'react'

const SPARK_COUNT = 26
const EXPLOSION_MS = 800

interface Spark {
  id: number
  rotDeg: number
  distPx: number
  lenPx: number
  delayMs: number
}

function buildSparks(seed: number): Spark[] {
  // `seed` solo fuerza que useMemo recalcule en cada explosión; el patrón en sí es aleatorio
  // (ángulos parejos + jitter, para que se vea como una explosión real y no un patrón geométrico).
  void seed
  return Array.from({ length: SPARK_COUNT }, (_, i) => {
    const angleDeg = (360 / SPARK_COUNT) * i + (Math.random() * 14 - 7)
    return {
      id: i,
      rotDeg: angleDeg,
      distPx: 100 + Math.random() * 70,
      lenPx: 14 + Math.random() * 16,
      delayMs: Math.random() * 60,
    }
  })
}

/**
 * Explosión de pantalla completa: flash blanco + onda expansiva + chispas radiales
 * desde el centro. Pensada como transición al confirmar "PELEAR" — se monta una vez
 * por cada `triggerKey` distinto y avisa con `onComplete` cuando termina.
 */
export default function ExplosionBurst({ triggerKey, onComplete }: { triggerKey: number; onComplete?: () => void }) {
  const sparks = useMemo(() => buildSparks(triggerKey), [triggerKey])

  useEffect(() => {
    if (!onComplete) return
    const t = setTimeout(onComplete, EXPLOSION_MS)
    return () => clearTimeout(t)
  }, [triggerKey, onComplete])

  return (
    <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden">
      <div className="explosion-flash absolute inset-0 bg-[#fff8e0]" />
      <div className="explosion-shockwave absolute left-1/2 top-1/2 h-5 w-5 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.9),rgba(255,214,10,0.6)_40%,rgba(255,59,92,0.25)_65%,transparent_78%)]" />
      {sparks.map((s) => (
        <div
          key={s.id}
          className="explosion-spark"
          style={
            {
              width: s.lenPx,
              '--rot': `${s.rotDeg}deg`,
              '--dist': `${s.distPx}px`,
              '--delay': `${s.delayMs}ms`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}
