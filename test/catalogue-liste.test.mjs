/**
* ============================================================
* test/catalogue-liste.test.mjs — le catalogue des listes ne change RIEN
* ============================================================
*
* Lot PERF 3G (2026-09-28). Les listes, le moteur de recommandation et
* les diagnostics lisent désormais assets/data/catalogue-liste.json
* (126 Ko compressés) au lieu de assets/data/catalogue.json (262 Ko) ;
* les fiches lisent leur document seul, dans assets/data/fiches/.
* Voir scripts/catalogue-liste.mjs.
*
* La demande de Charles : « le moteur de recommandation et le diagnostic
* doivent donner exactement les mêmes résultats — prouve-le ». D'où :
*
*  1. les dérivés sont À JOUR : ils sont exactement ce que
*     scripts/catalogue-liste.mjs tire de catalogue.json (et donc ce
*     qu'écrit lot.mjs export) ;
*  2. AUCUN module d'une page passée au catalogue des listes ne lit un
*     champ retiré (relevé sur le graphe complet de chaque page, imports
*     dynamiques compris : la coquille de l'espace aussi) ;
*  3. AVANT / APRÈS, sur le vrai catalogue : le moteur
*     (retenirOpportunites, comme results.js et le tableau de bord),
*     l'analyse du questionnaire (EligibilityAI), le diagnostic France
*     (leviersDe), le bandeau de l'accueil, les frais des cartes
*     d'universités, les préinscriptions et la fiche université rendent
*     des résultats IDENTIQUES sur les deux fichiers ;
*  4. le chargeur retombe sur le catalogue complet quand un dérivé manque.
*
* Preuves par mutation (2026-09-28) : "deadline" ajouté à DETAIL.programs,
* dérivés régénérés → tests 2, 3a, 3b, 3e et 3f rouges (le moteur ne lit
* plus les échéances) ; `uni.admission` lu dans js/frais.js → test 2
* rouge ; une fiche retouchée à la main → test 1 rouge.
* ============================================================
*/
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath, pathToFileURL } from "node:url";

import { DETAIL, COLLECTIONS, versionListe, perimes, LISTE, COMPLET, FICHES } from "../scripts/catalogue-liste.mjs";
import { fuitesDePortail } from "../scripts/instantane-portails.mjs";
import { retenirOpportunites } from "../js/recommend-programs.js";
import { EligibilityAI } from "../eligibility-ai.js";
import { calculerDiagnostic } from "../js/diagnostic-france.js";
import { leviersDe } from "../js/diagnostic-conseil.js";
import { selectionnerOpportunites, libelleCarte } from "../js/bandeau-selection.js";
import { lireRevelation, lireAnnonces } from "../js/revelations.js";
import { lireFrais, lireExoneration, libelleFrais, premierNiveauVerifie } from "../js/frais.js";
import { lirePays, etatDunPays } from "../js/pays-preinscription.js";
import { ficheUniversite } from "../js/fiche-universite.js";
import { indexerCatalogue, lierCandidature, etatDeLaCandidature } from "../js/candidature-catalogue.js";
import { PROFILS } from "../scripts/verifier/profils.mjs";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => fs.readFileSync(path.join(RACINE, f), "utf8");

const COMPLET_JSON = JSON.parse(lire(COMPLET));
const LISTE_JSON = JSON.parse(lire(LISTE));

// Les deux formes du catalogue que les pages manipulent.
const formeSite = (c) => ({ programmes: c.programs, universites: c.universities, bourses: c.scholarships });
const formeMoteur = (c) => ({
  programs: c.programs,
  universitiesById: new Map(c.universities.map((u) => [u.id, u])),
  scholarshipsById: new Map(c.scholarships.map((s) => [s.id, s]))
});

// ------------------------------------------------------------------
// « Mêmes résultats » : on compare tels quels. Seule tolérance, écrite
// ici et nulle part ailleurs : une COPIE VERBATIM d'un document du
// catalogue (même id, même valeur) peut porter, côté complet, un champ
// de détail que le côté liste n'a pas. Le test 2 prouve qu'aucune page
// ne le lit ; une valeur CALCULÉE qui différerait ferait échouer.
// ------------------------------------------------------------------
const PAR_ID = new Map();
for (const nom of COLLECTIONS) for (const d of COMPLET_JSON[nom]) PAR_ID.set(d.id, { nom, d });

