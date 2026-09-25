/**
* ============================================================
* LES MONTANTS EN F CFA, À TITRE INDICATIF (2026-09-25)
* ============================================================
*
* Le test « Moussa » (claude/test-etudiant-moussa-2026-09-25.md) :
* un étudiant qui saisit 200 000 F CFA par mois lit « de 2 000 USD à
* 14 850 USD, auxquels s'ajoutent 16 818 TL » et ne sait pas si sa
* famille peut payer. Charles : « fais toutes les corrections ».
*
* LA RÈGLE, QUI N'ABÎME PAS L'ANCIENNE. Le dépôt refusait tout taux de
* change parce qu'un taux vieillit tout seul. On le garde pour ce qui
* décide (seuils, totaux légaux) quand la parité est fixe (F CFA et
* euro, 655,957). Pour les autres devises, le montant officiel reste
* affiché tel quel, et on lui ajoute une traduction en F CFA :
*   - toujours précédée de « environ » ;
*   - au taux de référence d'une banque centrale, daté et sourcé
*     (BCE pour le dollar, la livre turque, le leu, le dollar canadien,
*     le yuan et le ringgit ; Bank Al-Maghrib pour le dirham) ;
*   - arrondie au millier : la précision d'un taux du jour n'est pas
*     celle d'un montant officiel.
*
* À RELIRE CHAQUE MOIS : les taux ci-dessous, et leur date.
* ============================================================
*/

/** Parité légale et fixe F CFA ↔ euro. */
export const PARITE_EUR_XOF = 655.957;

export const TAUX_INDICATIFS = {
date: "2026-09-25",
// Unités de la devise pour 1 euro.
parEuro: {
USD: 1.1403,
TRY: 55.7975,
RON: 5.2765,
CAD: 1.6127,
CNY: 7.6551,
MYR: 4.6456,
MAD: 10.9394
},
sources: {
bce: "https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html",
bam: "https://www.bkam.ma/Marches/Principaux-indicateurs/Marche-des-changes/Cours-de-change/Cours-de-reference"
}
};

const NBSP = "\u00a0";

/** Le montant en F CFA (nombre), ou null si la devise n'a pas de taux. */
export function enFcfa(montant, devise) {
const n = Number(montant);
if (!Number.isFinite(n)) return null;
const d = String(devise || "").toUpperCase();
if (d === "XOF") return n;
if (d === "EUR") return n * PARITE_EUR_XOF;
const taux = TAUX_INDICATIFS.parEuro[d];
if (!taux) return null;
return (n / taux) * PARITE_EUR_XOF;
}

/** Vrai quand la conversion est exacte (parité fixe), faux quand elle est indicative. */
export function conversionExacte(devise) {
const d = String(devise || "").toUpperCase();
return d === "XOF" || d === "EUR";
}

function groupes(n) {
return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
}

/**
* « 1 312 000 F CFA » : arrondi au millier (à l'unité sous 10 000 F).
* @param {number} xof
*/
export function formatFcfa(xof) {
const n = Number(xof);
if (!Number.isFinite(n)) return "";
const arrondi = Math.abs(n) >= 10000 ? Math.round(n / 1000) * 1000 : Math.round(n);
return `${groupes(arrondi)}${NBSP}F${NBSP}CFA`;
}

/** « 1,3 million de F CFA », « 850 000 F CFA » : pour une puce courte. */
export function formatFcfaCourt(xof) {
const n = Number(xof);
if (!Number.isFinite(n)) return "";
if (Math.abs(n) >= 1e6) {
const m = Math.round(n / 1e5) / 10;
const texte = m.toLocaleString("fr-FR", { maximumFractionDigits: 1 });
return `${texte}${NBSP}${m >= 2 ? "millions" : "million"} de F${NBSP}CFA`;
}
return formatFcfa(n);
}

/** « 25 septembre 2026 ». */
export function dateDesTaux() {
const [a, m, j] = TAUX_INDICATIFS.date.split("-").map(Number);
const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
return `${j}${NBSP}${MOIS[m - 1]}${NBSP}${a}`;
}

