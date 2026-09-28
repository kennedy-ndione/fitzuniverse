/**
 * ============================================================
 * scripts/verifier/hors-ligne.mjs — couper le site du réseau
 * ============================================================
 *
 * Le harnais doit pouvoir tourner sans réseau, sans compte Firebase et
 * sans consommer une seule lecture Firestore. Trois origines externes
 * sont chargées par les pages du parcours :
 *
 *   1. https://www.gstatic.com/firebasejs/…  — le SDK Firebase, importé
 *      statiquement par firebase-config.js. Sans lui, le module
 *      eligibility-questions.js ne se charge même pas : ce n'est pas
 *      un détail décoratif, c'est une dépendance de démarrage.
 *   2. https://unpkg.com/lucide          — les icônes, jusqu'au 2026-09-28 : elles
 *      sont depuis servies par le site (js/lucide-icones.js, lot PERF
 *      3G). La doublure ci-dessous ne sert plus qu'à un arbre plus ancien.
 *   3. https://fonts.googleapis.com/…    — les polices.
 *
 * On les remplace par des doublures MINIMALES. Ce que la doublure
 * Firebase ne fait PAS est aussi important que ce qu'elle fait : elle
 * ne rend aucun document. Le catalogue doit donc arriver par
 * assets/data/catalogue.json — c'est-à-dire par l'instantané statique
 * qui est censé servir tous les visiteurs à 0 lecture. Si un jour un
 * module se remet à lire Firestore, le harnais le verra sous la forme
 * d'un catalogue vide, pas sous la forme d'une facture.
 * ============================================================
 */

// Les symboles réellement importés depuis gstatic dans le dépôt.
// Relevé le 2026-09-05 sur js/**/*.js et *.js. Si un module importe un
// symbole absent d'ici, le navigateur lève une SyntaxError au
// chargement et le harnais échoue — c'est le comportement voulu : on
// veut être prévenu, pas dépanné en silence.
import fs from "node:fs";

const SYMBOLES = {
  "firebase-app.js": ["initializeApp", "getApp", "getApps"],
  "firebase-auth.js": [
    "getAuth", "connectAuthEmulator", "onAuthStateChanged", "signOut",
    "signInAnonymously", "signInWithEmailAndPassword", "createUserWithEmailAndPassword",
    "sendPasswordResetEmail", "updateProfile", "updatePassword", "deleteUser",
    "EmailAuthProvider", "reauthenticateWithCredential", "GoogleAuthProvider",
    "signInWithPopup", "setPersistence", "browserLocalPersistence", "browserSessionPersistence"
  ],
  "firebase-firestore.js": [
    "getFirestore", "connectFirestoreEmulator", "collection", "collectionGroup", "doc", "getDoc",
    "getDocs", "setDoc", "addDoc", "updateDoc", "deleteDoc", "query", "where",
    "orderBy", "limit", "onSnapshot", "serverTimestamp", "increment",
    "writeBatch", "arrayUnion", "arrayRemove", "Timestamp",
    // Relevé complété le 2026-09-09, quand le Control Center est entré
    // dans le harnais : admin/firebase-admin.js importe ces trois-là.
    "deleteField", "documentId", "getCountFromServer"
  ],
  "firebase-storage.js": ["getStorage", "ref", "uploadBytes", "getDownloadURL", "deleteObject"],
  "firebase-functions.js": ["getFunctions", "httpsCallable", "connectFunctionsEmulator"]
};

