/**
 * ============================================================
 * FitzUniverse — DIRE SON NIVEAU DE LANGUE SANS CONNAÎTRE LE CECRL
 * (lot R16, 2026-09-18)
 * ============================================================
 *
 * LE DÉFAUT QUE CE MODULE RÉPARE, dans les mots de Charles le
 * 2026-09-18 : « la plupart des étudiants ou ressortissants africains
 * ne maîtrisent pas les C1 ou A1 ou B2, et moi-même je ne le maîtrise
 * pas, donc je ne sais même pas quoi cocher, et c'est un problème ».
 *
 * La page « Mon profil » affichait cinq lignes de six boutons — trente
 * cases nommées A1 A2 B1 B2 C1 C2, sans une phrase pour dire ce
 * qu'elles veulent dire. Le CECRL est une échelle de spécialiste : elle
 * a sa place dans un dossier, pas dans la première question qu'on pose
 * à un nouveau bachelier.
 *
 * ------------------------------------------------------------------
 * CE QUI CHANGE, ET CE QUI NE CHANGE PAS
 *
 * L'ÉTUDIANT choisit parmi QUATRE phrases, avec un exemple pour chacune.
 * LA BASE garde le code CECRL — décision de Charles, le 2026-09-18 :
 * « Garder le code CECRL en base ». C'est la bonne : les universités,
 * les portails et les bourses parlent cette langue-là, et une base qui
 * parlerait « je me débrouille » obligerait chaque lecteur à retraduire.
 *
 * LA TRADUCTION NE DÉGRADE JAMAIS CE QUI EXISTE. Un étudiant qui a
 * « C1 » en base et qui rouvre la page voit « Je suis à l'aise »
 * cochée ; s'il enregistre sans y toucher, il garde son C1 — on ne le
 * réécrit pas en B2. C'est `codeDepuisNiveau(cle, codeActuel)` : le
 * code actuel est gardé dès qu'il appartient déjà au groupe choisi.
 *
 * ------------------------------------------------------------------
 * LA CINQUIÈME VALEUR : « aucun »
 *
 * Trois états cohabitaient déjà en base et voulaient dire trois choses
 * différentes :
 *
 *   langue absente de la liste  → on ne sait pas ;
 *   { code, level: "" }         → langue pratiquée, niveau non précisé
 *                                 (js/diagnostic-vers-profil.js ne
 *                                 devine pas un CECRL) ;
 *   { code, level: "B2" }       → niveau déclaré.
 *
 * Il en manquait un quatrième, et c'est celui que « Je ne parle pas
 * cette langue » produit : L'ÉTUDIANT A RÉPONDU, ET SA RÉPONSE EST NON.
 * Sans lui, cocher « je ne parle pas l'anglais » ne laissait aucune
 * trace : la case revenait vide à la visite suivante, et il fallait
 * répondre à nouveau, chaque fois. C'est exactement le genre de détail
 * qui use un formulaire.
 *
 * `level: "aucun"` porte donc cette réponse. Ce n'est pas un code du
 * CECRL — le CECRL n'a pas de mot pour « pas du tout » — et il ne doit
 * JAMAIS être lu comme une langue pratiquée. Quatre lecteurs le savent,
 * et ce sont les quatre seuls endroits du dépôt qui lisent `languages` :
 *
 *   js/profil-par-niveau.js   languesLisibles()   — ce que Fitz lit ;
 *   js/profile-score.js       règle de la section « Langues » ;
 *   js/fitz-choisit.js        « au moins une langue » ;
 *   profile.js                englishLevel.
 *
 * Tous les quatre passent par `languesParlees()` ou `langueParlee()`
 * ci-dessous. Une cinquième lecture qui s'écrirait un jour sans eux
 * compterait « je ne parle pas l'anglais » comme une langue parlée :
 * c'est ce que garde test/niveaux-langue.test.mjs.
 *
 * Pur : aucune dépendance, aucune écriture, aucun accès réseau.
 * ============================================================
 */

/** La réponse « je ne parle pas cette langue ». Voir l'en-tête. */
export const NIVEAU_AUCUN = "aucun";

/** L'échelle européenne, telle qu'elle reste écrite en base. */
export const CODES_CECRL = ["A1", "A2", "B1", "B2", "C1", "C2"];

