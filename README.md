# Cristalu

Site web statique et responsive pour Cristalu, en HTML, CSS et JavaScript pur (aucune dépendance, aucune étape de build).

## Structure

```
index.html   Page unique : en-tête, accueil, services, à propos, contact, pied de page
styles.css   Styles (thème sombre, responsive, préférence de mouvement réduit)
script.js    Menu mobile, année automatique, validation du formulaire de contact
```

## Lancer le site en local

Aucune installation n'est nécessaire. Depuis la racine du dépôt :

```bash
python3 -m http.server 8000
```

Puis ouvrez <http://localhost:8000>.

## Personnalisation

- **Textes et coordonnées** : modifiez `index.html` (adresse, e-mail et téléphone sont des exemples).
- **Couleurs** : variables CSS en haut de `styles.css` (`--accent`, `--accent-2`, `--bg`, etc.).
- **Envoi du formulaire** : `script.js` simule l'envoi. Branchez votre service (API, Formspree, etc.) à l'endroit indiqué par le commentaire `Démo`.
