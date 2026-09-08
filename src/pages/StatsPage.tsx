import { useState } from 'react'
import AppHeader from '../components/AppHeader'
import PageTransition from '../components/PageTransition'
import { Card } from '../components/ui'
import { GAMES } from '../data/kofData'
import { computeHitStandings } from '../lib/stats'
import { useStore } from '../store/useStore'

const MEDALS = ['🥇', '🥈', '🥉']

export default function StatsPage() {
  const players = useStore((s) => s.players)
  const fights = useStore((s) => s.fights)
  const clearStats = useStore((s) => s.clearStats)

  const [showRecent, setShowRecent] = useState(false)

  const finished = fights.filter((f) => f.status === 'finished')
  const standings = computeHitStandings(players, finished)
  const recent = [...finished].sort((a, b) => (b.finishedAt ?? 0) - (a.finishedAt ?? 0)).slice(0, 15)

  function playerName(id: string) {
    return players.find((p) => p.id === id)?.name ?? '???'
  }

  async function handleClear() {
    if (
      confirm('¿Eliminar el ranking y todas las estadísticas? Esto borra todas las peleas finalizadas y no se puede deshacer.')
    ) {
      try {
        await clearStats()
      } catch (err) {
        alert(err instanceof Error ? err.message : 'No se pudo eliminar el ranking')
      }
    }
  }

  return (
    <PageTransition className="flex flex-1 flex-col">
      <AppHeader title="Ranking" onBack="home" />
      <div className="flex-1 px-4 py-5">
        {finished.length === 0 ? (
          <p className="text-center text-sm text-white/50">
            Todavía no hay peleas finalizadas. Creá una pelea y tocá los golpes recibidos para empezar a sumar.
          </p>
        ) : (
          <>
            <h2 className="mb-2 font-display text-2xl tracking-wide text-brand-2">Más golpeados 🥊</h2>
            <Card className="mb-6 overflow-x-auto !p-0 border-brand/30 shadow-[0_0_24px_-12px_var(--color-brand)]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-edge/50 text-left text-[11px] font-bold uppercase tracking-widest text-white/50">
                    <th className="py-2.5 pl-3 pr-2">#</th>
                    <th className="py-2.5 pr-2">Jugador</th>
                    <th className="py-2.5 pr-2 text-right">Peleas</th>
                    <th className="py-2.5 pr-3 text-right">Ocultos</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((row, i) => (
                    <tr key={row.player.id} className="border-b border-edge/20 last:border-0">
                      <td className="py-2.5 pl-3 pr-2">{MEDALS[i] ?? <span className="text-white/40">{i + 1}</span>}</td>
                      <td className="py-2.5 pr-2 font-display text-base tracking-wide">{row.player.name}</td>
                      <td className="py-2.5 pr-2 text-right text-white/60">{row.fights}</td>
                      <td className="py-2.5 pr-3 text-right font-display text-2xl text-accent">{row.hitsReceived}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            <button
              type="button"
              onClick={() => setShowRecent((v) => !v)}
              className="mb-2 flex w-full items-center justify-between"
            >
              <h2 className="font-display text-2xl tracking-wide text-violet">Últimas peleas</h2>
              <span className={`text-lg text-white/40 transition-transform ${showRecent ? 'rotate-180' : ''}`}>▾</span>
            </button>
            {showRecent && (
              <div className="mb-6 space-y-2">
                {recent.map((f) => {
                  const [s1, s2] = f.sides
                  const leader = s1.hits === s2.hits ? null : s1.hits > s2.hits ? 0 : 1
                  return (
                    <Card key={f.id} className="flex items-center justify-between gap-2 !p-3 text-sm">
                      <span className="rounded-full bg-panel-2 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white/50">
                        {GAMES[f.gameId].name}
                      </span>
                      <span className={leader === 0 ? 'font-display text-lg text-accent' : 'text-white/70'}>
                        {playerName(s1.playerId)} ({s1.hits})
                      </span>
                      <span className="text-white/30">vs</span>
                      <span className={leader === 1 ? 'font-display text-lg text-accent' : 'text-white/70'}>
                        {playerName(s2.playerId)} ({s2.hits})
                      </span>
                    </Card>
                  )
                })}
              </div>
            )}

            <button
              type="button"
              onClick={handleClear}
              className="w-full rounded-xl border border-brand/40 bg-brand/10 py-3 text-center text-xs font-bold uppercase tracking-wide text-brand-2 active:scale-[0.98]"
            >
              Eliminar ranking y estadísticas
            </button>
          </>
        )}
      </div>
    </PageTransition>
  )
}
