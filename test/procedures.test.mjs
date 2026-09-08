/**
* ============================================================
* test/procedures.test.mjs — la procédure de portail (lot E2, 2026-09-07)
* ============================================================
*
* Le vocabulaire est fermé ; chaque étape a source + verifieLe ; chaque
* prérequis cite un id existant ; aucun cycle. France × Sénégal : au
* moins une étape "paiement" à 85 000 F sourcée FAQ ; toute étape après
* connexion est "a_confirmer" ; aucune taille de fichier sans source.
* L'injection dans le parcours (préinscription seulement), la preuve de
* dépôt alimentée par la soumission, le moteur next-action, et l'état
* honnête de la France sur la page préinscriptions.
* ============================================================
*/

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { FIABILITE, TYPES_ETAPE, TYPES_PREUVE, RESERVE_A_CONFIRMER, texteConsigne, estConsigneFerme, ICONES_TYPE } from "../js/procedures/vocabulaire.js";
import { PROCEDURE_FRANCE_SENEGAL } from "../js/procedures/france-senegal.js";
import { PROCEDURES, trouverProcedure, portailDocumente, defautsDeProcedure, etapesAConfirmer, codeProcedurePour, libelleProcedureDocumentee } from "../js/procedures/index.js";
import { computeJourneySteps } from "../js/application-journey.js";
import { qualifierEtapes, prochaineEtapeFaisable, prochaineAction, avertissementsPrematures } from "../js/next-action.js";
import { PAYS, CAMPAGNE_FRANCE, jalonDeCampagne, finDeCampagne } from "../js/pays-preinscription.js";
import { preuveValide, lirePreuve } from "../js/preuve-depot.js";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(racine, f), "utf8");
const catalogue = JSON.parse(lire("assets/data/catalogue.json"));
const FR = PROCEDURE_FRANCE_SENEGAL;
const PASTEL = "https://pastel.diplomatie.gouv.fr/etudesenfrance/dyn/public/authentification/login.html";
const AUJOURDHUI = new Date("2026-09-07T12:00:00Z");

// ------------------------------------------------------------------
// Vocabulaire et forme
// ------------------------------------------------------------------

test("vocabulaire fermé : les trois listes du briefing, telles quelles", () => {
assert.deepEqual(FIABILITE, ["verifie_source_officielle", "a_confirmer", "retour_etudiant"]);
assert.deepEqual(TYPES_ETAPE, ["compte", "saisie", "voeux", "pieces", "soumission", "paiement", "entretien", "reponse", "confirmation", "complement", "visa"]);
assert.deepEqual(TYPES_PREUVE, ["numero_dossier", "recu", "convocation", "capture", "aucune"]);
for (const t of TYPES_ETAPE) assert.ok(ICONES_TYPE[t], `icône manquante pour ${t}`);
});

