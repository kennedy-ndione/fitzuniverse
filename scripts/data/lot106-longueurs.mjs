/**
* ============================================================
* LOT 106-LONGUEURS — les textes des cartes tiennent dans la carte
* (2026-09-25)
* ============================================================
*
* Après l'écriture du lot 106, `npm test` (lisible 6) a refusé sept
* textes trop longs pour les cartes : quatre descriptions au-delà de
* 150 caractères, trois premières phrases de financement au-delà de 70.
* Faute de Claude : le catalogue simulé n'avait pas été passé à la
* suite complète avant le dépôt. Le détail reste sur la fiche (les
* critères généraux et les programmes le portent déjà) ; la carte ne
* garde que l'essentiel.
*
* EXÉCUTION :
*   node scripts\lot.mjs analyser 106-longueurs
*   node scripts\lot.mjs ecrire 106-longueurs
*   node scripts\lot.mjs verifier 106-longueurs
* ============================================================
*/

const MOTIF = "Lot 106-longueurs — texte de carte raccourci (lisible 6) : le détail reste sur la fiche.";

const patch = (id, attendu, champs) => ({ collection: "scholarships", id, motif: MOTIF, attendu, champs });

export const PATCHES = [

patch("apu-international-merit-awards",
{ description: "Réduction des frais de scolarité d'APU, à Kuala Lumpur, ouverte à toutes les nationalités, selon vos résultats : en licence sur les notes du diplôme de fin d'études secondaires, en master sur la moyenne de licence." },
{ description: "Réduction des frais d'APU, à Kuala Lumpur, pour toutes les nationalités, selon vos notes du secondaire en licence ou votre moyenne en master." }),

patch("taylors-research-excellence-scholarship",
{ description: "Bourse de recherche de Taylor's University, ouverte aux étudiants malaisiens et internationaux, pour un master par la recherche ou un doctorat. Les masters en cours ne sont pas concernés.",
  funding: "Frais de scolarité payés à 100 %, et selon la formule une allocation mensuelle : 1 500 RM en master par la recherche, jusqu'à 2 300 RM en doctorat." },
{ description: "Bourse de recherche de Taylor's University, ouverte aux étrangers, pour un master par la recherche ou un doctorat. Masters en cours exclus.",
  funding: "Frais de scolarité payés à 100 %, allocation selon la formule. En master par la recherche, 1 500 RM par mois ; en doctorat, jusqu'à 2 300 RM." }),

patch("ozyegin-international-admission-scholarships",
{ description: "Bourse d'admission d'Özyeğin University, à Istanbul, pour les étudiants internationaux en licence. Tous les candidats sont évalués automatiquement, sans demande séparée.",
  funding: "Réduction de 40 %, 50 % ou 60 % sur des frais de 25 000 USD par an en 2026-2027 : il reste 15 000, 12 500 ou 10 000 USD à payer." },
{ description: "Bourse d'admission d'Özyeğin University, à Istanbul, pour les étudiants internationaux en licence, sans demande séparée.",
  funding: "Réduction de 40 %, 50 % ou 60 % des frais de scolarité. Sur 25 000 USD par an en 2026-2027, il reste 15 000, 12 500 ou 10 000 USD à payer." }),

patch("uemf-bourse-etudiants-internationaux",
{ description: "Bourse spéciale de l'Université Euromed de Fès pour ses étudiants internationaux, du cycle préparatoire au doctorat, attribuée par une commission sur dossier." },
{ description: "Bourse spéciale de l'Université Euromed de Fès pour ses étudiants internationaux, de la licence au doctorat, sur dossier." }),

patch("sunway-academic-excellence-scholarships",
{ funding: "6 000 RM ou 11 000 RM déduits des frais de scolarité chaque année, de la 1re à la 3e année de licence." },
{ funding: "6 000 ou 11 000 RM par an déduits des frais de scolarité. Versée de la 1re à la 3e année de licence, sous condition de moyenne." })

];

export const UNIVERSITIES = [];
export const SCHOLARSHIPS = [];
export const LINKS = [];
export const SUPPRESSIONS = [];
