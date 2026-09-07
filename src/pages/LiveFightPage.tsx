import { useNavigate, useParams } from 'react-router-dom'
import AppHeader from '../components/AppHeader'
import PlayerZone from '../components/PlayerZone'
import { GAMES } from '../data/kofData'
import { useStore } from '../store/useStore'

function shortYear(year: number) {
  return year < 2000 ? `'${year % 100}` : `${year}`
}

export default function LiveFightPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const fight = useStore((s) => s.fights.find((f) => f.id === id))
  const players = useStore((s) => s.players)
  const addHit = useStore((s) => s.addHit)
  const undoHit = useStore((s) => s.undoHit)
  const finishFight = useStore((s) => s.finishFight)
  const discardFight = useStore((s) => s.discardFight)

  if (!fight) {
    return (
      <div className="mx-auto flex h-dvh max-w-md flex-col">
        <AppHeader title="Pelea" onBack="home" />
        <div className="flex-1 px-4 py-8 text-center text-sm text-white/60">
          No se encontró esta pelea. Puede que ya haya sido finalizada o cancelada.
        </div>
      </div>
    )
  }

  const game = GAMES[fight.gameId]
  const p1 = players.find((p) => p.id === fight.sides[0].playerId)
  const p2 = players.find((p) => p.id === fight.sides[1].playerId)

  async function handleBack() {
    if (confirm('¿Cancelar esta pelea? No se va a guardar el resultado.')) {
      try {
        await discardFight(fight!.id)
      } catch (err) {
        alert(err instanceof Error ? err.message : 'No se pudo cancelar la pelea')
      }
      navigate('/')
    }
  }

  async function handleFinish() {
    const [s1, s2] = fight!.sides
    const summary = `${p1?.name ?? '?'}: ${s1.hits} golpes\n${p2?.name ?? '?'}: ${s2.hits} golpes\n\n¿Finalizar y guardar la pelea?`
    if (confirm(summary)) {
      try {
        await finishFight(fight!.id)
        navigate('/estadisticas')
      } catch (err) {
        alert(err instanceof Error ? err.message : 'No se pudo finalizar la pelea')
      }
    }
  }

  return (
    <div className="mx-auto flex h-dvh max-w-md flex-col">
      <AppHeader
        title={`KOF ${shortYear(game.year)}`}
        onBack={handleBack}
        right={
          <button
            type="button"
            onClick={handleFinish}
            className="shrink-0 rounded-xl bg-gradient-to-br from-brand to-brand-2 px-4 py-2 font-display text-sm tracking-wide text-ink shadow-[0_2px_12px_-2px_var(--color-brand)] active:scale-95"
          >
            Finalizar
          </button>
        }
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <PlayerZone
          position="top"
          playerName={p1?.name ?? 'Jugador 1'}
          characters={fight.sides[0].characters}
          hits={fight.sides[0].hits}
          onHit={() => addHit(fight.id, 0)}
          onUndo={() => undoHit(fight.id, 0)}
        />

        <div className="relative z-20 flex items-center justify-center gap-4 border-y border-edge/60 bg-ink px-4 py-3">
          <span className="font-display text-lg tracking-wide text-brand-2">KOF</span>
          <span className="font-display text-3xl leading-none text-accent drop-shadow-[0_0_14px_rgba(255,214,10,0.7)]">
            VS
          </span>
          <span className="font-display text-lg tracking-wide text-cyan">{shortYear(game.year)}</span>
        </div>

        <PlayerZone
          position="bottom"
          playerName={p2?.name ?? 'Jugador 2'}
          characters={fight.sides[1].characters}
          hits={fight.sides[1].hits}
          onHit={() => addHit(fight.id, 1)}
          onUndo={() => undoHit(fight.id, 1)}
        />
      </div>
    </div>
  )
}
