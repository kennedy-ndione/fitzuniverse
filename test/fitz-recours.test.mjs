/**
* ============================================================
* test/fitz-recours.test.mjs — « Discuter avec Fitz » devient LE recours
* ============================================================
*
* LE PIÈGE que ce fichier garde : MODE = "simule", aucun modèle. Chaque
* réponse de blocage doit venir d'un CALCUL sur une donnée qui existe —
* jamais d'un texte inventé, jamais d'une seconde copie de la règle.
*
* CE QUI EST VÉRIFIÉ :
*   1. chaque code rend une réponse non vide et différente des autres ;
*   2. un code inconnu ne lève pas et retombe sur le chat normal ;
*   3. `etape` rend la source ET verifieLe ;
*   4. `paiement` lit la COUCHE DE RÉSIDENCE : Bénin (Société Générale du
*      Bénin, compte 502, 70 000 F, AVANT la soumission) contre Sénégal
*      (SUNU BANK, 85 000 F, APRÈS l'autorisation) — un « SUNU BANK » en
*      dur fait virer le cas béninois au rouge ;
*   5. `verrou` sur un compte gratuit : le diagnostic ET l'échelle, sans
*      jamais un maillon verrouillé ;
*   6. l'échelle d'un compte diagnostic-france : messagerie et ticket,
*      jamais le conseiller ;
*   7. ANTI-DIVERGENCE : `quoi_faire` EST prochaineAction() ;
*   8. la forme : le composant, les pages, les règles, le journal.
*
* Fins de ligne : tout fichier lu ici passe par .replace(/\r\n/g,"\n").
* ============================================================
*/

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { CODES_BLOCAGE, LIBELLE_RECOURS, lienRecours, lireBlocage, boutonRecours, echelleDeRecours, diagnostiquer, messageDeFitz } from "../js/fitz-recours.js";
import { composerProcedure, coucheDeResidence } from "../js/procedures/index.js";
import { PROCEDURE_FRANCE } from "../js/procedures/france.js";
import { computeJourneySteps } from "../js/application-journey.js";
import { prochaineAction, LIBELLE_PREREQUIS } from "../js/next-action.js";
import { resolveFeatureFlags, decideVerrou, PLAN_LABELS } from "../js/plan-features.js";
import { DELAI_REPONSE } from "../js/delai-reponse.js";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(racine, f), "utf8").replace(/\r\n/g, "\n");

const flags = resolveFeatureFlags(null);
const AUJOURDHUI = new Date("2026-09-10T12:00:00Z");

const procedure = (pays) => composerProcedure(PROCEDURE_FRANCE, coucheDeResidence("France", pays));

const APP_PRE = { id: "pre-1", track: "preinscription", university: "Université de Bordeaux", scholarship: "Master Informatique", status: "en_cours", checklist: [], procedure: {} };
const APP_BOURSE = { id: "slot-1", track: "bourse", university: "Université de Montréal", scholarship: "Bourse X", status: "en_cours", deadline: "2026-09-20", checklist: [], scholarshipId: "b1" };
const BOURSE = { id: "b1", title: "Bourse X", exigences: ["candidature_via_etablissement", "lettres_recommandation"] };

const etapes = (app, pays = "Sénégal", profileScore = 3) => computeJourneySteps(app, { profileScore, procedure: app.track === "preinscription" ? procedure(pays) : null, aujourdhui: AUJOURDHUI });

function contexte(app, { pays = "Sénégal", profileScore = 3, planId = "gratuit", planPreinscriptionId = "dossier-france", bourse = null } = {}) {
const e = etapes(app, pays, profileScore);
return {
app, bourse,
procedure: app.track === "preinscription" ? procedure(pays) : null,
etapes: e,
applications: [{ ...app, etapes: e }],
profileScore, planId, planPreinscriptionId, featureFlags: flags, aujourdhui: AUJOURDHUI
};
}

// ------------------------------------------------------------------
// 1. Chaque code répond, et pas la même chose
// ------------------------------------------------------------------

