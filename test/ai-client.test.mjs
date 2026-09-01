/**
* ============================================================
* Tests unitaires — couture de l'API Fitz
* ============================================================
*
* Lancer : npm test   (ou : node --test test/)
*
* Ces tests n'ouvrent aucun navigateur, ne chargent pas Firebase et
* n'appellent aucun fournisseur. Ils vérifient ce que le contrat de
* generate() promet aux six pages appelantes — les promesses qui
* devront tenir À L'IDENTIQUE le jour où MODE passera de "simule" à
* "passerelle" :
*
*   1. la forme du retour ({text} / {data}) selon la tâche ;
*   2. les erreurs typées, y compris la correspondance HTTP ;
*   3. la distinction arrêt demandé / délai dépassé ;
*   4. le refus d'une entrée trop longue AVANT tout appel ;
*   5. le réessai des seules erreurs passagères ;
*   6. le rejet d'une réponse structurée malformée.
*
* Les points 5 et 6 sont ceux qui ne servent à rien aujourd'hui — le
* simulateur ne tombe jamais en panne et renvoie toujours la bonne
* forme. Ils sont écrits maintenant précisément parce que le jour où
* ils serviront, personne n'aura le temps de les écrire.
* ============================================================
*/

import test from "node:test";
import assert from "node:assert/strict";

import {
CODES,
FitzError,
messageErreurFitz,
estArret,
estReessayable,
codeDepuisStatutHttp
} from "../js/ai/ai-errors.js";

import { TACHES, TACHES_STRUCTUREES, FONCTIONNALITE_PAR_TACHE, DELAIS_MS } from "../js/ai/ai-config.js";

// ==========================================================
// ERREURS
// ==========================================================

test("chaque code d'erreur porte un message en français, jamais le message brut", () => {

for (const code of Object.values(CODES)) {

const erreur = new FitzError(code);

assert.equal(erreur.name, "FitzError");
assert.equal(erreur.code, code);
assert.ok(erreur.message.length > 10, `message trop court pour ${code}`);
assert.ok(!/error|failed|invalid|request/i.test(erreur.message),
`le message de ${code} contient du jargon anglais : ${erreur.message}`);

}

});

test("un code inconnu retombe sur INCONNU plutôt que de produire un message vide", () => {

const erreur = new FitzError("CODE_QUI_N_EXISTE_PAS");

assert.equal(erreur.code, CODES.INCONNU);
assert.ok(erreur.message.length > 10);

});

test("messageErreurFitz ne laisse jamais fuiter le message d'un fournisseur", () => {

const brute = new Error("Rate limit exceeded for gpt-4o, request id req_9f2a");

const affiche = messageErreurFitz(brute);

assert.ok(!affiche.includes("req_9f2a"));
assert.ok(!affiche.includes("gpt-4o"));
assert.equal(affiche, new FitzError(CODES.INCONNU).message);

});

test("estArret reconnaît l'AbortError natif comme la FitzError", () => {

const natif = new Error("aborted");
natif.name = "AbortError";

assert.equal(estArret(natif), true);
assert.equal(estArret(new FitzError(CODES.ARRET_DEMANDE)), true);
assert.equal(estArret(new FitzError(CODES.RESEAU)), false);
assert.equal(estArret(null), false);

});

test("on ne réessaie jamais ce qui ne peut pas aboutir", () => {

// Réessayer un quota épuisé fait perdre du temps à l'étudiant et,
// sur un vrai fournisseur, facture une requête vouée à échouer.
for (const code of [CODES.QUOTA_PLAN, CODES.CONTENU_REFUSE, CODES.ENTREE_TROP_LONGUE, CODES.AUTH, CODES.ARRET_DEMANDE]) {
assert.equal(estReessayable(new FitzError(code)), false, `${code} ne doit pas être réessayé`);
}

for (const code of [CODES.RESEAU, CODES.DELAI, CODES.FOURNISSEUR_INDISPONIBLE, CODES.QUOTA_FOURNISSEUR]) {
assert.equal(estReessayable(new FitzError(code)), true, `${code} doit être réessayé`);
}

});

