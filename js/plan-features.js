/**
* ============================================================
* Fitz — catalogue des fonctionnalités pilotables par formule
* ============================================================
*
* Source unique de vérité pour le Module 4 du Control Center (Gestion
* des formules) : la liste des fonctionnalités que l'administrateur
* peut activer/désactiver par formule, partagée entre :
*  - dashboard.js (étudiant) : verrouille/déverrouille les outils
*  - admin/plans.js : affiche la grille de bascule
*
* Ce fichier ne fait AUCUN appel Firebase — uniquement des données et
* une fonction de fusion pures, importables des deux côtés.
*
* PHILOSOPHIE (verrouillée 2026-07-30, étendue 2026-08-02) : toutes les
* offres payantes donnent un accès à 100% des outils Fitz — aucun outil
* n'est réservé à une offre supérieure. DEFAULT_FEATURE_CONFIG reflète
* cette règle : chaque fonctionnalité est vraie à l'identique pour les
* six offres payantes.
*
* Attention à ne pas confondre deux choses : la règle ci-dessus (accès
* aux OUTILS) reste vraie, mais la règle "la seule différence entre les
* formules est le quota de candidatures" a été abandonnée le 2026-08-02
* — Avancé et Premium ajoutent désormais de vrais services humains
* (relecture, prépa entretien, aide visa, réponse prioritaire). Ces
* services ne sont pas pilotables ici : ce fichier ne modélise que les
* outils Fitz. Voir pricing-plans.js pour la grille complète.
*
* EXCEPTION "advisor" (ajoutée 2026-08-07, refonte du dashboard par
* formule) : ce n'est pas un outil Fitz, mais l'accès à la messagerie
* avec un conseiller humain (advisor.html) suit exactement le même
* mécanisme booléen par formule que les 8 outils ci-dessous — inutile
* d'inventer un système parallèle pour une seule fonctionnalité de
* plus. Vrai seulement pour signature-focus/signature.
*
* "gratuit" (ajouté 2026-07-30, audit d'harmonisation) : palier réel
* pour tout compte sans abonnement payant actif — 0 outil Fitz, 0
* candidature accompagnée. Avant ce palier, resolvePlan() (voir
* js/access-guard.js) faisait retomber ces comptes sur "essentiel", ce
* qui donnait 100% des outils payants gratuitement tant qu'aucun vrai
* paiement n'existait. Le diagnostic gratuit, les universités et les
* bourses restent 100% publics et ne dépendent d'aucun palier — seule
* la porte d'entrée vers les outils Fitz et le suivi de candidatures
* est concernée ici.
*
* RÈGLE PERMANENTE : toute nouvelle fonctionnalité pilotable doit être
* ajoutée ici (FEATURE_CATALOG + une entrée dans
* DEFAULT_FEATURE_CONFIG), jamais en dur dans une page HTML.
* ============================================================
*/

// L'ORDRE COMPTE : ce tableau est une échelle croissante, pas une simple
// liste. nextPlanId() renvoie l'élément suivant pour proposer la montée
// en gamme, et unlockingPlans() prend le premier élément débloquant une
// fonctionnalité comme cible d'upsell — les deux excluent désormais les
// offres `deprecated` (voir js/access-guard.js et la convention dans
// pricing-plans.js). L'ordre suit le prix croissant de la grille
// commerciale (voir pricing-plans.js) : 0 → 12 000 (déprécié) → 29 000 →
// 75 000 → 80 000 (déprécié) → 150 000 → 250 000 FCFA (grille du 2026-08-29).
//
// `fitzExpress` n'y figure volontairement pas : c'est un pass ponctuel,
// pas une formule — il ne touche jamais le champ `plan` et son accès est
// résolu séparément par hasFitzExpressAccess() (js/access-guard.js).
//
// GRILLE A (2026-09-07) : `essentiel-4` et `conseiller-6` remplacent
// `essentiel` et `signature-focus` à la vente ; `accompagnement` et
// `signature` sont retirées. Chaque nouvelle offre se place JUSTE AVANT
// l'ancienne qu'elle remplace (même prix, quota plus bas) : l'upsell
// d'un ancien client ne lui propose ainsi jamais une marche plus basse,
// et le serveur (RANG, functions/lib/achat.js — miroir de cet ordre) ne
// rétrograde jamais un compte. Les anciens identifiants RESTENT : ils
// sont la valeur de `plan` des comptes existants.
export const PLAN_ORDER = [
"gratuit",
"premier-dossier",
"essentiel-4",
"essentiel",
"accompagnement",
"premium",
"conseiller-6",
"signature-focus",
"signature"
];

