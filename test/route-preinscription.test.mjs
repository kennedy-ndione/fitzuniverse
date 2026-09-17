/**
 * Lot R1 (2026-09-17) — LA ROUTE de l'espace préinscription.
 *
 * Ce que ces tests tiennent :
 *  1. la route a quinze étapes, dans un ordre fixe, et chaque étape de
 *     procédure existe dans js/procedures/france.js ;
 *  2. les étapes sont celles du DOSSIER : l'état vit dans dossierFrance,
 *     jamais sur un vœu — sauf la lettre et la réponse, qui sont par vœu ;
 *  3. aucun fait de pays dans le français simple : montants, dates,
 *     banques et villes ne viennent que de la procédure composée ;
 *  4. l'échéance et le montant n'existent que si la couche du pays de
 *     résidence les porte — un Ghanéen ne lit pas les dates du Sénégal ;
 *  5. la courante est la première étape non faite, et rien n'est
 *     verrouillé : la route se lit entière ;
 *  6. le HTML ne montre qu'une étape, sans rail, sans radar, sans boîte
 *     à outils, sans sortie vers une page vitrine.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import {
  ETAPES_ROUTE, TOTAL_ETAPES, construireRoute, phraseDeRoute, situationComplete,
  QUESTIONS_SITUATION, piecesDuDossier, avertissementsVoeux, defautsDesEnClair,
  PLAFOND_VOEUX, PORTAIL_ETUDES_EN_FRANCE, NIVEAUX_VOEU, slugPiece
} from "../js/route-preinscription.js";
import { trouverProcedure } from "../js/procedures/index.js";
import { PROCEDURE_FRANCE } from "../js/procedures/france.js";
import { VISA_ETAPES } from "../js/journey-map.js";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");

const SENEGAL = trouverProcedure({ paysDestination: "France", paysResidence: "Sénégal" });
const GHANA = trouverProcedure({ paysDestination: "France", paysResidence: "Ghana" });
const AUJOURDHUI = new Date("2026-10-05T12:00:00Z");

const SITUATION = { country: "Sénégal", nationality: "Sénégal", desiredDegree: "Master", desiredField: "Informatique", lastDegree: "Licence 3 Informatique", currentInstitution: "UCAD", situationFrancais: "etudes_en_francais", budget: "600 000 F CFA" };

function voeu(id, extra = {}) {
  return { id, university: `Université ${id}`, formation: "Master Informatique", niveau: "Master 1", status: "a_preparer", track: "preinscription", ...extra };
}

test("route 1 — quinze étapes, dans l'ordre, et chaque étape de procédure existe dans le tronc France", () => {
  assert.equal(TOTAL_ETAPES, 15);
  assert.equal(ETAPES_ROUTE.length, 15);
  const ids = ETAPES_ROUTE.map((e) => e.id);
  assert.equal(new Set(ids).size, 15, "des identifiants en double");
  assert.deepEqual(ids.slice(0, 4), ["situation", "ressources", "voeux", "pieces"]);
  // Les onze de la procédure, dans l'ordre du tronc.
  const officielles = PROCEDURE_FRANCE.etapes.map((e) => e.id);
  assert.deepEqual(ETAPES_ROUTE.filter((e) => e.procedure).map((e) => e.procedure), officielles, "la route suit l'ordre exact de la procédure");
  for (const e of ETAPES_ROUTE) {
    assert.ok(e.titre && e.enClair && e.kind, `${e.id} : titre, enClair et kind sont obligatoires`);
    for (const o of e.outils || []) assert.ok(o.feature && o.href && o.libelle && o.icone, `${e.id} : outil incomplet`);
  }
  assert.equal(PORTAIL_ETUDES_EN_FRANCE, PROCEDURE_FRANCE.portail.url);
  assert.ok(NIVEAUX_VOEU.includes("Licence 1") && NIVEAUX_VOEU.includes("Master 1"));
});

test("route 2 — le français simple ne porte aucun fait de pays, et reste court", () => {
  assert.deepEqual(defautsDesEnClair(), []);
  // Preuve par mutation : un montant glissé dans un enClair est attrapé.
  const mutant = [{ id: "x", enClair: "Payez 85 000 F CFA à la banque." }];
  assert.ok(defautsDesEnClair(mutant).length >= 2);
});

test("route 3 — vide : la courante est la situation, rien n'est fait, tout se lit", () => {
  const r = construireRoute({ procedure: SENEGAL, aujourdhui: AUJOURDHUI });
  assert.equal(r.courante.id, "situation");
  assert.equal(r.faites, 0);
  assert.equal(r.pourcentage, 0);
  assert.equal(r.etapes[0].etat, "courante");
  assert.ok(r.etapes.slice(1).every((e) => e.etat === "a-venir"));
  assert.equal(phraseDeRoute(r), "Vous êtes à l'étape 1 sur 15 : Votre situation.");
  assert.equal(phraseDeRoute(r, "Moussa"), "Moussa, vous êtes à l'étape 1 sur 15 : Votre situation.");
  // Chaque étape de procédure porte le texte officiel et sa source.
  for (const e of r.etapes.filter((x) => x.officielle)) {
    assert.ok(e.officielle.consigne.length > 40, `${e.id} : consigne`);
    assert.match(e.officielle.source, /^https:\/\//, `${e.id} : source`);
    assert.match(e.officielle.verifieLe, /^\d{4}-\d{2}-\d{2}$/, `${e.id} : verifieLe`);
  }
});

test("route 4 — la situation : huit questions, complètes ou manquantes par leur libellé", () => {
  assert.equal(QUESTIONS_SITUATION.length, 8);
  assert.equal(situationComplete({}).pret, false);
  assert.equal(situationComplete({}).manquants.length, 8);
  assert.equal(situationComplete(SITUATION).pret, true);
  const sans = { ...SITUATION, budget: "  " };
  assert.deepEqual(situationComplete(sans).manquants, ["De combien disposez-vous par mois pour vivre en France ?"]);
  // Les clés sont celles du profil existant : aucune clé inventée hors situationFrancais.
  const connues = ["country", "nationality", "desiredDegree", "desiredField", "lastDegree", "currentInstitution", "situationFrancais", "budget"];
  assert.deepEqual(QUESTIONS_SITUATION.map((q) => q.cle), connues);
});

test("route 5 — l'état des étapes est celui du DOSSIER ; la lettre et la réponse sont par vœu", () => {
  const dossier = {
    etapes: {
      ef_compte: { faite: true, faitLe: "2026-10-02", preuve: "" },
      ef_saisie: { faite: true, faitLe: "2026-10-03", preuve: "" },
      ef_pieces: { faite: true, faitLe: "2026-10-04", preuve: "" },
      // Soumission cochée SANS numéro : pas faite.
      ef_soumission: { faite: true, faitLe: "2026-10-05", preuve: "" }
    },
    pieces: Object.fromEntries(piecesDuDossier(SENEGAL).map((p) => [p.slug, true]))
  };
  const voeux = [voeu("pre-1", { motivation: { faite: true } }), voeu("pre-2", { motivation: { faite: false } })];
  const r = construireRoute({ procedure: SENEGAL, profile: SITUATION, diagnostic: { etatVerdict: "tient", verdict: "Votre projet tient." }, voeux, dossier, aujourdhui: AUJOURDHUI });
  const par = Object.fromEntries(r.etapes.map((e) => [e.id, e]));
  assert.equal(par.situation.faite, true);
  assert.equal(par.ressources.faite, true);
  assert.equal(par.voeux.faite, true);
  assert.equal(par.pieces.faite, true);
  assert.equal(par.ef_compte.faite, true);
  assert.equal(par.ef_pieces.faite, true);
  assert.equal(par.ef_voeux.faite, false, "une lettre sur deux : les motivations ne sont pas faites");
  assert.equal(r.courante.id, "ef_voeux");
  assert.equal(par.ef_soumission.faite, false, "soumission sans numéro de dossier : pas faite");
  assert.equal(par.ef_soumission.cochee, true);
  assert.equal(par.ef_soumission.preuve.requise, true);
  assert.equal(par.ef_soumission.preuve.libelle, "votre numéro de dossier");
  // Avec le numéro, et la seconde lettre : la route avance.
  voeux[1].motivation = { faite: true };
  dossier.etapes.ef_soumission.preuve = "SN123456";
  const r2 = construireRoute({ procedure: SENEGAL, profile: SITUATION, diagnostic: { etatVerdict: "tient" }, voeux, dossier, aujourdhui: AUJOURDHUI });
  assert.equal(r2.courante.id, "ef_paiement");
  assert.equal(r2.faites, 9);
  assert.equal(r2.pourcentage, 60);
  // Les réponses : faites quand chaque vœu a la sienne.
  voeux[0].status = "admise"; voeux[1].status = "refusee";
  const r3 = construireRoute({ procedure: SENEGAL, profile: SITUATION, voeux, dossier, aujourdhui: AUJOURDHUI });
  assert.equal(r3.etapes.find((e) => e.id === "ef_reponse").faite, true);
  voeux[1].status = "en_attente";
  const r4 = construireRoute({ procedure: SENEGAL, profile: SITUATION, voeux, dossier, aujourdhui: AUJOURDHUI });
  assert.equal(r4.etapes.find((e) => e.id === "ef_reponse").faite, false);
  // Sans vœu, motivations et réponses disent pourquoi elles ne peuvent pas se faire.
  const r5 = construireRoute({ procedure: SENEGAL, voeux: [], aujourdhui: AUJOURDHUI });
  assert.match(r5.etapes.find((e) => e.id === "ef_voeux").empechement, /au moins un vœu/);
});

test("route 6 — les faits de pays ne viennent que de la couche : dates et montant au Sénégal, rien au Ghana, et la mention le dit", () => {
  const sn = construireRoute({ procedure: SENEGAL, aujourdhui: AUJOURDHUI });
  const gh = construireRoute({ procedure: GHANA, aujourdhui: AUJOURDHUI });
  assert.equal(sn.residenceDocumentee, true);
  assert.equal(gh.residenceDocumentee, false);
  const snPar = Object.fromEntries(sn.etapes.map((e) => [e.id, e]));
  const ghPar = Object.fromEntries(gh.etapes.map((e) => [e.id, e]));
  assert.deepEqual(snPar.ef_soumission.echeance, { iso: "2026-12-15", libelle: snPar.ef_soumission.echeance.libelle, debut: false, jours: 71 });
  assert.equal(snPar.ef_paiement.officielle.montant, 85000);
  assert.equal(snPar.ef_paiement.officielle.devise, "XOF");
  assert.equal(snPar.ef_visa.echeance.debut, true, "le visa s'ouvre à partir d'une date, il ne se ferme pas à cette date");
  assert.equal(ghPar.ef_soumission.echeance, null);
  assert.equal(ghPar.ef_paiement.officielle.montant, undefined);
  assert.match(ghPar.ef_paiement.officielle.mention, /pas encore documenté/);
  assert.ok(gh.etapes.every((e) => !e.echeance), "aucune date d'un autre pays au Ghana");
  // Les pièces : le tronc, plus celles de la couche.
  const piecesSN = piecesDuDossier(SENEGAL);
  const piecesGH = piecesDuDossier(GHANA);
  assert.ok(piecesSN.length > piecesGH.length, "la couche Sénégal ajoute ses pièces");
  assert.ok(piecesSN.every((p) => p.slug && p.nom && p.tailleMax), "chaque pièce a un slug, un nom, un poids");
  assert.ok(piecesSN.some((p) => p.traduction), "les diplômes se traduisent");
  assert.equal(new Set(piecesSN.map((p) => p.slug)).size, piecesSN.length, "slugs uniques");
  assert.equal(slugPiece("Photo d'identité"), "photo-d-identite");
  // Une pièce qui ne concerne pas l'étudiant compte comme réglée.
  const cochees = Object.fromEntries(piecesSN.map((p) => [p.slug, true]));
  cochees[piecesSN[3].slug] = "non-concerne";
  const rp = construireRoute({ procedure: SENEGAL, dossier: { pieces: cochees }, aujourdhui: AUJOURDHUI });
  const ep = rp.etapes.find((e) => e.id === "pieces");
  assert.equal(ep.faite, true);
  assert.equal(ep.pieces[3].ecartee, true);
  assert.equal(ep.pieces[3].obtenue, false);
  // Sans procédure du tout : la route existe, sans étape officielle, et les pièces sont vides.
  const sans = construireRoute({ procedure: null, aujourdhui: AUJOURDHUI });
  assert.equal(sans.etapes.length, 15);
  assert.equal(sans.etapes.find((e) => e.id === "pieces").pieces.length, 0);
});

test("route 7 — le visa : la demande, puis les six démarches du départ", () => {
  const tout = {};
  VISA_ETAPES.forEach((id) => { tout[id] = true; });
  const dossier = { etapes: { ef_visa: { faite: true, faitLe: "2027-05-10", preuve: "" } } };
  const a = construireRoute({ procedure: SENEGAL, dossier, visaChecklist: {}, aujourdhui: AUJOURDHUI });
  const b = construireRoute({ procedure: SENEGAL, dossier, visaChecklist: tout, aujourdhui: AUJOURDHUI });
  const va = a.etapes.find((e) => e.id === "ef_visa");
  const vb = b.etapes.find((e) => e.id === "ef_visa");
  assert.equal(va.faite, false);
  assert.equal(va.visa.faites, 0);
  assert.equal(vb.faite, true);
  assert.equal(vb.visa.faites, VISA_ETAPES.length);
});

test("route 8 — les plafonds du portail se disent, ils ne bloquent pas", () => {
  assert.equal(PLAFOND_VOEUX, 7);
  assert.deepEqual(avertissementsVoeux([]), []);
  const sept = Array.from({ length: 7 }, (_, i) => voeu(`pre-${i + 1}`));
  assert.deepEqual(avertissementsVoeux(sept), []);
  const quatreL1 = Array.from({ length: 4 }, (_, i) => voeu(`pre-${i + 1}`, { niveau: "Licence 1" }));
  assert.deepEqual(avertissementsVoeux(quatreL1), ["Licence 1 : 3 vœux au maximum sur le portail, vous en avez 4."]);
  const huit = Array.from({ length: 8 }, (_, i) => voeu(`pre-${i + 1}`));
  assert.match(avertissementsVoeux(huit)[0], /7 vœux au maximum/);
  const r = construireRoute({ procedure: SENEGAL, voeux: huit, aujourdhui: AUJOURDHUI });
  assert.equal(r.avertissementsVoeux.length, 1);
  assert.equal(r.etapes.find((e) => e.id === "voeux").faite, true, "un vœu de trop se dit, il ne bloque pas la route");
});

test("route 9 — tout accompli : plus de courante, cent pour cent, et la phrase de fin", () => {
  const dossier = { etapes: {}, pieces: Object.fromEntries(piecesDuDossier(SENEGAL).map((p) => [p.slug, true])) };
  for (const e of ETAPES_ROUTE.filter((x) => x.procedure)) {
    dossier.etapes[e.id] = { faite: true, faitLe: "2027-01-01", preuve: "REF-1" };
  }
  const tout = {};
  VISA_ETAPES.forEach((id) => { tout[id] = true; });
  const voeux = [voeu("pre-1", { motivation: { faite: true }, status: "admise" })];
  const r = construireRoute({ procedure: SENEGAL, profile: SITUATION, diagnostic: { etatVerdict: "tient" }, voeux, dossier, visaChecklist: tout, aujourdhui: AUJOURDHUI });
  assert.equal(r.courante, null);
  assert.equal(r.faites, 15);
  assert.equal(r.pourcentage, 100);
  assert.match(phraseDeRoute(r), /accompli les 15 étapes/);
});

test("route 10 — la page : une seule étape à l'écran, pas de rail ni de radar ni de boîte à outils, pas de sortie vers la vitrine", () => {
  const html = lire("espace-preinscription.html");
  const sansCommentaires = html.replace(/<!--[\s\S]*?-->/g, "");
  assert.match(sansCommentaires, /<body data-espace="preinscription">/);
  assert.match(sansCommentaires, /<script type="module" src="espace-preinscription\.js"><\/script>/);
  assert.ok(!sansCommentaires.includes("dashboard.js"), "l'ancien moteur ne doit plus être chargé");
  assert.match(sansCommentaires, /<link rel="stylesheet" href="css\/route\.css">/);
  for (const id of ["rtFil", "rtBarre", "rtEtape", "rtSuite", "rtLigne", "welcomeMessage"]) {
    assert.ok(sansCommentaires.includes(`id="${id}"`), `${id} manque`);
  }
  for (const ancien of ['id="jyRail"', 'id="jyRadar"', 'id="jyOpps"', 'id="jyApps"', "jy-tools", "jy-phase-voile", 'id="phase-']) {
    assert.ok(!sansCommentaires.includes(ancien), `${ancien} est revenu`);
  }
  assert.equal((sansCommentaires.match(/<h1\b/g) || []).length, 1, "un seul h1");
  for (const vitrine of ["preinscriptions.html", "universities.html", "scholarships.html"]) {
    assert.ok(!sansCommentaires.includes(`href="${vitrine}"`), `${vitrine} : sortie vers la vitrine`);
  }
  // Le moteur : chaque geste écrit au bon endroit.
  const moteur = lire("espace-preinscription.js");
  assert.match(moteur, /"dossierFrance\.pieces": pieces/, "les pièces s'écrivent sur le dossier");
  assert.match(moteur, /\[`dossierFrance\.etapes\.\$\{e\.id\}`\]/, "les étapes s'écrivent sur le dossier");
  assert.match(moteur, /portalUrl: PORTAIL_ETUDES_EN_FRANCE/, "un vœu porte toujours le portail Études en France");
  assert.match(moteur, /track: "preinscription"/);
  assert.match(moteur, /slotIdLibre\(etat\.voeux, quota, "pre"\)/, "les créneaux pre-N de la formule");
  assert.match(moteur, /preuveDepot: \{ mode: "numero", numeroDossier: numero, deposeLe: jour, declareLe: jour \}/, "le numéro de dossier vaut preuve de dépôt sur chaque vœu");
  assert.ok(!/<select\b/.test(moteur), "aucun menu déroulant du système : les choix passent par .fitz-choice");
  assert.ok(moteur.includes('class="fitz-choice"'));
  // La feuille : aucune classe qui n'existe que dans un @media.
  const css = lire("css/route.css");
  const horsMedia = css.replace(/@media[^{]*\{[\s\S]*?\n\}\n/g, "");
  const dansMedia = [...css.matchAll(/@media[^{]*\{([\s\S]*?)\n\}\n/g)].map((m) => m[1]).join("\n");
  for (const m of dansMedia.matchAll(/\.(rt-[a-z-]+)/g)) {
    assert.ok(horsMedia.includes(`.${m[1]}`), `.${m[1]} n'existe que dans un @media`);
  }
});
