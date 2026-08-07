// Crée un compte de test DANS L'ÉMULATEUR FIREBASE UNIQUEMENT — jamais
// sur le Firestore de production. Voir TESTING.md pour le mode d'emploi
// complet (lancer l'émulateur, exécuter ce script, se connecter dans le
// navigateur avec ?useEmulator=1).
//
// Garde-fou : le SDK Admin bascule vers l'émulateur seulement quand
// FIRESTORE_EMULATOR_HOST / FIREBASE_AUTH_EMULATOR_HOST sont définies
// (voir package.json, script "seed:emulator") — sans ces variables il
// se connecterait au vrai projet, donc ne jamais lancer ce fichier
// autrement que via `npm run seed:emulator`.

import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

if (!process.env.FIRESTORE_EMULATOR_HOST || !process.env.FIREBASE_AUTH_EMULATOR_HOST) {
console.error("Refus de continuer : FIRESTORE_EMULATOR_HOST / FIREBASE_AUTH_EMULATOR_HOST ne sont pas définies. Utilisez `npm run seed:emulator`, jamais `node scripts/seed-emulator.js` directement.");
process.exit(1);
}

// Doit correspondre exactement à `projectId` dans firebase-config.js —
// le client du navigateur s'y connecte toujours avec le VRAI projectId
// (seul l'hôte est redirigé vers l'émulateur par connectFirestoreEmulator/
// connectAuthEmulator) ; un projectId différent ici écrirait dans un
// espace de données séparé, jamais lu par l'app. Reste sans danger pour
// la prod : c'est FIRESTORE_EMULATOR_HOST/FIREBASE_AUTH_EMULATOR_HOST
// (vérifiées plus haut) qui redirigent réellement le trafic, pas ce nom.
const PROJECT_ID = "scholarbridge-e0d84";

const TEST_USER = {
email: "test.essentiel@scholarbridge.local",
password: "TestEssentiel123!",
plan: "essentiel" // quota attendu : 3 candidatures accompagnées (voir js/plan-features.js)
};

initializeApp({ projectId: PROJECT_ID });

const auth = getAuth();
const db = getFirestore();

async function main() {

let uid;
try {
const existing = await auth.getUserByEmail(TEST_USER.email);
uid = existing.uid;
console.log(`Compte de test déjà présent dans l'émulateur (uid ${uid}), réutilisé.`);
} catch {
const created = await auth.createUser({
email: TEST_USER.email,
password: TEST_USER.password,
emailVerified: true
});
uid = created.uid;
console.log(`Compte de test créé dans l'émulateur Auth (uid ${uid}).`);
}

await db.collection("users").doc(uid).set({
name: "Testeur Essentiel",
email: TEST_USER.email,
plan: TEST_USER.plan,
planExpiresAt: null,
originCountry: "Sénégal",
currentDegree: "Licence",
createdAt: new Date().toISOString()
}, { merge: true });

console.log(`Profil Firestore écrit : users/${uid} (plan: ${TEST_USER.plan}).`);

// Repart d'un suivi de candidatures vide à chaque exécution du seed,
// pour que le test du quota (3 passent, la 4e bloque) soit toujours
// rejoué dans les mêmes conditions.
const appsSnap = await db.collection("users").doc(uid).collection("applications").get();
const batch = db.batch();
appsSnap.docs.forEach((d) => batch.delete(d.ref));
if (!appsSnap.empty) await batch.commit();
console.log(`users/${uid}/applications vidée (${appsSnap.size} document(s) retiré(s)).`);

console.log("\nPrêt : connectez-vous sur http://localhost:5173/login.html?useEmulator=1 avec");
console.log(` email    : ${TEST_USER.email}`);
console.log(` password : ${TEST_USER.password}`);
}

main().then(() => process.exit(0)).catch((err) => {
console.error(err);
process.exit(1);
});
