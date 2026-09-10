/**
* ============================================================
* test/procedures.test.mjs — la procédure de portail (E2, puis S1b)
* ============================================================
*
* Le vocabulaire est fermé ; chaque étape a source + verifieLe ; chaque
* prérequis cite un id existant ; aucun cycle. France × Sénégal : au
* moins une étape "paiement" à 85 000 F sourcée FAQ ; toute étape après
* connexion n'est ferme que si sa source décrit ces écrans ; aucune
* taille de fichier sans source. L'injection dans le parcours
* (préinscription seulement), la preuve de dépôt alimentée par la
* soumission, le moteur next-action, et l'état honnête de la France sur
* la page préinscriptions.
*
* LOT S1b (2026-09-08) — LA NON-RÉGRESSION SÉNÉGALAISE D'ABORD. La
* procédure a été scindée en un TRONC (js/procedures/france.js) et une
* COUCHE de résidence (js/procedures/residences/france-senegal.js).
* Presque tous les tests ci-dessous portent désormais sur la
* COMPOSITION Sénégal : ils passaient avant la scission, ils passent
* après, et c'est exactement ce qu'on leur demande de prouver — la
* composition rend, en substance, la procédure d'hier. La deuxième
* série est neuve : une résidence NON documentée reçoit les onze
* étapes, sans un seul fait sénégalais.
* ============================================================
*/

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { FIABILITE, TYPES_ETAPE, TYPES_PREUVE, RESERVE_A_CONFIRMER, texteConsigne, estConsigneFerme, ICONES_TYPE } from "../js/procedures/vocabulaire.js";
import { PROCEDURE_FRANCE } from "../js/procedures/france.js";
import { COUCHE_FRANCE_SENEGAL } from "../js/procedures/residences/france-senegal.js";
import { COUCHES } from "../js/procedures/residences/index.js";
import { TRONCS, trouverProcedure, composerProcedure, coucheDeResidence, residencesDocumentees, memePays, portailDocumente, defautsDeProcedure, defautsDeCouche, etapesAConfirmer, codeProcedurePour, libelleProcedureDocumentee, MENTION_RESIDENCE_ABSENTE } from "../js/procedures/index.js";
import { computeJourneySteps } from "../js/application-journey.js";
import { qualifierEtapes, prochaineEtapeFaisable, prochaineAction, avertissementsPrematures } from "../js/next-action.js";
import { PAYS, CAMPAGNE_FRANCE, jalonDeCampagne, finDeCampagne } from "../js/pays-preinscription.js";
import { preuveValide, lirePreuve } from "../js/preuve-depot.js";
import { TEMOIN } from "./_pays-temoin.mjs";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(racine, f), "utf8").replace(/\r\n/g, "\n");
const catalogue = JSON.parse(lire("assets/data/catalogue.json"));

// LA procédure d'hier, composée aujourd'hui : le tronc France + la
// couche Sénégal. Tout ce qui suit la traite comme avant la scission.
const FR = trouverProcedure({ paysDestination: "France", paysResidence: "Sénégal" });
// La même destination, depuis un pays sans couche.
const CI = trouverProcedure({ paysDestination: "France", paysResidence: TEMOIN });

const PASTEL = "https://pastel.diplomatie.gouv.fr/etudesenfrance/dyn/public/authentification/login.html";
const AUJOURDHUI = new Date("2026-09-07T12:00:00Z");

// ------------------------------------------------------------------
// Vocabulaire et forme
// ------------------------------------------------------------------

test("vocabulaire fermé : les trois listes du briefing, telles quelles", () => {
assert.deepEqual(FIABILITE, ["verifie_source_officielle", "a_confirmer", "retour_etudiant"]);
assert.deepEqual(TYPES_ETAPE, ["compte", "saisie", "voeux", "pieces", "soumission", "paiement", "entretien", "reponse", "confirmation", "complement", "visa"]);
assert.deepEqual(TYPES_PREUVE, ["numero_dossier", "recu", "convocation", "capture", "aucune"]);
for (const t of TYPES_ETAPE) assert.ok(ICONES_TYPE[t], `icône manquante pour ${t}`);
});

