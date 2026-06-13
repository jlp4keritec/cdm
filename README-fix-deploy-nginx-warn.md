# Correctif déploiement — l'avertissement nginx ne bloque plus

## Le problème (ta capture)
Le déploiement allait jusqu'au bout (« Code déployé + dépendances installées »),
puis s'arrêtait sur ce message :

> [warn] protocol options redefined for 0.0.0.0:443 in
> .../iaact.mesoutilsagile.com.conf:18

Ce n'est **pas une erreur de ton site** : c'est un simple avertissement nginx
provenant d'un **autre site** du serveur (iaact). Mais comme le script était en
mode « stop à la moindre alerte », PowerShell le prenait pour une erreur fatale
(ligne 82).

## Le correctif
Dans `deploy-coupe-maison.ps1`, les trois fonctions qui lancent SSH ne
considèrent plus les avertissements (sortie d'erreur) comme des erreurs fatales.
Le reste du script est **inchangé** (port conservé, HTTPS préservé, certificat
non redemandé).

## Quoi faire
1. Remplace `deploy-coupe-maison.ps1` par celui de ce ZIP.
2. **D'abord, vérifie ton site** : il est probablement déjà à jour, car le
   plantage arrivait tout à la fin. Va sur https://coupe.arkkam.com
   (menu « Où regarder » + « PARIER », page `/tv`).
3. Si quelque chose manque, relance simplement le déploiement (sans risque,
   il garde le port et ne touche pas au HTTPS) :
   ```powershell
   Unblock-File .\deploy-coupe-maison.ps1
   .\deploy-coupe-maison.ps1
   ```

Cette fois, l'avertissement iaact s'affichera mais le script ira jusqu'au bout.
