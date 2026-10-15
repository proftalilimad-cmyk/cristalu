/**
 * Réalisations / inspirations.
 *
 * ⚠️ Les visuels actuellement fournis sont des images d'illustration
 * (architecturales). Remplacez `image` par vos vraies photos de chantier et
 * renseignez `location` : tant que `location` vaut `null`, la fiche projet
 * affiche « Communiquée sur demande » (confidentialité client) plutôt qu'une
 * ville inventée.
 */
import type { ImageBase } from '@/components/ui/SmartImage'

export type ProjectCategory =
  | 'Aluminium'
  | 'PVC'
  | 'Baies vitrées'
  | 'Portes'
  | 'Fenêtres'
  | 'Pergolas'
  | 'Garde-corps'
  | 'Volets'
  | 'Vitrerie'

export const projectCategories: ProjectCategory[] = [
  'Aluminium',
  'PVC',
  'Baies vitrées',
  'Portes',
  'Fenêtres',
  'Pergolas',
  'Garde-corps',
  'Volets',
  'Vitrerie',
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
  /** Nom de base de l'image (voir `npm run images`) */
  image: ImageBase
  /** Ville — `null` ⇒ « communiquée sur demande » */
  location: string | null
  /** Format d'affichage dans la galerie masonry */
  span: 'tall' | 'wide' | 'normal'
  year?: string
}

export const projects: Project[] = [
  {
    id: 'baie-coulissante-sejour',
    title: 'Baie coulissante sur séjour ouvert',
    category: 'Baies vitrées',
    type: 'Coulissant 4 vantaux, seuil affleurant',
    materials: ['Aluminium à rupture de pont thermique', 'Double vitrage', 'Anthracite thermolaqué'],
    description:
      'Grande ouverture coulissante reliant le séjour à la terrasse : profilés fins, rail encastré au sol pour un seuil affleurant, vitrage à isolation renforcée.',
    image: 'service-baie',
    location: null,
    span: 'wide',
  },
  {
    id: 'menuiserie-villa-contemporaine',
    title: 'Menuiserie extérieure de villa contemporaine',
    category: 'Aluminium',
    type: 'Ensemble fenêtres, portes et coulissants',
    materials: ['Aluminium thermolaqué', 'Quincaillerie de précision'],
    description:
      'Unité de gamme et de teinte sur l’ensemble des baies : profils fins, coupes d’onglet nettes, alignement rigoureux des traverses.',
    image: 'service-aluminium',
    location: null,
    span: 'tall',
  },
  {
    id: 'fenetres-pvc-residentiel',
    title: 'Fenêtres PVC série résidentielle',
    category: 'PVC',
    type: 'Fenêtres 2 vantaux, ouvrant à la française',
    materials: ['PVC multi-chambres', 'Double vitrage', 'Blanc'],
    description:
      'Remplacement complet des menuiseries d’un logement : isolation thermique et acoustique améliorée, entretien minimal.',
    image: 'service-pvc',
    location: null,
    span: 'normal',
  },
  {
    id: 'pergola-terrasse',
    title: 'Pergola bioclimatique sur terrasse',
    category: 'Pergolas',
    type: 'Pergola aluminium à lames orientables',
    materials: ['Aluminium anthracite', 'Lames orientables', 'Fixations traversantes'],
    description:
      'Ombre maîtrisée à toute heure : lames orientables motorisées, structure dimensionnée pour l’exposition au vent et au soleil.',
    image: 'service-pergola',
    location: null,
    span: 'normal',
  },
  {
    id: 'garde-corps-verre',
    title: 'Garde-corps verre & aluminium',
    category: 'Garde-corps',
    type: 'Garde-corps verre feuilleté, profil bas',
    materials: ['Verre feuilleté trempé', 'Profil aluminium anodisé'],
    description:
      'Protection transparente sur balcon : verre feuilleté, profil de base aluminium et main courante fine, sécurité discrète.',
    image: 'service-garde-corps',
    location: null,
    span: 'tall',
  },
  {
    id: 'volets-roulants-alu',
    title: 'Volets roulants aluminium isolés',
    category: 'Volets',
    type: 'Volets roulants à lames isolées',
    materials: ['Aluminium', 'Lames injectées', 'Motorisation'],
    description:
      'Confort thermique et obscurcissement progressif : lames isolées, coffre intégré et commande centralisée.',
    image: 'service-volets',
    location: null,
    span: 'normal',
  },
  {
    id: 'miroiterie-salle-de-bain',
    title: 'Miroiterie & paroi de douche',
    category: 'Vitrerie',
    type: 'Miroir sur mesure + verre trempé',
    materials: ['Miroir', 'Verre trempé 8 mm', 'Profil aluminium'],
    description:
      'Miroirs découpés sur mesure et paroi de douche en verre trempé aux chants polis : la précision jusque dans les détails.',
    image: 'service-miroiterie',
    location: null,
    span: 'normal',
  },
  {
    id: 'facade-villa-archi',
    title: 'Façade vitrée de villa',
    category: 'Baies vitrées',
    type: 'Façades vitrées & profilés verticaux',
    materials: ['Aluminium anthracite', 'Vitrage de sécurité'],
    description:
      'Lecture continue de la façade : montants fins, traverses alignées et transparence maximale sur le jardin.',
    image: 'arch-villa',
    location: null,
    span: 'wide',
  },
]
