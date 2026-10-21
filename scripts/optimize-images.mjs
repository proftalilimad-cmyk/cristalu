/**
 * Pipeline d'images : convertit public/images/raw/*.jpg en WebP responsives
 * (800 / 1600 px) + miniature LQIP inline + image Open Graph 1200×630.
 *
 *   npm run images
 */
import { readdir, mkdir, writeFile, readFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve(import.meta.dirname, '..')
const rawDir = path.join(root, 'public/images/raw')
const outDir = path.join(root, 'public/images')

const HERO = 'hero-villa'

async function main() {
  await mkdir(outDir, { recursive: true })
  const files = (await readdir(rawDir)).filter((f) => /\.(jpe?g|png)$/i.test(f))
  const report = []

  for (const file of files) {
    const name = path.basename(file, path.extname(file))
    const src = path.join(rawDir, file)
    const image = sharp(src)
    const meta = await image.metadata()

    for (const width of [800, 1600]) {
      const out = path.join(outDir, `${name}-${width}.webp`)
      const info = await sharp(src)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: width === 800 ? 72 : 80, effort: 5 })
        .toFile(out)
      report.push(`${path.basename(out)} — ${info.width}×${info.height} (${(info.size / 1024).toFixed(0)} Ko)`)
    }

    // Miniature LQIP (base64) pour les fonds flous pendant le chargement
    const lqip = await sharp(src)
      .resize({ width: 24 })
      .webp({ quality: 40 })
      .toBuffer()
    await writeFile(
      path.join(outDir, `${name}-lqip.txt`),
      `data:image/webp;base64,${lqip.toString('base64')}`,
      'utf8',
    )
    report.push(`${name}-lqip.txt — ${(lqip.length / 1024).toFixed(1)} Ko (inline)`)
    void meta
  }

  // Image Open Graph / Twitter (1200×630)
  const heroSrc = path.join(rawDir, `${HERO}.jpg`)
  await sharp(heroSrc)
    .resize(1200, 630, { fit: 'cover', position: 'attention' })
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(path.join(outDir, 'og-cristalu.jpg'))
  report.push('og-cristalu.jpg — 1200×630')

  // Fond du hero (dégradé d'ambiance) — version très compressée pour mobile
  const heroBuffer = await readFile(path.join(outDir, `${HERO}-800.webp`))
  report.push(`hero 800 px : ${(heroBuffer.length / 1024).toFixed(0)} Ko`)

  console.log(report.join('\n'))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
