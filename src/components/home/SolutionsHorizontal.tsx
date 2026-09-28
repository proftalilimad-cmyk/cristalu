import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
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
      className="relative overflow-hidden bg-ink py-20 text-white lg:h-screen lg:py-0"
    >
      <div className="flex h-full flex-col justify-center gap-9 lg:gap-11">
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
          dir="ltr"
          className="flex gap-5 overflow-x-auto px-5 pb-4 no-scrollbar md:gap-6 md:px-10 lg:overflow-visible lg:px-16"
          style={{ willChange: 'transform' }}
        >
          {products.map((p, i) => (
            <Link
              key={p.id}
              to={`/produits/${p.slug}`}
              className="group flex w-[76vw] shrink-0 flex-col sm:w-[48vw] lg:w-[32vw] xl:w-[28vw]"
            >
              <div className="relative overflow-hidden rounded-xl">
                <Media
                  src={p.media.src}
                  alt={L(p.media.alt)}
                  className="aspect-4/3 w-full"
                  imgClassName="transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                  sizes="(max-width: 640px) 76vw, (max-width: 1024px) 48vw, 30vw"
                />
                <span className="absolute top-3 rounded-full bg-black/55 px-3 py-1 text-[0.56rem] uppercase tracking-[0.18em] text-white backdrop-blur ltr:left-3 rtl:right-3">
                  0{i + 1} · {p.category}
                </span>
              </div>

              <div className="pt-4" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                <h3 className="font-display text-lg leading-tight tracking-[-0.025em] text-white">
                  {L(p.name)}
                </h3>
                <p className="mt-1.5 line-clamp-2 text-sm leading-snug text-white/55">
                  {L(p.tagline)}
                </p>
                <span className="mt-3 inline-flex items-center gap-2 text-[0.66rem] uppercase tracking-[0.18em] text-white/80 transition-colors group-hover:text-white">
                  {t.solutions.discover}
                  <ArrowRight
                    size={13}
                    className="transition-transform duration-500 group-hover:translate-x-1"
                  />
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