// LIBELLÉS D'INTERFACE (règle arrêtée 2026-08-02).
// PLAN_LABELS est la source pour tout ce qui est INTERFACE : badges,
// tableaux, panneau d'administration, messages de quota, upsell du
// tableau de bord. Les noms y sont courts pour tenir dans une colonne
// ou une pastille — d'où "Signature", sans le nom de l'assistant devant.
//
// Les noms longs de marque vivent dans SCHOLARBRIDGE_PLANS[...].label
// (pricing-plans.js) et sont réservés aux surfaces MARKETING : page
// offres, page de paiement, e-mails.
//
// En cas de doute : si l'utilisateur est en train d'utiliser le
// produit, c'est PLAN_LABELS ; s'il est en train de le choisir ou de
// l'acheter, c'est le label de pricing-plans.js.
// essentiel/"signature-focus" renommés "Standard"/"Renforcé" par la grille
// 2026-08-15 (pricing-plans.js) — mis à jour ici aussi pour qu'un même
// compte ne voie jamais deux noms différents pour sa propre formule
// (badge sidebar, panneau admin) selon la page. `premium`/"premier-dossier"
// gardent leur nom historique : dépréciées, jamais renommées.
// Renommage du 2026-08-29 (série « Forfait » de pricing-plans.js) :
// Standard→Essentiel, Avancé→Ambition, Renforcé→Conseiller — sans le
// préfixe « Forfait » ici, même logique que "Signature" sans "Fitz".
export const PLAN_LABELS = {
gratuit: "Gratuit",
"premier-dossier": "Premier Dossier",
// Grille A : le nom commercial est conservé — c'est l'identifiant qui
// change (voir pricing-plans.js, « ne jamais renommer un identifiant »).
"essentiel-4": "Essentiel",
essentiel: "Essentiel",
accompagnement: "Ambition",
premium: "Premium",
"conseiller-6": "Conseiller",
"signature-focus": "Conseiller",
signature: "Signature"
};

// ==========================================================
// GRILLE B — le second forfait, PRÉINSCRIPTION (2026-09-07). Un ordre
// et des libellés SÉPARÉS de PLAN_ORDER : un compte porte au plus une
// formule bourse ET au plus une offre préinscription, et ses droits
// sont l'UNION des deux (voir decideVerrou et resolveFeatureFlags).
// ==========================================================
export const PLAN_PREINSCRIPTION_ORDER = ["diagnostic-france", "dossier-france", "dossier-france-conseiller"];

export const PLAN_PREINSCRIPTION_LABELS = {
"diagnostic-france": "Diagnostic France",
"dossier-france": "Dossier France",
"dossier-france-conseiller": "Dossier France + Conseiller"
};

export const FEATURE_CATALOG = [
{ key: "applications", label: "Suivi des candidatures", description: "Suivi par étapes des candidatures déposées, avec rappels de vérification sur les portails universitaires." },
{ key: "documents", label: "Checklists & documents", description: "Suivi des documents attendus pour chaque candidature." },
{ key: "ai_chat", label: "Questions à Fitz", description: "Chat ponctuel avec Fitz pour des questions sur la candidature." },
{ key: "ai_letter", label: "Lettre de motivation", description: "Relecture et amélioration de la lettre de motivation par Fitz." },
{ key: "ai_check", label: "Vérification du dossier", description: "Analyse de cohérence des documents avant envoi." },
{ key: "ai_email", label: "E-mails Fitz", description: "Génération d'e-mails professionnels pour les candidatures." },
{ key: "ai_translate", label: "Traduction de documents", description: "Traduction des documents pour les candidatures internationales." },
{ key: "compress", label: "Compression de fichiers", description: "Réduction de la taille d'un PDF ou d'une image à la taille demandée par un portail universitaire." },
{ key: "interview_prep", label: "Préparation aux entretiens", description: "Banque de questions par type de bourse et checklist de préparation avant un entretien." },
{ key: "advisor", label: "Mon conseiller", description: "Messagerie avec un conseiller humain dédié à l'accompagnement." },
// Messagerie FitzUniverse (2026-09-02) : le canal officiel
// admin ↔ étudiant, signé FitzUniverse. Tous les étudiants VOIENT les
// messages reçus (cloche) ; ce drapeau contrôle le droit de RÉPONDRE.
// Décision utilisateur du 2026-09-02 : fermé au plan Gratuit, ouvert à
// toutes les formules payantes — RESSERRÉ par la grille A (2026-09-07),
// voir DEFAULT_FEATURE_CONFIG.student_messaging.
{ key: "student_messaging", label: "Messagerie FitzUniverse", description: "Répondre à l'équipe FitzUniverse depuis la cloche de messages de l'espace étudiant." },
// WhatsApp direct (2026-09-02) : décision utilisateur — la discussion
// WhatsApp est STRICTEMENT réservée à la formule Signature. Contrôle
// tous les liens wa.me d'accompagnement (accueil, offres, conseiller).
// Seule exception assumée : le bouton d'ACHAT de la formule Signature
// sur offers.html (canal commercial, visible de tous).
{ key: "whatsapp_direct", label: "WhatsApp direct", description: "Échanges directs sur WhatsApp avec l'équipe — réservé à Signature." },
// Grille B (2026-09-07) : le Diagnostic France — de l'arithmétique sur
// des seuils publiés, aucune IA. Ouvert par les trois offres
// préinscription, par aucune formule bourse.
{ key: "diagnostic_france", label: "Diagnostic France", description: "Ressources, droits, plafond d'exonération et frais de dossier contre les seuils publiés — avant de payer Campus France." },
// Grille A (2026-09-07) : « Signaler un problème » — service
// après-vente (problème technique, paiement, erreur du site), ouvert à
// TOUTE formule payante, Pass Découverte compris. Ce n'est PAS un
// accompagnement : aucune question de dossier, aucune relecture n'y
// est traitée — sinon la porte de service recréerait ce que la
// messagerie réserve. Jamais confondu avec student_messaging.
{ key: "support_ticket", label: "Signaler un problème", description: "Service après-vente : un problème technique, un paiement, une erreur du site — pour toute formule payante." }
];

