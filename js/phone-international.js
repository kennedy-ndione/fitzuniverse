/**
* ============================================================
* Fitz — numéro de téléphone international
* ============================================================
*
* « N'oublie pas que tout étudiant, où qu'il soit, avec le numéro du
* pays où il se trouve, doit pouvoir utiliser le site. »
*
* Avant ce fichier, le profil demandait le téléphone et le WhatsApp
* dans deux `<input type="tel">` nus : aucun indicatif, aucune
* validation, aucun format. Un étudiant à Dakar saisissait
* « 77 123 45 67 », un autre à Montréal « (514) 555-0123 », et les
* deux étaient enregistrés tels quels. Résultat : deux numéros qu'on
* ne peut ni appeler, ni utiliser pour ouvrir une conversation
* WhatsApp, ni même comparer — alors que le site en dépend pour
* joindre un étudiant accompagné.
*
* CE QUE CE MODULE GARANTIT
* -------------------------
*  — l'étudiant saisit son numéro COMME IL LE CONNAÎT, sans indicatif
*    et sans se demander s'il faut garder le zéro initial ;
*  — Fitz enregistre du E.164 (« +221771234567 »), le seul
*    format qu'un opérateur, une passerelle SMS ou wa.me acceptent ;
*  — le pays est présélectionné à partir du pays de résidence déjà
*    saisi dans le profil : dans l'immense majorité des cas,
*    l'étudiant n'a rien à choisir du tout.
*
* POURQUOI PAS DE DRAPEAUX DANS LE SÉLECTEUR
* ------------------------------------------
* Les drapeaux en emoji ne s'affichent pas sous Windows — le système
* n'embarque pas ces glyphes et rend « 🇸🇳 » sous la forme des deux
* lettres « SN ». Quant aux fichiers SVG, il en faudrait 88 alors
* qu'assets/flags/ en compte 17. Le nom du pays et son indicatif
* suffisent, et se lisent partout.
*
* CE QUI EST VOLONTAIREMENT SIMPLE
* --------------------------------
* La validation vérifie la LONGUEUR nationale, pas le préfixe
* d'opérateur. Un vrai contrôle (libphonenumber) pèse plusieurs
* centaines de kilo-octets et se périme à chaque nouvelle plage
* attribuée. La longueur attrape ce qu'il faut attraper — un chiffre
* oublié, un numéro collé avec son indicatif, un champ à moitié
* rempli — sans jamais refuser un numéro valide parce que sa plage
* est trop récente. En cas de doute, on laisse passer : refuser le
* numéro d'un étudiant qui est le bon est bien pire que d'accepter
* un numéro douteux.
* ============================================================
*/

