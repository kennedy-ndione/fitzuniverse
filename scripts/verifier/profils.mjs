/**
 * ============================================================
 * scripts/verifier/profils.mjs — les étudiants que le robot joue
 * ============================================================
 *
 * Un profil = une réponse par IDENTIFIANT de question (les mêmes clés
 * que celles de js/eligibility-pistes.js, et donc que celles écrites
 * dans sessionStorage à la fin du questionnaire). Le harnais lit
 * l'identifiant de la question affichée dans `#question[data-question]`
 * et cherche la valeur ici.
 *
 * DEUX RÈGLES QUI COMPTENT
 *
 *  - Une question rencontrée sans réponse ici FAIT ÉCHOUER le harnais.
 *    C'est voulu : le jour où une piste gagne une question, on veut
 *    l'apprendre par un échec explicite, pas par un profil incomplet
 *    envoyé au diagnostic.
 *  - Une réponse ici jamais rencontrée est signalée en fin de course.
 *    C'est le symptôme inverse : une question retirée d'une piste, ou
 *    un aiguillage qui ne mène plus là où on croit.
 *
 * Les valeurs de type « cartes » doivent être le LIBELLÉ EXACT de la
 * carte. Les valeurs de type « recherche » sont tapées telles quelles.
 * `average` est un nombre dans l'échelle choisie par `averageScale`.
 * ============================================================
 */

// Le tronc commun, identique d'un profil à l'autre : ce qui distingue
// les profils doit être le CYCLE, pas le décor.
const COMMUN = {
  country: "Sénégal",
  nationality: "Sénégalaise",
  english: "Bon niveau",
  french: "Courant / Langue maternelle",
  langCert: "Pas encore",
  timeline: "D'ici 1 an",
  destinationCountry: "France",
  goal: "Une bourse complète",
  passport: "Passeport valide",
  // Lot 112 : la question du genre. La réponse neutre ne ferme aucune
  // bourse : les profils restent comparables à ce qu'ils étaient.
  gender: "Je préfère ne pas répondre",
  averageScale: "20"
};

export const PROFILS = [

  {
    cle: "lycee",
    titre: "Élève au lycée, série scientifique, vise une licence",
    reponses: {
      ...COMMUN,
      currentLevel: "Au lycée",
      secondaryTrack: "Scientifique",
      secondaryExpected: "Cette année",
      studyCategory: "Informatique",
      average: 15,
      ageBracket: "Moins de 18 ans"
    }
  },

  {
    cle: "bac",
    titre: "Bachelier de l'année, série économique",
    reponses: {
      ...COMMUN,
      currentLevel: "Bac obtenu",
      secondaryTrack: "Économique & gestion",
      diplomaWhen: "Cette année",
      studyCategory: "Commerce",
      average: 13,
      ageBracket: "18 – 24 ans"
    }
  },

  {
    cle: "licence-en-cours",
    titre: "Étudiant en 3e année de licence, vise un master",
    reponses: {
      ...COMMUN,
      currentLevel: "Licence en cours",
      targetLevel: "Master",
      licenceYear: "3e année (ou dernière année)",
      licenceExpected: "Cette année",
      studyCategory: "Ingénierie",
      average: 14,
      ageBracket: "18 – 24 ans",
      admissionStatus: "Je prépare mes dossiers"
    }
  },

  {
    cle: "licence-obtenue",
    titre: "Titulaire d'une licence avec deux ans d'expérience, vise un master",
    reponses: {
      ...COMMUN,
      currentLevel: "Licence obtenue",
      targetLevel: "Master",
      diplomaWhen: "Il y a 1 à 2 ans",
      workExperience: "1 à 2 ans",
      studyCategory: "Sciences sociales",
      average: 14.5,
      ageBracket: "18 – 24 ans",
      admissionStatus: "Candidature(s) déposée(s)"
    }
  },

  {
    cle: "master-obtenu",
    titre: "Titulaire d'un master, vise un doctorat",
    reponses: {
      ...COMMUN,
      currentLevel: "Master obtenu",
      targetLevel: "Doctorat (PhD)",
      diplomaWhen: "Il y a 1 à 2 ans",
      workExperience: "2 à 5 ans",
      studyCategory: "Sciences",
      average: 16,
      ageBracket: "25 – 29 ans",
      researchProject: "Une idée précise, pas encore rédigée",
      supervisorContact: "Oui, un contact en cours",
      publications: "Pas encore"
    }
  },

  {
    cle: "doctorat-en-cours",
    titre: "Doctorant en 2e année",
    reponses: {
      ...COMMUN,
      currentLevel: "Doctorat en cours",
      phdYear: "2e année",
      studyCategory: "Médecine",
      average: 15,
      ageBracket: "30 – 34 ans",
      // Pas de `researchProject` ici : la question est explicitement
      // sautée pour qui est déjà en thèse (son sujet existe). Si elle
      // réapparaissait, le harnais échouerait — c'est le but.
      supervisorContact: "Oui, avec un accord écrit",
      publications: "Une fois"
    }
  }

];

export function profilParCle(cle) {
  return PROFILS.find((p) => p.cle === cle);
}
