import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, ChevronRight, Flame, Gamepad2, UserRound } from 'lucide-react'
import AppHeader from '../components/AppHeader'
import CharacterSlotPicker, { REQUIRED_CHARACTERS } from '../components/CharacterSlotPicker'
import PageTransition from '../components/PageTransition'
import PlayerAvatar from '../components/PlayerAvatar'
import CharacterAvatar from '../components/CharacterAvatar'
import { Select } from '../components/ui'
import { GAME_LIST, GAMES } from '../data/kofData'
import { shortGameYear } from '../lib/gameLabel'
import { shortCharacterName } from '../lib/characterName'
import { wizardStep } from '../lib/motionVariants'
import { useStore } from '../store/useStore'
import type { GameId, GameTeam, Player } from '../types'

const GAME_ACCENTS = [
  ['#ff3b5c', '#ff8a3d'],
  ['#0891b2', '#22d3ee'],
  ['#7c3aed', '#b389ff'],
  ['#16a34a', '#9fef00'],
  ['#c026d3', '#ff6bd6'],
  ['#ea580c', '#ffd60a'],
  ['#1d4ed8', '#38bdf8'],
  ['#be123c', '#fb7185'],
  ['#0d9488', '#5eead4'],
]

type Step = 'game' | 'player1' | 'player2' | 'ready'

function StepTransition({ stepKey, children }: { stepKey: string; children: ReactNode }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stepKey}
        initial={wizardStep.initial}
        animate={wizardStep.animate}
        exit={wizardStep.exit}
        transition={wizardStep.transition}
        className="flex flex-1 flex-col overflow-hidden"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

function GameSelectStep({ onSelect }: { onSelect: (id: GameId) => void }) {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-5">
      <p className="mb-4 flex items-center justify-center gap-2 text-center text-sm text-white/60">
        <Gamepad2 className="h-4 w-4 text-brand-2" />
        Elegí el juego para esta pelea
      </p>
      <div className="flex flex-col gap-3">
        {GAME_LIST.map((g, i) => {
          const [from, to] = GAME_ACCENTS[i % GAME_ACCENTS.length]
          const teamCount = g.teams?.length
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => onSelect(g.id)}
              className="relative flex items-center gap-3 overflow-hidden rounded-2xl border border-white/10 p-3 text-left shadow-lg shadow-black/40 transition-transform active:scale-[0.97]"
              style={{ background: `linear-gradient(115deg, ${from}, ${to})` }}
            >
              <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent" />
              <span className="pointer-events-none absolute -right-3 -top-3 font-display text-7xl leading-none text-white/10">
                {shortGameYear(g.year)}
              </span>
              <span
                className="relative shrink-0 font-display italic leading-none text-white"
                style={{
                  fontSize: '1.9rem',
                  WebkitTextStroke: '1.5px rgba(10,7,20,0.9)',
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                }}
              >
                KOF
              </span>
              <span className="relative flex flex-1 flex-col">
                <span className="font-display text-2xl leading-none text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
                  {shortGameYear(g.year)}
                </span>
                <span className="mt-1 text-[11px] font-medium text-white/80">
                  {teamCount ? `${teamCount} equipos` : `${g.characters.length} personajes`}
                </span>
              </span>
              <ChevronRight className="relative h-6 w-6 shrink-0 text-white/70" />
            </button>
          )
        })}
      </div>
    </div>
  )
}

interface PlayerStepProps {
  side: 'p1' | 'p2'
  players: Player[]
  excludeId: string
  playerId: string
  onPlayerChange: (id: string) => void
  characters: string[]
  onCharactersChange: (next: string[]) => void
  gameCharacters: string[]
  gameTeams?: GameTeam[]
  onConfirm: () => void
}

