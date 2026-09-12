/**
* ============================================================
* FitzUniverse — éligibilité par nationalité
* ============================================================
*
* Créé le 2026-08-30, après le lot 19. Constat qui l'a imposé : le
* catalogue ne portait AUCUNE restriction de nationalité. Un étudiant
* sénégalais voyait — et pouvait se voir recommander — les bourses
* Commonwealth et GREAT du Royaume-Uni, auxquelles il ne peut pas
* candidater, le Sénégal n'étant pas membre du Commonwealth. Le
* commentaire de eligibility-ai.js:465 (« aucune bourse du catalogue
* n'a encore de restriction de nationalité en base ») décrivait déjà
* ce trou.
*
* POURQUOI DES CODES ISO ET PAS DES NOMS DE PAYS
* ----------------------------------------------
* Les sources officielles ne s'accordent pas sur l'orthographe :
* l'OCDE écrit « Cabo Verde », « Nigéria », « Libéria », « Türkiye » ;
* la BAD écrit « Cabo Verde », « Nigeria », « Liberia » ; et
* js/countries.js — le référentiel de CE site — écrit « Cap-Vert »,
* « Nigeria », « Liberia », « Turquie ». Comparer des noms produirait
* des faux négatifs silencieux, exactement le défaut que countries.js
* avait été créé pour supprimer sur les champs de profil.
*
* Les groupes ci-dessous sont donc des listes de codes ISO 3166-1
* alpha-2, et la nationalité saisie par l'étudiant (texte libre avec
* datalist) est résolue en code par le même référentiel countries.js.
*
* SOURCES ET DATES DE VÉRIFICATION (30/08/2026)
* ---------------------------------------------
* - Commonwealth : thecommonwealth.org/our-member-countries — 56
*   membres. Gabon rétabli membre de plein droit le 15/07/2025 après
*   la suspension de 2023 ; Gabon et Togo ont adhéré en 2022 ; le
*   Zimbabwe n'est PAS membre (retrait en 2003), ne pas l'ajouter.
* - BID/IsDB : isdb.org/isdb-member-countries — 57 États membres.
* - BAD, membres régionaux : afdb.org/en/countries — 54 pays, soit
*   les 54 États africains membres de l'ONU.
* - Liste CAD de l'OCDE : webfs.oecd.org/oda/DAClists/ — version
*   « flux 2025 » (PDF du 11/04/2025), 141 pays et territoires. AUCUNE
*   liste 2026-2027 n'était publiée au 30/08/2026 : le répertoire
*   officiel s'arrête à 2025. Réserves connues de cette version :
*   Nauru gradué au 01/01/2026, Guyana, Panama et Montserrat proposés
*   à la graduation lors de la revue 2026. Aucun ne concerne l'Afrique
*   — le cas d'usage principal du site n'est donc pas affecté.
*
* PIÈGES À CONNAÎTRE
* ------------------
* - Trois pays d'Afrique de l'Ouest ne sont PAS membres de la BID :
*   Cap-Vert, Ghana, Liberia. C'est l'erreur la plus probable sur une
*   bourse BID.
* - Cinq pays d'Afrique de l'Ouest seulement sont au Commonwealth :
*   Gambie, Ghana, Nigeria, Sierra Leone, Togo.
* - Ne jamais filtrer « Afrique de l'Ouest » sur le découpage régional
*   de la BAD : elle classe la Mauritanie en Afrique du Nord et
*   Sao Tomé-et-Principe en Afrique australe.
* - La liste CAD contient des TERRITOIRES et non des États (Tokélaou,
*   Niue, Wallis-et-Futuna, Sainte-Hélène, Montserrat, Kosovo,
*   Cisjordanie et bande de Gaza). Un test par nationalité ne peut pas
*   les traiter comme des pays de citoyenneté.
* ============================================================
*/

import { COUNTRIES } from "./countries.js";
import { duPays } from "./pays-grammaire.js";

// ------------------------------------------------------------
// Groupes de pays, en codes ISO 3166-1 alpha-2
// ------------------------------------------------------------