// Quelques symboles ont besoin d'un vrai comportement, pas d'une
// coquille : le code du site consomme leur résultat immédiatement.
const IMPLEMENTATIONS = {
  getDocs: "export function getDocs(){ return Promise.resolve({ docs: [], empty: true, size: 0 }); }",
  getDoc: "export function getDoc(){ return Promise.resolve({ exists: () => false, data: () => null }); }",
  onAuthStateChanged: "export function onAuthStateChanged(_app, rappel){ if (typeof rappel === 'function') setTimeout(() => rappel(null), 0); return () => {}; }",
  onSnapshot: "export function onSnapshot(){ return () => {}; }",
  serverTimestamp: "export function serverTimestamp(){ return new Date(); }",
  // Lot PEIGNE-FIN : le Control Center appelle Timestamp.fromDate() —
  // une fonction inerte n'a pas cette méthode statique.
  Timestamp: "export function Timestamp(){} Timestamp.fromDate = function(d){ return { toDate: () => d, seconds: Math.floor(+d / 1000) }; }; Timestamp.now = function(){ return Timestamp.fromDate(new Date()); };",
  getCountFromServer: "export function getCountFromServer(){ return Promise.resolve({ data: () => ({ count: 0 }) }); }",
  setPersistence: "export function setPersistence(){ return Promise.resolve(); }",
  writeBatch: "export function writeBatch(){ return { set(){}, update(){}, delete(){}, commit: () => Promise.resolve() }; }",
  // LOT S3 : la Cloud Function `portails` sert la carte des portails de
  // candidature, retirée du catalogue public. Hors ligne et sans compte,
  // la doublure rend ce que rendrait le vrai serveur à un visiteur : un
  // refus "unauthenticated". C'est le cas qui compte pour ce harnais —
  // il prouve que le catalogue et les fiches se rendent ENTIÈREMENT sans
  // portail, sans cadenas et sans bloc vide. La coquille par défaut
  // aurait « marché » aussi, en levant un TypeError attrapé plus loin :
  // on préfère doubler le refus réel plutôt que compter sur une panne.
  httpsCallable: "export function httpsCallable(){ return function(){ const e = new Error('[harnais] hors ligne'); e.code = 'unauthenticated'; return Promise.reject(e); }; }"
};

// En mode admin, la doublure rend un utilisateur connecté et un
// document admins/{uid} actif — le strict nécessaire pour que
// admin-auth.js laisse passer. Elle ne rend toujours AUCUN document de
// catalogue : les pages admin qui en ont besoin doivent passer par
// l'instantané statique, comme le site public.
const IMPLEMENTATIONS_ADMIN = {
  onAuthStateChanged: "export function onAuthStateChanged(_app, rappel){ if (typeof rappel === 'function') setTimeout(() => rappel({ uid: 'harnais', email: 'harnais@fitz.local' }), 0); return () => {}; }",
  getDoc: "export function getDoc(){ return Promise.resolve({ exists: () => true, data: () => ({ email: 'harnais@fitz.local', isActive: true }) }); }"
};

/**
 * Mode ADMIN NOMMÉ (correctif du 2026-09-09).
 *
 * Le mode ci-dessus rend un document `admins` SANS champ `role` — donc
 * un propriétaire, par la règle d'amorçage. C'est le seul cas que le
 * harnais savait jouer, et c'est exactement celui qui n'a pas cassé.
 *
 * La panne, elle, vivait chez les AUTRES : un administrateur ordinaire,
 * dont `appliquerRole()` retire les blocs réservés, et un propriétaire
 * dont le document portait la graphie héritée « super-admin ». Ce mode
 * prend donc le document `admins` en paramètre, et sert en plus le
 * document `users/{uid}` de l'étudiant dont on ouvre la fiche.
 *
 * Aucune écriture n'est faite : elles sont CONSIGNÉES dans
 * window.__harnaisEcritures, comme en mode étudiant.
 */
function implementationsAdmin({ uid, email, adminDoc, etudiantUid, etudiantDoc, echecAdmins = false }) {

  const donnees = JSON.stringify({ uid, adminDoc, etudiantUid, etudiantDoc, echecAdmins });

  return {
    onAuthStateChanged: `export function onAuthStateChanged(_app, rappel){ if (typeof rappel === 'function') setTimeout(() => rappel({ uid: ${JSON.stringify(uid)}, email: ${JSON.stringify(email)} }), 0); return () => {}; }`,
    doc: `export function doc(){ const a = Array.from(arguments); const base = a[0] && a[0].__chemin ? [a[0].__chemin] : []; return { __chemin: base.concat(a.slice(1)).join('/') }; }`,
    collection: `export function collection(){ const a = Array.from(arguments); const base = a[0] && a[0].__chemin ? [a[0].__chemin] : []; return { __chemin: base.concat(a.slice(1)).join('/') }; }`,
    getDoc: `const __A = ${donnees};
export function getDoc(ref){ const c = (ref && ref.__chemin) || '';
if (c === 'admins/' + __A.uid) { if (__A.echecAdmins) { const e = new Error('[harnais] lecture de admins refusée'); e.code = 'permission-denied'; return Promise.reject(e); } return Promise.resolve({ exists: () => true, id: __A.uid, data: () => __A.adminDoc }); }
if (c === 'users/' + __A.etudiantUid) return Promise.resolve({ exists: () => true, id: __A.etudiantUid, data: () => __A.etudiantDoc });
return Promise.resolve({ exists: () => false, data: () => null }); }`,
    setDoc: `export function setDoc(ref, data){ (window.__harnaisEcritures = window.__harnaisEcritures || []).push({ op: 'set', chemin: (ref && ref.__chemin) || '', data }); return Promise.resolve(); }`,
    updateDoc: `export function updateDoc(ref, data){ (window.__harnaisEcritures = window.__harnaisEcritures || []).push({ op: 'update', chemin: (ref && ref.__chemin) || '', data }); return Promise.resolve(); }`,
    addDoc: `export function addDoc(ref, data){ (window.__harnaisEcritures = window.__harnaisEcritures || []).push({ op: 'add', chemin: (ref && ref.__chemin) || '', data }); return Promise.resolve({ id: 'auto' }); }`
  };

}

