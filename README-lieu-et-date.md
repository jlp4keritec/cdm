# Lieu du match + date en vue "par tour" — livraison

## Ce que ça change (page Compétition → Calendrier)
- VUE PAR TOUR : la date du match s'affiche maintenant à côté de l'heure
  (ex. "sam. 13 juin · 21:00").
- VUE PAR JOUR ET PAR TOUR : le lieu du match s'affiche (📍) à côté de
  l'heure et du groupe, QUAND l'API le fournit.

## ⚠️ Important sur le lieu (à lire)
Le lieu vient de l'API football-data.org (champ "venue", souvent le nom du
STADE plutôt que la ville). Deux cas possibles :
- s'il s'affiche : parfait ;
- s'il reste vide : c'est que le plan GRATUIT de l'API ne renvoie pas ce
  champ pour la Coupe du monde. Dans ce cas, dis-le moi : je peux intégrer
  le calendrier officiel des villes (les 16 stades USA/Canada/Mexique)
  en dur — il me faudra juste la liste officielle des matchs/villes.

## Fichiers (dans la bonne arborescence)
- data/football.js          ← récupère le lieu (venue) de l'API
- public/js/competition.js   ← date en vue par tour + affichage du lieu
- public/css/competition.css ← style du lieu (📍)
- public/competition.html    ← (inclus pour cohérence : onglets déjà retirés)

## Pour tester
1. Backup d'abord.
2. Décompresse à la racine du projet.
3. npm start puis Ctrl + F5 sur Compétition → Calendrier.
4. Regarde la vue "par tour" : la date apparaît à côté de l'heure.
   Si le 📍 lieu ne s'affiche pas, c'est l'API (voir note ci-dessus).
