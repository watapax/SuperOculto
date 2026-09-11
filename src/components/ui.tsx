import type { ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes } from 'react'

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-edge/60 bg-panel/80 p-4 shadow-lg shadow-black/40 backdrop-blur-sm ${className}`}
    >
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
    primary:
      'bg-gradient-to-br from-brand to-brand-2 text-ink shadow-[0_4px_16px_-4px_var(--color-brand)] hover:brightness-110 disabled:opacity-40 disabled:shadow-none',
    ghost: 'bg-panel-2 text-white/90 hover:bg-edge/60 disabled:opacity-40',
    danger: 'bg-transparent text-brand hover:bg-brand/10 disabled:opacity-40',
  }[variant]
  return (
    <button
      className={`cursor-pointer rounded-xl px-4 py-2.5 font-display text-sm tracking-wide transition-all disabled:cursor-not-allowed active:scale-95 ${styles} ${className}`}
      {...props}
    />
  )
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`rounded-xl border border-edge/60 bg-ink/60 px-3.5 py-2.5 text-sm text-white outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/30 ${props.className ?? ''}`}
    />
  )
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`rounded-xl border border-edge/60 bg-ink/60 px-3.5 py-2.5 text-sm text-white outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/30 ${props.className ?? ''}`}
    />
  )
}

export function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-white/50">{children}</label>
}

export function PageTitle({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h1 className="font-display text-4xl leading-none tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-brand-2 to-accent">
        {children}
      </h1>
      {subtitle && <p className="mt-2 text-sm text-white/60">{subtitle}</p>}
    </div>
  )
}
