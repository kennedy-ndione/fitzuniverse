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
import { readFileSync, readdirSync } from "node:fs";
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

// Un pourcentage, jamais « X/10 » (2026-09-21) : la page du profil
// compte des sections, l'espace dit la même mesure en pourcentage.
assert.match(resumeDePhase("profil", ctx), /80\u00a0%/);
assert.ok(!/\/10/.test(resumeDePhase("profil", ctx)), "« /10 » est revenu dans le résumé de la phase profil");
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

// RÉÉCRIT EN CONSCIENCE le 2026-09-18 (lot R13, « une seule porte »).
//
// CE QUE CE TEST GARDAIT (2026-09-13) : les trois cartes du hub
// préinscription menaient au même formulaire VIDE ; l'établissement et
// le portail voyageaient donc dans l'URL, et applications.html les
// pré-remplissait — avec une validation http(s) sur le portail, qui
// finissait dans un href.
//
// POURQUOI LA RÈGLE N'EXISTE PLUS : le lot R13 ferme la seconde porte.
// Un vœu se pose à l'étape 3 de la route, en trois champs, et son
// portail y est FIXÉ (Études en France) — il n'y a plus de champ
// « portail » à pré-remplir, donc plus rien à valider, donc plus rien à
// faire voyager. Le formulaire de dix champs a été retiré.
//
// CE QU'ON GARDE À LA PLACE, et qui est plus dur : le lien de cette
// branche doit mener à LA PORTE, et la raison pour laquelle la branche
// est inoffensive doit rester vraie.
test("bug 10 — le hub préinscription mène à la seule porte d'un vœu", () => {

// LES GABARITS DE CE FICHIER PORTENT DES COMMENTAIRES HTML, à l'intérieur
// de chaînes JS : `sansCommentaires` ne les voit pas, et l'un d'eux cite
// justement le lien que ce test interdit. Même leçon qu'aux lots R11 et
// R12 : un test qui interdit un MOT doit lire le code, pas la prose qui
// explique pourquoi le mot est interdit.
const codeSeul = (f) => sansCommentaires(lire(f)).replace(/<!--[\s\S]*?-->/g, "");
const hub = codeSeul("dashboard.js");
const apps = codeSeul("applications.js");

// 1. Plus rien ne voyage vers l'ancien formulaire.
assert.ok(!/action=new/.test(hub), "le hub lie encore le formulaire de création");
assert.ok(!/prerempli|params\.get\("universite"\)|params\.get\("portail"\)/.test(apps),
"applications.js lit encore un établissement ou un portail transmis");

// 2. RÉÉCRIT AU LOT B4 : la branche « préinscription » de ce lien a été
// RETIRÉE, pas seulement rendue vraie. Le lot R13 l'avait gardée faute
// d'être dans un lot qui touchait au hub des bourses ; B4 est ce lot.
// Il ne reste qu'une destination, et elle est écrite.
assert.match(hub, /const lien = "applications\.html";/);
assert.ok(!/espace-preinscription\.html/.test(hub),
"le hub des bourses ne doit plus fabriquer de lien vers la route");

// 3. ET LA RAISON POUR LAQUELLE CETTE BRANCHE EST INOFFENSIVE : un seul
// fichier charge ce script, et il déclare l'espace bourses. Le jour où
// une page préinscription le chargera, ce test tombera — et la branche
// devra être traitée pour de bon, pas découverte à l'usage.
const porteurs = readdirSync(RACINE)
.filter((f) => f.endsWith(".html"))
.filter((f) => /<script[^>]+src="\.?\/?dashboard\.js"/.test(lire(f)));
assert.deepEqual(porteurs, ["espace-bourse.html"], `dashboard.js est chargé par ${porteurs.join(", ")}`);
assert.match(lire("espace-bourse.html"), /<body data-espace="bourse">/);

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

// Lot DÉPART (2026-09-21) : vérifier le SCHÉMA ne suffisait pas — le
// modèle inventait des chemins internes (/profil, 404). Le href émis
// est désormais celui que rend la liste fermée de js/liens-fitz.js,
// jamais la valeur brute du modèle (voir test/lot-depart.test.mjs).
assert.match(bloc, /const lien = lienFitzSur\(item\.actionHref\);/,
"un href venu du modèle est émis sans passer par la liste fermée");
assert.match(bloc, /href="\$\{escapeHtml\(lien\)\}"/,
"le href émis doit être celui validé, pas item.actionHref");
assert.ok(!/href="\$\{escapeHtml\(item\.actionHref\)\}"/.test(bloc),
"la valeur brute du modèle ne doit plus jamais atteindre un href");

});

