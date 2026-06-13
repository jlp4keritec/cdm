# CHANGELOG v1.6.2 - Correctif port (deploiement)

## Probleme
- coupe.arkkam.com affichait une AUTRE application (DILA) au lieu de coupe-maison.
- Cause : le port 5705 etait deja pris par cette autre app ; nginx pointait
  donc vers le mauvais programme (reponse 302 -> /admin).

## Ajout
- `fix-port-coupe-maison.ps1` (a la racine du projet) :
  - detecte un port libre (5710-5799) cote serveur ;
  - met a jour PORT dans .env ;
  - redemarre coupe-maison (pm2) sur ce port ;
  - repointe nginx (proxy_pass uniquement) -> SSL/HTTPS preserve ;
  - verifications locale + publique.

## A retenir
- Re-deploiements ulterieurs : utiliser
  `deploy-coupe-maison.ps1 -SkipNginx -SkipCertbot`
  pour ne pas reecraser la config nginx/SSL ni le port corrige.