/** La mention qui accompagne tout montant converti à un taux du jour. */
export function mentionTaux() {
return `au taux de référence du ${dateDesTaux()}`;
}

/**
* « environ 1 312 000 F CFA » pour un montant d'une autre devise ;
* le montant exact pour l'euro ; "" pour le F CFA lui-même ou une
* devise sans taux.
* @param {{court?: boolean}} [options]
*/
export function equivalentFcfa(montant, devise, { court = false } = {}) {
const d = String(devise || "").toUpperCase();
if (d === "XOF") return "";
const xof = enFcfa(montant, d);
if (xof === null) return "";
const texte = court ? formatFcfaCourt(xof) : formatFcfa(xof);
return conversionExacte(d) ? texte : `environ ${texte}`;
}

/** La même chose pour une fourchette : « environ 1 199 000 à 8 542 000 F CFA ». */
export function equivalentFcfaFourchette(min, max, devise) {
const d = String(devise || "").toUpperCase();
if (d === "XOF") return "";
const a = enFcfa(min, d);
const b = enFcfa(max, d);
if (a === null || b === null) return "";
const corps = Math.round(a / 1000) === Math.round(b / 1000) ? formatFcfa(a) : `${formatFcfa(a).replace(`${NBSP}F${NBSP}CFA`, "")} à ${formatFcfa(b)}`;
return conversionExacte(d) ? corps : `environ ${corps}`;
}

/** Symbole → code de devise, tels qu'ils s'écrivent dans les textes du site. */
const SYMBOLES_TEXTE = [["€", "EUR"], ["USD", "USD"], ["TL", "TRY"], ["$ CA", "CAD"], ["RM", "MYR"], ["lei", "RON"], ["MAD", "MAD"], ["DH", "MAD"], ["CNY", "CNY"], ["yuans", "CNY"], ["yuan", "CNY"]];
const RE_MONTANT = /(\d{1,3}(?:[ \u00a0\u202f]\d{3})*(?:,\d{1,2})?)[ \u00a0\u202f]?(€|USD|TL|\$[ \u00a0\u202f]?CA|RM|lei|MAD|DH|CNY|yuans?)(?![A-Za-zÀ-ÿ])/g;

/**
* Les montants d'un texte officiel, redits en F CFA (lot 102, 2026-09-25) :
* le texte reste tel quel, la traduction vient à côté. Au plus six montants,
* sans doublon ; rien pour un texte sans montant ni pour le F CFA lui-même.
* @returns {string} « En F CFA : 2 000 USD ≈ 1 150 000 F CFA ; … (au taux de référence du …). » ou ""
*/
export function montantsEnFcfa(texte) {
const vus = new Set();
const morceaux = [];
let indicatif = false;
for (const m of String(texte || "").matchAll(RE_MONTANT)) {
const brut = m[0].replace(/[ \u202f]/g, NBSP);
if (vus.has(brut) || morceaux.length >= 6) continue;
vus.add(brut);
const symbole = m[2].replace(/[ \u00a0\u202f]/g, " ");
const devise = (SYMBOLES_TEXTE.find(([sym]) => sym === symbole) || [])[1];
const nombre = Number(m[1].replace(/[ \u00a0\u202f]/g, "").replace(",", "."));
const xof = devise ? enFcfa(nombre, devise) : null;
if (xof === null || !(nombre > 0)) continue;
const exacte = conversionExacte(devise);
if (!exacte) indicatif = true;
// L'euro se redit exactement (parité fixe), au franc près ; le reste, arrondi.
morceaux.push(exacte ? `${brut} = ${groupes(xof)}${NBSP}F${NBSP}CFA` : `${brut} ≈ ${formatFcfa(xof)}`);
}
if (!morceaux.length) return "";
return `En F${NBSP}CFA${NBSP}: ${morceaux.join(" ; ")}${indicatif ? ` (${mentionTaux()})` : ""}.`;
}
