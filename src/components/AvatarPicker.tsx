import { PLAYER_AVATARS } from '../data/playerAvatars'

export default function AvatarPicker({
  value,
  onChange,
}: {
  value: string | null | undefined
  onChange: (avatar: string) => void
}) {
  return (
    <div className="grid grid-cols-8 gap-1 rounded-xl border border-edge/50 bg-ink/40 p-1.5">
      {PLAYER_AVATARS.map((emoji) => {
        const active = value === emoji
        return (
          <button
            type="button"
            key={emoji}
            onClick={() => onChange(emoji)}
            className={`flex aspect-square items-center justify-center rounded-lg text-xl transition-all ${
              active ? 'bg-brand/20 ring-2 ring-accent' : 'hover:bg-panel-2 active:scale-90'
            }`}
          >
            {emoji}
          </button>
        )
      })}
    </div>
  )
}
