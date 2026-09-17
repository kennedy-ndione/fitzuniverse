/**
* ============================================================
* test/pre-fitz.test.mjs — les outils Fitz de l'espace préinscription
* ============================================================
*
* UN CLIENT QUI PAYAIT CINQ FOIS PLUS RECEVAIT CINQ OUTILS DE MOINS.
* `premier-dossier` (15 000 F) ouvrait les cinq outils Fitz ;
* `dossier-france` (75 000 F) n'en ouvrait aucun — décision prise AVANT
* que la procédure soit documentée. Campus France demande pourtant une
* lettre de quatre à cinq lignes PAR VŒU (étape des vœux, vérifiée le
* 2026-09-08). Ce lot ouvre les verrous ET fait parler les outils
* « préinscription » — sans quoi ils produiraient du contenu de bourse,
* pire que des outils absents.
*
* Et il corrige un défaut plus grave, latent tant que MODE = "simule" :
* functions/fitz.js ne lisait jamais `planPreinscription`, et sa liste
* de formules ignorait les DEUX formules bourse en vente (essentiel-4,
* conseiller-6). Le jour de la bascule, un client à 45 000 ou 150 000 F
* se serait vu refuser Fitz. Le miroir a désormais son test.
*
* Fins de ligne : tout fichier lu ici passe par .replace(/\r\n/g,"\n").
* ============================================================
*/

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import vm from "node:vm";

import {
PLAN_ORDER,
PLAN_PREINSCRIPTION_ORDER,
DEFAULT_FEATURE_CONFIG,
PREINSCRIPTION_FEATURE_CONFIG,
resolveFeatureFlags,
decideVerrou,
espaceAutorise,
ESPACE_OUTILS
} from "../js/plan-features.js";

import * as ROUTE from "../js/route-preinscription.js";
import { buildPrompt } from "../js/ai/prompts.js";
import { generateMotivationLetter, generateLettreDeVoeu, computeApplicationReadiness, generateChatReply, typesEmailPour, getSuggestedQuestions, EMAIL_TYPES } from "../js/ai/simulated-responses.js";
import { lireParcoursDeSaisie, parcoursDOutil, paysDuVoeu, degreDuVoeu, PAYS_PREINSCRIPTION } from "../js/parcours.js";

const require = createRequire(import.meta.url);
const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(racine, f), "utf8").replace(/\r\n/g, "\n");

const { FORMULES_AVEC_FITZ, PLAFONDS, formuleActive, plafondsDe } = require(join(racine, "functions/lib/fitz-acces.js"));

const OUTILS = ["ai_chat", "ai_letter", "ai_check", "ai_email", "ai_translate"];
const flags = resolveFeatureFlags(null);

const OFFRES = (() => {
const bac = { window: {} };
bac.window.window = bac.window;
vm.createContext(bac);
vm.runInContext(lire("pricing-plans.js"), bac);
return bac.window.SCHOLARBRIDGE_PLANS;
})();

const PROFIL = { firstName: "Awa", lastName: "Diallo", nationality: "Sénégal", country: "Sénégal", lastDegree: "Licence", desiredField: "Informatique", desiredDegree: "Master", languages: ["Français"] };
const CIBLE = { university: "Université de Bordeaux", program: "Master Informatique", level: "Master", country: "France", profile: PROFIL, experiences: "deux stages en développement", motivations: "le parcours génie logiciel", goals: "devenir ingénieure logiciel" };

// ------------------------------------------------------------------
// 1. LES VERROUS — 3 offres × 5 outils
// ------------------------------------------------------------------

test("decideVerrou : diagnostic-france fermé partout, les deux Dossiers France ouverts sur les cinq outils", () => {
for (const outil of OUTILS) {
assert.equal(decideVerrou({ planId: "gratuit", planPreinscriptionId: "diagnostic-france", featureFlags: flags, featureKey: outil }), true, `diagnostic-france / ${outil} doit rester fermé : c'est un pass de diagnostic`);
assert.equal(decideVerrou({ planId: "gratuit", planPreinscriptionId: "dossier-france", featureFlags: flags, featureKey: outil }), false, `dossier-france / ${outil}`);
assert.equal(decideVerrou({ planId: "gratuit", planPreinscriptionId: "dossier-france-conseiller", featureFlags: flags, featureKey: outil }), false, `dossier-france-conseiller / ${outil}`);
}
// Et la grille elle-même le dit, outil par outil.
for (const outil of OUTILS) {
assert.equal(PREINSCRIPTION_FEATURE_CONFIG[outil]["diagnostic-france"], false, outil);
assert.equal(PREINSCRIPTION_FEATURE_CONFIG[outil]["dossier-france"], true, outil);
assert.equal(PREINSCRIPTION_FEATURE_CONFIG[outil]["dossier-france-conseiller"], true, outil);
}
});