function sansCopiesDeDetail(valeur) {
  if (Array.isArray(valeur)) return valeur.map(sansCopiesDeDetail);
  if (valeur instanceof Map) return new Map([...valeur].map(([k, v]) => [k, sansCopiesDeDetail(v)]));
  if (valeur instanceof Set) return new Set([...valeur].map(sansCopiesDeDetail));
  if (!valeur || typeof valeur !== "object" || valeur instanceof Date) return valeur;
  const source = PAR_ID.get(valeur.id) || PAR_ID.get(valeur.firestoreId);
  const champs = source ? DETAIL[source.nom] : [];
  const sortie = {};
  for (const [k, v] of Object.entries(valeur)) {
    if (champs.includes(k) && source && JSON.stringify(v) === JSON.stringify(source.d[k])) continue;
    const sous = champs.filter((c) => c.startsWith(`${k}.`)).map((c) => c.slice(k.length + 1));
    if (sous.length && v && typeof v === "object" && !Array.isArray(v)) {
      const copie = { ...v };
      for (const s of sous) if (JSON.stringify(copie[s]) === JSON.stringify(source.d[k] && source.d[k][s])) delete copie[s];
      sortie[k] = sansCopiesDeDetail(copie);
      continue;
    }
    sortie[k] = sansCopiesDeDetail(v);
  }
  return sortie;
}

function memes(complet, liste, message) {
  assert.deepEqual(sansCopiesDeDetail(complet), liste, message);
}

// Des profils variés, dans la forme que results.js et le tableau de bord
// donnent au moteur (buildProfileFromResponses, profil de l'espace).
const PROFILS_MOTEUR = (() => {
  const sortie = [];
  const nationalites = ["Sénégalaise", "Marocaine", "Camerounaise", "Ivoirienne", "Rwandaise", "Française", "Nigériane", "Béninoise"];
  const cycles = ["Licence", "Master", "Doctorat"];
  const destinations = [[], ["France"], ["Canada"], ["Chine"], ["Italie"], ["Allemagne"], ["Maroc"], ["Royaume-Uni"]];
  const langues = [["Français"], ["Anglais"], ["Français", "Anglais"], []];
  const domaines = ["Informatique", "Médecine", "Droit", "Économie", "Génie civil", "Agronomie", ""];
  const ages = ["Moins de 18 ans", "18 - 22 ans", "23 - 26 ans", "27 - 30 ans", "Plus de 30 ans", ""];
  const genres = ["", "femme", "homme"];
  for (let i = 0; i < 20; i++) {
    const nationalite = nationalites[i % nationalites.length];
    sortie.push({
      targetLevel: cycles[i % 3],
      lastDegree: ["Au lycée", "Licence", "Master"][(i + 1) % 3],
      preferredCountries: destinations[(i * 3) % destinations.length],
      languages: langues[i % langues.length],
      niveauxDeLangue: { anglais: i % 2 ? "Bon niveau" : "Débutant", français: "Courant / Langue maternelle" },
      desiredField: domaines[i % domaines.length],
      fundingGoal: i % 4 ? "Une bourse complète" : "",
      nationality: nationalite,
      country: nationalite === "Française" ? "France" : ["Sénégal", "Maroc", "Cameroun", "Côte d'Ivoire", "Rwanda", "France", "Nigeria", "Bénin"][i % 8],
      ageBracket: ages[i % ages.length],
      palier: "",
      diplomaWhen: i % 5 === 0 ? "Cette année" : "",
      gender: genres[i % genres.length],
      experienceProTranche: i % 6 === 0 ? "Plus de 2 ans" : ""
    });
  }
  // Et le profil de l'espace (desiredDegree, sans targetLevel).
  sortie.push({ desiredDegree: "Master", lastDegree: "Licence", nationality: "Sénégalaise", country: "Sénégal", languages: ["Français"] });
  return sortie;
})();

const AUJOURDHUI = new Date();
const DATES = [AUJOURDHUI, new Date("2027-02-15T12:00:00Z")];

// ------------------------------------------------------------------
// 1. Les dérivés sont à jour, et sont bien des dérivés
// ------------------------------------------------------------------