// Mode ÉTUDIANT (passe espace étudiant 1/3, 2026-09-06) : les pages
// dashboard.html et applications.html vivent derrière bootstrapShell(),
// qui lit users/{uid} (formule), admins/{uid}, config/planFeatures et
// users/{uid}/applications. La doublure rend un étudiant connecté, son
// document utilisateur et SES candidatures — tout le reste reste vide.
// Les références doc()/collection() portent leur chemin pour que
// getDoc/getDocs sachent quoi rendre. Chaque écriture (setDoc /
// updateDoc) est CONSIGNÉE dans window.__harnaisEcritures au lieu
// d'être faite : c'est ce qui permet au harnais de prouver qu'aucune
// `deadline` n'est écrite sans un clic de l'étudiant.
function implementationsEtudiant({ uid, userData, applications, portails }) {

  const donnees = JSON.stringify({ uid, userData, applications });
  // LOT S3 : l'étudiant du harnais a une formule active — le vrai
  // serveur lui rendrait donc la carte des portails. On la lui rend,
  // pour que la fiche et les candidatures soient vérifiées dans l'état
  // d'un CLIENT, et pas seulement dans celui d'un visiteur.
  const carte = JSON.stringify(portails || { universites: {}, programmes: {}, bourses: {} });

  return {
    httpsCallable: `const __PORTAILS = ${carte};
export function httpsCallable(_f, nom){ return function(){ if (nom === 'portails') return Promise.resolve({ data: __PORTAILS }); const e = new Error('[harnais] fonction non doublée : ' + nom); e.code = 'unavailable'; return Promise.reject(e); }; }`,
    onAuthStateChanged: `export function onAuthStateChanged(_app, rappel){ if (typeof rappel === 'function') setTimeout(() => rappel({ uid: ${JSON.stringify(uid)}, email: 'harnais@fitz.local', displayName: 'Harnais' }), 0); return () => {}; }`,
    doc: `export function doc(){ const a = Array.from(arguments); const base = a[0] && a[0].__chemin ? [a[0].__chemin] : []; return { __chemin: base.concat(a.slice(1)).join('/') }; }`,
    collection: `export function collection(){ const a = Array.from(arguments); const base = a[0] && a[0].__chemin ? [a[0].__chemin] : []; return { __chemin: base.concat(a.slice(1)).join('/') }; }`,
    getDoc: `const __D = ${donnees};
export function getDoc(ref){ const c = ref && ref.__chemin || ''; if (c === 'users/' + __D.uid) return Promise.resolve({ exists: () => true, id: __D.uid, data: () => __D.userData }); return Promise.resolve({ exists: () => false, data: () => null }); }`,
    getDocs: `const __A = ${donnees}.applications;
export function getDocs(ref){ const c = ref && ref.__chemin || ''; if (c.endsWith('/applications')) { const docs = __A.map((d) => ({ id: d.id, data: () => { const { id, ...reste } = d; return reste; } })); return Promise.resolve({ docs, empty: docs.length === 0, size: docs.length }); } return Promise.resolve({ docs: [], empty: true, size: 0 }); }`,
    setDoc: `export function setDoc(ref, data){ (window.__harnaisEcritures = window.__harnaisEcritures || []).push({ op: 'set', chemin: ref && ref.__chemin || '', data }); return Promise.resolve(); }`,
    updateDoc: `export function updateDoc(ref, data){ (window.__harnaisEcritures = window.__harnaisEcritures || []).push({ op: 'update', chemin: ref && ref.__chemin || '', data }); return Promise.resolve(); }`,
    deleteDoc: `export function deleteDoc(ref){ (window.__harnaisEcritures = window.__harnaisEcritures || []).push({ op: 'delete', chemin: ref && ref.__chemin || '' }); return Promise.resolve(); }`,
    addDoc: `export function addDoc(ref, data){ (window.__harnaisEcritures = window.__harnaisEcritures || []).push({ op: 'add', chemin: ref && ref.__chemin || '', data }); return Promise.resolve({ id: 'auto' }); }`,
    // Lot E1 : Storage. L'envoi d'une capture est CONSIGNÉ (op 'upload',
    // chemin, taille, type), jamais fait ; l'URL de lecture est factice.
    ref: `export function ref(_s, chemin){ return { __chemin: String(chemin || '') }; }`,
    uploadBytes: `export function uploadBytes(ref, blob, meta){ (window.__harnaisEcritures = window.__harnaisEcritures || []).push({ op: 'upload', chemin: ref && ref.__chemin || '', data: { taille: blob && blob.size || 0, type: (meta && meta.contentType) || (blob && blob.type) || '' } }); return Promise.resolve({ ref }); }`,
    getDownloadURL: `export function getDownloadURL(ref){ return Promise.resolve('blob:harnais/' + (ref && ref.__chemin || '')); }`
  };

}

