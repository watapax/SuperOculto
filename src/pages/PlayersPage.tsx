import { useState } from 'react'
import CharacterAssignment from '../components/CharacterAssignment'
import { Button, Card, Input, PageTitle } from '../components/ui'
import { useStore } from '../store/useStore'

export default function PlayersPage() {
  const players = useStore((s) => s.players)
  const addPlayer = useStore((s) => s.addPlayer)
  const renamePlayer = useStore((s) => s.renamePlayer)
  const removePlayer = useStore((s) => s.removePlayer)

  const [name, setName] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  function handleAdd() {
    if (!name.trim()) return
    addPlayer(name)
    setName('')
  }

  return (
    <div>
      <PageTitle subtitle="Alta de jugadores y asignación de personajes por juego.">Jugadores</PageTitle>

      <Card className="mb-6 flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[200px]">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/50">
            Nuevo jugador
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre del jugador"
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
        </div>
        <Button onClick={handleAdd} disabled={!name.trim()}>
          Agregar
        </Button>
      </Card>

      {players.length === 0 && (
        <p className="text-sm text-white/50">Todavía no hay jugadores cargados. Agregá el primero arriba.</p>
      )}

      <div className="space-y-3">
        {players.map((player) => {
          const expanded = expandedId === player.id
          return (
            <Card key={player.id}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                {editingId === player.id ? (
                  <Input
                    autoFocus
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && editingName.trim()) {
                        renamePlayer(player.id, editingName)
                        setEditingId(null)
                      }
                      if (e.key === 'Escape') setEditingId(null)
                    }}
                    onBlur={() => {
                      if (editingName.trim()) renamePlayer(player.id, editingName)
                      setEditingId(null)
                    }}
                  />
                ) : (
                  <span className="font-semibold">{player.name}</span>
                )}
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => setExpandedId(expanded ? null : player.id)}>
                    {expanded ? 'Ocultar personajes' : 'Personajes'}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setEditingId(player.id)
                      setEditingName(player.name)
                    }}
                  >
                    Renombrar
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      if (confirm(`¿Eliminar a ${player.name}? Esto también borra sus partidas.`)) {
                        removePlayer(player.id)
                      }
                    }}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
              {expanded && <CharacterAssignment playerId={player.id} />}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
