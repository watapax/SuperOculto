import { useState } from 'react'
import AppHeader from '../components/AppHeader'
import CharacterAvatar from '../components/CharacterAvatar'
import { Button, Card, Input } from '../components/ui'
import { useStore } from '../store/useStore'

export default function PlayersPage() {
  const players = useStore((s) => s.players)
  const addPlayer = useStore((s) => s.addPlayer)
  const renamePlayer = useStore((s) => s.renamePlayer)
  const removePlayer = useStore((s) => s.removePlayer)

  const [name, setName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  function handleAdd() {
    if (!name.trim()) return
    addPlayer(name)
    setName('')
  }

  return (
    <div className="flex flex-1 flex-col">
      <AppHeader title="Jugadores" onBack="home" />
      <div className="flex-1 px-4 py-5">
        <Card className="mb-5 flex items-end gap-2">
          <div className="flex-1">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/50">
              Nuevo jugador
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre"
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
          </div>
          <Button onClick={handleAdd} disabled={!name.trim()}>
            Agregar
          </Button>
        </Card>

        {players.length === 0 && (
          <p className="text-center text-sm text-white/50">Todavía no hay jugadores. Agregá el primero arriba.</p>
        )}

        <div className="space-y-3">
          {players.map((player) => (
            <Card key={player.id} className="flex items-center gap-3">
              <CharacterAvatar name={player.name} size="sm" />
              {editingId === player.id ? (
                <Input
                  autoFocus
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="flex-1"
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
                <span className="flex-1 font-semibold">{player.name}</span>
              )}
              <button
                type="button"
                className="text-xs text-white/50 hover:text-accent"
                onClick={() => {
                  setEditingId(player.id)
                  setEditingName(player.name)
                }}
              >
                Renombrar
              </button>
              <button
                type="button"
                className="text-xs text-red-400 hover:text-red-300"
                onClick={() => {
                  if (confirm(`¿Eliminar a ${player.name}? Esto también borra sus peleas.`)) {
                    removePlayer(player.id)
                  }
                }}
              >
                Eliminar
              </button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
