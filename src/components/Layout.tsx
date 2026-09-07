import { NavLink, Outlet } from 'react-router-dom'

const links = [
  { to: '/', label: 'Posiciones', end: true },
  { to: '/jugadores', label: 'Jugadores' },
  { to: '/partidas', label: 'Partidas' },
  { to: '/temporadas', label: 'Temporadas' },
]

export default function Layout() {
  return (
    <div className="min-h-full flex flex-col">
      <header className="sticky top-0 z-10 border-b border-edge/60 bg-panel/90 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/icons/icon-64.png" alt="" className="h-8 w-8 rounded-md" />
            <span className="font-display text-lg tracking-wide text-brand-2">KOF TORNEO</span>
          </div>
          <nav className="flex gap-1 text-sm">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 font-medium transition-colors ${
                    isActive ? 'bg-brand text-ink' : 'text-white/80 hover:bg-panel-2 hover:text-accent'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        <Outlet />
      </main>
      <footer className="mx-auto w-full max-w-5xl px-4 pb-6 text-center text-xs text-edge">
        Datos guardados solo en este dispositivo.
      </footer>
    </div>
  )
}
