/**
* ============================================================
* Tests unitaires — la prochaine action
* ============================================================
*
* Lancer : npm test   (ou : node --test test/)
*
* js/next-action.js est une décision pure : aucun DOM, aucun
* Firestore, et la date du jour est un paramètre — c'est ce qui
* permet de se placer ici à trois jours d'une échéance, ou deux jours
* après, sans attendre.
*
* Ce qui est vérifié : le classement par CONSÉQUENCE. Une date limite
* dépassée passe avant un profil incomplet, qui passe avant une étape
* ordinaire, qui passe avant une invitation à explorer. Et surtout :
* une étape dont les prérequis manquent n'est jamais proposée comme
* prochaine action, même si c'est la première non cochée.
* ============================================================
*/

import test from "node:test";
import assert from "node:assert/strict";

import {
PREREQUIS,
JOURS_CRITIQUE,
JOURS_PROCHE,
joursRestants,
qualifierEtapes,
prochaineEtapeFaisable,
prochaineAction,
avertissementsPrematures
} from "../js/next-action.js";

import { PROFILE_READY_THRESHOLD } from "../js/profile-score.js";

const AUJOURDHUI = new Date("2026-08-23T10:00:00Z");

/** Construit les 5 étapes du parcours avec l'état voulu. */
function etapes(faites = []) {

const modele = [
{ id: "profile", label: "Profil complété", href: "profile.html" },
{ id: "checklist", label: "Dossier de candidature", action: "focus-checklist" },
{ id: "letter", label: "Lettre de motivation", href: "ai-letter.html", isFitz: true },
{ id: "readiness", label: "Vérifiée par Fitz", action: "run-readiness", isFitz: true }
];

return modele.map((e) => ({ ...e, done: faites.includes(e.id) }));

}

function candidature(options = {}) {

return {
id: options.id || "app1",
university: options.university || "Université de Montréal",
deadline: options.deadline || null,
etapes: options.etapes || etapes(options.faites || [])
};

}

/** Date au format ISO, décalée de N jours. */
function dans(jours) {

const d = new Date(AUJOURDHUI);
d.setDate(d.getDate() + jours);

return d.toISOString().slice(0, 10);

}

// ==========================================================
// PRÉREQUIS
// ==========================================================

test("les prérequis correspondent aux données réellement consommées", () => {

// La lettre est écrite à partir du profil (js/ai/prompts.js) ; la
// vérification lit la checklist et la lettre ; le conseiller relit
// un dossier déjà vérifié.
assert.deepEqual(PREREQUIS.profile, []);
assert.deepEqual(PREREQUIS.checklist, []);
assert.deepEqual(PREREQUIS.letter, ["profile"]);
assert.deepEqual(PREREQUIS.readiness, ["checklist", "letter"]);
assert.deepEqual(PREREQUIS.advisor, ["readiness"]);

});

test("une étape sans prérequis satisfait est prématurée, pas à faire", () => {

// C'est le statut que le parcours ne savait pas dire : la lettre
// est bien la première étape non cochée, mais la produire
// maintenant donnerait une lettre creuse.
const q = qualifierEtapes(etapes([]));

const lettre = q.find((e) => e.id === "letter");

assert.equal(lettre.etat, "prematuree");
assert.deepEqual(lettre.bloquePar, ["profile"]);
assert.ok(lettre.consequence.length > 30, "une conséquence doit être expliquée");

});

test("une étape devient à faire dès que ses prérequis sont remplis", () => {

const q = qualifierEtapes(etapes(["profile"]));

assert.equal(q.find((e) => e.id === "letter").etat, "a-faire");
assert.equal(q.find((e) => e.id === "profile").etat, "faite");

});

test("la vérification attend SES DEUX prérequis", () => {

const avecUnSeul = qualifierEtapes(etapes(["profile", "letter"]));
assert.equal(avecUnSeul.find((e) => e.id === "readiness").etat, "prematuree");

const avecLesDeux = qualifierEtapes(etapes(["profile", "letter", "checklist"]));
assert.equal(avecLesDeux.find((e) => e.id === "readiness").etat, "a-faire");

});

