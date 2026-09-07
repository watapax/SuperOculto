import { Link } from 'react-router-dom'

const items = [
  { to: '/pelea/nueva', label: 'Crear pelea', icon: '⚔️', desc: 'Elegí a los dos jugadores y arrancá el contador de golpes.' },
  { to: '/jugadores', label: 'Agregar jugador', icon: '➕', desc: 'Sumá gente al roster del campeonato.' },
  { to: '/estadisticas', label: 'Estadísticas', icon: '📊', desc: 'Quién se llevó más golpes especiales.' },
]

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col px-5 pb-8 pt-10">
      <div className="mb-10">
        <h1 className="font-display text-4xl leading-none tracking-wide text-brand-2">SUPER</h1>
        <h1 className="font-display text-4xl leading-none tracking-wide text-accent">OCULTOS</h1>
        <p className="mt-3 text-sm text-white/50">Campeonato de golpes especiales de The King of Fighters.</p>
      </div>

      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex items-center gap-4 rounded-2xl border border-edge/60 bg-panel/70 p-5 shadow-lg shadow-black/30 transition-transform active:scale-[0.98]"
          >
            <span className="text-3xl">{item.icon}</span>
            <span className="flex-1">
              <span className="block font-display text-lg text-white">{item.label}</span>
              <span className="block text-xs text-white/50">{item.desc}</span>
            </span>
            <span className="text-white/30">›</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
