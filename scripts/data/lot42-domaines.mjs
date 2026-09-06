/**
 * ============================================================
 * LOT 42 — LES DOMAINES DES UNIVERSITES (5 septembre 2026)
 * ============================================================
 *
 * POURQUOI CE LOT EXISTE
 * ----------------------
 * Mesure du 2026-09-05 : un etudiant senegalais en master recevait
 * ONZE des DOUZE memes recommandations, qu'il veuille faire medecine,
 * droit, agriculture, lettres ou informatique. La cause n'etait pas le
 * nombre de bourses : 76 des 155 universites du catalogue ne
 * declaraient AUCUN domaine (champ fields vide). Sur la moitie du
 * catalogue, scoreProgram() ne pouvait donc rien departager, et la
 * promesse « des bourses faites pour vous » ne tenait pas.
 *
 * CE QUE CE LOT ECRIT, ET RIEN D'AUTRE
 * ------------------------------------
 * Le champ `fields` de 48 universites, avec le vocabulaire ferme
 * des dix familles reconnues par familleDeDomaine()
 * (js/eligibility-pistes.js) : Ingenierie, Sciences, Droit, Medecine,
 * Sciences sociales, Commerce, Lettres, Informatique, Architecture,
 * Agriculture. Aucun autre champ n'est touche.
 *
 * LA REGLE DE PREUVE, LA MEME QUE POUR LES ECHEANCES
 * --------------------------------------------------
 * Chaque motif porte l'URL LUE, la DATE de lecture et la LISTE DES
 * COMPOSANTES trouvees sur la page — facultes, ecoles, departements,
 * colleges. Une famille n'est ecrite que si une composante la nomme.
 * Rien n'est deduit d'un nom d'universite, d'un sigle ni d'une
 * reputation : « universite de technologie » ne vaut pas Ingenierie
 * tant que la page ne liste pas une faculte d'ingenierie.
 *
 * Consequence assumee : quelques universites recoivent une liste plus
 * courte que la realite, parce que leur page ne montrait qu'une partie
 * de leurs composantes (Grenoble Alpes, JKUAT, Oran 1, RUDN — dit dans
 * leur motif). Une famille manquante coute UN point de score ; une
 * famille inventee enverrait un etudiant candidater dans une discipline
 * qui n'existe pas sur place.
 *
 * LES 28 QUI RESTENT
 * ------------------
 * Sites qui refusent la lecture automatique ou pages de composantes
 * introuvables : Paris Cite, Paris-Saclay, Aix-Marseille, Lille,
 * Lorraine, Rennes, Sorbonne Paris Nord, INSA Lyon, Mines Paris,
 * Carthage, Sfax, Sousse, Tunis El Manar, Alger 1, Constantine 1,
 * SNU, KAIST, K-Arts, Peking, Nankin, SPbU, Genova, UZH, UNIL, KAU,
 * UM6P, Senghor, USIU-Africa. Elles sont remises a Charles avec leur
 * lien, comme les echeances du lot 40.
 * ============================================================
 */

