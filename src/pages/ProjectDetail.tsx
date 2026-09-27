import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import Media from '../components/ui/Media'
import Reveal from '../components/ui/Reveal'
import SplitLines from '../components/ui/SplitLines'
import { MagneticLink } from '../components/ui/MagneticButton'
import CtaSection from '../components/home/CtaSection'
import NotFound from './NotFound'
import { useI18n } from '../i18n'
import { projects } from '../content'

export default function ProjectDetail() {
  const { slug } = useParams()
  const { t, L } = useI18n()
  const index = projects.findIndex((p) => p.slug === slug)
  const project = projects[index]
  if (!project) return <NotFound />
  const next = projects[(index + 1) % projects.length]

  return (
    <>
      <article className="bg-paper pt-32 lg:pt-40">
        <div className="container-x">
          <Link
            to="/realisations"
            className="inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.16em] text-steel hover:text-ink"
          >
            <ArrowLeft size={14} /> {t.projects.back}
          </Link>

          <SplitLines
            as="h1"
            text={L(project.title)}
            className="mt-8 max-w-4xl font-display text-[clamp(2.2rem,6vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.05em]"
          />

          <Reveal delay={0.08}>
            <dl className="mt-10 grid grid-cols-2 gap-6 border-y border-ink/10 py-6 sm:grid-cols-4">
              <div>
                <dt className="eyebrow">{t.projects.location}</dt>
                <dd className="mt-2 text-sm text-graphite">{L(project.location)}</dd>
              </div>
              <div>
                <dt className="eyebrow">{t.projects.category}</dt>
                <dd className="mt-2 text-sm capitalize text-graphite">{project.category}</dd>
              </div>
              <div>
                <dt className="eyebrow">{t.projects.year}</dt>
                <dd className="mt-2 text-sm text-graphite">{project.year}</dd>
              </div>
              <div>
                <dt className="eyebrow">{t.projects.scope}</dt>
                <dd className="mt-2 text-sm text-graphite">{project.scope.length}</dd>
              </div>
            </dl>
          </Reveal>
        </div>

        <div className="container-x mt-12">
          <Reveal mask>
            <Media
              src={project.media.src}
              alt={L(project.media.alt)}
              className="aspect-16/9 w-full rounded-xl"
              sizes="100vw"
              priority
            />
          </Reveal>
        </div>

        <div className="container-x mt-16 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="max-w-2xl font-display text-[clamp(1.2rem,2.4vw,1.9rem)] leading-[1.2] tracking-[-0.03em]">
                {L(project.summary)}
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <h2 className="eyebrow">{t.projects.scope}</h2>
            <ul className="mt-5 flex flex-col divide-y divide-ink/10">
              {project.scope.map((s, i) => (
                <li key={i} className="py-3 text-sm text-graphite">
                  {L(s)}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {project.gallery?.length ? (
          <div className="container-x mt-16 grid gap-5 md:grid-cols-2">
            {project.gallery.map((g, i) => (
              <Reveal key={i} mask delay={i * 0.05}>
                <Media
                  src={g.src}
                  alt={L(g.alt)}
                  className="aspect-4/3 w-full rounded-xl"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </Reveal>
            ))}
          </div>
        ) : null}

        <div className="container-x my-20">
          <div className="rule" />
          <Link
            to={`/realisations/${next.slug}`}
            className="group flex items-center justify-between gap-6 py-10"
          >
            <div>
              <span className="eyebrow">{t.projects.next}</span>
              <h2 className="mt-3 font-display text-[clamp(1.6rem,4vw,3rem)] tracking-[-0.04em]">
                {L(next.title)}
              </h2>
            </div>
            <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-ink/20 transition-all duration-500 group-hover:border-brand group-hover:bg-brand group-hover:text-white">
              <ArrowUpRight size={18} />
            </span>
          </Link>
        </div>

        <div className="container-x pb-12">
          <MagneticLink to="/contact">
            {t.nav.quote}
            <ArrowUpRight size={15} />
          </MagneticLink>
        </div>
      </article>

      <CtaSection />
    </>
  )
}
