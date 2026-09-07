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

/** Generic fighting-stance pictogram — original silhouette, not tied to any specific character. */
function FighterSilhouette() {
  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full opacity-[0.16]" fill="currentColor">
      <circle cx="52" cy="20" r="10" />
      <path d="M40 34 L64 34 L70 58 L58 58 L58 90 L46 90 L46 62 L34 78 L26 70 L40 50 Z" />
      <path d="M64 34 L86 22 L91 30 L72 44 Z" />
    </svg>
  )
}

export default function CharacterAvatar({
  name,
  size = 'md',
  selected = false,
}: {
  name: string
  size?: 'sm' | 'md' | 'lg'
  selected?: boolean
}) {
  const [from, to] = PALETTE[hashString(name) % PALETTE.length]
  const sizeClass = {
    sm: 'h-11 w-11 text-sm',
    md: 'h-16 w-16 text-xl',
    lg: 'h-[4.5rem] w-[4.5rem] text-2xl',
  }[size]

  return (
    <div
      className={`relative flex ${sizeClass} shrink-0 items-center justify-center overflow-hidden rounded-2xl font-display text-white transition-transform ${
        selected ? 'scale-105 ring-[3px] ring-accent' : 'ring-1 ring-white/10'
      }`}
      style={{
        background: `linear-gradient(150deg, ${from}, ${to})`,
        boxShadow: selected
          ? `0 0 0 3px rgba(10,7,20,0.9), 0 0 18px 2px ${to}99, inset 0 1px 0 rgba(255,255,255,0.35)`
          : `0 2px 6px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.25)`,
      }}
      title={name}
    >
      <FighterSilhouette />
      <span className="relative drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">{initials(name)}</span>
      <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-2xl bg-gradient-to-b from-white/25 to-transparent" />
    </div>
  )
}
