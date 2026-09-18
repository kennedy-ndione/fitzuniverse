import { db } from "./firebase-config.js";

import {
doc,
updateDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import { setButtonLoading } from "./auth-ui.js";
import { initShellChrome, bootstrapShell } from "./js/app-shell.js";
import { monterChampTelephone, synchroniserPays, champTelephone } from "./js/phone-field.js";
import { isoDepuisNom } from "./js/phone-international.js";
// Le référentiel de pays du site : il sert la liste de suggestions des
// champs « Nationalité » et « Pays de résidence » (lot R3).
import { COUNTRY_NAMES } from "./js/countries.js";
import { computeAge } from "./js/age-limits.js";
// Lot ACCEPTATION, partie 3 : « Fitz a besoin de ces informations pour
// choisir votre université » — la même règle que le remplissage
// (profilPretPourFitz), jamais une deuxième.
import { profilPretPourFitz } from "./js/fitz-choisit.js";
import { escapeHtml } from "./js/ai/format.js";
// Lot PROFIL-PAR-NIVEAU (2026-09-11) : le palier commande ce qui
// s'affiche et ce qui compte ; le score vient de la MÊME fonction que le
// tableau de bord, les outils Fitz et la fiche admin (bilanProfil) — plus
// de règles de complétion recopiées sur le DOM.
import { PALIERS, lirePalier, champsAcademiques, estSecondaire, studentStatusDuPalier, sectionsPour, domDeSection } from "./js/profil-par-niveau.js";
import { ETATS_TEST_LANGUE, ETATS_AVEC_TEST, TESTS_DE_LANGUE, EXEMPLES_SCORE, lireTestLangue, testConnu, situationFrancaisDepuisTest, etatDepuisSituationFrancais } from "./js/test-de-langue.js";
import { bilanProfil } from "./js/profile-score.js";
// Lot R3 (2026-09-17) : les pastilles d'exemples et le champ à
// suggestions, partagés avec la route (js/champs-guides.js). Le HTML ne
// porte que `data-exemples="domaine"` ; tout le reste est ici.
import { brancherChampsGuides } from "./js/champs-guides.js";
// Partie 4 : ne pas refaire répondre à ce que l'étudiant a déjà dit au
// diagnostic gratuit — pré-remplir les champs vides, jamais écraser.
import { appliquerDiagnostic, lireReponsesDiagnostic } from "./js/diagnostic-vers-profil.js";

// ?pour=fitz : arrivée depuis le paiement d'une formule bourses, profil
// pas encore prêt pour Fitz (lot ACCEPTATION). Conservé tel quel.
const POUR_FITZ = new URLSearchParams(window.location.search).get("pour") === "fitz";

// Chargeur de catalogue partagé et mémoïsé — voir js/catalog-data.js.
import { chargerUniversites } from "./js/catalog-data.js";
import { NIVEAUX_LANGUE, niveauDepuisCode, codeDepuisNiveau, MENTION_ECHELLE } from "./js/niveaux-langue.js";

// ==========================================================
// Listes fixes pour les chips / sélecteurs
// ==========================================================

// LOT R16 (2026-09-18) — DEUX LANGUES AFFICHÉES, LES AUTRES SUR DEMANDE.
// Cinq lignes de six boutons faisaient trente cases à lire avant la
// première réponse. Le français et l'anglais sont les deux langues
// d'enseignement des destinations que ce site accompagne : elles
// s'affichent toujours. Les trois autres s'ajoutent d'un clic, et toute
// langue déjà enregistrée s'affiche d'office, quelle qu'elle soit.
const LANGUES_TOUJOURS = [
{ code: "fr", label: "Français" },
{ code: "en", label: "Anglais" }
];

const LANGUES_PROPOSEES = [
{ code: "es", label: "Espagnol" },
{ code: "de", label: "Allemand" },
{ code: "ar", label: "Arabe" }
];

const FIXED_LANGUAGES = [...LANGUES_TOUJOURS, ...LANGUES_PROPOSEES];

// Filet de secours si la lecture Firestore ci-dessous échoue (hors ligne...)
// — jamais bloquer la page sur une erreur réseau. Liste codée en dur
// historique, remplacée en pratique par les pays réellement présents
// dans "universities" dès que possible (loadDestinationCountryOptions),
// même principe que loadDestinationCountries() dans
// eligibility-questions.js pour le diagnostic gratuit.
const FALLBACK_COUNTRY_OPTIONS = [
"Canada", "France", "Belgique", "Suisse", "Allemagne", "Italie",
"Espagne", "Portugal", "Royaume-Uni", "Irlande", "Pays-Bas", "Suède",
"Norvège", "États-Unis", "Chine", "Hongrie", "Turquie", "Maroc",
"Tunisie", "Sénégal", "Afrique du Sud", "Australie", "Japon", "Corée du Sud"
];

let DESTINATION_COUNTRIES = FALLBACK_COUNTRY_OPTIONS;

async function loadDestinationCountryOptions() {

try {

// Universités SEULES : router cette page vers le catalogue complet la
// ferait passer d'environ 111 à 591 lectures pour rien.
const universites = await chargerUniversites();

const countries = [...new Set(
universites.map((u) => u.country).filter(Boolean)
)].sort((a, b) => a.localeCompare(b, "fr"));

if (countries.length) DESTINATION_COUNTRIES = countries;

} catch (error) {

console.warn("Impossible de charger les pays du catalogue, utilisation de la liste de secours :", error);

}

}

// Un pays déjà enregistré sur ce profil (préféré ou refusé) reste proposé
// et coché même s'il n'apparaît plus dans DESTINATION_COUNTRIES — jamais
// perdre le choix de l'étudiant si le catalogue a changé depuis.
function renderCountryChipGroups(profile) {

const preferredOptions = [...new Set([...DESTINATION_COUNTRIES, ...(profile.preferredCountries || [])])];
const excludedOptions = [...new Set([...DESTINATION_COUNTRIES, ...(profile.excludedCountries || [])])];

renderChipGroup(document.getElementById("preferredCountriesChips"), preferredOptions, state.preferredCountries);
renderChipGroup(document.getElementById("excludedCountriesChips"), excludedOptions, state.excludedCountries);

}

// LOT R19 (2026-09-18) — CONTINENT_OPTIONS EST PARTI AVEC SON CHAMP.
// « Continents préférés » n'était lu par RIEN : ni le moteur de
// recommandation (js/recommend-programs.js lit preferredCountries et
// excludedCountries), ni la fiche du Control Center, ni les prompts de
// Fitz. Une question posée pour personne. Voir test/champs-lus.test.mjs.

// Mêmes échelles, mêmes identifiants que la question "average" de
// js/eligibility-pistes.js (diagnostic gratuit) et que
// normalizeAverageToPercent() dans eligibility-ai.js, qui bascule
// dessus par identifiant ("20"/"100"/"gpa4"/"letters"/"other"). C'est
// aussi ce qui permet à js/diagnostic-vers-profil.js de reprendre la
// moyenne AVEC son échelle sans conversion — garder ces listes
// synchronisées si un système de notation est ajouté ou modifié.
const AVERAGE_SCALES = [
{ id: "20", label: "/20", kind: "numeric", placeholder: "Ex. 14,5" },
{ id: "100", label: "/100", kind: "numeric", placeholder: "Ex. 78" },
{ id: "gpa4", label: "GPA /4", kind: "numeric", placeholder: "Ex. 3.5" },
{ id: "letters", label: "Lettres (A-F)", kind: "letters", options: ["A", "B", "C", "D", "F"] },
{ id: "other", label: "Autre système (%)", kind: "numeric", placeholder: "Ex. 82" }
];

const AVERAGE_DEFAULT_SCALE = "20";

// État en mémoire des échelles choisies pour academicAverage/bacAverage —
// même raisonnement que `state` ci-dessous pour les champs multi-valeurs.
const averageScaleState = {};

// ==========================================================
// Profil par défaut — schéma plat unifié (voir plan Phase 0)
// ==========================================================

function defaultProfile(user) {
return {

name: user.name || "",
email: user.email || "",

// 0. Le palier (lot PROFIL-PAR-NIVEAU) — un des 8 identifiants de
// PALIERS ; "" pour un profil d'avant, lu comme 10 sections.
palier: "",

// 1. Informations personnelles
firstName: "", lastName: "", gender: "", birthDate: "",
country: "", city: "", nationality: "", phone: "", whatsapp: "",

// 2. Parcours scolaire
lastDegree: "", currentInstitution: "", graduationYear: "", academicAverage: "",
academicAverageScale: "", studentStatus: "", bacSeries: "", bacMention: "",
bacAverage: "", bacAverageScale: "", currentLevel: "",

// 3. Niveau académique
ranking: "", strongSubjects: "", weakSubjects: "", projects: "",
thesis: "", publications: "", researchExperience: "",

// 4. Langues
languages: [],
// Le test de langue (partie 3) — un état à quatre champs.
testLangue: { nature: "", score: "", date: "", prevuLe: "" },

// 5. Projet d'études
desiredField: "", specialization: "", desiredDegree: "",

// 6. Préférences de destination
preferredCountries: [], excludedCountries: [],

// 7. Préférences financières
budget: "", hasSponsor: "", fundingWanted: [],

// 8. Documents disponibles
documentsAvailable: [],

// 9. Expériences
internships: "", workExperience: "", associations: "", volunteering: "",
entrepreneurship: "",

// 10. Objectifs
whyLeave: "", careerGoals: "", dreams: "",

// Les clés reprises du diagnostic, pas encore vérifiées par l'étudiant
// (mention « Repris de votre diagnostic — vérifiez »). Vidée à
// l'enregistrement.
reprisDuDiagnostic: [],

// Alias hérités — lus par dashboard.js et par les anciens outils IA
// jusqu'à leur migration. Recalculés à chaque sauvegarde (voir save()).
originCountry: "", currentDegree: "", englishLevel: "", desiredCountry: ""

};
}

// ==========================================================
// État en mémoire des champs multi-valeurs (pas de champs cachés
// DOM, pour éviter tout risque avec le textContent de setButtonLoading)
// ==========================================================

const state = {
languages: [],           // [{code, level, name?}]
preferredCountries: new Set(),
excludedCountries: new Set(),
// Le palier choisi (identifiant PALIERS) et, pour un profil d'avant ce
// lot, le studentStatus hérité qu'on ne perd pas tant qu'aucun palier
// n'est choisi.
palier: "",
studentStatusHerite: ""
};

// ==========================================================
// Chips génériques
// ==========================================================

function renderChipGroup(container, options, store) {

container.innerHTML = "";

options.forEach((option) => {

const chip = document.createElement("button");
chip.type = "button";
chip.className = "chip";
chip.textContent = option;
chip.setAttribute("aria-pressed", String(store.has(option)));

chip.addEventListener("click", () => {

if (store.has(option)) {
store.delete(option);
chip.setAttribute("aria-pressed", "false");
} else {
store.add(option);
chip.setAttribute("aria-pressed", "true");
}

updateCompletion();

});

container.appendChild(chip);

});

}

// ==========================================================
// LA MOYENNE ET SON SYSTÈME DE NOTATION — lot R18 (2026-09-18)
// ==========================================================
//
// CE QUI CHANGE, ET POURQUOI. Le système de notation se choisissait
// dans cinq PASTILLES posées AU-DESSUS du champ. Dans une colonne de
// grille — « Mon profil » en pose trois de front sur un écran large —
// elles tombaient sur trois rangées, et la valeur atterrissait juste
// sous la dernière. Charles, le 2026-09-18, a lu sa moyenne « 12,20 »
// comme une note « Autre système (%) », alors qu'elle était bien sur 20.
// Rien, en plus, ne disait que ces pastilles étaient une QUESTION : il
// n'y avait aucun libellé au-dessus d'elles.
//
// Le système devient donc un sélecteur, DANS la rangée de la valeur :
// [ /20 ] [ 12,20 ]. Même forme que le téléphone du lot B5. Il ne
// retourne jamais à la ligne, il porte son propre nom accessible, et la
// valeur ne peut plus paraître appartenir à autre chose.
//
// La sous-mécanique des lettres — une seconde rangée de pastilles A à F,
// affichée ou masquée — DISPARAÎT : sur un système de lettres, le champ
// prend « Ex. B » pour exemple et l'aide nomme les lettres admises. Une
// pièce en moins, et le même résultat en base.
//
// LA BASE NE CHANGE PAS : `academicAverage`/`bacAverage` gardent la
// valeur brute et `…Scale` l'identifiant du système. AVERAGE_SCALES
// reste la table partagée avec js/diagnostic-vers-profil.js, qui
// reprend la moyenne du diagnostic AVEC son système, sans conversion.
// ==========================================================

function currentAverageScale(fieldId) {
const scaleId = averageScaleState[fieldId] || AVERAGE_DEFAULT_SCALE;
return AVERAGE_SCALES.find((s) => s.id === scaleId) || AVERAGE_SCALES[0];
}

function renderAverageScaleOptions(fieldId) {

const select = document.getElementById(`${fieldId}Scale`);
if (!select) return;

if (!select.options.length) {
AVERAGE_SCALES.forEach((scale) => {
const option = document.createElement("option");
option.value = scale.id;
option.textContent = scale.label;
select.appendChild(option);
});
}

select.value = currentAverageScale(fieldId).id;

if (select.dataset.branche === "1") return;
select.dataset.branche = "1";

select.addEventListener("change", () => {

if (select.value === averageScaleState[fieldId]) return;

// Une valeur saisie dans un système ne veut rien dire dans un autre
// (même règle que renderScaleSelector() dans eligibility-questions.js) :
// on efface la valeur brute, pas le système affiché après coup.
document.getElementById(fieldId).value = "";

averageScaleState[fieldId] = select.value;

renderAverageValueInput(fieldId);
updateCompletion();

});

}

// L'exemple et l'aide suivent le système choisi. « Ex. 14,5 » devant un
// système de lettres n'aide personne — même règle que l'exemple de
// score du test de langue au lot R17.
function renderAverageValueInput(fieldId) {

const scale = currentAverageScale(fieldId);
const input = document.getElementById(fieldId);
if (!input) return;

input.placeholder = scale.kind === "letters" ? "Ex. B" : scale.placeholder;

const aide = document.getElementById(`${fieldId}Aide`);
if (aide) {
aide.textContent = scale.kind === "letters"
? `Une lettre : ${scale.options.join(", ")}.`
: "Recopiez la moyenne inscrite sur votre relevé.";
}

}

// Un academicAverage/bacAverage déjà rempli sur un profil existant, sans
// système associé (comptes créés avant le lot qui l'a introduit), est
// traité comme "/20" — comportement inchangé, aucune donnée perdue.
function initAverageScaleField(fieldId, existingValue, existingScaleId) {

averageScaleState[fieldId] = existingScaleId || AVERAGE_DEFAULT_SCALE;
document.getElementById(fieldId).value = existingValue || "";

renderAverageScaleOptions(fieldId);
renderAverageValueInput(fieldId);

}

// ==========================================================
// LANGUES — lot R16 (2026-09-18) : quatre phrases, plus six codes
// ==========================================================
//
// Ce bloc N'INVENTE AUCUN VOCABULAIRE. Les quatre phrases, leur
// traduction en code CECRL, la règle qui interdit de dégrader un niveau
// déjà enregistré et la valeur « aucun » vivent dans
// js/niveaux-langue.js, avec les quatre lecteurs de `languages`. Ici,
// il n'y a que de l'affichage.
//
// CLIQUER « + Espagnol » OUVRE LA QUESTION, IL N'Y RÉPOND PAS. Une
// langue ajoutée n'entre dans `state.languages` qu'au moment où
// l'étudiant coche une phrase : sans cette distinction, ouvrir la ligne
// aurait déclaré l'espagnol parlé, et la section « Langues » se serait
// comptée remplie toute seule.

const languesOuvertes = [];

function findLanguage(code, name) {
return state.languages.find((entry) =>
code === "autre" ? entry.code === "autre" && entry.name === name : entry.code === code
);
}

function nomDeLangue(entry) {
if (entry.code === "autre") return String(entry.name || "").trim();
const connue = FIXED_LANGUAGES.find((f) => f.code === entry.code);
return connue ? connue.label : String(entry.code || "").trim();
}

const cleDeLangue = (code, nom) => (code === "autre" ? `autre:${String(nom || "").trim().toLowerCase()}` : code);

/**
* Les lignes à afficher, dans l'ordre : les deux toujours là, puis
* celles que la base contient, puis celles que l'étudiant vient
* d'ouvrir. Jamais deux fois la même.
*/
function langueRows() {

const rows = [];
const vues = new Set();

LANGUES_TOUJOURS.forEach(({ code, label }) => {
vues.add(code);
rows.push({ code, label, retirable: false, entry: findLanguage(code) || null });
});

state.languages.forEach((entry) => {
const nom = nomDeLangue(entry);
const cle = cleDeLangue(entry.code, nom);
if (!nom || vues.has(cle)) return;
vues.add(cle);
rows.push({ code: entry.code, label: nom, retirable: true, entry });
});

languesOuvertes.forEach(({ code, label }) => {
const cle = cleDeLangue(code, label);
if (vues.has(cle)) return;
vues.add(cle);
rows.push({ code, label, retirable: true, entry: null });
});

return rows;

}

/**
* L'étudiant coche une phrase. Le code écrit est celui de
* js/niveaux-langue.js — et si la base contenait déjà un code du même
* groupe (un C1 pour « je suis à l'aise »), c'est LUI qui reste.
*/
function poserNiveau(row, cle) {

const existante = row.entry;
const code = codeDepuisNiveau(cle, existante ? existante.level : "");

if (existante) {
existante.level = code;
return;
}

const neuve = row.code === "autre"
? { code: "autre", name: row.label, level: code }
: { code: row.code, level: code };

state.languages.push(neuve);
row.entry = neuve;

}

function retirerLangue(row) {

if (row.entry) state.languages = state.languages.filter((item) => item !== row.entry);

const cle = cleDeLangue(row.code, row.label);
for (let i = languesOuvertes.length - 1; i >= 0; i -= 1) {
if (cleDeLangue(languesOuvertes[i].code, languesOuvertes[i].label) === cle) languesOuvertes.splice(i, 1);
}

renderLangues();
renderAjoutsDeLangue();
updateCompletion();

}

function renderLangues() {

const list = document.getElementById("languagesList");
if (!list) return;

list.innerHTML = "";

langueRows().forEach((row, index) => {

const niveauActuel = row.entry ? niveauDepuisCode(row.entry.level) : null;

const bloc = document.createElement("div");
bloc.className = "langue-bloc";

// Une langue reprise du diagnostic SANS niveau (js/diagnostic-vers-
// profil.js ne devine pas le CECRL) : la ligne le dit.
if (row.entry && !row.entry.level) bloc.classList.add("langue-bloc--sans-niveau");

const tete = document.createElement("div");
tete.className = "langue-bloc-tete";

const nom = document.createElement("span");
nom.className = "langue-bloc-nom";
nom.textContent = row.label;
tete.appendChild(nom);

if (row.retirable) {
const retirer = document.createElement("button");
retirer.type = "button";
retirer.className = "langue-retirer";
retirer.textContent = "Retirer";
retirer.setAttribute("aria-label", `Retirer ${row.label}`);
retirer.addEventListener("click", () => retirerLangue(row));
tete.appendChild(retirer);
}

bloc.appendChild(tete);

// Le composant .fitz-choice du site (css/base.css) : le bouton radio
// natif reste dans le DOM pour le clavier et le lecteur d'écran,
// masqué à l'œil. Les flèches du clavier parcourent le groupe sans
// une ligne de JavaScript.
const choix = document.createElement("div");
choix.className = "choix-cartes";
choix.setAttribute("role", "radiogroup");
choix.setAttribute("aria-label", `Votre niveau en ${row.label.toLowerCase()}`);

NIVEAUX_LANGUE.forEach((niveau) => {

// .fitz-choice (css/base.css) : le rond, l'état coché, l'ambre de la
// marque et l'anneau de focus viennent de LÀ, pas d'ici. profile.css
// ne pose que la mise en page de la carte (.fitz-choice--carte).
const carte = document.createElement("label");
carte.className = "fitz-choice fitz-choice--carte";

const radio = document.createElement("input");
radio.type = "radio";
radio.name = `niveau-langue-${index}`;
radio.value = niveau.cle;
radio.checked = niveauActuel === niveau.cle;

radio.addEventListener("change", () => {
poserNiveau(row, niveau.cle);
bloc.classList.remove("langue-bloc--sans-niveau");
updateCompletion();
});

const rond = document.createElement("span");
rond.className = "fitz-choice-dot";
rond.setAttribute("aria-hidden", "true");

const texte = document.createElement("span");
texte.className = "carte-choix-texte";

const titre = document.createElement("span");
titre.className = "carte-choix-titre";
titre.textContent = niveau.titre;

const exemple = document.createElement("span");
exemple.className = "carte-choix-ex";
exemple.textContent = niveau.exemple;

texte.append(titre, exemple);
carte.append(radio, rond, texte);
choix.appendChild(carte);

});

bloc.appendChild(choix);
list.appendChild(bloc);

});

const echelle = document.getElementById("langueEchelle");
if (echelle) echelle.textContent = MENTION_ECHELLE;

}

function renderAjoutsDeLangue() {

const zone = document.getElementById("languageAdders");
if (!zone) return;

zone.innerHTML = "";

const affichees = new Set(langueRows().map((row) => cleDeLangue(row.code, row.label)));

LANGUES_PROPOSEES.forEach(({ code, label }) => {

if (affichees.has(code)) return;

const chip = document.createElement("button");
chip.type = "button";
chip.className = "chip";
chip.textContent = `+ ${label}`;

chip.addEventListener("click", () => {
languesOuvertes.push({ code, label });
renderLangues();
renderAjoutsDeLangue();
});

zone.appendChild(chip);

});

const autre = document.createElement("button");
autre.type = "button";
autre.className = "chip";
autre.textContent = "+ Une autre langue";

autre.addEventListener("click", () => {
const ligne = document.getElementById("otherLanguageRow");
if (!ligne) return;
ligne.hidden = false;
const champ = document.getElementById("otherLanguageName");
if (champ) champ.focus();
});

zone.appendChild(autre);

}

/**
* « Une autre langue » : on ouvre la ligne, on ne l'enregistre pas. Le
* message d'erreur s'affiche SOUS le champ — l'ancienne version ouvrait
* une fenêtre alert() du navigateur, qui bloque la page et n'indique
* même pas quel champ est en cause.
*/
function initAjoutDeLangue() {

renderAjoutsDeLangue();

const champ = document.getElementById("otherLanguageName");
const bouton = document.getElementById("addOtherLanguage");
const erreur = document.getElementById("otherLanguageError");

if (!champ || !bouton) return;

const direErreur = (message) => {
if (!erreur) return;
erreur.textContent = message;
erreur.hidden = !message;
};

const ajouter = () => {

const nom = champ.value.trim();

if (!nom) {
direErreur("Écrivez le nom de la langue, puis touchez « Ajouter ».");
champ.focus();
return;
}

const deja = new Set(langueRows().map((row) => cleDeLangue(row.code, row.label)));
const connue = FIXED_LANGUAGES.find((f) => f.label.toLowerCase() === nom.toLowerCase());
const code = connue ? connue.code : "autre";

if (deja.has(cleDeLangue(code, nom))) {
direErreur(`${connue ? connue.label : nom} est déjà dans votre liste.`);
return;
}

languesOuvertes.push({ code, label: connue ? connue.label : nom });

champ.value = "";
direErreur("");

const ligne = document.getElementById("otherLanguageRow");
if (ligne) ligne.hidden = true;

renderLangues();
renderAjoutsDeLangue();

};

bouton.addEventListener("click", ajouter);

champ.addEventListener("keydown", (event) => {
if (event.key !== "Enter") return;
event.preventDefault();
ajouter();
});

champ.addEventListener("input", () => direErreur(""));

}

// ==========================================================
// Cases à cocher stylées en carte (documents disponibles)
// ==========================================================

function initCheckCards(containerId, cardSelector) {

const container = document.getElementById(containerId);
if (!container) return;

container.querySelectorAll(cardSelector).forEach((card) => {

const input = card.querySelector("input");

const sync = () => card.classList.toggle("is-checked", input.checked);

input.addEventListener("change", () => {
sync();
updateCompletion();
});

sync();

});

}

// ==========================================================
// LE PALIER — le premier écran (lot PROFIL-PAR-NIVEAU)
// ==========================================================
//
// Les 8 paliers du questionnaire public (PALIERS, js/profil-par-niveau.js)
// rendus en cartes radio. Le choix commande :
//   - le bloc « Bac » ou le bloc « niveau actuel » de la section 2 ;
//   - la section 3 (masquée au secondaire) et ses champs ;
//   - la section 9 (facultative ou non, stages/travail au secondaire) ;
//   - les sections comptées dans le score (bilanProfil).
// Aucune valeur n'est effacée quand le palier change : un champ masqué
// garde ce qu'il contient, l'étudiant peut revenir.

function renderPalierGrid() {

const grid = document.getElementById("palierGrid");
if (!grid) return;

grid.innerHTML = "";

PALIERS.forEach((p) => {

const option = document.createElement("label");
option.className = "palier-option";
option.dataset.value = p.id;
// Lot FINITIONS-VISUELLES : le rond du système ne se voit plus — l'input
// reste pour le clavier et le lecteur d'écran (profile.css le masque
// visuellement). Une seule icône AVANT le texte, une coche à droite
// quand la carte est choisie.
option.innerHTML = `<input type="radio" name="palier" value="${escapeHtml(p.id)}"><i data-lucide="${escapeHtml(p.icon)}"></i><span class="palier-option-text"></span><span class="palier-option-check" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" focusable="false"><path d="M20 6 9 17l-5-5"/></svg></span>`;
option.querySelector("input").addEventListener("focus", () => option.classList.add("has-focus"));
option.querySelector("input").addEventListener("blur", () => option.classList.remove("has-focus"));
option.querySelector("span").textContent = p.label;

option.querySelector("input").addEventListener("change", () => {
applyPalier(p.id);
updateCompletion();
});

grid.appendChild(option);

});

}

function applyPalier(palier) {

state.palier = palier;

document.querySelectorAll(".palier-option").forEach((opt) => {
opt.classList.toggle("is-selected", opt.dataset.value === palier);
});

const secondaire = estSecondaire(palier);
const sansPalier = !palier;

// Section 2 : Bac ou niveau actuel.
document.getElementById("bacFieldsBlock").hidden = !secondaire && !(sansPalier && state.studentStatusHerite === "nouveau_bachelier");
document.getElementById("currentLevelBlock").hidden = secondaire || (sansPalier && state.studentStatusHerite !== "en_cours");
// « Dernier diplôme obtenu » et « Moyenne générale » ne se demandent
// pas à un lycéen ni à un bachelier : le bloc Bac porte leur moyenne.
document.querySelectorAll('#sec-parcours [data-palier-champ]').forEach((el) => { el.hidden = secondaire; });

// Lot R19 : « Spécialisation » disparaît du PREMIER écran pour un
// lycéen et un nouveau bachelier. Personne ne la lit hors de la fiche
// du Control Center, son aide dit déjà « le domaine suffit à Fitz », et
// à dix-sept ans on n'a pas de spécialité — trois raisons de ne pas la
// poser là où l'on commence.
document.querySelectorAll('#sec-depart [data-palier-champ]').forEach((el) => { el.hidden = secondaire; });

// Section 3 : masquée au secondaire, champs par palier.
const academiques = new Set(champsAcademiques(palier));
const sections = new Map(sectionsPour(palier).map((s) => [s.id, s.applicabilite]));
const secAcademique = document.getElementById("sec-academique");
secAcademique.hidden = sections.get("sec-academique") === "masquee";
secAcademique.querySelectorAll("[data-palier-champ]").forEach((el) => {
el.hidden = !academiques.has(el.dataset.palierChamp);
});

// Section 9 : stages et travail ne se demandent pas au secondaire.
document.querySelectorAll('#sec-experiences [data-palier-champ]').forEach((el) => { el.hidden = secondaire; });

// CHAQUE SECTION FACULTATIVE LE DIT ELLE-MÊME (2026-09-14).
//
// Seule « Expériences » portait sa pastille et sa phrase, écrites en
// dur ici. Depuis que QUATRE sections sont facultatives — celles dont
// aucun champ ne décide des opportunités proposées (voir la note du
// noyau dans js/profil-par-niveau.js) — les trois autres seraient
// restées muettes : l'étudiant aurait continué à les croire
// obligatoires, et c'est précisément ce qu'on répare.
//
// La pastille est injectée à côté du titre, la phrase complète le
// libellé d'aide existant. Aucun texte n'est perdu : on AJOUTE une
// phrase, on ne remplace pas celle qui explique à quoi la section sert.
const PROMESSE_FACULTATIVE = "Cette section n'entre pas dans votre score — remplissez-la quand vous voudrez : elle sert à Fitz pour vos lettres et la vérification de vos dossiers.";

// L'APPLICABILITÉ PAR ÉLÉMENT DE PAGE, ET NON PAR RÈGLE DE SCORE.
//
// `sections` est indexée sur les dix règles de profile-score.js.
// profile.html n'a que neuf `<section>` : « Langues » et « Projet
// d'études » vivent toutes deux dans « Pour commencer »
// (#sec-depart), et `document.getElementById("sec-langues")` rendait
// donc `null` — la boucle passait son chemin sans que rien ne le
// signale, et #sec-depart n'était atteint par aucune règle.
//
// Quand deux règles partagent une section, la plus exigeante gagne :
// une section qui porte un champ requis est requise. C'est le seul
// sens sûr — l'inverse masquerait une section à cause d'une règle
// qui ne la concerne qu'en partie.
const EXIGENCE = { masquee: 0, facultative: 1, requise: 2 };
const parElement = new Map();

for (const [id, applicable] of sections) {
const cible = domDeSection(id);
const deja = parElement.get(cible);
if (deja === undefined || EXIGENCE[applicable] > EXIGENCE[deja]) parElement.set(cible, applicable);
}

for (const [id, applicable] of parElement) {

const section = document.getElementById(id);
if (!section) continue;

const facultative = applicable === "facultative";
const titre = section.querySelector(".profile-section-heading h2");
const aide = section.querySelector(".profile-section-heading .field-hint");

// LA PASTILLE DIT « FACULTATIF », ET RIEN D'AUTRE.
//
// Elle disait « si vous en avez » : écrit pour « Expériences », où
// c'est juste. Sur les trois autres, ça ne veut rien dire —
// « Niveau académique si vous en avez », « Objectifs si vous en
// avez ». Un seul mot tient pour les quatre, et c'est celui que
// l'étudiant cherche.
//
// Le HTML n'en porte plus aucune : elles sont toutes créées ici, une
// fois, au même endroit que la phrase qui les explique.
if (titre) {
let pastille = titre.querySelector(".section-facultative");
if (!pastille && facultative) {
pastille = document.createElement("span");
pastille.className = "section-facultative";
pastille.textContent = "facultatif";
titre.appendChild(document.createTextNode(" "));
titre.appendChild(pastille);
}
if (pastille) pastille.hidden = !facultative;
}

if (aide) {
// Le libellé d'origine est mémorisé au premier passage : sans ça, un
// second appel (changement de palier) concaténerait deux fois.
if (aide.dataset.aideOrigine === undefined) aide.dataset.aideOrigine = aide.textContent.trim();
const origine = aide.dataset.aideOrigine;
aide.textContent = facultative ? `${origine} ${PROMESSE_FACULTATIVE}` : origine;
}

}

// La navigation reflète ce qui est masqué — sur la même table que
// les sections elles-mêmes, sinon l'entrée « Pour commencer »
// n'était décidée par rien du tout (`sections.get` rendait
// `undefined` pour elle, et c'est seulement par chance que cela
// revenait à « visible et non facultative »).
document.querySelectorAll(".section-nav-item").forEach((item) => {
const applicable = parElement.get(item.dataset.section);
item.hidden = applicable === "masquee";
item.classList.toggle("is-facultative", applicable === "facultative");
});

}

// ==========================================================
// LE TEST DE LANGUE (partie 3)
// ==========================================================

// ==========================================================
// LE TEST DE LANGUE — lot R17 (2026-09-18) : l'état d'abord
// ==========================================================
//
// Le vocabulaire, les quatre états, la langue de chaque test et la
// traduction vers `situationFrancais` sont dans js/test-de-langue.js.
// Ici, il n'y a que de l'affichage — et la même règle qu'au lot R16 :
// le détail n'apparaît que lorsqu'il a un sens.

function renderTestLangueEtats(etatChoisi) {

const groupe = document.getElementById("testLangueEtatGroup");
if (!groupe) return;

groupe.innerHTML = "";

ETATS_TEST_LANGUE.forEach((etat) => {

const carte = document.createElement("label");
carte.className = "fitz-choice fitz-choice--carte";

const radio = document.createElement("input");
radio.type = "radio";
radio.name = "testLangueEtat";
radio.value = etat.cle;
radio.checked = etatChoisi === etat.cle;
radio.addEventListener("change", applyTestLangueEtat);

const rond = document.createElement("span");
rond.className = "fitz-choice-dot";
rond.setAttribute("aria-hidden", "true");

const texte = document.createElement("span");
texte.className = "carte-choix-texte";

const titre = document.createElement("span");
titre.className = "carte-choix-titre";
titre.textContent = etat.titre;

const exemple = document.createElement("span");
exemple.className = "carte-choix-ex";
exemple.textContent = etat.exemple;

texte.append(titre, exemple);
carte.append(radio, rond, texte);
groupe.appendChild(carte);

});

}

function renderTestLangueOptions() {

const select = document.getElementById("testLangueNature");
if (!select) return;

TESTS_DE_LANGUE.forEach((t) => {
const option = document.createElement("option");
option.value = t.id;
option.textContent = t.aide ? `${t.label} — ${t.aide}` : t.label;
select.appendChild(option);
});

}

function applyTestLangueEtat() {

const etat = radioValue("testLangueEtat");
const details = document.getElementById("testLangueDetails");
const avecTest = ETATS_AVEC_TEST.includes(etat);

details.hidden = !avecTest;
document.getElementById("testLanguePasse").hidden = !avecTest || etat !== "passe";
document.getElementById("testLanguePrevu").hidden = !avecTest || etat !== "prevu";

// L'exemple de score suit la langue du test choisi : « Ex. B2, TCF 450 »
// n'aide personne devant un IELTS.
const test = testConnu(val("testLangueNature"));
const champ = document.getElementById("testLangueScore");
if (champ && test && EXEMPLES_SCORE[test.langue]) champ.placeholder = EXEMPLES_SCORE[test.langue];

}

function initTestLangue(profile) {

renderTestLangueOptions();

const t = lireTestLangue(profile);

// CE QUE LA ROUTE SAIT DÉJÀ N'EST PAS REDEMANDÉ. L'étape 1 de la route
// pose la même question sous le nom `situationFrancais` ; si le profil
// n'a pas encore de test enregistré, on propose la réponse qui y a été
// donnée. Répondre à un endroit répond à l'autre.
const etat = t.etat || etatDepuisSituationFrancais(profile && profile.situationFrancais);

renderTestLangueEtats(etat);

document.getElementById("testLangueNature").value = t.nature;
document.getElementById("testLangueScore").value = t.score;
document.getElementById("testLangueDate").value = t.date;
document.getElementById("testLanguePrevuLe").value = t.prevuLe;

document.getElementById("testLangueNature").addEventListener("change", applyTestLangueEtat);

applyTestLangueEtat();

}

function lireTestLangueDuFormulaire() {

const etat = radioValue("testLangueEtat");
const vide = { etat: "", nature: "", score: "", date: "", prevuLe: "" };

if (!ETATS_TEST_LANGUE.some((e) => e.cle === etat)) return vide;
if (!ETATS_AVEC_TEST.includes(etat)) return { ...vide, etat };

const nature = val("testLangueNature");
if (etat === "passe") return { etat, nature, score: val("testLangueScore"), date: val("testLangueDate"), prevuLe: "" };
return { etat, nature, score: "", date: "", prevuLe: val("testLanguePrevuLe") };

}

// ==========================================================
// Âge dérivé de la date de naissance — computeAge vit désormais dans
// js/age-limits.js (elle renvoie number|null), partagée avec le moteur
// de recommandation qui compare cet âge aux limites `ageMax` des
// bourses. Ici on ne garde que la mise en chaîne pour #ageDisplay.
// ==========================================================

function ageAffichable(birthDateStr) {
const age = computeAge(birthDateStr);
return age === null ? "" : String(age);
}

function initAgeCalculation() {

const birthDateInput = document.getElementById("birthDate");
const ageDisplay = document.getElementById("ageDisplay");

birthDateInput.addEventListener("change", () => {
ageDisplay.value = ageAffichable(birthDateInput.value);
});

}

// ==========================================================
// Nav des sections — surlignage au scroll + coches de complétion
// ==========================================================

function val(id) {
const el = document.getElementById(id);
return el ? String(el.value || "").trim() : "";
}

function radioValue(name) {
const checked = document.querySelector(`input[name="${name}"]:checked`);
return checked ? checked.value : "";
}

function checkedValues(containerId) {
const container = document.getElementById(containerId);
if (!container) return [];
return [...container.querySelectorAll('input[type="checkbox"]:checked')].map((i) => i.value);
}

// Le nom du compte, pour buildUpdatedProfile — posé par bootstrapShell.
let NOM_DU_COMPTE = "";

// Le libellé de l'objet que Fitz choisit (« vos 4 universités »), selon
// la formule — posé par bootstrapShell ; « vos universités » sinon.
let OBJET_FITZ = "vos universités";

/**
* Les coches de la nav, le compteur et la ligne d'état — TOUS calculés
* sur l'objet qui serait enregistré, par la même fonction que le tableau
* de bord et la fiche admin (bilanProfil). La section « Pour commencer »
* est cochée quand Fitz a ce qu'il lui faut (profilPretPourFitz).
*/
function updateCompletion() {

const profil = buildUpdatedProfile(NOM_DU_COMPTE);
const bilan = bilanProfil(profil);
const fitz = profilPretPourFitz(profil);

const etatParSection = new Map(bilan.sections.map((s) => [s.id, s]));

document.querySelectorAll(".section-nav-item").forEach((item) => {
const id = item.dataset.section;
const complete = id === "sec-depart"
? fitz.pret && !!profil.palier
: !!(etatParSection.get(id) && etatParSection.get(id).remplie);
item.classList.toggle("is-complete", complete);
});

const scoreValue = document.getElementById("navScoreValue");
if (scoreValue) scoreValue.textContent = `${bilan.remplies}/${bilan.applicables}`;

const etat = document.getElementById("profileEtat");
if (etat) {
const manquants = fitz.manquants.length + (profil.palier ? 0 : 1);
if (manquants > 0) {
etat.textContent = manquants === 1
? `Plus qu'une information pour que Fitz choisisse ${OBJET_FITZ}.`
: `Plus que ${manquants} informations pour que Fitz choisisse ${OBJET_FITZ}.`;
etat.dataset.etat = "fitz";
} else if (bilan.remplies < bilan.applicables) {
const reste = bilan.applicables - bilan.remplies;
etat.textContent = `Fitz peut choisir. Encore ${reste === 1 ? "une section" : `${reste} sections`} pour un profil complet.`;
etat.dataset.etat = "sections";
} else {
etat.textContent = "Profil complet.";
etat.dataset.etat = "complet";
}
}

}

function initSectionNavScrollSpy() {

const navItems = [...document.querySelectorAll(".section-nav-item")];
const sections = navItems
.map((item) => document.getElementById(item.dataset.section))
.filter(Boolean);

if (!("IntersectionObserver" in window) || !sections.length) return;

const observer = new IntersectionObserver((entries) => {

entries.forEach((entry) => {

if (entry.isIntersecting) {

const activeItem = navItems.find((item) => item.dataset.section === entry.target.id);

navItems.forEach((item) => item.classList.remove("is-active"));
if (activeItem) activeItem.classList.add("is-active");

}

});

}, { rootMargin: "-20% 0px -70% 0px" });

sections.forEach((section) => observer.observe(section));

}

// ==========================================================
// « Repris de votre diagnostic — vérifiez » (partie 4)
// ==========================================================
//
// Les clés reprises (profile.reprisDuDiagnostic, écrit à la création du
// compte ou calculé à l'ouverture) allument la mention sous le champ.
// Les clés techniques (échelle de moyenne) suivent leur champ. La
// liste est vidée à l'enregistrement : l'étudiant a vérifié.

function afficherMentionsReprises(cles) {

const set = new Set((cles || []).map((c) => (c.endsWith("Scale") ? c.slice(0, -"Scale".length) : c)));

document.querySelectorAll("[data-repris]").forEach((el) => {
el.hidden = !set.has(el.dataset.repris);
});

}

// ==========================================================
// Hydratation du formulaire depuis Firestore
// ==========================================================

/**
* LOT R19 (2026-09-18) — LA CASE RECOPIE, PLUS L'ÉTUDIANT.
*
* L'aide sous le champ WhatsApp disait : « Le même numéro que ci-dessus ?
* Recopiez-le. » Le site demandait à la main ce qu'il pouvait faire
* lui-même, et pour la plupart des étudiants c'est le même numéro —
* deux saisies internationales, indicatif compris, pour une seule
* information.
*
* La case cochée MASQUE le champ et le tient à jour : changer d'indicatif
* ou de numéro dans « Téléphone » met WhatsApp au même. Elle se coche
* d'elle-même à l'ouverture quand les deux numéros enregistrés sont
* identiques — sinon un étudiant qui les avait recopiés à la main
* verrait la case décochée devant deux champs égaux.
*
* Ce qui part en base ne change pas : `whatsapp` garde sa valeur E.164,
* lue sur le champ d'origine comme avant.
*/
function brancherWhatsAppMeme(profile) {

const case_ = document.getElementById("whatsappMeme");
const bloc = document.getElementById("whatsappChamp");
const tel = champTelephone("phone");
const wa = champTelephone("whatsapp");

if (!case_ || !bloc || !tel || !wa) return;

const recopier = () => { if (case_.checked) wa.definir(tel.valeur, tel.iso); };

const appliquer = () => {
bloc.hidden = case_.checked;
recopier();
updateCompletion();
};

case_.addEventListener("change", appliquer);
tel.elements.national.addEventListener("input", recopier);
tel.elements.select.addEventListener("change", recopier);

// À l'ouverture : deux numéros identiques et non vides veulent dire
// que l'étudiant avait déjà recopié.
const memeNumero = !!(profile && profile.phone && profile.phone === profile.whatsapp);
case_.checked = memeNumero;
bloc.hidden = memeNumero;

}

function hydrateForm(profile, currentUser) {

document.getElementById("firstName").value = profile.firstName || "";
document.getElementById("lastName").value = profile.lastName || "";
document.getElementById("gender").value = profile.gender || "";
document.getElementById("birthDate").value = profile.birthDate || "";
document.getElementById("ageDisplay").value = ageAffichable(profile.birthDate);
document.getElementById("nationality").value = profile.nationality || "";
document.getElementById("country").value = profile.country || profile.originCountry || "";
document.getElementById("city").value = profile.city || "";
// Téléphone et WhatsApp passent par le champ international
// (js/phone-field.js) : l'input d'origine reste la source de vérité
// mais porte désormais du E.164, et c'est lui que val("phone") lit
// plus bas — buildUpdatedProfile n'a donc rien eu à changer.
//
// LE COMMENTAIRE DISAIT VRAI, LE CODE NON (corrigé le 2026-09-14).
// `isoSuggere` valait `null` : le pays de résidence n'était pas passé
// du tout, et un numéro enregistré sans indicatif retombait donc sur
// le pays par défaut du sélecteur — le Sénégal. Un étudiant en France
// dont le profil portait « 0612345678 » se voyait attribuer +221 ; le
// numéro faisait neuf chiffres, le Sénégal en attend neuf, la
// validation le laissait passer, et Fitz enregistrait
// « +221612345678 » : un numéro parfaitement valide qui n'est pas le
// sien, et qu'aucun message n'aurait signalé.
//
// `synchroniserPays` ne pouvait pas réparer ça : elle refuse — à
// juste titre — de déplacer le pays d'un champ déjà rempli (un
// Sénégalais installé au Canada a un numéro canadien). Elle ne sert
// donc qu'aux champs restés vides, et la suggestion doit arriver AVEC
// la valeur, pas après.
const isoSuggere = isoDepuisNom(profile.country || profile.originCountry || "");
champTelephone("phone")?.definir(profile.phone || "", isoSuggere);
champTelephone("whatsapp")?.definir(profile.whatsapp || "", isoSuggere);
synchroniserPays(profile.country || profile.originCountry || "");
document.getElementById("profileEmail").value = currentUser.email || "";

document.getElementById("lastDegree").value = profile.lastDegree || profile.currentDegree || "";
document.getElementById("currentInstitution").value = profile.currentInstitution || "";
document.getElementById("graduationYear").value = profile.graduationYear || "";
initAverageScaleField("academicAverage", profile.academicAverage, profile.academicAverageScale);
document.getElementById("bacSeries").value = profile.bacSeries || "";
document.getElementById("bacMention").value = profile.bacMention || "";
initAverageScaleField("bacAverage", profile.bacAverage, profile.bacAverageScale);
document.getElementById("currentLevel").value = profile.currentLevel || "";

// Le palier (lot PROFIL-PAR-NIVEAU). Un profil d'avant n'en a pas : ses
// blocs Bac / niveau actuel suivent alors l'ancien studentStatus, qu'on
// conserve tel quel jusqu'à ce qu'un palier soit choisi.
state.studentStatusHerite = profile.studentStatus || "";
renderPalierGrid();
const palier = lirePalier(profile);
if (palier) {
const radio = document.querySelector(`input[name="palier"][value="${palier}"]`);
if (radio) radio.checked = true;
}
applyPalier(palier);

document.getElementById("ranking").value = profile.ranking || "";
document.getElementById("strongSubjects").value = profile.strongSubjects || "";
document.getElementById("weakSubjects").value = profile.weakSubjects || "";
document.getElementById("projects").value = profile.projects || "";
document.getElementById("thesis").value = profile.thesis || "";
document.getElementById("publications").value = profile.publications || "";
document.getElementById("researchExperience").value = profile.researchExperience || "";

// Les langues : des objets {code, level} (profile.js) ; une chaîne
// (« français », anciens profils) est reconnue par son nom.
state.languages = (Array.isArray(profile.languages) ? profile.languages : []).map((l) => {
if (l && typeof l === "object") return { ...l };
const nom = String(l || "").trim();
const fixe = FIXED_LANGUAGES.find((f) => f.label.toLowerCase() === nom.toLowerCase());
return fixe ? { code: fixe.code, level: "" } : { code: "autre", name: nom, level: "" };
}).filter((l) => l.code && (l.code !== "autre" || l.name));
renderLangues();
initAjoutDeLangue();

initTestLangue(profile);

document.getElementById("desiredField").value = profile.desiredField || "";
document.getElementById("specialization").value = profile.specialization || "";
document.getElementById("desiredDegree").value = profile.desiredDegree || "";

state.preferredCountries = new Set(profile.preferredCountries || []);
state.excludedCountries = new Set(profile.excludedCountries || []);

renderCountryChipGroups(profile);

document.getElementById("budget").value = profile.budget || "";

if (profile.hasSponsor) {
const radio = document.querySelector(`input[name="hasSponsor"][value="${profile.hasSponsor}"]`);
if (radio) radio.checked = true;
}

(profile.fundingWanted || []).forEach((value) => {
const input = document.querySelector(`#fundingWantedGroup input[value="${value}"]`);
if (input) input.checked = true;
});

(profile.documentsAvailable || []).forEach((value) => {
const input = document.querySelector(`#documentsGroup input[value="${value}"]`);
if (input) input.checked = true;
});

initCheckCards("documentsGroup", ".doc-check-card");

document.getElementById("internships").value = profile.internships || "";
document.getElementById("workExperience").value = profile.workExperience || "";
document.getElementById("associations").value = profile.associations || "";
document.getElementById("volunteering").value = profile.volunteering || "";
document.getElementById("entrepreneurship").value = profile.entrepreneurship || "";

document.getElementById("whyLeave").value = profile.whyLeave || "";
document.getElementById("careerGoals").value = profile.careerGoals || "";
document.getElementById("dreams").value = profile.dreams || "";

afficherMentionsReprises(profile.reprisDuDiagnostic);

initAgeCalculation();
initSectionNavScrollSpy();
updateCompletion();

}

// ==========================================================
// Construction de l'objet à sauvegarder
// ==========================================================

function buildUpdatedProfile(existingName) {

const palier = state.palier;

// Le studentStatus hérité (deux valeurs) se déduit du palier ; sans
// palier, on garde ce que le profil portait.
const studentStatus = studentStatusDuPalier(palier) || state.studentStatusHerite;

const updated = {

palier,

firstName: val("firstName"), lastName: val("lastName"),
gender: val("gender"), birthDate: val("birthDate"),
country: val("country"), city: val("city"), nationality: val("nationality"),
phone: val("phone"), whatsapp: val("whatsapp"),

lastDegree: val("lastDegree"), currentInstitution: val("currentInstitution"),
graduationYear: val("graduationYear"), academicAverage: val("academicAverage"),
academicAverageScale: averageScaleState.academicAverage || AVERAGE_DEFAULT_SCALE,
studentStatus,
bacSeries: val("bacSeries"), bacMention: val("bacMention"), bacAverage: val("bacAverage"),
bacAverageScale: averageScaleState.bacAverage || AVERAGE_DEFAULT_SCALE,
currentLevel: val("currentLevel"),

ranking: val("ranking"), strongSubjects: val("strongSubjects"), weakSubjects: val("weakSubjects"),
projects: val("projects"), thesis: val("thesis"), publications: val("publications"),
researchExperience: val("researchExperience"),

languages: state.languages,
testLangue: lireTestLangueDuFormulaire(),

desiredField: val("desiredField"), specialization: val("specialization"), desiredDegree: val("desiredDegree"),

preferredCountries: [...state.preferredCountries],
excludedCountries: [...state.excludedCountries],

budget: val("budget"), hasSponsor: radioValue("hasSponsor"),
fundingWanted: checkedValues("fundingWantedGroup"),

documentsAvailable: checkedValues("documentsGroup"),

internships: val("internships"), workExperience: val("workExperience"),
associations: val("associations"), volunteering: val("volunteering"),
entrepreneurship: val("entrepreneurship"),

whyLeave: val("whyLeave"), careerGoals: val("careerGoals"), dreams: val("dreams"),

// L'étudiant enregistre : ce qu'il a repris du diagnostic est vérifié.
reprisDuDiagnostic: []

};

// LOT R17 — UNE QUESTION, UN VOCABULAIRE, DEUX PORTES.
//
// `situationFrancais` est la clé que l'étape 1 de la route écrit de son
// côté (QUESTIONS_SITUATION, js/route-preinscription.js) pour la même
// question. Elle se déduit désormais de la réponse donnée ici — mais
// SEULEMENT quand cette réponse dit quelque chose du FRANÇAIS : un
// IELTS déclaré ne raconte rien du français de l'étudiant, et l'écrire
// lui mettrait dans la bouche, à l'étape 1 de sa route, une réponse
// qu'il n'a jamais donnée (js/test-de-langue.js).
//
// Quand elle ne dit rien, la clé est ABSENTE de cet objet — et
// l'enregistrement champ par champ (voir plus bas) laisse alors
// intacte la valeur déjà en base. Avant ce lot, un tel silence était
// impossible : la page réécrivait le bloc `profile` entier, et
// `situationFrancais`, qui n'y figurait pas, disparaissait à chaque
// enregistrement.
const situation = situationFrancaisDepuisTest(updated.testLangue);
if (situation) updated.situationFrancais = situation;

// Alias hérités — recalculés pour que dashboard.js et les anciens
// outils IA continuent de fonctionner avant leur migration.
updated.originCountry = updated.country;
updated.currentDegree = studentStatus === "en_cours" ? updated.currentLevel : updated.lastDegree;
// Lot R16 : « Je ne parle pas cette langue » (level "aucun") n'est pas
// un niveau d'anglais — cet alias hérité reste vide dans ce cas.
const anglais = updated.languages.find((l) => l.code === "en");
updated.englishLevel = anglais && niveauDepuisCode(anglais.level) !== "aucun" ? (anglais.level || "") : "";
updated.desiredCountry = updated.preferredCountries[0] || "";

updated.name = existingName;

return updated;

}

function showToast() {

const toast = document.getElementById("saveToast");
toast.classList.add("is-visible");

setTimeout(() => toast.classList.remove("is-visible"), 2600);

}

initShellChrome();

// ==========================================================
// FIREBASE
// ==========================================================

bootstrapShell().then((session) => {

if (!session) return;

// LE PROFIL PARLE À L'ESPACE OÙ L'ON SE TROUVE (lot B3, 2026-09-18).
// La note du compteur promettait « un score par candidature, basé sur
// les exigences réelles de la bourse visée » : un vœu de préinscription
// n'a ni bourse ni score de ce genre — son avancement, c'est sa route.
const noteScore = document.getElementById("profileNoteScore");
if (noteScore && session.espace === "preinscription") {
noteScore.innerHTML = 'Le compteur ne retient que les sections qui s\'appliquent à votre niveau. L\'avancement de votre dossier, lui, se suit étape par étape dans <a href="espace-preinscription.html">votre route</a>.';
}

const { user, userData } = session;

const userRef = doc(db, "users", user.uid);

NOM_DU_COMPTE = userData.name || "";

const formule = window.SCHOLARBRIDGE_PLANS && window.SCHOLARBRIDGE_PLANS[session.planId];
const n = formule && Number.isFinite(formule.maxAccompaniedApplications) ? formule.maxAccompaniedApplications : 0;
OBJET_FITZ = n > 1 ? `vos ${n} universités` : (n === 1 ? "votre université" : "vos universités");

// Lot ACCEPTATION, partie 3 : le bandeau « Fitz a besoin de ces
// informations pour choisir votre université / vos N universités :
// [liste des manquants] ». N = le quota de la formule bourses.
const bandeauFitz = document.getElementById("fitzProfilBandeau");
if (bandeauFitz && POUR_FITZ) {
const { pret, manquants } = profilPretPourFitz(session.profile);
const objet = n > 1 ? `vos ${n} universités` : "votre université";
if (!pret) {
bandeauFitz.hidden = false;
bandeauFitz.innerHTML = `<i data-lucide="user-round"></i><span>Fitz a besoin de ces informations pour choisir ${escapeHtml(objet)} : <strong>${escapeHtml(manquants.join(", "))}</strong>.</span>`;
if (window.lucide) lucide.createIcons();
} else {
// Déjà prêt : rien à compléter, les propositions attendent.
window.location.replace("applications.html");
return;
}
}

let profile = Object.assign(
defaultProfile(userData),
userData.profile || {}
);

// Partie 4 : les réponses du diagnostic de cette session pré-remplissent
// les champs VIDES — en mémoire seulement, rien n'est écrit tant que
// l'étudiant n'enregistre pas. Ce qui était déjà repris à la création du
// compte (reprisDuDiagnostic en base) garde sa mention.
const reponses = lireReponsesDiagnostic();
if (reponses) {
const dejaRepris = Array.isArray(profile.reprisDuDiagnostic) ? profile.reprisDuDiagnostic : [];
const { profil, repris } = appliquerDiagnostic(profile, reponses);
profile = profil;
profile.reprisDuDiagnostic = [...new Set([...dejaRepris, ...repris])];
}

// Les champs internationaux sont montés AVANT l'hydratation : c'est
// eux qui savent relire un numéro enregistré.
monterChampTelephone("phone");
monterChampTelephone("whatsapp");

brancherWhatsAppMeme(profile);

// Le pays de résidence n'est pas figé : un étudiant qui le corrige
// après coup doit voir l'indicatif suivre — tant qu'il n'a pas
// lui-même saisi de numéro (voir suggererPays).
document.getElementById("country").addEventListener("input", (event) => {
synchroniserPays(event.target.value);
});

hydrateForm(profile, user);

// LES EXEMPLES APRÈS L'HYDRATATION, ET APRÈS ELLE SEULEMENT : posés
// avant, une pastille se serait allumée sur une valeur que le
// formulaire n'avait pas encore reçue. La fonction est idempotente —
// appliquerPalier() la rappelle quand des champs apparaissent.
brancherChampsGuides(document, { pays: () => COUNTRY_NAMES });

// Rendu instantané avec la liste de secours (ci-dessus), puis mise à
// jour en place des chips de pays dès que le vrai catalogue est chargé —
// jamais de page bloquée en attendant Firestore, jamais de sélection déjà
// cochée perdue pendant la bascule (renderCountryChipGroups en tient compte).
loadDestinationCountryOptions().then(() => renderCountryChipGroups(profile));

// Recalcule les coches de complétion à chaque saisie.
document.getElementById("profileForm").addEventListener("input", updateCompletion);
document.getElementById("profileForm").addEventListener("change", updateCompletion);

const profileForm = document.getElementById("profileForm");
const saveButton = document.getElementById("saveProfileBtn");

// Le bouton qui a déclenché l'envoi (barre finale ou bouton de section)
// reçoit l'état de chargement ; les autres restent en place.
let boutonActif = saveButton;
profileForm.querySelectorAll('button[type="submit"]').forEach((b) => {
b.addEventListener("click", () => { boutonActif = b; });
});

profileForm.addEventListener("submit", async (event) => {

event.preventDefault();

// Le palier est la seule information sans laquelle le formulaire ne
// sait pas quoi montrer : c'est le premier clic, on le demande. Rien
// d'autre n'est obligatoire — la ligne d'état dit ce qui manque à
// Fitz, sans bloquer un enregistrement partiel.
if (!state.palier) {
alert("Indiquez d'abord où vous en êtes dans vos études : c'est ce qui adapte le reste du profil.");
document.getElementById("sec-depart").scrollIntoView({ behavior: "smooth", block: "start" });
return;
}

// Un numéro faux enregistré en silence est exactement ce que le
// champ international existe pour empêcher : c'est au moment de
// l'enregistrement qu'on s'en aperçoit, ou jamais. Le message posé
// sous le champ dit combien de chiffres sont attendus — la
// validation ne porte que sur la longueur, et accepte plusieurs
// valeurs quand le pays en admet plusieurs.
for (const id of ["phone", "whatsapp"]) {

// Lot R19 : le champ WhatsApp masqué par la case « même numéro » ne
// se valide pas — il porte une copie du téléphone, déjà jugé, et on
// ne peut pas mettre le curseur dans un champ qu'on ne voit pas.
if (id === "whatsapp" && document.getElementById("whatsappChamp")?.hidden) continue;

const champ = champTelephone(id);

if (champ && !champ.valider()) {
champ.elements.national.focus();
champ.elements.national.scrollIntoView({ behavior: "smooth", block: "center" });
return;
}

}

const bouton = boutonActif || saveButton;
setButtonLoading(bouton, true, "Enregistrement...");

try {

const updatedProfile = buildUpdatedProfile(userData.name || "");

// LOT R17 — CETTE PAGE N'ÉCRASE PLUS CE QU'ELLE NE CONNAÎT PAS.
//
// Elle écrivait `{ profile: updatedProfile }` : une écriture de MAP
// ENTIÈRE, qui remplace le bloc `profile` par la liste des clés
// construites ci-dessus. Toute clé écrite ailleurs et absente de cette
// liste était donc effacée au premier enregistrement — et c'est ce qui
// arrivait à `situationFrancais`, la réponse donnée à l'étape 1 de la
// route. Vérifié au banc d'essai le 2026-09-18 : « test_prevu » avant,
// absente après un enregistrement de « Pour commencer ».
//
// On écrit maintenant CHAMP PAR CHAMP, comme enregistrerSituation() le
// fait déjà dans espace-preinscription.js : une seule façon d'écrire un
// profil dans le dépôt, et une page qui ne touche qu'à ses champs.
const aEcrire = { name: updatedProfile.name };
for (const [cle, valeur] of Object.entries(updatedProfile)) aEcrire[`profile.${cle}`] = valeur;

await updateDoc(userRef, aEcrire);

// Enregistré : les mentions « repris du diagnostic » s'éteignent.
afficherMentionsReprises([]);

// Lot ACCEPTATION, partie 3 : arrivé ici pour Fitz (?pour=fitz), dès
// que l'enregistrement rend le profil prêt, la page renvoie vers « Mes
// candidatures » — les propositions à accepter.
if (POUR_FITZ && profilPretPourFitz(updatedProfile).pret) {
window.location.href = "applications.html";
return;
}

showToast();

} catch (error) {

console.error(error);

if (error.code === "unavailable" || error.code === "failed-precondition") {
alert("Vérifiez votre connexion Internet, puis réessayez d'enregistrer.");
} else {
alert("Une erreur est survenue lors de l'enregistrement de votre profil. Veuillez réessayer.");
}

} finally {

setButtonLoading(bouton, false);

}

});

if (window.lucide) lucide.createIcons();

});
