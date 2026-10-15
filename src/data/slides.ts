/**
 * Slides du « film » CRISTALUM — décor cinématique du hero (section Hero).
 *
 * `video` : chemin d'un fichier mp4 réel (ex. '/videos/film-sejour.mp4').
 * Déposez vos rushs dans `public/videos/` puis renseignez le champ — tant que
 * `video` est null, le slider utilise l'image avec un mouvement « Ken Burns ».
 * Aucune URL vidéo inventée n'est publiée.
 */

export type FilmSlide = {
  id: string
  /** Base d'image produite par `npm run images` (public/images/<base>-800|1600.webp) */
  name: 'film-sejour' | 'film-detail' | 'film-terrasse' | 'film-nuit'
  /** Chemin du mp4 réel — null tant que la vidéo n'existe pas */
  video: string | null
  eyebrow: string
  title: string
  caption: string
  objectPosition?: string
}

export const filmSlides: FilmSlide[] = [
  {
    id: 'sejour',
    name: 'film-sejour',
    video: null,
    eyebrow: 'Baies coulissantes',
    title: 'L’intérieur ouvert sur le jardin',
    caption:
      'Baies coulissantes aluminium toute hauteur, seuils affleurants, grand vitrage : la lumière traverse la maison.',
    objectPosition: 'center 58%',
  },
  {
    id: 'detail',
    name: 'film-detail',
    video: null,
    eyebrow: 'Savoir-faire',
    title: 'Le détail qui change tout',
    caption:
      'Profilés à rupture de pont thermique, quincaillerie de précision, assemblages millimétrés — la qualité se voit de près.',
    objectPosition: 'center 50%',
  },
  {
    id: 'terrasse',
    name: 'film-terrasse',
    video: null,
    eyebrow: 'Pergolas & garde-corps',
    title: 'Vivre dehors, à l’abri du soleil',
    caption:
      'Pergolas bioclimatiques et garde-corps verre pensés pour la lumière et le climat marocains.',
    objectPosition: 'center 55%',
  },
  {
    id: 'nuit',
    name: 'film-nuit',
    video: null,
    eyebrow: 'Façades',
    title: 'La villa, éclairée par le verre',
    caption:
      'Menuiseries slim et grand vitrage : des façades qui respirent, du plein jour jusqu’à la nuit.',
    objectPosition: 'center 50%',
  },
]

/** Durée d'affichage d'une slide (ms) */
export const FILM_DURATION = 7000
