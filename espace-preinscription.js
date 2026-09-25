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
 * SIX DESTINATIONS DE PLUS (2026-09-23)
 * -------------------------------------
 *  La même page sert la Roumanie, la Turquie, le Maroc, l'Italie,
 *  l'Allemagne et le Canada : l'adresse porte ?d=<pays>. La route vient
 *  alors de js/route-destination.js (même forme d'objet), les états de
 *  users/{uid}.dossiersPays.<pays>, le diagnostic de
 *  users/{uid}.diagnosticsPays.<pays>, et les vœux s'appellent
 *  pre-<code>-N (champ `destination`). Sans ?d, la France si le compte
 *  l'a, sinon le premier pays acheté. La France ne change pas.
 *
 * LES RÈGLES FIRESTORE NE CHANGENT PAS : l'étudiant peut écrire tout
 * champ de son document sauf ceux de la formule ; un vœu naît sur un
 * créneau pre-N (quota de la formule) ; un statut déposé exige une
 * preuveDepot valide — on l'écrit sur chaque vœu au moment où l'étudiant
 * déclare son numéro de dossier (étape 9), puisque sur Études en France
 * un seul dossier porte tous les vœux.
 * ============================================================
 */

import { db, storage } from "./firebase-config.js";
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { ref as storageRef, uploadBytes } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-storage.js";
import { compressImageToTarget } from "./js/compression-image.js";
import { lirePreuve, preuveValide, resumePreuve, cheminCapture, TAILLE_MAX_FICHIER, TYPES_FICHIER } from "./js/preuve-depot.js";
import { chargerPortails, portailUniversite } from "./js/portails.js";
import { initShellChrome, bootstrapShell, applyFeatureLocks, isFeatureLocked } from "./js/app-shell.js";
import { trouverProcedure } from "./js/procedures/index.js";
import { lireParcours, PAYS_PREINSCRIPTION } from "./js/parcours.js";
import { formaterDate } from "./js/echeance.js";
// LE MONTANT VIENT DE js/diagnostic-france.js (lot R13, 2026-09-18).
// Cette page avait sa propre `formatMontant` — la deuxième copie d'une
// règle trouvée dans ce fichier après la date (lot R9). La fonction
// partagée fait DEUX choses de plus, et les deux comptent : elle écrit
// le dirham « Dhs » comme au Maroc et non « MAD », et elle donne deux
// décimales à un euro (« 13 562,50 € » et non « 13 562,5 € »).
// Les deux appels de cette page sont gardés par `typeof === "number"`,
// vérifié avant le remplacement : la fonction partagée rendrait
// « 0 F CFA » sur une valeur absente, la locale rendait "".
import { HORS_TOTAL, formatMontant } from "./js/diagnostic-france.js";
import { quotaDeLaFormule } from "./js/parcours-quota.js";
// Lot R23 : les mots techniques de la citation officielle, dits À CÔTÉ
// d'elle — la citation reste intacte (data-sans-glossaire, lot R21).
import { motsTechniques } from "./js/glossaire.js";
import { slotIdLibre } from "./js/application-actions.js";
import { boutonRecours } from "./js/fitz-recours.js";
import { guideVisaPour } from "./js/visa-depart.js";
import { VISA_ETAPES } from "./js/journey-map.js";
import { COUNTRY_NAMES } from "./js/countries.js";
import { prechargerCatalogue, chargerUniversites } from "./js/catalog-data.js";

// Le catalogue part tout de suite, en parallèle de la connexion (lot
// NAVIGATION RAPIDE, 2026-09-21) — voir js/catalog-data.js.
prechargerCatalogue();
import { PLAN_PREINSCRIPTION_LABELS, droitsPreinscription, planPreinscriptionPour, resolvePlanPreinscriptionFrance } from "./js/plan-features.js";
import { construireRoutePays, questionsSituationPays, STATUTS_DEPOSES_VOEU } from "./js/route-destination.js";
import { destination as configDestination, PREFIXES_VOEU } from "./js/destinations-preinscription.js";
import { HORS_TOTAL_PAYS } from "./js/diagnostic-pays.js";
import { auPays, avecArticle } from "./js/pays-grammaire.js";
import {
  construireRoute, phraseDeRoute, QUESTIONS_SITUATION, NIVEAUX_VOEU, REPONSES_VOEU,
  PLAFOND_VOEUX, PORTAIL_ETUDES_EN_FRANCE, TOTAL_ETAPES, DECLARATIONS_TRADUCTION, LIBELLES_TRADUCTION,
  PIECES_RESIDENCE_ABSENTE, ANNUAIRE_ESPACES_CAMPUS_FRANCE
} from "./js/route-preinscription.js";
// Les deux composants guidés (pastilles d'exemples, champ à suggestions)
// sont partagés avec « Mon profil » : js/champs-guides.js + css/guide.css.
import { EXEMPLES, htmlChips, htmlSuggest, brancherChampsGuides, canoniser } from "./js/champs-guides.js";

// ==========================================================
// Outillage
// ==========================================================
function ech(v) {
  return String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// LA DATE VIENT DE js/echeance.js (lot R9, 2026-09-17).
// Cette page avait sa propre `dateLongue`, sans l'ordinal : elle
// affichait « À partir du 1 mai 2027 » à l'étape 15, quand tout le
// reste du site écrit « 1er mai 2027 ». Une seconde copie d'une règle
// finit toujours par en donner une seconde version — c'est la faute que
// ce dépôt a déjà payée trois fois. `formaterDate` la tient, seule.
function dateLongue(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || ""));
  return m ? formaterDate(`${m[1]}-${m[2]}-${m[3]}`) : "";
}

function aujourdhuiISO() {
  return new Date().toISOString().slice(0, 10);
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
  universites: null,      // les universités du pays, pour la liste d'aide
  fichesPays: [],         // les mêmes, entières : leur bloc « admission » nourrit la candidature
  portails: false,        // vrai une fois la carte des portails chargée (abonnés)
  conseiller: false,
  destination: "france",  // ?d=<pays> ; « france » par défaut
  config: null,           // js/destinations-preinscription.js, hors France
  droits: []              // droitsPreinscription() : les dossiers actifs du compte
};

function refUser() {
  return doc(db, "users", etat.session.user.uid);
}

function estFrance() {
  return etat.destination === "france";
}

function nomDestination() {
  return estFrance() ? "France" : etat.config.nom;
}

/** Le champ du document qui porte les états de la route. */
function champDossier() {
  return estFrance() ? "dossierFrance" : `dossiersPays.${etat.destination}`;
}

function questionsSituation() {
  return estFrance() ? QUESTIONS_SITUATION : questionsSituationPays(etat.destination);
}

function plafondVoeux() {
  return estFrance() ? PLAFOND_VOEUX : etat.config.plafondVoeux;
}

/** L'adresse de la route, à une étape — la destination d'abord. */
function adresseRoute(etape = "") {
  const p = new URLSearchParams();
  if (!estFrance()) p.set("d", etat.destination);
  if (etape) p.set("etape", etape);
  const q = p.toString();
  return `espace-preinscription.html${q ? `?${q}` : ""}`;
}

