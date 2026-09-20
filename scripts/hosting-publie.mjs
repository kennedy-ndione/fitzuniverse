// ============================================================
// scripts/hosting-publie.mjs — ce que Firebase Hosting publierait
// ============================================================
//
//   node scripts/hosting-publie.mjs          la liste, et ce qui cloche
//   node scripts/hosting-publie.mjs --tout   la liste complète
//
// (En-tête en commentaires de LIGNE, et non en bloc : ce fichier cite
// des motifs glob, et « deux étoiles suivies d'une barre » referme un
// commentaire de bloc au milieu d'une phrase.)
//
// POURQUOI CE FICHIER EXISTE (lot S5, 2026-09-08)
//
// firebase.json porte "public": "." — Hosting publie donc TOUT ce qui
// est sur le disque et n'est pas explicitement exclu. C'est une LISTE
// NOIRE, et une liste noire ne protège que de ce à quoi on a pensé.
// Elle a échoué deux fois en une journée, sur deux choses auxquelles
// personne n'avait pensé :
//
//   sauvegardes/      gitignoré, donc invisible en revue de code, mais
//                     présent sur le disque au moment du déploiement.
//                     15 profils étudiants, admins.json, payments.json,
//                     servis en clair.
//
//   .claude/ et .git  aucun des deux n'était couvert. Le motif `**/.*`
//                     ne désigne QUE le fichier ou le dossier pointé
//                     lui-même — jamais son CONTENU. /.git/config
//                     répondait 200 : le dépôt entier, avec toute son
//                     histoire, était clonable depuis le site. Et
//                     /.claude/worktrees/<x>/assets/data/catalogue.json
//                     servait encore les 155 portails que le lot S3
//                     venait tout juste de retirer du catalogue public.
//
// Ce module renverse la charge : il calcule la liste RÉELLE des fichiers
// publiés, et test/hosting-publie.test.mjs échoue si elle contient autre
// chose qu'une LISTE BLANCHE. On ne se demande plus « ai-je pensé à
// exclure X ? » mais « X a-t-il le droit d'être là ? ». La première
// question dépend de l'imagination de celui qui relit ; la seconde, non.
//
// LA VRAIE CORRECTION, celle qu'on ne fait pas aujourd'hui, serait de
// déplacer le site dans un répertoire public/ et de pointer Hosting
// dessus : plus rien d'autre ne pourrait partir, par construction. Elle
// déplace 3 000 fichiers et touche les chemins relatifs, le Live Server,
// les scripts d'export et les tests. À trois semaines de l'ouverture des
// campagnes, le risque dépasse le gain — c'est un lot d'après le
// 1er octobre. Ce fichier tient la porte en attendant.
//
// CE QU'IL FAUT SAVOIR SUR LES MOTIFS DE HOSTING
// Firebase liste les fichiers avec glob et son option `ignore`. Deux
// règles comptent, et c'est la seconde qui a manqué :
//   1. un motif filtre les CHEMINS qu'il matche ;
//   2. seul un motif qui se TERMINE par « /** » élague un dossier,
//      c'est-à-dire empêche d'y descendre.
// D'où `**/.*/**` AJOUTÉ à côté de `**/.*` : le premier exclut le
// contenu des dossiers pointés, le second les fichiers pointés.
// ============================================================

