/**
 * ============================================================
 * Tests unitaires — bailleur de la bourse (funder / funderName /
 * entryPoint), lot du 2026-08-30.
 *
 * Règle commune à tout le lot, la même que estEligible
 * (js/eligibility-countries.js) : un champ ABSENT est un INCONNU,
 * jamais une valeur par défaut. Ces tests verrouillent les trois
 * endroits où une "valeur devinée" pourrait se glisser :
 *   - le filtre du catalogue (js/scholarship-filters.js, import
 *     direct : module pur, sans dépendance navigateur) ;
 *   - la fiche programme (details.js : ordre des portails, bouton
 *     bailleur, section generalCriteria) ;
 *   - le formulaire admin (admin/scholarships.js : ré-enregistrer
 *     une fiche sans toucher au bloc bailleur ne doit rien effacer —
 *     régression du motif « note seule » de l'éligibilité).
 *
 * details.js et admin/scholarships.js sont des modules navigateur
 * (imports CDN Firebase, DOM) : leurs fonctions sont EXTRAITES DU
 * FICHIER RÉEL et évaluées dans un contexte vm avec des éléments
 * factices — même approche que test/admin-eligibility-form.test.mjs.
 *
 * Lancer : npm test   (ou : node --test test/)
 * ============================================================
 */

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import vm from "node:vm";

import { correspondTypeBourse, libelleFunder } from "../js/scholarship-filters.js";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const sourceAdmin = readFileSync(join(racine, "admin", "scholarships.js"), "utf8");
const sourceDetails = readFileSync(join(racine, "details.js"), "utf8");

// Extrait une déclaration `function nom(...) {...}` complète d'un
// fichier, par équilibrage d'accolades (les fonctions visées sont au
// niveau module) — même helper que admin-eligibility-form.test.mjs.
function extraireFonction(source, nom, fichier) {
const debut = source.indexOf(`function ${nom}(`);
assert.notEqual(debut, -1, `function ${nom} introuvable dans ${fichier}`);
let i = source.indexOf("{", debut);
let profondeur = 0;
do {
if (source[i] === "{") profondeur++;
if (source[i] === "}") profondeur--;
i++;
} while (profondeur > 0 && i < source.length);
return source.slice(debut, i);
}

function chargerFonctions(source, fichier, noms, contexte) {
vm.createContext(contexte);
for (const nom of noms) {
vm.runInContext(`${extraireFonction(source, nom, fichier)}\nthis.${nom} = ${nom};`, contexte);
}
return contexte;
}

// ============================================================
// 1. Filtre du catalogue — correspondTypeBourse / libelleFunder
// ============================================================

test("funder absent : visible avec « Tous les types », jamais reclassé dans un type", () => {
// Bourse sans champ funder (les 131 existantes avant backfill).
assert.equal(correspondTypeBourse(undefined, ""), true);
// Un type précis sélectionné exclut les bourses SANS champ : un
// inconnu n'est pas un "gouvernement" par défaut.
assert.equal(correspondTypeBourse(undefined, "gouvernement"), false);
assert.equal(correspondTypeBourse("", "organisation"), false);
});

test("filtre sur un type précis : correspondance EXACTE, rien d'autre", () => {
assert.equal(correspondTypeBourse("gouvernement", "gouvernement"), true);
assert.equal(correspondTypeBourse("universite", "gouvernement"), false);
assert.equal(correspondTypeBourse("region", "region"), true);
// Sans filtre, tout passe — y compris les valeurs renseignées.
assert.equal(correspondTypeBourse("entreprise", ""), true);
});

test("libelleFunder : jamais de libellé deviné pour un champ absent ou hors énuméré", () => {
assert.equal(libelleFunder(undefined), "");
assert.equal(libelleFunder(""), "");
assert.equal(libelleFunder("etat"), "");
assert.equal(libelleFunder("gouvernement"), "Gouvernement");
assert.equal(libelleFunder("region"), "Région ou collectivité");
});

// ============================================================
// 2. Fiche programme — details.js
// ============================================================

// Sidebar factice reproduisant l'ordre STATIQUE du HTML après le lot :
// funderBtn, universityBtn, applyBtn, lockedNote (cta-card-secondary,
// scholarship-details.html). insertBefore suit la sémantique DOM :
// déplacer un nœud déjà présent le retire d'abord de sa position.
function monterSidebar() {
const parent = {
children: [],
insertBefore(node, ref) {
const i = this.children.indexOf(node);
if (i !== -1) this.children.splice(i, 1);
const j = ref ? this.children.indexOf(ref) : -1;
if (j === -1) this.children.push(node);
else this.children.splice(j, 0, node);
}
};
const funderBtn = { id: "funderPortalBtn", hidden: true, href: "#", parentNode: parent };
const universityBtn = { id: "universityPortalBtn", parentNode: parent };
const applyBtn = { id: "applyBtn", parentNode: parent };
const lockedNote = { id: "applicationPortalLocked", parentNode: parent };
parent.children.push(funderBtn, universityBtn, applyBtn, lockedNote);
return { parent, funderBtn, universityBtn, applyBtn, lockedNote };
}

