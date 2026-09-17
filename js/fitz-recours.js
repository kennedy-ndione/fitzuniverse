/**
* ============================================================
* FitzUniverse — « Discuter avec Fitz » devient LE recours
* (lot FITZ-RECOURS, 2026-09-10)
* ============================================================
*
* LA DEMANDE (Charles, 2026-09-10) : « pour tout blocage ou difficulté,
* c'est le "discuter avec Fitz" qui l'aidera à résoudre cela. "Discuter
* avec Fitz" doit être la source même. »
*
* LE PIÈGE : js/ai/ai-config.js → MODE = "simule". Aucun appel n'atteint
* un modèle. Promettre « Fitz résout tout » et livrer un gabarit creux
* détruirait la confiance dans tout le produit.
*
* LA CLÉ : le site CONNAÎT DÉJÀ la plupart des blocages. next-action.js
* sait quel prérequis manque ; procedures/ sait ce que dit l'étape 5 et
* d'où vient l'information ; exigences.js sait que sur 27 bourses
* l'étudiant ne dépose pas lui-même ; echeance.js sait la date ;
* plan-features.js sait quelle formule ouvre un outil. Ce n'est pas un
* problème de support en texte libre : c'est un ROUTAGE vers une donnée
* qui existe. Ce module route. Il n'invente rien.
*
* TROIS RÈGLES, TENUES PAR DES TESTS
* ----------------------------------
* 1. Chaque réponse vient d'un CALCUL : Fitz appelle la fonction que la
*    page utilise déjà (prochaineAction, qualifierEtapes, texteConsigne,
*    decideVerrou…). Jamais une seconde copie de la règle — sinon Fitz et
*    la page se contredisent, et ce projet a déjà payé ce prix trois
*    fois. Test anti-divergence : la sortie de `quoi_faire` EST celle de
*    prochaineAction().
* 2. Une consigne de procédure vient toujours avec sa SOURCE et son
*    `verifieLe`. Une réponse sans sa date serait un recul par rapport à
*    ce que la page affiche déjà.
* 3. Une donnée absente se dit absente — absent ≠ zéro ≠ inconnu, la
*    règle des trois valeurs du reste du site. Hors du catalogue des
*    blocages, Fitz dit qu'il ne sait pas et passe la main : à la
*    messagerie, au conseiller, au signalement — le maillon suivant
*    RÉELLEMENT ouvert au compte, jamais un maillon verrouillé.
*
* POINT D'ACCROCHE POUR LE MODÈLE (§14 du brief) : `diagnostiquer()` rend
* `resolu: false` quand le catalogue ne couvre pas le cas. C'est là, et
* seulement là, que le modèle prendra la main le jour où il arrivera —
* le routage et le catalogue ne bougeront pas.
*
* Module PUR : aucun DOM, aucun Firestore. Le contexte (candidature,
* étapes qualifiées, procédure, formule…) arrive en argument ; c'est
* js/fitz-recours-contexte.js qui l'assemble dans le navigateur.
* ============================================================
*/

import { prochaineAction, qualifierEtapes, joursRestants, LIBELLE_PREREQUIS, JOURS_CRITIQUE, JOURS_PROCHE } from "./next-action.js";
import { decideVerrou, unlockingPlans, PLAN_LABELS, PLAN_PREINSCRIPTION_LABELS, FEATURE_CATALOG } from "./plan-features.js";
import { texteConsigne } from "./procedures/vocabulaire.js";
import { lireExigences, groupees, elementsAAjouter, deposeParUnTiers, voiesHorsPortail } from "./exigences.js";
// Lot PEIGNE-FIN (2026-09-10) : les 46 fiches de documents (114 Ko) ne
// sont plus importées ici — ce module est chargé sur chaque page de
// l'espace. Le contexte du blocage « documents » les apporte
// (fitz-recours-contexte.js, import à la demande) : sans elles, le
// diagnostic liste ce qui manque, sans les fiches « où l'obtenir ».
import { slugDocument } from "./documents-slugs.js";
import { lirePreuve, preuveValide, libelleDemande, MODES, LIBELLES_MODES } from "./preuve-depot.js";
import { analyserEcheance, formaterDate } from "./echeance.js";
import { DELAI_REPONSE } from "./delai-reponse.js";
import { lireParcours } from "./parcours.js";
import { formatMontant } from "./diagnostic-france.js";

// ==========================================================
// LE CATALOGUE DES BLOCAGES CONNUS — fermé, et chaque code a sa donnée
// ==========================================================

