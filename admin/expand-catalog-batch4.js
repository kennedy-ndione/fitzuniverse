// ============================================================
// ScholarBridge — Élargissement du catalogue, Lot 4 (2026-08-13)
// Maroc (Université Mohammed V, Université Hassan II, Université Cadi
// Ayyad, Al Akhawayn University) et Belgique (ULB, ULiège, UNamur,
// Ghent University, KU Leuven). Toutes les URLs de candidature ont un
// contenu réel vérifié (WebFetch/WebSearch) — voir la conversation
// associée pour le détail de la vérification.
//
// Même patron que expand-catalog-batch1.js / batch2.js / batch3.js :
// analyse en lecture seule -> écriture -> vérification automatique.
//
// Deux bourses sur les 6 ne sont PAS "Ouverte" — status et isActive
// reflètent honnêtement leur état réel (le badge public
// Ouverte/Fermée de scholarships.js ne lit que isActive, jamais le
// texte de status) :
// - "bourse-master-in-wbi" (WBI) : deadline 2026 passée (31 mars
//   2026), date 2027 non encore publiée -> isActive: false, status au
//   texte explicite plutôt que "Fermée" pur (ce n'est pas un abandon
//   du programme, juste une échéance non encore annoncée).
// - "icp-connect-scholarships-vlir-uos" (VLIR-UOS) : appel 2026-2027
//   clos, réouverture 2027-2028 prévue mi-novembre 2026 -> isActive:
//   false, status "Fermée".
//
// "mastercard-foundation-scholars-um6p" est un STUB volontaire : pas
// d'université ni de programme reliés dans ce lot (UM6P/Benguerir n'a
// pas encore de photo de ville en stock). Idem pour ARES/UCLouvain,
// absente pour la même raison (Louvain-la-Neuve sans photo) — seules
// ULB/ULiège/UNamur portent ARES ce lot-ci.
//
// >>> PÉRIMÉ DEPUIS LE LOT 6 (2026-08-28). Les deux stubs ont été
// débloqués par expand-catalog-batch6.js, qui a créé UM6P et
// UCLouvain, leurs deux programmes, et RÉÉCRIT le champ
// generalCriteria de la bourse UM6P pour en retirer la mention
// "Stub volontaire" ci-dessous, devenue fausse.
//
// Ce fichier n'est pas modifié pour autant : il consigne ce qui a
// réellement été écrit le 2026-08-13, et le réécrire lui ferait
// mentir sur son propre passage. En revanche, LE RELANCER
// aujourd'hui remettrait l'ancienne valeur et annulerait le lot 6 —
// ces scripts sont ponctuels et ne sont pas censés être rejoués.
//
// Répartition des programmes par pertinence linguistique : ARES et
// WBI (francophones) -> ULB/ULiège/UNamur ; VLIR-UOS (flamand) ->
// Ghent University et KU Leuven uniquement.
//
// assets/flags/ma.svg et assets/flags/be.svg créés dans ce lot
// (n'existaient pas), même style twemoji que les drapeaux déjà en
// stock — nécessaires pour le champ "flag" des 9 universités.
// ============================================================

import { db } from "../firebase-config.js";

