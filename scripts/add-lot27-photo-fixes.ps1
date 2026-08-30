# ============================================================
# FitzUniverse - Photos des bourses, lot 27 (2026-08-30)
#
# CORRECTIF DU LOT 26. Trois des 19 identifiants Unsplash du lot 26
# reprenaient une photo DEJA utilisee ailleurs dans le depot. Le lot 26
# a donc cree exactement le defaut qu'il devait supprimer : trois pays
# affichent deux cartes avec la meme image.
#
#   Russie   hse-into-olympiad          = open-doors-scholarship  (Saint-Basile)
#   Japon    jads-japan-africa-dream    = waseda.jpg              (Shibuya)
#   Hongrie  fao-hungarian-gov-schol.   = corvinus.jpg            (Parlement)
#
# POURQUOI LE CONTROLE DU LOT 26 NE L'A PAS VU
# Il comparait les tailles des fichiers DU LOT entre eux. Deux fichiers
# de noms differents portant la meme photo sont invisibles a ce test des
# lors que l'un des deux vient d'un lot anterieur. Le controle mesurait
# un indice - le nom de fichier - et non la chose : l'identifiant de la
# photo.
#
# CE SCRIPT AJOUTE LE CONTROLE QUI MANQUAIT
# Avant tout telechargement, chaque identifiant est cherche dans
# CREDITS.md, ou toutes les photos du depot sont creditees avec leur
# identifiant CDN. Une seule occurrence = la photo sert deja ailleurs,
# et le script s'arrete sans rien ecrire. A REPRENDRE dans tout futur
# lot de photos.
#
# Les trois fichiers ecrasent ceux du lot 26 ; le champ `image` en base
# ne change pas (meme nom de fichier), donc AUCUN batch Firestore n'est
# necessaire apres ce script. C'est le seul lot photo de la serie qui
# n'a pas de batch associe.
#
# Version ASCII pure pour compatibilite Windows PowerShell 5.1.
#
# Usage : depuis la racine du depot, dans un terminal PowerShell :
#   powershell -ExecutionPolicy Bypass -File scripts\add-lot27-photo-fixes.ps1
# ============================================================

$ErrorActionPreference = "Stop"

$Dir = "assets\images\scholarships"

if (-not (Test-Path $Dir)) {
    Write-Host "Erreur : $Dir introuvable - lancer ce script depuis la racine du depot." -ForegroundColor Red
    exit 1
}
if (-not (Test-Path "CREDITS.md")) {
    Write-Host "Erreur : CREDITS.md introuvable - il sert de garde anti-doublon." -ForegroundColor Red
    exit 1
}

$Photos = [ordered]@{
    "hse-into-olympiad"                    = "photo-1741171469811-553adc364411"   # une station ornee du metro de Moscou
    "jads-japan-africa-dream"              = "photo-1601823984263-b87b59798b70"   # un torii rouge sur un chemin forestier
    "fao-hungarian-government-scholarship" = "photo-1725801719382-1e9db44b0066"   # champs et lac vus du ciel, region du Balaton
}

# ---- GARDE ANTI-DOUBLON : la photo est-elle deja creditee ailleurs ? ----
# NE PAS nommer la variable $pid : c'est une variable automatique en lecture
# seule de PowerShell (identifiant du processus). L'ecraser fait echouer le
# script avec "Impossible de remplacer la variable PID".
$collisions = 0
foreach ($name in $Photos.Keys) {
    $photoId = $Photos[$name]
    # On ignore la ligne de la bourse elle-meme : c'est son ancien credit
    # (celui du lot 26) qu'on est justement en train de remplacer.
    $lignes = Select-String -Path "CREDITS.md" -SimpleMatch $photoId
    foreach ($l in $lignes) {
        if ($l.Line -notmatch [regex]::Escape($name)) {
            Write-Host ("COLLISION : " + $photoId + " (" + $name + ") est deja credite ligne " + $l.LineNumber + " :") -ForegroundColor Red
            Write-Host ("    " + $l.Line.Trim()) -ForegroundColor Red
            $collisions++
        }
    }
}
if ($collisions -gt 0) {
    Write-Host ""
    Write-Host "Aucun telechargement. Choisir d'autres photos avant de relancer." -ForegroundColor Red
    exit 1
}
Write-Host "Garde anti-doublon : les 3 identifiants sont inedits dans le depot." -ForegroundColor Green

# ---- BALAYAGE GLOBAL : aucun identifiant ne doit etre credite deux fois ----
# Complement de la garde ci-dessus (qui ne teste que les identifiants DU
# lot) : verifie que CREDITS.md lui-meme ne contient aucun doublon.
#
# Motif photo-\d{10,13}-[0-9a-f]{12} — la borne est {10,13} A DESSEIN, ne
# pas la resserrer : les identifiants Unsplash ont 10 OU 13 chiffres (les
# anciens datent en secondes, les recents en millisecondes). Une borne
# fixe a {13} rate 12 photos reellement presentes dans CREDITS.md, dont
# cinq utilisees aux lots 25 et 26 — un doublon sur l'une d'elles
# passerait inapercu. Et un motif plus lache que photo-\d attrape
# "photo-fixes" dans le nom de ce script : faux doublon garanti.
$ids = Select-String -Path "CREDITS.md" -Pattern 'photo-\d{10,13}-[0-9a-f]{12}' -AllMatches |
    ForEach-Object { $_.Matches } | ForEach-Object { $_.Value }
$doublons = $ids | Group-Object | Where-Object { $_.Count -gt 1 }
if ($doublons) {
    foreach ($d in $doublons) {
        Write-Host ("DOUBLON dans CREDITS.md : " + $d.Name + " (" + $d.Count + " occurrences)") -ForegroundColor Red
    }
    Write-Host "Aucun telechargement. Corriger CREDITS.md avant de relancer." -ForegroundColor Red
    exit 1
}
Write-Host ("Balayage global : " + $ids.Count + " identifiants CDN dans CREDITS.md, zero doublon.") -ForegroundColor Green
Write-Host ""

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
Write-Host "Termine. 15 fichiers reecrits (3 bourses x 5 tailles)."

$manquants = 0
foreach ($name in $Photos.Keys) {
    foreach ($item in $Widths) {
        $f = Join-Path $Dir ($name + $item.S + ".jpg")
        if (-not (Test-Path $f)) {
            Write-Host ("MANQUANT : " + $f) -ForegroundColor Red
            $manquants++
        } elseif ((Get-Item $f).Length -lt 5000) {
            Write-Host ("SUSPECT (moins de 5 Ko) : " + $f) -ForegroundColor Yellow
            $manquants++
        }
    }
}

Write-Host ""
if ($manquants -eq 0) {
    Write-Host "15/15 fichiers presents et de taille plausible." -ForegroundColor Green
    Write-Host "AUCUN batch Firestore a lancer : le champ image ne change pas, seuls les fichiers sont remplaces."
    Write-Host "Etape suivante : mettre a jour les 3 entrees du lot 26 dans CREDITS.md, puis verifier a l'oeil sur scholarships.html."
} else {
    Write-Host ("" + $manquants + " fichier(s) en defaut.") -ForegroundColor Red
    exit 1
}
