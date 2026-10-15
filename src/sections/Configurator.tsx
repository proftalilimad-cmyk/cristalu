import { lazy, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  ClipboardList,
  Copy,
  Loader2,
  Ruler,
  Send,
  Sparkles,
} from 'lucide-react'
import {
  configuratorProducts,
  finishes,
  glassTypes,
  installationOptions,
  projectCities,
  type FinishId,
  type GlassId,
} from '@/data/configurator'
import { submitQuote, type SubmitOutcome } from '@/lib/quote'
import { cn } from '@/lib/utils'
import { useIsMobile, useIsTouch, useQualityTier } from '@/hooks'
import { CanvasHost } from '@/three/CanvasHost'
import { qualityFor } from '@/three/quality'

const ShowroomScene = lazy(() => import('@/three/ShowroomScene').then((m) => ({ default: m.ShowroomScene })))
import type { OrbitControlsHandle, ShowroomProductConfig } from '@/three/ShowroomScene'
import { usePointer } from '@/hooks/usePointer'
import { Button } from '@/components/ui/Button'
import { RangeSlider, SegmentedControl, SwatchButton } from '@/components/ui/Controls'
import { Eyebrow } from '@/components/ui/SectionHeading'
import { Reveal, RevealText } from '@/components/ui/Reveal'

type Selections = {
  productId: string
  material: 'aluminium' | 'pvc'
  width: number
  height: number
  finishId: FinishId
  glassId: GlassId
  panels: number
  city: string
  installation: string
}

const steps = [
  'Type de produit',
  'Aluminium ou PVC',
  'Dimensions',
  'Couleur',
  'Vitrage',
  'Vantaux',
  'Ville',
  'Installation',
]

/** Convertit les dimensions saisies en proportions de maquette plausibles. */
function previewDimensions(productId: string, widthCm: number, heightCm: number) {
  const w = Math.max(1.1, widthCm / 100)
  const h = Math.max(1, heightCm / 100)
  switch (productId) {
    case 'pergola':
      return { width: Math.min(5, Math.max(2.6, w * 1.15)), height: 2.5 }
    case 'garde-corps':
      return { width: w, height: 1.1 }
    case 'volet-roulant':
      return { width: w, height: h }
    case 'miroiterie':
      return { width: Math.min(2.4, w * 0.6), height: h * 0.7 }
    case 'porte-entree':
      return { width: Math.min(1.6, w * 0.55), height: h }
    default:
      return { width: w, height: h }
  }
}

const initial: Selections = {
  productId: 'fenetre-coulissante',
  material: 'aluminium',
  width: 180,
  height: 140,
  finishId: 'anthracite',
  glassId: 'double',
  panels: 2,
  city: '',
  installation: installationOptions[0],
}

