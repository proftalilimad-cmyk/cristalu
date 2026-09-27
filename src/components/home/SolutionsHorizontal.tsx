import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import Media from '../ui/Media'
import SectionHeading from '../ui/SectionHeading'
import { MagneticLink } from '../ui/MagneticButton'
import { useI18n } from '../../i18n'
import { products } from '../../content'
import { gsap, prefersReducedMotion } from '../../lib/animation'
import { useMediaQuery } from '../../lib/hooks'

export default function SolutionsHorizontal() {
  const { t, L, locale } = useI18n()
  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  useEffect(() => {
    const sec = section.current
    const tr = track.current
    if (!sec || !tr || !isDesktop || prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      const distance = () => tr.scrollWidth - window.innerWidth + 120
      const tween = gsap.to(tr, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: sec,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      })
      return () => tween.kill()
    }, sec)

    return () => ctx.revert()
  }, [isDesktop])

  return (
    <section
      ref={section}
      id="solutions"
      dir="ltr"
      className="relative overflow-hidden bg-ink py-20 text-white lg:h-screen lg:py-0"
    >
      <div className="flex h-full flex-col justify-center gap-10 lg:gap-12">
        <div className="container-x">
          <SectionHeading
            eyebrow={t.solutions.eyebrow}
            title={t.solutions.title}
            intro={t.solutions.intro}
            tone="light"
            className="[&_h2]:text-white"
            aside={
              <MagneticLink to="/produits" variant="light">
                {t.solutions.all}
                <ArrowRight size={15} />
              </MagneticLink>
            }
          />
        </div>

        <div
          ref={track}
          className="flex gap-6 overflow-x-auto px-5 pb-6 no-scrollbar md:px-10 lg:overflow-visible lg:px-16"
          style={{ willChange: 'transform' }}
        >
          {products.map((p, i) => (
            <Link
              key={p.id}
              to={`/produits/${p.slug}`}
              dir={locale === 'ar' ? 'rtl' : 'ltr'}
              className="group flex w-[74vw] shrink-0 flex-col sm:w-[46vw] lg:w-[min(26vw,38vh)]"
            >
              <div className="relative overflow-hidden rounded-xl">
                <Media
                  src={p.media.src}
                  alt={L(p.media.alt)}
                  className="aspect-4/5 w-full"
                  imgClassName="transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                  sizes="(max-width: 1024px) 74vw, 25vw"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                <span className="absolute top-4 inline-flex items-center rounded-full bg-black/45 px-3 py-1 text-[0.58rem] uppercase tracking-[0.2em] text-white/80 backdrop-blur-sm ltr:left-4 rtl:right-4">
                  0{i + 1}
                </span>
              </div>

              <div className="mt-4 flex items-start justify-between gap-4 border-t border-white/12 pt-4">
                <div className="min-w-0">
                  <span className="text-[0.58rem] uppercase tracking-[0.2em] text-white/45">
                    {p.category}
                  </span>
                  <h3 className="mt-1.5 font-display text-lg leading-tight tracking-[-0.02em] text-white">
                    {L(p.name)}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-sm leading-snug text-white/55">
                    {L(p.tagline)}
                  </p>
                </div>
                <span className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 text-white transition-all duration-500 group-hover:border-brand-light group-hover:bg-brand-light group-hover:text-ink">
                  <ArrowUpRight size={15} className="rtl:-scale-x-100" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="container-x hidden text-[0.65rem] uppercase tracking-[0.2em] text-white/35 lg:block">
          {t.solutions.drag}
        </div>
      </div>
    </section>
  )
}
