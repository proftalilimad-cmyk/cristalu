import { useCallback, useRef, useState } from 'react'
import { MoveHorizontal, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Eyebrow } from '@/components/ui/SectionHeading'
import { Reveal, RevealText } from '@/components/ui/Reveal'
import { SmartImage } from '@/components/ui/SmartImage'

const transformations = [
  {
    id: 'facade',
    label: 'Façade · Rénovation',
    before: { src: 'before' as const, caption: 'Menuiseries anciennes en bois, simple vitrage' },
    after: { src: 'service-baie' as const, caption: 'Baie coulissante aluminium, double vitrage' },
    note: 'Le remplacement des menuiseries transforme la lumière, l’isolation et la valeur du logement.',
  },
  {
    id: 'sejour',
    label: 'Séjour · Ouverture',
    before: { src: 'service-pvc' as const, caption: 'Ouverture étroite, apport de lumière limité' },
    after: { src: 'service-baie' as const, caption: 'Grande baie vitrée sur terrasse' },
    note: 'Élargir l’ouverture relie l’intérieur au jardin et multiplie la lumière naturelle.',
  },
]

export function BeforeAfter() {
  const [activeId, setActiveId] = useState(transformations[0].id)
  const [pos, setPos] = useState(48)
  const [dragging, setDragging] = useState(false)
  const frameRef = useRef<HTMLDivElement>(null)

  const active = transformations.find((t) => t.id === activeId) ?? transformations[0]

  const setFromClientX = useCallback((clientX: number) => {
    const el = frameRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const next = ((clientX - rect.left) / rect.width) * 100
    setPos(Math.max(2, Math.min(98, next)))
  }, [])

  return (
    <section id="transformation" className="relative overflow-hidden bg-ink-900 py-24 text-alu-100 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-hatch opacity-30" aria-hidden />
      <div className="container-x relative">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16">
          <div>
            <Reveal y={16} duration={0.7}>
              <Eyebrow index="05" tone="dark">
                Avant / Après
              </Eyebrow>
            </Reveal>
            <RevealText
              text="Transformez votre espace"
              className="mt-6 text-[clamp(2rem,4.6vw,3.4rem)] leading-[1.05]"
            />
            <Reveal y={22} delay={0.1}>
              <p className="mt-6 max-w-md text-[0.98rem] leading-relaxed text-alu-300/85">
                Faites glisser la poignée pour comparer. Un changement de menuiserie suffit souvent à transformer la
                lumière, le confort thermique et la perception d’un espace.
              </p>
            </Reveal>

            <Reveal y={20} delay={0.16} className="mt-9 flex flex-wrap gap-2">
              {transformations.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setActiveId(t.id)
                    setPos(48)
                  }}
                  className={cn(
                    'rounded-full border px-4 py-2.5 text-[0.8rem] font-medium transition-all duration-500',
                    t.id === activeId
                      ? 'border-accent-400/50 bg-white/10 text-alu-100'
                      : 'border-white/10 text-alu-400 hover:border-white/25 hover:text-alu-200',
                  )}
                >
                  {t.label}
                </button>
              ))}
            </Reveal>

            <Reveal y={20} delay={0.2}>
              <p className="mt-8 flex items-start gap-2.5 text-[0.82rem] leading-relaxed text-alu-400/80">
                <Sparkles className="mt-0.5 size-3.5 shrink-0 text-accent-400" />
                {active.note}
              </p>
            </Reveal>
          </div>

          {/* Comparateur */}
          <Reveal y={30} duration={1.1}>
            <div
              ref={frameRef}
              className={cn(
                'relative select-none overflow-hidden rounded-[2rem] border border-white/12 bg-ink-850 shadow-[0_60px_120px_-70px_rgba(0,0,0,0.9)]',
                dragging ? 'cursor-grabbing' : 'cursor-grab',
              )}
              onPointerDown={(e) => {
                setDragging(true)
                e.currentTarget.setPointerCapture(e.pointerId)
                setFromClientX(e.clientX)
              }}
              onPointerMove={(e) => {
                if (dragging) setFromClientX(e.clientX)
              }}
              onPointerUp={(e) => {
                setDragging(false)
                e.currentTarget.releasePointerCapture(e.pointerId)
              }}
              onPointerCancel={() => setDragging(false)}
            >
              <div className="relative aspect-[4/3] w-full sm:aspect-[16/10]">
                {/* Après */}
                <div className="absolute inset-0">
                  <SmartImage
                    name={active.after.src}
                    alt={active.after.caption}
                    className="h-full w-full"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                </div>
                {/* Avant */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
                >
                  <SmartImage
                    name={active.before.src}
                    alt={active.before.caption}
                    className="h-full w-full"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-ink-950/25 saturate-[0.75]" />
                </div>

                {/* Étiquettes */}
                <span className="pointer-events-none absolute left-4 top-4 rounded-full border border-white/20 bg-ink-950/60 px-3 py-1.5 text-[0.66rem] uppercase tracking-[0.2em] text-alu-200 backdrop-blur-md">
                  Avant
                </span>
                <span className="pointer-events-none absolute right-4 top-4 rounded-full border border-accent-400/40 bg-ink-950/55 px-3 py-1.5 text-[0.66rem] uppercase tracking-[0.2em] text-accent-300 backdrop-blur-md">
                  Après
                </span>

                {/* Poignée */}
                <div
                  className="pointer-events-none absolute inset-y-0 z-10"
                  style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}
                >
                  <div className="h-full w-px bg-white/85 shadow-[0_0_28px_rgba(226,73,79,0.85)]" />
                  <div className="absolute left-1/2 top-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-ink-950/70 text-alu-100 backdrop-blur-md">
                    <MoveHorizontal className="size-5" />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-5 py-4">
                <p className="text-[0.76rem] text-alu-400/85">{active.before.caption}</p>
                <p className="text-[0.76rem] text-accent-300">{active.after.caption}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
