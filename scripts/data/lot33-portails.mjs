// ============================================================
// FitzUniverse — Lot 33 : le portail de candidature des universités
// (données du 2026-08-31)
//
// `universities.applicationPortalUrl` doit être le portail d'ADMISSION
// de l'établissement. Sur 111 universités, 27 pointaient vers un
// domaine tiers. La recherche à la source a montré que LE DOMAINE
// TIERS N'EST PAS LE BON TEST :
//
//   - 3 saoudiennes (KAU, King Saud, Princess Nourah) : studyinsaudi
//     est la plateforme d'ADMISSION unifiée de l'État saoudien, pas un
//     programme de bourses. VALEUR CORRECTE, NON MODIFIÉE ICI.
//   - Humboldt : uni-assist est un tiers, et c'est POURTANT le bon
//     portail — le critère n'est pas la nationalité mais l'origine du
//     diplôme, et tout titre étranger y passe.
//   - 3 marocaines publiques : il n'existe AUCUN portail d'admission
//     directe pour un étranger. Le champ est VIDÉ, pas remplacé.
//
// Le vrai test est : « est-ce là que le candidat dépose son dossier
// d'ADMISSION ? » — pas « le domaine appartient-il à l'université ? ».
//
// POURQUOI CE LOT COMPTE PLUS QU'IL N'EN A L'AIR
// La fiche porte trois liens depuis la phase 1 : le portail du
// BAILLEUR (public), le site de l'université (public), et le portail
// de candidature — RÉSERVÉ AUX ABONNÉS. Quand ce dernier contenait
// déjà l'URL du bailleur, l'abonné payait pour le lien identique à
// celui que le visiteur gratuit voyait juste au-dessus. Sur Chevening,
// les trois universités britanniques renvoyaient l'abonné vers
// chevening.org/apply.
//
// RÈGLE DE CHOIX D'URL, appliquée uniformément : préférer le point
// d'entrée officiel STABLE sur le domaine de l'établissement quand le
// portail brut est une URL de session à paramètres (Oxford eVision,
// EPFL ISA par cycle) ; retenir le portail brut quand son URL est
// propre (UZH, apply.upb.ro, eApply).
//
// UN CHAMP VIDE EST UNE RÉPONSE. details.js masque proprement le
// bouton — mieux vaut rien qu'une URL qui n'est pas un portail.
// ============================================================

