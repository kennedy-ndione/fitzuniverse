/**
 * ============================================================
 * test/radar-echeances.test.mjs — le radar dit-il la vérité ?
 * ============================================================
 *
 * Le radar sert à décider QUOI revérifier en premier. Un radar qui se
 * trompe de priorité est pire qu'aucun radar : il donne la sensation
 * d'avoir traité le sujet.
 *
 * On vérifie donc sa règle de classement sur des cas construits, où
 * l'on sait ce que la réponse doit être — pas sur le catalogue réel,
 * qui change à chaque export.
 * ============================================================
 */

import { test } from "node:test";
import assert from "node:assert/strict";

// La logique a déménagé dans js/radar.js le 2026-09-05 (module pur
// partagé avec admin/radar.html) ; scripts/radar-echeances.mjs n'en
// est plus que la façade en ligne de commande.
import { risqueDUnProgramme, RISQUES, ORIGINES } from "../js/radar.js";
import { estEligible, isoDeNationalite } from "../js/eligibility-countries.js";

const LE_JOUR = new Date("2026-09-05T12:00:00Z");

test("annoncée ouverte avec une date dépassée = contradiction", () => {

  const r = risqueDUnProgramme({ deadline: "31 août 2026", status: "Ouverte" }, "Ouverte", LE_JOUR);

  assert.equal(r.cle, "contradiction");
  assert.ok(r.jours < 0, "le retard doit être compté en jours négatifs");

});

test("annoncée ouverte alors que la prose dit elle-même « clos » = contradiction", () => {

  // Aucune date exploitable ici : c'est le mot qui contredit le statut.
  const r = risqueDUnProgramme(
    { deadline: "calendrier 2026-2027 clos le 29/10/2025 — à vérifier", status: "Ouverte" },
    "Ouverte",
    LE_JOUR
  );

  assert.equal(r.cle, "contradiction");

});

test("fermée et cohérente : à documenter, pas une alerte", () => {

  const r = risqueDUnProgramme({ deadline: "Cycle clos", status: "Fermée" }, "Fermée", LE_JOUR);

  assert.equal(r.cle, "fermee");

});

test("les seuils suivent js/echeance.js : 14 jours critique, 60 jours proche", () => {

  assert.equal(risqueDUnProgramme({ deadline: "15 septembre 2026", status: "Ouverte" }, "Ouverte", LE_JOUR).cle, "critique");
  assert.equal(risqueDUnProgramme({ deadline: "15 octobre 2026", status: "Ouverte" }, "Ouverte", LE_JOUR).cle, "proche");
  assert.equal(risqueDUnProgramme({ deadline: "15 mars 2027", status: "Ouverte" }, "Ouverte", LE_JOUR).cle, "ouverte");

});

test("ouverte sans date exploitable : l'étudiant ne sait pas de combien de temps il dispose", () => {

  const r = risqueDUnProgramme({ deadline: "À confirmer selon l'année académique", status: "Ouverte" }, "Ouverte", LE_JOUR);

  assert.equal(r.cle, "sansDate");
  assert.equal(r.jours, null, "aucune date ne doit être inventée");

});

test("l'ordre des poids fait remonter la contradiction avant tout le reste", () => {

  const ordonne = Object.entries(RISQUES).sort((a, b) => b[1].poids - a[1].poids).map(([cle]) => cle);

  assert.equal(ordonne[0], "contradiction");
  assert.ok(ordonne.indexOf("depassee") < ordonne.indexOf("critique"));
  assert.ok(ordonne.indexOf("critique") < ordonne.indexOf("proche"));
  assert.ok(ordonne.indexOf("sansDate") < ordonne.indexOf("fermee"));

});

