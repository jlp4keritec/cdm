# Deux pronostics (Elo + FIFA) — livraison

## Ce que ça change
- La bulle de Kikko montre maintenant les DEUX pronostics côte à côte :
  une colonne "Elo" et une colonne "FIFA" (probabilités + score probable).
- Chaque équipe affiche ses DEUX classements : rang FIFA et note Elo.
- Si une équipe n'a pas d'Elo (ex. pays hôtes), seule la colonne FIFA
  s'affiche, avec une petite note. La phrase "Kikko pronostique ..."
  utilise l'Elo si dispo, sinon le FIFA.

## Fichiers (déjà dans la bonne arborescence)
- data/pronostic.js    ← remplace (calcule Elo + FIFA)
- public/js/paris.js   ← remplace (bulle en tableau comparatif)
- public/css/paris.css ← remplace (style du tableau)

Note : data/elo.js n'a pas changé depuis la dernière livraison, il n'est
pas inclus. Garde celui que tu as déjà.

## Fonctions livrées
- `pronoFor(home, away)` (maj) dans `data/pronostic.js` — renvoie `elo` et `fifa`.
- `predict(ratH, ratA)` (interne) — la formule Elo (identique au standard).
- `kikkoHint(m)` (maj) dans `public/js/paris.js` — le tableau comparatif.

## Pour tester
1. Backup d'abord.
2. Décompresse ce zip à la racine du projet (complète data/ et public/).
3. `npm start` puis `Ctrl + F5` sur la page Paris.
4. Survole le "i" : tu dois voir les colonnes Elo et FIFA.
