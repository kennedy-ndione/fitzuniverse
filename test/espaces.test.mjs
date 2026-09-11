/**
* ============================================================
* test/espaces.test.mjs — deux espaces distincts (lot S4)
* ============================================================
*
* Le parcours était un FILTRE : un champ `track` sur une candidature,
* lu à cinq endroits, qui changeait quelques étapes. Il devient une
* IDENTITÉ — ce qui décide où un client atterrit, ce qu'il voit, ce
* qu'il peut écrire, et comment on lui parle.
*
* Trois règles commandent tout le reste, et chacune a ses tests :
*
*   a) ce qui n'est pas dans l'accompagnement n'est pas GRISÉ, il est
*      ABSENT DU DOM. Le verrou d'avant était une opacité de 55 % sur un
*      lien qui restait cliquable, tabulable et trouvable au Ctrl+F ;
*   b) un client qui force l'URL d'un autre espace n'est pas envoyé aux
*      offres : il est RAMENÉ CHEZ LUI. On ne vend pas à quelqu'un qui a
*      déjà payé ;
*   c) aucune page d'outil n'est dupliquée — la séparation se joue sur
*      le hub, la navigation et le garde d'entrée.
*
* LA NON-RÉGRESSION EST LE TEST QUI COMPTE LE PLUS : un compte gratuit
* garde son profil et son compte, et n'est jamais renvoyé en boucle.
* ============================================================
*/

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// La logique pure vit dans js/plan-features.js depuis ce lot : un test
// Node ne peut pas charger access-guard.js, qui importe le SDK Firebase
// depuis un CDN. C'est précisément ce qui empêchait d'écrire ce test.
import { resoudreEspace, espaceAutorise, unlockingPlans, ESPACES, HUB_ESPACE } from "../js/plan-features.js";
import { phasesDe, PHASES_PAR_ESPACE, etatDesPhases } from "../js/journey-map.js";
import { PLAN_PREINSCRIPTION_ORDER } from "../js/plan-features.js";
// Lot ACCEPTATION, partie 3 : la cible d'après paiement est une fonction pure.
import { cibleApresPaiement } from "../js/fitz-choisit.js";


const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(racine, f), "utf8").replace(/\r\n/g, "\n");

const HIER = "2026-09-08T00:00:00.000Z";
const DEMAIN = "2027-06-01T00:00:00.000Z";

// ------------------------------------------------------------------
// 1. resoudreEspace — la seule fonction de décision
// ------------------------------------------------------------------

test("resoudreEspace : un accompagnement, un espace", () => {
assert.deepEqual(ESPACES, ["bourse", "preinscription", "les-deux", "aucun"]);

assert.equal(resoudreEspace({ planId: "conseiller-6", planPreinscriptionId: "" }), "bourse");
assert.equal(resoudreEspace({ planId: "gratuit", planPreinscriptionId: "dossier-france" }), "preinscription");
assert.equal(resoudreEspace({ planId: "essentiel-4", planPreinscriptionId: "diagnostic-france" }), "les-deux");
assert.equal(resoudreEspace({ planId: "gratuit", planPreinscriptionId: "" }), "aucun");

// Le compte sans rien du tout, et l'absence d'objet : « aucun », jamais
// une exception — cette fonction est appelée avant tout affichage.
assert.equal(resoudreEspace({}), "aucun");
assert.equal(resoudreEspace(null), "aucun");
assert.equal(resoudreEspace(undefined), "aucun");
assert.equal(resoudreEspace("bourse"), "aucun");
});

test("resoudreEspace : testerAccess rend « les-deux », et c'est dit en toutes lettres", () => {
assert.equal(resoudreEspace({ testerAccess: true, planId: "gratuit", planPreinscriptionId: "" }), "les-deux");
// C'est exactement ce contournement qui a rendu invisible, des semaines
// durant, tout ce qu'un vrai client voyait. L'exception doit être
// LISIBLE dans le code, pas déduite d'un enchaînement de conditions.
const src = lire("js/plan-features.js");
assert.match(src, /if \(source\.testerAccess === true\) return "les-deux";/);
// Et seul le booléen `true` compte : une chaîne ne l'ouvre pas.
assert.equal(resoudreEspace({ testerAccess: "oui", planId: "gratuit" }), "aucun");
});

