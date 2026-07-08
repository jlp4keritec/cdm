# Changelog — v0.9.3 "Tirs au but"

## Corrigé
- **Bug des tirs au but** : les penalties étaient comptés comme des buts.
  L'API football-data.org met le score des t.a.b. dans `fullTime`
  (ex. Suisse-Colombie 0-0 a.p. renvoyé en 4-3). Le score retenu est
  désormais celui du coup de sifflet final = temps réglementaire + prolongation,
  **sans** les tirs au but. Corrige à la fois le calcul des points et
  l'affichage "Score final" (paris, palmarès, mondial, compétition).

## Ajouté
- Mention **"t.a.b. 4-3"** sous le score, sur la page "Mes paris passés",
  pour les matchs décidés aux tirs au but.

## Modifié
- `data/football.js` : helper `realScore(score)` + champs `pensHome`/`pensAway`.
- `public/js/paris.js` : affichage de la mention t.a.b. dans `renderDoneRow`.
- `public/css/paris.css` : style `.m-pens`.

## Inchangé
- Aucune nouvelle dépendance, aucune clé, aucun appel externe.
- Points recalculés à chaque chargement → correction rétroactive.
