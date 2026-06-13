# ============================================================
#  deploy-coupe-maison.ps1  (version blindee)
#  Deploie "Coupe a la maison" sur le VPS OVH -> coupe.arkkam.com
#
#  Ce qui change vs l'ancienne version :
#   - Le PORT n'est plus ecrit en dur (fini le conflit avec DILA/5705).
#     Le serveur GARDE le port deja en place (dans .env) ; s'il n'y en a
#     pas, il choisit automatiquement un port libre (5710-5799, jamais 5705).
#   - Nginx est repointe vers le BON port sans jamais casser le HTTPS
#     (on modifie seulement la ligne proxy_pass quand le site existe deja).
#   - Le certificat HTTPS n'est PLUS redemande a chaque fois : il n'est
#     installe que s'il n'existe pas encore.
#   => Tu peux lancer ce script SANS option, en toute securite.
#
#  Conventions powershell-bash-escapes :
#   1. Bash via SSH -> @'...'@ + markers __VAR__ + base64
#   2. Strings PS en ASCII pur (accents seulement dans les commentaires)
#   6. Wrapper natif -> | Out-Host avant return $LASTEXITCODE
#  Fichier enregistre en UTF-8 AVEC BOM (sinon PowerShell 5.1 plante).
#  Lancer :  Unblock-File .\deploy-coupe-maison.ps1 ; .\deploy-coupe-maison.ps1
# ============================================================

param(
  [switch]$SkipCertbot,
  [switch]$LogsAfter,
  [string]$ProjectPath = "C:\Agile\coupe-maison"
)

$ErrorActionPreference = "Stop"

# ---- Variables du projet ----
$SUBDOMAIN  = "coupe"
$DOMAIN     = "arkkam.com"
$FQDN       = "$SUBDOMAIN.$DOMAIN"
$PM2_NAME   = "coupe-maison"
$REMOTE_DIR = "/home/ubuntu/coupe-maison"

function Write-Step($m){ Write-Host "`n==> $m" -ForegroundColor Cyan }
function Write-OK($m){ Write-Host "[OK] $m" -ForegroundColor Green }
function Write-Fail($m){ Write-Host "[KO] $m" -ForegroundColor Red }

# ---- 1) Config SSH (deploy-config.json) ----
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
function Get-ScpArgs($cfg){
  $a = @("-o","StrictHostKeyChecking=no","-P",$cfg.port)   # SCP : -P majuscule
  if ($cfg.authMethod -eq "key" -and $cfg.sshKeyPath) { $a += @("-i",$cfg.sshKeyPath) }
  return $a
}
# Regle 6 : | Out-Host draine la stdout avant return -> code retour fiable
function Invoke-Ssh($cfg,$cmd){
  $eap = $ErrorActionPreference; $ErrorActionPreference = 'Continue'
  try { & ssh @(Get-SshArgs $cfg) "$($cfg.user)@$($cfg.host)" $cmd 2>&1 | Out-Host }
  finally { $ErrorActionPreference = $eap }
  return $LASTEXITCODE
}
# Regle 1 : bash encode en base64 (zero enfer de quoting). Affiche la sortie.
function Invoke-SshBash($cfg,$script){
  $b64 = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($script))
  $eap = $ErrorActionPreference; $ErrorActionPreference = 'Continue'
  try { & ssh @(Get-SshArgs $cfg) "$($cfg.user)@$($cfg.host)" "echo $b64 | base64 -d | bash -s" 2>&1 | Out-Host }
  finally { $ErrorActionPreference = $eap }
  return $LASTEXITCODE
}
# Variante qui CAPTURE la sortie (pour lire le port resolu cote serveur)
function Invoke-SshBashCapture($cfg,$script){
  $b64 = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($script))
  $eap = $ErrorActionPreference; $ErrorActionPreference = 'Continue'
  try { $out = & ssh @(Get-SshArgs $cfg) "$($cfg.user)@$($cfg.host)" "echo $b64 | base64 -d | bash -s" 2>&1 | Out-String }
  finally { $ErrorActionPreference = $eap }
  return $out
}

# ============================================================
Write-Host "============================================" -ForegroundColor Magenta
Write-Host "  Deploiement Coupe a la maison -> $FQDN" -ForegroundColor Magenta
Write-Host "============================================" -ForegroundColor Magenta

