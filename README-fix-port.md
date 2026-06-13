# Correctif : coupe.arkkam.com affichait un autre site

## Cause (confirmee par l'audit)
Le port **5705** etait occupe par **dila-local-mcp** (ton app DILA).
nginx envoyait donc coupe.arkkam.com vers ce mauvais programme.
coupe-maison, lui, restait en erreur (il n'avait pas de port a lui).

## Ce que fait le script
Tout cote serveur, en une fois :
1. trouve un port libre (5710+) ;
2. l'ecrit dans /home/ubuntu/coupe-maison/.env ;
3. redemarre coupe-maison (pm2) sur ce port ;
4. repointe nginx vers ce port en ne touchant QUE `proxy_pass`
   -> le certificat HTTPS reste intact ;
5. verifie que l'app (local) et le site (HTTPS) repondent.
Il ne touche pas a l'app DILA.

## Note v2
Cette version corrige un bug de retours de ligne (CRLF) qui faisait
planter la v1. Le fichier est maintenant en LF et le script nettoie
les \r automatiquement avant d'envoyer les commandes au serveur.

## Utilisation
1. Mettre fix-port-coupe-maison.ps1 dans C:\Agile\coupe-maison\
2. PowerShell :
     cd C:\Agile\coupe-maison
     Unblock-File .\fix-port-coupe-maison.ps1
     .\fix-port-coupe-maison.ps1
3. Resultat attendu :
     App coupe-maison (localhost:5710/) : HTTP 200
     Public (https://coupe.arkkam.com/) : HTTP 200
     FIX_DONE port=5710
4. Ouvrir https://coupe.arkkam.com (Ctrl+F5).

## Prochaines mises a jour de code
Lancer le deploiement en preservant nginx/SSL :
     .\deploy-coupe-maison.ps1 -SkipNginx -SkipCertbot
