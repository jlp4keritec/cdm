# Changelog — v1.4 "Lieu + date"

## Ajouté
- Date du match à côté de l'heure en vue "par tour".
- Affichage du lieu du match (📍) en vues "par jour" et "par tour"
  (si l'API le fournit).

## Modifié
- data/football.js : ajoute le champ "venue" aux matchs.
- public/js/competition.js : renderMatch(m, showDate) + lieu.
- public/css/competition.css : style .m-venue.

## Note
- Le lieu dépend de l'API (plan gratuit parfois sans "venue").
