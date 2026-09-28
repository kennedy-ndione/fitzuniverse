// ============================================================
// FitzUniverse — rejeu des règles Firestore contre l'ÉMULATEUR
// (grille B, 2026-09-07)
//
//     npm run emulators          (dans un autre terminal)
//     node scripts/rejouer-regles.mjs
//
// POURQUOI
// firestore.rules borne les quotas par l'IDENTIFIANT des candidatures
// (slot-N pour les bourses, pre-N pour les préinscriptions) selon le
// forfait du compte. Aucun test unitaire ne peut le prouver : seules
// les règles, exécutées par l'émulateur, font foi. Ce script sème des
// comptes avec le SDK Admin (qui contourne les règles, c'est son rôle)
// puis rejoue des écritures COMME L'ÉTUDIANT, par l'API REST de
// l'émulateur avec un jeton non signé — exactement ce que fait
// @firebase/rules-unit-testing, sans la dépendance.
//
// Sort en code 1 si une attente n'est pas tenue. Refuse de tourner
// hors émulateur.
// ============================================================
import process from "node:process";

const HOTE = process.env.FIRESTORE_EMULATOR_HOST || "localhost:8080";
if (!HOTE || /googleapis|firestore\.googleapis/.test(HOTE)) {
  console.error("Ce script ne tourne que contre l'émulateur (FIRESTORE_EMULATOR_HOST).");
  process.exit(1);
}
process.env.FIRESTORE_EMULATOR_HOST = HOTE;

const PROJET = "scholarbridge-e0d84";
const BASE = `http://${HOTE}/v1/projects/${PROJET}/databases/(default)/documents`;

const { initializeApp, getApps } = await import("firebase-admin/app");
const { getFirestore } = await import("firebase-admin/firestore");
if (!getApps().length) initializeApp({ projectId: PROJET });
const admin = getFirestore();

// Jeton non signé accepté par l'émulateur (alg: none).
function jeton(uid) {
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const maintenant = Math.floor(Date.now() / 1000);
  return `${b64({ alg: "none", typ: "JWT" })}.${b64({
    iss: `https://securetoken.google.com/${PROJET}`, aud: PROJET, sub: uid, user_id: uid, uid,
    iat: maintenant, exp: maintenant + 3600, auth_time: maintenant, firebase: { sign_in_provider: "password", identities: {} }
  })}.`;
}

function versValeur(v) {
  if (v === null || v === undefined) return { nullValue: null };
  if (typeof v === "string") return { stringValue: v };
  if (typeof v === "boolean") return { booleanValue: v };
  if (typeof v === "number") return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  if (Array.isArray(v)) return { arrayValue: { values: v.map(versValeur) } };
  if (typeof v === "object") return { mapValue: { fields: Object.fromEntries(Object.entries(v).map(([k, x]) => [k, versValeur(x)])) } };
  throw new Error("type non géré");
}

// Création d'un document (échoue si le document existe : currentDocument.exists=false),
// COMME L'ÉTUDIANT `uid`.
async function creerCommeEtudiant(uid, chemin, data) {
  const [collection, id] = [chemin.slice(0, chemin.lastIndexOf("/")), chemin.slice(chemin.lastIndexOf("/") + 1)];
  const r = await fetch(`${BASE}/${collection}?documentId=${encodeURIComponent(id)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${jeton(uid)}` },
    body: JSON.stringify({ fields: Object.fromEntries(Object.entries(data).map(([k, v]) => [k, versValeur(v)])) })
  });
  return r.status;
}

async function patchCommeEtudiant(uid, chemin, data) {
  const masque = Object.keys(data).map((k) => `updateMask.fieldPaths=${encodeURIComponent(k)}`).join("&");
  const r = await fetch(`${BASE}/${chemin}?${masque}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${jeton(uid)}` },
    body: JSON.stringify({ fields: Object.fromEntries(Object.entries(data).map(([k, v]) => [k, versValeur(v)])) })
  });
  return r.status;
}

// LOT ACCEPTATION (2026-09-11) : deux écritures de plus, comme l'étudiant.
// La suppression (DELETE REST) — c'est ce que fait deleteDoc().
async function supprimerCommeEtudiant(uid, chemin) {
  const r = await fetch(`${BASE}/${chemin}`, { method: "DELETE", headers: { Authorization: `Bearer ${jeton(uid)}` } });
  return r.status;
}

// Une écriture avec l'HEURE DU SERVEUR (`:commit`, transform
// setToServerValue: REQUEST_TIME) — c'est ce que fait updateDoc() avec
// serverTimestamp() ; firestore.rules y lit request.time. `data` porte
// les champs ordinaires, `heureServeur` les champs horodatés, `effacer`
// les champs retirés (deleteField()).
async function patchAvecHeureServeur(uid, chemin, data = {}, heureServeur = [], effacer = []) {
  const name = `projects/${PROJET}/databases/(default)/documents/${chemin}`;
  const write = {
    update: { name, fields: Object.fromEntries(Object.entries(data).map(([k, v]) => [k, versValeur(v)])) },
    updateMask: { fieldPaths: [...Object.keys(data), ...effacer] },
    currentDocument: { exists: true }
  };
  if (heureServeur.length) write.updateTransforms = heureServeur.map((fieldPath) => ({ fieldPath, setToServerValue: "REQUEST_TIME" }));
  const r = await fetch(`http://${HOTE}/v1/projects/${PROJET}/databases/(default)/documents:commit`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${jeton(uid)}` },
    body: JSON.stringify({ writes: [write] })
  });
  return r.status;
}

// Accepter le choix de Fitz : accepteeLe = heure du serveur.
const accepterCommeEtudiant = (uid, chemin, data = {}) => patchAvecHeureServeur(uid, chemin, data, ["accepteeLe"]);

const resultats = [];
function attendre(nom, obtenu, attendu) {
  const ok = obtenu === attendu;
  resultats.push({ nom, ok, obtenu, attendu });
  console.log(`  ${ok ? "OK " : "KO "} ${nom} → ${obtenu} (attendu ${attendu})`);
}

const T = Date.now();
const UID_BOURSE = `rejeu-bourse-${T}`;
const UID_DOSSIER = `rejeu-dossier-${T}`;
const UID_LES_DEUX = `rejeu-les-deux-${T}`;
const UID_DIAG = `rejeu-diagnostic-${T}`;
// Grille A (2026-09-07).
const UID_ESS4 = `rejeu-essentiel4-${T}`;
const UID_CONS6 = `rejeu-conseiller6-${T}`;
// Anciennes formules, SUPPRIMÉES le 2026-09-24 : un compte qui en porterait
// encore une n'a plus aucun droit de formule.
const UID_ESS_ANCIEN = `rejeu-essentiel-ancien-${T}`;
const UID_PREMIER = `rejeu-premier-dossier-${T}`;
const UID_GRATUIT = `rejeu-gratuit-${T}`;
const UID_PASS = `rejeu-pass-${T}`;
const UID_SIGNATURE = `rejeu-signature-${T}`;
const dans = (jours) => new Date(Date.now() + jours * 86400000).toISOString();

