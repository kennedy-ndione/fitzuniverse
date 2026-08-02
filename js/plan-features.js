/**
* ============================================================
* ScholarBridge — catalogue des fonctionnalités pilotables par formule
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
* PHILOSOPHIE (verrouillée 2026-07-30) : les trois formules payantes
* donnent TOUTES un accès à 100% des outils Fitz — aucun outil n'est
* réservé à une formule supérieure. DEFAULT_FEATURE_CONFIG reflète
* cette règle : chaque fonctionnalité est vraie pour essentiel,
* accompagnement et premium à l'identique. La seule vraie différence
* entre les formules est `maxAccompaniedApplications` (voir
* pricing-plans.js), pas une des fonctionnalités listées ici.
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

export const PLAN_ORDER = ["gratuit", "essentiel", "accompagnement", "premium"];

export const PLAN_LABELS = {
gratuit: "Gratuit",
essentiel: "Essentiel",
accompagnement: "Avancé",
premium: "Premium"
};

export const FEATURE_CATALOG = [
{ key: "applications", label: "Suivi des candidatures", description: "Suivi par étapes des candidatures déposées, avec rappels de vérification sur les portails universitaires." },
{ key: "documents", label: "Checklists & documents", description: "Suivi des documents attendus pour chaque candidature." },
{ key: "ai_chat", label: "Questions à Fitz", description: "Chat ponctuel avec Fitz pour des questions sur la candidature." },
{ key: "ai_letter", label: "Lettre de motivation", description: "Relecture et amélioration de la lettre de motivation par Fitz." },
{ key: "ai_check", label: "Vérification du dossier", description: "Analyse de cohérence des documents avant envoi." },
{ key: "ai_email", label: "E-mails Fitz", description: "Génération d'e-mails professionnels pour les candidatures." },
{ key: "ai_translate", label: "Traduction de documents", description: "Traduction des documents pour les candidatures internationales." },
{ key: "compress", label: "Compression de fichiers", description: "Réduction de la taille d'un PDF ou d'une image à la taille demandée par un portail universitaire." }
];

export const DEFAULT_FEATURE_CONFIG = {
applications: { gratuit: false, essentiel: true, accompagnement: true, premium: true },
documents: { gratuit: false, essentiel: true, accompagnement: true, premium: true },
ai_chat: { gratuit: false, essentiel: true, accompagnement: true, premium: true },
ai_letter: { gratuit: false, essentiel: true, accompagnement: true, premium: true },
ai_check: { gratuit: false, essentiel: true, accompagnement: true, premium: true },
ai_email: { gratuit: false, essentiel: true, accompagnement: true, premium: true },
ai_translate: { gratuit: false, essentiel: true, accompagnement: true, premium: true },
compress: { gratuit: false, essentiel: true, accompagnement: true, premium: true }
};

// Fusionne les valeurs par défaut ci-dessus avec le document Firestore
// "config/planFeatures" (rawConfig = données du document, ou null/
// undefined si le document n'existe pas encore ou n'a pas pu être lu).
// Ne modifie jamais DEFAULT_FEATURE_CONFIG lui-même.
export function resolveFeatureFlags(rawConfig) {

const merged = {};

FEATURE_CATALOG.forEach(({ key }) => {

const defaults = DEFAULT_FEATURE_CONFIG[key];
const overrides = (rawConfig && rawConfig.features && rawConfig.features[key]) || {};

merged[key] = { ...defaults, ...overrides };

});

return merged;

}