/* ------------------------------------------------------------------
 * L'ACCORD ENTRE LE RADAR ET LA CARTE
 * ------------------------------------------------------------------
 * Le 2026-09-05, Charles a vu à l'écran ce qu'aucun test ne disait :
 * le radar classait Stipendium Hungaricum « Ouverte, échéance
 * lointaine » pendant que la carte du catalogue affichait
 * « Candidatures pas encore ouvertes ». Deux surfaces, deux vérités.
 *
 * Ce test verrouille l'invariant : la catégorie de risque et la
 * pastille affichée ne peuvent plus se contredire.
 * ------------------------------------------------------------------ */

import { construireRadar } from "../js/radar.js";

const CATALOGUE_TEMOIN = {
  genereLe: "2026-09-04T00:00:00.000Z",
  universities: [{ id: "u1", name: "Université témoin", country: "Hongrie", flag: "hu.svg" }],
  scholarships: [
    { id: "b-attente", title: "Cycle clos, suivant daté", country: "Hongrie", status: "Fermée", isActive: true },
    { id: "b-ouverte", title: "Ouverte et datée", country: "Hongrie", status: "Ouverte", isActive: true },
    { id: "b-contra", title: "Ouverte mais dépassée", country: "Hongrie", status: "Ouverte", isActive: true }
  ],
  programs: [
    { id: "p1", universityId: "u1", scholarshipId: "b-attente", level: "Master", deadline: "15 janvier 2027", status: "Fermée" },
    { id: "p2", universityId: "u1", scholarshipId: "b-ouverte", level: "Master", deadline: "15 janvier 2027", status: "Ouverte" },
    { id: "p3", universityId: "u1", scholarshipId: "b-contra", level: "Master", deadline: "24 novembre 2025", status: "Ouverte" }
  ]
};

test("radar et carte disent la même chose de chaque bourse", () => {

  const radar = construireRadar(CATALOGUE_TEMOIN, LE_JOUR);
  const par = Object.fromEntries(radar.lignes.map((l) => [l.id, l]));

  assert.equal(par["b-attente"].risque, "pasEncoreOuverte");
  assert.equal(par["b-attente"].badgeAffiche, "Candidatures pas encore ouvertes");

  assert.equal(par["b-ouverte"].badgeAffiche, "Candidatures ouvertes");
  assert.ok(!["contradiction", "depassee", "pasEncoreOuverte", "fermee"].includes(par["b-ouverte"].risque));

  assert.equal(par["b-contra"].risque, "contradiction");
  assert.equal(par["b-contra"].badgeAffiche, "Candidatures closes");

});

test("aucune bourse annoncée ouverte ne peut être classée fermée, et réciproquement", () => {

  for (const ligne of construireRadar(CATALOGUE_TEMOIN, LE_JOUR).lignes) {

    if (ligne.badgeAffiche === "Candidatures ouvertes") {
      assert.ok(
        !["contradiction", "depassee", "pasEncoreOuverte", "fermee"].includes(ligne.risque),
        `« ${ligne.titre} » : carte « ouvertes » mais risque « ${ligne.risque} »`
      );
    }

    if (ligne.risque === "pasEncoreOuverte") {
      assert.equal(ligne.badgeAffiche, "Candidatures pas encore ouvertes", ligne.titre);
    }

  }

});