await admin.doc(`users/${UID_BOURSE}`).set({ uid: UID_BOURSE, name: "Essentiel seul", plan: "essentiel-4" });
await admin.doc(`users/${UID_DOSSIER}`).set({ uid: UID_DOSSIER, name: "Dossier France seul", planPreinscription: "dossier-france", planPreinscriptionExpiresAt: dans(200) });
await admin.doc(`users/${UID_LES_DEUX}`).set({ uid: UID_LES_DEUX, name: "Les deux", plan: "essentiel-4", planPreinscription: "dossier-france-conseiller", planPreinscriptionExpiresAt: dans(200) });
await admin.doc(`users/${UID_DIAG}`).set({ uid: UID_DIAG, name: "Diagnostic seul", planPreinscription: "diagnostic-france", planPreinscriptionExpiresAt: dans(10) });
await admin.doc(`users/${UID_ESS4}`).set({ uid: UID_ESS4, name: "Essentiel 4", plan: "essentiel-4", planExpiresAt: dans(180) });
await admin.doc(`users/${UID_CONS6}`).set({ uid: UID_CONS6, name: "Conseiller 6", plan: "conseiller-6", planExpiresAt: dans(270) });
await admin.doc(`users/${UID_ESS_ANCIEN}`).set({ uid: UID_ESS_ANCIEN, name: "Essentiel ancien (5)", plan: "essentiel", planExpiresAt: dans(180) });
await admin.doc(`users/${UID_PREMIER}`).set({ uid: UID_PREMIER, name: "Premier Dossier", plan: "premier-dossier" });
await admin.doc(`users/${UID_GRATUIT}`).set({ uid: UID_GRATUIT, name: "Gratuit" });
await admin.doc(`users/${UID_PASS}`).set({ uid: UID_PASS, name: "Pass Découverte", fitzExpressExpiresAt: dans(14) });
await admin.doc(`users/${UID_SIGNATURE}`).set({ uid: UID_SIGNATURE, name: "Signature (ancienne)", plan: "signature", planExpiresAt: dans(365) });

// LOT FITZ-CHOISIT (2026-09-11) : une candidature BOURSE naît du
// catalogue — firestore.rules exige un programId qui existe dans
// /programs, avec scholarshipId, universityId et le nom de l'université
// cohérents. On sème donc un programme et son université avec le SDK
// Admin ; les cas « texte libre » restent plus bas, refusés.
const PROG = "rejeu-programme";
const UNI = "rejeu-universite";
const BOURSE = "rejeu-bourse";
await admin.doc(`universities/${UNI}`).set({ name: "Université de test", country: "France" });
await admin.doc(`scholarships/${BOURSE}`).set({ title: "Bourse de test", isActive: true });
await admin.doc(`programs/${PROG}`).set({ universityId: UNI, scholarshipId: BOURSE, level: "Master" });
const AUTRE_PROG = "rejeu-programme-2";
const AUTRE_UNI = "rejeu-universite-2";
await admin.doc(`universities/${AUTRE_UNI}`).set({ name: "Université de test 2", country: "Canada" });
await admin.doc(`programs/${AUTRE_PROG}`).set({ universityId: AUTRE_UNI, scholarshipId: BOURSE, level: "Master" });
// LOT ACCEPTATION : une seconde bourse, que l'organisme FERME en cours de
// route (isActive:false) — l'exception catalogue —, et une troisième
// université pour la remplaçante.
const BOURSE_FERMEE = "rejeu-bourse-fermee";
const PROG_FERME = "rejeu-programme-ferme";
const UNI_3 = "rejeu-universite-3";
const PROG_3 = "rejeu-programme-3";
await admin.doc(`scholarships/${BOURSE_FERMEE}`).set({ title: "Bourse qui ferme", isActive: true });
await admin.doc(`programs/${PROG_FERME}`).set({ universityId: UNI, scholarshipId: BOURSE_FERMEE, level: "Master" });
await admin.doc(`universities/${UNI_3}`).set({ name: "Université de test 3", country: "Belgique" });
await admin.doc(`programs/${PROG_3}`).set({ universityId: UNI_3, scholarshipId: BOURSE, level: "Master" });
const IDENTITE_FERMEE = { university: "Université de test", scholarship: "Bourse qui ferme", scholarshipId: BOURSE_FERMEE, programId: PROG_FERME, universityId: UNI };
const IDENTITE_2 = { university: "Université de test 2", scholarship: "Bourse de test", scholarshipId: BOURSE, programId: AUTRE_PROG, universityId: AUTRE_UNI };
const IDENTITE_3 = { university: "Université de test 3", scholarship: "Bourse de test", scholarshipId: BOURSE, programId: PROG_3, universityId: UNI_3 };

const IDENTITE = { university: "Université de test", scholarship: "Bourse de test", scholarshipId: BOURSE, programId: PROG, universityId: UNI };
const candidature = (track) => (track === "preinscription"
  ? { university: "Université de test", status: "a_preparer", track, checklist: [], reminderFrequency: 14 }
  : { ...IDENTITE, status: "a_preparer", track, checklist: [], reminderFrequency: 14 });

console.log("\n=== Quotas par parcours (firestore.rules) ===");

console.log("Dossier France seul :");
for (let n = 1; n <= 7; n++) attendre(`pré-inscription pre-${n} acceptée`, await creerCommeEtudiant(UID_DOSSIER, `users/${UID_DOSSIER}/applications/pre-${n}`, candidature("preinscription")), 200);
attendre("la 8e préinscription (pre-8) est refusée", await creerCommeEtudiant(UID_DOSSIER, `users/${UID_DOSSIER}/applications/pre-8`, candidature("preinscription")), 403);
attendre("une bourse (slot-1) est refusée sur un compte Dossier France seul", await creerCommeEtudiant(UID_DOSSIER, `users/${UID_DOSSIER}/applications/slot-1`, candidature("bourse")), 403);
attendre("une préinscription sur un id slot-N est refusée", await creerCommeEtudiant(UID_DOSSIER, `users/${UID_DOSSIER}/applications/slot-2`, candidature("preinscription")), 403);

console.log("Essentiel seul :");
attendre("une bourse slot-1 est acceptée", await creerCommeEtudiant(UID_BOURSE, `users/${UID_BOURSE}/applications/slot-1`, candidature("bourse")), 200);
attendre("une préinscription pre-1 est refusée sur un compte bourse seul", await creerCommeEtudiant(UID_BOURSE, `users/${UID_BOURSE}/applications/pre-1`, candidature("preinscription")), 403);
attendre("une préinscription déguisée en slot-2 est refusée", await creerCommeEtudiant(UID_BOURSE, `users/${UID_BOURSE}/applications/slot-2`, candidature("preinscription")), 403);
attendre("une candidature SANS track sur slot-2 passe (parcours bourse par défaut)", await creerCommeEtudiant(UID_BOURSE, `users/${UID_BOURSE}/applications/slot-2`, { ...IDENTITE, status: "a_preparer" }), 200);

