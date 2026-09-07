/**
* ============================================================
* FitzUniverse — les pays de préinscription, et ce qu'on en sait
* ============================================================
*
* LA SOURCE de preinscriptions.html (lot Préinscriptions, 2026-09-07).
* Rien dans le HTML de cette page ne doit être un fait, un chiffre ou
* un niveau de préparation tapé à la main : tout vient d'ici, et les
* effectifs (établissements, coûts vérifiés) sont CALCULÉS depuis
* assets/data/catalogue.json en rejouant lireFrais() de js/frais.js.
*
* DEUX RÈGLES DURES
* -----------------
* 1. Un FAIT sans `source` (URL http/https) OU sans `verifieLe`
*    (AAAA-MM-JJ) ne peut pas exister dans PAYS : le test parcourt tous
*    les faits de tous les pays et refuse le premier manquant. Ce qui
*    n'a pas pu être sourcé le jour de la lecture n'entre pas comme
*    fait — au mieux comme phrase prudente dans `positionnement`.
* 2. `procedure` est un code fermé. Tant qu'un pays n'est pas
*    « documentee », aucune carte ne peut dire « pas à pas » : le
*    libellé vient de LIBELLES_PROCEDURE, jamais d'une phrase locale.
*
* L'ORDRE DES PAYS EST VALIDÉ (0. décisions prises) : France, Roumanie,
* Turquie, Maroc, Italie, Allemagne, Canada. Les États-Unis n'y sont
* pas (restrictions de visa de janvier 2026, postes consulaires
* africains fermés). La France est « en plein », les six autres sont
* nommés et présentés comme les prochains.
*
* Aucun DOM, aucun Firestore : testable sous Node.
* ============================================================
*/

import { lireFrais, ORDRE_NIVEAUX } from "./frais.js";

/** Le vocabulaire fermé de la procédure de portail. */
export const PROCEDURE = ["documentee", "en_cours", "a_venir"];

export const LIBELLES_PROCEDURE = {
documentee: "Procédure de portail documentée, accompagnée pas à pas",
en_cours: "Procédure de portail en cours de documentation",
a_venir: "Procédure de portail à venir"
};

