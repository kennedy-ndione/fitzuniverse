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
*
* OÙ L'EXPLICATION NE DOIT PAS SE POSER (mesuré en ligne le 2026-09-14)
* ---------------------------------------------------------------------
* L'insertion se faisait juste après le mot, sans regarder ce qui
* l'entourait. Vu sur la fiche PUBLIQUE de l'Université Mohammed V :
*
*   « …du pays d'origine (pas de portail (le site officiel où vous
*     déposez) en ligne unique), transmission par voie diplomatique. »
*
* Une parenthèse DANS une parenthèse : la phrase se casse en deux et
* « en ligne unique) » se retrouve orphelin. Ce n'est pas un cas
* limite — les notes du catalogue sont pleines de parenthèses, et le
* balayage des 3 375 textes longs du catalogue public en a compté
* **19**, dont Polytechnique (« exonération (…) des droits »), la
* Rosa-Luxemburg-Stiftung, l'UGA et la Statale de Milan.
*
* DEUX RÈGLES, toutes deux décidables sans analyser le français :
*  1. jamais À L'INTÉRIEUR d'une parenthèse ouverte — une incise dans
*     une incise est toujours fautive, quel que soit le texte. On passe
*     à l'occurrence SUIVANTE du même terme, et s'il n'y en a pas, le
*     terme reste à expliquer plus loin dans la page (il n'est PAS
*     marqué comme vu) ;
*  2. jamais collée à une parenthèse qui s'ouvre — « (…) (…) » est
*     illisible. Zéro cas aujourd'hui dans le catalogue, la garde est
*     là pour demain.
*
* ET DEUX EXPLICATIONS RÉÉCRITES, pour la même raison de lecture : elles
* répétaient le mot qui suivait le plus souvent le terme. « le portail
* officiel » donnait « le portail (le site OFFICIEL où vous déposez)
* officiel », et « l'exonération des droits » donnait « l'exonération
* (une réduction des DROITS d'inscription) des droits ». Un glossaire
* qui fait bégayer la phrase qu'il éclaire manque son but.
* ==========================================================
*/

// Frontières de mot en Unicode : `\b` ne connaît que l'ASCII, et
// « Études » ou « vœu » commencent ou finissent hors de l'ASCII.
// Sans lookbehind (lot DEUX-MOTEURS, 2026-09-11) : `(?<!\p{L})` est une
// SyntaxError avant Safari 16.4 (iPhone 8/X sous iOS 16.7 au plus, MDN),
// et elle tombait ICI, à l'exécution — le glossaire entier avec elle. Le
// groupe 1 capture le caractère précédent (ou le début) ; annotations()
// le retranche.
const mot = (corps, drapeaux = "") => new RegExp(`(^|[^\\p{L}])(?:${corps})(?!\\p{L})`, `u${drapeaux}`);

export const GLOSSAIRE = [
{ id: "apostille", motif: mot("apostilles?", "i"), explication: "un tampon officiel qui rend votre document valable à l'étranger" },
{ id: "legalisation-consulaire", motif: mot("légalisation consulaire", "i"), explication: "la validation de votre document par le consulat" },
{ id: "dap", motif: mot("DAP"), explication: "la demande d'admission préalable, pour une première année de licence" },
{ id: "etudes-en-france", motif: mot("Études en France"), explication: "la plateforme en ligne de Campus France" },
{ id: "voeu", motif: mot("v(?:œ|oe)ux?", "i"), explication: (m) => (/x$/i.test(m) ? "les formations que vous demandez" : "une formation que vous demandez") },
{ id: "exoneration", motif: mot("exonérations?", "i"), explication: "une réduction de ce que vous payez" },
{ id: "preinscription", motif: mot("préinscriptions?", "i"), explication: "une demande d'admission, avant l'inscription" },
{ id: "portail", motif: mot("portails?", "i"), explication: "le site où vous déposez votre candidature" },
{ id: "attestation-de-ressources", motif: mot("attestations? de ressources", "i"), explication: "la preuve que vous pouvez financer vos études" },
{ id: "tcf-delf-dalf", motif: mot("TCF|DELF|DALF"), explication: "un test officiel de niveau de français" },
{ id: "ninea", motif: mot("NINEA"), explication: "le numéro d'identification des entreprises au Sénégal" },
// LOT R23 (2026-09-18) — DEUX MOTS MESURÉS SUR LA ROUTE DES HUIT PAYS.
// Le balayage a compté, dans le texte réellement rendu :
//   « Espace Campus France »  phrase en clair, titre officiel, mention
//   « entretien pédagogique » titre officiel
// Tous deux dans des endroits que le glossaire ATTEINT, et aucun des
// deux au glossaire. C'est pourtant le bureau où l'étudiant ira, et
// l'épreuve qu'il redoute le plus de tout le parcours.
{ id: "espace-campus-france", motif: mot("Espaces? Campus France", "i"), explication: "le bureau de Campus France dans votre pays" },
{ id: "entretien-pedagogique", motif: mot("entretiens? pédagogiques?", "i"), explication: "un entretien sur votre projet d'études, en français" }
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
/**
* Le mot est-il DANS une parenthèse déjà ouverte ?
* On compte les parenthèses avant le point d'insertion : une incise
* dans une incise est toujours fautive. Les guillemets français et les
* apostrophes ne comptent pas — seules les parenthèses créent le
* télescopage.
*/
function dansUneParenthese(texte, position) {
const avant = texte.slice(0, position);
const ouvertes = (avant.match(/\(/g) || []).length;
const fermees = (avant.match(/\)/g) || []).length;
return ouvertes > fermees;
}

/** Une parenthèse s'ouvre-t-elle juste après ? « (…) (…) » est illisible. */
function colleeAUneParenthese(texte, position) {
return /^\s*\(/.test(texte.slice(position));
}

/**
* La première place LISIBLE pour l'explication d'un terme, ou null.
*
* On parcourt toutes les occurrences, pas seulement la première : un
* terme dont la première apparition tombe dans une parenthèse peut très
* bien réapparaître en clair deux phrases plus loin, et c'est là qu'il
* s'explique. C'est le cas de la fiche AMCI, où « portail » apparaît
* trois fois.
*/
function placeLisible(texte, terme) {

// `mot()` rend une expression sans `g` : on en fabrique une version
// globale pour itérer, sans toucher à la table.
const balayeur = new RegExp(terme.motif.source, `${terme.motif.flags}g`);

for (let m = balayeur.exec(texte); m; m = balayeur.exec(texte)) {

// m[1] est le caractère qui précède le terme (voir mot() plus haut).
const position = m.index + m[0].length;

if (dansUneParenthese(texte, position)) continue;
if (colleeAUneParenthese(texte, position)) continue;

return { position, mot: m[0].slice(m[1].length) };

}

return null;

}

export function annotations(texte, vus = new Set()) {
const liste = [];
if (!texte) return liste;
for (const terme of GLOSSAIRE) {
if (vus.has(terme.id)) continue;
const place = placeLisible(texte, terme);
// AUCUNE PLACE LISIBLE N'EST PAS « DÉJÀ VU ». `vus.add` était appelé
// dès qu'un motif matchait : un terme dont la seule occurrence de ce
// texte tombait dans une parenthèse aurait été marqué comme expliqué
// sans l'être, et il ne le serait plus jamais sur la page.
if (!place) continue;
vus.add(terme.id);
// `mot` est le mot tel qu'il apparaît dans CE texte (lot R23) : il sert
// à nommer les termes hors d'un texte qu'on ne peut pas annoter.
liste.push({ id: terme.id, position: place.position, mot: place.mot, texte: ` (${explicationDe(terme, place.mot)})` });
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
* Annote les nœuds de texte d'une page dans l'ordre de lecture.
* Rend le nombre d'explications posées.
*
* LE REGISTRE SE LIT DANS LE DOM (lot R21, 2026-09-18), et non plus sur
* le document. Il était gardé dans `doc.__glossaireVus`, ce qui marchait
* pour une page dont le contenu ARRIVE — les faits publics d'une fiche,
* le catalogue. L'espace étudiant, lui, se REDESSINE : la route repeint
* ses quinze étapes, les cartes de candidature se reconstruisent. Mesuré
* au banc le 2026-09-18 : l'explication de « portail » se posait au
* premier rendu, disparaissait avec le contenu au premier repeint, et ne
* revenait JAMAIS — le registre la croyait encore là.
*
* Ce qui est expliqué, c'est ce qui PORTE une explication. Le registre
* se déduit donc des <span class="glossaire-def"> présents dans la
* cible : un contenu effacé emmène ses explications, et le mot redevient
* à expliquer. Aucun doublon pour autant — une occurrence déjà suivie de
* son explication est reconnue par ce même compte.
*/
/**
 * LES MOTS TECHNIQUES D'UN TEXTE QU'ON NE PEUT PAS ANNOTER (lot R23).
 *
 * Le lot R21 a mis la citation officielle de la route hors de portée du
 * glossaire (data-sans-glossaire) : on ne glisse pas nos parenthèses dans
 * un texte qu'on présente comme officiel. Juste, mais MESURÉ le même
 * jour sur la route des huit pays documentés, le résultat est que trois
 * termes du glossaire n'apparaissent PLUS QUE là :
 *
 *   dap             16 occurrences — le mot le plus opaque du parcours
 *   preinscription
 *   tcf-delf-dalf
 *
 * L'étudiant restait donc seul devant « DAP ». La réponse n'est pas
 * d'annoter la citation, c'est de poser les définitions À CÔTÉ d'elle :
 * la citation reste intacte, et les mots sont dits quand même.
 *
 * Pur, testable sous Node. Rend [{id, mot, explication}] dans l'ordre du
 * texte, chaque terme une seule fois.
 */
export function motsTechniques(texte) {
return annotations(String(texte || ""), new Set()).map((a) => ({
id: a.id,
mot: a.mot,
explication: a.texte.replace(/^ \(|\)$/g, "")
}));
}

export function expliquerTermes(racine) {
if (typeof document === "undefined") return 0;
const doc = racine && racine.ownerDocument ? racine.ownerDocument : document;
const cible = racine || doc.body;
if (!cible) return 0;
const registre = new Set(
[...cible.querySelectorAll(".glossaire-def[data-terme]")].map((e) => e.getAttribute("data-terme"))
);
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
