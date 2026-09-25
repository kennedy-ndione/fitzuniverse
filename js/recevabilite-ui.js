// ============================================================
// « PUIS-JE ME LANCER ? » — les questions et les quatre voyants
// (2026-09-25), partagés par diagnostic-france.html et diagnostic-pays.html
//
// Le moteur est pur (js/recevabilite.js) ; ce module pose les questions
// sur les études dans le formulaire du diagnostic, les pré-remplit
// depuis le profil, les relit, et peint le verdict et les voyants en
// tête du résultat. Les réponses s'enregistrent dans le PROFIL (elles
// valent pour tous les pays : on ne redemande pas son bac deux fois).
// ============================================================
import { PAYS_DIPLOME, DIPLOMES, SERIES, MENTIONS, STATUTS_LANGUE, LANGUES_COURS } from "./recevabilite.js";
import { escapeHtml } from "./ai/format.js";
import { formaterDate } from "./echeance.js";
import { initFitzSelects } from "./fitz-select.js";
import { findCountry } from "./countries.js";

/**
* Ce que le profil sait déjà : le palier du questionnaire, le pays de
* résidence, l'année du dernier diplôme. Une réponse déjà donnée ici
* l'emporte toujours ; sinon on part de là, l'étudiant corrige.
*/
const DIPLOME_DU_PALIER = { lycee: "terminale", bac_obtenu: "bac", licence_obtenue: "licence", master_obtenu: "master", doctorat_en_cours: "master", doctorat_obtenu: "master" };

export function preRemplir(profil = {}) {
const p = { ...(profil || {}) };
if (!p.diplomeActuel && DIPLOME_DU_PALIER[p.palier]) p.diplomeActuel = DIPLOME_DU_PALIER[p.palier];
if (!p.paysDiplome) {
const pays = findCountry(p.country);
if (pays && PAYS_DIPLOME.some((x) => x.id === pays.iso)) p.paysDiplome = pays.iso;
}
if ((p.anneeBac === undefined || p.anneeBac === null || p.anneeBac === "") && p.palier === "bac_obtenu" && /^\d{4}$/.test(String(p.graduationYear || ""))) p.anneeBac = Number(p.graduationYear);
return p;
}

/** Les clés du profil que ce module lit et écrit. */
export const CLES_PROFIL = ["diplomeActuel", "paysDiplome", "serieBac", "systemeBac", "anneeBac", "mentionBac", "reprisesBac", "anneeNaissance", "desiredDegree"];

const NIVEAUX = ["Licence", "Master", "Doctorat"];
const RANG_BAC = ["terminale", "bac", "bac1", "bac2"];

function options(liste, valeur, vide = "Choisissez…") {
return `<option value="">${escapeHtml(vide)}</option>${liste.map((o) => `<option value="${escapeHtml(o.id)}"${o.id === valeur ? " selected" : ""}>${escapeHtml(o.libelle || o.nom)}</option>`).join("")}`;
}

function champ(id, libelle, html, aide = "") {
return `<div class="field" id="${id}Champ"><label for="${id}">${escapeHtml(libelle)}</label>${html}${aide ? `<p class="field-hint">${escapeHtml(aide)}</p>` : ""}</div>`;
}