/**
* Un fait = { texte, montant?, devise?, source, verifieLe }.
* `source` et `verifieLe` sont OBLIGATOIRES — voir la règle 1.
*/
export const PAYS = [

{
id: "france",
nom: "France",
ordre: 1,
code: "fr",
langue: ["français"],
portail: { nom: "Études en France", url: "https://pastel.diplomatie.gouv.fr/etudesenfrance/" },
procedure: "en_cours",
faits: [
{
texte: "Ressources exigées pour le visa étudiant : 877,50 € par mois, soit environ 10 530 € par an, depuis le 1er août 2026 (décret n° 2026-526 du 22 juin 2026).",
montant: 877.5, devise: "EUR",
source: "https://www.infomigrants.net/fr/post/72455/france--le-niveau-minimum-de-ressources-pour-les-etudiants-etrangers-passe-a-877-euros-a-compter-du-1er-aout-2026",
verifieLe: "2026-09-07"
},
{
texte: "Droits d'inscription différenciés 2026-2027 : 2 902 € en licence, 3 950 € en master. Les exonérations sont plafonnées à 30 % des étudiants non européens (25 % en 2027-2028).",
montant: 3950, devise: "EUR",
source: "https://www.service-public.gouv.fr/particuliers/actualites/A18927?lang=en",
verifieLe: "2026-09-07"
},
{
texte: "Études en France : 73 pays concernés, entretien obligatoire, 7 vœux au maximum par niveau, frais de dossier variables selon le pays de résidence.",
source: "https://demarchesetrangers.fr/blog/etudes-en-france-campus-france",
verifieLe: "2026-09-07"
}
],
positionnement: "Le plus gros marché francophone, aux règles désormais publiées noir sur blanc : droits, ressources exigées et plafond d'exonération."
},

{
id: "roumanie",
nom: "Roumanie",
ordre: 2,
code: "ro",
langue: ["français", "anglais", "allemand", "roumain"],
portail: null,
procedure: "a_venir",
faits: [
{
texte: "Admission sur dossier : lettre d'acceptation délivrée après pré-acceptation par l'université puis approbation du ministère. Un dossier incomplet est rejeté sans explication. Frais de traitement de 100 à 250 € selon l'université. Programmes en français, anglais, allemand ou roumain.",
source: "https://etudier-en-roumanie.com/etudiants-internationaux-en-roumanie/citoyens-non-eu-eea-et-swiss/103-acceptation-roumanie.html",
verifieLe: "2026-09-07"
}
],
positionnement: "Admission sur dossier, possible en français, dans l'espace Schengen. Le coût annuel des études n'a pas encore été vérifié."
},

{
id: "turquie",
nom: "Turquie",
ordre: 3,
code: "tr",
langue: ["turc", "anglais"],
portail: null,
procedure: "a_venir",
faits: [
{
texte: "Universités publiques : de 500 à 4 000 $ par an ; universités de fondation : de 5 000 à 20 000 $ par an. La licence en université publique passe par l'examen YÖS. Plus de 250 000 étudiants internationaux.",
source: "https://www.study-abroad.org/fr/etudier-en-turquie/",
verifieLe: "2026-09-07"
}
],
positionnement: "Un très gros volume d'accueil. Pas cher ET accessible suppose de passer l'examen YÖS.",
avertissement: "La bourse d'État turque est un pari à très faible probabilité : elle se tente, elle ne se planifie pas."
},

{
id: "maroc",
nom: "Maroc",
ordre: 4,
code: "ma",
langue: ["français", "arabe"],
portail: null,
procedure: "a_venir",
faits: [],
positionnement: "Proche, francophone, visa simple : un hub d'admission autofinancée plutôt que de bourses. Dans le public, l'admission des étudiants étrangers passe surtout par les quotas de l'AMCI, par voie diplomatique. Le coût du privé n'a pas encore été vérifié."
},

{
id: "italie",
nom: "Italie",
ordre: 5,
code: "it",
langue: ["italien", "anglais"],
portail: { nom: "Universitaly", url: "https://www.universitaly.it/" },
procedure: "a_venir",
faits: [
{
texte: "Étudiant non européen sans ISEE : de 1 000 à 4 000 € par an en université publique. Les bourses régionales DSU (exonération, logement, repas) sont ouvertes aux étudiants internationaux sur critères de revenu. Admission via Universitaly.",
source: "https://www.study-abroad.org/fr/etudier-en-italie/couts-et-financement/",
verifieLe: "2026-09-07"
}
],
positionnement: "Sous-estimée : plusieurs établissements déjà au catalogue, et des bourses régionales DSU déjà listées."
},

{
id: "allemagne",
nom: "Allemagne",
ordre: 6,
code: "de",
langue: ["allemand", "anglais"],
portail: { nom: "uni-assist", url: "https://www.uni-assist.de/" },
procedure: "a_venir",
faits: [
{
texte: "Compte bloqué exigé pour le visa : 11 904 € par an, soit 992 € par mois, depuis septembre 2024.",
montant: 11904, devise: "EUR",
source: "https://www.mygermanuniversity.com/fr/articles/Germany-Blocked-Account-Amount",
verifieLe: "2026-09-07"
}
],
positionnement: "Réputée gratuite à étudier — à vérifier Land par Land avant d'y compter — et chère à entrer : le compte bloqué se constitue avant le visa."
},

{
id: "canada",
nom: "Canada",
ordre: 7,
code: "ca",
langue: ["anglais", "français"],
portail: null,
procedure: "a_venir",
faits: [
{
texte: "Depuis le 1er janvier 2026, les candidats en master et doctorat dans un établissement public sont dispensés de la lettre d'attestation provinciale ou territoriale (PAL/TAL).",
source: "https://www.visahq.news/fr/2026-01-10/ca/graduate-students-exempt-from-study-permit-cap-as-ircc-drops-provincial-attestation-letter-requirement/",
verifieLe: "2026-09-07"
}
],
positionnement: "Master et doctorat en établissement public uniquement.",
avertissement: "Ce n'est pas une destination « pas cher et facile » : les frais sont élevés et les refus de permis fréquents — non chiffrés ici faute de source vérifiée."
}

];

/** Les pays, triés par `ordre`. Ne mute pas PAYS. */
export function lirePays() {
return [...PAYS].sort((a, b) => a.ordre - b.ordre);
}

/**
* Ce que le catalogue sait d'un pays, CALCULÉ — jamais tapé :
*   etablissements : universités du catalogue dont `country` est ce pays
*   coutsVerifies  : celles dont au moins un niveau porte un montant
*                    vérifié (sourcé + daté), en rejouant lireFrais()
*   procedure      : le code fermé du pays
* Accepte l'instantané brut (`universities`) comme la forme du chargeur
* du site (`universites`).
*/
export function etatDunPays(pays, catalogue, options) {

const unis = (catalogue && (catalogue.universities || catalogue.universites)) || [];
const dUnPays = unis.filter((u) => u && u.country === pays.nom);

const coutsVerifies = dUnPays.filter((u) => ORDRE_NIVEAUX.some((n) => lireFrais(u, n, options).etat === "verifie")).length;

return { etablissements: dUnPays.length, coutsVerifies, procedure: pays.procedure };

}

/** Libellé de procédure, toujours depuis le vocabulaire fermé. */
export function libelleProcedure(pays) {
return LIBELLES_PROCEDURE[pays && pays.procedure] || LIBELLES_PROCEDURE.a_venir;
}
