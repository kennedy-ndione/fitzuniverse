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
// fonctionnalité comme cible d'upsell. L'ordre suit donc le prix
// croissant (voir pricing-plans.js) : 0 → 12 000 → 25 000 → 45 000 →
// 80 000 → 99 000 → 199 000 FCFA.
//
// `fitzExpress` n'y figure volontairement pas : c'est un pass ponctuel,
// pas une formule — il ne touche jamais le champ `plan` et son accès est
// résolu séparément par hasFitzExpressAccess() (js/access-guard.js).
export const PLAN_ORDER = [
"gratuit",
"premier-dossier",
"essentiel",
"accompagnement",
"premium",
"signature-focus",
"signature"
];

export const PLAN_LABELS = {
gratuit: "Gratuit",
"premier-dossier": "Premier Dossier",
essentiel: "Essentiel",
accompagnement: "Avancé",
premium: "Premium",
"signature-focus": "Signature Focus",
signature: "Signature"
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

// Toute offre payante donne 100% des outils Fitz — y compris Premier
// Dossier (offre d'entrée) et les deux offres d'accompagnement humain,
// ajoutées ici le 2026-08-02. Seul "gratuit" reste à false partout.
// Ce qui distingue les offres entre elles est le nombre de candidatures
// accompagnées et le niveau de service humain (voir pricing-plans.js),
// jamais l'accès aux outils listés ci-dessous.
export const DEFAULT_FEATURE_CONFIG = {
applications: { gratuit: false, "premier-dossier": true, essentiel: true, accompagnement: true, premium: true, "signature-focus": true, signature: true },
documents: { gratuit: false, "premier-dossier": true, essentiel: true, accompagnement: true, premium: true, "signature-focus": true, signature: true },
ai_chat: { gratuit: false, "premier-dossier": true, essentiel: true, accompagnement: true, premium: true, "signature-focus": true, signature: true },
ai_letter: { gratuit: false, "premier-dossier": true, essentiel: true, accompagnement: true, premium: true, "signature-focus": true, signature: true },
ai_check: { gratuit: false, "premier-dossier": true, essentiel: true, accompagnement: true, premium: true, "signature-focus": true, signature: true },
ai_email: { gratuit: false, "premier-dossier": true, essentiel: true, accompagnement: true, premium: true, "signature-focus": true, signature: true },
ai_translate: { gratuit: false, "premier-dossier": true, essentiel: true, accompagnement: true, premium: true, "signature-focus": true, signature: true },
compress: { gratuit: false, "premier-dossier": true, essentiel: true, accompagnement: true, premium: true, "signature-focus": true, signature: true }
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
