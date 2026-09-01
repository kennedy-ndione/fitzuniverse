/**
 * ============================================================
 * Gardes — offers.html ne peut plus mentir sur ce qu'elle vend
 * (2026-09-01)
 *
 * Deux incohérences réelles, trouvées le même jour, que rien ne
 * signalait parce que les deux moitiés de chaque promesse vivent dans
 * des fichiers différents :
 *
 *  1. `premier-dossier` portait `deprecated: true` dans
 *     pricing-plans.js alors qu'offers.html affichait toujours son
 *     bouton d'achat. payment.js refuse toute offre dépréciée
 *     (isSellablePlan) : l'étudiant qui cliquait était envoyé vers un
 *     mur. La décision commerciale (vendue / retirée) appartient à
 *     l'utilisateur ; ce que cette garde interdit, c'est que les deux
 *     fichiers en donnent des versions DIFFÉRENTES. Elle aurait
 *     attrapé Premier Dossier, et elle vaut dans les deux sens : que
 *     l'offre revienne en vente ou reparte, la page et la grille
 *     doivent bouger ensemble.
 *
 *  2. offers.html annonçait « Wave, Orange Money et MTN MoMo » à un
 *     endroit, « Wave, Orange Money ou carte bancaire » à un autre,
 *     alors que le sélecteur réel de payment.js ne propose que
 *     wave / orange-money / card. MTN MoMo n'existe nulle part dans
 *     le produit.
 *
 * Comme test/copy-partenaire.test.mjs, ces gardes portent un
 * garde-fou anti-régression du balayage lui-même : un test qui ne
 * matche plus rien et passe au vert ne garde rien du tout.
 *
 * Aucun navigateur, aucun Firebase, aucune lecture Firestore.
 * Lancer : npm test
 * ============================================================
 */

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import vm from "node:vm";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(racine, f), "utf8");

// pricing-plans.js est un script classique, pas un module : même
// chargement que test/plan-features.test.mjs (contexte vm + `window`
// factice), ce qui vérifie au passage qu'il expose bien la grille.
function chargerGrille() {
const bacASable = { window: {} };
vm.createContext(bacASable);
vm.runInContext(lire("pricing-plans.js"), bacASable);
return bacASable.window.SCHOLARBRIDGE_PLANS;
}

const OFFRES = chargerGrille();
const offersHtml = lire("offers.html");
const paymentJs = lire("payment.js");

// Les identifiants réellement proposés à l'achat sur la page.
const boutons = [...offersHtml.matchAll(/data-plan="([^"]+)"/g)].map((m) => m[1]);

// ============================================================
// 1. Grille et page d'offres ne peuvent plus diverger
// ============================================================

test("offers.html n'affiche un bouton d'achat que pour des offres existantes", () => {
for (const id of boutons) {
assert.ok(
OFFRES[id],
`offers.html propose data-plan="${id}", qui n'existe pas dans pricing-plans.js`
);
}
});

test("offers.html n'affiche aucun bouton d'achat pour une offre dépréciée", () => {
for (const id of boutons) {
assert.notEqual(
OFFRES[id].deprecated,
true,
`offers.html propose « ${OFFRES[id].label} » (data-plan="${id}") alors que ` +
`pricing-plans.js la marque deprecated: true — payment.js la refusera ` +
`(isSellablePlan) et le clic mènera à un mur. Soit l'offre est vendue et le ` +
`drapeau doit sauter, soit elle est retirée et le bouton doit sauter avec.`
);
}
});

test("toute offre dépréciée est bien absente de la page", () => {
const depreciees = Object.keys(OFFRES).filter((id) => OFFRES[id].deprecated === true);
for (const id of depreciees) {
assert.ok(
!boutons.includes(id),
`« ${OFFRES[id].label} » est dépréciée mais garde un bouton dans offers.html`
);
}
});

// Anti-régression du balayage : si le motif data-plan changeait de
// forme, les trois tests ci-dessus boucleraient sur une liste vide et
// passeraient au vert sans rien vérifier.
test("le balayage voit bien les boutons d'achat de la page", () => {
assert.ok(boutons.length >= 4, `seulement ${boutons.length} data-plan trouvés dans offers.html`);
assert.ok(
boutons.includes("accompagnement"),
"l'offre pivot « accompagnement » doit être proposée sur la page"
);
assert.ok(
Object.keys(OFFRES).length >= 5,
"la grille tarifaire n'a pas été chargée correctement"
);
});

// ============================================================
// 2. Les moyens de paiement affichés = ceux du sélecteur
// ============================================================

// Le sélecteur réel : les clés de `methodLabels` dans initActivation
// (payment.js). C'est la seule liste que l'étudiant peut cocher.
const blocLibelles = paymentJs.match(/const methodLabels = \{([\s\S]*?)\};/);

const MOYENS = blocLibelles
? [...blocLibelles[1].matchAll(/^\s*"?([a-z-]+)"?\s*:\s*"([^"]+)"/gm)].map((m) => ({
cle: m[1],
libelle: m[2]
}))
: [];

test("payment.js expose bien un sélecteur de moyens de paiement", () => {
assert.ok(blocLibelles, "bloc `const methodLabels = { … };` introuvable dans payment.js");
assert.deepEqual(
MOYENS.map((m) => m.cle).sort(),
["card", "orange-money", "wave"],
"les clés du sélecteur ont changé : mettre à jour offers.html AVANT ce test"
);
});

test("offers.html ne cite que des moyens de paiement réellement proposés", () => {
// Texte visible seulement : l'historique d'un moyen retiré reste
// racontable en commentaire (voir payment.js et le rail MTN MoMo).
const visible = offersHtml.replace(/<!--[\s\S]*?-->/g, "");

for (const { libelle } of MOYENS) {
assert.ok(
visible.includes(libelle),
`offers.html ne mentionne nulle part « ${libelle} », pourtant proposé par payment.js`
);
}

// MTN MoMo : jamais dans le sélecteur, donc jamais sur la page.
// &nbsp; parce que la page insère une espace insécable dans « MTN MoMo ».
const interdits = [/MTN(?:&nbsp;|\s)*MoMo/i, /Mobile\s*Money/i];
for (const motif of interdits) {
const trouve = visible.match(motif);
assert.equal(
trouve,
null,
`offers.html annonce « ${trouve && trouve[0]} », qui n'est proposé nulle part ` +
`dans payment.js — le code tranche : ${MOYENS.map((m) => m.libelle).join(", ")}.`
);
}
});

// Anti-régression : le test ci-dessus ne vaut que si la page contient
// vraiment la phrase des moyens de paiement.
test("la page cite bien les moyens de paiement au moins une fois", () => {
const visible = offersHtml.replace(/<!--[\s\S]*?-->/g, "");
assert.ok(
(visible.match(/Wave/g) || []).length >= 2,
"« Wave » devrait apparaître au moins deux fois (bas de grille + FAQ) : " +
"si la phrase a disparu, cette garde ne garde plus rien"
);
});
