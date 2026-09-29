/**
* ============================================================
* Fitz — résolution de la photo d'une bourse
* ============================================================
*
* Extrait de scholarships.js (enrichWithProgramData) le 2026-08-28
* pour être réutilisé par le bandeau "Ouvert en ce moment" de la
* page d'accueil (js/opportunites-bandeau.js), sans dupliquer la
* cascade de repli ni les tables qu'elle consulte.
*
* Cascade (mise à jour 2026-08-28, lot 14) : photo propre à la bourse
* (NOUVEAU — un monument distinct par bourse, voir
* assets/images/scholarships/ et CREDITS.md) -> université liée ->
* pays -> repli générique par hash. Le champ "image" d'une bourse est
* ajouté progressivement, lot par lot (voir admin/expand-catalog-
* batch14.js et suivants) : tant qu'une bourse ne l'a pas encore,
* elle retombe sur l'ancienne cascade université/pays/hash, inchangée.
* ============================================================
*/

// Repli si aucune université partenaire n'est encore enregistrée pour
// ce programme (donc aucune photo à réutiliser) : capitale du pays qui
// accorde la bourse, quand une photo existe déjà dans
// assets/images/cities (réutilisée telle quelle, aucun nouvel asset).
export const COUNTRY_FALLBACK_IMAGE = {
"Chine": "beijing.jpg",
"Japon": "tokyo.jpg",
"Corée du Sud": "seoul.jpg",
"Hongrie": "budapest.jpg",
"Italie": "rome.jpg",
"Turquie": "istanbul.jpg",
"Roumanie": "bucharest.jpg",
"Arabie Saoudite": "riyadh.jpg",
// Ajoutés le 2026-08-11 (lot 1 d'élargissement du catalogue) : France,
// Canada, États-Unis avaient jusqu'ici 0 bourse liée à une université,
// donc retombaient sur un fond de hero générique (hero-bg*.jpg) plutôt
// qu'une vraie photo de ville. Toronto (pas Ottawa) et New York (pas
// Washington) : déroge volontairement à la convention "capitale" —
// choisi pour la qualité/cohérence de style avec le reste du
// catalogue (voir la conversation associée) plutôt que pour
// l'exactitude protocolaire.
"France": "paris.jpg",
"Canada": "toronto.jpg",
"États-Unis": "newyork.jpg",
// Ajoutés le 2026-08-11 (lot 2). Allemagne suit la convention
// "capitale" à la lettre (Berlin) ; Suisse en déroge comme
// Toronto/New York avant elle — Zurich (pas Berne) est la seule
// photo suisse en stock à ce jour.
"Allemagne": "berlin.jpg",
"Suisse": "zurich.jpg",
// Ajoutés le 2026-08-13 (lot 3), en prévision de l'ajout prochain du
// Maroc et de la Belgique au catalogue (bourses + universités
// partenaires). Rabat et Bruxelles suivent la convention "capitale" ;
// casablanca.jpg et leuven.jpg ne sont pas branchés ici — réservés à
// des universités précises une fois ces pays importés.
"Maroc": "rabat.jpg",
"Belgique": "brussels.jpg",
// Ajoutés le 2026-08-30 (lot 24). Le Royaume-Uni et la Russie étaient les
// deux seuls pays du catalogue absents de cette table : leurs bourses non
// rattachées à une université — les trois programmes Commonwealth et
// l'olympiade de Saint-Pétersbourg — retombaient sur un hero-bg*.jpg
// décoratif, sans rapport avec le pays. Les deux photos et leurs variantes
// existent déjà dans assets/images/cities : aucun nouvel asset.
// Londres et Moscou suivent la convention « capitale ».
"Royaume-Uni": "london.jpg",
"Russie": "moscow.jpg"
};

// Seules les photos dont l'auteur et la source sont connus (CREDITS.md,
// 2026-09-24) : hero-bg3 et hero-bg5 (Pexels, RDNE Stock project) et
// hero-bg4 (Unsplash, RUT MIIT). « hero-bg.jpg » n'existait plus sur le
// disque (une carte tombée dessus affichait une image cassée) et la
// source de hero-bg2.jpg n'a pas pu être retrouvée : les deux sortent.
export const GENERIC_FALLBACK_IMAGES = ["hero-bg3.jpg", "hero-bg4.jpg", "hero-bg5.jpg"];

export function hashCode(str) {
let hash = 0;
for (let i = 0; i < str.length; i++) {
hash = (hash << 5) - hash + str.charCodeAt(i);
hash |= 0;
}
return hash;
}

