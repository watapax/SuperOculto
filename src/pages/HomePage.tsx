import { Link } from 'react-router-dom'
import FighterSilhouette from '../components/FighterSilhouette'

const BADGE_CLIP = {
  clipPath:
    'polygon(22px 0, calc(100% - 22px) 0, 100% 22px, 100% calc(100% - 22px), calc(100% - 22px) 100%, 22px 100%, 0 calc(100% - 22px), 0 22px)',
}

function CrossedFistsIcon() {
  return (
    <svg viewBox="0 0 40 40" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 30 L17 19 L14 12 L19 8 L23 13 L20 19" />
      <path d="M34 30 L23 19 L26 12 L21 8 L17 13 L20 19" />
      <path d="M13 11 L9 8 M27 11 L31 8" />
    </svg>
  )
}

function PlusBadgeIcon() {
  return (
    <svg viewBox="0 0 40 40" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
      <path d="M20 9 V31 M9 20 H31" />
    </svg>
  )
}

function BarsIcon() {
  return (
    <svg viewBox="0 0 40 40" className="h-7 w-7" fill="currentColor">
      <rect x="6" y="20" width="7" height="14" rx="1.5" />
      <rect x="17" y="12" width="7" height="22" rx="1.5" />
      <rect x="28" y="6" width="7" height="28" rx="1.5" />
    </svg>
  )
}

const items = [
  {
    to: '/pelea/nueva',
    title: ['CREAR', 'PELEA'],
    Icon: CrossedFistsIcon,
    from: '#ff3b5c',
    to2: '#7a0e1c',
    ring: '#ff8a3d',
  },
  {
    to: '/jugadores',
    title: ['AGREGAR', 'JUGADOR'],
    Icon: PlusBadgeIcon,
    from: '#22d3ee',
    to2: '#0b3a5c',
    ring: '#7dd3fc',
  },
  {
    to: '/estadisticas',
    title: ['ESTADÍSTICAS'],
    Icon: BarsIcon,
    from: '#ffd60a',
    to2: '#7a5c02',
    ring: '#ffe680',
  },
]

function HeroBanner() {
  return (
    <div className="relative -mx-5 mb-8 h-64 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(100deg, #4a0a12 0%, #ff3b5c 40%, #2a1a40 50%, #1d4ed8 60%, #0a1230 100%)',
        }}
      />
      <div className="halftone-dots absolute inset-0 opacity-25 mix-blend-overlay" />

      <div className="absolute -left-10 -top-4 h-[115%] w-[58%] opacity-70">
        <FighterSilhouette className="h-full w-full text-black/60" />
      </div>
      <div className="absolute -right-10 -top-4 h-[115%] w-[58%] opacity-70" style={{ transform: 'scaleX(-1)' }}>
        <FighterSilhouette className="h-full w-full text-black/60" />
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(60% 55% at 50% 50%, rgba(10,7,20,0.55), transparent 72%)' }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/30" />

      <div className="relative flex h-full flex-col items-center justify-center">
        <span
          className="text-comic text-comic-fill font-display text-6xl leading-[0.85] tracking-wide"
          style={{ '--fill-from': '#ffe680', '--fill-to': '#ff3b5c', transform: 'rotate(-2deg)' } as React.CSSProperties}
        >
          SUPER
        </span>
        <span
          className="text-comic text-comic-fill mt-1 font-display text-6xl leading-[0.85] tracking-wide"
          style={{ '--fill-from': '#ffffff', '--fill-to': '#c7d2fe', transform: 'rotate(1deg)' } as React.CSSProperties}
        >
          OCULTOS
        </span>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col px-5 pb-8 pt-6">
      <HeroBanner />

      <div className="flex flex-col gap-5">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            style={{
              ...BADGE_CLIP,
              background: `linear-gradient(115deg, ${item.from} 0%, ${item.to2} 100%)`,
              border: `2px solid ${item.ring}`,
            }}
            className="relative flex h-20 items-center gap-3 overflow-hidden pl-3 pr-6 shadow-lg shadow-black/50 transition-transform active:scale-[0.97]"
          >
            <div className="halftone-dots pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay" />

            <div
              className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-black/25 text-white"
              style={{ border: `2px solid ${item.ring}`, boxShadow: 'inset 0 0 0 2px rgba(0,0,0,0.35)' }}
            >
              <item.Icon />
            </div>

            <div className="relative flex flex-1 flex-col leading-[0.9]">
              {item.title.map((line) => (
                <span
                  key={line}
                  className="text-comic text-comic-fill font-display text-3xl tracking-wide"
                  style={{ '--fill-from': '#fff', '--fill-to': item.ring } as React.CSSProperties}
                >
                  {line}
                </span>
              ))}
            </div>

            <span className="relative font-display text-4xl text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.7)]">›</span>

            <div className="pointer-events-none absolute -right-3 bottom-0 h-full w-16 opacity-30" style={{ transform: 'scaleX(-1)' }}>
              <FighterSilhouette className="h-full w-full text-black" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
