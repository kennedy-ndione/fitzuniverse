/**
 * ============================================================
 * test/espace-recommandation.test.mjs — l'espace PAYANT recommande-t-il
 * au moins aussi bien que le diagnostic GRATUIT ?
 * ============================================================
 *
 * Le défaut mesuré le 2026-09-06 (passe espace étudiant 2/3) était
 * double, et il touchait les seuls étudiants qui paient :
 *
 *  1. LE CYCLE VISÉ. studentTargetLevel() lisait `targetLevel`, qui
 *     n'existe que sur le profil du DIAGNOSTIC. Le profil de l'espace
 *     porte `desiredDegree` (profile.html, « Diplôme recherché ») et
 *     rien ne le lisait : le bonus de cycle allait donc au diplôme DÉJÀ
 *     OBTENU. C'est exactement le bug corrigé côté public le
 *     2026-08-29, resté vivant côté connecté.
 *
 *  2. LA SÉLECTION. Le hub tournait sur `recommendPrograms(...)
 *     .filter(score > 0)` : aucun filtre de cycle, aucun filtre
 *     d'échéance, aucun dédoublonnage. Le diagnostic gratuit, lui,
 *     passe par retenirOpportunites() et ses cinq filtres.
 *
 * Ces tests verrouillent les deux corrections sur des données
 * construites, où l'on sait ce que la réponse doit être.
 * ============================================================
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import { recommendPrograms, retenirOpportunites } from "../js/recommend-programs.js";

const LE_JOUR = new Date("2026-09-06T12:00:00Z");

function catalogue() {

  const universitiesById = new Map([
    ["u1", { firestoreId: "u1", name: "Université Alpha", country: "France", officialWebsite: "https://alpha.fr" }],
    ["u2", { firestoreId: "u2", name: "Université Beta", country: "Allemagne", officialWebsite: "https://beta.de" }],
    ["u3", { firestoreId: "u3", name: "Université Gamma", country: "Canada", officialWebsite: "https://gamma.ca" }]
  ]);

  const scholarshipsById = new Map([
    ["s1", { firestoreId: "s1", id: "s1", title: "Bourse Alpha", status: "Ouverte", isActive: true, funding: "100 % financée" }],
    ["s2", { firestoreId: "s2", id: "s2", title: "Bourse Beta", status: "Ouverte", isActive: true, funding: "100 % financée" }],
    ["s3", { firestoreId: "s3", id: "s3", title: "Bourse Gamma", status: "Ouverte", isActive: true, funding: "100 % financée" }]
  ]);

  const programs = [
    // Même université, deux cycles : c'est le couple qui départage.
    { firestoreId: "p-lic", id: "p-lic", universityId: "u1", scholarshipId: "s1", level: "Licence", status: "Ouverte", deadline: "15 décembre 2026" },
    { firestoreId: "p-mas", id: "p-mas", universityId: "u2", scholarshipId: "s2", level: "Master", status: "Ouverte", deadline: "15 décembre 2026" },
    { firestoreId: "p-doc", id: "p-doc", universityId: "u3", scholarshipId: "s3", level: "Doctorat", status: "Ouverte", deadline: "15 décembre 2026" }
  ];

  return { programs, universitiesById, scholarshipsById };

}

const niveaux = (r) => r.retenues.map((x) => x.scholarshipId);

// ------------------------------------------------------------------
// 1. Le cycle visé : desiredDegree du profil CONNECTÉ
// ------------------------------------------------------------------

test("un profil connecté qui VISE un master ne se voit plus proposer sa licence", () => {

  const c = catalogue();

  // Le cas exact du défaut : diplôme obtenu = Licence, projet = Master.
  const r = retenirOpportunites({
    profile: { desiredDegree: "Master", lastDegree: "Licence" },
    ...c,
    aujourdhui: LE_JOUR
  });

  assert.deepEqual(niveaux(r), ["s2"], "le master, et lui seul — pas la licence déjà obtenue");

});

test("sans desiredDegree, le repli sur le diplôme obtenu reste celui d'avant", () => {

  const c = catalogue();

  const r = retenirOpportunites({ profile: { lastDegree: "Licence" }, ...c, aujourdhui: LE_JOUR });

  assert.deepEqual(niveaux(r), ["s1"], "aucun projet déclaré : on suppose le cycle qu'il a");

});

test("targetLevel garde la priorité sur desiredDegree", () => {

  const c = catalogue();

  // Une réponse de diagnostic est plus récente et plus contextualisée
  // qu'un champ de profil rempli il y a des semaines.
  const r = retenirOpportunites({
    profile: { targetLevel: "Doctorat (PhD)", desiredDegree: "Master", lastDegree: "Licence" },
    ...c,
    aujourdhui: LE_JOUR
  });

  assert.deepEqual(niveaux(r), ["s3"]);

});

test("le bonus de score suit la même règle que le filtre", () => {

  const c = catalogue();

  // scoreProgram() et retenirOpportunites() partagent studentTargetLevel :
  // le score et l'explication ne peuvent pas diverger du filtre.
  const [premier] = recommendPrograms({
    profile: { desiredDegree: "Master", lastDegree: "Licence" },
    programs: c.programs,
    universitiesById: c.universitiesById,
    scholarshipsById: c.scholarshipsById,
    count: 3
  });

  assert.equal(premier.scholarshipId, "s2", "le master doit être en tête du classement aussi");

});

// ------------------------------------------------------------------
// 2. La sélection du hub : jamais un cycle clos
// ------------------------------------------------------------------

test("un cycle clos ne sort JAMAIS des retenues, même bien noté par ailleurs", () => {

  const c = catalogue();

  // La bourse du bon niveau, mais dont l'échéance est derrière nous.
  c.programs.push({
    firestoreId: "p-mas-clos", id: "p-mas-clos", universityId: "u1", scholarshipId: "s-clos",
    level: "Master", status: "Ouverte", deadline: "15 janvier 2026"
  });
  c.scholarshipsById.set("s-clos", { firestoreId: "s-clos", id: "s-clos", title: "Bourse close", status: "Ouverte", isActive: true, funding: "100 % financée" });

  const r = retenirOpportunites({ profile: { desiredDegree: "Master" }, ...c, aujourdhui: LE_JOUR });

  assert.ok(!niveaux(r).includes("s-clos"), `une bourse close est proposée : ${niveaux(r).join(", ")}`);

});

test("une bourse retirée (isActive:false) ne sort pas non plus", () => {

  const c = catalogue();

  c.programs.push({
    firestoreId: "p-mas-off", id: "p-mas-off", universityId: "u1", scholarshipId: "s-off",
    level: "Master", status: "Ouverte", deadline: "15 décembre 2026"
  });
  c.scholarshipsById.set("s-off", { firestoreId: "s-off", id: "s-off", title: "Bourse retirée", status: "Ouverte", isActive: false, funding: "100 % financée" });

  const r = retenirOpportunites({ profile: { desiredDegree: "Master" }, ...c, aujourdhui: LE_JOUR });

  assert.ok(!niveaux(r).includes("s-off"));

});

// ------------------------------------------------------------------
// 3. Le nombre affiché est celui de la SÉLECTION, pas du catalogue
// ------------------------------------------------------------------

test("`nombre` compte les retenues, jamais la taille du catalogue", () => {

  const c = catalogue();

  const r = retenirOpportunites({ profile: { desiredDegree: "Master" }, ...c, aujourdhui: LE_JOUR });

  assert.equal(r.nombre, r.retenues.length);
  assert.ok(r.nombre < c.programs.length, "trois programmes au catalogue, un seul au bon niveau");

});

test("`ouvertes` ne dépasse jamais `nombre` — c'est le M de « dont M ouvertes »", () => {

  const c = catalogue();

  const r = retenirOpportunites({ profile: { desiredDegree: "Master" }, ...c, aujourdhui: LE_JOUR });

  assert.ok(r.ouvertes <= r.nombre);
  assert.equal(r.ouvertes, 1, "l'unique master retenu a une échéance encore à venir");

});

test("un profil vide ne fait pas s'effondrer la sélection", () => {

  const c = catalogue();

  // Sans cycle connu on ne filtre pas : mieux vaut une liste large
  // qu'une page vide.
  const r = retenirOpportunites({ profile: {}, ...c, aujourdhui: LE_JOUR });

  assert.equal(r.nombre, 3);
  assert.equal(r.pays, 3);

});

// ------------------------------------------------------------------
// 4. La différence de traitement entre les deux moteurs, verrouillée
// ------------------------------------------------------------------

test("le sélecteur (recommendPrograms) voit ce que le hub (retenirOpportunites) écarte", () => {

  const c = catalogue();

  c.programs.push({
    firestoreId: "p-clos", id: "p-clos", universityId: "u1", scholarshipId: "s-clos",
    level: "Master", status: "Ouverte", deadline: "15 janvier 2026"
  });
  c.scholarshipsById.set("s-clos", { firestoreId: "s-clos", id: "s-clos", title: "Bourse close", status: "Ouverte", isActive: true, funding: "100 % financée" });

  const cherche = recommendPrograms({
    profile: { desiredDegree: "Master" },
    programs: c.programs,
    universitiesById: c.universitiesById,
    scholarshipsById: c.scholarshipsById,
    count: Infinity
  });

  const propose = retenirOpportunites({ profile: { desiredDegree: "Master" }, ...c, aujourdhui: LE_JOUR });

  // C'est la distinction de la passe 2/3 : l'étudiant a le droit de
  // CHERCHER une bourse close (elle rouvrira) ; Fitz ne la PROPOSE pas.
  assert.ok(cherche.some((x) => x.scholarshipId === "s-clos"), "la recherche doit rester ouverte sur tout le catalogue");
  assert.ok(!niveaux(propose).includes("s-clos"), "la suggestion, elle, ne propose pas une porte fermée");

});

// ------------------------------------------------------------------
// 5. LA FORME DES DOCUMENTS NE DOIT RIEN CHANGER
// ------------------------------------------------------------------
// Le bug le plus coûteux de cette passe, trouvé le 2026-09-06 : les
// appelants ne passent pas les mêmes objets. results.js transmet les
// documents du catalogue tels quels (ils portent `id`) ; dashboard.js
// et applications.js les renomment (`{ firestoreId: id, ...reste }`).
// La clé de dédoublonnage lisait `.id` : elle valait donc `undefined`
// pour tout l'espace connecté, et `boursesVues` écartait TOUT candidat
// après le premier. Le hub annonçait 1 opportunité au lieu de 12.
// Rien ne plantait. Le chiffre était simplement faux.

/** Le renommage que font dashboard.js et applications.js. */
const renommer = ({ id, ...reste }) => ({ firestoreId: id, ...reste });

