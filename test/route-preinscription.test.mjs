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
  PLAFOND_VOEUX, PORTAIL_ETUDES_EN_FRANCE, NIVEAUX_VOEU, slugPiece,
  etatTraduction, DECLARATIONS_TRADUCTION, LIBELLES_TRADUCTION,
  PIECES_RESIDENCE_ABSENTE, PIECES_EN_CLAIR_SANS_RESIDENCE, ANNUAIRE_ESPACES_CAMPUS_FRANCE,
  avertissementProcedure, LIEN_CANDIDATURE_HORS_EEF
} from "../js/route-preinscription.js";
import {
  PAYS_ETUDES_EN_FRANCE, releveDeLaProcedureEEF, SOURCE_PAYS_EEF, PAYS_EEF_VERIFIE_LE
} from "../js/procedures/etudes-en-france-pays.js";
import { findCountry } from "../js/countries.js";
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
    pieces: Object.fromEntries(piecesDuDossier(SENEGAL).map((p) => [p.slug, true])),
    // Lot R10 : l'étape 4 attend AUSSI la langue des pièces.
    traductions: "francais"
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
  const rp = construireRoute({ procedure: SENEGAL, dossier: { pieces: cochees, traductions: "francais" }, aujourdhui: AUJOURDHUI });
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
  const dossier = { etapes: {}, pieces: Object.fromEntries(piecesDuDossier(SENEGAL).map((p) => [p.slug, true])), traductions: "francais" };
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