test("la prochaine étape faisable n'est pas la première non cochée", () => {

// Sur un compte neuf, la première non cochée est « profil » — bien.
assert.equal(prochaineEtapeFaisable(etapes([])).id, "profile");

// Mais profil fait et checklist vide : la première non cochée est
// « checklist », et c'est bien elle — la lettre viendra après.
assert.equal(prochaineEtapeFaisable(etapes(["profile"])).id, "checklist");

// Checklist faite, profil non : la première non cochée est
// « profil ». La lettre reste bloquée derrière lui.
assert.equal(prochaineEtapeFaisable(etapes(["checklist"])).id, "profile");

});

test("aucune étape faisable quand tout est fait", () => {

assert.equal(prochaineEtapeFaisable(etapes(["profile", "checklist", "letter", "readiness"])), null);

});

// ==========================================================
// JOURS RESTANTS
// ==========================================================

test("les jours restants se comptent en jours de calendrier", () => {

assert.equal(joursRestants(dans(0), AUJOURDHUI), 0);
assert.equal(joursRestants(dans(5), AUJOURDHUI), 5);
assert.equal(joursRestants(dans(-2), AUJOURDHUI), -2);

});

test("une date absente ou illisible ne fait pas planter le calcul", () => {

assert.equal(joursRestants(null, AUJOURDHUI), null);
assert.equal(joursRestants("", AUJOURDHUI), null);
assert.equal(joursRestants("bientôt", AUJOURDHUI), null);

});

// ==========================================================
// CLASSEMENT PAR CONSÉQUENCE
// ==========================================================

test("une échéance dépassée passe avant tout le reste", () => {

const action = prochaineAction({
profileScore: 2,                                  // très incomplet
applications: [candidature({ deadline: dans(-2), faites: ["profile"] })],
aujourdhui: AUJOURDHUI
});

assert.equal(action.urgence, "critique");
assert.match(action.texte, /dépassée de 2 jours/);

});

test("une échéance à trois jours est critique, à dix jours seulement haute", () => {

const critique = prochaineAction({
profileScore: 10,
applications: [candidature({ deadline: dans(JOURS_CRITIQUE), faites: ["profile"] })],
aujourdhui: AUJOURDHUI
});

const haute = prochaineAction({
profileScore: 10,
applications: [candidature({ deadline: dans(10), faites: ["profile"] })],
aujourdhui: AUJOURDHUI
});

assert.equal(critique.urgence, "critique");
assert.equal(haute.urgence, "haute");

});

test("au-delà de la fenêtre, l'échéance n'est plus une urgence", () => {

const action = prochaineAction({
profileScore: 10,
applications: [candidature({ deadline: dans(JOURS_PROCHE + 1), faites: ["profile"] })],
aujourdhui: AUJOURDHUI
});

assert.equal(action.urgence, "normale");

});

test("l'action pressée porte une étape FAISABLE, jamais une étape bloquée", () => {

// Échéance dans deux jours, profil incomplet : la lettre serait la
// prochaine étape « logique », mais elle donnerait une lettre
// creuse. C'est le profil qu'il faut faire, même sous la pression —
// surtout sous la pression.
const action = prochaineAction({
profileScore: 3,
applications: [candidature({ deadline: dans(2), faites: [] })],
aujourdhui: AUJOURDHUI
});

assert.equal(action.urgence, "critique");
assert.equal(action.etapeId, "profile");

});

test("un profil incomplet passe avant une étape ordinaire quand une candidature est en cours", () => {

const action = prochaineAction({
profileScore: PROFILE_READY_THRESHOLD - 1,
applications: [candidature({ deadline: null, faites: ["profile"] })],
aujourdhui: AUJOURDHUI
});

assert.equal(action.etapeId, "profile");
assert.equal(action.urgence, "haute");
assert.match(action.texte, /à refaire/);

});

test("sans candidature en cours, le profil reste une action normale", () => {

const action = prochaineAction({
profileScore: 4,
applications: [],
aujourdhui: AUJOURDHUI
});

assert.equal(action.etapeId, "profile");
assert.equal(action.urgence, "normale");

});

test("la candidature la plus pressée l'emporte sur les autres", () => {

const action = prochaineAction({
profileScore: 10,
applications: [
candidature({ id: "loin", university: "McGill", deadline: dans(60), faites: ["profile"] }),
candidature({ id: "proche", university: "Laval", deadline: dans(5), faites: ["profile"] })
],
aujourdhui: AUJOURDHUI
});

assert.equal(action.applicationId, "proche");
assert.match(action.titre, /Laval/);

});

