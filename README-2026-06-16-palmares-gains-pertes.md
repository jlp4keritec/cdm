# 🏆 Palmarès — gains et pertes des paris

Le détail du Palmarès (clic sur un pseudo) affiche maintenant **tous les paris
qui changent le total**, pas seulement les matchs gagnés.

## Ce qui change à l'écran

- Les **mises gagnées** (Quitte ou double 🎲 / Joker 🃏) affichent leurs **vrais
  points** : ex. `🎲 +6 pts`, `🃏 +3 pts`.
- Les **mises perdues** apparaissent en **rouge** : ex. `-2 pts`.
- Un petit **libellé** rappelle le type de pari : *« 🎲 Quitte ou double · mise 2 »*
  ou *« 🃏 Joker »*.
- Les pronos normaux gardent leur affichage : 🎯 3 pts, 🎯 2 pts, ✓ 1 pt.

> Résultat : **la somme des lignes = le total de points** affiché à côté du pseudo.

## Fichiers modifiés

- `server.js` — le détail inclut désormais les paris perdus (points négatifs).
- `public/js/palmares.js` — affichage des vrais points + lignes de perte en rouge.
- `public/css/competition.css` — styles des badges (gain misé, perte, libellé).

## Installation

Décompresse le ZIP **par-dessus** `C:\Agile\coupe-maison` (arborescence respectée),
puis relance :

```
npm start
```

Recharge le **Palmarès** avec **Ctrl + F5**, puis clique sur un pseudo.

## À vérifier de ton côté

1. Clique sur un joueur qui a fait des **paris Quitte ou double / Joker**.
2. Vérifie que les **gains misés** s'affichent (ex. `🎲 +6 pts`).
3. Vérifie qu'une **mise perdue** apparaît en **rouge** (ex. `-2 pts`).
4. Additionne les lignes → ça doit tomber sur le **total** affiché à côté du pseudo.