test("chaque code du catalogue rend une réponse non vide et différente des autres", () => {
const c = contexte(APP_PRE, { bourse: BOURSE });
const sorties = {};
for (const code of CODES_BLOCAGE) {
const d = diagnostiquer({ code, etape: code === "etape" ? "ef_paiement" : "ef_compte", feature: "ai_letter" }, c);
assert.equal(d.code, code);
assert.ok(typeof d.texte === "string" && d.texte.trim().length > 30, `${code} : réponse vide`);
sorties[code] = d.texte;
}
assert.equal(new Set(Object.values(sorties)).size, CODES_BLOCAGE.length, "deux codes rendent la même réponse");
assert.equal(CODES_BLOCAGE.length, 10);
});

// ------------------------------------------------------------------
// 2. Un code inconnu ne lève pas
// ------------------------------------------------------------------

test("un code inconnu ou fabriqué retombe sur le chat normal, sans erreur", () => {
assert.equal(lireBlocage("?bloc=nimportequoi"), null);
assert.equal(lireBlocage("?bloc="), null);
assert.equal(lireBlocage(""), null);
assert.equal(lireBlocage("?prep=ielts"), null, "le mode entraînement n'est pas un blocage");
assert.deepEqual(lireBlocage("?bloc=etape&app=pre-1&etape=ef_paiement"), { code: "etape", app: "pre-1", etape: "ef_paiement", feature: "" });
const d = diagnostiquer({ code: "nimportequoi" }, contexte(APP_PRE));
assert.equal(d.code, null);
assert.equal(d.resolu, false);
// Le lien ne fabrique jamais un code hors catalogue.
assert.match(lienRecours({ code: "inventé" }), /bloc=quoi_faire/);
});

// ------------------------------------------------------------------
// 3. Une étape de procédure vient avec sa source et sa date
// ------------------------------------------------------------------