test("les deux formes de document rendent EXACTEMENT la même sélection", () => {

  const c = catalogue();

  // Le catalogue de ce fichier porte déjà `id` sur les bourses ; on
  // ajoute de quoi distinguer plusieurs bourses au même niveau, sinon
  // le dédoublonnage n'a rien à dédoublonner.
  c.programs.push(
    { firestoreId: "p-m2", id: "p-m2", universityId: "u1", scholarshipId: "s-m2", level: "Master", status: "Ouverte", deadline: "20 décembre 2026" },
    { firestoreId: "p-m3", id: "p-m3", universityId: "u3", scholarshipId: "s-m3", level: "Master", status: "Ouverte", deadline: "25 décembre 2026" }
  );
  c.scholarshipsById.set("s-m2", { firestoreId: "s-m2", id: "s-m2", title: "Bourse M2", status: "Ouverte", isActive: true, funding: "100 % financée" });
  c.scholarshipsById.set("s-m3", { firestoreId: "s-m3", id: "s-m3", title: "Bourse M3", status: "Ouverte", isActive: true, funding: "100 % financée" });

  const profile = { desiredDegree: "Master" };

  const telQuel = retenirOpportunites({ profile, ...c, aujourdhui: LE_JOUR });

  const renomme = retenirOpportunites({
    profile,
    programs: c.programs.map(renommer),
    universitiesById: new Map([...c.universitiesById].map(([k, v]) => [k, renommer(v)])),
    scholarshipsById: new Map([...c.scholarshipsById].map(([k, v]) => [k, renommer(v)])),
    aujourdhui: LE_JOUR
  });

  assert.equal(renomme.nombre, telQuel.nombre, "le renommage ne doit pas effondrer la sélection");
  assert.equal(renomme.nombre, 3, "trois bourses de master distinctes, trois retenues");
  assert.deepEqual(niveaux(renomme), niveaux(telQuel));

});

