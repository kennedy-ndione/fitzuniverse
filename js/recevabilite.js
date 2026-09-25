/**
* ============================================================
* PUIS-JE ME LANCER ? — la recevabilité, pays par pays (2026-09-25)
* ============================================================
*
* Charles : « il faut que le diagnostic puisse tout dire à l'étudiant
* avant de passer à n'importe quel parcours de candidature, pour qu'il
* sache s'il peut se lancer ou pas ». Le diagnostic devient gratuit
* (lot 97) et dit, avant tout paiement, s'il a le DROIT DE POSTULER avec
* son niveau d'études actuel — et ce qui lui manque sinon.
*
* LA LIMITE, DITE PARTOUT : on juge la RECEVABILITÉ (le droit de
* candidater), jamais l'ADMISSION, qui dépend du jury, des notes et des
* places. « Vous pouvez postuler », jamais « vous serez admis ».
*
* QUATRE VOYANTS, UNE PHRASE
* --------------------------
*   niveau      le diplôme actuel contre le diplôme exigé, pays du
*               diplôme compris (le bac marocain compte 12 ans, le bac
*               guinéen mène au Studienkolleg en Allemagne…)
*   langue      la langue des cours contre ce que l'étudiant déclare
*   argent      le verdict du diagnostic chiffré (js/diagnostic-pays.js,
*               js/diagnostic-france.js), repris tel quel
*   calendrier  est-il encore temps pour la prochaine rentrée
* Chaque voyant vaut « ok », « condition » (possible, avec une étape
* de plus), « bloque » (pas encore) ou « info » (rien à trancher). La
* phrase finale : « Vous pouvez vous lancer », « … à condition de… »,
* ou « Pas encore ».
*
* LES SOURCES. Tout vient des pages officielles, lues le 2026-09-25 :
* recherche pays par pays, puis relecture à la main des points
* décisifs (base du DAAD pays par pays et série par série, liste de la
* MQA, répertoire de l'AMCI, circulaire italienne 2026-2027, Laval pour
* le Maroc, critères de Campus France Sénégal). Détail et citations :
* doc projet claude/lot98-puis-je-me-lancer-2026-09-25.md.
*
* LES PAYS DU DIPLÔME. Les huit du lot S2 (Sénégal, Côte d'Ivoire,
* Cameroun, Maroc, Bénin, Guinée, Togo, Burkina Faso). Un diplôme d'un
* autre pays reçoit « pas encore vérifié pour un diplôme de ce pays »,
* jamais une règle devinée.
*
* Module pur : aucun DOM, aucun Firestore.
* ============================================================
*/

import { destination } from "./destinations-preinscription.js";
import { auPays } from "./pays-grammaire.js";
import { CAMPAGNE_FRANCE, finDeCampagne } from "./pays-preinscription.js";
import { findCountry } from "./countries.js";

export const VERIFIE_LE = "2026-09-25";

// ------------------------------------------------------------
// Les questions
// ------------------------------------------------------------

/** Les pays du diplôme vérifiés (code ISO), puis « autre ». */
export const PAYS_DIPLOME = [
{ id: "SN", nom: "Sénégal" },
{ id: "CI", nom: "Côte d'Ivoire" },
{ id: "CM", nom: "Cameroun" },
{ id: "MA", nom: "Maroc" },
{ id: "BJ", nom: "Bénin" },
{ id: "GN", nom: "Guinée" },
{ id: "TG", nom: "Togo" },
{ id: "BF", nom: "Burkina Faso" },
{ id: "autre", nom: "Un autre pays" }
];

/** Le diplôme le plus élevé, obtenu ou en cours, dans l'ordre. */
export const DIPLOMES = [
{ id: "terminale", libelle: "Je suis en terminale" },
{ id: "bac", libelle: "J'ai le bac" },
{ id: "bac1", libelle: "Bac + 1 : une année d'université réussie" },
{ id: "bac2", libelle: "Bac + 2 : BTS, DUT, DEUG ou deux années réussies" },
{ id: "l3", libelle: "Je suis en dernière année de licence" },
{ id: "licence", libelle: "J'ai une licence (bac + 3)" },
{ id: "m2", libelle: "Je suis en dernière année de master" },
{ id: "master", libelle: "J'ai un master (bac + 5)" }
];

const RANG = Object.fromEntries(DIPLOMES.map((d, i) => [d.id, i]));

/** Les familles de séries du bac (la règle allemande en dépend). */
export const SERIES = [
{ id: "scientifique", libelle: "Scientifique (S1, S2, C, D…)" },
{ id: "litteraire", libelle: "Littéraire (L, A…)" },
{ id: "economique", libelle: "Économique (G, B…)" },
{ id: "technique", libelle: "Technique (S3, T, E, F…)" }
];

export const MENTIONS = [
{ id: "passable", libelle: "Passable" },
{ id: "assez-bien", libelle: "Assez bien" },
{ id: "bien", libelle: "Bien" },
{ id: "tres-bien", libelle: "Très bien" }
];

/** Ce que l'étudiant sait de la langue des cours. */
export const STATUTS_LANGUE = [
{ id: "etudes", libelle: "J'ai fait mon lycée dans cette langue" },
{ id: "test", libelle: "J'ai un test ou un certificat de cette langue" },
{ id: "prevu", libelle: "Je vais passer un test" },
{ id: "aucun", libelle: "Je ne parle pas encore cette langue" }
];

