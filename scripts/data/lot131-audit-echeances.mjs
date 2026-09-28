/**
* ============================================================
* LOT 131 : AUDIT DES ÉCHÉANCES DES BOURSES (audit 2026-10)
* ============================================================
*
* PATCHES (ce que `lot.mjs` écrit) : SEULEMENT ce que Charles a vérifié
* au navigateur, sur les sites officiels, le 2026-09-28 :
*   - Chevening : clôture le 6 octobre 2026 à 11:00 UTC
*     https://www.chevening.org/scholarships/application-timeline/
*   - Commonwealth Master's : clôture le 20 octobre 2026 à 16:00 BST
*     https://cscuk.fcdo.gov.uk/scholarships/commonwealth-masters-scholarships/
*   - Commonwealth PhD : clôture le 20 octobre 2026 à 16:00 BST
*     https://cscuk.fcdo.gov.uk/scholarships/commonwealth-phd-scholarships/
* Ces trois dates sont déjà celles du catalogue (prose des programmes, et
* deadlineISO + citation pour Chevening) : seul le STATUT était faux. Aucune
* deadlineISO n'est ajoutée aux Commonwealth — elle exigerait une citation
* relevée mot pour mot ; la carte lit déjà la date de la prose et se ferme
* d'elle-même le 21 octobre (simulé avec js/echeance.js).
*
* PATCHES_CONDITIONNELS (jamais écrits par `lot.mjs`) : tout le reste,
* préparé dans une session cloud dont le réseau refusait les sites
* officiels. Chaque bloc attend la relecture de sa page, et la section B
* sa phrase officielle recopiée dans A_RELEVER. Détail : AUDIT-2026-10.md.
* ATTENTION : ces blocs réutilisent RELU_LE (verifieLe, ouverteVerifieeLe,
* sourceVerification.le). Un bloc relu un AUTRE jour doit porter la date
* de SA relecture — la remplacer dans le bloc avant de le déplacer.
*
* À ÉCRIRE AVANT LE 6 OCTOBRE 2026 (clôture de Chevening) :
*   sauvegarde du jour, puis analyser / ecrire / verifier 131-audit-echeances.
*
* Export de référence : assets/data/catalogue.json, genereLe
* 2026-09-26T13:45:32.033Z. `analyser` refusera tout `attendu` qui ne
* correspond plus à la base.
* ============================================================
*/

const RELU_LE = "2026-09-28";              // relecture au navigateur par Charles (Chevening, Commonwealth)
const LU = `${RELU_LE}T12:00:00.000Z`;     // idem, avec l'heure

const PAR = "IlXJmAScj2U5ucV2ctUgeJjadNd2";
const A_RELEVER = "";                      // phrase officielle, mot pour mot

const preuve = (url, citation) => ({ url, citation, le: LU, parUid: PAR });

// ---------- Chevening : textes actuels ----------
const CHEVENING_PROGRAMMES = [
"imperial-college-london-london__chevening-scholarships",
"university-of-edinburgh-edinburgh__chevening-scholarships",
"university-of-oxford-oxford__chevening-scholarships"
];

// ---------- Commonwealth : programmes ----------
const CSC_MASTER = [
"imperial-college-london-london__commonwealth-masters-scholarships__master",
"university-of-edinburgh-edinburgh__commonwealth-masters-scholarships__master",
"university-of-oxford-oxford__commonwealth-masters-scholarships__master"
];
const CSC_PHD = [
"imperial-college-london-london__commonwealth-phd-scholarships__doctorat",
"university-of-edinburgh-edinburgh__commonwealth-phd-scholarships__doctorat",
"university-of-oxford-oxford__commonwealth-phd-scholarships__doctorat"
];