import {
collection,
getDocs,
getDoc,
doc,
setDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// -------- Universités (9) --------
const UNIVERSITIES = [
{
id: "universite-mohammed-v-rabat",
data: {
name: "Université Mohammed V de Rabat",
city: "Rabat",
country: "Maroc",
image: "rabat.jpg",
flag: "ma.svg",
ranking: "#1201-1400 mondial (QS 2026)",
description: "Université publique, la plus ancienne institution universitaire moderne du Maroc (fondée en 1957) — environ 1 557 étudiants internationaux par an (source officielle um5.ac.ma).",
officialWebsite: "https://www.um5.ac.ma/",
applicationPortalUrl: "https://www.amci.ma/cooperation-academique",
fields: []
}
},
{
id: "universite-hassan-ii-casablanca",
data: {
name: "Université Hassan II de Casablanca",
city: "Casablanca",
country: "Maroc",
image: "casablanca.jpg",
flag: "ma.svg",
ranking: "Université publique de référence à Casablanca",
description: "Université publique casablancaise, dispose d'un Bureau des Étudiants Internationaux depuis septembre 2024 pour l'accompagnement des candidatures internationales.",
officialWebsite: "https://www.univh2c.ma/",
applicationPortalUrl: "https://www.amci.ma/cooperation-academique",
fields: []
}
},
{
id: "universite-cadi-ayyad-marrakech",
data: {
name: "Université Cadi Ayyad",
city: "Marrakech",
country: "Maroc",
image: "marrakech.jpg",
flag: "ma.svg",
ranking: "#1401+ mondial (QS 2026)",
description: "Université publique de Marrakech, plusieurs facultés et écoles pluridisciplinaires.",
officialWebsite: "https://www.uca.ma/fr",
applicationPortalUrl: "https://www.amci.ma/cooperation-academique",
fields: []
}
},
{
id: "al-akhawayn-university-ifrane",
data: {
name: "Al Akhawayn University",
city: "Ifrane",
country: "Maroc",
image: "ifrane.jpg",
flag: "ma.svg",
ranking: "Université privée à modèle académique américain",
description: "Université privée nichée dans le Moyen Atlas, calquée sur le modèle académique américain (crédits, liberal arts), enseignement intégralement en anglais.",
officialWebsite: "https://aui.ma/",
applicationPortalUrl: "https://aui.ma/admission-aid/graduates/scholarships",
fields: []
}
},
{
id: "universite-libre-de-bruxelles-bruxelles",
data: {
name: "Université Libre de Bruxelles (ULB)",
city: "Bruxelles",
country: "Belgique",
image: "brussels.jpg",
flag: "be.svg",
ranking: "Grande université francophone de Belgique (LERU)",
description: "Fondée en 1834, une des plus grandes universités francophones de Belgique, forte tradition de libre examen et de recherche.",
officialWebsite: "https://www.ulb.be",
applicationPortalUrl: "https://www.ares-ac.be/fr/bourses-de-formations-internationales-2027-2028",
fields: []
}
},
{
id: "universite-de-liege-liege",
data: {
name: "Université de Liège (ULiège)",
city: "Liège",
country: "Belgique",
image: "liege.jpg",
flag: "be.svg",
ranking: "Université de référence en Wallonie",
description: "Université publique de Liège, pluridisciplinaire, forte tradition d'ouverture internationale en Wallonie.",
officialWebsite: "https://www.uliege.be",
applicationPortalUrl: "https://www.ares-ac.be/fr/bourses-de-formations-internationales-2027-2028",
fields: []
}
},
{
id: "universite-de-namur-namur",
data: {
name: "Université de Namur (UNamur)",
city: "Namur",
country: "Belgique",
image: "namur.jpg",
flag: "be.svg",
ranking: "Université de sciences humaines et de recherche en Wallonie",
description: "Université publique namuroise à taille humaine, forte spécialisation en sciences et informatique.",
officialWebsite: "https://www.unamur.be",
applicationPortalUrl: "https://www.ares-ac.be/fr/bourses-de-formations-internationales-2027-2028",
fields: []
}
},
{
id: "ghent-university-gand",
data: {
name: "Ghent University (UGent)",
city: "Gand",
country: "Belgique",
image: "ghent.jpg",
flag: "be.svg",
ranking: "Grande université flamande de recherche",
description: "Fondée en 1817, une des plus grandes universités de Flandre, forte réputation en sciences et sciences de la vie, nombreux masters enseignés en anglais.",
officialWebsite: "https://www.ugent.be",
applicationPortalUrl: "https://www.vliruos.be/en/scholarships",
fields: []
}
},
{
id: "ku-leuven-louvain",
data: {
name: "KU Leuven",
city: "Louvain",
country: "Belgique",
image: "leuven.jpg",
flag: "be.svg",
ranking: "Plus grande université de Belgique",
description: "Fondée en 1425, plus grande université de Belgique, forte réputation en sciences, ingénierie et sciences biomédicales, nombreux programmes de master en anglais.",
officialWebsite: "https://www.kuleuven.be",
applicationPortalUrl: "https://www.vliruos.be/en/scholarships",
fields: []
}
}
];

// -------- Bourses (6, dont 1 stub sans université reliée) --------
const SCHOLARSHIPS = [
{
id: "bourse-gouvernement-maroc-amci",
data: {
title: "Bourse du Gouvernement du Maroc (AMCI)",
country: "Maroc",
funding: "Allocation mensuelle (750 MAD) + logement universitaire prioritaire, scolarité publique marocaine déjà quasi gratuite",
description: "Bourse d'accompagnement du Gouvernement du Maroc, gérée par l'Agence Marocaine de Coopération Internationale (AMCI), pour étudiants internationaux inscrits dans les universités publiques marocaines.",
status: "Ouverte",
isActive: true,
levels: ["Licence", "Master", "Doctorat"],
officialWebsite: "https://www.amci.ma/cooperation-academique",
generalCriteria: "Candidature via le ministère de l'enseignement supérieur du pays d'origine (pas de portail en ligne unique côté AMCI), délai fixé chaque année par ce ministère (donc variable selon le pays), transmission par voie diplomatique."
}
},
{
id: "mastercard-foundation-scholars-um6p",
data: {
title: "Programme Mastercard Foundation Scholars (UM6P)",
country: "Maroc",
funding: "100% (scolarité + logement + vie courante + assurance + billet d'avion annuel)",
description: "Programme de bourses d'excellence de la Mastercard Foundation à l'Université Mohammed VI Polytechnique (UM6P) à Benguerir, réservé aux jeunes femmes africaines, priorité aux profils ruraux, réfugiées, mères ou en situation de handicap. Lancé en novembre 2025.",
status: "Ouverte",
isActive: true,
levels: ["Licence", "Master"],
officialWebsite: "https://mastercardfdn.org/en/what-we-do/our-programs/mastercard-foundation-scholars-program/where-to-apply/universite-mohammed-vi-polytechnique/",
generalCriteria: "Stub volontaire : aucune université ni aucun programme reliés ce lot-ci (UM6P/Benguerir n'a pas encore de photo de ville en stock). Réservé aux jeunes femmes africaines, priorité rural/réfugiées/mères/situation de handicap."
}
},
{
id: "bourses-master-aui",
data: {
title: "Bourses de Master AUI (international)",
country: "Maroc",
funding: "Non quantifié publiquement — avance non remboursable de 10 000 MAD à l'acceptation, 10h/semaine de travail requises",
description: "Bourses de Master d'Al Akhawayn University, réservées à 3 filières : Relations Internationales/Diplomatie (MAISD), Études Nord-Africaines et Moyen-Orientales (NAMES), Études Islamiques (MAIS). Le premier cycle (Licence) d'AUI est réservé aux étudiants marocains et n'est pas concerné par ce programme.",
status: "Ouverte",
isActive: true,
levels: ["Master"],
officialWebsite: "https://aui.ma/admission-aid/graduates/scholarships",
generalCriteria: "Deadlines récurrentes chaque année : 31 mai pour la rentrée d'automne, 31 octobre pour le printemps — prochaine échéance le 31 octobre 2026. Restreint à 3 filières seulement : MAISD (Relations Internationales/Diplomatie), NAMES (Études Nord-Africaines et Moyen-Orientales), MAIS (Études Islamiques). Avance non remboursable de 10 000 MAD exigée à l'acceptation, et 10h/semaine de travail requises sur le campus."
}
},
{
id: "bourses-formations-internationales-ares",
data: {
title: "Bourses de formations internationales (ARES)",
country: "Belgique",
funding: "Frais d'inscription + indemnité mensuelle + billet d'avion + assurance santé/rapatriement",
description: "Bourses de l'Académie de Recherche et d'Enseignement Supérieur (ARES) pour un catalogue de formations spécialisées en Belgique francophone (environ 10 masters + 1 bachelier pour le cycle 2027-2028), ouvertes aux candidats d'une trentaine de pays partenaires.",
status: "Ouverte",
isActive: true,
levels: ["Licence", "Master"],
officialWebsite: "https://www.ares-ac.be/fr/bourses-de-formations-internationales-2027-2028",
generalCriteria: "⚠️ Ce n'est PAS un master au choix : ARES finance un catalogue fixe de formations spécialisées nommées, publié et changeant chaque année (environ 10 masters + 1 bachelier pour le cycle 2027-2028) — consultez ares-ac.be pour la liste à jour avant de présumer qu'une formation précise est éligible. Deadline : 18 septembre 2026, 12h00 (candidature 2027-2028, appel ouvert depuis le 3 août 2026). Ouvert aux candidats d'environ 31 pays partenaires, dont Sénégal, Bénin, Mali, Burkina Faso, Cameroun, RDC, Maroc et Tunisie confirmés."
}
},
{
id: "bourse-master-in-wbi",
data: {
title: "Bourse Master IN (WBI)",
country: "Belgique",
funding: "Jusqu'à 10 000 €/an (inscription, logement max 400 €/mois, billet d'avion, assurance)",
description: "Bourse de Master de Wallonie-Bruxelles International (WBI) pour étudier dans une université de la Fédération Wallonie-Bruxelles.",
status: "Prochaine échéance non encore annoncée",
isActive: false,
levels: ["Master"],
officialWebsite: "https://www.studyinbelgium.be/fr/bourse-master-wbi",
generalCriteria: "La deadline 2026 (31 mars 2026) est passée et la date 2027 n'est pas encore publiée à ce jour. ⚠️ La liste de pays prioritaires de ce programme couvre très peu l'Afrique subsaharienne francophone (seulement Maroc/Tunisie côté Afrique) — moins adapté à ce public que la bourse ARES, à considérer en priorité secondaire."
}
},
{
id: "icp-connect-scholarships-vlir-uos",
data: {
title: "ICP Connect Scholarships (VLIR-UOS)",
country: "Belgique",
funding: "100% (scolarité + logement + voyage + assurance) — pas de bourse partielle",
description: "Bourses complètes du Vlaamse Interuniversitaire Raad (VLIR-UOS) pour des programmes enseignés en anglais dans les universités flamandes de Belgique.",
status: "Fermée",
isActive: false,
levels: ["Licence", "Master"],
officialWebsite: "https://www.vliruos.be/en/scholarships",
generalCriteria: "Enseignement en anglais (pas en néerlandais). Appel 2026-2027 clos, réouverture 2027-2028 prévue mi-novembre 2026. 29 pays éligibles. Limite d'âge : 35 ans (Bachelier professionnel / Master initial) ou 45 ans (Master avancé)."
}
}
];

// -------- Programmes (12) --------
const PROGRAMS = [
{
id: "universite-mohammed-v-rabat__bourse-gouvernement-maroc-amci",
data: {
universityId: "universite-mohammed-v-rabat",
scholarshipId: "bourse-gouvernement-maroc-amci",
level: "Licence / Master / Doctorat",
deadline: "Variable, fixée chaque année par le ministère de l'enseignement supérieur du pays d'origine",
applicationUrl: "https://www.amci.ma/cooperation-academique",
language: "Arabe / Français",
duration: "Variable selon le niveau et la filière",
coverage: "Allocation mensuelle (750 MAD) + logement universitaire prioritaire — scolarité publique marocaine déjà quasi gratuite",
description: "Candidature via le ministère de l'enseignement supérieur du pays d'origine (pas de portail en ligne unique), transmission par voie diplomatique. Admission séparée à l'Université Mohammed V de Rabat requise en parallèle.",
status: "Ouverte",
isActive: true
}
},
{
id: "universite-hassan-ii-casablanca__bourse-gouvernement-maroc-amci",
data: {
universityId: "universite-hassan-ii-casablanca",
scholarshipId: "bourse-gouvernement-maroc-amci",
level: "Licence / Master / Doctorat",
deadline: "Variable, fixée chaque année par le ministère de l'enseignement supérieur du pays d'origine",
applicationUrl: "https://www.amci.ma/cooperation-academique",
language: "Arabe / Français",
duration: "Variable selon le niveau et la filière",
coverage: "Allocation mensuelle (750 MAD) + logement universitaire prioritaire — scolarité publique marocaine déjà quasi gratuite",
description: "Candidature via le ministère de l'enseignement supérieur du pays d'origine (pas de portail en ligne unique), transmission par voie diplomatique. L'Université Hassan II de Casablanca dispose d'un Bureau des Étudiants Internationaux depuis septembre 2024 pour accompagner les candidatures.",
status: "Ouverte",
isActive: true
}
},
{
id: "universite-cadi-ayyad-marrakech__bourse-gouvernement-maroc-amci",
data: {
universityId: "universite-cadi-ayyad-marrakech",
scholarshipId: "bourse-gouvernement-maroc-amci",
level: "Licence / Master / Doctorat",
deadline: "Variable, fixée chaque année par le ministère de l'enseignement supérieur du pays d'origine",
applicationUrl: "https://www.amci.ma/cooperation-academique",
language: "Arabe / Français",
duration: "Variable selon le niveau et la filière",
coverage: "Allocation mensuelle (750 MAD) + logement universitaire prioritaire — scolarité publique marocaine déjà quasi gratuite",
description: "Candidature via le ministère de l'enseignement supérieur du pays d'origine (pas de portail en ligne unique), transmission par voie diplomatique. Admission séparée à l'Université Cadi Ayyad de Marrakech requise en parallèle.",
status: "Ouverte",
isActive: true
}
},
{
id: "al-akhawayn-university-ifrane__bourses-master-aui",
data: {
universityId: "al-akhawayn-university-ifrane",
scholarshipId: "bourses-master-aui",
level: "Master",
deadline: "31 octobre 2026 (rentrée de printemps — prochaine échéance)",
applicationUrl: "https://aui.ma/admission-aid/graduates/scholarships",
language: "Anglais",
duration: "Variable selon le programme de master",
coverage: "Non quantifié publiquement — avance non remboursable de 10 000 MAD à l'acceptation, 10h/semaine de travail requises",
description: "Restreint à 3 filières de master seulement : MAISD (Relations Internationales/Diplomatie), NAMES (Études Nord-Africaines et Moyen-Orientales), MAIS (Études Islamiques). Le premier cycle d'Al Akhawayn University est réservé aux étudiants marocains, non concerné ici.",
status: "Ouverte",
isActive: true
}
},
{
id: "universite-libre-de-bruxelles-bruxelles__bourses-formations-internationales-ares",
data: {
universityId: "universite-libre-de-bruxelles-bruxelles",
scholarshipId: "bourses-formations-internationales-ares",
level: "Licence / Master",
deadline: "18 septembre 2026, 12h00 (candidature 2027-2028)",
applicationUrl: "https://www.ares-ac.be/fr/bourses-de-formations-internationales-2027-2028",
language: "Français",
duration: "Variable selon la formation du catalogue",
coverage: "Frais d'inscription + indemnité mensuelle + billet d'avion + assurance santé/rapatriement",
description: "ARES finance un catalogue fixe de formations spécialisées nommées (pas un master au choix) — consultez ares-ac.be pour vérifier qu'une formation précise de l'Université Libre de Bruxelles y figure avant de candidater.",
status: "Ouverte",
isActive: true
}
},
{
id: "universite-libre-de-bruxelles-bruxelles__bourse-master-in-wbi",
data: {
universityId: "universite-libre-de-bruxelles-bruxelles",
scholarshipId: "bourse-master-in-wbi",
level: "Master",
deadline: "Prochaine échéance non encore annoncée (date 2026 passée le 31 mars 2026)",
applicationUrl: "https://www.studyinbelgium.be/fr/bourse-master-wbi",
language: "Français",
duration: "1 an",
coverage: "Jusqu'à 10 000 €/an (inscription, logement max 400 €/mois, billet d'avion, assurance)",
description: "Liste de pays prioritaires WBI couvrant très peu l'Afrique subsaharienne francophone (Maroc/Tunisie seulement côté Afrique) — moins adapté à ce public que la bourse ARES. Admission séparée à l'Université Libre de Bruxelles requise.",
status: "Prochaine échéance non encore annoncée",
isActive: false
}
},
{
id: "universite-de-liege-liege__bourses-formations-internationales-ares",
data: {
universityId: "universite-de-liege-liege",
scholarshipId: "bourses-formations-internationales-ares",
level: "Licence / Master",
deadline: "18 septembre 2026, 12h00 (candidature 2027-2028)",
applicationUrl: "https://www.ares-ac.be/fr/bourses-de-formations-internationales-2027-2028",
language: "Français",
duration: "Variable selon la formation du catalogue",
coverage: "Frais d'inscription + indemnité mensuelle + billet d'avion + assurance santé/rapatriement",
description: "ARES finance un catalogue fixe de formations spécialisées nommées (pas un master au choix) — consultez ares-ac.be pour vérifier qu'une formation précise de l'Université de Liège y figure avant de candidater.",
status: "Ouverte",
isActive: true
}
},
{
id: "universite-de-liege-liege__bourse-master-in-wbi",
data: {
universityId: "universite-de-liege-liege",
scholarshipId: "bourse-master-in-wbi",
level: "Master",
deadline: "Prochaine échéance non encore annoncée (date 2026 passée le 31 mars 2026)",
applicationUrl: "https://www.studyinbelgium.be/fr/bourse-master-wbi",
language: "Français",
duration: "1 an",
coverage: "Jusqu'à 10 000 €/an (inscription, logement max 400 €/mois, billet d'avion, assurance)",
description: "Liste de pays prioritaires WBI couvrant très peu l'Afrique subsaharienne francophone (Maroc/Tunisie seulement côté Afrique) — moins adapté à ce public que la bourse ARES. Admission séparée à l'Université de Liège requise.",
status: "Prochaine échéance non encore annoncée",
isActive: false
}
},
{
id: "universite-de-namur-namur__bourses-formations-internationales-ares",
data: {
universityId: "universite-de-namur-namur",
scholarshipId: "bourses-formations-internationales-ares",
level: "Licence / Master",
deadline: "18 septembre 2026, 12h00 (candidature 2027-2028)",
applicationUrl: "https://www.ares-ac.be/fr/bourses-de-formations-internationales-2027-2028",
language: "Français",
duration: "Variable selon la formation du catalogue",
coverage: "Frais d'inscription + indemnité mensuelle + billet d'avion + assurance santé/rapatriement",
description: "ARES finance un catalogue fixe de formations spécialisées nommées (pas un master au choix) — consultez ares-ac.be pour vérifier qu'une formation précise de l'Université de Namur y figure avant de candidater.",
status: "Ouverte",
isActive: true
}
},
{
id: "universite-de-namur-namur__bourse-master-in-wbi",
data: {
universityId: "universite-de-namur-namur",
scholarshipId: "bourse-master-in-wbi",
level: "Master",
deadline: "Prochaine échéance non encore annoncée (date 2026 passée le 31 mars 2026)",
applicationUrl: "https://www.studyinbelgium.be/fr/bourse-master-wbi",
language: "Français",
duration: "1 an",
coverage: "Jusqu'à 10 000 €/an (inscription, logement max 400 €/mois, billet d'avion, assurance)",
description: "Liste de pays prioritaires WBI couvrant très peu l'Afrique subsaharienne francophone (Maroc/Tunisie seulement côté Afrique) — moins adapté à ce public que la bourse ARES. Admission séparée à l'Université de Namur requise.",
status: "Prochaine échéance non encore annoncée",
isActive: false
}
},
{
id: "ghent-university-gand__icp-connect-scholarships-vlir-uos",
data: {
universityId: "ghent-university-gand",
scholarshipId: "icp-connect-scholarships-vlir-uos",
level: "Licence / Master",
deadline: "Appel 2026-2027 clos — réouverture 2027-2028 prévue mi-novembre 2026",
applicationUrl: "https://www.vliruos.be/en/scholarships",
language: "Anglais",
duration: "Variable selon le niveau (Bachelier professionnel / Master initial / Master avancé)",
coverage: "100% (scolarité + logement + voyage + assurance) — pas de bourse partielle",
description: "Enseignement en anglais (pas en néerlandais). 29 pays éligibles, limite d'âge 35 ans (Bachelier professionnel/Master initial) ou 45 ans (Master avancé). Admission séparée à Ghent University requise.",
status: "Fermée",
isActive: false
}
},
{
id: "ku-leuven-louvain__icp-connect-scholarships-vlir-uos",
data: {
universityId: "ku-leuven-louvain",
scholarshipId: "icp-connect-scholarships-vlir-uos",
level: "Licence / Master",
deadline: "Appel 2026-2027 clos — réouverture 2027-2028 prévue mi-novembre 2026",
applicationUrl: "https://www.vliruos.be/en/scholarships",
language: "Anglais",
duration: "Variable selon le niveau (Bachelier professionnel / Master initial / Master avancé)",
coverage: "100% (scolarité + logement + voyage + assurance) — pas de bourse partielle",
description: "Enseignement en anglais (pas en néerlandais). 29 pays éligibles, limite d'âge 35 ans (Bachelier professionnel/Master initial) ou 45 ans (Master avancé). Admission séparée à KU Leuven requise.",
status: "Fermée",
isActive: false
}
}
];

function log(el, message, cls = "") {
el.classList.add("is-visible");
const line = document.createElement("div");
if (cls) line.className = cls;
line.textContent = message;
el.appendChild(line);
el.scrollTop = el.scrollHeight;
}

// ==========================================================
// Étape 1 — analyse
// ==========================================================

let lastPlan = null;

const analyzeBtn = document.getElementById("analyzeBtn");
const analyzeLog = document.getElementById("analyzeLog");
const writeBtn = document.getElementById("writeBtn");
const writeLog = document.getElementById("writeLog");
const verifyBtn = document.getElementById("verifyBtn");
const verifyLog = document.getElementById("verifyLog");

analyzeBtn.addEventListener("click", async () => {

analyzeBtn.disabled = true;
analyzeLog.innerHTML = "";

try {

const universitiesSnap = await getDocs(collection(db, "universities"));
const existingUniversityIds = new Set(universitiesSnap.docs.map((d) => d.id));

const universityCollisions = UNIVERSITIES.filter((u) => existingUniversityIds.has(u.id));

if (universityCollisions.length) {
log(analyzeLog, `${universityCollisions.length} id(s) d'université collisionnent déjà avec un document existant :`, "err");
universityCollisions.forEach((u) => log(analyzeLog, `  - ${u.id}`, "err"));
} else {
log(analyzeLog, `${UNIVERSITIES.length}/9 identifiants d'université libres.`, "ok");
}

const scholarshipsSnap = await getDocs(collection(db, "scholarships"));
const existingScholarshipIds = new Set(scholarshipsSnap.docs.map((d) => d.id));

const scholarshipCollisions = SCHOLARSHIPS.filter((s) => existingScholarshipIds.has(s.id));

if (scholarshipCollisions.length) {
log(analyzeLog, `${scholarshipCollisions.length} id(s) de bourse collisionnent déjà avec un document existant :`, "err");
scholarshipCollisions.forEach((s) => log(analyzeLog, `  - ${s.id}`, "err"));
} else {
log(analyzeLog, `${SCHOLARSHIPS.length}/6 identifiants de bourse libres.`, "ok");
}

const programsSnap = await getDocs(collection(db, "programs"));
const existingProgramIds = new Set(programsSnap.docs.map((d) => d.id));

const programCollisions = PROGRAMS.filter((p) => existingProgramIds.has(p.id));

if (programCollisions.length) {
log(analyzeLog, `${programCollisions.length} id(s) de programme collisionnent déjà avec un document existant :`, "err");
programCollisions.forEach((p) => log(analyzeLog, `  - ${p.id}`, "err"));
} else {
log(analyzeLog, `${PROGRAMS.length}/12 identifiants de programme libres.`, "ok");
}

const hasBlockingIssue = universityCollisions.length || scholarshipCollisions.length || programCollisions.length;

if (hasBlockingIssue) {
log(analyzeLog, "Anomalie(s) détectée(s) — corriger avant de passer à l'étape 2.", "err");
return;
}

lastPlan = true;

log(analyzeLog, "Analyse terminée, aucune anomalie. Vérifiez le détail ci-dessus avant de passer à l'étape 2.", "ok");

writeBtn.disabled = false;

} catch (error) {

console.error(error);
log(analyzeLog, `Erreur : ${error.message}`, "err");

} finally {

analyzeBtn.disabled = false;

}

});

// ==========================================================
// Étape 2 — écriture
// ==========================================================

writeBtn.addEventListener("click", async () => {

if (!lastPlan) return;

const confirmed = confirm(
`Créer ${UNIVERSITIES.length} université(s), ${SCHOLARSHIPS.length} bourse(s) et ${PROGRAMS.length} programme(s) ? Cette action écrit en base de production.`
);

if (!confirmed) return;

writeBtn.disabled = true;
writeLog.innerHTML = "";

try {

log(writeLog, "Écriture des universités...");

for (const u of UNIVERSITIES) {
await setDoc(doc(db, "universities", u.id), u.data);
log(writeLog, `  - ${u.data.name} (${u.id}) écrit.`);
}

log(writeLog, `${UNIVERSITIES.length} université(s) écrite(s).`, "ok");

log(writeLog, "Écriture des bourses...");

for (const s of SCHOLARSHIPS) {
await setDoc(doc(db, "scholarships", s.id), s.data);
log(writeLog, `  - ${s.data.title} (${s.id}) écrit.`);
}

log(writeLog, `${SCHOLARSHIPS.length} bourse(s) écrite(s).`, "ok");

log(writeLog, "Écriture des programmes...");

for (const p of PROGRAMS) {
await setDoc(doc(db, "programs", p.id), p.data);
log(writeLog, `  - ${p.id} écrit.`);
}

log(writeLog, `${PROGRAMS.length} programme(s) écrit(s).`, "ok");
log(writeLog, "Étape 2 terminée. Lancez l'étape 3 pour vérifier automatiquement.", "ok");

verifyBtn.disabled = false;

} catch (error) {

console.error(error);
log(writeLog, `Erreur : ${error.message}`, "err");

} finally {

writeBtn.disabled = false;

}

});

// ==========================================================
// Étape 3 — vérification automatique. Relit chaque document créé et
// compare CHAQUE champ attendu (comparaison de valeur exacte), pas un
// simple "existe".
// ==========================================================

verifyBtn.addEventListener("click", async () => {

if (!lastPlan) return;

verifyBtn.disabled = true;
verifyLog.innerHTML = "";
log(verifyLog, "Relecture de Firestore après écriture...");

try {

let ok = 0;
let mismatch = 0;

for (const u of UNIVERSITIES) {
const snap = await getDoc(doc(db, "universities", u.id));
const current = snap.exists() ? snap.data() : null;
const fieldsMatch = current && Object.keys(u.data).every((key) => JSON.stringify(current[key]) === JSON.stringify(u.data[key]));
if (fieldsMatch) {
ok++;
} else {
mismatch++;
log(verifyLog, `MISMATCH université ${u.id} : document ${current ? "trouvé mais différent" : "introuvable"}.`, "err");
}
}

for (const s of SCHOLARSHIPS) {
const snap = await getDoc(doc(db, "scholarships", s.id));
const current = snap.exists() ? snap.data() : null;
const fieldsMatch = current && Object.keys(s.data).every((key) => JSON.stringify(current[key]) === JSON.stringify(s.data[key]));
if (fieldsMatch) {
ok++;
} else {
mismatch++;
log(verifyLog, `MISMATCH bourse ${s.id} : document ${current ? "trouvé mais différent" : "introuvable"}.`, "err");
}
}

for (const p of PROGRAMS) {
const snap = await getDoc(doc(db, "programs", p.id));
const current = snap.exists() ? snap.data() : null;
const fieldsMatch = current && Object.keys(p.data).every((key) => JSON.stringify(current[key]) === JSON.stringify(p.data[key]));
if (fieldsMatch) {
ok++;
} else {
mismatch++;
log(verifyLog, `MISMATCH programme ${p.id} : document ${current ? "trouvé mais différent" : "introuvable"}.`, "err");
}
}

const total = UNIVERSITIES.length + SCHOLARSHIPS.length + PROGRAMS.length;

log(verifyLog, `${ok}/${total} document(s) confirmé(s) en base, champ par champ.`, mismatch === 0 ? "ok" : "err");

if (mismatch === 0) {
log(verifyLog, "ÉCRITURE EN BASE CONFIRMÉE — lot 4 terminé, 0 écart.", "ok");
} else {
log(verifyLog, `ÉCHEC — ${mismatch} écart(s) détecté(s), voir le détail ci-dessus.`, "err");
}

} catch (error) {

console.error(error);
log(verifyLog, `Erreur : ${error.message}`, "err");

} finally {

verifyBtn.disabled = false;

}

});
