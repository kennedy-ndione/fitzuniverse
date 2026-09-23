/**
* Lot FINITIONS-VISUELLES (2026-09-11) — les vraies formules, sous leur
* vrai nom, dans l'espace admin.
*
*  1. aucune étiquette de l'admin n'est identique à une autre ;
*  2. chaque identifiant de PLAN_ORDER, de PLAN_PREINSCRIPTION_ORDER et le
*     Pass a une étiquette, celle du brief ;
*  3. la liste des retirées = les `deprecated:true` de pricing-plans.js ;
*     les distinctifs (quotas, durées) = ceux de pricing-plans.js ;
*  4. l'ordre : en vente d'abord, retirées ensuite, sous leur titre ;
*  5. le filtre de admin/students.html ne contient plus aucune option
*     écrite en dur ; la légende « Avancé » de admin/plans.html a disparu ;
*     les quatre pages admin passent par le module ;
*  6. js/fitz-select.js sait afficher un titre de groupe (<optgroup>).
*
* Preuve par mutation : DISTINCTIF["essentiel-4"] = "5 candidatures" →
* test 1 rouge (doublon avec l'ancienne) ET test 3 rouge (≠ quota).
*/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import vm from "node:vm";

import { PLAN_ORDER, PLAN_PREINSCRIPTION_ORDER } from "../js/plan-features.js";
import { PASS_ID, RETIREES, TITRE_RETIREES, TITRE_EN_VENTE, etiquetteAdmin, formulesAdmin, tousLesIdentifiants, optionsFormules, etiquettesDuCompte, estRetiree } from "../js/formules-admin.js";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");
const sansCommentaires = (s) => s.replace(/<!--[\s\S]*?-->/g, "");

function plansDuSite() {
const ctx = { window: {} };
ctx.globalThis = ctx;
vm.runInNewContext(lire("pricing-plans.js") + "\n;this.__plans = window.SCHOLARBRIDGE_PLANS;", ctx);
return ctx.__plans;
}

const ATTENDUES = {
[PASS_ID]: "Pass Découverte · 14 jours",
"premier-dossier": "Premier Dossier · 1 candidature",
"essentiel-4": "Essentiel · 4 candidatures",
"conseiller-6": "Conseiller · 6 candidatures",
"diagnostic-france": "Diagnostic France · 14 jours",
"dossier-france": "Dossier France · 7 vœux",
"dossier-france-conseiller": "Dossier France + Conseiller · 7 vœux",
essentiel: "Essentiel (ancienne) · 5 candidatures",
accompagnement: "Ambition (ancienne) · 9",
premium: "Premium (ancienne) · 12",
"signature-focus": "Conseiller (ancienne) · 12",
signature: "Signature (ancienne) · illimitée",
gratuit: "Gratuit"
};

test("formules-admin 1 — aucune étiquette n'est identique à une autre", () => {
const ids = tousLesIdentifiants();
const etiquettes = ids.map(etiquetteAdmin);
assert.equal(new Set(etiquettes).size, etiquettes.length, `doublons : ${etiquettes.filter((e, i) => etiquettes.indexOf(e) !== i).join(", ")}`);
for (const e of etiquettes) assert.ok(e && e.trim(), "étiquette vide");
});

test("formules-admin 2 — chaque identifiant (PLAN_ORDER, PLAN_PREINSCRIPTION_ORDER, Pass) a l'étiquette du brief", () => {
const ids = [PASS_ID, ...PLAN_ORDER, ...PLAN_PREINSCRIPTION_ORDER];
for (const id of ids) assert.equal(etiquetteAdmin(id), ATTENDUES[id], id);
assert.deepEqual(tousLesIdentifiants().sort(), ids.sort(), "tousLesIdentifiants couvre exactement les trois listes");
assert.equal(etiquetteAdmin(""), "");
});

