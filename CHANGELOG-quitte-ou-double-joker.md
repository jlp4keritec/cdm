# Changelog — Quitte ou double 🎲 & Joker 🃏

## [2026-06-15] — Release prod (coupe.arkkam.com)

### Ajouté — Étape 1 (serveur / mécanique)
- **`data/bets.js`** : chaque pari porte un **`mode`** (`normal` | `qod` | `joker`)
  et une **`stake`** (mise). Nouvelle fonction **`gamePointsFor(bet, match)`** :
  - normal → règle de base (1 ou 3 pts) ;
  - qod → score exact = ×3 mise, bon résultat = ×1,5 mise (arrondi supérieur),
    perdu = − mise ;
  - joker → (buts du match) − mise (2).
  `setBet(...)` accepte `mode` et `stake` (rétrocompatible).
- **`server.js`** :
  - `POST /api/bets` accepte `mode`/`stake` et **vérifie le portefeuille**.
  - Helper **`availablePoints(userId, matchList)`** (points gagnés − mises bloquées).
  - `GET /api/bets/me` renvoie `mode`, `stake` et `available`.
  - `computeStandings` calcule via `gamePointsFor` (points possiblement négatifs).

### Ajouté — Étape 2 (interface)
- **`public/js/paris.js`** : sur chaque match, choix du mode
  (normal / quitte ou double / joker), case **mise** avec aperçu des gains en
  direct, bouton **Joker** (mise 2), affichage **gains/pertes** sur les matchs
  passés, et rafraîchissement du portefeuille après chaque pari.
- **`public/paris.html`** : portefeuille « à miser » à côté du total de points.
- **`public/css/paris.css`** : style des modes, de la mise, du joker, des étiquettes
  et des badges gain (vert) / perte (rouge).
- **`server.js`** : « Tout parier au hasard » n'écrase plus un match déjà misé
  (quitte ou double / joker).
- **`public/index.html`** : carte « Quitte ou double & Joker » ajoutée en tête de
  la section « Quoi de neuf ? » de l'accueil.

### Comportement
- Un mode misé **remplace** le 1 ou 3 pt normal du match. Un seul mode par match.
- On ne peut miser que ses points disponibles (refusé côté serveur sinon).
- Les anciens paris (sans `mode`) sont traités comme « normal ».

### Inchangé
- Aucune nouvelle dépendance, aucune clé, aucun appel externe.
- Données (`bets.json`, `users.json`) non touchées par le code.