test("resoudreEspace : L'EXPIRATION EST COMPRISE — un forfait fini ne donne pas d'espace", () => {
// Sur un document users/{uid} BRUT : les deux formules sont résolues
// par resolvePlan/resolvePlanPreinscription, qui gèrent l'expiration.
const brut = (plan, planExpiresAt, planPreinscription, planPreinscriptionExpiresAt) =>
resoudreEspace({ plan, planExpiresAt, planPreinscription, planPreinscriptionExpiresAt });

// Bourse EXPIRÉE + préinscription active → "preinscription", jamais
// "les-deux". C'est le cas qui compte : il décide où l'on atterrit.
assert.equal(brut("conseiller-6", HIER, "dossier-france", DEMAIN), "preinscription");
// L'inverse.
assert.equal(brut("conseiller-6", DEMAIN, "dossier-france", HIER), "bourse");
// Les deux expirés : plus aucun espace.
assert.equal(brut("conseiller-6", HIER, "dossier-france", HIER), "aucun");
// Les deux actifs.
assert.equal(brut("conseiller-6", DEMAIN, "dossier-france", DEMAIN), "les-deux");
// Sans échéance, une formule reste active — un compte ancien peut ne
// pas en avoir, on ne lui retire pas son accès pour ça.
assert.equal(brut("essentiel-4", undefined, "", undefined), "bourse");
});

test("espaceAutorise : une page sans espace est ouverte à tous", () => {
// profil, compte, messages, documents : ils n'appartiennent à aucun
// parcours, et un client des deux les partage.
for (const espace of ESPACES) assert.equal(espaceAutorise(espace, ""), true, espace);
assert.equal(espaceAutorise("les-deux", "bourse"), true);
assert.equal(espaceAutorise("les-deux", "preinscription"), true);
assert.equal(espaceAutorise("bourse", "bourse"), true);
assert.equal(espaceAutorise("bourse", "preinscription"), false);
assert.equal(espaceAutorise("preinscription", "bourse"), false);
assert.equal(espaceAutorise("aucun", "bourse"), false);
});

// ------------------------------------------------------------------
// 2. « On ne vend pas à quelqu'un qui a déjà payé »
// ------------------------------------------------------------------

test("une page d'un autre espace RAMÈNE CHEZ SOI, elle n'envoie pas aux offres", () => {
const guard = lire("js/access-guard.js");
const shell = lire("js/app-shell.js");

// La redirection vise le hub de l'utilisateur…
for (const src of [guard, shell]) {
assert.match(src, /window\.location\.replace\(HUB_ESPACE\[espaceUtilisateur\]\)/, "la redirection doit viser le hub du client");
}
// …et elle passe AVANT le calcul du verrou de formule, sinon un client
// préinscription serait d'abord jugé « sans droit » sur un outil Fitz
// et expédié aux offres.
const corps = guard.slice(guard.indexOf("export function requireFeature"));
assert.ok(corps.indexOf("HUB_ESPACE[espaceUtilisateur]") < corps.indexOf("offers.html"), "le renvoi chez soi doit précéder le renvoi aux offres");

// Le compte SANS espace, lui, va bien aux offres : il n'a pas de chez-soi,
// et la page d'offres répond à la question qu'il se pose.
assert.match(guard, /espaceUtilisateur !== "aucun"/);

assert.deepEqual(HUB_ESPACE, {
bourse: "espace-bourse.html",
preinscription: "espace-preinscription.html",
"les-deux": "espace-bourse.html",
aucun: "dashboard.html"
});
});

test("unlockingPlans cherche dans la bonne grille", () => {
// diagnostic_france n'est ouvert par AUCUNE formule bourse : sans
// l'espace, la fonction ne trouvait rien et l'appelant renvoyait sur une
// page d'offres nue — la porte des bourses montrée à quelqu'un venu
// acheter un dossier France.
const flags = { "dossier-france": true, "diagnostic-france": true, gratuit: false };
assert.deepEqual(unlockingPlans("gratuit", flags, "preinscription"), PLAN_PREINSCRIPTION_ORDER.filter((p) => flags[p]));
assert.ok(unlockingPlans("gratuit", flags, "preinscription").length > 0);
// Sans espace, on retombe sur la grille préinscription plutôt que sur rien.
assert.ok(unlockingPlans("gratuit", flags).length > 0);
// Une fonctionnalité bourse continue de proposer des formules bourse.
assert.deepEqual(unlockingPlans("gratuit", { "essentiel-4": true }, "bourse")[0], "essentiel-4");
assert.deepEqual(unlockingPlans("gratuit", null), []);
});

