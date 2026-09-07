import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import PlayersPage from './pages/PlayersPage'
import MatchesPage from './pages/MatchesPage'
import StandingsPage from './pages/StandingsPage'
import SeasonsPage from './pages/SeasonsPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<StandingsPage />} />
        <Route path="jugadores" element={<PlayersPage />} />
        <Route path="partidas" element={<MatchesPage />} />
        <Route path="temporadas" element={<SeasonsPage />} />
      </Route>
    </Routes>
  )
}
