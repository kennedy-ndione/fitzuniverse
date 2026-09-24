/**
 * ============================================================
 * scripts/credits-html.mjs — CREDITS.md devient une page du site
 * ============================================================
 *
 * LOT FINITION (2026-09-20). Le pied de page de toutes les pages
 * pointait « Crédits photo » vers `CREDITS.md`, servi tel quel par
 * Hosting : le visiteur recevait 75 Ko de markdown brut, avec ses
 * dièses, ses astérisques — et le vocabulaire de production qu'on
 * venait justement de retirer des fiches (« lot 6 d'élargissement du
 * catalogue », `admin/expand-catalog-batch7.js`).
 *
 * CE SCRIPT NE TRADUIT PAS LE FICHIER, IL LE TRIE.
 *
 * CREDITS.md est un document de TRAVAIL : il garde la trace des
 * scripts qui ont généré les déclinaisons, des contrôles faits image
 * par image, de ce qu'il reste à chercher. Tout cela est précieux en
 * interne et n'a rien à faire sur une page publique. La page retient
 * donc, de chaque entrée, les seules lignes qui SONT l'attribution :
 *
 *   Photographe · Licence · Source · Site du photographe · Auteur
 *
 * Tout le reste est écarté — y compris les paragraphes de prose, sauf
 * l'introduction et les avertissements de provenance, qui disent au
 * lecteur ce qu'il doit savoir.
 *
 * Conséquence à connaître : ajouter une ligne d'attribution dans
 * CREDITS.md ne suffit plus, il faut relancer ce script. Un test
 * (test/credits.test.mjs) échoue si credits.html ne porte pas autant
 * d'entrées que le markdown.
 *
 *   node scripts/credits-html.mjs
 * ============================================================
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const RACINE = join(dirname(fileURLToPath(import.meta.url)), "..");

// Les seules étiquettes de puce qui sont une attribution. Toute autre
// puce (« Déclinaisons », « Contrôles faits… », « Optimisation ») est
// une note de production : elle reste dans le markdown, elle ne monte
// pas sur la page.
const ATTRIBUTIONS = ["Photographe", "Auteur", "Licence", "Source", "Site du photographe", "Contenu"];

const echapper = (t) => t
.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* LE VOCABULAIRE DE CHANTIER NE MONTE PAS SUR LA PAGE.
   Même règle que le lot VOIX du même jour, appliquée ici : « lot 25 »,
   `scripts/add-lot11-unique-photos.ps1`, `admin/expand-catalog-batch11.js`
   ne veulent rien dire pour un visiteur — ils lui apprennent seulement
   qu'il lit des notes de production. Le tri se fait PHRASE PAR PHRASE :
   une entrée dont une phrase cite un chemin interne garde ses autres
   phrases, elle n'est pas jetée en entier. Un titre de section qui en
   cite un est réécrit sans lui. */
const INTERNE = /(scripts\/|admin\/|\.ps1|\.mjs|expand-catalog|\blots?\s*\d+|commit)/i;

