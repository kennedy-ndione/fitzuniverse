/**
* ============================================================
* LOT 113 — LES RESTRICTIONS DE NATIONALITÉ, LISIBLES PAR LE MOTEUR
* (2026-09-26)
* ============================================================
*
* Audit du 26/09 : 36 bourses ne portaient leur restriction de
* nationalité que dans une phrase (`eligibility.note`). Le moteur ne
* lisait rien : la fiche disait « aucune restriction connue », et une
* bourse fermée à un Sénégalais pouvait lui être proposée (Stipendium
* Hungaricum, FAO-Hongrie, Semmelweis, Chevening pour un Camerounais…).
* Décision de Charles : « on attaquera les 36 bourses ».
*
* Listes relues le 2026-09-26 sur les sources officielles (cinq
* recherches parallèles, listes copiées puis converties en codes ISO) :
*   chevening.org/apply (cycle 2027-2028), stipendiumhungaricum.hu
*   (partenaires, appel 2026-2027), fao.org (appel 2026-2027),
*   semmelweis.hu (annexe 1), esteri.it (appel 2026-2027), vliruos.be
*   (liste du 22/01/2026), ares-ac.be (appel 2027-2028), koica.go.kr
*   (pays désignés 2027), iccr.gov.in (2026-27), studyinnl.org,
*   sciencespo.fr, studyinbelgium.be (WBI), studyinromania.gov.ro,
*   moe.gov.sa et kau.edu.sa, kas.de, mastercardfdn.org et les pages
*   des partenaires (UCT, Ashesi, ALU, KNUST, UM6P), mext.go.jp,
*   tdv.org, ambassade de Chine (appel CSC 2026-2027), universités
*   d'État russes (quota 2026-2027).
*
* CE QUE LE LOT POSE (33 patches : 32 des 36 bourses, plus la KOICA) :
*   - 14 « ouvertes à tous », dont 10 « sauf… » (`exclude`) : citoyens
*     du pays hôte, ou de l'Union européenne (NL, Boutmy, Roumanie) ;
*   - 7 « Afrique » : Mastercard Foundation (6), ICCR ;
*   - 7 listes : Chevening, Stipendium Hungaricum, FAO-Hongrie,
*     Semmelweis, Italie, VLIR-UOS, ARES ; l'ARES juge le pays de
*     RÉSIDENCE (`base: "residence"`), admet les Palestiniens partout
*     (`nationalitesToujours`) et exige deux ans d'expérience après le
*     dernier diplôme ;
*   - 4 notes corrigées sans filtre : AUF (x2 : c'est le pays de
*     l'université qui compte, pas la nationalité), GKS (les pays
*     dépendent du volet, et des volets sont ouverts à tous), bourses
*     suisses (183 pays ; doctorat et recherche seulement pour l'Afrique) ;
*   - hors des 36 : la KOICA passe du groupe CAD à la liste des pays
*     désignés pour 2027 (la Guinée n'y est pas).
*
* RESTENT SANS FILTRE, faute de liste officielle lisible : Al-Azhar,
* AMCI, Université Senghor, JICA SDGs Global Leader (liste africaine
* dans un document introuvable aujourd'hui).
*
* EXÉCUTION (sur l'ordinateur de Charles) :
*   node scripts\lot.mjs analyser 113-nationalites
*   node scripts\lot.mjs ecrire 113-nationalites
*   node scripts\lot.mjs verifier 113-nationalites
* ============================================================
*/

