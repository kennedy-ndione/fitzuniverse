// ============================================================
// FitzUniverse — Éligibilité par nationalité, Lot 23 (2026-08-30)
//
// Dernière passe d'éligibilité : renseigne le champ `eligibility` sur les
// 82 bourses que l'export du catalogue (admin/export-catalog.html, généré
// le 30/08/2026) listait encore sous `boursesSansEligibilite`. Les lots 20
// et 23 réunis couvrent alors 129 des 131 bourses du catalogue.
//
// Ne crée AUCUN document, n'en supprime aucun : un seul champ, en
// setDoc merge. Même patron en trois étapes que les lots 19, 20, 21 et 22.
//
// D'OÙ VIENNENT LES IDENTIFIANTS
// Ils ne sont pas reconstruits de mémoire — ils viennent tous de l'export
// JSON de la base, seule source fiable. La reconstruction hors ligne avait
// déjà échoué deux fois (17 pays et ~74 bourses estimés, contre 24 pays et
// 131 bourses en réalité) ; c'est pourquoi export-catalog a été écrit.
//
// LES TROIS FORMES, ET LE PRINCIPE QUI NE BOUGE PAS
//   { scope, groups[], include[], exclude[], note }
// ON NE DIT JAMAIS « NON » À TORT.
//   - scope:"monde"     → aucune condition de nationalité. N'exclut personne.
//   - groups / include  → restriction explicite. Tout pays absent de la
//                         liste est EXCLU : à ne poser que sur une liste
//                         officielle lue à la source.
//   - note SEULE        → s'affiche mais n'exclut personne. C'est le cas
//                         retenu quand une restriction existe mais que la
//                         liste est trop longue, trop mouvante ou non
//                         vérifiable aujourd'hui.
//
// SUR QUOI REPOSE CHAQUE DÉCISION — à lire avant de durcir ce fichier
// Trois niveaux de preuve, volontairement distincts :
//   (1) LU À LA SOURCE le 30/08/2026. Une seule bourse reçoit une liste de
//       pays fermée à ce titre : invest-your-talent-italy, dont les 18 pays
//       sont publiés tels quels par uni-italia.it. Sont également lues à la
//       source, mais traduites en note ou en "monde" : nl-scholarship
//       (nationalité hors EEE), open-doors-scholarship, vanier (fermée et
//       remplacée), ubc-international-scholars-program, auf-eugen-ionescu
//       et auf-petrache-poenaru (pays membres ou observateurs de l'OIF),
//       swiss-government-excellence-scholarships (183 pays, conditions par
//       pays), nawa-banach-scholarship (36 pays de l'aide polonaise),
//       stipendium-hungaricum (accords bilatéraux),
//       malaysia-international-scholarship, mastercard-foundation-*.
//   (2) NATURE DU PROGRAMME. Une bourse régionale italienne de droit à
//       l'étude s'attribue sur revenus et mérite ; une bourse de doctorat
//       italienne est attachée à une place de concours ; une bourse propre
//       à une université suisse, hongroise, roumaine ou canadienne se joue
//       sur le dossier d'admission. Aucune de ces bourses n'a de critère de
//       nationalité — non pas parce qu'une liste a été lue, mais parce
//       qu'il n'en existe pas. C'est ce qui justifie scope:"monde", et
//       scope:"monde" n'exclut personne : le pire cas est une phrase
//       d'affichage un peu trop rassurante, jamais une opportunité cachée.
//   (3) NON VÉRIFIABLE AUJOURD'HUI → note seule, ou rien du tout.
//
// LES DEUX BOURSES QUI NE REÇOIVENT RIEN, ET POURQUOI
//   - king-abdulaziz-scholarship : les campagnes saoudiennes sont annoncées
//     université par université, sans liste de pays publiée ni calendrier
//     fixe. Rien de sûr à écrire.
//   - semmelweis-pannonia-in-excellence : rattachée au programme hongrois
//     Pannónia, dont le sens (mobilité entrante ou sortante, partenariats
//     d'établissement) n'a pas pu être établi. Écrire « ouverte à tous »
//     serait une invention.
//   Un champ absent vaut « non renseigné » et n'exclut personne. L'étape 1
//   les nomme pour que ce silence reste un choix visible.
// ============================================================

import { db } from "../firebase-config.js";

