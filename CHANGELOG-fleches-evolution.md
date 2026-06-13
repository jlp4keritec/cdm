# CHANGELOG — Flèches d'évolution ↕️ (13/06/2026)

## Ajouté (Lot 1 — fonctionnalité 3/4)
- Flèches d'évolution sur le palmarès (▲ hausse / ▼ baisse / – stable / NEW).
  (`public/js/palmares.js`, `public/css/competition.css`)
- Nouveau module `data/history.js` : garde une photo du classement
  (`data/standings-history.json`) et fournit le rang précédent.
- `/api/leaderboard` renvoie désormais un champ `trend` par joueur. (`server.js`)

## Déploiement
- `deploy-coupe-maison.ps1` mis à jour pour **préserver**
  `data/standings-history.json` au serveur (exclusion tar + rsync,
  sauvegarde + restauration), comme `users.json` et `bets.json`.

## Inchangé
- Calcul des points, règles des paris, onglets, badge 🎯, compte à rebours.
