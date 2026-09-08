import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import PlayersPage from './pages/PlayersPage'
import NewFightPage from './pages/NewFightPage'
import LiveFightPage from './pages/LiveFightPage'
import StatsPage from './pages/StatsPage'
import { useStore } from './store/useStore'

export default function App() {
  const hydrated = useStore((s) => s.hydrated)
  const hydrationError = useStore((s) => s.hydrationError)
  const hydrate = useStore((s) => s.hydrate)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  if (!hydrated) {
    return (
      <div className="flex h-dvh items-center justify-center text-sm text-white/50">
        Cargando datos del campeonato...
      </div>
    )
  }

  if (hydrationError) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-sm text-white/70">No se pudo conectar con el servidor.</p>
        <p className="text-xs text-white/40">{hydrationError}</p>
        <button
          type="button"
          onClick={() => hydrate()}
          className="rounded-md bg-brand px-4 py-2 text-sm font-bold text-ink"
        >
          Reintentar
        </button>
      </div>
    )
  }

  return <AnimatedRoutes />
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="pelea/:id" element={<LiveFightPage />} />
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="jugadores" element={<PlayersPage />} />
          <Route path="pelea/nueva" element={<NewFightPage />} />
          <Route path="estadisticas" element={<StatsPage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}
