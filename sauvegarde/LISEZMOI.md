# Sauvegarde — site Cristalu

Dossier de sauvegarde du site. Il contient une copie figée du projet à une date
donnée, indépendante de l'historique Git.

## Contenu

| Élément | Taille | Ce qu'il contient | Suivi par Git |
| --- | --- | --- | --- |
| `2026-09-28-site/` | ~8 Mo | **Le site complet prêt à réinstaller** : code source (`src/`), visuels optimisés (`public/media/`), scripts, configuration, `README.md`, logo officiel (`assets/brand/`) | ✅ oui |
| `2026-09-28-cristalu-complet.zip` | ~57 Mo | **Tout**, y compris les **sources d'images haute résolution** (`assets/img/`, `assets/hero/`) qui servent à régénérer les variantes web | ❌ non (trop lourd pour Git, mais présent dans l'espace de travail et téléchargeable) |

Ne sont volontairement pas sauvegardés : `node_modules/` (réinstallable avec
`npm install`) et `dist/` (regénérable avec `npm run build`).

## Restaurer la sauvegarde

```bash
# 1. copier la sauvegarde dans un dossier vide
cp -r sauvegarde/2026-09-28-site mon-site && cd mon-site
#    (ou : unzip sauvegarde/2026-09-28-cristalu-complet.zip -d mon-site)

# 2. réinstaller les dépendances
npm install

# 3. lancer en local
npm run dev            # http://localhost:5173

# 4. produire la version de mise en ligne
npm run build          # résultat dans dist/
```

Si vous repartez du ZIP complet, vous pouvez aussi régénérer toutes les
variantes d'images (WebP 480/800/1408 + JPEG de repli + LQIP + manifeste des
dimensions) avec :

```bash
bash scripts/optimize-images.sh
```

## Autres sauvegardes existantes

- **GitHub** : tout l'historique du projet est poussé sur la branche
  `arena/01a0e357-cristalu` du dépôt `proftalilimad-cmyk/cristalu`.
  C'est la sauvegarde de référence, avec l'historique complet des versions.
- **Espace de travail** : les fichiers du projet sont conservés automatiquement
  entre les sessions (sauf `node_modules/` et `dist/`).

## Conseil

Refaites une sauvegarde datée avant chaque grosse modification :

```bash
DATE=$(date +%F)
mkdir -p "sauvegarde/$DATE-site"
cp -r src public scripts index.html package*.json tsconfig*.json vite.config.ts README.md "sauvegarde/$DATE-site/"
zip -qr "sauvegarde/$DATE-cristalu-complet.zip" src public scripts assets index.html package*.json tsconfig*.json vite.config.ts README.md
```