export const PATCHES = [
  {
    "collection": "universities",
    "id": "universita-di-pavia-pavie",
    "attendu": {
      "fields": []
    },
    "champs": {
      "fields": [
        "Ingénierie",
        "Sciences",
        "Droit",
        "Médecine",
        "Sciences sociales",
        "Commerce",
        "Lettres"
      ]
    },
    "motif": "Lu sur https://portale.unipv.it/en le 2026-09-05. Facoltà : ECONOMIA, FARMACIA, GIURISPRUDENZA, INGEGNERIA, LETTERE FILOSOFIA LINGUE, MEDICINA SCIENZE MOTORIE E PSICOLOGIA, MUSICOLOGIA E BENI CULTURALI, SCIENZE MATEMATICHE FISICHE E NATURALI, SCIENZE POLITICHE E DELLA COMUNICAZIONE."
  },
  {
    "collection": "universities",
    "id": "epfl-lausanne",
    "attendu": {
      "fields": []
    },
    "champs": {
      "fields": [
        "Ingénierie",
        "Sciences",
        "Informatique",
        "Architecture",
        "Commerce"
      ]
    },
    "motif": "Lu sur https://www.epfl.ch/en/ le 2026-09-05. Écoles : Architecture Civil & Environmental Engineering (ENAC), Basic Sciences (SB), Engineering (STI), Computer & Communication Sciences (IC), Life Sciences (SV), College of Management of Technology (CDM)."
  },
  {
    "collection": "universities",
    "id": "iheid-geneve",
    "attendu": {
      "fields": []
    },
    "champs": {
      "fields": [
        "Sciences sociales",
        "Droit",
        "Commerce",
        "Lettres"
      ]
    },
    "motif": "Lu sur https://www.graduateinstitute.ch/discover-institute le 2026-09-05. Masters : Anthropology & Sociology, International Economics, International History and Politics, International Law, International Relations / Political Science, International and Development Studies. Aucune filière scientifique, médicale ou technique."
  },
  {
    "collection": "universities",
    "id": "universita-degli-studi-di-milano-milan",
    "attendu": {
      "fields": []
    },
    "champs": {
      "fields": [
        "Agriculture",
        "Médecine",
        "Droit",
        "Sciences",
        "Sciences sociales",
        "Commerce",
        "Lettres"
      ]
    },
    "motif": "Lu sur https://www.unimi.it/en/education/faculties-and-schools le 2026-09-05. Facultés : Agricultural and Food Sciences, Law, Veterinary Medicine, Medicine, Exercise and Sports Sciences, Political Economic and Social Sciences, Pharmacy, Language Mediation and Intercultural Communication, Humanities, Science and Technology."
  },
  {
    "collection": "universities",
    "id": "ashesi-university-berekuso",
    "attendu": {
      "fields": []
    },
    "champs": {
      "fields": [
        "Ingénierie",
        "Informatique",
        "Commerce",
        "Sciences sociales",
        "Droit",
        "Lettres"
      ]
    },
    "motif": "Lu sur https://ashesi.edu.gh/academics/ le 2026-09-05. Départements : Business Administration, Computer Science and Information Systems, Economics, Engineering, Humanities and Social Sciences, Law."
  },
  {
    "collection": "universities",
    "id": "bilkent-university-ankara",
    "attendu": {
      "fields": []
    },
    "champs": {
      "fields": [
        "Ingénierie",
        "Sciences",
        "Droit",
        "Sciences sociales",
        "Commerce",
        "Lettres",
        "Informatique",
        "Architecture"
      ]
    },
    "motif": "Lu sur https://w3.bilkent.edu.tr/bilkent/faculties-and-departments/ le 2026-09-05. Facultés : Applied Sciences (Information Systems and Technologies), Art Design and Architecture, Business Administration, Economics Administrative and Social Sciences, Education, Engineering (Computer, Electrical, Industrial, Mechanical), Humanities and Letters, Law, Science, Music and Performing Arts. Pas de faculté de médecine ni d'agriculture."
  },
  {
    "collection": "universities",
    "id": "uclouvain-louvain-la-neuve",
    "attendu": {
      "fields": []
    },
    "champs": {
      "fields": [
        "Ingénierie",
        "Sciences",
        "Droit",
        "Médecine",
        "Sciences sociales",
        "Commerce",
        "Lettres",
        "Architecture",
        "Agriculture"
      ]
    },
    "motif": "Lu sur https://uclouvain.be/fr/facultes le 2026-09-05. 20 facultés : droit et criminologie ; philosophie arts et lettres ; psychologie ; sciences de l'éducation ; sciences économiques sociales politiques et de communication ; théologie ; traduction ; Louvain School of Management ; École polytechnique ; architecture ingénierie architecturale urbanisme ; bioingénieurs ; sciences ; médecine et médecine dentaire ; pharmacie et sciences biomédicales ; santé publique ; sciences de la motricité. Informatique non citée comme faculté propre (École polytechnique)."
  },
  {
    "collection": "universities",
    "id": "universite-de-strasbourg-strasbourg",
    "attendu": {
      "fields": []
    },
    "champs": {
      "fields": [
        "Lettres",
        "Droit",
        "Commerce",
        "Sciences sociales",
        "Sciences",
        "Médecine",
        "Ingénierie"
      ]
    },
    "motif": "Lu sur https://www.unistra.fr le 2026-09-05. Quatre domaines affichés : « Arts, lettres, langues » ; « Droit, économie, gestion et sciences politiques et sociales » ; « Sciences humaines et sociales » ; « Sciences, technologies, santé »."
  },
  {
    "collection": "universities",
    "id": "universite-de-bordeaux-bordeaux",
    "attendu": {
      "fields": []
    },
    "champs": {
      "fields": [
        "Droit",
        "Commerce",
        "Sciences sociales",
        "Médecine",
        "Sciences",
        "Ingénierie",
        "Informatique"
      ]
    },
    "motif": "Lu sur https://www.u-bordeaux.fr le 2026-09-05. Collèges : Droit science politique économie gestion ; Sciences de la santé (médecine, pharmacie, odontologie) ; Sciences de l'Homme (anthropologie, psychologie, sociologie, éducation, STAPS) ; Sciences et technologies (chimie, informatique, mathématiques, physique, sciences de l'ingénieur, biologie)."
  },
  {
    "collection": "universities",
    "id": "universite-paris-dauphine-psl-paris",
    "attendu": {
      "fields": []
    },
    "champs": {
      "fields": [
        "Commerce",
        "Sciences sociales",
        "Droit",
        "Sciences",
        "Informatique",
        "Lettres"
      ]
    },
    "motif": "Lu sur https://dauphine.psl.eu le 2026-09-05. « En management, finance, économie, droit, sciences sociales, mathématique, informatique ou journalisme ». Aucune filière de santé, d'ingénierie ni d'agriculture."
  },
  {
    "collection": "universities",
    "id": "universite-grenoble-alpes-grenoble",
    "attendu": {
      "fields": []
    },
    "champs": {
      "fields": [
        "Sciences",
        "Lettres",
        "Médecine",
        "Sciences sociales",
        "Ingénierie",
        "Informatique"
      ]
    },
    "motif": "Lu sur https://www.univ-grenoble-alpes.fr le 2026-09-05. Composantes citées : École universitaire de technologie, Faculté des sciences, Faculté Humanités santé sport sociétés. Disciplines nommées : lettres, physique des particules, ingénierie, science politique, sociologie, médecine, cybersécurité, cloud, intelligence artificielle. Droit et commerce non nommés sur la page — à compléter."
  },
  {
    "collection": "universities",
    "id": "universite-claude-bernard-lyon-1-villeurbanne",
    "attendu": {
      "fields": []
    },
    "champs": {
      "fields": [
        "Médecine",
        "Sciences",
        "Ingénierie",
        "Informatique",
        "Commerce"
      ]
    },
    "motif": "Lu sur https://www.univ-lyon1.fr le 2026-09-05. Composantes : Faculté de Médecine Lyon Est ; Médecine et Maïeutique Lyon Sud ; Odontologie ; Sciences pharmaceutiques et biologiques ; Polytech Lyon ; UFR Sciences (chimie, mathématiques, physique) ; Biosciences ; Informatique ; Mécanique ; Génie électrique des procédés ; Institut de Science Financière et d'Assurances ; IUT. Ni droit ni lettres — université scientifique et de santé."
  },
  {
    "collection": "universities",
    "id": "universite-cote-d-azur-nice",
    "attendu": {
      "fields": []
    },
    "champs": {
      "fields": [
        "Droit",
        "Commerce",
        "Lettres",
        "Sciences",
        "Sciences sociales",
        "Médecine",
        "Ingénierie",
        "Informatique"
      ]
    },
    "motif": "Lu sur https://univ-cotedazur.fr le 2026-09-05. Portails de licence : Droit et Science Politique ; Économie-Gestion ; Lettres Langues Art Communication ; Sciences de la Vie ; Sciences de l'Homme et de la Société ; STAPS ; Sciences et Technologies. Facultés : Chirurgie Dentaire, Droit, Médecine, IAE, POLYTECH. EUR « Systèmes numériques pour l'humain » et « Sciences fondamentales & Ingénierie »."
  },
  {
    "collection": "universities",
    "id": "universite-paris-1-pantheon-sorbonne-paris",
    "attendu": {
      "fields": []
    },
    "champs": {
      "fields": [
        "Droit",
        "Sciences sociales",
        "Lettres",
        "Commerce",
        "Sciences",
        "Informatique"
      ]
    },
    "motif": "Lu sur https://www.pantheonsorbonne.fr le 2026-09-05. Trois pôles : « Droit et science politique » ; « Arts et sciences humaines » (histoire, géographie, philosophie, histoire de l'art, archéologie, arts plastiques) ; « Sciences économiques et de gestion » (économie, gestion, mathématiques et informatique). Ni santé ni ingénierie."
  },
  {
    "collection": "universities",
    "id": "universite-de-toulouse-toulouse",
    "attendu": {
      "fields": []
    },
    "champs": {
      "fields": [
        "Médecine",
        "Sciences",
        "Ingénierie",
        "Informatique"
      ]
    },
    "motif": "Lu sur https://www.utoulouse.fr/l-universite/facultes-composantes le 2026-09-05. Composantes : Faculté de santé (médecine, odontologie, pharmacie, maïeutique, paramédical) ; Faculté des sciences du sport et du mouvement humain ; Faculté sciences et ingénierie (mathématiques, informatique, physique, chimie, sciences de la Terre, ingénierie) ; IUT ; Observatoire Midi-Pyrénées. Droit, lettres et gestion relèvent des autres universités du site toulousain."
  },
  {
    "collection": "universities",
    "id": "universite-de-montpellier-montpellier",
    "attendu": {
      "fields": []
    },
    "champs": {
      "fields": [
        "Droit",
        "Commerce",
        "Médecine",
        "Sciences",
        "Ingénierie",
        "Sciences sociales"
      ]
    },
    "motif": "Lu sur https://www.umontpellier.fr/universite/composantes le 2026-09-05. Facultés : droit et science politique ; économie ; éducation ; médecine ; odontologie ; pharmacie ; sciences ; STAPS. Instituts : IPAG, INSPE, IAE, Montpellier Management, trois IUT. Écoles : OREME, Polytech Montpellier."
  },
  {
    "collection": "universities",
    "id": "istanbul-technical-university-istanbul",
    "attendu": {
      "fields": []
    },
    "champs": {
      "fields": [
        "Ingénierie",
        "Sciences",
        "Informatique",
        "Architecture",
        "Commerce",
        "Lettres"
      ]
    },
    "motif": "Lu sur https://www.itu.edu.tr/en le 2026-09-05. Facultés : Computer and Informatics ; Maritime ; Electrical and Electronics ; Science and Letters ; Naval Architecture and Marine Sciences ; Civil Engineering ; Management ; Chemical-Metallurgical Engineering ; Mines ; Mechanical Engineering ; Architecture ; Textile Technologies and Design ; Aeronautics and Astronautics. Ni médecine, ni droit, ni agriculture."
  },
  {
    "collection": "universities",
    "id": "koc-university-istanbul",
    "attendu": {
      "fields": []
    },
    "champs": {
      "fields": [
        "Commerce",
        "Sciences",
        "Ingénierie",
        "Droit",
        "Sciences sociales",
        "Lettres",
        "Médecine"
      ]
    },
    "motif": "Lu sur https://www.ku.edu.tr/en/academics/ le 2026-09-05. Colleges : Administrative Sciences and Economics ; Sciences ; Engineering ; Law School ; Social Sciences and Humanities ; School of Nursing ; School of Medicine."
  },
  {
    "collection": "universities",
    "id": "sabanci-university-istanbul",
    "attendu": {
      "fields": []
    },
    "champs": {
      "fields": [
        "Ingénierie",
        "Sciences",
        "Sciences sociales",
        "Lettres",
        "Commerce"
      ]
    },
    "motif": "Lu sur https://www.sabanciuniv.edu/en le 2026-09-05. Trois facultés : Engineering and Natural Sciences ; Arts and Social Sciences ; Sabancı Business School. Ni médecine, ni droit, ni agriculture."
  },
  {
    "collection": "universities",
    "id": "american-university-in-cairo-le-caire",
    "attendu": {
      "fields": []
    },
    "champs": {
      "fields": [
        "Commerce",
        "Sciences",
        "Ingénierie",
        "Sciences sociales",
        "Lettres",
        "Droit"
      ]
    },
    "motif": "Lu sur https://www.aucegypt.edu/academics/schools le 2026-09-05. Cinq écoles : Onsi Sawiris School of Business ; School of Sciences and Engineering ; School of Global Affairs and Public Policy ; School of Humanities and Social Sciences ; School of Continuing Education."
  },
  {
    "collection": "universities",
    "id": "jkuat-juja",
    "attendu": {
      "fields": []
    },
    "champs": {
      "fields": [
        "Ingénierie",
        "Architecture",
        "Sciences"
      ]
    },
    "motif": "Lu sur https://www.jkuat.ac.ke/colleges/ le 2026-09-05. Écoles listées : Architecture and Building Sciences ; Mechanical Manufacturing & Materials Engineering ; Electrical Electronic and Information Engineering ; Civil Environmental and Geospatial Engineering ; Biosystems and Environmental Engineering. La page ne liste que le collège d'ingénierie — agriculture et santé, présentes à JKUAT, restent à confirmer."
  },
  {
    "collection": "universities",
    "id": "knust-kumasi",
    "attendu": {
      "fields": []
    },
    "champs": {
      "fields": [
        "Sciences",
        "Ingénierie",
        "Architecture",
        "Agriculture",
        "Médecine",
        "Sciences sociales",
        "Lettres"
      ]
    },
    "motif": "Lu sur https://www.knust.edu.gh/academics/colleges le 2026-09-05. Six collèges : Science ; Engineering ; Art & Built Environment ; Agriculture & Natural Resources ; Health Sciences ; Humanities & Social Sciences."
  },
  {
    "collection": "universities",
    "id": "universite-de-geneve-geneve",
    "attendu": {
      "fields": []
    },
    "champs": {
      "fields": [
        "Sciences",
        "Médecine",
        "Lettres",
        "Sciences sociales",
        "Commerce",
        "Droit"
      ]
    },
    "motif": "Lu sur https://www.unige.ch/en/university/presentation/ le 2026-09-05. Neuf facultés : Sciences ; Medicine ; Humanities ; Social Sciences ; Economics and Management ; Law ; Theology ; Psychology and Educational Sciences ; Translation and Interpreting."
  },
  {
    "collection": "universities",
    "id": "universite-de-fribourg-fribourg",
    "attendu": {
      "fields": []
    },
    "champs": {
      "fields": [
        "Droit",
        "Commerce",
        "Sciences sociales",
        "Lettres",
        "Sciences",
        "Médecine"
      ]
    },
    "motif": "Lu sur https://www.unifr.ch/uni/en/ le 2026-09-05. Facultés : Theology ; Law ; Management Economics and Social sciences ; Humanities ; Education ; Science and Medicine."
  },
  {
    "collection": "universities",
    "id": "rudn-university-moscow",
    "attendu": {
      "fields": []
    },
    "champs": {
      "fields": [
        "Ingénierie",
        "Informatique",
        "Commerce",
        "Agriculture"
      ]
    },
    "motif": "Lu sur https://eng.rudn.ru/ le 2026-09-05. Unités citées sur la page : Faculty of Artificial Intelligence ; Academy of Engineering ; Faculty of Economics ; Agrarian and Technological Institute. La page d'accueil ne liste pas les autres facultés (médecine, droit, philologie, connues à RUDN) — à compléter."
  },
  {
    "collection": "universities",
    "id": "aims-ghana-accra",
    "attendu": {
      "fields": []
    },
    "champs": {
      "fields": [
        "Sciences",
        "Informatique"
      ]
    },
    "motif": "Lu sur https://aims.edu.gh/ le 2026-09-05. Programmes : Master of Mathematical Sciences ; Master of Mathematical Sciences for Teachers ; African Master's in Machine Intelligence ; InnovAIMS. Institut exclusivement mathématiques et intelligence artificielle."
  },
  {
    "collection": "universities",
    "id": "icipe-nairobi",
    "attendu": {
      "fields": []
    },
    "champs": {
      "fields": [
        "Sciences",
        "Agriculture",
        "Sciences sociales"
      ]
    },
    "motif": "Lu sur https://www.icipe.org/ le 2026-09-05. Thèmes : Human Health ; Animal Health ; Environmental Health ; Plant Health ; Social Sciences and Impact Assessment Unit. Formation doctorale ARPPIS. Centre de recherche en sciences des insectes, pas une université pluridisciplinaire."
  },
  {
    "collection": "universities",
    "id": "african-leadership-university-kigali",
    "attendu": {
      "fields": []
    },
    "champs": {
      "fields": [
        "Commerce",
        "Informatique",
        "Sciences sociales"
      ]
    },
    "motif": "Lu sur https://www.alueducation.com/programs/ le 2026-09-05. Trois licences : BSc Entrepreneurial Leadership ; BSc Software Engineering ; BSc International Business & Trade. Aucune filière scientifique, médicale, juridique ni d'ingénierie classique."
  },
  {
    "collection": "universities",
    "id": "hec-paris-jouy-en-josas",
    "attendu": {
      "fields": []
    },
    "champs": {
      "fields": [
        "Commerce",
        "Sciences sociales"
      ]
    },
    "motif": "Lu sur https://www.hec.edu/en/about-us le 2026-09-05. Spécialisations de master : International Finance ; Economics and Finance ; Quantitative Economics and Finance ; Sustainability and Social Innovation ; Marketing ; Accounting Finance & Management ; Strategic Management ; Digital Innovation and Acceleration. École de commerce, aucune autre filière."
  },
  {
    "collection": "universities",
    "id": "carnegie-mellon-university-africa-kigali",
    "attendu": {
      "fields": []
    },
    "champs": {
      "fields": [
        "Ingénierie",
        "Informatique"
      ]
    },
    "motif": "Lu sur https://www.africa.engineering.cmu.edu/academics/index.html le 2026-09-05. Trois masters du College of Engineering : MSc in Information Technology ; MSc in Electrical and Computer Engineering ; MSc in Engineering Artificial Intelligence."
  },
  {
    "collection": "universities",
    "id": "scuola-normale-superiore-pise",
    "attendu": {
      "fields": []
    },
    "champs": {
      "fields": [
        "Sciences",
        "Lettres",
        "Sciences sociales"
      ]
    },
    "motif": "Lu sur https://www.sns.it/en le 2026-09-05. Trois classes : Faculty of Humanities (Lettere e Filosofia) ; Faculty of Sciences (Scienze) ; Faculty of Political and Social Sciences (Scienze politico-sociali)."
  },
  {
    "collection": "universities",
    "id": "shanghai-maritime-university-shanghai",
    "attendu": {
      "fields": []
    },
    "champs": {
      "fields": [
        "Ingénierie",
        "Commerce",
        "Droit",
        "Lettres",
        "Sciences",
        "Informatique"
      ]
    },
    "motif": "Lu sur http://en.shmtu.edu.cn/CollegesandSchools/list.htm le 2026-09-05. Douze structures : Arts and Sciences ; Foreign Languages ; Information Engineering ; Ocean Science and Engineering ; Transport & Communications ; Logistics Science and Engineering ; Marine Materials Science and Engineering ; Logistics Engineering College ; Merchant Marine College ; Economics & Management ; Law ; Advanced Institute of International Shipping."
  },
  {
    "collection": "universities",
    "id": "essec-business-school-cergy",
    "attendu": {
      "fields": []
    },
    "champs": {
      "fields": [
        "Commerce",
        "Informatique",
        "Sciences sociales"
      ]
    },
    "motif": "Lu sur https://www.essec.edu/en/ le 2026-09-05. Programmes : Master in Management Grande École ; Masters & MSc ; Global BBA ; Bachelor ACT ; Bachelor HEPTA ; BSc in AI, Data & Management Sciences ; PhD. Instituts : Sustainability & Social Change, Metalab AI Data and Society, Geopolitics & Business, Entrepreneurship and Innovation."
  },
  {
    "collection": "universities",
    "id": "universita-di-trieste-trieste",
    "attendu": {
      "fields": []
    },
    "champs": {
      "fields": [
        "Commerce",
        "Sciences",
        "Droit",
        "Lettres",
        "Sciences sociales",
        "Ingénierie",
        "Architecture",
        "Informatique",
        "Médecine"
      ]
    },
    "motif": "Lu sur https://portale.units.it/en le 2026-09-05. Dix départements : Economics Business Mathematics and Statistics ; Legal Language Interpreting and Translation Studies ; Political and social sciences ; Humanities ; Physics ; Engineering and Architecture ; Mathematics Computer Science and Geoscience ; Chemical and pharmaceutical sciences ; Clinical Department for Medical Surgical and Health Sciences ; Life sciences."
  },
  {
    "collection": "universities",
    "id": "universita-di-bari-aldo-moro-bari",
    "attendu": {
      "fields": []
    },
    "champs": {
      "fields": [
        "Médecine",
        "Sciences",
        "Commerce",
        "Droit",
        "Informatique",
        "Lettres",
        "Sciences sociales",
        "Agriculture"
      ]
    },
    "motif": "Lu sur https://www.uniba.it/en/organization/departments le 2026-09-05. Départements : Translational Biomedicine and Neuroscience ; Biosciences Biotechnologies and Environment ; Chemistry ; Economics and Finance ; Economics Management and Business Law ; Pharmacy ; Physics ; Law ; Computer Science ; Interdisciplinary Medicine ; Mathematics ; Precision and Regenerative Medicine ; Veterinary Medicine ; Humanities Research and Innovation ; Soil Plant and Food Sciences ; Education Psychology Communication Sciences ; Earth and Environmental Sciences ; Political Science."
  },
  {
    "collection": "universities",
    "id": "usthb-alger",
    "attendu": {
      "fields": []
    },
    "champs": {
      "fields": [
        "Sciences",
        "Ingénierie",
        "Informatique"
      ]
    },
    "motif": "Lu sur https://www.usthb.dz/ le 2026-09-05. Neuf facultés : Biological Sciences ; Chemistry ; Civil Engineering ; Earth Sciences Geography and Territorial Planning ; Electrical Engineering ; Computer Science ; Mathematics ; Physics ; Process and Mechanical Engineering. Université scientifique et technologique — ni droit, ni lettres, ni médecine."
  },
  {
    "collection": "universities",
    "id": "sorbonne-universite-paris",
    "attendu": {
      "fields": []
    },
    "champs": {
      "fields": [
        "Lettres",
        "Médecine",
        "Sciences",
        "Ingénierie"
      ]
    },
    "motif": "Lu sur https://www.sorbonne-universite.fr/ le 2026-09-05. Trois facultés affichées : Lettres ; Santé ; Sciences & Ingénierie. Ni droit ni gestion (restés à Paris 1 et Paris 2 après la scission)."
  },
  {
    "collection": "universities",
    "id": "ecole-normale-superieure-psl-paris",
    "attendu": {
      "fields": []
    },
    "champs": {
      "fields": [
        "Lettres",
        "Sciences",
        "Informatique",
        "Sciences sociales",
        "Commerce"
      ]
    },
    "motif": "Lu sur https://www.ens.psl.eu/ le 2026-09-05. 15 départements : Arts ; Économie ; Études cognitives ; Histoire ; Informatique ; Biologie ; Chimie ; Géosciences ; Mathématiques et Applications ; Philosophie ; Physique ; Sciences sociales ; Sciences de l'Antiquité ; Géographie et Territoires ; CIENS."
  },
  {
    "collection": "universities",
    "id": "ecole-normale-superieure-de-lyon-lyon",
    "attendu": {
      "fields": []
    },
    "champs": {
      "fields": [
        "Sciences",
        "Informatique",
        "Lettres",
        "Sciences sociales",
        "Commerce"
      ]
    },
    "motif": "Lu sur https://www.ens-lyon.fr/ le 2026-09-05. 12 départements : Biologie ; Chimie ; Informatique ; Mathématiques ; Physique ; Sciences de la Terre ; Éducation et Humanités numériques ; Langues Littératures et civilisations étrangères ; Lettres et Arts ; Philosophie ; Sciences sociales ; Économie."
  },
  {
    "collection": "universities",
    "id": "politehnica-bucuresti-bucarest",
    "attendu": {
      "fields": []
    },
    "champs": {
      "fields": [
        "Ingénierie",
        "Informatique",
        "Sciences",
        "Commerce",
        "Médecine"
      ]
    },
    "motif": "Lu sur https://upb.ro/en/ le 2026-09-05. 16 facultés, toutes d'ingénierie ou apparentées : Inginerie Electrică ; Inginerie Industrială și Robotică ; Chimie Aplicată și Știința Materialelor ; Energetică ; Ingineria Sistemelor Biotehnice ; Inginerie în Limbi Străine ; Automatică și Calculatoare ; Transporturi ; Științe Aplicate ; Electronică Telecomunicații și Tehnologia Informației ; Inginerie Aerospațială ; Inginerie Medicală ; Inginerie Mecanică și Mecatronică ; Știința și Ingineria Materialelor ; Antreprenoriat Ingineria și Managementul Afacerilor."
  },
  {
    "collection": "universities",
    "id": "postech-pohang",
    "attendu": {
      "fields": []
    },
    "champs": {
      "fields": [
        "Sciences",
        "Ingénierie",
        "Informatique",
        "Sciences sociales"
      ]
    },
    "motif": "Lu sur https://www.postech.ac.kr/eng/academics/department_info.do le 2026-09-05. Départements : Mathematics ; Physics ; Chemistry ; Life Sciences ; Materials Science & Engineering ; Mechanical Engineering ; Industrial & Management Engineering ; Electrical Engineering ; Computer Science & Engineering ; Chemical Engineering ; Convergence IT Engineering ; Semiconductor Engineering ; Division of Humanities and Social Sciences ; Graduate School of Artificial Intelligence. Ni droit, ni médecine clinique, ni agriculture."
  },
  {
    "collection": "universities",
    "id": "universite-abou-bekr-belkaid-tlemcen",
    "attendu": {
      "fields": []
    },
    "champs": {
      "fields": [
        "Sciences",
        "Commerce",
        "Sciences sociales",
        "Ingénierie",
        "Médecine",
        "Lettres",
        "Droit"
      ]
    },
    "motif": "Lu sur https://www.univ-tlemcen.dz/ le 2026-09-05. Facultés : Institut des Sciences et Techniques Appliquées ; Sciences Économiques Commerciales et de Gestion ; Sciences de la Nature et de la Vie et Sciences de la Terre ; Sciences Humaines et Sociales ; Sciences ; Technologie ; Médecine ; Lettres et Langues ; Droit et Sciences Politiques."
  },
  {
    "collection": "universities",
    "id": "university-of-rwanda-kigali",
    "attendu": {
      "fields": []
    },
    "champs": {
      "fields": [
        "Agriculture",
        "Lettres",
        "Sciences sociales",
        "Commerce",
        "Médecine",
        "Sciences",
        "Ingénierie"
      ]
    },
    "motif": "Lu sur https://ur.ac.rw/spip.php?page=college le 2026-09-05. Sept collèges : Agriculture Forestry and Food Science ; Arts and Social Sciences ; Business and Economics ; Medicine and Health Sciences ; Education ; Science and Technology ; Veterinary Medicine and Animal Sciences."
  },
  {
    "collection": "universities",
    "id": "aims-rwanda-kigali",
    "attendu": {
      "fields": []
    },
    "champs": {
      "fields": [
        "Sciences",
        "Informatique"
      ]
    },
    "motif": "Lu sur https://aims.ac.rw/ le 2026-09-05. Programmes : AIMS Master's in Mathematical Sciences ; Structured Master's Program ; Co-operative Education Program ; African Master's in Machine Intelligence ; Master's in Mathematical Sciences Climate Science Stream ; Teacher Training Program."
  },
  {
    "collection": "universities",
    "id": "princess-nourah-university-riyad",
    "attendu": {
      "fields": []
    },
    "champs": {
      "fields": [
        "Lettres",
        "Sciences sociales",
        "Droit",
        "Sciences",
        "Informatique",
        "Commerce",
        "Ingénierie",
        "Médecine",
        "Architecture"
      ]
    },
    "motif": "Lu sur https://www.pnu.edu.sa/en/Faculties/Pages/default.aspx le 2026-09-05. Colleges : Arts ; Education and Human Development ; Community Service ; Languages ; Law ; Science ; Computer and Information Sciences ; Business Administration ; Engineering ; Arts and Design ; Nursing ; Health and Rehabilitation Sciences ; Pharmacy ; Dentistry ; Medicine ; Applied College."
  },
  {
    "collection": "universities",
    "id": "nantes-universite-nantes",
    "attendu": {
      "fields": []
    },
    "champs": {
      "fields": [
        "Lettres",
        "Sciences sociales",
        "Médecine",
        "Sciences",
        "Ingénierie",
        "Droit",
        "Commerce",
        "Informatique"
      ]
    },
    "motif": "Lu sur https://www.univ-nantes.fr/ufr-ecoles-instituts le 2026-09-05. Pôles et composantes : Humanités (géographie, langues, lettres, histoire, psychologie) ; Santé (médecine, odontologie, sciences pharmaceutiques, STAPS) ; Sciences et Technologie (trois IUT, Polytech Nantes, sciences et techniques) ; Sociétés (droit et sciences politiques, IAE économie et management, IPAG, sociologie)."
  },
  {
    "collection": "universities",
    "id": "universite-oran-1-ahmed-ben-bella-oran",
    "attendu": {
      "fields": []
    },
    "champs": {
      "fields": [
        "Sciences",
        "Lettres",
        "Sciences sociales"
      ]
    },
    "motif": "Lu sur https://www.univ-oran1.dz/ le 2026-09-05. Facultés citées : Sciences Exactes et Appliquées ; Sciences de la Nature et de la Vie ; Lettres et Arts ; Sciences Humaines et Sciences Islamiques ; Institut de Traduction. Liste issue d'une page de concours doctoral — médecine, droit et sciences économiques, présentes à Oran 1, restent à confirmer."
  },
  {
    "collection": "universities",
    "id": "ecole-polytechnique-palaiseau",
    "attendu": {
      "fields": []
    },
    "champs": {
      "fields": [
        "Sciences",
        "Informatique",
        "Ingénierie",
        "Commerce",
        "Sciences sociales",
        "Lettres"
      ]
    },
    "motif": "Lu sur https://www.polytechnique.edu/en/departments le 2026-09-05. Départements : Biology ; Chemistry ; Economics ; Humanities and Social Science ; Computer Science ; Languages and Cultures ; Pure Mathematics ; Applied Mathematics ; Mechanics ; Physics ; Innovation Management and Entrepreneurship."
  }
];
