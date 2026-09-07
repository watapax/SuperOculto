import type { ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes } from 'react'

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-edge/60 bg-panel/70 p-4 shadow-lg shadow-black/30 ${className}`}>
      {children}
    </div>
  )
}

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'danger' }) {
  const styles = {
    primary: 'bg-brand text-ink hover:bg-brand-2 disabled:opacity-40',
    ghost: 'bg-panel-2 text-white/90 hover:bg-edge/60 disabled:opacity-40',
    danger: 'bg-transparent text-red-400 hover:bg-red-950 disabled:opacity-40',
  }[variant]
  return (
    <button
      className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed ${styles} ${className}`}
      {...props}
    />
  )
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`rounded-md border border-edge/60 bg-ink px-3 py-2 text-sm text-white outline-none focus:border-brand ${props.className ?? ''}`}
    />
  )
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`rounded-md border border-edge/60 bg-ink px-3 py-2 text-sm text-white outline-none focus:border-brand ${props.className ?? ''}`}
    />
  )
}

export function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/50">{children}</label>
}

export function PageTitle({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h1 className="font-display text-2xl text-brand-2">{children}</h1>
      {subtitle && <p className="mt-1 text-sm text-white/60">{subtitle}</p>}
    </div>
  )
}
