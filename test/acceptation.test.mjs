/**
* ============================================================
* test/acceptation.test.mjs — l'étudiant accepte le choix de Fitz
* (lot ACCEPTATION, 2026-09-11)
* ============================================================
*
* Décisions de Charles : accepter est définitif ; deux refus par place,
* à la troisième proposition Fitz tranche ; les outils ne s'ouvrent
* qu'après l'acceptation ; les N candidatures d'une formule en vente
* sont un TOTAL (une décision reçue ne libère plus de place) ; le Pass
* Découverte ne mène qu'au chat ; plus de durée en mois.
*
* Tout ce qui est testé ici est PUR (js/fitz-choisit.js,
* js/plan-features.js, js/outil-acceptation.js, functions/lib/achat.js).
* Chaque garde est prouvée par mutation : on montre le cas qui passe, et
* le cas voisin qui ne passe pas. Ce que les règles Firestore font foi
* de se rejoue contre l'émulateur (scripts/rejouer-regles.mjs) ; ce que
* le rendu montre se lit dans le harnais (scripts/verifier/espace.mjs).
* ============================================================
*/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";

import {
REFUS_MAX, PLACES_SANS_PLAFOND, placesAFitz, FORMULES_BOURSE_EN_VENTE, CHAMPS_CHOIX,
carteCatalogue, refusConsommes, refusRestants, etatCarte, estAcceptee, peutRefuser, peutAccepter,
outilsOuverts, candidaturesPourOutils, modeLibreAutorise, statutsAutorises, peutSupprimer, bourseFermee,
etatChoixFitz, decompteBourses, cibleApresPaiement, carteFitz, PHRASE_REGLE
} from "../js/fitz-choisit.js";
import { passSeul, passTermine, joursRestantsPass, PASS_LABEL } from "../js/plan-features.js";
import { blocageOutil, TEXTES_BLOCAGE } from "../js/outil-acceptation.js";
import { STATUTS_DEPOSES, STATUTS_REPONSE } from "../js/journey-map.js";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(racine, f), "utf8").replace(/\r\n/g, "\n");
const require = createRequire(import.meta.url);
const { GRILLE, refusAchat, calculerMiseAJour, FORMULE_SUIVANTE } = require(join(racine, "functions/lib/achat.js"));

const TOUS_STATUTS = ["a_preparer", "en_cours", "deposee", "en_attente", "reponse_recue", "admise", "liste_attente", "refusee"];

const proposee = (extra = {}) => ({ id: "slot-1", programId: "p1", scholarshipId: "b1", universityId: "u1", university: "Alpha", track: "bourse", status: "a_preparer", refus: 0, ...extra });
const acceptee = (extra = {}) => proposee({ accepteeLe: "2026-09-11T10:00:00.000Z", ...extra });
const ancienne = (extra = {}) => ({ id: "slot-9", university: "Université de Nulle Part", status: "a_preparer", ...extra });
const voeu = (extra = {}) => ({ id: "pre-1", university: "Université de Bordeaux", track: "preinscription", status: "a_preparer", ...extra });

// ------------------------------------------------------------------
// 1. L'état d'une carte
// ------------------------------------------------------------------

test("acceptation 1 — trois états pour une carte catalogue, aucun pour une carte qui n'en est pas", () => {
assert.equal(REFUS_MAX, 2);
assert.deepEqual(etatCarte(proposee()), { code: "proposee", sansDate: false });
assert.deepEqual(etatCarte(proposee({ refus: 1 })), { code: "proposee", sansDate: false });
assert.deepEqual(etatCarte(proposee({ refus: 2 })), { code: "finale", sansDate: false });
assert.deepEqual(etatCarte(proposee({ refus: 7 })), { code: "finale", sansDate: false }, "au-delà de 2 (donnée forcée), toujours la proposition finale");
assert.deepEqual(etatCarte(acceptee()), { code: "acceptee", sansDate: false });
assert.deepEqual(etatCarte(acceptee({ refus: 2 })), { code: "acceptee", sansDate: false }, "acceptée après deux refus : acceptée");
// La carte ancienne DÉJÀ déposée sans accepteeLe (donnée d'avant le lot) : acceptée, sans date.
for (const s of STATUTS_DEPOSES) assert.deepEqual(etatCarte(proposee({ status: s })), { code: "acceptee", sansDate: true }, s);
// Pas du catalogue : rien à dire.
assert.equal(etatCarte(ancienne()), null);
assert.equal(etatCarte(voeu({ programId: "p1" })), null, "une préinscription n'est jamais une carte catalogue");
assert.equal(etatCarte(proposee({ programId: "" })), null);
assert.equal(etatCarte(null), null);
assert.equal(carteCatalogue(proposee()), true);
assert.equal(carteCatalogue(ancienne()), false);
});

test("acceptation 2 — refus restants : 2, 1, 0 ; une carte ancienne sans `refus` se lit 0", () => {
assert.equal(refusRestants(proposee()), 2);
assert.equal(refusRestants(proposee({ refus: 1 })), 1);
assert.equal(refusRestants(proposee({ refus: 2 })), 0);
assert.equal(refusRestants(proposee({ refus: 5 })), 0, "jamais négatif");
assert.equal(refusConsommes({}), 0);
assert.equal(refusConsommes({ refus: "2" }), 0, "un refus qui n'est pas un entier se lit 0");
assert.equal(refusConsommes({ refus: -1 }), 0);
});

