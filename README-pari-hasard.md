# 🎲 Parier au hasard

Deux nouveaux boutons sur la page **PARIER** pour remplir tes scores sans réfléchir.
Le hasard n'est pas bête : il s'appuie sur le **niveau des équipes** (note Elo, sinon
classement FIFA). Plus l'écart est grand, plus le favori peut marquer — **jusqu'à 15 buts**
dans les cas extrêmes.

## Ce que ça fait

- **🎲 Au hasard** (sur chaque match) : tire un score pour ce match.
- **🎲 Tout parier au hasard** (en haut de la liste) : tire un score pour **tous**
  les matchs à venir d'un coup.
- Dans les deux cas, le pari est **enregistré tout de suite**.
  Tu peux le **modifier** à la main tant que le match n'a pas commencé.

## À quoi ressemblent les scores tirés

| Type de match | Tirages fréquents | Cas rare |
|---|---|---|
| Deux grosses équipes (serré) | 1-1, 1-2, 0-1 | 3-2 |
| Gros écart de niveau | 7-0, 8-0, 9-0 | jusqu'à 15-0 |
| Écart moyen | 4-0, 5-1, 3-0 | 7-1 |

## Fonction livrée

- **`randomScoreFor(home, away)`** — dans `data/pronostic.js`. Calcule la force de chaque
  équipe (Elo de préférence, sinon FIFA), en déduit le nombre de buts attendu, puis tire un
  score au hasard autour de cette attente (loi de Poisson), borné entre 0 et 15.

## Installation

Décompresse le ZIP **par-dessus** `C:\Agile\coupe-maison` (l'arborescence est respectée),
puis relance le site :

```
npm start
```

Recharge la page **PARIER** avec `Ctrl + F5`.

## À tester de ton côté

1. Connecte-toi, va sur **PARIER**.
2. Sur un match, clique **🎲 Au hasard** → un score s'affiche et un petit message confirme
   « enregistré ». Recharge la page : le score est toujours là.
3. Clique **🎲 Tout parier au hasard** (en haut) → tous les matchs à venir reçoivent un score.
4. Modifie un score à la main et clique **Modifier** → ça reste possible jusqu'au coup d'envoi.
5. Sur la page d'**Accueil**, la carte « Parier au hasard » apparaît dans « Quoi de neuf ? ».

## Fichiers modifiés

- `data/pronostic.js` — nouvelle fonction `randomScoreFor`.
- `server.js` — nouvelle route `POST /api/bets/random` (un match ou tous).
- `public/js/paris.js` — boutons 🎲 + logique d'affichage.
- `public/paris.html` — bouton global « Tout parier au hasard ».
- `public/css/paris.css` — style des boutons.
- `public/index.html` — carte « Nouveauté » sur l'accueil.

> Aucune nouvelle dépendance, aucune clé, aucun appel externe.
