/**
 * ============================================================
 * test/echeance-etat-candidature.test.mjs
 * ============================================================
 *
 * Le défaut mesuré le 2026-09-05 : la pastille du catalogue lisait
 * `isActive`, un drapeau éditorial, et non l'échéance. 42 bourses au
 * statut « Fermée » s'affichaient « Candidatures ouvertes ».
 *
 * Ces tests verrouillent la règle qui corrige ça, et surtout son ORDRE :
 * une date lue prime sur la prose du statut, dans les deux sens.
 * ============================================================
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import { etatCandidature } from "../js/echeance.js";

const LE_JOUR = new Date("2026-09-05T12:00:00Z");

test("une date encore à venir ouvre, et annonce les jours restants", () => {

  const r = etatCandidature({ statut: "Ouverte", echeances: ["15 octobre 2026"] }, LE_JOUR);

  assert.equal(r.ouvert, true);
  assert.equal(r.etiquette, "Date limite");
  assert.equal(r.valeur, "15 octobre 2026");
  assert.match(r.detail, /Il vous reste 40 jours/);

});

test("LE CAS EIFFEL — statut « Ouverte », échéance dépassée : la DATE gagne", () => {

  const r = etatCandidature({ statut: "Ouverte", echeances: ["24 novembre 2025"] }, LE_JOUR);

  assert.equal(r.ouvert, false, "une échéance dépassée ne peut pas rester « ouverte »");
  assert.equal(r.badge, "Candidatures closes");
  assert.equal(r.etiquette, "Dernière échéance connue",
    "la date dépassée ne doit JAMAIS s'afficher sous l'étiquette « Date limite »");
  assert.equal(r.valeur, "24 novembre 2025");

});

test("LE CAS DU CATALOGUE — statut « Fermée » : la carte ne dit plus « ouvertes »", () => {

  const r = etatCandidature({ statut: "Fermée", actif: true, echeances: [] }, LE_JOUR);

  assert.equal(r.ouvert, false);
  assert.equal(r.badge, "Candidatures closes");

});

test("LE CAS STIPENDIUM — statut « Fermée » + date future : PAS ENCORE ouverte", () => {

  // La bourse la plus exposée du catalogue (360 profils sur 360) porte
  // les deux, et les deux sont vrais : le cycle en cours est clos, le
  // suivant se clôturera le 15 janvier 2027 sans être ouvert
  // aujourd'hui. Une date future ne prouve pas l'ouverture.
  const r = etatCandidature({ statut: "Fermée", echeances: ["15 janvier 2027"] }, LE_JOUR);

  assert.equal(r.ouvert, false, "le portail n'accepte rien : ce n'est pas « ouvert »");
  assert.equal(r.ton, "attente");
  assert.equal(r.badge, "Candidatures pas encore ouvertes");
  assert.equal(r.etiquette, "Clôture annoncée", "surtout pas « Date limite »");
  assert.equal(r.valeur, "15 janvier 2027");
  assert.match(r.detail, /clôture attendue, pas l'ouverture/);

});

test("« pas encore ouverte » : periodeOuverture dit QUAND revenir", () => {

  const r = etatCandidature(
    { statut: "Fermée", echeances: ["15 janvier 2027"], periodeOuverture: "novembre 2026" },
    LE_JOUR
  );

  assert.match(r.detail, /Ouverture attendue : novembre 2026/);

});

test("une date future n'ouvre QUE si le statut ne dit pas le contraire", () => {

  const ouvert = etatCandidature({ statut: "Ouverte", echeances: ["15 janvier 2027"] }, LE_JOUR);
  assert.equal(ouvert.ouvert, true);
  assert.equal(ouvert.etiquette, "Date limite");

  const muet = etatCandidature({ statut: "", echeances: ["15 janvier 2027"] }, LE_JOUR);
  assert.equal(muet.ouvert, true, "sans statut contraire, la date fait foi");

});

test("la règle est DISSYMÉTRIQUE : une date passée ferme quoi qu'il arrive", () => {

  // Dans un sens, la date l'emporte sur la prose ; dans l'autre, non.
  // C'est volontaire : une date dépassée prouve qu'on ne peut plus rien
  // déposer, une date future ne prouve rien sur l'ouverture.
  assert.equal(etatCandidature({ statut: "Ouverte", echeances: ["24 novembre 2025"] }, LE_JOUR).ouvert, false);
  assert.equal(etatCandidature({ statut: "Fermée", echeances: ["15 janvier 2027"] }, LE_JOUR).ouvert, false);
  assert.equal(etatCandidature({ statut: "Ouverte", echeances: ["15 janvier 2027"] }, LE_JOUR).ouvert, true);

});

test("parmi plusieurs dates dont une future, statut ouvert : la future gagne", () => {

  const r = etatCandidature(
    { statut: "Ouverte", echeances: ["24 novembre 2025", "15 janvier 2027"] },
    LE_JOUR
  );

  assert.equal(r.ouvert, true);
  assert.equal(r.valeur, "15 janvier 2027");

});

test("entre deux dates ouvertes, c'est la plus proche qui est annoncée", () => {

  const r = etatCandidature({ echeances: ["15 mars 2027", "15 octobre 2026"] }, LE_JOUR);

  assert.equal(r.valeur, "15 octobre 2026");

});

test("le retrait volontaire (actif:false) ferme, quoi que dise le reste", () => {

  const r = etatCandidature({ statut: "Ouverte", actif: false, echeances: ["15 janvier 2027"] }, LE_JOUR);

  assert.equal(r.ouvert, false);

});

test("ouverte sans date lisible : ouverte, mais la date est dite NON PUBLIÉE", () => {

  const r = etatCandidature(
    { statut: "Ouverte", echeances: ["À confirmer selon l'année académique"] },
    LE_JOUR
  );

  assert.equal(r.ouvert, true);
  assert.equal(r.valeur, "Non publiée");
  assert.match(r.detail, /portail officiel/);

});

test("candidatures continues : au fil de l'eau, sans date inventée", () => {

  const r = etatCandidature({ statut: "Ouverte", echeances: ["Admissions au fil de l'eau"] }, LE_JOUR);

  assert.equal(r.ouvert, true);
  assert.equal(r.valeur, "Sans date limite");

});

test("rien de lisible et rien de dit : ouvert vaut null, jamais false", () => {

  const r = etatCandidature({ statut: "", echeances: [] }, LE_JOUR);

  assert.equal(r.ouvert, null, "« on ne sait pas » n'est pas « non »");
  assert.equal(r.ton, "inconnue");

});

test("periodeOuverture, quand elle existe, remplace « non annoncée »", () => {

  const avec = etatCandidature(
    { statut: "Fermée", periodeOuverture: "appel annuel, en février-mars" },
    LE_JOUR
  );

  assert.match(avec.detail, /Réouverture attendue : appel annuel, en février-mars/);

  const sans = etatCandidature({ statut: "Fermée" }, LE_JOUR);

  // Reformulé au lot 74 (2026-09-22) : plus de tiret long dans les
  // phrases que lit l'étudiant.
  assert.match(sans.detail, /La prochaine ouverture n'est pas encore annoncée\. Surveillez le portail officiel\./);

});

test("verifieLe produit une mention datée en français, et rien sans lui", () => {

  assert.equal(
    etatCandidature({ statut: "Ouverte", verifieLe: "2026-09-05" }, LE_JOUR).verifie,
    "Vérifié le 5 septembre 2026"
  );

  assert.equal(etatCandidature({ statut: "Ouverte" }, LE_JOUR).verifie, "");

});

test("aucune date n'est inventée quand la prose n'en donne pas", () => {

  for (const texte of ["Dates non publiées", "Calendrier 2027 non publié", ""]) {
    const r = etatCandidature({ statut: "Ouverte", echeances: [texte] }, LE_JOUR);
    assert.ok(!/\d{4}/.test(r.valeur), `« ${r.valeur} » contient une année inventée pour « ${texte} »`);
  }

});

test("DEUX STATUTS — « fermée » quelque part suffit à fermer", () => {

  // Trouvé en production le 2026-09-05 : les 33 programmes de
  // Stipendium Hungaricum portent « Ouverte » quand la bourse porte
  // « Fermée ». La carte disait « pas encore ouvertes », la fiche
  // disait « Candidatures ouvertes, il vous reste 132 jours ». Le même
  // site, deux réponses contraires sur le même dossier.
  const fiche = etatCandidature(
    { statut: ["Ouverte", "Fermée"], echeances: ["15 janvier 2027"] },
    LE_JOUR
  );

  const carte = etatCandidature({ statut: "Fermée", echeances: ["15 janvier 2027"] }, LE_JOUR);

  assert.equal(fiche.badge, carte.badge, "la fiche et la carte doivent dire la même chose");
  assert.equal(fiche.badge, "Candidatures pas encore ouvertes");

});

test("deux statuts ouverts n'ouvrent que si AUCUN ne dit le contraire", () => {

  assert.equal(etatCandidature({ statut: ["Ouverte", "Ouverte"], echeances: ["15 janvier 2027"] }, LE_JOUR).ouvert, true);
  assert.equal(etatCandidature({ statut: ["Fermée", "Ouverte"], echeances: ["15 janvier 2027"] }, LE_JOUR).ouvert, false);

});

test("un statut unique reste accepté tel quel (compatibilité)", () => {

  assert.equal(etatCandidature({ statut: "Ouverte", echeances: ["15 janvier 2027"] }, LE_JOUR).ouvert, true);
  assert.equal(etatCandidature({ statut: [], echeances: [] }, LE_JOUR).ouvert, null);

});

test("echeanceVariable : la page dit d'où vient la date au lieu d'en inventer une", () => {

  // Vérifié le 2026-09-05 : la date limite du DAAD dépend du pays de
  // résidence, celle de l'Eiffel de l'établissement français. Une date
  // unique serait fausse pour un site ouvert à tout étudiant.
  const pays = etatCandidature(
    { statut: "Ouverte", echeances: ["Dépend du pays."], echeanceVariable: "pays" },
    LE_JOUR
  );

  assert.equal(pays.valeur, "Selon votre pays");
  assert.match(pays.detail, /dépend de votre pays de résidence/);

  const etab = etatCandidature(
    { statut: "Fermée", echeances: ["Campagne close."], periodeOuverture: "octobre-novembre", echeanceVariable: "etablissement" },
    LE_JOUR
  );

  assert.match(etab.detail, /Réouverture attendue : octobre-novembre\./, "la ponctuation doit séparer les deux phrases");
  assert.match(etab.detail, /dépend de l'établissement choisi/);

});

test("sans echeanceVariable, rien ne change", () => {

  const r = etatCandidature({ statut: "Ouverte", echeances: ["Dates non publiées"] }, LE_JOUR);

  assert.equal(r.valeur, "Non publiée");
  assert.ok(!/dépend de/.test(r.detail));

});

/* ------------------------------------------------------------------
 * La date d'UN établissement n'est pas la date de la bourse
 * ------------------------------------------------------------------
 * Vu sur la page d'accueil le 2026-09-05 : le Deutschlandstipendium
 * annonçait « 25 jours restants » parce que l'une de ses trois
 * universités (Hanovre) publie sa fenêtre, les deux autres ayant leur
 * propre calendrier. Sur une vue d'ensemble, la seule réponse vraie
 * pour l'étudiant qui lit est la mention ; sur UNE fiche, la date de
 * cet établissement-là est bien la sienne et doit rester affichée.
 */

