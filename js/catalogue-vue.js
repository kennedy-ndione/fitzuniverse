/**
* ============================================================
* Fitz — donner une FIN au catalogue
* ============================================================
*
* LE PROBLÈME QUE CE FICHIER RÉSOUT (2026-09-06)
* ----------------------------------------------
* Mesuré en production : `scholarships.html` faisait **103 077 px** de
* haut — environ 113 écrans — pour 6 860 éléments, 217 images et 156
* cartes. `universities.html` était du même ordre. Un étudiant qui
* ouvre la page descend sans jamais savoir quand ça s'arrête, et sur
* téléphone il ne le sait toujours pas au bout d'une minute.
*
* Ce n'est pas un problème de vitesse : la page tient 60 fps. C'est un
* problème d'ÉTENDUE. Une liste dont on ne voit pas la fin ne se lit
* pas, elle se subit.
*
* CE QUE MESURENT LES DONNÉES
* ---------------------------
* Export du 2026-09-05 : 30 pays, 156 bourses, 155 universités,
* médiane 4 par pays, plus gros groupes Italie 29 et France 26. Aucun
* pays n'a besoin d'être paginé. Le PAYS est donc l'unité naturelle de
* découpe — pas un nombre arbitraire de cartes, pas un « charger
* plus ».
*
* CE QUE CE MODULE NE FAIT PAS
* ----------------------------
*  - Il ne TRIE pas. L'ordre des pays (candidatures ouvertes d'abord)
*    et le rang des cartes (ouverte / pas encore ouverte / inconnue /
*    close) ont été décidés et vérifiés le 2026-09-05 : ils arrivent
*    ici déjà faits et ressortent intacts.
*  - Il ne REPLIE rien. Pas d'accordéon : la décision du 2026-09-05
*    (« toutes les sections restent dépliées ») vaut à l'intérieur
*    d'une vue. On montre moins de pays, jamais des pays fermés.
*  - Il ne charge rien au défilement. Une page dont on ne voit pas la
*    fin est exactement le mal qu'on corrige ; en ajouter à mesure
*    qu'on descend le rendrait infini pour de bon.
*
* Fonction pure : aucun DOM, aucun réseau. Partagée par scholarships.js
* et universities-page.js — jamais deux définitions de la même règle.
* ============================================================
*/

import { paysAvecArticle } from "./eligibility-countries.js";

/**
* Combien de cartes la vue d'aperçu vise. « Environ » : on ne coupe
* jamais un pays en deux pour tomber juste, donc le total réel est le
* premier total de pays entiers qui atteint ce plafond.
*
* POURQUOI 12 ET 8, ET PAS 18 ET 12
* ---------------------------------
* La consigne du 2026-09-06 disait « ≈ 18 cartes », « 12 par pays », et
* fixait l'objectif réel : ramener la page **sous 12 000 px**. Les deux
* ne tenaient pas ensemble. Mesuré à 390 px, largeur où le défaut a été
* constaté :
*
*     18 / 12  →  22 cartes, 15 672 px   (objectif manqué de 30 %)
*     12 /  8  →  16 cartes, 12 164 px   (objectif atteint)
*
* Une carte de bourse fait ~644 px de haut sur un téléphone : c'est
* elle qui décide, pas le nombre choisi au jugé. On a donc gardé
* l'objectif chiffré, qui se vérifie, et ajusté les moyens — les deux
* pays de tête restent visibles dans les deux réglages, on n'a rien
* perdu du sens de la vue.
*/
export const CARTES_VISEES = 12;

/**
* Au-delà, un pays à lui seul redevient un mur. Il montre ses huit
* premières cartes et un lien qui dit le reste en toutes lettres
* (« Voir les 29 bourses de l'Italie ») — le seul endroit où une
* section est écourtée, et elle le dit.
*/
export const MAX_PAR_PAYS = 8;

