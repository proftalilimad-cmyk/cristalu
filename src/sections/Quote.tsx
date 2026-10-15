import { useEffect, useRef, useState } from 'react'
import {
  AlertTriangle,
  BadgeCheck,
  Building2,
  Check,
  Copy,
  ImagePlus,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  Sparkles,
  Trash2,
  User,
} from 'lucide-react'
import { configuratorProducts, projectTypes } from '@/data/configurator'
import { hasEmail, hasPhone, hasWhatsApp, mailtoLink, siteConfig, val, whatsappLink } from '@/data/site'
import { cities } from '@/data/cities'
import { cityByName, setCity, useCity } from '@/lib/cityStore'
import { submitQuote, type SubmitOutcome } from '@/lib/quote'
import { cn, formatBytes } from '@/lib/utils'
import { Button, LinkButton } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/SectionHeading'
import { Reveal, RevealText } from '@/components/ui/Reveal'

const cityOptions = [
  'Tanger',
  'Casablanca',
  'Rabat',
  'Marrakech',
  'Agadir',
  'Fès',
  'Meknès',
  'Oujda',
  'Kénitra',
  'Autre ville',
]

type FormState = {
  name: string
  phone: string
  email: string
  city: string
  projectType: string
  material: 'Aluminium' | 'PVC' | 'Aluminium ou PVC (à conseiller)'
  dimensions: string
  message: string
}

