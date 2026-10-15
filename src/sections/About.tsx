import { useEffect, useRef } from 'react'
import { DraftingCompass, Factory, Ruler, Wrench } from 'lucide-react'
import { gsap, initGsap } from '@/lib/gsap'
import { finishes, glassTypes } from '@/data/configurator'
import { Eyebrow } from '@/components/ui/SectionHeading'
import { Reveal, RevealText } from '@/components/ui/Reveal'
import { SmartImage } from '@/components/ui/SmartImage'

const pillars = [
  {
    icon: DraftingCompass,
    title: 'Conception',
    text: 'Plans, élévations et détails techniques : chaque ouverture est étudiée avant la mise en fabrication.',
  },
  {
    icon: Factory,
    title: 'Fabrication',
    text: 'Coupes d’onglet, assemblages, étanchéité et contrôles qualité en atelier.',
  },
  {
    icon: Ruler,
    title: 'Sur mesure',
    text: 'Relevé de mesures sur site : dimensions exactes, ajustement parfait au tableau.',
  },
  {
    icon: Wrench,
    title: 'Installation',
    text: 'Pose, calage, réglages de quincaillerie et suivi après installation.',
  },
]

/** Fiche technique — des faits, pas des slogans. */
export function SpecSheet({ className }: { className?: string }) {
  return (
    <dl className={className}>
      <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-4">
        <dt>Profilés</dt>
        <dd>Aluminium à rupture de pont thermique · PVC multi-chambres</dd>
        <dt>Finitions</dt>
        <dd>{finishes.map((f) => f.label).join(' · ')}</dd>
        <dt>Vitrages</dt>
        <dd>{glassTypes.map((g) => g.label).join(' · ')}</dd>
        <dt>Applications</dt>
        <dd>Villas · Appartements · Bureaux · Commerces · Rénovation</dd>
      </div>
    </dl>
  )
}

export function About() {
  const root = useRef<HTMLElement>(null)
  const photo = useRef<HTMLDivElement>(null)
  const inset = useRef<HTMLDivElement>(null)

  useEffect(() => {
    initGsap()
    const ctx = gsap.context(() => {
      gsap.to(photo.current, {
        yPercent: -7,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })
      gsap.to(inset.current, {
        yPercent: 16,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="a-propos" ref={root} className="relative overflow-hidden bg-alu-100 py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-blueprint opacity-70" aria-hidden />
      <div className="container-x relative">
        <div className="grid gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
          {/* Visuels */}
          <div className="relative">
            <div ref={photo} className="relative">
              <SmartImage
                name="arch-villa"
                alt="Villa contemporaine au Maroc équipée de menuiseries aluminium anthracite"
                className="aspect-[4/5] rounded-[2rem] shadow-[0_60px_120px_-70px_rgba(6,8,10,0.65)] sm:aspect-[5/4] lg:aspect-[4/5]"
                sizes="(max-width: 1024px) 100vw, 48vw"
              />
              <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/25" />
            </div>

            <div
              ref={inset}
              className="absolute -bottom-10 -right-3 w-[52%] max-w-[320px] overflow-hidden rounded-3xl border border-white/60 bg-white/70 p-2 backdrop-blur-xl shadow-[0_40px_80px_-50px_rgba(6,8,10,0.7)] sm:-right-8"
            >
              <SmartImage
                name="service-aluminium"
                alt="Détail d’un profilé aluminium à rupture de pont thermique"
                className="aspect-[4/3] rounded-2xl"
                sizes="320px"
              />
              <p className="px-2 pb-1 pt-3 text-[0.7rem] uppercase tracking-[0.24em] text-ink-500">
                Précision d’usinage
              </p>
            </div>
          </div>

          {/* Texte */}
          <div className="flex flex-col justify-center pt-8 lg:pt-0">
            <Reveal y={16} duration={0.7}>
              <Eyebrow index="02">À propos · L’atelier</Eyebrow>
            </Reveal>

            <RevealText
              text="La précision comme signature"
              className="mt-6 text-[clamp(1.9rem,4.2vw,3.2rem)] leading-[1.06] text-ink-900"
            />

            <Reveal y={22} delay={0.1}>
              <p className="mt-6 max-w-xl text-[1rem] leading-relaxed text-ink-500">
                CRISTALUM MAROC conçoit, fabrique et installe des menuiseries aluminium &amp; PVC sur mesure. Notre
                travail commence par une lecture attentive du bâtiment — lumière, orientation, usage — puis se
                poursuit par une fabrication rigoureuse et une pose soignée.
              </p>
            </Reveal>

            <Reveal y={22} delay={0.16}>
              <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-ink-500">
                Nous croyons qu’une menuiserie bien conçue se remarque par ce qu’elle ne montre pas : une ligne fine,
                un joint net, un coulissement silencieux, une étanchéité durable.
              </p>
            </Reveal>

            <Reveal y={24} delay={0.2} stagger={0.08} className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2">
              {pillars.map(({ icon: Icon, title, text }) => (
                <div key={title} className="group">
                  <span className="flex size-11 items-center justify-center rounded-2xl border border-ink-900/10 bg-white/80 text-ink-800 transition-all duration-500 group-hover:-translate-y-1 group-hover:border-accent-400/60 group-hover:text-accent-700">
                    <Icon className="size-5" strokeWidth={1.6} />
                  </span>
                  <h3 className="mt-4 font-display text-[1rem] tracking-tight text-ink-900">{title}</h3>
                  <p className="mt-1.5 text-[0.87rem] leading-relaxed text-ink-500">{text}</p>
                </div>
              ))}
            </Reveal>

            <Reveal y={20} delay={0.24}>
              <SpecSheet className="mt-11 rounded-3xl border border-ink-900/8 bg-white/70 p-6 backdrop-blur-md [&_dt]:text-[0.7rem] [&_dt]:uppercase [&_dt]:tracking-[0.2em] [&_dt]:text-ink-500 [&_dd]:text-[0.85rem] [&_dd]:text-ink-800" />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