const UCT_ANCIENNE = "Clôture le 30 septembre 2026 pour la licence, dite undergraduate, et le 31 octobre 2026 pour les cycles postgraduate, pour la rentrée 2027. La candidature à la bourse se fait en parallèle de la demande d'admission à l'UCT.";
const UCT_NOUVELLE = "Jusqu'au 31 octobre 2026 pour les cycles postgraduate (honours, postgraduate diploma et master), pour la rentrée 2027. Pour la licence, dite undergraduate, la date limite était le 30 septembre 2026. La candidature à la bourse se fait en parallèle de la demande d'admission à l'UCT.";

const ETH_ANCIENNE = "Clôture le 30 novembre 2026 à 12h59, heure suisse, pour une entrée en master à l'automne 2027. La fenêtre de dépôt n'ouvre que le 1er novembre. Il n'y a pas de dossier séparé : la demande se fait dans la candidature au master, sur eApply. Conditions : être dans les 10 % meilleurs de votre licence, nommer deux professeurs référents et joindre une pré-proposition de mémoire de master. Environ 60 bourses par an. Décision fin mars, avec de possibles entretiens téléphoniques en février. 13 500 CHF par semestre, plus l'exonération des frais.";
const ETH_NOUVELLE = "Clôture le 30 novembre 2026 à 11h59, heure d'Europe centrale, pour une entrée en master à l'automne 2027. La fenêtre de dépôt n'ouvre que le 1er novembre. Il n'y a pas de dossier séparé : la demande se fait dans la candidature au master, sur eApply. Conditions : être dans les 10 % meilleurs de votre licence, nommer deux professeurs référents et joindre une pré-proposition de mémoire de master. Environ 60 bourses par an. Décision fin mars, avec de possibles entretiens téléphoniques en février. 13 500 CHF par semestre, plus l'exonération des frais.";

export const PATCHES = [

// ============================================================
// VÉRIFIÉ LE 2026-09-28 PAR CHARLES, AU NAVIGATEUR
// ============================================================

// Chevening : la bourse dit « Ouverte », ses 3 programmes « Fermée ». La
// fiche (details.js lit les deux statuts) affichait « Candidatures pas
// encore ouvertes », et le moteur écartait la bourse. Clôture confirmée :
// 6 octobre 2026 à 11:00 UTC. Après cette date, la carte se ferme d'elle-
// même (deadlineISO 2026-10-06).
...CHEVENING_PROGRAMMES.map((id) => ({
collection: "programs",
id,
attendu: { status: "Fermée" },
champs: { status: "Ouverte" },
motif: "Vérifié le 2026-09-28 sur https://www.chevening.org/scholarships/application-timeline/ : candidatures ouvertes, clôture le 6 octobre 2026 à 11:00 UTC. Le programme affichait « Fermée » sous une bourse ouverte."
})),
{
collection: "scholarships",
id: "chevening-scholarships",
attendu: { verifieLe: "2026-09-05" },
champs: { verifieLe: RELU_LE },
motif: "Vérifié le 2026-09-28 sur https://www.chevening.org/scholarships/application-timeline/ : clôture le 6 octobre 2026 à 11:00 UTC."
},

// Commonwealth Master's : bourse ET programmes disaient « Fermée » ; la
// carte et la fiche affichaient « Candidatures pas encore ouvertes » à 22
// jours de la clôture. Clôture confirmée : 20 octobre 2026 à 16:00 BST.
{
collection: "scholarships",
id: "commonwealth-masters-scholarships",
attendu: { status: "Fermée", verifieLe: "2026-09-05" },
champs: { status: "Ouverte", verifieLe: RELU_LE },
motif: "Vérifié le 2026-09-28 sur https://cscuk.fcdo.gov.uk/scholarships/commonwealth-masters-scholarships/ : candidatures 2027-2028 ouvertes, clôture le 20 octobre 2026 à 16:00 BST."
},
...CSC_MASTER.map((id) => ({
collection: "programs",
id,
attendu: { status: "Fermée" },
champs: { status: "Ouverte" },
motif: "Vérifié le 2026-09-28 sur https://cscuk.fcdo.gov.uk/scholarships/commonwealth-masters-scholarships/ : clôture le 20 octobre 2026 à 16:00 BST."
})),

// Commonwealth PhD : même cas, même date.
{
collection: "scholarships",
id: "commonwealth-phd-scholarships",
attendu: { status: "Fermée", verifieLe: "2026-09-05" },
champs: { status: "Ouverte", verifieLe: RELU_LE },
motif: "Vérifié le 2026-09-28 sur https://cscuk.fcdo.gov.uk/scholarships/commonwealth-phd-scholarships/ : candidatures 2027-2028 ouvertes, clôture le 20 octobre 2026 à 16:00 BST."
},
...CSC_PHD.map((id) => ({
collection: "programs",
id,
attendu: { status: "Fermée" },
champs: { status: "Ouverte" },
motif: "Vérifié le 2026-09-28 sur https://cscuk.fcdo.gov.uk/scholarships/commonwealth-phd-scholarships/ : clôture le 20 octobre 2026 à 16:00 BST."
}))

];

