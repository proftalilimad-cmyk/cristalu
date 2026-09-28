import { useEffect, useRef } from 'react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import Media from '../ui/Media'
import { MagneticLink } from '../ui/MagneticButton'
import { useI18n } from '../../i18n'
import { gsap, isCoarsePointer, prefersReducedMotion } from '../../lib/animation'
import { useGsap } from '../../lib/hooks'

export default function Hero() {
  const { t } = useI18n()
  const layerRef = useRef<HTMLDivElement>(null)

  const root = useGsap<HTMLElement>(({ el, reduced }) => {
    const media = el.querySelector('[data-hero-media]')
    const content = el.querySelector('[data-hero-content]')
    const words = el.querySelectorAll('[data-hero-word]')
    const lines = el.querySelectorAll('[data-hero-line]')

    if (!reduced) {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.fromTo(
        media,
        { scale: 1.16, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.8 },
      )
        .fromTo(
          words,
          { yPercent: 115 },
          { yPercent: 0, duration: 1.3, stagger: 0.08 },
          '-=1.25',
        )
        .fromTo(
          lines,
          { y: 26, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.1, stagger: 0.12 },
          '-=0.9',
        )
    }

    // Cinematic scroll: the building drifts & scales, typography stays anchored
    gsap.to(media, {
      yPercent: 14,
      scale: 1.12,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
    })
    gsap.to(content, {
      yPercent: -18,
      opacity: 0.15,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
    })
  }, [])

  // Subtle 3D depth on pointer move
  useEffect(() => {
    if (isCoarsePointer() || prefersReducedMotion()) return
    const el = layerRef.current
    if (!el) return
    const onMove = (e: MouseEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5
      const ny = e.clientY / window.innerHeight - 0.5
      gsap.to(el, {
        rotateY: nx * 3.2,
        rotateX: -ny * 2.2,
        x: nx * -22,
        y: ny * -14,
        duration: 1.2,
        ease: 'power3.out',
        transformPerspective: 1200,
      })
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const title = t.hero.brand.split(' ')

  return (
    <section
      ref={root}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-paper"
      id="hero"
    >
      <div
        ref={layerRef}
        data-hero-media
        className="absolute inset-0 will-change-transform"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <Media
          src="hero-option-1"
          alt="Villa contemporaine marocaine avec grandes baies vitrées coulissantes en aluminium"
          className="h-full w-full scale-[1.06]"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-paper via-paper/85 to-transparent ltr:bg-gradient-to-r rtl:bg-gradient-to-l" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-paper to-transparent" />
      </div>

      <div data-hero-content className="container-x relative z-10 pb-16 pt-32 md:pt-24">
        <div className="max-w-2xl">
          <div data-hero-line className="mb-7 flex items-center gap-3">
            <span className="h-px w-10 bg-brand" />
            <span className="eyebrow">{t.hero.since}</span>
          </div>

          <h1 className="fluid-display font-display font-extrabold">
            {title.map((w, i) => (
              <span key={i} className="block overflow-hidden">
                <span data-hero-word className="block will-change-transform">
                  {w}
                </span>
              </span>
            ))}
          </h1>

          <p
            data-hero-line
            className="mt-8 max-w-xl font-display text-[clamp(1.05rem,2vw,1.6rem)] leading-tight tracking-[-0.02em] text-graphite"
          >
            {t.hero.subtitle}
          </p>
          <p data-hero-line className="mt-4 max-w-md text-sm leading-relaxed text-steel md:text-base">
            {t.hero.text}
          </p>

          <div data-hero-line className="mt-10 flex flex-wrap items-center gap-3">
            <MagneticLink to="/solutions">
              {t.hero.cta1}
              <ArrowUpRight size={15} />
            </MagneticLink>
            <MagneticLink to="/realisations" variant="outline">
              {t.hero.cta2}
            </MagneticLink>
          </div>
        </div>
      </div>

      <div className="absolute bottom-7 z-10 hidden items-center gap-3 text-[0.68rem] uppercase tracking-[0.24em] text-ink/45 md:flex ltr:left-10 rtl:right-10 xl:ltr:left-16 xl:rtl:right-16">
        <ArrowDown size={14} className="animate-bounce" />
        {t.hero.scroll}
      </div>
    </section>
  )
}
