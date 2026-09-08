import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description?: string
  confirmLabel: string
  cancelLabel?: string
  /** 'brand' para acciones positivas (confirmar, guardar), 'danger' para acciones destructivas/irreversibles. */
  tone?: 'brand' | 'danger'
  onConfirm: () => void
  onCancel: () => void
  children?: ReactNode
}

/**
 * Modal de confirmación con la estética de la app, para reemplazar el `confirm()`
 * nativo del navegador/sistema (que en Android se ve como un diálogo genérico del
 * sistema, no de la app).
 */
export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Cancelar',
  tone = 'brand',
  onConfirm,
  onCancel,
  children,
}: ConfirmDialogProps) {
  const confirmClass =
    tone === 'danger'
      ? 'bg-panel-2 text-brand-2 ring-1 ring-inset ring-brand/50 active:bg-brand/10'
      : 'bg-gradient-to-br from-brand to-brand-2 text-ink shadow-[0_2px_16px_-4px_var(--color-brand)]'

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onCancel}
        >
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            className="w-full max-w-sm rounded-2xl border border-edge/70 bg-panel p-5 shadow-2xl"
            initial={{ opacity: 0, scale: 0.92, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 4 }}
            transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="confirm-dialog-title" className="font-display text-2xl tracking-wide text-white">
              {title}
            </h2>
            {description && <p className="mt-1.5 text-sm text-white/60">{description}</p>}
            {children && <div className="mt-4">{children}</div>}

            <div className="mt-6 flex gap-2.5">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 rounded-xl bg-panel-2 py-3 text-sm font-bold text-white/70 active:scale-[0.98]"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className={`flex-1 rounded-xl py-3 text-sm font-bold active:scale-[0.98] ${confirmClass}`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
