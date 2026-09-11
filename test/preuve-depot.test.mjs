/**
* ============================================================
* test/preuve-depot.test.mjs — la preuve de dépôt (lot E1, 2026-09-07)
* ============================================================
*
* js/preuve-depot.js est pur : MODES fermé, preuveValide selon chaque
* mode, "transmis" exigé quand parTiers, deposeLe dans le futur
* invalide, lirePreuve ne mute jamais l'argument. Puis les deux règles
* (firestore.rules, storage.rules) lues comme texte — le rejeu réel
* est dans scripts/rejouer-regles.mjs et scripts/rejouer-storage.mjs —
* et la non-régression de journey-map : la phase dépôt reste calculée
* sur le statut.
* ============================================================
*/

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { MODES, LIBELLES_MODES, LONGUEUR_MAX_NUMERO, TAILLE_MAX_FICHIER, lirePreuve, preuveValide, libelleDemande, resumePreuve, cheminCapture } from "../js/preuve-depot.js";
import { STATUTS_DEPOSES, PHASES, etatDesPhases } from "../js/journey-map.js";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
// Fins de ligne normalisées à la lecture : cette machine a core.autocrlf à
// true, les règles arrivent donc en CRLF sur le disque alors que le dépôt
// les stocke en LF. Les motifs ci-dessous décrivent le CONTENU des règles,
// pas son encodage — ils restent écrits pour des fins de ligne LF.
const lire = (f) => readFileSync(join(racine, f), "utf8").replace(/\r\n/g, "\n");
const AUJOURDHUI = new Date(2026, 8, 7);
const hier = "2026-09-06";

test("MODES est un vocabulaire fermé, chacun avec un libellé", () => {
assert.deepEqual(MODES, ["numero", "capture", "transmis"]);
for (const m of MODES) assert.ok(LIBELLES_MODES[m]);
assert.equal(LONGUEUR_MAX_NUMERO, 64);
assert.equal(TAILLE_MAX_FICHIER, 5 * 1024 * 1024);
});

test("numero : numeroDossier non vide et ≤ 64 caractères", () => {
assert.equal(preuveValide({ mode: "numero", numeroDossier: "EF-2026-1", deposeLe: hier }, { aujourdhui: AUJOURDHUI }), true);
assert.equal(preuveValide({ mode: "numero", numeroDossier: "  ", deposeLe: hier }, { aujourdhui: AUJOURDHUI }), false);
assert.equal(preuveValide({ mode: "numero", deposeLe: hier }, { aujourdhui: AUJOURDHUI }), false);
assert.equal(preuveValide({ mode: "numero", numeroDossier: "x".repeat(65), deposeLe: hier }, { aujourdhui: AUJOURDHUI }), false);
assert.equal(preuveValide({ mode: "numero", numeroDossier: "x".repeat(64), deposeLe: hier }, { aujourdhui: AUJOURDHUI }), true);
});

test("capture : au moins fichier ; les deux preuves peuvent coexister", () => {
assert.equal(preuveValide({ mode: "capture", fichier: "users/u/applications/slot-1/preuve-depot.jpg", deposeLe: hier }, { aujourdhui: AUJOURDHUI }), true);
assert.equal(preuveValide({ mode: "capture", numeroDossier: "123", deposeLe: hier }, { aujourdhui: AUJOURDHUI }), false);
assert.equal(preuveValide({ mode: "capture", fichier: "users/u/applications/slot-1/preuve-depot.jpg", numeroDossier: "123", deposeLe: hier }, { aujourdhui: AUJOURDHUI }), true);
assert.equal(preuveValide({ mode: "numero", fichier: "users/u/applications/slot-1/preuve-depot.jpg", numeroDossier: "123", deposeLe: hier }, { aujourdhui: AUJOURDHUI }), true);
});

