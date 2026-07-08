# Changelog — Titres « flambeurs » (modes spéciaux)

## [Unreleased] — 2026-06-29

### Ajouté
- 5 nouveaux titres dans les **Stats fun** :
  - 🔥 Le Casino — le plus gros total de points misés.
  - 💰 Le Gros Coup — la plus grosse victoire sur un seul pari.
  - 🃏 Le Joueur — le plus de paris en mode spécial.
  - 📉 Le Cramé — le plus de points perdus.
  - 🧨 Le Rentable — le meilleur bilan net (gains − pertes).
- Carte « Quoi de neuf ? » sur la page d'accueil renvoyant vers `/stats`.

### Modifié
- `server.js` (`/api/stats`) : agrégation par joueur des mises, gains et pertes
  des modes Quitte ou double / Joker, et calcul des 5 nouveaux titres.
- `public/js/stats.js` : ajout des 5 cartes dans la liste `TITLES`.
- `public/index.html` : ajout de la carte d'accueil (en tête de section).

### Inchangé
- Règles de points, modes de pari, données stockées : aucun changement.
- Aucune nouvelle dépendance.
