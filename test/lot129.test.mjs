/**
* LOT 129 — les deux fausses contradictions du radar (2026-09-28).
*
* 1. UIR : « Elle a ouvert le 23 juin 2026 ; la date de clôture n'est
*    pas publiée. » La date d'OUVERTURE était lue comme l'échéance : la
*    bourse passait pour close depuis 97 jours, et le moteur ne la
*    proposait plus à aucun étudiant (0 profil sur 360).
* 2. Edinburgh : le radar lisait la prose (« séances d'information du 15
*    au 24 septembre ») au lieu de `deadlineISO` (19 novembre 2026,
*    vérifiée le 20/09), que le moteur lit, lui, depuis le lot P5a.
*/
import test from "node:test";
import assert from "node:assert/strict";
import { analyserEcheance } from "../js/echeance.js";
import { echeanceDuProgramme, risqueDUnProgramme } from "../js/radar.js";
import { etatEcheance } from "../js/recommend-programs.js";

const MAINTENANT = new Date("2026-09-28T10:00:00Z");

const UIR = "La demande se dépose après l'inscription à l'UIR, sur la plateforme bourse.uir.ac.ma. Elle a ouvert le 23 juin 2026 ; la date de clôture n'est pas publiée. Les dossiers déposés en retard sont rejetés.";

const EDIMBOURG = "Les séances d'information sont obligatoires, du 15 au 24 septembre 2026. Les candidatures ouvrent le 13 octobre 2026. La déclaration du candidat doit être rendue avant le 19 octobre 2026 à 17h00, heure britannique. Elle peut fermer plus tôt, une fois le quota atteint. Le dossier complet et les formulaires d'évaluation sont à envoyer avant le 19 novembre 2026 à 17h00. Les études commencent en septembre 2027.";

test("lot 129 — une clôture non publiée ne devient jamais une échéance", () => {
const e = analyserEcheance(UIR);
assert.equal(e.etat, "inconnue");
assert.equal(e.date, null);
assert.equal(analyserEcheance("L'appel ouvre début novembre 2026. Sa date de clôture n'est pas encore publiée.").etat, "inconnue");
assert.equal(analyserEcheance("Plateforme ouverte le 23 juin 2026, clôture non publiée").etat, "inconnue");
});

test("lot 129 — le marqueur reste étroit : une date limite passée se lit toujours", () => {
// « pas encore publiées » ne vise ici que les dates de l'année SUIVANTE :
// la date limite écoulée doit rester lue.
const e = analyserEcheance("La date limite de la rentrée 2026-2027 était le 15 septembre 2026. Les dates de 2027-2028 ne sont pas encore publiées.");
assert.equal(e.etat, "datee");
assert.equal(e.date, "2026-09-15");
});

test("lot 129 — le moteur ne ferme plus la bourse de l'UIR", () => {
const etat = etatEcheance({ deadline: UIR, status: "Ouverte après l'inscription, sur bourse.uir.ac.ma" }, MAINTENANT);
assert.notEqual(etat.ouverte, false, "une clôture inconnue n'est pas une clôture passée");
});

test("lot 129 — le radar lit deadlineISO avant la prose, comme le moteur", () => {
const programme = { deadline: EDIMBOURG, deadlineISO: "2026-11-19", ouverteVerifieeLe: "2026-09-20" };
assert.equal(echeanceDuProgramme(programme).date, "2026-11-19");
const risque = risqueDUnProgramme(programme, "Ouverte", MAINTENANT);
assert.notEqual(risque.cle, "contradiction");
assert.equal(risque.jours, 52);
// Sans deadlineISO valide, la prose reste la source (rien n'est inventé).
assert.equal(echeanceDuProgramme({ deadline: EDIMBOURG, deadlineISO: "2026-02-31" }).date, analyserEcheance(EDIMBOURG).date);
assert.equal(echeanceDuProgramme({ deadline: UIR }).etat, "inconnue");
});
