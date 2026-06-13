# Changelog — v1.0 "Kikko Elo"

## Ajouté
- `data/elo.js` : notes Elo réelles de 24 sélections (eloratings.net, 7 juin 2026).

## Modifié
- `data/pronostic.js` : calcul basé sur l'Elo si les deux équipes en ont une,
  sinon classement FIFA (jamais de mélange).
- `public/js/paris.js` : bulle d'analyse réorganisée (en-tête, lignes, score, source).
- `public/css/paris.css` : nouveau style de bulle (remplace l'ancienne info-bulle texte).

## Limites connues
- Pays hôtes (USA, Mexique, Canada) et quelques équipes sans Elo automatique :
  calcul au classement FIFA en attendant (complétable via capture).
