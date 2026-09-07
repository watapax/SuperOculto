import { useCallback, useRef, useState } from 'react'

export interface Particle {
  angle: number
  distance: number
  size: number
  color: string
}

export interface Burst {
  id: string
  x: number
  y: number
  particles: Particle[]
}

const COLORS = ['#ffd60a', '#ff3b5c', '#ff8a3d', '#22d3ee', '#b389ff', '#9fef00', '#ffffff']
const BURST_DURATION_MS = 650

export function useTapEffects() {
  const [bursts, setBursts] = useState<Burst[]>([])
  const [shakeKey, setShakeKey] = useState(0)
  const idRef = useRef(0)

  const trigger = useCallback((x: number, y: number) => {
    const id = String(idRef.current++)
    const particles: Particle[] = Array.from({ length: 16 }, () => ({
      angle: Math.random() * 360,
      distance: 36 + Math.random() * 54,
      size: 4 + Math.random() * 7,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }))
    setBursts((prev) => [...prev, { id, x, y, particles }])
    setShakeKey((k) => k + 1)
    setTimeout(() => {
      setBursts((prev) => prev.filter((b) => b.id !== id))
    }, BURST_DURATION_MS)
  }, [])

  return { bursts, shakeKey, trigger }
}
