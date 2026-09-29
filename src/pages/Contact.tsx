import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import Reveal from '../components/ui/Reveal'
import ContactForm from '../components/contact/ContactForm'
import { useI18n } from '../i18n'
import { company } from '../content'

export default function Contact() {
  const { t, L } = useI18n()

  const items = [
    {
      icon: Phone,
      label: t.contact.phone,
      value: company.phone,
      href: `tel:${company.phone.replace(/\s/g, '')}`,
    },
    {
      icon: MessageCircle,
      label: t.contact.whatsapp,
      value: company.phone,
      href: `https://wa.me/${company.whatsapp}`,
    },
    { icon: Mail, label: t.contact.email, value: company.email, href: `mailto:${company.email}` },
    { icon: MapPin, label: t.contact.address, value: L(company.address) },
  ]

  return (
    <>
      <PageHeader eyebrow={t.contact.eyebrow} title={t.contact.title} intro={t.contact.intro} />

      <section className="bg-paper pb-24 lg:pb-32">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

          <aside className="flex flex-col gap-10 lg:col-span-5">
            <Reveal className="flex flex-col divide-y divide-ink/10 border-y border-ink/10">
              {items.map((item) => {
                const Icon = item.icon
                const content = (
                  <span className="flex items-start gap-4 py-5">
                    <Icon size={17} className="mt-0.5 shrink-0 text-steel" />
                    <span className="flex flex-col gap-1">
                      <span className="eyebrow">{item.label}</span>
                      <span className="text-sm text-graphite" dir="auto">
                        {item.value}
                      </span>
                    </span>
                  </span>
                )
                return item.href ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer noopener"
                    className="transition-colors hover:text-ink"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={item.label}>{content}</div>
                )
              })}
            </Reveal>

            <Reveal>
              <div className="flex items-start gap-4">
                <Clock size={17} className="mt-0.5 shrink-0 text-steel" />
                <div className="w-full">
                  <span className="eyebrow">{t.contact.hours}</span>
                  <ul className="mt-3 flex flex-col divide-y divide-ink/10">
                    {company.hours.map((h, i) => (
                      <li key={i} className="flex items-center justify-between gap-4 py-2.5 text-sm">
                        <span className="text-graphite">{L(h.days)}</span>
                        <span className="text-steel" dir="ltr">
                          {h.time}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>

            <Reveal>
              <div>
                <span className="eyebrow">{t.contact.map}</span>
                <div className="mt-4 overflow-hidden rounded-xl border border-ink/10">
                  <iframe
                    title="Google Maps — Cristalu Maroc"
                    src={company.mapEmbed}
                    className="h-72 w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <p className="mt-3 text-[0.68rem] uppercase tracking-[0.16em] text-steel">
                  {t.footer.placeholder}
                </p>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>
    </>
  )
}