test("un compte SANS formule bourse et avec dossier-france n'est verrouillé sur aucun des cinq — l'union des deux grilles", () => {
// planId "gratuit" : la grille bourse dit false partout. C'est l'offre
// préinscription seule qui ouvre.
for (const outil of OUTILS) {
assert.equal(DEFAULT_FEATURE_CONFIG[outil].gratuit, false, outil);
assert.equal(decideVerrou({ planId: "gratuit", planPreinscriptionId: "dossier-france", featureFlags: flags, featureKey: outil }), false, outil);
}
// Sans offre préinscription, le même compte reste fermé : l'ouverture
// vient bien du Dossier France, pas d'une erreur de grille bourse.
for (const outil of OUTILS) {
assert.equal(decideVerrou({ planId: "gratuit", planPreinscriptionId: "", featureFlags: flags, featureKey: outil }), true, outil);
}
});

test("le commentaire de la grille dit POURQUOI la règle a changé, avec sa source et sa date", () => {
const pf = lire("js/plan-features.js");
const bloc = pf.slice(pf.indexOf("Les DROITS DES OFFRES PRÉINSCRIPTION"), pf.indexOf("export const PREINSCRIPTION_FEATURE_CONFIG"));
// L'ancienne phrase peut être CITÉE (« Jusqu'ici : … ») — c'est même ce
// qui empêchera de la remettre — mais elle ne doit plus être la règle :
// chaque occurrence est précédée de la citation qui la périme.
const ancienne = /aucun outil Fitz \(le parcours n'a pas d'étape Fitz\)/g;
for (const m of bloc.matchAll(ancienne)) {
assert.match(bloc.slice(Math.max(0, m.index - 60), m.index), /Jusqu'ici :/, "l'ancienne phrase n'est tolérée qu'en citation");
}
assert.match(bloc, /CINQ OUTILS FITZ/, "la nouvelle règle doit être écrite en clair");
assert.match(bloc, /quatre à cinq lignes/);
assert.match(bloc, /2026-09-08/);
assert.match(bloc, /ivoire\.campusfrance\.org/);
assert.match(bloc, /NE PAS « re-corriger »/);
});

// ------------------------------------------------------------------
// 2. L'ESPACE — un client préinscription n'est plus ramené chez lui
// ------------------------------------------------------------------

test("les pages d'outils appartiennent aux deux espaces", () => {
assert.equal(ESPACE_OUTILS, "outils");
for (const espace of ["bourse", "preinscription", "les-deux"]) {
assert.equal(espaceAutorise(espace, ESPACE_OUTILS), true, espace);
}
// Une page bourse reste fermée à un client préinscription : la règle du
// lot S4 tient, seuls les outils ont changé de nature.
assert.equal(espaceAutorise("preinscription", "bourse"), false);
for (const f of ["ai-letter.js", "ai-check.js", "ai-email.js", "ai-translate.js", "ai-chat.js", "interview-prep.js"]) {
assert.match(lire(f), /espace: ESPACE_OUTILS/, f);
}
// espaceCourant ne prend pas « outils » pour un espace où l'on se trouve.
assert.match(lire("js/app-shell.js"), /if \(espacePage && espacePage !== ESPACE_OUTILS\) return espacePage;/);
});

test("la route préinscription ouvre chaque outil Fitz depuis l'étape qui lui donne un sens", () => {
// LOT R1 (2026-09-17) : les outils vivent dans js/route-preinscription.js,
// attachés à une étape — plus dans une boîte à outils du HTML.
const { ETAPES_ROUTE } = ROUTE;
const outilsDe = (id) => (ETAPES_ROUTE.find((e) => e.id === id) || { outils: [] }).outils.map((o) => `${o.feature}:${o.href}`);
assert.deepEqual(outilsDe("ressources"), ["diagnostic_france:diagnostic-france.html"]);
assert.deepEqual(outilsDe("pieces"), ["compress:compress.html", "ai_translate:ai-translate.html"]);
assert.deepEqual(outilsDe("ef_pieces"), ["ai_translate:ai-translate.html"]);
assert.deepEqual(outilsDe("ef_soumission"), ["ai_check:ai-check.html"]);
assert.deepEqual(outilsDe("ef_entretien"), ["interview_prep:interview-prep.html"], "la préparation à l'entretien, vendue avec le Dossier France, a enfin sa porte");
assert.deepEqual(outilsDe("ef_confirmation"), ["ai_email:ai-email.html"]);
// La lettre : une par vœu, depuis l'étape des motivations, avec le vœu.
const moteur = lire("espace-preinscription.js");
assert.match(moteur, /ai-letter\.html\?applicationId=\$\{encodeURIComponent\(v\.id\)\}/);
assert.match(moteur, /<span data-feature="ai_letter">/);
});

test("LA CANDIDATURE DICTE LA CIBLE : pays, formation et niveau viennent du vœu, pas du profil", () => {
// CE QUI S'EST PASSÉ, mesuré en ligne le 2026-09-17 pendant la recette
// de la route : depuis l'étape 8, « Écrire avec Fitz » ouvrait la lettre
// d'un vœu à l'Université de Lille avec « Pays visé : Chine » — le
// premier pays souhaité d'un profil de test. Le préremplissage par le
// profil gagnait contre la candidature affichée.
//
// Preuve par mutation (2026-09-17) : `fieldProgram.value = formation`
// remis en `fieldProgram.value || formation` → ce test rouge ; la ligne
// `country: PAYS_PREINSCRIPTION` retirée du payload → rouge.
//
// La constante vit dans js/parcours.js (7 Ko, déjà importé par les trois
// outils) et NON dans js/route-preinscription.js : l'importer de là
// coûterait 75 Ko aux pages d'outils — la route, le référentiel des pays,
// la carte du parcours, le vocabulaire — pour une chaîne de six lettres.
assert.equal(PAYS_PREINSCRIPTION, "France");
assert.ok(!/PAYS_DESTINATION =/.test(lire("js/route-preinscription.js")), "la constante est redéclarée dans la route");
assert.ok(!("PAYS_DESTINATION" in ROUTE), "la route exporte encore un second nom pour la même chose");

// Le vœu PORTE sa destination — sinon aucune page d'outil ne peut la
// connaître sans importer les 300 Ko de js/procedures.
const moteur = lire("espace-preinscription.js");
assert.match(moteur, /country: PAYS_PREINSCRIPTION,/, "la création d'un vœu n'écrit plus sa destination");
assert.match(moteur, /applications", v\.id\), \{ country: PAYS_PREINSCRIPTION \}/, "le rattrapage des vœux d'avant le lot a disparu");

// SANS CANDIDATURE, C'EST L'ESPACE QUI DIT LA DESTINATION. Vu en ligne
// le 2026-09-17 : le lien de l'étape 13 vers l'outil de courriel ne
// portait aucun vœu, et la page s'ouvrait sur « Pays visé : Chine » —
// `preferredCountries`, une préférence de parcours BOURSES.
for (const page of ["ai-letter.js", "ai-email.js"]) {
const src = lire(page);
assert.match(src, /if \(parcoursDOutil\(\{ espace: ctx\.espace \}\) === "preinscription"\) fieldCountry\.value = PAYS_PREINSCRIPTION;/, `${page} : l'espace ne dit pas la destination`);
// L'ORDRE COMPTE : le vœu repasse après et gagne.
assert.ok(
src.indexOf("fieldCountry.value = PAYS_PREINSCRIPTION") < src.indexOf("if (application) applyApplicationContext(application);"),
`${page} : le pays de l'espace écraserait celui du vœu`
);
}

// paysDuVoeu ne DEVINE jamais : pas de pays écrit, pas de pays rendu.
assert.equal(paysDuVoeu({ country: "France" }), "France");
assert.equal(paysDuVoeu({ country: "  Roumanie " }), "Roumanie");
assert.equal(paysDuVoeu({ university: "Lille" }), "", "sans pays écrit, l'outil garde ce que le profil disait");
assert.equal(paysDuVoeu(null), "");

// degreDuVoeu : les trois valeurs des sélecteurs, et rien d'autre.
const attendu = { "Licence 1": "Licence", "Licence 3": "Licence", "BUT": "Licence", "Architecture": "Licence", "Master 1": "Master", "Master 2": "Master", "Doctorat": "Doctorat" };
for (const niveau of ROUTE.NIVEAUX_VOEU) {
assert.equal(degreDuVoeu({ niveau }), attendu[niveau] || "Licence", `niveau « ${niveau} » mal traduit`);
}
assert.equal(degreDuVoeu({ niveau: "Prépa intégrée" }), "", "un niveau inconnu ne doit pas inventer un diplôme");
assert.equal(degreDuVoeu({}), "");

// Les deux outils réécrivent la cible, sans condition sur l'ancienne
// valeur : c'est la candidature qui sait où l'on écrit.
for (const page of ["ai-letter.js", "ai-email.js"]) {
const src = lire(page);
assert.match(src, /paysDuVoeu/, `${page} ne lit pas la destination du vœu`);
assert.match(src, /const pays = paysDuVoeu\(app\);\nif \(pays\) fieldCountry\.value = pays;/, `${page} : la destination ne gagne pas`);
assert.ok(!/fieldCountry\.value = fieldCountry\.value \|\|/.test(src), `${page} garderait le pays du profil`);
}
const lettre = lire("ai-letter.js");
assert.match(lettre, /fieldProgram\.value = formation;/, "ai-letter garde le domaine du profil contre la formation du vœu");
assert.match(lettre, /const degre = degreDuVoeu\(app\);\nif \(degre\) fieldLevel\.value = degre;/, "ai-letter garde le diplôme du profil contre le niveau du vœu");
});

test("UN SEUL ENDROIT APPLIQUE LE CONTEXTE d'une candidature — le chargement et le sélecteur passent par la même fonction", () => {
// CE QUI S'EST PASSÉ, deux fois au même endroit. `ai-letter.js` et
// `ai-email.js` avaient DEUX chemins : `applyApplicationContext()` pour
// le changement de sélecteur, et un bloc écrit à la main pour l'arrivée
// par `?applicationId=` — le chemin que LA ROUTE EMPRUNTE (« Écrire avec
// Fitz » à l'étape 8). Ce bloc ne posait que l'université.
//   - lot R2 : le garde « Candidature à la bourse X » manquait dans ce
//     bloc ; un vœu de préinscription l'affichait donc quand même ;
//   - lot R4 : le correctif « la candidature dicte la cible » a été
//     déployé dans la fonction, et la page a continué d'annoncer
//     « Pays visé : Chine » pour un vœu à Lille (mesuré en ligne le
//     2026-09-17, après déploiement).
// Le second chemin est supprimé, pas corrigé une troisième fois.
//
// Preuves par mutation (2026-09-17) : l'appel du chargement retiré →
// rouge ; `fieldUniversity.value = application.university` réintroduit
// hors de la fonction → rouge ; l'appel remonté au-dessus de
// `let currentText` → rouge (c'est une ReferenceError de zone morte en
// production, invisible pour un test qui ne charge pas la page).
for (const page of ["ai-letter.js", "ai-email.js"]) {
const src = lire(page);

// La fonction existe, et elle est le SEUL endroit qui pose la cible.
assert.match(src, /function applyApplicationContext\(app\) \{/, page);
const poses = [...src.matchAll(/fieldUniversity\.value = /g)].length;
assert.equal(poses, 1, `${page} : ${poses} endroits posent l'université destinataire`);

// Elle est appelée DEUX fois : le sélecteur, et la candidature de l'URL.
const appels = [...src.matchAll(/^applyApplicationContext\(app\);$|^if \(application\) applyApplicationContext\(application\);$/gm)].length;
assert.equal(appels, 2, `${page} : ${appels} appels au lieu de deux (sélecteur + chargement)`);
assert.match(src, /^if \(application\) applyApplicationContext\(application\);$/m, `${page} : l'arrivée par ?applicationId= n'applique pas le contexte`);

// Et le verrou d'université ne se pose plus à la main à côté.
assert.ok(!/verrouillerUniversite\(application\)/.test(src), `${page} : un second chemin pose encore le verrou`);
}

// LE PIÈGE DE ZONE MORTE, pinné parce qu'il ne casse qu'en production.
// applyApplicationContext() de ai-letter.js finit par appliquerMode(),
// qui lit `currentText`. L'appel doit donc venir APRÈS sa déclaration.
const lettre = lire("ai-letter.js");
assert.ok(
lettre.indexOf("let currentText") < lettre.indexOf("if (application) applyApplicationContext(application);"),
"ai-letter : l'appel passe avant `let currentText` — appliquerMode() lèverait une ReferenceError et la page entière resterait blanche"
);
// Une bourse sans nom n'écrit pas « Candidature à la bourse undefined ».
assert.match(lettre, /=== "bourse" && app\.scholarship\) fieldMotivations\.value = /, "ai-letter : le nom de la bourse n'est plus vérifié avant d'être écrit");
});

test("un outil ouvert depuis une étape qui concerne un vœu porte ce vœu — et ne le devine jamais", () => {
// L'étape 8 le fait depuis R1 (une lettre par vœu). L'étape 13 — la
// confirmation du choix définitif — ouvrait `ai-email.html` NU : un
// formulaire sans destinataire, à comprendre et remplir au sélecteur.
// Mesuré en ligne le 2026-09-17.
//
// La règle interdit de deviner : l'unique vœu admis, à défaut l'unique
// vœu du dossier ; plusieurs admissions ⇒ rien dans l'URL, l'étudiant
// choisit. Preuve par mutation : `admis.length === 1` remplacé par
// `admis.length >= 1` → rouge.
const moteur = lire("espace-preinscription.js");
assert.match(moteur, /function voeuDeLOutil\(e\) \{/, "le moteur ne sait plus quel vœu une étape concerne");
const corps = moteur.slice(moteur.indexOf("function voeuDeLOutil"), moteur.indexOf("function hrefOutil"));
assert.match(corps, /e\.id !== "ef_confirmation"/, "l'étape visée n'est plus nommée");
assert.match(corps, /admis\.length === 1/, "une seule admission, sinon rien — un « >= 1 » choisirait à la place de l'étudiant");
assert.match(corps, /!admis\.length && etat\.voeux\.length === 1/, "le repli sur l'unique vœu du dossier a disparu");
assert.match(moteur, /return v \? `\$\{o\.href\}\?applicationId=\$\{encodeURIComponent\(v\.id\)\}` : o\.href;/, "l'identifiant du vœu n'est plus passé (ou n'est plus encodé)");

// Les DEUX rendus d'outil passent par là : le principal et les autres.
for (const rendu of ["htmlOutils", "htmlOutilPrincipal"]) {
const debut = moteur.indexOf(`function ${rendu}(e)`);
const bloc = moteur.slice(debut, debut + 700);
assert.match(bloc, /hrefOutil\(e, o\)/, `${rendu} garde un href figé`);
// Le verrou de formule lit `data-real-href` : les deux attributs
// doivent porter la même adresse, sinon un outil déverrouillé
// retomberait sur le lien nu.
assert.match(bloc, /href="\$\{href\}" data-real-href="\$\{href\}"/, `${rendu} : les deux attributs divergent`);
}
});

test("sur la route, on traduit VERS LE FRANÇAIS — et le repli du sélecteur source ne vaut jamais la cible", () => {
// Mesuré en ligne le 2026-09-17 : l'outil de traduction s'ouvrait sur
// « Traduire vers : Anglais », y compris depuis l'étape 4 ou 7, dont la
// consigne officielle dit l'inverse (« un document dans une autre
// langue que le français doit être traduit »). Un étudiant ghanéen
// venait faire traduire son relevé pour Études en France et repartait
// avec de l'anglais vers de l'anglais.
//
// Preuve par mutation : la cible remise en dur à « en » → rouge ; les
// deux valeurs mises à "fr" → rouge.
const src = lire("ai-translate.js");
assert.match(src, /targetLanguageSelect\.value = parcoursTraduction === "preinscription" \? "fr" : "en";/, "la destination ne suit plus le parcours");
assert.match(src, /sourceLanguageSelect\.value = targetLanguageSelect\.value === "fr" \? "en" : "fr";/, "le repli du sélecteur source peut égaler la cible (« français → français »)");
// Le parcours est connu AVANT que les défauts soient posés.
assert.ok(
src.indexOf("parcoursTraduction = parcoursDOutil(") < src.indexOf("initTranslateTool();"),
"les défauts se posent avant que le parcours soit connu"
);
// La détection automatique reste la règle pour la SOURCE : on ne devine
// pas la langue des documents de l'étudiant, on la lit.
assert.match(lire("ai-translate.html"), /id="autoDetect" checked/, "la détection automatique n'est plus cochée par défaut");
});

// ------------------------------------------------------------------
// 3. LES PROMPTS PARLENT « PRÉINSCRIPTION »
// ------------------------------------------------------------------

test("buildPrompt en préinscription ne contient aucune occurrence de « bourse » — et le parcours bourse reste identique", () => {
const entrees = {
letter: { ...CIBLE, style: "academique" },
email: { ...CIBLE, emailType: "contact_university", context: "" },
check: { ...CIBLE, files: [{ name: "releve.pdf", type: "application/pdf" }] },
readiness: { ...CIBLE, scholarship: "Master Informatique", deadline: "2026-12-15", checklist: [], etapesProcedure: [{ id: "a", label: "Créer le compte", done: true }, { id: "b", label: "Payer les frais", done: false, preuve: "reçu", echeanceISO: "2026-12-27" }] },
chat: { ...CIBLE, message: "bonjour", history: [] }
};
for (const [task, input] of Object.entries(entrees)) {
const pre = buildPrompt(task, { ...input, parcours: "preinscription" });
assert.ok(!/bourse/i.test(pre.system + "\n" + pre.user), `${task} : « bourse » dans le prompt préinscription`);
assert.match(pre.system, /PRÉINSCRIPTION/, `${task} : le cadre préinscription doit être posé`);
// NON-RÉGRESSION : avec parcours bourse, ou sans parcours, le prompt est
// EXACTEMENT celui d'avant.
assert.deepEqual(buildPrompt(task, { ...input, parcours: "bourse" }), buildPrompt(task, input), `${task} : le parcours bourse doit être le défaut`);
assert.ok(!/PRÉINSCRIPTION/.test(buildPrompt(task, input).system), `${task} : aucun cadre préinscription sans parcours`);
}
// La lettre de vœu : 4 à 5 lignes, une par formation, pas de louange.
const voeu = buildPrompt("letter", { ...CIBLE, track: "preinscription" });
assert.match(voeu.system, /quatre à cinq lignes/);
assert.match(voeu.system, /commission pédagogique/);
assert.match(voeu.system, /louange/);
assert.match(voeu.user, /Formation : Master Informatique/);
assert.ok(!/style/.test(voeu.user), "aucun style de lettre en mode vœu");
// Et le bloc « Parcours déclaré » (objet) ne se fait pas écraser par la chaîne.
const objet = buildPrompt("letter", { ...CIBLE, style: "academique", parcours: { niveauActuel: "L3" } });
assert.match(objet.user, /Niveau actuel : L3/);
assert.ok(!/0 : p/.test(buildPrompt("letter", { ...CIBLE, style: "academique", parcours: "preinscription" }).user), "une chaîne n'est jamais itérée comme un objet");
});

test("lireParcoursDeSaisie : la chaîne, puis le champ track, puis « bourse » — jamais une troisième règle", () => {
assert.equal(lireParcoursDeSaisie({ parcours: "preinscription" }), "preinscription");
assert.equal(lireParcoursDeSaisie({ track: "preinscription" }), "preinscription");
assert.equal(lireParcoursDeSaisie({ parcours: { niveauActuel: "L3" }, track: "preinscription" }), "preinscription", "un objet n'est pas un parcours");
assert.equal(lireParcoursDeSaisie({ parcours: "Preinscription" }), "bourse", "la casse compte, comme dans lireParcours");
assert.equal(lireParcoursDeSaisie({}), "bourse");
assert.equal(lireParcoursDeSaisie(null), "bourse");
assert.equal(parcoursDOutil({ espace: "preinscription" }), "preinscription");
assert.equal(parcoursDOutil({ espace: "preinscription", application: { track: "bourse" } }), "bourse", "la candidature liée l'emporte sur l'espace");
assert.equal(parcoursDOutil({}), "bourse");
});

// ------------------------------------------------------------------
// 4. LE SIMULATEUR — ce que l'étudiant lira réellement
// ------------------------------------------------------------------

test("la lettre de vœu simulée tient en 6 lignes au plus, nomme la formation, et ne loue pas la France", () => {
const texte = generateMotivationLetter({ ...CIBLE, parcours: "preinscription", style: "excellence" });
const lignes = texte.split("\n").filter((l) => l.trim());
assert.ok(lignes.length <= 6, `${lignes.length} lignes`);
assert.ok(lignes.length >= 4, "au moins quatre lignes");
assert.match(texte, /Master Informatique/);
assert.match(texte, /Université de Bordeaux/);
assert.ok(!/bourse/i.test(texte));
assert.ok(!/la France|l'enseignement français|excellence française|système français|réput/i.test(texte), "aucune louange sur la France");
assert.ok(!/Madame, Monsieur,\n\n/.test(texte), "pas de paragraphes de lettre de motivation");
assert.equal(texte, generateLettreDeVoeu(CIBLE));
// Une lettre par formation : deux formations, deux lettres différentes.
const autre = generateMotivationLetter({ ...CIBLE, parcours: "preinscription", program: "Master Réseaux", university: "Université de Lille" });
assert.notEqual(autre, texte);
assert.match(autre, /Master Réseaux/);
// Le parcours bourse garde ses styles et sa longueur.
const bourse = generateMotivationLetter({ ...CIBLE, style: "excellence" });
assert.ok(bourse.split("\n\n").length >= 4);
assert.match(bourse, /Madame, Monsieur,/);
});

test("la vérification avant dépôt d'une préinscription se juge sur les étapes de la procédure", () => {
const etapes = [
{ id: "ef_compte", label: "Créer le compte", done: true },
{ id: "ef_paiement", label: "Payer les frais de dossier", done: false, preuve: "reçu", echeanceISO: "2026-12-27" },
{ id: "ef_soumission", label: "Soumettre le dossier", done: false }
];
const r = computeApplicationReadiness({ parcours: "preinscription", etapesProcedure: etapes, hasGeneratedLetter: false, profileScore: 1, checklist: [] });
assert.equal(r.ready, false);
assert.equal(r.checklistDone, 1);
assert.equal(r.checklistTotal, 3);
assert.deepEqual(r.missingItems.map((m) => m.id), ["procedure-ef_paiement", "procedure-ef_soumission"]);
assert.match(r.missingItems[0].text, /preuve attendue : reçu/);
assert.match(r.missingItems[0].text, /2026-12-27/);
// Ni la lettre d'une page, ni le barème de profil n'entrent dans le verdict.
assert.ok(!r.missingItems.some((m) => m.id === "letter" || m.id === "profile"));
// Tout fait, avec preuves : prêt.
assert.equal(computeApplicationReadiness({ track: "preinscription", etapesProcedure: etapes.map((e) => ({ ...e, done: true })) }).ready, true);
// Aucune étape rattachée : pas prêt, et la raison est dite.
assert.equal(computeApplicationReadiness({ parcours: "preinscription", etapesProcedure: [] }).missingItems[0].id, "procedure-absente");
// Le parcours bourse est inchangé : même barème qu'avant.
assert.deepEqual(computeApplicationReadiness({ checklist: [], hasGeneratedLetter: false, profileScore: 2 }).missingItems.map((m) => m.id), ["letter", "checklist-empty", "profile"]);
// Et applications.js envoie bien ces étapes.
const apps = lire("applications.js");
assert.match(apps, /etapesProcedure,/);
assert.match(apps, /etapesDeProcedure\(app, procedurePour\(app\), new Date\(\)\)/);
assert.match(lire("js/application-journey.js"), /export function etapesDeProcedure/);
});

test("le chat et les e-mails simulés ne mélangent pas les deux vocabulaires", () => {
for (const message of ["bonjour", "quels frais ?", "quelle bourse ?", "xyz question libre"]) {
const reponse = generateChatReply({ message, profile: PROFIL, parcours: "preinscription", applications: [] });
assert.ok(!/bourse/i.test(reponse), `« ${message} » : « bourse » dans la réponse préinscription`);
}
assert.match(generateChatReply({ message: "bonjour", profile: PROFIL, applications: [] }), /bourses/, "le parcours bourse garde sa salutation");
assert.ok(!/bourse/i.test(getSuggestedQuestions(PROFIL, "preinscription").join(" ")));
assert.match(getSuggestedQuestions(PROFIL).join(" "), /bourses/);
// « Demander une bourse » n'existe pas en préinscription.
assert.deepEqual(typesEmailPour("preinscription").map((t) => t.key).filter((k) => k === "request_scholarship"), []);
assert.equal(typesEmailPour("bourse").length, EMAIL_TYPES.length);
assert.equal(typesEmailPour("preinscription").length, EMAIL_TYPES.length - 1);
assert.match(lire("ai-email.js"), /typesEmailPour\(parcoursCourant\(\)\)/);
});

// ------------------------------------------------------------------
// 5. LA FONCTION — le serveur lit enfin planPreinscription
// ------------------------------------------------------------------

const MAINTENANT = new Date("2026-09-10T12:00:00Z");
const DEMAIN = "2026-09-11T00:00:00.000Z";
const HIER = "2026-09-09T00:00:00.000Z";

test("formuleActive() rend une formule pour un compte dossier-france sans formule bourse, et null quand elle est expirée", () => {
assert.equal(formuleActive({ planPreinscription: "dossier-france", planPreinscriptionExpiresAt: DEMAIN }, MAINTENANT), "dossier-france");
assert.equal(formuleActive({ planPreinscription: "dossier-france-conseiller", planPreinscriptionExpiresAt: DEMAIN }, MAINTENANT), "dossier-france-conseiller");
assert.equal(formuleActive({ planPreinscription: "dossier-france", planPreinscriptionExpiresAt: HIER }, MAINTENANT), null, "expirée");
assert.equal(formuleActive({ planPreinscription: "dossier-france" }, MAINTENANT), null, "sans échéance : jamais posée par le webhook");
// Le Diagnostic France n'ouvre aucun outil : pas de formule.
assert.equal(formuleActive({ planPreinscription: "diagnostic-france", planPreinscriptionExpiresAt: DEMAIN }, MAINTENANT), null);
// Les deux formules bourse EN VENTE, enfin reconnues.
assert.equal(formuleActive({ plan: "essentiel-4", planExpiresAt: DEMAIN }, MAINTENANT), "essentiel-4");
assert.equal(formuleActive({ plan: "conseiller-6", planExpiresAt: DEMAIN }, MAINTENANT), "conseiller-6");
// L'ordre : bourse d'abord, puis préinscription, puis le pass.
assert.equal(formuleActive({ plan: "essentiel-4", planExpiresAt: DEMAIN, planPreinscription: "dossier-france", planPreinscriptionExpiresAt: DEMAIN }, MAINTENANT), "essentiel-4");
assert.equal(formuleActive({ plan: "essentiel-4", planExpiresAt: HIER, planPreinscription: "dossier-france", planPreinscriptionExpiresAt: DEMAIN }, MAINTENANT), "dossier-france");
assert.equal(formuleActive({ planPreinscription: "dossier-france", planPreinscriptionExpiresAt: HIER, fitzExpressExpiresAt: DEMAIN }, MAINTENANT), "fitzExpress");
assert.equal(formuleActive({ plan: "premier-dossier" }, MAINTENANT), "premier-dossier", "sans échéance : acquis pour toujours");
assert.equal(formuleActive({}, MAINTENANT), null);
assert.equal(formuleActive(null, MAINTENANT), null);
// Un Timestamp Firestore est lu comme une date.
assert.equal(formuleActive({ planPreinscription: "dossier-france", planPreinscriptionExpiresAt: { toDate: () => new Date(DEMAIN) } }, MAINTENANT), "dossier-france");
});

test("LE MIROIR : toute offre en vente qui ouvre ai_letter est dans FORMULES_AVEC_FITZ et dans PLAFONDS", () => {
const ouvrant = (id) => (DEFAULT_FEATURE_CONFIG.ai_letter[id] === true) || (PREINSCRIPTION_FEATURE_CONFIG.ai_letter[id] === true);
const enVente = Object.values(OFFRES).filter((o) => o.deprecated !== true).map((o) => o.id);
assert.ok(enVente.includes("essentiel-4") && enVente.includes("conseiller-6") && enVente.includes("dossier-france"), "la grille de vente lue est bien la vraie");

const manquants = enVente.filter((id) => ouvrant(id)).filter((id) => !FORMULES_AVEC_FITZ.includes(id) || !PLAFONDS[id]);
assert.deepEqual(manquants, [], `formules vendues avec Fitz mais absentes du serveur : ${manquants.join(", ")} — c'est exactement le défaut d'essentiel-4 et conseiller-6`);

// Dans l'autre sens : rien n'est dans la liste serveur sans être une
// formule connue, et rien n'y ouvre Fitz que le site refuse.
for (const id of FORMULES_AVEC_FITZ) {
assert.ok(PLAN_ORDER.includes(id) || PLAN_PREINSCRIPTION_ORDER.includes(id), `${id} n'est pas une formule du site`);
assert.ok(ouvrant(id), `${id} n'ouvre aucun outil Fitz côté site, il ne doit pas en ouvrir côté serveur`);
assert.ok(PLAFONDS[id], `${id} sans plafond`);
}
assert.ok(!FORMULES_AVEC_FITZ.includes("diagnostic-france"));
assert.ok(!FORMULES_AVEC_FITZ.includes("gratuit"));

// Le calibrage : ~25 % de la recette mensuelle, 1 point ≈ 10 F.
assert.deepEqual(PLAFONDS["essentiel-4"], { jour: 40, mois: 190 });
assert.deepEqual(PLAFONDS["conseiller-6"], { jour: 70, mois: 400 });
assert.deepEqual(PLAFONDS["dossier-france"], { jour: 40, mois: 190 });
assert.deepEqual(PLAFONDS["dossier-france-conseiller"], { jour: 70, mois: 380 });
assert.deepEqual(plafondsDe("formule-inconnue"), { jour: 40, mois: 190 });
});

test("functions/fitz.js n'a plus sa propre copie de la décision, et son refus ne renvoie plus vers une formule bourse", () => {
const fitz = lire("functions/fitz.js");
assert.match(fitz, /require\("\.\/lib\/fitz-acces"\)/);
assert.ok(!/const FORMULES_AVEC_FITZ = \[/.test(fitz), "la liste ne doit plus être écrite dans fitz.js");
assert.ok(!/const PLAFONDS = \{/.test(fitz), "les plafonds ne doivent plus être écrits dans fitz.js");
assert.ok(!/function formuleActive\(/.test(fitz), "la décision ne doit plus être écrite dans fitz.js");
assert.ok(!/inclus à partir de la formule Essentiel/.test(fitz), "le message de refus parlait d'une formule bourse à un client préinscription");
assert.match(fitz, /bourse ou Dossier France/);
// Le module pur ne touche ni Firebase ni réseau.
const lib = lire("functions/lib/fitz-acces.js");
assert.ok(!/require\(|firebase|fetch\(/.test(lib.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "")), "fitz-acces.js doit rester pur");
});
