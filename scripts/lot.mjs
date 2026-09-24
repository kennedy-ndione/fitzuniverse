// ============================================================
// FitzUniverse — runner de lots de catalogue (créé le 2026-08-30)
//
//     node scripts/lot.mjs analyser 31    lecture seule, aucune écriture
//     node scripts/lot.mjs ecrire 31      refuse si `analyser` n'a pas tourné
//     node scripts/lot.mjs verifier 31    relit et compare champ par champ
//     node scripts/lot.mjs export         écrit l'état réel du catalogue
//
// POURQUOI CE FICHIER
// Les 30 lots admin/expand-catalog-batch*.js sont des pages HTML à
// cliquer, écrites par des sessions qui ne pouvaient rien exécuter.
// Ce runner fait la même chose depuis Node, avec le même trois-temps
// analyser / écrire / vérifier — qui n'est pas décoratif : c'est lui
// qui a rattrapé une faute d'accent au lot 29 et un doublon au lot 30.
// Les 30 lots existants restent tels quels, en archive : seuls les
// lots à venir (scripts/data/lotN.mjs) passent par ici.
//
// IDENTIFIANTS — AUCUN FICHIER DE CLÉ, JAMAIS.
// Le script réutilise la session `firebase login` de firebase-tools :
// il lit le refresh token du magasin local de la CLI et l'échange
// contre un jeton d'accès éphémère auprès de Google (exactement ce que
// fait firebase-tools lui-même à chaque commande). Le client_id et le
// client_secret ci-dessous sont les constantes PUBLIQUES de
// firebase-tools (node_modules/firebase-tools/lib/api.js) — pour une
// application installée, ce « secret » est public par conception.
// Ne JAMAIS télécharger ni créer de clé de compte de service : le
// .gitignore bloque *serviceAccount*.json et *-firebase-adminsdk-*.json
// en ceinture et bretelles, mais la vraie règle est de ne pas en avoir.
//
// GARDE PROJET : refuse de démarrer si le projet visé n'est pas
// scholarbridge-e0d84 (croisé avec firebase-config.js du dépôt), et
// affiche la cible avant toute écriture. L'émulateur n'est accepté
// qu'avec LOT_EMULATEUR=1, pour que `verifier` ne puisse jamais
// « confirmer » des écritures parties ailleurs qu'en production sans
// que ce soit dit en toutes lettres.
// ============================================================

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { homedir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";

import { validerLot, SLUG_NIVEAU, boursesSansProgramme, boursesSansPortail } from "./lot-validate.mjs";
import { separerPortails } from "./instantane-portails.mjs";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const PROJECT_ID = "scholarbridge-e0d84";
const PLAN_PATH = join(racine, "scripts", ".lot-plan.json");
const EXPORT_PATH = join(racine, "scripts", "export-catalog.json");

// L'INSTANTANÉ PUBLIC (2026-09-03) — assets/data/catalogue.json, lu par
// js/catalog-data.js à la place de Firestore : zéro lecture par visite.
// Écrit par `export`, déployé avec le site (firebase deploy). Voir
// l'en-tête de js/catalog-snapshot.js. Contrairement à export-catalog
// (résumé d'audit, clés françaises, gitignoré), celui-ci porte les
// documents TELS QUELS, sous les noms des collections — c'est ce que
// le site attend — et il est versionné.
const INSTANTANE_PATH = join(racine, "assets", "data", "catalogue.json");

// LA CARTE DES PORTAILS (lot S3, 2026-09-08) — le pendant PRIVÉ de
// l'instantané ci-dessus. Embarquée avec les Cloud Functions, jamais
// servie par Hosting (firebase.json ignore functions/**), lue par la
// fonction « portails » après vérification de l'abonnement.
const PORTAILS_PATH = join(racine, "functions", "data", "catalogue-portails.json");

// Constantes OAuth PUBLIQUES de firebase-tools (voir l'en-tête) ; les
// mêmes variables d'environnement que la CLI permettent de les
// remplacer si Google les faisait tourner un jour.
const CLIENT_ID = process.env.FIREBASE_CLIENT_ID || "563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com";
const CLIENT_SECRET = process.env.FIREBASE_CLIENT_SECRET || "j9iVZfS8kkCEFUPaAeJV0sAi";

const ok = (m) => console.log(`  \x1b[32m${m}\x1b[0m`);
const warn = (m) => console.log(`  \x1b[33m${m}\x1b[0m`);
const err = (m) => console.error(`  \x1b[31m${m}\x1b[0m`);
const info = (m) => console.log(`  ${m}`);

function sortir(message) {
err(message);
process.exit(1);
}

// ==========================================================
// Identifiants — session firebase login de la CLI.
// ==========================================================

// Lit le refresh token de la session `firebase login` — jamais écrit
// ailleurs que dans le magasin de la CLI, jamais copié sur disque ici.
// Le client Firestore de firebase-admin n'accepte pas de credential
// maison (certificat ou ADC uniquement, vérifié le 2026-08-31) : on
// passe donc par @google-cloud/firestore en direct (même API, c'est la
// bibliothèque que firebase-admin enveloppe) avec un credential
// « authorized_user » que google-auth-library sait rafraîchir seul.
async function sessionFirebaseTools() {

const configstore = join(homedir(), ".config", "configstore", "firebase-tools.json");

let cfg;
try {
cfg = JSON.parse(await readFile(configstore, "utf8"));
} catch {
sortir(`Impossible de lire ${configstore} — lancez d'abord \`firebase login\`.`);
}

const refreshToken = cfg && cfg.tokens && cfg.tokens.refresh_token;
if (!refreshToken) {
sortir("Aucune session firebase-tools : lancez `firebase login` (aucun fichier de clé ne sera créé ni accepté).");
}

const compte = (cfg.user && cfg.user.email) || "(email inconnu)";
info(`Session firebase-tools : ${compte}`);

return refreshToken;

}

// ==========================================================
// Connexion Firestore, garde projet comprise.
// ==========================================================

async function ouvrirFirestore() {

// Le projet du dépôt fait foi : firebase-config.js est ce que le site
// public utilise réellement — si ce fichier et cette constante
// divergent, quelqu'un doit s'en expliquer avant toute écriture.
const configSite = await readFile(join(racine, "firebase-config.js"), "utf8");
if (!configSite.includes(`projectId: "${PROJECT_ID}"`) && !configSite.includes(`projectId:"${PROJECT_ID}"`)) {
sortir(`Garde projet : firebase-config.js ne référence pas "${PROJECT_ID}" — refus de continuer.`);
}

for (const variable of ["GOOGLE_CLOUD_PROJECT", "GCLOUD_PROJECT", "FIREBASE_PROJECT"]) {
if (process.env[variable] && process.env[variable] !== PROJECT_ID) {
sortir(`Garde projet : ${variable}=${process.env[variable]} contredit ${PROJECT_ID} — refus de continuer.`);
}
}

const emulateur = process.env.FIRESTORE_EMULATOR_HOST || "";
if (emulateur && process.env.LOT_EMULATEUR !== "1") {
sortir(`FIRESTORE_EMULATOR_HOST=${emulateur} est défini sans LOT_EMULATEUR=1 — refus d'écrire sans dire clairement où. Pour viser l'émulateur : LOT_EMULATEUR=1.`);
}

const { Firestore } = await import("@google-cloud/firestore");

if (emulateur) {
console.log(`\nProjet visé : ${PROJECT_ID} — ÉMULATEUR (${emulateur})`);
// Le client honore FIRESTORE_EMULATOR_HOST tout seul, sans credential.
return new Firestore({ projectId: PROJECT_ID });
}

console.log(`\nProjet visé : ${PROJECT_ID} — PRODUCTION`);
const refreshToken = await sessionFirebaseTools();

// quota_project_id : certains points d'accès Google Cloud exigent un
// projet de facturation explicite pour des identifiants utilisateur.
return new Firestore({
projectId: PROJECT_ID,
credentials: {
type: "authorized_user",
client_id: CLIENT_ID,
client_secret: CLIENT_SECRET,
refresh_token: refreshToken,
quota_project_id: PROJECT_ID
}
});

}

// ==========================================================
// Lot : données + empreinte (le trois-temps s'appuie dessus).
// ==========================================================

// `numero` accepte un suffixe : « 31 » -> lot31.mjs, « 33-portails » ->
// lot33-portails.mjs. Le suffixe fait partie de l'identité du lot (le
// plan sérialisé le compare tel quel), pour que deux lots portant le
// même numéro ne puissent pas se confondre.
async function chargerLot(numero) {

if (!/^\d+(-[a-z0-9-]+)?$/.test(String(numero))) {
sortir("Nom de lot attendu, ex. : node scripts/lot.mjs analyser 31  |  analyser 33-portails");
}

const chemin = join(racine, "scripts", "data", `lot${numero}.mjs`);

let brut;
try {
brut = await readFile(chemin, "utf8");
} catch {
sortir(`Fichier de données introuvable : scripts/data/lot${numero}.mjs`);
}

const empreinte = createHash("sha256").update(brut).digest("hex");
const module = await import(`file://${chemin}`);

// Les quatre formes sont toutes FACULTATIVES : un lot de correction ne
// porte que PATCHES, un lot d'élargissement n'a pas de PATCHES. On
// normalise ici pour que la suite n'ait jamais à tester leur présence.
const donnees = {
UNIVERSITIES: module.UNIVERSITIES || [],
SCHOLARSHIPS: module.SCHOLARSHIPS || [],
LINKS: module.LINKS || [],
PATCHES: module.PATCHES || []
};

return { donnees, empreinte, chemin };

}

// Sérialise en triant les clés à CHAQUE niveau d'imbrication (pas
// seulement au premier) : un objet Firestore relu (admission,
// exoneration, fraisScolarite…) ne rend pas ses clés dans l'ordre où
// le lot les a écrites, et une comparaison par JSON.stringify brut
// signalait alors un écart alors que les valeurs étaient identiques —
// corrigé le 2026-09-24 après un faux positif sur les 14 universités
// du lot 76 (Maroc).
function serialiserStable(valeur) {
if (Array.isArray(valeur)) return `[${valeur.map(serialiserStable).join(",")}]`;
if (valeur && typeof valeur === "object") {
const cles = Object.keys(valeur).sort();
return `{${cles.map((c) => `${JSON.stringify(c)}:${serialiserStable(valeur[c])}`).join(",")}}`;
}
return JSON.stringify(valeur);
}

function memesChamps(attendu, enBase) {
return diffChamps(attendu, enBase).length === 0;
}

function diffChamps(attendu, enBase) {
const lignes = [];
for (const cle of Object.keys(attendu)) {
const valeurBase = enBase ? enBase[cle] : undefined;
if (serialiserStable(attendu[cle]) !== serialiserStable(valeurBase)) {
lignes.push(`      ${cle} : lot=${JSON.stringify(attendu[cle])} / base=${JSON.stringify(valeurBase)}`);
}
}
return lignes;
}

// ==========================================================
// analyser — lecture seule, produit scripts/.lot-plan.json
// ==========================================================

async function analyser(numero) {

const { donnees, empreinte } = await chargerLot(numero);

console.log(`\n=== ANALYSE DU LOT ${numero} (lecture seule) ===\n`);

// --- 1. Le lot lui-même, hors ligne (scripts/lot-validate.mjs).
const validation = validerLot(donnees);

for (const e of validation.erreurs) err(`ERREUR : ${e}`);
for (const a of validation.avertissements) warn(a);

for (const o of validation.orphelines) {
warn(`ORPHELINE VOLONTAIRE : "${o}" n'a aucun lien — choix assumé du lot (voir l'en-tête du fichier de données), aucun programme ne sera créé pour elle.`);
}

if (validation.erreurs.length) {
sortir(`\n${validation.erreurs.length} erreur(s) dans le lot — rien n'a été lu ni écrit en base.`);
}

// --- 2. Croisement avec la base, dans les deux sens.
const db = await ouvrirFirestore();

const [snapU, snapB, snapP] = await Promise.all([
db.collection("universities").get(),
db.collection("scholarships").get(),
db.collection("programs").get()
]);

info(`Base actuelle : ${snapB.size} bourses, ${snapU.size} universités, ${snapP.size} programmes.\n`);

const basesU = new Map(snapU.docs.map((d) => [d.id, d.data()]));
const basesB = new Map(snapB.docs.map((d) => [d.id, d.data()]));
const idsProgrammes = new Set(snapP.docs.map((d) => d.id));

// Couples déjà liés, lus dans les DOCUMENTS — jamais déduits de
// l'identifiant : la base mélange trois conventions d'id.
const couples = new Set();
for (const p of snapP.docs) {
const d = p.data();
if (d.universityId && d.scholarshipId) couples.add(`${d.universityId}||${d.scholarshipId}`);
}

let bloquant = false;
const plan = { universites: [], bourses: [], programmes: [], patches: [] };

for (const u of donnees.UNIVERSITIES) {
const enBase = basesU.get(u.id);
if (!enBase) {
plan.universites.push(u);
ok(`université à créer : ${u.id}`);
} else if (memesChamps(u.data, enBase)) {
warn(`université déjà en base, identique : ${u.id} — ignorée à l'écriture.`);
} else {
err(`ERREUR : l'université "${u.id}" existe déjà avec des champs différents — ce lot ne modifie jamais l'existant. Diff :`);
diffChamps(u.data, enBase).forEach((l) => err(l));
bloquant = true;
}
}

console.log("");

for (const s of donnees.SCHOLARSHIPS) {
const enBase = basesB.get(s.id);
if (!enBase) {
plan.bourses.push(s);
ok(`bourse à créer : ${s.id}`);
} else if (memesChamps(s.data, enBase)) {
warn(`bourse déjà en base, identique : ${s.id} — ignorée à l'écriture.`);
} else {
err(`ERREUR : la bourse "${s.id}" existe déjà avec des champs différents — ce lot ne modifie jamais l'existant. Diff :`);
diffChamps(s.data, enBase).forEach((l) => err(l));
bloquant = true;
}
}

console.log("");

// Liens vers des bourses DÉJÀ EN BASE (lot 32 : on crée les
// universités manquantes pour rattacher les orphelines du lot 29).
// Les NIVEAUX vivent sur la bourse et ne sont lisibles qu'ici — même
// convention que le lot 29 : une bourse sans `levels` bloque, plutôt
// que de produire des programmes muets.
const programmesResolus = [];

for (const lien of validation.liensExternes) {

const snap = await db.collection("scholarships").doc(lien.scholarshipId).get();

if (!snap.exists) {
err(`ERREUR : bourse "${lien.scholarshipId}" absente de la base et absente du lot — rien à lier.`);
bloquant = true;
continue;
}

const niveauxBase = Array.isArray(snap.data().levels) ? snap.data().levels : [];

// Restriction déclarée par le lot (voir lot-validate.mjs) : une
// université peut ne participer qu'à certains cycles.
const niveaux = Array.isArray(lien.niveaux) && lien.niveaux.length
? niveauxBase.filter((n) => lien.niveaux.includes(n))
: niveauxBase;

if (Array.isArray(lien.niveaux) && lien.niveaux.length && !niveaux.length) {
err(`ERREUR : "${lien.scholarshipId}" — la restriction de niveaux (${lien.niveaux.join(", ")}) ne recoupe aucun niveau de la bourse en base (${niveauxBase.join(", ")}).`);
bloquant = true;
continue;
}

if (!niveaux.length) {
err(`ERREUR : la bourse "${lien.scholarshipId}" n'a pas de champ levels — aucun programme ne sera créé sans niveau.`);
bloquant = true;
continue;
}

const inattendus = niveaux.filter((n) => !SLUG_NIVEAU[n]);
if (inattendus.length) {
err(`ERREUR : "${lien.scholarshipId}" porte le(s) niveau(x) inattendu(s) ${inattendus.join(", ")} — attendu : Licence, Master, Doctorat.`);
bloquant = true;
continue;
}

for (const uid of lien.universityIds) {
for (const niveau of niveaux) {
const programme = {
id: `${uid}__${lien.scholarshipId}__${SLUG_NIVEAU[niveau]}`,
universityId: uid,
scholarshipId: lien.scholarshipId,
level: niveau
};
if (lien.language) programme.language = lien.language;
programmesResolus.push(programme);
}
}

info(`bourse en base : ${lien.scholarshipId} [${niveaux.join(", ")}] → ${lien.universityIds.length * niveaux.length} programme(s)`);

}

for (const p of [...validation.programmes, ...programmesResolus]) {
if (couples.has(`${p.universityId}||${p.scholarshipId}`)) {
warn(`couple déjà lié en base : ${p.universityId} × ${p.scholarshipId} — programme ignoré.`);
continue;
}
if (idsProgrammes.has(p.id)) {
err(`ERREUR : l'identifiant de programme "${p.id}" existe déjà en base.`);
bloquant = true;
continue;
}
plan.programmes.push(p);
ok(`programme à créer : ${p.id}`);
}

// --- 2 bis. PATCHES : mises à jour partielles de documents EXISTANTS.
// Diff champ par champ « avant -> après », avec le motif. Trois cas
// distincts : document absent (bloquant), `attendu` qui ne correspond
// plus (bloquant — quelqu'un est passé avant), et patch sans effet
// (compté à part, jamais écrit).
let sansEffet = 0;

// Vidages comptés à part (2026-08-31) : la garde du portail autorise
// « "" ou null » sans motif, à raison — mais un lot qui viderait cent
// champs ne doit pas passer sans qu'on le voie. Le compte est le
// contrepoids de cette exemption.
let vidages = 0;

if (validation.patches.length) console.log("");

for (const patch of validation.patches) {

const ou = `${patch.collection}/${patch.id}`;
const snap = await db.collection(patch.collection).doc(patch.id).get();

if (!snap.exists) {
err(`ERREUR : ${ou} n'existe pas — un patch met à jour un document EXISTANT, il n'en crée jamais.`);
bloquant = true;
continue;
}

const enBase = snap.data();

// Garde : la base doit être dans l'état supposé par le lot. Sinon
// quelqu'un (ou un lot précédent) est passé entre la rédaction du
// patch et son exécution, et le « avant » écrit dans le fichier ne
// décrit plus la réalité.
if (patch.attendu) {
const ecarts = diffChamps(patch.attendu, enBase);
if (ecarts.length) {
err(`ERREUR : ${ou} n'est pas dans l'état attendu par le lot — quelqu'un est passé avant. Diff (lot=attendu / base=réel) :`);
ecarts.forEach((l) => err(l));
bloquant = true;
continue;
}
}

const changements = Object.keys(patch.champs).filter(
(cle) => JSON.stringify(enBase[cle]) !== JSON.stringify(patch.champs[cle])
);

if (!changements.length) {
warn(`SANS EFFET : ${ou} porte déjà ces valeurs — non écrit.`);
sansEffet++;
continue;
}

const champsVides = changements.filter((cle) => patch.champs[cle] === "" || patch.champs[cle] === null);
if (champsVides.length) vidages++;

ok(`patch : ${ou}${champsVides.length ? `   [VIDAGE : ${champsVides.join(", ")}]` : ""}`);
info(`    ${patch.motif}`);
for (const cle of changements) {
info(`    ${cle} :`);
info(`      avant -> ${JSON.stringify(enBase[cle])}`);
info(`      après -> ${JSON.stringify(patch.champs[cle])}`);
}

plan.patches.push({
collection: patch.collection,
id: patch.id,
champs: patch.champs,
motif: patch.motif
});

}

// --- 3. Le compte, à comparer à celui annoncé par le lot.
console.log("");
info(`COMPTE : ${plan.universites.length} universités, ${plan.bourses.length} bourses, ${plan.programmes.length} programmes à créer, ${plan.patches.length} patches à appliquer${sansEffet ? ` (+ ${sansEffet} sans effet, ignoré${sansEffet > 1 ? "s" : ""})` : ""}.`);

// Toujours affiché quand il y en a, en avertissement : vider un champ
// ne demande aucun motif (voir refusPortailProgramme), le compte est
// donc le seul garde-fou visible avant l'écriture.
if (vidages) warn(`DONT ${vidages} PATCH${vidages > 1 ? "ES" : ""} QUI VIDE${vidages > 1 ? "NT" : ""} UN CHAMP — vérifier que c'est bien l'intention du lot.`);
info(`(le lot en annonce ${validation.attendus.universites} / ${validation.attendus.bourses} / ${validation.attendus.programmes} et ${validation.attendus.patches} patches — un écart est LE signal de ne pas écrire)`);
if (validation.liensExternes.length) {
info(`(dont ${programmesResolus.length} programmes issus de ${validation.liensExternes.length} bourses DÉJÀ EN BASE : leurs niveaux ne sont lisibles qu'ici, pas dans le fichier de données)`);
}

if (bloquant) {
sortir("\nAnomalie(s) bloquante(s) — aucune écriture n'a eu lieu, pas de plan enregistré.");
}

await writeFile(PLAN_PATH, JSON.stringify({
lot: String(numero),
empreinte,
genereLe: new Date().toISOString(),
...plan
}, null, 2), "utf8");

ok(`\nPlan enregistré dans scripts/.lot-plan.json — étape suivante : node scripts/lot.mjs ecrire ${numero}`);

}

// ==========================================================
// ecrire — relit le plan, refuse si les données ont bougé.
// ==========================================================

async function chargerPlan(numero) {

let plan;
try {
plan = JSON.parse(await readFile(PLAN_PATH, "utf8"));
} catch {
sortir(`Pas de plan : lancer d'abord node scripts/lot.mjs analyser ${numero}`);
}

if (String(plan.lot) !== String(numero)) {
sortir(`Le plan enregistré vise le lot ${plan.lot}, pas le lot ${numero} — relancer analyser.`);
}

const { empreinte } = await chargerLot(numero);
if (empreinte !== plan.empreinte) {
sortir(`scripts/data/lot${numero}.mjs a changé depuis l'analyse — relancer analyser (c'est cette empreinte qui a rattrapé la faute d'accent du lot 29).`);
}

return plan;

}

async function ecrire(numero) {

const plan = await chargerPlan(numero);
const db = await ouvrirFirestore();

console.log(`\n=== ÉCRITURE DU LOT ${numero} ===\n`);

for (const u of plan.universites) {
await db.collection("universities").doc(u.id).set(u.data, { merge: true });
ok(`université écrite : ${u.id}`);
}

// Bourses : TOUS les champs du lot, tels quels. Un champ absent du lot
// n'est jamais écrit — surtout pas ageMax:{} ni entryPoint:"" : un
// champ absent est un INCONNU (même règle que tout le site).
for (const s of plan.bourses) {
await db.collection("scholarships").doc(s.id).set(s.data);
ok(`bourse écrite : ${s.id}`);
}

for (const p of plan.programmes) {
const { id, ...docu } = p;
await db.collection("programs").doc(id).set(docu, { merge: true });
ok(`programme écrit : ${id}`);
}

// PATCHES : `update` et jamais `set` — set(sans merge) écraserait le
// document entier, set(merge) accepterait un document absent et le
// créerait. update() échoue si le document n'existe pas, ce qui est
// exactement la garantie voulue ici. Une chaîne vide s'écrit comme
// chaîne vide : c'est une valeur, pas une absence (voir l'en-tête de
// validerPatches dans scripts/lot-validate.mjs).
for (const patch of plan.patches || []) {
await db.collection(patch.collection).doc(patch.id).update(patch.champs);
ok(`patch appliqué : ${patch.collection}/${patch.id}`);
}

const nbPatches = (plan.patches || []).length;
ok(`\n${plan.universites.length} universités, ${plan.bourses.length} bourses, ${plan.programmes.length} programmes écrits, ${nbPatches} patches appliqués — étape suivante : node scripts/lot.mjs verifier ${numero}`);

}

// ==========================================================
// verifier — relit la base et compare champ par champ.
// ==========================================================

async function verifier(numero) {

const plan = await chargerPlan(numero);
const db = await ouvrirFirestore();

console.log(`\n=== VÉRIFICATION DU LOT ${numero} ===\n`);

let ecarts = 0;

async function comparer(collection, id, attendu) {
const snap = await db.collection(collection).doc(id).get();
if (!snap.exists) {
err(`MANQUANT : ${collection}/${id}`);
ecarts++;
return;
}
const lignes = diffChamps(attendu, snap.data());
if (lignes.length) {
err(`ÉCART : ${collection}/${id}`);
lignes.forEach((l) => err(l));
ecarts++;
} else {
ok(`OK ${collection}/${id}`);
}
}

for (const u of plan.universites) await comparer("universities", u.id, u.data);
for (const s of plan.bourses) await comparer("scholarships", s.id, s.data);
for (const p of plan.programmes) {
const { id, ...docu } = p;
await comparer("programs", id, docu);
}
// Un patch ne se vérifie que sur les champs qu'il a écrits : le reste
// du document ne le regarde pas et ne doit pas remonter en écart.
for (const patch of plan.patches || []) {
await comparer(patch.collection, patch.id, patch.champs);
}

console.log("");
const total = plan.universites.length + plan.bourses.length + plan.programmes.length + (plan.patches || []).length;
if (ecarts === 0) {
ok(`${total} documents conformes, 0 écart. Lot ${numero} terminé.`);
} else {
sortir(`${ecarts} écart(s) — NE PAS considérer le lot comme terminé.`);
}

}

// ==========================================================
// export — le même instantané que admin/export-catalog.html,
// écrit dans scripts/export-catalog.json (gitignoré) : plus
// besoin de coller le JSON dans une conversation.
// ==========================================================

// Les champs BAILLEUR et LIMITE D'ÂGE sont exportés avec `?? null`, et
// non `|| ""` comme le reste : ici la distinction entre « absent » et
// « vide » est l'information elle-même. Toute la règle des trois
// valeurs du projet (funder, entryPoint, ageMax, eligibility) repose
// sur « un champ absent est un INCONNU, jamais une valeur par
// défaut » — un export qui écrirait "" pour un champ absent effacerait
// précisément ce qu'il doit donner à voir.
//
// Ajoutés le 2026-08-31, pour la même raison qu'applicationUrl la
// veille : un champ absent de l'export est un champ que personne ne
// peut auditer, et c'est ce qui a rendu le lot 33 invisible.
function resumeBourse(id, d) {
return {
id,
titre: d.title || "",
pays: d.country || "",
niveaux: Array.isArray(d.levels) ? d.levels : [],
statut: d.status || "",
actif: d.isActive !== false,
site: d.officialWebsite || "",
// Lot S3 : le portail de DÉPÔT de la bourse, distinct de `site` (la
// page du bailleur). Exporté pour la même raison qu'applicationUrl au
// niveau programme l'a été le 2026-08-31 : un champ absent de l'export
// est un champ que personne ne peut auditer.
portail: d.applicationPortalUrl || "",
image: d.image || "",
funder: d.funder ?? null,
funderName: d.funderName ?? null,
entryPoint: d.entryPoint ?? null,
ageMax: d.ageMax ?? null,
ageMaxNote: d.ageMaxNote ?? null,
eligibilite: d.eligibility
? {
scope: d.eligibility.scope || null,
groups: d.eligibility.groups || [],
include: d.eligibility.include || [],
exclude: d.eligibility.exclude || [],
note: d.eligibility.note ? "(renseignée)" : null
}
: null
};
}

// `portail` = applicationPortalUrl, le portail d'ADMISSION de
// l'établissement : c'est lui qui doit porter le lien, pas le programme
// (voir resumeProgramme ci-dessous).
function resumeUniversite(id, d) {
return {
id,
nom: d.name || "",
ville: d.city || "",
pays: d.country || "",
image: d.image || "",
site: d.officialWebsite || "",
portail: d.applicationPortalUrl || ""
};
}

// Les champs qui DÉCIDENT DE L'AFFICHAGE d'une fiche (details.js) —
// ajoutés le 2026-08-31. L'export n'en portait que trois, si bien que
// `applicationUrl` au niveau programme était invisible à l'audit : le
// lot 33 a patché les 24 universités sans voir que 107 programmes
// portaient leur propre URL, qui PRIME dans details.js
// (`program.applicationUrl || universityProfile.applicationPortalUrl`).
// Un champ absent de l'export est un champ que personne ne peut
// auditer — c'est la leçon de ce lot.
function resumeProgramme(id, d) {
return {
id,
universityId: d.universityId || "",
scholarshipId: d.scholarshipId || "",
applicationUrl: d.applicationUrl || "",
level: d.level || "",
deadline: d.deadline || "",
coverage: d.coverage || "",
language: d.language || "",
status: d.status || ""
};
}

// Convertit récursivement ce que JSON ne sait pas écrire : les
// Timestamps Firestore (admin SDK) deviennent des chaînes ISO. Tout le
// reste passe tel quel.
function serialiser(valeur) {
if (valeur === null || valeur === undefined) return valeur;
if (typeof valeur.toDate === "function") return valeur.toDate().toISOString();
if (Array.isArray(valeur)) return valeur.map(serialiser);
if (typeof valeur === "object") {
const sortie = {};
for (const [k, v] of Object.entries(valeur)) sortie[k] = serialiser(v);
return sortie;
}
return valeur;
}

async function exporter() {

const db = await ouvrirFirestore();

console.log("\n=== EXPORT DU CATALOGUE (lecture seule) ===\n");

const [boursesSnap, universitesSnap, programmesSnap] = await Promise.all([
db.collection("scholarships").get(),
db.collection("universities").get(),
db.collection("programs").get()
]);

const bourses = boursesSnap.docs
.map((d) => resumeBourse(d.id, d.data()))
.sort((a, b) => (a.pays + a.titre).localeCompare(b.pays + b.titre, "fr"));

const universites = universitesSnap.docs
.map((d) => resumeUniversite(d.id, d.data()))
.sort((a, b) => (a.pays + a.nom).localeCompare(b.pays + b.nom, "fr"));

const programmes = programmesSnap.docs.map((d) => resumeProgramme(d.id, d.data()));

const parPays = {};
bourses.forEach((b) => { parPays[b.pays || "(sans pays)"] = (parPays[b.pays || "(sans pays)"] || 0) + 1; });

const sansEligibilite = bourses.filter((b) => !b.eligibilite).map((b) => b.id);
const sansImage = bourses.filter((b) => !b.image).map((b) => b.id);

// Programmes portant leur PROPRE applicationUrl — la liste à classer :
// vraie exception « Option B » (portail réellement distinct de celui de
// l'établissement) ou copie à vider. Sorti à part parce que c'est
// exactement la question ouverte après le lot 33.
const portailAuNiveauProgramme = programmes.filter((p) => p.applicationUrl).map((p) => p.id);

// Bailleur : ce qui reste à renseigner. Compté sur « valeur absente ou
// vide » — les deux se lisent de la même façon pour l'étudiant, qui ne
// voit alors simplement rien.
const sansFunder = bourses.filter((b) => !b.funder).map((b) => b.id);
const sansEntryPoint = bourses.filter((b) => !b.entryPoint).map((b) => b.id);

// Répartition par type de bailleur : le chiffre que le filtre
// « Type de bourse » du catalogue renverra, calculé sur la base réelle.
const parFunder = {};
bourses.forEach((b) => { if (b.funder) parFunder[b.funder] = (parFunder[b.funder] || 0) + 1; });

// Bourses qu'AUCUN programme ne référence : invisibles au moteur de
// recommandation, donc à la fonctionnalité facturée (voir
// boursesSansProgramme dans scripts/lot-validate.mjs). Calculé sur les
// snapshots DÉJÀ chargés — aucune lecture Firestore supplémentaire.
const sansProgramme = boursesSansProgramme(bourses, programmes);

// Lot S3 : bourses qui se déposent chez le bailleur et n'ont pas de
// portail de dépôt. La fiche dit à l'étudiant que ce n'est pas
// l'université qui reçoit son dossier, puis ne lui dit pas qui le
// reçoit. Voir scripts/data/triage-portails-bourses.mjs pour le
// triage des 156 `officialWebsite` existants.
const sansPortail = boursesSansPortail(bourses.map((b) => ({ id: b.id, entryPoint: b.entryPoint, applicationPortalUrl: b.portail })));

// Programmes sans `coverage` : ce que la page publique ne peut PAS
// dire de la prise en charge. C'est la mesure qui a fait retirer
// « entièrement financées » des deux catalogues le 2026-08-31 — au
// moment du comptage, 124 programmes sur 335 (37 %) avaient ce champ
// vide, et au moins 42 des renseignés décrivaient une prise en charge
// PARTIELLE. Compté ici pour la même raison que les autres compteurs
// de ce bloc : ce qui n'est pas compté n'est pas corrigé, et une
// promesse de financement invérifiable est le genre d'approximation
// qui coûte le plus cher à un site qui vend de la rigueur.
// « Absent ou vide » comptent pareil : l'étudiant ne voit rien dans
// les deux cas.
const sansCoverage = programmes.filter((p) => !p.coverage).map((p) => p.id);

const exportJson = {
genereLe: new Date().toISOString(),
totaux: {
bourses: bourses.length,
universites: universites.length,
programmes: programmes.length,
pays: Object.keys(parPays).length,
boursesSansEligibilite: sansEligibilite.length,
boursesSansImage: sansImage.length,
boursesSansFunder: sansFunder.length,
boursesSansEntryPoint: sansEntryPoint.length,
boursesSansProgramme: sansProgramme.length,
boursesSansPortailDeDepot: sansPortail.length,
programmesAvecPortailPropre: portailAuNiveauProgramme.length,
programmesSansCoverage: sansCoverage.length
},
boursesParFunder: parFunder,
boursesParPays: Object.fromEntries(Object.entries(parPays).sort((a, b) => b[1] - a[1])),
paysAUneSeuleBourse: Object.entries(parPays).filter(([, n]) => n === 1).map(([p]) => p).sort(),
boursesSansEligibilite: sansEligibilite,
boursesSansFunder: sansFunder,
boursesSansEntryPoint: sansEntryPoint,
boursesSansProgrammeIds: sansProgramme,
boursesSansPortailDeDepot: sansPortail,
programmesAvecPortailPropre: portailAuNiveauProgramme,
programmesSansCoverage: sansCoverage,
bourses,
universites,
programmes
};

await writeFile(EXPORT_PATH, JSON.stringify(exportJson, null, 2), "utf8");

ok(`scripts/export-catalog.json écrit : ${bourses.length} bourses · ${universites.length} universités · ${programmes.length} programmes · ${Object.keys(parPays).length} pays.`);

// --- L'instantané PUBLIC, sur les MÊMES snapshots (aucune lecture de
// plus). Documents tels quels, id inclus, Timestamps Firestore
// convertis en ISO (JSON n'a pas de type date ; le site n'en lit
// aucun sur ces trois collections, mais un objet {_seconds} servi tel
// quel serait un piège pour la suite). Trié par id : un export sans
// changement de données donne un fichier identique — diff git propre.
const brut = (snap) => snap.docs
.map((d) => ({ id: d.id, ...serialiser(d.data()) }))
.sort((a, b) => a.id.localeCompare(b.id));

// `parUid` RESTE DANS L'INSTANTANÉ PUBLIC — ERREUR DU LOT VOIX,
// RATTRAPÉE PAR LA SUITE DE TESTS LE 2026-09-20.
//
// L'audit du jour avait relevé l'UID du compte validateur publié 437
// fois ici et proposé de le purger à la génération, au nom de la
// doctrine de voix (« ne pas montrer qu'une seule personne est
// derrière »). La purge a été écrite, l'export l'a appliquée, et
// `test/fraicheur.test.mjs` (« fondation 1 — toute date publiée comme
// vérifiée porte sa preuve ») est passé au rouge sur-le-champ :
//
//     aims-ghana-masters-mathematical-sciences : on doit savoir QUI a validé
//
// Ce test est délibéré, et il a raison. Le mot « vérifiée » est le
// plus fort que ce site adresse à un étudiant : il n'est accordé
// qu'aux fiches portant les QUATRE preuves — date ISO, jour de
// vérification, source (https + phrase lue) et validateur. Retirer le
// validateur, c'est garder le mot en enlevant une preuve.
//
// Et l'UID n'est PAS une identité : c'est précisément la mesure prise
// après la fuite du 2026-09-19, quand une adresse e-mail d'admin
// s'était retrouvée deux fois dans ce fichier public. Le test interdit
// d'ailleurs toute adresse e-mail dans ces champs. Un UID opaque est
// la bonne réponse — pas un défaut de vitrine.
//
// À ne pas refaire : si l'on veut un jour que plusieurs validateurs
// apparaissent, cela se gagne en faisant valider par plusieurs
// comptes, pas en effaçant la trace de celui qui a travaillé.
const instantane = {
genereLe: exportJson.genereLe,
programs: brut(programmesSnap),
universities: brut(universitesSnap),
scholarships: brut(boursesSnap)
};

// LOT S3 (2026-09-08) — DEUX FICHIERS, PLUS UN SEUL.
//
// L'instantané public est servi par Hosting : il est public par
// construction, quoi qu'affiche le navigateur. Il portait pourtant
// `applicationPortalUrl` en clair pour 147 universités sur 155 —
// c'est-à-dire que le portail « réservé aux abonnés » s'ouvrait en
// ouvrant une URL. Le verrou de details.js masquait un bouton, pas
// une donnée.
//
// La carte des portails part donc dans functions/data/, embarquée avec
// les Cloud Functions et servie par `portails` (functions/portails.js)
// après vérification de l'abonnement. Elle N'EST PAS déployée par
// Hosting : firebase.json ignore functions/** — sans cette ligne, tout
// ce lot serait décoratif, le répertoire functions/ étant servi comme
// le reste du dépôt.
const { public: instantanePublic, portails, comptes } = separerPortails(instantane);

await mkdir(dirname(INSTANTANE_PATH), { recursive: true });
const texte = JSON.stringify(instantanePublic);
await writeFile(INSTANTANE_PATH, texte, "utf8");

await mkdir(dirname(PORTAILS_PATH), { recursive: true });
await writeFile(PORTAILS_PATH, JSON.stringify(portails, null, 2), "utf8");

ok(`assets/data/catalogue.json écrit (${Math.round(texte.length / 1024)} Ko) — c'est CE fichier que le site public sert. Le déployer : firebase deploy --only hosting.`);
ok(`functions/data/catalogue-portails.json écrit : ${comptes.universites} université(s), ${comptes.programmes} programme(s), ${comptes.bourses} bourse(s). Le déployer : firebase deploy --only functions.`);

if (sansPortail.length) {
warn(`${sansPortail.length} bourse(s) « dépôt chez le bailleur » sans portail de dépôt — voir boursesSansPortailDeDepot dans scripts/export-catalog.json.`);
}

}

// ==========================================================
// Point d'entrée
// ==========================================================

const [commande, numero] = process.argv.slice(2);

switch (commande) {
case "analyser": await analyser(numero); break;
case "ecrire": await ecrire(numero); break;
case "verifier": await verifier(numero); break;
case "export": await exporter(); break;
default:
console.log("Usage : node scripts/lot.mjs <analyser|ecrire|verifier> <lot>  |  node scripts/lot.mjs export");
console.log("        <lot> : 31, ou 33-portails (suffixe accepté)");
process.exit(commande ? 1 : 0);
}
