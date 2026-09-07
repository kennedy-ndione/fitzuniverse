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

const resultats = [];
function attendre(nom, obtenu, attendu) {
  const ok = obtenu === attendu;
  resultats.push({ nom, ok, obtenu, attendu });
  console.log(`  ${ok ? "OK " : "KO "} ${nom} → ${obtenu} (attendu ${attendu})`);
}

const T = Date.now();
const UID_BOURSE = `rejeu-ambition-${T}`;
const UID_DOSSIER = `rejeu-dossier-${T}`;
const UID_LES_DEUX = `rejeu-les-deux-${T}`;
const UID_DIAG = `rejeu-diagnostic-${T}`;
// Grille A (2026-09-07).
const UID_ESS4 = `rejeu-essentiel4-${T}`;
const UID_CONS6 = `rejeu-conseiller6-${T}`;
const UID_ESS_ANCIEN = `rejeu-essentiel-ancien-${T}`;
const UID_PREMIER = `rejeu-premier-dossier-${T}`;
const UID_GRATUIT = `rejeu-gratuit-${T}`;
const UID_PASS = `rejeu-pass-${T}`;
const UID_SIGNATURE = `rejeu-signature-${T}`;
const dans = (jours) => new Date(Date.now() + jours * 86400000).toISOString();

await admin.doc(`users/${UID_BOURSE}`).set({ uid: UID_BOURSE, name: "Ambition seul", plan: "accompagnement", planExpiresAt: dans(200) });
await admin.doc(`users/${UID_DOSSIER}`).set({ uid: UID_DOSSIER, name: "Dossier France seul", planPreinscription: "dossier-france", planPreinscriptionExpiresAt: dans(200) });
await admin.doc(`users/${UID_LES_DEUX}`).set({ uid: UID_LES_DEUX, name: "Les deux", plan: "accompagnement", planExpiresAt: dans(200), planPreinscription: "dossier-france-conseiller", planPreinscriptionExpiresAt: dans(200) });
await admin.doc(`users/${UID_DIAG}`).set({ uid: UID_DIAG, name: "Diagnostic seul", planPreinscription: "diagnostic-france", planPreinscriptionExpiresAt: dans(10) });
await admin.doc(`users/${UID_ESS4}`).set({ uid: UID_ESS4, name: "Essentiel 4", plan: "essentiel-4", planExpiresAt: dans(180) });
await admin.doc(`users/${UID_CONS6}`).set({ uid: UID_CONS6, name: "Conseiller 6", plan: "conseiller-6", planExpiresAt: dans(270) });
await admin.doc(`users/${UID_ESS_ANCIEN}`).set({ uid: UID_ESS_ANCIEN, name: "Essentiel ancien (5)", plan: "essentiel", planExpiresAt: dans(180) });
await admin.doc(`users/${UID_PREMIER}`).set({ uid: UID_PREMIER, name: "Premier Dossier", plan: "premier-dossier" });
await admin.doc(`users/${UID_GRATUIT}`).set({ uid: UID_GRATUIT, name: "Gratuit" });
await admin.doc(`users/${UID_PASS}`).set({ uid: UID_PASS, name: "Pass Découverte", fitzExpressExpiresAt: dans(14) });
await admin.doc(`users/${UID_SIGNATURE}`).set({ uid: UID_SIGNATURE, name: "Signature (ancienne)", plan: "signature", planExpiresAt: dans(365) });

const candidature = (track) => ({ university: "Université de test", status: "a_preparer", track, checklist: [], reminderFrequency: 14 });

console.log("\n=== Quotas par parcours (firestore.rules) ===");

console.log("Dossier France seul :");
for (let n = 1; n <= 7; n++) attendre(`pré-inscription pre-${n} acceptée`, await creerCommeEtudiant(UID_DOSSIER, `users/${UID_DOSSIER}/applications/pre-${n}`, candidature("preinscription")), 200);
attendre("la 8e préinscription (pre-8) est refusée", await creerCommeEtudiant(UID_DOSSIER, `users/${UID_DOSSIER}/applications/pre-8`, candidature("preinscription")), 403);
attendre("une bourse (slot-1) est refusée sur un compte Dossier France seul", await creerCommeEtudiant(UID_DOSSIER, `users/${UID_DOSSIER}/applications/slot-1`, candidature("bourse")), 403);
attendre("une préinscription sur un id slot-N est refusée", await creerCommeEtudiant(UID_DOSSIER, `users/${UID_DOSSIER}/applications/slot-2`, candidature("preinscription")), 403);

console.log("Ambition seul :");
attendre("une bourse slot-1 est acceptée", await creerCommeEtudiant(UID_BOURSE, `users/${UID_BOURSE}/applications/slot-1`, candidature("bourse")), 200);
attendre("une préinscription pre-1 est refusée sur un compte bourse seul", await creerCommeEtudiant(UID_BOURSE, `users/${UID_BOURSE}/applications/pre-1`, candidature("preinscription")), 403);
attendre("une préinscription déguisée en slot-2 est refusée", await creerCommeEtudiant(UID_BOURSE, `users/${UID_BOURSE}/applications/slot-2`, candidature("preinscription")), 403);
attendre("une candidature SANS track sur slot-2 passe (parcours bourse par défaut)", await creerCommeEtudiant(UID_BOURSE, `users/${UID_BOURSE}/applications/slot-2`, { university: "Sans track", status: "a_preparer" }), 200);

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
attendre("messagerie REFUSÉE (réservée au Conseiller côté bourses)", await creerCommeEtudiant(UID_ESS4, `users/${UID_ESS4}/messages/m1`, message), 403);
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

