# TODO — Contenu à valider avant mise en ligne

Ce site a été construit **sans aucune information commerciale vérifiée** sur CRISTALUM MAROC.
Plutôt que d'inventer des chiffres, des adresses ou des réalisations, tous les champs concernés sont
**laissés vides** et signalés dans l'interface (« à renseigner », « à confirmer », éléments masqués).

La règle appliquée partout : **une donnée non confirmée = une information qui ne s'affiche pas.**

---

## 1. Coordonnées de l'entreprise — `src/data/site.ts` (priorité haute)

| Champ | État actuel | Où l'activer | Où il s'affiche |
| --- | --- | --- | --- |
| Téléphone | vide | `contact.phone` | en-tête, pied de page, section contact, CTA mobile, `tel:` |
| Téléphone secondaire | vide | `contact.phoneAlt` | (non utilisé pour l'instant) |
| E-mail | vide | `contact.email` | pied de page, section contact, formulaire, `mailto:` |
| Adresse / ville / région / code postal | vide | `contact.address.*` | pied de page, section contact, schema.org |
| Lien Google Maps | vide | `contact.maps` | pied de page (« Voir sur Google Maps »), schema.org |
| Horaires | vide | `hours` | pied de page |
| Facebook / Instagram | vide | `social.*` | pied de page, schema.org |
| **Numéro WhatsApp** | vide | `whatsapp.number` + `whatsapp.enabled: true` | bouton flottant (**actuellement masqué**) |
| Identifiant légal (RC / ICE / forme juridique) | vide | `legal.*` + page Mentions légales | mentions légales, pied de page |
| Hébergeur | vide | page Mentions légales | mentions légales |

> Le bouton WhatsApp flottant **n'apparaît pas** tant que `whatsapp.number` est vide : le message pré-rempli
> demandé (« Bonjour Cristalum, je souhaite obtenir un devis pour un projet de menuiserie aluminium/PVC. »)
> est déjà en place dans `siteConfig.whatsapp.message` et s'ouvre automatiquement avec le numéro renseigné.

## 2. Statistiques — aucune donnée chiffrée inventée

Le site n'affiche **que des chiffres vérifiables directement sur ce site** (`src/data/process.ts` →
`verifiedFacts`) :

- 7 familles de solutions (sections « Solutions »),
- 6 étapes de fabrication (section « Notre expertise »),
- 5 finitions aluminium,
- 4 types de vitrage.

À fournir pour activer les compteurs correspondants :

- `joinery.yearsOfExperience` → **« 20+ années d'expérience »** (l'utilisateur mentionnait 20+, à confirmer par
  l'entreprise : date de création réelle). Le bloc s'affiche automatiquement dès que la valeur est renseignée.
- `joinery.projectsCompleted` → nombre de chantiers (facultatif, non affiché aujourd'hui).

## 3. Zone d'intervention — `src/data/cities.ts`

Les 9 villes (Tanger, Kénitra, Rabat, Casablanca, Fès, Meknès, Oujda, Marrakech, Agadir) sont **indicatives** :
`verified: false` et la section « Zone d'intervention » affiche un avertissement explicite.

À faire : décocher les villes non desservies et passer `verified: true` sur celles réellement couvertes
(`allCitiesVerified` fait disparaître l'avertissement automatiquement).

## 4. Réalisations & photographies (priorité haute)

Les visuels actuels sont des **images d'illustration générées** (aucun droit d'auteur tiers, mais elles ne
représentent pas les chantiers réels de l'entreprise). À remplacer par des photos réelles :

- `public/images/raw/` : déposez vos photos de chantier sous les mêmes noms de fichiers, puis relancez
  `npm run images` (génère les WebP 800/1600 px + LQIP + image Open Graph).
- Section **Réalisations** (`src/data/projects.ts`) : remplacez `title`, `type`, `materials`, `description` et
  surtout `location` (aujourd'hui `null` → la fiche affiche « Communiquée sur demande »).
  Le modèle `span` (`tall` / `wide` / `normal`) règle la place dans la mosaïque.
- Section **Avant / Après** (`src/sections/BeforeAfter.tsx`) : remplacez les couples d'images par un vrai
  chantier avant/après.
- Section **Architecture marocaine** (`src/sections/Architecture.tsx`) : mêmes consignes.
- ⚠️ Les images actuellement disponibles sont limitées (10 fichiers). Villas, appartements, bureaux et commerces
  réutilisent les visuels existants — prévoyez des visuels dédiés par typologie.

## 5. Textes à valider

- `src/data/services.ts` : descriptions des 7 familles de solutions, points techniques et applications.
- `src/sections/About.tsx` : histoire de l'atelier, méthode de travail (aucune date ni effectif n'est avancé).
- `src/data/process.ts` : formulation des 6 étapes.
- `src/sections/WhyCristalum.tsx` : engagements (« Sur mesure », « Aluminium & PVC », « Qualité »).
- `src/pages/Legal.tsx` : mentions légales et politique de confidentialité sont des **modèles à faire valider**
  par un conseil juridique (champs « À COMPLÉTER » mis en évidence).

## 6. Technique

- **Envoi des demandes** : par défaut, `siteConfig.forms.quoteEndpoint.provider = 'none'`. Options :
  - `{ provider: 'formspree', formId: '…' }` (rapide, sans backend),
  - `{ provider: 'endpoint', url: 'https://…' }` pour votre API / n8n / Make.
  Sans configuration, la demande est enregistrée localement et transmise via WhatsApp ou e-mail si configuré.
- **Domaines** : remplacer `https://www.cristalum.ma` dans `index.html` (canonical, OG, JSON-LD) et
  `public/sitemap.xml`.
- **Analytics** : aucun traceur n'est installé (cohérent avec la politique de confidentialité). à ajouter
  seulement si nécessaire.
- **Images Open Graph** : `public/images/og-cristalum.jpg` est générée depuis la photo du hero — régénérez-la
  après remplacement des visuels (`npm run images`).

## 7. Checklist de recette

```bash
npm run verify   # typecheck + images + build + test de fumée
npm run preview  # contrôle visuel du build
```

- [ ] Coordonnées renseignées (`src/data/site.ts`) et affichées en en-tête / pied de page / contact
- [ ] Numéro WhatsApp réel configuré → bouton flottant visible avec message pré-rempli
- [ ] Zone d'intervention confirmée (`src/data/cities.ts`)
- [ ] Années d'expérience confirmées (sinon le compteur reste masqué)
- [ ] Photos réelles intégrées + `npm run images` relancé
- [ ] Réalisations : villes et descriptions complétées
- [ ] Mentions légales et politique de confidentialité validées
- [ ] Test sur mobile réel : hero 3D, configurateur, formulaire, CTA collant
- [ ] Domaine réel dans `index.html` et `sitemap.xml`
