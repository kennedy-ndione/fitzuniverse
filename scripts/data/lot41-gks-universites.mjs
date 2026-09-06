/**
 * ============================================================
 * LOT 41 — CONSOLIDATION DES UNIVERSITÉS : GKS (5 septembre 2026)
 * ============================================================
 *
 * Premier lot du chantier « rattacher les universités aux bourses
 * dont l'échéance est vérifiée ». Il ne crée AUCUNE université et
 * AUCUNE bourse : il rattache trois établissements DÉJÀ au catalogue
 * à une bourse DÉJÀ au catalogue.
 *
 * CE QUI EST VÉRIFIÉ, ET OÙ
 * -------------------------
 * studyinkorea.go.kr, lu le 2026-09-05. Le Global Korea Scholarship
 * publie DEUX listes d'universités désignées, et elles ne se
 * recouvrent pas :
 *   - GKS-U (licence) : Ajou, Daegu, Dong-A, Inje, Keimyung, Konyang,
 *     Kookmin, KOREATECH, Sungshin, Yeungnam — aucune au catalogue.
 *   - GKS-G (master et doctorat), universités de type A, citation
 *     exacte : « Seoul National University, KAIST (Korea Advanced
 *     Institute of Science and Technology), POSTECH (Pohang University
 *     of Science and Technology), Korea University, Yonsei University ».
 *
 * Korea University et Yonsei étaient déjà rattachées. Les trois autres
 * sont au catalogue depuis le lot 19 et n'étaient rattachées qu'à leurs
 * propres bourses d'établissement. Un étudiant qui visait SNU, KAIST ou
 * POSTECH ne voyait donc pas qu'il pouvait y aller avec le GKS.
 *
 * POURQUOI `niveaux` EXISTE DEPUIS CE LOT
 * ---------------------------------------
 * La bourse porte levels = [Licence, Master, Doctorat]. Sans
 * restriction, le runner aurait créé NEUF programmes, dont trois en
 * licence — trois liens faux, puisque SNU, KAIST et POSTECH ne sont pas
 * sur la liste GKS-U. `LINKS[].niveaux` (scripts/lot-validate.mjs,
 * ajouté le 2026-09-05, six tests dans test/lot-patches.test.mjs)
 * restreint la création aux cycles réellement ouverts. Six programmes,
 * donc, pas neuf.
 *
 * AUCUNE DATE N'EST ÉCRITE SUR CES PROGRAMMES, ET C'EST VOULU
 * -----------------------------------------------------------
 * Le GKS porte `echeanceVariable: "pays"` depuis le lot 40 : la date
 * limite est celle de l'ambassade de Corée du pays du candidat, ou de
 * l'université pour la voie directe. Un programme sans `deadline`
 * laisse donc etatCandidature() afficher « Selon votre pays » plutôt
 * qu'une date qui ne vaudrait pour personne. Écrire ici la date lue
 * pour un pays serait exactement le défaut corrigé au lot 40.
 *
 * LES TROIS UNIVERSITÉS SONT REDÉCLARÉES PAR OBLIGATION DU VALIDATEUR
 * ------------------------------------------------------------------
 * `validerLot` refuse un lien vers une université absente du lot. Les
 * entrées ci-dessous portent donc les DEUX champs obligatoires (name,
 * country) avec la valeur exacte déjà en base : `analyser` les
 * reconnaîtra « déjà en base, identique » et ne les réécrira pas. Si
 * l'une d'elles ressort en écart, c'est que la base a changé — dans ce
 * cas on ne force rien, on relit.
 * ============================================================
 */

export const UNIVERSITIES = [
  { id: "seoul-national-university-seoul", data: { name: "Seoul National University", country: "Corée du Sud" } },
  { id: "kaist-daejeon", data: { name: "KAIST (Korea Advanced Institute of Science and Technology)", country: "Corée du Sud" } },
  { id: "postech-pohang", data: { name: "POSTECH (Pohang University of Science and Technology)", country: "Corée du Sud" } }
];

export const LINKS = [
  {
    scholarshipId: "global-korea-scholarship",
    pays: "Corée du Sud",
    universityIds: [
      "seoul-national-university-seoul",
      "kaist-daejeon",
      "postech-pohang"
    ],
    niveaux: ["Master", "Doctorat"],
    language: "Anglais",
    motif:
      "studyinkorea.go.kr, lu le 2026-09-05 : les trois figurent sur la liste des universités désignées de type A du GKS-G (master et doctorat). " +
      "La licence est volontairement exclue : la liste GKS-U est différente et ne les contient pas."
  }
];
