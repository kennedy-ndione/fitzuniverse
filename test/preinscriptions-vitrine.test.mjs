/**
* ============================================================
* test/preinscriptions-vitrine.test.mjs — la ligne gratuit / payant
* ============================================================
*
* CE QUE CE LOT CORRIGE, ET CE QUE CE FICHIER TIENT.
*
* preinscriptions.html donnait gratuitement ce que le Diagnostic
* (10 000 F) et le Dossier France (75 000 F) vendent : le contenu des
* onze étapes, les frais de dossier par pays, le nom de la banque, le
* moment du paiement, les dates du calendrier. Et elle affichait six
* destinations à « 0 établissement avec coût vérifié · procédure à
* venir » — un zéro répété six fois ne dit pas « ambitieux », il dit
* « pas prêt », et il abîmait la seule carte excellente.
*
* LA LIGNE, ET ELLE COMMANDE TOUT : publier la RÈGLE, vendre le CALCUL.
*
*   PUBLIC   les seuils et droits français avec source et date, la règle
*            des sept vœux, le NOMBRE d'étapes, la LISTE des pays de
*            résidence vérifiés.
*   CLIENT   le contenu des onze étapes, les frais de dossier par pays,
*            la banque, le moment du paiement, les dates, les points de
*            vigilance.
*
* Les faits « client » restent dans les données et continuent
* d'alimenter le Diagnostic et l'espace client — c'est leur AFFICHAGE
* PUBLIC qui est retiré. Deux tests le vérifient dans les deux sens : ce
* qui doit disparaître des pages publiques, et ce qui doit rester dans
* les données.
*
* ET LA PRÉPARATION DES DESTINATIONS SUIVANTES : ouvrir la Roumanie doit
* être purement documentaire — écrire les données, basculer un champ,
* copier une page. Si ouvrir une destination oblige à modifier un
* module, ce lot a raté. Le test « basculer suffit » est celui-là.
*
* Fins de ligne : tout fichier lu ici passe par .replace(/\r\n/g,"\n").
* ============================================================
*/

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import {
PAYS,
lirePays,
ACCOMPAGNEMENT,
CONTRAT_DESTINATION,
DIFFUSION,
DIFFUSION_PAR_DEFAUT,
estOuverte,
destinationsOuvertes,
destinationsAVenir,
pageDeDestination,
diffusionDuFait,
faitsPublics,
faitsClients,
defautsDeDestination,
etatDunPays
} from "../js/pays-preinscription.js";

import { trouverProcedure, residencesDocumentees } from "../js/procedures/index.js";
import { COUCHES } from "../js/procedures/residences/index.js";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(racine, f), "utf8").replace(/\r\n/g, "\n");

const HUB = "preinscriptions.html";
const HUB_JS = "js/preinscriptions-page.js";
const DEST_JS = "js/preinscription-destination.js";

const procedureDe = (pays) => trouverProcedure({ paysDestination: pays.nom });

// Les pages qu'un visiteur sans compte peut ouvrir, et où la règle du
// lot s'applique. offers.html en fait partie : c'est la grille publique.
const PAGES_PUBLIQUES = [HUB, "preinscription-france.html", "offers.html", "universities.html", "scholarships.html", "index.html"];

// ------------------------------------------------------------------
// 1. LE CHAMP COMMERCIAL — une décision de vente, pas une conséquence
// ------------------------------------------------------------------

test("chaque destination porte un `accompagnement` du vocabulaire fermé", () => {

assert.deepEqual(ACCOMPAGNEMENT, ["ouvert", "a_venir"]);

for (const p of PAYS) {
assert.ok(ACCOMPAGNEMENT.includes(p.accompagnement), `${p.nom} : accompagnement « ${p.accompagnement} » hors vocabulaire`);
}

// CHANGÉ EN CONSCIENCE LE 2026-09-23 : les sept destinations sont
// vendues. Jusqu'à ce jour, la France seule ; les six autres ont reçu
// leur route (js/route-destination.js), leur diagnostic
// (js/diagnostic-pays.js), leur page et leur achat par pays
// (functions/lib/achat.js). Refermer un pays = le repasser « a_venir »
// ICI et dans les données, en même temps.
// Et le soir même, la Chine et la Malaisie, au même prix.
assert.deepEqual(destinationsOuvertes().map((p) => p.nom), ["France", "Roumanie", "Turquie", "Maroc", "Italie", "Allemagne", "Canada", "Chine", "Malaisie"]);
assert.deepEqual(destinationsAVenir().map((p) => p.nom), []);

// `accompagnement` ne se DÉDUIT pas de `procedure` : la France est
// vendue alors que sa fiche pays dit encore « en_cours » (c'est un
// plancher, voir codeProcedurePour). Confondre les deux ferait ouvrir
// ou fermer une destination sans que personne l'ait décidé.
const france = PAYS.find((p) => p.id === "france");
assert.equal(france.accompagnement, "ouvert");
assert.equal(france.procedure, "en_cours");

});

