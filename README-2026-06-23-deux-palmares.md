# 🏆 Deux palmarès : Classique & Avec mises

## 🆕 Ce qui change
La page **Palmarès** a maintenant **deux onglets** :

- **🏆 Classique** — uniquement les paris de base (3 pts score exact,
  2 pts bon écart, 1 pt bon résultat). Les modes **Quitte ou double**
  et **Joker** ne comptent **pas** ici : c'est le classement « au mérite ».
- **🎲 Avec mises** — le classement habituel, avec les gains et pertes
  des mises (🎲 Quitte ou double, 🃏 Joker).

Le dépliage d'un parieur (clic) fonctionne dans les deux onglets.
Les flèches d'évolution (▲▼) restent sur l'onglet **Avec mises**.

## 🟢 Lancer le site (en local)
1. Terminal dans `coupe-maison`.
2. `npm start`
3. 👉 http://localhost:3000/palmares (`Ctrl + F5`).

## ✅ À tester de ton côté
1. Va sur **Palmarès**.
2. Onglet **Classique** : vérifie que les joueurs qui ont parié en
   Quitte ou double / Joker ont bien leurs **points de base** (pas les ×3).
3. Onglet **Avec mises** : c'est le classement actuel (avec les gros gains).
4. Clique sur un parieur dans chaque onglet → le détail se déplie.

Envoie-moi une **capture** des deux onglets.

## 🔧 Fonctions livrées
- `computeStandings(matchList, { classic })` dans `server.js` →
  calcule le classement classique (sans mises) ou avec mises.
- Route `GET /api/leaderboard?classic=1` → renvoie le classement classique.
- `loadBoard()` dans `public/js/palmares.js` → charge un classement par onglet.

## 📂 Fichiers modifiés
- `server.js`
- `public/palmares.html`
- `public/js/palmares.js`
