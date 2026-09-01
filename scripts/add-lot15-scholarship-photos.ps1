# ============================================================
# ScholarBridge - Photos des bourses, lot 15 (2026-08-28)
#
# Deuxieme vague : les pays a plusieurs bourses (hors Italie, qui
# suivra dans un lot dedie vu son volume) : Belgique (3), Canada (4),
# Chine (4), Etats-Unis (2), France (2) = 15 photos.
#
# Attention aux doublons internes evites lors du choix des monuments :
# les 4 bourses chinoises ont chacune un monument chinois different,
# distinct aussi des photos deja utilisees par les universites
# (beijing.jpg, beihang.jpg = Grande Muraille, tsinghua.jpg = Cite
# interdite, shanghai*.jpg, nanjing.jpg, etc.) - voir CREDITS.md pour
# le detail complet.
#
# Meme dossier que le lot 14 : assets\images\scholarships\
#
# Version ASCII pure (sans accents) pour compatibilite Windows
# PowerShell 5.1.
#
# Usage : depuis la racine du depot (la ou se trouve le dossier
# assets), dans un terminal PowerShell :
#   powershell -ExecutionPolicy Bypass -File scripts\add-lot15-scholarship-photos.ps1
#
# Etape suivante apres ce script : admin/expand-catalog-batch15.html
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
    "bourse-master-in-wbi"                          = "photo-1573995890753-a4f23342db17"
    "bourses-formations-internationales-ares"       = "photo-1657571575815-5487216793e3"
    "icp-connect-scholarships-vlir-uos"             = "photo-1718553781481-504e2f2fbc1d"
    "lester-b-pearson-international-scholarship"    = "photo-1753321178036-4a8b870a6435"
    "mcgill-major-entrance-scholarships"            = "photo-1537809804348-84588c9d988e"
    "ubc-international-scholars-program"            = "photo-1658714772930-1af6d2012114"
    "vanier-canada-graduate-scholarship"            = "photo-1578973615934-8d9cdb0792b4"
    "beijing-government-scholarship"                = "photo-1754258987839-60f8aeab8664"
    "chinese-government-scholarship"                = "photo-1528163186890-de9b86b54b51"
    "nanjing-government-scholarship"                = "photo-1517454376155-60f890ea84be"
    "shanghai-government-scholarship"               = "photo-1548919973-5cef591cdbc9"
    "knight-hennessy-scholars"                      = "photo-1717652480757-555af691acbb"
    "mastercard-foundation-scholars-program"        = "photo-1703693219517-e5693e7873bd"
    "eiffel-excellence-scholarship"                 = "photo-1492136344046-866c85e0bf04"
    "bourse-emile-boutmy"                           = "photo-1564557823522-1319c627a1e3"
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
Write-Host "Termine. 75 fichiers ecrits dans $Dir (15 bourses x 5 tailles)."
Get-ChildItem "$Dir\bourse-master-in-wbi*.jpg", "$Dir\bourses-formations-internationales-ares*.jpg", `
  "$Dir\icp-connect-scholarships-vlir-uos*.jpg", "$Dir\lester-b-pearson-international-scholarship*.jpg", `
  "$Dir\mcgill-major-entrance-scholarships*.jpg", "$Dir\ubc-international-scholars-program*.jpg", `
  "$Dir\vanier-canada-graduate-scholarship*.jpg", "$Dir\beijing-government-scholarship*.jpg", `
  "$Dir\chinese-government-scholarship*.jpg", "$Dir\nanjing-government-scholarship*.jpg", `
  "$Dir\shanghai-government-scholarship*.jpg", "$Dir\knight-hennessy-scholars*.jpg", `
  "$Dir\mastercard-foundation-scholars-program*.jpg", "$Dir\eiffel-excellence-scholarship*.jpg", `
  "$Dir\bourse-emile-boutmy*.jpg" | Format-Table Name, Length

Write-Host ""
Write-Host "Etape suivante : ouvrir admin/expand-catalog-batch15.html et lancer Analyser, Ecrire, Verifier."
