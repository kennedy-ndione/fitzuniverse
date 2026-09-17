/**
 * ============================================================
 * espace-preinscription.js — le moteur de LA ROUTE (lot R1, 2026-09-17)
 * ============================================================
 *
 * Remplace dashboard.js pour espace-preinscription.html. L'espace bourse
 * garde dashboard.js jusqu'à sa propre refonte (lot R3).
 *
 * CE QUE CE FICHIER FAIT, ET RIEN D'AUTRE
 * ---------------------------------------
 *  1. charge la session (js/app-shell.js), les vœux (applications du
 *     parcours préinscription) et la procédure du pays de résidence ;
 *  2. demande la route à js/route-preinscription.js (pur, testé) ;
 *  3. peint UNE étape — la courante, ou celle que l'étudiant a choisi de
 *     regarder — le fil des quinze, et la liste des autres ;
 *  4. enregistre chaque geste (situation, vœu, pièce, « C'est fait »,
 *     lettre, réponse, démarche visa) et repeint.
 *
 * OÙ VIVENT LES DONNÉES
 * ---------------------
 *  users/{uid}.profile               la situation (mêmes clés que profile.html)
 *  users/{uid}.diagnosticFrance      écrit par diagnostic-france.html
 *  users/{uid}.dossierFrance         { etapes:{id:{faite,faitLe,preuve}}, pieces:{slug:true} }
 *  users/{uid}.visaChecklist         les six démarches du départ (inchangé)
 *  users/{uid}/applications/pre-N    un vœu : university, formation, niveau,
 *                                    status, motivation:{faite,faitLe}, preuveDepot
 *
 * LES RÈGLES FIRESTORE NE CHANGENT PAS : l'étudiant peut écrire tout
 * champ de son document sauf ceux de la formule ; un vœu naît sur un
 * créneau pre-N (quota de la formule) ; un statut déposé exige une
 * preuveDepot valide — on l'écrit sur chaque vœu au moment où l'étudiant
 * déclare son numéro de dossier (étape 9), puisque sur Études en France
 * un seul dossier porte tous les vœux.
 * ============================================================
 */

import { db } from "./firebase-config.js";
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { initShellChrome, bootstrapShell, applyFeatureLocks, isFeatureLocked } from "./js/app-shell.js";
import { trouverProcedure } from "./js/procedures/index.js";
import { lireParcours } from "./js/parcours.js";
import { quotaDeLaFormule } from "./js/parcours-quota.js";
import { slotIdLibre } from "./js/application-actions.js";
import { boutonRecours } from "./js/fitz-recours.js";
import { guideVisaPour } from "./js/visa-depart.js";
import { VISA_ETAPES } from "./js/journey-map.js";
import { COUNTRY_NAMES } from "./js/countries.js";
import { chargerUniversites } from "./js/catalog-data.js";
import { PLAN_PREINSCRIPTION_LABELS } from "./js/plan-features.js";
import {
  construireRoute, phraseDeRoute, QUESTIONS_SITUATION, NIVEAUX_VOEU, REPONSES_VOEU,
  PAYS_DESTINATION, PLAFOND_VOEUX, PORTAIL_ETUDES_EN_FRANCE, TOTAL_ETAPES
} from "./js/route-preinscription.js";
// Les deux composants guidés (pastilles d'exemples, champ à suggestions)
// sont partagés avec « Mon profil » : js/champs-guides.js + css/guide.css.
import { EXEMPLES, htmlChips, htmlSuggest, brancherChampsGuides } from "./js/champs-guides.js";

// ==========================================================
// Outillage
// ==========================================================
function ech(v) {
  return String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

function dateLongue(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || ""));
  if (!m) return "";
  return `${parseInt(m[3], 10)} ${MOIS[parseInt(m[2], 10) - 1]} ${m[1]}`;
}

function aujourdhuiISO() {
  return new Date().toISOString().slice(0, 10);
}

function formatMontant(montant, devise) {
  if (typeof montant !== "number") return "";
  const n = montant.toLocaleString("fr-FR").replace(/[\u202f\u00a0]/g, " ");
  return devise === "XOF" ? `${n} F CFA` : devise === "EUR" ? `${n} €` : `${n} ${devise || ""}`.trim();
}

function icones() {
  if (window.lucide) lucide.createIcons();
}

let toastTimer = null;
function toast(message, type = "") {
  let el = document.getElementById("rtToast");
  if (!el) {
    el = document.createElement("div");
    el.id = "rtToast";
    el.className = "rt-toast";
    el.setAttribute("role", "status");
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.toggle("is-erreur", type === "error");
  el.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("is-visible"), 3200);
}

// ==========================================================
// L'état de la page
// ==========================================================
const etat = {
  session: null,
  profile: {},
  userData: {},
  dossier: {},
  voeux: [],
  procedure: null,
  route: null,
  choisie: null,          // l'id de l'étape affichée
  quota: null,
  universites: null,      // les universités françaises du catalogue, pour la liste d'aide
  conseiller: false
};

function refUser() {
  return doc(db, "users", etat.session.user.uid);
}

function recomposer() {
  const residence = (etat.profile && (etat.profile.country || etat.profile.originCountry)) || "";
  etat.procedure = trouverProcedure({ paysDestination: "France", portailUrl: PORTAIL_ETUDES_EN_FRANCE, paysResidence: residence });
  etat.route = construireRoute({
    procedure: etat.procedure,
    profile: etat.profile,
    diagnostic: etat.userData.diagnosticFrance || null,
    voeux: etat.voeux,
    dossier: etat.dossier,
    visaChecklist: etat.userData.visaChecklist || {}
  });
  if (!etat.choisie || !etat.route.etapes.some((e) => e.id === etat.choisie)) {
    etat.choisie = etat.route.courante ? etat.route.courante.id : etat.route.etapes[etat.route.etapes.length - 1].id;
  }
}

