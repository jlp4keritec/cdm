# Changelog - Deploiement blinde

## Modifie
- deploy-coupe-maison.ps1 :
  - PORT n'est plus ecrit en dur (5705 supprime) ; le serveur garde le
    port du .env, sinon choisit un port libre 5710-5799 (jamais 5705) ;
  - nginx est repointe via "sed proxy_pass" quand le vhost existe deja
    -> le certificat HTTPS n'est plus ecrase ;
  - certbot n'est lance que si aucun certificat n'existe encore
    (plus de demande d'email a chaque deploiement) ;
  - verification publique finale sur https://coupe.arkkam.com ;
  - options -SkipNginx/-SkipCertbot devenues inutiles (script sur par defaut).

## Corrige
- Lancer le deploiement sans options ne casse plus le site
  (ne pointe plus vers l'appli DILA).

## Non modifie
- Aucun changement de code applicatif ni de donnees.
