import { useEffect, useRef } from 'react'
import { Building2, Hotel, Store, Sun, TreePalm, Waves } from 'lucide-react'
import { gsap, initGsap } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/utils'
import { Eyebrow } from '@/components/ui/SectionHeading'
import { Reveal, RevealText } from '@/components/ui/Reveal'
import { SmartImage, type ImageBase } from '@/components/ui/SmartImage'

type Typology = {
  title: string
  subtitle: string
  image: ImageBase
  points: string[]
}

const typologies: Typology[] = [
  {
    title: 'Villas & maisons',
    subtitle: 'Grandes baies, transparence et continuité intérieur/extérieur',
    image: 'arch-villa',
    points: ['Baies coulissantes grande dimension', 'Pergolas et garde-corps de terrasse', 'Aluminium anthracite ou blanc'],
  },
  {
    title: 'Appartements & résidences',
    subtitle: 'Isolation, confort et durabilité au quotidien',
    image: 'service-garde-corps',
    points: ['Fenêtres aluminium ou PVC', 'Volets roulants et occultation', 'Garde-corps de balcons'],
  },
  {
    title: 'Bureaux & tertiaire',
    subtitle: 'Lignes nettes, lumière maîtrisée, entretien simple',
    image: 'service-aluminium',
    points: ['Façades vitrées et vitrines', 'Cloisons et vitrages intérieurs', 'Menuiseries à fort usage'],
  },
  {
    title: 'Commerces & espaces ouverts',
    subtitle: 'Visibilité, fluidité des accès, image premium',
    image: 'service-miroiterie',
    points: ['Devantures vitrées', 'Portes coulissantes', 'Miroiterie sur mesure'],
  },
]

const climate = [
  { icon: Sun, label: 'Ensoleillement', text: 'Protection solaire par volets, lames et vitrages adaptés.' },
  { icon: Waves, label: 'Littoral', text: 'Matériaux résistants à l’air marin et à l’humidité.' },
  { icon: TreePalm, label: 'Lumière naturelle', text: 'Grandes ouvertures pour capter la lumière du Sud.' },
]

export function Architecture() {
  const section = useRef<HTMLElement>(null)
  const row = useRef<HTMLDivElement>(null)

  useEffect(() => {
    initGsap()
    if (prefersReducedMotion()) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px)', () => {
      const el = row.current
      if (!el) return
      const tween = gsap.to(el, {
        x: () => -(el.scrollWidth - window.innerWidth + 80),
        ease: 'none',
        scrollTrigger: {
          trigger: section.current,
          start: 'top top',
          end: () => `+=${el.scrollWidth - window.innerWidth + 400}`,
          pin: true,
          scrub: 0.7,
          invalidateOnRefresh: true,
        },
      })
      return () => {
        tween.scrollTrigger?.kill()
        tween.kill()
      }
    })
    return () => mm.revert()
  }, [])

  return (
    <section id="architecture" ref={section} className="relative overflow-hidden bg-ink-950 text-alu-100">
      <div className="pointer-events-none absolute inset-0 bg-zellige opacity-[0.1]" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-ink-900 to-transparent" aria-hidden />

      <div className="relative py-24 md:py-32 lg:flex lg:min-h-[100svh] lg:flex-col lg:justify-center lg:py-24">
        <div className="container-x">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <Reveal y={16} duration={0.7}>
                <Eyebrow index="09" tone="dark">
                  Architecture marocaine
                </Eyebrow>
              </Reveal>
              <RevealText
                text="Des solutions pensées pour l’architecture marocaine"
                className="mt-6 max-w-2xl text-[clamp(1.9rem,4.4vw,3.3rem)] leading-[1.08]"
              />
            </div>
            <Reveal y={20} delay={0.1}>
              <p className="text-[0.95rem] leading-relaxed text-alu-400">
                Villas, résidences, bureaux ou commerces : nos menuiseries dialoguent avec la géométrie du bâtiment,
                la lumière méditerranéenne et un climat exigeant — sans jamais céder sur la finesse des lignes.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Galerie horizontale pilotée au défilement */}
        <div className="mt-14 lg:mt-16">
          <div
            ref={row}
            className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 md:px-8 lg:w-max lg:overflow-visible lg:px-6 xl:px-12"
          >
            {typologies.map((t) => (
              <article
                key={t.title}
                className="group relative w-[86vw] shrink-0 snap-center overflow-hidden rounded-[2rem] border border-white/10 sm:w-[62vw] lg:w-[42vw] xl:w-[34vw]"
              >
                <SmartImage
                  name={t.image}
                  alt={t.title}
                  className="aspect-[4/5] w-full"
                  sizes="(max-width: 640px) 86vw, (max-width: 1024px) 62vw, 34vw"
                  imgClassName="transition-transform duration-[1800ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/45 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
                  <h3 className="font-display text-[1.35rem] tracking-tight text-alu-100">{t.title}</h3>
                  <p className="mt-2 max-w-sm text-[0.86rem] leading-relaxed text-alu-300/85">{t.subtitle}</p>
                  <ul className="mt-5 grid gap-1.5">
                    {t.points.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-[0.78rem] text-alu-300/75">
                        <span className="size-1 rounded-full bg-glacier-400" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="container-x mt-12">
          <Reveal y={24} stagger={0.07} className="grid gap-4 sm:grid-cols-3">
            {climate.map(({ icon: Icon, label, text }) => (
              <div
                key={label}
                className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl"
              >
                <Icon className="mt-0.5 size-5 shrink-0 text-glacier-400" strokeWidth={1.6} />
                <div>
                  <p className="text-[0.88rem] font-medium text-alu-100">{label}</p>
                  <p className="mt-1.5 text-[0.8rem] leading-relaxed text-alu-400/80">{text}</p>
                </div>
              </div>
            ))}
          </Reveal>

          <Reveal y={20} delay={0.16} className="mt-8 flex flex-wrap gap-3">
            {[
              { icon: Building2, label: 'Résidentiel' },
              { icon: Hotel, label: 'Hôtellerie' },
              { icon: Store, label: 'Commercial' },
            ].map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="flex items-center gap-2.5 rounded-full border border-white/10 px-4 py-2 text-[0.78rem] text-alu-300"
              >
                <Icon className="size-4 text-glacier-400" strokeWidth={1.6} />
                {label}
              </span>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