function sansChantier(texte) {
return String(texte)
// La fin de phrase peut être suivie d'un gras qui se referme
// (« **inconnue.** Recherchée… ») : sans cela, tout le paragraphe
// ne formait qu'une phrase et partait d'un bloc.
.split(/(?<=[.!?][)*\u00bb"']{0,2})\s+/)
.filter((phrase) => !INTERNE.test(phrase))
.join(" ")
.replace(/\s*—\s*$/, "")
.replace(/\s{2,}/g, " ")
.trim();
}

/** Le markdown en ligne, réduit à ce que ce fichier utilise vraiment :
 *  un lien, du gras, du code. Rien d'autre n'est interprété — un
 *  convertisseur qui devine fait plus de dégâts qu'il n'en répare. */
function enrichir(texte) {
let t = echapper(sansChantier(texte));
t = t.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
'<a href="$2" rel="nofollow noopener" target="_blank">$1</a>');
t = t.replace(/`([^`]+)`/g, "<code>$1</code>");
t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
// Une URL nue reste lisible, mais cliquable.
t = t.replace(/(^|[\s(])(https?:\/\/[^\s<)]+)/g,
'$1<a href="$2" rel="nofollow noopener" target="_blank">$2</a>');
return t;
}

/** Le nom de fichier d'un titre de section, sans le bruit :
 *  « Amsterdam (`amsterdam.jpg` et déclinaisons `-400w`…) » → « Amsterdam ».
 *  Le visiteur cherche une ville ou une université, pas un chemin. */
function titrePublic(brut) {
// « Photos des bourses (lot 14, 2026-08-28) — `assets/images/…` » →
// « Photos des bourses ». Le chemin et le numéro de lot disent au
// visiteur comment le site est fabriqué, pas d'où vient la photo.
const sansChemin = brut.replace(/\s*—\s*`[^`]*`\s*$/, "");
const sansParenthese = sansChemin.replace(/\s*\([^)]*\)\s*$/, "").trim();
// Un numéro de lot dans un titre (« Drapeaux — lot 31 ») faisait
// tomber TOUT le titre au tri des phrases : la page publiait un <h2>
// vide (constaté le 2026-09-24). On retire la mention, pas le titre.
const sansLot = (sansParenthese || sansChemin.trim() || brut.trim())
.replace(/\s*[,—–]?\s*\blots?\s*\d+(?:[-–]\d+)?\b\s*[,:]?/gi, " ")
.replace(/\s{2,}/g, " ")
.trim();
const titre = enrichir(sansLot);
if (!titre.replace(/<[^>]*>/g, "").trim()) throw new Error(`Titre de crédit vide après nettoyage : « ${brut} »`);
return titre;
}

