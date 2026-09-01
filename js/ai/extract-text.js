/**
* ============================================================
* FitzUniverse — extraction de texte côté client (js/ai/extract-text.js)
* ============================================================
* Étape volontairement indépendante de tout appel IA (traduction,
* vérification...) : que le traitement en aval soit simulé
* (js/ai/simulated-responses.js, aujourd'hui) ou un vrai appel API
* (demain), cette extraction reste identique — seul le module IA
* changera le jour où un vrai backend sera branché.
*
* PDF uniquement pour l'instant (pdf.js, chargé par les pages qui
* importent ce module — voir compress.html/ai-translate.html/
* ai-check.html). Word (.doc/.docx) demanderait un parseur dédié
* (ex. mammoth.js, absent du projet) et les images scannées de l'OCR
* (ex. tesseract.js, absent aussi) — aucun des deux n'existe encore
* côté client ici. Plutôt que d'inventer un texte de substitution
* (comportement précédent, trompeur), on lève une erreur claire que
* l'appelant transforme en message honnête.
* ============================================================
*/

export async function extractTextFromFile(file) {

const extension = file.name.split(".").pop().toLowerCase();

if (extension === "pdf") return extractTextFromPdf(file);

throw new Error("UNSUPPORTED_FORMAT");

}

export async function extractTextFromPdf(file) {

if (!window["pdfjsLib"]) throw new Error("UNSUPPORTED_FORMAT");

const arrayBuffer = await file.arrayBuffer();
const pdf = await window["pdfjsLib"].getDocument({ data: arrayBuffer }).promise;

let text = "";

for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {

const page = await pdf.getPage(pageNumber);
const content = await page.getTextContent();

text += content.items.map((item) => item.str).join(" ") + "\n\n";

}

return text.trim();

}