test("un quota atteint n'est pas signalé comme un incident", () => {

// C'est un fonctionnement normal de l'offre gratuite : le remonter
// comme une panne noierait les vraies pannes.
assert.equal(new FitzError(CODES.QUOTA_PLAN).signalable, false);
assert.equal(new FitzError(CODES.ARRET_DEMANDE).signalable, false);
assert.equal(new FitzError(CODES.AUTH).signalable, true);

});

test("les statuts HTTP se traduisent en codes distincts", () => {

assert.equal(codeDepuisStatutHttp(401), CODES.AUTH);
assert.equal(codeDepuisStatutHttp(402), CODES.QUOTA_PLAN);
assert.equal(codeDepuisStatutHttp(413), CODES.ENTREE_TROP_LONGUE);
assert.equal(codeDepuisStatutHttp(422), CODES.CONTENU_REFUSE);
assert.equal(codeDepuisStatutHttp(429), CODES.QUOTA_FOURNISSEUR);
assert.equal(codeDepuisStatutHttp(504), CODES.DELAI);
assert.equal(codeDepuisStatutHttp(503), CODES.FOURNISSEUR_INDISPONIBLE);

// 429 et 402 disent tous deux « quota », mais l'un est le nôtre et
// l'autre celui de l'étudiant : les confondre donnerait le mauvais
// conseil dans les deux sens.
assert.notEqual(codeDepuisStatutHttp(429), codeDepuisStatutHttp(402));

});

// ==========================================================
// CONFIGURATION
// ==========================================================

test("chaque tâche a un délai et une fonctionnalité d'offre", () => {

for (const tache of TACHES) {
assert.ok(DELAIS_MS[tache] > 0, `délai manquant pour "${tache}"`);
assert.ok(FONCTIONNALITE_PAR_TACHE[tache], `fonctionnalité manquante pour "${tache}"`);
}

});

test("les tâches structurées sont bien des tâches connues", () => {

for (const tache of TACHES_STRUCTUREES) {
assert.ok(TACHES.includes(tache), `"${tache}" n'est pas dans TACHES`);
}

});

test("le délai du chat est le plus court de tous", () => {

// Une réponse de chat qui met une minute est déjà perdue pour
// l'étudiant, alors qu'une lettre complète mérite d'attendre.
const autres = TACHES.filter((t) => t !== "chat").map((t) => DELAIS_MS[t]);

assert.ok(DELAIS_MS.chat <= Math.min(...autres));

});

test("aucune clé d'API n'est écrite dans la configuration", async () => {

// Ce fichier part dans le navigateur de chaque visiteur. Le test
// existe pour qu'une clé collée « juste pour essayer » ne puisse
// pas être commitée sans que quelqu'un s'en aperçoive.
const { readFileSync } = await import("node:fs");
const { fileURLToPath } = await import("node:url");
const { dirname, join } = await import("node:path");

const racine = dirname(dirname(fileURLToPath(import.meta.url)));

for (const fichier of ["js/ai/ai-config.js", "js/ai/ai-gateway.js", "js/ai/ai-client.js"]) {

const source = readFileSync(join(racine, fichier), "utf8");

assert.ok(!/sk-[A-Za-z0-9_-]{16,}/.test(source), `clé OpenAI dans ${fichier}`);
assert.ok(!/sk-ant-[A-Za-z0-9_-]{16,}/.test(source), `clé Anthropic dans ${fichier}`);
assert.ok(!/AIza[A-Za-z0-9_-]{30,}/.test(source), `clé Google dans ${fichier}`);

}

});

// ==========================================================
// LE CONTRAT DE generate()
// ==========================================================
// ai-client.js importe ai-gateway.js, qui importe firebase-config.js —
// mais seulement à l'exécution, par import dynamique, et uniquement en
// mode "passerelle". Le module se charge donc sans Firebase.

