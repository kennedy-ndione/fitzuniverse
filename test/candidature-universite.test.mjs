/**
* LA CANDIDATURE, UNIVERSITÉ PAR UNIVERSITÉ (relecture du 2026-09-25).
*
* La relecture de l'espace étudiant (route Italie, en ligne) a trouvé :
* aucune étape pour candidater sur le site de l'université ; le bloc
* « admission » du catalogue jamais lu par l'espace ; un dépôt prouvé
* par un numéro seulement ; le choix du cours demandé deux fois ; et un
* onglet « Ma route vers la France » pendant le chargement. Ces tests
* tiennent les corrections.
*/
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { construireRoutePays, ficheDuVoeu, STATUTS_DEPOSES_VOEU } from "../js/route-destination.js";
import { DESTINATIONS_ACCOMPAGNEES, destination } from "../js/destinations-preinscription.js";
import { trouverProcedure } from "../js/procedures/index.js";
import { defautsDesEnClair } from "../js/route-preinscription.js";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(racine, f), "utf8");
const procedureDe = (id) => trouverProcedure({ paysDestination: destination(id).nom });

const UNIS = [
{ id: "universita-di-pisa-pise", name: "Università di Pisa", city: "Pise", country: "Italie", officialWebsite: "https://www.unipi.it",
admission: { procedure: "Candidature sur le portail.", calendrier: "De janvier à mars.", langue: "B2.", fraisDossier: "Gratuit.", verifieLe: "2026-09-25", sources: ["https://www.unipi.it/a", "javascript:alert(1)"] } },
{ id: "sans-admission", name: "Politecnico di Torino", city: "Turin", country: "Italie" }
];

test("chaque pays : ses étapes de candidature existent, et se règlent vœu par vœu", () => {
for (const id of DESTINATIONS_ACCOMPAGNEES) {
const d = destination(id);
assert.ok(Array.isArray(d.etapesCandidature) && d.etapesCandidature.length, `${id} : aucune étape de candidature`);
const procedure = procedureDe(id);
// Toutes voies confondues, puis voie par voie.
const routes = d.voies ? d.voies.options.map((o) => construireRoutePays({ id, procedure, dossier: { voie: o.id } })) : [construireRoutePays({ id, procedure })];
const vues = new Set();
for (const route of routes) {
for (const e of route.etapes.filter((x) => x.kind === "candidature")) {
vues.add(e.id);
assert.ok(d.etapesCandidature.includes(e.id), `${id} : ${e.id} n'est pas déclarée`);
assert.equal(e.outils[0].feature, "ai_check", `${id} : la vérification ne vient pas d'abord`);
assert.equal(e.outils[0].principal, true);
assert.equal(e.faite, false);
assert.ok(e.empechement, `${id} : sans vœu, rien ne dit quoi faire`);
}
}
for (const c of d.etapesCandidature) assert.ok(vues.has(c), `${id} : ${c} absente de toutes les routes`);
}
});

test("une candidature est faite quand CHAQUE vœu est déclaré déposé", () => {
const id = "canada";
const procedure = procedureDe(id);
const v1 = { id: "pre-ca-1", university: "X", status: "a_preparer" };
const v2 = { id: "pre-ca-2", university: "Y", status: "deposee", preuveDepot: { mode: "numero", numeroDossier: "1", deposeLe: "2026-09-25" } };
let e = construireRoutePays({ id, procedure, voeux: [v1, v2] }).etapes.find((x) => x.id === "ca_candidature");
assert.equal(e.faite, false);
assert.deepEqual(e.voeux.map((v) => v.depose), [false, true]);
e = construireRoutePays({ id, procedure, voeux: [{ ...v1, status: "admise" }, v2] }).etapes.find((x) => x.id === "ca_candidature");
assert.equal(e.faite, true);
// Un dépôt du pays reste un dépôt : jamais « ne me concerne pas ».
assert.equal(e.depot, true);
assert.equal(e.ignorable, false);
assert.ok(STATUTS_DEPOSES_VOEU.includes("liste_attente"));
});