// ==========================================================
// 5. LE DÉFAUT DU 2026-09-14 — TROISIÈME OCCURRENCE
// ==========================================================
// `flex:1 1 260px` sur un champ de recherche : juste dans une RANGÉE,
// désastreux dans une COLONNE, où le flex-basis devient une HAUTEUR de
// 260 px. Ce défaut a déjà frappé DEUX fois :
//   - 2026-09-03, documents.html sur iPhone (« un pavé vide de 370px
//     avec le champ au milieu » — le commentaire est encore dans
//     documents.css) ;
//   - 2026-09-14, l'historique de Fitz, quand j'ai copié ce même `flex`
//     dans le composant partagé `.fitz-recherche` : la liste des
//     conversations s'est retrouvée écrasée contre le bas du panneau.
//
// La règle qui ferme le sujet : UN COMPOSANT RÉUTILISABLE NE DÉCLARE PAS
// SA PLACE DANS LE FLUX. Il décrit son apparence ; c'est le conteneur
// qui décide s'il s'étire, et dans quel axe.

test("composant 1 — .fitz-recherche ne décide pas de sa place dans le flux", () => {

const css = lire("css/base.css");

const i = css.indexOf(".fitz-recherche{");
assert.notEqual(i, -1, ".fitz-recherche a disparu de css/base.css");
const bloc = css.slice(i, css.indexOf("}", i));

// Un facteur de croissance dans le composant, c'est le bug de retour :
// il s'appliquerait à l'axe du conteneur, quel qu'il soit.
assert.ok(!/flex:\s*[1-9]/.test(bloc),
"`.fitz-recherche` déclare un facteur de croissance : en colonne, son flex-basis devient une hauteur");
assert.match(bloc, /flex:\s*0 0 auto/,
"`.fitz-recherche` doit rester neutre dans le flux (flex:0 0 auto)");

});

