# Changelog — Palmarès : gains et pertes des paris

## [Unreleased] — 2026-06-16

### Modifié
- **`server.js`** : `computeStandings` ajoute au `breakdown` les paris dont les
  points sont **≠ 0** (avant : uniquement > 0). Les mises perdues (points négatifs)
  sont donc incluses. La somme des lignes égale désormais le total du joueur.
- **`public/js/palmares.js`** : badges recalculés selon le mode et le signe —
  Quitte ou double / Joker affichent leurs **vrais points** ; les pertes
  s'affichent **en rouge** ; ajout d'un libellé de mode (mise).
- **`public/css/competition.css`** : nouveaux styles `.bd-game` (gain misé),
  `.bd-loss` (perte rouge), `.bd-mode` (libellé du pari).

### Inchangé
- Aucune nouvelle dépendance, aucun appel externe.
- Données (`bets.json`, `users.json`) non touchées.
- Pronos normaux : affichage identique (🎯 3 pts / 🎯 2 pts / ✓ 1 pt).
