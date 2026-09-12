// ============================================================
// js/pays-grammaire.js — L'ARTICLE DES NOMS DE PAYS
// (lot VITRINE-COMMERCIALE, 2026-09-11)
// ============================================================
//
// LE DÉFAUT QU'IL CORRIGE. js/preinscription-destination.js composait
// ses phrases ainsi :
//
//     /^[AEIOUY]/i.test(p) ? `l'${p}` : `le ${p}`
//
// Un seul test, la voyelle initiale. Tout pays féminin recevait donc
// « le » : « le Côte d'Ivoire », « le Guinée », « le Tunisie ». Le même
// module écrivait « Étudier en Canada » et « Étudier en Maroc », parce
// que la préposition était, elle, écrite en dur dans le gabarit.
//
// CE QUE CE MODULE DONNE, pour un nom de pays :
//   article      le / la / l' / les / (rien)
//   locatif      au / en / aux / à / à la      « Étudier AU Canada »
//   provenance   du / de la / de l' / des / de « venu DE LA Guinée »
//
// IL NE DEVINE JAMAIS POUR UN PAYS INCONNU. `formesDePays()` renvoie
// null si le nom ne correspond à aucun pays de js/countries.js, et
// chaque fonction d'affichage rend alors le nom NU. Une saisie libre
// mal orthographiée s'affiche telle quelle plutôt que précédée d'un
// article inventé.
//
// MODULE PUR : aucune dépendance au DOM, testable sans navigateur
// (test/pays-grammaire.test.mjs).
// ============================================================
import { COUNTRIES, findCountry } from "./countries.js";

// ------------------------------------------------------------
// Les six familles, et ce qu'elles produisent
// ------------------------------------------------------------
//
//  m   masculin consonne ........ le Sénégal, au Sénégal, du Sénégal
//  f   féminin consonne/-e ...... la Guinée, en Guinée, de la Guinée
//  v   initiale vocalique ....... l'Allemagne, en Allemagne, de l'Allemagne
//      (le genre n'y change rien : « en » et « de l' » pour les deux)
//  p   pluriel .................. les États-Unis, aux États-Unis, des États-Unis
//  z   sans article ............. Madagascar, à Madagascar, de Madagascar
//  i   île féminine ............. la Jamaïque, à la Jamaïque, de la Jamaïque
//      (une île féminine prend « à la », jamais « en »)
const FORMES = {
m: { article: "le", locatif: "au", provenance: "du" },
f: { article: "la", locatif: "en", provenance: "de la" },
v: { article: "l'", locatif: "en", provenance: "de l'" },
p: { article: "les", locatif: "aux", provenance: "des" },
z: { article: "", locatif: "à", provenance: "de" },
i: { article: "la", locatif: "à la", provenance: "de la" }
};

/** Pays dont le nom s'emploie SANS article : « à Cuba », « de Cuba ». */
const SANS_ARTICLE = new Set([
"Cuba", "Madagascar", "Haïti", "Djibouti", "Monaco", "Malte", "Chypre",
"Bahreïn", "Oman", "Singapour", "Israël", "Maurice", "Nauru", "Tuvalu",
"Kiribati", "Sao Tomé-et-Principe", "Trinité-et-Tobago", "Taïwan",
"Saint-Marin", "Sainte-Lucie"
]);

/** Pays au pluriel : « aux Pays-Bas », « des Comores ». */
const PLURIELS = new Set([
"Comores", "États-Unis", "Émirats arabes unis", "Pays-Bas", "Philippines",
"Seychelles", "Maldives", "Bahamas", "Fidji", "Îles Salomon", "Palaos",
"Samoa", "Tonga"
]);

/** Îles féminines : « à la Jamaïque » et non « en Jamaïque ». */
const ILES_FEMININES = new Set([
"Jamaïque", "Barbade", "Dominique", "Grenade"
]);

/** Masculins malgré le -e final : « le Mexique », « au Cambodge ». */
const MASCULINS_EN_E = new Set([
"Mexique", "Mozambique", "Zimbabwe", "Cambodge", "Suriname", "Belize",
// « Royaume-Uni » : c'est « Royaume » qui porte le genre, et il finit
// par un -e sans être féminin — « le Royaume-Uni », jamais « la ».
"Royaume"
]);

