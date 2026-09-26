/**
* LOT 117 (2026-09-26) — CE QUE LE TEST DU PARCOURS DE BRIGITTE A TROUVÉ
*
* 1. Une bourse fermée au profil (Konrad-Adenauer : déjà inscrit en
*    Allemagne ; Brigitte vit au Sénégal) : la fiche disait « Pourquoi
*    cette bourse vous correspond », l'espace la suivait comme les autres,
*    le rappel des échéances comptait ses 292 jours. Le motif ne vivait
*    que sur la page des candidatures.
* 2. Le guide de départ, sans admission, prenait le pays d'une bourse au
*    cycle clos (la Turquie, de la bourse Diyanet).
* 3. « Et pour Turquie, précisément » : l'article manquait.
*/
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { motifAccesFerme, pourquoiPlusProposable } from "../js/recommend-programs.js";
import { prochaineAction } from "../js/next-action.js";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(racine, f), "utf8").replace(/\r\n/g, "\n");
const catalogue = JSON.parse(lire("assets/data/catalogue.json"));
const kas = catalogue.scholarships.find((s) => s.id === "konrad-adenauer-stiftung");

test("117 — le motif d'une bourse fermée au profil, une seule définition", () => {
assert.ok(kas && kas.exigences.includes("deja_inscrit_sur_place"));
const auSenegal = { nationality: "Sénégal", country: "Sénégal", targetLevel: "Licence" };
assert.equal(motifAccesFerme(kas, auSenegal), "elle est réservée aux étudiants déjà inscrits sur place");
assert.equal(motifAccesFerme(kas, { ...auSenegal, country: "Allemagne" }), "", "déjà en Allemagne : rien ne ferme");
assert.equal(motifAccesFerme(null, auSenegal), "");
// La page des candidatures dit toujours la même chose, mot pour mot.
assert.equal(pourquoiPlusProposable({ program: { level: "Licence" }, scholarship: kas, profile: auSenegal }), "elle est réservée aux étudiants déjà inscrits sur place");
});

test("117 — l'espace fait de la bourse fermée au profil une décision, pas une échéance", () => {
const etape = (id, done = false) => ({ id, label: id, done });
const app = (id, champs) => ({ id, university: "Humboldt-Universität zu Berlin", scholarship: "Konrad-Adenauer-Stiftung", status: "a_preparer", etapes: [etape("profile", true), etape("dossier")], deadline: "2027-07-15", ...champs });
const a = prochaineAction({ profileScore: 100, applications: [app("slot-4", { fermeeAuProfil: "elle est réservée aux étudiants déjà inscrits sur place" })] });
assert.equal(a.cle, "fermee-au-profil:slot-4");
assert.equal(a.titre, "Konrad-Adenauer-Stiftung ne vous est pas ouverte");
assert.match(a.texte, /^D'après votre profil, elle est réservée aux étudiants déjà inscrits sur place\./);
// Un cycle clos passe toujours avant (il était déjà la priorité).
const b = prochaineAction({ profileScore: 100, applications: [
app("slot-4", { fermeeAuProfil: "elle est réservée aux étudiants déjà inscrits sur place" }),
app("slot-2", { scholarship: "Diyanet", echeance: { lie: true, etat: { ouvert: false } } })
] });
assert.equal(b.cle, "cycle-clos:slot-2");
// Sans motif, rien ne change.
const c = prochaineAction({ profileScore: 100, applications: [app("slot-1", {})] });
assert.ok(!/fermee-au-profil/.test(c.cle));
});

test("117 — la fiche, l'espace et le guide de départ lisent le même motif", () => {
const details = lire("details.js");
assert.match(details, /const motifAcces = motifAccesFerme\(scholarshipData, profile\);/);
assert.ok(details.indexOf("const motifAcces = motifAccesFerme") < details.indexOf("const fermeeAuProfil = verdicts.some"), "le motif ferme la fiche avant qu'on liste des raisons");
const hub = lire("dashboard.js");
assert.match(hub, /fermeeAuProfil: echeance && echeance\.lie && echeance\.bourse \? motifAccesFerme\(echeance\.bourse, profile \|\| \{\}\) : ""/);
assert.match(hub, /renderRadar\(applications\.filter\(\(app\) => !app\.fermeeAuProfil\)\);/);
assert.match(hub, /Pas ouverte à votre profil/);
// Le guide de départ, sans admission : ni cycle clos, ni bourse fermée.
assert.match(hub, /&& !a\.fermeeAuProfil\n&& !\(a\.echeance && a\.echeance\.lie && a\.echeance\.etat && a\.echeance\.etat\.ouvert === false\)\);/);
// Et l'article du pays.
assert.match(hub, /Et pour \$\{ech\(avecArticle\(destination\.pays\)\)\}, précisément/);
});
