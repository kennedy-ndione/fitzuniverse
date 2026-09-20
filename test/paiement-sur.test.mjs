/**
* Lot PAIEMENT-SÛR (2026-09-17) — avant le passage en paiement réel.
*
* Deux règles, parce qu'il n'y a jamais de remboursement :
*
*  1. AUCUN ACHAT ENCAISSÉ SANS EFFET. Toute combinaison formule
*     achetée × compte que le webhook n'appliquerait pas, ou appliquerait
*     sans rien ouvrir, doit être refusée par creerPaiement AVANT la
*     facture. Le trou trouvé ce jour-là : racheter Dossier France pendant
*     la campagne qu'il couvre déjà (« applique », même 31 juillet).
*     Le test rejoue la décision du serveur sur une matrice de comptes :
*     si refusAchat laisse passer ET que calculerMiseAJour ne change rien
*     d'utile, le test rougit.
*
*  2. LE CHIFFRE EN GROS EST CELUI QUI EST DÉBITÉ. PayDunya n'encaisse
*     que des FCFA : offers.html et payment.js affichent le FCFA en gros
*     et l'euro en petit, jamais l'inverse.
*/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");
const { GRILLE, refusAchat, calculerMiseAJour, estEnVente, PREINSCRIPTION_SUIVANTE } = require(path.join(RACINE, "functions/lib/achat.js"));

const SUPPRIMER = Symbol("delete");
const maintenant = new Date("2026-09-17T12:00:00Z");
const FIN_CAMPAGNE = "2027-07-31T23:59:59.000Z";

