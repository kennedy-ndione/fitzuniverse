/**
* ============================================================
* ScholarBridge — mise en forme du texte généré par Fitz
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
