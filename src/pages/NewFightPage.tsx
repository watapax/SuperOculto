import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppHeader from '../components/AppHeader'
import CharacterPicker from '../components/CharacterPicker'
import { Select } from '../components/ui'
import { GAME_LIST, GAMES } from '../data/kofData'
import { useStore } from '../store/useStore'
import type { GameId } from '../types'

const REQUIRED_CHARACTERS = 3

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

  const [gameId, setGameId] = useState<GameId>(GAME_LIST[0].id)
  const [player1Id, setPlayer1Id] = useState('')
  const [player2Id, setPlayer2Id] = useState('')
  const [char1, setChar1] = useState<string[]>([])
  const [char2, setChar2] = useState<string[]>([])

  const gameCharacters = GAMES[gameId].characters

  const canStart =
    player1Id &&
    player2Id &&
    player1Id !== player2Id &&
    char1.length === REQUIRED_CHARACTERS &&
    char2.length === REQUIRED_CHARACTERS

  function handleGameChange(next: GameId) {
    setGameId(next)
    setChar1([])
    setChar2([])
  }

  async function handleStart() {
    if (!canStart) return
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

  return (
    <div className="flex flex-1 flex-col">
      <AppHeader title="Crear pelea" onBack="home" />
      <div className="flex-1 px-4 py-5">
        <div className="mb-5">
          <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-white/50">Juego</label>
          <Select value={gameId} onChange={(e) => handleGameChange(e.target.value as GameId)} className="w-full">
            {GAME_LIST.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </Select>
        </div>

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
              className="flex h-[4.5rem] w-[4.5rem] flex-col items-center justify-center rounded-full border-4 border-ink bg-gradient-to-br from-brand to-brand-2 text-center font-display text-sm leading-tight text-ink shadow-[0_0_28px_-4px_var(--color-brand)] transition-transform disabled:cursor-not-allowed disabled:from-edge disabled:to-edge disabled:opacity-50 disabled:shadow-none enabled:active:scale-95"
            >
              <span>COMEN</span>
              <span>ZAR!</span>
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