test("chaque étape a source + verifieLe ; chaque prérequis cite un id existant ; aucun cycle", () => {
for (const p of [...TRONCS, FR, CI]) assert.deepEqual(defautsDeProcedure(p), [], p.id);
for (const e of FR.etapes) {
assert.match(e.source, /^https:\/\//, e.id);
assert.match(e.verifieLe, /^\d{4}-\d{2}-\d{2}$/, e.id);
assert.ok(TYPES_ETAPE.includes(e.type) && TYPES_PREUVE.includes(e.preuve) && FIABILITE.includes(e.fiabilite), e.id);
}
// Un cycle artificiel est bien détecté.
const boucle = { etapes: [{ ...FR.etapes[0], id: "a", prerequis: ["b"] }, { ...FR.etapes[0], id: "b", prerequis: ["a"] }] };
assert.ok(defautsDeProcedure(boucle).some((d) => /cycle/.test(d)));
assert.ok(defautsDeProcedure({ etapes: [{ ...FR.etapes[0], source: "" }] }).some((d) => /sans source/.test(d)));
assert.ok(defautsDeProcedure({ etapes: [{ ...FR.etapes[0], verifieLe: "" }] }).some((d) => /sans verifieLe/.test(d)));
});

test("une étape sans source ou sans date n'existe pas : aucune dans la composition France × Sénégal", () => {
assert.equal(FR.etapes.filter((e) => !e.source || !e.verifieLe).length, 0);
assert.ok(FR.etapes.length >= 8);
});

// ------------------------------------------------------------------
// France × Sénégal
// ------------------------------------------------------------------

test("au moins une étape « paiement » à 85 000 F CFA, sourcée sur la FAQ Campus France Sénégal", () => {
const paiement = FR.etapes.filter((e) => e.type === "paiement");
assert.ok(paiement.length >= 1);
assert.ok(paiement.some((e) => e.montant === 85000 && e.devise === "XOF" && /senegal\.campusfrance\.org\/les-questions-frequemment-posees/.test(e.source) && e.fiabilite === "verifie_source_officielle"));
assert.match(paiement[0].consigne, /SUNU BANK/);
assert.match(paiement[0].consigne, /ne payez JAMAIS avant/i);
});

test("une étape après connexion n'est ferme que si sa source est la page qui décrit ces écrans", () => {
// La règle d'avant le 2026-09-08 disait « après connexion ⇒ toujours
// a_confirmer ». Elle était trop forte : Campus France Sénégal décrit
// publiquement ses propres écrans après connexion. Le garde-fou qui
// reste — et qui est le vrai sujet de ce test — c'est qu'on ne promeut
// pas un écran d'après-connexion en citant le calendrier ou la FAQ.
const apres = FR.etapes.filter((e) => e.apresConnexion);
assert.ok(apres.length >= 2, "la saisie et les pièces se passent derrière l'authentification");
for (const e of apres) {
if (e.fiabilite === "verifie_source_officielle") {
assert.equal(e.source, FR.sources.DOSSIER, `${e.id} : ferme, mais sa source ne décrit pas les écrans après connexion`);
assert.equal(estConsigneFerme(e), true, e.id);
assert.ok(!texteConsigne(e).toLowerCase().includes(RESERVE_A_CONFIRMER), e.id);
} else {
assert.equal(e.fiabilite, "a_confirmer", e.id);
assert.ok(texteConsigne(e).toLowerCase().includes(RESERVE_A_CONFIRMER), e.id);
assert.equal(estConsigneFerme(e), false, e.id);
}
}
// Et une consigne vérifiée est rendue telle quelle, sans réserve.
const compte = FR.etapes.find((e) => e.type === "compte");
assert.equal(texteConsigne(compte), compte.consigne);
assert.ok(!texteConsigne(compte).toLowerCase().includes(RESERVE_A_CONFIRMER));
assert.ok(FR.etapes.some((e) => e.fiabilite === "verifie_source_officielle"), "au moins une consigne ferme");
});

test("aucun agrégateur : toutes les sources sont des pages de l'organisme lui-même", () => {
const urls = [...Object.values(FR.sources), ...FR.etapes.map((e) => e.source)];
for (const url of urls) {
assert.ok(!/demarchesetrangers/i.test(url), `agrégateur encore cité : ${url}`);
assert.match(url, /^https:\/\/www\.senegal\.campusfrance\.org\//, url);
}
assert.equal(FR.sources.AGREG, undefined, "la table ne porte plus d'agrégateur");
// Le garde-fou vaut pour le dépôt, pas seulement pour ce fichier : le
// même agrégateur sourçait un « fait » France affiché sur la page
// publique Préinscriptions, avec la même erreur de plafond.
for (const f of PAYS.find((p) => p.id === "france").faits) {
assert.ok(!/demarchesetrangers/i.test(f.source), `fait France encore sourcé sur un agrégateur : « ${f.texte.slice(0, 60)} »`);
// On interdit l'AFFIRMATION « N vœux par niveau », pas les mots : le
// texte corrigé dit « et non par niveau », ce qui est le contraire.
assert.ok(!/(vœux|choix)[^.]{0,24}(au maximum\s+)?par niveau/i.test(f.texte), `fait France : « 7 vœux par niveau » est faux — « ${f.texte.slice(0, 60)} »`);
}
const procedureFrance = PAYS.find((p) => p.id === "france").faits.find((f) => f.cle === "procedure");
assert.match(procedureFrance.texte, /AU TOTAL/, "le fait public doit dire que le plafond est global");
assert.equal(procedureFrance.source, FR.sources.DOSSIER);
});

test("les vœux : le plafond de 7 est GLOBAL, et le sous-plafond de la Licence 1 est dit", () => {
const voeux = FR.etapes.find((e) => e.type === "voeux");
assert.equal(voeux.fiabilite, "verifie_source_officielle");
assert.equal(voeux.source, FR.sources.DOSSIER);
// Le total ET le sous-plafond qui coûte le plus cher à ignorer.
assert.match(voeux.consigne, /sept \(7\) choix de formations connectées/);
assert.match(voeux.consigne, /GLOBAL/);
assert.match(voeux.consigne, /Licence 1 \(DAP\)\s*:\s*3 formations/);
// L'exemple qui montre que les sous-plafonds s'additionnent DANS le total.
assert.match(voeux.consigne, /3 \+ 4 = 7/);
// Et surtout : plus aucune trace du « par niveau » de l'agrégateur.
assert.ok(!/par niveau/i.test(voeux.consigne), "« 7 vœux par niveau » était l'erreur de l'agrégateur");
assert.ok(!/agrégateur/i.test(voeux.consigne));
// Règle de plateforme : elle ne dépend d'aucune résidence, elle est donc
// SERVIE TELLE QUELLE à un pays non documenté.
assert.equal(CI.etapes.find((e) => e.type === "voeux").consigne, voeux.consigne);
});

test("la saisie dit l'exemption CEDEAO, et ne présente plus le choix de l'antenne comme une règle de la source", () => {
const saisie = FR.etapes.find((e) => e.id === "ef_saisie");
assert.match(saisie.consigne, /CEDEAO/);
assert.match(saisie.consigne, /exemptés de titre de séjour au Sénégal à la date de rédaction de cette page/, "la réserve est de la source, elle se garde");
assert.match(saisie.consigne, /conseil/i, "l'antenne est un conseil assumé, pas un fait sourcé");
assert.ok(!/L'adresse indiquée détermine l'antenne/.test(saisie.consigne));
});

test("les pièces : la règle de traduction mot pour mot, le plafond général, et le test de français avant dépôt pour L-AR", () => {
const pieces = FR.etapes.find((e) => e.id === "ef_pieces");
assert.equal(pieces.source, FR.sources.DOSSIER, "les tailles sont sur DOSSIER, pas sur la FAQ");
assert.match(pieces.consigne, /Tous les documents doivent être en français ou traduits en Français auprès d'un traducteur assermenté\. Dans le cas où le document est traduit, il faut joindre aussi obligatoirement le document original\./);
assert.match(pieces.consigne, /plafond est général/);
assert.match(pieces.consigne, /L-AR/);
assert.match(pieces.consigne, /AVANT de déposer/);
});

test("aucune étape n'a une taille de fichier sans source ; les tailles citées sont celles de la page « je constitue mon dossier » ou de la FAQ", () => {
for (const e of FR.etapes) {
for (const piece of e.pieces) {
if (piece.tailleMax) {
assert.ok(/senegal\.campusfrance\.org/.test(e.source), `${e.id} : taille « ${piece.tailleMax} » sans source officielle`);
assert.ok(["50 Ko", "500 Ko"].includes(piece.tailleMax), `${e.id} : taille inventée « ${piece.tailleMax} »`);
}
assert.equal(typeof piece.traduction, "boolean");
assert.equal(typeof piece.legalisation, "boolean");
}
}
});

test("le calendrier n'est pas recopié : chaque échéance désigne un jalon de la couche, daté pour la campagne en cours", () => {
for (const e of FR.etapes.filter((x) => x.echeance)) {
assert.equal(e.echeance.depuis, "calendrier", e.id);
assert.ok(CAMPAGNE_FRANCE.jalons[e.echeance.cle], `${e.id} : jalon « ${e.echeance.cle} » inconnu`);
}
assert.match(CAMPAGNE_FRANCE.sourceJalons, /calendrier-de-la-procedure-2026/);
assert.equal(jalonDeCampagne("soumission", AUJOURDHUI).iso, "2026-12-15");
assert.equal(jalonDeCampagne("paiement", AUJOURDHUI).iso, "2026-12-27");
assert.equal(jalonDeCampagne("confirmation", AUJOURDHUI).iso, "2027-05-31");
assert.equal(jalonDeCampagne("complements", AUJOURDHUI).iso, "2027-07-27");
assert.equal(jalonDeCampagne("visa", AUJOURDHUI).iso, "2027-05-01");
assert.equal(jalonDeCampagne("confirmation", new Date("2027-03-01T00:00:00Z")).iso, "2027-05-31");
assert.equal(jalonDeCampagne("soumission", new Date("2027-03-01T00:00:00Z")).iso, "2026-12-15", "en mars, la campagne en cours a ouvert en octobre précédent");
assert.equal(jalonDeCampagne("inconnu"), null);
assert.equal(finDeCampagne(AUJOURDHUI).toISOString().slice(0, 10), "2027-07-31");
// Le troisième argument (lot S1b) : les jalons viennent de la COUCHE.
assert.equal(jalonDeCampagne("soumission", AUJOURDHUI, COUCHE_FRANCE_SENEGAL.faits.calendrier.jalons).iso, "2026-12-15");
assert.equal(jalonDeCampagne("soumission", AUJOURDHUI, {}), null, "un calendrier sans ce jalon ne rend aucune date");
// Les DONNÉES de la procédure ne portent aucune date : seul l'en-tête cite les sources.
const sansDates = JSON.stringify(FR.etapes).replace(/"verifieLe(Residence)?":"\d{4}-\d{2}-\d{2}"/g, "");
assert.ok(!/\d{4}-\d{2}-\d{2}|\b(15 décembre|27 décembre|31 mai|27 juillet|1er mai)\b/.test(sansDates), "aucune date recopiée dans les étapes");
});

// ------------------------------------------------------------------
// L'index : la destination décide, la résidence précise
// ------------------------------------------------------------------

test("trouverProcedure : la destination seule décide qu'une procédure existe", () => {
assert.equal(trouverProcedure({ paysDestination: "France", paysResidence: "Sénégal" }), FR);
assert.equal(trouverProcedure({ paysDestination: "France", paysResidence: "senegal" }), FR);
assert.equal(trouverProcedure({ portailUrl: PASTEL, paysResidence: "Sénégal" }), FR);
// Ce qui a changé le 2026-09-08 : ces trois appels rendaient null, et un
// candidat ivoirien, marocain ou sans pays déclaré voyait un dossier vide.
assert.equal(trouverProcedure({ paysDestination: "France", paysResidence: TEMOIN }).residenceDocumentee, false);
assert.equal(trouverProcedure({ paysDestination: "France" }).etapes.length, FR.etapes.length, "sans résidence, les étapes du tronc, toutes");
assert.equal(trouverProcedure({ portailUrl: PASTEL }).residenceDocumentee, false);
// La destination inconnue reste le seul null.
assert.equal(trouverProcedure({ paysDestination: "Roumanie", paysResidence: "Sénégal" }), null);
assert.equal(trouverProcedure(), null);
assert.equal(portailDocumente(PASTEL), true);
assert.equal(portailDocumente("https://formulaires.ens.psl.eu/"), false);
// LOT S3 : les portails ont quitté l'instantané public (ils étaient
// lisibles de tous, sans compte) et vivent dans la carte privée servie
// par la Cloud Function. Le contrôle est le même, il lit juste au bon
// endroit — et il vaut mieux ainsi : il échouerait le jour où un
// portail repartirait en clair dans le fichier public.
const portails = JSON.parse(lire("functions/data/catalogue-portails.json")).universites;
assert.ok(portailDocumente(portails["universite-de-bordeaux-bordeaux"]), "l'Université de Bordeaux est sur Études en France");
const francaises = catalogue.universities.filter((u) => u.country === "France").map((u) => u.id);
assert.equal(francaises.filter((id) => portailDocumente(portails[id])).length, 17);
assert.equal(catalogue.universities.some((u) => "applicationPortalUrl" in u), false, "le catalogue public ne porte plus aucun portail");
});

test("appariement des pays : par code ISO, jamais par chaîne libre", () => {
for (const graphie of ["senegal", "SN", "Sénégal", "sénégal", "SÉNÉGAL"]) {
assert.ok(coucheDeResidence("France", graphie), `« ${graphie} » doit trouver la couche`);
assert.equal(trouverProcedure({ paysDestination: "France", paysResidence: graphie }), FR, graphie);
}
// Une nationalité n'est pas un pays : elle ne trouve rien, et ne casse rien.
assert.equal(coucheDeResidence("France", "Sénégalaise"), null);
assert.equal(trouverProcedure({ paysDestination: "France", paysResidence: "Sénégalaise" }).residenceDocumentee, false);
assert.equal(coucheDeResidence("France", ""), null);
assert.equal(coucheDeResidence("France", undefined), null);
assert.equal(memePays("Côte d'Ivoire", "CI"), true);
assert.equal(memePays("France", "Sénégal"), false);
assert.equal(memePays("", "France"), false);
// L'ancienne table d'alias a disparu du dépôt.
assert.ok(!lire("js/procedures/index.js").includes("ALIAS_PAYS"), "un seul appariement de pays : findCountry");
});

// ------------------------------------------------------------------
// Lot S1b — le tronc, la couche, la composition
// ------------------------------------------------------------------

/** Ce qu'un étudiant LIT : titres, consignes rendues, noms de pièces. */
function textesEtudiant(procedure) {
return procedure.etapes.flatMap((e) => [e.titre, texteConsigne(e), ...(e.pieces || []).map((p) => p.nom)]).join("  ");
}

test("le tronc ne connaît aucune résidence : ni montant, ni banque, ni pièce locale", () => {
const textes = textesEtudiant({ etapes: PROCEDURE_FRANCE.etapes });
for (const interdit of ["85 000", "Sénégal", "sénégal", "senegal", "SUNU BANK", "CEDEAO", "ANAQ-Sup", "Dakar"]) {
assert.ok(!textes.includes(interdit), `le tronc porte encore « ${interdit} »`);
}
assert.equal(PROCEDURE_FRANCE.paysResidence, undefined, "un tronc n'a pas de pays de résidence");
assert.equal(PROCEDURE_FRANCE.etapes.length, 11);
// Les étapes qui ont besoin d'une couche le déclarent.
const dependantes = PROCEDURE_FRANCE.etapes.filter((e) => e.dependResidence).map((e) => e.id);
assert.deepEqual(dependantes, ["ef_saisie", "ef_pieces", "ef_soumission", "ef_paiement", "ef_entretien", "ef_reponse", "ef_confirmation", "ef_complement", "ef_visa"]);
// Le compte et les vœux sont de la plateforme, entièrement.
assert.ok(!PROCEDURE_FRANCE.etapes.find((e) => e.id === "ef_compte").dependResidence);
assert.ok(!PROCEDURE_FRANCE.etapes.find((e) => e.id === "ef_voeux").dependResidence);
});

test("résidence documentée : la composition rend, en substance, la procédure d'avant la scission", () => {
assert.equal(FR.id, "france-senegal");
assert.equal(FR.residence, "Sénégal");
assert.equal(FR.residenceDocumentee, true);
assert.equal(FR.etapes.length, 11);
assert.equal(etapesAConfirmer(FR).length, 0);
for (const e of FR.etapes) assert.equal(e.fiabilite, "verifie_source_officielle", e.id);
assert.deepEqual(defautsDeProcedure(FR), []);
// Les cinq échéances de la campagne sont là, et aucune étape ne porte de mention.
assert.equal(FR.etapes.filter((e) => e.echeance).length, 5);
assert.equal(FR.etapes.filter((e) => e.mention).length, 0);
// Les quatre faits sénégalais que la couche remet en place.
const textes = textesEtudiant(FR);
for (const attendu of ["85 000 F", "SUNU BANK", "CEDEAO", "Arabe L-AR", "VFS Global à Dakar", "commence par « SN »"]) {
assert.ok(textes.includes(attendu), `la composition Sénégal a perdu « ${attendu} »`);
}
assert.equal(codeProcedurePour(PAYS.find((p) => p.id === "france"), FR), "documentee");
});

test("résidence non documentée : les onze étapes, et pas un fait sénégalais", () => {
assert.equal(CI.residenceDocumentee, false);
assert.equal(CI.residence, "");
assert.equal(CI.etapes.length, 11);
assert.deepEqual(defautsDeProcedure(CI), []);
const textes = textesEtudiant(CI);
for (const interdit of ["85 000", "Sénégal", "sénégal", "senegal", "SUNU BANK", "CEDEAO", "ANAQ-Sup", "Dakar", "SUNU"]) {
assert.ok(!textes.includes(interdit), `une résidence non documentée lit encore « ${interdit} »`);
}
// Les seules occurrences de « senegal » restantes sont les URLs des
// sources, et c'est assumé : c'est là que ce texte a été vérifié.
// Prétendre le contraire en citant une page nationale non ouverte
// serait le mensonge que ce dossier existe pour empêcher.
for (const e of CI.etapes) assert.match(e.source, /^https:\/\/www\.senegal\.campusfrance\.org\//, e.id);
// Aucune date : le calendrier est une donnée du pays de résidence.
assert.equal(CI.etapes.filter((e) => e.echeance).length, 0);
assert.equal(CI.faits, null);
// Et chaque étape qui dépend de la résidence le DIT.
const dependantes = CI.etapes.filter((e) => e.dependResidence);
assert.equal(dependantes.length, 9);
for (const e of dependantes) {
assert.ok(e.mention && e.mention.startsWith(MENTION_RESIDENCE_ABSENTE), e.id);
assert.ok(texteConsigne(e).includes(MENTION_RESIDENCE_ABSENTE), `${e.id} : la mention doit être LUE, pas seulement portée`);
}
for (const e of CI.etapes.filter((x) => !x.dependResidence)) assert.equal(e.mention, undefined, e.id);
// Rien n'est marqué « à confirmer » faute de couche : deux idées, deux champs.
assert.equal(etapesAConfirmer(CI).length, 0);
assert.equal(codeProcedurePour(PAYS.find((p) => p.id === "france"), CI), "en_cours");
assert.match(libelleProcedureDocumentee(CI), /détails de votre pays de résidence restent à vérifier/);
assert.ok(!/pas à pas/.test(libelleProcedureDocumentee(CI)));
});

test("résidence vide : le même résultat qu'une résidence non documentée, jamais null", () => {
const vide = trouverProcedure({ paysDestination: "France", paysResidence: "" });
assert.ok(vide);
assert.equal(vide.residenceDocumentee, false);
assert.deepEqual(vide.etapes.map((e) => e.id), CI.etapes.map((e) => e.id));
assert.equal(vide.etapes.find((e) => e.id === "ef_paiement").montant, undefined, "aucun montant, pas même 0");
assert.equal(trouverProcedure({ paysDestination: "France", paysResidence: null }).residenceDocumentee, false);
});

test("un fragment qui remplace sans source ou sans verifieLe est REFUSÉ", () => {
const factice = (etapes) => composerProcedure(PROCEDURE_FRANCE, { id: "france-x", destination: "France", pays: TEMOIN, verifieLe: "2026-09-08", faits: {}, etapes });
// Un remplacement sans source : refusé.
assert.ok(defautsDeProcedure(factice({ ef_paiement: { consigne: "Payez 40 000 F à la banque.", verifieLe: "2026-09-08" } })).some((d) => /fragment « ef_paiement » : sans source/.test(d)));
// Un remplacement sans date : refusé.
assert.ok(defautsDeProcedure(factice({ ef_paiement: { consigne: "Payez 40 000 F.", source: "https://exemple.org/frais" } })).some((d) => /fragment « ef_paiement » : sans verifieLe/.test(d)));
// Un AJOUT non sourcé est refusé lui aussi : un ajout est un fait de
// plus, exactement comme un remplacement.
assert.ok(defautsDeProcedure(factice({ ef_saisie: { consigneSup: "Apportez aussi un timbre fiscal." } })).some((d) => /fragment « ef_saisie » : sans source/.test(d)));
// Un fragment complet passe.
assert.deepEqual(defautsDeProcedure(factice({ ef_paiement: { consigne: "Payez 40 000 F.", source: "https://exemple.org/frais", verifieLe: "2026-09-08" } })), []);
// Un fragment qui vise une étape inexistante, un fragment vide, un
// fragment qui ajoute ET remplace le même champ : refusés.
assert.ok(defautsDeProcedure(factice({ ef_inconnue: { consigne: "x", source: "https://exemple.org", verifieLe: "2026-09-08" } })).some((d) => /aucune étape de ce nom/.test(d)));
assert.ok(defautsDeProcedure(factice({ ef_visa: { source: "https://exemple.org", verifieLe: "2026-09-08" } })).some((d) => /vide/.test(d)));
assert.ok(defautsDeProcedure(factice({ ef_visa: { consigne: "a", consigneSup: "b", source: "https://exemple.org", verifieLe: "2026-09-08" } })).some((d) => /ajoute ET remplace/.test(d)));
// Et la vraie couche, elle, est valide.
assert.deepEqual(defautsDeCouche(COUCHE_FRANCE_SENEGAL, PROCEDURE_FRANCE), []);
});

test("la source suit le texte : un remplacement change la source affichée, un ajout la garde", () => {
// REMPLACEMENT : le paiement parle de SUNU BANK, il cite la FAQ.
const paiement = FR.etapes.find((e) => e.id === "ef_paiement");
assert.equal(paiement.source, COUCHE_FRANCE_SENEGAL.etapes.ef_paiement.source);
assert.equal(paiement.titre, COUCHE_FRANCE_SENEGAL.etapes.ef_paiement.titre);
assert.equal(paiement.sourceResidence, undefined);
// AJOUT : les pièces gardent la page qui décrit les écrans, et posent
// la source de l'ajout à côté.
const pieces = FR.etapes.find((e) => e.id === "ef_pieces");
assert.equal(pieces.source, PROCEDURE_FRANCE.sources.DOSSIER);
assert.equal(pieces.sourceResidence, COUCHE_FRANCE_SENEGAL.etapes.ef_pieces.source);
assert.equal(pieces.verifieLeResidence, COUCHE_FRANCE_SENEGAL.etapes.ef_pieces.verifieLe);
// L'ajout de pièces s'AJOUTE, il ne remplace pas.
assert.equal(pieces.pieces.length, PROCEDURE_FRANCE.etapes.find((e) => e.id === "ef_pieces").pieces.length + 1);
assert.ok(pieces.pieces.some((p) => /L-AR/.test(p.nom)));
});

test("le registre des couches est le seul endroit qui déclare un pays documenté", () => {
// Le lot S2-PAYS en a ajouté sept — et il n'a ajouté QUE des fichiers de
// données et sept lignes ici. C'était la promesse de S1b, et c'est ce
// chiffre qui la vérifie : le jour où enregistrer un pays demandera de
// toucher un module, ce test aura besoin d'être relu, pas mis à jour.
assert.equal(COUCHES.length, 8, "huit pays de résidence documentés");
assert.deepEqual(residencesDocumentees("France").map((r) => r.pays), ["Bénin", "Burkina Faso", "Cameroun", "Côte d'Ivoire", "Guinée", "Maroc", "Sénégal", "Togo"]);
assert.deepEqual(residencesDocumentees("Roumanie"), []);
// Le diagnostic lit ce registre, il ne tient plus sa propre liste.
const diag = lire("js/diagnostic-france.js");
assert.ok(diag.includes('coucheDeResidence("France", paysResidence)'), "residenceDocumentee doit interroger le registre");
assert.ok(!/faitFrance\("fraisDossier"\)/.test(diag.split("export function calculerDiagnostic")[0].split("residenceDocumentee")[1] || ""), "plus de comparaison au champ residence d'un fait");
});

test("aucune occurrence de RESIDENCE_PAR_DEFAUT dans le dépôt", () => {
const fichiers = [];
const visiter = (rel) => {
for (const e of readdirSync(join(racine, rel), { withFileTypes: true })) {
if (e.name.startsWith(".") || e.name === "node_modules") continue;
const chemin = rel ? `${rel}/${e.name}` : e.name;
if (e.isDirectory()) visiter(chemin);
else if (/\.(js|mjs|html|css)$/.test(e.name)) fichiers.push(chemin);
}
};
visiter("");
const coupables = fichiers.filter((f) => f !== "test/procedures.test.mjs" && lire(f).includes("RESIDENCE_PAR_DEFAUT"));
assert.deepEqual(coupables, [], "une page publique n'a pas de pays de résidence par défaut : elle affiche le tronc");
});

// ------------------------------------------------------------------
// L'injection dans le parcours
// ------------------------------------------------------------------

const bordeauxPre = { id: "pre-1", university: "Université de Bordeaux", track: "preinscription", universityId: "universite-de-bordeaux-bordeaux", portalUrl: PASTEL, checklist: [] };
const options = { profileScore: 9, procedure: FR, aujourdhui: AUJOURDHUI };

test("candidature préinscription liée à Études en France → les étapes apparaissent, dans l'ordre, entre ressources et la revue conseiller", () => {
const steps = computeJourneySteps(bordeauxPre, { ...options, advisorUnlocked: true });
const ids = steps.map((s) => s.id);
assert.deepEqual(ids.slice(0, 4), ["profile", "checklist", "traductions", "ressources"]);
assert.deepEqual(ids.slice(4, 4 + FR.etapes.length), FR.etapes.map((e) => e.id));
assert.equal(ids[ids.length - 1], "advisor");
const soumission = steps.find((s) => s.id === "ef_soumission");
assert.equal(soumission.action, "procedure");
assert.equal(soumission.procedure.echeanceISO, "2026-12-15");
assert.equal(soumission.procedure.preuve, "numero_dossier");
assert.deepEqual(soumission.prerequis, ["ef_voeux", "ressources"]);
assert.equal(steps.find((s) => s.id === "ef_paiement").procedure.montant, 85000);
});

test("résidence non documentée : les mêmes étapes dans le parcours, sans échéance ni montant", () => {
const steps = computeJourneySteps(bordeauxPre, { ...options, procedure: CI });
assert.deepEqual(steps.filter((s) => s.action === "procedure").map((s) => s.id), CI.etapes.map((e) => e.id));
const paiement = steps.find((s) => s.id === "ef_paiement");
assert.equal(paiement.procedure.echeanceISO, null, "aucune date empruntée à la campagne sénégalaise");
assert.equal(paiement.procedure.montant, undefined, "aucun montant emprunté à un autre pays");
assert.ok(texteConsigne(paiement.procedure).includes(MENTION_RESIDENCE_ABSENTE));
});

test("même université en parcours bourse → aucune étape de procédure ; université sans procédure → aucune, sans erreur", () => {
const bourse = computeJourneySteps({ ...bordeauxPre, track: "bourse" }, options);
assert.ok(!bourse.some((s) => s.action === "procedure"));
assert.deepEqual(bourse.map((s) => s.id), ["profile", "checklist", "letter", "readiness"]);
const sans = computeJourneySteps({ ...bordeauxPre, universityId: "ens-psl", portalUrl: "https://formulaires.ens.psl.eu/" }, { ...options, procedure: null });
assert.deepEqual(sans.map((s) => s.id), ["profile", "checklist", "traductions", "ressources"]);
assert.deepEqual(computeJourneySteps(bordeauxPre, { profileScore: 9 }).map((s) => s.id), ["profile", "checklist", "traductions", "ressources"], "sans option procedure : le parcours d'avant");
});

test("done = cochée ET preuve présente quand une preuve est attendue", () => {
const avec = (procedure) => computeJourneySteps({ ...bordeauxPre, procedure }, options);
assert.equal(avec({ ef_compte: { faite: true } }).find((s) => s.id === "ef_compte").done, true, "aucune preuve attendue");
assert.equal(avec({ ef_soumission: { faite: true } }).find((s) => s.id === "ef_soumission").done, false, "numéro attendu");
assert.equal(avec({ ef_soumission: { faite: true, preuve: "SN123456" } }).find((s) => s.id === "ef_soumission").done, true);
assert.equal(avec({ ef_soumission: { faite: false, preuve: "SN123456" } }).find((s) => s.id === "ef_soumission").done, false, "preuve sans coche");
assert.equal(avec("texte").some((s) => s.done && s.action === "procedure"), false, "un champ malformé ne fait rien");
});

test("cocher « soumission » avec un numéro remplit preuveDepot (E1) et rend la transition « déposée » possible", () => {
// La règle que applications.js applique en une seule saisie.
const numero = "SN2026000123";
const preuve = { mode: "numero", numeroDossier: numero, deposeLe: "2026-09-07" };
assert.equal(preuveValide(preuve, { parTiers: false, aujourdhui: AUJOURDHUI }), true);
const app = { ...bordeauxPre, procedure: { ef_soumission: { faite: true, preuve: numero, faitLe: "2026-09-07" } }, preuveDepot: preuve };
assert.deepEqual(lirePreuve(app), preuve);
assert.equal(computeJourneySteps(app, options).find((s) => s.id === "ef_soumission").done, true);
assert.ok(lire("applications.js").includes('etape.procedure.type === "soumission"'), "applications.js relie la soumission à preuveDepot");
});

// ------------------------------------------------------------------
// next-action
// ------------------------------------------------------------------

test("next-action : la prochaine étape faisable traverse les étapes injectées dans le bon ordre", () => {
const base = { ...bordeauxPre, checklist: [{ status: "complete" }] };
const docs = { "traductions-certifiees": true, "legalisation-apostille": true, "justificatif-de-ressources": true };
const faire = (procedure) => prochaineEtapeFaisable(computeJourneySteps({ ...base, procedure }, { ...options, documentsObtained: docs }));
// Sans les slugs exacts, les étapes documents restent à faire : on passe par les ids présents.
const steps0 = computeJourneySteps(base, options);
const q0 = qualifierEtapes(steps0);
assert.equal(q0.find((s) => s.id === "ef_compte").etat, "a-faire", "le compte n'a aucun prérequis");
assert.equal(q0.find((s) => s.id === "ef_saisie").etat, "prematuree", "le compte n'est pas créé : la saisie attend");
assert.deepEqual(q0.find((s) => s.id === "ef_saisie").bloquePar, ["ef_compte"], "le profil est fait, seul le compte manque");
assert.equal(q0.find((s) => s.id === "ef_pieces").etat, "prematuree");
// `base` a une checklist complète : seuls la saisie et les traductions manquent.
assert.deepEqual(q0.find((s) => s.id === "ef_pieces").bloquePar, ["ef_saisie", "traductions"]);
assert.equal(q0.find((s) => s.id === "ef_paiement").etat, "prematuree");
// Compte + saisie faits, dossier et traductions faits → pièces à faire, vœux prématurés.
const steps1 = computeJourneySteps({ ...base, procedure: { ef_compte: { faite: true }, ef_saisie: { faite: true } } }, { ...options, documentsObtained: {} })
.map((s) => (["checklist", "traductions"].includes(s.id) ? { ...s, done: true } : s));
const q1 = qualifierEtapes(steps1);
assert.equal(q1.find((s) => s.id === "ef_pieces").etat, "a-faire");
assert.equal(q1.find((s) => s.id === "ef_voeux").etat, "prematuree");
assert.deepEqual(q1.find((s) => s.id === "ef_voeux").bloqueParLibelles, ["renseigner mon parcours et joindre mes diplômes"]);
// Tout jusqu'à la soumission fait → le paiement est LA prochaine étape.
const faits = Object.fromEntries(["ef_compte", "ef_saisie", "ef_pieces", "ef_voeux"].map((id) => [id, { faite: true }]));
faits.ef_soumission = { faite: true, preuve: "SN1" };
const steps2 = computeJourneySteps({ ...base, procedure: faits }, options).map((s) => (["checklist", "traductions", "ressources"].includes(s.id) ? { ...s, done: true } : s));
assert.equal(prochaineEtapeFaisable(steps2).id, "ef_paiement");
assert.equal(qualifierEtapes(steps2).find((s) => s.id === "ef_entretien").etat, "prematuree");
void faire;
});

test("next-action : une étape « a_confirmer » n'est jamais rendue comme consigne ferme, et les phrases nomment l'étape", () => {
for (const e of FR.etapes) {
const texte = texteConsigne(e);
if (e.fiabilite === "a_confirmer") assert.ok(texte.toLowerCase().includes(RESERVE_A_CONFIRMER), e.id);
else assert.ok(!texte.toLowerCase().includes(RESERVE_A_CONFIRMER), e.id);
}
const faits = Object.fromEntries(["ef_compte", "ef_saisie", "ef_pieces", "ef_voeux"].map((id) => [id, { faite: true }]));
const app = { ...bordeauxPre, deadline: "2026-09-12", procedure: faits };
const etapes = computeJourneySteps(app, options).map((s) => (["checklist", "traductions", "ressources"].includes(s.id) ? { ...s, done: true } : s));
const action = prochaineAction({ profileScore: 9, applications: [{ ...app, etapes }], aujourdhui: AUJOURDHUI });
assert.equal(action.etapeId, "ef_soumission");
assert.match(action.texte, /il manque soumettre mon dossier sur Études en France/);
assert.ok(!/undefined|une étape\./.test(action.texte));
const alertes = avertissementsPrematures(etapes);
for (const a of alertes) assert.ok(!/undefined/.test(a.prerequisLisible + a.consequence), a.id);
});

// ------------------------------------------------------------------
// pays-preinscription : l'état honnête de la France
// ------------------------------------------------------------------

test("France : plus aucune étape à confirmer, la procédure est « documentee » et le dit", () => {
const france = PAYS.find((p) => p.id === "france");
// Les trois dernières « a_confirmer » (saisie, pièces, vœux) sont
// tombées le 2026-09-08 : la page DOSSIER décrit ces écrans.
assert.deepEqual(etapesAConfirmer(FR).map((e) => e.id), [], "aucune étape ne reste à confirmer");
assert.equal(codeProcedurePour(france, FR), "documentee");
assert.equal(libelleProcedureDocumentee(FR), "Procédure de portail documentée, accompagnée pas à pas");
// Le code DÉCLARÉ du pays reste « en_cours » : c'est la procédure qui
// tranche, pas la fiche pays — sinon les deux pourraient diverger.
assert.equal(france.procedure, "en_cours");
// Et aucune consigne de la France ne porte plus la réserve.
for (const e of FR.etapes) assert.ok(!texteConsigne(e).toLowerCase().includes(RESERVE_A_CONFIRMER), e.id);
// Le mécanisme inverse tient toujours : une seule étape douteuse suffit à retirer le « pas à pas ».
const douteuse = { ...FR, etapes: FR.etapes.map((e, i) => (i === 0 ? { ...e, fiabilite: "a_confirmer" } : e)) };
assert.equal(codeProcedurePour(france, douteuse), "en_cours");
assert.match(libelleProcedureDocumentee(douteuse), /^Procédure documentée depuis les sources publiques ; 1 étape à confirmer$/);
assert.equal(codeProcedurePour(PAYS.find((p) => p.id === "roumanie"), null), "a_venir");
// « Pas à pas » demande AUSSI une résidence documentée : une procédure
// entièrement vérifiée mais sans couche ne le promet pas.
assert.ok(!/pas à pas/.test(libelleProcedureDocumentee(CI)));
});

test("la page préinscriptions et la fiche université branchent la procédure", () => {

// LOT PRÉINSCRIPTIONS-VITRINE (2026-09-09) — LE PARTAGE A CHANGÉ DE
// PLACE, ET C'EST LE SENS DU LOT.
//
// Le hub rendait les onze étapes avec leur consigne (texteConsigne),
// c'est-à-dire le contenu même du Dossier France. La page publique dit
// désormais le NOMBRE d'étapes, jamais leur contenu — la règle se
// publie, le calcul se vend. Les modules de procédure restent branchés
// partout où l'étudiant est CLIENT : applications.js, dashboard.js, la
// fiche, et le Diagnostic.
const hub = lire("js/preinscriptions-page.js");
const destination = lire("js/preinscription-destination.js");

assert.ok(!hub.includes("texteConsigne"), "le hub ne rend plus les consignes des étapes");
assert.ok(!destination.includes("texteConsigne"), "la page de destination non plus");
assert.ok(destination.includes("procedure.etapes.length"), "elle annonce le NOMBRE d'étapes");
assert.ok(destination.includes("trouverProcedure({ paysDestination: pays.nom })"), "depuis la procédure composée, pas d'un chiffre écrit à la main");
// Lot S3 : details.js ne décide plus le lien de procédure sur l'URL du
// portail (que le visiteur n'a plus) mais sur le PAYS de destination —
// ce qui est aussi la bonne clé depuis S1b, une procédure étant
// documentée par destination.
assert.ok(lire("details.js").includes("trouverProcedure({ paysDestination: university.country })") && lire("scholarship-details.html").includes('id="procedureLink"'));
assert.ok(lire("applications.js").includes("trouverProcedure") && lire("dashboard.js").includes("trouverProcedure"));
// Page publique : aucune résidence supposée, et la liste des pays
// documentés est affichée telle qu'elle vit dans le registre.
assert.ok(destination.includes("residencesDocumentees"), "la page de destination dit quels pays sont vérifiés");
assert.ok(hub.includes("residencesDocumentees"), "le hub en dit le nombre");
for (const src of [hub, destination]) {
assert.ok(!src.includes("depuis le ${escapeHtml(procedure.paysResidence)}"), "la phrase figée « depuis le Sénégal » a disparu");
}
// La carte du dossier nomme la résidence RÉELLE du profil, ou rien.
const apps = lire("applications.js");
assert.ok(!apps.includes("Procédure Études en France, depuis le Sénégal"), "le titre ne nomme plus le Sénégal pour tout le monde");
assert.ok(apps.includes("(résidence : ${escapeHtml(residence)})"), "il nomme la résidence du profil");
});
