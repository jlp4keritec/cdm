# Changelog — Règle « bon écart de but »

## [Unreleased] — 2026-06-16

### Ajouté
- Note de **2 pts** pour le bon écart de but (score exact = 3, bon vainqueur seul = 1).
- Le **match nul** non exact rapporte 2 pts (écart 0 trouvé).
- Badge « 🎯 2 pts » dans le détail des points du palmarès.

### Modifié
- `pointsFor` (data/bets.js) : grille 3 / 2 / 1 / 0.
- `server.js` : le bon écart est comptabilisé comme un « bon résultat ».

### Inchangé
- Modes **Quitte ou double** et **Joker**.
