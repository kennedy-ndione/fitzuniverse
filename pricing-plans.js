// -------- pricing-plans.js --------
// Source unique des offres ScholarBridge.
// Utilisé par offers.html et payment.html. Ce fichier ne contient
// volontairement aucune logique d'affichage ni de paiement : uniquement
// les données des offres et la construction du payload transmis à la
// future intégration PayDunya (Wave, Orange Money, carte bancaire).
//
// Le prix affiché sur payment.html est TOUJOURS relu depuis cet objet à
// partir du seul identifiant d'offre (jamais depuis une valeur stockée
// côté client) : le navigateur ne doit jamais pouvoir faire dire à la
// page un prix différent de celui défini ici. La vérification réelle et
// définitive reste néanmoins la responsabilité du futur backend.
//
// Aucun prix n'est exprimé en euros. Le champ `priceEUR` (supprimé le
// 2026-08-02) n'était plus lu que par payment.js pour afficher un
// "≈ N €" à côté du montant en FCFA — la grille est désormais 100%
// FCFA, seule devise réellement utilisée par les étudiants concernés.
//
// ==========================================================
// STRUCTURE DE L'OFFRE (révisée 2026-08-02)
// ==========================================================
// Trois familles, distinguées par `type` :
//
//  - "pass" / "unit"  → Pour démarrer. Engagement minimal, pas
//    d'abonnement : le Pass Fitz Express (accès à Fitz, limité dans le
//    temps) et Premier Dossier (une seule candidature accompagnée).
//
//  - "plan"           → Formules complètes, 6 mois. Essentiel / Avancé /
//    Premium. CUMULATIVES : Avancé inclut tout Essentiel, Premium inclut
//    tout Avancé. Elles se différencient par deux axes — le nombre de
//    candidatures accompagnées (`maxAccompaniedApplications`) ET le
//    niveau de service humain (relecture, prépa entretien, aide visa,
//    délai de réponse).
//
//  - "human"          → Accompagnement humain. Signature Focus et
//    Signature : un conseiller réel, Fitz venant en renfort.
//
// CHANGEMENT DE POSITIONNEMENT — à lire avant de modifier :
// jusqu'au 2026-07-31, la règle verrouillée était "la SEULE différence
// entre les formules payantes est le quota de candidatures, jamais la
// qualité de l'accompagnement". La grille validée le 2026-08-02
// abandonne cette règle : Avancé et Premium ajoutent de vrais services
// (relecture humaine de la lettre, préparation à l'entretien, révisions
// illimitées, aide au visa, réponse prioritaire).
// Ce qui reste vrai en revanche, et ne doit pas être confondu avec le
// point ci-dessus : les OUTILS FITZ restent inclus à 100% dans les trois
// formules — aucun outil n'est réservé à une formule supérieure. C'est
// pourquoi js/plan-features.js (qui ne pilote que les outils Fitz) reste
// inchangé, avec toutes ses fonctionnalités à `true` pour essentiel,
// accompagnement et premium.
//
// ==========================================================
// IDENTIFIANTS — ne pas renommer à la légère
// ==========================================================
// `fitzExpress` et `accompagnement` gardent leur identifiant historique
// alors que la grille commerciale les nomme "pass-express" et "avance".
// Ce n'est pas un oubli : `accompagnement` est l'une des valeurs de
// PLAN_ORDER (js/plan-features.js), la clé du document Firestore
// `config/planFeatures`, ET la valeur écrite dans `users/{uid}.plan`
// des comptes existants. Le renommer demanderait une migration de
// données, pas seulement une mise à jour des points d'appel.
// Les offres créées en 2026-08 utilisent les identifiants de la grille
// commerciale tels quels ("premier-dossier", "signature-focus").

