/**
 * ============================================================
 * js/route-preinscription.js — LA ROUTE d'une préinscription (lot R1)
 * ============================================================
 *
 * PURE : aucun DOM, aucun Firestore. Testée par
 * test/route-preinscription.test.mjs. Rendue par espace-preinscription.js.
 *
 * LE PRINCIPE (décision de Charles, 2026-09-17)
 * ---------------------------------------------
 * « Une route, une étape à la fois, un geste par étape. » L'espace
 * préinscription n'est plus une carte du voyage en six phases avec une
 * boîte à outils à côté : c'est une suite de QUINZE étapes, dans l'ordre
 * où elles se font, et l'étudiant n'en lit qu'une — celle où il en est.
 * Chaque étape dit : quoi faire (en français simple), où (le lien
 * officiel), avant quand (si la date est connue, avec sa source), ce que
 * Fitz fait pour lui à cet endroit (l'outil est DANS l'étape), et un
 * bouton « C'est fait ».
 *
 * D'OÙ VIENNENT LES ÉTAPES
 * ------------------------
 * Onze des quinze sont les étapes de la procédure Études en France
 * (js/procedures/france.js), composées avec la couche du pays de
 * résidence (js/procedures/residences/*) : titres officiels, consignes,
 * pièces, montants, dates et sources viennent de là — CE MODULE N'INVENTE
 * AUCUN FAIT DE PAYS. Les quatre autres (situation, ressources, vœux,
 * pièces) préparent le dossier avant le portail.
 *
 * LES ÉTAPES SONT CELLES DU DOSSIER, PAS DU VŒU
 * ---------------------------------------------
 * Sur Études en France il y a UN compte, UN dossier, et jusqu'à sept
 * vœux dedans. L'ancien espace attachait les onze étapes à chaque vœu :
 * sept vœux, c'était sept fois « Créer mon compte » — 77 cases pour une
 * procédure qui en a 11. L'état des étapes vit maintenant dans
 * users/{uid}.dossierFrance ; les vœux restent la sous-collection
 * applications (créneaux pre-1 à pre-7), et seuls deux gestes sont PAR
 * VŒU : la lettre de motivation, et la réponse de l'établissement.
 *
 * FRANÇAIS SIMPLE, SANS PERDRE UNE CONDITION
 * ------------------------------------------
 * Les exemples proposés sous les champs (`suggestions: "domaine"`) sont
 * des CLÉS de js/champs-guides.js : les libellés n'ont rien à faire dans
 * un module pur, et le profil doit proposer les mêmes.
 *
 * Chaque étape porte un `enClair` de deux ou trois phrases courtes,
 * écrit ici, SANS chiffre, SANS date, SANS nom de banque ou d'antenne —
 * un test l'interdit. Le texte officiel complet (la consigne composée)
 * reste servi sous « Le texte officiel » : simplifier n'a jamais le
 * droit de faire disparaître une règle.
 * ============================================================
 */

import { VISA_ETAPES } from "./journey-map.js";
import { jalonDeCampagne } from "./pays-preinscription.js";
import { LIBELLES_PREUVE, ICONES_TYPE, texteConsigne } from "./procedures/vocabulaire.js";

export const PORTAIL_ETUDES_EN_FRANCE = "https://pastel.diplomatie.gouv.fr/etudesenfrance/";

/** Le plafond global de la plateforme, et les sous-plafonds par type. */
export const PLAFOND_VOEUX = 7;
export const SOUS_PLAFONDS = {
  "Licence 1": 3,
  "Architecture": 2
};

/** Les niveaux qu'un vœu peut viser — le vocabulaire du portail. */
export const NIVEAUX_VOEU = ["Licence 1", "Licence 2", "Licence 3", "BUT", "Master 1", "Master 2", "Architecture", "Doctorat"];

/** Les statuts de réponse qu'un vœu peut porter, et leur mot. */
export const REPONSES_VOEU = {
  en_attente: "Pas encore de réponse",
  admise: "Admis",
  liste_attente: "Liste d'attente",
  refusee: "Refusé"
};

