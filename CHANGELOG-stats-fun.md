# CHANGELOG — Stats fun 📊 (13/06/2026)

## Ajouté (Lot 2 — fonctionnalité 1/2)
- Nouvelle page **/stats** : titres rigolos (sniper 🎯, voyant 🔮,
  flambeur 🎲, prudent 🛡️, assidu ✍️) + section « En chiffres »
  (parieurs actifs, total paris, buts/pari, score le plus joué).
  (`public/stats.html`, `public/js/stats.js`, `public/css/stats.css`)
- Route serveur **/api/stats** (lecture seule). Les joueurs sans aucun
  pari sont exclus. (`server.js`)
- Lien « Stats » ajouté dans le menu de toutes les pages.

## Inchangé
- Calcul des points, paris, classement, badge 🎯, compte à rebours,
  flèches d'évolution, données.
