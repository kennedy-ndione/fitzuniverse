# ============================================================
# FitzUniverse - Photos des bourses, lot 25 (2026-08-30)
#
# Quatrieme vague du remplacement des photos de bourse (voir lots 14,
# 15, 16, 17). Traite les 30 bourses qui, faute de photo propre ET de
# photo d'universite liee, retombaient sur l'etage 3 de la cascade de
# js/scholarship-image.js : la photo de la capitale du pays.
#
# CE QUE CE LOT CORRIGE EXACTEMENT
# Aucune de ces 30 cartes n'est cassee - chacune affiche une vraie
# photo. Le defaut est la REPETITION : les 8 bourses italiennes
# montrent toutes Rome, les 6 allemandes toutes Berlin, les 5 suisses
# toutes Zurich, les 5 japonaises toutes Tokyo, les 5 turques toutes
# Istanbul, et la bourse coreenne Seoul. Sur la page catalogue, six
# images se repetent trente fois.
#
# DOUBLONS EVITES (verifies un par un contre les lots 14-17)
# - Milan : le Duomo sert deja a bocconi.jpg (universite), et le lot 16
#   a pris Castello Sforzesco, Galleria Vittorio Emanuele II, Navigli,
#   Bosco Verticale et Arco della Pace. La cour de Brera est donc le
#   septieme sujet milanais, et le premier encore libre.
# - Pise : pisa.jpg (universite) et le sujet du lot 16 pour
#   university-of-pisa-phd-scholarship occupent deja la ville. La
#   Scuola Normale Superiore recoit donc LUCQUES, autre ville toscane -
#   substitution assumee, faute de photo exploitable de la Piazza dei
#   Cavalieri sur Unsplash (recherche du 30/08/2026 sans resultat).
# - Bologne : deja deux sujets pris par le lot 16 pour Unibo. La bourse
#   regionale ER.GO recoit donc PARME, autre ville d'Emilie-Romagne.
# - Geneve : deux sujets distincts pour deux bourses genevoises, comme
#   le lot 16 l'avait fait pour Naples et Trente - le Palais des
#   Nations pour l'IHEID, le Jet d'eau pour l'Universite de Geneve.
# - Ankara et Istanbul : ankara.jpg, istanbul.jpg, istanbul-technical,
#   istanbul-university, koc-istanbul et sabanci-istanbul sont deja
#   pris. Les cinq bourses turques vont donc ailleurs - Anitkabir,
#   Cappadoce, Izmir, Konya - sauf la bourse de theologie, qui recoit
#   une mosquee ottomane non localisee.
#
# Meme dossier que les lots 14 a 17 : assets\images\scholarships\
#
# Version ASCII pure (sans accents) pour compatibilite Windows
# PowerShell 5.1.
#
# Usage : depuis la racine du depot, dans un terminal PowerShell :
#   powershell -ExecutionPolicy Bypass -File scripts\add-lot25-scholarship-photos.ps1
#
# Etape suivante apres ce script : admin/expand-catalog-batch25.html
# ============================================================

$ErrorActionPreference = "Stop"

$Dir = "assets\images\scholarships"

if (-not (Test-Path "assets\images")) {
    Write-Host "Erreur : assets\images introuvable - lancer ce script depuis la racine du depot." -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $Dir)) {
    Write-Host "Creation de $Dir..."
    New-Item -ItemType Directory -Path $Dir | Out-Null
}