// ------------------------------------------------------------
// ÉTAPE 1 — la situation : huit questions, pas cinquante-six champs.
// Elles s'écrivent dans les MÊMES clés du profil (users/{uid}.profile)
// que profile.html : aucun nouveau modèle, et l'espace bourse continue
// de lire ce qu'il lisait.
// ------------------------------------------------------------
export const QUESTIONS_SITUATION = [
  { cle: "country", libelle: "Dans quel pays vivez-vous aujourd'hui ?", type: "pays", aide: "C'est ce pays qui décide des frais, des dates et du lieu de votre entretien." },
  { cle: "nationality", libelle: "Quelle est votre nationalité ?", type: "pays" },
  { cle: "desiredDegree", libelle: "Quel niveau visez-vous en France ?", type: "choix", options: ["Licence", "Master", "Doctorat"] },
  { cle: "desiredField", libelle: "Dans quel domaine ?", type: "liste", liste: "domaine", exemple: "Commencez à écrire : Informatique, Droit, Médecine…" },
  { cle: "lastDegree", libelle: "Votre dernier diplôme (obtenu ou en cours) ?", type: "texte", exemple: "Baccalauréat S2, Licence 3 Économie…", suggestions: "diplome" },
  { cle: "currentInstitution", libelle: "Dans quel établissement ?", type: "texte", exemple: "Lycée, université ou école" },
  { cle: "situationFrancais", libelle: "Et le français ?", type: "choix", options: ["etudes_en_francais", "test_passe", "test_prevu", "aucun"], libelles: { etudes_en_francais: "J'ai fait mes études en français", test_passe: "J'ai passé un test (TCF, DELF, DALF)", test_prevu: "Je vais passer un test", aucun: "Pas encore décidé" } },
  { cle: "budget", libelle: "De combien disposez-vous par mois pour vivre en France ?", type: "texte", exemple: "Ex. 500 000 F CFA, ou 800 €", suggestions: "budget", aide: "Vous, votre famille ou un garant. Fitz s'en sert à l'étape suivante pour vérifier que le projet tient." }
];

/** Ce qu'il manque à la situation, en libellés lisibles. */
export function situationComplete(profile) {
  const p = profile || {};
  const manquants = QUESTIONS_SITUATION
    .filter((q) => !String(p[q.cle] || "").trim())
    .map((q) => q.libelle);
  return { pret: manquants.length === 0, manquants };
}