if (-not (Test-Path $ProjectPath)) { Write-Fail "Projet introuvable : $ProjectPath"; exit 1 }
$cfg = Get-DeployConfig

# ---- 2) Test SSH ----
Write-Step "Test de la connexion SSH"
if ((Invoke-Ssh $cfg "echo CONNECTED") -ne 0) { Write-Fail "Connexion SSH impossible."; exit 1 }
Write-OK "SSH ok"

# ---- 3) Premier deploiement ? ----
$firstDeploy = $false
& ssh @(Get-SshArgs $cfg) "$($cfg.user)@$($cfg.host)" "test -f $REMOTE_DIR/ecosystem.config.cjs" 2>$null
if ($LASTEXITCODE -ne 0) { $firstDeploy = $true }
$modeTxt = if ($firstDeploy) { "PREMIER deploiement" } else { "mise a jour" }
Write-Host ("Mode : " + $modeTxt) -ForegroundColor Yellow

$ans = Read-Host "Continuer le deploiement vers $FQDN ? (O/n)"
if ($ans -and $ans -notmatch '^[oOyY]') { Write-Host "Annule."; exit 0 }

# ---- 4) .env local requis (1er deploiement) ----
$envLocal = Join-Path $ProjectPath ".env"
if ($firstDeploy -and -not (Test-Path $envLocal)) {
  Write-Fail "Pas de .env local ($envLocal). Cree-le (au moins FOOTBALL_API_KEY=...) puis relance."
  exit 1
}

# ---- 5) Paquet tar.gz (chemins Unix, exclusions strictes) ----
Write-Step "Creation du paquet (tar.gz)"
$tarPath = Join-Path $env:TEMP "coupe-maison.tar.gz"
if (Test-Path $tarPath) { Remove-Item $tarPath -Force }
& tar -czf $tarPath -C $ProjectPath `
  --exclude=node_modules --exclude=.git --exclude=.env `
  --exclude=deploy-config.json --exclude=*.ps1 --exclude=*.bat `
  --exclude=set-organisateur.cjs `
  --exclude=*.tar.gz --exclude=*.zip --exclude=*.bak --exclude=*.log `
  --exclude=data/users.json --exclude=data/bets.json --exclude=data/standings-history.json `
  .
if ($LASTEXITCODE -ne 0) { Write-Fail "tar a echoue"; exit 1 }
Write-OK ("Paquet : " + ("{0:N0} Ko" -f ((Get-Item $tarPath).Length/1KB)))

# ---- 6) Envoi du paquet ----
Write-Step "Envoi du paquet sur le VPS"
& scp @(Get-ScpArgs $cfg) $tarPath "$($cfg.user)@$($cfg.host):/tmp/coupe-maison.tar.gz" | Out-Host
if ($LASTEXITCODE -ne 0) { Write-Fail "scp a echoue"; exit 1 }
Write-OK "Paquet envoye"

# ---- 7) Phase A : extraction + dependances (donnees preservees) ----
Write-Step "Extraction + dependances sur le VPS"
$bashA = @'
set -euo pipefail
REMOTE_DIR="__REMOTE_DIR__"
PM2_NAME="__PM2_NAME__"
TMP="/tmp/${PM2_NAME}_extract"

mkdir -p "$REMOTE_DIR" "$REMOTE_DIR/data"

# Sauvegarde .env + donnees (comptes / pronos)
[ -f "$REMOTE_DIR/.env" ] && cp "$REMOTE_DIR/.env" "/tmp/${PM2_NAME}_env.bak" || true
mkdir -p "/tmp/${PM2_NAME}_data.bak"
[ -f "$REMOTE_DIR/data/users.json" ] && cp "$REMOTE_DIR/data/users.json" "/tmp/${PM2_NAME}_data.bak/" || true
[ -f "$REMOTE_DIR/data/bets.json" ]  && cp "$REMOTE_DIR/data/bets.json"  "/tmp/${PM2_NAME}_data.bak/" || true
[ -f "$REMOTE_DIR/data/standings-history.json" ] && cp "$REMOTE_DIR/data/standings-history.json" "/tmp/${PM2_NAME}_data.bak/" || true

# Extraction propre (arborescence Unix)
rm -rf "$TMP" && mkdir -p "$TMP"
tar -xzf /tmp/coupe-maison.tar.gz -C "$TMP"
rsync -a --delete \
  --exclude='.env' --exclude='node_modules' \
  --exclude='data/users.json' --exclude='data/bets.json' --exclude='data/standings-history.json' \
  "$TMP"/ "$REMOTE_DIR"/

