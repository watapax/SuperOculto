import { getCharacterImageUrl } from '../data/characterImages'
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

export default function CharacterAvatar({
  name,
  size = 'md',
  selected = false,
  character = false,
  fill = false,
}: {
  name: string
  size?: 'sm' | 'md' | 'lg'
  selected?: boolean
  /** Only true when `name` is an actual KOF character (not a player's name) — enables the real portrait lookup. */
  character?: boolean
  /** Fills the parent container instead of a fixed square size, zoomed/cropped — for tall strip layouts. */
  fill?: boolean
}) {
  const [from, to] = PALETTE[hashString(name) % PALETTE.length]
  const sizeClass = fill
    ? 'h-full w-full text-4xl'
    : {
        sm: 'h-14 w-14 text-base',
        md: 'h-16 w-16 text-xl',
        lg: 'h-[4.5rem] w-[4.5rem] text-2xl',
      }[size]
  const imageUrl = character ? getCharacterImageUrl(name) : undefined

  return (
    <div
      className={`relative flex ${sizeClass} shrink-0 items-center justify-center overflow-hidden ${fill ? 'rounded-lg' : 'rounded-2xl'} font-display text-white transition-transform ${
        selected ? `${fill ? '' : 'scale-105'} ring-[3px] ring-accent` : 'ring-1 ring-white/10'
      }`}
      style={{
        background: imageUrl ? undefined : `linear-gradient(150deg, ${from}, ${to})`,
        boxShadow: selected
          ? `0 0 0 3px rgba(10,7,20,0.9), 0 0 18px 2px ${to}99, inset 0 1px 0 rgba(255,255,255,0.35)`
          : `0 2px 6px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.25)`,
      }}
      title={name}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className={`h-full w-full object-cover object-top ${fill ? 'scale-[1.35]' : ''}`}
        />
      ) : (
        <>
          <FighterSilhouette className="absolute inset-0 h-full w-full opacity-[0.16]" />
          <span className="relative drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">{initials(name)}</span>
          <span className={`pointer-events-none absolute inset-x-0 top-0 h-1/2 ${fill ? 'rounded-t-lg' : 'rounded-t-2xl'} bg-gradient-to-b from-white/25 to-transparent`} />
        </>
      )}
    </div>
  )
}
