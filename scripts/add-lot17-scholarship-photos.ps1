# ============================================================
# ScholarBridge - Photos des bourses, lot 17 (2026-08-28)
#
# Dernier lot du remplacement des photos de bourse : les 3 bourses
# marocaines, retrouvees dans le diagnostic initial (voir
# admin/diag-scholarships.js) mais oubliees des lots 14/15/16.
# Apres ce lot, les 56 bourses du catalogue ont chacune leur propre
# photo de monument.
#
# Attention aux doublons avec les photos d'universite deja
# existantes : ifrane.jpg (Al Akhawayn University) et benguerir.jpg
# (UM6P) sont deja utilisees comme photos d'universite - les 2
# bourses concernees ci-dessous utilisent donc d'autres lieux
# marocains distincts (foret de cedres d'Azrou pour AUI, Koutoubia
# de Marrakech pour UM6P plutot que Benguerir meme).
#
# Meme dossier que les lots 14/15/16 : assets\images\scholarships\
#
# Version ASCII pure (sans accents) pour compatibilite Windows
# PowerShell 5.1.
#
# Usage : depuis la racine du depot (la ou se trouve le dossier
# assets), dans un terminal PowerShell :
#   powershell -ExecutionPolicy Bypass -File scripts\add-lot17-scholarship-photos.ps1
#
# Etape suivante apres ce script : admin/expand-catalog-batch17.html
# ============================================================

$ErrorActionPreference = "Stop"

$Dir = "assets\images\scholarships"

if (-not (Test-Path "assets\images")) {
    Write-Host "Erreur : assets\images introuvable - lancer ce script depuis la racine du depot ScholarBridge." -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $Dir)) {
    Write-Host "Creation de $Dir..."
    New-Item -ItemType Directory -Path $Dir | Out-Null
}

$Photos = [ordered]@{
    "bourse-gouvernement-maroc-amci"        = "photo-1763838546127-f44013ba35a4"
    "bourses-master-aui"                    = "photo-1654442003199-a00a92b11cc7"
    "mastercard-foundation-scholars-um6p"    = "photo-1597212618440-806262de4f6b"
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
Write-Host "Termine. 15 fichiers ecrits dans $Dir (3 bourses x 5 tailles)."
Get-ChildItem "$Dir\bourse-gouvernement-maroc-amci*.jpg", "$Dir\bourses-master-aui*.jpg", `
  "$Dir\mastercard-foundation-scholars-um6p*.jpg" | Format-Table Name, Length

Write-Host ""
Write-Host "Etape suivante : ouvrir admin/expand-catalog-batch17.html et lancer Analyser, Ecrire, Verifier."
