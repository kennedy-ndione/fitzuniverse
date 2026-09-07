/**
* ============================================================
* FitzUniverse — compression d'image côté client (extraite de compress.js)
* ============================================================
*
* Vivait en dur dans compress.js (l'outil « Compression de fichiers »).
* Extraite le 2026-09-07 (lot E1) parce qu'un second endroit en a
* besoin : la capture de confirmation d'une preuve de dépôt
* (applications.js) passe par la même compression avant l'envoi vers
* Storage. Une seule implémentation, deux appelants. Aucun envoi
* réseau ici : entrée un File, sortie un Blob JPEG.
* ============================================================
*/

export function loadImageElement(file) {

return new Promise((resolve, reject) => {

const img = new Image();
img.onload = () => resolve(img);
img.onerror = reject;
img.src = URL.createObjectURL(file);

});

}

export function canvasToBlob(img, scale, quality) {

return new Promise((resolve) => {

const canvas = document.createElement("canvas");
canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));

const ctx = canvas.getContext("2d");
ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

canvas.toBlob((blob) => resolve(blob), "image/jpeg", quality);

});

}

/**
* Réduit la qualité JPEG, puis les dimensions si la qualité seule ne
* suffit pas, jusqu'à passer sous `targetBytes`.
* @param {File|Blob} file
* @param {number} targetBytes
* @param {(message:string)=>void} [onProgress]
* @returns {Promise<Blob>} un JPEG
*/
export async function compressImageToTarget(file, targetBytes, onProgress = () => {}) {

const img = await loadImageElement(file);

let quality = 0.9;
let scale = 1;
let blob = await canvasToBlob(img, scale, quality);

let attempts = 0;
const maxAttempts = 18;

while (blob.size > targetBytes && attempts < maxAttempts) {

if (quality > 0.2) {
quality -= 0.08;
} else {
scale *= 0.85;
}

blob = await canvasToBlob(img, scale, quality);
attempts++;

onProgress(`Ajustement de la qualité... (${attempts}/${maxAttempts})`);

}

URL.revokeObjectURL(img.src);

return blob;

}