test("Italie : candidater sur le site de l'université, avant Universitaly, lettres d'abord", () => {
const procedure = procedureDe("italie");
const route = construireRoutePays({ id: "italie", procedure });
const ids = route.etapes.map((e) => e.id);
const i = ids.indexOf("candidature_universite");
assert.ok(i > 0, "pas d'étape de candidature à l'université");
assert.equal(ids[i - 1], "motivations", "les lettres ne précèdent pas la candidature");
assert.equal(ids[i + 1], "it_comparabilite");
assert.ok(i < ids.indexOf("it_soumission"));
const e = route.etapes[i];
assert.equal(e.kind, "candidature");
assert.equal(e.depot, false, "Universitaly reste le dépôt du pays");
assert.equal(e.ignorable, true, "une université qui passe directement par Universitaly se déclare");
assert.deepEqual(defautsDesEnClair([{ id: e.id, enClair: e.enClair }]), []);
// Déclarée « ne me concerne pas » : réglée.
const reglee = construireRoutePays({ id: "italie", procedure, voeux: [{ id: "pre-it-1", university: "X", status: "a_preparer" }], dossier: { etapes: { candidature_universite: { nonConcerne: true } } } });
assert.equal(reglee.etapes.find((x) => x.id === "candidature_universite").faite, true);
});

test("le choix de l'établissement ne se fait qu'une fois", () => {
for (const id of DESTINATIONS_ACCOMPAGNEES) {
const d = destination(id);
if (!d.etapeVoeuxOfficielle) continue;
const procedure = procedureDe(id);
const route = construireRoutePays({ id, procedure });
assert.ok(!route.etapes.some((e) => e.id === d.etapeVoeuxOfficielle), `${id} : ${d.etapeVoeuxOfficielle} fait choisir une deuxième fois`);
const voeux = route.etapes.find((e) => e.id === "voeux");
const officielle = procedure.etapes.find((e) => e.id === d.etapeVoeuxOfficielle);
assert.equal(voeux.officielle.titre, officielle.titre, `${id} : le texte officiel du choix est perdu`);
assert.equal(voeux.ignorable, false);
assert.equal(voeux.preuve.requise, false);
assert.deepEqual(defautsDesEnClair([{ id: voeux.id, enClair: voeux.enClair }]), []);
}
});

test("la fiche d'un vœu : retrouvée par son nom, avec ce que l'université demande", () => {
const f = ficheDuVoeu({ university: "  universita di PISA " }, UNIS);
assert.equal(f.id, "universita-di-pisa-pise");
assert.equal(f.adresse, "universite.html?id=universita-di-pisa-pise");
assert.equal(f.admission.procedure, "Candidature sur le portail.");
assert.deepEqual(f.admission.sources, ["https://www.unipi.it/a"], "une source qui n'est pas une adresse web ne s'affiche pas");
assert.equal(ficheDuVoeu({ university: "Politecnico di Torino" }, UNIS).admission, null);
assert.equal(ficheDuVoeu({ university: "Inconnue" }, UNIS), null);
assert.equal(ficheDuVoeu({ university: "Università di Pisa" }, []), null);
// Et la route la porte, vœu par vœu.
const route = construireRoutePays({ id: "italie", procedure: procedureDe("italie"), voeux: [{ id: "pre-it-1", university: "Università di Pisa", status: "a_preparer" }], universites: UNIS });
assert.equal(route.etapes.find((e) => e.id === "candidature_universite").voeux[0].fiche.nom, "Università di Pisa");
});

test("l'espace : cartes par université, preuve par fichier, onglet neutre", () => {
const js = lire("espace-preinscription.js");
assert.ok(js.includes('case "candidature": return htmlCandidature(e);'));
assert.ok(js.includes("universites: etat.fichesPays"), "l'espace ne passe pas le catalogue à la route");
assert.ok(js.includes("cheminCapture(etat.session.user.uid, applicationId, ext)"), "la capture ne va pas au chemin des règles");
assert.ok(js.includes('accept="image/*,application/pdf"'));
assert.ok(js.includes("ai-check.html?applicationId="), "la vérification ne porte pas le vœu");
const html = lire("espace-preinscription.html");
assert.ok(!/<title>[^<]*France/.test(html), "l'onglet dit la France pendant le chargement d'un autre pays");
assert.match(lire("css/route.css"), /\.rt-cand\{/);
});
