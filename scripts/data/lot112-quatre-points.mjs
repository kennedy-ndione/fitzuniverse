/**
* ============================================================
* LOT 112 — LES QUATRE POINTS (2026-09-26)
* ============================================================
*
* Décision de Charles : « fais les 4 points en même temps ». Ce fichier
* porte la part DONNÉES des points 1 et 2 ; le code (diagnostic, moteur,
* guides visa, réglage des rappels) est dans le même commit.
*
* POINT 1 — LES PIÈCES DES SIX BOURSES RESTÉES SANS LISTE (lot 110 :
* « introuvables sur une page lisible »). Relues le 2026-09-26 :
*   - Bilkent : page des bourses + « How to Apply » + formulaire en ligne
*     (frais de 30 USD) ; la bourse se décide sur le dossier d'admission.
*   - Reach Oxford : la page dit que la demande exige d'abord une offre
*     d'Oxford, et que le formulaire 2027 paraîtra en janvier 2027
*     (clôture le 26 janvier 2027). Trois pièces, dont deux annoncées sans
*     leur détail : c'est dit dans la pièce.
*   - Mastercard Foundation à l'UM6P : page um6p.ma du programme
*     (candidature à l'UM6P, concours, puis candidature distincte).
*   - SNU Global et Glo-Harmony : guide d'admission SNU printemps 2027
*     (liste des pièces, apostille, traductions) + page des bourses.
*   - UTokyo Fellowship : les lignes directrices 2026 de l'université ne
*     listent aucune pièce (« Submit the documents … to the relevant
*     section of one's affiliated (proposed) Graduate School ») ; la liste
*     posée est celle de l'école des sciences des frontières (GSFS),
*     présentée comme telle dans la première pièce.
*
* POINT 2 — CE QUE LE DIAGNOSTIC SAIT DÉSORMAIS LIRE.
*   - `experienceProMinAns` (années, nombre ou par cycle) et
*     `experienceApresDiplome` : Chevening (2 800 heures, après la
*     licence : chevening.org/.../work-experience), DAAD-EPOS (2 ans après
*     la licence), Banque mondiale JJ/WBGSP (3 ans depuis la licence :
*     worldbank.org), Université Senghor (1 an), Swedish Institute
*     (3 000 heures pour les pays africains éligibles, dont le Sénégal :
*     si.se ; posé à 1,5 an, borne basse volontaire — 3 000 heures font
*     environ un an et demi à temps plein —, pour n'écarter que qui est
*     sûrement en dessous).
*   - La JJ/WBGSP portait le code `experience_pro_2ans` : elle en exige
*     trois. Remplacé par `experience_pro_requise` (sans chiffre), posé
*     aussi sur la Senghor, le Swedish Institute et l'ABE (JICA, dont la
*     fiche dit « une expérience professionnelle est exigée » sans durée
*     vérifiable aujourd'hui : code seul, aucun filtre).
*   - `ageMaxHommes` : l'Université panafricaine (PAUSTI, PAUWES) fixe
*     25 ans en master et 28 ans en doctorat pour les hommes (28 et 30
*     pour les femmes, déjà dans `ageMax`).
*
* Écarté, et pourquoi : la KOICA. Sa page officielle (koica.go.kr/ciat,
* « Application Procedure », lue le 2026-09-26) ne chiffre aucune
* expérience ; elle réserve le programme aux fonctionnaires nommés par
* leur gouvernement, et le doctorat aux anciens boursiers du master
* KOICA. Aucune durée n'est posée ; le reste va au lot des 36 bourses.
*
* EXÉCUTION (sur l'ordinateur de Charles) :
*   node scripts\lot.mjs analyser 112-quatre-points
*   node scripts\lot.mjs ecrire 112-quatre-points
*   node scripts\lot.mjs verifier 112-quatre-points
* ============================================================
*/

const LU = "2026-09-26T01:10:00.000Z";
const PAR = "IlXJmAScj2U5ucV2ctUgeJjadNd2";

const preuve = (url, citation) => ({ url, citation, le: LU, parUid: PAR });

// Les pièces d'admission de la SNU (guide printemps 2027), communes aux
// deux bourses qui se demandent APRÈS l'admission.
const PIECES_ADMISSION_SNU = [
{ label: "Formulaire de candidature en ligne de la SNU", detail: "Rempli sur le site de candidature, pendant la période d'admission (du 6 au 9 juillet 2026 pour la rentrée de printemps 2027)." },
{ label: "Lettre de motivation et plan d'études", detail: "Chaque rubrique est limitée à 3 000 octets." },
{ label: "Deux lettres de recommandation", detail: "Vos recommandants les déposent eux-mêmes sur le site désigné : ils reçoivent la consigne par e-mail après le paiement de vos frais de dossier." },
{ label: "Preuve de niveau en coréen ou en anglais", detail: "TOPIK niveau 3, ou TOEFL iBT 80, IELTS 6,0 ou TEPS 269 ; à défaut, un document officiel attestant que vos études se sont déroulées en coréen ou en anglais." },
{ label: "Diplômes et relevés de notes", detail: "Licence, et master pour un doctorat. Après l'admission préliminaire, ils doivent être apostillés ou légalisés par l'ambassade de Corée, puis envoyés par la poste." },
{ label: "Copie du passeport en cours de validité", detail: "Elle prouve votre nationalité." },
{ label: "Preuve de la nationalité de vos parents et du lien de filiation", detail: "Un document par parent, et l'acte de naissance ou le livret de famille. En cas de famille monoparentale, de décès ou de divorce, seul le document du tuteur légal est demandé." },
{ label: "Traductions certifiées", detail: "Pour toute pièce qui n'est ni en coréen ni en anglais." }
];

