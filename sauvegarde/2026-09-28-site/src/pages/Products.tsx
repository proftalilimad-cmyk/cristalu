import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import Media from '../components/ui/Media'
import Reveal from '../components/ui/Reveal'
import CtaSection from '../components/home/CtaSection'
import { useI18n } from '../i18n'
import { products, momoBox } from '../content'

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
                  ? 'border-brand bg-brand text-white'
                  : 'border-ink/20 text-graphite hover:border-brand hover:text-brand'
              }`}
            >
              {L(f.label)}
            </button>
          ))}
        </div>
      </PageHeader>

      <section className="bg-paper pb-16">
        <div className="container-x">
          <Reveal>
            <Link
              to="/momo-box"
              className="group grid overflow-hidden rounded-xl bg-ink text-white md:grid-cols-2"
            >
              <div className="relative aspect-16/10 md:aspect-auto md:min-h-[22rem]">
                <Media
                  src={momoBox.media.hero.src}
                  alt={L(momoBox.media.hero.alt)}
                  className="h-full w-full"
                  imgClassName="transition-transform duration-[1.3s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="flex flex-col justify-center gap-5 p-8 lg:p-12">
                <span className="inline-flex w-fit items-center rounded-full bg-brand px-4 py-1.5 text-[0.6rem] uppercase tracking-[0.2em] text-white">
                  {L(momoBox.category)}
                </span>
                <h2 className="font-display text-[clamp(1.9rem,4vw,3.2rem)] font-extrabold leading-none tracking-[-0.04em]">
                  MOMO<span className="text-brand-light"> Box</span>
                </h2>
                <p className="max-w-md text-sm leading-relaxed text-white/65">{L(momoBox.lead)}</p>
                <span className="inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.18em]">
                  {t.solutions.discover}
                  <ArrowUpRight
                    size={14}
                    className="transition-transform duration-500 group-hover:translate-x-1"
                  />
                </span>
              </div>
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="bg-paper pb-24 lg:pb-32">
        <div className="container-x grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 0.06}>
              <Link to={`/produits/${p.slug}`} className="group flex h-full flex-col">
                <div className="relative overflow-hidden rounded-xl">
                  <Media
                    src={p.media.src}
                    alt={L(p.media.alt)}
                    className="w-full"
                    imgClassName="transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <span className="absolute top-4 rounded-full bg-white/85 px-3 py-1 text-[0.58rem] uppercase tracking-[0.18em] text-ink backdrop-blur ltr:left-4 rtl:right-4">
                    {p.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col pt-4">
                  <h2 className="font-display text-xl tracking-[-0.025em]">{L(p.name)}</h2>
                  <p className="mt-1.5 text-sm leading-snug text-steel">{L(p.tagline)}</p>
                  <span className="mt-3 inline-flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.16em] text-ink">
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