// Toute offre payante donne 100% des outils Fitz — y compris Premier
// Dossier (offre d'entrée) et les deux offres d'accompagnement humain,
// ajoutées ici le 2026-08-02. Seul "gratuit" reste à false partout.
// Ce qui distingue les offres entre elles est le nombre de candidatures
// accompagnées et le niveau de service humain (voir pricing-plans.js),
// jamais l'accès aux outils listés ci-dessous.
// Grille A (2026-09-07) : `essentiel-4` et `conseiller-6` ajoutées sur
// chaque ligne ; les anciens identifiants gardent EXACTEMENT leurs
// valeurs (règle d'or : un client existant ne perd rien).
export const DEFAULT_FEATURE_CONFIG = {
applications: { gratuit: false, "premier-dossier": true, "essentiel-4": true, essentiel: true, accompagnement: true, premium: true, "conseiller-6": true, "signature-focus": true, signature: true },
documents: { gratuit: false, "premier-dossier": true, "essentiel-4": true, essentiel: true, accompagnement: true, premium: true, "conseiller-6": true, "signature-focus": true, signature: true },
ai_chat: { gratuit: false, "premier-dossier": true, "essentiel-4": true, essentiel: true, accompagnement: true, premium: true, "conseiller-6": true, "signature-focus": true, signature: true },
ai_letter: { gratuit: false, "premier-dossier": true, "essentiel-4": true, essentiel: true, accompagnement: true, premium: true, "conseiller-6": true, "signature-focus": true, signature: true },
ai_check: { gratuit: false, "premier-dossier": true, "essentiel-4": true, essentiel: true, accompagnement: true, premium: true, "conseiller-6": true, "signature-focus": true, signature: true },
ai_email: { gratuit: false, "premier-dossier": true, "essentiel-4": true, essentiel: true, accompagnement: true, premium: true, "conseiller-6": true, "signature-focus": true, signature: true },
ai_translate: { gratuit: false, "premier-dossier": true, "essentiel-4": true, essentiel: true, accompagnement: true, premium: true, "conseiller-6": true, "signature-focus": true, signature: true },
compress: { gratuit: false, "premier-dossier": true, "essentiel-4": true, essentiel: true, accompagnement: true, premium: true, "conseiller-6": true, "signature-focus": true, signature: true },
// Décision validée le 2026-08-10 : même palier que le reste du lot
// "dossier de candidature enrichi" (Essentiel+, pas de palier dédié
// malgré le "Premium en préparation" affiché jusqu'ici sur le
// placeholder dashboard — copie mise à jour en conséquence).
interview_prep: { gratuit: false, "premier-dossier": true, "essentiel-4": true, essentiel: true, accompagnement: true, premium: true, "conseiller-6": true, "signature-focus": true, signature: true },
// Seule fonctionnalité de ce fichier qui N'EST PAS un outil Fitz — accès
// à un conseiller humain, vrai uniquement pour les offres "human" de
// pricing-plans.js. Voir la note en tête de fichier.
advisor: { gratuit: false, "premier-dossier": false, "essentiel-4": false, essentiel: false, accompagnement: false, premium: false, "conseiller-6": true, "signature-focus": true, signature: true },
// MESSAGERIE (grille A, 2026-09-07) — deux règles selon le parcours.
// Côté bourses, réservée au Forfait Conseiller (conseiller-6) : une
// bourse se décide par un jury, l'échange n'a pas la valeur directe
// qu'il a en préinscription (une pièce mal formatée se répare). Retirée
// des offres mises en vente par ce lot (essentiel-4) et de
// premier-dossier ; les DÉTENTEURS d'essentiel/accompagnement/premium/
// signature-focus/signature la CONSERVENT. Côté préinscription : les
// trois offres (PREINSCRIPTION_FEATURE_CONFIG). Toute formule payante
// garde « Signaler un problème » (support_ticket) — voie séparée.
student_messaging: { gratuit: false, "premier-dossier": false, "essentiel-4": false, essentiel: true, accompagnement: true, premium: true, "conseiller-6": true, "signature-focus": true, signature: true },
// Grille A : whatsapp_direct n'est attachée à AUCUNE offre en vente —
// seuls les détenteurs de Signature (dépréciée) la conservent.
whatsapp_direct: { gratuit: false, "premier-dossier": false, "essentiel-4": false, essentiel: false, accompagnement: false, premium: false, "conseiller-6": false, "signature-focus": false, signature: true },
diagnostic_france: { gratuit: false, "premier-dossier": false, "essentiel-4": false, essentiel: false, accompagnement: false, premium: false, "conseiller-6": false, "signature-focus": false, signature: false },
support_ticket: { gratuit: false, "premier-dossier": true, "essentiel-4": true, essentiel: true, accompagnement: true, premium: true, "conseiller-6": true, "signature-focus": true, signature: true }
};

