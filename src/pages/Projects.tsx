import { useState } from 'react'
import PageHeader from '../components/ui/PageHeader'
import Reveal from '../components/ui/Reveal'
import { ProjectCard } from '../components/home/ProjectsPreview'
import CtaSection from '../components/home/CtaSection'
import { useI18n } from '../i18n'
import { projectCategories, projects } from '../content'

export default function Projects() {
  const { t, L } = useI18n()
  const [category, setCategory] = useState<string>('all')
  const list = category === 'all' ? projects : projects.filter((p) => p.category === category)

  return (
    <>
      <PageHeader eyebrow={t.projects.eyebrow} title={t.projects.title} intro={t.projects.intro}>
        <div className="mt-10 flex flex-wrap gap-2">
          {projectCategories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`rounded-full border px-5 py-2 text-[0.72rem] uppercase tracking-[0.14em] transition-colors ${
                category === c.id
                  ? 'border-brand bg-brand text-white'
                  : 'border-ink/20 text-graphite hover:border-brand hover:text-brand'
              }`}
            >
              {L(c.label)}
            </button>
          ))}
        </div>
      </PageHeader>

      <section className="bg-paper pb-24 lg:pb-32">
        <div className="container-x grid gap-5 md:grid-cols-2">
          {list.map((p, i) => (
            <Reveal key={p.id} delay={(i % 2) * 0.06}>
              <ProjectCard
                slug={p.slug}
                title={L(p.title)}
                location={L(p.location)}
                category={p.category}
                year={p.year}
                src={p.media.src}
                alt={L(p.media.alt)}
                ratio={i % 3 === 0 ? 'aspect-4/3 md:aspect-16/11' : 'aspect-4/3'}
              />
            </Reveal>
          ))}
        </div>
        <div className="container-x">
          <p className="mt-8 text-[0.7rem] uppercase tracking-[0.16em] text-steel">
            {t.projects.disclaimer}
          </p>
        </div>
      </section>

      <CtaSection />
    </>
  )
}
