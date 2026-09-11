import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import AppHeader from '../components/AppHeader'
import CharacterAvatar from '../components/CharacterAvatar'
import PageTransition from '../components/PageTransition'
import { Card } from '../components/ui'
import { GAMES } from '../data/kofData'
import { shortCharacterName } from '../lib/characterName'
import { listContainer, listExit, listItemReveal } from '../lib/motionVariants'
import { computeCharacterHitStandings, computeHitStandings } from '../lib/stats'
import { useStore } from '../store/useStore'

const MEDALS = ['🥇', '🥈', '🥉']
const PAGE_SIZE = 5

/**
 * Sección con título y una lista animada (cascada de posición + opacidad, arriba
 * hacia abajo). Si `alwaysOpen` es true, queda siempre visible sin botón de
 * colapsar (para el ranking principal). Si no, arranca cerrada y el título hace de
 * botón para expandir/colapsar; al abrirse, muestra solo los primeros `PAGE_SIZE`
 * items con un botón "Ver más" para cargar el resto.
 */
function CollapsibleList<T>({
  title,
  titleClassName,
  items,
  isOpen,
  onToggle,
  keyExtractor,
  renderItem,
  emptyLabel,
  alwaysOpen = false,
}: {
  title: string
  titleClassName: string
  items: T[]
  isOpen: boolean
  onToggle: () => void
  keyExtractor: (item: T, index: number) => string
  renderItem: (item: T, index: number) => ReactNode
  emptyLabel: string
  alwaysOpen?: boolean
}) {
  const [expanded, setExpanded] = useState(false)

  function handleToggle() {
    if (isOpen) setExpanded(false)
    onToggle()
  }

  const visible = expanded ? items : items.slice(0, PAGE_SIZE)
  const hasMore = !expanded && items.length > PAGE_SIZE

  const content =
    items.length === 0 ? (
      <motion.p variants={listItemReveal} className="px-1 py-2 text-sm text-white/50">
        {emptyLabel}
      </motion.p>
    ) : (
      <div className="space-y-2">
        {visible.map((item, i) => (
          <motion.div key={keyExtractor(item, i)} variants={listItemReveal}>
            {renderItem(item, i)}
          </motion.div>
        ))}
        {hasMore && (
          <motion.button
            variants={listItemReveal}
            type="button"
            onClick={() => setExpanded(true)}
            className="w-full rounded-xl border border-edge/60 bg-panel-2/60 py-2.5 text-center text-xs font-bold uppercase tracking-wide text-white/60 active:scale-[0.98]"
          >
            Ver más ({items.length - PAGE_SIZE})
          </motion.button>
        )}
      </div>
    )

  return (
    <div className="mb-6">
      {alwaysOpen ? (
        <h2 className={`mb-2 font-display text-2xl tracking-wide ${titleClassName}`}>{title}</h2>
      ) : (
        <button type="button" onClick={handleToggle} className="mb-2 flex w-full items-center justify-between">
          <h2 className={`font-display text-2xl tracking-wide ${titleClassName}`}>{title}</h2>
          <span className={`text-lg text-white/40 transition-transform ${isOpen ? 'rotate-180' : ''}`}>▾</span>
        </button>
      )}

      {alwaysOpen ? (
        <motion.div variants={listContainer} initial="hidden" animate="show">
          {content}
        </motion.div>
      ) : (
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div key="content" variants={listContainer} initial="hidden" animate="show" exit={listExit}>
              {content}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}

export default function StatsPage() {
  const players = useStore((s) => s.players)
  const fights = useStore((s) => s.fights)
  const clearStats = useStore((s) => s.clearStats)

  const [showPaperos, setShowPaperos] = useState(false)
  const [showRecent, setShowRecent] = useState(false)

  const finished = fights.filter((f) => f.status === 'finished')
  const standings = computeHitStandings(players, finished)
  const characterStandings = computeCharacterHitStandings(finished)
  const recent = [...finished].sort((a, b) => (b.finishedAt ?? 0) - (a.finishedAt ?? 0))

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
            <CollapsibleList
              title="Más golpeados 🥊"
              titleClassName="text-brand-2"
              items={standings}
              isOpen
              onToggle={() => {}}
              alwaysOpen
              keyExtractor={(row) => row.player.id}
              emptyLabel="Todavía no hay golpes registrados."
              renderItem={(row, i) => (
                <Card className="flex items-center gap-3 !p-2.5">
                  <span className="w-6 shrink-0 text-center text-sm">
                    {MEDALS[i] ?? <span className="text-white/40">{i + 1}</span>}
                  </span>
                  <div className="flex-1">
                    <p className="font-display text-lg tracking-wide">{row.player.name}</p>
                    <p className="text-xs text-white/50">{row.fights} peleas</p>
                  </div>
                  <span className="font-display text-2xl text-accent">{row.hitsReceived}</span>
                </Card>
              )}
            />

            <CollapsibleList
              title="Los más Paperos 🌶️"
              titleClassName="text-lime"
              items={characterStandings}
              isOpen={showPaperos}
              onToggle={() => setShowPaperos((v) => !v)}
              keyExtractor={(row) => row.character}
              emptyLabel="Todavía no se registraron movimientos especiales."
              renderItem={(row, i) => (
                <Card className="flex items-center gap-3 !p-2.5">
                  <span className="w-6 shrink-0 text-center text-sm">
                    {MEDALS[i] ?? <span className="text-white/40">{i + 1}</span>}
                  </span>
                  <CharacterAvatar name={row.character} character size="sm" />
                  <span className="flex-1 truncate font-display text-lg tracking-wide">
                    {shortCharacterName(row.character)}
                  </span>
                  <span className="font-display text-2xl text-lime">{row.hits}</span>
                </Card>
              )}
            />

            <CollapsibleList
              title="Últimas peleas"
              titleClassName="text-violet"
              items={recent}
              isOpen={showRecent}
              onToggle={() => setShowRecent((v) => !v)}
              keyExtractor={(f) => f.id}
              emptyLabel="Todavía no hay peleas finalizadas."
              renderItem={(f) => {
                const [s1, s2] = f.sides
                const leader = s1.hits === s2.hits ? null : s1.hits > s2.hits ? 0 : 1
                return (
                  <Card className="flex items-center justify-between gap-2 !p-3 text-sm">
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
              }}
            />

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
