// ============================================================
// FitzUniverse — Éligibilité par nationalité, Lot 20 (2026-08-30)
//
// Renseigne le champ `eligibility` sur les bourses du catalogue. Ne crée
// AUCUN document, ne supprime rien : ajoute un seul champ en setDoc merge.
//
// POURQUOI CE LOT
// Jusqu'ici aucune bourse ne portait de restriction de nationalité. Un
// étudiant sénégalais voyait — et pouvait se voir RECOMMANDER — les
// bourses Commonwealth et GREAT du Royaume-Uni, auxquelles il ne peut pas
// candidater, le Sénégal n'étant pas membre du Commonwealth. Le lot 19 a
// aggravé le problème en ajoutant cinq de ces programmes.
//
// FORME DU CHAMP (voir js/eligibility-countries.js pour la sémantique)
//   { scope, groups[], include[], exclude[], note }
// Trois cas, et un seul principe : ON NE DIT JAMAIS « NON » À TORT.
//   - scope:"monde"        → ouverte à toutes les nationalités.
//   - groups / include     → restriction explicite ; tout pays absent est
//                            exclu, donc à ne poser que sur une liste
//                            officielle vérifiée.
//   - note SEULE, sans scope ni groups → l'information s'affiche mais
//                            n'exclut personne. C'est le cas retenu quand
//                            la liste officielle est trop longue ou trop
//                            mouvante pour être codée sans risque
//                            (Chevening, MEXT, GKS…).
//
// Les bourses dont l'éligibilité n'a PAS pu être vérifiée à la source ne
// reçoivent rien du tout : un champ absent vaut « non renseigné » et
// n'exclut personne. Elles sont listées en fin de fichier.
//
// Les bourses sont résolues EN DIRECT par leur identifiant, re-vérifié
// par comparaison de titre avant toute écriture — même patron que les
// lots 8, 18 et 19.
// ============================================================

import { db } from "../firebase-config.js";