/** Le niveau visé : « Licence », « Master », « Doctorat » (desiredDegree) → clé. */
export function niveauVise(valeur) {
const v = String(valeur || "").toLowerCase();
if (v.startsWith("doct")) return "doctorat";
if (v.startsWith("mast")) return "master";
if (v.startsWith("lic") || v.startsWith("bach")) return "licence";
return "";
}

// ------------------------------------------------------------
// Les sources (une fois chacune)
// ------------------------------------------------------------
const S = {
cfSenegal: "https://www.senegal.campusfrance.org/criteres-d-eligibilite-pour-la-campagne-etudes-en-france",
cfGuinee: "https://www.guinee.campusfrance.org/cas-particuliers",
noticeDap: "https://www.enseignementsup-recherche.gouv.fr/sites/default/files/2024-10/notice-du-dossier-blanc-2026-2027-34734.pdf",
monMaster: "https://information.monmaster.gouv.fr/faq/candidater/",
doctoratFr: "https://www.service-public.gouv.fr/particuliers/vosdroits/F36519/1",
cfMaroc: "https://www.maroc.campusfrance.org/les-certifications-en-francais-obligatoires-pour-campus-france",
cfCameroun: "https://www.cameroun.campusfrance.org/fr/candidats-au-test-de-francais-tcf-dap",
cfCalendrier: "https://www.senegal.campusfrance.org/calendrier-de-la-procedure",
circolare: "https://universitaly-private.cineca.it/uploads/universitaly-pubblico/Circolare_2026-2027_studenti_internazionali.pdf",
daad: "https://www.daad.de/en/studying-in-germany/requirements/admission-database/",
kmkDeutsch: "https://www.hrk.de/fileadmin/redaktion/hrk/02-Dokumente/02-07-Internationales/Rahmenordnung_ueber_Deutsche_Sprachpruefungen_fuer_das_Studium_an_deutschen_Hochschulen__RO-DT__2020.pdf",
laval: "https://www.ulaval.ca/en/admission/prepare-your-application/admission-requirements-for-each-type-of-applicant",
lavalMaroc: "https://www.ulaval.ca/en/ulaval-experience/international-applicants/academic-equivalence/applicants-from-morocco",
udemSenegal: "https://admission.umontreal.ca/admission/vous-etes/etudiant-a-linternational/senegal/",
uqamPays: "https://etudier.uqam.ca/etudiants-etrangers/equivalences-diplomes-par-pays",
uqamFrancais: "https://etudier.uqam.ca/exigence-tfi-pays-programmes-1er-cycle",
uottawa: "https://www.uottawa.ca/study/undergraduate-studies/international-applicants/senegal",
uottawaCycles: "https://www.uottawa.ca/study/graduate-studies/international-equivalencies",
utorontoAnglais: "https://future.utoronto.ca/english-language-requirements",
ircc: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/prepare/choose-school-college-university.html",
roumanie: "https://www.edu.ro/sites/default/files/fisiere%20articole/OM_5655-2024.pdf",
yok: "https://egitim.yok.gov.tr/tr/document/2969",
yokLangue: "https://kmu.edu.tr/mevzuat/bilgi/1081/yuksekogretim-kurumlarinda-yabanci-dil-ogretimi-ve-yabanci-dille-ogretim-yapilmasinda-uyulacak-esaslara-iliskin-yonetmelik",
yokCycles: "https://www.mevzuat.gov.tr/File/GeneratePdf?mevzuatNo=21510&mevzuatTur=KurumVeKurulusYonetmeligi&mevzuatTertip=5",
amci: "https://www.amci.ma/sites/default/files/2025-07/repertoire-des-etablissements-2025-2026.pdf",
aui: "https://aui.ma/admission-aid/international/freshmen",
moeChine: "http://www.moe.gov.cn/srcsite/A02/s5911/moe_621/201705/t20170516_304735.html",
sysu: "https://iso.sysu.edu.cn/en/application/selffunded/1420575.htm",
zju: "https://iczu.zju.edu.cn/admissionsen/2024/1030/c68988a2981659/page.htm",
mqa: "https://www.mqa.gov.my/new/document/2025/The%20List%20of%20Entry%20Qualifications%20for%20International%20Student%20-%20December%202025.pdf",
mqaCycles: "https://www2.mqa.gov.my/qad/v2/2021/new/Final%20MDD%202021%20-%20upload%20v2.pdf"
};

const src = (...urls) => urls.map((url) => ({ url, verifieLe: VERIFIE_LE }));

// ------------------------------------------------------------
// Outils
// ------------------------------------------------------------
const ok = (titre, texte, sources = []) => ({ etat: "ok", titre, texte, sources });
const condition = (titre, texte, sources = []) => ({ etat: "condition", titre, texte, sources });
const bloque = (titre, texte, sources = [], deblocage = "") => ({ etat: "bloque", titre, texte, sources, deblocage });
const inconnu = (titre, texte, sources = []) => ({ etat: "condition", titre, texte, sources, aVerifier: true });

/** Le nom de la destination (la France n'est pas dans DESTINATIONS). */
function nomDe(id) {
if (id === "france") return "France";
const d = destination(id);
return d ? d.nom : "";
}

