/**
* Lot LANGAGE (2026-09-10) — un site qu'on comprend du premier coup.
*
* Huit contrôles, sur les fichiers servis (HTML lus tels quels, CRLF
* normalisé) :
*  1. un seul <h1> par page publique ;
*  2. le compteur d'antithèses : au plus UNE tournure en balance par
*     page (« , pas », « n'est pas … c'est », « bien plus qu' ») — le
*     gardien de la règle n° 2, sans lequel le tic revient au lot suivant ;
*  3. les phrases intouchables existent encore — l'honnêteté du site
*     protégée contre sa propre simplification ;
*  4. le pied de page partagé sur toute page publique, avec sa colonne
*     Légal, et plus aucun pied de page recopié ;
*  5. le glossaire : un seul fichier, et chaque terme présent sur une
*     page porte son explication à sa première occurrence ;
*  6. le bandeau d'entrée du questionnaire ;
*  7. aucun nombre de catalogue écrit en clair sur l'accueil ;
*  8. le titre de la fiche bourse se construit depuis la bourse.
*
* Preuves par mutation faites le 2026-09-10 : une deuxième antithèse sur
* preinscriptions.html → test 2 rouge ; « Vous déposez toujours vous-même »
* retiré → test 3 rouge.
*/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { GLOSSAIRE, annoterTexte, annotations } from "../js/glossaire.js";
import { COUCHES } from "../js/procedures/residences/index.js";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");
// Sans les commentaires : les modules de ce dépôt racontent le défaut
// qu'ils corrigent, et citent donc les tournures qu'ils interdisent.
const codeSeul = (f) => lire(f)
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/^\s*\/\/.*$/gm, "")
  .replace(/<!--[\s\S]*?-->/g, "");

// Les pages publiques : celles qu'un visiteur ouvre sans compte.
export const PAGES_PUBLIQUES = [
"index.html", "scholarships.html", "universities.html", "scholarship-details.html",
"preinscriptions.html", "preinscription-france.html", "offers.html",
"eligibility-test.html", "eligibility-questions.html", "results.html", "login.html", "bientot.html"
];

// Le texte VISIBLE d'une page : sans commentaires, scripts, styles, head.
function visible(html) {
return html
.replace(/<!--[\s\S]*?-->/g, "")
.replace(/<script[\s\S]*?<\/script>/g, "")
.replace(/<style[\s\S]*?<\/style>/g, "")
.replace(/<head>[\s\S]*?<\/head>/, "");
}
const texteDe = (html) => visible(html).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

// --- 1. un seul h1 ------------------------------------------------------
test("langage 1 — un seul <h1> par page publique", () => {
for (const page of PAGES_PUBLIQUES) {
const n = (visible(lire(page)).match(/<h1\b/g) || []).length;
assert.equal(n, 1, `${page} : ${n} <h1>`);
}
});

// --- 2. le compteur d'antithèses ---------------------------------------
export const MOTIFS_ANTITHESE = [/, pas /g, /n'est pas [^.!?]{0,120}?c'est /g, /bien plus qu/g];

export function antitheses(texte) {
const trouvees = [];
for (const motif of MOTIFS_ANTITHESE) {
for (const m of texte.matchAll(motif)) trouvees.push(texte.slice(Math.max(0, m.index - 40), m.index + 40));
}
return trouvees;
}

test("langage 2 — au plus une tournure en balance par page", () => {
for (const page of PAGES_PUBLIQUES) {
const t = antitheses(texteDe(lire(page)));
assert.ok(t.length <= 1, `${page} : ${t.length} antithèses — ${t.join(" | ")}`);
}
});

// --- 3. les phrases intouchables ---------------------------------------
// « Aucune promesse d'admission » a quitté cette liste avec le lot
// VITRINE-COMMERCIALE (2026-09-11, décision 6 de Charles) : le site dit
// ce qu'il fait et garantit, jamais ce qu'il ne fait pas. Les limites
// vivront dans les conditions de vente. La phrase de portée
// d'offers.html reste : ce n'est pas un découragement.
//
// « il vous dit ce qu'il ne sait pas » A QUITTÉ CETTE LISTE le
// 2026-09-12, sur décision explicite de Charles. Elle ne vivait que
// dans le sous-titre du hero d'index.html, réécrit ce jour-là
// (« … puis vous guide dossier par dossier jusqu'au départ. »). La
// franchise de Fitz n'est donc plus imprimée sur l'accueil : si elle y
// revient un jour, remettre l'entrée ici ET la garde de « langage 2 »,
// retirée en même temps.
export const INTOUCHABLES = [
"Vous déposez toujours vous-même",
"Tout est rendu en entier, tout de suite : rien n'est masqué ici pour vous faire payer la suite",
"Le catalogue est ouvert à tous",
// Le brief citait « … ne nous appartiennent pas » ; la phrase servie
// (offers.html) a toujours été celle-ci — c'est elle qui est protégée.
"La décision d'admission et la délivrance du visa relèvent, elles, des établissements et des autorités consulaires"
];

