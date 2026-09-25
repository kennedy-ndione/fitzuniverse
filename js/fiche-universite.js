/**
* ============================================================
* FitzUniverse — LA FICHE D'UN ÉTABLISSEMENT (lot 76-77, 2026-09-24)
* ============================================================
*
* CE QUE CE FICHIER RÉPARE
* ------------------------
* Une carte de universities.html menait à `scholarship-details.html
* ?id=<premier programme>`. Deux défauts, mesurés ce jour-là :
*
*   1. Une université SANS programme (aucune bourse rattachée) passait
*      son propre identifiant à la fiche programme, qui répondait
*      « Cette opportunité n'est plus disponible ». Witwatersrand le
*      faisait déjà ; les lots 76 et 77 en ajoutaient trente et une —
*      toutes les universités ajoutées pour la PRÉINSCRIPTION, qui
*      n'ont pas de bourse et n'en ont pas besoin.
*   2. Une université AVEC plusieurs programmes n'en montrait qu'un :
*      le premier trouvé. Les autres bourses étaient invisibles depuis
*      la carte.
*
* La fiche d'établissement montre ce que le catalogue sait de
* l'université elle-même — statut, langue, domaines, coût par niveau,
* exonérations, comment candidater, sources datées — puis la liste de
* SES programmes, chacun vers sa fiche.
*
* CE MODULE EST PUR : aucun DOM, aucun Firestore. Il rend une « vue »
* (des textes et des liens) que universite-page.js pose dans la page en
* textContent. Testé sous Node sur les 186 universités du catalogue
* (test/fiche-universite.test.mjs).
*
* RÈGLE DES TROIS VALEURS, comme partout : un champ absent est un
* inconnu. Il ne produit ni ligne vide, ni « non renseigné » : la ligne
* n'existe pas. Seul le coût garde une ligne quand rien n'est vérifié,
* parce que « Frais non vérifiés » EST une information (js/frais.js).
* ============================================================
*/

import { lireFrais, lireExoneration, libelleFrais, libelleMontant, LIBELLES_EXONERATION, ORDRE_NIVEAUX } from "./frais.js";
import { equivalentFcfa } from "./taux-indicatifs.js";
import { lireVoieAdmission, VOIES_ADMISSION } from "./voie-admission.js";
import { formaterDate, etatCandidature } from "./echeance.js";
import { PAYS, estOuverte, pageDeDestination } from "./pays-preinscription.js";
import { auPays } from "./pays-grammaire.js";

// L'adresse de la fiche : un module à part, pour que la page des
// universités l'importe sans charger ce calcul.
export { adresseFiche } from "./fiche-adresse.js";

const texte = (v) => (typeof v === "string" ? v.trim() : "");
const url = (v) => (typeof v === "string" && /^https?:\/\/\S+$/.test(v.trim()) ? v.trim() : "");

/** « docs.example.org » : le domaine d'une source. */
export function domaineDe(adresse) {
try {
return new URL(adresse).hostname.replace(/^www\./, "");
} catch {
return "";
}
}

/**
* Ce qu'un lien de source AFFICHE : le domaine, puis la dernière partie
* lisible du chemin — « usmba.ac.ma › etudiants-etrangers ». Trois liens
* qui ne disaient que « usmba.ac.ma » ne se distinguaient pas.
*/
export function libelleSource(adresse) {
const domaine = domaineDe(adresse);
if (!domaine) return "";
let morceau = "";
try {
const segments = new URL(adresse).pathname.split("/").filter(Boolean).map((x) => decodeURIComponent(x));
morceau = (segments[segments.length - 1] || "").replace(/\.(s?html?|php|aspx?)$/i, "");
if (/^(index|fr|en|node|\d+)$/i.test(morceau) && segments.length > 1) morceau = segments.slice(-2).join("/");
} catch {
morceau = "";
}
if (morceau.length > 48) morceau = `${morceau.slice(0, 47)}…`;
return morceau ? `${domaine} › ${morceau}` : domaine;
}