// ------------------------------------------------------------------
// 2. LE CONTRAT — ce qui empêche d'ouvrir à moitié
// ------------------------------------------------------------------

test("toute destination « ouvert » tient le contrat, et il est écrit en clair", () => {

// Le contrat est déclaré dans le module, pas seulement dans ce test :
// la personne qui ouvrira la Roumanie lira le fichier, pas ce fichier-ci.
assert.deepEqual(CONTRAT_DESTINATION, ["nom", "code", "langue", "positionnement", "portail", "procedure", "faitPublic"]);

for (const p of destinationsOuvertes()) {
const defauts = defautsDeDestination(p, { procedure: procedureDe(p) });
assert.deepEqual(defauts, [], `${p.nom} est vendue mais incomplète : ${defauts.join(" ; ")}`);
assert.ok(existsSync(join(racine, "assets/flags", `${p.code}.svg`)), `${p.nom} : drapeau absent`);
assert.ok(existsSync(join(racine, pageDeDestination(p))), `${p.nom} : ${pageDeDestination(p)} n'existe pas`);
}

});

test("un pays marqué « ouvert » sans l'un des champs du contrat fait ÉCHOUER la suite", () => {

const france = PAYS.find((p) => p.id === "france");
const procedure = procedureDe(france);

// Le témoin sain d'abord : sans lui, les cas fautifs ci-dessous
// prouveraient n'importe quoi.
assert.deepEqual(defautsDeDestination(france, { procedure }), []);

const amputations = [
[{ nom: "" }, /nom manquant/],
[{ code: "" }, /code de drapeau/],
[{ langue: [] }, /langue/],
[{ positionnement: "  " }, /positionnement/],
[{ portail: null }, /portail/],
[{ portail: { nom: "X", url: "pas-une-url" } }, /portail/],
[{ accompagnement: "peut-etre" }, /hors vocabulaire/],
[{ faits: [] }, /aucun fait sourcé/],
// Un fait présent mais NON diffusable : la page publique n'aurait
// aucune preuve à montrer, et c'est la preuve qui vend.
[{ faits: france.faits.map((f) => ({ ...f, diffusion: "client" })) }, /aucun fait public/],
// Un fait public mais sans source : il ne compte pas.
[{ faits: [{ texte: "x", diffusion: "public" }] }, /aucun fait/]
];

for (const [amputation, motif] of amputations) {
const defauts = defautsDeDestination({ ...france, ...amputation }, { procedure });
assert.ok(defauts.some((d) => motif.test(d)), `attendu ${motif} — reçu ${JSON.stringify(defauts)}`);
}

// Et sans procédure composée : une destination vendue dont personne ne
// connaît les étapes.
assert.ok(defautsDeDestination(france, { procedure: null }).some((d) => /procédure de portail/.test(d)));
assert.ok(defautsDeDestination(france, { procedure: { etapes: [] } }).some((d) => /procédure de portail/.test(d)));

// RÉÉCRIT EN CONSCIENCE LE 2026-09-13 (lot S3).
//
// Ce bloc affirmait : « les six destinations à venir ne tiendraient PAS
// le contrat aujourd'hui — c'est précisément pourquoi elles ne sont pas
// vendues ». C'était vrai le jour de son écriture, et son auteur avait
// prévu celui-ci : le message d'échec disait déjà quoi faire —
// « elle pourrait être ouverte, ou le contrat est trop lâche ».
//
// C'est la première branche. Le lot S3 a écrit les six procédures
// manquantes (81 étapes), rempli les six portails, et remplacé les faits
// sourcés sur des agrégateurs par des sources officielles. Les six
// tiennent donc le contrat de DONNÉES. Ce qui les retient n'est plus une
// lacune : c'est une décision commerciale (`accompagnement`) et une page
// de destination qui n'est pas encore écrite.
//
// La garde qui remplace est PLUS dure, et c'est voulu : elle porte sur
// les SEPT pays, pas sur la seule France, et elle tombe si un lot futur
// retire à l'un d'eux son portail, son fait public ou sa procédure.
for (const p of PAYS) {
const defautsDuPays = defautsDeDestination(p, { procedure: procedureDe(p) });
assert.deepEqual(defautsDuPays, [], `${p.nom} ne tient plus le contrat de données : ${defautsDuPays.join(" ; ")}`);
}

// Et on nomme ici ce qui sépare désormais une destination NOMMÉE d'une
// destination VENDUE, pour que personne ne le cherche dans les données :
// le champ `accompagnement`, et rien d'autre.
for (const p of destinationsAVenir()) {
assert.equal(p.accompagnement, "a_venir", `${p.nom} : destination à venir dont l'accompagnement n'est pas « a_venir »`);
}

});

