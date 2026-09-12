/**
 * ============================================================
 * functions/lib/achat.js — la grille serveur et la décision d'achat
 * ============================================================
 *
 * PURE : aucun appel Firestore, aucun secret, aucune date implicite.
 * Extrait de functions/paiement.js (grille B, 2026-09-07) pour que la
 * décision « que devient le compte après ce paiement ? » soit testable
 * sous Node (test/functions-achat.test.mjs) sans émulateur ni PayDunya.
 *
 * DEUX FORFAITS QUI COEXISTENT
 * ----------------------------
 *   `plan` / `planExpiresAt`                         : le forfait BOURSE
 *   `planPreinscription` / `planPreinscriptionExpiresAt` : le forfait
 *                                                       PRÉINSCRIPTION
 * Acheter une offre d'un parcours n'écrit JAMAIS le champ de l'autre.
 * Les droits du compte sont l'UNION des deux (js/plan-features.js).
 *
 * DURÉE « UNE CAMPAGNE »
 * ----------------------
 * Dossier France (et + Conseiller) expire le 31 juillet de la campagne
 * Études en France en cours à l'achat : août → décembre = 31 juillet de
 * l'année suivante ; janvier → juillet = 31 juillet de la même année.
 * Calculé ICI, côté serveur, jamais côté client. CLOTURE_CAMPAGNE est
 * le MIROIR de CAMPAGNE_FRANCE.cloture (js/pays-preinscription.js) —
 * une Cloud Function ne peut pas importer un module du site — et un
 * test compare les deux.
 *
 * Miroir de pricing-plans.js : les prix et le quota préinscription
 * (maxPreinscriptions = 7) y sont dupliqués volontairement, comme dans
 * firestore.rules. test/grille-b.test.mjs échoue si l'un des trois
 * diverge.
 * ============================================================
 */

/**
 * `dureeMois: null` = achat unique sans échéance — les TROIS formules
 *                     bourses en vente depuis le lot ACCEPTATION
 *                     (2026-09-11, décision 7 : plus de durée en mois,
 *                     une formule bourses = un nombre de candidatures).
 *                     Le webhook efface alors `planExpiresAt` à
 *                     l'activation ; c'est l'admin qui met fin à la
 *                     formule.
 * `pass: true`      = Pass Découverte (fitzExpressExpiresAt, jamais `plan`).
 * `parcours`        = "bourse" | "preinscription" — décide QUEL champ
 *                     du compte l'achat écrit.
 * `campagne: true`  = expire le 31 juillet de la campagne en cours.
 * `dureeJours`      = durée fixe (pass, diagnostic).
 * `quota`           = candidatures bourses de la formule — MIROIR de
 *                     maxAccompaniedApplications (pricing-plans.js), pour
 *                     ne jamais vendre une formule qui n'ouvrirait aucune
 *                     place (refusAchat).
 */
const GRILLE = {
  fitzExpress: { label: "Pass Découverte", prix: 10000, dureeJours: 14, pass: true, parcours: "bourse" },
  // 15 000 → 25 000 F le 2026-09-11 (lot VITRINE-COMMERCIALE, décision de
  // Charles) : c'est CE montant qui est facturé, pricing-plans.js n'est
  // que le miroir affiché — test/grille-b.test.mjs les compare.
  "premier-dossier": { label: "Forfait Premier Dossier", prix: 25000, dureeMois: null, parcours: "bourse", quota: 1 },
  // Grille A (2026-09-07) : les deux offres bourses révisées. Lot
  // ACCEPTATION : sans échéance, comme Premier Dossier.
  "essentiel-4": { label: "Forfait Essentiel", prix: 45000, dureeMois: null, parcours: "bourse", quota: 4 },
  "conseiller-6": { label: "Forfait Conseiller", prix: 150000, dureeMois: null, parcours: "bourse", quota: 6 },
  // DÉPRÉCIÉES (grille A) : `deprecated: true` = creerPaiement REFUSE
  // l'achat (une offre retirée de la vente ne se paie pas, même en
  // forgeant la requête), mais le webhook HONORE encore un paiement
  // créé avant le retrait — retirer l'entrée aurait laissé un étudiant
  // payé sans activation. Mêmes prix qu'à l'époque.
  essentiel: { label: "Forfait Essentiel", prix: 45000, dureeMois: 6, parcours: "bourse", deprecated: true, quota: 5 },
  accompagnement: { label: "Forfait Ambition", prix: 75000, dureeMois: 9, parcours: "bourse", deprecated: true, quota: 9 },
  "signature-focus": { label: "Forfait Conseiller", prix: 150000, dureeMois: 9, parcours: "bourse", deprecated: true, quota: 12 },
  signature: { label: "Signature", prix: 250000, dureeMois: 12, parcours: "bourse", deprecated: true, quota: Infinity },
  // Grille B — préinscription (France uniquement). Prix décidés, ne pas rouvrir.
  "diagnostic-france": { label: "Diagnostic France", prix: 10000, dureeJours: 14, parcours: "preinscription" },
  "dossier-france": { label: "Dossier France", prix: 75000, campagne: true, parcours: "preinscription", maxPreinscriptions: 7 },
  "dossier-france-conseiller": { label: "Dossier France + Conseiller", prix: 150000, campagne: true, parcours: "preinscription", maxPreinscriptions: 7 },
};

