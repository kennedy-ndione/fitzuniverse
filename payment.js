// -------- payment.js --------
// Récapitulatif et activation de l'accompagnement choisi. Le palier est
// toujours relu depuis pricing-plans.js à partir de son identifiant —
// jamais depuis un prix stocké côté client — pour qu'un navigateur ne
// puisse jamais faire afficher un montant différent de celui défini
// dans SCHOLARBRIDGE_PLANS. Aucune clé secrète ni appel PayDunya ici :
// le paiement passe par la Cloud Function creerPaiement (europe-west1),
// seule détentrice des clés — voir functions/paiement.js.
//
// COMPTE D'ABORD (lot du 2026-09-21, décision de Charles). Cette page
// ne crée PLUS de compte. Elle était, jusqu'au 2026-09-20, le seul
// endroit du site où l'on pouvait en ouvrir un — d'où un formulaire
// nom / e-mail / mot de passe collé au récapitulatif du prix. Depuis
// que le compte est gratuit (inscription.html), ce formulaire faisait
// doublon, mélangeait deux décisions (« je m'inscris » et « je paie »)
// sur le même écran, et gardait sa propre copie des règles de mot de
// passe.
//
// Désormais : on paie depuis un compte ouvert. Un visiteur voit le
// récapitulatif de sa formule, puis deux portes — créer son compte
// gratuit, ou se connecter — qui le ramènent ICI, sur la même formule
// (js/retour-apres-compte.js). Le moyen de paiement et le bouton
// n'apparaissent qu'une fois connecté. resolveSession() ne redirige
// jamais : l'absence de session reste un état normal de cette page.
//
// Cette page n'écrit JAMAIS le champ `plan`, seulement `pendingPlan`
// (une intention, à titre informatif pour le suivi admin). L'accès
// payant est ouvert par le webhook, côté serveur, après vérification
// du paiement — et firestore.rules interdit de toute façon à un compte
// d'écrire son propre `plan`.

