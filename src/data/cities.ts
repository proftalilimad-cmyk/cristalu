/**
 * Zone d'intervention — ⚠️ À CONFIRMER.
 *
 * Les villes ci-dessous correspondent aux grandes agglomérations du Maroc.
 * Aucune confirmation n'a été fournie : `verified` est donc à `false` et
 * l'interface affiche un avertissement explicite dans la section « Zone
 * d'intervention ». Passez `verified: true` (et supprimez celles non desservies)
 * une fois la zone validée par l'entreprise.
 *
 * Les coordonnées affichées proviennent de CITY_XY (`src/data/moroccoGeo.ts`),
 * généré depuis de vraies données géographiques (Natural Earth) : `npm run map`.
 */

export type LabelSide = 'left' | 'right' | 'above' | 'below'

export type City = {
  id: string
  name: string
  region: string
  /** Zone d'intervention confirmée par l'entreprise */
  verified: boolean
  /** Côté d'affichage de l'étiquette sur la carte (anti-chevauchement) */
  label: LabelSide
  /** Ville du siège / atelier */
  hq?: boolean
}

export const cities: City[] = [
  { id: 'tanger', name: 'Tanger', region: 'Tanger-Tétouan-Al Hoceïma', verified: false, label: 'right' },
  { id: 'kenitra', name: 'Kénitra', region: 'Rabat-Salé-Kénitra', verified: false, label: 'above' },
  { id: 'rabat', name: 'Rabat', region: 'Rabat-Salé-Kénitra', verified: false, label: 'left' },
  { id: 'casablanca', name: 'Casablanca', region: 'Casablanca-Settat', verified: false, label: 'left' },
  { id: 'fes', name: 'Fès', region: 'Fès-Meknès', verified: false, label: 'right' },
  { id: 'meknes', name: 'Meknès', region: 'Fès-Meknès', verified: false, label: 'below' },
  { id: 'oujda', name: 'Oujda', region: 'Oriental', verified: false, label: 'below' },
  { id: 'marrakech', name: 'Marrakech', region: 'Marrakech-Safi', verified: false, label: 'right' },
  { id: 'agadir', name: 'Agadir', region: 'Souss-Massa', verified: false, label: 'right' },
]

export const allCitiesVerified = cities.every((c) => c.verified)

export const serviceAreaNotice =
  'Zone d’intervention à confirmer avec l’équipe CRISTALUM avant publication.'
