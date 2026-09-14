/**
* ============================================================
* LOT ESPACE-ÉTUDIANT (2026-09-13)
* ============================================================
*
* Trois familles de gardes, pour trois défauts qui étaient tous
* invisibles à la lecture du code et tous visibles à l'usage :
*
*  1. LE QUOTA. Le hub proposait TROIS candidatures, écrites en dur,
*     quelle que soit la formule achetée. Ces tests interdisent le
*     retour du 3, et vérifient que les deux champs de quota
*     (maxAccompaniedApplications / maxPreinscriptions) ne se
*     remplacent jamais l'un l'autre.
*
*  2. LA RÉVÉLATION. Les six phases étaient dépliées en entier, tout le
*     temps. Ces tests vérifient qu'une seule phase est ouverte, que le
*     RAIL reste entier (on cache le détail, jamais la route), et que
*     chaque promesse dit une condition vérifiable — jamais « bientôt ».
*
*  3. CE QUE LE CODE NE DOIT PLUS CONTENIR. Quatre défauts prouvés à la
*     lecture (écran blanc, formule bourse servie à un client
*     préinscription, écritures silencieuses, statut imposé) ; chacun a
*     ici sa garde, écrite sur la SIGNATURE du défaut, pas sur son
*     correctif — pour qu'une réécriture maladroite le fasse retomber.
*
* Preuves par mutation, faites le 2026-09-13 : `slice(0, 3)` réintroduit
* dans chargerOpportunites → test « aucun nombre de candidatures en
* dur » rouge ; `recoursEcheance` redescendue dans initApplicationsPage →
* test « l'écran blanc » rouge.
*/

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import {
quotaDeLaFormule, placesRestantes, nombreAProposer, phraseDuQuota, motDeLaPlace
} from "../js/parcours-quota.js";

import {
revelerPhases, revelerEtapesVisa, promesseDePhase, resumeDePhase, defautsDesPromesses
} from "../js/revelation.js";

import { PHASES, PHASES_PAR_ESPACE, VISA_ETAPES } from "../js/journey-map.js";
import { SOCLE_VISA } from "../js/visa-depart.js";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");

// Le code seul : un défaut cité dans un commentaire pour expliquer
// pourquoi il a été corrigé ne doit pas faire tomber le test qui l'interdit.
const sansCommentaires = (js) => js.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

// La grille réelle, lue dans le fichier servi — jamais une copie.
const PLANS = (() => {
const src = lire("pricing-plans.js");
const debut = src.indexOf("const SCHOLARBRIDGE_PLANS = {");
const fin = src.indexOf("\n};", debut);
const litteral = src.slice(src.indexOf("{", debut), fin + 2);
// eslint-disable-next-line no-new-func
return new Function(`return ${litteral};`)();
})();

// ==========================================================
// 1. LE QUOTA EST CELUI DE LA FORMULE
// ==========================================================

test("quota 1 — chaque formule en vente rend SON nombre, et le bon champ", () => {

// Bourses : maxAccompaniedApplications.
assert.equal(quotaDeLaFormule({ espace: "bourse", planId: "premier-dossier", plans: PLANS }), 1);
assert.equal(quotaDeLaFormule({ espace: "bourse", planId: "essentiel-4", plans: PLANS }), 4);
assert.equal(quotaDeLaFormule({ espace: "bourse", planId: "conseiller-6", plans: PLANS }), 6);
assert.equal(quotaDeLaFormule({ espace: "bourse", planId: "signature", plans: PLANS }), Infinity);

// Préinscription : maxPreinscriptions. 7 n'est pas une décision
// commerciale, c'est le plafond de vœux d'Études en France.
assert.equal(quotaDeLaFormule({ espace: "preinscription", planPreinscriptionId: "dossier-france", plans: PLANS }), 7);
assert.equal(quotaDeLaFormule({ espace: "preinscription", planPreinscriptionId: "dossier-france-conseiller", plans: PLANS }), 7);

// Diagnostic France : maxPreinscriptions vaut 0 — la formule EXISTE et
// n'ouvre aucune place. On rend 0, pas null : `slotIdLibre`
// (js/application-actions.js) borne à 999 tout quota non fini, et un
// null signifiant « zéro place » y ouvrirait 999 créneaux.
assert.equal(quotaDeLaFormule({ espace: "preinscription", planPreinscriptionId: "diagnostic-france", plans: PLANS }), 0);
// Et zéro place ne produit aucune phrase de quota : la phase parle
// d'exploration, pas de places.
assert.equal(phraseDuQuota({ quota: 0, nomFormule: "Diagnostic France" }), null);

});

