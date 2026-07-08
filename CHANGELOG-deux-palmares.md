# Changelog — Deux palmarès (Classique / Avec mises)

## [v0.9] — 2026-06-23

### Ajouté
- Page Palmarès : deux onglets **Classique** et **Avec mises**.
- Classement **Classique** : paris de base uniquement, les mises
  (Quitte ou double 🎲, Joker 🃏) sont ignorées.
- Route API `GET /api/leaderboard?classic=1`.

### Modifié
- `computeStandings()` accepte une option `{ classic }`.

### Conservé
- Le classement **Avec mises** est inchangé (gains/pertes des mises,
  flèches d'évolution ▲▼, dépliage du détail).
- L'historique des flèches ne suit que le classement « Avec mises »
  (le classique ne le perturbe pas).
