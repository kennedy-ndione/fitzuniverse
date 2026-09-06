/**
 * ============================================================
 * Lot 44 — la troisieme fiche qui portait la meme faute
 * ============================================================
 *
 * Trouvée en balayant le catalogue APRÈS le lot 43. La consigne citait
 * deux fiches ENS-PSL ; une troisième portait exactement le même
 * « sur la page officielle sur la page », restée invisible parce que la
 * phrase se termine ici par « russe. » et non par un point.
 *
 * La leçon est celle du garde-fou des lots photo : quand une faute de
 * saisie est trouvée, on cherche le MOTIF dans tout le catalogue avant
 * de refermer — pas seulement aux endroits signalés.
 *
 * MÉTHODE OBLIGATOIRE DE TOUT LOT D'ÉCHÉANCES — texte rejoué dans
 * analyserEcheance() puis etatCandidature() avant écriture. Identique :
 *
 *     analyserEcheance  : datee, 2025-10-26  (inchangé)
 *     etatCandidature   : « Candidatures closes »,
 *                         « Dernière échéance connue : 26 octobre 2025 »
 * ============================================================
 */

export const PATCHES = [
  {
    "collection": "programs",
    "id": "hse-university-moscow__hse-into-olympiad",
    "attendu": {
      "deadline": "La page anglaise affiche encore le calendrier 2025 : inscription du 26 août au 26 octobre 2025, épreuves du 5 au 15 novembre 2025, et annonce que les informations sur la prochaine édition seront publiées bientôt. L'édition 2026 devrait suivre le même rythme (inscription fin août → fin octobre) ; à recouper sur la page officielle sur la page russe."
    },
    "champs": {
      "deadline": "La page anglaise affiche encore le calendrier 2025 : inscription du 26 août au 26 octobre 2025, épreuves du 5 au 15 novembre 2025, et annonce que les informations sur la prochaine édition seront publiées bientôt. L'édition 2026 devrait suivre le même rythme (inscription fin août → fin octobre) ; à recouper sur la page officielle russe."
    },
    "motif": "Meme faute de saisie que les deux fiches ENS-PSL du lot 43 : « à recouper sur la page officielle sur la page russe. » — « sur la page » y figure deux fois. Corrige en « sur la page officielle russe. » : les deux qualificatifs sont gardes, aucune information retiree. analyserEcheance() et etatCandidature() rendent exactement le meme etat avant et apres (verifie le 2026-09-06)."
  }
];
