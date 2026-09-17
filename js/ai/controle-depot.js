/**
 * ============================================================
 * FitzUniverse — LE CONTRÔLE AVANT DÉPÔT, sur des faits vérifiables
 * (lot R11, 2026-09-17)
 * ============================================================
 *
 * CE QUI S'EST PASSÉ, trouvé en relisant js/ai/simulated-responses.js
 * sous le mandat « renforcer la préinscription » :
 *
 *   `analyzeDocument()` calculait le score d'un document à partir du
 *   HASH DE SON NOM DE FICHIER — `scoreFromHash(file.name)` — puis
 *   écrivait, au-dessus de 80 : « Document bien structuré et conforme
 *   aux attentes. » Trois des cinq catégories du rapport (grammaire,
 *   professionnalisme, cohérence) sortaient du même hash.
 *
 * Autrement dit : un étudiant téléversait `releve.pdf` de 3 Mo — six
 * fois le plafond du portail — et Fitz le déclarait conforme parce que
 * le hash de la chaîne « releve.pdf » tombait au-dessus de 80. Il
 * déposait, payait 85 000 F non remboursables, et se faisait refuser
 * pour un poids de fichier que le navigateur connaissait depuis le
 * début. L'en-tête de js/fitz-recours.js l'écrivait déjà, six lots plus
 * tôt : « promettre que Fitz résout tout et livrer un gabarit creux
 * détruirait la confiance dans tout le produit. »
 *
 * CE MODULE NE JUGE QUE CE QU'IL PEUT VÉRIFIER, et le dit :
 *   - le POIDS de chaque fichier contre le plafond publié par la
 *     procédure du pays (500 Ko en général, 50 Ko pour la photo) : le
 *     navigateur le connaît exactement, c'est un fait, pas une
 *     estimation — et c'est la première cause de refus au guichet ;
 *   - les PIÈCES réglées ou non, depuis la liste de la procédure ;
 *   - la LANGUE des pièces (lot R10), parce qu'une traduction
 *     assermentée demande des semaines.
 *
 * Il ne note NI la grammaire, NI le professionnalisme, NI la cohérence :
 * personne ne lit le contenu des documents ici, et un score sur ce
 * qu'on n'a pas lu est un mensonge, pas une approximation. Le rapport le
 * dit à l'étudiant en clair, et l'oriente vers une relecture humaine.
 *
 * Pur : aucune dépendance, aucune écriture, aucun accès réseau. La
 * forme rendue est celle que ai-check.js affiche déjà (`categories`,
 * `categoryLabels`, `checklist`, `strengths`, `weaknesses`,
 * `suggestions`) — la page n'a pas une ligne à changer.
 * ============================================================
 */

/** Les libellés des trois contrôles, dans l'ordre où ils comptent. */
export const LIBELLES_CONTROLE = {
  poids: "Poids des fichiers",
  pieces: "Pièces du dossier",
  langue: "Langue des pièces"
};

/**
 * Un plafond de la procédure (« 500 Ko », « 50 Ko », « 1 Mo ») en
 * kilo-octets. Rend `null` pour une valeur vide ou non reconnue : un
 * plafond qu'on ne sait pas lire ne devient pas un plafond inventé.
 */
export function plafondKo(tailleMax) {
  const m = /^\s*([\d.,]+)\s*(K|M)o\s*$/i.exec(String(tailleMax || ""));
  if (!m) return null;
  const n = parseFloat(m[1].replace(",", "."));
  if (!Number.isFinite(n) || n <= 0) return null;
  return m[2].toUpperCase() === "M" ? Math.round(n * 1024) : Math.round(n);
}

/** Un poids d'octets tel qu'on l'écrit dans une phrase française. */
export function tailleLisible(octets) {
  const n = Number(octets);
  if (!Number.isFinite(n) || n < 0) return "";
  if (n < 1024) return `${Math.round(n)} o`;
  const ko = n / 1024;
  if (ko < 1024) return `${Math.round(ko)} Ko`;
  return `${(ko / 1024).toFixed(1).replace(".", ",")} Mo`;
}

/**
 * LE PLAFOND QUI S'APPLIQUE À UN FICHIER QUELCONQUE.
 *
 * On ne devine PAS quelle pièce est quel fichier : « scan1.pdf » ne dit
 * rien. On retient donc le plafond le plus LARGE de la procédure — le
 * plafond général, 500 Ko dans le dossier français — et on le compare à
 * chaque fichier. Un fichier au-dessus est refusé à coup sûr, quelle
 * que soit la pièce qu'il représente : c'est une certitude, et c'est
 * tout ce qu'on affirme. Les plafonds plus stricts (la photo à 50 Ko)
 * sont rappelés à part, comme une règle nommée, jamais appliquée à un
 * fichier qu'on n'a pas identifié.
 */
