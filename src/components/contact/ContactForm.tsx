import { useState, type FormEvent } from 'react'
import { ArrowUpRight, Mail, MessageCircle } from 'lucide-react'
import { MagneticButton } from '../ui/MagneticButton'
import { useI18n } from '../../i18n'
import { company, contentClient } from '../../content'

type Fields = { name: string; phone: string; email: string; type: string; message: string }

const empty: Fields = { name: '', phone: '', email: '', type: '', message: '' }

export default function ContactForm() {
  const { t } = useI18n()
  const [fields, setFields] = useState<Fields>({ ...empty, type: t.contact.form.types[0] })
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'fallback'>('idle')

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setFields((f) => ({ ...f, [key]: e.target.value }))

  const summary = () =>
    [
      `${t.contact.form.name}: ${fields.name}`,
      `${t.contact.form.phone}: ${fields.phone}`,
      `${t.contact.form.email}: ${fields.email}`,
      `${t.contact.form.type}: ${fields.type}`,
      '',
      fields.message,
    ].join('\n')

  const validate = () => {
    const e: Partial<Record<keyof Fields, string>> = {}
    if (!fields.name.trim()) e.name = t.contact.form.required
    if (!fields.phone.trim()) e.phone = t.contact.form.required
    if (fields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
      e.email = t.contact.form.invalidEmail
    if (!fields.message.trim()) e.message = t.contact.form.required
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setStatus('sending')
    const res = await contentClient.submitContactRequest({ ...fields })
    setStatus(res.ok ? 'sent' : 'fallback')
  }

  const whatsappHref = `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(summary())}`
  const mailHref = `mailto:${company.email}?subject=${encodeURIComponent(
    `Demande de devis — ${fields.name || 'Cristalu Maroc'}`,
  )}&body=${encodeURIComponent(summary())}`

  const field =
    'w-full border-b border-ink/15 bg-transparent py-3 text-sm outline-none transition-colors placeholder:text-steel/70 focus:border-ink'

  return (
    <form onSubmit={onSubmit} id="form" className="flex flex-col gap-7" noValidate>
      <div className="grid gap-7 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="eyebrow">{t.contact.form.name} *</span>
          <input className={field} value={fields.name} onChange={set('name')} autoComplete="name" />
          {errors.name ? <span className="text-xs text-red-600">{errors.name}</span> : null}
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="eyebrow">{t.contact.form.phone} *</span>
          <input
            className={field}
            value={fields.phone}
            onChange={set('phone')}
            inputMode="tel"
            autoComplete="tel"
            dir="ltr"
          />
          {errors.phone ? <span className="text-xs text-red-600">{errors.phone}</span> : null}
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="eyebrow">{t.contact.form.email}</span>
          <input
            className={field}
            value={fields.email}
            onChange={set('email')}
            type="email"
            autoComplete="email"
            dir="ltr"
          />
          {errors.email ? <span className="text-xs text-red-600">{errors.email}</span> : null}
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="eyebrow">{t.contact.form.type}</span>
          <select className={field} value={fields.type} onChange={set('type')}>
            {t.contact.form.types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="eyebrow">{t.contact.form.message} *</span>
        <textarea
          className={`${field} min-h-32 resize-y`}
          value={fields.message}
          onChange={set('message')}
          placeholder={t.contact.form.placeholderMessage}
        />
        {errors.message ? <span className="text-xs text-red-600">{errors.message}</span> : null}
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <MagneticButton type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? t.contact.form.sending : t.contact.form.submit}
          <ArrowUpRight size={15} />
        </MagneticButton>
      </div>

      {status === 'sent' ? (
        <p className="rounded-lg bg-mist p-4 text-sm text-graphite">{t.contact.form.success}</p>
      ) : null}

      {status === 'fallback' ? (
        <div className="flex flex-col gap-4 rounded-lg bg-mist p-5">
          <p className="text-sm text-graphite">{t.contact.form.fallback}</p>
          <div className="flex flex-wrap gap-3">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[0.72rem] uppercase tracking-[0.14em] text-paper"
            >
              <MessageCircle size={14} /> {t.contact.form.sendWhatsapp}
            </a>
            <a
              href={mailHref}
              className="inline-flex items-center gap-2 rounded-full border border-ink/25 px-5 py-2.5 text-[0.72rem] uppercase tracking-[0.14em]"
            >
              <Mail size={14} /> {t.contact.form.sendEmail}
            </a>
          </div>
        </div>
      ) : null}
    </form>
  )
}
