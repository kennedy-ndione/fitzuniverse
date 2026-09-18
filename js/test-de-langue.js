/**
 * ============================================================
 * FitzUniverse — LE TEST DE LANGUE, UNE QUESTION POSÉE UNE FOIS
 * (lot R17, 2026-09-18)
 * ============================================================
 *
 * Charles, le 2026-09-18 : « pour la partie test de langue, il faut
 * revoir ce que l'étudiant doit renseigner de façon simple, parce que
 * même moi je n'ai pas compris ce que tu demandes réellement ».
 *
 * Il avait raison, et le défaut était plus profond que la formulation.
 *
 * ------------------------------------------------------------------
 * DEUX ENDROITS POSAIENT LA MÊME QUESTION
 *
 * À l'étape 1 de la route (QUESTIONS_SITUATION, js/route-preinscription.js),
 * on demandait « Et le français ? » — quatre choix : j'ai fait mes
 * études en français, j'ai passé un test, je vais passer un test, pas
 * encore décidé. Résultat en base : `profile.situationFrancais`.
 *
 * Dans « Mon profil », on redemandait « Test de langue » — une liste
 * déroulante de huit tests, puis « Déjà passé / Pas encore passé ».
 * Résultat en base : `profile.testLangue`.
 *
 * Deux vocabulaires, deux champs, et RIEN qui les tienne d'accord : un
 * étudiant pouvait dire « j'ai passé un test » dans sa route et « aucun
 * test » dans son profil. Fitz lisait les deux (js/ai/prompts.js lit le
 * second, la route lit le premier). C'est la faute des lots R5, R6, R7,
 * R13 et B2 — deux endroits pour une seule règle — sur un sujet qui
 * décide d'une admission.
 *
 * Pire : la page « Mon profil » réécrivait le bloc `profile` ENTIER à
 * partir d'une liste de clés où `situationFrancais` ne figurait pas.
 * Enregistrer n'importe quelle section EFFAÇAIT donc la réponse donnée
 * à l'étape 1. Vérifié au banc d'essai le 2026-09-18 :
 * `situationFrancais: "test_prevu"` → absent après un enregistrement.
 * Le lot ferme la fuite à la source (profile.js écrit désormais champ
 * par champ, comme la route) ; ce module ferme la contradiction.
 *
 * ------------------------------------------------------------------
 * L'ORDRE DES QUESTIONS EST INVERSÉ, ET C'EST LE CŒUR DU LOT
 *
 * L'ancienne page demandait D'ABORD « quel test ? ». Or la plupart des
 * candidats n'en ont aucun : on ouvrait le formulaire sur une question
 * qui ne les concernait pas encore, avec huit sigles pour seule aide.
 *
 * On demande maintenant D'ABORD OÙ L'ON EN EST — quatre phrases — et le
 * détail (quel test, quel score, quelle date) n'apparaît QUE lorsqu'il
 * a un sens. C'est la règle du lot R16, appliquée au champ voisin.
 *
 * ------------------------------------------------------------------
 * CE QU'ON N'ÉCRIT PAS, ET POURQUOI C'EST LE POINT DÉLICAT
 *
 * `situationFrancais` parle du FRANÇAIS. Un étudiant qui déclare un
 * IELTS n'a rien dit de son français : lui écrire « a passé un test »
 * ferait afficher, à l'étape 1 de sa route France, une réponse qu'il
 * n'a jamais donnée. `situationFrancaisDepuisTest()` rend donc "" dans
 * ce cas — ON SE TAIT — et profile.js n'écrit tout simplement pas la
 * clé. C'est la même règle de prudence que `releveDeLaProcedureEEF()`
 * au lot R15 : on n'affirme que ce qu'on sait.
 *
 * Et on ne DÉDUIT pas la dispense : la quatrième phrase nomme le
 * français explicitement, plutôt que de conclure « études en français »
 * d'un niveau déclaré ailleurs. C'est la doctrine écrite au lot R10 à
 * propos de la langue des pièces : « on ne déduit rien : on demande ».
 *
 * Pur : aucune dépendance, aucune écriture, aucun accès réseau.
 * ============================================================
 */

/**
 * Les quatre états, dans l'ordre d'affichage. `situationFrancais` est
 * ce que cet état dit du français — et "" quand il n'en dit rien.
 */
export const ETATS_TEST_LANGUE = [
  {
    cle: "aucun",
    titre: "Je n'ai pas encore passé de test",
    exemple: "C'est le cas de la plupart des candidats à ce stade — ce n'est pas un retard.",
    situationFrancais: "aucun"
  },
  {
    cle: "passe",
    titre: "J'ai déjà passé un test",
    exemple: "Vous avez reçu une attestation, avec un score ou un niveau dessus.",
    situationFrancais: "test_passe"
  },
  {
    cle: "prevu",
    titre: "Je suis inscrit à un test, j'ai une date",
    exemple: "Vous le passez bientôt : la date suffit, le score viendra après.",
    situationFrancais: "test_prevu"
  },
  {
    cle: "dispense",
    titre: "Je n'ai pas de test à passer : j'ai fait mes études en français",
    exemple: "Votre lycée ou votre université enseignait en français. L'université vérifiera, mais en principe elle ne vous demandera pas de test.",
    situationFrancais: "etudes_en_francais"
  }
];

const CLES_ETAT = new Set(ETATS_TEST_LANGUE.map((e) => e.cle));

