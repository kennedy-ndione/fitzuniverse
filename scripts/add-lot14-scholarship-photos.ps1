# ============================================================
# ScholarBridge - Photos des bourses, lot 14 (2026-08-28)
#
# Premiere vague : une photo de monument distincte pour les 17 pays
# qui n'ont qu'une seule bourse chacun (le reste du catalogue - pays
# a plusieurs bourses, puis l'Italie - suivra dans les lots suivants).
#
# Cree le dossier assets\images\scholarships\ s'il n'existe pas encore
# (nouveau dossier, distinct de assets\images\cities\ : les bourses ne
# doivent plus jamais partager une photo avec une universite ni entre
# elles).
#
# Version ASCII pure (sans accents) pour compatibilite Windows
# PowerShell 5.1.
#
# Voir CREDITS.md pour le credit photographe/licence de chacune des
# 17 photos.
#
# Usage : depuis la racine du depot (la ou se trouve le dossier
# assets), dans un terminal PowerShell :
#   powershell -ExecutionPolicy Bypass -File scripts\add-lot14-scholarship-photos.ps1
#
# Etape suivante apres ce script : admin/expand-catalog-batch14.html
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
    "mastercard-foundation-scholars-uct"                    = "photo-1744604030401-b24c5975a574"
    "daad-study-scholarships"                                = "photo-1574861501474-e2f098969b0e"
    "king-abdulaziz-scholarship"                             = "photo-1543282649-6d12df6b5fc2"
    "global-korea-scholarship"                               = "photo-1566800890932-e89159daf3dc"
    "stipendium-hungaricum"                                  = "photo-1779617164984-0bec21771748"
    "iccr-africa-scholarship-scheme"                         = "photo-1564507592333-c60657eea523"
    "mext-scholarship"                                       = "photo-1528884089-4582fe06c516"
    "malaysia-international-scholarship"                     = "photo-1552353290-f2a1ff0b5009"
    "nl-scholarship"                                          = "photo-1774645456173-0fc2588ccfc3"
    "nawa-banach-scholarship"                                 = "photo-1573424659379-f5d699f4845a"
    "bolsas-cooperacao-camoes"                                = "photo-1741034256927-3fde0ced8903"
    "romanian-government-scholarship"                         = "photo-1544169086-da2d0dc39330"
    "chevening-scholarships"                                  = "photo-1523435324848-a7a613898152"
    "open-doors-scholarship"                                  = "photo-1513326738677-b964603b136d"
    "swedish-institute-scholarships-global-professionals"     = "photo-1752906038204-5030008d5db0"
    "swiss-government-excellence-scholarships"                = "photo-1531743579253-fa8d52993ba5"
    "turkiye-burslari"                                        = "photo-1669111957528-6d4e78328692"
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
Write-Host "Termine. 85 fichiers ecrits dans $Dir (17 bourses x 5 tailles)."
Get-ChildItem "$Dir\*.jpg" | Format-Table Name, Length

Write-Host ""
Write-Host "Etape suivante : ouvrir admin/expand-catalog-batch14.html et lancer Analyser, Ecrire, Verifier."
