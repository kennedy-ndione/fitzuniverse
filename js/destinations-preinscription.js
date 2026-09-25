/**
* ============================================================
* FitzUniverse — les DESTINATIONS accompagnées comme la France
* (2026-09-23, décision de Charles : « finir les pays restants comme on
* l'a fait avec la France », les six le même jour ; puis, le soir même,
* « ajouter la Chine et la Malaisie », au même prix)
* ============================================================
*
* Module PUR : aucun DOM, aucun Firestore. Il porte, pour la Roumanie,
* la Turquie, le Maroc, l'Italie, l'Allemagne, le Canada, la Chine et la
* Malaisie, tout ce que
* la route, le diagnostic et la vitrine ont besoin de savoir en plus de
* la procédure officielle (js/procedures/<pays>.js) :
*
*   - la CONFIG de l'accompagnement : préfixe des vœux, plafond, langue
*     des cours, niveaux, étape de dépôt ;
*   - les TEXTES « EN CLAIR » de chaque étape de la procédure : deux ou
*     trois phrases courtes, sans chiffre, sans date, sans montant, sans
*     nom de lieu (même règle que la route France : un test les passe à
*     defautsDesEnClair). Le texte officiel reste servi en dessous, mot
*     pour mot, avec sa source ;
*   - les FAITS DU DIAGNOSTIC : ressources exigées, droits, frais fixes,
*     calendrier — chacun avec sa source officielle et sa date de
*     lecture. Lus le 2026-09-23 sur des pages officielles (ministères,
*     consulats, universités) ; aucun agrégateur. Ce qui n'a pas été
*     trouvé est DIT dans `absences`, jamais estimé.
*
* LA FRANCE N'EST PAS ICI. Elle garde sa route à quinze étapes
* (js/route-preinscription.js), son Diagnostic France et ses couches de
* résidence : rien de ce module ne la touche.
*
* LES FORMULES SONT CELLES DE LA FRANCE (décision de Charles, même
* jour) : 10 000 F le diagnostic, 75 000 F le dossier, 150 000 F avec
* un conseiller, pour chaque pays. Les identifiants d'offre ne changent
* pas (diagnostic-france, dossier-france, dossier-france-conseiller) :
* c'est la DESTINATION, portée par l'achat, qui dit à quel pays la
* formule s'applique (users/{uid}.preinscriptionsPays.<id>).
* ============================================================
*/

/** L'ordre des destinations, celui de js/pays-preinscription.js (France exclue). */
export const DESTINATIONS_ACCOMPAGNEES = ["roumanie", "turquie", "maroc", "italie", "allemagne", "canada", "chine", "malaisie"];

/** Toutes les destinations vendues, France comprise. */
export const DESTINATIONS_VENDUES = ["france", ...DESTINATIONS_ACCOMPAGNEES];

/** Le préfixe des vœux d'une destination (applications/pre-<code>-N). La France garde pre-N. */
export const PREFIXES_VOEU = {
roumanie: "pre-ro",
turquie: "pre-tr",
maroc: "pre-ma",
italie: "pre-it",
allemagne: "pre-de",
canada: "pre-ca",
chine: "pre-cn",
malaisie: "pre-my"
};

/**
* LA LANGUE DES COURS — la question 7 de « Votre situation », par pays.
* Mêmes quatre réponses que la question France (études faites dans la
* langue, test passé, test prévu, pas décidé), mais les langues et les
* tests sont ceux du pays. Clé propre à chaque pays dans le profil :
* un étudiant qui vise la France ET l'Italie ne répond pas une fois
* pour deux langues.
*/
const LANGUES = {
roumanie: { libelle: "Et la langue des cours (roumain, français ou anglais) ?", etudes: "J'ai fait mes études en français ou en anglais", test: "J'ai passé un test de langue reconnu" },
turquie: { libelle: "Et la langue des cours (turc ou anglais) ?", etudes: "J'ai fait mes trois dernières années de lycée dans un pays anglophone", test: "J'ai passé un test de turc ou d'anglais (TÖMER, IELTS, TOEFL…)" },
maroc: { libelle: "Et le français ?", etudes: "J'ai fait mes études en français", test: "J'ai passé un test de français (TCF, DELF…)" },
italie: { libelle: "Et la langue des cours (italien ou anglais) ?", etudes: "J'ai fait mes études en anglais", test: "J'ai passé un test d'italien ou d'anglais (CELI, CILS, IELTS…)" },
allemagne: { libelle: "Et l'allemand ou l'anglais ?", etudes: "J'ai fait mes études en anglais", test: "J'ai passé un test (TestDaF, DSH, Goethe, IELTS, TOEFL…)" },
canada: { libelle: "Et la langue des cours (français ou anglais) ?", etudes: "J'ai fait mes études en français ou en anglais", test: "J'ai passé un test (TCF, TEF, IELTS, TOEFL…)" },
chine: { libelle: "Et la langue des cours (chinois ou anglais) ?", etudes: "J'ai fait mes études en anglais", test: "J'ai passé un test de chinois ou d'anglais (HSK, IELTS, TOEFL…)" },
malaisie: { libelle: "Et la langue des cours (anglais ou malais) ?", etudes: "J'ai fait mes études en anglais", test: "J'ai passé un test d'anglais (IELTS, TOEFL, MUET…)" }
};

export function questionLangue(id) {
const l = LANGUES[id];
if (!l) return null;
return {
cle: `situationLangue_${id}`,
libelle: l.libelle,
type: "choix",
options: ["etudes_dans_la_langue", "test_passe", "test_prevu", "aucun"],
libelles: { etudes_dans_la_langue: l.etudes, test_passe: l.test, test_prevu: "Je vais passer un test", aucun: "Pas encore décidé" }
};
}