// ------------------------------------------------------------
// LES QUINZE ÉTAPES — l'ordre est l'ordre de la route.
// `procedure` = l'id de l'étape de js/procedures/france.js dont l'étape
// prend titre officiel, consigne, pièces, preuve, échéance et source.
// ------------------------------------------------------------
export const ETAPES_ROUTE = [
  {
    id: "situation", kind: "situation", icone: "user-round",
    titre: "Votre situation",
    enClair: "Huit réponses, et Fitz sait d'où vous partez et où vous allez. Tout le reste de la route se règle sur elles."
  },
  {
    id: "ressources", kind: "diagnostic", icone: "calculator",
    titre: "Vos ressources",
    enClair: "Avant de commencer un dossier, on vérifie que le projet tient financièrement. Fitz compare ce dont vous disposez à ce qu'une année coûte, et vous dit ce qui manque, s'il manque quelque chose.",
    outils: [{ feature: "diagnostic_france", href: "diagnostic-france.html", libelle: "Faire mon diagnostic avec Fitz", icone: "calculator", principal: true }]
  },
  {
    id: "voeux", kind: "voeux", icone: "list-checks",
    titre: "Choisir vos vœux",
    enClair: "Un vœu, c'est une formation dans un établissement. Vous pouvez en poser jusqu'à sept. Dites simplement l'établissement, la formation et le niveau : Fitz s'occupe du reste."
  },
  {
    id: "pieces", kind: "pieces", icone: "paperclip",
    titre: "Rassembler vos pièces",
    enClair: "Voici la liste exacte de ce que le portail vous demandera, avec le poids maximum de chaque fichier. Cochez ce que vous avez déjà, au bon format. Si une pièce est trop lourde ou dans une autre langue, Fitz vous aide juste en dessous.",
    outils: [
      { feature: "compress", href: "compress.html", libelle: "Réduire une pièce au bon poids", icone: "file-archive" },
      { feature: "ai_translate", href: "ai-translate.html", libelle: "Traduire un diplôme", icone: "languages" }
    ]
  },
  {
    id: "ef_compte", kind: "procedure", procedure: "ef_compte",
    titre: "Créer votre compte Études en France",
    enClair: "Tout se passe sur le portail officiel. Créez-y votre compte avec une adresse e-mail que vous lisez vraiment : c'est là que les réponses arriveront. Si vous avez déjà un compte, reconnectez-vous, n'en créez pas un second."
  },
  {
    id: "ef_saisie", kind: "procedure", procedure: "ef_saisie",
    titre: "Compléter vos informations",
    enClair: "Sur le portail, remplissez votre identité et vos coordonnées exactement comme sur vos papiers officiels. Une faute ici se retrouve sur tout le dossier."
  },
  {
    id: "ef_pieces", kind: "procedure", procedure: "ef_pieces",
    titre: "Joindre vos diplômes",
    enClair: "Décrivez chaque année d'études et joignez les pièces que vous avez rassemblées. Un document dans une autre langue que le français doit être traduit par un traducteur assermenté, et l'original joint avec.",
    outils: [{ feature: "ai_translate", href: "ai-translate.html", libelle: "Traduire une pièce", icone: "languages" }]
  },
  {
    id: "ef_voeux", kind: "motivations", procedure: "ef_voeux",
    titre: "Écrire vos motivations",
    enClair: "Chaque vœu demande quelques lignes : pourquoi cette formation, pourquoi cet établissement, et ce que vous en ferez. Fitz écrit un premier jet avec vous, vœu par vœu. Puis vous le recopiez sur le portail."
  },
  {
    id: "ef_soumission", kind: "procedure", procedure: "ef_soumission",
    titre: "Vérifier, puis soumettre",
    enClair: "Après la soumission, on ne modifie presque plus rien. Faites vérifier votre dossier par Fitz avant, puis soumettez sur le portail. Notez ici le numéro de dossier qu'il vous donne : c'est votre preuve.",
    outils: [{ feature: "ai_check", href: "ai-check.html", libelle: "Faire vérifier mon dossier par Fitz", icone: "shield-check", principal: true }]
  },
  {
    id: "ef_paiement", kind: "procedure", procedure: "ef_paiement",
    titre: "Payer les frais de dossier",
    enClair: "Ces frais ne sont pas remboursés : on paie une fois le dossier vérifié et soumis, jamais avant. Le montant et le lieu de paiement dépendent de votre pays ; ils sont écrits ci-dessous quand nous les avons vérifiés. Gardez le reçu."
  },
  {
    id: "ef_entretien", kind: "procedure", procedure: "ef_entretien",
    titre: "L'entretien",
    enClair: "Un conseiller de l'espace Campus France vous reçoit pour parler de votre projet. Ce n'est pas un examen : on vérifie que votre projet est cohérent et que c'est bien vous qui le portez. Fitz vous entraîne avant.",
    outils: [{ feature: "interview_prep", href: "interview-prep.html", libelle: "M'entraîner à l'entretien avec Fitz", icone: "messages-square", principal: true }]
  },
  {
    id: "ef_reponse", kind: "reponses", procedure: "ef_reponse",
    titre: "Les réponses",
    enClair: "Les établissements répondent sur le portail, chacun à son rythme, parfois sans e-mail. Allez voir vous-même régulièrement, et notez ici chaque réponse, même un refus : c'est ce qui ouvre la suite."
  },
  {
    id: "ef_confirmation", kind: "procedure", procedure: "ef_confirmation",
    titre: "Confirmer votre choix",
    enClair: "Quand vous avez au moins une admission, vous choisissez définitivement sur le portail, puis vous téléchargez le document qui prouve votre acceptation. C'est lui que le consulat vous demandera.",
    outils: [{ feature: "ai_email", href: "ai-email.html", libelle: "Écrire à l'établissement", icone: "mail" }]
  },
  {
    id: "ef_complement", kind: "procedure", procedure: "ef_complement",
    titre: "Compléments, si on vous en demande",
    enClair: "Il arrive qu'on vous demande une pièce de plus ou de présenter des originaux. Répondez vite, et gardez une trace de chaque échange. Si rien ne vous est demandé, cette étape se coche simplement."
  },
  {
    id: "ef_visa", kind: "visa", procedure: "ef_visa",
    titre: "Le visa, et le départ",
    enClair: "Le courriel de fin de procédure ouvre la demande de visa. Ensuite viennent les démarches du départ : preuve de ressources, assurance, logement, billet. Cochez-les une à une, Fitz répond à vos questions à chacune."
  }
];

export const TOTAL_ETAPES = ETAPES_ROUTE.length;

// ------------------------------------------------------------
// Outillage
// ------------------------------------------------------------
export function slugPiece(nom) {
  return String(nom || "")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}

/** Jours entiers entre aujourd'hui et une date ISO : 0 = c'est aujourd'hui. */
function joursEntre(iso, aujourdhui) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ""));
  if (!m) return null;
  const cible = Date.UTC(+m[1], +m[2] - 1, +m[3]);
  const debut = Date.UTC(aujourdhui.getUTCFullYear(), aujourdhui.getUTCMonth(), aujourdhui.getUTCDate());
  return Math.round((cible - debut) / 86400000);
}

