/**
 * ============================================================
 * LOT 67 — CONSOLIDATION DES BOURSES JAMAIS TOUCHÉES, TRANCHE 1
 *          (22 septembre 2026)
 * ============================================================
 *
 * 27 bourses n'avaient jamais reçu le contrat de fiche (verifieLe,
 * sourceEcheance, periodeOuverture, exigences) : ce sont les « sites
 * bloqués » du lot 40. `node scripts/completude.mjs` les classe par
 * exposition ; cette tranche prend les SEPT premières, sauf Bocconi
 * (licence), dont le lien pointe sur une page de master — décision à
 * Charles avant toute écriture.
 *
 *   Émile Boutmy (120 vues) · UNIL (120) · Veneto/Padoue (78) ·
 *   Polimi mérite (72) · Unibo doctorat (72) · Polytechnique FUI (62) ·
 *   Friedrich-Ebert (50)
 *
 * Chaque page a été LUE le 2026-09-22 : navigateur intégré pour les
 * sites qui refusent la lecture automatique (sciencespo, unil, polimi,
 * unibo, fes), texte des PDF officiels extrait dans le navigateur
 * (appel Polimi, notice FUI), WebFetch pour unipd.it.
 *
 * CE QUE LA LECTURE A CHANGÉ (au-delà des quatre champs du contrat)
 * ----------------------------------------------------------------
 *   - Boutmy : 18 500 €/an en master, pas « jusqu'à 19 000 € ».
 *   - UNIL : le montant « NON PUBLIÉ » est publié — 1 600 CHF/mois.
 *   - Veneto : le doute du lot 60 est levé. Pour les inscrits de
 *     Padoue, la bourse se demande à l'université (Uniweb), clôture le
 *     30 SEPTEMBRE 2026 — huit jours après ce lot.
 *   - Polimi : cycle terminé le 15 décembre 2025, la fiche disait
 *     « Ouverte » ; l'appel ne vise que le MASTER.
 *   - Unibo : troisième appel ouvert jusqu'au 8 octobre 2026 ; la
 *     vérification du 19 avait une citation VIDE.
 *   - Polytechnique : inscriptions FUI 2027 closes à la mi-septembre,
 *     la fiche disait « Ouverte ».
 *   - FES : critères confirmés ; le doctorat est payé 1 500 €/mois, pas
 *     992 €, et chaque niveau porte désormais SA citation.
 *
 * EFFET DE BORD VOULU SUR LE FILTRE « FINANCEMENT INTÉGRAL »
 * ----------------------------------------------------------
 * Veneto (« Jusqu'à 100 % ») et Polimi (« Jusqu'à 100 % ») en
 * sortent : la bourse régionale est plafonnée à 8 246 €/an et la
 * bourse Silver de Polimi n'est qu'une exonération. Unibo reste dedans.
 *
 * CE QUE CE LOT NE FAIT PAS
 * -------------------------
 *   - polimi-bachelor reste rattaché à la bourse au mérite de Polimi,
 *     qui ne concerne pourtant que le master : détacher un programme
 *     est une décision de Charles (même cas qu'Unibo licence).
 *   - Aucun portail privé n'est écrit (Veneto : Uniweb, à ajouter au
 *     prochain lot de portails avec son `attendu`).
 *
 * GÉNÉRÉ, PAS RETAPÉ
 * ------------------
 * Chaque `attendu` est la valeur exacte de l'export du
 * 2026-09-21T09:42 (`undefined` = champ absent en base). Comme au
 * lot 63, `sourceVerification` n'est PAS dans `attendu` : son `le` est
 * un Timestamp en base. `parUid` porte le compte de Charles : c'est
 * lui qui valide les citations en relisant `analyser`.
 *
 * RÈGLES D'ÉCRITURE DES ÉCHÉANCES, RESPECTÉES ET REJOUÉES
 * -------------------------------------------------------
 * Une seule date complète en tête ; toujours l'année ; « jusqu'au »
 * devant la date qui compte quand il y en a plusieurs ; aucun des
 * marqueurs « clos », « fermée », « à confirmer », « variable »,
 * « estimé » dans un `deadline`. Chaque texte a été passé dans
 * analyserEcheance() + etatCandidature() au 2026-09-22 avant livraison.
 * ============================================================
 */

