# README — Palmarès : déplier les matchs gagnants 🔽

**Fonctions concernées : `computeStandings` (serveur) et `load` (palmarès)**
Date : 13/06/2026

## Ce que ça fait
Sur la page **Palmarès**, tu peux maintenant **cliquer sur un parieur**
pour **déplier la liste des matchs qui lui ont rapporté des points**.

Pour chaque match gagnant, on voit :
- la **date** et les deux équipes,
- le **score réel** du match,
- **le prono** du joueur,
- les **points gagnés** : 🎯 3 pts (score exact) ou ✓ 1 pt (bon résultat).

> Seuls les matchs qui ont **rapporté des points** apparaissent.
> Les pronos ratés (0 pt) ne sont pas affichés.
> Les scores exacts (3 pts) sont listés en premier.

Un petit chevron ▾ s'affiche à côté des joueurs qui ont au moins un match
gagnant. Un joueur à 0 point n'a pas de chevron et ne se déplie pas.

## Page d'accueil
Une **nouvelle carte** « Détail des points » a été ajoutée dans la section
« Quoi de neuf ? » (en première position). La grille des nouveautés passe
à **3 colonnes** (2 lignes de 3) pour bien afficher les 6 cartes.

## Fichiers livrés (complets, à coller tels quels)

| Fichier | Destination |
|---|---|
| `server.js` | `C:\Agile\coupe-maison\server.js` |
| `public\js\palmares.js` | `C:\Agile\coupe-maison\public\js\palmares.js` |
| `public\css\competition.css` | `C:\Agile\coupe-maison\public\css\competition.css` |
| `public\index.html` | `C:\Agile\coupe-maison\public\index.html` |
| `public\css\home-news.css` | `C:\Agile\coupe-maison\public\css\home-news.css` |

## Ce qui change techniquement
- **server.js** : la route `/api/leaderboard` renvoie en plus, pour chaque
  joueur, la liste de ses matchs gagnants (champ `breakdown`). Le calcul
  des points n'est **pas** modifié.
- **palmares.js** : la ligne devient cliquable et affiche/masque le détail.
- **competition.css** : le style du panneau dépliable.
- **index.html** : nouvelle carte « Détail des points » dans « Quoi de neuf ? ».
- **home-news.css** : grille des nouveautés en 3 colonnes.

## Pour tester en local
1. 💾 Backup (ton `.bat`).
2. Colle les 5 fichiers, `npm start`, puis `Ctrl + F5`.
3. **Accueil** : la nouvelle carte « Détail des points » apparaît dans
   « Quoi de neuf ? ».
4. **Palmarès** : clique sur un joueur qui a des points → la liste de ses
   matchs gagnants se déplie. Re-clique → ça se replie.

> Astuce : si un joueur n'a aucun point pour l'instant (avant les premiers
> résultats), c'est normal qu'il ne se déplie pas — il n'a pas encore de
> match gagnant.