/**
* LA CONFIG DE CHAQUE DESTINATION.
*
*   nom             tel que le catalogue et les procédures l'écrivent
*   code            le drapeau (assets/flags/<code>.svg)
*   plafondVoeux    le nombre de vœux suivis. Quand le pays fixe un
*                   plafond officiel, c'est lui (Italie : un seul cours ;
*                   Türkiye Bursları : douze préférences). Sinon, sept —
*                   le même accompagnement que le dossier France.
*   plafondOfficiel la phrase et la source qui fondent le plafond, ou null
*   niveaux         les niveaux proposés au vœu
*   etapesDepot     les étapes de la procédure où le dossier part : leur
*                   preuve est exigée, et elle vaut pour tous les vœux du
*                   pays (comme le numéro de dossier Études en France).
*                   Plusieurs quand le pays a plusieurs portes (Turquie :
*                   la bourse ou l'autofinancement ; Maroc : l'AMCI, l'UM6P
*                   ou Al Akhawayn)
*   etapeReponses   l'étape où l'on note, vœu par vœu, la réponse reçue
*   motivations     vrai si une lettre de motivation est à écrire par vœu
*                   (faux au Maroc : le formulaire AMCI n'en demande pas)
*   motivationsAvant (facultatif) des étapes AVANT lesquelles poser les
*                   lettres, quand une pièce en dépend avant le dépôt
*                   (Chine : le projet d'études de la bourse)
*   devise          la devise de la plupart des montants du pays
*   etapesCandidature les étapes où l'étudiant dépose LUI-MÊME sa
*                   candidature sur le site d'une université (relecture du
*                   2026-09-25). Elles se règlent VŒU PAR VŒU : chaque vœu
*                   montre ce que son université demande (le bloc
*                   « admission » de sa fiche du catalogue), la vérification
*                   par Fitz, son site, puis se déclare déposé avec un
*                   numéro, une capture ou l'e-mail de confirmation.
*   etapeUniversite (Italie) une étape de candidature AJOUTÉE à la
*                   procédure nationale, placée juste avant l'étape
*                   `avant` : la plupart des universités italiennes font
*                   candidater sur leur propre site avant Universitaly.
*                   Ce n'est pas un dépôt du pays (Universitaly l'est) :
*                   Quand la fiche de l'université du vœu dit que ce niveau
*                   passe d'abord par Universitaly (admission.
*                   portailNationalDabord), l'étape se place après
*                   `apres` et devient « Suivre les démarches de votre
*                   université » (titreApres, enClairApres) : ni dépôt ni
*                   preuve, un simple « C'est fait ».
*   etapeVoeuxOfficielle l'étape de la procédure qui fait CHOISIR
*                   l'établissement : elle se fond dans l'étape « vœux »
*                   de la route (son texte officiel y est servi), au lieu
*                   de faire choisir deux fois. Pas en Chine ni au Maroc
*                   (leurs choix vivent dans une voie), ni en Allemagne
*                   (de_voeux y est le dépôt sur uni-assist).
*   voies           (Turquie, Maroc, Chine) les PORTES du pays : une étape de la
*                   procédure où l'étudiant choisit sa voie, et les étapes
*                   propres à chaque voie. Une fois la voie choisie, les
*                   étapes des autres voies sortent de sa route — il n'a
*                   pas onze étapes à déclarer « ne me concerne pas ».
*/
export const DESTINATIONS = {

roumanie: {
id: "roumanie", nom: "Roumanie", code: "ro",
plafondVoeux: 7,
plafondOfficiel: null,
niveaux: ["Année préparatoire de roumain", "Licence", "Master", "Doctorat"],
etapesDepot: ["ro_dossier"],
etapesCandidature: ["ro_dossier"],
etapeVoeuxOfficielle: "ro_programme",
etapeReponses: "ro_scrisoare",
motivations: true,
devise: "EUR"
},

turquie: {
id: "turquie", nom: "Turquie", code: "tr",
plafondVoeux: 12,
plafondOfficiel: {
texte: "Türkiye Bursları : douze préférences au maximum dans le système de candidature. En autofinancement, chaque université fixe son propre maximum.",
source: "https://turkiyeburslari.gov.tr/whyturkiyescholarships",
verifieLe: "2026-09-23"
},
niveaux: ["Licence", "Master", "Doctorat", "Formation courte (ön lisans)"],
etapesDepot: ["tr_tb_soumission", "tr_uni_candidature"],
etapesCandidature: ["tr_uni_candidature"],
etapeReponses: "tr_admission",
motivations: true,
devise: "USD",
voies: {
etape: "tr_choix_voie",
question: "Quelle voie choisissez-vous ?",
options: [
{ id: "bourse", libelle: "La bourse Türkiye Bursları", aide: "La bourse vous place elle-même dans une université : une seule candidature par an, douze préférences au plus.", etapes: ["tr_tb_compte", "tr_tb_pieces", "tr_tb_voeux", "tr_tb_soumission", "tr_tb_entretien", "tr_tb_reponse"] },
{ id: "autofinancement", libelle: "L'autofinancement", aide: "Un dossier par université choisie, avec ce qu'elle accepte : l'examen TR-YÖS, le SAT ou les notes de votre bac.", etapes: ["tr_yos_inscription", "tr_yos_paiement", "tr_uni_candidature"] }
]
}
},

maroc: {
id: "maroc", nom: "Maroc", code: "ma",
plafondVoeux: 7,
plafondOfficiel: null,
niveaux: ["Licence", "Master", "Doctorat", "Classes préparatoires", "École d'ingénieurs", "Médecine, pharmacie ou dentaire"],
etapesDepot: ["ma_depot", "ma_um6p", "ma_aui"],
etapesCandidature: ["ma_um6p", "ma_aui"],
etapeReponses: "ma_autorisation",
motivations: false,
devise: "MAD",
voies: {
etape: "ma_porte_entree",
question: "Par quelle porte entrez-vous ?",
options: [
{ id: "amci", libelle: "Une université publique, par l'AMCI", aide: "Votre dossier part d'un service de votre pays, puis passe par les ambassades jusqu'à l'AMCI.", etapes: ["ma_formulaire", "ma_voeux", "ma_pieces", "ma_depot", "ma_transmission", "ma_selection", "ma_autorisation"] },
{ id: "um6p", libelle: "L'UM6P, en direct", aide: "Université à but non lucratif, reconnue par l'État : vous candidatez vous-même sur son site, formation par formation.", etapes: ["ma_um6p"], universites: ["universite-mohammed-vi-polytechnique-benguerir"], motifs: ["um6p", "mohammed vi polytechnique"], libelleVoeu: "à l'UM6P" },
{ id: "aui", libelle: "Al Akhawayn, en direct", aide: "Université publique autonome, où l'on étudie en anglais : vous candidatez vous-même, sans l'AMCI.", etapes: ["ma_aui"], universites: ["al-akhawayn-university-ifrane"], motifs: ["akhawayn"], libelleVoeu: "à Al Akhawayn" }
]
}
},

italie: {
id: "italie", nom: "Italie", code: "it",
plafondVoeux: 1,
plafondOfficiel: {
texte: "Universitaly : un candidat titulaire d'un titre étranger n'indique qu'UN SEUL cours. Il n'y a pas de vœux multiples.",
source: "https://www.unipi.it/didattica/iscrizioni/immatricolazioni-e-iscrizioni/iscrizioni-per-studenti-internazionali/preiscrizione-su-universitaly/",
verifieLe: "2026-09-23"
},
niveaux: ["Laurea (licence)", "Laurea Magistrale (master)", "Cycle unique (médecine, droit…)", "Doctorat", "Foundation course"],
etapesDepot: ["it_soumission"],
etapesCandidature: ["candidature_universite"],
etapeUniversite: {
id: "candidature_universite",
avant: "it_comparabilite",
// Quand l'université du vœu fait passer d'abord par Universitaly (sa
// fiche le dit : admission.portailNationalDabord), l'étape vient après
// la validation, sous ce titre-là.
apres: "it_validation",
titreApres: "Suivre les démarches de votre université",
enClairApres: "Votre université fait passer d'abord par Universitaly. Une fois votre préinscription validée, c'est elle qui vous demande la suite : un test, l'évaluation de votre dossier, puis l'inscription. Lisez ci-dessous ce qu'elle demande, suivez-le sur son site, puis dites que c'est fait.",
titre: "Candidater auprès de votre université",
enClair: "En Italie, la plupart des universités examinent d'abord votre dossier sur leur propre site, avant Universitaly. Lisez ci-dessous ce que demande la vôtre, faites vérifier votre dossier par Fitz, puis déposez-le sur son site. Gardez le numéro ou l'e-mail de confirmation : il se déclare ici. Si votre université passe directement par Universitaly, dites-le en bas de l'étape."
},
etapeVoeuxOfficielle: "it_cours",
etapeReponses: "it_validation",
motivations: true,
// Les lettres se déposent avec la candidature à l'université.
motivationsAvant: ["candidature_universite"],
devise: "EUR"
},

allemagne: {
id: "allemagne", nom: "Allemagne", code: "de",
plafondVoeux: 7,
plafondOfficiel: null,
niveaux: ["Studienkolleg", "Bachelor (licence)", "Master", "Doctorat"],
etapesDepot: ["de_voeux"],
etapesCandidature: ["de_voeux"],
etapeReponses: "de_zulassung",
motivations: true,
devise: "EUR"
},

canada: {
id: "canada", nom: "Canada", code: "ca",
plafondVoeux: 7,
plafondOfficiel: null,
niveaux: ["Baccalauréat (licence)", "Maîtrise", "Doctorat", "DESS"],
etapesDepot: ["ca_candidature"],
etapesCandidature: ["ca_candidature"],
etapeVoeuxOfficielle: "ca_eed",
etapeReponses: "ca_lettre_acceptation",
motivations: true,
devise: "CAD"
},

chine: {
id: "chine", nom: "Chine", code: "cn",
plafondVoeux: 7,
plafondOfficiel: {
texte: "Bourse du gouvernement chinois : trois universités au plus dans la demande (ambassade de Chine au Sénégal, 2026-2027). En autofinancement, chaque université fixe ses règles : deux programmes au plus à Tsinghua.",
source: "https://sn.china-embassy.gov.cn/fra/sgdt/202510/t20251028_11742627.htm",
verifieLe: "2026-09-23"
},
niveaux: ["Année préparatoire de chinois", "Licence", "Master", "Doctorat"],
etapesDepot: ["cn_bourse_soumission", "cn_uni_candidature"],
etapesCandidature: ["cn_uni_candidature"],
etapeReponses: "cn_admission",
motivations: true,
// Le projet d'études est une PIÈCE de la bourse : les lettres s'écrivent
// avant de la cocher, pas après.
motivationsAvant: ["cn_bourse_pieces"],
devise: "CNY",
voies: {
etape: "cn_choix_voie",
question: "Quelle voie choisissez-vous ?",
options: [
{ id: "bourse", libelle: "La bourse du gouvernement chinois", aide: "Candidature en ligne au CSC, par l'ambassade de Chine (type A) ou par une université (type B).", etapes: ["cn_bourse_type", "cn_bourse_compte", "cn_bourse_pieces", "cn_bourse_soumission", "cn_bourse_universite", "cn_bourse_entretien", "cn_bourse_resultat"] },
{ id: "autofinancement", libelle: "L'autofinancement", aide: "Vous candidatez vous-même sur le site de chaque université, et vous payez vos études.", etapes: ["cn_uni_choix", "cn_uni_candidature", "cn_uni_frais"] }
]
}
},

malaisie: {
id: "malaisie", nom: "Malaisie", code: "my",
plafondVoeux: 7,
plafondOfficiel: null,
niveaux: ["Foundation", "Diploma", "Licence (Bachelor)", "Master", "Doctorat"],
etapesDepot: ["my_candidature"],
etapesCandidature: ["my_candidature"],
etapeVoeuxOfficielle: "my_etablissement",
etapeReponses: "my_offre",
motivations: true,
devise: "MYR"
}

};

/** La destination d'un id, ou null. */
export function destination(id) {
// hasOwn : « ?d=constructor » ne doit pas trouver Object.prototype.
const cle = String(id || "").toLowerCase();
return Object.prototype.hasOwnProperty.call(DESTINATIONS, cle) ? DESTINATIONS[cle] : null;
}

function aplatir(t) {
return String(t || "").normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();
}

/** L'id d'une destination depuis un nom de pays (« Italie » → "italie"), France comprise. */
export function idDestinationDuPays(nomPays) {
const n = aplatir(nomPays);
if (!n) return "";
if (n === "france") return "france";
const d = Object.values(DESTINATIONS).find((x) => aplatir(x.nom) === n);
return d ? d.id : "";
}