function etapeDeProcedure(procedure, id) {
  if (!procedure || !Array.isArray(procedure.etapes)) return null;
  return procedure.etapes.find((e) => e.id === id) || null;
}

/** Les pièces qu'un dossier demande (étapes de saisie et de pièces). */
export function piecesDuDossier(procedure) {
  const pieces = [];
  for (const id of ["ef_saisie", "ef_pieces"]) {
    const e = etapeDeProcedure(procedure, id);
    for (const p of (e && e.pieces) || []) {
      pieces.push({ slug: slugPiece(p.nom), nom: p.nom, tailleMax: p.tailleMax || "", traduction: p.traduction === true, legalisation: p.legalisation === true, etape: id });
    }
  }
  return pieces;
}

/**
 * Ce qui cloche dans une liste de vœux au regard des plafonds du portail.
 * Rend des phrases, jamais une exception : un vœu de trop se dit, il ne
 * bloque pas la lecture de la route.
 */
export function avertissementsVoeux(voeux) {
  const avert = [];
  const liste = Array.isArray(voeux) ? voeux : [];
  if (liste.length > PLAFOND_VOEUX) {
    avert.push(`Le portail accepte ${PLAFOND_VOEUX} vœux au maximum : il y en a ${liste.length}.`);
  }
  for (const [niveau, plafond] of Object.entries(SOUS_PLAFONDS)) {
    const n = liste.filter((v) => v.niveau === niveau).length;
    if (n > plafond) avert.push(`${niveau} : ${plafond} vœux au maximum sur le portail, vous en avez ${n}.`);
  }
  return avert;
}

// ------------------------------------------------------------
// LA ROUTE
// ------------------------------------------------------------
/**
 * @param {Object} p
 * @param {Object|null} p.procedure   trouverProcedure({ paysDestination:"France", paysResidence }) — composée
 * @param {Object} p.profile          users/{uid}.profile
 * @param {Object|null} p.diagnostic  users/{uid}.diagnosticFrance
 * @param {Array}  p.voeux            applications du parcours préinscription
 * @param {Object} p.dossier          users/{uid}.dossierFrance : { etapes:{id:{faite,faitLe,preuve}}, pieces:{slug:true} }
 * @param {Object} p.visaChecklist    users/{uid}.visaChecklist
 * @param {Date}   p.aujourdhui
 */
