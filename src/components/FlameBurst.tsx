import { useEffect, useState } from 'react'
import { preloadFlameData } from '../lib/flamePreload'

const DUR_S = 2.2
const WOBBLE_DUR_S = 5.4

/** Cierra el ciclo volviendo al primer frame, y arma el string `values` + `keyTimes` para el <animate>. */
function loopValues(frames: string[]) {
  const values = [...frames, frames[0]]
  const steps = values.length
  const keyTimes = values.map((_, i) => (i / (steps - 1)).toFixed(4)).join(';')
  return { values: values.join(';'), keyTimes }
}

/**
 * Llama reconstruida a partir de fuego_1.gif (19 frames vectorizados con potrace,
 * remuestreados y alineados para un morph fluido — ver src/data/flamePaths.ts).
 * Incluye un núcleo blanco/cálido cerca de la base (la parte más caliente de una
 * llama real) y una turbulencia SVG sutil para que se sienta "viva" sin temblar.
 *
 * Los datos se cargan mediante `preloadFlameData()` (import() dinámico, con su propio
 * chunk) en vez de venir embebidos acá — quien use este componente debe llamar
 * `preloadFlameData()` apenas convenga, bastante antes de que este componente se monte,
 * para que ya esté en caché y no haya ningún salto/frame pegado esperando la carga.
 */
export default function FlameBurst({ className }: { className?: string }) {
  const [data, setData] = useState<{
    outer: ReturnType<typeof loopValues>
    inner: ReturnType<typeof loopValues>
    firstOuter: string
    firstInner: string
    cx: number
    hotcoreCy: number
    viewBox: string
  } | null>(null)

  useEffect(() => {
    let cancelled = false
    preloadFlameData().then((mod) => {
      if (cancelled) return
      setData({
        outer: loopValues(mod.FLAME_OUTER_FRAMES),
        inner: loopValues(mod.FLAME_INNER_FRAMES),
        firstOuter: mod.FLAME_OUTER_FRAMES[0],
        firstInner: mod.FLAME_INNER_FRAMES[0],
        cx: mod.FLAME_CENTER_X,
        hotcoreCy: mod.FLAME_BASE_Y - 65,
        viewBox: mod.FLAME_VIEWBOX,
      })
    })
    return () => {
      cancelled = true
    }
  }, [])

  if (!data) return null

  return (
    <svg className={className} viewBox={data.viewBox} overflow="visible" aria-hidden="true">
      <defs>
        <radialGradient id="flame-hot-grad" cx="50%" cy="55%" r="55%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="45%" stopColor="#fffbe0" />
          <stop offset="100%" stopColor="#fef1ab" stopOpacity="0" />
        </radialGradient>
        {/* Turbulencia suave (baja frecuencia, escala chica): bamboleo tipo cartoon, no tiritón. */}
        <filter id="flame-wobble" x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.018" numOctaves={2} seed={5} result="noise">
            <animate
              attributeName="baseFrequency"
              dur={`${WOBBLE_DUR_S}s`}
              values="0.010 0.014;0.014 0.022;0.010 0.014"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={7} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>

      <g filter="url(#flame-wobble)">
        <path fill="#fb7520" d={data.firstOuter}>
          <animate
            attributeName="d"
            dur={`${DUR_S}s`}
            repeatCount="indefinite"
            calcMode="linear"
            keyTimes={data.outer.keyTimes}
            values={data.outer.values}
          />
        </path>
        <path fill="#fef1ab" d={data.firstInner}>
          <animate
            attributeName="d"
            dur={`${DUR_S}s`}
            repeatCount="indefinite"
            calcMode="linear"
            keyTimes={data.inner.keyTimes}
            values={data.inner.values}
          />
        </path>
        <ellipse className="flame-hotcore" cx={data.cx} cy={data.hotcoreCy} rx={52} ry={46} fill="url(#flame-hot-grad)" />
      </g>
    </svg>
  )
}
