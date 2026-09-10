/**
* ==========================================================
* FitzUniverse — le glossaire (lot LANGAGE, 2026-09-10)
* ==========================================================
*
* LE SEUL fichier de définitions du site. Un mot technique porte son
* explication en quelques mots, entre parenthèses, à sa PREMIÈRE
* apparition sur une page : « l'apostille (un tampon officiel qui rend
* votre document valable à l'étranger) ». Jamais recopié dans une page :
* deux pages finiraient par expliquer le même mot différemment.
*
* Deux usages, même table :
*  - `annoterTexte(texte, vus)` : pur, testable sous Node, sur une
*    chaîne — c'est ce que les tests exercent ;
*  - `expliquerTermes(racine)` : parcourt les nœuds de texte d'une page
*    dans l'ordre de lecture et annote le premier de chaque terme.
*    Appelé par js/pied-de-page.js, puis à chaque rendu (les faits
*    publics de preinscription-france.html arrivent après coup).
*
* Ce qui n'est PAS annoté : les menus, l'en-tête, le pied de page, les
* liens et boutons (un libellé d'action n'est pas une phrase), les <h1>
* et les étiquettes de formulaire — et une explication déjà posée
* (sinon « Études en France (la plateforme…) » ferait annoter
* « plateforme » si ce mot entrait un jour au glossaire).
*
* Règle du lot : ne jamais perdre une condition. Une explication dit ce
* que la chose EST ; elle ne remplace pas la règle qui la suit.
* ==========================================================
*/

// Frontières de mot en Unicode : `\b` ne connaît que l'ASCII, et
// « Études » ou « vœu » commencent ou finissent hors de l'ASCII.
const mot = (corps, drapeaux = "") => new RegExp(`(?<!\\p{L})(?:${corps})(?!\\p{L})`, `u${drapeaux}`);

export const GLOSSAIRE = [
{ id: "apostille", motif: mot("apostilles?", "i"), explication: "un tampon officiel qui rend votre document valable à l'étranger" },
{ id: "legalisation-consulaire", motif: mot("légalisation consulaire", "i"), explication: "la validation de votre document par le consulat" },
{ id: "dap", motif: mot("DAP"), explication: "la demande d'admission préalable, pour une première année de licence" },
{ id: "etudes-en-france", motif: mot("Études en France"), explication: "la plateforme en ligne de Campus France" },
{ id: "voeu", motif: mot("v(?:œ|oe)ux?", "i"), explication: (m) => (/x$/i.test(m) ? "les formations que vous demandez" : "une formation que vous demandez") },
{ id: "exoneration", motif: mot("exonérations?", "i"), explication: "une réduction des droits d'inscription" },
{ id: "preinscription", motif: mot("préinscriptions?", "i"), explication: "une demande d'admission, avant l'inscription" },
{ id: "portail", motif: mot("portails?", "i"), explication: "le site officiel où vous déposez" },
{ id: "attestation-de-ressources", motif: mot("attestations? de ressources", "i"), explication: "la preuve que vous pouvez financer vos études" },
{ id: "tcf-delf-dalf", motif: mot("TCF|DELF|DALF"), explication: "un test officiel de niveau de français" },
{ id: "ninea", motif: mot("NINEA"), explication: "le numéro d'identification des entreprises au Sénégal" }
];

// Le libellé de l'explication, pour le mot rencontré.
export function explicationDe(terme, mot) {
return typeof terme.explication === "function" ? terme.explication(mot) : terme.explication;
}

/**
* Les insertions à faire dans `texte` : pour chaque terme jamais vu,
* la position juste après sa première occurrence et « (explication) ».
* `vus` (Set d'identifiants) traverse les appels : une page n'explique
* chaque terme qu'une fois. Triées par position croissante.
*/
export function annotations(texte, vus = new Set()) {
const liste = [];
if (!texte) return liste;
for (const terme of GLOSSAIRE) {
if (vus.has(terme.id)) continue;
const m = terme.motif.exec(texte);
if (!m) continue;
vus.add(terme.id);
liste.push({ id: terme.id, position: m.index + m[0].length, texte: ` (${explicationDe(terme, m[0])})` });
}
return liste.sort((a, b) => a.position - b.position);
}

