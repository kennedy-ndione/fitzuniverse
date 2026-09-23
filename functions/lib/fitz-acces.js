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
 * LES PLAFONDS RESTENT MENSUELS, et leurs valeurs ne changent pas (lot
 * ACCEPTATION, 2026-09-11). Depuis ce lot, essentiel-4 et conseiller-6
 * n'ont PLUS de durée vendue : 6 et 9 mois ne sont plus des durées, mais
 * la BASE DU CALIBRAGE ci-dessous. Sans échéance, le plafond mensuel
 * s'applique mois après mois, jusqu'à ce que l'admin mette fin à la
 * formule (planExpiresAt, fiche étudiant).
 *
 * Calibrés depuis la durée qui servait de base à chaque offre :
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
 *
 * RELEVÉ DES PLAFONDS MENSUELS DES FORMULES VENDUES (2026-09-23, décision
 * de Charles). Le lot BARÈME (19/09) les avait laissés « à rouvrir le jour
 * où le paiement s'ouvre » ; il est ouvert depuis le 21/09. Deux constats :
 *
 * 1. LA PROMESSE. offers.html (FAQ « Y a-t-il une limite… ») et les cartes
 *    d'offres annoncent un volume QUOTIDIEN, « remis à zéro chaque nuit »,
 *    et « en travaillant vos candidatures normalement, vous ne le
 *    rencontrez pas ». Le plafond MENSUEL n'est annoncé nulle part. À 190,
 *    un Essentiel qui use ses 40 points du jour était coupé au 5e jour du
 *    mois : la page disait vrai sur le jour et faux sur le mois.
 * 2. LE BESOIN. Un mois de pointe mesuré sur le barème réel : par
 *    candidature ≈ 3 lettres (12) + 2 analyses avec pièces (~60) + e-mails
 *    et traductions (~10) ≈ 80 points ; 4 candidatures ≈ 330, plus ~3
 *    questions par jour au chat (≈ 90) → ~420 points. 190 coupait donc un
 *    étudiant sérieux en pleine campagne.
 *
 * LE COÛT, au prix mesuré du point (7 à 10 F CFA, lot BARÈME) : un mois
 * entier AU PLAFOND coûte au plus ~4 500 F pour Essentiel (10 % du prix
 * payé) — et l'usage réel reste très en dessous. La règle des « 25 % du
 * revenu mensuel » calculée sur une durée théorique de 6 à 10 mois ne
 * tenait plus : les formules n'ont plus de durée (lot ACCEPTATION), et
 * l'usage se concentre sur deux ou trois mois de pointe. Le plafond
 * QUOTIDIEN, lui, ne change pas : il est annoncé, et c'est lui qui arrête
 * un compte partagé en quelques heures.
 *
 * PLAFOND_PAR_DEFAUT (formule inconnue) reste à 40/190 : une formule que
 * le serveur ne connaît pas n'a pas à hériter du relèvement.
 */
