/**
* ============================================================
* LOT 107 — LA BOURSE D'ÉTUDES DE L'UNIVERSITÉ INTERNATIONALE DE RABAT
* (2026-09-25)
* ============================================================
*
* Le site de l'UIR refusait nos outils (certificat) au lot 106. Charles
* a ouvert la page dans le navigateur de Claude ; la page « Bourse » et
* le « Guide du boursier — Internationaux » (PDF officiel) ont été lus
* le 2026-09-25.
*
* CE QUE DIT LA SOURCE : bourse partielle ou totale (frais de scolarité
* et, éventuellement, logement en chambre double), pour toute la durée
* du cycle, sur critères d'excellence ET sociaux ; guide dédié aux
* étudiants internationaux ; en première année, bac obtenu l'année
* même, mention Assez bien au moins ; en master, licence en quatre ans
* au plus. Demande en ligne APRÈS l'inscription, avec l'adresse
* électronique UIR. Plateforme ouverte le 23 juin 2026, clôture non
* publiée. Pas de doctorat dans le guide.
*
* EXÉCUTION (sur l'ordinateur de Charles) :
*   node scripts\add-lot107-photos.mjs
*   node scripts\lot.mjs analyser 107-bourse-uir
*   node scripts\lot.mjs ecrire 107-bourse-uir
*   node scripts\lot.mjs verifier 107-bourse-uir
* ============================================================
*/

import { existsSync } from "node:fs";

const LE = "2026-09-25";
const LU = "2026-09-25T22:10:00.000Z";
const PAR = "IlXJmAScj2U5ucV2ctUgeJjadNd2";
const GUIDE = "https://www.uir.ac.ma/upload/media/6a33f7f03ebae117048999.pdf";
const PAGE = "https://www.uir.ac.ma/fr/page/bourse";

export const SCHOLARSHIPS = [
{ id: "uir-bourse-etudes-internationaux", data: {
title: "Bourse d'études de l'UIR pour étudiants internationaux",
country: "Maroc",
status: "Ouverte",
isActive: true,
levels: ["Licence", "Master"],
officialWebsite: PAGE,
image: "uir-bourse-etudes-internationaux.jpg",
funder: "universite",
funderName: "Université Internationale de Rabat (UIR)",
entryPoint: "universite",
exigences: ["admission_prealable"],
sourceEcheance: PAGE,
verifieLe: LE,
funding: "Frais de scolarité réduits en partie ou en totalité, logement possible. La bourse couvre toute la durée du cycle, sous réserve du règlement ; le logement ne vaut que pour une chambre double.",
description: "Bourse partielle ou totale de l'Université Internationale de Rabat, pour les étudiants internationaux méritants aux revenus modestes, sur dossier.",
eligibility: { note: "Un guide du boursier est publié pour les étudiants internationaux. La bourse est réservée aux étudiants inscrits à l'UIR.", scope: "monde" },
periodeOuverture: "après l'inscription, sur bourse.uir.ac.ma ; plateforme ouverte le 23 juin 2026, clôture non publiée",
generalCriteria: [
"La bourse combine l'excellence académique et des critères sociaux : revenus des parents, composition de la famille, situation d'orphelin.",
"En première année après le bac, il faut avoir obtenu le baccalauréat l'année même de l'inscription, avec au moins la mention Assez bien, soit 12 sur 20. Pour un bac étranger, c'est la moyenne générale du bac qui compte.",
"En deuxième année et plus, il ne faut pas avoir redoublé depuis le bac, et avoir obtenu au moins une mention Assez bien dans le supérieur.",
"En master, il faut avoir obtenu la licence en quatre ans au plus, avec au moins une mention Assez bien pendant la licence.",
"La demande se fait en ligne sur bourse.uir.ac.ma, une fois inscrit, avec l'adresse électronique UIR. Les dossiers incomplets ou déposés en retard sont rejetés.",
"La bourse n'est pas reconduite en cas de redoublement, et elle ne couvre pas les frais dus aux universités partenaires en double diplôme.",
"L'UIR est privée : la bourse de l'AMCI ne la concerne pas."
].join("\n")
} }
];

const champs = (niveau) => ({
status: "Ouverte",
isActive: true,
duration: "Toute la durée du cycle, sous réserve du règlement",
ouverteVerifieeLe: LE,
coverage: "Réduction partielle ou totale des frais de scolarité, logement en chambre double possible",
deadline: "La demande se dépose après l'inscription à l'UIR, sur la plateforme bourse.uir.ac.ma. Elle a ouvert le 23 juin 2026 ; la date de clôture n'est pas publiée. Les dossiers déposés en retard sont rejetés.",
description: niveau === "Licence"
? "En première année, bac de l'année et mention Assez bien au moins exigés. Critères académiques et sociaux, dossier en ligne après l'inscription."
: "Licence obtenue en quatre ans au plus, avec au moins une mention Assez bien. Critères académiques et sociaux, dossier en ligne après l'inscription.",
sourceVerification: {
url: GUIDE,
citation: niveau === "Licence"
? "Pour les Demandeurs inscrits en première année (post baccalauréat) : Avoir obtenu son baccalauréat la même année que son inscription en première année à l'Université ; Avoir obtenu, au minimum, la mention « Assez-Bien » au baccalauréat (ou à un diplôme équivalent)"
: "Pour les Demandeurs inscrits en Master : Avoir obtenu sa licence en 4 ans au maximum. Avoir obtenu, au minimum, 1 mention « Assez Bien » durant une des années du cycle licence.",
le: LU,
parUid: PAR
}
});

export const LINKS = ["Licence", "Master"].map((niveau) => ({
scholarshipId: "uir-bourse-etudes-internationaux",
pays: "Maroc",
universityIds: ["universite-internationale-de-rabat"],
niveaux: [niveau],
motif: "Lot 107 — bourse propre de l'UIR, guide du boursier pour les étudiants internationaux.",
champs: champs(niveau)
}));

export const UNIVERSITIES = [];
export const PATCHES = [];
export const SUPPRESSIONS = [];

const manquants = SCHOLARSHIPS.map((s) => s.data.image)
.filter((f) => f && !existsSync(`assets/images/scholarships/${f.replace(/\.jpg$/, "")}-1600w.avif`));

if (manquants.length && !process.env.LOT107_SANS_PHOTOS) {
throw new Error(`Lot 107 : ${manquants.length} photo(s) absente(s) : lancer d'abord \`node scripts\\add-lot107-photos.mjs\` :\n  ${manquants.join("\n  ")}`);
}
