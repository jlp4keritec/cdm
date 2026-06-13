# Suppression des boutons Poules/Calendrier (page Compétition)

## Ce que ça change
- Les deux boutons "Poules / Calendrier" en haut de la page Compétition
  sont retirés (doublon avec le menu du site).
- C'est désormais le MENU (Poules / Calendrier) qui pilote l'affichage,
  même quand tu es déjà sur la page : cliquer "Calendrier" bascule la vue
  sans recharger, et l'élément du menu correspondant se met en avant.

## Fichiers (dans la bonne arborescence)
- public/competition.html   ← boutons retirés
- public/js/competition.js   ← l'affichage suit le menu (#poules / #calendrier)

## Pour tester
1. Backup d'abord.
2. Décompresse à la racine du projet.
3. npm start puis Ctrl + F5 sur la page Compétition.
4. Depuis le menu, clique "Poules" puis "Calendrier" : la vue change.
