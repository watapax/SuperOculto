import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import PlayersPage from './pages/PlayersPage'
import NewFightPage from './pages/NewFightPage'
import LiveFightPage from './pages/LiveFightPage'
import StatsPage from './pages/StatsPage'

export default function App() {
  return (
    <Routes>
      <Route path="pelea/:id" element={<LiveFightPage />} />
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="jugadores" element={<PlayersPage />} />
        <Route path="pelea/nueva" element={<NewFightPage />} />
        <Route path="estadisticas" element={<StatsPage />} />
      </Route>
    </Routes>
  )
}
