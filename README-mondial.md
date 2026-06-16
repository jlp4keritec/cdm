# Page « Mondial » — stats du tournoi

## Fonction
`getScorers()` (dans `data/football.js`) — récupère le classement officiel des
buteurs depuis l'API football-data.org (`/competitions/WC/scorers?limit=10`),
traduit le nom de l'équipe en français et garde la réponse 60 s en cache.
Côté navigateur, `load()` (dans `public/js/mondial.js`) charge les 3 sources
(`/api/scorers`, `/api/teams`, `/api/matches`) et remplit les 4 onglets.

## Ce que fait la page
Une nouvelle page accessible sur **`/mondial`**, dans le même style que le reste
du site, avec **4 onglets** (on bascule sans descendre la page) :

1. **🥅 Buteurs** — le Top 10 des meilleurs buteurs (rang, joueur, équipe, buts),
   avec médailles 🥇🥈🥉 pour le podium. *Source : classement officiel de l'API.*
2. **⚔️ Attaques** — le Top 10 des équipes qui **marquent le plus** de buts.
3. **🛡️ Défenses** — le Top 10 des équipes qui **encaissent le moins** de buts.
4. **🔥 Matchs fous** — les 10 matchs **les plus prolifiques** (le plus de buts au total).

Tout se met à jour **tout seul** au fil des matchs. Avant le coup d'envoi du
tournoi, les onglets affichent un petit message « se remplira dès les premiers
matchs » — c'est normal.

Le lien **« Mondial »** a été ajouté dans le menu du haut de **toutes les pages**.

## Fichiers
**Nouveaux**
- `public/mondial.html` — la page et ses 4 onglets
- `public/js/mondial.js` — chargement + affichage des stats
- `public/css/mondial.css` — petites touches de style (médailles, gros chiffres)

**Modifiés**
- `data/football.js` — ajout de `getScorers()` (+ cache buteurs)
- `server.js` — ajout de la page `/mondial` et de l'API `/api/scorers`
- les pages `public/*.html` — lien « Mondial » ajouté dans le menu

## Bon à savoir
- Aucune nouvelle dépendance, aucune nouvelle clé : on réutilise ta clé
  `FOOTBALL_API_KEY` déjà en place.
- Le gratuit donne le **nom du buteur + ses buts**. Les passes décisives,
  possession, etc. demanderaient un plan payant.

## À faire de ton côté
1. Décompresse le ZIP dans `C:\Agile\coupe-maison` (remplace les fichiers).
2. `npm start` puis va sur **http://localhost:3000/mondial**.
3. Vérifie que les 4 onglets s'affichent et envoie-moi une capture.
   (Tant que le tournoi n'a pas commencé, les listes seront vides : c'est attendu.)
