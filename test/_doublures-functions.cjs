/*
 * ============================================================
 * Doublures hors ligne pour exécuter le VRAI code de functions/ sous
 * `node --test` (audit 2026-10).
 *
 * functions/node_modules n'est pas installé dans la suite de tests : on
 * remplace firebase-functions, firebase-admin et le SDK Anthropic par des
 * doublures en mémoire, et `fetch` par un répondeur que chaque test
 * choisit. Aucun appel réseau, aucun Firebase réel.
 *
 * Chaque fichier de test tourne dans son propre processus (node --test) :
 * le détournement de Module._load ne déborde pas sur les autres.
 * Fichier préfixé « _ » : ce n'est pas un test (test/*.test.mjs).
 * ============================================================
 */
const Module = require("module");
const path = require("path");

const FONCTIONS = path.join(__dirname, "..", "functions");

const logs = [];
const secrets = {
  PAYDUNYA_MASTER_KEY: "master-key-de-test",
  PAYDUNYA_PRIVATE_KEY: "test_private_xxxxxxxx",
  PAYDUNYA_TOKEN: "token-de-test",
  BREVO_API_KEY: "brevo-de-test",
  ANTHROPIC_API_KEY: "cle-anthropic-de-test",
};

class HttpsError extends Error {
  constructor(code, message, details) { super(message); this.code = code; this.details = details; }
}

// ---------- Firestore en mémoire ----------
const store = new Map();
const DELETE = { __op: "delete" };
const TS = { __op: "ts" };
const estObjet = (o) => o && typeof o === "object" && !Array.isArray(o) && !o.__op;
const copie = (o) => (o === undefined ? undefined : JSON.parse(JSON.stringify(o)));

function fusionner(base, patch) {
  const out = { ...(base || {}) };
  for (const [k, v] of Object.entries(patch)) {
    if (v === DELETE) delete out[k];
    else if (v === TS) out[k] = new Date().toISOString();
    else if (v && v.__op === "arrayUnion") out[k] = Array.from(new Set([...(out[k] || []), ...v.vals]));
    else if (estObjet(v) && estObjet(out[k])) out[k] = fusionner(out[k], v);
    else if (estObjet(v)) out[k] = fusionner({}, v);
    else out[k] = v;
  }
  return out;
}

function photo(p) {
  const d = store.get(p);
  return { exists: d !== undefined, id: p.split("/").pop(), ref: docRef(p), data: () => copie(d) };
}

function docRef(p) {
  return {
    path: p,
    id: p.split("/").pop(),
    async get() { return photo(p); },
    async set(data, opts) { store.set(p, opts && opts.merge ? fusionner(store.get(p), data) : fusionner({}, data)); },
    async update(data) { if (!store.has(p)) throw new Error("NOT_FOUND " + p); store.set(p, fusionner(store.get(p), data)); },
    async create(data) { if (store.has(p)) throw new Error("ALREADY_EXISTS " + p); store.set(p, fusionner({}, data)); },
    async delete() { store.delete(p); },
    collection(c) { return collRef(`${p}/${c}`); },
  };
}

function collRef(p, filtres = []) {
  return {
    where(champ, _op, val) { return collRef(p, [...filtres, [champ, val]]); },
    doc(id) { return docRef(`${p}/${id}`); },
    async get() {
      const n = p.split("/").length + 1;
      const docs = [...store.keys()]
        .filter((k) => k.startsWith(p + "/") && k.split("/").length === n)
        .filter((k) => filtres.every(([c, v]) => (store.get(k) || {})[c] === v))
        .map((k) => photo(k));
      return { docs, size: docs.length, empty: docs.length === 0 };
    },
  };
}

