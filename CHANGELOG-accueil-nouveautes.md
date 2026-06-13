# CHANGELOG — Accueil (13/06/2026)

## Ajouté
- Section « Quoi de neuf ? » sur l'accueil : 4 cartes présentant le Lot 1
  (badge 🎯, compte à rebours ⏳, classement vivant ↕️, résumés ▶️),
  cliquables vers Parier / Palmarès.
  (`public/index.html`, nouveau `public/css/home-news.css`)

## Modifié
- Le compte à rebours de l'accueil vise désormais le **prochain match**
  (récupéré via l'API) au lieu de la date fixe du 11 juin. Affiche les
  équipes concernées, et un message d'attente quand tout est joué.
  (`public/js/main.js`, `public/index.html`)

## Inchangé
- Reste de l'accueil, autres pages, serveur, données.