test("langage 3 — les phrases intouchables existent encore dans les fichiers servis", () => {
const servis = ["index.html", "preinscriptions.html", "preinscription-france.html", "diagnostic-france.html", "payment.html",
"offers.html", "js/pays-preinscription.js", "js/preinscription-destination.js", "js/preinscriptions-page.js",
"js/procedures/france.js", "js/diagnostic-conseil.js", "js/diagnostic-france.js",
// Les avertissements anti-intermédiaires relayés depuis Campus France
// vivent dans les couches de résidence (Burkina Faso, Cameroun).
"js/procedures/residences/france-burkina-faso.js", "js/procedures/residences/france-cameroun.js"]
.filter((f) => existsSync(path.join(RACINE, f)))
.map((f) => lire(f).replace(/<!--[\s\S]*?-->/g, "").replace(/^\s*(\/\/|\*|\/\*).*$/gm, ""))
.join("\n");
for (const phrase of INTOUCHABLES) assert.ok(servis.includes(phrase), `phrase intouchable disparue : « ${phrase} »`);
// Les dates de vérification et les sources restent : chaque fait public
// de la France en porte une (js/pays-preinscription.js les exige déjà).
const faits = lire("js/pays-preinscription.js");
assert.ok(/verifieLe/.test(faits) && /source:/.test(faits));
// Les avertissements anti-intermédiaires relayés depuis Campus France.
assert.ok(servis.includes("aucune agence n'est agréée"), "avertissement Campus France Burkina absent");
assert.ok(servis.includes("aucun intermédiaire ne peut le faciliter"), "avertissement Campus France Cameroun absent");
});

// --- 4. le pied de page partagé ------------------------------------------
// Lot PIED-DE-PAGE (2026-09-10) : « toutes » ne protège plus rien depuis
// qu'il y a des exceptions. Deux listes explicites, AVEC et SANS — une
// page qui a une seule tâche (questionnaire, diagnostic, résultats,
// connexion) n'offre pas six façons de partir. Une page qui change de
// camp doit être déplacée ici, en le décidant.
// Lot FINITIONS-VISUELLES (2026-09-11), décision de Charles : le pied de
// page ne reste que sur l'accueil ; chaque autre page garde le glossaire.
export const PAGES_AVEC_PIED = ["index.html"];
export const PAGES_SANS_PIED = ["scholarships.html", "universities.html", "scholarship-details.html",
"preinscriptions.html", "preinscription-france.html", "offers.html", "bientot.html",
"eligibility-questions.html", "eligibility-test.html", "results.html", "login.html"];