test("acceptation 3 — refuser : une carte proposée seulement ; accepter : proposée ou finale", () => {
assert.equal(peutRefuser(proposee()), true);
assert.equal(peutRefuser(proposee({ refus: 1 })), true);
assert.equal(peutRefuser(proposee({ refus: 2 })), false, "à la 3ᵉ proposition, Fitz tranche");
assert.equal(peutRefuser(acceptee()), false, "accepter, c'est définitif");
assert.equal(peutRefuser(voeu()), false);
// Carte ancienne hors catalogue : comportement d'avant — refusable tant qu'elle n'est pas déposée.
assert.equal(peutRefuser(ancienne()), true);
assert.equal(peutRefuser(ancienne({ status: "deposee" })), false);

assert.equal(peutAccepter(proposee()), true);
assert.equal(peutAccepter(proposee({ refus: 2 })), true);
assert.equal(peutAccepter(acceptee()), false);
assert.equal(peutAccepter(proposee({ status: "deposee" })), false, "déjà déposée = déjà acceptée");
assert.equal(peutAccepter(ancienne()), false);
assert.equal(peutAccepter(voeu()), false);
});

test("acceptation 4 — le compteur : + 1 par refus, inchangé par une remplaçante ; carteFitz repart à 0", () => {
const rec = { universityName: "Beta", scholarshipTitle: "Bourse Beta", scholarshipId: "b2", programId: "p2", universityId: "u2" };
const carte = carteFitz(rec);
assert.equal(carte.refus, 0, "une carte NEUVE n'a jamais été refusée");
assert.ok(!("accepteeLe" in carte), "une carte neuve n'est pas acceptée");
// Ce que l'appelant écrit ensuite, comme applications.js.
const app = proposee({ refus: 1 });
const refus = { ...carteFitz(rec), refus: refusConsommes(app) + 1 };
const remplacante = { ...carteFitz(rec), refus: refusConsommes(app) };
assert.equal(refus.refus, 2);
assert.equal(remplacante.refus, 1);
// Le piège : sans la réécriture, carteFitz remet le compteur à zéro.
assert.equal({ ...carteFitz(rec) }.refus, 0);
});

// ------------------------------------------------------------------
// 2. Les outils, le formulaire, la suppression
// ------------------------------------------------------------------

test("acceptation 5 — les outils suivent l'acceptation ; le sélecteur ne propose que ce qui est ouvert", () => {
assert.equal(outilsOuverts(proposee()), false);
assert.equal(outilsOuverts(proposee({ refus: 2 })), false);
assert.equal(outilsOuverts(acceptee()), true);
assert.equal(outilsOuverts(proposee({ status: "deposee" })), true, "carte ancienne déposée : acceptée");
assert.equal(outilsOuverts(ancienne()), true, "sans programId : ouverte");
assert.equal(outilsOuverts(voeu()), true, "préinscription : ouverte");
assert.equal(outilsOuverts(null), false);

const liste = [proposee(), acceptee({ id: "slot-2" }), ancienne(), voeu(), proposee({ id: "slot-3", refus: 2 })];
assert.deepEqual(candidaturesPourOutils(liste).map((a) => a.id), ["slot-2", "slot-9", "pre-1"]);
assert.deepEqual(candidaturesPourOutils([]), []);

// ET SEULEMENT LE PARCOURS OÙ L'ON EST (2026-09-17). Mesuré en ligne à
// l'étape 9 de la route — « Vérifier, puis soumettre » un dossier
// Études en France — le sélecteur proposait « Mastercard Foundation
// Scholars Program » et une bourse de théologie turque. L'espace où
// l'on se trouve EST le contexte ; la barre haute suffit à passer à
// l'autre. Preuve par mutation : le filtre retiré → ce test rouge.
assert.deepEqual(candidaturesPourOutils(liste, "preinscription").map((a) => a.id), ["pre-1"]);
assert.deepEqual(candidaturesPourOutils(liste, "bourse").map((a) => a.id), ["slot-2", "slot-9"]);
// Sans parcours, l'ancien comportement — les pages sans espace en vivent.
assert.deepEqual(candidaturesPourOutils(liste, "").map((a) => a.id), ["slot-2", "slot-9", "pre-1"]);
// La candidature NOMMÉE PAR L'URL reste sélectionnable, même venue de
// l'autre parcours : sinon un lien ancien afficherait un sélecteur vide
// en prétendant l'avoir choisie.
assert.deepEqual(candidaturesPourOutils(liste, "preinscription", "slot-2").map((a) => a.id), ["slot-2", "pre-1"]);
assert.deepEqual(candidaturesPourOutils(liste, "preinscription", "slot-3").map((a) => a.id), ["pre-1"], "un créneau fermé ne s'ouvre pas parce que l'URL le nomme");

// LES TROIS OUTILS PASSENT LE PARCOURS ET L'IDENTIFIANT DE L'URL.
for (const page of ["ai-letter.js", "ai-email.js", "ai-check.js"]) {
const src = lire(page);
assert.match(
src,
/candidaturesPourOutils\(trackedApplications, parcoursDOutil\(\{ espace: ctx\.espace \}\), applicationId \|\| ""\)/,
`${page} : le sélecteur propose encore les candidatures de l'autre espace`
);
}
});