const SCHOLARBRIDGE_PLANS = {

// ==========================================================
// POUR DÉMARRER
// ==========================================================

// `fitzExpress` n'est PAS une formule d'accompagnement — c'est un pass
// d'assistance ponctuelle, volontairement séparé des formules complètes :
// il ne doit jamais apparaître comme une colonne du tableau comparatif.
fitzExpress: {
id: "fitzExpress",
type: "pass",
label: "Pass Fitz Express",
icon: "zap",
tagline: "Des réponses immédiates de Fitz, sans engagement.",
badge: "Pass rapide",
priceFCFA: 7500,
duration: "14 jours",
fitzAccess: "Questions illimitées, réponses instantanées",
// Condition commerciale à afficher partout où ce pass est proposé.
note: "Intégralement déduit si vous passez à une formule complète sous 30 jours.",
highlights: [
"Questions illimitées à Fitz pendant 14 jours",
"Explication des critères et des procédures de candidature",
"Orientation vers les programmes adaptés à votre profil",
"Intégralement déduit si vous passez à une formule complète sous 30 jours"
]
},

// Une candidature, accompagnée de bout en bout — sans abonnement.
// Pas de `duration` : ce qui est acheté est une candidature, pas une
// période (voir payment.js, qui masque la ligne "Durée" dans ce cas).
"premier-dossier": {
id: "premier-dossier",
type: "unit",
label: "Premier Dossier",
icon: "file-text",
tagline: "Une candidature accompagnée de bout en bout avec Fitz.",
badge: "Pour démarrer",
priceFCFA: 12000,
maxAccompaniedApplications: 1,
extendsPendingApplications: true,
fitzAccess: "100% des outils Fitz, sans restriction",
highlights: [
"1 candidature accompagnée de bout en bout",
"100% des outils Fitz : lettre, CV, e-mails, traduction",
"Vérification complète du dossier avant dépôt",
"Sans abonnement"
]
},

// ==========================================================
// FORMULES COMPLÈTES — 6 MOIS
// Cumulatives : chaque formule reprend tout le contenu de la
// précédente et y ajoute ses propres services.
// ==========================================================

essentiel: {
id: "essentiel",
type: "plan",
label: "Essentiel",
icon: "compass",
tagline: "Jusqu'à 3 candidatures accompagnées de bout en bout, avec Fitz.",
badge: "Jusqu'à 3 candidatures",
priceFCFA: 25000,
duration: "6 mois",
maxAccompaniedApplications: 3,
extendsPendingApplications: true,
fitzAccess: "100% des outils Fitz, sans restriction",
highlights: [
"Jusqu'à 3 candidatures accompagnées de bout en bout",
"Tous les outils Fitz : lettre, CV, e-mails, traduction",
"2 révisions par dossier",
"6 mois d'accompagnement personnalisé avec Fitz"
]
},

accompagnement: {
id: "accompagnement",
type: "plan",
label: "Avancé",
icon: "sparkles",
tagline: "Jusqu'à 6 candidatures accompagnées de bout en bout, avec Fitz.",
badge: "Recommandé",
priceFCFA: 45000,
duration: "6 mois",
maxAccompaniedApplications: 6,
extendsPendingApplications: true,
fitzAccess: "100% des outils Fitz, sans restriction",
highlights: [
"Jusqu'à 6 candidatures accompagnées de bout en bout",
"Tout le contenu de la formule Essentiel",
"Relecture humaine de la lettre de motivation",
"Préparation à l'entretien",
"Alertes sur les dates limites"
]
},

premium: {
id: "premium",
type: "plan",
label: "Premium",
icon: "crown",
tagline: "Jusqu'à 12 candidatures accompagnées de bout en bout, avec Fitz.",
badge: "Jusqu'à 12 candidatures",
priceFCFA: 80000,
duration: "6 mois",
maxAccompaniedApplications: 12,
extendsPendingApplications: true,
fitzAccess: "100% des outils Fitz, sans restriction",
highlights: [
"Jusqu'à 12 candidatures accompagnées de bout en bout",
"Tout le contenu de la formule Avancé",
"Révisions illimitées",
"Aide à la préparation du visa",
"Réponse prioritaire sous 24 h"
]
},

// ==========================================================
// ACCOMPAGNEMENT HUMAIN
// Un conseiller réel, Fitz venant en renfort — et non l'inverse.
// ==========================================================

"signature-focus": {
id: "signature-focus",
type: "human",
label: "Signature Focus",
icon: "user-check",
tagline: "Un conseiller humain et Fitz, sur 3 candidatures.",
badge: "Accompagnement humain",
priceFCFA: 99000,
maxAccompaniedApplications: 3,
extendsPendingApplications: true,
fitzAccess: "100% des outils Fitz, sans restriction",
highlights: [
"Un conseiller humain dédié à vos candidatures",
"3 candidatures accompagnées de bout en bout",
"L'assistance continue de Fitz en renfort",
"Relecture complète de vos documents"
]
},

signature: {
id: "signature",
type: "human",
label: "ScholarBridge Signature",
icon: "star",
tagline: "Conseiller dédié, candidatures illimitées.",
badge: "Notre formule la plus complète",
priceFCFA: 199000,
// Candidatures illimitées. `maxAccompaniedApplications` reste absent
// volontairement : applications.js et admin/student-detail.js testent
// ce champ par sa véracité, une valeur absente signifie donc déjà
// "aucun plafond appliqué". `unlimitedApplications` explicite
// l'intention pour distinguer "illimité" de "aucune candidature
// incluse" — voir la note de suivi remise avec cette modification,
// aucun fichier ne le lit encore.
unlimitedApplications: true,
extendsPendingApplications: true,
fitzAccess: "100% des outils Fitz, sans restriction",
highlights: [
"Un conseiller dédié",
"Candidatures illimitées",
"Points d'étape en visioconférence",
"Accompagnement jusqu'à la préparation du visa",
"Des échanges personnalisés (WhatsApp)",
"L'assistance continue de Fitz tout au long du processus"
]
}

};

// Exposition explicite sur `window` — NE PAS SUPPRIMER.
// Ce fichier est chargé comme script classique : un `const` de premier
// niveau entre dans l'environnement lexical global mais ne devient PAS
// une propriété de `window`. Or applications.js et
// admin/student-detail.js lisent `window.SCHOLARBRIDGE_PLANS` — sans
// cette ligne ils recevaient `undefined`, donc le quota de candidatures
// n'était jamais appliqué et le panneau admin affichait toujours
// "formule Gratuit". Corrigé le 2026-08-02.
window.SCHOLARBRIDGE_PLANS = SCHOLARBRIDGE_PLANS;

// Construit l'objet transmis à payment.html (URL + sessionStorage) et,
// plus tard, à la passerelle PayDunya. Ne déclenche aucun paiement ici.
function buildCheckoutPayload(planId) {

const plan = SCHOLARBRIDGE_PLANS[planId];

if (!plan) return null;

return {
plan: plan.id,
label: plan.label,
priceFCFA: plan.priceFCFA,
currency: "XOF",
selectedAt: new Date().toISOString()
};

}