console.log("Les deux forfaits :");
attendre("bourse slot-1 acceptée", await creerCommeEtudiant(UID_LES_DEUX, `users/${UID_LES_DEUX}/applications/slot-1`, candidature("bourse")), 200);
attendre("préinscription pre-1 acceptée", await creerCommeEtudiant(UID_LES_DEUX, `users/${UID_LES_DEUX}/applications/pre-1`, candidature("preinscription")), 200);
attendre("demande conseiller acceptée (Dossier France + Conseiller)", await creerCommeEtudiant(UID_LES_DEUX, `users/${UID_LES_DEUX}/advisorRequests/r1`, { text: "Relecture", applicationId: "pre-1", university: "Test", status: "nouveau", createdAt: new Date().toISOString() }), 200);
attendre("demande conseiller REFUSÉE pour Dossier France sans conseiller", await creerCommeEtudiant(UID_DOSSIER, `users/${UID_DOSSIER}/advisorRequests/r1`, { text: "Relecture", applicationId: "pre-1", university: "Test", status: "nouveau", createdAt: new Date().toISOString() }), 403);
attendre("réponse messagerie acceptée pour Dossier France", await creerCommeEtudiant(UID_DOSSIER, `users/${UID_DOSSIER}/messages/m1`, { text: "Bonjour", fromStudent: true, createdAt: new Date().toISOString(), read: false }), 200);

console.log("Diagnostic seul :");
attendre("aucune candidature (pre-1 refusée)", await creerCommeEtudiant(UID_DIAG, `users/${UID_DIAG}/applications/pre-1`, candidature("preinscription")), 403);
attendre("aucune candidature (slot-1 refusée)", await creerCommeEtudiant(UID_DIAG, `users/${UID_DIAG}/applications/slot-1`, candidature("bourse")), 403);
// Grille A : la messagerie est comprise dans les TROIS offres préinscription.
attendre("réponse messagerie acceptée pour Diagnostic France (grille A)", await creerCommeEtudiant(UID_DIAG, `users/${UID_DIAG}/messages/m1`, { text: "Bonjour", fromStudent: true, createdAt: new Date().toISOString(), read: false }), 200);
attendre("le diagnostic peut s'enregistrer (users.diagnosticFrance)", await patchCommeEtudiant(UID_DIAG, `users/${UID_DIAG}`, { diagnosticFrance: { atteint: true } }), 200);

const message = { text: "Bonjour", fromStudent: true, createdAt: new Date().toISOString(), read: false };
const revue = { text: "Relecture", applicationId: "slot-1", university: "Test", status: "nouveau", createdAt: new Date().toISOString() };
const signalement = (uid) => ({ uid, email: "t@fitz.local", name: "Test", sujet: "paiement", texte: "Mon paiement n'apparaît pas", page: "/messages.html", status: "nouveau", createdAt: new Date().toISOString() });

console.log("\n=== Grille A — les paliers bourses révisés ===");
console.log("Essentiel (essentiel-4) :");
for (let n = 1; n <= 4; n++) attendre(`bourse slot-${n} acceptée`, await creerCommeEtudiant(UID_ESS4, `users/${UID_ESS4}/applications/slot-${n}`, candidature("bourse")), 200);
attendre("la 5e (slot-5) est refusée", await creerCommeEtudiant(UID_ESS4, `users/${UID_ESS4}/applications/slot-5`, candidature("bourse")), 403);
// La messagerie est ouverte à TOUS les comptes depuis le 2026-09-23.
attendre("messagerie acceptée (ouverte à tous depuis le 2026-09-23)", await creerCommeEtudiant(UID_ESS4, `users/${UID_ESS4}/messages/m1`, message), 200);
attendre("demande conseiller refusée", await creerCommeEtudiant(UID_ESS4, `users/${UID_ESS4}/advisorRequests/r1`, revue), 403);
attendre("« Signaler un problème » accepté", await creerCommeEtudiant(UID_ESS4, `supportTickets/t-${UID_ESS4}`, signalement(UID_ESS4)), 200);
attendre("un signalement déguisé (status traite) est refusé", await creerCommeEtudiant(UID_ESS4, `supportTickets/t2-${UID_ESS4}`, { ...signalement(UID_ESS4), status: "traite" }), 403);
attendre("un signalement au nom d'un autre compte est refusé", await creerCommeEtudiant(UID_ESS4, `supportTickets/t3-${UID_ESS4}`, signalement(UID_CONS6)), 403);

console.log("Conseiller (conseiller-6) :");
for (let n = 1; n <= 6; n++) attendre(`bourse slot-${n} acceptée`, await creerCommeEtudiant(UID_CONS6, `users/${UID_CONS6}/applications/slot-${n}`, candidature("bourse")), 200);
attendre("la 7e (slot-7) est refusée", await creerCommeEtudiant(UID_CONS6, `users/${UID_CONS6}/applications/slot-7`, candidature("bourse")), 403);
attendre("messagerie acceptée", await creerCommeEtudiant(UID_CONS6, `users/${UID_CONS6}/messages/m1`, message), 200);
attendre("demande conseiller acceptée", await creerCommeEtudiant(UID_CONS6, `users/${UID_CONS6}/advisorRequests/r1`, revue), 200);
attendre("« Signaler un problème » accepté", await creerCommeEtudiant(UID_CONS6, `supportTickets/t-${UID_CONS6}`, signalement(UID_CONS6)), 200);

console.log("ANCIENNES FORMULES (supprimées le 2026-09-24) — elles n'ouvrent plus rien :");
attendre("ancien Essentiel : slot-1 refusé", await creerCommeEtudiant(UID_ESS_ANCIEN, `users/${UID_ESS_ANCIEN}/applications/slot-1`, candidature("bourse")), 403);
attendre("ancien Essentiel : messagerie acceptée (droit du compte, pas de la formule)", await creerCommeEtudiant(UID_ESS_ANCIEN, `users/${UID_ESS_ANCIEN}/messages/m1`, message), 200);
attendre("ancien Essentiel : « Signaler un problème » refusé", await creerCommeEtudiant(UID_ESS_ANCIEN, `supportTickets/t-${UID_ESS_ANCIEN}`, signalement(UID_ESS_ANCIEN)), 403);
attendre("ancienne Signature : slot-1 refusé", await creerCommeEtudiant(UID_SIGNATURE, `users/${UID_SIGNATURE}/applications/slot-1`, candidature("bourse")), 403);
attendre("ancienne Signature : demande conseiller refusée", await creerCommeEtudiant(UID_SIGNATURE, `users/${UID_SIGNATURE}/advisorRequests/r1`, revue), 403);

console.log("Premier Dossier, Pass Découverte, Gratuit :");
attendre("Premier Dossier : slot-1 accepté", await creerCommeEtudiant(UID_PREMIER, `users/${UID_PREMIER}/applications/slot-1`, candidature("bourse")), 200);
attendre("Premier Dossier : messagerie acceptée (ouverte à tous)", await creerCommeEtudiant(UID_PREMIER, `users/${UID_PREMIER}/messages/m1`, message), 200);
attendre("Premier Dossier : « Signaler un problème » accepté", await creerCommeEtudiant(UID_PREMIER, `supportTickets/t-${UID_PREMIER}`, signalement(UID_PREMIER)), 200);
attendre("Pass Découverte : « Signaler un problème » accepté", await creerCommeEtudiant(UID_PASS, `supportTickets/t-${UID_PASS}`, signalement(UID_PASS)), 200);
attendre("Pass Découverte : messagerie acceptée (ouverte à tous)", await creerCommeEtudiant(UID_PASS, `users/${UID_PASS}/messages/m1`, message), 200);
attendre("Gratuit : « Signaler un problème » REFUSÉ", await creerCommeEtudiant(UID_GRATUIT, `supportTickets/t-${UID_GRATUIT}`, signalement(UID_GRATUIT)), 403);
attendre("Gratuit : messagerie acceptée (ouverte à tous)", await creerCommeEtudiant(UID_GRATUIT, `users/${UID_GRATUIT}/messages/m1`, message), 200);
attendre("Gratuit : aucune candidature", await creerCommeEtudiant(UID_GRATUIT, `users/${UID_GRATUIT}/applications/slot-1`, candidature("bourse")), 403);
attendre("Diagnostic seul : « Signaler un problème » accepté", await creerCommeEtudiant(UID_DIAG, `supportTickets/t-${UID_DIAG}`, signalement(UID_DIAG)), 200);

