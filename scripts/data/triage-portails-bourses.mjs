/**
* ============================================================
* scripts/data/triage-portails-bourses.mjs — lire les 156 liens
* ============================================================
*
* `node scripts/data/triage-portails-bourses.mjs`
*
* NE REMPLIT RIEN, N'ÉCRIT RIEN EN BASE. Il lit l'instantané public et
* liste, bourse par bourse, l'URL portée par `officialWebsite` avec un
* VERDICT PROPOSÉ — portail de dépôt, ou page d'information. La sortie
* est faite pour être relue par un humain avant qu'une seule valeur
* n'entre dans `applicationPortalUrl`.
*
* POURQUOI CE TRIAGE (lot S3, 2026-09-08). `officialWebsite` est
* renseigné sur 156 bourses sur 156, et fait le travail de DEUX champs :
*
*   jica.go.jp/…/internship.html          une page qui DÉCRIT la bourse
*   aims.edu.gh/application/masters-…     un formulaire où l'on DÉPOSE
*
* Rien ne distingue les deux, ni dans la donnée ni à l'œil sur une
* fiche. Le lot S3 pose un champ neuf, `applicationPortalUrl`, avec le
* sens « le lieu du dépôt » — le même que sur une université — et le
* range du côté payant ; `officialWebsite` reprend son sens littéral,
* la page du bailleur, qui reste publique parce que c'est une source.
*
* CE QUE LE VERDICT VAUT. Rien de plus qu'un tri de premier passage :
* il regarde le chemin de l'URL (apply, application, candidature,
* postuler, inscription, formulaire, portal…) et le domaine. Une URL
* peut mener à une page « Comment candidater » qui n'est pas un
* formulaire, et un formulaire peut vivre sur une URL parfaitement
* muette. D'où la colonne « à ouvrir » : ce script réduit le travail,
* il ne le fait pas. Aucun de ces verdicts ne doit être écrit en base
* sans que quelqu'un ait ouvert le lien.
*
* Le remplissage lui-même est un LOT DE DONNÉES, avec le trois-temps
* habituel (scripts/lot.mjs analyser / ecrire / verifier).
* ============================================================
*/

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const CATALOGUE = join(racine, "assets", "data", "catalogue.json");
// LA COLONNE « DÉJÀ REMPLI » LISAIT AU MAUVAIS ENDROIT (corrigé le 2026-09-14).
//
// Elle valait `b.applicationPortalUrl ? "oui" : ""`, lu dans
// l'instantané PUBLIC — d'où `separerPortails` retire précisément ce
// champ. La colonne était donc condamnée à rester vide pour toujours,
// quel que soit le remplissage : le script aurait dit « 0 fait, 156 à
// faire » le jour où les 156 seraient faites, et le deuxième passage
// qu'il annonce servir n'aurait servi à rien.
//
// Le champ vit dans la carte privée, embarquée avec les Cloud
// Functions. On la lit là. Si le fichier n'existe pas encore (dépôt
// frais, avant le premier `export`), on continue sans : c'est une
// colonne d'information, elle ne doit pas empêcher le triage.
const PORTAILS = join(racine, "functions", "data", "catalogue-portails.json");
const SORTIE = join(racine, "scripts", "data", "triage-portails-bourses.csv");

// Les marqueurs d'un DÉPÔT dans un chemin d'URL. Volontairement courts
// et sans accent : on les cherche dans une URL, pas dans une phrase.
const MARQUEURS_DEPOT = [
"apply", "application", "applications", "applynow", "candidat", "candidature",
"postuler", "inscription", "inscriptions", "register", "registration",
"formulaire", "form", "portal", "portail", "admission", "admissions", "submit"
];

// Les marqueurs d'une page d'INFORMATION. Quand les deux familles
// répondent, l'information l'emporte : se tromper en classant un vrai
// portail « page d'information » coûte un lien manquant ; se tromper
// dans l'autre sens envoie un étudiant qui paie sur une page qui ne
// reçoit rien.
const MARQUEURS_INFO = [
"about", "apropos", "presentation", "news", "actualite", "faq", "guide",
"brochure", "pdf", "programme", "program", "scholarship", "bourse",
"internship", "overview", "index"
];

function verdict(url) {

if (!url) return { code: "sans_url", raison: "aucun officialWebsite" };

let chemin = "";
let domaine = "";
try {
const u = new URL(url);
chemin = (u.pathname + u.search).toLowerCase();
domaine = u.hostname.toLowerCase();
} catch {
return { code: "url_illisible", raison: "URL non analysable" };
}

// Une racine de site (« / ») n'est jamais un portail de dépôt : c'est
// la page d'accueil du bailleur.
if (chemin === "/" || chemin === "") return { code: "information", raison: `racine de ${domaine}` };

const segments = chemin.split(/[^a-z0-9]+/).filter(Boolean);
const depot = MARQUEURS_DEPOT.filter((m) => segments.includes(m));
const info = MARQUEURS_INFO.filter((m) => segments.includes(m));

if (depot.length && !info.length) return { code: "portail_probable", raison: `chemin : ${depot.join(", ")}` };
if (depot.length && info.length) return { code: "a_ouvrir", raison: `chemin ambigu : ${depot.join(", ")} vs ${info.join(", ")}` };
if (info.length) return { code: "information", raison: `chemin : ${info.join(", ")}` };

return { code: "a_ouvrir", raison: "aucun marqueur reconnu" };

}