export const PATCHES =[
  {
    "collection": "scholarships",
    "id": "bourse-emile-boutmy",
    "attendu": {
      "funding": "Partielle (jusqu'à 19 000 €/an)",
      "generalCriteria": "Non-UE, premier candidat à Sciences Po, admis en Licence ou Master, dossier financier familial à fournir.",
      "verifieLe": undefined,
      "sourceEcheance": undefined,
      "periodeOuverture": undefined,
      "exigences": undefined
    },
    "champs": {
      "funding": "Partielle : exonération de 18 500 € par an sur les droits de scolarité en master (deux ans) ; en licence, exonération totale ou de 9 500 € par an",
      "generalCriteria": "Hors Union européenne, première candidature à Sciences Po, foyer qui ne déclare pas ses impôts dans l'UE. La bourse se demande DANS le dossier d'admission (rubrique « Financial information ») : impossible de la demander après l'admission ou en cours d'études. Non cumulable avec une autre bourse de Sciences Po ou de ses partenaires (Mastercard, CSC…), cumulable avec une bourse extérieure (Eiffel, bourses du gouvernement français). Exclus notamment : binationaux dont une nationalité est européenne, masters en un an, doctorat, la plupart des doubles diplômes de master. Perdue en cas de report d'admission.",
      "verifieLe": "2026-09-22",
      "sourceEcheance": "https://www.sciencespo.fr/students/en/fees-funding/bursaries-financial-aid/emile-boutmy-scholarship/",
      "periodeOuverture": "suit le calendrier d'admission : pour le master, deux comités (mi-octobre et fin novembre) ; pour la licence, dossier en janvier pour les lycées étrangers",
      "exigences": [
        "admission_prealable"
      ]
    },
    "motif": "Page officielle de Sciences Po lue le 2026-09-22 (navigateur). Montant corrigé : la page donne « a €18,500 exemption from tuition fees for each of the two years of the Master's programme », et pour la licence « either a total exemption or an exemption of €9,500 ». La fiche disait « jusqu'à 19 000 €/an ». La demande se fait dans le dossier d'admission, jamais après : critères réécrits en conséquence."
  },
  {
    "collection": "programs",
    "id": "sciences-po-paris__bourse-emile-boutmy",
    "attendu": {
      "coverage": "Jusqu'à 19 000 €/an (partielle)"
    },
    "champs": {
      "coverage": "Exonération de 18 500 € par an sur les droits de scolarité hors UE, pendant les deux années du master"
    },
    "motif": "Même lecture du 2026-09-22 : « a €18,500 exemption from tuition fees for each of the two years of the Master's programme »."
  },
  {
    "collection": "scholarships",
    "id": "unil-master-grants",
    "attendu": {
      "funding": "Montant NON PUBLIÉ : le portail officiel de candidature n'est pas consultable et aucune page accessible ne le chiffre. À confirmer par téléphone au +41 21 692 40 10 avant de s'engager.",
      "generalCriteria": "Le programme cible précisément les diplômés d'universités étrangères — un candidat sénégalais est dans le public visé. Il faut satisfaire aux conditions d'admission du master visé. ÉCHÉANCE ANNUELLE AU 1er NOVEMBRE 2026. Réserve à connaître : le montant n'a pas pu être vérifié à la source, seuls des agrégateurs le citent — ne pas construire un budget dessus sans confirmation écrite de l'université.",
      "verifieLe": undefined,
      "sourceEcheance": undefined,
      "periodeOuverture": undefined,
      "exigences": undefined
    },
    "champs": {
      "funding": "1 600 CHF par mois pendant la durée réglementaire du master, exonération des taxes d'inscription (seuls 80 CHF de taxe semestrielle restent dus) et logement garanti à la FMEL, loyer à la charge de l'étudiant. Une dizaine de bourses par an. Ne couvre pas tout le coût de la vie : les autorités l'estiment à environ 2 000 CHF par mois à Lausanne.",
      "generalCriteria": "Réservée aux titulaires d'un diplôme d'une université ÉTRANGÈRE équivalent à un bachelor suisse (180 crédits ECTS), avec des résultats de très haut niveau ; on peut candidater avant d'avoir le diplôme s'il est obtenu avant la rentrée. Niveau C1 exigé dans la langue du master (français ou anglais). Frais de dossier de 200 CHF. Ne pas être déjà inscrit à l'UNIL. Masters exclus : médecine, sciences de l'éducation, droit (sauf trois spécialisations), et quelques autres listés sur la page. La candidature à la bourse VAUT candidature au master : pas de dossier séparé au service des admissions. Aucune limite d'âge, mais l'université prévient qu'un âge plus élevé ou un premier master déjà obtenu peut compliquer le visa.",
      "verifieLe": "2026-09-22",
      "sourceEcheance": "https://www.unil.ch/unil/en/home/menuinst/etudier/mobilite-et-echange/etudiantes-et-etudiants-internationaux/etudiantes-internationaux-reguliers/bourse-de-master.html",
      "periodeOuverture": "appel annuel : candidature en ligne jusqu'au début novembre, décision début avril, pour la rentrée de septembre suivante",
      "exigences": [
        "lettres_recommandation"
      ]
    },
    "motif": "Page officielle de l'UNIL lue le 2026-09-22 (navigateur ; la lecture automatique est refusée par robots.txt). Le montant était noté « NON PUBLIÉ » : il est publié — « amounts to CHF 1,600 per month ». Deux lettres de recommandation envoyées par leurs auteurs à mastergrants@unil.ch avant le 1er novembre."
  },
  {
    "collection": "programs",
    "id": "universite-de-lausanne-lausanne__unil-master-grants__master",
    "attendu": {
      "deadline": undefined,
      "coverage": undefined
    },
    "champs": {
      "deadline": "1er novembre 2026 pour la rentrée 2027-2028 : inscription en ligne avec un dossier en PDF unique, deux lettres de recommandation envoyées directement par leurs auteurs à mastergrants@unil.ch, et, si le diplôme vient d'un État qui n'a pas ratifié la Convention de Lisbonne, copies certifiées conformes envoyées par la poste (le cachet de la poste fait foi). La candidature à la bourse vaut candidature au master.",
      "coverage": "1 600 CHF par mois et exonération des taxes d'inscription (80 CHF de taxe semestrielle restent dus)"
    },
    "motif": "Lu le 2026-09-22 : « The online application for the academic year 2027/2028 is open. The deadline is 1 November 2026. » Le programme n'avait pas de texte d'échéance, seulement la date vérifiée le 20."
  },
  {
    "collection": "scholarships",
    "id": "veneto-regional-scholarship",
    "attendu": {
      "funding": "Jusqu'à 100 %",
      "funderName": "ESU Veneto",
      "officialWebsite": "https://myesupd.dirittoallostudio.it",
      "generalCriteria": "",
      "verifieLe": undefined,
      "sourceEcheance": undefined,
      "periodeOuverture": undefined,
      "exigences": undefined
    },
    "champs": {
      "funding": "Jusqu'à 8 246 € par an pour un étudiant logé hors de sa commune, selon l'ISEE ; montants plus bas pour un étudiant pendulaire ou résidant à Padoue. Versée en partie en argent, en partie en services (logement, restauration).",
      "funderName": "Région Vénétie (concours géré par l'Università di Padova)",
      "officialWebsite": "https://www.unipd.it/borse-studio-regionali",
      "generalCriteria": "Pour les inscrits de l'Università di Padova, la bourse régionale se demande à l'UNIVERSITÉ, dans Uniweb (« Richiesta di agevolazioni »), et non sur le guichet d'ESU. Plafonds : ISEE 26 306,25 € et ISPE 43 125,94 €. Un étudiant dont la famille vit à l'étranger produit un ISEE parificato, à demander exclusivement au CAF conventionné avec l'université. En première année, l'attribution se fait sur critères économiques et le mérite se vérifie après coup : au moins 20 crédits (CFU) acquis avant le 10 août 2027.",
      "verifieLe": "2026-09-22",
      "sourceEcheance": "https://wwwassets.unipd.it/sites/default/files/2026-07/Bando%20Borse%20Studio%202026-27.pdf",
      "periodeOuverture": "concours annuel publié en juillet, clôture fin septembre, pour l'année universitaire qui commence",
      "exigences": [
        "admission_prealable"
      ]
    },
    "motif": "Bando 2026/2027 de l'Università di Padova lu le 2026-09-22 (« CONCORSO PER L'ASSEGNAZIONE DELLE BORSE DI STUDIO REGIONALI A.A. 2026/2027 ») et page unipd.it/borse-studio-regionali. Lève le doute noté au lot 60 : pour les inscrits de Padoue, la bourse passe par l'université (Uniweb). Échéance au 30 septembre 2026 — dans huit jours. La fiche disait « Jusqu'à 100 % » et « À confirmer »."
  },
  {
    "collection": "programs",
    "id": "unipd-bachelor",
    "attendu": {
      "deadline": "À confirmer selon l'année académique",
      "deadlineISO": undefined,
      "status": "Ouverte",
      "coverage": "Exonération des frais de scolarité avec possibilité d'allocation, de logement et d'aide à la restauration selon les critères d'éligibilité.",
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "30 septembre 2026 : date limite des trois démarches obligatoires — la demande de bénéfices dans Uniweb, l'attestation ISEE (pour un étudiant dont la famille vit à l'étranger, un ISEE parificato demandé uniquement au CAF conventionné avec l'université) et le paiement de la première tranche des droits d'inscription.",
      "deadlineISO": "2026-09-30",
      "status": "Ouverte",
      "coverage": "Bourse régionale jusqu'à 8 246 € par an (étudiant hors de sa commune, selon l'ISEE), en argent et en services (logement, restauration)",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://wwwassets.unipd.it/sites/default/files/2026-07/Bando%20Borse%20Studio%202026-27.pdf",
        "citation": "Per poter concorrere alla borsa di studio è necessario, ENTRO IL 30 SETTEMBRE 2026, compiere tutti i seguenti passaggi",
        "le": "2026-09-22T18:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Bando régional 2026/2027 de l'Università di Padova lu le 2026-09-22 : date limite du 30 septembre 2026 pour les trois démarches. Remplace « À confirmer selon l'année académique »."
  },
  {
    "collection": "programs",
    "id": "unipd-master",
    "attendu": {
      "deadline": "À confirmer selon l'année académique",
      "deadlineISO": undefined,
      "status": "Ouverte",
      "coverage": "Exonération des frais de scolarité avec possibilité d'allocation, de logement et d'aide à la restauration.",
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "30 septembre 2026 : date limite des trois démarches obligatoires — la demande de bénéfices dans Uniweb, l'attestation ISEE (pour un étudiant dont la famille vit à l'étranger, un ISEE parificato demandé uniquement au CAF conventionné avec l'université) et le paiement de la première tranche des droits d'inscription.",
      "deadlineISO": "2026-09-30",
      "status": "Ouverte",
      "coverage": "Bourse régionale jusqu'à 8 246 € par an (étudiant hors de sa commune, selon l'ISEE), en argent et en services (logement, restauration)",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://wwwassets.unipd.it/sites/default/files/2026-07/Bando%20Borse%20Studio%202026-27.pdf",
        "citation": "Per poter concorrere alla borsa di studio è necessario, ENTRO IL 30 SETTEMBRE 2026, compiere tutti i seguenti passaggi",
        "le": "2026-09-22T18:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Bando régional 2026/2027 de l'Università di Padova lu le 2026-09-22 : date limite du 30 septembre 2026 pour les trois démarches. Remplace « À confirmer selon l'année académique »."
  },
  {
    "collection": "scholarships",
    "id": "politecnico-di-milano-merit-based-scholarship",
    "attendu": {
      "status": "Ouverte",
      "funding": "Jusqu'à 100 %",
      "generalCriteria": "",
      "verifieLe": undefined,
      "sourceEcheance": undefined,
      "periodeOuverture": undefined,
      "exigences": undefined
    },
    "champs": {
      "status": "Fermée — appel 2026-2027 achevé, appel 2027-2028 non publié",
      "funding": "Exonération totale des droits de scolarité (reste environ 170 € de frais administratifs). À Milan, bourses Platinum de 10 000 € bruts par an et Gold de 8 000 € bruts ; à Piacenza, 5 000 € ou 2 500 € bruts ; sur les autres campus, exonération seule (Silver). Renouvelable en deuxième année selon les résultats.",
      "generalCriteria": "Réservée aux MASTERS enseignés en anglais (la licence relève des bourses régionales DSU, pas de cet appel). Seuls peuvent candidater ceux qui ont déposé leur candidature d'admission pendant la période « Early Bird » (du 1er octobre au 1er décembre pour l'appel 2026-2027). Formulaire de bourse distinct, sans frais. Il faut être admis, accepter l'admission et fournir un certificat d'anglais valide dans les délais. Sélection au dossier (moyenne, parcours) ; à égalité, priorité aux plus jeunes. Incompatible avec toute autre bourse, sauf de mobilité.",
      "verifieLe": "2026-09-22",
      "sourceEcheance": "https://www.polimi.it/fileadmin/user_upload/futuri_studenti/borse-di-studio/Call_for_Application_for_Merit_2026-2027.pdf",
      "periodeOuverture": "appel annuel : candidature d'admission en « Early Bird » d'octobre à début décembre, formulaire de bourse de la mi-octobre à la mi-décembre, pour la rentrée de septembre suivante",
      "exigences": [
        "admission_prealable",
        "certification_langue_requise"
      ]
    },
    "motif": "Page des bourses et appel 2026-2027 du Politecnico di Milano lus le 2026-09-22 (navigateur). Le cycle 2026-2027 s'est terminé le 15 décembre 2025 ; l'appel 2027-2028 n'est pas publié. La fiche disait « Ouverte » et « Jusqu'à 100 % » : ni l'un ni l'autre n'est juste (la bourse Silver n'est qu'une exonération). L'appel ne vise que le MASTER — voir la décision à prendre sur le programme polimi-bachelor, non touché ici."
  },
  {
    "collection": "programs",
    "id": "polimi-master",
    "attendu": {
      "deadline": "À confirmer selon l'année académique",
      "deadlineISO": undefined,
      "status": "Ouverte",
      "coverage": "Exonération partielle ou totale des frais de scolarité, avec possibilité d'une allocation selon le programme",
      "ouverteVerifieeLe": undefined
    },
    "champs": {
      "deadline": "Appel 2026-2027 terminé : le formulaire de bourse se déposait jusqu'au 15 décembre 2025 à midi (heure italienne), réservé aux candidats qui avaient déposé leur admission en « Early Bird » entre le 1er octobre et le 1er décembre 2025. L'appel 2027-2028 n'est pas encore publié.",
      "deadlineISO": "2025-12-15",
      "status": "Fermée — appel 2026-2027 achevé, appel 2027-2028 non publié",
      "coverage": "Exonération totale des droits (reste environ 170 €) ; à Milan, plus 10 000 € (Platinum) ou 8 000 € (Gold) bruts par an pour certains lauréats",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://www.polimi.it/fileadmin/user_upload/futuri_studenti/borse-di-studio/Call_for_Application_for_Merit_2026-2027.pdf",
        "citation": "The application to Merit Based International Scholarships must be submitted mandatory from October 15 th 2025 and until noon (Italian time) of December 15 th 2025 through Politecnico di Milano Online Services.",
        "le": "2026-09-22T18:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Appel « Merit Based International Scholarships 2026-2027 » lu le 2026-09-22. Remplace « À confirmer selon l'année académique » par la dernière clôture connue et le rythme."
  },
  {
    "collection": "scholarships",
    "id": "unibo-phd-scholarship",
    "attendu": {
      "officialWebsite": "https://www.unibo.it/en",
      "funding": "100 %",
      "generalCriteria": "",
      "verifieLe": undefined,
      "sourceEcheance": undefined,
      "periodeOuverture": undefined,
      "exigences": undefined
    },
    "champs": {
      "officialWebsite": "https://www.unibo.it/en/study/phd-professional-masters-specialisation-schools-and-other-programmes/phd",
      "funding": "100 % : bourse de 16 982,64 € à 19 700,76 € bruts par an selon le programme, pendant la durée du doctorat",
      "generalCriteria": "Les bourses sont attachées aux places mises au concours d'admission de chaque programme doctoral : on candidate au concours, pas à la bourse séparément. Trois appels pour la rentrée d'automne 2026 ; le troisième ne porte que sur 19 programmes — vérifier que le sien y figure. Les conditions de langue sont fixées par chaque programme. Un candidat non européen qui réside hors d'Italie suit la voie « Non-EU country – reside abroad » et doit prévoir le visa plusieurs mois à l'avance.",
      "verifieLe": "2026-09-22",
      "sourceEcheance": "https://www.unibo.it/en/study/phd-professional-masters-specialisation-schools-and-other-programmes/phd",
      "periodeOuverture": "trois appels par an pour une rentrée à l'automne : fin février, mi-mai, puis un troisième appel en fin d'été limité à une partie des programmes",
      "exigences": []
    },
    "motif": "Page doctorat de l'Università di Bologna lue le 2026-09-22 (navigateur). Le troisième appel du 42e cycle est ouvert jusqu'au 8 octobre 2026. L'ancien lien pointait sur la page d'accueil de l'université."
  },
  {
    "collection": "programs",
    "id": "unibo-phd",
    "attendu": {
      "deadline": "À confirmer selon l'appel à candidatures",
      "deadlineISO": undefined,
      "coverage": "Financement complet avec allocation de recherche et exonération des frais de scolarité.",
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "deadline": "8 octobre 2026 : troisième appel du 42e cycle (2026-2027), limité à 19 des programmes doctoraux. Les deux premiers appels (fin février et mi-mai 2026) sont terminés. Vérifiez que votre programme figure dans cet appel avant de préparer le dossier.",
      "deadlineISO": "2026-10-08",
      "coverage": "Bourse de 16 982,64 € à 19 700,76 € bruts par an selon le programme",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://www.unibo.it/en/study/phd-professional-masters-specialisation-schools-and-other-programmes/phd",
        "citation": "The Third call for applications includes 19 of the PhD programmes offered for the a.y. 2026/27. The call is now online. Deadline 8 October 2026.",
        "le": "2026-09-22T18:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "La vérification du 19 septembre avait une citation VIDE et pointait sur la page d'accueil de l'université : c'était une vérification sans preuve. Relue le 2026-09-22 sur la page doctorat, citation à l'appui."
  },
  {
    "collection": "scholarships",
    "id": "polytechnique-concours-international-fui",
    "attendu": {
      "status": "Ouverte",
      "verifieLe": undefined,
      "sourceEcheance": undefined,
      "periodeOuverture": undefined,
      "exigences": undefined
    },
    "champs": {
      "status": "Fermée — inscriptions FUI 2027 terminées à la mi-septembre 2026",
      "verifieLe": "2026-09-22",
      "sourceEcheance": "https://www.polytechnique.edu/admission-cycle-ingenieur/sites/admission/files/content/NOTICE_Concours%20international_FUI%202027_VF%20_Finale.pdf",
      "periodeOuverture": "concours annuel : inscriptions en ligne de la mi-mai à la mi-septembre, oraux début novembre, résultats fin novembre, entrée en septembre de l'année suivante",
      "exigences": []
    },
    "motif": "Notice officielle du concours international FUI 2027 lue le 2026-09-22 (texte du PDF extrait dans le navigateur). Inscriptions « de la mi-mai à la mi-septembre 2026 » : la fenêtre est passée, la fiche disait « Ouverte ». La page du concours renvoie « Access denied » au navigateur intégré ; la clôture exacte est à confirmer par Charles sur candidatures.polytechnique.fr."
  },
  {
    "collection": "programs",
    "id": "ecole-polytechnique-palaiseau__polytechnique-concours-international-fui__licence",
    "attendu": {
      "deadline": undefined,
      "status": undefined,
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Inscriptions au concours FUI 2027 terminées : elles couraient de la mi-mai à la mi-septembre 2026, l'avis officiel ne donnant pas de jour précis. Suite du calendrier pour les inscrits : admissibilité annoncée vers le 10 octobre, oraux par visioconférence du 2 au 15 novembre, résultats d'admission fin novembre, entrée en septembre 2027. Prochaine campagne (FUI 2028) attendue à partir de la mi-mai 2027.",
      "status": "Fermée — inscriptions FUI 2027 terminées",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://www.polytechnique.edu/admission-cycle-ingenieur/sites/admission/files/content/NOTICE_Concours%20international_FUI%202027_VF%20_Finale.pdf",
        "citation": "Les inscriptions se dérouleront en ligne de la mi-mai à la mi-septembre 2026, les dates exactes restant à confirmer.",
        "le": "2026-09-22T18:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Notice FUI 2027 lue le 2026-09-22. Le programme n'avait AUCUN texte d'échéance et sa vérification du 20 disait « aucune date affichée sur cette page » : la notice, elle, en donne."
  },
  {
    "collection": "programs",
    "id": "ecole-polytechnique-palaiseau__polytechnique-concours-international-fui__master",
    "attendu": {
      "deadline": undefined,
      "status": undefined,
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Inscriptions au concours FUI 2027 terminées : elles couraient de la mi-mai à la mi-septembre 2026, l'avis officiel ne donnant pas de jour précis. Suite du calendrier pour les inscrits : admissibilité annoncée vers le 10 octobre, oraux par visioconférence du 2 au 15 novembre, résultats d'admission fin novembre, entrée en septembre 2027. Prochaine campagne (FUI 2028) attendue à partir de la mi-mai 2027.",
      "status": "Fermée — inscriptions FUI 2027 terminées",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://www.polytechnique.edu/admission-cycle-ingenieur/sites/admission/files/content/NOTICE_Concours%20international_FUI%202027_VF%20_Finale.pdf",
        "citation": "Les inscriptions se dérouleront en ligne de la mi-mai à la mi-septembre 2026, les dates exactes restant à confirmer.",
        "le": "2026-09-22T18:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "Notice FUI 2027 lue le 2026-09-22. Le programme n'avait AUCUN texte d'échéance et sa vérification du 20 disait « aucune date affichée sur cette page » : la notice, elle, en donne."
  },
  {
    "collection": "scholarships",
    "id": "friedrich-ebert-stiftung",
    "attendu": {
      "funding": "992 €/mois, assurance maladie intégralement prise en charge, et 255 €/mois supplémentaires par enfant à charge. Aide non remboursable.",
      "verifieLe": undefined,
      "sourceEcheance": undefined,
      "periodeOuverture": undefined,
      "exigences": undefined
    },
    "champs": {
      "funding": "Licence et master : 992 € par mois, assurance maladie prise en charge, 255 € de plus par mois et par enfant. Doctorat : 1 500 € par mois et une aide à l'assurance maladie, en général pendant trois ans et demi. Aide non remboursable.",
      "verifieLe": "2026-09-22",
      "sourceEcheance": "https://www.fes.de/studienfoerderung/stipendium/grundfoerderung-fuer-auslaender-innen",
      "periodeOuverture": "candidature possible toute l'année, le plus tôt possible ; pour un master, avant le 30 novembre (semestre d'hiver) ou le 31 mai (semestre d'été)",
      "exigences": [
        "admission_prealable"
      ]
    },
    "motif": "Pages officielles de la FES lues le 2026-09-22 (Grundförderung, Promotionsförderung, FAQ étudiants étrangers). Les critères de la fiche sont CONFIRMÉS (pays du Sud, OCDE exclus, déjà inscrit en Allemagne, 15 mois, B2 « auch ohne Zertifikat »). Ajout : le doctorat relève d'un autre programme, à 1 500 €/mois — la fiche appliquait 992 € à tous les niveaux."
  },
  {
    "collection": "programs",
    "id": "humboldt-universitat-zu-berlin-berlin__friedrich-ebert-stiftung__licence",
    "attendu": {
      "deadline": undefined,
      "coverage": undefined,
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "deadline": "Candidature au fil de l'eau, après le premier semestre d'études en Allemagne et au plus tard trois semestres avant la fin de la durée normale des études. Il faut déjà être inscrit dans une université allemande et vivre en Allemagne.",
      "coverage": "992 € par mois, assurance maladie prise en charge (255 € de plus par enfant)",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://www.fes.de/studienfoerderung/stipendium/grundfoerderung-fuer-auslaender-innen",
        "citation": "Bachelor / Diplom / Magister / Staatsexamen: nach dem ersten Semester und bis drei Semester vor Ende der Regelstudienzeit",
        "le": "2026-09-22T18:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "FES lue le 2026-09-22. Le programme n'avait pas de texte d'échéance, et sa vérification du 19 citait la règle du MASTER quel que soit le niveau : la citation est maintenant celle du niveau (licence)."
  },
  {
    "collection": "programs",
    "id": "humboldt-universitat-zu-berlin-berlin__friedrich-ebert-stiftung__master",
    "attendu": {
      "deadline": undefined,
      "coverage": undefined,
      "ouverteVerifieeLe": "2026-09-19",
      "deadlineISO": undefined
    },
    "champs": {
      "deadline": "Jusqu'au 30 novembre 2026 pour un master commencé au semestre d'hiver 2026-2027 (pour un début au semestre d'été : avant le 31 mai). La candidature se dépose avant ou au tout début du premier semestre du master, une fois inscrit dans une université allemande.",
      "coverage": "992 € par mois, assurance maladie prise en charge (255 € de plus par enfant)",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://www.fes.de/studienfoerderung/stipendium/grundfoerderung-fuer-auslaender-innen",
        "citation": "Master: vor oder zu Beginn des ersten Hochschulsemesters des Masterstudiums (Wintersemester:bis zum 30.11., Sommersemester: bis zum 31.05.)",
        "le": "2026-09-22T18:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "deadlineISO": "2026-11-30"
    },
    "motif": "FES lue le 2026-09-22. Le programme n'avait pas de texte d'échéance, et sa vérification du 19 citait la règle du MASTER quel que soit le niveau : la citation est maintenant celle du niveau (master)."
  },
  {
    "collection": "programs",
    "id": "humboldt-universitat-zu-berlin-berlin__friedrich-ebert-stiftung__doctorat",
    "attendu": {
      "deadline": undefined,
      "coverage": undefined,
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "deadline": "Candidature au fil de l'eau, au plus tard environ deux ans avant la remise de la thèse. Il faut déjà être admis en doctorat dans une université allemande et vivre en Allemagne.",
      "coverage": "1 500 € par mois et une aide à l'assurance maladie, en général pendant trois ans et demi",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://www.fes.de/studienfoerderung/stipendium/promotionsfoerderung-fuer-auslaender-innen",
        "citation": "Der richtige Zeitpunkt für die Bewerbung bis circa zwei Jahre vor Abgabe der Dissertation",
        "le": "2026-09-22T18:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "FES lue le 2026-09-22. Le programme n'avait pas de texte d'échéance, et sa vérification du 19 citait la règle du MASTER quel que soit le niveau : la citation est maintenant celle du niveau (doctorat)."
  },
  {
    "collection": "programs",
    "id": "leibniz-universitat-hannover-hannover__friedrich-ebert-stiftung__licence",
    "attendu": {
      "deadline": undefined,
      "coverage": undefined,
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "deadline": "Candidature au fil de l'eau, après le premier semestre d'études en Allemagne et au plus tard trois semestres avant la fin de la durée normale des études. Il faut déjà être inscrit dans une université allemande et vivre en Allemagne.",
      "coverage": "992 € par mois, assurance maladie prise en charge (255 € de plus par enfant)",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://www.fes.de/studienfoerderung/stipendium/grundfoerderung-fuer-auslaender-innen",
        "citation": "Bachelor / Diplom / Magister / Staatsexamen: nach dem ersten Semester und bis drei Semester vor Ende der Regelstudienzeit",
        "le": "2026-09-22T18:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "FES lue le 2026-09-22. Le programme n'avait pas de texte d'échéance, et sa vérification du 19 citait la règle du MASTER quel que soit le niveau : la citation est maintenant celle du niveau (licence)."
  },
  {
    "collection": "programs",
    "id": "leibniz-universitat-hannover-hannover__friedrich-ebert-stiftung__master",
    "attendu": {
      "deadline": undefined,
      "coverage": undefined,
      "ouverteVerifieeLe": "2026-09-19",
      "deadlineISO": undefined
    },
    "champs": {
      "deadline": "Jusqu'au 30 novembre 2026 pour un master commencé au semestre d'hiver 2026-2027 (pour un début au semestre d'été : avant le 31 mai). La candidature se dépose avant ou au tout début du premier semestre du master, une fois inscrit dans une université allemande.",
      "coverage": "992 € par mois, assurance maladie prise en charge (255 € de plus par enfant)",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://www.fes.de/studienfoerderung/stipendium/grundfoerderung-fuer-auslaender-innen",
        "citation": "Master: vor oder zu Beginn des ersten Hochschulsemesters des Masterstudiums (Wintersemester:bis zum 30.11., Sommersemester: bis zum 31.05.)",
        "le": "2026-09-22T18:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "deadlineISO": "2026-11-30"
    },
    "motif": "FES lue le 2026-09-22. Le programme n'avait pas de texte d'échéance, et sa vérification du 19 citait la règle du MASTER quel que soit le niveau : la citation est maintenant celle du niveau (master)."
  },
  {
    "collection": "programs",
    "id": "leibniz-universitat-hannover-hannover__friedrich-ebert-stiftung__doctorat",
    "attendu": {
      "deadline": undefined,
      "coverage": undefined,
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "deadline": "Candidature au fil de l'eau, au plus tard environ deux ans avant la remise de la thèse. Il faut déjà être admis en doctorat dans une université allemande et vivre en Allemagne.",
      "coverage": "1 500 € par mois et une aide à l'assurance maladie, en général pendant trois ans et demi",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://www.fes.de/studienfoerderung/stipendium/promotionsfoerderung-fuer-auslaender-innen",
        "citation": "Der richtige Zeitpunkt für die Bewerbung bis circa zwei Jahre vor Abgabe der Dissertation",
        "le": "2026-09-22T18:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "FES lue le 2026-09-22. Le programme n'avait pas de texte d'échéance, et sa vérification du 19 citait la règle du MASTER quel que soit le niveau : la citation est maintenant celle du niveau (doctorat)."
  },
  {
    "collection": "programs",
    "id": "universitat-hamburg-hamburg__friedrich-ebert-stiftung__licence",
    "attendu": {
      "deadline": undefined,
      "coverage": undefined,
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "deadline": "Candidature au fil de l'eau, après le premier semestre d'études en Allemagne et au plus tard trois semestres avant la fin de la durée normale des études. Il faut déjà être inscrit dans une université allemande et vivre en Allemagne.",
      "coverage": "992 € par mois, assurance maladie prise en charge (255 € de plus par enfant)",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://www.fes.de/studienfoerderung/stipendium/grundfoerderung-fuer-auslaender-innen",
        "citation": "Bachelor / Diplom / Magister / Staatsexamen: nach dem ersten Semester und bis drei Semester vor Ende der Regelstudienzeit",
        "le": "2026-09-22T18:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "FES lue le 2026-09-22. Le programme n'avait pas de texte d'échéance, et sa vérification du 19 citait la règle du MASTER quel que soit le niveau : la citation est maintenant celle du niveau (licence)."
  },
  {
    "collection": "programs",
    "id": "universitat-hamburg-hamburg__friedrich-ebert-stiftung__master",
    "attendu": {
      "deadline": undefined,
      "coverage": undefined,
      "ouverteVerifieeLe": "2026-09-19",
      "deadlineISO": undefined
    },
    "champs": {
      "deadline": "Jusqu'au 30 novembre 2026 pour un master commencé au semestre d'hiver 2026-2027 (pour un début au semestre d'été : avant le 31 mai). La candidature se dépose avant ou au tout début du premier semestre du master, une fois inscrit dans une université allemande.",
      "coverage": "992 € par mois, assurance maladie prise en charge (255 € de plus par enfant)",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://www.fes.de/studienfoerderung/stipendium/grundfoerderung-fuer-auslaender-innen",
        "citation": "Master: vor oder zu Beginn des ersten Hochschulsemesters des Masterstudiums (Wintersemester:bis zum 30.11., Sommersemester: bis zum 31.05.)",
        "le": "2026-09-22T18:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "deadlineISO": "2026-11-30"
    },
    "motif": "FES lue le 2026-09-22. Le programme n'avait pas de texte d'échéance, et sa vérification du 19 citait la règle du MASTER quel que soit le niveau : la citation est maintenant celle du niveau (master)."
  },
  {
    "collection": "programs",
    "id": "universitat-hamburg-hamburg__friedrich-ebert-stiftung__doctorat",
    "attendu": {
      "deadline": undefined,
      "coverage": undefined,
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "deadline": "Candidature au fil de l'eau, au plus tard environ deux ans avant la remise de la thèse. Il faut déjà être admis en doctorat dans une université allemande et vivre en Allemagne.",
      "coverage": "1 500 € par mois et une aide à l'assurance maladie, en général pendant trois ans et demi",
      "ouverteVerifieeLe": "2026-09-22",
      "sourceVerification": {
        "url": "https://www.fes.de/studienfoerderung/stipendium/promotionsfoerderung-fuer-auslaender-innen",
        "citation": "Der richtige Zeitpunkt für die Bewerbung bis circa zwei Jahre vor Abgabe der Dissertation",
        "le": "2026-09-22T18:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      }
    },
    "motif": "FES lue le 2026-09-22. Le programme n'avait pas de texte d'échéance, et sa vérification du 19 citait la règle du MASTER quel que soit le niveau : la citation est maintenant celle du niveau (doctorat)."
  }
];