const PLAFONDS = {
  /* Compte gratuit : la tâche `diagnostic` UNIQUEMENT.

     RELEVÉ LE 2026-09-19 (lot BARÈME) : à 2 points/jour et 3 par MOIS,
     un visiteur avait droit à UN diagnostic dans le mois — parfois un
     seul tout court, le défaut de réponse vide du 19 en faisant coûter
     deux. Or le geste qui suit le diagnostic est précisément celui qui
     rapproche de l'achat : il complète son profil, il revient, il veut
     relire son analyse — et il lisait « Vous avez atteint votre volume
     Fitz du jour ». Le premier contact avec Fitz se terminait sur un
     refus.

     4/jour et 6/mois laissent DEUX diagnostics complets même quand le
     défaut double la note, et une reprise le jour même. Au coût mesuré
     du diagnostic (~7 F CFA), 6 points valent ~42 F par prospect et par
     mois : le commentaire de functions/fitz.js le dit déjà, à cet
     instant précis c'est de la prospection, pas une dépense.

     C'est LE SEUL plafond ouvert au public, donc le seul qui puisse
     vraiment vider le crédit. Il ne tient que parce que le plafond
     GLOBAL du jour existe désormais (voir functions/fitz.js). */
  gratuit: { jour: 4, mois: 6 },

  fitzExpress: { jour: 40, mois: 300 },
  "premier-dossier": { jour: 50, mois: 300 },
  "essentiel-4": { jour: 40, mois: 450 },
  essentiel: { jour: 40, mois: 190 },
  accompagnement: { jour: 45, mois: 210 },
  premium: { jour: 45, mois: 210 },
  "conseiller-6": { jour: 70, mois: 650 },
  "signature-focus": { jour: 70, mois: 400 },
  signature: { jour: 90, mois: 500 },
  "dossier-france": { jour: 40, mois: 400 },
  "dossier-france-conseiller": { jour: 70, mois: 650 },

  /* Dérogations SANS formule (lot FITZ-ACCÈS, 2026-09-19) — le miroir
     serveur des deux contournements que js/access-guard.js accorde déjà :
     le propriétaire (admins/{uid} actif) reçoit côté client la formule
     la plus haute de PLAN_ORDER, et testerAccess déverrouille les
     outils. Sans contrepartie ici, ces comptes voyaient tout OUVERT
     puis chaque appel refusé QUOTA_PLAN avec un message de vente —
     même famille de défaut que defaut_formules_fitz du 10/09. Les
     plafonds restent des plafonds : ce sont des comptes internes, pas
     des comptes illimités.

     MONTÉS LE 2026-09-19 (lot BARÈME) : ce sont les comptes de la
     recette. Une recette qui tape un mur ne mesure plus le produit,
     elle mesure le mur — la journée du 18 l'a montré. Ils ne coûtent
     que le crédit de FitzUniverse, et ce crédit est désormais borné
     par le plafond GLOBAL du jour, qui les compte comme les autres. */
  proprietaire: { jour: 150, mois: 900 },
  testeur: { jour: 100, mois: 600 },
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

  // 2 bis. Un dossier d'une AUTRE destination (2026-09-23) :
  //    users/{uid}.preinscriptionsPays.<pays> = { plan, expiresAt }, écrit
  //    par le webhook (functions/lib/achat.js). Mêmes offres, mêmes
  //    plafonds que la France. Le plus haut rang actif l'emporte : un
  //    compte avec un Diagnostic Maroc et un Dossier Italie a le plafond
  //    du dossier.
  const pays = userData.preinscriptionsPays && typeof userData.preinscriptionsPays === "object" ? userData.preinscriptionsPays : {};
  let meilleure = null;
  for (const entree of Object.values(pays)) {
    const plan = String((entree && entree.plan) || "").toLowerCase();
    if (!FORMULES_AVEC_FITZ.includes(plan) || !OFFRES_PREINSCRIPTION.includes(plan)) continue;
    if (expire(entree.expiresAt, maintenant)) continue;
    if (!meilleure || OFFRES_PREINSCRIPTION.indexOf(plan) > OFFRES_PREINSCRIPTION.indexOf(meilleure)) meilleure = plan;
  }
  if (meilleure) return meilleure;

  // 3. Le Pass Fitz Express, sans formule. Testé APRÈS les formules :
  //    quelqu'un qui a les deux doit avoir le plafond de sa formule.
  if (userData.fitzExpressExpiresAt && !expire(userData.fitzExpressExpiresAt, maintenant)) {
    return "fitzExpress";
  }

  return null;
}

/**
 * La formule de DÉROGATION d'un compte sans formule payante, ou null.
 * Miroir de js/access-guard.js : le propriétaire (document admins/{uid}
 * avec isActive === true) gagne sur tout ; testerAccess vient ensuite.
 * PURE : le lecteur Firestore (functions/fitz.js) fournit les deux
 * booléens, ce module ne lit rien.
 */
function formuleDeDerogation({ adminActif, testerAccess } = {}) {
  if (adminActif === true) return "proprietaire";
  if (testerAccess === true) return "testeur";
  return null;
}

