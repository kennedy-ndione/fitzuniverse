# ============================================================
# FitzUniverse - Photos des bourses, lot 26 (2026-08-30)
#
# Cinquieme vague. Corrige un defaut que le lot 25 n'avait PAS traite,
# et que l'analyse de ce lot avait meme ecarte a tort.
#
# CE QUI AVAIT ETE MANQUE
# Le lot 25 a traite les 30 bourses de l'etage 3 de la cascade (photo de
# la capitale du pays), en affirmant que l'etage 2 - photo de
# l'universite liee, 41 bourses - etait "deja varie". C'etait une
# supposition, pas une mesure. Verification faite le 30/08/2026 apres
# signalement : 15 de ces 41 bourses repetent une image deja prise dans
# leur pays, parce que plusieurs bourses pointent vers la MEME
# universite, ou vers des universites partageant une photo de ville.
#
# Le lot 24 a par ailleurs aggrave deux cas sans que ce soit anticipe :
# les trois programmes Commonwealth rattaches a london.jpg y rejoignent
# deux bourses qui l'utilisaient deja (Londres passe a 5 cartes), et
# spbu-open-olympiad porte moscow.jpg a 4 cartes. Le correctif restait
# juste - une vraie photo vaut mieux qu'un fond decoratif - mais il
# alimentait la repetition.
#
# ETAT AVANT CE LOT, MESURE
#   Royaume-Uni  11 cartes,  3 images   oxford.jpg x5, london.jpg x5
#   Roumanie      5 cartes,  2 images   politehnica-bucuresti.jpg x4
#   Russie        4 cartes,  1 image    moscow.jpg x4
#   Japon         4 cartes,  2 images   tokyo.jpg x3
#   Coree du Sud  6 cartes,  5 images   snu-seoul.jpg x2
#   Hongrie       5 cartes,  4 images   debrecen.jpg x2
#   Suisse        4 cartes,  3 images   lausanne.jpg x2
#   Allemagne     3 cartes,  3 images   - rien a corriger
#   Turquie       3 cartes,  3 images   - rien a corriger
#
# PRINCIPE DE CE LOT : une bourse de chaque groupe CONSERVE l'image
# partagee, les autres recoivent la leur. C'est pourquoi il y a 19
# photos et non 26 - garder une carte sur l'image existante evite un
# telechargement inutile sans laisser aucune repetition.
#
# Meme dossier que les lots 14 a 17 et 25 : assets\images\scholarships\
# Version ASCII pure pour compatibilite Windows PowerShell 5.1.
#
# Usage : depuis la racine du depot, dans un terminal PowerShell :
#   powershell -ExecutionPolicy Bypass -File scripts\add-lot26-scholarship-photos.ps1
#
# Etape suivante apres ce script : admin/expand-catalog-batch26.html
# ============================================================

$ErrorActionPreference = "Stop"

$Dir = "assets\images\scholarships"

if (-not (Test-Path "assets\images")) {
    Write-Host "Erreur : assets\images introuvable - lancer ce script depuis la racine du depot." -ForegroundColor Red
    exit 1
}