/**
* `longueurs` : nombre de chiffres du numéro NATIONAL tel qu'il est
* réellement composé. Plusieurs valeurs quand le pays en admet
* plusieurs.
*
* `exemple` : sert de placeholder — un étudiant reconnaît la forme de
* son propre numéro bien plus vite qu'il ne lit une consigne.
*
* `zeroSignificatif` : LE PIÈGE DE CE FICHIER.
* ---------------------------------------------
* On lit partout qu'il faut retirer le zéro initial avant de composer
* un numéro international. C'est vrai en France (« 06 12 34 56 78 »
* s'appelle « +33 6 12 34 56 78 »), au Maroc, en Algérie, au
* Royaume-Uni : ce zéro y est un préfixe d'acheminement national, sans
* existence hors du pays.
*
* Ce n'est PAS vrai partout — et notamment pas dans trois pays du
* public prioritaire de Fitz. En Côte d'Ivoire depuis la
* renumérotation de 2021, au Gabon et au Congo-Brazzaville, ce zéro
* fait partie du numéro : « +225 07 12 34 56 78 » se compose bien
* avec son zéro. L'Italie est dans le même cas pour ses fixes.
*
* Appliquer la règle française à ces pays produit un E.164 amputé
* d'un chiffre — un numéro qui a l'air correct, qui est enregistré
* sans erreur, et qui ne sonnera jamais. C'est exactement le genre de
* défaut que personne ne remarque avant d'avoir essayé d'appeler un
* étudiant.
*
* Les tests vérifient que l'exemple de CHAQUE pays passe sa propre
* validation : c'est ce contrôle qui a révélé les trois cas.
*/
export const PAYS_TELEPHONE = [
// Afrique francophone et Maghreb — le public prioritaire de Fitz.
{ iso:"SN", nom:"Sénégal", indicatif:"221", longueurs:[9], exemple:"77 123 45 67" },
{ iso:"CI", nom:"Côte d'Ivoire", indicatif:"225", longueurs:[10], exemple:"07 12 34 56 78", zeroSignificatif:true },
{ iso:"ML", nom:"Mali", indicatif:"223", longueurs:[8], exemple:"70 12 34 56" },
{ iso:"BF", nom:"Burkina Faso", indicatif:"226", longueurs:[8], exemple:"70 12 34 56" },
{ iso:"NE", nom:"Niger", indicatif:"227", longueurs:[8], exemple:"90 12 34 56" },
{ iso:"GN", nom:"Guinée", indicatif:"224", longueurs:[9], exemple:"620 12 34 56" },
{ iso:"BJ", nom:"Bénin", indicatif:"229", longueurs:[8,10], exemple:"90 12 34 56" },
{ iso:"TG", nom:"Togo", indicatif:"228", longueurs:[8], exemple:"90 12 34 56" },
{ iso:"CM", nom:"Cameroun", indicatif:"237", longueurs:[9], exemple:"6 71 23 45 67" },
{ iso:"GA", nom:"Gabon", indicatif:"241", longueurs:[8,9], exemple:"06 12 34 56", zeroSignificatif:true },
{ iso:"CG", nom:"Congo-Brazzaville", indicatif:"242", longueurs:[9], exemple:"06 123 4567", zeroSignificatif:true },
{ iso:"CD", nom:"République démocratique du Congo", indicatif:"243", longueurs:[9], exemple:"81 234 5678" },
{ iso:"TD", nom:"Tchad", indicatif:"235", longueurs:[8], exemple:"66 12 34 56" },
{ iso:"CF", nom:"République centrafricaine", indicatif:"236", longueurs:[8], exemple:"70 12 34 56" },
{ iso:"MR", nom:"Mauritanie", indicatif:"222", longueurs:[8], exemple:"22 12 34 56" },
{ iso:"MG", nom:"Madagascar", indicatif:"261", longueurs:[9], exemple:"32 12 345 67" },
{ iso:"BI", nom:"Burundi", indicatif:"257", longueurs:[8], exemple:"79 12 34 56" },
{ iso:"RW", nom:"Rwanda", indicatif:"250", longueurs:[9], exemple:"78 123 4567" },
{ iso:"DJ", nom:"Djibouti", indicatif:"253", longueurs:[8], exemple:"77 12 34 56" },
{ iso:"KM", nom:"Comores", indicatif:"269", longueurs:[7], exemple:"321 23 45" },
{ iso:"GQ", nom:"Guinée équatoriale", indicatif:"240", longueurs:[9], exemple:"222 123 456" },

// Le reste du monde, par ordre alphabétique.
{ iso:"ZA", nom:"Afrique du Sud", indicatif:"27", longueurs:[9], exemple:"71 234 5678" },
{ iso:"DZ", nom:"Algérie", indicatif:"213", longueurs:[9], exemple:"5 51 23 45 67" },
{ iso:"DE", nom:"Allemagne", indicatif:"49", longueurs:[10,11], exemple:"1512 3456789" },
{ iso:"AO", nom:"Angola", indicatif:"244", longueurs:[9], exemple:"923 123 456" },
{ iso:"SA", nom:"Arabie saoudite", indicatif:"966", longueurs:[9], exemple:"51 234 5678" },
{ iso:"AR", nom:"Argentine", indicatif:"54", longueurs:[10], exemple:"11 2345 6789" },
{ iso:"AU", nom:"Australie", indicatif:"61", longueurs:[9], exemple:"412 345 678" },
{ iso:"AT", nom:"Autriche", indicatif:"43", longueurs:[10,11], exemple:"664 1234567" },
{ iso:"BE", nom:"Belgique", indicatif:"32", longueurs:[9], exemple:"470 12 34 56" },
{ iso:"BW", nom:"Botswana", indicatif:"267", longueurs:[8], exemple:"71 123 456" },
{ iso:"BR", nom:"Brésil", indicatif:"55", longueurs:[10,11], exemple:"11 96123 4567" },
{ iso:"CA", nom:"Canada", indicatif:"1", longueurs:[10], exemple:"514 555 0123" },
{ iso:"CV", nom:"Cap-Vert", indicatif:"238", longueurs:[7], exemple:"991 12 34" },
{ iso:"CN", nom:"Chine", indicatif:"86", longueurs:[11], exemple:"131 2345 6789" },
{ iso:"KR", nom:"Corée du Sud", indicatif:"82", longueurs:[9,10], exemple:"10 1234 5678" },
{ iso:"DK", nom:"Danemark", indicatif:"45", longueurs:[8], exemple:"32 12 34 56" },
{ iso:"EG", nom:"Égypte", indicatif:"20", longueurs:[10], exemple:"10 1234 5678" },
{ iso:"AE", nom:"Émirats arabes unis", indicatif:"971", longueurs:[9], exemple:"50 123 4567" },
{ iso:"ES", nom:"Espagne", indicatif:"34", longueurs:[9], exemple:"612 34 56 78" },
{ iso:"US", nom:"États-Unis", indicatif:"1", longueurs:[10], exemple:"212 555 0123" },
{ iso:"ET", nom:"Éthiopie", indicatif:"251", longueurs:[9], exemple:"91 123 4567" },
{ iso:"FI", nom:"Finlande", indicatif:"358", longueurs:[9,10], exemple:"41 2345678" },
{ iso:"FR", nom:"France", indicatif:"33", longueurs:[9], exemple:"6 12 34 56 78" },
{ iso:"GM", nom:"Gambie", indicatif:"220", longueurs:[7], exemple:"301 2345" },
{ iso:"GH", nom:"Ghana", indicatif:"233", longueurs:[9], exemple:"24 123 4567" },
{ iso:"GW", nom:"Guinée-Bissau", indicatif:"245", longueurs:[7,9], exemple:"955 012 345" },
{ iso:"HT", nom:"Haïti", indicatif:"509", longueurs:[8], exemple:"34 10 1234" },
{ iso:"HU", nom:"Hongrie", indicatif:"36", longueurs:[9], exemple:"20 123 4567" },
{ iso:"IN", nom:"Inde", indicatif:"91", longueurs:[10], exemple:"81234 56789" },
{ iso:"IE", nom:"Irlande", indicatif:"353", longueurs:[9], exemple:"85 012 3456" },
{ iso:"IT", nom:"Italie", indicatif:"39", longueurs:[9,10], exemple:"312 345 6789", zeroSignificatif:true },
{ iso:"JP", nom:"Japon", indicatif:"81", longueurs:[10], exemple:"90 1234 5678" },
{ iso:"JO", nom:"Jordanie", indicatif:"962", longueurs:[9], exemple:"79 012 3456" },
{ iso:"KE", nom:"Kenya", indicatif:"254", longueurs:[9], exemple:"712 345 678" },
{ iso:"LB", nom:"Liban", indicatif:"961", longueurs:[7,8], exemple:"71 123 456" },
{ iso:"LR", nom:"Libéria", indicatif:"231", longueurs:[8,9], exemple:"77 012 3456" },
{ iso:"LY", nom:"Libye", indicatif:"218", longueurs:[9], exemple:"91 234 5678" },
{ iso:"MY", nom:"Malaisie", indicatif:"60", longueurs:[9,10], exemple:"12 345 6789" },
{ iso:"MW", nom:"Malawi", indicatif:"265", longueurs:[9], exemple:"991 234 567" },
{ iso:"MA", nom:"Maroc", indicatif:"212", longueurs:[9], exemple:"6 12 34 56 78" },
{ iso:"MU", nom:"Maurice", indicatif:"230", longueurs:[8], exemple:"5251 2345" },
{ iso:"MX", nom:"Mexique", indicatif:"52", longueurs:[10], exemple:"55 1234 5678" },
{ iso:"MZ", nom:"Mozambique", indicatif:"258", longueurs:[9], exemple:"82 123 4567" },
{ iso:"NA", nom:"Namibie", indicatif:"264", longueurs:[9], exemple:"81 123 4567" },
{ iso:"NG", nom:"Nigéria", indicatif:"234", longueurs:[10], exemple:"802 123 4567" },
{ iso:"NO", nom:"Norvège", indicatif:"47", longueurs:[8], exemple:"406 12 345" },
{ iso:"NZ", nom:"Nouvelle-Zélande", indicatif:"64", longueurs:[8,9,10], exemple:"21 123 4567" },
{ iso:"UG", nom:"Ouganda", indicatif:"256", longueurs:[9], exemple:"712 345 678" },
{ iso:"NL", nom:"Pays-Bas", indicatif:"31", longueurs:[9], exemple:"6 12345678" },
{ iso:"PL", nom:"Pologne", indicatif:"48", longueurs:[9], exemple:"512 345 678" },
{ iso:"PT", nom:"Portugal", indicatif:"351", longueurs:[9], exemple:"912 345 678" },
{ iso:"QA", nom:"Qatar", indicatif:"974", longueurs:[8], exemple:"3312 3456" },
{ iso:"RO", nom:"Roumanie", indicatif:"40", longueurs:[9], exemple:"712 345 678" },
{ iso:"GB", nom:"Royaume-Uni", indicatif:"44", longueurs:[10], exemple:"7400 123456" },
{ iso:"RU", nom:"Russie", indicatif:"7", longueurs:[10], exemple:"912 345 6789" },
{ iso:"SL", nom:"Sierra Leone", indicatif:"232", longueurs:[8], exemple:"25 123456" },
{ iso:"SG", nom:"Singapour", indicatif:"65", longueurs:[8], exemple:"8123 4567" },
{ iso:"SO", nom:"Somalie", indicatif:"252", longueurs:[8,9], exemple:"90 792 5424" },
{ iso:"SD", nom:"Soudan", indicatif:"249", longueurs:[9], exemple:"91 123 4567" },
{ iso:"SE", nom:"Suède", indicatif:"46", longueurs:[9], exemple:"70 123 45 67" },
{ iso:"CH", nom:"Suisse", indicatif:"41", longueurs:[9], exemple:"78 123 45 67" },
{ iso:"TZ", nom:"Tanzanie", indicatif:"255", longueurs:[9], exemple:"621 234 567" },
{ iso:"CZ", nom:"Tchéquie", indicatif:"420", longueurs:[9], exemple:"601 123 456" },
{ iso:"TN", nom:"Tunisie", indicatif:"216", longueurs:[8], exemple:"20 123 456" },
{ iso:"TR", nom:"Turquie", indicatif:"90", longueurs:[10], exemple:"532 123 4567" },
{ iso:"ZM", nom:"Zambie", indicatif:"260", longueurs:[9], exemple:"95 123 4567" },
{ iso:"ZW", nom:"Zimbabwe", indicatif:"263", longueurs:[9], exemple:"71 234 5678" }
];

