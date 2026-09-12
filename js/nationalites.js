// ============================================================
// js/nationalites.js — LE GENTILÉ DE CHAQUE PAYS
// (lot NATIONALITÉS, 2026-09-12)
// ============================================================
//
// CE QU'IL CORRIGE. La question « Quelle est votre nationalité ? » du
// questionnaire proposait la liste des PAYS : un Sénégalais devait
// répondre « Sénégal » à une question qui demande « Sénégalais(e) ».
// Charles l'a relevé le 2026-09-12 sur son téléphone.
//
// LA FORME RETENUE : « Sénégalais(e) », « Malien(ne) », « Burkinabè ».
// Le masculin d'abord, le féminin entre parenthèses quand il diffère —
// et rien entre parenthèses quand la forme est épicène (Belge, Suisse,
// Malgache, Burkinabè, Tchèque, Yéménite…). Deux pays partagent le même
// gentilé : les deux Congo sont donc désambiguïsés entre parenthèses,
// sans quoi la liste offrirait deux entrées identiques.
//
// ⚠️ CE QUE CE MODULE PROTÈGE. La réponse enregistrée n'est plus un nom
// de pays : elle doit rester résoluble en code ISO par
// isoDeNationalite() (js/eligibility-countries.js), sans quoi
// estEligible() devient muet et TOUTES les bourses réservées restent
// affichées à tout le monde — un défaut invisible à l'écran, déjà
// rencontré le 2026-09-05 avec « Vietnam ». C'est pourquoi
// paysDeNationalite() existe et que eligibility-countries.js l'appelle.
//
// L'ORDRE est celui de PAYS_DU_MONDE (js/eligibility-pistes.js) : les
// quinze premiers restent le cœur probable de l'audience, le reste suit
// par continent. test/nationalites.test.mjs vérifie que les deux listes
// se correspondent une pour une — une nouvelle entrée dans l'une sans
// l'autre fait rougir la suite.
//
// MODULE PUR : aucun DOM, aucun réseau, aucune dépendance.
// ============================================================

