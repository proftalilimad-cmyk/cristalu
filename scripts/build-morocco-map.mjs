/**
 * Génère la carte du Maroc à partir de données géographiques réelles
 * (Natural Earth via le paquet `world-atlas`, résolution 1:50m).
 *
 *   npm run map
 *
 * Produit `src/data/moroccoGeo.ts` :
 *   · MOROCCO_VIEWBOX  — dimensions du viewBox SVG
 *   · MOROCCO_PATH     — contour du Royaume (Maroc + Sahara, fusionnés)
 *   · CITY_XY          — coordonnées projetées de chaque ville
 *
 * Projection : Mercator, ajustée aux limites du territoire dans le viewBox
 * (aucune coordonnée « à la main » : tout est calculé).
 */
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createRequire } from 'node:module'
import { merge } from 'topojson-client'

const require = createRequire(import.meta.url)
const root = path.resolve(import.meta.dirname, '..')

/** Résolution du fond de carte : 50m = bon compromis détail / poids. */
const topology = require('world-atlas/countries-50m.json')

/* Identifiants Natural Earth : Maroc (504) + Sahara occidental (732).
   Les deux sont fusionnés pour représenter le Royaume dans son intégralité. */
const MOROCCO_IDS = new Set(['504', '732'])

const geometries = topology.objects.countries.geometries.filter((g) => MOROCCO_IDS.has(String(g.id)))
if (geometries.length === 0) throw new Error('Maroc introuvable dans la topologie')

const merged = merge(topology, geometries)

/* ------------------------------------------------------------------ *
 *  Projection Mercator → viewBox
 * ------------------------------------------------------------------ */
const OUT_WIDTH = 1000
const PAD = 14

/** Mercator conforme : les deux axes doivent être exprimés dans la même unité
    (radians) — sinon la carte est écrasée verticalement. */
const mercY = (latDeg) => Math.log(Math.tan(Math.PI / 4 + (latDeg * Math.PI) / 360))
const mercX = (lonDeg) => (lonDeg * Math.PI) / 180

function eachRing(geometry, cb) {
  const geometryList =
    geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.type === 'MultiPolygon' ? geometry.coordinates : []
  for (const polygon of geometryList) {
    // anneau extérieur + trous (enclaves) : tous tracés
    for (const ring of polygon) cb(ring)
  }
}

/* 1. Limites du territoire (dans l'espace projeté) */
let minX = Infinity
let maxX = -Infinity
let minY = Infinity
let maxY = -Infinity
eachRing(merged, (ring) => {
  for (const [lon, lat] of ring) {
    const x = mercX(lon)
    const y = -mercY(lat) // SVG : y vers le bas
    if (x < minX) minX = x
    if (x > maxX) maxX = x
    if (y < minY) minY = y
    if (y > maxY) maxY = y
  }
})

const spanX = maxX - minX
const spanY = maxY - minY
const scale = (OUT_WIDTH - PAD * 2) / spanX
const OUT_HEIGHT = Math.round(spanY * scale + PAD * 2)

const project = (lon, lat) => [
  PAD + (mercX(lon) - minX) * scale,
  PAD + (-mercY(lat) - minY) * scale,
]

/* 2. Tracé SVG */
const round = (n) => Math.round(n * 10) / 10
const parts = []
eachRing(merged, (ring) => {
  const pts = ring.map(([lon, lat]) => project(lon, lat).map(round))
  const d =
    'M' +
    pts.map(([x, y], i) => `${i === 0 ? '' : 'L'}${x},${y}`).join(' ')
  // Chaque anneau (contour + éventuelles enclaves) est fermé individuellement
  parts.push(`${d} Z`)
})
const MOROCCO_PATH = parts.join(' ')

/* 3. Villes (lat/lon réelles, projetées avec la même transformation) */
const CITIES = [
  { id: 'tanger', name: 'Tanger', lat: 35.7595, lon: -5.834 },
  { id: 'kenitra', name: 'Kénitra', lat: 34.261, lon: -6.5802 },
  { id: 'rabat', name: 'Rabat', lat: 34.0209, lon: -6.8416 },
  { id: 'casablanca', name: 'Casablanca', lat: 33.5731, lon: -7.5898 },
  { id: 'fes', name: 'Fès', lat: 34.0331, lon: -5.0003 },
  { id: 'meknes', name: 'Meknès', lat: 33.8935, lon: -5.5473 },
  { id: 'oujda', name: 'Oujda', lat: 34.6814, lon: -1.9086 },
  { id: 'marrakech', name: 'Marrakech', lat: 31.6295, lon: -7.9811 },
  { id: 'agadir', name: 'Agadir', lat: 30.4278, lon: -9.5981 },
]