console.log("\n=== E1 — la preuve de dépôt (firestore.rules) ===");
const UID_E1 = `rejeu-depot-${T}`;
await admin.doc(`users/${UID_E1}`).set({ uid: UID_E1, name: "Preuve de dépôt", plan: "conseiller-6", planExpiresAt: dans(200) });
// Une candidature ANCIENNE, déjà déposée sans preuve (écrite par l'admin SDK, comme avant le lot).
await admin.doc(`users/${UID_E1}/applications/slot-6`).set({ university: "Ancienne", status: "deposee", notes: "" });
attendre("création en préparation, sans preuve : acceptée", await creerCommeEtudiant(UID_E1, `users/${UID_E1}/applications/slot-1`, candidature("bourse")), 200);
// LOT ACCEPTATION : `candidature("bourse")` porte IDENTITE, donc un
// programId — ce sont des cartes catalogue, et le dépôt SUIT
// l'acceptation. Les cas E1 acceptent donc la carte d'abord (attente
// changée, voulue : un dépôt sur une carte proposée est refusé).
attendre("ACCEPTATION : déposer une carte proposée (non acceptée), même avec preuve : refusé", await patchCommeEtudiant(UID_E1, `users/${UID_E1}/applications/slot-1`, { status: "deposee", preuveDepot: { mode: "numero", numeroDossier: "EF-0", deposeLe: "2026-09-07" } }), 403);
attendre("ACCEPTATION : accepter slot-1 (accepteeLe = heure du serveur) : accepté", await accepterCommeEtudiant(UID_E1, `users/${UID_E1}/applications/slot-1`), 200);
attendre("passage en deposee SANS preuve : refusé", await patchCommeEtudiant(UID_E1, `users/${UID_E1}/applications/slot-1`, { status: "deposee" }), 403);
attendre("passage en deposee avec une preuve mal formée (mode inconnu) : refusé", await patchCommeEtudiant(UID_E1, `users/${UID_E1}/applications/slot-1`, { status: "deposee", preuveDepot: { mode: "ocr", numeroDossier: "1", deposeLe: "2026-09-07" } }), 403);
attendre("passage en deposee, numero sans numéro : refusé", await patchCommeEtudiant(UID_E1, `users/${UID_E1}/applications/slot-1`, { status: "deposee", preuveDepot: { mode: "numero", deposeLe: "2026-09-07" } }), 403);
attendre("passage en deposee, date mal formée : refusé", await patchCommeEtudiant(UID_E1, `users/${UID_E1}/applications/slot-1`, { status: "deposee", preuveDepot: { mode: "numero", numeroDossier: "1", deposeLe: "07/09/2026" } }), 403);
attendre("passage en deposee, capture hors du dossier de la candidature : refusé", await patchCommeEtudiant(UID_E1, `users/${UID_E1}/applications/slot-1`, { status: "deposee", preuveDepot: { mode: "capture", fichier: `users/${UID_E1}/applications/slot-2/preuve-depot.jpg`, deposeLe: "2026-09-07" } }), 403);
attendre("passage en deposee AVEC preuve numero : accepté", await patchCommeEtudiant(UID_E1, `users/${UID_E1}/applications/slot-1`, { status: "deposee", preuveDepot: { mode: "numero", numeroDossier: "EF-1", deposeLe: "2026-09-07" } }), 200);
attendre("création en préparation (slot-2)", await creerCommeEtudiant(UID_E1, `users/${UID_E1}/applications/slot-2`, candidature("bourse")), 200);
// Accepter ET déposer dans la MÊME écriture : accepté (accepteeLe = heure du serveur).
attendre("passage en en_attente AVEC preuve capture, en acceptant dans la même écriture : accepté", await accepterCommeEtudiant(UID_E1, `users/${UID_E1}/applications/slot-2`, { status: "en_attente", preuveDepot: { mode: "capture", fichier: `users/${UID_E1}/applications/slot-2/preuve-depot.jpg`, deposeLe: "2026-09-06" } }), 200);
attendre("création en préparation (slot-3)", await creerCommeEtudiant(UID_E1, `users/${UID_E1}/applications/slot-3`, candidature("bourse")), 200);
attendre("accepter slot-3", await accepterCommeEtudiant(UID_E1, `users/${UID_E1}/applications/slot-3`), 200);
attendre("passage en deposee AVEC preuve transmis (numéro) : accepté", await patchCommeEtudiant(UID_E1, `users/${UID_E1}/applications/slot-3`, { status: "deposee", preuveDepot: { mode: "transmis", numeroDossier: "REF-AMB", deposeLe: "2026-09-06" } }), 200);
attendre("création DIRECTE en deposee sans preuve : refusée", await creerCommeEtudiant(UID_E1, `users/${UID_E1}/applications/slot-4`, { ...candidature("bourse"), status: "deposee" }), 403);
// ATTENTE CHANGÉE (lot ACCEPTATION) : une carte catalogue naît PROPOSÉE — jamais déjà « admise ».
attendre("création directe en admise avec preuve : REFUSÉE (une carte naît proposée)", await creerCommeEtudiant(UID_E1, `users/${UID_E1}/applications/slot-4`, { ...candidature("bourse"), status: "admise", preuveDepot: { mode: "numero", numeroDossier: "X", deposeLe: "2026-08-01" } }), 403);
attendre("NON-RÉGRESSION : candidature déjà deposee sans preuve, modification des notes acceptée", await patchCommeEtudiant(UID_E1, `users/${UID_E1}/applications/slot-6`, { notes: "mise à jour", nextCheckDate: "2026-10-01" }), 200);
attendre("NON-RÉGRESSION : même candidature, réécriture du même statut sans preuve (status inchangé) acceptée", await patchCommeEtudiant(UID_E1, `users/${UID_E1}/applications/slot-6`, { status: "deposee", notes: "encore" }), 200);
attendre("mais passer cette ancienne candidature en en_attente sans preuve : refusé (transition)", await patchCommeEtudiant(UID_E1, `users/${UID_E1}/applications/slot-6`, { status: "en_attente" }), 403);
attendre("une preuve mal formée écrite seule (sans changer le statut) : refusée", await patchCommeEtudiant(UID_E1, `users/${UID_E1}/applications/slot-1`, { preuveDepot: { mode: "numero", deposeLe: "2026-09-07" } }), 403);
attendre("redescendre en en_cours (statut non déposé) : accepté sans preuve", await patchCommeEtudiant(UID_E1, `users/${UID_E1}/applications/slot-6`, { status: "en_cours" }), 200);