test("catalogue des listes 1 — les dérivés correspondent exactement à catalogue.json", () => {
  assert.deepEqual(perimes(), [], "dérivés périmés : node scripts/catalogue-liste.mjs (ou node scripts/lot.mjs export sur le PC)");
  // Le fichier des listes EST le complet moins DETAIL — rien d'autre.
  assert.deepEqual(LISTE_JSON, JSON.parse(JSON.stringify(versionListe(COMPLET_JSON))));
  for (const nom of COLLECTIONS) {
    assert.equal(LISTE_JSON[nom].length, COMPLET_JSON[nom].length, `${nom} : même nombre de documents`);
    for (const champ of DETAIL[nom]) {
      const [tete, sous] = champ.split(".");
      const restants = LISTE_JSON[nom].filter((d) => (sous ? d[tete] && sous in d[tete] : tete in d));
      assert.equal(restants.length, 0, `${nom}.${champ} devrait être absent du catalogue des listes`);
    }
  }
  // Une fiche par document, complète.
  let n = 0;
  for (const nom of COLLECTIONS) {
    for (const d of COMPLET_JSON[nom]) {
      assert.deepEqual(JSON.parse(lire(`${FICHES}/${nom}/${d.id}.json`)), d);
      n++;
    }
  }
  assert.ok(n > 1000, `${n} fiches`);
  // Rien de ce que le lot S3 a retiré ne revient par les dérivés.
  assert.deepEqual(fuitesDePortail(LISTE_JSON), []);
  // Et le gain est réel (il ne l'est plus si DETAIL se vide un jour).
  const br = (s) => zlib.brotliCompressSync(Buffer.from(s)).length;
  assert.ok(br(lire(LISTE)) < br(lire(COMPLET)) * 0.6, "le catalogue des listes devrait peser moins de 60 % du complet");
});

test("catalogue des listes 1 bis — lot.mjs export écrit les dérivés depuis l'instantané PUBLIC", () => {
  const src = lire("scripts/lot.mjs");
  assert.match(src, /import \{ ecrireDerives, LISTE, FICHES \} from "\.\/catalogue-liste\.mjs";/);
  const iPublic = src.indexOf("const { public: instantanePublic, portails, comptes } = separerPortails(instantane);");
  const iEcrit = src.indexOf("await writeFile(INSTANTANE_PATH, texte, \"utf8\");");
  const iDerives = src.indexOf("const derives = ecrireDerives(instantanePublic);");
  assert.ok(iPublic > -1 && iEcrit > iPublic && iDerives > iEcrit, "les dérivés s'écrivent après catalogue.json, depuis instantanePublic");
});

// ------------------------------------------------------------------
// 2. Aucune page passée au catalogue des listes ne lit un champ retiré
// ------------------------------------------------------------------

const code = (f) => fs.readFileSync(f, "utf8").replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:"'`\\])\/\/.*$/gm, "$1");

