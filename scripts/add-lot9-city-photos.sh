#!/usr/bin/env bash
# ============================================================
# ScholarBridge — Ajout de 2 photos de ville : Lausanne (Suisse, pour
# EPFL) et Jeddah (Arabie Saoudite, pour King Abdulaziz University).
# Ces deux universités ont été écartées du lot 7 faute de photo de
# ville en stock — voir le commentaire "CANDIDATS ÉCARTÉS" dans
# admin/expand-catalog-batch7.js.
#
# Pourquoi un script séparé plutôt qu'un ajout direct : l'environnement
# cloud où ce script a été rédigé n'a accès qu'aux registres de paquets
# (npm/pip/etc.), pas au CDN d'Unsplash — ce téléchargement doit donc
# se faire depuis une machine avec accès internet normal, une seule
# fois, à la racine du dépôt ScholarBridge.
#
# Sources vérifiées (Unsplash License — usage commercial libre, aucune
# attribution obligatoire, créditées ici par choix comme le reste du
# projet — voir CREDITS.md déjà mis à jour) :
# - Lausanne : https://unsplash.com/photos/dQTNnp1Jb8E (Nolan Krattinger,
#   "View from the Lausanne Cathedral")
# - Jeddah : https://unsplash.com/photos/a-large-sign-that-says-jeddah-in-front-of-palm-trees-dBgLXxob7NQ
#   (Datingscout, le panneau "Jeddah" emblématique en bord de mer)
#
# Usage : depuis la racine du dépôt (là où se trouve assets/), lancer
#   bash scripts/add-lot9-city-photos.sh
# Télécharge directement chaque largeur depuis le CDN Unsplash (mêmes
# paramètres ?w=&q=80&fm=jpg que student-preparing.jpg, voir
# CREDITS.md) — pas de dépendance à sharp, aucune installation requise.
# ============================================================

set -euo pipefail

DIR="assets/images/cities"

if [ ! -d "$DIR" ]; then
  echo "Erreur : $DIR introuvable — lancer ce script depuis la racine du dépôt ScholarBridge." >&2
  exit 1
fi

LAUSANNE_ID="photo-1603646049799-736bb072cec5"
JEDDAH_ID="photo-1674979724572-c0a0579bc9d0"

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
  download "lausanne" "$LAUSANNE_ID" "$width" "$suffix"
  download "jeddah" "$JEDDAH_ID" "$width" "$suffix"
done

echo ""
echo "Terminé. 10 fichiers écrits dans $DIR :"
ls -la "$DIR"/lausanne*.jpg "$DIR"/jeddah*.jpg

echo ""
echo "CREDITS.md a déjà été mis à jour avec ces deux sources (voir le fichier)."
echo "Prochaine étape : lot 9 — ajouter EPFL (Lausanne) à Swiss Government"
echo "Excellence Scholarships et King Abdulaziz University (Jeddah) aux"
echo "bourses du gouvernement saoudien, maintenant que les photos existent."
