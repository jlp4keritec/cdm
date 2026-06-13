# Deploiement "blinde" - Coupe a la maison

## Ce qui change
Avant, si tu lancais le deploiement sans options, il repointait le site
vers le mauvais programme (DILA) et le site tombait. C'est fini.

Le nouveau script se debrouille tout seul :
- il GARDE le port qui marche deja, ou en choisit un libre automatiquement
  (jamais le 5705 qui est pris par DILA) ;
- il repointe nginx vers le bon port SANS jamais toucher au certificat HTTPS ;
- il ne redemande PLUS le certificat a chaque fois (seulement s'il n'existe pas).

=> Tu peux le lancer SANS aucune option, en toute securite.

## Fonction livree
- deploy-coupe-maison.ps1 : deploiement complet avec port automatique
  et repointage nginx securise (SSL preserve).

## Fichier dans le ZIP (a coller a la racine du projet)
- deploy-coupe-maison.ps1   (remplace l'ancien)

## Etapes
1. Decompresse ce ZIP a la racine de C:\Agile\coupe-maison
   -> il remplace deploy-coupe-maison.ps1.
2. Dans PowerShell, depuis C:\Agile\coupe-maison :

       Unblock-File .\deploy-coupe-maison.ps1
       .\deploy-coupe-maison.ps1

   (Plus besoin de -SkipNginx ni -SkipCertbot : le script gere tout seul.)

3. A la fin tu dois voir quelque chose comme :

       [OK] Appli sur le port 57xx, nginx repointe (HTTPS preserve)
       [OK] L'appli repond en local (HTTP 200)
       [OK] Certificat HTTPS deja present -> rien a faire
       Reponse publique : HTTP 200
       Termine -> https://coupe.arkkam.com

4. Ouvre coupe.arkkam.com et fais Ctrl+F5.

## Bon a savoir
- Lancer ce script repare aussi le site s'il pointait au mauvais endroit :
  une seule execution suffit, plus besoin de fix-port-coupe-maison.ps1.
- Tes comptes (data/users.json) et pronos (data/bets.json) sont preserves.
- La cle API (.env) n'est envoyee qu'au tout premier deploiement.
