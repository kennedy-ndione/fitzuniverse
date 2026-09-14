/**
* ============================================================
* test/voie-admission.test.mjs — les 8 universités sans portail
* ============================================================
*
* LE DÉFAUT RÉPARÉ (lot PORTAILS, 2026-09-14). 147 universités sur 155
* portent un portail d'admission. Les 8 autres n'en ont pas, et c'est un
* fait vérifié à la source : trois marocaines qui n'acceptent QUE la voie
* diplomatique (« Tout dossier non transmis par l'AMCI ne sera pas pris
* en considération »), quatre tunisiennes dont l'entrée est la procédure
* nationale du ministère, et Genève qui en a un.
*
* Le hub et la fiche se TAISAIENT sur ces huit-là : `liensDOpportunite`
* n'émet pas d'orientation quand le portail d'admission manque, par
* prudence — « on n'annonce jamais une porte qu'on ne montre pas ». La
* prudence était juste et le résultat le pire possible : un étudiant
* accompagné vers le Maroc pouvait guetter des mois l'ouverture d'un
* portail qui n'existe pas, et manquer la seule date qui comptait.
*
* Un champ vide est une réponse. Encore faut-il qu'elle soit DITE.
* ============================================================
*/

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
VOIES_ADMISSION,
lireVoieAdmission,
phraseVoieAdmission,
resumeVoieAdmission,
libelleVoieAdmission,
defautsDesVoies
} from "../js/voie-admission.js";

import { liensDOpportunite } from "../js/portails-opportunite.js";

const RACINE = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const lire = (f) => fs.readFileSync(path.join(RACINE, f), "utf8");

// ==========================================================
// LE VOCABULAIRE
// ==========================================================

test("voie 1 — le vocabulaire est fermé, et chaque voie dit qu'il n'y a PAS de portail", () => {

// La garde qui compte : une explication qui ne dit pas ce qu'il ne
// faut PAS attendre laisse l'étudiant guetter un portail qui
// n'existera jamais. C'est exactement le défaut réparé.
assert.deepEqual(defautsDesVoies(), []);

assert.deepEqual(Object.keys(VOIES_ADMISSION).sort(),
["depot_sur_place", "procedure_nationale_ministere", "voie_diplomatique_amci"]);

for (const [code, meta] of Object.entries(VOIES_ADMISSION)) {
assert.ok(meta.libelle && meta.libelle.trim(), code);
assert.ok(meta.explication && meta.explication.length >= 120, code);
assert.ok(meta.resume && meta.resume.trim(), `${code} : pas de résumé pour la carte`);
// Aucun des deux textes ne doit tutoyer le jargon : ce sont des
// textes que l'étudiant lit, pas des notes internes.
for (const texte of [meta.explication, meta.resume]) {
assert.ok(!/applicationPortalUrl|entryPoint|catalogue|champ/i.test(texte),
`${code} : jargon technique dans un texte lu par l'étudiant`);
}
}

});

test("voie 1 bis — LA MESURE QUI A CHANGÉ LE VOCABULAIRE : le résumé tient sur une carte", () => {

// DEUX MESURES, DEUX CORRECTIONS, ET C'EST LE BANC D'ESSAI QUI A
// TRANCHÉ LES DEUX FOIS.
//
// 1. La première version n'avait qu'`explication` : 467 signes posés
//    sur la carte d'opportunité, quand les trois orientations
//    existantes en font 68, 96 et 109. Sur quatre à six cartes, le hub
//    n'aurait plus rien montré que ça. D'où deux longueurs.
// 2. Le premier résumé faisait 175 signes. Seul, il tenait en cinq
//    lignes — mais il S'AJOUTE à l'orientation de la bourse, et sur une
//    bourse tunisienne déposée chez le bailleur l'ensemble montait à
//    269 signes et HUIT lignes, mesurées au navigateur. Le plafond est
//    donc 110, pas 200.
//
// Les deux fois, la lecture du code disait « c'est une phrase, ça
// passera » ; les deux fois, la mesure disait non.
for (const [code, meta] of Object.entries(VOIES_ADMISSION)) {
assert.ok(meta.resume.length <= 110,
`${code} : résumé de ${meta.resume.length} signes — il s'ajoute à l'orientation de la bourse (jusqu'à 109) et la carte devient un paragraphe`);
assert.ok(meta.resume.length < meta.explication.length,
`${code} : le résumé n'est pas plus court que l'explication`);
// Et les DEUX disent qu'il n'y a pas de portail : le résumé est
// celui que l'étudiant lira, c'est lui qui doit porter le fait.
assert.match(meta.resume, /pas de portail|ne reçoit pas|aucun dépôt/i, code);
}

// Le hub prend la courte, la fiche la longue.
const ctx = { universite: { voieAdmission: "voie_diplomatique_amci" } };
assert.equal(resumeVoieAdmission(ctx), VOIES_ADMISSION.voie_diplomatique_amci.resume);
assert.equal(phraseVoieAdmission(ctx), VOIES_ADMISSION.voie_diplomatique_amci.explication);
assert.ok(resumeVoieAdmission(ctx).length < phraseVoieAdmission(ctx).length);

assert.ok(lire("js/portails-opportunite.js").includes("resumeVoieAdmission("),
"le hub prend la version longue : elle noiera la carte");
assert.ok(lire("details.js").includes("phraseVoieAdmission("),
"la fiche prend la version courte : elle a la place de la longue");

// Et le garde du portail vaut pour les deux lectures.
const avecPortail = { portailAdmission: "https://apply.example/", universite: { voieAdmission: "depot_sur_place" } };
assert.equal(resumeVoieAdmission(avecPortail), "");
assert.equal(phraseVoieAdmission(avecPortail), "");
assert.doesNotThrow(() => resumeVoieAdmission());
assert.equal(resumeVoieAdmission(), "");

});

