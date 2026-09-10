/**
 * ============================================================
 * functions/lib/fitz-acces.js — qui a droit à Fitz, et jusqu'où
 * ============================================================
 *
 * Module PUR (aucun Firebase, aucun réseau), extrait de functions/fitz.js
 * au lot PRÉ-FITZ (2026-09-10) pour être testable sous Node — comme
 * functions/lib/acces.js l'est pour les portails et functions/lib/achat.js
 * pour la grille.
 *
 * DEUX DÉFAUTS ONT MOTIVÉ L'EXTRACTION, et le second était le plus grave :
 *
 *   1. formuleActive() ne lisait que `userData.plan`. Un client Dossier
 *      France (75 000 F) aurait vu ses outils déverrouillés dans le
 *      navigateur et REFUSÉS par le serveur, avec un message lui disant
 *      d'acheter une formule bourse.
 *   2. FORMULES_AVEC_FITZ contenait cinq offres RETIRÉES de la vente et
 *      ignorait les deux formules bourse actuellement vendues
 *      (essentiel-4, conseiller-6). Le commentaire du fichier avertissait
 *      exactement de cela — « à tenir à jour à chaque ajout d'offre » —
 *      et l'avertissement n'a pas été suivi. Un miroir sans test dérive :
 *      test/pre-fitz.test.mjs compare désormais cette liste à la grille
 *      de vente et aux droits de js/plan-features.js.
 *
 * L'ORDRE DE LECTURE est celui de functions/lib/acces.js : formule bourse
 * valide, puis offre préinscription valide, puis Pass Fitz Express — le
 * plafond le plus généreux gagne. On s'inspire de la lecture en deux
 * temps qui existait déjà (planBourse / planPreinscription) plutôt que
 * d'en inventer une troisième.
 * ============================================================
 */

/**
 * Formules donnant accès à Fitz : toute offre vendue ou détenue, SAUF
 * "gratuit" et le Diagnostic France — un pass de diagnostic, pas un
 * accompagnement, qui n'ouvre aucun outil (js/plan-features.js).
 *
 * Les identifiants dépréciés restent : ce sont les valeurs de `plan` de
 * comptes bien réels, qui ont payé.
 *
 * Portée volontairement limitée : ce contrôle répond à « ce compte
 * a-t-il droit à Fitz », pas à « a-t-il droit à CET outil ». Le détail
 * par outil vient des indicateurs de config/planFeatures, modifiables à
 * chaud par l'administrateur. Ce qui est protégé ici, c'est la facture.
 */
const FORMULES_AVEC_FITZ = [
  // Grille bourse — en vente.
  "premier-dossier",
  "essentiel-4",
  "conseiller-6",
  // Grille bourse — dépréciées, détenues.
  "essentiel",
  "accompagnement",
  "premium",
  "signature-focus",
  "signature",
  // Grille préinscription — les deux Dossiers France (lot PRÉ-FITZ).
  "dossier-france",
  "dossier-france-conseiller",
];

/** MIROIR de PLAN_PREINSCRIPTION_ORDER (js/plan-features.js). */
const OFFRES_PREINSCRIPTION = ["diagnostic-france", "dossier-france", "dossier-france-conseiller"];

/**
 * Plafonds d'usage, en POINTS (voir `poids` dans functions/fitz.js).
 *
 * CALIBRAGE (2026-09-04, appliqué à nouveau le 2026-09-10) : environ
 * 25 % du revenu mensuel de chaque formule, à raison d'un point ≈ 10 F CFA
 * de coût attendu. Le plafond quotidien vaut ~1/5 du mensuel : il existe
 * pour qu'une boucle ou un compte partagé se heurte à un mur en quelques
 * heures, pas en fin de mois.
 *
 * Recalculés depuis la durée RÉELLE de chaque offre (pricing-plans.js) :
 *   essentiel-4      45 000 F /  6 mois =  7 500 F/mois → 25 % = 1 875 F → 190 pts
 *   conseiller-6    150 000 F /  9 mois = 16 667 F/mois → 4 167 F → ~400 pts
 *   dossier-france   75 000 F / une campagne ; une campagne Études en
 *                    France va de l'ouverture (1er octobre) au 31 juillet,
 *                    soit 10 mois au plus long → 7 500 F/mois → 190 pts.
 *                    Un achat en cours de campagne dure MOINS : le
 *                    plafond mensuel est donc, s'il pèche, généreux.
 *   dossier-france-conseiller 150 000 F / 10 mois = 15 000 F/mois → 3 750 F → 375 → 380 pts
 *
 * ⚠️ CE SONT DES ESTIMATIONS, PAS DES MESURES. Un plafond trop bas atteint
 * par un étudiant sérieux est un incident commercial : il se relève, il
 * ne se défend pas.
 */
