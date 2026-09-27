/**
 * Content layer types.
 *
 * Every editorial string is stored as a `Localized` record so the same data
 * structures can later be served by a CMS / database (Strapi, Sanity, Directus,
 * Supabase…) without touching the UI components.
 */

export type Locale = 'fr' | 'ar' | 'en'

/** Localized string. `en` is optional so English can be added later. */
export type Localized = {
  fr: string
  ar: string
  en?: string
}

export type MediaAsset = {
  /** base name of the optimized files in /public/media (without size suffix) */
  src: string
  alt: Localized
  width?: number
  height?: number
}

export type Product = {
  id: string
  slug: string
  category: 'aluminium' | 'pvc' | 'mixte'
  name: Localized
  tagline: Localized
  description: Localized
  features: Localized[]
  specs: { label: Localized; value: Localized }[]
  media: MediaAsset
}

export type Project = {
  id: string
  slug: string
  title: Localized
  location: Localized
  category: 'villas' | 'residences' | 'commerces' | 'bureaux' | 'architecture'
  year: string
  summary: Localized
  scope: Localized[]
  media: MediaAsset
  gallery?: MediaAsset[]
}

export type Service = {
  id: string
  icon: string
  title: Localized
  description: Localized
}

export type ProcessStep = {
  id: string
  index: string
  title: Localized
  description: Localized
}

export type Material = {
  id: 'aluminium' | 'pvc' | 'verre'
  name: Localized
  intro: Localized
  points: Localized[]
  metrics: { label: Localized; value: string }[]
  fallbackImage: MediaAsset
}

export type CompanyInfo = {
  name: string
  legalName: string
  /** Placeholder values are flagged so they are easy to find & replace. */
  placeholders: string[]
  phone: string
  /** second numéro affiché à côté du principal */
  phoneAlt?: string
  whatsapp: string
  email: string
  website?: string
  address: Localized
  city: string
  mapEmbed: string
  hours: { days: Localized; time: string }[]
  social: { label: string; href: string }[]
}
