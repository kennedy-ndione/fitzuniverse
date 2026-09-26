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
 *
 * SIX DESTINATIONS DE PLUS (2026-09-23, décision de Charles)
 * ---------------------------------------------------------
 * La Roumanie, la Turquie, le Maroc, l'Italie, l'Allemagne et le Canada
 * se vendent avec LA MÊME GRILLE que la France (45 000 / 70 000 F
 * depuis le lot 118 du 2026-09-26) et les MÊMES identifiants d'offre. Ce qui change, c'est la
 * DESTINATION, envoyée par le navigateur avec l'identifiant d'offre et
 * vérifiée ici contre DESTINATIONS_VENDUES :
 *
 *   destination "france" (ou absente) → `planPreinscription`, comme
 *     avant : RIEN ne change pour la France, ni les champs, ni la
 *     campagne du 31 juillet, ni la déduction.
 *   toute autre destination → `preinscriptionsPays.<destination>` =
 *     { plan, expiresAt, diagnosticPayeLe? }. Un compte peut détenir un
 *     dossier par pays : acheter l'Italie ne touche jamais au dossier
 *     France, ni l'inverse.
 *
 * Durée hors France : les procédures de ces pays n'ont pas de campagne
 * unique à date fixe (chaque université a la sienne) — un dossier vaut
 * DOUZE MOIS à compter de l'achat ; le diagnostic, quatorze jours.
 * ============================================================
 */

/** Les destinations vendues. MIROIR de DESTINATIONS_VENDUES (js/destinations-preinscription.js). */
const DESTINATIONS_VENDUES = ["france", "roumanie", "turquie", "maroc", "italie", "allemagne", "canada", "chine", "malaisie"];

/** Le nom de chaque destination, pour les libellés de facture. */
const NOMS_DESTINATION = {
  france: "France", roumanie: "Roumanie", turquie: "Turquie", maroc: "Maroc",
  italie: "Italie", allemagne: "Allemagne", canada: "Canada",
  chine: "Chine", malaisie: "Malaisie",
};

/** Durée d'un dossier hors France, en mois. */
const DUREE_DOSSIER_PAYS_MOIS = 12;

/** "france" pour une destination absente ou inconnue du forfait préinscription. */
function destinationNormalisee(destination) {
  const d = String(destination || "").toLowerCase();
  return DESTINATIONS_VENDUES.includes(d) ? d : "france";
}

/** Vrai si la destination demandée est vendue (absente = France). */
function destinationVendue(destination) {
  return destination === undefined || destination === null || destination === "" ||
    DESTINATIONS_VENDUES.includes(String(destination).toLowerCase());
}

/**
 * Le libellé d'une offre pour une destination : « Dossier Italie »,
 * « Diagnostic Maroc », « Dossier Canada + Conseiller ». Inchangé pour
 * la France et pour toute offre bourse.
 */
function libelleOffre(planId, destination) {
  const offre = GRILLE[planId];
  if (!offre) return "";
  const d = destinationNormalisee(destination);
  if (offre.parcours !== "preinscription" || d === "france") return offre.label;
  return offre.label.replace("France", NOMS_DESTINATION[d]);
}

/** L'entrée d'un pays dans users/{uid}.preinscriptionsPays, ou {}. */
function entreePays(user, destination) {
  const carte = user && user.preinscriptionsPays;
  const e = carte && typeof carte === "object" ? carte[destination] : null;
  return e && typeof e === "object" ? e : {};
}

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
  // 150 000 → 90 000 F le 2026-09-26 (lot 118, décision de Charles).
  "conseiller-6": { label: "Forfait Conseiller", prix: 90000, dureeMois: null, parcours: "bourse", quota: 6 },
  // LES ANCIENNES FORMULES (essentiel, accompagnement, signature-focus,
  // signature) ONT ÉTÉ SUPPRIMÉES LE 2026-09-24 (décision de Charles) :
  // aucun compte ne les portait, aucun paiement ne les nommait. Un
  // `deprecated: true` reste possible pour une future sortie de vente —
  // creerPaiement refuse alors l'achat, le webhook honore encore un
  // paiement créé avant.
  // Grille B — préinscription. Les MÊMES trois offres, aux mêmes prix,
  // dans les neuf pays (décision de Charles, 2026-09-24 : « gardons P1
  // pour tous les 9 pays ») ; les identifiants gardent leur « -france »
  // historique, c'est la destination de l'achat qui dit le pays.
  // Prix rouverts par Charles le 2026-09-26 (lot 118) : Dossier
  // 75 000 → 45 000 F, Dossier + Conseiller 150 000 → 70 000 F. Une
  // facture créée avant garde son montant (montantAttendu).
  // Retiré de la vente le 2026-09-25 (lot 97) : le diagnostic est gratuit.
  "diagnostic-france": { label: "Diagnostic France", prix: 10000, dureeJours: 14, parcours: "preinscription", deprecated: true },
  "dossier-france": { label: "Dossier France", prix: 45000, campagne: true, parcours: "preinscription", maxPreinscriptions: 7 },
  "dossier-france-conseiller": { label: "Dossier France + Conseiller", prix: 70000, campagne: true, parcours: "preinscription", maxPreinscriptions: 7 },
};