test("paiement-sûr 1 — racheter un Dossier France encore actif pour la campagne est refusé avant la facture", () => {
const detenteur = { planPreinscription: "dossier-france", planPreinscriptionExpiresAt: FIN_CAMPAGNE };
const r = refusAchat({ planId: "dossier-france", user: detenteur, maintenant });
assert.equal(r.code, "meme-dossier");
assert.equal(r.message, "Vous détenez déjà le Dossier France pour cette campagne : il reste actif jusqu'au 31 juillet 2027. Pour un conseiller à vos côtés, passez au Dossier France + Conseiller.");

const conseiller = { planPreinscription: "dossier-france-conseiller", planPreinscriptionExpiresAt: FIN_CAMPAGNE };
const r2 = refusAchat({ planId: "dossier-france-conseiller", user: conseiller, maintenant });
assert.equal(r2.code, "meme-dossier");
assert.match(r2.message, /Il n'y a rien de plus à acheter pour cette campagne\.$/);

// Monter reste possible.
assert.equal(refusAchat({ planId: "dossier-france-conseiller", user: detenteur, maintenant }), null);
// Une NOUVELLE campagne reste possible : dossier fini le 31 juillet 2026, achat en septembre.
assert.equal(refusAchat({ planId: "dossier-france", user: { planPreinscription: "dossier-france", planPreinscriptionExpiresAt: "2026-07-31T23:59:59.000Z" }, maintenant }), null);
// Le diagnostic se prolonge : pas de refus.
assert.equal(refusAchat({ planId: "diagnostic-france", user: { planPreinscription: "diagnostic-france", planPreinscriptionExpiresAt: "2026-09-25T00:00:00.000Z" }, maintenant }), null);
// La table des marches ne vise que des offres en vente.
for (const [de, vers] of Object.entries(PREINSCRIPTION_SUIVANTE)) {
assert.ok(estEnVente(de), de);
if (vers) assert.ok(estEnVente(vers), vers);
}
});

// Ce qu'un achat APPLIQUÉ doit changer pour valoir son prix.
function ouvreQuelqueChose(planId, user, misAJour) {
const offre = GRILLE[planId];
if (offre.pass) return misAJour.fitzExpressExpiresAt !== user.fitzExpressExpiresAt;
if (offre.parcours === "preinscription") {
return misAJour.planPreinscription !== user.planPreinscription
|| misAJour.planPreinscriptionExpiresAt !== user.planPreinscriptionExpiresAt;
}
return misAJour.plan !== user.plan;
}

test("paiement-sûr 2 — aucune formule en vente n'est encaissée sans effet, sur une matrice de comptes", () => {
const actif = "2027-03-01T00:00:00.000Z";
const comptes = [
{},
{ plan: "premier-dossier" },
{ plan: "essentiel-4" },
{ plan: "conseiller-6" },
{ plan: "accompagnement", planExpiresAt: actif },
{ plan: "signature", planExpiresAt: actif },
{ fitzExpressExpiresAt: "2026-09-20T00:00:00.000Z" },
{ planPreinscription: "diagnostic-france", planPreinscriptionExpiresAt: "2026-09-25T00:00:00.000Z" },
{ planPreinscription: "dossier-france", planPreinscriptionExpiresAt: FIN_CAMPAGNE },
{ planPreinscription: "dossier-france-conseiller", planPreinscriptionExpiresAt: FIN_CAMPAGNE },
];
const enVente = Object.keys(GRILLE).filter(estEnVente);
assert.ok(enVente.length >= 7);
const fautes = [];
for (const user of comptes) {
for (const planId of enVente) {
// Aucune carte bourse : le cas le plus permissif pour la règle du quota.
if (refusAchat({ planId, user, nombreCartesBourse: 0, maintenant })) continue;
const r = calculerMiseAJour({ planId, user, maintenant, supprimer: SUPPRIMER });
// « rang-inferieur » est refusé par creerPaiement lui-même (voir le test 3).
if (r.statut === "rang-inferieur") continue;
if (r.statut !== "applique" || !ouvreQuelqueChose(planId, user, r.misAJour)) {
fautes.push(`${planId} sur ${JSON.stringify(user)} → ${r.statut}`);
}
}
}
assert.deepEqual(fautes, []);
});

test("paiement-sûr 3 — creerPaiement refuse les deux cas AVANT de créer la facture", () => {
const paiement = lire("functions/paiement.js");
const facture = paiement.indexOf("checkout-invoice/create");
assert.ok(facture > 0);
assert.ok(paiement.indexOf("refusAchat({") > 0 && paiement.indexOf("refusAchat({") < facture);
const blanc = paiement.indexOf('aBlanc.statut === "rang-inferieur"');
assert.ok(blanc > 0 && blanc < facture, "le refus du rang inférieur arrive avant la facture");
});

test("paiement-sûr 4 — offers.html : le FCFA en gros, l'euro en petit, sur chaque carte", () => {
const html = lire("offers.html");
const cartes = [...html.matchAll(/<div class="plan-price">\n([\s\S]*?)<\/div>/g)].map((m) => m[1]);
assert.equal(cartes.length, 7);
for (const bloc of cartes) {
const id = (bloc.match(/data-price-of="([^"]+)"/) || [])[1];
assert.ok(id && GRILLE[id], `carte sans formule connue : ${bloc.slice(0, 80)}`);
assert.ok(bloc.startsWith(`<span class="plan-price-main"><span class="plan-amount" data-price-of="${id}"></span><span class="plan-currency">F CFA</span></span>\n<span class="plan-price-local" data-eur-of="${id}"></span>`), `${id} : le FCFA doit porter le montant`);
}
assert.ok(!/<span class="plan-currency">€<\/span>/.test(html), "un montant principal en euros");
const js = lire("offers.js");
assert.match(js, /if \(plan\) el\.textContent = formatF\(plan\.priceFCFA\);/);
assert.match(js, /soit environ \$\{Math\.round\(plan\.priceFCFA \/ EUR_PER_XOF\)\} €/);
});

test("paiement-sûr 5 — payment.js : le FCFA en gros, l'euro en petit, et le bouton annonce le FCFA d'abord", () => {
const js = lire("payment.js");
assert.match(js, /<span class="price-main">\$\{formatFCFA\(amountFCFA\)\}<span class="price-currency">F CFA<\/span><\/span>/);
assert.match(js, /<span class="price-local">soit environ \$\{formatEUR\(amountFCFA\)\} €<\/span>/);
assert.match(js, /Activer mon accompagnement — \$\{formatFCFA\(montant\)\} F CFA \(environ \$\{formatEUR\(montant\)\} €\)/);
assert.ok(!/\$\{formatEUR\([^)]*\)\} € — /.test(js), "une ligne qui commence encore par l'euro");
});