/**
 * ============================================================
 * LE PLAFOND GLOBAL DU SITE ET LE ROBINET (lot BARÈME, 2026-09-19)
 * ============================================================
 *
 * Tous les plafonds ci-dessus sont PAR COMPTE. Additionnés, ils ne
 * bornent rien : cent comptes gratuits valent cent fois le plafond
 * gratuit, et rien dans le code ne disait « stop » avant que le crédit
 * Anthropic ne soit vide. Tant que personne ne pouvait s'inscrire,
 * c'était théorique. Le jour où le diagnostic gratuit s'ouvre vraiment
 * au public, c'est ce chiffre-là qui décide de la facture.
 *
 * Le document `systeme/fitz` porte deux réglages et un compteur :
 *
 *   actif        false ferme Fitz pour TOUT LE MONDE, immédiatement
 *   plafondJour  points autorisés pour tout le site, par jour
 *   jour / pointsJour   le compteur du jour courant
 *
 * Il n'est PAS dans config/ à dessein : la règle par défaut de
 * firestore.rules refuse tout ce qui n'est pas nommé, donc aucun
 * navigateur ne peut le lire ni l'écrire. Il se change depuis la
 * console Firebase. Un frein de secours ne doit pas dépendre d'une page
 * web — qui peut, elle aussi, être en panne le jour où on en a besoin.
 *
 * POURQUOI UN ROBINET ET PAS LA CONSTANTE `MODE`. js/ai/ai-config.js
 * porte MODE = "simule" | "passerelle". La basculer demande une
 * modification, npm test, un commit, un déploiement et une heure de
 * cache : vingt minutes pour serrer un frein à main. `actif: false` agit
 * au prochain appel, sans rien déployer.
 *
 * CE QUE LE ROBINET NE FAIT PAS : il ne bascule PAS le site sur le
 * simulateur. Servir à un client payant une lettre fabriquée localement,
 * sans le lui dire, serait un mensonge — et le refus, lui, est honnête.
 * Il refuse, avec le code QUOTA_FOURNISSEUR : « le problème est de notre
 * côté, pas du vôtre », ce qui est exactement vrai.
 *
 * PURE : aucun Firestore ici. Le lecteur (functions/fitz.js) fournit le
 * document et la date, ce module rend un verdict — comme formuleActive
 * et formuleDeDerogation.
 */

/* Valeur de repli quand `plafondJour` n'est pas écrit dans le document.

   200 points ≈ 1 000 à 2 000 F CFA par jour au coût mesuré du 2026-09-19.
   Une journée ordinaire est très en dessous ; une boucle ou un abus y
   heurte un mur en quelques heures au lieu de vider le crédit en une
   heure. Ce n'est PAS un budget, c'est un mur : le régler se fait dans
   le document, en cinq secondes, sans déploiement. */
const PLAFOND_GLOBAL_JOUR = 200;

/**
 * Le verdict du site entier, avant celui du compte.
 *
 * @param {Object} ctx
 * @param {Object} ctx.systeme      document systeme/fitz (ou {})
 * @param {string} ctx.jourCourant  clé ISO du jour (AAAA-MM-JJ)
 * @param {number} ctx.points       points que cet appel veut réserver
 */
function verdictSysteme({ systeme = {}, jourCourant = "", points = 0 } = {}) {
  if (systeme && systeme.actif === false) {
    return { ok: false, portee: "robinet" };
  }

  const declare = Number(systeme && systeme.plafondJour);
  const plafond = Number.isFinite(declare) && declare > 0 ? declare : PLAFOND_GLOBAL_JOUR;

  // Un compteur qui porte la date d'hier vaut zéro : le jour tourne tout
  // seul, personne n'a à le remettre à zéro à minuit.
  const deja = systeme && systeme.jour === jourCourant ? Number(systeme.pointsJour) || 0 : 0;

  if (deja + points > plafond) {
    return { ok: false, portee: "global", plafond, deja };
  }

  return { ok: true, plafond, pointsJour: deja + points };
}

function plafondsDe(formule) {
  return PLAFONDS[formule] || PLAFOND_PAR_DEFAUT;
}

module.exports = { FORMULES_AVEC_FITZ, OFFRES_PREINSCRIPTION, PLAFONDS, PLAFOND_PAR_DEFAUT, PLAFOND_GLOBAL_JOUR, formuleActive, formuleDeDerogation, plafondsDe, verdictSysteme };
