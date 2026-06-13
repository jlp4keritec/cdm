# Changelog - Activation organisateur

## Ajoute
- make-organisateur-coupe-maison.ps1 (racine du projet) :
  - se connecte au VPS (deploy-config.json, comme le deploiement),
  - envoie et execute set-organisateur.cjs sur le serveur,
  - redemarre l'appli (pm2 restart coupe-maison --update-env).
- set-organisateur.cjs :
  - marque le compte cible comme organisateur dans data/users.json
    (champs isAdmin / admin / role = true),
  - inscrit son email comme ADMIN_EMAIL dans .env (tient apres redeploiement),
  - cree une sauvegarde users.json.bak-<date> avant toute ecriture.

## Cible
- VPS : /home/ubuntu/coupe-maison · service PM2 "coupe-maison"
- Compte par defaut : "Jean-Luc" (option -Pseudo pour un autre)

## Non modifie
- Aucun changement dans le code de l'application.
- Pronos (data/bets.json) et autres comptes inchanges.