/** [nom du pays, gentilé], dans l'ordre de PAYS_DU_MONDE. */
export const PAYS_ET_NATIONALITES = [
["Sénégal", "Sénégalais(e)"],
["Côte d'Ivoire", "Ivoirien(ne)"],
["Mali", "Malien(ne)"],
["Guinée", "Guinéen(ne)"],
["Cameroun", "Camerounais(e)"],
["Bénin", "Béninois(e)"],
["Burkina Faso", "Burkinabè"],
["Togo", "Togolais(e)"],
["Niger", "Nigérien(ne)"],
["République démocratique du Congo", "Congolais(e) (RDC)"],
["Gabon", "Gabonais(e)"],
["Madagascar", "Malgache"],
["Maroc", "Marocain(e)"],
["Tunisie", "Tunisien(ne)"],
["Algérie", "Algérien(ne)"],
["Afrique du Sud", "Sud-Africain(e)"],
["Angola", "Angolais(e)"],
["Botswana", "Botswanais(e)"],
["Burundi", "Burundais(e)"],
["Cap-Vert", "Cap-Verdien(ne)"],
["Comores", "Comorien(ne)"],
["Congo (République du)", "Congolais(e) (Congo-Brazzaville)"],
["Djibouti", "Djiboutien(ne)"],
["Égypte", "Égyptien(ne)"],
["Érythrée", "Érythréen(ne)"],
["Eswatini", "Swazi(e)"],
["Éthiopie", "Éthiopien(ne)"],
["Gambie", "Gambien(ne)"],
["Ghana", "Ghanéen(ne)"],
["Guinée équatoriale", "Équato-guinéen(ne)"],
["Guinée-Bissau", "Bissau-Guinéen(ne)"],
["Kenya", "Kényan(e)"],
["Lesotho", "Lesothien(ne)"],
["Liberia", "Libérien(ne)"],
["Libye", "Libyen(ne)"],
["Malawi", "Malawien(ne)"],
["Maurice", "Mauricien(ne)"],
["Mauritanie", "Mauritanien(ne)"],
["Mozambique", "Mozambicain(e)"],
["Namibie", "Namibien(ne)"],
["Nigeria", "Nigérian(e)"],
["Ouganda", "Ougandais(e)"],
["République centrafricaine", "Centrafricain(e)"],
["Rwanda", "Rwandais(e)"],
["Sao Tomé-et-Principe", "Santoméen(ne)"],
["Sierra Leone", "Sierra-Léonais(e)"],
["Somalie", "Somalien(ne)"],
["Soudan", "Soudanais(e)"],
["Soudan du Sud", "Sud-Soudanais(e)"],
["Tanzanie", "Tanzanien(ne)"],
["Tchad", "Tchadien(ne)"],
["Zambie", "Zambien(ne)"],
["Zimbabwe", "Zimbabwéen(ne)"],
["Albanie", "Albanais(e)"],
["Allemagne", "Allemand(e)"],
["Andorre", "Andorran(e)"],
["Autriche", "Autrichien(ne)"],
["Belgique", "Belge"],
["Bosnie-Herzégovine", "Bosnien(ne)"],
["Bulgarie", "Bulgare"],
["Chypre", "Chypriote"],
["Croatie", "Croate"],
["Danemark", "Danois(e)"],
["Espagne", "Espagnol(e)"],
["Estonie", "Estonien(ne)"],
["Finlande", "Finlandais(e)"],
["France", "Français(e)"],
["Grèce", "Grec(que)"],
["Hongrie", "Hongrois(e)"],
["Irlande", "Irlandais(e)"],
["Islande", "Islandais(e)"],
["Italie", "Italien(ne)"],
["Kosovo", "Kosovar(e)"],
["Lettonie", "Letton(ne)"],
["Liechtenstein", "Liechtensteinois(e)"],
["Lituanie", "Lituanien(ne)"],
["Luxembourg", "Luxembourgeois(e)"],
["Macédoine du Nord", "Macédonien(ne)"],
["Malte", "Maltais(e)"],
["Moldavie", "Moldave"],
["Monaco", "Monégasque"],
["Monténégro", "Monténégrin(e)"],
["Norvège", "Norvégien(ne)"],
["Pays-Bas", "Néerlandais(e)"],
["Pologne", "Polonais(e)"],
["Portugal", "Portugais(e)"],
["République tchèque", "Tchèque"],
["Roumanie", "Roumain(e)"],
["Royaume-Uni", "Britannique"],
["Russie", "Russe"],
["Saint-Marin", "Saint-Marinais(e)"],
["Serbie", "Serbe"],
["Slovaquie", "Slovaque"],
["Slovénie", "Slovène"],
["Suède", "Suédois(e)"],
["Suisse", "Suisse"],
["Ukraine", "Ukrainien(ne)"],
["Vatican", "Vaticanais(e)"],
["Antigua-et-Barbuda", "Antiguais(e)"],
["Argentine", "Argentin(e)"],
["Bahamas", "Bahaméen(ne)"],
["Barbade", "Barbadien(ne)"],
["Belize", "Bélizien(ne)"],
["Bolivie", "Bolivien(ne)"],
["Brésil", "Brésilien(ne)"],
["Canada", "Canadien(ne)"],
["Chili", "Chilien(ne)"],
["Colombie", "Colombien(ne)"],
["Costa Rica", "Costaricien(ne)"],
["Cuba", "Cubain(e)"],
["Dominique", "Dominiquais(e)"],
["Équateur", "Équatorien(ne)"],
["États-Unis", "Américain(e)"],
["Grenade", "Grenadien(ne)"],
["Guatemala", "Guatémaltèque"],
["Guyana", "Guyanien(ne)"],
["Haïti", "Haïtien(ne)"],
["Honduras", "Hondurien(ne)"],
["Jamaïque", "Jamaïcain(e)"],
["Mexique", "Mexicain(e)"],
["Nicaragua", "Nicaraguayen(ne)"],
["Panama", "Panaméen(ne)"],
["Paraguay", "Paraguayen(ne)"],
["Pérou", "Péruvien(ne)"],
["République dominicaine", "Dominicain(e)"],
["Saint-Kitts-et-Nevis", "Kittitien(ne)"],
["Saint-Vincent-et-les-Grenadines", "Vincentais(e)"],
["Sainte-Lucie", "Saint-Lucien(ne)"],
["Suriname", "Surinamais(e)"],
["Trinité-et-Tobago", "Trinidadien(ne)"],
["Uruguay", "Uruguayen(ne)"],
["Venezuela", "Vénézuélien(ne)"],
["Afghanistan", "Afghan(e)"],
["Arabie Saoudite", "Saoudien(ne)"],
["Arménie", "Arménien(ne)"],
["Azerbaïdjan", "Azerbaïdjanais(e)"],
["Bahreïn", "Bahreïnien(ne)"],
["Bangladesh", "Bangladais(e)"],
["Bhoutan", "Bhoutanais(e)"],
["Brunei", "Brunéien(ne)"],
["Cambodge", "Cambodgien(ne)"],
["Chine", "Chinois(e)"],
["Corée du Nord", "Nord-Coréen(ne)"],
["Corée du Sud", "Sud-Coréen(ne)"],
["Émirats Arabes Unis", "Émirien(ne)"],
["Géorgie", "Géorgien(ne)"],
["Inde", "Indien(ne)"],
["Indonésie", "Indonésien(ne)"],
["Irak", "Irakien(ne)"],
["Iran", "Iranien(ne)"],
["Israël", "Israélien(ne)"],
["Japon", "Japonais(e)"],
["Jordanie", "Jordanien(ne)"],
["Kazakhstan", "Kazakh(e)"],
["Kirghizistan", "Kirghize"],
["Koweït", "Koweïtien(ne)"],
["Laos", "Laotien(ne)"],
["Liban", "Libanais(e)"],
["Malaisie", "Malaisien(ne)"],
["Maldives", "Maldivien(ne)"],
["Mongolie", "Mongol(e)"],
["Myanmar", "Birman(e)"],
["Népal", "Népalais(e)"],
["Oman", "Omanais(e)"],
["Ouzbékistan", "Ouzbek(e)"],
["Pakistan", "Pakistanais(e)"],
["Palestine", "Palestinien(ne)"],
["Philippines", "Philippin(e)"],
["Qatar", "Qatarien(ne)"],
["Singapour", "Singapourien(ne)"],
["Sri Lanka", "Sri-Lankais(e)"],
["Syrie", "Syrien(ne)"],
["Tadjikistan", "Tadjik(e)"],
["Taïwan", "Taïwanais(e)"],
["Thaïlande", "Thaïlandais(e)"],
["Timor oriental", "Timorais(e)"],
["Turkménistan", "Turkmène"],
["Turquie", "Turc(que)"],
["Vietnam", "Vietnamien(ne)"],
["Yémen", "Yéménite"],
["Australie", "Australien(ne)"],
["Fidji", "Fidjien(ne)"],
["Îles Marshall", "Marshallais(e)"],
["Îles Salomon", "Salomonais(e)"],
["Kiribati", "Kiribatien(ne)"],
["Micronésie", "Micronésien(ne)"],
["Nauru", "Nauruan(e)"],
["Nouvelle-Zélande", "Néo-Zélandais(e)"],
["Palaos", "Palaosien(ne)"],
["Papouasie-Nouvelle-Guinée", "Papouasien(ne)"],
["Samoa", "Samoan(e)"],
["Tonga", "Tongien(ne)"],
["Tuvalu", "Tuvaluan(e)"],
["Vanuatu", "Vanuatuan(e)"]
];