test("voie 2 — LA RÈGLE DES TROIS VALEURS : absent = inconnu, jamais « dépôt normal »", () => {

assert.equal(lireVoieAdmission({}), "");
assert.equal(lireVoieAdmission(null), "");
assert.equal(lireVoieAdmission(undefined), "");
assert.equal(lireVoieAdmission({ voieAdmission: "" }), "");
assert.equal(lireVoieAdmission({ voieAdmission: "   " }), "");

// Un code inconnu — ajouté un jour à la main dans l'admin — est
// IGNORÉ, jamais rendu brut : « voie_diplomatique_amci_bis » affiché
// tel quel sur une fiche publique serait pire que rien.
assert.equal(lireVoieAdmission({ voieAdmission: "voie_diplomatique_amci_bis" }), "");
assert.equal(phraseVoieAdmission({ universite: { voieAdmission: "n_importe_quoi" } }), "");
assert.equal(libelleVoieAdmission("n_importe_quoi"), "");

// Un type inattendu ne fait pas planter le rendu de la carte.
assert.equal(lireVoieAdmission({ voieAdmission: 42 }), "");
assert.equal(lireVoieAdmission({ voieAdmission: ["amci"] }), "");

// Les codes connus passent, espaces compris.
assert.equal(lireVoieAdmission({ voieAdmission: " depot_sur_place " }), "depot_sur_place");

});

test("voie 3 — LE PORTAIL PASSE DEVANT : la phrase s'éteint toute seule", () => {

const uni = { voieAdmission: "voie_diplomatique_amci" };

// C'est la garde qui rend le champ sûr dans le temps : le jour où une
// de ces huit universités ouvrira un portail, la phrase disparaîtra
// sans qu'on ait à retirer le code — et surtout, elle ne fera jamais
// douter d'un portail qui existe.
assert.equal(phraseVoieAdmission({ portailAdmission: "https://apply.example/", universite: uni }), "");
assert.equal(phraseVoieAdmission({ portailAdmission: "   ", universite: uni }).length > 0, true,
"un portail fait d'espaces n'est pas un portail");
assert.ok(phraseVoieAdmission({ portailAdmission: "", universite: uni }).length > 0);

// Et un appel sans contexte ne jette pas : une exception ici viderait
// la carte d'opportunité.
assert.doesNotThrow(() => phraseVoieAdmission());
assert.doesNotThrow(() => phraseVoieAdmission({}));
assert.equal(phraseVoieAdmission(), "");

// Le code peut arriver seul, pas seulement dans un document.
assert.equal(phraseVoieAdmission({ universite: "depot_sur_place" }),
VOIES_ADMISSION.depot_sur_place.explication);

});

// ==========================================================
// L'INTÉGRATION AU HUB
// ==========================================================