/**
* LES FAITS DU DIAGNOSTIC — lus le 2026-09-23, sources officielles.
*
*   ressources   le seuil exigé pour le visa ou le séjour, ou null quand
*                le pays n'en chiffre aucun (alors `ressourcesAbsence`
*                dit pourquoi, avec sa source) ;
*   variante     un second seuil sous condition (le Québec) ;
*   droits       une fourchette annuelle, publiée par des universités
*                nommées dans le texte ;
*   frais        les frais fixes. `compte: true` = ils entrent dans le
*                total (tout le monde les paie) ; `false` = ils
*                dépendent d'un choix (une université, une voie, un
*                centre de visas) et restent affichés à côté ;
*   calendrier   ce qui est publié pour la prochaine rentrée ;
*   absences     ce qu'on n'a PAS trouvé, dit tel quel.
*/
export const DIAGNOSTICS = {

roumanie: {
ressources: {
texte: "Pour le visa, l'immigration roumaine exige au moins le salaire minimum brut par mois, pour toute la durée du visa : 4 325 lei par mois depuis le 1er juillet 2026. Le portail Study in Romania demande, lui, au moins 2 000 € sur votre compte : prévoyez le montant le plus élevé.",
montant: 4325, devise: "RON", periode: "mois",
source: "https://igi.mai.gov.ro/studii/",
verifieLe: "2026-09-23"
},
droits: {
texte: "Chaque université fixe ses frais pour les étudiants hors Union européenne. Pour 2026-2027 : de 1 980 € à 8 550 € par an à l'université Babeș-Bolyai de Cluj selon la filière, de 2 070 € à 4 000 € à l'université Alexandru Ioan Cuza de Iași. Une année au moins se paie AVANT le visa.",
min: 1980, max: 8550, devise: "EUR",
source: "https://www.ubbcluj.ro/ro/taxe/files/2026-2027/Regulament-privind-taxe-de-admitere_scolarizare_finalizare-a-studiilor-2026-2027.pdf",
verifieLe: "2026-09-23"
},
frais: [
{ cle: "dossier", texte: "Frais de dossier de l'université : 100 €, non remboursables (Iași et Bucarest, 2026-2027). Chaque université fixe les siens.", montant: 100, devise: "EUR", compte: true, source: "https://international.unibuc.ro/home-3/admission-2026-2/study-cycles/", verifieLe: "2026-09-23" },
{ cle: "visa", texte: "Visa de long séjour pour études : 300 € sur le portail e-Viza depuis le 27 avril 2026.", montant: 300, devise: "EUR", compte: true, source: "https://eviza.mae.ro/ro_VisaFees", verifieLe: "2026-09-23" },
{ cle: "sejour", texte: "Permis de séjour temporaire : 265 lei, TVA comprise. Les boursiers de l'État roumain en sont exonérés.", montant: 265, devise: "RON", compte: true, source: "https://igi.mai.gov.ro/noi-modalitati-privind-plata-taxelor-pentru-straini-2/", verifieLe: "2026-09-23" },
{ cle: "taxeConsulaire", texte: "Taxe consulaire du permis de séjour pour études : 120 €, payés en lei, en plus des 265 lei. Barème publié en août 2025, non reconfirmé depuis.", montant: 120, devise: "EUR", compte: true, source: "https://igi.mai.gov.ro/wp-content/uploads/2025/08/Taxe.pdf", verifieLe: "2026-09-23" }
],
calendrier: {
texte: "Aucune date limite 2027-2028 n'est encore publiée. Repère 2026-2027 : l'université de Iași recevait les dossiers du 1er janvier au 15 juin ; le ministère a ensuite jusqu'à 30 jours ouvrables pour délivrer la lettre d'acceptation.",
source: "https://www.uaic.ro/wp-content/uploads/2025/12/Registration-for-NON-EU-citizens-2026-2027-2.pdf",
verifieLe: "2026-09-23"
},
absences: [
"Le plancher légal des frais de scolarité (Ordonnance du Gouvernement n° 22/2009) : le texte officiel refuse la lecture automatique.",
"Les tarifs de traduction et le prix du timbre d'apostille au Sénégal : aucun montant officiel publié."
]
},

turquie: {
ressources: null,
ressourcesAbsence: {
texte: "La Turquie ne chiffre aucun seuil de ressources : pour le permis de séjour étudiant, la déclaration de l'étudiant suffit, sauf si l'administration demande des justificatifs. Aucun verdict « seuil atteint » n'est donc possible — seulement le coût de l'année.",
source: "https://www.goc.gov.tr/ikamet-sss",
verifieLe: "2026-09-23"
},
droits: {
texte: "Chaque université publique publie ses frais. Université d'Ankara, 2026-2027 : de 2 000 USD (lettres, géographie) à 14 850 USD par an (médecine en anglais) ; 3 600 USD en droit ou en génie informatique. Les boursiers Türkiye Bursları ne paient pas de frais de scolarité.",
min: 2000, max: 14850, devise: "USD",
source: "https://isoidb.ankara.edu.tr/wp-content/uploads/sites/381/2026/08/TRY-2026-2027-Katki-Payi-Ucretleri.pdf",
verifieLe: "2026-09-23"
},
frais: [
{ cle: "sejour", texte: "Carte de permis de séjour : 964 TL en 2026. La demande elle-même est gratuite.", montant: 964, devise: "TRY", compte: true, source: "https://en.goc.gov.tr/documents-for-residence-permit-fee-amount", verifieLe: "2026-09-23" },
{ cle: "assurance", texte: "Assurance maladie publique (GSS) : 1 321,20 TL par mois en 2026, à demander dans les trois mois suivant l'inscription. Prise en charge pour les boursiers.", montant: 1321.2, devise: "TRY", periode: "mois", compte: true, source: "https://ogrenci.deu.edu.tr/en/international-students-health-insurance/", verifieLe: "2026-09-23" }
],
calendrier: {
texte: "Türkiye Bursları : candidatures du 10 janvier au 20 février, chaque année, sans rattrapage. Examen TR-YÖS : deux sessions par an ; en 2026, inscriptions du 14 janvier au 3 février puis du 9 juillet au 3 août. Rien n'est encore publié pour 2027.",
source: "https://www.turkiyeburslari.gov.tr/calendar",
verifieLe: "2026-09-23"
},
absences: [
"Les frais de l'examen TR-YÖS : publiés seulement dans le guide de chaque session, que le site de l'ÖSYM refuse à la lecture automatique.",
"Le droit de visa d'études pour un ressortissant sénégalais : publié nulle part par l'ambassade."
]
},

maroc: {
ressources: null,
ressourcesAbsence: {
texte: "Le Maroc ne chiffre aucun seuil de ressources : la loi exige des « moyens d'existence suffisants », sans montant, et le visa étudiant demande une prise en charge légalisée d'un garant. Aucun verdict « seuil atteint » n'est donc possible — seulement le coût de l'année.",
source: "https://www.sgg.gov.ma/Portals/0/profession_reglementee/Dahir_immigration_fr.pdf",
verifieLe: "2026-09-23"
},
droits: {
texte: "Université publique, par l'AMCI : la place est offerte à titre gracieux. Voie privée, sans AMCI : à l'UM6P, de 65 000 à 110 000 MAD par an selon l'école (chiffres 2025-2026, inscription comprise).",
min: 0, max: 110000, devise: "MAD",
source: "https://web.archive.org/web/20250317151356/https://www.enssup.gov.ma/en/la-mobilite-etudiante",
verifieLe: "2026-09-23"
},
frais: [
{ cle: "depotAui", texte: "Al Akhawayn seulement : à la confirmation de l'admission, un dépôt de 10 000 MAD, dont 5 000 non remboursables.", montant: 10000, devise: "MAD", compte: false, source: "https://aui.ma/admission-aid/international/tuition-and-fees", verifieLe: "2026-09-23" },
{ cle: "dossierBenin", texte: "Candidats béninois seulement, campagne 2025-2026 : 5 000 F CFA de frais d'étude de dossier, payés au Trésor public.", montant: 5000, devise: "XOF", compte: false, source: "https://bourses.enseignementsuperieur.gouv.bj/bourse-marocaine-formations-universitaires-2025-2026/", verifieLe: "2026-09-23" }
],
calendrier: {
texte: "Les dossiers doivent parvenir à l'AMCI, par voie diplomatique, avant le 31 juillet de chaque année — et le service de votre pays ferme son dépôt plus tôt. Rien n'est encore publié pour 2027-2028.",
source: "https://fr.diplomatie.ma/fr/etudier-au-maroc",
verifieLe: "2026-09-13"
},
absences: [
"Le coût du visa étudiant (Bénin, Cameroun), du titre de séjour et des légalisations : aucune page officielle lisible ne le chiffre.",
"Le montant de la bourse mensuelle du Royaume du Maroc : publié nulle part."
]
},

italie: {
ressources: {
texte: "Pour le visa d'études : au moins 10 179,85 € pour l'année, d'origine licite et traçable — ni espèces, ni garantie d'un tiers. Montant valable pour 2026-2027 et 2027-2028.",
montant: 10179.85, devise: "EUR", periode: "an",
source: "https://consbuenosaires.esteri.it/it/servizi-consolari-e-visti/servizi-per-il-cittadino-straniero/visti/studenti-internazionali-nuove-indicazioni-su-visto-e-immatricolazione-per-gli-anni-accademici-2026-2027-e-2027-2028/",
verifieLe: "2026-09-23"
},
droits: {
texte: "Université publique, première année 2026-2027 : 657 € à Bologne pour les ressortissants des pays les plus pauvres, dont le Sénégal ; jusqu'à 3 198 € à Padoue pour les pays hors de cette liste (Côte d'Ivoire, Cameroun…). Chaque université fixe les siens.",
min: 657.04, max: 3198, devise: "EUR",
source: "https://www.unibo.it/it/studiare/iscrizioni-tasse-e-altre-procedure/lauree-e-lauree-magistrali/tasse-e-contributi/tassa-fissa-agevolata-per-cittadini-di-paesi-particolarmente-poveri-e-in-via-di-sviluppo-o-di-paesi-non-ue-non-appartenenti-allocse",
verifieLe: "2026-09-23"
},
frais: [
{ cle: "visa", texte: "Visa d'études (national D) : 50 € à l'ambassade d'Italie à Dakar.", montant: 50, devise: "EUR", compte: true, source: "https://ambdakar.esteri.it/it/servizi-consolari-e-visti/servizi-per-il-cittadino-straniero/visti/quanto-costa-un-visto-e-come-pagare/", verifieLe: "2026-09-23" },
{ cle: "sejour", texte: "Permesso di soggiorno, à demander dans les huit jours ouvrables après l'arrivée : 116,46 € pour un permis de 3 mois à 1 an.", montant: 116.46, devise: "EUR", compte: true, source: "https://www.portaleimmigrazione.it/ITA/tabelleCosti.html", verifieLe: "2026-09-23" },
{ cle: "candidature", texte: "Certaines universités font payer leur propre candidature : 60 € à Padoue (2026-2027). La préinscription sur Universitaly, elle, est gratuite.", montant: 60, devise: "EUR", compte: false, source: "https://web.unipd.it/international/wp-content/uploads/2026/04/UNIPD_APPfee_payment-guide-2026-27.pdf", verifieLe: "2026-09-23" },
{ cle: "centreVisas", texte: "Si vous déposez au centre de visas externalisé, des frais de service de 10 496 F CFA s'ajoutent.", montant: 10496, devise: "XOF", compte: false, source: "https://ambdakar.esteri.it/it/servizi-consolari-e-visti/servizi-per-il-cittadino-straniero/visti/quanto-costa-un-visto-e-come-pagare/", verifieLe: "2026-09-23" }
],
calendrier: {
texte: "Pour 2027-2028, la demande de visa (licence, Laurea Magistrale, cycle unique) doit être déposée au plus tard le 31 octobre 2027. Chaque université ouvre sa préinscription à sa date, souvent très tôt : Padoue, du 15 septembre au 15 novembre 2026.",
source: "https://www.universitaly.it/it/studenti-stranieri",
verifieLe: "2026-09-23"
},
absences: [
"Le tarif de l'attestation de comparabilité CIMEA : aucun montant publié. La dichiarazione di valore de l'ambassade à Dakar est gratuite pour une inscription universitaire.",
"Les frais de traduction assermentée et de légalisation au Sénégal : aucun montant officiel."
]
},

allemagne: {
ressources: {
texte: "Pour le visa d'études : au moins 992 € par mois, soit 11 904 € par an, le plus souvent sur un compte bloqué ouvert dans une banque allemande ou européenne. Ce seuil suit l'aide fédérale BAföG : il sera à revérifier avant les visas de 2027.",
montant: 11904, devise: "EUR", periode: "an", mensuel: 992,
source: "https://allemagneenfrance.diplo.de/fr-de/service/visa/2521298-2521298",
verifieLe: "2026-09-23"
},
droits: {
texte: "Université publique : une contribution de chaque semestre, de 97 € (Munich, LMU) à 363 € (Bonn). Mais deux exceptions pour les étudiants hors Union européenne : 1 500 € par semestre dans le Bade-Wurtemberg, et jusqu'à 6 000 € par semestre en master à la TU Munich.",
min: 194, max: 12194, devise: "EUR",
source: "https://www.tum.de/en/studies/fees/tuition",
verifieLe: "2026-09-23"
},
frais: [
{ cle: "dossier", texte: "Frais de dossier uni-assist : 75 € pour la première formation choisie, puis 30 € par formation en plus, le même semestre.", montant: 75, devise: "EUR", compte: true, source: "https://www.uni-assist.de/en/how-to-apply/pay-all-fees/handling-fees/", verifieLe: "2026-09-23" },
{ cle: "visa", texte: "Visa national D : 75 € de frais de traitement (page fédérale du 12 août 2026).", montant: 75, devise: "EUR", compte: true, source: "https://www.auswaertiges-amt.de/de/service/visa-und-aufenthalt/visa-207794", verifieLe: "2026-09-23" },
{ cle: "sejour", texte: "Titre de séjour pour études, au service des étrangers : 100 € la première fois (Munich, Berlin).", montant: 100, devise: "EUR", compte: true, source: "https://stadt.muenchen.de/service/info/studenten/1089339/", verifieLe: "2026-09-23" }
],
calendrier: {
texte: "Dates limites les plus courantes : 15 juillet pour le semestre d'hiver, 15 janvier pour le semestre d'été. Mais c'est la date de chaque université qui compte, souvent plus tôt : candidatez au moins huit semaines avant.",
source: "https://www.uni-assist.de/en/how-to-apply/plan-your-application/deadlines-processing-time/",
verifieLe: "2026-09-23"
},
absences: [
"Les frais d'ouverture du compte bloqué : ils sont à votre charge, mais aucune page officielle n'en publie le montant.",
"Les dates limites de l'hiver 2027-2028 : aucune publiée par uni-assist ; celle de votre université s'applique."
]
},

canada: {
ressources: {
texte: "Pour le permis d'études, hors Québec : 23 448 $ CA pour une personne seule sur la première année, en plus des droits de scolarité et du voyage (demandes déposées depuis le 1er septembre 2026).",
montant: 23448, devise: "CAD", periode: "an",
source: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/get-documents/financial-support.html",
verifieLe: "2026-09-23"
},
variante: {
id: "quebec",
libelle: "J'étudierai au Québec",
texte: "Au Québec, c'est le barème du ministère québécois : 24 617 $ CA pour une personne depuis le 1er janvier 2026.",
montant: 24617, devise: "CAD", periode: "an",
source: "https://www.quebec.ca/en/education/study-quebec/required-conditions/costs-studies",
verifieLe: "2026-09-23"
},
droits: {
texte: "Maîtrise, université publique, première année avant bourse : de 29 446 $ CA (Université d'Ottawa) à 35 006 $ CA (Université de Montréal). Le Québec réserve au Sénégal 25 exemptions des droits supplémentaires en maîtrise, à demander au responsable désigné pour le Sénégal.",
min: 29446, max: 35006, devise: "CAD",
source: "https://registraire.umontreal.ca/droits-de-scolarite/couts-des-etudes/",
verifieLe: "2026-09-23"
},
frais: [
{ cle: "permis", texte: "Permis d'études : 150 $ CA.", montant: 150, devise: "CAD", compte: true, source: "https://ircc.canada.ca/english/information/fees/fees.asp", verifieLe: "2026-09-23" },
{ cle: "biometrie", texte: "Biométrie (empreintes et photo) : 85 $ CA.", montant: 85, devise: "CAD", compte: true, source: "https://ircc.canada.ca/english/information/fees/fees.asp", verifieLe: "2026-09-23" },
{ cle: "caq", texte: "Québec seulement : certificat d'acceptation (CAQ), 135 $ CA depuis le 1er janvier 2026.", montant: 135, devise: "CAD", compte: true, variante: "quebec", source: "https://www.quebec.ca/en/education/study-quebec/temporary-selection-studies", verifieLe: "2026-09-23" },
{ cle: "admission", texte: "Frais de demande d'admission de chaque université : de 101,49 $ CA (Laval) à 120 $ CA par programme (Ottawa).", montant: 120, devise: "CAD", compte: false, source: "https://www.uottawa.ca/faculty-social-sciences/programs/graduate/frequently-asked-questions", verifieLe: "2026-09-23" }
],
calendrier: {
texte: "Il n'y a pas de date nationale : chaque université fixe la sienne. Pour l'automne 2027, les plus proches tombent dès le 15 novembre 2026 (Ottawa, sciences sociales) ; Montréal et Laval ferment le 1er février.",
source: "https://www.uottawa.ca/faculty-social-sciences/programs/admission-deadlines-international-students",
verifieLe: "2026-09-23"
},
absences: [
"L'examen médical : IRCC ne publie aucun tarif, on paie le médecin désigné sur place.",
"Les frais de service du point de collecte biométrique : payés au prestataire, jamais publiés par IRCC."
]
},

chine: {
ressources: null,
ressourcesAbsence: {
texte: "La Chine ne chiffre aucun seuil de ressources pour le visa d'études X1 : les pièces officielles sont le passeport, le formulaire, la photo, l'avis d'admission et le formulaire JW201 ou JW202, sans montant minimum. Aucun verdict « seuil atteint » n'est donc possible — seulement le coût de l'année.",
source: "https://french.beijing.gov.cn/studyinginbeijing/visaapplications/202306/t20230626_3146191.html",
verifieLe: "2026-09-23"
},
droits: {
texte: "Chaque université fixe ses droits. Licence : 26 000 CNY par an en lettres à Sun Yat-sen (2026) et en économie, droit ou gestion à Tsinghua ; 33 800 CNY en sciences et ingénierie à Sun Yat-sen ; jusqu'à 70 000 CNY en médecine clinique à Tsinghua. Master : 30 000 à 55 000 CNY à Sun Yat-sen (2026), 28 000 à 33 000 CNY pour un master classique à Tsinghua (2027). Les boursiers du gouvernement chinois ne paient pas de droits.",
min: 26000, max: 70000, devise: "CNY",
source: "https://international.join-tsinghua.edu.cn/Admission1/Fees.htm",
verifieLe: "2026-09-23"
},
frais: [
{ cle: "dossier", texte: "Frais de dossier de chaque université, non remboursables : 800 CNY à Tsinghua, 400 CNY à Sun Yat-sen. Non couverts par la bourse.", montant: 800, devise: "CNY", compte: false, source: "https://yz.tsinghua.edu.cn/en/Costs/Application_Fee.htm", verifieLe: "2026-09-23" },
{ cle: "csca", texte: "Licence seulement : examen CSCA, 450 CNY pour une matière, 700 CNY pour plusieurs.", montant: 700, devise: "CNY", compte: false, source: "https://edu.sh.gov.cn/study_en_news/20251114/d4ca5e9d388546f4adc0f356d3354d59.html", verifieLe: "2026-09-23" },
{ cle: "centreVisas", texte: "Visa X1 : gratuit pour les ressortissants sénégalais ; seuls les frais de service du centre de visas chinois sont dus, 21 500 F CFA en service standard (5 jours). L'express (3 jours) coûte plus cher.", montant: 21500, devise: "XOF", compte: true, source: "https://www.visaforchina.cn/DKR3_FR/qianzhengyewu/jichuzhishi/feiyongbiaozhunjishixian", verifieLe: "2026-09-23" },
{ cle: "sejour", texte: "Permis de résidence : 400 CNY jusqu'à un an, 800 CNY de un à trois ans, 1 000 CNY de trois à cinq ans.", montant: 400, devise: "CNY", compte: true, source: "https://s.nia.gov.cn/mps/bszy/wgrcrjEn/e-sqwgrjlzj/202201/index.html", verifieLe: "2026-09-23" },
{ cle: "assurance", texte: "Assurance étudiante obligatoire : 800 CNY par an à Sun Yat-sen et à Tsinghua. Comprise dans la bourse du gouvernement chinois.", montant: 800, devise: "CNY", periode: "an", compte: true, source: "https://iso.sysu.edu.cn/en/application/guide/1420575.htm", verifieLe: "2026-09-23" }
],
calendrier: {
texte: "Rentrée de septembre 2027 : Tsinghua a ouvert ses candidatures en master et doctorat à la mi-septembre 2026, jusqu'en février 2027 selon les départements, avec une première date limite à la mi-décembre 2026 pour les candidats à la bourse du gouvernement chinois. Aucun calendrier 2027-2028 du CSC ni de l'ambassade de Chine au Sénégal n'est encore publié. Repères 2026-2027 : la bourse fermait le 15 février 2026 à l'ambassade de Chine au Sénégal (résultats annoncés pour juillet), le 31 décembre 2025 à Zhejiang et le 15 février 2026 à Sun Yat-sen.",
source: "https://yz.tsinghua.edu.cn/en/info/1035/1583.htm",
verifieLe: "2026-09-23"
},
absences: [
"Les montants actuels de l'allocation de licence de la bourse du gouvernement chinois : seul un barème de 2022 (Sun Yat-sen) les chiffre ; les sites du CSC refusent la lecture automatique.",
"Le coût de l'examen médical (Foreigner Physical Examination Form) au Sénégal, et de sa vérification à l'arrivée en Chine : aucun montant officiel publié.",
"La liste de pièces du visa X1 propre au centre de visas de Dakar : générée en JavaScript, illisible ; la liste utilisée vient du consulat de Chine à Saint-Denis et du gouvernement de Pékin."
]
},

malaisie: {
ressources: null,
ressourcesAbsence: {
texte: "Pour le Student Pass, EMGS ne demande aucune preuve de ressources chiffrée : la liste officielle des pièces d'une nouvelle demande (photo, passeport, lettre d'offre, déclaration de santé, diplômes, certificat d'anglais, caution personnelle) ne comporte ni relevé bancaire ni seuil. Le budget de vie sur place n'est donc fixé par aucun texte officiel.",
source: "https://visa.educationmalaysia.gov.my/guidelines/required-documents",
verifieLe: "2026-09-23"
},
droits: {
texte: "UKM, licence en programme international (UKMi), première année : de 21 570 RM (sciences sociales) à 25 120 RM (informatique), barèmes 2024-2025. L'UM publie, elle, des totaux par programme pour la durée minimale d'études (session 2025-2026) : licence de 60 900 RM à 673 200 RM (médecine), master en cours de 24 800 RM à 98 600 RM. Tous ces montants sont en ringgit (MYR), pas en dollars.",
min: 21570, max: 25120, devise: "MYR",
source: "https://shape.ukm.my/storage/lampiran/struktur_yuran/FTSM/pra/strukturyuran_FTSM_UKMi_pra_F_int.pdf",
verifieLe: "2026-09-23"
},
frais: [
{ cle: "emgs", texte: "Frais de traitement EMGS, nouvelle demande de Student Pass de plus de six mois : 1 600 RM plus 8 % de taxe de service, soit 1 728 RM au calculateur EMGS.", montant: 1728, devise: "MYR", compte: true, source: "https://visa.educationmalaysia.gov.my/media/cms_upload/Schedule_fees_-_v1.8_2_.pdf", verifieLe: "2026-09-23" },
{ cle: "eval", texte: "eVAL (lettre électronique d'approbation de visa) : 150 RM plus la taxe de service de 8 %, soit 162 RM.", montant: 162, devise: "MYR", compte: true, source: "https://visa.educationmalaysia.gov.my/media/cms_upload/Schedule_fees_-_v1.8_2_.pdf", verifieLe: "2026-09-23" },
{ cle: "vignette", texte: "Vignette du Student Pass : 60 RM, à la première demande puis à chaque renouvellement.", montant: 60, devise: "MYR", compte: true, source: "https://visa.educationmalaysia.gov.my/media/cms_upload/Schedule_fees_-_v1.8_2_.pdf", verifieLe: "2026-09-23" },
{ cle: "ikad", texte: "i-Kad, la carte d'étudiant étranger : 50 RM.", montant: 50, devise: "MYR", compte: true, source: "https://visa.educationmalaysia.gov.my/media/cms_upload/Schedule_fees_-_v1.8_2_.pdf", verifieLe: "2026-09-23" },
{ cle: "medical", texte: "Visite médicale à l'arrivée : 340 RM (université publique de la péninsule).", montant: 340, devise: "MYR", compte: true, source: "https://visa.educationmalaysia.gov.my/media/cms_upload/Schedule_fees_-_v1.8_2_.pdf", verifieLe: "2026-09-23" },
{ cle: "assurance", texte: "Assurance santé obligatoire, plans EMGS 2026 pour douze mois : de 498 RM à 644 RM.", montant: 498, devise: "MYR", periode: "an", compte: true, source: "https://visa.educationmalaysia.gov.my/guidelines/insurance-new-2026", verifieLe: "2026-09-23" },
{ cle: "visa", texte: "Visa pour un Sénégalais : 20 RM, tarif de l'Immigration pour les pays non listés.", montant: 20, devise: "MYR", compte: true, source: "https://www.imi.gov.my/index.php/en/main-services/visa/visa-fees/", verifieLe: "2026-09-23" },
{ cle: "caution", texte: "Caution personnelle, rendue en fin d'études : 1 500 RM pour les pays que la grille EMGS ne nomme pas, dont le Sénégal. Faites confirmer le montant par l'établissement.", montant: 1500, devise: "MYR", compte: false, source: "https://visa.educationmalaysia.gov.my/media/cms_upload/Personal-Bond-Requirementsv1.2.pdf", verifieLe: "2026-09-23" },
{ cle: "forfaitUm", texte: "Universiti Malaya : sa grille du 10 juillet 2026 affiche 5 451 RM pour un visa d'un an (Sénégal), sans détailler ce qu'ils couvrent. Demandez à l'UM s'ils incluent les frais EMGS ci-dessus.", montant: 5451, devise: "MYR", compte: false, source: "https://study.um.edu.my/doc/VISA%20SERVICES/International%20Student%20Processing%20Fees%20by%20Country%20-%20Updated%2010%20July%202026%202026.pdf", verifieLe: "2026-09-23" },
{ cle: "dossierUm", texte: "Frais de candidature Universiti Malaya : 500 RM par candidature, non remboursables (page mise à jour le 8 septembre 2026).", montant: 500, devise: "MYR", compte: false, source: "https://study.um.edu.my/how-to-apply", verifieLe: "2026-09-23" },
{ cle: "dossierUkm", texte: "Frais de candidature UKM : 100 RM (ou 30 USD), non remboursables.", montant: 100, devise: "MYR", compte: false, source: "https://join.ukm.my/", verifieLe: "2026-09-23" }
],
calendrier: {
texte: "L'UM a publié ses dates pour la rentrée de mars 2027 (semestre II, session 2026-2027) : candidatures du 7 septembre 2026 au 30 janvier 2027, en licence comme en master ; pour le Term I de juin 2027 (masters cliniques) : du 20 juillet 2026 au 31 janvier 2027. La rentrée d'octobre 2027 n'est pas encore publiée. L'UKM demande de candidater au moins deux mois avant la date d'inscription.",
source: "https://study.um.edu.my/how-to-apply",
verifieLe: "2026-09-23"
},
absences: [
"Les frais de service du portail eVISA de l'Immigration pour le visa à entrée unique : portail inaccessible le 2026-09-23, aucun montant trouvé.",
"La page de l'ambassade de Malaisie à Dakar : inaccessible ; on ne sait pas si elle délivre encore le visa à entrée unique, l'Immigration disant « exclusivement eVISA ».",
"La liste MQA des diplômes d'entrée reconnus (décembre 2025) : PDF non ouvrable ; le traitement du baccalauréat sénégalais est à confirmer auprès de l'université (https://www.mqa.gov.my/new/nilai_taraf.cfm).",
"La liste des pays à risque de fièvre jaune tenue par le ministère malaisien de la Santé : site inaccessible.",
"Les droits de scolarité 2026-2027 : l'UM publie ceux de 2025-2026, l'UKM ses barèmes 2024-2025 ; aucun barème plus récent trouvé.",
"La rentrée d'octobre 2027 : ni l'UM ni l'UKM n'ont publié de dates de candidature.",
"Ce que couvrent les 5 451 RM de la grille « visa » de l'UM : non détaillé par l'université.",
"Si le droit de visa facturé avec les frais EMGS (20 RM au calculateur) et celui du visa à entrée unique demandé sur eVISA (20 RM au barème de l'Immigration) sont un seul paiement ou deux : les pages lues ne le disent pas. Le total n'en compte qu'un."
]
}

};