$Photos = [ordered]@{

    # ---- ITALIE (8) - les huit affichaient Rome ----
    "adisu-puglia"                         = "photo-1609948368716-254e2501d243"   # les trulli d'Alberobello
    "aliseo-liguria"                       = "photo-1516483638261-f4dbaf036963"   # Manarola, Cinque Terre
    "ardis-friuli-venezia-giulia"          = "photo-1623878991610-7416bc4e8c6f"   # le front de mer de Trieste
    "dsu-lombardia-milano-statale"         = "photo-1739826084732-1436a8908f20"   # la cour de Brera et sa statue de Napoleon, Milan
    "edisu-pavia"                          = "photo-1679098284781-1a211e7636a2"   # le Ponte Coperto sur le Tessin, Pavie
    "ergo-emilia-romagna"                  = "photo-1749680195704-f504f55054f9"   # le campanile de Parme
    "invest-your-talent-italy"             = "photo-1681477443350-45cfe74916e3"   # Verone et l'Adige
    "scuola-normale-superiore-phd"         = "photo-1747593467598-9cf0a9e46f02"   # la tour Guinigi, Lucques

    # ---- ALLEMAGNE (6) - les six affichaient Berlin ----
    "daad-epos"                            = "photo-1626447637943-4c9d412fa8cf"   # les tours de Francfort
    "daad-helmut-schmidt-programme"        = "photo-1553547274-0df401ae03c9"   # l'Elbphilharmonie, Hambourg
    "friedrich-ebert-stiftung"             = "photo-1632660609710-ca2ee0c3425b"   # Heidelberg, son pont et le Neckar
    "heinrich-boell-stiftung"              = "photo-1608322460360-009ddc765b99"   # la cathedrale de Cologne
    "konrad-adenauer-stiftung"             = "photo-1715281762727-daf602648ea4"   # Bonn
    "rosa-luxemburg-stiftung"              = "photo-1694098141071-8e1322860773"   # Leipzig et son beffroi

    # ---- JAPON (5) - les cinq affichaient Tokyo ----
    "abe-initiative-jica"                  = "photo-1587474064565-922e1178ec8f"   # Yokohama de nuit
    "honjo-international-scholarship"      = "photo-1578469645742-46cae010e5d4"   # une pagode de Kyoto
    "jasso-monbukagakusho-honors"          = "photo-1575489129683-4f7d23379975"   # le chateau d'Osaka
    "jica-sdgs-global-leader"              = "photo-1526481280693-3bfa7568e0f3"   # le mont Fuji
    "rotary-yoneyama-overseas"             = "photo-1550303435-1703d8811aaa"   # les daims de Nara

    # ---- SUISSE (5) - les cinq affichaient Zurich ----
    "iheid-scholarships"                   = "photo-1679589164488-ca6dc6746af9"   # le Palais des Nations, Geneve
    "unifr-research-scholarships"          = "photo-1609770264759-fd0f26b0de92"   # la vieille ville de Fribourg et la Sarine
    "unige-excellence-master-fellowships"  = "photo-1633022326182-1b36700bc49a"   # le Jet d'eau de Geneve
    "unil-master-grants"                   = "photo-1584469728290-46e7760c2d78"   # la cathedrale de Lausanne
    "zeno-karl-schindler-master-thesis"    = "photo-1664459937096-d395cd77f8b8"   # Berne et les ponts de l'Aar

    # ---- TURQUIE (5) - les cinq affichaient Istanbul ----
    "diyanet-tdv-international"            = "photo-1466442929976-97f336a657be"   # une mosquee ottomane
    "tubitak-2216-research-fellowship"     = "photo-1650802315195-f58a8663c9be"   # Anitkabir, Ankara
    "turkiye-burslari-research"            = "photo-1604156789095-3348604c0f43"   # les montgolfieres de Cappadoce
    "turkiye-burslari-success"             = "photo-1701428588034-5893b2512a68"   # la tour de l'Horloge d'Izmir
    "ytb-isdb-joint-scholarship"           = "photo-1698852785755-8fa52e11479a"   # le dome turquoise du mausolee de Mevlana, Konya

    # ---- COREE DU SUD (1) - affichait Seoul ----
    "koica-ciat-scholarship"               = "photo-1672671187899-a10f547341f1"   # le village de Gamcheon, Busan
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
Write-Host "Termine. 150 fichiers ecrits dans $Dir (30 bourses x 5 tailles)."

# Controle : chaque bourse doit avoir ses 5 fichiers, et aucun ne doit
# etre vide (curl --fail attrape le 404, pas une reponse tronquee).
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
    Write-Host "150/150 fichiers presents et de taille plausible." -ForegroundColor Green
    Write-Host "Etape suivante : ouvrir admin/expand-catalog-batch25.html et lancer Analyser, Ecrire, Verifier."
} else {
    Write-Host ("" + $manquants + " fichier(s) en defaut - NE PAS lancer le batch 25 avant correction.") -ForegroundColor Red
    exit 1
}
