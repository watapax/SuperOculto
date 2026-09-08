import { Link } from 'react-router-dom'
import PageTransition from '../components/PageTransition'

const items = [
  {
    to: '/pelea/nueva',
    label: 'Crear pelea',
    icon: '⚔️',
    from: 'from-brand',
    to2: 'to-brand-2',
    ring: 'hover:border-brand/60',
  },
  {
    to: '/jugadores',
    label: 'Jugadores',
    icon: '➕',
    from: 'from-cyan-2',
    to2: 'to-cyan',
    ring: 'hover:border-cyan/60',
  },
  {
    to: '/estadisticas',
    label: 'Ranking',
    icon: '📊',
    from: 'from-violet',
    to2: 'to-accent',
    ring: 'hover:border-violet/60',
  },
]

export default function HomePage() {
  return (
    <PageTransition className="flex flex-1 flex-col px-5 pb-8 pt-12">
      <div className="mb-10">
        <img
          src="/brand/logo.png"
          alt="Super Ocultos"
          className="mx-auto w-full max-w-sm drop-shadow-[0_4px_24px_rgba(255,59,92,0.35)]"
        />
        <p className="mt-4 text-center text-sm text-white/50">Campeonato de ocultos de KOF</p>
      </div>

      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex items-center gap-4 rounded-2xl border border-edge/60 bg-panel/80 p-5 shadow-lg shadow-black/40 backdrop-blur-sm transition-all active:scale-[0.97] ${item.ring}`}
          >
            <span
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${item.from} ${item.to2} text-2xl shadow-lg`}
            >
              {item.icon}
            </span>
            <span className="flex-1 font-display text-2xl tracking-wide text-white">{item.label}</span>
            <span className="text-2xl text-white/25">›</span>
          </Link>
        ))}
      </div>
    </PageTransition>
  )
}