test("plusieurs échéances + echeanceVariable : la mention l'emporte sur la date d'un seul", () => {

  const r = etatCandidature({
    statut: "Ouverte",
    echeances: [
      "Cycle 2026/27 : candidatures du 10 août au 30 septembre 2026",
      "Appel publié chaque année en novembre-décembre",
      "Calendrier propre à l'université"
    ],
    echeanceVariable: "etablissement"
  }, LE_JOUR);

  assert.equal(r.ton, "ouverte");
  assert.equal(r.valeur, "Selon l'établissement");
  assert.equal(r.jours, null, "aucun compte à rebours ne serait vrai pour tout le monde");
  assert.match(r.detail, /Le premier calendrier publié ferme le 30 septembre 2026\./,
    "la date connue reste dite, comme exemple et non comme échéance");

});

test("une seule échéance + echeanceVariable : c'est la fiche de cet établissement, la date reste", () => {

  const r = etatCandidature({
    statut: "Ouverte",
    echeances: ["Cycle 2026/27 : candidatures du 10 août au 30 septembre 2026"],
    echeanceVariable: "etablissement"
  }, LE_JOUR);

  assert.equal(r.valeur, "30 septembre 2026");
  assert.equal(r.badge, "Candidatures ouvertes");
  assert.ok(r.jours > 0);

});

