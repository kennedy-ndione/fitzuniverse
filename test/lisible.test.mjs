/**
* ============================================================
* test/lisible.test.mjs — aucun texte coupé, des textes humains (lot 74)
* ============================================================
*
* Demande du fondateur, 22 septembre 2026 : que les informations des
* bourses et des universités se lisent facilement, « sans coupure de
* texte côté mobile comme PC », et qu'elles ne donnent plus
* l'impression d'avoir été écrites par une machine.
*
* Mesuré avant le lot, en rendu à 375 px et 1 280 px :
*   - 146 descriptions de bourse coupées par un line-clamp à 3 lignes ;
*   - 115 puces « financement » coupées (un paragraphe entier dans une
*     puce, suivi de « financé ») ;
*   - 93 cartes d'université dont le statut recouvrait le classement ;
*   - 46 listes de bourses d'université coupées à 2 lignes ;
*   - 4 prises en charge coupées sur le bandeau d'accueil ;
*   - une puce « Exonération » que le glossaire allongeait jusqu'à la
*     faire sortir de la carte, et un paragraphe d'échéance entier
*     écrasé dans le pied de la carte d'université (captures de Charles).
* Après : zéro, sur les 157 bourses, 155 universités et une fiche par
* bourse.
*
* CE QUE CE LOT NE FAIT PAS, à la demande de Charles (23 septembre) :
* afficher TOUT le contenu partout. Les commandes de l'interface (valeur
* d'un filtre, titre de la barre haute, pastille de formule) gardent leur
* ellipse propre : les étirer pour tout montrer ferait déborder la barre.
* La règle vise les TEXTES DU CATALOGUE sur les cartes : écrits assez
* courts pour tenir, ils ne sont plus jamais tranchés au milieu.
*
* Deux familles de gardes :
*   1. LE CODE : aucune règle ne recoupe un texte de donnée, la puce
*      financement lit la première phrase, la carte d'université lit un
*      état calculé (etatCarteUniversite) et non un statut brut ;
*   2. LES DONNÉES (instantané déployé assets/data/catalogue.json) : les
*      longueurs pour lesquelles les cartes sont dessinées. Un texte
*      saisi plus long dans l'admin fait échouer ce test : c'est voulu,
*      le message dit quel champ raccourcir et pourquoi.
* ============================================================
*/

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { premierePhrase, estFinancementIntegral } from "../js/scholarship-filters.js";
import { etatCarteUniversite } from "../js/echeance.js";
import { HORS_CHAMP } from "../js/glossaire.js";

const RACINE = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8");
const sansCommentairesCss = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");

// Les blocs « sélecteur { déclarations } » d'une feuille, @media compris.
function blocs(css) {
  const out = [];
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  const plat = sansCommentairesCss(css);
  while ((m = re.exec(plat))) out.push({ selecteur: m[1].trim(), corps: m[2] });
  return out;
}

const FEUILLES = ["scholarships.css", "universities.css", "css/catalog.css", "css/opportunites.css", "css/catalog-redesign.css", "css/catalog-typography.css", "scholarship-details.css", "css/details-redesign.css"];

// Les classes qui portent un TEXTE DE DONNÉE (catalogue) ou un libellé
// que l'étudiant doit pouvoir lire en entier.
const PORTEURS = [
  ".scholarship-card-desc",
  ".scholarship-card-chip",
  ".catalog-chip",
  ".uni-card-chip",
  ".uni-card-scholarship",
  ".uni-card-rank",
  ".uni-card-status",
  ".uni-card-deadline",
  ".opportunite-couv",
  "#generalCriteria"
];

test("lisible 1 — aucune règle ne coupe un texte de donnée (line-clamp, ellipse, nowrap)", () => {
  const fautes = [];
  for (const f of FEUILLES) {
    for (const { selecteur, corps } of blocs(lire(f))) {
      const vise = PORTEURS.find((p) => selecteur.split(",").some((s) => s.trim().endsWith(p) || s.trim().endsWith(`${p} > span`)));
      if (!vise) continue;
      if (/line-clamp\s*:\s*\d/.test(corps)) fautes.push(`${f} : « ${selecteur} » a un line-clamp`);
      if (/text-overflow\s*:\s*ellipsis/.test(corps)) fautes.push(`${f} : « ${selecteur} » coupe par une ellipse`);
      if (/white-space\s*:\s*nowrap/.test(corps)) fautes.push(`${f} : « ${selecteur} » interdit le retour à la ligne`);
    }
  }
  assert.deepEqual(fautes, [], "Un texte du catalogue doit s'afficher en entier, sur mobile comme sur ordinateur :\n" + fautes.join("\n"));
});

