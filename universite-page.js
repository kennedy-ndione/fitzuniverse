// ============================================================
// FitzUniverse — universite.html : la fiche d'un établissement
// (lot 76-77, 2026-09-24). Voir l'en-tête de js/fiche-universite.js
// pour ce que la page répare et pour la règle des trois valeurs.
//
// Ce fichier ne fait que POSER la vue : tout le calcul vit dans le
// module pur, testé sous Node. Chaque texte du catalogue entre par
// textContent — jamais par innerHTML : une source qui contiendrait un
// chevron ne doit pas pouvoir écrire dans la page.
//
// PAGE PUBLIQUE. La seule donnée réservée est le portail de
// candidature, servi par la fonction `portails` à un abonné (lot S3),
// exactement comme sur la fiche programme (details.js).
// ============================================================

import { chargerCatalogue } from "./js/catalog-data.js";
import { ficheUniversite, resumeFiche, domaineDe } from "./js/fiche-universite.js";
import { resolveCityImage } from "./js/scholarship-image.js";
import { trackEvent } from "./js/analytics.js";
import { resolveSession } from "./js/access-guard.js";
import { chargerPortails, portailUniversite } from "./js/portails.js";

const params = new URLSearchParams(window.location.search);
const id = (params.get("id") || "").trim();

const $ = (x) => document.getElementById(x);

function element(balise, classe, texte) {
const el = document.createElement(balise);
if (classe) el.className = classe;
if (texte !== undefined) el.textContent = texte;
return el;
}

function lienSource(adresse, libelle) {
const a = element("a", "", libelle);
a.href = adresse;
a.target = "_blank";
a.rel = "noopener noreferrer";
return a;
}

// La ligne « Source : domaine · vérifié le … », en nœuds.
function poserSource(cible, adresse, date) {
cible.textContent = "";
if (!adresse && !date) { cible.hidden = true; return; }
// domaineDe() ne lève jamais : une adresse mal formée dans une source
// ne doit pas laisser la fiche entière cachée.
if (adresse) {
cible.append("Source : ");
cible.append(lienSource(adresse, domaineDe(adresse) || adresse));
}
if (date) cible.append(`${adresse ? " · " : ""}vérifié le ${date}`);
cible.hidden = false;
}

// État d'erreur : même posture que la fiche programme — la page garde
// son en-tête et offre deux sorties, jamais une impasse.
function afficherErreur(titre, message) {
const main = $("ficheMain");
if (!main) return;
main.textContent = "";
const boite = element("div", "fiche-erreur");
boite.style.cssText = "max-width:560px;margin:0 auto;padding:140px 24px 96px;text-align:center;";
boite.append(element("h1", "", titre));
const p = element("p", "", message);
p.style.cssText = "color:var(--text-light);margin:12px 0 28px;";
boite.append(p);
const sorties = element("div");
sorties.style.cssText = "display:flex;gap:12px;justify-content:center;flex-wrap:wrap;";
const u = element("a", "btn btn-primary", "Voir les universités");
u.href = "universities.html";
const b = element("a", "btn btn-secondary", "Voir les bourses");
b.href = "scholarships.html";
sorties.append(u, b);
boite.append(sorties);
main.append(boite);
main.hidden = false;
document.title = `${titre} | FitzUniverse`;
}

function poserSeo(vue) {
document.title = `${vue.titre}${vue.pays ? ` (${vue.pays})` : ""} : coût, admission | FitzUniverse`;
const resume = resumeFiche(vue);
const meta = document.querySelector('meta[name="description"]');
if (meta && resume) meta.setAttribute("content", resume);
// La page est paramétrée : sa canonique porte l'identifiant, et og:url
// la suit — même règle que details.js.
const canonical = document.querySelector('link[rel="canonical"]');
if (canonical) canonical.href = `${canonical.href.split("?")[0]}?id=${encodeURIComponent(vue.id)}`;
const ogUrl = document.querySelector('meta[property="og:url"]');
if (ogUrl && canonical) ogUrl.setAttribute("content", canonical.href);
const ogTitle = document.querySelector('meta[property="og:title"]');
if (ogTitle) ogTitle.setAttribute("content", document.title);
const ogDesc = document.querySelector('meta[property="og:description"]');
if (ogDesc && resume) ogDesc.setAttribute("content", resume);
}

