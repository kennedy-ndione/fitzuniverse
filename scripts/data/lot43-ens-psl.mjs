/**
 * ============================================================
 * Lot 43 — deux fiches ENS-PSL : « sur la page » en double
 * ============================================================
 *
 * Reperé en ligne le 2026-09-06. Le champ deadline des deux programmes
 * ENS-PSL (Sélection internationale, licence et master) se terminait
 * par « … à recouper sur la page officielle sur la page. » : une faute
 * de saisie du lot 38, pas une information.
 *
 * MÉTHODE OBLIGATOIRE DE TOUT LOT D'ÉCHÉANCES — le texte corrigé a été
 * REJOUÉ dans analyserEcheance() puis etatCandidature() avant d'être
 * écrit. Les deux rendent un état RIGOUREUSEMENT identique :
 *
 *     analyserEcheance  : datee, 2025-12-03  (inchangé)
 *     etatCandidature   : « Candidatures closes »,
 *                         « Dernière échéance connue : 3 décembre 2025 »
 *
 * Autrement dit, on retire quatre mots de trop et rien d'autre : aucune
 * date, aucun palier, aucune pastille ne bouge.
 * ============================================================
 */

export const PATCHES = [
  {
    "collection": "programs",
    "id": "ecole-normale-superieure-psl-paris__ens-psl-selection-internationale__licence",
    "attendu": {
      "deadline": "La page officielle affiche encore la session 2026 : clôture le 3 décembre 2025 à midi (Paris) pour Arts et humanités, et le 15 décembre 2025 à midi pour Sciences, ouvertures le 1er et le 16 octobre 2025. La session 2027 devrait ouvrir début octobre 2026 avec une clôture début-mi-décembre 2026 ; à recouper sur la page officielle sur la page."
    },
    "champs": {
      "deadline": "La page officielle affiche encore la session 2026 : clôture le 3 décembre 2025 à midi (Paris) pour Arts et humanités, et le 15 décembre 2025 à midi pour Sciences, ouvertures le 1er et le 16 octobre 2025. La session 2027 devrait ouvrir début octobre 2026 avec une clôture début-mi-décembre 2026 ; à recouper sur la page officielle."
    },
    "motif": "Faute de saisie du lot 38 : la phrase se terminait par « à recouper sur la page officielle sur la page. » — « sur la page » y figure deux fois. Aucune information retirée, aucune date touchée : analyserEcheance() et etatCandidature() rendent exactement le meme etat avant et apres (verifie le 2026-09-06). Le contenu reste celui lu sur https://www.ens.psl.eu/ le 2026-09-05."
  },
  {
    "collection": "programs",
    "id": "ecole-normale-superieure-psl-paris__ens-psl-selection-internationale__master",
    "attendu": {
      "deadline": "La page officielle affiche encore la session 2026 : clôture le 3 décembre 2025 à midi (Paris) pour Arts et humanités, et le 15 décembre 2025 à midi pour Sciences, ouvertures le 1er et le 16 octobre 2025. La session 2027 devrait ouvrir début octobre 2026 avec une clôture début-mi-décembre 2026 ; à recouper sur la page officielle sur la page."
    },
    "champs": {
      "deadline": "La page officielle affiche encore la session 2026 : clôture le 3 décembre 2025 à midi (Paris) pour Arts et humanités, et le 15 décembre 2025 à midi pour Sciences, ouvertures le 1er et le 16 octobre 2025. La session 2027 devrait ouvrir début octobre 2026 avec une clôture début-mi-décembre 2026 ; à recouper sur la page officielle."
    },
    "motif": "Faute de saisie du lot 38 : la phrase se terminait par « à recouper sur la page officielle sur la page. » — « sur la page » y figure deux fois. Aucune information retirée, aucune date touchée : analyserEcheance() et etatCandidature() rendent exactement le meme etat avant et apres (verifie le 2026-09-06). Le contenu reste celui lu sur https://www.ens.psl.eu/ le 2026-09-05."
  }
];
