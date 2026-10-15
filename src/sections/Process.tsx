import { useEffect, useRef } from 'react'
import { processSteps } from '@/data/process'
import { gsap, initGsap } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/utils'
import { Eyebrow } from '@/components/ui/SectionHeading'
import { Reveal, RevealText } from '@/components/ui/Reveal'

function StepCard({
  index,
  title,
  description,
  detail,
  icon: Icon,
}: (typeof processSteps)[number]) {
  return (
    <article className="group relative flex h-full w-[80vw] max-w-[22rem] shrink-0 flex-col justify-between rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-7 backdrop-blur-xl transition-[border-color,transform,background-color] duration-700 hover:-translate-y-1.5 hover:border-accent-400/40 hover:bg-white/[0.06] sm:w-[26rem]">
      <div>
        <div className="flex items-start justify-between">
          <span className="font-display text-[2.4rem] leading-none tracking-tight text-alu-500/40 transition-colors duration-700 group-hover:text-accent-400/70">
            {index}
          </span>
          <span className="flex size-12 items-center justify-center rounded-2xl border border-white/12 bg-ink-950/40 text-accent-300 transition-transform duration-700 group-hover:scale-105 group-hover:rotate-[4deg]">
            <Icon className="size-5.5" strokeWidth={1.6} />
          </span>
        </div>
        <h3 className="mt-8 font-display text-[1.3rem] tracking-tight text-alu-100">{title}</h3>
        <p className="mt-3 text-[0.9rem] leading-relaxed text-alu-300/85">{description}</p>
      </div>
      <p className="mt-7 border-t border-white/10 pt-5 text-[0.78rem] leading-relaxed text-alu-400/75">{detail}</p>
    </article>
  )
}

export function Process() {
  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const progress = useRef<HTMLDivElement>(null)

  useEffect(() => {
    initGsap()
    if (prefersReducedMotion()) {
      gsap.set('[data-step-card]', { opacity: 1, y: 0, filter: 'none' })
      return
    }
    const mm = gsap.matchMedia()

    // Desktop : timeline horizontale épinglée, pilotée par le défilement
    mm.add('(min-width: 1024px)', () => {
      const el = track.current
      const sectionEl = section.current
      if (!el || !sectionEl) return
      const distance = () => Math.max(0, el.scrollWidth - window.innerWidth + 96)

      const tween = gsap.to(el, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionEl,
          start: 'top top',
          end: () => `+=${distance() + window.innerHeight * 0.6}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progress.current) progress.current.style.transform = `scaleX(${self.progress})`
          },
        },
      })
      return () => {
        tween.scrollTrigger?.kill()
        tween.kill()
      }
    })

    // Mobile / tablette : apparition verticale progressive
    mm.add('(max-width: 1023px)', () => {
      const cards = gsap.utils.toArray<HTMLElement>('[data-step-card]')
      const tweens = cards.map((card) =>
        gsap.fromTo(
          card,
          { opacity: 0, y: 40, filter: 'blur(8px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.9,
            ease: 'cristal',
            scrollTrigger: { trigger: card, start: 'top 88%', once: true },
          },
        ),
      )
      return () => tweens.forEach((t) => t.scrollTrigger?.kill())
    })

    return () => mm.revert()
  }, [])

  return (
    <section id="expertise" ref={section} className="relative overflow-hidden bg-ink-900 py-24 text-alu-100 md:py-0">
      <div className="pointer-events-none absolute inset-0 bg-hatch opacity-25" aria-hidden />

      <div className="relative md:py-32 lg:flex lg:min-h-[100svh] lg:flex-col lg:justify-center lg:py-24">
        <div className="container-x">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Reveal y={16} duration={0.7}>
                <Eyebrow index="07" tone="dark">
                  Notre expertise · Méthode
                </Eyebrow>
              </Reveal>
              <RevealText
                text="Du premier conseil au suivi"
                className="mt-6 max-w-2xl text-[clamp(1.9rem,4.4vw,3.3rem)] leading-[1.06]"
              />
            </div>
            <Reveal y={18} delay={0.08}>
              <p className="max-w-sm text-[0.92rem] leading-relaxed text-alu-400">
                Six étapes maîtrisées, du relevé de mesures à l’accompagnement après pose. Faites défiler : la méthode
                se déroule.
              </p>
            </Reveal>
          </div>

          {/* Barre de progression de la timeline (desktop) */}
          <div className="mt-10 hidden h-px w-full overflow-hidden bg-white/10 lg:block">
            <div
              ref={progress}
              className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-accent-500 via-accent-300 to-accent-400"
            />
          </div>
        </div>

        {/* Timeline horizontale (desktop) */}
        <div className="mt-12 hidden lg:block">
          <div ref={track} className="flex w-max items-stretch gap-6 px-6 xl:px-12">
            {processSteps.map((step, i) => (
              <div key={step.index} className="relative flex items-stretch">
                <StepCard {...step} />
                {i < processSteps.length - 1 && (
                  <span className="absolute -right-6 top-1/2 flex h-px w-6 -translate-y-1/2 items-center bg-gradient-to-r from-white/25 to-transparent">
                    <span className="absolute right-0 size-1.5 -translate-y-1/2 rounded-full bg-accent-400/80" />
                  </span>
                )}
              </div>
            ))}
            <div className="flex w-[26rem] shrink-0 flex-col justify-center rounded-[1.75rem] border border-dashed border-white/12 p-8">
              <p className="font-display text-[1.05rem] tracking-tight text-alu-100">Votre projet commence ici</p>
              <p className="mt-3 text-[0.86rem] leading-relaxed text-alu-400">
                Décrivez-nous votre ouverture, vos contraintes et votre calendrier : nous revenons vers vous avec une
                proposition technique et un devis détaillé.
              </p>
            </div>
          </div>
        </div>

        {/* Timeline verticale (mobile / tablette) */}
        <div className="container-x mt-10 grid gap-4 lg:hidden">
          {processSteps.map((step, i) => (
            <div key={step.index} data-step-card className="relative pl-12">
              <span className="absolute left-[1.35rem] top-0 h-full w-px bg-gradient-to-b from-white/25 via-white/10 to-transparent" />
              <span className="absolute left-0 top-1 flex size-11 items-center justify-center rounded-2xl border border-white/12 bg-ink-950 text-accent-300">
                <step.icon className="size-5" strokeWidth={1.6} />
              </span>
              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl">
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-[0.8rem] tracking-[0.2em] text-accent-400">
                    {step.index}
                  </span>
                  <h3 className="font-display text-[1.1rem] tracking-tight text-alu-100">{step.title}</h3>
                </div>
                <p className="mt-2.5 text-[0.87rem] leading-relaxed text-alu-300/85">{step.description}</p>
                <p className="mt-3 text-[0.76rem] leading-relaxed text-alu-400/70">{step.detail}</p>
              </div>
              {i === processSteps.length - 1 && <span className="block h-2" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