/** Après un geste : la première étape non faite APRÈS celle-ci, sinon la courante. */
function prochaineApres(id) {
  const i = etat.route.etapes.findIndex((x) => x.id === id);
  const suivante = etat.route.etapes.slice(i + 1).find((x) => !x.faite);
  if (suivante) return suivante.id;
  return etat.route.courante ? etat.route.courante.id : id;
}

function etapeChoisie() {
  return etat.route.etapes.find((e) => e.id === etat.choisie);
}

// ==========================================================
// Le haut : la phrase, le fil, la barre
// ==========================================================
function peindreTete() {
  const nom = etat.session.user.displayName || etat.userData.name || (etat.profile && etat.profile.firstName) || "";
  const prenom = String(nom).trim().split(/\s+/)[0] || "";
  document.getElementById("welcomeMessage").textContent = prenom ? `Bonjour ${prenom}` : "Bonjour";
  document.getElementById("rtLigne").textContent = phraseDeRoute(etat.route);

  const fil = document.getElementById("rtFil");
  fil.innerHTML = etat.route.etapes.map((e) => `
    <button type="button" class="rt-point is-${e.etat}${e.id === etat.choisie ? " is-choisie" : ""}" data-etape="${ech(e.id)}" title="${ech(`${e.numero}. ${e.titre}`)}" aria-label="${ech(`Étape ${e.numero} : ${e.titre}`)}" aria-current="${e.id === etat.choisie ? "step" : "false"}">
      <span class="rt-point-num">${e.faite ? `<i data-lucide="check"></i>` : e.numero}</span>
    </button>`).join("");

  const barre = document.getElementById("rtBarre");
  barre.style.setProperty("--rt-pct", `${etat.route.pourcentage}%`);
  document.getElementById("rtBarreTexte").textContent = etat.route.faites
    ? `${etat.route.faites} étape${etat.route.faites > 1 ? "s" : ""} faite${etat.route.faites > 1 ? "s" : ""} sur ${etat.route.total}`
    : `${etat.route.total} étapes, dans l'ordre`;
}

// ==========================================================
// L'étape affichée
// ==========================================================
function htmlEcheance(e) {
  if (!e.echeance) return "";
  const j = e.echeance.jours;
  const ton = j === null ? "" : j < 0 ? "is-passee" : j <= 14 ? "is-proche" : "";
  const quand = e.echeance.debut
    ? `À partir du <strong>${ech(dateLongue(e.echeance.iso))}</strong>`
    : `Avant le <strong>${ech(dateLongue(e.echeance.iso))}</strong>`;
  const reste = j === null ? "" : j < 0 ? ` — dépassé de ${Math.abs(j)} jour${Math.abs(j) > 1 ? "s" : ""}` : j === 0 ? " — c'est aujourd'hui" : ` — dans ${j} jour${j > 1 ? "s" : ""}`;
  return `<p class="rt-echeance ${ton}"><i data-lucide="calendar-clock"></i><span>${quand}${ech(reste)}${e.echeance.libelle ? ` · ${ech(e.echeance.libelle)}` : ""} · calendrier de votre pays de résidence.</span></p>`;
}

function htmlFaits(e) {
  const o = e.officielle;
  if (!o) return "";
  const parts = [];
  if (typeof o.montant === "number") parts.push(`<p class="rt-fait"><i data-lucide="wallet"></i><span><strong>${ech(formatMontant(o.montant, o.devise))}</strong> de frais de dossier, dans votre pays.</span></p>`);
  // La mention d'absence (pays non documenté, calendrier non publié) :
  // servie telle que la procédure la compose, jamais réécrite ici.
  if (o.mention) parts.push(`<p class="rt-mention"><i data-lucide="info"></i><span>${ech(o.mention)}</span></p>`);
  return parts.join("");
}

function htmlOfficiel(e) {
  const o = e.officielle;
  if (!o) return "";
  const sources = [o.source, o.sourceResidence].filter(Boolean);
  return `
    <details class="rt-officiel"${e.etat === "courante" ? " open" : ""}>
      <summary><i data-lucide="scroll-text"></i><span>Le texte officiel : « ${ech(o.titre)} »</span></summary>
      <p>${ech(o.consigne)}</p>
      ${sources.length ? `<p class="rt-source">Vérifié le ${ech(o.verifieLe)} · ${sources.map((s, i) => `<a href="${ech(s)}" target="_blank" rel="noopener noreferrer">${i === 0 ? "la source officielle" : "la page de votre pays"}</a>`).join(" · ")}</p>` : ""}
    </details>`;
}

function htmlOutils(e) {
  const outils = e.outils.filter((o) => !o.principal);
  if (!outils.length) return "";
  return `<div class="rt-outils">${outils.map((o) => `
    <span data-feature="${ech(o.feature)}"><a href="${ech(o.href)}" data-real-href="${ech(o.href)}" class="rt-outil"><i data-lucide="${ech(o.icone)}"></i><span>${ech(o.libelle)}</span></a></span>`).join("")}</div>`;
}

function htmlOutilPrincipal(e) {
  const o = e.outils.find((x) => x.principal);
  if (!o) return "";
  return `<span data-feature="${ech(o.feature)}"><a href="${ech(o.href)}" data-real-href="${ech(o.href)}" class="rt-btn rt-btn--fitz"><i data-lucide="${ech(o.icone)}"></i><span>${ech(o.libelle)}</span></a></span>`;
}

