import type { LucideIcon } from 'lucide-react'
import {
  MoveHorizontal,
  Columns3,
  DoorClosed,
  DoorOpen,
  Warehouse,
  Fence,
  Blinds,
  Sparkles,
  Maximize2,
} from 'lucide-react'

/* ------------------------------------------------------------------ *
 *  Finitions aluminium (couleurs de profilés)
 * ------------------------------------------------------------------ */
export type FinishId = 'noir-mat' | 'anthracite' | 'blanc' | 'gris-alu' | 'bronze'

export type Finish = {
  id: FinishId
  label: string
  swatch: string
  /** Réglages matériau three.js */
  metalness: number
  roughness: number
  clearcoat: number
  note: string
}

export const finishes: Finish[] = [
  {
    id: 'noir-mat',
    label: 'Noir mat',
    swatch: '#15181c',
    metalness: 0.82,
    roughness: 0.52,
    clearcoat: 0.25,
    note: 'Thermolaqué mat — lecture architecturale, reflets contenus.',
  },
  {
    id: 'anthracite',
    label: 'Anthracite',
    swatch: '#3b4349',
    metalness: 0.86,
    roughness: 0.42,
    clearcoat: 0.4,
    note: 'La teinte signature des façades contemporaines.',
  },
  {
    id: 'blanc',
    label: 'Blanc',
    swatch: '#eef1f2',
    metalness: 0.35,
    roughness: 0.5,
    clearcoat: 0.3,
    note: 'Lumineux, intemporel, valorise les intérieurs clairs.',
  },
  {
    id: 'gris-alu',
    label: 'Gris aluminium',
    swatch: '#9ba3a9',
    metalness: 0.97,
    roughness: 0.24,
    clearcoat: 0.5,
    note: 'Aspect anodisé brossé — métal à l’état pur.',
  },
  {
    id: 'bronze',
    label: 'Bronze',
    swatch: '#6d4f31',
    metalness: 0.88,
    roughness: 0.36,
    clearcoat: 0.45,
    note: 'Chaleur du métal, écho discret aux teintes marocaines.',
  },
]

/* ------------------------------------------------------------------ *
 *  Types de vitrage
 * ------------------------------------------------------------------ */
export type GlassId = 'transparent' | 'fume' | 'reflechissant' | 'double'

export type GlassType = {
  id: GlassId
  label: string
  /** Couleur de teinte du verre */
  tint: string
  /** Transmission (0 → 1) */
  transmission: number
  roughness: number
  opacity: number
  reflectivity: number
  double: boolean
  note: string
}

export const glassTypes: GlassType[] = [
  {
    id: 'transparent',
    label: 'Transparent',
    tint: '#eef1f3',
    transmission: 0.98,
    roughness: 0.02,
    opacity: 0.16,
    reflectivity: 0.4,
    double: false,
    note: 'Clarté maximale, lumière naturelle intégrale.',
  },
  {
    id: 'fume',
    label: 'Fumé',
    tint: '#4a4f55',
    transmission: 0.55,
    roughness: 0.06,
    opacity: 0.44,
    reflectivity: 0.55,
    double: false,
    note: 'Filtre la lumière et réduit l’éblouissement.',
  },
  {
    id: 'reflechissant',
    label: 'Réfléchissant',
    tint: '#c7ced2',
    transmission: 0.32,
    roughness: 0.015,
    opacity: 0.5,
    reflectivity: 0.98,
    double: false,
    note: 'Effet miroir côté extérieur, intimité préservée.',
  },
  {
    id: 'double',
    label: 'Double vitrage',
    tint: '#e8ecee',
    transmission: 0.86,
    roughness: 0.03,
    opacity: 0.2,
    reflectivity: 0.5,
    double: true,
    note: 'Lame d’air isolante : confort thermique et acoustique.',
  },
]

/* ------------------------------------------------------------------ *
 *  Produits proposés dans le configurateur
 * ------------------------------------------------------------------ */
export type ConfiguratorProductId =
  | 'fenetre-coulissante'
  | 'fenetre-battante'
  | 'baie-vitree'
  | 'porte-coulissante'
  | 'porte-entree'
  | 'pergola'
  | 'garde-corps'
  | 'volet-roulant'
  | 'miroiterie'

export type ConfiguratorProduct = {
  id: ConfiguratorProductId
  label: string
  icon: LucideIcon
  /** Matériaux possibles pour ce produit */
  materials: Array<'aluminium' | 'pvc'>
  /** Nombre de vantaux sélectionnables */
  panels: number[]
  /** Le mode 3D de prévisualisation */
  preview: 'sliding' | 'casement' | 'rail' | 'panel'
  description: string
}