test("quota 2 — LES DEUX CHAMPS NE SE REMPLACENT PAS", () => {

// Un client « les-deux » : Essentiel côté bourses, Dossier France côté
// préinscription. Dans son espace bourses il a QUATRE places, dans son
// espace préinscription il en a SEPT. Lire un champ pour l'autre donne
// un chiffre qui a l'air juste et qui ne l'est pas.
const client = { planId: "essentiel-4", planPreinscriptionId: "dossier-france", plans: PLANS };

assert.equal(quotaDeLaFormule({ ...client, espace: "bourse" }), 4);
assert.equal(quotaDeLaFormule({ ...client, espace: "preinscription" }), 7);

// Une formule bourse n'a pas de maxPreinscriptions, et réciproquement :
// croiser les deux ne doit JAMAIS rendre un nombre.
assert.equal(quotaDeLaFormule({ espace: "preinscription", planPreinscriptionId: "essentiel-4", plans: PLANS }), null);
assert.equal(quotaDeLaFormule({ espace: "bourse", planId: "dossier-france", plans: PLANS }), null);

});

test("quota 3 — sans formule, sans grille : null, et jamais zéro déguisé", () => {

assert.equal(quotaDeLaFormule({ espace: "bourse", planId: "gratuit", plans: PLANS }), null);
assert.equal(quotaDeLaFormule({ espace: "bourse", planId: "inconnu", plans: PLANS }), null);
assert.equal(quotaDeLaFormule({ espace: "bourse", planId: "essentiel-4", plans: null }), null);
assert.equal(quotaDeLaFormule(), null);

});

test("quota 4 — on propose EXACTEMENT les places libres, jamais trois", () => {

// Premier Dossier : UNE place. Le hub en montrait trois, et invitait à
// en suivre une quatrième.
assert.equal(nombreAProposer({ quota: 1, dejaSuivies: 0, disponibles: 10 }), 1);
assert.equal(nombreAProposer({ quota: 1, dejaSuivies: 1, disponibles: 10 }), 0);

// Conseiller : SIX places, 150 000 F. Le hub en montrait trois.
assert.equal(nombreAProposer({ quota: 6, dejaSuivies: 0, disponibles: 10 }), 6);
assert.equal(nombreAProposer({ quota: 6, dejaSuivies: 4, disponibles: 10 }), 2);

// On ne promet pas une place que le catalogue ne peut pas remplir.
assert.equal(nombreAProposer({ quota: 6, dejaSuivies: 0, disponibles: 2 }), 2);

// Illimité : un nombre affichable, pas une liste infinie.
assert.equal(nombreAProposer({ quota: Infinity, dejaSuivies: 0, disponibles: 30 }), 12);

// Sans quota connu (accès test, compte gratuit) : le comportement
// d'avant le lot, et lui seul.
assert.equal(nombreAProposer({ quota: null, disponibles: 10 }), 3);

});

test("quota 5 — un quota dépassé ne rend jamais un nombre négatif", () => {

// Une formule honorée dont le plafond a baissé (Ambition est passée de
// 12 à 9 places le 2026-08-29) : le compte peut dépasser son quota.
assert.equal(placesRestantes(9, 12), 0);
assert.equal(nombreAProposer({ quota: 9, dejaSuivies: 12, disponibles: 10 }), 0);
assert.equal(placesRestantes(Infinity, 40), Infinity);

});

