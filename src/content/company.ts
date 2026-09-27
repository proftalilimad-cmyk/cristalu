import type { CompanyInfo } from './types'

/**
 * ⚠️ PLACEHOLDERS — replace with the real Cristalu Maroc information.
 * Nothing here is invented as a factual claim: every unknown value is marked
 * with "À COMPLÉTER" so it is obvious before going live.
 */
export const company: CompanyInfo = {
  name: 'Cristalu Maroc',
  legalName: 'Cristalu Maroc',
  /** Ce qui reste à compléter avec l'entreprise. */
  placeholders: ['address', 'mapEmbed', 'social'],
  // Coordonnées issues des supports de communication Cristalu Nord.
  phone: '+212 661 239 493',
  phoneAlt: '+212 666 663 343',
  whatsapp: '212661239493', // format international sans +
  email: 'cristalunord@gmail.com',
  website: 'www.cristalunord.com',
  address: {
    fr: 'Adresse à compléter — région de Tanger, Maroc',
    ar: 'العنوان (يرجى الإكمال) — جهة طنجة، المغرب',
  },
  city: 'Tanger',
  // Generic Tanger map — replace with the exact showroom/workshop location.
  mapEmbed:
    'https://www.google.com/maps?q=Tanger,%20Maroc&output=embed',
  hours: [
    { days: { fr: 'Lundi – Vendredi', ar: 'الإثنين – الجمعة' }, time: '08:30 – 18:30' },
    { days: { fr: 'Samedi', ar: 'السبت' }, time: '09:00 – 13:00' },
    { days: { fr: 'Dimanche', ar: 'الأحد' }, time: '—' },
  ],
  social: [
    { label: 'Instagram', href: '#' }, // À COMPLÉTER
    { label: 'Facebook', href: '#' }, // À COMPLÉTER
    { label: 'LinkedIn', href: '#' }, // À COMPLÉTER
  ],
}