const PLAFONDS = {
  // Compte gratuit : la tâche `diagnostic` UNIQUEMENT, à dose homéopathique.
  gratuit: { jour: 2, mois: 3 },

  fitzExpress: { jour: 40, mois: 250 },
  "premier-dossier": { jour: 50, mois: 300 },
  "essentiel-4": { jour: 40, mois: 190 },
  essentiel: { jour: 40, mois: 190 },
  accompagnement: { jour: 45, mois: 210 },
  premium: { jour: 45, mois: 210 },
  "conseiller-6": { jour: 70, mois: 400 },
  "signature-focus": { jour: 70, mois: 400 },
  signature: { jour: 90, mois: 500 },
  "dossier-france": { jour: 40, mois: 190 },
  "dossier-france-conseiller": { jour: 70, mois: 380 },
};

const PLAFOND_PAR_DEFAUT = { jour: 40, mois: 190 };

function expire(valeur, maintenant) {
  if (!valeur) return true;
  const date = valeur && typeof valeur.toDate === "function" ? valeur.toDate() : new Date(valeur);
  return isNaN(date.getTime()) || date.getTime() < maintenant.getTime();
}

/**
 * La clé de formule à utiliser pour le plafond, ou null si l'accès à
 * Fitz est refusé.
 *
 * Reproduit resolvePlan() + resolvePlanPreinscription() +
 * hasFitzExpressAccess() de js/plan-features.js. Volontairement dupliqué
 * plutôt qu'importé : ce fichier tourne en CommonJS côté serveur, le
 * module du site est un module ES. Toute évolution des règles de
 * formule doit être répercutée ICI AUSSI — et le test de miroir le dit.
 *
 * @param {Object|null} userData document users/{uid}
 * @param {Date} [maintenant]
 */
function formuleActive(userData, maintenant = new Date()) {
  if (!userData) return null;

  // 1. La formule BOURSE, si elle est valide. Une formule sans échéance
  //    (Premier Dossier) est acquise pour toujours.
  const plan = String(userData.plan || "").toLowerCase();
  if (FORMULES_AVEC_FITZ.includes(plan) && (!userData.planExpiresAt || !expire(userData.planExpiresAt, maintenant))) {
    return plan;
  }

  // 2. L'offre PRÉINSCRIPTION, si elle est valide. Toujours datée : une
  //    offre sans échéance n'est pas une offre appliquée par le webhook.
  const pre = String(userData.planPreinscription || "").toLowerCase();
  if (FORMULES_AVEC_FITZ.includes(pre) && OFFRES_PREINSCRIPTION.includes(pre) && !expire(userData.planPreinscriptionExpiresAt, maintenant)) {
    return pre;
  }

  // 3. Le Pass Fitz Express, sans formule. Testé APRÈS les formules :
  //    quelqu'un qui a les deux doit avoir le plafond de sa formule.
  if (userData.fitzExpressExpiresAt && !expire(userData.fitzExpressExpiresAt, maintenant)) {
    return "fitzExpress";
  }

  return null;
}

function plafondsDe(formule) {
  return PLAFONDS[formule] || PLAFOND_PAR_DEFAUT;
}

module.exports = { FORMULES_AVEC_FITZ, OFFRES_PREINSCRIPTION, PLAFONDS, PLAFOND_PAR_DEFAUT, formuleActive, plafondsDe };