test("chaque page d'outil déclare son espace", () => {
// Lot PRÉ-FITZ (2026-09-10) : les outils Fitz servent les DEUX parcours
// depuis que le Dossier France les a. Ils déclarent l'espace des
// outils (ESPACE_OUTILS) — pas « bourse », qui ramenait chez lui un
// client préinscription avant qu'il ait vu l'outil que son forfait lui
// ouvre. La préparation aux tests reste un outil bourse.
for (const f of ["ai-letter.js", "ai-check.js", "ai-email.js", "ai-translate.js", "ai-chat.js", "interview-prep.js"]) {
assert.match(lire(f), /espace: ESPACE_OUTILS/, `${f} doit déclarer espace: ESPACE_OUTILS`);
assert.ok(!/espace: "bourse"/.test(lire(f)), `${f} ne doit plus s'enfermer dans l'espace bourse`);
}
for (const [f, espace] of [["test-prep.js", "bourse"], ["js/diagnostic-france-page.js", "preinscription"]]) {
assert.match(lire(f), new RegExp(`espace: "${espace}"`), `${f} doit déclarer espace: "${espace}"`);
}
// Les pages COMMUNES n'en déclarent aucun : elles n'appartiennent à
// aucun parcours, et les marquer enfermerait un client des deux.
for (const f of ["profile.js", "account.js", "documents.js", "js/messages-page.js", "applications.js"]) {
assert.ok(!/espace: "(bourse|preinscription)"/.test(lire(f)), `${f} ne doit appartenir à aucun espace`);
}
});

// ------------------------------------------------------------------
// 3. Absent du DOM, jamais grisé
// ------------------------------------------------------------------