test("route 11 — LA LANGUE DES PIÈCES : une question, deux réponses, aucune déduction", () => {
  // DEMANDÉ PAR LE MANDAT « renforcer la préinscription » (2026-09-17),
  // après vérification à la source : Campus France écrit que « seules
  // les traductions effectuées auprès de cette liste de traducteurs sont
  // acceptées […] Toute autre traduction sera refusée ». Deux pièces du
  // dossier français portent `traduction: true`. Le site n'affichait
  // qu'un « à traduire si ce n'est pas en français » en petit : du bruit
  // pour l'étudiant dont tout est en français, un avertissement trop
  // faible pour l'autre — qui l'aurait découvert après 85 000 F de
  // frais non remboursables.
  //
  // Preuves par mutation (2026-09-17) : `traduction.reglee` retiré de
  // `faite` → test 3 rouge ; `!p.ecartee` retiré d'`etatTraduction` →
  // test 4 rouge ; `DECLARATIONS_TRADUCTION.includes` remplacé par un
  // test de vérité → test 5 rouge.

  const pieces = piecesDuDossier(SENEGAL).map((p) => ({ ...p, obtenue: false, ecartee: false }));
  const aTraduire = pieces.filter((p) => p.traduction).map((p) => p.nom);

  // 1. EXACTEMENT les pièces que la procédure marque, jamais une liste
  //    recopiée : ajouter une pièce à traduire dans le tronc doit
  //    suffire à la faire apparaître ici.
  assert.equal(aTraduire.length, 2, `${aTraduire.length} pièces à traduire dans le tronc France`);
  assert.deepEqual(etatTraduction(pieces, {}).concernees, aTraduire);

  // 2. Rien n'est réglé tant que rien n'est déclaré — et rien n'est
  //    déduit du profil : `situationFrancais` dit le NIVEAU DE LANGUE de
  //    l'étudiant, pas la langue de ses papiers. Un Marocain peut avoir
  //    étudié en français et tenir un bac délivré en arabe.
  const vide = etatTraduction(pieces, {});
  assert.equal(vide.declare, "");
  assert.equal(vide.reglee, false);
  assert.equal(vide.aFaire, false);
  assert.ok(!JSON.stringify(etatTraduction(pieces, { traductions: "" })).includes("situationFrancais"));

  // 3. L'étape 4 ne se coche pas tant que la question est ouverte : un
  //    dossier dont on ignore s'il faut trois semaines de traduction
  //    n'est pas « prêt ».
  const toutCoche = Object.fromEntries(piecesDuDossier(SENEGAL).map((p) => [p.slug, true]));
  const sansReponse = construireRoute({ procedure: SENEGAL, dossier: { pieces: toutCoche }, aujourdhui: AUJOURDHUI });
  const e4 = sansReponse.etapes.find((e) => e.id === "pieces");
  assert.equal(e4.faite, false, "toutes les pièces cochées ne suffisent pas");
  assert.equal(e4.traduction.reglee, false);
  for (const reponse of ["francais", "a_traduire"]) {
    const r = construireRoute({ procedure: SENEGAL, dossier: { pieces: toutCoche, traductions: reponse }, aujourdhui: AUJOURDHUI });
    assert.equal(r.etapes.find((e) => e.id === "pieces").faite, true, `réponse « ${reponse} » : l'étape doit se clore`);
  }
  // « a_traduire » clôt l'étape mais garde la démarche ouverte : ce sont
  // deux choses différentes, et les confondre bloquerait l'étudiant
  // pendant les trois semaines du traducteur.
  const aFaire = construireRoute({ procedure: SENEGAL, dossier: { pieces: toutCoche, traductions: "a_traduire" }, aujourdhui: AUJOURDHUI }).etapes.find((e) => e.id === "pieces");
  assert.equal(aFaire.traduction.aFaire, true);
  assert.deepEqual(aFaire.traduction.concernees, aTraduire);

  // 4. Une pièce ÉCARTÉE ne demande aucune traduction — et si les deux
  //    le sont, la question ne se pose plus du tout.
  const ecartees = pieces.map((p) => (p.traduction ? { ...p, ecartee: true } : p));
  const sansObjet = etatTraduction(ecartees, {});
  assert.deepEqual(sansObjet.concernees, []);
  assert.equal(sansObjet.reglee, true, "sans pièce concernée, la question ne se pose pas");

  // 5. Une valeur hors vocabulaire ne vaut pas réponse (URL bricolée,
  //    document ancien) : elle se lit comme « pas encore répondu ».
  assert.equal(etatTraduction(pieces, { traductions: "oui" }).declare, "");
  assert.equal(etatTraduction(pieces, { traductions: true }).declare, "");
  assert.deepEqual(Object.keys(LIBELLES_TRADUCTION).sort(), [...DECLARATIONS_TRADUCTION].sort());

  // 6. LA PAGE : la question, les deux réponses, le geste qui écrit au
  //    niveau du DOSSIER, et AUCUN contenu recopié de la fiche des
  //    documents — on y renvoie.
  const moteur = lire("espace-preinscription.js");
  assert.match(moteur, /function htmlTraduction\(e\) \{/);
  assert.match(moteur, /"dossierFrance\.traductions": valeur/, "la déclaration doit vivre au niveau du dossier");
  assert.match(moteur, /documents\.html\?categorie=administratif/, "la fiche « Traductions certifiées » n'est plus atteignable depuis l'étape");
  assert.match(moteur, /traducteur assermenté/);
  for (const recopie of ["1 à 3 semaines", "numéro d'agrément"]) {
    assert.ok(!moteur.includes(recopie), `« ${recopie} » est recopié de la fiche au lieu d'être lié`);
  }
  // Et Fitz pose la même question, avec les mêmes mots-clés.
  assert.match(lire("js/fitz-recours.js"), /vos relevés de notes et vos diplômes sont-ils en français/i);
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

  // DEUX CORRECTIONS MESURÉES À L'ÉCRAN LE 2026-09-17, à garder parce
  // qu'un chiffre se « range » vite sans qu'on voie ce qu'il tenait.
  //
  // 1. La croix d'un vœu. À 375 px la carte offre 280 px à l'intérieur
  //    et la rangée en demandait 292 (28 + 14 + 200 + 14 + 36) : la
  //    croix passait à la ligne, seule en bas à gauche. La base du
  //    texte doit rester assez petite pour que la rangée tienne.
  const base = Number((css.match(/\.rt-voeu-texte\{[^}]*flex:1 1 (\d+)px/) || [])[1]);
  assert.ok(base > 0, "la base du texte d'un vœu n'est plus déclarée en pixels");
  assert.ok(28 + 14 + base + 14 + 36 <= 280, `base de ${base}px : la croix repasse à la ligne sur un écran de 375 px`);

  // 2. « Ne me concerne pas » est posé SOUS sa carte : il doit être
  //    plus près d'elle que de la pièce suivante, sinon l'œil le lit
  //    comme le titre de la suivante (vu à l'écran, corrigé le même
  //    jour). Proximité : marge haute du bouton < écart entre pièces.
  const ecart = Number((css.match(/\.rt-pieces\{[^}]*gap:(\d+)px/) || [])[1]);
  const colle = Number((css.match(/\.rt-piece-ecarter\{[^}]*margin:(\d+)px/) || [])[1]);
  assert.ok(ecart > 0 && colle >= 0, "l'écart entre pièces ou la marge du bouton n'est plus en pixels");
  assert.ok(colle * 2 < ecart, `le bouton (marge ${colle}px) est aussi proche de la pièce suivante (écart ${ecart}px) que de la sienne`);
  assert.match(css, /\.rt-piece\{[^}]*align-items:flex-end/, "le bouton doit être attaché au bord droit de sa carte");
});

/**
 * ------------------------------------------------------------------
 * LOT R14 (2026-09-18) — un pays non documenté se DIT non documenté,
 * jusque dans la liste des pièces.
 *
 * LE DÉFAUT, MESURÉ : pour un pays de résidence sans couche — le Ghana
 * ici, qui relève bien de la procédure Études en France — l'étape 4
 * rendait SIX pièces contre HUIT au Sénégal, sous la phrase « Voici la
 * liste EXACTE de ce que le portail vous demandera ». Neuf des quinze
 * étapes portent déjà la mention du tronc, parce qu'elles passent par
 * composerEtape() ; celle des pièces est une étape de la ROUTE, donc
 * elle ne passait par aucune composition.
 *
 * CE QUE CES TESTS TIENNENT, et la nuance qui compte : on ne dit PAS à
 * l'étudiant qu'il lui manque des pièces — un seul des huit pays
 * documentés en ajoute. On dit qu'on ne sait pas, et où savoir.
 *
 * CINQ MUTATIONS VÉRIFIÉES : le drapeau retiré de l'étape · la phrase
 * d'origine rendue à un pays non documenté · la réserve passée SOUS la
 * liste · le style du lien retiré de css/route.css · la réserve qui
 * affirme « d'autres pièces manquent sûrement ». Chacune fait tomber
 * un test.
 * ------------------------------------------------------------------
 */

const routeDe = (procedure) => construireRoute({
  procedure, profile: SITUATION, diagnostic: null, voeux: [voeu("pre-1")],
  dossier: {}, visaChecklist: {}, aujourdhui: AUJOURDHUI
});
const etapePieces = (procedure) => routeDe(procedure).etapes.find((e) => e.id === "pieces");

test("route 12 — l'étape des pièces déclare que le pays n'est pas documenté", () => {
  const ghana = etapePieces(GHANA);
  const senegal = etapePieces(SENEGAL);

  // Le drapeau vient de la PROCÉDURE, pas d'un comptage de pièces : sept
  // des huit pays documentés n'ajoutent aucune pièce, et aucun d'eux ne
  // doit être pris pour un pays inconnu.
  assert.equal(GHANA.residenceDocumentee, false);
  assert.equal(SENEGAL.residenceDocumentee, true);
  assert.equal(ghana.residenceAbsente, true, "le Ghana n'est pas documenté : l'étape doit le dire");
  assert.equal(senegal.residenceAbsente, false, "le Sénégal est documenté : aucune réserve");

  // Et le drapeau ne se pose QUE sur l'étape des pièces.
  for (const e of routeDe(GHANA).etapes) {
    if (e.id !== "pieces") assert.equal(e.residenceAbsente, false, `${e.id} ne doit pas porter la réserve des pièces`);
  }

  // La liste est bien plus courte — c'est le fait qui a fait ce lot.
  assert.ok(ghana.pieces.length < senegal.pieces.length,
    `Ghana ${ghana.pieces.length} pièces, Sénégal ${senegal.pieces.length} : si les deux sont égales, ce test ne prouve plus rien`);
});

test("route 13 — la promesse « liste exacte » n'est faite qu'aux pays documentés", () => {
  const ghana = etapePieces(GHANA);
  const senegal = etapePieces(SENEGAL);

  // Un pays documenté garde sa promesse, mot pour mot : l'affaiblir pour
  // tout le monde serait payer le trou deux fois.
  assert.match(senegal.enClair, /la liste exacte de ce que le portail vous demandera/i);
  assert.equal(senegal.enClair, ETAPES_ROUTE.find((e) => e.id === "pieces").enClair);

  // Un pays non documenté ne se voit rien promettre d'exact.
  assert.equal(ghana.enClair, PIECES_EN_CLAIR_SANS_RESIDENCE);
  assert.ok(!/exacte/i.test(ghana.enClair), "on promet encore une liste exacte à un pays non vérifié");
  assert.match(ghana.enClair, /dans tous les pays/);
});

test("route 14 — la réserve dit ce qu'on ignore, pas ce qu'on invente", () => {
  // La calibration est le cœur du lot. Un seul des huit pays documentés
  // ajoute des pièces : annoncer à un Ghanéen qu'il lui en manque
  // sûrement le ferait courir pour rien, et le dépôt a déjà payé le prix
  // des faits fabriqués (lot R11, le score tiré d'un hash).
  assert.match(PIECES_RESIDENCE_ABSENTE, /n'est pas encore documenté/);
  assert.match(PIECES_RESIDENCE_ABSENTE, /\bsi\b/, "la réserve doit rester conditionnelle");
  assert.ok(!/manquent|il vous manque|d'autres pièces sont/i.test(PIECES_RESIDENCE_ABSENTE),
    "la réserve affirme des pièces manquantes qu'on n'a pas vérifiées");

  // Elle dit aussi QUOI FAIRE, et vers l'annuaire officiel — la seule
  // adresse qui reste juste quand un site national change d'URL.
  assert.match(PIECES_RESIDENCE_ABSENTE, /Demandez-lui sa liste/);
  assert.equal(ANNUAIRE_ESPACES_CAMPUS_FRANCE, "https://www.campusfrance.org/fr/espaces");
});

test("route 15 — la réserve se lit AVANT la liste, et son lien se voit", () => {
  const moteur = lire("espace-preinscription.js");
  const i = moteur.indexOf("function htmlPieces");
  const html = moteur.slice(i, moteur.indexOf("\nfunction ", i + 10));

  // Une réserve placée sous la liste se lit quand on a déjà cru la liste
  // complète : elle doit passer devant.
  assert.ok(html.indexOf("const reserve") !== -1, "htmlPieces ne construit plus la réserve");
  assert.ok(html.indexOf("${reserve}") < html.indexOf('<ul class="rt-pieces">'),
    "la réserve doit être rendue avant la liste des pièces");
  assert.match(html, /e\.residenceAbsente \?/, "la réserve doit dépendre du drapeau de l'étape");
  assert.match(html, /rel="noopener noreferrer"/, "un lien qui ouvre un onglet porte rel=noopener");

  // MÊME PIÈGE QU'AU LOT R13 : sans règle propre, le style de base du
  // site (a{text-decoration:none;color:inherit}) rendrait ce lien
  // indistinguable du texte — alors qu'il est la seule chose À FAIRE.
  const css = lire("css/route.css");
  const j = css.indexOf(".rt-avert a{");
  assert.notEqual(j, -1, "css/route.css n'a plus de style pour le lien d'une réserve");
  const regle = css.slice(j, css.indexOf("}", j));
  assert.match(regle, /text-decoration:underline/);
});


/**
 * ------------------------------------------------------------------
 * LOT R15 (2026-09-18) — quand la route n'est PAS la sienne.
 *
 * Onze des quinze étapes décrivent le portail Études en France. Cette
 * procédure ne s'applique que depuis 73 pays de résidence. Un étudiant
 * qui vit au Rwanda, en Tanzanie, en Belgique ou en Suisse candidate
 * DIRECTEMENT auprès de l'établissement : lui dérouler onze étapes qui
 * ne le concernent pas lui fait perdre sa campagne.
 *
 * LA RÈGLE DE PRUDENCE, qui est le cœur du lot : on n'avertit que
 * lorsqu'on SAIT. Un pays qu'on n'identifie pas ne reçoit rien — dire
 * « la procédure ne s'applique pas chez vous » à un Vietnamien parce
 * qu'on a mal lu sa graphie coûte plus cher qu'un silence.
 *
 * CINQ MUTATIONS VÉRIFIÉES : un pays inconnu qui déclenche l'avertissement ·
 * un pays de la liste qui le déclenche · l'article collé à la main ·
 * le compte des étapes écrit en dur · l'avertissement rendu sous le fil.
 * ------------------------------------------------------------------
 */

test("route 16 — la liste des 73 pays est celle de sa source, et elle est traçable", () => {
  assert.equal(PAYS_ETUDES_EN_FRANCE.length, 73,
    "la liste ne compte plus 73 pays : a-t-elle été revérifiée sur campusfrance.org ?");
  assert.equal(SOURCE_PAYS_EEF, "https://www.campusfrance.org/fr/faq/quels-sont-les-pays-relevant-de-la-procedure-etudes-en-france");
  assert.match(PAYS_EEF_VERIFIE_LE, /^\d{4}-\d{2}-\d{2}$/, "un fait de pays porte sa date de vérification");

  // Aucun doublon, et chaque entrée porte un nom.
  assert.equal(new Set(PAYS_ETUDES_EN_FRANCE.map((p) => p.nom)).size, 73);
  for (const p of PAYS_ETUDES_EN_FRANCE) assert.ok(p.nom && typeof p.nom === "string", "une entrée sans nom");

  // Les codes ISO sont uniques quand ils existent. DEUX entrées n'en ont
  // pas — Hong-Kong et Taïwan ne figurent pas dans js/countries.js. On
  // les garde pour que la liste reste comparable à sa source ligne à
  // ligne ; ils sont inatteignables à l'étape 1, donc inoffensifs.
  const isos = PAYS_ETUDES_EN_FRANCE.map((p) => p.iso).filter(Boolean);
  assert.equal(new Set(isos).size, isos.length, "deux entrées partagent un code ISO");
  const sansIso = PAYS_ETUDES_EN_FRANCE.filter((p) => !p.iso).map((p) => p.nom);
  assert.deepEqual(sansIso, ["Hong-Kong", "Taïwan"], "la liste des pays sans ISO a changé : vérifier js/countries.js");
  for (const nom of sansIso) assert.ok(!findCountry(nom), `${nom} est devenu connu du référentiel : lui rendre son ISO`);

  // Et chaque ISO déclaré correspond VRAIMENT à un pays du référentiel :
  // une faute de frappe dans un code ferait taire l'avertissement pour
  // un pays entier, sans que rien ne le signale.
  for (const p of PAYS_ETUDES_EN_FRANCE.filter((x) => x.iso)) {
    const trouve = findCountry(p.iso);
    assert.ok(trouve && trouve.iso === p.iso, `${p.nom} : le code ${p.iso} n'existe pas dans js/countries.js`);
  }
});

test("route 17 — on n'avertit que lorsqu'on sait : trois réponses, pas deux", () => {
  // Dans la liste.
  assert.equal(releveDeLaProcedureEEF("Sénégal"), true);
  assert.equal(releveDeLaProcedureEEF("Ghana"), true, "le Ghana y est : c'est la liste nationale qui fait foi, pas celle d'un site local");
  assert.equal(releveDeLaProcedureEEF("CI"), true, "le code ISO doit suffire");

  // Hors de la liste, et identifié : on avertit.
  assert.equal(releveDeLaProcedureEEF("Rwanda"), false);
  assert.equal(releveDeLaProcedureEEF("Belgique"), false);

  // Non identifiable : on se TAIT. C'est la règle qui protège le plus.
  assert.equal(releveDeLaProcedureEEF(""), null);
  assert.equal(releveDeLaProcedureEEF("Wakanda"), null);
  assert.equal(releveDeLaProcedureEEF("Sénégalais"), null, "un gentilé n'est pas un pays");
  assert.equal(avertissementProcedure("Wakanda"), null, "un pays inconnu ne doit jamais recevoir d'avertissement");
  assert.equal(avertissementProcedure(""), null);
  assert.equal(avertissementProcedure("Sénégal"), null);
});

test("route 18 — l'avertissement dit le pays, le compte exact et la marche à suivre", () => {
  const a = avertissementProcedure("rwanda");
  assert.ok(a, "un pays hors procédure doit être averti");

  // L'article vient du module de grammaire, jamais collé à la main :
  // « depuis le Rwanda », et non « depuis Rwanda ».
  assert.equal(a.pays, "le Rwanda");
  assert.match(a.texte, /depuis le Rwanda/);
  assert.equal(avertissementProcedure("Belgique").pays, "la Belgique");

  // Le compte se DÉDUIT de la route : il ne peut pas mentir si la route
  // change de longueur.
  const propres = ETAPES_ROUTE.filter((e) => !e.procedure).length;
  const portail = ETAPES_ROUTE.length - propres;
  assert.equal(propres, 4);
  assert.equal(portail, 11);
  assert.match(a.texte, new RegExp(`Les ${propres} premières étapes`));
  assert.match(a.texte, new RegExp(`les ${portail} suivantes`));

  // Ce qu'il faut faire à la place, et la preuve.
  assert.match(a.texte, /directement auprès de chaque établissement/);
  assert.equal(a.lien, LIEN_CANDIDATURE_HORS_EEF);
  assert.equal(a.lien, "https://www.campusfrance.org/fr/candidature-enseignement-superieur-france");
  assert.equal(a.source, SOURCE_PAYS_EEF);
  assert.equal(a.verifieLe, PAYS_EEF_VERIFIE_LE);
});

test("route 19 — les deux réserves de la route ne se confondent jamais", () => {
  // Elles disent deux choses différentes, et un étudiant peut n'avoir
  // que l'une des deux. Les confondre reviendrait à dire à un Ghanéen
  // que sa procédure n'est pas la bonne.
  const routeDuPays = (pays) => construireRoute({
    procedure: trouverProcedure({ paysDestination: "France", paysResidence: pays }),
    profile: { ...SITUATION, country: pays }, diagnostic: null, voeux: [voeu("pre-1")],
    dossier: {}, visaChecklist: {}, aujourdhui: AUJOURDHUI
  });

  const ghana = routeDuPays("Ghana");
  assert.equal(ghana.avertissementProcedure, null, "le Ghana relève de la procédure : aucun avertissement de procédure");
  assert.equal(ghana.etapes.find((e) => e.id === "pieces").residenceAbsente, true, "mais son pays n'est pas documenté : la réserve des pièces reste");

  const senegal = routeDuPays("Sénégal");
  assert.equal(senegal.avertissementProcedure, null);
  assert.equal(senegal.etapes.find((e) => e.id === "pieces").residenceAbsente, false, "le Sénégal n'a aucune des deux");

  const rwanda = routeDuPays("Rwanda");
  assert.ok(rwanda.avertissementProcedure, "le Rwanda ne relève pas de la procédure");
  assert.match(rwanda.avertissementProcedure.texte, /depuis le Rwanda/);
});

test("route 20 — l'avertissement se lit AVANT le fil et l'étape, et ses liens se voient", () => {
  const html = lire("espace-preinscription.html");
  const moteur = lire("espace-preinscription.js");

  // Sa place est en haut : un étudiant qui apprend à l'étape 5 que le
  // portail n'est pas le sien a déjà déroulé quatre étapes pour rien.
  assert.match(html, /id="rtAvertProcedure"/);
  assert.ok(html.indexOf('id="rtAvertProcedure"') < html.indexOf('id="rtFil"'),
    "l'avertissement doit précéder le fil des quinze étapes");
  assert.ok(html.indexOf('id="rtAvertProcedure"') > html.indexOf('id="rtLigne"'),
    "il se lit après la phrase d'accueil, pas avant");

  // Rempli depuis la route, et ABSENT du DOM quand il n'y a rien à dire.
  assert.match(moteur, /etat\.route\.avertissementProcedure/);
  assert.match(moteur, /zoneAvert\.innerHTML = avert \? `/);
  assert.match(moteur, /: "";/);

  // Deux liens sortent d'ici : la marche à suivre et la source. Sans une
  // règle propre, le style de base du site les rendrait invisibles.
  const css = lire("css/route.css");
  assert.notEqual(css.indexOf(".rt-avert a{"), -1);
  const j = css.indexOf(".rt-avert .rt-source a{");
  assert.notEqual(j, -1, "la source d'une réserve doit rester discrète, pas grasse comme un appel à l'action");
  assert.match(css.slice(j, css.indexOf("}", j)), /font-weight:400/);
});
