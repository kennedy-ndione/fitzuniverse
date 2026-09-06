/**
 * ============================================================
 * LOT 38 — ÉCHÉANCES VÉRIFIÉES (5 septembre 2026)
 * ============================================================
 *
 * Premier lot du chantier de fraîcheur ouvert par le radar
 * (`npm run radar`, admin/radar.html). Il porte UNIQUEMENT DES PATCHES :
 * aucune bourse, aucune université, aucun programme n'est créé.
 *
 * PÉRIMÈTRE — les 4 bourses que le radar signalait en CONTRADICTION
 * (statut « Ouverte », échéance dépassée), les 5 dont l'échéance tombe
 * dans moins de deux mois et que 72 à 120 profils d'étudiants voient,
 * plus Stipendium Hungaricum, la bourse la plus exposée du catalogue
 * (360 profils sur 360).
 *
 * CE QUE CHAQUE PATCH ÉCRIT, AU PLUS :
 *   verifieLe        date de LECTURE d'une page officielle (ISO)
 *   sourceEcheance   l'URL exacte où l'échéance a été lue
 *   periodeOuverture le rythme annuel, en clair
 *   exigences        vocabulaire fermé (voir plus bas)
 *   echeanceVariable "pays" | "etablissement" — quand la date limite
 *                    n'est PAS une propriété de la bourse
 *   deadline/status  seulement quand la lecture les contredit
 *
 * RÈGLE TENUE SANS EXCEPTION DANS CE LOT
 * --------------------------------------
 * `verifieLe` n'est écrit QUE là où une page officielle a été lue le
 * 2026-09-05. Là où la source est inaccessible (SISGP : 403 ; base de
 * bourses du DAAD : robots.txt), le champ reste absent et le texte le
 * dit. Une date de vérification fausse serait pire que pas de date :
 * elle ferait croire le catalogue à jour.
 *
 * VOCABULAIRE FERMÉ DE `exigences`
 * --------------------------------
 *   experience_pro_2ans            au moins deux ans après le dernier diplôme
 *   admission_prealable            il faut être admis avant d'obtenir la bourse
 *   projet_recherche               projet écrit exigé
 *   directeur_these                encadrant ou laboratoire d'accueil exigé
 *   diplome_recent                 le diplôme ne doit pas dépasser un âge donné
 *   lettres_recommandation         recommandations ou évaluations exigées
 *   certification_langue_requise   test de langue officiel exigé
 *   candidature_via_ambassade      dépôt par l'ambassade du pays de résidence
 *   candidature_via_etablissement  dépôt par l'établissement d'accueil (AJOUTÉ
 *                                  par ce lot : l'Eiffel se dépose par
 *                                  l'université française, jamais par
 *                                  l'étudiant, et rien dans le vocabulaire
 *                                  ne savait le dire)
 *   nomination_autorite_nationale  nomination par une autorité du pays
 *                                  d'origine (AJOUTÉ par ce lot : Stipendium
 *                                  Hungaricum ; ce n'est pas une ambassade)
 *
 * Absent = INCONNU. Un champ `exigences` vide n'a jamais le sens de
 * « aucune exigence » — mêmes trois valeurs que partout ailleurs.
 * ============================================================
 */

const LE_JOUR = "2026-09-05";

// ==========================================================
// Les identifiants de programmes, groupés — les patches répétitifs
// sont générés plus bas, pour que ce fichier reste relisible.
// ==========================================================

const ARES = [
  "uclouvain-louvain-la-neuve__bourses-formations-internationales-ares",
  "universite-de-liege-liege__bourses-formations-internationales-ares",
  "universite-de-namur-namur__bourses-formations-internationales-ares",
  "universite-libre-de-bruxelles-bruxelles__bourses-formations-internationales-ares"
];

const DAAD = [
  "humboldt-universitat-zu-berlin-berlin__daad-study-scholarships",
  "leibniz-universitat-hannover-hannover__daad-study-scholarships",
  "universitat-hamburg-hamburg__daad-study-scholarships"
];