// ============================================================
// SECTION B — à n'écrire QU'APRÈS relecture de la page. Les preuves
// portent A_RELEVER (vide) : validerPatches() bloque le lot tant que la
// phrase officielle n'est pas recopiée. scripts/lot.mjs ne lit QUE
// `PATCHES` : déplacer chaque bloc dans PATCHES après relecture.
// ============================================================
export const PATCHES_CONDITIONNELS = [

// B9 (ex-A4, NON RELU). Fribourg : deadlineISO = 2026-11-01, qui est le jour où le LIEN
// de candidature est publié, pas une clôture (citation stockée). Dès le
// 2 novembre, le moteur tiendrait la bourse pour close pendant toute sa
// vraie fenêtre (1er novembre -> 28 février).
{
collection: "programs",
id: "universite-de-fribourg-fribourg__unifr-research-scholarships__doctorat",
attendu: { deadlineISO: "2026-11-01" },
champs: { deadlineISO: "2027-02-28" },
motif: "Audit du 2026-09-28 : la citation stockée dit « 28 February for stays starting on the following 1 September at the earliest (the application link will be published on 1 November) ». Le 1er novembre est l'ouverture, la clôture est le 28 février 2027."
},

// B10 (ex-A5, NON RELU). ETH ESOP : la prose dit 12h59, la citation stockée dit
// « 11.59h, MEZ ». On retient la lecture la plus prudente (11h59) ; si
// la page dit 23h59, corriger ici avant d'écrire.
{
collection: "programs",
id: "eth-zurich-zurich__eth-esop",
attendu: { deadline: ETH_ANCIENNE },
champs: { deadline: ETH_NOUVELLE },
motif: "Audit du 2026-09-28 : l'heure de la prose (12h59) ne correspond pas à la citation stockée « Nov, 1 - Nov, 30 2026, 11.59h, MEZ »."
},

// B0 (ex-A6, déplacé par la revue). UCT : la prose commence par la date de la LICENCE (30 septembre).
// Dès le 1er octobre, carte et fiche disent « Candidatures closes » alors
// que le postgraduate ferme le 31 octobre 2026 (citation stockée).
// DÉCISION DE CHARLES, d'où la section B : le programme couvre « Licence / Master » ; la carte dira
// « Date limite : 31 octobre 2026 » aussi à un lycéen. La vraie solution
// est deux programmes (LINKS avec `niveaux`, lot 105).
// ATTENTION TEST : test/lot114.test.mjs liste l'UCT parmi les bourses
// ABSENTES du bandeau (à 4 jours, le 26/09). Avec cette date, l'UCT est à
// 35 jours ce jour-là et entre dans le bandeau : le test rougira après
// l'export. Le fait a changé, pas la règle ; à expliquer dans la PR.
{
collection: "programs",
id: "university-of-cape-town-le-cap__mastercard-foundation-scholars-uct",
attendu: { deadline: UCT_ANCIENNE, deadlineISO: undefined },
champs: { deadline: UCT_NOUVELLE, deadlineISO: "2026-10-31" },
motif: "Audit du 2026-09-28 : la citation stockée le 2026-09-19 dit « Applications close 30 September 2026 (Undergraduate) and 31 October 2026 (Postgraduate) ». La prose lue par la carte fermait tout le programme au 1er octobre."
},

// B1. Honjo : les 4 programmes portent deadlineISO 2026-10-31 et la
// citation « Application Period September 1 – October 31 (2026) » (lue le
// 2026-09-20), mais la bourse et la prose disent « Fermée », « avril ».
// Si la page confirme : candidatures OUVERTES jusqu'au 31 octobre 2026.
{
collection: "scholarships",
id: "honjo-international-scholarship",
attendu: { status: "Fermée", periodeOuverture: "candidatures en avril chaque année, entretiens en juillet", verifieLe: "2026-09-05" },
champs: { status: "Ouverte", periodeOuverture: "chaque année, du 1er septembre au 31 octobre (calendrier 2026)", verifieLe: RELU_LE },
motif: "Audit du 2026-09-28 : la citation stockée donne une période du 1er septembre au 31 octobre 2026 ; la fiche disait « Fermée » et « avril ». À confirmer sur hisf.or.jp."
},
...[
["university-of-tokyo-tokyo__honjo-international-scholarship__doctorat", "2026-09-20T11:42:29.438Z"],
["university-of-tokyo-tokyo__honjo-international-scholarship__master", "2026-09-20T11:42:29.537Z"],
["waseda-university-tokyo__honjo-international-scholarship__doctorat", "2026-09-20T11:42:29.632Z"],
["waseda-university-tokyo__honjo-international-scholarship__master", "2026-09-20T11:42:29.734Z"]
].map(([id, le]) => ({
collection: "programs",
id,
attendu: {
status: "Fermée",
deadline: "La page officielle affiche encore le calendrier de 2024, avec des candidatures du 1er au 30 avril, cette année-là. Les candidatures se déposent chaque année en avril. Elles concernent les étudiants étrangers admis en master ou en doctorat dans une université japonaise. Le calendrier 2027 n'est pas publié : vérifiez sur la page officielle.",
ouverteVerifieeLe: "2026-09-20",
sourceVerification: { url: "https://www.hisf.or.jp/en/scholarship/foreigner/", citation: "Application Period September 1 – October 31 (2026)", parUid: PAR, le }
},
champs: {
status: "Ouverte",
deadline: "Jusqu'au 31 octobre 2026. La candidature concerne les étudiants étrangers admis en master ou en doctorat dans une université japonaise.",
ouverteVerifieeLe: RELU_LE,
sourceVerification: preuve("https://www.hisf.or.jp/en/scholarship/foreigner/", A_RELEVER)
},
motif: "Audit du 2026-09-28 : prose restée sur le calendrier 2024 alors que la date vérifiée (31 octobre 2026) est à venir."
})),

// B2. HSE INTO : citation stockée le 2026-09-20 « Application: September
// 10 - October 29, 2026 », mais statut « Fermée » et prose « calendrier
// 2025 ». Si la page confirme : OUVERTE jusqu'au 29 octobre 2026.
{
collection: "scholarships",
id: "hse-into-olympiad",
attendu: { status: "Fermée", verifieLe: "2026-09-05" },
champs: { status: "Ouverte", verifieLe: RELU_LE },
motif: "Audit du 2026-09-28 : la citation stockée donne une inscription du 10 septembre au 29 octobre 2026 ; la fiche disait « Fermée »."
},
{
collection: "programs",
id: "hse-university-moscow__hse-into-olympiad",
attendu: {
status: "Fermée",
deadline: "La page en anglais affiche encore le calendrier 2025 : inscription du 26 août au 26 octobre 2025, épreuves du 5 au 15 novembre 2025. Elle annonce que les informations sur la prochaine édition seront publiées bientôt. L'édition 2026 devrait suivre le même rythme, avec une inscription de fin août à fin octobre. Vérifiez-le sur la page officielle en russe.",
deadlineISO: undefined,
ouverteVerifieeLe: "2026-09-20",
sourceVerification: { url: "https://olymp.hse.ru/en/inter/", citation: "Application: September 10 - October 29, 2026", parUid: PAR, le: "2026-09-20T11:42:32.419Z" }
},
champs: {
status: "Ouverte",
deadline: "Inscription jusqu'au 29 octobre 2026 pour l'édition 2026 de l'olympiade internationale de la HSE. Vérifiez sur la page officielle les dates des épreuves.",
deadlineISO: "2026-10-29",
ouverteVerifieeLe: RELU_LE,
sourceVerification: preuve("https://olymp.hse.ru/en/inter/", A_RELEVER)
},
motif: "Audit du 2026-09-28 : date d'inscription 2026 stockée mais jamais reportée dans la prose ni le statut."
},

// B3. Université de Hambourg, bourses au mérite : la carte (statut de la
// bourse) promet un appel au 15 octobre 2026 ; la citation stockée du
// programme dit « No further calls for applications are currently planned
// for the merit scholarship program. » Si la page le confirme :
{
collection: "scholarships",
id: "uni-hamburg-leistungsstipendien",
attendu: { status: "Ouverte", periodeOuverture: "deux appels par an, le 15 avril et le 15 octobre", verifieLe: "2026-09-05" },
champs: { status: "Fermée, aucun nouvel appel prévu", periodeOuverture: "aucun nouvel appel n'est prévu pour l'instant ; jusqu'ici, deux dépôts par an, le 15 avril et le 15 octobre", verifieLe: RELU_LE },
motif: "Audit du 2026-09-28 : la carte annonçait un dépôt au 15 octobre 2026 alors que la page dit qu'aucun nouvel appel n'est prévu (citation stockée le 2026-09-19)."
},

// B4. Mastercard Foundation à Édimbourg : les séances d'information sont
// OBLIGATOIRES et se sont tenues du 15 au 24 septembre 2026 (prose et
// critères du catalogue). Depuis le lot 129, moteur et radar lisent
// deadlineISO (19 novembre) et proposent la bourse à 52 jours à des
// visiteurs qui ne peuvent plus candidater. Le mécanisme existe déjà :
// `portesAvant` (lot 66, Pearson). Si la page confirme que la séance
// conditionne l'invitation à candidater :
{
collection: "programs",
id: "university-of-edinburgh-edinburgh__mastercard-foundation-edinburgh",
attendu: { portesAvant: undefined },
champs: { portesAvant: [
{ dateISO: "2026-09-24", quoi: "la séance d'information obligatoire" },
{ dateISO: "2026-10-19", quoi: "la déclaration du candidat" }
] },
motif: "Audit du 2026-09-28 : la séance d'information obligatoire (15-24 septembre 2026) et la déclaration du 19 octobre sont des portes : les manquer ferme le cycle, même si le dossier complet est attendu le 19 novembre."
},

// B5. Bilkent : la carte dit « Candidatures ouvertes » ; la citation
// stockée (how-to-apply, lue le 2026-09-19) dit « Undergraduate
// applications for the 2026-2027 academic year fall semester will be open
// between 2 February – 12 July 2026 ». La bourse ne vise que la licence.
// À écrire si la page ne montre AUCUNE autre session ouverte.
{
collection: "scholarships",
id: "bilkent-international-scholarships",
attendu: { status: "Ouverte", verifieLe: "2026-09-05" },
champs: { status: "Fermée, admissions en licence closes le 12 juillet 2026", verifieLe: RELU_LE },
motif: "Audit du 2026-09-28 : fenêtre d'admission en licence du 2 février au 12 juillet 2026 (citation stockée) ; la carte annonçait « ouvertes »."
},
{
collection: "programs",
id: "bilkent-university-ankara__bilkent-international-scholarships",
attendu: { status: "Ouverte" },
champs: { status: "Fermée, admissions en licence closes le 12 juillet 2026" },
motif: "Audit du 2026-09-28 : même preuve que la bourse."
},

// B6. NL Scholarship : « Ouverte » alors que la prose et la citation
// stockée disent que le cycle ouvre début novembre (1er novembre 2025 pour
// 2026-2027). À écrire si la page ne montre pas encore l'appel 2027-2028.
{
collection: "scholarships",
id: "nl-scholarship",
attendu: { status: "Ouverte", verifieLe: "2026-09-05" },
champs: { status: "Fermée, appel 2027-2028 attendu début novembre", verifieLe: RELU_LE },
motif: "Audit du 2026-09-28 : le cycle 2026-2027 avait ouvert le 1er novembre 2025 (citation stockée) ; aucune ouverture 2027-2028 n'est établie."
},
...[
"delft-university-of-technology-delft__nl-scholarship",
"university-of-amsterdam-amsterdam__nl-scholarship"
].map((id) => ({
collection: "programs",
id,
attendu: { status: "Ouverte" },
champs: { status: "Fermée, appel 2027-2028 attendu début novembre" },
motif: "Audit du 2026-09-28 : même preuve que la bourse."
})),

// B7. UBC International Scholars Program : la prose dit « pas de
// candidature séparée » ; la citation stockée dit « Deadline to apply to
// UBC and submit an award application ... International Scholars Program
// awards ». Un moteur de recherche donne le 15 novembre 2026 : DATE NON
// LUE, à confirmer mot pour mot sur you.ubc.ca avant d'écrire.
{
collection: "programs",
id: "university-of-british-columbia-vancouver__ubc-international-scholars-program",
attendu: {
deadline: "Il n'y a pas de candidature séparée. Les étudiants internationaux sont pris en compte automatiquement pour les bourses au mérite IMES, Karen McKellin et Vantage One, s'ils candidatent à UBC avant la date limite d'admission. La page de la bourse ne donne pas cette date : elle renvoie au calendrier d'admission. Les décisions de bourse arrivent de la mi-février à la fin avril, après l'offre d'admission. La plupart des étudiants doivent accepter avant le 1er mai.",
deadlineISO: undefined,
ouverteVerifieeLe: "2026-09-19",
sourceVerification: { url: "https://you.ubc.ca/applying-ubc/dates-deadlines/", citation: "International applicants: Deadline to apply to UBC and submit an award application if you’re an international student and you wish to be considered for the UBC International Scholars Program awards .", parUid: PAR, le: "2026-09-19T22:05:03.335Z" }
},
champs: {
deadline: "Jusqu'au 15 novembre 2026 : pour être pris en compte pour les bourses de l'International Scholars Program, vous devez avoir candidaté à UBC et déposé la demande de bourse avant cette date. Les bourses au mérite IMES, elles, sont examinées automatiquement si vous candidatez à UBC avant la date limite d'admission. Les décisions arrivent de la mi-février à la fin avril, après l'offre d'admission.",
deadlineISO: "2026-11-15",
ouverteVerifieeLe: RELU_LE,
sourceVerification: preuve("https://you.ubc.ca/applying-ubc/dates-deadlines/", A_RELEVER)
},
motif: "Audit du 2026-09-28 : l'International Scholars Program exige une demande de bourse avant une date propre, antérieure à la date d'admission de janvier ; la fiche disait « pas de candidature séparée »."
},

// B8. Commonwealth Shared : le catalogue annonce une ouverture en
// décembre et une clôture en mars-avril ; un moteur de recherche lit sur
// cscuk.fcdo.gov.uk « scheduled to open in early November 2026 and close
// in mid-December 2026 ». NON LU : à confirmer avant d'écrire. Aucune
// date précise n'est écrite (le texte n'en publie pas encore).
{
collection: "scholarships",
id: "commonwealth-shared-scholarships",
attendu: { periodeOuverture: "ouverture en décembre, puis clôture en mars ou avril selon l'université", verifieLe: "2026-09-05" },
champs: { periodeOuverture: "ouverture début novembre et clôture à la mi-décembre, pour l'appel 2027-2028, par les universités britanniques partenaires", verifieLe: RELU_LE },
motif: "Audit du 2026-09-28 : calendrier 2027-2028 annoncé plus tôt que la période du catalogue (à confirmer sur la page officielle)."
},
...[
["imperial-college-london-london__commonwealth-shared-scholarships__master", "2026-09-20T11:41:11.421Z"],
["university-of-edinburgh-edinburgh__commonwealth-shared-scholarships__master", "2026-09-20T11:41:11.527Z"],
["university-of-oxford-oxford__commonwealth-shared-scholarships__master", "2026-09-20T11:41:11.627Z"]
].map(([id, le]) => ({
collection: "programs",
id,
attendu: {
deadline: "L'appel 2026-2027 est terminé : le site officiel indique que les candidatures pour l'année 2026/27 sont closes. Vous candidatez par les universités britanniques partenaires, qui font une présélection. L'appel 2027-2028 devrait ouvrir en décembre 2026. Chaque université fixe sa propre date de clôture, souvent en mars ou en avril. Vérifiez ces dates sur la page officielle.",
ouverteVerifieeLe: "2026-09-20",
sourceVerification: { url: "https://cscuk.fcdo.gov.uk/scholarships/commonwealth-shared-scholarships-applications/", citation: "Applications for Commonwealth Shared Scholarships for the 2026/27 academic year are now closed.", parUid: PAR, le }
},
champs: {
deadline: "L'appel 2026-2027 est terminé. L'appel 2027-2028 doit ouvrir début novembre 2026 et fermer à la mi-décembre 2026 ; les dates exactes seront publiées plus près de l'ouverture. Vous candidatez par les universités britanniques partenaires, qui font une présélection.",
ouverteVerifieeLe: RELU_LE,
sourceVerification: preuve("https://cscuk.fcdo.gov.uk/scholarships/commonwealth-shared-scholarships-applications/", A_RELEVER)
},
motif: "Audit du 2026-09-28 : clôture 2027-2028 à la mi-décembre 2026 et non en mars-avril (à confirmer)."
}))

];

