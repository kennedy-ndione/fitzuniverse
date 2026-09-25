// ============================================================
// FitzUniverse — Lot 96 : Universitaly d'abord (3 universités italiennes)
// Export de référence : 2026-09-25T13:57:50.146Z
//
// POURQUOI
// La route italienne de l'espace place l'étape « Candidater auprès de
// votre université » AVANT Universitaly : c'est l'ordre de 13 des 16
// universités italiennes du catalogue. Trois font l'inverse, relu sur
// leurs pages officielles le 2026-09-25 : Naples (tous niveaux sauf le
// doctorat), Florence et Pise (licence et cycle unique).
//
// CE QUE LE LOT ÉCRIT
// admission.portailNationalDabord : les niveaux (licence, master,
// cycle_unique) où l'université fait passer d'abord par Universitaly.
// js/route-destination.js le lit : pour ces vœux, l'étape de
// l'université vient après la validation d'Universitaly, sous le titre
// « Suivre les démarches de votre université ».
// ============================================================

export const PATCHES = [
  {
    "collection": "universities",
    "id": "universita-degli-studi-di-napoli-federico-ii-naples",
    "motif": "ordre de la route : Naples : un candidat qui a besoin d'un visa se préinscrit d'abord sur Universitaly ; seul un étudiant déjà résident en Italie s'adresse directement au coordinateur du cours (international.unina.it), relu le 2026-09-25",
    "attendu": {
      "admission": {
        "procedure": "Pré-inscription sur Universitaly pour le visa, puis évaluation du dossier par le coordinateur du programme choisi ; pour un programme à accès limité, inscription au test d'admission selon l'avis publié sur le site du programme. L'inscription se fait ensuite au guichet du secrétariat des étudiants : les étudiants de nationalité étrangère ne peuvent pas s'inscrire en ligne.",
        "conditions": "Diplôme correspondant au titre italien exigé. Pièces pour l'évaluation : traductions, légalisations, attestations CIMEA ou déclaration de valeur. À l'inscription : passeport, photo, code fiscal, récépissé du permis de séjour, déclaration de valeur de l'ambassade d'Italie ou attestation ENIC-NARIC.",
        "calendrier": "2026-2027 : pré-inscription sur Universitaly du 5 mai au 15 juin 2026. Les dates des tests et de l'évaluation sont fixées programme par programme. Le calendrier 2027-2028 n'est pas encore publié.",
        "langue": "Programme en italien : italien B2, par un certificat reconnu versé sur Universitaly ou par un test organisé par le coordinateur. Programme en anglais : pas d'italien exigé ; un certificat d'anglais (IELTS, TOEFL, Cambridge) aide pour le visa.",
        "fraisDossier": "Aucun frais de candidature n'est indiqué sur la page des étudiants hors UE.",
        "sources": [
          "https://www.international.unina.it/non-eu-students-enrolment/",
          "https://www.unina.it/it/w/universitaly_2026_27",
          "https://www.unina.it/documents/d/guest/guida_studente_rapida_26-27_10-7-2026"
        ],
        "verifieLe": "2026-09-25"
      }
    },
    "champs": {
      "admission": {
        "procedure": "Pré-inscription sur Universitaly pour le visa, puis évaluation du dossier par le coordinateur du programme choisi ; pour un programme à accès limité, inscription au test d'admission selon l'avis publié sur le site du programme. L'inscription se fait ensuite au guichet du secrétariat des étudiants : les étudiants de nationalité étrangère ne peuvent pas s'inscrire en ligne.",
        "conditions": "Diplôme correspondant au titre italien exigé. Pièces pour l'évaluation : traductions, légalisations, attestations CIMEA ou déclaration de valeur. À l'inscription : passeport, photo, code fiscal, récépissé du permis de séjour, déclaration de valeur de l'ambassade d'Italie ou attestation ENIC-NARIC.",
        "calendrier": "2026-2027 : pré-inscription sur Universitaly du 5 mai au 15 juin 2026. Les dates des tests et de l'évaluation sont fixées programme par programme. Le calendrier 2027-2028 n'est pas encore publié.",
        "langue": "Programme en italien : italien B2, par un certificat reconnu versé sur Universitaly ou par un test organisé par le coordinateur. Programme en anglais : pas d'italien exigé ; un certificat d'anglais (IELTS, TOEFL, Cambridge) aide pour le visa.",
        "fraisDossier": "Aucun frais de candidature n'est indiqué sur la page des étudiants hors UE.",
        "sources": [
          "https://www.international.unina.it/non-eu-students-enrolment/",
          "https://www.unina.it/it/w/universitaly_2026_27",
          "https://www.unina.it/documents/d/guest/guida_studente_rapida_26-27_10-7-2026"
        ],
        "verifieLe": "2026-09-25",
        "portailNationalDabord": [
          "licence",
          "master",
          "cycle_unique"
        ]
      }
    }
  },
  {
    "collection": "universities",
    "id": "universita-di-firenze-florence",
    "motif": "ordre de la route : Florence, licence et cycle unique, diplôme étranger : Universitaly d'abord, puis rendez-vous consulaire, permis de séjour et inscription sur le portail GCS (unifi.it) ; le master passe d'abord par Apply Unifi, relu le 2026-09-25",
    "attendu": {
      "admission": {
        "procedure": "Licence : pré-inscription sur Universitaly pour le visa, rendez-vous à l'ambassade, puis, à l'arrivée, demande de permis de séjour sous huit jours ouvrables et inscription sur le portail GCS de l'université, avec paiement par PagoPA. Master : demande du document d'admission sur le portail Apply Unifi, avant Universitaly.",
        "conditions": "Licence : diplôme attestant au moins douze ans de scolarité ; avec onze ans, relevé des examens de la première année d'université, avec dix ans, des deux premières années, ou Foundation Year. Pièces : diplôme original légalisé ou apostillé, déclaration de valeur ou attestations CIMEA de vérification et de comparabilité. Un document en anglais, en français ou en espagnol n'a pas à être traduit.",
        "calendrier": "Master 2026-2027 : première session du 10 décembre 2025 au 6 février 2026, deuxième du 16 février au 17 avril 2026 ; la troisième, de juin à août, était réservée aux candidats de l'UE et aux candidats déjà résidents en Italie. Le calendrier 2027-2028 n'est pas encore publié.",
        "langue": "Programme en italien : certificat d'italien B2 (CELI, CILS, PLIDA…), ou test CISIA ITA L2 réussi à 55 sur 72 avec un oral au centre de langues. Programme en anglais : pas d'italien exigé.",
        "fraisDossier": "Master : 20 € de frais de candidature sur Apply Unifi.",
        "sources": [
          "https://www.unifi.it/en/study-us/your-learning-path/start-your-enrolment/international-students/non-eu-students",
          "https://www.unifi.it/en/study-us/access-and-enrolment/tests-and-how-access-courses/italian-language-knowledge",
          "https://apply.unifi.it/news/new/28-20262027-academic-year-intake-rounds",
          "https://apply.unifi.it/news/new/30-apply-admission"
        ],
        "verifieLe": "2026-09-25"
      }
    },
    "champs": {
      "admission": {
        "procedure": "Licence : pré-inscription sur Universitaly pour le visa, rendez-vous à l'ambassade, puis, à l'arrivée, demande de permis de séjour sous huit jours ouvrables et inscription sur le portail GCS de l'université, avec paiement par PagoPA. Master : demande du document d'admission sur le portail Apply Unifi, avant Universitaly.",
        "conditions": "Licence : diplôme attestant au moins douze ans de scolarité ; avec onze ans, relevé des examens de la première année d'université, avec dix ans, des deux premières années, ou Foundation Year. Pièces : diplôme original légalisé ou apostillé, déclaration de valeur ou attestations CIMEA de vérification et de comparabilité. Un document en anglais, en français ou en espagnol n'a pas à être traduit.",
        "calendrier": "Master 2026-2027 : première session du 10 décembre 2025 au 6 février 2026, deuxième du 16 février au 17 avril 2026 ; la troisième, de juin à août, était réservée aux candidats de l'UE et aux candidats déjà résidents en Italie. Le calendrier 2027-2028 n'est pas encore publié.",
        "langue": "Programme en italien : certificat d'italien B2 (CELI, CILS, PLIDA…), ou test CISIA ITA L2 réussi à 55 sur 72 avec un oral au centre de langues. Programme en anglais : pas d'italien exigé.",
        "fraisDossier": "Master : 20 € de frais de candidature sur Apply Unifi.",
        "sources": [
          "https://www.unifi.it/en/study-us/your-learning-path/start-your-enrolment/international-students/non-eu-students",
          "https://www.unifi.it/en/study-us/access-and-enrolment/tests-and-how-access-courses/italian-language-knowledge",
          "https://apply.unifi.it/news/new/28-20262027-academic-year-intake-rounds",
          "https://apply.unifi.it/news/new/30-apply-admission"
        ],
        "verifieLe": "2026-09-25",
        "portailNationalDabord": [
          "licence",
          "cycle_unique"
        ]
      }
    }
  },
  {
    "collection": "universities",
    "id": "universita-di-pisa-pise",
    "motif": "ordre de la route : Pise, licence et cycle unique hors UE : préinscription sur Universitaly dans les délais de l'appel, puis tests et inscription définitive avec le visa D (unipi.it) ; le master en italien passe d'abord par ammissionelm, relu le 2026-09-25",
    "attendu": {
      "admission": {
        "procedure": "Licence : pré-inscription sur Universitaly pour le visa, inscription aux tests ou concours sur le portail Alice de l'université, puis inscription définitive avec le visa D. Programmes enseignés en anglais : candidature sur le portail applymscenglish.unipi.it. Master en italien : décision d'admission à demander sur le portail ammissionelm avant Universitaly.",
        "conditions": "Au moins douze ans de scolarité, avec un diplôme qui ouvre l'accès à l'université dans le pays. Déclaration de valeur de l'ambassade d'Italie avec traduction officielle en italien, ou attestation CIMEA de comparabilité. Test d'italien obligatoire, à distance en 2026-2027, pour les candidats hors UE résidant à l'étranger.",
        "calendrier": "2026-2027 : Universitaly au plus tard le 30 septembre 2026, plus tôt pour les programmes à nombre limité ; seuls les visas délivrés au plus tard le 30 novembre 2026 sont acceptés ; 4 500 places pour les candidats avec visa. Master en italien : demandes d'admission dès le 8 juillet 2026. Programmes en anglais : dates propres, par exemple le 5 février 2026 en ingénierie.",
        "langue": "Programme en italien : certificat d'italien B2 reconnu (système CLIQ) ou Open Badge du centre de langues de l'université. Programme en anglais : voir l'appel du programme.",
        "fraisDossier": "Programmes en anglais : 30 € par candidature, deux au plus, pour les titulaires d'un diplôme étranger.",
        "sources": [
          "https://www.unipi.it/en/education/registration/enrolment-and-registration/enrolment-for-international-students/bachelors-and-single-cycle-masters-degree-courses-no-eu-citizenship/",
          "https://www.unipi.it/en/education/registration/enrolment-and-registration/enrolment-for-international-students/pre-registration-on-universitaly/",
          "https://applymscenglish.unipi.it/en/studenti/cdlattivi/1",
          "https://applymscenglish.unipi.it/downloads/downloadpdf/bandicdl/2026/bando_9_wdh-lm_en.pdf"
        ],
        "verifieLe": "2026-09-25"
      }
    },
    "champs": {
      "admission": {
        "procedure": "Licence : pré-inscription sur Universitaly pour le visa, inscription aux tests ou concours sur le portail Alice de l'université, puis inscription définitive avec le visa D. Programmes enseignés en anglais : candidature sur le portail applymscenglish.unipi.it. Master en italien : décision d'admission à demander sur le portail ammissionelm avant Universitaly.",
        "conditions": "Au moins douze ans de scolarité, avec un diplôme qui ouvre l'accès à l'université dans le pays. Déclaration de valeur de l'ambassade d'Italie avec traduction officielle en italien, ou attestation CIMEA de comparabilité. Test d'italien obligatoire, à distance en 2026-2027, pour les candidats hors UE résidant à l'étranger.",
        "calendrier": "2026-2027 : Universitaly au plus tard le 30 septembre 2026, plus tôt pour les programmes à nombre limité ; seuls les visas délivrés au plus tard le 30 novembre 2026 sont acceptés ; 4 500 places pour les candidats avec visa. Master en italien : demandes d'admission dès le 8 juillet 2026. Programmes en anglais : dates propres, par exemple le 5 février 2026 en ingénierie.",
        "langue": "Programme en italien : certificat d'italien B2 reconnu (système CLIQ) ou Open Badge du centre de langues de l'université. Programme en anglais : voir l'appel du programme.",
        "fraisDossier": "Programmes en anglais : 30 € par candidature, deux au plus, pour les titulaires d'un diplôme étranger.",
        "sources": [
          "https://www.unipi.it/en/education/registration/enrolment-and-registration/enrolment-for-international-students/bachelors-and-single-cycle-masters-degree-courses-no-eu-citizenship/",
          "https://www.unipi.it/en/education/registration/enrolment-and-registration/enrolment-for-international-students/pre-registration-on-universitaly/",
          "https://applymscenglish.unipi.it/en/studenti/cdlattivi/1",
          "https://applymscenglish.unipi.it/downloads/downloadpdf/bandicdl/2026/bando_9_wdh-lm_en.pdf"
        ],
        "verifieLe": "2026-09-25",
        "portailNationalDabord": [
          "licence",
          "cycle_unique"
        ]
      }
    }
  }
];

export const UNIVERSITIES = [];
export const SCHOLARSHIPS = [];
export const LINKS = [];
