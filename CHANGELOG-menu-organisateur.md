# Changelog - Lien "Organisateur" dans le menu

## Modifie
- public/js/auth.js :
  - ajoute un lien "⚙️ Organisateur" -> /compte dans la barre du menu,
    visible UNIQUEMENT quand le compte connecte est l'organisateur (me.isAdmin),
  - le pseudo continue de pointer vers le tableau de bord (/tableau),
  - aucun autre comportement modifie.

## Non modifie
- Aucun changement cote serveur (server.js).
- Aucun changement de donnees (comptes, pronos).

## Deploiement conseille
- deploy-coupe-maison.ps1 -SkipNginx -SkipCertbot  (mise a jour de code seule)