function doublureFirebase(fichier, admin = false, etudiant = null) {

  const noms = SYMBOLES[fichier];

  // Un module Firebase inconnu = une dépendance ajoutée depuis le
  // dernier relevé. On le dit à voix haute plutôt que de rendre un
  // module vide qui échouerait dix lignes plus loin, sans indice.
  if (!noms) {
    return `throw new Error("[harnais] doublure manquante pour ${fichier} — compléter SYMBOLES dans scripts/verifier/hors-ligne.mjs");`;
  }

  // Les autres sont des fonctions inertes : elles servent seulement à
  // ce que l'import nommé existe. Une fonction, et non un objet, parce
  // que certains symboles (Timestamp, les providers) sont appelés avec
  // `new` — ce qui marche sur une fonction, pas sur un littéral.
  const implementations = etudiant
    ? { ...IMPLEMENTATIONS, ...implementationsEtudiant(etudiant) }
    : admin && typeof admin === "object" ? { ...IMPLEMENTATIONS, ...implementationsAdmin(admin) }
    : admin ? { ...IMPLEMENTATIONS, ...IMPLEMENTATIONS_ADMIN } : IMPLEMENTATIONS;

  return noms
    .map((nom) => implementations[nom] || `export function ${nom}(){ return { __doublure: "${nom}" }; }`)
    .join("\n");

}

// Lucide : le site appelle window.lucide.createIcons() à plusieurs
// endroits et remplace des <i data-lucide> par des <svg>. La doublure
// ne dessine rien — elle laisse les <i> en place, ce qui est
// suffisant : le harnais vérifie la logique, pas le dessin.
const DOUBLURE_LUCIDE = `window.lucide = { createIcons: function(){}, icons: {} };`;

let LUCIDE_REEL = null;
try {
  LUCIDE_REEL = fs.readFileSync(new URL("../../node_modules/lucide/dist/umd/lucide.js", import.meta.url), "utf8");
} catch { LUCIDE_REEL = null; }

/**
 * Branche l'interception sur un contexte Playwright.
 * Renvoie la liste (mutable) des requêtes externes vues, pour que le
 * rapport puisse dire ce qui a été coupé.
 */
