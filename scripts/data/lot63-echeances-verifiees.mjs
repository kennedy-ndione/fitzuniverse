/**
 * ============================================================
 * LOT 63 — LES DEUX FICHES REVÉRIFIÉES À LA SOURCE (20 sept. 2026)
 * ============================================================
 *
 * Le lot ÉCHÉANCES du même jour a corrigé la RÈGLE : une date vérifiée
 * et dépassée ne peut plus faire dire « Candidatures ouvertes » à une
 * fiche. Il n'a pas corrigé les DONNÉES — c'est ce que fait ce lot-ci,
 * pour les deux fiches que l'audit nommait, chacune rouverte dans le
 * navigateur sur la page officielle, ce jour, citation à l'appui.
 *
 * CE QUE LA VÉRIFICATION A MONTRÉ
 * -------------------------------
 * 1. Sciences Po — Émile Boutmy. La fiche est un MASTER ; sa preuve
 *    portait sur le PREMIER CYCLE. La page officielle donne deux
 *    comités pour le master (19 octobre, 30 novembre) : la candidature
 *    est bel et bien ouverte aujourd'hui.
 *
 * 2. Sapienza PhD. La source enregistrée est une annonce de 2019
 *    toujours en ligne. L'appel vivant (cycle 42, 2026-2027) a fermé
 *    le 17 juin 2026. La fiche reste fermée, avec la bonne date.
 *
 * 3. Stipendium Hungaricum — RIEN À CORRIGER, et c'est un résultat.
 *    L'écart ISO/texte des 36 fiches (2026-01-15 contre « 15 janvier
 *    2027 ») n'est pas une erreur : la page officielle publie l'appel
 *    2026/2027, dont la fenêtre de dépôt était novembre-décembre 2025,
 *    et le 15 janvier 2027 est la clôture attendue du cycle suivant.
 *    L'écran dit déjà la vérité — « pas encore ouvertes, clôture
 *    annoncée le 15 janvier 2027 ». Aucun patch : une donnée juste ne
 *    se « corrige » pas.
 *
 * `parUid` porte le compte propriétaire parce que c'est lui qui a
 * validé ces deux relevés après lecture des citations — la session qui
 * a fait la recherche ne signe pas à sa place.
 *
 * DEUX PIÈGES RENCONTRÉS À LA PREMIÈRE ANALYSE, NOTÉS ICI
 * -------------------------------------------------------
 * 1. `sourceVerification` ne figure PAS dans `attendu`. Son sous-champ
 *    `le` est un serverTimestamp Firestore, que l'export rend en chaîne
 *    ISO : le lot, qui lit l'export, ne peut pas décrire ce que la
 *    garde lit en base. La garde porte donc sur `deadline`,
 *    `deadlineISO` et `ouverteVerifieeLe`.
 * 2. `le` est écrit ici en chaîne ISO, là où admin/verification.js
 *    écrit un serverTimestamp. Aucun code ne relit ce champ — seul
 *    l'export le traverse, et il en sort une chaîne dans les deux cas.
 * ============================================================
 */

export const PATCHES = [
  {
    "collection": "programs",
    "id": "sciences-po-paris__bourse-emile-boutmy",
    "attendu": {
      "deadline": "30 novembre 2026",
      "deadlineISO": "2026-01-20",
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "deadline": "Deux comités pour le master : 19 octobre (résultats avant le 30 décembre) ou 30 novembre (résultats avant le 2 mars). La demande de bourse se fait DANS le dossier d'admission à Sciences Po — jamais après l'admission.",
      "deadlineISO": "2026-11-30",
      "ouverteVerifieeLe": "2026-09-20",
      "sourceVerification": {
        "url": "https://www.sciencespo.fr/students/en/fees-funding/bursaries-financial-aid/emile-boutmy-scholarship/",
        "citation": "Deadline for master programme: 19 October (1st committee, results before December 30) or 30 November (2nd committee, results before March 2).",
        "le": "2026-09-20T21:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "LOT ÉCHÉANCES — revérifié à la source le 2026-09-20. La fiche est un MASTER, mais la citation qui lui servait de preuve portait sur le premier cycle (« Deadline for undergraduate programme […] January 20, 2026 »), d'où un deadlineISO au 20 janvier 2026 — passé — pendant que la prose annonçait le 30 novembre. La page officielle, lue ce jour, donne DEUX comités pour le master : 19 octobre et 30 novembre. Le 30 novembre est retenu comme deadlineISO parce que c'est la DERNIÈRE porte : fermer la fiche au 19 octobre priverait un étudiant du second comité. La candidature reste donc bien ouverte aujourd'hui."
  },
  {
    "collection": "programs",
    "id": "sapienza-phd",
    "attendu": {
      "deadline": "À confirmer selon l'appel à candidatures",
      "deadlineISO": "2019-04-01",
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "deadline": "Cycle 42 (année académique 2026-2027) clos le 17 juin 2026. L'appel du cycle suivant est publié au printemps sur la page des doctorats de la Sapienza.",
      "deadlineISO": "2026-06-17",
      "ouverteVerifieeLe": "2026-09-20",
      "sourceVerification": {
        "url": "https://www.uniroma1.it/en/pagina/phd-programmes",
        "citation": "Admissions to 2026-2027 PhD Programmes (deadline June 17)",
        "le": "2026-09-20T21:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "LOT ÉCHÉANCES — revérifié à la source le 2026-09-20. La fiche portait un deadlineISO au 1er avril 2019, sept ans en arrière, avec sa citation d'origine. Elle n'était pas fausse : la page enregistrée comme source est une ANNONCE DE 2019 toujours en ligne et jamais mise à jour (« The deadline is 1 april 2019 »). La source est donc remplacée par la page vivante des doctorats, qui annonce le cycle 42 pour 2026-2027 avec une clôture au 17 juin 2026 — passée. La fiche reste fermée, mais elle le dit maintenant avec la bonne date et la bonne preuve."
  },
  {
    "collection": "scholarships",
    "id": "sapienza-phd-scholarship",
    "attendu": {
      "status": "Ouverte",
      "officialWebsite": "https://www.uniroma1.it/en/notizia/phd-scholarships-foreign-candidates"
    },
    "champs": {
      "status": "Fermée",
      "officialWebsite": "https://www.uniroma1.it/en/pagina/phd-programmes",
      "verifieLe": "2026-09-20"
    },
    "motif": "LOT ÉCHÉANCES — même vérification que le programme. La bourse s'annonçait « Ouverte » alors que le cycle 2026-2027 est clos depuis le 17 juin, et son site officiel pointait sur l'annonce de 2019. Les deux sont corrigés, et la date de vérification est posée."
  }
];