test("une candidature sans date limite passe après celles qui en ont une", () => {

const action = prochaineAction({
profileScore: 10,
applications: [
candidature({ id: "sansdate", university: "Sans date", deadline: null, faites: ["profile"] }),
candidature({ id: "avecdate", university: "Avec date", deadline: dans(40), faites: ["profile"] })
],
aujourdhui: AUJOURDHUI
});

assert.equal(action.applicationId, "avecdate");

});

test("une candidature terminée n'est jamais proposée", () => {

const action = prochaineAction({
profileScore: 10,
applications: [candidature({
deadline: dans(1),
faites: ["profile", "checklist", "letter", "readiness"]
})],
aujourdhui: AUJOURDHUI
});

// Rien à finaliser : on invite à explorer, pas à s'agiter sur une
// candidature déjà bouclée.
assert.equal(action.urgence, "exploration");

});

test("quand tout est prêt, l'action devient une invitation", () => {

const action = prochaineAction({
profileScore: 10,
applications: [],
opportunitesCount: 12,
aujourdhui: AUJOURDHUI
});

assert.equal(action.urgence, "exploration");
assert.match(action.texte, /12 opportunités/);

});

test("l'invitation reste correcte au singulier et à zéro", () => {

const une = prochaineAction({ profileScore: 10, applications: [], opportunitesCount: 1, aujourdhui: AUJOURDHUI });
assert.match(une.texte, /1 opportunité correspond/);

const zero = prochaineAction({ profileScore: 10, applications: [], opportunitesCount: 0, aujourdhui: AUJOURDHUI });
assert.ok(!/0 opportunité/.test(zero.texte), "ne jamais annoncer « 0 opportunité »");

});

test("une action est toujours renvoyée, même sans aucune donnée", () => {

// Le tableau de bord doit toujours avoir quelque chose à afficher :
// une carte vide serait un cul-de-sac.
const action = prochaineAction();

assert.ok(action.titre);
assert.ok(action.cta);
assert.ok(action.href);

});

test("chaque action porte un lien et un libellé de bouton exploitables", () => {

const cas = [
{ profileScore: 2, applications: [] },
{ profileScore: 10, applications: [candidature({ deadline: dans(1), faites: ["profile"] })] },
{ profileScore: 10, applications: [] }
];

for (const c of cas) {

const a = prochaineAction({ ...c, aujourdhui: AUJOURDHUI });

assert.ok(a.href && !a.href.includes("undefined"), `href invalide : ${a.href}`);
assert.ok(a.cta && a.cta.length > 3, `libellé trop court : ${a.cta}`);
assert.ok(["critique", "haute", "normale", "exploration"].includes(a.urgence));

}

});

// ==========================================================
// AVERTISSEMENTS
// ==========================================================

test("un avertissement n'apparaît que quand il ne manque QU'UN prérequis", () => {

// Compte neuf : la vérification est bloquée par deux prérequis à la
// fois. L'annoncer maintenant serait du bruit — et le bruit fait
// ignorer les avertissements qui comptent.
const neuf = avertissementsPrematures(etapes([]));

assert.ok(neuf.every((a) => a.bloquePar.length === 1));
assert.ok(neuf.some((a) => a.id === "letter"), "la lettre, elle, ne manque que du profil");
assert.ok(!neuf.some((a) => a.id === "readiness"), "la vérification manque de deux choses");

});

test("l'avertissement dit la conséquence, pas l'interdiction", () => {

const [premier] = avertissementsPrematures(etapes([]));

assert.ok(premier, "au moins un avertissement attendu");
assert.ok(!/interdit|impossible|bloqué/i.test(premier.consequence),
`formulation bloquante : ${premier.consequence}`);
assert.ok(premier.prerequisLisible && !premier.prerequisLisible.includes("_"),
"le prérequis doit être nommé en français, pas par son identifiant");

});

test("aucun avertissement quand le parcours est propre", () => {

assert.deepEqual(avertissementsPrematures(etapes(["profile", "checklist", "letter", "readiness"])), []);

});
