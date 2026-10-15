import { useMemo, useState } from 'react'
import { ArrowUpRight, LayoutGrid } from 'lucide-react'
import { projectCategories, projects, type ProjectCategory } from '@/data/projects'
import { cn } from '@/lib/utils'
import { ProjectViewer } from '@/components/ProjectViewer'
import { Eyebrow } from '@/components/ui/SectionHeading'
import { Reveal, RevealText } from '@/components/ui/Reveal'
import { SmartImage } from '@/components/ui/SmartImage'

/** Mosaïque : ratios explicites sur mobile, travées déterminées sur grand écran. */
const spanClass: Record<string, string> = {
  tall: 'aspect-[3/4] sm:aspect-auto sm:row-span-4',
  wide: 'aspect-[16/10] sm:aspect-auto sm:col-span-2 sm:row-span-2',
  normal: 'aspect-[4/3] sm:aspect-auto sm:row-span-2',
}

const spanWrapper: Record<string, string> = {
  tall: 'sm:row-span-4',
  wide: 'sm:col-span-2 sm:row-span-2',
  normal: 'sm:row-span-2',
}

export function Gallery() {
  const [filter, setFilter] = useState<ProjectCategory | 'Tout'>('Tout')
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const filtered = useMemo(
    () => (filter === 'Tout' ? projects : projects.filter((p) => p.category === filter)),
    [filter],
  )

  const categories: Array<ProjectCategory | 'Tout'> = ['Tout', ...projectCategories]

  return (
    <section id="realisations" className="relative overflow-hidden bg-alu-100 py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-blueprint opacity-50" aria-hidden />
      <div className="container-x relative">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Reveal y={16} duration={0.7}>
              <Eyebrow index="05">Réalisations</Eyebrow>
            </Reveal>
            <RevealText
              text="Un portfolio d’architectures"
              className="mt-6 max-w-2xl text-[clamp(1.9rem,4.4vw,3.3rem)] leading-[1.06] text-ink-900"
            />
          </div>
          <Reveal y={18} delay={0.08}>
            <p className="flex items-start gap-2.5 text-[0.86rem] leading-relaxed text-ink-500 lg:max-w-xs">
              <LayoutGrid className="mt-0.5 size-4 shrink-0 text-glacier-600" />
              Sélectionnez une famille de solutions puis ouvrez un projet pour voir le détail technique.
            </p>
          </Reveal>
        </div>

        {/* Filtres */}
        <Reveal y={20} delay={0.1} className="no-scrollbar mt-10 -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:px-0">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                setFilter(c)
                setOpenIndex(null)
              }}
              className={cn(
                'shrink-0 rounded-full border px-4 py-2 text-[0.78rem] font-medium transition-all duration-500',
                filter === c
                  ? 'border-ink-900 bg-ink-900 text-alu-100'
                  : 'border-ink-900/12 bg-white/70 text-ink-600 hover:border-ink-900/30 hover:text-ink-900',
              )}
            >
              {c}
            </button>
          ))}
        </Reveal>

        {/* Masonry */}
        <div className="mt-8 grid grid-flow-dense grid-cols-1 gap-4 [grid-auto-rows:auto] sm:grid-cols-2 sm:[grid-auto-rows:11rem] lg:grid-cols-3 lg:[grid-auto-rows:12rem]">
          {filtered.map((project, i) => (
            <Reveal
              key={project.id}
              y={30}
              delay={(i % 3) * 0.05}
              className={cn('h-full', spanWrapper[project.span])}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(i)}
                className={cn(
                  'group relative block h-full w-full overflow-hidden rounded-[1.5rem] border border-ink-900/8 text-left',
                  'shadow-[0_30px_70px_-60px_rgba(6,8,10,0.65)] transition-[transform,box-shadow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-[0_50px_90px_-60px_rgba(6,8,10,0.8)]',
                  spanClass[project.span] ?? spanClass.normal,
                )}
              >
                <SmartImage
                  name={project.image}
                  alt={project.title}
                  className="h-full w-full"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  imgClassName="transition-transform duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/15 to-transparent opacity-90 transition-opacity duration-700 group-hover:opacity-100" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5">
                  <span className="text-[0.64rem] uppercase tracking-[0.24em] text-glacier-300">{project.category}</span>
                  <h3 className="mt-2 font-display text-[1.05rem] leading-snug tracking-tight text-alu-100">
                    {project.title}
                  </h3>
                  <span className="mt-3 flex items-center gap-1.5 text-[0.76rem] text-alu-300/0 transition-all duration-500 group-hover:text-alu-200">
                    Voir le projet <ArrowUpRight className="size-3.5" />
                  </span>
                </div>
                <span className="absolute right-4 top-4 flex size-9 translate-y-2 items-center justify-center rounded-full border border-white/25 bg-ink-950/45 text-glacier-300 opacity-0 backdrop-blur-md transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <ArrowUpRight className="size-4" />
                </span>
              </button>
            </Reveal>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-10 text-center text-[0.9rem] text-ink-500">
            Aucun projet dans cette catégorie pour le moment.
          </p>
        )}
      </div>

      <ProjectViewer
        project={openIndex === null ? null : (filtered[openIndex] ?? null)}
        index={openIndex ?? 0}
        total={filtered.length}
        onClose={() => setOpenIndex(null)}
        onPrev={() => setOpenIndex((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length))}
        onNext={() => setOpenIndex((i) => (i === null ? null : (i + 1) % filtered.length))}
      />
    </section>
  )
}