console.log("NON-RÉGRESSION — un ancien Essentiel (5) ne perd rien :");
for (let n = 1; n <= 5; n++) attendre(`bourse slot-${n} acceptée`, await creerCommeEtudiant(UID_ESS_ANCIEN, `users/${UID_ESS_ANCIEN}/applications/slot-${n}`, candidature("bourse")), 200);
attendre("la 6e (slot-6) est refusée, comme avant", await creerCommeEtudiant(UID_ESS_ANCIEN, `users/${UID_ESS_ANCIEN}/applications/slot-6`, candidature("bourse")), 403);
attendre("messagerie CONSERVÉE", await creerCommeEtudiant(UID_ESS_ANCIEN, `users/${UID_ESS_ANCIEN}/messages/m1`, message), 200);
attendre("« Signaler un problème » accepté", await creerCommeEtudiant(UID_ESS_ANCIEN, `supportTickets/t-${UID_ESS_ANCIEN}`, signalement(UID_ESS_ANCIEN)), 200);

console.log("NON-RÉGRESSION — Signature (ancienne) :");
attendre("bourse slot-13 acceptée (aucun plafond)", await creerCommeEtudiant(UID_SIGNATURE, `users/${UID_SIGNATURE}/applications/slot-13`, candidature("bourse")), 200);
attendre("messagerie conservée", await creerCommeEtudiant(UID_SIGNATURE, `users/${UID_SIGNATURE}/messages/m1`, message), 200);
attendre("demande conseiller conservée", await creerCommeEtudiant(UID_SIGNATURE, `users/${UID_SIGNATURE}/advisorRequests/r1`, revue), 200);

console.log("Premier Dossier, Pass Découverte, Gratuit :");
attendre("Premier Dossier : slot-1 accepté", await creerCommeEtudiant(UID_PREMIER, `users/${UID_PREMIER}/applications/slot-1`, candidature("bourse")), 200);
attendre("Premier Dossier : messagerie refusée", await creerCommeEtudiant(UID_PREMIER, `users/${UID_PREMIER}/messages/m1`, message), 403);
attendre("Premier Dossier : « Signaler un problème » accepté", await creerCommeEtudiant(UID_PREMIER, `supportTickets/t-${UID_PREMIER}`, signalement(UID_PREMIER)), 200);
attendre("Pass Découverte : « Signaler un problème » accepté", await creerCommeEtudiant(UID_PASS, `supportTickets/t-${UID_PASS}`, signalement(UID_PASS)), 200);
attendre("Pass Découverte : messagerie refusée", await creerCommeEtudiant(UID_PASS, `users/${UID_PASS}/messages/m1`, message), 403);
attendre("Gratuit : « Signaler un problème » REFUSÉ", await creerCommeEtudiant(UID_GRATUIT, `supportTickets/t-${UID_GRATUIT}`, signalement(UID_GRATUIT)), 403);
attendre("Gratuit : messagerie refusée", await creerCommeEtudiant(UID_GRATUIT, `users/${UID_GRATUIT}/messages/m1`, message), 403);
attendre("Gratuit : aucune candidature", await creerCommeEtudiant(UID_GRATUIT, `users/${UID_GRATUIT}/applications/slot-1`, candidature("bourse")), 403);
attendre("Diagnostic seul : « Signaler un problème » accepté", await creerCommeEtudiant(UID_DIAG, `supportTickets/t-${UID_DIAG}`, signalement(UID_DIAG)), 200);