// `portailBourse` vient de js/portails.js (lot S3) : la fonction
// extraite l'appelle pour préférer le portail de DÉPÔT de la bourse à
// sa page d'information. Dans ce contexte, on la double par un stub qui
// rend "" — c'est-à-dire l'état réel des 156 bourses tant que le lot de
// données n'a pas eu lieu. Les tests ci-dessous portent donc bien sur le
// comportement d'aujourd'hui, qui ne doit pas avoir bougé d'un pouce.
function contexteDetails(portails = {}) {
return chargerFonctions(sourceDetails, "details.js", [
"configurerPortailBailleur",
"ordonnerPortails",
"phraseOrientationPortails",
"afficherCriteresGeneraux"
], { portailBourse: (id) => portails[id] || "" });
}

function position(parent, node) {
return parent.children.indexOf(node);
}

test("entryPoint === \"bourse\" : #funderPortalBtn passe avant #universityPortalBtn dans le DOM", () => {
const f = contexteDetails();
const s = monterSidebar();
f.ordonnerPortails("bourse", s.funderBtn, s.universityBtn, s.lockedNote);
assert.ok(position(s.parent, s.funderBtn) < position(s.parent, s.universityBtn));
});

test("entryPoint absent : ordre actuel inchangé (#universityPortalBtn puis #applyBtn), bailleur en dernier", () => {
const f = contexteDetails();
const s = monterSidebar();
f.ordonnerPortails("", s.funderBtn, s.universityBtn, s.lockedNote);
assert.ok(position(s.parent, s.universityBtn) < position(s.parent, s.applyBtn));
assert.ok(position(s.parent, s.funderBtn) > position(s.parent, s.applyBtn));
// Et jamais après la note de verrouillage : il reste dans le bloc
// des liens.
assert.ok(position(s.parent, s.funderBtn) < position(s.parent, s.lockedNote));
});

test("entryPoint === \"universite\" : même ordre que le cas absent", () => {
const f = contexteDetails();
const s = monterSidebar();
f.ordonnerPortails("universite", s.funderBtn, s.universityBtn, s.lockedNote);
assert.ok(position(s.parent, s.universityBtn) < position(s.parent, s.funderBtn));
});

test("#funderPortalBtn reste caché quand la bourse n'a pas d'officialWebsite", () => {
const f = contexteDetails();
const s = monterSidebar();
const label = { textContent: "" };
f.configurerPortailBailleur({ scholarshipWebsite: "", funderName: "MEXT" }, s.funderBtn, label, true);
assert.equal(s.funderBtn.hidden, true);
assert.equal(s.funderBtn.href, "#");
});

// Depuis le 2026-08-31, ce bouton est RÉSERVÉ AUX ABONNÉS : il était
// public depuis le 2026-08-30 par déduction, jamais par demande. Un
// visiteur non abonné ne doit voir qu'un seul lien sur toute la fiche,
// le site de l'université.
test("#funderPortalBtn reste caché pour un NON-ABONNÉ, même quand la bourse a un site officiel", () => {
const f = contexteDetails();
const s = monterSidebar();
const label = { textContent: "" };
f.configurerPortailBailleur({ scholarshipWebsite: "https://www.studyinjapan.go.jp/", funderName: "MEXT" }, s.funderBtn, label, false);
assert.equal(s.funderBtn.hidden, true);
assert.equal(s.funderBtn.href, "#");
assert.equal(label.textContent, "", "aucun libellé ne doit être préparé pour un non-abonné");
});

test("#funderPortalBtn visible pour un ABONNÉ, libellé complété du nom du bailleur", () => {
const f = contexteDetails();
const s = monterSidebar();
const label = { textContent: "" };
f.configurerPortailBailleur({ scholarshipWebsite: "https://www.studyinjapan.go.jp/", funderName: "MEXT" }, s.funderBtn, label, true);
assert.equal(s.funderBtn.hidden, false);
assert.equal(s.funderBtn.href, "https://www.studyinjapan.go.jp/");
assert.equal(label.textContent, "Accéder au portail officiel de la bourse — MEXT");
});

test("#funderPortalBtn sans funderName : libellé nu, jamais de « non renseigné »", () => {
const f = contexteDetails();
const s = monterSidebar();
const label = { textContent: "" };
f.configurerPortailBailleur({ scholarshipWebsite: "https://exemple.org/" }, s.funderBtn, label, true);
assert.equal(label.textContent, "Accéder au portail officiel de la bourse");
});

test("generalCriteria vide -> #criteriaSection reste hidden", () => {
const f = contexteDetails();
const section = { hidden: true };
const p = { textContent: "" };
f.afficherCriteresGeneraux("", section, p);
assert.equal(section.hidden, true);
f.afficherCriteresGeneraux("   ", section, p);
assert.equal(section.hidden, true);
assert.equal(p.textContent, "");
});