export function construireRoute({ procedure = null, profile = {}, diagnostic = null, voeux = [], dossier = {}, visaChecklist = {}, aujourdhui = new Date() } = {}) {

  const etatEtapes = (dossier && dossier.etapes && typeof dossier.etapes === "object") ? dossier.etapes : {};
  const piecesCochees = (dossier && dossier.pieces && typeof dossier.pieces === "object") ? dossier.pieces : {};
  const jalons = (procedure && procedure.faits && procedure.faits.calendrier && procedure.faits.calendrier.jalons) || undefined;
  const listeVoeux = Array.isArray(voeux) ? voeux : [];
  // Une pièce est réglée quand on l'a, OU quand elle ne nous concerne
  // pas (la carte de séjour, pour un national ; la certification B2,
  // hors bac Arabe) : la liste vient du pays, pas du profil, et c'est
  // l'étudiant qui sait.
  const pieces = piecesDuDossier(procedure).map((p) => ({ ...p, obtenue: piecesCochees[p.slug] === true, ecartee: piecesCochees[p.slug] === "non-concerne" }));
  const visa = {};
  VISA_ETAPES.forEach((id) => { visa[id] = !!(visaChecklist && visaChecklist[id] === true); });
  const visaFaites = VISA_ETAPES.filter((id) => visa[id]).length;

  const etapes = ETAPES_ROUTE.map((def, index) => {

    const officielle = def.procedure ? etapeDeProcedure(procedure, def.procedure) : null;
    const saisie = etatEtapes[def.id] && typeof etatEtapes[def.id] === "object" ? etatEtapes[def.id] : null;
    const preuveType = officielle ? (officielle.preuve || "aucune") : "aucune";
    const preuvePresente = preuveType === "aucune" || !!(saisie && typeof saisie.preuve === "string" && saisie.preuve.trim());
    const cochee = !!(saisie && saisie.faite === true);

    let faite = false;
    let empechement = "";

    switch (def.kind) {
      case "situation":
        faite = situationComplete(profile).pret;
        break;
      case "diagnostic":
        faite = !!(diagnostic && (diagnostic.etatVerdict || diagnostic.verdict));
        break;
      case "voeux":
        faite = listeVoeux.length > 0;
        break;
      case "pieces":
        faite = pieces.length > 0 && pieces.every((p) => p.obtenue || p.ecartee);
        break;
      case "motivations":
        faite = listeVoeux.length > 0 && listeVoeux.every((v) => v.motivation && v.motivation.faite === true);
        if (!listeVoeux.length) empechement = "Posez d'abord au moins un vœu (étape 3).";
        break;
      case "reponses":
        faite = listeVoeux.length > 0 && listeVoeux.every((v) => ["admise", "refusee", "liste_attente"].includes(v.status));
        if (!listeVoeux.length) empechement = "Posez d'abord au moins un vœu (étape 3).";
        break;
      case "visa":
        faite = cochee && visaFaites === VISA_ETAPES.length;
        break;
      default: // procedure
        faite = cochee && preuvePresente;
    }

    const jalon = officielle && officielle.echeance && officielle.echeance.depuis === "calendrier"
      ? jalonDeCampagne(officielle.echeance.cle, aujourdhui, jalons)
      : null;

    return {
      numero: index + 1,
      id: def.id,
      kind: def.kind,
      titre: def.titre,
      enClair: def.enClair,
      icone: def.icone || (officielle ? ICONES_TYPE[officielle.type] : "circle"),
      faite,
      cochee,
      empechement,
      outils: (def.outils || []).map((o) => ({ ...o })),
      // Ce que dit le portail, mot pour mot, avec sa source.
      officielle: officielle ? {
        titre: officielle.titre,
        consigne: texteConsigne(officielle),
        source: officielle.source || "",
        verifieLe: officielle.verifieLe || "",
        sourceResidence: officielle.sourceResidence || "",
        mention: officielle.mention || "",
        montant: officielle.montant,
        devise: officielle.devise
      } : null,
      preuve: {
        type: preuveType,
        libelle: LIBELLES_PREUVE[preuveType] || "",
        valeur: (saisie && typeof saisie.preuve === "string") ? saisie.preuve : "",
        requise: preuveType !== "aucune"
      },
      echeance: jalon ? { iso: jalon.iso, libelle: jalon.libelle, debut: jalon.debut, jours: joursEntre(jalon.iso, aujourdhui) } : null,
      faitLe: (saisie && saisie.faitLe) || null,
      pieces: def.kind === "pieces" ? pieces : [],
      voeux: ["voeux", "motivations", "reponses"].includes(def.kind) ? listeVoeux : [],
      visa: def.kind === "visa" ? { etat: visa, faites: visaFaites, total: VISA_ETAPES.length } : null
    };
  });

  // La courante : la première qui n'est pas faite. Tout ce qui suit est
  // « à venir » — visible, jamais verrouillé.
  const courante = etapes.find((e) => !e.faite) || null;
  etapes.forEach((e) => {
    e.etat = e.faite ? "faite" : (courante && e.id === courante.id) ? "courante" : "a-venir";
  });

  const faites = etapes.filter((e) => e.faite).length;

  return {
    etapes,
    courante,
    faites,
    total: etapes.length,
    pourcentage: Math.round((faites / etapes.length) * 100),
    residence: procedure ? procedure.residence : "",
    residenceDocumentee: !!(procedure && procedure.residenceDocumentee),
    portail: (procedure && procedure.portail) || { nom: "Études en France", url: PORTAIL_ETUDES_EN_FRANCE },
    avertissementsVoeux: avertissementsVoeux(listeVoeux)
  };
}

/** La phrase du haut de page. */
export function phraseDeRoute(route, prenom = "") {
  const qui = prenom ? `${prenom}, vous` : "Vous";
  if (!route.courante) return `${qui} avez accompli les ${route.total} étapes. Bon voyage, et bonne rentrée.`;
  return `${qui} êtes à l'étape ${route.courante.numero} sur ${route.total} : ${route.courante.titre}.`;
}

/**
 * Les mots que l'`enClair` n'a pas le droit de porter : un fait de pays
 * (montant, date, nom de banque, ville) n'y a sa place que servi par la
 * procédure du pays, avec sa source. Utilisé par le test.
 */
export function defautsDesEnClair(etapes = ETAPES_ROUTE) {
  const defauts = [];
  const interdits = [/\d/, /F ?CFA/i, /€/, /SUNU/i, /VFS/i, /Dakar/i, /\b(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\b/i];
  for (const e of etapes) {
    for (const motif of interdits) {
      if (motif.test(e.enClair)) defauts.push(`${e.id} : « ${e.enClair.slice(0, 60)}… » porte ${motif}`);
    }
    if (e.enClair.length > 420) defauts.push(`${e.id} : en clair trop long (${e.enClair.length})`);
  }
  return defauts;
}
