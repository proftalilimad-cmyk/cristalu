import Lenis from 'lenis'
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { ScrollTrigger, gsap, prefersReducedMotion } from './animation'

type SmoothScrollValue = {
  lenis: Lenis | null
  scrollTo: (target: string | number | HTMLElement, offset?: number) => void
}

const SmoothScrollContext = createContext<SmoothScrollValue>({ lenis: null, scrollTo: () => {} })

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const [, force] = useState(0)

  useEffect(() => {
    if (prefersReducedMotion()) {
      // Native scrolling only; ScrollTrigger still drives the reveals (instantly).
      ScrollTrigger.refresh()
      return
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.4,
    })
    lenisRef.current = lenis
    force((n) => n + 1)

    lenis.on('scroll', ScrollTrigger.update)

    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    ScrollTrigger.refresh()

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  const scrollTo: SmoothScrollValue['scrollTo'] = (target, offset = 0) => {
    const lenis = lenisRef.current
    if (lenis) {
      lenis.scrollTo(target, { offset, duration: 1.2 })
      return
    }
    if (typeof target === 'number') {
      window.scrollTo({ top: target + offset, behavior: 'smooth' })
      return
    }
    const el = typeof target === 'string' ? document.querySelector(target) : target
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY + offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <SmoothScrollContext.Provider value={{ lenis: lenisRef.current, scrollTo }}>
      {children}
    </SmoothScrollContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSmoothScroll() {
  return useContext(SmoothScrollContext)
}