export const CODES_BLOCAGE = [
"verrou",       // « cet outil est fermé »           → decideVerrou + la grille
"prerequis",    // « je ne peux pas générer ma lettre » → qualifierEtapes / LIBELLE_PREREQUIS
"quoi_faire",   // « je ne sais pas quoi faire »      → prochaineAction
"documents",    // « quels documents ? »              → lireExigences + documents-data
"etape",        // « je ne comprends pas cette étape » → texteConsigne + source + verifieLe
"paiement",     // « où et quand payer ? »            → la couche de résidence
"echeance",     // « c'est quand la date limite ? »   → analyserEcheance / jalons
"depot_tiers",  // « je ne dépose pas moi-même ? »    → deposeParUnTiers
"preuve",       // « comment prouver mon dépôt ? »    → preuve-depot
"sans_reponse"  // « je n'ai pas de nouvelles »       → DELAI_REPONSE + l'état réel
];

/** Le libellé de l'affordance, le même partout. */
export const LIBELLE_RECOURS = "Bloqué ? Demandez à Fitz";

// ==========================================================
// LE LIEN — un seul composant, six contextes
// ==========================================================

/**
* L'URL vers Fitz, avec le contexte du blocage. Le motif existe déjà :
* ai-chat.html lit `?prep=<test>` ; on l'étend avec `?bloc=<code>` et,
* selon le cas, `app`, `etape`, `feature`.
*/
export function lienRecours({ code, app = "", etape = "", feature = "" } = {}) {
const params = new URLSearchParams();
params.set("bloc", CODES_BLOCAGE.includes(code) ? code : "quoi_faire");
if (app) params.set("app", String(app));
if (etape) params.set("etape", String(etape));
if (feature) params.set("feature", String(feature));
return `ai-chat.html?${params.toString()}`;
}

/**
* Lit un blocage dans une chaîne de recherche. Un code inconnu ou
* fabriqué dans la barre d'adresse rend `null` : le chat s'ouvre
* normalement, sans erreur.
*/
export function lireBlocage(search) {
const params = new URLSearchParams(String(search || ""));
const code = params.get("bloc");
if (!code || !CODES_BLOCAGE.includes(code)) return null;
return {
code,
app: params.get("app") || "",
etape: params.get("etape") || "",
feature: params.get("feature") || ""
};
}