// Les DROITS DES OFFRES PRÉINSCRIPTION (grille B). Fusionnés dans les
// drapeaux par resolveFeatureFlags() : un drapeau vaut true pour un
// compte si SA formule bourse OU SON offre préinscription l'ouvre.
//   diagnostic-france : la page du diagnostic uniquement — un pass de
//                       diagnostic, pas un accompagnement : AUCUN outil.
//   dossier-france    : candidatures préinscription (quota 7), documents,
//                       préparation aux entretiens, messagerie, ET LES
//                       CINQ OUTILS FITZ. PAS advisor.
//   + conseiller      : idem + advisor.
//
// LOT PRÉ-FITZ (2026-09-10) — LA RÈGLE A CHANGÉ, ET VOICI POURQUOI.
// Jusqu'ici : « aucun outil Fitz (le parcours n'a pas d'étape Fitz) ».
// C'était une décision prise AVANT que la procédure soit documentée,
// quand la préinscription était vue comme purement procédurale. Les
// lots S1b/S2 ont lu les pages officielles, et elles disent l'inverse.
// Campus France Côte d'Ivoire, étape des vœux (vérifiée le 2026-09-08,
// https://www.ivoire.campusfrance.org/je-veux-m-inscrire-en-licence-23-master-12-cycle-ingenieur) :
// « Rédigez pour chaque spécialité une lettre de motivation courte, de
// quatre à cinq lignes, sans faute d'orthographe et adaptée à la
// formation ». Sept vœux = sept lettres. Plus les courriels aux
// établissements, la traduction des pièces, et l'entretien pédagogique.
// Un client à 75 000 F recevait cinq outils de moins qu'un client à
// 15 000 F. NE PAS « re-corriger » ceci en croyant à une régression :
// les outils produisent du contenu de PRÉINSCRIPTION (js/ai/prompts.js
// et js/ai/simulated-responses.js lisent le parcours), pas de bourse.
export const PREINSCRIPTION_FEATURE_CONFIG = {
applications: { "diagnostic-france": false, "dossier-france": true, "dossier-france-conseiller": true },
documents: { "diagnostic-france": false, "dossier-france": true, "dossier-france-conseiller": true },
ai_chat: { "diagnostic-france": false, "dossier-france": true, "dossier-france-conseiller": true },
ai_letter: { "diagnostic-france": false, "dossier-france": true, "dossier-france-conseiller": true },
ai_check: { "diagnostic-france": false, "dossier-france": true, "dossier-france-conseiller": true },
ai_email: { "diagnostic-france": false, "dossier-france": true, "dossier-france-conseiller": true },
ai_translate: { "diagnostic-france": false, "dossier-france": true, "dossier-france-conseiller": true },
compress: { "diagnostic-france": false, "dossier-france": true, "dossier-france-conseiller": true },
interview_prep: { "diagnostic-france": false, "dossier-france": true, "dossier-france-conseiller": true },
advisor: { "diagnostic-france": false, "dossier-france": false, "dossier-france-conseiller": true },
// Grille A : la messagerie est incluse dans les TROIS offres
// préinscription, Diagnostic France compris — un dossier bloqué se
// débloque, l'échange a une valeur directe.
student_messaging: { "diagnostic-france": true, "dossier-france": true, "dossier-france-conseiller": true },
whatsapp_direct: { "diagnostic-france": false, "dossier-france": false, "dossier-france-conseiller": false },
diagnostic_france: { "diagnostic-france": true, "dossier-france": true, "dossier-france-conseiller": true },
support_ticket: { "diagnostic-france": true, "dossier-france": true, "dossier-france-conseiller": true }
};

