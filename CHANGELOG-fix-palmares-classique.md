# Changelog — Correctif palmarès classique

## [v0.9.1] — 2026-06-30

### Corrigé
- Page Palmarès : l'onglet **Classique** affichait les mêmes points que
  **Avec mises**. Le serveur ignorait le paramètre `?classic=1` et renvoyait
  toujours le classement avec mises.

### Modifié
- `computeStandings()` accepte une option `{ classic }` (points de base seuls).
- Route `GET /api/leaderboard?classic=1` honore désormais le mode classique.
- Les flèches d'évolution (▲▼) restent réservées au classement « Avec mises ».

### Conservé
- Fun stats, classement avec mises, dépliage du détail : inchangés.