/** Commonwealth of Nations — 56 membres (30/08/2026). */
export const COMMONWEALTH = [
"ZA","AG","AU","BS","BD","BB","BZ","BW","BN","CM","CA","CY","DM","SZ","FJ","GA",
"GM","GH","GD","GY","IN","JM","KE","KI","LS","MY","MW","MV","MT","MU","MZ","NA",
"NR","NG","NZ","UG","PK","PG","GB","RW","KN","LC","VC","SB","WS","SC","SL","SG",
"LK","TZ","TG","TO","TT","TV","VU","ZM"
];

/** Banque islamique de développement — 57 États membres (30/08/2026). */
export const BID = [
"AF","AL","DZ","SA","AZ","BH","BD","BJ","BN","BF","CM","KM","CI","DJ","EG","AE",
"GA","GM","GN","GW","GY","ID","IQ","IR","JO","KZ","KG","KW","LB","LY","MY","MV",
"ML","MA","MR","MZ","NE","NG","OM","UG","UZ","PK","PS","QA","SN","SL","SO","SD",
"SR","SY","TJ","TD","TG","TN","TM","TR","YE"
];

/** Pays membres RÉGIONAUX de la BAD — les 54 États africains (30/08/2026). */
export const AFRIQUE = [
"DZ","AO","BJ","BW","BF","BI","CV","CM","CF","TD","KM","CG","CD","CI","DJ","EG",
"GQ","ER","SZ","ET","GA","GM","GH","GN","GW","KE","LS","LR","LY","MG","MW","ML",
"MR","MU","MA","MZ","NA","NE","NG","RW","ST","SN","SC","SL","SO","ZA","SS","SD",
"TZ","TG","TN","UG","ZM","ZW"
];

/** Liste CAD de l'OCDE — pays les moins avancés (PMA), 44. */
export const CAD_PMA = [
"AF","AO","BD","BJ","BF","BI","KH","CF","TD","KM","CD","DJ","ER","ET","GM","GN",
"GW","HT","KI","LA","LS","LR","MG","MW","ML","MR","MZ","MM","NP","NE","RW","SN",
"SL","SB","SO","SS","SD","TZ","TL","TG","TV","UG","YE","ZM"
];

/** Liste CAD — revenu faible hors PMA (2), revenu intermédiaire inférieur (36)
 *  et supérieur (59). Réunis à CAD_PMA, ils forment les 141 bénéficiaires. */
const CAD_AUTRES = [
// revenu faible non-PMA
"KP","SY",
// revenu intermédiaire, tranche inférieure
"DZ","BT","BO","CV","CM","CG","CI","EG","SZ","GH","HN","IN","IR","JO","KE","KG",
"LB","FM","MN","MA","NI","NG","PK","PG","PH","WS","ST","LK","TJ","TK","TN","UA",
"UZ","VU","VN","ZW",
// revenu intermédiaire, tranche supérieure
"AL","AR","AM","AZ","BY","BZ","BA","BW","BR","CN","CO","CR","CU","DM","DO","EC",
"SV","GQ","FJ","GA","GE","GD","GT","GY","ID","IQ","JM","KZ","XK","LY","MY","MV",
"MH","MU","MX","MD","ME","MS","NA","NR","NU","MK","PW","PA","PY","PE","SH","LC",
"VC","RS","ZA","SR","TH","TO","TR","TM","VE","WF","PS"
];

/** Liste CAD de l'OCDE, version « flux 2025 » — 141 pays et territoires. */
export const CAD_APD = [...CAD_PMA, ...CAD_AUTRES];

/**
* Les 16 pays d'Afrique de l'Ouest, au sens usuel (CEDEAO élargie à la
* Mauritanie). Sert aux libellés du produit, jamais à une éligibilité
* officielle — aucun bailleur ne définit sa liste ainsi.
*/
export const AFRIQUE_OUEST = [
"BJ","BF","CV","CI","GM","GH","GN","GW","LR","ML","MR","NE","NG","SN","SL","TG"
];

