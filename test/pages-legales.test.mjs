/**
* Lot LÉGAL (2026-09-17) — les quatre pages légales.
*
* Écrites le jour où le NINEA et le RCCM sont arrivés, pour le dossier
* de vérification PayDunya (KYC). Ce qui ne doit jamais dériver :
*
*  1. la forme commune (un h1, canonical sur fitzuniverse.com, feuille
*     css/legal.css, onglets entre les quatre pages, pas de pied de page) ;
*  2. l'identité de l'entreprise, recopiée À L'IDENTIQUE partout : un
*     numéro qui diffère d'une page à l'autre rend le dossier KYC
*     incohérent ;
*  3. les durées promises par les conditions de vente, comparées à la
*     grille que le SERVEUR applique (functions/lib/achat.js) — si la
*     grille change, ce test rougit tant que la page n'est pas corrigée ;
*  4. les deux règles d'achat de Charles : paiement en une fois, pas de
*     remboursement (hors erreur de paiement) ;
*  5. plus aucun lien du site vers la page « bientôt disponible ».
*/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");
const visible = (html) => html.replace(/<!--[\s\S]*?-->/g, "").replace(/<script[\s\S]*?<\/script>/g, "").replace(/<head>[\s\S]*?<\/head>/, "");
const texte = (html) => visible(html).replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ");

const { GRILLE, CLOTURE_CAMPAGNE, DEDUCTION_DIAGNOSTIC } = require(path.join(RACINE, "functions/lib/achat.js"));

export const PAGES_LEGALES = ["mentions-legales.html", "cgv.html", "confidentialite.html", "contact.html"];

export const IDENTITE = {
exploitant: "NDIONE CHARLES FIZGERAL KENNEDY",
rccm: "SN.MBR.2026.A.3440",
ninea: "013375531",
email: "contact@fitzuniverse.com",
telephone: "+221 33 904 66 78",
telLien: "tel:+221339046678",
quartier: "Médine Extension, Commune de Mbour"
};

const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
const nombreFr = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

test("légal 1 — les quatre pages existent et partagent la même forme", () => {
for (const page of PAGES_LEGALES) {
assert.ok(existsSync(path.join(RACINE, page)), `${page} absente`);
const html = lire(page);
assert.equal((visible(html).match(/<h1\b/g) || []).length, 1, `${page} : un seul h1`);
assert.ok(html.includes(`<link rel="canonical" href="https://fitzuniverse.com/${page}">`), `${page} : canonical`);
assert.ok(html.includes('<link rel="stylesheet" href="css/legal.css">'), `${page} : feuille css/legal.css`);
assert.ok(html.includes('<script src="js/glossaire-seul.js" defer></script>'), `${page} : glossaire`);
assert.ok(!/<footer\b|pied-de-page\.(js|css)/.test(visible(html)), `${page} : pas de pied de page`);
assert.ok(html.includes('class="fitz-lockup"'), `${page} : barre de marque`);
assert.ok(html.includes("Dernière mise à jour :"), `${page} : date de mise à jour`);
// Les onglets : les quatre pages, et la page courante marquée.
for (const autre of PAGES_LEGALES) assert.ok(html.includes(`<a href="${autre}"`), `${page} : onglet vers ${autre}`);
assert.ok(html.includes(`<a href="${page}" aria-current="page">`), `${page} : onglet courant non marqué`);
assert.equal((html.match(/aria-current="page"/g) || []).length, 1, `${page} : un seul onglet courant`);
}
assert.ok(existsSync(path.join(RACINE, "css/legal.css")));
});

test("légal 2 — l'identité de l'entreprise est la même partout", () => {
const ml = texte(lire("mentions-legales.html"));
for (const [cle, valeur] of Object.entries(IDENTITE)) {
if (cle === "telLien") continue;
assert.ok(ml.includes(valeur), `mentions légales : ${cle} « ${valeur} » absent`);
}
// Les autres pages qui citent l'entreprise disent exactement la même chose.
for (const page of ["cgv.html", "confidentialite.html"]) {
const t = texte(lire(page));
assert.ok(t.includes(IDENTITE.exploitant), `${page} : exploitant`);
assert.ok(t.includes(IDENTITE.rccm), `${page} : RCCM`);
assert.ok(t.includes(IDENTITE.email), `${page} : e-mail`);
}
assert.ok(texte(lire("cgv.html")).includes(IDENTITE.ninea), "cgv : NINEA");
// Aucun autre numéro RCCM ou NINEA ne traîne dans ces pages.
for (const page of PAGES_LEGALES) {
const t = texte(lire(page));
for (const m of t.matchAll(/SN\.[A-Z]{3}\.\d{4}\.[A-Z]\.\d+/g)) assert.equal(m[0], IDENTITE.rccm, `${page} : RCCM divergent`);
for (const m of t.matchAll(/NINEA\s+(\d+)/g)) assert.equal(m[1], IDENTITE.ninea, `${page} : NINEA divergent`);
}
// La page contact porte les deux moyens, cliquables.
const contact = lire("contact.html");
assert.ok(contact.includes(`href="mailto:${IDENTITE.email}"`));
assert.ok(contact.includes(`href="${IDENTITE.telLien}"`));
assert.ok(texte(contact).includes(IDENTITE.telephone));
});

