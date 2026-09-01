// ============================================================
// FitzUniverse — Lot 34 : vider applicationUrl sur les programmes
// (données du 2026-08-31)
//
// LE CONSTAT
// details.js resout le portail par
//     program.applicationUrl || universityProfile.applicationPortalUrl
// Le programme prime TOUJOURS. Le modele « Option B » veut donc ce
// champ VIDE au niveau programme, la valeur vivant sur l'universite.
// La migration admin/migrate-portal.js (10/08/2026) l'avait applique
// sur 36 universites, avec UNE exception : le portail doctoral de
// Politecnico di Milano. Le catalogue compte aujourd'hui 111
// universites, et 107 programmes sur 335 portent de nouveau leur
// propre URL : la regle n'a jamais ete gardee, les lots 19 a 31 l'ont
// defaite sans que rien ne le signale.
//
// C'est ce qui a rendu le lot 33 INVISIBLE : il a corrige le portail
// de 24 universites, dont 52 programmes n'interrogent jamais.
//
// LES 107 ONT ETE CLASSES, ET AUCUN N'EST UNE VRAIE EXCEPTION
//   A (75) copie exacte du site officiel de la bourse
//   B  (9) copie exacte du portail de l'universite
//   C  (8) domaine du bailleur (chevening.org, sbfi.admin.ch,
//          studyinitaly.esteri.it...)
//   D  (5) page d'information sur la bourse hebergee par l'universite
//   E  (1) page de financement de l'universite
//   F  (9) portail ou base du bailleur (daad.de, nawa.gov.pl...)
// Verification croisee : sur les 12 URL dont la forme evoquait un vrai
// portail de depot, aucune n'en est un pour CE couple — ce sont des
// portails de BAILLEUR (Chevening, NAWA, Knight-Hennessy), des copies
// du portail universite (POSTECH, Yonsei), des pages « how to apply »
// (UCT, EPFL), et meme un article de presse (HSE). Les 107 se vident.
//
// L'EXCEPTION HISTORIQUE A DISPARU DE LA BASE
// polimi-phd, le seul override legitime documente, porte aujourd'hui
// une valeur VIDE. Il n'existe donc, au 31/08/2026, AUCUN override
// Option B legitime dans le catalogue. Le champ doit rester vide
// partout jusqu'a ce qu'un cas reel se presente — et la garde
// refusPortailProgramme() exige desormais un motif ecrit pour en
// reintroduire un.
//
// CE QUE CE LOT NE FAIT PAS
// Il ne deplace rien vers la bourse. Quelques URL videes sont plus
// PRECISES que le officialWebsite de leur bourse (apply.knight-hennessy
// .stanford.edu/apply/, programs.nawa.gov.pl/login,
// studyinitaly.esteri.it/ListaBandi). Les remonter au niveau bourse est
// un lot d'enrichissement distinct, qui exige de verifier que chaque
// lien est vivant — a ne pas melanger avec un nettoyage.
// ============================================================