/** Table des groupes adressables depuis un document Firestore. */
export const GROUPES = {
commonwealth: { label: "Pays du Commonwealth", codes: COMMONWEALTH },
bid: { label: "États membres de la Banque islamique de développement", codes: BID },
afrique: { label: "Pays d'Afrique", codes: AFRIQUE },
"cad-apd": { label: "Bénéficiaires de l'aide au développement (liste CAD de l'OCDE)", codes: CAD_APD },
"cad-pma": { label: "Pays les moins avancés (liste CAD de l'OCDE)", codes: CAD_PMA },
"afrique-ouest": { label: "Pays d'Afrique de l'Ouest", codes: AFRIQUE_OUEST }
};

// ------------------------------------------------------------
// Résolution d'une nationalité saisie en texte libre
// ------------------------------------------------------------

function normalize(str) {
return String(str || "")
.normalize("NFD")
.replace(/[̀-ͯ]/g, "")
.toLowerCase()
.replace(/[^a-z0-9]+/g, " ")
.trim();
}

const PAR_NOM = new Map();
for (const c of COUNTRIES) PAR_NOM.set(normalize(c.name), c.iso);

/**
* Quelques graphies que l'étudiant ou une source officielle peut
* employer et qui n'existent pas dans countries.js. Volontairement
* court : on corrige les écarts CONNUS, on ne devine pas.
*/
const ALIAS = {
"cabo verde": "CV", "cap vert": "CV",
"turkiye": "TR", "turkey": "TR",
"nigeria": "NG", "nigeria ": "NG",
"liberia": "LR",
"sao tome et principe": "ST", "sao tome and principe": "ST",
"republique democratique du congo": "CD", "rdc": "CD", "congo kinshasa": "CD",
"congo brazzaville": "CG", "republique du congo": "CG",
"birmanie": "MM", "myanmar": "MM",
"cisjordanie et bande de gaza": "PS", "palestine": "PS",
"eswatini": "SZ", "swaziland": "SZ",
"cote d ivoire": "CI", "ivory coast": "CI",
"royaume uni": "GB", "grande bretagne": "GB",
"etats unis": "US",

// GRAPHIES DU QUESTIONNAIRE (ajoutées le 2026-09-05).
// La liste PAYS_DU_MONDE de js/eligibility-pistes.js — celle que
// l'étudiant voit et clique — écrit deux pays autrement que le
// référentiel : « Vietnam » (référentiel : « Viêt Nam ») et
// « Congo (République du) » (référentiel : « Congo (Brazzaville) »).
// Un pays non résolu rend estEligible() muet : l'étudiant n'est ni
// retenu ni exclu, et TOUTES les bourses réservées lui restent
// affichées. Le défaut ne se voit nulle part — il rend juste les
// recommandations identiques pour tout le monde.
"vietnam": "VN", "viet nam": "VN",
"congo republique du": "CG", "republique du congo brazzaville": "CG",

// Les six pays que le questionnaire propose et que le référentiel
// n'avait pas. Trois sont membres du Commonwealth (AG, KN, VC) et
// trois figurent sur la liste CAD (VC, MH, XK) : sans eux, un candidat
// d'Antigua-et-Barbuda n'était PAS reconnu éligible aux bourses du
// Commonwealth qui lui sont pourtant ouvertes.
"antigua et barbuda": "AG",
"saint kitts et nevis": "KN",
"saint vincent et les grenadines": "VC",
"iles marshall": "MH",
"kosovo": "XK",
"taiwan": "TW"
};

/**
* Convertit une nationalité écrite par l'étudiant en code ISO.
* @param {string} nom — texte libre ("Sénégal", "senegal", "SN"…)
* @returns {string|null} code ISO alpha-2, ou null si non résolu.
*/
export function isoDeNationalite(nom) {
if (!nom) return null;
const brut = String(nom).trim();
if (/^[A-Za-z]{2}$/.test(brut)) {
const code = brut.toUpperCase();
return COUNTRIES.some((c) => c.iso === code) ? code : null;
}
const clef = normalize(brut);
return PAR_NOM.get(clef) || ALIAS[clef] || null;
}

// ------------------------------------------------------------
// Test d'éligibilité
// ------------------------------------------------------------