function poserHero(vue) {
const photo = resolveCityImage(vue.image);
const img = $("ficheImage");
img.src = photo.src;
img.srcset = photo.srcset;
img.sizes = "100vw";
img.alt = vue.lieu || vue.titre;
img.onerror = () => { img.onerror = null; img.removeAttribute("srcset"); img.src = photo.fallbackOriginal; };

const drapeau = $("ficheDrapeau");
if (vue.drapeau) {
drapeau.src = `assets/flags/${vue.drapeau}`;
drapeau.onerror = () => { drapeau.onerror = null; drapeau.src = "assets/flags/default.svg"; };
drapeau.hidden = false;
}
$("fichePays").textContent = vue.pays;
$("ficheTitre").textContent = vue.titre;
$("ficheLieu").textContent = vue.lieu;
if (vue.classement) { $("ficheClassement").textContent = vue.classement; $("ficheClassement").hidden = false; }
}

function poserEnBref(vue) {
$("ficheDescription").textContent = vue.description;
$("ficheDescription").hidden = !vue.description;
const grille = $("ficheEnBref");
grille.textContent = "";
for (const fait of vue.enBref) {
// Une valeur longue (un statut juridique) prend toute la largeur, en
// graisse normale : une phrase en gras sur cinq lignes ne se lit pas.
const item = element("div", fait.valeur.length > 70 ? "details-info-item is-long" : "details-info-item");
const icone = element("i");
icone.setAttribute("data-lucide", fait.icone || "info");
const corps = element("div");
corps.append(element("span", "", fait.libelle), element("strong", "", fait.valeur));
if (fait.aide) corps.append(element("small", "", fait.aide));
item.append(icone, corps);
grille.append(item);
}
grille.hidden = !vue.enBref.length;
}

function poserCouts(vue) {
const c = vue.couts;
const liste = $("ficheCoutsLignes");
liste.textContent = "";
for (const ligne of c.lignes) {
const li = element("li", ligne.verifie ? "" : "is-inconnu");
const valeur = element("div", "fiche-couts-valeur");
valeur.append(element("strong", "", ligne.montant || ligne.texte));
if (ligne.mention) valeur.append(element("small", "", ligne.mention));
li.append(element("span", "", ligne.niveau || "Tous niveaux"), valeur);
liste.append(li);
}

if (c.note) {
$("ficheCoutsNoteTexte").textContent = c.note;
poserSource($("ficheCoutsSource"), c.source, c.verifieLe);
$("ficheCoutsNote").hidden = false;
}

if (c.coutIndicatif) {
$("ficheCoutIndicatifTexte").textContent = c.coutIndicatif;
$("ficheCoutIndicatif").hidden = false;
}

if (c.exoneration) {
$("ficheExonerationLibelle").textContent = c.exoneration.libelle;
$("ficheExonerationDetail").textContent = c.exoneration.detail;
$("ficheExonerationDetail").hidden = !c.exoneration.detail;
poserSource($("ficheExonerationSource"), c.exoneration.source, c.exoneration.verifieLe);
$("ficheExoneration").hidden = false;
}
}

function poserCandidature(vue, portail) {
const c = vue.candidature;
const voie = portail ? null : c.voie;

if (voie) {
$("ficheVoieLibelle").textContent = voie.libelle;
$("ficheVoieTexte").textContent = voie.explication;
$("ficheVoie").hidden = false;
} else {
$("ficheVoie").hidden = true;
}

const dl = $("ficheEtapes");
dl.textContent = "";
for (const etape of c.etapes) dl.append(element("dt", "", etape.libelle), element("dd", "", etape.texte));
dl.hidden = !c.etapes.length;

if (c.sources.length) {
$("ficheSourcesDate").textContent = c.verifieLe ? `Pages officielles relues le ${c.verifieLe}.` : "";
$("ficheSourcesDate").hidden = !c.verifieLe;
const ul = $("ficheSourcesListe");
ul.textContent = "";
for (const s of c.sources) {
const li = element("li");
li.append(lienSource(s.url, s.libelle || s.domaine || s.url));
ul.append(li);
}
$("ficheSources").hidden = false;
}

$("ficheCandidature").hidden = !(voie || c.etapes.length || c.sources.length);
}