function nomPaysDiplome(code) {
const p = PAYS_DIPLOME.find((x) => x.id === code);
return p ? p.nom : "";
}

/** Le diplôme exigé n'est pas encore là : la phrase qui le dit, et ce qui débloque. */
function manqueDiplome(niveau, id) {
const dans = auPays(nomDe(id));
if (niveau === "master") return bloque("Pas encore", `Un master ${dans} demande une licence (bac + 3). Terminez d'abord votre licence : vous pourrez candidater pendant sa dernière année.`, [], "Finir la licence, puis candidater en master pendant la dernière année.");
if (niveau === "doctorat") return bloque("Pas encore", `Un doctorat ${dans} demande un master. Terminez d'abord votre master.`, [], "Finir le master, puis chercher un directeur de thèse.");
return bloque("Pas encore", `Une licence ${dans} demande le bac.`, [], "Obtenir le bac.");
}

/** Terminale, licence ou master en cours : le diplôme n'est pas encore acquis. */
function enCours(diplome) {
return diplome === "terminale" || diplome === "l3" || diplome === "m2";
}

// ------------------------------------------------------------
// LE NIVEAU, destination par destination
// ------------------------------------------------------------
//
// Chaque fonction reçoit les entrées normalisées et le niveau visé, et
// rend un voyant. Le cas « diplôme trop bas » est traité avant, en
// commun (voyantNiveau) ; ici on ne voit que des candidats qui ont, ou
// préparent, le diplôme d'entrée.

