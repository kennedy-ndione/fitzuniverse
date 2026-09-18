/**
 * ============================================================
 * FitzUniverse — LE CONTRÔLE AVANT DÉPÔT, PARCOURS BOURSES
 * (lot B1, 2026-09-18)
 * ============================================================
 *
 * LA DETTE DU LOT R11, PAYÉE. Elle était nommée dans
 * js/ai/simulated-responses.js et exigée par un test : « la branche
 * bourses garde ce défaut […] à traiter AU PREMIER LOT de l'espace
 * bourse ». Reproduite sur le site déployé le 2026-09-18, avec le
 * fichier même qui avait servi d'exemple au lot R11 :
 *
 *   releve.pdf (3,2 Mo) → Clarté 91/100 · Grammaire 90/100 ·
 *   Professionnalisme 86/100 · « Document bien structuré et conforme
 *   aux attentes. » · score global 67/100
 *
 * Les trois notes sortaient de `scoreFromHash(nom-du-fichier)`. Aucune
 * ligne n'avait été lue. Elles étaient affichées à l'étudiant en
 * « points forts », avec leur chiffre.
 *
 * ------------------------------------------------------------------
 * POURQUOI CE MODULE NE REND AUCUNE NOTE
 *
 * Le contrôle d'une préinscription (js/ai/controle-depot.js, lot R11)
 * peut noter : la procédure du pays PUBLIE un plafond de poids et une
 * liste de pièces exactes. Un dossier de bourse n'a ni l'un ni l'autre.
 * Le catalogue connaît des « exigences » pour 104 bourses sur 156, mais
 * ce sont presque toujours des CONDITIONS — nomination par l'autorité
 * nationale, admission préalable, certification de langue — et non des
 * documents : on ne téléverse pas une nomination. La carte de la
 * candidature les affiche déjà (applications.js, « Ce que cette bourse
 * exige ») ; les redire ici serait un second endroit pour une même
 * règle, la faute que les lots R5, R6, R7 et R13 ont payée.
 *
 * Il ne reste donc, ici, AUCUNE dimension notable — et une note sur
 * rien est exactement le défaut qu'on répare. `overallScore` vaut
 * `null`, `categories` est vide, et la page affiche « — ».
 *
 * Le jour où js/ai/ai-config.js passera de "simule" à "passerelle", un
 * vrai modèle lira les textes et une note de CONTENU pourra revenir —
 * portée par ce module, avec ses catégories nommées. Elle reviendra
 * parce qu'elle sera méritée, pas parce qu'un anneau attend un chiffre.
 *
 * ------------------------------------------------------------------
 * CE QU'IL RAPPORTE, ET QUI SONT TOUS DES FAITS
 *
 *   1. LE POIDS de chaque fichier, en octets, tel que le navigateur le
 *      connaît. Sans plafond publié on ne le note pas — on le DIT, et
 *      l'étudiant compare au portail de son bailleur.
 *   2. LE TEXTE : pdf.js l'extrait réellement (js/ai/extract-text.js).
 *      Trois faits en sortent, et trois seulement : le texte a été lu,
 *      le fichier n'en contient pas (c'est une image scannée), ou le
 *      format ne se lit pas ici. Un PDF sans texte extractible n'est
 *      pas un mauvais document — mais un jury qui copie-colle, un
 *      correcteur automatique et un lecteur d'écran n'y liront rien
 *      non plus, et ça vaut d'être su avant le dépôt.
 *   3. LE NOMBRE DE MOTS quand le texte a été lu. Un fait brut. On ne
 *      décrète pas qu'une lettre de 300 mots est trop courte : aucun
 *      bailleur ne publie ce seuil. On signale le seul cas
 *      indiscutable — un document dont on n'a tiré AUCUN mot.
 *   4. LES DOCUMENTS COURANTS présents, d'après ce que l'étudiant a
 *      téléversé et déclaré. Une liste, jamais un pourcentage : elle ne
 *      dit pas ce que CETTE bourse demande, et le laisser croire serait
 *      mentir à nouveau.
 *
 * Et il DIT ce qu'il ne juge pas — la qualité, le style, la pertinence
 * du propos — en orientant vers une relecture humaine. C'est la ligne
 * du lot R11, mot pour mot : « un score sur ce qu'on n'a pas lu est un
 * mensonge, pas une approximation ».
 *
 * Pur : aucune dépendance, aucune écriture, aucun accès réseau. La
 * forme rendue est celle que ai-check.js affiche déjà.
 * ============================================================
 */