# Restauration .env + donnees
[ -f "/tmp/${PM2_NAME}_env.bak" ] && cp "/tmp/${PM2_NAME}_env.bak" "$REMOTE_DIR/.env" || true
[ -f "/tmp/${PM2_NAME}_data.bak/users.json" ] && cp "/tmp/${PM2_NAME}_data.bak/users.json" "$REMOTE_DIR/data/" || true
[ -f "/tmp/${PM2_NAME}_data.bak/bets.json" ]  && cp "/tmp/${PM2_NAME}_data.bak/bets.json"  "$REMOTE_DIR/data/" || true
[ -f "/tmp/${PM2_NAME}_data.bak/standings-history.json" ] && cp "/tmp/${PM2_NAME}_data.bak/standings-history.json" "$REMOTE_DIR/data/" || true

cd "$REMOTE_DIR"
npm install --omit=dev --no-audit --no-fund 2>&1 | tail -4
echo "PHASE_A_OK"
'@
$bashA = $bashA.Replace('__REMOTE_DIR__',$REMOTE_DIR).Replace('__PM2_NAME__',$PM2_NAME)
if ((Invoke-SshBash $cfg $bashA) -ne 0) { Write-Fail "Extraction/deps a echoue"; exit 1 }
Write-OK "Code deploye + dependances installees"

# ---- 8) .env : envoi au premier deploiement ----
$hasEnv = $true
& ssh @(Get-SshArgs $cfg) "$($cfg.user)@$($cfg.host)" "test -f $REMOTE_DIR/.env" 2>$null
if ($LASTEXITCODE -ne 0) { $hasEnv = $false }
if (-not $hasEnv) {
  Write-Step "Envoi du .env (cle API) - premiere fois seulement"
  & scp @(Get-ScpArgs $cfg) $envLocal "$($cfg.user)@$($cfg.host):${REMOTE_DIR}/.env" | Out-Host
  if ($LASTEXITCODE -ne 0) { Write-Fail "Envoi du .env a echoue"; exit 1 }
  Write-OK ".env envoye"
}

# ---- 9) Phase RUN : port auto + PM2 + nginx (SSL preserve) ----
Write-Step "Port + demarrage + nginx (sans casser le HTTPS)"
$bashRun = @'
set -euo pipefail
REMOTE_DIR="__REMOTE_DIR__"
PM2_NAME="__PM2_NAME__"
FQDN="__FQDN__"
cd "$REMOTE_DIR"
touch .env

# 1) Resoudre le port : garder celui du .env ; sinon port libre (jamais 5705)
PORT_VAL="$(grep -E '^PORT=' .env | head -1 | cut -d= -f2 | tr -d '[:space:]' || true)"
if [ -z "$PORT_VAL" ] || [ "$PORT_VAL" = "5705" ]; then
  PORT_VAL=""
  for p in $(seq 5710 5799); do
    if ! ss -ltn 2>/dev/null | awk '{print $4}' | grep -q ":$p\$"; then PORT_VAL="$p"; break; fi
  done
  [ -z "$PORT_VAL" ] && { echo "KO_NO_FREE_PORT"; exit 1; }
  sed -i '/^PORT=/d' .env
  echo "PORT=$PORT_VAL" >> .env
fi

# 2) Variables prod (ajoutees seulement si absentes)
grep -q '^NODE_ENV=' .env       || echo "NODE_ENV=production" >> .env
grep -q '^SESSION_SECRET=' .env || echo "SESSION_SECRET=$(node -e 'console.log(require("crypto").randomBytes(32).toString("hex"))')" >> .env

# 3) (Re)demarrage PM2 -> l'appli lit PORT depuis .env
pm2 delete "$PM2_NAME" >/dev/null 2>&1 || true
pm2 start ecosystem.config.cjs >/dev/null 2>&1
pm2 save >/dev/null 2>&1
sleep 2

