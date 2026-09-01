// ============================================================
// FitzUniverse — Élargissement du catalogue, Lot 19 (2026-08-30)
//
// Consolide les 5 premiers des 10 pays qui n'avaient qu'UNE SEULE
// bourse au catalogue : Royaume-Uni, Allemagne, Japon, Corée du Sud,
// Turquie. Crée 44 bourses, met à jour 5 bourses existantes, et crée
// 18 programmes reliant les nouvelles bourses aux universités DÉJÀ
// en base. Ne crée AUCUNE université (aucune photo neuve requise).
//
// Toutes les données proviennent de pages officielles chargées et
// vérifiées le 30/08/2026 (gouvernements, fondations, universités).
// Aucun site agrégateur n'a servi de source chiffrée.
//
// CONVENTION DE STATUT retenue pour ce lot, à connaître avant de
// relire les champs "status" :
//   "Ouverte" = on peut candidater au 30/08/2026, OU la prochaine
//               fenêtre a une date d'ouverture publiée à moins de
//               6 semaines.
//   "Fermée"  = cycle clos, prochaine fenêtre lointaine ou non datée.
// La fenêtre exacte est TOUJOURS écrite dans generalCriteria, afin
// qu'aucun étudiant ne se fie au seul badge de statut.
//
// Patron de sécurité identique aux lots précédents : les 5 bourses à
// mettre à jour et les 9 universités à relier sont résolues EN DIRECT
// par recherche de titre/nom à l'étape 1 — aucun id supposé connu.
// Étape 1 lecture seule → étape 2 écriture → étape 3 vérification
// champ par champ.
// ============================================================

import { db } from "../firebase-config.js";