test("acceptation 6 — plus de mode libre pour une bourse ; le blocage nomme la porte", () => {
assert.equal(modeLibreAutorise("bourse"), false);
assert.equal(modeLibreAutorise("preinscription"), true);
assert.equal(modeLibreAutorise(""), false, "sans parcours connu : bourse, comme partout");

assert.deepEqual(blocageOutil({ espace: "bourse", application: null }), { code: "aucune", texte: TEXTES_BLOCAGE.aucune, href: "applications.html" });
assert.deepEqual(blocageOutil({ espace: "", application: null }).code, "aucune");
assert.equal(blocageOutil({ espace: "preinscription", application: null }), null, "le mode libre ne reste qu'en préinscription");
assert.deepEqual(blocageOutil({ espace: "bourse", application: proposee() }), { code: "non-acceptee", texte: TEXTES_BLOCAGE["non-acceptee"], href: "applications.html#slot-1" });
assert.equal(blocageOutil({ espace: "bourse", application: acceptee() }), null);
assert.equal(blocageOutil({ espace: "preinscription", application: proposee() }).code, "non-acceptee", "une carte bourse proposée bloque même depuis l'espace préinscription");
assert.equal(blocageOutil({ espace: "bourse", application: voeu() }), null);
assert.equal(blocageOutil({ espace: "bourse", application: ancienne() }), null);
assert.match(TEXTES_BLOCAGE["non-acceptee"], /^Acceptez d'abord cette université dans Mes candidatures/);
assert.match(TEXTES_BLOCAGE.aucune, /^Choisissez d'abord une université acceptée dans Mes candidatures/);
});

test("acceptation 7 — le formulaire : une carte proposée n'offre pas les statuts déposés ; une carte déposée ne redescend pas", () => {
assert.deepEqual(statutsAutorises(proposee(), TOUS_STATUTS), ["a_preparer", "en_cours"]);
assert.deepEqual(statutsAutorises(proposee({ refus: 2 }), TOUS_STATUTS), ["a_preparer", "en_cours"]);
assert.deepEqual(statutsAutorises(acceptee(), TOUS_STATUTS), TOUS_STATUTS, "acceptée, pas déposée : tout");
const DEPOSES_DU_FORMULAIRE = TOUS_STATUTS.filter((s) => STATUTS_DEPOSES.includes(s));
assert.deepEqual(statutsAutorises(acceptee({ status: "deposee" }), TOUS_STATUTS), DEPOSES_DU_FORMULAIRE);
assert.deepEqual(statutsAutorises(proposee({ status: "admise" }), TOUS_STATUTS), DEPOSES_DU_FORMULAIRE, "carte ancienne déposée sans accepteeLe : jamais en arrière");
// Tout le reste : inchangé.
assert.deepEqual(statutsAutorises(ancienne(), TOUS_STATUTS), TOUS_STATUTS);
assert.deepEqual(statutsAutorises(ancienne({ status: "deposee" }), TOUS_STATUTS), TOUS_STATUTS);
assert.deepEqual(statutsAutorises(voeu({ status: "deposee" }), TOUS_STATUTS), TOUS_STATUTS);
assert.deepEqual(statutsAutorises(null, TOUS_STATUTS), TOUS_STATUTS);
// La forme utilisée par applications.js pour redire la garde à l'écriture.
assert.equal(statutsAutorises(proposee(), ["deposee"]).length, 0);
assert.equal(statutsAutorises(acceptee({ status: "deposee" }), ["en_cours"]).length, 0);
});

test("acceptation 8 — la suppression : jamais une carte catalogue pour une formule en vente ; réponse seulement pour une formule retirée", () => {
assert.deepEqual(FORMULES_BOURSE_EN_VENTE, ["premier-dossier", "essentiel-4", "conseiller-6"]);
for (const plan of FORMULES_BOURSE_EN_VENTE) {
assert.equal(peutSupprimer(proposee(), plan), false, `${plan} : proposée`);
assert.equal(peutSupprimer(acceptee(), plan), false, `${plan} : acceptée`);
assert.equal(peutSupprimer(acceptee({ status: "deposee" }), plan), false, `${plan} : déposée`);
for (const s of STATUTS_REPONSE) assert.equal(peutSupprimer(acceptee({ status: s }), plan), false, `${plan} : ${s} — l'historique du dossier reste`);
}
for (const plan of ["essentiel", "accompagnement", "premium", "signature-focus", "signature", "gratuit", ""]) {
assert.equal(peutSupprimer(proposee(), plan), false, `${plan} : proposée`);
assert.equal(peutSupprimer(acceptee(), plan), false, `${plan} : acceptée à préparer`);
assert.equal(peutSupprimer(acceptee({ status: "deposee" }), plan), false, `${plan} : déposée`);
for (const s of STATUTS_REPONSE) assert.equal(peutSupprimer(acceptee({ status: s }), plan), true, `${plan} : ${s} libère la place`);
assert.equal(peutSupprimer(proposee({ status: "refusee" }), plan), true, `${plan} : carte ancienne déposée sans accepteeLe, en réponse`);
}
// Cartes sans programId et vœux : comportement d'avant.
assert.equal(peutSupprimer(ancienne(), "essentiel-4"), false);
assert.equal(peutSupprimer(ancienne({ status: "deposee" }), "essentiel-4"), true);
assert.equal(peutSupprimer(voeu(), "essentiel-4"), true);
assert.equal(peutSupprimer(null, "essentiel-4"), false);
});

test("acceptation 9 — l'exception catalogue : une carte NON déposée dont la bourse est fermée ou retirée", () => {
const ouverte = { id: "b1", isActive: true };
const fermee = { id: "b1", isActive: false };
const prog = { id: "p1" };
assert.equal(bourseFermee(proposee(), { programme: prog, bourse: ouverte }), false);
assert.equal(bourseFermee(proposee(), { programme: prog, bourse: fermee }), true);
assert.equal(bourseFermee(acceptee(), { programme: prog, bourse: fermee }), true, "acceptée mais pas déposée : remplaçable");
assert.equal(bourseFermee(proposee(), { programme: null, bourse: ouverte }), true, "programme supprimé");
assert.equal(bourseFermee(proposee(), { programme: prog, bourse: null }), true, "bourse absente de l'instantané");
assert.equal(bourseFermee(proposee(), { programme: prog, bourse: { id: "b1" } }), false, "isActive absent = active (règle des trois valeurs)");
for (const s of STATUTS_DEPOSES) assert.equal(bourseFermee(acceptee({ status: s }), { programme: null, bourse: fermee }), false, `${s} : le dossier est chez l'organisme`);
assert.equal(bourseFermee(ancienne(), { programme: null, bourse: null }), false, "hors catalogue : rien à remplacer");
assert.equal(bourseFermee(voeu({ programId: "p1" }), { programme: null, bourse: null }), false);
});

// ------------------------------------------------------------------
// 3. La ligne d'état, le singulier, le code `reponses`, Signature
// ------------------------------------------------------------------

test("acceptation 10 — etatChoixFitz au singulier (Premier Dossier), et le code `reponses`", () => {
assert.equal(etatChoixFitz({ quota: 1, nombre: 1, profilPret: true }).texte, "Fitz a choisi votre université");
assert.equal(etatChoixFitz({ quota: 1, nombre: 0, profilPret: false }).texte, "Complétez votre profil : Fitz choisira votre université dès qu'il vous connaît");
assert.equal(etatChoixFitz({ quota: 4, nombre: 4, profilPret: true }).texte, "Fitz a choisi vos 4 universités");
assert.ok(!/vos 1 /.test(etatChoixFitz({ quota: 1, nombre: 1, profilPret: true }).texte), "jamais « vos 1 universités »");

const rep = etatChoixFitz({ quota: 4, nombre: 4, profilPret: true, reponses: 4 });
assert.equal(rep.code, "reponses");
assert.equal(rep.texte, "Toutes vos candidatures ont reçu une réponse. L'équipe FitzUniverse vous indiquera la suite ici.");
assert.equal(rep.lienProfil, false);
assert.equal(etatChoixFitz({ quota: 4, nombre: 4, profilPret: true, reponses: 3 }).code, "complet", "une réponse manque : complet");
assert.equal(etatChoixFitz({ quota: 1, nombre: 1, profilPret: true, reponses: 1 }).code, "reponses");
assert.equal(etatChoixFitz({ quota: 4, nombre: 4, profilPret: true }).code, "complet", "reponses absent = 0");
});

test("acceptation 11 — Signature (quota Infinity) : Fitz remplit 12 places, jamais l'infini", () => {
assert.equal(PLACES_SANS_PLAFOND, 12);
assert.equal(placesAFitz(Infinity), 12);
assert.equal(placesAFitz(4), 4);
assert.equal(placesAFitz(1), 1);
assert.equal(placesAFitz(0), 0);
assert.equal(placesAFitz(null), 0);
assert.equal(placesAFitz(undefined), 0);
// Et le bouton « Nouvelle candidature » n'existe plus que pour la préinscription.
const js = lire("applications.js");
assert.match(js, /const creationManuelle = ESPACE_ECRITURE === "preinscription";/);
// RÉÉCRIT EN CONSCIENCE le 2026-09-13 (lot ESPACE-ÉTUDIANT).
// Cette assertion photographiait l'EXPRESSION —
// `placesAFitz(plan ? plan.maxAccompaniedApplications : null)` — et non
// la règle. Le lot a déplacé la lecture du quota dans
// js/parcours-quota.js (une seule définition pour la page et pour le
// hub) : l'expression a changé, la règle n'a pas bougé. On vérifie
// donc ce qui compte vraiment, et un cran plus dur qu'avant :
//   1. le plafonnement passe toujours par placesAFitz ;
//   2. le quota vient de la définition unique, pas d'une relecture du
//      champ à la main ici.
const sansCom = (src) => src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
const seed = sansCom(js.slice(js.indexOf("async function seedRecommendedSlots"), js.indexOf("function initApplicationsPage")));
assert.match(seed, /placesAFitz\(/, "seedRecommendedSlots ne plafonne plus le quota infini");
assert.match(seed, /quotaDeLaFormule\(/, "seedRecommendedSlots relit le quota au lieu de passer par la définition unique");
assert.ok(!/maxAccompaniedApplications/.test(seed), "seedRecommendedSlots relit le champ de quota à la main");
assert.ok(!/removeApplication[\s\S]*Fitz proposera une autre université pour cette place/.test(js), "la phrase « Fitz proposera une autre université pour cette place » a disparu");
});

test("acceptation 12 — le décompte de l'admin par statut, et le signal « toutes répondues »", () => {
const cartes = [
{ status: "admise" }, { status: "admise" }, { status: "refusee" }, { status: "liste_attente" },
{ status: "a_preparer", track: "preinscription" }
];
const d = decompteBourses(cartes, 4);
assert.equal(d.ligne, "2 admises · 1 refusée · 1 en liste d'attente");
assert.equal(d.repondues, 4);
assert.equal(d.toutesRepondues, true);
assert.equal(decompteBourses(cartes, 6).toutesRepondues, false, "6 places, 4 cartes : pas toutes");
assert.equal(decompteBourses([{ status: "admise" }, { status: "en_attente" }], 2).toutesRepondues, false);
assert.equal(decompteBourses([{ status: "admise" }, { status: "en_attente" }], 2).ligne, "1 admise · 1 en attente");
assert.equal(decompteBourses([], 4).ligne, "");
assert.equal(decompteBourses([{ status: "admise" }], Infinity).toutesRepondues, false, "sans plafond, jamais « toutes »");
});

// ------------------------------------------------------------------
// 4. Les formules : le Pass seul, la cible d'après paiement, l'achat
// ------------------------------------------------------------------

const DEMAIN = new Date(Date.now() + 86400000 * 9).toISOString();
const HIER = new Date(Date.now() - 86400000).toISOString();

test("acceptation 13 — passSeul : les quatre conditions, sur une session ou un document brut", () => {
assert.equal(PASS_LABEL, "Pass Découverte");
// Session (resolveSession).
assert.equal(passSeul({ hasFitzExpress: true, planId: "gratuit", planPreinscriptionId: "", testerAccess: false }), true);
assert.equal(passSeul({ hasFitzExpress: false, planId: "gratuit", planPreinscriptionId: "" }), false, "pas de Pass");
assert.equal(passSeul({ hasFitzExpress: true, planId: "essentiel-4", planPreinscriptionId: "" }), false, "une formule bourse");
assert.equal(passSeul({ hasFitzExpress: true, planId: "gratuit", planPreinscriptionId: "diagnostic-france" }), false, "une offre préinscription");
assert.equal(passSeul({ hasFitzExpress: true, planId: "gratuit", planPreinscriptionId: "", testerAccess: true }), false, "testeur");
// Document users/{uid} brut.
assert.equal(passSeul({ fitzExpressExpiresAt: DEMAIN }), true);
assert.equal(passSeul({ fitzExpressExpiresAt: HIER }), false, "Pass expiré");
assert.equal(passSeul({ fitzExpressExpiresAt: DEMAIN, plan: "premier-dossier" }), false);
assert.equal(passSeul({ fitzExpressExpiresAt: DEMAIN, plan: "essentiel-4", planExpiresAt: HIER }), true, "formule bourse expirée : il ne reste que le Pass");
assert.equal(passSeul({ fitzExpressExpiresAt: DEMAIN, planPreinscription: "dossier-france", planPreinscriptionExpiresAt: DEMAIN }), false);
assert.equal(passSeul({ fitzExpressExpiresAt: DEMAIN, planPreinscription: "dossier-france", planPreinscriptionExpiresAt: HIER }), true, "offre préinscription expirée");
assert.equal(passSeul({}), false);
assert.equal(passSeul(null), false);
});

test("acceptation 14 — passTermine et le temps qui reste", () => {
assert.equal(passTermine({ fitzExpressExpiresAt: DEMAIN }), null, "pas terminé");
assert.ok(passTermine({ fitzExpressExpiresAt: HIER }) instanceof Date);
assert.equal(passTermine({ fitzExpressExpiresAt: HIER, plan: "essentiel-4" }), null, "une formule ouvre le chat");
assert.equal(passTermine({ fitzExpressExpiresAt: HIER, planPreinscription: "dossier-france", planPreinscriptionExpiresAt: DEMAIN }), null);
assert.ok(passTermine({ fitzExpressExpiresAt: HIER, planPreinscription: "diagnostic-france", planPreinscriptionExpiresAt: DEMAIN }) instanceof Date, "le Diagnostic n'ouvre pas le chat");
assert.equal(passTermine({}), null);

const maintenant = Date.parse("2026-09-11T12:00:00Z");
assert.equal(joursRestantsPass("2026-09-20T12:00:00Z", maintenant), "9 jours restants");
assert.equal(joursRestantsPass("2026-09-12T06:00:00Z", maintenant), "moins d'1 jour restant");
assert.equal(joursRestantsPass("2026-09-10T12:00:00Z", maintenant), "", "expiré : rien");
assert.equal(joursRestantsPass(null, maintenant), "");
});

test("acceptation 15 — le Pass seul est renvoyé au chat, sauf trois pages ; sa navigation ne montre que ça", () => {
const shell = lire("js/app-shell.js");
assert.match(shell, /export const PAGES_DU_PASS = \["ai-chat\.html", "messages\.html", "account\.html"\];/);
assert.match(shell, /if \(seulementLePass && !PAGES_DU_PASS\.includes\(pageCourante\(\)\)\) \{\s*window\.location\.replace\("ai-chat\.html"\);/);
// Le renvoi est décidé AVANT la garde d'espace et avant tout rendu.
assert.ok(shell.indexOf("const seulementLePass = passSeul(session);") < shell.indexOf("const espaceUtilisateur = resoudreEspace(session);"));
assert.match(shell, /seulementLePass \? PASS_LABEL : PLAN_LABELS\[session\.planId\]/, "la pastille dit « Pass Découverte », jamais « Gratuit »");
const nav = lire("js/mobile-nav.js");
assert.match(nav, /function appliquerPassSeul\(\)/);
assert.match(nav, /appliquerPassSeul \};$/m);
assert.match(nav, /\.mnav-menu-site"\)\.forEach\(\(el\) => el\.remove\(\)\)/, "« Accueil du site » et « Formules » quittent la feuille");
// Le chat : la fin du Pass, avec sa date.
const chat = lire("ai-chat.js");
assert.match(chat, /Votre Pass Découverte s'est terminé le \$\{escapeHtml\(finDuPass\.toLocaleDateString\("fr-FR"/);
assert.match(chat, /\. Pour continuer avec Fitz, choisissez une formule\.<\/p>/);
assert.match(chat, /const finDuPass = passTermine\(ctx\.userData\);/);
assert.match(chat, /<span>Voir les formules<\/span>/);
assert.match(chat, /\$\{PASS_LABEL\} — \$\{restant\}/, "« Pass Découverte — 9 jours restants »");
// Les paramètres.
assert.match(lire("account.js"), /\$\{PASS_LABEL\} — actif jusqu'au \$\{formatDateFR\(userData\.fitzExpressExpiresAt\)\} : vos questions à Fitz/);
});

test("acceptation 16 — plus aucun texte visible « Fitz Express » ou « Pass Express » (identifiants et commentaires exceptés)", () => {
const fichiers = ["admin/student-detail.html", "admin/student-detail.js", "admin/students.js", "account.js", "ai-chat.js", "dashboard.js", "applications.js", "js/app-shell.js", "js/plan-features.js", "offers.html", "payment.html", "payment.js", "espace-bourse.html", "espace-preinscription.html", "index.html", "ai-chat.html"];
for (const f of fichiers) {
const src = lire(f)
// On retire les commentaires (HTML, /* */ et //) : seuls les TEXTES visibles comptent.
.replace(/<!--[\s\S]*?-->/g, "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
assert.ok(!/Fitz Express|Pass Express/.test(src), `${f} affiche encore « Fitz Express » / « Pass Express »`);
}
assert.match(lire("admin/student-detail.html"), /<h3>Pass Découverte<\/h3>/);
assert.match(lire("admin/student-detail.js"), /"Aucun Pass Découverte actif\."/);
});

test("acceptation 17 — cible après paiement : chaque formule mène exactement à sa prochaine étape", () => {
const PRET = { nationality: "Sénégal", desiredDegree: "Master", desiredField: "Informatique", languages: ["français"] };
assert.equal(cibleApresPaiement("fitzExpress", {}), "ai-chat.html");
assert.equal(cibleApresPaiement("fitzExpress", PRET), "ai-chat.html", "le Pass ne mène qu'au chat, profil ou pas");
assert.equal(cibleApresPaiement("premier-dossier", {}), "profile.html?pour=fitz");
assert.equal(cibleApresPaiement("premier-dossier", PRET), "applications.html");
assert.equal(cibleApresPaiement("essentiel-4", { ...PRET, nationality: "" }), "profile.html?pour=fitz");
assert.equal(cibleApresPaiement("conseiller-6", PRET), "applications.html");
assert.equal(cibleApresPaiement("diagnostic-france", {}), "diagnostic-france.html");
assert.equal(cibleApresPaiement("dossier-france", {}), "espace-preinscription.html?action=new");
assert.equal(cibleApresPaiement("dossier-france-conseiller", {}), "espace-preinscription.html?action=new");
// profile.js : le bandeau et le renvoi, sur la MÊME fonction que le remplissage.
const profil = lire("profile.js");
assert.match(profil, /import \{ profilPretPourFitz \} from "\.\/js\/fitz-choisit\.js"/);
assert.match(profil, /get\("pour"\) === "fitz"/);
assert.match(profil, /Fitz a besoin de ces informations pour choisir \$\{escapeHtml\(objet\)\} : <strong>\$\{escapeHtml\(manquants\.join\(", "\)\)\}<\/strong>/);
assert.match(profil, /if \(POUR_FITZ && profilPretPourFitz\(updatedProfile\)\.pret\) \{\s*window\.location\.href = "applications\.html";/);
assert.match(lire("profile.html"), /id="fitzProfilBandeau"/);
});

test("acceptation 18 — dureeMois null pour essentiel-4 et conseiller-6 ; planExpiresAt effacé à l'activation ; les retirées gardent leurs mois", () => {
const SUPPRIMER = Symbol("delete");
for (const id of ["premier-dossier", "essentiel-4", "conseiller-6"]) {
assert.equal(GRILLE[id].dureeMois, null, id);
const r = calculerMiseAJour({ planId: id, user: { plan: "gratuit" }, maintenant: new Date("2026-09-11T10:00:00Z"), supprimer: SUPPRIMER });
assert.equal(r.statut, "applique");
assert.equal(r.misAJour.plan, id);
assert.equal(r.misAJour.planExpiresAt, SUPPRIMER, `${id} : planExpiresAt effacé`);
}
// Un compte qui portait une échéance (essentiel, retirée) et monte : l'échéance est effacée aussi.
const monte = calculerMiseAJour({ planId: "conseiller-6", user: { plan: "essentiel", planExpiresAt: "2027-01-01T00:00:00.000Z" }, maintenant: new Date("2026-09-11T10:00:00Z"), supprimer: SUPPRIMER });
assert.equal(monte.statut, "applique");
assert.equal(monte.misAJour.planExpiresAt, SUPPRIMER);
assert.equal(GRILLE.essentiel.dureeMois, 6);
assert.equal(GRILLE.accompagnement.dureeMois, 9);
assert.equal(GRILLE["signature-focus"].dureeMois, 9);
assert.equal(GRILLE.signature.dureeMois, 12);
// Les quotas miroir de pricing-plans.js.
assert.equal(GRILLE["premier-dossier"].quota, 1);
assert.equal(GRILLE["essentiel-4"].quota, 4);
assert.equal(GRILLE["conseiller-6"].quota, 6);
assert.equal(GRILLE.accompagnement.quota, 9);
});

test("acceptation 19 — les trois refus d'achat : même formule (active ou terminée), aucune place, Pass à un compte qui a le chat", () => {
const maintenant = new Date("2026-09-11T10:00:00Z");
assert.deepEqual(FORMULE_SUIVANTE, { "premier-dossier": "essentiel-4", "essentiel-4": "conseiller-6", "conseiller-6": null });

// 1. La même formule, active : nomme la formule détenue et la suivante.
let r = refusAchat({ planId: "premier-dossier", user: { plan: "premier-dossier" }, nombreCartesBourse: 1, maintenant });
assert.equal(r.code, "meme-formule");
assert.equal(r.message, "Vous détenez déjà le Forfait Premier Dossier : il n'a pas d'échéance, et vos candidatures sont suivies jusqu'à la décision des universités. Pour plus de candidatures, passez au Forfait Essentiel.");
r = refusAchat({ planId: "essentiel-4", user: { plan: "essentiel-4" }, nombreCartesBourse: 4, maintenant });
assert.equal(r.message, "Vous détenez déjà le Forfait Essentiel : il n'a pas d'échéance, et vos candidatures sont suivies jusqu'à la décision des universités. Pour plus de candidatures, passez au Forfait Conseiller.");
r = refusAchat({ planId: "conseiller-6", user: { plan: "conseiller-6" }, nombreCartesBourse: 6, maintenant });
assert.equal(r.message, "Vous détenez déjà le Forfait Conseiller : il n'a pas d'échéance, et vos candidatures sont suivies jusqu'à la décision des universités. Une fois vos décisions reçues, l'équipe FitzUniverse vous indiquera la suite.");
// La même formule, TERMINÉE par l'admin : refusée aussi, autre message.
r = refusAchat({ planId: "essentiel-4", user: { plan: "essentiel-4", planExpiresAt: "2026-09-01T00:00:00.000Z" }, nombreCartesBourse: 4, maintenant });
assert.equal(r.code, "meme-formule-terminee");
assert.equal(r.message, "Votre Forfait Essentiel est terminé. L'équipe FitzUniverse vous indiquera la suite dans votre espace.");

// 2. Aucune place nouvelle.
r = refusAchat({ planId: "conseiller-6", user: { plan: "accompagnement", planExpiresAt: "2027-03-01T00:00:00.000Z" }, nombreCartesBourse: 9, maintenant });
assert.equal(r.code, "aucune-place");
assert.equal(r.message, "Cet achat n'ouvrirait aucune nouvelle place : vous avez déjà 9 candidatures. L'équipe FitzUniverse vous indiquera la suite.");
r = refusAchat({ planId: "essentiel-4", user: { plan: "conseiller-6", planExpiresAt: "2026-09-01T00:00:00.000Z" }, nombreCartesBourse: 6, maintenant });
assert.equal(r.code, "aucune-place", "un conseiller-6 terminé qui prend essentiel-4");
r = refusAchat({ planId: "essentiel-4", user: { plan: "premier-dossier" }, nombreCartesBourse: 4, maintenant });
assert.equal(r.code, "aucune-place", "quota égal au nombre de cartes : rien de nouveau");
// Monter reste possible quand de nouvelles places s'ouvrent.
assert.equal(refusAchat({ planId: "conseiller-6", user: { plan: "essentiel-4" }, nombreCartesBourse: 4, maintenant }), null, "essentiel-4 → conseiller-6 : slot-5 et slot-6");
assert.equal(refusAchat({ planId: "essentiel-4", user: { plan: "premier-dossier" }, nombreCartesBourse: 1, maintenant }), null);
assert.equal(refusAchat({ planId: "premier-dossier", user: {}, nombreCartesBourse: 0, maintenant }), null, "un premier achat");

// 3. Le Pass à un compte qui a déjà le chat.
r = refusAchat({ planId: "fitzExpress", user: { plan: "essentiel-4" }, maintenant });
assert.deepEqual(r, { code: "pass-inclus", message: "Votre formule comprend déjà Discuter avec Fitz." });
assert.equal(refusAchat({ planId: "fitzExpress", user: { plan: "dossier-france", planPreinscription: "dossier-france", planPreinscriptionExpiresAt: "2027-07-31T00:00:00.000Z" }, maintenant }).code, "pass-inclus");
assert.equal(refusAchat({ planId: "fitzExpress", user: { planPreinscription: "diagnostic-france", planPreinscriptionExpiresAt: "2027-07-31T00:00:00.000Z" }, maintenant }), null, "le Diagnostic n'a pas le chat");
assert.equal(refusAchat({ planId: "fitzExpress", user: { plan: "essentiel-4", planExpiresAt: "2026-09-01T00:00:00.000Z" }, maintenant }), null, "formule terminée : le Pass se vend");
assert.equal(refusAchat({ planId: "fitzExpress", user: { fitzExpressExpiresAt: "2026-09-20T00:00:00.000Z" }, maintenant }), null, "prolonger son Pass reste possible");
assert.equal(refusAchat({ planId: "fitzExpress", user: {}, maintenant }), null);

// Les offres préinscription ne passent pas par ces refus.
assert.equal(refusAchat({ planId: "dossier-france", user: { plan: "essentiel-4" }, nombreCartesBourse: 4, maintenant }), null);
assert.equal(refusAchat({ planId: "inconnue", user: {}, maintenant }), null);

// creerPaiement l'appelle AVANT la facture, avec le nombre de cartes bourses.
const paiement = lire("functions/paiement.js");
assert.match(paiement, /const refus = refusAchat\(\{ planId, user: profil, nombreCartesBourse \}\);/);
assert.ok(paiement.indexOf("refusAchat({") < paiement.indexOf("checkout-invoice/create"), "le refus arrive avant que le moindre franc ne bouge");
assert.match(paiement, /track !== "preinscription"\)\.length/);
assert.ok(!paiement.includes("Vous détenez déjà le Forfait Premier Dossier, et il n'expire pas"), "l'ancien message, qui ne parlait que de Premier Dossier, a disparu");
});

// ------------------------------------------------------------------
// 5. Les textes : offers.html, payment.html, la phrase de la règle
// ------------------------------------------------------------------

test("acceptation 20 — offers.html sans « mois d'accompagnement », la nouvelle règle partout, la FAQ réécrite", () => {
const offers = lire("offers.html").replace(/<!--[\s\S]*?-->/g, "");
assert.ok(!/mois d'accompagnement/.test(offers), "plus de « 6 mois » ni « 9 mois d'accompagnement »");
assert.ok(!/terminer une candidature libère sa place/.test(offers));
assert.ok(!/à la fois<\/strong>/.test(offers));
assert.ok(offers.includes("Vous payez une formule, en une fois, sans abonnement. Elle couvre un nombre de candidatures, travaillées <strong>en même temps</strong> et suivies chacune jusqu'à la décision de l'université."));
assert.ok(offers.includes(PHRASE_REGLE), "la règle d'offers.html est le littéral de js/fitz-choisit.js");
assert.equal((offers.match(/jusqu'à deux fois par place\. Une fois acceptée, une université ne se change plus\./g) || []).length, 2, "la règle (colonne bourses) et la FAQ « Qui choisit »");
assert.ok(offers.includes("<span>Jusqu'à quand suis-je accompagné ?</span>"));
assert.ok(!offers.includes("si mon abonnement se termine avant d'avoir une réponse"));
assert.ok(offers.includes("Les formules bourses n'ont pas de durée : elles couvrent un nombre de candidatures, et chacune est suivie jusqu'à la décision de l'université. Quand toutes vos réponses sont arrivées, l'équipe FitzUniverse vous indique la suite dans votre espace. Le Pass Découverte et le Diagnostic France durent 14 jours ; les Dossiers France suivent la campagne Études en France, jusqu'au 31 juillet."));
assert.ok(offers.includes("Le nombre de candidatures dépend de votre formule ; elles avancent toutes en même temps."));
// Ce qui ne change pas.
assert.ok(offers.includes("1 candidature, sans abonnement"));
assert.equal((offers.match(/<span class="plan-price-term">14 jours<\/span>/g) || []).length, 2, "Pass et Diagnostic");
assert.ok(offers.includes("une campagne, jusqu'au 31 juillet"));
// payment.html : la ligne « Durée » se masque d'elle-même quand `duration` est absent.
assert.match(lire("payment.js"), /durationRow\.style\.display = plan\.duration \? "" : "none"/);
// Le compte : « Sans échéance … » pour une formule bourses sans durée.
assert.match(lire("account.js"), /Sans échéance : chaque candidature est suivie jusqu'à la décision de l'université\./);
assert.ok(!lire("account.html").includes("libère sa place"));
// L'admin : le mot pour Charles, et aucun nouveau pouvoir (pas de suppression).
const adminJs = lire("admin/student-detail.js");
assert.match(adminJs, /Sans échéance : la formule reste active jusqu'à votre décision\. Pour y mettre fin, fixez une date ci-dessous\./);
assert.match(adminJs, /Les \$\{quota\} candidatures ont reçu une réponse : à vous de décider la suite \(formule, date de fin, message\)\./);
assert.ok(!/deleteDoc\([^)]*applications/.test(adminJs), "l'admin ne supprime toujours pas les candidatures");
});

test("acceptation 21 — les champs du choix et les règles serveur : ce que le client écrit, les règles l'exigent", () => {
assert.deepEqual(CHAMPS_CHOIX, ["programId", "scholarshipId", "universityId", "university", "scholarship"]);
const regles = lire("firestore.rules");
assert.match(regles, /function champsChoix\(\) \{\s*return \["programId", "scholarshipId", "universityId", "university", "scholarship"\];/);
assert.match(regles, /request\.resource\.data\.accepteeLe == request\.time/, "accepteeLe = heure du serveur");
assert.match(regles, /refusApres\(\) <= 2/, "deux refus par place");
assert.match(regles, /bourseActive\(programmeDe\(d\)\.get\('scholarshipId', null\)\)/, "toute écriture d'un choix exige une bourse active");
assert.match(regles, /request\.resource\.data\.get\('track', 'bourse'\) == resource\.data\.get\('track', 'bourse'\)/, "le parcours ne change jamais");
assert.match(regles, /!\(planOf\(uid\) in \['premier-dossier', 'essentiel-4', 'conseiller-6'\]\)/, "une formule en vente ne supprime jamais une carte catalogue");
assert.match(regles, /function universitesRefuseesGrandit\(\)/);
// Le client : refus + 1, accepteeLe retiré pour une remplaçante, accepteeLe posé au rattrapage.
const js = lire("applications.js");
assert.match(js, /refus: refusConsommes\(app\) \+ 1,/);
assert.match(js, /refus: refusConsommes\(app\),\s*accepteeLe: deleteField\(\),/);
assert.match(js, /if \(lien\.programId && !app\.accepteeLe\) patch\.accepteeLe = serverTimestamp\(\);/);
assert.match(js, /if \(editingId\) delete payload\.track;/, "en édition, le parcours n'est pas renvoyé");
assert.match(js, /Après acceptation, vous ne pourrez plus changer cette université\./);
assert.match(js, /Après acceptation, vous ne pourrez plus changer ces universités\./);
assert.match(js, /Fitz a fait sa proposition finale pour cette place\. Si cette université pose un vrai problème, <a href="messages\.html#supportCard">écrivez-nous<\/a>\./);
assert.match(js, /Cette bourse a été fermée par l'organisme : Fitz vous propose une remplaçante\./);
assert.match(js, /Acceptez cette université pour commencer votre dossier\./);
});