/**
* Résout le champ `eligibility` d'une bourse en ensemble de codes ISO.
*
* Forme attendue du champ, tous les membres étant facultatifs :
*   {
*     scope: "monde" | "groupes" | "liste",
*     groups: ["commonwealth"],   // ids de GROUPES
*     include: ["SN","ML"],       // codes ISO ajoutés au-delà des groupes
*     exclude: ["GH"],            // codes ISO retirés
*     note: "phrase courte affichée telle quelle"
*   }
*
* @returns {Set<string>|null} — null signifie « ouverte au monde entier »
* ou « restriction non renseignée » : dans les deux cas on n'exclut personne.
*/
export function paysEligibles(eligibility) {
if (!eligibility || typeof eligibility !== "object") return null;
if (eligibility.scope === "monde") return null;

const codes = new Set();
for (const g of eligibility.groups || []) {
const groupe = GROUPES[g];
if (groupe) groupe.codes.forEach((c) => codes.add(c));
}
for (const c of eligibility.include || []) codes.add(String(c).toUpperCase());
for (const c of eligibility.exclude || []) codes.delete(String(c).toUpperCase());

return codes.size ? codes : null;
}

/**
* Un étudiant d'une nationalité donnée peut-il candidater à cette bourse ?
*
* RÈGLE DE PRUDENCE, à ne pas assouplir : on ne répond "non" que si la
* bourse porte une restriction EXPLICITE et que la nationalité a pu être
* résolue. Restriction absente, nationalité vide sur une bourse
* restreinte, ou pays inconnu du référentiel renvoient tous "inconnu" —
* jamais "non". Mieux vaut laisser un étudiant vérifier lui-même que lui
* cacher à tort une opportunité.
*
* @returns {true|false|null} — true éligible (deux cas : liste explicite
* contenant le pays, OU scope:"monde" — une affirmation d'ouverture posée
* par l'auteur du lot, valable quelle que soit la nationalité) ; false
* exclu ; null indéterminé.
*/
export function estEligible(eligibility, nationalite) {
// scope:"monde" est une AFFIRMATION d'ouverture, pas une absence
// d'information. paysEligibles() renvoie null dans les deux cas — c'est
// ici, et seulement ici, qu'il faut les distinguer. Placé AVANT la
// résolution de la nationalité : l'ouverture d'une bourse ne dépend pas
// de notre capacité à reconnaître le pays saisi.
if (eligibility && eligibility.scope === "monde") return true;
const autorises = paysEligibles(eligibility);
if (!autorises) return null;
const iso = isoDeNationalite(nationalite);
if (!iso) return null;
return autorises.has(iso);
}

// ------------------------------------------------------------
// Libellés d'affichage
// ------------------------------------------------------------

/**
* « du Sénégal », « de la France », « de l'Algérie », « des Comores »,
* « de Madagascar » — pour composer « Non ouverte aux ressortissants … ».
*
* Lot VITRINE-COMMERCIALE (2026-09-11) : les trois listes d'exception et
* l'heuristique voyelle/-e final qui vivaient ici ont rejoint
* js/pays-grammaire.js, le SEUL module qui accorde un article à un pays
* — il donne aussi « au / en / aux » et « le / la / l' / les ». Le nom
* de cette fonction est gardé pour ses appelants (details.js,
* scholarships.js, catalogue-vue.js) ; elle n'est plus qu'un relais.
* Un pays inconnu revient NU, sans article deviné.
*/
export function paysAvecArticle(nom) {
return duPays(nom);
}

/**
* Phrase courte à afficher sous une bourse, ou null s'il n'y a rien de
* fiable à dire. Utilise `note` si l'auteur en a écrit une, sinon dérive
* le libellé du groupe.
*/
export function libelleEligibilite(eligibility) {
if (!eligibility || typeof eligibility !== "object") return null;
if (eligibility.note) return eligibility.note;
if (eligibility.scope === "monde") return "Ouverte à toutes les nationalités.";
const labels = (eligibility.groups || []).map((g) => GROUPES[g] && GROUPES[g].label).filter(Boolean);
if (labels.length) return `Réservée aux ${labels.join(", ")}.`;
if ((eligibility.include || []).length) return "Liste de nationalités éligibles restreinte — voir les critères.";
return null;
}
