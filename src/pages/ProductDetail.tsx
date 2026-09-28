import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import Media from '../components/ui/Media'
import Reveal from '../components/ui/Reveal'
import SplitLines from '../components/ui/SplitLines'
import { MagneticLink } from '../components/ui/MagneticButton'
import CtaSection from '../components/home/CtaSection'
import NotFound from './NotFound'
import { useI18n } from '../i18n'
import { products } from '../content'

export default function ProductDetail() {
  const { slug } = useParams()
  const { t, L } = useI18n()
  const product = products.find((p) => p.slug === slug)
  if (!product) return <NotFound />

  const others = products.filter((p) => p.slug !== slug).slice(0, 3)

  return (
    <>
      <article className="bg-paper pt-32 lg:pt-40">
        <div className="container-x">
          <Link
            to="/produits"
            className="inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.16em] text-steel hover:text-ink"
          >
            <ArrowLeft size={14} /> {t.nav.products}
          </Link>

          <div className="mt-8 grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <span className="eyebrow">{product.category}</span>
              <SplitLines
                as="h1"
                text={L(product.name)}
                className="mt-4 font-display text-[clamp(2.2rem,5.5vw,4.5rem)] font-extrabold leading-[0.96] tracking-[-0.045em]"
              />
              <Reveal delay={0.1}>
                <p className="mt-5 max-w-xl font-display text-lg tracking-[-0.02em] text-graphite">
                  {L(product.tagline)}
                </p>
                <p className="mt-6 max-w-xl text-sm leading-relaxed text-graphite">
                  {L(product.description)}
                </p>
              </Reveal>

              <Reveal delay={0.16} className="mt-9 flex flex-wrap gap-3">
                <MagneticLink to="/contact">
                  {t.nav.quote}
                  <ArrowUpRight size={15} />
                </MagneticLink>
                <MagneticLink to="/realisations" variant="outline">
                  {t.projects.all}
                </MagneticLink>
              </Reveal>
            </div>

            <div className="lg:col-span-5">
              <Reveal mask>
                <Media
                  src={product.media.src}
                  alt={L(product.media.alt)}
                  className="aspect-4/3 w-full rounded-xl"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                />
              </Reveal>
            </div>
          </div>

          <div className="mt-20 grid gap-12 border-t border-ink/10 pt-12 lg:grid-cols-2">
            <div>
              <h2 className="eyebrow">Caractéristiques</h2>
              <ul className="mt-6 flex flex-col divide-y divide-ink/10">
                {product.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-4 py-4">
                    <span className="font-display text-sm text-steel">0{i + 1}</span>
                    <span className="text-sm text-graphite">{L(f)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="eyebrow">Spécifications</h2>
              <dl className="mt-6 flex flex-col divide-y divide-ink/10">
                {product.specs.map((s, i) => (
                  <div key={i} className="flex items-baseline justify-between gap-6 py-4">
                    <dt className="text-sm text-steel">{L(s.label)}</dt>
                    <dd className="text-end font-display text-sm tracking-[-0.01em]">
                      {L(s.value)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="mt-20 pb-20">
            <h2 className="eyebrow">{t.solutions.all}</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {others.map((o) => (
                <Link key={o.id} to={`/produits/${o.slug}`} className="group">
                  <Media
                    src={o.media.src}
                    alt={L(o.media.alt)}
                    className="aspect-4/3 w-full rounded-lg"
                    imgClassName="transition-transform duration-1000 group-hover:scale-105"
                    sizes="33vw"
                  />
                  <h3 className="mt-3 font-display text-base tracking-[-0.02em]">{L(o.name)}</h3>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </article>

      <CtaSection />
    </>
  )
}