const NIVEAU = {

france(e, niveau, ctx) {
if (niveau === "licence") {
const R = ctx.rentree;
if (e.paysDiplome === "SN" && !enCours(e.diplome)) {
// Campus France Sénégal : en L1, le bac de l'année ou de la précédente, une reprise au plus.
if (["bac", "bac1"].includes(e.diplome) && Number.isFinite(e.anneeBac) && e.anneeBac < R - 1) {
return bloque("Pas par cette voie", `Campus France Sénégal n'accepte en première année que le bac de l'année ou de l'année précédente (pour la rentrée ${R} : bac ${R - 1} ou ${R}). Votre bac date de ${e.anneeBac}.`, src(S.cfSenegal), "Valider un cycle au Sénégal (BTS, DUT, licence) accrédité par l'ANAQ-Sup, puis candidater au cycle suivant.");
}
if (e.reprises > 1) {
return bloque("Pas par cette voie", "Campus France Sénégal demande un bac obtenu avec une reprise au plus.", src(S.cfSenegal), "Valider un cycle au Sénégal (BTS, DUT, licence), puis candidater au cycle suivant.");
}
}
if (e.paysDiplome === "GN" && Number.isFinite(e.anneeBac) && e.anneeBac < ctx.annee - 3) {
return bloque("Pas par cette voie", "Campus France Guinée demande un bac de moins de quatre ans.", src(S.cfGuinee), "Valider une formation supérieure, puis candidater au niveau suivant.");
}
if (e.diplome === "terminale") return ok("Vous pouvez postuler", "Vous pouvez déposer votre dossier en terminale : l'admission devient définitive avec le bac.", src(S.noticeDap, S.cfSenegal));
if (e.diplome === "bac2") return ok("Vous pouvez postuler", "Avec un bac + 2, vous visez une deuxième ou une troisième année de licence (licence professionnelle comprise) : chaque université décide de l'année où elle vous prend.", src(S.cfSenegal));
return ok("Vous pouvez postuler", "Votre bac vous ouvre la première année de licence par la procédure Études en France.", src(S.noticeDap));
}
if (niveau === "master") return ok("Vous pouvez postuler", e.diplome === "l3" ? "Vous pouvez candidater pendant votre dernière année de licence." : "Votre licence vous ouvre le master.", src(S.monMaster, S.cfSenegal));
return ok("Vous pouvez postuler", "Le doctorat se demande directement à une école doctorale, avec un directeur de thèse. La procédure Études en France ne sert qu'après son accord, pour le visa.", src(S.doctoratFr));
},

italie(e, niveau) {
if (niveau === "licence") {
const txt = "La règle nationale demande un diplôme de fin d'études secondaires obtenu après au moins douze années de scolarité : c'est le cas des bacs des huit pays que nous avons vérifiés.";
if (e.diplome === "terminale") return ok("Vous pouvez postuler", `${txt} Vous pouvez vous préinscrire en terminale : la demande est acceptée sous réserve du bac.`, src(S.circolare));
return ok("Vous pouvez postuler", txt, src(S.circolare));
}
if (niveau === "master") {
if (e.diplome === "l3") return condition("Selon l'université", "La Laurea Magistrale demande une licence de trois ans. Avant de l'avoir, c'est chaque université qui accepte, ou non, votre candidature.", src(S.circolare));
return ok("Vous pouvez postuler", "Votre licence de trois ans vous ouvre la Laurea Magistrale.", src(S.circolare));
}
return ok("Vous pouvez postuler", "Le doctorat demande un master, et passe par le concours de chaque université.", src(S.circolare));
},

allemagne(e, niveau) {
if (niveau !== "licence") {
return niveau === "master"
? condition("Selon l'université", "Le master demande une licence reconnue en Allemagne, que chaque université vérifie (base anabin). Une licence professionnelle marocaine ne suffit pas.", src(S.daad))
: ok("Vous pouvez postuler", "Le doctorat demande un master et l'accord d'un directeur de thèse.", src(S.daad));
}
const annee = RANG[e.diplome] >= RANG.bac1;
const serie = e.serie;
const direct = (portee) => ok("Accès direct", `Votre bac vous ouvre directement l'université allemande, ${portee}. Pas de Studienkolleg.`, src(S.daad));
const kolleg = (portee) => condition("Avec une année de plus", `Votre bac seul ne suffit pas : il faut d'abord le Studienkolleg, une année de préparation en allemand conclue par un examen (Feststellungsprüfung)${portee ? `, ${portee}` : ""}.${annee ? "" : " Autre voie : réussir d'abord une année d'université dans votre pays, qui ouvre directement la même discipline."}`, src(S.daad));
switch (e.paysDiplome) {
case "SN":
return direct(serie === "litteraire" ? "dans les lettres, les sciences sociales et le droit" : serie === "economique" ? "en économie" : serie === "technique" ? "dans les disciplines techniques et les sciences" : "dans toutes les disciplines sauf les lettres");
case "CI":
case "TG":
return direct(serie === "scientifique" ? "dans toutes les disciplines" : serie === "technique" ? "dans les sciences, la technique et l'économie" : "dans les lettres, le droit, les sciences sociales et l'économie");
case "CM":
if (e.systeme === "anglophone") return condition("Accès direct, sous conditions", "Avec le GCE A-Level, l'accès direct est limité aux disciplines de vos matières, et vos relevés (A-Level et O-Level) doivent remplir les conditions de la base du DAAD.", src(S.daad));
return direct("dans les disciplines de votre série et les disciplines proches");
case "BJ":
if (serie === "scientifique") return condition("Selon la discipline", "Votre bac ouvre directement les disciplines de votre série (mathématiques, physique, biologie…). Pour une autre discipline, il faut d'abord le Studienkolleg, une année de préparation en allemand.", src(S.daad));
if (annee) return direct("dans la discipline déjà étudiée ou une discipline proche");
return kolleg("orienté vers les lettres, le droit et les sciences sociales");
case "MA":
case "GN":
case "BF":
if (annee) return direct("dans la discipline déjà étudiée ou une discipline proche");
return kolleg("dans les disciplines de votre série");
default:
return null;
}
},

canada(e, niveau, ctx) {
const quebec = ctx.variante === "quebec";
if (niveau === "licence") {
if (e.paysDiplome === "MA" && quebec && RANG[e.diplome] < RANG.bac1) {
return condition("Avec une année de plus", "Au Québec, il faut treize années de scolarité : le bac marocain en compte douze. Il faut donc d'abord réussir une année d'université au Maroc, ou faire une année préparatoire au Québec (trente crédits à Laval).", src(S.lavalMaroc, S.uqamPays));
}
if (quebec) return ok("Vous pouvez postuler", "Au Québec, votre bac (treize années de scolarité) ouvre directement le baccalauréat, la licence québécoise. Chaque université fixe ensuite sa moyenne.", src(S.laval, S.udemSenegal, S.uqamPays));
return ok("Vous pouvez postuler", `Hors Québec, chaque université fixe ses règles : le bac${e.paysDiplome === "MA" ? " marocain" : ""} y donne en général l'accès direct, avec une moyenne minimale (à Ottawa, 13 sur 20${e.paysDiplome === "MA" ? ", mais 16 sur 20 pour le Maroc" : ""}). Vous pouvez candidater en terminale.`, src(S.ircc, S.uottawa));
}
if (niveau === "master") return condition("Selon l'université", "Une licence de trois ans suffit à Laval, à Montréal et à Ottawa ; Toronto demande quatre années d'études. Vérifiez la règle de chaque université visée.", src(S.laval, S.uottawaCycles));
return ok("Vous pouvez postuler", "Le doctorat demande un master, selon chaque université.", src(S.laval, S.uottawaCycles));
},

roumanie(e, niveau) {
if (niveau === "licence") {
if (e.diplome === "terminale") return condition("Dès les résultats du bac", "La candidature demande au moins l'attestation de réussite du bac : vous déposerez dès vos résultats.", src(S.roumanie));
if (e.paysDiplome === "CM" && e.systeme === "anglophone") return ok("Vous pouvez postuler", "Avec le GCE, il faut fournir à la fois le GCE O-Level et le GCE A-Level.", src(S.roumanie));
return ok("Vous pouvez postuler", "Votre bac figure sur la liste du ministère roumain des diplômes qui ouvrent la licence. Le ministère délivre ensuite la lettre d'acceptation aux études.", src(S.roumanie));
}
if (niveau === "master") return e.diplome === "l3" ? condition("Après la licence", "Il faut la licence, ou au moins l'attestation de réussite de l'année : vous déposerez dès vos résultats.", src(S.roumanie)) : ok("Vous pouvez postuler", "Votre licence vous ouvre le master.", src(S.roumanie));
return condition("Avec l'accord d'un directeur", "Le doctorat demande un master et l'accord de principe d'un directeur de thèse, joint au dossier.", src(S.roumanie));
},

turquie(e, niveau) {
if (niveau === "licence") return ok("Vous pouvez postuler", `Les universités turques acceptent les candidats${e.diplome === "terminale" ? " dès la terminale" : " titulaires du bac"}. Chacune choisit sa voie d'admission : l'examen TR-YÖS (passable en français), le SAT ou vos notes du bac.`, src(S.yok));
if (niveau === "master") return ok("Vous pouvez postuler", "Le master demande une licence ; chaque université fixe ses conditions pour les étrangers.", src(S.yokCycles));
return ok("Vous pouvez postuler", "Le doctorat demande un master avec mémoire ; chaque université fixe ses conditions pour les étrangers.", src(S.yokCycles));
},

maroc(e, niveau, ctx) {
if (e.paysDiplome === "MA") return ok("Vous pouvez postuler", "Avec un bac marocain, vous suivez les mêmes conditions d'accès que les bacheliers marocains, sans la procédure des étudiants étrangers.", src(S.amci));
if (niveau === "licence") {
const conditions = [];
if (Number.isFinite(e.anneeBac) && e.anneeBac < ctx.annee - 1) conditions.push("un bac récent (celui de l'année, parfois de l'année précédente)");
if (e.mention === "passable") conditions.push("une mention (assez bien au moins, bien dans certaines écoles)");
if (Number.isFinite(e.anneeNaissance) && ctx.annee - e.anneeNaissance > 23) conditions.push("un âge maximal de 20 à 23 ans au 31 décembre, selon l'établissement");
if (conditions.length) return condition("Admission directe seulement", `Les universités publiques passent par l'AMCI, qui demande ${conditions.join(", ")} : ce n'est pas votre cas. Restent les universités à admission directe (UM6P, Al Akhawayn), sur dossier, test et entretien.`, src(S.amci, S.aui));
return ok("Vous pouvez postuler", "Votre profil répond aux critères de l'AMCI : bac récent, mention, âge. Votre dossier part par les autorités de votre pays.", src(S.amci));
}
return ok("Vous pouvez postuler", niveau === "master" ? "Le master demande une licence, avec l'avis favorable de l'établissement." : "Le doctorat demande un master, avec l'avis favorable de l'établissement.", src(S.amci));
},

chine(e, niveau) {
if (niveau === "licence") {
const base = "Il faut la fin des études secondaires ; chaque université fixe ses conditions (âge, notes, et parfois le test CSCA depuis 2026).";
return e.diplome === "terminale"
? ok("Vous pouvez postuler", `${base} Les grandes universités acceptent un certificat de scolarité de terminale ; le diplôme se fournit avant l'inscription.`, src(S.moeChine, S.sysu, S.zju))
: ok("Vous pouvez postuler", base, src(S.moeChine, S.sysu, S.zju));
}
if (niveau === "master") return ok("Vous pouvez postuler", "Le master demande une licence ; chaque université fixe ses conditions, dont l'âge.", src(S.moeChine));
return ok("Vous pouvez postuler", "Le doctorat demande en général un master ; chaque université fixe ses conditions, dont l'âge.", src(S.moeChine));
},

malaisie(e, niveau) {
if (niveau === "licence") {
if (e.paysDiplome === "CI" || e.paysDiplome === "BF") {
return inconnu("Équivalence à demander", `Le bac ${e.paysDiplome === "CI" ? "ivoirien" : "burkinabè"} ne figure pas sur la liste nationale malaisienne (MQA). Il faut d'abord une demande d'équivalence à la MQA, faite par l'université ou par vous : son résultat n'est pas publié à l'avance.`, src(S.mqa));
}
if (e.paysDiplome === "CM" && e.systeme === "anglophone") return ok("Vous pouvez postuler", "Le GCE A-Level ouvre directement la licence (Degree). Le GCE O-Level seul mène d'abord à une Foundation.", src(S.mqa));
return ok("Vous pouvez postuler", "Votre bac figure sur la liste nationale malaisienne (MQA) : il ouvre directement la licence (Degree), sans Foundation. Chaque université ajoute ses notes minimales.", src(S.mqa));
}
if (niveau === "master") return ok("Vous pouvez postuler", "Le master demande une licence avec des résultats suffisants (la règle nationale fixe un minimum, que chaque université applique).", src(S.mqaCycles));
return ok("Vous pouvez postuler", "Le doctorat demande un master.", src(S.mqaCycles));
}

};

