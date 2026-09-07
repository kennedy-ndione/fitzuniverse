// -------- dashboard.js — « Mon parcours » (refonte 2026-08-30) --------
// L'espace étudiant n'est plus un tableau de bord à sidebar : c'est un
// parcours en six phases (profil → opportunités → dossiers → dépôt →
// réponse & bourse → visa & départ), calculé sur les données réelles.
// Ce fichier ORCHESTRE et AFFICHE ; les décisions viennent des modules
// testables déjà en place — rien n'est recalculé une deuxième fois :
//   - js/journey-map.js        : état des 6 phases + radar d'échéances
//   - js/next-action.js        : LA prochaine action (prérequis compris)
//   - js/application-journey.js: les étapes réelles de chaque dossier
//   - js/recommend-programs.js : opportunités compatibles + raisons
//   - js/profile-score.js      : score de profil X/10

import { db } from "./firebase-config.js";
import { collection, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { calculateAiScore, PROFILE_READY_THRESHOLD } from "./js/profile-score.js";
import { initShellChrome, bootstrapShell, PLAN_LABELS, nextPlanId, isFeatureLocked, applyFeatureLocks } from "./js/app-shell.js";
// retenirOpportunites : la MEME selection que results.js (le diagnostic
// gratuit) — cinq filtres, dedoublonnage par bourse et par universite,
// plafond par pays. Voir chargerOpportunites() plus bas.
import { retenirOpportunites } from "./js/recommend-programs.js";
import { computeJourneySteps } from "./js/application-journey.js";
import { prochaineAction, qualifierEtapes, joursRestants, LIBELLE_PREREQUIS } from "./js/next-action.js";
import { PHASES, etatDesPhases, radarEcheances, tonEcheance, STATUTS_DEPOSES, STATUTS_REPONSE, VISA_ETAPES } from "./js/journey-map.js";

// Chargeur de catalogue partagé et mémoïsé — voir js/catalog-data.js.
import { chargerCatalogue } from "./js/catalog-data.js";
// Passe espace étudiant 1/3 (2026-09-06) : chaque candidature est reliée
// à sa fiche du catalogue et porte l'état que la fiche publie
// (`app.echeance`) — consommé par la prochaine action, le radar et les
// cartes de dossier. Jamais une écriture.
import { indexerCatalogue, etatDeLaCandidature } from "./js/candidature-catalogue.js";

// ==========================================================
// CATALOGUE — un seul chargement pour les TROIS besoins de la page
// (compter les opportunités compatibles, proposer les 3 meilleures,
// et relier les candidatures à leur fiche). Même jointure et même
// moteur que applications.js — jamais une deuxième façon de compter
// (voir js/recommend-programs.js).
// ==========================================================
async function chargerOpportunites(profile) {

try {

const catalogue = await chargerCatalogue();

const index = indexerCatalogue(catalogue);

const renommer = ({ id, ...reste }) => ({ firestoreId: id, ...reste });

const programs = catalogue.programmes.map(renommer);
const universitiesById = new Map(catalogue.universites.map((u) => [u.id, renommer(u)]));
const scholarshipsById = new Map(catalogue.bourses.map((s) => [s.id, renommer(s)]));

// L'ESPACE PAYANT RECOMMANDAIT MOINS BIEN QUE LE DIAGNOSTIC GRATUIT
// (corrigé le 2026-09-06, passe espace étudiant 2/3)
//
// Ici tournait `recommendPrograms(...).filter(m => m.score > 0)`. Ce
// tri-là garde tout ce qui n'est pas négatif, donne +1 au statut
// « Ouverte » — que 167 programmes affichent pour 39 dates réellement
// futures — et ne filtre NI le cycle visé, NI l'échéance, NI les
// doublons de bourse. Le diagnostic gratuit, lui, passe par
// retenirOpportunites() : cinq filtres, dédoublonnage par bourse et
// par université, plafond par pays.
//
// Autrement dit, l'étudiant qui PAYAIT recevait la liste la moins
// travaillée des deux. On sert désormais la même que results.js — une
// seule définition de « ce qui correspond à ce profil ».
const selection = retenirOpportunites({
profile: profile || {},
programs,
universitiesById,
scholarshipsById
});

// On rend `selection` tel quel : `nombre`, `ouvertes` et `pays` sont
// déjà calculés là-bas. Les recompter ici serait la deuxième source de
// vérité que cette passe supprime.
return { selection, count: selection.nombre, top: selection.retenues.slice(0, 3), index };

} catch (error) {

console.warn("Impossible de charger les opportunités compatibles :", error);
return { count: 0, top: [], index: null };

}

}

function readStorage(key, fallback) {
try {
const value = JSON.parse(localStorage.getItem(key));
return value || fallback;
} catch {
return fallback;
}
}

// ==========================================================
// RENDU — salutation, prochaine action, rail, radar
// ==========================================================

const NOMS_PHASES = Object.fromEntries(PHASES.map((p) => [p.id, p.label]));

function renderHello(nom, phases) {

const courante = phases.find((p) => p.courante);

document.getElementById("welcomeMessage").textContent = `Bonjour ${nom}`;

document.getElementById("jyPhaseLine").innerHTML =
`Vous êtes à la phase <strong>${NOMS_PHASES[courante.id] || ""}</strong> de votre parcours.`;

}

const KICKERS = {
critique: "À faire maintenant",
haute: "Prioritaire",
normale: "Votre prochaine action",
exploration: "Quand vous voulez"
};

function renderProchaineAction(action) {

const section = document.getElementById("jyAction");

section.classList.remove("jy-action--critique", "jy-action--haute");
if (action.urgence === "critique") section.classList.add("jy-action--critique");
if (action.urgence === "haute") section.classList.add("jy-action--haute");

document.getElementById("jyActionKicker").textContent = KICKERS[action.urgence] || "Votre prochaine action";
document.getElementById("jyActionTitle").textContent = action.titre;
document.getElementById("jyActionText").textContent = action.texte;
document.getElementById("jyActionCta").setAttribute("href", action.href);
document.getElementById("jyActionCtaLabel").textContent = action.cta;

section.hidden = false;

}

function renderRail(phases, progressionPct) {

const rail = document.getElementById("jyRail");

rail.innerHTML = phases.map((phase, idx) => `
<a href="#phase-${phase.id}" class="jy-rail-item ${phase.faite ? "is-done" : ""} ${phase.courante ? "is-current" : ""}">
<span class="jy-rail-dot"><i data-lucide="${phase.faite ? "check" : phase.icon}"></i></span>
<span class="jy-rail-label">${idx + 1}. ${phase.label}</span>
</a>
`).join("");

document.getElementById("jyProgressLine").innerHTML =
progressionPct >= 100
? `<strong>Parcours accompli à 100 %</strong> — bon voyage, et bonne rentrée !`
: `Parcours accompli à <strong>${progressionPct} %</strong> — chaque phase se déverrouille avec de vraies avancées, jamais avec des clics.`;

}

function renderRadar(applications) {

const radar = document.getElementById("jyRadar");
const chips = document.getElementById("jyRadarChips");
const entries = radarEcheances(applications);

if (!entries.length) {
radar.hidden = true;
return;
}

chips.innerHTML = entries.map(({ app, jours }) => {

const quand = jours < 0
? `dépassée de ${Math.abs(jours)} j`
: jours === 0 ? "aujourd'hui"
: `${jours} j`;

return `<a href="applications.html" class="jy-radar-chip jy-radar-chip--${tonEcheance(jours)}">${app.university || "Candidature"} · <strong>${quand}</strong></a>`;

}).join("");

radar.hidden = false;

}

// ==========================================================
// ÉTATS DE PHASE (pastille en tête de chaque section)
// ==========================================================
function renderEtatsPhases(phases) {

const cibles = {
profil: "stateProfil",
opportunites: "stateOpportunites",
dossiers: "stateDossiers",
depot: "stateDepot",
reponse: "stateReponse",
depart: "stateDepart"
};

phases.forEach((phase) => {

const el = document.getElementById(cibles[phase.id]);
if (!el) return;

const section = el.closest(".jy-phase");
section.classList.toggle("is-done", phase.faite);
section.classList.toggle("is-current", phase.courante);

if (phase.faite) {
el.innerHTML = `<i data-lucide="check-circle"></i>Faite`;
} else if (phase.courante) {
el.innerHTML = `<i data-lucide="circle-dot"></i>Vous êtes ici`;
} else {
el.innerHTML = `<i data-lucide="circle"></i>À venir`;
}

});

}

// ==========================================================
// PHASE 1 — PROFIL
// ==========================================================
function renderProfil(score) {

document.getElementById("jyProfileScore").textContent = score;

document.getElementById("jyProfileCopy").textContent =
score >= PROFILE_READY_THRESHOLD
? "Votre profil est assez complet pour que Fitz travaille avec précision. Tenez-le à jour : chaque détail nourrit vos lettres et vos recommandations."
: `Votre profil est à ${score}/10. Sous ${PROFILE_READY_THRESHOLD}/10, les lettres et vérifications de Fitz restent génériques — complétez-le avant de produire quoi que ce soit.`;

const cta = document.getElementById("jyProfileCta");
if (score >= PROFILE_READY_THRESHOLD) {
cta.querySelector("span").textContent = "Mettre à jour mon profil";
} else {
cta.classList.add("jy-btn--primary");
}

}

// ==========================================================
// PHASE 2 — OPPORTUNITÉS
// ==========================================================
function renderOpportunites(opps, profileScore) {

const grid = document.getElementById("jyOpps");
const sub = document.getElementById("jyOppsSub");

if (profileScore < PROFILE_READY_THRESHOLD && !opps.top.length) {
sub.textContent = "Complétez d'abord votre profil : c'est lui que Fitz croise avec le catalogue pour repérer où votre dossier est compétitif.";
grid.innerHTML = "";
return;
}

// « Fitz A RETENU N », jamais « il n'existe que N » : le chiffre dit le
// travail de selection, pas une penurie. Meme phrase que results.js —
// un etudiant qui passe du diagnostic a son espace doit reconnaitre la
// meme voix et le meme compte.
const n = opps.count;
const m = opps.selection ? opps.selection.ouvertes : 0;

sub.textContent = n > 0
// « ouvertes » s'accorde avec « candidatures », toujours au pluriel —
// jamais avec M : « dont 0 aux candidatures encore ouverte » était une
// faute d'accord.
? `Fitz a retenu ${n} opportunité${n > 1 ? "s" : ""} pour votre profil, dont ${m} aux candidatures encore ouvertes.`
: "Le catalogue n'a pas encore de correspondance nette avec votre profil — explorez-le librement, il s'enrichit chaque semaine.";

grid.innerHTML = opps.top.map((pick) => `
<article class="jy-card jy-opp" style="margin-bottom:0;">
<h3>${pick.scholarshipTitle || "Programme"}</h3>
<p class="jy-opp-uni">${pick.universityName}</p>
${pick.reasons && pick.reasons.length ? `<p class="jy-opp-reason"><i data-lucide="check"></i><span>${pick.reasons[0]}</span></p>` : ""}
<a href="applications.html?action=new" class="jy-btn"><span>Suivre cette candidature</span><i data-lucide="arrow-right"></i></a>
</article>
`).join("");

}

// ==========================================================
// PHASE 3 — DOSSIERS (une carte + mini-stepper par candidature)
// ==========================================================
function renderEtapesChips(etapes) {

return qualifierEtapes(etapes).map((etape) => {

const classes = [
"jy-step",
etape.etat === "faite" ? "is-done" : "",
etape.etat === "prematuree" ? "is-premature" : ""
].filter(Boolean).join(" ");

const infobulle = etape.etat === "prematuree"
? `${etape.label} — à faire après ${etape.bloquePar.map((id) => LIBELLE_PREREQUIS[id] || id).join(" et ")}`
: etape.label;

return `<a href="${etape.href || "applications.html"}" class="${classes}" title="${infobulle}">
<i data-lucide="${etape.etat === "faite" ? "check" : etape.icon}"></i><span>${etape.label}</span>
</a>`;

}).join("");

}

const STATUS_LABELS = {
a_preparer: "À préparer",
en_cours: "En préparation",
deposee: "Déposée",
en_attente: "En attente de réponse",
reponse_recue: "Réponse reçue (à préciser)",
admise: "Admise",
liste_attente: "Liste d'attente",
refusee: "Refusée"
};

function renderDossiers(applications) {

const wrap = document.getElementById("jyApps");

const enPreparation = applications.filter((app) => !STATUTS_DEPOSES.includes(app.status));

if (!enPreparation.length) {

wrap.innerHTML = applications.length
? ""
: `<div class="jy-card jy-empty">Aucun dossier en préparation pour l'instant. Choisissez une opportunité en phase 02, puis <a href="applications.html?action=new">suivez votre première candidature</a>.</div>`;

return;

}

wrap.innerHTML = enPreparation.map((app) => {

// Candidature liée au catalogue : la pastille porte l'état publié par
// la fiche (`etat.ton` : ouverte / attente / close / inconnue) — plus
// jamais « Échéance dans N j » vers un cycle clos. Non liée : le
// calcul d'origine sur la date saisie, avec tonEcheance().
let echeance = "";

if (app.echeance && app.echeance.lie && app.echeance.etat) {
const etat = app.echeance.etat;
echeance = `<span class="jy-app-deadline is-${etat.ton}" title="${(etat.detail || "").replace(/"/g, "&quot;")}">${etat.etiquette} : ${etat.valeur}</span>`;
} else {
const jours = joursRestants(app.deadline, new Date());
echeance = jours === null ? "" :
`<span class="jy-app-deadline is-${tonEcheance(jours)}">${jours < 0 ? `Échéance dépassée de ${Math.abs(jours)} j` : jours === 0 ? "Échéance aujourd'hui" : `Échéance dans ${jours} j`}</span>`;
}

return `
<article class="jy-card">
<div class="jy-app-top">
<h3>${app.university || "Votre candidature"}</h3>
<span class="jy-app-meta">${[app.scholarship, STATUS_LABELS[app.status] || ""].filter(Boolean).join(" · ")}</span>
${echeance}
</div>
<div class="jy-steps">${renderEtapesChips(app.etapes)}</div>
</article>
`;

}).join("") + `
<div class="jy-phase-actions" style="margin-bottom:14px;">
<a href="applications.html" class="jy-btn"><i data-lucide="list-checks"></i><span>Ouvrir mes candidatures</span></a>
</div>`;

}

// ==========================================================
// PHASES 4 & 5 — DÉPÔT / RÉPONSE
// ==========================================================
function renderDepot(applications) {

const wrap = document.getElementById("jyDepot");
const deposees = applications.filter((app) => STATUTS_DEPOSES.includes(app.status));

if (!deposees.length) {
wrap.innerHTML = "";
return;
}

wrap.innerHTML = `
<div class="jy-card">
<ul class="jy-list">
${deposees.map((app) => `
<li><i data-lucide="${STATUTS_REPONSE.includes(app.status) ? "mail-open" : "send"}"></i>
<span><strong>${app.university || "Candidature"}</strong> — <span class="jy-status-pill ${["reponse_recue", "admise"].includes(app.status) ? "is-positive" : ""}">${STATUS_LABELS[app.status]}</span></span></li>
`).join("")}
</ul>
</div>`;

}

// Depuis le 2026-08-30 la phase 05 connaît l'ISSUE de chaque réponse
// (admise / refusée / liste d'attente) et réagit en conséquence :
// félicitations et cap sur le visa, rebond vers d'autres bourses, ou
// accompagnement de l'attente. `reponse_recue` (données existantes)
// = issue pas encore précisée → on invite à la préciser.
function renderReponse(applications, opportunitesCount) {

const wrap = document.getElementById("jyReponse");
const reponses = applications.filter((app) => STATUTS_REPONSE.includes(app.status));

if (!reponses.length) {
wrap.innerHTML = "";
return;
}

const admissions = reponses.filter((app) => app.status === "admise");
const refus = reponses.filter((app) => app.status === "refusee");
const attente = reponses.filter((app) => app.status === "liste_attente");
const aPreciser = reponses.filter((app) => app.status === "reponse_recue");

const blocs = [];

if (admissions.length) {
blocs.push(`
<div class="jy-card jy-reponse jy-reponse--admise">
<h3><i data-lucide="party-popper"></i>Félicitations — ${admissions.length > 1 ? `${admissions.length} admissions` : "vous êtes admis(e)"} !</h3>
<ul class="jy-list">
${admissions.map((app) => `<li><i data-lucide="award"></i><span><strong>${app.university || "Candidature"}</strong>${app.scholarship ? ` · ${app.scholarship}` : ""} — admission confirmée.</span></li>`).join("")}
</ul>
<p class="jy-opp-reason"><i data-lucide="file-badge"></i><span>Vérifiez si la bourse est automatique ou demande une confirmation séparée, gardez les originaux de la lettre d'admission — puis cap sur le dernier kilomètre.</span></p>
<div class="jy-tools">
<a href="#phase-depart" class="jy-btn jy-btn--primary"><i data-lucide="plane"></i><span>Passer au visa &amp; départ</span></a>
<span data-feature="ai_email"><a href="ai-email.html" data-real-href="ai-email.html" class="jy-tool"><i data-lucide="mail"></i><span>Confirmer ma place par e-mail</span><i class="jy-lock" data-lucide="lock"></i></a></span>
</div>
</div>`);
}

if (attente.length) {
blocs.push(`
<div class="jy-card jy-reponse">
<h3><i data-lucide="hourglass"></i>Liste d'attente — rien n'est perdu</h3>
<ul class="jy-list">
${attente.map((app) => `<li><i data-lucide="clock"></i><span><strong>${app.university || "Candidature"}</strong> — sur liste d'attente. Un court e-mail confirmant votre intérêt (et toute pièce nouvelle : résultat de test, distinction) peut faire la différence.</span></li>`).join("")}
</ul>
<div class="jy-tools">
<span data-feature="ai_email"><a href="ai-email.html" data-real-href="ai-email.html" class="jy-tool"><i data-lucide="mail"></i><span>Écrire l'e-mail d'intérêt</span><i class="jy-lock" data-lucide="lock"></i></a></span>
</div>
</div>`);
}

if (refus.length) {
blocs.push(`
<div class="jy-card jy-reponse">
<h3><i data-lucide="compass"></i>Refus — on rebondit</h3>
<ul class="jy-list">
${refus.map((app) => `<li><i data-lucide="corner-up-right"></i><span><strong>${app.university || "Candidature"}</strong> — refusée. Un refus dit rarement quelque chose de votre valeur : les taux d'admission des bourses sélectives sont très bas, et votre dossier est déjà prêt à resservir.</span></li>`).join("")}
</ul>
<p class="jy-opp-reason"><i data-lucide="target"></i><span>${opportunitesCount > 0 ? `${opportunitesCount} autre${opportunitesCount > 1 ? "s" : ""} opportunité${opportunitesCount > 1 ? "s" : ""} du catalogue correspond${opportunitesCount > 1 ? "ent" : ""} à votre profil — vos lettres, traductions et relevés sont réutilisables tout de suite.` : "Le catalogue s'enrichit chaque semaine — votre dossier déjà constitué est réutilisable tout de suite."}</span></p>
<div class="jy-tools">
<a href="#phase-opportunites" class="jy-btn"><i data-lucide="compass"></i><span>Voir mes autres opportunités</span></a>
<a href="applications.html?action=new" class="jy-tool"><i data-lucide="plus"></i><span>Lancer une nouvelle candidature</span></a>
</div>
</div>`);
}

if (aPreciser.length) {
blocs.push(`
<div class="jy-card jy-reponse">
<h3><i data-lucide="mail-question"></i>Réponse reçue — précisez l'issue</h3>
<ul class="jy-list">
${aPreciser.map((app) => `<li><i data-lucide="mail-open"></i><span><strong>${app.university || "Candidature"}</strong> — indiquez si c'est une admission, un refus ou une liste d'attente : votre parcours s'adaptera aussitôt.</span></li>`).join("")}
</ul>
<div class="jy-tools">
<a href="applications.html" class="jy-btn"><i data-lucide="list-checks"></i><span>Préciser dans mes candidatures</span></a>
</div>
</div>`);
}

wrap.innerHTML = blocs.join("");

}

// ==========================================================
// PHASE 6 — CHECKLIST VISA & DÉPART (cochable, persistée)
// ==========================================================
// L'état vit dans le champ `visaChecklist` (map id → bool) du document
// utilisateur — ids définis par VISA_ETAPES (js/journey-map.js), les
// mêmes que les data-visa-step de dashboard.html. Cocher une étape
// re-calcule la carte du voyage en direct (rail, pastilles, %).
function initVisaChecklist(uid, initial, rafraichirCarte) {

const etat = {};
VISA_ETAPES.forEach((id) => { etat[id] = initial && initial[id] === true; });

const steps = Array.from(document.querySelectorAll("#jyVisaGuide [data-visa-step]"));

function peindre() {

steps.forEach((step) => {
const id = step.getAttribute("data-visa-step");
const btn = step.querySelector(".jy-visa-check");
const fait = etat[id] === true;
step.classList.toggle("is-done", fait);
btn.setAttribute("aria-pressed", String(fait));
btn.innerHTML = fait
? `<i data-lucide="check-circle"></i><span>Fait</span>`
: `<i data-lucide="circle"></i><span>Marquer comme fait</span>`;
});

const faites = VISA_ETAPES.filter((id) => etat[id]).length;
document.getElementById("jyVisaProgress").textContent =
faites === VISA_ETAPES.length
? "6 étapes sur 6 — vous êtes prêt(e) au départ. Bon voyage !"
: `${faites} étape${faites > 1 ? "s" : ""} sur ${VISA_ETAPES.length} accomplie${faites > 1 ? "s" : ""}.`;

if (window.lucide) lucide.createIcons();

}

steps.forEach((step) => {
step.querySelector(".jy-visa-check").addEventListener("click", async () => {

const id = step.getAttribute("data-visa-step");
etat[id] = !etat[id];
peindre();
rafraichirCarte({ ...etat });

// Persistance en arrière-plan — l'interface n'attend pas le
// réseau ; en cas d'échec, l'état local reste juste et la
// prochaine visite repartira du serveur.
try {
await updateDoc(doc(db, "users", uid), { visaChecklist: { ...etat } });
} catch (error) {
console.warn("Impossible d'enregistrer la checklist visa :", error);
}

});
});

peindre();

}

// ==========================================================
// BANNIÈRES — mêmes règles qu'avant la refonte
// ==========================================================
function renderFitzExpressBanner(planId, hasFitzExpress, fitzExpressExpiresAt) {

const banner = document.getElementById("fitzExpressBanner");

if (!hasFitzExpress || planId !== "gratuit" || !fitzExpressExpiresAt) {
banner.hidden = true;
return;
}

const expiry = new Date(fitzExpressExpiresAt);
if (isNaN(expiry)) { banner.hidden = true; return; }

const daysLeft = Math.max(0, Math.ceil((expiry.getTime() - Date.now()) / 86400000));
document.getElementById("fitzExpressDaysLeft").textContent =
daysLeft <= 1 ? "moins d'1 jour" : `${daysLeft} jours`;

banner.hidden = false;

}

function renderUpgradeNudge(planId, testerAccess) {

const section = document.getElementById("upgradeNudge");
if (!section) return;

if (testerAccess) { section.hidden = true; return; }

const next = nextPlanId(planId);
const hasPlanData = typeof SCHOLARBRIDGE_PLANS !== "undefined" && SCHOLARBRIDGE_PLANS[next];

if (!next || !hasPlanData) { section.hidden = true; return; }

document.getElementById("upgradeCurrentPlan").textContent = PLAN_LABELS[planId];
document.getElementById("upgradeNextPlan").textContent = PLAN_LABELS[next];

// En ligne plutôt qu'en liste à puces : la montée en gamme est une
// note de bas de parcours, pas une section qui rivalise avec les
// phases (refonte 2026-08-30).
document.getElementById("upgradeHighlightsInline").textContent =
(SCHOLARBRIDGE_PLANS[next].highlights || []).slice(0, 2).join(" · ") + ".";

document.getElementById("upgradeCta").setAttribute("href", `offers.html#${next}`);

section.hidden = false;

}

// ==========================================================
// AMORÇAGE
// ==========================================================
initShellChrome();

bootstrapShell().then(async (session) => {

if (!session) return;

const { user, userData, profile, planId, featureFlags, testerAccess, hasFitzExpress } = session;

// Migration héritée (ai-letter.js écrivait sous une autre clé) —
// conservée telle quelle, voir l'historique du fichier.
const legacyDocuments = readStorage("documents", null);
if (legacyDocuments && legacyDocuments.length) {
const merged = [...legacyDocuments, ...readStorage("generatedDocuments", [])];
localStorage.setItem("generatedDocuments", JSON.stringify(merged));
localStorage.removeItem("documents");
}

// ---- Bannières d'événement (création de compte, activation) ----
if (sessionStorage.getItem("just_created") === "true") {
document.getElementById("welcomeAlert").hidden = false;
sessionStorage.removeItem("just_created");
}

if (sessionStorage.getItem("just_upgraded")) {
document.getElementById("accompagnementAlertTitle").textContent =
`Votre accompagnement ${sessionStorage.getItem("just_upgraded")} est activé.`;
document.getElementById("accompagnementAlert").hidden = false;
sessionStorage.removeItem("just_upgraded");
}

const emailNudge = document.getElementById("emailNudge");
if (emailNudge) emailNudge.hidden = userData.emailNotifications === true;

renderFitzExpressBanner(planId, hasFitzExpress, userData.fitzExpressExpiresAt || null);
renderUpgradeNudge(planId, testerAccess);

// « Mon conseiller » en phase 06 — visible seulement pour les forfaits
// avec humain, même règle que partout (isFeatureLocked).
const advisorBtn = document.getElementById("jyAdvisorBtn");
if (advisorBtn) {
advisorBtn.hidden = isFeatureLocked(planId, featureFlags, "advisor", testerAccess, hasFitzExpress);
}

// ---- Données du parcours ----
const profileScore = calculateAiScore(profile);

let applications = [];
try {
const applicationsSnap = await getDocs(collection(db, "users", user.uid, "applications"));
applications = applicationsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
} catch (error) {
console.error("Impossible de charger les candidatures :", error);
}

const opps = await chargerOpportunites(profile);

// Étapes réelles de chaque dossier — calculées UNE fois, réutilisées
// par la prochaine action, les phases et les cartes. Et, depuis la
// passe 1/3, l'état publié par la fiche du catalogue (`echeance`) :
// posé AVANT tout rendu, lu par next-action.js, journey-map.js
// (radar) et renderDossiers. Sans catalogue, `echeance` reste absent
// et tout se calcule comme avant sur la date saisie.
applications = applications.map((app) => ({
...app,
etapes: computeJourneySteps(app, { profileScore, documentsObtained: userData?.documentsObtained || {} }),
echeance: opps.index ? etatDeLaCandidature(app, opps.index) : null
}));

// ---- La carte du voyage ----
const visaChecklist = userData.visaChecklist || {};
const nomAffiche = user.displayName || userData.name || "Étudiant";

// Re-calcule et re-peint la carte (rail, pastilles, salutation) — la
// checklist visa la rappelle à chaque étape cochée, pour que la
// phase 06 vive comme les autres.
function rafraichirCarte(visa) {
const etat = etatDesPhases({ profileScore, applications, visaChecklist: visa });
renderHello(nomAffiche, etat.phases);
renderRail(etat.phases, etat.progressionPct);
renderEtatsPhases(etat.phases);
// Le rail et les pastilles viennent d'être re-injectés : leurs
// icônes doivent être re-transformées ici même (le createIcons de
// fin d'amorçage est déjà passé lors d'un rafraîchissement).
if (window.lucide) lucide.createIcons();
return etat;
}

rafraichirCarte(visaChecklist);
renderRadar(applications);

// La prochaine action ne se calcule que sur les dossiers ENCORE EN
// PRÉPARATION : une candidature déjà déposée n'a plus de checklist à
// pousser — sans ce filtre, une échéance passée sur un dossier déposé
// déclenchait un « À faire maintenant » à contresens (constaté sur la
// session de test du 2026-08-30, candidature Waseda en attente de
// réponse dont la date limite était passée).
renderProchaineAction(prochaineAction({
profileScore,
applications: applications.filter((app) => !STATUTS_DEPOSES.includes(app.status)),
opportunitesCount: opps.count
}));

renderProfil(profileScore);
renderOpportunites(opps, profileScore);
renderDossiers(applications);
renderDepot(applications);
renderReponse(applications, opps.count);

// Les cartes de réponse viennent d'insérer des [data-feature] : on
// re-applique les verrous de formule sur ce DOM neuf.
applyFeatureLocks(planId, featureFlags, testerAccess, hasFitzExpress);

initVisaChecklist(user.uid, visaChecklist, rafraichirCarte);

if (window.lucide) lucide.createIcons();

});
