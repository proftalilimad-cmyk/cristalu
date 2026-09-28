import {
  DraftingCompass,
  Factory,
  LifeBuoy,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import Reveal from '../components/ui/Reveal'
import Media from '../components/ui/Media'
import ProcessTimeline from '../components/home/ProcessTimeline'
import QualitySection from '../components/home/QualitySection'
import CtaSection from '../components/home/CtaSection'
import { useI18n } from '../i18n'
import { materials, services } from '../content'

const icons: Record<string, LucideIcon> = { DraftingCompass, Factory, Wrench, LifeBuoy }

export default function Solutions() {
  const { t, L } = useI18n()

  return (
    <>
      <PageHeader
        eyebrow={t.solutionsPage.eyebrow}
        title={t.solutionsPage.title}
        intro={t.solutionsPage.intro}
        image={{ src: 'atelier', alt: 'Atelier de fabrication de menuiserie aluminium' }}
      />

      <section className="bg-paper py-20 lg:py-28">
        <div className="container-x grid gap-px overflow-hidden rounded-xl bg-ink/10 md:grid-cols-2">
          {services.map((s, i) => {
            const Icon = icons[s.icon] ?? DraftingCompass
            return (
              <Reveal key={s.id} delay={i * 0.05} className="bg-paper">
                <article className="group flex h-full min-h-[16rem] flex-col justify-between gap-8 p-8 lg:p-10">
                  <div className="flex items-start justify-between">
                    <span className="eyebrow">0{i + 1}</span>
                    <Icon size={26} strokeWidth={1.2} className="text-steel" />
                  </div>
                  <div>
                    <h2 className="fluid-h3 font-display">{L(s.title)}</h2>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-graphite">
                      {L(s.description)}
                    </p>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>
      </section>

      <section className="bg-mist py-20 lg:py-28">
        <div className="container-x grid gap-10 lg:grid-cols-3">
          {materials.map((m) => (
            <Reveal key={m.id} className="flex flex-col">
              <Media
                src={m.fallbackImage.src}
                alt={L(m.fallbackImage.alt)}
                className="w-full rounded-xl"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
              <h2 className="fluid-h3 mt-5 font-display">{L(m.name)}</h2>
              <p className="mt-2 text-sm leading-relaxed text-graphite">{L(m.intro)}</p>
              <ul className="mt-5 flex flex-col gap-2 border-t border-ink/10 pt-4">
                {m.points.map((p, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-graphite">
                    <span className="mt-2 h-px w-4 shrink-0 bg-brand" />
                    {L(p)}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      <ProcessTimeline />
      <QualitySection />
      <CtaSection />
    </>
  )
}