/* ------------------------------------------------------------------
 * LA PONCTUATION APPARTIENT À L'AFFICHAGE (2026-09-06)
 * ------------------------------------------------------------------
 * 88 des 129 `periodeOuverture` du catalogue se terminent déjà par un
 * point, les 41 autres non — elles ont été écrites à la main, une par
 * une. Le site produisait « … pour tous les admis.. » sur 88 fiches.
 * On ne retouche AUCUNE donnée : c'est la phrase qui pose son point,
 * et elle n'en pose qu'un.
 * ------------------------------------------------------------------ */

/** Toutes les fins de phrase de `detail`, pour compter les points doubles. */
function ponctuationDouble(detail) {
  return /[.!?]\s*\.|\.\.(?!\.)/.test(detail);
}

test("PONCTUATION — une periodeOuverture déjà ponctuée ne produit pas de double point", () => {

  const r = etatCandidature({
    statut: "Fermée",
    echeances: ["24 novembre 2025"],
    periodeOuverture: "Appel annuel, clôture mi-mars ; bourse complète pour tous les admis."
  }, LE_JOUR);

  assert.equal(r.ton, "close");
  assert.ok(!ponctuationDouble(r.detail), `double ponctuation dans « ${r.detail} »`);
  assert.match(r.detail, /admis\.$|admis\. /, "la note garde son sens, elle perd seulement le point en trop");

});

