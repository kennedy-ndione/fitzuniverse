// ============================================================
// FitzUniverse — Lot 77 : CANADA, de 3 à 20 établissements
// Recherche du 2026-09-24, sources officielles uniquement : sites des
// universités, quebec.ca, canada.ca (liste IRCC des établissements
// d'enseignement désignés), OUAC, topuniversities.com pour le seul
// classement mondial.
//
// POURQUOI
// Même demande que le lot 76 (Charles, 2026-09-24). Le Canada n'avait
// que McGill, Toronto et UBC : trois universités anglophones, parmi les
// plus chères du pays, alors que la clientèle du site est surtout
// francophone. Ce lot ajoute d'abord le Québec francophone (12), puis la
// francophonie hors Québec (Ottawa, Moncton, Saint-Boniface, le Campus
// Saint-Jean d'Alberta, Glendon à York).
//
// CONTRE-VÉRIFICATION INDÉPENDANTE (même jour, agent séparé + relecture
// au navigateur) : 19 affirmations, aucune contredite. Intégré ici :
//   - les 17 numéros d'EED lus sur la liste officielle IRCC
//     (dli-full-list-fr.json, chargée par la page canada.ca), tous
//     « Établissement public » ;
//   - les classements : topuniversities affiche désormais l'édition
//     QS 2027 (« ranked #… in QS World University Rankings 2027 »). On
//     écrit ce qui est affiché : Laval 526, UdeM 162, Sherbrooke
//     951-1000, Concordia 497, Ottawa 228, Alberta 96, York 322. Les
//     neuf fiches italiennes et suisses sont déjà en QS 2027 ;
//   - uOttawa : le mot « automatique » n'est pas écrit par l'université,
//     il est retiré, et la politique est « possible_plafonnee » : la
//     réduction ne vaut que pour les programmes en français ou en
//     immersion. « Exonération par défaut » aurait trompé qui étudie en
//     anglais ;
//   - UdeM : « systematique », seule université du lot dans ce cas. La
//     bourse d'exemption y est attribuée d'office à l'admission à tout
//     étudiant international à temps plein (sauf Français et Belges
//     francophones, qui paient déjà le tarif canadien) ; elle est
//     partielle, et le détail dit ce qui reste à payer ;
//   - UQO : 67 bourses d'exemption, maîtrise et doctorat seulement ;
//   - Saint-Boniface : 14 345 $ est le total des droits d'un étudiant
//     avec permis d'études (page Planification financière : « Droits de
//     scolarité 14 345 $ à 17 555 $ »), pas un supplément.
//
// QUÉBEC : le programme d'exemption « selon le programme d'études et la
// région » n'accorde plus de nouvelles exemptions depuis l'automne 2026 ;
// restent les ententes par pays (une quarantaine, dont le Sénégal, la
// Côte d'Ivoire, le Cameroun et le Maroc), en nombre limité.
//
// CHAMPS NOUVEAUX : province, langueEnseignement, numeroEED, admission
// (voir l'en-tête du lot 76 et js/fiche-universite.js).
//
// PHOTOS : scripts/add-lot76-photos.mjs (un script pour les deux lots).
// ============================================================

import { existsSync } from "node:fs";

const LE = "2026-09-24";

const LISTE_EED = "https://www.canada.ca/fr/immigration-refugies-citoyennete/services/etudier-canada/permis-etudes/preparer/liste-etablissements-enseignement-designes.html";
const QUEBEC_ENTENTES = "https://www.quebec.ca/education/etudier-quebec/aide-financiere-etudiants-internationaux/exemption-droits-scolarite-ententes";
const QUEBEC_REGION = "https://www.quebec.ca/education/etudier-quebec/aide-financiere-etudiants-internationaux/exemption-droits-scolarite-supplementaires-selon-programme-region";
const LAP = "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/get-documents/provincial-attestation-letter.html";
const PILOTE_FRANCOPHONE = "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/fmc-student-pilot/eligibility/participating-dlis.html";

// Phrases communes, écrites une fois.
const CAQ = "Une fois admis, il vous faut le certificat d'acceptation du Québec, le CAQ, puis le permis d'études du Canada.";
const ENTENTES = "Les citoyens d'une quarantaine de pays liés au Québec par une entente, dont le Sénégal, la Côte d'Ivoire, le Cameroun et le Maroc, peuvent être exemptés des droits supplémentaires, en nombre limité, sur recommandation de leur pays.";
const REGION_FERME = "Le programme québécois d'exemption selon le programme d'études et la région n'accorde plus de nouvelles exemptions depuis l'automne 2026.";
const LAP_HORS_QUEBEC = "Selon canada.ca, la lettre d'attestation provinciale, la LAP, est exigée pour le permis d'études au premier cycle ; depuis le 1er janvier 2026, les étudiants à la maîtrise ou au doctorat d'un établissement public en sont dispensés.";