// Miroir de PLAN_ORDER (js/plan-features.js). Sert uniquement à ne
// jamais RÉTROGRADER un client.
// Grille A : `essentiel-4` se range SOUS `essentiel` (5) et
// `conseiller-6` SOUS `signature-focus` (12) — un client d'une ancienne
// formule encore active ne peut pas être rétrogradé par un achat.
const RANG = {
  gratuit: 0,
  "premier-dossier": 1,
  "essentiel-4": 2,
  essentiel: 3,
  accompagnement: 4,
  premium: 5,
  "conseiller-6": 6,
  "signature-focus": 7,
  signature: 8,
};

/**
 * Une offre se vend si elle est dans la GRILLE et n'est pas dépréciée.
 * Vérifié par creerPaiement AVANT de créer la facture.
 */
function estEnVente(planId) {
  const offre = GRILLE[planId];
  return !!offre && offre.deprecated !== true;
}

// ============================================================
// LES 10 000 F DU DIAGNOSTIC SE DÉDUISENT (lot DIAGNOSTIC-2, 2026-09-09)
// ============================================================
//
// Le Diagnostic France est vendu comme « une réponse honnête AVANT de
// payer Campus France ». Le facturer une seconde fois à qui décide
// ensuite de se faire accompagner en ferait un péage : on le déduit.
//
// Trente jours, parce que c'est le temps d'une décision de famille —
// pas quatorze, qui est la durée d'ACCÈS au diagnostic et n'a rien à
// voir avec le délai qu'on met à se décider.
//
// Miroir de pricing-plans.js (DEDUCTION_DIAGNOSTIC), comparé par
// test/grille-b.test.mjs. Le prix qui FAIT FOI est celui calculé ici :
// le navigateur n'envoie qu'un identifiant de formule, jamais un
// montant (voir functions/paiement.js).
const DEDUCTION_DIAGNOSTIC = {
  offre: "diagnostic-france",
  montant: 10000,
  jours: 30,
  plans: ["dossier-france", "dossier-france-conseiller"],
  mention: "vos 10 000 F de diagnostic sont déduits",
  // Miroir explicite de GRILLE["diagnostic-france"].dureeJours, pour que
  // le client puisse porter la même valeur sans lire toute la grille.
  // Un test vérifie qu'elles ne divergent pas.
  dureeDiagnosticJours: 14,
};

/**
 * Quand ce compte a-t-il payé son diagnostic ? `null` s'il ne l'a pas
 * payé, ou si on ne peut pas le dater.
 *
 * DEUX SOURCES, dans cet ordre :
 *   1. `diagnosticPayeLe`, posé par le webhook depuis ce lot. C'est la
 *      seule qui soit exacte, et c'est celle qui vaudra pour tous les
 *      achats à venir.
 *   2. À défaut, l'échéance du diagnostic en cours moins sa durée
 *      (14 jours). Filet pour les comptes qui ont payé AVANT ce lot :
 *      sans lui, ils perdraient une déduction qu'ils ont achetée. Il
 *      s'éteint tout seul, puisque tout nouvel achat pose le champ.
 */