test("quota 6 — la phrase DIT le nombre, et s'arrête quand tout est pris", () => {

const debut = phraseDuQuota({ quota: 6, dejaSuivies: 0, nomFormule: "Forfait Conseiller" });
assert.match(debut.texte, /Forfait Conseiller/);
assert.match(debut.texte, /6 candidatures/);
assert.equal(debut.complet, false);

const plein = phraseDuQuota({ quota: 6, dejaSuivies: 6, nomFormule: "Forfait Conseiller" });
assert.equal(plein.complet, true);
assert.equal(plein.restantes, 0);
// Quand tout est engagé, la phrase constate — elle ne vend pas.
assert.ok(!/formule supérieure|passez à|débloqu/i.test(plein.texte), plein.texte);

// Singulier à une place : « 1 candidatures » se remarque tout de suite.
const un = phraseDuQuota({ quota: 1, dejaSuivies: 0, nomFormule: "Forfait Premier Dossier" });
assert.match(un.texte, /1 candidature accompagnée de bout en bout/);
assert.ok(!/candidatures/.test(un.texte), un.texte);

// Préinscription : des vœux, pas des candidatures — ET « vœu » est
// MASCULIN. Les accords étaient écrits en dur au féminin : tout client
// Dossier France lisait « 7 vœux accompagnées… Elles sont toutes
// libres », sur la ligne la plus visible de sa phase 02.
const voeux = phraseDuQuota({ quota: 7, dejaSuivies: 2, espace: "preinscription", nomFormule: "Dossier France" });
assert.match(voeux.texte, /7 vœux/);
assert.match(voeux.texte, /reste 5/);
assert.ok(!/accompagnées|Elles|elles|chacune/.test(voeux.texte), voeux.texte);

const voeuxPleins = phraseDuQuota({ quota: 7, dejaSuivies: 7, espace: "preinscription", nomFormule: "Dossier France" });
assert.match(voeuxPleins.texte, /ils sont tous engagés/);
assert.match(voeuxPleins.texte, /chacun/);
// Un vœu est examiné par un établissement, qui n'est pas toujours une
// université — et une bourse, elle, est décernée par une université.
assert.match(voeuxPleins.texte, /l'établissement/);
assert.match(phraseDuQuota({ quota: 6, dejaSuivies: 6, nomFormule: "X" }).texte, /l'université/);

const unVoeu = phraseDuQuota({ quota: 1, dejaSuivies: 0, espace: "preinscription", nomFormule: "Dossier France" });
assert.match(unVoeu.texte, /1 vœu accompagné de bout en bout\. Il est libre\./);

// Sans formule : aucune phrase. La phase parle alors d'exploration.
assert.equal(phraseDuQuota({ quota: null }), null);

});

test("quota 7 — le mot suit le parcours", () => {
assert.equal(motDeLaPlace("bourse"), "candidature");
assert.equal(motDeLaPlace("bourse", true), "candidatures");
assert.equal(motDeLaPlace("preinscription"), "vœu");
assert.equal(motDeLaPlace("preinscription", true), "vœux");
});

test("quota 8 — AUCUN NOMBRE DE CANDIDATURES EN DUR dans le hub", () => {

const hub = sansCommentaires(lire("dashboard.js"));

// C'est la ligne exacte qui plafonnait à trois, dans les deux fichiers
// qui se la partageaient.
assert.ok(!/retenues\.slice\(0,\s*3\)/.test(hub), "le plafond à trois est revenu dans chargerOpportunites");
assert.ok(!/top\.slice\(0,\s*3\)/.test(hub), "le plafond à trois est revenu dans le rendu");

// Le hub doit LIRE le quota, et le lire au bon endroit.
assert.match(hub, /quotaDeLaFormule\(/, "le hub ne lit plus le quota de la formule");
assert.match(hub, /nombreAProposer\(/, "le nombre de propositions n'est plus calculé");

// Une seule définition : le hub ne doit pas retrouver les champs de
// quota à la main.
assert.ok(!/maxAccompaniedApplications|maxPreinscriptions/.test(hub),
"le hub relit les champs de quota directement — la deuxième source de vérité est de retour");

});

test("quota 9 — applications.js et le hub partagent la MÊME définition", () => {

const apps = sansCommentaires(lire("applications.js"));

assert.match(apps, /import \{ quotaDeLaFormule \} from "\.\/js\/parcours-quota\.js"/,
"applications.js a repris sa propre lecture du quota");

// Les deux champs ne doivent plus être lus ici pour CALCULER un quota :
// seul le droit d'ouvrir un parcours (peutBourse / peutPreinscription)
// les consulte encore.
const lectures = apps.match(/max(AccompaniedApplications|Preinscriptions)/g) || [];
assert.ok(lectures.length <= 2, `${lectures.length} lectures directes des champs de quota dans applications.js`);

});

// ==========================================================
// 2. LA RÉVÉLATION PROGRESSIVE
// ==========================================================

const phasesAvec = (couranteId) => PHASES.map((p, i) => ({
...p,
faite: i < PHASES.findIndex((q) => q.id === couranteId),
courante: p.id === couranteId
}));

test("révélation 1 — une seule phase ouverte, une seule entrouverte", () => {

const revelees = revelerPhases(phasesAvec("dossiers"));

assert.deepEqual(revelees.map((p) => p.revelation),
["faite", "faite", "ouverte", "entrouverte", "scellee", "scellee"]);

assert.equal(revelees.filter((p) => p.revelation === "ouverte").length, 1);
assert.equal(revelees.filter((p) => p.revelation === "entrouverte").length, 1);

});

test("révélation 2 — le premier jour : tout est devant, rien n'est déplié", () => {

const revelees = revelerPhases(phasesAvec("profil"));

assert.equal(revelees[0].revelation, "ouverte");
assert.equal(revelees[1].revelation, "entrouverte");
assert.deepEqual(revelees.slice(2).map((p) => p.revelation), ["scellee", "scellee", "scellee", "scellee"]);

});

test("révélation 3 — parcours accompli : plus rien d'ouvert, tout est résumé", () => {

const toutes = PHASES.map((p) => ({ ...p, faite: true, courante: p.id === "depart" }));
const revelees = revelerPhases(toutes);

assert.ok(revelees.every((p) => p.revelation === "faite"), revelees.map((p) => p.revelation).join(" "));

});

test("révélation 4 — LE RAIL RESTE ENTIER : on cache le détail, jamais la route", () => {

const hub = sansCommentaires(lire("dashboard.js"));

// renderRail rend les SIX phases, sans filtre : un étudiant qui paie
// doit voir tout son voyage dès le premier jour.
const rail = hub.slice(hub.indexOf("function renderRail"), hub.indexOf("function renderRadar"));
assert.ok(!/\.filter\(/.test(rail), "le rail filtre des phases — la route ne se cache pas");
assert.match(rail, /phases\.map\(/, "le rail ne parcourt plus toutes les phases");

// Et le CSS estompe, il ne supprime pas.
const css = lire("css/journey.css");
assert.match(css, /\.jy-rail-item\.is-scellee \.jy-rail-dot\{ opacity/, "le rail scellé n'est plus estompé");
assert.ok(!/\.jy-rail-item\.is-scellee\{[^}]*display:\s*none/.test(css), "une phase à venir a disparu du rail");

});

test("révélation 5 — RIEN N'EST VERROUILLÉ : une phase scellée s'ouvre d'un clic", () => {

const hub = sansCommentaires(lire("dashboard.js"));
const css = lire("css/journey.css");

// Le bouton existe, et il pose la classe que le CSS écoute.
assert.match(hub, /jy-voile-btn/, "le bouton « Jeter un œil » a disparu");
assert.match(hub, /classList\.add\("is-devoilee"\)/, "le bouton n'ouvre plus rien");

// Chaque règle qui replie une phase épargne .is-devoilee : sans ce
// :not(), le bouton serait décoratif.
const replis = css.match(/\.jy-phase\.is-(faite|entrouverte|scellee)[^,{]*/g) || [];
const sansEchappatoire = replis.filter((r) => r.includes("> .jy-phase-body") && !r.includes(":not(.is-devoilee)"));
assert.deepEqual(sansEchappatoire, [], "une phase se replie sans pouvoir être dévoilée");

});

test("révélation 6 — chaque promesse dit ce qui l'ouvre, et c'est vérifiable", () => {

assert.deepEqual(defautsDesPromesses(PHASES.map((p) => p.id)), []);

});

test("révélation 7 — DEUX VOCABULAIRES : la promesse suit l'espace", () => {

// « Opportunités » et « bourse » n'ont aucun sens pour quelqu'un qui
// finance ses études : c'est exactement la faute que le lot S3 avait
// corrigée dans le guide visa, et qu'on ne refait pas ici.
for (const id of PHASES.map((p) => p.id)) {
const pre = promesseDePhase(id, "preinscription");
assert.ok(!/\bbourses?\b/i.test(pre.attend), `${id} : « bourse » dans la promesse d'un autofinancé — ${pre.attend}`);
assert.ok(!/\bbourses?\b/i.test(pre.ouvrePar), `${id} : « bourse » dans la condition d'un autofinancé`);
}

// Et les deux espaces ne servent pas le même texte partout : sans
// différence, le dédoublement ne sert à rien.
const differentes = PHASES.filter((p) =>
promesseDePhase(p.id, "bourse").attend !== promesseDePhase(p.id, "preinscription").attend);
assert.ok(differentes.length >= 3, `seulement ${differentes.length} promesses distinctes entre les deux espaces`);

// Les libellés de phase des deux espaces existent toujours, et diffèrent.
assert.notEqual(PHASES_PAR_ESPACE.bourse[1].label, PHASES_PAR_ESPACE.preinscription[1].label);

});

test("révélation 8 — le hub nomme la phase DE SON ESPACE", () => {

const hub = sansCommentaires(lire("dashboard.js"));

// NOMS_PHASES était construit sur PHASES — le vocabulaire bourse, servi
// aux deux. Un étudiant en préinscription lisait « phase Opportunités »
// sur une page qui dit « Établissements ».
assert.ok(!/NOMS_PHASES/.test(hub), "la table figée des noms de phase est revenue");
assert.match(hub, /courante\.label/, "le nom de la phase ne vient plus des phases reçues");

});

test("révélation 9 — le guide visa se dévoile étape par étape", () => {

const socle = SOCLE_VISA.map((e) => ({ id: e.id }));

// Rien de coché : la première est ouverte, la deuxième s'annonce, les
// quatre autres attendent.
const neuf = revelerEtapesVisa(socle, {});
assert.deepEqual(neuf.map((e) => e.revelation),
["ouverte", "entrouverte", "scellee", "scellee", "scellee", "scellee"]);
assert.deepEqual(neuf.map((e) => e.rang), [1, 2, 3, 4, 5, 6]);

// Deux cochées : l'ouverte se déplace, les faites restent derrière.
const enCours = revelerEtapesVisa(socle, { pieces: true, finances: true });
assert.deepEqual(enCours.map((e) => e.revelation),
["faite", "faite", "ouverte", "entrouverte", "scellee", "scellee"]);

// Tout coché : plus rien d'ouvert.
const fini = revelerEtapesVisa(socle, Object.fromEntries(VISA_ETAPES.map((id) => [id, true])));
assert.ok(fini.every((e) => e.revelation === "faite"));

});

test("révélation 10 — une phase repliée rappelle POURQUOI elle l'est", () => {

// « Terminé ✓ » tout seul fait rouvrir la phase pour vérifier.
const ctx = { profileScore: 8, candidatures: 4, deposees: 2, reponses: 1, visaFaites: 6, visaTotal: 6 };

assert.match(resumeDePhase("profil", ctx), /8\/10/);
assert.match(resumeDePhase("opportunites", ctx), /4 candidatures/);
assert.match(resumeDePhase("depot", ctx), /2 dossiers/);
assert.match(resumeDePhase("reponse", ctx), /1 réponse\b/);

// Le vocabulaire suit l'espace, ici aussi.
assert.match(resumeDePhase("opportunites", { ...ctx, espace: "preinscription" }), /4 vœux/);

// Aucun résumé vide : une ligne repliée sans texte est une ligne morte.
for (const p of PHASES) {
assert.ok(resumeDePhase(p.id, ctx).length > 10, `${p.id} : résumé vide`);
}

});

// ==========================================================
// 3. CE QUE LE CODE NE DOIT PLUS CONTENIR
// ==========================================================

test("bug 1 — L'ÉCRAN BLANC : recoursEcheance est au niveau du module", () => {

const src = lire("applications.js");

// renderProtectedReadOnlyState est au niveau du module et l'appelle. Si
// la déclaration redescend dans initApplicationsPage, un abonnement
// expiré avec une candidature en attente rend une PAGE VIDE — le seul
// public que ce code existe pour protéger.
const decl = src.indexOf("\nfunction recoursEcheance(app) {");
const appel = src.indexOf("function renderProtectedReadOnlyState");
const init = src.indexOf("function initApplicationsPage");

assert.ok(decl !== -1, "recoursEcheance a disparu");
assert.ok(decl < appel, "recoursEcheance est déclarée APRÈS son appelant");
assert.ok(decl < init, "recoursEcheance est redescendue dans initApplicationsPage — l'écran blanc est de retour");

});

test("bug 2 — on ne vend plus une formule BOURSE à un client préinscription", () => {

const apps = sansCommentaires(lire("applications.js"));

// unlockingPlans(planId, flags, espace) : sans le 3e argument, un client
// Diagnostic France se voyait proposer le Forfait Premier Dossier.
assert.ok(!/unlockingPlans\(ctx\.planId,\s*flags\)/.test(apps),
"unlockingPlans est rappelée sans l'espace");
assert.match(apps, /unlockingPlans\(ctx\.planId,\s*flags,\s*ctx\.espace/,
"l'espace n'est plus transmis à unlockingPlans");

// Et le refus de quota nomme la formule DU PARCOURS, jamais celle des
// bourses par défaut.
// Les DEUX refus de quota du formulaire — celui du plafond et celui du
// créneau — doivent nommer la même formule : celle du parcours.
const debutFormulaire = apps.indexOf("const slotId = slotIdLibre(duParcours, quota");
assert.ok(debutFormulaire !== -1, "le bloc de création a changé de forme");
const refus = apps.slice(debutFormulaire - 900, debutFormulaire + 900);
assert.ok(!/PLAN_LABELS\[planId\]/.test(refus), "un refus de quota nomme encore la formule bourse");
assert.equal((refus.match(/nomFormulePour\(track\)/g) || []).length, 4,
"les deux refus de quota ne nomment plus tous les deux la formule du parcours");

});

test("bug 3 — les écritures Firestore ne peuvent plus échouer en silence", () => {

const src = lire("applications.js");

// Quatre écritures n'avaient aucun try/catch : « J'ai vérifié », la
// suppression d'un suivi, le cycle de statut d'une pièce et l'ajout
// d'une pièce. L'étudiant repartait convaincu d'avoir enregistré.
for (const [nom, borne] of [
["async function checkIn(app) {", "trackEvent(\"application_checked_in\""],
["if (!confirm(message)) return;", "await loadApplications();"],
["async function saveChecklist(app, newChecklist, eventType) {", "trackEvent(\"application_checklist_updated\""]
]) {
const debut = src.indexOf(nom);
assert.ok(debut !== -1, `${nom} introuvable`);
const bloc = src.slice(debut, src.indexOf(borne, debut));
assert.match(bloc, /try \{/, `écriture sans try : ${nom}`);
assert.match(bloc, /catch \(error\)/, `écriture sans catch : ${nom}`);
}

// Et l'ajout d'une pièce ne ferme plus le modal quand rien n'a été écrit.
assert.match(src, /if \(!\(await saveChecklist\(app, newChecklist, type\)\)\) return;/,
"le modal du dossier se ferme même quand l'enregistrement a échoué");

});

test("bug 4 — le formulaire n'impose plus un statut que la carte interdit", () => {

const apps = sansCommentaires(lire("applications.js"));

const debut = apps.indexOf("function rafraichirPreuve()");
const bloc = apps.slice(debut, apps.indexOf("function preparerPreuve", debut));

// `fields.status.value = "en_cours"` en dur : sur une carte déjà
// déposée, « en_cours » est précisément l'un des statuts interdits.
// Vider son numéro de dossier suffisait pour se retrouver bloqué par un
// statut qu'on n'avait pas choisi.
assert.ok(!/fields\.status\.value = "en_cours"/.test(bloc),
"le statut de repli est de nouveau écrit en dur");
assert.match(bloc, /statutsInterdits\.has\(o\.value\)/,
"le repli ne vérifie plus que le statut est autorisé");

});

test("bug 5 — la saisie de l'étudiant est échappée avant d'entrer dans le DOM", () => {

const src = lire("applications.js");

// Université, bourse et notes sont saisies à la main côté préinscription,
// et passent par innerHTML : un guillemet cassait la carte, une balise
// s'exécutait.
//
// La garde vise les lignes qui écrivent du HTML — celles qui portent une
// balise. `confirm()`, `showToast()` (toast.textContent) et le titre du
// rappel .ics posent du TEXTE : les échapper y afficherait « &amp; » à
// l'écran, ce qui serait le défaut symétrique.
const champs = ["app.university", "app.scholarship", "app.notes", "app.universityWebsite", "app.portalUrl", "item.text", "item.label"];

const fautes = [];

src.split("\n").forEach((ligne, i) => {
if (!/<[a-z/]/i.test(ligne)) return;
for (const champ of champs) {
if (ligne.includes("${" + champ + "}")) fautes.push(`${i + 1} : \${${champ}} sans escapeHtml`);
}
});

assert.deepEqual(fautes, []);

});

test("bug 6 — le refus d'une université ne s'écrit plus en mémoire seule", () => {

const apps = sansCommentaires(lire("applications.js"));

const debut = apps.indexOf("async function refuserEtRemplacer");
const bloc = apps.slice(debut, apps.indexOf("universitesRefusees: arrayUnion", debut));

// La mémoire locale était mise à jour AVANT le test « pas
// d'alternative » : l'université sortait des propositions pour la
// session, sans que rien ne soit écrit en base.
const posMemoire = bloc.indexOf("universitesRefusees = [...universitesRefusees");
const posSortie = bloc.indexOf("if (!alternative)");

assert.ok(posSortie !== -1 && posMemoire !== -1, "le bloc de refus a changé de forme");
assert.ok(posSortie < posMemoire,
"la mémoire locale du refus reprend de l'avance sur la base");

});

test("bug 7 — plus aucune formule écrite en dur dans le HTML servi", () => {

const html = lire("applications.html");

assert.ok(!/data-plan="essentiel"/.test(html), "une formule est réécrite en dur sur <body>");
assert.ok(!/id="topbarPlanLabel">Essentiel</.test(html), "la pastille annonce une formule avant de la connaître");

});

test("bug 8 — le code mort a été retiré, pas contourné", () => {

const apps = sansCommentaires(lire("applications.js"));

// verrouillerParcours() : déclarée sans paramètre, appelée avec un
// argument, corps vide. manualMode : écrite quatre fois, lue zéro.
assert.ok(!/verrouillerParcours/.test(apps), "verrouillerParcours est revenue");
assert.ok(!/manualMode/.test(apps), "manualMode est revenue");
assert.ok(!/normaliserTitre/.test(apps), "normaliserTitre est de nouveau importée sans être utilisée");

});

test("bug 9 — chaque type de notification a son style", () => {

const js = lire("applications.js");
const css = lire("css/ai-suite.css");

const types = new Set([...js.matchAll(/type:\s*"(success|error|warning|info)"/g)].map((m) => m[1]));

for (const type of types) {
assert.match(css, new RegExp(`\\.ai-toast-${type}\\{`), `type: "${type}" utilisé sans style : l'avertissement ressemble à une confirmation`);
}

});

test("bug 10 — le hub préinscription emporte l'établissement choisi", () => {

const hub = sansCommentaires(lire("dashboard.js"));
const apps = sansCommentaires(lire("applications.js"));

// Trois propositions, trois liens identiques vers un formulaire vide :
// le nom voyage maintenant dans l'URL, et le formulaire le lit.
assert.match(hub, /action=new&universite=\$\{encodeURIComponent/, "le lien ne porte plus l'établissement");
assert.match(apps, /params\.get\("universite"\)/, "le formulaire ne lit plus l'établissement transmis");

// Et un portail ne s'accepte qu'en http(s) : ce champ finit dans un href.
assert.match(apps, /\^https\?:\\\/\\\/.*test\(prerempli\.portail\)/, "le portail transmis n'est plus validé");

});

// ==========================================================
// 4. CE QUE LA RELECTURE ADVERSARIALE A TROUVÉ (2026-09-13)
// ==========================================================
// Quatre défauts que la suite Node ne pouvait PAS voir : ils ne cassent
// qu'à l'exécution dans un navigateur. Chacun a maintenant sa garde,
// écrite sur la signature du défaut.

test("relecture 1 — ENREGISTRER : aucun champ du payload ne se lit lui-même", () => {

const src = sansCommentaires(lire("applications.js"));

// `premiumProtected: (estPreinscription(payload.track) ? …)` à
// l'intérieur du littéral `const payload = { … }` : `payload` est en
// zone morte temporelle → ReferenceError. Le handler de soumission n'a
// pas de try/catch et preventDefault() a déjà eu lieu : le bouton
// « Enregistrer » ne faisait RIEN, en création comme en édition, dans
// les deux espaces. Le fichier parse ; seule l'exécution le révèle.
const i = src.indexOf("const payload = {");
assert.ok(i !== -1, "le littéral payload a changé de forme");
const litteral = src.slice(i, src.indexOf("\n};", i));

assert.ok(!/\bpayload\./.test(litteral),
"un champ de `payload` est lu dans l'initialiseur de `payload` : zone morte temporelle");

});

test("relecture 2 — le pré-remplissage est ATTEIGNABLE : l'espace décide du parcours", () => {

const src = sansCommentaires(lire("applications.js"));

const i = src.indexOf("function maybeAutoOpenNewApplication");
const bloc = src.slice(i, src.indexOf("function maybeScrollToHash", i));

// Le lien du hub ne porte pas `&track=` : sans repli sur l'espace, le
// parcours valait « bourse », le bloc de pré-remplissage n'était jamais
// atteint, et c'est le quota des BOURSES qui gardait l'ouverture du
// formulaire de vœu.
assert.match(bloc, /ESPACE_ECRITURE === "preinscription"/,
"le parcours du formulaire ne retombe plus sur l'espace : le pré-remplissage devient inatteignable");

// Et on n'appelle pas enterManualMode() une seconde fois : il vide les
// champs qu'on vient de remplir.
assert.equal((bloc.match(/enterManualMode\(\)/g) || []).length, 0,
"enterManualMode est rappelée après openModal — elle effacerait le pré-remplissage");

});

test("relecture 3 — le parcours est REPLIÉ par défaut, avant que le JS ne peigne", () => {

const css = lire("css/journey.css");
const hub = sansCommentaires(lire("dashboard.js"));

// js/app-shell.js retire le loader AVANT que dashboard.js ait chargé
// les candidatures et le catalogue. Entre les deux, la page est
// visible : sans repli par défaut, l'étudiant voyait les six phases
// dépliées, puis les voyait s'effondrer.
assert.match(css, /body:not\(\[data-parcours-pret\]\) \.jy-phase > \*:not\(\.jy-phase-head\)\{\s*display:none;/,
"le repli par défaut a disparu : le parcours s'affichera déplié pendant le chargement");
assert.match(hub, /document\.body\.dataset\.parcoursPret = "1"/,
"rien ne lève le repli par défaut : le parcours resterait replié pour toujours");

});

test("relecture 4 — une phase ouverte à la main ne se referme pas sous le doigt", () => {

const hub = sansCommentaires(lire("dashboard.js"));

// À la sixième démarche visa cochée, la phase 06 passe « faite » : la
// remise à zéro de `is-devoilee` refermait le guide dans lequel
// l'étudiant venait de cliquer.
assert.match(hub, /dataset\.devoileeALaMain/,
"le dévoilement manuel n'est plus mémorisé : la phase se referme sous le doigt");

const i = hub.indexOf("const precedent = section.dataset.revelation");
const bloc = hub.slice(i, i + 320);
assert.match(bloc, /devoileeALaMain !== "1"/,
"la remise à zéro de is-devoilee ne respecte plus le choix de l'étudiant");

});

test("relecture 5 — on ne propose pas une université déjà suivie", () => {

const hub = sansCommentaires(lire("dashboard.js"));

// `exclureUniversites` existait dans retenirOpportunites (lot
// FITZ-CHOISIT) et n'était pas branché ici : un Conseiller qui suit
// deux dossiers pouvait se voir proposer ces deux universités-là.
assert.match(hub, /exclureUniversites: dejaSuivies/,
"les universités déjà suivies ne sont plus écartées des propositions");
assert.match(hub, /new Set\(applications\.map\(\(app\) => app\.universityId\)/,
"la liste des universités déjà suivies n'est plus construite");

});

test("relecture 6 — « toutes vos places sont engagées » n'est dit QUE si c'est vrai", () => {

const hub = sansCommentaires(lire("dashboard.js"));

const i = hub.indexOf("if (!combien) {");
const bloc = hub.slice(i, i + 700);

// `nombreAProposer` rend 0 pour deux raisons : plus de places, OU un
// catalogue vide/en panne. Annoncer « toutes vos places sont engagées »
// à un Conseiller qui n'a suivi aucune candidature, parce que le
// catalogue n'a pas répondu, est un mensonge — et il contredit le
// sous-titre affiché juste au-dessus.
assert.match(bloc, /restantes === 0/,
"le message « toutes les places engagées » ne vérifie plus qu'il reste zéro place");

});

test("relecture 7 — un href venu du modèle n'est émis que s'il est sûr", () => {

const src = sansCommentaires(lire("applications.js"));

// escapeHtml ne protège pas d'un `javascript:` : il n'y a rien à
// échapper dedans. `item.actionHref` vient de la réponse du modèle.
const i = src.indexOf("function renderReadinessItem");
const bloc = src.slice(i, src.indexOf("function renderReadinessPanel", i));

assert.match(bloc, /\^\(https\?:/,
"un href venu du modèle est émis sans vérifier son schéma");

});