test("lisible 2 — les badges de la carte d'université partagent une rangée, plus de positions absolues opposées", () => {
  const css = blocs(lire("universities.css"));
  const rangee = css.find((b) => b.selecteur === ".uni-card-badges");
  assert.ok(rangee, "la rangée .uni-card-badges a disparu");
  assert.match(rangee.corps, /flex-wrap\s*:\s*wrap/);
  for (const sel of [".uni-card-rank", ".uni-card-status"]) {
    const b = css.find((x) => x.selecteur === sel);
    assert.ok(b, `${sel} introuvable`);
    assert.ok(!/position\s*:\s*absolute/.test(b.corps), `${sel} repasse en absolu : il recouvrira de nouveau l'autre badge`);
  }
  assert.match(lire("universities-page.js"), /class="uni-card-badges"/);
});

test("lisible 2 bis — le glossaire ne glisse pas d'explication dans une puce ou un badge de carte", () => {
  // « Exonération possible, places limitées » devenait « Exonération (une
  // réduction de ce que vous payez) possible… » et sortait de la carte.
  for (const classe of [".uni-card-chip", ".scholarship-card-chip", ".catalog-chip", ".uni-card-rank", ".uni-card-status", ".scholarship-card-status"]) {
    assert.ok(HORS_CHAMP.split(",").map((s) => s.trim()).includes(classe), `${classe} n'est plus hors champ du glossaire`);
  }
});

test("lisible 3 — la puce financement affiche la première phrase, sans « financé » accolé", () => {
  const src = lire("scholarships.js");
  assert.match(src, /premierePhrase\(scholarship\.funding\)/);
  assert.ok(!/\$\{scholarship\.funding\} financé/.test(src), "le paragraphe entier + « financé » est revenu dans la puce");
});

test("lisible 4 — premierePhrase : la phrase entière, sans point final, jamais coupée au milieu", () => {
  assert.equal(premierePhrase("Bourse complète. Elle couvre le voyage."), "Bourse complète");
  assert.equal(premierePhrase("1 000 € par mois, versés en lei roumains. La bourse comprend aussi…"), "1 000 € par mois, versés en lei roumains");
  assert.equal(premierePhrase("Le montant n'est pas publié."), "Le montant n'est pas publié");
  assert.equal(premierePhrase("7 172,00 €, 4 191,00 € ou 2 891,00 € selon votre lieu de vie. Détail…"), "7 172,00 €, 4 191,00 € ou 2 891,00 € selon votre lieu de vie");
  assert.equal(premierePhrase("Jusqu'à 100 % des frais de scolarité, soit environ 18 500 € par an."), "Jusqu'à 100 % des frais de scolarité, soit environ 18 500 € par an");
  assert.equal(premierePhrase("Une seule phrase sans point"), "Une seule phrase sans point");
  assert.equal(premierePhrase(""), "");
  assert.equal(premierePhrase(undefined), "");
});

