import { lazy, useMemo, useState } from 'react'
import {
  Box as BoxIcon,
  Layers,
  Maximize,
  MoveHorizontal,
  RotateCcw,
  Sparkles,
  Sun,
  Wand2,
  ZoomIn,
} from 'lucide-react'
import {
  finishes,
  glassTypes,
  type FinishId,
  type GlassId,
} from '@/data/configurator'
import { useIsTouch, useQualityTier } from '@/hooks'
import { cn } from '@/lib/utils'
import { CanvasHost } from '@/three/CanvasHost'
import { qualityFor } from '@/three/quality'

const ShowroomScene = lazy(() => import('@/three/ShowroomScene').then((m) => ({ default: m.ShowroomScene })))
import type { OrbitControlsHandle, ShowroomProductConfig } from '@/three/ShowroomScene'
import { usePointer } from '@/hooks/usePointer'
import { Button } from '@/components/ui/Button'
import { RangeSlider, SegmentedControl, SwatchButton, Toggle } from '@/components/ui/Controls'
import { Eyebrow } from '@/components/ui/SectionHeading'
import { Reveal, RevealText } from '@/components/ui/Reveal'

type ShowcaseId = 'coulissant' | 'battant' | 'pergola' | 'volet' | 'garde-corps'

const showcases: Array<{
  id: ShowcaseId
  label: string
  variant: ShowroomProductConfig['variant']
  flavor?: ShowroomProductConfig['flavor']
  width: number
  height: number
  panels: number[]
  hint: string
}> = [
  {
    id: 'coulissant',
    label: 'Coulissant',
    variant: 'sliding',
    width: 3,
    height: 2.1,
    panels: [2, 3, 4],
    hint: 'Vantaux coulissants sur rails — les panneaux se chevauchent à l’ouverture.',
  },
  {
    id: 'battant',
    label: 'Battant',
    variant: 'casement',
    width: 2.2,
    height: 2.1,
    panels: [1, 2],
    hint: 'Ouverture à la française : rotation franche et joint périphérique continu.',
  },
  {
    id: 'pergola',
    label: 'Pergola',
    variant: 'rail',
    width: 3.6,
    height: 2.6,
    panels: [1],
    hint: 'Lames orientables : de l’ombre au soleil, sans perdre la lumière.',
  },
  {
    id: 'volet',
    label: 'Volet roulant',
    variant: 'panel',
    flavor: 'slats',
    width: 1.6,
    height: 2.1,
    panels: [1],
    hint: 'Lames isolées qui s’enroulent dans le coffre.',
  },
  {
    id: 'garde-corps',
    label: 'Garde-corps',
    variant: 'panel',
    flavor: 'railing',
    width: 2.6,
    height: 1.1,
    panels: [1],
    hint: 'Verre feuilleté et profil aluminium anodisé.',
  },
]

