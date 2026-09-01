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
export const PLAN_ORDER = [
"gratuit",
"premier-dossier",
"essentiel",
"accompagnement",
"premium",
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
essentiel: "Essentiel",
accompagnement: "Ambition",
premium: "Premium",
"signature-focus": "Conseiller",
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
{ key: "compress", label: "Compression de fichiers", description: "Réduction de la taille d'un PDF ou d'une image à la taille demandée par un portail universitaire." },
{ key: "interview_prep", label: "Préparation aux entretiens", description: "Banque de questions par type de bourse et checklist de préparation avant un entretien." },
{ key: "advisor", label: "Mon conseiller", description: "Messagerie avec un conseiller humain dédié à l'accompagnement." }
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
compress: { gratuit: false, "premier-dossier": true, essentiel: true, accompagnement: true, premium: true, "signature-focus": true, signature: true },
// Décision validée le 2026-08-10 : même palier que le reste du lot
// "dossier de candidature enrichi" (Essentiel+, pas de palier dédié
// malgré le "Premium en préparation" affiché jusqu'ici sur le
// placeholder dashboard — copie mise à jour en conséquence).
interview_prep: { gratuit: false, "premier-dossier": true, essentiel: true, accompagnement: true, premium: true, "signature-focus": true, signature: true },
// Seule fonctionnalité de ce fichier qui N'EST PAS un outil Fitz — accès
// à un conseiller humain, vrai uniquement pour les deux offres
// "human" de pricing-plans.js. Voir la note en tête de fichier.
advisor: { gratuit: false, "premier-dossier": false, essentiel: false, accompagnement: false, premium: false, "signature-focus": true, signature: true }
};

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

const defaults = DEFAULT_FEATURE_CONFIG[key];
const overrides = (rawConfig && rawConfig.features && rawConfig.features[key]) || {};

merged[key] = { ...defaults, ...overrides };

});

return merged;

}