function htmlPortail(e) {
  if (e.kind !== "procedure" && e.kind !== "motivations" && e.kind !== "reponses" && e.kind !== "visa") return "";
  const p = etat.route.portail;
  return `<a href="${ech(p.url)}" target="_blank" rel="noopener noreferrer" class="rt-btn rt-btn--portail"><i data-lucide="external-link"></i><span>Ouvrir ${ech(p.nom)}</span></a>`;
}

/** Le geste : la preuve si elle est requise, et « C'est fait ». */
function htmlGeste(e) {
  if (["situation", "diagnostic", "voeux", "pieces", "motivations", "reponses"].includes(e.kind)) return "";
  const preuve = e.preuve.requise ? `
    <label class="rt-preuve">
      <span>${ech(e.preuve.libelle.charAt(0).toUpperCase() + e.preuve.libelle.slice(1))}</span>
      <input type="text" id="rtPreuve" maxlength="64" value="${ech(e.preuve.valeur)}" placeholder="${ech(e.id === "ef_soumission" ? "Le numéro que le portail vous a donné" : "La référence, pour la retrouver plus tard")}" autocomplete="off">
    </label>` : "";
  const libelleBouton = e.kind === "visa"
    ? (e.cochee ? "Visa demandé — annuler" : "J'ai déposé ma demande de visa")
    : (e.cochee ? "Fait — annuler" : "C'est fait");
  return `
    <div class="rt-geste">
      ${preuve}
      <button type="button" class="rt-btn rt-btn--fait${e.cochee ? " is-fait" : ""}" id="rtFait" aria-pressed="${e.cochee ? "true" : "false"}">
        <i data-lucide="${e.cochee ? "check-circle-2" : "circle"}"></i><span>${ech(libelleBouton)}</span>
      </button>
      ${e.cochee && e.faitLe ? `<span class="rt-faitle">le ${ech(dateLongue(e.faitLe))}</span>` : ""}
    </div>`;
}

/**
 * LES SOURCES DE SUGGESTIONS PROPRES À LA ROUTE.
 * Les pays viennent du référentiel du site ; les établissements, du
 * catalogue chargé après la première peinture (etat.universites) — la
 * fonction est relue à chaque frappe, donc la liste s'enrichit d'elle-même
 * sans rien re-peindre.
 */
const SOURCES_ROUTE = {
  pays: () => COUNTRY_NAMES,
  unis: () => etat.universites || []
};

// ---- Étape 1 : la situation ----
function htmlSituation(e) {
  const p = etat.profile || {};
  const champ = (q) => {
    const val = String(p[q.cle] || "");
    if (q.type === "pays") {
      return htmlSuggest(q.cle, val, "Commencez à écrire le nom du pays", "pays");
    }
    // Une liste longue (le domaine d'études) se cherche en tapant.
    if (q.type === "liste") {
      return htmlSuggest(q.cle, val, q.exemple || "", q.liste);
    }
    if (q.type === "choix") {
      const libelles = q.libelles || {};
      // Le composant de choix du site (.fitz-choice, css/base.css) : jamais
      // le rond du système (lot CONTRÔLES-UNIFIÉS).
      return `<div class="fitz-choice-group" role="radiogroup" aria-label="${ech(q.libelle)}">${q.options.map((o) => `
        <label class="fitz-choice"><input type="radio" name="${ech(q.cle)}" value="${ech(o)}"${val === o ? " checked" : ""}><span class="fitz-choice-dot" aria-hidden="true"></span><span>${ech(libelles[o] || o)}</span></label>`).join("")}</div>`;
    }
    return `<input type="text" name="${ech(q.cle)}" value="${ech(val)}" placeholder="${ech(q.exemple || "")}" autocomplete="off">${htmlChips(q.cle, q.suggestions ? EXEMPLES[q.suggestions] : null)}`;
  };
  return `
    <form class="rt-form" id="rtSituation" novalidate>
      ${QUESTIONS_SITUATION.map((q, i) => `
        <div class="rt-q">
          <label class="rt-q-libelle"><span class="rt-q-num">${i + 1}</span>${ech(q.libelle)}</label>
          ${champ(q)}
          ${q.aide ? `<p class="rt-q-aide">${ech(q.aide)}</p>` : ""}
        </div>`).join("")}
      <div class="rt-geste">
        <button type="submit" class="rt-btn rt-btn--fait"><i data-lucide="check-circle-2"></i><span>${e.faite ? "Mettre à jour" : "Enregistrer mes réponses"}</span></button>
        <a href="profile.html" class="rt-lien-discret">Le profil complet, si vous voulez en dire plus</a>
      </div>
    </form>`;
}

// ---- Étape 2 : le diagnostic ----
function htmlDiagnostic(e) {
  // Les champs sont ceux qu'écrit js/diagnostic-france-page.js :
  // `calculeLe` (et non « enregistreLe »), `totalAnnuelEUR`, `verdict`,
  // `etatVerdict`. Un nom inventé ici afficherait un bloc muet.
  const d = etat.userData.diagnosticFrance;
  if (e.faite && d) {
    const total = typeof d.totalAnnuelEUR === "number" ? `${formatMontant(Math.round(d.totalAnnuelEUR), "EUR")} pour l'année` : "";
    return `
      <div class="rt-verdict is-${ech(d.etatVerdict || "")}">
        <p class="rt-verdict-phrase">${ech(d.verdict || "Diagnostic enregistré.")}</p>
        ${total ? `<p class="rt-verdict-chiffre">${ech(total)}</p>` : ""}
        ${d.calculeLe ? `<p class="rt-verdict-date">Fait le ${ech(dateLongue(String(d.calculeLe).slice(0, 10)))}. Vos ressources ont changé ? Refaites-le, sans rien repayer.</p>` : ""}
      </div>
      <div class="rt-geste">${htmlOutilPrincipal(e).replace("Faire mon diagnostic avec Fitz", "Refaire mon diagnostic")}</div>`;
  }
  return `<div class="rt-geste">${htmlOutilPrincipal(e)}</div>`;
}