/**
 * Les quatre phrases proposées à l'étudiant, dans l'ordre d'affichage.
 *
 *   cle     — l'identifiant du groupe, jamais écrit en base ;
 *   code    — le code écrit en base quand rien n'y était ;
 *   codes   — tous les codes qui cochent cette phrase à la relecture ;
 *   titre   — la phrase, telle qu'elle s'affiche ;
 *   exemple — ce qu'elle veut dire, en situation.
 *
 * LE SEUIL EST À B2, et il n'est pas décoratif : c'est le niveau que
 * les universités françaises exigent pour suivre un cursus. « Je me
 * débrouille dans la vie de tous les jours » s'arrête donc à B1, et
 * « je pourrais étudier dans cette langue » commence à B2. Déplacer
 * cette frontière, c'est déplacer ce qu'on annonce à l'étudiant sur
 * les programmes qui lui sont ouverts.
 */
export const NIVEAUX_LANGUE = [
  {
    cle: "aucun",
    code: NIVEAU_AUCUN,
    codes: [NIVEAU_AUCUN],
    titre: "Je ne parle pas cette langue",
    exemple: "Je ne l'ai jamais apprise, ou j'ai tout oublié."
  },
  {
    cle: "mots",
    code: "A1",
    codes: ["A1", "A2"],
    titre: "Quelques mots seulement",
    exemple: "« Bonjour », « merci », « comment ça va ? » — et ça s'arrête là."
  },
  {
    cle: "quotidien",
    code: "B1",
    codes: ["B1"],
    titre: "Je me débrouille dans la vie de tous les jours",
    exemple: "Je fais mes courses, je demande mon chemin, je tiens une conversation simple."
  },
  {
    cle: "etudes",
    code: "B2",
    codes: ["B2", "C1", "C2"],
    titre: "Je suis à l'aise : je pourrais étudier dans cette langue",
    exemple: "Je suis un cours entier, je lis un document long, j'écris un devoir."
  }
];

/**
 * La phrase rappelée sous le bloc, une seule fois. L'étudiant n'a pas à
 * choisir un code, mais il a le droit de savoir lequel on enregistre :
 * le lui cacher serait le mettre en difficulté le jour où un portail le
 * lui demandera.
 */
export const MENTION_ECHELLE = "Vos réponses sont enregistrées sur l'échelle européenne (A1 à C2), celle que demandent les universités et les portails.";

/** Un code lisible, ou "" si ce n'en est pas un. Insensible à la casse. */
export function normaliserCode(code) {
  const brut = String(code == null ? "" : code).trim();
  if (!brut) return "";
  if (brut.toLowerCase() === NIVEAU_AUCUN) return NIVEAU_AUCUN;
  const majuscule = brut.toUpperCase();
  return CODES_CECRL.includes(majuscule) ? majuscule : "";
}

/**
 * Quelle phrase cocher pour un code en base ?
 * `null` quand rien n'a été répondu — aucune phrase n'est cochée, et
 * c'est le bon affichage : cocher « je ne parle pas cette langue » par
 * défaut ferait dire à l'étudiant ce qu'il n'a pas dit.
 */
export function niveauDepuisCode(code) {
  const propre = normaliserCode(code);
  if (!propre) return null;
  const niveau = NIVEAUX_LANGUE.find((n) => n.codes.includes(propre));
  return niveau ? niveau.cle : null;
}

/**
 * Le code à écrire quand l'étudiant coche une phrase.
 * `codeActuel` est ce que la base contient déjà : s'il appartient au
 * groupe choisi, il est GARDÉ tel quel. Voir l'en-tête.
 */
export function codeDepuisNiveau(cle, codeActuel) {
  const niveau = NIVEAUX_LANGUE.find((n) => n.cle === cle);
  if (!niveau) return "";
  const actuel = normaliserCode(codeActuel);
  return niveau.codes.includes(actuel) ? actuel : niveau.code;
}

/**
 * Cette entrée de `languages` décrit-elle une langue que l'étudiant
 * PRATIQUE ? Les anciens profils gardent des chaînes (« français ») ;
 * profile.js écrit des objets {code, level, name?}.
 */
export function langueParlee(entree) {
  if (typeof entree === "string") return entree.trim() !== "";
  if (!entree || typeof entree !== "object") return false;
  const nom = entree.code === "autre" ? String(entree.name || "").trim() : String(entree.code || "").trim();
  if (!nom) return false;
  return normaliserCode(entree.level) !== NIVEAU_AUCUN;
}

/** Les langues pratiquées, dans l'ordre. « aucun » n'en fait pas partie. */
export function languesParlees(languages) {
  if (!Array.isArray(languages)) return [];
  return languages.filter(langueParlee);
}
