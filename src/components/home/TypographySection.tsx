import { useI18n } from '../../i18n'
import { gsap } from '../../lib/animation'
import { useGsap } from '../../lib/hooks'

export default function TypographySection() {
  const { t } = useI18n()

  const ref = useGsap<HTMLElement>(({ el, reduced }) => {
    const words = el.querySelectorAll('[data-word]')
    const brand = el.querySelector('[data-brand]')

    if (reduced) {
      gsap.set([words, brand], { opacity: 1, yPercent: 0 })
      return
    }

    gsap.set(brand, { opacity: 0, scale: 0.94 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top top',
        end: '+=320%',
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
      },
      defaults: { ease: 'power2.out' },
    })

    words.forEach((w) => {
      tl.fromTo(w, { opacity: 0, yPercent: 60 }, { opacity: 1, yPercent: 0, duration: 0.5 })
        .to(w, { opacity: 0, yPercent: -60, duration: 0.4 }, '+=0.25')
    })

    tl.to(brand, { opacity: 1, scale: 1, duration: 0.9 }).to({}, { duration: 0.5 })
  }, [t.typo.brand])

  return (
    <section
      ref={ref}
      className="relative flex h-screen items-center justify-center overflow-hidden bg-paper"
      aria-label={t.typo.brand}
    >
      <div className="noise pointer-events-none absolute inset-0" />

      <div className="relative flex h-[40vh] w-full items-center justify-center">
        {t.typo.words.map((word) => (
          <h2
            key={word}
            data-word
            className="absolute inset-x-0 text-center font-display text-[clamp(2.6rem,13vw,13rem)] font-extrabold uppercase leading-none tracking-[-0.055em] text-ink opacity-0"
          >
            {word}
          </h2>
        ))}

        <div data-brand className="absolute inset-x-0 text-center">
          <div className="font-display text-[clamp(1.8rem,8.5vw,8.5rem)] font-extrabold uppercase leading-none tracking-[-0.055em]">
            {t.typo.brand}
          </div>
          <div className="mt-6 flex items-center justify-center gap-3 text-[0.65rem] uppercase tracking-[0.42em] text-steel">
            <span className="h-px w-8 bg-brand" />
            Aluminium · PVC · Verre
            <span className="h-px w-8 bg-brand" />
          </div>
        </div>
      </div>

      <span className="absolute bottom-10 text-[0.62rem] uppercase tracking-[0.3em] text-steel/60">
        {t.hero.since}
      </span>
    </section>
  )
}