/**
* Pose les questions dans `conteneur` (un <fieldset> du formulaire).
* @param {HTMLElement} conteneur
* @param {string} id - destination
* @param {Object} profil - users/{uid}.profile
*/
export function poserQuestions(conteneur, id, profil = {}) {
const p = preRemplir(profil);
const langues = LANGUES_COURS[id] || [];
const annee = new Date().getFullYear();
conteneur.innerHTML = `
<legend class="field-label">Vos études</legend>
<p class="field-hint">Pour vous dire si vous avez le droit de postuler, avant de payer quoi que ce soit.</p>
${champ("recNiveau", "Quel niveau visez-vous ?", `<select id="recNiveau">${options(NIVEAUX.map((n) => ({ id: n, libelle: n })), p.desiredDegree)}</select>`)}
${champ("recDiplome", "Votre diplôme le plus élevé, obtenu ou en cours", `<select id="recDiplome">${options(DIPLOMES, p.diplomeActuel)}</select>`)}
${champ("recPays", "Dans quel pays avez-vous passé ce diplôme ?", `<select id="recPays">${options(PAYS_DIPLOME, p.paysDiplome)}</select>`)}
${champ("recSysteme", "Quel bac ?", `<select id="recSysteme">${options([{ id: "francophone", libelle: "Baccalauréat (système francophone)" }, { id: "anglophone", libelle: "GCE A-Level (système anglophone)" }], p.systemeBac || "francophone", "")}</select>`)}
${champ("recSerie", "Votre série de bac", `<select id="recSerie">${options(SERIES, p.serieBac)}</select>`)}
${champ("recAnneeBac", "Année du bac (obtenu ou prévu)", `<input type="number" class="fitz-num" id="recAnneeBac" min="1980" max="${annee + 1}" step="1" inputmode="numeric" placeholder="Ex. ${annee}" value="${escapeHtml(p.anneeBac ?? "")}">`)}
${champ("recMention", "Mention au bac", `<select id="recMention">${options(MENTIONS, p.mentionBac)}</select>`)}
${champ("recReprises", "Combien de fois avez-vous passé le bac pour l'obtenir ?", `<select id="recReprises">${options([{ id: "1", libelle: "Une fois" }, { id: "2", libelle: "Deux fois" }, { id: "3", libelle: "Trois fois ou plus" }], p.reprisesBac != null ? String(p.reprisesBac + 1) : "")}</select>`)}
${champ("recNaissance", "Votre année de naissance", `<input type="number" class="fitz-num" id="recNaissance" min="1950" max="${annee}" step="1" inputmode="numeric" placeholder="Ex. 2007" value="${escapeHtml(p.anneeNaissance ?? "")}">`, "Les écoles publiques marocaines fixent un âge maximal.")}
${langues.length > 1 ? champ("recLangue", "Dans quelle langue voulez-vous étudier ?", `<select id="recLangue">${options(langues.map((l) => ({ id: l, libelle: l.charAt(0).toUpperCase() + l.slice(1) })), p[`langueCours_${id}`] || langues[0], "")}</select>`) : ""}
${champ("recStatut", langues.length > 1 ? "Et cette langue, où en êtes-vous ?" : `Et le ${langues[0] || "français"}, où en êtes-vous ?`, `<select id="recStatut">${options(STATUTS_LANGUE, p[`statutLangue_${id}`])}</select>`)}
`;
const majVisibilite = () => {
const diplome = conteneur.querySelector("#recDiplome").value;
const pays = conteneur.querySelector("#recPays").value;
const auNiveauBac = RANG_BAC.includes(diplome);
montrer(conteneur, "recSysteme", pays === "CM");
montrer(conteneur, "recSerie", id === "allemagne" && auNiveauBac);
montrer(conteneur, "recAnneeBac", auNiveauBac && ((id === "france" && ["SN", "GN"].includes(pays)) || id === "maroc"));
montrer(conteneur, "recMention", id === "maroc" && auNiveauBac && diplome !== "terminale");
montrer(conteneur, "recReprises", id === "france" && pays === "SN" && auNiveauBac && diplome !== "terminale");
montrer(conteneur, "recNaissance", id === "maroc" && auNiveauBac);
};
conteneur.querySelectorAll("select").forEach((s) => s.addEventListener("change", majVisibilite));
// Une réponse donnée efface le signal « répondez à cette question ».
conteneur.addEventListener("change", (ev) => effacerManque(ev.target.closest(".field")));
conteneur.addEventListener("input", (ev) => effacerManque(ev.target.closest(".field")));
majVisibilite();
initFitzSelects(conteneur);
}

function montrer(conteneur, id, visible) {
const c = conteneur.querySelector(`#${id}Champ`);
if (c) c.hidden = !visible;
}

/** Relit les réponses, en clés du profil. Un champ caché ne compte pas. */
export function lireReponses(conteneur, id) {
const val = (sel) => {
const el = conteneur.querySelector(sel);
if (!el) return "";
const champ = el.closest(".field");
return champ && champ.hidden ? "" : String(el.value || "").trim();
};
const nombre = (v) => (v === "" ? null : Number(v));
const reprises = val("#recReprises");
const r = {
desiredDegree: val("#recNiveau"),
diplomeActuel: val("#recDiplome"),
paysDiplome: val("#recPays"),
systemeBac: val("#recSysteme") || "francophone",
serieBac: val("#recSerie"),
anneeBac: nombre(val("#recAnneeBac")),
mentionBac: val("#recMention"),
reprisesBac: reprises ? Number(reprises) - 1 : null,
anneeNaissance: nombre(val("#recNaissance"))
};
const langues = LANGUES_COURS[id] || [];
r[`langueCours_${id}`] = val("#recLangue") || langues[0] || "";
r[`statutLangue_${id}`] = val("#recStatut");
return r;
}

