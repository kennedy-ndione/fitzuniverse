# ============================================================
# ScholarBridge - Photos uniques par universite, lot 13 (2026-08-28)
#
# Suite du lot 11 : 14 photos pour les 9 groupes de doublons
# supplementaires trouves par l'audit etendu (universites importees
# avant les lots 1-9 de cette session).
#
# Version ASCII pure (sans accents) pour compatibilite Windows
# PowerShell 5.1, qui peut mal lire les caracteres accentues d'un
# script .ps1 selon l'encodage du fichier.
#
# Voir CREDITS.md pour le credit photographe/licence de chacune des
# 14 photos.
#
# Usage : depuis la racine du depot (la ou se trouve le dossier
# assets), dans un terminal PowerShell :
#   powershell -ExecutionPolicy Bypass -File scripts\add-lot13-more-unique-photos.ps1
#
# Etape suivante apres ce script : admin/expand-catalog-batch13.html
# ============================================================

$ErrorActionPreference = "Stop"

$Dir = "assets\images\cities"

if (-not (Test-Path $Dir)) {
    Write-Host "Erreur : $Dir introuvable - lancer ce script depuis la racine du depot ScholarBridge." -ForegroundColor Red
    exit 1
}

$Photos = [ordered]@{
    "corvinus"             = "photo-1616432902940-b7a1acbc60b3"
    "bme-budapest"         = "photo-1518471152222-d42e38ce6873"
    "obuda"                = "photo-1549877452-9c387954fbc2"
    "semmelweis"           = "photo-1507622560124-621e26755fb8"
    "shanghai-jiaotong"    = "photo-1538428494232-9c0d8a3ab403"
    "shanghai-maritime"    = "photo-1614221330834-9399e5631af3"
    "tongji"               = "photo-1627484986972-e544190b8abb"
    "beihang"              = "photo-1508804185872-d7badad00f7d"
    "tsinghua"             = "photo-1547981609-4b6bfe67ca0b"
    "university-of-delhi"  = "photo-1587474260584-136574528ed5"
    "universiti-malaya"    = "photo-1596422846543-75c6fc197f07"
    "bocconi"              = "photo-1610016302534-6f67f1c968d8"
    "yonsei"               = "photo-1570191913384-7b4ff11716e7"
    "waseda"               = "photo-1503899036084-c55cdd92da26"
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
Write-Host "Termine. 70 fichiers ecrits dans $Dir."
Get-ChildItem "$Dir\corvinus*.jpg", "$Dir\bme-budapest*.jpg", "$Dir\obuda*.jpg", `
  "$Dir\semmelweis*.jpg", "$Dir\shanghai-jiaotong*.jpg", "$Dir\shanghai-maritime*.jpg", `
  "$Dir\tongji*.jpg", "$Dir\beihang*.jpg", "$Dir\tsinghua*.jpg", `
  "$Dir\university-of-delhi*.jpg", "$Dir\universiti-malaya*.jpg", "$Dir\bocconi*.jpg", `
  "$Dir\yonsei*.jpg", "$Dir\waseda*.jpg" | Format-Table Name, Length

Write-Host ""
Write-Host "Etape suivante : ouvrir admin/expand-catalog-batch13.html et lancer Analyser, Ecrire, Verifier."