const catalogue = JSON.parse(await readFile(CATALOGUE, "utf8"));
const bourses = Array.isArray(catalogue.scholarships) ? catalogue.scholarships : [];

let portailsRemplis = {};
try {
const carte = JSON.parse(await readFile(PORTAILS, "utf8"));
portailsRemplis = (carte && carte.bourses) || {};
} catch {
console.log("  (functions/data/catalogue-portails.json illisible : la colonne « dejaRempli » restera vide)");
}

const lignes = bourses
.map((b) => {
const url = String(b.officialWebsite || "").trim();
const v = verdict(url);
return {
id: b.id,
titre: String(b.title || "").replace(/[;\n]/g, " "),
pays: b.country || "",
entryPoint: b.entryPoint || "",
url,
verdict: v.code,
raison: v.raison,
// Déjà rempli ? Lu dans la carte PRIVÉE : le champ ne peut pas
// figurer dans l'instantané public, qui en est amputé par
// construction. C'est ce qui rend le deuxième passage utile.
dejaRempli: portailsRemplis[b.id] ? "oui" : "",
portail: portailsRemplis[b.id] || ""
};
})
.sort((a, b) => (a.verdict + a.pays + a.titre).localeCompare(b.verdict + b.pays + b.titre, "fr"));

// CSV en point-virgule : c'est ce qu'un tableur francophone ouvre sans
// poser de question.
const entete = "id;titre;pays;entryPoint;url;verdict;raison;dejaRempli;portail";
const csv = [entete, ...lignes.map((l) => [l.id, l.titre, l.pays, l.entryPoint, l.url, l.verdict, l.raison, l.dejaRempli, l.portail].join(";"))].join("\n");

await writeFile(SORTIE, `${csv}\n`, "utf8");

const parVerdict = {};
for (const l of lignes) parVerdict[l.verdict] = (parVerdict[l.verdict] || 0) + 1;

console.log(`\n=== TRIAGE DES PORTAILS DE BOURSE (${lignes.length} bourses) ===\n`);
for (const [code, n] of Object.entries(parVerdict).sort((a, b) => b[1] - a[1])) {
console.log(`  ${String(n).padStart(4)}  ${code}`);
}

const depotChezLeBailleur = lignes.filter((l) => l.entryPoint === "bourse");
console.log(`\n  ${depotChezLeBailleur.length} bourse(s) déclarent un dépôt CHEZ LE BAILLEUR (entryPoint="bourse") :`);
console.log(`  ce sont celles dont l'absence de portail est un trou de catalogue (boursesSansPortail).`);

// LE SEUL CHIFFRE QUI COMPTE POUR LA SUITE : combien de ces bourses
// n'ont toujours pas de lieu de dépôt renseigné, et par quel verdict
// les attaquer. Les « information » d'abord — ce sont celles où
// l'étudiant clique et n'arrive nulle part.
const restantes = depotChezLeBailleur.filter((l) => !l.dejaRempli);
const faites = depotChezLeBailleur.length - restantes.length;

console.log(`\n  FAIT : ${faites} / ${depotChezLeBailleur.length}. RESTE : ${restantes.length}.`);

if (restantes.length) {
const parVerdictRestant = {};
for (const l of restantes) parVerdictRestant[l.verdict] = (parVerdictRestant[l.verdict] || 0) + 1;
for (const [code, n] of Object.entries(parVerdictRestant).sort((a, b) => b[1] - a[1])) {
console.log(`    ${String(n).padStart(4)}  ${code}`);
}
// PAS DE CHIFFRE EN DUR ICI. Une première version disait « neuf de ces
// bourses » : c'était vrai entre le lot 59 et le lot 60, et faux
// ensuite. Le rappel porte la RÈGLE, le compte est juste au-dessus.
console.log(`\n  RAPPEL : un champ VIDE peut être la bonne réponse. Une partie de ces`);
console.log(`  bourses n'a aucun lieu de dépôt en ligne chez le bailleur — dépôt à`);
console.log(`  l'ambassade, au ministère du pays d'origine, à l'établissement`);
console.log(`  d'accueil, par courriel ou par la poste. Pour celles-là, c'est le champ`);
console.log(`  « exigences » qui doit parler (js/exigences.js : candidature_via_*,`);
console.log(`  nomination_*, depot_par_courriel, depot_par_courrier), jamais une URL`);
console.log(`  inventée. Les 71 ont été passées une par une aux lots 59 et 60 :`);
console.log(`  scripts/data/lot59-portails-bourses.mjs et lot60-portails-bourses.mjs`);
console.log(`  disent, bourse par bourse, pourquoi chaque champ vide l'est.`);
}
console.log(`\n  Écrit : scripts/data/triage-portails-bourses.csv`);
console.log(`  AUCUNE valeur n'a été écrite en base. Ouvrir les liens avant de remplir quoi que ce soit.\n`);
