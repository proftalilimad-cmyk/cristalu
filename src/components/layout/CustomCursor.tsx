import { useEffect, useRef } from 'react'
import { gsap, isCoarsePointer, prefersReducedMotion } from '../../lib/animation'

/** Minimal desktop cursor: a dot + a lagging ring that grows over links. */
export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isCoarsePointer() || prefersReducedMotion()) return
    const d = dot.current
    const r = ring.current
    if (!d || !r) return

    gsap.set([d, r], { xPercent: -50, yPercent: -50, opacity: 0 })
    const xTo = gsap.quickTo(r, 'x', { duration: 0.5, ease: 'power3' })
    const yTo = gsap.quickTo(r, 'y', { duration: 0.5, ease: 'power3' })
    const dxTo = gsap.quickTo(d, 'x', { duration: 0.12, ease: 'power3' })
    const dyTo = gsap.quickTo(d, 'y', { duration: 0.12, ease: 'power3' })

    const move = (e: MouseEvent) => {
      gsap.to([d, r], { opacity: 1, duration: 0.3, overwrite: 'auto' })
      xTo(e.clientX)
      yTo(e.clientY)
      dxTo(e.clientX)
      dyTo(e.clientY)
      const target = e.target as HTMLElement | null
      const interactive = target?.closest('a, button, [data-cursor="link"], input, select, textarea')
      gsap.to(r, {
        scale: interactive ? 1.9 : 1,
        borderColor: interactive ? 'rgba(163,0,0,0.9)' : 'rgba(17,17,17,0.3)',
        duration: 0.4,
        overwrite: 'auto',
      })
    }
    const leave = () => gsap.to([d, r], { opacity: 0, duration: 0.3 })

    window.addEventListener('mousemove', move, { passive: true })
    document.addEventListener('mouseleave', leave)
    return () => {
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseleave', leave)
    }
  }, [])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90] hidden md:block">
      <div
        ref={ring}
        className="absolute left-0 top-0 h-8 w-8 rounded-full border border-ink/30 mix-blend-difference"
        style={{ borderColor: 'rgba(17,17,17,0.3)' }}
      />
      <div ref={dot} className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-ink" />
    </div>
  )
}
