# Tooltip + Elo — livraison

## Ce que ça change
- La bulle d'analyse de Kikko est **réorganisée** : un en-tête, une ligne
  par issue (équipe / nul / équipe) avec le %, le score probable, et en
  bas la base de calcul. Fini le pavé de texte.
- Kikko utilise maintenant la **note Elo** quand les deux équipes en ont
  une (meilleur indicateur que le rang FIFA). Sinon il garde le rang FIFA.
  Il ne mélange jamais les deux (échelles différentes).
- La bulle indique toujours sur quoi Kikko s'appuie ("basé sur l'Elo" ou
  "basé sur le classement FIFA").

## Important (honnêteté sur les données)
- eloratings.net n'est pas récupérable automatiquement (page JavaScript).
- J'ai donc relevé les Elo réels (7 juin 2026) de **24 équipes** via un
  miroir : tous les favoris et beaucoup d'autres.
- Il manque encore quelques équipes, dont les **3 pays hôtes**
  (USA, Mexique, Canada) : pour ces matchs, Kikko utilise le rang FIFA.
- Si tu veux l'Elo complet : envoie-moi une capture de la liste Elo
  (comme tu l'avais fait pour le classement FIFA) et je complète
  le fichier `data/elo.js` en 2 minutes.

## Fichiers (déjà dans la bonne arborescence)
- data/elo.js          ← NOUVEAU (les notes Elo)
- data/pronostic.js    ← remplace (utilise l'Elo)
- public/js/paris.js   ← remplace (nouvelle bulle)
- public/css/paris.css ← remplace (style de la bulle)

## Fonctions livrées
- `eloFor(name)` dans `data/elo.js`
- `pronoFor(home, away)` (mis à jour) dans `data/pronostic.js`
- `kikkoHint(m)` (mise en page de la bulle) dans `public/js/paris.js`

## Pour tester
1. Backup d'abord.
2. Décompresse ce zip à la racine de ton projet (il complète data/ et public/).
3. `npm start` puis `Ctrl + F5` sur la page Paris.
4. Survole le "i" : la bulle doit afficher Elo + probabilités + score.