$Photos = [ordered]@{

    # ---- ROYAUME-UNI (8) - 11 cartes pour 3 images ----
    "clarendon-fund-scholarships"           = "photo-1472121779802-43c68a9f405f"   # les toits gothiques d'Oxford vus d'en haut
    "reach-oxford-scholarship"              = "photo-1568792923760-d70635a89fdc"   # une facade de college d'Oxford
    "rhodes-scholarships-west-africa"       = "photo-1642612460433-a5d935c08d73"   # un quadrangle d'Oxford et sa pelouse
    "weidenfeld-hoffmann-scholarships"      = "photo-1612563958093-2c3bcfbd8760"   # la pierre blonde d'Oxford sous un ciel bleu
    "commonwealth-masters-scholarships"     = "photo-1745016176874-cd3ed3f5bfc6"   # Big Ben et le Parlement au couchant
    "commonwealth-phd-scholarships"         = "photo-1546533658-8f1f550b9a4e"   # le London Eye
    "commonwealth-shared-scholarships"      = "photo-1560709889-eec6771309ff"   # un pont sur la Tamise
    "imperial-presidents-phd-scholarships"  = "photo-1619447093155-3d646f597c91"   # une cabine telephonique rouge devant un batiment londonien

    # ---- RUSSIE (3) - 4 cartes pour 1 image ----
    "spbu-open-olympiad"                    = "photo-1610197361600-33a3a5073cad"   # les fontaines de Peterhof, Saint-Petersbourg
    "hse-into-olympiad"                     = "photo-1513326738677-b964603b136d"   # la cathedrale Saint-Basile-le-Bienheureux
    "hse-merit-scholarships"                = "photo-1561117937-45681fb935ad"   # un batiment moscovite reflete dans l'eau

    # ---- ROUMANIE (3) - 5 cartes pour 2 images ----
    "auf-eugen-ionescu"                     = "photo-1678736680989-195226823176"   # la statue equestre de Matthias Corvin, Cluj-Napoca
    "auf-petrache-poenaru"                  = "photo-1710877669376-7633d6f64678"   # le palais de la Culture et son horloge, Iasi
    "bourse-george-darie"                   = "photo-1583751636643-94790958040a"   # les maisons colorees du centre de Cluj-Napoca

    # ---- JAPON (2) - 4 cartes pour 2 images ----
    "jads-japan-africa-dream"               = "photo-1503899036084-c55cdd92da26"   # le carrefour de Shibuya, Tokyo
    "jj-wbgsp"                              = "photo-1573456373835-579c408de263"   # Tokyo vue du ciel

    # ---- COREE DU SUD (1) - snu-seoul.jpg x2 ----
    "snu-glo-harmony-scholarship"           = "photo-1448523183439-d2ac62aca997"   # un pavillon de palais seoulien

    # ---- HONGRIE (1) - debrecen.jpg x2 ----
    "fao-hungarian-government-scholarship"  = "photo-1616432902940-b7a1acbc60b3"   # le Parlement hongrois sur le Danube

    # ---- SUISSE (1) - lausanne.jpg x2 ----
    "epfl-edic-doctoral"                    = "photo-1699470762437-bd145c9042ee"   # le campus de l'EPFL et les Alpes
}

function Get-Photo {
    param([string]$Name, [string]$PhotoId, [int]$Width, [string]$Suffix)
    $Out = Join-Path $Dir ($Name + $Suffix + ".jpg")
    $Url = "https://images.unsplash.com/" + $PhotoId + "?fm=jpg" + "&" + "q=80" + "&" + "w=" + $Width + "&" + "fit=max"
    Write-Host ("Telechargement : " + $Out + " (" + $Width + "px)...")
    curl.exe -sL --fail -o $Out $Url
    if ($LASTEXITCODE -ne 0) {
        Write-Host ("Echec du telechargement de " + $Out + " (curl a retourne " + $LASTEXITCODE + ").") -ForegroundColor Red
        Write-Host "Identifiant Unsplash probablement invalide - corriger la table avant de relancer." -ForegroundColor Red
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
Write-Host "Termine. 95 fichiers ecrits dans $Dir (19 bourses x 5 tailles)."

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

# Deux bourses ne doivent jamais partager le meme fichier : on compare
# les tailles des variantes 400w, deux identifiants Unsplash pointant par
# erreur sur la meme photo produiraient deux fichiers identiques.
$tailles = @{}
$collisions = 0
foreach ($name in $Photos.Keys) {
    $f = Join-Path $Dir ($name + "-400w.jpg")
    if (Test-Path $f) {
        $len = (Get-Item $f).Length
        if ($tailles.ContainsKey($len)) {
            Write-Host ("DOUBLON PROBABLE : " + $name + " et " + $tailles[$len] + " font exactement " + $len + " octets.") -ForegroundColor Yellow
            $collisions++
        } else {
            $tailles[$len] = $name
        }
    }
}

Write-Host ""
if ($manquants -eq 0 -and $collisions -eq 0) {
    Write-Host "95/95 fichiers presents, 19 photos toutes distinctes." -ForegroundColor Green
    Write-Host "Etape suivante : ouvrir admin/expand-catalog-batch26.html et lancer Analyser, Ecrire, Verifier."
} else {
    Write-Host ("Defauts : " + $manquants + " fichier(s) manquant(s)/suspect(s), " + $collisions + " doublon(s) probable(s).") -ForegroundColor Red
    Write-Host "NE PAS lancer le batch 26 avant correction." -ForegroundColor Red
    exit 1
}