function echapper(texte) {
return String(texte == null ? "" : texte).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/**
* L'affordance « Bloqué ? Demandez à Fitz », en HTML — un lien, une
* classe, une icône. Elle se pose à l'endroit du blocage ; le bouton
* flottant et l'onglet mobile restent l'entrée générale.
*/
export function boutonRecours(blocage, { classe = "", libelle = LIBELLE_RECOURS } = {}) {
return `<a href="${echapper(lienRecours(blocage))}" class="fitz-recours${classe ? ` ${classe}` : ""}" data-recours="${echapper(blocage.code)}"><i data-lucide="life-buoy" aria-hidden="true"></i><span>${echapper(libelle)}</span></a>`;
}

// ==========================================================
// L'ÉCHELLE DE RECOURS — jamais d'impasse, jamais un maillon fermé
// ==========================================================

/**
* Les maillons APRÈS Fitz, dans l'ordre imposé, et seulement ceux
* réellement ouverts au compte (decideVerrou, pas une liste recopiée) :
*   1. Fitz — le présent module ;
*   2. la messagerie FitzUniverse (student_messaging), réponse sous
*      DELAI_REPONSE — toutes les formules payantes, Diagnostic France
*      compris ;
*   3. Mon conseiller (advisor) ;
*   4. Signaler un problème (support_ticket) — toute formule payante,
*      Pass Découverte compris.
*/
export function echelleDeRecours(session = {}) {

const ouvert = (featureKey) => !decideVerrou({
planId: session.planId || "gratuit",
planPreinscriptionId: session.planPreinscriptionId || "",
featureFlags: session.featureFlags,
featureKey,
testerAccess: session.testerAccess === true,
hasFitzExpress: session.hasFitzExpress === true
});

const maillons = [];

if (ouvert("student_messaging")) {
maillons.push({ id: "messagerie", feature: "student_messaging", label: "Écrire à l'équipe FitzUniverse", href: "messages.html", detail: `Réponse sous ${DELAI_REPONSE}.` });
}

if (ouvert("advisor")) {
maillons.push({ id: "conseiller", feature: "advisor", label: "Demander à mon conseiller", href: "advisor.html", detail: "Un humain, pour un cas particulier ou un dossier bloqué chez l'organisme." });
}

if (ouvert("support_ticket")) {
maillons.push({ id: "signalement", feature: "support_ticket", label: "Signaler un problème", href: "messages.html#signaler", detail: "Un paiement qui n'est pas passé, une erreur du site." });
}

return maillons;

}

// ==========================================================
// LES DIAGNOSTICS — un par code, chacun sur SA donnée
// ==========================================================

function sourceDatee(source, verifieLe) {
if (!source || !verifieLe) return "";
return `\n\n*(Vérifié le ${formaterDate(verifieLe)} — [voir la source](${source}).)*`;
}

function libelleFormule(id) {
return PLAN_LABELS[id] || PLAN_PREINSCRIPTION_LABELS[id] || id;
}

function nomOutil(feature) {
const entree = FEATURE_CATALOG.find((f) => f.key === feature);
return entree ? entree.label : feature;
}

/** L'étape qualifiée d'une candidature, par identifiant. */
function etapeDe(contexte, id) {
const etapes = Array.isArray(contexte.etapes) ? qualifierEtapes(contexte.etapes) : [];
return etapes.find((e) => e.id === id) || null;
}

// ==========================================================
// LA ROUTE PRÉINSCRIPTION — Fitz répond avec l'étape où l'on est
// ==========================================================
/**
* LOT R9 (2026-09-17). La route pose « Bloqué ? Demandez à Fitz » sous
* chacune de ses quinze étapes, avec `?bloc=quoi_faire&etape=<id>` :
* c'est le seul recours de l'étudiant à chaque étape, et Fitz y arrivait
* aveugle (voir js/fitz-recours-contexte.js pour le récit).
*
* Ces trois fonctions ne CALCULENT rien : l'étape de route leur arrive
* déjà construite par `construireRoute` — la fonction même que la page
* utilise. Elles la mettent en phrases. C'est la règle 1 du module :
* jamais une seconde copie de la règle.
*/
function echeanceEnClair(ech) {
if (!ech || !ech.iso) return "";
const j = ech.jours;
const reste = j === null || j === undefined ? ""
: j < 0 ? ` — c'est dépassé depuis ${Math.abs(j)} jour${Math.abs(j) > 1 ? "s" : ""}`
: j === 0 ? " — c'est aujourd'hui"
: ` — dans ${j} jour${j > 1 ? "s" : ""}`;
// Un jalon d'OUVERTURE porte déjà sa préposition dans son libellé
// (« Demande de visa possible à partir du ») : il passe donc DEVANT la
// date. Même règle que la page, au mot près — voir htmlEcheance() dans
// espace-preinscription.js.
if (ech.debut && ech.libelle) return `${ech.libelle} ${formaterDate(ech.iso)}${reste}.`;
const quand = ech.debut ? `À partir du ${formaterDate(ech.iso)}` : `Avant le ${formaterDate(ech.iso)}`;
return `${quand}${reste}${ech.libelle ? ` · ${ech.libelle}` : ""}.`;
}

/**
* LE GESTE QUI SUIT, nommé. Pas « complétez cette étape » : ce qu'il
* reste exactement à faire, tiré de l'état réel du dossier. C'est la
* seule chose qu'un étudiant bloqué cherche.
*/
function gesteQuiSuit(e) {
if (e.faite) return e.faitLe ? `C'est déjà fait (le ${formaterDate(e.faitLe)}).` : "C'est déjà fait.";
if (e.empechement) return e.empechement;
switch (e.kind) {
case "situation":
return (e.manquants || []).length
? `Il reste à répondre à : ${e.manquants.join(" · ")}.`
: "Répondez aux questions de l'étape, puis enregistrez.";
case "diagnostic":
return "Faites le diagnostic : Fitz compare ce dont vous disposez à ce qu'une année coûte, et vous dit ce qui manque, s'il manque quelque chose.";
case "voeux":
return "Posez au moins un vœu : l'établissement, la formation et le niveau — trois champs, Fitz s'occupe du reste.";
case "pieces": {
const restent = (e.pieces || []).filter((p) => !p.obtenue && !p.ecartee);
if (!restent.length) return "Toutes les pièces sont réglées.";
return `Il reste ${restent.length} pièce${restent.length > 1 ? "s" : ""} : ${restent.map((p) => p.nom).join(" · ")}. Une pièce qui ne vous concerne pas se met de côté avec « Ne me concerne pas » — elle compte comme réglée.`;
}
case "motivations": {
const restent = (e.voeux || []).filter((v) => !(v.motivation && v.motivation.faite === true));
if (!restent.length) return "";
const noms = restent.map((v) => v.university).filter(Boolean);
return `Lettre encore à recopier sur le portail pour : ${noms.length ? noms.join(" · ") : `${restent.length} vœu(x)`}.`;
}
case "reponses": {
const restent = (e.voeux || []).filter((v) => !["admise", "refusee", "liste_attente"].includes(v.status));
if (!restent.length) return "";
const noms = restent.map((v) => v.university).filter(Boolean);
return `Réponse encore à noter pour : ${noms.length ? noms.join(" · ") : `${restent.length} vœu(x)`}. Même un refus : c'est ce qui ouvre la suite.`;
}
case "visa": {
const v = e.visa || { faites: 0, total: 0 };
if (!e.cochee) return "Déposez votre demande de visa dès le courriel de fin de procédure, puis cochez-la ici.";
const reste = Math.max(0, (v.total || 0) - (v.faites || 0));
return reste ? `Il reste ${reste} démarche${reste > 1 ? "s" : ""} du départ sur ${v.total}.` : "";
}
default:
if (e.preuve && e.preuve.requise && !e.preuve.valeur) return `Faites l'étape sur le portail, puis notez ici ${e.preuve.libelle} : c'est ce qui la coche.`;
return "Faites l'étape sur le portail, puis cochez « C'est fait ».";
}
}

/**
* OÙ L'ON EST PAR RAPPORT À CETTE ÉTAPE. Un étudiant peut très bien
* demander de l'aide sur l'étape 13 alors que la route en est à la 4 :
* lui répondre « vous en êtes là » serait faux, et le laisser croire
* qu'il a sauté des étapes.
*/
function cadreDeLEtape(e) {
if (e.etat === "faite" || e.faite) return e.faitLe ? `Cette étape est déjà faite (le ${formaterDate(e.faitLe)}).` : "Cette étape est déjà faite.";
if (e.etat === "a-venir" && e.courant && e.courant.numero) return `Cette étape vient plus loin : vous en êtes à l'étape ${e.courant.numero}, « ${e.courant.titre} ».`;
return "Vous en êtes là.";
}

/**
* La réponse, en blocs séparés — le chat rend le markdown (le bloc des
* pièces le fait déjà avec `\n\n`). Un mur de texte sur un téléphone
* est une réponse qu'on ne lit pas : le geste qui suit doit sauter aux
* yeux, et le texte officiel rester dessous, entier et daté.
*/
function reponseDeLaRoute(e) {
const blocs = [cadreDeLEtape(e)];
if (e.enClair) blocs.push(e.enClair);

const geste = e.faite || e.etat === "faite" ? "" : gesteQuiSuit(e);
if (geste) blocs.push(`**Le geste qui suit** — ${geste}`);

// Les faits du pays : l'échéance, le montant, la mention d'absence.
const faits = [];
const ech = echeanceEnClair(e.echeance);
if (ech) faits.push(ech);
const o = e.officielle || null;
if (o && typeof o.montant === "number") faits.push(`${formatMontant(o.montant, o.devise)} à prévoir pour cette étape, dans votre pays.`);
if (o && o.mention) faits.push(o.mention);
if (faits.length) blocs.push(faits.join(" "));

if (o && o.titre && o.consigne) blocs.push(`**Ce que dit le portail, mot pour mot** — « ${o.titre} » : ${o.consigne}`);

return {
resolu: true,
titre: `Étape ${e.numero} sur ${e.total || 15} : ${e.titre}`,
texte: `${blocs.join("\n\n")}${o ? sourceDatee(o.source, o.verifieLe) : ""}`,
source: (o && o.source) || null,
verifieLe: (o && o.verifieLe) || null,
lien: `espace-preinscription.html?etape=${encodeURIComponent(e.id)}`,
cta: `Ouvrir l'étape ${e.numero}`
};
}

const DIAGNOSTICS = {

// « cet outil est fermé » — nommer la formule qui l'ouvre. Calculé,
// donc gratuit : c'est la conversation qui est réservée, pas le
// diagnostic (règle d'honnêteté b).
verrou(blocage, c) {
const feature = blocage.feature || "ai_chat";
const flags = c.featureFlags && c.featureFlags[feature];
if (!flags) return { resolu: false, texte: `Je ne connais pas l'outil « ${feature} ».` };
const ferme = decideVerrou({ planId: c.planId || "gratuit", planPreinscriptionId: c.planPreinscriptionId || "", featureFlags: c.featureFlags, featureKey: feature, testerAccess: c.testerAccess === true, hasFitzExpress: c.hasFitzExpress === true });
const outil = nomOutil(feature);
if (!ferme) {
return { resolu: true, titre: outil, texte: `« ${outil} » est ouvert à votre formule. Si la page ne s'ouvre pas, rechargez-la : votre accès vient peut-être d'être activé.` };
}
const espace = c.parcours === "preinscription" ? "preinscription" : "bourse";
// Deux formules au plus, aux libellés distincts : « Essentiel ou
// Essentiel ou Ambition ou Premium… » est une liste, pas une réponse.
const formules = unlockingPlans(c.planId || "gratuit", flags, espace)
.filter((id, i, tous) => tous.findIndex((x) => libelleFormule(x) === libelleFormule(id)) === i)
.slice(0, 2);
const premiere = formules[0];
return {
resolu: true,
titre: outil,
texte: premiere
? `« ${outil} » n'est pas compris dans votre formule actuelle (${libelleFormule(c.planPreinscriptionId && espace === "preinscription" ? c.planPreinscriptionId : (c.planId || "gratuit"))}). Il s'ouvre avec ${formules.map(libelleFormule).join(" ou ")}. Rien d'autre ne le bloque : ni votre profil, ni votre dossier.`
: `« ${outil} » n'est ouvert par aucune formule en vente aujourd'hui.`,
formule: premiere || "",
lien: premiere ? `offers.html?parcours=${espace}#${premiere}` : "offers.html"
};
},

// « je ne peux pas générer ma lettre » — nommer ce qui manque.
prerequis(blocage, c) {
const etape = etapeDe(c, blocage.etape) || (Array.isArray(c.etapes) ? qualifierEtapes(c.etapes).find((e) => e.etat === "prematuree") : null);
if (!etape) return { resolu: false, texte: "Je ne vois aucune étape bloquée par un prérequis sur ce dossier. Dites-moi laquelle vous voulez franchir." };
if (etape.etat === "faite") return { resolu: true, titre: etape.label, texte: `« ${etape.label} » est déjà faite sur ce dossier.` };
if (etape.etat !== "prematuree") return { resolu: true, titre: etape.label, texte: `Rien ne bloque « ${etape.label} » : tous ses prérequis sont faits. Vous pouvez la commencer maintenant.` };
const manquants = (etape.bloqueParLibelles || etape.bloquePar.map((id) => LIBELLE_PREREQUIS[id] || id));
return {
resolu: true,
titre: etape.label,
texte: `« ${etape.label} » attend ${manquants.join(" et ")}. ${etape.consequence || ""}`.trim(),
manquants: etape.bloquePar
};
},

// « je ne sais pas quoi faire » — LA prochaine action, calculée par la
// même fonction que le tableau de bord (test anti-divergence).
quoi_faire(blocage, c) {
// SUR LA ROUTE, LA PROCHAINE ACTION EST L'ÉTAPE OÙ L'ON EST — pas
// celle du tableau de bord (lot R9). Hors de la route, rien ne change :
// `prochaineAction` reste la source, et le test anti-divergence aussi.
if (c.etapeRoute) return reponseDeLaRoute(c.etapeRoute);
const action = prochaineAction({
profileScore: c.profileScore || 0,
applications: c.applications || [],
opportunitesCount: c.opportunitesCount || 0,
aujourdhui: c.aujourdhui || new Date()
});
return {
resolu: true,
titre: action.titre,
texte: `${action.titre} — ${action.texte}`,
action,
lien: action.href,
cta: action.cta
};
},

// « quels documents ? » — les exigences de la bourse, ce qui manque au
// dossier, et pour chaque pièce la fiche (où l'obtenir, délai, validité).
documents(blocage, c) {
const bourse = c.bourse || null;
const codes = lireExigences(bourse);
const app = c.app || {};
if (!codes.length) {
return {
resolu: false,
texte: bourse
? "Le catalogue ne porte pas encore les exigences de cette bourse : je ne peux pas vous dire ce qu'elle demande sans l'inventer. Vérifiez la liste des pièces sur son site officiel, et ajoutez-les à votre dossier ici."
: "Ce dossier n'est pas lié à une bourse du catalogue : je ne connais pas ses exigences. Liez-le depuis « Mes candidatures », ou vérifiez la liste des pièces sur le site officiel."
};
}
const g = groupees(codes);
const manquants = elementsAAjouter(codes, app.checklist);
const lignes = [];
if (g.piece.length || g.dossier.length) lignes.push(`Ce que cette bourse demande : ${[...g.piece, ...g.dossier].map((e) => e.libelle).join(", ")}.`);
if (g.condition.length) lignes.push(`Conditions : ${g.condition.map((e) => e.libelle).join(", ")}.`);
lignes.push(manquants.length
? `Il manque à votre dossier : ${manquants.map((m) => m.label).join(", ")}.`
: "Tout ce qu'elle demande est déjà dans votre dossier.");
// Les fiches : où l'obtenir, en combien de temps, valable combien.
const fiches = [];
for (const item of [...(app.checklist || []), ...manquants]) {
const cle = String(item.label || "").toLowerCase();
const fiche = (c.fichesDocuments || []).find((d) => cle.includes(d.title.toLowerCase()) || (item.type && slugDocument(d.title).includes(String(item.type).replace("_", "-"))));
if (fiche && !fiches.some((f) => f.title === fiche.title)) fiches.push(fiche);
}
for (const f of fiches.slice(0, 3)) {
lignes.push(`**${f.title}** — ${f.howToObtain} Délai : ${f.averageTime} Validité : ${f.validity}`);
}
return { resolu: true, titre: "Les pièces de ce dossier", texte: lignes.join("\n\n"), manquants: manquants.map((m) => m.type) };
},

// « je ne comprends pas cette étape » — la consigne telle que la page la
// rend, AVEC sa source et sa date.
etape(blocage, c) {
// La route d'abord : ses quinze étapes portent les quatre qui
// n'existent pas dans la procédure du portail (situation, ressources,
// vœux, pièces), et la procédure ne les connaîtrait pas.
if (c.etapeRoute) return reponseDeLaRoute(c.etapeRoute);
const etape = etapeDe(c, blocage.etape);
const p = etape && etape.procedure;
if (!p) return { resolu: false, texte: "Je ne trouve pas cette étape dans la procédure de ce dossier. Dites-moi ce que vous essayez de faire." };
const lignes = [texteConsigne(p)];
if (p.echeanceISO) {
const jours = joursRestants(p.echeanceISO, c.aujourdhui || new Date());
lignes.push(`${p.echeanceDebut ? "À partir du" : "Jusqu'au"} ${formaterDate(p.echeanceISO)}${jours !== null && !p.echeanceDebut ? (jours < 0 ? " — c'est dépassé" : jours === 0 ? " — c'est aujourd'hui" : ` — dans ${jours} jour${jours > 1 ? "s" : ""}`) : ""}.`);
}
if (Array.isArray(p.pieces) && p.pieces.length) lignes.push(`Pièces : ${p.pieces.map((x) => x.nom).join(", ")}.`);
if (etape.etat === "prematuree") lignes.push(`À faire après ${(etape.bloqueParLibelles || etape.bloquePar).join(" et ")}.`);
if (p.mention) lignes.push(p.mention);
return {
resolu: true,
titre: etape.label,
texte: `Vous êtes bloqué à l'étape *${etape.label}*. ${lignes.join(" ")}${sourceDatee(p.source, p.verifieLe)}`,
source: p.source || null,
verifieLe: p.verifieLe || null
};
},

// « où et quand payer ? » — la couche de résidence : banque, montant,
// devise, moment exact. JAMAIS une valeur en dur : le test béninois
// contre le sénégalais le prouve.
paiement(blocage, c) {
const procedure = c.procedure || null;
const etape = procedure && Array.isArray(procedure.etapes) ? procedure.etapes.find((e) => e.type === "paiement") : null;
const fait = procedure && procedure.faits && procedure.faits.fraisDossier;
if (!procedure || !etape) return { resolu: false, texte: "Ce dossier n'a pas de procédure de portail rattachée : je ne connais ni le montant ni le guichet de votre pays. Renseignez votre pays de résidence dans votre profil." };
if (!procedure.residenceDocumentee || !fait) {
return {
resolu: true,
titre: etape.titre,
texte: `Votre pays de résidence n'est pas encore documenté : je ne connais ni le montant, ni la banque, ni le moment du paiement chez vous, et je ne vais pas les deviner. La règle qui vaut partout : ne payez jamais avant la demande officielle de paiement de votre espace Campus France.${sourceDatee(etape.source, etape.verifieLe)}`,
source: etape.source || null,
verifieLe: etape.verifieLe || null
};
}
const montant = formatMontant(fait.montant, fait.devise);
return {
resolu: true,
titre: etape.titre,
texte: `Vous êtes bloqué à l'étape *${etape.titre}*. ${texteConsigne(etape)} Montant : **${montant}**.${sourceDatee(etape.source || fait.source, etape.verifieLe || fait.verifieLe)}`,
montant: fait.montant,
devise: fait.devise,
source: etape.source || fait.source || null,
verifieLe: etape.verifieLe || fait.verifieLe || null
};
},

// « c'est quand la date limite ? » — analyserEcheance sur la date de la
// candidature, ou les jalons de la campagne.
echeance(blocage, c) {
const app = c.app || {};
const aujourdhui = c.aujourdhui || new Date();
if (app.deadline) {
// La candidature porte une date ISO (le formulaire l'écrit ainsi), que
// applications.js lit avec joursRestants ; un texte français
// (« 15 janvier 2027 », « candidatures closes ») passe par
// analyserEcheance. Même lecture que la page, dans le même ordre.
const brut = String(app.deadline);
const direct = /^\d{4}-\d{2}-\d{2}/.test(brut) ? joursRestants(brut.slice(0, 10), aujourdhui) : null;
const e = direct !== null ? { etat: "datee", date: brut.slice(0, 10) } : analyserEcheance(brut);
if (e.etat === "datee" && e.date) {
const jours = joursRestants(e.date, aujourdhui);
const quand = jours < 0 ? `dépassée depuis ${Math.abs(jours)} jour${Math.abs(jours) > 1 ? "s" : ""}` : jours === 0 ? "aujourd'hui" : `dans ${jours} jour${jours > 1 ? "s" : ""}`;
const ton = jours <= JOURS_CRITIQUE ? " C'est le moment de finir, pas de commencer autre chose." : jours <= JOURS_PROCHE ? " Il reste peu de temps : vérifiez le dossier cette semaine." : "";
return { resolu: true, titre: "Date limite", texte: `La date limite de ${app.university || "cette candidature"} est le ${formaterDate(e.date)} — ${quand}.${ton}`, jours };
}
if (e.etat === "close") return { resolu: true, titre: "Candidatures closes", texte: `Les candidatures de ${app.university || "cette bourse"} sont closes pour ce cycle. Ce que vous préparez pour elle serait préparé pour rien : voyez si un prochain cycle est annoncé.` };
if (e.etat === "continue") return { resolu: true, titre: "Au fil de l'eau", texte: `${app.university || "Cette candidature"} accepte les dossiers au fil de l'eau : pas de date limite, mais plus tôt vous déposez, plus tôt vous avez une réponse.` };
}
const jalons = Array.isArray(c.etapes) ? qualifierEtapes(c.etapes).filter((e) => e.procedure && e.procedure.echeanceISO) : [];
if (jalons.length) {
return { resolu: true, titre: "Les dates de votre campagne", texte: jalons.map((e) => `${e.label} : ${e.procedure.echeanceDebut ? "à partir du" : "jusqu'au"} ${formaterDate(e.procedure.echeanceISO)}`).join(" · ") };
}
if (c.procedure && c.procedure.absences && c.procedure.absences.calendrier) {
return { resolu: true, titre: "Aucune date publiée", texte: c.procedure.absences.calendrier };
}
return { resolu: false, texte: "Aucune date limite n'est enregistrée sur ce dossier, et le catalogue n'en connaît pas. Vérifiez-la sur le portail officiel, puis notez-la dans « Mes candidatures » : je pourrai alors compter les jours avec vous." };
},

// « je ne dépose pas moi-même ? » — 27 bourses concernées.
depot_tiers(blocage, c) {
const bourse = c.bourse || null;
const codes = lireExigences(bourse);
if (!bourse || !codes.length) return { resolu: false, texte: "Ce dossier n'est pas lié à une bourse du catalogue dont je connais la voie de dépôt. Vérifiez sur le site officiel qui dépose : vous, ou un établissement." };
const voie = groupees(codes).voie;
// « VOUS DÉPOSEZ VOUS-MÊME » NE VEUT PAS DIRE « SUR UN PORTAIL »
// (corrigé le 2026-09-14). La phrase promettait un portail et une
// confirmation de portail à tout le monde. Deux bourses se déposent
// par courriel ou par la poste : leur candidat cherchait un bouton
// « soumettre » qui n'existe pas, et une confirmation qui n'arrivera
// jamais. Les codes `depot_par_courriel` et `depot_par_courrier`
// disent la vraie voie ; on la répète ici plutôt que d'affirmer
// l'inverse.
if (!deposeParUnTiers(codes)) {
const horsPortail = voiesHorsPortail(codes);
if (horsPortail.length) {
return {
resolu: true,
titre: "Vous déposez vous-même, mais pas sur un portail",
texte: `Pour ${bourse.title || "cette bourse"}, ${horsPortail.map((v) => `${v.libelle.toLowerCase()} : ${v.explication}`).join(" ")} Votre preuve de dépôt, c'est donc votre envoi — gardez-en la trace.`
};
}
return { resolu: true, titre: "Vous déposez vous-même", texte: `Pour ${bourse.title || "cette bourse"}, c'est vous qui déposez, sur le portail officiel. Gardez la confirmation du portail : c'est votre preuve de dépôt.` };
}
return {
resolu: true,
titre: "Vous ne déposez pas vous-même",
texte: `Pour ${bourse.title || "cette bourse"}, ${voie.map((v) => `${v.libelle.toLowerCase()} : ${v.explication}`).join(" ")} Ce que vous surveillez change : ce n'est plus un bouton « soumettre », c'est l'accusé de réception de qui dépose pour vous.`,
parTiers: true
};
},

// « comment prouver mon dépôt ? » — les trois modes.
preuve(blocage, c) {
const app = c.app || {};
const codes = lireExigences(c.bourse || null);
const parTiers = deposeParUnTiers(codes);
const preuve = lirePreuve(app);
const valide = preuveValide(preuve, { parTiers, aujourdhui: c.aujourdhui || new Date() });
const modes = MODES.filter((m) => (parTiers ? m === "transmis" : m !== "transmis")).map((m) => LIBELLES_MODES[m] || m).join(" ou ");
return {
resolu: true,
titre: "La preuve de dépôt",
texte: valide
? `Votre preuve de dépôt est enregistrée${preuve.deposeLe ? ` (déposée le ${formaterDate(preuve.deposeLe)})` : ""}. Rien d'autre à fournir.`
: `${libelleDemande(app, { parTiers })} Modes acceptés : ${modes}. C'est cette preuve qui fait passer le dossier en « déposé » — sans elle, rien ne bouge, et c'est voulu.`
};
},

// « je n'ai pas de nouvelles » — le délai de réponse et l'état réel.
sans_reponse(blocage, c) {
const app = c.app || null;
const lignes = [`L'équipe FitzUniverse répond sous ${DELAI_REPONSE} par la messagerie.`];
if (app) {
const statut = app.status || "";
if (["deposee", "en_attente"].includes(statut)) {
lignes.push(`Votre dossier ${app.university ? `pour ${app.university} ` : ""}est déposé ; les établissements répondent sur leur portail, chacun selon son calendrier. Notez chaque réponse dans « Mes candidatures » : c'est elle qui ouvre l'étape suivante.`);
} else if (statut) {
lignes.push(`Votre dossier ${app.university ? `pour ${app.university} ` : ""}est encore en préparation : l'établissement ne répondra qu'après le dépôt.`);
}
}
return { resolu: true, titre: "Sans nouvelles", texte: lignes.join(" ") };
}

};

/**
* Le diagnostic d'un blocage. Rend TOUJOURS un objet ; `resolu` dit si
* le catalogue a réellement répondu (c'est le point d'accroche du
* modèle, plus tard).
*
* @param {{code:string, app?:string, etape?:string, feature?:string}} blocage
* @param {Object} contexte — voir js/fitz-recours-contexte.js
*/
export function diagnostiquer(blocage, contexte = {}) {
const code = blocage && CODES_BLOCAGE.includes(blocage.code) ? blocage.code : null;
if (!code) return { code: null, resolu: false, titre: "", texte: "" };
const c = { ...contexte, parcours: contexte.parcours || (contexte.app ? lireParcours(contexte.app) : "bourse") };
const diag = DIAGNOSTICS[code](blocage, c);
return { code, titre: "", ...diag };
}

/**
* Le message d'ouverture de Fitz : le diagnostic déjà fait, puis — s'il
* n'a pas su répondre, ou pour aller plus loin — le maillon suivant
* réellement ouvert au compte.
*/
export function messageDeFitz(diag, echelle = []) {
const parties = [];
if (diag && diag.texte) parties.push(diag.texte);
if (diag && !diag.resolu) {
parties.push("Ce cas dépasse ce que je sais aujourd'hui, et je ne vais pas improviser une consigne administrative.");
}
if (diag && diag.code === "verrou" && diag.lien && diag.formule) {
parties.push(`[Voir ${libelleFormule(diag.formule)}](${diag.lien})`);
}
if (echelle.length) {
const suivant = echelle[0];
parties.push(diag && diag.resolu
? `Si cela ne suffit pas : [${suivant.label}](${suivant.href}) — ${suivant.detail}`
: `Le mieux maintenant : [${suivant.label}](${suivant.href}) — ${suivant.detail}`);
} else if (diag && !diag.resolu) {
parties.push("Votre formule n'ouvre pas encore la messagerie : les formules d'accompagnement la comprennent toutes.");
}
return parties.join("\n\n");
}
