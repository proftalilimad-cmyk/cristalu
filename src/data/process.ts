import type { LucideIcon } from 'lucide-react'
import { MessagesSquare, Ruler, DraftingCompass, Factory, Wrench, LifeBuoy } from 'lucide-react'

export type ProcessStep = {
  index: string
  title: string
  description: string
  icon: LucideIcon
  detail: string
}

export const processSteps: ProcessStep[] = [
  {
    index: '01',
    title: 'Conseil',
    description:
      'Nous écoutons votre projet, vos contraintes et vos envies : usage, exposition, style, budget.',
    detail: 'Choix des gammes, du vitrage et des finitions adaptés à votre façade.',
    icon: MessagesSquare,
  },
  {
    index: '02',
    title: 'Prise de mesures',
    description: 'Relevé précis sur site pour garantir un ajustement exact à vos tableaux.',
    detail: 'Vérification des niveaux, aplombs, seuils et points de fixation.',
    icon: Ruler,
  },
  {
    index: '03',
    title: 'Conception',
    description: 'Plans, élévations et détails techniques validés avec vous avant fabrication.',
    detail: 'Ouvertures, sens de manœuvre, quincaillerie et type de vitrage.',
    icon: DraftingCompass,
  },
  {
    index: '04',
    title: 'Fabrication',
    description: 'Fabrication sur mesure en atelier : coupes, assemblages et contrôles.',
    detail: 'Assemblage, étanchéité, réglages de quincaillerie et contrôle qualité.',
    icon: Factory,
  },
  {
    index: '05',
    title: 'Installation',
    description: 'Pose soignée par nos équipes, dans le respect de votre planning de chantier.',
    detail: 'Calage, fixations, calfeutrement, réglages et nettoyage du chantier.',
    icon: Wrench,
  },
  {
    index: '06',
    title: 'Suivi',
    description: 'Réglages, entretien et accompagnement après installation.',
    detail: 'Conseils d’entretien et intervention en cas de besoin.',
    icon: LifeBuoy,
  },
]

/** Faits vérifiables directement sur ce site (utilisés pour les compteurs). */
export const verifiedFacts = {
  processSteps: processSteps.length,
  serviceFamilies: 7,
  aluminiumFinishes: 5,
  glassTypes: 4,
} as const
