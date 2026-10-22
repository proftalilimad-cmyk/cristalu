/**
 * Réalisations CRISTALU MAROC — photos réelles de chantier (fournies par
 * l'entreprise, classées par opération).
 *
 * ⚠️ Confidentialité : `location` reste `null` tant que l'entreprise n'a pas
 * autorisé la publication des lieux — la fiche affiche « Communiquée sur
 * demande ». Les descriptions décrivent uniquement ce qui est visible sur les
 * photos (aucun client, chiffre ou lieu inventé).
 */
import type { ImageBase } from '@/components/ui/SmartImage'

export type ProjectCategory = 'Façades' | 'Garde-corps' | 'Volets' | 'Portes' | 'Logistique' | 'Vitrerie'

export const projectCategories: ProjectCategory[] = [
  'Façades',
  'Garde-corps',
  'Vitrerie',
  'Volets',
  'Portes',
  'Logistique',
]

export type Project = {
  id: string
  title: string
  category: ProjectCategory
  /** Type de produit, ex. « Coulissant 3 vantaux » */
  type: string
  /** Matériaux mis en œuvre */
  materials: string[]
  description: string
  /** Image de couverture (voir `npm run images`) */
  image: ImageBase
  /** Toutes les photos de l'opération (la première sert de couverture) */
  photos: ImageBase[]
  /** Ville — `null` ⇒ « communiquée sur demande » */
  location: string | null
  /** Format d'affichage dans la galerie masonry */
  span: 'tall' | 'wide' | 'normal'
  year?: string
}

export const projects: Project[] = [
  {
    id: 'facade-vitree-immeuble',
    title: 'Façade vitrée d’immeuble collectif',
    category: 'Façades',
    type: 'Rideau de verre teinté + fenêtres aluminium',
    materials: ['Profilés aluminium', 'Vitrage teinté', 'Rideau de verre'],
    description:
      'Grande façade vitrée teintée sur plusieurs niveaux et rangées de fenêtres aluminium alignées sur la tour d’habitation — pose menée en phase de chantier, de la structure au clos.',
    image: 'real-facade-vitree',
    photos: ['real-facade-vitree'],
    location: null,
    span: 'tall',
  },
  {
    id: 'garde-corps-verre-immeuble',
    title: 'Garde-corps verre sur balcons d’immeuble',
    category: 'Garde-corps',
    type: 'Garde-corps tout verre, fixations ponctuelles inox',
    materials: ['Verre feuilleté trempé', 'Point-fixes inox', 'Pose en hauteur'],
    description:
      'Balcons d’un immeuble d’habitation protégés par garde-corps tout verre : panneaux feuilletés trempés fixés par point-fixes inox, pose réalisée sur échafaudage en pleine élévation.',
    image: 'real-garde-corps-1',
    photos: ['real-garde-corps-1', 'real-garde-corps-2', 'real-garde-corps-3', 'real-garde-corps-4'],
    location: null,
    span: 'tall',
  },
  {
    id: 'volets-roulants-residence',
    title: 'Volets roulants & menuiseries sur résidence',
    category: 'Volets',
    type: 'Volets roulants blancs + portes-fenêtres aluminium',
    materials: ['Aluminium', 'Volets roulants', 'Quincaillerie de pose'],
    description:
      'Équipement complet d’une résidence : volets roulants et menuiseries posés en étage, coffres intégrés, réglages et finitions faits sur place par nos équipes.',
    image: 'real-volets-1',
    photos: ['real-volets-1', 'real-volets-2'],
    location: null,
    span: 'tall',
  },
  {
    id: 'portes-decoratives-livraison',
    title: 'Portes décoratives — livraison sur chantier',
    category: 'Portes',
    type: 'Portes décoratives MOMO BOX',
    materials: ['Portes décoratives', 'Livraison assurée', 'Montage à l’étage'],
    description:
      'Approvisionnement et livraison des portes décoratives MOMO BOX directement sur chantier : nos camions transportent les blocs-portes du dépôt jusqu’à l’étage de pose, prêts au montage.',
    image: 'real-portes-1',
    photos: ['real-portes-1', 'real-portes-2', 'real-portes-3', 'real-portes-4'],
    location: null,
    span: 'wide',
  },
  {
    id: 'habillage-facade-composite',
    title: 'Habillage de façade en panneaux composite',
    category: 'Façades',
    type: 'Bardage ventilé sur ossature aluminium',
    materials: ['Panneaux composite', 'Ossature aluminium', 'Menuiseries aluminium'],
    description:
      'Rénovation de façade : ossature aluminium, pose de panneaux composite et reprise des menuiseries sur l’ensemble du bâtiment, du soubassement aux derniers niveaux.',
    image: 'real-habillage-1',
    photos: ['real-habillage-1', 'real-habillage-2', 'real-facade-bardage-noir'],
    location: null,
    span: 'wide',
  },
  {
    id: 'villa-piscine-paysage',
    title: 'Villa avec piscine — menuiseries extérieures',
    category: 'Façades',
    type: 'Menuiseries et baies sur villa paysagère',
    materials: ['Aluminium thermolaqué', 'Double vitrage', 'Aménagements extérieurs'],
    description:
      'Villa avec piscine et terrasses dallées : nos menuiseries prolongent les espaces de vie vers le jardin et le bassin, dans un paysage ouvert.',
    image: 'real-piscine-villa',
    photos: ['real-piscine-villa'],
    location: null,
    span: 'wide',
  },
  {
    id: 'manutention-vitrage-chantier',
    title: 'Manutention de vitrages grand format',
    category: 'Vitrerie',
    type: 'Déchargement et pose de vitrages',
    materials: ['Verre feuilleté grand format', 'Garde-corps verre', 'Manutention sécurisée'],
    description:
      'Déchargement et manutention de vitrages grand format : quatre poseurs en gilets CRISTALU transfèrent les panneaux du camion à la zone de pose, en toute sécurité.',
    image: 'real-manutention-verre-1',
    photos: ['real-manutention-verre-1'],
    location: null,
    span: 'normal',
  },
  {
    id: 'flotte-intervention',
    title: 'Notre flotte d’intervention',
    category: 'Logistique',
    type: 'Utilitaires CRISTALU sur chantier',
    materials: ['Livraison de matériel', 'Intervention sur site', 'Équipes de pose'],
    description:
      'Nos équipes interviennent avec leur matériel directement sur les chantiers : des utilitaires aux couleurs CRISTALU, équipés pour la livraison, la pose et les finitions.',
    image: 'real-flotte-1',
    photos: ['real-flotte-1', 'real-flotte-2'],
    location: null,
    span: 'wide',
  },
]