// ------------------------------------------------------------------
// 3. LA DIFFUSION — publier la règle, vendre le calcul
// ------------------------------------------------------------------

test("un fait sans `diffusion` déclarée n'est PAS public", () => {

assert.deepEqual(DIFFUSION, ["public", "client"]);
assert.equal(DIFFUSION_PAR_DEFAUT, "client");

// Le défaut SÛR : oublier de publier une règle se voit et se corrige,
// publier par inadvertance ce qu'on vend ne se rattrape pas.
assert.equal(diffusionDuFait({ texte: "x" }), "client");
assert.equal(diffusionDuFait({ texte: "x", diffusion: "publique" }), "client", "une valeur hors vocabulaire retombe sur le défaut sûr");
assert.equal(diffusionDuFait(null), "client");
assert.equal(diffusionDuFait({ diffusion: "public" }), "public");

const france = PAYS.find((p) => p.id === "france");

// Les trois règles publiées, et elles seules.
assert.deepEqual(faitsPublics(france).map((f) => f.cle), ["ressources", "droits", "procedure"]);
assert.deepEqual(faitsClients(france).map((f) => f.cle), ["fraisDossier", "calendrier"]);

// Chaque fait public porte source ET date : c'est toute la valeur de
// la preuve.
for (const f of faitsPublics(france)) {
assert.match(f.source, /^https?:\/\//, `${f.cle} : sans source`);
assert.match(f.verifieLe, /^\d{4}-\d{2}-\d{2}$/, `${f.cle} : sans date`);
}

});

test("LES FAITS CLIENTS RESTENT DANS LES DONNÉES — seul leur affichage public est retiré", () => {

const france = PAYS.find((p) => p.id === "france");

// Ce lot ne supprime AUCUN fait : le Diagnostic et l'espace client les
// lisent toujours. Les retirer aurait cassé le produit payant en
// voulant protéger le produit payant.
const frais = france.faits.find((f) => f.cle === "fraisDossier");
assert.ok(frais, "le fait fraisDossier a disparu des données");
assert.equal(frais.montant, 85000);
assert.match(frais.texte, /SUNU BANK/);
assert.equal(frais.residence, "Sénégal");

const calendrier = france.faits.find((f) => f.cle === "calendrier");
assert.ok(calendrier, "le fait calendrier a disparu des données");
assert.match(calendrier.texte, /1er octobre/);

// Et les couches de résidence gardent tout : montants, banques,
// vigilance. C'est ce que le Dossier France livre.
assert.equal(COUCHES.length, 8);
for (const c of COUCHES) {
assert.ok(c.faits.fraisDossier.montant > 0, `${c.pays} : montant perdu`);
assert.ok((c.pointsDeVigilance || []).length >= 1, `${c.pays} : vigilance perdue`);
}

});

// ------------------------------------------------------------------
// 4. CE QUI DOIT DISPARAÎTRE DES PAGES PUBLIQUES
// ------------------------------------------------------------------

// Exactement les chaînes que le Diagnostic et le Dossier France vendent.
// Le test porte sur le HTML SERVI et sur les modules qui le rendent —
// pas sur les commentaires, qui ont le droit de raconter la règle.
const CHAINES_INTERDITES = [
"SUNU BANK", "85 000", "80 000", "1 500 000", "1 900 Dhs",
"1er octobre", "15 décembre", "27 juillet", "Société Générale", "TLS Contact", "VISTA-GUI"
];

function sansCommentaires(source) {
return source
.replace(/<!--[\s\S]*?-->/g, " ")
.replace(/\/\*[\s\S]*?\*\//g, " ")
.replace(/(^|[^:"'`\\])\/\/[^\n]*/g, "$1");
}

test("aucune page publique ne porte les chaînes que le Diagnostic vend", () => {

const fautes = [];

for (const fichier of [...PAGES_PUBLIQUES, HUB_JS, DEST_JS, "pricing-plans.js"]) {
const source = sansCommentaires(lire(fichier));
for (const interdite of CHAINES_INTERDITES) {
if (source.includes(interdite)) fautes.push(`${fichier} : « ${interdite} »`);
}
}

assert.deepEqual(fautes, [], `publier la règle, vendre le calcul :\n${fautes.join("\n")}`);

});

test("le hub ne rend plus les onze étapes, ni les faits clients", () => {

const hub = lire(HUB);
const hubJs = sansCommentaires(lire(HUB_JS));

// Le dépliant des onze étapes n'existe plus : c'était le contenu même
// du Dossier France, offert.
assert.ok(!hub.includes("pre-procedure"), "le dépliant des étapes survit dans le HTML");
assert.ok(!hubJs.includes("texteConsigne"), "le hub rend encore les consignes");
assert.ok(!hubJs.includes("renderProcedure"), "le hub rend encore la procédure");

// Et la liste brute des faits France a disparu du hub : elle mélangeait
// règles publiques et faits clients.
assert.ok(!hub.includes('id="faitsFrance"'), "la liste des faits France survit sur le hub");
assert.ok(!hubJs.includes("renderFait"), "le hub rend encore des faits bruts");

// La seule porte vers les faits, sur les pages publiques, est
// faitsPublics() : jamais `pays.faits` en direct.
const dest = sansCommentaires(lire(DEST_JS));
assert.ok(dest.includes("faitsPublics"), "la page de destination doit passer par faitsPublics()");
assert.ok(!/\bpays\.faits\b/.test(dest), "la page de destination lit les faits en direct");
assert.ok(!/\bpays\.faits\b/.test(hubJs), "le hub lit les faits en direct");

});

// ------------------------------------------------------------------
// 5. LE HUB — construit depuis les données, et sobre sur ce qu'il n'a pas
// ------------------------------------------------------------------

test("le hub ne contient aucun nom de pays ni compteur écrit en dur", () => {

const hub = sansCommentaires(lire(HUB));

for (const p of PAYS) {
assert.ok(!hub.includes(`>${p.nom}<`), `${p.nom} écrit en dur dans le HTML du hub`);
assert.ok(!hub.includes(pageDeDestination(p)), `${pageDeDestination(p)} écrit en dur dans le HTML du hub`);
}

// Aucun effectif figé : le premier établissement ajouté au catalogue
// ferait mentir un chiffre tapé à la main.
const etat = etatDunPays(PAYS.find((p) => p.id === "france"), JSON.parse(lire("assets/data/catalogue.json")));
assert.ok(!hub.includes(String(etat.etablissements)), "un effectif est écrit en dur dans le hub");

// Et la liste vient bien du module, dans l'ordre du registre.
const js = lire(HUB_JS);
assert.ok(js.includes("lirePays()"), "le hub doit lire la liste des pays");
assert.ok(js.includes("estOuverte(p)"), "le hub ne décide QUE sur `accompagnement`");
assert.ok(js.includes("pageDeDestination(pays)"), "le chemin de la page se calcule");

});

test("une destination « a_venir » n'affiche ni bouton, ni compteur, ni zéro", () => {

// Commentaires retirés d'abord : le JSDoc de la fonction SUIVANTE
// parle d'effectifs, et la découpe l'emportait avec elle. On lit ce
// qui est EXÉCUTÉ, pas ce qui est raconté autour.
const js = sansCommentaires(lire(HUB_JS));

const debut = js.indexOf("function carteAVenir(pays) {");
assert.notEqual(debut, -1, "carteAVenir introuvable");
const corps = js.slice(debut, js.indexOf("\nfunction ", debut + 10));

assert.ok(!/<a\b/.test(corps), "un lien sur une destination à venir");
assert.ok(!/btn\b/.test(corps), "un bouton sur une destination à venir");
assert.ok(!/etablissements|coutsVerifies|etatDunPays/.test(corps), "un compteur sur une destination à venir");
assert.ok(!/libelleProcedure|procedure/.test(corps), "un libellé de procédure répété six fois");
assert.ok(!/faits|avertissement/.test(corps), "un fait sur une destination à venir");
assert.ok(corps.includes("Prochaine destination"), "la mention manque");

// Ce que la carte porte, et rien d'autre : nom, drapeau, phrase.
for (const attendu of ["pays.code", "pays.nom", "pays.positionnement"]) {
assert.ok(corps.includes(attendu), `${attendu} manque à la carte sobre`);
}

});

test("basculer un pays de « a_venir » à « ouvert » suffit à lui donner son bouton", () => {

// C'EST LE TEST DU LOT. Ouvrir une destination doit être purement
// documentaire. On simule la bascule sur un objet — sans toucher aux
// données réelles — et on vérifie que la seule fonction qui décide,
// estOuverte(), suit.
// (Depuis le 2026-09-23 la Roumanie est ouverte : on simule donc les
// DEUX sens de la bascule, sur des copies.)
const roumanie = PAYS.find((p) => p.id === "roumanie");

assert.equal(estOuverte({ ...roumanie, accompagnement: "a_venir" }), false);
assert.equal(estOuverte({ ...roumanie, accompagnement: "ouvert" }), true);

// Et que le hub ne consulte RIEN d'autre pour trancher : ni la
// procédure, ni les effectifs, ni la présence d'un fichier.
const js = sansCommentaires(lire(HUB_JS));
const rendu = js.slice(js.indexOf("async function initialiser"));
assert.match(rendu, /estOuverte\(p\)\s*\?\s*carteOuverte/, "le hub doit trancher sur estOuverte() seule");
assert.ok(!/procedure|existsSync|documentee/.test(rendu), "le hub consulte autre chose que `accompagnement`");

// La page de destination se déduit de l'id : rien à câbler.
assert.equal(pageDeDestination({ id: "roumanie" }), "preinscription-roumanie.html");

});

// ------------------------------------------------------------------
// 6. LA PAGE DE DESTINATION — la preuve gratuite, le calcul payant
// ------------------------------------------------------------------

test("les seuils publics sont TOUJOURS affichés, avec leur source et leur date", () => {

const france = PAYS.find((p) => p.id === "france");
const publics = faitsPublics(france);

// Leur disparition est une régression : c'est la preuve que nos
// chiffres sont vrais, et une preuve payante ne prouve rien.
const textes = publics.map((f) => f.texte).join(" ");
for (const seuil of ["877,50 €", "10 530 €", "2 902 €", "3 950 €", "30 %", "sept (7)"]) {
assert.ok(textes.includes(seuil), `le seuil public « ${seuil} » n'est plus publié`);
}

// Et la page les rend AVEC leur source et leur date.
const dest = lire(DEST_JS);
assert.ok(dest.includes("faitsPublics(pays)"));
assert.ok(dest.includes("pre-fait-source"), "le lien de source doit être rendu");
assert.ok(dest.includes("Vérifié le ${escapeHtml(formaterDate(f.verifieLe))}"), "la date de vérification doit être rendue");

const html = lire("preinscription-france.html");
assert.ok(html.includes('id="destRegles"'), "la section des règles manque");

});

test("la page nomme les pays de résidence, lus depuis le registre", () => {

const dest = lire(DEST_JS);
const html = sansCommentaires(lire("preinscription-france.html"));

// Un neuvième pays ajouté au registre doit apparaître sans qu'on
// touche au HTML : aucun nom n'y est écrit.
assert.ok(dest.includes("residencesDocumentees(pays.nom)"), "les pays viennent du registre");
for (const c of COUCHES) {
assert.ok(!html.includes(c.pays), `${c.pays} écrit en dur dans le HTML de la page`);
}
assert.ok(!/\b8 pays\b|\bhuit pays\b/i.test(html), "le nombre de pays est écrit en dur");

// Les huit sont bien là aujourd'hui, et ce sont ceux du registre.
const attendus = residencesDocumentees("France").map((r) => r.pays);
assert.equal(attendus.length, 8);
assert.deepEqual(attendus, ["Bénin", "Burkina Faso", "Cameroun", "Côte d'Ivoire", "Guinée", "Maroc", "Sénégal", "Togo"]);

// Nommés, et rien de plus : aucun montant, aucune date, aucune banque
// n'accompagne un nom de pays sur cette page (voir le test des chaînes
// interdites, qui le tient pour l'ensemble).
assert.ok(dest.includes("<li>${escapeHtml(p)}</li>"), "les pays sont NOMMÉS, un par un");

});

test("la procédure est annoncée par son NOMBRE d'étapes, jamais par son contenu", () => {

const dest = lire(DEST_JS);
const procedure = trouverProcedure({ paysDestination: "France" });

assert.equal(procedure.etapes.length, 11);
assert.ok(dest.includes("compte ${procedure.etapes.length} étapes"), "le nombre doit être calculé");

// Aucun titre, aucune consigne, aucune pièce d'étape ne sort.
const sansCom = sansCommentaires(dest);
for (const champ of ["e.consigne", "e.pieces", "etapes.map", "texteConsigne"]) {
assert.ok(!sansCom.includes(champ), `la page rend « ${champ} » — c'est le contenu du Dossier France`);
}

// Et la ligne qui dit ce que le client obtient en plus.
assert.ok(dest.includes("destProcedureClient"), "la page doit dire ce que le client obtient");

});

test("le bloc « ce que nous vous garantissons » est présent, mot pour mot", () => {

const html = lire("preinscription-france.html");

// Lot VITRINE-COMMERCIALE (2026-09-11) : trois engagements POSITIFS ont
// remplacé « ce que ça promet et ce que ça ne promet pas ». La
// signature anti-officine reste (vous déposez vous-même, sans
// intermédiaire ; chaque règle vérifiée à la source, datée) — dite par
// ce que FitzUniverse fait, jamais par ce qu'il ne fait pas.
assert.ok(html.includes("Ce que nous vous garantissons"));
assert.ok(!html.includes("ce qu'il ne promet pas"));
assert.ok(!/Jamais jusqu'à l'admission|Aucun taux de réussite/.test(html));

for (const phrase of [
"Un dossier <strong>complet et conforme</strong>, vérifié avant l'envoi : pièces, traductions, légalisations et preuve de ressources, jusqu'au dépôt.",
"<strong>Vous gardez la main</strong> : vous déposez vous-même, sur le portail officiel du pays ou de l'établissement, sans intermédiaire.",
"<strong>Chaque règle vérifiée à la source officielle</strong>, avec sa date : ce que vous lisez ici est ce que l'administration applique."
]) {
assert.ok(html.includes(phrase), `phrase altérée ou absente : « ${phrase.slice(0, 60)}… »`);
}

});

test("le lien d'achat porte destination=france", () => {

const dest = lire(DEST_JS);

// LE PAYS VOYAGE JUSQU'À LA CAISSE. Depuis le 2026-09-23, sept
// destinations : la France garde son chemin (offers.html compare les
// trois offres), les six autres vont droit au paiement — la destination
// dans l'adresse, calculée, jamais écrite en dur.
assert.ok(dest.includes("offers.html?parcours=preinscription&destination=${pays.id}"), "le lien de la grille de référence doit porter la destination, calculée");
assert.ok(dest.includes("window.SCHOLARBRIDGE_DESTINATIONS[pays.id]"), "une donnée décide qu'une destination a ses offres");
assert.ok(dest.includes("payment.html?plan=${offre.id}&destination=${pays.id}"), "le lien d'une autre destination doit porter l'offre et le pays");
assert.ok(dest.includes("href=\"${escapeHtml(lienOffre(offre, pays))}\""), "le bouton de la carte doit passer par lienOffre");
assert.ok(!dest.includes("destination=france"), "la destination ne s'écrit pas en dur");

// Les trois offres préinscription, dans l'ordre de la grille.
// Les offres viennent de la GRILLE, pas d'une liste écrite dans le
// module : la destination suivante aura les siennes sans qu'on y touche.
// La liste écrite ici était trois noms français au milieu d'une page
// modèle — exactement ce que §4c interdit.
assert.ok(dest.includes('o.parcours === "preinscription"'), "les offres doivent être lues dans pricing-plans.js");
assert.ok(dest.includes('o.deprecated !== true'), "une offre retirée de la vente ne s'affiche pas");
assert.ok(!dest.includes("OFFRES_PAGE"), "la liste des offres ne s'écrit pas dans le module");
// Et la mise en avant se règle sur une DONNÉE de la grille (`niveau`,
// lot VITRINE-COMMERCIALE), jamais sur un identifiant écrit ici.
assert.ok(dest.includes("offre.niveau"), "le niveau de la carte vient de pricing-plans.js");
const codeSeul = dest.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
assert.ok(!/"dossier-france"|"diagnostic-france"/.test(codeSeul), "aucun identifiant d'offre en dur dans le module");

// Et la déduction est annoncée, sans compte : c'est une règle
// commerciale, pas un calcul personnel.
assert.ok(dest.includes("SCHOLARBRIDGE_DEDUCTION"), "la déduction doit venir de la grille");
assert.ok(lire("preinscription-france.html").includes("pricing-plans.js"), "la page doit charger la grille");

});

// ------------------------------------------------------------------
// 7. LA PAGE MODÈLE — la prochaine destination se copie
// ------------------------------------------------------------------

test("la page de destination ne nomme sa destination qu'à UN endroit", () => {

const html = lire("preinscription-france.html");
const rendu = sansCommentaires(html);

// `data-destination` sur <body> : l'unique endroit. Le titre, la
// description et le lien canonique nomment le pays aussi — ce sont des
// métadonnées de référencement, et c'est justement pour elles que cette
// page existe séparément.
assert.match(html, /<body class="catalog-dark" data-destination="france">/);
assert.equal((rendu.match(/data-destination/g) || []).length, 1);

// Aucun contenu français en dur dans le CORPS : le prochain pays copie
// la page et change l'attribut.
const corps = rendu.slice(rendu.indexOf("<main"));
assert.ok(!/France/.test(corps), "« France » est écrit en dur dans le corps de la page");
assert.ok(!/Études en France/.test(corps), "le nom du portail est écrit en dur dans le corps");
assert.ok(!/877|2 902|3 950/.test(corps), "un seuil est écrit en dur dans le corps");

// Le module, lui, ne connaît aucune destination.
const dest = sansCommentaires(lire(DEST_JS));
assert.ok(!/"France"|'France'|france/.test(dest.replace(/preinscription-destination|destination/g, "")), "le module nomme une destination");
assert.ok(dest.includes("document.body.dataset.destination"), "le module doit lire la destination sur le <body>");

});

test("une destination repassée « a_venir » n'affiche pas une page à moitié remplie", () => {

const dest = lire(DEST_JS);

// Le filet du jour où quelqu'un déploie une page dont la destination a
// été refermée : elle le dit, elle ne rend pas une coquille avec des
// tirets.
assert.ok(dest.includes("!estOuverte(DESTINATION)"), "la page doit vérifier que sa destination est ouverte");
assert.ok(dest.includes("n'est pas encore ouverte à l'accompagnement"));

// Et le contrat est rejoué dans le navigateur, en avertissement : le
// test fait échouer la suite, ceci prévient qui a déployé sans tester.
assert.ok(dest.includes("defautsDeDestination(DESTINATION"), "le contrat doit être rejoué au chargement");
assert.ok(dest.includes("console.warn"), "un défaut de contrat doit être dit");

});

test("la nouvelle page est publiable : liste blanche, plan du site, menu", () => {

// Lot S5 : la liste blanche accepte un .html à la racine — et c'est
// elle qui décide, pas une intention.
const publie = lire("scripts/hosting-publie.mjs");
assert.match(publie, /"": \[".html"/, "la racine doit accepter les .html");

// Le plan du site : une page indexable qui n'y est pas est une page
// qu'on a écrite pour rien.
assert.ok(lire("sitemap.xml").includes("preinscription-france.html"));
assert.ok(lire("preinscription-france.html").includes('rel="canonical" href="https://fitzuniverse.com/preinscription-france.html"'));

// Le menu public reste à quatre entrées : la page de destination
// s'atteint par le hub, elle n'ajoute pas une cinquième entrée.
const entete = lire("preinscription-france.html");
for (const lien of ["scholarships.html", "preinscriptions.html", "universities.html", "login.html"]) {
assert.ok(entete.includes(`href="${lien}" class="header-link`), `le menu public a perdu ${lien}`);
}

});