function PlayerStep({
  side,
  players,
  excludeId,
  playerId,
  onPlayerChange,
  characters,
  onCharactersChange,
  gameCharacters,
  gameTeams,
  onConfirm,
}: PlayerStepProps) {
  const accent =
    side === 'p1'
      ? {
          text: 'text-brand-2',
          ring: 'ring-brand',
          from: 'from-brand',
          to: 'to-brand-2',
          shadow: 'shadow-[0_0_28px_-6px_var(--color-brand)]',
        }
      : {
          text: 'text-cyan',
          ring: 'ring-cyan',
          from: 'from-cyan-2',
          to: 'to-cyan',
          shadow: 'shadow-[0_0_28px_-6px_var(--color-cyan)]',
        }

  const player = players.find((p) => p.id === playerId)
  const canConfirm = characters.length === REQUIRED_CHARACTERS

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mb-4 flex items-center gap-2">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${accent.from} ${accent.to} ${accent.shadow}`}
          >
            <UserRound className="h-5 w-5 text-ink" strokeWidth={2.5} />
          </span>
          <span className={`font-display text-2xl tracking-wide ${accent.text}`}>
            {side === 'p1' ? 'Jugador 1' : 'Jugador 2'}
          </span>
        </div>

        <Select value={playerId} onChange={(e) => onPlayerChange(e.target.value)} className="mb-4 w-full">
          <option value="">Elegir jugador...</option>
          {players
            .filter((p) => p.id !== excludeId)
            .map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
        </Select>

        {playerId ? (
          <CharacterSlotPicker
            key={playerId}
            options={gameCharacters}
            teams={gameTeams}
            selected={characters}
            onChange={onCharactersChange}
            playerName={player?.name}
            accentText={accent.text}
          />
        ) : (
          <p className="rounded-xl border border-dashed border-edge/50 p-4 text-center text-xs text-white/40">
            Elegí un jugador para armar su equipo
          </p>
        )}
      </div>

      <div className="border-t border-edge/60 bg-ink/80 px-4 py-3 backdrop-blur-sm">
        <button
          type="button"
          onClick={onConfirm}
          disabled={!canConfirm}
          className={`flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br ${accent.from} ${accent.to} py-3.5 font-display text-lg tracking-wide text-ink transition-all disabled:cursor-not-allowed disabled:from-edge disabled:to-edge disabled:text-white/40 enabled:active:scale-[0.98] ${canConfirm ? accent.shadow : ''}`}
        >
          <CheckCircle2 className="h-5 w-5" />
          Confirmar equipo
        </button>
      </div>
    </div>
  )
}