test("transmis : exigé quand parTiers, interdit sinon ; fichier OU numéro", () => {
assert.equal(preuveValide({ mode: "transmis", numeroDossier: "ref", deposeLe: hier }, { parTiers: true, aujourdhui: AUJOURDHUI }), true);
assert.equal(preuveValide({ mode: "transmis", fichier: "users/u/applications/slot-4/preuve-depot.pdf", deposeLe: hier }, { parTiers: true, aujourdhui: AUJOURDHUI }), true);
assert.equal(preuveValide({ mode: "transmis", deposeLe: hier }, { parTiers: true, aujourdhui: AUJOURDHUI }), false);
assert.equal(preuveValide({ mode: "numero", numeroDossier: "ref", deposeLe: hier }, { parTiers: true, aujourdhui: AUJOURDHUI }), false, "par tiers : numero refusé, il faut transmis");
assert.equal(preuveValide({ mode: "transmis", numeroDossier: "ref", deposeLe: hier }, { parTiers: false, aujourdhui: AUJOURDHUI }), false, "sans tiers : transmis refusé");
});

test("deposeLe : format date, date réelle, jamais dans le futur", () => {
assert.equal(preuveValide({ mode: "numero", numeroDossier: "1", deposeLe: "2026-09-08" }, { aujourdhui: AUJOURDHUI }), false, "demain");
assert.equal(preuveValide({ mode: "numero", numeroDossier: "1", deposeLe: "2026-09-07" }, { aujourdhui: AUJOURDHUI }), true, "aujourd'hui");
assert.equal(preuveValide({ mode: "numero", numeroDossier: "1", deposeLe: "07/09/2026" }, { aujourdhui: AUJOURDHUI }), false);
assert.equal(preuveValide({ mode: "numero", numeroDossier: "1", deposeLe: "2026-02-30" }, { aujourdhui: AUJOURDHUI }), false);
assert.equal(preuveValide({ mode: "numero", numeroDossier: "1" }, { aujourdhui: AUJOURDHUI }), false);
assert.equal(preuveValide({ mode: "inconnu", numeroDossier: "1", deposeLe: hier }, { aujourdhui: AUJOURDHUI }), false);
assert.equal(preuveValide(null), false);
});

test("lirePreuve : copie normalisée, jamais l'original ; null sans preuve", () => {
const app = { status: "deposee", preuveDepot: { mode: "numero", numeroDossier: "  EF-1  ", deposeLe: hier, declareLe: "x" } };
const gele = JSON.stringify(app);
const p = lirePreuve(app);
assert.deepEqual(p, { mode: "numero", numeroDossier: "EF-1", deposeLe: hier, declareLe: "x" });
p.numeroDossier = "changé";
assert.equal(JSON.stringify(app), gele, "l'argument n'est pas muté");
assert.notEqual(p, app.preuveDepot);
assert.equal(lirePreuve({ status: "deposee" }), null);
assert.equal(lirePreuve(null), null);
assert.equal(lirePreuve({ preuveDepot: "texte" }), null);
});