test("une échéance dépassée mais LUE il y a moins de 90 jours ne remonte plus en tête (2026-09-05, lot 40)", () => {

  const catalogue = {
    universities: [{ id: "u1", name: "Université témoin", country: "Hongrie", flag: "hu.svg" }],
    scholarships: [
      { id: "b-lue", title: "Cycle clos, page lue hier", country: "Hongrie", status: "Fermée", isActive: true, verifieLe: "2026-09-04" },
      { id: "b-oubliee", title: "Cycle clos, jamais lue", country: "Hongrie", status: "Fermée", isActive: true },
      { id: "b-vieille", title: "Cycle clos, lue il y a un an", country: "Hongrie", status: "Fermée", isActive: true, verifieLe: "2025-09-01" }
    ],
    programs: [
      { id: "p1", universityId: "u1", scholarshipId: "b-lue", level: "Master", deadline: "31 mars 2026", status: "Fermée" },
      { id: "p2", universityId: "u1", scholarshipId: "b-oubliee", level: "Master", deadline: "31 mars 2026", status: "Fermée" },
      { id: "p3", universityId: "u1", scholarshipId: "b-vieille", level: "Master", deadline: "31 mars 2026", status: "Fermée" }
    ]
  };

  const par = Object.fromEntries(construireRadar(catalogue, LE_JOUR).lignes.map((l) => [l.id, l]));

  assert.equal(par["b-lue"].risque, "fermee", "vérifiée hier : la date passée reste affichée mais ne fait plus alerte");
  assert.equal(par["b-oubliee"].risque, "depassee", "jamais lue : à revérifier");
  assert.equal(par["b-vieille"].risque, "depassee", "lue il y a un an : la vérification est périmée");
  assert.ok(par["b-oubliee"].priorite > par["b-lue"].priorite);

  // La carte, elle, ne change pas : les trois sont closes.
  for (const id of ["b-lue", "b-oubliee", "b-vieille"]) assert.equal(par[id].badgeAffiche, "Candidatures closes");

});

/* ------------------------------------------------------------------
 * L'instrument doit mesurer ce qu'il prétend mesurer
 * ------------------------------------------------------------------
 * La grille de profils a longtemps écrit la nationalité en ADJECTIF
 * (« Sénégalaise ») alors que le questionnaire enregistre un NOM DE
 * PAYS (« Sénégal »). isoDeNationalite() ne reconnaît que les noms et
 * les codes ISO : le filtre d'éligibilité était donc désactivé dans
 * toutes les mesures d'exposition, sans que rien ne le signale.
 *
 * Ce test n'est pas décoratif : il échoue si quelqu'un remet des
 * adjectifs, ou si une origine sort du référentiel de pays.
 */

test("chaque origine de la grille est une nationalité que le moteur sait résoudre", () => {

  for (const origine of ORIGINES) {
    assert.ok(
      isoDeNationalite(origine),
      `« ${origine} » n'est pas résolue en code pays — le filtre d'éligibilité serait muet pour ce profil.`
    );
  }

});

test("la grille discrimine réellement : une bourse réservée exclut au moins une origine", () => {

  // Bourse ouverte aux seuls pays d'Afrique : un profil français doit
  // en être exclu, un profil sénégalais doit y être éligible.
  const reserveeAfrique = { scope: "groupes", groups: ["afrique"] };

  assert.equal(estEligible(reserveeAfrique, "Sénégal"), true);
  assert.equal(estEligible(reserveeAfrique, "France"), false);

  const origines = new Set(ORIGINES);
  assert.ok(origines.has("Sénégal") && origines.has("France"),
    "la grille doit garder au moins une origine éligible et une exclue, sinon elle ne mesure aucun filtre");

});

test("tous les pays proposés par le questionnaire sont résolus par le module d'éligibilité", async () => {

  // Le défaut trouvé le 2026-09-05 : la liste que l'étudiant CLIQUE et
  // le référentiel qui décide de son éligibilité ne se parlaient pas.
  // « Vietnam », « Congo (République du) », « Taïwan », « Kosovo »,
  // « Antigua-et-Barbuda », « Saint-Kitts-et-Nevis »,
  // « Saint-Vincent-et-les-Grenadines » et « Îles Marshall » ne se
  // résolvaient pas : pour ces huit nationalités, estEligible() rendait
  // null partout et AUCUNE bourse réservée n'était ni proposée
  // franchement ni écartée. Un candidat d'Antigua ne se voyait pas
  // reconnu éligible aux bourses du Commonwealth qui lui sont ouvertes.
  const { PAYS_DU_MONDE } = await import("../js/eligibility-pistes.js");

  const nonResolus = PAYS_DU_MONDE.filter((p) => !isoDeNationalite(p));

  assert.deepEqual(nonResolus, [],
    `pays proposés à l'étudiant mais inconnus du module d'éligibilité : ${nonResolus.join(", ")}`);

});
