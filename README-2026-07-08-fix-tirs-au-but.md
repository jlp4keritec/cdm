# Correctif + mention tirs au but (v0.9.3)

## Fonctions livrées
- `realScore(score)` dans `data/football.js` : score de foot hors t.a.b.
- Mention t.a.b. dans `renderDoneRow` (`public/js/paris.js`).

## Le problème
Sur un match aux tirs au but (ex. Suisse-Colombie), l'app affichait
"Score final 4-3" et comptait les penalties comme des buts. Le vrai
score était 0-0. L'API met les penalties dans `fullTime`.

## La correction
- Score reconstruit à partir de `regularTime` + `extraTime` (sans penalties).
  Un seul point de correction dans `data/football.js` corrige le calcul des
  points ET l'affichage sur toutes les pages.
- La page "Mes paris passés" affiche en plus "t.a.b. 4-3" sous le score.

## Fichiers dans le ZIP (remplacements complets)
- `data/football.js`
- `public/js/paris.js`
- `public/css/paris.css`
- `package.json` (v0.9.3)
- `CHANGELOG.md`, `README-2026-07-08-fix-tirs-au-but.md`

## Installation
Extraire le ZIP à la racine du projet. Aucune commande, aucune dépendance.