/** Index par code ISO, construit une seule fois. */
const PAR_ISO = new Map(PAYS_TELEPHONE.map((p) => [p.iso, p]));

/** Pays par défaut si rien n'est connu — le public prioritaire. */
export const PAYS_PAR_DEFAUT = "SN";

// ==========================================================
// RECONNAISSANCE DU PAYS ÉCRIT À LA MAIN
// ==========================================================
// `country` et `nationality` sont des champs de saisie libre dans
// profile.html : l'étudiant y écrit « senegal », « Sénégal »,
// « SENEGAL » ou « Côte d'ivoire ». On compare donc sur une forme
// aplatie — sans accents, sans ponctuation, sans casse.

function aplatir(texte) {

return String(texte || "")
.normalize("NFD")
.replace(/[\u0300-\u036f]/g, "")
.toLowerCase()
.replace(/[^a-z]+/g, "");

}

/**
* Quelques façons courantes d'écrire un pays qui ne correspondent pas
* à son nom officiel. Volontairement court : la liste ne cherche pas
* l'exhaustivité, seulement les cas qu'un étudiant écrira vraiment.
*/
const AUTRES_NOMS = {
rdc: "CD", congokinshasa: "CD", congobrazzaville: "CG", congo: "CG",
ivorycoast: "CI", cotedivoire: "CI", rca: "CF", centrafrique: "CF",
usa: "US", etatsunis: "US", ameriquedunord: "US", ameriques: "US",
uk: "GB", angleterre: "GB", grandebretagne: "GB",
paysbas: "NL", hollande: "NL", allemagne: "DE", deutschland: "DE",
espagne: "ES", coreedusud: "KR", coree: "KR",
emirats: "AE", emiratsarabesunis: "AE", arabiesaoudite: "SA",
afriquedusud: "ZA", capvert: "CV", caboverde: "CV",
guineeconakry: "GN", guineebissau: "GW", guineeequatoriale: "GQ",
maurice: "MU", ilemaurice: "MU", madagascar: "MG"
};

