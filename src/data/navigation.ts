export type NavItem = { label: string; href: string }

export const navItems: NavItem[] = [
  { label: 'Accueil', href: '#accueil' },
  { label: 'À propos', href: '#a-propos' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'Réalisations', href: '#realisations' },
  { label: 'Configurateur', href: '#configurateur' },
  { label: 'Notre expertise', href: '#expertise' },
  { label: 'Contact', href: '#contact' },
]

/** Sections observées pour la surbrillance du menu (ordre du document). */
export const sectionIds = [
  'accueil',
  'a-propos',
  'experience-3d',
  'solutions',
  'transformation',
  'realisations',
  'configurateur',
  'expertise',
  'architecture',
  'zone',
  'contact',
] as const