test("PONCTUATION — une periodeOuverture NON ponctuée reçoit son point", () => {

  const r = etatCandidature({
    statut: "Fermée",
    echeances: ["24 novembre 2025"],
    periodeOuverture: "Appel annuel, clôture mi-mars"
  }, LE_JOUR);

  assert.match(r.detail, /Réouverture attendue : Appel annuel, clôture mi-mars\./);
  assert.ok(!ponctuationDouble(r.detail));

});

test("PONCTUATION — les deux formes produisent EXACTEMENT la même fin de phrase", () => {

  const avec = etatCandidature({ statut: "Fermée", echeances: ["24 novembre 2025"], periodeOuverture: "en février-mars." }, LE_JOUR);
  const sans = etatCandidature({ statut: "Fermée", echeances: ["24 novembre 2025"], periodeOuverture: "en février-mars" }, LE_JOUR);

  assert.equal(avec.detail, sans.detail, "la ponctuation de la donnée ne doit rien changer à l'affichage");

});

test("PONCTUATION — « pas encore ouverte » termine sa phrase, ponctuée ou non", () => {

  const sans = etatCandidature({
    statut: "Fermée", echeances: ["15 janvier 2027"], periodeOuverture: "ouverture en novembre"
  }, LE_JOUR);

  const avec = etatCandidature({
    statut: "Fermée", echeances: ["15 janvier 2027"], periodeOuverture: "ouverture en novembre."
  }, LE_JOUR);

  assert.equal(sans.ton, "attente");
  assert.match(sans.detail, /Ouverture attendue : ouverture en novembre\.$/);
  assert.equal(avec.detail, sans.detail);
  assert.ok(!ponctuationDouble(avec.detail));

});

