import { Link } from 'react-router-dom'
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'
import Logo from './Logo'
import { useI18n } from '../../i18n'
import { company } from '../../content'

export default function Footer() {
  const { t, L } = useI18n()
  const year = new Date().getFullYear()

  const links = [
    { to: '/solutions', label: t.nav.solutions },
    { to: '/produits', label: t.nav.products },
    { to: '/realisations', label: t.nav.projects },
    { to: '/a-propos', label: t.nav.about },
    { to: '/contact', label: t.nav.contact },
  ]

  return (
    <footer className="relative bg-void text-white/80">
      <div className="container-x grid gap-14 py-20 md:grid-cols-2 lg:grid-cols-4 lg:py-24">
        <div className="flex flex-col gap-6 lg:col-span-1">
          <Logo tone="light" />
          <p className="max-w-xs text-sm leading-relaxed text-white/55">{t.footer.tagline}</p>
        </div>

        <div className="flex flex-col gap-5">
          <h3 className="eyebrow text-white/40">{t.footer.nav}</h3>
          <ul className="flex flex-col gap-3">
            {links.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="link-underline text-sm text-white/75 hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-5">
          <h3 className="eyebrow text-white/40">{t.footer.contact}</h3>
          <ul className="flex flex-col gap-3 text-sm text-white/75">
            <li>
              <a
                href={`tel:${company.phone.replace(/\s/g, '')}`}
                className="inline-flex items-center gap-2 hover:text-white"
              >
                <Phone size={14} /> {company.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${company.email}`}
                className="inline-flex items-center gap-2 hover:text-white"
              >
                <Mail size={14} /> {company.email}
              </a>
            </li>
            <li className="inline-flex items-start gap-2 text-white/60">
              <MapPin size={14} className="mt-1 shrink-0" /> {L(company.address)}
            </li>
          </ul>
          <p className="text-[0.68rem] uppercase tracking-[0.18em] text-white/30">
            {t.footer.placeholder}
          </p>
        </div>

        <div className="flex flex-col gap-5">
          <h3 className="eyebrow text-white/40">{t.footer.follow}</h3>
          <ul className="flex flex-col gap-3 text-sm">
            {company.social.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  className="link-underline inline-flex items-center gap-1 text-white/75 hover:text-white"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {s.label} <ArrowUpRight size={13} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container-x">
        <div className="h-px w-full bg-white/10" />
        <div className="flex flex-col gap-3 py-7 text-[0.72rem] text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {company.name}. {t.footer.rights}
          </p>
          <p className="tracking-[0.16em] uppercase">
            Aluminium · PVC · {company.city}
          </p>
        </div>
      </div>
    </footer>
  )
}
