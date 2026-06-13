# ============================================================
#  make-organisateur-coupe-maison.ps1
#  Rend ton compte "organisateur" sur le site en ligne (VPS).
#  - Envoie un petit script sur le serveur
#  - Marque ton compte dans data/users.json + ADMIN_EMAIL dans .env
#  - Redemarre l'appli (PM2)
#  Ne touche PAS aux pronos ni aux autres comptes (sauvegarde avant).
#
#  Lancer (depuis C:\Agile\coupe-maison) :
#     Unblock-File .\make-organisateur-coupe-maison.ps1
#     .\make-organisateur-coupe-maison.ps1
#
#  Par defaut le compte vise est "Jean-Luc". Pour un autre pseudo :
#     .\make-organisateur-coupe-maison.ps1 -Pseudo "MonPseudo"
# ============================================================

param(
  [string]$Pseudo = "Jean-Luc",
  [string]$ProjectPath = "C:\Agile\coupe-maison"
)

$ErrorActionPreference = "Stop"

# ---- Variables du VPS (memes que le deploiement) ----
$REMOTE_DIR = "/home/ubuntu/coupe-maison"
$PM2_NAME   = "coupe-maison"

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
    if ($c -and (Test-Path $c)) { Write-OK "Config SSH : $c"; return (Get-Content $c -Raw | ConvertFrom-Json) }
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
# Bash via base64 : zero souci de quoting
function Invoke-SshBash($cfg,$script){
  $b64 = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($script))
  & ssh @(Get-SshArgs $cfg) "$($cfg.user)@$($cfg.host)" "echo $b64 | base64 -d | bash -s"
}

# ============================================================
Write-Host "============================================" -ForegroundColor Magenta
Write-Host "  Activer l'organisateur -> $Pseudo" -ForegroundColor Magenta
Write-Host "============================================" -ForegroundColor Magenta

# Le petit script Node a envoyer (a cote de ce .ps1)
$cjsLocal = Join-Path $PSScriptRoot "set-organisateur.cjs"
if (-not (Test-Path $cjsLocal)) { Write-Fail "Fichier manquant : set-organisateur.cjs (doit etre a cote de ce script)."; exit 1 }

$cfg = Get-DeployConfig

# ---- 2) Test SSH ----
Write-Step "Test de la connexion au serveur"
& ssh @(Get-SshArgs $cfg) "$($cfg.user)@$($cfg.host)" "echo CONNECTED" | Out-Host
if ($LASTEXITCODE -ne 0) { Write-Fail "Connexion au serveur impossible."; exit 1 }
Write-OK "Connexion serveur OK"

# ---- 3) Envoi du petit script sur le serveur ----
Write-Step "Envoi du script sur le serveur"
& scp @(Get-ScpArgs $cfg) $cjsLocal "$($cfg.user)@$($cfg.host):/tmp/set-organisateur.cjs" | Out-Host
if ($LASTEXITCODE -ne 0) { Write-Fail "Envoi du script impossible."; exit 1 }
Write-OK "Script envoye"

# ---- 4) Execution sur le serveur : marquer organisateur + redemarrer ----
Write-Step "Activation de l'organisateur et redemarrage de l'appli"
$bash = @'
set -e
cd "__REMOTE_DIR__"
cp /tmp/set-organisateur.cjs ./set-organisateur.cjs
node ./set-organisateur.cjs "__PSEUDO__"
rm -f ./set-organisateur.cjs /tmp/set-organisateur.cjs
pm2 restart "__PM2_NAME__" --update-env >/dev/null 2>&1 || pm2 restart "__PM2_NAME__" >/dev/null 2>&1 || true
echo "APP_RESTARTED"
'@
$bash = $bash -replace '__REMOTE_DIR__', $REMOTE_DIR
$bash = $bash -replace '__PSEUDO__', $Pseudo
$bash = $bash -replace '__PM2_NAME__', $PM2_NAME

Invoke-SshBash $cfg $bash | Out-Host

Write-Host "`n============================================" -ForegroundColor Magenta
Write-Host "  Termine." -ForegroundColor Green
Write-Host "  1) Va sur le site, DECONNECTE-toi puis RECONNECTE-toi." -ForegroundColor Yellow
Write-Host "  2) Ouvre la page 'Mon compte' : la partie Organisateur doit apparaitre." -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Magenta
