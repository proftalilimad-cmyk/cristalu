import { ArrowUpRight } from 'lucide-react'
import Media from '../ui/Media'
import SplitLines from '../ui/SplitLines'
import Reveal from '../ui/Reveal'
import { MagneticLink } from '../ui/MagneticButton'
import { useI18n } from '../../i18n'
import { gsap } from '../../lib/animation'
import { useGsap } from '../../lib/hooks'

export default function CtaSection() {
  const { t } = useI18n()

  const ref = useGsap<HTMLElement>(({ el, reduced }) => {
    if (reduced) return
    gsap.fromTo(
      el.querySelector('[data-bg]'),
      { yPercent: -8, scale: 1.12 },
      {
        yPercent: 8,
        scale: 1,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    )
  }, [])

  return (
    <section ref={ref} className="relative overflow-hidden bg-void py-28 text-white lg:py-40">
      <div data-bg className="absolute inset-0 will-change-transform">
        <Media
          src="hero-option-3"
          alt="Maison marocaine contemporaine avec grandes surfaces vitrées en fin de journée"
          className="h-full w-full"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/75 to-void/35" />
      </div>

      <div className="container-x relative z-10 flex flex-col items-start gap-8">
        <SplitLines
          as="h2"
          text={t.cta.title}
          className="max-w-4xl font-display text-[clamp(2rem,6.5vw,6rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.05em]"
        />
        <Reveal delay={0.1}>
          <p className="max-w-xl text-base leading-relaxed text-white/70">{t.cta.text}</p>
        </Reveal>
        <Reveal delay={0.18} className="flex flex-wrap gap-3">
          <MagneticLink to="/contact" variant="solid" className="bg-white text-ink hover:bg-alu">
            {t.cta.btn1}
            <ArrowUpRight size={15} />
          </MagneticLink>
          <MagneticLink to="/contact#form" variant="light">
            {t.cta.btn2}
          </MagneticLink>
        </Reveal>
      </div>
    </section>
  )
}
