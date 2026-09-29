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
sessions: "Jusqu'à 4 sessions par mois dans la plupart des grandes villes (version ordinateur presque chaque semaine).",
resultats: "3 à 5 jours (ordinateur), ~13 jours (papier).",
dureePrepa: "6 à 10 semaines sérieuses selon votre niveau de départ — davantage pour gagner plus d'une demi-bande.",
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
sessions: "Plus de 60 dates par an — plusieurs fois par mois dans les centres agréés, ou à domicile (Home Edition).",
resultats: "4 à 8 jours.",
dureePrepa: "4 à 8 semaines, surtout pour apprivoiser le format 100 % ordinateur.",
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
sessions: "À tout moment, depuis chez vous — aucune date à réserver.",
resultats: "Sous 48 h.",
dureePrepa: "2 à 4 semaines suffisent souvent, le format étant court et adaptatif.",
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
sessions: "Plusieurs sessions par an selon les centres d'examen de votre pays — renseignez-vous tôt, les places partent vite.",
resultats: "Environ 4 à 8 semaines.",
dureePrepa: "8 à 12 semaines pour consolider un vrai B2/C1 — l'argumentation écrite ne s'improvise pas.",
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
sessions: "Sessions mensuelles dans la plupart des centres.",
resultats: "Environ 15 jours ouvrés.",
dureePrepa: "4 à 6 semaines — l'entraînement au QCM chronométré fait l'essentiel du gain.",
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
sessions: "6 sessions par an dans le monde — anticipez, l'inscription ferme tôt.",
resultats: "6 à 8 semaines.",
dureePrepa: "10 à 12 semaines — les textes académiques longs demandent de l'endurance.",
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
sessions: "Environ une session par mois selon les centres (Instituts Confucius) ; la version en ligne est plus fréquente.",
resultats: "~10 jours (en ligne), ~1 mois (papier).",
dureePrepa: "Très dépendant du niveau visé : comptez 10 à 12 semaines par niveau HSK à gravir.",
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
sessions: "2 sessions par an seulement (juillet et décembre) — et une seule dans certains pays : vérifiez la vôtre dès maintenant.",
resultats: "2 à 3 mois.",
dureePrepa: "Plusieurs mois — le volume de kanji et de vocabulaire fait le niveau, pas la technique.",
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
sessions: "Environ 6 sessions par an en Corée, 2 à 3 à l'étranger selon les pays.",
resultats: "Environ 1 mois.",
dureePrepa: "8 à 12 semaines pour viser le niveau qui rapporte des points à votre bourse.",
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

/**
* Fiches pertinentes pour une langue d'enseignement du catalogue.
*
* Une chaîne peut citer plusieurs langues (« Français / Anglais selon la
* formation », « Turc ou anglais selon le programme, après une année
* préparatoire de turc ») : la PREMIÈRE langue citée décide. Jusqu'au
* 2026-09-28, c'était la première clé de TESTS_PAR_LANGUE, et l'anglais
* passait devant tout : 161 programmes du catalogue, dont les 65 de la
* famille Türkiye Bursları, recevaient IELTS malgré `turc: []` — la règle
* d'honnêteté de l'en-tête (année de langue incluse). L'allemand, le
* japonais et le coréen gardent un test d'anglais en second, pour les
* cursus anglophones.
*
* « SELON » (2026-09-29). « Français / Anglais selon la formation »
* (masters Eiffel) : la langue dépend du master, pas de l'ordre de la
* chaîne. Chaque autre langue citée apporte alors son premier test,
* sauf si la liste en a déjà un pour elle : « Français / Anglais selon
* la formation » → DELF/DALF, TCF, IELTS ; « Allemand / Anglais selon
* le cursus » reste TestDaF, IELTS. Sans « selon », la première langue
* décide seule. Une chaîne qui commence par le turc ne suggère toujours
* rien (règle d'honnêteté, année de langue incluse).
*/
export function testsPourLangue(langue) {
const l = String(langue || "").toLowerCase();
const citees = Object.keys(TESTS_PAR_LANGUE)
.map((cle) => ({ cle, position: l.indexOf(cle) }))
.filter((c) => c.position >= 0)
.sort((a, b) => a.position - b.position);
if (!citees.length) return [];
const fiche = (id) => TESTS.find((t) => t.id === id);
const fiches = TESTS_PAR_LANGUE[citees[0].cle].map(fiche).filter(Boolean);
if (!fiches.length || !/\bselon\b/.test(l)) return fiches;
for (const { cle } of citees.slice(1)) {
const deCetteLangue = (t) => t.langue.toLowerCase() === cle;
if (fiches.some(deCetteLangue)) continue;
const premier = TESTS_PAR_LANGUE[cle].map(fiche).find((t) => t && deCetteLangue(t));
if (premier) fiches.push(premier);
}
return fiches;
}

/**
* Langue d'enseignement par nom d'université (clé : le nom sans espaces
* de bord), pour les suggestions de test-prep.js. Le premier programme
* qui porte une langue décide pour son université.
*
* Reçoit le catalogue tel que le rend js/catalog-data.js : des objets
* simples { id, …champs }, que la source soit l'instantané ou Firestore.
* Jamais de .data() ici : c'est ce qui éteignait toutes les suggestions
* par langue depuis au moins le 2026-09-01 (trouvé le 2026-09-28,
* test/test-prep-langues.test.mjs).
*/
export function languesParNomUniversite(programmes, universites) {
const nomsParId = new Map(universites.map((u) => [u.id, (u.name || "").trim()]));
const langues = new Map();
programmes.forEach((p) => {
const nom = nomsParId.get(p.universityId);
if (nom && p.language && !langues.has(nom)) langues.set(nom, p.language);
});
return langues;
}

/**
* Les langues d'enseignement du catalogue, prêtes pour les candidatures :
* par programme (id → langue) et par nom d'université (ci-dessus).
*/
export function languesDuCatalogue(programmes, universites) {
return {
parProgramme: new Map(programmes.filter((p) => p.language).map((p) => [p.id, p.language])),
parNom: languesParNomUniversite(programmes, universites)
};
}

/**
* La langue d'enseignement d'UNE candidature, ou null.
*
* D'abord celle de SON programme : les candidatures choisies par Fitz
* portent son programId (lot FITZ-CHOISIT), et le rattrapage le pose sur
* les anciennes qu'il sait relier. À défaut, celle de son université, par
* le nom exact du catalogue. Par le nom seul, mesuré le 2026-09-28, 441
* programmes sur 828 recevaient la langue d'un AUTRE programme de la même
* université, et 334 d'autres tests que les leurs : Aix-Marseille + bourse
* France–Sénégal, programme en français, se voyait proposer IELTS.
*/
export function langueDeLaCandidature(app, langues) {
const duProgramme = app.programId ? langues.parProgramme.get(app.programId) : undefined;
return duProgramme || langues.parNom.get(String(app.university || "").trim()) || null;
}

/**
* Une langue du catalogue telle qu'elle s'écrit dans une phrase : noms de
* langues en minuscules, sigles gardés. « Allemand, niveau B2 exigé… »
* devient « allemand, niveau B2 exigé… », jamais « niveau b2 ».
*/
export function langueDansUnePhrase(langue) {
return String(langue || "").replace(/\p{L}+/gu, (mot) => (/^\p{Lu}\p{Ll}+$/u.test(mot) ? mot.toLowerCase() : mot));
}
