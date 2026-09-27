# Cristalu Maroc — site web

Site vitrine premium (expérience 3D + scroll cinématique) pour **Cristalu Maroc**,
spécialiste de la menuiserie **aluminium et PVC** : fenêtres, portes, baies vitrées
coulissantes, façades vitrées, vérandas et solutions sur mesure.

> ⚠️ Les coordonnées, chiffres et projets sont des **placeholders** clairement
> marqués (`À COMPLÉTER`). Rien n'a été inventé comme information factuelle.

---

## Charte graphique (extraite du logo officiel)

Le logo fourni (`assets/brand/logo-cristalu-maroc.pdf`) a été **vectorisé** :
ses tracés alimentent directement le composant `src/components/layout/Logo.tsx`
(`logoPaths.ts`), le favicon et les fichiers `public/logo-mark.svg` /
`public/logo-cristalu.svg`.

| Rôle | Couleur | Valeur | Origine |
| --- | --- | --- | --- |
| Noir de marque | ⬛ | `#111111` | logo (CMJN 91/79/62/97) |
| Rouge Cristalu | 🟥 | `#A30000` | logo (CMJN 22/100/100/18) |
| Rouge foncé (hover) | | `#7D0000` | dérivé |
| Rouge clair (fond sombre) | | `#D23434` | dérivé, lisibilité AA |
| Papier / off-white | | `#FAFAF9` | neutre architectural |
| Brume / gris clair | | `#F0F1F1` | neutre |
| Aluminium | | `#D7DADD` | neutre |
| Acier (texte secondaire) | | `#9AA0A5` | neutre |
| Graphite (texte courant) | | `#4A4F55` | neutre |

Le rouge est utilisé **comme couleur de signal uniquement** (CTA principaux,
filet sous les intitulés de section, filtres actifs, barre de progression,
puces de la timeline, curseur au survol, bouton WhatsApp) — jamais en aplat
massif, pour conserver le caractère architectural et minimal.
Le typogramme d'origine utilise la police **Nexa Light** ; l'interface utilise
Manrope (latin) et IBM Plex Sans Arabic (arabe), le logo restant vectoriel.

## Scène 3D (section Matériaux)

Le profilé aluminium n'est plus un simple tube : sa **coupe réelle** est décrite
dans `src/components/three/aluSection.json` et extrudée par Three.js —
coque extérieure avec jambe de vitrage, coque intérieure, **deux barrettes
polyamide (rupture de pont thermique)**, parclose clipsée, bouchon de vis,
joints EPDM, intercalaire et double vitrage. Les faces de coupe et les faces
longitudinales reçoivent deux matériaux distincts (aspect scié / anodisé),
avec éclairage studio, reflet balayant et ombre de contact.
Modifier la coupe = modifier le JSON, aucune retouche de code nécessaire.
Aperçu de contrôle : `assets/brand/profil-alu-coupe-reference.png`.

## Stack

| Domaine | Choix |
| --- | --- |
| Framework | React 19 + TypeScript + Vite 8 |
| Styles | Tailwind CSS v4 (design system dans `src/styles/index.css`) |
| Animation | GSAP + ScrollTrigger, Lenis (smooth scroll) |
| 3D | Three.js + React Three Fiber + Drei (géométries procédurales, zéro asset lourd) |
| Icônes | lucide-react |
| Routing | react-router-dom |

## Démarrage

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # build de production dans /dist
npm run preview  # prévisualisation du build
npm run lint
```

## Structure

```
assets/brand/            logo source (PDF) + rendu de référence
assets/                  PNG sources (haute résolution) + maquettes hero
public/media/            Images optimisées (WebP 480/800/1408 + JPG + LQIP)
public/robots.txt        SEO
public/sitemap.xml       SEO
scripts/optimize-images.sh  Régénère /public/media depuis /assets
src/
  content/               ⚙️ COUCHE CONTENU (CMS-ready)
    company.ts           coordonnées, horaires, réseaux — À COMPLÉTER
    products.ts          8 familles de produits
    projects.ts          réalisations (démo)
    services.ts          services, process, matériaux, engagements
    types.ts             types `Localized` (fr/ar/en)
    index.ts             `contentClient` : API async, prête à brancher un CMS
  i18n/                  dictionnaires FR/AR + provider (RTL automatique)
  lib/                   GSAP, Lenis, hooks (useGsap, useInView, useMediaQuery)
  components/
    layout/              header, menu plein écran, footer, curseur, progression, WhatsApp
    ui/                  Media (responsive/LQIP), boutons magnétiques, reveals…
    three/               MaterialsScene (profilés alu/PVC + vitrage en 3D)
    home/                les 11 sections de la home
    contact/             formulaire de devis
  pages/                 Home, Solutions, Produits (+détail), MOMO Box, Réalisations (+détail), À propos, Contact, 404