import {
collection,
getDocs,
getDoc,
doc,
setDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

function normalize(str) {
return String(str || "")
.replace(/ı/g, "i")
.replace(/İ/g, "i")
.normalize("NFD")
.replace(/[̀-ͯ]/g, "")
.toLowerCase()
.trim();
}

// Les 18 pays de la circonscription Rhodes Afrique de l'Ouest
// (rhodeshouse.ox.ac.uk, vérifié le 30/08/2026). SH = Sainte-Hélène,
// Ascension et Tristan da Cunha.
const RHODES_AFRIQUE_OUEST = [
"BJ","BF","CV","CI","GM","GH","GN","GW","LR","ML","MR","NE","NG","SN","SL","ST","TG","SH"
];

const FIXES = [

// ---------------- ROYAUME-UNI ----------------
{
id: "commonwealth-masters-scholarships",
expectTitle: "commonwealth master",
eligibility: {
scope: "groupes",
groups: ["commonwealth"],
note: "Réservée aux pays du Commonwealth à revenu faible ou intermédiaire. Le Sénégal n'est PAS membre du Commonwealth. En Afrique de l'Ouest, seuls la Gambie, le Ghana, le Nigeria, la Sierra Leone et le Togo sont éligibles."
}
},
{
id: "commonwealth-phd-scholarships",
expectTitle: "commonwealth phd",
eligibility: {
scope: "groupes",
groups: ["commonwealth"],
exclude: ["GH"],
note: "Liste bien plus étroite que celle du master : 17 pays seulement, les moins avancés et les « petits États vulnérables » du Commonwealth. En Afrique de l'Ouest : Gambie, Nigeria, Sierra Leone, Togo. Ni le Sénégal ni le Ghana ne sont éligibles."
}
},
{
id: "commonwealth-shared-scholarships",
expectTitle: "commonwealth shared",
eligibility: {
scope: "groupes",
groups: ["commonwealth"],
note: "43 pays en développement du Commonwealth. Le Sénégal n'est pas membre ; en Afrique de l'Ouest, le Ghana et le Nigeria le sont."
}
},
{
id: "great-scholarships",
expectTitle: "great scholarships",
eligibility: {
scope: "liste",
include: ["NG","GH","EG"],
note: "18 pays éligibles au total, et la liste varie d'une université à l'autre. En Afrique, seuls le Nigeria, le Ghana et l'Égypte — le Sénégal n'est pas éligible."
}
},
{
id: "clarendon-fund-scholarships",
expectTitle: "clarendon",
eligibility: { scope: "monde", note: "Aucune restriction de nationalité, de résidence ni de discipline." }
},
{
id: "weidenfeld-hoffmann-scholarships",
expectTitle: "weidenfeld",
eligibility: {
scope: "groupes",
groups: ["cad-apd"],
note: "Pays en développement et en transition. Le Sénégal est explicitement éligible, de même que le Ghana, la Côte d'Ivoire, la Guinée, le Mali, le Nigeria et la Sierra Leone."
}
},
{
id: "reach-oxford-scholarship",
expectTitle: "reach oxford",
eligibility: {
scope: "groupes",
groups: ["cad-apd"],
note: "Réservée aux pays de la liste CAD de l'OCDE, Sénégal inclus."
}
},
{
id: "rhodes-scholarships-west-africa",
expectTitle: "rhodes",
eligibility: {
scope: "liste",
include: RHODES_AFRIQUE_OUEST,
note: "Circonscription dédiée à 18 pays d'Afrique de l'Ouest, Sénégal compris. Exige aussi la résidence dans un de ces pays pendant au moins 5 des 10 dernières années."
}
},
{
id: "imperial-presidents-phd-scholarships",
expectTitle: "imperial college london president",
eligibility: { scope: "monde", note: "Aucune restriction de nationalité." }
},
{
id: "mastercard-foundation-edinburgh",
expectTitle: "mastercard foundation scholars program (university of edinburgh)",
eligibility: {
scope: "groupes",
groups: ["afrique"],
note: "Réservée aux citoyens et résidents d'un pays africain, Afrique du Nord comprise, ou aux personnes ayant le statut de réfugié dans un pays africain."
}
},
{
id: "mastercard-foundation-afox-oxford",
expectTitle: "mastercard foundation scholars program at the university of oxford",
eligibility: {
scope: "groupes",
groups: ["afrique"],
note: "Réservée aux citoyens d'un pays africain y résidant habituellement."
}
},

// ---------------- ALLEMAGNE ----------------
{
id: "daad-epos",
expectTitle: "daad development-related",
eligibility: {
scope: "groupes",
groups: ["cad-apd"],
note: "Réservée aux pays en développement de la liste CAD référencée par le DAAD."
}
},
{
id: "daad-helmut-schmidt-programme",
expectTitle: "helmut-schmidt",
eligibility: {
scope: "groupes",
groups: ["cad-apd"],
note: "L'Afrique est explicitement couverte, mais la liste officielle des pays n'a pas pu être vérifiée à la source — faire confirmer l'éligibilité du Sénégal auprès du programme."
}
},
{
id: "deutschlandstipendium",
expectTitle: "deutschlandstipendium",
eligibility: { scope: "monde", note: "Ouverte à toutes les nationalités, y compris non-européennes." }
},
{
id: "heinrich-boell-stiftung",
expectTitle: "heinrich-boll-stiftung",
eligibility: {
scope: "groupes",
groups: ["cad-apd"],
note: "Priorité explicite aux candidats de pays de la liste CAD qui ne résident pas encore en Allemagne."
}
},
{
id: "konrad-adenauer-stiftung",
expectTitle: "konrad-adenauer",
eligibility: {
note: "Plus de 50 pays couverts, mais la procédure régionale africaine ne concerne que le Kenya, l'Ouganda, le Soudan du Sud, la Tanzanie et l'Éthiopie. Un candidat ouest-africain doit passer par la procédure nationale, donc être déjà inscrit en Allemagne."
}
},
{
id: "friedrich-ebert-stiftung",
expectTitle: "friedrich-ebert",
eligibility: {
scope: "groupes",
groups: ["cad-apd"],
note: "Cible les pays du Sud global ; les pays de l'OCDE en sont exclus. Exige d'être déjà inscrit dans une université allemande."
}
},
{
id: "rosa-luxemburg-stiftung",
expectTitle: "rosa-luxemburg",
eligibility: {
scope: "monde",
note: "Ouverte à toutes les nationalités, mais exige d'être déjà inscrit dans une université allemande et de justifier d'un allemand B2."
}
},
{
id: "uni-hamburg-leistungsstipendien",
expectTitle: "leistungsstipendien",
eligibility: { scope: "monde", note: "Réservée aux étudiants sans nationalité allemande et non éligibles au BAföG." }
},

// ---------------- JAPON ----------------
{
id: "abe-initiative-jica",
expectTitle: "abe initiative",
eligibility: {
scope: "groupes",
groups: ["afrique"],
note: "Réservée aux ressortissants des 54 pays africains, Sénégal inclus. Dépôt par le bureau JICA du pays de résidence."
}
},
{
id: "jj-wbgsp",
expectTitle: "joint japan/world bank",
eligibility: {
scope: "groupes",
groups: ["cad-apd"],
note: "Réservée aux ressortissants des pays membres en développement de la Banque mondiale, Sénégal inclus. Exclut les binationaux d'un pays développé."
}
},
{
id: "jads-japan-africa-dream",
expectTitle: "japan africa dream",
eligibility: {
scope: "groupes",
groups: ["afrique"],
note: "Réservée aux ressortissants des pays membres régionaux de la Banque africaine de développement, Sénégal inclus."
}
},
{
id: "honjo-international-scholarship",
expectTitle: "honjo",
eligibility: { scope: "monde", note: "Toutes nationalités et tous domaines de recherche." }
},
{
id: "rotary-yoneyama-overseas",
expectTitle: "rotary yoneyama",
eligibility: { scope: "monde", note: "Toutes nationalités, mais un JLPT N3 est exigé dès la candidature." }
},
{
id: "jasso-monbukagakusho-honors",
expectTitle: "monbukagakusho honors",
eligibility: { scope: "monde", note: "Toutes nationalités, mais réservée aux étudiants DÉJÀ inscrits au Japon." }
},
{
id: "utokyo-fellowship",
expectTitle: "university of tokyo fellowship",
eligibility: { scope: "monde", note: "Aucune restriction de nationalité sur le dispositif principal." }
},
{
id: "waseda-partial-tuition-waiver",
expectTitle: "waseda university partial",
eligibility: { scope: "monde", note: "Toutes nationalités, mais ne se demande qu'après immatriculation à Waseda." }
},

// ---------------- CORÉE DU SUD ----------------
{
id: "koica-ciat-scholarship",
expectTitle: "koica",
eligibility: {
scope: "groupes",
groups: ["cad-apd"],
note: "96 pays récipiendaires de l'aide publique au développement ; l'inscription du Sénégal sur la liste annuelle reste à confirmer auprès du bureau KOICA. Réservée en outre aux fonctionnaires nommés par leur gouvernement."
}
},
{
id: "ama-plus-scholarship",
expectTitle: "ama+ scholarship",
eligibility: {
scope: "groupes",
groups: ["cad-apd"],
note: "Le candidat ET ses deux parents doivent être ressortissants d'un pays de la liste CAD de l'OCDE. Le Sénégal y figure."
}
},
{
id: "snu-glo-harmony-scholarship",
expectTitle: "glo-harmony",
eligibility: {
scope: "groupes",
groups: ["cad-apd"],
note: "Réservée aux ressortissants d'un pays de la liste CAD de l'OCDE, Sénégal inclus."
}
},
{
id: "snu-global-scholarship",
expectTitle: "snu global scholarship",
eligibility: { scope: "monde", note: "Ouverte à tous les étudiants internationaux admis en cycle supérieur à la SNU." }
},
{
id: "ku-global-leader-scholarship",
expectTitle: "ku global leader",
eligibility: { scope: "monde", note: "Ouverte à toutes les nationalités, attribuée automatiquement à l'admission." }
},
{
id: "kaist-scholarship",
expectTitle: "kaist scholarship",
eligibility: { scope: "monde", note: "Ouverte à toutes les nationalités." }
},
{
id: "postech-gift-scholarship",
expectTitle: "postech",
eligibility: { scope: "monde", note: "Le candidat ET ses parents doivent être de nationalité étrangère." }
},

// ---------------- TURQUIE ----------------
{
id: "turkiye-burslari-success",
expectTitle: "basari bursu",
eligibility: { note: "Ouverte à toutes les nationalités, mais réservée aux étudiants déjà inscrits dans une université turque à leurs propres frais." }
},
{
id: "turkiye-burslari-research",
expectTitle: "arastirma bursu",
eligibility: { scope: "monde", note: "Ouverte à toutes les nationalités ; moins de 50 ans." }
},
{
id: "ytb-isdb-joint-scholarship",
expectTitle: "banque islamique de developpement",
eligibility: {
scope: "groupes",
groups: ["bid"],
note: "Réservée aux 57 États membres de la Banque islamique de développement. Le Sénégal en fait partie. Attention : le Cap-Vert, le Ghana et le Liberia n'en sont PAS membres."
}
},
{
id: "diyanet-tdv-international",
expectTitle: "fondation diyanet",
eligibility: { note: "Aucune restriction de nationalité publiée, mais exclut toute personne étant ou ayant été citoyenne turque, et toute personne étudiant déjà en Turquie." }
},
{
id: "tubitak-2216-research-fellowship",
expectTitle: "tubitak 2216",
eligibility: { scope: "monde", note: "Toutes nationalités étrangères ; une lettre d'invitation d'un établissement turc est le vrai prérequis." }
},
{
id: "koc-university-merit-scholarships",
expectTitle: "university merit scholarships",
eligibility: { scope: "monde", note: "Ouverte à toutes les nationalités, attribuée automatiquement à l'admission." }
},
{
id: "sabanci-graduate-scholarships",
expectTitle: "university graduate scholarships",
eligibility: { scope: "monde", note: "Ouverte à toutes les nationalités, décidée par le jury d'admission." }
},
{
id: "bilkent-international-scholarships",
expectTitle: "bilkent",
eligibility: { note: "Ouverte à toutes les nationalités, à condition de ne pas avoir et de n'avoir jamais eu la nationalité turque." }
}

];

// Bourses EXISTANTES (créées avant le lot 19), résolues par TITRE parce
// que leur identifiant vient d'imports plus anciens. Elles reçoivent une
// note seule : leurs listes officielles sont trop longues ou trop
// mouvantes pour être codées sans risque de dire « non » à tort.
const FIXES_PAR_TITRE = [
{
label: "Chevening Scholarships",
exact: "chevening scholarships",
match: (t) => normalize(t).includes("chevening"),
eligibility: { note: "Environ 160 pays éligibles, dont le Sénégal et la plupart des pays d'Afrique. La liste complète est publiée sur chevening.org." }
},
{
label: "Global Korea Scholarship",
exact: "global korea scholarship",
match: (t) => normalize(t).includes("global korea"),
eligibility: { note: "Quotas attribués PAR PAYS et renégociés chaque année ; l'ambassade de Corée au Sénégal publie les appels, mais le nombre de places sénégalaises n'est pas rendu public." }
},
{
label: "MEXT Scholarship",
exact: "mext scholarship",
match: (t) => normalize(t).includes("mext"),
eligibility: { note: "Ouverte aux ressortissants des pays entretenant des relations diplomatiques avec le Japon, Sénégal inclus. Le dépôt se fait à l'ambassade du Japon à Dakar." }
},
{
label: "Türkiye Bursları",
exact: "turkiye burslari",
match: (t) => normalize(t).includes("turkiye burslari"),
eligibility: { note: "Ouverte à toutes les nationalités, sauf les citoyens et anciens citoyens turcs, et sauf toute personne déjà inscrite dans une université turque au même niveau d'études." }
},
{
label: "Chinese Government Scholarship",
exact: "chinese government scholarship",
match: (t) => normalize(t).includes("chinese government scholarship"),
eligibility: { note: "Ouverte aux ressortissants non chinois. Limites d'âge : 25 ans en licence, 35 en master, 40 en doctorat." }
}
];

function log(el, message, cls = "") {
el.classList.add("is-visible");
const line = document.createElement("div");
if (cls) line.className = cls;
line.textContent = message;
el.appendChild(line);
el.scrollTop = el.scrollHeight;
}

let lastPlan = null;

const analyzeBtn = document.getElementById("analyzeBtn");
const analyzeLog = document.getElementById("analyzeLog");
const writeBtn = document.getElementById("writeBtn");
const writeLog = document.getElementById("writeLog");
const verifyBtn = document.getElementById("verifyBtn");
const verifyLog = document.getElementById("verifyLog");

// ==========================================================
// Étape 1 — analyse
// ==========================================================

analyzeBtn.addEventListener("click", async () => {

analyzeBtn.disabled = true;
analyzeLog.innerHTML = "";
lastPlan = null;

try {

let blocking = false;
const plan = [];

log(analyzeLog, `Vérification des ${FIXES.length} bourses adressées par identifiant...`);

for (const f of FIXES) {
const snap = await getDoc(doc(db, "scholarships", f.id));
if (!snap.exists()) {
log(analyzeLog, `ERREUR : "${f.id}" absent de la base — le lot 19 a-t-il bien été exécuté ?`, "err");
blocking = true;
continue;
}
const titre = snap.data().title || "";
if (!normalize(titre).includes(normalize(f.expectTitle))) {
log(analyzeLog, `ERREUR : "${f.id}" existe mais son titre ("${titre}") ne contient pas "${f.expectTitle}" — identifiant probablement réutilisé.`, "err");
blocking = true;
continue;
}
plan.push({ id: f.id, label: titre, eligibility: f.eligibility });
}

log(analyzeLog, `${plan.length}/${FIXES.length} bourses confirmées par comparaison de titre.`, plan.length === FIXES.length ? "ok" : "warn");

log(analyzeLog, "");
log(analyzeLog, `Résolution des ${FIXES_PAR_TITRE.length} bourses adressées par titre...`);

const snapAll = await getDocs(collection(db, "scholarships"));
const toutes = snapAll.docs.map((d) => ({ id: d.id, ...d.data() }));

// L'ÉGALITÉ EXACTE DE TITRE PRIME sur la correspondance partielle.
// Raison, apprise à l'exécution du 2026-08-30 : le lot 19 a créé
// "Türkiye Bursları Başarı Bursu", "Türkiye Bursları Araştırma Bursu"
// et le programme conjoint BID — trois titres qui CONTIENNENT tous
// "Türkiye Bursları". Une simple recherche partielle devenait donc
// ambiguë sur 4 documents et bloquait le lot. Toute fiche adressée par
// titre porte désormais son titre exact ; la correspondance partielle
// ne sert plus que de repli quand aucun titre exact ne ressort.
for (const f of FIXES_PAR_TITRE) {

const matches = toutes.filter((s) => f.match(s.title));
const exacts = f.exact ? matches.filter((s) => normalize(s.title) === normalize(f.exact)) : [];

let retenue = null;

if (exacts.length === 1) {
retenue = exacts[0];
if (matches.length > 1) {
log(analyzeLog, `"${f.label}" : ${matches.length} titres contiennent le motif, départagés par égalité exacte.`, "warn");
}
} else if (exacts.length > 1) {
log(analyzeLog, `ERREUR : ${exacts.length} bourses portent EXACTEMENT le titre "${f.exact}" — doublon en base :`, "err");
exacts.forEach((m) => log(analyzeLog, `  - ${m.id}`, "err"));
blocking = true;
continue;
} else if (matches.length === 1) {
retenue = matches[0];
} else if (matches.length === 0) {
log(analyzeLog, `AVERTISSEMENT : "${f.label}" introuvable — ignorée.`, "warn");
continue;
} else {
log(analyzeLog, `ERREUR : ${matches.length} bourses correspondent à "${f.label}" et aucune ne porte le titre exact attendu ("${f.exact || "non renseigné"}") :`, "err");
matches.forEach((m) => log(analyzeLog, `  - ${m.id} ("${m.title}")`, "err"));
blocking = true;
continue;
}

plan.push({ id: retenue.id, label: retenue.title, eligibility: f.eligibility });
log(analyzeLog, `"${f.label}" résolue : ${retenue.id} ("${retenue.title}").`, "ok");

}

// Combien de bourses resteront sans éligibilité renseignée ?
const couvertes = new Set(plan.map((p) => p.id));
const restantes = toutes.filter((s) => !couvertes.has(s.id));

log(analyzeLog, "");
log(analyzeLog, `${plan.length} bourses recevront un champ eligibility.`);
log(analyzeLog, `${restantes.length} bourses resteront SANS éligibilité renseignée. Ce n'est PAS une erreur : un champ absent n'exclut personne, et il vaut mieux ne rien dire qu'inventer une liste de pays. Liste pour information :`);
restantes.forEach((s) => log(analyzeLog, `  - ${s.id} (${s.country || "pays inconnu"})`));

if (blocking) {
log(analyzeLog, "");
log(analyzeLog, "Anomalie(s) détectée(s) — corriger avant l'étape 2. Aucune écriture n'a eu lieu.", "err");
return;
}

lastPlan = plan;
log(analyzeLog, "");
log(analyzeLog, "Plan prêt. Seul le champ `eligibility` sera écrit, aucun autre champ n'est touché.", "ok");
writeBtn.disabled = false;
writeBtn.textContent = "Écrire";

} catch (err) {
log(analyzeLog, `ERREUR : ${err.message}`, "err");
} finally {
analyzeBtn.disabled = false;
}

});

// ==========================================================
// Étape 2 — écriture
// ==========================================================

writeBtn.addEventListener("click", async () => {

if (!lastPlan) {
log(writeLog, "Lancer l'étape 1 d'abord.", "err");
return;
}

writeBtn.disabled = true;
writeLog.innerHTML = "";

try {

for (const p of lastPlan) {
await setDoc(doc(db, "scholarships", p.id), { eligibility: p.eligibility }, { merge: true });
log(writeLog, `  ${p.id}`, "ok");
}

log(writeLog, "");
log(writeLog, `${lastPlan.length} bourses mises à jour. Lancer l'étape 3.`, "ok");
verifyBtn.disabled = false;
verifyBtn.textContent = "Vérifier";

} catch (err) {
log(writeLog, `ERREUR : ${err.message}`, "err");
} finally {
writeBtn.disabled = false;
}

});

// ==========================================================
// Étape 3 — vérification champ par champ
// ==========================================================

function sameArray(a, b) {
if (!Array.isArray(a) || !Array.isArray(b)) return a === b;
return a.length === b.length && a.every((v, i) => v === b[i]);
}

function sameEligibility(actual, expected) {
if (!actual || typeof actual !== "object") return false;
if ((actual.scope || null) !== (expected.scope || null)) return false;
if ((actual.note || null) !== (expected.note || null)) return false;
for (const k of ["groups", "include", "exclude"]) {
const a = actual[k] || [];
const e = expected[k] || [];
if (!sameArray(a, e)) return false;
}
return true;
}

verifyBtn.addEventListener("click", async () => {

if (!lastPlan) {
log(verifyLog, "Lancer les étapes 1 et 2 d'abord.", "err");
return;
}

verifyBtn.disabled = true;
verifyLog.innerHTML = "";

try {

let ecarts = 0;

for (const p of lastPlan) {
const snap = await getDoc(doc(db, "scholarships", p.id));
if (!snap.exists()) {
log(verifyLog, `MANQUANT : ${p.id}`, "err");
ecarts++;
continue;
}
if (!sameEligibility(snap.data().eligibility, p.eligibility)) {
log(verifyLog, `ÉCART : ${p.id}`, "err");
log(verifyLog, `    attendu : ${JSON.stringify(p.eligibility)}`, "err");
log(verifyLog, `    en base : ${JSON.stringify(snap.data().eligibility)}`, "err");
ecarts++;
} else {
log(verifyLog, `OK ${p.id}`, "ok");
}
}

log(verifyLog, "");
if (ecarts === 0) {
log(verifyLog, `${lastPlan.length}/${lastPlan.length} conformes, 0 écart. Lot 20 terminé.`, "ok");
} else {
log(verifyLog, `${ecarts} écart(s) — NE PAS considérer le lot comme terminé.`, "err");
}

} catch (err) {
log(verifyLog, `ERREUR : ${err.message}`, "err");
} finally {
verifyBtn.disabled = false;
}

});
