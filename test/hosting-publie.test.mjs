// ============================================================
// test/hosting-publie.test.mjs — rien d'autre que le site (lot S5)
// ============================================================
//
// (Commentaires de LIGNE : ce fichier cite des motifs glob, et « deux
// étoiles suivies d'une barre » referme un commentaire de bloc.)
//
// LE TEST QUI AURAIT ATTRAPÉ LES DEUX FUITES DU 2026-09-08.
//
// firebase.json porte "public": "." : Hosting publie tout ce qui est sur
// le disque et n'est pas exclu. Une LISTE NOIRE, donc, et elle a laissé
// passer deux choses le même jour :
//
//   sauvegardes/     15 profils étudiants, admins.json, payments.json.
//                    Gitignoré, donc invisible en revue — mais bien
//                    présent sur le disque au moment du déploiement.
//   .git/ .claude/   le motif `**/.*` ne couvre que le fichier ou le
//                    dossier pointé, pas son contenu. /.git/config
//                    répondait 200 (le dépôt entier, clonable), et
//                    /.claude/worktrees/<x>/assets/data/catalogue.json
//                    servait les 155 portails que le lot S3 venait de
//                    retirer du catalogue public.
//
// Ce fichier ne vérifie donc PAS que telle ou telle exclusion est
// présente — c'était déjà l'approche qui a échoué. Il calcule la liste
// réelle des fichiers publiés et exige que TOUT y soit attendu. Il
// tourne dans `npm test`, donc avant chaque déploiement.
// ============================================================

import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import {
listerPublies, lireMotifs, intrus, motifVersRegex, motifSupporte,
DOSSIERS_AUTORISES, EXTENSIONS_AUTORISEES, FICHIERS_AUTORISES
} from "../scripts/hosting-publie.mjs";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(racine, f), "utf8").replace(/\r\n/g, "\n");

const MOTIFS = lireMotifs(racine);
const PUBLIES = listerPublies(racine, MOTIFS);

// ------------------------------------------------------------------
// 1. LE CONTRÔLE : rien d'autre que le site
// ------------------------------------------------------------------

test("le déploiement ne contient QUE des fichiers du site", () => {
const anomalies = intrus(PUBLIES);
// Le message porte les chemins fautifs : un test de sécurité qui dit
// seulement « échec » oblige à refaire l'enquête à chaque fois.
assert.deepEqual(anomalies, [], `\n  ${anomalies.join("\n  ")}\n`);
});

test("le contrôle regarde bien le vrai site, et pas une liste vide", () => {
// Un garde-fou qui ne verrait plus rien passerait toujours. On exige
// donc que les pièces maîtresses du site soient DANS la liste.
for (const attendu of ["index.html", "js/portails.js", "css/base.css", "assets/data/catalogue.json", "admin/dashboard.html", "robots.txt", "credits.html", "sitemap.xml"]) {
assert.ok(PUBLIES.includes(attendu), `${attendu} devrait être publié`);
}
assert.ok(PUBLIES.length > 1500, `${PUBLIES.length} fichiers publiés : trop peu, le parcours a dû s'arrêter`);
});

test("les deux fuites du 2026-09-08 ne peuvent plus se produire", () => {
// Non-régression sur les incidents réels, chemin par chemin.
const interdits = [
"sauvegardes/2026-09-07-2316/users.json",
"sauvegardes/2026-09-07-2316/payments.json",
".git/config",
".git/HEAD",
".claude/settings.local.json",
".claude/worktrees/busy-villani-21cd51/assets/data/catalogue.json",
"functions/paiement.js",
"functions/data/catalogue-portails.json",
"scripts/data/lot33-portails.mjs",
"firestore.rules",
"package.json",
"Claude outputs/france-maroc.js",
// LOT FINITION (2026-09-20) : les deux pages qui répondaient en ligne
// sans plus rien avoir à y faire. bientot.html annonçait que
// l'entreprise attendait ses documents — publiés depuis le 17
// septembre, et plus aucun lien du site n'y menait. CREDITS.md était
// servi en markdown brut au lien « Crédits photo » ; credits.html le
// remplace.
"bientot.html",
"CREDITS.md"
];
const ignore = (chemin) => MOTIFS.some((m) => motifVersRegex(m).test(chemin));
for (const chemin of interdits) {
assert.equal(ignore(chemin), true, `${chemin} n'est PAS exclu par hosting.ignore`);
assert.equal(PUBLIES.includes(chemin), false, `${chemin} est dans la liste publiée`);
}
});

