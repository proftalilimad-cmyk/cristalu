import {
  ArrowUpRight,
  Facebook,
  Globe,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Shield,
} from 'lucide-react'
import { navItems } from '@/data/navigation'
import { services } from '@/data/services'
import { hasSocial, hasWhatsApp, siteConfig, val, whatsappLink } from '@/data/site'
import { Logo } from './Logo'

const legalLinks = [
  { label: 'Mentions légales', href: '#/mentions-legales' },
  { label: 'Politique de confidentialité', href: '#/politique-de-confidentialite' },
]

export function Footer() {
  const year = new Date().getFullYear()
  const phone = val(siteConfig.contact.phone)
  const email = val(siteConfig.contact.email)
  const address = [
    val(siteConfig.contact.address.street),
    val(siteConfig.contact.address.city),
    val(siteConfig.contact.address.region),
  ].filter(Boolean)
  const maps = val(siteConfig.contact.maps)
  const facebook = val(siteConfig.social.facebook)
  const instagram = val(siteConfig.social.instagram)
  const hours = val(siteConfig.hours)

  return (
    <footer className="relative overflow-hidden bg-ink-950 pt-20 text-alu-300">
      <div className="pointer-events-none absolute inset-0 bg-zellige opacity-[0.1]" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-glacier-400/40 to-transparent" />

      <div className="container-x relative">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1.1fr]">
          {/* Marque */}
          <div>
            <Logo tone="dark" />
            <p className="mt-6 max-w-xs text-[0.9rem] leading-relaxed text-alu-400">
              {siteConfig.tagline} au Maroc. Nous concevons, fabriquons et installons des solutions qui associent
              design, performance et durabilité.
            </p>
            <div className="mt-6 flex gap-2.5">
              {facebook ? (
                <a
                  href={facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="glass-pane flex size-10 items-center justify-center rounded-full text-alu-200 transition-transform duration-500 hover:-translate-y-0.5"
                >
                  <Facebook className="size-4" />
                </a>
              ) : null}
              {instagram ? (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="glass-pane flex size-10 items-center justify-center rounded-full text-alu-200 transition-transform duration-500 hover:-translate-y-0.5"
                >
                  <Instagram className="size-4" />
                </a>
              ) : null}
              {hasWhatsApp() ? (
                <a
                  href={whatsappLink() ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="glass-pane flex size-10 items-center justify-center rounded-full text-alu-200 transition-transform duration-500 hover:-translate-y-0.5"
                >
                  <MessageCircle className="size-4" />
                </a>
              ) : null}
              {!hasSocial() && !hasWhatsApp() && (
                <span className="flex items-center gap-2 rounded-full border border-white/10 px-3.5 py-2 text-[0.72rem] text-alu-500">
                  Réseaux sociaux à renseigner
                </span>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav aria-label="Navigation du pied de page">
            <p className="text-[0.68rem] uppercase tracking-[0.26em] text-alu-500">Navigation</p>
            <ul className="mt-5 grid gap-2.5">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="group inline-flex items-center gap-1.5 text-[0.88rem] text-alu-300 transition-colors hover:text-alu-100"
                  >
                    {item.label}
                    <ArrowUpRight className="size-3 opacity-0 transition-all duration-500 group-hover:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Solutions */}
          <nav aria-label="Solutions">
            <p className="text-[0.68rem] uppercase tracking-[0.26em] text-alu-500">Solutions</p>
            <ul className="mt-5 grid gap-2.5">
              {services.map((s) => (
                <li key={s.id}>
                  <a
                    href="#solutions"
                    className="text-[0.88rem] text-alu-300 transition-colors hover:text-alu-100"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.26em] text-alu-500">Contact</p>
            <ul className="mt-5 grid gap-3.5 text-[0.88rem]">
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-glacier-400" />
                {phone ? (
                  <a href={`tel:${phone.replace(/\s/g, '')}`} className="transition-colors hover:text-alu-100">
                    {phone}
                  </a>
                ) : (
                  <span className="text-alu-500">Téléphone à renseigner</span>
                )}
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-glacier-400" />
                {email ? (
                  <a href={`mailto:${email}`} className="break-all transition-colors hover:text-alu-100">
                    {email}
                  </a>
                ) : (
                  <span className="text-alu-500">E-mail à renseigner</span>
                )}
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-glacier-400" />
                {address.length > 0 ? (
                  maps ? (
                    <a
                      href={maps}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-alu-100"
                    >
                      {address.join(' · ')}
                    </a>
                  ) : (
                    <span>{address.join(' · ')}</span>
                  )
                ) : (
                  <span className="text-alu-500">Adresse à renseigner</span>
                )}
              </li>
              {hours && (
                <li className="flex items-start gap-3">
                  <Globe className="mt-0.5 size-4 shrink-0 text-glacier-400" />
                  <span>{hours}</span>
                </li>
              )}
              {hasWhatsApp() && (
                <li className="flex items-start gap-3">
                  <MessageCircle className="mt-0.5 size-4 shrink-0 text-glacier-400" />
                  <a
                    href={whatsappLink() ?? '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-alu-100"
                  >
                    WhatsApp
                  </a>
                </li>
              )}
            </ul>

            {maps ? (
              <a
                href={maps}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-5 flex items-center justify-between gap-3 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-[0.8rem] text-alu-300 transition-colors hover:border-glacier-400/40 hover:text-alu-100"
              >
                <span className="flex items-center gap-2.5">
                  <Navigation className="size-4 text-glacier-400" />
                  Voir sur Google Maps
                </span>
                <ArrowUpRight className="size-3.5 transition-transform duration-500 group-hover:translate-x-0.5" />
              </a>
            ) : (
              <p className="mt-5 flex items-center gap-2.5 rounded-2xl border border-white/10 px-4 py-3 text-[0.76rem] text-alu-500">
                <Navigation className="size-4" />
                Lien Google Maps à renseigner
              </p>
            )}
          </div>
        </div>

        <div className="mt-16 grid gap-6 border-t border-white/10 py-8 md:grid-cols-[1fr_auto] md:items-center">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.78rem] text-alu-500">
            <span>
              © {year} {siteConfig.legalName}. Tous droits réservés.
            </span>
            {legalLinks.map((l) => (
              <a key={l.href} href={l.href} className="transition-colors hover:text-alu-200">
                {l.label}
              </a>
            ))}
          </div>
          <p className="flex items-center gap-2 text-[0.74rem] text-alu-600">
            <Shield className="size-3.5" />
            Mentions légales à compléter (RC / ICE)
          </p>
        </div>
      </div>

      {/* Bandeau décoratif : profilés aluminium */}
      <div className="relative h-14 overflow-hidden border-t border-white/8" aria-hidden>
        <div className="flex h-full items-center gap-1.5 px-6 opacity-40">
          {Array.from({ length: 60 }, (_, i) => (
            <span
              key={i}
              className="h-full w-px bg-gradient-to-b from-transparent via-alu-500/40 to-transparent"
              style={{ opacity: 1 - Math.abs(30 - i) / 40 }}
            />
          ))}
        </div>
      </div>
    </footer>
  )
}
