/**
 * ============================================================
 * FitzUniverse — les pays qui RELÈVENT de la procédure Études en France
 * ============================================================
 *
 * POURQUOI CE FICHIER (lot R15, 2026-09-18).
 *
 * La route de l'espace préinscription est bâtie sur la procédure Études
 * en France : créer un compte sur le portail, saisir son parcours,
 * formuler ses vœux, payer les frais de dossier, passer l'entretien
 * pédagogique. Onze de ses quinze étapes en viennent.
 *
 * Or cette procédure ne s'applique QUE depuis certains pays de
 * résidence. Un étudiant qui vit au Rwanda, en Tanzanie, en Belgique ou
 * en Suisse ne passe pas par elle : il candidate DIRECTEMENT auprès de
 * l'établissement. Lui dérouler quinze étapes dont onze ne le concernent
 * pas, c'est lui faire perdre sa campagne.
 *
 * LA SOURCE, ET UNE DIVERGENCE QU'IL FAUT CONNAÎTRE.
 *
 * La liste vient de la FAQ du site NATIONAL de Campus France, celle qui
 * fait foi :
 *   https://www.campusfrance.org/fr/faq/quels-sont-les-pays-relevant-de-la-procedure-etudes-en-france
 * relevée le 2026-09-18 : SOIXANTE-TREIZE pays.
 *
 * Plusieurs sites Campus France NATIONAUX publient une liste plus
 * courte et plus ancienne — celui du Liban en donnait quarante-six le
 * même jour, sans le Ghana, sans le Kenya, sans Madagascar. C'est
 * exactement le piège du lot R1 (« 7 vœux par niveau », lu chez un
 * agrégateur) : deux pages officielles ne disent pas la même chose, et
 * la bonne est celle du site national, pas celle qu'on trouve en
 * premier. Quand cette liste sera revérifiée, c'est cette URL-là qu'il
 * faut rouvrir, et `VERIFIE_LE` qu'il faut redater.
 *
 * COMMENT UN PAYS EST RECONNU.
 *
 * Par son code ISO, via findCountry() — le seul appariement de pays du
 * dépôt. « Côte d'Ivoire », « Cote d'Ivoire » et « CI » sont un seul
 * pays ; « Ivoirien » n'est pas un pays et ne trouve rien.
 *
 * DEUX DES SOIXANTE-TREIZE N'ONT PAS D'ISO ICI : Hong-Kong et Taïwan
 * ne figurent pas dans les 191 entrées de js/countries.js. Ils sont
 * gardés dans la liste — elle doit rester comparable à sa source, ligne
 * à ligne — avec `iso: null`. Conséquence pratique : un étudiant ne peut
 * pas les saisir à l'étape 1, donc ils ne déclenchent jamais rien. Les
 * retirer ferait mentir la liste sur ce qu'elle recopie.
 *
 * LA RÈGLE DE PRUDENCE, qui est le cœur de ce module : on n'avertit que
 * lorsqu'on SAIT. Un pays qu'on n'arrive pas à identifier ne reçoit
 * aucun avertissement — dire « la procédure ne s'applique pas chez vous »
 * à un Vietnamien parce qu'on a mal lu sa graphie serait pire que se
 * taire. `releveDeLaProcedureEEF()` rend donc trois valeurs, pas deux.
 * ============================================================
 */

import { findCountry } from "../countries.js";

/** La page qui fait foi. À rouvrir à chaque revérification. */
export const SOURCE_PAYS_EEF = "https://www.campusfrance.org/fr/faq/quels-sont-les-pays-relevant-de-la-procedure-etudes-en-france";

/** Le jour où la liste a été confrontée à sa source, mot pour mot. */
export const PAYS_EEF_VERIFIE_LE = "2026-09-18";

/**
 * Les soixante-treize, dans l'ordre de la page source, avec le libellé
 * de Campus France et le code ISO du référentiel du site.
 */
