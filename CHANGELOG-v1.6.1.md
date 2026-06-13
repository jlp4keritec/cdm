# Changelog - v1.6.1 "Fix encodage script de deploiement"

## Corrige
- deploy-coupe-maison.ps1 : plantage PowerShell 5.1 (UTF-8 sans BOM).
  -> re-encode UTF-8 + BOM, chaines en ASCII pur, wrappers SSH avec Out-Host.

## Inchange
- ecosystem.config.cjs, paris.js (identiques a v1.6).
