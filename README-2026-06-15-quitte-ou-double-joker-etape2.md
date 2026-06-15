# 🎲 Quitte ou double & 🃏 Joker — Étape 2 (l'écran)

Cette étape ajoute **ce que tu vois et utilises** sur la page **PARIER**.
À installer **après l'étape 1** (le cerveau), que tu as déjà validée.

## Ce qui apparaît maintenant

- **Un choix de mode sur chaque match** : trois petits boutons
  **Prono normal** · **🎲 Quitte ou double** · **🃏 Joker**.
- **🎲 Quitte ou double** : tu choisis ton score **et** ta mise. Un petit aperçu
  te montre en direct ce que tu peux gagner ou perdre :
  *« Si score exact : +6 · bon résultat : +3 · perdu : −2 »* (exemple mise 2).
- **🃏 Joker** : un simple bouton, mise fixe de 2 points. Tu gagnes le **nombre de
  buts** du match (un 0-0 te coûte 2 pts).
- **Le portefeuille en haut** : à côté de tes points, le nombre de points
  **« à miser »** (ce qu'il te reste de disponible).
- Les boutons de mise se **désactivent tout seuls** si tu n'as pas assez de points.
- **Matchs passés** : chaque pari affiche son mode et le résultat en
  **vert (gagné)** ou **rouge (perdu)**.

## Petites protections incluses

- Impossible de miser plus que ton portefeuille (vérifié aussi côté serveur).
- **« Tout parier au hasard »** ne touche **pas** aux matchs où tu as déjà posé
  une mise (Quitte ou double / Joker) : tes mises sont protégées.

## Fichiers modifiés

- `public/paris.html` — affichage du portefeuille (« à miser »).
- `public/js/paris.js` — choix du mode, case mise + aperçu, Joker, gains/pertes.
- `public/css/paris.css` — style des nouveaux éléments.
- `server.js` — « Tout parier au hasard » n'écrase plus les mises.

## Installation

Décompresse le ZIP **par-dessus** `C:\Agile\coupe-maison` (l'arborescence est
respectée), puis relance le site :

```
npm start
```

Recharge la page **PARIER** avec **Ctrl + F5**.

## À tester de ton côté

1. Va sur **PARIER**. En haut, tu vois tes **points** et le nombre **« à miser »**.
2. Sur un match, clique **🎲 Quitte ou double** → choisis un score, mets une mise,
   regarde l'aperçu des gains, puis **Valide**.
3. Clique **🃏 Joker** sur un autre match → **Valide** (mise 2 pts automatique).
4. Si ton portefeuille est petit, vérifie que les boutons se désactivent.
5. Une fois un match terminé, va dans **Mes paris passés** : le gain (vert) ou la
   perte (rouge) s'affiche, et le **Palmarès** en tient compte.

> Aucune nouvelle dépendance, aucune clé, aucun appel externe.
