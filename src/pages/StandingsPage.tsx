import { useMemo, useState } from 'react'
import { GAME_LIST } from '../data/kofData'
import { computeCharacterStats, computeStandings, filterMatches } from '../lib/stats'
import { useStore } from '../store/useStore'
import type { GameId } from '../types'
import { Card, PageTitle, Select } from '../components/ui'

export default function StandingsPage() {
  const players = useStore((s) => s.players)
  const matches = useStore((s) => s.matches)
  const seasons = useStore((s) => s.seasons)
  const activeSeasonId = useStore((s) => s.activeSeasonId)

  const [seasonId, setSeasonId] = useState<string>('all')
  const [gameId, setGameId] = useState<GameId | 'all'>('all')

  const effectiveSeasonId = seasonId === 'all' ? undefined : seasonId

  const filtered = useMemo(
    () => filterMatches(matches, { seasonId: effectiveSeasonId, gameId }),
    [matches, effectiveSeasonId, gameId],
  )

  const standings = useMemo(() => computeStandings(players, filtered), [players, filtered])
  const characterStats = useMemo(() => computeCharacterStats(filtered).slice(0, 15), [filtered])

  const activeSeasonName = seasons.find((s) => s.id === activeSeasonId)?.name

  return (
    <div>
      <PageTitle subtitle={activeSeasonName ? `Temporada activa: ${activeSeasonName}` : undefined}>
        Posiciones y estadísticas
      </PageTitle>

      <div className="mb-6 flex flex-wrap gap-3">
        <Select value={seasonId} onChange={(e) => setSeasonId(e.target.value)}>
          <option value="all">Todas las temporadas</option>
          {seasons.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </Select>
        <Select value={gameId} onChange={(e) => setGameId(e.target.value as GameId | 'all')}>
          <option value="all">Todos los juegos</option>
          {GAME_LIST.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </Select>
      </div>

      {players.length === 0 ? (
        <p className="text-sm text-white/50">Agregá jugadores y registrá partidas para ver las estadísticas.</p>
      ) : (
        <>
          <Card className="mb-6 overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-edge/50 text-left text-xs uppercase tracking-wide text-white/50">
                  <th className="py-2 pr-2">#</th>
                  <th className="py-2 pr-2">Jugador</th>
                  <th className="py-2 pr-2 text-right">PJ</th>
                  <th className="py-2 pr-2 text-right">G</th>
                  <th className="py-2 pr-2 text-right">P</th>
                  <th className="py-2 pr-2 text-right">% Victorias</th>
                  <th className="py-2 pr-2 text-right">Rounds (F-C)</th>
                  <th className="py-2 pr-2 text-right">Puntos</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((row, i) => (
                  <tr key={row.player.id} className="border-b border-edge/20 last:border-0">
                    <td className="py-2 pr-2 text-white/50">{i + 1}</td>
                    <td className="py-2 pr-2 font-semibold">{row.player.name}</td>
                    <td className="py-2 pr-2 text-right">{row.matchesPlayed}</td>
                    <td className="py-2 pr-2 text-right text-emerald-400">{row.wins}</td>
                    <td className="py-2 pr-2 text-right text-red-400">{row.losses}</td>
                    <td className="py-2 pr-2 text-right">{(row.winRate * 100).toFixed(0)}%</td>
                    <td className="py-2 pr-2 text-right text-white/60">
                      {row.roundsWon}-{row.roundsLost}
                    </td>
                    <td className="py-2 pr-2 text-right font-bold text-accent">{row.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <h2 className="mb-3 font-display text-lg text-brand-2">Personajes más usados</h2>
          {characterStats.length === 0 ? (
            <p className="text-sm text-white/50">Sin partidas registradas todavía en este filtro.</p>
          ) : (
            <Card className="overflow-x-auto">
              <table className="w-full min-w-[420px] text-sm">
                <thead>
                  <tr className="border-b border-edge/50 text-left text-xs uppercase tracking-wide text-white/50">
                    <th className="py-2 pr-2">Personaje</th>
                    <th className="py-2 pr-2 text-right">Usos</th>
                    <th className="py-2 pr-2 text-right">G</th>
                    <th className="py-2 pr-2 text-right">P</th>
                    <th className="py-2 pr-2 text-right">% Victorias</th>
                  </tr>
                </thead>
                <tbody>
                  {characterStats.map((c) => (
                    <tr key={c.character} className="border-b border-edge/20 last:border-0">
                      <td className="py-2 pr-2 font-semibold">{c.character}</td>
                      <td className="py-2 pr-2 text-right">{c.timesUsed}</td>
                      <td className="py-2 pr-2 text-right text-emerald-400">{c.wins}</td>
                      <td className="py-2 pr-2 text-right text-red-400">{c.losses}</td>
                      <td className="py-2 pr-2 text-right">{(c.winRate * 100).toFixed(0)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
