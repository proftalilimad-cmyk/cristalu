import { useEffect, useRef, type ElementType, type ReactNode } from 'react'
import { gsap, initGsap, SplitText } from '@/lib/gsap'
import { cn } from '@/lib/utils'

type RevealProps = {
  children: ReactNode
  className?: string
  /** Décalage vertical initial (px) */
  y?: number
  x?: number
  delay?: number
  duration?: number
  /** Applique un décalage progressif aux enfants directs */
  stagger?: number
  scale?: number
  blur?: boolean
  as?: ElementType
  start?: string
}

/**
 * Apparition au défilement — GSAP + ScrollTrigger.
 * Repli sur un affichage immédiat si l'utilisateur réduit les animations.
 */
export function Reveal({
  children,
  className,
  y = 30,
  x = 0,
  delay = 0,
  duration = 1,
  stagger,
  scale,
  blur = true,
  as,
  start = 'top 88%',
}: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  const Tag = (as ?? 'div') as ElementType

  useEffect(() => {
    const el = ref.current
    if (!el) return
    initGsap()
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(el, { opacity: 1, clearProps: 'all' })
      return
    }

    // En mode « stagger », ce sont les enfants qui sont animés : le conteneur
    // doit rester visible (sinon les enfants animés resteraient cachés).
    const targets = stagger ? Array.from(el.children) : el
    if (stagger) gsap.set(el, { opacity: 1, filter: 'none' })
    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        {
          opacity: 0,
          y,
          x,
          scale: scale ?? 1,
          filter: blur ? 'blur(10px)' : 'none',
        },
        {
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration,
          delay,
          stagger: stagger ?? 0,
          ease: 'cristal',
          scrollTrigger: { trigger: el, start, once: true },
        },
      )
    }, el)

    return () => ctx.revert()
  }, [y, x, delay, duration, stagger, scale, blur, start])

  return (
    <Tag ref={ref} className={cn(stagger ? undefined : 'js-reveal', className)}>
      {children}
    </Tag>
  )
}

/** Titre animé mot par mot (SplitText) — réservé aux titres importants. */
export function RevealText({
  text,
  className,
  as = 'h2',
  delay = 0,
  type = 'words',
}: {
  text: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  delay?: number
  type?: 'words' | 'lines' | 'chars'
}) {
  const ref = useRef<HTMLHeadingElement>(null)
  const Tag = as

  useEffect(() => {
    const el = ref.current
    if (!el) return
    initGsap()
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let split: SplitText | null = null
    const ctx = gsap.context(() => {
      split = new SplitText(el, { type, linesClass: 'overflow-hidden' })
      const parts: Element[] = type === 'chars' ? split.chars : split.words
      gsap.fromTo(
        parts,
        { yPercent: 118, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.05,
          stagger: type === 'chars' ? 0.02 : 0.075,
          ease: 'cristal',
          delay,
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        },
      )
    }, el)

    return () => {
      ctx.revert()
      split?.revert()
    }
  }, [text, type, delay])

  return (
    <Tag ref={ref} className={className}>
      {text}
    </Tag>
  )
}