export function plafondGeneralKo(pieces) {
  const plafonds = (Array.isArray(pieces) ? pieces : [])
    .map((p) => plafondKo(p.tailleMax))
    .filter((v) => typeof v === "number");
  return plafonds.length ? Math.max(...plafonds) : null;
}

/** Les plafonds plus stricts que le général, avec la pièce qui les porte. */
export function plafondsStricts(pieces, general) {
  if (typeof general !== "number") return [];
  return (Array.isArray(pieces) ? pieces : [])
    .map((p) => ({ nom: p.nom, ko: plafondKo(p.tailleMax), ecartee: p.ecartee === true }))
    .filter((p) => typeof p.ko === "number" && p.ko < general && !p.ecartee);
}

/**
 * Le contrôle avant dépôt.
 *
 * @param {Object} entrees
 * @param {Array}  entrees.fichiers  - { name, size } tels que le navigateur les donne
 * @param {Array}  entrees.pieces    - les pièces de la route (nom, tailleMax, obtenue, ecartee)
 * @param {Object} entrees.traduction - l'état de traduction de la route (concernees, reglee)
 */
export function controleDepot({ fichiers = [], pieces = [], traduction = null } = {}) {

  const liste = Array.isArray(fichiers) ? fichiers.filter(Boolean) : [];
  const lesPieces = Array.isArray(pieces) ? pieces : [];
  const general = plafondGeneralKo(lesPieces);
  const stricts = plafondsStricts(lesPieces, general);

  // ---- 1. Le poids, fichier par fichier ----
  //
  // ON NE LIT QUE `octets`, ET RIEN D'AUTRE. Le piège, trouvé en
  // relisant l'appelant avant d'écrire une ligne : ai-check.js envoyait
  // déjà un champ `size`, mais en MÉGAOCTETS ET EN CHAÎNE
  // (`(entry.size / 1024 / 1024).toFixed(2)` → « 3.20 »). Le lire comme
  // des octets aurait donné 0,003 Ko pour un fichier de 3,2 Mo : tous
  // les fichiers auraient passé le contrôle, et ce module aurait
  // remplacé un faux score par un faux verdict — exactement le défaut
  // qu'il vient corriger, en pire, parce qu'il aurait l'air sérieux.
  //
  // Un champ `octets` absent ou illisible ne devient donc JAMAIS un
  // « ça passe » : le fichier est déclaré non mesuré, et on le dit.
  const mesures = liste.map((f) => {
    const octets = typeof f.octets === "number" && Number.isFinite(f.octets) && f.octets >= 0 ? f.octets : null;
    const ko = octets === null ? null : octets / 1024;
    const trop = ko !== null && typeof general === "number" && ko > general;
    return { nom: String(f.name || "sans nom"), octets, lisible: octets === null ? "" : tailleLisible(octets), mesurable: octets !== null, trop };
  });
  const trop = mesures.filter((m) => m.trop);
  const mesurables = mesures.filter((m) => m.mesurable);
  const nonMesures = mesures.filter((m) => !m.mesurable);

  // ---- 2. Les pièces réglées (obtenue OU écartée) ----
  const reglees = lesPieces.filter((p) => p.obtenue || p.ecartee).length;

  // ---- 3. La langue ----
  const langueEnJeu = !!(traduction && Array.isArray(traduction.concernees) && traduction.concernees.length);

  // ---- Les catégories : SEULEMENT celles qu'on peut juger ----
  // Une catégorie absente est honnête ; une catégorie à zéro parce
  // qu'on ne sait pas se lirait comme un mauvais score.
  const categories = {};
  const categoryLabels = {};
  const ajoute = (cle, valeur) => { categories[cle] = valeur; categoryLabels[cle] = LIBELLES_CONTROLE[cle]; };

  // LE POIDS EST BINAIRE, pas une proportion. Un seul fichier au-dessus
  // du plafond fait refuser le dépôt : « deux fichiers sur trois
  // passent » n'existe pas au guichet. Écrire 67 % ici serait redire le
  // défaut qu'on vient de corriger, en plus discret.
  //
  // Et il n'est 100 que si TOUS les fichiers ont été mesurés : un
  // fichier dont on ignore le poids ne vaut pas un fichier conforme.
  if (typeof general === "number") {
    ajoute("poids", mesurables.length && !trop.length && !nonMesures.length ? 100 : 0);
  }
  if (lesPieces.length) {
    ajoute("pieces", Math.round((reglees / lesPieces.length) * 100));
  }
  if (langueEnJeu) {
    ajoute("langue", traduction.reglee ? 100 : 0);
  }

  // LE SCORE EST LE MINIMUM, PAS LA MOYENNE.
  //
  // Un dossier est refusé par son point faible, jamais par sa moyenne.
  // Avec une moyenne, un relevé de 3 Mo — refus certain — s'affichait
  // « 83 / 100 » parce que les pièces et la langue étaient en ordre : le
  // chiffre rassurait sur un dossier condamné. Le minimum dit ce que
  // l'étudiant a besoin de savoir, et la catégorie rouge dit laquelle.
  const valeurs = Object.values(categories);
  const overallScore = valeurs.length ? Math.min(...valeurs) : 0;
  const pretADeposer = valeurs.length > 0 && valeurs.every((v) => v === 100);

  // ---- Ce qui va, ce qui ne va pas, ce qu'il faut faire ----
  const strengths = [];
  const weaknesses = [];
  const suggestions = [];

  if (mesurables.length && typeof general === "number" && !trop.length) {
    strengths.push(`${mesurables.length === 1 ? "Votre fichier est" : `Vos ${mesurables.length} fichiers sont`} sous le plafond de ${general} Ko du portail.`);
  }
  if (lesPieces.length && reglees === lesPieces.length) {
    strengths.push(`Les ${lesPieces.length} pièces du dossier sont réglées.`);
  }
  if (langueEnJeu && traduction.reglee) {
    strengths.push("La question de la langue de vos pièces est tranchée.");
  }

  for (const m of trop) {
    weaknesses.push(`${m.nom} : ${m.lisible}. Le portail refuse au-delà de ${general} Ko — ce fichier sera rejeté tel quel.`);
  }
  if (!liste.length) {
    weaknesses.push("Aucun fichier importé : rien n'a pu être mesuré.");
  }
  for (const m of nonMesures) {
    weaknesses.push(`${m.nom} : son poids n'a pas pu être mesuré, je ne peux donc pas dire s'il passera le plafond de ${typeof general === "number" ? `${general} Ko` : "votre portail"}.`);
  }
  if (lesPieces.length && reglees < lesPieces.length) {
    const manquantes = lesPieces.filter((p) => !p.obtenue && !p.ecartee).map((p) => p.nom);
    weaknesses.push(`${manquantes.length} pièce${manquantes.length > 1 ? "s" : ""} encore à régler : ${manquantes.join(" · ")}.`);
  }
  if (langueEnJeu && !traduction.reglee) {
    weaknesses.push("La langue de vos relevés et diplômes n'est pas déclarée : si ces pièces ne sont pas en français, il faut une traduction assermentée, et cela prend des semaines.");
  }

  if (trop.length) {
    suggestions.push("Réduisez les fichiers trop lourds avant de les déposer — l'outil de compression de Fitz le fait sans abîmer la lisibilité.");
  }
  if (!liste.length) {
    suggestions.push("Importez vos fichiers TELS QUE vous allez les déposer : c'est leur poids réel que le portail mesure.");
  }
  for (const s of stricts) {
    suggestions.push(`Attention à un plafond plus strict : « ${s.nom} » est limitée à ${s.ko} Ko, et non ${general} Ko.`);
  }
  // LA LIMITE DE CE CONTRÔLE, DITE À L'ÉTUDIANT. Un outil qui ne dit pas
  // ce qu'il n'a pas regardé laisse croire qu'il a tout regardé.
  suggestions.push("Ce contrôle porte sur ce que le portail refuse mécaniquement : le poids des fichiers, les pièces manquantes, la langue. Le CONTENU de vos documents n'est pas jugé ici — faites-le relire par votre conseiller, un professeur ou un proche.");

  return {
    overallScore,
    pretADeposer,
    categories,
    categoryLabels,
    checklist: lesPieces.map((p) => ({ key: p.slug || p.nom, label: p.nom, present: !!(p.obtenue || p.ecartee) })),
    strengths,
    weaknesses,
    suggestions,
    // Rendu à part pour les tests et pour un affichage plus fin plus tard.
    controle: { plafondGeneralKo: general, plafondsStricts: stricts, fichiers: mesures, trop, piecesReglees: reglees, piecesTotal: lesPieces.length, pretADeposer }
  };

}