test("chaque étape a source + verifieLe ; chaque prérequis cite un id existant ; aucun cycle", () => {
for (const p of PROCEDURES) assert.deepEqual(defautsDeProcedure(p), [], p.id);
for (const e of FR.etapes) {
assert.match(e.source, /^https:\/\//, e.id);
assert.match(e.verifieLe, /^\d{4}-\d{2}-\d{2}$/, e.id);
assert.ok(TYPES_ETAPE.includes(e.type) && TYPES_PREUVE.includes(e.preuve) && FIABILITE.includes(e.fiabilite), e.id);
}
// Un cycle artificiel est bien détecté.
const boucle = { etapes: [{ ...FR.etapes[0], id: "a", prerequis: ["b"] }, { ...FR.etapes[0], id: "b", prerequis: ["a"] }] };
assert.ok(defautsDeProcedure(boucle).some((d) => /cycle/.test(d)));
assert.ok(defautsDeProcedure({ etapes: [{ ...FR.etapes[0], source: "" }] }).some((d) => /sans source/.test(d)));
assert.ok(defautsDeProcedure({ etapes: [{ ...FR.etapes[0], verifieLe: "" }] }).some((d) => /sans verifieLe/.test(d)));
});

test("une étape sans source ou sans date n'existe pas : aucune dans france-senegal", () => {
assert.equal(FR.etapes.filter((e) => !e.source || !e.verifieLe).length, 0);
assert.ok(FR.etapes.length >= 8);
});

// ------------------------------------------------------------------
// France × Sénégal
// ------------------------------------------------------------------

test("au moins une étape « paiement » à 85 000 F CFA, sourcée sur la FAQ Campus France Sénégal", () => {
const paiement = FR.etapes.filter((e) => e.type === "paiement");
assert.ok(paiement.length >= 1);
assert.ok(paiement.some((e) => e.montant === 85000 && e.devise === "XOF" && /senegal\.campusfrance\.org\/les-questions-frequemment-posees/.test(e.source) && e.fiabilite === "verifie_source_officielle"));
assert.match(paiement[0].consigne, /SUNU BANK/);
assert.match(paiement[0].consigne, /ne payez JAMAIS avant/i);
});

test("une étape après connexion n'est ferme que si sa source est la page qui décrit ces écrans", () => {
// La règle d'avant le 2026-09-08 disait « après connexion ⇒ toujours
// a_confirmer ». Elle était trop forte : Campus France Sénégal décrit
// publiquement ses propres écrans après connexion. Le garde-fou qui
// reste — et qui est le vrai sujet de ce test — c'est qu'on ne promeut
// pas un écran d'après-connexion en citant le calendrier ou la FAQ.
const apres = FR.etapes.filter((e) => e.apresConnexion);
assert.ok(apres.length >= 2, "la saisie et les pièces se passent derrière l'authentification");
for (const e of apres) {
if (e.fiabilite === "verifie_source_officielle") {
assert.equal(e.source, FR.sources.DOSSIER, `${e.id} : ferme, mais sa source ne décrit pas les écrans après connexion`);
assert.equal(estConsigneFerme(e), true, e.id);
assert.ok(!texteConsigne(e).toLowerCase().includes(RESERVE_A_CONFIRMER), e.id);
} else {
assert.equal(e.fiabilite, "a_confirmer", e.id);
assert.ok(texteConsigne(e).toLowerCase().includes(RESERVE_A_CONFIRMER), e.id);
assert.equal(estConsigneFerme(e), false, e.id);
}
}
// Et une consigne vérifiée est rendue telle quelle, sans réserve.
const compte = FR.etapes.find((e) => e.type === "compte");
assert.equal(texteConsigne(compte), compte.consigne);
assert.ok(!texteConsigne(compte).toLowerCase().includes(RESERVE_A_CONFIRMER));
assert.ok(FR.etapes.some((e) => e.fiabilite === "verifie_source_officielle"), "au moins une consigne ferme");
});

test("aucun agrégateur : toutes les sources sont des pages de l'organisme lui-même", () => {
const urls = [...Object.values(FR.sources), ...FR.etapes.map((e) => e.source)];
for (const url of urls) {
assert.ok(!/demarchesetrangers/i.test(url), `agrégateur encore cité : ${url}`);
assert.match(url, /^https:\/\/www\.senegal\.campusfrance\.org\//, url);
}
assert.equal(FR.sources.AGREG, undefined, "la table ne porte plus d'agrégateur");
// Le garde-fou vaut pour le dépôt, pas seulement pour ce fichier : le
// même agrégateur sourçait un « fait » France affiché sur la page
// publique Préinscriptions, avec la même erreur de plafond.
for (const f of PAYS.find((p) => p.id === "france").faits) {
assert.ok(!/demarchesetrangers/i.test(f.source), `fait France encore sourcé sur un agrégateur : « ${f.texte.slice(0, 60)} »`);
// On interdit l'AFFIRMATION « N vœux par niveau », pas les mots : le
// texte corrigé dit « et non par niveau », ce qui est le contraire.
assert.ok(!/(vœux|choix)[^.]{0,24}(au maximum\s+)?par niveau/i.test(f.texte), `fait France : « 7 vœux par niveau » est faux — « ${f.texte.slice(0, 60)} »`);
}
const procedureFrance = PAYS.find((p) => p.id === "france").faits.find((f) => f.cle === "procedure");
assert.match(procedureFrance.texte, /AU TOTAL/, "le fait public doit dire que le plafond est global");
assert.equal(procedureFrance.source, FR.sources.DOSSIER);
});

test("les vœux : le plafond de 7 est GLOBAL, et le sous-plafond de la Licence 1 est dit", () => {
const voeux = FR.etapes.find((e) => e.type === "voeux");
assert.equal(voeux.fiabilite, "verifie_source_officielle");
assert.equal(voeux.source, FR.sources.DOSSIER);
// Le total ET le sous-plafond qui coûte le plus cher à ignorer.
assert.match(voeux.consigne, /sept \(7\) choix de formations connectées/);
assert.match(voeux.consigne, /GLOBAL/);
assert.match(voeux.consigne, /Licence 1 \(DAP\)\s*:\s*3 formations/);
// L'exemple qui montre que les sous-plafonds s'additionnent DANS le total.
assert.match(voeux.consigne, /3 \+ 4 = 7/);
// Et surtout : plus aucune trace du « par niveau » de l'agrégateur.
assert.ok(!/par niveau/i.test(voeux.consigne), "« 7 vœux par niveau » était l'erreur de l'agrégateur");
assert.ok(!/agrégateur/i.test(voeux.consigne));
});

test("la saisie dit l'exemption CEDEAO, et ne présente plus le choix de l'antenne comme une règle de la source", () => {
const saisie = FR.etapes.find((e) => e.id === "ef_saisie");
assert.match(saisie.consigne, /CEDEAO/);
assert.match(saisie.consigne, /exemptés de titre de séjour au Sénégal à la date de rédaction de cette page/, "la réserve est de la source, elle se garde");
assert.match(saisie.consigne, /conseil/i, "l'antenne est un conseil assumé, pas un fait sourcé");
assert.ok(!/L'adresse indiquée détermine l'antenne/.test(saisie.consigne));
});

test("les pièces : la règle de traduction mot pour mot, le plafond général, et le test de français avant dépôt pour L-AR", () => {
const pieces = FR.etapes.find((e) => e.id === "ef_pieces");
assert.equal(pieces.source, FR.sources.DOSSIER, "les tailles sont sur DOSSIER, pas sur la FAQ");
assert.match(pieces.consigne, /Tous les documents doivent être en français ou traduits en Français auprès d'un traducteur assermenté\. Dans le cas où le document est traduit, il faut joindre aussi obligatoirement le document original\./);
assert.match(pieces.consigne, /plafond est général/);
assert.match(pieces.consigne, /L-AR/);
assert.match(pieces.consigne, /AVANT de déposer/);
});

test("aucune étape n'a une taille de fichier sans source ; les tailles citées sont celles de la page « je constitue mon dossier » ou de la FAQ", () => {
for (const e of FR.etapes) {
for (const piece of e.pieces) {
if (piece.tailleMax) {
assert.ok(/senegal\.campusfrance\.org/.test(e.source), `${e.id} : taille « ${piece.tailleMax} » sans source officielle`);
assert.ok(["50 Ko", "500 Ko"].includes(piece.tailleMax), `${e.id} : taille inventée « ${piece.tailleMax} »`);
}
assert.equal(typeof piece.traduction, "boolean");
assert.equal(typeof piece.legalisation, "boolean");
}
}
});

test("le calendrier n'est pas recopié : chaque échéance désigne un jalon de CAMPAGNE_FRANCE, daté pour la campagne en cours", () => {
for (const e of FR.etapes.filter((x) => x.echeance)) {
assert.equal(e.echeance.depuis, "calendrier", e.id);
assert.ok(CAMPAGNE_FRANCE.jalons[e.echeance.cle], `${e.id} : jalon « ${e.echeance.cle} » inconnu`);
}
assert.match(CAMPAGNE_FRANCE.sourceJalons, /calendrier-de-la-procedure-2026/);
assert.equal(jalonDeCampagne("soumission", AUJOURDHUI).iso, "2026-12-15");
assert.equal(jalonDeCampagne("paiement", AUJOURDHUI).iso, "2026-12-27");
assert.equal(jalonDeCampagne("confirmation", AUJOURDHUI).iso, "2027-05-31");
assert.equal(jalonDeCampagne("complements", AUJOURDHUI).iso, "2027-07-27");
assert.equal(jalonDeCampagne("visa", AUJOURDHUI).iso, "2027-05-01");
assert.equal(jalonDeCampagne("confirmation", new Date("2027-03-01T00:00:00Z")).iso, "2027-05-31");
assert.equal(jalonDeCampagne("soumission", new Date("2027-03-01T00:00:00Z")).iso, "2026-12-15", "en mars, la campagne en cours a ouvert en octobre précédent");
assert.equal(jalonDeCampagne("inconnu"), null);
assert.equal(finDeCampagne(AUJOURDHUI).toISOString().slice(0, 10), "2027-07-31");
// Les DONNÉES de la procédure ne portent aucune date : seul l'en-tête cite les sources.
assert.ok(!/\d{4}-\d{2}-\d{2}|\b(15 décembre|27 décembre|31 mai|27 juillet|1er mai)\b/.test(JSON.stringify(FR.etapes).replace(/"verifieLe":"\d{4}-\d{2}-\d{2}"/g, "")), "aucune date recopiée dans les étapes");
});

// ------------------------------------------------------------------
// L'index
// ------------------------------------------------------------------

test("trouverProcedure : France × Sénégal par pays ou par portail ; rien pour une autre résidence ou une autre destination", () => {
assert.equal(trouverProcedure({ paysDestination: "France", paysResidence: "Sénégal" }), FR);
assert.equal(trouverProcedure({ paysDestination: "France", paysResidence: "senegal" }), FR);
assert.equal(trouverProcedure({ portailUrl: PASTEL, paysResidence: "Sénégal" }), FR);
assert.equal(trouverProcedure({ paysDestination: "France", paysResidence: "Maroc" }), null);
assert.equal(trouverProcedure({ paysDestination: "Roumanie", paysResidence: "Sénégal" }), null);
assert.equal(trouverProcedure({ paysDestination: "France" }), null, "sans résidence, rien");
assert.equal(trouverProcedure(), null);
assert.equal(portailDocumente(PASTEL), true);
assert.equal(portailDocumente("https://formulaires.ens.psl.eu/"), false);
const bordeaux = catalogue.universities.find((u) => u.id === "universite-de-bordeaux-bordeaux");
assert.ok(bordeaux && portailDocumente(bordeaux.applicationPortalUrl), "l'Université de Bordeaux est sur Études en France");
assert.equal(catalogue.universities.filter((u) => u.country === "France" && portailDocumente(u.applicationPortalUrl)).length, 17);
});

// ------------------------------------------------------------------
// L'injection dans le parcours
// ------------------------------------------------------------------

const bordeauxPre = { id: "pre-1", university: "Université de Bordeaux", track: "preinscription", universityId: "universite-de-bordeaux-bordeaux", portalUrl: PASTEL, checklist: [] };
const options = { profileScore: 9, procedure: FR, aujourdhui: AUJOURDHUI };

test("candidature préinscription liée à Études en France → les étapes apparaissent, dans l'ordre, entre ressources et la revue conseiller", () => {
const steps = computeJourneySteps(bordeauxPre, { ...options, advisorUnlocked: true });
const ids = steps.map((s) => s.id);
assert.deepEqual(ids.slice(0, 4), ["profile", "checklist", "traductions", "ressources"]);
assert.deepEqual(ids.slice(4, 4 + FR.etapes.length), FR.etapes.map((e) => e.id));
assert.equal(ids[ids.length - 1], "advisor");
const soumission = steps.find((s) => s.id === "ef_soumission");
assert.equal(soumission.action, "procedure");
assert.equal(soumission.procedure.echeanceISO, "2026-12-15");
assert.equal(soumission.procedure.preuve, "numero_dossier");
assert.deepEqual(soumission.prerequis, ["ef_voeux", "ressources"]);
assert.equal(steps.find((s) => s.id === "ef_paiement").procedure.montant, 85000);
});

test("même université en parcours bourse → aucune étape de procédure ; université sans procédure → aucune, sans erreur", () => {
const bourse = computeJourneySteps({ ...bordeauxPre, track: "bourse" }, options);
assert.ok(!bourse.some((s) => s.action === "procedure"));
assert.deepEqual(bourse.map((s) => s.id), ["profile", "checklist", "letter", "readiness"]);
const sans = computeJourneySteps({ ...bordeauxPre, universityId: "ens-psl", portalUrl: "https://formulaires.ens.psl.eu/" }, { ...options, procedure: null });
assert.deepEqual(sans.map((s) => s.id), ["profile", "checklist", "traductions", "ressources"]);
assert.deepEqual(computeJourneySteps(bordeauxPre, { profileScore: 9 }).map((s) => s.id), ["profile", "checklist", "traductions", "ressources"], "sans option procedure : le parcours d'avant");
});

test("done = cochée ET preuve présente quand une preuve est attendue", () => {
const avec = (procedure) => computeJourneySteps({ ...bordeauxPre, procedure }, options);
assert.equal(avec({ ef_compte: { faite: true } }).find((s) => s.id === "ef_compte").done, true, "aucune preuve attendue");
assert.equal(avec({ ef_soumission: { faite: true } }).find((s) => s.id === "ef_soumission").done, false, "numéro attendu");
assert.equal(avec({ ef_soumission: { faite: true, preuve: "SN123456" } }).find((s) => s.id === "ef_soumission").done, true);
assert.equal(avec({ ef_soumission: { faite: false, preuve: "SN123456" } }).find((s) => s.id === "ef_soumission").done, false, "preuve sans coche");
assert.equal(avec("texte").some((s) => s.done && s.action === "procedure"), false, "un champ malformé ne fait rien");
});

test("cocher « soumission » avec un numéro remplit preuveDepot (E1) et rend la transition « déposée » possible", () => {
// La règle que applications.js applique en une seule saisie.
const numero = "SN2026000123";
const preuve = { mode: "numero", numeroDossier: numero, deposeLe: "2026-09-07" };
assert.equal(preuveValide(preuve, { parTiers: false, aujourdhui: AUJOURDHUI }), true);
const app = { ...bordeauxPre, procedure: { ef_soumission: { faite: true, preuve: numero, faitLe: "2026-09-07" } }, preuveDepot: preuve };
assert.deepEqual(lirePreuve(app), preuve);
assert.equal(computeJourneySteps(app, options).find((s) => s.id === "ef_soumission").done, true);
assert.ok(lire("applications.js").includes('etape.procedure.type === "soumission"'), "applications.js relie la soumission à preuveDepot");
});

// ------------------------------------------------------------------
// next-action
// ------------------------------------------------------------------

test("next-action : la prochaine étape faisable traverse les étapes injectées dans le bon ordre", () => {
const base = { ...bordeauxPre, checklist: [{ status: "complete" }] };
const docs = { "traductions-certifiees": true, "legalisation-apostille": true, "justificatif-de-ressources": true };
const faire = (procedure) => prochaineEtapeFaisable(computeJourneySteps({ ...base, procedure }, { ...options, documentsObtained: docs }));
// Sans les slugs exacts, les étapes documents restent à faire : on passe par les ids présents.
const steps0 = computeJourneySteps(base, options);
const q0 = qualifierEtapes(steps0);
assert.equal(q0.find((s) => s.id === "ef_compte").etat, "a-faire", "le compte n'a aucun prérequis");
assert.equal(q0.find((s) => s.id === "ef_saisie").etat, "prematuree", "le compte n'est pas créé : la saisie attend");
assert.deepEqual(q0.find((s) => s.id === "ef_saisie").bloquePar, ["ef_compte"], "le profil est fait, seul le compte manque");
assert.equal(q0.find((s) => s.id === "ef_pieces").etat, "prematuree");
// `base` a une checklist complète : seuls la saisie et les traductions manquent.
assert.deepEqual(q0.find((s) => s.id === "ef_pieces").bloquePar, ["ef_saisie", "traductions"]);
assert.equal(q0.find((s) => s.id === "ef_paiement").etat, "prematuree");
// Compte + saisie faits, dossier et traductions faits → pièces à faire, vœux prématurés.
const steps1 = computeJourneySteps({ ...base, procedure: { ef_compte: { faite: true }, ef_saisie: { faite: true } } }, { ...options, documentsObtained: {} })
.map((s) => (["checklist", "traductions"].includes(s.id) ? { ...s, done: true } : s));
const q1 = qualifierEtapes(steps1);
assert.equal(q1.find((s) => s.id === "ef_pieces").etat, "a-faire");
assert.equal(q1.find((s) => s.id === "ef_voeux").etat, "prematuree");
assert.deepEqual(q1.find((s) => s.id === "ef_voeux").bloqueParLibelles, ["renseigner mon parcours et joindre mes diplômes"]);
// Tout jusqu'à la soumission fait → le paiement est LA prochaine étape.
const faits = Object.fromEntries(["ef_compte", "ef_saisie", "ef_pieces", "ef_voeux"].map((id) => [id, { faite: true }]));
faits.ef_soumission = { faite: true, preuve: "SN1" };
const steps2 = computeJourneySteps({ ...base, procedure: faits }, options).map((s) => (["checklist", "traductions", "ressources"].includes(s.id) ? { ...s, done: true } : s));
assert.equal(prochaineEtapeFaisable(steps2).id, "ef_paiement");
assert.equal(qualifierEtapes(steps2).find((s) => s.id === "ef_entretien").etat, "prematuree");
void faire;
});

test("next-action : une étape « a_confirmer » n'est jamais rendue comme consigne ferme, et les phrases nomment l'étape", () => {
for (const e of FR.etapes) {
const texte = texteConsigne(e);
if (e.fiabilite === "a_confirmer") assert.ok(texte.toLowerCase().includes(RESERVE_A_CONFIRMER), e.id);
else assert.ok(!texte.toLowerCase().includes(RESERVE_A_CONFIRMER), e.id);
}
const faits = Object.fromEntries(["ef_compte", "ef_saisie", "ef_pieces", "ef_voeux"].map((id) => [id, { faite: true }]));
const app = { ...bordeauxPre, deadline: "2026-09-12", procedure: faits };
const etapes = computeJourneySteps(app, options).map((s) => (["checklist", "traductions", "ressources"].includes(s.id) ? { ...s, done: true } : s));
const action = prochaineAction({ profileScore: 9, applications: [{ ...app, etapes }], aujourdhui: AUJOURDHUI });
assert.equal(action.etapeId, "ef_soumission");
assert.match(action.texte, /il manque soumettre mon dossier sur Études en France/);
assert.ok(!/undefined|une étape\./.test(action.texte));
const alertes = avertissementsPrematures(etapes);
for (const a of alertes) assert.ok(!/undefined/.test(a.prerequisLisible + a.consequence), a.id);
});

// ------------------------------------------------------------------
// pays-preinscription : l'état honnête de la France
// ------------------------------------------------------------------

test("France : plus aucune étape à confirmer, la procédure est « documentee » et le dit", () => {
const france = PAYS.find((p) => p.id === "france");
// Les trois dernières « a_confirmer » (saisie, pièces, vœux) sont
// tombées le 2026-09-08 : la page DOSSIER décrit ces écrans.
assert.deepEqual(etapesAConfirmer(FR).map((e) => e.id), [], "aucune étape ne reste à confirmer");
assert.equal(codeProcedurePour(france, FR), "documentee");
assert.equal(libelleProcedureDocumentee(FR), "Procédure de portail documentée, accompagnée pas à pas");
// Le code DÉCLARÉ du pays reste « en_cours » : c'est la procédure qui
// tranche, pas la fiche pays — sinon les deux pourraient diverger.
assert.equal(france.procedure, "en_cours");
// Et aucune consigne de la France ne porte plus la réserve.
for (const e of FR.etapes) assert.ok(!texteConsigne(e).toLowerCase().includes(RESERVE_A_CONFIRMER), e.id);
// Le mécanisme inverse tient toujours : une seule étape douteuse suffit à retirer le « pas à pas ».
const douteuse = { ...FR, etapes: FR.etapes.map((e, i) => (i === 0 ? { ...e, fiabilite: "a_confirmer" } : e)) };
assert.equal(codeProcedurePour(france, douteuse), "en_cours");
assert.match(libelleProcedureDocumentee(douteuse), /^Procédure documentée depuis les sources publiques ; 1 étape à confirmer$/);
assert.equal(codeProcedurePour(PAYS.find((p) => p.id === "roumanie"), null), "a_venir");
});

test("la page préinscriptions et la fiche université branchent la procédure", () => {
const page = lire("js/preinscriptions-page.js");
assert.ok(page.includes("trouverProcedure") && page.includes("libelleProcedureDocumentee") && page.includes("texteConsigne"));
assert.ok(lire("details.js").includes("portailDocumente") && lire("scholarship-details.html").includes('id="procedureLink"'));
assert.ok(lire("applications.js").includes("trouverProcedure") && lire("dashboard.js").includes("trouverProcedure"));
});