// ============================================================
// SECTION C — BASCULES À DATE : statut « Fermée » à passer « Ouverte »
// le jour de l'ouverture, APRÈS l'avoir vu sur la page. Sans elles, la
// carte dit « pas encore ouvertes » pendant toute la fenêtre.
//   01/10 Rotary Yoneyama (6 programmes ; leur citation « Applications
//         are currently closed » est à remplacer)
//   05/10 Deutschlandstipendium, Université de Hambourg (programme)
//   07/10 AUC African et International Graduate Fellowships
//   12/10 Landesstipendium Niedersachsen
//   15/10 Politecnico di Torino, 2e session
//   01/11 ETH ESOP ; Université de Fribourg
//   03/11 Bocconi PhD (cycle 43)
//   12/11 Bocconi Merit Award (session anticipée)
//   14/12 Politecnico di Milano PhD, 3e appel
// Forme type (exemple AUC, programme) :
// { collection: "programs",
//   id: "american-university-in-cairo-le-caire__auc-african-graduate-fellowship__master",
//   attendu: { status: "Fermée" },
//   champs: { status: "Ouverte", ouverteVerifieeLe: RELU_LE,
//             sourceVerification: preuve("https://www.aucegypt.edu/admissions/fellowships/deadlines", A_RELEVER) },
//   motif: "Fenêtre du 7 octobre au 2 novembre 2026 ouverte, vue le …" }
// ============================================================
