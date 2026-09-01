# ============================================================
# ScholarBridge - Photos des bourses, lot 16 (2026-08-28)
#
# Troisieme et derniere vague du remplacement des photos de bourse
# (voir lots 14 et 15) : les 21 bourses italiennes, un monument
# distinct par bourse (5 Milan, 2 Turin, 2 Bologne, 3 Rome, 9 autres
# villes/regions : Naples/Campanie x2, Toscane/Pise/Florence x3,
# Padoue, Venetie, Trente x2).
#
# Attention aux doublons evites lors du choix des monuments :
# - Milan Duomo deja utilise par bocconi.jpg (universite) -> les 5
#   bourses de Milan utilisent d'autres monuments (Castello Sforzesco,
#   Galleria Vittorio Emanuele II, Navigli, Bosco Verticale, Arco
#   della Pace).
# - Naples/Campanie : Vesuve pour la bourse regionale, cote amalfitaine
#   pour la bourse de l'universite de Naples (2 vues distinctes de la
#   meme region).
# - Trente : chateau du Buonconsiglio pour l'universite de Trente,
#   fontaine de la Piazza Duomo pour Opera Universitaria (2 monuments
#   distincts, voir CREDITS.md pour le detail).
#
# Meme dossier que les lots 14/15 : assets\images\scholarships\
#
# Version ASCII pure (sans accents) pour compatibilite Windows
# PowerShell 5.1.
#
# Usage : depuis la racine du depot (la ou se trouve le dossier
# assets), dans un terminal PowerShell :
#   powershell -ExecutionPolicy Bypass -File scripts\add-lot16-scholarship-photos.ps1
#
# Etape suivante apres ce script : admin/expand-catalog-batch16.html
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
    "bocconi-merit-award"                                  = "photo-1740946065212-6f6c6dd1655b"
    "bocconi-graduate-merit-award"                         = "photo-1716793165476-37ad6394472e"
    "bocconi-phd-scholarship"                               = "photo-1785961400969-033870e250e5"
    "politecnico-di-milano-merit-based-scholarship"         = "photo-1690489964962-dcaaf37b22c0"
    "politecnico-di-milano-phd-scholarship"                 = "photo-1635255440966-335b08f2b49f"
    "edisu-piemonte-scholarship"                            = "photo-1664151235184-da7c79fb7049"
    "polito-phd-scholarship"                                = "photo-1651453796204-5a9e98744dd3"
    "international-talents-unibo"                           = "photo-1786347583011-c5902e885aba"
    "unibo-phd-scholarship"                                 = "photo-1740046305708-f5f4137061fd"
    "italian-government-scholarship"                        = "photo-1693824112057-4004bf54d328"
    "laziodisco-scholarship"                                = "photo-1565854713475-6e297773a53f"
    "sapienza-phd-scholarship"                               = "photo-1632660355458-aad5ca27d138"
    "campania-regional-scholarship"                         = "photo-1717446871120-7a50254df895"
    "university-of-naples-federico-ii-phd-scholarship"      = "photo-1612698093158-e07ac200d44e"
    "dsu-toscana-scholarship"                               = "photo-1665053855050-87b69803f863"
    "university-of-florence-phd-scholarship"                = "photo-1533071334820-b6b3248c34e9"
    "university-of-pisa-phd-scholarship"                    = "photo-1780054349104-3938b54929cc"
    "university-of-padua-phd-scholarship"                   = "photo-1652987362463-78f66c9b175b"
    "veneto-regional-scholarship"                           = "photo-1574795559465-7d953f8874d9"
    "opera-universitaria-scholarship"                       = "photo-1681477421173-804e57cda0e5"
    "university-of-trento-phd-scholarship"                  = "photo-1681381690171-53b11200fb42"
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
Write-Host "Termine. 105 fichiers ecrits dans $Dir (21 bourses x 5 tailles)."
Get-ChildItem "$Dir\bocconi-merit-award*.jpg", "$Dir\bocconi-graduate-merit-award*.jpg", `
  "$Dir\bocconi-phd-scholarship*.jpg", "$Dir\politecnico-di-milano-merit-based-scholarship*.jpg", `
  "$Dir\politecnico-di-milano-phd-scholarship*.jpg", "$Dir\edisu-piemonte-scholarship*.jpg", `
  "$Dir\polito-phd-scholarship*.jpg", "$Dir\international-talents-unibo*.jpg", `
  "$Dir\unibo-phd-scholarship*.jpg", "$Dir\italian-government-scholarship*.jpg", `
  "$Dir\laziodisco-scholarship*.jpg", "$Dir\sapienza-phd-scholarship*.jpg", `
  "$Dir\campania-regional-scholarship*.jpg", "$Dir\university-of-naples-federico-ii-phd-scholarship*.jpg", `
  "$Dir\dsu-toscana-scholarship*.jpg", "$Dir\university-of-florence-phd-scholarship*.jpg", `
  "$Dir\university-of-pisa-phd-scholarship*.jpg", "$Dir\university-of-padua-phd-scholarship*.jpg", `
  "$Dir\veneto-regional-scholarship*.jpg", "$Dir\opera-universitaria-scholarship*.jpg", `
  "$Dir\university-of-trento-phd-scholarship*.jpg" | Format-Table Name, Length

Write-Host ""
Write-Host "Etape suivante : ouvrir admin/expand-catalog-batch16.html et lancer Analyser, Ecrire, Verifier."
