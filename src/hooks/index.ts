import { useEffect, useRef, useState } from 'react'
import { isBrowser } from '@/lib/utils'

/** Media query réactive. */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => (isBrowser ? window.matchMedia(query).matches : false))

  useEffect(() => {
    if (!isBrowser) return
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}

export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)')
export const useIsTablet = () => useMediaQuery('(min-width: 768px) and (max-width: 1023px)')
export const useIsMobile = () => useMediaQuery('(max-width: 767px)')
export const useIsTouch = () => useMediaQuery('(hover: none), (pointer: coarse)')
export const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')

/** Vrai lorsque l'élément est (partiellement) visible. */
export function useInView<T extends HTMLElement>(options?: IntersectionObserverInit & { once?: boolean }) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || !isBrowser) return
    const { once, ...io } = options ?? {}
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) obs.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { rootMargin: '120px 0px', threshold: 0.01, ...io },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [options])

  return { ref, inView }
}

/**
 * Niveau de performance de l'appareil : adapte la qualité 3D, les particules
 * et les effets coûteux sans dégrader l'expérience perçue.
 */
export type QualityTier = 'low' | 'medium' | 'high'

export function useQualityTier(): { tier: QualityTier; isTouch: boolean; reduced: boolean } {
  const isMobile = useIsMobile()
  const isTouch = useIsTouch()
  const reduced = usePrefersReducedMotion()
  const [tier, setTier] = useState<QualityTier>(() => {
    if (!isBrowser) return 'medium'
    if (reduced) return 'low'
    const cores = navigator.hardwareConcurrency ?? 4
    const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4
    if (cores <= 4 && mem <= 4) return 'low'
    return 'high'
  })

  useEffect(() => {
    if (reduced) {
      setTier('low')
      return
    }
    if (isMobile) {
      setTier((t) => (t === 'low' ? 'low' : 'medium'))
      return
    }
    const cores = navigator.hardwareConcurrency ?? 4
    setTier(cores > 8 ? 'high' : cores > 4 ? 'medium' : 'low')
  }, [isMobile, reduced, isTouch])

  return { tier, isTouch, reduced }
}

/** Compteur qui se déclenche lorsqu'il devient visible. */
export function useCountUp(target: number, run: boolean, duration = 1800, decimals = 0) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!run) return
    if (target === 0) {
      setValue(0)
      return
    }
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration)
      // easeOutExpo
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p)
      setValue(Number((target * eased).toFixed(decimals)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, run, duration, decimals])

  return value
}

/** Position de défilement lissée (0 → 1) sur toute la page. */
export function useScrollY() {
  const [y, setY] = useState(0)
  useEffect(() => {
    if (!isBrowser) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setY(window.scrollY))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])
  return y
}
