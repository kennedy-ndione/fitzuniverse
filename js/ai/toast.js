/**
* ============================================================
* FitzUniverse — notifications discrètes (toasts)
* ============================================================
*
* Remplace les alert()/confirm() des anciennes pages IA par une
* notification non bloquante, cohérente avec le reste du design system
* (voir .ai-toast-viewport dans css/ai-suite.css). Un seul conteneur
* est créé et réutilisé sur la page, quel que soit le nombre d'appels.
* ============================================================
*/

let viewport = null;

function ensureViewport() {

if (viewport && document.body.contains(viewport)) return viewport;

viewport = document.createElement("div");
viewport.className = "ai-toast-viewport";
viewport.setAttribute("aria-live", "polite");

document.body.appendChild(viewport);

return viewport;

}

export function showToast(message, { type = "success", duration = 3200 } = {}) {

const container = ensureViewport();

const toast = document.createElement("div");
toast.className = `ai-toast ai-toast-${type}`;
toast.textContent = message;

container.appendChild(toast);

requestAnimationFrame(() => toast.classList.add("is-visible"));

setTimeout(() => {

toast.classList.remove("is-visible");
toast.addEventListener("transitionend", () => toast.remove(), { once: true });

}, duration);

}

export async function copyToClipboard(text, { successMessage = "Copié dans le presse-papiers." } = {}) {

try {

if (navigator.clipboard && window.isSecureContext) {
await navigator.clipboard.writeText(text);
} else {

const textarea = document.createElement("textarea");
textarea.value = text;
textarea.style.position = "fixed";
textarea.style.opacity = "0";
document.body.appendChild(textarea);
textarea.select();
document.execCommand("copy");
textarea.remove();

}

showToast(successMessage, { type: "success" });
return true;

} catch (error) {

console.error("Copie impossible :", error);
showToast("La copie automatique n'a pas fonctionné cette fois — sélectionnez simplement le texte pour le copier vous-même.", { type: "error" });
return false;

}

}

export function downloadTextFile(filename, content) {

const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
const url = URL.createObjectURL(blob);

const link = document.createElement("a");
link.href = url;
link.download = filename;
document.body.appendChild(link);
link.click();
link.remove();

URL.revokeObjectURL(url);

}
