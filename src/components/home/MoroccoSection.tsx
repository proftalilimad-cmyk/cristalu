import Media from '../ui/Media'
import Reveal from '../ui/Reveal'
import SectionHeading from '../ui/SectionHeading'
import { useI18n } from '../../i18n'
import { gsap } from '../../lib/animation'
import { useGsap } from '../../lib/hooks'

export default function MoroccoSection() {
  const { t } = useI18n()

  const ref = useGsap<HTMLElement>(({ el, reduced }) => {
    if (reduced) return
    el.querySelectorAll<HTMLElement>('[data-parallax]').forEach((layer) => {
      const speed = Number(layer.dataset.parallax || 12)
      gsap.fromTo(
        layer,
        { yPercent: speed },
        {
          yPercent: -speed,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )
    })
  }, [])

  const points = [
    { title: t.morocco.p1, text: t.morocco.p1d },
    { title: t.morocco.p2, text: t.morocco.p2d },
    { title: t.morocco.p3, text: t.morocco.p3d },
  ]

  return (
    <section ref={ref} className="relative overflow-hidden bg-mist py-24 lg:py-36">
      <div className="container-x">
        <SectionHeading eyebrow={t.morocco.eyebrow} title={t.morocco.title} intro={t.morocco.text} />

        <div className="mt-16 grid gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-xl">
              <div data-parallax="6">
                <Media
                  src="hero-option-2"
                  alt="Résidence marocaine contemporaine avec fenêtres aluminium et PVC"
                  className="aspect-4/3 w-full lg:aspect-16/11"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:col-span-5">
            <div className="overflow-hidden rounded-xl">
              <div data-parallax="10">
                <Media
                  src="realisation-hotel"
                  alt="Façade contemporaine en pierre, béton et aluminium sous la lumière méditerranéenne"
                  className="aspect-4/3 w-full"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
            </div>

            <Reveal stagger={0.12} className="flex flex-col divide-y divide-ink/10">
              {points.map((p) => (
                <div key={p.title} className="py-5 first:pt-0">
                  <h3 className="font-display text-lg tracking-[-0.02em]">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-graphite">{p.text}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