export function AluminiumExperience() {
  const [showcaseId, setShowcaseId] = useState<ShowcaseId>('coulissant')
  const [finishId, setFinishId] = useState<FinishId>('anthracite')
  const [glassId, setGlassId] = useState<GlassId>('transparent')
  const [reflections, setReflections] = useState(true)
  const [panels, setPanels] = useState(2)
  const [open, setOpen] = useState(22)
  const [explode, setExplode] = useState(false)
  const [explore, setExplore] = useState(false)

  const pointer = usePointer()
  const { tier } = useQualityTier()
  const quality = qualityFor(tier)
  const isTouch = useIsTouch()
  const controls = useMemo(() => ({ current: null as OrbitControlsHandle | null }), [])

  const showcase = showcases.find((s) => s.id === showcaseId) ?? showcases[0]
  const finish = finishes.find((f) => f.id === finishId) ?? finishes[0]
  const glass = glassTypes.find((g) => g.id === glassId) ?? glassTypes[0]

  const config: ShowroomProductConfig = useMemo(
    () => ({
      variant: showcase.variant,
      flavor: showcase.flavor,
      width: showcase.width,
      height: showcase.height,
      panels: showcase.panels.includes(panels) ? panels : showcase.panels[0],
      finish,
      glass,
      reflections,
      open: showcase.variant === 'panel' && showcase.flavor === 'railing' ? Math.min(1, open / 100) : open / 100,
      explode: explode ? 1 : 0,
    }),
    [showcase, panels, finish, glass, reflections, open, explode],
  )

  const interactive = !isTouch || explore

  return (
    <section id="experience-3d" className="relative overflow-hidden bg-ink-950 py-24 text-alu-100 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-zellige opacity-[0.14]" aria-hidden />
      <div className="pointer-events-none absolute -left-40 top-1/4 size-[36rem] rounded-full bg-accent-500/10 blur-[140px]" aria-hidden />
      <div className="pointer-events-none absolute -right-32 bottom-0 size-[30rem] rounded-full bg-accent-500/10 blur-[130px]" aria-hidden />

      <div className="container-x relative">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal y={16} duration={0.7}>
              <Eyebrow index="03" tone="dark">
                Expérience 3D · Menuiserie interactive
              </Eyebrow>
            </Reveal>
            <RevealText
              text="L’aluminium en mouvement"
              className="mt-6 max-w-2xl text-[clamp(2rem,4.6vw,3.6rem)] leading-[1.04]"
            />
          </div>
          <Reveal y={20} delay={0.1}>
            <p className="max-w-md text-[0.95rem] leading-relaxed text-alu-400">
              Tournez, ouvrez, changez la teinte et le vitrage : cette maquette 3D reprend la géométrie réelle de nos
              fabrications — dormant, vantaux, parcloses, galets et joints.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px]">
          {/* Scène */}
          <Reveal y={30} duration={1.1} className="relative">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-b from-ink-850 via-ink-900 to-ink-950">
              <div className="pointer-events-none absolute inset-0 bg-hatch opacity-40" aria-hidden />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" aria-hidden />

              <CanvasHost
                className="h-[52svh] min-h-[380px] w-full sm:h-[58svh] md:h-[62svh] lg:h-[70svh]"
                interactive={interactive}
                quality={quality}
                camera={{ position: [0.6, 0.35, 5.6], fov: 32 }}
                loadingLabel="Chargement de la maquette"
              >
                <ShowroomScene
                  cfg={config}
                  quality={quality}
                  pointer={pointer}
                  controlsRef={controls}
                  interactive={interactive}
                />
              </CanvasHost>

              {/* Repères techniques */}
              <div className="pointer-events-none absolute left-4 top-4 flex flex-wrap gap-2 md:left-6 md:top-6">
                <span className="glass-pane rounded-full px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.18em] text-alu-200">
                  {showcase.label}
                </span>
                <span className="glass-pane rounded-full px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.18em] text-alu-200">
                  {finish.label}
                </span>
                <span className="glass-pane rounded-full px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.18em] text-alu-200">
                  {glass.label}
                </span>
              </div>

              <div className="pointer-events-auto absolute right-4 top-4 flex flex-col gap-2 md:right-6 md:top-6">
                <button
                  type="button"
                  onClick={() => controls.current?.reset()}
                  className="glass-pane flex size-10 items-center justify-center rounded-full text-alu-100 transition-transform duration-500 hover:scale-105"
                  aria-label="Réinitialiser la vue 3D"
                  title="Réinitialiser la vue"
                >
                  <RotateCcw className="size-4" />
                </button>
                <span className="glass-pane flex size-10 items-center justify-center rounded-full text-alu-300/80" aria-hidden>
                  <ZoomIn className="size-4" />
                </span>
              </div>

              {/* Invite d'exploration (desktop) */}
              {!isTouch && (
                <div className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2">
                  <span className="glass-pane flex items-center gap-2 rounded-full px-4 py-2 text-[0.7rem] text-alu-300">
                    <MoveHorizontal className="size-3.5 text-accent-400" />
                    Glissez pour tourner · molette pour zoomer
                  </span>
                </div>
              )}

              {/* Mode exploration tactile dédié */}
              {isTouch && !explore && (
                <button
                  type="button"
                  onClick={() => setExplore(true)}
                  className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-ink-950/35 backdrop-blur-[2px] transition-colors hover:bg-ink-950/25"
                >
                  <span className="glass-pane flex items-center gap-2.5 rounded-full px-5 py-3 text-[0.82rem] font-medium text-alu-100">
                    <BoxIcon className="size-4 text-accent-400" />
                    Toucher pour explorer en 3D
                  </span>
                  <span className="text-[0.68rem] uppercase tracking-[0.24em] text-alu-400/80">
                    faites pivoter avec le doigt
                  </span>
                </button>
              )}
              {isTouch && explore && (
                <button
                  type="button"
                  onClick={() => setExplore(false)}
                  className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 rounded-full border border-white/20 bg-ink-950/70 px-4 py-2 text-[0.72rem] text-alu-200 backdrop-blur-md"
                >
                  Terminer l’exploration
                </button>
              )}
            </div>

            <p className="mt-4 flex items-start gap-2 text-[0.78rem] leading-relaxed text-alu-400/80">
              <Sparkles className="mt-0.5 size-3.5 shrink-0 text-accent-400" />
              {showcase.hint}
            </p>
          </Reveal>

          {/* Panneau de configuration */}
          <Reveal y={26} delay={0.08} className="flex flex-col gap-5">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl">
              <p className="mb-3 text-[0.68rem] uppercase tracking-[0.24em] text-alu-400/80">Produit</p>
              <SegmentedControl
                name="showcase"
                size="sm"
                options={showcases.map((s) => ({ value: s.id, label: s.label }))}
                value={showcaseId}
                onChange={(v) => {
                  setShowcaseId(v)
                  const target = showcases.find((s) => s.id === v)
                  if (target) setPanels(target.panels[0])
                  setOpen(v === 'coulissant' ? 22 : 0)
                }}
              />
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl">
              <p className="mb-3 flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.24em] text-alu-400/80">
                <Layers className="size-3.5" /> Finition aluminium
              </p>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                {finishes.map((f) => (
                  <SwatchButton
                    key={f.id}
                    color={f.swatch}
                    label={f.label}
                    note={f.note}
                    active={f.id === finishId}
                    onClick={() => setFinishId(f.id)}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl">
              <p className="mb-3 flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.24em] text-alu-400/80">
                <Sun className="size-3.5" /> Type de vitrage
              </p>
              <div className="grid grid-cols-2 gap-2">
                {glassTypes.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setGlassId(g.id)}
                    aria-pressed={g.id === glassId}
                    className={cn(
                      'group flex flex-col gap-2 rounded-2xl border p-3 text-left transition-all duration-500',
                      g.id === glassId
                        ? 'border-accent-400/50 bg-white/10'
                        : 'border-white/8 hover:border-white/20 hover:bg-white/5',
                    )}
                  >
                    <span
                      className="h-8 w-full rounded-lg ring-1 ring-inset ring-white/20 transition-transform duration-500 group-hover:scale-[1.02]"
                      style={{
                        background: `linear-gradient(120deg, ${g.tint} 0%, rgba(255,255,255,0.5) 45%, ${g.tint} 100%)`,
                        opacity: g.id === 'fume' ? 0.75 : g.id === 'reflechissant' ? 0.95 : 0.6,
                      }}
                    />
                    <span className="text-[0.78rem] font-medium text-alu-100">{g.label}</span>
                    <span className="text-[0.66rem] leading-snug text-alu-400/70">{g.note}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl">
              <RangeSlider
                label={showcase.variant === 'rail' ? 'Orientation des lames' : 'Ouverture'}
                value={open}
                onChange={setOpen}
              />

              {showcase.panels.length > 1 && (
                <div>
                  <p className="mb-2.5 text-[0.7rem] uppercase tracking-[0.22em] text-alu-400/80">Nombre de vantaux</p>
                  <SegmentedControl
                    name="panels"
                    size="sm"
                    options={showcase.panels.map((p) => ({ value: p, label: `${p} vantaux` }))}
                    value={config.panels}
                    onChange={setPanels}
                  />
                </div>
              )}

              <Toggle
                label="Reflets & réflexions"
                description="Vitrage réfléchissant et environnement studio"
                icon={<Sparkles className="size-4" />}
                checked={reflections}
                onChange={setReflections}
              />
              <Toggle
                label="Vue éclatée"
                description="Voir la composition interne (dormant, vantaux, vitrage)"
                icon={<Wand2 className="size-4" />}
                checked={explode}
                onChange={setExplode}
              />

              <div className="flex items-center justify-between gap-3 pt-1">
                <span className="flex items-center gap-2 text-[0.72rem] text-alu-400/75">
                  <Maximize className="size-3.5" />
                  {showcase.width.toFixed(2)} × {showcase.height.toFixed(2)} m
                </span>
                <Button
                  variant="glass"
                  size="sm"
                  className="text-alu-100"
                  onClick={() => {
                    setOpen(showcase.variant === 'rail' ? 100 : 85)
                  }}
                >
                  Ouvrir en grand
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
