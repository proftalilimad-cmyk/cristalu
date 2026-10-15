/**
 * Zone d'intervention — ⚠️ À CONFIRMER.
 *
 * Les villes ci-dessous correspondent aux grandes agglomérations du Maroc.
 * Aucune confirmation n'a été fournie : `verified` est donc à `false` et
 * l'interface affiche un avertissement explicite dans la section « Zone
 * d'intervention ». Passez `verified: true` (et décochez celles non desservies)
 * une fois la zone validée par l'entreprise.
 *
 * `x` / `y` = position en pourcentage sur la carte SVG du Maroc (viewBox 0 0 100 100).
 */
export type City = {
  id: string
  name: string
  region: string
  x: number
  y: number
  verified: boolean
  note?: string
}

export const cities: City[] = [
  { id: 'tanger', name: 'Tanger', region: 'Tanger-Tétouan-Al Hoceïma', x: 27, y: 12.5, verified: false },
  { id: 'kenitra', name: 'Kénitra', region: 'Rabat-Salé-Kénitra', x: 28.5, y: 21.5, verified: false },
  { id: 'rabat', name: 'Rabat', region: 'Rabat-Salé-Kénitra', x: 27.5, y: 25, verified: false },
  { id: 'casablanca', name: 'Casablanca', region: 'Casablanca-Settat', x: 23, y: 28, verified: false },
  { id: 'fes', name: 'Fès', region: 'Fès-Meknès', x: 45.5, y: 22.5, verified: false },
  { id: 'meknes', name: 'Meknès', region: 'Fès-Meknès', x: 42, y: 25.5, verified: false },
  { id: 'oujda', name: 'Oujda', region: 'Oriental', x: 63, y: 18.5, verified: false },
  { id: 'marrakech', name: 'Marrakech', region: 'Marrakech-Safi', x: 27, y: 39.5, verified: false },
  { id: 'agadir', name: 'Agadir', region: 'Souss-Massa', x: 18.5, y: 50.5, verified: false },
]

export const allCitiesVerified = cities.every((c) => c.verified)

/** Contour simplifié du Maroc (y compris Sahara) pour la carte SVG interactive. */
export const moroccoPath =
  'M18.9,3.1 L24.6,1.6 L31.6,2.1 L33.6,4.6 L40.2,3.4 L46.2,4.9 L51.1,3.6 L56.6,6.1 L63.9,7.9 L68.4,11.6 L75.1,12.6 L79.9,16.4 L81.4,22.1 L79.6,27.6 L80.9,33.4 L78.4,39.6 L80.1,45.9 L78.9,52.6 L76.6,58.9 L73.9,65.6 L71.4,72.4 L67.9,78.6 L63.6,84.9 L58.4,90.1 L52.6,94.4 L46.2,96.9 L39.6,97.6 L33.4,95.9 L28.1,92.6 L23.6,88.4 L20.1,83.6 L17.9,78.1 L15.6,71.9 L14.1,65.1 L13.4,58.1 L12.1,50.9 L10.9,43.4 L11.6,36.1 L13.1,28.9 L15.1,22.1 L13.4,16.1 L15.6,10.4 L17.1,6.1 Z'

/** Villes voisines / projets à l'international — non affichées actuellement. */
export const serviceAreaNotice =
  'Zone d’intervention à confirmer avec l’équipe CRISTALUM avant publication.'