/**
* La décision de verrou, PURE (testable sans Firebase) — l'UNION des deux
* forfaits. Verrouillé seulement si la formule bourse ne l'ouvre pas ET
* que l'offre préinscription ne l'ouvre pas non plus. js/access-guard.js
* (isFeatureLocked) délègue ici.
*/
export function decideVerrou({ planId, planPreinscriptionId = "", featureFlags, featureKey, testerAccess = false, hasFitzExpress = false }) {
if (testerAccess) return false;
if (hasFitzExpress && featureKey === "ai_chat") return false;
// Grille A : le Pass Découverte est une formule payante — il a droit au
// service après-vente, et à rien d'autre de plus.
if (hasFitzExpress && featureKey === "support_ticket") return false;
const flags = featureFlags && featureFlags[featureKey];
if (!flags) return false;
if (flags[planId] !== false) return false;
if (planPreinscriptionId && flags[planPreinscriptionId] === true) return false;
return true;
}

/**
* LE DROIT « MON CONSEILLER », EN UN SEUL ENDROIT (2026-09-08).
*
* Il en existait TROIS copies — js/app-shell.js, js/dual-shell.js et
* dashboard.js — chacune portant le commentaire « à garder synchronisées
* si la règle change ». Elles ne l'ont pas été : la règle a changé deux
* fois (conseiller-6 en grille A, dossier-france-conseiller en grille B)
* et les trois copies lisaient encore la seule formule bourse. Un client
* ayant payé un conseiller ne voyait pas la section, alors que
* firestore.rules:278 l'autorisait déjà à lui écrire.
*
* La règle, une fois pour toutes : ouvert si l'accès test est actif, ou
* si l'une des DEUX offres — bourse ou préinscription — le déclare
* explicitement vrai. Le `=== true` est délibéré et diffère de
* decideVerrou(), qui ouvre sur `!== false` : une section entière qui
* apparaît parce qu'une formule n'a pas été listée serait une fuite,
* pas une tolérance. Ici, ce qui n'est pas explicitement ouvert est
* fermé.
*
* @param {{planId?:string, planPreinscriptionId?:string, featureFlags?:Object, testerAccess?:boolean}} args
*/
export function advisorOuvert({ planId = "", planPreinscriptionId = "", featureFlags, testerAccess = false } = {}) {
const flags = featureFlags && featureFlags.advisor;
if (!flags) return false;
if (testerAccess) return true;
return flags[planId] === true || (!!planPreinscriptionId && flags[planPreinscriptionId] === true);
}

// ==========================================================
// QUOTA DE CANDIDATURES ACCOMPAGNÉES — décision pure, testable
// ==========================================================
// `quota` provient de SCHOLARBRIDGE_PLANS[...].maxAccompaniedApplications
// (pricing-plans.js). Cette logique vit ici plutôt qu'en ligne dans
// applications.js pour être vérifiable sans navigateur, sans Firebase et
// sans écrire dans Firestore — voir test/plan-features.test.mjs.
//
// Trois cas, dans cet ordre :
//   - Infinity            → illimité (Signature), ne bloque jamais
//   - nombre fini > 0     → plafond réel de l'offre
//   - null / undefined / 0 → aucune offre active : ne bloque pas ICI,
//     c'est requireFeature() qui interdit l'accès à la page en amont.
//     Le `> 0` est explicite pour qu'un futur quota à 0 ne bloque pas
//     dès la première candidature.

