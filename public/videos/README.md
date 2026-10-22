# Vidéos pour le Slider Hero — CRISTALU MAROC

Déposez vos fichiers MP4 ici :

```
public/videos/
  cristalu-showroom.mp4   ← vidéo principale du hero (recommandé: 1920x1080, < 8 Mo, H.264)
  cristalu-atelier.mp4    ← optionnel, 2e slide vidéo
```

Puis éditez `src/data/slides.ts` :

```ts
{
  id: 'showroom',
  name: 'usine',
  video: '/videos/cristalu-showroom.mp4', // ← chemin vers votre mp4
  eyebrow: 'Showroom',
  title: 'Notre showroom à Kénitra',
  caption: '...',
}
```

Le slider :
- Autoplay muet en boucle (respecte autoplay policy mobile)
- Bouton son (Volume) active le son au tap
- Fallback image si vidéo non chargée
- Barre de progression synchronisée
