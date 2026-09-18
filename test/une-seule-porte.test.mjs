/**
 * ============================================================
 * test/une-seule-porte.test.mjs — L'ESPACE PRÉINSCRIPTION N'A PLUS
 * QU'UNE PORTE POUR SES VŒUX
 * ============================================================
 *
 * CE QUI S'EST PASSÉ (2026-09-18) : le bouton « Nouvelle candidature »
 * d'applications.html ne restait QUE pour la préinscription. C'était
 * donc, depuis la refonte, la seconde façon de créer un vœu — avec son
 * vieux formulaire de dix champs (bourse, statut, date, fréquence,
 * notes, portail facultatif…) à côté des TROIS champs de l'étape 3, et
 * un portail facultatif qui pouvait naître vide, ce qui faisait taire
 * toute la procédure pour ce vœu.
 *
 * Ce dépôt a déjà payé TROIS fois le prix des deux chemins, en deux
 * jours : la lettre d'un vœu à Lille qui partait pour la Chine (R5), le
 * chemin qui n'appelait pas la fonction corrigée (R6), le sélecteur qui
 * proposait les candidatures de l'autre espace (R7). On ferme la
 * seconde porte au lieu d'attendre la quatrième.
 *
 * LES RÈGLES GARDÉES ICI :
 *   1. plus aucun bouton de création — ni dans applications.html, ni
 *      dans applications.js, et plus aucun appel à openModal(null) ;
 *   2. un vieux `?action=new` renvoie à l'étape 3, il n'ouvre rien, et
 *      le renvoi passe AVANT que la page lise le paramètre ;
 *   3. la page DIT où les vœux se posent, avec le lien — y compris dans
 *      son état vide, qui est justement l'écran où l'on cherche un
 *      bouton ;
 *   4. elle reste ENTIÈRE pour l'espace bourses ;
 *   5. plus aucun lien de la préinscription ne sort vers elle ;
 *   6. plus aucun lien du site ne porte `?action=new` — le paramètre
 *      n'ouvre plus rien, ni ici ni côté bourses, donc un lien qui le
 *      porte promet un écran qui ne vient jamais ;
 *   7. la route n'a plus sa copie locale de `formatMontant` ;
 *   8. le texte PARTAGÉ de la page ne parle plus « bourse » à un vœu —
 *      trouvé en recette navigateur, pas à la lecture du code ;
 *   9. et le « dossier » d'un vœu renvoie à l'étape 4 de la route au
 *      lieu de la refaire (lot B2).
 *
 * DOUZE MUTATIONS VÉRIFIÉES (2026-09-18), chacune fait tomber un test :
 *   — le bouton revient, caché, dans applications.html            → échec
 *   — la phrase de la règle est remplacée                          → échec
 *   — l'état vide redit « ajoutez vos vœux ici »                   → échec
 *   — un openModal(null) est rebranché                             → échec
 *   — la règle redevient cachée en préinscription                  → échec
 *   — le renvoi est déplacé APRÈS la lecture de `shouldOpen`       → échec
 *   — le bouton de l'espace bourses reprend `?action=new`          → échec
 *   — le hub relie de nouveau le formulaire de création            → échec
 *   — l'intro partagée reparle des « exigences de cette bourse »    → échec
 *   — le vocabulaire des bourses atteint la carte d'un vœu        → échec
 *   — le renvoi vers l'étape 4 passe après les groupes des bourses → échec
 *   — le renvoi vers l'étape 4 disparaît de la carte d'un vœu      → échec
 *   — les éléments déjà saisis sur un vœu sont cachés              → échec
 *   — le style du lien vers l'étape 4 est retiré                   → échec
 *
 * MÉTHODE : les assertions lisent le CODE, pas le fichier brut
 * (`codeSeul`), parce que ces modules racontent en commentaire le défaut
 * qu'ils corrigent — et citent donc les tournures interdites. Et la
 * phrase de la règle est comparée DÉSÉCHAPPÉE (`phraseLue`) : pinner
 * `l\'étape` casserait au premier passage en gabarit sans qu'un mot ait
 * changé à l'écran.
 *
 * Fins de ligne : tout fichier lu ici passe par .replace(/\r\n/g,"\n").
 * ============================================================
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { formatMontant } from "../js/diagnostic-france.js";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(racine, f), "utf8").replace(/\r\n/g, "\n");
// Le code seul. Les commentaires JS ET les commentaires HTML tombent :
// ces modules racontent le défaut qu'ils corrigent, et certains gabarits
// portent des commentaires HTML DANS des chaînes JS. Même leçon qu'aux
// lots R11 et R12 — un test qui interdit un mot lit le code, pas la
// prose qui explique pourquoi le mot est interdit.
const codeSeul = (f) => lire(f)
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/^\s*\/\/.*$/gm, "")
  .replace(/<!--[\s\S]*?-->/g, "");

// La phrase que l'étudiant LIT, et non la façon dont elle est écrite
// dans le code : le littéral est en apostrophes simples, donc chaque
// apostrophe française y est échappée (`l\\'étape`). Un test qui pinerait
// l'échappement casserait au premier passage en gabarit (`...`) sans
// qu'un seul mot ait changé à l'écran. On désescape avant de comparer.
const phraseLue = (code, marqueur) => {
  const i = code.indexOf(marqueur);
  assert.notEqual(i, -1, `phrase introuvable : ${marqueur}`);
  const debut = code.lastIndexOf("=", i) + 1;
  const fin = code.indexOf("\n", i);
  return code.slice(debut, fin === -1 ? undefined : fin).replace(/\\'/g, "'").trim();
};

test("porte 1 — applications.html ne crée plus aucun vœu, et renvoie à l'étape 3", () => {
  const code = codeSeul("applications.js");
  const html = codeSeul("applications.html");

  // LE BOUTON N'EXISTE PLUS, NI DANS LA PAGE NI DANS LE SCRIPT.
  // Il n'était montré qu'en préinscription (`creationManuelle`) ; le
  // laisser caché dans le HTML avec un écouteur de clic branché dessus,
  // c'était garder la porte fermée sans clé — la prochaine passe l'aurait
  // crue vivante et rouverte. On retire les deux.
  assert.ok(!/addApplicationBtn/.test(html), "le bouton de création est encore dans applications.html");
  assert.ok(!/addApplicationBtn|addBtn/.test(code), "applications.js touche encore au bouton de création");
  assert.ok(!/creationManuelle/.test(code), "la variable qui n'ouvrait le bouton qu'en préinscription doit disparaître");
  assert.ok(!/prerempli/.test(code), "le pré-remplissage du vieux formulaire doit disparaître avec lui");

  // Et le seul appel restant à openModal() est l'ÉDITION d'une carte
  // existante : plus personne n'appelle openModal(null).
  assert.equal([...code.matchAll(/openModal\(/g)].length, 2, "openModal : sa déclaration et le bouton Modifier, rien d'autre");
  assert.ok(!/openModal\(null\)/.test(code), "un appel crée encore une candidature à la main");

  // Un vieux lien `?action=new` — signet, message, page en cache — ne
  // doit pas ouvrir le formulaire de dix champs : il renvoie à l'étape 3.
  assert.match(code, /ESPACE_ECRITURE === "preinscription" && params\.get\("action"\) === "new"/);
  assert.match(code, /window\.location\.replace\("espace-preinscription\.html\?etape=voeux"\)/);
  // Le renvoi passe AVANT la lecture de `shouldOpen` : après, la page
  // aurait le temps d'agir sur le paramètre qu'elle est censée refuser.
  assert.ok(
    code.indexOf('window.location.replace("espace-preinscription.html?etape=voeux")') < code.indexOf("const shouldOpen"),
    "le renvoi doit précéder l'ouverture du formulaire"
  );

  // LA PAGE DIT OÙ LES VŒUX SE POSENT — sans quoi l'étudiant qui
  // cherchait son bouton ne trouve qu'une liste et aucune explication.
  const regle = phraseLue(code, "Vos vœux se posent");
  assert.match(regle, /Vos vœux se posent dans votre route, à l'étape 3/);
  assert.match(regle, /Cette page vous les montre, elle ne les crée plus\./);
  assert.match(regle, /<a href="espace-preinscription\.html\?etape=voeux">Ouvrir l'étape 3<\/a>/);
  assert.match(code, /regle\.hidden = false;/, "la règle doit être visible dans les DEUX espaces");

  // ET LE LIEN DOIT SE VOIR. Le style de base du site est
  // `a{text-decoration:none;color:inherit}` : sans une règle propre à cet
  // encart, le seul pointeur vers la porte s'afficherait dans le gris du
  // paragraphe, sans soulignement — un lien invisible pour l'étudiant qui
  // cherche justement son bouton disparu.
  const feuille = lire("applications.css");
  const i = feuille.indexOf(".fitz-regle a{");
  assert.notEqual(i, -1, "applications.css n'a plus de style pour le lien de la règle");
  const bloc = feuille.slice(i, feuille.indexOf("}", i));
  assert.match(bloc, /text-decoration:underline/);
  assert.match(bloc, /color:var\(--amber-700\)/);

  // Y COMPRIS QUAND LA LISTE EST VIDE : c'est là qu'on cherche un bouton.
  // L'état vide disait « en préinscription, ajoutez vos vœux ici » — la
  // phrase exacte que ce lot rend fausse.
  const vide = html.slice(html.indexOf('id="applicationsEmpty"'));
  assert.ok(!/ajoutez vos vœux ici/.test(vide), "l'état vide envoie encore créer un vœu sur cette page");
  assert.match(vide, /vos vœux se posent à l'étape 3 de votre route/);
});

test("porte 2 — la page reste ENTIÈRE pour l'espace bourses", () => {
  // Ce lot ferme une porte de l'espace préinscription ; il ne touche pas
  // au gestionnaire de candidatures de l'espace bourses, dont six pages
  // dépendent (espace-bourse, dashboard, details, profile, payment,
  // documents).
  const code = codeSeul("applications.js");
  assert.match(code, /regle\.textContent = PHRASE_REGLE;/, "la règle de Fitz reste affichée côté bourses");
  assert.match(code, /accepterToutBtn/, "« J'accepte les choix de Fitz » reste");
  // Le filtre par espace, posé au lot S4, est intact.
  assert.match(code, /return ESPACE \? toutes\.filter\(\(app\) => lireParcours\(app\) === ESPACE\) : toutes;/);
  // Et la liste reste lisible en préinscription : on retire la CRÉATION,
  // pas la consultation.
  assert.ok(!/ESPACE_ECRITURE === "preinscription"\) \{ *\n* *document\.getElementById\("applicationsList"\)/.test(code));
});

test("porte 3 — plus aucun lien de la préinscription ne sort vers applications.html", () => {
  // La route ne l'a jamais liée depuis le lot R1. Restait le lien
  // secondaire d'ai-check : pour un vœu, il menait à la page de l'espace
  // BOURSES alors que le lien de retour de la même page disait déjà
  // « Retour à l'étape 9 ». Deux liens, deux destinations, une mauvaise.
  const check = codeSeul("ai-check.js");
  assert.match(check, /const versLaRoute = parcoursDOutil\(\{ espace: ctx\.espace, application \}\) === "preinscription";/);
  assert.match(check, /contextBackLink\.hidden = versLaRoute;/);
  assert.match(check, /if \(!versLaRoute\) contextBackLink\.href = `applications\.html#\$\{application\.id\}`;/);

  // La route, elle, ne la mentionne nulle part.
  for (const f of ["espace-preinscription.js", "js/route-preinscription.js"]) {
    assert.ok(!/applications\.html/.test(codeSeul(f)), `${f} lie encore applications.html`);
  }
});

test("porte 4 — la route n'a plus sa copie locale de formatMontant", () => {
  // Deuxième copie d'une règle trouvée dans ce fichier après la date
  // (lot R9). La fonction partagée fait deux choses de plus, et les deux
  // comptent pour un étudiant.
  const moteur = codeSeul("espace-preinscription.js");
  assert.ok(!/function formatMontant/.test(moteur), "la copie locale est revenue");
  assert.match(moteur, /import \{ HORS_TOTAL, formatMontant \} from "\.\/js\/diagnostic-france\.js";/);

  // Ce que la version partagée fait de mieux :
  assert.equal(formatMontant(12000, "MAD"), "12 000 Dhs", "le dirham s'écrit « Dhs » au Maroc, pas « MAD »");
  assert.equal(formatMontant(13562.5, "EUR"), "13 562,50 €", "un euro porte deux décimales");
  assert.equal(formatMontant(85000, "XOF"), "85 000 F CFA");

  // ET LE PIÈGE VÉRIFIÉ AVANT LE REMPLACEMENT : sur une valeur absente,
  // la fonction partagée rend « 0 F CFA » là où la locale rendait "".
  // Les deux appels de la page doivent donc rester gardés.
  assert.equal(formatMontant(null, "XOF"), "0 F CFA");
  const appels = [...lire("espace-preinscription.js").matchAll(/formatMontant\(/g)].length;
  assert.equal(appels, 2, `${appels} appels : chaque nouvel appel doit être gardé par un test de type`);
  assert.match(moteur, /typeof o\.montant === "number"\) parts\.push/);
  assert.match(moteur, /typeof d\.totalAnnuelEUR === "number" \? `\$\{formatMontant/);
});

test("porte 5 — plus aucun lien du site ne porte `?action=new`", () => {
  // LA CONTREPARTIE DE LA REDIRECTION. applications.html renvoie
  // maintenant un `?action=new` de préinscription vers l'étape 3, et ne
  // fait plus rien de ce paramètre côté bourses (Fitz y remplit les
  // places depuis le lot FITZ-CHOISIT). Un lien qui le porte encore
  // promet donc un écran qui ne vient jamais — et espace-bourse.html en
  // portait un, VISIBLE et cliqué, sous le libellé « Suivre une
  // candidature ». Le paramètre ne doit plus apparaître dans aucune
  // cible de lien du site.
  const pages = readdirSync(racine).filter((f) => /\.(js|html)$/.test(f) && !f.startsWith("_"));
  const fautifs = [];
  for (const f of pages) {
    const src = codeSeul(f);
    if (/applications\.html\?action=new/.test(src)) fautifs.push(f);
  }
  assert.deepEqual(fautifs, [], `ces fichiers lient encore le formulaire de création : ${fautifs.join(", ")}`);

  // Et le bouton de l'espace bourses dit ce qu'il fait, des deux côtés
  // du verrou : `data-real-href` est remis en place au déverrouillage
  // (js/app-shell.js), donc les deux doivent porter la même cible.
  const bourse = codeSeul("espace-bourse.html");
  assert.match(bourse, /<a href="applications\.html" data-real-href="applications\.html"[^>]*>/);
  assert.ok(!/Suivre une candidature/.test(bourse), "le libellé promet encore une création");
});

test("porte 6 — la page ne parle plus « bourse » à un vœu", () => {
  // TROUVÉ EN RECETTE NAVIGATEUR, pas à la lecture du code (2026-09-18).
  // L'encart du lot R13 indique à un client Dossier France où poser ses
  // vœux. Juste au-dessus, la page lui disait « les exigences de cette
  // bourse précise » et « un portail universitaire » — son portail est
  // Études en France, et il n'a pas de bourse. Et sur la carte de son
  // vœu, l'état vide du dossier disait « Ajouter les exigences de cette
  // bourse ». Deux mots faux sur la page où il cherchait sa porte.
  //
  // Cette page sert les DEUX espaces : son texte partagé ne peut donc
  // parler la langue d'un seul.
  const intro = codeSeul("applications.html");
  const i = intro.indexOf('class="apps-intro"');
  assert.notEqual(i, -1, "la section d'intro a disparu");
  const bloc = intro.slice(i, intro.indexOf("</section>", i));
  assert.ok(!/bourse/i.test(bloc), "l'intro partagée parle encore de bourse");
  assert.ok(!/portail universitaire/.test(bloc), "le portail d'un vœu est Études en France, pas un portail d'université");

  // RÉÉCRIT EN CONSCIENCE le 2026-09-18 (lot B2). Ce test pinait l'état
  // vide de la carte d'un vœu — « Rien ajouté pour l'instant » au lieu
  // d'« Ajouter les exigences de cette bourse » — et l'ordre du ternaire
  // qui le choisissait. Le lot B2 va plus loin : un vœu ne traverse plus
  // ce bloc du tout, il est renvoyé à l'étape 4 avant que les groupes
  // des bourses ne soient calculés. L'état vide qu'on gardait n'existe
  // donc plus, et sa règle est devenue un cas particulier d'une règle
  // plus forte, tenue par « porte 7 ».
  //
  // CE QU'ON GARDE ICI : le vocabulaire des bourses ne doit atteindre
  // aucune carte de vœu, quel que soit le chemin.
  const code = codeSeul("applications.js");
  const j = code.indexOf("function htmlDossierDeVoeu");
  const pourLeVoeu = code.slice(j, code.indexOf("function renderChecklistSection", j));
  assert.ok(!/bourse/i.test(pourLeVoeu), "le bloc servi à un vœu nomme encore une bourse");

  // Et la branche des bourses garde SON vocabulaire : ces lots ne lui
  // retirent rien, ils cessent seulement de le servir à l'autre parcours.
  const k = code.indexOf("app-checklist-toggle");
  const toggle = code.slice(k, code.indexOf("checklist-groups", k));
  assert.match(toggle, /Ajouter les exigences de cette bourse/);
  assert.match(toggle, /Fitz connaît les exigences de cette bourse/);
});

test("porte 7 — le dossier d'un vœu renvoie à l'étape 4, il ne la refait pas", () => {
  // RÉSERVE DU LOT R13, TRANCHÉE AU LOT B2. Le bloc « Dossier de
  // candidature » proposait à un vœu trois groupes du vocabulaire des
  // bourses — lettres de recommandation, test de langue, preuve
  // financière. Or Études en France ne demande aucune lettre de
  // recommandation, les pièces d'une préinscription sont au niveau du
  // DOSSIER (le même diplôme sert les sept vœux), et la preuve
  // financière a déjà l'étape 2.
  const code = codeSeul("applications.js");

  // Le renvoi existe, et il passe AVANT le calcul des groupes bourses :
  // rien de ce qui suit ne concerne un vœu.
  assert.match(code, /if \(lireParcours\(app\) === "preinscription"\) return htmlDossierDeVoeu\(app, checklist\);/);
  const i = code.indexOf("function renderChecklistSection");
  const fn = code.slice(i, code.indexOf("\n}", code.indexOf("app-checklist-toggle", i)));
  assert.ok(fn.indexOf("return htmlDossierDeVoeu") < fn.indexOf("CHECKLIST_TYPE_META"),
    "le renvoi doit précéder la construction des groupes");

  // Il mène à l'étape 4, et dit pourquoi il n'y a rien à faire ici.
  const j = code.indexOf("function htmlDossierDeVoeu");
  const bloc = code.slice(j, code.indexOf("\n}", code.indexOf("app-voeu-pieces", j)));
  assert.match(bloc, /espace-preinscription\.html\?etape=pieces/);
  assert.match(bloc, /Elles valent pour tous vos vœux/);
  assert.ok(!/recommandation|Non demandée|Demander une lettre/i.test(bloc),
    "le vocabulaire des bourses est revenu sur la carte d'un vœu");

  // CE QUI A ÉTÉ SAISI N'EST PAS CACHÉ : les éléments existants restent
  // rendus par le composant d'origine, donc supprimables.
  assert.match(bloc, /items\.map\(\(item\) => renderChecklistItem\(item, app\)\)/);
  assert.match(bloc, /ils ne sont plus lus nulle part/);

  // Et le lien se voit — même piège qu'au lot R13 sur .fitz-regle.
  const css = lire("applications.css");
  const k = css.indexOf(".app-voeu-pieces a{");
  assert.notEqual(k, -1, "le lien vers l'étape 4 n'a pas de style : il s'afficherait comme du texte");
  assert.match(css.slice(k, css.indexOf("}", k)), /text-decoration:underline/);

  // L'espace bourses garde SON dossier, entier.
  assert.match(code, /data-action="toggle-checklist"/);
  assert.match(code, /Ajouter les exigences de cette bourse/);

  // ET LA CARTE DOIT ENCORE S'AFFICHER (lot B2-bis, 2026-09-18).
  // Le lot B2 a livré ce renvoi sans garder les deux liaisons qui
  // cherchaient le bouton de repli et les groupes : sur une carte de
  // vœu, `querySelector(...)` rendait null et la ligne suivante levait
  // un TypeError — la carte entière disparaissait. Vu dans le
  // navigateur, pas ici : ces tests lisent le code, pas l'écran. La
  // règle gardée est donc celle qui manquait — un balisage devenu
  // conditionnel se lie avec précaution.
  assert.match(code, /querySelector\('\[data-action="toggle-checklist"\]'\)\?\.addEventListener/,
    "la liaison du bouton de repli doit tolérer son absence sur un vœu");
  assert.match(code, /const checklistGroupsEl = checklistEl\.querySelector\("\.checklist-groups"\);\s*\n\s*if \(!checklistGroupsEl\) return;/,
    "focusChecklist doit tolérer l'absence de groupes sur un vœu");
});
