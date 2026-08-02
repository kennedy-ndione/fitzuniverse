/**
* ============================================================
* ScholarBridge — pièces jointes Fitz (architecture évolutive)
* ============================================================
*
* Aujourd'hui : aperçu local uniquement. Un fichier joint (capture
* d'écran, photo, PDF) est lu directement dans le navigateur (aucun
* upload serveur), affiché en pièce jointe dans la conversation, et
* transmis à js/ai/ai-client.js pour que la structure soit déjà prête
* quand un vrai traitement IA sera branché — mais aucune analyse
* réelle n'a lieu ici : `analyze()` retourne toujours `analyzed:false`.
*
* Demain : brancher un vrai stockage (ex. Firebase Storage) et un vrai
* traitement (OCR, analyse d'image, extraction de texte PDF) ne devrait
* toucher QUE ce fichier — readAttachment() garde la même signature
* (renvoie un objet {name, type, size, previewUrl, kind}), et analyze()
* est le point d'entrée unique où brancher la vraie logique, tâche par
* tâche (voir les stubs en bas de fichier). Aucune page appelante
* (ai-chat.js) n'aurait à changer.
* ============================================================
*/

export const ACCEPTED_TYPES = "image/png,image/jpeg,image/webp,image/gif,application/pdf";
export const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15 Mo — limite raisonnable pour un aperçu local en mémoire
export const MAX_ATTACHMENTS_PER_MESSAGE = 4;

function kindOf(file) {
if (file.type.startsWith("image/")) return "image";
if (file.type === "application/pdf") return "pdf";
return "other";
}

function iconFor(kind) {
if (kind === "image") return "image";
if (kind === "pdf") return "file-text";
return "file";
}

/**
* Lit un fichier localement (aucun envoi réseau) et renvoie un objet
* pièce jointe prêt à afficher/persister. Pour une image, previewUrl
* est une miniature affichable directement ; pour un PDF/autre, il n'y
* a pas de previewUrl (juste une icône + le nom du fichier).
*
* @param {File} file
* @returns {Promise<{name:string,type:string,size:number,kind:"image"|"pdf"|"other",icon:string,previewUrl:string|null}>}
*/
export function readAttachment(file) {

return new Promise((resolve, reject) => {

if (file.size > MAX_FILE_SIZE) {
reject(new Error(`"${file.name}" dépasse la taille maximale (15 Mo).`));
return;
}

const kind = kindOf(file);
const base = { name: file.name, type: file.type, size: file.size, kind, icon: iconFor(kind) };

if (kind !== "image") {
resolve({ ...base, previewUrl: null });
return;
}

const reader = new FileReader();
reader.onload = () => resolve({ ...base, previewUrl: reader.result });
reader.onerror = () => reject(new Error(`Impossible de lire "${file.name}".`));
reader.readAsDataURL(file);

});

}

export function validateFiles(files, currentCount) {

const accepted = [];
const rejected = [];

Array.from(files).forEach((file) => {

if (currentCount + accepted.length >= MAX_ATTACHMENTS_PER_MESSAGE) {
rejected.push({ file, reason: `Maximum ${MAX_ATTACHMENTS_PER_MESSAGE} pièces jointes par message.` });
return;
}

const isAccepted = ACCEPTED_TYPES.split(",").includes(file.type);

if (!isAccepted) {
rejected.push({ file, reason: "Format non pris en charge (image ou PDF uniquement)." });
return;
}

if (file.size > MAX_FILE_SIZE) {
rejected.push({ file, reason: "Fichier trop volumineux (15 Mo maximum)." });
return;
}

accepted.push(file);

});

return { accepted, rejected };

}

// ==========================================================
// Point d'extension futur — aucune analyse réelle aujourd'hui.
// ==========================================================

/**
* Point d'entrée unique pour un futur traitement réel des pièces
* jointes (OCR, analyse d'image, extraction PDF...). Retourne toujours
* `analyzed:false` aujourd'hui — la génération de réponse (ai-client.js)
* continue de fonctionner uniquement à partir du texte de la question,
* les pièces jointes ne sont encore que visuelles pour l'utilisateur.
*
* @param {Array<{name,type,kind}>} attachments
* @returns {Promise<{analyzed:boolean, results:Array}>}
*/
export async function analyzeAttachments(attachments) {

// TODO (branchement futur) : router chaque pièce jointe vers le bon
// traitement selon `kind` avant d'appeler un vrai fournisseur IA :
// - kind === "image" → runOcr(attachment) puis analyzeImage(attachment)
// - kind === "pdf" → extractPdfText(attachment)
// Le résultat de chaque étape alimenterait `input` dans
// js/ai/ai-client.js (ex. input.attachmentsText), sans changer la
// signature de generate({task, input, onToken, signal}).

return { analyzed: false, results: attachments.map((a) => ({ name: a.name, kind: a.kind, status: "not_analyzed" })) };

}

// eslint-disable-next-line no-unused-vars
async function runOcr(attachment) {
// TODO : reconnaissance de texte sur une image (ex. capture d'écran
// d'un formulaire) — non implémenté, aucun appel réseau aujourd'hui.
return null;
}

// eslint-disable-next-line no-unused-vars
async function extractPdfText(attachment) {
// TODO : extraction du texte d'un PDF joint — non implémenté.
return null;
}

// eslint-disable-next-line no-unused-vars
async function analyzeImage(attachment) {
// TODO : analyse visuelle (ex. reconnaissance d'un document, d'une
// capture d'erreur de portail universitaire) — non implémenté.
return null;
}
