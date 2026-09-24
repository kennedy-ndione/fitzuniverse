// ============================================================
// FitzUniverse — Lot 78 : la bourse de doctorat du Canada (CGRS D)
// rattachée aux établissements canadiens du catalogue
// Recherche du 2026-09-24, sources officielles uniquement.
//
// POURQUOI
// La « Bourse d'études supérieures du Canada au doctorat (CGRS D,
// ex-Vanier) » était au catalogue SANS AUCUN PROGRAMME : invisible au
// moteur de recommandation, et absente de toutes les fiches
// d'établissement canadiennes. Après le lot 77 (Canada : 3 → 20
// établissements), Charles a demandé de relier les nouvelles
// canadiennes aux bourses canadiennes déjà au catalogue.
//
// LES AUTRES BOURSES CANADIENNES DU CATALOGUE ne sont pas concernées :
// Lester B. Pearson (Toronto), McGill Major Entrance et UBC International
// Scholars sont des bourses PROPRES à leur université, déjà reliées à
// elle. Les rattacher à d'autres établissements serait faux.
//
// CE QUE DIT LA SOURCE (CRSNG, page du programme, lue le 2026-09-24)
//   - la bourse se tient dans un établissement canadien admissible ;
//   - un candidat qui n'est ni citoyen ni résident permanent doit déjà
//     être inscrit en doctorat dans un établissement canadien admissible
//     à la date limite ; jusqu'à 15 % des bourses lui sont réservées ;
//   - l'établissement qui a un quota transmet les candidatures de ses
//     doctorants ; sinon, dépôt direct auprès de l'organisme.
//   https://nserc-crsng.canada.ca/en/funding-opportunity/canada-graduate-research-scholarship-doctoral-program
//
// PREUVE PAR ÉTABLISSEMENT : les listes officielles des quotas CGRS D
// du CRSNG et du CRSH, relues au navigateur le 2026-09-24. Les 19
// établissements retenus y figurent nommément (quota CRSNG / CRSH) :
//   Laval 58 / 60 · Montréal 45 / 92 · UQAM 9 / 88 · Sherbrooke 22 / 25
//   Polytechnique 15 / 3 · HEC Montréal 3 / 4 · UQTR 4 / 12
//   UQAC 3 / 3 · UQAR 3 / 4 · UQO 4 / 6 · ÉTS 4 / – · Concordia 14 / 60
//   Ottawa 55 / 72 · Moncton 4 / 3 · Alberta 45 / 49 · York 39 / 98
//   McGill 95 / 115 · Toronto 204 / 222 · UBC 139 / 113
//   https://nserc-crsng.canada.ca/en/canadian-institutions-nserc-quota-canada-graduate-research-scholarship-doctoral-program
//   https://sshrc-crsh.canada.ca/en/funding/opportunities/resources/canadian-institutions-with-cgrs-doctoral-quota.aspx
// Un quota se calcule sur les candidatures des trois derniers concours :
// l'établissement a donc des doctorants qui candidatent.
//
// ÉCARTÉE : l'Université de Saint-Boniface. Elle n'a pas de quota
// propre (le CRSH la compte avec l'University of Manitoba) et, surtout,
// elle n'offre AUCUN doctorat : sa page des programmes d'études
// supérieures ne cite qu'une maîtrise en études canadiennes et des
// maîtrises en éducation (https://ustboniface.ca/en/graduate, lue le
// 2026-09-24). Or la bourse exige d'être inscrit au doctorat.
//
// NIVEAU : Doctorat seulement (le seul niveau de la bourse).
//
// RUNNER : ce lot ne crée aucune université. Il vise des universités
// DÉJÀ EN BASE, ce que `analyser` sait faire depuis le 2026-09-24 :
// chaque université hors lot est relue en base, et le lot bloque si
// elle manque ou si elle n'est pas au « Canada » (garde pays stricte).
// ============================================================

export const LINKS = [
  {
    scholarshipId: "vanier-canada-graduate-scholarship",
    pays: "Canada",
    universityIds: [
      "universite-laval-quebec",
      "universite-de-montreal-montreal",
      "universite-du-quebec-a-montreal-montreal",
      "universite-de-sherbrooke-sherbrooke",
      "polytechnique-montreal-montreal",
      "hec-montreal-montreal",
      "universite-du-quebec-a-trois-rivieres-trois-rivieres",
      "universite-du-quebec-a-chicoutimi-saguenay",
      "universite-du-quebec-a-rimouski-rimouski",
      "universite-du-quebec-en-outaouais-gatineau",
      "ecole-de-technologie-superieure-montreal",
      "concordia-university-montreal",
      "universite-ottawa-ottawa",
      "universite-de-moncton-moncton",
      "university-of-alberta-edmonton",
      "york-university-toronto",
      "mcgill-university-montreal",
      "university-of-toronto-toronto",
      "university-of-british-columbia-vancouver"
    ],
    niveaux: ["Doctorat"],
    motif: "bourse fédérale tenue dans un établissement canadien admissible ; les 19 figurent nommément sur les listes des quotas CGRS D du CRSNG et du CRSH, relues le 2026-09-24 ; Saint-Boniface écartée, faute de doctorat"
  }
];
