/**
* ============================================================
* Fitz — catalogue des tests et examens d'admission (2026-08-30)
* ============================================================
*
* Fiches FACTUELLES et STABLES : format officiel, fourchettes de
* scores habituellement exigées (jamais un seuil inventé pour une
* bourse précise — le seuil réel vit dans la checklist de chaque
* candidature, saisi par l'étudiant depuis la page de la bourse),
* validité, lien officiel, et un plan de préparation générique.
*
* RÈGLE D'HONNÊTETÉ : quand une bourse fait passer SES propres
* épreuves (MEXT) ou n'exige pas de test à l'entrée (Türkiye
* Bursları, année de langue incluse), la fiche le dit — plutôt que
* de pousser l'étudiant à payer un test dont il n'a pas besoin.
*
* `aliases` sert à faire correspondre les items de checklist
* (meta.testName, texte libre ou valeurs du <select> de
* applications.html) à une fiche.
* ============================================================
*/

export const TESTS = [

{
id: "ielts",
nom: "IELTS Academic",
langue: "Anglais",
aliases: ["ielts"],
destinations: ["Royaume-Uni", "Canada", "Australie", "Europe (cursus anglophones)"],
format: "4 épreuves — Listening (30 min), Reading (60 min), Writing (60 min), Speaking (11-14 min, face à un examinateur). Note de 0 à 9.",
exigenceHabituelle: "La plupart des masters demandent entre 6.0 et 7.0 ; les bourses très sélectives (Chevening…) suivent l'exigence de l'université choisie.",
validite: "2 ans",
url: "https://ielts.org",
plan: [
"Passez un test blanc complet chronométré pour situer votre niveau de départ.",
"Travaillez UNE épreuve par semaine, en commençant par la plus faible.",
"En Writing et Speaking, faites-vous corriger — c'est là que les points se perdent ; Fitz peut relire vos essais.",
"Deux tests blancs complets la dernière quinzaine, dans les conditions réelles."
],
fitz: "Envoyez vos essais de Writing à Fitz (Discuter avec Fitz) : structure, connecteurs, vocabulaire — la correction est immédiate."
},

{
id: "toefl",
nom: "TOEFL iBT",
langue: "Anglais",
aliases: ["toefl"],
destinations: ["États-Unis", "Canada", "Japon (cursus anglophones)", "Corée du Sud"],
format: "4 sections — Reading, Listening, Speaking, Writing, ~2 h au total, 100 % sur ordinateur. Score de 0 à 120.",
exigenceHabituelle: "Souvent 80-100 selon les programmes ; les universités américaines très sélectives attendent 100+.",
validite: "2 ans",
url: "https://www.ets.org/toefl",
plan: [
"Familiarisez-vous d'abord avec le format sur ordinateur — la gestion du temps y est décisive.",
"Entraînez le Speaking en enregistrant vos réponses de 45-60 secondes, tous les jours.",
"Notez le vocabulaire académique récurrent des Reading — il revient d'un test à l'autre.",
"Un test blanc complet par semaine le dernier mois."
],
fitz: "Fitz peut vous poser chaque jour des questions de type Speaking et critiquer la structure de vos réponses."
},

{
id: "duolingo",
nom: "Duolingo English Test",
langue: "Anglais",
aliases: ["duolingo"],
destinations: ["États-Unis", "Canada", "de plus en plus d'universités européennes"],
format: "En ligne, depuis chez vous, ~1 h, résultat sous 48 h. Score de 10 à 160.",
exigenceHabituelle: "Généralement 105-125 quand il est accepté — vérifiez TOUJOURS que votre université l'accepte avant de le passer.",
validite: "2 ans",
url: "https://englishtest.duolingo.com",
plan: [
"Vérifiez l'acceptation du test par chacune de vos universités cibles — c'est son seul vrai risque.",
"Faites le test d'entraînement gratuit officiel plusieurs fois.",
"Travaillez la description d'images et la lecture à voix haute, formats propres à ce test.",
"Prévoyez un environnement calme et une connexion stable le jour J — les règles de surveillance sont strictes."
],
fitz: "L'option la plus rapide et la moins chère quand elle est acceptée — demandez à Fitz si vos universités cibles la reconnaissent."
},

{
id: "delf-dalf",
nom: "DELF / DALF",
langue: "Français",
aliases: ["delf", "dalf"],
destinations: ["France", "Belgique", "Suisse", "Canada (Québec)"],
format: "4 compétences — compréhension orale et écrite, production orale et écrite. DELF jusqu'au B2, DALF pour C1-C2. Diplôme, pas un score.",
exigenceHabituelle: "Licence : B2 le plus souvent ; master et bourses d'excellence : B2 confirmé à C1.",
validite: "À vie — c'est un diplôme, il ne périme pas.",
url: "https://www.france-education-international.fr/delf-dalf",
plan: [
"Situez votre niveau réel (test de positionnement) avant de choisir B2 ou C1.",
"Une production écrite par semaine, corrigée — l'argumentation structurée est ce qui départage au B2/C1.",
"Écoutez des contenus francophones authentiques (journaux, podcasts) tous les jours.",
"Préparez l'exposé de l'épreuve orale avec un plan-type que vous maîtrisez."
],
fitz: "Étudiant d'un pays francophone ? Vérifiez d'abord si votre université vous en dispense — beaucoup dispensent les bacheliers d'un système francophone."
},

{
id: "tcf",
nom: "TCF (Test de connaissance du français)",
langue: "Français",
aliases: ["tcf"],
destinations: ["France (procédure d'admission)", "Canada (Québec)"],
format: "QCM (compréhension orale, maîtrise de la langue, compréhension écrite) + épreuves d'expression selon la version. Niveau A1 à C2.",
exigenceHabituelle: "B2 pour la plupart des admissions universitaires françaises.",
validite: "2 ans",
url: "https://www.france-education-international.fr/tcf",
plan: [
"Choisissez la bonne déclinaison (TCF tout public, TCF Canada…) selon votre procédure.",
"Entraînez-vous au format QCM chronométré — la vitesse compte autant que la justesse.",
"Renforcez la grammaire ciblée : accords, temps, registres — le cœur de « maîtrise de la langue ».",
"Un test blanc complet par semaine le dernier mois."
],
fitz: "Plus rapide à obtenir que le DELF quand la date presse — mais il expire au bout de 2 ans, là où le DELF est acquis à vie."
},

{
id: "testdaf",
nom: "TestDaF / Goethe-Zertifikat",
langue: "Allemand",
aliases: ["testdaf", "goethe"],
destinations: ["Allemagne", "Autriche"],
format: "TestDaF : 4 épreuves notées TDN 3 à 5. Alternative : Goethe-Zertifikat B2/C1.",
exigenceHabituelle: "TDN 4 dans les 4 épreuves pour la plupart des cursus germanophones. Les cursus anglophones (fréquents en master) demandent plutôt IELTS/TOEFL.",
validite: "Sans limite officielle (certaines universités demandent un test récent).",
url: "https://www.testdaf.de",
plan: [
"Vérifiez d'abord la langue RÉELLE de votre programme — beaucoup de masters allemands sont en anglais.",
"Travaillez la compréhension de textes académiques longs, spécificité du TestDaF.",
"Entraînez la description de graphiques à l'écrit comme à l'oral — un classique de l'épreuve.",
"Passez par les sujets d'annales officiels, gratuits sur le site."
],
fitz: "Boursier DAAD ? L'exigence de langue dépend du programme choisi, pas du DAAD lui-même — vérifiez la fiche de votre cursus."
},

{
id: "hsk",
nom: "HSK (chinois)",
langue: "Chinois",
aliases: ["hsk", "csca", "csc"],
destinations: ["Chine"],
format: "6 niveaux (HSK 1 à 6) — compréhension écrite et orale, caractères. Le HSKK évalue l'oral séparément.",
exigenceHabituelle: "Bourses CSC (gouvernement chinois) : HSK 4 le plus souvent pour un cursus enseigné en chinois, HSK 5 pour certains programmes littéraires — les cursus anglophones exigent plutôt IELTS/TOEFL, et beaucoup de bourses CSC incluent une année de chinois préparatoire.",
validite: "2 ans pour l'usage administratif.",
url: "https://www.chinesetest.cn",
plan: [
"Déterminez la langue d'enseignement de votre programme : elle décide entre HSK et IELTS/TOEFL.",
"Apprenez les caractères du niveau visé avec des répétitions espacées, tous les jours.",
"Faites les épreuves officielles d'entraînement du site chinesetest.cn.",
"Si votre bourse inclut l'année préparatoire de chinois, concentrez-vous sur le dossier — le HSK viendra sur place."
],
fitz: "Pour une bourse du gouvernement chinois (CSC), la checklist de votre candidature doit dire si votre cursus est en chinois ou en anglais — c'est LE critère qui choisit votre test."
},

{
id: "jlpt",
nom: "JLPT (japonais)",
langue: "Japonais",
aliases: ["jlpt"],
destinations: ["Japon"],
format: "5 niveaux (N5 à N1) — vocabulaire, grammaire, lecture, écoute. Pas d'épreuve d'expression.",
exigenceHabituelle: "Cursus en japonais : N2 le plus souvent. ATTENTION : la bourse MEXT fait passer SES PROPRES épreuves écrites via l'ambassade — le JLPT aide le dossier mais ne les remplace pas ; les cursus anglophones demandent IELTS/TOEFL.",
validite: "Sans limite.",
url: "https://www.jlpt.jp",
plan: [
"Fixez le niveau exigé par votre programme (N2 pour la plupart des cursus japonophones).",
"Kanji et vocabulaire en répétition espacée quotidienne — c'est le volume qui fait le niveau.",
"Travaillez l'écoute avec des contenus réels (actualités NHK Easy pour commencer).",
"Candidat MEXT : entraînez-vous sur les annales officielles des épreuves d'ambassade, disponibles en ligne."
],
fitz: "Le JLPT n'a que deux sessions par an dans la plupart des pays — vérifiez la date d'inscription dès maintenant."
},

{
id: "topik",
nom: "TOPIK (coréen)",
langue: "Coréen",
aliases: ["topik"],
destinations: ["Corée du Sud"],
format: "TOPIK I (niveaux 1-2) et TOPIK II (niveaux 3-6) — compréhension et, pour le II, expression écrite.",
exigenceHabituelle: "Bourse GKS : TOPIK 3+ apprécié, TOPIK 5-6 donne des points supplémentaires — et la bourse inclut une année de coréen ; cursus anglophones : IELTS/TOEFL.",
validite: "2 ans",
url: "https://www.topik.go.kr",
plan: [
"Visez le niveau qui rapporte des points à VOTRE bourse (GKS : chaque niveau au-dessus de 3 compte).",
"Alternez compréhension écrite et écoute chaque jour, même 30 minutes.",
"Pour le TOPIK II, entraînez l'essai 쓰기 avec des sujets d'annales.",
"Les annales officielles sont gratuites — faites-en une par semaine."
],
fitz: "GKS inclut une année de langue sur place : un TOPIK avant le départ n'est pas obligatoire, mais il renforce nettement le dossier."
}

];

/** Langue d'enseignement (catalogue) → tests pertinents, par priorité. */
export const TESTS_PAR_LANGUE = {
"anglais": ["ielts", "toefl", "duolingo"],
"français": ["delf-dalf", "tcf"],
"allemand": ["testdaf", "ielts"],
"chinois": ["hsk"],
"japonais": ["jlpt", "toefl"],
"coréen": ["topik", "toefl"],
"turc": []
};

/** Retrouve une fiche depuis un nom saisi (checklist meta.testName). */
export function testDepuisNom(nom) {
const n = String(nom || "").toLowerCase();
if (!n) return null;
return TESTS.find((t) => t.aliases.some((a) => n.includes(a))) || null;
}

/** Fiches pertinentes pour une langue d'enseignement du catalogue. */
export function testsPourLangue(langue) {
const l = String(langue || "").toLowerCase();
const ids = Object.entries(TESTS_PAR_LANGUE).find(([k]) => l.includes(k));
if (!ids) return [];
return ids[1].map((id) => TESTS.find((t) => t.id === id)).filter(Boolean);
}
