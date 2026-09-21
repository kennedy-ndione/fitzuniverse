/**
 * ============================================================
 * Tests — bloc « Votre situation face à cette bourse » et
 * verrouillage des portails de scholarship-details.html
 * (refonte du 2026-08-31)
 *
 * RÈGLE DIRECTRICE VÉRIFIÉE ICI : un visiteur non abonné ne reçoit
 * AUCUN lien réservé et AUCUNE mention qu'on lui refuse quelque chose.
 * On ne cache pas une porte fermée — on fait qu'il n'y ait pas de
 * porte. Le HTML de la page est lu tel quel pour vérifier que la
 * mention « réservé aux abonnés » et son cadenas ont bien disparu.
 *
 * Les trois fonctions de verdict sont extraites de details.js (module
 * navigateur : imports CDN Firebase, DOM) par le même procédé vm que
 * test/scholarship-funder.test.mjs — c'est le texte réellement
 * déployé qui est testé, pas une copie.
 *
 * Lancer : npm test   (ou : node --test test/)
 * ============================================================
 */

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import vm from "node:vm";

import { estEligible, paysAvecArticle } from "../js/eligibility-countries.js";
import { computeAge, respecteLimiteAge, libelleLimiteAge } from "../js/age-limits.js";
import { porteDeBourseDeLaFiche } from "../js/portails-opportunite.js";
import { isQuotaReached } from "../js/plan-features.js";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const sourceDetails = readFileSync(join(racine, "details.js"), "utf8");
const sourceHtml = readFileSync(join(racine, "scholarship-details.html"), "utf8");

// Extraction par équilibrage d'accolades, en sautant D'ABORD la liste
// de paramètres : plusieurs fonctions de ce bloc sont déstructurées
// (`function f({ session, university })`), et compter les accolades
// depuis la première rencontrée s'arrêtait sur celle des paramètres —
// l'extraction rendait alors une signature vide, et les tests
// passaient à côté du corps qu'ils croyaient vérifier.
function extraireFonction(source, nom) {

const debut = source.indexOf(`function ${nom}(`);
assert.notEqual(debut, -1, `function ${nom} introuvable dans details.js`);

// 1. Sauter la liste de paramètres, parenthèses équilibrées.
let i = source.indexOf("(", debut);
let parens = 0;
do {
if (source[i] === "(") parens++;
if (source[i] === ")") parens--;
i++;
} while (parens > 0 && i < source.length);

// 2. Le corps commence à la première accolade qui suit.
i = source.indexOf("{", i);
let profondeur = 0;
do {
if (source[i] === "{") profondeur++;
if (source[i] === "}") profondeur--;
i++;
} while (profondeur > 0 && i < source.length);

const corps = source.slice(debut, i);
assert.ok(corps.length > `function ${nom}()`.length + 10, `corps de ${nom} extrait vide`);
return corps;

}

// Le HTML est vérifié SANS ses commentaires : un commentaire qui
// explique pourquoi une mention a été supprimée n'est pas cette
// mention. Sans ce nettoyage, le test échouait sur sa propre note
// d'explication.
function htmlRendu(source) {
return source.replace(/<!--[\s\S]*?-->/g, "");
}

// Les fonctions extraites appellent les modules réels : on les injecte
// dans le contexte vm plutôt que de les simuler, pour que le test
// vérifie la vraie chaîne de décision.
const ctx = { estEligible, paysAvecArticle, computeAge, respecteLimiteAge, libelleLimiteAge };
vm.createContext(ctx);
for (const nom of ["verdictNationalite", "verdictAge", "messageRaisonsVides"]) {
vm.runInContext(`${extraireFonction(sourceDetails, nom)}\nthis.${nom} = ${nom};`, ctx);
}

// ============================================================
// 1. Un non-abonné ne voit aucun verrou — vérifié sur le HTML réel
// ============================================================

test("la mention « réservé aux abonnés » et son cadenas ont disparu de la page", () => {
const rendu = htmlRendu(sourceHtml);
assert.ok(!rendu.includes("réservé aux abonnés"), "la mention de verrou subsiste dans le HTML rendu");
assert.ok(!rendu.includes('id="applicationPortalLocked"'), "l'élément de verrou subsiste dans le HTML rendu");
assert.ok(!/data-lucide="lock"/.test(rendu), "une icône cadenas subsiste dans le HTML rendu");
});

test("details.js ne référence plus l'élément de verrou supprimé", () => {
assert.ok(!sourceDetails.includes("applicationPortalLocked"), "details.js référence encore applicationPortalLocked");
});