export const PAYS_ETUDES_EN_FRANCE = [
  { iso: "ZA", nom: "Afrique du Sud" },
  { iso: "DZ", nom: "Algérie" },
  { iso: "AO", nom: "Angola" },
  { iso: "SA", nom: "Arabie Saoudite" },
  { iso: "AR", nom: "Argentine" },
  { iso: "AM", nom: "Arménie" },
  { iso: "AZ", nom: "Azerbaïdjan" },
  { iso: "BH", nom: "Bahreïn" },
  { iso: "BJ", nom: "Bénin" },
  { iso: "MM", nom: "Birmanie" },
  { iso: "BO", nom: "Bolivie" },
  { iso: "BR", nom: "Brésil" },
  { iso: "BF", nom: "Burkina Faso" },
  { iso: "BI", nom: "Burundi" },
  { iso: "KH", nom: "Cambodge" },
  { iso: "CM", nom: "Cameroun" },
  { iso: "CA", nom: "Canada" },
  { iso: "CL", nom: "Chili" },
  { iso: "CN", nom: "Chine" },
  { iso: "CO", nom: "Colombie" },
  { iso: "KM", nom: "Comores" },
  { iso: "CG", nom: "Congo" },
  { iso: "KR", nom: "Corée du Sud" },
  { iso: "CI", nom: "Côte d'Ivoire" },
  { iso: "DJ", nom: "Djibouti" },
  { iso: "AE", nom: "Émirats arabes unis" },
  { iso: "EG", nom: "Égypte" },
  { iso: "EC", nom: "Équateur" },
  { iso: "US", nom: "États-Unis" },
  { iso: "ET", nom: "Éthiopie" },
  { iso: "GA", nom: "Gabon" },
  { iso: "GE", nom: "Géorgie" },
  { iso: "GH", nom: "Ghana" },
  { iso: "GN", nom: "Guinée" },
  { iso: "HT", nom: "Haïti" },
  { iso: null, nom: "Hong-Kong" },
  { iso: "IN", nom: "Inde" },
  { iso: "ID", nom: "Indonésie" },
  { iso: "IR", nom: "Iran" },
  { iso: "IL", nom: "Israël" },
  { iso: "JP", nom: "Japon" },
  { iso: "JO", nom: "Jordanie" },
  { iso: "KE", nom: "Kenya" },
  { iso: "KW", nom: "Koweït" },
  { iso: "LB", nom: "Liban" },
  { iso: "MG", nom: "Madagascar" },
  { iso: "MY", nom: "Malaisie" },
  { iso: "ML", nom: "Mali" },
  { iso: "MA", nom: "Maroc" },
  { iso: "MU", nom: "Maurice" },
  { iso: "MR", nom: "Mauritanie" },
  { iso: "MX", nom: "Mexique" },
  { iso: "NP", nom: "Népal" },
  { iso: "NE", nom: "Niger" },
  { iso: "NG", nom: "Nigeria" },
  { iso: "PK", nom: "Pakistan" },
  { iso: "PE", nom: "Pérou" },
  { iso: "QA", nom: "Qatar" },
  { iso: "CF", nom: "République Centrafricaine" },
  { iso: "CD", nom: "République démocratique du Congo" },
  { iso: "DO", nom: "République dominicaine" },
  { iso: "GB", nom: "Royaume-Uni" },
  { iso: "RU", nom: "Russie" },
  { iso: "SN", nom: "Sénégal" },
  { iso: "SG", nom: "Singapour" },
  { iso: null, nom: "Taïwan" },
  { iso: "TD", nom: "Tchad" },
  { iso: "TH", nom: "Thaïlande" },
  { iso: "TG", nom: "Togo" },
  { iso: "TN", nom: "Tunisie" },
  { iso: "TR", nom: "Turquie" },
  { iso: "UA", nom: "Ukraine" },
  { iso: "VN", nom: "Vietnam" }
];

const ISO_EEF = new Set(PAYS_ETUDES_EN_FRANCE.map((p) => p.iso).filter(Boolean));

/**
 * Le pays de résidence relève-t-il de la procédure Études en France ?
 *
 *   true  — il y est, la route s'applique ;
 *   false — il est identifié et il n'y est PAS : on avertit ;
 *   null  — on ne sait pas l'identifier (champ vide, graphie inconnue) :
 *           ON SE TAIT. Un avertissement faux sur une procédure qui
 *           décide d'une année d'études coûte plus cher qu'un silence.
 */
export function releveDeLaProcedureEEF(paysResidence) {
  const pays = findCountry(paysResidence);
  if (!pays || !pays.iso) return null;
  return ISO_EEF.has(pays.iso);
}