import { app, db } from "./firebase-config.js";
import { resolveSession } from "./js/access-guard.js";
import { avecRetour } from "./js/retour-apres-compte.js";
import {
doc,
updateDoc,
onSnapshot,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import {
getFunctions,
httpsCallable
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-functions.js";

// europe-west1, pas la région par défaut : creerPaiement y est déployée
// (voir functions/paiement.js). Cibler la mauvaise région donne un
// "not-found" qui ressemble à s'y méprendre à un bug de code.
const functions = getFunctions(app, "europe-west1");
import { trackEvent } from "./js/analytics.js";
import { PHRASE_REGLE, cibleApresPaiement } from "./js/fitz-choisit.js";

const FITZ_MESSAGES = [
"Fitz vous accompagnera dès la validation de votre paiement.",
"Fitz commencera immédiatement l'analyse de votre dossier.",
"Fitz préparera votre stratégie de candidature.",
"Fitz reste disponible à chaque étape de votre accompagnement."
];

// Une offre `deprecated: true` (pricing-plans.js) n'est plus vendue —
// jamais publiquement (retirée de offers.html), jamais via une URL
// devinée ou un lien ancien encore partagé (?plan=premium). Un compte
// qui la détient déjà n'initie pas de nouvel achat via cette page : sa
// formule est déjà active, résolue ailleurs par identifiant
// (dashboard.js, admin/student-detail.js), jamais ici.
function isSellablePlan(planId) {
const plan = SCHOLARBRIDGE_PLANS[planId];
return !!plan && plan.deprecated !== true;
}

function getRequestedPlanId() {

const fromUrl = new URLSearchParams(window.location.search).get("plan");

if (fromUrl && isSellablePlan(fromUrl)) return fromUrl;

try {

const stored = JSON.parse(sessionStorage.getItem("scholarbridgeCheckout") || "null");

if (stored && isSellablePlan(stored.plan)) return stored.plan;

} catch (e) {}

return null;

}

function formatFCFA(amount) {

return amount.toLocaleString("fr-FR");

}

// Parité FIXE entre l'euro et le franc CFA (XOF), garantie par accord
// monétaire : 1 € = 655,957 F CFA. Ce n'est pas un taux de marché, il n'y
// a donc rien à rafraîchir ni aucun appel réseau à faire — la constante
// est exacte tant que la parité tient.
const EUR_PER_XOF = 655.957;

// L'euro est arrondi à l'unité : personne ne règle 44,21 €, et une
// décimale donnerait une fausse impression de précision sur un montant
// qui n'est de toute façon qu'une conversion. Le montant ENGAGEANT
// reste le F CFA (voir formatPriceHTML).
function formatEUR(amountFCFA) {

return Math.round(amountFCFA / EUR_PER_XOF).toLocaleString("fr-FR");

}

// Affichage du prix : le F CFA porte le montant, l'euro le suit en petit
// (lot PAIEMENT-SÛR, 2026-09-17 — c'était l'inverse depuis la demande du
// 2026-08-22). Cohérent avec offers.html : le chiffre en gros est celui
// que PayDunya débite.
//
// Le F CFA n'est jamais masqué, et c'est délibéré : Wave, Orange Money et
// MTN MoMo sont des rails en francs CFA, c'est donc ce montant-là qui
// sera réellement débité. Afficher uniquement l'euro sur une page de
// paiement laisserait croire à un prélèvement en euros — sur l'écran
// précis où l'utilisateur s'engage, l'ambiguïté ne serait pas
// acceptable.
//
// MTN MoMo est cité ci-dessus comme EXEMPLE de rail en F CFA, pas comme
// moyen de paiement du produit : il n'est proposé nulle part. Les seuls
// moyens offerts sont les trois clés du sélecteur ci-dessous
// (initActivation) — wave, orange-money, card. offers.html doit citer
// cette liste-là et rien d'autre ; test/offers-plans.test.mjs le vérifie.
function formatPriceHTML(amountFCFA) {

return `<span class="price-main">${formatFCFA(amountFCFA)}<span class="price-currency">F CFA</span></span>`
+ `<span class="price-local">soit environ ${formatEUR(amountFCFA)} €</span>`;

}

// Libellé du bouton d'activation. Le F CFA annonce ce qui part du compte,
// l'euro suit en repère — les deux sur la même ligne, jamais l'un sans
// l'autre.
// LE PRIX RÉELLEMENT DÛ (lot DIAGNOSTIC-2, 2026-09-09) : les 10 000 F
// d'un diagnostic payé depuis moins de trente jours se déduisent d'un
// Dossier France. Calculé par pricing-plans.js, et RECALCULÉ côté
// serveur avant la facture — ce qui est affiché ici ne fait pas foi, et
// un prix affiché faux resterait une erreur d'affichage, jamais une
// remise obtenue.
//
// `session` peut être null (page ouverte sans compte) : le prix de
// catalogue s'affiche alors, ce qui est la bonne réponse — la déduction
// appartient à un compte, pas à un visiteur.
let TARIF = null;

function tarifDe(plan, session) {
const calcul = typeof window.prixAvecDeduction === "function"
? window.prixAvecDeduction(plan.id, (session && session.userData) || {})
: null;
return calcul || { prix: plan.priceFCFA, base: plan.priceFCFA, deduction: 0, mention: "" };
}

function activationLabel(plan) {

const montant = TARIF ? TARIF.prix : plan.priceFCFA;

return `Activer mon accompagnement — ${formatFCFA(montant)} F CFA (environ ${formatEUR(montant)} €)`;

}

function renderPlan(plan, session) {

TARIF = tarifDe(plan, session);

// Le récapitulatif est LA carte de formule du site (css/formule.css),
// au niveau de la formule choisie — entree / recommande / humain, lu
// dans pricing-plans.js (lot VITRINE-COMMERCIALE, 2026-09-11).
const summary = document.querySelector(".plan-summary");
if (summary) summary.classList.add("plan-card", `plan-card--${plan.niveau || "entree"}`);

document.getElementById("planSummaryIcon").setAttribute("data-lucide", plan.icon);
document.getElementById("planSummaryBadge").textContent = plan.badge;
document.getElementById("planSummaryLabel").textContent = plan.label;
document.getElementById("planSummaryAmount").innerHTML = formatPriceHTML(TARIF.prix);

document.getElementById("summaryOffer").textContent = plan.label;
document.getElementById("summaryPrice").textContent = TARIF.deduction
// Le prix barré ET la raison : un montant qui baisse sans explication
// se lit comme une erreur, et on appelle le support pour la signaler.
? `${formatFCFA(TARIF.prix)} F CFA débités (environ ${formatEUR(TARIF.prix)} €), au lieu de ${formatFCFA(TARIF.base)} F CFA : ${TARIF.mention}.`
: `${formatFCFA(TARIF.prix)} F CFA débités (environ ${formatEUR(TARIF.prix)} €)`;
// Toutes les offres n'ont pas de durée : Premier Dossier, Signature
// Focus et Signature achètent un nombre de candidatures, pas une
// période. La ligne entière est masquée dans ce cas — la page
// affichait "undefined" pour Signature, qui n'a jamais eu ce champ.
// display:none plutôt que l'attribut [hidden] : une règle [hidden]
// d'une feuille externe s'est déjà révélée ignorée sur ce projet.
const durationEl = document.getElementById("summaryDuration");
const durationRow = durationEl.closest(".summary-row");

durationEl.textContent = plan.duration || "";

if (durationRow) durationRow.style.display = plan.duration ? "" : "none";
document.getElementById("summaryIncluded").textContent = plan.tagline;
document.getElementById("summaryFitzAccess").textContent = plan.fitzAccess;

// Lot FITZ-CHOISIT (2026-09-11) : la règle du parcours bourses, dite
// AVANT le paiement — il n'y a jamais de remboursement. Sur les seules
// formules qui accompagnent des candidatures bourse (quota > 0) ; le
// Pass Découverte et les offres préinscription n'ont rien à en dire.
const regleRow = document.getElementById("summaryRegleRow");
const regleBourse = plan.parcours === "bourse" && Number(plan.maxAccompaniedApplications) > 0;
if (regleRow) {
regleRow.style.display = regleBourse ? "" : "none";
document.getElementById("summaryRegle").textContent = regleBourse ? PHRASE_REGLE : "";
}

}

function initFitzRotator() {

const el = document.getElementById("fitzRotatorMessage");

if (!el) return;

let index = 0;

setInterval(() => {

index = (index + 1) % FITZ_MESSAGES.length;

el.classList.add("is-swapping");

setTimeout(() => {

el.textContent = FITZ_MESSAGES[index];
el.classList.remove("is-swapping");

}, 280);

}, 2800);

}

function initReveal() {

document.documentElement.classList.add("js-ready");

const items = document.querySelectorAll(".reveal");

if (!items.length) return;

if (!("IntersectionObserver" in window)) {
items.forEach((item) => item.classList.add("is-visible"));
return;
}

const observer = new IntersectionObserver((entries) => {

entries.forEach((entry) => {
if (entry.isIntersecting) {
entry.target.classList.add("is-visible");
observer.unobserve(entry.target);
}
});

// Mêmes deux causes que sur offers.js (voir le commentaire détaillé
// là-bas, 2026-08-15/2026-08-29) : un seuil proportionnel devient
// inatteignable sur les blocs très hauts, et un élément déjà dépassé
// au moment où l'observer démarre (restauration de la position de
// défilement, arrivée par ancre) ne serait jamais révélé.
}, { threshold: 0, rootMargin: "0px 0px -60px 0px" });

items.forEach((item) => {

if (item.getBoundingClientRect().bottom < 0) {
item.classList.add("is-visible");
return;
}

observer.observe(item);

});

}

function initPaymentMethods(plan) {

const radios = document.querySelectorAll('input[name="paymentMethod"]');
const button = document.getElementById("activateButton");
const label = document.getElementById("activateButtonLabel");

radios.forEach((radio) => {

radio.addEventListener("change", () => {

button.disabled = false;
label.textContent = activationLabel(plan);

});

});

// PAIEMENT BIENTÔT (2026-09-23) : Orange Money est présélectionné dans
// payment.html (seul moyen que PayDunya ouvre tant que le compte n'est
// pas validé). Un choix déjà coché à l'ouverture active le bouton tout
// de suite, sans attendre un clic qui ne changerait rien.
if (document.querySelector('input[name="paymentMethod"]:checked:not(:disabled)')) {
button.disabled = false;
label.textContent = activationLabel(plan);
}

}

// COMPTE D'ABORD (2026-09-21) — voir l'en-tête. Un visiteur voit deux
// portes qui le ramènent sur CETTE formule ; le moyen de paiement et le
// bouton d'activation n'existent pour lui qu'une fois connecté. Un
// compte connecté ne voit que le paiement.
function initCompteRequis(session, planId) {

const bloc = document.getElementById("compteRequis");
const paiement = document.getElementById("paiementSection");
const activation = document.getElementById("activationBloc");

if (bloc) bloc.hidden = !!session;
if (paiement) paiement.hidden = !session;
if (activation) activation.hidden = !session;

if (session || !bloc) return;

const retour = `payment.html?plan=${planId}`;
const inscription = document.getElementById("compteRequisInscription");
const connexion = document.getElementById("compteRequisConnexion");
if (inscription) inscription.setAttribute("href", avecRetour("inscription.html", retour));
if (connexion) connexion.setAttribute("href", avecRetour("login.html", retour));

}

// L'intention d'achat, pour le suivi admin — jamais la formule elle-même
// (firestore.rules réserve `plan` au serveur).
async function marquerIntention(session, plan) {

await updateDoc(doc(db, "users", session.user.uid), {
pendingPlan: plan.id,
pendingPlanRequestedAt: serverTimestamp()
});

}

// ==========================================================
// ACTIVATION — branchée sur le backend depuis le 2026-09-04
// ==========================================================
//
// HISTORIQUE : cette page a longtemps affiché « le paiement sécurisé
// PayDunya sera activé très prochainement ». Le backend existe
// désormais (functions/paiement.js, déployé en europe-west1). Le flux
// décrit ci-dessous n'est plus un plan, c'est ce qui se passe.
//
// Flux prévu, à implémenter côté serveur (Cloud Functions Firebase ou
// équivalent) :
//
// 1. Le backend reçoit { plan, paymentMethod } et relit LUI-MÊME le
//    prix depuis sa propre source de vérité (jamais depuis le client).
// 2. Le backend crée la transaction PayDunya avec ce montant vérifié.
// 3. PayDunya gère le paiement (Wave, Orange Money, carte bancaire).
// 4. PayDunya notifie le backend par webhook signé.
// 5. Le backend vérifie la signature, le montant, le plan et le statut.
// 6. Seulement alors, le backend met à jour Firestore (offre, date,
//    statut, historique) et active le niveau d'accompagnement.
// 7. L'utilisateur est redirigé vers le tableau de bord Fitz.
//    À cette étape, poser sessionStorage.setItem("just_upgraded", plan.label)
//    avant la redirection : dashboard.js l'utilise déjà pour afficher le
//    message d'accueil "votre accompagnement est activé" (voir
//    accompagnementAlert dans dashboard.html/dashboard.js).
//
// Demande une facture au backend et renvoie l'URL de paiement PayDunya.
//
// Le navigateur envoie un IDENTIFIANT d'offre, jamais un montant : le
// serveur relit le prix dans sa propre grille (GRILLE, functions/
// paiement.js). C'est la raison d'être de tout ce détour — sans lui,
// une console de développeur suffirait à acheter Signature à 100 F.
const creerPaiement = httpsCallable(functions, "creerPaiement");

// Messages français pour les refus que le backend sait produire. Un
// étudiant ne doit jamais lire un code d'erreur : chaque cas ci-dessous
// correspond à un HttpsError levé dans functions/paiement.js.
function messageErreurPaiement(error) {

const code = String(error?.code || "").replace("functions/", "");

if (code === "failed-precondition") {
// Le backend explique lui-même pourquoi (ex. Premier Dossier déjà
// détenu, qui n'expire pas). Son message est déjà en français et
// destiné à l'étudiant.
return error.message;
}

if (code === "unauthenticated") {
return "Votre session a expiré. Reconnectez-vous, puis relancez le paiement.";
}

if (code === "permission-denied") {
return "Ce compte est suspendu. Contactez-nous pour le réactiver.";
}

if (code === "invalid-argument") {
return "Cette formule n'est plus disponible. Choisissez-en une autre depuis la page des offres.";
}

if (code === "unavailable") {
return "Le service de paiement ne répond pas pour l'instant. Réessayez dans un instant.";
}

return "Le paiement n'a pas pu être lancé. Réessayez, ou écrivez-nous si cela persiste.";

}

// Où atterrit l'étudiant une fois l'activation confirmée. dashboard.html
// reste la cible par défaut (comportement inchangé pour Essentiel/Avancé/
// Premium/Signature Focus/Signature) — Pass Express et Premier Dossier
// ont un premier geste évident et unique, on l'ouvre directement plutôt
// que de faire remonter le pas depuis le tableau de bord (audit du
// 2026-08-10, chantier "accès par formule"). "?action=new" est lu par
// applications.js pour ouvrir directement le formulaire de candidature.
// LOT S4 : chaque achat mène à SON espace, jamais à dashboard.html.
// dashboard.html n'est plus qu'un aiguillage : y envoyer un client qui
// vient de payer lui ferait traverser une redirection de plus, et lui
// montrerait une page vide le temps que la session se résolve. Le
// paramètre ?track= a disparu avec le sélecteur du formulaire : l'espace
// impose désormais le parcours, on ne demande plus à quelqu'un de
// choisir ce qu'il vient d'acheter.
// LOT ACCEPTATION, partie 3 (2026-09-11) : la table vit dans
// js/fitz-choisit.js (cibleApresPaiement, pure et testée). Pass
// Découverte → ai-chat.html ; Diagnostic France → sa page ; Dossiers
// France → espace-preinscription.html?action=new (les vœux se saisissent
// à la main) ; Premier Dossier, Essentiel, Conseiller → profile.html?pour=fitz
// si le profil n'est pas prêt pour Fitz, applications.html sinon (les
// propositions à accepter). « Prêt » se lit avec profilPretPourFitz, la
// même fonction que le remplissage. Le repli des formules dépréciées :
// l'espace bourse, jamais l'aiguillage.
function resolvePostActivationTarget(planId, profile) {
return cibleApresPaiement(planId, profile || {});
}

function initActivation(plan, session) {

const button = document.getElementById("activateButton");
const label = document.getElementById("activateButtonLabel");
const result = document.getElementById("activationResult");
const resultText = document.getElementById("activationResultText");

const methodLabels = {
wave: "Wave",
"orange-money": "Orange Money",
card: "carte bancaire"
};

// Compte d'abord (2026-09-21) : sans session, le bouton n'existe pas à
// l'écran (initCompteRequis) — et il ne se branche pas non plus.
if (!session) return;

button.addEventListener("click", async () => {

const method = document.querySelector('input[name="paymentMethod"]:checked');

if (!method) return;

button.disabled = true;
button.classList.add("is-loading");
label.textContent = "Activation en cours...";

// L'intention n'est qu'un repère de suivi : son échec ne bloque pas le
// paiement, c'est le serveur (creerPaiement) qui décide.
try {
await marquerIntention(session, plan);
} catch (error) {
console.warn("Intention d'achat non enregistrée :", error);
}

const uid = session.user.uid;

trackEvent("payment_attempted", { plan: plan.id, method: method.value, uid });

// `just_upgraded` ne sera posé qu'après la confirmation du paiement
// (voir attendreActivation) — l'écrire ici ferait dire au tableau de
// bord « votre accompagnement est activé » à quelqu'un qui aurait
// abandonné devant l'écran de paiement.

// sessionStorage survit à l'aller-retour vers PayDunya (même onglet,
// même origine) : c'est ce qui permet de retrouver la formule au
// retour, même si l'URL était tronquée en route.
sessionStorage.setItem("scholarbridgeCheckout", JSON.stringify({ plan: plan.id }));

let facture;

try {

facture = await creerPaiement({ planId: plan.id, method: method.value });

} catch (error) {

console.error(error);

button.classList.remove("is-loading");
button.disabled = false;
label.textContent = activationLabel(plan);

resultText.textContent = messageErreurPaiement(error);
result.hidden = false;
result.scrollIntoView({ behavior: "smooth", block: "nearest" });

return;

}

const url = facture?.data?.url;

if (!url) {

button.classList.remove("is-loading");
button.disabled = false;
label.textContent = activationLabel(plan);

resultText.textContent = "Le paiement n'a pas pu être lancé. Réessayez dans un instant.";
result.hidden = false;
return;

}

label.textContent = "Redirection vers le paiement sécurisé...";

// On QUITTE le site pour la page PayDunya. Tout ce qui suit — le
// débit, la confirmation, l'activation — se passe ailleurs. Le
// retour est géré par attendreActivation() en haut de bootstrap.
window.location.href = url;

});

}

// ==========================================================
// RETOUR DE PAYDUNYA
// ==========================================================
//
// L'étudiant revient sur `payment.html?paiement=ok`. Ce paramètre ne
// prouve RIEN : il est dans l'URL, donc réécrivable par n'importe qui.
// La seule preuve qu'un paiement a eu lieu vit dans le document
// `users/{uid}`, que seul le webhook (SDK Admin) peut écrire.
//
// On observe donc ce document, et on attend que le serveur y écrive
// `dernierPaiementLe`. C'est le webhook qui décide, pas cette page.
//
// Le décalage est réel : PayDunya appelle notre serveur pendant que le
// navigateur revient. Le plus souvent c'est déjà fait avant l'affichage
// de la page ; parfois il faut quelques secondes. D'où l'attente
// explicite plutôt qu'une lecture unique qui arriverait trop tôt.
const FENETRE_PAIEMENT_MS = 15 * 60 * 1000;

function attendreActivation(plan, session) {

const result = document.getElementById("activationResult");
const resultText = document.getElementById("activationResultText");
const button = document.getElementById("activateButton");
const label = document.getElementById("activateButtonLabel");

if (button) button.disabled = true;
if (label) label.textContent = "Confirmation du paiement...";

resultText.textContent = `Nous confirmons votre paiement auprès de PayDunya. Ne fermez pas cette page.`;
result.hidden = false;
result.scrollIntoView({ behavior: "smooth", block: "nearest" });

const debut = Date.now();
let termine = false;

const arret = onSnapshot(doc(db, "users", session.user.uid), (snap) => {

if (termine) return;

const data = snap.data() || {};
const paiement = data.dernierPaiementLe ? new Date(data.dernierPaiementLe).getTime() : 0;

// Une confirmation "récente" seulement : un ancien paiement ne doit
// pas faire passer pour réussi un retour qui ne l'est pas.
if (!paiement || paiement < debut - FENETRE_PAIEMENT_MS) return;

termine = true;
arret();

trackEvent("payment_completed", { plan: plan.id, uid: session.user.uid });

sessionStorage.setItem("just_upgraded", plan.label);
sessionStorage.removeItem("scholarbridgeCheckout");

resultText.textContent = `Paiement confirmé — ${plan.label} est activé. Redirection vers votre espace...`;

// Le profil tel que le serveur le connaît à cet instant : un compte
// créé au paiement a un profil vide, il ira au profil.
const profil = Object.assign({}, (session.profile || {}), data.profile || {});

setTimeout(() => {
window.location.href = resolvePostActivationTarget(plan.id, profil);
}, 1600);

}, (error) => {

console.error("Suivi de l'activation interrompu :", error);

});

// Au-delà d'une minute et demie, on cesse de faire attendre devant un
// écran figé — sans jamais prétendre que le paiement a échoué : il est
// probablement passé, et le webhook finira par arriver. On dit
// exactement ce qu'on sait.
setTimeout(() => {

if (termine) return;

resultText.textContent =
"Votre paiement est enregistré chez PayDunya, mais sa confirmation nous parvient avec du retard. "
+ "Votre accès s'ouvrira automatiquement d'ici quelques minutes — vous pouvez fermer cette page. "
+ "Si rien ne change d'ici une heure, écrivez-nous, nous avons la trace de votre paiement.";

}, 90000);

}

function bootstrap(session) {

const planId = getRequestedPlanId();

if (!planId) {

window.location.replace("offers.html");
return;

}

const plan = SCHOLARBRIDGE_PLANS[planId];
const etatPaiement = new URLSearchParams(window.location.search).get("paiement");

initCompteRequis(session, planId);
renderPlan(plan, session);
initFitzRotator();
initPaymentMethods(plan);
initActivation(plan, session);
initReveal();

// Retour de PayDunya. `?paiement=ok` déclenche l'ATTENTE de la
// confirmation serveur, jamais l'activation elle-même : ce paramètre
// se réécrit à la main dans la barre d'adresse, il ne vaut donc rien
// comme preuve.
if (etatPaiement === "ok" && session) {

attendreActivation(plan, session);

} else if (etatPaiement === "annule") {

const result = document.getElementById("activationResult");
const resultText = document.getElementById("activationResultText");

// Dire explicitement « vous n'avez pas été débité » : c'est la
// première question que se pose quelqu'un qui vient d'abandonner un
// paiement, et le silence sur ce point crée des messages au support.
resultText.textContent =
"Paiement annulé — vous n'avez pas été débité. "
+ "Votre choix est conservé : relancez quand vous voulez.";

result.hidden = false;

}

if (window.lucide) lucide.createIcons();

}

resolveSession().then(bootstrap).catch((error) => {

// Une session qu'on n'arrive pas à vérifier doit se comporter comme
// une absence de session (formulaire de compte affiché) plutôt que
// de bloquer la page : voir la note en tête de fichier sur
// resolveSession() vs requireAuth().
console.error("Vérification de session ignorée sur la page de paiement :", error);
bootstrap(null);

});
