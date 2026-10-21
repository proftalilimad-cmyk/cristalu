import { Award, Layers, Ruler, ShieldCheck, Sparkles, Wind } from 'lucide-react'
import { siteConfig, val } from '@/data/site'
import { verifiedFacts } from '@/data/process'
import { useCountUp, useInView } from '@/hooks'
import { Eyebrow } from '@/components/ui/SectionHeading'
import { Reveal, RevealText } from '@/components/ui/Reveal'

/** Compteurs strictement vérifiables (issus du contenu de ce site). */
const counters = [
  { value: verifiedFacts.serviceFamilies, label: 'Familles de solutions', suffix: '', icon: Layers },
  { value: verifiedFacts.processSteps, label: 'Étapes de fabrication maîtrisées', suffix: '', icon: Award },
  { value: verifiedFacts.aluminiumFinishes, label: 'Finitions aluminium', suffix: '', icon: Sparkles },
  { value: verifiedFacts.glassTypes, label: 'Types de vitrage', suffix: '', icon: ShieldCheck },
]

const pillars = [
  {
    title: 'Sur mesure',
    text: 'Conception adaptée à chaque projet : dimensions relevées sur site, détails étudiés, fabrication à l’unité.',
    icon: Ruler,
  },
  {
    title: 'Aluminium & PVC',
    text: 'Solutions complètes : deux matériaux complémentaires pour couvrir l’ensemble des besoins d’une façade.',
    icon: Layers,
  },
  {
    title: 'Qualité',
    text: 'Fabrication et installation professionnelles : assemblages contrôlés, réglages fins et pose soignée.',
    icon: ShieldCheck,
  },
]

function Counter({
  value,
  label,
  icon: Icon,
}: {
  value: number
  label: string
  icon: typeof Layers
}) {
  const { ref, inView } = useInView<HTMLDivElement>({ once: true, threshold: 0.4 })
  const animated = useCountUp(value, inView, 1600)

  return (
    <div
      ref={ref}
      className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl transition-[transform,border-color] duration-700 hover:-translate-y-1 hover:border-accent-400/40"
    >
      <Icon className="size-5 text-accent-400" strokeWidth={1.6} />
      <p className="mt-6 font-display text-[clamp(2.2rem,5vw,3.2rem)] leading-none tracking-tight text-alu-100">
        {Math.round(animated)}
      </p>
      <p className="mt-3 text-[0.84rem] leading-snug text-alu-400">{label}</p>
      <span className="pointer-events-none absolute -right-8 -top-8 size-24 rounded-full bg-accent-400/10 blur-2xl transition-opacity duration-700 group-hover:opacity-100" />
    </div>
  )
}

export function WhyCristalu() {
  const years = val(siteConfig.joinery.yearsOfExperience)

  return (
    <section className="relative overflow-hidden bg-alu-100 py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-blueprint opacity-60" aria-hidden />
      <div className="container-x relative">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal y={16} duration={0.7}>
              <Eyebrow index="08">Pourquoi CRISTALU</Eyebrow>
            </Reveal>
            <RevealText
              text="Des engagements vérifiables"
              className="mt-6 max-w-2xl text-[clamp(1.9rem,4.4vw,3.3rem)] leading-[1.06] text-ink-900"
            />
          </div>
          <Reveal y={18} delay={0.08}>
            <p className="max-w-md text-[0.95rem] leading-relaxed text-ink-500">
              Nous ne communiquons que sur ce que nous pouvons démontrer. Les chiffres ci-dessous correspondent
              précisément à l’offre décrite sur ce site.
            </p>
          </Reveal>
        </div>

        <Reveal y={26} delay={0.06} stagger={0.07} className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {years && (
            <div className="group relative overflow-hidden rounded-[1.5rem] border border-ink-900/10 bg-ink-900 p-6 text-alu-100">
              <Wind className="size-5 text-accent-400" strokeWidth={1.6} />
              <p className="mt-6 font-display text-[clamp(2.2rem,5vw,3.2rem)] leading-none tracking-tight">
                {years}
                <span className="text-accent-400">+</span>
              </p>
              <p className="mt-3 text-[0.84rem] leading-snug text-alu-400">Années d’expérience</p>
            </div>
          )}
          {counters.map((c) => (
            <Counter key={c.label} value={c.value} label={c.label} icon={c.icon} />
          ))}
        </Reveal>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {pillars.map(({ title, text, icon: Icon }, i) => (
            <Reveal key={title} y={26} delay={i * 0.06}>
              <div className="group relative h-full overflow-hidden rounded-[1.5rem] border border-ink-900/10 bg-white/80 p-7 backdrop-blur-md transition-[transform,box-shadow] duration-700 hover:-translate-y-1.5 hover:shadow-[0_40px_80px_-60px_rgba(6,8,10,0.7)]">
                <span className="flex size-12 items-center justify-center rounded-2xl border border-ink-900/10 bg-alu-100 text-ink-800 transition-all duration-700 group-hover:border-accent-400/60 group-hover:text-accent-700">
                  <Icon className="size-5" strokeWidth={1.6} />
                </span>
                <h3 className="mt-6 font-display text-[1.2rem] tracking-tight text-ink-900">{title}</h3>
                <p className="mt-3 text-[0.9rem] leading-relaxed text-ink-500">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
