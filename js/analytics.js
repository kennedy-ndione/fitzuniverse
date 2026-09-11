/**
* ============================================================
* FitzUniverse — suivi d'événements (analytics)
* ============================================================
*
* Point d'entrée UNIQUE pour signaler qu'un événement métier vient de
* se produire quelque part sur le site (inscription, connexion,
* consultation d'une bourse/université, génération d'un CV/lettre/
* email, vérification, traduction, tentative de paiement...).
*
* Architecture (sans Cloud Functions, tout s'écrit depuis le client) :
*  - un journal brut, append-only : analyticsEvents/{autoId}
*    { type, uid, payload, createdAt, clientTs }
*  - des compteurs agrégés, bon marché à lire pour le futur Control
*    Center admin (jamais besoin de scanner le journal brut). Chacun
*    est sa PROPRE collection de premier niveau (un chemin Firestore
*    doit toujours avoir un nombre pair de segments pour désigner un
*    document — d'où des collections séparées plutôt que des
*    "sous-chemins" sous un seul "analyticsCounters") :
*      analyticsCounters/totals        — un champ par type d'événement
*      analyticsDailyCounters/{yyyy-mm-dd} — même forme, par jour
*      analyticsPlanCounters/{planId}      — par formule (payment_attempted)
*      analyticsCountryCounters/{slug}     — { label, count }
*      analyticsUniversityCounters/{slug}
*      analyticsFieldCounters/{slug}
*
* RÈGLE PERMANENTE DU PROJET : avant toute nouvelle fonctionnalité sur
* FitzUniverse, vérifier si un événement de suivi doit être créé. Si
* oui, ajouter une entrée dans EVENT_CONFIG ci-dessous et un seul
* appel trackEvent(...) au point d'action — ne jamais modifier la
* fonction trackEvent elle-même pour un nouveau type d'événement.
*
* trackEvent() ne doit jamais faire échouer la fonctionnalité qui
* l'appelle : toutes les erreurs sont avalées en interne. Les points
* d'appel ne doivent donc jamais faire `await trackEvent(...)` dans
* leur propre try/catch — un simple appel "et on oublie" suffit.
*
* Limite connue et acceptée (documentée aussi dans firestore.rules) :
* sans Cloud Functions, rien ne garantit côté serveur qu'une écriture
* n'incrémente un compteur que de 1 — un client malveillant pourrait
* fausser un chiffre. À corriger le jour où l'agrégation passera côté
* serveur (trigger Firestore), sans changer l'API de trackEvent().
* ============================================================
*/

import { auth, db } from "../firebase-config.js";