export const UNIVERSITIES = [

  // ---------------- Québec, francophones ----------------

  {
    id: "universite-laval-quebec",
    data: {
      name: "Université Laval",
      city: "Québec",
      province: "Québec",
      country: "Canada",
      image: "quebec-chateau-frontenac.jpg",
      flag: "ca.svg",
      ranking: "#526 mondial (QS 2027)",
      officialWebsite: "https://www.ulaval.ca",
      applicationPortalUrl: "https://monportail.ulaval.ca",
      fields: ["Ingénierie", "Sciences", "Droit", "Médecine", "Sciences sociales", "Commerce", "Lettres", "Informatique", "Architecture", "Agriculture"],
      description: "Première université francophone d'Amérique, née du Séminaire de Québec fondé en 1663 et créée par charte royale en 1852. Ses facultés couvrent presque tous les domaines, de l'agriculture à la médecine, avec un enseignement en français.",
      langueEnseignement: "Français",
      numeroEED: "O19359011020",
      fraisScolarite: {
        source: "https://www.ulaval.ca/en/academics/tuition/international-students/undergraduate-programs/fall-2026-winter-2027",
        verifieLe: LE,
        note: "Grille officielle automne 2026 et hiver 2027, étudiant international. Au premier cycle, 103,92 $ de droits de base et 799,23 $ de droits supplémentaires par crédit, soit 903,15 $, donc 27 094,50 $ pour 30 crédits. Avec les frais obligatoires, la page affiche 933,53 $ par crédit. S'ajoutent par session de 15 crédits les frais administratifs, afférents, technologiques et le laissez-passer de transport : 14 116,48 $ par session au total. Assurance maladie obligatoire : environ 900 $ par an. Maîtrise sans mémoire : même tarif, 27 094,50 $ pour 30 crédits. Maîtrise avec mémoire : 711,62 $ par crédit. Montant retenu : scolarité seule pour 30 crédits, au baccalauréat et à la maîtrise sans mémoire.",
        licence: { montant: 27095, devise: "CAD", periode: "an" },
        master: { montant: 27095, devise: "CAD", periode: "an" }
      },
      exoneration: {
        politique: "possible_plafonnee",
        detail: `Les Français et les Belges francophones paient un tarif réduit grâce aux ententes du Québec. ${ENTENTES} Au doctorat, tous les étudiants internationaux à temps plein peuvent recevoir une bourse d'exemption et payer le tarif québécois, sur formulaire en ligne avant le 31 décembre pour l'automne. Les bourses d'exemption par programme au premier cycle, offertes de 2023 à 2025, ne sont plus accordées aux nouveaux admis. Les bourses Citoyennes et citoyens du monde, de 20 000 $ ou 30 000 $, visent la maîtrise avec recherche et le doctorat.`,
        source: "https://www.ulaval.ca/etudes/droits-de-scolarite/etudiant-de-linternational",
        verifieLe: LE
      },
      admission: {
        procedure: `Demande en ligne sur monPortail. Les démarches d'immigration prennent de 4 à 6 mois. ${CAQ}`,
        calendrier: "Pour l'automne, les candidats internationaux déposent leur demande au plus tard le 1er février. Le formulaire pour l'automne 2027 est ouvert depuis le 15 août 2026.",
        langue: "Il faut prouver sa maîtrise du français : un candidat qui n'a pas fait son primaire ou son secondaire en français passe le TCF tout public.",
        fraisDossier: "101,49 $ pour une admission à l'automne 2026, puis 104,53 $ à partir de l'hiver 2027.",
        sources: [
          "https://www.ulaval.ca/en/admission/apply-for-admission",
          "https://www.ulaval.ca/en/admission/apply-for-admission/admission-application-deadlines",
          "https://www.ulaval.ca/en/admission/prepare-your-application/french-proficiency",
          "https://www.ulaval.ca/sites/default/files/notre-universite/direction-gouv/Documents_officiels/Reglements/Reglement_frais_admission_inscription.pdf",
          QUEBEC_ENTENTES,
          LISTE_EED
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "universite-de-montreal-montreal",
    data: {
      name: "Université de Montréal",
      city: "Montréal",
      province: "Québec",
      country: "Canada",
      image: "montreal-oratoire-saint-joseph.jpg",
      flag: "ca.svg",
      ranking: "#162 mondial (QS 2027)",
      officialWebsite: "https://www.umontreal.ca",
      applicationPortalUrl: "https://admission.umontreal.ca/admission/depot-de-la-demande/demande-dadmission/",
      fields: ["Sciences", "Droit", "Médecine", "Sciences sociales", "Lettres", "Informatique", "Architecture"],
      description: "Université francophone ouverte en 1878 comme succursale de l'Université Laval et autonome depuis 1919. Elle compte 13 facultés et écoles, plus deux écoles affiliées, HEC Montréal et Polytechnique Montréal, et enseigne en français.",
      langueEnseignement: "Français",
      numeroEED: "O19359011045",
      fraisScolarite: {
        source: "https://registraire.umontreal.ca/droits-de-scolarite/couts/",
        verifieLe: LE,
        note: "Droits estimés pour 2026-2027, personne étudiante de l'international. Au premier cycle : 1 025,76 $ par crédit, le même pour tous les programmes, soit 30 772,80 $ pour 30 crédits. Maîtrise avec stage ou travail dirigé, et DESS : 777,92 $ par crédit, soit 23 337,60 $ pour 30 crédits. Maîtrise avec mémoire : 711,62 $ par crédit. Doctorat : 638,76 $ par crédit. S'ajoutent par trimestre à temps plein : services aux étudiants 201,75 $, centre sportif 108 $, frais technologiques 94,65 $, frais de gestion 168,75 $, plus les cotisations d'associations. L'assurance maladie est facturée à part. Montant retenu : scolarité seule pour 30 crédits, avant la bourse d'exemption, au baccalauréat et à la maîtrise avec stage ou travail dirigé.",
        licence: { montant: 30773, devise: "CAD", periode: "an" },
        master: { montant: 23338, devise: "CAD", periode: "an" }
      },
      exoneration: {
        politique: "systematique",
        detail: "La bourse d'exemption de l'UdeM est attribuée automatiquement à l'admission, selon les relevés de notes, aux étudiants internationaux à temps plein au baccalauréat, à la maîtrise ou au doctorat, sauf aux Français et aux Belges francophones. Au premier cycle, elle vaut 481,20 $ par crédit à l'échelon A, soit 14 436 $ par an, ou 229,32 $ par crédit à l'échelon B, soit 6 879,60 $ par an : il reste alors environ 16 337 $ ou 23 893 $ à payer pour 30 crédits. Les Français et les Belges francophones paient le tarif canadien au premier cycle. Les exemptions prévues par les ententes du Québec existent aussi, en nombre limité.",
        source: "https://registraire.umontreal.ca/droits-de-scolarite/bourse-exemption/",
        verifieLe: LE
      },
      admission: {
        procedure: `Demande en ligne sur le site d'admission de l'UdeM, étudiée après le paiement des frais. Comptez 3 à 6 mois pour les démarches d'immigration. ${CAQ}`,
        calendrier: "Pour l'automne, la date limite est le 1er février, au baccalauréat comme aux cycles supérieurs.",
        langue: "Le niveau de français exigé dépend du programme. Tests acceptés : TEF, TCF, DELF ou DALF, obtenus dans les 18 mois avant le trimestre visé, sauf si vos études antérieures ont été faites en français.",
        fraisDossier: "79,50 $ par trimestre, plus 22,25 $ par programme demandé, non remboursables. Un acompte de 1 000 $ est demandé aux étudiants internationaux admis au premier cycle ; il est remboursé si le CAQ ou le permis d'études est refusé.",
        sources: [
          "https://admission.umontreal.ca/admission/depot-de-la-demande/demande-dadmission/",
          "https://admission.umontreal.ca/admission/preparation-de-la-demande/respecter-les-dates-limites-de-depot/",
          "https://admission.umontreal.ca/objectif-udem/article/4-choses-a-savoir-sur-lexigence-de-francais-a-ladmission/",
          "https://admission.umontreal.ca/en/admissions/submitting-your-application/pay-the-application-fees/",
          "https://registraire.umontreal.ca/droits-de-scolarite/bourse-exemption/",
          LISTE_EED
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "universite-du-quebec-a-montreal-montreal",
    data: {
      name: "Université du Québec à Montréal (UQAM)",
      city: "Montréal",
      province: "Québec",
      country: "Canada",
      image: "montreal-quartier-des-spectacles.jpg",
      flag: "ca.svg",
      ranking: "Université publique fondée en 1969",
      officialWebsite: "https://uqam.ca",
      applicationPortalUrl: "https://www.apps.uqam.ca/Application/AdmissionEnLigne/Login/Login.aspx",
      fields: ["Commerce", "Droit", "Sciences", "Informatique", "Sciences sociales", "Lettres"],
      description: "Université publique francophone fondée en 1969 au centre-ville de Montréal, membre du réseau de l'Université du Québec. Elle réunit sept facultés et une école, dont l'École des sciences de la gestion, et enseigne en français.",
      langueEnseignement: "Français",
      numeroEED: "O19359011134",
      fraisScolarite: {
        source: "https://services-medias.uqam.ca/media/uploads/sites/30/2026/06/15123825/2026-2027_EI_C1.pdf",
        verifieLe: LE,
        note: "Grille officielle 2026-2027, étudiants internationaux, programmes de premier cycle : 103,92 $ de droits de base et 849,58 $ de droits supplémentaires par crédit, soit 953,50 $, donc 28 605 $ pour 30 crédits. Avec les frais institutionnels obligatoires, les associations et 655 $ d'assurances collectives, la grille estime 15 362,65 $ par trimestre. Maîtrise de type professionnel : 851,85 $ par crédit, donc 25 555,50 $ pour 30 crédits. Maîtrise de recherche : 711,62 $ par crédit. Montant retenu : scolarité seule pour 30 crédits, au baccalauréat et à la maîtrise de type professionnel.",
        licence: { montant: 28605, devise: "CAD", periode: "an" },
        master: { montant: 25556, devise: "CAD", periode: "an" }
      },
      exoneration: {
        politique: "possible_plafonnee",
        detail: `Au baccalauréat, l'exemption des droits supplémentaires passe par les ententes du Québec : Français et Belges francophones, et citoyens d'une quarantaine de pays, en nombre limité, choisis par le responsable des exemptions de leur pays. À la maîtrise, l'UQAM accorde automatiquement une bourse d'exonération de 100 $ par crédit, puis de 150 $ par crédit après 30 crédits, si les résultats sont satisfaisants. Au doctorat, la bourse couvre tous les droits supplémentaires, sans demande à faire.`,
        source: "https://bourses.uqam.ca/bourses-dexoneration-des-droits-majores-pour-les-etudiants-internationaux-aux-cycles-superieurs/",
        verifieLe: LE
      },
      admission: {
        procedure: `Demande en ligne sur le portail Admission en ligne de l'UQAM, pour un programme à temps complet. Prévoyez 3 à 6 mois pour l'immigration. ${CAQ}`,
        calendrier: "Pour l'automne, la date limite habituelle des candidats internationaux est le 1er mars, plus tôt pour certains programmes.",
        langue: "Au premier cycle, un test de français reconnu est exigé, TEF, TCF, DELF ou DALF, sauf pour les candidats de pays exemptés comme le Bénin, le Burkina Faso, les deux Congo, la Côte d'Ivoire, le Gabon, la Guinée, le Mali, le Niger, le Sénégal et le Togo. Un candidat du Cameroun fournit un test ou la preuve d'études faites entièrement en français.",
        fraisDossier: "155 $ pour un candidat international, tarif 2026, non remboursables, payés par carte de crédit.",
        sources: [
          "https://etudier.uqam.ca/admission",
          "https://www.apps.uqam.ca/Application/AdmissionEnLigne/Traitements/DatesLimites/AfficherDatesLimites.aspx?adm_web_cycle=1",
          "https://etudier.uqam.ca/exigence-tfi-pays-programmes-1er-cycle",
          "https://etudier.uqam.ca/frais-admission",
          "https://bourses.uqam.ca/droits-de-scolarite-exemption-pour-les-etudiantes-et-etudiants-internationaux-bac/",
          LISTE_EED
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "universite-de-sherbrooke-sherbrooke",
    data: {
      name: "Université de Sherbrooke",
      city: "Sherbrooke",
      province: "Québec",
      country: "Canada",
      image: "sherbrooke-vue-panoramique.jpg",
      flag: "ca.svg",
      ranking: "#951-1000 mondial (QS 2027)",
      officialWebsite: "https://www.usherbrooke.ca",
      applicationPortalUrl: "https://portail-admission.usherbrooke.ca/demande-admission",
      fields: ["Droit", "Commerce", "Ingénierie", "Lettres", "Sciences sociales", "Médecine", "Sciences", "Informatique"],
      description: "Université francophone de Sherbrooke, dont les premières facultés datent de 1954. Elle est connue pour son régime coopératif, qui alterne trimestres d'études et stages rémunérés, et enseigne en français.",
      langueEnseignement: "Français",
      numeroEED: "O19359011083",
      fraisScolarite: {
        source: "https://www.usherbrooke.ca/admission/couts-et-aide-financiere/frais-scolarite/personnes-etudiantes-internationales",
        verifieLe: LE,
        note: "Tarifs prévus pour 2026-2027, personne étudiante internationale, par trimestre de 15 crédits. Baccalauréat en arts, environnement, lettres, sciences humaines ou éducation : 11 505 $ de scolarité, 11 975 $ avec 470 $ de frais afférents. Baccalauréat en droit, gestion, génie, informatique, sciences pures, activité physique ou santé : 14 610 $, soit 15 080 $ avec les frais afférents. Maîtrise de type cours : 11 850 $ ou 13 035 $ selon les mêmes groupes ; maîtrise de recherche : 10 675 $. Un trimestre de stage coopératif coûte 550 $. Assurance maladie : environ 900 $ par an. Montant retenu : deux trimestres du groupe droit, gestion, génie, informatique, sciences et santé, qui couvre la plupart des programmes, scolarité seule : 29 220 $ au baccalauréat et 26 070 $ à la maîtrise de type cours.",
        licence: { montant: 29220, devise: "CAD", periode: "an" },
        master: { montant: 26070, devise: "CAD", periode: "an" }
      },
      exoneration: {
        politique: "possible_plafonnee",
        detail: `Tous les doctorants de recherche à temps complet sont exemptés et paient les mêmes droits que les Québécois. À la maîtrise, l'exemption dépend de la faculté, par exemple droit, gestion, médecine et santé, sciences, environnement, et quelques places en génie : elle se demande en ligne avant le 15 septembre pour l'automne, après avoir demandé l'exemption de votre pays s'il a une entente avec le Québec. Une bourse d'admission de 2 000 $ est déduite automatiquement au premier trimestre des nouveaux admis au baccalauréat et à la maîtrise de type cours, sauf les Français et les Belges francophones. ${REGION_FERME}`,
        source: "https://www.usherbrooke.ca/international/fr/etudier-a-udes/exemption-droits-scolarite-majores",
        verifieLe: LE
      },
      admission: {
        procedure: `Demande en ligne sur le portail d'admission de l'UdeS, jusqu'à 5 programmes, dont 2 programmes de grade. Comptez au moins 3 à 6 mois pour l'immigration. ${CAQ}`,
        calendrier: "Pour l'automne, la date limite habituelle au premier cycle pour les candidats internationaux est le 15 janvier, et le 1er novembre en médecine. Aux cycles supérieurs, elle varie selon la faculté.",
        langue: "Selon le programme, un français de niveau B2 à C2 est exigé, prouvé par le DELF, le DALF, le TCF, le TEF ou Bright. Un secondaire fait en France ou en Belgique en dispense.",
        fraisDossier: "106 $ par trimestre d'admission, non remboursables ; l'étude commence après le paiement.",
        sources: [
          "https://www.usherbrooke.ca/admission/da/deposer-demande",
          "https://www.usherbrooke.ca/admission/da/planifier-demande/dates-limites/1er-cycle",
          "https://www.usherbrooke.ca/admission/da/exigences-linguistiques/exigences-relatives-a-la-langue-francaise-pour-admission",
          "https://www.usherbrooke.ca/admission/da/liens-rapides/frais",
          QUEBEC_REGION,
          LISTE_EED
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "polytechnique-montreal-montreal",
    data: {
      name: "Polytechnique Montréal",
      city: "Montréal",
      province: "Québec",
      country: "Canada",
      image: "montreal-pont-jacques-cartier.jpg",
      flag: "ca.svg",
      ranking: "École d'ingénieurs fondée en 1873",
      officialWebsite: "https://www.polymtl.ca",
      applicationPortalUrl: "https://admission.polymtl.ca/admission-main-web/pages/admission-dashboard.xhtml",
      fields: ["Ingénierie", "Informatique"],
      description: "École d'ingénieurs fondée en 1873, la première école francophone d'ingénieurs en Amérique, affiliée à l'Université de Montréal depuis 1920 tout en restant autonome. Elle accueille plus de 11 000 étudiants et enseigne en français.",
      langueEnseignement: "Français",
      numeroEED: "O19359011070",
      fraisScolarite: {
        source: "https://etudiant.polymtl.ca/etudes/droits-de-scolarite/cout-des-etudes/baccalaureat",
        verifieLe: LE,
        note: "Grille du registrariat pour l'automne 2026, l'hiver 2027 et l'été 2027, étudiant étranger au baccalauréat : 103,92 $ de base et 1 023,65 $ de forfait additionnel par crédit, soit 1 127,57 $, donc 33 827,10 $ pour 30 crédits. La page des futurs étudiants annonce 32 990 $ pour deux trimestres de 15 crédits en 2026-2027 ; l'écart n'est pas expliqué, on retient la grille du registrariat. S'ajoutent par trimestre à temps plein : services aux étudiants 200,35 $, frais généraux 103,92 $, frais technologiques 98,83 $, association 35 $, et l'assurance maladie obligatoire de 900 $ par an. Maîtrise professionnelle et DESS : 1 127,57 $ par crédit ; maîtrise recherche : 8 005,73 $ par trimestre. Montant retenu : 30 crédits, au baccalauréat et à la maîtrise professionnelle.",
        licence: { montant: 33827, devise: "CAD", periode: "an" },
        master: { montant: 33827, devise: "CAD", periode: "an" }
      },
      exoneration: {
        politique: "possible_plafonnee",
        detail: `Tous les doctorants sont exemptés du forfait additionnel tant qu'ils respectent leurs échéances d'études. À la maîtrise, un nombre limité d'exemptions est offert, sur formulaire envoyé au registrariat. Les Français et les Belges francophones peuvent payer le tarif canadien non-résident, 10 713 $ par an au baccalauréat. ${ENTENTES}`,
        source: "https://etudiant.polymtl.ca/etudes/droits-de-scolarite/cout-des-etudes/etudes-superieures",
        verifieLe: LE
      },
      admission: {
        procedure: `Demande en ligne sur le portail d'admission de Polytechnique, une demande par niveau d'études. ${CAQ}`,
        calendrier: "Au baccalauréat, les candidats internationaux qui ont besoin du CAQ et du permis d'études déposent leur demande avant le 1er février pour l'automne, et leurs documents avant le 10 février.",
        langue: "Le français de niveau B2 est exigé si vos études n'ont pas été faites dans un système que Polytechnique reconnaît comme francophone, par exemple en France, en Belgique ou en Suisse : DELF B2, DALF C1 ou C2, TCF ou TEF avec au moins 400 points à chaque épreuve.",
        fraisDossier: "106,91 $ pour l'étude d'une demande d'admission, à partir de l'automne 2026, non remboursables, payés par carte Visa ou Mastercard.",
        sources: [
          "https://www.polymtl.ca/admission/tout-sur-ladmission-0/remplir-ma-demande",
          "https://www.polymtl.ca/admission/baccalaureat/dates-limites-de-reception-des-demandes-dadmission",
          "https://www.polymtl.ca/admission/baccalaureat/conditions-dadmission-au-baccalaureat/exigences-linguistiques",
          "https://etudiant.polymtl.ca/etudes/droits-de-scolarite/frais-administratifs",
          "https://www.polymtl.ca/renseignements-generaux/historique",
          LISTE_EED
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "hec-montreal-montreal",
    data: {
      name: "HEC Montréal",
      city: "Montréal",
      province: "Québec",
      country: "Canada",
      image: "montreal-stade-olympique.jpg",
      flag: "ca.svg",
      ranking: "Triple accréditation AACSB, EQUIS et AMBA",
      officialWebsite: "https://www.hec.ca",
      applicationPortalUrl: "https://enligne.hec.ca/psp/GAPET/HEL/PSFT_CS_HEL/?cmd=login&languageCd=CFR&GEN_USER=AEL",
      fields: ["Commerce"],
      description: "École de gestion francophone fondée en 1907 et affiliée à l'Université de Montréal, titulaire des trois accréditations AACSB, EQUIS et AMBA. Les cours sont en français, en anglais et en espagnol ; le B.A.A. se suit en français ou en bilingue.",
      langueEnseignement: "Français, anglais et espagnol",
      numeroEED: "O19359011058",
      fraisScolarite: {
        source: "https://www.hec.ca/etudiants/frais-de-scolarite/pdf/frais-de-scolarite-baa.pdf",
        verifieLe: LE,
        note: "Grille officielle automne 2026 et hiver 2027, B.A.A., tarif international : 1 077,43 $ par crédit, soit 32 322,90 $ pour 30 crédits. Frais institutionnels obligatoires : 910,89 $ par trimestre de 15 crédits, soit 34 144,68 $ par an au total. L'assurance maladie obligatoire des étudiants internationaux n'est pas comprise. Maîtrises en management, M. Sc. avec projet supervisé et LL.M. en fiscalité : 795,34 $ par crédit, soit 23 860,20 $ pour 30 crédits, plus 943,11 $ de frais par trimestre. Un candidat qui a moins de 12 années de scolarité entre au B.A.A. avec année préparatoire, soit 4 ans. Montant retenu : scolarité seule pour 30 crédits.",
        licence: { montant: 32323, devise: "CAD", periode: "an" },
        master: { montant: 23860, devise: "CAD", periode: "an" }
      },
      exoneration: {
        politique: "possible_plafonnee",
        detail: "Les Français et les Belges francophones paient le tarif canadien au B.A.A. et le tarif québécois aux cycles supérieurs. Les citoyens des pays qui ont une entente avec le Québec peuvent obtenir le tarif québécois au B.A.A., à la maîtrise, au MBA et au doctorat, en nombre limité et sur recommandation de leur pays. Des bourses d'excellence donnent aussi le tarif québécois au doctorat et en M. Sc. avec mémoire. Il faut étudier à temps plein et déposer ses documents dans HEC en ligne avant la fin du trimestre.",
        source: "https://www.hec.ca/etudiants/frais-de-scolarite/exemptions-international/index.html",
        verifieLe: LE
      },
      admission: {
        procedure: `Demande en ligne dans HEC en ligne, sur ordinateur, en 30 à 45 minutes, puis dépôt des documents en PDF dans les 5 jours ouvrables. Avec moins de 12 années de scolarité, vous passez par le B.A.A. avec année préparatoire. ${CAQ}`,
        calendrier: "Pour l'automne, les candidats hors Canada au B.A.A. déposent leur demande au plus tard le 1er février.",
        langue: "Il faut un français de niveau intermédiaire-avancé, prouvé par vos relevés de notes ou par un test de moins de 2 ans. Le parcours bilingue exige aussi l'anglais.",
        fraisDossier: "346,23 $ pour un candidat international au B.A.A., non remboursables.",
        sources: [
          "https://www.hec.ca/programmes/baccalaureats/baa/demande-admission",
          "https://www.hec.ca/programmes/baccalaureat/baa",
          "https://www.hec.ca/programmes/baccalaureat/baa-avec-annee-preparatoire",
          "https://www.hec.ca/a-propos",
          LISTE_EED
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "universite-du-quebec-a-trois-rivieres-trois-rivieres",
    data: {
      name: "Université du Québec à Trois-Rivières (UQTR)",
      city: "Trois-Rivières",
      province: "Québec",
      country: "Canada",
      image: "trois-rivieres-pont-laviolette.jpg",
      flag: "ca.svg",
      ranking: "Université publique du réseau UQ",
      officialWebsite: "https://www.uqtr.ca/",
      applicationPortalUrl: "https://oraprdnt.uqtr.uquebec.ca/pls/apex/f?p=adma000:101",
      fields: ["Ingénierie", "Informatique", "Sciences", "Commerce", "Sciences sociales", "Lettres"],
      description: "Université publique de langue française fondée en 1969, membre du réseau de l'Université du Québec. Elle compte plus de 15 000 étudiants, dont environ 3 000 internationaux venus de 78 pays, et enseigne en français.",
      langueEnseignement: "Français",
      numeroEED: "O19359011172",
      fraisScolarite: {
        source: "https://oraprdnt.uqtr.uquebec.ca/portail/finw006",
        verifieLe: LE,
        note: "L'UQTR ne publie pas de grille : montants lus dans son calculateur officiel, pour un étudiant non canadien inscrit à 15 crédits sur le campus. Baccalauréat en administration des affaires, automne 2026 : droits de scolarité 1 558,80 $ et frais majorés 11 345,25 $, soit 12 904,05 $ ; avec les frais afférents et les assurances, 13 675,15 $ à l'automne 2026 et 14 055,15 $ à l'hiver 2027, soit environ 27 730 $ pour l'année. L'assurance maladie des non-Canadiens coûte 300 $ à l'automne et 600 $ à l'hiver. MBA, automne 2026 : même tarif par crédit. Maîtrise en génie électrique avec mémoire à temps complet : 8 005,73 $ par trimestre, 8 700,83 $ avec les frais. Montant retenu : scolarité seule pour 30 crédits, soit deux trimestres de 12 904,05 $, au baccalauréat comme à la maîtrise sans mémoire.",
        licence: { montant: 25808, devise: "CAD", periode: "an" },
        master: { montant: 25808, devise: "CAD", periode: "an" }
      },
      exoneration: {
        politique: "possible_plafonnee",
        detail: `Au doctorat, l'UQTR accorde à tous les étudiants internationaux à temps complet une bourse d'exemption des frais majorés, sans demande : ils paient le tarif québécois, avec une moyenne d'au moins 3,5 sur 4,3 exigée à partir du 4e trimestre. La bourse Universalis Causa est versée automatiquement aux nouveaux étudiants internationaux : 6 000 $ en maîtrise avec mémoire et 21 000 $ au doctorat. ${REGION_FERME} Au baccalauréat, restent les exemptions par pays prévues dans les ententes du Québec, en nombre limité, et le tarif réduit des Français et des Belges francophones.`,
        source: "https://oraprdnt.uqtr.uquebec.ca/portail/gscw031?owa_no_fiche=16&owa_no_site=6756",
        verifieLe: LE
      },
      admission: {
        procedure: `Demande en ligne sur le portail d'admission de l'UQTR. Le dossier doit être complet, documents et paiement compris, avant la date limite. ${CAQ}`,
        calendrier: "Pour l'automne 2026, la date limite des étudiants internationaux était le 1er avril 2026 ; certains programmes ont une autre date.",
        langue: "L'UQTR fait passer son propre test de français en ligne, le TIFEI, après l'admission et avant le premier trimestre. Elle n'accepte aucun autre test, et un résultat faible oblige à suivre des cours de français.",
        fraisDossier: "54,87 $ non remboursables pour l'étude de la demande, plus un dépôt de 1 000 $ versé en même temps, qui sert d'avance sur les droits du premier trimestre. Les Français, les Belges francophones et les candidats au doctorat sont dispensés du dépôt.",
        sources: [
          "https://www.uqtr.ca/etudiants-internationaux/index.shtml",
          "https://oraprdnt.uqtr.uquebec.ca/pls/public/actw001i",
          "https://oraprdnt.uqtr.uquebec.ca/portail/gscw031?owa_no_site=932&owa_no_fiche=8",
          "https://www.uqtr.ca/paiement/index.shtml",
          QUEBEC_REGION,
          LISTE_EED
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "universite-du-quebec-a-chicoutimi-saguenay",
    data: {
      name: "Université du Québec à Chicoutimi (UQAC)",
      city: "Saguenay",
      province: "Québec",
      country: "Canada",
      image: "saguenay-chicoutimi-riviere-saguenay.jpg",
      flag: "ca.svg",
      ranking: "Université publique du réseau UQ",
      officialWebsite: "https://www.uqac.ca/",
      applicationPortalUrl: "https://admission.uqac.ca/",
      fields: ["Ingénierie", "Informatique", "Sciences", "Commerce", "Sciences sociales", "Lettres"],
      description: "Université publique de langue française ouverte en 1969 à Saguenay, membre du réseau de l'Université du Québec, avec aussi une école à Montréal. Elle compte environ 6 500 étudiants, dont une large part d'internationaux, et enseigne en français.",
      langueEnseignement: "Français",
      numeroEED: "O19359011122",
      fraisScolarite: {
        source: "https://www.uqac.ca/srf-docs/frais-scolarite-automne.pdf",
        verifieLe: LE,
        note: "Grille officielle « Droits de scolarité et autres frais, automne 2026, étudiants non canadiens ». Premier cycle : 820,47 $ par crédit, soit 103,92 $ de droits et 716,55 $ de montant forfaitaire. Exemple officiel pour 5 cours : 12 307,10 $ de droits et 516,05 $ de frais, soit 12 823,15 $. Maîtrise professionnelle, type A : même tarif de 820,47 $ par crédit. Maîtrise avec mémoire, type B : 711,62 $ par crédit. En plus : assurance maladie obligatoire des étudiants étrangers, 300 $ par trimestre. Montant retenu : scolarité seule pour 30 crédits au tarif de l'automne 2026, soit 24 614 $, au baccalauréat comme à la maîtrise professionnelle. La grille de l'hiver 2027 n'a pas été lue.",
        licence: { montant: 24614, devise: "CAD", periode: "an" },
        master: { montant: 24614, devise: "CAD", periode: "an" }
      },
      exoneration: {
        politique: "possible_plafonnee",
        detail: `Au doctorat, l'UQAC donne une bourse d'exemption des frais majorés dès le premier trimestre, avec une lettre de bourse utile pour le CAQ ; elle vaut environ 21 000 $ par an selon l'UQAC. En maîtrise avec mémoire, puis en maîtrise professionnelle, ces bourses sont attribuées sans formulaire, selon un quota et les résultats. La bourse couvre la part majorée : le reste des droits et des frais reste à payer. ${REGION_FERME} Au baccalauréat, restent les exemptions par pays prévues dans les ententes du Québec.`,
        source: "https://sae.uqac.ca/bourses-detudes/befm/",
        verifieLe: LE
      },
      admission: {
        procedure: `Demande en ligne sur le portail d'admission de l'UQAC, avec paiement par carte. Choisissez le statut « Visiteur(euse) avec permis de séjour ». ${CAQ}`,
        calendrier: "Selon la FAQ du registraire, le dossier complet doit arriver au plus tard le 1er mars pour l'automne, le 1er août pour l'hiver et le 16 décembre pour l'été. La page de dépôt du Bureau de l'international annonce, elle, que l'admission à l'automne 2027 ferme le 1er avril 2027, et une autre page cite le 1er février pour les programmes contingentés : visez la date la plus proche.",
        langue: "Si le français n'est pas votre langue maternelle, joignez un test de français reconnu par l'UQAC, de moins de 24 mois, quand le programme l'exige. Le baccalauréat français en dispense.",
        fraisDossier: "100 $ non remboursables pour les candidats internationaux, payés par carte Visa ou Mastercard ou par virement international.",
        sources: [
          "https://international.uqac.ca/etudier-a-luqac/comment-deposer-sa-demande-dadmission/",
          "https://www.uqac.ca/registraire/faq-admission/",
          "https://international.uqac.ca/etudier-a-luqac/sans-echange/",
          "https://www.uqac.ca/registraire/admission/tests-de-francais/",
          "https://www.uqac.ca/registraire/couts-dune-demande-dadmission/",
          LISTE_EED
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "universite-du-quebec-a-rimouski-rimouski",
    data: {
      name: "Université du Québec à Rimouski (UQAR)",
      city: "Rimouski",
      province: "Québec",
      country: "Canada",
      image: "rimouski-parc-du-bic.jpg",
      flag: "ca.svg",
      ranking: "Université publique du réseau UQ",
      officialWebsite: "https://www.uqar.ca/",
      applicationPortalUrl: "https://admission.uqar.ca/",
      fields: ["Sciences", "Ingénierie", "Informatique", "Commerce", "Sciences sociales", "Lettres"],
      description: "Université publique de langue française du réseau de l'Université du Québec, devenue université en 1973. Elle a deux campus, à Rimouski et à Lévis, est connue pour son Institut des sciences de la mer, et enseigne en français.",
      langueEnseignement: "Français",
      numeroEED: "O19359011159",
      fraisScolarite: {
        source: "https://www.uqar.ca/programmes-formations-et-admission/frais-de-scolarite/",
        verifieLe: LE,
        note: "Page officielle, montants indicatifs pour l'automne 2026, l'hiver 2027 et l'été 2027, étudiants internationaux. Ils comprennent l'assurance collective obligatoire de l'UQAR mais pas les assurances des associations étudiantes. Premier cycle, 15 crédits par trimestre : 12 275,93 $ par trimestre, soit 24 551,86 $ la première année, puis environ 3 % de plus chaque année. Maîtrise sans mémoire : 19 801,89 $ la première année, pour 24 crédits sur 3 trimestres. Maîtrise avec mémoire : 8 305,92 $ par trimestre, soit 24 917,76 $ la première année. Doctorat : 22 458,78 $ la première année. Montants retenus : première année du baccalauréat, de la maîtrise avec mémoire et du doctorat, tous avant exemption.",
        licence: { montant: 24552, devise: "CAD", periode: "an" },
        master: { montant: 24918, devise: "CAD", periode: "an" },
        doctorat: { montant: 22459, devise: "CAD", periode: "an" }
      },
      exoneration: {
        politique: "possible_plafonnee",
        detail: `Le programme d'excellence de l'UQAR exempte des droits supplémentaires les nouveaux étudiants internationaux en maîtrise avec mémoire ou au doctorat qui ont au moins 3,3 sur 4,3 de moyenne : ils paient le tarif québécois. Il n'y a aucune démarche, la réponse arrive avec la décision d'admission ; la page vise l'été 2027, l'automne 2027 et l'hiver 2028. ${REGION_FERME} Au baccalauréat, restent les exemptions par pays prévues dans les ententes du Québec, et le tarif québécois pour les Français et les Belges francophones admis dans les programmes ciblés.`,
        source: "https://www.uqar.ca/programmes-formations-et-admission/admission/etudiant-es-etrangers/admission-pour-etudiants-internationaux/programme-dexcellence-dexemption-des-droits-de-scolarite-supplementaires-exiges-des-etudiantes-et-etudiants-internationaux/",
        verifieLe: LE
      },
      admission: {
        procedure: `Demande en ligne sur le portail d'admission de l'UQAR, par le candidat lui-même. Un étudiant venant de l'étranger ne peut pas commencer à l'été. ${CAQ}`,
        calendrier: "Pour l'automne 2027, dépôt du 1er septembre 2026 au 1er mars 2027. Pour l'hiver 2027, le dépôt était ouvert du 1er avril au 1er août 2026.",
        langue: "Sauf dispense, par exemple un baccalauréat français, il faut un TEF ou un TCF avec au moins 460, ou Bright Language avec au moins 3,5, en compréhension écrite, compréhension orale et expression écrite. Un examen de français de l'UQAR suit l'admission.",
        fraisDossier: "90,28 $, payables au dépôt de la demande et non remboursables.",
        sources: [
          "https://www.uqar.ca/programmes-formations-et-admission/admission/etudiant-es-etrangers/admission-pour-etudiants-internationaux/",
          "https://www.uqar.ca/programmes-formations-et-admission/frais-de-scolarite/",
          QUEBEC_ENTENTES,
          LISTE_EED
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "universite-du-quebec-en-outaouais-gatineau",
    data: {
      name: "Université du Québec en Outaouais (UQO)",
      city: "Gatineau",
      province: "Québec",
      country: "Canada",
      image: "gatineau-musee-canadien-histoire.jpg",
      flag: "ca.svg",
      ranking: "Université publique du réseau UQ",
      officialWebsite: "https://uqo.ca/",
      applicationPortalUrl: "https://admission.uqo.ca/",
      fields: ["Informatique", "Ingénierie", "Droit", "Commerce", "Sciences sociales", "Sciences"],
      description: "Université publique de langue française du réseau de l'Université du Québec, créée en 1981 sous le nom d'Université du Québec à Hull et appelée UQO depuis 2002. Elle a des campus à Gatineau et à Saint-Jérôme, et enseigne en français.",
      langueEnseignement: "Français",
      numeroEED: "O19359011146",
      fraisScolarite: {
        source: "https://uqo.ca/sites/default/files/2026-08/420934608droits-de-scolarite-et-frais-afferents-etudiants-internationaux-1er-cycle.pdf",
        verifieLe: LE,
        note: "Grilles officielles 2026-2027, automne 2026, hiver 2027 et été 2027, étudiants internationaux. Premier cycle : 103,92 $ de droits et 720,64 $ de montant forfaitaire, soit 824,56 $ par crédit. Maîtrise de profil professionnel, classe A : même tarif. Maîtrise de profil recherche, classe B : 8 005,73 $ par trimestre pendant 4 trimestres, puis 70 $ par trimestre. Frais afférents pour 15 crédits : environ 370 $ par trimestre. Assurance maladie obligatoire des étudiants internationaux : 900 $ par an en 2026-2027. Montant retenu : scolarité seule pour 30 crédits, soit 24 737 $, au baccalauréat comme à la maîtrise professionnelle.",
        licence: { montant: 24737, devise: "CAD", periode: "an" },
        master: { montant: 24737, devise: "CAD", periode: "an" }
      },
      exoneration: {
        politique: "possible_plafonnee",
        detail: "L'UQO dispose de 67 bourses d'exemption pour 2026-2027 : l'étudiant paie alors le tarif québécois. Depuis l'été 2026, elles sont réservées aux étudiants internationaux à temps complet en maîtrise ou au doctorat ; le baccalauréat en est exclu. Il faut une moyenne cumulative d'au moins 3,00, au moins 9 crédits réussis en maîtrise professionnelle ou un trimestre en maîtrise avec mémoire, et être dans une situation humanitaire ou financière précaire. La demande se fait en ligne : pour l'hiver 2027, du 3 novembre 2026 au 18 janvier 2027.",
        source: "https://uqo.ca/international/bourse-dexemption-pour-personnes-etudiantes-internationales",
        verifieLe: LE
      },
      admission: {
        procedure: `Demande en ligne sur le portail d'admission de l'UQO. ${CAQ}`,
        calendrier: "Pour l'automne, la date limite des candidats internationaux est le 1er mars, et elle peut varier selon le programme ; le formulaire ouvre le 1er octobre. Pour l'hiver 2027 au premier cycle à Gatineau, la date limite était le 1er août 2026.",
        langue: "Les cours sont en français. Sauf dispense, les nouveaux étudiants passent le test de français SEL-B pendant leur premier trimestre.",
        fraisDossier: "120 $ pour un candidat international selon le règlement de l'UQO : 60 $ pour une demande en ligne et 60 $ de frais supplémentaires pour l'international. Un crédit de 60 $ est appliqué aux droits du premier trimestre si vous vous inscrivez.",
        sources: [
          "https://uqo.ca/etudiants/admission-etudiants-internationaux",
          "https://uqo.ca/etudiants/admission/dates-limites-admission",
          "https://uqo.ca/etudiants/hiver-premier-cycle-gatineau",
          "https://uqo.ca/etudiants/etudier-l-uqo/politique-sur-la-qualite-du-francais",
          "https://uqo.ca/sites/default/files/a034b24e20a7461eb732f02299eba9e0206d756freglement-relatif-aux-droits-de-scolarite-et-autres-frais.pdf",
          LISTE_EED
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "ecole-de-technologie-superieure-montreal",
    data: {
      name: "École de technologie supérieure (ÉTS)",
      city: "Montréal",
      province: "Québec",
      country: "Canada",
      image: "montreal-canal-de-lachine.jpg",
      flag: "ca.svg",
      ranking: "École publique de génie du réseau UQ",
      officialWebsite: "https://www.etsmtl.ca/",
      applicationPortalUrl: "https://etsmtl-admission.omnivox.ca/adm/",
      fields: ["Ingénierie", "Informatique"],
      description: "École publique de génie du réseau de l'Université du Québec, fondée en 1974 à Montréal. Elle donne une formation appliquée en lien étroit avec l'industrie, avec des stages en entreprise pendant le baccalauréat, et enseigne en français.",
      langueEnseignement: "Français",
      numeroEED: "O19359201210",
      fraisScolarite: {
        source: "https://www.etsmtl.ca/etudier-a-lets/bourses-finance-et-budget/cout-des-etudes",
        verifieLe: LE,
        note: "Page officielle, montants de l'année 2026-2027 pour un étudiant international. Baccalauréat : 103,92 $ et 1 067,26 $ de montant forfaitaire, soit 1 171,18 $ par crédit ; l'ÉTS estime une année à 38 950 $ pour 30 crédits et 9 crédits de stage, et le baccalauréat entier à 165 100 $. Maîtrise professionnelle, M. Ing. ou DESS : 1 001,79 $ par crédit, environ 28 920 $ par an selon l'ÉTS. Maîtrise recherche : 711,62 $ par crédit. Doctorat : 103,92 $ par crédit grâce à l'exemption automatique, environ 4 680 $ par an. En plus : frais généraux, frais technologiques, assurance étudiante et assurance maladie obligatoire de 900 $ par an. Montants retenus : scolarité seule pour 30 crédits, soit 35 135 $ au baccalauréat et 30 054 $ en M. Ing., et l'estimation annuelle de l'ÉTS pour le doctorat.",
        licence: { montant: 35135, devise: "CAD", periode: "an" },
        master: { montant: 30054, devise: "CAD", periode: "an" },
        doctorat: { montant: 4680, devise: "CAD", periode: "an" }
      },
      exoneration: {
        politique: "possible_plafonnee",
        detail: "Au doctorat à temps complet, l'ÉTS exempte automatiquement tous les étudiants du montant forfaitaire, sauf ceux qui ont déjà une bourse du gouvernement qui le couvre. En maîtrise, depuis l'été 2025, l'exemption des frais majorés est accordée selon l'excellence, sans concours : au moins 9 crédits, dans les 4 premières sessions, aucun échec, 3 exemptions au plus. Au baccalauréat, l'ÉTS n'a pas d'exemption propre : restent les ententes du Québec par pays et le tarif réduit des Français et des Belges francophones.",
        source: "https://www.etsmtl.ca/actualites/changements-pour-lexemption-frais-majores-maitrise",
        verifieLe: LE
      },
      admission: {
        procedure: `Demande en ligne sur le portail Omnivox de l'ÉTS. La réponse arrive en général au plus tard 4 semaines après la date limite. ${CAQ}`,
        calendrier: "Dates limites des étudiants internationaux : 1er mars pour l'automne, 15 mai au doctorat ; 1er juillet pour l'hiver, 15 septembre au doctorat ; 1er décembre pour l'été, 15 janvier au doctorat.",
        langue: "Au baccalauréat, il faut prouver son français : des études réussies en français dispensent de test les candidats de pays comme le Bénin, le Burkina Faso, le Cameroun en système français, la Côte d'Ivoire, la Guinée, le Mali, le Niger, le Sénégal ou le Togo ; sinon TCF C1, DELF B2, DALF C1 ou TFI 800. En maîtrise avec mémoire et au doctorat, le français ou l'anglais est accepté.",
        fraisDossier: "141 $ pour les candidats internationaux, payables par carte Visa ou Mastercard, non remboursables.",
        sources: [
          "https://www.etsmtl.ca/etudier-a-lets/admission",
          "https://www.etsmtl.ca/etudier-a-lets/inscription-aux-cours/politique-linguistique",
          "https://www.etsmtl.ca/etudier-a-lets/bourses-finance-et-budget/cout-des-etudes",
          LISTE_EED
        ],
        verifieLe: LE
      }
    }
  },

  // ---------------- Québec, anglophone ----------------

  {
    id: "concordia-university-montreal",
    data: {
      name: "Concordia University",
      city: "Montréal",
      province: "Québec",
      country: "Canada",
      image: "montreal-habitat-67.jpg",
      flag: "ca.svg",
      ranking: "#497 mondial (QS 2027)",
      officialWebsite: "https://www.concordia.ca/",
      applicationPortalUrl: "https://campus.concordia.ca/psc/pscsprd/EMPLOYEE/SA/c/CU_MODS.CU_AD_WEB_APP_ADM.GBL",
      fields: ["Ingénierie", "Informatique", "Commerce", "Sciences", "Sciences sociales", "Lettres"],
      description: "Université publique anglophone de Montréal, fondée en 1974 par la fusion du Loyola College et de la Sir George Williams University. Elle réunit arts et sciences, beaux-arts, génie et informatique, et une école de commerce. Enseignement en anglais.",
      langueEnseignement: "Anglais",
      numeroEED: "O19359011007",
      fraisScolarite: {
        source: "https://www.concordia.ca/students/financial/tuition-fees/rates/undergrad.html",
        verifieLe: LE,
        note: "Tarifs officiels des étudiants internationaux au premier cycle, automne 2026 et hiver 2027, par crédit : Arts and Science 1 160 $, Engineering and Computer Science 1 285 $, John Molson School of Business 1 400 $. Pour 30 crédits : 34 800 $ en Arts and Science, 38 550 $ en génie et informatique, 42 000 $ en commerce. Maîtrise sans mémoire, cohorte 2026-2027, tarif fixe pendant tout le programme : 795 $ par crédit, 1 290 $ à la JMSB. Maîtrise avec mémoire : 711,62 $ par crédit ; doctorat : 638,76 $ par crédit. En plus : frais universitaires d'environ 36 $ par crédit au premier cycle, et une assurance santé de 873 $ de septembre à avril ou de 1 164 $ pour 12 mois. Montants retenus : 30 crédits en Arts and Science, et 30 crédits de maîtrise sans mémoire hors JMSB.",
        licence: { montant: 34800, devise: "CAD", periode: "an" },
        master: { montant: 23850, devise: "CAD", periode: "an" }
      },
      exoneration: {
        politique: "possible_plafonnee",
        detail: "Concordia applique les exemptions prévues par le Québec : les Français et les Belges francophones paient le tarif canadien au premier cycle et le tarif québécois aux cycles supérieurs. Les étudiants de pays qui ont une entente avec le Québec peuvent obtenir le tarif québécois s'ils sont recommandés par le ministère de leur pays, en nombre limité. L'exemption liée aux programmes en français ne s'applique pas aux étudiants internationaux. La demande d'exemption se fait au plus tard le dernier jour de cours du trimestre, sans effet rétroactif.",
        source: "https://www.concordia.ca/students/financial/tuition-fees/rates/international-fee-exemptions.html",
        verifieLe: LE
      },
      admission: {
        procedure: `Demande en ligne sur le portail de Concordia. Les titulaires d'un baccalauréat africain de système français, du Sénégal, de Côte d'Ivoire ou du Cameroun par exemple, entrent dans un programme prolongé de 120 crédits. ${CAQ}`,
        calendrier: "Au premier cycle, les étudiants internationaux déposent leur demande au plus tard le 1er février pour l'automne et le 1er août pour l'hiver. Aux cycles supérieurs, les dates varient selon le programme.",
        langue: "Anglais, sauf dispense : TOEFL iBT 70, IELTS Academic 6 sans note sous 5,5, Duolingo 105 ou un test équivalent, de moins de 2 ans.",
        fraisDossier: "100 $ au premier cycle, non remboursables et sans dispense, payés par carte de crédit.",
        sources: [
          "https://www.concordia.ca/admissions/undergraduate/apply-now.html",
          "https://www.concordia.ca/admissions/undergraduate/apply.html",
          "https://www.concordia.ca/admissions/undergraduate/international/africa.html",
          "https://www.concordia.ca/admissions/undergraduate/requirements/english-language-proficiency.html",
          LISTE_EED
        ],
        verifieLe: LE
      }
    }
  },

  // ---------------- Hors Québec : francophonie et bilinguisme ----------------

  {
    id: "universite-ottawa-ottawa",
    data: {
      name: "Université d'Ottawa",
      city: "Ottawa",
      province: "Ontario",
      country: "Canada",
      image: "ottawa-canal-rideau.jpg",
      flag: "ca.svg",
      ranking: "#228 mondial (QS 2027)",
      officialWebsite: "https://www.uottawa.ca/",
      applicationPortalUrl: "https://www.ouac.on.ca/apply/dashboard/en_CA/user/login",
      fields: ["Lettres", "Sciences sociales", "Sciences", "Ingénierie", "Médecine", "Droit", "Commerce"],
      description: "Université ontarienne qui se présente comme la plus grande université bilingue français-anglais au monde, avec environ 49 000 étudiants. Vous pouvez y étudier en français ou en anglais.",
      langueEnseignement: "Français et anglais",
      numeroEED: "O19397188593",
      fraisScolarite: {
        source: "https://www.uottawa.ca/study/fees-financial-support/university-fees/estimating-total-university-fees",
        verifieLe: LE,
        note: "Exemples officiels 2026-2027 pour un étudiant international à temps plein en première année. Baccalauréat : 31 582,15 $ de droits de scolarité par trimestre, soit 63 164,30 $ pour deux trimestres. Maîtrise ou diplôme d'études supérieures : 9 815,26 $ par trimestre, soit 29 445,78 $ pour trois trimestres. L'université ne dit pas à quel programme correspondent ces exemples. S'ajoutent l'assurance maladie universitaire, 316 $ par trimestre, le laissez-passer de transport et des frais accessoires. Montants retenus : ces exemples officiels, avant la bourse d'exonération des études en français.",
        licence: { montant: 63164, devise: "CAD", periode: "an" },
        master: { montant: 29446, devise: "CAD", periode: "an" }
      },
      exoneration: {
        politique: "possible_plafonnee",
        detail: "Réservée aux études en français, la bourse d'exonération partielle des droits différentiels vise les étudiants internationaux admis dans un programme offert en français ou dans un programme en anglais avec le régime d'immersion en français. Au baccalauréat, elle est accordée si vous êtes à temps plein et suivez au moins trois cours en français par trimestre, soit 9 unités. Exemple donné par l'université pour 2024-2025 à la Faculté des arts : 21 667,54 $ de droits au trimestre d'automne, moins 12 500 $ de bourse. À la maîtrise, elle vaut de 5 500 $ à 11 000 $ par trimestre selon la faculté, pendant deux ans au plus, et se demande en ligne. Un programme suivi en anglais n'y donne pas droit.",
        source: "https://www.uottawa.ca/study/fees-financial-support/differential-tuition-fee-exemption-scholarship",
        verifieLe: LE
      },
      admission: {
        procedure: `Au premier cycle, les candidats internationaux déposent leur demande sur le formulaire du Centre de demande d'admission aux universités de l'Ontario, l'OUAC. Après votre dépôt d'admission, l'université vous envoie la lettre d'attestation provinciale. ${LAP_HORS_QUEBEC} L'université participe aussi au programme pilote d'IRCC pour les étudiants dans les communautés francophones en situation minoritaire.`,
        calendrier: "Le formulaire ouvre en septembre. L'université conseille de postuler avant le 15 janvier pour la rentrée d'automne.",
        langue: "Programmes en français : DELF B2 avec au moins 16 sur 25 en production écrite, DALF C1, TCF B2 ou TEF B2. Vous en êtes dispensé si vous avez fait au moins trois ans d'études à temps plein dans un pays francophone où le français est la seule langue d'enseignement. Programmes en anglais : IELTS Academic 6,5 ou TOEFL iBT 86.",
        fraisDossier: "Formulaire OUAC : 159 $ pour trois choix de programme, 51 $ par choix supplémentaire, plus 93 $ de frais d'évaluation des documents pour l'Université d'Ottawa.",
        sources: [
          "https://www.uottawa.ca/study/undergraduate-studies/international-applicants",
          "https://www.uottawa.ca/study/undergraduate-studies/language-requirements",
          "https://www.ouac.on.ca/guide/105-fees/",
          LAP,
          PILOTE_FRANCOPHONE,
          LISTE_EED
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "universite-de-moncton-moncton",
    data: {
      name: "Université de Moncton",
      city: "Moncton",
      province: "Nouveau-Brunswick",
      country: "Canada",
      image: "moncton-centre-ville.jpg",
      flag: "ca.svg",
      ranking: "Université francophone du Nouveau-Brunswick",
      officialWebsite: "https://www.umoncton.ca/",
      applicationPortalUrl: "https://umonctonca.elluciancrmrecruit.com/Apply/Account/Create",
      fields: ["Commerce", "Lettres", "Sciences sociales", "Droit", "Ingénierie", "Sciences", "Informatique"],
      description: "Université de langue française fondée en 1963 pour permettre aux Acadiens de faire des études universitaires. Elle a trois campus au Nouveau-Brunswick, à Moncton, Edmundston et Shippagan, et l'enseignement s'y donne en français.",
      langueEnseignement: "Français",
      numeroEED: "O19391556532",
      fraisScolarite: {
        source: "https://www.umoncton.ca/international/frais",
        verifieLe: LE,
        note: "Grille 2026-2027 pour les étudiants internationaux, année de 8 mois, donnée à titre indicatif. Premier cycle : 15 761 $ de droits de scolarité, plus 726 $ de frais afférents, 1 296 $ d'assurance maladie et 56 $ d'assurance dentaire, soit 17 839 $ ; 18 147 $ en ingénierie, 18 689 $ en sciences infirmières et 19 839 $ au Juris Doctor. Cycles supérieurs 2026-2027 : 579 $ par crédit de cours et 486 $ par crédit de thèse, plus 1 296 $ d'assurance maladie. Montants retenus : 15 761 $ au premier cycle ; 17 370 $ à la maîtrise, calculés sur 30 crédits de cours à 579 $.",
        licence: { montant: 15761, devise: "CAD", periode: "an" },
        master: { montant: 17370, devise: "CAD", periode: "an" }
      },
      exoneration: {
        politique: "possible_plafonnee",
        detail: "Les bourses Abdou-Diouf récompensent des étudiants de pays du Sud membres de la Francophonie, dont le Sénégal, la Côte d'Ivoire, le Cameroun, le Mali et le Maroc. Au premier cycle, il y en a une par campus ; elle valait 6 685 $ en 2024-2025, n'est pas renouvelable et se demande au service des bourses avant la mi-avril, avec relevés de notes et lettre d'appui. Au campus de Shippagan, une bourse d'accueil de 2 000 $ accompagne automatiquement l'offre d'admission des nouveaux étudiants internationaux au premier cycle. La page des frais ne mentionne aucune exemption des droits de scolarité.",
        source: "https://www.umoncton.ca/institutionnel/modules/bourses/bourses_print.php?id=109",
        verifieLe: LE
      },
      admission: {
        procedure: `Demande en ligne sur le portail de l'université, documents en PDF. Pour le permis d'études, deux voies : le programme pilote d'IRCC pour les étudiants dans les communautés francophones en situation minoritaire, ou un permis associé à une lettre d'attestation provinciale du Nouveau-Brunswick, obtenue après un dépôt versé à l'université. ${LAP_HORS_QUEBEC}`,
        calendrier: "Pour les candidats internationaux, au premier cycle comme à la maîtrise et au doctorat : 31 mai pour la session d'automne, 30 septembre pour la session d'hiver. L'université peut fermer plus tôt.",
        langue: "Aux cycles supérieurs, un candidat non francophone présente un TCF ou un TFI de niveau B2, ou un DALF ou un TEF de niveau C1, sauf s'il a fait ses études secondaires et un premier diplôme universitaire en français.",
        fraisDossier: "300 $ non remboursables ; 230 $ sont ensuite crédités sur les frais universitaires.",
        sources: [
          "https://www.umoncton.ca/demande-admission",
          "https://www.umoncton.ca/processus-d%E2%80%99admission-pour-%C3%A9tudiants-internationaux",
          "https://www.umoncton.ca/admission/dates-importantes",
          "https://www.umoncton.ca/permis-etudes-lap",
          "https://www.umoncton.ca/institutionnel/modules/repertoire/pdf/UMoncton-Politique-linguistique-Annexe-B.pdf",
          LAP,
          LISTE_EED
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "universite-de-saint-boniface-winnipeg",
    data: {
      name: "Université de Saint-Boniface",
      city: "Winnipeg",
      province: "Manitoba",
      country: "Canada",
      image: "winnipeg-la-fourche-riviere-rouge.jpg",
      flag: "ca.svg",
      ranking: "Université francophone du Manitoba",
      officialWebsite: "https://ustboniface.ca/",
      applicationPortalUrl: "https://monusb.azurewebsites.net/register",
      fields: ["Lettres", "Sciences", "Commerce", "Sciences sociales"],
      description: "Université de langue française du Manitoba, fondée en 1818 : c'est le plus ancien établissement postsecondaire de l'Ouest canadien. Elle a obtenu le statut d'université à part entière en 2011 et enseigne en français.",
      langueEnseignement: "Français",
      numeroEED: "O19126670302",
      fraisScolarite: {
        source: "https://ustboniface.ca/sites/default/files/2026-08/Frais-USB.pdf",
        verifieLe: LE,
        note: "Tableau officiel automne 2026 et hiver 2027, tarif des étudiants avec permis d'études, coût estimatif pour 30 crédits : arts et traduction 14 345 $, éducation 14 830 $, sciences 15 415 $, travail social 15 850 $, administration des affaires 16 455 $. La page Planification financière confirme qu'il s'agit du total des droits pour un étudiant avec permis d'études : de 14 345 $ à 17 555 $ par an, plus 1 100 à 2 200 $ de livres et 972 $ d'assurance médicale. Maîtrise : 4 095 $ par année, montant forfaitaire. Montants retenus : arts et traduction au baccalauréat, le forfait annuel à la maîtrise.",
        licence: { montant: 14345, devise: "CAD", periode: "an" },
        master: { montant: 4095, devise: "CAD", periode: "an" }
      },
      exoneration: {
        politique: "inconnue",
        detail: "Les bourses d'entrée automatiques visent les élèves du secondaire au Canada qui ont la citoyenneté canadienne ou la résidence permanente, et l'université précise que beaucoup de bourses tiennent compte de ce statut. Aucune bourse réservée aux étudiants internationaux n'est présentée sur sa page des bourses : renseignez-vous auprès de l'université avant de compter sur une aide.",
        source: "https://ustboniface.ca/bourses-et-aide-financiere",
        verifieLe: LE
      },
      admission: {
        procedure: `Demande en ligne sur le portail de l'université ; les maîtrises passent par le portail de l'Université du Manitoba. Une fois admis, un dépôt de 3 000 $, déduit des droits du premier trimestre, permet à l'université de demander au Manitoba votre lettre d'attestation provinciale. ${LAP_HORS_QUEBEC} L'université participe aussi, à partir de septembre 2026, au programme pilote d'IRCC pour les étudiants dans les communautés francophones en situation minoritaire.`,
        calendrier: "Pour l'automne 2027 : 1er mars pour Université 1, la traduction et les sciences infirmières, 1er février pour l'éducation ; documents avant le 15 mai pour Université 1 et la traduction.",
        langue: "Les candidats internationaux passent un test de français : DELF B2, DALF C1, TCF B2 ou TEF B2. Il n'est pas demandé si vous avez le baccalauréat français, obtenu en France ou dans un établissement affilié à ce système, ou le baccalauréat international avec au moins 4 points en Français A.",
        fraisDossier: "130 $ pour les candidats internationaux.",
        sources: [
          "https://ustboniface.ca/demande-admission",
          "https://ustboniface.ca/dates-limites-admission-internationaux",
          "https://ustboniface.ca/tests-de-francais-normalises",
          "https://ustboniface.ca/permis-etude",
          "https://ustboniface.ca/planification-financiere",
          LAP,
          LISTE_EED
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "university-of-alberta-edmonton",
    data: {
      name: "University of Alberta",
      city: "Edmonton",
      province: "Alberta",
      country: "Canada",
      image: "edmonton-vallee-saskatchewan-nord.jpg",
      flag: "ca.svg",
      ranking: "#96 mondial (QS 2027)",
      officialWebsite: "https://www.ualberta.ca/",
      applicationPortalUrl: "https://apply.ualberta.ca/apply/",
      fields: ["Agriculture", "Ingénierie", "Sciences", "Commerce", "Lettres", "Sciences sociales", "Droit", "Médecine"],
      description: "Grande université d'Edmonton qui accueille 46 201 étudiants de 159 pays. Les cours se donnent en anglais, sauf au Campus Saint-Jean, son campus francophone, présent depuis 1908 et seul établissement francophone à l'ouest de Winnipeg.",
      langueEnseignement: "Anglais ; français au Campus Saint-Jean",
      numeroEED: "O19257171832",
      fraisScolarite: {
        source: "https://www.ualberta.ca/en/admissions/media-library/uai-assets/docs/viewbook-2026-27/handbook-international-2026-27-web.pdf",
        verifieLe: LE,
        note: "Guide officiel 2026-2027 des élèves internationaux déjà au Canada, le seul lisible : droits de scolarité estimés d'un étudiant international pour une année à temps plein en première année, de 35 908 $ à 49 953 $ selon le programme, sans détail par programme. Le montant est garanti pour la durée normale du programme plus un an ; les frais non liés à l'enseignement et le logement n'en font pas partie. La page internationale du Campus Saint-Jean annonce au plus 27 000 $ par an sous cette garantie, sans préciser l'année. Maîtrise avec thèse, admis à l'automne 2026 : 10 518,72 $ par an ; maîtrise par cours : 826,36 $ par crédit. Montants retenus : le bas de la fourchette au baccalauréat, la maîtrise avec thèse.",
        licence: { montant: 35908, devise: "CAD", periode: "an" },
        master: { montant: 10519, devise: "CAD", periode: "an" }
      },
      exoneration: {
        politique: "possible_plafonnee",
        detail: "La bourse d'admission internationale, jusqu'à 10 000 $, et la bourse d'excellence régionale, jusqu'à 5 000 $, sont accordées automatiquement selon la moyenne d'admission. D'autres bourses se demandent avant le 10 janvier, dont la President's International Distinction Scholarship, jusqu'à 120 000 $ sur quatre ans pour 25 étudiants. Le Campus Saint-Jean annonce des droits réduits, garantis quatre ans, pour les étudiants internationaux entrés au premier cycle en 2025-2026, sans en publier le montant.",
        source: "https://www.ualberta.ca/en/admissions/tuition-and-scholarships/international-entrance-scholarships/index.html",
        verifieLe: LE
      },
      admission: {
        procedure: `Les candidats internationaux créent un compte et déposent leur demande sur le portail de l'université. ${LAP_HORS_QUEBEC} L'université participe aussi au programme pilote d'IRCC pour les étudiants dans les communautés francophones en situation minoritaire.`,
        calendrier: "Pour l'automne 2027 : ouverture le 1er octobre 2026, date limite le 1er mars 2027 pour la plupart des programmes, demandes de bourses avant le 10 janvier 2027.",
        langue: "L'université demande à tous une preuve d'anglais : IELTS Academic 6,5 sans bande sous 6,0, TOEFL iBT 4,5 depuis le 21 janvier 2026, ou Duolingo 120. Au Campus Saint-Jean, l'enseignement se donne en français et il faut aussi montrer sa maîtrise du français écrit et oral.",
        fraisDossier: "150 $ pour une première demande.",
        sources: [
          "https://apply.ualberta.ca/apply/",
          "https://www.ualberta.ca/en/admissions/how-to-apply/dates-deadlines/index.html",
          "https://www.ualberta.ca/en/admissions/how-to-apply/admission-requirements/language-requirements/index.html",
          "https://www.ualberta.ca/en/admissions/how-to-apply/international-admission-requirements/index.html",
          "https://www.ualberta.ca/en/campus-saint-jean/programs/international/index.html",
          LAP,
          LISTE_EED
        ],
        verifieLe: LE
      }
    }
  },

  {
    id: "york-university-toronto",
    data: {
      name: "York University",
      city: "Toronto",
      province: "Ontario",
      country: "Canada",
      image: "toronto-hotel-de-ville-nathan-phillips.jpg",
      flag: "ca.svg",
      ranking: "#322 mondial (QS 2027)",
      officialWebsite: "https://www.yorku.ca/",
      applicationPortalUrl: "https://form.apps06.yorku.ca/en/uaform",
      fields: ["Lettres", "Sciences sociales", "Sciences", "Ingénierie", "Informatique", "Commerce", "Droit"],
      description: "Université torontoise fondée en 1959, avec plus de 53 500 étudiants sur trois campus : Keele, Glendon et Markham. L'enseignement se donne surtout en anglais ; le campus Glendon est bilingue et propose des études en français.",
      langueEnseignement: "Anglais ; bilingue à Glendon",
      numeroEED: "O19361109242",
      fraisScolarite: {
        source: "https://www.yorku.ca/glendon/future-students/tuition-and-fees/",
        verifieLe: LE,
        note: "Coûts annuels 2026-2027 publiés pour le campus Glendon, étudiant international à temps plein, 30 crédits : 40 573,50 $. La page générale des futurs étudiants donne des montants arrondis pour 2026-2027 : environ 40 000 $ pour la plupart des programmes en arts et sciences, 38 000 $ en informatique, 40 000 à 44 000 $ en commerce, 47 000 $ en ingénierie, sans les frais complémentaires. À Glendon, il faut ajouter l'assurance santé et dentaire, 1 151 $, et le logement. Montant retenu : Glendon, arrondi à 40 574 $. Les droits de maîtrise des internationaux ne sont donnés que par un outil de calcul, non lu.",
        licence: { montant: 40574, devise: "CAD", periode: "an" }
      },
      exoneration: {
        politique: "possible_plafonnee",
        detail: "Pour l'entrée à l'automne 2026, York accorde automatiquement des bourses selon la moyenne : 37 500 $ sur quatre ans à partir de 90 %, 25 000 $ sur quatre ans de 80 à 89,9 %, 5 000 $ une seule fois de 75 à 79,9 %. Les bourses sur quatre ans se gardent avec au moins 24 crédits par an et une moyenne de B+. La President's International Scholarship of Excellence, 45 000 $ par an pendant quatre ans, se demande avant le 27 janvier 2027. Aucune réduction propre aux études en français à Glendon n'est présentée.",
        source: "https://futurestudents.yorku.ca/financing-your-degree/international-scholarships",
        verifieLe: LE
      },
      admission: {
        procedure: `Les candidats internationaux déposent la demande en ligne de York University. ${LAP_HORS_QUEBEC} Le campus Glendon participe aussi au programme pilote d'IRCC pour les étudiants dans les communautés francophones en situation minoritaire.`,
        calendrier: "Pour l'automne 2027, l'université conseille de postuler avant le 24 mars 2027 ; les demandes restent acceptées tant que les programmes ne sont pas complets.",
        langue: "Anglais : IELTS 6,5, TOEFL iBT 88 avant janvier 2026 ou 4,5 depuis, Duolingo 120. Pas de test après quatre années complètes d'études secondaires en anglais ou en français dans une école reconnue au Canada ou dans un pays dont l'anglais est la langue officielle. Pour les programmes en français de Glendon, la liste des tests de français acceptés est publiée par Glendon.",
        fraisDossier: "140 $ non remboursables pour la demande en ligne de York, celle que doivent utiliser les candidats internationaux.",
        sources: [
          "https://futurestudents.yorku.ca/how-do-i-apply",
          "https://futurestudents.yorku.ca/requirements/apply",
          "https://futurestudents.yorku.ca/requirements/language-tests",
          "https://www.yorku.ca/glendon/future-students/tuition-and-fees/",
          LAP,
          PILOTE_FRANCOPHONE,
          LISTE_EED
        ],
        verifieLe: LE
      }
    }
  }

];

// Le lot refuse de se charger si une photo déclarée n'existe pas
// (incident du lot 35).
const manquants = UNIVERSITIES
  .map((u) => u.data.image)
  .filter((f) => f && !existsSync(`assets/images/cities/${f.replace(/\.jpg$/, "")}-1600w.avif`))
  .map((f) => `cities/${f}`);

if (manquants.length) {
  throw new Error(`Lot 77 : ${manquants.length} photo(s) absente(s) — lancer d'abord \`node scripts\\add-lot76-photos.mjs\` :\n  ${manquants.join("\n  ")}`);
}
