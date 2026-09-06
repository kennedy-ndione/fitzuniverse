/**
 * ============================================================
 * test/verifier-profils.test.mjs — les profils du harnais tiennent
 * ============================================================
 *
 * Le harnais navigateur (scripts/verifier/) prend deux à trois minutes.
 * Ce test-ci fait, en quelques millisecondes et sans navigateur, la
 * seule vérification qui le fait échouer le plus souvent : un profil
 * qui ne répond pas à toutes les questions de sa piste.
 *
 * Autrement dit : ajouter une question à une piste sans compléter les
 * profils casse `npm test` TOUT DE SUITE, au lieu de casser le harnais
 * trois minutes plus tard — ou, pire, de ne casser que le jour où
 * quelqu'un pense à le lancer.
 *
 * Le parcours est rejoué avec la VRAIE classe ParcoursEligibilite,
 * pas avec une imitation : c'est elle qui décide de l'ordre, des
 * purges et des questions conditionnelles.
 * ============================================================
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import { ParcoursEligibilite } from "../js/eligibility-parcours.js";
import { resoudre, cycleViseEffectif, pisteDepuisNiveau } from "../js/eligibility-pistes.js";
import { PROFILS } from "../scripts/verifier/profils.mjs";

// Rejoue un profil comme le ferait la page, et rend la liste des
// questions posées.
function rejouer(profil) {

  const parcours = new ParcoursEligibilite();
  const posees = [];

  for (let garde = 0; garde < 40; garde += 1) {

    const question = parcours.courante();
    if (!question) break;

    posees.push(question);

    assert.ok(
      question.id in profil.reponses,
      `Profil « ${profil.cle} » : aucune réponse pour la question « ${question.id} » ` +
      `(« ${resoudre(question.question, parcours.reponses)} »). ` +
      `Compléter scripts/verifier/profils.mjs.`
    );

    if (question.type === "cards") {

      const options = resoudre(question.options, parcours.reponses) || [];
      const valeur = profil.reponses[question.id];

      assert.ok(
        options.some((o) => o.label === valeur),
        `Profil « ${profil.cle} », question « ${question.id} » : la réponse « ${valeur} » ` +
        `n'est pas une option proposée (${options.map((o) => o.label).join(" | ")}).`
      );

    }

    parcours.enregistrer(question.id, profil.reponses[question.id]);

    if (!parcours.suivante()) break;

  }

  return posees;

}

for (const profil of PROFILS) {

  test(`profil « ${profil.cle} » : toutes les questions de sa piste ont une réponse`, () => {

    const posees = rejouer(profil);

    assert.ok(posees.length >= 10, `${posees.length} questions seulement — parcours suspect.`);

  });

  test(`profil « ${profil.cle} » : aucune réponse inutile`, () => {

    const posees = rejouer(profil).map((q) => q.id);

    const inutiles = Object.keys(profil.reponses)
      .filter((cle) => cle !== "averageScale")
      .filter((cle) => !posees.includes(cle));

    assert.deepEqual(
      inutiles, [],
      `Profil « ${profil.cle} » : réponse(s) jamais demandée(s) — ${inutiles.join(", ")}. ` +
      `Soit la question a été retirée de la piste, soit l'aiguillage ne mène plus là.`
    );

  });

  test(`profil « ${profil.cle} » : un cycle visé et une piste sont bien produits`, () => {

    const parcours = new ParcoursEligibilite();

    for (const question of rejouer(profil)) {
      parcours.enregistrer(question.id, profil.reponses[question.id]);
    }

    assert.ok(cycleViseEffectif(parcours.reponses), "cycle visé vide");
    assert.ok(pisteDepuisNiveau(parcours.reponses.currentLevel), "piste vide");

  });

}