test("le site, lui, n'est pas exclu par mégarde", () => {
const ignore = (chemin) => MOTIFS.some((m) => motifVersRegex(m).test(chemin));
for (const chemin of ["index.html", "js/portails.js", "css/base.css", "assets/data/catalogue.json", "admin/scholarships.js", "credits.html", "robots.txt", "sitemap.xml"]) {
assert.equal(ignore(chemin), false, `${chemin} est exclu alors qu'il fait partie du site`);
}
});

// ------------------------------------------------------------------
// 2. LA DÉMONSTRATION : le contrôle attrape ce qu'une liste noire rate
// ------------------------------------------------------------------

test("un dossier oublié dans hosting.ignore est détecté, et disparaît une fois exclu", () => {

// Arbre factice, hors du dépôt : le contrôle doit se prouver sur un
// cas neuf, pas sur l'état actuel du disque.
const base = mkdtempSync(join(tmpdir(), "fitz-hosting-"));

try {

mkdirSync(join(base, "js"), { recursive: true });
mkdirSync(join(base, "sauvegardes", "2026-09-07"), { recursive: true });
mkdirSync(join(base, ".git"), { recursive: true });
writeFileSync(join(base, "index.html"), "<p>site</p>");
writeFileSync(join(base, "js", "app.js"), "// site");
writeFileSync(join(base, "sauvegardes", "2026-09-07", "users.json"), '[{"email":"x@y.z"}]');
writeFileSync(join(base, ".git", "config"), "[core]");

// AVANT : la liste noire d'hier — elle ne connaît ni sauvegardes/ ni
// le contenu des dossiers pointés.
const hier = ["firebase.json", "**/.*", "**/node_modules/**"];
const publiesHier = listerPublies(base, hier);
const anomaliesHier = intrus(publiesHier);

assert.ok(publiesHier.includes("sauvegardes/2026-09-07/users.json"), "la liste noire d'hier publiait les sauvegardes");
assert.ok(publiesHier.includes(".git/config"), "et le dépôt git : `**/.*` ne couvre pas le CONTENU d'un dossier pointé");
assert.ok(anomaliesHier.some((a) => a.startsWith("sauvegardes/2026-09-07/users.json")), "le contrôle doit nommer le fichier fautif");
assert.ok(anomaliesHier.some((a) => a.startsWith(".git/config")));

// APRÈS : la liste corrigée. Les deux disparaissent, le site reste.
const aujourdhui = [...hier, "sauvegardes/**", "**/.*/**"];
const publiesAujourdhui = listerPublies(base, aujourdhui);

assert.deepEqual(publiesAujourdhui, ["index.html", "js/app.js"]);
assert.deepEqual(intrus(publiesAujourdhui), []);

} finally {
rmSync(base, { recursive: true, force: true });
}

});

test("le contrôle attrape aussi un fichier inattendu DANS un dossier autorisé", () => {
// Le cas le plus sournois : personne n'exclura jamais « js/dump.sql »,
// parce que personne n'imaginera qu'il puisse exister.
assert.deepEqual(intrus(["js/dump.sql"]), ["js/dump.sql — extension « .sql » non autorisée dans js/"]);
assert.deepEqual(intrus(["assets/notes.md"]), ["assets/notes.md — extension « .md » non autorisée dans assets/"]);
assert.deepEqual(intrus(["export.json"]), ["export.json — extension « .json » non autorisée à la racine"]);
assert.deepEqual(intrus(["outils/x.js"]), ["outils/x.js — le dossier « outils » n'est pas un dossier du site"]);
assert.deepEqual(intrus(["Dockerfile"]), ["Dockerfile — extension « (aucune) » non autorisée à la racine"]);
// Et il laisse passer ce qui est légitime.
assert.deepEqual(intrus(["index.html", "js/a.js", "css/b.css", "assets/img/c.webp", "admin/d.html", "credits.html", "robots.txt", "sitemap.xml"]), []);
// Et il refuse maintenant le markdown, qui n'a plus d'exception.
assert.deepEqual(intrus(["CREDITS.md"]), ["CREDITS.md — extension « .md » non autorisée à la racine"]);
});

