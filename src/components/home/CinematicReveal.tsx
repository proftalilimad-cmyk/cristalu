import { useEffect, useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import Media from '../ui/Media'
import { MagneticLink } from '../ui/MagneticButton'
import { useI18n } from '../../i18n'
import { ScrollTrigger, gsap, prefersReducedMotion } from '../../lib/animation'

/**
 * Scroll-driven camera pull-back:
 * close-up profile → full sliding door → room → door opens → landscape.
 */
export default function CinematicReveal() {
  const { t } = useI18n()
  const section = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = section.current
    if (!el) return

    const ctx = gsap.context(() => {
      const reduced = prefersReducedMotion()
      const zoomLayer = el.querySelector('[data-zoom]')
      const roomLayer = el.querySelector('[data-room]')
      const leafL = el.querySelector('[data-leaf-left]')
      const leafR = el.querySelector('[data-leaf-right]')
      const landscape = el.querySelector('[data-landscape]')
      const lines = el.querySelectorAll('[data-line]')
      const finalLine = el.querySelector('[data-final]')

      if (reduced) {
        gsap.set([zoomLayer, roomLayer], { scale: 1, opacity: 1 })
        gsap.set(landscape, { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' })
        gsap.set([leafL, leafR], { xPercent: 0, opacity: 0 })
        gsap.set(lines, { opacity: 1, y: 0 })
        gsap.set(finalLine, { opacity: 1, y: 0 })
        return
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: '+=360%',
          pin: true,
          scrub: 0.9,
          anticipatePin: 1,
        },
        defaults: { ease: 'none' },
      })

      // 1 — camera pulls back from the profile close-up
      tl.fromTo(zoomLayer, { scale: 3.6, filter: 'blur(1px)' }, { scale: 1.08, filter: 'blur(0px)', duration: 1.2 })
        // 2 — the room appears behind
        .fromTo(roomLayer, { opacity: 0, scale: 1.25 }, { opacity: 1, scale: 1, duration: 0.9 }, '-=0.35')
        .to(zoomLayer, { opacity: 0, duration: 0.5 }, '<0.2')
        // 3 — text beats
        .fromTo(lines[0], { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.35 }, '-=0.6')
        .to(lines[0], { opacity: 0, y: -30, duration: 0.3 }, '+=0.45')
        // 4 — the leaves slide open and the landscape appears in the opening
        .fromTo(
          landscape,
          { opacity: 1, clipPath: 'inset(0% 50% 0% 50%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1 },
          '-=0.2',
        )
        .to(leafL, { xPercent: -100, duration: 1 }, '<')
        .to(leafR, { xPercent: 100, duration: 1 }, '<')
        .fromTo(lines[1], { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.35 }, '<0.25')
        .to(lines[1], { opacity: 0, y: -30, duration: 0.3 }, '+=0.45')
        .fromTo(lines[2], { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.35 })
        .to(lines[2], { opacity: 0, y: -30, duration: 0.3 }, '+=0.45')
        // 5 — closing statement
        .fromTo(finalLine, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.5 })
        .to({}, { duration: 0.6 })
    }, el)

    return () => {
      ctx.revert()
      ScrollTrigger.refresh()
    }
  }, [])

  return (
    <section
      ref={section}
      className="relative h-screen overflow-hidden bg-void text-white"
      aria-label={t.cinematic.eyebrow}
    >
      {/* interior room */}
      <div data-room className="absolute inset-0 opacity-0">
        <Media
          src="produit-coulissant"
          alt="Séjour contemporain avec baie vitrée coulissante en aluminium"
          className="h-full w-full"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/30" />
      </div>

      {/* landscape revealed through the opening */}
      <div
        data-landscape
        className="absolute inset-0"
        style={{ clipPath: 'inset(0% 50% 0% 50%)' }}
      >
        <Media
          src="hero-option-1"
          alt="Terrasse et paysage révélés par l'ouverture de la baie coulissante"
          className="h-full w-full"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
      </div>

      {/* sliding leaves */}
      <div className="pointer-events-none absolute inset-0 flex">
        <div
          data-leaf-left
          className="h-full w-1/2 border-r border-white/25 bg-white/5 backdrop-blur-[2px]"
          style={{ boxShadow: 'inset -1px 0 0 rgba(255,255,255,0.25)' }}
        />
        <div
          data-leaf-right
          className="h-full w-1/2 border-l border-white/25 bg-white/5 backdrop-blur-[2px]"
          style={{ boxShadow: 'inset 1px 0 0 rgba(255,255,255,0.25)' }}
        />
      </div>

      {/* profile close-up */}
      <div data-zoom className="absolute inset-0 will-change-transform">
        <Media
          src="produit-fenetre-aluminium"
          alt="Gros plan sur un profilé aluminium de baie coulissante"
          className="h-full w-full"
          sizes="100vw"
          priority={false}
        />
        <div className="absolute inset-0 bg-black/25" />
      </div>

      <div className="container-x relative z-10 flex h-full flex-col justify-center">
        <span className="eyebrow text-white/50">{t.cinematic.eyebrow}</span>
        <div className="relative mt-6 h-[38vh] md:h-[30vh]">
          {[t.cinematic.line1, t.cinematic.line2, t.cinematic.line3].map((line) => (
            <h2
              key={line}
              data-line
              className="absolute inset-x-0 top-0 font-display text-[clamp(2.2rem,8vw,7rem)] font-extrabold leading-none tracking-[-0.045em] opacity-0"
            >
              {line}
            </h2>
          ))}
          <div data-final className="absolute inset-x-0 top-0 opacity-0">
            <p className="max-w-2xl font-display text-[clamp(1.4rem,3.4vw,3rem)] leading-[1.05] tracking-[-0.035em]">
              {t.cinematic.final}
            </p>
            <div className="mt-8">
              <MagneticLink to="/produits/baies-coulissantes" variant="light">
                {t.cinematic.cta}
                <ArrowUpRight size={15} />
              </MagneticLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