/** Les gentilés seuls — ce que l'étudiant voit dans la liste. */
export const NATIONALITES = PAYS_ET_NATIONALITES.map(([, gentile]) => gentile);

/** Le gentilé d'un pays, ou null si le pays n'est pas dans la table. */
export function nationaliteDePays(pays) {
const clef = aplatir(pays);
if (!clef) return null;
for (const [nom, gentile] of PAYS_ET_NATIONALITES) {
if (aplatir(nom) === clef) return gentile;
}
return null;
}

/**
* Le pays derrière une nationalité écrite librement.
*
* Tolérant par construction, parce que la valeur peut venir de trois
* époques : « Sénégalais(e) » (la liste d'aujourd'hui), « sénégalaise »
* ou « senegalais » (une saisie libre), « Sénégal » (les réponses
* enregistrées AVANT ce lot, et le champ « nationalité » du profil).
* Le nom de pays est renvoyé tel qu'il s'écrit, accents compris.
*
* @param {string} saisie
* @returns {string|null} le nom du pays, ou null si rien ne correspond.
*/
export function paysDeNationalite(saisie) {

const clef = aplatir(saisie);
if (!clef) return null;

// 1. Un nom de pays, tel quel : la rétrocompatibilité d'abord.
for (const [nom] of PAYS_ET_NATIONALITES) {
if (aplatir(nom) === clef) return nom;
}

// 2. Le gentilé exact de la liste, aplati : « Sénégalais(e) » et
//    « sénégalaise » s'aplatissent tous les deux en « senegalaise ».
for (const [nom, gentile] of PAYS_ET_NATIONALITES) {
if (aplatir(gentile) === clef) return nom;
}

// 3. Le masculin seul (« senegalais », « malien ») : la forme aplatie
//    du gentilé commence par lui. On exige 4 caractères pour ne pas
//    laisser « in » ou « ma » désigner un pays au hasard, et on refuse
//    toute correspondance ambiguë plutôt que d'en choisir une.
if (clef.length >= 4) {
const candidats = PAYS_ET_NATIONALITES.filter(([, g]) => aplatir(g).startsWith(clef));
if (candidats.length === 1) return candidats[0][0];
}

return null;

}

/**
* Met une chaîne à plat pour la comparaison : minuscules, sans accents,
* SANS PARENTHÈSES (c'est ce qui rapproche « Sénégalais(e) » de
* « sénégalaise »), les autres signes devenant des espaces.
*/
function aplatir(texte) {
return String(texte || "")
.normalize("NFD")
.replace(/\p{Diacritic}/gu, "")
.toLowerCase()
.replace(/[()]/g, "")
.replace(/[^a-z0-9]+/g, " ")
.trim();
}
