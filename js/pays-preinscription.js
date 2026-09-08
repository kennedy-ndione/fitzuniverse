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
cle: "ressources",
texte: "Ressources exigées pour le visa étudiant : 877,50 € par mois, soit environ 10 530 € par an, depuis le 1er août 2026 (décret n° 2026-526 du 22 juin 2026).",
montant: 877.5, devise: "EUR",
montants: { mensuel: 877.5, annuel: 10530 },
source: "https://www.infomigrants.net/fr/post/72455/france--le-niveau-minimum-de-ressources-pour-les-etudiants-etrangers-passe-a-877-euros-a-compter-du-1er-aout-2026",
verifieLe: "2026-09-07"
},
{
cle: "droits",
texte: "Droits d'inscription différenciés 2026-2027 : 2 902 € en licence, 3 950 € en master. Les exonérations sont plafonnées à 30 % des étudiants non européens (25 % en 2027-2028).",
montant: 3950, devise: "EUR",
montants: { licence: 2902, master: 3950 },
plafondExoneration: 0.30,
source: "https://www.service-public.gouv.fr/particuliers/actualites/A18927?lang=en",
verifieLe: "2026-09-07"
},
// Réécrit le 2026-09-08 (lot EEF-DOC). Ce fait venait d'un agrégateur
// et portait la MÊME erreur que l'étape « vœux » de la procédure :
// « 7 vœux au maximum PAR NIVEAU ». Le plafond est de 7 AU TOTAL. Ce
// fait-ci est le plus exposé des deux — il s'affiche sur la page
// publique Préinscriptions (#faitsFrance) —, donc corriger la procédure
// sans le corriger revenait à laisser l'erreur là où elle se lit le
// plus. « 73 pays » et « frais variables selon le pays » partent avec :
// aucune page officielle consultée ne les porte, et les frais du
// Sénégal sont déjà dits, sourcés, dans le fait suivant.
{
cle: "procedure",
texte: "Études en France : au maximum sept (7) choix de formations connectées AU TOTAL — un plafond global, et non par niveau. Chaque type de formation a son sous-plafond à l'intérieur de ces 7 : 3 pour la Licence 1 (DAP), 2 pour les écoles d'architecture (DAP Jaune), 7 pour les BUT, les licences 2 et 3 et les masters.",
source: "https://www.senegal.campusfrance.org/je-constitue-mon-dossier-sur-etudes-en-france",
verifieLe: "2026-09-08"
},
{
cle: "fraisDossier",
texte: "Frais de dossier Campus France Sénégal : 85 000 F CFA, non remboursables. « Ne procéder à aucun paiement avant de recevoir cette demande » de paiement ; règlement en agence SUNU BANK.",
montant: 85000, devise: "XOF",
source: "https://www.senegal.campusfrance.org/les-questions-frequemment-posees",
verifieLe: "2026-09-07"
},
{
cle: "calendrier",
texte: "Calendrier Sénégal, rentrée 2026 : ouverture le 1er octobre, dépôt jusqu'au 15 décembre pour les formations connectées (du 1er avril au 12 juillet pour les non connectées), vérification des documents jusqu'au 27 juillet — la campagne se termine fin juillet.",
source: "https://www.senegal.campusfrance.org/calendrier-de-la-procedure-2026",
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

/**
* La campagne Études en France (grille B, 2026-09-07). `ouverture` est un
* fait (le 1er octobre, calendrier Campus France Sénégal — voir le fait
* « calendrier »). `cloture` est une BORNE COMMERCIALE : Campus France
* ne publie pas de date de fin de campagne pour 2027-2028 (vérifié le
* 2026-09-07) ; la dernière échéance publiée pour 2026 est le 27 juillet
* (vérification des documents). Le 31 juillet est donc la fin de la
* durée « une campagne » des offres Dossier France — pas un fait, une
* décision, dite comme telle. Le serveur (functions/lib/achat.js) en
* porte le MIROIR, et test/functions-achat.test.mjs compare les deux.
*/
export const CAMPAGNE_FRANCE = {
ouverture: { mois: 10, jour: 1 },
cloture: { mois: 7, jour: 31 },
faitCalendrier: "calendrier",
// Les JALONS publiés (lot E2, 2026-09-07) — formations connectées,
// calendrier Campus France Sénégal 2026 (page + PDF Calendrier2026VF_0).
// Une seule source pour js/procedures/* : jamais recopiés là-bas. Les
// mois d'octobre à décembre sont ceux de l'année d'ouverture, janvier à
// juillet ceux de l'année de clôture — jalonDeCampagne() fait le calcul.
jalons: {
soumission: { mois: 12, jour: 15, libelle: "Soumission du dossier (formations connectées)" },
paiement: { mois: 12, jour: 27, libelle: "Paiement des frais de dossier" },
visa: { mois: 5, jour: 1, libelle: "Demande de visa possible à partir du", debut: true },
confirmation: { mois: 5, jour: 31, libelle: "Confirmation du choix définitif" },
complements: { mois: 7, jour: 27, libelle: "Compléments de dossier et vérification des originaux" }
},
sourceJalons: "https://www.senegal.campusfrance.org/calendrier-de-la-procedure-2026",
jalonsVerifiesLe: "2026-09-07"
};

/**
* La date ISO d'un jalon pour la campagne en cours à `date` : un jalon
* d'octobre à décembre tombe dans l'année d'ouverture, un jalon de
* janvier à juillet dans l'année de clôture (finDeCampagne).
* @returns {{cle:string, iso:string, libelle:string, debut:boolean}|null}
*/
export function jalonDeCampagne(cle, date = new Date()) {
const jalon = CAMPAGNE_FRANCE.jalons[cle];
if (!jalon) return null;
const anneeCloture = finDeCampagne(date).getUTCFullYear();
const annee = jalon.mois > CAMPAGNE_FRANCE.cloture.mois ? anneeCloture - 1 : anneeCloture;
const iso = `${annee}-${String(jalon.mois).padStart(2, "0")}-${String(jalon.jour).padStart(2, "0")}`;
return { cle, iso, libelle: jalon.libelle, debut: jalon.debut === true };
}

/**
* Le 31 juillet de la campagne en cours à `date` (UTC, fin de journée) :
* août → décembre = l'année suivante ; janvier → juillet = la même année.
* Référence côté site ; le calcul qui FAIT FOI est celui du webhook.
*/
export function finDeCampagne(date) {
const d = date instanceof Date ? date : new Date(date);
const mois = d.getUTCMonth() + 1;
let annee = d.getUTCFullYear();
if (mois > CAMPAGNE_FRANCE.cloture.mois) annee += 1;
return new Date(Date.UTC(annee, CAMPAGNE_FRANCE.cloture.mois - 1, CAMPAGNE_FRANCE.cloture.jour, 23, 59, 59));
}

/** Un fait France par sa clé (`ressources`, `droits`, `fraisDossier`, …). */
export function faitFrance(cle) {
const france = PAYS.find((p) => p.id === "france");
const fait = france && france.faits.find((f) => f.cle === cle);
if (!fait) throw new Error(`Fait France introuvable : ${cle}`);
return fait;
}