export function isUnlimitedQuota(quota) {
return quota === Infinity;
}

export function isQuotaReached(quota, currentCount) {
return Number.isFinite(quota) && quota > 0 && currentCount >= quota;
}

// Fusionne les valeurs par défaut ci-dessus avec le document Firestore
// "config/planFeatures" (rawConfig = données du document, ou null/
// undefined si le document n'existe pas encore ou n'a pas pu être lu).
// Ne modifie jamais DEFAULT_FEATURE_CONFIG lui-même.
export function resolveFeatureFlags(rawConfig) {

const merged = {};

FEATURE_CATALOG.forEach(({ key }) => {

const defaults = { ...DEFAULT_FEATURE_CONFIG[key], ...(PREINSCRIPTION_FEATURE_CONFIG[key] || {}) };
const overrides = (rawConfig && rawConfig.features && rawConfig.features[key]) || {};

merged[key] = { ...defaults, ...overrides };

});

return merged;

}

// ==========================================================
// FORMULES RÉSOLUES, ET ESPACE (déplacé de js/access-guard.js, S4)
// ==========================================================

// Un abonnement expiré doit se comporter exactement comme l'absence
// d'abonnement — les deux cas retombent aujourd'hui sur "essentiel"
// (voir la note historique ci-dessous). Ce n'est PAS un nouveau choix :
// c'est le même comportement déjà en place, appliqué en plus au cas de
// l'expiration pour rester cohérent. planExpiresAt est une chaîne ISO
// (ex. "2026-09-15"), écrite par le futur backend de paiement — aucun
// compte n'en a aujourd'hui, ce contrôle est donc actuellement inerte.
function isPlanExpired(userData) {

if (!userData || !userData.planExpiresAt) return false;

const expiry = new Date(userData.planExpiresAt);

return !isNaN(expiry) && expiry.getTime() < Date.now();

}

// RÉSOLU (2026-07-30, audit d'harmonisation) : tout compte sans formule
// payante valide — y compris un compte dont la formule a expiré —
// retombe désormais sur "gratuit" (voir js/plan-features.js), qui ne
// débloque aucun outil Fitz ni candidature accompagnée. C'était
// auparavant "essentiel" par défaut, ce qui donnait 100% des outils
// payants à tout le monde tant qu'aucun vrai paiement n'existait.
export function resolvePlan(userData) {
const raw = String((userData && userData.plan) || "").toLowerCase();
if (!PLAN_ORDER.includes(raw)) return "gratuit";
return isPlanExpired(userData) ? "gratuit" : raw;
}

// Fitz Express (pricing-plans.js) n'est PAS une formule : c'est un pass
// indépendant qui ne touche jamais `plan`. Un compte peut l'avoir actif
// quelle que soit sa formule (y compris aucune). fitzExpressExpiresAt
// suit la même convention que planExpiresAt (chaîne ISO).
export function hasFitzExpressAccess(userData) {

if (!userData || !userData.fitzExpressExpiresAt) return false;

const expiry = new Date(userData.fitzExpressExpiresAt);

return !isNaN(expiry) && expiry.getTime() >= Date.now();

}

// ==========================================================
// LE PASS DÉCOUVERTE SEUL (lot ACCEPTATION, partie 4 — 2026-09-11)
// ==========================================================
// Décision 6 de Charles : le Pass Découverte ne mène qu'à « Discuter
// avec Fitz ». Rien d'autre. Un compte qui n'a QUE le Pass appartenait
// à l'espace « aucun » : dashboard.html lui disait « pas d'accompagnement
// actif », sa pastille disait « Gratuit », sa barre d'onglets lui
// proposait Parcours, Candidatures et Documents qu'il n'a pas achetés,
// et la garde d'espace le laissait ouvrir espace-bourse.html.
//
// UNE SEULE DÉFINITION, pure : vraie quand les quatre conditions sont
// réunies — Pass actif, aucune formule bourse active, aucune offre
// préinscription active, pas de testerAccess. Accepte une SESSION
// (resolveSession) ou un document users/{uid} brut, comme
// resoudreEspace.

/** Le nom du produit. « Fitz Express » n'est plus le nom de rien ; l'identifiant `fitzExpress` reste. */
export const PASS_LABEL = "Pass Découverte";

