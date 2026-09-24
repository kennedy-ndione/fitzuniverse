// ============================================================
// FitzUniverse — Lot 85 : le portail de candidature de quatre
// établissements roumains du lot 84 (2026-09-24, soir)
//
// POURQUOI
// `npm test` après le lot 84 : test/portails.test.mjs épingle la liste
// des universités SANS portail (chacune doit porter une voie
// d'admission). Quatre fiches du lot 84 étaient sans
// `applicationPortalUrl` : ASE Bucarest, UMF Carol-Davila, UMF Craiova,
// UAIC Iași. Ce n'était pas voulu : toutes les quatre reçoivent les
// candidatures des étrangers, et aucune des voies du vocabulaire fermé
// (AMCI, procédure nationale, dépôt sur place) ne les décrit.
//
// CE QUI EST POSÉ (relu au navigateur, 2026-09-24)
//   - UMF Carol-Davila : https://fsa.umfcd.ro/, lien « Portal Admitere »
//     de la page d'admission des étudiants internationaux.
//   - ASE, UMF Craiova, UAIC : aucune adresse de plateforme n'est
//     publiée en clair. L'ASE écrit que tout se dépose « through our
//     online platform » sans donner l'adresse ; l'UMF de Craiova parle
//     de sa « online admission platform » sans lien ; l'UAIC reçoit les
//     dossiers par son Bureau des relations internationales. Le portail
//     retenu est donc la PAGE OFFICIELLE D'ADMISSION DES CANDIDATS HORS
//     UE : c'est de là que part la candidature, et c'est ce que
//     l'abonné doit ouvrir. Pas d'adresse devinée.
// ============================================================

export const PATCHES = [
  {
    collection: "universities",
    id: "umf-carol-davila-bucarest",
    motif: "portail d'admission https://fsa.umfcd.ro/, lien « Portal Admitere » de la page d'admission des étudiants internationaux, relu au navigateur le 2026-09-24",
    attendu: { applicationPortalUrl: undefined },
    champs: { applicationPortalUrl: "https://fsa.umfcd.ro/" }
  },
  {
    collection: "universities",
    id: "academie-d-etudes-economiques-bucarest",
    motif: "adresse de la plateforme non publiée : page officielle d'admission des candidats hors UE, d'où part la candidature, relue au navigateur le 2026-09-24",
    attendu: { applicationPortalUrl: undefined },
    champs: { applicationPortalUrl: "https://international.ase.ro/21/admission-for-noneu-citizen/" }
  },
  {
    collection: "universities",
    id: "umf-craiova",
    motif: "adresse de la plateforme non publiée : page officielle d'admission des candidats internationaux 2026, relue au navigateur le 2026-09-24",
    attendu: { applicationPortalUrl: undefined },
    champs: { applicationPortalUrl: "https://www.umfcv.ro/en/admission-international-citizens-2026/admission-international-citizens-2026/english-teaching-modules-based-on-file-examination" }
  },
  {
    collection: "universities",
    id: "universite-alexandru-ioan-cuza-iasi",
    motif: "pas de plateforme, dossier au Bureau des relations internationales : page officielle « Application for nonEU citizens 2026-2027 », relue au navigateur le 2026-09-24",
    attendu: { applicationPortalUrl: undefined },
    champs: { applicationPortalUrl: "https://www.uaic.ro/en/international/international-students/full-degree-students/registration-for-non-eu-citizens/" }
  }
];
