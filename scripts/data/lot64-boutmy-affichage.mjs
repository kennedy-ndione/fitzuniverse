/**
 * ============================================================
 * LOT 64 — LA DATE DE BOUTMY S'AFFICHE (20 septembre 2026, tard)
 * ============================================================
 *
 * Un seul patch, une seule phrase, et une leçon qui vaut pour tous les
 * lots de catalogue à venir : DANS CE PROJET, LA PROSE N'EST PAS UN
 * COMMENTAIRE — ELLE EST LUE PAR LA MACHINE.
 *
 * Le lot 63 a corrigé la donnée de la bourse Émile Boutmy après
 * vérification à la source, et la fiche déployée a bien rouvert. Mais
 * sa ligne « Date limite » affichait « Non publiée » : la prose donnait
 * les deux comités du master sans millésime, et js/echeance.js ne
 * reconnaît une date que sous la forme jour + mois + ANNÉE. La donnée
 * vérifiée était juste, l'écran ne pouvait pas la dire.
 *
 * Deux règles de rédaction à retenir pour un champ `deadline` :
 *   1. toujours écrire l'année, même quand elle paraît évidente ;
 *   2. quand la fiche porte plusieurs dates, introduire la DERNIÈRE
 *      par « jusqu'au » — c'est le seul marqueur qui la fait retenir
 *      (analyserEcheance, règle 4.3). Sans lui, la première gagne, et
 *      une porte encore ouverte se referme des semaines trop tôt.
 * ============================================================
 */

export const PATCHES = [
  {
    "collection": "programs",
    "id": "sciences-po-paris__bourse-emile-boutmy",
    "attendu": {
      "deadline": "Deux comités pour le master : 19 octobre (résultats avant le 30 décembre) ou 30 novembre (résultats avant le 2 mars). La demande de bourse se fait DANS le dossier d'admission à Sciences Po — jamais après l'admission."
    },
    "champs": {
      "deadline": "Deux comités pour le master : premier dépôt le 19 octobre 2026 (résultats avant le 30 décembre), puis jusqu'au 30 novembre 2026 pour le second comité (résultats avant le 2 mars). La demande de bourse se fait DANS le dossier d'admission à Sciences Po — jamais après l'admission."
    },
    "motif": "LOT ÉCHÉANCES — correctif d'affichage du lot 63, constaté EN LIGNE. La prose écrite hier donnait les deux comités sans millésime (« 19 octobre », « 30 novembre ») : js/echeance.js ne lit une date que sous la forme jour-mois-ANNÉE, n'en trouvait aucune, et la fiche affichait « Date limite : Non publiée » alors que la base portait un deadlineISO vérifié au 30 novembre 2026. L'année est donc écrite, et le second comité est introduit par « jusqu'au » — le seul marqueur qui fait retenir la DERNIÈRE date plutôt que la première (analyserEcheance, règle 4.3). Sans lui, la fiche aurait affiché le 19 octobre comme date limite, en fermant deux mois trop tôt une porte encore ouverte. Vérifié avant écriture : la fiche affiche « Date limite : 30 novembre 2026 », 71 jours restants."
  }
];