// ---- Étape 3 : les vœux ----
function htmlVoeux(e) {
  // Le Diagnostic France seul n'a aucune place de vœu (maxPreinscriptions
  // = 0) : on le dit, avec la porte vers la formule qui en a.
  if (etat.quota === 0) {
    return `<p class="rt-vide">Votre formule actuelle comprend le diagnostic, pas le suivi des vœux. Le Dossier France vous accompagne sur les ${PLAFOND_VOEUX} vœux, de la première pièce au visa.</p>
      <div class="rt-geste"><a href="offers.html" class="rt-btn rt-btn--fait"><i data-lucide="arrow-right"></i><span>Voir le Dossier France</span></a></div>`;
  }
  const quota = Number.isFinite(etat.quota) ? Math.min(etat.quota, PLAFOND_VOEUX) : PLAFOND_VOEUX;
  const reste = Math.max(0, quota - etat.voeux.length);
  const liste = etat.voeux.length ? `
    <ol class="rt-voeux">${etat.voeux.map((v) => `
      <li class="rt-voeu">
        <div class="rt-voeu-texte"><strong>${ech(v.university)}</strong><span>${ech([v.formation, v.niveau].filter(Boolean).join(" · "))}</span></div>
        <button type="button" class="rt-voeu-retirer" data-retirer="${ech(v.id)}" aria-label="Retirer ce vœu"><i data-lucide="x"></i></button>
      </li>`).join("")}</ol>` : `<p class="rt-vide">Aucun vœu pour l'instant. Le premier se pose ci-dessous.</p>`;
  const avert = etat.route.avertissementsVoeux.length ? `<ul class="rt-avert">${etat.route.avertissementsVoeux.map((a) => `<li><i data-lucide="alert-triangle"></i><span>${ech(a)}</span></li>`).join("")}</ul>` : "";
  const form = reste > 0 ? `
    <form class="rt-form rt-form--voeu" id="rtVoeu" novalidate>
      <p class="rt-form-titre">Ajouter un vœu <span class="rt-quota">${etat.voeux.length} sur ${quota}</span></p>
      <div class="rt-q"><span class="rt-q-libelle">L'établissement</span>${htmlSuggest("university", "", "Commencez à écrire : Université de Lille, IUT de Rennes…", "unis")}<p class="rt-q-aide">Les établissements français du catalogue vous sont proposés en tapant. Un autre établissement ? Écrivez son nom.</p></div>
      <div class="rt-q"><span class="rt-q-libelle">La formation</span>${htmlSuggest("formation", "", "Licence Informatique, Master Droit des affaires…", "formation")}</div>
      <div class="rt-q"><span class="rt-q-libelle">Le niveau d'entrée</span>
        <div class="fitz-choice-group" role="radiogroup" aria-label="Le niveau d'entrée">${NIVEAUX_VOEU.map((n) => `
          <label class="fitz-choice"><input type="radio" name="niveau" value="${ech(n)}"><span class="fitz-choice-dot" aria-hidden="true"></span><span>${ech(n)}</span></label>`).join("")}</div>
      </div>
      <div class="rt-geste"><button type="submit" class="rt-btn rt-btn--fait"><i data-lucide="plus"></i><span>Ajouter ce vœu</span></button></div>
    </form>` : `<p class="rt-quota-plein">Vos ${quota} vœux sont posés. Pour en changer un, retirez-le d'abord.</p>`;
  return `${liste}${avert}${form}`;
}

// ---- Étape 4 : les pièces ----
function htmlPieces(e) {
  if (!e.pieces.length) return `<p class="rt-vide">Renseignez d'abord votre pays de résidence (étape 1) : la liste des pièces en dépend.</p>`;
  return `
    <ul class="rt-pieces">${e.pieces.map((p) => `
      <li class="rt-piece${p.obtenue ? " is-obtenue" : ""}${p.ecartee ? " is-ecartee" : ""}">
        <label>
          <input type="checkbox" data-piece="${ech(p.slug)}"${p.obtenue ? " checked" : ""}${p.ecartee ? " disabled" : ""}>
          <span class="rt-piece-nom">${ech(p.nom)}</span>
          <span class="rt-piece-meta">${p.tailleMax ? `${ech(p.tailleMax)} maximum` : ""}${p.traduction ? " · à traduire si ce n'est pas en français" : ""}</span>
        </label>
        ${p.obtenue ? "" : `<button type="button" class="rt-piece-ecarter" data-ecarter="${ech(p.slug)}" aria-pressed="${p.ecartee ? "true" : "false"}">${p.ecartee ? "Finalement, ça me concerne" : "Ne me concerne pas"}</button>`}
      </li>`).join("")}</ul>
    <p class="rt-pieces-compte">${e.pieces.filter((p) => p.obtenue).length} pièce${e.pieces.filter((p) => p.obtenue).length > 1 ? "s" : ""} prête${e.pieces.filter((p) => p.obtenue).length > 1 ? "s" : ""} sur ${e.pieces.length}${e.pieces.some((p) => p.ecartee) ? `, ${e.pieces.filter((p) => p.ecartee).length} qui ne vous concerne${e.pieces.filter((p) => p.ecartee).length > 1 ? "nt" : ""} pas` : ""}.</p>`;
}

