/**
 * ============================================================================
 *  CRISTALUM MAROC — Configuration centrale du site
 * ============================================================================
 *  ⚠️  IMPORTANT — INFORMATIONS À VÉRIFIER
 *
 *  Aucune information commerciale (téléphone, e-mail, adresse, numéro WhatsApp,
 *  réseaux sociaux, année de création, statistiques) n'a été fournie par
 *  l'entreprise. Ces champs sont donc volontairement VIDES et marqués
 *  `verified: false`.
 *
 *  → Le site n'invente rien : tant qu'un champ est vide, l'interface affiche un
 *    état « à renseigner » au lieu d'une valeur inventée.
 *  → Dès que vous remplissez une valeur et passez `verified: true`, elle
 *    s'affiche partout automatiquement (header, footer, contact, schema.org…).
 *
 *  Voir TODO-CONTENU.md pour la liste complète à compléter avant mise en ligne.
 * ============================================================================
 */

/** Marqueur de valeur non confirmée. Ne jamais deviner une information. */
export type Verifiable<T = string> = {
  value: T | null
  verified: boolean
  /** Note interne (non affichée publiquement). */
  hint?: string
}

const pending = <T,>(hint?: string): Verifiable<T> => ({ value: null, verified: false, hint })
export const verified = <T,>(value: T): Verifiable<T> => ({ value, verified: true })

export const siteConfig = {
  name: 'CRISTALUM',
  legalName: 'CRISTALUM MAROC',
  tagline: 'Menuiserie Aluminium & PVC sur mesure',
  longTagline: 'Menuiserie Aluminium & PVC sur mesure au Maroc',
  supportingText:
    'Nous concevons, fabriquons et installons des solutions sur mesure qui associent design, performance et durabilité.',

  url: 'https://www.cristalum.ma',

  contact: {
    /** Ex. '+212 5XX XX XX XX' */
    phone: pending<string>('Renseigner le numéro de téléphone principal'),
    /** Deuxième ligne (mobile / atelier). */
    phoneAlt: pending<string>('Renseigner un second numéro (facultatif)'),
    email: pending<string>('Renseigner l’adresse e-mail de contact'),
    emailSales: pending<string>('Renseigner l’e-mail commercial (facultatif)'),
    address: {
      street: pending<string>('N° et rue / zone industrielle'),
      city: pending<string>('Ville du siège / atelier'),
      region: pending<string>('Région'),
      postalCode: pending<string>('Code postal'),
      country: 'Maroc',
    },
    /** Coordonnées pour la carte Google Maps. */
    maps: pending<string>('Coller le lien Google Maps de l’établissement'),
  },

  whatsapp: {
    /**
     * Numéro WhatsApp au format international sans « + », ex. '212612345678'.
     * Le bouton flottant n'apparaît QUE si `number` est renseigné et `enabled`.
     */
    number: null as string | null,
    enabled: false as boolean,
    /** Message pré-rempli à l'ouverture de WhatsApp. */
    message:
      'Bonjour Cristalum, je souhaite obtenir un devis pour un projet de menuiserie aluminium/PVC.',
  },

  hours: pending<string>('Horaires d’ouverture, ex. « Lun – Sam : 8h30 – 18h30 »'),

  social: {
    facebook: pending<string>('URL de la page Facebook'),
    instagram: pending<string>('URL du compte Instagram'),
  },

  /**
   * Backend d'envoi des demandes de devis.
   * Formats supportés :
   *   { provider: 'endpoint', url: 'https://…' }        → POST JSON (API interne, n8n, Make…)
   *   { provider: 'formspree', formId: 'xxxxxxx' }      → https://formspree.io/f/xxxxxxx
   *   { provider: 'none' }                             → aucune API : la demande est
   *                                                      transmise par WhatsApp / e-mail
   *                                                      (message structuré pré-rempli)
   */
  forms: {
    quoteEndpoint: { provider: 'none' } as
      | { provider: 'none' }
      | { provider: 'endpoint'; url: string }
      | { provider: 'formspree'; formId: string },
  },

  /**
   * Statistiques. `verified: false` ⇒ aucun chiffre inventé n'est affiché.
   * Les compteurs marqués « inSite » sont vérifiables directement sur ce site
   * (nombre d'étapes, de familles de solutions, de finitions, de vitrages).
   */
  joinery: {
    yearsOfExperience: pending<number>('Nombre d’années d’expérience réel'),
    projectsCompleted: pending<number>('Nombre de chantiers réalisés (facultatif)'),
  },

  /** Zone d'intervention : à confirmer (voir src/data/cities.ts). */
  serviceAreaVerified: false,

  legal: {
    companyIdentifier: pending<string>('RC / ICE / ICE société, forme juridique'),
    legalNoticeUrl: '/mentions-legales',
    privacyUrl: '/politique-de-confidentialite',
  },
} as const

