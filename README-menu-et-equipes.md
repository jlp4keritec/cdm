# Menu uniforme + cartes équipes + popup au clic — livraison

## 1) Même menu sur toutes les pages (en boutons)
Avant, les pages n'avaient pas le même menu (tu ne l'avais jamais appliqué).
Maintenant, partout, le même menu à boutons :
  Accueil · Poules · Calendrier · Équipes · Paris · Palmarès
- La page courante est mise en avant (bouton en dégradé bleu→rose).
- Poules → /competition#poules · Calendrier → /competition#calendrier
  (ouvrent directement le bon onglet).

## 2) Cartes équipes (vue "par groupe")
- Suppression des lignes "0 J" et "0V 0N 0D" sur chaque carte
  (inutiles avant le début du tournoi). Les points restent affichés.

## 3) Popup d'une équipe : au CLIC
- La fiche détaillée d'une équipe s'ouvre maintenant au **clic**
  (et plus au survol). Re-cliquer ou cliquer ailleurs la ferme.
  (Échap ferme aussi ; Entrée/Espace au clavier l'ouvre.)

## Fichiers (déjà dans la bonne arborescence)
- public/index.html, competition.html, equipes.html, paris.html,
  palmares.html, compte.html   ← menus uniformisés
- public/css/styles.css        ← style boutons du menu + curseur cliquable
- public/css/competition.css   ← menu visible sur mobile
- public/js/competition.js     ← ouvre l'onglet selon #poules / #calendrier
- public/js/equipes.js         ← cartes sans 0 J / 0V 0N 0D
- public/js/teams-tooltip.js   ← popup au clic

## Important
Remplace bien TOUS ces fichiers (c'est ce qui rend le menu identique partout).
Tes fichiers de pronostic (paris.js, pronostic.js, elo.js) ne sont pas
touchés : garde-les.

## Pour tester
1. Backup d'abord.
2. Décompresse le zip à la racine du projet.
3. npm start puis Ctrl + F5.
4. Vérifie : même menu partout · clique une carte équipe pour voir la fiche.
