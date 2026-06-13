# README — Classement avec flèches d'évolution ↕️

**Fonction concernée : `updateAndGetPrevious` (nouveau module historique)
+ route `/api/leaderboard`**
Date : 13/06/2026

## Ce qui change
Sur le **palmarès**, une flèche apparaît à côté de chaque joueur pour
montrer s'il monte ou descend depuis le dernier changement de classement
(c.-à-d. depuis le dernier match qui a rapporté des points) :

- ▲ vert : a gagné des places ;
- ▼ rouge : a perdu des places ;
- – gris : stable ;
- NEW : nouveau venu au classement.

Comment ça marche, en simple : le serveur garde une **photo** du classement
dans un nouveau petit fichier `data/standings-history.json`. Quand les points
bougent, l'ancienne photo sert de point de comparaison pour les flèches.

> Au tout premier affichage après la mise en ligne, aucune flèche
> n'apparaît (il n'y a pas encore de photo précédente). Les flèches
> apparaîtront dès que le classement bougera une première fois. C'est normal.

## Fichiers livrés (complets, à coller tels quels)

| Fichier | Destination |
|---|---|
| `data\history.js` *(nouveau)* | `C:\Agile\coupe-maison\data\history.js` |
| `server.js` | `C:\Agile\coupe-maison\server.js` |
| `public\js\palmares.js` | `C:\Agile\coupe-maison\public\js\palmares.js` |
| `public\css\competition.css` | `C:\Agile\coupe-maison\public\css\competition.css` |
| `deploy-coupe-maison.ps1` | `C:\Agile\coupe-maison\deploy-coupe-maison.ps1` |

> ⚠️ **Important** : le script de déploiement a été mis à jour pour
> **préserver** le nouveau fichier `data/standings-history.json` au
> serveur (comme il préserve déjà les comptes et les paris). Il faut
> donc bien remplacer aussi `deploy-coupe-maison.ps1`.
>
> ℹ️ `server.js`, `palmares.js` et `competition.css` contiennent déjà
> tout ce qui a été livré avant (badge 🎯, mot de passe perso, etc.).

## Pour tester en local
1. Backup (ton `.bat`).
2. Colle les 5 fichiers, `npm start`, `Ctrl + F5` sur le **Palmarès**.
3. Au 1er affichage : pas de flèche (normal). Le fichier
   `data/standings-history.json` se crée tout seul.