function diagnosticPayeLe(user = {}) {
  const explicite = dateValide(user.diagnosticPayeLe);
  if (explicite) return explicite;

  if (String(user.planPreinscription || "") !== DEDUCTION_DIAGNOSTIC.offre) return null;

  const expiration = dateValide(user.planPreinscriptionExpiresAt);
  if (!expiration) return null;

  const duree = DEDUCTION_DIAGNOSTIC.dureeDiagnosticJours;
  return new Date(expiration.getTime() - duree * 86400000);
}

/**
 * Le prix RÉELLEMENT dû pour une formule, déduction faite.
 *
 * @returns {{prix:number, base:number, deduction:number, mention:string}|null}
 *          null pour une formule inconnue.
 */
function prixAvecDeduction(planId, user = {}, maintenant = new Date()) {
  const offre = GRILLE[planId];
  if (!offre) return null;

  const base = offre.prix;
  const rien = { prix: base, base, deduction: 0, mention: "" };

  if (!DEDUCTION_DIAGNOSTIC.plans.includes(planId)) return rien;

  const paye = diagnosticPayeLe(user);
  if (!paye) return rien;

  const jours = Math.floor((maintenant.getTime() - paye.getTime()) / 86400000);
  // Un achat daté dans le FUTUR n'ouvre aucun droit : une horloge
  // décalée ou une donnée saisie à la main ne doit pas faire un rabais.
  if (jours < 0 || jours > DEDUCTION_DIAGNOSTIC.jours) return rien;

  return {
    prix: base - DEDUCTION_DIAGNOSTIC.montant,
    base,
    deduction: DEDUCTION_DIAGNOSTIC.montant,
    mention: DEDUCTION_DIAGNOSTIC.mention,
  };
}

// Miroir de PLAN_PREINSCRIPTION_ORDER (js/plan-features.js).
const RANG_PREINSCRIPTION = {
  "diagnostic-france": 1,
  "dossier-france": 2,
  "dossier-france-conseiller": 3,
};

// MIROIR de CAMPAGNE_FRANCE.cloture (js/pays-preinscription.js).
const CLOTURE_CAMPAGNE = { mois: 7, jour: 31 };

/**
 * Le 31 juillet de la campagne Études en France en cours à `date`
 * (UTC, fin de journée). Août → décembre : l'année suivante ;
 * janvier → juillet : la même année.
 */
function finDeCampagne(date) {
  const d = date instanceof Date ? date : new Date(date);
  const mois = d.getUTCMonth() + 1;
  let annee = d.getUTCFullYear();
  if (mois > CLOTURE_CAMPAGNE.mois) annee += 1;
  return new Date(Date.UTC(annee, CLOTURE_CAMPAGNE.mois - 1, CLOTURE_CAMPAGNE.jour, 23, 59, 59));
}

// Les dates sont lues et écrites en CHAÎNE ISO, jamais en Timestamp
// Firestore : tout le site les lit avec `new Date(valeur)`.
function dateValide(valeur) {
  if (!valeur) return null;
  const d = new Date(valeur);
  return isNaN(d.getTime()) ? null : d;
}

function ajouterJours(depart, jours) {
  const d = new Date(depart.getTime());
  d.setUTCDate(d.getUTCDate() + jours);
  return d;
}

function ajouterMois(depart, mois) {
  const d = new Date(depart.getTime());
  d.setMonth(d.getMonth() + mois);
  return d;
}

/**
 * Ce que le compte devient après un paiement confirmé.
 *
 * @param {Object} p
 * @param {string} p.planId        - l'offre payée (clé de GRILLE)
 * @param {Object} [p.user]        - users/{uid} tel qu'il est
 * @param {Date}   [p.maintenant]
 * @param {*}      p.supprimer     - la sentinelle « effacer ce champ »
 *                                   (admin.firestore.FieldValue.delete())
 * @returns {{ statut: "applique"|"rang-inferieur"|"formule-inconnue",
 *             misAJour?: Object, planActuel?: string }}
 */
