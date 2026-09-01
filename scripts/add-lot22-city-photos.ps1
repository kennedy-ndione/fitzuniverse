# ============================================================
# FitzUniverse - Ajout de 7 photos de ville pour les universites
# orphelines du lot 22 : Seoul National University, KAIST, POSTECH,
# Korea National University of Arts, Koc University, Sabanci
# University et Bilkent University.
#
# Version ASCII pure (sans accents) pour compatibilite Windows
# PowerShell 5.1, qui peut mal lire les caracteres accentues d'un
# script .ps1 selon l'encodage du fichier.
#
# REGLE DU LOT 11 : une photo par universite, jamais partagee. Les
# deux images de Seoul et les deux d'Istanbul ont ete choisies pour
# etre visuellement tres differentes entre elles ET des seoul.jpg,
# yonsei.jpg, istanbul.jpg, istanbul-technical.jpg et
# istanbul-university.jpg deja en place.
#
# Toutes les photos sont sous Unsplash License (usage commercial
# autorise, attribution non obligatoire), verifiees page par page le
# 2026-08-30. Les credits sont conserves dans CREDITS.md.
#
# Usage : depuis la racine du depot (la ou se trouve le dossier
# assets), dans un terminal PowerShell :
#   powershell -ExecutionPolicy Bypass -File scripts\add-lot22-city-photos.ps1
# ============================================================

$ErrorActionPreference = "Stop"

$Dir = "assets\images\cities"

if (-not (Test-Path $Dir)) {
    Write-Host "Erreur : $Dir introuvable - lancer ce script depuis la racine du depot." -ForegroundColor Red
    exit 1
}

# Nom de fichier -> identifiant Unsplash. Voir CREDITS.md pour les
# auteurs et les pages source.
$Photos = @(
    @{ Name = "snu-seoul";        Id = "photo-1674737556686-bc4e185ff6f5" },  # Brother Yoon - campus SNU sous la neige
    @{ Name = "daejeon";          Id = "photo-1663038509302-a20dc8a24ad8" },  # Juwhan Yu - tour Hanbit, Expo Park
    @{ Name = "pohang";           Id = "photo-1552230479-b7e43d576a7a"    },  # Engineer9 - Main de la coexistence, Homigot
    @{ Name = "karts-seoul";      Id = "photo-1677107129789-3b0241fb727a" },  # Ji Yong Won - toits hanok de Bukchon
    @{ Name = "koc-istanbul";     Id = "photo-1713124725466-7f23dca6d725" },  # Seval Torun - forteresse de Rumeli Hisari
    @{ Name = "sabanci-istanbul"; Id = "photo-1787159757933-f42553258cb2" },  # Dmitry Fomin - colline de Camlica, rive asiatique
    @{ Name = "ankara";           Id = "photo-1728113278031-30d24597673d" }   # Cengiz Ozarpat - citadelle d'Ankara
)

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

# Meme jeu de variantes que les lots precedents : l'original plus les
# quatre largeurs que resolveCityImage() attend dans le srcset.
$Widths = @(
    @{ W = 2400; S = "" },
    @{ W = 400;  S = "-400w" },
    @{ W = 800;  S = "-800w" },
    @{ W = 1200; S = "-1200w" },
    @{ W = 1600; S = "-1600w" }
)

foreach ($photo in $Photos) {
    foreach ($item in $Widths) {
        Get-Photo -Name $photo.Name -PhotoId $photo.Id -Width $item.W -Suffix $item.S
    }
}

Write-Host ""
Write-Host "Termine. 35 fichiers ecrits dans $Dir :"
Get-ChildItem "$Dir\snu-seoul*.jpg", "$Dir\daejeon*.jpg", "$Dir\pohang*.jpg", "$Dir\karts-seoul*.jpg", "$Dir\koc-istanbul*.jpg", "$Dir\sabanci-istanbul*.jpg", "$Dir\ankara*.jpg" | Format-Table Name, Length

Write-Host ""
Write-Host "REGARDE LES IMAGES AVANT DE LANCER LE LOT 22 : trois d'entre elles"
Write-Host "(karts-seoul, koc-istanbul, sabanci-istanbul) montrent la ville ou"
Write-Host "l'arrondissement, pas le campus - aucune photo de ces campus n'existe"
Write-Host "sur Unsplash. Les quatre autres identifient bien leur lieu."
Write-Host ""
Write-Host "Ensuite seulement : admin/expand-catalog-batch22.html"