```

## Parcours de la page d'accueil

1. **Hero plein écran** — parallaxe + profondeur 3D à la souris, typographie ancrée.
2. **Matériaux 3D** — section épinglée : profilé aluminium, profilé PVC multi-chambres
   et double vitrage modélisés en Three.js, pilotés par le scroll et la souris.
   *Repli automatique en images sur mobile, sans WebGL ou en `prefers-reduced-motion`.*
3. **Nos solutions** — scroll horizontal piloté par le scroll vertical (8 produits).
4. **Révélation cinématique** — la caméra recule du profilé jusqu'au paysage,
   les vantaux s'ouvrent : *plus de lumière → plus d'espace → plus de confort*.
5. **Architecture marocaine contemporaine** — parallaxe multi-couches.
6. **Réalisations** — grille avec zoom, titre, lieu et catégorie au survol.
7. **Avant / après** — comparateur draggable.
8. **Qualité · Précision · Performance · Sur mesure**.
9. **Process** — timeline verticale animée en 6 étapes.
10. **Typographie éditoriale** — LUMIÈRE / ESPACE / CONFORT / PRÉCISION / DESIGN → CRISTALU MAROC.
11. **CTA final** + contact.

## Page produit MOMO Box (`/momo-box`)

Landing page dédiée au **coffre tunnel de rideau / volet roulant en polystyrène
haute densité**, posé pendant le gros œuvre au-dessus des ouvertures :
hero chantier, présentation produit, 6 points forts, schéma de principe
(SVG, coffre / enrouleur / tablier / coulisses / menuiserie), 4 étapes de mise
en œuvre, tableau comparatif (polystyrène vs béton vs bois), galerie,
caractéristiques, FAQ et CTA WhatsApp + devis.
Contenu éditable dans `src/content/momobox.ts` (FR/AR), bandeau promo
désactivable via `momoBox.promo.active`.

## FR / AR

- Bascule `FR | AR` dans le header (et dans le menu mobile).
- `dir="rtl"`, police arabe (IBM Plex Sans Arabic) et mise en page logique automatiques.
- Les textes d'interface sont dans `src/i18n/dictionaries.ts`, les contenus dans
  `src/content/*` (champs `{ fr, ar, en? }`) : **ajouter l'anglais = ajouter une clé `en`**.

## Accessibilité & performance

- `prefers-reduced-motion` respecté : smooth scroll, pins et timelines désactivés.
- Images responsives WebP + JPG de repli + LQIP flouté, `loading="lazy"` sauf hero.
- Three.js chargé en `React.lazy` **uniquement** sur desktop compatible WebGL.
- Chunks séparés (`three`, `gsap`, `router`, `react`), skip-link, focus visible,
  landmarks sémantiques, `alt` descriptifs.

## À compléter avant mise en ligne

1. `src/content/company.ts` — adresse exacte, lien Google Maps et réseaux sociaux
   (téléphones, WhatsApp et e-mail sont déjà renseignés : +212 661 239 493,
   +212 666 663 343, cristalunord@gmail.com).
2. `src/content/projects.ts` — vrais chantiers (photos, lieu, année, prestations).
3. `src/components/home/BeforeAfter.tsx` — photos réelles avant/après (même cadrage).
4. `index.html` — domaine réel dans les balises canonical / Open Graph / JSON-LD.
5. `.env` — `VITE_CONTACT_ENDPOINT` pour l'envoi serveur du formulaire
   (sinon bascule automatique WhatsApp / e-mail).
6. Remplacer les visuels générés par la photographie réelle de l'entreprise,
   puis relancer `bash scripts/optimize-images.sh`.

## Déploiement

Build statique (`dist/`) → Vercel, Netlify, Cloudflare Pages, OVH…
Les règles de réécriture SPA sont fournies (`vercel.json`, `public/_redirects`).