// Les 44 programmes Eiffel SANS aucune échéance en base. Deux autres
// (Sciences Po, Sorbonne) en portent déjà une, traités à part.
const EIFFEL_SANS_DATE = [
  "aix-marseille-universite-marseille", "ecole-normale-superieure-de-lyon-lyon",
  "ecole-polytechnique-palaiseau", "essec-business-school-cergy",
  "hec-paris-jouy-en-josas", "insa-lyon-villeurbanne", "mines-paris-psl-paris",
  "nantes-universite-nantes", "universite-claude-bernard-lyon-1-villeurbanne",
  "universite-cote-d-azur-nice", "universite-de-bordeaux-bordeaux",
  "universite-de-lille-lille", "universite-de-lorraine-nancy",
  "universite-de-rennes-rennes", "universite-de-strasbourg-strasbourg",
  "universite-de-toulouse-toulouse", "universite-grenoble-alpes-grenoble",
  "universite-paris-1-pantheon-sorbonne-paris", "universite-paris-cite-paris",
  "universite-paris-dauphine-psl-paris", "universite-paris-saclay-orsay",
  "universite-sorbonne-paris-nord-villetaneuse"
].flatMap((u) => [
  `${u}__eiffel-excellence-scholarship__doctorat`,
  `${u}__eiffel-excellence-scholarship__master`
]);

const STIPENDIUM = [
  "bme", "corvinus", "elte", "mate", "miskolc", "obuda", "semmelweis",
  "sze", "udebrecen", "upecs", "uszeged"
].flatMap((u) => [`${u}-bachelor`, `${u}-master`, `${u}-phd`]);

// ==========================================================
// Les textes d'échéance partagés
// ==========================================================

const TEXTE_ARES =
  "18 septembre 2026 à 12h00 (heure belge) sur la plateforme GIRAF, pour la campagne 2027-2028. " +
  "ATTENTION : la création et la validation du compte GIRAF devaient être demandées avant le " +
  "4 septembre 2026 à 16h00 — sans compte validé, le dépôt n'est plus possible pour cette campagne.";

const TEXTE_EIFFEL =
  "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement " +
  "fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. " +
  "Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le " +
  "28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date " +
  "affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié au 5 septembre 2026. " +
  "Contacter le service des relations internationales de l'établissement visé.";

// ⚠️ AUCUNE DATE COMPLÈTE (jour + mois + année) DANS CE TEXTE.
// js/echeance.js lit les dates dans la prose : une date citée en
// exemple, ou même la date de vérification, serait présentée à
// l'étudiant comme SA date limite. Testé : écrire « le 5 septembre
// 2026 » dans cette phrase faisait afficher « Dernier jour pour
// candidater ». Les mois nus (« fin août », « la mi-novembre ») ne
// sont pas lus comme des dates — c'est voulu, et c'est exactement ce
// qu'il faut ici.
const TEXTE_DAAD =
  "La date limite du DAAD DÉPEND DU PAYS DE RÉSIDENCE du candidat et se lit appel par appel dans la base " +
  "de bourses du DAAD. La date de fin août portée jusqu'ici n'a pas pu être confirmée à ce jour : la base " +
  "de bourses refuse la consultation automatisée. Pour la campagne 2026-2027, une université partenaire " +
  "européenne annonçait la mi-novembre. Le dépôt se fait à l'automne pour la rentrée suivante. " +
  "Vérifier l'appel correspondant à votre pays avant toute démarche.";

// ⚠️ LA SEULE DATE COMPLÈTE DE CE TEXTE EST CELLE QUI COMPTE.
// La date de la campagne précédente est écrite « à la mi-janvier 2026 »
// sans jour, pour qu'elle ne soit pas lue à la place de la bonne. Et le
// mot « clos » est évité : c'est un marqueur qui l'emporte sur toute
// date dans js/echeance.js, il ferait basculer la fiche en « close »
// alors que la clôture annoncée est encore devant nous.
const TEXTE_STIPENDIUM =
  "Clôture attendue le 15 janvier 2027 pour la campagne 2027-2028 ; ouverture du portail en " +
  "novembre-décembre 2026. Pour la campagne précédente, le dépôt s'achevait à la mi-janvier 2026 à 14h00 CET. " +
  "Aucune admission préalable n'est exigée au dépôt — les épreuves d'entrée ont lieu en mars-mai — mais la " +
  "NOMINATION par l'autorité compétente du pays d'origine est obligatoire, avec un dossier à déposer en " +
  "parallèle auprès de cette autorité (« Sending Partner »).";

// ==========================================================
// PATCHES
// ==========================================================

