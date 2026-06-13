# CHANGELOG v1.6.3 - fix-port corrige (bug CRLF)

## Probleme (v1.6.2)
Le script `fix-port-coupe-maison.ps1` plantait cote serveur :
  bash: line 5: $'\r': command not found
  syntax error near unexpected token `$'do\r''
Cause : le fichier .ps1 etait en retours Windows (CRLF). Le bloc bash
envoye au serveur contenait donc des \r en fin de ligne, que bash refuse.

## Correctif
- Fichier regenere en retours Unix (LF) + BOM UTF-8.
- `Invoke-SshBash` retire desormais les \r AVANT l'encodage base64
  (double securite : marche meme si un editeur repasse le fichier en CRLF).
- Bash inchange (detection port libre 5710+, .env, pm2, nginx proxy_pass, verif).

## A faire
Relancer :
  cd C:\Agile\coupe-maison
  Unblock-File .\fix-port-coupe-maison.ps1
  .\fix-port-coupe-maison.ps1
