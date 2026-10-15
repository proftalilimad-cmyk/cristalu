import { useEffect, useRef, type RefObject } from 'react'

export type PointerState = {
  /** -1 → 1 */
  x: number
  /** -1 → 1 */
  y: number
  /** 0 → 1 : intensité du mouvement récent (reflets, particules) */
  energy: number
  /** Souris présente au-dessus de la fenêtre */
  active: boolean
}

/**
 * Suivi du pointeur normalisé, partagé entre le DOM et la scène 3D.
 * `energy` mesure l'agitation récente du curseur : elle anime les reflets et
 * les particules, puis retombe doucement (voir `useEnergyDecay` côté 3D).
 */
export function usePointer(): RefObject<PointerState> {
  const state = useRef<PointerState>({ x: 0, y: 0, energy: 0, active: false })

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = (e.clientY / window.innerHeight) * 2 - 1
      const dx = Math.abs(nx - state.current.x)
      const dy = Math.abs(ny - state.current.y)
      state.current.energy = Math.min(1, state.current.energy + (dx + dy) * 2.4)
      state.current.x = nx
      state.current.y = ny
      state.current.active = true
    }
    const onLeave = () => {
      state.current.active = false
    }
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0]
      if (!t) return
      state.current.x = (t.clientX / window.innerWidth) * 2 - 1
      state.current.y = (t.clientY / window.innerHeight) * 2 - 1
      state.current.energy = Math.min(1, state.current.energy + 0.12)
      state.current.active = true
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeave)
    window.addEventListener('touchmove', onTouch, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('touchmove', onTouch)
    }
  }, [])

  return state
}

export type EnergyRef = RefObject<{ energy: number }>
