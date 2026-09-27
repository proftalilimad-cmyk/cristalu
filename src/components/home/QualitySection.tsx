import { Gem, PencilRuler, Ruler, Thermometer, type LucideIcon } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'
import { useI18n } from '../../i18n'
import { qualities } from '../../content'
import { gsap } from '../../lib/animation'
import { useGsap } from '../../lib/hooks'

const icons: Record<string, LucideIcon> = { Gem, Ruler, Thermometer, PencilRuler }

export default function QualitySection() {
  const { t, L } = useI18n()

  const ref = useGsap<HTMLDivElement>(({ el, reduced }) => {
    if (reduced) return
    const cards = el.querySelectorAll('[data-q-card]')
    gsap.fromTo(
      cards,
      { yPercent: 12, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.12,
        scrollTrigger: { trigger: el, start: 'top 82%', once: true },
      },
    )
    el.querySelectorAll<HTMLElement>('[data-q-icon]').forEach((icon) => {
      gsap.to(icon, {
        rotate: 8,
        yPercent: -14,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      })
    })
  }, [])

  return (
    <section className="bg-ink py-24 text-white lg:py-32">
      <div className="container-x">
        <SectionHeading
          eyebrow={t.quality.eyebrow}
          title={t.quality.title}
          tone="light"
          className="[&_h2]:text-white"
        />

        <div ref={ref} className="mt-16 grid gap-px overflow-hidden rounded-xl bg-white/10 md:grid-cols-2 lg:grid-cols-4">
          {qualities.map((q, i) => {
            const Icon = icons[q.icon] ?? Gem
            return (
              <article
                key={q.id}
                data-q-card
                className="group relative flex min-h-[18rem] flex-col justify-between bg-ink p-8 transition-colors duration-700 hover:bg-void"
              >
                <div className="flex items-start justify-between">
                  <span className="text-[0.62rem] uppercase tracking-[0.2em] text-brand-light/80">
                    0{i + 1}
                  </span>
                  <span data-q-icon className="text-white/70">
                    <Icon size={26} strokeWidth={1.2} />
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-2xl tracking-[-0.03em]">{L(q.title)}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">{L(q.description)}</p>
                </div>
                <span className="absolute inset-x-8 bottom-0 h-px origin-left scale-x-0 bg-brand-light transition-transform duration-700 group-hover:scale-x-100" />
              </article>
            )
          })}
        </div>

        <Reveal className="mt-14 grid gap-8 border-t border-white/10 pt-10 sm:grid-cols-3" stagger={0.1}>
          <div>
            <div className="font-display text-4xl tracking-[-0.04em]">Alu · PVC</div>
            <p className="mt-2 text-sm text-white/50">Deux matériaux, un seul niveau d'exigence</p>
          </div>
          <div>
            <div className="font-display text-4xl tracking-[-0.04em]">Sur mesure</div>
            <p className="mt-2 text-sm text-white/50">Fabrication à la cote relevée sur site</p>
          </div>
          <div>
            <div className="font-display text-4xl tracking-[-0.04em]">Maroc</div>
            <p className="mt-2 text-sm text-white/50">Projets résidentiels, tertiaires, hôteliers</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
