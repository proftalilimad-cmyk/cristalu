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
  const { t, L } = useI18n()
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
      <div className="flex h-full flex-col justify-center gap-12 lg:gap-16">
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
              className="group relative w-[78vw] shrink-0 sm:w-[52vw] lg:w-[30vw] xl:w-[26vw]"
            >
              <div className="relative aspect-3/4 overflow-hidden rounded-xl">
                <Media
                  src={p.media.src}
                  alt={L(p.media.alt)}
                  className="h-full w-full"
                  imgClassName="transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07]"
                  sizes="(max-width: 1024px) 78vw, 28vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <span className="text-[0.62rem] uppercase tracking-[0.22em] text-white/55">
                    0{i + 1} · {p.category}
                  </span>
                  <h3 className="mt-2 font-display text-xl leading-tight tracking-[-0.02em] text-white">
                    {L(p.name)}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-white/65">{L(p.tagline)}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.18em] text-white">
                    {t.solutions.discover}
                    <ArrowRight
                      size={14}
                      className="transition-transform duration-500 group-hover:translate-x-1"
                    />
                  </span>
                </div>
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
