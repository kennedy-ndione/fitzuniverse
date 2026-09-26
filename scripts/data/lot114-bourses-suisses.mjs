/**
* ============================================================
* LOT 114 — LES BOURSES D'EXCELLENCE DE LA CONFÉDÉRATION SUISSE,
* ROUVERTES, AVEC LA DATE LIMITE DE CHAQUE PAYS D'AFRIQUE
* (2026-09-26)
* ============================================================
*
* Constat du lot 113 : l'appel 2027-2028 est ouvert depuis le 20 août
* 2026, mais les trois programmes (EPFL, ETH Zurich, Université de
* Zurich) affichaient « Fermée ». Demande de Charles : « tu peux
* réouvrir les bourses suisses et les présenter dans notre panneau
* publicitaire défilant sur la page d'accueil ».
*
* Sources officielles relues le 2026-09-26 :
*   - sbfi.admin.ch/en/swiss-government-excellence-scholarships-at-a-glance
*     « Scholarship applications only via this link (access available
*     from 20 August 2026). » ; « Do not send your application by email
*     or in paper form. » ; master terminé au plus tard le 31 juillet
*     2027 (30 juin 2027 pour l'ETH Zurich) ; né après le 31 décembre
*     1991 ; 2 450 CHF par mois ; début le 1er septembre 2027 ;
*     doctorat : 12 mois renouvelables deux fois, 36 mois au plus ;
*     bourse de recherche : 6 à 12 mois, sans prolongation.
*   - la liste Afrique du SEFRI (PDF du 2026-08-04) : les 54 pays, la
*     bourse de doctorat et la bourse de recherche seulement, et une
*     date limite par pays, du 13 octobre (Tunisie) au 30 novembre 2026.
*
* CE QUE LE LOT CHANGE
*   1. La bourse : le dépôt passe par GO ESKAS, plus par l'ambassade
*      (l'exigence `candidature_via_ambassade` est retirée) ; les
*      critères, la note d'âge, la description et la période disent
*      l'appel 2027-2028 ; `echeancesParPays` porte les 54 dates
*      (code ISO du pays -> date ISO), que le moteur lit pour donner à
*      chaque étudiant SA date limite ; `aLaUne` la place en tête du
*      bandeau de l'accueil tant qu'une date reste à 30 jours ou plus.
*   2. Les trois programmes : « Ouverte », preuve datée du jour, une
*      prose SANS date (une date écrite dans la prose serait lue comme
*      LA date limite de tout le monde), niveau « Doctorat » (la
*      bourse postdoctorale n'existe plus, le master n'est pas ouvert à
*      l'Afrique), durée exacte ; l'ETH perd la phrase « auprès de la
*      représentation diplomatique », devenue fausse.
*
* EXÉCUTION (sur l'ordinateur de Charles, après la sauvegarde) :
*   node scripts\lot.mjs analyser 114-bourses-suisses
*   node scripts\lot.mjs ecrire 114-bourses-suisses
*   node scripts\lot.mjs verifier 114-bourses-suisses
* ============================================================
*/

const PAR = "IlXJmAScj2U5ucV2ctUgeJjadNd2";
const LU = "2026-09-26T02:30:00.000Z";

const PAGE = "https://www.sbfi.admin.ch/en/swiss-government-excellence-scholarships-at-a-glance";
const LISTE_AFRIQUE = "https://www.sbfi.admin.ch/dam/en/sd-web/tFFyoJ2KGeGB/2026-08-04_Africa_List_of_countries_and_territories_complete.pdf";

const BOURSE = "swiss-government-excellence-scholarships";

/**
* Les dates limites 2026 de la liste Afrique du SEFRI, par date puis par
* code ISO. Relues deux fois dans le PDF ; les 54 pays du continent y
* sont, chacun une seule fois (test/lot114.test.mjs le vérifie).
*/
const DATES_AFRIQUE = {
"2026-10-13": ["TN"],
"2026-10-27": ["MZ"],
"2026-11-10": ["BI", "EG", "LY", "MW", "MA", "SD", "TZ", "ZM", "ZW"],
"2026-11-13": ["DZ", "DJ", "ET", "SS"],
"2026-11-27": ["AO", "BJ", "BF", "CM", "CF", "TD", "KM", "CI", "GQ", "GH", "GN", "LR", "MG", "MU", "NE", "NG", "ST", "SC", "SL", "TG"],
"2026-11-30": ["BW", "CV", "CG", "CD", "ER", "SZ", "GA", "GM", "GW", "KE", "LS", "ML", "MR", "NA", "RW", "SN", "SO", "ZA", "UG"]
};

