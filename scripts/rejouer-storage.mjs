// ============================================================
// scripts/rejouer-storage.mjs — rejoue storage.rules contre l'émulateur
// ============================================================
//
// Lot E1 (2026-09-07). Envoie de vrais octets sur l'émulateur Storage
// (REST v0, jeton non signé accepté par l'émulateur) et vérifie :
//   - le propriétaire écrit une capture (image, PDF) dans le dossier de
//     SA candidature ;
//   - un fichier trop gros (> 5 Mo) est refusé ;
//   - un type non accepté est refusé ;
//   - un AUTRE uid ne lit pas la capture, et n'écrit pas dans le dossier ;
//   - le reste de users/{uid}/ n'est pas inscriptible.
//
//     npm run emulators          (dans un autre terminal, avec storage)
//     node scripts/rejouer-storage.mjs
//
// Sort en code 1 si une attente n'est pas tenue. Ne tourne que contre
// l'émulateur (FIREBASE_STORAGE_EMULATOR_HOST).
// ============================================================

const HOTE = process.env.FIREBASE_STORAGE_EMULATOR_HOST || "localhost:9199";
if (/googleapis/.test(HOTE)) { console.error("Ce script ne tourne que contre l'émulateur."); process.exit(1); }
const PROJET = "scholarbridge-e0d84";
const BUCKET = `${PROJET}.firebasestorage.app`;
const BASE = `http://${HOTE}/v0/b/${BUCKET}/o`;

function jeton(uid, fournisseur = "password") {
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const t = Math.floor(Date.now() / 1000);
  return `${b64({ alg: "none", typ: "JWT" })}.${b64({ iss: `https://securetoken.google.com/${PROJET}`, aud: PROJET, sub: uid, user_id: uid, uid, iat: t, exp: t + 3600, auth_time: t, firebase: { sign_in_provider: fournisseur, identities: {} } })}.`;
}

async function envoyer(uid, chemin, octets, contentType, fournisseur) {
  const r = await fetch(`${BASE}?name=${encodeURIComponent(chemin)}&uploadType=media`, {
    method: "POST",
    headers: { "Content-Type": contentType, Authorization: `Firebase ${jeton(uid, fournisseur)}` },
    body: octets
  });
  return r.status;
}

async function lireFichier(uid, chemin) {
  const r = await fetch(`${BASE}/${encodeURIComponent(chemin)}?alt=media`, { headers: uid ? { Authorization: `Firebase ${jeton(uid)}` } : {} });
  return r.status;
}

async function supprimer(uid, chemin) {
  const r = await fetch(`${BASE}/${encodeURIComponent(chemin)}`, { method: "DELETE", headers: { Authorization: `Firebase ${jeton(uid)}` } });
  return r.status;
}

const resultats = [];
function attendre(nom, obtenu, attendus) {
  const ok = [].concat(attendus).includes(obtenu);
  resultats.push({ nom, ok });
  console.log(`  ${ok ? "OK " : "KO "} ${nom} → ${obtenu} (attendu ${[].concat(attendus).join(" ou ")})`);
}

const T = Date.now();
const PROPRIO = `rejeu-proprio-${T}`;
const AUTRE = `rejeu-autre-${T}`;
const chemin = `users/${PROPRIO}/applications/slot-1/preuve-depot.jpg`;
const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==", "base64");

console.log("\n=== storage.rules — la capture de dépôt ===");
attendre("le propriétaire envoie une image dans le dossier de sa candidature", await envoyer(PROPRIO, chemin, png, "image/png"), 200);
attendre("le propriétaire envoie un PDF", await envoyer(PROPRIO, `users/${PROPRIO}/applications/pre-1/preuve-depot.pdf`, Buffer.from("%PDF-1.4\n%%EOF"), "application/pdf"), 200);
attendre("un fichier de 6 Mo est refusé", await envoyer(PROPRIO, `users/${PROPRIO}/applications/slot-2/preuve-depot.jpg`, Buffer.alloc(6 * 1024 * 1024, 1), "image/jpeg"), 403);
attendre("un type non accepté (zip) est refusé", await envoyer(PROPRIO, `users/${PROPRIO}/applications/slot-3/preuve-depot.zip`, png, "application/zip"), 403);
attendre("le propriétaire relit sa capture", await lireFichier(PROPRIO, chemin), 200);
attendre("un AUTRE uid ne lit pas la capture", await lireFichier(AUTRE, chemin), 403);
attendre("un visiteur anonyme ne lit pas la capture", await lireFichier(null, chemin), [401, 403]);
attendre("un AUTRE uid n'écrit pas dans le dossier", await envoyer(AUTRE, `users/${PROPRIO}/applications/slot-1/autre.jpg`, png, "image/png"), 403);
attendre("le reste de users/{uid}/ n'est pas inscriptible", await envoyer(PROPRIO, `users/${PROPRIO}/libre.jpg`, png, "image/png"), 403);
attendre("hors de users/ : refusé", await envoyer(PROPRIO, `public/${T}.jpg`, png, "image/png"), 403);

// AUDIT 2026-10 : un fichier par candidature, jamais de SVG, jamais une
// session anonyme.
console.log("\n=== storage.rules — audit 2026-10 ===");
attendre("un nom libre dans le dossier de la candidature est refusé", await envoyer(PROPRIO, `users/${PROPRIO}/applications/slot-1/photo-${T}.jpg`, png, "image/png"), 403);
attendre("une image SVG est refusée", await envoyer(PROPRIO, `users/${PROPRIO}/applications/slot-1/preuve-depot.svg`, Buffer.from("<svg xmlns='http://www.w3.org/2000/svg'/>"), "image/svg+xml"), 403);
const ANONYME = `rejeu-anonyme-${T}`;
attendre("une session ANONYME n'envoie rien, même dans son propre dossier", await envoyer(ANONYME, `users/${ANONYME}/applications/slot-1/preuve-depot.jpg`, png, "image/png", "anonymous"), 403);
attendre("le propriétaire remplace sa capture (même nom)", await envoyer(PROPRIO, chemin, png, "image/jpeg"), 200);
attendre("un AUTRE uid ne supprime pas la capture", await supprimer(AUTRE, chemin), 403);
attendre("le propriétaire supprime sa capture", await supprimer(PROPRIO, chemin), [200, 204]);

const ko = resultats.filter((r) => !r.ok);
console.log(`\n${resultats.length - ko.length}/${resultats.length} attentes tenues.`);
process.exit(ko.length ? 1 : 0);