test("légal 3 — les durées et la déduction des conditions de vente suivent la grille du serveur", () => {
const cgv = texte(lire("cgv.html"));
const passe = GRILLE.fitzExpress.dureeJours;
assert.equal(GRILLE["diagnostic-france"].dureeJours, passe, "Pass Découverte et Diagnostic France n'ont plus la même durée : réécrire la phrase commune des CGV");
assert.ok(cgv.includes(`Pass Découverte et Diagnostic France : ${passe} jours`), `CGV : durée de ${passe} jours absente`);
assert.ok(cgv.includes(`accès de ${passe} jours`), "CGV : durée du pass dans la présentation des parcours");
// Les forfaits bourses en vente n'ont pas d'échéance.
const boursesEnVente = Object.values(GRILLE).filter((o) => o.parcours === "bourse" && !o.pass && o.deprecated !== true);
assert.ok(boursesEnVente.length >= 1);
for (const o of boursesEnVente) assert.equal(o.dureeMois, null, `${o.label} a désormais une durée : corriger la section Durée des CGV`);
assert.ok(cgv.includes("pas de date d'expiration"));
// Les formules Dossier France : fin de campagne.
assert.ok(GRILLE["dossier-france"].campagne && GRILLE["dossier-france-conseiller"].campagne);
assert.ok(cgv.includes(`jusqu'au ${CLOTURE_CAMPAGNE.jour} ${MOIS[CLOTURE_CAMPAGNE.mois - 1]} de la campagne`), "CGV : date de fin de campagne");
// La déduction du diagnostic.
assert.ok(cgv.includes(`ses ${nombreFr(DEDUCTION_DIAGNOSTIC.montant)} F sont déduits`), "CGV : montant déduit");
assert.ok(cgv.includes(`dans les ${DEDUCTION_DIAGNOSTIC.jours} jours`), "CGV : délai de déduction");
// Aucun prix de formule écrit en dur : la page Formules fait foi.
for (const o of Object.values(GRILLE)) {
if (o.prix === DEDUCTION_DIAGNOSTIC.montant) continue;
assert.ok(!cgv.includes(`${nombreFr(o.prix)} F`), `CGV : prix de ${o.label} écrit en dur`);
}
});

test("légal 4 — paiement en une fois, pas de remboursement, et la phrase de garantie", () => {
const cgv = texte(lire("cgv.html"));
assert.ok(cgv.includes("se paie en une seule fois"));
assert.ok(cgv.includes("ni paiement fractionné, ni mensualité"));
assert.ok(cgv.includes("Une formule activée n'est pas remboursée"));
// La seule exception est l'erreur de paiement.
assert.ok(cgv.includes("Seule exception : une erreur de paiement"));
assert.ok(cgv.includes("La décision d'admission et la délivrance du visa relèvent, elles, des établissements et des autorités consulaires"));
// Aucune des pages ne promet une admission, une bourse ou un visa.
for (const page of PAGES_LEGALES) {
assert.ok(!/admission garantie|bourse garantie|visa garanti|satisfait ou rembours/i.test(texte(lire(page))), `${page} : promesse interdite`);
}
});

test("légal 5 — plus aucun lien du site vers la page « bientôt disponible »", () => {
const fautifs = [];
for (const f of readdirSync(RACINE).filter((x) => x.endsWith(".html") && x !== "bientot.html")) {
if (/href="bientot\.html/.test(visible(lire(f)))) fautifs.push(f);
}
if (/bientot\.html/.test(lire("js/pied-de-page.js"))) fautifs.push("js/pied-de-page.js");
assert.deepEqual(fautifs, []);
});