function calculerMiseAJour({ planId, user = {}, maintenant = new Date(), supprimer }) {
  const offre = GRILLE[planId];
  if (!offre) return { statut: "formule-inconnue" };

  const misAJour = {
    pendingPlan: supprimer,
    pendingPlanRequestedAt: supprimer,
    dernierPaiementLe: maintenant.toISOString(),
    // LOT ADMIN (2026-09-09) : un VRAI paiement efface la mention
    // d'attribution manuelle. Le propriétaire peut poser une formule à
    // la main — pour tester, pour dépanner, pour régulariser — et la
    // fiche l'annonce alors en tête : « aucun paiement associé ». Le
    // jour où l'argent arrive vraiment, cette phrase devient fausse, et
    // une phrase fausse sur une fiche client est pire que pas de phrase.
    //
    // Posé ici, dans l'objet COMMUN aux trois branches : le pass, la
    // grille préinscription et la grille bourse l'effacent toutes les
    // trois. Y compris sur un achat de rang inférieur, qui n'applique
    // pas la formule mais encaisse — l'argent a bien été versé.
    attributionManuelle: supprimer,
  };

  // --- Le pass Découverte n'est pas une formule ---
  if (offre.pass) {
    const restant = dateValide(user.fitzExpressExpiresAt);
    const depart = restant && restant > maintenant ? restant : maintenant;
    misAJour.fitzExpressExpiresAt = ajouterJours(depart, offre.dureeJours).toISOString();
    return { statut: "applique", misAJour };
  }

  // --- Grille B : le forfait PRÉINSCRIPTION, sans jamais toucher `plan` ---
  if (offre.parcours === "preinscription") {
    const actuel = String(user.planPreinscription || "");
    const expiration = dateValide(user.planPreinscriptionExpiresAt);
    const encoreActif = !!actuel && !!expiration && expiration > maintenant;

    const rangActuel = encoreActif ? RANG_PREINSCRIPTION[actuel] ?? 0 : 0;
    const rangAchete = RANG_PREINSCRIPTION[planId] ?? 0;

    if (rangAchete < rangActuel) {
      return { statut: "rang-inferieur", misAJour, planActuel: actuel };
    }

    misAJour.planPreinscription = planId;

    let echeance;
    if (offre.campagne) {
      echeance = finDeCampagne(maintenant);
    } else {
      // Diagnostic : 14 jours, prolongés si le même diagnostic est encore actif.
      const depart = encoreActif && actuel === planId ? expiration : maintenant;
      echeance = ajouterJours(depart, offre.dureeJours);
    }

    // Un achat ne raccourcit JAMAIS un accès en cours.
    if (encoreActif && expiration > echeance) echeance = expiration;

    misAJour.planPreinscriptionExpiresAt = echeance.toISOString();

    // La DATE D'ACHAT du diagnostic, et non son échéance : c'est elle
    // qui ouvre la déduction de 10 000 F sur un Dossier France acheté
    // dans les trente jours (prixAvecDeduction). Déduire depuis
    // l'échéance marchait, tant que la durée du diagnostic ne bougeait
    // pas — une déduction ne doit pas dépendre d'un paramètre qui n'a
    // rien à voir avec elle.
    if (planId === DEDUCTION_DIAGNOSTIC.offre) misAJour.diagnosticPayeLe = maintenant.toISOString();

    return { statut: "applique", misAJour };
  }

  // --- Le forfait BOURSE (inchangé depuis le 2026-09-04) ---
  const planActuel = String(user.plan || "gratuit");
  const expiration = dateValide(user.planExpiresAt);
  const encoreActif = !user.planExpiresAt || (expiration && expiration > maintenant);

  const rangActuel = encoreActif ? RANG[planActuel] ?? 0 : 0;
  const rangAchete = RANG[planId] ?? 0;

  if (rangAchete < rangActuel) {
    return { statut: "rang-inferieur", misAJour, planActuel };
  }

  misAJour.plan = planId;

  if (offre.dureeMois === null) {
    misAJour.planExpiresAt = supprimer;
  } else {
    const memeFormule = planActuel === planId && encoreActif && expiration;
    const depart = memeFormule && expiration > maintenant ? expiration : maintenant;
    let echeance = ajouterMois(depart, offre.dureeMois);
    if (expiration && expiration > echeance) echeance = expiration;
    misAJour.planExpiresAt = echeance.toISOString();
  }

  return { statut: "applique", misAJour };
}