export const PATCHES = [
 {
  "collection": "scholarships",
  "id": "bilkent-international-scholarships",
  "attendu": {
   "eligibility": {
    "note": "Ouverte à toutes les nationalités, sauf si vous avez, ou avez déjà eu, la nationalité turque."
   }
  },
  "champs": {
   "eligibility": {
    "scope": "monde",
    "exclude": [
     "TR"
    ],
    "note": "Ouverte à toutes les nationalités, sauf si vous avez, ou avez déjà eu, la nationalité turque."
   }
  },
  "motif": "Lot 113 — ouverte à tous sauf aux citoyens turcs, actuels ou anciens (w3.bilkent.edu.tr)."
 },
 {
  "collection": "scholarships",
  "id": "bourse-emile-boutmy",
  "attendu": {
   "eligibility": {
    "note": "Réservée aux étudiants hors Union européenne admis à Sciences Po, qui paient les droits de scolarité au tarif hors UE. Les ressortissants africains sont donc concernés."
   }
  },
  "champs": {
   "eligibility": {
    "scope": "monde",
    "exclude": [
     "AT",
     "BE",
     "BG",
     "HR",
     "CY",
     "CZ",
     "DK",
     "EE",
     "FI",
     "FR",
     "DE",
     "GR",
     "HU",
     "IE",
     "IT",
     "LV",
     "LT",
     "LU",
     "MT",
     "NL",
     "PL",
     "PT",
     "RO",
     "SK",
     "SI",
     "ES",
     "SE",
     "CH",
     "NO"
    ],
    "note": "Réservée aux étudiants admis pour la première fois à Sciences Po, en licence ou en master, qui ne sont citoyens d'aucun pays de l'Union européenne, même en double nationalité, ni Suisses ni Norvégiens, et dont le foyer ne paie pas ses impôts dans l'Union européenne. Les ressortissants africains sont donc concernés."
   }
  },
  "motif": "Lot 113 — hors UE, Suisse et Norvège exclues (sciencespo.fr, page de la bourse)."
 },
 {
  "collection": "scholarships",
  "id": "bourse-master-in-wbi",
  "attendu": {
   "eligibility": {
    "note": "Cette bourse dépend des accords de coopération de Wallonie-Bruxelles International. Seuls les ressortissants des pays couverts par un programme de travail en cours peuvent candidater."
   }
  },
  "champs": {
   "eligibility": {
    "scope": "monde",
    "note": "Ouverte à toutes les nationalités. Priorité à ceux qui ont étudié dans l'un de ces 14 pays ou régions : Brésil, Canada, Chili, Colombie, Japon, Liban, Mexique, Maroc, Corée du Sud, Suisse, Taïwan, Tunisie, Royaume-Uni, États-Unis. Un dossier qui relève des bourses de l'ARES en est exclu."
   }
  },
  "motif": "Lot 113 — « regardless of nationality » (studyinbelgium.be, opéré par WBI)."
 },
 {
  "collection": "scholarships",
  "id": "bourses-formations-internationales-ares",
  "attendu": {
   "eligibility": {
    "note": "Réservée aux ressortissants des pays partenaires de la coopération belge au développement, qui résident et travaillent dans leur pays au moment de la candidature. La liste des pays est fixée dans chaque appel de l'ARES."
   }
  },
  "champs": {
   "eligibility": {
    "scope": "liste",
    "base": "residence",
    "include": [
     "BF",
     "BI",
     "BJ",
     "BO",
     "CD",
     "CI",
     "CM",
     "CU",
     "EC",
     "ET",
     "GN",
     "HT",
     "ID",
     "KE",
     "KH",
     "MA",
     "MG",
     "ML",
     "MZ",
     "NE",
     "NP",
     "PE",
     "PH",
     "PS",
     "RW",
     "SN",
     "TN",
     "TZ",
     "UG",
     "VN",
     "ZA",
     "ZW"
    ],
    "nationalitesToujours": [
     "PS"
    ],
    "note": "Réservée aux personnes qui résident en permanence et travaillent dans l'un des 32 pays de l'appel 2027-2028, dont le Sénégal, la Côte d'Ivoire, le Cameroun, le Bénin, la Guinée, le Burkina Faso, le Mali, le Niger, le Maroc, la Tunisie et la RD Congo. C'est le pays où vous vivez qui compte, pas votre nationalité. Il faut aussi deux ans d'expérience professionnelle après le dernier diplôme. Exception : les Palestiniens sont éligibles où qu'ils vivent."
   },
   "experienceProMinAns": 2,
   "experienceApresDiplome": true
  },
  "motif": "Lot 113 — 32 pays de résidence et de travail, appel 2027-2028 (ares-ac.be)."
 },
 {
  "collection": "scholarships",
  "id": "chevening-scholarships",
  "attendu": {
   "eligibility": {
    "note": "Environ 160 pays sont éligibles, dont la plupart des pays d'Afrique. La liste complète est publiée sur chevening.org."
   }
  },
  "champs": {
   "eligibility": {
    "scope": "liste",
    "include": [
     "AD",
     "AG",
     "AI",
     "AL",
     "AM",
     "AO",
     "AR",
     "AT",
     "AU",
     "AZ",
     "BA",
     "BB",
     "BD",
     "BE",
     "BF",
     "BG",
     "BI",
     "BJ",
     "BM",
     "BN",
     "BO",
     "BR",
     "BS",
     "BT",
     "BW",
     "BY",
     "BZ",
     "CA",
     "CD",
     "CF",
     "CG",
     "CH",
     "CI",
     "CK",
     "CL",
     "CN",
     "CO",
     "CR",
     "CU",
     "CV",
     "CY",
     "CZ",
     "DE",
     "DJ",
     "DK",
     "DM",
     "DO",
     "DZ",
     "EC",
     "EE",
     "EG",
     "ER",
     "ES",
     "ET",
     "FI",
     "FJ",
     "FK",
     "FM",
     "FR",
     "GA",
     "GD",
     "GE",
     "GH",
     "GI",
     "GL",
     "GM",
     "GN",
     "GQ",
     "GR",
     "GT",
     "GW",
     "GY",
     "HK",
     "HN",
     "HR",
     "HT",
     "HU",
     "ID",
     "IE",
     "IL",
     "IN",
     "IQ",
     "IR",
     "IS",
     "IT",
     "JM",
     "JO",
     "JP",
     "KE",
     "KG",
     "KH",
     "KI",
     "KM",
     "KN",
     "KR",
     "KY",
     "KZ",
     "LA",
     "LB",
     "LC",
     "LI",
     "LK",
     "LR",
     "LS",
     "LT",
     "LU",
     "LV",
     "LY",
     "MA",
     "MC",
     "MD",
     "ME",
     "MG",
     "MH",
     "MK",
     "ML",
     "MN",
     "MR",
     "MS",
     "MT",
     "MU",
     "MV",
     "MW",
     "MX",
     "MY",
     "MZ",
     "NA",
     "NE",
     "NG",
     "NI",
     "NL",
     "NO",
     "NP",
     "NR",
     "NZ",
     "PA",
     "PE",
     "PG",
     "PH",
     "PK",
     "PL",
     "PS",
     "PT",
     "PW",
     "PY",
     "RO",
     "RS",
     "RU",
     "RW",
     "SB",
     "SC",
     "SE",
     "SG",
     "SH",
     "SI",
     "SK",
     "SL",
     "SM",
     "SN",
     "SO",
     "SR",
     "SS",
     "ST",
     "SV",
     "SY",
     "SZ",
     "TC",
     "TD",
     "TG",
     "TH",
     "TJ",
     "TL",
     "TM",
     "TN",
     "TO",
     "TR",
     "TT",
     "TV",
     "TW",
     "TZ",
     "UA",
     "UG",
     "UY",
     "UZ",
     "VA",
     "VC",
     "VE",
     "VG",
     "VN",
     "VU",
     "WS",
     "XK",
     "YE",
     "ZA",
     "ZM",
     "ZW"
    ],
    "note": "Réservée aux citoyens d'un pays ou territoire éligible à Chevening pour 2027-2028 : presque toute l'Afrique, dont le Sénégal, la Côte d'Ivoire, le Bénin, la Guinée, le Togo, le Burkina Faso, le Mali, le Niger, le Maroc et la Tunisie. Le Cameroun et le Soudan n'y figurent pas cette année. Les citoyens britanniques, y compris en double nationalité, sont exclus."
   }
  },
  "motif": "Lot 113 — sélecteur des pays de chevening.org/apply, cycle 2027-2028 ; Afghanistan et Soudan sans page cette année, Cameroun absent."
 },
 {
  "collection": "scholarships",
  "id": "chinese-government-scholarship",
  "attendu": {
   "eligibility": {
    "note": "Ouverte aux personnes qui n'ont pas la nationalité chinoise. Limites d'âge : 25 ans en licence, 35 ans en master et 40 ans en doctorat."
   }
  },
  "champs": {
   "eligibility": {
    "scope": "monde",
    "exclude": [
     "CN"
    ],
    "note": "Ouverte aux personnes qui n'ont pas la nationalité chinoise. Limites d'âge : 25 ans en licence, 35 ans en master et 40 ans en doctorat."
   }
  },
  "motif": "Lot 113 — « a citizen of a country other than the People's Republic of China » (ambassade de Chine, appel 2026-2027)."
 },
 {
  "collection": "scholarships",
  "id": "diyanet-tdv-international",
  "attendu": {
   "eligibility": {
    "note": "Aucune restriction de nationalité n'est publiée. En revanche, la bourse exclut toute personne qui est ou a été citoyenne turque, et toute personne qui étudie déjà en Turquie."
   }
  },
  "champs": {
   "eligibility": {
    "scope": "monde",
    "exclude": [
     "TR"
    ],
    "note": "Aucune restriction de nationalité n'est publiée. En revanche, la bourse exclut toute personne qui est ou a été citoyenne turque, et toute personne qui étudie déjà en Turquie."
   }
  },
  "motif": "Lot 113 — « Not to be a citizen of the Republic of Türkiye » (guides TDV 2026)."
 },
 {
  "collection": "scholarships",
  "id": "eiffel-excellence-scholarship",
  "attendu": {
   "eligibility": {
    "note": "Réservée aux candidats de nationalité étrangère. Si vous avez aussi la nationalité française, vous n'êtes pas éligible. C'est l'établissement français qui dépose la candidature, jamais l'étudiant lui-même."
   }
  },
  "champs": {
   "eligibility": {
    "scope": "monde",
    "exclude": [
     "FR"
    ],
    "note": "Réservée aux candidats de nationalité étrangère. Si vous avez aussi la nationalité française, vous n'êtes pas éligible. C'est l'établissement français qui dépose la candidature, jamais l'étudiant lui-même."
   }
  },
  "motif": "Lot 113 — candidats de nationalité étrangère, binationaux français exclus (fiche vérifiée)."
 },
 {
  "collection": "scholarships",
  "id": "fao-hungarian-government-scholarship",
  "attendu": {
   "eligibility": {
    "note": "Réservée aux ressortissants des pays en développement membres de la FAO, pour des études dans l'agriculture et l'alimentation. La FAO et la Hongrie fixent ensemble la liste des pays chaque année."
   }
  },
  "champs": {
   "eligibility": {
    "scope": "liste",
    "include": [
     "AF",
     "AL",
     "AM",
     "AO",
     "AZ",
     "BA",
     "BD",
     "BF",
     "BY",
     "CD",
     "CV",
     "DZ",
     "EG",
     "ET",
     "GE",
     "GH",
     "GM",
     "JO",
     "KE",
     "KG",
     "KH",
     "KP",
     "KZ",
     "LA",
     "LB",
     "MD",
     "ME",
     "MG",
     "MK",
     "ML",
     "MM",
     "MN",
     "NA",
     "NG",
     "PH",
     "PS",
     "RS",
     "SD",
     "SO",
     "SS",
     "TD",
     "TJ",
     "TM",
     "UA",
     "UG",
     "UZ",
     "VN",
     "XK",
     "YE"
    ],
    "note": "Réservée aux ressortissants qui résident dans l'un des 49 pays de l'appel 2026-2027 de la FAO et de la Hongrie. En Afrique de l'Ouest et du Centre : Burkina Faso, Mali, Tchad, Gambie, Ghana, Nigeria, Cap-Vert et RD Congo. Le Sénégal, la Côte d'Ivoire et le Cameroun n'y figurent pas. La liste change à chaque appel."
   }
  },
  "motif": "Lot 113 — 49 pays de l'appel 2026-2027 (fao.org)."
 },
 {
  "collection": "scholarships",
  "id": "iccr-africa-scholarship-scheme",
  "attendu": {
   "eligibility": {
    "note": "C'est le volet africain des bourses de l'ICCR : il est réservé aux ressortissants des pays africains. Le dossier se dépose auprès de la mission diplomatique de l'Inde dans votre pays de nationalité."
   }
  },
  "champs": {
   "eligibility": {
    "scope": "groupes",
    "groups": [
     "afrique"
    ],
    "note": "C'est le volet africain des bourses de l'ICCR : il est réservé aux ressortissants des pays africains. Le dossier se dépose auprès de la mission diplomatique de l'Inde dans votre pays de nationalité."
   }
  },
  "motif": "Lot 113 — les 54 pays d'Afrique du barème 2026-27 (iccr.gov.in)."
 },
 {
  "collection": "scholarships",
  "id": "icp-connect-scholarships-vlir-uos",
  "attendu": {
   "eligibility": {
    "note": "Réservée aux ressortissants des pays partenaires de VLIR-UOS. Chaque programme de master a sa propre liste de pays : vérifiez-la sur la page du programme qui vous intéresse."
   }
  },
  "champs": {
   "eligibility": {
    "scope": "liste",
    "include": [
     "BF",
     "BI",
     "BJ",
     "BO",
     "CD",
     "CM",
     "CU",
     "EC",
     "ET",
     "GN",
     "HT",
     "ID",
     "KE",
     "KH",
     "MA",
     "MG",
     "ML",
     "MZ",
     "NE",
     "NI",
     "PE",
     "PH",
     "PS",
     "SN",
     "TZ",
     "UG",
     "VN",
     "ZA",
     "ZW"
    ],
    "note": "Réservée aux ressortissants de l'un des 29 pays partenaires de VLIR-UOS, qui résident dans l'un de ces pays au moment de la candidature. En Afrique : Bénin, Burkina Faso, Burundi, Cameroun, RD Congo, Éthiopie, Guinée, Kenya, Madagascar, Mali, Mozambique, Niger, Sénégal, Afrique du Sud, Tanzanie, Ouganda, Zimbabwe et Maroc. La Côte d'Ivoire et le Togo n'y figurent pas."
   }
  },
  "motif": "Lot 113 — 29 pays (vliruos.be, liste du 22/01/2026)."
 },
 {
  "collection": "scholarships",
  "id": "italian-government-scholarship",
  "attendu": {
   "eligibility": {
    "note": "Le ministère italien des Affaires étrangères fixe chaque année la liste des pays éligibles, et elle change d'une édition à l'autre. Vérifiez l'appel en cours avant de candidater."
   }
  },
  "champs": {
   "eligibility": {
    "scope": "liste",
    "include": [
     "AF",
     "AL",
     "AM",
     "AO",
     "AR",
     "AT",
     "AU",
     "AZ",
     "BA",
     "BD",
     "BE",
     "BF",
     "BG",
     "BH",
     "BI",
     "BJ",
     "BO",
     "BR",
     "BS",
     "BW",
     "BY",
     "CA",
     "CD",
     "CF",
     "CG",
     "CH",
     "CI",
     "CL",
     "CM",
     "CN",
     "CO",
     "CR",
     "CU",
     "CV",
     "CY",
     "CZ",
     "DE",
     "DJ",
     "DO",
     "DZ",
     "EC",
     "EE",
     "EG",
     "ER",
     "ES",
     "ET",
     "FR",
     "GA",
     "GB",
     "GE",
     "GH",
     "GM",
     "GN",
     "GQ",
     "GR",
     "GT",
     "GW",
     "HR",
     "HU",
     "ID",
     "IL",
     "IN",
     "IQ",
     "IR",
     "JO",
     "JP",
     "KE",
     "KG",
     "KH",
     "KM",
     "KR",
     "KW",
     "KZ",
     "LA",
     "LB",
     "LK",
     "LR",
     "LS",
     "LT",
     "LV",
     "LY",
     "MA",
     "MD",
     "ME",
     "MG",
     "MK",
     "ML",
     "MM",
     "MN",
     "MR",
     "MT",
     "MU",
     "MW",
     "MX",
     "MY",
     "MZ",
     "NA",
     "NE",
     "NG",
     "OM",
     "PA",
     "PE",
     "PH",
     "PL",
     "PS",
     "PT",
     "PY",
     "RO",
     "RS",
     "RU",
     "RW",
     "SC",
     "SD",
     "SG",
     "SI",
     "SK",
     "SL",
     "SM",
     "SN",
     "SO",
     "SS",
     "ST",
     "SV",
     "SY",
     "SZ",
     "TD",
     "TG",
     "TH",
     "TJ",
     "TL",
     "TM",
     "TN",
     "TR",
     "TW",
     "TZ",
     "UA",
     "UG",
     "UY",
     "UZ",
     "VE",
     "VN",
     "XK",
     "YE",
     "ZA",
     "ZM",
     "ZW"
    ],
    "note": "Réservée aux ressortissants des 146 pays et territoires de l'appel 2026-2027 du ministère italien des Affaires étrangères, dont les 54 pays d'Afrique. La liste change à chaque édition : vérifiez l'appel en cours."
   }
  },
  "motif": "Lot 113 — 146 pays de l'appel 2026-2027 (esteri.it)."
 },
 {
  "collection": "scholarships",
  "id": "king-abdulaziz-scholarship",
  "champs": {
   "eligibility": {
    "scope": "monde",
    "exclude": [
     "SA"
    ],
    "note": "Réservée aux étudiants qui n'ont pas la nationalité saoudienne, venus de tous les pays du monde. Les bourses dites externes s'adressent à ceux qui vivent hors du Royaume."
   }
  },
  "motif": "Lot 113 — « from all countries of the world », non-Saoudiens (moe.gov.sa, kau.edu.sa)."
 },
 {
  "collection": "scholarships",
  "id": "konrad-adenauer-stiftung",
  "attendu": {
   "eligibility": {
    "note": "La bourse couvre plus de 50 pays. Mais en Afrique, la procédure régionale ne concerne que le Kenya, l'Ouganda, le Soudan du Sud, la Tanzanie et l'Éthiopie. Un candidat d'Afrique de l'Ouest doit passer par la procédure nationale : il doit donc être déjà inscrit en Allemagne."
   }
  },
  "champs": {
   "eligibility": {
    "scope": "monde",
    "note": "La bourse couvre plus de 50 pays. Mais en Afrique, la procédure régionale ne concerne que le Kenya, l'Ouganda, le Soudan du Sud, la Tanzanie et l'Éthiopie. Un candidat d'Afrique de l'Ouest doit passer par la procédure nationale : il doit donc être déjà inscrit en Allemagne."
   }
  },
  "motif": "Lot 113 — programme international ouvert aux étudiants étrangers, surtout hors UE (kas.de, juin 2026)."
 },
 {
  "collection": "scholarships",
  "id": "ashesi-mastercard-foundation-scholars",
  "attendu": {
   "eligibility": {
    "note": "Aucune liste de pays ni aucune exclusion n'est publiée. La seule indication géographique officielle : les boursiers doivent servir de modèles pour leurs communautés, partout en Afrique."
   }
  },
  "champs": {
   "eligibility": {
    "scope": "groupes",
    "groups": [
     "afrique"
    ],
    "note": "Réservée aux jeunes Africains issus de milieux économiquement défavorisés, au talent scolaire et au potentiel de leader démontrés. Ashesi l'attribue à partir de sa demande générale de bourse : il n'y a pas de dossier séparé."
   }
  },
  "motif": "Lot 113 — jeunes Africains (mastercardfdn.org, page du partenaire)."
 },
 {
  "collection": "scholarships",
  "id": "mastercard-foundation-scholars-alu",
  "attendu": {
   "eligibility": {
    "note": "Le programme se présente comme ouvert dans toute l'Afrique, avec des boursiers venus de 32 pays. ALU ne publie pas la liste de ces 32 pays : aucun pays n'y est nommé, et aucun n'en est exclu."
   }
  },
  "champs": {
   "eligibility": {
    "scope": "groupes",
    "groups": [
     "afrique"
    ],
    "note": "Le programme se présente comme ouvert dans toute l'Afrique, avec des boursiers venus de 32 pays. ALU ne publie pas la liste de ces 32 pays : aucun pays n'y est nommé, et aucun n'en est exclu."
   }
  },
  "motif": "Lot 113 — jeunes Africains (mastercardfdn.org, page du partenaire)."
 },
 {
  "collection": "scholarships",
  "id": "mastercard-foundation-scholars-knust",
  "attendu": {
   "eligibility": {
    "note": "La page officielle ne donne aucune liste de pays. Elle vise des étudiants qualifiés, doués sur le plan scolaire mais défavorisés sur le plan économique, issus des communautés pauvres d'Afrique. Un volet distinct pour les candidats internationaux existerait, mais cette information ne vient pas d'une source officielle : elle reste à confirmer auprès du responsable du programme, le Program Manager."
   }
  },
  "champs": {
   "eligibility": {
    "scope": "groupes",
    "groups": [
     "afrique"
    ],
    "note": "Réservée aux jeunes Africains doués sur le plan scolaire mais défavorisés sur le plan économique, issus des communautés pauvres d'Afrique. 20 % des places vont à des étudiants internationaux, c'est-à-dire non ghanéens."
   }
  },
  "motif": "Lot 113 — jeunes Africains (mastercardfdn.org, page du partenaire)."
 },
 {
  "collection": "scholarships",
  "id": "mastercard-foundation-scholars-program",
  "attendu": {
   "eligibility": {
    "note": "Ce programme de la Mastercard Foundation s'adresse à de jeunes Africains issus de milieux économiquement défavorisés. La priorité va aux femmes et aux jeunes en situation de handicap."
   }
  },
  "champs": {
   "eligibility": {
    "scope": "groupes",
    "groups": [
     "afrique"
    ],
    "note": "Ce programme de la Mastercard Foundation s'adresse à de jeunes Africains issus de milieux économiquement défavorisés. La priorité va aux femmes et aux jeunes en situation de handicap."
   }
  },
  "motif": "Lot 113 — jeunes Africains (mastercardfdn.org, page du partenaire)."
 },
 {
  "collection": "scholarships",
  "id": "mastercard-foundation-scholars-uct",
  "attendu": {
   "eligibility": {
    "note": "Un programme de la Mastercard Foundation pour de jeunes Africains économiquement défavorisés. La priorité va aux femmes et aux jeunes en situation de handicap."
   }
  },
  "champs": {
   "eligibility": {
    "scope": "groupes",
    "groups": [
     "afrique"
    ],
    "note": "Réservée aux citoyens d'un pays africain, Afrique du Sud comprise, économiquement défavorisés. La priorité va aux femmes et aux jeunes en situation de handicap."
   }
  },
  "motif": "Lot 113 — jeunes Africains (mastercardfdn.org, page du partenaire)."
 },
 {
  "collection": "scholarships",
  "id": "mastercard-foundation-scholars-um6p",
  "attendu": {
   "eligibility": {
    "note": "Réservée aux jeunes femmes africaines qui ont peu de moyens financiers. La priorité va aux jeunes femmes du milieu rural, aux réfugiées, aux mères et aux personnes en situation de handicap."
   }
  },
  "champs": {
   "eligibility": {
    "scope": "groupes",
    "groups": [
     "afrique"
    ],
    "note": "Réservée aux jeunes femmes africaines qui ont peu de moyens financiers. La priorité va aux jeunes femmes du milieu rural, aux réfugiées, aux mères et aux personnes en situation de handicap."
   }
  },
  "motif": "Lot 113 — jeunes Africains (mastercardfdn.org, page du partenaire)."
 },
 {
  "collection": "scholarships",
  "id": "mext-scholarship",
  "attendu": {
   "eligibility": {
    "note": "Ouverte aux ressortissants des pays qui entretiennent des relations diplomatiques avec le Japon. Pour la voie ambassade, le dossier se dépose à l'ambassade du Japon de votre pays."
   }
  },
  "champs": {
   "eligibility": {
    "scope": "monde",
    "exclude": [
     "JP"
    ],
    "note": "Ouverte aux ressortissants des pays qui entretiennent des relations diplomatiques avec le Japon. Pour la voie ambassade, le dossier se dépose à l'ambassade du Japon de votre pays."
   }
  },
  "motif": "Lot 113 — pays qui ont des relations diplomatiques avec le Japon, nationaux japonais exclus (guides 2027)."
 },
 {
  "collection": "scholarships",
  "id": "nl-scholarship",
  "attendu": {
   "eligibility": {
    "note": "Réservée aux étudiants dont la nationalité est hors de l'Espace économique européen. Vous devez candidater à une licence ou à un master à temps plein dans un établissement néerlandais participant. Vous ne devez pas déjà avoir obtenu un diplôme aux Pays-Bas. Les ressortissants africains sont donc éligibles."
   }
  },
  "champs": {
   "eligibility": {
    "scope": "monde",
    "exclude": [
     "AT",
     "BE",
     "BG",
     "HR",
     "CY",
     "CZ",
     "DK",
     "EE",
     "FI",
     "FR",
     "DE",
     "GR",
     "HU",
     "IE",
     "IT",
     "LV",
     "LT",
     "LU",
     "MT",
     "NL",
     "PL",
     "PT",
     "RO",
     "SK",
     "SI",
     "ES",
     "SE",
     "IS",
     "LI",
     "NO"
    ],
    "note": "Réservée aux étudiants dont la nationalité est hors de l'Espace économique européen. Vous devez candidater à une licence ou à un master à temps plein dans un établissement néerlandais participant. Vous ne devez pas déjà avoir obtenu un diplôme aux Pays-Bas. Les ressortissants africains sont donc éligibles."
   }
  },
  "motif": "Lot 113 — « Your nationality is non-EEA » (studyinnl.org, Nuffic)."
 },
 {
  "collection": "scholarships",
  "id": "quota-gouvernement-russe",
  "attendu": {
   "eligibility": {
    "note": "Les places sont réparties pays par pays. Le nombre de places et la présélection dépendent de la représentation russe compétente. Consultez la page de votre pays sur education-in-russia.com."
   }
  },
  "champs": {
   "eligibility": {
    "scope": "monde",
    "note": "Ouverte à tous les étrangers. Les places sont réparties pays par pays : vous candidatez auprès de la représentation russe du pays dont vous avez la nationalité, où que vous viviez. Consultez la page de votre pays sur education-in-russia.com."
   }
  },
  "motif": "Lot 113 — étrangers et apatrides, par la représentation du pays de nationalité (universités d'État, 2026-2027)."
 },
 {
  "collection": "scholarships",
  "id": "romanian-government-scholarship",
  "attendu": {
   "eligibility": {
    "note": "Le programme s'adresse aux ressortissants des pays qui ne sont pas membres de l'Union européenne. Le dossier se dépose auprès de l'ambassade de Roumanie compétente. Vérifiez l'appel en cours."
   }
  },
  "champs": {
   "eligibility": {
    "scope": "monde",
    "exclude": [
     "AT",
     "BE",
     "BG",
     "HR",
     "CY",
     "CZ",
     "DK",
     "EE",
     "FI",
     "FR",
     "DE",
     "GR",
     "HU",
     "IE",
     "IT",
     "LV",
     "LT",
     "LU",
     "MT",
     "NL",
     "PL",
     "PT",
     "RO",
     "SK",
     "SI",
     "ES",
     "SE"
    ],
    "note": "Le programme s'adresse aux ressortissants des pays qui ne sont pas membres de l'Union européenne. Le dossier se dépose auprès de l'ambassade de Roumanie compétente. Vérifiez l'appel en cours."
   }
  },
  "motif": "Lot 113 — « Foreign citizens from all non-EU countries » (studyinromania.gov.ro, 2026-2027)."
 },
 {
  "collection": "scholarships",
  "id": "semmelweis-pannonia-in-excellence",
  "champs": {
   "eligibility": {
    "scope": "liste",
    "include": [
     "AD",
     "AE",
     "AL",
     "AM",
     "AR",
     "AT",
     "AU",
     "AZ",
     "BA",
     "BE",
     "BG",
     "BO",
     "BR",
     "BY",
     "CA",
     "CH",
     "CL",
     "CN",
     "CO",
     "CU",
     "CY",
     "CZ",
     "DE",
     "DK",
     "EC",
     "EE",
     "EG",
     "ES",
     "FI",
     "FR",
     "GB",
     "GE",
     "GF",
     "GR",
     "GY",
     "HR",
     "ID",
     "IE",
     "IL",
     "IN",
     "IS",
     "IT",
     "JO",
     "JP",
     "KG",
     "KR",
     "KZ",
     "LB",
     "LI",
     "LT",
     "LU",
     "LV",
     "MC",
     "MD",
     "ME",
     "MK",
     "MN",
     "MT",
     "MX",
     "NA",
     "NL",
     "NO",
     "NZ",
     "PE",
     "PH",
     "PL",
     "PT",
     "PY",
     "QA",
     "RO",
     "RS",
     "RU",
     "SA",
     "SE",
     "SG",
     "SI",
     "SK",
     "SM",
     "SY",
     "TJ",
     "TM",
     "TR",
     "UA",
     "US",
     "UY",
     "UZ",
     "VE",
     "VN",
     "ZA"
    ],
    "note": "Réservée aux étudiants étrangers déjà inscrits à Semmelweis, citoyens de l'un des 89 pays de l'annexe de l'appel. Aucun pays d'Afrique de l'Ouest n'y figure ; en Afrique, seuls l'Égypte, la Namibie et l'Afrique du Sud."
   }
  },
  "motif": "Lot 113 — 89 pays de l'annexe 1 de l'appel (semmelweis.hu)."
 },
 {
  "collection": "scholarships",
  "id": "stipendium-hungaricum",
  "attendu": {
   "eligibility": {
    "note": "Le programme repose sur des accords entre la Hongrie et d'autres pays : seuls les ressortissants des pays partenaires peuvent postuler. Chaque pays a son propre nombre de places et sa propre procédure nationale. Consultez la liste des pays partenaires sur stipendiumhungaricum.hu pour l'appel en cours."
   }
  },
  "champs": {
   "eligibility": {
    "scope": "liste",
    "include": [
     "AE",
     "AL",
     "AM",
     "AO",
     "AR",
     "AZ",
     "BA",
     "BD",
     "BF",
     "BH",
     "BI",
     "BN",
     "BO",
     "BR",
     "BW",
     "BY",
     "BZ",
     "CD",
     "CL",
     "CN",
     "CO",
     "CR",
     "CU",
     "CV",
     "DO",
     "DZ",
     "EC",
     "EG",
     "ER",
     "ET",
     "GE",
     "GH",
     "GM",
     "GQ",
     "GW",
     "HN",
     "ID",
     "IL",
     "IN",
     "IQ",
     "IR",
     "JO",
     "JP",
     "KE",
     "KG",
     "KH",
     "KR",
     "KZ",
     "LA",
     "LB",
     "LC",
     "LK",
     "LR",
     "LY",
     "MA",
     "MD",
     "ME",
     "MG",
     "MH",
     "MK",
     "ML",
     "MN",
     "MU",
     "MV",
     "MX",
     "MY",
     "MZ",
     "NA",
     "NG",
     "OM",
     "PA",
     "PE",
     "PH",
     "PK",
     "PS",
     "PY",
     "RS",
     "RU",
     "RW",
     "SC",
     "SD",
     "SG",
     "SL",
     "ST",
     "SV",
     "SY",
     "TD",
     "TH",
     "TJ",
     "TM",
     "TN",
     "TR",
     "TW",
     "TZ",
     "UA",
     "UG",
     "UY",
     "UZ",
     "VE",
     "VN",
     "XK",
     "YE",
     "ZA"
    ],
    "note": "Réservée aux ressortissants des pays partenaires, présentés par leur autorité nationale. En Afrique de l'Ouest : Burkina Faso, Cap-Vert, Gambie, Ghana, Guinée-Bissau, Liberia, Mali, Nigeria et Sierra Leone. Le Sénégal, la Côte d'Ivoire, la Guinée, le Bénin, le Togo, le Niger et le Cameroun n'y figurent pas. L'Algérie n'a pas accès à la licence."
   }
  },
  "motif": "Lot 113 — partenaires de stipendiumhungaricum.hu (appel 2026-2027 ; Alliance du Pacifique et SEGIB développées)."
 },
 {
  "collection": "scholarships",
  "id": "turkiye-burslari",
  "attendu": {
   "eligibility": {
    "note": "Ouverte à toutes les nationalités, sauf aux citoyens et anciens citoyens turcs. Elle est aussi fermée à toute personne déjà inscrite dans une université turque au même niveau d'études."
   }
  },
  "champs": {
   "eligibility": {
    "scope": "monde",
    "exclude": [
     "TR"
    ],
    "note": "Ouverte à toutes les nationalités, sauf aux citoyens et anciens citoyens turcs. Elle est aussi fermée à toute personne déjà inscrite dans une université turque au même niveau d'études."
   }
  },
  "motif": "Lot 113 — toutes nationalités sauf citoyens turcs (fiche vérifiée)."
 },
 {
  "collection": "scholarships",
  "id": "turkiye-burslari-success",
  "attendu": {
   "eligibility": {
    "note": "Ouverte à toutes les nationalités. Elle est réservée aux étudiants déjà inscrits dans une université turque, à leurs propres frais."
   }
  },
  "champs": {
   "eligibility": {
    "scope": "monde",
    "note": "Ouverte à toutes les nationalités. Elle est réservée aux étudiants déjà inscrits dans une université turque, à leurs propres frais."
   }
  },
  "motif": "Lot 113 — toutes nationalités (fiche vérifiée)."
 },
 {
  "collection": "scholarships",
  "id": "auf-eugen-ionescu",
  "attendu": {
   "eligibility": {
    "note": "Réservée aux doctorants et post-doctorants ressortissants d'un pays membre ou observateur de l'OIF, et inscrits dans un établissement membre de l'AUF."
   }
  },
  "champs": {
   "eligibility": {
    "note": "Réservée aux doctorants et enseignants-chercheurs d'un établissement membre de l'AUF situé dans un pays membre ou observateur de l'OIF, ou en Algérie. C'est le pays de votre université qui compte, pas votre nationalité. Le Burkina Faso, le Mali et le Niger ont quitté l'OIF en 2025."
   }
  },
  "motif": "Lot 113 — note corrigée : critère de l'établissement, pas de la nationalité (auf.org)."
 },
 {
  "collection": "scholarships",
  "id": "auf-petrache-poenaru",
  "attendu": {
   "eligibility": {
    "note": "Réservée aux chercheurs ressortissants d'un pays membre ou observateur de l'OIF, et inscrits dans un établissement membre de l'AUF."
   }
  },
  "champs": {
   "eligibility": {
    "note": "Réservée aux doctorants, post-doctorants et enseignants-chercheurs d'une université membre de l'AUF située dans un pays membre ou observateur de l'OIF, ou en Algérie, qui ont déjà eu une bourse Eugen Ionescu à POLITEHNICA Bucarest. Français B2 au minimum, 35 ans au plus."
   }
  },
  "motif": "Lot 113 — note corrigée (auf.org, appel 2026)."
 },
 {
  "collection": "scholarships",
  "id": "global-korea-scholarship",
  "attendu": {
   "eligibility": {
    "note": "Les places sont réparties par pays, avec des quotas renégociés chaque année. Les appels sont publiés par l'ambassade de Corée de chaque pays. Le nombre de places attribuées à chaque pays n'est pas forcément rendu public."
   }
  },
  "champs": {
   "eligibility": {
    "note": "Les pays admis dépendent du volet et de l'année. Master et doctorat (appel 2026), voie ambassade : Sénégal, Côte d'Ivoire, Bénin, Togo, RD Congo, Gabon, Madagascar, Maroc, Tunisie, Algérie ; le Cameroun passe par la voie université ; le Mali, la Guinée, le Burkina Faso et le Niger n'ont accès qu'aux volets ouverts à tous. Licence (appel 2027) : en Afrique francophone, la voie ambassade ne concerne que le Gabon, Madagascar et le Maroc ; les autres passent par le volet UIC, ouvert à tous en sciences et ingénierie."
   }
  },
  "motif": "Lot 113 — note corrigée : listes GKS-G 2026 et GKS-U 2027 (studyinkorea.go.kr)."
 },
 {
  "collection": "scholarships",
  "id": "swiss-government-excellence-scholarships",
  "attendu": {
   "eligibility": {
    "note": "La bourse est ouverte à 183 pays. Le type de bourse proposé et la date limite dépendent de votre pays d'origine, et certains pays n'ont accès qu'à la bourse de recherche. Avant de candidater, consultez la page de votre pays sur sbfi.admin.ch."
   }
  },
  "champs": {
   "eligibility": {
    "note": "Ouverte à 183 pays. Pour les 54 pays d'Afrique, l'appel 2027-2028 propose la bourse de doctorat et la bourse de recherche, pas de master ; il n'y a plus de bourse postdoctorale. La date limite dépend du pays : 30 novembre 2026 pour le Sénégal, le Mali et la RD Congo, 27 novembre pour la Côte d'Ivoire, le Cameroun, le Bénin, la Guinée, le Togo et le Burkina Faso."
   }
  },
  "motif": "Lot 113 — note corrigée : liste Afrique 2027-2028 (sbfi.admin.ch)."
 },
 {
  "collection": "scholarships",
  "id": "koica-ciat-scholarship",
  "attendu": {
   "eligibility": {
    "note": "Réservé aux ressortissants des 96 pays qui reçoivent l'aide publique au développement. La présence de votre pays sur la liste annuelle est à confirmer auprès du bureau KOICA. Le programme est en plus réservé aux fonctionnaires nommés par leur gouvernement.",
    "scope": "groupes",
    "groups": [
     "cad-apd"
    ]
   }
  },
  "champs": {
   "eligibility": {
    "scope": "liste",
    "include": [
     "AO",
     "AZ",
     "BD",
     "BF",
     "BI",
     "BJ",
     "BO",
     "BW",
     "BZ",
     "CD",
     "CF",
     "CI",
     "CM",
     "CO",
     "CR",
     "DM",
     "DO",
     "DZ",
     "EC",
     "EG",
     "ET",
     "FJ",
     "GA",
     "GD",
     "GE",
     "GH",
     "GM",
     "GT",
     "GY",
     "HN",
     "ID",
     "IN",
     "IQ",
     "JM",
     "JO",
     "KE",
     "KG",
     "KH",
     "KI",
     "KM",
     "KZ",
     "LA",
     "LC",
     "LK",
     "LR",
     "LS",
     "LY",
     "MA",
     "MG",
     "MH",
     "ML",
     "MN",
     "MR",
     "MU",
     "MV",
     "MW",
     "MZ",
     "NE",
     "NG",
     "NP",
     "NR",
     "NU",
     "PE",
     "PG",
     "PH",
     "PK",
     "PS",
     "PW",
     "PY",
     "RW",
     "SB",
     "SL",
     "SN",
     "SR",
     "SS",
     "ST",
     "SV",
     "TG",
     "TH",
     "TJ",
     "TL",
     "TM",
     "TN",
     "TO",
     "TV",
     "TZ",
     "UA",
     "UG",
     "UZ",
     "VC",
     "VN",
     "VU",
     "WS",
     "ZA",
     "ZM",
     "ZW"
    ],
    "note": "Réservée aux ressortissants des 96 pays désignés pour 2027 par la KOICA, dont le Sénégal, la Côte d'Ivoire, le Cameroun, le Bénin, le Togo, le Burkina Faso, le Mali, le Niger, le Maroc et la Tunisie. La Guinée n'y figure pas. Le programme est en plus réservé aux fonctionnaires nommés par leur gouvernement."
   }
  },
  "motif": "Lot 113 — liste des pays désignés 2027 (guide KOICA, juin 2026) : remplace le groupe CAD, qui laissait passer la Guinée."
 }
];

export const UNIVERSITIES = [];
export const SCHOLARSHIPS = [];
export const LINKS = [];
export const SUPPRESSIONS = [];
