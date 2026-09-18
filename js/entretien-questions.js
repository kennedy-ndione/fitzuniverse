/**
 * ============================================================
 * FitzUniverse — DEUX ENTRETIENS, DEUX PRÉPARATIONS
 * (lot R12, 2026-09-18)
 * ============================================================
 *
 * CE QUI S'EST PASSÉ : interview-prep.html était écrite d'un bout à
 * l'autre pour un entretien de BOURSE — « Qu'est-ce qui vous a motivé à
 * candidater à cette bourse en particulier ? », « question très
 * fréquente pour les bourses gouvernementales », « Que ferez-vous si
 * vous n'obtenez pas cette bourse ? », « Avez-vous des questions pour
 * nous ? ». Or la route de préinscription y envoie l'étudiant depuis
 * son étape 11, « L'entretien » : un candidat Dossier France s'y
 * préparait donc à un jury qu'il ne rencontrera jamais, et passait à
 * côté de ce que Campus France évalue réellement.
 *
 * CE QUE DISENT LES SOURCES OFFICIELLES (lues le 2026-09-18) :
 *
 *   - l'entretien « permet d'évaluer le projet d'études, la motivation
 *     du candidat ainsi que sa capacité à s'exprimer et à exposer ses
 *     idées de manière claire, cohérente et structurée » ; la page
 *     conseille de « préparer son parcours académique et son projet
 *     d'études », d'« adopter une attitude professionnelle », de
 *     « structurer ses réponses avec logique et cohérence » et de
 *     « soigner son habillement » — chemise ou haut sobre, pantalon ou
 *     jupe simple, chaussures propres, et pas de tenue de sport
 *     (espace Campus France du Sénégal) ;
 *   - l'évaluation pédagogique est effectuée par Campus France et porte
 *     sur « le niveau du candidat et de ses aptitudes à poursuivre des
 *     études en France ». Et surtout : « le compte-rendu de votre
 *     entretien sera visible par ces établissements, qui en tiendront
 *     compte lors de l'évaluation de vos candidatures », et il est
 *     « visible par le Consulat général, qui en tient compte dans
 *     l'instruction de la demande de visa ». L'entretien « constitue un
 *     élément obligatoire du dossier de demande de visa d'études »
 *     (FAQ Campus France).
 *
 * Ce dernier point ne figurait NULLE PART sur la page, et c'est le plus
 * important : l'entretien n'est pas une conversation, c'est une pièce
 * écrite que deux administrations liront.
 *
 * LA LIGNE QU'ON NE FRANCHIT PAS : les AXES de l'entretien sont
 * sourcés ; les QUESTIONS, elles, sont du matériel d'entraînement écrit
 * à partir de ces axes — aucune source officielle ne publie la liste
 * des questions posées, et les agrégateurs qui prétendent le contraire
 * sont exactement ce que le lot R1 a déjà eu à corriger une fois. Le
 * libellé de la section le dit à l'étudiant en clair : « ce sur quoi
 * l'entretien porte, et des questions pour vous y entraîner ».
 *
 * Module PUR : aucune dépendance, aucun accès réseau.
 * ============================================================
 */

export const SOURCES_ENTRETIEN = {
  residence: "https://www.senegal.campusfrance.org/l-entretien-pedagogique-est-une-etape-cle-de-la-procedure-etudes-en-france",
  faq: "https://www.tunisie.campusfrance.org/faq/a-quoi-sert-l-entretien-campus-france",
  verifieLe: "2026-09-18"
};

/**
 * CE QU'IL FAUT SAVOIR AVANT D'ENTRER, en préinscription. Trois faits,
 * pas une ambiance : qui évalue, ce qui est évalué, et qui lira le
 * compte-rendu.
 */
export const CADRE_PREINSCRIPTION = {
  titre: "Ce n'est pas une conversation : c'est une pièce de votre dossier",
  texte: "Un conseiller de Campus France évalue votre projet d'études, votre motivation et votre capacité à exposer vos idées de manière claire et structurée. Le compte-rendu de l'entretien est ensuite lu par les établissements que vous avez demandés — qui en tiennent compte pour évaluer vos vœux — et par le consulat, qui en tient compte pour votre visa. C'est un élément obligatoire du dossier de demande de visa d'études.",
  source: SOURCES_ENTRETIEN.faq,
  sourceResidence: SOURCES_ENTRETIEN.residence,
  verifieLe: SOURCES_ENTRETIEN.verifieLe
};