import { readdirSync, statSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");

// Un segment de motif en fragment d'expression régulière. L'étoile ne
// traverse jamais une barre ; le point d'interrogation vaut un
// caractère ; tout le reste est littéral, échappé.
function segmentVersRegex(segment) {
let sortie = "";
for (const c of segment) {
if (c === "*") sortie += "[^/]*";
else if (c === "?") sortie += "[^/]";
else sortie += c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
return sortie;
}

// Un motif glob en expression régulière ancrée. La double étoile vaut
// « zéro segment ou plus ».
//
// Ce convertisseur ne couvre PAS tout minimatch : ni les accolades, ni
// les classes de caractères, ni la négation. C'est délibéré — et
// motifSupporte() refuse ces formes à voix haute plutôt que de les
// interpréter de travers. Un garde-fou qui se trompe en silence sur la
// syntaxe d'un motif est pire que pas de garde-fou : il rassure.
export function motifVersRegex(motif) {
const segments = motif.split("/");
let re = "^";
for (let i = 0; i < segments.length; i++) {
const segment = segments[i];
const dernier = i === segments.length - 1;
if (segment === "**") {
re += dernier ? "(?:[^/]+(?:/[^/]+)*)?" : "(?:[^/]+/)*";
} else {
re += segmentVersRegex(segment);
if (!dernier) re += "/";
}
}
return new RegExp(`${re}$`);
}

// Les formes de motif que ce module sait interpréter fidèlement.
export function motifSupporte(motif) {
return typeof motif === "string" && !/[{}[\]!]/.test(motif);
}

// Les motifs de hosting.ignore, plus celui que firebase-tools ajoute
// toujours de lui-même — pour que le calcul local dise la même chose
// que le déploiement réel.
export function lireMotifs(base = racine) {
const config = JSON.parse(readFileSync(join(base, "firebase.json"), "utf8"));
const declares = (config.hosting && config.hosting.ignore) || [];
return [...declares, ".firebase/**"];
}

// La liste des fichiers que Hosting publierait : chemins relatifs à la
// racine, barres obliques, triés.
//
// Les dossiers sont ÉLAGUÉS comme glob les élague : seul un motif
// terminé par la double étoile empêche d'y descendre. Ce n'est pas
// qu'une optimisation (node_modules et .claude pèsent 3 Go à eux deux) —
// c'est la règle qu'on cherche à reproduire fidèlement, et c'est
// exactement celle qui manquait le 2026-09-08.
export function listerPublies(base = racine, motifs = lireMotifs(base)) {

const inconnus = motifs.filter((m) => !motifSupporte(m));
if (inconnus.length) {
throw new Error(`Motif hosting.ignore non interprétable par ce contrôle : ${inconnus.join(", ")} — compléter scripts/hosting-publie.mjs plutôt que de le contourner.`);
}

const fichiersIgnores = motifs.map(motifVersRegex);
const dossiersElagues = motifs
.filter((m) => m.endsWith("/**"))
.map((m) => motifVersRegex(m.slice(0, -3)));

const publies = [];

const visiter = (relatif) => {
const absolu = relatif ? join(base, relatif) : base;
for (const nom of readdirSync(absolu)) {
const chemin = relatif ? `${relatif}/${nom}` : nom;
let infos;
try {
infos = statSync(join(base, chemin));
} catch {
continue; // lien cassé, ou fichier disparu en cours de parcours
}
if (infos.isDirectory()) {
if (dossiersElagues.some((re) => re.test(chemin))) continue;
visiter(chemin);
} else if (!fichiersIgnores.some((re) => re.test(chemin))) {
publies.push(chemin);
}
}
};

visiter("");

return publies.sort();

}

// ==========================================================
// LA LISTE BLANCHE — ce qui a le DROIT d'être publié
// ==========================================================

// Les dossiers de premier niveau qui composent le site. Tout autre
// dossier publié est une anomalie, quelle qu'en soit la raison.
export const DOSSIERS_AUTORISES = ["admin", "assets", "css", "js"];

// Les extensions autorisées, par dossier de premier niveau ; la chaîne
// vide est la racine. Un fichier dont l'extension n'est pas listée là où
// il se trouve fait échouer le contrôle — c'est ainsi qu'un .json de
// sauvegarde, un .rules ou un .mjs de script ne peuvent pas passer
// inaperçus, même si personne n'a pensé à les exclure.
export const EXTENSIONS_AUTORISEES = {
"": [".html", ".js", ".css", ".txt", ".xml"],
admin: [".html", ".js", ".css"],
assets: [".json", ".svg", ".png", ".jpg", ".jpeg", ".webp", ".avif", ".gif", ".ico", ".woff", ".woff2", ".ttf", ".pdf"],
css: [".css"],
js: [".js"]
};

// Les rares fichiers nommément autorisés en dehors de la règle des
// extensions. IL N'Y EN A PLUS AUCUN depuis le lot FINITION
// (2026-09-20) : CREDITS.md était le seul .md publié — le pied de page
// y envoyait le visiteur, qui recevait 75 Ko de markdown brut. Il est
// remplacé par credits.html, une page du site, générée depuis le même
// markdown par scripts/credits-html.mjs. Le document de travail reste
// au dépôt ; il ne part plus en ligne.
//
// La liste reste là, vide : le jour où l'on voudra publier un fichier
// hors extensions, il faudra l'écrire ICI, nommément, et ce sera visible
// en revue.
export const FICHIERS_AUTORISES = [];

function extension(chemin) {
const nom = chemin.slice(chemin.lastIndexOf("/") + 1);
const point = nom.lastIndexOf(".");
return point <= 0 ? "" : nom.slice(point).toLowerCase();
}

// Les chemins publiés qui n'ont RIEN à faire en ligne, avec la raison.
// Vide = le déploiement ne contient que le site.
export function intrus(publies) {

const anomalies = [];

for (const chemin of publies) {

if (FICHIERS_AUTORISES.includes(chemin)) continue;

const barre = chemin.indexOf("/");
const dossier = barre === -1 ? "" : chemin.slice(0, barre);

if (dossier && !DOSSIERS_AUTORISES.includes(dossier)) {
anomalies.push(`${chemin} — le dossier « ${dossier} » n'est pas un dossier du site`);
continue;
}

const ext = extension(chemin);
const permises = EXTENSIONS_AUTORISEES[dossier] || [];

if (!permises.includes(ext)) {
anomalies.push(`${chemin} — extension « ${ext || "(aucune)"} » non autorisée ${dossier ? `dans ${dossier}/` : "à la racine"}`);
}

}

return anomalies;

}

// ==========================================================
// Exécution directe
// ==========================================================

if (process.argv[1] && process.argv[1].endsWith("hosting-publie.mjs")) {

const publies = listerPublies();
const anomalies = intrus(publies);

console.log(`\n=== CE QUE HOSTING PUBLIERAIT : ${publies.length} fichier(s) ===\n`);

const parDossier = {};
for (const c of publies) {
const d = c.includes("/") ? c.slice(0, c.indexOf("/")) : "(racine)";
parDossier[d] = (parDossier[d] || 0) + 1;
}
for (const [d, n] of Object.entries(parDossier).sort((a, b) => b[1] - a[1])) {
console.log(`  ${String(n).padStart(5)}  ${d}`);
}

if (process.argv.includes("--tout")) {
console.log("");
for (const c of publies) console.log(`  ${c}`);
}

if (anomalies.length) {
console.log(`\n  \x1b[31m${anomalies.length} intrus :\x1b[0m`);
for (const a of anomalies) console.log(`    ${a}`);
process.exitCode = 1;
} else {
console.log("\n  \x1b[32mAucun intrus : le déploiement ne contient que le site.\x1b[0m");
}

console.log("");

}
