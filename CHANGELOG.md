# Changelog — v0.8 "Kikko"

## Ajouté
- Algo de pronostic **Kikko** (`data/pronostic.js`) basé sur le classement FIFA.
- Affichage sous chaque match : "Kikko pronostique … . Choisis ton score".
- Info-bulle ⓘ avec l'analyse (rangs, probabilités, score probable).

## Modifié
- `data/football.js` : chaque match porte désormais un champ `prono`.
- `public/js/paris.js` : nouveau helper `kikkoHint(m)`.
- `public/css/paris.css` : style de la phrase Kikko + info-bulle.

## Inchangé
- Aucune nouvelle dépendance, aucune clé, aucun appel externe.