// La chaîne annotée. Les positions sont calculées AVANT toute
// insertion : une explication ne peut pas être annotée à son tour.
export function annoterTexte(texte, vus = new Set()) {
const liste = annotations(texte, vus);
if (!liste.length) return texte;
let sortie = "";
let curseur = 0;
for (const ins of liste) {
sortie += texte.slice(curseur, ins.position) + ins.texte;
curseur = ins.position;
}
return sortie + texte.slice(curseur);
}

// Ce qu'on ne traverse pas dans une page.
export const HORS_CHAMP = "nav, header, footer, a, button, h1, label, option, select, textarea, input, script, style, noscript, code, pre, [data-sans-glossaire], .glossaire-def, .mnav-sheet, .mnav-tabbar, .fitz-badge, .kicker";

/**
* Annote les nœuds de texte d'une page dans l'ordre de lecture. Le
* registre des termes déjà expliqués vit sur le document : la fonction
* peut être rappelée après un rendu sans expliquer deux fois.
* Rend le nombre d'explications posées.
*/
export function expliquerTermes(racine) {
if (typeof document === "undefined") return 0;
const doc = racine && racine.ownerDocument ? racine.ownerDocument : document;
const cible = racine || doc.body;
if (!cible) return 0;
const registre = doc.__glossaireVus || (doc.__glossaireVus = new Set());
if (registre.size >= GLOSSAIRE.length) return 0;

const walker = doc.createTreeWalker(cible, 4 /* NodeFilter.SHOW_TEXT */, {
acceptNode(noeud) {
const parent = noeud.parentElement;
if (!parent || !noeud.nodeValue.trim()) return 2; // FILTER_REJECT
return parent.closest(HORS_CHAMP) ? 2 : 1; // FILTER_ACCEPT
}
});
const noeuds = [];
for (let n = walker.nextNode(); n; n = walker.nextNode()) noeuds.push(n);

let poses = 0;
for (const noeud of noeuds) {
const texte = noeud.nodeValue;
const liste = annotations(texte, registre);
if (!liste.length) continue;
// L'explication vit dans son propre <span> : reconnaissable, jamais
// annotée à son tour, et stylable (css/pied-de-page.css).
const fragment = doc.createDocumentFragment();
let curseur = 0;
for (const ins of liste) {
fragment.appendChild(doc.createTextNode(texte.slice(curseur, ins.position)));
const span = doc.createElement("span");
span.className = "glossaire-def";
span.setAttribute("data-terme", ins.id);
span.textContent = ins.texte;
fragment.appendChild(span);
curseur = ins.position;
poses += 1;
}
fragment.appendChild(doc.createTextNode(texte.slice(curseur)));
noeud.parentNode.replaceChild(fragment, noeud);
if (registre.size >= GLOSSAIRE.length) break;
}
return poses;
}

/**
* Explique maintenant, puis à chaque rendu ultérieur (contenu arrivé
* de Firestore ou d'un instantané), sans repasser sur nos propres
* insertions : l'observateur est suspendu pendant qu'on écrit.
*/
export function surveillerTermes(racine) {
if (typeof document === "undefined" || typeof MutationObserver === "undefined") return;
const cible = racine || document.body;
if (!cible) return;
expliquerTermes(cible);
let prevu = 0;
const obs = new MutationObserver(() => {
if (prevu) return;
prevu = setTimeout(() => {
prevu = 0;
obs.disconnect();
expliquerTermes(cible);
obs.observe(cible, { childList: true, subtree: true, characterData: true });
}, 120);
});
obs.observe(cible, { childList: true, subtree: true, characterData: true });
}
