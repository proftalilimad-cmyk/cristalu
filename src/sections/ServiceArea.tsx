import { useState } from 'react'
import { AlertTriangle, ArrowUpRight, MapPin, Navigation } from 'lucide-react'
import { allCitiesVerified, cities, moroccoPath, serviceAreaNotice } from '@/data/cities'
import { useCity } from '@/lib/cityStore'
import { cn } from '@/lib/utils'
import { LinkButton } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/SectionHeading'
import { Reveal, RevealText } from '@/components/ui/Reveal'

export function ServiceArea() {
  const [hovered, setHovered] = useState<string | null>(null)
  const [selected, setSelected] = useCity()

  const activeId = hovered ?? selected ?? 'tanger'
  const active = cities.find((c) => c.id === activeId) ?? cities[0]

  return (
    <section id="zone" className="relative overflow-hidden bg-alu-100 py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-blueprint opacity-60" aria-hidden />
      <div className="container-x relative">
        <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-16">
          <div>
            <Reveal y={16} duration={0.7}>
              <Eyebrow index="10">Zone d’intervention</Eyebrow>
            </Reveal>
            <RevealText
              text="Nous intervenons dans plusieurs villes du Maroc"
              className="mt-6 max-w-xl text-[clamp(1.8rem,4.2vw,3.1rem)] leading-[1.08] text-ink-900"
            />
            <Reveal y={22} delay={0.1}>
              <p className="mt-6 max-w-lg text-[0.96rem] leading-relaxed text-ink-500">
                Sélectionnez votre ville : elle sera reportée automatiquement dans votre demande de devis. Pour toute
                autre localité, indiquez-la dans le formulaire — nous vous confirmerons la prise en charge.
              </p>
            </Reveal>

            <Reveal y={22} delay={0.16} className="mt-8 grid gap-2 sm:grid-cols-2">
              {cities.map((city) => {
                const isSelected = city.id === selected
                return (
                  <button
                    key={city.id}
                    type="button"
                    onMouseEnter={() => setHovered(city.id)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(city.id)}
                    onBlur={() => setHovered(null)}
                    onClick={() => setSelected(city.name)}
                    aria-pressed={isSelected}
                    className={cn(
                      'group flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition-all duration-500',
                      isSelected
                        ? 'border-ink-900/30 bg-white shadow-[0_20px_45px_-40px_rgba(6,8,10,0.8)]'
                        : 'border-ink-900/8 bg-white/60 hover:border-ink-900/25 hover:bg-white',
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <MapPin
                        className={cn(
                          'size-4 transition-colors',
                          isSelected ? 'text-glacier-600' : 'text-ink-400 group-hover:text-glacier-600',
                        )}
                      />
                      <span>
                        <span className="block text-[0.88rem] font-medium text-ink-900">{city.name}</span>
                        <span className="block text-[0.7rem] text-ink-500">{city.region}</span>
                      </span>
                    </span>
                    <span
                      className={cn(
                        'size-2 rounded-full transition-all duration-500',
                        isSelected ? 'bg-glacier-500' : 'bg-ink-900/10 group-hover:bg-glacier-400',
                      )}
                    />
                  </button>
                )
              })}
            </Reveal>

            {!allCitiesVerified && (
              <Reveal y={18} delay={0.2}>
                <p className="mt-7 flex items-start gap-3 rounded-2xl border border-bronze-400/30 bg-bronze-300/10 p-4 text-[0.78rem] leading-relaxed text-bronze-600">
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

          {/* Carte */}
          <Reveal y={30} duration={1.1}>
            <div className="relative overflow-hidden rounded-[2rem] border border-ink-900/8 bg-gradient-to-b from-white via-alu-100 to-alu-200 p-6 shadow-[0_50px_110px_-80px_rgba(6,8,10,0.7)] md:p-9">
              <div className="pointer-events-none absolute inset-0 bg-blueprint opacity-40" aria-hidden />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <p className="text-[0.66rem] uppercase tracking-[0.26em] text-ink-500">Royaume du Maroc</p>
                  <p className="mt-1.5 font-display text-[1.05rem] tracking-tight text-ink-900">
                    {active.name}
                    <span className="ml-2 text-[0.78rem] font-normal text-ink-500">{active.region}</span>
                  </p>
                </div>
                <span className="flex items-center gap-2 rounded-full border border-ink-900/10 bg-white/80 px-3 py-1.5 text-[0.68rem] text-ink-600">
                  <Navigation className="size-3.5 text-glacier-600" />
                  {cities.length} villes
                </span>
              </div>

              <svg viewBox="0 0 100 100" className="relative mt-2 w-full" role="img" aria-label="Carte du Maroc">
                <defs>
                  <linearGradient id="ma-fill" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#e6e9eb" stopOpacity="0.95" />
                    <stop offset="0.55" stopColor="#cfd5d9" stopOpacity="0.9" />
                    <stop offset="1" stopColor="#b6bdc2" stopOpacity="0.85" />
                  </linearGradient>
                  <linearGradient id="ma-line" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#5cb4d2" />
                    <stop offset="0.5" stopColor="#2d6c85" />
                    <stop offset="1" stopColor="#8fd3e8" />
                  </linearGradient>
                  <filter id="ma-glow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="1.4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <path d={moroccoPath} fill="url(#ma-fill)" stroke="url(#ma-line)" strokeWidth="0.45" strokeLinejoin="round" />

                {/* Lignes de liaison vers la ville active */}
                {cities.map((city) => (
                  <line
                    key={`line-${city.id}`}
                    x1={city.x}
                    y1={city.y}
                    x2={active.x}
                    y2={active.y}
                    stroke="#5cb4d2"
                    strokeOpacity={city.id === activeId ? 0 : 0.18}
                    strokeWidth="0.22"
                    strokeDasharray="1 2"
                  />
                ))}

                {cities.map((city) => {
                  const isActive = city.id === activeId
                  const isSelected = city.name === selected
                  return (
                    <g
                      key={city.id}
                      transform={`translate(${city.x} ${city.y})`}
                      className="cursor-pointer"
                      onMouseEnter={() => setHovered(city.id)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => setSelected(city.name)}
                    >
                      {isActive && <circle r="4.6" fill="#5cb4d2" fillOpacity="0.18" filter="url(#ma-glow)" />}
                      <circle
                        r={isActive ? 1.9 : 1.35}
                        fill={isActive ? '#2d6c85' : isSelected ? '#5cb4d2' : '#6f777e'}
                        stroke="#ffffff"
                        strokeWidth="0.5"
                      />
                      <text
                        x="3.4"
                        y="1"
                        fontSize="2.5"
                        fontWeight={isActive ? 600 : 400}
                        fill={isActive ? '#0b0d10' : '#545c63'}
                        fillOpacity={isActive ? 1 : 0.75}
                        style={{ letterSpacing: '-0.02em' }}
                      >
                        {city.name}
                      </text>
                    </g>
                  )
                })}
              </svg>

              <div className="relative mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-ink-900/8 pt-5">
                <p className="text-[0.78rem] text-ink-500">
                  Ville sélectionnée : <span className="font-medium text-ink-900">{selected || 'aucune'}</span>
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
        </div>
      </div>
    </section>
  )
}