export const PATCHES = [

  // ---------------- Belgique — le portail était celui d'un programme de bourses (ARES / VLIR-UOS) ----------------
  {
    collection: "universities",
    id: "uclouvain-louvain-la-neuve",
    attendu: { applicationPortalUrl: "https://www.ares-ac.be/fr/bourses-de-formations-internationales-2027-2028" },
    champs: { applicationPortalUrl: "https://registration.osis.uclouvain.be/" },
    motif: "portail OSIS, licence master et doctorat"
  },
  {
    collection: "universities",
    id: "universite-de-liege-liege",
    attendu: { applicationPortalUrl: "https://www.ares-ac.be/fr/bourses-de-formations-internationales-2027-2028" },
    champs: { applicationPortalUrl: "https://my.uliege.be/admissions" },
    motif: "formulaire d'admission en ligne, tous cycles ; my.uliege.be/firstcontact n'est qu'une étape de premier contact"
  },
  {
    collection: "universities",
    id: "universite-de-namur-namur",
    attendu: { applicationPortalUrl: "https://www.ares-ac.be/fr/bourses-de-formations-internationales-2027-2028" },
    champs: { applicationPortalUrl: "https://unamur.be/inscriptions/signin" },
    motif: "plateforme d'inscription en ligne, tous cycles, 200 € de frais de dossier hors UE"
  },
  {
    collection: "universities",
    id: "universite-libre-de-bruxelles-bruxelles",
    attendu: { applicationPortalUrl: "https://www.ares-ac.be/fr/bourses-de-formations-internationales-2027-2028" },
    champs: { applicationPortalUrl: "https://monulb.ulb.be/" },
    motif: "portail MonULB ; création de compte préalable sur sign-up.apps.ulb.be"
  },
  {
    collection: "universities",
    id: "ghent-university-gand",
    attendu: { applicationPortalUrl: "https://www.vliruos.be/en/scholarships" },
    champs: { applicationPortalUrl: "https://oasis.ugent.be/oasis-web/registratie?target=inschrijven" },
    motif: "portail OASIS, licence et master SEULEMENT — le doctorat est initié par le promoteur, jamais par le candidat"
  },
  {
    collection: "universities",
    id: "ku-leuven-louvain",
    attendu: { applicationPortalUrl: "https://www.vliruos.be/en/scholarships" },
    champs: { applicationPortalUrl: "https://www.kuleuven.be/english/apply" },
    motif: "section officielle « Admission and application ». À CONFIRMER : kuleuven.be était injoignable pendant la recherche, et apply.kuleuven.be, propagé par un blog tiers, N'EXISTE PAS en DNS"
  },

  // ---------------- Allemagne — daad.de est l'agence de bourses, pas un portail d'admission ----------------
  {
    collection: "universities",
    id: "humboldt-universitat-zu-berlin-berlin",
    attendu: { applicationPortalUrl: "https://www2.daad.de/deutschland/stipendium/datenbank/en/21148-scholarship-database/?detail=50026200" },
    champs: { applicationPortalUrl: "https://www.uni-assist.de/en/" },
    motif: "uni-assist EST le bon portail ici : le critère n'est pas la nationalité mais l'origine du diplôme, et tout titre étranger passe par uni-assist. studienplatz.hu-berlin.de serait FAUX pour un international"
  },
  {
    collection: "universities",
    id: "leibniz-universitat-hannover-hannover",
    attendu: { applicationPortalUrl: "https://www2.daad.de/deutschland/stipendium/datenbank/en/21148-scholarship-database/?detail=50026200" },
    champs: { applicationPortalUrl: "https://www.uni-hannover.de/en/studium/vor-dem-studium/bewerbung-zulassung/studienplatzbewerbung" },
    motif: "à l'inverse de Humboldt : uni-assist ne délivre ici qu'une VPD, le dépôt se fait sur le QIS de l'université"
  },
  {
    collection: "universities",
    id: "universitat-hamburg-hamburg",
    attendu: { applicationPortalUrl: "https://www2.daad.de/deutschland/stipendium/datenbank/en/21148-scholarship-database/?detail=50026200" },
    champs: { applicationPortalUrl: "https://www.uni-hamburg.de/online-application" },
    motif: "portail STiNE ; uni-assist n'intervient que pour attester la reconnaissance du diplôme"
  },

  // ---------------- Maroc — les trois publiques n'ont AUCUN portail d'admission directe ----------------
  {
    collection: "universities",
    id: "universite-cadi-ayyad-marrakech",
    attendu: { applicationPortalUrl: "https://www.amci.ma/cooperation-academique" },
    champs: { applicationPortalUrl: "" },
    motif: "« Tout dossier non transmis par l'AMCI ne sera pas pris en considération » : la voie diplomatique est la seule. e-candidature.uca.ma existe mais relève du circuit national marocain, pas des étrangers"
  },
  {
    collection: "universities",
    id: "universite-hassan-ii-casablanca",
    attendu: { applicationPortalUrl: "https://www.amci.ma/cooperation-academique" },
    champs: { applicationPortalUrl: "" },
    motif: "« Applications for enrollment are submitted through diplomatic channels to the AMCI » ; la digitalisation annoncée n'expose aucune URL candidat"
  },
  {
    collection: "universities",
    id: "universite-mohammed-v-rabat",
    attendu: { applicationPortalUrl: "https://www.amci.ma/cooperation-academique" },
    champs: { applicationPortalUrl: "" },
    motif: "avis favorable transitant par une plateforme ministérielle RÉSERVÉE À L'ADMINISTRATION, sans accès candidat"
  },
  {
    collection: "universities",
    id: "universite-mohammed-vi-polytechnique-benguerir",
    attendu: { applicationPortalUrl: "https://mastercardfdn.org/en/what-we-do/our-programs/mastercard-foundation-scholars-program/where-to-apply/universite-mohammed-vi-polytechnique/" },
    champs: { applicationPortalUrl: "https://www.um6p.ma/apply" },
    motif: "seule marocaine du lot à avoir un vrai portail (établissement privé, hors circuit AMCI) ; formulaire sur my.um6p.ma. admission.um6p.ma, cité par un site tiers, a un certificat invalide"
  },

  // ---------------- Turquie et Russie ----------------
  {
    collection: "universities",
    id: "istanbul-technical-university-istanbul",
    attendu: { applicationPortalUrl: "https://www.turkiyeburslari.gov.tr" },
    champs: { applicationPortalUrl: "https://www.sis.itu.edu.tr/EN/student/intenational-students/application.php" },
    motif: "page d'orientation officielle couvrant licence et master-doctorat (la faute de frappe « intenational » est dans l'URL officielle de l'ITU)"
  },
  {
    collection: "universities",
    id: "hse-university-moscow",
    attendu: { applicationPortalUrl: "https://od.globaluni.ru/" },
    champs: { applicationPortalUrl: "https://admissions.hse.ru/en/" },
    motif: "point d'entrée officiel vérifié ; le compte candidat asav.hse.ru bloque les robots et n'a pas pu être inspecté directement"
  },

  // ---------------- Royaume-Uni — chevening.org est la bourse, pas l'admission ----------------
  {
    collection: "universities",
    id: "university-of-oxford-oxford",
    attendu: { applicationPortalUrl: "https://www.chevening.org/apply/" },
    champs: { applicationPortalUrl: "https://www.ox.ac.uk/admissions/graduate/applying-to-oxford" },
    motif: "page officielle de candidature postgraduate ; le lien eVision brut porte des paramètres de session, trop fragile pour la base. La licence passe par UCAS, ce qui est légitime"
  },
  {
    collection: "universities",
    id: "university-of-edinburgh-edinburgh",
    attendu: { applicationPortalUrl: "https://www.chevening.org/apply/" },
    champs: { applicationPortalUrl: "https://study.ed.ac.uk/programmes" },
    motif: "le degree finder est le point d'entrée officiel, EUCLID s'ouvre derrière"
  },
  {
    collection: "universities",
    id: "imperial-college-london-london",
    attendu: { applicationPortalUrl: "https://www.chevening.org/apply/" },
    champs: { applicationPortalUrl: "https://myimperial.powerappsportals.com/" },
    motif: "portail « My Imperial », même dépôt pour le master et le doctorat"
  },

  // ---------------- Suisse — admin.ch est le portail des bourses fédérales d'excellence ----------------
  {
    collection: "universities",
    id: "epfl-lausanne",
    attendu: { applicationPortalUrl: "https://www.sbfi.admin.ch/en/swiss-government-excellence-scholarships" },
    champs: { applicationPortalUrl: "https://www.epfl.ch/education/admission/" },
    motif: "hub d'admission couvrant master ET doctorat : le catalogue porte les deux cycles pour l'EPFL, un lien master seul serait faux pour le programme doctoral EDIC"
  },
  {
    collection: "universities",
    id: "eth-zurich-zurich",
    attendu: { applicationPortalUrl: "https://www.sbfi.admin.ch/en/swiss-government-excellence-scholarships" },
    champs: { applicationPortalUrl: "https://www.lehrbetrieb.ethz.ch/eApply/ealogin.view?lang=en" },
    motif: "portail eApply, unique pour licence, master et doctorat"
  },
  {
    collection: "universities",
    id: "university-of-zurich-zurich",
    attendu: { applicationPortalUrl: "https://www.sbfi.admin.ch/en/swiss-government-excellence-scholarships" },
    champs: { applicationPortalUrl: "https://application.uzh.ch" },
    motif: "« Applications can only be submitted online via the UZH application portal »"
  },

  // ---------------- Roumanie et Kenya ----------------
  {
    collection: "universities",
    id: "politehnica-bucuresti-bucarest",
    attendu: { applicationPortalUrl: "https://scholarships.studyinromania.gov.ro" },
    champs: { applicationPortalUrl: "https://apply.upb.ro/" },
    motif: "section « non-EU citizens » ; studyinromania.gov.ro reste la voie de la BOURSE d'État"
  },
  {
    collection: "universities",
    id: "universite-de-bucarest-bucarest",
    attendu: { applicationPortalUrl: "https://scholarships.studyinromania.gov.ro" },
    champs: { applicationPortalUrl: "https://admission.unibuc.ro/" },
    motif: "plateforme « International Citizens Admission » ; le hub international.unibuc.ro est en refonte et ne répond pas"
  },
  {
    collection: "universities",
    id: "jkuat-juja",
    attendu: { applicationPortalUrl: "https://www.au-pau.org/submission/" },
    champs: { applicationPortalUrl: "https://admission.jkuat.ac.ke/" },
    motif: "CORRIGE MA PROPRE ERREUR du lot 31 : j'y avais mis au-pau.org, qui est le bailleur. Niveaux couverts non confirmés (portail en JavaScript). Ne pas confondre avec KUCCPS, réservé aux Kényans financés par l'État"
  },
];
