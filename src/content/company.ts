import type { CompanyInfo } from './types'

/**
 * ⚠️ PLACEHOLDERS — replace with the real Cristalu Maroc information.
 * Nothing here is invented as a factual claim: every unknown value is marked
 * with "À COMPLÉTER" so it is obvious before going live.
 */
export const company: CompanyInfo = {
  name: 'Cristalu Maroc',
  legalName: 'Cristalu Maroc',
  placeholders: ['phone', 'whatsapp', 'email', 'address', 'mapEmbed', 'social'],
  phone: '+212 000 000 000', // À COMPLÉTER
  whatsapp: '212000000000', // À COMPLÉTER (format international sans +)
  email: 'contact@cristalu.ma', // À COMPLÉTER
  address: {
    fr: 'Adresse à compléter — Tanger, Maroc',
    ar: 'العنوان (يرجى الإكمال) — طنجة، المغرب',
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