test("formules-admin 3 — retirées et distinctifs ne divergent pas de pricing-plans.js", () => {
const plans = plansDuSite();
const depreciees = Object.keys(plans).filter((id) => plans[id].deprecated === true).sort();
assert.deepEqual([...RETIREES].sort(), depreciees, "RETIREES ≠ deprecated:true de pricing-plans.js");
for (const id of PLAN_ORDER) {
if (id === "gratuit") continue;
const q = plans[id].maxAccompaniedApplications;
const attendu = q === Infinity ? "illimitée" : String(q);
assert.match(etiquetteAdmin(id), new RegExp(`· ${attendu}( candidatures?)?$`), `${id} : quota ${q}`);
}
for (const id of PLAN_PREINSCRIPTION_ORDER) {
const p = plans[id];
if (p.maxPreinscriptions) assert.match(etiquetteAdmin(id), new RegExp(`· ${p.maxPreinscriptions} vœux$`), id);
else assert.match(etiquetteAdmin(id), new RegExp(`· ${p.duration}$`), id);
}
assert.match(etiquetteAdmin(PASS_ID), new RegExp(`· ${plans.fitzExpress.duration}$`));
for (const id of RETIREES) assert.ok(estRetiree(id) && /\(ancienne\)/.test(etiquetteAdmin(id)));
});

test("formules-admin 4 — en vente d'abord (7), retirées ensuite, sous leur titre ; le balisage porte les deux groupes", () => {
const { enVente, retirees } = formulesAdmin();
assert.equal(enVente.length, 7);
assert.deepEqual(enVente, [PASS_ID, "premier-dossier", "essentiel-4", "conseiller-6", ...PLAN_PREINSCRIPTION_ORDER]);
assert.deepEqual(retirees, PLAN_ORDER.filter((id) => RETIREES.includes(id)));
const html = optionsFormules({ vide: "Toutes les formules", avecGratuit: true });
assert.match(html, /^<option value="">Toutes les formules<\/option><option value="gratuit">Gratuit<\/option><optgroup label="En vente">/);
assert.ok(html.indexOf(`<optgroup label="${TITRE_EN_VENTE}">`) < html.indexOf(`<optgroup label="${TITRE_RETIREES}`));
assert.match(html, /Retirées de la vente — anciens comptes/);
assert.equal((html.match(/<option /g) || []).length, 1 + 1 + 7 + 5);
// La fiche : bourse seule, France seule.
const bourse = optionsFormules({ vide: "Sans formule", pass: false, preinscription: false });
assert.ok(!bourse.includes("fitzExpress") && !bourse.includes("dossier-france") && bourse.includes("essentiel-4") && bourse.includes(TITRE_RETIREES));
const france = optionsFormules({ vide: "Sans offre", pass: false, bourse: false });
assert.ok(!france.includes("essentiel") && france.includes("dossier-france-conseiller") && !france.includes(TITRE_RETIREES));
// Le compte : bourse ET France ; Pass seul ; rien.
assert.deepEqual(etiquettesDuCompte({ planId: "conseiller-6", planPreinscriptionId: "dossier-france" }).map((x) => x.etiquette), ["Conseiller · 6 candidatures", "Dossier France · 7 vœux"]);
assert.deepEqual(etiquettesDuCompte({ planId: "gratuit", passSeul: true }).map((x) => x.id), [PASS_ID]);
assert.deepEqual(etiquettesDuCompte({}).map((x) => x.etiquette), ["Gratuit"]);
});