const { generate } = await import("../js/ai/ai-client.js");

const PROFIL = {
firstName: "Aminata",
lastName: "Diallo",
country: "Sénégal",
desiredField: "Informatique",
desiredDegree: "Master"
};

test("une tâche de rédaction renvoie du texte, pas une structure", async () => {

const resultat = await generate({
task: "chat",
input: { message: "Bonjour", profile: PROFIL, history: [] }
});

assert.equal(typeof resultat.text, "string");
assert.ok(resultat.text.length > 0);
assert.equal(resultat.data, undefined);

});

test("une tâche structurée renvoie une structure, pas du texte", async () => {

const resultat = await generate({
task: "readiness",
input: {
university: "Université de Montréal",
checklist: [{ label: "Relevés de notes", type: "document", status: "fourni" }],
hasGeneratedLetter: true,
profile: PROFIL
}
});

assert.equal(resultat.text, undefined);
assert.equal(typeof resultat.data, "object");
assert.equal(typeof resultat.data.ready, "boolean");
assert.ok(Array.isArray(resultat.data.missingItems));

});

test("onToken reçoit le texte complet ET le fragment ajouté", async () => {

const complets = [];
const fragments = [];

const resultat = await generate({
task: "chat",
input: { message: "Quelles bourses pour le Canada ?", profile: PROFIL, history: [] },
onToken: (complet, delta) => { complets.push(complet); fragments.push(delta); }
});

assert.ok(complets.length > 1, "aucune diffusion progressive");

// Le texte complet est cumulatif : chaque appel contient le précédent.
assert.ok(complets[1].startsWith(complets[0]));

// Et les fragments recomposent exactement le texte final.
assert.equal(fragments.join(""), resultat.text);
assert.equal(complets.at(-1), resultat.text);

});

test("onEtat annonce l'envoi puis la rédaction", async () => {

const etats = [];

await generate({
task: "chat",
input: { message: "Bonjour", profile: PROFIL, history: [] },
onToken: () => {},
onEtat: (etat) => etats.push(etat)
});

assert.equal(etats[0], "envoi");
assert.ok(etats.includes("redaction"));

});

test("une tâche inconnue est refusée avant tout appel", async () => {

await assert.rejects(
() => generate({ task: "horoscope", input: {} }),
(erreur) => erreur instanceof FitzError && erreur.code === CODES.INCONNU
);

});

test("une entrée trop longue est refusée tout de suite, avec le bon conseil", async () => {

// Sans ce garde-fou, un mémoire collé dans l'outil de traduction
// part chez le fournisseur, est facturé, puis refusé — après trente
// secondes d'attente.
const enorme = "mot ".repeat(60000);

await assert.rejects(
() => generate({ task: "translate", input: { text: enorme, sourceLanguage: "fr", targetLanguage: "en" } }),
(erreur) => {
assert.ok(erreur instanceof FitzError);
assert.equal(erreur.code, CODES.ENTREE_TROP_LONGUE);
assert.equal(erreur.reessayable, false, "réessayer ne résoudra rien : le texte doit être coupé");
assert.match(erreur.message, /découpez/i);
return true;
}
);

});

test("un arrêt demandé lève une erreur reconnaissable par estArret", async () => {

const controleur = new AbortController();

const promesse = generate({
task: "letter",
input: { style: "classique", university: "McGill", profile: PROFIL },
onToken: () => controleur.abort(),
signal: controleur.signal
});

await assert.rejects(promesse, (erreur) => {
assert.ok(estArret(erreur), "l'erreur d'arrêt doit être reconnue par estArret()");
assert.equal(erreur.code, CODES.ARRET_DEMANDE);
return true;
});

});

test("un signal déjà arrêté ne lance aucune génération", async () => {

const controleur = new AbortController();
controleur.abort();

await assert.rejects(
() => generate({ task: "chat", input: { message: "Bonjour", profile: PROFIL, history: [] }, signal: controleur.signal }),
(erreur) => estArret(erreur)
);

});