function importsDe(f) {
  const s = code(f);
  const sortie = [];
  for (const m of s.matchAll(/(?:import|export)\s+(?:[^"'`;()]*?\s+from\s+)?["']([^"']+)["']/g)) sortie.push(m[1]);
  for (const m of s.matchAll(/import\(\s*["'`]([^"'`$]+)["'`]\s*\)/g)) sortie.push(m[1]);
  for (const m of s.matchAll(/import\(\s*new URL\(\s*["']([^"']+)["']/g)) sortie.push(m[1]);
  return sortie.filter((x) => !/^https?:/.test(x)).map((x) => path.resolve(path.dirname(f), x.split("?")[0])).filter((x) => fs.existsSync(x));
}

/** Tout le JavaScript qu'une page peut exécuter : scripts, modules, imports statiques ET dynamiques. */
function grapheDeLaPage(page) {
  const html = lire(page).replace(/<!--[\s\S]*?-->/g, "");
  const dossier = path.dirname(path.join(RACINE, page));
  const entrees = [];
  for (const m of html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)) if (!/^https?:/.test(m[1])) entrees.push(path.resolve(dossier, m[1].split("?")[0]));
  const enLigne = [...html.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]).join("\n");
  for (const m of enLigne.matchAll(/import\(\s*["']([^"']+)["']\s*\)|from\s+["']([^"']+)["']/g)) entrees.push(path.resolve(dossier, m[1] || m[2]));
  const vus = new Set();
  const file = entrees.filter((e) => fs.existsSync(e));
  while (file.length) {
    const f = file.shift();
    if (vus.has(f)) continue;
    vus.add(f);
    file.push(...importsDe(f));
  }
  return { fichiers: [...vus], enLigne };
}

// Les pages dont un module appelle chargerCatalogueListe /
// chargerUniversitesListe / chargerProgrammesEtUniversitesListe.
const PAGES_LISTE = [
  "index.html", "scholarships.html", "universities.html", "results.html", "espace-bourse.html", "dashboard.html",
  "preinscriptions.html", "preinscription-allemagne.html", "preinscription-canada.html", "preinscription-chine.html",
  "preinscription-france.html", "preinscription-italie.html", "preinscription-malaisie.html", "preinscription-maroc.html",
  "preinscription-roumanie.html", "preinscription-turquie.html", "diagnostic-france.html", "eligibility-questions.html",
  "profile.html", "test-prep.html"
];

// Les noms des champs retirés, sous-champs compris (« note » pour
// fraisScolarite.note). Toute LECTURE de l'un d'eux dans ces pages est
// refusée, sauf les trois ci-dessous, qui portent sur un champ de LISTE
// homonyme — chacune vérifiée à la main le 2026-09-28.
const NOMS = [...new Set(Object.values(DETAIL).flat().map((c) => c.split(".").pop()))];
const PERMISES = new Set([
  "scholarships.js : scholarship.description",        // description d'une BOURSE : reste dans la liste
  "js/eligibility-countries.js : eligibility.note",   // bourses.eligibility.note : reste dans la liste
  "js/exigences.js : d.sourceVerification"            // bourses.piecesDossier.sourceVerification : reste dans la liste
]);
const LECTURE = new RegExp(
  `([A-Za-z_$][\\w$]*(?:\\??\\.[A-Za-z_$][\\w$]*|\\([^()]*\\))*)\\??\\.(${NOMS.join("|")})\\b` +
  `|\\[\\s*["'\`](${NOMS.join("|")})["'\`]\\s*\\]` +
  `|(?:const|let|var)\\s*\\{[^}]*\\b(${NOMS.join("|")})\\b[^}]*\\}\\s*=`, "g");

test("catalogue des listes 2 — aucune page passée à la liste ne lit un champ de fiche", () => {
  assert.ok(NOMS.includes("admission") && NOMS.includes("note") && NOMS.includes("description"));
  const lectures = [];
  for (const page of PAGES_LISTE) {
    const { fichiers, enLigne } = grapheDeLaPage(page);
    const sources = fichiers.map((f) => [path.relative(RACINE, f).split(path.sep).join("/"), code(f)]).concat([[`${page} (en ligne)`, enLigne]]);
    for (const [nom, texte] of sources) {
      for (const m of texte.matchAll(LECTURE)) {
        const cle = `${nom} : ${m[0].replace(/\s+/g, " ")}`;
        if (!PERMISES.has(cle)) lectures.push(`${page} → ${cle}`);
      }
    }
  }
  assert.deepEqual([...new Set(lectures)], [], "une page qui lit le catalogue des listes lit un champ de fiche : le garder dans la liste (retirer de DETAIL) ou passer par documentDuCatalogue()");
  // Le relevé voit bien le code : les trois lectures permises existent.
  const tout = PAGES_LISTE.flatMap((p) => grapheDeLaPage(p).fichiers.map((f) => `${path.relative(RACINE, f).split(path.sep).join("/")}\n${code(f)}`)).join("\n");
  assert.match(tout, /scholarship\.description/);
  assert.match(tout, /eligibility\.note/);
});

test("catalogue des listes 2 bis — qui lit quoi : les listes sur la liste, les fiches sur leur document", () => {
  const importe = (f, fn) => new RegExp(`import \\{[^}]*\\b${fn}\\b[^}]*\\} from "[./]*(?:js/)?catalog-data\\.js"`).test(lire(f));
  for (const f of ["scholarships.js", "universities-page.js", "results.js", "dashboard.js", "js/homepage-teaser.js", "js/opportunites-bandeau.js", "js/preinscriptions-page.js", "js/preinscription-destination.js", "js/diagnostic-france-page.js", "universite-page.js"]) {
    assert.ok(importe(f, "chargerCatalogueListe"), `${f} lit le catalogue des listes`);
  }
  assert.ok(importe("eligibility-questions.js", "chargerUniversitesListe"));
  assert.ok(importe("profile.js", "chargerUniversitesListe"));
  assert.ok(importe("test-prep.js", "chargerProgrammesEtUniversitesListe"));
  // Ceux qui lisent un champ de fiche restent sur le complet.
  assert.ok(importe("applications.js", "chargerCatalogue") && !importe("applications.js", "chargerCatalogueListe"), "applications.js lit generalCriteria : catalogue complet");
  assert.ok(importe("espace-preinscription.js", "chargerUniversites") && !importe("espace-preinscription.js", "chargerUniversitesListe"), "espace-preinscription.js lit admission : catalogue complet");
  // Un hub précharge ce qu'il lit.
  assert.match(code(path.join(RACINE, "dashboard.js")), /import \{ prechargerCatalogueListe, chargerCatalogueListe \} from "\.\/js\/catalog-data\.js";\s*prechargerCatalogueListe\(\);/);
});

// ------------------------------------------------------------------
// 3. AVANT / APRÈS : mêmes résultats sur le vrai catalogue
// ------------------------------------------------------------------

test("catalogue des listes 3a — le moteur de recommandation (results.js) : mêmes opportunités retenues", () => {
  const C = formeMoteur(COMPLET_JSON);
  const L = formeMoteur(LISTE_JSON);
  let retenues = 0;
  for (const aujourdhui of DATES) {
    for (const profile of PROFILS_MOTEUR) {
      const complet = retenirOpportunites({ profile, ...C, aujourdhui });
      const liste = retenirOpportunites({ profile, ...L, aujourdhui });
      memes(complet, liste, `profil ${JSON.stringify(profile).slice(0, 120)} au ${aujourdhui.toISOString().slice(0, 10)}`);
      retenues += liste.retenues.length;
    }
  }
  assert.ok(retenues > 100, `${retenues} opportunités comparées : le jeu de profils ne retient presque rien`);
});

test("catalogue des listes 3b — le tableau de bord (dashboard.js) : même sélection, même index des candidatures", () => {
  // La forme exacte du hub : documents renommés (firestoreId), universités
  // déjà suivies écartées, et l'index qui relie les candidatures au catalogue.
  const renommer = ({ id, ...reste }) => ({ firestoreId: id, ...reste });
  const forme = (c) => ({
    programs: c.programs.map(renommer),
    universitiesById: new Map(c.universities.map((u) => [u.id, renommer(u)])),
    scholarshipsById: new Map(c.scholarships.map((s) => [s.id, renommer(s)]))
  });
  const C = forme(COMPLET_JSON);
  const L = forme(LISTE_JSON);
  const suivies = new Set(COMPLET_JSON.universities.slice(0, 5).map((u) => u.id));
  for (const profile of PROFILS_MOTEUR.slice(0, 6)) {
    memes(
      retenirOpportunites({ profile, ...C, exclureUniversites: suivies, aujourdhui: AUJOURDHUI }),
      retenirOpportunites({ profile, ...L, exclureUniversites: suivies, aujourdhui: AUJOURDHUI })
    );
  }
  const indexC = indexerCatalogue(formeSite(COMPLET_JSON));
  const indexL = indexerCatalogue(formeSite(LISTE_JSON));
  const candidatures = COMPLET_JSON.programs.slice(0, 120).map((p, i) => (i % 3 === 0
    ? { scholarshipId: p.scholarshipId, programId: p.id }
    : { universityId: p.universityId, scholarship: (COMPLET_JSON.scholarships.find((s) => s.id === p.scholarshipId) || {}).title || "" }));
  for (const app of candidatures) {
    memes(lierCandidature(app, indexC), lierCandidature(app, indexL));
    memes(etatDeLaCandidature(app, indexC, AUJOURDHUI), etatDeLaCandidature(app, indexL, AUJOURDHUI));
  }
});

test("catalogue des listes 3c — l'analyse du questionnaire (EligibilityAI, results.html) : même verdict", () => {
  for (const profil of PROFILS) {
    for (const variante of [{}, { destinationCountry: "Canada" }, { nationality: "Marocaine", country: "Maroc" }]) {
      const reponses = { ...profil.reponses, ...variante };
      memes(new EligibilityAI(reponses).analyze(COMPLET_JSON.scholarships), new EligibilityAI(reponses).analyze(LISTE_JSON.scholarships), profil.cle);
      memes(new EligibilityAI(reponses).matchReasons(), new EligibilityAI(reponses).matchReasons());
    }
  }
});

test("catalogue des listes 3d — le diagnostic France (leviersDe) : mêmes leviers", () => {
  const entrees = [
    { paysResidence: "Sénégal", niveau: "licence", ressourcesMensuelles: 900, devise: "EUR" },
    { paysResidence: "Côte d'Ivoire", niveau: "master", ressourcesMensuelles: 400, devise: "EUR" },
    { paysResidence: "Maroc", niveau: "master", ressourcesMensuelles: 1500, devise: "EUR" },
    { paysResidence: "Cameroun", niveau: "licence", ressourcesMensuelles: 0, devise: "EUR" }
  ];
  const cat = (c) => ({ programs: c.programs, universities: c.universities, scholarships: c.scholarships });
  let leviers = 0;
  for (const e of entrees) {
    for (const profile of [null, PROFILS_MOTEUR[4]]) {
      const resultat = calculerDiagnostic(e);
      const complet = leviersDe(resultat, { catalogue: cat(COMPLET_JSON), profile, aujourdhui: AUJOURDHUI });
      const liste = leviersDe(resultat, { catalogue: cat(LISTE_JSON), profile, aujourdhui: AUJOURDHUI });
      memes(complet, liste, JSON.stringify(e));
      leviers += liste.length;
    }
  }
  assert.ok(leviers > 10);
});

test("catalogue des listes 3e — l'accueil, les cartes d'universités, les préinscriptions : même affichage", () => {
  // Bandeau « Ouvert en ce moment » et révélations (index.html).
  for (const aujourdhui of DATES) {
    // La forme de js/opportunites-bandeau.js (lireCatalogue) : bourses et universités en Map.
    const parId = (liste) => new Map(liste.map((d) => [d.id, d]));
    const c = selectionnerOpportunites(COMPLET_JSON.programs, parId(COMPLET_JSON.scholarships), parId(COMPLET_JSON.universities), aujourdhui);
    const l = selectionnerOpportunites(LISTE_JSON.programs, parId(LISTE_JSON.scholarships), parId(LISTE_JSON.universities), aujourdhui);
    assert.ok(l.retenues.length > 0 || aujourdhui !== AUJOURDHUI, "le bandeau d'aujourd'hui devrait avoir des cartes");
    memes(c, l);
    memes(c.retenues.map((o) => libelleCarte(o, aujourdhui)), l.retenues.map((o) => libelleCarte(o, aujourdhui)));
    memes(lireRevelation(COMPLET_JSON.universities, aujourdhui), lireRevelation(LISTE_JSON.universities, aujourdhui));
    memes(lireAnnonces(COMPLET_JSON.universities, aujourdhui), lireAnnonces(LISTE_JSON.universities, aujourdhui));
  }
  // Frais et exonération des cartes d'universités (universities.html),
  // université par université et niveau par niveau.
  const listeParId = new Map(LISTE_JSON.universities.map((u) => [u.id, u]));
  for (const u of COMPLET_JSON.universities) {
    const l = listeParId.get(u.id);
    for (const niveau of ["licence", "master", "doctorat", ""]) {
      memes(lireFrais(u, niveau, { aujourdhui: AUJOURDHUI }), lireFrais(l, niveau, { aujourdhui: AUJOURDHUI }), u.id);
      memes(libelleFrais(u, niveau, { aujourdhui: AUJOURDHUI }), libelleFrais(l, niveau, { aujourdhui: AUJOURDHUI }), u.id);
    }
    memes(lireExoneration(u), lireExoneration(l), u.id);
    memes(premierNiveauVerifie(u, ["licence", "master", "doctorat"], { aujourdhui: AUJOURDHUI }), premierNiveauVerifie(l, ["licence", "master", "doctorat"], { aujourdhui: AUJOURDHUI }), u.id);
  }
  // L'état de chaque destination de préinscription.
  for (const pays of lirePays()) {
    memes(etatDunPays(pays, COMPLET_JSON, { aujourdhui: AUJOURDHUI }), etatDunPays(pays, LISTE_JSON, { aujourdhui: AUJOURDHUI }), pays.nom);
  }
});

test("catalogue des listes 3f — la fiche université : son document complet + la liste = la fiche d'avant", () => {
  let fiches = 0;
  for (const u of COMPLET_JSON.universities) {
    const avant = ficheUniversite({ universite: u, programmes: COMPLET_JSON.programs, bourses: COMPLET_JSON.scholarships, aujourdhui: AUJOURDHUI });
    const fiche = JSON.parse(lire(`${FICHES}/universities/${u.id}.json`));
    const apres = ficheUniversite({ universite: fiche, programmes: LISTE_JSON.programs, bourses: LISTE_JSON.scholarships, aujourdhui: AUJOURDHUI });
    assert.deepEqual(apres, avant, u.id);
    if (avant) fiches++;
  }
  assert.ok(fiches > 200, `${fiches} fiches comparées`);
});

// ------------------------------------------------------------------
// 4. Le chargeur du site : la liste, la fiche, et le repli sur le complet
// ------------------------------------------------------------------

async function chargeurAvec(absents, tag) {
  const demandes = [];
  globalThis.fetch = async (url) => {
    // fileURLToPath : sous Windows, pathname vaut « /C:/… » et ne désigne
    // aucun fichier ; le chargeur retombait alors sur Firestore (import https).
    const adresse = new URL(url);
    const chemin = adresse.protocol === "file:" ? fileURLToPath(adresse) : decodeURIComponent(adresse.pathname);
    const relatif = path.relative(RACINE, chemin).split(path.sep).join("/");
    demandes.push(relatif);
    if (absents.some((a) => relatif.startsWith(a)) || !fs.existsSync(chemin)) return { ok: false, status: 404, json: async () => null };
    return { ok: true, status: 200, json: async () => JSON.parse(fs.readFileSync(chemin, "utf8")) };
  };
  globalThis.window = { location: { hostname: "fitzuniverse.com" } };
  const module = await import(`${pathToFileURL(path.join(RACINE, "js/catalog-data.js")).href}?${tag}`);
  return { module, demandes };
}

test("catalogue des listes 4 — le chargeur sert la liste, la fiche seule, et retombe sur le complet", async () => {
  const fetchOrigine = globalThis.fetch;
  const windowOrigine = globalThis.window;
  try {
    // Cas normal : la liste, puis une fiche — jamais catalogue.json.
    const a = await chargeurAvec([], "normal");
    const cat = await a.module.chargerCatalogueListe();
    assert.equal(cat.programmes.length, LISTE_JSON.programs.length);
    assert.ok(!("sourceVerification" in cat.programmes[0]) && !("admission" in cat.universites[0]));
    const u = COMPLET_JSON.universities.find((x) => x.admission);
    assert.deepEqual(await a.module.documentDuCatalogue("universities", u.id), u, "la fiche rend le document COMPLET");
    assert.deepEqual(await a.module.chargerUniversitesListe(), LISTE_JSON.universities);
    assert.ok(!a.demandes.includes(COMPLET), `catalogue.json ne doit pas être téléchargé : ${a.demandes.join(", ")}`);
    assert.deepEqual(a.demandes, [LISTE, `${FICHES}/universities/${u.id}.json`]);

    // Pas de fichier des listes (export antérieur) : le complet, mêmes documents.
    const b = await chargeurAvec([LISTE], "sans-liste");
    const catB = await b.module.chargerCatalogueListe();
    assert.deepEqual(catB.programmes, COMPLET_JSON.programs);

    // Pas de fiches : documentDuCatalogue relit le complet, comme avant.
    const c = await chargeurAvec([FICHES], "sans-fiches");
    assert.deepEqual(await c.module.documentDuCatalogue("scholarships", COMPLET_JSON.scholarships[0].id), COMPLET_JSON.scholarships[0]);
    assert.equal(await c.module.documentDuCatalogue("programs", "n-existe-pas"), null, "absent = null, comme avant");
    assert.ok(c.demandes.includes(COMPLET));

    // Les fonctions sans « Liste » rendent toujours le complet.
    const d = await chargeurAvec([], "complet");
    const complet = await d.module.chargerCatalogue();
    assert.deepEqual(complet.universites, COMPLET_JSON.universities);
  } finally {
    globalThis.fetch = fetchOrigine;
    globalThis.window = windowOrigine;
  }
});
