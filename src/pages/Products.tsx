import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import Media from '../components/ui/Media'
import Reveal from '../components/ui/Reveal'
import CtaSection from '../components/home/CtaSection'
import { useI18n } from '../i18n'
import { products } from '../content'

const filters = [
  { id: 'all', label: { fr: 'Tout', ar: 'الكل' } },
  { id: 'aluminium', label: { fr: 'Aluminium', ar: 'ألمنيوم' } },
  { id: 'pvc', label: { fr: 'PVC', ar: 'PVC' } },
  { id: 'mixte', label: { fr: 'Mixte', ar: 'مختلط' } },
]

export default function Products() {
  const { t, L } = useI18n()
  const [filter, setFilter] = useState('all')
  const list = filter === 'all' ? products : products.filter((p) => p.category === filter)

  return (
    <>
      <PageHeader eyebrow={t.solutions.eyebrow} title={t.solutions.title} intro={t.solutions.intro}>
        <div className="mt-10 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`rounded-full border px-5 py-2 text-[0.72rem] uppercase tracking-[0.14em] transition-colors ${
                filter === f.id
                  ? 'border-ink bg-ink text-paper'
                  : 'border-ink/20 text-graphite hover:border-ink/60'
              }`}
            >
              {L(f.label)}
            </button>
          ))}
        </div>
      </PageHeader>

      <section className="bg-paper pb-24 lg:pb-32">
        <div className="container-x grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 0.06}>
              <Link to={`/produits/${p.slug}`} className="group flex h-full flex-col">
                <div className="relative overflow-hidden rounded-xl">
                  <Media
                    src={p.media.src}
                    alt={L(p.media.alt)}
                    className="aspect-4/5 w-full"
                    imgClassName="transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <span className="absolute top-4 rounded-full bg-white/85 px-3 py-1 text-[0.58rem] uppercase tracking-[0.18em] text-ink backdrop-blur ltr:left-4 rtl:right-4">
                    {p.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col pt-5">
                  <h2 className="font-display text-xl tracking-[-0.025em]">{L(p.name)}</h2>
                  <p className="mt-2 text-sm text-steel">{L(p.tagline)}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.16em] text-ink">
                    {t.solutions.discover}
                    <ArrowUpRight
                      size={14}
                      className="transition-transform duration-500 group-hover:translate-x-0.5"
                    />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaSection />
    </>
  )
}