test("formules-admin 5 — plus rien d'écrit en dur : filtre de students.html vide, légende « Avancé » partie, quatre pages sur le module", () => {
const students = sansCommentaires(lire("admin/students.html"));
assert.match(students, /<select id="planFilter"[^>]*><\/select>/, "le filtre doit être vide dans le HTML");
assert.ok(!/Avancé/.test(students));
const plansHtml = sansCommentaires(lire("admin/plans.html"));
assert.ok(!/Avancé/.test(plansHtml), "admin/plans.html : légende « Avancé »");
assert.ok(!/status-pill plan-/.test(plansHtml), "admin/plans.html : pastilles écrites en dur");
for (const f of ["admin/students.js", "admin/student-detail.js", "admin/plans.js", "admin/dashboard.js"]) {
assert.match(lire(f), /from "\.\.\/js\/formules-admin\.js"/, `${f} : n'importe pas le module`);
}
assert.match(lire("admin/students.js"), /optionsFormules\(/);
assert.match(lire("admin/students.js"), /etiquettesDuCompte\(/, "la colonne Formule montre bourse ET France");
assert.match(lire("admin/student-detail.js"), /optionsFormules\(\{ vide: "Sans formule", pass: false, preinscription: false \}\)/);
assert.match(lire("admin/plans.js"), /etiquetteAdmin\(/);
assert.match(lire("admin/dashboard.js"), /labels: planIds\.map\(\(id\) => etiquetteAdmin\(id\)\)/);
assert.ok(!/Object\.keys\(PLAN_LABELS\)/.test(lire("admin/dashboard.js")), "le graphique ignorait les offres France");
});

test("formules-admin 6 — la liste habillée affiche les titres de groupe", () => {
const src = lire("js/fitz-select.js");
assert.match(src, /querySelectorAll\("optgroup, option"\)/);
assert.match(src, /fitz-select-group/);
assert.match(src, /querySelectorAll\('\[role="option"\]'\)/, "les titres ne se parcourent pas au clavier");
assert.match(lire("css/fitz-select.css"), /\.fitz-select-group\{/);
});

// ============================================================
// 7. LE PASS DÉCOUVERTE DANS « GESTION DES FORMULES » (2026-09-23)
// ============================================================
// Charles : « je ne vois pas la formule Découverte » dans l'admin. Elle
// y a sa colonne, EN LECTURE SEULE : ses droits viennent de DROITS_PASS,
// que decideVerrou() applique — pas de config/planFeatures. Une case
// modifiable laisserait l'admin croire qu'il ouvre un outil qui reste
// fermé pour l'étudiant.
test("formules-admin 7 — le Pass Découverte a sa colonne, grisée, et elle dit ce que le code accorde", async () => {
  const plans = lire("admin/plans.js");
  assert.match(plans, /formulesAdmin\(\{ pass: true, avecGratuit: false \}\)/, "la grille doit inclure le Pass");
  assert.match(plans, /planId === PASS_ID \?/, "la colonne du Pass doit avoir son propre rendu");
  assert.match(plans, /<input type="checkbox" disabled/, "la colonne du Pass doit être en lecture seule");
  assert.match(plans, /DROITS_PASS\.includes\(key\)/, "la colonne du Pass doit lire DROITS_PASS");
  assert.match(plans, /input\[type="checkbox"\]\[data-plan\]/, "seules les cases modifiables écrivent");
  const { DROITS_PASS, decideVerrou } = await import("../js/plan-features.js");
  assert.deepEqual(DROITS_PASS, ["ai_chat", "support_ticket"], "le Pass n'ouvre que le chat et le service après-vente");
  for (const featureKey of ["ai_chat", "support_ticket", "ai_letter", "applications"]) {
    const ferme = decideVerrou({ planId: "gratuit", featureFlags: { [featureKey]: { gratuit: false } }, featureKey, hasFitzExpress: true });
    assert.equal(ferme, !DROITS_PASS.includes(featureKey), `${featureKey} : ce que l'admin affiche doit être ce que decideVerrou applique`);
  }
});

// MESSAGERIE POUR TOUS (2026-09-23) : la ligne d'un droit universel est
// cochée et grisée dans TOUTES les colonnes — l'admin ne peut pas couper
// un étudiant de l'équipe, et ne doit pas croire qu'il le peut.
test("formules-admin 8 — la messagerie, droit de tout compte, est une ligne figée dans l'admin", async () => {
  const plans = lire("admin/plans.js");
  assert.match(plans, /DROITS_UNIVERSELS\.includes\(key\)/, "la grille doit reconnaître les droits universels");
  assert.match(plans, /<input type="checkbox" disabled checked aria-label="\$\{label\} — ouvert à tous les comptes/, "ligne cochée et désactivée");
  const { DROITS_UNIVERSELS, decideVerrou } = await import("../js/plan-features.js");
  assert.deepEqual(DROITS_UNIVERSELS, ["student_messaging"]);
  assert.equal(decideVerrou({ planId: "gratuit", featureFlags: { student_messaging: { gratuit: false } }, featureKey: "student_messaging" }), false);
});