/**
* Même cascade que scholarships.js (enrichWithProgramData) :
*
*   1. bourseImage fourni -> assets/images/scholarships/<bourseImage>
*      (photo de monument propre à CETTE bourse, jamais partagée avec
*      une autre — voir lot 14 et suivants). Variantes 400/800/1200/
*      1600w déjà téléchargées (scripts/add-lot14-*.ps1 et suivants),
*      donc srcset complet comme les photos de ville.
*   2. sinon universiteImage fourni -> assets/images/cities/<...>
*      (ancien comportement, le temps qu'une bourse reçoive sa propre
*      photo — voir le commentaire de cascade plus haut)
*   3. sinon COUNTRY_FALLBACK_IMAGE[pays] -> assets/images/cities/<...>
*   4. sinon repli générique : hero-bg*.jpg choisi par hash(texteHash),
*      avec les variantes 400/800/1200w déjà générées (voir
*      scripts/generate-city-srcset.mjs).
*
* @param {{pays: string, texteHash: string, universiteImage: ?string, bourseImage: ?string}} args
* @returns {{image: string, imageSrcset: string}}
*/
export function resolveScholarshipImage({ pays, texteHash, universiteImage, bourseImage }) {

let image;
let imageSrcset = "";

if (bourseImage) {

const base = bourseImage.replace(/\.jpe?g$/i, "");
image = `assets/images/scholarships/${base}-800w.jpg`;
imageSrcset = [400, 800, 1200, 1600].map((w) => `assets/images/scholarships/${base}-${w}w.jpg ${w}w`).join(", ");

} else if (universiteImage) {

const base = universiteImage.replace(/\.jpe?g$/i, "");
image = `assets/images/cities/${base}-800w.jpg`;
imageSrcset = [400, 800, 1200, 1600].map((w) => `assets/images/cities/${base}-${w}w.jpg ${w}w`).join(", ");

} else if (COUNTRY_FALLBACK_IMAGE[pays]) {

const base = COUNTRY_FALLBACK_IMAGE[pays].replace(/\.jpe?g$/i, "");
image = `assets/images/cities/${base}-800w.jpg`;
imageSrcset = [400, 800, 1200, 1600].map((w) => `assets/images/cities/${base}-${w}w.jpg ${w}w`).join(", ");

} else {

// hero-bg*.jpg pèsent jusqu'à 3,3 Mo en plein format — variantes
// 400/800/1200w déjà générées (voir scripts/generate-city-srcset.mjs,
// lancé sur assets/images/ le 2026-08-13), donc srcset/sizes comme
// pour les photos de ville plutôt que le fichier source brut.
const file = GENERIC_FALLBACK_IMAGES[Math.abs(hashCode(texteHash || "")) % GENERIC_FALLBACK_IMAGES.length];
const base = file.replace(/\.jpe?g$/i, "");

image = `assets/images/${base}-800w.jpg`;
imageSrcset = [400, 800, 1200].map((w) => `assets/images/${base}-${w}w.jpg ${w}w`).join(", ");

}

return { image, imageSrcset };

}


/**
 * Photo de ville prête à poser dans un <img> : la variante 800w comme
 * `src`, les variantes 400/800/1200w en `srcset`.
 *
 * CORRECTIF DU 2026-08-29 — le catalogue servait les ORIGINAUX.
 * Trois endroits posaient `assets/images/cities/<fichier>.jpg` tel
 * quel, sans srcset : les cartes d'universities.html, la photo de
 * couverture de scholarship-details.html, et deux des quatre branches
 * de resolveScholarshipImage() ci-dessus. Or les fichiers d'origine
 * de assets/images/cities/ sont les photos non redimensionnées :
 * oxford.jpg pèse 2,6 Mo, waseda.jpg 2,6 Mo, edinburgh.jpg 4,6 Mo.
 * Mesuré avant correctif : 11 Mo pour huit cartes d'universités, et
 * 3,3 Mo pour une seule page de détail dont 2,6 Mo pour la photo de
 * couverture.
 *
 * La quatrième branche de resolveScholarshipImage() faisait déjà les
 * choses correctement, et son commentaire dit exactement pourquoi
 * (« plutôt que le fichier source brut ») — le correctif ne fait
 * qu'étendre cette règle aux trois autres endroits.
 *
 * `fallbackOriginal` sert de filet : si une photo n'a pas encore ses
 * variantes générées, l'attribut onerror que posent les appelants
 * retombe sur le fichier d'origine plutôt que d'afficher une image
 * cassée.
 *
 * @param {string} cityImage nom de fichier tel qu'enregistré en base (ex. "oxford.jpg")
 * @returns {{src: string, srcset: string, fallbackOriginal: string}}
 */