/** Le diplôme d'entrée de chaque niveau, et ce qui est déjà « en cours » acceptable. */
const ENTREE = {
licence: { min: "bac", enCours: "terminale" },
master: { min: "licence", enCours: "l3" },
doctorat: { min: "master", enCours: "m2" }
};

/**
* Le voyant « niveau d'études ».
* @param {string} id - la destination
* @param {Object} e - entrées normalisées (voir normaliserEntrees)
* @param {Object} ctx - { aujourdhui, variante }
*/
export function voyantNiveau(id, e, ctx = {}) {

const titre = "Votre niveau d'études";
const dest = nomDe(id) ? { nom: nomDe(id) } : null;
const niveau = e.niveauVise;

if (!niveau) return { ...inconnu("Niveau visé à préciser", "Dites-nous quel niveau vous visez : licence, master ou doctorat."), voyant: titre };
if (!e.diplome) return { ...inconnu("Diplôme à préciser", "Dites-nous votre diplôme le plus élevé, obtenu ou en cours."), voyant: titre };

// La nationalité du pays visé : on n'y est pas étudiant étranger.
if (e.nationalite && dest && e.nationalite === dest.nom) {
return { ...bloque("Procédure différente", `Vous avez la nationalité de ce pays : ${auPays(dest.nom)}, vous n'êtes pas étudiant étranger, et la procédure que nous accompagnons ne vous concerne pas.`, [], "Suivre la procédure des étudiants nationaux de ce pays."), horsProcedure: true, voyant: titre };
}

const entree = ENTREE[niveau];
const rang = RANG[e.diplome];
if (rang < RANG[entree.enCours]) return { ...manqueDiplome(niveau, id), voyant: titre };
if (rang === RANG[entree.enCours]) {
// En cours : la plupart des pays acceptent une candidature avant le diplôme.
// La destination dit la suite ; sans règle, on le dit.
}

if (e.paysDiplome === "autre" || !e.paysDiplome) {
return { ...inconnu("Pas encore vérifié pour votre pays", `Nous avons vérifié les règles pour les diplômes de huit pays (Sénégal, Côte d'Ivoire, Cameroun, Maroc, Bénin, Guinée, Togo, Burkina Faso). Pour un diplôme d'un autre pays, vérifiez sur les pages officielles ${auPays(dest ? dest.nom : "")} ce que vaut le vôtre avant de payer quoi que ce soit.`), voyant: titre };
}

const regle = NIVEAU[id];
const v = regle ? regle(e, niveau, ctx) : null;
if (!v) return { ...inconnu("Règle non publiée", "Aucune règle officielle n'a été trouvée pour ce cas."), voyant: titre };
return { ...v, voyant: titre };

}