console.log("\n=== FITZ-CHOISIT — c'est Fitz qui choisit (firestore.rules) ===");
const UID_FC = `rejeu-fitz-choisit-${T}`;
await admin.doc(`users/${UID_FC}`).set({ uid: UID_FC, name: "Fitz choisit", plan: "essentiel-4", planExpiresAt: dans(200), planPreinscription: "dossier-france", planPreinscriptionExpiresAt: dans(200) });
// Une candidature ANCIENNE, sans programId (écrite par l'admin SDK, comme avant le lot).
await admin.doc(`users/${UID_FC}/applications/slot-4`).set({ university: "Université de Nulle Part", status: "a_preparer", notes: "" });
attendre("création d'un créneau bourse avec une université en texte libre, sans programId : refusée", await creerCommeEtudiant(UID_FC, `users/${UID_FC}/applications/slot-1`, { university: "Université de Nulle Part", scholarship: "Bourse maison", status: "a_preparer", track: "bourse" }), 403);
attendre("création avec un programId inconnu du catalogue : refusée", await creerCommeEtudiant(UID_FC, `users/${UID_FC}/applications/slot-1`, { ...IDENTITE, programId: "inexistant", status: "a_preparer", track: "bourse" }), 403);
attendre("création avec un programId valide mais un scholarshipId incohérent : refusée", await creerCommeEtudiant(UID_FC, `users/${UID_FC}/applications/slot-1`, { ...IDENTITE, scholarshipId: "autre-bourse", status: "a_preparer", track: "bourse" }), 403);
attendre("création avec un programId valide mais un nom d'université libre : refusée", await creerCommeEtudiant(UID_FC, `users/${UID_FC}/applications/slot-1`, { ...IDENTITE, university: "Mon université à moi", status: "a_preparer", track: "bourse" }), 403);
attendre("création avec un programId valide et cohérent : acceptée", await creerCommeEtudiant(UID_FC, `users/${UID_FC}/applications/slot-1`, { ...IDENTITE, status: "a_preparer", track: "bourse", isRecommendation: true }), 200);
attendre("modification du nom de l'université : refusée", await patchCommeEtudiant(UID_FC, `users/${UID_FC}/applications/slot-1`, { university: "Autre nom" }), 403);
attendre("modification du portail seul (identité incohérente ailleurs ? non — cohérente) : acceptée", await patchCommeEtudiant(UID_FC, `users/${UID_FC}/applications/slot-1`, { portalUrl: "https://portail.test" }), 200);
// ATTENTE CHANGÉE (lot ACCEPTATION) : un remplacement est un REFUS, il incrémente `refus`.
attendre("remplacement avec un programId valide SANS incrémenter refus : REFUSÉ (lot ACCEPTATION)", await patchCommeEtudiant(UID_FC, `users/${UID_FC}/applications/slot-1`, { ...IDENTITE_2, status: "a_preparer", deadline: null, checklist: [], isRecommendation: true }), 403);
attendre("remplacement avec un programId valide (carte neuve), refus 0→1 : accepté", await patchCommeEtudiant(UID_FC, `users/${UID_FC}/applications/slot-1`, { ...IDENTITE_2, status: "a_preparer", deadline: null, checklist: [], isRecommendation: true, refus: 1 }), 200);
attendre("remplacement vers un programme inconnu : refusé", await patchCommeEtudiant(UID_FC, `users/${UID_FC}/applications/slot-1`, { university: "X", programId: "inexistant", scholarshipId: BOURSE, universityId: AUTRE_UNI, refus: 2 }), 403);
attendre("changement de statut, notes et date sur la carte choisie par Fitz : accepté", await patchCommeEtudiant(UID_FC, `users/${UID_FC}/applications/slot-1`, { status: "en_cours", notes: "j'avance", deadline: "2027-01-15" }), 200);
attendre("changement de statut sur une ancienne carte sans programId : accepté", await patchCommeEtudiant(UID_FC, `users/${UID_FC}/applications/slot-4`, { status: "en_cours", notes: "ancienne" }), 200);
attendre("mais renommer l'université d'une ancienne carte sans programId : refusé", await patchCommeEtudiant(UID_FC, `users/${UID_FC}/applications/slot-4`, { university: "Encore une autre" }), 403);
// Lot ACCEPTATION : le rattrapage pose aussi accepteeLe (heure du serveur) — la carte a été choisie par l'étudiant avant la doctrine.
attendre("rattrapage de liaison (programId + scholarshipId cohérents, sans nom) sur une ancienne carte, avec accepteeLe : accepté", await accepterCommeEtudiant(UID_FC, `users/${UID_FC}/applications/slot-4`, { programId: PROG, scholarshipId: BOURSE, catalogueLieLe: new Date().toISOString() }), 200);
attendre("vœu pre-N saisi à la main : accepté", await creerCommeEtudiant(UID_FC, `users/${UID_FC}/applications/pre-1`, { university: "Université de Bordeaux", status: "a_preparer", track: "preinscription", checklist: [], reminderFrequency: 14 }), 200);
attendre("renommer l'université d'un vœu pre-N : accepté (hors lot)", await patchCommeEtudiant(UID_FC, `users/${UID_FC}/applications/pre-1`, { university: "Université de Lille" }), 200);
attendre("l'étudiant mémorise un refus (users.universitesRefusees) : accepté", await patchCommeEtudiant(UID_FC, `users/${UID_FC}`, { universitesRefusees: [UNI] }), 200);

console.log("\n=== ACCEPTATION — l'étudiant accepte le choix de Fitz (firestore.rules) ===");
// Les comptes : essentiel-4 (UID_ESS4, 4 cartes slot-1..4) et conseiller-6
// (UID_CONS6, 6 cartes slot-1..6), semés plus haut.
const A = (n) => `users/${UID_ESS4}/applications/slot-${n}`;
const R = (n) => `users/${UID_CONS6}/applications/slot-${n}`;
const preuve = { mode: "numero", numeroDossier: "ACC-1", deposeLe: "2026-09-07" };

console.log("Le parcours et la clé ne bougent pas :");
attendre("passer une carte catalogue en track:preinscription : refusé", await patchCommeEtudiant(UID_ESS4, A(1), { track: "preinscription" }), 403);
attendre("retirer le programId d'une carte catalogue : refusé", await patchCommeEtudiant(UID_ESS4, A(1), { programId: null }), 403);
attendre("vider le programId d'une carte catalogue : refusé", await patchCommeEtudiant(UID_ESS4, A(1), { programId: "" }), 403);

console.log("Une bourse fermée ne se choisit pas :");
await admin.doc(`scholarships/${BOURSE_FERMEE}`).set({ title: "Bourse qui ferme", isActive: false });
const UID_ACC = `rejeu-acceptation-${T}`;
await admin.doc(`users/${UID_ACC}`).set({ uid: UID_ACC, name: "Acceptation", plan: "conseiller-6" });
const C = (n) => `users/${UID_ACC}/applications/slot-${n}`;
attendre("créer une carte vers une bourse isActive:false : refusé", await creerCommeEtudiant(UID_ACC, C(1), { ...IDENTITE_FERMEE, status: "a_preparer", track: "bourse" }), 403);
await admin.doc(`scholarships/${BOURSE_FERMEE}`).set({ title: "Bourse qui ferme", isActive: true });
attendre("(témoin) la même carte, bourse rouverte : acceptée", await creerCommeEtudiant(UID_ACC, C(1), { ...IDENTITE_FERMEE, status: "a_preparer", track: "bourse" }), 200);
await admin.doc(`scholarships/${BOURSE_FERMEE}`).set({ title: "Bourse qui ferme", isActive: false });
attendre("refuser VERS un programme dont la bourse est isActive:false : refusé", await patchCommeEtudiant(UID_ESS4, A(1), { ...IDENTITE_FERMEE, refus: 1 }), 403);