// ---- Étape 8 : les motivations, vœu par vœu ----
function htmlMotivations(e) {
  if (!e.voeux.length) return `<p class="rt-vide">${ech(e.empechement)}</p>`;
  return `
    <ol class="rt-voeux">${e.voeux.map((v) => {
      const faite = !!(v.motivation && v.motivation.faite);
      return `
      <li class="rt-voeu${faite ? " is-faite" : ""}">
        <div class="rt-voeu-texte"><strong>${ech(v.university)}</strong><span>${ech([v.formation, v.niveau].filter(Boolean).join(" · "))}</span></div>
        <div class="rt-voeu-actions">
          <span data-feature="ai_letter"><a href="ai-letter.html?applicationId=${encodeURIComponent(v.id)}" data-real-href="ai-letter.html?applicationId=${encodeURIComponent(v.id)}" class="rt-outil"><i data-lucide="pen-line"></i><span>Écrire avec Fitz</span></a></span>
          <button type="button" class="rt-coche${faite ? " is-fait" : ""}" data-lettre="${ech(v.id)}" aria-pressed="${faite}"><i data-lucide="${faite ? "check-circle-2" : "circle"}"></i><span>${faite ? "Lettre recopiée sur le portail" : "Lettre recopiée sur le portail ?"}</span></button>
        </div>
      </li>`;
    }).join("")}</ol>`;
}

// ---- Étape 12 : les réponses, vœu par vœu ----
function htmlReponses(e) {
  if (!e.voeux.length) return `<p class="rt-vide">${ech(e.empechement)}</p>`;
  const admis = e.voeux.filter((v) => v.status === "admise").length;
  return `
    <ol class="rt-voeux">${e.voeux.map((v) => `
      <li class="rt-voeu is-${ech(v.status || "")}">
        <div class="rt-voeu-texte"><strong>${ech(v.university)}</strong><span>${ech([v.formation, v.niveau].filter(Boolean).join(" · "))}</span></div>
        <div class="fitz-choice-group rt-reponse" role="radiogroup" aria-label="Réponse pour ${ech(v.university)}">${Object.entries(REPONSES_VOEU).map(([val, lib]) => `
          <label class="fitz-choice"><input type="radio" name="reponse-${ech(v.id)}" value="${val}" data-reponse="${ech(v.id)}"${(v.status === val || (val === "en_attente" && !Object.keys(REPONSES_VOEU).includes(v.status))) ? " checked" : ""}><span class="fitz-choice-dot" aria-hidden="true"></span><span>${ech(lib)}</span></label>`).join("")}</div>
      </li>`).join("")}</ol>
    ${admis ? `<p class="rt-bravo"><i data-lucide="party-popper"></i><span>${admis === 1 ? "Une admission" : `${admis} admissions`} — l'étape suivante vous attend.</span></p>` : ""}`;
}

// ---- Étape 15 : le visa, puis le départ ----
function htmlVisa(e) {
  const guide = guideVisaPour({ espace: "preinscription", procedure: etat.procedure });
  const faits = e.visa.etat;
  return `
    ${htmlGeste(e)}
    <p class="rt-sous-titre">Puis les démarches du départ — ${e.visa.faites} sur ${e.visa.total}</p>
    <div class="jy-guide" id="jyVisaGuide">
      <ol class="rt-demarches">${guide.etapes.map((d, i) => `
        <li class="rt-demarche${faits[d.id] ? " is-faite" : ""}">
          <button type="button" class="rt-coche${faits[d.id] ? " is-fait" : ""}" data-visa="${ech(d.id)}" aria-pressed="${!!faits[d.id]}"><i data-lucide="${faits[d.id] ? "check-circle-2" : "circle"}"></i><span>${i + 1}. ${ech(d.titre)}</span></button>
          <details class="rt-demarche-plus">
            <summary>Quand, pourquoi, et ce qui fait échouer</summary>
            <p><strong>Quand :</strong> ${ech(d.quand)}</p>
            <p>${ech(d.pourquoi)}</p>
            <p>${ech(d.variante)}</p>
            <p class="rt-demarche-soustitre">À faire, dans cet ordre</p>
            <ul>${d.actions.map((a) => `<li>${ech(a)}</li>`).join("")}</ul>
            <p class="rt-demarche-soustitre">Ce qui fait échouer</p>
            <ul>${d.vigilance.map((v) => `<li>${ech(v)}</li>`).join("")}</ul>
          </details>
        </li>`).join("")}</ol>
    </div>
    </div>`;
}

function htmlCorps(e) {
  switch (e.kind) {
    case "situation": return htmlSituation(e);
    case "diagnostic": return htmlDiagnostic(e);
    case "voeux": return htmlVoeux(e);
    case "pieces": return htmlPieces(e);
    case "motivations": return htmlMotivations(e);
    case "reponses": return htmlReponses(e);
    case "visa": return htmlVisa(e);
    default: return `<div class="rt-actions">${htmlOutilPrincipal(e)}${htmlPortail(e)}</div>${htmlGeste(e)}`;
  }
}