export function Configurator() {
  const [step, setStep] = useState(0)
  const [sel, setSel] = useState<Selections>(initial)
  const [contact, setContact] = useState({ name: '', phone: '', email: '', message: '' })
  const [sending, setSending] = useState(false)
  const [outcome, setOutcome] = useState<SubmitOutcome | null>(null)
  const [copied, setCopied] = useState(false)

  const pointer = usePointer()
  const { tier } = useQualityTier()
  const quality = qualityFor(tier)
  const isMobile = useIsMobile()
  const isTouch = useIsTouch()
  const controls = useMemo(() => ({ current: null as OrbitControlsHandle | null }), [])

  const product = configuratorProducts.find((p) => p.id === sel.productId) ?? configuratorProducts[0]
  const finish = finishes.find((f) => f.id === sel.finishId) ?? finishes[0]
  const glass = glassTypes.find((g) => g.id === sel.glassId) ?? glassTypes[0]

  const previewConfig: ShowroomProductConfig = useMemo(
    () => ({
      variant: product.preview,
      flavor:
        product.id === 'garde-corps'
          ? 'railing'
          : product.id === 'volet-roulant'
            ? 'slats'
            : product.id === 'miroiterie'
              ? 'mirror'
              : undefined,
      // Proportions crédibles par typologie (une pergola n'a pas la hauteur d'une fenêtre)
      ...previewDimensions(product.id, sel.width, sel.height),
      panels: product.panels.includes(Number(sel.panels)) ? Number(sel.panels) : product.panels[0],
      finish,
      glass,
      reflections: true,
      open: product.preview === 'rail' ? 0.45 : 0.18,
      explode: 0,
    }),
    [product, sel.width, sel.height, sel.panels, finish, glass],
  )

  const summaryRows: Array<[string, string]> = [
    ['Type de produit', product.label],
    ['Matériau', sel.material === 'aluminium' ? 'Aluminium' : 'PVC'],
    ['Dimensions', `${sel.width} × ${sel.height} cm`],
    ['Couleur', finish.label],
    ['Vitrage', glass.label],
    ['Vantaux', String(previewConfig.panels)],
    ['Ville', sel.city || '—'],
    ['Installation', sel.installation],
  ]

  const canSend = contact.name.trim().length > 1 && contact.phone.trim().length > 6 && sel.city.length > 0

  const handleSend = async () => {
    setSending(true)
    const result = await submitQuote({
      source: 'configurateur',
      product: product.label,
      material: sel.material === 'aluminium' ? 'Aluminium' : 'PVC',
      width: sel.width,
      height: sel.height,
      finish: finish.label,
      glass: glass.label,
      panels: previewConfig.panels,
      city: sel.city,
      installation: sel.installation,
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      message: contact.message,
    })
    setSending(false)
    setOutcome(result)
    if (result.href) window.open(result.href, '_blank', 'noopener,noreferrer')
  }

  const go = (dir: 1 | -1) => setStep((s) => Math.max(0, Math.min(steps.length - 1, s + dir)))

  return (
    <section id="configurateur" className="relative overflow-hidden bg-ink-950 py-24 text-alu-100 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-zellige opacity-[0.12]" aria-hidden />
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-accent-500/10 blur-[130px]" aria-hidden />

      <div className="container-x relative">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal y={16} duration={0.7}>
              <Eyebrow index="06" tone="dark">
                Configurateur
              </Eyebrow>
            </Reveal>
            <RevealText
              text="Imaginez votre projet"
              className="mt-6 max-w-2xl text-[clamp(2rem,4.6vw,3.5rem)] leading-[1.05]"
            />
          </div>
          <Reveal y={18} delay={0.08}>
            <p className="max-w-md text-[0.95rem] leading-relaxed text-alu-400">
              Huit choix, une prévisualisation 3D immédiate, puis l’envoi de votre demande structurée à notre équipe.
              Aucun prix automatique : chaque projet est chiffré sur mesure.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.05fr_1fr] xl:grid-cols-[1.15fr_1fr]">
          {/* Colonne de configuration */}
          <Reveal y={28} duration={1} className="order-2 lg:order-1">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl md:p-7">
              {/* Progression */}
              <div className="flex items-center justify-between gap-4">
                <p className="font-display text-[0.78rem] tracking-[0.2em] text-alu-400">
                  Étape {String(step + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}
                </p>
                <p className="text-[0.78rem] text-alu-300">{steps[step]}</p>
              </div>
              <div className="mt-3.5 h-1 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-accent-500 via-accent-300 to-accent-400"
                  animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
                  transition={{ type: 'spring', stiffness: 180, damping: 26 }}
                />
              </div>

              <div className="mt-7 min-h-[15rem]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {step === 0 && (
                      <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
                        {configuratorProducts.map((p) => {
                          const Icon = p.icon
                          const active = p.id === sel.productId
                          return (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() =>
                                setSel((s) => ({
                                  ...s,
                                  productId: p.id,
                                  material: p.materials.includes(s.material) ? s.material : p.materials[0],
                                  panels: p.panels.includes(s.panels) ? s.panels : p.panels[0],
                                }))
                              }
                              className={cn(
                                'group flex flex-col gap-2.5 rounded-2xl border p-4 text-left transition-all duration-500',
                                active
                                  ? 'border-accent-400/60 bg-white/10'
                                  : 'border-white/8 hover:border-white/22 hover:bg-white/5',
                              )}
                            >
                              <Icon
                                className={cn(
                                  'size-5 transition-colors',
                                  active ? 'text-accent-300' : 'text-alu-400 group-hover:text-alu-200',
                                )}
                                strokeWidth={1.6}
                              />
                              <span className="text-[0.84rem] font-medium text-alu-100">{p.label}</span>
                              <span className="text-[0.7rem] leading-snug text-alu-400/75">{p.description}</span>
                            </button>
                          )
                        })}
                      </div>
                    )}

                    {step === 1 && (
                      <div className="grid gap-3 sm:grid-cols-2">
                        {(['aluminium', 'pvc'] as const).map((m) => {
                          const allowed = product.materials.includes(m)
                          const active = sel.material === m
                          return (
                            <button
                              key={m}
                              type="button"
                              disabled={!allowed}
                              onClick={() => setSel((s) => ({ ...s, material: m }))}
                              className={cn(
                                'rounded-2xl border p-5 text-left transition-all duration-500',
                                active ? 'border-accent-400/60 bg-white/10' : 'border-white/8 hover:border-white/20',
                                !allowed && 'cursor-not-allowed opacity-35 hover:border-white/8',
                              )}
                            >
                              <p className="font-display text-[1.05rem] tracking-tight text-alu-100">
                                {m === 'aluminium' ? 'Aluminium' : 'PVC'}
                              </p>
                              <p className="mt-2 text-[0.78rem] leading-relaxed text-alu-400/80">
                                {m === 'aluminium'
                                  ? 'Finesse des profilés, grandes dimensions, durabilité et finitions thermolaquées ou anodisées.'
                                  : 'Excellent rapport isolation/prix, entretien minimal, idéal en rénovation résidentielle.'}
                              </p>
                              {!allowed && (
                                <p className="mt-2 text-[0.7rem] text-accent-300">
                                  Non proposé pour ce type de produit
                                </p>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    )}

                    {step === 2 && (
                      <div className="grid gap-7">
                        <RangeSlider
                          label="Largeur approximative"
                          value={sel.width}
                          onChange={(v) => setSel((s) => ({ ...s, width: v }))}
                          min={40}
                          max={600}
                          step={5}
                          suffix=" cm"
                        />
                        <RangeSlider
                          label="Hauteur approximative"
                          value={sel.height}
                          onChange={(v) => setSel((s) => ({ ...s, height: v }))}
                          min={40}
                          max={350}
                          step={5}
                          suffix=" cm"
                        />
                        <p className="flex items-start gap-2.5 text-[0.78rem] leading-relaxed text-alu-400/80">
                          <Ruler className="mt-0.5 size-3.5 shrink-0 text-accent-400" />
                          Indiquez des dimensions approximatives : nos équipes réalisent la prise de mesures définitive
                          sur site.
                        </p>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="grid gap-2 sm:grid-cols-2">
                        {finishes.map((f) => (
                          <SwatchButton
                            key={f.id}
                            color={f.swatch}
                            label={f.label}
                            note={f.note}
                            active={f.id === sel.finishId}
                            onClick={() => setSel((s) => ({ ...s, finishId: f.id }))}
                          />
                        ))}
                      </div>
                    )}

                    {step === 4 && (
                      <div className="grid gap-2 sm:grid-cols-2">
                        {glassTypes.map((g) => (
                          <button
                            key={g.id}
                            type="button"
                            onClick={() => setSel((s) => ({ ...s, glassId: g.id }))}
                            className={cn(
                              'flex items-center gap-3 rounded-2xl border p-3 text-left transition-all duration-500',
                              g.id === sel.glassId
                                ? 'border-accent-400/60 bg-white/10'
                                : 'border-white/8 hover:border-white/20',
                            )}
                          >
                            <span
                              className="size-10 shrink-0 rounded-xl ring-1 ring-inset ring-white/20"
                              style={{
                                background: `linear-gradient(130deg, ${g.tint} 0%, rgba(255,255,255,0.55) 50%, ${g.tint} 100%)`,
                              }}
                            />
                            <span>
                              <span className="block text-[0.84rem] font-medium text-alu-100">{g.label}</span>
                              <span className="block text-[0.7rem] text-alu-400/75">{g.note}</span>
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    {step === 5 && (
                      <div>
                        <p className="mb-4 text-[0.8rem] leading-relaxed text-alu-400/85">
                          Le nombre de vantaux dépend du type de produit sélectionné.
                        </p>
                        <SegmentedControl
                          name="cfg-panels"
                          options={product.panels.map((p) => ({ value: p, label: `${p} vantail${p > 1 ? 'x' : ''}` }))}
                          value={previewConfig.panels}
                          onChange={(v) => setSel((s) => ({ ...s, panels: Number(v) }))}
                        />
                      </div>
                    )}

                    {step === 6 && (
                      <div>
                        <p className="mb-4 text-[0.8rem] leading-relaxed text-alu-400/85">
                          Où se situe votre projet ? La zone d’intervention est confirmée avec vous lors du premier
                          échange.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {projectCities.map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => setSel((s) => ({ ...s, city: c }))}
                              className={cn(
                                'rounded-full border px-4 py-2 text-[0.8rem] transition-all duration-500',
                                sel.city === c
                                  ? 'border-accent-400/60 bg-white/10 text-alu-100'
                                  : 'border-white/10 text-alu-400 hover:border-white/25 hover:text-alu-200',
                              )}
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {step === 7 && (
                      <div className="grid gap-2">
                        {installationOptions.map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setSel((s) => ({ ...s, installation: opt }))}
                            className={cn(
                              'flex items-center justify-between gap-4 rounded-2xl border px-4 py-3.5 text-left text-[0.84rem] transition-all duration-500',
                              sel.installation === opt
                                ? 'border-accent-400/60 bg-white/10 text-alu-100'
                                : 'border-white/8 text-alu-300 hover:border-white/20',
                            )}
                          >
                            {opt}
                            {sel.installation === opt && <Check className="size-4 shrink-0 text-accent-300" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation */}
              <div className="mt-7 flex items-center justify-between gap-3 border-t border-white/10 pt-6">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-alu-400 hover:text-alu-100"
                  onClick={() => go(-1)}
                  disabled={step === 0}
                  icon={<ArrowLeft className="size-3.5" />}
                >
                  Précédent
                </Button>
                {step < steps.length - 1 ? (
                  <Button
                    variant="glass"
                    size="sm"
                    className="text-alu-100"
                    onClick={() => go(1)}
                    iconRight={<ArrowRight className="size-3.5" />}
                  >
                    Suivant
                  </Button>
                ) : (
                  <span className="text-[0.75rem] text-accent-300">Complétez ci-dessous pour recevoir votre devis</span>
                )}
              </div>
            </div>

            {/* Récapitulatif + envoi */}
            <div className="mt-6 rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl md:p-7">
              {!outcome ? (
                <>
                  <div className="flex items-center gap-3">
                    <ClipboardList className="size-4.5 text-accent-400" />
                    <p className="font-display text-[1rem] tracking-tight text-alu-100">Recevoir mon devis personnalisé</p>
                  </div>

                  <dl className="mt-5 grid gap-2.5 sm:grid-cols-2">
                    {summaryRows.map(([k, v]) => (
                      <div key={k} className="flex items-baseline justify-between gap-3 border-b border-white/8 pb-2">
                        <dt className="text-[0.72rem] uppercase tracking-[0.16em] text-alu-400/75">{k}</dt>
                        <dd className="text-right text-[0.82rem] text-alu-100">{v}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <Field
                      label="Nom *"
                      value={contact.name}
                      onChange={(v) => setContact((c) => ({ ...c, name: v }))}
                      placeholder="Votre nom"
                      autoComplete="name"
                    />
                    <Field
                      label="Téléphone *"
                      value={contact.phone}
                      onChange={(v) => setContact((c) => ({ ...c, phone: v }))}
                      placeholder="+212 …"
                      type="tel"
                      autoComplete="tel"
                    />
                    <Field
                      label="E-mail"
                      value={contact.email}
                      onChange={(v) => setContact((c) => ({ ...c, email: v }))}
                      placeholder="vous@exemple.com"
                      type="email"
                      autoComplete="email"
                    />
                    <Field
                      label="Message"
                      value={contact.message}
                      onChange={(v) => setContact((c) => ({ ...c, message: v }))}
                      placeholder="Précisions, contraintes…"
                    />
                  </div>

                  {!canSend && (
                    <p className="mt-4 text-[0.74rem] text-accent-300/90">
                      Renseignez votre nom, votre téléphone et votre ville pour envoyer la demande.
                    </p>
                  )}

                  <Button
                    variant="primary"
                    size="lg"
                    full
                    className="mt-5 bg-alu-100 text-ink-900 hover:bg-white"
                    onClick={handleSend}
                    disabled={!canSend || sending}
                    icon={sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                  >
                    {sending ? 'Envoi en cours…' : 'Recevoir mon devis personnalisé'}
                  </Button>
                  <p className="mt-3.5 flex items-start gap-2 text-[0.72rem] leading-relaxed text-alu-400/70">
                    <Sparkles className="mt-0.5 size-3.5 shrink-0 text-accent-400" />
                    Aucun prix n’est affiché automatiquement : votre demande est transmise à notre équipe, qui revient
                    vers vous avec une proposition adaptée.
                  </p>
                </>
              ) : (
                <div className="py-2">
                  <span className="flex size-12 items-center justify-center rounded-2xl border border-accent-400/40 bg-accent-500/10 text-accent-300">
                    <BadgeCheck className="size-6" />
                  </span>
                  <p className="mt-5 font-display text-[1.15rem] leading-snug tracking-tight text-alu-100">
                    {outcome.message}
                  </p>
                  <p className="mt-3 text-[0.82rem] text-alu-400">
                    Référence de votre demande : <span className="text-accent-300">{outcome.reference}</span>
                  </p>

                  <div className="mt-5 rounded-2xl border border-white/10 bg-ink-900/60 p-4">
                    <p className="text-[0.68rem] uppercase tracking-[0.22em] text-alu-400/75">Récapitulatif</p>
                    <pre className="mt-2.5 max-h-56 overflow-auto whitespace-pre-wrap font-sans text-[0.78rem] leading-relaxed text-alu-300">
                      {summaryRows.map(([k, v]) => `• ${k} : ${v}`).join('\n')}
                      {contact.name ? `\n• Nom : ${contact.name}` : ''}
                      {contact.phone ? `\n• Téléphone : ${contact.phone}` : ''}
                      {contact.email ? `\n• E-mail : ${contact.email}` : ''}
                    </pre>
                    <div className="mt-3.5 flex flex-wrap gap-2">
                      <Button
                        variant="glass"
                        size="sm"
                        className="text-alu-100"
                        icon={copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                        onClick={() => {
                          const text = summaryRows.map(([k, v]) => `${k} : ${v}`).join('\n')
                          void navigator.clipboard?.writeText(`${text}\nRéf. ${outcome.reference}`)
                          setCopied(true)
                          setTimeout(() => setCopied(false), 2200)
                        }}
                      >
                        {copied ? 'Copié' : 'Copier le récapitulatif'}
                      </Button>
                      {outcome.href && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-alu-300 hover:text-alu-100"
                          onClick={() => window.open(outcome.href, '_blank', 'noopener,noreferrer')}
                        >
                          Rouvrir l’envoi
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-alu-400 hover:text-alu-100"
                        onClick={() => {
                          setOutcome(null)
                          setStep(0)
                        }}
                      >
                        Nouvelle configuration
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Reveal>

          {/* Aperçu 3D */}
          <Reveal y={28} delay={0.08} className="order-1 lg:order-2">
            <div className="lg:sticky lg:top-28">
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-b from-ink-850 to-ink-950">
                <div className="pointer-events-none absolute inset-0 bg-hatch opacity-35" aria-hidden />
                <CanvasHost
                  className={cn('w-full', isMobile ? 'h-[36svh] min-h-[260px]' : 'h-[46svh] min-h-[360px]')}
                  interactive={!isTouch}
                  quality={quality}
                  camera={{ position: [0.5, 0.3, 5.2], fov: 32 }}
                  loadingLabel="Aperçu 3D"
                >
                  <ShowroomScene
                    cfg={previewConfig}
                    quality={quality}
                    pointer={pointer}
                    controlsRef={controls}
                    interactive={!isTouch}
                  />
                </CanvasHost>

                <div className="pointer-events-none absolute left-4 top-4 flex flex-wrap gap-2">
                  <span className="glass-pane rounded-full px-3 py-1.5 text-[0.66rem] uppercase tracking-[0.18em] text-alu-200">
                    Aperçu 3D
                  </span>
                  <span className="glass-pane rounded-full px-3 py-1.5 text-[0.66rem] uppercase tracking-[0.18em] text-alu-200">
                    {sel.width} × {sel.height} cm
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => controls.current?.reset()}
                  className="glass-pane absolute right-4 top-4 flex size-10 items-center justify-center rounded-full text-alu-100 transition-transform duration-500 hover:scale-105"
                  aria-label="Réinitialiser la vue 3D"
                >
                  <ArrowLeft className="size-4 rotate-45" />
                </button>
              </div>

              <ul className="mt-4 grid gap-2 text-[0.76rem] text-alu-400/80 sm:grid-cols-2">
                <li className="rounded-xl border border-white/8 px-3 py-2">{product.label}</li>
                <li className="rounded-xl border border-white/8 px-3 py-2">
                  {sel.material === 'aluminium' ? 'Aluminium' : 'PVC'} · {finish.label}
                </li>
                <li className="rounded-xl border border-white/8 px-3 py-2">{glass.label}</li>
                <li className="rounded-xl border border-white/8 px-3 py-2">
                  {previewConfig.panels} vantail{previewConfig.panels > 1 ? 'x' : ''}
                  {sel.city ? ` · ${sel.city}` : ''}
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  autoComplete,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  autoComplete?: string
}) {
  return (
    <label className="group flex flex-col gap-2">
      <span className="text-[0.68rem] uppercase tracking-[0.2em] text-alu-400/80">{label}</span>
      <input
        type={type}
        value={value}
        autoComplete={autoComplete}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-white/12 bg-white/[0.04] px-3.5 py-3 text-[0.86rem] text-alu-100 outline-none transition-colors placeholder:text-alu-500/60 focus:border-accent-400/60 focus:bg-white/[0.07]"
      />
    </label>
  )
}
