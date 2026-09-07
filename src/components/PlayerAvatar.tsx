import FighterSilhouette from './FighterSilhouette'

const PALETTE = [
  ['#ff3b5c', '#ff8a3d'],
  ['#0891b2', '#22d3ee'],
  ['#7c3aed', '#b389ff'],
  ['#16a34a', '#9fef00'],
  ['#c026d3', '#ff6bd6'],
  ['#ea580c', '#ffd60a'],
  ['#1d4ed8', '#38bdf8'],
  ['#be123c', '#fb7185'],
  ['#0d9488', '#5eead4'],
  ['#a16207', '#facc15'],
]

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function PlayerAvatar({
  name,
  avatar,
  size = 'md',
}: {
  name: string
  avatar?: string | null
  size?: 'sm' | 'md' | 'lg'
}) {
  const [from, to] = PALETTE[hashString(name) % PALETTE.length]
  const sizeClass = {
    sm: 'h-14 w-14 text-2xl',
    md: 'h-16 w-16 text-3xl',
    lg: 'h-[4.5rem] w-[4.5rem] text-4xl',
  }[size]

  return (
    <div
      className={`relative flex ${sizeClass} shrink-0 items-center justify-center overflow-hidden rounded-2xl font-display text-white ring-1 ring-white/10`}
      style={{
        background: `linear-gradient(150deg, ${from}, ${to})`,
        boxShadow: '0 2px 6px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.25)',
      }}
      title={name}
    >
      {avatar ? (
        <span className="relative drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">{avatar}</span>
      ) : (
        <>
          <FighterSilhouette className="absolute inset-0 h-full w-full opacity-[0.16]" />
          <span className="relative text-[0.55em] drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">{initials(name)}</span>
        </>
      )}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-2xl bg-gradient-to-b from-white/25 to-transparent" />
    </div>
  )
}
