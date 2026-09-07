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
 * `dureeMois: null` = achat unique sans échéance (Premier Dossier).
 * `pass: true`      = pass Fitz Express (fitzExpressExpiresAt, jamais `plan`).
 * `parcours`        = "bourse" | "preinscription" — décide QUEL champ
 *                     du compte l'achat écrit.
 * `campagne: true`  = expire le 31 juillet de la campagne en cours.
 * `dureeJours`      = durée fixe (pass, diagnostic).
 */
const GRILLE = {
  fitzExpress: { label: "Pass Découverte", prix: 10000, dureeJours: 14, pass: true, parcours: "bourse" },
  "premier-dossier": { label: "Forfait Premier Dossier", prix: 15000, dureeMois: null, parcours: "bourse" },
  // Grille A (2026-09-07) : les deux offres bourses révisées.
  "essentiel-4": { label: "Forfait Essentiel", prix: 45000, dureeMois: 6, parcours: "bourse" },
  "conseiller-6": { label: "Forfait Conseiller", prix: 150000, dureeMois: 9, parcours: "bourse" },
  // DÉPRÉCIÉES (grille A) : `deprecated: true` = creerPaiement REFUSE
  // l'achat (une offre retirée de la vente ne se paie pas, même en
  // forgeant la requête), mais le webhook HONORE encore un paiement
  // créé avant le retrait — retirer l'entrée aurait laissé un étudiant
  // payé sans activation. Mêmes prix qu'à l'époque.
  essentiel: { label: "Forfait Essentiel", prix: 45000, dureeMois: 6, parcours: "bourse", deprecated: true },
  accompagnement: { label: "Forfait Ambition", prix: 75000, dureeMois: 9, parcours: "bourse", deprecated: true },
  "signature-focus": { label: "Forfait Conseiller", prix: 150000, dureeMois: 9, parcours: "bourse", deprecated: true },
  signature: { label: "Signature", prix: 250000, dureeMois: 12, parcours: "bourse", deprecated: true },
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

module.exports = { GRILLE, RANG, RANG_PREINSCRIPTION, CLOTURE_CAMPAGNE, finDeCampagne, calculerMiseAJour, dateValide, estEnVente };
