import { useNavigate } from 'react-router-dom'

export default function AppHeader({
  title,
  onBack,
  right,
}: {
  title: string
  onBack?: 'home' | (() => void) | false
  right?: React.ReactNode
}) {
  const navigate = useNavigate()

  function handleBack() {
    if (onBack === 'home' || onBack === undefined) navigate('/')
    else if (typeof onBack === 'function') onBack()
  }

  return (
    <header className="sticky top-0 z-10 border-b border-edge/60 bg-panel/90 backdrop-blur">
      <div className="mx-auto flex max-w-md items-center gap-3 px-4 py-3">
        {onBack !== false && (
          <button
            type="button"
            onClick={handleBack}
            aria-label="Volver"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xl text-white/70 hover:bg-panel-2 hover:text-accent"
          >
            ←
          </button>
        )}
        <h1 className="flex-1 truncate font-display text-lg text-brand-2">{title}</h1>
        {right}
      </div>
    </header>
  )
}