import {
collection,
getDocs,
getDoc,
doc,
setDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

function normalize(str) {
return String(str || "")
.replace(/ı/g, "i")
.replace(/İ/g, "i")
.normalize("NFD")
.replace(/[̀-ͯ]/g, "")
.toLowerCase()
.trim();
}

// ==========================================================
// A. Bourses EXISTANTES à mettre à jour (résolues par titre)
// ==========================================================

const SCHOLARSHIP_UPDATES = [
{
key: "chevening",
label: "Chevening Scholarships",
match: (t) => normalize(t).includes("chevening"),
// Le site officiel affichait "Applications are now open" au 30/08/2026.
patch: {
status: "Ouverte",
officialWebsite: "https://www.chevening.org/scholarships/",
generalCriteria: "Ouverte aux ressortissants sénégalais — le Sénégal figure sur la liste des pays éligibles. Exige au moins 2 ans (2 800 heures) d'expérience professionnelle, une licence permettant l'admission en master britannique, et 3 choix de master d'un an. Le calendrier précis figure sur la page « Application timeline » du site officiel : le cycle s'ouvre traditionnellement en août et se ferme début novembre. Retour obligatoire au pays pendant 2 ans après le diplôme."
}
},
{
key: "gks",
label: "Global Korea Scholarship",
match: (t) => normalize(t).includes("global korea") || normalize(t).includes("gks"),
// L'ancienne URL NIIED (allnew_invite.do) renvoie 404 : portail refondu.
patch: {
officialWebsite: "https://www.studyinkorea.go.kr/en/plan/scholarship.do?tab=gks-tab1",
funding: "Allocation mensuelle de 1 000 000 KRW ; allocation d'installation de 200 000 KRW à l'arrivée ; billet d'avion aller-retour en classe économique ; frais de scolarité pris en charge (NIIED + université) et frais d'inscription exonérés ; 1 an de cours de coréen intégralement couvert ; assurance médicale 20 000 KRW/mois ; prime TOPIK niveau 5-6 de 100 000 KRW/mois ; impression du mémoire 500 000 à 800 000 KRW ; allocation de recherche 210 000 KRW (sciences humaines) ou 240 000 KRW (sciences et ingénierie).",
generalCriteria: "DEUX PROGRAMMES DISTINCTS, aux calendriers sans recouvrement : GKS-U (Licence) — candidatures mi-septembre à fin septembre, cycle 2027 attendu vers le 15 septembre 2026 ; GKS-G (Master/Doctorat) — candidatures mi-février à fin février, cycle 2027 attendu vers février 2027. DEUX CANAUX à quotas séparés : par l'ambassade de Corée (quota national — l'ambassade au Sénégal publie les appels en français) ou en direct auprès d'une université désignée GKS. Le nombre de places attribuées au Sénégal n'est pas publié. « KGSP » et « Korean Government Scholarship Program » sont l'ANCIEN nom du GKS, pas des programmes distincts.",
status: "Ouverte"
}
},
{
key: "mext",
label: "MEXT Scholarship",
match: (t) => normalize(t).includes("mext"),
patch: {
funding: "Allocation mensuelle de 143 000 ¥ (étudiant préparatoire ou non-régulier), 144 000 ¥ (master, cursus professionnel) ou 145 000 ¥ (doctorat), majorée de 2 000 à 3 000 ¥ selon la région d'affectation ; frais d'examen, d'inscription et de scolarité intégralement exonérés ; billet d'avion aller-retour en classe économique.",
generalCriteria: "DEUX CANAUX à ne pas confondre. Canal AMBASSADE : au Sénégal, dépôt par courriel à l'ambassade du Japon à Dakar (culture-sn@dk.mofa.go.jp), examen écrit et entretien à l'ambassade fin juin ou début juillet. Le cycle MEXT 2027 s'est clos le 1er juin 2026 ; le prochain appel (MEXT 2028) est attendu vers la mi-avril 2027. Canal RECOMMANDATION UNIVERSITAIRE : calendrier propre à chaque université japonaise, généralement en décembre — voir la fiche Waseda GSAPS du catalogue.",
status: "Fermée"
}
},
{
key: "turkiye",
label: "Türkiye Bursları",
match: (t) => normalize(t).includes("turkiye burslari"),
patch: {
funding: "Allocation mensuelle de 4 500 TL (Associate et Licence), 6 500 TL (Master) ou 9 000 TL (Doctorat) — DOUBLÉE pour les lauréats distingués « Merit / Üstün Başarı » ; frais de scolarité intégralement couverts ; logement en résidence universitaire gratuit toute la durée du cursus pour les licences, mais LA PREMIÈRE ANNÉE SEULEMENT pour les niveaux gradués, remplacé ensuite par une allocation logement de 6 000 TL (Istanbul, Ankara) ou 5 000 TL (ailleurs) ; 1 an de cours de turc gratuit ; assurance santé complète ; un billet d'avion aller-retour.",
generalCriteria: "Candidatures du 10 janvier au 20 février chaque année ; évaluation en mars-avril, entretiens d'avril à juin, résultats début août. Le cycle 2026 est clos (résultats tombés début août 2026) — réouverture le 10 janvier 2027. Limites d'âge : moins de 21 ans (Associate, Licence), moins de 30 ans (Master), moins de 35 ans (Doctorat). Notes minimales : 70 % (Associate, Licence), 75 % (troisième cycle), 90 % (médecine, dentaire, pharmacie). Jusqu'à 12 choix d'université et de département. Exclus : citoyens et anciens citoyens turcs, et toute personne déjà inscrite dans une université turque au même niveau d'études. ATTENTION : la page anglaise de ytb.gov.tr diffuse encore des montants périmés (3 500 à 12 000 TL) — la source qui fait foi est turkiyeburslari.gov.tr.",
status: "Fermée"
}
},
{
key: "daad",
label: "DAAD Study Scholarships",
match: (t) => normalize(t).includes("daad"),
patch: {
funding: "992 €/mois pour les diplômés (niveau master) et 1 300 €/mois pour les doctorants, plus une allocation de voyage, une assurance maladie, accident et responsabilité civile, et une prise en charge des cours de langue. ATTENTION : la fiche EPOS de la base de données DAAD affiche encore 934 €/mois pour les diplômés — les deux chiffres sont officiels et se contredisent, faire confirmer par le programme visé.",
officialWebsite: "https://www.daad.de/en/studying-in-germany/scholarships/daad-scholarships/"
}
}
];

// ==========================================================
// B. Universités DÉJÀ en base auxquelles rattacher des bourses
//    (résolues par nom à l'étape 1 — aucun id supposé)
// ==========================================================

const UNIVERSITY_LOOKUPS = [
{ key: "oxford", label: "University of Oxford", match: (n) => normalize(n).includes("university of oxford") },
{ key: "edinburgh", label: "University of Edinburgh", match: (n) => normalize(n).includes("university of edinburgh") },
{ key: "imperial", label: "Imperial College London", match: (n) => normalize(n).includes("imperial college london") },
{ key: "hamburg", label: "Universität Hamburg", match: (n) => normalize(n).includes("universitat hamburg") },
{ key: "hannover", label: "Leibniz Universität Hannover", match: (n) => normalize(n).includes("leibniz universitat hannover") },
{ key: "humboldt", label: "Humboldt-Universität zu Berlin", match: (n) => normalize(n).includes("humboldt") },
{ key: "utokyo", label: "University of Tokyo", match: (n) => normalize(n).includes("university of tokyo") },
{ key: "waseda", label: "Waseda University", match: (n) => normalize(n).includes("waseda") },
{ key: "koreauni", label: "Korea University", match: (n) => normalize(n).includes("korea university") }
];

// ==========================================================
// C. Les 44 nouvelles bourses
// ==========================================================

const SCHOLARSHIPS = [

// ---------- ROYAUME-UNI (11) ----------
{
id: "commonwealth-masters-scholarships",
data: {
title: "Commonwealth Master's Scholarships",
country: "Royaume-Uni",
funding: "Frais de scolarité intégraux ; allocation de subsistance de 1 712 £/mois, portée à 2 000 £/mois dans la zone métropolitaine de Londres ; billet d'avion aller-retour depuis le pays d'origine ; bourse de voyage d'étude ; allocation enfant le cas échéant (622 £/mois pour le premier enfant, 154 £/mois pour les deuxième et troisième de moins de 16 ans).",
description: "Programme phare du gouvernement britannique (FCDO) pour les pays du Commonwealth à revenu faible ou intermédiaire. Contrairement à Chevening, il ne suppose pas un profil de « futur leader » et finance aussi les masters de recherche.",
status: "Ouverte",
isActive: true,
levels: ["Master"],
officialWebsite: "https://cscuk.fcdo.gov.uk/scholarships/commonwealth-masters-scholarships/",
generalCriteria: "RÉSERVÉE AUX PAYS DU COMMONWEALTH — le Sénégal n'est PAS éligible. En Afrique de l'Ouest : Gambie, Ghana, Nigeria, Sierra Leone, Togo. Ailleurs en Afrique : Botswana, Eswatini, Kenya, Lesotho, Malawi, Maurice, Mozambique, Namibie, Rwanda, Afrique du Sud, Tanzanie, Ouganda, Zambie. Licence de niveau upper second-class (2:1) minimum, incapacité à financer ses études sans la bourse, engagement de retour au pays. Candidature par une AGENCE NATIONALE DE NOMINATION, jamais en direct. Cycle 2027/28 : ouverture le 8 septembre 2026, clôture le 20 octobre 2026 à 16h00 BST, résultats d'ici juillet 2027."
}
},
{
id: "commonwealth-phd-scholarships",
data: {
title: "Commonwealth PhD Scholarships",
country: "Royaume-Uni",
funding: "Frais de scolarité intégraux ; allocation de 1 712 £/mois (2 000 £/mois à Londres) ; billet d'avion aller-retour ; bourse de voyage d'étude ; prise en charge des frais de terrain ; un billet pour une visite au pays à mi-parcours ; allocations familiales le cas échéant.",
description: "Volet doctoral du dispositif Commonwealth, réservé aux pays les moins avancés et aux « petits États vulnérables » — la liste de pays éligibles y est nettement plus courte qu'au niveau master.",
status: "Ouverte",
isActive: true,
levels: ["Doctorat"],
officialWebsite: "https://cscuk.fcdo.gov.uk/scholarships/commonwealth-phd-scholarships/",
generalCriteria: "17 pays éligibles seulement. En Afrique de l'Ouest : Gambie, Nigeria, Sierra Leone, Togo — ni le Sénégal ni le Ghana ne sont éligibles au doctorat. Ailleurs : Lesotho, Malawi, Mozambique, Rwanda, Tanzanie, Ouganda, Zambie. Licence 2:1 minimum, ne pas être déjà inscrit en doctorat, besoin financier démontré, engagement de retour. Candidature par une agence nationale de nomination ou une ONG agréée. Cycle 2027/28 : ouverture le 8 septembre 2026, clôture le 20 octobre 2026 à 16h00 BST ; début des études en septembre-octobre 2027."
}
},
{
id: "commonwealth-shared-scholarships",
data: {
title: "Commonwealth Shared Scholarships",
country: "Royaume-Uni",
funding: "Frais de scolarité intégraux ; allocation de 1 452 £/mois, portée à 1 781 £/mois en zone métropolitaine de Londres ; billet d'avion aller-retour ; allocation vêtements chauds ; bourse de mémoire ; bourse de voyage d'étude ; contribution au test de tuberculose si le visa l'exige ; allocation enfant (622 £ puis 154 £/mois).",
description: "Cofinancée à parts égales par le FCDO et l'université d'accueil. C'est la voie la plus accessible du dispositif Commonwealth : la candidature se dépose directement auprès de l'université britannique, sans passer par une agence nationale.",
status: "Fermée",
isActive: true,
levels: ["Master"],
officialWebsite: "https://cscuk.fcdo.gov.uk/scholarships/commonwealth-shared-scholarships-applications/",
generalCriteria: "43 pays du Commonwealth éligibles, dont le Ghana et le Nigeria en Afrique de l'Ouest — le Sénégal n'est pas éligible. Licence 2:1 minimum ; NE PAS AVOIR ÉTUDIÉ PLUS D'UN AN ACADÉMIQUE dans un pays à revenu élevé ; besoin financier démontré. Se candidate sur une liste fermée de cours éligibles, université par université. Le cycle 2026/27 est clos (nominations universitaires en mars 2026) ; les dates du cycle 2027/28 ne sont pas publiées au 30/08/2026."
}
},
{
id: "great-scholarships",
data: {
title: "GREAT Scholarships",
country: "Royaume-Uni",
funding: "10 000 £ minimum en réduction des frais de scolarité, porté à 15 000 £ dans certaines universités dont Imperial College London. AUCUNE allocation de subsistance, aucun billet d'avion, aucune assurance : c'est une bourse PARTIELLE, à combiner impérativement avec un autre financement.",
description: "Dispositif conjoint du British Council et de la campagne gouvernementale GREAT Britain : plus de 140 bourses offertes par plus de 60 universités pour l'année 2026-27.",
status: "Fermée",
isActive: true,
levels: ["Master"],
officialWebsite: "https://study-uk.britishcouncil.org/scholarships-funding/great-scholarships",
generalCriteria: "18 pays éligibles ; en Afrique, seuls le Nigeria, le Ghana et l'Égypte — le Sénégal n'est pas éligible. Il faut le passeport ET la résidence du pays éligible, le statut de frais « Overseas », et s'inscrire à un master enseigné d'un an sur campus. IL N'EXISTE AUCUNE DATE UNIQUE : chaque université fixe sa propre échéance et sa propre liste de nationalités. Toutes les échéances du cycle 2026-27 vérifiées sont dépassées ; le cycle 2027-28 sera annoncé université par université."
}
},
{
id: "clarendon-fund-scholarships",
data: {
title: "Clarendon Fund Scholarships",
country: "Royaume-Uni",
funding: "Frais de scolarité intégraux et une allocation de subsistance versée pendant toute la durée d'assujettissement aux frais. Le montant exact de l'allocation n'est pas publié sur les pages officielles du Clarendon Fund.",
description: "Plus de 200 bourses entièrement financées par an, SANS AUCUNE restriction de nationalité, de résidence ni de discipline — le plus grand programme de bourses complètes d'Oxford, attribué au seul mérite académique.",
status: "Ouverte",
isActive: true,
levels: ["Master", "Doctorat"],
officialWebsite: "https://www.ox.ac.uk/clarendon/information-for-applicants/eligibility",
generalCriteria: "Ouverte à TOUS les pays africains, Sénégal compris. Il faut détenir une offre d'admission pour un master ou un DPhil à temps plein ou partiel (les PG Certificates et Diplomas sont exclus). AUCUNE CANDIDATURE SÉPARÉE : l'examen est automatique pour qui candidate au cours avant l'échéance de financement de décembre ou de janvier, propre à chaque cours — vérifier la date sur la page du cours visé. Cycle 2027-28 en cours sur les échéances de décembre 2026 et janvier 2027."
}
},
{
id: "weidenfeld-hoffmann-scholarships",
data: {
title: "Weidenfeld-Hoffmann Scholarships and Leadership Programme",
country: "Royaume-Uni",
funding: "100 % des frais de scolarité et une allocation de subsistance d'au moins 20 780 £ par an.",
description: "Combine le financement complet et un programme structuré de développement du leadership (mentorat, séminaires), en ciblant explicitement les futurs dirigeants des pays en développement — c'est la meilleure porte d'entrée à Oxford pour l'Afrique de l'Ouest francophone.",
status: "Ouverte",
isActive: true,
levels: ["Master"],
officialWebsite: "https://www.ox.ac.uk/admissions/graduate/fees-and-funding/fees-funding-and-scholarship-search/weidenfeld-hoffmann-scholarships-and-leadership-programme",
generalCriteria: "LE SÉNÉGAL EST EXPLICITEMENT ÉLIGIBLE, de même que le Ghana, la Côte d'Ivoire, la Guinée, le Mali, le Nigeria et la Sierra Leone. Il faut candidater à un cours éligible avant l'échéance de décembre ou de janvier propre à ce cours, et s'engager à rentrer contribuer au développement de sa région. Aucune date unique n'est publiée. La page officielle décrivait encore le cycle 2026-27 au 30/08/2026 — vérifier sa mise à jour pour 2027-28."
}
},
{
id: "reach-oxford-scholarship",
data: {
title: "Reach Oxford Scholarship",
country: "Royaume-Uni",
funding: "Frais de scolarité, allocation de subsistance et un billet d'avion aller-retour par an, pendant les 3 ou 4 ans du cursus. Les montants ne sont pas publiés.",
description: "L'une des très rares bourses de PREMIER CYCLE entièrement financées au Royaume-Uni pour des étudiants de pays en développement. Extrêmement sélective : 2 à 3 attributions par an seulement.",
status: "Fermée",
isActive: true,
levels: ["Licence"],
officialWebsite: "https://www.ox.ac.uk/admissions/undergraduate/fees-and-funding/oxford-bursaries-and-scholarships/reach-oxford",
generalCriteria: "Ouverte aux pays de la liste CAD de l'OCDE, SÉNÉGAL INCLUS. Il faut détenir une offre d'admission d'Oxford, qu'il s'agisse d'un premier cursus de premier cycle, et démontrer un besoin financier. LA MÉDECINE EST EXCLUE. Le cycle 2026 est clos (échéance du 4 février 2026, résultats fin mai 2026) ; les modalités pour l'entrée 2027 seront publiées en janvier 2027."
}
},
{
id: "rhodes-scholarships-west-africa",
data: {
title: "The Rhodes Scholarships for West Africa",
country: "Royaume-Uni",
funding: "Frais de scolarité et allocation de subsistance à Oxford. Les montants ne sont pas chiffrés sur les pages officielles accessibles — le règlement renvoie aux « Conditions of Tenure ».",
description: "Circonscription Rhodes dédiée à l'Afrique de l'Ouest, couvrant 20 pays dont toute l'Afrique de l'Ouest francophone : le seul grand programme de prestige britannique où un candidat sénégalais concourt contre ses voisins plutôt que contre le monde entier.",
status: "Fermée",
isActive: true,
levels: ["Master", "Doctorat"],
officialWebsite: "https://www.rhodeshouse.ox.ac.uk/scholarships/applications/west-africa/",
generalCriteria: "Pays éligibles : Bénin, Burkina Faso, Cabo Verde, Côte d'Ivoire, Gambie, Ghana, Guinée, Guinée-Bissau, Liberia, Mali, Mauritanie, Niger, Nigeria, SÉNÉGAL, Sierra Leone, São Tomé-et-Príncipe, Togo, et Sainte-Hélène/Ascension/Tristan da Cunha. Citoyenneté d'un de ces pays ET résidence dans un ou plusieurs d'entre eux pendant au moins 5 des 10 dernières années. Âge au 1er octobre de l'année d'entrée : 18-24 ans (18-25 ans pour médecine, dentaire, pharmacie, droit et ingénierie ; moins de 27 ans si la licence a été obtenue très récemment). Niveau First Class Honours ou équivalent. La cohorte 2027 s'est close le 27 août 2026 ; prochaine ouverture attendue vers juin 2027."
}
},
{
id: "imperial-presidents-phd-scholarships",
data: {
title: "Imperial College London President's PhD Scholarships",
country: "Royaume-Uni",
funding: "Frais de scolarité intégraux ; allocation de 26 500 £ par an (taux 2026-27) pendant 3,5 ans ; 2 000 £ par an de budget consommables pendant les trois premières années ; accès aux programmes de l'Early Career Researcher Institute.",
description: "50 bourses doctorales par an, sans aucune restriction de nationalité, avec une allocation nettement supérieure au taux UKRI standard — l'offre doctorale la plus généreuse des universités britanniques du catalogue.",
status: "Fermée",
isActive: true,
levels: ["Doctorat"],
officialWebsite: "https://www.imperial.ac.uk/study/fees-and-funding/postgraduate-doctoral/grants-scholarships/presidents-phd/",
generalCriteria: "Ouverte à TOUS les pays africains, Sénégal compris — aucune restriction de nationalité. Licence ou master intégré mention First Class, ou master autonome mention Distinction ; les parcours atypiques à fort potentiel de recherche sont également considérés. Le cycle se déroule en TROIS VAGUES : pour 2026-27, échéances du 3 novembre 2025, du 12 janvier 2026 et du 2 mars 2026 — toutes dépassées. Les vagues 2027-28 sont attendues à l'automne 2026."
}
},
{
id: "mastercard-foundation-edinburgh",
data: {
title: "Mastercard Foundation Scholars Program (University of Edinburgh)",
country: "Royaume-Uni",
funding: "Frais de scolarité approuvés intégraux, hébergement, frais de voyage, allocation de subsistance et matériel d'étude ; participation au Climate Leadership Programme et à la Climate Enterprise School ; accompagnement handicap et accompagnement à la transition. Les montants ne sont pas publiés.",
description: "Programme entièrement axé sur le leadership climatique, décliné en trois formats — master d'un an sur campus, master en ligne à temps partiel sur 3 ans, diplôme de troisième cycle en ligne sur 2 ans. Les formats en ligne permettent d'étudier sans quitter le Sénégal.",
status: "Ouverte",
isActive: true,
levels: ["Master"],
officialWebsite: "https://edinburgh-global.ed.ac.uk/mastercard-foundation-scholars-program/apply-for-a-scholarship/eligibility",
generalCriteria: "Ouverte à TOUS les pays africains, Afrique du Nord comprise — Sénégal explicitement éligible. Être résident ET citoyen d'un pays africain, ou y avoir le statut de réfugié ; 35 ans ou moins pour 2027/28 (né le 1er janvier 1992 ou après) ; équivalent d'une licence britannique Second Class Upper minimum ; NE PAS déjà détenir un diplôme de troisième cycle pour la voie master ; leadership et engagement communautaire démontrés ; avoir rencontré des obstacles significatifs à l'éducation. Cycle 2027/28 : SÉANCES D'INFORMATION OBLIGATOIRES du 15 au 24 septembre 2026, ouverture des candidatures le 13 octobre 2026, clôture le 19 novembre 2026 à 17h00 heure britannique."
}
},
{
id: "mastercard-foundation-afox-oxford",
data: {
title: "Mastercard Foundation Scholars Program at the University of Oxford (AfOx)",
country: "Royaume-Uni",
funding: "Frais de scolarité pour toute la durée du cours ; subsistance au taux minimum de l'allocation doctorale UKRI ; billet d'avion aller-retour en classe économique ; FRAIS DE VISA ET SURTAXE SANTÉ (IHS) pris en charge ; allocation d'installation ; accès au Thrive Fund pour les urgences.",
description: "Le seul dispositif d'Oxford qui couvre explicitement le visa, la surtaxe santé et le billet d'avion en plus des frais et de la subsistance — le paquet le plus complet identifié pour un candidat africain.",
status: "Fermée",
isActive: true,
levels: ["Master"],
officialWebsite: "https://www.afox.ox.ac.uk/education/mastercard-foundation-scholars-program-at-the-university-of-oxford",
generalCriteria: "Ouverte à TOUS les pays africains, Sénégal compris. Être citoyen d'un pays africain ET y résider habituellement ; candidater à un master enseigné d'un an éligible (systèmes alimentaires, sciences de la santé, eau et énergie, gouvernance, entrepreneuriat…) via le portail d'admission de troisième cycle d'Oxford. Depuis 2026/27 s'ajoute un PG Dip in Global Health Research de 14 mois. Le cycle d'entrée 2026/27 courait de septembre 2025 à janvier 2026 ; les dates du cycle suivant ne sont pas publiées au 30/08/2026."
}
},

// ---------- ALLEMAGNE (9) ----------
{
id: "daad-epos",
data: {
title: "DAAD Development-Related Postgraduate Courses (EPOS)",
country: "Allemagne",
funding: "934 €/mois pour les diplômés ou 1 300 €/mois pour les doctorants ; assurance maladie, accident et responsabilité civile ; allocation de voyage ; forfait loyer mensuel ; allocations familiales. Exonération des frais de scolarité dans les cursus concernés.",
description: "La ligne DAAD la plus pertinente pour l'Afrique : une quarantaine de masters et doctorats sélectionnés, orientés développement, financés par le ministère fédéral de la Coopération (BMZ) et destinés à des professionnels déjà en poste.",
status: "Ouverte",
isActive: true,
levels: ["Master", "Doctorat"],
officialWebsite: "https://www.daad.de/go/en/stipa50076777",
generalCriteria: "Réservée aux pays en développement de la liste CAD référencée par le DAAD. Licence (généralement 4 ans) et AU MOINS 2 ANS D'EXPÉRIENCE PROFESSIONNELLE après la licence — stages et bénévolat exclus ; diplôme de moins de 6 ans ; résultats dans le tiers supérieur de la promotion ; pas plus de 15 mois de résidence en Allemagne. Anglais IELTS 6 ou TOEFL, ou allemand B1 selon le cursus. LE CALENDRIER EST PROPRE À CHAQUE CURSUS et la candidature bourse se dépose environ un an avant l'admission — exemple vérifié : MSc Environmental Governance à l'université de Fribourg, du 15 juin au 15 octobre 2026 pour une rentrée au semestre d'hiver 2027/28."
}
},
{
id: "daad-helmut-schmidt-programme",
data: {
title: "DAAD Helmut-Schmidt-Programme (Public Policy and Good Governance)",
country: "Allemagne",
funding: "Bourse de subsistance mensuelle (le montant exact n'est pas publié sur les pages accessibles ; le tarif DAAD général pour diplômés est de 992 €/mois), exonération des frais de scolarité, et un cours d'allemand de 4 mois en Allemagne intégralement pris en charge, démarrant en juin.",
description: "Masters en politiques publiques, gouvernance, relations internationales et études de paix et conflits, enseignés en anglais, avec tutorat et mise en réseau — profil « futurs cadres du secteur public ».",
status: "Fermée",
isActive: true,
levels: ["Master"],
officialWebsite: "https://www.daad.de/en/studying-in-germany/scholarships/daad-funding-programmes/helmut-schmidt-programme/",
generalCriteria: "L'Afrique est explicitement couverte ; la liste précise des pays n'a pas pu être vérifiée à la source (PDF officiel inaccessible), l'éligibilité du Sénégal est donc à confirmer auprès du programme. Licence avec résultats dans le tiers supérieur et AU MOINS 1 AN D'EXPÉRIENCE PROFESSIONNELLE. Universités d'accueil : Erfurt (Willy Brandt School), Passau, Duisburg-Essen, Hertie School, Osnabrück. La période de candidature pour la rentrée 2027 est close ; le cycle suivant (rentrée 2028) n'est pas encore publié."
}
},
{
id: "deutschlandstipendium",
data: {
title: "Deutschlandstipendium",
country: "Allemagne",
funding: "300 €/mois, financés pour moitié par l'État fédéral et pour moitié par des mécènes privés, pendant au minimum 2 semestres, renouvelable. Non lié aux revenus et cumulable avec d'autres aides.",
description: "Bourse fédérale au mérite ouverte à TOUTES LES NATIONALITÉS, y compris non-européennes — l'une des rares aides allemandes accessibles dès la licence.",
status: "Ouverte",
isActive: true,
levels: ["Licence", "Master"],
officialWebsite: "https://www.deutschlandstipendium.de/",
generalCriteria: "PIÈGE À CONNAÎTRE : ce programme N'EST PAS GÉRÉ CENTRALEMENT. Il n'existe aucune candidature nationale — chaque université fixe son propre calendrier, son portail et ses critères, et il faut être inscrit ou admis dans l'université concernée pour postuler. Critères usuels : résultats académiques, engagement social ou politique, parcours difficile, statut de première génération à l'université. Le doctorat n'est pas couvert. Voir les fiches par université rattachées à cette bourse dans le catalogue."
}
},
{
id: "heinrich-boell-stiftung",
data: {
title: "Heinrich-Böll-Stiftung Studienwerk",
country: "Allemagne",
funding: "992 €/mois pour les ressortissants non-européens, plus des allocations individuelles et, le cas échéant, l'assurance maladie.",
description: "Fondation proche des Verts. Priorité explicite aux candidats de pays de la liste CAD QUI NE RÉSIDENT PAS ENCORE EN ALLEMAGNE au moment de la candidature — un avantage rare pour qui postule depuis Dakar.",
status: "Ouverte",
isActive: true,
levels: ["Master", "Doctorat"],
officialWebsite: "https://www.boell.de/en/scholarships",
generalCriteria: "Pays de la liste CAD prioritaires — le Sénégal et l'Afrique de l'Ouest sont concernés. Sélection sur l'excellence académique, l'engagement sociopolitique et l'adhésion aux valeurs de la fondation (écologie, démocratie, droits humains). DEUX APPELS PAR AN : appel d'automne du 15 juillet au 1er septembre, appel de printemps du 15 janvier au 1er mars. L'appel d'automne 2026 se ferme le 1er septembre 2026 ; le suivant court du 15 janvier au 1er mars 2027."
}
},
{
id: "konrad-adenauer-stiftung",
data: {
title: "Konrad-Adenauer-Stiftung — Stipendienprogramm für ausländische Studierende",
country: "Allemagne",
funding: "Jusqu'à 992 €/mois (licence, master, postgraduate) et jusqu'à 1 400 €/mois (doctorat) ; assurance maladie jusqu'à 120 €/mois ; allocation conjoint 276 € ; allocation enfant 250 € par enfant ; subventions de voyage de recherche ; remboursement partiel des frais de scolarité jusqu'à 750 €/semestre à titre exceptionnel. Durée : 2 ans en premier cycle, 3 ans en doctorat.",
description: "Fondation proche de la CDU, couvrant plus de 50 pays, avec un accompagnement idéologique structuré et un réseau d'anciens dense.",
status: "Fermée",
isActive: true,
levels: ["Licence", "Master", "Doctorat"],
officialWebsite: "https://www.kas.de/en/web/begabtenfoerderung-und-kultur/auslaenderfoerderung",
generalCriteria: "ALLEMAND B2 MINIMUM EXIGÉ, excellents résultats, engagement citoyen et adhésion aux valeurs démocrates-chrétiennes. RÉSERVE IMPORTANTE POUR L'AFRIQUE DE L'OUEST : les entretiens régionaux se tiennent à Nairobi et ne concernent que le Kenya, l'Ouganda/Soudan du Sud, la Tanzanie et l'Éthiopie. Un candidat sénégalais doit donc passer par la procédure NATIONALE, c'est-à-dire être déjà inscrit en Allemagne. Date limite de la procédure nationale : 15 juillet à 12h00 CET chaque année — prochaine échéance le 15 juillet 2027."
}
},
{
id: "friedrich-ebert-stiftung",
data: {
title: "Friedrich-Ebert-Stiftung — Grundförderung für ausländische Studierende",
country: "Allemagne",
funding: "992 €/mois, assurance maladie intégralement prise en charge, et 255 €/mois supplémentaires par enfant à charge. Aide non remboursable.",
description: "Fondation proche du SPD, ciblant explicitement les pays du Sud global (Afrique, Asie, Amérique latine) — les pays de l'OCDE en sont exclus.",
status: "Ouverte",
isActive: true,
levels: ["Licence", "Master", "Doctorat"],
officialWebsite: "https://www.fes.de/studienfoerderung/stipendium/grundfoerderung-fuer-auslaender-innen",
generalCriteria: "Tous les pays d'Afrique, Sénégal inclus. CONDITION BLOQUANTE : il faut DÉJÀ ÊTRE INSCRIT dans une université allemande au moment de la candidature, et ne pas résider en Allemagne depuis plus de 15 mois (restriction levée si l'entrée s'est faite pour études, doctorat ou cours de langue). ALLEMAND B2 MINIMUM, même pour un cursus enseigné en anglais. Bonne nouvelle : les études faites au pays d'origine ne comptent pas comme un premier diplôme, un licencié sénégalais peut donc financer son master. Candidature possible toute l'année, au plus tard 3 semestres avant la fin du cursus ; pour le master, échéances du 30 novembre (semestre d'hiver) et du 31 mai (semestre d'été)."
}
},
{
id: "rosa-luxemburg-stiftung",
data: {
title: "Rosa-Luxemburg-Stiftung Studienwerk",
country: "Allemagne",
funding: "Forfait frais d'études de 300 €/mois confirmé, auquel s'ajoute une bourse de base dont le montant n'est pas publié sur les pages accessibles ; prise en charge possible de l'assurance maladie. Doctorat : 3 ans en règle générale.",
description: "Fondation proche de Die Linke. Exige un engagement sociopolitique de gauche actif et la participation au programme idéologique de la fondation.",
status: "Ouverte",
isActive: true,
levels: ["Master", "Doctorat"],
officialWebsite: "https://www.rosalux.de/stiftung/studienwerk/stipendienbewerbung/faq-studierende",
generalCriteria: "Les étudiants africains peuvent postuler, mais il faut ÊTRE DÉJÀ INSCRIT dans une université allemande et avoir obtenu sa licence dans son pays d'origine. ALLEMAND B2 MINIMUM. La licence n'est pas financée pour les internationaux. Toutes disciplines sauf médecine, dentaire et vétérinaire. Date limite : 1er octobre 2026 à 23h59 (portail ouvert depuis la mi-août 2026), pour un financement démarrant au semestre d'été, le 1er avril 2027."
}
},
{
id: "uni-hamburg-leistungsstipendien",
data: {
title: "Universität Hamburg — Leistungsstipendien für internationale Studierende",
country: "Allemagne",
funding: "Jusqu'à 930 €/mois, et jusqu'à 1 200 €/mois pour les doctorants (2 à 3 attributions par session). Durée de 12 mois (2 semestres), renouvelable, et jusqu'à 3 ans à titre exceptionnel.",
description: "Bourse au mérite propre à l'université, réservée aux étudiants sans nationalité allemande et non éligibles au BAföG — taillée pour un profil africain déjà admis à Hambourg.",
status: "Ouverte",
isActive: true,
levels: ["Licence", "Master", "Doctorat"],
officialWebsite: "https://www.uni-hamburg.de/en/internationales/studierende/incoming/studium-mit-abschluss/waehrend-des-studiums/finanzierung/leistungsstipendien.html",
generalCriteria: "Ouverte à tous les pays. Il faut avoir validé au moins 2 semestres (1 seul pour le master et le doctorat) et démontrer excellence académique, engagement social et international. DEUX SESSIONS PAR AN : le 15 avril (financement à partir du 1er octobre) et le 15 octobre (financement à partir du 1er avril). Prochaine échéance : 15 octobre 2026."
}
},
{
id: "landesstipendium-niedersachsen",
data: {
title: "Landesstipendium Niedersachsen",
country: "Allemagne",
funding: "500 €, en VERSEMENT UNIQUE et non mensuel, par semestre d'hiver. Enveloppe régionale d'un million d'euros pour 2026, répartie entre 22 établissements ; 1 895 boursiers l'année précédente.",
description: "Bourse d'échelon régional financée par le ministère de la Science et de la Culture de Basse-Saxe, mais attribuée de façon autonome par chaque université avec ses propres critères et dates. Montant modeste — c'est un coup de pouce, pas un financement d'études.",
status: "Ouverte",
isActive: true,
levels: ["Licence", "Master"],
officialWebsite: "https://www.uni-hannover.de/studium/finanzierung-foerderung/niedersachsenstipendium",
generalCriteria: "L'éligibilité repose sur l'inscription et non sur la nationalité ; l'ouverture aux internationaux est fortement suggérée par l'exigence de traduction allemande des diplômes étrangers, mais n'est pas explicitement publiée. Il faut être inscrit, non en congé, et dans les délais normaux d'études. Sélection sur les performances, le statut de première génération à l'université et les conditions de départ difficiles liées à un parcours de réfugié. Aucun droit légal à l'obtention. Cycle en cours à la Leibniz Universität Hannover : candidatures du 12 octobre au 1er novembre 2026."
}
},

// ---------- JAPON (9) ----------
{
id: "abe-initiative-jica",
data: {
title: "ABE Initiative (African Business Education Initiative for Youth)",
country: "Japon",
funding: "Allocation de subsistance de 143 000 à 148 000 ¥/mois ; billet d'avion aller-retour aux frais réels ; indemnité d'équipement de 100 000 ¥ à l'arrivée ; indemnité d'installation de 164 000 à 224 000 ¥ ; frais de scolarité et d'inscription aux frais réels versés directement à l'université ; appui à la recherche jusqu'à 360 000 ¥/an. Soit environ 1,7 à 1,8 million de ¥ par an de vie courante, scolarité en sus : c'est une bourse pleine.",
description: "Le seul grand programme japonais conçu EXCLUSIVEMENT POUR L'AFRIQUE. Il combine un master dans une université japonaise et un stage en entreprise japonaise, avec l'objectif de former des « navigateurs » d'affaires entre le Japon et l'Afrique. 78 places pour l'exercice 2026.",
status: "Fermée",
isActive: true,
levels: ["Master"],
officialWebsite: "https://www.jica.go.jp/english/countries/africa/internship.html",
generalCriteria: "Ouverte aux ressortissants des 54 PAYS AFRICAINS, Sénégal inclus. Moins de 40 ans au 1er avril de l'année d'entrée ; licence (16 ans d'études) ; expérience professionnelle exigée (secteur privé : ne pas être employé d'une entreprise japonaise au démarrage ; secteur public : au moins 6 mois en poste, autorisation et garantie de réintégration) ; anglais TOEFL iBT 80, IELTS 6.5 ou CEFR B2. CANDIDATURE PAR LE BUREAU JICA DU PAYS DE RÉSIDENCE — jamais par l'ambassade ni l'université. Au Sénégal : JICA Senegal Office, 3e étage Atryum Center, Route de Ouakam, Dakar (secteur privé) ; via la DRH du ministère puis la Direction de la Coopération Technique (fonctionnaires). Le cycle 2026 (13e promotion) est clos ; l'appel 2027 n'est pas publié au 30/08/2026 — le rythme historique le place entre août et octobre 2026, à surveiller auprès du bureau JICA de Dakar."
}
},
{
id: "jica-sdgs-global-leader",
data: {
title: "JICA SDGs Global Leader Program",
country: "Japon",
funding: "Allocation de subsistance calculée sur le barème de la bourse MEXT (de l'ordre de 143 000 à 145 000 ¥/mois) ; frais de scolarité versés directement à l'université ; subvention de recherche couvrant ouvrages, équipement et participation à des conférences. Les montants exacts et la prise en charge du billet d'avion ne sont pas publiés.",
description: "Programme jumeau de l'ABE Initiative, dont il se distingue par un point décisif : il finance aussi le DOCTORAT, là où l'ABE Initiative s'arrête au master. Destiné aux cadres appelés à piloter les politiques de développement durable dans leur pays.",
status: "Fermée",
isActive: true,
levels: ["Master", "Doctorat"],
officialWebsite: "https://www.jica.go.jp/english/overseas/philippine/activities/assistance_schemes/training_and_scholarship_programs/long_term_programs/sdgs_glp/index.html",
generalCriteria: "Ouvert à l'Afrique subsaharienne, administré par les bureaux JICA de chaque pays. NOMINATION OBLIGATOIRE PAR LE GOUVERNEMENT : le dossier se dépose via la DRH de l'organisme employeur, qui le transmet pour nomination officielle. Pour le cycle 2026 : dépôts en septembre-octobre 2025, date limite de nomination gouvernementale le 24 octobre 2025, présélection JICA en novembre-décembre, examens universitaires de février à juin 2026, départ pour le Japon en septembre 2026. Le cycle 2027 n'est pas publié au 30/08/2026."
}
},
{
id: "jj-wbgsp",
data: {
title: "Joint Japan/World Bank Graduate Scholarship Program (JJ/WBGSP)",
country: "Japon",
funding: "Frais de scolarité intégraux ; assurance maladie via l'université ; allocation mensuelle de subsistance dont le montant varie selon le pays d'accueil et n'est pas publié pour le Japon ; billet d'avion aller-retour en classe économique ; indemnité de voyage de 600 USD par trajet. Durée : celle du programme, dans la limite de 2 ans.",
description: "Financée chaque année par le gouvernement japonais et administrée par la Banque mondiale. C'est l'une des rares voies japonaises PLEINEMENT OUVERTES AUX SÉNÉGALAIS et menant à l'University of Tokyo, qui y présente deux programmes.",
status: "Fermée",
isActive: true,
levels: ["Master"],
officialWebsite: "https://www.worldbank.org/en/programs/scholarships/jj-wbgsp",
generalCriteria: "Réservée aux ressortissants des pays membres en développement de la Banque mondiale — LE SÉNÉGAL EST ÉLIGIBLE. Pas de double nationalité d'un pays développé ; licence obtenue AU MOINS 3 ANS avant la date limite ; AU MOINS 3 ANS D'EXPÉRIENCE PROFESSIONNELLE RÉMUNÉRÉE liée au développement au cours des 6 dernières années ; être en emploi à temps plein au moment de la candidature ; détenir une admission inconditionnelle dans un programme partenaire situé hors de son pays d'origine. Candidature DIRECTE sur le portail de la Banque mondiale. Cycle 2027 déjà publié : fenêtre 1 du 18 janvier au 26 février 2027, fenêtre 2 du 29 mars au 21 mai 2027. Programmes japonais éligibles : University of Tokyo (Master of Public Policy en fenêtre 1, International Program on Agricultural Development Studies en fenêtre 2), Université de Tsukuba, Keio, GRIPS, Saitama, Yokohama National University."
}
},
{
id: "jads-japan-africa-dream",
data: {
title: "Japan Africa Dream Scholarship (JADS)",
country: "Japon",
funding: "Frais de scolarité intégraux sur 24 mois et frais d'inscription ; allocation mensuelle de 150 000 ¥ logement inclus ; billet d'avion aller-retour en classe économique entre le pays d'origine et l'université ; assurance maladie via l'université ; bourse de recherche pour le mémoire dans certains cas. Soit environ 1,8 million de ¥ par an de vie courante, scolarité en sus.",
description: "Deuxième dispositif entièrement africain après l'ABE Initiative, porté par la Banque africaine de développement et le gouvernement japonais. Ciblé sur cinq domaines : énergie, agriculture, santé, durabilité environnementale et ingénierie.",
status: "Ouverte",
isActive: true,
levels: ["Master"],
officialWebsite: "https://www.afdb.org/en/about-us/careers/japan-africa-dream-scholarship-jads-program",
generalCriteria: "Réservée aux ressortissants des pays membres régionaux de la BAD — SÉNÉGAL ÉLIGIBLE. 35 ans maximum ; parcours académique et professionnel pertinent et engagement démontré au service du développement de son pays. CANAL : L'UNIVERSITÉ D'ABORD — on postule à l'admission d'une université japonaise partenaire, qui présente ensuite le candidat retenu au secrétariat JADS. Il n'existe aucune candidature directe auprès de la BAD (contact : JADS@AFDB.ORG). Échéances propres à chaque université : Ritsumeikan APU le 15 septembre 2026 (entrée avril 2027) puis les 5 novembre 2026 et 8 janvier 2027 (entrée septembre 2027) ; Hiroshima University le 29 janvier 2027 à 17h00 JST ; University of Tokyo (Graduate School of Frontier Sciences) — dépôt en juin pour une entrée en avril, ou en novembre pour une entrée en octobre."
}
},
{
id: "honjo-international-scholarship",
data: {
title: "Honjo International Scholarship Foundation",
country: "Japon",
funding: "210 000 ¥/mois pour un cursus de 1 à 2 ans, 190 000 ¥/mois pour 3 ans, 160 000 ¥/mois pour 4 à 5 ans, versés pendant toute la durée minimale requise pour obtenir le diplôme — soit environ 2,5 millions de ¥ par an, le montant mensuel le plus élevé de toutes les fondations privées japonaises. La prise en charge des frais de scolarité et du billet d'avion n'est pas publiée.",
description: "Rare fondation japonaise à accepter les candidatures DIRECTES, DEPUIS L'ÉTRANGER et SANS présélection universitaire. Très sélective : environ 5 lauréats par session.",
status: "Ouverte",
isActive: true,
levels: ["Master", "Doctorat"],
officialWebsite: "https://www.hisf.or.jp/en/scholarship/foreigner/",
generalCriteria: "Toutes nationalités et tous domaines de recherche. Il faut être inscrit, ou sur le point de s'inscrire, dans une école doctorale japonaise ; la candidature depuis l'étranger est explicitement autorisée À CONDITION d'avoir déjà obtenu l'admission. Sélection sur dossier puis entretiens, avec une vidéo de présentation de la recherche de 2 minutes. Deux sessions par an : printemps du 1er septembre au 31 octobre, automne du 1er au 30 avril. RÉSERVE : la page officielle n'avait pas été actualisée au-delà de 2024 au 30/08/2026 — confirmer les dates auprès de la fondation avant tout dépôt."
}
},
{
id: "rotary-yoneyama-overseas",
data: {
title: "Rotary Yoneyama Memorial Foundation — Scholarship for Overseas Candidates",
country: "Japon",
funding: "100 000 ¥/mois en licence, 140 000 ¥/mois en master et en doctorat (barème 2027) ; subvention de voyage jusqu'à 250 000 ¥ pour le trajet vers le Japon. Les frais de scolarité ne sont PAS couverts.",
description: "L'un des très rares dispositifs privés japonais permettant de candidater AVANT l'arrivée au Japon. En contrepartie, chaque boursier est parrainé par un club Rotary japonais et fortement ancré dans la vie locale.",
status: "Ouverte",
isActive: true,
levels: ["Licence", "Master", "Doctorat"],
officialWebsite: "https://www.rotary-yoneyama.or.jp/english/overseas",
generalCriteria: "Toutes nationalités, MAIS JLPT N3 OU SUPÉRIEUR EXIGÉ au moment de la candidature — c'est le vrai filtre pour un candidat ouest-africain. Les étudiants-chercheurs (research students) sont exclus. Il faut trouver et postuler soi-même à une université ou école doctorale japonaise et joindre la copie du dossier d'admission ; lettre de recommandation du directeur de recherche exigée en école doctorale. Un refus d'admission entraîne la perte de la bourse, de même qu'une arrivée au Japon après le mois d'entrée. Candidature DIRECTE à la fondation depuis l'étranger, du 1er au 31 octobre 2026 à 13h00 JST pour une entrée en avril ou à l'automne 2027 ; résultats à la mi-mars 2027."
}
},
{
id: "jasso-monbukagakusho-honors",
data: {
title: "JASSO Monbukagakusho Honors Scholarship",
country: "Japon",
funding: "48 000 ¥/mois (30 000 ¥/mois en école de langue japonaise), soit environ 576 000 ¥ par an. Ni frais de scolarité, ni billet d'avion : c'est un appoint, jamais une bourse complète.",
description: "Complément mensuel modeste attribué aux étudiants déjà inscrits au Japon à titre privé, sur critères de mérite et de besoin. Utile en cumul, insuffisant seul.",
status: "Ouverte",
isActive: true,
levels: ["Licence", "Master", "Doctorat"],
officialWebsite: "https://www.studyinjapan.go.jp/en/planning/scholarships/jasso-scholarships/",
generalCriteria: "CONDITION BLOQUANTE : il faut ÊTRE DÉJÀ AU JAPON avec le statut de séjour « Student ». Moyenne (GPA) d'au moins 2,30 ; japonais JLPT N2 ou anglais B2 ; envois de fonds familiaux inférieurs à 90 000 ¥/mois. Candidature par l'université d'inscription, selon son calendrier interne. POINT CRITIQUE POUR L'AFRIQUE DE L'OUEST : la voie « réservation » avant arrivée passe par l'examen EJU, qui ne se tient pas en Afrique — cette bourse n'est donc accessible qu'après inscription au Japon. À considérer comme un financement de deuxième année, pas comme un financement de départ."
}
},
{
id: "utokyo-fellowship",
data: {
title: "The University of Tokyo Fellowship",
country: "Japon",
funding: "200 000 ¥/mois d'allocation d'aide à la recherche, versés pendant la durée normale du cursus (3 ans à la Graduate School of Frontier Sciences), soit environ 2,4 millions de ¥ par an — le montant mensuel le plus élevé de ce lot. La bourse est une allocation de subsistance : la prise en charge des frais de scolarité, d'inscription et du billet d'avion n'est pas publiée.",
description: "Bourse phare financée directement par l'University of Tokyo pour ses meilleurs étudiants internationaux autofinancés. 44 nouveaux lauréats en 2025 et 110 doctorants bénéficiaires actifs.",
status: "Ouverte",
isActive: true,
levels: ["Master", "Doctorat"],
officialWebsite: "https://www.u-tokyo.ac.jp/en/prospective-students/fellowship.html",
generalCriteria: "Aucune restriction de nationalité sur le dispositif principal. Réservée aux étudiants internationaux AUTOFINANCÉS, candidats ou inscrits dans une école doctorale de l'UTokyo, avec un statut de séjour valide à l'inscription et sans candidature simultanée à une autre bourse privée. Le dossier se dépose EN MÊME TEMPS que le dossier d'admission (lettre de recommandation, projet de recherche, liste de travaux, relevés de notes, jusqu'à 3 publications) auprès de l'ÉCOLE DOCTORALE, jamais de l'université centrale ni d'une ambassade — les dates limites sont donc propres à chaque école doctorale. Certaines écoles réservent le dispositif au doctorat. Deux variantes fléchées par donateur ne concernent pas l'Afrique : Fu Delin (ressortissants chinois) et Koga Shinsuke (américains et britanniques)."
}
},
{
id: "waseda-partial-tuition-waiver",
data: {
title: "Waseda University Partial Tuition-Waiver Scholarship",
country: "Japon",
funding: "Exonération de 50 % des frais de scolarité annuels, soit environ 0,5 à 0,8 million de ¥ économisés par an selon la faculté. Aucune allocation mensuelle, aucun billet d'avion. Subvention non remboursable.",
description: "Principal filet de sécurité de Waseda pour les étudiants internationaux autofinancés en difficulté, et son dispositif interne le plus largement accessible — mais il ne se demande QU'APRÈS l'inscription.",
status: "Fermée",
isActive: true,
levels: ["Licence", "Master"],
officialWebsite: "https://www.waseda.jp/inst/scholarship/en/for-international-students/",
generalCriteria: "Toutes nationalités. Réservée aux étudiants internationaux AUTOFINANCÉS, avec statut de séjour « Student », inscrits dans un cursus diplômant régulier, justifiant de bons résultats et d'une difficulté financière démontrée (justificatifs de revenus, bail, carte de séjour). EXCLUS : boursiers MEXT, doctorants, étudiants financés par un organisme, étudiants non-diplômants, assiduité insuffisante. Campagne interne au printemps, dépôt par formulaire en ligne uniquement (les dossiers par courriel ou au guichet sont refusés) ; la campagne de référence documentée se fermait le 22 mai à 16h00, pour une exonération appliquée au paiement du semestre d'automne. IMPOSSIBLE À DEMANDER DEPUIS LE SÉNÉGAL avant le départ : c'est un financement de deuxième année."
}
},

// ---------- CORÉE DU SUD (7) ----------
{
id: "koica-ciat-scholarship",
data: {
title: "KOICA Scholarship Program (CIAT)",
country: "Corée du Sud",
funding: "Frais de scolarité intégraux ; allocation mensuelle de 1 200 000 KRW ; allocation d'installation de 600 000 KRW (master) ou 1 200 000 KRW (doctorat) ; prime d'achèvement de 300 000 KRW (master) ou 600 000 KRW (doctorat) ; assurance santé d'environ 81 000 KRW/mois ; billet d'avion aller-retour en classe économique aux frais réels ; logement en résidence universitaire. Montants à re-vérifier sur le site CIAT avant publication définitive.",
description: "Programme de coopération de l'agence publique KOICA. À NE PAS PRÉSENTER COMME UNE BOURSE OUVERTE : il est réservé aux FONCTIONNAIRES EN POSTE, nommés officiellement par leur gouvernement. 15 programmes dans 11 universités, dont Yonsei, l'Université nationale de Séoul et la KDI School.",
status: "Fermée",
isActive: true,
levels: ["Master", "Doctorat"],
officialWebsite: "https://www.koica.go.kr/sites/ciat/index.do",
generalCriteria: "Ouvert aux ressortissants des 96 pays récipiendaires de l'aide publique au développement ; l'inscription du Sénégal sur la liste annuelle n'est pas publiée et reste à confirmer auprès du bureau KOICA ou de l'ambassade de Corée à Dakar. CONDITION DÉCISIVE : être fonctionnaire en activité ET nommé officiellement par son gouvernement — ce n'est pas une candidature libre. Âge de préférence inférieur à 40 ans ; 2 ans d'expérience professionnelle (master) ou 3 ans après le master (doctorat) ; bon niveau d'anglais ; ne pas avoir déjà bénéficié d'une bourse du gouvernement coréen. Dépôt par courriel au bureau KOICA du pays ou à l'ambassade de Corée, jamais en ligne. Cycle 2027 clos (date limite en juillet 2026, arrivée en Corée en février 2027) ; prochain appel attendu vers le milieu de 2027."
}
},
{
id: "ama-plus-scholarship",
data: {
title: "AMA+ Scholarship (Art Major Asian Plus)",
country: "Corée du Sud",
funding: "Frais de scolarité intégraux sur les semestres réguliers ; allocation mensuelle de 800 000 KRW ; allocation d'installation de 200 000 KRW à l'arrivée ; prime de compétence en coréen de 100 000 KRW/mois pendant un an ; allocation de mémoire jusqu'à 1 000 000 KRW ; billet d'avion aller-retour en classe économique ; assurance maladie nationale ; cours intensif de coréen de 6 mois gratuit.",
description: "Seule grande bourse gouvernementale coréenne entièrement dédiée AUX ARTS — musique, danse, théâtre, cinéma, arts visuels et arts traditionnels — portée par l'université nationale des arts (K-Arts).",
status: "Fermée",
isActive: true,
levels: ["Licence", "Master"],
officialWebsite: "https://www.karts.ac.kr/en/karts/ama.do",
generalCriteria: "LE CANDIDAT ET SES DEUX PARENTS doivent être ressortissants d'un pays de la liste OCDE-CAD des bénéficiaires de l'aide publique au développement — le Sénégal y figure. Diplôme de fin d'études secondaires pour la licence, licence pour le master ; portfolio exigé selon le département. Rythme officiel constaté : candidature en ligne fin mars, résultats d'admission fin avril, test de coréen début mai, entretiens en juin, liste finale fin juin, arrivée en Corée fin août. Le cycle 2027 était déjà en phase de sélection au 30/08/2026 ; prochain appel attendu vers mars 2027. Les dates exactes ne sont pas publiées de façon accessible."
}
},
{
id: "snu-glo-harmony-scholarship",
data: {
title: "Glo-Harmony Scholarship (Seoul National University / Fondation Samsung)",
country: "Corée du Sud",
funding: "Montant fixé par la Fondation Samsung au cas par cas et non publié. La prise en charge du billet d'avion et des cours de coréen n'est pas publiée. Durée : 4 semestres maximum en master, 6 en doctorat.",
description: "Bourse financée par la Fondation Samsung et administrée par l'Université nationale de Séoul, explicitement ciblée sur les étudiants des pays en développement — l'une des rares voies « entreprise » réellement ouvertes à l'Afrique subsaharienne.",
status: "Fermée",
isActive: true,
levels: ["Master", "Doctorat"],
officialWebsite: "https://en.snu.ac.kr/admission/graduate/scholarships/after_admission",
generalCriteria: "Réservée aux étudiants internationaux inscrits en cycle supérieur à l'Université nationale de Séoul et ressortissants d'un pays de la liste OCDE-CAD des bénéficiaires de l'APD — SÉNÉGAL INCLUS. Processus : présélection par la SNU, puis examen et entretiens par la Fondation Samsung, puis sélection finale. DEUX FENÊTRES PAR AN, en janvier et en juillet : celle de juillet 2026 est close, la prochaine s'ouvre en janvier 2027. Contact : intlscholarship@snu.ac.kr."
}
},
{
id: "snu-global-scholarship",
data: {
title: "SNU Global Scholarship (Seoul National University)",
country: "Corée du Sud",
funding: "Frais de scolarité, frais de subsistance, billet d'avion et logement, pour des montants variables selon la situation de chacun et non publiés.",
description: "Dispositif d'aide généraliste de l'Université nationale de Séoul, le plus large en volume avec environ 160 boursiers par an, ouvert à l'ensemble des étudiants internationaux en cycle supérieur.",
status: "Ouverte",
isActive: true,
levels: ["Master", "Doctorat"],
officialWebsite: "https://en.snu.ac.kr/admission/graduate/scholarships/after_admission",
generalCriteria: "Ouverte à tous les pays. Il faut être admis en cycle supérieur à la SNU ; la demande se fait au moment de la réception de l'admission, sans dossier séparé en amont. Le calendrier est donc indexé sur celui des admissions de l'université. Contact : intlscholarship@snu.ac.kr, +82-2-880-2519."
}
},
{
id: "ku-global-leader-scholarship",
data: {
title: "KU Global Leader Scholarship (Korea University)",
country: "Corée du Sud",
funding: "Type A : 100 % des frais d'inscription et de scolarité, plus 500 000 KRW/mois de soutien à la vie courante pendant 4 mois par semestre. Type B (sciences humaines et sociales) : 60 % des frais de scolarité. Type C (sciences naturelles et ingénierie) : 65 % des frais de scolarité. Billet d'avion, cours de coréen et assurance non couverts.",
description: "Bourse au mérite propre à Korea University, ATTRIBUÉE AUTOMATIQUEMENT lors de l'évaluation du dossier d'admission — aucune candidature séparée à déposer.",
status: "Ouverte",
isActive: true,
levels: ["Master", "Doctorat"],
officialWebsite: "https://graduate2.korea.ac.kr/scholarship/scholarships.html",
generalCriteria: "Ouverte à tous les pays. Type A : moyenne cumulée d'au moins 4,0/4,5, TOEFL iBT 90 minimum et recommandation du département. Types B et C : moyenne d'au moins 3,5/4,5, TOEFL iBT 82 minimum et recommandation du département. NON CUMULABLE avec une autre bourse majeure ; accordée pour le PREMIER SEMESTRE UNIQUEMENT, le renouvellement supposant une nouvelle candidature. Les candidats en Business Analytics sont exclus. Calendrier indexé sur les sessions d'admission de la Graduate School."
}
},
{
id: "kaist-scholarship",
data: {
title: "KAIST Scholarship (Global Presidential Scholarship / Prestige Scholarship)",
country: "Corée du Sud",
funding: "Frais de scolarité intégraux, assurance maladie nationale, et une allocation mensuelle dont le montant dépend de l'implication en recherche et varie selon le collège — les montants exacts ne sont pas publiés. Billet d'avion et cours de coréen non couverts.",
description: "Bourse la plus sélective de la première université scientifique coréenne. AUCUNE CANDIDATURE SÉPARÉE : il suffit de cocher l'option bourse dans le dossier d'admission, les chefs de département recommandant ensuite les meilleurs profils.",
status: "Ouverte",
isActive: true,
levels: ["Master", "Doctorat"],
officialWebsite: "https://admission.kaist.ac.kr/intl-graduate/FinancialSupport/Scholarship/KAISTScholarship",
generalCriteria: "Ouverte à tous les pays. Deux volets : le Global Presidential Scholarship (master et master-doctorat intégré, 4 semestres) et le Prestige Scholarship for International Ph.D. Students (master-doctorat intégré et doctorat, 8 semestres). La filière Global Technology Innovation Program (GDI-GTIP Track) est exclue. Trois sessions par an — Spring, Fall Early et Fall Regular — dont les dates exactes ne sont pas publiées de façon accessible : se référer au calendrier d'admission de KAIST."
}
},
{
id: "postech-gift-scholarship",
data: {
title: "POSTECH — Assistanat et bourses pour étudiants internationaux (GIFT / Battery Engineering)",
country: "Corée du Sud",
funding: "Assistanat d'enseignement ou de recherche couvrant l'allocation de subsistance, les frais de scolarité et la résidence universitaire ; allocation d'installation pour les nouveaux arrivants internationaux. À titre de référence, les frais couverts représentent 10 608 000 KRW/an de scolarité, 2 246 000 à 5 604 000 KRW/an de résidence, 898 000 KRW de frais d'inscription et environ 200 000 à 250 000 KRW d'assurance santé. La Ruth Satter Scholarship (5 000 000 KRW/an) est réservée aux étudiantes asiatiques.",
description: "Le financement passe par l'assistanat de recherche plutôt que par une bourse nominative. Deux départements accueillent des internationaux : le Graduate Institute of Ferrous & Eco Materials Technology (GIFT) et le Department of Battery Engineering.",
status: "Ouverte",
isActive: true,
levels: ["Master", "Doctorat"],
officialWebsite: "https://gift.postech.ac.kr/file/2026_27_Admissions_guide_for_international%20students_GIFT.pdf",
generalCriteria: "Ouverte à tous les pays. LE CANDIDAT ET SES PARENTS doivent être de nationalité étrangère. Licence acquise ou imminente pour le master et le master-doctorat intégré ; master acquis ou imminent pour le doctorat. Anglais TOEFL iBT 79 minimum (ou TOEFL PBT 550, TOEIC 750, IELTS 6.0, TEPS 600), avec dispense pour les diplômés d'universités australiennes, canadiennes, irlandaises, néo-zélandaises, britanniques ou américaines. Cycle 2026-27 : deuxième session ouverte du 6 juillet au 11 SEPTEMBRE 2026 à 18h00 KST, résultats le 19 novembre 2026, rentrée au printemps 2027."
}
},

// ---------- TURQUIE (8) ----------
{
id: "turkiye-burslari-success",
data: {
title: "Türkiye Bursları Başarı Bursu (Success Scholarship)",
country: "Turquie",
funding: "Allocation mensuelle UNIQUEMENT : 3 500 TL en licence, 5 000 TL en master, 6 500 TL en doctorat. Ni logement, ni billet d'avion, ni frais de scolarité, ni cours de turc. Durée d'un an, renouvelable sur concours.",
description: "Destinée aux étudiants DÉJÀ INSCRITS À LEURS PROPRES FRAIS dans une université turque et dont le dossier académique est exceptionnel : c'est un rattrapage pour ceux qui ont manqué la bourse principale mais réussissent sur place.",
status: "Fermée",
isActive: true,
levels: ["Licence", "Master", "Doctorat"],
officialWebsite: "https://www.turkiyeburslari.gov.tr/shorttermprograms",
generalCriteria: "Ouverte à tous les pays, mais LE PRÉREQUIS EST D'ÊTRE DÉJÀ ÉTUDIANT EN TURQUIE — peu actionnable depuis Dakar. Sélection sur l'excellence académique démontrée en Turquie. Candidatures en octobre-novembre, résultats en décembre ; le cycle 2026 n'était pas encore ouvert au 30/08/2026, ouverture attendue en octobre 2026."
}
},
{
id: "turkiye-burslari-research",
data: {
title: "Türkiye Bursları Araştırma Bursu (Research Scholarship)",
country: "Turquie",
funding: "25 000 TL/mois, allocation seule. Ni logement ni billet d'avion mentionnés sur la page officielle. Durée de 3 à 12 mois.",
description: "Séjour de recherche court dans une université turque de premier plan, pour chercheurs étrangers souhaitant collaborer avec des académiques turcs. Seul programme YTB ouvert en continu.",
status: "Ouverte",
isActive: true,
levels: ["Doctorat"],
officialWebsite: "https://www.turkiyeburslari.gov.tr/shorttermprograms",
generalCriteria: "Ouverte à tous les pays. Il faut être titulaire d'un doctorat OU doctorant au stade de la rédaction de thèse, et avoir moins de 50 ans. CANDIDATURES TOUTE L'ANNÉE, évaluées en quatre périodes : janvier-mars (résultats en avril), avril-juin (juillet), juillet-septembre (octobre), octobre-décembre (janvier). La troisième période court jusqu'à fin septembre 2026."
}
},
{
id: "ytb-isdb-joint-scholarship",
data: {
title: "Programme conjoint Türkiye Bursları – Banque islamique de développement (YTB-IsDB)",
country: "Turquie",
funding: "Allocation mensuelle, hébergement, frais de scolarité, assurance maladie, cours de turc et billets aller-retour. Les montants précis ne figurent pas sur la page de synthèse — ils sont détaillés dans les guides PDF officiels publiés par niveau (Associate, Licence, Master, Doctorat).",
description: "Programme conjoint de l'agence turque YTB et de la Banque islamique de développement, réservé aux ressortissants des États membres de la BID et aux communautés musulmanes, dans les meilleures universités turques. C'EST LE PROGRAMME TURC LE PLUS DIRECTEMENT PERTINENT POUR L'AFRIQUE DE L'OUEST.",
status: "Fermée",
isActive: true,
levels: ["Licence", "Master", "Doctorat"],
officialWebsite: "https://turkiyeburslari.gov.tr/partneredprograms",
generalCriteria: "Réservée aux ressortissants des États membres de la Banque islamique de développement — LE SÉNÉGAL EN FAIT PARTIE, ainsi que le Mali, le Burkina Faso, le Niger, la Guinée, la Gambie, la Côte d'Ivoire, le Bénin, le Togo, la Mauritanie et le Nigeria. Vérifier la liste officielle de la BID avant de candidater. Sélection sur l'excellence académique et parascolaire. ATTENTION : la page d'accueil de turkiyeburslari.gov.tr signalait un cycle 2026 actif au 30/08/2026, mais AUCUNE DATE n'était diffusée — re-vérifier avant de se fier au calendrier."
}
},
{
id: "diyanet-tdv-international",
data: {
title: "Bourses internationales de théologie de la Fondation Diyanet de Turquie (TDV)",
country: "Turquie",
funding: "Non publié : le portail diyanetburslari.tdv.org était en maintenance au 30/08/2026, aucun montant, hébergement, billet ni assurance n'est diffusable de source officielle.",
description: "Filière de théologie islamique de la Fondation Diyanet, adossée à sept universités turques dont Istanbul, Ankara et Marmara. Cursus entièrement distinct de Türkiye Bursları, avec son propre portail et son propre calendrier.",
status: "Fermée",
isActive: true,
levels: ["Licence", "Master", "Doctorat"],
officialWebsite: "https://diyanetburslari.tdv.org/en/uluslararasi-ilahiyat-lisans-programi/",
generalCriteria: "Ouverte à tous les pays, aucune restriction nationale publiée. Il ne faut être ni avoir jamais été citoyen turc, ni déjà étudier en Turquie ; être né après le 1er janvier 2005 pour le niveau licence ; détenir un diplôme du secondaire avec au moins 70 % ; n'avoir aucune interruption d'études supérieure à deux ans ; n'avoir ni sanction disciplinaire ni condamnation. Le cycle 2026-2027 a couru du 15 janvier au 28 février 2026 ; prochain cycle attendu en janvier-février 2027."
}
},
{
id: "tubitak-2216-research-fellowship",
data: {
title: "TÜBİTAK 2216 — Research Fellowship Programme for International Researchers",
country: "Turquie",
funding: "32 500 TL/mois pour les doctorants et 43 500 TL/mois pour les post-doctorants ; billets aller-retour vers la Turquie et assurance santé privée jusqu'à 560 TL/mois, tous deux à la discrétion du comité. Durée maximale de 36 mois.",
description: "Séjour de recherche financé dans une université ou un institut turc, sur invitation. Les montants dépassent nettement ceux de la bourse de recherche YTB (32 500 contre 25 000 TL).",
status: "Fermée",
isActive: true,
levels: ["Doctorat"],
officialWebsite: "https://tubitak.gov.tr/en/scholarships/international/research-scholarship-programs/2216-research-fellowship-programme-international-researchers",
generalCriteria: "Ouverte à tous les pays. Être de nationalité étrangère, inscrit en doctorat à l'étranger ou titulaire d'un doctorat, et avoir 35 ans ou moins à la date limite. LE VRAI FILTRE EST LA LETTRE D'INVITATION d'une université ou d'un institut de recherche turc, à obtenir avant de candidater : il faut donc déjà avoir un contact académique en Turquie. La page officielle indiquait au 30/08/2026 que le programme n'accepte pas de candidatures ; aucune date pour 2026 n'était annoncée."
}
},
{
id: "koc-university-merit-scholarships",
data: {
title: "Koç University Merit Scholarships",
country: "Turquie",
funding: "Licence : exonération de 25 %, 50 %, 75 % ou 100 % des FRAIS DE SCOLARITÉ SEULEMENT, sans logement ni allocation. Master avec thèse : bourse au mérite de 100 %, avec possibilité de frais de subsistance et d'assurance santé. Doctorat : bourse complète pour toute la durée, pouvant inclure logement, frais de subsistance et assurance. Les montants d'allocation ne sont pas publiés.",
description: "Bourses attribuées AUTOMATIQUEMENT lors de l'examen du dossier d'admission, sans candidature distincte : le résultat arrive avec la lettre d'admission.",
status: "Ouverte",
isActive: true,
levels: ["Licence", "Master", "Doctorat"],
officialWebsite: "https://international.ku.edu.tr/scholarships/",
generalCriteria: "Ouverte à tous les pays. Il faut être admis au programme et fournir les scores standardisés requis (SAT, ACT, IB ou A-Levels en licence ; GRE ou GMAT plus TOEFL en master). EXCLUSIONS IMPORTANTES : les étudiants en médecine ne perçoivent aucune bourse, pas plus que la Graduate School of Health Sciences au niveau gradué, ni AUCUN master sans thèse (Data Science, Cybersecurity, LLM, MBA, EMBA, Finance…). Aucun recours n'est possible sur la décision de bourse. Les dates 2026-2027 ne sont pas publiées. À noter : Koç oriente elle-même ses candidats internationaux vers Türkiye Bursları, qui couvre logement, allocation et billets — les deux ne se cumulent pas."
}
},
{
id: "sabanci-graduate-scholarships",
data: {
title: "Sabancı University Graduate Scholarships",
country: "Turquie",
funding: "Exonération totale des frais pour la quasi-totalité des admis en programmes académiques (frais affichés : 36 500 USD/an pour les internationaux). Bourse complète : 43 500 TL/an en master (10 mois), 67 500 TL/an en doctorat puis 75 000 TL/an après l'examen de qualification (12 mois), plus résidence gratuite, aide au transport de 10 000 TL, assurance santé et ordinateur portable. Bourse d'excellence Sciences & Technologies : 115 000 TL/an puis 135 000 TL/an après qualification, chambre individuelle gratuite et 3 000 USD/an de fonds de recherche. Bourse sur projet : à partir de 47 850 TL/mois en master et 74 250 TL/mois en doctorat. Ni billet d'avion ni cours de turc.",
description: "Le financement de troisième cycle le plus élevé de Turquie sur source officielle — les bourses sur projet dépassent largement toute bourse gouvernementale turque.",
status: "Ouverte",
isActive: true,
levels: ["Master", "Doctorat"],
officialWebsite: "https://www.sabanciuniv.edu/en/graduate-scholarships",
generalCriteria: "Ouverte à tous les pays. Il suffit d'être admis dans un programme de troisième cycle académique : la décision de bourse est prise par le jury d'admission pendant l'évaluation, sans dossier séparé. Les dates 2026-2027 ne sont pas publiées."
}
},
{
id: "bilkent-international-scholarships",
data: {
title: "Bilkent University Scholarships for International Students",
country: "Turquie",
funding: "Exonération des frais de scolarité à 20 %, 40 %, 60 %, 80 % ou 100 %. Bourse de logement possible pour un nombre limité des meilleurs étudiants à exonération totale. Bourse au mérite annuelle (20 à 100 %) pour les non-boursiers classés dans les 5 % de tête. AUCUNE ALLOCATION MENSUELLE pour les internationaux — la bourse « Comprehensive » qui en comporte une est réservée aux nationaux turcs. Durée : jusqu'à 4 semestres de préparatoire d'anglais et 10 semestres de licence.",
description: "Barème d'exonération à cinq paliers attribué sur dossier lors de l'admission, avec une bourse logement réservée à l'élite des boursiers à 100 %.",
status: "Ouverte",
isActive: true,
levels: ["Licence"],
officialWebsite: "https://w3.bilkent.edu.tr/international/scholarships-for-international-students/",
generalCriteria: "Ouverte à tous les pays, à condition de NE PAS AVOIR ET N'AVOIR JAMAIS EU la nationalité turque. Évaluation sur les notes du secondaire, les scores d'examens nationaux ou internationaux et le choix de programme. Maintien de la bourse : moyenne annuelle d'au moins 2,00/4,00 (2,50 pour la bourse logement) ; bourse au mérite conditionnée au top 5 % du programme et à une moyenne d'au moins 3,30. Assiduité obligatoire. Les dates ne sont pas publiées."
}
}

];

// ==========================================================
// D. Programmes (18) — rattachent une bourse à une université
//    DÉJÀ en base. Construits après résolution des ids.
// ==========================================================

function buildPrograms(uni) {
const P = [];
const add = (uniKey, scholarshipId, data) => {
if (!uni[uniKey]) return;
P.push({
id: `${uni[uniKey]}__${scholarshipId}`,
data: { universityId: uni[uniKey], scholarshipId, isActive: true, ...data }
});
};

// --- Oxford (5)
add("oxford", "clarendon-fund-scholarships", {
level: "Master / Doctorat", deadline: "Échéance de financement de décembre 2026 ou janvier 2027, propre à chaque cours",
applicationUrl: "https://www.ox.ac.uk/clarendon/information-for-applicants/eligibility",
language: "Anglais", duration: "Durée du cours", coverage: "Frais de scolarité intégraux + allocation de subsistance",
description: "Aucune candidature séparée : tout candidat au cours est automatiquement examiné s'il dépose avant l'échéance de financement.", status: "Ouverte"
});
add("oxford", "weidenfeld-hoffmann-scholarships", {
level: "Master", deadline: "Échéance de décembre 2026 ou janvier 2027, propre à chaque cours",
applicationUrl: "https://www.ox.ac.uk/admissions/graduate/fees-and-funding/fees-funding-and-scholarship-search/weidenfeld-hoffmann-scholarships-and-leadership-programme",
language: "Anglais", duration: "Durée du master", coverage: "100 % des frais + au moins 20 780 £/an de subsistance",
description: "Le Sénégal est explicitement éligible — la meilleure porte d'entrée à Oxford depuis l'Afrique de l'Ouest francophone.", status: "Ouverte"
});
add("oxford", "reach-oxford-scholarship", {
level: "Licence", deadline: "Modalités d'entrée 2027 publiées en janvier 2027 (cycle 2026 clos le 4 février 2026)",
applicationUrl: "https://www.ox.ac.uk/admissions/undergraduate/fees-and-funding/oxford-bursaries-and-scholarships/reach-oxford",
language: "Anglais", duration: "3 à 4 ans", coverage: "Frais + subsistance + un billet d'avion aller-retour par an",
description: "2 à 3 attributions par an seulement. La médecine est exclue.", status: "Fermée"
});
add("oxford", "rhodes-scholarships-west-africa", {
level: "Master / Doctorat", deadline: "Cohorte 2027 close le 27 août 2026 — prochaine ouverture attendue vers juin 2027",
applicationUrl: "https://www.rhodeshouse.ox.ac.uk/scholarships/applications/west-africa/",
language: "Anglais", duration: "2 à 3 ans", coverage: "Frais de scolarité et allocation de subsistance à Oxford",
description: "Circonscription dédiée à 20 pays d'Afrique de l'Ouest, Sénégal compris : un candidat sénégalais y concourt contre ses voisins, pas contre le monde entier.", status: "Fermée"
});
add("oxford", "mastercard-foundation-afox-oxford", {
level: "Master", deadline: "Cycle 2026/27 clos (septembre 2025 – janvier 2026) ; dates du cycle suivant non publiées",
applicationUrl: "https://www.afox.ox.ac.uk/education/mastercard-foundation-scholars-program-at-the-university-of-oxford",
language: "Anglais", duration: "1 an (ou PG Dip de 14 mois)", coverage: "Frais + subsistance + billet d'avion + visa et surtaxe santé + allocation d'installation",
description: "Le seul dispositif d'Oxford couvrant explicitement le visa et la surtaxe santé, en plus des frais et de la subsistance.", status: "Fermée"
});

// --- Edinburgh (1)
add("edinburgh", "mastercard-foundation-edinburgh", {
level: "Master", deadline: "Séances d'information obligatoires du 15 au 24 septembre 2026 ; candidatures du 13 octobre au 19 novembre 2026 à 17h00 (heure britannique)",
applicationUrl: "https://edinburgh-global.ed.ac.uk/mastercard-foundation-scholars-program/apply-for-a-scholarship/eligibility",
language: "Anglais", duration: "1 an sur campus, 2 à 3 ans en ligne", coverage: "Frais + hébergement + voyage + subsistance + matériel d'étude",
description: "Trois formats, dont deux en ligne qui permettent d'étudier sans quitter le Sénégal. Les séances d'information sont obligatoires.", status: "Ouverte"
});

// --- Imperial (2)
add("imperial", "imperial-presidents-phd-scholarships", {
level: "Doctorat", deadline: "Vagues 2027-28 attendues à l'automne 2026 (les trois vagues 2026-27 sont passées)",
applicationUrl: "https://www.imperial.ac.uk/study/fees-and-funding/postgraduate-doctoral/grants-scholarships/presidents-phd/",
language: "Anglais", duration: "3,5 ans", coverage: "Frais intégraux + 26 500 £/an + 2 000 £/an de consommables",
description: "50 bourses par an, sans restriction de nationalité, à un taux supérieur au barème UKRI standard.", status: "Fermée"
});
add("imperial", "great-scholarships", {
level: "Master", deadline: "Cycle 2026 clos ; cycle 2027-28 annoncé à l'automne 2026",
applicationUrl: "https://www.imperial.ac.uk/study/fees-and-funding/postgraduate-taught/grants-scholarships/international-scholarship-collaborations/great---imperial-college-london-scholarship/",
language: "Anglais", duration: "1 an", coverage: "15 000 £ de réduction des frais (au-dessus du plancher GREAT de 10 000 £)",
description: "Déclinaison d'Imperial du dispositif GREAT : Ghana et Nigeria seulement pour l'Afrique subsaharienne, masters STIM et Business d'un an sur campus.", status: "Fermée"
});

// --- Allemagne (5)
add("hamburg", "uni-hamburg-leistungsstipendien", {
level: "Licence / Master / Doctorat", deadline: "15 octobre 2026 (financement à partir du 1er avril 2027) ; session suivante le 15 avril 2027",
applicationUrl: "https://www.uni-hamburg.de/en/internationales/studierende/incoming/studium-mit-abschluss/waehrend-des-studiums/finanzierung/leistungsstipendien.html",
language: "Allemand / Anglais selon le cursus", duration: "12 mois renouvelables", coverage: "Jusqu'à 930 €/mois (1 200 €/mois en doctorat)",
description: "Réservée aux étudiants sans nationalité allemande et non éligibles au BAföG.", status: "Ouverte"
});
add("hamburg", "deutschlandstipendium", {
level: "Licence / Master", deadline: "Calendrier propre à l'Universität Hamburg — se référer à sa page Deutschlandstipendium",
applicationUrl: "https://www.deutschlandstipendium.de/",
language: "Allemand / Anglais selon le cursus", duration: "2 semestres renouvelables", coverage: "300 €/mois",
description: "Instance locale du Deutschlandstipendium : il n'existe pas de candidature nationale, tout se joue université par université.", status: "Ouverte"
});
add("hannover", "deutschlandstipendium", {
level: "Licence / Master", deadline: "Cycle 2026/27 : candidatures du 10 août au 30 septembre 2026",
applicationUrl: "https://www.uni-hannover.de/studium/finanzierung-foerderung/deutschlandstipendium",
language: "Allemand / Anglais selon le cursus", duration: "2 semestres", coverage: "300 €/mois",
description: "Ouverte aux primo-entrants comme aux étudiants avancés, allemands et internationaux.", status: "Ouverte"
});
add("hannover", "landesstipendium-niedersachsen", {
level: "Licence / Master", deadline: "Candidatures du 12 octobre au 1er novembre 2026",
applicationUrl: "https://www.uni-hannover.de/studium/finanzierung-foerderung/niedersachsenstipendium",
language: "Allemand / Anglais selon le cursus", duration: "Versement unique", coverage: "500 € en une fois, par semestre d'hiver",
description: "Bourse régionale de Basse-Saxe attribuée de façon autonome par chaque université. Montant modeste, aucun droit légal à l'obtention.", status: "Ouverte"
});
add("humboldt", "deutschlandstipendium", {
level: "Licence / Master", deadline: "Appel publié chaque année en novembre-décembre, financement démarrant le 1er avril suivant",
applicationUrl: "https://deutschlandstipendium.hu-berlin.de/en/receive-funding",
language: "Allemand / Anglais selon le cursus", duration: "1 an, prolongeable", coverage: "300 €/mois",
description: "Ouverte aux étudiants de toutes nationalités inscrits à la HU. Le doctorat est exclu.", status: "Fermée"
});

// --- Japon (4)
add("utokyo", "utokyo-fellowship", {
level: "Master / Doctorat", deadline: "Calé sur le calendrier d'admission de chaque école doctorale — dépôt simultané au dossier d'admission",
applicationUrl: "https://www.u-tokyo.ac.jp/en/prospective-students/fellowship.html",
language: "Anglais / Japonais selon le programme", duration: "Durée normale du cursus (3 ans à la Frontier Sciences)", coverage: "200 000 ¥/mois d'allocation d'aide à la recherche",
description: "Réservée aux étudiants internationaux autofinancés. La candidature passe par l'école doctorale, jamais par l'université centrale.", status: "Ouverte"
});
add("utokyo", "jj-wbgsp", {
level: "Master", deadline: "Fenêtre 1 : 18 janvier – 26 février 2027 ; fenêtre 2 : 29 mars – 21 mai 2027",
applicationUrl: "https://www.worldbank.org/en/programs/scholarships/jj-wbgsp",
language: "Anglais", duration: "Jusqu'à 2 ans", coverage: "Frais intégraux + subsistance + billet d'avion + 600 USD par trajet + assurance",
description: "Deux programmes de l'University of Tokyo participent : Master of Public Policy (fenêtre 1) et International Program on Agricultural Development Studies (fenêtre 2).", status: "Fermée"
});
add("utokyo", "jads-japan-africa-dream", {
level: "Master", deadline: "Graduate School of Frontier Sciences : dépôt en juin pour une entrée en avril, ou en novembre pour une entrée en octobre",
applicationUrl: "https://www.k.u-tokyo.ac.jp/en/exam/master/foreign_research_students/afdb_jads/",
language: "Anglais", duration: "24 mois (+ 6 mois possibles)", coverage: "Frais intégraux + 150 000 ¥/mois logement inclus + billet d'avion + assurance",
description: "Départements Environnement et Sustainability Science uniquement. On postule à l'admission, l'université présente ensuite le candidat à la BAD.", status: "Ouverte"
});
add("waseda", "waseda-partial-tuition-waiver", {
level: "Licence / Master", deadline: "Campagne interne au printemps, annoncée par le bureau de chaque faculté et sur MyWaseda",
applicationUrl: "https://www.waseda.jp/inst/scholarship/en/for-international-students/",
language: "Anglais / Japonais selon le programme", duration: "Un semestre, renouvelable", coverage: "Exonération de 50 % des frais de scolarité annuels",
description: "Ne se demande qu'APRÈS immatriculation : c'est un financement de deuxième année, pas un financement de départ. Les doctorants et les boursiers MEXT sont exclus.", status: "Fermée"
});

// --- Corée (1)
add("koreauni", "ku-global-leader-scholarship", {
level: "Master / Doctorat", deadline: "Indexée sur les sessions d'admission de la Graduate School",
applicationUrl: "https://graduate2.korea.ac.kr/scholarship/scholarships.html",
language: "Anglais / Coréen selon le programme", duration: "Premier semestre, renouvelable sur nouvelle candidature", coverage: "Type A : 100 % des frais + 500 000 KRW/mois ; Type B : 60 % des frais ; Type C : 65 % des frais",
description: "Attribuée automatiquement lors de l'évaluation du dossier d'admission, sans candidature séparée. Les candidats en Business Analytics sont exclus.", status: "Ouverte"
});

return P;
}

// ==========================================================
// Journalisation
// ==========================================================

function log(el, message, cls = "") {
el.classList.add("is-visible");
const line = document.createElement("div");
if (cls) line.className = cls;
line.textContent = message;
el.appendChild(line);
el.scrollTop = el.scrollHeight;
}

let lastPlan = null;

const analyzeBtn = document.getElementById("analyzeBtn");
const analyzeLog = document.getElementById("analyzeLog");
const writeBtn = document.getElementById("writeBtn");
const writeLog = document.getElementById("writeLog");
const verifyBtn = document.getElementById("verifyBtn");
const verifyLog = document.getElementById("verifyLog");

// ==========================================================
// Étape 1 — analyse (lecture seule)
// ==========================================================

analyzeBtn.addEventListener("click", async () => {

analyzeBtn.disabled = true;
analyzeLog.innerHTML = "";
lastPlan = null;

try {

let blocking = false;

// --- 1a. Bourses existantes à mettre à jour, résolues par titre
log(analyzeLog, "Résolution des 5 bourses existantes à mettre à jour...");

const scholarshipsSnap = await getDocs(collection(db, "scholarships"));
const existing = scholarshipsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
const existingIds = new Set(existing.map((s) => s.id));

const updates = [];

for (const u of SCHOLARSHIP_UPDATES) {
const matches = existing.filter((s) => u.match(s.title));
if (matches.length === 0) {
log(analyzeLog, `AVERTISSEMENT : aucune bourse ne correspond à "${u.label}" — mise à jour ignorée.`, "warn");
} else if (matches.length > 1) {
log(analyzeLog, `ERREUR : ${matches.length} bourses correspondent à "${u.label}" — ambigu, résolution manuelle requise :`, "err");
matches.forEach((m) => log(analyzeLog, `  - ${m.id} ("${m.title}")`, "err"));
blocking = true;
} else {
updates.push({ id: matches[0].id, label: u.label, patch: u.patch });
log(analyzeLog, `"${u.label}" résolue : id "${matches[0].id}" (titre en base : "${matches[0].title}").`, "ok");
}
}

// --- 1b. Universités à relier, résolues par nom
log(analyzeLog, "");
log(analyzeLog, "Résolution des 9 universités à relier...");

const universitiesSnap = await getDocs(collection(db, "universities"));
const universities = universitiesSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

const uni = {};

for (const u of UNIVERSITY_LOOKUPS) {
const matches = universities.filter((x) => u.match(x.name));
if (matches.length === 0) {
log(analyzeLog, `AVERTISSEMENT : "${u.label}" introuvable en base — ses programmes seront ignorés.`, "warn");
} else if (matches.length > 1) {
log(analyzeLog, `ERREUR : ${matches.length} universités correspondent à "${u.label}" — ambigu :`, "err");
matches.forEach((m) => log(analyzeLog, `  - ${m.id} ("${m.name}")`, "err"));
blocking = true;
} else {
uni[u.key] = matches[0].id;
log(analyzeLog, `"${u.label}" résolue : id "${matches[0].id}".`, "ok");
}
}

if (blocking) {
log(analyzeLog, "");
log(analyzeLog, "Ambiguïté(s) détectée(s) — corriger avant l'étape 2. Aucune écriture n'a eu lieu.", "err");
return;
}

// --- 1c. Collisions d'id sur les nouvelles bourses
log(analyzeLog, "");
const schCollisions = SCHOLARSHIPS.filter((s) => existingIds.has(s.id));
if (schCollisions.length) {
log(analyzeLog, `${schCollisions.length} id(s) de nouvelle bourse existent déjà en base :`, "err");
schCollisions.forEach((s) => log(analyzeLog, `  - ${s.id}`, "err"));
blocking = true;
} else {
log(analyzeLog, `${SCHOLARSHIPS.length}/${SCHOLARSHIPS.length} identifiants de nouvelle bourse libres.`, "ok");
}

// --- 1d. Collisions d'id sur les programmes
const programs = buildPrograms(uni);
const programsSnap = await getDocs(collection(db, "programs"));
const existingProgramIds = new Set(programsSnap.docs.map((d) => d.id));
const progCollisions = programs.filter((p) => existingProgramIds.has(p.id));

if (progCollisions.length) {
log(analyzeLog, `${progCollisions.length} id(s) de programme existent déjà en base :`, "err");
progCollisions.forEach((p) => log(analyzeLog, `  - ${p.id}`, "err"));
blocking = true;
} else {
log(analyzeLog, `${programs.length} identifiants de programme libres.`, "ok");
}

// --- Répartition par pays, pour contrôle visuel
log(analyzeLog, "");
const byCountry = {};
SCHOLARSHIPS.forEach((s) => { byCountry[s.data.country] = (byCountry[s.data.country] || 0) + 1; });
log(analyzeLog, "Nouvelles bourses par pays :");
Object.keys(byCountry).sort().forEach((c) => log(analyzeLog, `  ${c} : ${byCountry[c]}`));

if (blocking) {
log(analyzeLog, "");
log(analyzeLog, "Collision(s) détectée(s) — corriger avant l'étape 2. Aucune écriture n'a eu lieu.", "err");
return;
}

lastPlan = { updates, programs };

log(analyzeLog, "");
log(analyzeLog, `Plan prêt : ${SCHOLARSHIPS.length} bourses à créer, ${updates.length} bourses à mettre à jour, ${programs.length} programmes à créer. Aucune université créée, aucune photo requise.`, "ok");
writeBtn.disabled = false;
writeBtn.textContent = "Écrire";

} catch (err) {
log(analyzeLog, `ERREUR : ${err.message}`, "err");
} finally {
analyzeBtn.disabled = false;
}

});

// ==========================================================
// Étape 2 — écriture
// ==========================================================

writeBtn.addEventListener("click", async () => {

if (!lastPlan) {
log(writeLog, "Lancer l'étape 1 d'abord.", "err");
return;
}

writeBtn.disabled = true;
writeLog.innerHTML = "";

try {

let n = 0;

log(writeLog, `Création de ${SCHOLARSHIPS.length} bourses...`);
for (const s of SCHOLARSHIPS) {
await setDoc(doc(db, "scholarships", s.id), s.data, { merge: true });
n++;
log(writeLog, `  ${s.id}`, "ok");
}

log(writeLog, "");
log(writeLog, `Mise à jour de ${lastPlan.updates.length} bourses existantes (champs ciblés uniquement)...`);
for (const u of lastPlan.updates) {
await setDoc(doc(db, "scholarships", u.id), u.patch, { merge: true });
n++;
log(writeLog, `  ${u.id} — ${Object.keys(u.patch).join(", ")}`, "ok");
}

log(writeLog, "");
log(writeLog, `Création de ${lastPlan.programs.length} programmes...`);
for (const p of lastPlan.programs) {
await setDoc(doc(db, "programs", p.id), p.data, { merge: true });
n++;
log(writeLog, `  ${p.id}`, "ok");
}

log(writeLog, "");
log(writeLog, `${n} documents écrits. Lancer l'étape 3 — la vérification n'est pas optionnelle.`, "ok");
verifyBtn.disabled = false;
verifyBtn.textContent = "Vérifier";

} catch (err) {
log(writeLog, `ERREUR : ${err.message}`, "err");
} finally {
writeBtn.disabled = false;
}

});

// ==========================================================
// Étape 3 — vérification champ par champ
// ==========================================================

function sameValue(a, b) {
if (Array.isArray(a) && Array.isArray(b)) {
return a.length === b.length && a.every((v, i) => v === b[i]);
}
return a === b;
}

verifyBtn.addEventListener("click", async () => {

if (!lastPlan) {
log(verifyLog, "Lancer les étapes 1 et 2 d'abord.", "err");
return;
}

verifyBtn.disabled = true;
verifyLog.innerHTML = "";

try {

let checked = 0;
let mismatches = 0;

const check = async (coll, id, expected, label) => {
const snap = await getDoc(doc(db, coll, id));
checked++;
if (!snap.exists()) {
log(verifyLog, `MANQUANT : ${coll}/${id}`, "err");
mismatches++;
return;
}
const actual = snap.data();
const bad = Object.keys(expected).filter((k) => !sameValue(actual[k], expected[k]));
if (bad.length) {
log(verifyLog, `ÉCART : ${coll}/${id} — champ(s) ${bad.join(", ")}`, "err");
bad.forEach((k) => {
log(verifyLog, `    attendu : ${JSON.stringify(expected[k])}`, "err");
log(verifyLog, `    en base : ${JSON.stringify(actual[k])}`, "err");
});
mismatches++;
} else {
log(verifyLog, `OK ${label} ${id}`, "ok");
}
};

log(verifyLog, "Relecture des bourses créées...");
for (const s of SCHOLARSHIPS) await check("scholarships", s.id, s.data, "bourse");

log(verifyLog, "");
log(verifyLog, "Relecture des bourses mises à jour (champs patchés uniquement)...");
for (const u of lastPlan.updates) await check("scholarships", u.id, u.patch, "maj");

log(verifyLog, "");
log(verifyLog, "Relecture des programmes créés...");
for (const p of lastPlan.programs) await check("programs", p.id, p.data, "programme");

log(verifyLog, "");
if (mismatches === 0) {
log(verifyLog, `${checked}/${checked} documents conformes, 0 écart. Lot 19 terminé.`, "ok");
} else {
log(verifyLog, `${mismatches} écart(s) sur ${checked} documents — NE PAS considérer le lot comme terminé.`, "err");
}

} catch (err) {
log(verifyLog, `ERREUR : ${err.message}`, "err");
} finally {
verifyBtn.disabled = false;
}

});