// Miroir de PLAN_ORDER (js/plan-features.js). Sert uniquement à ne
// jamais RÉTROGRADER un client.
const RANG = {
  gratuit: 0,
  "premier-dossier": 1,
  "essentiel-4": 2,
  "conseiller-6": 3,
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
function diagnosticPayeLe(user = {}, destination = "france") {
  const d = destinationNormalisee(destination);
  if (d !== "france") return dateValide(entreePays(user, d).diagnosticPayeLe);

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
function prixAvecDeduction(planId, user = {}, maintenant = new Date(), destination = "france") {
  const offre = GRILLE[planId];
  if (!offre) return null;

  const base = offre.prix;
  const rien = { prix: base, base, deduction: 0, mention: "" };

  if (!DEDUCTION_DIAGNOSTIC.plans.includes(planId)) return rien;

  // Le diagnostic se déduit du dossier DU MÊME PAYS : un Diagnostic Maroc
  // ne fait pas une remise sur un Dossier Italie.
  const paye = diagnosticPayeLe(user, destination);
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
function calculerMiseAJour({ planId, user = {}, maintenant = new Date(), supprimer, destination = "france" }) {
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

  // --- Grille B hors France : un dossier PAR PAYS (2026-09-23) ---
  // `preinscriptionsPays.<pays>`, jamais `planPreinscription` : le dossier
  // France et celui d'un autre pays vivent côte à côte. Le webhook écrit
  // en `set(..., { merge: true })`, qui fusionne les cartes : les autres
  // pays du compte ne sont pas touchés.
  const dest = destinationNormalisee(destination);
  if (offre.parcours === "preinscription" && dest !== "france") {
    const entree = entreePays(user, dest);
    const actuel = String(entree.plan || "");
    const expiration = dateValide(entree.expiresAt);
    const encoreActif = !!actuel && !!expiration && expiration > maintenant;

    const rangActuel = encoreActif ? RANG_PREINSCRIPTION[actuel] ?? 0 : 0;
    const rangAchete = RANG_PREINSCRIPTION[planId] ?? 0;

    if (rangAchete < rangActuel) {
      return { statut: "rang-inferieur", misAJour, planActuel: actuel };
    }

    let echeance;
    if (offre.campagne) {
      echeance = ajouterMois(maintenant, DUREE_DOSSIER_PAYS_MOIS);
    } else {
      const depart = encoreActif && actuel === planId ? expiration : maintenant;
      echeance = ajouterJours(depart, offre.dureeJours);
    }
    if (encoreActif && expiration > echeance) echeance = expiration;

    const nouvelle = { plan: planId, expiresAt: echeance.toISOString() };
    if (planId === DEDUCTION_DIAGNOSTIC.offre) nouvelle.diagnosticPayeLe = maintenant.toISOString();

    misAJour.preinscriptionsPays = { [dest]: nouvelle };
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
//      bourses déjà présentes : un conseiller-6 terminé (6 cartes) qui
//      prend essentiel-4. Monter reste possible quand de nouvelles places
//      s'ouvrent (essentiel-4 → conseiller-6 : slot-5 et slot-6).
//   3. LE PASS DÉCOUVERTE À UN COMPTE QUI A DÉJÀ LE CHAT — toute formule
//      active de FORMULES_AVEC_FITZ comprend le chat (formuleActive,
//      functions/lib/fitz-acces.js).
//   4. LE MÊME DOSSIER DE CAMPAGNE, ENCORE ACTIF (lot PAIEMENT-SÛR,
//      2026-09-17) — racheter Dossier France (ou + Conseiller) pendant la
//      campagne qu'il couvre déjà : calculerMiseAJour l'appliquait
//      (« applique »), mais l'échéance restait le même 31 juillet. Le
//      paiement était encaissé sans rien ouvrir. Refusé ici. Une
//      nouvelle campagne (achat d'août pour un dossier qui finit le
//      31 juillet) reste possible, et le Diagnostic France se prolonge
//      toujours : racheter ses 14 jours ajoute 14 jours.
//
// Le cinquième cas — une formule d'un rang INFÉRIEUR à celle, active,
// que le compte détient déjà — est refusé dans creerPaiement même, en
// rejouant calculerMiseAJour à blanc (statut « rang-inferieur »).

const { formuleActive } = require("./fitz-acces");

// La marche suivante EN VENTE, côté bourses.
const FORMULE_SUIVANTE = { "premier-dossier": "essentiel-4", "essentiel-4": "conseiller-6", "conseiller-6": null };

// La marche suivante EN VENTE, côté préinscription (dossiers de campagne).
const PREINSCRIPTION_SUIVANTE = { "dossier-france": "dossier-france-conseiller", "dossier-france-conseiller": null };

const MOIS_FR = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

// « 31 juillet 2027 », en UTC : les échéances sont écrites en UTC.
function dateLongue(d) {
  return `${d.getUTCDate()} ${MOIS_FR[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

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
function refusAchat({ planId, user = {}, nombreCartesBourse = 0, maintenant = new Date(), destination = "france" }) {
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

  // 4 bis. Le même dossier pour le même pays hors France, encore actif.
  const dest = destinationNormalisee(destination);
  if (offre.parcours === "preinscription" && dest !== "france") {
    const entree = entreePays(user, dest);
    const expiration = dateValide(entree.expiresAt);
    if (offre.campagne && String(entree.plan || "") === planId && expiration && expiration > maintenant) {
      const label = libelleOffre(planId, dest);
      const suivante = PREINSCRIPTION_SUIVANTE[planId] ? libelleOffre(PREINSCRIPTION_SUIVANTE[planId], dest) : null;
      return {
        code: "meme-dossier",
        message: `Vous détenez déjà le ${label} : il reste actif jusqu'au ${dateLongue(expiration)}. ` +
          (suivante ? `Pour un conseiller à vos côtés, passez au ${suivante}.` : "Il n'y a rien de plus à acheter pour ce pays."),
      };
    }
    return null;
  }

  // 4. Le même dossier de campagne, encore actif.
  if (offre.parcours === "preinscription") {
    if (offre.campagne && String(user.planPreinscription || "") === planId) {
      const expiration = dateValide(user.planPreinscriptionExpiresAt);
      const fin = finDeCampagne(maintenant);
      if (expiration && expiration.getTime() >= fin.getTime()) {
        const suivante = PREINSCRIPTION_SUIVANTE[planId] ? GRILLE[PREINSCRIPTION_SUIVANTE[planId]].label : null;
        return {
          code: "meme-dossier",
          message: `Vous détenez déjà le ${offre.label} pour cette campagne : il reste actif jusqu'au ${dateLongue(expiration)}. ` +
            (suivante ? `Pour un conseiller à vos côtés, passez au ${suivante}.` : "Il n'y a rien de plus à acheter pour cette campagne."),
        };
      }
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

module.exports = { GRILLE, RANG, RANG_PREINSCRIPTION, CLOTURE_CAMPAGNE, DEDUCTION_DIAGNOSTIC, FORMULE_SUIVANTE, PREINSCRIPTION_SUIVANTE, DESTINATIONS_VENDUES, DUREE_DOSSIER_PAYS_MOIS, finDeCampagne, calculerMiseAJour, dateValide, estEnVente, diagnosticPayeLe, prixAvecDeduction, refusAchat, destinationNormalisee, destinationVendue, libelleOffre };