export function passSeul(source) {

if (!source || typeof source !== "object") return false;
if (source.testerAccess === true) return false;

const pass = source.hasFitzExpress !== undefined ? source.hasFitzExpress === true : hasFitzExpressAccess(source);
if (!pass) return false;

const bourse = source.planId !== undefined ? source.planId : resolvePlan(source);
const preinscription = source.planPreinscriptionId !== undefined ? source.planPreinscriptionId : resolvePlanPreinscription(source);

return (!bourse || bourse === "gratuit") && !preinscription;

}

/**
* Un Pass TERMINÉ : le compte porte un fitzExpressExpiresAt passé, et
* plus aucune formule qui ouvre le chat. Rend la date d'expiration
* (Date), ou null.
*/
export function passTermine(userData, maintenant = Date.now()) {

if (!userData || !userData.fitzExpressExpiresAt) return null;

const expiry = new Date(userData.fitzExpressExpiresAt);
if (isNaN(expiry) || expiry.getTime() >= maintenant) return null;

const bourse = resolvePlan(userData);
if (bourse && bourse !== "gratuit") return null;

const pre = resolvePlanPreinscription(userData);
if (pre === "dossier-france" || pre === "dossier-france-conseiller") return null;

return expiry;

}

/**
* « 9 jours restants », « moins d'1 jour restant » — le même calcul que
* la bannière des hubs (renderFitzExpressBanner, dashboard.js). Rend ""
* sans Pass actif.
*/
export function joursRestantsPass(fitzExpressExpiresAt, maintenant = Date.now()) {

if (!fitzExpressExpiresAt) return "";

const expiry = new Date(fitzExpressExpiresAt);
if (isNaN(expiry) || expiry.getTime() < maintenant) return "";

const jours = Math.max(0, Math.ceil((expiry.getTime() - maintenant) / 86400000));

return jours <= 1 ? "moins d'1 jour restant" : `${jours} jours restants`;

}

// Grille B (2026-09-07) : le second forfait, PRÉINSCRIPTION. Même règle
// que resolvePlan : hors vocabulaire ou expiré = aucune offre ("").
export function resolvePlanPreinscription(userData) {

const raw = String((userData && userData.planPreinscription) || "").toLowerCase();

if (!PLAN_PREINSCRIPTION_ORDER.includes(raw)) return "";

const expiry = userData.planPreinscriptionExpiresAt ? new Date(userData.planPreinscriptionExpiresAt) : null;

if (expiry && !isNaN(expiry) && expiry.getTime() < Date.now()) return "";

return raw;

}

// Une offre `deprecated: true` (pricing-plans.js) reste dans PLAN_ORDER
// pour que les comptes qui la détiennent déjà continuent de fonctionner,
// mais ne doit plus jamais être SUGGÉRÉE à l'achat — ni comme prochain
// palier (nextPlanId, panneau coach du tableau de bord), ni comme cible
// de déverrouillage d'une fonctionnalité (unlockingPlans, CTA "Choisir
// ma formule" un peu partout). `window.SCHOLARBRIDGE_PLANS` peut être
// absent sur une page qui ne charge pas pricing-plans.js (ex. panneau
// admin) : dans ce cas rien n'est filtré, comportement inchangé.
function isSellablePlan(planId) {
const plan = typeof SCHOLARBRIDGE_PLANS !== "undefined" && SCHOLARBRIDGE_PLANS[planId];
return !plan || plan.deprecated !== true;
}

export function nextPlanId(planId) {
const index = PLAN_ORDER.indexOf(planId);
if (index === -1) return null;
for (let i = index + 1; i < PLAN_ORDER.length; i++) {
if (isSellablePlan(PLAN_ORDER[i])) return PLAN_ORDER[i];
}
return null;
}

// `espace` ajouté au lot S4 : une fonctionnalité purement PRÉINSCRIPTION
// (diagnostic_france) n'est ouverte par aucune formule de PLAN_ORDER. La
// fonction ne trouvait donc rien et l'appelant renvoyait sur une page
// d'offres nue — on montrait la porte des bourses à quelqu'un venu
// acheter un dossier France. On cherche maintenant dans la grille de
// l'espace concerné.
export function unlockingPlans(planId, flags, espace = "") {
if (!flags) return [];
if (espace === "preinscription") return PLAN_PREINSCRIPTION_ORDER.filter((p) => flags[p]);
const bourses = PLAN_ORDER.filter((p) => p !== planId && flags[p] && isSellablePlan(p));
// Sans espace déclaré, on garde le comportement d'avant — et, s'il n'y
// a rien côté bourse, on regarde quand même côté préinscription plutôt
// que de ne rien proposer.
return bourses.length ? bourses : PLAN_PREINSCRIPTION_ORDER.filter((p) => flags[p]);
}