// ------------------------------------------------------------
// LA LANGUE
// ------------------------------------------------------------

/** Les langues d'enseignement proposées par destination. */
export const LANGUES_COURS = {
france: ["français"],
italie: ["italien", "anglais"],
allemagne: ["allemand", "anglais"],
canada: ["français", "anglais"],
roumanie: ["roumain", "français", "anglais"],
turquie: ["turc", "anglais"],
maroc: ["français", "anglais"],
chine: ["chinois", "anglais"],
malaisie: ["anglais"]
};

const FRANCOPHONES = ["SN", "CI", "BJ", "GN", "TG"];

/** « d'anglais », « de chinois ». */
function deLangue(langue) {
return /^[aeiouyéè]/i.test(langue) ? `d'${langue}` : `de ${langue}`;
}

/**
* Le voyant « langue ».
* @param {string} id
* @param {Object} e - { langueCours, statutLangue, paysDiplome, systeme, niveauVise }
*/
export function voyantLangue(id, e) {

const titre = "La langue des cours";
const langue = e.langueCours || (LANGUES_COURS[id] || [])[0] || "";
const statut = e.statutLangue || "";
const aLeTest = statut === "test";
const r = (v) => ({ ...v, voyant: titre, langue });

if (!statut) return r(inconnu("À préciser", `Dites-nous où vous en êtes en ${langue}.`));

// Le français, pour un bachelier d'Afrique francophone.
if (langue === "français") {
const francophone = FRANCOPHONES.includes(e.paysDiplome) || (e.paysDiplome === "CM" && e.systeme !== "anglophone");
if (id === "france") {
if (aLeTest) return r(ok("C'est bon", "Votre certificat de français répond à la demande.", src(S.noticeDap)));
if (francophone) return r(ok("Dispensé du test", "Vous êtes dispensé du test de français de la procédure : le français est la langue officielle de votre pays ou de vos études secondaires. Certaines universités demandent quand même le niveau B2.", src(S.noticeDap, S.cfSenegal)));
if (e.paysDiplome === "BF") return r(condition("À confirmer", "Depuis 2023, le français n'est plus langue officielle au Burkina Faso. Vos études secondaires en français devraient vous dispenser du test, mais aucune règle de Campus France Burkina ne le confirme : demandez-le avant de déposer.", src(S.noticeDap)));
if (e.paysDiplome === "MA") return r(condition("Test obligatoire", "Au Maroc, une certification de français (TCF, DELF B2 ou DALF) est obligatoire pour déposer.", src(S.cfMaroc)));
if (e.paysDiplome === "CM") return r(condition("Test obligatoire", "Avec le GCE A-Level, le test de français TCF-DAP est obligatoire.", src(S.cfCameroun)));
return r(condition("Test à prévoir", "Un test de français (TCF DAP ou DELF B2) vous sera demandé.", src(S.noticeDap)));
}
if (id === "canada") {
if (aLeTest || francophone) return r(ok("C'est bon", "Les universités francophones du Québec dispensent en général les bacheliers du Sénégal, de Côte d'Ivoire, du Bénin, de Guinée, du Togo et du Burkina Faso. Chacune fixe sa règle.", src(S.uqamFrancais)));
return r(condition("Test à prévoir", "Un test de français (TCF ou TEF) vous sera probablement demandé : chaque université fixe son niveau.", src(S.uqamFrancais)));
}
if (id === "maroc") return r(ok("C'est bon", "Dans les universités publiques, les cours sont en français, sans test demandé.", src(S.amci)));
if (id === "roumanie") return r(francophone || aLeTest ? ok("C'est bon", "Pour un programme en français, chaque université fixe sa règle ; la plupart dispensent les candidats d'un pays où le français est langue officielle.", src(S.roumanie)) : condition("Selon l'université", "Pour un programme en français, chaque université fixe sa règle : un certificat peut vous être demandé.", src(S.roumanie)));
}

if (aLeTest) return r(ok("C'est bon", `Votre certificat ${deLangue(langue)} vous servira : vérifiez qu'il atteint le niveau demandé par chaque université.`));

switch (`${id}:${langue}`) {
case "italie:italien": return r(condition("Italien B2 obligatoire", "Pour un cours en italien, il faut le niveau B2 : une certification reconnue, ou l'examen organisé par l'université.", src(S.circolare)));
case "allemagne:allemand": return r(condition("Allemand C1", "Pour un cours en allemand, il faut le DSH 2 ou le TestDaF (4 dans chaque épreuve). Le Studienkolleg, s'il vous est demandé, exige déjà l'allemand B1 à B2 pour y entrer.", src(S.kmkDeutsch)));
case "roumanie:roumain": return r(condition("Une année de roumain", "Pour un programme en roumain, il faut d'abord une année préparatoire de langue roumaine, sauf certificat de roumain B1.", src(S.roumanie)));
case "turquie:turc": return r(condition("Une année de turc", "Chaque université évalue votre turc ; s'il ne suffit pas, vous faites d'abord une année préparatoire (deux au plus).", src(S.yok)));
case "turquie:anglais": return r(condition("Test d'anglais", "Pour un programme en anglais, il faut un test reconnu (IELTS, TOEFL…), sinon une année préparatoire. Avoir étudié en anglais ne dispense que si vos trois dernières années de lycée se sont faites dans un pays anglophone.", src(S.yokLangue)));
case "chine:chinois": return r(condition("HSK 4 ou 5", "Pour un programme en chinois, les universités demandent le HSK 4 ou 5 : souvent une année de chinois avant.", src(S.moeChine)));
default: return r(condition(`Test ${deLangue(langue)}`, langue === "anglais" ? "Pour un programme en anglais, un test (IELTS, TOEFL…) vous sera demandé ; chaque université fixe son score (souvent IELTS 6 à 6,5)." : `Un test ${deLangue(langue)} vous sera demandé ; chaque université fixe son niveau.`, id === "canada" ? src(S.utorontoAnglais) : []));
}

}