test("la phrase de confiance parle de l'accompagnement, jamais d'un lien caché", () => {
assert.ok(sourceHtml.includes("les informations de cette fiche restent gratuites"));
assert.ok(!sourceHtml.includes("cette information restera toujours gratuite"), "ancienne formulation encore présente");
});

// LE VERROU A CHANGÉ D'ENDROIT, PAS DE FORCE (2026-09-14).
// Ce test cherchait `!isPaidUser` DANS `configurerPortailBailleur`. La
// décision vit maintenant dans js/portails-opportunite.js, qui la prend
// pour la fiche ET pour le hub ; cette fonction ne fait plus que lui
// passer le droit d'accès et poser le résultat. On vérifie donc les
// deux moitiés : que le droit est bien transmis, et qu'il ferme bien.
test("le portail du bailleur est conditionné au droit d'accès, jamais au seul site de la bourse", () => {

const fn = extraireFonction(sourceDetails, "configurerPortailBailleur");

assert.match(fn, /abonne:\s*isPaidUser === true/,
"configurerPortailBailleur ne transmet plus le droit d'accès — ou le transmet sans le comparer à true");
assert.match(fn, /porteDeBourseDeLaFiche\(/,
"configurerPortailBailleur ne passe plus par la décision partagée");
assert.ok(!/\|\|\s*university\.scholarshipWebsite/.test(fn),
"le repli est de nouveau calculé ici : c'est une seconde définition");

// Et le verrou ferme réellement, sur les DEUX valeurs — un non-abonné
// ne reçoit ni le portail de dépôt ni le site du bailleur.
const ferme = porteDeBourseDeLaFiche({
portailConfirme: "https://apply.example/",
siteDeLaBourse: "https://info.example/",
entryPoint: "bourse",
abonne: false
});

assert.equal(ferme.url, "");
assert.equal(ferme.visible, false);

});

test("la section « situation » est masquée par défaut dans le HTML — invisible sans abonnement", () => {
assert.match(htmlRendu(sourceHtml), /id="situationSection"[^>]*hidden/, "situationSection n'est pas hidden par défaut");
});

// RÈGLE CHANGÉE LE 2026-09-21, et le test avec elle. Ce test exigeait
// que le bloc entier soit réservé aux abonnés. Il se sépare désormais en
// une LECTURE, gratuite pour tout compte connecté (verdicts, raisons —
// de l'information sur la bourse, calculée sans IA), et des ACTIONS,
// réservées aux abonnés. Ce qu'on ne desserre pas : un visiteur ne voit
// rien, et un compte sans formule ne lit AUCUNE mention de refus.
test("la situation se lit pour tout compte connecté ; les actions restent aux abonnés", () => {
assert.match(sourceDetails, /if \(session\) \{\s*await rendreSituation\(\{[\s\S]{0,160}actions: isPaidUser\s*\}\);/,
"la situation doit être rendue pour une session, avec les actions conditionnées à l'abonnement");
assert.match(sourceDetails, /if \(actions\) \{\s*await brancherActionsSituation\(/,
"les actions ne doivent être branchées que pour un abonné");
// Le paramètre vaut `true` par défaut : un appelant qui l'oublie ne
// retire rien à un abonné.
assert.match(sourceDetails, /async function rendreSituation\(\{[^}]*actions = true \}\)/);
});

test("le bloc des portails porte un id, pour pouvoir être masqué entièrement", () => {
assert.ok(htmlRendu(sourceHtml).includes('id="portalBlock"'));
assert.match(sourceDetails, /blocPortails\.hidden = liensVisibles\.length === 0/);
});

// ============================================================
// 2. Verdict nationalité — null n'est JAMAIS « oui »
// ============================================================

test("nationalité éligible -> verdict favorable nommant le pays", () => {
const v = ctx.verdictNationalite({ scope: "groupes", groups: ["afrique"] }, "Sénégal");
assert.equal(v.ton, "favorable");
assert.match(v.texte, /Ouverte à votre nationalité \(Sénégal\)/);
});

test("nationalité exclue -> verdict défavorable, sans blocage", () => {
const v = ctx.verdictNationalite({ scope: "groupes", groups: ["commonwealth"] }, "Sénégal");
assert.equal(v.ton, "defavorable");
assert.match(v.texte, /Fermée aux ressortissants/);
});

test("RÈGLE : un inconnu (null) ne devient JAMAIS « vous êtes éligible »", () => {
// Champ eligibility absent : estEligible renvoie null.
const v = ctx.verdictNationalite(null, "Sénégal");
assert.equal(v.ton, "neutre");
assert.equal(v.texte, "Aucune restriction de nationalité connue pour cette bourse");
assert.ok(!/éligible|Ouverte à votre nationalité/i.test(v.texte));
});

test("nationalité absente du profil -> invitation avec lien vers le profil", () => {
const v = ctx.verdictNationalite({ scope: "monde" }, "");
assert.equal(v.ton, "invitation");
assert.equal(v.lien, "profile.html");
});

// ============================================================
// 3. Verdict âge — null ne rend RIEN
// ============================================================

function naissanceIlYA(n) {
return `${new Date().getFullYear() - n}-01-01`;
}

test("RÈGLE : aucune limite connue -> rien du tout, jamais « aucune limite »", () => {
assert.equal(ctx.verdictAge(null, naissanceIlYA(30), "Master"), null);
assert.equal(ctx.verdictAge({}, naissanceIlYA(30), "Master"), null);
});

test("dans les limites -> verdict favorable avec le libellé", () => {
const v = ctx.verdictAge({ tous: 35 }, naissanceIlYA(30), "Master");
assert.equal(v.ton, "favorable");
assert.match(v.texte, /Dans les limites d'âge \(35 ans\)/);
});

test("au-delà du plafond -> avertissement, sans blocage", () => {
const v = ctx.verdictAge({ tous: 26 }, naissanceIlYA(40), "Master");
assert.equal(v.ton, "defavorable");
assert.match(v.texte, /Au-delà du plafond \(26 ans\)/);
});

test("limite connue mais date de naissance absente -> invitation", () => {
const v = ctx.verdictAge({ tous: 26 }, "", "Master");
assert.equal(v.ton, "invitation");
assert.equal(v.lien, "profile.html");
});

test("limite existante mais niveau sans plafond applicable -> rien (inconnu)", () => {
// ageMax.licence seulement, programme de Master : respecteLimiteAge
// renvoie null, donc aucun verdict.
assert.equal(ctx.verdictAge({ licence: 25 }, naissanceIlYA(30), "Master"), null);
});

// ============================================================
// 4. Raisons vides et quota
// ============================================================

test("explainMatch vide -> message d'invitation, jamais un bloc vide", () => {
assert.match(ctx.messageRaisonsVides([]), /pas encore assez d'éléments/);
assert.match(ctx.messageRaisonsVides(undefined), /pas encore assez d'éléments/);
});

test("explainMatch non vide -> aucun message, on affiche les raisons", () => {
assert.equal(ctx.messageRaisonsVides(["Candidatures actuellement ouvertes"]), null);
});

test("quota atteint -> pas de création possible ; quota libre -> création permise", () => {
assert.equal(isQuotaReached(3, 3), true);
assert.equal(isQuotaReached(3, 2), false);
assert.equal(isQuotaReached(Infinity, 99), false);
});

test("details.js vérifie le quota AVANT de proposer la création", () => {
const fn = extraireFonction(sourceDetails, "brancherActionsSituation");
assert.match(fn, /isQuotaReached\(quota, candidatures\.length\)/);
// Le bouton n'est révélé qu'après ce test.
assert.ok(fn.indexOf("isQuotaReached") < fn.indexOf("addBtn.hidden = false"), "le quota doit être vérifié avant de montrer le bouton");
});

test("une candidature déjà existante ne crée pas de doublon et renvoie vers le parcours", () => {
const fn = extraireFonction(sourceDetails, "brancherActionsSituation");

// On isole la BRANCHE de sortie anticipée plutôt que de comparer des
// positions de chaînes dans tout le corps : un simple commentaire
// citant le nom d'une fonction suffisait à fausser cette comparaison.
const branche = fn.slice(fn.indexOf("if (existante)"), fn.indexOf("const plan ="));
assert.ok(branche.length > 0, "branche `if (existante)` introuvable");

assert.match(branche, /Déjà dans votre parcours/);
assert.match(branche, /applications\.html/);
assert.match(branche, /return;/, "la branche doit sortir avant toute création");
assert.ok(!branche.includes("createApplicationFromRecommendation("), "aucune création ne doit avoir lieu quand la candidature existe déjà");
});

test("la lettre passe par ?applicationId= — aucune logique de ai-letter.js dupliquée", () => {
const fn = extraireFonction(sourceDetails, "brancherActionsSituation");
assert.match(fn, /ai-letter\.html\?applicationId=/);
});

test("le drapeau `applications` gouverne le bouton de parcours", () => {
const fn = extraireFonction(sourceDetails, "brancherActionsSituation");
assert.match(fn, /isFeatureLocked\(session\.planId, flags, "applications"/);
});