/**
* Devine le code ISO à partir d'un nom de pays écrit librement.
*
* @param {string} nomLibre - ce que l'étudiant a tapé dans « Pays »
* @returns {string|null} code ISO, ou null si rien ne correspond
*/
export function isoDepuisNom(nomLibre) {

const plat = aplatir(nomLibre);

if (!plat) return null;

if (AUTRES_NOMS[plat]) return AUTRES_NOMS[plat];

const exact = PAYS_TELEPHONE.find((p) => aplatir(p.nom) === plat);
if (exact) return exact.iso;

// Repli : le nom saisi contient celui d'un pays, ou l'inverse
// (« republique du senegal », « senegal (dakar) »). On exige au
// moins quatre lettres pour éviter qu'un fragment court ne
// s'apparie à tort.
if (plat.length >= 4) {

const partiel = PAYS_TELEPHONE.find((p) => {
const n = aplatir(p.nom);
return n.length >= 4 && (n.includes(plat) || plat.includes(n));
});

if (partiel) return partiel.iso;

}

return null;

}

/** @returns {Object|null} la fiche du pays, ou null */
export function paysParIso(iso) {
return PAR_ISO.get(String(iso || "").toUpperCase()) || null;
}

// ==========================================================
// NORMALISATION ET VALIDATION
// ==========================================================