// L'ordre des niveaux d'un programme — « Licence / Master / Doctorat »
// (les trois programmes AMCI d'origine) se range au premier cité.
const RANG_NIVEAU = (niveau) => {
const i = ORDRE_NIVEAUX.findIndex((n) => String(niveau || "").startsWith(n));
return i < 0 ? ORDRE_NIVEAUX.length : i;
};

/**
* La vue complète d'une fiche.
*
* @param {Object} ctx
* @param {Object} ctx.universite  document `universities` ({id, ...})
* @param {Array}  [ctx.programmes] TOUS les programmes du catalogue (filtrés ici)
* @param {Array}  [ctx.bourses]    toutes les bourses du catalogue
* @param {Date}   [ctx.aujourdhui]
* @returns {Object|null} null si l'université est absente
*/
export function ficheUniversite({ universite, programmes = [], bourses = [], aujourdhui = new Date() } = {}) {

if (!universite || typeof universite !== "object" || !universite.id) return null;

const u = universite;
const pays = texte(u.country);

// --- En-tête
const lieu = [texte(u.city), texte(u.province) && texte(u.province) !== texte(u.city) ? texte(u.province) : ""].filter(Boolean).join(", ");

// --- En bref : uniquement ce qui est renseigné.
const enBref = [];
if (texte(u.reconnaissance)) enBref.push({ cle: "statut", libelle: "Statut", valeur: texte(u.reconnaissance), icone: "landmark" });
if (texte(u.langueEnseignement)) enBref.push({ cle: "langue", libelle: "Langue d'enseignement", valeur: texte(u.langueEnseignement), icone: "languages" });
const domaines = Array.isArray(u.fields) ? u.fields.filter((f) => typeof f === "string" && f.trim()) : [];
if (domaines.length) enBref.push({ cle: "domaines", libelle: "Domaines", valeur: domaines.join(", "), icone: "book-open" });
// Le classement n'y est pas : il est déjà dans le bandeau, sous le nom.
if (texte(u.numeroEED)) enBref.push({ cle: "eed", libelle: "Numéro d'établissement désigné (EED)", valeur: texte(u.numeroEED), icone: "badge-check", aide: "Le numéro que la demande de permis d'études canadien vous réclame." });

// --- Coût : une ligne par niveau renseigné ; sinon une seule ligne
// « Frais non vérifiés ».
const frais = u.fraisScolarite && typeof u.fraisScolarite === "object" ? u.fraisScolarite : null;
const lignes = ORDRE_NIVEAUX
.filter((n) => frais && frais[n.toLowerCase()])
.map((n) => {
const f = lireFrais(u, n, { aujourdhui });
const verifie = f.etat === "verifie";
return {
niveau: n,
texte: libelleFrais(u, n, { aujourdhui }),
montant: libelleMontant(f),
mention: verifie ? (f.fraiche ? `vérifié le ${formaterDate(f.verifieLe)}` : "à recouper") : "",
// Le montant en F CFA, pour qui compte en F CFA (test « Moussa ») : exact
// pour l'euro, « environ », au taux daté, pour les autres devises.
fcfa: verifie && f.montant > 0 && equivalentFcfa(f.montant, f.devise) ? `soit ${equivalentFcfa(f.montant, f.devise)}${f.periode === "an" ? " par an" : ""}` : "",
verifie
};
});
const exo = lireExoneration(u);
const admission = u.admission && typeof u.admission === "object" ? u.admission : {};

const couts = {
lignes: lignes.length ? lignes : [{ niveau: "", texte: "Frais non vérifiés", montant: "Frais non vérifiés", mention: "", verifie: false }],
note: frais ? texte(frais.note) : "",
source: frais ? url(frais.source) : "",
verifieLe: frais ? formaterDate(frais.verifieLe) : "",
coutIndicatif: texte(admission.coutIndicatif),
exoneration: exo.politique === "inconnue" && !exo.detail ? null : {
politique: exo.politique,
libelle: LIBELLES_EXONERATION[exo.politique],
detail: exo.detail,
source: exo.source || "",
verifieLe: formaterDate(exo.verifieLe)
}
};

// --- Comment candidater.
// La voie d'admission ne s'affiche que s'il n'y a PAS de portail
// connu — même règle que js/voie-admission.js. Ici, le portail n'est
// jamais dans le catalogue public (lot S3) : c'est l'appelant qui le
// passe, pour un abonné, et la voie s'éteint alors d'elle-même.
const code = lireVoieAdmission(u);
const candidature = {
voie: code ? { code, libelle: VOIES_ADMISSION[code].libelle, explication: VOIES_ADMISSION[code].explication } : null,
etapes: [
["procedure", "La démarche"],
["conditions", "Les conditions"],
["calendrier", "Le calendrier"],
["langue", "La langue"],
["fraisDossier", "Les frais de dossier"]
].filter(([cle]) => texte(admission[cle])).map(([cle, libelle]) => ({ cle, libelle, texte: texte(admission[cle]) })),
sources: (Array.isArray(admission.sources) ? admission.sources : []).map(url).filter(Boolean)
.filter((s, i, t) => t.indexOf(s) === i)
.map((s) => ({ url: s, domaine: domaineDe(s), libelle: libelleSource(s) })),
verifieLe: formaterDate(admission.verifieLe)
};

// --- Programmes (bourses × niveaux) de CETTE université.
const parBourse = new Map((bourses || []).filter(Boolean).map((b) => [b.id, b]));
const siens = (programmes || [])
.filter((p) => p && p.universityId === u.id)
.map((p) => {
const b = parBourse.get(p.scholarshipId) || {};
const etat = etatCandidature({
statut: [p.status, b.status],
actif: b.isActive,
echeances: [p.deadline],
echeanceISO: p.deadlineISO,
periodeOuverture: p.periodeOuverture || b.periodeOuverture,
verifieLe: b.verifieLe,
echeanceVariable: b.echeanceVariable
}, aujourdhui);
return {
id: p.id,
href: `scholarship-details.html?id=${encodeURIComponent(p.id)}`,
bourse: texte(b.title) || "Bourse du catalogue",
niveau: texte(p.level),
etat: etat ? { court: etat.badge, ouvert: etat.ouvert === true } : null
};
})
.sort((a, b) => a.bourse.localeCompare(b.bourse, "fr") || (RANG_NIVEAU(a.niveau) - RANG_NIVEAU(b.niveau)));

// --- La destination, si elle est accompagnée en préinscription.
const destinationPays = (PAYS || []).find((p) => p.nom === pays);
const destination = destinationPays && estOuverte(destinationPays)
? { id: destinationPays.id, page: pageDeDestination(destinationPays), auPays: auPays(pays), libelle: `Préparer ma préinscription ${auPays(pays)}` }
: null;

return {
id: u.id,
titre: texte(u.name) || "Établissement du catalogue",
pays,
lieu,
drapeau: texte(u.flag),
image: texte(u.image),
classement: texte(u.ranking),
description: texte(u.description),
siteOfficiel: url(u.officialWebsite),
enBref,
couts,
candidature,
programmes: siens,
destination
};

}

/**
* La description courte d'une fiche — balise meta et partages. Une
* phrase entière quand elle tient, jamais coupée au milieu d'un mot.
*/
export function resumeFiche(vue, max = 160) {
if (!vue) return "";
const base = vue.description || `${vue.titre}${vue.lieu ? `, ${vue.lieu}` : ""}${vue.pays ? `, ${vue.pays}` : ""}.`;
if (base.length <= max) return base;
const phrase = base.slice(0, max).match(/^.*[.!?](?=\s|$)/);
if (phrase && phrase[0].length > 60) return phrase[0];
return `${base.slice(0, max).replace(/\s+\S*$/, "").replace(/[\s,;:]+$/, "")}…`;
}