export function Quote() {
  const [mapCity] = useCity()
  const [form, setForm] = useState<FormState>({
    name: '',
    phone: '',
    email: '',
    city: mapCity?.name ?? '',
    projectType: configuratorProducts[0].label,
    material: 'Aluminium ou PVC (à conseiller)',
    dimensions: '',
    message: '',
  })
  const [files, setFiles] = useState<File[]>([])
  const [sending, setSending] = useState(false)
  const [outcome, setOutcome] = useState<SubmitOutcome | null>(null)
  const [copied, setCopied] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)

  // La ville sélectionnée sur la carte alimente le formulaire
  useEffect(() => {
    if (mapCity) setForm((f) => (f.city === mapCity.name ? f : { ...f, city: mapCity.name }))
  }, [mapCity])

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const errors: Partial<Record<keyof FormState, string>> = {}
  if (form.name.trim().length < 2) errors.name = 'Indiquez votre nom.'
  if (!/^[+\d][\d\s().-]{6,}$/.test(form.phone.trim())) errors.phone = 'Numéro de téléphone invalide.'
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) errors.email = 'E-mail invalide.'
  if (!form.city) errors.city = 'Sélectionnez votre ville.'
  const valid = Object.keys(errors).length === 0

  const send = async () => {
    if (!valid) return
    setSending(true)
    const result = await submitQuote({
      source: 'formulaire',
      product: form.projectType,
      material: form.material,
      city: form.city,
      name: form.name,
      phone: form.phone,
      email: form.email,
      message: [form.dimensions ? `Dimensions approximatives : ${form.dimensions}` : '', form.message]
        .filter(Boolean)
        .join('\n'),
      files: files.map((f) => ({ name: f.name, size: f.size, type: f.type })),
    })
    setSending(false)
    setOutcome(result)
    if (result.href) window.open(result.href, '_blank', 'noopener,noreferrer')
  }

  const directory = [
    { icon: Phone, label: 'Téléphone', value: val(siteConfig.contact.phone), href: null as string | null },
    { icon: Mail, label: 'E-mail', value: val(siteConfig.contact.email), href: null },
    {
      icon: MapPin,
      label: 'Adresse',
      value: [val(siteConfig.contact.address.street), val(siteConfig.contact.address.city)]
        .filter(Boolean)
        .join(', ') || null,
      href: val(siteConfig.contact.maps),
    },
  ]

  return (
    <section id="contact" className="relative overflow-hidden bg-ink-900 py-24 text-alu-100 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-hatch opacity-25" aria-hidden />
      <div className="pointer-events-none absolute -left-24 top-10 size-[26rem] rounded-full bg-accent-500/10 blur-[120px]" aria-hidden />

      <div className="container-x relative">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          {/* Colonne de présentation + coordonnées */}
          <div>
            <Reveal y={16} duration={0.7}>
              <Eyebrow index="11" tone="dark">
                Contact · Devis
              </Eyebrow>
            </Reveal>
            <RevealText
              text="Demandez votre devis gratuit"
              className="mt-6 text-[clamp(1.9rem,4.4vw,3.2rem)] leading-[1.06]"
            />
            <Reveal y={22} delay={0.1}>
              <p className="mt-6 max-w-md text-[0.96rem] leading-relaxed text-alu-300/85">
                Décrivez votre projet en quelques lignes. Nous revenons vers vous pour préciser les points techniques,
                organiser la prise de mesures et établir une proposition détaillée.
              </p>
            </Reveal>

            <Reveal y={24} delay={0.16} className="mt-9 grid gap-3">
              {directory.map(({ icon: Icon, label, value, href }) => (
                <div
                  key={label}
                  className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4 backdrop-blur-xl"
                >
                  <Icon className="mt-0.5 size-4.5 shrink-0 text-accent-400" strokeWidth={1.6} />
                  <div className="min-w-0">
                    <p className="text-[0.68rem] uppercase tracking-[0.22em] text-alu-400/80">{label}</p>
                    {value ? (
                      href ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 block truncate text-[0.9rem] text-alu-100 underline decoration-accent-400/40 underline-offset-4 transition-colors hover:text-accent-300"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="mt-1 text-[0.9rem] text-alu-100">{value}</p>
                      )
                    ) : (
                      <p className="mt-1 flex items-center gap-2 text-[0.82rem] text-alu-400/80">
                        <AlertTriangle className="size-3.5 text-accent-300" />
                        À renseigner dans{' '}
                        <code className="rounded bg-white/5 px-1 py-0.5 text-[0.72rem]">src/data/site.ts</code>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </Reveal>

            {(hasWhatsApp() || hasPhone() || hasEmail()) && (
              <Reveal y={22} delay={0.2} className="mt-5 flex flex-wrap gap-3">
                {hasWhatsApp() && (
                  <LinkButton
                    href={whatsappLink() ?? '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="md"
                    variant="glass"
                    className="text-alu-100"
                  >
                    WhatsApp
                  </LinkButton>
                )}
                {hasEmail() && (
                  <LinkButton
                    href={mailtoLink('Demande de devis — CRISTALUM', 'Bonjour,') ?? '#'}
                    size="md"
                    variant="ghost"
                    className="text-alu-300 hover:text-alu-100"
                  >
                    Écrire un e-mail
                  </LinkButton>
                )}
              </Reveal>
            )}

            <Reveal y={20} delay={0.24}>
              <p className="mt-7 flex items-start gap-2.5 text-[0.74rem] leading-relaxed text-alu-400/70">
                <Sparkles className="mt-0.5 size-3.5 shrink-0 text-accent-400" />
                Vos informations ne servent qu’au traitement de votre demande. Voir la politique de confidentialité en
                pied de page.
              </p>
            </Reveal>
          </div>

          {/* Formulaire */}
          <Reveal y={28} duration={1.1}>
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl md:p-8">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

              {!outcome ? (
                <form
                  className="grid gap-4"
                  onSubmit={(e) => {
                    e.preventDefault()
                    void send()
                  }}
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      icon={<User className="size-4" />}
                      label="Nom complet *"
                      value={form.name}
                      onChange={(v) => set('name', v)}
                      error={errors.name}
                      autoComplete="name"
                      placeholder="Prénom et nom"
                    />
                    <Field
                      icon={<Phone className="size-4" />}
                      label="Téléphone *"
                      type="tel"
                      value={form.phone}
                      onChange={(v) => set('phone', v)}
                      error={errors.phone}
                      autoComplete="tel"
                      placeholder="+212 …"
                    />
                    <Field
                      icon={<Mail className="size-4" />}
                      label="E-mail"
                      type="email"
                      value={form.email}
                      onChange={(v) => set('email', v)}
                      error={errors.email}
                      autoComplete="email"
                      placeholder="vous@exemple.com"
                    />
                    <label className="flex flex-col gap-2">
                      <span className="flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.2em] text-alu-400/80">
                        <Building2 className="size-3.5" /> Ville *
                      </span>
                      <select
                        value={form.city}
                        onChange={(e) => {
                          set('city', e.target.value)
                          setCity(cityByName(e.target.value, cities))
                        }}
                        className={cn(
                          'rounded-xl border border-white/12 bg-white/[0.04] px-3.5 py-3 text-[0.88rem] text-alu-100 outline-none transition-colors focus:border-accent-400/60 focus:bg-white/[0.07]',
                          !form.city && 'text-alu-500',
                        )}
                      >
                        <option value="">Sélectionnez une ville…</option>
                        {cityOptions.map((c) => (
                          <option key={c} value={c} className="bg-ink-900 text-alu-100">
                            {c}
                          </option>
                        ))}
                      </select>
                      {errors.city && <span className="text-[0.72rem] text-accent-300">{errors.city}</span>}
                    </label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="flex flex-col gap-2">
                      <span className="text-[0.68rem] uppercase tracking-[0.2em] text-alu-400/80">
                        Type de projet
                      </span>
                      <select
                        value={form.projectType}
                        onChange={(e) => set('projectType', e.target.value)}
                        className="rounded-xl border border-white/12 bg-white/[0.04] px-3.5 py-3 text-[0.88rem] text-alu-100 outline-none transition-colors focus:border-accent-400/60 focus:bg-white/[0.07]"
                      >
                        {projectTypes.map((t) => (
                          <option key={t} value={t} className="bg-ink-900 text-alu-100">
                            {t}
                          </option>
                        ))}
                      </select>
                    </label>

                    <div className="flex flex-col gap-2">
                      <span className="text-[0.68rem] uppercase tracking-[0.2em] text-alu-400/80">Matériau</span>
                      <div className="flex flex-wrap gap-2">
                        {(['Aluminium', 'PVC', 'Aluminium ou PVC (à conseiller)'] as const).map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => set('material', m)}
                            className={cn(
                              'rounded-full border px-3.5 py-2 text-[0.76rem] transition-all duration-500',
                              form.material === m
                                ? 'border-accent-400/60 bg-white/10 text-alu-100'
                                : 'border-white/10 text-alu-400 hover:border-white/25 hover:text-alu-200',
                            )}
                          >
                            {m === 'Aluminium ou PVC (à conseiller)' ? 'À conseiller' : m}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Field
                    icon={<MapPin className="size-4" />}
                    label="Dimensions approximatives"
                    value={form.dimensions}
                    onChange={(v) => set('dimensions', v)}
                    placeholder="Ex. baie 320 × 210 cm, 3 fenêtres 120 × 140 cm…"
                  />

                  <label className="flex flex-col gap-2">
                    <span className="flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.2em] text-alu-400/80">
                      <MessageSquare className="size-3.5" /> Message
                    </span>
                    <textarea
                      value={form.message}
                      onChange={(e) => set('message', e.target.value)}
                      rows={4}
                      placeholder="Décrivez votre projet, vos contraintes, votre calendrier…"
                      className="resize-none rounded-xl border border-white/12 bg-white/[0.04] px-3.5 py-3 text-[0.88rem] text-alu-100 outline-none transition-colors placeholder:text-alu-500/60 focus:border-accent-400/60 focus:bg-white/[0.07]"
                    />
                  </label>

                  {/* Upload */}
                  <div className="rounded-2xl border border-dashed border-white/15 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="flex items-center gap-2.5 text-[0.8rem] text-alu-300">
                        <ImagePlus className="size-4 text-accent-400" />
                        Photos ou plans (facultatif)
                      </span>
                      <Button
                        type="button"
                        variant="glass"
                        size="sm"
                        className="text-alu-100"
                        onClick={() => fileInput.current?.click()}
                      >
                        Choisir des fichiers
                      </Button>
                      <input
                        ref={fileInput}
                        type="file"
                        multiple
                        accept="image/*,.pdf,.dwg,.dxf"
                        className="hidden"
                        onChange={(e) => setFiles(Array.from(e.target.files ?? []).slice(0, 6))}
                      />
                    </div>
                    {files.length > 0 && (
                      <ul className="mt-3 grid gap-2">
                        {files.map((f) => (
                          <li
                            key={f.name}
                            className="flex items-center justify-between gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2 text-[0.78rem] text-alu-300"
                          >
                            <span className="truncate">
                              {f.name} <span className="text-alu-500">· {formatBytes(f.size)}</span>
                            </span>
                            <button
                              type="button"
                              aria-label={`Retirer ${f.name}`}
                              onClick={() => setFiles((list) => list.filter((x) => x.name !== f.name))}
                              className="text-alu-500 transition-colors hover:text-accent-300"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                    <p className="mt-3 text-[0.72rem] leading-relaxed text-alu-400/70">
                      Vos fichiers sont listés dans la demande. Si la transmission automatique n’est pas activée sur ce
                      site, nous vous indiquons comment nous les faire parvenir (WhatsApp ou e-mail) dès notre premier
                      échange.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    full
                    className="mt-1 bg-alu-100 text-ink-900 hover:bg-white"
                    disabled={!valid || sending}
                    icon={sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                  >
                    {sending ? 'Envoi en cours…' : 'Envoyer ma demande'}
                  </Button>

                  {!valid && (
                    <p className="text-[0.75rem] text-accent-300/90">
                      Complétez les champs obligatoires : nom, téléphone et ville.
                    </p>
                  )}
                </form>
              ) : (
                <div className="py-4">
                  <span className="flex size-14 items-center justify-center rounded-2xl border border-accent-400/40 bg-accent-500/10 text-accent-300">
                    <BadgeCheck className="size-7" />
                  </span>
                  <p className="mt-6 font-display text-[1.3rem] leading-snug tracking-tight text-alu-100">
                    {outcome.message}
                  </p>
                  <p className="mt-3 text-[0.85rem] text-alu-400">
                    Référence : <span className="text-accent-300">{outcome.reference}</span> · Ville : {form.city}
                  </p>

                  <div className="mt-6 rounded-2xl border border-white/10 bg-ink-950/60 p-4">
                    <p className="text-[0.68rem] uppercase tracking-[0.22em] text-alu-400/75">Votre demande</p>
                    <pre className="mt-2.5 whitespace-pre-wrap font-sans text-[0.78rem] leading-relaxed text-alu-300">
                      {[
                        `• Nom : ${form.name}`,
                        `• Téléphone : ${form.phone}`,
                        form.email ? `• E-mail : ${form.email}` : '',
                        `• Ville : ${form.city}`,
                        `• Type de projet : ${form.projectType}`,
                        `• Matériau : ${form.material}`,
                        form.dimensions ? `• Dimensions : ${form.dimensions}` : '',
                        form.message ? `• Message : ${form.message}` : '',
                        files.length ? `• Fichiers : ${files.map((f) => f.name).join(', ')}` : '',
                      ]
                        .filter(Boolean)
                        .join('\n')}
                    </pre>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        variant="glass"
                        size="sm"
                        className="text-alu-100"
                        icon={copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                        onClick={() => {
                          void navigator.clipboard?.writeText(
                            `Demande de devis CRISTALUM (${outcome.reference})\n${form.name} · ${form.phone} · ${form.city}\n${form.projectType} · ${form.material}\n${form.dimensions}\n${form.message}`,
                          )
                          setCopied(true)
                          setTimeout(() => setCopied(false), 2200)
                        }}
                      >
                        {copied ? 'Copié' : 'Copier'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-alu-300 hover:text-alu-100"
                        onClick={() => {
                          setOutcome(null)
                          setFiles([])
                          setForm((f) => ({ ...f, name: '', phone: '', email: '', dimensions: '', message: '' }))
                        }}
                      >
                        Envoyer une nouvelle demande
                      </Button>
                    </div>
                  </div>
                </div>
              )}
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
  error,
  icon,
  autoComplete,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  error?: string
  icon?: React.ReactNode
  autoComplete?: string
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.2em] text-alu-400/80">
        {icon}
        {label}
      </span>
      <input
        type={type}
        value={value}
        autoComplete={autoComplete}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        className={cn(
          'rounded-xl border bg-white/[0.04] px-3.5 py-3 text-[0.88rem] text-alu-100 outline-none transition-colors placeholder:text-alu-500/60 focus:bg-white/[0.07]',
          error ? 'border-accent-400/60' : 'border-white/12 focus:border-accent-400/60',
        )}
      />
      {error && <span className="text-[0.72rem] text-accent-300">{error}</span>}
    </label>
  )
}
