import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppHeader from '../components/AppHeader'
import CharacterPicker from '../components/CharacterPicker'
import { Card, Select } from '../components/ui'
import { GAME_LIST, GAMES } from '../data/kofData'
import { useStore } from '../store/useStore'
import type { GameId } from '../types'

function PlayerPanel({
  label,
  players,
  excludeId,
  playerId,
  onPlayerChange,
  characters,
  onCharactersChange,
  gameCharacters,
}: {
  label: string
  players: { id: string; name: string }[]
  excludeId: string
  playerId: string
  onPlayerChange: (id: string) => void
  characters: string[]
  onCharactersChange: (next: string[]) => void
  gameCharacters: string[]
}) {
  return (
    <Card>
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-brand-2">{label}</span>
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
        <p className="rounded-md border border-dashed border-edge/50 p-4 text-center text-xs text-white/40">
          Elegí un jugador para poder elegir sus personajes
        </p>
      )}
    </Card>
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

  const canStart = player1Id && player2Id && player1Id !== player2Id && char1.length > 0 && char2.length > 0

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
        <div className="mb-4">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/50">Juego</label>
          <Select value={gameId} onChange={(e) => handleGameChange(e.target.value as GameId)} className="w-full">
            {GAME_LIST.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="relative">
          <PlayerPanel
            label="Jugador 1"
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

          <div className="relative z-10 -my-5 flex justify-center">
            <button
              type="button"
              onClick={handleStart}
              disabled={!canStart}
              className="flex h-16 w-16 flex-col items-center justify-center rounded-full border-4 border-ink bg-brand text-center font-display text-[11px] font-bold leading-tight text-ink shadow-lg shadow-black/50 transition-transform disabled:cursor-not-allowed disabled:opacity-40 enabled:active:scale-95"
            >
              <span>COMEN</span>
              <span>ZAR!</span>
            </button>
          </div>

          <PlayerPanel
            label="Jugador 2"
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