export async function couperLeReseau(context, options = {}) {

  const externes = [];

  // Mode ADMIN : les pages de admin/ commencent par admin-auth.js, qui
  // renvoie vers login.html tant qu'aucun administrateur actif n'est
  // connecté. Sans ce mode, aucune page du Control Center ne serait
  // vérifiable — et ce sont justement celles que personne ne regarde
  // avant qu'elles ne cassent.
  // `true` garde l'ancien comportement (un propriétaire par amorçage) ;
  // un OBJET { uid, email, adminDoc, etudiantUid, etudiantDoc } permet
  // de jouer un administrateur ORDINAIRE, ou un propriétaire dont le
  // document porte la graphie héritée — les deux cas qui ont cassé.
  const admin = options.admin === true || (options.admin && typeof options.admin === "object") ? options.admin : false;

  // Mode ÉTUDIANT : { uid, userData, applications } — voir
  // implementationsEtudiant() ci-dessus.
  const etudiant = options.etudiant && typeof options.etudiant === "object" ? options.etudiant : null;

  // Lot DEUX-MOTEURS (2026-09-11) : `polices: true` laisse passer vers le
  // réseau fonts.googleapis.com et fonts.gstatic.com — et SEULEMENT eux.
  // Raison : sans les vraies polices, le harnais rend tout en police
  // système, alors que sur l'iPhone, Public Sans et Newsreader produisent
  // d'autres coupures de ligne. Réservé aux captures ciblées
  // (captures-iphone.mjs) ; le défaut reste hors ligne, tout compris.
  const polices = options.polices === true;

  await context.route("**/*", async (route) => {

    const url = route.request().url();

    if (url.startsWith("http://127.0.0.1") || url.startsWith("http://localhost")) {
      return route.continue();
    }

    // Lot DEUX-MOTEURS (2026-09-11) : sous WebKit, l'interception voit
    // AUSSI les URL blob: et data: (Chromium ne les lui montre pas). Les
    // traiter comme « externes » les remplaçait par une réponse vide —
    // l'<img> de la compression d'une capture (js/compression-image.js)
    // tombait en onerror, et le harnais accusait le site : « Capture non
    // envoyée ». Ce sont des objets de la page, jamais du réseau.
    if (url.startsWith("blob:") || url.startsWith("data:")) {
      return route.continue();
    }

    if (polices && (url.startsWith("https://fonts.googleapis.com/") || url.startsWith("https://fonts.gstatic.com/"))) {
      return route.continue();
    }

    externes.push(url);

    const firebase = url.match(/gstatic\.com\/firebasejs\/[^/]+\/([^?]+)$/);

    if (firebase) {
      return route.fulfill({
        status: 200,
        contentType: "text/javascript; charset=utf-8",
        body: doublureFirebase(firebase[1], admin, etudiant)
      });
    }

    if (url.includes("unpkg.com/lucide")) {
      // Lot ICONE-BTN (2026-09-11) : le VRAI lucide, depuis le paquet
      // installé (même version que le site), pour que le peigne voie les
      // icônes rendues — une coquille qui ne dessine rien cachait un
      // bouton dont l'icône faisait 0×0. Si le paquet manque, la coquille.
      return route.fulfill({
        status: 200,
        contentType: "text/javascript; charset=utf-8",
        body: LUCIDE_REEL || DOUBLURE_LUCIDE
      });
    }

    if (url.includes("fonts.googleapis.com")) {
      return route.fulfill({ status: 200, contentType: "text/css", body: "" });
    }

    // Tout le reste (polices, pixels d'analytics, CDN divers) : une
    // réponse vide plutôt qu'un échec réseau, pour que le compteur
    // d'erreurs du harnais ne compte que de vraies erreurs du site.
    return route.fulfill({ status: 200, contentType: "text/plain", body: "" });

  });

  return externes;

}

/**
 * Le bruit de console qu'aucun moteur ne doit compter comme une erreur
 * du site (lot DEUX-MOTEURS, 2026-09-11 — une seule liste pour les cinq
 * modules qui écoutent la console) :
 *
 *  - « Failed to load resource » : le doublon console d'un 404 que
 *    l'écouteur de réponses attrape déjà, avec l'URL ;
 *  - « Viewport argument key "interactive-widget" not recognized » :
 *    WebKit signale, en type `error`, une clé de <meta viewport> qu'il
 *    ne connaît pas. `interactive-widget=resizes-content` est une clé
 *    Chrome/Android (comportement du clavier virtuel) ; Safari l'ignore
 *    par conception, sans autre effet. Ce n'est pas un défaut du site :
 *    retirer la clé dégraderait Android pour faire taire un message.
 */
const BRUIT_CONSOLE = [
  /Failed to load resource/i,
  /Viewport argument key "interactive-widget" not recognized/i
];

export function estBruitConsole(texte) {
  return BRUIT_CONSOLE.some((r) => r.test(String(texte || "")));
}