/* Barre d'échelle : unités de viewBox pour 300 km au centre du territoire */
const MID_LAT = 31.6
const unitsPerDegLat = (mercY(MID_LAT + 0.5) - mercY(MID_LAT - 0.5)) * scale
const unitsPerKm = unitsPerDegLat / 111
const SCALE_BAR_KM = 300
const SCALE_BAR = { km: SCALE_BAR_KM, units: Math.round(SCALE_BAR_KM * unitsPerKm) }

const CITY_XY = Object.fromEntries(
  CITIES.map(({ id, lat, lon }) => {
    const [x, y] = project(lon, lat)
    return [id, [round(x), round(y)]]
  }),
)

/* 4. Emprise géographique (pour le graticule) */
let minLon = Infinity
let maxLon = -Infinity
let minLat = Infinity
let maxLat = -Infinity
eachRing(merged, (ring) => {
  for (const [lon, lat] of ring) {
    if (lon < minLon) minLon = lon
    if (lon > maxLon) maxLon = lon
    if (lat < minLat) minLat = lat
    if (lat > maxLat) maxLat = lat
  }
})

/* ------------------------------------------------------------------ *
 *  Écriture du module TypeScript
 * ------------------------------------------------------------------ */
const header = `/**
 * ⚠️ FICHIER GÉNÉRÉ — ne pas modifier à la main.
 * Régénérer avec :  npm run map
 *
 * Source : Natural Earth 1:50m (paquet \`world-atlas\`, domaine public),
 * géométries « Maroc » (504) et « Sahara occidental » (732) fusionnées.
 * Projection : Mercator, ajustée aux limites du territoire.
 */

/** Dimensions du viewBox SVG de la carte. */
export const MOROCCO_VIEWBOX = '0 0 ${OUT_WIDTH} ${OUT_HEIGHT}'

/** Contour du Royaume du Maroc. */
export const MOROCCO_PATH =
  '${MOROCCO_PATH}'

/** Coordonnées projetées des villes (mêmes unités que le viewBox). */
export const CITY_XY: Record<string, [number, number]> = {
${CITIES.map(({ id }) => `  ${id}: [${CITY_XY[id][0]}, ${CITY_XY[id][1]}],`).join('\n')}
}

/** Barre d'échelle (300 km) exprimée en unités du viewBox. */
export const SCALE_BAR = { km: ${SCALE_BAR.km}, units: ${SCALE_BAR.units} }

/* ------------------------------------------------------------------ *
 *  Projection inverse : convertir une coordonnée géographique en unités
 *  du viewBox (utilisée pour le graticule et les repères).
 * ------------------------------------------------------------------ */
const PAD = ${PAD}
const SCALE = ${scale}

/** Mercator : longitude → unités du viewBox. */
export const projectLon = (lon: number) => PAD + ((lon * Math.PI) / 180 + ${-minX}) * SCALE

/** Mercator : latitude → unités du viewBox. */
export const projectLat = (lat: number) =>
  PAD + (${-minY} - Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360))) * SCALE

/** Emprise géographique du tracé (degrés décimaux). */
export const GEO_BOUNDS = { lonMin: ${round(minLon)}, lonMax: ${round(maxLon)}, latMin: ${round(minLat)}, latMax: ${round(maxLat)} }

/** Latitude / longitude des villes — utile pour un futur rendu cartographique. */
export const CITY_GEO: Record<string, { lat: number; lon: number }> = {
${CITIES.map(({ id, lat, lon }) => `  ${id}: { lat: ${lat}, lon: ${lon} },`).join('\n')}
}
`

await writeFile(path.join(root, 'src/data/moroccoGeo.ts'), header, 'utf8')

const ringCount = MOROCCO_PATH.split('M').length - 1
console.log(
  `✅ src/data/moroccoGeo.ts généré\n` +
    `   viewBox ${OUT_WIDTH}×${OUT_HEIGHT} · ${ringCount} anneau(x) · ${MOROCCO_PATH.length} caractères\n` +
    `   villes projetées : ${Object.keys(CITY_XY).join(', ')}`,
)