/** Les questions, dans l'ordre de la page. */
const ORDRE = ["#recNiveau", "#recDiplome", "#recPays", "#recSysteme", "#recSerie", "#recAnneeBac", "#recMention", "#recReprises", "#recNaissance", "#recLangue", "#recStatut"];

/**
* Les questions sans lesquelles le verdict ne peut pas se prononcer :
* les quatre de toujours, et toute question affichée laissée vide (le
* test du 2026-09-25 : un bac sénégalais sans année passait la règle de
* Campus France, l'AMCI se jugeait sans mention ni âge, l'Allemagne
* sans série). Une question cachée ne compte jamais.
*/
export function manquantes(reponses, id, conteneur = null) {
const m = new Set();
if (!reponses.desiredDegree) m.add("#recNiveau");
if (!reponses.diplomeActuel) m.add("#recDiplome");
if (!reponses.paysDiplome) m.add("#recPays");
if (!reponses[`statutLangue_${id}`]) m.add("#recStatut");
if (conteneur) {
for (const sel of ORDRE) {
const el = conteneur.querySelector(sel);
const champ = el && el.closest(".field");
if (champ && !champ.hidden && !String(el.value || "").trim()) m.add(sel);
}
}
return ORDRE.filter((sel) => m.has(sel));
}

function effacerManque(champ) {
if (!champ || !champ.classList.contains("has-error")) return;
champ.classList.remove("has-error");
champ.querySelector(".rec-manque")?.remove();
}

/**
* Montre ce qui manque : chaque question vide est signalée, la première
* vient à l'écran et prend le focus (le bouton du menu habillé, pas le
* select natif caché, sinon rien ne se voit).
*/
export function signalerManque(conteneur, selecteurs) {
conteneur.querySelectorAll(".field.has-error").forEach(effacerManque);
selecteurs.forEach((sel, i) => {
const champ = conteneur.querySelector(sel)?.closest(".field");
if (!champ) return;
champ.classList.add("has-error");
champ.insertAdjacentHTML("beforeend", `<p class="field-hint rec-manque"${i === 0 ? ' role="alert"' : ""}>Répondez à cette question pour voir votre diagnostic.</p>`);
});
const premier = conteneur.querySelector(selecteurs[0])?.closest(".field");
if (!premier) return;
premier.scrollIntoView({ behavior: "smooth", block: "center" });
const cible = premier.querySelector(".fitz-select-trigger") || premier.querySelector("input, select");
if (cible) cible.focus({ preventScroll: true });
}

const ICONES = { ok: "circle-check", condition: "circle-alert", bloque: "circle-x", info: "info" };
const LIBELLES_VERDICT = { lancer: "Vous pouvez vous lancer", "lancer-si": "Vous pouvez vous lancer, avec des points à régler", "pas-encore": "Pas encore" };

function lienSource(s) {
let hote = "Source";
try { hote = new URL(s.url).hostname.replace(/^www\./, ""); } catch { /* garde « Source » */ }
return `<a class="diag-source" href="${escapeHtml(s.url)}" target="_blank" rel="noopener">${escapeHtml(hote)}${s.verifieLe ? ` — vérifié le ${escapeHtml(formaterDate(s.verifieLe))}` : ""}</a>`;
}

/**
* Peint le verdict et les quatre voyants.
* @param {HTMLElement} cible - la section #recResultat
* @param {Object} resultat - puisJeMeLancer(...)
*/
export function peindreVoyants(cible, resultat) {
const v = resultat.verdict;
cible.innerHTML = `
<p class="rec-titre rec-titre--${escapeHtml(v.etat)}">${escapeHtml(LIBELLES_VERDICT[v.etat] || "")}</p>
<p class="diag-verdict">${escapeHtml(v.phrase)}</p>
<ul class="rec-voyants">
${resultat.voyants.map((x) => `
<li class="rec-voyant rec-voyant--${escapeHtml(x.etat)}">
<i data-lucide="${ICONES[x.etat] || "info"}" aria-hidden="true"></i>
<div>
<strong>${escapeHtml(x.voyant)} — ${escapeHtml(x.titre)}</strong>
<p>${escapeHtml(x.texte)}</p>
${x.deblocage ? `<p class="rec-deblocage">Ce qui vous débloque : ${escapeHtml(x.deblocage)}</p>` : ""}
${(x.sources || []).map(lienSource).join(" ")}
</div>
</li>`).join("")}
</ul>
<p class="diag-note">Ce verdict dit si vous avez le droit de postuler selon les règles publiées. Il ne dit pas si vous serez admis : l'admission reste la décision de chaque université.</p>`;
cible.hidden = false;
if (window.lucide) window.lucide.createIcons();
}
