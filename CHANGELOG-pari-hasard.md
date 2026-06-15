# Changelog — Pari au hasard 🎲

## Ajouté
- **`data/pronostic.js`** : fonction `randomScoreFor(home, away)` — tirage d'un score
  aléatoire **pondéré par le niveau** (Elo si dispo, sinon rang FIFA), via une loi de
  Poisson, borné de 0 à 15 buts. Plus l'écart est grand, plus le favori peut s'envoler.
- **`server.js`** : route `POST /api/bets/random` (authentifiée). Avec `{ matchId }` →
  tire et enregistre un seul match ; sans corps → tire et enregistre **tous** les matchs
  à venir. Réutilise le contrôle `isBettable` (impossible après le coup d'envoi).
- **`public/paris.html`** : bouton global **« 🎲 Tout parier au hasard »** placé sur la
  **même ligne que les onglets** « À pronostiquer » / « Mes paris passés » (visible
  uniquement sur l'onglet à pronostiquer). L'explication passe en infobulle au survol.
- **`public/js/paris.js`** : bouton **« 🎲 Au hasard »** sur chaque match + fonctions
  `randomOne`, `randomAll`, `applyScoreToRow`.
- **`public/css/paris.css`** : style des boutons (et version mobile en colonne).
- **`public/index.html`** : carte « Parier au hasard » dans la section « Quoi de neuf ? ».

## Comportement
- Le tirage **enregistre directement** le pari (option B), modifiable à la main jusqu'au
  coup d'envoi.

## Inchangé
- Aucune nouvelle dépendance, aucune clé, aucun appel externe.
- Règle des points inchangée (bon résultat = 1, score exact = 3).
