# ============================================================
#  fix-port-coupe-maison.ps1  (v2 - corrige le bug CRLF)
#  Corrige le conflit de port : 5705 etait pris par dila-local-mcp.
#  Place coupe-maison sur un port libre (5710+) et repointe nginx
#  dessus SANS casser le certificat SSL (sed cible proxy_pass).
#  Conventions powershell-bash-escapes : bash base64, strings ASCII,
#  | Out-Host avant return, fichier UTF-8 AVEC BOM + retours LF.
#  IMPORTANT : Invoke-SshBash retire les \r avant l'encodage base64
#  (sinon bash plante avec "$'\r': command not found").
#  Lancer :  Unblock-File .\fix-port-coupe-maison.ps1 ; .\fix-port-coupe-maison.ps1
# ============================================================

param(
  [string]$ProjectPath = "C:\Agile\coupe-maison"
)
$ErrorActionPreference = "Stop"

function Write-Step($m){ Write-Host "`n==> $m" -ForegroundColor Cyan }
function Write-OK($m){ Write-Host "[OK] $m" -ForegroundColor Green }
function Write-Fail($m){ Write-Host "[KO] $m" -ForegroundColor Red }

function Get-DeployConfig {
  $candidates = @(
    (Join-Path $PSScriptRoot "deploy-config.json"),
    (Join-Path (Get-Location) "deploy-config.json"),
    (Join-Path $ProjectPath "deploy-config.json"),
    "C:\vpn\wg-vpn-deploy\deploy-config.json",
    "C:\Agile\deploy-config.json"
  )
  foreach ($c in $candidates) {
    if ($c -and (Test-Path $c)) { Write-OK "Config : $c"; return (Get-Content $c -Raw | ConvertFrom-Json) }
  }
  Write-Fail "deploy-config.json introuvable (attendu dans C:\Agile\)."
  exit 1
}
function Get-SshArgs($cfg){
  $a = @("-o","StrictHostKeyChecking=no","-o","ConnectTimeout=20","-p",$cfg.port)
  if ($cfg.authMethod -eq "key" -and $cfg.sshKeyPath) { $a += @("-i",$cfg.sshKeyPath) }
  return $a
}
function Invoke-Ssh($cfg,$cmd){
  & ssh @(Get-SshArgs $cfg) "$($cfg.user)@$($cfg.host)" $cmd | Out-Host
  return $LASTEXITCODE
}
function Invoke-SshBash($cfg,$script){
  # CORRECTIF CLE : retirer les retours Windows (\r) sinon bash plante.
  $script = $script -replace "`r`n", "`n"
  $script = $script -replace "`r", "`n"
  $b64 = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($script))
  & ssh @(Get-SshArgs $cfg) "$($cfg.user)@$($cfg.host)" "echo $b64 | base64 -d | bash -s" | Out-Host
  return $LASTEXITCODE
}

Write-Host "============================================" -ForegroundColor Magenta
Write-Host "  Correction du port -> coupe.arkkam.com" -ForegroundColor Magenta
Write-Host "============================================" -ForegroundColor Magenta

$cfg = Get-DeployConfig

Write-Step "Test de la connexion SSH"
if ((Invoke-Ssh $cfg "echo CONNECTED") -ne 0) { Write-Fail "Connexion SSH impossible."; exit 1 }
Write-OK "SSH ok"

Write-Step "Recherche d'un port libre + repointage nginx (SSL preserve)"
$bash = @'
set -u
REMOTE_DIR="/home/ubuntu/coupe-maison"
PM2_NAME="coupe-maison"
FQDN="coupe.arkkam.com"

echo "=== Diagnostic avant correction ==="
echo "-- pm2 (liste) --"; pm2 list 2>/dev/null | grep -E "coupe-maison" || true
echo "-- qui ecoute sur 5705 ? --"; ss -ltnp 2>/dev/null | grep ":5705 " || echo "(rien via ss sans sudo)"

cd "$REMOTE_DIR" || { echo "KO: dossier $REMOTE_DIR introuvable"; exit 1; }

# 1) Trouver un port reellement libre dans 5710-5799
FREE_PORT=""
for p in $(seq 5710 5799); do
  if ! ss -ltn 2>/dev/null | awk '{print $4}' | grep -q ":$p\$"; then FREE_PORT=$p; break; fi
done
if [ -z "$FREE_PORT" ]; then echo "KO: aucun port libre 5710-5799"; exit 1; fi
echo ""
echo "=== Port libre choisi : $FREE_PORT ==="

# 2) Ecrire PORT dans .env (remplace l'ancien)
touch .env
sed -i '/^PORT=/d' .env
echo "PORT=$FREE_PORT" >> .env
echo "-- .env (PORT) --"; grep '^PORT=' .env

# 3) Redemarrer coupe-maison sur ce port (fork, 1 instance, via ecosystem)
pm2 delete "$PM2_NAME" >/dev/null 2>&1 || true
pm2 start ecosystem.config.cjs >/dev/null 2>&1
pm2 save >/dev/null 2>&1
sleep 2
echo "-- pm2 status --"; pm2 describe "$PM2_NAME" 2>/dev/null | grep -E "status|restarts|exec mode" | head -3 || true

# 4) Repointer nginx vers le bon port SANS toucher au SSL (sed cible proxy_pass)
VHOST="/etc/nginx/sites-available/${FQDN}.conf"
if [ ! -f "$VHOST" ]; then VHOST="/etc/nginx/sites-available/${FQDN}"; fi
if [ -f "$VHOST" ]; then
  echo "-- vhost : $VHOST --"
  sudo sed -i -E "s#proxy_pass http://localhost:[0-9]+#proxy_pass http://localhost:${FREE_PORT}#g" "$VHOST"
  sudo sed -i -E "s#proxy_pass http://127.0.0.1:[0-9]+#proxy_pass http://127.0.0.1:${FREE_PORT}#g" "$VHOST"
  echo "-- proxy_pass apres correction --"; grep -n "proxy_pass" "$VHOST" || true
  if sudo nginx -t 2>/dev/null; then sudo systemctl reload nginx; echo "[OK] nginx recharge"; else echo "[KO] nginx -t a echoue"; sudo nginx -t; fi
else
  echo "[KO] vhost nginx introuvable pour $FQDN"
fi

# 5) Verifications
echo ""
echo "=== Verifications ==="
sleep 1
LOCAL=$(curl -s -o /dev/null -w '%{http_code}' "http://localhost:${FREE_PORT}/")
echo "App coupe-maison (localhost:${FREE_PORT}/) : HTTP $LOCAL"
PUB=$(curl -s -o /dev/null -w '%{http_code}' -k "https://${FQDN}/")
echo "Public (https://${FQDN}/)               : HTTP $PUB"
if [ "$LOCAL" = "200" ] && { [ "$PUB" = "200" ] || [ "$PUB" = "304" ]; }; then
  echo "[OK] coupe-maison repond sur le port $FREE_PORT"
else
  echo "[?] A verifier dans le navigateur. Sinon : pm2 logs $PM2_NAME --lines 30"
fi
echo "FIX_DONE port=$FREE_PORT"

'@
$code = Invoke-SshBash $cfg $bash
if ($code -eq 0) { Write-OK "Termine. Ouvre https://coupe.arkkam.com (Ctrl+F5 pour vider le cache)." }
else { Write-Fail "Code de retour != 0. Regarde les lignes [KO] ci-dessus." }
