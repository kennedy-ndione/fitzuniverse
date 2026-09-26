/**
* ============================================================
* Fitz — le bandeau « Ouvert en ce moment »
* ============================================================
*
* Alimente la section .opportunites d'index.html avec de vraies
* bourses du catalogue, triées pour mettre en avant ce qui concerne
* réellement un étudiant africain ou international.
*
* CE QU'IL NE FAIT JAMAIS
* -----------------------
* Afficher un contenu de repli inventé. Si Firestore ne répond pas,
* si le catalogue est vide, ou s'il n'en ressort aucune opportunité
* dont la date soit sûre, la section est RETIRÉE du DOM. C'est la
* convention déjà appliquée à #trustLogosRow par js/homepage-teaser.js,
* et elle vaut encore plus ici : un bandeau titré « ouvert en ce
* moment » qui montrerait des exemples fictifs mentirait dans son
* titre même.
*
* Une page sans bandeau reste une page correcte. Une page avec un
* faux bandeau ne l'est pas.
*
* CE QUI EST MONTRÉ (lot 114, 2026-09-26)
* ---------------------------------------
* Le choix des cartes vit dans js/bandeau-selection.js, un module pur
* testé hors navigateur (test/lot114.test.mjs) : programme ouvert, bourse
* ouverte, date vérifiée d'abord, au moins 30 jours devant soi, jamais
* une bourse réservée aux étudiants déjà inscrits sur place, les dates
* « par pays » dites en fourchette, et la une en tête. Ce fichier-ci ne
* fait plus que le rendu.
* ============================================================
*/

import { formaterDate } from "./echeance.js";

// Lot 114 : ce que le bandeau a le droit de montrer — voir l'en-tête.
import { selectionnerOpportunites, libelleCarte } from "./bandeau-selection.js";

import { resolveScholarshipImage, sourcesModernes } from "./scholarship-image.js";

// Chargeur de catalogue partagé et mémoïsé — voir js/catalog-data.js.
import { chargerCatalogue } from "./catalog-data.js";

// Les « révélations » (2026-09-24) : une voie que les agences ne disent
// pas, prouvée par le catalogue. Voir l'en-tête de js/revelations.js.
import { lireRevelation } from "./revelations.js";

/**
* Sous ce seuil, on ne défile pas : trois cartes qui tournent en
* boucle donnent l'impression d'un site vide plutôt que d'un site
* vivant. Elles s'affichent alors simplement côte à côte.
*/
const MIN_POUR_DEFILER = 5;

/** Marqueur affiché sur les bourses qui visent explicitement l'Afrique. */
const RE_AFRIQUE = /afric/i;

/* ------------------------------------------------------------------
* Lecture du catalogue
* ------------------------------------------------------------------ */

async function lireCatalogue() {

// Même chargeur que js/homepage-teaser.js : sur l'accueil, les deux
// modules démarrent dans le même tick et se partagent les trois
// mêmes promesses — un seul aller-retour par collection.
const catalogue = await chargerCatalogue();

const bourses = new Map(catalogue.bourses.map((b) => [b.id, b]));
const universites = new Map(catalogue.universites.map((u) => [u.id, u]));

return { programmes: catalogue.programmes, bourses, universites, listeUniversites: catalogue.universites };

}

/* ------------------------------------------------------------------
* Rendu
* ------------------------------------------------------------------ */

function texteNiveaux(niveaux) {

if (!niveaux.length) return "";

// « Licence / Master / Doctorat » tiendrait mal dans la pastille ;
// au-delà de deux niveaux, on dit « tous niveaux ».
if (niveaux.length > 2) return "Tous niveaux";

return niveaux.join(" / ");

}

function construireCarte(opp, aujourdhui) {

const l = libelleCarte(opp, aujourdhui);

const a = document.createElement("a");
a.className = "opportunite";
a.href = opp.lien || "scholarships.html";

const niveaux = texteNiveaux(opp.niveaux);
const viseAfrique = RE_AFRIQUE.test(opp.couverture);

// Un lecteur d'écran ne doit pas avoir à reconstituer la carte à
// partir de six fragments : on lui donne la phrase entière.
a.setAttribute(
"aria-label",
[opp.nom, opp.pays, niveaux, l.titre || l.texte].filter(Boolean).join(", ")
);

const drapeau = opp.drapeau
? `<img class="opportunite-flag" src="assets/flags/${opp.drapeau}" alt=""
        onerror="this.onerror=null;this.src='assets/flags/default.svg'">`
: "";

// Lot A « vitesse sur téléphone » (2026-09-24) : AVIF puis WebP quand
// la photo a ses jumeaux (voir sourcesModernes), le JPEG en dernier
// recours. PageSpeed : 855 Kio évitables sur 970 dans ce bandeau.
const tailles = "(max-width:640px) 268px, 306px";
const modernes = opp.imageSrcset ? sourcesModernes(opp.image) : null;
const sources = modernes
? `<source type="image/avif" srcset="${modernes.avif}" sizes="${tailles}">
<source type="image/webp" srcset="${modernes.webp}" sizes="${tailles}">`
: "";

a.innerHTML = `
<div class="opportunite-media">
<picture>
${sources}
<img src="${opp.image}"${opp.imageSrcset ? ` srcset="${opp.imageSrcset}" sizes="${tailles}"` : ""}
     alt="" loading="lazy">
</picture>
</div>
<div class="opportunite-body">
<div class="opportunite-haut">
${drapeau}
<span class="opportunite-pays">${opp.pays}</span>
${niveaux ? `<span class="opportunite-niveau">${niveaux}</span>` : ""}
</div>
<h3>${opp.nom}</h3>
${opp.couverture ? `<p class="opportunite-couv">${opp.couverture}</p>` : ""}
<div class="opportunite-bas">
<span class="opportunite-compte est-${l.ton}"${l.titre ? ` title="${l.titre}"` : ""}>
${l.chiffre ? `<b>${l.chiffre}</b>&nbsp;` : ""}${l.texte}
</span>
${viseAfrique ? `<span class="opportunite-marqueur">Ouverte aux étudiants africains</span>` : ""}
</div>
</div>`;

return a;

}

