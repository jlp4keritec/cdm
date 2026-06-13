# Page « Où regarder » — matchs par chaîne TV

## Fonction
`loadTv()` (dans `public/js/tv.js`) — récupère les matchs depuis `/api/matches`
(les mêmes données que le calendrier) et les affiche regroupés par chaîne,
jour par jour, en heure de Paris. Le tri par chaîne utilise `isFreeM6(match)`,
et `activateTv(view)` bascule entre les deux onglets.

## Ce que fait la page
Une nouvelle page accessible sur **`/tv`**, avec le même style que le reste du site,
qui présente **deux onglets** (on bascule sans descendre la page) :

1. **En clair · M6 / W9** (gratuit) — uniquement les matchs **confirmés** en clair :
   les 3 matchs de la France, les 2 demi-finales, la petite finale et la finale.
   Un encadré précise que le reste de la sélection M6 (autres affiches, 8es, quarts)
   sera ajouté **après les tirages**.
2. **beIN Sports** (abonnement) — **les 104 matchs**.

Le lien **« Où regarder »** a été ajouté dans le menu du haut de toutes les pages.

## Règle de diffusion (source officielle, juin 2026)
- beIN Sports : 104 matchs.
- M6 / W9 : 54 matchs en clair. Confirmés à ce jour : France, demi-finales,
  petite finale, finale. La sélection M6 des tours à élimination directe est
  annoncée au fil de la compétition — d'où le choix de ne **rien inventer**.

## Fichiers livrés
**Nouveaux**
- `public/tv.html` — la page.
- `public/js/tv.js` — la logique (`loadTv`, `isFreeM6`, `renderByDay`, `renderMatch`, `activateTv`).
- `public/css/tv.css` — en-têtes de chaîne + pastilles M6 / beIN.

**Modifiés**
- `server.js` — ajout de la route `GET /tv`.
- `public/index.html`, `competition.html`, `equipes.html`, `compte.html`,
  `paris.html`, `palmares.html`, `tableau.html` — lien « Où regarder » dans le menu.

## Installation (copier-coller)
Décompresser le ZIP par-dessus `C:\Agile\coupe-maison` (l'arborescence est
respectée, les fichiers se mettent directement à la bonne place).

## Vérifié
- `node --check` OK sur `server.js` et `tv.js`.
- Serveur lancé en local : `/tv` répond (HTTP 200), le menu affiche le lien
  sur toutes les pages.

## Note
Aucune nouvelle dépendance, aucune clé, aucun appel externe ajouté.
La page utilise l'API `/api/matches` déjà en place.