import {
  getDoc,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

function normalize(str) {
  return String(str || "")
    .replace(/ı/g, "i")
    .replace(/İ/g, "i")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

// Bourses volontairement laissées sans éligibilité (voir l'en-tête).
const SANS_ELIGIBILITE_ASSUMEE = [
  { id: "king-abdulaziz-scholarship", raison: "aucune liste de pays publiée ni calendrier fixe côté saoudien" },
  { id: "semmelweis-pannonia-in-excellence", raison: "sens du programme Pannónia non établi — ne pas inventer" }
];

const FIXES = [
  // ---------------- ITALIE — bourses régionales de droit à l'étude (12)
  // Attribuées sur revenus et mérite. Aucun critère de nationalité n'existe :
  // les étudiants non européens justifient les revenus du foyer par une
  // attestation ISEE parificato, ce qui est une condition de dossier. ----------------
  {
    id: "adisu-puglia",
    expectTitle: "Bando Benefici e Servizi ADISU Puglia",
    eligibility: { scope: "monde", note: "Aucune condition de nationalité : la bourse régionale italienne de droit à l'étude s'attribue sur conditions de revenus et de mérite. Les étudiants non européens font établir une attestation ISEE parificato pour justifier les revenus du foyer." }
  },
  {
    id: "ardis-friuli-venezia-giulia",
    expectTitle: "Bando unico per i benefici regionali — ARDiS Friuli-Venezia Giulia",
    eligibility: { scope: "monde", note: "Aucune condition de nationalité : la bourse régionale italienne de droit à l'étude s'attribue sur conditions de revenus et de mérite. Les étudiants non européens font établir une attestation ISEE parificato pour justifier les revenus du foyer." }
  },
  {
    id: "dsu-lombardia-milano-statale",
    expectTitle: "Borsa di studio DSU — Regione Lombardia (Università degli Studi di Milano)",
    eligibility: { scope: "monde", note: "Aucune condition de nationalité : la bourse régionale italienne de droit à l'étude s'attribue sur conditions de revenus et de mérite. Les étudiants non européens font établir une attestation ISEE parificato pour justifier les revenus du foyer." }
  },
  {
    id: "edisu-pavia",
    expectTitle: "Borsa di studio EDiSU Pavia",
    eligibility: { scope: "monde", note: "Aucune condition de nationalité : la bourse régionale italienne de droit à l'étude s'attribue sur conditions de revenus et de mérite. Les étudiants non européens font établir une attestation ISEE parificato pour justifier les revenus du foyer." }
  },
  {
    id: "ergo-emilia-romagna",
    expectTitle: "Borsa di studio ER.GO — Emilia-Romagna",
    eligibility: { scope: "monde", note: "Aucune condition de nationalité : la bourse régionale italienne de droit à l'étude s'attribue sur conditions de revenus et de mérite. Les étudiants non européens font établir une attestation ISEE parificato pour justifier les revenus du foyer." }
  },
  {
    id: "aliseo-liguria",
    expectTitle: "Borsa di studio universitaria ALiSEO — Liguria",
    eligibility: { scope: "monde", note: "Aucune condition de nationalité : la bourse régionale italienne de droit à l'étude s'attribue sur conditions de revenus et de mérite. Les étudiants non européens font établir une attestation ISEE parificato pour justifier les revenus du foyer." }
  },
  {
    id: "campania-regional-scholarship",
    expectTitle: "Campania Regional Scholarship",
    eligibility: { scope: "monde", note: "Aucune condition de nationalité : la bourse régionale italienne de droit à l'étude s'attribue sur conditions de revenus et de mérite. Les étudiants non européens font établir une attestation ISEE parificato pour justifier les revenus du foyer." }
  },
  {
    id: "dsu-toscana-scholarship",
    expectTitle: "DSU Toscana Scholarship",
    eligibility: { scope: "monde", note: "Aucune condition de nationalité : la bourse régionale italienne de droit à l'étude s'attribue sur conditions de revenus et de mérite. Les étudiants non européens font établir une attestation ISEE parificato pour justifier les revenus du foyer." }
  },
  {
    id: "edisu-piemonte-scholarship",
    expectTitle: "EDISU Piemonte Scholarship",
    eligibility: { scope: "monde", note: "Aucune condition de nationalité : la bourse régionale italienne de droit à l'étude s'attribue sur conditions de revenus et de mérite. Les étudiants non européens font établir une attestation ISEE parificato pour justifier les revenus du foyer." }
  },
  {
    id: "laziodisco-scholarship",
    expectTitle: "LazioDisco Scholarship",
    eligibility: { scope: "monde", note: "Aucune condition de nationalité : la bourse régionale italienne de droit à l'étude s'attribue sur conditions de revenus et de mérite. Les étudiants non européens font établir une attestation ISEE parificato pour justifier les revenus du foyer." }
  },
  {
    id: "opera-universitaria-scholarship",
    expectTitle: "Opera Universitaria Scholarship",
    eligibility: { scope: "monde", note: "Aucune condition de nationalité : la bourse régionale italienne de droit à l'étude s'attribue sur conditions de revenus et de mérite. Les étudiants non européens font établir une attestation ISEE parificato pour justifier les revenus du foyer." }
  },
  {
    id: "veneto-regional-scholarship",
    expectTitle: "Veneto Regional Scholarship",
    eligibility: { scope: "monde", note: "Aucune condition de nationalité : la bourse régionale italienne de droit à l'étude s'attribue sur conditions de revenus et de mérite. Les étudiants non européens font établir une attestation ISEE parificato pour justifier les revenus du foyer." }
  },
  // ---------------- ITALIE — bourses propres aux universités (15)
  // Mérite académique ou place de concours doctoral. Aucun critère de
  // nationalité. « Réservé aux diplômés de l'étranger » (Unibo) est une
  // condition de parcours, pas de nationalité. ----------------
  {
    id: "bocconi-merit-award",
    expectTitle: "Bocconi Merit Award",
    eligibility: { scope: "monde", note: "Ouverte à toutes les nationalités ; l'attribution se fait au mérite académique." }
  },
  {
    id: "bocconi-graduate-merit-award",
    expectTitle: "Bocconi Graduate Merit Award",
    eligibility: { scope: "monde", note: "Ouverte à toutes les nationalités ; l'attribution se fait au mérite académique." }
  },
  {
    id: "bocconi-phd-scholarship",
    expectTitle: "Bocconi PhD Scholarship",
    eligibility: { scope: "monde", note: "Ouverte à toutes les nationalités : les bourses de doctorat italiennes sont attachées aux places mises au concours par l'université, sans critère de nationalité." }
  },
  {
    id: "politecnico-di-milano-merit-based-scholarship",
    expectTitle: "Politecnico di Milano Merit-Based Scholarship",
    eligibility: { scope: "monde", note: "Ouverte à toutes les nationalités ; l'attribution se fait au mérite académique." }
  },
  {
    id: "politecnico-di-milano-phd-scholarship",
    expectTitle: "Politecnico di Milano PhD Scholarship",
    eligibility: { scope: "monde", note: "Ouverte à toutes les nationalités : les bourses de doctorat italiennes sont attachées aux places mises au concours par l'université, sans critère de nationalité." }
  },
  {
    id: "polito-phd-scholarship",
    expectTitle: "Polito PhD Scholarship",
    eligibility: { scope: "monde", note: "Ouverte à toutes les nationalités : les bourses de doctorat italiennes sont attachées aux places mises au concours par l'université, sans critère de nationalité." }
  },
  {
    id: "sapienza-phd-scholarship",
    expectTitle: "Sapienza PhD Scholarship",
    eligibility: { scope: "monde", note: "Ouverte à toutes les nationalités : les bourses de doctorat italiennes sont attachées aux places mises au concours par l'université, sans critère de nationalité." }
  },
  {
    id: "unibo-phd-scholarship",
    expectTitle: "Unibo PhD Scholarship",
    eligibility: { scope: "monde", note: "Ouverte à toutes les nationalités : les bourses de doctorat italiennes sont attachées aux places mises au concours par l'université, sans critère de nationalité." }
  },
  {
    id: "university-of-florence-phd-scholarship",
    expectTitle: "University of Florence PhD Scholarship",
    eligibility: { scope: "monde", note: "Ouverte à toutes les nationalités : les bourses de doctorat italiennes sont attachées aux places mises au concours par l'université, sans critère de nationalité." }
  },
  {
    id: "university-of-naples-federico-ii-phd-scholarship",
    expectTitle: "University of Naples Federico II PhD Scholarship",
    eligibility: { scope: "monde", note: "Ouverte à toutes les nationalités : les bourses de doctorat italiennes sont attachées aux places mises au concours par l'université, sans critère de nationalité." }
  },
  {
    id: "university-of-padua-phd-scholarship",
    expectTitle: "University of Padua PhD Scholarship",
    eligibility: { scope: "monde", note: "Ouverte à toutes les nationalités : les bourses de doctorat italiennes sont attachées aux places mises au concours par l'université, sans critère de nationalité." }
  },
  {
    id: "university-of-pisa-phd-scholarship",
    expectTitle: "University of Pisa PhD Scholarship",
    eligibility: { scope: "monde", note: "Ouverte à toutes les nationalités : les bourses de doctorat italiennes sont attachées aux places mises au concours par l'université, sans critère de nationalité." }
  },
  {
    id: "university-of-trento-phd-scholarship",
    expectTitle: "University of Trento PhD Scholarship",
    eligibility: { scope: "monde", note: "Ouverte à toutes les nationalités : les bourses de doctorat italiennes sont attachées aux places mises au concours par l'université, sans critère de nationalité." }
  },
  {
    id: "scuola-normale-superiore-phd",
    expectTitle: "Corso di perfezionamento (PhD) — Scuola Normale Superiore",
    eligibility: { scope: "monde", note: "Ouverte à toutes les nationalités : les bourses de doctorat italiennes sont attachées aux places mises au concours par l'université, sans critère de nationalité." }
  },
  {
    id: "international-talents-unibo",
    expectTitle: "International Talents @Unibo",
    eligibility: { scope: "monde", note: "Ouverte à toutes les nationalités. Réservée aux candidats ayant obtenu leur diplôme hors d'Italie : c'est une condition de parcours, pas de nationalité." }
  },
  // ---------------- ITALIE — les deux seuls programmes réellement restreints ----------------
  {
    id: "invest-your-talent-italy",
    expectTitle: "Invest Your Talent in Italy (IYT)",
    eligibility: {
        scope: "liste",
        include: ["AM", "AZ", "BD", "BR", "CO", "EG", "ET", "GH", "IN", "ID", "IR", "KZ", "MX", "KR", "CN", "TR", "TN", "VN"],
        note: "Dix-huit pays seulement, choisis par l'Italie pour leur intérêt stratégique. En Afrique : Égypte, Éthiopie, Ghana et Tunisie. Le Sénégal n'est pas éligible."
      }
  },
  {
    id: "italian-government-scholarship",
    expectTitle: "Italian Government Scholarship",
    eligibility: { note: "La liste des pays éligibles est fixée chaque année par le ministère italien des Affaires étrangères et varie d'une édition à l'autre : vérifier l'appel en cours avant de candidater." }
  },
  // ---------------- SUISSE (10) ----------------
  {
    id: "swiss-government-excellence-scholarships",
    expectTitle: "Swiss Government Excellence Scholarships",
    eligibility: { note: "Ouverte à 183 pays, mais le type de bourse offert et la date limite dépendent du pays d'origine, et certains pays ne donnent accès qu'à la bourse de recherche. Consulter la fiche du pays sur sbfi.admin.ch avant de candidater." }
  },
  {
    id: "eth-esop",
    expectTitle: "ETH Excellence Scholarship & Opportunity Programme (ESOP)",
    eligibility: { scope: "monde", note: "Ouverte à toutes les nationalités ; la sélection porte sur le dossier d'admission en master à l'ETH Zurich." }
  },
  {
    id: "epfl-master-excellence-fellowships",
    expectTitle: "EPFL Master Excellence Fellowships",
    eligibility: { scope: "monde", note: "Ouverte à toutes les nationalités ; l'attribution se fait sur le dossier d'admission en master à l'EPFL." }
  },
  {
    id: "epfl-edic-doctoral",
    expectTitle: "EPFL — Programme doctoral EDIC (informatique et systèmes de communication)",
    eligibility: { scope: "monde", note: "Ouverte à toutes les nationalités ; la bourse est attachée à l'admission au programme doctoral EDIC." }
  },
  {
    id: "iheid-scholarships",
    expectTitle: "Bourses de l'Institut de hautes études internationales et du développement (IHEID)",
    eligibility: { scope: "monde", note: "Ouverte à toutes les nationalités ; l'aide financière est examinée avec le dossier d'admission à l'IHEID." }
  },
  {
    id: "unifr-research-scholarships",
    expectTitle: "Bourses de recherche de l'Université de Fribourg",
    eligibility: { scope: "monde", note: "Ouverte à toutes les nationalités ; la bourse est attachée au projet de recherche accepté par l'Université de Fribourg." }
  },
  {
    id: "unige-excellence-master-fellowships",
    expectTitle: "Excellence Master Fellowships — Université de Genève",
    eligibility: { scope: "monde", note: "Ouverte à toutes les nationalités ; l'attribution se fait sur le dossier d'admission en master à l'Université de Genève." }
  },
  {
    id: "unil-master-grants",
    expectTitle: "UNIL Master's Grants — Université de Lausanne",
    eligibility: { scope: "monde", note: "Ouverte à toutes les nationalités ; réservée aux étudiants ayant obtenu leur diplôme précédent hors de Suisse." }
  },
  {
    id: "uzh-candoc-grant",
    expectTitle: "UZH Candoc Grant (ex-Forschungskredit)",
    eligibility: { scope: "monde", note: "Ouverte à toutes les nationalités ; réservée aux doctorants déjà inscrits à l'Université de Zurich." }
  },
  {
    id: "zeno-karl-schindler-master-thesis",
    expectTitle: "Master Thesis Grant — Fondation Zeno Karl Schindler",
    eligibility: { scope: "monde", note: "Ouverte à toutes les nationalités ; la bourse finance un travail de master mené dans l'un des établissements partenaires de la fondation." }
  },
  // ---------------- HONGRIE (5 écrites sur 6) ----------------
  {
    id: "stipendium-hungaricum",
    expectTitle: "Stipendium Hungaricum",
    eligibility: { note: "Programme fondé sur des accords bilatéraux : seuls les ressortissants des pays partenaires peuvent candidater, chaque pays disposant de son propre quota et de sa propre procédure nationale. Vérifier la page des pays partenaires de stipendiumhungaricum.hu pour l'édition en cours." }
  },
  {
    id: "fao-hungarian-government-scholarship",
    expectTitle: "FAO–Hungarian Government Scholarship Programme",
    eligibility: { note: "Réservée aux ressortissants des pays en développement membres de la FAO, dans les domaines agricoles et alimentaires. La liste est arrêtée chaque année conjointement par la FAO et la Hongrie." }
  },
  {
    id: "corvinus-scholarship",
    expectTitle: "Corvinus Scholarship",
    eligibility: { scope: "monde", note: "Ouverte à toutes les nationalités ; réservée aux étudiants internationaux admis à l'Université Corvinus de Budapest." }
  },
  {
    id: "szte-start-scholarship",
    expectTitle: "SZTE Start Scholarship",
    eligibility: { scope: "monde", note: "Ouverte à toutes les nationalités ; réservée aux étudiants internationaux autofinancés admis à l'Université de Szeged." }
  },
  {
    id: "ud-international-scholarship",
    expectTitle: "UD International Scholarship (Université de Debrecen)",
    eligibility: { scope: "monde", note: "Ouverte à toutes les nationalités ; réservée aux étudiants internationaux autofinancés admis à l'Université de Debrecen." }
  },
  // ---------------- ROUMANIE (6) ----------------
  {
    id: "romanian-government-scholarship",
    expectTitle: "Romanian Government Scholarship",
    eligibility: { note: "Programme destiné aux ressortissants d'États non membres de l'Union européenne ; le dossier se dépose auprès de l'ambassade de Roumanie compétente. Vérifier l'appel en cours." }
  },
  {
    id: "auf-eugen-ionescu",
    expectTitle: "Bourses de recherche doctorale et postdoctorale « Eugen Ionescu »",
    eligibility: { note: "Réservée aux doctorants et post-doctorants ressortissants d'un pays membre ou observateur de l'OIF — le Sénégal en fait partie — et inscrits dans un établissement membre de l'AUF." }
  },
  {
    id: "auf-petrache-poenaru",
    expectTitle: "Bourses de recherche « Petrache Poenaru »",
    eligibility: { note: "Réservée aux chercheurs ressortissants d'un pays membre ou observateur de l'OIF — le Sénégal en fait partie — et inscrits dans un établissement membre de l'AUF." }
  },
  {
    id: "bourse-george-darie",
    expectTitle: "Bourse d'excellence « George Darie »",
    eligibility: { scope: "monde", note: "Ouverte à toutes les nationalités ; bourse d'excellence attribuée au mérite par l'université." }
  },
  {
    id: "unibuc-international-scholarships",
    expectTitle: "Bourses et aides financières de l'Université de Bucarest",
    eligibility: { scope: "monde", note: "Ouverte à toutes les nationalités ; les aides sont attribuées par l'Université de Bucarest sur dossier." }
  },
  {
    id: "politehnica-excellence-scholarship",
    expectTitle: "POLITEHNICA Bucharest Excellence Scholarship",
    eligibility: { scope: "monde", note: "Ouverte à toutes les nationalités ; bourse d'excellence attribuée au mérite par l'Université POLITEHNICA de Bucarest." }
  },
  // ---------------- RUSSIE (5) ----------------
  {
    id: "quota-gouvernement-russe",
    expectTitle: "Quota du Gouvernement de la Fédération de Russie",
    eligibility: { note: "Le quota est réparti pays par pays : le nombre de places et la présélection dépendent de la représentation russe compétente. Vérifier la fiche du pays sur education-in-russia.com." }
  },
  {
    id: "open-doors-scholarship",
    expectTitle: "Open Doors: Russian Scholarship Project",
    eligibility: { scope: "monde", note: "Ouverte à tous les citoyens non russes, ainsi qu'aux apatrides et aux Russes résidant à l'étranger." }
  },
  {
    id: "hse-into-olympiad",
    expectTitle: "HSE International Olympiad (INTO)",
    eligibility: { scope: "monde", note: "Ouverte à toutes les nationalités ; le classement à l'olympiade détermine seul le montant de la bourse." }
  },
  {
    id: "spbu-open-olympiad",
    expectTitle: "Olympiade internationale ouverte de l'Université d'État de Saint-Pétersbourg",
    eligibility: { scope: "monde", note: "Ouverte à toutes les nationalités ; le classement à l'olympiade détermine seul l'accès à la bourse." }
  },
  {
    id: "hse-merit-scholarships",
    expectTitle: "Bourses au mérite HSE University",
    eligibility: { scope: "monde", note: "Ouverte à toutes les nationalités ; l'attribution se fait au mérite académique à l'admission." }
  },
  // ---------------- CANADA (4) ----------------
  {
    id: "vanier-canada-graduate-scholarship",
    expectTitle: "Vanier Canada Graduate Scholarship",
    eligibility: { scope: "monde", note: "Était ouverte à toutes les nationalités. Le programme n'accepte plus de candidatures et a été remplacé par la Bourse d'études supérieures du Canada — doctorat." }
  },
  {
    id: "lester-b-pearson-international-scholarship",
    expectTitle: "Lester B. Pearson International Scholarship",
    eligibility: { scope: "monde", note: "Ouverte à toutes les nationalités ; réservée aux étudiants internationaux entrant en première année de licence à l'Université de Toronto, sur nomination de leur établissement secondaire." }
  },
  {
    id: "mcgill-major-entrance-scholarships",
    expectTitle: "McGill Major Entrance Scholarships",
    eligibility: { scope: "monde", note: "Ouverte à toutes les nationalités ; attribuée au mérite à l'entrée en licence à McGill." }
  },
  {
    id: "ubc-international-scholars-program",
    expectTitle: "UBC International Scholars Program (IMES)",
    eligibility: { scope: "monde", note: "Ouverte à toutes les nationalités, sans condition de pays : il faut entrer à UBC directement depuis le secondaire, viser un premier diplôme et justifier d'un besoin financier important." }
  },
  // ---------------- CHINE (3)
  // Bourses municipales : le dossier passe par une université de la ville,
  // qui le présente à la municipalité. Ouvertes à tous les étrangers. ----------------
  {
    id: "beijing-government-scholarship",
    expectTitle: "Beijing Government Scholarship",
    eligibility: { scope: "monde", note: "Ouverte à toutes les nationalités étrangères ; le dossier se dépose auprès d'une université de Pékin, qui présente la candidature à la municipalité." }
  },
  {
    id: "nanjing-government-scholarship",
    expectTitle: "Nanjing Government Scholarship",
    eligibility: { scope: "monde", note: "Ouverte à toutes les nationalités étrangères ; le dossier se dépose auprès d'une université de Nankin, qui présente la candidature à la municipalité." }
  },
  {
    id: "shanghai-government-scholarship",
    expectTitle: "Shanghai Government Scholarship",
    eligibility: { scope: "monde", note: "Ouverte à toutes les nationalités étrangères ; le dossier se dépose auprès d'une université de Shanghai, qui présente la candidature à la municipalité." }
  },
  // ---------------- BELGIQUE (3)
  // Les trois opérateurs belges travaillent par pays partenaires, avec des
  // listes fixées appel par appel et parfois programme par programme. Aucune
  // n'est stable assez pour être codée : note seule. ----------------
  {
    id: "bourses-formations-internationales-ares",
    expectTitle: "Bourses de formations internationales (ARES)",
    eligibility: { note: "Réservée aux ressortissants des pays partenaires de la coopération belge au développement, résidant et travaillant dans leur pays au moment de la candidature. La liste des pays est fixée dans chaque appel de l'ARES." }
  },
  {
    id: "icp-connect-scholarships-vlir-uos",
    expectTitle: "ICP Connect Scholarships (VLIR-UOS)",
    eligibility: { note: "Réservée aux ressortissants des pays partenaires de VLIR-UOS, avec une liste propre à chaque programme de master : la vérifier dans la fiche du programme visé." }
  },
  {
    id: "bourse-master-in-wbi",
    expectTitle: "Bourse Master IN (WBI)",
    eligibility: { note: "Bourse liée aux accords de coopération de Wallonie-Bruxelles International : seuls les ressortissants des pays couverts par un programme de travail en cours peuvent candidater." }
  },
  // ---------------- MAROC (3) ----------------
  {
    id: "bourse-gouvernement-maroc-amci",
    expectTitle: "Bourse du Gouvernement du Maroc (AMCI)",
    eligibility: { note: "Attribuée dans le cadre des accords de coopération du Maroc, très majoritairement avec des pays africains ; le dossier se dépose auprès de l'ambassade du Maroc du pays de résidence, jamais directement auprès de l'AMCI." }
  },
  {
    id: "bourses-master-aui",
    expectTitle: "Bourses de Master AUI (international)",
    eligibility: { scope: "monde", note: "Ouverte à toutes les nationalités ; l'aide est attribuée par Al Akhawayn University au mérite et sur besoin financier." }
  },
  {
    id: "mastercard-foundation-scholars-um6p",
    expectTitle: "Programme Mastercard Foundation Scholars (UM6P)",
    eligibility: { note: "Programme de la Mastercard Foundation destiné à de jeunes Africains économiquement défavorisés, avec une priorité donnée aux femmes et aux jeunes en situation de handicap." }
  },
  // ---------------- ALLEMAGNE (2) ----------------
  {
    id: "daad-study-scholarships",
    expectTitle: "DAAD Study Scholarships",
    eligibility: { note: "Les conditions, les disciplines couvertes et la date limite dépendent du pays d'origine : consulter la fiche du pays dans la base de données de bourses du DAAD avant de candidater." }
  },
  {
    id: "landesstipendium-niedersachsen",
    expectTitle: "Landesstipendium Niedersachsen",
    eligibility: { scope: "monde", note: "Ouverte à toutes les nationalités ; la bourse est attribuée au mérite par l'université de Basse-Saxe qui accueille l'étudiant." }
  },
  // ---------------- ÉTATS-UNIS (2) ----------------
  {
    id: "knight-hennessy-scholars",
    expectTitle: "Knight-Hennessy Scholars",
    eligibility: { scope: "monde", note: "Ouverte à toutes les nationalités, sans condition de pays ni de discipline ; il faut candidater en parallèle à un programme de troisième cycle de Stanford." }
  },
  {
    id: "mastercard-foundation-scholars-program",
    expectTitle: "Mastercard Foundation Scholars Program",
    eligibility: { note: "Programme de la Mastercard Foundation destiné à de jeunes Africains économiquement défavorisés, avec une priorité donnée aux femmes et aux jeunes en situation de handicap." }
  },
  // ---------------- FRANCE (2) ----------------
  {
    id: "bourse-emile-boutmy",
    expectTitle: "Bourse Émile Boutmy",
    eligibility: { note: "Réservée aux étudiants hors Union européenne admis à Sciences Po et acquittant les droits de scolarité au taux hors UE : les ressortissants africains sont donc concernés." }
  },
  {
    id: "eiffel-excellence-scholarship",
    expectTitle: "Eiffel Excellence Scholarship",
    eligibility: { note: "Réservée aux candidats de nationalité étrangère : les binationaux possédant la nationalité française n'y sont pas éligibles. La candidature est déposée par l'établissement français, jamais par l'étudiant lui-même." }
  },
  // ---------------- PAYS À UNE SEULE BOURSE (8) ----------------
  {
    id: "mastercard-foundation-scholars-uct",
    expectTitle: "Mastercard Foundation Scholars Program — UCT",
    eligibility: { note: "Programme de la Mastercard Foundation destiné à de jeunes Africains économiquement défavorisés, avec une priorité donnée aux femmes et aux jeunes en situation de handicap." }
  },
  {
    id: "iccr-africa-scholarship-scheme",
    expectTitle: "ICCR Scholarship Scheme — India-Africa Maitri Scheme",
    eligibility: { note: "Volet africain des bourses de l'ICCR : réservé aux ressortissants de pays africains, le dossier se déposant auprès de la mission diplomatique indienne du pays de nationalité." }
  },
  {
    id: "jica-sdgs-global-leader",
    expectTitle: "JICA SDGs Global Leader Program",
    eligibility: { note: "Programme de la JICA ouvert aux ressortissants des pays partenaires de la coopération japonaise ; la sélection passe par le bureau JICA du pays et vise en priorité des agents du secteur public." }
  },
  {
    id: "malaysia-international-scholarship",
    expectTitle: "Malaysia International Scholarship (MIS)",
    eligibility: { scope: "monde", note: "Ouverte aux citoyens de tous les pays ; les critères détaillés et les domaines prioritaires sont publiés chaque année dans les Guidelines MIS." }
  },
  {
    id: "nl-scholarship",
    expectTitle: "NL Scholarship (ex-Holland Scholarship)",
    eligibility: { note: "Réservée aux étudiants de nationalité hors Espace économique européen, candidats à une licence ou un master à temps plein dans un établissement néerlandais participant et n'ayant pas déjà obtenu de diplôme aux Pays-Bas. Les ressortissants africains sont donc éligibles." }
  },
  {
    id: "nawa-banach-scholarship",
    expectTitle: "Banach NAWA Scholarship Programme",
    eligibility: { note: "Ouverte aux ressortissants de 36 pays couverts par l'aide polonaise au développement (Europe de l'Est, Asie, Afrique, Amérique latine) ; la liste exacte figure dans l'appel de l'année et doit être vérifiée avant de candidater." }
  },
  {
    id: "bolsas-cooperacao-camoes",
    expectTitle: "Bolsas de Cooperação — Formação em Portugal (Camões, I.P.)",
    eligibility: { note: "Bourses de la coopération portugaise, destinées aux pays africains de langue officielle portugaise — Angola, Cap-Vert, Guinée-Bissau, Mozambique, São Tomé-et-Príncipe — et au Timor-Leste. Le Sénégal n'est pas concerné." }
  },
  {
    id: "swedish-institute-scholarships-global-professionals",
    expectTitle: "Swedish Institute Scholarships for Global Professionals (SISGP)",
    eligibility: { note: "Ouverte aux ressortissants d'une liste fermée de pays, révisée à chaque édition par le Svenska institutet : la vérifier sur si.se avant de candidater." }
  },
];

// ==========================================================
// Étape 1 — analyse (lecture seule)
// ==========================================================

const analyzeBtn = document.getElementById("analyzeBtn");
const writeBtn = document.getElementById("writeBtn");
const verifyBtn = document.getElementById("verifyBtn");
const analyzeLog = document.getElementById("analyzeLog");
const writeLog = document.getElementById("writeLog");
const verifyLog = document.getElementById("verifyLog");

let lastPlan = null;

function log(box, msg, cls) {
  box.classList.add("is-visible");
  const line = document.createElement("div");
  if (cls) line.className = cls;
  line.textContent = msg;
  box.appendChild(line);
  box.scrollTop = box.scrollHeight;
}

analyzeBtn.addEventListener("click", async () => {

  analyzeBtn.disabled = true;
  analyzeLog.innerHTML = "";
  lastPlan = null;

  try {

    let blocking = false;
    const plan = [];
    const vus = new Set();

    log(analyzeLog, `Vérification des ${FIXES.length} bourses adressées par identifiant...`);

    for (const f of FIXES) {

      if (vus.has(f.id)) {
        log(analyzeLog, `ERREUR : "${f.id}" apparaît deux fois dans FIXES — doublon dans le lot.`, "err");
        blocking = true;
        continue;
      }
      vus.add(f.id);

      const snap = await getDoc(doc(db, "scholarships", f.id));

      if (!snap.exists()) {
        log(analyzeLog, `ERREUR : "${f.id}" absent de la base — les lots 19 et 21 ont-ils bien été exécutés ?`, "err");
        blocking = true;
        continue;
      }

      const titre = snap.data().title || "";

      // Garde contre un identifiant réutilisé pour une autre bourse : le
      // titre attendu est le titre EXACT lu dans l'export, pas un fragment.
      if (normalize(titre) !== normalize(f.expectTitle)) {
        log(analyzeLog, `ERREUR : "${f.id}" existe mais son titre a changé.`, "err");
        log(analyzeLog, `    attendu : "${f.expectTitle}"`, "err");
        log(analyzeLog, `    en base : "${titre}"`, "err");
        blocking = true;
        continue;
      }

      // Ne jamais écraser une éligibilité déjà posée par un lot précédent.
      const dejaPosee = snap.data().eligibility;
      if (dejaPosee && typeof dejaPosee === "object") {
        log(analyzeLog, `IGNORÉE : "${f.id}" porte déjà une éligibilité (${JSON.stringify(dejaPosee)}) — non touchée.`, "warn");
        continue;
      }

      plan.push({ id: f.id, label: titre, eligibility: f.eligibility });
    }

    log(analyzeLog, "");
    log(analyzeLog, `${plan.length}/${FIXES.length} bourses confirmées par égalité exacte de titre.`, plan.length === FIXES.length ? "ok" : "warn");

    // Répartition des trois formes, pour relecture avant écriture.
    const monde = plan.filter((p) => p.eligibility.scope === "monde").length;
    const listes = plan.filter((p) => p.eligibility.scope === "liste" || p.eligibility.scope === "groupes").length;
    const notes = plan.filter((p) => !p.eligibility.scope).length;

    log(analyzeLog, "");
    log(analyzeLog, `Répartition : ${monde} « ouverte à toutes les nationalités », ${listes} avec liste de pays fermée, ${notes} en note seule.`);
    log(analyzeLog, `Seules les ${listes} bourses à liste fermée peuvent répondre « non » à un étudiant. Les ${notes + monde} autres n'excluent personne.`);

    log(analyzeLog, "");
    log(analyzeLog, `${SANS_ELIGIBILITE_ASSUMEE.length} bourses resteront volontairement sans éligibilité :`);
    SANS_ELIGIBILITE_ASSUMEE.forEach((s) => log(analyzeLog, `  - ${s.id} — ${s.raison}`, "warn"));

    if (blocking) {
      log(analyzeLog, "");
      log(analyzeLog, "Anomalie(s) détectée(s) — corriger avant l'étape 2. Aucune écriture n'a eu lieu.", "err");
      return;
    }

    if (!plan.length) {
      log(analyzeLog, "");
      log(analyzeLog, "Rien à écrire : toutes les bourses du lot portent déjà une éligibilité. Lot déjà passé.", "ok");
      return;
    }

    lastPlan = plan;
    log(analyzeLog, "");
    log(analyzeLog, "Plan prêt. Seul le champ `eligibility` sera écrit, aucun autre champ n'est touché.", "ok");
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

    for (const p of lastPlan) {
      await setDoc(doc(db, "scholarships", p.id), { eligibility: p.eligibility }, { merge: true });
      log(writeLog, `  ${p.id}`, "ok");
    }

    log(writeLog, "");
    log(writeLog, `${lastPlan.length} bourses mises à jour. Lancer l'étape 3.`, "ok");
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

function sameArray(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) return a === b;
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

function sameEligibility(actual, expected) {
  if (!actual || typeof actual !== "object") return false;
  if ((actual.scope || null) !== (expected.scope || null)) return false;
  if ((actual.note || null) !== (expected.note || null)) return false;
  for (const k of ["groups", "include", "exclude"]) {
    const a = actual[k] || [];
    const e = expected[k] || [];
    if (!sameArray(a, e)) return false;
  }
  return true;
}

verifyBtn.addEventListener("click", async () => {

  if (!lastPlan) {
    log(verifyLog, "Lancer les étapes 1 et 2 d'abord.", "err");
    return;
  }

  verifyBtn.disabled = true;
  verifyLog.innerHTML = "";

  try {

    let ecarts = 0;

    for (const p of lastPlan) {
      const snap = await getDoc(doc(db, "scholarships", p.id));
      if (!snap.exists()) {
        log(verifyLog, `MANQUANT : ${p.id}`, "err");
        ecarts++;
        continue;
      }
      if (!sameEligibility(snap.data().eligibility, p.eligibility)) {
        log(verifyLog, `ÉCART : ${p.id}`, "err");
        log(verifyLog, `    attendu : ${JSON.stringify(p.eligibility)}`, "err");
        log(verifyLog, `    en base : ${JSON.stringify(snap.data().eligibility)}`, "err");
        ecarts++;
      } else {
        log(verifyLog, `OK ${p.id}`, "ok");
      }
    }

    log(verifyLog, "");
    if (ecarts === 0) {
      log(verifyLog, `${lastPlan.length}/${lastPlan.length} conformes, 0 écart. Lot 23 terminé.`, "ok");
    } else {
      log(verifyLog, `${ecarts} écart(s) — NE PAS considérer le lot comme terminé.`, "err");
    }

  } catch (err) {
    log(verifyLog, `ERREUR : ${err.message}`, "err");
  } finally {
    verifyBtn.disabled = false;
  }

});