console.log("Une carte naît proposée :");
attendre("créer une carte avec accepteeLe : refusé", await creerCommeEtudiant(UID_ACC, C(2), { ...candidature("bourse"), accepteeLe: new Date().toISOString() }), 403);
attendre("créer une carte avec refus:1 : refusé", await creerCommeEtudiant(UID_ACC, C(2), { ...candidature("bourse"), refus: 1 }), 403);
attendre("créer une carte déjà « admise » (avec preuve) : refusé", await creerCommeEtudiant(UID_ACC, C(2), { ...candidature("bourse"), status: "admise", preuveDepot: preuve }), 403);
attendre("(témoin) créer la carte proposée, refus:0 : acceptée", await creerCommeEtudiant(UID_ACC, C(2), { ...candidature("bourse"), refus: 0 }), 200);

console.log("Accepter, c'est définitif :");
attendre("accepter avec une date choisie par le client : refusé", await patchCommeEtudiant(UID_ESS4, A(1), { accepteeLe: "2026-09-11T10:00:00.000Z" }), 403);
attendre("accepter (accepteeLe = heure du serveur) : accepté", await accepterCommeEtudiant(UID_ESS4, A(1)), 200);
attendre("changer accepteeLe (nouvelle heure du serveur) : refusé", await accepterCommeEtudiant(UID_ESS4, A(1)), 403);
attendre("effacer accepteeLe : refusé", await patchAvecHeureServeur(UID_ESS4, A(1), {}, [], ["accepteeLe"]), 403);
attendre("changer le choix d'une carte acceptée (refus 0→1) : refusé", await patchCommeEtudiant(UID_ESS4, A(1), { ...IDENTITE_2, refus: 1 }), 403);
attendre("modifier seulement portalUrl d'une carte acceptée : accepté", await patchCommeEtudiant(UID_ESS4, A(1), { portalUrl: "https://portail.acceptee.test" }), 200);

console.log("Le dépôt suit l'acceptation :");
attendre("déposer une carte non acceptée (slot-2), avec preuve : refusé", await patchCommeEtudiant(UID_ESS4, A(2), { status: "deposee", preuveDepot: preuve }), 403);
attendre("déposer en acceptant dans la même écriture (slot-2) : accepté", await accepterCommeEtudiant(UID_ESS4, A(2), { status: "deposee", preuveDepot: preuve }), 200);
attendre("faire redescendre une carte catalogue déposée en en_cours : refusé", await patchCommeEtudiant(UID_ESS4, A(2), { status: "en_cours" }), 403);
attendre("(témoin) avancer une carte déposée vers admise : accepté", await patchCommeEtudiant(UID_ESS4, A(2), { status: "admise" }), 200);

console.log("Deux refus par place, pas plus :");
attendre("1er refus (refus 0→1, slot-3 → université 2) : accepté", await patchCommeEtudiant(UID_ESS4, A(3), { ...IDENTITE_2, status: "a_preparer", checklist: [], refus: 1 }), 200);
attendre("refus sans incrément (refus 1→1) : refusé", await patchCommeEtudiant(UID_ESS4, A(3), { ...IDENTITE_3, refus: 1 }), 403);
attendre("refus qui baisse (refus 1→0) : refusé", await patchCommeEtudiant(UID_ESS4, A(3), { ...IDENTITE_3, refus: 0 }), 403);
attendre("refus modifié seul, sans changement du choix (1→2) : refusé", await patchCommeEtudiant(UID_ESS4, A(3), { refus: 2 }), 403);
attendre("2e refus (refus 1→2, → université 3) : accepté", await patchCommeEtudiant(UID_ESS4, A(3), { ...IDENTITE_3, status: "a_preparer", checklist: [], refus: 2 }), 200);
attendre("3e refus (refus 2→3) : refusé — Fitz a fait sa proposition finale", await patchCommeEtudiant(UID_ESS4, A(3), { ...IDENTITE, refus: 3 }), 403);
attendre("(témoin) accepter la proposition finale : accepté", await accepterCommeEtudiant(UID_ESS4, A(3)), 200);

console.log("L'exception catalogue — l'organisme ferme la bourse :");
// slot-1 du compte Acceptation vise la bourse fermée (créée pendant qu'elle était ouverte) : on l'accepte, puis la bourse ferme.
attendre("accepter la carte vers la bourse (rouverte le temps de l'accepter)", await (async () => { await admin.doc(`scholarships/${BOURSE_FERMEE}`).set({ title: "Bourse qui ferme", isActive: true }); const s = await accepterCommeEtudiant(UID_ACC, C(1)); await admin.doc(`scholarships/${BOURSE_FERMEE}`).set({ title: "Bourse qui ferme", isActive: false }); return s; })(), 200);
attendre("remplacer une carte acceptée non déposée, bourse fermée, refus inchangé, accepteeLe retiré : accepté", await patchAvecHeureServeur(UID_ACC, C(1), { ...IDENTITE_2, status: "a_preparer", checklist: [], refus: 0 }, [], ["accepteeLe"]), 200);
attendre("(après remplacement) la carte est proposée : un refus normal 0→1 passe", await patchCommeEtudiant(UID_ACC, C(1), { ...IDENTITE_3, refus: 1 }), 200);
// Le même cas sur une carte DÉPOSÉE : slot-2 du compte Acceptation, acceptée et déposée vers la bourse fermée.
await admin.doc(`users/${UID_ACC}/applications/slot-3`).set({ ...IDENTITE_FERMEE, status: "deposee", track: "bourse", refus: 0, accepteeLe: new Date(), preuveDepot: preuve });
attendre("même remplacement sur une carte DÉPOSÉE : refusé", await patchAvecHeureServeur(UID_ACC, C(3), { ...IDENTITE_2, refus: 0 }, [], ["accepteeLe"]), 403);
attendre("un refus (refus 0→1) vers une carte proposée dont la bourse est fermée n'est pas un refus : refusé", await (async () => { await admin.doc(`users/${UID_ACC}/applications/slot-4`).set({ ...IDENTITE_FERMEE, status: "a_preparer", track: "bourse", refus: 0 }); return patchCommeEtudiant(UID_ACC, C(4), { ...IDENTITE_2, refus: 1 }); })(), 403);
attendre("(témoin) la remplaçante, refus inchangé : acceptée", await patchCommeEtudiant(UID_ACC, C(4), { ...IDENTITE_2, refus: 0 }), 200);

