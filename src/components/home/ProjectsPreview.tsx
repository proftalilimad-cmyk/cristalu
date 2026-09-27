import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import Media from '../ui/Media'
import SectionHeading from '../ui/SectionHeading'
import { MagneticLink } from '../ui/MagneticButton'
import { useI18n } from '../../i18n'
import { projects } from '../../content'

export function ProjectCard({
  slug,
  title,
  location,
  category,
  year,
  src,
  alt,
  className = '',
  ratio = 'aspect-4/3',
}: {
  slug: string
  title: string
  location: string
  category: string
  year: string
  src: string
  alt: string
  className?: string
  ratio?: string
}) {
  return (
    <Link to={`/realisations/${slug}`} className={`group relative block ${className}`}>
      <div className={`relative overflow-hidden rounded-xl ${ratio}`}>
        <Media
          src={src}
          alt={alt}
          className="h-full w-full"
          imgClassName="transition-transform duration-[1.3s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent opacity-80 transition-opacity duration-700 group-hover:opacity-95" />
        <div className="absolute inset-x-0 bottom-0 translate-y-2 p-6 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
          <div className="flex items-center gap-3 text-[0.62rem] uppercase tracking-[0.2em] text-white/60">
            <span>{category}</span>
            <span className="h-px w-5 bg-white/40" />
            <span>{year}</span>
          </div>
          <h3 className="mt-2 font-display text-2xl leading-tight tracking-[-0.025em] text-white">
            {title}
          </h3>
          <p className="mt-1 text-sm text-white/70">{location}</p>
        </div>
        <span className="absolute top-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur-md transition-all duration-500 group-hover:opacity-100 ltr:right-5 rtl:left-5">
          <ArrowUpRight size={16} />
        </span>
      </div>
    </Link>
  )
}

export default function ProjectsPreview() {
  const { t, L } = useI18n()
  const featured = projects.slice(0, 4)

  return (
    <section className="bg-paper py-24 lg:py-32">
      <div className="container-x">
        <SectionHeading
          eyebrow={t.projects.eyebrow}
          title={t.projects.title}
          intro={t.projects.intro}
          aside={
            <MagneticLink to="/realisations" variant="outline">
              {t.projects.all}
              <ArrowUpRight size={15} />
            </MagneticLink>
          }
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {featured.map((p, i) => (
            <ProjectCard
              key={p.id}
              slug={p.slug}
              title={L(p.title)}
              location={L(p.location)}
              category={p.category}
              year={p.year}
              src={p.media.src}
              alt={L(p.media.alt)}
              ratio={i % 3 === 0 ? 'aspect-4/3 md:aspect-16/11' : 'aspect-4/3'}
            />
          ))}
        </div>

        <p className="mt-8 text-[0.7rem] uppercase tracking-[0.16em] text-steel">
          {t.projects.disclaimer}
        </p>
      </div>
    </section>
  )
}