/* --------------------------------------------------------------------------
 *  Helpers — utilisés par l'UI pour distinguer « configuré » de « à renseigner »
 * -------------------------------------------------------------------------- */

/** Renvoie la valeur si (et seulement si) elle est renseignée, sinon null. */
export function val(v: Verifiable<string | number> | null | undefined): string | null {
  if (!v) return null
  const raw = v.value
  if (raw === null || raw === undefined) return null
  const s = String(raw).trim()
  return s.length > 0 ? s : null
}

export const hasPhone = () => val(siteConfig.contact.phone) !== null
export const hasEmail = () => val(siteConfig.contact.email) !== null
export const hasAddress = () =>
  val(siteConfig.contact.address.street) !== null || val(siteConfig.contact.address.city) !== null
export const hasWhatsApp = () =>
  siteConfig.whatsapp.enabled === true && !!siteConfig.whatsapp.number && siteConfig.whatsapp.number.length >= 8
export const hasSocial = () =>
  val(siteConfig.social.facebook) !== null || val(siteConfig.social.instagram) !== null

/** Lien WhatsApp (ou null si non configuré). */
export function whatsappLink(extra?: string): string | null {
  if (!hasWhatsApp()) return null
  const text = extra ? `${siteConfig.whatsapp.message} ${extra}` : siteConfig.whatsapp.message
  return `https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent(text)}`
}

export function mailtoLink(subject: string, body: string): string | null {
  const email = val(siteConfig.contact.email)
  if (!email) return null
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

/** Téléphone « tel: » nettoyé (ou null). */
export function telLink(): string | null {
  const phone = val(siteConfig.contact.phone)
  if (!phone) return null
  return `tel:+${phone.replace(/[^\d]/g, '').replace(/^00/, '')}`
}

/** Avertissement développeur : liste ce qui reste à vérifier avant mise en ligne. */
export const UNVERIFIED_FIELDS: string[] = (
  [
    ['contact.phone', siteConfig.contact.phone],
    ['contact.phoneAlt', siteConfig.contact.phoneAlt],
    ['contact.email', siteConfig.contact.email],
    ['contact.emailSales', siteConfig.contact.emailSales],
    ['contact.address.street', siteConfig.contact.address.street],
    ['contact.address.city', siteConfig.contact.address.city],
    ['contact.address.region', siteConfig.contact.address.region],
    ['contact.address.postalCode', siteConfig.contact.address.postalCode],
    ['contact.maps', siteConfig.contact.maps],
    ['hours', siteConfig.hours],
    ['social.facebook', siteConfig.social.facebook],
    ['social.instagram', siteConfig.social.instagram],
    ['joinery.yearsOfExperience', siteConfig.joinery.yearsOfExperience],
    ['legal.companyIdentifier', siteConfig.legal.companyIdentifier],
  ] as const
)
  .filter(([, v]) => !v.verified || v.value === null)
  .map(([k]) => k)

if (import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.info(
    `%c[CRISTALUM] ${UNVERIFIED_FIELDS.length + 1} informations à confirmer avant mise en ligne :\n` +
      UNVERIFIED_FIELDS.map((k) => ` • ${k}`).join('\n') +
      `\n • whatsapp.number (bouton WhatsApp masqué tant qu’il est vide)` +
      `\n • zone d’intervention (src/data/cities.ts)` +
      `\n→ Détails : TODO-CONTENU.md`,
    'color:#e2494f;font-weight:600',
  )
}