test("composant 2 — la page qui étire le champ le fait, et SEULEMENT en rangée", () => {

const css = lire("documents.css");

// La barre d'outils de « Mes documents » est une rangée au-dessus de
// 640px et une COLONNE en dessous (flex-direction:column). L'étirement
// doit donc être borné : non borné, il refait le pavé vide de 370px.
const i = css.indexOf(".docs-toolbar .fitz-recherche{");
assert.notEqual(i, -1, "l'étirement du champ dans la barre d'outils a disparu");

const avant = css.slice(0, i);
const media = avant.lastIndexOf("@media");
const accolade = avant.lastIndexOf("}");
assert.ok(media > accolade, "la règle d'étirement n'est plus dans une requête de média : elle s'appliquera aussi en colonne");
assert.match(css.slice(media, i), /min-width:\s*641px/,
"l'étirement doit être borné à min-width:641px — la largeur où la barre est une rangée");

// Et la colonne mobile passe bien en flex-direction:column : c'est la
// prémisse de tout ce test. Si elle disparaît, la borne n'a plus de sens.
assert.match(css, /\.docs-toolbar\{flex-direction:column/,
"la barre d'outils ne passe plus en colonne : revoir la borne ci-dessus");

});

// ==========================================================
// 6. LES TROIS PORTES D'UNE OPPORTUNITÉ (lot PORTAILS, 2026-09-14)
// ==========================================================
// Charles : « chaque université doit avoir tous ses portails et chaque
// bourse aussi, mais l'espace public ne montre aux visiteurs que le site
// des universités uniquement ».
//
// L'architecture existait (les portails ont quitté le catalogue public au
// lot S3, une Cloud Function vérifie l'abonnement) ; le hub n'en
// affichait AUCUN. Ces gardes verrouillent les deux moitiés de la
// phrase : les portails arrivent dans l'espace étudiant, et ne fuient
// pas dans le public.

import { liensDOpportunite, portailDeBourseOuRepli, porteDeBourseDeLaFiche, lienValide, ORIENTATION, LIBELLES_BOURSE } from "../js/portails-opportunite.js";

const OPP = {
site: "https://uni.example/",
portailAdmission: "https://portail.uni.example/apply",
portailBourse: "https://bailleur.example/candidater",
funderName: "DAAD"
};

test("portes 1 — UN NON-ABONNÉ NE VOIT QUE LE SITE DE L'UNIVERSITÉ", () => {

const r = liensDOpportunite({ ...OPP, entryPoint: "bourse", abonne: false });

assert.deepEqual(r.liens.map((l) => l.cle), ["site"]);
// Pas d'orientation : elle parlerait de portes qu'il ne voit pas.
assert.equal(r.orientation, "");
// Et surtout : aucun lien réservé dans le résultat, donc rien à griser,
// rien à cadenasser — c'est la doctrine du 2026-08-31.
assert.ok(r.liens.every((l) => l.reserve === false));

});

test("portes 2 — un abonné reçoit les trois portes, dans l'ordre du PARCOURS RÉEL", () => {

// entryPoint "bourse" : on dépose chez le bailleur d'abord.
assert.deepEqual(
liensDOpportunite({ ...OPP, entryPoint: "bourse", abonne: true }).liens.map((l) => l.cle),
["bourse", "admission", "site"]);

// entryPoint "universite" : l'admission d'abord, le bailleur en dernier.
assert.deepEqual(
liensDOpportunite({ ...OPP, entryPoint: "universite", abonne: true }).liens.map((l) => l.cle),
["admission", "bourse", "site"]);

// entryPoint ABSENT : on ne devine pas, on garde l'ordre neutre.
assert.deepEqual(
liensDOpportunite({ ...OPP, entryPoint: "", abonne: true }).liens.map((l) => l.cle),
["admission", "bourse", "site"]);

});

test("portes 3 — ON N'ANNONCE JAMAIS UNE PORTE QU'ON NE MONTRE PAS", () => {

// C'est la faute que details.js dit avoir corrigée le 2026-08-31 : « on
// annonçait une porte, et la seule visible était l'autre ». Elle valait
// pour la branche « bourse » ; elle vaut aussi pour « universite ».

// Dépôt chez le bailleur, et son portail est CONFIRMÉ.
assert.equal(
liensDOpportunite({ ...OPP, entryPoint: "bourse", abonne: true, bourseConfirmee: true }).orientation,
ORIENTATION.bourse_avec_portail);

// Dépôt chez le bailleur, aucun lien du tout.
assert.equal(
liensDOpportunite({ ...OPP, portailBourse: "", entryPoint: "bourse", abonne: true }).orientation,
ORIENTATION.bourse_sans_portail);

// Dépôt chez le bailleur, mais le lien est le REPLI (son site, pas son
// portail de dépôt) : « pas auprès de l'université » serait une
// affirmation qu'on ne peut pas tenir. C'était le cas de 100 % des
// cartes avant la correction, le champ confirmé étant vide sur les 156.
assert.equal(
liensDOpportunite({ ...OPP, entryPoint: "bourse", abonne: true, bourseConfirmee: false }).orientation,
ORIENTATION.bourse_sans_portail);

// Dépôt auprès de l'université, et son portail d'admission est là.
assert.equal(
liensDOpportunite({ ...OPP, entryPoint: "universite", abonne: true }).orientation,
ORIENTATION.universite);

// Dépôt auprès de l'université, mais AUCUN portail d'admission connu
// (8 établissements sur 155) : on se taisait, on annonçait une porte
// absente. Plus d'orientation du tout.
assert.equal(
liensDOpportunite({ ...OPP, portailAdmission: "", entryPoint: "universite", abonne: true }).orientation,
"");

// entryPoint inconnu : aucune orientation. Jamais une valeur par défaut.
assert.equal(liensDOpportunite({ ...OPP, entryPoint: "", abonne: true }).orientation, "");

});

test("portes 3b — le repli n'est PAS étiqueté « portail »", () => {

// Le champ confirmé du lot S3 est vide sur les 156 bourses : sans cette
// distinction, chaque carte appelait « le portail où se dépose le
// dossier de bourse » un lien que le triage du dépôt classe, 51 fois
// sur 156, comme une simple page d'information.
const sur = liensDOpportunite({ ...OPP, entryPoint: "bourse", abonne: true, bourseConfirmee: true }).liens.find((l) => l.cle === "bourse");
const repli = liensDOpportunite({ ...OPP, entryPoint: "bourse", abonne: true, bourseConfirmee: false }).liens.find((l) => l.cle === "bourse");

assert.equal(sur.libelle, "Portail de la bourse");
assert.equal(sur.confirme, true);
assert.match(sur.titre, /où se dépose/);

assert.equal(repli.libelle, "Site du bailleur");
assert.equal(repli.confirme, false);
assert.ok(!/où se dépose/.test(repli.titre), repli.titre);
assert.match(repli.titre, /vérifiez/);

// Le lien reste servi : un lien vers la bonne organisation vaut mieux
// que rien. C'est son ÉTIQUETTE qui ne mentait plus.
assert.equal(repli.url, OPP.portailBourse);

});

test("portes 3c — la porte de dépôt est MARQUÉE, jamais déduite de sa position", () => {

// Le CSS peignait `:first-child` comme « la porte où l'on dépose ».
// Deux cas le démentaient.

// (a) Université sans portail d'admission : la première porte devient
// celle de la bourse, sous une orientation qui parle de l'université.
const a = liensDOpportunite({ ...OPP, portailAdmission: "", entryPoint: "universite", abonne: true, bourseConfirmee: true });
assert.equal(a.liens[0].cle, "bourse");
assert.ok(!a.liens[0].depot, "la première porte est peinte comme la porte de dépôt alors qu'elle ne l'est pas");
assert.equal(a.porteDeDepot, "");

// (b) NON-abonné : le seul lien restant est le site de l'université, et
// 71 bourses sur 156 se déposent chez le bailleur.
const b = liensDOpportunite({ ...OPP, entryPoint: "bourse", abonne: false });
assert.equal(b.liens[0].cle, "site");
assert.ok(!b.liens[0].depot, "le site de l'université est peint comme la porte de dépôt");

// Et quand on la connaît, elle est marquée — une seule fois.
const c = liensDOpportunite({ ...OPP, entryPoint: "bourse", abonne: true, bourseConfirmee: true });
assert.equal(c.porteDeDepot, "bourse");
assert.deepEqual(c.liens.filter((l) => l.depot).map((l) => l.cle), ["bourse"]);

const d = liensDOpportunite({ ...OPP, entryPoint: "universite", abonne: true });
assert.equal(d.porteDeDepot, "admission");
assert.deepEqual(d.liens.filter((l) => l.depot).map((l) => l.cle), ["admission"]);

// Et le CSS écoute la classe, plus la position.
const css = lire("css/journey.css");
assert.match(css, /\.jy-porte--depot\{/, "la classe de la porte de dépôt a disparu du CSS");
assert.ok(!/\.jy-portes > \.jy-porte:first-child\{/.test(css),
"le CSS déduit de nouveau la porte de dépôt de sa position dans le DOM");

});

test("portes 3d — le repère de la porte de dépôt est VISIBLE", () => {

const shell = lire("css/journey-shell.css");
const css = lire("css/journey.css");

// Le fond des portes valait `--journey-paper` et celui de la porte de
// dépôt `--background` — or journey-shell.css redéfinit les DEUX à
// #FDF9EF, comme `.jy-card`. La règle était donc strictement sans
// effet, et les portes n'avaient aucun contraste avec leur carte.
const valeur = (nom) => (shell.match(new RegExp(`--${nom}:\\s*([^;]+);`)) || [])[1];

assert.notEqual(valeur("background"), valeur("background-soft"),
"les deux fonds employés sont identiques : le repère redevient invisible");

const i = css.indexOf(".jy-porte--depot{");
const bloc = css.slice(i, css.indexOf("}", i));
assert.match(bloc, /background:var\(--background\)/);
assert.match(bloc, /box-shadow:inset/, "la porte de dépôt n'a plus de repère qui survive à une égalité de fonds");

});

test("portes 4 — LA FICHE ET LE HUB DÉCIDENT AU MÊME ENDROIT", () => {

// CE TEST A CHANGÉ DE NATURE LE 2026-09-14, ET C'EST L'AVEU D'UN ÉCHEC.
//
// Il vérifiait que les trois phrases d'orientation étaient recopiées
// MOT POUR MOT dans details.js. Elles l'étaient. Il est resté vert
// pendant que la fiche affirmait « pas auprès de l'université » sur les
// 51 bourses dont le seul lien est une page d'information : la copie
// était exacte au caractère, et la CONDITION qui la déclenchait était
// fausse. Un test qui lit du texte ne voit pas un défaut de sens.
//
// La décision vit donc dans le module, et ce test l'appelle avec des
// valeurs. C'est la seule forme d'anti-divergence qui vaille : non pas
// « les deux fichiers disent la même chose », mais « il n'y a plus
// qu'un endroit qui décide ».
const details = lire("details.js");

assert.ok(details.includes("porteDeBourseDeLaFiche"),
"details.js ne passe plus par la décision partagée");

for (const [cle, phrase] of Object.entries(ORIENTATION)) {
assert.ok(!details.includes(phrase),
`la phrase « ${cle} » est de nouveau écrite en dur dans details.js — c'est une seconde définition`);
}

for (const libelle of [LIBELLES_BOURSE.confirme.action, LIBELLES_BOURSE.repli.action, LIBELLES_BOURSE.confirme.court, LIBELLES_BOURSE.repli.court]) {
assert.ok(!details.includes(libelle),
`« ${libelle} » est écrit en dur dans details.js — c'est une seconde définition`);
}

// Et le hub lit la même table de libellés.
const hub = lire("js/portails-opportunite.js");
assert.ok(hub.includes("LIBELLES_BOURSE.confirme.court") && hub.includes("LIBELLES_BOURSE.repli.court"),
"le hub n'utilise plus LIBELLES_BOURSE pour ses pastilles");

});

test("portes 4 bis — LE COMPORTEMENT : un repli ne se dit jamais « portail officiel »", () => {

const CONFIRME = "https://tbbs.turkiyeburslari.gov.tr";
const PAGE_INFO = "https://www.turkiyeburslari.gov.tr";

// 1. Portail de dépôt confirmé : le libellé promet le portail, et la
//    phrase peut dire « pas auprès de l'université ».
const avec = porteDeBourseDeLaFiche({
portailConfirme: CONFIRME, siteDeLaBourse: PAGE_INFO,
funderName: "YTB", entryPoint: "bourse", abonne: true
});

assert.equal(avec.url, CONFIRME, "le portail confirmé passe avant le site du bailleur");
assert.equal(avec.confirme, true);
assert.equal(avec.libelle, `${LIBELLES_BOURSE.confirme.action} — YTB`);
assert.equal(avec.orientation, ORIENTATION.bourse_avec_portail);

// 2. LE DÉFAUT DU 2026-09-14 : rien que le site du bailleur. Le lien
//    est le même qu'avant, le libellé et la phrase ne doivent pas
//    l'être.
const sans = porteDeBourseDeLaFiche({
portailConfirme: "", siteDeLaBourse: PAGE_INFO,
funderName: "YTB", entryPoint: "bourse", abonne: true
});

assert.equal(sans.url, PAGE_INFO, "le repli reste affiché : mieux qu'aucune porte");
assert.equal(sans.confirme, false);
assert.equal(sans.libelle, `${LIBELLES_BOURSE.repli.action} — YTB`,
"le repli s'annonce encore comme un portail officiel");
assert.equal(sans.orientation, ORIENTATION.bourse_sans_portail,
"la phrase affirme « pas auprès de l'université » sur une page d'information");

// 3. Un non-abonné ne reçoit AUCUNE des deux URL — pas même le repli.
const ferme = porteDeBourseDeLaFiche({
portailConfirme: CONFIRME, siteDeLaBourse: PAGE_INFO,
funderName: "YTB", entryPoint: "bourse", abonne: false
});

assert.equal(ferme.url, "");
assert.equal(ferme.visible, false);
assert.equal(ferme.libelle, "", "un libellé sans bouton est une porte annoncée qu'on ne montre pas");
assert.equal(ferme.orientation, ORIENTATION.bourse_sans_portail,
"la phrase du non-abonné doit désigner le lien réellement à l'écran, celui de l'université");

// Et le droit d'accès se compare à `true`, il ne se devine pas.
for (const valeur of ["oui", 1, {}, "premium"]) {
assert.equal(porteDeBourseDeLaFiche({ portailConfirme: CONFIRME, abonne: valeur }).url, "",
`abonne=${JSON.stringify(valeur)} ouvre la donnée payante`);
}

// 4. entryPoint côté université, et entryPoint absent.
assert.equal(porteDeBourseDeLaFiche({ portailConfirme: CONFIRME, entryPoint: "universite", abonne: true }).orientation,
ORIENTATION.universite);
assert.equal(porteDeBourseDeLaFiche({ portailConfirme: CONFIRME, entryPoint: "", abonne: true }).orientation, "",
"un entryPoint absent oriente quand même — on ne devine pas");
assert.equal(porteDeBourseDeLaFiche({ portailConfirme: CONFIRME, entryPoint: "  BOURSE ", abonne: true }).orientation,
ORIENTATION.bourse_avec_portail, "un entryPoint mal cadré fait disparaître l'orientation en silence");

// 5. Sans bailleur nommé, pas de tiret orphelin.
assert.equal(porteDeBourseDeLaFiche({ portailConfirme: CONFIRME, funderName: "   ", abonne: true }).libelle,
LIBELLES_BOURSE.confirme.action);

// 6. Et un contexte absent ne jette pas : une exception ici vide la fiche.
assert.doesNotThrow(() => porteDeBourseDeLaFiche(null));
assert.doesNotThrow(() => porteDeBourseDeLaFiche());
assert.equal(porteDeBourseDeLaFiche(null).visible, false);

});

test("portes 5 — un href n'est émis que s'il est http(s)", () => {

assert.ok(lienValide("https://x.example/a"));
assert.ok(lienValide("http://x.example"));
assert.ok(!lienValide("javascript:alert(1)"));
assert.ok(!lienValide("data:text/html,x"));
assert.ok(!lienValide("//x.example"));
assert.ok(!lienValide("x.example"));
assert.ok(!lienValide(""));
assert.ok(!lienValide(null));

// Et le module les écarte réellement, il ne se contente pas de savoir.
const r = liensDOpportunite({
site: "javascript:alert(1)",
portailAdmission: "https://ok.example/apply",
entryPoint: "universite",
abonne: true
});
assert.deepEqual(r.liens.map((l) => l.cle), ["admission"]);
assert.ok(r.manquants.includes("site"));

});

test("portes 6 — le repli du portail de bourse est SIGNALÉ comme non confirmé", () => {

// Le champ confirmé (lot S3) est vide sur les 156 bourses. En attendant,
// le site du bailleur sert de repli — mais il se trompe une fois sur
// deux (page d'information contre vrai portail), et le lot de données
// doit savoir lequel corriger.
assert.deepEqual(
portailDeBourseOuRepli({ portailConfirme: "https://a.example/apply", siteDeLaBourse: "https://b.example" }),
{ url: "https://a.example/apply", confirme: true });

assert.deepEqual(
portailDeBourseOuRepli({ portailConfirme: "", siteDeLaBourse: "https://b.example" }),
{ url: "https://b.example", confirme: false });

assert.deepEqual(
portailDeBourseOuRepli({}),
{ url: "", confirme: false });

});

test("portes 7 — ce qui manque est MESURÉ, jamais affiché", () => {

// Un abonné ne doit pas lire « portail de bourse manquant » : ce n'est
// pas son problème. `manquants` sert au décompte de complétude.
const r = liensDOpportunite({ site: "https://uni.example", entryPoint: "bourse", abonne: true });

assert.deepEqual(r.manquants.sort(), ["admission", "bourse"]);
// Et rien de tout cela n'entre dans un libellé montré à l'étudiant.
assert.ok(r.liens.every((l) => !/manquant|absent|indisponible/i.test(l.libelle + l.titre)));

// Un non-abonné n'a pas de portail « manquant » : il n'y a pas droit.
const v = liensDOpportunite({ site: "https://uni.example", entryPoint: "bourse", abonne: false });
assert.deepEqual(v.manquants, []);

});

test("portes 8 — LE PUBLIC NE VOIT QUE LE SITE : le catalogue ne porte aucun portail", () => {

const cat = JSON.parse(lire("assets/data/catalogue.json"));

// Garantie au niveau de la DONNÉE : même un bug de rendu ne peut pas
// faire fuir un portail, puisque le fichier public n'en contient aucun.
const champsInterdits = ["applicationPortalUrl", "applicationUrl", "portalUrl", "scholarshipPortalUrl"];

for (const [collection, lignes] of Object.entries({ universities: cat.universities, programs: cat.programs, scholarships: cat.scholarships })) {
for (const champ of champsInterdits) {
const fautifs = lignes.filter((x) => x && String(x[champ] || "").trim());
assert.equal(fautifs.length, 0,
`${collection}.${champ} est revenu dans le catalogue public (${fautifs.length} entrées) — les portails doivent rester derrière la Cloud Function`);
}
}

});

test("portes 9 — les pages PUBLIQUES n'importent même pas le module des portails", () => {

// La meilleure garantie n'est pas un `if` : c'est que le code des pages
// publiques ne sache pas lire un portail.
for (const f of ["universities-page.js", "scholarships.js", "results.js", "js/homepage-teaser.js", "js/preinscriptions-page.js"]) {
const src = lire(f);
assert.ok(!/from ["'].*portails\.js["']/.test(src),
`${f} importe js/portails.js — une page publique n'a rien à lire dans la carte des portails`);
}

});

test("portes 10 — dans le hub, les portes réservées passent TOUTES par le droit d'accès", () => {

const hub = sansCommentaires(lire("dashboard.js"));

// `abonne` vient de portailsDisponibles(), vrai seulement si la Cloud
// Function a répondu. C'est le seul interrupteur, et il doit être câblé.
assert.match(hub, /const abonne = portailsDisponibles\(\);/,
"le hub ne lit plus le droit d'accès aux portails");
assert.match(hub, /abonne\s*$|abonne\s*\n\}\);/m,
"le droit d'accès n'est plus transmis à liensDOpportunite");

// Et le BALISAGE ne fabrique aucune porte à la main : il ne consomme
// que la liste rendue par le module. Résoudre un portail directement
// dans le gabarit rejouerait la doctrine (ordre, droit d'accès,
// validité du lien) à un deuxième endroit.
const i = hub.indexOf('<div class="jy-portes">');
assert.notEqual(i, -1, "le bloc des portes a disparu du hub");
const balisage = hub.slice(i, hub.indexOf("</div>", i));
assert.match(balisage, /liens\.map\(/,
"le bloc des portes ne se construit plus depuis la liste du module");
assert.ok(!/portailUniversite\(|portailBourse\(|officialWebsite/.test(balisage),
"un portail est résolu dans le gabarit : la décision doit rester dans js/portails-opportunite.js");

// RÉÉCRIT EN CONSCIENCE le 2026-09-18 (lot R13). Ces deux assertions
// gardaient le portail TRANSMIS au formulaire de vœu : il partait vide
// (`pick.applicationUrl`, vidé au lot S3), on passait donc le portail
// d'admission résolu. Le lot R13 supprime le formulaire : un vœu se pose
// à l'étape 3, où le portail est FIXÉ (Études en France). Il n'y a plus
// de portail à transmettre — et en transmettre un serait rouvrir la
// seconde porte. On garde donc la règle à l'envers : le hub ne fabrique
// plus aucune URL de création.
assert.ok(!/portail=\$\{encodeURIComponent/.test(hub),
"le hub transmet de nouveau un portail à un formulaire de création");
assert.ok(!/universite=\$\{encodeURIComponent/.test(hub),
"le hub transmet de nouveau un établissement à un formulaire de création");

});

test("portes 11 — le droit d'accès se compare à `true`, il ne se devine pas", () => {

// `abonne ? … : ""` ouvrait la donnée payante sur n'importe quelle
// valeur vraie. Aujourd'hui la seule source est portailsDisponibles(),
// qui rend un vrai booléen — mais un futur appelant qui passerait
// `abonne: session`, `abonne: planId` ou `abonne: "gratuit"` aurait
// servi les portails réservés sans qu'aucun test ne tombe.
for (const valeur of ["non", "gratuit", 1, {}, [], "false", new Date()]) {
const r = liensDOpportunite({ ...OPP, entryPoint: "bourse", abonne: valeur });
assert.deepEqual(r.liens.map((l) => l.cle), ["site"],
`abonne: ${JSON.stringify(valeur)} a ouvert un portail réservé`);
}

// Et seul `true` ouvre.
assert.ok(liensDOpportunite({ ...OPP, entryPoint: "bourse", abonne: true }).liens.length > 1);

});

test("portes 12 — le module ne jette JAMAIS : une exception y tue tout le rendu", () => {

// `renderOpportunites` est appelée AVANT renderDossiers, renderDepot,
// renderReponse, applyFeatureLocks et initVisaChecklist. Un jet ici
// laisse les phases 03 à 06 vides et les verrous de formule non
// réappliqués.
const entrees = [
undefined, null, 0, "", false, [], "texte", 42,
{ site: null, portailAdmission: undefined, portailBourse: 0, entryPoint: null, funderName: {}, abonne: null },
{ site: 123, portailAdmission: [], portailBourse: {}, entryPoint: 7, funderName: 9, abonne: true },
{ site: "  https://a.example  ", entryPoint: "  BOURSE  ", portailBourse: "https://b.example", abonne: true, bourseConfirmee: true }
];

for (const e of entrees) {
const r = liensDOpportunite(e);
assert.ok(Array.isArray(r.liens), `liens n'est pas un tableau pour ${JSON.stringify(e)}`);
assert.equal(typeof r.orientation, "string");
assert.ok(Array.isArray(r.manquants));
// Aucun href vide ou non http(s) ne sort d'ici.
for (const l of r.liens) assert.match(l.url, /^https?:\/\/\S+$/);
}

// Idem pour le repli.
for (const e of [undefined, null, 0, "", { portailConfirme: 1, siteDeLaBourse: [] }]) {
const r = portailDeBourseOuRepli(e);
assert.equal(typeof r.url, "string");
assert.equal(typeof r.confirme, "boolean");
}

});

test("portes 13 — `entryPoint` est normalisé : casse et espaces n'effacent pas l'orientation", () => {

for (const brut of ["bourse", "Bourse", "BOURSE", " bourse ", "\tbourse\n"]) {
const r = liensDOpportunite({ ...OPP, entryPoint: brut, abonne: true, bourseConfirmee: true });
assert.equal(r.porteDeDepot, "bourse", `entryPoint « ${JSON.stringify(brut)} » n'est plus reconnu`);
assert.equal(r.orientation, ORIENTATION.bourse_avec_portail);
}

for (const brut of ["universite", "Universite", " UNIVERSITE "]) {
assert.equal(liensDOpportunite({ ...OPP, entryPoint: brut, abonne: true }).porteDeDepot, "admission");
}

// Une valeur inconnue reste inconnue : on ne devine pas.
assert.equal(liensDOpportunite({ ...OPP, entryPoint: "autre", abonne: true }).porteDeDepot, "");

});

test("portes 14 — le hub des bourses ne porte plus aucune branche « préinscription »", () => {

const hub = sansCommentaires(lire("dashboard.js"));

// RÉÉCRIT EN CONSCIENCE le 2026-09-18 (lot B4).
//
// Ce test gardait DEUX coupures : dans l'espace préinscription, la
// carte d'opportunité ne devait montrer ni portail de bailleur ni
// « entryPoint », parce qu'un client Dossier France ne cherche pas un
// financement. La coupure n'a plus d'objet — ce hub ne sert QUE
// l'espace bourses, espace-preinscription.html porte la route et pas ce
// script — et B4 a retiré les branches mortes qui la portaient.
//
// La règle est donc gardée un cran plus haut, et elle est plus forte :
// aucun ternaire « préinscription » ne subsiste ici, et le contrat du
// fichier est écrit en clair. Le test « bug 10 » garde la RAISON (un
// seul fichier charge ce script, et il déclare l'espace bourses).
assert.ok(!/preinscription \?/.test(hub),
"une branche « préinscription » est revenue dans le hub des bourses");
assert.match(hub, /const ESPACE = "bourse";/,
"le contrat du fichier doit rester écrit : ce hub est celui des bourses");
assert.match(hub, /portailBourse: bailleur\.url/);

// Et le module sait quoi faire d'un entryPoint vide : ni ordre, ni
// orientation.
const r = liensDOpportunite({ ...OPP, portailBourse: "", entryPoint: "", abonne: true });
assert.deepEqual(r.liens.map((l) => l.cle), ["admission", "site"]);
assert.equal(r.orientation, "");

});

test("portes 15 — la confirmation du repli est TRANSMISE, pas calculée puis jetée", () => {

const hub = sansCommentaires(lire("dashboard.js"));

// `portailDeBourseOuRepli` rend `{url, confirme}`. Le hub capturait
// l'objet et ne lisait jamais `confirme` : le signal était calculé, puis
// perdu, et 100 % des cartes étiquetaient un repli « Portail de la
// bourse ».
assert.match(hub, /bourseConfirmee: bailleur\.confirme/,
"la confirmation du portail de bourse n'est plus transmise au module");

});

test("portes 16 — les portails ne mettent pas le parcours entier en otage", () => {

const hub = sansCommentaires(lire("dashboard.js"));

// `chargerPortails()` ne rejette jamais, mais il ATTEND : un import
// cross-origin depuis gstatic puis un appel callable que le SDK laisse
// tourner 70 s. Or le loader est déjà retiré et le CSS replie par
// défaut : pendant l'attente, la page est visible et ne montre que six
// en-têtes de phase nus.
assert.match(hub, /Promise\.race\(\[/,
"l'attente des portails n'est plus bornée : un réseau lent affiche un hub mort");
assert.match(hub, /DELAI_PORTAILS/, "le délai des portails n'est plus nommé");
const delai = Number((hub.match(/const DELAI_PORTAILS = (\d+);/) || [])[1]);
assert.ok(delai > 0 && delai <= 8000, `délai des portails hors bornes : ${delai}`);

// Et la chaîne d'amorçage a un filet : sans lui, une exception laissait
// six en-têtes nus, sans un mot.
assert.match(hub, /\}\)\.catch\(\(erreur\) => \{/,
"la chaîne d'amorçage du hub n'a plus de .catch");
assert.match(hub, /catch[\s\S]{0,400}dataset\.parcoursPret = "1"/,
"le .catch ne lève plus le repli par défaut : le parcours resterait replié");

});

test("portes 17 — l'ordre qui DIFFÈRE de details.js est épinglé, pas subi", () => {

// Le module n'est pas encore la source unique : details.js garde son
// `ordonnerPortails`, qui déplace des nœuds du DOM de la fiche. Les
// PHRASES sont partagées (portes 4) ; l'ORDRE ne l'est pas :
//   fiche  entryPoint=bourse : bourse, site, admission
//   hub    entryPoint=bourse : bourse, admission, site
// Ce test épingle les deux, pour que la différence reste un constat et
// non une surprise — et il tombera le jour où l'un des deux changera.
assert.deepEqual(
liensDOpportunite({ ...OPP, entryPoint: "bourse", abonne: true, bourseConfirmee: true }).liens.map((l) => l.cle),
["bourse", "admission", "site"]);

const details = lire("details.js");
assert.match(details, /function ordonnerPortails\(/,
"ordonnerPortails a disparu de details.js : si l'ordre est passé dans le module, retirer cet épinglage et unifier");

// Et le module le dit dans son en-tête, pour que personne ne le croie
// source unique de l'ordre.
const module = lire("js/portails-opportunite.js");
assert.match(module, /N'EST PAS ENCORE LA SOURCE UNIQUE/,
"l'en-tête du module ne signale plus la divergence d'ordre avec details.js");

});