test("un droit fermé RETIRE l'élément — l'opacité de verrouillage a disparu", () => {
const shell = lire("js/app-shell.js");
// Lot FITZ-RECOURS : un OUTIL verrouillé laisse d'abord le recours
// (« Bloqué ? Demandez à Fitz »), puis l'élément est retiré — toujours
// retiré, jamais grisé.
assert.match(shell, /if \(locked\) \{[\s\S]{0,900}?el\.remove\(\);/, "applyFeatureLocks doit retirer, pas griser");
// Le lien n'est plus réécrit vers offers.html : il n'existe plus.
assert.ok(!/link\.setAttribute\("href", targetPlan \? `offers\.html/.test(shell), "un lien retiré n'a pas besoin d'une destination de vente");

const css = lire("css/journey.css");
assert.ok(!/\[data-feature\]\.is-locked[\s\S]{0,80}opacity:\s*\.55/.test(css), "l'opacité 55 % du verrou doit avoir disparu");
assert.match(css, /\[data-feature\] \.jy-lock\{ display:none; \}/, "le cadenas reste masqué par défaut");
});

test("le bouton flottant Fitz n'est PAS injecté avant de connaître l'espace", () => {
const shell = lire("js/app-shell.js");
// initShellChrome() tourne avant la résolution de session : elle ne
// peut pas savoir dans quel espace on est. L'injection a donc quitté
// cette fonction — sinon le bouton apparaîtrait puis disparaîtrait,
// et resterait en cas d'échec de résolution.
const chrome = shell.slice(shell.indexOf("export function initShellChrome"), shell.indexOf("export function bootstrapShell"));
assert.ok(!/^\s*initFitzFab\(\);/m.test(chrome), "initFitzFab ne doit plus être appelé au montage de la coquille");
// Il est injecté par bootstrapShell — dans TOUS les espaces depuis le
// lot PRÉ-FITZ : c'est le verrou de formule (data-feature="ai_chat")
// qui le retire à qui n'a pas le chat, pas l'espace.
const boot = shell.slice(shell.indexOf("export function bootstrapShell"));
assert.match(boot, /^initFitzFab\(\);/m, "initFitzFab doit être appelé sans condition d'espace");
assert.ok(!/courant !== "preinscription"\) initFitzFab/.test(boot), "plus aucune exclusion de l'espace préinscription");
});

test("le hub préinscription porte les cinq outils Fitz, verrouillés par formule — et pas la préparation aux tests", () => {
const hub = lire("espace-preinscription.html");
// Lot PRÉ-FITZ : sept vœux = sept lettres, des courriels aux
// établissements, des pièces à traduire, un dossier à vérifier avant
// de soumettre, et des questions. Chaque outil est dans le span
// data-feature qui le verrouille (applyFeatureLocks).
for (const [feature, outil] of [["ai_chat", "ai-chat.html"], ["ai_letter", "ai-letter.html"], ["ai_check", "ai-check.html"], ["ai_email", "ai-email.html"], ["ai_translate", "ai-translate.html"]]) {
assert.ok(hub.includes(`<span data-feature="${feature}"><a href="${outil}" data-real-href="${outil}"`), `${outil} doit être dans l'espace préinscription, sous son verrou`);
}
// La préparation aux tests de langue reste un outil du parcours bourse.
assert.ok(!hub.includes("test-prep.html"), "test-prep.html n'a rien à faire dans l'espace préinscription");
// Ce qu'il porte, en revanche : ses candidatures, ses documents, son
// diagnostic — et la procédure, publique.
for (const attendu of ["applications.html", "documents.html", "diagnostic-france.html", "preinscriptions.html", "universities.html"]) {
assert.ok(hub.includes(attendu), `${attendu} devrait être dans l'espace préinscription`);
}
});

test("la navigation mobile se filtre par espace, en retirant", () => {
const nav = lire("js/mobile-nav.js");
assert.match(nav, /function appliquerEspace\(espace\)/);
// L'onglet Fitz n'est plus retiré par l'espace (lot PRÉ-FITZ) : il porte
// data-feature="ai_chat", et c'est le verrou de formule qui décide.
assert.ok(!/if \(espace === "preinscription"\) \{[\s\S]{0,160}fitz\.remove\(\)/.test(nav), "l'onglet Fitz ne doit plus être retiré par l'espace");
assert.match(nav, /data-feature="ai_chat" class="mnav-tab mnav-tab--fitz"/);
assert.match(nav, /lien\.remove\(\)/);
// Les entrées bourse sont marquées comme telles.
for (const href of ["test-prep.html", "interview-prep.html", "scholarships.html"]) {
assert.match(nav, new RegExp(`href: "${href}"[^}]*espace: "bourse"`), `${href} doit être marquée bourse`);
}
// profil, compte, messages, universités restent communs.
for (const href of ["profile.html", "account.html", "messages.html", "universities.html"]) {
assert.ok(!new RegExp(`href: "${href}"[^}]*espace:`).test(nav), `${href} ne doit appartenir à aucun espace`);
}
});

// ------------------------------------------------------------------
// 4. La bascule, et la pastille de formule
// ------------------------------------------------------------------

test("la bascule n'entre dans le DOM que pour « les-deux »", () => {
const shell = lire("js/app-shell.js");
assert.match(shell, /if \(espaceUtilisateur !== "les-deux"\) return;/, "aucun sélecteur pour qui n'a qu'un accompagnement");
// Un client qui n'a acheté qu'un accompagnement ne doit pas apprendre
// l'existence de l'autre par un bouton grisé dans sa barre haute.
assert.match(shell, /sessionStorage/, "le choix vit en sessionStorage");
assert.ok(!/localStorage/.test(shell.slice(shell.indexOf("CLE_ESPACE"), shell.indexOf("espaceCourant"))), "pas de localStorage : un poste partagé n'hérite pas de l'espace du précédent");
});

test("la pastille de formule ne dit que l'espace courant", () => {
for (const f of ["js/app-shell.js", "js/dual-shell.js"]) {
const src = lire(f);
assert.match(src, /courant === "preinscription"|espace === "preinscription"/, `${f} : la pastille doit dépendre de l'espace`);
// Plus de concaténation des deux forfaits.
assert.ok(!/PLAN_LABELS\[session\.planId\] \+ \(PLAN_PREINSCRIPTION_LABELS/.test(src), `${f} : les deux forfaits ne se concatènent plus`);
}
});

// ------------------------------------------------------------------
// 5. Les hubs, l'aiguillage, et le vocabulaire
// ------------------------------------------------------------------

test("dashboard.html reste, et AIGUILLE", () => {
const html = lire("dashboard.html");
const js = lire("js/aiguillage.js");
// L'URL historique ne disparaît pas : trop de choses y pointent.
assert.match(html, /js\/aiguillage\.js/);
assert.match(js, /HUB_ESPACE\[espace\]/);
// « aucun » RESTE sur la page, avec un accueil minimal — le profil, le
// compte, et les deux portes. L'expédier aux offres serait le punir
// d'exister.
assert.match(html, /id="accueilMinimal"/);
assert.ok(html.includes('href="profile.html"') && html.includes('href="account.html"'), "le profil et le compte restent atteignables");
assert.ok(html.includes("offers.html?parcours=bourse") && html.includes("offers.html?parcours=preinscription"), "les deux portes");
// Et la page n'est PAS un hub : aucun rail, aucune phase mesurée.
assert.ok(!html.includes('id="jyRail"'), "l'aiguillage n'est pas un hub");
});

test("les deux hubs partagent la coquille et pas le vocabulaire", () => {
const bourse = lire("espace-bourse.html");
const pre = lire("espace-preinscription.html");

// La coquille : même barre haute, même moteur.
for (const commun of ['id="messagesBellBtn"', 'id="topbarPlanLabel"', 'id="jyRail"', 'id="jyApps"', 'src="dashboard.js"']) {
assert.ok(bourse.includes(commun) && pre.includes(commun), `${commun} devrait être dans les deux hubs`);
}
// L'espace de chaque page est déclaré sur le <body>.
assert.match(bourse, /<body data-espace="bourse">/);
assert.match(pre, /<body data-espace="preinscription">/);

// Le vocabulaire, lui, diffère.
assert.deepEqual(phasesDe("bourse").map((p) => p.label), ["Profil", "Opportunités", "Dossiers", "Dépôt", "Réponse", "Visa & départ"]);
assert.deepEqual(phasesDe("preinscription").map((p) => p.label), ["Profil", "Établissements", "Dossiers", "Dépôt", "Admission", "Visa & départ"]);
// Les `id` NE CHANGENT PAS : c'est eux que le moteur mesure.
assert.deepEqual(phasesDe("bourse").map((p) => p.id), phasesDe("preinscription").map((p) => p.id));
assert.deepEqual(Object.keys(PHASES_PAR_ESPACE), ["bourse", "preinscription"]);

// Un seul moteur : la même mesure des deux côtés.
const donnees = { profileScore: 9, applications: [{ status: "deposee" }], visaChecklist: {} };
const a = etatDesPhases({ ...donnees, espace: "bourse" });
const b = etatDesPhases({ ...donnees, espace: "preinscription" });
assert.equal(a.progressionPct, b.progressionPct);
assert.equal(a.couranteId, b.couranteId);
assert.deepEqual(a.phases.map((p) => p.faite), b.phases.map((p) => p.faite));
});

test("les trois pages d'espace portent EXACTEMENT la même barre haute", () => {
// La coquille a été recopiée de espace-bourse.html vers les deux autres
// pages : sans ce contrôle, corriger la cloche de messages ou la
// pastille d'un côté laisserait les deux autres derrière, et personne ne
// s'en apercevrait avant qu'un client le signale. On compare le bloc
// entier, au caractère près — seul le lien du logo diffère, chaque page
// pointant sur elle-même.
const barre = (f) => {
const s = lire(f);
const a = s.indexOf('<header class="journey-topbar">');
const b = s.indexOf("</header>", a);
assert.ok(a !== -1 && b !== -1, `${f} : aucune barre haute`);
return s.slice(a, b).replace(/<a href="[a-z-]+\.html" class="fitz-lockup"[^>]*>/, "<LOCKUP>");
};
const reference = barre("espace-bourse.html");
assert.equal(barre("espace-preinscription.html"), reference, "la barre haute du hub préinscription a divergé");
assert.equal(barre("dashboard.html"), reference, "la barre haute de l'aiguillage a divergé");
});

test("la checklist visa reste commune : c'est la seule chose que les deux parcours partagent", () => {
const bourse = lire("espace-bourse.html");
const pre = lire("espace-preinscription.html");
for (const etape of ["pieces", "finances", "rdv_visa", "assurance", "logement", "depart"]) {
assert.ok(bourse.includes(`data-visa-step="${etape}"`) && pre.includes(`data-visa-step="${etape}"`), `étape visa ${etape}`);
}
});

// ------------------------------------------------------------------
// 6. Candidatures, et redirections après paiement
// ------------------------------------------------------------------

test("applications.html est scopée par l'espace, et n'a plus de sélecteur de parcours", () => {
const js = lire("applications.js");
const html = lire("applications.html");

assert.match(js, /ESPACE \? toutes\.filter\(\(app\) => lireParcours\(app\) === ESPACE\) : toutes/, "la liste se filtre par espace");
// L'espace vient du shell — et un client des DEUX accompagnements garde
// ses deux parcours, chaque carte portant son étiquette. La règle du lot
// vise le client d'un seul accompagnement, et elle est tenue : son
// espace vaut alors « bourse » ou « preinscription », et le filtre joue.
assert.match(js, /ESPACE = ctx\.espaceUtilisateur === "les-deux" \? "" : \(ctx\.espace \|\| ""\)/, "l'espace vient du shell");
// Le parcours d'une nouvelle candidature vient de l'ESPACE, pas d'un menu.
// Le parcours d'une NOUVELLE candidature vient de l'espace COURANT
// (ESPACE_ECRITURE), et non du filtre de la liste : un client des deux
// accompagnements voit ses deux parcours, mais il en écrit UN — celui
// où il se trouve. Les avoir confondus faisait écrire « bourse » à un
// client passé en préinscription, sur un identifiant slot-N.
assert.match(js, /track: ESPACE_ECRITURE === "preinscription" \? "preinscription" : "bourse"/);
assert.match(js, /ESPACE_ECRITURE = ctx\.espace \|\| ""/);

// Le sélecteur a disparu du formulaire.
assert.ok(!html.includes('id="applicationTrack"'), "le select de parcours doit avoir disparu");
assert.ok(!html.includes('id="trackSection"'));
assert.ok(!/fields\.track/.test(js), "plus aucune lecture du champ de formulaire");
});

test("le message de quota nomme la formule DU PARCOURS dépassé", () => {
// Signalé comme un défaut à corriger ; il était déjà correct — les deux
// branches du message passent par nomFormulePour(track), qui lit la
// bonne grille. Ce test le fige pour que la correction ne se perde pas.
const js = lire("applications.js");
const bloc = js.slice(js.indexOf("if (isQuotaReached(quota, duParcours.length))"), js.indexOf("payload.nextCheckDate"));
assert.equal((bloc.match(/nomFormulePour\(track\)/g) || []).length, 2, "les deux branches doivent nommer la formule du parcours");
assert.ok(!/PLAN_LABELS\[planId\]/.test(bloc), "jamais la formule bourse en dur");
});

test("aucune formule en vente ne renvoie sur dashboard.html après paiement — la table vit dans js/fitz-choisit.js (lot ACCEPTATION)", () => {
const js = lire("payment.js");
// payment.js ne porte plus sa propre table : il appelle la fonction pure.
assert.ok(!js.includes("const POST_ACTIVATION_TARGETS"), "la table a déménagé dans js/fitz-choisit.js (cibleApresPaiement)");
assert.match(js, /import \{[^}]*cibleApresPaiement[^}]*\} from "\.\/js\/fitz-choisit\.js"/);
assert.match(js, /return cibleApresPaiement\(planId, profile \|\| \{\}\)/);
assert.match(js, /resolvePostActivationTarget\(plan\.id, profil\)/, "la cible se décide avec le profil tel que le serveur le connaît");
assert.ok(!js.includes("track=preinscription"), "le paramètre ?track= a disparu avec le sélecteur");

const PRET = { nationality: "Sénégal", desiredDegree: "Master", desiredField: "Informatique", languages: ["français"] };
for (const [plan, cible] of [
["fitzExpress", "ai-chat.html"],
["diagnostic-france", "diagnostic-france.html"],
["dossier-france", "espace-preinscription.html?action=new"],
["dossier-france-conseiller", "espace-preinscription.html?action=new"]
]) {
assert.equal(cibleApresPaiement(plan, {}), cible, `${plan} → ${cible}`);
assert.equal(cibleApresPaiement(plan, PRET), cible, `${plan} → ${cible}, quel que soit le profil`);
assert.ok(!cible.includes("dashboard.html"), "dashboard.html n'est plus qu'un aiguillage : y renvoyer ajoute une redirection");
}
// Les trois formules bourses : profil pas prêt → le profil pour Fitz ;
// prêt → les propositions à accepter. Plus jamais ?action=new.
for (const plan of ["premier-dossier", "essentiel-4", "conseiller-6"]) {
assert.equal(cibleApresPaiement(plan, {}), "profile.html?pour=fitz", `${plan}, profil vide`);
assert.equal(cibleApresPaiement(plan, PRET), "applications.html", `${plan}, profil prêt`);
assert.equal(cibleApresPaiement(plan, { ...PRET, languages: [] }), "profile.html?pour=fitz", `${plan}, une langue manque`);
}
// Le repli des formules dépréciées : l'espace bourse, jamais l'aiguillage.
assert.equal(cibleApresPaiement("accompagnement", PRET), "espace-bourse.html");
assert.equal(cibleApresPaiement("signature", {}), "espace-bourse.html");
});

// ------------------------------------------------------------------
// 7. NON-RÉGRESSION — le compte gratuit, et tout le reste
// ------------------------------------------------------------------

test("un compte gratuit garde son profil et son compte, et n'est jamais renvoyé en boucle", () => {
// resoudreEspace rend "aucun" : l'aiguillage ne redirige pas.
assert.equal(resoudreEspace({ planId: "gratuit", planPreinscriptionId: "" }), "aucun");
const js = lire("js/aiguillage.js");
const avant = js.slice(0, js.indexOf("// « aucun » : on reste, et on accueille."));
// Les deux seules redirections sont conditionnées à un espace RÉEL.
assert.equal((avant.match(/window\.location\.replace/g) || []).length, 2);
assert.match(avant, /if \(espace === "bourse" \|\| espace === "preinscription"\)/);
// Le hub d'un compte « aucun » est dashboard.html lui-même : s'y
// rediriger serait la boucle.
assert.equal(HUB_ESPACE.aucun, "dashboard.html");

// Et les pages communes ne le renvoient nulle part : elles n'ont pas
// d'espace, donc espaceAutorise() est vrai pour lui.
assert.equal(espaceAutorise("aucun", ""), true);
});

test("les procédures, les couches et le diagnostic rendent ce qu'ils rendaient avant ce lot", async () => {
const { trouverProcedure, residencesDocumentees } = await import("../js/procedures/index.js");
const { calculerDiagnostic } = await import("../js/diagnostic-france.js");

const sn = trouverProcedure({ paysDestination: "France", paysResidence: "Sénégal" });
assert.equal(sn.etapes.length, 11);
assert.equal(sn.etapes.filter((e) => e.echeance).length, 5);
assert.equal(sn.etapes.find((e) => e.id === "ef_paiement").montant, 85000);
assert.equal(residencesDocumentees("France").length, 8);

const r = calculerDiagnostic({ ressourcesMensuelles: 900, paysResidence: "Sénégal" });
assert.equal(r.total.annuelEUR, 10530 + 2902 + 130);
assert.equal(r.total.inclutFraisDossier, true);

// Le Burkina : la seule consigne touchée par ce lot, et sur un seul mot.
const bf = trouverProcedure({ paysDestination: "France", paysResidence: "Burkina Faso" });
const paiement = bf.etapes.find((e) => e.id === "ef_paiement");
assert.match(paiement.consigne, /payables après validation de votre dossier numérique/);
assert.ok(!/payables dès que vous soumettez/.test(paiement.consigne), "l'ambiguïté de la source est tranchée pour la page opérationnelle");
assert.equal(paiement.montant, 70000);
});
