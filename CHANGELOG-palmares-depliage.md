# CHANGELOG — Palmarès : déplier les matchs gagnants (13/06/2026)

## Ajouté
- **Palmarès** : clic sur un parieur → dépliage de la liste des matchs qui
  lui ont rapporté des points (date, équipes, score réel, son prono,
  points gagnés). Score exact 🎯 affiché en premier.
  (`public/js/palmares.js`, `public/css/competition.css`)
- **Serveur** : la route `GET /api/leaderboard` renvoie un champ
  `breakdown` par joueur (matchs gagnants uniquement, 1 ou 3 pts).
  (`server.js` — fonction `computeStandings`)
- **Accueil** : nouvelle carte « Détail des points » dans la section
  « Quoi de neuf ? » (en 1re position). (`public/index.html`)

## Modifié
- **Accueil** : grille des nouveautés passée de 5 à 3 colonnes pour
  afficher proprement les 6 cartes (2 lignes de 3). (`public/css/home-news.css`)

## Inchangé
- Règle et calcul des points, données (`bets.json`, `users.json`),
  classement, médailles, flèches d'évolution, badge 🎯.