export const PATCHES = [

  // ---------- 1. ARES — vérifiée, date CONFIRMÉE, porte d'entrée ratée ----------
  ...ARES.map((id) => ({
    collection: "programs",
    id,
    attendu: { deadline: "18 septembre 2026, 12h00 (candidature 2027-2028)" },
    champs: { deadline: TEXTE_ARES },
    motif: "Date confirmée sur ares-ac.be le 2026-09-05. La lecture a révélé une porte d'entrée que le catalogue ne mentionnait pas : le compte GIRAF devait être validé avant le 4 septembre 2026 à 16h. Un étudiant à qui l'on affiche « il vous reste 13 jours » ne peut en réalité plus déposer."
  })),

  {
    collection: "scholarships",
    id: "bourses-formations-internationales-ares",
    champs: {
      verifieLe: LE_JOUR,
      sourceEcheance: "https://www.ares-ac.be/fr/bourses-de-formations-internationales-2027-2028",
      periodeOuverture: "appel annuel : compte GIRAF à faire valider début septembre, dépôt à la mi-septembre pour l'année académique suivante",
      exigences: ["experience_pro_2ans", "diplome_recent"]
    },
    motif: "Vérifiée sur le site de l'ARES : au moins deux ans d'expérience professionnelle après le dernier diplôme, diplôme de moins de 20 ans au début de la formation, résidence ET travail dans l'un des 32 pays éligibles."
  },

  // ---------- 2. Chevening — date CONFIRMÉE ----------
  {
    collection: "programs",
    id: "imperial-college-london-london__chevening-scholarships",
    attendu: { deadline: "6 octobre 2026, 11h00 UTC (candidature 2027-2028)" },
    champs: {
      deadline: "6 octobre 2026 à 11h00 UTC (promotion 2027-2028) — candidatures ouvertes depuis le 4 août 2026 à 11h00 UTC. Une offre universitaire INCONDITIONNELLE doit ensuite être fournie avant le 8 juillet 2027 à 17h00 (heure britannique) ; entretiens de mars à avril 2027, résultats à partir de la mi-juin 2027."
    },
    motif: "Calendrier confirmé sur chevening.org/scholarships/application-timeline le 2026-09-05. La date de dépôt était juste ; la date de l'offre inconditionnelle, qui commande tout l'ordre des démarches, manquait."
  },

  {
    collection: "scholarships",
    id: "chevening-scholarships",
    champs: {
      verifieLe: LE_JOUR,
      sourceEcheance: "https://www.chevening.org/scholarships/application-timeline/",
      periodeOuverture: "appel annuel : ouverture début août, clôture début octobre, pour une rentrée en septembre-octobre de l'année suivante",
      exigences: ["experience_pro_2ans"]
    },
    motif: "Calendrier 2027-2028 vérifié le 2026-09-05."
  },

  // ---------- 3. Knight-Hennessy — date CONFIRMÉE ----------
  {
    collection: "programs",
    id: "stanford-university-stanford__knight-hennessy-scholars",
    attendu: { deadline: "6 octobre 2026, 13h (heure Pacifique)" },
    champs: {
      deadline: "6 octobre 2026 à 13h00 (heure du Pacifique) pour la cohorte 2027. La candidature au PROGRAMME de Stanford est séparée et doit être déposée avant la plus proche de ces deux dates : la date limite propre au programme, ou le 1er décembre 2026 (les candidats MBA doivent respecter le Round 1, plus tôt)."
    },
    motif: "Date confirmée sur knight-hennessy.stanford.edu le 2026-09-05. La double candidature — bourse ET programme, avec deux échéances distinctes — n'apparaissait nulle part : c'est la cause d'échec la plus fréquente de ce programme."
  },

  {
    collection: "scholarships",
    id: "knight-hennessy-scholars",
    champs: {
      verifieLe: LE_JOUR,
      sourceEcheance: "https://knight-hennessy.stanford.edu/admission/preparing-your-applications/application-deadlines",
      periodeOuverture: "appel annuel : clôture début octobre pour une entrée l'année suivante",
      exigences: ["lettres_recommandation", "certification_langue_requise"]
    },
    motif: "Vérifiée le 2026-09-05 : deux recommandations, TOEFL minimum 100 iBT pour la plupart des programmes de master de Stanford si l'anglais n'est pas la langue d'enseignement."
  },

  // ---------- 4. Mastercard Foundation — Édimbourg ----------
  {
    collection: "programs",
    id: "university-of-edinburgh-edinburgh__mastercard-foundation-edinburgh",
    attendu: { deadline: "Séances d'information obligatoires du 15 au 24 septembre 2026 ; candidatures du 13 octobre au 19 novembre 2026 à 17h00 (heure britannique)" },
    champs: {
      deadline: "Séances d'information OBLIGATOIRES du 15 au 24 septembre 2026. Ouverture des candidatures le 13 octobre 2026. La déclaration du candidat doit être rendue avant le 19 octobre 2026 à 17h00 (heure britannique) et PEUT FERMER PLUS TÔT une fois le quota atteint. Dossier complet et formulaires d'évaluation avant le 19 novembre 2026 à 17h00. Entrée en septembre 2027."
    },
    motif: "Calendrier confirmé sur edinburgh-global.ed.ac.uk le 2026-09-05. Deux faits manquaient et changent tout : la déclaration intermédiaire du 19 octobre, et le fait qu'elle peut fermer avant terme — la vraie première porte n'est pas le 19 novembre."
  },

  {
    collection: "scholarships",
    id: "mastercard-foundation-edinburgh",
    champs: {
      verifieLe: LE_JOUR,
      sourceEcheance: "https://edinburgh-global.ed.ac.uk/mastercard-foundation-scholars-program/apply-for-a-scholarship/application-timelines",
      periodeOuverture: "appel annuel : séances d'information en septembre, candidatures d'octobre à novembre, rentrée en septembre de l'année suivante",
      exigences: ["lettres_recommandation"],
      ageMax: 35,
      ageMaxNote: "35 ans ou moins l'année du début du programme — pour l'année 2027-2028, les candidats doivent être nés le 1er janvier 1992 ou après (source : page d'éligibilité d'Edinburgh Global, vérifiée le 5 septembre 2026)."
    },
    motif: "Limite d'âge relevée sur la page officielle d'éligibilité : elle n'existait pas en base, alors que le moteur de recommandation sait s'en servir (js/age-limits.js). Exige aussi l'équivalent d'un UK Second Class Upper."
  },

  // ---------- 5. Shanghai Government Scholarship — CONTRADICTION levée ----------
  {
    collection: "programs",
    id: "shanghai-maritime-university-shanghai__shanghai-government-scholarship",
    attendu: { deadline: "1er décembre 2025 – 30 avril 2026 (cycle 2026)", status: "Ouverte" },
    champs: {
      status: "Fermée — cycle 2026 achevé",
      deadline: "Cycle 2026 CLOS : le dépôt courait du 1er décembre 2025 au 30 avril 2026 à Shanghai Maritime University. Aucun calendrier 2027 n'est publié au 5 septembre 2026 — la page de l'université affiche encore le cycle 2026. La Commission de l'éducation de Shanghai indique une période de candidature généralement de février à avril, à déposer AUPRÈS DE CHAQUE UNIVERSITÉ shanghaienne et non auprès d'un organisme central."
    },
    motif: "Lue sur en.shmtu.edu.cn et sur edu.sh.gov.cn le 2026-09-05. La contradiction du radar est confirmée : la bourse était annoncée ouverte avec une échéance dépassée de 278 jours."
  },

  {
    collection: "scholarships",
    id: "shanghai-government-scholarship",
    attendu: { status: "Ouverte" },
    champs: {
      status: "Fermée — cycle 2026 clos, calendrier 2027 non publié",
      verifieLe: LE_JOUR,
      sourceEcheance: "https://edu.sh.gov.cn/study_en_scholarships/20240904/5d8add31c7ce44a4b1e0d5bdfafe1495.html",
      periodeOuverture: "décembre à avril à Shanghai Maritime University ; « generally from February to April » pour les autres universités shanghaiennes",
      echeanceVariable: "etablissement"
    },
    motif: "Contradiction levée. La date limite n'est pas une propriété de la bourse : chaque université shanghaienne fixe la sienne, d'où echeanceVariable."
  },

  // ---------- 6. Eiffel — CONTRADICTION levée, 44 fiches sans date remplies ----------
  ...EIFFEL_SANS_DATE.map((id) => ({
    collection: "programs",
    id,
    champs: { deadline: TEXTE_EIFFEL },
    motif: "Ces 44 programmes n'avaient AUCUNE échéance : leurs fiches affichaient « Date limite : à confirmer » sans rien dire de plus. Le texte partagé dit la seule chose vraie et utile — la date est fixée par l'établissement, elle tombe en octobre-novembre, et la date de Campus France ne doit pas servir de repère (avertissement explicite de Sorbonne Université)."
  })),

  {
    collection: "programs",
    id: "sorbonne-universite-paris__eiffel-excellence-scholarship",
    attendu: { deadline: "24 novembre 2025 (Doctorat) / 28 novembre 2025 (Master) pour le cycle 2026-2027 — vérifier le calendrier 2027-2028 sur sorbonne-universite.fr", status: "Ouverte" },
    champs: {
      status: "Fermée — campagne 2026-2027 achevée",
      deadline: "Campagne 2026-2027 CLOSE : Sorbonne Université demandait les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master), et précise de ne PAS tenir compte de la date affichée par Campus France. Le calendrier 2027-2028 n'est pas publié au 5 septembre 2026."
    },
    motif: "Vérifié sur sorbonne-universite.fr le 2026-09-05 : les dates étaient justes, l'avertissement sur Campus France manquait."
  },

  {
    collection: "programs",
    id: "sciences-po-paris__eiffel-excellence-scholarship",
    attendu: { deadline: "Fin octobre / novembre selon le cycle (calendrier 2026-2027 clos le 29/10/2025) — vérifier le calendrier à venir sur sciencespo.fr", status: "Ouverte" },
    champs: {
      status: "Fermée — campagne 2026-2027 achevée",
      deadline: "Campagne 2026-2027 CLOSE (dépôt clos le 29 octobre 2025). Le calendrier 2027-2028 n'est pas publié au 5 septembre 2026. Comme partout pour l'Eiffel, la date est fixée par l'établissement et non par Campus France."
    },
    motif: "Formulation alignée sur celle des 45 autres programmes Eiffel : même bourse, même règle, un seul discours."
  },

  {
    collection: "scholarships",
    id: "eiffel-excellence-scholarship",
    attendu: { status: "Ouverte" },
    champs: {
      status: "Fermée — campagne 2026-2027 close, calendrier 2027-2028 non publié",
      verifieLe: LE_JOUR,
      sourceEcheance: "https://www.sorbonne-universite.fr/en/news/france-excellence-eiffel-scholarship-programme-2026/2027",
      periodeOuverture: "appel annuel : dépôt auprès de l'établissement français en octobre-novembre, environ un an avant la rentrée",
      echeanceVariable: "etablissement",
      exigences: ["candidature_via_etablissement"]
    },
    motif: "Contradiction levée. campusfrance.org ne publie aucune date : la source citée est celle d'un établissement, qui est l'autorité réelle pour cette bourse."
  },

  // ---------- 7. DAAD — CONTRADICTION levée, sans inventer de date ----------
  ...DAAD.map((id) => ({
    collection: "programs",
    id,
    attendu: { deadline: "31 août 2026 (campagne 2027)" },
    champs: { deadline: TEXTE_DAAD },
    motif: "La date du 31 août 2026 n'a pu être confirmée : la base de bourses du DAAD, seule autorité, refuse la consultation automatisée. Plutôt que de la garder ou d'en inventer une autre, la fiche dit ce qui est vrai et vérifiable — la date dépend du pays de résidence et se lit dans la base du DAAD."
  })),

  {
    collection: "scholarships",
    id: "daad-study-scholarships",
    attendu: { status: "Ouverte" },
    champs: {
      status: "Ouverte — date limite propre à chaque pays de résidence",
      sourceEcheance: "https://www2.daad.de/deutschland/stipendium/datenbank/en/21148-scholarship-database/?detail=50026200",
      periodeOuverture: "appel annuel : dépôt à l'automne (octobre-novembre) pour la rentrée suivante ; la date exacte dépend du pays",
      echeanceVariable: "pays"
    },
    motif: "PAS de verifieLe : la base de bourses du DAAD n'a pas pu être lue le 2026-09-05 (robots.txt). Écrire une date de vérification ici ferait croire le contraire. Le champ reste absent jusqu'à une lecture réelle."
  },

  // ---------- 8. SISGP — cohérence interne seulement ----------
  {
    collection: "scholarships",
    id: "swedish-institute-scholarships-global-professionals",
    attendu: { status: "Ouverte" },
    champs: {
      status: "Fermée — cycle 2026-2027 clos, calendrier 2027-2028 non confirmé"
    },
    motif: "PAS de verifieLe ni de sourceEcheance : si.se répond 403 et les pages de KTH et Gothenburg 500 ou 404. Ce patch ne fait que mettre le statut d'accord avec la prose que la base porte DÉJÀ (« cycle 2026-2027 clos ») — c'est une correction de cohérence interne, pas une vérification externe. À reprendre dès que la source sera accessible."
  },

  ...[
    "kth-royal-institute-of-technology-stockholm__swedish-institute-scholarships-global-professionals",
    "university-of-gothenburg-goteborg__swedish-institute-scholarships-global-professionals"
  ].map((id) => ({
    collection: "programs",
    id,
    attendu: { status: "Ouverte" },
    champs: { status: "Fermée — cycle 2026-2027 achevé" },
    motif: "Même correction de cohérence interne que sur la bourse : les programmes annonçaient « Ouverte » alors que leur propre texte d'échéance dit le cycle 2026-2027 clos. L'échéance elle-même n'est PAS touchée — elle n'a pas pu être vérifiée."
  })),

  // ---------- 9. AUI — précisions, date laissée en l'état ----------
  {
    collection: "programs",
    id: "al-akhawayn-university-ifrane__bourses-master-aui",
    attendu: { deadline: "31 octobre 2026 (rentrée de printemps — prochaine échéance)" },
    champs: {
      deadline: "31 octobre 2026 annoncé pour la rentrée de printemps (31 mai pour la rentrée d'automne) — dates NON confirmées sur aui.ma au 5 septembre 2026, la page renvoie au Graduate Admissions Office (communication@aui.ma). À confirmer avant toute démarche."
    },
    motif: "La page officielle des bourses de master d'AUI ne publie aucune date : elle renvoie à un « set deadline » sans le donner. On garde la date connue en la marquant comme non confirmée plutôt que de la présenter comme sûre."
  },

  {
    collection: "scholarships",
    id: "bourses-master-aui",
    champs: {
      verifieLe: LE_JOUR,
      sourceEcheance: "https://aui.ma/admission-aid/graduates/scholarships",
      periodeOuverture: "deux échéances par an : 31 mai pour la rentrée d'automne, 31 octobre pour la rentrée de printemps (à reconfirmer chaque année auprès du Graduate Admissions Office)",
      exigences: ["admission_prealable"],
      generalCriteria: "Les bourses de master d'AUI sont réservées aux candidats MAROCAINS ; seules quelques bourses sont ouvertes aux candidats internationaux admis à la School of Humanities and Social Sciences — d'où les 3 filières concernées : MAISD (Relations internationales / Diplomatie), NAMES (Études nord-africaines et moyen-orientales), MAIS (Études islamiques). Exigences : dossier post-baccalauréat avec mention au système français ou CGPA d'au moins 3,50/4,00, et « superior rating » à l'entretien d'admission et de bourse. Avance non remboursable de 10 000 MAD exigée à l'acceptation, et 10 h/semaine de travail sur le campus."
    },
    motif: "Vérifiée sur aui.ma le 2026-09-05. La restriction aux candidats marocains, avec l'exception SHSS, n'était pas dite : le catalogue listait les 3 filières sans expliquer POURQUOI il n'y en a que trois. La moyenne exigée (CGPA 3,50) et l'entretien manquaient aussi."
  },

  // ---------- 10. Stipendium Hungaricum — la plus exposée du catalogue ----------
  ...STIPENDIUM.map((id) => ({
    collection: "programs",
    id,
    attendu: { status: "Ouverte" },
    champs: { status: "Fermée — campagne 2026-2027 achevée", deadline: TEXTE_STIPENDIUM },
    motif: "Les 33 programmes portaient status « Ouverte » quand la bourse porte « Fermée » : la carte du catalogue et la fiche de l'opportunité affichaient deux états contraires (constaté en production le 2026-09-05). Le code ne se laisse plus tromper, mais la donnée doit dire la vérité par elle-même."
  })),

  {
    collection: "scholarships",
    id: "stipendium-hungaricum",
    champs: {
      verifieLe: LE_JOUR,
      sourceEcheance: "https://stipendiumhungaricum.hu/apply/",
      periodeOuverture: "appel annuel : ouverture en novembre-décembre, clôture à la mi-janvier (15 janvier 2026 à 14h00 CET pour 2026-2027)",
      exigences: ["nomination_autorite_nationale"]
    },
    motif: "Vérifiée sur stipendiumhungaricum.hu le 2026-09-05. Aucune admission préalable n'est exigée au dépôt — les épreuves d'entrée ont lieu en mars-mai — mais la nomination par l'autorité du pays d'origine est obligatoire, avec un dossier à déposer en parallèle auprès d'elle. C'est la bourse que 360 profils sur 360 voient : elle devait être la première documentée."
  }

];
