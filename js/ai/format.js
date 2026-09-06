/**
* ============================================================
* FitzUniverse — mise en forme du texte généré par Fitz
* ============================================================
*
* renderMarkdownLite() convertit un sous-ensemble volontairement
* restreint de Markdown (gras, listes, tableaux, blocs de code,
* paragraphes) en HTML sûr : le texte est toujours échappé AVANT
* d'appliquer les remplacements, donc aucun contenu généré (simulé ou,
* plus tard, renvoyé par une vraie API) ne peut injecter de HTML.
* ============================================================
*/

export function escapeHtml(value) {

return String(value ?? "")
.replace(/&/g, "&amp;")
.replace(/</g, "&lt;")
.replace(/>/g, "&gt;")
.replace(/"/g, "&quot;")
.replace(/'/g, "&#39;");

}

export function wordCount(text) {
const trimmed = String(text || "").trim();
return trimmed ? trimmed.split(/\s+/).length : 0;
}

function renderInline(escaped) {

return escaped
.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
.replace(/`([^`]+)`/g, "<code>$1</code>");

}

function renderTable(lines) {

const rows = lines
.map((line) => line.trim().replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim()))
.filter((cells) => !cells.every((cell) => /^-+$/.test(cell)));

const [headerCells, ...bodyRows] = rows;

const head = `<thead><tr>${headerCells.map((cell) => `<th>${renderInline(cell)}</th>`).join("")}</tr></thead>`;
const body = `<tbody>${bodyRows.map((cells) => `<tr>${cells.map((cell) => `<td>${renderInline(cell)}</td>`).join("")}</tr>`).join("")}</tbody>`;

return `<table class="ai-md-table">${head}${body}</table>`;

}

export function renderMarkdownLite(rawText) {

const text = escapeHtml(rawText);
const lines = text.split("\n");

const html = [];
let i = 0;

while (i < lines.length) {

const line = lines[i];

// Bloc de code ```...```
if (line.trim().startsWith("```")) {

const codeLines = [];
i += 1;

while (i < lines.length && !lines[i].trim().startsWith("```")) {
codeLines.push(lines[i]);
i += 1;
}

html.push(`<pre class="ai-md-code"><code>${codeLines.join("\n")}</code></pre>`);
i += 1;
continue;

}

// Tableau Markdown (ligne d'en-tête suivie d'une ligne de séparation |---|---|)
if (line.includes("|") && lines[i + 1] && /^\s*\|?[\s:|-]+\|?\s*$/.test(lines[i + 1]) && lines[i + 1].includes("-")) {

const tableLines = [line, lines[i + 1]];
i += 2;

while (i < lines.length && lines[i].includes("|")) {
tableLines.push(lines[i]);
i += 1;
}

html.push(renderTable(tableLines));
continue;

}

// Titre (#, ##, ###...)
//
// Ajouté le 2026-09-05 : le prompt `diagnostic` impose quatre titres
// « ### ... » et le rendu les affichait tels quels, dièses compris —
// le bloc « L'analyse de Fitz » de results.html montrait donc des
// dièses au visiteur.
//
// Le niveau est PLAFONNÉ à h3, jamais h1 ni h2 : une réponse de Fitz
// est toujours imbriquée dans une page qui a déjà son titre, et un
// modèle qui écrirait « # » ne doit pas pouvoir poser un h1 dans une
// bulle de chat. h3 est aussi ce qu'attend results.css
// (`.fitz-analysis-body h3`).
if (/^\s*#{1,6}\s+/.test(line)) {

const diese = line.trim().match(/^#+/)[0].length;
const niveau = diese <= 3 ? 3 : 4;

html.push(
`<h${niveau} class="ai-md-title">${renderInline(line.replace(/^\s*#{1,6}\s+/, ""))}</h${niveau}>`
);

i += 1;
continue;

}

// Liste à puces
if (/^\s*[-*]\s+/.test(line)) {

const items = [];

while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
items.push(`<li>${renderInline(lines[i].replace(/^\s*[-*]\s+/, ""))}</li>`);
i += 1;
}

html.push(`<ul class="ai-md-list">${items.join("")}</ul>`);
continue;

}

// Liste numérotée
if (/^\s*\d+\.\s+/.test(line)) {

const items = [];

while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
items.push(`<li>${renderInline(lines[i].replace(/^\s*\d+\.\s+/, ""))}</li>`);
i += 1;
}

html.push(`<ol class="ai-md-list">${items.join("")}</ol>`);
continue;

}

if (line.trim() === "") {
i += 1;
continue;
}

html.push(`<p>${renderInline(line)}</p>`);
i += 1;

}

return html.join("");

}

/**
* ============================================================
* Rend cliquables les outils que Fitz cite dans une réponse
* ============================================================
*
* Fitz répond souvent "vous pouvez la générer depuis **Lettre de
* motivation**" — jusqu'ici c'était du texte mort : l'étudiant lisait
* le nom d'un outil puis devait aller le chercher lui-même dans la
* barre latérale. On transforme donc ces mentions en vrais liens.
*
* Volontairement limité au contenu des balises <strong> produites par
* renderMarkdownLite() : les réponses de Fitz mettent déjà les noms
* d'outils en gras, et se restreindre au gras évite de transformer en
* lien le mot "documents" au milieu d'une phrase ordinaire.
*
* À n'appliquer QU'AU CHAT. Une lettre de motivation ou un e-mail
* générés sont destinés à être copiés dans un portail universitaire :
* y injecter des liens vers FitzUniverse n'aurait aucun sens.
* ============================================================
*/

const OUTILS_FITZ = [
{ motifs: ["lettre de motivation"], href: "ai-letter.html", nom: "Lettre de motivation" },
{ motifs: ["e-mails fitz", "e-mail fitz", "générateur d'e-mails"], href: "ai-email.html", nom: "E-mails Fitz" },
{ motifs: ["traduction de documents", "traduction"], href: "ai-translate.html", nom: "Traduction de documents" },
{ motifs: ["vérification du dossier", "vérification de dossier"], href: "ai-check.html", nom: "Vérification du dossier" },
{ motifs: ["compression de fichiers", "compresser un fichier"], href: "compress.html", nom: "Compression de fichiers" },
{ motifs: ["préparation aux entretiens", "entretiens"], href: "interview-prep.html", nom: "Préparation aux entretiens" },
{ motifs: ["mes candidatures", "suivi des candidatures"], href: "applications.html", nom: "Mes candidatures" },
{ motifs: ["checklists & documents", "mes documents"], href: "documents.html", nom: "Documents" },
{ motifs: ["mon profil"], href: "profile.html", nom: "Mon profil" },
{ motifs: ["universités du catalogue", "universités"], href: "universities.html", nom: "Universités" },
{ motifs: ["bourses"], href: "scholarships.html", nom: "Bourses" }
];

export function linkifyFitzTools(html) {

return String(html ?? "").replace(/<strong>(.+?)<\/strong>/g, (entier, contenu) => {

// Le contenu vient de renderMarkdownLite(), donc déjà échappé ;
// on ne compare que du texte, on n'en réinjecte aucun.
const nu = contenu.replace(/<[^>]+>/g, "").trim().toLowerCase();

const outil = OUTILS_FITZ.find((o) => o.motifs.some((m) => nu === m || nu === m + "."));
if (!outil) return entier;

return `<a class="ai-tool-link" href="${outil.href}" data-fitz-tool="${outil.href}">${contenu}</a>`;

});

}
