// ============================================================
// FitzUniverse — Lot 87 : sources des fiches roumaines remises aux
// règles « fiche 5 » (2026-09-24, soir)
//
// POURQUOI
// `npm test` après le lot 86 : « fiche 5 » refuse topuniversities.com
// comme SOURCE d'un fait (le rang QS reste affiché dans `ranking`, mais
// il ne justifie aucun élément de la démarche) et exige des frais de
// dossier dits. Six fiches du lot 84 citaient topuniversities dans
// admission.sources ; POLITEHNICA Bucarest n'avait pas de frais de
// dossier et, sans topuniversities, seulement deux sources.
//
// POLITEHNICA : le guide de candidature 2026 (apply.upb.ro, relu au
// navigateur) liste les pièces du dossier sans aucun frais de dossier ;
// seule la confirmation par paiement d'une année est demandée. La fiche
// le dit, avec ce guide en troisième source.
//
// `attendu` porte le bloc `admission` COMPLET lu dans l'export de
// 22 h 47 (après le lot 86).
// ============================================================

export const PATCHES = [
  {
    "collection": "universities",
    "id": "politehnica-bucuresti-bucarest",
    "motif": "source retirée : topuniversities.com n'est pas une source de fait (règle « fiche 5 ») ; le rang QS reste dans ranking ; frais de dossier dits, d'après le guide de candidature 2026 relu au navigateur le 2026-09-24",
    "attendu": {
      "admission": {
        "procedure": "Candidature sur la plateforme de l'université, section des citoyens hors Union européenne. L'université transmet le dossier à la direction des relations internationales du ministère roumain de l'Éducation ; si la réponse est positive, la lettre d'acceptation est envoyée à l'université et à l'ambassade. Vous confirmez ensuite la place dans les 20 jours en payant d'avance les frais d'une année ; à défaut, la place passe au candidat suivant.",
        "calendrier": "Inscriptions en ligne de février à juillet. L'université annonce au moins 30 jours de traitement par le ministère, et au moins 60 jours dans le détail de la procédure : déposez tôt.",
        "langue": "Pour un programme en anglais, en français ou en allemand : certificat reconnu de niveau B1 au moins, TOEFL, IELTS ou Cambridge, DELF ou TCF, Goethe ; pour les ressortissants d'un pays où cette langue est officielle, les documents scolaires qui prouvent des études dans cette langue suffisent. Pour un programme en roumain, sans certificat, vous suivez d'abord l'année préparatoire de roumain, d'une durée de neuf mois.",
        "sources": [
          "https://international.upb.ro/admission/applying/students-from-non-eu-countries",
          "https://upb.ro/wp-content/uploads/2026/02/Metodologie_scolarizare_studenti_state_terte_actualizata-pt-an-univ-2026-2027-1.pdf",
          "https://www.topuniversities.com/universities/national-university-science-technology-politehnica-bucharest"
        ],
        "verifieLe": "2026-09-24"
      }
    },
    "champs": {
      "admission": {
        "procedure": "Candidature sur la plateforme de l'université, section des citoyens hors Union européenne. L'université transmet le dossier à la direction des relations internationales du ministère roumain de l'Éducation ; si la réponse est positive, la lettre d'acceptation est envoyée à l'université et à l'ambassade. Vous confirmez ensuite la place dans les 20 jours en payant d'avance les frais d'une année ; à défaut, la place passe au candidat suivant.",
        "calendrier": "Inscriptions en ligne de février à juillet. L'université annonce au moins 30 jours de traitement par le ministère, et au moins 60 jours dans le détail de la procédure : déposez tôt.",
        "langue": "Pour un programme en anglais, en français ou en allemand : certificat reconnu de niveau B1 au moins, TOEFL, IELTS ou Cambridge, DELF ou TCF, Goethe ; pour les ressortissants d'un pays où cette langue est officielle, les documents scolaires qui prouvent des études dans cette langue suffisent. Pour un programme en roumain, sans certificat, vous suivez d'abord l'année préparatoire de roumain, d'une durée de neuf mois.",
        "sources": [
          "https://international.upb.ro/admission/applying/students-from-non-eu-countries",
          "https://upb.ro/wp-content/uploads/2026/02/Metodologie_scolarizare_studenti_state_terte_actualizata-pt-an-univ-2026-2027-1.pdf",
          "https://apply.upb.ro/assets/guide/2026/application-guide-en.pdf"
        ],
        "verifieLe": "2026-09-24",
        "fraisDossier": "Aucuns frais de dossier ne figurent parmi les pièces demandées par le guide de candidature 2026 ; la place se confirme en payant d'avance les frais de scolarité d'une année."
      }
    }
  },
  {
    "collection": "universities",
    "id": "universite-alexandru-ioan-cuza-iasi",
    "motif": "source retirée : topuniversities.com n'est pas une source de fait (règle « fiche 5 ») ; le rang QS reste dans ranking",
    "attendu": {
      "admission": {
        "fraisDossier": "100 €, non remboursables, par virement à l'université.",
        "sources": [
          "https://www.uaic.ro/wp-content/uploads/2025/12/Registration-for-NON-EU-citizens-2026-2027-2.pdf",
          "https://www.uaic.ro/en/studies/degrees-on-offer-in-english-and-french/",
          "https://www.uaic.ro/en/about-uaic/short-history/",
          "https://www.topuniversities.com/universities/alexandru-ioan-cuza-university",
          "https://studyinromania.gov.ro/mfa_2026-2027"
        ],
        "calendrier": "Pour la rentrée 2026, les dossiers de licence, de master et d'année préparatoire étaient reçus du 1er janvier au 15 juin. En doctorat, le dossier est conseillé avant le 1er juin. Le calendrier de la rentrée 2027 n'est pas encore publié.",
        "verifieLe": "2026-09-24",
        "langue": "Pour un programme en langue étrangère, vous êtes dispensé de l'examen de langue si la langue du programme est officielle dans votre pays, ou avec un certificat de niveau B2 reconnu, par exemple le DELF B2. Pour un programme en roumain, sans certificat de roumain, vous suivez d'abord une année préparatoire de langue roumaine.",
        "procedure": "Pas de plateforme : le dossier complet est envoyé au Bureau des relations internationales, avec la preuve du paiement des frais de dossier. Le bureau vérifie l'éligibilité, la commission de la faculté accepte ou refuse, puis le bureau demande la lettre d'acceptation au ministère roumain de l'Éducation. Une fois la lettre reçue, vous payez les frais de scolarité pour obtenir le visa d'études."
      }
    },
    "champs": {
      "admission": {
        "fraisDossier": "100 €, non remboursables, par virement à l'université.",
        "sources": [
          "https://www.uaic.ro/wp-content/uploads/2025/12/Registration-for-NON-EU-citizens-2026-2027-2.pdf",
          "https://www.uaic.ro/en/studies/degrees-on-offer-in-english-and-french/",
          "https://www.uaic.ro/en/about-uaic/short-history/",
          "https://studyinromania.gov.ro/mfa_2026-2027"
        ],
        "calendrier": "Pour la rentrée 2026, les dossiers de licence, de master et d'année préparatoire étaient reçus du 1er janvier au 15 juin. En doctorat, le dossier est conseillé avant le 1er juin. Le calendrier de la rentrée 2027 n'est pas encore publié.",
        "verifieLe": "2026-09-24",
        "langue": "Pour un programme en langue étrangère, vous êtes dispensé de l'examen de langue si la langue du programme est officielle dans votre pays, ou avec un certificat de niveau B2 reconnu, par exemple le DELF B2. Pour un programme en roumain, sans certificat de roumain, vous suivez d'abord une année préparatoire de langue roumaine.",
        "procedure": "Pas de plateforme : le dossier complet est envoyé au Bureau des relations internationales, avec la preuve du paiement des frais de dossier. Le bureau vérifie l'éligibilité, la commission de la faculté accepte ou refuse, puis le bureau demande la lettre d'acceptation au ministère roumain de l'Éducation. Une fois la lettre reçue, vous payez les frais de scolarité pour obtenir le visa d'études."
      }
    }
  },
  {
    "collection": "universities",
    "id": "universite-babes-bolyai-cluj-napoca",
    "motif": "source retirée : topuniversities.com n'est pas une source de fait (règle « fiche 5 ») ; le rang QS reste dans ranking",
    "attendu": {
      "admission": {
        "fraisDossier": "50 €, non remboursables, payés sur la plateforme après avoir rempli le formulaire.",
        "sources": [
          "https://cci.ubbcluj.ro/admission-international-students/candidates-from-other-countries/bachelor/",
          "https://cci.ubbcluj.ro/admission-international-students/candidates-from-other-countries/master-degree/",
          "https://www.ubbcluj.ro/en/despre/prezentare/istoric",
          "https://www.topuniversities.com/universities/babes-bolyai-university",
          "https://studyinromania.gov.ro/mfa_2026-2027"
        ],
        "calendrier": "Pour la rentrée 2026, les candidatures en licence et en master étaient ouvertes du 1er avril au 31 juillet 2026. Le calendrier de la rentrée 2027 n'est pas encore publié.",
        "verifieLe": "2026-09-24",
        "langue": "Il faut un certificat de langue accepté par l'université, pour la langue du programme ; une attestation délivrée par votre lycée ne suffit pas. Pour un programme en roumain, sans certificat de roumain, vous suivez d'abord une année préparatoire de langue roumaine.",
        "procedure": "Candidature en ligne sur la plateforme du Centre de coopération internationale : formulaire, paiement des frais de dossier, puis un seul fichier PDF avec toutes les pièces. L'université examine votre dossier, puis le transmet au ministère roumain de l'Éducation : c'est lui qui délivre la lettre d'acceptation aux études. Avec elle, vous demandez le visa d'études à l'ambassade de Roumanie. Comptez environ 40 jours ouvrés de traitement. Une fois la lettre reçue, vous avez 21 jours pour payer les frais de scolarité."
      }
    },
    "champs": {
      "admission": {
        "fraisDossier": "50 €, non remboursables, payés sur la plateforme après avoir rempli le formulaire.",
        "sources": [
          "https://cci.ubbcluj.ro/admission-international-students/candidates-from-other-countries/bachelor/",
          "https://cci.ubbcluj.ro/admission-international-students/candidates-from-other-countries/master-degree/",
          "https://www.ubbcluj.ro/en/despre/prezentare/istoric",
          "https://studyinromania.gov.ro/mfa_2026-2027"
        ],
        "calendrier": "Pour la rentrée 2026, les candidatures en licence et en master étaient ouvertes du 1er avril au 31 juillet 2026. Le calendrier de la rentrée 2027 n'est pas encore publié.",
        "verifieLe": "2026-09-24",
        "langue": "Il faut un certificat de langue accepté par l'université, pour la langue du programme ; une attestation délivrée par votre lycée ne suffit pas. Pour un programme en roumain, sans certificat de roumain, vous suivez d'abord une année préparatoire de langue roumaine.",
        "procedure": "Candidature en ligne sur la plateforme du Centre de coopération internationale : formulaire, paiement des frais de dossier, puis un seul fichier PDF avec toutes les pièces. L'université examine votre dossier, puis le transmet au ministère roumain de l'Éducation : c'est lui qui délivre la lettre d'acceptation aux études. Avec elle, vous demandez le visa d'études à l'ambassade de Roumanie. Comptez environ 40 jours ouvrés de traitement. Une fois la lettre reçue, vous avez 21 jours pour payer les frais de scolarité."
      }
    }
  },
  {
    "collection": "universities",
    "id": "universite-de-l-ouest-de-timisoara",
    "motif": "source retirée : topuniversities.com n'est pas une source de fait (règle « fiche 5 ») ; le rang QS reste dans ranking",
    "attendu": {
      "admission": {
        "fraisDossier": "100 €, non remboursables.",
        "sources": [
          "https://ri.uvt.ro/en/foreign-students-eu-third-countries/",
          "https://admission.uvt.ro/guide-faq/",
          "https://uvt.ro/wp-content/uploads/sites/3/2026/08/Anexa-12.-Alte-taxe-anul-univ.-2026-2027.pdf",
          "https://www.topuniversities.com/universities/universitatea-de-vest-din-timisoara/west-university-timisoara"
        ],
        "calendrier": "Pour la rentrée 2026, candidatures du 20 janvier au 1er août 2026, en licence, en master et en année préparatoire. Les dossiers déposés avant mars partaient au ministère à partir de mars. Inscription possible jusqu'au 19 février 2027. Le calendrier de la rentrée 2027 n'est pas encore publié.",
        "verifieLe": "2026-09-24",
        "langue": "Pour un programme en langue étrangère, un test de langue est demandé, sauf si vous avez déjà étudié dans cette langue, si elle est officielle dans votre pays ou si vous avez un certificat reconnu. Pour un programme en roumain, sans certificat de roumain, vous suivez d'abord une année préparatoire de langue roumaine.",
        "procedure": "Candidature sur la plateforme d'admission des candidats hors Union européenne. Le service des relations internationales vérifie le dossier, la faculté donne son avis, puis le dossier part au ministère roumain de l'Éducation, qui délivre la lettre d'acceptation. Comptez près de deux mois : déposez tôt."
      }
    },
    "champs": {
      "admission": {
        "fraisDossier": "100 €, non remboursables.",
        "sources": [
          "https://ri.uvt.ro/en/foreign-students-eu-third-countries/",
          "https://admission.uvt.ro/guide-faq/",
          "https://uvt.ro/wp-content/uploads/sites/3/2026/08/Anexa-12.-Alte-taxe-anul-univ.-2026-2027.pdf"
        ],
        "calendrier": "Pour la rentrée 2026, candidatures du 20 janvier au 1er août 2026, en licence, en master et en année préparatoire. Les dossiers déposés avant mars partaient au ministère à partir de mars. Inscription possible jusqu'au 19 février 2027. Le calendrier de la rentrée 2027 n'est pas encore publié.",
        "verifieLe": "2026-09-24",
        "langue": "Pour un programme en langue étrangère, un test de langue est demandé, sauf si vous avez déjà étudié dans cette langue, si elle est officielle dans votre pays ou si vous avez un certificat reconnu. Pour un programme en roumain, sans certificat de roumain, vous suivez d'abord une année préparatoire de langue roumaine.",
        "procedure": "Candidature sur la plateforme d'admission des candidats hors Union européenne. Le service des relations internationales vérifie le dossier, la faculté donne son avis, puis le dossier part au ministère roumain de l'Éducation, qui délivre la lettre d'acceptation. Comptez près de deux mois : déposez tôt."
      }
    }
  },
  {
    "collection": "universities",
    "id": "universite-technique-de-cluj-napoca",
    "motif": "source retirée : topuniversities.com n'est pas une source de fait (règle « fiche 5 ») ; le rang QS reste dans ranking",
    "attendu": {
      "admission": {
        "fraisDossier": "100 €, non remboursables, à payer avant le dépôt du dossier.",
        "sources": [
          "https://bri.utcluj.ro/en/bachelor_noneu.php",
          "https://bri.utcluj.ro/en/fees.php",
          "https://old.utcluj.ro/media/decisions/2026/06/02/Taxele_pentru_anul_universitar_2026-2027.pdf",
          "https://www.topuniversities.com/universities/technical-university-cluj-napoca",
          "https://studyinromania.gov.ro/mfa_2026-2027"
        ],
        "calendrier": "Pour la rentrée 2026, candidatures en ligne du 23 mars au 28 juillet, réponses du ministère jusqu'au 14 août, inscription sur place du 21 septembre au 26 octobre 2026. Le calendrier de la rentrée 2027 n'est pas encore publié.",
        "verifieLe": "2026-09-24",
        "langue": "Certificat de langue exigé : niveau B1 pour le roumain, niveau B2 pour l'anglais, le français ou l'allemand, par exemple Cambridge, IELTS, TOEFL ou DELF. Pour un programme en roumain, sans certificat de roumain, vous suivez d'abord une année préparatoire de langue roumaine.",
        "procedure": "Vous payez les frais de dossier, puis déposez le dossier en ligne. La faculté évalue la candidature et donne un accord préalable. L'université examine votre dossier, puis le transmet au ministère roumain de l'Éducation : c'est lui qui délivre la lettre d'acceptation aux études. Avec elle, vous demandez le visa d'études à l'ambassade de Roumanie. Traitement moyen à l'université : deux semaines. Un dossier incomplet n'est pas traité et ses frais ne sont pas rendus."
      }
    },
    "champs": {
      "admission": {
        "fraisDossier": "100 €, non remboursables, à payer avant le dépôt du dossier.",
        "sources": [
          "https://bri.utcluj.ro/en/bachelor_noneu.php",
          "https://bri.utcluj.ro/en/fees.php",
          "https://old.utcluj.ro/media/decisions/2026/06/02/Taxele_pentru_anul_universitar_2026-2027.pdf",
          "https://studyinromania.gov.ro/mfa_2026-2027"
        ],
        "calendrier": "Pour la rentrée 2026, candidatures en ligne du 23 mars au 28 juillet, réponses du ministère jusqu'au 14 août, inscription sur place du 21 septembre au 26 octobre 2026. Le calendrier de la rentrée 2027 n'est pas encore publié.",
        "verifieLe": "2026-09-24",
        "langue": "Certificat de langue exigé : niveau B1 pour le roumain, niveau B2 pour l'anglais, le français ou l'allemand, par exemple Cambridge, IELTS, TOEFL ou DELF. Pour un programme en roumain, sans certificat de roumain, vous suivez d'abord une année préparatoire de langue roumaine.",
        "procedure": "Vous payez les frais de dossier, puis déposez le dossier en ligne. La faculté évalue la candidature et donne un accord préalable. L'université examine votre dossier, puis le transmet au ministère roumain de l'Éducation : c'est lui qui délivre la lettre d'acceptation aux études. Avec elle, vous demandez le visa d'études à l'ambassade de Roumanie. Traitement moyen à l'université : deux semaines. Un dossier incomplet n'est pas traité et ses frais ne sont pas rendus."
      }
    }
  },
  {
    "collection": "universities",
    "id": "universite-transilvania-brasov",
    "motif": "source retirée : topuniversities.com n'est pas une source de fait (règle « fiche 5 ») ; le rang QS reste dans ranking",
    "attendu": {
      "admission": {
        "fraisDossier": "75 € en licence et en année préparatoire, non remboursables quel que soit le résultat.",
        "sources": [
          "https://www.unitbv.ro/en/prospective-students/admission/admission-information-for-non-eu-citizens.html",
          "https://www.unitbv.ro/en/international-students/tuition-fee.html",
          "https://www.unitbv.ro/en/international-students/registration-fee.html",
          "https://www.topuniversities.com/universities/transilvania-university-brasov",
          "https://studyinromania.gov.ro/mfa_2026-2027"
        ],
        "calendrier": "Pour la rentrée 2026, candidatures en licence, en master et en année préparatoire du 20 mai au 14 juillet 2026, 13 h, heure roumaine. Le calendrier de la rentrée 2027 n'est pas encore publié.",
        "verifieLe": "2026-09-24",
        "langue": "Programme en anglais : TOEFL, IELTS 6,5 au moins, SAT, GRE ou Cambridge, ou quatre ans d'études en anglais. Programme en français : DALF, niveau B2. Programme en roumain : certificat de l'année préparatoire ou certificat de roumain de niveau B2 au moins.",
        "procedure": "Vous remplissez le formulaire en ligne et déposez les pièces en PDF sur la plateforme des candidats hors Union européenne. Un dossier incomplet est rejeté et les dossiers en retard ne sont pas acceptés. À l'inscription, vous présentez les originaux, la lettre d'acceptation du ministère roumain de l'Éducation et le passeport avec le visa d'études."
      }
    },
    "champs": {
      "admission": {
        "fraisDossier": "75 € en licence et en année préparatoire, non remboursables quel que soit le résultat.",
        "sources": [
          "https://www.unitbv.ro/en/prospective-students/admission/admission-information-for-non-eu-citizens.html",
          "https://www.unitbv.ro/en/international-students/tuition-fee.html",
          "https://www.unitbv.ro/en/international-students/registration-fee.html",
          "https://studyinromania.gov.ro/mfa_2026-2027"
        ],
        "calendrier": "Pour la rentrée 2026, candidatures en licence, en master et en année préparatoire du 20 mai au 14 juillet 2026, 13 h, heure roumaine. Le calendrier de la rentrée 2027 n'est pas encore publié.",
        "verifieLe": "2026-09-24",
        "langue": "Programme en anglais : TOEFL, IELTS 6,5 au moins, SAT, GRE ou Cambridge, ou quatre ans d'études en anglais. Programme en français : DALF, niveau B2. Programme en roumain : certificat de l'année préparatoire ou certificat de roumain de niveau B2 au moins.",
        "procedure": "Vous remplissez le formulaire en ligne et déposez les pièces en PDF sur la plateforme des candidats hors Union européenne. Un dossier incomplet est rejeté et les dossiers en retard ne sont pas acceptés. À l'inscription, vous présentez les originaux, la lettre d'acceptation du ministère roumain de l'Éducation et le passeport avec le visa d'études."
      }
    }
  }
];
