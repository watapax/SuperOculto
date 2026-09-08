import { FLAME_BASE_Y, FLAME_CENTER_X, FLAME_INNER_FRAMES, FLAME_OUTER_FRAMES, FLAME_VIEWBOX } from '../data/flamePaths'

const DUR_S = 2.2
const WOBBLE_DUR_S = 5.4

/** Cierra el ciclo volviendo al primer frame, y arma el string `values` + `keyTimes` para el <animate>. */
function loopValues(frames: string[]) {
  const values = [...frames, frames[0]]
  const steps = values.length
  const keyTimes = values.map((_, i) => (i / (steps - 1)).toFixed(4)).join(';')
  return { values: values.join(';'), keyTimes }
}

const outerAnim = loopValues(FLAME_OUTER_FRAMES)
const innerAnim = loopValues(FLAME_INNER_FRAMES)
const hotcoreCy = FLAME_BASE_Y - 65

/**
 * Llama reconstruida a partir de fuego_1.gif (19 frames vectorizados con potrace,
 * remuestreados y alineados para un morph fluido — ver src/data/flamePaths.ts).
 * Incluye un núcleo blanco/cálido cerca de la base (la parte más caliente de una
 * llama real) y una turbulencia SVG sutil para que se sienta "viva" sin temblar.
 */
export default function FlameBurst({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox={FLAME_VIEWBOX} overflow="visible" aria-hidden="true">
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
        <path fill="#fb7520" d={FLAME_OUTER_FRAMES[0]}>
          <animate
            attributeName="d"
            dur={`${DUR_S}s`}
            repeatCount="indefinite"
            calcMode="linear"
            keyTimes={outerAnim.keyTimes}
            values={outerAnim.values}
          />
        </path>
        <path fill="#fef1ab" d={FLAME_INNER_FRAMES[0]}>
          <animate
            attributeName="d"
            dur={`${DUR_S}s`}
            repeatCount="indefinite"
            calcMode="linear"
            keyTimes={innerAnim.keyTimes}
            values={innerAnim.values}
          />
        </path>
        <ellipse
          className="flame-hotcore"
          cx={FLAME_CENTER_X}
          cy={hotcoreCy}
          rx={52}
          ry={46}
          fill="url(#flame-hot-grad)"
        />
      </g>
    </svg>
  )
}