test("libelleDemande et resumePreuve disent ce qu'on attend, et ce qui a été déclaré", () => {
assert.match(libelleDemande({}, { parTiers: true, destinataire: "l'ambassade" }), /transmis votre dossier à l'ambassade ; indiquez ce que vous avez reçu en retour/);
assert.match(libelleDemande({}, { parTiers: true }), /transmis votre dossier/);
assert.match(libelleDemande({}), /numéro de dossier ou ajoutez la capture de confirmation/);
assert.equal(resumePreuve({ mode: "numero", numeroDossier: "EF-1", deposeLe: "2026-09-01" }), "Déposée le 1er septembre 2026 · dossier n° EF-1");
assert.equal(resumePreuve({ mode: "capture", fichier: "users/u/applications/slot-1/preuve-depot.jpg", deposeLe: "2026-09-06" }), "Déposée le 6 septembre 2026 · capture jointe");
assert.equal(resumePreuve({ mode: "transmis", numeroDossier: "R1", fichier: "f", deposeLe: "2026-09-06" }), "Transmise le 6 septembre 2026 · dossier n° R1 · capture jointe");
assert.equal(resumePreuve(null), "");
assert.equal(cheminCapture("u1", "slot-1", "JPG"), "users/u1/applications/slot-1/preuve-depot.jpg");
assert.equal(cheminCapture("u1", "pre-1", "../x"), "users/u1/applications/pre-1/preuve-depot.x");
});

// ------------------------------------------------------------------
// Les règles, lues comme texte (le rejeu réel est dans scripts/)
// ------------------------------------------------------------------

test("firestore.rules : miroir du vocabulaire et des statuts déposés ; la règle ne joue qu'à la transition", () => {
const r = lire("firestore.rules");
const estDepose = r.match(/function estStatutDepose\(statut\) \{\n([\s\S]*?)\n\}/);
assert.ok(estDepose);
for (const s of STATUTS_DEPOSES) assert.ok(estDepose[1].includes(`'${s}'`), s);
assert.ok(r.includes("in ['numero', 'capture', 'transmis']"));
assert.ok(r.includes("numeroDossier.size() <= 64"));
assert.ok(r.includes("matches('[0-9]{4}-[0-9]{2}-[0-9]{2}')"));
// Lot ACCEPTATION : la transition se lit par affecte('status') — la même
// clé, sans la recopier (voir les fonctions du bloc ACCEPTATION).
assert.ok(r.includes("depotJustifie(uid, applicationId, affecte('status'))"), "l'update ne contraint que la transition de statut");
assert.ok(r.includes("function affecte(cle) {\nreturn cle in request.resource.data.diff(resource.data).affectedKeys();"), "affecte() est bien la transition");
assert.ok(r.includes("&& depotJustifie(uid, applicationId, true)"), "la création avec un statut déposé exige la preuve");
assert.ok(r.includes("'users/' + uid + '/applications/' + applicationId + '/.*'"), "le fichier vit dans le dossier de cette candidature");
});

test("storage.rules : capture réservée au propriétaire, image ou PDF, 5 Mo ; rien d'autre n'est inscriptible", () => {
const s = lire("storage.rules");
assert.ok(s.includes("match /users/{uid}/applications/{applicationId}/{fichier}"));
assert.ok(s.includes("request.resource.size <= 5 * 1024 * 1024"));
assert.ok(s.includes("request.resource.contentType.matches('image/.*') || request.resource.contentType == 'application/pdf'"));
assert.ok(s.includes("allow read: if estProprietaire(uid);"));
assert.ok(/match \/users\/\{uid\}\/\{allPaths=\*\*\} \{\nallow read: if estProprietaire\(uid\);\nallow write: if false;/.test(s));
assert.ok(!/isAdmin/.test(s), "aucun accès admin à la capture");
});

test("aucune capture dans l'export du catalogue : scripts/lot.mjs ne lit pas users/", () => {
const lot = lire("scripts/lot.mjs");
assert.ok(!/preuveDepot|preuve-depot|\/applications\//.test(lot));
});

// ------------------------------------------------------------------
// journey-map : la phase dépôt reste calculée sur le statut
// ------------------------------------------------------------------

test("journey-map : non-régression des 6 phases — le dépôt se lit sur le statut, avec ou sans preuve", () => {
assert.deepEqual(PHASES.map((p) => p.id), ["profil", "opportunites", "dossiers", "depot", "reponse", "depart"]);
const sans = etatDesPhases({ profileScore: 90, applications: [{ status: "deposee" }] });
const avec = etatDesPhases({ profileScore: 90, applications: [{ status: "deposee", preuveDepot: { mode: "numero", numeroDossier: "1", deposeLe: hier } }] });
const faits = (e) => e.phases.map((p) => [p.id, p.faite === true]);
assert.deepEqual(faits(sans), faits(avec), "la preuve ne change pas le calcul des phases");
assert.ok(sans.phases.find((p) => p.id === "depot"));
const rien = etatDesPhases({ profileScore: 90, applications: [{ status: "en_cours", preuveDepot: { mode: "numero", numeroDossier: "1", deposeLe: hier } }] });
assert.notEqual(JSON.stringify(faits(rien)), JSON.stringify(faits(avec)), "une preuve sans statut déposé ne fait pas la phase dépôt");
});