const SNU_GUIDE = "https://en.snu.ac.kr/webdata/uploads/eng/file/2026/06/2027Spring_graduate_eng.pdf";

export const PATCHES = [

// ---------------- POINT 1 : les pièces ----------------

{
collection: "scholarships",
id: "bilkent-international-scholarships",
champs: {
piecesDossier: {
type: "admission",
pieces: [
{ label: "Formulaire de candidature en ligne des étudiants internationaux", detail: "Sur le portail d'admission de Bilkent, pendant la session d'admission. Frais de dossier : 30 USD, non remboursables." },
{ label: "Relevés de notes du secondaire", detail: "La bourse est décidée d'après vos notes du lycée. Les notes prévisionnelles ne sont pas examinées." },
{ label: "Résultats d'examen national ou international", detail: "SAT, A Level, IB ou un diplôme national de la liste acceptée par Bilkent, au minimum publié pour votre programme." },
{ label: "Originaux de toutes les pièces envoyées", detail: "Ils vous seront demandés après l'admission : conservez-les." }
],
sourceVerification: preuve("https://w3.bilkent.edu.tr/international/scholarships-for-international-students/", "Prospective students who apply for financial assistance are evaluated according to their high school grades, their national and/or international exam scores, their program choices, and other relevant academic criteria.")
}
},
motif: "Lot 112 — 4 pièces lues sur les pages officielles de Bilkent (bourses, How to Apply, formulaire)."
},

{
collection: "scholarships",
id: "reach-oxford-scholarship",
champs: {
piecesDossier: {
type: "propre",
pieces: [
{ label: "Offre d'admission en premier cycle à Oxford", detail: "Obtenue par la candidature UCAS de la mi-octobre. Sans offre, la demande de bourse n'est pas examinée." },
{ label: "Formulaire de demande Reach Oxford", detail: "Oxford le publie en janvier 2027 sur la page de la bourse. Clôture le 26 janvier 2027." },
{ label: "Justificatifs de votre situation financière", detail: "Le besoin financier est un critère majeur de sélection. La liste exacte des justificatifs paraîtra avec le formulaire, en janvier 2027." }
],
sourceVerification: preuve("https://www.ox.ac.uk/admissions/undergraduate/fees-and-funding/oxford-bursaries-and-scholarships/reach-oxford", "Students should note they must apply for admission to the University before they can be considered for a Reach Oxford Scholarship.")
}
},
motif: "Lot 112 — 3 pièces : l'offre, le formulaire annoncé pour janvier 2027 (clôture le 26 janvier), le besoin financier."
},

{
collection: "scholarships",
id: "mastercard-foundation-scholars-um6p",
champs: {
piecesDossier: {
type: "propre",
pieces: [
{ label: "Candidature en ligne à l'UM6P", detail: "C'est la première étape : la candidature d'admission, puis, pour les profils admissibles, un concours d'entrée écrit et oral." },
{ label: "Candidature distincte au programme Mastercard Foundation", detail: "Une fois admise à l'UM6P, vous déposez une candidature séparée pour la bourse." },
{ label: "Justificatifs de votre situation financière", detail: "La situation financière ou de vulnérabilité fait partie des critères de sélection publiés." },
{ label: "Pièces d'identité officielles", detail: "Pour une candidate réfugiée ou déplacée sans papiers officiels, l'UM6P étudie chaque situation avec l'AMCI et le HCR." }
],
sourceVerification: preuve("https://www.um6p.ma/fr/programme-mastercard-foundation-lum6p", "Une fois admises à l'UM6P, les étudiantes éligibles peuvent déposer une candidature distincte pour bénéficier de la bourse du programme Mastercard Foundation.")
}
},
motif: "Lot 112 — 4 pièces lues sur la page du programme à l'UM6P."
},

{
collection: "scholarships",
id: "snu-global-scholarship",
champs: {
piecesDossier: {
type: "admission",
pieces: [
...PIECES_ADMISSION_SNU,
{ label: "Demande de bourse auprès de la SNU après l'admission", detail: "Dès la réponse d'admission, contactez le bureau des bourses internationales de la SNU (coordonnées sur la page officielle)." }
],
sourceVerification: preuve(SNU_GUIDE, "Two Letters of Recommendation - Submissions must be made through designated website")
}
},
motif: "Lot 112 — 8 pièces du guide d'admission SNU (printemps 2027) + la demande après admission."
},

{
collection: "scholarships",
id: "snu-glo-harmony-scholarship",
champs: {
piecesDossier: {
type: "admission",
pieces: [
...PIECES_ADMISSION_SNU,
{ label: "Dossier Glo-Harmony remis au bureau des affaires internationales de la SNU", detail: "En janvier ou en juillet, après l'admission. La SNU présélectionne, puis la Fondation Samsung examine les dossiers et fait passer des entretiens." }
],
sourceVerification: preuve("https://en.snu.ac.kr/admission/graduate/scholarships/after_admission", "Students submit applications to SNU's Office of Global Affairs → The Office makes the first selection → Samsung Foundation conduct reviews and interviews → Final selection")
}
},
motif: "Lot 112 — 8 pièces du guide d'admission SNU (printemps 2027) + le dossier Glo-Harmony."
},

{
collection: "scholarships",
id: "utokyo-fellowship",
champs: {
piecesDossier: {
type: "admission",
pieces: [
{ label: "Formulaire de candidature à la bourse", detail: "Liste de l'école des sciences des frontières (GSFS). Chaque école doctorale fixe la sienne et ses dates : faites-la confirmer par son bureau international." },
{ label: "Lettre de recommandation de votre ancien directeur", detail: "De préférence celui de votre master." },
{ label: "Projet de recherche", detail: "" },
{ label: "Liste de vos travaux", detail: "" },
{ label: "Relevés de notes de licence et de master", detail: "Accompagnés du barème de notation de votre université." },
{ label: "Copie de vos articles publiés", detail: "Jusqu'à trois articles principaux." }
],
sourceVerification: preuve("https://www.k.u-tokyo.ac.jp/en/exam/master/foreign_research_students/tokyo_fellowship/", "Recommendation letter from your former supervisor (preferably from your master program supervisor)")
}
},
motif: "Lot 112 — liste de la GSFS, présentée comme telle : l'université ne publie aucune liste commune."
},

// ---------------- POINT 2 : l'expérience et le genre ----------------

{
collection: "scholarships",
id: "chevening-scholarships",
champs: { experienceProMinAns: 2, experienceApresDiplome: true },
motif: "Lot 112 — 2 800 heures, acquises après la licence (chevening.org, Work experience)."
},

{
collection: "scholarships",
id: "daad-epos",
champs: { experienceProMinAns: 2, experienceApresDiplome: true },
motif: "Lot 112 — au moins deux ans d'expérience après la licence (fiche vérifiée)."
},

{
collection: "scholarships",
id: "jj-wbgsp",
attendu: { exigences: ["experience_pro_2ans", "admission_prealable", "candidature_via_etablissement"] },
champs: {
exigences: ["experience_pro_requise", "admission_prealable", "candidature_via_etablissement"],
experienceProMinAns: 3,
experienceApresDiplome: true
},
motif: "Lot 112 — trois ans d'emploi rémunéré depuis la licence (worldbank.org) : le code « deux ans » était faux."
},

{
collection: "scholarships",
id: "universite-senghor-master-developpement",
attendu: { exigences: [] },
champs: { exigences: ["experience_pro_requise"], experienceProMinAns: 1 },
motif: "Lot 112 — un an d'expérience pertinente pour entrer en première année (fiche vérifiée)."
},

{
collection: "scholarships",
id: "swedish-institute-scholarships-global-professionals",
attendu: { exigences: ["admission_prealable"] },
champs: { exigences: ["admission_prealable", "experience_pro_requise"], experienceProMinAns: 1.5 },
motif: "Lot 112 — 3 000 heures pour les candidats des pays africains éligibles (si.se), posées à 1,5 an."
},

{
collection: "scholarships",
id: "abe-initiative-jica",
attendu: { exigences: ["nomination_autorite_nationale"] },
champs: { exigences: ["nomination_autorite_nationale", "experience_pro_requise"] },
motif: "Lot 112 — « une expérience professionnelle est exigée » : le code, sans durée ni filtre."
},

{
collection: "scholarships",
id: "pan-african-university-pausti",
champs: { ageMaxHommes: { master: 25, doctorat: 28 } },
motif: "Lot 112 — limites d'âge des hommes (appel de l'Université panafricaine)."
},

{
collection: "scholarships",
id: "pan-african-university-pauwes",
champs: { ageMaxHommes: { master: 25, doctorat: 28 } },
motif: "Lot 112 — limites d'âge des hommes (appel 2026-2027)."
}

];

export const UNIVERSITIES = [];
export const SCHOLARSHIPS = [];
export const LINKS = [];
export const SUPPRESSIONS = [];
