import { useMemo, useState } from 'react'
import { GAME_LIST, GAMES } from '../data/kofData'
import { useStore } from '../store/useStore'
import type { GameId } from '../types'
import { Button, Card, Input, Label, PageTitle, Select } from '../components/ui'

export default function MatchesPage() {
  const players = useStore((s) => s.players)
  const matches = useStore((s) => s.matches)
  const seasons = useStore((s) => s.seasons)
  const activeSeasonId = useStore((s) => s.activeSeasonId)
  const addMatch = useStore((s) => s.addMatch)
  const removeMatch = useStore((s) => s.removeMatch)
  const getPlayerCharacters = useStore((s) => s.getPlayerCharacters)

  const [gameId, setGameId] = useState<GameId>(GAME_LIST[0].id)
  const [player1Id, setPlayer1Id] = useState('')
  const [player2Id, setPlayer2Id] = useState('')
  const [char1, setChar1] = useState('')
  const [char2, setChar2] = useState('')
  const [score1, setScore1] = useState(2)
  const [score2, setScore2] = useState(0)
  const [winnerId, setWinnerId] = useState<string | null>(null)

  const game = GAMES[gameId]
  const seasonName = seasons.find((s) => s.id === activeSeasonId)?.name ?? 'Sin temporada'

  const char1Options = useMemo(() => {
    if (!player1Id) return game.characters
    const preferred = getPlayerCharacters(player1Id, gameId)
    return [...preferred, ...game.characters.filter((c) => !preferred.includes(c))]
  }, [player1Id, gameId, game, getPlayerCharacters])

  const char2Options = useMemo(() => {
    if (!player2Id) return game.characters
    const preferred = getPlayerCharacters(player2Id, gameId)
    return [...preferred, ...game.characters.filter((c) => !preferred.includes(c))]
  }, [player2Id, gameId, game, getPlayerCharacters])

  const canSave =
    activeSeasonId &&
    player1Id &&
    player2Id &&
    player1Id !== player2Id &&
    char1 &&
    char2 &&
    winnerId &&
    (winnerId === player1Id || winnerId === player2Id)

  function resetForm() {
    setPlayer1Id('')
    setPlayer2Id('')
    setChar1('')
    setChar2('')
    setScore1(2)
    setScore2(0)
    setWinnerId(null)
  }

  function handleSave() {
    if (!canSave || !activeSeasonId) return
    addMatch({
      seasonId: activeSeasonId,
      gameId,
      player1Id,
      player1Character: char1,
      player1Score: score1,
      player2Id,
      player2Character: char2,
      player2Score: score2,
      winnerId,
    })
    resetForm()
  }

  const recentMatches = [...matches]
    .filter((m) => m.seasonId === activeSeasonId)
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 25)

  function playerName(id: string) {
    return players.find((p) => p.id === id)?.name ?? '???'
  }

  if (players.length < 2) {
    return (
      <div>
        <PageTitle>Partidas</PageTitle>
        <p className="text-sm text-white/60">Necesitás al menos 2 jugadores cargados para registrar partidas.</p>
      </div>
    )
  }

  return (
    <div>
      <PageTitle subtitle={`Registrando en: ${seasonName}`}>Partidas</PageTitle>

      <Card className="mb-6 space-y-4">
        <div>
          <Label>Juego</Label>
          <Select
            value={gameId}
            onChange={(e) => {
              setGameId(e.target.value as GameId)
              setChar1('')
              setChar2('')
            }}
            className="w-full sm:w-auto"
          >
            {GAME_LIST.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <PlayerSlot
            title="Jugador 1"
            players={players}
            selectedPlayerId={player1Id}
            onPlayerChange={(id) => {
              setPlayer1Id(id)
              setChar1('')
            }}
            excludeId={player2Id}
            characterOptions={char1Options}
            character={char1}
            onCharacterChange={setChar1}
            score={score1}
            onScoreChange={setScore1}
            isWinner={winnerId === player1Id}
            onMarkWinner={() => player1Id && setWinnerId(player1Id)}
          />
          <PlayerSlot
            title="Jugador 2"
            players={players}
            selectedPlayerId={player2Id}
            onPlayerChange={(id) => {
              setPlayer2Id(id)
              setChar2('')
            }}
            excludeId={player1Id}
            characterOptions={char2Options}
            character={char2}
            onCharacterChange={setChar2}
            score={score2}
            onScoreChange={setScore2}
            isWinner={winnerId === player2Id}
            onMarkWinner={() => player2Id && setWinnerId(player2Id)}
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-white/50">Marcá el ganador con la estrella en su panel.</p>
          <Button onClick={handleSave} disabled={!canSave}>
            Guardar partida
          </Button>
        </div>
      </Card>

      <h2 className="mb-3 font-display text-lg text-brand-2">Últimas partidas</h2>
      {recentMatches.length === 0 && <p className="text-sm text-white/50">Todavía no hay partidas en esta temporada.</p>}
      <div className="space-y-2">
        {recentMatches.map((m) => (
          <Card key={m.id} className="flex flex-wrap items-center justify-between gap-2 !p-3 text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-panel-2 px-2 py-0.5 text-xs text-white/60">{GAMES[m.gameId].name}</span>
              <span className={m.winnerId === m.player1Id ? 'font-bold text-accent' : ''}>
                {playerName(m.player1Id)} ({m.player1Character})
              </span>
              <span className="text-white/40">{m.player1Score} - {m.player2Score}</span>
              <span className={m.winnerId === m.player2Id ? 'font-bold text-accent' : ''}>
                {playerName(m.player2Id)} ({m.player2Character})
              </span>
            </div>
            <Button variant="danger" className="!px-2 !py-1" onClick={() => removeMatch(m.id)}>
              Borrar
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}

function PlayerSlot(props: {
  title: string
  players: { id: string; name: string }[]
  selectedPlayerId: string
  onPlayerChange: (id: string) => void
  excludeId: string
  characterOptions: string[]
  character: string
  onCharacterChange: (c: string) => void
  score: number
  onScoreChange: (n: number) => void
  isWinner: boolean
  onMarkWinner: () => void
}) {
  const {
    title,
    players,
    selectedPlayerId,
    onPlayerChange,
    excludeId,
    characterOptions,
    character,
    onCharacterChange,
    score,
    onScoreChange,
    isWinner,
    onMarkWinner,
  } = props
  return (
    <div className={`rounded-lg border p-3 ${isWinner ? 'border-accent bg-accent/10' : 'border-edge/50'}`}>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-white/50">{title}</span>
        <button
          type="button"
          onClick={onMarkWinner}
          title="Marcar como ganador"
          className={`text-lg leading-none ${isWinner ? 'text-accent' : 'text-white/25 hover:text-white/60'}`}
        >
          ★
        </button>
      </div>
      <div className="space-y-2">
        <Select value={selectedPlayerId} onChange={(e) => onPlayerChange(e.target.value)} className="w-full">
          <option value="">Elegir jugador...</option>
          {players
            .filter((p) => p.id !== excludeId)
            .map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
        </Select>
        <Select
          value={character}
          onChange={(e) => onCharacterChange(e.target.value)}
          className="w-full"
          disabled={!selectedPlayerId}
        >
          <option value="">Elegir personaje...</option>
          {characterOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
        <div className="flex items-center gap-2">
          <Label>Rounds</Label>
          <Input
            type="number"
            min={0}
            value={score}
            onChange={(e) => onScoreChange(Number(e.target.value))}
            className="w-20"
          />
        </div>
      </div>
    </div>
  )
}