export const ECHEANCES_PAR_PAYS = Object.fromEntries(
Object.entries(DATES_AFRIQUE)
.flatMap(([date, codes]) => codes.map((code) => [code, date]))
.sort(([a], [b]) => a.localeCompare(b))
);

const CRITERES = [
"Pour le cycle 2027-2028, les 54 pays d'Afrique ont accès à la bourse de doctorat et à la bourse de recherche (Research Fellowship), pas au master. La bourse postdoctorale n'est plus attribuée.",
"Il faut avoir terminé son master au plus tard le 31 juillet 2027 (le 30 juin 2027 pour l'ETH Zurich), et être né(e) après le 31 décembre 1991.",
"Un professeur d'une université suisse ou d'une école polytechnique fédérale doit accepter d'encadrer votre projet : sa lettre fait partie du dossier.",
"Les candidatures sont ouvertes depuis le 20 août 2026. Elles se déposent uniquement en ligne, sur la plateforme GO ESKAS : le SEFRI demande de ne rien envoyer par e-mail ni sur papier.",
"La date limite dépend de votre pays. Le 13 octobre 2026 pour la Tunisie. Le 27 octobre pour le Mozambique. Le 10 novembre pour le Burundi, l'Égypte, la Libye, le Malawi, le Maroc, le Soudan, la Tanzanie, la Zambie et le Zimbabwe. Le 13 novembre pour l'Algérie, Djibouti, l'Éthiopie et le Soudan du Sud.",
"Le 27 novembre 2026 pour l'Angola, le Bénin, le Burkina Faso, le Cameroun, la Centrafrique, le Tchad, les Comores, la Côte d'Ivoire, la Guinée équatoriale, le Ghana, la Guinée, le Liberia, Madagascar, Maurice, le Niger, le Nigeria, Sao Tomé-et-Principe, les Seychelles, la Sierra Leone et le Togo.",
"Le 30 novembre 2026 pour le Botswana, le Cap-Vert, le Congo, la RD Congo, l'Érythrée, l'Eswatini, le Gabon, la Gambie, la Guinée-Bissau, le Kenya, le Lesotho, le Mali, la Mauritanie, la Namibie, le Rwanda, le Sénégal, la Somalie, l'Afrique du Sud et l'Ouganda.",
"La bourse commence le 1er septembre 2027. La candidature est gratuite."
].join("\n");

/**
* La prose des trois programmes. AUCUNE DATE COMPLÈTE : analyserEcheance()
* lirait la première comme la date limite de tout le monde. La date de
* l'étudiant vient de `echeancesParPays`, par le moteur et par la fiche.
*/
const PROSE = "Candidatures ouvertes depuis le 20 août, uniquement en ligne, sur la plateforme GO ESKAS : n'envoyez rien par e-mail ni sur papier. "
+ "La date limite dépend de votre pays : pour les pays d'Afrique, elle tombe entre la mi-octobre et la fin novembre, et la liste complète figure dans les conditions de la bourse. "
+ "Un professeur d'une université suisse doit avoir accepté d'encadrer votre projet. "
+ "L'allocation est de 2 450 CHF par mois. La candidature est gratuite : méfiez-vous de toute demande de paiement.";

const DUREE = "12 mois renouvelables deux fois (36 mois au plus) pour un doctorat ; 6 à 12 mois pour un séjour de recherche";

const ANCIENNE_PROSE = "L'appel 2027-2028 est ouvert depuis le 20 août. La date limite dépend de votre pays : chaque représentation suisse, ambassade ou consulat, publie la sienne, et c'est auprès d'elle que vous déposez votre dossier. Deux types de bourses existent : les bourses de recherche, après un master, dans toutes les disciplines, et les bourses d'art, pour un premier master, dans un nombre limité de pays. Vous devez avoir 35 ans au plus. Pour une bourse de recherche, un professeur en Suisse doit avoir accepté d'encadrer votre projet. L'allocation est de 2 450 CHF par mois. La candidature est gratuite : méfiez-vous de toute demande de paiement.";

