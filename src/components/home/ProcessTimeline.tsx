import SectionHeading from '../ui/SectionHeading'
import { useI18n } from '../../i18n'
import { processSteps } from '../../content'
import { gsap } from '../../lib/animation'
import { useGsap } from '../../lib/hooks'

export default function ProcessTimeline() {
  const { t, L } = useI18n()

  const ref = useGsap<HTMLDivElement>(({ el, reduced }) => {
    const line = el.querySelector('[data-line]')
    const steps = el.querySelectorAll('[data-step]')

    if (reduced) {
      gsap.set(steps, { opacity: 1, y: 0 })
      gsap.set(line, { scaleY: 1 })
      return
    }

    gsap.fromTo(
      line,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        transformOrigin: 'top center',
        scrollTrigger: { trigger: el, start: 'top 70%', end: 'bottom 75%', scrub: true },
      },
    )

    steps.forEach((step) => {
      gsap.fromTo(
        step,
        { opacity: 0.15, y: 34 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'expo.out',
          scrollTrigger: { trigger: step, start: 'top 82%', once: true },
        },
      )
    })
  }, [])

  return (
    <section id="process" className="bg-paper py-24 lg:py-32">
      <div className="container-x">
        <SectionHeading eyebrow={t.process.eyebrow} title={t.process.title} intro={t.process.intro} />

        <div ref={ref} className="relative mt-16 ltr:pl-6 rtl:pr-6 md:ltr:pl-0 md:rtl:pr-0">
          <div
            aria-hidden
            className="absolute top-0 h-full w-px bg-ink/10 ltr:left-0 rtl:right-0 md:ltr:left-[9.5rem] md:rtl:right-[9.5rem]"
          >
            <div data-line className="h-full w-px origin-top bg-brand" />
          </div>

          <ol className="flex flex-col">
            {processSteps.map((step) => (
              <li
                key={step.id}
                data-step
                className="group relative grid grid-cols-1 gap-2 border-b border-ink/10 py-8 last:border-b-0 md:grid-cols-[9.5rem_1fr] md:gap-10"
              >
                <div className="flex items-baseline gap-4 md:block">
                  <span className="font-display text-3xl tracking-[-0.04em] text-ink/20 transition-colors duration-500 group-hover:text-brand md:text-4xl">
                    {step.index}
                  </span>
                </div>
                <div className="md:ltr:pl-10 md:rtl:pr-10">
                  <h3 className="fluid-h3 font-display">{L(step.title)}</h3>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-graphite">
                    {L(step.description)}
                  </p>
                </div>
                <span
                  aria-hidden
                  className="absolute top-[3.4rem] hidden h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-paper ring-1 ring-ink/30 transition-all duration-500 group-hover:bg-brand group-hover:ring-brand md:block ltr:left-[9.5rem] rtl:right-[9.5rem] rtl:translate-x-1/2"
                />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
