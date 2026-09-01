#!/usr/bin/env bash
# ============================================================
# ScholarBridge — Photos uniques par université (2026-08-28)
#
# Audit demandé par l'utilisateur : "je ne veux plus voir deux
# universités avec les mêmes photos". 7 photos de ville étaient
# partagées par 2 ou 3 universités des lots 1 à 9 (une même photo
# utilisée pour plusieurs documents "universities" distincts), et 2
# universités (Stanford, UC Berkeley) utilisaient carrément la photo
# d'une autre ville (newyork.jpg — erreur, ni l'une ni l'autre n'est à
# New York). Ce script télécharge les 9 nouvelles photos nécessaires
# pour qu'aucune université ne partage plus sa photo avec une autre.
# Elle ne les crée PAS en base — voir admin/expand-catalog-batch11.js
# pour la mise à jour du champ "image" des 9 documents concernés,
# à lancer seulement APRÈS ce script.
#
# Une seule université par groupe garde sa photo actuelle (aucun
# changement pour elle) ; l'autre (ou les deux autres, pour Istanbul)
# reçoit une nouvelle photo ci-dessous :
#
#   Groupe (photo actuelle)      Garde l'actuelle   Reçoit une photo neuve
#   ---------------------------  -----------------  --------------------------------
#   newyork.jpg (erreur, x2)     (aucune — erreur)  Stanford ET UC Berkeley (2 photos)
#   paris.jpg (x2)               Sciences Po        Sorbonne Université
#   istanbul.jpg (x3)            Boğaziçi           Istanbul University + ITU (2 photos)
#   riyadh.jpg (x2)              King Saud          Princess Nourah bint Abdulrahman
#   bucharest.jpg (x2)           Univ. de Bucarest  Politehnica Bucuresti (UNSTPB)
#   zurich.jpg (x2)              ETH Zurich         University of Zurich (UZH)
#   moscow.jpg (x2)              HSE University     RUDN University
#
# Sources vérifiées le 2026-08-28 (Unsplash License — usage commercial
# libre, aucune attribution obligatoire, créditées ici par choix comme
# le reste du projet — voir CREDITS.md déjà mis à jour) :
# - Stanford (Hoover Tower) : Jorge Fernández Salas, unsplash.com/photos/f5OO7rL6OD8
# - Berkeley (Sather Tower/Campanile) : Jeremy Huang, unsplash.com/photos/zn7eped3vn0
# - Sorbonne (façade, drapeaux français) : Slavan, unsplash.com/photos/0uWpkH81fTA
# - Istanbul University (mosquées et Bosphore) : Spenser Sembrat, unsplash.com/photos/UM_YUJUGK6g
# - ITU (tour de Léandre, rive asiatique) : Meriç Dağlı, unsplash.com/photos/-HxENS1GYSA
# - Princess Nourah (skyline de Riyad) : Mohammed Alqarni, unsplash.com/photos/XBRJXgXYJY4
# - Politehnica Bucuresti (vue aérienne de Bucarest) : Árpád Czapp, unsplash.com/photos/s0OkTmN8B-s
# - University of Zurich (Grossmünster) : Rico Reutimann, unsplash.com/photos/XxAR3uzYiZY
# - RUDN (tours modernes de Moscou) : Alexandr Bormotin, unsplash.com/photos/jj3PpeBIlLA
#
# Comme lausanne.jpg/jeddah.jpg (lot 9) et student-preparing.jpg :
# téléchargées directement aux largeurs voulues depuis le CDN Unsplash,
# pas de dépendance à sharp, aucune installation requise.
#
# Usage : depuis la racine du dépôt (là où se trouve assets/), lancer
#   bash scripts/add-lot11-unique-photos.sh
# ============================================================

set -euo pipefail

DIR="assets/images/cities"

if [ ! -d "$DIR" ]; then
  echo "Erreur : $DIR introuvable — lancer ce script depuis la racine du dépôt ScholarBridge." >&2
  exit 1
fi

STANFORD_ID="photo-1566549720649-01b61516861b"
BERKELEY_ID="photo-1638909374742-8c8364010106"
SORBONNE_ID="photo-1774526993562-abc3f2afac0f"
ISTANBUL_UNIV_ID="photo-1763965367191-6455ef032c79"
ISTANBUL_TECHNICAL_ID="photo-1564428366891-dc20b1edf33b"
PRINCESS_NOURAH_ID="photo-1674822858255-fcc093a1ef43"
POLITEHNICA_ID="photo-1639631684488-19a2b0fa456c"
ZURICH_UZH_ID="photo-1573137785546-9d19e4f33f87"
RUDN_ID="photo-1541447271487-09612b3f49f7"

download() {
  local name="$1" photo_id="$2" width="$3" suffix="$4"
  local out="$DIR/${name}${suffix}.jpg"
  echo "Téléchargement : $out (${width}px)..."
  curl -sL --fail -o "$out" \
    "https://images.unsplash.com/${photo_id}?fm=jpg&q=80&w=${width}&fit=max"
}

for width_suffix in "2400:" "400:-400w" "800:-800w" "1200:-1200w" "1600:-1600w"; do
  width="${width_suffix%%:*}"
  suffix="${width_suffix##*:}"
  download "stanford" "$STANFORD_ID" "$width" "$suffix"
  download "berkeley" "$BERKELEY_ID" "$width" "$suffix"
  download "sorbonne" "$SORBONNE_ID" "$width" "$suffix"
  download "istanbul-university" "$ISTANBUL_UNIV_ID" "$width" "$suffix"
  download "istanbul-technical" "$ISTANBUL_TECHNICAL_ID" "$width" "$suffix"
  download "princess-nourah" "$PRINCESS_NOURAH_ID" "$width" "$suffix"
  download "politehnica-bucuresti" "$POLITEHNICA_ID" "$width" "$suffix"
  download "zurich-grossmunster" "$ZURICH_UZH_ID" "$width" "$suffix"
  download "rudn" "$RUDN_ID" "$width" "$suffix"
done

echo ""
echo "Terminé. 45 fichiers écrits dans $DIR :"
ls -la "$DIR"/stanford*.jpg "$DIR"/berkeley*.jpg "$DIR"/sorbonne*.jpg \
  "$DIR"/istanbul-university*.jpg "$DIR"/istanbul-technical*.jpg \
  "$DIR"/princess-nourah*.jpg "$DIR"/politehnica-bucuresti*.jpg \
  "$DIR"/zurich-grossmunster*.jpg "$DIR"/rudn*.jpg

echo ""
echo "CREDITS.md a déjà été mis à jour avec ces 9 sources (voir le fichier)."
echo "Prochaine étape : admin/expand-catalog-batch11.html — corrige le champ"
echo "\"image\" des 9 universités concernées maintenant que les fichiers existent."