/**
* La date de vérification affichée en tête du bandeau.
*
* Elle ne doit JAMAIS être la date du jour : afficher « vérifié
* aujourd'hui » parce que la page est ouverte aujourd'hui serait une
* fausse garantie, et c'est précisément la garantie sur laquelle
* Fitz se distingue. Le premier jet de ce fichier faisait
* exactement cette erreur.
*
* On lit donc `verifieLe` sur les documents "programs" — un champ qui
* n'existe pas encore en base — et on retient LA PLUS ANCIENNE des
* cartes affichées : un bandeau n'est pas plus frais que sa fiche la
* plus vieille. Tant qu'aucune carte ne porte ce champ, la mention est
* retirée de la page plutôt qu'inventée.
*
* @returns {string|null} date ISO la plus ancienne, ou null
*/
function verificationLaPlusAncienne(opportunites) {

const dates = opportunites
.map((o) => o.verifieLe)
.filter((d) => typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d));

return dates.length ? dates.sort()[0] : null;

}

/**
* Le bloc « révélation », sous la frise. Construit élément par élément
* (textContent partout) : aucun texte n'est interprété comme du HTML.
*
* Il n'a PAS le décompte ni le titre de la frise, à dessein : ce n'est
* ni une bourse ni une candidature ouverte. Voir js/revelations.js.
*/
function construireRevelation(r) {

const el = (balise, classe, texte) => {
const n = document.createElement(balise);
if (classe) n.className = classe;
if (texte) n.textContent = texte;
return n;
};

const bloc = el("aside", "revelation");
bloc.setAttribute("aria-labelledby", "revelationTitre");

const chiffre = el("div", "revelation-chiffre");
chiffre.append(el("b", "", r.chiffre), el("span", "", r.chiffreLegende));

const corps = el("div", "revelation-corps");

const haut = el("div", "revelation-haut");
haut.append(el("span", "revelation-kicker", "Révélé par FitzUniverse"));
if (r.drapeau) {
const img = el("img", "revelation-flag");
img.src = `assets/flags/${r.drapeau}`;
img.alt = "";
img.addEventListener("error", () => { img.remove(); }, { once: true });
haut.append(img);
}
haut.append(el("span", "revelation-pays", r.pays));
if (r.verifieLe) haut.append(el("span", "revelation-verif", `Vérifié le ${formaterDate(r.verifieLe)}`));

const titre = el("h3", "", r.titre);
titre.id = "revelationTitre";

// Une seule ligne d'actions, en liens texte : le seul BOUTON du bloc
// reste « Voir les N échéances encore dans les temps ». Deux boutons pleins côte à
// côte se disputeraient le regard.
const actions = el("p", "revelation-actions");
const cta = el("a", "revelation-cta", r.lien.texte);
cta.href = r.lien.href;
const cat = el("a", "revelation-lien", r.lienCatalogue.texte);
cat.href = r.lienCatalogue.href;
const lienSource = el("a", "revelation-source", "Source");
lienSource.href = r.source.url;
lienSource.target = "_blank";
lienSource.rel = "noopener";
lienSource.title = r.verifieLe
? `${r.source.nom}, vérifié le ${formaterDate(r.verifieLe)}`
: r.source.nom;
actions.append(cta, cat, lienSource);

corps.append(haut, titre, el("p", "revelation-texte", r.texte), actions);
bloc.append(chiffre, corps);

return bloc;

}

/* ------------------------------------------------------------------
* Montage
* ------------------------------------------------------------------ */

function retirer(section) {
section?.remove();
}