export const configuratorProducts: ConfiguratorProduct[] = [
  {
    id: 'fenetre-coulissante',
    label: 'Fenêtre coulissante',
    icon: MoveHorizontal,
    materials: ['aluminium', 'pvc'],
    panels: [2, 3, 4],
    preview: 'sliding',
    description: 'Deux à quatre vantaux coulissants, idéal pour gagner de la place.',
  },
  {
    id: 'fenetre-battante',
    label: 'Fenêtre battante',
    icon: Columns3,
    materials: ['aluminium', 'pvc'],
    panels: [1, 2],
    preview: 'casement',
    description: 'Ouverture à la française, une ou deux vantaux.',
  },
  {
    id: 'baie-vitree',
    label: 'Baie vitrée',
    icon: Maximize2,
    materials: ['aluminium'],
    panels: [2, 3, 4],
    preview: 'sliding',
    description: 'Grandes dimensions, seuil affleurant, lumière maximale.',
  },
  {
    id: 'porte-coulissante',
    label: 'Porte coulissante',
    icon: DoorClosed,
    materials: ['aluminium', 'pvc'],
    panels: [1, 2, 3],
    preview: 'sliding',
    description: 'Coulissement latéral ou à galandage dans la cloison.',
  },
  {
    id: 'porte-entree',
    label: 'Porte d’entrée',
    icon: DoorOpen,
    materials: ['aluminium'],
    panels: [1, 2],
    preview: 'casement',
    description: 'Porte d’entrée aluminium, sécurité et personnalité.',
  },
  {
    id: 'pergola',
    label: 'Pergola',
    icon: Warehouse,
    materials: ['aluminium'],
    panels: [1, 2],
    preview: 'rail',
    description: 'Structure aluminium à lames fixes ou orientables.',
  },
  {
    id: 'garde-corps',
    label: 'Garde-corps',
    icon: Fence,
    materials: ['aluminium'],
    panels: [1, 2, 3],
    preview: 'panel',
    description: 'Verre feuilleté et profil aluminium anodisé.',
  },
  {
    id: 'volet-roulant',
    label: 'Volet roulant',
    icon: Blinds,
    materials: ['aluminium', 'pvc'],
    panels: [1, 2],
    preview: 'panel',
    description: 'Lames isolées, manuel ou motorisé.',
  },
  {
    id: 'miroiterie',
    label: 'Miroiterie / Vitrerie',
    icon: Sparkles,
    materials: ['aluminium'],
    panels: [1],
    preview: 'panel',
    description: 'Miroirs sur mesure, verre trempé et vitrerie.',
  },
]

/* ------------------------------------------------------------------ *
 *  Villes du configurateur & du formulaire
 * ------------------------------------------------------------------ */
export const projectCities = [
  'Tanger',
  'Casablanca',
  'Rabat',
  'Marrakech',
  'Agadir',
  'Fès',
  'Meknès',
  'Oujda',
  'Kénitra',
  'Autre ville',
] as const

export const installationOptions = [
  'Installation par CRISTALU (pose comprise)',
  'Fourniture seule (sans pose)',
  'Rénovation / remplacement d’un existant',
  'Projet neuf en construction',
  'À définir avec votre équipe',
] as const

export const projectTypes = [
  ...configuratorProducts.map((p) => p.label),
  'Projet mixte / plusieurs produits',
] as const

/* ------------------------------------------------------------------ *
 *  Demande de devis — structure envoyée à l'entreprise
 * ------------------------------------------------------------------ */
export type QuoteRequest = {
  source: 'configurateur' | 'formulaire'
  createdAt: string
  product?: string
  material?: string
  width?: number
  height?: number
  finish?: string
  glass?: string
  panels?: number
  city?: string
  installation?: string
  name?: string
  phone?: string
  email?: string
  message?: string
  files?: { name: string; size: number; type: string }[]
  /** Texte lisible généré pour WhatsApp / e-mail */
  summary: string
}

/** Génère un récapitulatif structuré (WhatsApp, e-mail, API). */
export function buildSummary(r: Omit<QuoteRequest, 'summary'>): string {
  const rows: Array<[string, string | number | undefined | null]> = [
    ['Origine', r.source === 'configurateur' ? 'Configurateur en ligne' : 'Formulaire de devis'],
    ['Produit', r.product],
    ['Matériau', r.material],
    ['Dimensions', r.width && r.height ? `${r.width} × ${r.height} cm` : undefined],
    ['Finition', r.finish],
    ['Vitrage', r.glass],
    ['Vantaux', r.panels],
    ['Ville', r.city],
    ['Installation', r.installation],
    ['Nom', r.name],
    ['Téléphone', r.phone],
    ['E-mail', r.email],
  ]
  const lines = rows
    .filter(([, v]) => v !== undefined && v !== null && String(v).length > 0)
    .map(([k, v]) => `• ${k} : ${v}`)
  if (r.files?.length) {
    lines.push(`• Fichiers joints (${r.files.length}) : ${r.files.map((f) => f.name).join(', ')}`)
  }
  if (r.message) lines.push(`• Message : ${r.message}`)
  return lines.join('\n')
}