/**
 * L'état de lecture d'un fichier, tel que l'appelant DOIT le fournir.
 * Il n'est jamais deviné ici : `content: undefined` ne distingue pas
 * « le format ne se lit pas » de « pdf.js a échoué » de « le PDF est
 * une image », et ces trois-là ne se disent pas de la même façon à
 * l'étudiant. C'est la leçon du champ `size` du lot R11 — une donnée
 * ambiguë produit un verdict faux avec l'air d'être sérieux.
 */
export const EXTRACTIONS = ["lue", "vide", "format", "erreur"];

export const LIBELLES_EXTRACTION = {
  lue: "texte lu",
  vide: "aucun texte à l'intérieur — probablement une image scannée",
  format: "format non lisible ici",
  erreur: "lecture impossible"
};

const LIBELLES_DOCUMENTS = {
  cv: "CV / Curriculum Vitae",
  lettre: "Lettre de motivation",
  passeport: "Passeport",
  releve: "Relevé de notes",
  diplome: "Diplôme",
  recommandation: "Lettre de recommandation",
  langue: "Test de langue",
  financement: "Justificatif de financement"
};

export const NON_JUGE_BOURSE = "Le CONTENU de vos documents n'est pas jugé ici — ni la qualité de votre texte, ni son style, ni la pertinence de votre projet. Faites-les relire par votre conseiller, un professeur ou un proche avant de déposer.";

/** Un poids lisible, sans jamais arrondir vers le bas. */
export function poidsLisible(octets) {
  if (typeof octets !== "number" || !Number.isFinite(octets) || octets < 0) return "";
  if (octets < 1024) return `${octets} o`;
  const ko = octets / 1024;
  if (ko < 1024) return `${Math.round(ko)} Ko`;
  return `${(ko / 1024).toFixed(2).replace(".", ",")} Mo`;
}

/** Le compte de mots d'un texte extrait. Zéro si rien de lisible. */
export function compterMots(texte) {
  if (typeof texte !== "string") return 0;
  const propre = texte.replace(/\s+/g, " ").trim();
  if (!propre) return 0;
  return propre.split(" ").filter(Boolean).length;
}

/**
 * @param {{fichiers?: Array, typesDeclares?: Array<string>}} entree
 *   fichiers : { nom, octets, extraction, texte, type }
 *   typesDeclares : les documents que l'étudiant a cochés dans son profil.
 */