function poserProgrammes(vue) {
const ul = $("ficheProgrammesListe");
ul.textContent = "";
for (const p of vue.programmes) {
const li = element("li");
const a = element("a");
a.href = p.href;
const gauche = element("div");
gauche.append(element("strong", "", p.bourse));
if (p.niveau) { gauche.append(document.createElement("br")); gauche.append(element("span", "", p.niveau)); }
a.append(gauche);
if (p.etat) a.append(element("span", p.etat.ouvert ? "is-open" : "", p.etat.court));
li.append(a);
ul.append(li);
}
$("ficheProgrammes").hidden = !vue.programmes.length;
}

function poserAppel(vue) {
// Une destination accompagnée en préinscription : l'appel mène à SA
// page, où sont les offres du pays. Sinon, la grille générale.
if (vue.destination) {
$("ficheCtaTitre").textContent = "Préparer votre préinscription";
$("ficheCtaTexte").textContent = `Fitz vous accompagne pour candidater ${vue.destination.auPays} : dossier, calendrier, démarches.`;
$("ficheCtaLibelle").textContent = vue.destination.libelle;
$("ficheCta").href = vue.destination.page;
} else {
$("ficheCta").href = vue.programmes.length ? "offers.html?parcours=bourse" : "offers.html";
}
}

async function poserPortails(vue) {
const bloc = $("fichePortails");
const site = $("ficheSite");
if (vue.siteOfficiel) {
site.href = vue.siteOfficiel;
site.hidden = false;
site.addEventListener("click", () => trackEvent("university_site_opened", { country: vue.pays, university: vue.titre }));
}
bloc.hidden = site.hidden;

// Le portail : réservé aux abonnés, décidé par le serveur (lot S3).
// Même condition d'abonnement que details.js.
let portail = "";
try {
const session = await resolveSession().catch(() => null);
const abonne = !!session && (session.testerAccess || session.planId !== "gratuit" || !!session.planPreinscriptionId || session.hasFitzExpress);
if (abonne) {
await chargerPortails();
portail = portailUniversite({ universityId: vue.id });
}
} catch {
portail = "";
}

if (portail) {
const lien = $("fichePortail");
lien.href = portail;
lien.hidden = false;
lien.addEventListener("click", () => trackEvent("application_portal_opened", { country: vue.pays, university: vue.titre }));
bloc.hidden = false;
}

return portail;
}

async function charger() {

if (!id) {
afficherErreur("Établissement introuvable", "L'adresse ne dit pas de quel établissement il s'agit. Le catalogue complet vous attend.");
return;
}

let catalogue;
try {
catalogue = await chargerCatalogue();
} catch (erreur) {
console.error("Catalogue indisponible :", erreur);
afficherErreur("Chargement interrompu", "Vérifiez votre connexion Internet, puis rechargez la page.");
return;
}

const universite = (catalogue.universites || []).find((u) => u && u.id === id);
const vue = ficheUniversite({ universite, programmes: catalogue.programmes, bourses: catalogue.bourses });

if (!vue) {
afficherErreur("Cet établissement n'est plus au catalogue", "Il a peut-être été retiré ou renommé. Le reste du catalogue vous attend.");
return;
}

poserSeo(vue);
poserHero(vue);
poserEnBref(vue);
poserCouts(vue);
poserCandidature(vue, "");
poserProgrammes(vue);
poserAppel(vue);

// Les icônes posées ici sont converties par js/icones.js (observateur).
$("ficheMain").hidden = false;

trackEvent("university_profile_viewed", { country: vue.pays, university: vue.titre });

// Le portail arrive après la première peinture : la fiche se lit sans
// attendre la fonction.
const portail = await poserPortails(vue);
if (portail) poserCandidature(vue, portail);

}

charger();