// ============================================================
// NE JAMAIS VENDRE CE QUI N'AJOUTE RIEN (lot ACCEPTATION, 2026-09-11)
// ============================================================
//
// Il n'y a jamais de remboursement : tout refus doit arriver ICI, dans
// creerPaiement, avant que le moindre franc ne bouge. Trois refus, une
// seule fonction pure, testée (test/functions-achat.test.mjs) :
//
//   1. LA MÊME FORMULE — on refuse la formule que le compte porte déjà
//      dans `plan`, même si l'admin l'a terminée. Le message nomme la
//      formule détenue, et la marche suivante en vente quand il y en a
//      une.
//   2. UNE FORMULE QUI N'OUVRIRAIT AUCUNE PLACE (bourses seulement) —
//      quand le quota acheté est inférieur ou égal au nombre de cartes
//      bourses déjà présentes : un détenteur d'`accompagnement`
//      (9 cartes) qui prend conseiller-6, un conseiller-6 terminé qui
//      prend essentiel-4. Monter reste possible quand de nouvelles places
//      s'ouvrent (essentiel-4 → conseiller-6 : slot-5 et slot-6).
//   3. LE PASS DÉCOUVERTE À UN COMPTE QUI A DÉJÀ LE CHAT — toute formule
//      active de FORMULES_AVEC_FITZ comprend le chat (formuleActive,
//      functions/lib/fitz-acces.js).

const { formuleActive } = require("./fitz-acces");

// La marche suivante EN VENTE, côté bourses.
const FORMULE_SUIVANTE = { "premier-dossier": "essentiel-4", "essentiel-4": "conseiller-6", "conseiller-6": null };

/**
 * @param {Object} p
 * @param {string} p.planId              - l'offre demandée
 * @param {Object} [p.user]              - users/{uid}
 * @param {number} [p.nombreCartesBourse] - cartes bourses déjà présentes
 *                                          (users/{uid}/applications, hors
 *                                          track "preinscription")
 * @param {Date}   [p.maintenant]
 * @returns {{ code: string, message: string }|null} null = rien ne s'oppose à la vente
 */
function refusAchat({ planId, user = {}, nombreCartesBourse = 0, maintenant = new Date() }) {
  const offre = GRILLE[planId];
  if (!offre) return null;

  // 3. Le Pass à un compte qui a déjà le chat.
  if (offre.pass) {
    const active = formuleActive(user, maintenant);
    if (active && active !== "fitzExpress") {
      return { code: "pass-inclus", message: "Votre formule comprend déjà Discuter avec Fitz." };
    }
    return null;
  }

  if (offre.parcours !== "bourse") return null;

  // 1. La même formule.
  if (String(user.plan || "") === planId) {
    const expiration = dateValide(user.planExpiresAt);
    const terminee = !!expiration && expiration.getTime() <= maintenant.getTime();
    if (terminee) {
      return { code: "meme-formule-terminee", message: `Votre ${offre.label} est terminé. L'équipe FitzUniverse vous indiquera la suite dans votre espace.` };
    }
    const suivante = FORMULE_SUIVANTE[planId] ? GRILLE[FORMULE_SUIVANTE[planId]].label : null;
    return {
      code: "meme-formule",
      message: `Vous détenez déjà le ${offre.label} : il n'a pas d'échéance, et vos candidatures sont suivies jusqu'à la décision des universités. ` +
        (suivante ? `Pour plus de candidatures, passez au ${suivante}.` : "Une fois vos décisions reçues, l'équipe FitzUniverse vous indiquera la suite."),
    };
  }

  // 2. Aucune place nouvelle.
  const n = Number.isFinite(nombreCartesBourse) ? nombreCartesBourse : 0;
  if (Number.isFinite(offre.quota) && offre.quota <= n) {
    return { code: "aucune-place", message: `Cet achat n'ouvrirait aucune nouvelle place : vous avez déjà ${n} candidatures. L'équipe FitzUniverse vous indiquera la suite.` };
  }

  return null;
}

module.exports = { GRILLE, RANG, RANG_PREINSCRIPTION, CLOTURE_CAMPAGNE, DEDUCTION_DIAGNOSTIC, FORMULE_SUIVANTE, finDeCampagne, calculerMiseAJour, dateValide, estEnVente, diagnosticPayeLe, prixAvecDeduction, refusAchat };
