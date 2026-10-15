/**
 * Preuve visuelle de la carte : reproduit le rendu SVG de la section
 * « Zone d'intervention » (contour + étiquettes) et produit un PNG.
 * Outil de contrôle interne, non déployé.
 */
import sharp from 'sharp'
import { readFile } from 'node:fs/promises'

const { MOROCCO_PATH, MOROCCO_VIEWBOX, CITY_XY } = await import('../.mapgeo/moroccoGeo.js')
const { cities } = await import('../.mapgeo/cities.js')

const FONT = 30
const GAP = 18

function labelAnchor(side, x, y) {
  switch (side) {
    case 'left':
      return { x: x - GAP, y: y + FONT * 0.35, anchor: 'end' }
    case 'right':
      return { x: x + GAP, y: y + FONT * 0.35, anchor: 'start' }
    case 'above':
      return { x, y: y - GAP * 0.7, anchor: 'middle' }
    default:
      return { x, y: y + GAP * 1.6, anchor: 'middle' }
  }
}

const dots = cities
  .map((city) => {
    const [x, y] = CITY_XY[city.id]
    const a = labelAnchor(city.label, x, y)
    return `
  <circle cx="${x}" cy="${y}" r="11" fill="#2d6c85" stroke="#fff" stroke-width="4"/>
  <text x="${a.x}" y="${a.y}" font-size="${FONT}" font-family="DejaVu Sans, sans-serif" text-anchor="${a.anchor}" fill="#0b0d10">${city.name}</text>`
  })
  .join('')

const template = await readFile(new URL('../.mapgeo/template.svg', import.meta.url), 'utf8')
const svg = template.replace('__PATH__', MOROCCO_PATH).replace('__DOTS__', dots)
await sharp(Buffer.from(svg)).png().toFile('.mapgeo/morocco-check.png')
console.log('rendu → .mapgeo/morocco-check.png ·', MOROCCO_VIEWBOX)