function FighterSummaryRow({
  player,
  characters,
  align,
  accentText,
}: {
  player?: Player
  characters: string[]
  align: 'start' | 'end'
  accentText: string
}) {
  return (
    <div className={`flex items-center gap-3 ${align === 'end' ? 'flex-row-reverse text-right' : ''}`}>
      <PlayerAvatar name={player?.name ?? '?'} avatar={player?.avatar} size="md" />
      <div className="flex-1">
        <p className={`font-display text-xl tracking-wide ${accentText}`}>{player?.name ?? '?'}</p>
        <div className={`mt-1.5 flex gap-1.5 ${align === 'end' ? 'flex-row-reverse' : ''}`}>
          {characters.map((c) => (
            <div key={c} className="flex flex-col items-center gap-0.5">
              <CharacterAvatar name={c} character size="sm" />
              <span className="line-clamp-1 max-w-[3.2rem] text-[10px] font-medium text-white/60">
                {shortCharacterName(c)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ReadyStep({
  gameId,
  player1,
  char1,
  player2,
  char2,
  onFight,
}: {
  gameId: GameId
  player1?: Player
  char1: string[]
  player2?: Player
  char2: string[]
  onFight: () => void
}) {
  return (
    <div className="flex flex-1 flex-col justify-between overflow-y-auto px-5 py-6">
      <FighterSummaryRow player={player1} characters={char1} align="start" accentText="text-brand-2" />

      <div className="flex flex-col items-center gap-4 py-8">
        <span className="rounded-full bg-panel-2 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white/50">
          KOF {shortGameYear(GAMES[gameId].year)}
        </span>
        <motion.button
          type="button"
          onClick={onFight}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
          whileTap={{ scale: 0.92 }}
          className="flex h-36 w-36 flex-col items-center justify-center gap-1 rounded-full border-4 border-ink bg-gradient-to-br from-brand via-brand-2 to-accent text-ink shadow-[0_0_50px_-6px_var(--color-brand)]"
        >
          <Flame className="h-9 w-9" strokeWidth={2.5} />
          <span className="font-display text-2xl tracking-wide">PELEAR</span>
        </motion.button>
      </div>

      <FighterSummaryRow player={player2} characters={char2} align="end" accentText="text-cyan" />
    </div>
  )
}

export default function NewFightPage() {
  const players = useStore((s) => s.players)
  const createFight = useStore((s) => s.createFight)
  const navigate = useNavigate()

  const [step, setStep] = useState<Step>('game')
  const [gameId, setGameId] = useState<GameId | null>(null)
  const [player1Id, setPlayer1Id] = useState('')
  const [player2Id, setPlayer2Id] = useState('')
  const [char1, setChar1] = useState<string[]>([])
  const [char2, setChar2] = useState<string[]>([])

  const gameCharacters = gameId ? GAMES[gameId].characters : []
  const gameTeams = gameId ? GAMES[gameId].teams : undefined
  const player1 = players.find((p) => p.id === player1Id)
  const player2 = players.find((p) => p.id === player2Id)

  function handleSelectGame(id: GameId) {
    setGameId(id)
    setChar1([])
    setChar2([])
    setStep('player1')
  }

  async function handleStart() {
    if (!gameId || !player1Id || !player2Id) return
    try {
      const id = await createFight({
        gameId,
        player1Id,
        player1Characters: char1,
        player2Id,
        player2Characters: char2,
      })
      navigate(`/pelea/${id}`, { replace: true })
    } catch (err) {
      alert(err instanceof Error ? err.message : 'No se pudo crear la pelea')
    }
  }

  if (players.length < 2) {
    return (
      <PageTransition className="flex flex-1 flex-col">
        <AppHeader title="Crear pelea" onBack="home" />
        <div className="flex-1 px-4 py-8 text-center">
          <p className="text-sm text-white/60">
            Necesitás al menos 2 jugadores cargados para armar una pelea.
          </p>
        </div>
      </PageTransition>
    )
  }

  const titles: Record<Step, string> = {
    game: 'Crear pelea',
    player1: 'Jugador 1',
    player2: 'Jugador 2',
    ready: '¡Todo listo!',
  }

  function handleBack() {
    if (step === 'player1') setStep('game')
    else if (step === 'player2') setStep('player1')
    else if (step === 'ready') setStep('player2')
  }

  return (
    <PageTransition className="flex flex-1 flex-col overflow-hidden">
      <AppHeader title={titles[step]} onBack={step === 'game' ? 'home' : handleBack} />
      <StepTransition stepKey={step}>
        {step === 'game' && <GameSelectStep onSelect={handleSelectGame} />}

        {step === 'player1' && gameId && (
          <PlayerStep
            side="p1"
            players={players}
            excludeId={player2Id}
            playerId={player1Id}
            onPlayerChange={(id) => {
              setPlayer1Id(id)
              setChar1([])
            }}
            characters={char1}
            onCharactersChange={setChar1}
            gameCharacters={gameCharacters}
            gameTeams={gameTeams}
            onConfirm={() => setStep('player2')}
          />
        )}

        {step === 'player2' && gameId && (
          <PlayerStep
            side="p2"
            players={players}
            excludeId={player1Id}
            playerId={player2Id}
            onPlayerChange={(id) => {
              setPlayer2Id(id)
              setChar2([])
            }}
            characters={char2}
            onCharactersChange={setChar2}
            gameCharacters={gameCharacters}
            gameTeams={gameTeams}
            onConfirm={() => setStep('ready')}
          />
        )}

        {step === 'ready' && gameId && (
          <ReadyStep gameId={gameId} player1={player1} char1={char1} player2={player2} char2={char2} onFight={handleStart} />
        )}
      </StepTransition>
    </PageTransition>
  )
}