/**
* « en Israël » et non « à Israël » : une initiale vocalique appelle
* « en » même sans article. Seule exception au locatif des pays sans
* article — écrite ici plutôt que devinée, parce qu'elle est unique.
*/
const LOCATIF_EXCEPTION = { "Israël": "en", "Haïti": "en" };

/**
* LE NOM QUI PORTE LE GENRE, et lui seul.
*
* « Corée du Sud » finit par « d » : la règle du -e final en aurait fait
* un masculin (« le Corée du Sud »). C'est « Corée » qui porte le genre,
* pas le complément qui la situe. Même chose pour « Guinée-Bissau »
* (« la Guinée-Bissau »), « Afrique du Sud », « Nouvelle-Zélande »,
* « Birmanie (Myanmar) » ou « Congo (RDC) ».
*/
function tete(nom) {
return String(nom)
.replace(/\s*\(.*$/, "")
.split(/\s+(?:du|de|des|d')\s+/)[0]
.split("-")[0]
.trim();
}

function sansAccents(valeur) {
return String(valeur || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/** La famille grammaticale d'un nom canonique de pays. */
function familleDe(nomCanonique) {

if (PLURIELS.has(nomCanonique)) return "p";
if (SANS_ARTICLE.has(nomCanonique)) return "z";
if (ILES_FEMININES.has(nomCanonique)) return "i";

const noyau = tete(nomCanonique);

// L'initiale est lue SANS ses accents : « Égypte », « Émirats » et
// « Éthiopie » commencent bien par une voyelle. Le « y » n'en est pas
// une ici : « le Yémen », jamais « l'Yémen ».
if (/^[aeiou]/i.test(sansAccents(noyau))) return "v";

if (noyau.endsWith("e") && !MASCULINS_EN_E.has(noyau)) return "f";

return "m";

}

/**
* Les trois formes d'un pays, ou null s'il est inconnu.
* @returns {{nom:string, article:string, locatif:string, provenance:string}|null}
*/
export function formesDePays(nom) {

const pays = findCountry(nom);
if (!pays) return null;

const formes = FORMES[familleDe(pays.name)];

return {
nom: pays.name,
article: formes.article,
locatif: LOCATIF_EXCEPTION[pays.name] || formes.locatif,
provenance: formes.provenance
};

}

/**
* Colle une forme à un nom : « l' » sans espace, les autres avec.
*
* L'ÉLISION DE « de » est traitée ici et pas dans la table : « de » +
* Israël donne « d'Israël », « de » + Oman donne « d'Oman », « de » +
* Haïti donne « d'Haïti » (h muet). Trois pays seulement, mais « de
* Israël » se lit comme une faute de frappe — et la règle vaudra pour
* le prochain pays sans article à initiale vocalique qu'on ajoutera.
*/
function coller(forme, nom) {
if (!forme) return nom;
if (forme === "de" && /^[aeiouh]/i.test(sansAccents(nom))) return `d'${nom}`;
return forme.endsWith("'") ? `${forme}${nom}` : `${forme} ${nom}`;
}

/**
* « le Sénégal », « la Côte d'Ivoire », « l'Allemagne », « les
* États-Unis », « Madagascar ». Le nom est rendu SOUS SA FORME SAISIE
* quand le pays est inconnu — jamais précédé d'un article deviné.
*/
export function avecArticle(nom) {
const f = formesDePays(nom);
if (!f) return String(nom || "").trim();
return coller(f.article, f.nom);
}

/**
* « au Sénégal », « en Côte d'Ivoire », « aux États-Unis », « à
* Madagascar » — la forme d'« Étudier … » ou « vérifié … ».
*/
export function auPays(nom) {
const f = formesDePays(nom);
if (!f) return String(nom || "").trim();
return coller(f.locatif, f.nom);
}

/**
* « du Sénégal », « de la Guinée », « de l'Allemagne », « des
* États-Unis », « de Madagascar » — la forme de « les ressortissants … ».
*/
export function duPays(nom) {
const f = formesDePays(nom);
if (!f) return String(nom || "").trim();
return coller(f.provenance, f.nom);
}

/** Tous les pays connus, pour les tests et les inventaires. */
export function paysConnus() {
return COUNTRIES.map((c) => c.name);
}
