# Deploiement en production - coupe.arkkam.com (script corrige)

## Correction
Le script precedent plantait a cause de l'encodage (UTF-8 sans BOM lu de
travers par PowerShell 5.1). Corrige selon les conventions :
- enregistre en UTF-8 AVEC BOM,
- chaines PowerShell en ASCII pur (accents seulement dans les commentaires),
- wrappers SSH avec | Out-Host (code retour fiable).

## 1) DNS a ajouter (chez ton registrar, ex. GoDaddy)
  Type : A   |   Nom : coupe   |   Valeur : 151.80.232.214   |   TTL : 1h
Verif :  nslookup coupe.arkkam.com  -> doit repondre 151.80.232.214

## 2) Avant de lancer
- C:\Agile\deploy-config.json present (cle SSH du VPS)
- C:\Agile\coupe-maison\.env avec au moins  FOOTBALL_API_KEY=ta_cle

## 3) Lancer (depuis C:\Agile\coupe-maison)
    Unblock-File .\deploy-coupe-maison.ps1
    .\deploy-coupe-maison.ps1

- Sans HTTPS d'abord (si DNS pas encore propage) :
    .\deploy-coupe-maison.ps1 -SkipCertbot
  puis relancer sans l'option une fois nslookup OK.

## Cible
- URL : https://coupe.arkkam.com  |  port 5705  |  PM2 coupe-maison
- Comptes (data/users.json) et pronos (data/bets.json) preserves.