// ------------------------------------------------------------------
// 3. LE TRADUCTEUR DE MOTIFS — il doit dire la vérité, ou se taire
// ------------------------------------------------------------------

test("motifVersRegex : la double étoile vaut zéro segment ou plus, l'étoile simple ne traverse pas une barre", () => {
const m = (motif, chemin) => motifVersRegex(motif).test(chemin);

// Le motif qui a manqué, et celui qui l'a réparé.
assert.equal(m("**/.*", ".git"), true, "le dossier pointé lui-même");
assert.equal(m("**/.*", ".git/config"), false, "mais PAS son contenu — toute la faille tient dans cette ligne");
assert.equal(m("**/.*/**", ".git/config"), true);
assert.equal(m("**/.*/**", ".claude/worktrees/x/assets/data/catalogue.json"), true);
assert.equal(m("**/.*/**", "index.html"), false);

assert.equal(m("scripts/**", "scripts/lot.mjs"), true);
assert.equal(m("scripts/**", "scripts/data/lot33.mjs"), true);
assert.equal(m("scripts/**", "scriptsbis/x.js"), false, "le préfixe doit s'arrêter à la barre");
assert.equal(m("**/node_modules/**", "node_modules/a/b.js"), true);
assert.equal(m("**/node_modules/**", "functions/node_modules/a.js"), true);
assert.equal(m("firebase.json", "firebase.json"), true);
assert.equal(m("firebase.json", "admin/firebase.json"), false, "un motif sans barre ne vise que la racine");
assert.equal(m("**/*.log", "a/b/c.log"), true);
assert.equal(m("**/*.log", "a/b/c.txt"), false);
assert.equal(m("Claude outputs/**", "Claude outputs/france-maroc.js"), true, "un espace dans le nom ne casse rien");
});

test("un motif d'une forme non gérée est REFUSÉ, jamais interprété de travers", () => {
// Un garde-fou qui se trompe en silence sur la syntaxe est pire que
// pas de garde-fou : il rassure.
assert.equal(motifSupporte("scripts/**"), true);
assert.equal(motifSupporte("**/*.{md,txt}"), false, "les accolades ne sont pas gérées");
assert.equal(motifSupporte("[abc]*.js"), false, "les classes de caractères non plus");
assert.equal(motifSupporte("!garde.js"), false, "ni la négation");
assert.throws(() => listerPublies(racine, ["**/*.{md,txt}"]), /non interprétable par ce contrôle/);
});

// ------------------------------------------------------------------
// 4. CEINTURE ET BRETELLES — la liste noire reste, durcie
// ------------------------------------------------------------------

