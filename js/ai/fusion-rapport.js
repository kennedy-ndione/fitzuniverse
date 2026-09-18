/**
 * ============================================================
 * FitzUniverse — la mesure et le jugement, dans un seul rapport
 * ============================================================
 *
 * POURQUOI CE MODULE EXISTE (lot MESURE-ET-JUGEMENT, 2026-09-18)
 * -------------------------------------------------------------
 * Le 2026-09-18, Fitz a commencé à appeler un vrai modèle
 * (js/ai/ai-config.js, MODE = "passerelle"). Ce jour-là, la
 * vérification de dossier a gagné quelque chose et perdu autre chose,
 * sans que personne le décide :
 *
 *   GAGNÉ  — le modèle LIT enfin le contenu des pièces. Il relève une
 *            faute d'accord dans une lettre, une phrase creuse, un
 *            projet qui ne dit pas pourquoi CETTE formation.
 *   PERDU  — js/ai/controle-depot.js (lot R11) et
 *            js/ai/controle-bourse.js (lot B1) ne tournaient plus que
 *            dans le simulateur. Avec eux disparaissaient les seuls
 *            FAITS du rapport : le poids exact de chaque fichier
 *            comparé au plafond publié par le portail, la liste
 *            officielle des pièces, l'état des traductions.
 *
 * Un modèle ne peut pas récupérer ces faits : il ne voit pas les
 * octets, et il ne connaît pas le plafond d'un portail. Et il ne doit
 * surtout pas les deviner — c'est exactement la faute que le lot R11 a
 * effacée du dépôt (trois notes sur cinq dérivées d'un hachage de nom
 * de fichier).
 *
 * D'où ce module : le contrôle pur mesure, le modèle juge, et la
 * fusion dit qui a dit quoi.
 *
 *   l'anneau de score  ← LA MESURE (décision de Charles, 2026-09-18).
 *                        Un chiffre vérifiable, ou « — » quand rien
 *                        n'est mesurable. Jamais un jugement de style
 *                        déguisé en note.
 *   la liste de pièces ← LA MESURE. Le modèle n'a pas à inventer les
 *                        pièces qu'un portail demande.
 *   les catégories     ← LE JUGEMENT du contenu réellement lu.
 *   points faibles     ← LA MESURE D'ABORD, le jugement ensuite : un
 *                        fichier au-dessus du plafond est refusé
 *                        mécaniquement au guichet, avant toute
 *                        question de style.
 *   points forts       ← LE JUGEMENT SEUL. Une mesure n'est pas un
 *                        compliment : « lettre.pdf — 39 Ko, lue » sous
 *                        le titre « Points forts » était l'un des
 *                        défauts nommés par le lot B1.
 *
 * Pur : aucune dépendance, aucune écriture, aucun accès réseau. La
 * forme rendue est exactement celle qu'ai-check.js affiche déjà.
 * ============================================================
 */

function liste(valeur) {
  return Array.isArray(valeur) ? valeur.filter((x) => x !== undefined && x !== null) : [];
}

function objet(valeur) {
  return valeur && typeof valeur === "object" && !Array.isArray(valeur) ? valeur : {};
}

/**
 * @param {Object} entrees
 * @param {Object|null} entrees.controle - le retour de controleDepot() ou controleBourse()
 * @param {Object|null} entrees.ia - le `data` renvoyé par la tâche "check" (js/ai/prompts.js)
 * @returns {Object} le rapport à afficher
 */
export function fusionnerRapport({ controle = null, ia = null } = {}) {

  // Sans mesure, on ne fabrique pas de mesure : le rapport du modèle
  // passe tel quel, et l'anneau affichera « — » si le modèle n'a pas
  // su noter non plus.
  if (!controle) return ia || null;

  // Sans jugement — modèle en panne, ou aucun document lisible — le
  // contrôle pur EST le rapport, avec ses propres titres de listes.
  // C'est le comportement d'avant la bascule, et il reste juste.
  const categoriesIA = objet(ia && ia.categories);
  const aJuge = Object.keys(categoriesIA).length > 0;

  if (!ia) return controle;

  // LA PHRASE QUI DEVIENT FAUSSE. Les deux contrôles purs finissent
  // leur liste de suggestions par un avertissement honnête : « Le
  // CONTENU de vos documents n'est pas jugé ici — faites-le relire par
  // votre conseiller, un professeur ou un proche. » Dès que le modèle
  // juge le contenu, cette phrase ment dans l'autre sens : elle sous-
  // estime ce que l'étudiant vient de recevoir. Elle ne disparaît donc
  // QUE si le jugement a réellement eu lieu.
  const nonJuge = objet(controle.controle).nonJuge || "";
  const suggestionsControle = liste(controle.suggestions).filter(
    (s) => !(aJuge && nonJuge && s === nonJuge)
  );

  return {
    // LA MESURE, intouchée. `null` reste `null` : ai-check.js sait
    // afficher « — », et un dossier de bourse n'a pas de barème
    // publié à comparer (lot B1).
    overallScore: controle.overallScore === undefined ? null : controle.overallScore,
    pretADeposer: controle.pretADeposer,
    checklist: liste(controle.checklist),

    // LE JUGEMENT, ou la mesure en repli. Des catégories vides
    // laisseraient une section muette sans dire pourquoi.
    categories: aJuge ? categoriesIA : objet(controle.categories),
    categoryLabels: aJuge ? objet(ia.categoryLabels) : objet(controle.categoryLabels),

    // Les titres du contrôle ne valent que pour SES items. Dès que le
    // jugement s'y mêle, la page reprend ses titres d'origine.
    ...(aJuge ? {} : controle.listLabels ? { listLabels: controle.listLabels } : {}),

    strengths: liste(ia.strengths),
    weaknesses: [...liste(controle.weaknesses), ...liste(ia.weaknesses)],
    suggestions: [...suggestionsControle, ...liste(ia.suggestions)],

    // Le détail mesuré reste disponible pour un affichage plus fin.
    controle: controle.controle
  };

}
