import { useState } from 'react'
import AppHeader from '../components/AppHeader'
import AvatarPicker from '../components/AvatarPicker'
import PlayerAvatar from '../components/PlayerAvatar'
import { Button, Card, Input, Label } from '../components/ui'
import { randomPlayerAvatar } from '../data/playerAvatars'
import { useStore } from '../store/useStore'

export default function PlayersPage() {
  const players = useStore((s) => s.players)
  const addPlayer = useStore((s) => s.addPlayer)
  const updatePlayer = useStore((s) => s.updatePlayer)
  const removePlayer = useStore((s) => s.removePlayer)

  const [name, setName] = useState('')
  const [newAvatar, setNewAvatar] = useState(() => randomPlayerAvatar())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [avatarPickerFor, setAvatarPickerFor] = useState<string | null>(null)

  async function handleAdd() {
    if (!name.trim()) return
    const value = name
    const avatar = newAvatar
    setName('')
    setNewAvatar(randomPlayerAvatar())
    try {
      await addPlayer(value, avatar)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'No se pudo agregar el jugador')
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <AppHeader title="Jugadores" onBack="home" />
      <div className="flex-1 px-4 py-5">
        <Card className="mb-5 border-cyan/30 shadow-[0_0_24px_-10px_var(--color-cyan)]">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Label>Nuevo jugador</Label>
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
          </div>
          <div className="mt-3 flex items-center gap-3">
            <PlayerAvatar name={name || '?'} avatar={newAvatar} size="sm" />
            <span className="text-xs text-white/50">Elegí su avatar</span>
          </div>
          <div className="mt-2">
            <AvatarPicker value={newAvatar} onChange={setNewAvatar} />
          </div>
        </Card>

        {players.length === 0 && (
          <p className="text-center text-sm text-white/50">Todavía no hay jugadores. Agregá el primero arriba.</p>
        )}

        <div className="space-y-3">
          {players.map((player) => (
            <Card key={player.id} className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setAvatarPickerFor(avatarPickerFor === player.id ? null : player.id)}
                  className="active:scale-95"
                >
                  <PlayerAvatar name={player.name} avatar={player.avatar} size="sm" />
                </button>
                {editingId === player.id ? (
                  <Input
                    autoFocus
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && editingName.trim()) {
                        updatePlayer(player.id, { name: editingName }).catch((err) =>
                          alert(err instanceof Error ? err.message : 'No se pudo renombrar'),
                        )
                        setEditingId(null)
                      }
                      if (e.key === 'Escape') setEditingId(null)
                    }}
                    onBlur={() => {
                      if (editingName.trim()) {
                        updatePlayer(player.id, { name: editingName }).catch((err) =>
                          alert(err instanceof Error ? err.message : 'No se pudo renombrar'),
                        )
                      }
                      setEditingId(null)
                    }}
                  />
                ) : (
                  <span className="flex-1 font-display text-lg tracking-wide">{player.name}</span>
                )}
                <button
                  type="button"
                  className="text-xs font-bold uppercase tracking-wide text-white/50 hover:text-accent"
                  onClick={() => {
                    setEditingId(player.id)
                    setEditingName(player.name)
                  }}
                >
                  Renombrar
                </button>
                <button
                  type="button"
                  className="text-xs font-bold uppercase tracking-wide text-brand hover:text-brand-2"
                  onClick={() => {
                    if (confirm(`¿Eliminar a ${player.name}? Esto también borra sus peleas.`)) {
                      removePlayer(player.id).catch((err) =>
                        alert(err instanceof Error ? err.message : 'No se pudo eliminar'),
                      )
                    }
                  }}
                >
                  Eliminar
                </button>
              </div>
              {avatarPickerFor === player.id && (
                <AvatarPicker
                  value={player.avatar}
                  onChange={(avatar) => {
                    setAvatarPickerFor(null)
                    updatePlayer(player.id, { avatar }).catch((err) =>
                      alert(err instanceof Error ? err.message : 'No se pudo cambiar el avatar'),
                    )
                  }}
                />
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