test("generalCriteria renseigné -> section visible, texte injecté tel quel (textContent)", () => {
const f = contexteDetails();
const section = { hidden: true };
const p = { textContent: "" };
const critere = "Licence et master uniquement en roumain. Médecine, dentaire et pharmacie exclues.";
f.afficherCriteresGeneraux(critere, section, p);
assert.equal(section.hidden, false);
assert.equal(p.textContent, critere);
});

test("phrase d'orientation : rien (\"\") quand entryPoint est absent — la phrase du HTML reste telle quelle", () => {
const f = contexteDetails();
assert.equal(f.phraseOrientationPortails("", true), "");
assert.equal(f.phraseOrientationPortails(undefined, true), "");
assert.match(f.phraseOrientationPortails("bourse", true), /auprès du bailleur/);
assert.match(f.phraseOrientationPortails("universite", true), /auprès de l'université/);
});

// 2026-08-31 : la phrase ne doit jamais désigner une porte absente de
// l'écran. `portailBailleurVisible` est faux pour tout visiteur, et
// pour un abonné sur une bourse sans site officiel.
test("entryPoint=bourse SANS portail bailleur affiché : la phrase ne nie plus l'université", () => {
const f = contexteDetails();
const phrase = f.phraseOrientationPortails("bourse", false);
assert.match(phrase, /se dépose auprès du bailleur/, "l'information doit être conservée");
assert.match(phrase, /Le lien ci-dessous mène à l'établissement d'accueil/);
// La contradiction de mise en page vient de cette négation : elle ne
// doit apparaître que si le lien du bailleur est réellement affiché.
assert.ok(!/pas auprès de l'université/.test(phrase));
});

test("entryPoint=universite : formulation inchangée, quel que soit le public", () => {
const f = contexteDetails();
const attendue = "Le dossier se dépose auprès de l'université ; la bourse s'attribue dans le cadre de l'admission.";
assert.equal(f.phraseOrientationPortails("universite", true), attendue);
assert.equal(f.phraseOrientationPortails("universite", false), attendue);
});

test("la phrase est calculée avec isPaidUser && scholarshipWebsite, pas avec entryPoint seul", () => {
const source = readFileSync(join(racine, "details.js"), "utf8");
// Lot S3 : la condition inclut le portail de DÉPÔT de la bourse, pour
// que la phrase et le bouton ne puissent pas se contredire.
assert.match(source, /const portailBailleurVisible = isPaidUser && !!\(portailBourse\(university\.scholarshipId\) \|\| university\.scholarshipWebsite\);/);
assert.match(source, /phraseOrientationPortails\(university\.entryPoint, portailBailleurVisible\)/);
});

// ============================================================
// 3. Formulaire admin — admin/scholarships.js
// ============================================================

function monterFormulaireBailleur() {
return chargerFonctions(sourceAdmin, "admin/scholarships.js", [
"buildFunderFieldsFromForm",
"fillFunderForm"
], {
funderInput: { value: "" },
funderNameInput: { value: "" },
entryPointInput: { value: "" },
// Lot S3 : les deux liens de la bourse rejoignent le même bloc de
// champs — même règle des trois valeurs, même mécanique de
// pré-remplissage à l'édition. Sans eux dans le contexte, la fonction
// extraite lève une ReferenceError.
officialWebsiteInput: { value: "" },
applicationPortalUrlInput: { value: "" }
});
}

// Les objets construits DANS le contexte vm portent l'Object.prototype
// de ce contexte : normalisation JSON avant comparaison (même raison
// que dans admin-eligibility-form.test.mjs).
function valeur(objet) {
return JSON.parse(JSON.stringify(objet));
}

test("ré-enregistrer une fiche sans toucher au bloc bailleur conserve les 3 champs (régression « note seule »)", () => {
const f = monterFormulaireBailleur();
const doc = { funder: "gouvernement", funderName: "MEXT", entryPoint: "bourse" };
f.fillFunderForm(doc);
assert.deepEqual(valeur(f.buildFunderFieldsFromForm()), doc);
});

test("formulaire vierge : AUCUN champ écrit — jamais funder:\"\" ni valeur par défaut", () => {
const f = monterFormulaireBailleur();
f.fillFunderForm(null);
assert.deepEqual(valeur(f.buildFunderFieldsFromForm()), {});
});

test("champs partiels : seuls les champs renseignés survivent, funder absent n'est pas inventé", () => {
const f = monterFormulaireBailleur();
// Cas réel : un nom de bailleur connu ("Mastercard Foundation") sans
// certitude sur le type ni sur la porte d'entrée.
f.fillFunderForm({ funderName: "Mastercard Foundation" });
assert.deepEqual(valeur(f.buildFunderFieldsFromForm()), { funderName: "Mastercard Foundation" });
});

test("aller-retour entryPoint=universite sans funder : conservé tel quel", () => {
const f = monterFormulaireBailleur();
f.fillFunderForm({ entryPoint: "universite" });
assert.deepEqual(valeur(f.buildFunderFieldsFromForm()), { entryPoint: "universite" });
});