const PREUVE = {
url: PAGE,
citation: "Scholarship applications only via this link (access available from 20 August 2026).",
le: LU,
parUid: PAR
};

const commun = {
status: "Ouverte",
ouverteVerifieeLe: "2026-09-26",
sourceVerification: PREUVE,
deadline: PROSE,
level: "Doctorat",
duration: DUREE
};

const MOTIF_PROGRAMME = "Appel 2027-2028 ouvert depuis le 20 août 2026 sur GO ESKAS (page officielle du SEFRI, lue le 2026-09-26) : la fiche disait « Fermée ». "
+ "Prose sans date (la date vient de echeancesParPays), niveau Doctorat (plus de postdoctorat, pas de master pour l'Afrique), durée exacte.";

export const PATCHES = [
{
collection: "scholarships",
id: BOURSE,
attendu: {
exigences: ["directeur_these", "candidature_via_ambassade"],
officialWebsite: "https://www.sbfi.admin.ch/en/swiss-government-excellence-scholarships",
sourceEcheance: "https://www.sbfi.admin.ch/sbfi/en/home/education/scholarships-and-grants/swiss-government-excellence-scholarships.html",
verifieLe: "2026-09-05",
description: "Bourse du gouvernement suisse pour un doctorat ou un postdoctorat dans toute université suisse ou école polytechnique fédérale (ETH Zurich, EPFL)."
},
champs: {
exigences: ["directeur_these"],
officialWebsite: PAGE,
sourceEcheance: LISTE_AFRIQUE,
verifieLe: "2026-09-26",
description: "Bourse du gouvernement suisse pour un doctorat ou un séjour de recherche dans une université suisse, à l'ETH Zurich ou à l'EPFL.",
periodeOuverture: "appel annuel ouvert fin août ; la date limite dépend du pays, entre mi-octobre et fin novembre pour l'Afrique",
ageMaxNote: "Vous devez être né(e) après le 31 décembre 1991, selon la page officielle du SEFRI pour l'appel 2027-2028.",
generalCriteria: CRITERES,
echeancesParPays: ECHEANCES_PAR_PAYS,
aLaUne: true
},
motif: "Appel 2027-2028 relu le 2026-09-26 : dépôt uniquement sur GO ESKAS (plus par l'ambassade), master terminé au 31/07/2027, né après le 31/12/1991, "
+ "54 dates limites africaines (liste Afrique du SEFRI du 2026-08-04). Mise à la une du bandeau de l'accueil, demandée par Charles."
},
{
collection: "programs",
id: "epfl-lausanne__swiss-government-excellence-scholarships",
attendu: { status: "Fermée", level: "Doctorat / post-doctorat (recherche) — Master en Arts (pays limités)", deadline: ANCIENNE_PROSE },
champs: { ...commun },
motif: MOTIF_PROGRAMME
},
{
collection: "programs",
id: "eth-zurich-zurich__swiss-government-excellence-scholarships",
attendu: {
status: "Fermée",
level: "Doctorat",
deadline: ANCIENNE_PROSE,
coverage: "Bourse complète du gouvernement suisse",
description: "Avant de candidater, vous devez obtenir l'admission ou l'accord préalable d'un directeur de recherche à l'ETH Zurich. La candidature se dépose auprès de la représentation diplomatique suisse de votre pays d'origine, et non directement en ligne. Les modalités de chaque pays sont expliquées sur sbfi.admin.ch."
},
champs: {
...commun,
coverage: "2 450 CHF par mois (tarif 2027-2028), plus des frais annexes selon votre profil",
description: "Avant de candidater, un professeur de l'ETH Zurich doit accepter d'encadrer votre projet de recherche. Pour l'ETH, le master doit être terminé au plus tard le 30 juin 2027, un mois plus tôt qu'ailleurs. Le dossier se dépose en ligne, sur la plateforme GO ESKAS du SEFRI."
},
motif: MOTIF_PROGRAMME + " ETH : la couverture « complète » était fausse (les frais de scolarité ne sont pas couverts), et le dépôt ne passe plus par l'ambassade."
},
{
collection: "programs",
id: "university-of-zurich-zurich__swiss-government-excellence-scholarships",
attendu: { status: "Fermée", level: "Doctorat / post-doctorat (recherche) — Master en Arts (pays limités)", deadline: ANCIENNE_PROSE },
champs: { ...commun },
motif: MOTIF_PROGRAMME
}
];
