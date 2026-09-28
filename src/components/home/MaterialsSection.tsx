import Media from '../ui/Media'
import Reveal from '../ui/Reveal'
import SectionHeading from '../ui/SectionHeading'
import { useI18n } from '../../i18n'
import { materials } from '../../content'

/**
 * « Trois matières, une même exigence » — présentation éditoriale en photos.
 * (Le rendu 3D temps réel a été retiré à la demande du client.)
 */
export default function MaterialsSection() {
  const { t, L } = useI18n()

  return (
    <section id="materiaux" className="bg-paper py-20 lg:py-28" aria-label={t.materials.title}>
      <div className="container-x">
        <SectionHeading eyebrow={t.materials.eyebrow} title={t.materials.title} intro={t.materials.intro} />
      </div>

      <div className="container-x mt-14 flex flex-col gap-16 lg:mt-20 lg:gap-24">
        {materials.map((m, i) => {
          const flipped = i % 2 === 1
          return (
            <article key={m.id} className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
              <div className={`lg:col-span-7 ${flipped ? 'lg:order-2' : ''}`}>
                <Reveal mask>
                  <Media
                    src={m.fallbackImage.src}
                    alt={L(m.fallbackImage.alt)}
                    className="aspect-16/10 w-full rounded-xl"
                    imgClassName="transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.03]"
                    sizes="(max-width: 1024px) 100vw, 58vw"
                  />
                </Reveal>
              </div>

              <div className={`lg:col-span-5 ${flipped ? 'lg:order-1' : ''}`}>
                <Reveal>
                  <span className="flex items-center gap-3">
                    <span className="h-px w-8 bg-brand" />
                    <span className="eyebrow">
                      0{i + 1} / 0{materials.length}
                    </span>
                  </span>
                </Reveal>

                <Reveal delay={0.06}>
                  <h3 className="fluid-h3 mt-4 font-display">{L(m.name)}</h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-graphite">{L(m.intro)}</p>
                </Reveal>

                <Reveal delay={0.12}>
                  <ul className="mt-6 flex flex-col gap-2">
                    {m.points.map((p, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm text-graphite">
                        <span className="mt-2 h-px w-4 shrink-0 bg-brand" />
                        {L(p)}
                      </li>
                    ))}
                  </ul>
                </Reveal>

                <Reveal delay={0.18}>
                  <div className="mt-7 grid grid-cols-3 gap-4 border-t border-ink/10 pt-5">
                    {m.metrics.map((metric, j) => (
                      <div key={j}>
                        <div className="font-display text-lg tracking-tight">{metric.value}</div>
                        <div className="mt-1 text-[0.62rem] uppercase tracking-[0.14em] text-steel">
                          {L(metric.label)}
                        </div>
                      </div>
                    ))}
                  </div>
                </Reveal>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