export function resolveCityImage(cityImage) {

if (!cityImage) {

// Aucune photo enregistrée. L'ancien code visait
// "assets/images/cities/default.jpg", un fichier qui N'EXISTE PAS
// dans le dépôt : toute université sans photo affichait une image
// cassée. On retombe sur un visuel générique qui, lui, existe et a
// ses variantes.
return {
src: "assets/images/hero-bg3-800w.jpg",
srcset: [400, 800, 1200].map((w) => `assets/images/hero-bg3-${w}w.jpg ${w}w`).join(", "),
fallbackOriginal: "assets/images/hero-bg3-800w.jpg"
};

}

const base = String(cityImage).replace(/\.jpe?g$/i, "");

return {
src: `assets/images/cities/${base}-800w.jpg`,
srcset: [400, 800, 1200, 1600].map((w) => `assets/images/cities/${base}-${w}w.jpg ${w}w`).join(", "),
fallbackOriginal: `assets/images/cities/${cityImage}`
};

}

/**
 * Les jumeaux AVIF et WebP d'une photo du catalogue, prêts à poser dans
 * les <source> d'un <picture> (lot A « vitesse sur téléphone »,
 * 2026-09-24). Mesuré par PageSpeed : les photos du bandeau de l'accueil
 * pesaient 970 Kio sur téléphone, dont 855 évitables en format moderne.
 *
 * Seulement pour assets/images/scholarships/ et assets/images/cities/ :
 * dans ces deux dossiers, chaque « -400w.jpg » et « -800w.jpg » a ses
 * jumeaux (scripts/formats-modernes.mjs les crée, et
 * test/vitesse-accueil.test.mjs vérifie qu'aucun ne manque). Ailleurs
 * (les replis hero-bg*), on renvoie null : un <source> qui pointe vers un
 * fichier absent casse l'image, le navigateur ne retombe pas sur le JPEG.
 *
 * @param {string} image la variante JPEG servie en `src` (ex. « …-800w.jpg »)
 * @returns {{avif: string, webp: string}|null} deux srcset (400w et 800w)
 */
export function sourcesModernes(image) {

const m = /^(assets\/images\/(?:scholarships|cities)\/[^/]+)-\d+w\.jpg$/.exec(image || "");

if (!m) return null;

const jeu = (format) => [400, 800].map((w) => `${m[1]}-${w}w.${format} ${w}w`).join(", ");

return { avif: jeu("avif"), webp: jeu("webp") };

}

/**
 * LOT PERF 3G (2026-09-28) — l'AVIF et le WebP sur les CARTES et les FICHES,
 * sans rien changer à la netteté.
 *
 * Les jumeaux modernes n'existent qu'en 400 et 800 px (voir
 * sourcesModernes et scripts/formats-modernes.mjs) ; le JPEG monte à 1600.
 * Sur un écran 3x, une carte pleine largeur demande ~1 200 px : un
 * <source> AVIF sans condition y servirait la variante 800, moins nette
 * que le JPEG d'aujourd'hui. Créer les jumeaux 1200 et 1600 coûterait
 * ~270 Mo au dépôt (mesuré le 2026-09-28 sur huit photos).
 *
 * D'où cette condition `media` : le <source> moderne ne sert QUE lorsque la
 * largeur que le navigateur prendrait dans le JPEG ne dépasse pas 800 px
 * (largeur de l'emplacement × densité de l'écran ≤ 800). Même largeur
 * qu'aujourd'hui, dans tous les navigateurs ; seul le format change.
 * Au-delà, le JPEG, exactement comme avant. Un navigateur qui ne connaît
 * pas `resolution` ignore le <source> : JPEG, comme avant.
 *
 * Ne sait lire que les `sizes` du site : des entrées « (max-width:Npx) L »
 * puis une longueur par défaut, L en px ou en vw. Toute autre forme rend
 * null : pas de <source> moderne, le JPEG seul.
 *
 * @param {string} sizes l'attribut sizes de l'<img>
 * @returns {string|null} "" = toujours ; une liste de requêtes ; null = jamais
 */
export const LARGEUR_MAX_MODERNE = 800;

const DENSITES_MODERNES = [1, 1.5, 2, 2.5, 3, 3.5, 4];

// Aucun téléphone n'a un écran de moins de 300 px CSS : une condition qui
// ne servirait qu'en dessous est retirée (ces écrans auraient le JPEG).
const LARGEUR_UTILE_MIN = 300;

const mediaDejaCalcules = new Map();

export function mediaModernes(sizes) {

const cle = String(sizes || "");
if (!mediaDejaCalcules.has(cle)) mediaDejaCalcules.set(cle, calculerMediaModernes(cle));
return mediaDejaCalcules.get(cle);

}

