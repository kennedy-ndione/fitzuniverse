# ============================================================
# ScholarBridge - Photos uniques par universite (2026-08-28)
#
# Version ASCII pure (sans accents) pour compatibilite Windows
# PowerShell 5.1, qui peut mal lire les caracteres accentues d'un
# script .ps1 selon l'encodage du fichier.
#
# Voir CREDITS.md pour le credit photographe/licence de chacune des
# 9 photos.
#
# Usage : depuis la racine du depot (la ou se trouve le dossier
# assets), dans un terminal PowerShell :
#   powershell -ExecutionPolicy Bypass -File scripts\add-lot11-unique-photos.ps1
#
# Etape suivante apres ce script : admin/expand-catalog-batch11.html
# (deja fait si tu as deja lance ce lot en base).
# ============================================================

$ErrorActionPreference = "Stop"

$Dir = "assets\images\cities"

if (-not (Test-Path $Dir)) {
    Write-Host "Erreur : $Dir introuvable - lancer ce script depuis la racine du depot ScholarBridge." -ForegroundColor Red
    exit 1
}

$Photos = [ordered]@{
    "stanford"              = "photo-1566549720649-01b61516861b"
    "berkeley"               = "photo-1638909374742-8c8364010106"
    "sorbonne"               = "photo-1774526993562-abc3f2afac0f"
    "istanbul-university"    = "photo-1763965367191-6455ef032c79"
    "istanbul-technical"     = "photo-1564428366891-dc20b1edf33b"
    "princess-nourah"        = "photo-1674822858255-fcc093a1ef43"
    "politehnica-bucuresti"  = "photo-1639631684488-19a2b0fa456c"
    "zurich-grossmunster"    = "photo-1573137785546-9d19e4f33f87"
    "rudn"                   = "photo-1541447271487-09612b3f49f7"
}

function Get-Photo {
    param([string]$Name, [string]$PhotoId, [int]$Width, [string]$Suffix)
    $Out = Join-Path $Dir ($Name + $Suffix + ".jpg")
    $Url = "https://images.unsplash.com/" + $PhotoId + "?fm=jpg" + "&" + "q=80" + "&" + "w=" + $Width + "&" + "fit=max"
    Write-Host ("Telechargement : " + $Out + " (" + $Width + "px)...")
    curl.exe -sL --fail -o $Out $Url
    if ($LASTEXITCODE -ne 0) {
        Write-Host ("Echec du telechargement de " + $Out + " (curl a retourne " + $LASTEXITCODE + ").") -ForegroundColor Red
        exit 1
    }
}

$Widths = @(
    @{ W = 2400; S = "" },
    @{ W = 400;  S = "-400w" },
    @{ W = 800;  S = "-800w" },
    @{ W = 1200; S = "-1200w" },
    @{ W = 1600; S = "-1600w" }
)

foreach ($item in $Widths) {
    foreach ($name in $Photos.Keys) {
        Get-Photo -Name $name -PhotoId $Photos[$name] -Width $item.W -Suffix $item.S
    }
}

Write-Host ""
Write-Host "Termine. 45 fichiers ecrits dans $Dir."
Get-ChildItem "$Dir\stanford*.jpg", "$Dir\berkeley*.jpg", "$Dir\sorbonne*.jpg", `
  "$Dir\istanbul-university*.jpg", "$Dir\istanbul-technical*.jpg", `
  "$Dir\princess-nourah*.jpg", "$Dir\politehnica-bucuresti*.jpg", `
  "$Dir\zurich-grossmunster*.jpg", "$Dir\rudn*.jpg" | Format-Table Name, Length

Write-Host ""
Write-Host "Le champ image des 9 universites est deja corrige en base (lot 11)."
Write-Host "Rafraichis les pages dans le navigateur pour voir les nouvelles photos."