function peindreEtape() {
  const e = etapeChoisie();
  const section = document.getElementById("rtEtape");
  const pill = e.etat === "faite" ? "Faite" : e.etat === "courante" ? "C'est ici que vous en êtes" : "À venir";

  section.className = `rt-etape is-${e.etat}`;
  section.innerHTML = `
    <div class="rt-etape-head">
      <span class="rt-num">Étape ${e.numero} sur ${TOTAL_ETAPES}</span>
      <span class="rt-pill is-${e.etat}">${pill}</span>
    </div>
    <h2 class="rt-titre"><i data-lucide="${ech(e.icone)}"></i><span>${ech(e.titre)}</span></h2>
    <p class="rt-clair">${ech(e.enClair)}</p>
    ${htmlEcheance(e)}
    ${htmlFaits(e)}
    ${htmlCorps(e)}
    ${e.kind === "motivations" || e.kind === "reponses" ? `<div class="rt-actions">${htmlPortail(e)}</div>` : ""}
    ${htmlOutils(e)}
    ${htmlOfficiel(e)}
    <div class="rt-pied">
      ${boutonRecours({ code: "quoi_faire", etape: e.id }, { classe: "fitz-recours--bloc" })}
      ${etat.conseiller ? `<a href="advisor.html" class="rt-conseiller"><i data-lucide="user-check"></i><span>Demander une relecture à mon conseiller</span></a>` : ""}
    </div>
    <div class="rt-nav">
      ${e.numero > 1 ? `<button type="button" class="rt-nav-btn" data-aller="${ech(etat.route.etapes[e.numero - 2].id)}"><i data-lucide="arrow-left"></i><span>Étape ${e.numero - 1}</span></button>` : "<span></span>"}
      ${e.numero < TOTAL_ETAPES ? `<button type="button" class="rt-nav-btn" data-aller="${ech(etat.route.etapes[e.numero].id)}"><span>Étape ${e.numero + 1}</span><i data-lucide="arrow-right"></i></button>` : ""}
    </div>`;

  const s = etat.session;
  applyFeatureLocks(s.planId, s.featureFlags, s.testerAccess, s.hasFitzExpress, s.planPreinscriptionId);
  brancherEtape(e);
  memoriserRetour(e);
}

function peindreSuite() {
  const liste = document.getElementById("rtSuite");
  liste.innerHTML = etat.route.etapes.map((e) => `
    <li class="rt-suite-item is-${e.etat}${e.id === etat.choisie ? " is-choisie" : ""}">
      <button type="button" data-aller="${ech(e.id)}">
        <span class="rt-suite-num">${e.faite ? `<i data-lucide="check"></i>` : e.numero}</span>
        <span class="rt-suite-titre">${ech(e.titre)}</span>
        ${e.echeance && !e.faite && e.echeance.jours !== null && e.echeance.jours <= 30 ? `<span class="rt-suite-date">${e.echeance.jours < 0 ? "dépassé" : `J-${e.echeance.jours}`}</span>` : ""}
      </button>
    </li>`).join("");
}

function peindre() {
  peindreTete();
  peindreEtape();
  peindreSuite();
  icones();
}

