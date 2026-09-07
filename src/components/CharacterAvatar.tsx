const PALETTE = [
  ['#7a1010', '#e8590c'],
  ['#0b3d5c', '#1c7ed6'],
  ['#0b5c2e', '#2f9e44'],
  ['#5c1a5c', '#ae3ec9'],
  ['#5c4a0b', '#f08c00'],
  ['#0b5c56', '#12b886'],
  ['#5c0b3a', '#e64980'],
  ['#3a5c0b', '#82c91e'],
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
}: {
  name: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const [from, to] = PALETTE[hashString(name) % PALETTE.length]
  const sizeClass = { sm: 'h-10 w-10 text-xs', md: 'h-16 w-16 text-base', lg: 'h-20 w-20 text-lg' }[size]
  return (
    <div
      className={`flex ${sizeClass} shrink-0 items-center justify-center rounded-lg border border-white/20 font-display font-bold text-white shadow-inner`}
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      title={name}
    >
      {initials(name)}
    </div>
  )
}
