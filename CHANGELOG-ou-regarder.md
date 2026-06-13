# Changelog — v0.7 « Où regarder »

## Modifié (itération onglets)
- La page `/tv` présente désormais **deux onglets** (« M6 / W9 » et « beIN Sports »)
  au lieu de deux blocs empilés, pour basculer sans descendre la page.
- `public/js/tv.js` : ajout de `activateTv(view)` + mémorisation du dernier onglet.

## Ajouté
- Nouvelle page **`/tv`** (`public/tv.html`) : programme des matchs par chaîne TV.
- `public/js/tv.js` : `loadTv()` charge `/api/matches` et range les matchs par
  chaîne et par jour ; `isFreeM6(m)` détermine les matchs en clair confirmés.
- `public/css/tv.css` : en-têtes de chaîne + pastilles M6 / beIN.
- Lien **« Où regarder »** dans le menu du haut de toutes les pages.

## Modifié
- `server.js` : ajout de la route `app.get('/tv', …)`.
- `public/*.html` (index, competition, equipes, compte, paris, palmares, tableau) :
  ajout du lien de menu après « Palmarès ».

## Inchangé
- Aucune nouvelle dépendance, aucune clé, aucun appel externe.
- Les données restent celles de l'API `/api/matches` existante.

## À savoir (données)
- beIN Sports : 104 matchs.
- M6 / W9 (gratuit) : seuls les matchs **confirmés** sont marqués en clair
  (France, demi-finales, petite finale, finale). Le reste de la sélection M6
  sera ajouté après les tirages.