test("la clé de bourse est renseignée dans les DEUX formes", () => {

  const c = catalogue();
  const profile = { desiredDegree: "Master" };

  const renomme = retenirOpportunites({
    profile,
    programs: c.programs.map(renommer),
    universitiesById: new Map([...c.universitiesById].map(([k, v]) => [k, renommer(v)])),
    scholarshipsById: new Map([...c.scholarshipsById].map(([k, v]) => [k, renommer(v)])),
    aujourdhui: LE_JOUR
  });

  // C'est cette clé qu'applications.js écrit sur la candidature : vide,
  // elle rendait tout le rattrapage de la passe 1 inopérant.
  assert.equal(renomme.retenues[0].scholarshipId, "s2");
  assert.equal(renomme.retenues[0].programId, "p-mas");

});

test("recommendPrograms rend aussi les deux clés, dans les deux formes", () => {

  const c = catalogue();

  for (const [nom, args] of [
    ["tel quel", { programs: c.programs, universitiesById: c.universitiesById, scholarshipsById: c.scholarshipsById }],
    ["renommé", {
      programs: c.programs.map(renommer),
      universitiesById: new Map([...c.universitiesById].map(([k, v]) => [k, renommer(v)])),
      scholarshipsById: new Map([...c.scholarshipsById].map(([k, v]) => [k, renommer(v)]))
    }]
  ]) {

    const [premier] = recommendPrograms({ profile: { desiredDegree: "Master" }, ...args, count: 1 });

    assert.equal(premier.scholarshipId, "s2", `scholarshipId manquant (${nom}) — le sélecteur ne saurait pas de quelle bourse il parle`);
    assert.equal(premier.programId, "p-mas", `programId manquant (${nom})`);

  }

});