console.log("Finitions (2026-09-21) — la fenêtre du bac, remplacement sans refus :");
const BOURSE_BAC = `rejeu-bourse-bac-${T}`;
const PROG_BAC = `rejeu-prog-bac-${T}`;
await admin.doc(`scholarships/${BOURSE_BAC}`).set({ title: "Bourse des bacheliers", isActive: true, anneeBacMin: 2026 });
await admin.doc(`programs/${PROG_BAC}`).set({ universityId: UNI, scholarshipId: BOURSE_BAC, level: "Licence" });
const IDENTITE_BAC = { university: "Université de test", scholarship: "Bourse des bacheliers", scholarshipId: BOURSE_BAC, programId: PROG_BAC, universityId: UNI };
const UID_BAC = `rejeu-fenetre-bac-${T}`;
const B = (n) => `users/${UID_BAC}/applications/slot-${n}`;
await admin.doc(`users/${UID_BAC}`).set({ uid: UID_BAC, name: "Bachelière 2022", plan: "conseiller-6", profile: { palier: "bac_obtenu", graduationYear: "2022" } });
await admin.doc(B(1)).set({ ...IDENTITE_BAC, status: "a_preparer", track: "bourse", refus: 0 });
attendre("bac 2022, bourse anneeBacMin 2026 : remplacer sans refus (refus 0→0) : accepté", await patchCommeEtudiant(UID_BAC, B(1), { ...IDENTITE_2, status: "a_preparer", checklist: [], refus: 0 }), 200);
await admin.doc(B(2)).set({ ...IDENTITE_BAC, status: "a_preparer", track: "bourse", refus: 0 });
await admin.doc(`users/${UID_BAC}`).set({ uid: UID_BAC, name: "Bachelière 2026", plan: "conseiller-6", profile: { palier: "bac_obtenu", graduationYear: "2026" } });
attendre("bac 2026 (dans la fenêtre) : remplacer sans refus : refusé", await patchCommeEtudiant(UID_BAC, B(2), { ...IDENTITE_2, refus: 0 }), 403);
attendre("(témoin) bac 2026 : un refus normal 0→1 passe toujours", await patchCommeEtudiant(UID_BAC, B(2), { ...IDENTITE_2, status: "a_preparer", checklist: [], refus: 1 }), 200);
await admin.doc(`users/${UID_BAC}`).set({ uid: UID_BAC, name: "Étudiante en licence", plan: "conseiller-6", profile: { palier: "licence_en_cours" } });
await admin.doc(B(3)).set({ ...IDENTITE_BAC, status: "deposee", track: "bourse", refus: 0, accepteeLe: new Date(), preuveDepot: preuve });
attendre("carte DÉPOSÉE hors fenêtre : remplacer sans refus : refusé", await patchAvecHeureServeur(UID_BAC, B(3), { ...IDENTITE_2, refus: 0 }, [], ["accepteeLe"]), 403);
await admin.doc(B(4)).set({ ...IDENTITE, status: "a_preparer", track: "bourse", refus: 0 });
attendre("bourse SANS anneeBacMin : remplacer sans refus : refusé", await patchCommeEtudiant(UID_BAC, B(4), { ...IDENTITE_2, refus: 0 }), 403);
for (const n of [1, 2, 3, 4]) await admin.doc(B(n)).delete();
await admin.doc(`users/${UID_BAC}`).delete();
await admin.doc(`programs/${PROG_BAC}`).delete();
await admin.doc(`scholarships/${BOURSE_BAC}`).delete();

console.log("La suppression :");
attendre("essentiel-4 : supprimer une carte catalogue proposée (slot-4) : refusé", await supprimerCommeEtudiant(UID_ESS4, A(4)), 403);
attendre("essentiel-4 : supprimer une carte catalogue acceptée « admise » (slot-2) : refusé", await supprimerCommeEtudiant(UID_ESS4, A(2)), 403);
// L'acceptation est VÉRIFIÉE avant chaque suppression : un 403 de
// suppression ne prouve rien si la carte n'a jamais été acceptée.
attendre("conseiller-6 : accepter une carte « à préparer » : accepté", await accepterCommeEtudiant(UID_CONS6, R(1)), 200);
attendre("conseiller-6 : supprimer une carte acceptée « à préparer » : refusé", await supprimerCommeEtudiant(UID_CONS6, R(1)), 403);
attendre("conseiller-6 : accepter une carte avec sa réponse « refusee » : accepté", await accepterCommeEtudiant(UID_CONS6, R(2), { status: "refusee", preuveDepot: preuve }), 200);
attendre("conseiller-6 : supprimer une carte acceptée « refusee » : refusé (formule en vente)", await supprimerCommeEtudiant(UID_CONS6, R(2)), 403);
// Un compte SANS formule en vente (ici, une ancienne formule supprimée) garde
// le droit de retirer une carte acceptée qui a reçu sa réponse.
await admin.doc(`users/${UID_ESS_ANCIEN}/applications/slot-2`).set({ ...IDENTITE, status: "refusee", track: "bourse", refus: 0, accepteeLe: new Date(), preuveDepot: preuve });
attendre("compte sans formule en vente : supprimer une carte acceptée « refusee » : accepté", await supprimerCommeEtudiant(UID_ESS_ANCIEN, `users/${UID_ESS_ANCIEN}/applications/slot-2`), 200);
attendre("conseiller-6 : supprimer une carte proposée : refusé", await supprimerCommeEtudiant(UID_CONS6, R(3)), 403);

console.log("La liste des refus ne peut que grandir :");
attendre("allonger universitesRefusees : accepté", await patchCommeEtudiant(UID_FC, `users/${UID_FC}`, { universitesRefusees: [UNI, AUTRE_UNI] }), 200);
attendre("raccourcir universitesRefusees : refusé", await patchCommeEtudiant(UID_FC, `users/${UID_FC}`, { universitesRefusees: [UNI] }), 403);
attendre("vider universitesRefusees : refusé", await patchCommeEtudiant(UID_FC, `users/${UID_FC}`, { universitesRefusees: [] }), 403);
attendre("(témoin) le profil reste modifiable : accepté", await patchCommeEtudiant(UID_FC, `users/${UID_FC}`, { name: "Fitz choisit, renommé" }), 200);

console.log("Vœux pre-N : inchangé :");
attendre("vœu pre-N : créer", await creerCommeEtudiant(UID_FC, `users/${UID_FC}/applications/pre-2`, { university: "Université de Nantes", status: "a_preparer", track: "preinscription", checklist: [] }), 200);
attendre("vœu pre-N : modifier", await patchCommeEtudiant(UID_FC, `users/${UID_FC}/applications/pre-2`, { status: "en_cours", university: "Université de Rennes" }), 200);
attendre("vœu pre-N : supprimer", await supprimerCommeEtudiant(UID_FC, `users/${UID_FC}/applications/pre-2`), 200);

console.log("Les deux champs sont hors de portée de l'étudiant :");
attendre("planPreinscription refusé à l'étudiant", await patchCommeEtudiant(UID_BOURSE, `users/${UID_BOURSE}`, { planPreinscription: "dossier-france" }), 403);
attendre("planPreinscriptionExpiresAt refusé à l'étudiant", await patchCommeEtudiant(UID_BOURSE, `users/${UID_BOURSE}`, { planPreinscriptionExpiresAt: dans(400) }), 403);
attendre("plan refusé à l'étudiant (inchangé)", await patchCommeEtudiant(UID_BOURSE, `users/${UID_BOURSE}`, { plan: "signature" }), 403);

