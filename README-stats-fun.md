# README — Page « Stats fun » 📊

**Fonction concernée : route `/api/stats` (serveur) + page `/stats`**
Date : 13/06/2026

## Ce qui change
Une nouvelle page **Stats** (lien ajouté dans le menu de toutes les pages)
décerne des petits titres rigolos d'après les paris :

- 🎯 **Le sniper** — le plus de scores exacts
- 🔮 **Le voyant** — le plus de bons paris
- 🎲 **Le flambeur** — parie le plus de buts en moyenne
- 🛡️ **Le prudent** — parie les plus petits scores
- ✍️ **Le plus assidu** — le plus de paris placés

Plus une section « En chiffres » : parieurs actifs, total de paris,
moyenne de buts pronostiqués par pari, et le score le plus joué.

> Les joueurs qui n'ont fait **aucun pari** sont exclus des stats.

Tout est calculé à partir des données existantes (lecture seule) :
aucune donnée modifiée.

## Fichiers livrés (complets, à coller tels quels)

| Fichier | Destination |
|---|---|
| `server.js` | `C:\Agile\coupe-maison\server.js` |
| `public\stats.html` *(nouveau)* | `C:\Agile\coupe-maison\public\stats.html` |
| `public\js\stats.js` *(nouveau)* | `C:\Agile\coupe-maison\public\js\stats.js` |
| `public\css\stats.css` *(nouveau)* | `C:\Agile\coupe-maison\public\css\stats.css` |
| `public\index.html` | `C:\Agile\coupe-maison\public\index.html` |
| `public\competition.html` | `C:\Agile\coupe-maison\public\competition.html` |
| `public\equipes.html` | `C:\Agile\coupe-maison\public\equipes.html` |
| `public\compte.html` | `C:\Agile\coupe-maison\public\compte.html` |
| `public\paris.html` | `C:\Agile\coupe-maison\public\paris.html` |
| `public\palmares.html` | `C:\Agile\coupe-maison\public\palmares.html` |
| `public\tableau.html` | `C:\Agile\coupe-maison\public\tableau.html` |
| `public\tv.html` | `C:\Agile\coupe-maison\public\tv.html` |

> ℹ️ Les pages HTML ne changent que par l'ajout du lien « Stats » dans le
> menu. Elles intègrent toutes les livraisons précédentes : rien ne régresse.
> `server.js` contient aussi les flèches d'évolution (livrées avant).

## Pour tester en local
1. Backup (ton `.bat`).
2. Colle tous les fichiers, `npm start`, `Ctrl + F5`.
3. Clique « Stats » dans le menu : les titres et les chiffres s'affichent.