console.log("\n=== E1 — la preuve de dépôt (firestore.rules) ===");
const UID_E1 = `rejeu-depot-${T}`;
await admin.doc(`users/${UID_E1}`).set({ uid: UID_E1, name: "Preuve de dépôt", plan: "conseiller-6", planExpiresAt: dans(200) });
// Une candidature ANCIENNE, déjà déposée sans preuve (écrite par l'admin SDK, comme avant le lot).
await admin.doc(`users/${UID_E1}/applications/slot-6`).set({ university: "Ancienne", status: "deposee", notes: "" });
attendre("création en préparation, sans preuve : acceptée", await creerCommeEtudiant(UID_E1, `users/${UID_E1}/applications/slot-1`, candidature("bourse")), 200);
attendre("passage en deposee SANS preuve : refusé", await patchCommeEtudiant(UID_E1, `users/${UID_E1}/applications/slot-1`, { status: "deposee" }), 403);
attendre("passage en deposee avec une preuve mal formée (mode inconnu) : refusé", await patchCommeEtudiant(UID_E1, `users/${UID_E1}/applications/slot-1`, { status: "deposee", preuveDepot: { mode: "ocr", numeroDossier: "1", deposeLe: "2026-09-07" } }), 403);
attendre("passage en deposee, numero sans numéro : refusé", await patchCommeEtudiant(UID_E1, `users/${UID_E1}/applications/slot-1`, { status: "deposee", preuveDepot: { mode: "numero", deposeLe: "2026-09-07" } }), 403);
attendre("passage en deposee, date mal formée : refusé", await patchCommeEtudiant(UID_E1, `users/${UID_E1}/applications/slot-1`, { status: "deposee", preuveDepot: { mode: "numero", numeroDossier: "1", deposeLe: "07/09/2026" } }), 403);
attendre("passage en deposee, capture hors du dossier de la candidature : refusé", await patchCommeEtudiant(UID_E1, `users/${UID_E1}/applications/slot-1`, { status: "deposee", preuveDepot: { mode: "capture", fichier: `users/${UID_E1}/applications/slot-2/preuve-depot.jpg`, deposeLe: "2026-09-07" } }), 403);
attendre("passage en deposee AVEC preuve numero : accepté", await patchCommeEtudiant(UID_E1, `users/${UID_E1}/applications/slot-1`, { status: "deposee", preuveDepot: { mode: "numero", numeroDossier: "EF-1", deposeLe: "2026-09-07" } }), 200);
attendre("création en préparation (slot-2)", await creerCommeEtudiant(UID_E1, `users/${UID_E1}/applications/slot-2`, candidature("bourse")), 200);
attendre("passage en en_attente AVEC preuve capture : accepté", await patchCommeEtudiant(UID_E1, `users/${UID_E1}/applications/slot-2`, { status: "en_attente", preuveDepot: { mode: "capture", fichier: `users/${UID_E1}/applications/slot-2/preuve-depot.jpg`, deposeLe: "2026-09-06" } }), 200);
attendre("création en préparation (slot-3)", await creerCommeEtudiant(UID_E1, `users/${UID_E1}/applications/slot-3`, candidature("bourse")), 200);
attendre("passage en deposee AVEC preuve transmis (numéro) : accepté", await patchCommeEtudiant(UID_E1, `users/${UID_E1}/applications/slot-3`, { status: "deposee", preuveDepot: { mode: "transmis", numeroDossier: "REF-AMB", deposeLe: "2026-09-06" } }), 200);
attendre("création DIRECTE en deposee sans preuve : refusée", await creerCommeEtudiant(UID_E1, `users/${UID_E1}/applications/slot-4`, { ...candidature("bourse"), status: "deposee" }), 403);
attendre("création directe en admise avec preuve : acceptée", await creerCommeEtudiant(UID_E1, `users/${UID_E1}/applications/slot-4`, { ...candidature("bourse"), status: "admise", preuveDepot: { mode: "numero", numeroDossier: "X", deposeLe: "2026-08-01" } }), 200);
attendre("NON-RÉGRESSION : candidature déjà deposee sans preuve, modification des notes acceptée", await patchCommeEtudiant(UID_E1, `users/${UID_E1}/applications/slot-6`, { notes: "mise à jour", nextCheckDate: "2026-10-01" }), 200);
attendre("NON-RÉGRESSION : même candidature, réécriture du même statut sans preuve (status inchangé) acceptée", await patchCommeEtudiant(UID_E1, `users/${UID_E1}/applications/slot-6`, { status: "deposee", notes: "encore" }), 200);
attendre("mais passer cette ancienne candidature en en_attente sans preuve : refusé (transition)", await patchCommeEtudiant(UID_E1, `users/${UID_E1}/applications/slot-6`, { status: "en_attente" }), 403);
attendre("une preuve mal formée écrite seule (sans changer le statut) : refusée", await patchCommeEtudiant(UID_E1, `users/${UID_E1}/applications/slot-1`, { preuveDepot: { mode: "numero", deposeLe: "2026-09-07" } }), 403);
attendre("redescendre en en_cours (statut non déposé) : accepté sans preuve", await patchCommeEtudiant(UID_E1, `users/${UID_E1}/applications/slot-6`, { status: "en_cours" }), 200);

console.log("Les deux champs sont hors de portée de l'étudiant :");
attendre("planPreinscription refusé à l'étudiant", await patchCommeEtudiant(UID_BOURSE, `users/${UID_BOURSE}`, { planPreinscription: "dossier-france" }), 403);
attendre("planPreinscriptionExpiresAt refusé à l'étudiant", await patchCommeEtudiant(UID_BOURSE, `users/${UID_BOURSE}`, { planPreinscriptionExpiresAt: dans(400) }), 403);
attendre("plan refusé à l'étudiant (inchangé)", await patchCommeEtudiant(UID_BOURSE, `users/${UID_BOURSE}`, { plan: "signature" }), 403);

// Nettoyage.
for (const uid of [UID_BOURSE, UID_DOSSIER, UID_LES_DEUX, UID_DIAG, UID_ESS4, UID_CONS6, UID_ESS_ANCIEN, UID_PREMIER, UID_GRATUIT, UID_PASS, UID_SIGNATURE, UID_E1]) {
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