// ------------------------------------------------------------
// LE CALENDRIER
// ------------------------------------------------------------

/**
* Le voyant « calendrier ». La France a des jalons datés (Campus France
* Sénégal) : on dit si l'on est à temps. Ailleurs, le calendrier publié
* est donné tel quel (« info ») : aucune date limite nationale.
*/
export function voyantCalendrier(id, calendrier, aujourdhui = new Date()) {
const titre = "Le calendrier";
if (id === "france") {
const fin = finDeCampagne(aujourdhui);
const R = fin.getUTCFullYear();
const ouverture = new Date(Date.UTC(R - 1, CAMPAGNE_FRANCE.ouverture.mois - 1, CAMPAGNE_FRANCE.ouverture.jour));
const s = CAMPAGNE_FRANCE.jalons.soumission;
const cloture = new Date(Date.UTC(R - 1, s.mois - 1, s.jour, 23, 59, 59));
const sources = src(S.cfCalendrier);
if (aujourdhui < ouverture) return { ...ok("À temps", `La campagne pour la rentrée ${R} ouvre le 1er octobre ${R - 1} : le dépôt va jusqu'au 15 décembre.`, sources), voyant: titre };
if (aujourdhui <= cloture) return { ...ok("À temps", `La campagne pour la rentrée ${R} est ouverte : déposez avant le 15 décembre ${R - 1}.`, sources), voyant: titre };
return { ...condition("Rentrée suivante", `Le dépôt pour la rentrée ${R} est clos depuis le 15 décembre (formations non connectées : du 1er avril au 15 juillet). La prochaine campagne, pour la rentrée ${R + 1}, ouvre le 1er octobre ${R}.`, sources), voyant: titre };
}
if (!calendrier) return { etat: "info", titre: "Pas encore publié", texte: "Aucun calendrier officiel n'est encore publié pour la prochaine rentrée.", sources: [], voyant: titre };
return { etat: "info", titre: "Les dates publiées", texte: calendrier.texte, sources: calendrier.source ? [{ url: calendrier.source, verifieLe: calendrier.verifieLe }] : [], voyant: titre };
}

// ------------------------------------------------------------
// L'ARGENT — repris du diagnostic chiffré
// ------------------------------------------------------------

/** etat du verdict chiffré → voyant. */
export function voyantArgent(verdict) {
const titre = "Vos ressources";
if (!verdict) return { etat: "info", titre: "À calculer", texte: "Indiquez vos ressources pour les comparer au seuil publié.", sources: [], voyant: titre };
const sources = verdict.source ? [{ url: verdict.source, verifieLe: verdict.verifieLe }] : [];
if (verdict.etat === "atteint") return { etat: "ok", titre: "Seuil atteint", texte: verdict.phrase, sources, voyant: titre };
if (verdict.etat === "manque") return { etat: "condition", titre: "Il vous manque de l'argent", texte: verdict.phrase, sources, voyant: titre };
return { etat: "info", titre: verdict.etat === "sans-seuil" ? "Aucun seuil publié" : "À comparer", texte: verdict.phrase, sources, voyant: titre };
}

