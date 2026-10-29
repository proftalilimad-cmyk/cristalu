import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, ArrowUpRight, Check, MapPin, Navigation, Timer } from 'lucide-react'
import { allCitiesVerified, cities, serviceAreaNotice } from '@/data/cities'
import { siteConfig, val } from '@/data/site'
import { useCity } from '@/lib/cityStore'
import { cn } from '@/lib/utils'
import { LinkButton } from '@/components/ui/Button'
import { MoroccoMap } from '@/components/MoroccoMap'
import { Eyebrow } from '@/components/ui/SectionHeading'
import { Reveal, RevealText } from '@/components/ui/Reveal'

const MAP_LEGEND = [
  { label: 'Ville sélectionnée', tone: 'bg-accent-500' },
  { label: 'Zone à confirmer', tone: 'bg-alu-600' },
]

export function ServiceArea({ id = 'zone', index = '10' }: { id?: string; index?: string }) {
  const [hovered, setHovered] = useState<string | null>(null)
  const [selected, setSelected] = useCity()

  const activeId = hovered ?? selected?.id ?? 'tanger'
  const active = cities.find((c) => c.id === activeId) ?? cities[0]
  const hours = val(siteConfig.hours)

  return (
    <section id={id} className="relative overflow-hidden bg-alu-100 py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-blueprint opacity-60" aria-hidden />
      <div className="pointer-events-none absolute -right-40 top-24 size-[32rem] rounded-full bg-accent-400/10 blur-[130px]" aria-hidden />

      <div className="container-x relative">
        <div className="grid gap-14 lg:grid-cols-[1fr_0.92fr] lg:items-start lg:gap-20">
          {/* Carte */}
          <Reveal y={30} duration={1.1} className="lg:sticky lg:top-28">
            <div className="relative overflow-hidden rounded-[2rem] border border-ink-900/8 bg-gradient-to-b from-white via-alu-100 to-alu-200 p-5 shadow-[0_50px_110px_-80px_rgba(6,8,10,0.7)] md:p-7">
              <div className="pointer-events-none absolute inset-0 bg-blueprint opacity-40" aria-hidden />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />

              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <p className="text-[0.62rem] uppercase tracking-[0.26em] text-ink-500">Royaume du Maroc · 9 villes</p>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={active.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="mt-1.5 font-display text-[1.1rem] tracking-tight text-ink-900"
                    >
                      {active.name}
                      <span className="ml-2 text-[0.76rem] font-normal text-ink-500">{active.region}</span>
                    </motion.p>
                  </AnimatePresence>
                </div>
                <span className="flex shrink-0 items-center gap-2 rounded-full border border-ink-900/10 bg-white/80 px-3 py-1.5 text-[0.66rem] text-ink-600">
                  <Navigation className="size-3.5 text-accent-600" />
                  Survol & sélection
                </span>
              </div>

              <MoroccoMap
                className="mt-2"
                activeId={activeId}
                selectedName={selected?.name ?? ''}
                onHover={setHovered}
                onSelect={(city) => setSelected(city)}
              />

              {/* Accès rapide par nom (la carte reste le sélecteur principal) */}
              <div className="relative mt-1 flex flex-wrap gap-1.5">
                {cities.map((city) => {
                  const isSelected = city.id === selected?.id
                  return (
                    <button
                      key={city.id}
                      type="button"
                      onMouseEnter={() => setHovered(city.id)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => setSelected(isSelected ? null : city)}
                      aria-pressed={isSelected}
                      className={cn(
                        'rounded-full border px-3 py-1.5 text-[0.72rem] transition-all duration-500',
                        isSelected
                          ? 'border-accent-500/50 bg-accent-400/15 font-medium text-accent-700'
                          : 'border-ink-900/10 bg-white/70 text-ink-600 hover:border-ink-900/25 hover:text-ink-900',
                      )}
                    >
                      {city.name}
                    </button>
                  )
                })}
              </div>

              <div className="relative mt-3 flex flex-wrap items-center justify-between gap-x-5 gap-y-2 border-t border-ink-900/8 pt-4">
                <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
                  {MAP_LEGEND.map((item) => (
                    <li key={item.label} className="flex items-center gap-2 text-[0.7rem] text-ink-500">
                      <span className={cn('size-2.5 rounded-full ring-2 ring-white', item.tone)} />
                      {item.label}
                    </li>
                  ))}
                </ul>
                <p className="text-[0.66rem] uppercase tracking-[0.2em] text-ink-400">
                  Fond de carte : Natural Earth
                </p>
                <p className="w-full text-[0.72rem] text-ink-500 md:hidden">
                  Touchez une ville sur la carte pour la sélectionner.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Contenu */}
          <div>
            <Reveal y={16} duration={0.7}>
              <Eyebrow index={index}>Zone d’intervention</Eyebrow>
            </Reveal>
            <RevealText
              text="Nous intervenons dans plusieurs villes du Maroc"
              className="mt-6 max-w-xl text-[clamp(1.8rem,4.2vw,3.1rem)] leading-[1.08] text-ink-900"
            />

            <Reveal y={22} delay={0.1}>
              <p className="mt-6 max-w-lg text-[0.96rem] leading-relaxed text-ink-500">
                Choisissez votre ville sur la carte : elle est reportée automatiquement dans votre demande de devis.
                Pour une autre localité, précisez-la dans le formulaire — nous confirmons la prise en charge au cas par
                cas.
              </p>
            </Reveal>

            {/* Ville sélectionnée */}
            <Reveal y={22} delay={0.14}>
              <div className="mt-9 overflow-hidden rounded-[1.5rem] border border-ink-900/10 bg-white/80 backdrop-blur-md">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-wrap items-center justify-between gap-4 p-5"
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="flex size-11 items-center justify-center rounded-2xl border border-ink-900/10 bg-alu-100 text-accent-700">
                        <MapPin className="size-5" strokeWidth={1.6} />
                      </span>
                      <div>
                        <p className="font-display text-[1.05rem] tracking-tight text-ink-900">
                          {selected ? selected.name : active.name}
                        </p>
                        <p className="text-[0.78rem] text-ink-500">
                          {selected ? selected.region : `${active.region} · sélectionnez pour confirmer`}
                        </p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        'flex items-center gap-2 rounded-full border px-3.5 py-2 text-[0.72rem]',
                        selected
                          ? 'border-accent-500/40 bg-accent-400/10 text-accent-700'
                          : 'border-ink-900/10 text-ink-500',
                      )}
                    >
                      {selected ? <Check className="size-3.5" /> : <Timer className="size-3.5" />}
                      {selected ? 'Ajoutée à votre devis' : 'Zone à confirmer'}
                    </span>
                  </motion.div>
                </AnimatePresence>

                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-ink-900/8 bg-alu-100/70 px-5 py-4">
                  <p className="text-[0.78rem] text-ink-500">
                    {hours ? `Disponibilité : ${hours}` : 'Délais et disponibilité précisés lors du premier échange.'}
                  </p>
                  <LinkButton
                    href="#contact"
                    size="sm"
                    variant="primary"
                    iconRight={<ArrowUpRight className="size-3.5" />}
                  >
                    Demander un devis
                  </LinkButton>
                </div>
              </div>
            </Reveal>

            {!allCitiesVerified && (
              <Reveal y={18} delay={0.22}>
                <p className="mt-7 flex items-start gap-3 rounded-2xl border border-accent-400/30 bg-accent-300/10 p-4 text-[0.78rem] leading-relaxed text-accent-600">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                  <span>
                    <strong className="font-medium">Zone à confirmer.</strong> {serviceAreaNotice} Les villes listées
                    sont indicatives tant qu’elles n’ont pas été validées par l’entreprise
                    (<code className="rounded bg-white/60 px-1 py-0.5 text-[0.72rem]">src/data/cities.ts</code>).
                  </span>
                </p>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