test("hosting.ignore exclut explicitement tout ce qui n'est pas le site", () => {
const config = JSON.parse(lire("firebase.json"));
const ignore = config.hosting.ignore;
for (const motif of [
"**/.*", "**/.*/**", "**/node_modules/**",
"functions/**", "scripts/**", "test/**", "sauvegardes/**", "Claude outputs/**", "design-previews/**",
"firestore.rules", "storage.rules", "firestore.indexes.json",
"package.json", "package-lock.json", "**/*.log"
]) {
assert.ok(ignore.includes(motif), `hosting.ignore devrait contenir « ${motif} »`);
}
// Toute la documentation interne, .md par .md. CREDITS.md a rejoint
// la liste au lot FINITION (2026-09-20) : il était publié à dessein
// tant que le pied de page y envoyait le visiteur, et Hosting le
// servait en markdown brut. Firebase ne sait pas faire d'exception
// dans un motif (aucune négation), d'où l'énumération.
for (const doc of ["AI_INTEGRATION.md", "ASSETS.md", "COUT_LECTURE.md", "CREDITS.md", "DESIGN_SYSTEM.md", "PROMPT_JOURNEE.md", "REDACTION.md", "TESTING.md"]) {
assert.ok(ignore.includes(doc), `hosting.ignore devrait contenir « ${doc} »`);
}
assert.ok(ignore.includes("bientot.html"), "bientot.html ne doit plus partir en ligne");
// Lot LANGAGE (2026-09-10) : le pied de page est un composant partagé,
// le lien vit dans js/pied-de-page.js (posé sur toutes les pages publiques).
// Lot FINITION : il pointe désormais la PAGE, pas le markdown.
assert.ok(lire("js/pied-de-page.js").includes('href="credits.html"'), "le lien du pied de page mène à la page générée");
assert.equal(lire("js/pied-de-page.js").includes('href="CREDITS.md"'), false, "et plus au fichier brut");
});

test("la liste blanche reste étroite : quatre dossiers, et des extensions comptées", () => {
// Si quelqu'un élargit la liste blanche pour faire passer un test,
// ce test-ci le dit. C'est le seul moyen qu'une liste blanche ne
// redevienne pas une liste noire par usure.
assert.deepEqual(DOSSIERS_AUTORISES, ["admin", "assets", "css", "js"]);
// Vide depuis le lot FINITION : plus aucun fichier n'échappe à la
// règle des extensions. Le jour où l'on en voudra un, il faudra
// l'écrire nommément, et ce test le montrera en revue.
assert.deepEqual(FICHIERS_AUTORISES, []);
assert.deepEqual(EXTENSIONS_AUTORISEES[""], [".html", ".js", ".css", ".txt", ".xml"]);
assert.equal(EXTENSIONS_AUTORISEES[""].includes(".json"), false, "aucun .json à la racine : c'est par là que passent les exports et les sauvegardes");
assert.equal(EXTENSIONS_AUTORISEES.js.length, 1);
assert.equal(EXTENSIONS_AUTORISEES.css.length, 1);
});

// ------------------------------------------------------------------
// 5. AUCUN FICHIER DE CLÉS, NULLE PART
// ------------------------------------------------------------------

test("aucun fichier de clés parmi les fichiers publiés", () => {
// Les fichiers commençant par un point étaient couverts par `**/.*` ;
// ceux-là ne l'étaient pas — un serviceAccount.json déposé à la racine
// pour dépanner serait parti en ligne sans un mot.
const suspects = /(serviceaccount|credential|secret|\.pem$|\.p12$|\.pfx$|id_rsa|-key\.json$|_key\.json$)/i;
const trouves = PUBLIES.filter((f) => suspects.test(f));
assert.deepEqual(trouves, [], "fichier de clés dans le déploiement");
});

test("la clé Firebase publique de firebase-config.js est la SEULE chaîne qui ressemble à un secret", () => {
// Elle est publique par conception : elle identifie le projet auprès du
// SDK navigateur, et c'est firestore.rules qui protège les données, pas
// elle. Ce test existe pour que le jour où une VRAIE clé apparaît, la
// différence saute aux yeux au lieu de se noyer.
const motifs = [
[/-----BEGIN (RSA |EC |OPENSSH |PGP )?PRIVATE KEY-----/, "clé privée"],
[/live_(private|master|public)_[A-Za-z0-9]{10,}/, "clé PayDunya de production"],
[/test_(private|master)_[A-Za-z0-9]{10,}/, "clé PayDunya de test"],
[/sk-ant-[A-Za-z0-9_-]{20,}/, "clé Anthropic"],
[/"type"\s*:\s*"service_account"/, "compte de service Google"]
];
const trouvailles = [];
for (const f of PUBLIES) {
if (!/\.(js|html|css|json|txt|xml|md)$/i.test(f)) continue;
const contenu = lire(f);
for (const [re, nom] of motifs) if (re.test(contenu)) trouvailles.push(`${f} : ${nom}`);
}
assert.deepEqual(trouvailles, []);
});
