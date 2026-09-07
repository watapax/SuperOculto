import { useState } from 'react'
import { useStore } from '../store/useStore'
import { Button, Card, Input, PageTitle } from '../components/ui'

export default function SeasonsPage() {
  const seasons = useStore((s) => s.seasons)
  const activeSeasonId = useStore((s) => s.activeSeasonId)
  const addSeason = useStore((s) => s.addSeason)
  const renameSeason = useStore((s) => s.renameSeason)
  const setActiveSeason = useStore((s) => s.setActiveSeason)
  const archiveSeason = useStore((s) => s.archiveSeason)

  const [name, setName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  function handleCreate() {
    if (!name.trim()) return
    addSeason(name)
    setName('')
  }

  return (
    <div>
      <PageTitle subtitle="Agrupá las partidas por temporada para llevar puntajes separados.">Temporadas</PageTitle>

      <Card className="mb-6 flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[200px]">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/50">
            Nueva temporada
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Temporada 2 - 2026"
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          />
        </div>
        <Button onClick={handleCreate} disabled={!name.trim()}>
          Crear temporada
        </Button>
      </Card>

      <div className="space-y-3">
        {seasons.map((season) => (
          <Card key={season.id} className="flex flex-wrap items-center justify-between gap-3">
            {editingId === season.id ? (
              <Input
                autoFocus
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && editingName.trim()) {
                    renameSeason(season.id, editingName)
                    setEditingId(null)
                  }
                  if (e.key === 'Escape') setEditingId(null)
                }}
                onBlur={() => {
                  if (editingName.trim()) renameSeason(season.id, editingName)
                  setEditingId(null)
                }}
              />
            ) : (
              <div className="flex items-center gap-2">
                <span className="font-semibold">{season.name}</span>
                {season.id === activeSeasonId && (
                  <span className="rounded-full bg-brand px-2 py-0.5 text-xs font-bold text-ink">Activa</span>
                )}
                {season.archived && (
                  <span className="rounded-full bg-panel-2 px-2 py-0.5 text-xs text-white/50">Archivada</span>
                )}
              </div>
            )}
            <div className="flex gap-2">
              {season.id !== activeSeasonId && !season.archived && (
                <Button variant="ghost" onClick={() => setActiveSeason(season.id)}>
                  Activar
                </Button>
              )}
              <Button
                variant="ghost"
                onClick={() => {
                  setEditingId(season.id)
                  setEditingName(season.name)
                }}
              >
                Renombrar
              </Button>
              {!season.archived && (
                <Button variant="danger" onClick={() => archiveSeason(season.id)}>
                  Archivar
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
