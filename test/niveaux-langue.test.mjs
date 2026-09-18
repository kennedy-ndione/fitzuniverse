/**
 * ============================================================
 * Lot R16 (2026-09-18) — DIRE SON NIVEAU DE LANGUE SANS LE CECRL
 * ============================================================
 *
 * Charles, le 2026-09-18 : « la plupart des étudiants ou ressortissants
 * africains ne maîtrisent pas les C1 ou A1 ou B2, et moi-même je ne le
 * maîtrise pas, donc je ne sais même pas quoi cocher, et c'est un
 * problème ; donc il faudra adapter cela à l'africaine ».
 *
 * La page posait trente cases nommées A1 A2 B1 B2 C1 C2, sans une
 * phrase pour dire ce qu'elles veulent dire. Elle pose désormais quatre
 * phrases, et js/niveaux-langue.js les traduit en codes — parce que la
 * BASE, elle, doit continuer de parler l'échelle que les universités et
 * les portails demandent (décision de Charles le même jour : « garder
 * le code CECRL en base »).
 *
 * CE QUE CE FICHIER GARDE, et qu'une prochaine passe pourrait défaire
 * sans le voir :
 *
 *  1. LA TRADUCTION EST TOTALE ET SANS RECOUVREMENT : chacun des six
 *     codes coche une phrase, et une seule ;
 *  2. LE SEUIL EST À B2 — « je pourrais étudier dans cette langue »
 *     commence à B2, le niveau que les universités françaises exigent.
 *     Déplacer cette frontière déplace ce qu'on annonce à l'étudiant ;
 *  3. UN NIVEAU DÉJÀ ENREGISTRÉ N'EST JAMAIS DÉGRADÉ : un C1 qui coche
 *     « je suis à l'aise » reste un C1 ;
 *  4. « JE NE PARLE PAS CETTE LANGUE » N'EST JAMAIS UNE LANGUE PARLÉE,
 *     et les QUATRE lecteurs de `languages` du dépôt le savent. C'est
 *     le test qui compte : la valeur « aucun » est neuve, et un
 *     cinquième lecteur écrit sans elle compterait l'anglais parmi les
 *     langues d'un étudiant qui vient de répondre qu'il ne le parle pas ;
 *  5. CHAQUE PHRASE PORTE SON EXEMPLE (règle du lot R3 : « chaque case
 *     doit guider l'étudiant ou lui donner un exemple ») ;
 *  6. LA PAGE NE DEMANDE PLUS DE COCHER UN CODE, et n'ouvre plus de
 *     fenêtre alert() pour dire qu'un nom de langue manque.
 *
 * Preuves par mutation faites le 2026-09-18 :
 *   codes:["B1","B2"] pour « quotidien » → tests 1 et 2 rouges ;
 *   `return niveau.code` sans la garde de codeDepuisNiveau → test 3 rouge ;
 *   le filtre `langueParlee` retiré de languesLisibles → test 4 rouge ;
 *   l'exemple de « Quelques mots » vidé → test 5 rouge ;
 *   `.cecrl-picker` remis dans profile.html → test 6 rouge.
 *
 * Les fichiers sont lus en texte (`codeSeul`) sans leurs commentaires :
 * js/niveaux-langue.js raconte le défaut qu'il répare et cite donc les
 * tournures interdites. Fins de ligne : tout fichier lu ici passe par
 * .replace(/\r\n/g,"\n").
 * ============================================================
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import {
  NIVEAUX_LANGUE, NIVEAU_AUCUN, CODES_CECRL, MENTION_ECHELLE,
  normaliserCode, niveauDepuisCode, codeDepuisNiveau, langueParlee, languesParlees
} from "../js/niveaux-langue.js";

import { languesLisibles } from "../js/profil-par-niveau.js";
import { PROFILE_SECTION_RULES } from "../js/profile-score.js";
import { profilPretPourFitz } from "../js/fitz-choisit.js";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");
const codeSeul = (f) => lire(f)
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/^\s*\/\/.*$/gm, "")
  .replace(/<!--[\s\S]*?-->/g, "");

// ------------------------------------------------------------------

test("niveaux 1 — chacun des six codes coche une phrase, et une seule", () => {

  for (const code of CODES_CECRL) {
    const groupes = NIVEAUX_LANGUE.filter((n) => n.codes.includes(code));
    assert.equal(groupes.length, 1, `${code} est proposé par ${groupes.length} phrases au lieu d'une`);
    assert.equal(niveauDepuisCode(code), groupes[0].cle);
  }

  // « aucun » a sa phrase, et elle n'en contient aucun autre.
  const sansLangue = NIVEAUX_LANGUE.filter((n) => n.codes.includes(NIVEAU_AUCUN));
  assert.equal(sansLangue.length, 1);
  assert.deepEqual(sansLangue[0].codes, [NIVEAU_AUCUN]);

  // Rien d'autre que les six codes et « aucun » ne circule.
  const declares = NIVEAUX_LANGUE.flatMap((n) => n.codes);
  assert.deepEqual([...declares].sort(), [...CODES_CECRL, NIVEAU_AUCUN].sort());

  // Ne pas avoir répondu n'est pas une phrase à cocher : cocher « je ne
  // parle pas cette langue » par défaut ferait dire à l'étudiant ce
  // qu'il n'a pas dit.
  assert.equal(niveauDepuisCode(""), null);
  assert.equal(niveauDepuisCode(undefined), null);
  assert.equal(niveauDepuisCode("bilingue"), null);

});

test("niveaux 2 — le seuil des études est à B2, pas ailleurs", () => {

  // B2 est le niveau que les universités françaises exigent pour suivre
  // un cursus : c'est là que commence « je pourrais étudier dans cette
  // langue », et B1 reste du côté de la vie de tous les jours.
  assert.equal(niveauDepuisCode("B1"), "quotidien");
  assert.equal(niveauDepuisCode("B2"), "etudes");
  assert.equal(niveauDepuisCode("C1"), "etudes");
  assert.equal(niveauDepuisCode("C2"), "etudes");
  assert.equal(niveauDepuisCode("A1"), "mots");
  assert.equal(niveauDepuisCode("A2"), "mots");

  // Le code écrit quand la base était vide, phrase par phrase.
  assert.equal(codeDepuisNiveau("aucun", ""), NIVEAU_AUCUN);
  assert.equal(codeDepuisNiveau("mots", ""), "A1");
  assert.equal(codeDepuisNiveau("quotidien", ""), "B1");
  assert.equal(codeDepuisNiveau("etudes", ""), "B2");

});

test("niveaux 3 — un niveau déjà enregistré n'est jamais dégradé", () => {

  // Le cas qui compte : un étudiant certifié C1 rouvre la page, voit
  // « Je suis à l'aise » cochée, enregistre sans y toucher. Son C1 doit
  // rester un C1 — le réécrire en B2 lui retirerait un niveau qu'il a.
  assert.equal(codeDepuisNiveau("etudes", "C1"), "C1");
  assert.equal(codeDepuisNiveau("etudes", "C2"), "C2");
  assert.equal(codeDepuisNiveau("mots", "A2"), "A2");
  assert.equal(codeDepuisNiveau("etudes", "c1"), "C1");

  // Changer de phrase change bien le code.
  assert.equal(codeDepuisNiveau("quotidien", "C1"), "B1");
  assert.equal(codeDepuisNiveau("aucun", "B2"), NIVEAU_AUCUN);
  assert.equal(codeDepuisNiveau("etudes", NIVEAU_AUCUN), "B2");

  // Une phrase inconnue n'écrit rien plutôt que d'écrire n'importe quoi.
  assert.equal(codeDepuisNiveau("courant", "B2"), "");

  assert.equal(normaliserCode(" b2 "), "B2");
  assert.equal(normaliserCode("AUCUN"), NIVEAU_AUCUN);
  assert.equal(normaliserCode("D1"), "");

});

test("niveaux 4 — « je ne parle pas cette langue » n'est une langue parlée pour AUCUN des quatre lecteurs", () => {

  const profil = { languages: [{ code: "en", level: NIVEAU_AUCUN }] };

  // (a) ce que Fitz lit — js/profil-par-niveau.js
  assert.deepEqual(languesLisibles(profil.languages), []);
  assert.deepEqual(languesLisibles([{ code: "fr", level: "B2" }, { code: "en", level: NIVEAU_AUCUN }]), ["Français B2"]);

  // (b) la section « Langues » du score — js/profile-score.js.
  // L'index 3 est celui de « Langues » dans SECTIONS ; le garde-fou de
  // profile-score.js interdit que les deux listes se désalignent.
  const regleLangues = PROFILE_SECTION_RULES[3];
  assert.equal(regleLangues(profil), false);
  assert.equal(regleLangues({ languages: [{ code: "fr", level: "B1" }] }), true);
  assert.equal(regleLangues({ languages: [{ code: "fr", level: "" }] }), true, "reprise du diagnostic : langue pratiquée, niveau à préciser");

  // (c) « au moins une langue » avant que Fitz choisisse — js/fitz-choisit.js
  const base = { nationality: "Sénégalaise", desiredDegree: "Master", desiredField: "Informatique" };
  assert.equal(profilPretPourFitz({ ...base, languages: [{ code: "en", level: NIVEAU_AUCUN }] }).pret, false);
  assert.ok(profilPretPourFitz({ ...base, languages: [{ code: "en", level: NIVEAU_AUCUN }] }).manquants.includes("au moins une langue"));
  assert.equal(profilPretPourFitz({ ...base, languages: [{ code: "fr", level: "B2" }] }).pret, true);

  // (d) l'alias hérité englishLevel — profile.js ne lit plus `.level` nu.
  const page = codeSeul("profile.js");
  assert.ok(/englishLevel\s*=/.test(page), "profile.js doit toujours écrire englishLevel");
  assert.ok(
    !/englishLevel = \(updated\.languages\.find\(\(l\) => l\.code === "en"\) \|\| \{\}\)\.level/.test(page),
    "englishLevel lit le niveau sans écarter « aucun » : « je ne parle pas l'anglais » deviendrait un niveau d'anglais"
  );
  assert.ok(/niveauDepuisCode\(anglais\.level\)/.test(page), "englishLevel doit passer par js/niveaux-langue.js");

  // Et les fonctions elles-mêmes, sur les quatre formes qui cohabitent
  // en base depuis l'origine.
  assert.equal(langueParlee({ code: "en", level: NIVEAU_AUCUN }), false);
  assert.equal(langueParlee({ code: "en", level: "" }), true);
  assert.equal(langueParlee({ code: "en", level: "B2" }), true);
  assert.equal(langueParlee("français"), true, "ancien profil : une chaîne");
  assert.equal(langueParlee({ code: "autre", name: "", level: "B2" }), false);
  assert.equal(langueParlee(null), false);
  assert.deepEqual(languesParlees(null), []);

  // Les quatre lecteurs passent tous par le module : une cinquième
  // lecture écrite sans lui est exactement ce qu'on ne veut pas.
  for (const fichier of ["js/profil-par-niveau.js", "js/profile-score.js", "js/fitz-choisit.js", "profile.js"]) {
    assert.ok(
      /from "\.?\.?\/?(js\/)?niveaux-langue\.js"/.test(codeSeul(fichier)),
      `${fichier} lit languages sans importer js/niveaux-langue.js`
    );
  }

});

test("niveaux 5 — chaque phrase porte son exemple, et l'échelle réelle est dite une fois", () => {

  assert.equal(NIVEAUX_LANGUE.length, 4, "quatre phrases : au-delà, on refait une échelle de spécialiste");

  for (const niveau of NIVEAUX_LANGUE) {
    assert.ok(niveau.titre && niveau.titre.trim().length > 10, `phrase « ${niveau.cle} » sans titre lisible`);
    assert.ok(niveau.exemple && niveau.exemple.trim().length > 10, `phrase « ${niveau.cle} » sans exemple : c'est l'exemple qui la rend compréhensible`);
    assert.ok(!/\b[ABC][12]\b/.test(`${niveau.titre} ${niveau.exemple}`), `la phrase « ${niveau.cle} » affiche un code CECRL — c'est précisément ce qu'on retire de l'écran`);
  }

  // L'étudiant n'a pas à choisir un code, mais il a le droit de savoir
  // lequel on enregistre — le lui cacher le mettrait en difficulté le
  // jour où un portail le lui demandera.
  assert.ok(/A1 à C2/.test(MENTION_ECHELLE));
  assert.ok(/id="langueEchelle"/.test(lire("profile.html")), "la mention de l'échelle n'a plus d'endroit où s'afficher");

});

test("niveaux 6 — la page ne demande plus de cocher un code, et n'ouvre plus d'alert() pour une langue", () => {

  const html = codeSeul("profile.html");

  assert.ok(!/cecrl-picker/.test(html), "profile.html propose encore des boutons A1…C2 à cocher");
  assert.ok(!/data-level="[ABC][12]"/.test(html), "profile.html propose encore des boutons A1…C2 à cocher");

  const js = codeSeul("profile.js");
  assert.ok(!/cecrl-picker/.test(js), "profile.js construit encore un sélecteur de codes");
  assert.ok(!/CECRL_LEVELS/.test(js), "profile.js garde sa propre liste de codes au lieu de js/niveaux-langue.js");

  // Le champ « une autre langue » ouvrait une fenêtre alert() du
  // navigateur, qui bloque la page et ne dit pas quel champ est en
  // cause. Les trois alert() qui restent dans profile.js sont ceux de
  // l'enregistrement (réseau, palier manquant) : aucun ne parle de langue.
  for (const appel of js.match(/alert\([^)]*\)/g) || []) {
    assert.ok(!/langue/i.test(appel), `une fenêtre alert() parle encore de langue : ${appel}`);
  }

  // Le message d'erreur a bien un endroit où s'afficher, sous le champ.
  assert.ok(/id="otherLanguageError"/.test(lire("profile.html")));
  assert.ok(/id="languageAdders"/.test(lire("profile.html")), "les pastilles « + Espagnol » n'ont plus d'endroit où se poser");

});