async function monterBandeau() {

const section = document.getElementById("opportunites");

if (!section) return;

const piste = section.querySelector("#opportunitesTrack");

if (!piste) return retirer(section);

let catalogue;

try {
catalogue = await lireCatalogue();
} catch (error) {
console.error("[bandeau] catalogue indisponible :", error);
return retirer(section);
}

const aujourdhui = new Date();

const { ouvertes, retenues } = selectionnerOpportunites(
catalogue.programmes, catalogue.bourses, catalogue.universites, aujourdhui
);

// Rien de sûr à montrer : on ne montre rien. Voir l'en-tête.
if (!ouvertes.length) return retirer(section);

// La photo de chaque carte retenue, résolue ici : js/scholarship-image.js
// reste hors du module de sélection, qui ne connaît ni DOM ni images.
for (const opp of retenues) Object.assign(opp, resolveScholarshipImage(opp.imageEntree));

// Deux passes : la seconde permet la boucle sans saut, puisque
// l'animation s'arrête exactement à -50 % de la piste. Elle est
// aria-hidden pour ne pas dicter deux fois la même liste, et sortie
// du parcours clavier pour la même raison.
//
// Le mode « carrousel manuel sur tactile » (2 passes seulement hors
// tactile) a été retiré le 2026-09-01 sur retour utilisateur : le
// bandeau immobile se lisait comme une panne. Le défilement tourne
// désormais partout ; l'objection d'origine (une carte-lien qui fuit
// sous le pouce) est traitée par la pause AU TOUCHER ci-dessous.
const passes = retenues.length >= MIN_POUR_DEFILER ? 2 : 1;

for (let passe = 0; passe < passes; passe++) {
for (const opp of retenues) {
const carte = construireCarte(opp, aujourdhui);
if (passe === 1) {
carte.setAttribute("aria-hidden", "true");
carte.tabIndex = -1;
}
piste.appendChild(carte);
}
}

if (passes === 1) section.classList.add("est-figee");

// Pause au toucher — l'équivalent tactile de la pause au survol
// (css/opportunites.css, .est-touchee) : le doigt se pose, la piste
// s'arrête net, le tap atteint sa carte ; elle repart au relâchement.
// passive:true — on ne bloque jamais le défilement de la page.
if (passes === 2) {
const marquee = section.querySelector(".opportunites-marquee");
if (marquee) {
marquee.addEventListener("touchstart", () => section.classList.add("est-touchee"), { passive: true });
for (const fin of ["touchend", "touchcancel"]) {
marquee.addEventListener(fin, () => section.classList.remove("est-touchee"), { passive: true });
}
}
}

// Compte réel plutôt que nombre rond : « 12 » se vérifie, « des
// dizaines » ne se vérifie pas.
// Cible le <span> du libellé et non le lien entier (2026-09-01) : le
// bouton porte désormais une flèche <i data-lucide> à côté du texte,
// et écrire lien.textContent l'aurait effacée. Repli sur le lien
// entier si le span manquait (ancienne version du HTML en cache).
//
// Le mot compte : ce nombre-ci n'est PAS celui du catalogue. Ici on
// compte des ÉCHÉANCES encore dans les temps (couple bourse × pays, au
// moins 30 jours devant soi depuis le lot 114) ;
// le catalogue, lui, compte des bourses ouvertes, y compris celles
// dont la date dépend du pays ou n'est pas publiée — il y en a
// toujours davantage. Écrire « N opportunités ouvertes » sur un
// bouton qui mène à une page qui en montre trois fois plus a été
// jugé trompeur le 2026-09-05 : on annonce donc ce qu'on a compté.
const lien = section.querySelector("#opportunitesLienLabel") || section.querySelector("#opportunitesLien");
if (lien) lien.textContent = `Voir les ${ouvertes.length} échéances encore dans les temps`;

// Fraîcheur : affichée seulement si elle est vraie. Voir
// verificationLaPlusAncienne().
const mention = section.querySelector("#opportunitesFraicheur");
const verif = section.querySelector("#opportunitesVerif");
const plusAncienne = verificationLaPlusAncienne(retenues);

if (plusAncienne && verif) {
verif.textContent = formaterDate(plusAncienne);
} else {
mention?.remove();
}

// Le bouton n'a de sens que s'il y a un défilement à arrêter.
const bouton = section.querySelector("#opportunitesPause");

if (bouton && passes === 2) {

bouton.hidden = false;

bouton.addEventListener("click", () => {
const figee = section.classList.toggle("est-figee");
bouton.setAttribute("aria-pressed", String(figee));
bouton.textContent = figee ? "Reprendre le défilement" : "Arrêter le défilement";
});

}

// La révélation, sous la frise et avant le pied. Une erreur ici ne
// doit jamais emporter la frise : elle est isolée.
try {
const revelation = lireRevelation(catalogue.listeUniversites, aujourdhui);
const pied = section.querySelector(".opportunites-foot");
if (revelation && pied) pied.before(construireRevelation(revelation));
} catch (error) {
console.error("[bandeau] révélation ignorée :", error);
}

section.hidden = false;

}

monterBandeau();
