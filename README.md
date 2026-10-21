# CRISTALU MAROC — Site vitrine premium

Site web immersif pour **CRISTALU MAROC**, spécialiste de la **menuiserie aluminium & PVC sur mesure au Maroc**.
Identité visuelle : aluminium anodisé anthracite, verre, reflets, ingénierie de précision et architecture marocaine
contemporaine.

> ⚠️ **Avant toute mise en ligne : lire [`TODO-CONTENU.md`](./TODO-CONTENU.md).**
> Aucune information commerciale n'ayant été fournie (téléphone, e-mail, adresse, WhatsApp, réseaux sociaux,
> années d'expérience, zone d'intervention), ces champs sont laissés **vides** et marqués `verified: false`.
> Le site n'affiche alors **jamais** de valeur inventée : il indique « à renseigner » ou masque l'élément.

---

## 1. Stack technique

| Domaine | Choix |
| --- | --- |
| Framework | React 19 + TypeScript (strict) |
| Build | Vite 7 |
| Styles | Tailwind CSS v4 (`@theme` + `@utility`, design system maison) |
| 3D | Three.js + React Three Fiber + drei (environnement studio procédural) |
| Animations | GSAP 3 (ScrollTrigger, SplitText, Flip, CustomEase) + Framer Motion |
| Icônes | Lucide React |
| Typographies | Inter Variable (texte), Space Grotesk Variable (display), Cormorant Garamond (accents) — auto-hébergées via `@fontsource` |
| Images | `sharp` : WebP responsives 800/1600 px + LQIP inline + image Open Graph |
| Tests | Test de fumée en DOM simulé (jsdom) + build SSR |

Aucune ressource externe n'est appelée à l'exécution : polices auto-hébergées, textures générées à la volée
(canvas), environnement 3D construit avec des `Lightformer` (aucun HDRI à télécharger).

## 2. Démarrage

```bash
npm install
npm run images     # génère les WebP responsives depuis public/images/raw
npm run dev        # http://localhost:5173
```

### Scripts

| Script | Rôle |
| --- | --- |
| `npm run dev` | Serveur de développement |
| `npm run build` | Vérification TypeScript + build de production (`dist/`) |
| `npm run preview` | Prévisualisation du build |
| `npm run images` | Pipeline d'images (WebP 800/1600, LQIP, OG) |
| `npm run typecheck` | TypeScript seul |
| `npm run smoke` | Rend tout le site en DOM simulé et vérifie le contenu clé |
| `npm run verify` | `typecheck` + `images` + `build` + `smoke` |

## 3. Architecture du code

```
src/
├── App.tsx                  # Assemblage des sections + routage hash (pages légales)
├── index.css                # Design system Tailwind v4 (tokens + utilitaires)
├── data/                    # Contenu éditorial et configuration (source unique de vérité)
│   ├── site.ts              # ⚠️ Coordonnées + drapeaux `verified`
│   ├── services.ts          # Les 7 familles de solutions
│   ├── configurator.ts      # Finitions, vitrages, produits, options, demande de devis
│   ├── cities.ts            # Zone d'intervention (à confirmer) + contour SVG du Maroc
│   ├── projects.ts          # Réalisations / inspirations
│   ├── process.ts           # Méthode en 6 étapes + faits vérifiables
│   └── navigation.ts        # Menu + sections observées
├── hooks/                   # Media queries, qualité d'appareil, compteurs, pointeur
├── lib/                     # utils, GSAP, envoi de devis, store ville
├── three/                   # Moteur 3D
│   ├── CanvasHost.tsx       # Montage paresseux, pause hors écran, repli sans WebGL
│   ├── CanvasRuntime.tsx    # <Canvas> (chunk séparé, chargé à la demande)
│   ├── Joinery.tsx          # Menuiserie paramétrique (coulissant, battant, pergola, volet, garde-corps)
│   ├── Studio.tsx           # Environnement studio, éclairage animé, particules, ombre simulée
│   ├── HeroScene.tsx        # Scène du hero (caméra souris + défilement)
│   ├── ShowroomScene.tsx    # Scène du showroom interactif / configurateur
│   └── quality.ts           # Paliers de qualité (low / medium / high)
├── components/              # UI (boutons, contrôles, images responsives, en-tête, pied de page…)
└── sections/                # Les 13 sections de la page d'accueil
```

## 4. Performance & accessibilité

- **Chargement paresseux** : le moteur three.js est dans un chunk chargé uniquement quand une scène approche de
  l'écran (`CanvasHost` + `React.lazy`). Le premier rendu de la page n'attend aucune ressource 3D.
- **Pause automatique** : `setFrameloop('never')` dès qu'une scène quitte le viewport (batterie, GPU).
- **Paliers de qualité** (`useQualityTier`) : DPR, nombre de particules, résolution d'environnement et niveau de
  détail géométrique s'adaptent (mobile, cœurs CPU, mémoire, `prefers-reduced-motion`).
- **Images** : WebP responsives 800/1600 px, `srcset`/`sizes`, chargement paresseux, fondu au chargement ;
  hero préchargé (`fetchpriority="high"`).
- **Mouvement réduit** : `prefers-reduced-motion` neutralise animations, GSAP et 3D.
- **Accessibilité** : hiérarchie de titres, `aria-label`, `aria-pressed/checked/expanded`, navigation clavier
  (visionneuse : ← → Échap), focus visibles, contrastes élevés, lien d'évitement implicite via le menu.

## 5. Le configurateur et l'envoi des demandes

Le configurateur (8 étapes) et le formulaire de devis produisent une **demande structurée** (`QuoteRequest`),
transmise via le premier canal disponible :

1. **API / Formspree** si `siteConfig.forms.quoteEndpoint` est configuré → `POST` JSON ;
2. sinon **WhatsApp** (message structuré pré-rempli, si un numéro est configuré) ;
3. sinon **e-mail** (`mailto:` si une adresse est configurée) ;
4. sinon la demande est **enregistrée localement** (`localStorage`) et un récapitulatif copiable est affiché.

> **Aucun prix n'est calculé ni affiché** : c'est un choix assumé, la tarification dépend de mesures relevées sur
> site. Le site indique explicitement que le devis est établi sur mesure.

## 6. Configuration (à faire avant mise en ligne)

Tout se passe dans **`src/data/site.ts`** : renseignez la valeur et passez `verified: true`.

```ts
phone:      verified('+212 5XX XX XX XX'),
email:      verified('contact@…'),
whatsapp:   { number: '2126XXXXXXXX', enabled: true, message: '…' },
address:    { street: verified('…'), city: verified('…'), … },
hours:      verified('Lun – Sam : 8h30 – 18h30'),
social:     { facebook: verified('https://…'), instagram: verified('https://…') },
joinery:    { yearsOfExperience: verified(20) },   // chiffre à confirmer
forms:      { quoteEndpoint: { provider: 'formspree', formId: 'xxxxxxx' } },
```

Dès qu'une valeur est renseignée, elle apparaît automatiquement dans l'en-tête, le pied de page, la section
contact, le bouton WhatsApp flottant et les données structurées schema.org.

## 7. Déploiement

Le site est 100 % statique : `npm run build` produit `dist/` à déployer tel quel (Vercel, Netlify, Nginx, OVH…).

- Redirection SPA : les routes légales utilisent des ancres (`#/mentions-legales`), aucune règle de réécriture
  n'est nécessaire.
- Pensez à remplacer `https://www.cristalu.ma` dans `index.html` et `public/sitemap.xml` par le domaine réel.
