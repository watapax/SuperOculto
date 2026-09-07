/** Generic fighting-stance pictogram — original silhouette, not tied to any specific character. */
export default function FighterSilhouette({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor" aria-hidden="true">
      <circle cx="52" cy="20" r="10" />
      <path d="M40 34 L64 34 L70 58 L58 58 L58 90 L46 90 L46 62 L34 78 L26 70 L40 50 Z" />
      <path d="M64 34 L86 22 L91 30 L72 44 Z" />
    </svg>
  )
}