// ==========================================================
// L'ESPACE — l'identité d'un client, pas un filtre (lot S4)
// ==========================================================
//
// Le parcours était jusqu'ici un CHAMP sur une candidature (`track`),
// lu à cinq endroits, qui changeait quelques étapes. Il devient ce qui
// décide OÙ un client atterrit, ce qu'il voit, et comment on lui parle.
//
// Quatre valeurs, et une seule fonction pour les produire :
//   "bourse"          il a payé un accompagnement bourse ;
//   "preinscription"  il a payé un dossier France ;
//   "les-deux"        les deux — ou l'accès test ;
//   "aucun"           aucun accompagnement actif. Ce n'est PAS une
//                     erreur : c'est un compte gratuit connecté, qui a
//                     le droit d'atteindre son profil et son compte.
//
// L'EXPIRATION EST COMPRISE, parce que les deux formules sont résolues
// par resolvePlan() et resolvePlanPreinscription(), qui la gèrent déjà.
// Un accompagnement bourse expiré + un dossier France actif rend
// "preinscription", et surtout pas "les-deux".
//
// `testerAccess` rend "les-deux", ET C'EST DIT ICI EN TOUTES LETTRES.
// C'est la seule exception, et elle mérite d'être explicite : c'est
// exactement ce contournement qui a rendu invisible, pendant des
// semaines, tout ce qu'un vrai client voyait (le compte d'administration
// ne validait aucune restriction).
export const ESPACES = ["bourse", "preinscription", "les-deux", "aucun"];

/**
* L'ESPACE DES OUTILS (lot PRÉ-FITZ, 2026-09-10).
*
* Une page d'outil Fitz — lettre, e-mail, vérification, traduction,
* chat, entretien — sert les DEUX parcours depuis que le Dossier France
* a ses outils. Elle ne peut donc plus se déclarer « bourse » : un client
* préinscription y était ramené chez lui par la garde d'espace avant
* même d'avoir vu l'outil que son forfait lui ouvre.
*
* Ce n'est pas « aucun espace » (comme profile.html) : la page reste
* dans un espace — celui du compte — pour sa pastille, sa bascule et son
* vocabulaire. C'est une page qui appartient aux deux, et le dit.
*/
export const ESPACE_OUTILS = "outils";

/** Le hub de chaque espace. "aucun" reste sur dashboard.html, qui lui rend un accueil minimal. */
export const HUB_ESPACE = {
bourse: "espace-bourse.html",
preinscription: "espace-preinscription.html",
"les-deux": "espace-bourse.html",
aucun: "dashboard.html"
};

/**
* L'espace d'un compte. Pure : aucun DOM, aucun Firestore.
*
* Accepte une SESSION (resolveSession, formules déjà résolues) ou un
* document users/{uid} BRUT — dans ce cas les deux formules sont
* résolues ici, avec les mêmes fonctions. Les deux formes existent
* vraiment dans le dépôt : le shell a une session, un test ou un panneau
* d'administration a le document.
*
* @param {{planId?:string, planPreinscriptionId?:string, testerAccess?:boolean, plan?:string, planPreinscription?:string}} source
* @returns {"bourse"|"preinscription"|"les-deux"|"aucun"}
*/
export function resoudreEspace(source) {

if (!source || typeof source !== "object") return "aucun";

if (source.testerAccess === true) return "les-deux";

const bourse = source.planId !== undefined ? source.planId : resolvePlan(source);
const preinscription = source.planPreinscriptionId !== undefined ? source.planPreinscriptionId : resolvePlanPreinscription(source);

const aBourse = !!bourse && bourse !== "gratuit";
const aPreinscription = !!preinscription;

if (aBourse && aPreinscription) return "les-deux";
if (aBourse) return "bourse";
if (aPreinscription) return "preinscription";
return "aucun";

}

/**
* Vrai si un compte de cet espace a le droit d'ouvrir une page marquée
* `espacePage`. Une page sans espace (profil, compte, messages,
* documents) est ouverte à tous : elle n'appartient à aucun parcours.
*/
export function espaceAutorise(espaceUtilisateur, espacePage) {
if (!espacePage) return true;
// Une page d'outil appartient aux deux parcours (lot PRÉ-FITZ) : le
// DROIT à l'outil se décide ensuite, par formule (decideVerrou), pas
// par espace.
if (espacePage === ESPACE_OUTILS) return true;
if (espaceUtilisateur === "les-deux") return true;
return espaceUtilisateur === espacePage;
}