// LES NEUF PAYS DANS L'ADMIN (2026-09-24) : ce que la fiche étudiant
// écrit (admin/firebase-admin.js, attribuerFormuleManuellement, branche
// `pays`) — un champ imbriqué preinscriptionsPays.<pays> et la trace,
// dans UNE écriture. Le superAdmin passe ; l'admin ordinaire et
// l'étudiant, jamais.
console.log("L'admin pose une offre pays par pays :");
const UID_PROPRIO = `rejeu-proprio-${T}`;
const UID_ADMIN_ORD = `rejeu-admin-ordinaire-${T}`;
// La valeur du rôle vient de son module, jamais écrite en dur
// (test/roles-admin.test.mjs).
const { ROLE_ADMIN } = await import("../js/roles-admin.js");
await admin.doc(`admins/${UID_PROPRIO}`).set({ isActive: true, email: "proprio@rejeu.test" });
await admin.doc(`admins/${UID_ADMIN_ORD}`).set({ isActive: true, role: ROLE_ADMIN, email: "admin@rejeu.test" });
async function patchMasque(uid, chemin, champs, masque) {
  const q = masque.map((k) => `updateMask.fieldPaths=${encodeURIComponent(k)}`).join("&");
  const r = await fetch(`${BASE}/${chemin}?${q}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${jeton(uid)}` },
    body: JSON.stringify({ fields: Object.fromEntries(Object.entries(champs).map(([k, v]) => [k, versValeur(v)])) })
  });
  return r.status;
}
const offreChine = { preinscriptionsPays: { chine: { plan: "dossier-france-conseiller", expiresAt: dans(300) } }, attributionManuelle: { plan: null, planPreinscription: null, pays: { destination: "chine", plan: "dossier-france-conseiller" }, par: UID_PROPRIO, le: "2026-09-24" } };
const MASQUE_CHINE = ["preinscriptionsPays.chine", "attributionManuelle"];
attendre("superAdmin : poser Dossier Chine + Conseiller (et sa trace) : accepté", await patchMasque(UID_PROPRIO, `users/${UID_GRATUIT}`, offreChine, MASQUE_CHINE), 200);
const pose = (await admin.doc(`users/${UID_GRATUIT}`).get()).data();
attendre("superAdmin : l'offre Chine est bien écrite dans preinscriptionsPays.chine", pose.preinscriptionsPays && pose.preinscriptionsPays.chine && pose.preinscriptionsPays.chine.plan, "dossier-france-conseiller");
attendre("superAdmin : retirer l'offre Chine (champ effacé) : accepté", await patchMasque(UID_PROPRIO, `users/${UID_GRATUIT}`, { attributionManuelle: offreChine.attributionManuelle }, MASQUE_CHINE), 200);
attendre("superAdmin : l'offre Chine a bien disparu", ((await admin.doc(`users/${UID_GRATUIT}`).get()).data().preinscriptionsPays || {}).chine, undefined);
attendre("admin ordinaire : poser Dossier Chine : refusé", await patchMasque(UID_ADMIN_ORD, `users/${UID_GRATUIT}`, offreChine, MASQUE_CHINE), 403);
attendre("étudiant : s'offrir Dossier Chine : refusé", await patchMasque(UID_GRATUIT, `users/${UID_GRATUIT}`, { preinscriptionsPays: offreChine.preinscriptionsPays }, ["preinscriptionsPays.chine"]), 403);
await admin.doc(`admins/${UID_PROPRIO}`).delete();
await admin.doc(`admins/${UID_ADMIN_ORD}`).delete();

// AUDIT 2026-10 — le journal analytics et ses compteurs, ouverts à tous
// mais dans la forme exacte de js/analytics.js.
console.log("Audit 2026-10 — analytics :");
async function evenement(uid, champs, heureServeur = true) {
  const name = `projects/${PROJET}/databases/(default)/documents/analyticsEvents/rejeu-${T}-${Math.random().toString(36).slice(2)}`;
  const write = { update: { name, fields: Object.fromEntries(Object.entries(champs).map(([k, v]) => [k, versValeur(v)])) }, currentDocument: { exists: false } };
  if (heureServeur) write.updateTransforms = [{ fieldPath: "createdAt", setToServerValue: "REQUEST_TIME" }];
  const r = await fetch(`http://${HOTE}/v1/projects/${PROJET}/databases/(default)/documents:commit`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(uid ? { Authorization: `Bearer ${jeton(uid)}` } : {}) },
    body: JSON.stringify({ writes: [write] })
  });
  return r.status;
}
attendre("visiteur sans compte : événement de la forme du client : accepté", await evenement(null, { type: "page_view", uid: null, payload: { page: "/" }, clientTs: Date.now() }), 200);
attendre("étudiant : événement signé de son uid : accepté", await evenement(UID_GRATUIT, { type: "page_view", uid: UID_GRATUIT, payload: {}, clientTs: Date.now() }), 200);
attendre("visiteur sans compte : événement au nom d'un étudiant : refusé", await evenement(null, { type: "payment_completed", uid: UID_GRATUIT, payload: {}, clientTs: 1 }), 403);
attendre("étudiant : événement au nom d'un AUTRE étudiant : refusé", await evenement(UID_GRATUIT, { type: "page_view", uid: UID_CONS6, payload: {}, clientTs: 1 }), 403);
attendre("événement sans heure du serveur : refusé", await evenement(null, { type: "page_view", uid: null, payload: {}, clientTs: 1, createdAt: "2030-01-01" }, false), 403);
attendre("événement avec un champ de plus : refusé", await evenement(null, { type: "page_view", uid: null, payload: {}, clientTs: 1, admin: true }), 403);
await admin.doc("analyticsCounters/totals").set({ rejeu: 1 }, { merge: true });
const effacerCompteur = await fetch(`${BASE}/analyticsCounters/totals`, { method: "DELETE" });
attendre("visiteur sans compte : supprimer analyticsCounters/totals : refusé", effacerCompteur.status, 403);
const incrementer = await fetch(`http://${HOTE}/v1/projects/${PROJET}/databases/(default)/documents:commit`, {
  method: "POST", headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ writes: [{ transform: { document: `projects/${PROJET}/databases/(default)/documents/analyticsDailyCounters/rejeu-${T}`, fieldTransforms: [{ fieldPath: "visiteurs", increment: { integerValue: "1" } }] } }] })
});
attendre("visiteur sans compte : incrément d'un compteur (setDoc merge + increment) : accepté", incrementer.status, 200);
for (const d of (await admin.collection("analyticsEvents").get()).docs) if (d.id.startsWith(`rejeu-${T}`)) await d.ref.delete();
await admin.doc(`analyticsDailyCounters/rejeu-${T}`).delete();

// Nettoyage.
for (const d of [`programs/${PROG}`, `programs/${AUTRE_PROG}`, `programs/${PROG_FERME}`, `programs/${PROG_3}`, `universities/${UNI}`, `universities/${AUTRE_UNI}`, `universities/${UNI_3}`, `scholarships/${BOURSE}`, `scholarships/${BOURSE_FERMEE}`]) await admin.doc(d).delete();
for (const uid of [UID_BOURSE, UID_DOSSIER, UID_LES_DEUX, UID_DIAG, UID_ESS4, UID_CONS6, UID_ESS_ANCIEN, UID_PREMIER, UID_GRATUIT, UID_PASS, UID_SIGNATURE, UID_E1, UID_FC, UID_ACC]) {
  for (const sc of ["applications", "advisorRequests", "messages"]) {
    const snap = await admin.collection(`users/${uid}/${sc}`).get();
    for (const d of snap.docs) await d.ref.delete();
  }
  await admin.doc(`users/${uid}`).delete();
}
for (const d of (await admin.collection("supportTickets").where("uid", ">=", "rejeu-").where("uid", "<", "rejeu-\uf8ff").get()).docs) await d.ref.delete();

const ko = resultats.filter((r) => !r.ok);
console.log(`\n${resultats.length - ko.length}/${resultats.length} attentes tenues.`);
process.exit(ko.length ? 1 : 0);