function aller(id, defiler = true) {
  etat.choisie = id;
  peindre();
  if (defiler) {
    const cible = document.getElementById("rtEtape");
    if (cible) cible.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/**
 * LE RETOUR RAMÈNE À L'ÉTAPE, PAS AU SAS.
 *
 * Les douze pages d'outils portent un `.back-link` écrit en dur sur
 * dashboard.html — qui n'est plus qu'un aiguillage : l'étudiant y
 * passait, était redirigé, et rechargeait toute la coquille pour
 * revenir là d'où il venait. On dépose donc ici, à chaque peinture,
 * l'étape où il se trouve ; js/back-link.js (chargé par ces pages) lit
 * cette note et récrit le lien. sessionStorage : l'onglet, et lui seul.
 */
function memoriserRetour(e) {
  try {
    sessionStorage.setItem("fitz_retour", JSON.stringify({
      href: `espace-preinscription.html?etape=${encodeURIComponent(e.id)}`,
      court: `Étape ${e.numero}`,
      libelle: `Étape ${e.numero} · ${e.titre}`,
      espace: "preinscription"
    }));
  } catch (error) { /* navigation privée : le repli du markup suffit */ }
}

// ==========================================================
// Les gestes
// ==========================================================
async function enregistrerSituation(form) {
  const maj = {};
  for (const q of QUESTIONS_SITUATION) {
    const el = form.elements[q.cle];
    const val = el ? (el instanceof RadioNodeList ? el.value : el.value) : "";
    maj[q.cle] = String(val || "").trim();
  }
  // Alias hérité, lu par les outils : le pays de résidence.
  maj.originCountry = maj.country;
  const paths = {};
  for (const [k, v] of Object.entries(maj)) paths[`profile.${k}`] = v;
  try {
    await updateDoc(refUser(), paths);
    etat.profile = { ...(etat.profile || {}), ...maj };
    toast("Votre situation est enregistrée.");
    recomposer();
    if (etat.route.courante && etat.route.courante.id !== "situation") etat.choisie = etat.route.courante.id;
    peindre();
  } catch (error) {
    console.error("Situation non enregistrée :", error);
    toast("Vos réponses n'ont pas pu être enregistrées. Réessayez.", "error");
  }
}

async function ajouterVoeu(form) {
  const university = form.elements.university.value.trim();
  const formation = form.elements.formation.value.trim();
  const niveau = form.elements.niveau ? form.elements.niveau.value : "";
  if (!university || !formation || !niveau) { toast("L'établissement, la formation et le niveau : les trois sont nécessaires.", "error"); return; }
  const quota = Number.isFinite(etat.quota) ? Math.min(etat.quota, PLAFOND_VOEUX) : PLAFOND_VOEUX;
  const slotId = slotIdLibre(etat.voeux, quota, "pre");
  if (!slotId) { toast(`Vos ${quota} vœux sont déjà posés.`, "error"); return; }
  const payload = {
    university, formation, niveau,
    scholarship: "",
    // LE VŒU PORTE SA DESTINATION (lot R4, 2026-09-17). Sans elle, les
    // trois outils préremplissaient « Pays visé » avec le premier pays
    // souhaité du profil : un vœu à Lille partait pour la Chine.
    country: PAYS_DESTINATION,
    portalUrl: PORTAIL_ETUDES_EN_FRANCE,
    status: "a_preparer",
    track: "preinscription",
    deadline: null,
    reminderFrequency: 14,
    notes: "",
    motivation: { faite: false },
    createdAt: serverTimestamp()
  };
  try {
    await setDoc(doc(db, "users", etat.session.user.uid, "applications", slotId), payload);
    etat.voeux.push({ id: slotId, ...payload });
    toast("Vœu ajouté.");
    recomposer();
    peindre();
  } catch (error) {
    console.error("Vœu non ajouté :", error);
    toast("Ce vœu n'a pas pu être enregistré. Réessayez.", "error");
  }
}

async function retirerVoeu(id) {
  try {
    await deleteDoc(doc(db, "users", etat.session.user.uid, "applications", id));
    etat.voeux = etat.voeux.filter((v) => v.id !== id);
    toast("Vœu retiré.");
    recomposer();
    peindre();
  } catch (error) {
    console.error("Vœu non retiré :", error);
    toast("Ce vœu n'a pas pu être retiré. Réessayez.", "error");
  }
}

// `valeur` : true (je l'ai), "non-concerne" (cette pièce n'est pas pour
// moi — un Sénégalais n'a pas de carte de séjour au Sénégal), ou rien.
async function cocherPiece(slug, valeur) {
  const pieces = { ...((etat.dossier && etat.dossier.pieces) || {}) };
  if (valeur) pieces[slug] = valeur; else delete pieces[slug];
  try {
    await updateDoc(refUser(), { "dossierFrance.pieces": pieces });
    etat.dossier = { ...(etat.dossier || {}), pieces };
    recomposer();
    peindre();
  } catch (error) {
    console.error("Pièce non enregistrée :", error);
    toast("La pièce n'a pas pu être enregistrée. Réessayez.", "error");
  }
}

async function basculerFait(e) {
  const champ = document.getElementById("rtPreuve");
  const preuve = champ ? champ.value.trim() : "";
  const faite = !e.cochee;
  if (faite && e.preuve.requise && !preuve) {
    toast(`Indiquez d'abord ${e.preuve.libelle}.`, "error");
    if (champ) champ.focus();
    return;
  }
  const etapes = { ...((etat.dossier && etat.dossier.etapes) || {}) };
  etapes[e.id] = { faite, faitLe: faite ? aujourdhuiISO() : null, preuve };
  try {
    await updateDoc(refUser(), { [`dossierFrance.etapes.${e.id}`]: etapes[e.id] });
    etat.dossier = { ...(etat.dossier || {}), etapes };
    // Le numéro de dossier vaut pour tous les vœux : un seul dossier les
    // porte. On le déclare sur chacun, pour que le suivi (et l'admin)
    // sache qu'ils sont déposés.
    if (e.id === "ef_soumission" && faite) await declarerDepot(preuve);
    toast(faite ? "Étape faite." : "Étape rouverte.");
    recomposer();
    if (faite) etat.choisie = prochaineApres(e.id);
    peindre();
  } catch (error) {
    console.error("Étape non enregistrée :", error);
    toast("L'étape n'a pas pu être enregistrée. Réessayez.", "error");
  }
}

async function declarerDepot(numero) {
  const jour = aujourdhuiISO();
  for (const v of etat.voeux) {
    if (["deposee", "en_attente", "reponse_recue", "admise", "refusee", "liste_attente"].includes(v.status)) continue;
    const maj = { status: "deposee", preuveDepot: { mode: "numero", numeroDossier: numero, deposeLe: jour, declareLe: jour }, updatedAt: serverTimestamp() };
    try {
      await updateDoc(doc(db, "users", etat.session.user.uid, "applications", v.id), maj);
      v.status = "deposee";
      v.preuveDepot = maj.preuveDepot;
    } catch (error) {
      console.warn("Dépôt non déclaré sur un vœu :", v.id, error);
    }
  }
}

async function cocherLettre(id, faite) {
  const v = etat.voeux.find((x) => x.id === id);
  if (!v) return;
  const motivation = { faite, faitLe: faite ? aujourdhuiISO() : null };
  try {
    await updateDoc(doc(db, "users", etat.session.user.uid, "applications", id), { motivation, updatedAt: serverTimestamp() });
    v.motivation = motivation;
    recomposer();
    peindre();
  } catch (error) {
    console.error("Lettre non enregistrée :", error);
    toast("Ce geste n'a pas pu être enregistré. Réessayez.", "error");
  }
}

async function noterReponse(id, status) {
  const v = etat.voeux.find((x) => x.id === id);
  if (!v) return;
  try {
    await updateDoc(doc(db, "users", etat.session.user.uid, "applications", id), { status, updatedAt: serverTimestamp() });
    v.status = status;
    recomposer();
    peindre();
  } catch (error) {
    console.error("Réponse non enregistrée :", error);
    toast("La réponse n'a pas pu être enregistrée. Déclarez d'abord votre numéro de dossier (étape 9).", "error");
    peindre();
  }
}

async function cocherVisa(id, fait) {
  const visa = {};
  VISA_ETAPES.forEach((k) => { visa[k] = !!(etat.userData.visaChecklist && etat.userData.visaChecklist[k] === true); });
  visa[id] = fait;
  try {
    await updateDoc(refUser(), { visaChecklist: visa });
    etat.userData.visaChecklist = visa;
    recomposer();
    peindre();
  } catch (error) {
    console.error("Démarche non enregistrée :", error);
    toast("La démarche n'a pas pu être enregistrée. Réessayez.", "error");
  }
}

function brancherEtape(e) {
  const section = document.getElementById("rtEtape");
  brancherChampsGuides(section, SOURCES_ROUTE);

  const situation = section.querySelector("#rtSituation");
  if (situation) situation.addEventListener("submit", (ev) => { ev.preventDefault(); enregistrerSituation(situation); });

  const voeu = section.querySelector("#rtVoeu");
  if (voeu) voeu.addEventListener("submit", (ev) => { ev.preventDefault(); ajouterVoeu(voeu); });

  section.querySelectorAll("[data-retirer]").forEach((b) => b.addEventListener("click", () => retirerVoeu(b.getAttribute("data-retirer"))));
  section.querySelectorAll("[data-piece]").forEach((c) => c.addEventListener("change", () => cocherPiece(c.getAttribute("data-piece"), c.checked ? true : null)));
  section.querySelectorAll("[data-ecarter]").forEach((b) => b.addEventListener("click", () => cocherPiece(b.getAttribute("data-ecarter"), b.getAttribute("aria-pressed") === "true" ? null : "non-concerne")));
  section.querySelectorAll("[data-lettre]").forEach((b) => b.addEventListener("click", () => cocherLettre(b.getAttribute("data-lettre"), b.getAttribute("aria-pressed") !== "true")));
  section.querySelectorAll("[data-reponse]").forEach((s) => s.addEventListener("change", () => noterReponse(s.getAttribute("data-reponse"), s.value)));
  section.querySelectorAll("[data-visa]").forEach((b) => b.addEventListener("click", () => cocherVisa(b.getAttribute("data-visa"), b.getAttribute("aria-pressed") !== "true")));

  const fait = section.querySelector("#rtFait");
  if (fait) fait.addEventListener("click", () => basculerFait(e));
  const preuve = section.querySelector("#rtPreuve");
  if (preuve) preuve.addEventListener("keydown", (ev) => { if (ev.key === "Enter") { ev.preventDefault(); basculerFait(e); } });
}

// ==========================================================
// Amorçage
// ==========================================================
initShellChrome();

document.addEventListener("click", (ev) => {
  const btn = ev.target.closest("[data-aller], [data-etape]");
  if (!btn) return;
  aller(btn.getAttribute("data-aller") || btn.getAttribute("data-etape"), btn.hasAttribute("data-aller"));
});

bootstrapShell({ espace: "preinscription" }).then(async (session) => {

  if (!session) return;
  etat.session = session;
  etat.userData = session.userData || {};
  etat.profile = session.profile || {};
  etat.dossier = etat.userData.dossierFrance || {};

  if (sessionStorage.getItem("just_upgraded")) {
    toast(`Votre accompagnement ${sessionStorage.getItem("just_upgraded")} est activé. La route commence ici.`);
    sessionStorage.removeItem("just_upgraded");
  }
  sessionStorage.removeItem("just_created");

  etat.conseiller = !isFeatureLocked(session.planId, session.featureFlags, "advisor", session.testerAccess, session.hasFitzExpress, session.planPreinscriptionId);

  etat.quota = session.testerAccess ? null : quotaDeLaFormule({
    espace: "preinscription",
    planId: session.planId,
    planPreinscriptionId: session.planPreinscriptionId || "",
    plans: typeof SCHOLARBRIDGE_PLANS !== "undefined" ? SCHOLARBRIDGE_PLANS : null
  });

  const formule = document.getElementById("rtFormule");
  if (formule) formule.textContent = PLAN_PREINSCRIPTION_LABELS[session.planPreinscriptionId] || "";

  try {
    const snap = await getDocs(collection(db, "users", session.user.uid, "applications"));
    etat.voeux = snap.docs.map((d) => ({ id: d.id, ...d.data() })).filter((app) => lireParcours(app) === "preinscription");
  } catch (error) {
    console.error("Impossible de charger les vœux :", error);
  }

  // RATTRAPAGE DES VŒUX D'AVANT LE LOT R4 : ceux créés sans `country`
  // reçoivent leur destination à la première visite. Une écriture par
  // vœu, une seule fois dans la vie du dossier, et jamais bloquante :
  // un échec laisse l'outil retomber sur le profil, comme avant.
  for (const v of etat.voeux) {
    if (String(v.country || "").trim()) continue;
    try {
      await updateDoc(doc(db, "users", session.user.uid, "applications", v.id), { country: PAYS_DESTINATION });
      v.country = PAYS_DESTINATION;
    } catch (error) {
      console.warn("Destination non rattrapée sur un vœu :", v.id, error);
    }
  }

  const params = new URLSearchParams(window.location.search);
  recomposer();
  if (params.get("action") === "new") etat.choisie = "voeux";
  else if (params.get("etape") && etat.route.etapes.some((e) => e.id === params.get("etape"))) etat.choisie = params.get("etape");
  if (params.has("action") || params.has("etape")) history.replaceState(null, "", window.location.pathname);

  document.body.dataset.routePrete = "1";
  peindre();

  // La liste d'aide des établissements français — après la première
  // peinture : le catalogue ne retient jamais la route.
  try {
    const unis = await chargerUniversites();
    etat.universites = unis
      .filter((u) => /^france$/i.test(String(u.country || "").trim()))
      .map((u) => u.name).filter(Boolean).sort((a, b) => a.localeCompare(b, "fr"));
    // Le champ lit la source à chaque frappe : rien à re-peindre.
  } catch (error) {
    console.warn("Catalogue indisponible pour la liste d'aide :", error);
  }

}).catch((error) => {
  console.error("La route n'a pas pu s'afficher :", error);
});