function calculerMediaModernes(sizes) {

const branches = [];
let bas = 0;
const entrees = String(sizes || "").split(",");

for (let i = 0; i < entrees.length; i++) {
const m = /^\s*(?:\(\s*max-width\s*:\s*(\d+)px\s*\)\s*)?(\d+(?:\.\d+)?)(px|vw)\s*$/.exec(entrees[i]);
if (!m) return null;
const derniere = i === entrees.length - 1;
if (derniere === Boolean(m[1])) return null; // la longueur par défaut, et elle seule, ferme la liste
const haut = m[1] ? Number(m[1]) : Infinity;
branches.push({ bas, haut, valeur: Number(m[2]), unite: m[3] });
bas = haut + 1;
}

// Pour chaque densité, les largeurs d'écran où la variante 800 suffit.
let clauses = [];
for (const d of DENSITES_MODERNES) {
for (const b of branches) {
const fin = b.unite === "px"
? (b.valeur * d <= LARGEUR_MAX_MODERNE ? b.haut : -1)
: Math.min(b.haut, Math.floor(LARGEUR_MAX_MODERNE / (d * b.valeur / 100)));
if (fin < b.bas || fin < LARGEUR_UTILE_MIN) continue;
clauses.push({ d, bas: b.bas, fin });
}
}

// Une clause couverte par une autre (densité plus haute, largeurs plus
// larges) ne dit rien de plus.
clauses = clauses.filter((c, i) => !clauses.some((o, j) => j !== i && o.d >= c.d && o.bas <= c.bas && o.fin >= c.fin && (o.d > c.d || o.bas < c.bas || o.fin > c.fin)));

if (!clauses.length) return null;
// Toutes largeurs jusqu'à 4x : aucune condition utile.
if (clauses.some((c) => c.d === DENSITES_MODERNES[DENSITES_MODERNES.length - 1] && c.bas === 0 && c.fin === Infinity)) return "";

return clauses.map((c) => [
`(max-resolution: ${c.d}dppx)`,
c.bas > 0 ? `(min-width: ${c.bas}px)` : "",
c.fin !== Infinity ? `(max-width: ${c.fin}px)` : ""
].filter(Boolean).join(" and ")).join(", ");

}

/**
 * Les deux <source> modernes d'une photo, à poser devant son <img> dans un
 * <picture> — "" quand il n'y en a pas (repli hero-bg, `sizes` inconnu).
 *
 * `hidden` sur chaque <source> : `picture { display: contents }`
 * (css/base.css) en fait des enfants du conteneur de l'image, et Chromium
 * leur donne une boîte (display: block). Dans un conteneur flex à `gap`
 * (la vignette de results.html), chacune ajoutait un écart : 28 px de
 * décalage, mesuré le 2026-09-28. `hidden` retire la boîte sans rien
 * changer au choix de l'image.
 * @param {string} image la variante JPEG servie en `src`
 * @param {string} sizes le même `sizes` que l'<img>
 */
export function sourcesPicture(image, sizes) {

const modernes = sourcesModernes(image);
const media = modernes ? mediaModernes(sizes) : null;
if (!modernes || media === null) return "";
const condition = media ? ` media="${media}"` : "";
return `<source hidden type="image/avif"${condition} srcset="${modernes.avif}" sizes="${sizes}"><source hidden type="image/webp"${condition} srcset="${modernes.webp}" sizes="${sizes}">`;

}

/**
 * Pour une <img> déjà dans la page (couverture des fiches) : l'enveloppe
 * dans un <picture> et pose les deux <source> AVANT que l'image ne reçoive
 * sa source — sinon le navigateur partirait sur le JPEG, puis sur l'AVIF.
 * `picture { display: contents }` (css/base.css) : aucune boîte en plus.
 * @returns {boolean} vrai si des <source> ont été posés
 */
export function poserSourcesModernes(img, image, sizes) {

const modernes = sourcesModernes(image);
const media = modernes ? mediaModernes(sizes) : null;
if (!img || !img.parentNode || !modernes || media === null) return false;
const doc = img.ownerDocument;
let picture = img.parentNode;
if (picture.tagName !== "PICTURE") {
picture = doc.createElement("picture");
img.parentNode.insertBefore(picture, img);
picture.appendChild(img);
}
picture.querySelectorAll("source").forEach((s) => s.remove());
for (const [type, srcset] of [["image/avif", modernes.avif], ["image/webp", modernes.webp]]) {
const s = doc.createElement("source");
s.hidden = true;
s.type = type;
if (media) s.media = media;
s.srcset = srcset;
s.sizes = sizes;
picture.insertBefore(s, img);
}
return true;

}

/**
 * Le repli d'une photo en erreur, dans un <picture> : retirer d'abord les
 * <source>, sinon le navigateur y retourne et l'image reste cassée.
 */
export function retirerSourcesModernes(img) {

const parent = img && img.parentNode;
if (parent && parent.tagName === "PICTURE") parent.querySelectorAll("source").forEach((s) => s.remove());

}
