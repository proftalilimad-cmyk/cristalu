/**
 * Test de fumée : rend l'application complète dans un DOM simulé (jsdom) et
 * vérifie que le contenu clé est bien présent. Aucun navigateur requis.
 * Le canvas 3D bascule automatiquement sur son repli (WebGL indisponible).
 *
 *   npm run smoke
 */
import { JSDOM } from 'jsdom'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const dom = new JSDOM('<!doctype html><html lang="fr"><body><div id="root"></div></body></html>', {
  url: 'http://localhost:5173/',
  pretendToBeVisual: true,
})

const { window } = dom

function stub(target, key, value) {
  Object.defineProperty(target, key, { value, writable: true, configurable: true })
}

stub(window, 'matchMedia', (query) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener() {},
  removeEventListener() {},
  addListener() {},
  removeListener() {},
  dispatchEvent: () => false,
}))
stub(window, 'IntersectionObserver', class {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
})
stub(window, 'ResizeObserver', class {
  observe() {}
  unobserve() {}
  disconnect() {}
})
stub(window, 'scrollTo', () => {})
stub(window, 'requestAnimationFrame', (cb) => setTimeout(() => cb(Date.now()), 16))
stub(window, 'cancelAnimationFrame', (id) => clearTimeout(id))
stub(window, 'WebGLRenderingContext', undefined)
Object.defineProperty(window.HTMLCanvasElement.prototype, 'getContext', {
  value: () => null,
  writable: true,
  configurable: true,
})

globalThis.window = window
globalThis.document = window.document
Object.defineProperty(globalThis, 'navigator', { value: window.navigator, configurable: true, writable: true })
globalThis.HTMLElement = window.HTMLElement
globalThis.HTMLCanvasElement = window.HTMLCanvasElement
globalThis.Element = window.Element
globalThis.Node = window.Node
globalThis.requestAnimationFrame = window.requestAnimationFrame
globalThis.cancelAnimationFrame = window.cancelAnimationFrame
globalThis.matchMedia = window.matchMedia
globalThis.IntersectionObserver = window.IntersectionObserver
globalThis.ResizeObserver = window.ResizeObserver
globalThis.getComputedStyle = window.getComputedStyle
globalThis.self = window

const { render } = await import(path.join(root, '.smoke/entry.js'))
const html = render()

const expectations = [
  'CRISTALU',
  'Menuiserie Aluminium &amp; PVC sur mesure au Maroc',
  'L’aluminium en mouvement',
  'L’atelier',
  'Menuiserie Aluminium',
  'Menuiserie PVC',
  'Baies vitrées',
  'Pergolas',
  'Garde-corps',
  'Volets roulants',
  'Miroiterie',
  'Noir mat',
  'Anthracite',
  'Gris aluminium',
  'Double vitrage',
  'Réfléchissant',
  'Contact',
  // Slider « en images » intégré au hero
  'L’intérieur ouvert sur le jardin',
  'film-sejour-1600.webp',
  // Carte du Maroc : contour réel + villes accessibles
  'Carte du Maroc',
  'Royaume du Maroc',
  'Natural Earth',
]

const missing = expectations.filter((needle) => !html.includes(needle))
if (missing.length) {
  console.error('❌ Contenu manquant dans le rendu :\n' + missing.map((m) => ` • ${m}`).join('\n'))
  process.exit(1)
}

for (const city of ['Tanger', 'Casablanca', 'Agadir', 'Oujda', 'Marrakech']) {
  if (!html.includes(city)) {
    console.error(`❌ Ville absente de la carte : ${city}`)
    process.exit(1)
  }
}

if (!/M14 14L|M\d+(\.\d+)? \d/.test(html)) {
  console.error('❌ Tracé de la carte du Maroc introuvable dans le rendu')
  process.exit(1)
}

if (/<img[^>]+src=""|undefined/.test(html)) {
  console.warn('⚠️  Attribut vide détecté (src / valeur undefined)')
}

console.log(
  `✅ Rendu complet sans erreur — ${(html.length / 1024).toFixed(0)} Ko de HTML, ${expectations.length} vérifications passées.`,
)
