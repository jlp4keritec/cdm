# Changelog — Page « Mondial » (stats du tournoi)

Date : 2026-06-16

## Ajouté
- Nouvelle page **`/mondial`** « Stats du Mondial » avec **4 onglets** :
  - 🥅 Meilleurs buteurs (Top 10, médailles podium)
  - ⚔️ Meilleures attaques (Top 10 buts marqués)
  - 🛡️ Meilleures défenses (Top 10 buts encaissés)
  - 🔥 Matchs les plus prolifiques (Top 10)
- `data/football.js` : fonction **`getScorers()`** (appel `/competitions/WC/scorers?limit=10`,
  traduction de l'équipe en français, cache 60 s).
- `server.js` : page `/mondial` + API **`/api/scorers`**.
- Lien **« Mondial »** dans le menu de toutes les pages.

## Modifié
- `data/football.js` : ajout d'un emplacement de cache `scorers`.

## Inchangé
- Aucune nouvelle dépendance. Réutilise la clé `FOOTBALL_API_KEY` existante.
- Aucune donnée du jeu (paris, comptes) touchée.

## Ajout 2026-06-16 (suite)
- `public/index.html` : carte « Les stats du Mondial » (04) ajoutée sur la page d'accueil.