/**
* Retire tout ce qui n'est pas un chiffre, puis le zéro initial —
* mais SEULEMENT là où ce zéro est un préfixe d'acheminement.
*
* Voir la note `zeroSignificatif` en tête de la liste des pays : dans
* quatre d'entre eux, dont trois du public prioritaire, ce zéro fait
* partie du numéro et le retirer produit un numéro injoignable.
*
* @param {string} saisie
* @param {string} [iso] - sans lui, le zéro est retiré (cas majoritaire)
*/
export function chiffresNationaux(saisie, iso) {

const chiffres = String(saisie || "").replace(/\D+/g, "");

const pays = iso ? paysParIso(iso) : null;

if (pays && pays.zeroSignificatif) {

// Un seul zéro est légitime en tête ; « 0006... » reste une faute
// de frappe, quel que soit le pays.
return chiffres.replace(/^0{2,}/, "0");

}

return chiffres.replace(/^0+/, "");

}

/**
* Assemble le numéro au format E.164.
*
* @param {string} iso
* @param {string} saisie - ce que l'étudiant a tapé
* @returns {string} « +221771234567 », ou "" si la saisie est vide
*/
export function versE164(iso, saisie) {

const pays = paysParIso(iso);
const national = chiffresNationaux(saisie, iso);

if (!pays || !national) return "";

return `+${pays.indicatif}${national}`;

}