/** Les états où l'on demande QUEL test — et eux seuls. */
export const ETATS_AVEC_TEST = ["passe", "prevu"];

/**
 * Les tests, avec LA LANGUE qu'ils attestent. Cette colonne n'est pas
 * décorative : c'est elle qui décide si une réponse dit quelque chose
 * du français (voir situationFrancaisDepuisTest).
 *
 * « Aucun test pour l'instant » a QUITTÉ cette liste : c'était un état
 * déguisé en test, et c'est exactement ce que la refonte sépare.
 */
export const TESTS_DE_LANGUE = [
  { id: "TCF", label: "TCF", langue: "fr", aide: "Test de connaissance du français" },
  { id: "TCF-DAP", label: "TCF-DAP", langue: "fr", aide: "Le TCF exigé pour entrer en 1re année de licence" },
  { id: "DELF", label: "DELF", langue: "fr", aide: "Diplôme d'études en langue française" },
  { id: "DALF", label: "DALF", langue: "fr", aide: "Diplôme approfondi de langue française" },
  { id: "TEF", label: "TEF", langue: "fr", aide: "Test d'évaluation de français" },
  { id: "IELTS", label: "IELTS", langue: "en", aide: "Test d'anglais international" },
  { id: "TOEFL", label: "TOEFL", langue: "en", aide: "Test d'anglais international" },
  { id: "Duolingo", label: "Duolingo English Test", langue: "en", aide: "Test d'anglais en ligne" }
];

const IDS_TESTS = new Set(TESTS_DE_LANGUE.map((t) => t.id));

/** L'exemple de score, par langue — un IELTS ne se note pas comme un TCF. */
export const EXEMPLES_SCORE = {
  fr: "Ex. B2, TCF 450, DELF B2",
  en: "Ex. IELTS 6.5, TOEFL 88, Duolingo 115"
};

export function testConnu(id) {
  return TESTS_DE_LANGUE.find((t) => t.id === id) || null;
}

/**
 * Lecture tolérante de `profile.testLangue` — toujours les cinq clés,
 * toujours des chaînes.
 *
 * MIGRATION DES PROFILS D'AVANT CE LOT, qui n'ont pas d'`etat` :
 * `nature: "aucun"` était l'ancien « aucun test » (un état rangé dans
 * le champ du test) ; une date de passage ou un score veut dire passé ;
 * une date prévue veut dire prévu. Rien n'est perdu, rien n'est
 * réécrit en base tant que l'étudiant n'enregistre pas.
 */
export function lireTestLangue(profile) {

  const t = profile && typeof profile === "object" && profile.testLangue && typeof profile.testLangue === "object" ? profile.testLangue : {};
  const chaine = (v) => (typeof v === "string" ? v.trim() : "");

  const natureBrute = chaine(t.nature);
  const nature = IDS_TESTS.has(natureBrute) ? natureBrute : "";
  const score = chaine(t.score);
  const date = chaine(t.date);
  const prevuLe = chaine(t.prevuLe);

  let etat = chaine(t.etat);
  if (!CLES_ETAT.has(etat)) {
    if (natureBrute === "aucun") etat = "aucun";
    else if (nature && (score || date)) etat = "passe";
    else if (nature && prevuLe) etat = "prevu";
    else if (nature) etat = "passe";
    else etat = "";
  }

  return { etat, nature, score, date, prevuLe };

}

/**
 * Ce que cette réponse dit du français, pour `profile.situationFrancais`
 * — et "" quand elle n'en dit RIEN. Voir l'en-tête : un IELTS ne
 * raconte pas le français de l'étudiant, et l'affirmer lui mettrait
 * dans la bouche, à l'étape 1 de sa route, une réponse qu'il n'a pas
 * donnée.
 */
export function situationFrancaisDepuisTest({ etat = "", nature = "" } = {}) {

  const definition = ETATS_TEST_LANGUE.find((e) => e.cle === etat);
  if (!definition) return "";

  if (!ETATS_AVEC_TEST.includes(etat)) return definition.situationFrancais;

  const test = testConnu(nature);
  return test && test.langue === "fr" ? definition.situationFrancais : "";

}

/**
 * Le chemin inverse : ce que la route sait déjà, proposé dans le profil.
 * Un étudiant qui a répondu à l'étape 1 ne répond pas deux fois.
 */
export function etatDepuisSituationFrancais(situationFrancais) {
  const valeur = typeof situationFrancais === "string" ? situationFrancais.trim() : "";
  const trouve = ETATS_TEST_LANGUE.find((e) => e.situationFrancais === valeur);
  return trouve ? trouve.cle : "";
}

/** Phrase de lecture (fiche admin, prompts Fitz) — "" quand rien n'est dit. */
export function phraseTestLangue(profile) {

  const t = lireTestLangue(profile);
  if (!t.etat) return "";

  if (t.etat === "aucun") return "Aucun test de langue pour l'instant";
  if (t.etat === "dispense") return "Pas de test à passer : études faites en français";

  const test = testConnu(t.nature);
  const nom = test ? test.label : "Test non précisé";

  if (t.etat === "prevu") return t.prevuLe ? `${nom} prévu le ${t.prevuLe}` : `${nom} prévu`;

  if (t.score || t.date) {
    return `${nom}${t.score ? ` : ${t.score}` : ""}${t.date ? ` (passé le ${t.date})` : ""}`;
  }

  return nom;

}