/**
 * Les thèmes de l'entretien de BOURSE — RECOPIÉS AU MOT depuis le HTML
 * d'interview-prep.html avant qu'il devienne piloté par les données,
 * titres et icônes comprises. Ce lot ne touche pas à l'espace bourse :
 * la moindre reformulation ici serait un changement non demandé, glissé
 * dans un lot qui n'en parle pas. (J'avais d'abord reconstitué quatre
 * de ces cinq titres de mémoire — ils étaient faux, et c'est la
 * comparaison avec le fichier d'origine qui l'a montré. Le test les
 * épingle désormais un par un.)
 */
export const THEMES_BOURSE = [
  {
    id: "motivation",
    icone: "user",
    titre: "Motivation et parcours",
    questions: [
      "Parlez-moi de vous en deux minutes.",
      "Pourquoi avez-vous choisi ce domaine d'études ?",
      "Qu'est-ce qui vous a motivé à candidater à cette bourse en particulier, plutôt qu'à une autre ?",
      "Quel est votre plus grand échec académique, et qu'en avez-vous retenu ?"
    ]
  },
  {
    id: "projet",
    icone: "target",
    titre: "Projet académique et professionnel",
    questions: [
      "Quel est votre projet d'études ou de recherche ?",
      "Où vous voyez-vous dans cinq ans ?",
      "En quoi cette formation s'inscrit-elle dans votre projet professionnel ?",
      "Comptez-vous rentrer dans votre pays d'origine après vos études ? (question très fréquente pour les bourses gouvernementales — préparez une réponse honnête et argumentée)"
    ]
  },
  {
    id: "etablissement",
    icone: "landmark",
    titre: "Pourquoi cette université et ce pays",
    questions: [
      "Pourquoi avoir choisi cette université en particulier ?",
      "Que savez-vous du programme ou du département auquel vous candidatez ?",
      "Pourquoi ce pays plutôt qu'un autre ?"
    ]
  },
  {
    id: "competences",
    icone: "award",
    titre: "Compétences et réalisations",
    questions: [
      "Présentez un projet ou une réalisation dont vous êtes particulièrement fier(ère).",
      "Comment expliquez-vous une baisse de niveau visible sur votre relevé de notes, le cas échéant ?",
      "Quelle est votre plus grande qualité, et votre plus grand axe d'amélioration ?"
    ]
  },
  {
    id: "fin",
    icone: "alert-triangle",
    titre: "Questions difficiles",
    questions: [
      "Comment gérez-vous le stress ou des délais serrés ?",
      "Que ferez-vous si vous n'obtenez pas cette bourse ?",
      "Avez-vous des questions pour nous ? (préparez 2 à 3 questions précises — c'est presque toujours la dernière question posée)"
    ]
  }
];

/**
 * Les thèmes de l'entretien PÉDAGOGIQUE (préinscription). Chaque thème
 * correspond à un axe que les pages officielles nomment ; les questions
 * sont du matériel d'entraînement, pas une liste de ce qui sera posé.
 *
 * Aucune mention de bourse, de jury, de financement par un tiers :
 * l'étudiant finance lui-même son année, et c'est cette capacité que le
 * consulat lira dans le compte-rendu.
 */
export const THEMES_PREINSCRIPTION = [
  {
    id: "parcours",
    icone: "user",
    titre: "Votre parcours, dans l'ordre",
    questions: [
      "Racontez votre parcours scolaire depuis le baccalauréat, année par année.",
      "Y a-t-il une année interrompue, redoublée ou sans inscription ? Expliquez-la simplement, sans la cacher : elle est visible sur vos relevés.",
      "Qu'avez-vous appris dans votre dernière formation que vous réutiliserez en France ?"
    ]
  },
  {
    id: "projet",
    icone: "target",
    titre: "Votre projet d'études",
    questions: [
      "Quelle formation demandez-vous, et dans quel établissement ?",
      "Pourquoi cette formation précisément, et pas une voisine ?",
      "Que contient son programme ? Citez deux ou trois enseignements.",
      "En quoi cette formation prolonge-t-elle ce que vous avez déjà étudié ?"
    ]
  },
  {
    id: "coherence",
    icone: "git-merge",
    titre: "La cohérence de vos vœux",
    questions: [
      "Vous avez demandé plusieurs formations : quel fil les relie ?",
      "Si vous n'êtes admis que dans votre dernier choix, l'acceptez-vous ? Pourquoi ?",
      "Pourquoi la France, et pas une université de votre pays ou d'ailleurs ?"
    ]
  },
  {
    id: "moyens",
    icone: "wallet",
    titre: "Comment vous financez et vous organisez",
    questions: [
      "Qui finance votre année, et à quelle hauteur ? (le compte-rendu est lu par le consulat : soyez précis et vérifiable)",
      "Où comptez-vous vous loger à votre arrivée ?",
      "Et le français : quel est votre niveau, et comment l'avez-vous mesuré ?"
    ]
  },
  {
    id: "apres",
    icone: "compass",
    titre: "Après le diplôme",
    questions: [
      "Que ferez-vous une fois ce diplôme obtenu ?",
      "Quel métier visez-vous, et où ?",
      "Qu'apportera ce diplôme à votre pays d'origine ?"
    ]
  }
];