test("PONCTUATION — échéance variable agrégée : un seul point après la période", () => {

  const avec = etatCandidature({
    statut: "Ouverte", echeanceVariable: "pays",
    echeances: ["15 octobre 2026", "30 novembre 2026"],
    periodeOuverture: "selon le pays."
  }, LE_JOUR);

  const sans = etatCandidature({
    statut: "Ouverte", echeanceVariable: "pays",
    echeances: ["15 octobre 2026", "30 novembre 2026"],
    periodeOuverture: "selon le pays"
  }, LE_JOUR);

  assert.equal(avec.detail, sans.detail);
  assert.ok(!ponctuationDouble(avec.detail), `« ${avec.detail} »`);

});

test("PONCTUATION — statut ouvert sans date, échéance variable : idem", () => {

  const avec = etatCandidature({ statut: "Ouverte", echeanceVariable: "etablissement", periodeOuverture: "à confirmer auprès de l'établissement." }, LE_JOUR);
  const sans = etatCandidature({ statut: "Ouverte", echeanceVariable: "etablissement", periodeOuverture: "à confirmer auprès de l'établissement" }, LE_JOUR);

  assert.equal(avec.detail, sans.detail);
  assert.ok(!ponctuationDouble(avec.detail), `« ${avec.detail} »`);

});

test("PONCTUATION — une période rendue SEULE garde son texte intact", () => {

  // Ici `periodeOuverture` n'est pas cousue dans une phrase : elle EST
  // la phrase. On ne lui retire rien.
  const r = etatCandidature({ statut: "Ouverte", periodeOuverture: "Dossier examiné à réception." }, LE_JOUR);

  assert.equal(r.detail, "Dossier examiné à réception.");

});

test("PONCTUATION — une période rendue SEULE termine sa phrase (branche « ouverte »)", () => {

  // 9 bourses affichaient un detail qui s'arrêtait dans le vide, mesuré
  // le 2026-09-06 : « … suit les trois sessions d'admission de KAIST ».
  // La période n'était pas cousue dans une phrase, elle ÉTAIT la phrase,
  // et rien ne la terminait.
  const r = etatCandidature({
    statut: "Ouverte",
    periodeOuverture: "Le calendrier suit les trois sessions d'admission de KAIST"
  }, LE_JOUR);

  assert.equal(r.detail, "Le calendrier suit les trois sessions d'admission de KAIST.");

});

test("PONCTUATION — une période SEULE déjà ponctuée ne gagne pas un second point", () => {

  const avec = etatCandidature({ statut: "Ouverte", periodeOuverture: "Sessions d'admission de KAIST." }, LE_JOUR);
  const sans = etatCandidature({ statut: "Ouverte", periodeOuverture: "Sessions d'admission de KAIST" }, LE_JOUR);

  assert.equal(avec.detail, sans.detail);
  assert.ok(!ponctuationDouble(avec.detail));

});

test("PONCTUATION — une période SEULE finissant par une parenthèse reste lisible", () => {

  const r = etatCandidature({
    statut: "Ouverte",
    periodeOuverture: "Ouverture en septembre (à recouper sur le bando)"
  }, LE_JOUR);

  assert.equal(r.detail, "Ouverture en septembre (à recouper sur le bando).");

});

test("PONCTUATION — sans période, le texte de repli reste celui d'avant", () => {

  const r = etatCandidature({ statut: "Ouverte" }, LE_JOUR);

  // Reformulé au lot 74 (2026-09-22), même sens, sans tiret long.
  assert.match(r.detail, /Aucune date limite n'est publiée pour l'instant\./);

});
