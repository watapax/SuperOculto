import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppHeader from '../components/AppHeader'
import CharacterPicker from '../components/CharacterPicker'
import { Select } from '../components/ui'
import { GAME_LIST, GAMES } from '../data/kofData'
import { shortGameYear } from '../lib/gameLabel'
import { useStore } from '../store/useStore'
import type { GameId } from '../types'

const REQUIRED_CHARACTERS = 3

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

function GameSelectStep({ onSelect }: { onSelect: (id: GameId) => void }) {
  return (
    <div className="flex-1 px-4 py-5">
      <p className="mb-4 text-center text-sm text-white/60">Elegí el juego para esta pelea</p>
      <div className="grid grid-cols-3 gap-3">
        {GAME_LIST.map((g, i) => {
          const [from, to] = GAME_ACCENTS[i % GAME_ACCENTS.length]
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => onSelect(g.id)}
              className="relative flex aspect-square flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/10 p-2 text-center shadow-lg shadow-black/40 transition-transform active:scale-95"
              style={{ background: `linear-gradient(155deg, ${from}, ${to})` }}
            >
              <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent" />
              <span className="relative font-display text-[10px] tracking-[0.25em] text-white/80">KOF</span>
              <span className="relative font-display text-3xl leading-none text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
                {shortGameYear(g.year)}
              </span>
              <span className="relative mt-1 text-[9px] font-medium text-white/70">
                {g.characters.length} personajes
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function PlayerPanel({
  label,
  side,
  players,
  excludeId,
  playerId,
  onPlayerChange,
  characters,
  onCharactersChange,
  gameCharacters,
}: {
  label: string
  side: 'p1' | 'p2'
  players: { id: string; name: string }[]
  excludeId: string
  playerId: string
  onPlayerChange: (id: string) => void
  characters: string[]
  onCharactersChange: (next: string[]) => void
  gameCharacters: string[]
}) {
  const accent =
    side === 'p1'
      ? { border: 'border-brand/50', text: 'text-brand-2', glow: 'shadow-[0_0_24px_-8px_var(--color-brand)]' }
      : { border: 'border-cyan/50', text: 'text-cyan', glow: 'shadow-[0_0_24px_-8px_var(--color-cyan)]' }

  return (
    <div className={`rounded-2xl border ${accent.border} bg-panel/80 p-4 ${accent.glow}`}>
      <span className={`mb-3 block font-display text-xl tracking-wide ${accent.text}`}>{label}</span>
      <Select value={playerId} onChange={(e) => onPlayerChange(e.target.value)} className="mb-3 w-full">
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
        <CharacterPicker options={gameCharacters} selected={characters} onChange={onCharactersChange} />
      ) : (
        <p className="rounded-xl border border-dashed border-edge/50 p-4 text-center text-xs text-white/40">
          Elegí un jugador para armar su equipo
        </p>
      )}
    </div>
  )
}

export default function NewFightPage() {
  const players = useStore((s) => s.players)
  const createFight = useStore((s) => s.createFight)
  const navigate = useNavigate()

  const [step, setStep] = useState<'game' | 'players'>('game')
  const [gameId, setGameId] = useState<GameId | null>(null)
  const [player1Id, setPlayer1Id] = useState('')
  const [player2Id, setPlayer2Id] = useState('')
  const [char1, setChar1] = useState<string[]>([])
  const [char2, setChar2] = useState<string[]>([])

  const gameCharacters = gameId ? GAMES[gameId].characters : []

  const canStart =
    gameId &&
    player1Id &&
    player2Id &&
    player1Id !== player2Id &&
    char1.length === REQUIRED_CHARACTERS &&
    char2.length === REQUIRED_CHARACTERS

  function handleSelectGame(id: GameId) {
    setGameId(id)
    setChar1([])
    setChar2([])
    setStep('players')
  }

  async function handleStart() {
    if (!canStart || !gameId) return
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
      <div className="flex flex-1 flex-col">
        <AppHeader title="Crear pelea" onBack="home" />
        <div className="flex-1 px-4 py-8 text-center">
          <p className="text-sm text-white/60">
            Necesitás al menos 2 jugadores cargados para armar una pelea.
          </p>
        </div>
      </div>
    )
  }

  if (step === 'game' || !gameId) {
    return (
      <div className="flex flex-1 flex-col">
        <AppHeader title="Crear pelea" onBack="home" />
        <GameSelectStep onSelect={handleSelectGame} />
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col">
      <AppHeader title={`KOF ${shortGameYear(GAMES[gameId].year)}`} onBack={() => setStep('game')} />
      <div className="flex-1 px-4 py-5">
        <div className="relative space-y-6">
          <PlayerPanel
            label="Jugador 1"
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
          />

          <div className="relative z-10 -my-9 flex justify-center">
            <button
              type="button"
              onClick={handleStart}
              disabled={!canStart}
              className="flex h-20 w-20 flex-col items-center justify-center rounded-full border-4 border-ink bg-gradient-to-br from-brand to-brand-2 text-center font-display text-base leading-tight tracking-wide text-ink shadow-[0_0_28px_-4px_var(--color-brand)] transition-transform disabled:cursor-not-allowed disabled:from-edge disabled:to-edge disabled:opacity-50 disabled:shadow-none enabled:active:scale-95"
            >
              PELEAR!
            </button>
          </div>

          <PlayerPanel
            label="Jugador 2"
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
          />
        </div>
      </div>
    </div>
  )
}