// ------------------------------------------------------------
// LA PHRASE FINALE
// ------------------------------------------------------------

/**
* @param {Array} voyants - les quatre voyants
* @param {string} nomPays
* @returns {{etat:"lancer"|"lancer-si"|"pas-encore", phrase:string, conditions:string[], deblocages:string[]}}
*/
function minuscule(t) {
const x = String(t || "");
return x.charAt(0).toLowerCase() + x.slice(1);
}

export function verdictGlobal(voyants, nomPays) {
const dans = auPays(nomPays);
const bloquants = voyants.filter((v) => v && v.etat === "bloque");
const conditions = voyants.filter((v) => v && v.etat === "condition");
if (bloquants.length) {
return {
etat: "pas-encore",
phrase: bloquants.some((v) => v.horsProcedure)
? bloquants.find((v) => v.horsProcedure).texte
: `Pas encore ${dans} : ${bloquants.map((v) => minuscule(v.voyant)).join(" et ")} ne ${bloquants.length > 1 ? "permettent" : "permet"} pas encore de postuler. Le détail, et ce qui vous débloque, est juste en dessous.`,
conditions: conditions.map((v) => `${v.voyant} : ${v.titre}`),
deblocages: bloquants.map((v) => v.deblocage).filter(Boolean)
};
}
if (conditions.length) {
return {
etat: "lancer-si",
phrase: `Vous pouvez vous lancer ${dans}, avec ${conditions.length > 1 ? `${conditions.length} points` : "un point"} à régler avant de déposer : ${conditions.map((v) => minuscule(v.titre)).join(" ; ")}.`,
conditions: conditions.map((v) => `${v.voyant} : ${v.titre}`),
deblocages: []
};
}
return {
etat: "lancer",
phrase: `Vous pouvez vous lancer ${dans} : votre niveau d'études, la langue et vos ressources répondent aux règles publiées. Cela vous donne le droit de postuler ; l'admission, elle, reste la décision de chaque université.`,
conditions: [],
deblocages: []
};
}

// ------------------------------------------------------------
// Les entrées
// ------------------------------------------------------------

/**
* Normalise les réponses (formulaire ou profil) en entrées du moteur.
* Les clés du profil : diplomeActuel, paysDiplome, serieBac, systemeBac,
* anneeBac, mentionBac, reprisesBac, anneeNaissance, desiredDegree,
* nationality, et par pays langueCours_<id>, statutLangue_<id>.
*/
export function normaliserEntrees(id, brut = {}) {
const nombre = (v) => { const n = Number(v); return Number.isFinite(n) && String(v).trim() !== "" ? n : NaN; };
const pays = findCountry(brut.nationality);
return {
diplome: RANG[brut.diplomeActuel] !== undefined ? brut.diplomeActuel : "",
paysDiplome: PAYS_DIPLOME.some((p) => p.id === brut.paysDiplome) ? brut.paysDiplome : "",
serie: SERIES.some((s) => s.id === brut.serieBac) ? brut.serieBac : "",
systeme: brut.systemeBac === "anglophone" ? "anglophone" : "francophone",
anneeBac: nombre(brut.anneeBac),
mention: MENTIONS.some((m) => m.id === brut.mentionBac) ? brut.mentionBac : "",
reprises: nombre(brut.reprisesBac),
anneeNaissance: nombre(brut.anneeNaissance),
niveauVise: niveauVise(brut.desiredDegree),
nationalite: pays ? pays.name : "",
langueCours: (LANGUES_COURS[id] || []).includes(brut[`langueCours_${id}`]) ? brut[`langueCours_${id}`] : (LANGUES_COURS[id] || [])[0] || "",
statutLangue: STATUTS_LANGUE.some((s) => s.id === brut[`statutLangue_${id}`]) ? brut[`statutLangue_${id}`] : ""
};
}

/**
* LE DIAGNOSTIC « PUIS-JE ME LANCER ? » complet.
* @param {string} id - destination
* @param {Object} brut - réponses (profil + formulaire)
* @param {Object} opts - { verdictArgent, calendrier, variante, aujourdhui }
*/
export function puisJeMeLancer(id, brut, opts = {}) {
const aujourdhui = opts.aujourdhui instanceof Date ? opts.aujourdhui : new Date();
const e = normaliserEntrees(id, brut);
const ctx = { aujourdhui, annee: aujourdhui.getUTCFullYear(), rentree: finDeCampagne(aujourdhui).getUTCFullYear(), variante: opts.variante || "" };
const nom = nomDe(id);
const voyants = [
voyantNiveau(id, e, ctx),
voyantLangue(id, e),
voyantArgent(opts.verdictArgent || null),
voyantCalendrier(id, opts.calendrier || null, aujourdhui)
];
return { destination: id, entrees: e, voyants, verdict: verdictGlobal(voyants, nom), paysDiplome: nomPaysDiplome(e.paysDiplome) };
}