test("langage 4 — le pied de page partagé sur l'accueil, et sur lui seul ; aucune page ne le recopie, aucune ne perd le glossaire", () => {
for (const page of PAGES_SANS_PIED) {
// visible() retire les <script> : on lit le fichier sans ses commentaires.
assert.ok(/<script src="js\/glossaire-seul\.js" defer><\/script>/.test(lire(page).replace(/<!--[\s\S]*?-->/g, "")), `${page} : sans glossaire`);
}
assert.deepEqual([...PAGES_AVEC_PIED, ...PAGES_SANS_PIED].sort(), [...PAGES_PUBLIQUES].sort(), "chaque page publique est dans une liste et une seule");
for (const page of PAGES_AVEC_PIED) {
assert.ok(/<script src="js\/pied-de-page\.js" defer><\/script>/.test(lire(page)), `${page} : sans js/pied-de-page.js`);
}
for (const page of PAGES_SANS_PIED) {
assert.ok(!/pied-de-page\.(js|css)/.test(visible(lire(page))), `${page} : charge le pied de page alors qu'elle n'a qu'une tâche`);
}
for (const page of PAGES_PUBLIQUES) {
assert.ok(!/<footer\b/.test(visible(lire(page))), `${page} : un pied de page recopié`);
}
const composant = lire("js/pied-de-page.js");
assert.ok(/footer-photo-feature/.test(composant));
for (const libelle of ["Légal", "Mentions légales", "Conditions de vente", "Confidentialité", "Contact"]) {
assert.ok(composant.includes(libelle), `colonne Légal : « ${libelle} » manque`);
}
// LES QUATRE PAGES LÉGALES EXISTENT (constaté le 2026-09-18).
// L'assertion exigeait ici quatre « bientot.html?page= » — l'adresse
// d'attente du temps où elles n'existaient pas — avec pour message
// « les liens légaux mènent à la page bientôt disponible », comme si
// c'était le but. Elles sont écrites depuis : la colonne doit pointer
// LES PAGES, et l'assertion pinne désormais cela. Leur existence sur le
// disque est le travail de test/liens.test.mjs, qui vérifie chaque href
// interne du site.
for (const cible of ["mentions-legales.html", "cgv.html", "confidentialite.html", "contact.html"]) {
assert.ok(composant.includes(`"${cible}"`), `colonne Légal : le lien vers ${cible} manque`);
}
assert.ok(!/bientot\.html\?page=/.test(composant),
"la colonne Légal est revenue à l'adresse d'attente, alors que ses quatre pages existent");
assert.ok(/css\/pied-de-page\.css/.test(composant), "le composant charge sa feuille");
assert.ok(existsSync(path.join(RACINE, "css/pied-de-page.css")));
// Le CSS n'est plus dans homepage-sections.css (une seule source).
assert.ok(!/^\.footer\{/m.test(lire("css/homepage-sections.css")));
// Le composant lance le glossaire.
assert.ok(/glossaire\.js/.test(composant));
});

// --- 5. le glossaire ---------------------------------------------------
test("langage 5 — un seul fichier de définitions, et chaque terme est expliqué à sa première place LISIBLE", () => {
// Deux termes ajoutés au lot R23, mesurés sur la route des huit pays :
// tous deux apparaissent là où le glossaire ATTEINT le texte, et aucun
// des deux n'y était.
const attendus = ["apostille", "legalisation-consulaire", "dap", "etudes-en-france", "voeu", "exoneration", "preinscription", "portail", "attestation-de-ressources", "tcf-delf-dalf", "ninea", "espace-campus-france", "entretien-pedagogique",
// Six termes ajoutés au lot R24, chacun adossé à un comptage sur les
// huit pays : voir langage 16.
"recepisse", "cedeao", "accreditation", "bts-dut-but", "iut", "traducteur-assermente"];
assert.deepEqual(GLOSSAIRE.map((t) => t.id), attendus);
for (const t of GLOSSAIRE) {
const ex = typeof t.explication === "function" ? t.explication("x") : t.explication;
assert.ok(ex.split(" ").length >= 3 && ex.split(" ").length <= 12, `${t.id} : explication de ${ex.split(" ").length} mots`);
}

// DEUX EXPLICATIONS RÉÉCRITES LE 2026-09-14, parce qu'elles faisaient
// bégayer la phrase qu'elles éclairaient : « le portail (le site
// OFFICIEL où vous déposez) officiel » et « l'exonération (une
// réduction des DROITS d'inscription) des droits ». Un glossaire qui
// répète le mot suivant manque son but.
assert.ok(!/officiel/i.test(GLOSSAIRE.find((t) => t.id === "portail").explication),
"l'explication de « portail » contient « officiel » — elle bégaie sur « le portail officiel »");
assert.ok(!/droits/i.test(GLOSSAIRE.find((t) => t.id === "exoneration").explication),
"l'explication de « exonération » contient « droits » — elle bégaie sur « l'exonération des droits »");
// Une seule table de définitions dans le dépôt : aucune page ne recopie
// une explication.
const pages = PAGES_PUBLIQUES.map((p) => visible(lire(p))).join("\n");
for (const t of GLOSSAIRE) {
const ex = typeof t.explication === "function" ? t.explication("x") : t.explication;
assert.ok(!pages.includes(ex), `${t.id} : explication recopiée dans une page`);
}

// La fonction pure, sur le texte de chaque page : le premier terme
// rencontré est suivi de son explication, le second ne l'est plus.
const pluriel = annoterTexte("jusqu'à 7 vœux, puis un vœu de plus");
assert.equal(pluriel, "jusqu'à 7 vœux (les formations que vous demandez), puis un vœu de plus");
assert.equal(annoterTexte("Préinscription en France, puis préinscription ailleurs"), "Préinscription (une demande d'admission, avant l'inscription) en France, puis préinscription ailleurs");
// Une explication n'est jamais annotée à son tour, même quand elle
// contient un mot du glossaire.
const vus = new Set();
const a = annoterTexte("le dossier Études en France se dépose sur le portail", vus);
assert.equal(a, "le dossier Études en France (la plateforme en ligne de Campus France) se dépose sur le portail (le site où vous déposez votre candidature)");
assert.equal(annotations("encore un portail", vus).length, 0);
// « adapté » ne contient pas DAP.
assert.equal(annoterTexte("un dossier adapté"), "un dossier adapté");

// Sur les pages publiques : là où un terme apparaît (hors menus, liens
// et titres — ce que le composant exclut), sa première occurrence est
// annotée par la même fonction que le navigateur.
for (const page of PAGES_PUBLIQUES) {
const corps = visible(lire(page))
.replace(/<(nav|header|footer|a|button|h1|label|select)\b[\s\S]*?<\/\1>/g, " ")
.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
const registre = new Set();
const annote = annoterTexte(corps, registre);
for (const t of GLOSSAIRE) {
if (!registre.has(t.id)) continue;
// LA PLACE N'EST PLUS FORCÉMENT LA PREMIÈRE OCCURRENCE (2026-09-14) :
// un terme dont la première apparition tombe DANS une parenthèse
// s'explique à l'occurrence suivante. On vérifie donc qu'il est
// expliqué quelque part, avec le mot réellement rencontré là.
const global = new RegExp(t.motif.source, `${t.motif.flags}g`);
const formes = new Set();
for (let m = global.exec(corps); m; m = global.exec(corps)) formes.add(m[0].slice(m[1].length));
const explique = [...formes].some((forme) => {
const ex = typeof t.explication === "function" ? t.explication(forme) : t.explication;
return annote.includes(`${forme} (${ex})`);
});
assert.ok(explique, `${page} : « ${t.id} » est marqué vu mais n'est expliqué nulle part`);
}
}
});

// --- 5 bis. le défaut mesuré EN LIGNE le 2026-09-14 ----------------------
test("langage 5 bis — une explication ne se pose JAMAIS dans une parenthèse déjà ouverte", () => {

// LE DÉFAUT, lu sur la fiche PUBLIQUE de l'Université Mohammed V :
//   « …du pays d'origine (pas de portail (le site officiel où vous
//     déposez) en ligne unique), transmission par voie diplomatique. »
// Une incise dans une incise : la phrase se casse et « en ligne
// unique) » se retrouve orphelin. Le balayage des 3 375 textes longs du
// catalogue public en comptait DIX-NEUF, dont Polytechnique, la
// Rosa-Luxemburg-Stiftung, l'UGA et la Statale de Milan.
const amci = "Candidature via le ministère de l'enseignement supérieur du pays d'origine (pas de portail en ligne unique), transmission par voie diplomatique.";
assert.equal(annoterTexte(amci, new Set()), amci,
"le glossaire annote encore à l'intérieur d'une parenthèse");

// Et l'occurrence SUIVANTE, en clair, reçoit bien l'explication : on
// saute la place fautive, on ne renonce pas au terme.
const deux = annoterTexte("Une demande est requise (via le portail national), puis le portail ouvre en mai.", new Set());
assert.match(deux, /le portail \(le site où vous déposez votre candidature\) ouvre en mai/);
assert.equal((deux.match(/le site où vous déposez/g) || []).length, 1, "le terme est expliqué deux fois");

// « (…) (…) » : deux incises collées sont illisibles.
assert.equal(annoterTexte("Le portail (ouvert en mai) reçoit les dossiers.", new Set()),
"Le portail (ouvert en mai) reçoit les dossiers.");

// LA GARDE DE FOND : sur AUCUN des textes longs du catalogue public,
// l'annotation ne doit produire une parenthèse de profondeur 2.
const catalogue = JSON.parse(lire("assets/data/catalogue.json"));
const textes = [];
const pousser = (o) => {
for (const [k, v] of Object.entries(o || {})) {
if (typeof v === "string" && v.length > 40) textes.push([o.id, k, v]);
else if (v && typeof v === "object" && !Array.isArray(v)) pousser({ ...v, id: o.id });
}
};
for (const coll of ["scholarships", "universities", "programs"]) for (const d of catalogue[coll]) pousser(d);

assert.ok(textes.length > 3000, `seulement ${textes.length} textes longs — le catalogue a changé de forme`);

const fautifs = [];
for (const [id, champ, t] of textes) {
const out = annoterTexte(t, new Set());
let profondeur = 0, max = 0;
for (const ch of out) { if (ch === "(") profondeur++; if (ch === ")") profondeur--; if (profondeur > max) max = profondeur; }
if (max > 1) fautifs.push(`${id}/${champ}`);
if (/\)\s*\(/.test(out)) fautifs.push(`${id}/${champ} (parenthèses collées)`);
}

assert.deepEqual(fautifs, [], `${fautifs.length} texte(s) du catalogue produisent une parenthèse imbriquée`);

});

// --- 6. le bandeau du questionnaire ---------------------------------------
test("langage 6 — le questionnaire dit la durée, la gratuité, l'absence de compte et le résultat avant la première question", () => {
const html = lire("eligibility-questions.html");
const v = visible(html);
const bandeau = v.indexOf('id="entree"');
const question = v.indexOf('id="question"');
assert.ok(bandeau > 0 && bandeau < question, "le bandeau précède la question");
const t = texteDe(html.slice(html.indexOf('id="entree"'), html.indexOf("</section>")));
assert.ok(/minutes/.test(t), "la durée");
assert.ok(/Gratuit/.test(t), "la gratuité");
assert.ok(/sans compte/.test(t), "sans compte");
assert.ok(/votre score/.test(t) && /opportunités/.test(t), "le résultat");
// Le nombre de questions varie selon le niveau : jamais un nombre en dur.
assert.ok(!/\b1[0-9] questions\b/.test(t), "nombre de questions écrit en dur");
// Le script le retire après la première réponse.
assert.ok(/entree\.hidden = parcours\.index > 0/.test(lire("eligibility-questions.js")));
});

// --- 7. aucun nombre de catalogue écrit sur l'accueil ---------------------
test("langage 7 — les chiffres de l'accueil se lisent, ils ne s'écrivent pas", () => {
const cat = JSON.parse(lire("assets/data/catalogue.json"));
const etablissements = new Set(cat.universities.map((u) => `${u.name || ""}|${u.city || ""}`)).size;
const pays = new Set(cat.universities.map((u) => u.country).filter(Boolean)).size;
const attendus = [cat.scholarships.length, etablissements, pays, COUCHES.length];
const t = texteDe(lire("index.html"));
for (const n of attendus) {
assert.ok(!new RegExp(`(^|[^\\d])${n}([^\\d]|$)`).test(t), `« ${n} » est écrit en clair sur l'accueil`);
}
// Lot VITRINE-COMMERCIALE (2026-09-11) : la bande #chiffres est partie
// (elle répétait le hero). Les trois compteurs du hero restent lus par
// js/homepage-teaser.js ; aucune bande, aucun data-chiffre ne revient.
const html = lire("index.html");
assert.ok(!/id="chiffres"/.test(html), "la bande de chiffres est revenue");
assert.ok(!/data-chiffre=/.test(html));
const teaser = lire("js/homepage-teaser.js");
assert.ok(!/renderChiffres\(/.test(teaser.replace(/^\s*\/\/.*$/gm, "")), "renderChiffres est du code mort");
assert.ok(/setCount\(heroScholarshipCountEl, scholarshipCount\)/.test(teaser));
// scholarships.html : le nombre de la phrase d'entrée vient du script.
assert.ok(/id="heroBoursesNombre"><\/strong>/.test(lire("scholarships.html")));
assert.ok(/nombreEntree\.textContent = String\(allScholarships\.length\)/.test(lire("scholarships.js")));
});

// --- 8. la fiche bourse porte son propre titre -----------------------------
test("langage 8 — le titre et la description de la fiche bourse se construisent depuis la bourse", () => {
const js = lire("details.js");
assert.ok(/\[nomBourse, university\.country, university\.level\]\.filter\(Boolean\)\.join\(" · "\)/.test(js));
assert.ok(/critères, échéance datée et site officiel/.test(js));
// Le registre corrigé.
assert.ok(!/exceptionnelle/.test(visible(lire("ai-letter.html"))));
assert.ok(!/exceptionnelle/.test(lire("ai-letter.js")));
assert.ok(!/Votre espace vous attend/.test(lire("dashboard.html")));
assert.ok(/Jusqu'où voulez-vous être accompagné/.test(lire("offers.html")));
assert.ok(/sans erreur/.test(lire("offers.html")) && !/sans faille/.test(visible(lire("offers.html"))));
assert.ok(/Là où vous êtes né ne devrait pas décider de votre/.test(lire("index.html")));
});


test("langage 5 ter — la fiche ne parle jamais de « portail » quand elle vient de dire qu'il n'y en a pas", () => {

// LU EN LIGNE LE 2026-09-14, sur la fiche publique de l'Université
// Mohammed V : « Voir la procédure du portail », trois lignes sous
// « Cette université n'a pas de portail de candidature en ligne ».
// Deux « portails » différents — celui de la procédure nationale AMCI
// et celui, inexistant, de l'établissement — et rien pour les
// distinguer. Le libellé nomme donc la procédure.
const html = lire("scholarship-details.html");

assert.ok(!html.includes("Voir la procédure du portail"),
"le libellé statique dit encore « du portail »");
assert.match(html, /<span id="procedureLabel">/,
"le libellé n'est plus nommable par details.js");

const details = lire("details.js");
assert.match(details, /Voir la procédure : \$\{nom\}/,
"details.js ne nomme plus la procédure");

// Le repli du HTML — celui que voit un visiteur si le script n'a pas
// tourné — ne doit contredire aucune phrase de la page.
const repli = (html.match(/<span id="procedureLabel">([^<]*)<\/span>/) || [])[1] || "";
assert.ok(repli.trim(), "le repli est vide");
assert.ok(!/portail/i.test(repli), `le repli « ${repli} » parle encore de portail`);

});
// ======================================================================
// LOT R21 (2026-09-18) — LE GLOSSAIRE ÉCLAIRAIT LA VITRINE, PAS L'ATELIER
// ======================================================================
//
// Charles, le 2026-09-18 : « faudra revérifier dans le site que tout est
// facile à comprendre pour un ressortissant africain, côté bourse comme
// préinscription ».
//
// MESURÉ SUR LE SITE DÉPLOYÉ, sur le texte réellement rendu — pas lu
// dans le code : « portail », « Études en France », « préinscription » et
// « vœux » apparaissaient SANS explication sur la route comme sur « Mes
// candidatures ». Le glossaire existait pourtant depuis le lot LANGAGE ;
// il était lancé par js/pied-de-page.js (les pages publiques) et par
// js/glossaire-seul.js (les pages publiques sans pied de page). AUCUNE
// page de l'espace étudiant ne chargeait l'un ou l'autre.
//
// Autrement dit : les mots techniques étaient expliqués dans la vitrine,
// et laissés nus dans l'atelier — là où ils décident de quelque chose,
// et juste après que l'étudiant a payé.
//
// Preuves par mutation faites le 2026-09-18 :
//   le lancement retiré de js/app-shell.js → langage 9 rouge ;
//   .glossaire-def remis dans css/pied-de-page.css seul → langage 10 ;
//   le registre remis sur le document (__glossaireVus) → langage 11 ;
//   data-sans-glossaire retiré du texte officiel → langage 12.

test("langage 9 — le glossaire tourne aussi dans l'espace étudiant", () => {

  const shell = lire("js/app-shell.js");

  // UN SEUL endroit pour tout l'espace : initShellChrome() est appelé par
  // les quinze pages connectées. Lancer le glossaire page par page aurait
  // été quinze occasions d'en oublier une.
  assert.match(shell, /import\("\.\/glossaire\.js"\)/,
    "js/app-shell.js ne charge pas le glossaire : l'espace étudiant reste sans explications");
  assert.match(shell, /surveillerTermes\(document\.querySelector\("main"\) \|\| document\.body\)/,
    "le glossaire n'est pas surveillé sur <main> : soit il ne suit pas les repeints, soit il annote la barre latérale");

  // Le lancement vit DANS initShellChrome, pas ailleurs dans le fichier.
  const corps = shell.slice(shell.indexOf("export function initShellChrome()"));
  assert.ok(corps.includes('import("./glossaire.js")'),
    "le glossaire est chargé hors de initShellChrome : les pages qui n'appellent que cette fonction ne l'auraient pas");

  // Et la version publique n'a pas été perdue au passage.
  assert.match(lire("js/pied-de-page.js"), /surveillerTermes/, "les pages publiques ont perdu leur glossaire");

});

test("langage 10 — le style de l'explication est chargé par TOUTES les pages", () => {

  // LE PIÈGE DE LA SEMAINE, quatrième fois : une règle qui ne s'applique
  // à rien et ne proteste jamais (liens sans soulignement aux lots R13,
  // R14 et B2 ; largeur du sélecteur au lot B5 ; cases à cocher au lot
  // R19). `.glossaire-def` vivait dans css/pied-de-page.css, que
  // js/pied-de-page.js charge lui-même — donc seulement là où il y a un
  // pied de page. Les explications de l'espace étudiant s'y seraient
  // affichées sans style.
  assert.match(lire("css/base.css"), /\.glossaire-def\{/,
    "le style de l'explication n'est pas dans css/base.css");
  assert.ok(!/\.glossaire-def\{/.test(lire("css/pied-de-page.css")),
    "deux définitions du même style : la seconde dérivera de la première");

  // css/base.css est bien la feuille que tout le monde charge.
  const pages = readdirSync(RACINE).filter((f) => f.endsWith(".html") && !f.startsWith("_"));
  const sans = pages.filter((f) => !lire(f).includes("css/base.css"));
  assert.deepEqual(sans, [], `ces pages ne chargent pas css/base.css : ${sans.join(", ")}`);

});

test("langage 11 — le registre des termes expliqués se lit dans le DOM", () => {

  const g = codeSeul("js/glossaire.js");

  // MESURÉ AU BANC : le registre vivait sur le document. L'espace
  // étudiant se REDESSINE (la route repeint ses quinze étapes, les cartes
  // de candidature se reconstruisent) : l'explication partait avec le
  // contenu et ne revenait jamais, le registre la croyant encore là.
  assert.ok(!/__glossaireVus/.test(g),
    "le registre est de nouveau gardé sur le document : une explication effacée par un repeint ne reviendra pas");
  assert.match(g, /cible\.querySelectorAll\("\.glossaire-def\[data-terme\]"\)/,
    "le registre ne se déduit pas des explications présentes dans la cible");

  // Et l'explication reste reconnaissable pour que ce compte marche.
  assert.match(g, /span\.className = "glossaire-def"/);
  assert.match(g, /span\.setAttribute\("data-terme", ins\.id\)/);

});

test("langage 12 — un texte présenté comme officiel ne porte jamais nos parenthèses", () => {

  const route = codeSeul("espace-preinscription.js");

  // La route affiche « Le texte officiel : "…" » avec sa source et sa
  // date. Le glossaire annoterait ce paragraphe comme un autre : le site
  // citerait alors un texte officiel dans lequel NOS explications se sont
  // glissées. Une citation reste une citation.
  const bloc = route.slice(route.indexOf("Le texte officiel"), route.indexOf("Le texte officiel") + 400);
  assert.match(bloc, /<p data-sans-glossaire>\$\{ech\(o\.consigne\)\}<\/p>/,
    "le texte officiel de la route n'est plus à l'abri du glossaire");

  // L'attribut est celui que le glossaire connaît déjà — pas un second
  // système inventé pour l'occasion.
  assert.match(codeSeul("js/glossaire.js"), /\[data-sans-glossaire\]/,
    "js/glossaire.js ne reconnaît pas data-sans-glossaire");

});

// ======================================================================
// LOT R23 (2026-09-18) — LES MOTS DE LA CITATION, DITS À CÔTÉ D'ELLE
// ======================================================================
//
// Suite mesurée du lot R21. En mettant la citation officielle de la route
// hors de portée du glossaire (`data-sans-glossaire`), on a laissé
// l'étudiant seul devant ses mots les plus opaques. Le balayage de la
// route des HUIT pays documentés, sur le texte réellement composé, a
// compté trois termes du glossaire qui n'apparaissent PLUS QUE là :
//
//   dap             16 occurrences
//   preinscription
//   tcf-delf-dalf
//
// La citation reste intacte ; les définitions se posent en dessous.
//
// Et deux mots centraux du parcours n'étaient pas au glossaire alors
// qu'ils apparaissent dans des endroits qu'il ATTEINT : « Espace Campus
// France » (phrase en clair, titre officiel, mention) et « entretien
// pédagogique » (titre officiel). Le bureau où l'étudiant ira, et
// l'épreuve qu'il redoute le plus.
//
// Preuves par mutation faites le 2026-09-18 :
//   motsTechniques retiré du rendu → langage 13 rouge ;
//   data-sans-glossaire retiré de notre ligne → langage 14 rouge ;
//   les deux termes neufs retirés du glossaire → langage 15 rouge.

test("langage 13 — les mots techniques d'une citation officielle sont dits à côté d'elle", async () => {

  const { motsTechniques } = await import("../js/glossaire.js");
  const { construireRoute } = await import("../js/route-preinscription.js");
  const { trouverProcedure } = await import("../js/procedures/index.js");
  const { COUCHES } = await import("../js/procedures/residences/index.js");

  // LES HUIT PAYS DOCUMENTÉS, pas un échantillon : c'est la seule façon
  // de savoir où les mots opaques tombent réellement.
  const pays = COUCHES.map((c) => c.pays).filter(Boolean);
  assert.ok(pays.length >= 8, `${pays.length} pays documentés : le balayage ne couvre plus la route`);

  let citationsAvecMots = 0;
  const vus = new Set();

  for (const p of pays) {
    const procedure = trouverProcedure({ paysDestination: "France", paysResidence: p });
    assert.ok(procedure, `aucune procédure pour ${p}`);
    const route = construireRoute({ procedure, profile: { country: p, nationality: p }, aujourdhui: new Date("2026-09-18") });
    for (const e of route.etapes) {
      const consigne = e.officielle && e.officielle.consigne;
      if (!consigne) continue;
      for (const m of motsTechniques(consigne)) { vus.add(m.id); citationsAvecMots += 1; }
    }
  }

  assert.ok(citationsAvecMots > 0, "aucune citation officielle ne contient de terme du glossaire : le balayage ne mesure plus rien");

  // Les trois termes que le lot R21 avait rendus inatteignables doivent
  // être retrouvés par ce chemin-là.
  for (const attendu of ["dap", "tcf-delf-dalf"]) {
    assert.ok(vus.has(attendu), `« ${attendu} » n'est plus dit nulle part : il n'apparaît que dans la citation`);
  }

  // Et le rendu pose bien la ligne.
  const route = codeSeul("espace-preinscription.js");
  // LE GABARIT, pas la déclaration : `htmlMotsDeLaCitation(e)` est aussi
  // un morceau de « function htmlMotsDeLaCitation(e) {", et l'assertion
  // passait donc même après avoir retiré l'appel du rendu (mutation
  // stérile attrapée le 2026-09-18).
  assert.match(route, /\$\{htmlMotsDeLaCitation\(e\)\}/, "la ligne des définitions n'est plus rendue sous la citation");
  assert.match(route, /<p class="rt-officiel-mots"/, "la ligne des définitions a perdu sa classe");
  assert.match(lire("css/route.css"), /\.rt-officiel-mots\{/, "la ligne des définitions n'a pas de style");

});

test("langage 14 — la ligne des définitions n'est pas définie à son tour", async () => {

  const route = codeSeul("espace-preinscription.js");

  // MESURÉ AU BANC : sans cet attribut, le glossaire annotait notre propre
  // ligne de définitions, et l'écran affichait « Études en France (la
  // plateforme en ligne de Campus France) : la plateforme en ligne de
  // Campus France ». Une ligne qui définit des mots n'a pas à être définie.
  assert.match(route, /<p class="rt-officiel-mots" data-sans-glossaire>/,
    "notre ligne de définitions est de nouveau à portée du glossaire : elle se définira elle-même");

  // ON NE DIT PAS DEUX FOIS LE MÊME MOT SUR LE MÊME ÉCRAN : un terme déjà
  // expliqué dans les phrases de l'étape n'est pas repris sous la citation.
  assert.match(route, /const dejaDit = new Set\(/,
    "le filtre des mots déjà dits a disparu : « vœu » serait défini deux fois à l'étape 8");

  // La citation, elle, reste hors de portée (lot R21).
  assert.match(route, /<p data-sans-glossaire>\$\{ech\(o\.consigne\)\}<\/p>/);

});

test("langage 15 — les deux mots centraux du parcours sont au glossaire", async () => {

  const { GLOSSAIRE, motsTechniques } = await import("../js/glossaire.js");

  for (const id of ["espace-campus-france", "entretien-pedagogique"]) {
    assert.ok(GLOSSAIRE.some((t) => t.id === id), `« ${id} » a quitté le glossaire`);
  }

  // Les motifs reconnaissent les formes réellement écrites sur la route —
  // singulier, pluriel, et la minuscule de « espace Campus France ».
  for (const forme of ["Espace Campus France", "espace Campus France", "Espaces Campus France",
                       "entretien pédagogique", "entretiens pédagogiques"]) {
    const trouves = motsTechniques(`Rendez-vous à votre ${forme} avant la date limite.`).map((m) => m.id);
    assert.ok(trouves.includes("espace-campus-france") || trouves.includes("entretien-pedagogique"),
      `« ${forme} » n'est pas reconnu par le glossaire`);
  }

  // Une explication dit ce que la chose EST, en quelques mots.
  for (const id of ["espace-campus-france", "entretien-pedagogique"]) {
    const t = GLOSSAIRE.find((x) => x.id === id);
    const texte = typeof t.explication === "function" ? t.explication("") : t.explication;
    assert.ok(texte.length > 20 && texte.length < 90, `l'explication de « ${id} » fait ${texte.length} caractères`);
  }

});

// ======================================================================
// LOT R24 (2026-09-18) — LES MOTS QUE LES PIÈCES ET LES CITATIONS PORTENT
// ======================================================================
//
// Comptage du 2026-09-18 sur le texte réellement composé des huit pays
// documentés, par endroit de rendu :
//
//   mot                     citation  en clair  nom de pièce
//   BTS / DUT / BUT              38        0         16
//   accréditation                 7        0          8
//   traducteur assermenté         7        8          0
//   récépissé                     1        0          1
//   CEDEAO                        1        0          1
//
// La citation est servie depuis le lot R23 ; la phrase « en clair » l'est
// par le glossaire lui-même. Les noms de pièces, eux, restent hors de
// portée (<label>), et c'est le champ `aide` du lot R24 qui les couvre —
// voir route 21, 22, 23.
//
// Preuve par mutation faite le 2026-09-18 :
//   les six termes retirés du glossaire -> langage 16 rouge.

test("langage 16 — les mots comptés dans les citations sont au glossaire, et « but » minuscule ne l'est pas", async () => {

  const { GLOSSAIRE, motsTechniques } = await import("../js/glossaire.js");
  const { construireRoute } = await import("../js/route-preinscription.js");
  const { trouverProcedure } = await import("../js/procedures/index.js");
  const { COUCHES } = await import("../js/procedures/residences/index.js");

  for (const id of ["recepisse", "cedeao", "accreditation", "bts-dut-but", "iut", "traducteur-assermente"]) {
    assert.ok(GLOSSAIRE.some((t) => t.id === id), `« ${id} » a quitté le glossaire`);
  }

  // LES FORMES RÉELLEMENT ÉCRITES SUR LA ROUTE sont reconnues.
  const formes = {
    "récépissé": "recepisse", "récépissés": "recepisse",
    "CEDEAO": "cedeao",
    "accréditation": "accreditation", "accréditations": "accreditation",
    "BTS": "bts-dut-but", "DUT": "bts-dut-but", "BUT": "bts-dut-but",
    "IUT": "iut",
    "traducteur assermenté": "traducteur-assermente", "traducteurs assermentés": "traducteur-assermente"
  };
  for (const [forme, id] of Object.entries(formes)) {
    const trouves = motsTechniques(`Il faut joindre ${forme} au dossier.`).map((m) => m.id);
    assert.ok(trouves.includes(id), `« ${forme} » n'est pas reconnu comme ${id}`);
  }

  // « BUT » RESTE SENSIBLE À LA CASSE. Sans cette garde, le glossaire
  // expliquerait « mon but est clair » comme un diplôme court.
  assert.equal(motsTechniques("Mon but est clair et mes buts aussi.").length, 0,
    "« but » en minuscules est expliqué comme un diplôme : le drapeau i est revenu sur le motif");

  // ET CES MOTS SONT BIEN DITS SUR LA ROUTE, par le chemin du lot R23.
  const vus = new Set();
  for (const pays of COUCHES.map((c) => c.pays).filter(Boolean)) {
    const procedure = trouverProcedure({ paysDestination: "France", paysResidence: pays });
    const route = construireRoute({ procedure, profile: { country: pays, nationality: pays }, aujourdhui: new Date("2026-09-18") });
    for (const e of route.etapes) {
      const consigne = (e.officielle && e.officielle.consigne) || "";
      for (const m of motsTechniques(consigne)) vus.add(m.id);
      for (const m of motsTechniques(e.enClair || "")) vus.add(m.id);
    }
  }
  for (const attendu of ["accreditation", "bts-dut-but", "traducteur-assermente"]) {
    assert.ok(vus.has(attendu), `« ${attendu} » n'est dit nulle part sur la route, alors qu'il y est écrit`);
  }

});