/**
* LES TEXTES « EN CLAIR » DE CHAQUE ÉTAPE, par destination.
* Écrits le 2026-09-23 depuis la consigne officielle de chaque étape
* (js/procedures/<pays>.js). Titre simple + deux ou trois phrases
* courtes, sans chiffre, sans date, sans montant, sans nom de lieu :
* le texte officiel reste servi en dessous, avec sa source.
*/
export const ETAPES_EN_CLAIR = {

// roumanie — textes écrits le 2026-09-23 depuis js/procedures/roumanie.js
roumanie: {
ro_programme: { titre: "Choisir mon programme et mon université", enClair: "Choisissez votre formation dans le catalogue officiel du portail Study in Romania. Notez l'université, le programme, la langue des cours et le prix par an. Vérifiez que l'université est accréditée ou autorisée en Roumanie : sinon, aucune lettre d'acceptation ne pourra être délivrée." },
ro_apostille: { titre: "Apostiller mes documents, puis les traduire", enClair: "D'abord, faites apostiller, c'est-à-dire authentifier, vos diplômes, relevés et acte de naissance dans leur pays d'origine. Ensuite seulement, faites-en établir une traduction officielle, en français, en anglais ou en roumain. Dans l'autre ordre, tout serait à refaire." },
ro_dossier: { titre: "Envoyer mon dossier à l'université", enClair: "Envoyez votre dossier complet à l'université : c'est elle qui le transmettra au ministère, pas vous. Il contient le formulaire de demande de lettre d'acceptation, rempli en deux exemplaires, et vos pièces. Demandez le montant des frais de dossier, puis gardez l'accusé de réception." },
ro_scrisoare: { titre: "Recevoir la lettre d'acceptation du ministère", enClair: "L'université étudie votre dossier, puis le transmet elle-même au ministère de l'Éducation. Si la réponse est positive, le ministère délivre la lettre d'acceptation aux études. Sans cette lettre, pas de visa ni d'inscription : c'est la pièce la plus importante." },
ro_langue: { titre: "Prouver mon niveau dans la langue des cours", enClair: "Pour étudier en roumain, vous suivez d'abord une année préparatoire de langue, sauf si vous avez déjà un certificat officiel de roumain de niveau suffisant. En français ou en anglais, chaque université fixe sa règle : beaucoup vous dispensent si c'est la langue officielle de votre pays, d'autres demandent un certificat. Lisez celle de l'université visée." },
ro_bourse_mae: { titre: "En option, la bourse de l'État roumain", enClair: "Cette bourse est facultative et se demande uniquement en ligne, sur la plateforme Study in Romania. Pas de bourse en médecine, médecine dentaire ni pharmacie, et licence ou master se font en roumain. La campagne ferme tôt dans l'année et exige de bonnes notes : préparez-vous en avance." },
ro_scolarite: { titre: "Payer au moins une année de scolarité", enClair: "Avant de demander le visa, payez à l'université au moins une année d'études. Le service de l'immigration exige cette preuve de paiement dans le dossier de visa. Gardez bien le reçu remis par l'université." },
ro_visa: { titre: "Demander mon visa d'études", enClair: "Faites votre demande de visa en ligne sur le portail e-Viza, qui sert aussi à prendre rendez-vous. Au consulat de Roumanie, présentez vos originaux : lettre d'acceptation, reçu de scolarité, preuve de ressources, assurance, casier judiciaire. Ce visa vous permet d'entrer seulement en Roumanie, pas dans les autres pays européens." },
ro_inmatriculare: { titre: "M'inscrire sur place à l'université", enClair: "Inscrivez-vous selon le calendrier de l'université, au plus tard à la fin du premier semestre. Apportez vos originaux apostillés, la lettre d'acceptation, votre passeport avec visa et un certificat médical. Demandez avant de partir si l'université exige aussi des traductions en roumain." },
ro_permis: { titre: "Obtenir mon permis de séjour", enClair: "Votre visa ne vaut que quatre-vingt-dix jours : il faut ensuite un permis de séjour. Déposez votre demande au service de l'immigration dans les trente jours suivant votre arrivée. Il vaut un an et se renouvelle chaque année, au moins trente jours avant son expiration." },
},

// turquie — textes écrits le 2026-09-23 depuis js/procedures/turquie.js
turquie: {
tr_denklik: { titre: "Faire reconnaître votre bac en Turquie", enClair: "Votre bac doit être reconnu par le ministère turc de l'Éducation, pas par le conseil de l'enseignement supérieur. Faites la demande en ligne, puis présentez-vous dans un centre d'équivalence : il en existe hors de Turquie. Gardez le certificat, l'université l'exigera à votre inscription." },
tr_choix_voie: { titre: "Choisir entre la bourse et l'autofinancement", enClair: "La bourse Türkiye Bursları vous place elle-même dans une université, et vous n'y candidatez qu'une fois par an. En autofinancement, vous postulez à chaque université choisie, avec ce qu'elle accepte : un examen d'entrée ou les notes de votre bac. Si vous visez la bourse, décidez dès l'automne : il n'existe aucune session de rattrapage." },
tr_tb_compte: { titre: "Bourse : créer votre compte de candidature", enClair: "La candidature se fait uniquement en ligne, sur le site officiel de la bourse. Créez votre compte dès l'ouverture de la période de candidature. Avant, vérifiez la moyenne minimale et l'âge maximum demandés pour votre niveau : sinon, vous perdez votre temps." },
tr_tb_pieces: { titre: "Bourse : envoyer vos pièces en ligne", enClair: "Déposez en ligne votre pièce d'identité, une photo de moins d'un an et vos résultats d'examens nationaux. Ajoutez votre diplôme ou attestation provisoire, votre relevé de notes, et les tests demandés par le programme. Les formats de fichiers ne sont pas précisés : préparez des PDF lisibles et légers." },
tr_tb_voeux: { titre: "Bourse : choisir vos préférences de formation", enClair: "Vous ne postulez pas aux universités : vous indiquez jusqu'à douze préférences, et la bourse décide de votre place. Le site ne vous propose que les formations adaptées à votre parcours. Vérifiez la langue de chaque formation : beaucoup sont en turc, les autres exigent un certificat de langue reconnu." },
tr_tb_soumission: { titre: "Bourse : soumettre avant la date limite", enClair: "Validez votre dossier avant le dernier jour de la période de candidature, sinon vous attendrez un an. La candidature est gratuite : si quelqu'un vous demande de l'argent, c'est une arnaque. Gardez votre numéro de dossier : convocations et résultats arrivent uniquement sur le site de la bourse." },
tr_tb_entretien: { titre: "Bourse : passer le test et l'entretien", enClair: "Si votre dossier est retenu, vous recevez une convocation pour un entretien. Pour une licence, un test de mathématiques et de logique a lieu avant, le même jour. Apportez les originaux des diplômes et certificats de votre dernière formation." },
tr_tb_reponse: { titre: "Bourse : les résultats et ce qu'elle couvre", enClair: "Les résultats tombent en été, sur le site de la bourse. Elle couvre les frais d'études, logement, assurance santé, billet d'avion, allocation mensuelle et une année de turc. Sans certificat de turc de haut niveau, cette année de turc est obligatoire, même pour une formation en anglais." },
tr_yos_inscription: { titre: "Autofinancement : vous inscrire à l'examen TR-YÖS", enClair: "Le TR-YÖS est l'examen d'entrée des étudiants étrangers : deux sessions par an, et vous pouvez le passer en français. Inscrivez-vous vous-même sur le site de l'organisme national des examens ; aucun certificat de turc n'est demandé. Le guide de votre session donne les dates et les frais. Si vos universités admettent sur les notes du bac, cette étape ne vous concerne pas." },
tr_yos_paiement: { titre: "Autofinancement : payer les frais de l'examen", enClair: "Votre inscription ne compte qu'après le paiement, fait depuis votre espace candidat de l'organisme des examens. Un dossier rempli mais non payé à la date limite n'existe pas. Vérifiez le montant dans le guide de la session avant de payer, et gardez le reçu." },
tr_uni_candidature: { titre: "Autofinancement : postuler à chaque université", enClair: "Chaque année, le conseil de l'enseignement supérieur publie les places réservées aux étudiants étrangers qui financent leurs études. Chaque université fixe ses conditions et les examens qu'elle accepte : lisez son site officiel. Vous déposez donc un dossier par université, avec les pièces qu'elle demande." },
tr_admission: { titre: "Recevoir votre lettre d'acceptation", enClair: "L'université vous envoie une lettre d'acceptation : demandez votre visa dès sa réception, les démarches sont longues. Pour les boursiers, la place vient directement de la bourse, sans autre candidature. Gardez l'original : le consulat, l'université puis l'administration des séjours vous le redemanderont." },
tr_visa: { titre: "Demander votre visa d'études", enClair: "Le visa électronique ne vaut que pour le tourisme et les affaires : pour étudier, voyez l'ambassade ou le consulat. Faites la demande en ligne sur le portail consulaire, puis déposez votre dossier là où l'ambassade l'indique. Vérifiez que votre passeport reste valable bien au-delà de la fin du séjour accordé par le visa." },
tr_inscription: { titre: "Vous inscrire à l'université à l'arrivée", enClair: "En arrivant, présentez-vous au service des inscriptions de votre université avec vos originaux : diplôme, équivalence et lettre d'acceptation. Cette inscription ouvre le droit au permis de séjour et lance le délai pour l'assurance santé publique. Demandez votre certificat d'inscription : il sera exigé pour le permis de séjour." },
tr_ikamet: { titre: "Demander votre permis de séjour en Turquie", enClair: "Le permis de séjour étudiant est obligatoire, et il se demande en ligne une fois en Turquie. La date qui compte est la fin de votre visa, pas celle de votre arrivée. La demande est gratuite, mais la carte est payante : réglez-la et déposez vos pièces à l'université avant le rendez-vous." },
tr_assurance: { titre: "Prendre votre assurance santé à temps", enClair: "Vous devez être assuré pendant tout votre séjour ; l'assurance publique couvre tous les hôpitaux publics. Demandez-la dans les trois mois qui suivent votre inscription à l'université. Passé ce délai, le droit est perdu pour toujours et une assurance privée devient obligatoire." },
},

// maroc — textes écrits le 2026-09-23 depuis js/procedures/maroc.js
maroc: {
ma_porte_entree: { titre: "Comprendre qu'il n'y a pas de candidature directe", enClair: "Pour une université publique marocaine, vous ne candidatez pas vous-même : lui écrire ne donne rien. Votre dossier part d'un service de votre pays, puis passe par les ambassades jusqu'à l'AMCI. Repérez ce service chez vous, ou visez l'une des deux universités qui admettent en direct, présentées plus bas." },
ma_formulaire: { titre: "Remplir le formulaire de l'AMCI", enClair: "Ce formulaire papier est le cœur de votre dossier : il n'y a pas de saisie en ligne. Demandez d'abord la version de cette année au service de votre pays ou à l'ambassade. Remplissez chaque rubrique, puis datez et signez." },
ma_voeux: { titre: "Classer mes vœux par ordre de préférence", enClair: "Pour chaque vœu, indiquez l'établissement, la filière, la ville et le diplôme, dans votre vrai ordre de préférence. Aucun vœu n'est garanti : l'AMCI choisit selon des places limitées. Et être retenu ne veut pas dire être boursier." },
ma_pieces: { titre: "Réunir les pièces de mon dossier", enClair: "Rassemblez chaque pièce demandée par le formulaire, souvent en double exemplaire. Faites certifier conformes les copies de vos diplômes et de vos relevés de notes. Aucune traduction n'est demandée : ne la payez pas, mais faites-le confirmer par le service de votre pays." },
ma_depot: { titre: "Déposer mon dossier dans mon pays", enClair: "Vous n'envoyez pas vous-même votre dossier à l'AMCI. Déposez-le au service officiel de votre pays, qui fait un premier tri puis le transmet. Exigez un reçu de dépôt : c'est votre seule preuve." },
ma_transmission: { titre: "Transmission de mon dossier à l'AMCI", enClair: "Le service de votre pays envoie votre dossier à l'AMCI en passant par les ambassades. L'AMCI a une date limite chaque année, et votre pays ferme son dépôt plus tôt. Faites confirmer les dates à l'ambassade : sans l'AMCI, aucun dossier n'est examiné." },
ma_selection: { titre: "Attendre la sélection de l'AMCI", enClair: "L'AMCI choisit les dossiers selon des places et des critères fixés avec votre pays. Elle envoie ensuite les dossiers retenus au ministère marocain de l'Enseignement supérieur. Vous n'avez rien à faire : la réponse viendra du service de votre pays ou de l'ambassade." },
ma_autorisation: { titre: "Recevoir mon autorisation d'inscription", enClair: "Si vous êtes retenu, le ministère marocain vous délivre une autorisation d'inscription : un numéro personnel. Selon votre niveau d'études, l'établissement doit parfois donner son accord avant. Gardez ce numéro précieusement : il sert pour le visa et pour l'inscription." },
ma_visa: { titre: "Vérifier si j'ai besoin d'un visa", enClair: "Selon votre nationalité : pas de visa, une autorisation de voyage en ligne, ou un visa étudiant. Ce visa se demande depuis votre pays : entrer en touriste puis en changer sur place est interdit. Même sans visa, vous devrez demander un titre de séjour à l'arrivée." },
ma_inscription: { titre: "M'inscrire dans mon établissement", enClair: "Une fois arrivé, présentez-vous à l'établissement qui vous a été attribué. Apportez votre numéro d'autorisation, votre passeport et vos diplômes originaux. Vous repartez avec votre carte d'étudiant et une attestation d'inscription, indispensable pour le titre de séjour." },
ma_sejour: { titre: "Demander mon titre de séjour", enClair: "Tous les étudiants étrangers doivent demander un titre de séjour en arrivant, même ceux dispensés de visa. Déposez la demande auprès de la police, avec l'attestation d'inscription, une preuve de ressources et de logement. N'attendez pas : demandez le délai au service dès votre arrivée." },
ma_um6p: { titre: "Candidater en direct à l'UM6P", enClair: "Cette université privée ne passe pas par l'AMCI : vous candidatez vous-même sur son site. Chaque formation a sa propre date de clôture : notez celle de la formation que vous visez. Les frais changent d'une école à l'autre : vérifiez-les avant de candidater." },
ma_aui: { titre: "Candidater en direct à Al Akhawayn", enClair: "Al Akhawayn admet les étudiants étrangers en direct, sans passer par l'AMCI. Si vous n'avez pas étudié en anglais, il vous faut un test d'anglais reconnu. Envoyez votre dossier bien avant les dates limites, et lisez ses coûts détaillés plus bas." },
},

// italie — textes écrits le 2026-09-23 depuis js/procedures/italie.js
italie: {
it_titre: { titre: "Compter mes années de scolarité", enClair: "L'Italie exige un nombre minimum d'années d'école pour entrer à l'université. Comptez les vôtres en suivant la règle écrite ci-dessous. S'il en manque, une année d'université réussie, un diplôme court ou une formation préparatoire peuvent les compléter." },
it_comparabilite: { titre: "Faire reconnaître mon diplôme en Italie", enClair: "Il vous faut un document officiel qui dit ce que vaut votre diplôme en Italie. Un seul des deux suffit : l'un vient d'un organisme italien, l'autre de l'ambassade d'Italie. Même si l'université ne le demande pas, le consulat l'exige pour le visa." },
it_compte: { titre: "Créer mon compte sur Universitaly", enClair: "Universitaly est le seul site officiel, et il est gratuit : n'utilisez aucun intermédiaire payant. Écrivez vos noms et votre date de naissance exactement comme sur votre passeport. Une seule lettre différente peut bloquer votre dossier au consulat." },
it_cours: { titre: "Choisir un seul cours, et tôt", enClair: "Ici, pas de vœux multiples : vous ne pouvez choisir qu'un seul cours. Chaque université valide un nombre limité de dossiers : ensuite, elle s'arrête, même pour un bon dossier. Déposez donc le plus tôt possible, dès l'ouverture fixée par votre université." },
it_langue: { titre: "Prouver mon niveau de langue", enClair: "Vous devez prouver le niveau minimum demandé dans la langue de votre cours. Pour un cours en italien, l'université organise son test, de préférence à distance, avant le visa. Sans ce test réussi, vous ne pouvez passer aucune autre épreuve d'admission." },
it_saisie: { titre: "Remplir ma demande de préinscription", enClair: "Sur votre compte, remplissez la demande : identité, cours choisi et consulat d'Italie de votre lieu de résidence. Ajoutez ensuite votre diplôme, sa reconnaissance et votre preuve de langue. Si vous n'avez pas encore le bac, la demande est acceptée sous réserve, en attendant le diplôme." },
it_soumission: { titre: "Envoyer définitivement ma préinscription", enClair: "En envoyant, votre demande part à la fois vers l'université et vers le consulat d'Italie. Notez le numéro de dossier et imprimez le récapitulatif : le consulat vous le demandera. Si votre cours a un nombre de places limité, l'université vous fera aussi passer un examen d'entrée." },
it_validation: { titre: "Attendre la validation de l'université", enClair: "L'université étudie votre diplôme, puis valide ou non votre demande sur Universitaly. Seule une préinscription validée permet de demander le visa : suivez son état sur votre compte. Attention : être accepté ne garantit ni le visa, ni l'inscription finale." },
it_rdv: { titre: "Prendre rendez-vous au consulat d'Italie", enClair: "Une fois la préinscription validée, prenez rendez-vous à l'ambassade ou au consulat d'Italie dont vous dépendez. Suivez la méthode publiée par ce consulat, et gardez la convocation qui indique le jour et l'heure. Le jour venu, apportez tout le dossier : il n'y a pas de second dépôt." },
it_visa: { titre: "Demander mon visa d'études", enClair: "Déposez votre demande de visa avant la date limite ; celle de votre université peut être plus tôt. Prouvez le montant exigé pour l'année, avec votre argent ou celui de votre famille, jamais en espèces. Il faut aussi un vrai logement : une simple demande de chambre universitaire ne suffit pas." },
it_permesso: { titre: "Demander mon titre de séjour en Italie", enClair: "Dès votre arrivée, demandez votre titre de séjour : le délai est très court, il est écrit ci-dessous. Le formulaire se retire dans un bureau de poste, ou à un guichet de certaines universités. Gardez le reçu sur vous : il vaut titre de séjour provisoire." },
it_codice: { titre: "Obtenir mon numéro fiscal italien", enClair: "Le codice fiscale est un numéro personnel indispensable en Italie. Sans lui, impossible de vous inscrire, d'ouvrir un compte, de signer un bail ou d'avoir une couverture santé. Demandez-le au consulat avant le départ, ou sur place : souvent, votre université s'en charge." },
it_immatriculation: { titre: "M'inscrire définitivement à l'université", enClair: "Une fois en Italie, finalisez votre inscription avec les originaux de tous vos diplômes et relevés de notes. Ne payez pas les droits d'inscription avant d'avoir votre visa. Faites-le avant la date limite indiquée ci-dessous, ou plus tôt si votre université l'exige : sinon, le visa est annulé." },
},

// allemagne — textes écrits le 2026-09-23 depuis js/procedures/allemagne.js
allemagne: {
de_anabin: { titre: "Vérifier ce que vaut votre bac", enClair: "Avant tout, vérifiez si votre bac vous ouvre l'université allemande. L'outil d'uni-assist, le service qui examine les dossiers étrangers, vous répond selon votre pays. Trois réponses possibles : accès direct, passage par un Studienkolleg, ou pas d'accès." },
de_studienkolleg: { titre: "Passer par un Studienkolleg si nécessaire", enClair: "Si votre bac ne suffit pas, passez par un Studienkolleg : une préparation qui finit par un examen. Les cours sont en allemand : il faut déjà parler allemand, même pour une licence en anglais. Renseignez-vous auprès de chaque université : ses dates tombent souvent avant celles des licences." },
de_compte: { titre: "Créer votre compte sur uni-assist", enClair: "Créez votre compte sur uni-assist : vous y déposerez vos pièces et suivrez vos dossiers. Vous recevez un numéro de candidat unique : notez-le, il servira pour toutes vos candidatures. Attention, uni-assist ne travaille avec aucune agence : un placement payant en son nom est faux." },
de_pieces: { titre: "Rassembler vos papiers et les faire traduire", enClair: "Scannez vos diplômes et relevés de notes, dans leur langue d'origine. Joignez une traduction en allemand ou en anglais, faite par un traducteur assermenté. Une traduction d'agence ordinaire est refusée, et chaque document ne se dépose qu'une fois." },
de_voeux: { titre: "Choisir vos universités et vos formations", enClair: "Sur uni-assist, cherchez chaque formation visée et remplissez son formulaire en entier. Vérifiez d'abord la date limite fixée par chaque université, et déposez votre dossier bien avant. Vérifiez aussi que l'université passe par uni-assist : certaines reçoivent les candidatures sur leur propre site." },
de_vpd: { titre: "Demander la VPD si l'université l'exige", enClair: "Certaines universités exigent une VPD : un document d'uni-assist qui convertit votre moyenne en note allemande. Votre candidature en ligne suffit à la demander, et la VPD arrive dans votre compte. Attention : c'est ensuite à vous de l'envoyer à l'université, avant sa date limite." },
de_paiement: { titre: "Payer les frais de dossier uni-assist", enClair: "Payez dans votre compte uni-assist, par virement ou par carte bancaire. Le premier vœu coûte le plus cher, chaque vœu en plus coûte moins. Ils restent dus même en cas de refus, et l'examen ne commence qu'après paiement." },
de_zulassung: { titre: "Recevoir la réponse et la lettre d'admission", enClair: "Suivez votre dossier dans votre compte : uni-assist vérifie vos papiers, dans l'ordre d'arrivée. Mais uni-assist n'admet personne : c'est l'université qui décide et vous envoie la lettre d'admission. Cette lettre fixe une date d'inscription à ne pas manquer, et votre visa en dépend." },
de_sperrkonto: { titre: "Prouver vos ressources avec un compte bloqué", enClair: "Pour le visa, prouvez que vous pouvez vivre un an en Allemagne, par exemple avec un compte bloqué. Ouvrez-le dans une banque allemande ou européenne : les banques africaines sont refusées. L'attestation doit indiquer la somme versée et la somme disponible chaque mois, sinon elle est rejetée." },
de_visa_dossier: { titre: "Demander votre visa d'études en ligne", enClair: "Sur le portail consulaire officiel, remplissez le formulaire et déposez vos pièces pour un premier contrôle. Il faut une lettre d'admission, un niveau de langue suffisant et la preuve de vos ressources. Si une pièce manque, l'ambassade vous le dit sur le portail et vous corrigez en ligne." },
de_visa_rdv: { titre: "Aller au rendez-vous de visa en personne", enClair: "Après le premier contrôle validé, prenez rendez-vous par le lien reçu et venez en personne avec vos originaux. Le rendez-vous est gratuit, et l'ambassade ne passe par aucun agent : méfiez-vous de qui dit le contraire. Venir sans contrôle validé entraîne un refus et bloque toute nouvelle prise de rendez-vous." },
de_anmeldung: { titre: "Déclarer votre adresse après l'emménagement", enClair: "Dès que vous emménagez, déclarez votre adresse au service de la population de votre commune, sous deux semaines. Apportez votre passeport avec le visa et l'attestation de votre propriétaire, à demander avant de signer. Vous recevez une attestation de domicile, qu'on vous demandera ensuite presque partout." },
de_assurance: { titre: "Vous affilier à l'assurance maladie", enClair: "Tout étudiant d'une université publique ou reconnue doit être assuré contre la maladie. Contactez tôt une caisse publique allemande : c'est elle qui envoie un avis électronique à votre université. Même avec une assurance privée, cet avis est obligatoire, sinon votre inscription est bloquée." },
de_immatriculation: { titre: "Vous inscrire à l'université", enClair: "Inscrivez-vous en ligne avant la date fixée par votre lettre d'admission : sinon, vous perdez votre place. Il faut toutes vos pièces, votre paiement et l'avis de votre caisse maladie pour être inscrit. Ce paiement, une contribution demandée chaque semestre, varie d'une université à l'autre." },
de_titre_sejour: { titre: "Demander votre titre de séjour à temps", enClair: "Avant la fin de votre visa, demandez votre titre de séjour au service des étrangers. Déposée à temps, votre demande vous garde en règle jusqu'à la décision. Les rendez-vous sont longs à obtenir : prenez le vôtre dès votre arrivée." },
},

// canada — textes écrits le 2026-09-23 depuis js/procedures/canada.js
canada: {
ca_eed: { titre: "Choisir une école reconnue par le Canada", enClair: "Choisissez votre école dans la liste officielle des établissements reconnus par le Canada. Sans cela, votre admission n'ouvre pas droit au permis d'études. Regardez aussi si elle est publique : en maîtrise, cela vous dispense d'une lettre de la province." },
ca_candidature: { titre: "Candidater directement auprès de l'école", enClair: "Au Canada, il n'y a pas de portail commun : vous candidatez sur le site de chaque école. Chacune fixe sa propre date limite et ses propres frais de dossier. Notez ici le numéro de dossier qu'elle vous donne." },
ca_lettre_acceptation: { titre: "Recevoir votre lettre d'acceptation", enClair: "Si l'école vous admet, elle vous envoie une lettre d'acceptation. Elle est toujours exigée pour le permis d'études : sans elle, la demande peut être refusée. Gardez le fichier original, tel quel, sans le modifier." },
ca_lap_lat: { titre: "Hors Québec : la lettre de la province", enClair: "Hors du Québec, il faut une lettre de la province, remise par votre école. En maîtrise ou en doctorat dans une université publique, vous n'en avez pas besoin. Joignez-la à votre demande de permis ; sinon, joignez la preuve de votre dispense." },
ca_caq_compte: { titre: "Québec : demander le certificat d'acceptation (CAQ)", enClair: "Pour étudier au Québec, demandez d'abord le certificat d'acceptation du Québec, avant le permis d'études. Faites-le sur Arrima dès que vous avez votre lettre d'admission, avec les noms exacts du passeport. Remplissez le formulaire d'une seule traite : il ne peut pas être enregistré en cours de route." },
ca_caq_paiement: { titre: "Québec : payer le certificat, envoyer vos pièces", enClair: "Payez les frais par carte de crédit dans l'heure qui suit l'envoi, sinon la demande ne compte pas. Dès que votre numéro de dossier apparaît, téléversez vos pièces sans attendre : le délai est court. La lettre qui confirme votre certificat remplace, au Québec, la lettre de la province." },
ca_fonds: { titre: "Prouver que vous pouvez vous financer", enClair: "Prouvez que vous pouvez payer études, vie sur place et voyage, sans travailler au Canada. Le montant demandé n'est pas le même au Québec ; il est écrit ci-dessous. Couvrez la première année, et expliquez comment vous financerez la suite." },
ca_compte_ircc: { titre: "Créer votre compte IRCC en ligne", enClair: "Le permis d'études se demande en ligne, sur un compte auprès de l'immigration canadienne (IRCC). Vous y payez, envoyez et suivez votre dossier. Notez bien votre identifiant client et votre numéro de demande : sans eux, aucun suivi possible." },
ca_demande_permis: { titre: "Déposer votre demande de permis d'études", enClair: "Répondez au questionnaire en ligne : il vous donne la liste exacte des documents à joindre. Ajoutez une lettre qui explique pourquoi ce programme, et ce que vous ferez après : elle est vivement recommandée. Une demande incomplète peut être renvoyée sans être étudiée." },
ca_paiement_ircc: { titre: "Payer le permis et les empreintes", enClair: "À la fin de la demande en ligne, payez le permis et la prise d'empreintes en même temps. Un proche peut payer pour vous avec sa carte ; gardez bien le reçu. Si un visa d'entrée vous est nécessaire, il est délivré avec le permis, sans frais en plus." },
ca_biometrie: { titre: "Donner vos empreintes et votre photo", enClair: "Après le dépôt, vous recevez une lettre qui vous convoque pour vos empreintes et votre photo. Prenez rendez-vous tout de suite : votre dossier n'est étudié qu'après cette étape. Le délai pour y aller est court, et le prestataire peut facturer ses propres frais." },
ca_medical: { titre: "Passer la visite médicale, si demandée", enClair: "Pour un long séjour, une visite médicale est souvent exigée, selon les pays où vous avez vécu. Elle se fait uniquement chez un médecin agréé par le Canada, jamais chez votre médecin habituel. Vous la payez sur place, sans remboursement en cas de refus ; faites-la avant de déposer." },
ca_lettre_introduction: { titre: "Recevoir votre lettre d'introduction et votre visa", enClair: "Si votre demande est acceptée, vous recevez une lettre d'introduction : ce n'est pas encore le permis. Selon votre nationalité, un visa est collé dans votre passeport ou une autorisation électronique y est liée. Voyagez avec ce même passeport, jamais un autre, même valide." },
ca_arrivee: { titre: "Arriver au Canada et recevoir votre permis", enClair: "Votre permis d'études vous est remis à l'arrivée, par l'agent de la frontière. Gardez sur vous, pas en soute, votre passeport, la lettre d'introduction, l'acceptation et vos preuves de fonds. Vous ne pouvez pas travailler avant le vrai début de vos cours." },
},

// chine — textes écrits le 2026-09-23 depuis js/procedures/chine.js
chine: {
cn_langue: { titre: "Prouver mon niveau de chinois ou d'anglais", enClair: "Pour une formation enseignée en chinois, il faut un bon niveau au test officiel HSK. Pour une formation en anglais, un test comme l'IELTS ou le TOEFL est demandé. Chaque université fixe son niveau minimum : lisez-le avant de payer un test." },
cn_csca: { titre: "Licence : passer l'examen d'entrée CSCA", enClair: "Pour entrer en licence, les universités chinoises participantes exigent désormais l'examen CSCA, avec ou sans bourse. Il a lieu plusieurs fois par an : chinois, mathématiques ou sciences, selon la formation. Inscrivez-vous tôt sur son site officiel. En master ou en doctorat, il ne vous concerne pas." },
cn_sante_casier: { titre: "Faire mon examen médical et mon casier judiciaire", enClair: "Faites remplir le formulaire médical officiel pour étrangers par un médecin, avec les analyses demandées, puis faites-le signer et tamponner. Demandez aussi un extrait de casier judiciaire. Les deux doivent dater de moins de six mois au dépôt : faites-les peu avant de candidater, et gardez les originaux pour l'arrivée." },
cn_choix_voie: { titre: "Choisir entre la bourse chinoise et l'autofinancement", enClair: "La bourse du gouvernement chinois se demande en ligne, soit par l'ambassade de Chine, soit par une université. En autofinancement, vous postulez vous-même sur le site de chaque université et vous payez vos études. Les bourses ferment tôt : décidez dès la rentrée qui précède." },
cn_bourse_type: { titre: "Bourse : choisir le type A ou le type B", enClair: "Le type A passe par l'ambassade de Chine de votre pays, qui présélectionne les candidats. Le type B passe directement par une université chinoise, avec son propre numéro. Vérifiez l'âge maximum et les conditions de l'année avant de commencer." },
cn_bourse_compte: { titre: "Bourse : créer mon compte sur le site officiel", enClair: "La candidature se fait en ligne, sur le système officiel des bourses du gouvernement chinois. Vous y indiquez un numéro d'agence : celui de l'ambassade pour le type A, celui de l'université pour le type B. Recopiez-le depuis l'annonce officielle de l'année, jamais depuis un site privé." },
cn_bourse_pieces: { titre: "Bourse : envoyer mes pièces en ligne", enClair: "Préparez votre passeport, vos diplômes et relevés, un projet d'études, des lettres de recommandation et un justificatif de langue. Ajoutez le formulaire médical et le casier judiciaire, récents, et en licence votre score à l'examen CSCA. Avant l'envoi, il faut aussi l'accord de principe d'au moins une des universités choisies." },
cn_bourse_soumission: { titre: "Bourse : soumettre avant la date limite", enClair: "Soumettez votre dossier en ligne avant la date limite de l'ambassade ou de l'université : elles ne sont pas toutes les mêmes. Dans certains pays, un dossier papier se remet en même temps au ministère : lisez l'avis de l'ambassade. Gardez une capture de la soumission." },
cn_bourse_universite: { titre: "Bourse de type B : candidater aussi à l'université", enClair: "Si vous passez par une université, l'envoi au conseil chinois des bourses ne suffit pas : candidatez aussi sur le site de cette université. Ses frais de dossier ne sont jamais remboursés, même par la bourse. Si vous passez par l'ambassade, cette étape ne vous concerne pas." },
cn_bourse_entretien: { titre: "Bourse : l'évaluation de mon dossier", enClair: "Votre dossier est d'abord évalué dans votre pays ou par l'université, parfois avec un entretien. La décision finale revient ensuite au conseil chinois des bourses, qui peut encore refuser. Restez joignable et surveillez vos messages." },
cn_bourse_resultat: { titre: "Bourse : le résultat et ce qu'elle couvre", enClair: "Une bourse complète couvre les frais d'études, le logement ou une aide au logement, une allocation mensuelle et l'assurance maladie. Il existe aussi des bourses partielles. Rien n'est versé avant votre arrivée en Chine : lisez bien votre lettre." },
cn_uni_choix: { titre: "Autofinancement : connaître les règles de chaque université", enClair: "Chaque université a son site de candidature, ses dates et ses conditions, parfois différentes d'une faculté à l'autre. Pour chacun de vos vœux, notez la langue des cours, le niveau demandé, le prix par an et la date limite. Certaines limitent le nombre de programmes choisis : lisez leurs règles avant de postuler." },
cn_uni_candidature: { titre: "Autofinancement : postuler sur le site de chaque université", enClair: "Créez un compte sur le site officiel de chaque université, puis déposez-y un dossier complet : passeport, diplômes, relevés, tests de langue et pièces demandées. Un dossier incomplet n'est pas étudié. Un entretien suit souvent l'examen du dossier." },
cn_uni_frais: { titre: "Autofinancement : payer les frais de dossier", enClair: "Chaque université fait payer sa candidature, en ligne, au moment de l'envoi. Ces frais ne sont jamais remboursés, même en cas de refus. Un dossier non payé n'est pas étudié : gardez chaque reçu." },
cn_admission: { titre: "Recevoir mon avis d'admission et mon formulaire de visa", enClair: "L'université vous envoie votre avis d'admission avec un formulaire officiel de demande de visa d'études. Le boursier reçoit un modèle, l'étudiant autofinancé un autre. Gardez les originaux : ils servent pour le visa, puis à l'arrivée en Chine." },
cn_visa: { titre: "Demander mon visa d'études", enClair: "Déposez votre demande au centre de visas chinois de votre pays, sur rendez-vous. Apportez passeport, formulaire, photo, avis d'admission et formulaire de visa d'études, en original et en copie. Pour les Sénégalais, le visa est gratuit : seuls les frais de service du centre sont dus." },
cn_arrivee: { titre: "Me déclarer et m'inscrire à l'arrivée", enClair: "Dès l'arrivée, déclarez votre logement à la police dans le délai très court prévu par la loi. Inscrivez-vous ensuite à l'université avec vos diplômes originaux. Faites aussi vérifier votre examen médical au centre de santé des voyageurs de la ville." },
cn_permis_sejour: { titre: "Demander mon permis de résidence", enClair: "Votre visa d'études ne suffit pas : demandez un permis de résidence à la police des étrangers dans le mois qui suit votre arrivée. Apportez passeport, formulaire, photo, attestation de l'université et avis d'admission. Le prix dépend de la durée du permis." },
cn_assurance: { titre: "Payer mon assurance étudiante", enClair: "Les universités chinoises exigent une assurance étudiante, payée chaque année. Elle couvre les accidents et l'hospitalisation. Pour les boursiers, l'assurance est comprise dans la bourse." },
},

// malaisie — textes écrits le 2026-09-23 depuis js/procedures/malaisie.js
malaisie: {
my_etablissement: { titre: "Vérifier que mes établissements sont reconnus", enClair: "Pour chaque vœu, vérifiez que l'université est publique, ou un établissement privé enregistré par le ministère malaisien. Cherchez aussi la formation dans le registre national des programmes accrédités. Regardez la langue des cours : certaines licences se font en malais." },
my_langue: { titre: "Prouver mon niveau d'anglais", enClair: "La plupart des cours sont en anglais, et un certificat d'anglais est demandé pour le visa étudiant. Joignez-le dès la demande : sans lui, le visa ne couvre pas toute la durée de vos études. Chaque université fixe son score minimum." },
my_candidature: { titre: "Candidater auprès de chaque université", enClair: "Il n'y a pas de portail commun : vous candidatez sur le site de chaque université. Chacune fixe ses dates et ses frais de dossier, qui ne sont pas remboursés. Notez le numéro de candidature qu'elle vous donne." },
my_offre: { titre: "Recevoir ma lettre d'offre", enClair: "Si l'université vous admet, elle vous envoie une lettre d'offre par courriel. Acceptez-la selon ses consignes : sans elle, aucune demande de visa n'est possible. Gardez le fichier original, sans le modifier." },
my_emgs_dossier: { titre: "Préparer ma demande de visa étudiant", enClair: "La demande se fait en ligne auprès d'EMGS, souvent par votre université, pendant que vous êtes encore dans votre pays. Il faut un passeport valable longtemps, une photo sur fond blanc, vos diplômes traduits en anglais et une déclaration de santé. Écrivez votre nom exactement comme sur le passeport." },
my_caution: { titre: "Verser la caution de l'immigration", enClair: "L'université signe une caution pour vous auprès de l'immigration, et vous lui en versez le montant. Il vous est rendu à la fin de vos études si vous avez respecté les règles. Faites confirmer le montant par votre université." },
my_emgs_paiement: { titre: "Payer les frais du visa étudiant", enClair: "Payez les frais d'EMGS avec la demande : traitement, lettre d'approbation, vignette, carte d'étudiant et visite médicale. Ils ne sont pas remboursés. Certaines universités encaissent elles-mêmes ces frais avec les leurs : gardez chaque reçu." },
my_assurance: { titre: "Prendre l'assurance santé obligatoire", enClair: "Tout étudiant étranger doit être assuré pour la santé pendant son séjour. Choisissez un plan agréé avec votre demande, ou passez par votre université pour une autre assurance. Si elle expire avant votre visa, prolongez-la." },
my_eval: { titre: "Recevoir mon eVAL, la lettre d'approbation", enClair: "EMGS étudie votre dossier, puis l'immigration délivre l'eVAL, une lettre électronique qui approuve votre visa. Vous ne pouvez pas entrer en Malaisie avant de l'avoir reçue. Elle n'est valable que quelques mois : organisez votre voyage à temps." },
my_visa: { titre: "Demander mon visa d'entrée", enClair: "Pour plusieurs nationalités, dont les Sénégalais, l'eVAL ne suffit pas : il faut aussi un visa d'entrée unique. Demandez-le en ligne sur le portail officiel de l'immigration, après l'eVAL et avant de partir. Voyager sans lui peut bloquer votre visa étudiant." },
my_arrivee: { titre: "Arriver en Malaisie", enClair: "À l'aéroport, présentez-vous au comptoir d'accueil des étudiants d'EMGS avant l'immigration. Gardez sur vous passeport, eVAL, visa et lettre d'offre, pas en soute. Emportez aussi votre carnet de vaccination contre la fièvre jaune." },
my_medical: { titre: "Passer la visite médicale à l'arrivée", enClair: "Dans les tout premiers jours après l'arrivée, passez la visite médicale dans une clinique agréée par EMGS. Sans elle, votre visa étudiant ne peut pas être collé dans le passeport. Le délai est très court : prenez rendez-vous dès votre arrivée." },
my_inscription: { titre: "M'enregistrer à l'université", enClair: "Présentez-vous au bureau des étudiants internationaux de votre université avec passeport, visa et lettre d'acceptation. Suivez ses consignes pour l'inscription et le paiement des frais d'études. Gardez tous vos reçus." },
my_student_pass: { titre: "Faire coller mon visa étudiant", enClair: "Après la visite médicale, votre université dépose votre passeport à l'immigration pour y coller le visa étudiant, et vous recevez une carte d'étudiant étranger. S'il ne couvre pas tout votre cursus, renouvelez-le plusieurs mois avant qu'il n'expire. Et ne travaillez jamais sans autorisation." },
},
};

/** Les textes d'une étape, ou null. */
export function enClairDe(idDestination, idEtape) {
const t = ETAPES_EN_CLAIR[idDestination];
return (t && t[idEtape]) || null;
}