/**
* Découpe la liste groupée par pays en une vue qui a une fin.
*
* @param {Array<{country:string, items:Array}>} groupes - déjà triés
*        par l'appelant ; l'ordre est conservé tel quel
* @param {Object} [options]
* @param {string} [options.paysFiltre] - un pays choisi : il est seul,
*        et entier
* @param {boolean} [options.tout] - « Tout afficher » : le rendu
*        d'avant ce module, tous pays dépliés
* @param {number} [options.cible=CARTES_VISEES]
* @param {number} [options.maxParPays=MAX_PAR_PAYS]
* @returns {{
*   mode: "pays"|"tout"|"apercu",
*   groupes: Array<{country:string, items:Array, total:number, ecourte:boolean}>,
*   affichees: number,   // cartes réellement rendues
*   total: number,       // cartes que la sélection contient
*   paysAffiches: number,
*   partielle: boolean   // vrai dès qu'une carte reste hors de la vue
* }}
*/
export function decouperVue(groupes, options = {}) {

const liste = Array.isArray(groupes) ? groupes : [];

const cible = Number.isFinite(options.cible) ? options.cible : CARTES_VISEES;
const maxParPays = Number.isFinite(options.maxParPays) ? options.maxParPays : MAX_PAR_PAYS;

const total = liste.reduce((n, g) => n + g.items.length, 0);

const entier = (g) => ({ country: g.country, items: g.items, total: g.items.length, ecourte: false, source: g });

// --- « Tout afficher » : exactement le rendu d'aujourd'hui ---
if (options.tout) {
return { mode: "tout", groupes: liste.map(entier), affichees: total, total, paysAffiches: liste.length, partielle: false };
}

// --- Un pays choisi : lui seul, et ENTIER ---
//
// Entier, sans plafond : quand on a demandé l'Italie, on veut les 29
// bourses d'Italie. Le plafond ne sert qu'à empêcher un pays de
// manger la vue d'ensemble, ce qui n'a plus de sens ici.
if (options.paysFiltre) {

const choisis = liste.filter((g) => g.country === options.paysFiltre);
const affichees = choisis.reduce((n, g) => n + g.items.length, 0);

return { mode: "pays", groupes: choisis.map(entier), affichees, total, paysAffiches: choisis.length, partielle: affichees < total };

}

// --- L'aperçu : des pays entiers, jusqu'au plafond ---
//
// La règle tient en une phrase : on ajoute des pays ENTIERS tant que
// le plafond n'est pas atteint, puis on s'arrête net.
//
// « Atteint », et non « dépassé » : la première version s'arrêtait
// avant tout dépassement, et sur les données réelles du 2026-09-06
// elle n'affichait qu'UN pays (Italie, 12 cartes) — le pays de tête
// mangeait le budget et le suivant ne tenait plus. Une vue à un seul
// pays n'est plus un aperçu du catalogue, c'est une vitrine
// italienne. On accepte donc de dépasser d'un pays, jamais de plus :
// le dépassement est borné par `maxParPays`.
const retenus = [];
let affichees = 0;

for (const g of liste) {

if (affichees >= cible) break;

const montrees = Math.min(g.items.length, maxParPays);

retenus.push({
country: g.country,
items: g.items.slice(0, montrees),
total: g.items.length,
ecourte: montrees < g.items.length,
source: g
});

affichees += montrees;

}

return {
mode: "apercu",
groupes: retenus,
affichees,
total,
paysAffiches: retenus.length,
partielle: affichees < total
};

}

/**
* La ligne d'étendue, au-dessus de la liste.
*
* Elle existe parce qu'une vue partielle qui ne dit pas qu'elle est
* partielle est un mensonge par omission : l'étudiant croit avoir vu le
* catalogue. Elle dit donc toujours DEUX choses — ce qu'il voit, et ce
* qui existe.
*
* @param {Object} vue - sortie de decouperVue()
* @param {Object} noms - { un:"bourse", plusieurs:"bourses", accord:"e" }
* @param {Object} [extra]
* @param {number} [extra.pays] - nombre total de pays du catalogue filtré
* @param {string} [extra.paysFiltre]
* @param {number} [extra.ouvertes] - candidatures ouvertes du pays choisi
* @returns {string}
*/
export function ligneEtendue(vue, noms, extra = {}) {

const mot = (n) => (n > 1 ? noms.plusieurs : noms.un);

// « affichée » pour une bourse, « affiché » pour un établissement.
const accorde = (n) => `affiché${noms.accord || ""}${n > 1 ? "s" : ""}`;

if (vue.mode === "pays" && extra.paysFiltre) {

const base = `${extra.paysFiltre} — ${vue.affichees} ${mot(vue.affichees)}`;

// `ouvertes` n'est passé que par la page des bourses : une
// université n'a pas d'état de candidature, et inventer « dont 0
// ouvertes » ici ferait croire à une fermeture.
return extra.ouvertes === undefined || extra.ouvertes === null
? base
: `${base}, dont ${extra.ouvertes} aux candidatures ouvertes`;

}

const pays = Number.isFinite(extra.pays) ? extra.pays : vue.paysAffiches;
const queue = pays > 0 ? ` · ${pays} pays` : "";

// Vue complète : inutile de dire « 156 sur 156 ». Le total suffit, et
// l'absence de « sur » dit à elle seule qu'il n'y a rien de plus.
if (!vue.partielle) return `${vue.total} ${mot(vue.total)}${queue}`;

return `${vue.affichees} ${mot(vue.affichees)} ${accorde(vue.affichees)} sur ${vue.total}${queue}`;

}

/**
* « Voir les 29 bourses de l'Italie » — la phrase d'un groupe écourté.
* Le NOMBRE RÉEL est dans la phrase : c'est lui qui transforme une
* troncature subie en information.
*
* L'article passe par paysAvecArticle() (js/eligibility-countries.js),
* déjà écrit et testé : « en Japon » et « en États-Unis » sont les deux
* fautes qu'une préposition unique aurait garanties.
*/
export function libelleVoirTout(groupe, noms) {

const n = groupe.total;
const ou = paysAvecArticle(groupe.country) || `de ${groupe.country}`;

return `Voir les ${n} ${n > 1 ? noms.plusieurs : noms.un} ${ou}`;

}