export function controleBourse({ fichiers = [], typesDeclares = [] } = {}) {

  const liste = Array.isArray(fichiers) ? fichiers : [];
  const declares = Array.isArray(typesDeclares) ? typesDeclares : [];

  const mesures = liste.map((f) => {

    const nom = (f && f.nom) || "document";
    const octets = f && typeof f.octets === "number" && Number.isFinite(f.octets) && f.octets >= 0 ? f.octets : null;
    const extraction = EXTRACTIONS.includes(f && f.extraction) ? f.extraction : "erreur";
    const mots = extraction === "lue" ? compterMots(f && f.texte) : 0;

    return {
      nom,
      octets,
      poids: poidsLisible(octets),
      mesurable: octets !== null,
      extraction,
      mots,
      type: (f && f.type) || null
    };

  });

  // ---- Les documents courants présents ----
  // D'après ce qui a été téléversé ET ce qui a été déclaré au profil.
  // C'est un inventaire, pas un barème : rien ici ne dit ce que CETTE
  // bourse demande.
  const presents = new Set([
    ...mesures.map((m) => m.type).filter(Boolean),
    ...declares.filter((t) => typeof t === "string" && t)
  ]);

  const checklist = Object.keys(LIBELLES_DOCUMENTS).map((cle) => ({
    key: cle,
    label: LIBELLES_DOCUMENTS[cle],
    present: presents.has(cle)
  }));

  // ---- Ce qu'on a lu, et ce qu'on n'a pas pu lire ----
  const lus = mesures.filter((m) => m.extraction === "lue");
  const vides = mesures.filter((m) => m.extraction === "vide");
  const illisibles = mesures.filter((m) => m.extraction === "format" || m.extraction === "erreur");
  const sansMot = lus.filter((m) => m.mots === 0);

  const strengths = [];
  const weaknesses = [];
  const suggestions = [];

  for (const m of mesures) {
    const poids = m.mesurable ? m.poids : "poids inconnu";
    strengths.push(`${m.nom} — ${poids}, ${LIBELLES_EXTRACTION[m.extraction]}${m.extraction === "lue" && m.mots ? ` (${m.mots} mot${m.mots > 1 ? "s" : ""})` : ""}.`);
  }

  if (!mesures.length) {
    suggestions.push("Ajoutez au moins un document : sans fichier, il n'y a rien à mesurer.");
  }

  // LE SEUL CAS INDISCUTABLE : un texte lu dont on n'a tiré aucun mot.
  for (const m of sansMot) {
    weaknesses.push(`${m.nom} : aucun mot n'a pu en être tiré. Vérifiez que le fichier n'est pas vide avant de le déposer.`);
  }

  for (const m of vides) {
    weaknesses.push(`${m.nom} : le fichier ne contient aucun texte à l'intérieur — c'est une image scannée. Elle reste valable si le bailleur l'accepte, mais personne ne pourra y copier une ligne, ni un correcteur, ni un lecteur d'écran.`);
  }

  if (illisibles.length) {
    suggestions.push(`Fitz ne sait lire ici que les PDF : ${illisibles.map((m) => m.nom).join(", ")} n'a pas pu être ouvert. Son poids reste mesuré ; son contenu n'a pas été vu.`);
  }

  // LE POIDS EST DIT, JAMAIS NOTÉ. Aucun plafond n'est publié pour un
  // dossier de bourse : le comparer à un chiffre inventé serait refaire
  // le défaut qu'on répare, dans l'autre sens.
  if (mesures.some((m) => m.mesurable)) {
    suggestions.push("Comparez ces poids au plafond affiché par le portail de votre bailleur : il varie d'un organisme à l'autre, et FitzUniverse ne le connaît pas pour cette bourse.");
  }

  const manquants = checklist.filter((c) => !c.present).map((c) => c.label);
  if (manquants.length) {
    suggestions.push(`Documents courants d'un dossier de bourse que Fitz ne voit pas encore : ${manquants.join(", ")}. Cette liste est générale — seules les exigences de votre bourse, sur la carte de votre candidature, disent ce qui est vraiment demandé.`);
  }

  suggestions.push(NON_JUGE_BOURSE);

  return {
    // AUCUNE NOTE : voir l'en-tête. La page affiche « — ».
    overallScore: null,
    // LES TROIS LISTES CHANGENT DE TITRE, parce qu'elles changent de
    // nature. « Points forts » au-dessus de « lettre.docx — 39 Ko,
    // format non lisible ici » serait une quatrième façon de mentir :
    // ce n'est pas un compliment, c'est une mesure. La page garde ses
    // titres d'origine quand ce champ est absent (parcours
    // préinscription, lot R11).
    listLabels: {
      strengths: "Ce que Fitz a mesuré",
      weaknesses: "Ce qui mérite un coup d'œil",
      suggestions: "Ce que Fitz vous conseille"
    },
    categories: {},
    categoryLabels: {},
    files: mesures,
    checklist,
    strengths,
    weaknesses,
    suggestions,
    controle: { fichiers: mesures, lus: lus.length, vides: vides.length, illisibles: illisibles.length, nonJuge: NON_JUGE_BOURSE }
  };

}
