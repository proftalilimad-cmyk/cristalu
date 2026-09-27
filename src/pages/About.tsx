import PageHeader from '../components/ui/PageHeader'
import Reveal from '../components/ui/Reveal'
import Media from '../components/ui/Media'
import QualitySection from '../components/home/QualitySection'
import ProcessTimeline from '../components/home/ProcessTimeline'
import CtaSection from '../components/home/CtaSection'
import { useI18n } from '../i18n'

export default function About() {
  const { t } = useI18n()

  return (
    <>
      <PageHeader eyebrow={t.about.eyebrow} title={t.about.title} intro={t.about.lead} />

      <section className="bg-paper pb-20 lg:pb-28">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal mask>
              <Media
                src="atelier"
                alt="Atelier de fabrication : centre d'usinage et profilés aluminium rangés"
                className="aspect-16/10 w-full rounded-xl"
                sizes="(max-width: 1024px) 100vw, 58vw"
                priority
              />
            </Reveal>
            <p className="mt-4 text-[0.7rem] uppercase tracking-[0.16em] text-steel">
              {t.about.workshop}
            </p>
          </div>
          <div className="flex flex-col gap-6 lg:col-span-5">
            <Reveal>
              <p className="text-sm leading-relaxed text-graphite">{t.about.body1}</p>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="text-sm leading-relaxed text-graphite">{t.about.body2}</p>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="rounded-lg bg-mist p-4 text-[0.72rem] leading-relaxed text-steel">
                {t.about.note}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <QualitySection />
      <ProcessTimeline />
      <CtaSection />
    </>
  )
}
