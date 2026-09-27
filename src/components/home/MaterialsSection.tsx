import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import Media from '../ui/Media'
import ErrorBoundary from '../ui/ErrorBoundary'
import SectionHeading from '../ui/SectionHeading'
import { useI18n } from '../../i18n'
import { materials } from '../../content'
import { ScrollTrigger, prefersReducedMotion, supportsWebGL } from '../../lib/animation'
import { useMediaQuery } from '../../lib/hooks'

const MaterialsScene = lazy(() => import('../three/MaterialsScene'))

export default function MaterialsSection() {
  const { t, L } = useI18n()
  const sectionRef = useRef<HTMLElement>(null)
  const progress = useRef(0)
  const pointer = useRef({ x: 0, y: 0 })
  const [index, setIndex] = useState(0)
  const [use3D, setUse3D] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  useEffect(() => {
    setUse3D(isDesktop && supportsWebGL() && !prefersReducedMotion())
  }, [isDesktop])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: '+=280%',
      pin: use3D ? '[data-materials-stage]' : false,
      scrub: true,
      onUpdate: (self) => {
        progress.current = self.progress
        const i = Math.min(materials.length - 1, Math.floor(self.progress * materials.length))
        setIndex((prev) => (prev === i ? prev : i))
      },
    })
    return () => st.kill()
  }, [use3D])

  useEffect(() => {
    if (!use3D) return
    const onMove = (e: MouseEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      pointer.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [use3D])

  const active = materials[index]

  return (
    <section
      ref={sectionRef}
      id="materiaux"
      className="relative bg-paper py-24 lg:py-0"
      aria-label={t.materials.title}
    >
      <div
        data-materials-stage
        className="relative flex min-h-[auto] flex-col justify-center lg:min-h-screen"
      >
        <div className="container-x py-10 lg:py-16">
          <SectionHeading
            eyebrow={t.materials.eyebrow}
            title={t.materials.title}
            intro={t.materials.intro}
            aside={
              use3D ? (
                <span className="eyebrow hidden lg:block">{t.materials.hint}</span>
              ) : null
            }
          />
        </div>

        {use3D ? (
          <div className="relative">
            <div className="pointer-events-none absolute inset-0 h-full w-full">
              <ErrorBoundary label="MaterialsScene">
                <Suspense fallback={null}>
                  <MaterialsScene progress={progress} pointer={pointer} />
                </Suspense>
              </ErrorBoundary>
            </div>

            <div className="container-x relative grid min-h-[52vh] grid-cols-12 items-center pb-16">
              <div className="col-span-12 lg:col-span-4">
                <div key={active.id} className="glass rounded-2xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
                  <span className="eyebrow">
                    0{index + 1} / 0{materials.length}
                  </span>
                  <h3 className="fluid-h3 mt-4 font-display">{L(active.name)}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-graphite">{L(active.intro)}</p>
                  <ul className="mt-6 flex flex-col gap-2">
                    {active.points.map((p, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-graphite">
                        <span className="mt-2 h-px w-4 shrink-0 bg-brand" />
                        {L(p)}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-7 grid grid-cols-3 gap-3 border-t border-ink/10 pt-5">
                    {active.metrics.map((m, i) => (
                      <div key={i}>
                        <div className="font-display text-lg tracking-tight">{m.value}</div>
                        <div className="mt-1 text-[0.62rem] uppercase tracking-[0.14em] text-steel">
                          {L(m.label)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="container-x grid gap-6 pb-6 md:grid-cols-3">
            {materials.map((m, i) => (
              <article key={m.id} className="flex flex-col gap-5">
                <Media
                  src={m.fallbackImage.src}
                  alt={L(m.fallbackImage.alt)}
                  className="aspect-4/3 w-full rounded-xl"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div>
                  <span className="eyebrow">0{i + 1}</span>
                  <h3 className="fluid-h3 mt-2 font-display">{L(m.name)}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-graphite">{L(m.intro)}</p>
                  <ul className="mt-4 flex flex-col gap-1.5">
                    {m.points.map((p, j) => (
                      <li key={j} className="text-sm text-steel">
                        — {L(p)}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