import {
collection,
addDoc,
doc,
setDoc,
increment,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Chaque type d'événement déclare : quels compteurs globaux
// incrémenter, et — si l'événement porte une dimension "top N"
// (pays, université, domaine) — quel champ du payload utiliser.
const EVENT_CONFIG = {

signup: { counters: ["totals", "byDay"] },
login: { counters: ["totals", "byDay"] },

// Entrées/sorties du site (refonte Control Center 2026-09-02) :
// "visit" est signalé UNE fois par session de navigateur via
// trackVisitOnce() ci-dessous — jamais à chaque page, pour ne pas
// gonfler les écritures ; "logout" au clic sur Déconnexion.
visit: { counters: ["totals", "byDay"] },
logout: { counters: ["totals", "byDay"] },

scholarship_viewed: { counters: ["totals", "byDay"], dimensions: ["country", "university", "field"] },
university_viewed: { counters: ["totals", "byDay"], dimensions: ["country", "university"] },
application_portal_opened: { counters: ["totals", "byDay"], dimensions: ["country", "university"] },
// Émis par details.js depuis la distinction portail université /
// portail bailleur / portail de candidature, mais jamais déclarés
// ici (journal seul, aucun compteur) — régularisés le 2026-09-02.
university_portal_opened: { counters: ["totals", "byDay"], dimensions: ["country", "university"] },
funder_portal_opened: { counters: ["totals", "byDay"], dimensions: ["country"] },
application_created_from_details: { counters: ["totals", "byDay"], dimensions: ["country", "university"] },

letter_generated: { counters: ["totals", "byDay"], dimensions: ["country"] },
email_generated: { counters: ["totals", "byDay"], dimensions: ["country"] },
verification_run: { counters: ["totals", "byDay"] },
translation_run: { counters: ["totals", "byDay"] },
ai_chat_message_sent: { counters: ["totals", "byDay"] },

application_added: { counters: ["totals", "byDay"] },
application_checked_in: { counters: ["totals", "byDay"] },
application_readiness_checked: { counters: ["totals", "byDay"] },
// Ces deux types étaient déjà émis par applications.js mais absents
// d'EVENT_CONFIG (le journal brut les recevait, aucun compteur ne
// bougeait) — régularisés lors de la refonte du 2026-09-02.
application_checklist_updated: { counters: ["totals", "byDay"] },
application_recommendation_replaced: { counters: ["totals", "byDay"] },

// Issues de candidatures (statuts admise / refusee / liste_attente
// d'applications.js) — la matière première des courbes admissions/
// refus du Control Center.
application_admitted: { counters: ["totals", "byDay"] },
application_rejected: { counters: ["totals", "byDay"] },
application_waitlisted: { counters: ["totals", "byDay"] },

advisor_request_sent: { counters: ["totals", "byDay"] },
// Message envoyé par un administrateur à un étudiant depuis le
// Control Center (interaction directe admin → étudiant).
admin_message_sent: { counters: ["totals", "byDay"] },
file_compressed: { counters: ["totals", "byDay"] },

payment_attempted: { counters: ["totals", "byDay", "byPlan"] },

// Lot PORTES-COULEUR (2026-09-11) : les trois chemins de l'accueil —
// les deux portes et la ligne du diagnostic. Un compteur par chemin,
// rien d'autre : c'est sur ces trois nombres que l'égalité des portes
// sera tranchée en novembre.
porte_bourse: { counters: ["totals", "byDay"] },
porte_preinscription: { counters: ["totals", "byDay"] },
porte_diagnostic: { counters: ["totals", "byDay"] }

};

function todayKey() {
return new Date().toISOString().slice(0, 10);
}

function slugify(value) {

return String(value || "")
.trim()
.toLowerCase()
.normalize("NFD")
.replace(/\p{Diacritic}/gu, "")
.replace(/[^a-z0-9]+/g, "-")
.replace(/(^-|-$)/g, "") || "inconnu";

}

async function bumpCounter(path, field, extra) {

try {
await setDoc(doc(db, path), { [field]: increment(1), ...extra }, { merge: true });
} catch (error) {
console.warn(`[analytics] échec de l'incrément ${path}:`, error);
}

}

async function bumpDimension(collectionPath, rawValue) {

if (!rawValue) return;

const slug = slugify(rawValue);

await bumpCounter(`${collectionPath}/${slug}`, "count", { label: rawValue });

}

export async function trackEvent(eventType, payload = {}) {

try {

const config = EVENT_CONFIG[eventType];

if (!config) {
console.warn(`[analytics] type d'événement inconnu, non configuré dans EVENT_CONFIG : "${eventType}"`);
}

// 1. Journal brut — toujours écrit, même si le type est inconnu,
// pour ne jamais perdre un signal en attendant sa configuration.
await addDoc(collection(db, "analyticsEvents"), {
type: eventType,
uid: auth.currentUser ? auth.currentUser.uid : null,
payload,
createdAt: serverTimestamp(),
clientTs: Date.now()
});

if (!config) return;

// 2. Compteurs agrégés déclarés pour ce type d'événement.
const jobs = [];

if (config.counters.includes("totals")) {
jobs.push(bumpCounter("analyticsCounters/totals", eventType));
}

if (config.counters.includes("byDay")) {
jobs.push(bumpCounter(`analyticsDailyCounters/${todayKey()}`, eventType));
}

if (config.counters.includes("byPlan") && payload.plan) {
jobs.push(bumpCounter(`analyticsPlanCounters/${payload.plan}`, "count"));
}

(config.dimensions || []).forEach((field) => {

if (field === "country" && payload.country) {
jobs.push(bumpDimension("analyticsCountryCounters", payload.country));
}

if (field === "university" && payload.university) {
jobs.push(bumpDimension("analyticsUniversityCounters", payload.university));
}

if (field === "field" && payload.field) {
jobs.push(bumpDimension("analyticsFieldCounters", payload.field));
}

});

await Promise.all(jobs);

} catch (error) {

// Le suivi analytics ne doit jamais faire planter la fonctionnalité
// qui l'appelle : on se contente de logguer.
console.warn(`[analytics] échec du suivi de l'événement "${eventType}":`, error);

}

}

// ==========================================================
// Entrées du site — UNE visite par session de navigateur.
// sessionStorage sert de garde : l'événement part au premier
// chargement d'une page qui appelle trackVisitOnce(), puis plus
// jamais dans le même onglet (rechargements Live Server compris,
// ce qui protège aussi le quota d'écritures en développement).
// Comme trackEvent, ne doit jamais faire échouer l'appelant.
// ==========================================================

export function trackVisitOnce() {

try {

if (sessionStorage.getItem("fitzVisitTracked") === "1") return;

sessionStorage.setItem("fitzVisitTracked", "1");

trackEvent("visit", { page: window.location.pathname });

} catch (error) {

// sessionStorage indisponible (navigation privée stricte...) :
// tant pis pour cette visite, jamais d'erreur propagée.
console.warn("[analytics] visite non suivie :", error);

}

}
