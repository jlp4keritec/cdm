# 🐛 Correctif — Palmarès Classique identique à Avec mises

## Le problème
Sur la page Palmarès, l'onglet **Classique** affichait les mêmes points
que l'onglet **Avec mises** (ex : Clemclem = 498 partout).

La page demandait bien le classement classique au serveur, mais le serveur
ignorait la demande et renvoyait à chaque fois le classement « Avec mises ».

## La correction
Un seul fichier modifié : **`server.js`**.
Le serveur sait maintenant calculer le classement **Classique**
(paris de base 3/2/1/0, sans les modes Quitte ou double 🎲 ni Joker 🃏).

Aucun autre fichier touché : la page (`palmares.html`, `palmares.js`)
était déjà correcte, et tes fun stats sont intactes.

## Fonction livrée
- `computeStandings(matchList, { classic })` dans `server.js`
  → `classic: true` = points de base seuls ; sinon = avec les mises.
- Route `GET /api/leaderboard?classic=1` → renvoie le classement classique.

## 🟢 Déploiement
1. Décompresse ce ZIP et remplace ton `server.js`.
2. Déploie : `.\deploy-coupe-maison.ps1 -SkipNginx -SkipCertbot`

## ✅ À vérifier après déploiement
1. Page **Palmarès** → onglet **Classique** : les joueurs qui ont misé
   en Quitte ou double / Joker ont leurs **points de base** (plus de 498 gonflé).
2. Onglet **Avec mises** : inchangé (les gros gains +150, etc.).
3. Les deux totaux doivent maintenant être **différents**.

Envoie-moi une **capture des deux onglets**.

## 📂 Fichier modifié
- `server.js`