export function convertir(markdown) {

const lignes = markdown.replace(/\r\n/g, "\n").split("\n");
const sections = [];
let courante = null;
let intro = [];

for (const ligne of lignes) {

const titre = /^(#{2,3})\s+(.*)$/.exec(ligne);

if (/^#\s+/.test(ligne)) continue;                 // le H1 est posé par la page

if (titre) {
courante = { niveau: titre[1].length, titre: titrePublic(titre[2]), puces: [], notes: [] };
sections.push(courante);
continue;
}

const puce = /^-\s+\*\*([^*]+)\*\*\s*:?\s*(.*)$/.exec(ligne);

if (puce && courante) {
const etiquette = puce[1].replace(/`/g, "").trim();
if (ATTRIBUTIONS.includes(etiquette)) {
const valeur = enrichir(puce[2].trim());
// Une étiquette sans valeur est pire qu'une étiquette absente :
// elle promet un crédit et n'en donne aucun.
if (valeur.replace(/<[^>]*>/g, "").trim()) courante.puces.push({ etiquette, valeur });
}
continue;
}

// Une prose d'avertissement se garde : elle dit au lecteur ce que
// l'attribution ne peut pas dire.
const texte = ligne.trim();
if (!texte) continue;
if (!courante) { intro.push(enrichir(texte)); continue; }
// Une prose ne monte que si elle AVERTIT sur la provenance — le reste
// est du journal de bord. Et si le tri des phrases n'en laisse rien,
// on ne pose pas un paragraphe vide.
if (/provenance|licence inconnue|NON ÉTABLIE/i.test(texte)) {
const retenue = enrichir(texte);
if (retenue.replace(/<[^>]*>/g, "").trim().length > 20) courante.notes.push(retenue);
}

}

return { intro, sections: sections.filter((s) => s.puces.length || s.notes.length) };

}

function page({ intro, sections }) {

const corps = sections.map((s) => {
const balise = s.niveau === 2 ? "h2" : "h3";
// Aucune classe neuve : `legal-fiche` et `legal-note` existent déjà
// dans css/legal.css et servent les mêmes objets sur les pages
// légales (une liste étiquette/valeur, un encadré d'avertissement).
// Une page de plus ne justifie pas une feuille de style de plus.
const puces = s.puces.length
? `<dl class="legal-fiche">${s.puces.map((p) =>
`<dt>${p.etiquette}</dt><dd>${p.valeur}</dd>`).join("")}</dl>`
: "";
const notes = s.notes.length
? `<div class="legal-note">${s.notes.map((n) => `<p>${n}</p>`).join("")}</div>`
: "";
return `<section class="legal-bloc">\n<${balise}>${s.titre}</${balise}>\n${notes}${puces}\n</section>`;
}).join("\n\n");

return `<!DOCTYPE html>
<html lang="fr">

<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, interactive-widget=resizes-content">

<title>Crédits photo | FitzUniverse</title>

<meta name="description" content="Photographes, licences et sources des photographies utilisées sur FitzUniverse, image par image.">
<meta name="theme-color" content="#211D18">
<meta name="color-scheme" content="light">

<link rel="icon" type="image/png" sizes="32x32" href="assets/logo/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="assets/logo/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="assets/logo/apple-touch-icon.png">

<link rel="canonical" href="https://fitzuniverse.com/credits.html">

<meta property="og:title" content="Crédits photo | FitzUniverse">
<meta property="og:description" content="Photographes, licences et sources des photographies utilisées sur FitzUniverse, image par image.">
<meta property="og:type" content="website">
<meta property="og:image" content="https://fitzuniverse.com/assets/images/og-image.jpg">
<meta property="og:url" content="https://fitzuniverse.com/credits.html">
<meta property="og:site_name" content="FitzUniverse">
<meta property="og:locale" content="fr_FR">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Crédits photo | FitzUniverse">
<meta name="twitter:description" content="Photographes, licences et sources des photographies utilisées sur FitzUniverse, image par image.">
<meta name="twitter:image" content="https://fitzuniverse.com/assets/images/og-image.jpg">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,500;0,600;0,700;0,800;1,500&family=Public+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">

<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/legal.css">

<!-- PAGE GÉNÉRÉE — ne pas modifier à la main.
Source : CREDITS.md · Générateur : scripts/credits-html.mjs
Elle remplace le markdown brut que Hosting servait jusqu'au
2026-09-20 au lien « Crédits photo » du pied de page. -->

</head>

<body class="legal-page">

<a href="#main-content" class="skip-link">Aller au contenu</a>

<header class="page-brandbar">
<a href="index.html" class="fitz-lockup" aria-label="FitzUniverse — accueil">
<svg class="fitz-mark" viewBox="0 0 100 100" fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
<circle class="mark-structure" cx="50" cy="50" r="34" stroke-width="11" stroke-linecap="round" stroke-dasharray="130 83.6" transform="rotate(-90 50 50)"/>
<circle class="mark-accent" cx="50" cy="50" r="34" stroke-width="11" stroke-linecap="round" stroke-dasharray="42 171.6" stroke-dashoffset="-150" transform="rotate(-90 50 50)"/>
</svg>
<span class="fitz-lockup-text">
<span class="fitz-lockup-name">Fitz</span>
<span class="fitz-lockup-sub">Universe</span>
</span>
</a>
</header>

<main class="legal" id="main-content" tabindex="-1">
<div class="container">

<p class="legal-kicker">Crédits</p>
<h1>Crédits photo</h1>

${intro.map((p) => `<p class="legal-chapeau">${p}</p>`).join("\n")}

${corps}

<p class="legal-retour"><a href="index.html" class="btn btn-primary">Retour à l'accueil</a></p>

</div>
</main>

</body>
</html>
`;
}

// Exécution directe uniquement : le test importe `convertir` sans
// réécrire le fichier.
if (process.argv[1] && process.argv[1].endsWith("credits-html.mjs")) {
const markdown = readFileSync(join(RACINE, "CREDITS.md"), "utf8");
const donnees = convertir(markdown);
writeFileSync(join(RACINE, "credits.html"), page(donnees), "utf8");
console.log(`credits.html — ${donnees.sections.length} entrées, ${donnees.sections.reduce((n, s) => n + s.puces.length, 0)} lignes d'attribution`);
}

export { page };