/**
* Sépare un E.164 enregistré en { iso, national } pour le réafficher
* dans le formulaire.
*
* Les indicatifs se chevauchent (« 1 » et « 221 » commencent tous
* deux par un chiffre lu de gauche à droite) : on essaie donc du plus
* LONG au plus court, sans quoi « +2217... » serait lu comme un
* numéro du plan +2. À indicatif partagé — +1 pour le Canada et les
* États-Unis, +7 pour la Russie — on ne peut pas trancher : le
* premier de la liste est retenu, et l'étudiant peut corriger le pays
* d'un clic si besoin.
*
* DEUX ÉCRITURES DISENT « INTERNATIONAL », ET L'AUTRE EST LA PLUS
* COURANTE (corrigé le 2026-09-14)
* -----------------------------------------------------------------
* « +221 77 123 45 67 » est la forme que ce module écrit. Ce n'est pas
* la forme que les gens écrivent : dans toute l'Afrique francophone on
* compose le préfixe international, et un carnet d'adresses, une carte
* de visite ou un profil rempli avant ce champ contient
* « 00221 77 123 45 67 ». Les deux désignent le même numéro.
*
* Ce fichier ne lisait que le « + ». Un numéro enregistré en « 00 »
* était donc rendu comme un national de douze chiffres, réécrit en
* « +221221771234567 », et l'étudiant se retrouvait bloqué à
* l'enregistrement de son profil — sur un champ qu'il n'avait pas
* touché — jusqu'à ce qu'il devine qu'il faut effacer « 221 » à la
* main. On reconnaît donc « 00 » comme on reconnaît « + ».
*
* LE ZÉRO SE PERDAIT SUR LE CHEMIN DE RETOUR
* -------------------------------------------
* Sans « + » ni « 00 », il reste un numéro national — et un national
* ne se lit qu'en sachant DE QUEL PAYS il vient : en Côte d'Ivoire, au
* Gabon, au Congo et en Italie le zéro de tête fait partie du numéro
* (`zeroSignificatif`). `chiffresNationaux` était appelé sans pays :
* « 07 07 07 07 07 » revenait à neuf chiffres au lieu de dix, et
* l'ivoirien qui rouvrait son profil lisait « un numéro compte 10
* chiffres — vous en avez saisi 9 » sur le numéro qu'il avait
* lui-même saisi correctement. Le pays présumé est donc un paramètre.
*
* @param {string} e164
* @param {string} [isoSuggere] pays présumé, utilisé UNIQUEMENT quand
*        la valeur n'est ni « + » ni « 00 » — c'est-à-dire quand elle
*        ne porte aucun indicatif et qu'il faut bien la lire depuis
*        quelque part.
* @returns {{iso:string, national:string}}
*/
export function depuisE164(e164, isoSuggere = "") {

const brut = String(e164 || "").trim();

// Le « 00 » n'est international que suivi d'un chiffre, et seulement
// après avoir écarté les séparateurs de saisie : « 00 221 77... » et
// « 00221-77... » sont la même chose.
const nu = brut.replace(/[\s.\-()\u00A0]+/g, "");
const apresIndicatif = nu.startsWith("+")
? nu.slice(1)
: (/^00\d/.test(nu) ? nu.slice(2) : null);

if (apresIndicatif === null) {
return { iso: "", national: chiffresNationaux(brut, isoSuggere) };
}

const chiffres = apresIndicatif.replace(/\D+/g, "");

const candidats = [...PAYS_TELEPHONE]
.filter((p) => chiffres.startsWith(p.indicatif))
.sort((a, b) => b.indicatif.length - a.indicatif.length);

// AUCUN INDICATIF CONNU DERRIÈRE LE PRÉFIXE.
//
// Deux cas, et le second est dangereux :
//
//  — ce n'était pas de l'international, juste une saisie qui commence
//    par des zéros. On la relit comme un national du pays présumé,
//    sans quoi on renverrait un numéro amputé de son début.
//
//  — c'était bien de l'international, mais d'un pays qui n'est pas
//    dans les 88 de cette liste (Ukraine, Chypre, Israël, Pakistan…
//    des destinations d'études réelles). Ranger ce numéro sous le
//    pays présumé est alors une réécriture silencieuse : « +675123456 »
//    fait neuf chiffres, le Sénégal en attend neuf, et Fitz
//    enregistrerait « +221675123456 » — un numéro parfaitement valide
//    qui n'est pas celui de l'étudiant, et qu'aucun message
//    n'aurait signalé.
//
// On ne peut pas deviner le pays ; on peut DIRE qu'on ne le
// reconnaît pas. `indicatifInconnu` ne change rien pour les appelants
// qui déstructurent `{iso, national}` — c'est le champ téléphone qui
// s'en sert pour afficher une phrase au lieu d'enregistrer un numéro
// faux.
if (!candidats.length) {

const explicite = nu.startsWith("+") || /^00\d/.test(nu);

return explicite
? { iso: "", national: chiffres, indicatifInconnu: true }
: { iso: "", national: chiffresNationaux(brut, isoSuggere) };

}

const pays = candidats[0];

return { iso: pays.iso, national: chiffres.slice(pays.indicatif.length) };
// Rien à réajouter ici : versE164() a conservé le zéro à l'écriture
// pour les pays concernés, il est donc déjà dans la portion restante.

}

