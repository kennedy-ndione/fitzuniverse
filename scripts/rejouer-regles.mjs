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
const dans = (jours) => new Date(Date.now() + jours * 86400000).toISOString();

await admin.doc(`users/${UID_BOURSE}`).set({ uid: UID_BOURSE, name: "Ambition seul", plan: "accompagnement", planExpiresAt: dans(200) });
await admin.doc(`users/${UID_DOSSIER}`).set({ uid: UID_DOSSIER, name: "Dossier France seul", planPreinscription: "dossier-france", planPreinscriptionExpiresAt: dans(200) });
await admin.doc(`users/${UID_LES_DEUX}`).set({ uid: UID_LES_DEUX, name: "Les deux", plan: "accompagnement", planExpiresAt: dans(200), planPreinscription: "dossier-france-conseiller", planPreinscriptionExpiresAt: dans(200) });
await admin.doc(`users/${UID_DIAG}`).set({ uid: UID_DIAG, name: "Diagnostic seul", planPreinscription: "diagnostic-france", planPreinscriptionExpiresAt: dans(10) });

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
attendre("réponse messagerie refusée", await creerCommeEtudiant(UID_DIAG, `users/${UID_DIAG}/messages/m1`, { text: "Bonjour", fromStudent: true, createdAt: new Date().toISOString(), read: false }), 403);
attendre("le diagnostic peut s'enregistrer (users.diagnosticFrance)", await patchCommeEtudiant(UID_DIAG, `users/${UID_DIAG}`, { diagnosticFrance: { atteint: true } }), 200);

console.log("Les deux champs sont hors de portée de l'étudiant :");
attendre("planPreinscription refusé à l'étudiant", await patchCommeEtudiant(UID_BOURSE, `users/${UID_BOURSE}`, { planPreinscription: "dossier-france" }), 403);
attendre("planPreinscriptionExpiresAt refusé à l'étudiant", await patchCommeEtudiant(UID_BOURSE, `users/${UID_BOURSE}`, { planPreinscriptionExpiresAt: dans(400) }), 403);
attendre("plan refusé à l'étudiant (inchangé)", await patchCommeEtudiant(UID_BOURSE, `users/${UID_BOURSE}`, { plan: "signature" }), 403);

// Nettoyage.
for (const uid of [UID_BOURSE, UID_DOSSIER, UID_LES_DEUX, UID_DIAG]) {
  for (const sc of ["applications", "advisorRequests", "messages"]) {
    const snap = await admin.collection(`users/${uid}/${sc}`).get();
    for (const d of snap.docs) await d.ref.delete();
  }
  await admin.doc(`users/${uid}`).delete();
}

const ko = resultats.filter((r) => !r.ok);
console.log(`\n${resultats.length - ko.length}/${resultats.length} attentes tenues.`);
process.exit(ko.length ? 1 : 0);
