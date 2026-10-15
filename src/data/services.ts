import type { LucideIcon } from 'lucide-react'
import {
  PanelsTopLeft,
  DoorOpen,
  Maximize2,
  Umbrella,
  Fence,
  Blinds,
  Sparkles,
} from 'lucide-react'

import type { ImageBase } from '@/components/ui/SmartImage'

export type ServiceId =
  | 'aluminium'
  | 'pvc'
  | 'baies'
  | 'pergolas'
  | 'garde-corps'
  | 'volets'
  | 'miroiterie'

export type Service = {
  id: ServiceId
  index: string
  title: string
  short: string
  description: string
  icon: LucideIcon
  /** Nom de base de l'image (voir `<SmartImage />` et `npm run images`) */
  image: ImageBase
  features: string[]
  applications: string[]
}

export const services: Service[] = [
  {
    id: 'aluminium',
    index: '01',
    title: 'Menuiserie Aluminium',
    short: 'Fenêtres, portes, baies vitrées, coulissants et solutions aluminium sur mesure.',
    description:
      'Profils aluminium à rupture de pont thermique, coupes d’onglet millimétrées et quincaillerie de précision : nous fabriquons la menuiserie qui structure votre façade.',
    icon: PanelsTopLeft,
    image: 'service-aluminium',
    features: ['Rupture de pont thermique', 'Coulissants & battants', 'Finitions anodisées & thermolaquées'],
    applications: ['Villas', 'Appartements', 'Bureaux', 'Commerces'],
  },
  {
    id: 'pvc',
    index: '02',
    title: 'Menuiserie PVC',
    short: 'Fenêtres et portes PVC offrant une excellente isolation thermique et acoustique.',
    description:
      'Le PVC multi-chambres associe performance d’isolation, entretien minimal et rapport qualité/prix maîtrisé — idéal pour les projets résidentiels exposés au climat méditerranéen.',
    icon: DoorOpen,
    image: 'service-pvc',
    features: ['Isolation thermique & acoustique', 'Entretien minimal', 'Double vitrage performant'],
    applications: ['Résidentiel', 'Locatif', 'Rénovation'],
  },
  {
    id: 'baies',
    index: '03',
    title: 'Baies vitrées',
    short: 'Grandes ouvertures vitrées pour maximiser la lumière naturelle.',
    description:
      'Coulissants à galandage, châssis XXL, vitrages de sécurité et seuils affleurants : ouvrez les volumes sur la terrasse, le jardin ou la vue.',
    icon: Maximize2,
    image: 'service-baie',
    features: ['Grandes dimensions', 'Seuil affleurant', 'Verre de sécurité feuilleté'],
    applications: ['Séjours', 'Terrasses', 'Restaurants', 'Showrooms'],
  },
  {
    id: 'pergolas',
    index: '04',
    title: 'Pergolas',
    short: 'Solutions modernes pour terrasses et espaces extérieurs.',
    description:
      'Pergolas aluminium à lames orientables, bioclimatiques ou fixes : vous gardez la lumière, vous maîtrisez le soleil.',
    icon: Umbrella,
    image: 'service-pergola',
    features: ['Lames orientables', 'Structure aluminium', 'Protection solaire maîtrisée'],
    applications: ['Terrasses', 'Rooftops', 'Piscines', 'Jardins'],
  },
  {
    id: 'garde-corps',
    index: '05',
    title: 'Garde-corps',
    short: 'Garde-corps aluminium et verre pour balcons, escaliers et terrasses.',
    description:
      'Sécurité normalisée et transparence : verre feuilleté, profil aluminium anodisé et lignes fines qui laissent passer la lumière.',
    icon: Fence,
    image: 'service-garde-corps',
    features: ['Verre feuilleté', 'Profil aluminium anodisé', 'Balcons, escaliers, terrasses'],
    applications: ['Balcons', 'Escaliers', 'Terrasses', 'Mezzanines'],
  },
  {
    id: 'volets',
    index: '06',
    title: 'Volets roulants',
    short: 'Protection solaire, sécurité et confort.',
    description:
      'Volets roulants aluminium à lames isolées, motorisation et commande centralisée : confort thermique été comme hiver.',
    icon: Blinds,
    image: 'service-volets',
    features: ['Lames isolées', 'Motorisation & commande', 'Occultation progressive'],
    applications: ['Chambres', 'Séjours', 'Bureaux'],
  },
  {
    id: 'miroiterie',
    index: '07',
    title: 'Miroiterie & Vitrerie',
    short: 'Solutions vitrées adaptées aux projets résidentiels et professionnels.',
    description:
      'Miroirs sur mesure, cabines de douche, crédences, vitrines et remplacement de vitrage : la précision du verre, jusqu’au détail.',
    icon: Sparkles,
    image: 'service-miroiterie',
    features: ['Miroirs sur mesure', 'Verre trempé & feuilleté', 'Vitrerie & remplacement'],
    applications: ['Salles de bain', 'Commerces', 'Bureaux', 'Dressing'],
  },
]
