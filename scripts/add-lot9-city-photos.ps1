# ============================================================
# ScholarBridge - Ajout de 2 photos de ville : Lausanne (Suisse, pour
# EPFL) et Jeddah (Arabie Saoudite, pour King Abdulaziz University).
#
# Version ASCII pure (sans accents) pour compatibilite Windows
# PowerShell 5.1, qui peut mal lire les caracteres accentues d'un
# script .ps1 selon l'encodage du fichier.
#
# Usage : depuis la racine du depot (la ou se trouve le dossier
# assets), dans un terminal PowerShell :
#   powershell -ExecutionPolicy Bypass -File scripts\add-lot9-city-photos.ps1
# ============================================================

$ErrorActionPreference = "Stop"

$Dir = "assets\images\cities"

if (-not (Test-Path $Dir)) {
    Write-Host "Erreur : $Dir introuvable - lancer ce script depuis la racine du depot ScholarBridge." -ForegroundColor Red
    exit 1
}

$LausanneId = "photo-1603646049799-736bb072cec5"
$JeddahId   = "photo-1674979724572-c0a0579bc9d0"

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
    Get-Photo -Name "lausanne" -PhotoId $LausanneId -Width $item.W -Suffix $item.S
    Get-Photo -Name "jeddah"   -PhotoId $JeddahId   -Width $item.W -Suffix $item.S
}

Write-Host ""
Write-Host "Termine. 10 fichiers ecrits dans $Dir :"
Get-ChildItem "$Dir\lausanne*.jpg", "$Dir\jeddah*.jpg" | Format-Table Name, Length

Write-Host ""
Write-Host "Le lot 9 (admin/expand-catalog-batch9.html) est deja ecrit en base - inutile de le relancer."
Write-Host "Rafraichis les pages EPFL / King Abdulaziz University dans le navigateur pour voir les photos."