test("bloc=etape rend la consigne AVEC sa source et son verifieLe", () => {
const d = diagnostiquer({ code: "etape", etape: "ef_paiement" }, contexte(APP_PRE, { pays: "Sénégal" }));
assert.equal(d.resolu, true);
assert.match(d.source, /^https:\/\/www\.senegal\.campusfrance\.org\//);
assert.match(d.verifieLe, /^\d{4}-\d{2}-\d{2}$/);
assert.match(d.texte, /Vérifié le 8 septembre 2026/);
assert.match(d.texte, /voir la source/);
assert.match(d.texte, /Vous êtes bloqué à l'étape/);
// Pour chaque étape de la procédure, pareil.
for (const e of procedure("Sénégal").etapes) {
const r = diagnostiquer({ code: "etape", etape: e.id }, contexte(APP_PRE));
assert.ok(r.source && r.verifieLe, `${e.id} sans source ou date`);
}
// Une étape inconnue : on le dit, on n'invente pas.
assert.equal(diagnostiquer({ code: "etape", etape: "ef_inexistante" }, contexte(APP_PRE)).resolu, false);
});

// ------------------------------------------------------------------
// 4. Le paiement lit la COUCHE DE RÉSIDENCE
// ------------------------------------------------------------------

test("bloc=paiement : Bénin (Société Générale, compte 502, 70 000 F, AVANT) contre Sénégal (SUNU BANK, 85 000 F, APRÈS)", () => {
const benin = diagnostiquer({ code: "paiement" }, contexte(APP_PRE, { pays: "Bénin" }));
assert.equal(benin.resolu, true);
assert.match(benin.texte, /Société Générale du Bénin/);
assert.match(benin.texte, /compte 502/);
assert.match(benin.texte, /70 000 F/);
assert.match(benin.texte, /précède la soumission|avant la soumission/i);
assert.ok(!/SUNU BANK/.test(benin.texte), "un Béninois ne doit jamais lire SUNU BANK");
assert.equal(benin.montant, 70000);

const senegal = diagnostiquer({ code: "paiement" }, contexte(APP_PRE, { pays: "Sénégal" }));
assert.match(senegal.texte, /SUNU BANK/);
assert.match(senegal.texte, /85 000 F/);
assert.match(senegal.texte, /ne payez JAMAIS avant|après la soumission/i);
assert.ok(!/Société Générale/.test(senegal.texte));
assert.equal(senegal.montant, 85000);

for (const d of [benin, senegal]) {
assert.match(d.source, /campusfrance\.org/);
assert.match(d.verifieLe, /^\d{4}-\d{2}-\d{2}$/);
}

// Pays non documenté : absent ≠ zéro ≠ inconnu — on le dit, on ne devine pas.
const rwanda = diagnostiquer({ code: "paiement" }, contexte(APP_PRE, { pays: "Rwanda" }));
assert.match(rwanda.texte, /pas encore documenté/);
assert.ok(!/\d{2} 000 F/.test(rwanda.texte), "aucun montant emprunté à un autre pays");
assert.equal(rwanda.montant, undefined);
});

// ------------------------------------------------------------------
// 5. Le verrou sur un compte gratuit : le diagnostic ET l'échelle
// ------------------------------------------------------------------

test("bloc=verrou sur un compte gratuit : la formule qui ouvre, et une échelle sans maillon fermé", () => {
const session = { planId: "gratuit", planPreinscriptionId: "", featureFlags: flags };
const d = diagnostiquer({ code: "verrou", feature: "ai_letter" }, { ...session, parcours: "bourse" });
assert.equal(d.resolu, true);
assert.match(d.texte, /n'est pas compris dans votre formule actuelle \(Gratuit\)/);
assert.ok(d.formule, "une formule qui ouvre doit être nommée");
assert.equal(decideVerrou({ planId: d.formule, featureFlags: flags, featureKey: "ai_letter" }), false, "la formule nommée ouvre réellement l'outil");
assert.ok(!/Essentiel ou Essentiel/.test(d.texte), "pas deux fois le même libellé");
assert.match(d.lien, /^offers\.html\?parcours=bourse#/);

const echelle = echelleDeRecours(session);
// Le compte gratuit n'a NI messagerie, NI conseiller, NI ticket : l'échelle
// est vide, et messageDeFitz le dit plutôt que de montrer une porte fermée.
for (const m of echelle) assert.equal(decideVerrou({ planId: "gratuit", featureFlags: flags, featureKey: m.feature }), false, `${m.id} est fermé au gratuit`);
const message = messageDeFitz(d, echelle);
assert.match(message, /Voir /);
assert.ok(!/advisor\.html|messages\.html/.test(message) || echelle.length > 0, "aucun maillon verrouillé nommé");
});

// ------------------------------------------------------------------
// 6. L'échelle d'un compte Diagnostic France
// ------------------------------------------------------------------

test("l'échelle de recours d'un compte diagnostic-france propose la messagerie et le ticket, jamais le conseiller", () => {
const e = echelleDeRecours({ planId: "gratuit", planPreinscriptionId: "diagnostic-france", featureFlags: flags });
assert.deepEqual(e.map((m) => m.id), ["messagerie", "signalement"]);
assert.match(e[0].detail, new RegExp(DELAI_REPONSE));
assert.deepEqual(echelleDeRecours({ planId: "conseiller-6", featureFlags: flags }).map((m) => m.id), ["messagerie", "conseiller", "signalement"]);
assert.deepEqual(echelleDeRecours({ planId: "gratuit", planPreinscriptionId: "dossier-france-conseiller", featureFlags: flags }).map((m) => m.id), ["messagerie", "conseiller", "signalement"]);
assert.deepEqual(echelleDeRecours({ planId: "gratuit", featureFlags: flags }), []);
// Le Pass Découverte : le ticket, rien d'autre.
assert.deepEqual(echelleDeRecours({ planId: "gratuit", hasFitzExpress: true, featureFlags: flags }).map((m) => m.id), ["signalement"]);
// L'ordre est imposé : messagerie, conseiller, signalement.
for (const m of echelleDeRecours({ planId: "conseiller-6", featureFlags: flags })) assert.ok(m.href && m.label && m.detail);
});

// ------------------------------------------------------------------
// 7. ANTI-DIVERGENCE : Fitz et la page donnent la même réponse
// ------------------------------------------------------------------

test("bloc=quoi_faire EST prochaineAction() — même entrée, même sortie", () => {
for (const [app, opts] of [[APP_PRE, { profileScore: 3 }], [APP_BOURSE, { profileScore: 10 }], [APP_BOURSE, { profileScore: 2 }]]) {
const c = contexte(app, opts);
const page = prochaineAction({ profileScore: c.profileScore, applications: c.applications, opportunitesCount: 0, aujourdhui: AUJOURDHUI });
const fitz = diagnostiquer({ code: "quoi_faire" }, c);
assert.deepEqual(fitz.action, page, "Fitz doit rendre exactement l'action de la page");
assert.equal(fitz.texte, `${page.titre} — ${page.texte}`);
assert.equal(fitz.lien, page.href);
}
});

test("bloc=prerequis nomme ce qui manque, avec le libellé de next-action.js", () => {
const c = contexte(APP_BOURSE, { profileScore: 2 });
const d = diagnostiquer({ code: "prerequis", etape: "letter" }, c);
assert.equal(d.resolu, true);
assert.match(d.texte, new RegExp(`attend ${LIBELLE_PREREQUIS.profile}`));
assert.deepEqual(d.manquants, ["profile"]);
// Profil complet : rien ne bloque, et on le dit.
const ok = diagnostiquer({ code: "prerequis", etape: "letter" }, contexte(APP_BOURSE, { profileScore: 10 }));
assert.match(ok.texte, /Rien ne bloque/);
});

test("depot_tiers, documents, preuve, echeance, sans_reponse lisent la donnée réelle — et disent quand elle manque", () => {
const avec = contexte(APP_BOURSE, { bourse: BOURSE, profileScore: 10 });
assert.equal(diagnostiquer({ code: "depot_tiers" }, avec).parTiers, true);
assert.match(diagnostiquer({ code: "depot_tiers" }, avec).texte, /ne déposez pas (cette candidature )?vous-même/i);
// Sans bourse liée : pas résolu, pas inventé.
assert.equal(diagnostiquer({ code: "depot_tiers" }, contexte(APP_BOURSE)).resolu, false);
assert.equal(diagnostiquer({ code: "documents" }, contexte(APP_BOURSE)).resolu, false);
const docs = diagnostiquer({ code: "documents" }, avec);
assert.equal(docs.resolu, true);
assert.match(docs.texte, /Il manque à votre dossier/);
// La preuve : par un tiers → mode « transmis » seulement.
assert.match(diagnostiquer({ code: "preuve" }, avec).texte, /transmis/i);
// L'échéance : 10 jours → « proche », phrase de compte à rebours.
const ech = diagnostiquer({ code: "echeance" }, contexte(APP_BOURSE, { profileScore: 10 }));
assert.equal(ech.jours, 10);
assert.match(ech.texte, /dans 10 jours/);
// Sans date ni jalon : absent, dit absent.
assert.equal(diagnostiquer({ code: "echeance" }, contexte({ ...APP_BOURSE, deadline: null })).resolu, false);
// Sénégal : les jalons de la campagne.
assert.match(diagnostiquer({ code: "echeance" }, contexte(APP_PRE, { pays: "Sénégal" })).texte, /15 décembre 2026/);
// Côte d'Ivoire : aucune date publiée — la phrase d'absence de la couche.
assert.match(diagnostiquer({ code: "echeance" }, contexte(APP_PRE, { pays: "Côte d'Ivoire" })).texte, /n'a pas publié le calendrier/);
assert.match(diagnostiquer({ code: "sans_reponse" }, avec).texte, new RegExp(DELAI_REPONSE));
});

// ------------------------------------------------------------------
// 8. La forme : composant, pages, chat, règles, journal
// ------------------------------------------------------------------

test("un seul composant, posé aux six endroits du blocage", () => {
const html = boutonRecours({ code: "etape", app: "pre-1", etape: "ef_paiement" });
assert.match(html, /class="fitz-recours"/);
assert.match(html, /href="ai-chat\.html\?bloc=etape&amp;app=pre-1&amp;etape=ef_paiement"/);
// includes() et non une RegExp : le « ? » du libellé est un quantificateur.
assert.ok(html.includes(LIBELLE_RECOURS), "le libellé du recours manque");
assert.match(html, /data-recours="etape"/);

const dash = lire("dashboard.js");
assert.match(dash, /boutonRecours\(\{ code: "quoi_faire"/, "sous la carte « prochaine action »");
const apps = lire("applications.js");
assert.match(apps, /boutonRecours\(\{ code: "prerequis", app: app\.id, etape: alertes\[0\]\.id \}/, "sur une étape prématurée");
assert.match(apps, /boutonRecours\(\{ code: p\.type === "paiement" \? "paiement" : "etape", app: app\.id, etape: s\.id \}\)/, "sur chaque étape de procédure");
assert.match(apps, /function recoursEcheance\(app\)/, "sur une échéance proche");
assert.match(apps, /jours > JOURS_PROCHE\) return ""/, "seuil de next-action.js, pas un chiffre local");
assert.match(apps, /boutonRecours\(\{ code: "documents", app: app\.id, etape: item\.type \}\)/, "par élément de dossier");
const shell = lire("js/app-shell.js");
assert.match(shell, /boutonRecours\(\{ code: "verrou", feature: key \}/, "à la place d'un outil verrouillé");
// Le bouton flottant et l'onglet mobile restent.
assert.match(shell, /^initFitzFab\(\);/m);
assert.match(lire("js/mobile-nav.js"), /mnav-tab--fitz/);
});

test("le chat arrive en sachant déjà : ?bloc= ouvre par Fitz, et le diagnostic s'affiche même verrouillé", () => {
const chat = lire("ai-chat.js");
assert.match(chat, /const blocageDemande = lireBlocage\(window\.location\.search\);/);
assert.match(chat, /role: "assistant", content: messageDeFitz\(diag, echelle\)/, "Fitz parle le premier");
assert.match(chat, /async function renderDiagnosticVerrouille/, "le diagnostic est calculé, donc gratuit");
assert.match(chat, /renderDiagnosticVerrouille\(container, ctx\);/);
assert.match(chat, /enregistrerBlocage\(/, "chaque ouverture est journalisée");
// Le motif ?prep= n'a pas été dupliqué : la même page, les deux paramètres.
assert.match(chat, /pendingTestPrep/);
});

test("le journal ne porte que le code et son issue — et les règles l'imposent", () => {
const journal = lire("js/fitz-recours-journal.js");
for (const champ of ["code", "applicationId", "etapeId", "parcours", "plan", "resolu", "date"]) assert.match(journal, new RegExp(`${champ}:`));
assert.ok(!/message|texte|contenu|email|nom/.test(journal.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "")), "aucun texte de conversation, aucune donnée personnelle");
const regles = lire("firestore.rules");
assert.match(regles, /match \/users\/\{uid\}\/blocages\/\{blocageId\} \{/);
assert.match(regles, /hasOnly\(\["code", "applicationId", "etapeId", "parcours", "plan", "resolu", "date"\]\)/);
assert.match(regles, /allow update, delete: if false;/);
assert.match(regles, /match \/\{path=\*\*\}\/blocages\/\{blocageId\} \{\s*allow read: if isAdmin\(\);/);
assert.match(lire("admin/firebase-admin.js"), /export async function getBlocagesFrequents/);
assert.match(lire("admin/dashboard.html"), /id="blocagesList"/);
});