// Transaction SÉRIALISÉE : modélise la garantie de Firestore (une
// transaction concurrente relit après le commit de l'autre).
let verrou = Promise.resolve();
const db = {
  doc: docRef,
  collection: collRef,
  batch() { const ops = []; return { set(r, d, o) { ops.push(() => r.set(d, o)); }, update(r, d) { ops.push(() => r.update(d)); }, async commit() { for (const f of ops) await f(); } }; },
  runTransaction(fn) {
    const suivant = verrou.then(async () => {
      const ecritures = [];
      const tx = {
        get: async (r) => photo(r.path),
        set: (r, d, o) => ecritures.push(() => r.set(d, o)),
        update: (r, d) => ecritures.push(() => r.update(d)),
      };
      const res = await fn(tx);
      for (const w of ecritures) await w();
      return res;
    });
    verrou = suivant.catch(() => {});
    return suivant;
  },
};
const firestoreFn = () => db;
firestoreFn.FieldValue = {
  delete: () => DELETE,
  serverTimestamp: () => TS,
  arrayUnion: (...vals) => ({ __op: "arrayUnion", vals }),
};

// ---------- Firebase Auth ----------
const comptesAuth = new Map();
const authFn = () => ({ getUser: async (uid) => ({ uid, email: comptesAuth.get(uid) }) });

// ---------- Anthropic ----------
const appelsModele = [];
class Anthropic {
  constructor() {
    this.messages = {
      stream: (req) => {
        appelsModele.push(req);
        return { on() {}, finalMessage: async () => ({ content: [{ type: "text", text: "réponse" }], stop_reason: "end_turn", usage: { input_tokens: 10, output_tokens: 10 } }) };
      },
      create: async (req) => { appelsModele.push(req); return { content: [{ type: "text", text: "réponse" }], stop_reason: "end_turn", usage: { input_tokens: 10, output_tokens: 10 } }; },
    };
  }
}

const doublures = {
  "firebase-functions": { setGlobalOptions() {} },
  "firebase-functions/v2/https": {
    HttpsError,
    onCall: (opts, h) => Object.assign(h, { opts }),
    onRequest: (opts, h) => (typeof opts === "function" ? opts : Object.assign(h, { opts })),
  },
  "firebase-functions/params": { defineSecret: (n) => ({ name: n, value: () => secrets[n] }) },
  "firebase-functions/logger": {
    info: (...a) => logs.push(["info", ...a]),
    warn: (...a) => logs.push(["warn", ...a]),
    error: (...a) => logs.push(["error", ...a]),
  },
  "firebase-functions/v2/firestore": { onDocumentCreated: (opts, h) => Object.assign(h, { opts }) },
  "firebase-functions/v2/scheduler": { onSchedule: (opts, h) => Object.assign(h, { opts }) },
  "firebase-admin": { apps: [], initializeApp() { this.apps.push(1); }, firestore: firestoreFn, auth: authFn },
  "@anthropic-ai/sdk": Anthropic,
};
const chargerOrigine = Module._load;
Module._load = function (req) {
  if (Object.prototype.hasOwnProperty.call(doublures, req)) return doublures[req];
  return chargerOrigine.apply(this, arguments);
};

// ---------- fetch : jamais de réseau ----------
const appelsFetch = [];
let repondeur = async () => ({ ok: true, status: 200, json: async () => ({}), text: async () => "" });
global.fetch = async (url, init) => {
  appelsFetch.push({ url: String(url), init });
  return repondeur(String(url), init);
};
// Réponse JSON toute faite.
const json = (corps) => ({ ok: true, status: 200, json: async () => corps, text: async () => JSON.stringify(corps) });

// Petite réponse Express simulée.
function fauxRes() {
  const r = { code: 200, corps: null };
  r.status = (c) => { r.code = c; return r; };
  r.send = (b) => { r.corps = b; return r; };
  r.json = (b) => { r.corps = b; return r; };
  return r;
}

function remettreAZero() {
  store.clear();
  logs.length = 0;
  appelsFetch.length = 0;
  appelsModele.length = 0;
  comptesAuth.clear();
}

module.exports = {
  store, logs, secrets, appelsFetch, appelsModele, comptesAuth, HttpsError, fauxRes, json, remettreAZero,
  repondre: (fn) => { repondeur = fn; },
  charger: (m) => require(path.join(FONCTIONS, m)),
};