function recomposer() {
  if (estFrance()) {
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
  } else {
    etat.procedure = trouverProcedure({ paysDestination: etat.config.nom });
    etat.route = construireRoutePays({
      id: etat.destination,
      procedure: etat.procedure,
      profile: etat.profile,
      diagnostic: (etat.userData.diagnosticsPays && etat.userData.diagnosticsPays[etat.destination]) || null,
      voeux: etat.voeux,
      dossier: etat.dossier,
      // Le départ d'un pays est le sien : ses démarches vivent dans son
      // dossier, pas dans la liste France (users/{uid}.visaChecklist).
      visaChecklist: (etat.dossier && etat.dossier.visaChecklist) || {},
      // Les fiches du catalogue : ce que CHAQUE université demande, lu
      // à l'étape de candidature (relecture du 2026-09-25).
      universites: etat.fichesPays
    });
  }
  if (!etat.route) return;
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

  // LA RÉSERVE QUI PASSE AVANT TOUT (lot R15, 2026-09-18).
  // Elle ne dit pas qu'il manque une donnée : elle dit que ONZE des
  // quinze étapes ne sont pas les siennes. Sa place est donc en haut,
  // au-dessus du fil et de l'étape, et pas dans une étape. Même
  // composant que les autres réserves de la route (.rt-avert), pour
  // qu'un étudiant les reconnaisse d'un coup d'œil.
  const zoneAvert = document.getElementById("rtAvertProcedure");
  const avert = etat.route.avertissementProcedure;
  zoneAvert.innerHTML = avert ? `
    <ul class="rt-avert">
      <li><i data-lucide="alert-triangle"></i><span>${ech(avert.texte)}
        <a href="${ech(avert.lien)}" target="_blank" rel="noopener noreferrer">${ech(avert.libelleLien)}</a>
        <span class="rt-source">Liste des pays vérifiée le ${ech(formaterDate(avert.verifieLe))} sur <a href="${ech(avert.source)}" target="_blank" rel="noopener noreferrer">campusfrance.org</a>.</span>
      </span></li>
    </ul>` : "";

  // LES DOSSIERS DU COMPTE (2026-09-23). Un étudiant qui a acheté deux
  // destinations passe de l'une à l'autre ici ; avec une seule, rien.
  const nav = document.getElementById("rtDestinations");
  if (nav) {
    const liste = etat.droits.some((x) => x.destination === etat.destination) ? etat.droits : [...etat.droits, { destination: etat.destination }];
    nav.hidden = liste.length < 2;
    nav.innerHTML = liste.length < 2 ? "" : liste.map((x) => {
      const nom = x.destination === "france" ? "France" : ((configDestination(x.destination) || {}).nom || x.destination);
      const actif = x.destination === etat.destination;
      return `<a class="rt-destination${actif ? " is-active" : ""}" href="espace-preinscription.html?d=${ech(encodeURIComponent(x.destination))}"${actif ? ` aria-current="page"` : ""}>${ech(nom)}</a>`;
    }).join("");
  }

  const fil = document.getElementById("rtFil");
  fil.setAttribute("aria-label", `Les ${etat.route.total} étapes de votre route`);
  fil.innerHTML = etat.route.etapes.map((e) => `
    <button type="button" class="rt-point is-${e.etat}${e.id === etat.choisie ? " is-choisie" : ""}" data-etape="${ech(e.id)}" title="${ech(`${e.numero}. ${e.titre}`)}" aria-label="${ech(`Étape ${e.numero} : ${e.titre}`)}" aria-current="${e.id === etat.choisie ? "step" : "false"}">
      <span class="rt-point-num">${e.faite ? `<i data-lucide="check"></i>` : e.numero}</span>
    </button>`).join("");

  const barre = document.getElementById("rtBarre");
  barre.style.setProperty("--rt-pct", `${etat.route.pourcentage}%`);
  barre.setAttribute("aria-valuemax", String(etat.route.total));
  barre.setAttribute("aria-valuenow", String(etat.route.faites));
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
  const reste = j === null ? "" : j < 0 ? ` — dépassé de ${Math.abs(j)} jour${Math.abs(j) > 1 ? "s" : ""}` : j === 0 ? " — c'est aujourd'hui" : ` — dans ${j} jour${j > 1 ? "s" : ""}`;
  // UN JALON D'OUVERTURE PORTE DÉJÀ SA PRÉPOSITION (lot R9, 2026-09-17).
  // Le libellé du calendrier est « Demande de visa possible à partir
  // du » — écrit pour être suivi d'une date. On le préfixait quand même
  // de « À partir du », et on le rejetait en fin de phrase : l'étape 15
  // affichait « À partir du 1 mai 2027 — dans 226 jours · Demande de
  // visa possible à partir du · calendrier… ». Deux fois la préposition,
  // et une phrase qui finit sur « du ». Un jalon `debut` prend donc son
  // libellé DEVANT la date ; les autres gardent « Avant le ».
  const phrase = e.echeance.debut && e.echeance.libelle
    ? `${ech(e.echeance.libelle)} <strong>${ech(dateLongue(e.echeance.iso))}</strong>${ech(reste)}`
    : `${e.echeance.debut ? "À partir du" : "Avant le"} <strong>${ech(dateLongue(e.echeance.iso))}</strong>${ech(reste)}${e.echeance.libelle ? ` · ${ech(e.echeance.libelle)}` : ""}`;
  return `<p class="rt-echeance ${ton}"><i data-lucide="calendar-clock"></i><span>${phrase} · calendrier de votre pays de résidence.</span></p>`;
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

/**
 * LES MOTS TECHNIQUES DE LA CITATION, DITS À CÔTÉ D'ELLE (lot R23).
 *
 * Conséquence mesurée du lot R21 : en mettant la citation officielle hors
 * de portée du glossaire, on a laissé l'étudiant seul devant ses mots les
 * plus opaques. Le balayage de la route des HUIT pays documentés, le
 * 2026-09-18, a compté trois termes du glossaire qui n'apparaissent PLUS
 * QUE dans cette citation — « DAP » seize fois, « préinscription » et
 * « TCF/DELF/DALF ».
 *
 * La citation reste donc intacte, et les définitions se posent en dessous.
 * Elles viennent de js/glossaire.js : une seule table de définitions pour
 * tout le site, ici comme ailleurs.
 */
function htmlMotsDeLaCitation(e) {

const consigne = (e.officielle && e.officielle.consigne) || "";
if (!consigne) return "";

// ON NE DIT PAS DEUX FOIS LE MÊME MOT SUR LE MÊME ÉCRAN. Les phrases de
// l'étape — son titre, son « en clair », la mention, le titre officiel —
// sont, elles, annotées par le glossaire. Mesuré à l'étape 8 : la
// citation parle de « vœux », et la phrase juste au-dessus commence par
// « Un vœu, c'est une formation… » ; répéter la définition en dessous
// serait du bruit.
const dejaDit = new Set(
motsTechniques([e.titre, e.enClair, e.officielle && e.officielle.titre, e.officielle && e.officielle.mention]
.filter(Boolean).join("\n")).map((m) => m.id)
);

const mots = motsTechniques(consigne).filter((m) => !dejaDit.has(m.id));
if (!mots.length) return "";

// `data-sans-glossaire` SUR NOTRE PROPRE LIGNE DE DÉFINITIONS. Mesuré au
// banc : sans lui, le glossaire annotait cette ligne comme une autre, et
// l'écran affichait « Études en France (la plateforme en ligne de Campus
// France) : la plateforme en ligne de Campus France ». Une ligne qui
// définit des mots n'a pas à être définie.
return `<p class="rt-officiel-mots" data-sans-glossaire>${mots
.map((m) => `<span><strong>${ech(m.mot)}</strong> : ${ech(m.explication)}</span>`)
.join("")}</p>`;

}

/**
 * LE TEXTE OFFICIEL NE PORTE PAS NOS PARENTHÈSES (lot R21, 2026-09-18).
 *
 * Depuis que le glossaire tourne dans l'espace étudiant
 * (js/app-shell.js), il annoterait aussi ce paragraphe — et le site
 * afficherait « Le texte officiel : "…" » suivi d'une phrase où NOS
 * explications se sont glissées. On n'écrit pas dans un texte qu'on
 * présente comme officiel : l'attribut data-sans-glossaire (déjà prévu
 * par js/glossaire.js) l'en écarte. L'explication d'un mot a sa place
 * partout ailleurs ; ici, la citation reste la citation.
 */
function htmlOfficiel(e) {
  const o = e.officielle;
  if (!o) return "";
  const sources = [o.source, o.sourceResidence].filter(Boolean);
  return `
    <details class="rt-officiel"${e.etat === "courante" ? " open" : ""}>
      <summary><i data-lucide="scroll-text"></i><span>Le texte officiel : « ${ech(o.titre)} »</span></summary>
      <p data-sans-glossaire>${ech(o.consigne)}</p>
      ${htmlMotsDeLaCitation(e)}
      ${sources.length ? `<p class="rt-source">Vérifié le ${ech(o.verifieLe)} · ${sources.map((s, i) => `<a href="${ech(s)}" target="_blank" rel="noopener noreferrer">${i === 0 ? "la source officielle" : "la page de votre pays"}</a>`).join(" · ")}</p>` : ""}
    </details>`;
}

/**
 * UN OUTIL OUVERT DEPUIS UNE ÉTAPE QUI CONCERNE UN VŒU DOIT PORTER CE
 * VŒU (2026-09-17).
 *
 * L'étape 8 le fait depuis le lot R1 : chaque vœu a son « Écrire avec
 * Fitz » vers `ai-letter.html?applicationId=pre-N`. L'étape 13 — la
 * confirmation du choix définitif — ne le faisait pas : son lien
 * « Écrire à l'établissement » ouvrait `ai-email.html` nu. L'étudiant
 * arrivait donc sur un formulaire sans destinataire, qu'il devait
 * comprendre et remplir au sélecteur. Mesuré en ligne le 2026-09-17.
 *
 * On ne DEVINE jamais le vœu : l'étape 13 parle de celui qu'on accepte,
 * donc l'unique admis ; à défaut d'admission déclarée, l'unique vœu du
 * dossier, qui ne laisse aucune ambiguïté. Plusieurs admissions ⇒ rien
 * dans l'URL, c'est à l'étudiant de choisir, et le sélecteur de la page
 * est fait pour ça.
 */
function voeuDeLOutil(e) {
  // Hors France, la même règle vaut pour toute étape qui porte l'outil
  // « Écrire à l'établissement » (les étapes de confirmation).
  const confirmation = e.id === "ef_confirmation" || (!estFrance() && e.outils.some((o) => o.feature === "ai_email"));
  if (!confirmation) return null;
  const admis = etat.voeux.filter((v) => v.status === "admise");
  if (admis.length === 1) return admis[0];
  if (!admis.length && etat.voeux.length === 1) return etat.voeux[0];
  return null;
}

function hrefOutil(e, o) {
  const v = voeuDeLOutil(e);
  const href = v ? `${o.href}?applicationId=${encodeURIComponent(v.id)}` : o.href;
  return avecDestination(href);
}

/**
 * HORS FRANCE, L'OUTIL APPREND LE PAYS (2026-09-23). Sans vœu, un outil
 * ouvert depuis l'espace préinscription suppose la France ; `?d=italie`
 * lui dit la route d'où il vient (js/plan-features.js,
 * destinationDeLAdresse). Un vœu, quand il est passé, garde le dernier mot.
 */
function avecDestination(href) {
  if (estFrance() || /[?&]d=/.test(href)) return href;
  return `${href}${href.includes("?") ? "&" : "?"}d=${encodeURIComponent(etat.destination)}`;
}

function htmlOutils(e) {
  const outils = e.outils.filter((o) => !o.principal);
  if (!outils.length) return "";
  return `<div class="rt-outils">${outils.map((o) => {
    const href = ech(hrefOutil(e, o));
    return `
    <span data-feature="${ech(o.feature)}"><a href="${href}" data-real-href="${href}" class="rt-outil"><i data-lucide="${ech(o.icone)}"></i><span>${ech(o.libelle)}</span></a></span>`;
  }).join("")}</div>`;
}

function htmlOutilPrincipal(e) {
  const o = e.outils.find((x) => x.principal);
  if (!o) return "";
  const href = ech(hrefOutil(e, o));
  return `<span data-feature="${ech(o.feature)}"><a href="${href}" data-real-href="${href}" class="rt-btn rt-btn--fitz"><i data-lucide="${ech(o.icone)}"></i><span>${ech(o.libelle)}</span></a></span>`;
}

function htmlPortail(e) {
  if (e.kind !== "procedure" && e.kind !== "motivations" && e.kind !== "reponses" && e.kind !== "visa") return "";
  // L'étape de réponse ajoutée à une voie directe (UM6P, Al Akhawayn) n'a
  // pas de portail : celui du pays (l'AMCI) n'est pas le sien.
  if (e.id === "reponse_etablissement") return "";
  const p = etat.route.portail;
  return `<a href="${ech(p.url)}" target="_blank" rel="noopener noreferrer" class="rt-btn rt-btn--portail"><i data-lucide="external-link"></i><span>Ouvrir ${ech(p.nom)}</span></a>`;
}

/** Le geste : la preuve si elle est requise, et « C'est fait ». */
function htmlGeste(e) {
  if (["situation", "diagnostic", "voeux", "pieces", "motivations", "reponses", "depart", "voie", "candidature"].includes(e.kind)) return "";
  // Une étape déclarée « ne me concerne pas » n'attend plus de geste.
  if (e.nonConcerne) return "";
  // Hors France, un DÉPÔT se prouve aussi par la capture ou l'e-mail de
  // confirmation (relecture du 2026-09-25) : tous les portails ne donnent
  // pas un numéro. Le fichier se range avec chaque vœu (preuveDepot).
  const avecFichier = e.depot && !estFrance() && !e.cochee;
  const captureJointe = e.preuve.valeur === PREUVE_CAPTURE;
  const preuve = e.preuve.requise ? `
    <label class="rt-preuve">
      <span>${ech(e.preuve.libelle.charAt(0).toUpperCase() + e.preuve.libelle.slice(1))}${avecFichier ? " (si le site vous en a donné un)" : ""}</span>
      <input type="text" id="rtPreuve" maxlength="64" value="${ech(captureJointe ? "" : e.preuve.valeur)}" placeholder="${ech(e.id === "ef_soumission" ? "Le numéro que le portail vous a donné" : e.depot ? "Le numéro ou la référence de votre dépôt" : "La référence, pour la retrouver plus tard")}" autocomplete="off">
    </label>
    ${avecFichier ? htmlChampFichier("rtPreuveFichier") : ""}
    ${captureJointe ? `<p class="rt-mention"><i data-lucide="paperclip"></i><span>Capture de confirmation jointe.</span></p>` : ""}` : "";
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
 * DEUX PORTES, UNE SEULE EST LA SIENNE (2026-09-23).
 * La Turquie (la bourse, ou l'autofinancement) et le Maroc (l'AMCI,
 * l'UM6P ou Al Akhawayn) ont plusieurs procédures dans une : chaque
 * étape de la procédure officielle peut donc être déclarée « ne me
 * concerne pas ». Elle compte alors comme réglée. La route France n'a
 * pas ce bouton (ses étapes n'ont pas `ignorable`).
 */
function htmlIgnorer(e) {
  if (!e.ignorable) return "";
  return `
    <div class="rt-ignorer">
      ${e.nonConcerne ? `<p class="rt-mention"><i data-lucide="info"></i><span>Vous avez indiqué que cette étape ne vous concerne pas : elle compte comme réglée.</span></p>` : ""}
      <button type="button" class="rt-lien-discret" id="rtIgnorer" aria-pressed="${e.nonConcerne ? "true" : "false"}">${e.nonConcerne ? "Finalement, elle me concerne" : "Cette étape ne me concerne pas"}</button>
    </div>`;
}

/** Ce qu'il faut apporter à une étape qui n'est pas une liste à cocher. */
function htmlAApporter(e) {
  const pieces = (e.officielle && e.officielle.pieces) || [];
  if (!pieces.length || e.nonConcerne) return "";
  return `
    <div class="rt-a-apporter">
      <p class="rt-sous-titre">Ce qu'il faut avoir sous la main</p>
      <ul class="rt-pieces-liste">${pieces.map((p) => `<li><strong>${ech(p.nom)}</strong>${p.aide ? `<span>${ech(p.aide)}</span>` : ""}</li>`).join("")}</ul>
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
      ${questionsSituation().map((q, i) => `
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
  // Hors France : users/{uid}.diagnosticsPays.<pays>, écrit par
  // js/diagnostic-pays-page.js — `totalTexte` porte déjà la phrase.
  const d = estFrance() ? etat.userData.diagnosticFrance : (etat.userData.diagnosticsPays && etat.userData.diagnosticsPays[etat.destination]);
  if (e.faite && d) {
    const total = estFrance()
      ? (typeof d.totalAnnuelEUR === "number" ? `${formatMontant(Math.round(d.totalAnnuelEUR), "EUR")} pour l'année` : "")
      : String(d.totalTexte || "");
    return `
      <div class="rt-verdict is-${ech(d.etatVerdict || "")}">
        <p class="rt-verdict-phrase">${ech(d.verdict || "Diagnostic enregistré.")}</p>
        ${total ? `<p class="rt-verdict-chiffre">${ech(total)}</p><p class="rt-verdict-hors">${ech(estFrance() ? HORS_TOTAL : HORS_TOTAL_PAYS)}</p>` : ""}
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
  const plafond = plafondVoeux();
  const nom = nomDestination();
  const unSeul = plafond === 1;
  if (etat.quota === 0) {
    return `<p class="rt-vide">Votre formule actuelle comprend le diagnostic, pas le suivi des vœux. Le Dossier ${ech(nom)} vous accompagne ${unSeul ? "sur votre cours" : `sur les ${plafond} vœux`}, de la première pièce au départ.</p>
      <div class="rt-geste"><a href="${estFrance() ? "offers.html" : `payment.html?plan=dossier-france&amp;destination=${ech(etat.destination)}`}" class="rt-btn rt-btn--fait"><i data-lucide="arrow-right"></i><span>Voir le Dossier ${ech(nom)}</span></a></div>`;
  }
  const quota = Number.isFinite(etat.quota) ? Math.min(etat.quota, plafond) : plafond;
  const reste = Math.max(0, quota - etat.voeux.length);
  const liste = etat.voeux.length ? `
    <ol class="rt-voeux">${etat.voeux.map((v) => `
      <li class="rt-voeu">
        <div class="rt-voeu-texte"><strong>${ech(v.university)}</strong><span>${ech([v.formation, v.niveau].filter(Boolean).join(" · "))}</span></div>
        <button type="button" class="rt-voeu-retirer" data-retirer="${ech(v.id)}" aria-label="Retirer ce vœu"><i data-lucide="x"></i></button>
      </li>`).join("")}</ol>` : `<p class="rt-vide">${unSeul ? "Aucun cours pour l'instant. Il se pose ci-dessous." : "Aucun vœu pour l'instant. Le premier se pose ci-dessous."}</p>`;
  const avert = etat.route.avertissementsVoeux.length ? `<ul class="rt-avert">${etat.route.avertissementsVoeux.map((a) => `<li><i data-lucide="alert-triangle"></i><span>${ech(a)}</span></li>`).join("")}</ul>` : "";
  const form = reste > 0 ? `
    <form class="rt-form rt-form--voeu" id="rtVoeu" novalidate>
      <p class="rt-form-titre">${unSeul ? "Votre cours" : "Ajouter un vœu"} <span class="rt-quota">${etat.voeux.length} sur ${quota}</span></p>
      <div class="rt-q"><span class="rt-q-libelle">L'établissement</span>${htmlSuggest("university", "", estFrance() ? "Commencez à écrire : Université de Lille, IUT de Rennes…" : "Commencez à écrire le nom de l'établissement", "unis")}<p class="rt-q-aide">${estFrance() ? "Les établissements français du catalogue vous sont proposés en tapant." : `Le catalogue vous propose les établissements ${ech(auPays(nom))} en tapant.`} Un autre établissement ? Écrivez son nom.</p></div>
      <div class="rt-q"><span class="rt-q-libelle">La formation</span>${htmlSuggest("formation", "", "Licence Informatique, Master Droit des affaires…", "formation")}</div>
      <div class="rt-q"><span class="rt-q-libelle">Le niveau d'entrée</span>
        <div class="fitz-choice-group" role="radiogroup" aria-label="Le niveau d'entrée">${(estFrance() ? NIVEAUX_VOEU : etat.config.niveaux).map((n) => `
          <label class="fitz-choice"><input type="radio" name="niveau" value="${ech(n)}"><span class="fitz-choice-dot" aria-hidden="true"></span><span>${ech(n)}</span></label>`).join("")}</div>
      </div>
      <div class="rt-geste"><button type="submit" class="rt-btn rt-btn--fait"><i data-lucide="plus"></i><span>${unSeul ? "Enregistrer ce cours" : "Ajouter ce vœu"}</span></button></div>
    </form>` : `<p class="rt-quota-plein">${unSeul ? "Votre cours est posé. Pour en changer, retirez-le d'abord." : `Vos ${quota} vœux sont posés. Pour en changer un, retirez-le d'abord.`}</p>`;
  // LE PLAFOND OFFICIEL, AVEC SA SOURCE (Italie : un seul cours ; Türkiye
  // Bursları : douze préférences). Ailleurs, sept : notre accompagnement.
  const officiel = !estFrance() && etat.config.plafondOfficiel ? `
    <p class="rt-mention" data-sans-glossaire><i data-lucide="info"></i><span>${ech(etat.config.plafondOfficiel.texte)} <span class="rt-source">Vérifié le ${ech(formaterDate(etat.config.plafondOfficiel.verifieLe))} · <a href="${ech(etat.config.plafondOfficiel.source)}" target="_blank" rel="noopener noreferrer">la source officielle</a></span></span></p>` : "";
  return `${liste}${avert}${form}${officiel}`;
}

/**
 * L'AIDE D'UNE PIÈCE, ET POURQUOI CE N'EST PAS LE GLOSSAIRE (lot R24).
 *
 * Un nom de pièce vit dans un <label>, que `HORS_CHAMP` écarte du
 * glossaire — à raison : un libellé n'est pas une phrase. Mais la
 * question d'un étudiant devant « Attestation d'accréditation de la
 * formation » n'est pas « que veut dire accréditation », c'est « est-ce
 * que ça me concerne, et où je l'obtiens ». Une définition de
 * dictionnaire le laisserait aussi bloqué. D'où un champ `aide` sur la
 * pièce, et cette troisième ligne.
 *
 * LE CORPS EST UNE COLONNE, PLUS UNE GRILLE À DEUX RANGÉES. L'ancien
 * <label> était une grille et la case à cocher y tenait par
 * `grid-row:span 2` — un chiffre qui valait « exactement deux lignes de
 * texte ». Ajouter une troisième ligne l'aurait décentrée sans que rien
 * ne proteste. Les lignes vivent maintenant dans `.rt-piece-corps`, et
 * leur nombre n'est plus écrit dans la feuille de style.
 */
// ---- Étape 4 : les pièces ----
function htmlPieces(e) {
  if (!e.pieces.length) return `<p class="rt-vide">Renseignez d'abord votre pays de résidence (étape 1) : la liste des pièces en dépend.</p>`;
  // LE TROU EST DIT AVANT LA LISTE, PAS APRÈS (lot R14, 2026-09-18).
  // Une réserve placée sous la liste se lit quand on a déjà cru la
  // liste complète. Celle-ci change la façon de lire les six lignes qui
  // suivent : elle passe donc devant. Elle reprend `.rt-avert`, le
  // composant des avertissements de l'étape 3 — pas un style à elle,
  // pour que les deux réserves de la route se ressemblent.
  const reserve = e.residenceAbsente ? `
    <ul class="rt-avert">
      <li><i data-lucide="alert-triangle"></i><span>${ech(PIECES_RESIDENCE_ABSENTE)} <a href="${ech(ANNUAIRE_ESPACES_CAMPUS_FRANCE)}" target="_blank" rel="noopener noreferrer">Trouver mon Espace Campus France</a></span></li>
    </ul>` : "";
  return `${reserve}
    <ul class="rt-pieces">${e.pieces.map((p) => `
      <li class="rt-piece${p.obtenue ? " is-obtenue" : ""}${p.ecartee ? " is-ecartee" : ""}">
        <label>
          <input type="checkbox" data-piece="${ech(p.slug)}"${p.obtenue ? " checked" : ""}${p.ecartee ? " disabled" : ""}>
          <span class="rt-piece-corps">
            <span class="rt-piece-nom">${ech(p.nom)}</span>
            ${p.aide ? `<span class="rt-piece-aide">${ech(p.aide)}</span>` : ""}
            <span class="rt-piece-meta">${p.tailleMax ? `${ech(p.tailleMax)} maximum` : ""}${p.traduction ? (estFrance() ? " · à traduire si ce n'est pas en français" : " · traduction officielle à prévoir") : ""}${p.legalisation ? " · légalisation à prévoir" : ""}</span>
          </span>
        </label>
        ${p.obtenue ? "" : `<button type="button" class="rt-piece-ecarter" data-ecarter="${ech(p.slug)}" aria-pressed="${p.ecartee ? "true" : "false"}">${p.ecartee ? "Finalement, ça me concerne" : "Ne me concerne pas"}</button>`}
      </li>`).join("")}</ul>
    <p class="rt-pieces-compte">${e.pieces.filter((p) => p.obtenue).length} pièce${e.pieces.filter((p) => p.obtenue).length > 1 ? "s" : ""} prête${e.pieces.filter((p) => p.obtenue).length > 1 ? "s" : ""} sur ${e.pieces.length}${e.pieces.some((p) => p.ecartee) ? `, ${e.pieces.filter((p) => p.ecartee).length} qui ne vous concerne${e.pieces.filter((p) => p.ecartee).length > 1 ? "nt" : ""} pas` : ""}.</p>
    ${htmlTraduction(e)}`;
}

/**
 * LA LANGUE DES PIÈCES (lot R10, 2026-09-17).
 *
 * Deux pièces du dossier français doivent être traduites par un
 * TRADUCTEUR ASSERMENTÉ, original joint — la consigne officielle de
 * l'étape est sans échappatoire, et Campus France écrit que « toute
 * autre traduction sera refusée ». Le site se contentait d'un
 * « à traduire si ce n'est pas en français » en petit, sous chaque
 * pièce : du bruit pour l'étudiant dont tout est déjà en français, et
 * un avertissement trop faible pour celui qui ne l'est pas — il
 * l'aurait découvert après les 85 000 F de frais, non remboursables.
 *
 * Une question, deux réponses, et le sujet disparaît ou devient précis.
 * Ce bloc n'écrit AUCUN contenu neuf : la règle vient de la consigne
 * officielle (affichée juste en dessous, avec sa source et sa date), et
 * tout le reste — où trouver un traducteur, combien de temps, ce qu'il
 * faut vérifier au cachet — vit déjà dans la fiche « Traductions
 * certifiées » de documents.html, écrite et vérifiée par le lot des
 * documents. On y renvoie ; on ne la recopie pas.
 */
function htmlTraduction(e) {
  const t = e.traduction;
  if (!t || !t.concernees.length) return "";
  const liste = `<span class="rt-trad-pieces">${t.concernees.map((n) => ech(n)).join(" · ")}</span>`;

  if (!t.declare) {
    return `
    <div class="rt-trad rt-trad--question">
      <p class="rt-trad-q"><i data-lucide="languages"></i><span>Vos relevés de notes et vos diplômes sont-ils <strong>en français</strong> ?</span></p>
      <div class="fitz-choice-group" role="radiogroup" aria-label="La langue de vos relevés et diplômes">${DECLARATIONS_TRADUCTION.map((v) => `
        <label class="fitz-choice"><input type="radio" name="traductions" value="${ech(v)}" data-traduction="${ech(v)}"><span class="fitz-choice-dot" aria-hidden="true"></span><span>${ech(LIBELLES_TRADUCTION[v])}</span></label>`).join("")}</div>
      <p class="rt-trad-aide">Deux pièces sont concernées : ${liste}. Votre réponse décide si vous avez une démarche de traduction à prévoir — ou rien du tout.</p>
    </div>`;
  }

  if (t.declare === "francais") {
    return `
    <div class="rt-trad rt-trad--ok">
      <p><i data-lucide="check"></i><span><strong>Aucune traduction à faire</strong> : vos pièces sont en français.</span></p>
      <button type="button" class="rt-trad-changer" data-traduction="a_traduire">Ce n'est pas le cas ?</button>
    </div>`;
  }

  return `
    <div class="rt-trad rt-trad--afaire">
      <p class="rt-trad-titre"><i data-lucide="alert-triangle"></i><span>Une démarche à lancer <strong>tôt</strong> : la traduction assermentée</span></p>
      <p>Le portail n'accepte vos ${liste} qu'en français, traduits par un <strong>traducteur assermenté</strong> — inscrit sur la liste officielle de votre pays — et accompagnés de l'original. Une traduction faite par quelqu'un d'autre est refusée, quelle que soit sa qualité. Demandez la liste à l'espace Campus France de votre pays : c'est lui qui la tient.</p>
      <div class="rt-outils">
        <span><a href="documents.html?categorie=administratif" class="rt-outil"><i data-lucide="file-signature"></i><span>Où l'obtenir, en combien de temps, ce qu'il faut vérifier</span></a></span>
        <span data-feature="ai_translate"><a href="ai-translate.html" data-real-href="ai-translate.html" class="rt-outil"><i data-lucide="languages"></i><span>Comprendre mon document en attendant</span></a></span>
      </div>
      <button type="button" class="rt-trad-changer" data-traduction="francais">Finalement, ils sont en français</button>
    </div>`;
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

/**
* LA CANDIDATURE, UNIVERSITÉ PAR UNIVERSITÉ (relecture du 2026-09-25).
*
* L'étudiant dépose LUI-MÊME sur le site de chaque université. Avant,
* cette étape n'avait que le bouton du portail national et un champ
* « numéro » : rien de ce que CETTE université demande, alors que le
* catalogue le sait (bloc « admission » de sa fiche). Chaque vœu a
* maintenant sa carte, dans l'ordre des gestes : lire ce qu'elle
* demande, faire vérifier son dossier par Fitz, déposer sur son site,
* puis déclarer le dépôt ici — un numéro, OU la capture, OU l'e-mail
* de confirmation (une image ou un PDF).
*/
const CHAMPS_ADMISSION = [
  ["procedure", "Comment candidater"],
  ["calendrier", "Le calendrier"],
  ["conditions", "Les conditions"],
  ["langue", "La langue exigée"],
  ["fraisDossier", "Les frais de dossier"],
  ["coutIndicatif", "Le coût indicatif"]
];

/** La valeur gardée à l'étape quand la preuve est un fichier, pas un numéro. */
const PREUVE_CAPTURE = "capture jointe";

function htmlChampFichier(id) {
  return `
    <label class="rt-preuve rt-preuve--fichier">
      <span>Ou la capture, ou l'e-mail de confirmation</span>
      <input type="file" ${id ? `id="${id}" ` : ""}name="fichier" accept="image/*,application/pdf">
      <small>Une photo de l'écran de confirmation, ou l'e-mail enregistré en PDF. Une image, ou un PDF de 5 Mo au plus.</small>
    </label>`;
}

function htmlAdmission(v) {
  const f = v.fiche;
  if (!f) {
    return `<p class="rt-mention"><i data-lucide="info"></i><span>Cet établissement n'est pas encore dans le catalogue de Fitz. Lisez sa page d'admission sur son site officiel : la procédure, la date limite et les pièces demandées.</span></p>`;
  }
  const a = f.admission;
  if (!a) {
    return `<p class="rt-mention"><i data-lucide="info"></i><span>Fitz n'a pas encore relevé la procédure d'admission de ${ech(f.nom)}. Lisez-la sur son site officiel avant de déposer : la date limite et les pièces demandées y sont.</span></p>`;
  }
  const lignes = CHAMPS_ADMISSION.filter(([k]) => a[k]).map(([k, libelle]) => `
      <div class="rt-adm-ligne"><dt>${ech(libelle)}</dt><dd>${ech(a[k])}</dd></div>`).join("");
  const sources = a.sources.map((s, i) => `<a href="${ech(s)}" target="_blank" rel="noopener noreferrer">source ${i + 1}</a>`).join(" · ");
  return `
    <dl class="rt-admission">${lignes}</dl>
    <p class="rt-source">${a.verifieLe ? `Relevé le ${ech(formaterDate(a.verifieLe))} sur les pages officielles de l'université` : "Relevé sur les pages officielles de l'université"}${sources ? ` · ${sources}` : ""} · <a href="${ech(f.adresse)}">la fiche complète</a></p>`;
}

function htmlLienUniversite(v) {
  const f = v.fiche;
  const portail = f && etat.portails ? portailUniversite({ universityId: f.id }) : "";
  if (portail) return `<a href="${ech(portail)}" target="_blank" rel="noopener noreferrer" class="rt-outil"><i data-lucide="external-link"></i><span>Ouvrir son portail de candidature</span></a>`;
  if (f && f.site) return `<a href="${ech(f.site)}" target="_blank" rel="noopener noreferrer" class="rt-outil"><i data-lucide="external-link"></i><span>Ouvrir son site officiel</span></a>`;
  return "";
}

function htmlCandidature(e) {
  if (!e.voeux.length) return `<p class="rt-vide">${ech(e.empechement)}</p>`;
  if (e.nonConcerne) return "";
  const jour = aujourdhuiISO();
  return `
    <ol class="rt-cands">${e.voeux.map((v) => {
      const nom = (v.fiche && v.fiche.nom) || v.university;
      const tete = `
        <div class="rt-cand-tete"><strong>${ech(v.university)}</strong><span>${ech([v.formation, v.niveau].filter(Boolean).join(" · "))}</span></div>`;
      if (v.depose) {
        const resume = resumePreuve(lirePreuve(v));
        return `
      <li class="rt-cand is-depose">${tete}
        <p class="rt-cand-ok"><i data-lucide="check-circle-2"></i><span>${ech(resume || "Candidature déclarée déposée.")}</span></p>
      </li>`;
      }
      const verifier = avecDestination(`ai-check.html?applicationId=${encodeURIComponent(v.id)}`);
      return `
      <li class="rt-cand">${tete}
        <details class="rt-cand-lire" open>
          <summary><i data-lucide="book-open"></i><span>Ce que demande ${ech(nom)}</span></summary>
          ${htmlAdmission(v)}
        </details>
        <ol class="rt-cand-gestes">
          <li>
            <strong>Faire vérifier votre dossier, avant de l'envoyer</strong>
            <span>Fitz relit vos pièces et votre lettre pour cette candidature. Une pièce manquante ou mal nommée suffit souvent à faire écarter un dossier.</span>
            <span data-feature="ai_check"><a href="${ech(verifier)}" data-real-href="${ech(verifier)}" class="rt-btn rt-btn--fitz"><i data-lucide="shield-check"></i><span>Faire vérifier ce dossier par Fitz</span></a></span>
          </li>
          <li>
            <strong>Déposer sur le site de l'université</strong>
            <span>Suivez sa procédure, écrite ci-dessus. À la fin, gardez le numéro de candidature, ou faites une capture de l'écran de confirmation, ou gardez l'e-mail qu'elle vous envoie.</span>
            ${htmlLienUniversite(v)}
          </li>
          <li>
            <strong>Déclarer votre dépôt ici</strong>
            <form class="rt-form rt-depot" data-depot-voeu="${ech(v.id)}" novalidate>
              <label class="rt-preuve">
                <span>Le numéro ou la référence de candidature</span>
                <input type="text" name="numero" maxlength="64" autocomplete="off" placeholder="Si le site vous en a donné un">
              </label>
              ${htmlChampFichier("")}
              <label class="rt-preuve">
                <span>Déposée le</span>
                <input type="date" name="deposeLe" value="${ech(jour)}" max="${ech(jour)}">
              </label>
              <button type="submit" class="rt-btn rt-btn--fait"><i data-lucide="circle-check"></i><span>J'ai déposé cette candidature</span></button>
            </form>
          </li>
        </ol>
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

// ---- Hors France, Turquie et Maroc : le choix de la voie ----
function htmlVoie(e) {
  const v = e.voie;
  const choix = v.options.find((o) => o.id === v.choisie);
  return `
    <div class="fitz-choice-group rt-voie" role="radiogroup" aria-label="${ech(v.question)}">${v.options.map((o) => `
      <label class="fitz-choice"><input type="radio" name="voie" value="${ech(o.id)}" data-voie="${ech(o.id)}"${v.choisie === o.id ? " checked" : ""}><span class="fitz-choice-dot" aria-hidden="true"></span><span class="rt-voie-texte"><strong>${ech(o.libelle)}</strong>${o.aide ? `<span>${ech(o.aide)}</span>` : ""}</span></label>`).join("")}
    </div>
    <p class="rt-q-aide">${choix
      ? `Votre route suit la voie « ${ech(choix.libelle)} » : les étapes des autres voies en sont retirées. Vous pouvez en changer ici à tout moment.`
      : "Votre choix retire de votre route les étapes des autres voies. Vous pourrez en changer ici à tout moment."}</p>`;
}

// ---- Dernière étape hors France : les démarches du départ ----
function htmlDepart(e) {
  const guide = guideVisaPour({ espace: "preinscription", procedure: etat.procedure });
  const faits = e.visa.etat;
  return `
    <p class="rt-sous-titre">Les démarches du départ — ${e.visa.faites} sur ${e.visa.total}</p>
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
    </div>`;
}

function htmlCorps(e) {
  switch (e.kind) {
    case "depart": return htmlDepart(e);
    case "voie": return htmlVoie(e);
    case "situation": return htmlSituation(e);
    case "diagnostic": return htmlDiagnostic(e);
    case "voeux": return htmlVoeux(e);
    case "pieces": return htmlPieces(e);
    case "motivations": return htmlMotivations(e);
    case "reponses": return htmlReponses(e);
    case "candidature": return htmlCandidature(e);
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
      <span class="rt-num">Étape ${e.numero} sur ${etat.route.total}</span>
      <span class="rt-pill is-${e.etat}">${pill}</span>
    </div>
    <h2 class="rt-titre"><i data-lucide="${ech(e.icone)}"></i><span>${ech(e.titre)}</span></h2>
    <p class="rt-clair">${ech(e.enClair)}</p>
    ${htmlEcheance(e)}
    ${htmlFaits(e)}
    ${htmlAApporter(e)}
    ${htmlCorps(e)}
    ${htmlIgnorer(e)}
    ${e.kind === "motivations" || e.kind === "reponses" ? `<div class="rt-actions">${htmlPortail(e)}</div>` : ""}
    ${htmlOutils(e)}
    ${htmlOfficiel(e)}
    <div class="rt-pied">
      ${boutonRecours({ code: "quoi_faire", etape: e.id }, { classe: "fitz-recours--bloc" })}
      ${etat.conseiller ? `<a href="advisor.html" class="rt-conseiller"><i data-lucide="user-check"></i><span>Demander une relecture à mon conseiller</span></a>` : ""}
    </div>
    <div class="rt-nav">
      ${e.numero > 1 ? `<button type="button" class="rt-nav-btn" data-aller="${ech(etat.route.etapes[e.numero - 2].id)}"><i data-lucide="arrow-left"></i><span>Étape ${e.numero - 1}</span></button>` : "<span></span>"}
      ${e.numero < etat.route.total ? `<button type="button" class="rt-nav-btn" data-aller="${ech(etat.route.etapes[e.numero].id)}"><span>Étape ${e.numero + 1}</span><i data-lucide="arrow-right"></i></button>` : ""}
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

// PREMIUM 1 : après chaque peinture, la bande des étapes se recentre
// d'elle-même sur l'étape choisie (ou courante). Sans ce geste, la bande
// restait figée à gauche (scrollLeft 0) et l'étudiant devait la faire
// défiler à la main pour retrouver où il en est.
function centrerLeFil() {
  const fil = document.getElementById("rtFil");
  if (!fil) return;
  const actif = fil.querySelector(".rt-point.is-choisie") || fil.querySelector(".rt-point.is-courante");
  if (!actif) return;
  const gauche = Math.max(0, actif.offsetLeft - (fil.clientWidth - actif.offsetWidth) / 2);
  const doux = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  fil.scrollTo({ left: gauche, behavior: doux ? "smooth" : "auto" });
}

function peindre() {
  peindreTete();
  peindreEtape();
  peindreSuite();
  icones();
  centrerLeFil();
}

/**
* Une donnée arrivée après la première peinture (le catalogue, les
* portails) ne se voit qu'à l'étape de candidature. On ne repeint que
* celle-là, et jamais sous les doigts de l'étudiant : un champ en cours
* de saisie ne s'efface pas.
*/
function repeindreCandidature() {
  recomposer();
  const e = etapeChoisie();
  if (!e || e.kind !== "candidature") return;
  const section = document.getElementById("rtEtape");
  if (section && section.contains(document.activeElement) && /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) return;
  peindre();
}

function aller(id, defiler = true) {
  etat.choisie = id;
  peindre();
  const cible = document.getElementById("rtEtape");
  if (cible) {
    // PREMIUM 2 : l'animation d'entrée (rt-entree, css/route.css) ne
    // jouait qu'au chargement — en naviguant d'une étape à l'autre, le
    // contenu changeait sèchement. On la rejoue : couper, forcer le
    // navigateur à le constater (offsetWidth), rendre la main à la
    // feuille. Sous prefers-reduced-motion la feuille dit animation:none,
    // donc rendre la main n'anime rien.
    cible.style.animation = "none";
    void cible.offsetWidth;
    cible.style.animation = "";
    if (defiler) cible.scrollIntoView({ behavior: "smooth", block: "start" });
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
      href: adresseRoute(e.id),
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
  for (const q of questionsSituation()) {
    const el = form.elements[q.cle];
    const val = el ? (el instanceof RadioNodeList ? el.value : el.value) : "";
    maj[q.cle] = String(val || "").trim();
  }
  // LE PAYS REVIENT À SA FORME DU RÉFÉRENTIEL (2026-09-18). Constaté en
  // ligne : « senegal » tapé sans cliquer la suggestion partait en base
  // tel quel — le clavier du téléphone cache la liste, l'étudiant
  // enregistre directement. canoniser() (js/champs-guides.js) ne corrige
  // que l'égalité stricte accents/casse mises à part : « guine » ne
  // choisit pas une Guinée à la place de l'étudiant, et une valeur
  // inconnue du référentiel reste telle que tapée.
  maj.country = canoniser(maj.country, COUNTRY_NAMES);
  maj.nationality = canoniser(maj.nationality, COUNTRY_NAMES);
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
  const plafond = plafondVoeux();
  const quota = Number.isFinite(etat.quota) ? Math.min(etat.quota, plafond) : plafond;
  // Un espace d'identifiants par pays : pre-N (France), pre-it-N, pre-tr-N…
  // — le même que celui des règles (preSlotPattern, preSlotPatternPays).
  const slotId = slotIdLibre(etat.voeux, quota, estFrance() ? "pre" : PREFIXES_VOEU[etat.destination]);
  if (!slotId) { toast(quota === 1 ? "Votre cours est déjà posé." : `Vos ${quota} vœux sont déjà posés.`, "error"); return; }
  const payload = {
    university, formation, niveau,
    scholarship: "",
    // LE VŒU PORTE SA DESTINATION (lot R4, 2026-09-17). Sans elle, les
    // trois outils préremplissaient « Pays visé » avec le premier pays
    // souhaité du profil : un vœu à Lille partait pour la Chine.
    country: estFrance() ? PAYS_PREINSCRIPTION : etat.config.nom,
    portalUrl: estFrance() ? PORTAIL_ETUDES_EN_FRANCE : ((etat.route && etat.route.portail && etat.route.portail.url) || ""),
    status: "a_preparer",
    track: "preinscription",
    deadline: null,
    reminderFrequency: 14,
    notes: "",
    motivation: { faite: false },
    createdAt: serverTimestamp()
  };
  // Hors France, le vœu porte son pays : c'est ce champ qui le range dans
  // la bonne route. Les vœux France n'en ont pas (ceux d'avant non plus).
  if (!estFrance()) payload.destination = etat.destination;
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
    await updateDoc(refUser(), { [`${champDossier()}.pieces`]: pieces });
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
  const champFichier = document.getElementById("rtPreuveFichier");
  const fichier = (champFichier && champFichier.files && champFichier.files[0]) || null;
  const numero = champ ? champ.value.trim() : "";
  const faite = !e.cochee;
  if (faite && e.preuve.requise && !numero && !fichier) {
    toast(champFichier ? `Indiquez d'abord ${e.preuve.libelle}, ou joignez la capture ou l'e-mail de confirmation.` : `Indiquez d'abord ${e.preuve.libelle}.`, "error");
    if (champ) champ.focus();
    return;
  }
  if (faite && fichier) {
    if (!fichierAcceptable(fichier)) { toast("La preuve doit être une image, ou un PDF de 5 Mo au plus.", "error"); return; }
    if (!etat.voeux.length) { toast("Posez d'abord votre vœu (étape 3) : la capture se range avec lui.", "error"); return; }
  }
  const preuve = numero || (fichier ? PREUVE_CAPTURE : "");
  const etapes = { ...((etat.dossier && etat.dossier.etapes) || {}) };
  etapes[e.id] = { faite, faitLe: faite ? aujourdhuiISO() : null, preuve };
  try {
    await updateDoc(refUser(), { [`${champDossier()}.etapes.${e.id}`]: etapes[e.id] });
    etat.dossier = { ...(etat.dossier || {}), etapes };
    // Le numéro de dossier vaut pour tous les vœux : un seul dossier les
    // porte. On le déclare sur chacun, pour que le suivi (et l'admin)
    // sache qu'ils sont déposés.
    // Hors France, l'étape de dépôt du pays (e.depot) joue le même rôle.
    if ((e.id === "ef_soumission" || e.depot) && faite) await declarerDepot(numero, fichier);
    toast(faite ? "Étape faite." : "Étape rouverte.");
    recomposer();
    if (faite) etat.choisie = prochaineApres(e.id);
    peindre();
  } catch (error) {
    console.error("Étape non enregistrée :", error);
    toast("L'étape n'a pas pu être enregistrée. Réessayez.", "error");
  }
}

async function declarerDepot(numero, fichier = null) {
  const jour = aujourdhuiISO();
  for (const v of etat.voeux) {
    if (STATUTS_DEPOSES_VOEU.includes(v.status)) continue;
    const preuveDepot = { mode: fichier ? "capture" : "numero", deposeLe: jour, declareLe: jour };
    if (numero) preuveDepot.numeroDossier = numero;
    const maj = { status: "deposee", preuveDepot, updatedAt: serverTimestamp() };
    try {
      // La capture se range avec CHAQUE vœu : c'est le seul chemin que
      // storage.rules et firestore.rules acceptent (preuveValide).
      if (fichier) preuveDepot.fichier = await envoyerPreuve(v.id, fichier);
      await updateDoc(doc(db, "users", etat.session.user.uid, "applications", v.id), maj);
      v.status = "deposee";
      v.preuveDepot = maj.preuveDepot;
    } catch (error) {
      console.warn("Dépôt non déclaré sur un vœu :", v.id, error);
    }
  }
}

/** Une image (compressée à l'envoi) ou un PDF de 5 Mo au plus : miroir de storage.rules. */
function fichierAcceptable(file) {
  if (!file) return true;
  const type = file.type || "";
  if (!TYPES_FICHIER.some((t) => type.startsWith(t))) return false;
  return type.startsWith("image/") || file.size <= TAILLE_MAX_FICHIER;
}

// La preuve d'un vœu : compressée si c'est une image (même geste
// qu'applications.js), puis rangée dans le dossier Storage de CE vœu.
async function envoyerPreuve(applicationId, file) {
  let blob = file;
  let ext = (String(file.name || "").split(".").pop() || "").toLowerCase();
  if ((file.type || "").startsWith("image/")) {
    blob = await compressImageToTarget(file, 1.5 * 1024 * 1024);
    ext = "jpg";
  }
  if (file.type === "application/pdf") ext = "pdf";
  const chemin = cheminCapture(etat.session.user.uid, applicationId, ext);
  await uploadBytes(storageRef(storage, chemin), blob, { contentType: blob.type || file.type });
  return chemin;
}

/** Le dépôt d'UNE candidature, sur le site de SON université. */
async function declarerCandidature(e, form) {
  const id = form.getAttribute("data-depot-voeu");
  const v = etat.voeux.find((x) => x.id === id);
  if (!v) return;
  const numero = form.elements.numero.value.trim();
  const fichier = (form.elements.fichier.files && form.elements.fichier.files[0]) || null;
  const deposeLe = form.elements.deposeLe.value || aujourdhuiISO();
  if (!numero && !fichier) {
    toast("Indiquez le numéro de candidature, ou joignez la capture ou l'e-mail de confirmation.", "error");
    form.elements.numero.focus();
    return;
  }
  if (!fichierAcceptable(fichier)) { toast("La preuve doit être une image, ou un PDF de 5 Mo au plus.", "error"); return; }
  const brouillon = { mode: fichier ? "capture" : "numero", deposeLe, numeroDossier: numero || undefined, fichier: fichier ? "a-envoyer" : undefined };
  if (!preuveValide(brouillon)) { toast("Vérifiez la date du dépôt : elle ne peut pas être dans le futur.", "error"); return; }
  const bouton = form.querySelector("button[type=submit]");
  if (bouton) bouton.disabled = true;
  try {
    const preuveDepot = { mode: brouillon.mode, deposeLe, declareLe: serverTimestamp() };
    if (numero) preuveDepot.numeroDossier = numero;
    if (fichier) preuveDepot.fichier = await envoyerPreuve(v.id, fichier);
    await updateDoc(doc(db, "users", etat.session.user.uid, "applications", v.id), { status: "deposee", preuveDepot, updatedAt: serverTimestamp() });
    v.status = "deposee";
    v.preuveDepot = { ...preuveDepot, declareLe: aujourdhuiISO() };
    toast(`Candidature à ${v.university} déclarée déposée.`);
    recomposer();
    const apres = etat.route.etapes.find((x) => x.id === e.id);
    if (apres && apres.faite) etat.choisie = prochaineApres(e.id);
    peindre();
  } catch (error) {
    console.error("Dépôt non déclaré :", error);
    toast("Le dépôt n'a pas pu être enregistré. Réessayez.", "error");
    if (bouton) bouton.disabled = false;
  }
}

/**
 * LA DÉCLARATION DE LANGUE — un champ, deux valeurs, aucune déduction.
 * Écrite au niveau du DOSSIER (comme les étapes et les pièces) : elle
 * vaut pour toutes les pièces, pas pour un vœu.
 */
async function declarerTraduction(valeur) {
  if (!DECLARATIONS_TRADUCTION.includes(valeur)) return;
  try {
    await updateDoc(refUser(), { [`${champDossier()}.traductions`]: valeur });
    etat.dossier = { ...(etat.dossier || {}), traductions: valeur };
    toast(valeur === "francais" ? "Noté : aucune traduction à faire." : "Noté : une traduction assermentée à prévoir.");
    recomposer();
    peindre();
  } catch (error) {
    console.error("Déclaration de langue non enregistrée :", error);
    toast("Votre réponse n'a pas pu être enregistrée. Réessayez.", "error");
  }
}

/** Le choix de la voie (Turquie, Maroc) : un champ du dossier du pays. */
async function choisirVoie(id) {
  try {
    await updateDoc(refUser(), { [`${champDossier()}.voie`]: id });
    etat.dossier = { ...(etat.dossier || {}), voie: id };
    toast("Votre voie est enregistrée : la route s'y est réglée.");
    const ici = etat.choisie;
    recomposer();
    etat.choisie = prochaineApres(ici);
    peindre();
  } catch (error) {
    console.error("Voie non enregistrée :", error);
    toast("Votre choix n'a pas pu être enregistré. Réessayez.", "error");
  }
}

/** « Cette étape ne me concerne pas », et son contraire. */
async function ignorerEtape(e) {
  const ignorer = !e.nonConcerne;
  const etapes = { ...((etat.dossier && etat.dossier.etapes) || {}) };
  const avant = etapes[e.id] && typeof etapes[e.id] === "object" ? etapes[e.id] : { faite: false, faitLe: null, preuve: "" };
  etapes[e.id] = { faite: !!avant.faite, faitLe: avant.faitLe || null, preuve: String(avant.preuve || ""), nonConcerne: ignorer };
  try {
    await updateDoc(refUser(), { [`${champDossier()}.etapes.${e.id}`]: etapes[e.id] });
    etat.dossier = { ...(etat.dossier || {}), etapes };
    toast(ignorer ? "Noté : cette étape ne vous concerne pas." : "Noté : cette étape vous concerne.");
    recomposer();
    if (ignorer) etat.choisie = prochaineApres(e.id);
    peindre();
  } catch (error) {
    console.error("Étape non enregistrée :", error);
    toast("L'étape n'a pas pu être enregistrée. Réessayez.", "error");
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
    const depot = estFrance() ? null : etat.route.etapes.find((x) => x.depot && !x.nonConcerne);
    toast(estFrance()
      ? "La réponse n'a pas pu être enregistrée. Déclarez d'abord votre numéro de dossier (étape 9)."
      : `La réponse n'a pas pu être enregistrée. Déclarez d'abord votre dépôt${depot ? ` (étape ${depot.numero})` : ""}.`, "error");
    peindre();
  }
}

async function cocherVisa(id, fait) {
  // France : users/{uid}.visaChecklist (inchangé). Ailleurs : le dossier du pays.
  const source = estFrance() ? etat.userData.visaChecklist : (etat.dossier && etat.dossier.visaChecklist);
  const visa = {};
  VISA_ETAPES.forEach((k) => { visa[k] = !!(source && source[k] === true); });
  visa[id] = fait;
  try {
    if (estFrance()) {
      await updateDoc(refUser(), { visaChecklist: visa });
      etat.userData.visaChecklist = visa;
    } else {
      await updateDoc(refUser(), { [`${champDossier()}.visaChecklist`]: visa });
      etat.dossier = { ...(etat.dossier || {}), visaChecklist: visa };
    }
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
  section.querySelectorAll("[data-piece]").forEach((c) => c.addEventListener("change", () => {
    // PREMIUM 3 : le pop joue À L'INSTANT du geste, pendant que
    // l'enregistrement part au serveur — la classe n'est jamais écrite
    // dans le HTML peint, donc la repeinture ne le rejoue pas
    // (voir rt-coche-pop dans css/route.css).
    if (c.checked) c.classList.add("vient-de-cocher");
    cocherPiece(c.getAttribute("data-piece"), c.checked ? true : null);
  }));
  section.querySelectorAll("[data-ecarter]").forEach((b) => b.addEventListener("click", () => cocherPiece(b.getAttribute("data-ecarter"), b.getAttribute("aria-pressed") === "true" ? null : "non-concerne")));
  // La déclaration de langue : les deux radios de la question, et les
  // deux boutons qui la corrigent après coup — un seul geste derrière.
  section.querySelectorAll("input[data-traduction]").forEach((r) => r.addEventListener("change", () => { if (r.checked) declarerTraduction(r.getAttribute("data-traduction")); }));
  section.querySelectorAll("button[data-traduction]").forEach((b) => b.addEventListener("click", () => declarerTraduction(b.getAttribute("data-traduction"))));
  section.querySelectorAll("[data-lettre]").forEach((b) => b.addEventListener("click", () => cocherLettre(b.getAttribute("data-lettre"), b.getAttribute("aria-pressed") !== "true")));
  section.querySelectorAll("[data-reponse]").forEach((s) => s.addEventListener("change", () => noterReponse(s.getAttribute("data-reponse"), s.value)));
  section.querySelectorAll("[data-visa]").forEach((b) => b.addEventListener("click", () => cocherVisa(b.getAttribute("data-visa"), b.getAttribute("aria-pressed") !== "true")));

  section.querySelectorAll("form[data-depot-voeu]").forEach((f) => f.addEventListener("submit", (ev) => { ev.preventDefault(); declarerCandidature(e, f); }));

  const fait = section.querySelector("#rtFait");
  if (fait) fait.addEventListener("click", () => basculerFait(e));
  section.querySelectorAll("input[data-voie]").forEach((r) => r.addEventListener("change", () => { if (r.checked) choisirVoie(r.getAttribute("data-voie")); }));
  const ignorer = section.querySelector("#rtIgnorer");
  if (ignorer) ignorer.addEventListener("click", () => ignorerEtape(e));
  const preuve = section.querySelector("#rtPreuve");
  if (preuve) preuve.addEventListener("keydown", (ev) => { if (ev.key === "Enter") { ev.preventDefault(); basculerFait(e); } });
}

/**
 * UN PAYS QUI N'EST PAS ENCORE OUVERT (2026-09-23). L'adresse porte
 * ?d=italie, le compte n'a rien acheté pour l'Italie : on le dit, avec
 * la porte vers l'offre du pays et vers les dossiers qu'il a déjà.
 */
function peindreSansDossier() {
  const nom = estFrance() ? "France" : (etat.config ? etat.config.nom : "");
  if (nom) document.title = `Ma route vers ${avecArticle(nom)} | FitzUniverse`;
  document.getElementById("welcomeMessage").textContent = "Bonjour";
  document.getElementById("rtLigne").textContent = nom
    ? `Votre dossier ${nom} n'est pas encore ouvert.`
    : "Cette route n'est pas disponible.";
  ["rtFil", "rtBarre"].forEach((id) => { const el = document.getElementById(id); if (el) el.hidden = true; });
  const suite = document.querySelector(".rt-suite-bloc");
  if (suite) suite.hidden = true;
  const autres = etat.droits.filter((x) => x.destination !== etat.destination);
  const section = document.getElementById("rtEtape");
  section.className = "rt-etape is-courante";
  section.innerHTML = `
    <h2 class="rt-titre"><i data-lucide="lock"></i><span>${nom ? `La route ${ech(auPays(nom))}` : "Route indisponible"}</span></h2>
    <p class="rt-clair">${nom ? `Elle s'ouvre avec une offre de ce pays : Diagnostic ${ech(nom)}, Dossier ${ech(nom)} ou Dossier ${ech(nom)} + Conseiller. Chaque pays a son dossier, avec sa propre procédure.` : "Choisissez une destination."}</p>
    <div class="rt-actions">
      ${nom ? `<a href="preinscription-${ech(etat.destination)}.html" class="rt-btn rt-btn--fait"><i data-lucide="arrow-right"></i><span>Voir les offres ${ech(auPays(nom))}</span></a>` : `<a href="offers.html?parcours=preinscription" class="rt-btn rt-btn--fait"><i data-lucide="arrow-right"></i><span>Voir les offres</span></a>`}
      ${autres.map((x) => `<a href="espace-preinscription.html?d=${ech(encodeURIComponent(x.destination))}" class="rt-btn rt-btn--portail"><i data-lucide="route"></i><span>Ma route ${ech(auPays(x.destination === "france" ? "France" : (configDestination(x.destination) || {}).nom || x.destination))}</span></a>`).join("")}
    </div>`;
  document.body.dataset.routePrete = "1";
  icones();
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

  // LA DESTINATION (2026-09-23). ?d=<pays> ; sinon la France si le compte
  // l'a, sinon le premier pays acheté ; sinon la France, comme avant.
  const params = new URLSearchParams(window.location.search);
  etat.droits = droitsPreinscription(etat.userData);
  const demandee = String(params.get("d") || "").trim().toLowerCase();
  const connue = (id) => id === "france" || !!configDestination(id);
  etat.destination = connue(demandee) ? demandee
    : etat.droits.some((x) => x.destination === "france") ? "france"
    : (etat.droits[0] ? etat.droits[0].destination : "france");
  etat.config = estFrance() ? null : configDestination(etat.destination);

  // Un pays qui n'est pas acheté ne s'ouvre pas (l'accès test, si) — la
  // France comprise : un Dossier Italie ouvre l'espace, pas la route France.
  const planPays = estFrance() ? resolvePlanPreinscriptionFrance(etat.userData) : planPreinscriptionPour(etat.userData, etat.destination);
  if (!planPays && !session.testerAccess) {
    peindreSansDossier();
    return;
  }

  etat.dossier = (estFrance() ? etat.userData.dossierFrance : (etat.userData.dossiersPays && etat.userData.dossiersPays[etat.destination])) || {};
  document.title = `Ma route vers ${avecArticle(nomDestination())} | FitzUniverse`;

  if (sessionStorage.getItem("just_upgraded")) {
    toast(`Votre accompagnement ${sessionStorage.getItem("just_upgraded")} est activé. La route commence ici.`);
    sessionStorage.removeItem("just_upgraded");
  }
  sessionStorage.removeItem("just_created");

  etat.conseiller = !isFeatureLocked(session.planId, session.featureFlags, "advisor", session.testerAccess, session.hasFitzExpress, session.planPreinscriptionId);

  // LE QUOTA EST CELUI DE LA DESTINATION. France : l'offre France seule
  // (resolvePlanPreinscriptionFrance) — la session porte désormais la
  // meilleure offre de TOUS les pays, et un Dossier Italie n'ouvre pas de
  // vœu pre-N. Ailleurs : le plafond du pays, ou zéro pour un Diagnostic.
  etat.quota = session.testerAccess ? null : estFrance()
    ? quotaDeLaFormule({
      espace: "preinscription",
      planId: session.planId,
      planPreinscriptionId: planPays,
      plans: typeof SCHOLARBRIDGE_PLANS !== "undefined" ? SCHOLARBRIDGE_PLANS : null
    })
    : (planPays === "diagnostic-france" ? 0 : etat.config.plafondVoeux);

  const formule = document.getElementById("rtFormule");
  if (formule) {
    const offre = !estFrance() && planPays && typeof window.offrePourDestination === "function" ? window.offrePourDestination(planPays, etat.destination) : null;
    formule.textContent = offre ? offre.label : estFrance() ? (PLAN_PREINSCRIPTION_LABELS[planPays] || "") : "";
    // La pastille de la barre haute dit l'offre de CETTE route : un compte
    // qui a un Dossier France et un Dossier Italie lit « Dossier Italie »
    // sur la route italienne.
    const pastille = document.getElementById("topbarPlanLabel");
    if (pastille && formule.textContent) pastille.textContent = formule.textContent;
  }

  try {
    const snap = await getDocs(collection(db, "users", session.user.uid, "applications"));
    // Les vœux de CETTE destination : sans champ `destination` (ou
    // « france ») pour la France, le champ exact ailleurs.
    etat.voeux = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      .filter((app) => lireParcours(app) === "preinscription")
      .filter((app) => estFrance()
        ? (!app.destination || app.destination === "france")
        // Le champ ET l'identifiant : un vœu d'un pays vit sur pre-<code>-N.
        : (app.destination === etat.destination && String(app.id).startsWith(`${PREFIXES_VOEU[etat.destination]}-`)));
  } catch (error) {
    console.error("Impossible de charger les vœux :", error);
  }

  // RATTRAPAGE DES VŒUX D'AVANT LE LOT R4 : ceux créés sans `country`
  // reçoivent leur destination à la première visite. Une écriture par
  // vœu, une seule fois dans la vie du dossier, et jamais bloquante :
  // un échec laisse l'outil retomber sur le profil, comme avant.
  for (const v of estFrance() ? etat.voeux : []) {
    if (String(v.country || "").trim()) continue;
    try {
      await updateDoc(doc(db, "users", session.user.uid, "applications", v.id), { country: PAYS_PREINSCRIPTION });
      v.country = PAYS_PREINSCRIPTION;
    } catch (error) {
      console.warn("Destination non rattrapée sur un vœu :", v.id, error);
    }
  }

  recomposer();
  if (!etat.route) {
    console.error("Aucune procédure pour la destination :", etat.destination);
    peindreSansDossier();
    return;
  }
  if (params.get("action") === "new") etat.choisie = "voeux";
  else if (params.get("etape") && etat.route.etapes.some((e) => e.id === params.get("etape"))) etat.choisie = params.get("etape");
  // On nettoie ?etape et ?action ; la destination reste dans l'adresse.
  if (params.has("action") || params.has("etape")) history.replaceState(null, "", params.has("d") ? `${window.location.pathname}?d=${encodeURIComponent(etat.destination)}` : window.location.pathname);

  document.body.dataset.routePrete = "1";
  peindre();

  // La liste d'aide des établissements français — après la première
  // peinture : le catalogue ne retient jamais la route.
  try {
    const unis = await chargerUniversites();
    const pays = nomDestination().toLowerCase();
    etat.fichesPays = unis.filter((u) => String(u.country || "").trim().toLowerCase() === pays);
    etat.universites = etat.fichesPays
      .map((u) => u.name).filter(Boolean).sort((a, b) => a.localeCompare(b, "fr"));
    // Le champ lit la source à chaque frappe : rien à re-peindre — sauf
    // l'étape de candidature, qui montre ce que chaque université demande.
    if (!estFrance()) repeindreCandidature();
  } catch (error) {
    console.warn("Catalogue indisponible pour la liste d'aide :", error);
  }

  // Le portail de candidature de chaque université (réservé aux
  // abonnés, servi par la Cloud Function) : à défaut, son site officiel.
  if (!estFrance()) {
    const carte = await chargerPortails().catch(() => null);
    if (carte) {
      etat.portails = true;
      repeindreCandidature();
    }
  }

}).catch((error) => {
  console.error("La route n'a pas pu s'afficher :", error);
});
