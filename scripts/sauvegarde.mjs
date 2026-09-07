// ============================================================
// FitzUniverse — sauvegarde brute de Firestore (créée le 2026-09-07)
//
//     node scripts/sauvegarde.mjs
//
// POURQUOI CE FICHIER
// GitHub ne versionne que le code et assets/data/catalogue.json. La
// base Firestore n'était sauvegardée nulle part. Le catalogue, à la
// rigueur, se re-recherche. Le dossier d'un étudiant — ses
// candidatures, ses échanges avec un conseiller — non.
//
// CE QUE C'EST, CE QUE CE N'EST PAS
// C'est le FILET IMMÉDIAT : un export complet, lisible, posé sur le
// disque avant toute écriture en base par un lot. Ce n'est PAS le
// dispositif définitif. La bonne réponse à terme est
// `gcloud firestore export` planifié vers un bucket Cloud Storage
// (versionné, hors de la machine, restaurable par `import`). Tant que
// ce dispositif n'existe pas, ce script se lance AVANT chaque lot qui
// écrit — c'est la règle du lot D2.
//
// CE QU'IL FAIT
//   - exporte CHAQUE collection racine et CHAQUE sous-collection vers
//     sauvegardes/<AAAA-MM-JJ-HHmm>/<chemin>.json — un fichier par
//     collection, JSON indenté, Timestamps sérialisés en ISO 8601 ;
//   - couvre en priorité users/** (applications, advisorRequests,
//     messages… tout ce que listCollections() trouve sous chaque
//     document), puis scholarships, universities, programs, admins ;
//   - affiche un récapitulatif : collection, documents, octets ;
//   - sort en code 1 si une collection ATTENDUE revient vide — une
//     sauvegarde vide qui passe en silence vaut moins que pas de
//     sauvegarde du tout.
//
// ⚠️ sauvegardes/ est dans .gitignore : ces fichiers contiennent des
// données personnelles d'étudiants. Ils ne vont JAMAIS dans le dépôt.
//
// IDENTIFIANTS — les MÊMES que scripts/lot.mjs, aucun fichier de clé :
// la session `firebase login` de firebase-tools, échangée contre un
// jeton éphémère. Le bloc est recopié de lot.mjs plutôt qu'importé,
// parce que lot.mjs exécute sa ligne de commande à l'import. Lecture
// seule ici : ce script n'écrit rien en base, jamais.
// ============================================================
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { homedir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const PROJECT_ID = "scholarbridge-e0d84";

const CLIENT_ID = process.env.FIREBASE_CLIENT_ID || "563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com";
const CLIENT_SECRET = process.env.FIREBASE_CLIENT_SECRET || "j9iVZfS8kkCEFUPaAeJV0sAi";

// Les collections racines qui DOIVENT exister et être non vides. Une
// autre collection trouvée en base est sauvegardée aussi, mais son
// absence ne fait pas échouer le script.
const ATTENDUES = ["users", "scholarships", "universities", "programs", "admins"];

const ok = (m) => console.log(`  \x1b[32m${m}\x1b[0m`);
const err = (m) => console.error(`  \x1b[31m${m}\x1b[0m`);
const info = (m) => console.log(`  ${m}`);

function sortir(message) {
  err(message);
  process.exit(1);
}

async function sessionFirebaseTools() {
  const configstore = join(homedir(), ".config", "configstore", "firebase-tools.json");
  let cfg;
  try {
    cfg = JSON.parse(await readFile(configstore, "utf8"));
  } catch {
    sortir(`Impossible de lire ${configstore} — lancez d'abord \`firebase login\`.`);
  }
  const refreshToken = cfg && cfg.tokens && cfg.tokens.refresh_token;
  if (!refreshToken) sortir("Aucune session firebase-tools : lancez `firebase login`.");
  info(`Session firebase-tools : ${(cfg.user && cfg.user.email) || "(email inconnu)"}`);
  return refreshToken;
}

async function ouvrirFirestore() {
  const configSite = await readFile(join(racine, "firebase-config.js"), "utf8");
  if (!configSite.includes(`projectId: "${PROJECT_ID}"`) && !configSite.includes(`projectId:"${PROJECT_ID}"`)) {
    sortir(`Garde projet : firebase-config.js ne référence pas "${PROJECT_ID}" — refus de continuer.`);
  }
  if (process.env.FIRESTORE_EMULATOR_HOST) {
    sortir("FIRESTORE_EMULATOR_HOST est défini : une sauvegarde de l'émulateur n'a aucun sens. Refus.");
  }
  const { Firestore } = await import("@google-cloud/firestore");
  console.log(`\nProjet visé : ${PROJECT_ID} — PRODUCTION (lecture seule)`);
  const refreshToken = await sessionFirebaseTools();
  return new Firestore({
    projectId: PROJECT_ID,
    credentials: { type: "authorized_user", client_id: CLIENT_ID, client_secret: CLIENT_SECRET, refresh_token: refreshToken, quota_project_id: PROJECT_ID }
  });
}

// Timestamp -> ISO ; référence -> chemin ; GeoPoint -> {lat, lng} ;
// le reste tel quel, récursivement.
function serialiser(valeur) {
  if (valeur === null || valeur === undefined) return valeur;
  if (typeof valeur.toDate === "function") return valeur.toDate().toISOString();
  if (valeur.constructor && valeur.constructor.name === "DocumentReference") return { __ref: valeur.path };
  if (typeof valeur.latitude === "number" && typeof valeur.longitude === "number") return { lat: valeur.latitude, lng: valeur.longitude };
  if (Array.isArray(valeur)) return valeur.map(serialiser);
  if (typeof valeur === "object") {
    const sortie = {};
    for (const [k, v] of Object.entries(valeur)) sortie[k] = serialiser(v);
    return sortie;
  }
  return valeur;
}

function horodatage() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`;
}

// Un fichier par collection : sauvegardes/<stamp>/<chemin>.json. Les
// sous-collections suivent le chemin du document parent
// (users/<uid>/applications.json). Le récapitulatif regroupe par
// GROUPE de collections (users/*/applications) pour rester lisible.
async function sauvegarderCollection(ref, dossier, recap) {
  const snap = await ref.get();
  const docs = snap.docs.map((d) => ({ id: d.id, ...serialiser(d.data()) }));

  const chemin = ref.path;
  const fichier = join(dossier, `${chemin}.json`);
  await mkdir(dirname(fichier), { recursive: true });
  const texte = JSON.stringify(docs, null, 2);
  await writeFile(fichier, texte, "utf8");

  const groupe = chemin.split("/").map((seg, i) => (i % 2 === 1 ? "*" : seg)).join("/");
  const ligne = recap.get(groupe) || { documents: 0, octets: 0, fichiers: 0 };
  ligne.documents += docs.length;
  ligne.octets += Buffer.byteLength(texte, "utf8");
  ligne.fichiers += 1;
  recap.set(groupe, ligne);

  // Sous-collections de chaque document — c'est là que vivent les
  // candidatures et les échanges avec un conseiller.
  for (const doc of snap.docs) {
    const sous = await doc.ref.listCollections();
    for (const s of sous) await sauvegarderCollection(s, dossier, recap);
  }
}

const db = await ouvrirFirestore();

const stamp = horodatage();
const dossier = join(racine, "sauvegardes", stamp);
await mkdir(dossier, { recursive: true });

console.log(`\n=== SAUVEGARDE FIRESTORE → sauvegardes/${stamp}/ ===\n`);

const racines = await db.listCollections();
const noms = racines.map((c) => c.id);

// users d'abord : la partie irremplaçable est écrite en premier, pour
// qu'une interruption laisse au moins celle-là sur le disque.
const ordre = [...ATTENDUES.filter((n) => noms.includes(n)), ...noms.filter((n) => !ATTENDUES.includes(n))];

const recap = new Map();

for (const nom of ordre) {
  info(`${nom}…`);
  await sauvegarderCollection(db.collection(nom), dossier, recap);
}

console.log("\n  Collection                          Documents      Octets  Fichiers");
console.log("  " + "-".repeat(70));

let total = 0;
for (const [groupe, l] of [...recap.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  total += l.octets;
  console.log(`  ${groupe.padEnd(36)}${String(l.documents).padStart(9)}${String(l.octets).padStart(12)}${String(l.fichiers).padStart(10)}`);
}
console.log("  " + "-".repeat(70));
console.log(`  ${"total".padEnd(36)}${"".padStart(9)}${String(total).padStart(12)}\n`);

const manquantes = ATTENDUES.filter((n) => !noms.includes(n));
const vides = ATTENDUES.filter((n) => noms.includes(n) && (recap.get(n) || { documents: 0 }).documents === 0);

if (manquantes.length || vides.length) {
  if (manquantes.length) err(`Collection(s) attendue(s) ABSENTE(S) : ${manquantes.join(", ")}`);
  if (vides.length) err(`Collection(s) attendue(s) VIDE(S) : ${vides.join(", ")}`);
  sortir("Sauvegarde incomplète — ne pas écrire en base tant que ce n'est pas expliqué.");
}

ok(`Sauvegarde complète dans sauvegardes/${stamp}/ (hors dépôt, .gitignore).`);