# 4) Nginx : pointer vers le BON port sans toucher au reste (SSL preserve)
VHOST="/etc/nginx/sites-available/${FQDN}.conf"
[ -f "$VHOST" ] || VHOST="/etc/nginx/sites-available/${FQDN}"
if [ -f "$VHOST" ]; then
  sudo sed -i -E "s#proxy_pass http://localhost:[0-9]+#proxy_pass http://localhost:${PORT_VAL}#g" "$VHOST"
  sudo sed -i -E "s#proxy_pass http://127.0.0.1:[0-9]+#proxy_pass http://127.0.0.1:${PORT_VAL}#g" "$VHOST"
else
  VHOST="/etc/nginx/sites-available/${FQDN}.conf"
  sudo tee "$VHOST" > /dev/null <<NGINX
server {
    listen 80;
    server_name ${FQDN};
    location / {
        proxy_pass http://localhost:${PORT_VAL};
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
NGINX
  sudo ln -sf "$VHOST" /etc/nginx/sites-enabled/
fi
sudo nginx -t && sudo systemctl reload nginx

# 5) Verifs + infos pour le script PowerShell
sleep 1
LOCAL=$(curl -s -o /dev/null -w '%{http_code}' "http://localhost:${PORT_VAL}/" || echo 000)
echo "RESOLVED_PORT=${PORT_VAL}"
echo "LOCAL_HTTP=${LOCAL}"
if [ -d "/etc/letsencrypt/live/${FQDN}" ]; then echo "CERT_PRESENT=yes"; else echo "CERT_PRESENT=no"; fi
echo "DEPLOY_RUN_OK"
'@
$bashRun = $bashRun.Replace('__REMOTE_DIR__',$REMOTE_DIR).Replace('__PM2_NAME__',$PM2_NAME).Replace('__FQDN__',$FQDN)
$runOut = Invoke-SshBashCapture $cfg $bashRun
Write-Host $runOut

if ($runOut -notmatch 'DEPLOY_RUN_OK') { Write-Fail "Le demarrage cote serveur a echoue (voir ci-dessus)."; exit 1 }

$resolvedPort = ""
if ($runOut -match 'RESOLVED_PORT=(\d+)') { $resolvedPort = $Matches[1] }
$certPresent = ($runOut -match 'CERT_PRESENT=yes')
$localOk     = ($runOut -match 'LOCAL_HTTP=200')
if ($resolvedPort) { Write-OK "Appli sur le port $resolvedPort, nginx repointe (HTTPS preserve)" }
if ($localOk) { Write-OK "L'appli repond en local (HTTP 200)" } else { Write-Fail "L'appli ne repond pas encore en local (voir: pm2 logs $PM2_NAME)" }

# ---- 10) HTTPS (Certbot) : seulement si pas encore de certificat ----
if ($certPresent) {
  Write-OK "Certificat HTTPS deja present -> rien a faire"
} elseif ($SkipCertbot) {
  Write-Host "Pas de certificat et -SkipCertbot demande -> HTTPS non active." -ForegroundColor Yellow
} else {
  Write-Step "Installation du certificat HTTPS (premiere fois)"
  $email = Read-Host "Ton email pour le certificat SSL"
  if ([string]::IsNullOrWhiteSpace($email)) {
    Write-Host "Email vide -> HTTPS saute. Relance avec l'email pour l'activer." -ForegroundColor Yellow
  } else {
    $bashC = "sudo certbot --nginx --non-interactive --agree-tos --email '$email' --redirect -d $FQDN && echo CERTBOT_OK"
    if ((Invoke-SshBash $cfg $bashC) -ne 0) {
      Write-Fail "Certbot a echoue - verifie que le DNS '$FQDN' pointe vers $($cfg.host)."
    } else { Write-OK "HTTPS actif" }
  }
}

# ---- 11) Verification publique ----
Write-Step "Verification publique (https://$FQDN)"
$pub = (& ssh @(Get-SshArgs $cfg) "$($cfg.user)@$($cfg.host)" "curl -s -o /dev/null -w '%{http_code}' https://$FQDN/")
Write-Host "Reponse publique : HTTP $pub"
if ($pub -eq "200" -or $pub -eq "302") { Write-OK "Le site repond publiquement" } else { Write-Host "A verifier dans le navigateur (Ctrl+F5)." -ForegroundColor Yellow }

if ($LogsAfter) { & ssh @(Get-SshArgs $cfg) "$($cfg.user)@$($cfg.host)" "pm2 logs $PM2_NAME --lines 30 --nostream" }

Write-Host "`n============================================" -ForegroundColor Magenta
Write-Host "  Termine -> https://$FQDN" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Magenta