/**
* Vérifie la longueur du numéro national.
*
* @param {string} iso
* @param {string} saisie
* @returns {{valide:boolean, message:string}}
*/
export function verifier(iso, saisie) {

const national = chiffresNationaux(saisie, iso);

// Le téléphone n'est pas obligatoire : un champ vide n'est pas une
// erreur, seulement un champ vide.
if (!national) return { valide: true, message: "" };

const pays = paysParIso(iso);

if (!pays) {
return { valide: false, message: "Choisissez d'abord votre pays." };
}

if (pays.longueurs.includes(national.length)) {
return { valide: true, message: "" };
}

const attendu = pays.longueurs.length === 1
? `${pays.longueurs[0]} chiffres`
: `${pays.longueurs.slice(0, -1).join(", ")} ou ${pays.longueurs.at(-1)} chiffres`;

// Le cas de loin le plus fréquent, et celui qui mérite sa propre
// phrase : l'étudiant a recopié son numéro avec l'indicatif alors
// que le sélecteur le porte déjà.
if (national.startsWith(pays.indicatif) &&
pays.longueurs.includes(national.length - pays.indicatif.length)) {

return {
valide: false,
message: `Saisissez votre numéro sans le +${pays.indicatif} — il est déjà sélectionné à gauche.`
};

}

// Le pays est mis en tête plutôt qu'inséré dans la phrase : « du
// Sénégal », « de la Côte d'Ivoire », « des Émirats arabes unis »
// — l'article français dépend du genre et du nombre, et aucune
// règle mécanique ne les devine à partir du nom. Deux-points, et
// la phrase est juste pour les 88 pays.
return {
valide: false,
message: `${pays.nom} : un numéro compte ${attendu} — vous en avez saisi ${national.length}.`
};

}

/**
* Numéro prêt pour un lien wa.me (chiffres seuls, sans le « + »).
* @returns {string} "" si le numéro n'est pas exploitable
*/
export function pourWhatsApp(iso, saisie) {

const e164 = versE164(iso, saisie);

return e164 ? e164.slice(1) : "";

}