test("voie 4 — la phrase S'AJOUTE à l'orientation, elle ne la remplace pas", () => {

// Deux faits distincts : OÙ le dossier se dépose (bailleur ou
// université), et COMMENT on atteint l'université quand elle n'a pas
// de portail. Écraser l'un par l'autre perdrait la moitié de
// l'information.
const avecPortail = liensDOpportunite({
site: "https://um5.ac.ma/",
portailAdmission: "https://apply.um5.example/",
entryPoint: "universite",
voieAdmission: "voie_diplomatique_amci",
abonne: true
});

assert.equal(avecPortail.orientation, "Le dossier se dépose auprès de l'université ; la bourse s'attribue dans le cadre de l'admission.",
"un portail existe : la voie n'a rien à dire et ne doit pas faire douter du portail");

const sansPortail = liensDOpportunite({
site: "https://um5.ac.ma/",
entryPoint: "universite",
voieAdmission: "voie_diplomatique_amci",
abonne: true
});

assert.match(sansPortail.orientation, /par voie diplomatique|ambassade/i);
assert.equal(sansPortail.orientation, VOIES_ADMISSION.voie_diplomatique_amci.resume,
"le hub doit porter le RÉSUMÉ, pas l'explication de 467 signes");
assert.ok(sansPortail.orientation.length > 0,
"sans portail ET sans voie, le hub se taisait — c'est le défaut réparé");

// Le cas d'une bourse déposée chez le bailleur SUR une université sans
// portail : les deux phrases coexistent.
const deux = liensDOpportunite({
site: "https://um5.ac.ma/",
portailBourse: "https://apply.bailleur.example/",
bourseConfirmee: true,
entryPoint: "bourse",
voieAdmission: "voie_diplomatique_amci",
abonne: true
});

assert.match(deux.orientation, /pas auprès de l'université/, "l'orientation de la bourse doit rester");
assert.match(deux.orientation, /ambassade/i, "et la voie d'admission s'y ajoute");

});

test("voie 5 — la voie ne dépend PAS de l'abonnement (et c'est voulu)", () => {

// Limite assumée de la doctrine du verrou (2026-08-31) : on ne montre
// pas une porte fermée, mais on ne cache pas l'ABSENCE de porte. Ces
// huit universités n'ont aucun portail à réserver, et taire « le
// dossier passe par l'ambassade » à un visiteur ne protège rien — ça
// lui fait perdre une année.
const nonAbonne = liensDOpportunite({
site: "https://uca.ma/",
portailAdmission: "https://reserve.example/",   // il ne le verra pas
entryPoint: "universite",
voieAdmission: "voie_diplomatique_amci",
abonne: false
});

// Le portail réservé est bien coupé…
assert.equal(nonAbonne.liens.filter((l) => l.cle === "admission").length, 0);
// …et pourtant la voie est dite, parce que pour LUI il n'y a pas de
// portail visible et que la phrase décrit ce qu'il doit faire.
assert.match(nonAbonne.orientation, /ambassade/i);

// Et aucune des deux valeurs payantes n'a fuité dans la réponse.
const json = JSON.stringify(nonAbonne);
assert.ok(!json.includes("reserve.example"), "le portail réservé fuit dans la réponse d'un non-abonné");

});

test("voie 6 — un code absent laisse le comportement d'avant ce lot, à l'identique", () => {

// La non-régression : 147 universités sur 155 n'ont pas de code de
// voie, et leur carte ne doit pas bouger d'un caractère.
const sansCode = liensDOpportunite({
site: "https://x.example/",
portailAdmission: "https://apply.x.example/",
entryPoint: "universite",
abonne: true
});

assert.equal(sansCode.orientation, "Le dossier se dépose auprès de l'université ; la bourse s'attribue dans le cadre de l'admission.");

const sansRien = liensDOpportunite({
site: "https://x.example/",
entryPoint: "universite",
abonne: true
});

assert.equal(sansRien.orientation, "",
"sans portail et sans voie, on ne devine rien — la carte reste muette plutôt que fausse");

});

// ==========================================================
// LE BRANCHEMENT, DES DEUX CÔTÉS
// ==========================================================

test("voie 7 — le champ remonte jusqu'aux deux surfaces, et depuis les DEUX constructeurs", () => {

// Le piège de ce genre de champ : le brancher dans un seul des deux
// constructeurs de « pick » et le voir marcher dans un hub et pas dans
// l'autre.
const moteur = lire("js/recommend-programs.js");
const occurrences = (moteur.match(/voieAdmission:/g) || []).length;

assert.equal(occurrences, 2,
`recommend-programs.js porte ${occurrences} fois « voieAdmission: » — il en faut exactement 2, un par constructeur de pick`);

assert.ok(lire("dashboard.js").includes("voieAdmission: pick.voieAdmission"),
"le hub ne transmet plus la voie au module des portes");

const details = lire("details.js");
assert.ok(details.includes("phraseVoieAdmission("), "la fiche n'affiche plus la voie d'admission");
assert.ok(details.includes("voieAdmission: universityProfile.voieAdmission"),
"la fiche ne lit plus le champ sur le document université");

});

test("voie 8 — le champ est PUBLIC : il ne doit pas partir dans la carte des portails", () => {

// `applicationPortalUrl` est réservé aux abonnés et quitte
// l'instantané public (lot S3). `voieAdmission` fait l'inverse : ce
// n'est pas une adresse qu'on paie, c'est un fait de procédure, et le
// cacher ferait perdre un an à un visiteur. Il ne doit donc PAS
// figurer dans la liste des champs que `separerPortails` retire.
const separateur = lire("scripts/instantane-portails.mjs");

assert.ok(!separateur.includes("voieAdmission"),
"voieAdmission est traité comme un champ de portail : il disparaîtrait du catalogue public");

// Et le module de la voie ne lit jamais la carte privée : il travaille
// sur le document public.
const module = lire("js/voie-admission.js");
assert.ok(!/portails\.js|catalogue-portails/.test(module),
"js/voie-admission.js dépend de la carte payante des portails");

});