/** La checklist de l'entretien de bourse — inchangée. */
export const CHECKLIST_BOURSE = [
  { id: "reread_letter", label: "Relire ma lettre de motivation — on m'interrogera probablement dessus." },
  { id: "concrete_examples", label: "Préparer 2-3 exemples concrets illustrant mes compétences et mon parcours." },
  { id: "why_university", label: "Rechercher le programme, le département et pourquoi cette université en particulier." },
  { id: "questions_to_ask", label: "Préparer 2-3 questions précises à poser en fin d'entretien." },
  { id: "tech_check", label: "Tester ma connexion, mon micro et ma caméra si l'entretien a lieu en visioconférence." },
  { id: "outfit", label: "Préparer une tenue adaptée au format de l'entretien." },
  { id: "practice_aloud", label: "M'entraîner à voix haute sur au moins 5 questions (seul(e) ou avec Fitz)." }
];

/**
 * La checklist de l'entretien pédagogique. Pas de test de micro : cet
 * entretien se passe à l'antenne de l'espace Campus France déterminée
 * par l'adresse du dossier (consigne officielle de l'étape, déjà dans
 * js/procedures/france.js). Les items de tenue et de structure
 * reprennent les conseils de la page officielle, mot pour mot.
 */
export const CHECKLIST_PREINSCRIPTION = [
  { id: "ivp_pre_convocation", label: "Noter la date, l'heure et l'antenne de mon rendez-vous, et prévoir le trajet large." },
  { id: "ivp_pre_parcours", label: "Préparer mon parcours académique année par année, y compris ce qui s'est mal passé." },
  { id: "ivp_pre_projet", label: "Préparer mon projet d'études : la formation, son programme, et pourquoi elle." },
  { id: "ivp_pre_voeux", label: "Savoir citer mes vœux et le fil qui les relie." },
  { id: "ivp_pre_financement", label: "Savoir dire qui finance mon année et à quelle hauteur — le consulat lira le compte-rendu." },
  { id: "ivp_pre_structure", label: "M'entraîner à structurer mes réponses avec logique et cohérence, à voix haute." },
  { id: "ivp_pre_tenue", label: "Préparer une tenue sobre : chemise ou haut sobre, pantalon ou jupe simple, chaussures propres — pas de tenue de sport." }
];

/** Le parcours décide. Toute valeur autre que « preinscription » = bourse. */
export function themesPour(parcours) {
  return parcours === "preinscription" ? THEMES_PREINSCRIPTION : THEMES_BOURSE;
}

export function checklistPour(parcours) {
  return parcours === "preinscription" ? CHECKLIST_PREINSCRIPTION : CHECKLIST_BOURSE;
}

/**
 * Les défauts qu'une prochaine passe pourrait introduire sans le voir.
 * Rendu comme une liste de phrases, jamais une exception : un test les
 * lit, et une page pourrait les afficher en développement.
 */
export function defautsDesThemes() {
  const defauts = [];
  const motsDeBourse = /bourse|boursier|jury|bailleur/i;
  for (const t of THEMES_PREINSCRIPTION) {
    if (motsDeBourse.test(t.titre)) defauts.push(`thème « ${t.id} » : le titre parle de bourse`);
    for (const q of t.questions) {
      if (motsDeBourse.test(q)) defauts.push(`thème « ${t.id} » : une question parle de bourse — « ${q.slice(0, 60)}… »`);
    }
  }
  for (const c of CHECKLIST_PREINSCRIPTION) {
    if (motsDeBourse.test(c.label)) defauts.push(`checklist « ${c.id} » : parle de bourse`);
    if (/micro|caméra|visioconférence/i.test(c.label)) defauts.push(`checklist « ${c.id} » : l'entretien pédagogique n'est pas en visioconférence`);
  }
  const ids = [...THEMES_PREINSCRIPTION, ...THEMES_BOURSE].map((t) => t.id);
  for (const liste of [THEMES_PREINSCRIPTION, THEMES_BOURSE]) {
    if (new Set(liste.map((t) => t.id)).size !== liste.length) defauts.push("deux thèmes du même jeu portent le même identifiant");
  }
  if (!ids.length) defauts.push("aucun thème");
  return defauts;
}
