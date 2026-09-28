/**
* LOT 130 — la bande « Annonces » de l'accueil (2026-09-28).
*
* Demande de Charles : faire de la bande de la révélation l'endroit qui
* annonce les campagnes (Campus France Sénégal ouvre le 1er octobre),
* avec un défilement toutes les 8 secondes.
*
* Ce que ces tests verrouillent :
*   - une annonce naît à sa date, change de texte à l'ouverture et
*     MEURT le lendemain de la clôture, sans intervention humaine ;
*   - une vérification trop vieille éteint l'annonce ;
*   - une date illisible n'est jamais annoncée ;
*   - les campagnes passent avant la révélation, jamais plus de 4 ;
*   - le rendu tourne toutes les 8 s, s'arrête au survol, au toucher, au
*     clavier, avec prefers-reduced-motion et avec « Arrêter le
*     défilement », et n'utilise jamais innerHTML.
*/
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { ANNONCES, lireAnnonce, lireAnnonces, MAX_ANNONCES, JOURS_VALIDITE_ANNONCE } from "../js/revelations.js";

const jour = (iso) => new Date(`${iso}T10:00:00Z`);
const EEF = ANNONCES.find((a) => a.id === "eef-senegal-rentree-2027");

test("130 — Campus France Sénégal : les dates lues sur la page officielle", () => {
assert.ok(EEF, "l'annonce Études en France doit exister");
assert.equal(EEF.ouvreLe, "2026-10-01");
assert.equal(EEF.fermeLe, "2026-12-15");
assert.equal(EEF.source.url, "https://www.senegal.campusfrance.org/calendrier-de-la-procedure");
assert.match(EEF.texte, /Sénégal/, "l'annonce dit à qui elle s'adresse : le site sert le monde entier");
});

test("130 — avant l'ouverture : « ouvrent le 1er octobre »", () => {
const a = lireAnnonce(EEF, jour("2026-09-28"));
assert.equal(a.type, "bientot");
assert.equal(a.chiffre, "1er oct.");
assert.match(a.titre, /ouvrent le 1er octobre/);
});

test("130 — le 1er octobre, le texte bascule seul : « sont ouverts », jours restants", () => {
const a = lireAnnonce(EEF, jour("2026-10-01"));
assert.equal(a.type, "ouverte");
assert.match(a.titre, /sont ouverts/);
assert.equal(a.chiffre, "75 jours");
assert.equal(lireAnnonce(EEF, jour("2026-12-14")).chiffre, "1 jour");
assert.equal(lireAnnonce(EEF, jour("2026-12-15")).chiffre, "Dernier jour", "le jour de la clôture compte encore");
});

test("130 — l'annonce meurt d'elle-même : trop tôt, après la clôture, vérification trop vieille", () => {
assert.equal(lireAnnonce(EEF, jour("2026-09-20")), null, "avant afficherDes");
assert.equal(lireAnnonce(EEF, jour("2026-12-16")), null, "le lendemain de la clôture");
const vieille = { ...EEF, verifieLe: "2026-06-01" };
assert.ok(JOURS_VALIDITE_ANNONCE <= 90);
assert.equal(lireAnnonce(vieille, jour("2026-10-01")), null, "une vérification de plus de 90 jours ne garantit plus rien");
assert.equal(lireAnnonce({ ...EEF, fermeLe: "15 décembre" }, jour("2026-10-01")), null, "une date illisible n'est jamais annoncée");
});

test("130 — ordre : les campagnes (la plus proche d'abord), puis la révélation ; jamais plus de 4", () => {
const base = { ...EEF, afficherDes: "2026-09-01", verifieLe: "2026-09-28" };
const liste = [
{ ...base, id: "loin", ouvreLe: "2026-09-01", fermeLe: "2026-12-30" },
{ ...base, id: "proche", ouvreLe: "2026-09-01", fermeLe: "2026-10-10" },
...["c", "d", "e"].map((x) => ({ ...base, id: x, ouvreLe: "2026-09-01", fermeLe: "2026-11-30" }))
];
const r = lireAnnonces([], jour("2026-10-01"), liste);
assert.equal(r.length, MAX_ANNONCES);
assert.equal(r[0].id, "proche");
assert.ok(r.every((a) => a.type !== "revelation"), "sans catalogue prouvé, pas de révélation");
assert.ok(r.every((a) => !("echeance" in a)), "le champ de tri ne sort pas du module");
});

test("130 — rendu : 8 secondes, pauses, reduced-motion, bouton d'arrêt, pas d'innerHTML", () => {
const src = readFileSync(new URL("../js/opportunites-bandeau.js", import.meta.url), "utf8");
assert.match(src, /const DELAI_ANNONCE_MS = 8000;/);
const corps = src.slice(src.indexOf("function construireAnnonces"), src.indexOf("* Montage"));
assert.ok(corps.length > 500, "construireAnnonces introuvable");
assert.ok(!/innerHTML/.test(corps), "les annonces sont construites en textContent");
for (const ev of ["mouseenter", "focusin", "touchstart"]) assert.ok(corps.includes(`"${ev}"`), `pause sur ${ev}`);
assert.match(corps, /prefers-reduced-motion: reduce/);
assert.match(corps, /est-figee/, "« Arrêter le défilement » arrête aussi les annonces");
assert.match(corps, /document\.hidden/);
assert.match(corps, /inert/, "une annonce cachée sort du parcours clavier");
const css = readFileSync(new URL("../css/opportunites.css", import.meta.url), "utf8");
assert.match(css, /\.annonces-piste > \.revelation\{\s*grid-area:1 \/ 1;/, "même case de grille : la bande ne saute pas");
assert.match(css, /\.annonces\.est-multiple \.revelation:not\(\.est-active\)\{\s*opacity:0;\s*visibility:hidden;/);
});