test("lisible 5 — carte d'université : l'état est CALCULÉ, un « Fermée » qui parle d'ouverture n'est plus vert", () => {
  const src = lire("universities-page.js");
  assert.ok(!/includes\("ouvert"\)/.test(src), "universities-page.js relit « ouvert » dans un statut brut");
  assert.match(src, /etatCarteUniversite\(/);

  const JOUR = new Date("2026-09-22T12:00:00Z");

  // Le cas qui passait pour ouvert : « Fermée — ouverture annoncée prochainement ».
  const ferme = etatCarteUniversite([{ statut: ["Fermée, prochain appel annoncé bientôt"], echeances: ["Non publiée"] }], JOUR);
  assert.notEqual(ferme.ouvert, true);
  assert.equal(ferme.court, "Fermée");

  // Un programme ouvert l'emporte sur un programme fermé de la même université.
  const mixte = etatCarteUniversite([
    { statut: ["Fermée"], echeances: ["Clôture le 15 mars 2026."] },
    { statut: ["Ouverte"], echeances: ["Candidatures jusqu'au 6 octobre 2026."] }
  ], JOUR);
  assert.equal(mixte.ouvert, true);
  assert.equal(mixte.court, "Ouverte");
  assert.equal(mixte.pied, "Date limite : 6 octobre 2026");

  // Deux programmes ouverts : la date la plus proche passe en tête.
  const deux = etatCarteUniversite([
    { statut: ["Ouverte"], echeances: ["Date limite : 15 janvier 2027."] },
    { statut: ["Ouverte"], echeances: ["Date limite : 30 novembre 2026."] }
  ], JOUR);
  assert.equal(deux.pied, "Date limite : 30 novembre 2026");

  // Un cycle clos daté : la date dite comme telle, jamais « Date limite ».
  const clos = etatCarteUniversite([{ statut: ["Fermée"], echeances: ["Clôture le 15 mars 2026."] }], JOUR);
  assert.equal(clos.court, "Fermée");
  assert.equal(clos.pied, "Dernière échéance connue : 15 mars 2026");

  assert.equal(etatCarteUniversite([], JOUR), null);
});

// ------------------------------------------------------------------
// Les données : l'instantané déployé (node scripts/lot.mjs export).
// ------------------------------------------------------------------

const cat = JSON.parse(lire("assets/data/catalogue.json"));
const S = cat.scholarships;
const P = cat.programs;
const U = cat.universities;

function trop(liste, champ, max, lecture = (t) => t) {
  return liste
    .filter((d) => typeof d[champ] === "string" && lecture(d[champ]).length > max)
    .map((d) => `${d.id}.${champ} : ${lecture(d[champ]).length} caractères (maximum ${max}) « ${lecture(d[champ]).slice(0, 80)}… »`);
}

test("lisible 6 — les textes des cartes tiennent dans la carte", () => {
  const fautes = [
    ...trop(S, "description", 150),
    ...trop(S, "funding", 70, premierePhrase),
    ...trop(S, "status", 55),
    ...trop(S, "periodeOuverture", 130),
    ...trop(P, "coverage", 100),
    ...trop(P, "status", 55),
    ...trop(U, "ranking", 45)
  ];
  assert.deepEqual(fautes, [], "Ces textes s'affichent en entier sur les cartes : raccourcissez-les (le détail va sur la fiche).\n" + fautes.join("\n"));
  const multi = S.filter((s) => /\n/.test(s.description || "")).map((s) => s.id);
  assert.deepEqual(multi, [], "une description de carte tient sur une seule ligne de texte (pas de retour à la ligne)");
});

test("lisible 7 — un statut de programme dit « Ouverte » ou « Fermée » d'abord, et un « Fermée » ne contient pas « ouvert »", () => {
  const fautes = [];
  // Programmes : le premier mot est lu par la recommandation et par la
  // fiche. Bourses : texte plus libre (« Procédure non publiée… »), mais
  // la même règle vaut pour un « Fermée ».
  for (const [d, programme] of [...P.map((p) => [p, true]), ...S.map((s) => [s, false])]) {
    const t = String(d.status || "").trim();
    if (!t) continue;
    if (programme && !/^(Ouverte|Fermée)\b/.test(t)) fautes.push(`${d.id} : « ${t} » ne commence ni par « Ouverte » ni par « Fermée »`);
    if (/^Fermée/.test(t) && /ouvert/i.test(t)) fautes.push(`${d.id} : « ${t} » (un statut fermé qui contient « ouvert » a longtemps été lu comme ouvert : écrire « prochain appel », « rouvre »…)`);
  }
  assert.deepEqual(fautes, [], fautes.join("\n"));
});

test("lisible 8 — pas de ton de machine dans les textes lus par l'étudiant", () => {
  const CHAMPS = [
    [S, ["description", "funding", "generalCriteria", "periodeOuverture", "status", "ageMaxNote"]],
    [P, ["deadline", "description", "coverage", "status"]],
    [U, ["description", "ranking"]]
  ];
  // Mots d'insistance criés en capitales (« NON couverts », « PIÈGE »,
  // « LE DOSSIER SE DÉPOSE… »). Les sigles (DAAD, ISEE, QS…) ne sont
  // pas visés : seuls ces mots français le sont.
  const CRI = /\b(NON|PAS|AUCUNE?|SEULE?S?|UNIQUEMENT|OBLIGATOIRES?|EXCLUSIVEMENT|ATTENTION|PIÈGE|IMPORTANT|JAMAIS|TOUS|TOUTES|AVANT|APRÈS|DOIT|FAUT|DÉJÀ|ENTIÈREMENT|GRATUITE?S?|COMPLÈTE?S?|RÉSERVÉ|GARANTI|LE|LA|LES|DES|DU|ET)\b/;
  // Notes de travail internes, sans sens pour un étudiant.
  const INTERNE = /import initial|relais tiers|à la lecture d|page lue le|lot \d{2}\b/i;
  const fautes = [];
  for (const [liste, champs] of CHAMPS) for (const d of liste) for (const c of champs) {
    const t = String(d[c] || "");
    if (t.includes("—")) fautes.push(`${d.id}.${c} : tiret long « — »`);
    const cri = t.match(CRI);
    if (cri) fautes.push(`${d.id}.${c} : « ${cri[0]} » en capitales`);
    const note = t.match(INTERNE);
    if (note) fautes.push(`${d.id}.${c} : note interne « ${note[0]} »`);
  }
  assert.deepEqual(fautes, [], fautes.join("\n"));
});

test("lisible 9 — le filtre « financement intégral » lit toujours au moins une bourse", () => {
  // Garde-fou de la réécriture : les expressions que lit ce filtre
  // (« 100 % », « scolarité gratuite »…) ont été conservées.
  // 34 bourses au lot 74, exactement comme avant la réécriture.
  assert.ok(S.filter((s) => estFinancementIntegral(s.funding)).length >= 30);
});