export const PATCHES = [

  // ---- A (75) : copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université ----
  {
    collection: "programs",
    id: "al-akhawayn-university-ifrane__bourses-master-aui",
    attendu: { applicationUrl: "https://aui.ma/admission-aid/graduates/scholarships" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "bilkent-university-ankara__bilkent-international-scholarships",
    attendu: { applicationUrl: "https://w3.bilkent.edu.tr/international/scholarships-for-international-students/" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "bogazici-university-istanbul__turkiye-burslari",
    attendu: { applicationUrl: "https://www.turkiyeburslari.gov.tr" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "corvinus-university-of-budapest-budapest__corvinus-scholarship",
    attendu: { applicationUrl: "https://www.uni-corvinus.hu/main-page/life-at-corvinus/scholarship/corvinus-scholarship-2/?lang=en" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "epfl-lausanne__epfl-edic-doctoral",
    attendu: { applicationUrl: "https://www.epfl.ch/education/phd/edic-computer-and-communication-sciences/edic-for-applicants" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "epfl-lausanne__epfl-master-excellence-fellowships",
    attendu: { applicationUrl: "https://www.epfl.ch/education/master/master-excellence-fellowships/how-to-apply/" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "eth-zurich-zurich__eth-esop",
    attendu: { applicationUrl: "https://ethz.ch/students/en/studies/financial/scholarships/excellencescholarship.html" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "ghent-university-gand__icp-connect-scholarships-vlir-uos",
    attendu: { applicationUrl: "https://www.vliruos.be/en/scholarships" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "hse-university-moscow__hse-into-olympiad",
    attendu: { applicationUrl: "https://olymp.hse.ru/en/inter/" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "hse-university-moscow__hse-merit-scholarships",
    attendu: { applicationUrl: "https://www.hse.ru/en/news/admission/229679392.html" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "hse-university-moscow__open-doors-scholarship",
    attendu: { applicationUrl: "https://od.globaluni.ru/" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "hse-university-moscow__quota-gouvernement-russe",
    attendu: { applicationUrl: "https://education-in-russia.com/" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "imperial-college-london-london__imperial-presidents-phd-scholarships",
    attendu: { applicationUrl: "https://www.imperial.ac.uk/study/fees-and-funding/postgraduate-doctoral/grants-scholarships/presidents-phd/" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "istanbul-technical-university-istanbul__turkiye-burslari",
    attendu: { applicationUrl: "https://www.turkiyeburslari.gov.tr" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "istanbul-university-istanbul__turkiye-burslari",
    attendu: { applicationUrl: "https://www.turkiyeburslari.gov.tr" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "jawaharlal-nehru-university-delhi__iccr-africa-scholarship-scheme",
    attendu: { applicationUrl: "http://a2ascholarships.iccr.gov.in" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "kaist-daejeon__kaist-scholarship",
    attendu: { applicationUrl: "https://admission.kaist.ac.kr/intl-graduate/FinancialSupport/Scholarship/KAISTScholarship" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "king-abdulaziz-university-jeddah__king-abdulaziz-scholarship",
    attendu: { applicationUrl: "https://studyinsaudi.sa/en" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "king-saud-university-riyad__king-abdulaziz-scholarship",
    attendu: { applicationUrl: "https://studyinsaudi.sa/en" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "koc-university-istanbul__koc-university-merit-scholarships",
    attendu: { applicationUrl: "https://international.ku.edu.tr/scholarships/" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "korea-national-university-of-arts-seoul__ama-plus-scholarship",
    attendu: { applicationUrl: "https://www.karts.ac.kr/en/karts/ama.do" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "korea-university-seoul__ku-global-leader-scholarship",
    attendu: { applicationUrl: "https://graduate2.korea.ac.kr/scholarship/scholarships.html" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "kth-royal-institute-of-technology-stockholm__swedish-institute-scholarships-global-professionals",
    attendu: { applicationUrl: "https://si.se/en/apply/scholarships/swedish-institute-scholarships-for-global-professionals/" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "ku-leuven-louvain__icp-connect-scholarships-vlir-uos",
    attendu: { applicationUrl: "https://www.vliruos.be/en/scholarships" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "leibniz-universitat-hannover-hannover__landesstipendium-niedersachsen",
    attendu: { applicationUrl: "https://www.uni-hannover.de/studium/finanzierung-foerderung/niedersachsenstipendium" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "mcgill-university-montreal__mcgill-major-entrance-scholarships",
    attendu: { applicationUrl: "https://www.mcgill.ca/studentaid/scholarships-aid/future-undergrads/entrance-scholarships" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "nanjing-university-nanjing__nanjing-government-scholarship",
    attendu: { applicationUrl: "https://hwxy.nju.edu.cn/English/StudyatNJU/Scholarships/JiangsuGovernmentScholarship/index.html" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "politehnica-bucuresti-bucarest__auf-eugen-ionescu",
    attendu: { applicationUrl: "https://www.auf.org/projet/bourses-de-recherche-doctorale-et-post-doctorale-eugen-ionescu/" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "politehnica-bucuresti-bucarest__auf-petrache-poenaru",
    attendu: { applicationUrl: "https://www.auf.org/bourses-de-recherche-petrache-poenaru-appel-2026/" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "politehnica-bucuresti-bucarest__bourse-george-darie",
    attendu: { applicationUrl: "https://international.upb.ro/education/learning-opportunities/scholarships-programs/george-darie" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "politehnica-bucuresti-bucarest__politehnica-excellence-scholarship",
    attendu: { applicationUrl: "https://international.upb.ro/education/learning-opportunities/scholarships-programs/politehnica-excellence-scholarship" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "princess-nourah-university-riyad__king-abdulaziz-scholarship",
    attendu: { applicationUrl: "https://studyinsaudi.sa/en" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "sabanci-university-istanbul__sabanci-graduate-scholarships",
    attendu: { applicationUrl: "https://www.sabanciuniv.edu/en/graduate-scholarships" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "sciences-po-paris__bourse-emile-boutmy",
    attendu: { applicationUrl: "https://www.sciencespo.fr/students/en/fees-funding/bursaries-financial-aid/emile-boutmy-scholarship/" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "semmelweis-university-budapest__semmelweis-pannonia-in-excellence",
    attendu: { applicationUrl: "https://semmelweis.hu/registrar/information/scholarships/semmelweis-pannonia-in-excellence-scholarship/" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "seoul-national-university-seoul__snu-glo-harmony-scholarship",
    attendu: { applicationUrl: "https://en.snu.ac.kr/admission/graduate/scholarships/after_admission" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "seoul-national-university-seoul__snu-global-scholarship",
    attendu: { applicationUrl: "https://en.snu.ac.kr/admission/graduate/scholarships/after_admission" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "shanghai-maritime-university-shanghai__shanghai-government-scholarship",
    attendu: { applicationUrl: "https://en.shmtu.edu.cn/SGSScholarship/list.htm" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "uclouvain-louvain-la-neuve__bourses-formations-internationales-ares",
    attendu: { applicationUrl: "https://www.ares-ac.be/fr/bourses-de-formations-internationales-2027-2028" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "universitat-hamburg-hamburg__deutschlandstipendium",
    attendu: { applicationUrl: "https://www.deutschlandstipendium.de/" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "universitat-hamburg-hamburg__uni-hamburg-leistungsstipendien",
    attendu: { applicationUrl: "https://www.uni-hamburg.de/en/internationales/studierende/incoming/studium-mit-abschluss/waehrend-des-studiums/finanzierung/leistungsstipendien.html" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "universite-cadi-ayyad-marrakech__bourse-gouvernement-maroc-amci",
    attendu: { applicationUrl: "https://www.amci.ma/cooperation-academique" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "universite-de-bucarest-bucarest__auf-eugen-ionescu",
    attendu: { applicationUrl: "https://www.auf.org/projet/bourses-de-recherche-doctorale-et-post-doctorale-eugen-ionescu/" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "universite-de-bucarest-bucarest__unibuc-international-scholarships",
    attendu: { applicationUrl: "https://unibuc.ro/international/scholarships-and-financial-aid-offered-by-the-university-of-bucharest/?lang=en" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "universite-de-liege-liege__bourse-master-in-wbi",
    attendu: { applicationUrl: "https://www.studyinbelgium.be/fr/bourse-master-wbi" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "universite-de-liege-liege__bourses-formations-internationales-ares",
    attendu: { applicationUrl: "https://www.ares-ac.be/fr/bourses-de-formations-internationales-2027-2028" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "universite-de-namur-namur__bourse-master-in-wbi",
    attendu: { applicationUrl: "https://www.studyinbelgium.be/fr/bourse-master-wbi" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "universite-de-namur-namur__bourses-formations-internationales-ares",
    attendu: { applicationUrl: "https://www.ares-ac.be/fr/bourses-de-formations-internationales-2027-2028" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "universite-hassan-ii-casablanca__bourse-gouvernement-maroc-amci",
    attendu: { applicationUrl: "https://www.amci.ma/cooperation-academique" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "universite-libre-de-bruxelles-bruxelles__bourse-master-in-wbi",
    attendu: { applicationUrl: "https://www.studyinbelgium.be/fr/bourse-master-wbi" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "universite-libre-de-bruxelles-bruxelles__bourses-formations-internationales-ares",
    attendu: { applicationUrl: "https://www.ares-ac.be/fr/bourses-de-formations-internationales-2027-2028" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "universite-mohammed-v-rabat__bourse-gouvernement-maroc-amci",
    attendu: { applicationUrl: "https://www.amci.ma/cooperation-academique" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "universite-mohammed-vi-polytechnique-benguerir__mastercard-foundation-scholars-um6p",
    attendu: { applicationUrl: "https://mastercardfdn.org/en/what-we-do/our-programs/mastercard-foundation-scholars-program/where-to-apply/universite-mohammed-vi-polytechnique/" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "universiti-kebangsaan-malaysia-kuala-lumpur__malaysia-international-scholarship",
    attendu: { applicationUrl: "https://biasiswa.mohe.gov.my/INTER/index.php" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "universiti-malaya-kuala-lumpur__malaysia-international-scholarship",
    attendu: { applicationUrl: "https://biasiswa.mohe.gov.my/INTER/index.php" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "university-of-british-columbia-vancouver__ubc-international-scholars-program",
    attendu: { applicationUrl: "https://you.ubc.ca/financial-planning/scholarships-awards-international-students" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "university-of-california-berkeley-berkeley__mastercard-foundation-scholars-program",
    attendu: { applicationUrl: "https://mcfscholarsprogram.berkeley.edu" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "university-of-debrecen-debrecen__fao-hungarian-government-scholarship",
    attendu: { applicationUrl: "https://www.fao.org/europe/events/detail/fao-hungarian-government-scholarship-programme-2026-2027/en" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "university-of-debrecen-debrecen__ud-international-scholarship",
    attendu: { applicationUrl: "https://edu.unideb.hu/p/ud-international-scholarship" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "university-of-delhi-delhi__iccr-africa-scholarship-scheme",
    attendu: { applicationUrl: "http://a2ascholarships.iccr.gov.in" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "university-of-edinburgh-edinburgh__mastercard-foundation-edinburgh",
    attendu: { applicationUrl: "https://edinburgh-global.ed.ac.uk/mastercard-foundation-scholars-program/apply-for-a-scholarship/eligibility" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "university-of-gothenburg-goteborg__swedish-institute-scholarships-global-professionals",
    attendu: { applicationUrl: "https://si.se/en/apply/scholarships/swedish-institute-scholarships-for-global-professionals/" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "university-of-lisbon-lisbonne__bolsas-cooperacao-camoes",
    attendu: { applicationUrl: "https://www.instituto-camoes.pt/activity/o-que-fazemos/bolsas-estudo/bolsas-camoes/bolsas-cooperacao/formacao-em-portugal" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "university-of-oxford-oxford__clarendon-fund-scholarships",
    attendu: { applicationUrl: "https://www.ox.ac.uk/clarendon/information-for-applicants/eligibility" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "university-of-oxford-oxford__mastercard-foundation-afox-oxford",
    attendu: { applicationUrl: "https://www.afox.ox.ac.uk/education/mastercard-foundation-scholars-program-at-the-university-of-oxford" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "university-of-oxford-oxford__reach-oxford-scholarship",
    attendu: { applicationUrl: "https://www.ox.ac.uk/admissions/undergraduate/fees-and-funding/oxford-bursaries-and-scholarships/reach-oxford" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "university-of-oxford-oxford__rhodes-scholarships-west-africa",
    attendu: { applicationUrl: "https://www.rhodeshouse.ox.ac.uk/scholarships/applications/west-africa/" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "university-of-oxford-oxford__weidenfeld-hoffmann-scholarships",
    attendu: { applicationUrl: "https://www.ox.ac.uk/admissions/graduate/fees-and-funding/fees-funding-and-scholarship-search/weidenfeld-hoffmann-scholarships-and-leadership-programme" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "university-of-porto-porto__bolsas-cooperacao-camoes",
    attendu: { applicationUrl: "https://www.instituto-camoes.pt/activity/o-que-fazemos/bolsas-estudo/bolsas-camoes/bolsas-cooperacao/formacao-em-portugal" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "university-of-szeged-szeged__szte-start-scholarship",
    attendu: { applicationUrl: "https://u-szeged.hu/prospective-students/szte-start-scholarship/szte-start-scholarship" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "university-of-tokyo-tokyo__jj-wbgsp",
    attendu: { applicationUrl: "https://www.worldbank.org/en/programs/scholarships/jj-wbgsp" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "university-of-tokyo-tokyo__utokyo-fellowship",
    attendu: { applicationUrl: "https://www.u-tokyo.ac.jp/en/prospective-students/fellowship.html" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "university-of-toronto-toronto__lester-b-pearson-international-scholarship",
    attendu: { applicationUrl: "https://future.utoronto.ca/pearson-scholarships" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "university-of-zurich-zurich__uzh-candoc-grant",
    attendu: { applicationUrl: "https://www.research.uzh.ch/en/funding/phd/uzhcandoc.html" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },
  {
    collection: "programs",
    id: "waseda-university-tokyo__waseda-partial-tuition-waiver",
    attendu: { applicationUrl: "https://www.waseda.jp/inst/scholarship/en/for-international-students/" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du site officiel de la bourse — l'information vit déjà sur la bourse, la dupliquer ici masquait le portail de l'université"
  },

  // ---- B (9) : copie exacte du portail de l'université — redondant avec le défaut hérité, exactement ce que la migration Option B du 10/08 devait supprimer ----
  {
    collection: "programs",
    id: "korea-university-seoul__global-korea-scholarship",
    attendu: { applicationUrl: "https://graduate2.korea.ac.kr/scholarship/gkscholarships.html" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du portail de l'université — redondant avec le défaut hérité, exactement ce que la migration Option B du 10/08 devait supprimer"
  },
  {
    collection: "programs",
    id: "peking-university-beijing__beijing-government-scholarship",
    attendu: { applicationUrl: "https://isd.pku.edu.cn/en/detail.php?id=765" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du portail de l'université — redondant avec le défaut hérité, exactement ce que la migration Option B du 10/08 devait supprimer"
  },
  {
    collection: "programs",
    id: "postech-pohang__postech-gift-scholarship",
    attendu: { applicationUrl: "https://admission.postech.ac.kr/international/" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du portail de l'université — redondant avec le défaut hérité, exactement ce que la migration Option B du 10/08 devait supprimer"
  },
  {
    collection: "programs",
    id: "rudn-university-moscow__open-doors-scholarship",
    attendu: { applicationUrl: "https://globaluni.rudn.ru/index-en.html" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du portail de l'université — redondant avec le défaut hérité, exactement ce que la migration Option B du 10/08 devait supprimer"
  },
  {
    collection: "programs",
    id: "sorbonne-universite-paris__eiffel-excellence-scholarship",
    attendu: { applicationUrl: "https://www.sorbonne-universite.fr/en/news/france-excellence-eiffel-scholarship-programme-2026/2027" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du portail de l'université — redondant avec le défaut hérité, exactement ce que la migration Option B du 10/08 devait supprimer"
  },
  {
    collection: "programs",
    id: "stanford-university-stanford__knight-hennessy-scholars",
    attendu: { applicationUrl: "https://apply.knight-hennessy.stanford.edu/apply/" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du portail de l'université — redondant avec le défaut hérité, exactement ce que la migration Option B du 10/08 devait supprimer"
  },
  {
    collection: "programs",
    id: "university-of-tokyo-tokyo__mext-scholarship",
    attendu: { applicationUrl: "https://www.u-tokyo.ac.jp/en/prospective-students/mext_scholarship.html" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du portail de l'université — redondant avec le défaut hérité, exactement ce que la migration Option B du 10/08 devait supprimer"
  },
  {
    collection: "programs",
    id: "waseda-university-tokyo__mext-scholarship",
    attendu: { applicationUrl: "https://www.waseda.jp/inst/cie/en/to-waseda/mext" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du portail de l'université — redondant avec le défaut hérité, exactement ce que la migration Option B du 10/08 devait supprimer"
  },
  {
    collection: "programs",
    id: "yonsei-university-seoul__global-korea-scholarship",
    attendu: { applicationUrl: "https://graduate.yonsei.ac.kr/graduate_en/admission/kgsp_schedule.do" },
    champs: { applicationUrl: "" },
    motif: "copie exacte du portail de l'université — redondant avec le défaut hérité, exactement ce que la migration Option B du 10/08 devait supprimer"
  },

  // ---- C (8) : domaine du bailleur, pas de l'université — c'est ce lien qui faisait payer l'abonné pour la page publique du bailleur ----
  {
    collection: "programs",
    id: "epfl-lausanne__swiss-government-excellence-scholarships",
    attendu: { applicationUrl: "https://www.sbfi.admin.ch/en/swiss-government-excellence-scholarships" },
    champs: { applicationUrl: "" },
    motif: "domaine du bailleur, pas de l'université — c'est ce lien qui faisait payer l'abonné pour la page publique du bailleur"
  },
  {
    collection: "programs",
    id: "eth-zurich-zurich__swiss-government-excellence-scholarships",
    attendu: { applicationUrl: "https://www.sbfi.admin.ch/en/swiss-government-excellence-scholarships" },
    champs: { applicationUrl: "" },
    motif: "domaine du bailleur, pas de l'université — c'est ce lien qui faisait payer l'abonné pour la page publique du bailleur"
  },
  {
    collection: "programs",
    id: "imperial-college-london-london__chevening-scholarships",
    attendu: { applicationUrl: "https://www.chevening.org/apply/" },
    champs: { applicationUrl: "" },
    motif: "domaine du bailleur, pas de l'université — c'est ce lien qui faisait payer l'abonné pour la page publique du bailleur"
  },
  {
    collection: "programs",
    id: "sapienza-universita-di-roma-rome__italian-government-scholarship",
    attendu: { applicationUrl: "https://studyinitaly.esteri.it/ListaBandi" },
    champs: { applicationUrl: "" },
    motif: "domaine du bailleur, pas de l'université — c'est ce lien qui faisait payer l'abonné pour la page publique du bailleur"
  },
  {
    collection: "programs",
    id: "universita-di-bologna-bologne__italian-government-scholarship",
    attendu: { applicationUrl: "https://studyinitaly.esteri.it/ListaBandi" },
    champs: { applicationUrl: "" },
    motif: "domaine du bailleur, pas de l'université — c'est ce lien qui faisait payer l'abonné pour la page publique du bailleur"
  },
  {
    collection: "programs",
    id: "university-of-edinburgh-edinburgh__chevening-scholarships",
    attendu: { applicationUrl: "https://www.chevening.org/apply/" },
    champs: { applicationUrl: "" },
    motif: "domaine du bailleur, pas de l'université — c'est ce lien qui faisait payer l'abonné pour la page publique du bailleur"
  },
  {
    collection: "programs",
    id: "university-of-oxford-oxford__chevening-scholarships",
    attendu: { applicationUrl: "https://www.chevening.org/apply/" },
    champs: { applicationUrl: "" },
    motif: "domaine du bailleur, pas de l'université — c'est ce lien qui faisait payer l'abonné pour la page publique du bailleur"
  },
  {
    collection: "programs",
    id: "university-of-zurich-zurich__swiss-government-excellence-scholarships",
    attendu: { applicationUrl: "https://www.sbfi.admin.ch/en/swiss-government-excellence-scholarships" },
    champs: { applicationUrl: "" },
    motif: "domaine du bailleur, pas de l'université — c'est ce lien qui faisait payer l'abonné pour la page publique du bailleur"
  },

  // ---- D (5) : page d'information sur la bourse hébergée par l'université, pas un portail de dépôt ----
  {
    collection: "programs",
    id: "delft-university-of-technology-delft__nl-scholarship",
    attendu: { applicationUrl: "https://www.tudelft.nl/en" },
    champs: { applicationUrl: "" },
    motif: "page d'information sur la bourse hébergée par l'université, pas un portail de dépôt"
  },
  {
    collection: "programs",
    id: "leibniz-universitat-hannover-hannover__deutschlandstipendium",
    attendu: { applicationUrl: "https://www.uni-hannover.de/studium/finanzierung-foerderung/deutschlandstipendium" },
    champs: { applicationUrl: "" },
    motif: "page d'information sur la bourse hébergée par l'université, pas un portail de dépôt"
  },
  {
    collection: "programs",
    id: "sciences-po-paris__eiffel-excellence-scholarship",
    attendu: { applicationUrl: "https://www.sciencespo.fr/students/en/fees-funding/bursaries-financial-aid/eiffel-scholarship/" },
    champs: { applicationUrl: "" },
    motif: "page d'information sur la bourse hébergée par l'université, pas un portail de dépôt"
  },
  {
    collection: "programs",
    id: "university-of-amsterdam-amsterdam__nl-scholarship",
    attendu: { applicationUrl: "https://www.uva.nl/en" },
    champs: { applicationUrl: "" },
    motif: "page d'information sur la bourse hébergée par l'université, pas un portail de dépôt"
  },
  {
    collection: "programs",
    id: "university-of-cape-town-le-cap__mastercard-foundation-scholars-uct",
    attendu: { applicationUrl: "https://uct.ac.za/mcfsp/how-apply" },
    champs: { applicationUrl: "" },
    motif: "page d'information sur la bourse hébergée par l'université, pas un portail de dépôt"
  },

  // ---- E (1) : page de financement de l'université, pas un portail de dépôt ----
  {
    collection: "programs",
    id: "imperial-college-london-london__great-scholarships",
    attendu: { applicationUrl: "https://www.imperial.ac.uk/study/fees-and-funding/postgraduate-taught/grants-scholarships/international-scholarship-collaborations/great---imperial-college-london-scholarship/" },
    champs: { applicationUrl: "" },
    motif: "page de financement de l'université, pas un portail de dépôt"
  },

  // ---- F (9) : portail ou base du bailleur — relève du champ officialWebsite de la bourse, pas du programme ----
  {
    collection: "programs",
    id: "humboldt-universitat-zu-berlin-berlin__daad-study-scholarships",
    attendu: { applicationUrl: "https://www2.daad.de/deutschland/stipendium/datenbank/en/21148-scholarship-database/?detail=50026200" },
    champs: { applicationUrl: "" },
    motif: "portail ou base du bailleur — relève du champ officialWebsite de la bourse, pas du programme"
  },
  {
    collection: "programs",
    id: "humboldt-universitat-zu-berlin-berlin__deutschlandstipendium",
    attendu: { applicationUrl: "https://deutschlandstipendium.hu-berlin.de/en/receive-funding" },
    champs: { applicationUrl: "" },
    motif: "portail ou base du bailleur — relève du champ officialWebsite de la bourse, pas du programme"
  },
  {
    collection: "programs",
    id: "jagiellonian-university-cracovie__nawa-banach-scholarship",
    attendu: { applicationUrl: "https://programs.nawa.gov.pl/login" },
    champs: { applicationUrl: "" },
    motif: "portail ou base du bailleur — relève du champ officialWebsite de la bourse, pas du programme"
  },
  {
    collection: "programs",
    id: "leibniz-universitat-hannover-hannover__daad-study-scholarships",
    attendu: { applicationUrl: "https://www2.daad.de/deutschland/stipendium/datenbank/en/21148-scholarship-database/?detail=50026200" },
    champs: { applicationUrl: "" },
    motif: "portail ou base du bailleur — relève du champ officialWebsite de la bourse, pas du programme"
  },
  {
    collection: "programs",
    id: "politehnica-bucuresti-bucarest__romanian-government-scholarship",
    attendu: { applicationUrl: "https://scholarships.studyinromania.gov.ro" },
    champs: { applicationUrl: "" },
    motif: "portail ou base du bailleur — relève du champ officialWebsite de la bourse, pas du programme"
  },
  {
    collection: "programs",
    id: "universitat-hamburg-hamburg__daad-study-scholarships",
    attendu: { applicationUrl: "https://www2.daad.de/deutschland/stipendium/datenbank/en/21148-scholarship-database/?detail=50026200" },
    champs: { applicationUrl: "" },
    motif: "portail ou base du bailleur — relève du champ officialWebsite de la bourse, pas du programme"
  },
  {
    collection: "programs",
    id: "universite-de-bucarest-bucarest__romanian-government-scholarship",
    attendu: { applicationUrl: "https://scholarships.studyinromania.gov.ro" },
    champs: { applicationUrl: "" },
    motif: "portail ou base du bailleur — relève du champ officialWebsite de la bourse, pas du programme"
  },
  {
    collection: "programs",
    id: "university-of-tokyo-tokyo__jads-japan-africa-dream",
    attendu: { applicationUrl: "https://www.k.u-tokyo.ac.jp/en/exam/master/foreign_research_students/afdb_jads/" },
    champs: { applicationUrl: "" },
    motif: "portail ou base du bailleur — relève du champ officialWebsite de la bourse, pas du programme"
  },
  {
    collection: "programs",
    id: "university-of-warsaw-varsovie__nawa-banach-scholarship",
    attendu: { applicationUrl: "https://programs.nawa.gov.pl/login" },
    champs: { applicationUrl: "" },
    motif: "portail ou base du bailleur — relève du champ officialWebsite de la bourse, pas du programme"
  },
];
