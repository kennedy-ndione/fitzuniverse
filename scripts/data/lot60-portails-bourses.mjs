/**
 * ============================================================
 * LOT 60-PORTAILS-BOURSES — les 41 dernières bourses à dépôt
 * chez le bailleur (données du 14 septembre 2026)
 * ============================================================
 *
 * Suite directe du lot 59, qui a traité les 30 bourses dont le lien
 * était classé « page d'information ». Restaient les 41 verdicts
 * « a_ouvrir » (38) et « portail_probable » (3) : celles que le triage
 * automatique ne savait pas classer, et qu'il fallait ouvrir une par
 * une. Les 71 bourses `entryPoint: "bourse"` sont donc soldées.
 *
 * MÉTHODE — LA MÊME QU'AU LOT 59
 * -------------------------------
 * Page officielle du BAILLEUR d'abord (jamais un agrégateur de
 * bourses), lien de candidature lu dessus, puis ce lien ouvert pour
 * vérifier qu'on y crée un compte ou qu'on y dépose un dossier.
 *
 * LES CINQ URL QUI N'ONT PAS PU ÊTRE OUVERTES, ET POURQUOI ON LES GARDE
 * ---------------------------------------------------------------------
 * Cinq portails refusent les requêtes automatiques (robots.txt, TLS) ou
 * ne rendent qu'une coquille JavaScript. Pour ceux-là, l'URL est celle
 * que le BAILLEUR LUI-MÊME imprime dans son propre appel, sur une page
 * ou un PDF que j'ai ouverts. C'est une source de premier rang, pas une
 * déduction, et chaque motif le signale :
 *   ARES GIRAF        lue dans « fi-2027-2028_document-d-appel-fr-vf_2.pdf » :
 *                     « Votre dossier de candidature devra être soumis à
 *                     l'ARES via la plateforme GIRAF (www.giraf.ares-ac.be). »
 *   Rotary Yoneyama   lue dans « en_application_guide2027.pdf ». ATTENTION,
 *                     le portail est sur .jp quand le site est sur .or.jp :
 *                     ce n'est pas une faute de frappe, c'est le guide qui
 *                     le dit, et j'ai vérifié les deux domaines.
 *   Al-Azhar          lue sur azhar.eg/foreignstudent/Scholarship, sous
 *                     « رابط التقديم » (lien de candidature).
 *   ARDIS FVG         le portail s'ouvre (titre « Sportello Studente ») mais
 *                     son corps est en JavaScript ; l'URL est citée au
 *                     caractère près sur la page ARDIS du bando.
 *   EDiSU Pavia,      même situation. Pour ces deux-là, voir la règle
 *   ALiSEO            d'URL ci-dessous.
 *
 * RÈGLE D'URL — CELLE DU LOT 33, APPLIQUÉE AU CAS PAR CAS
 * --------------------------------------------------------
 * Retenir le portail lui-même quand son URL est propre ; retenir la
 * page d'accès officielle de l'organisme quand l'URL du portail porte
 * un numéro de version, de session ou de millésime.
 *
 * Les cinq régions italiennes de ce lot tournent sur le même moteur
 * `dirittoallostudio.it`, avec un chemin `/apps/V3.1/sol/public/` qui
 * périmera. Deux d'entre elles gardent pourtant le portail brut
 * (ARDIS, ALiSEO) : leur page d'organisme ne mène au guichet qu'après
 * deux clics de menu, et l'URL du portail est imprimée telle quelle
 * dans le bando. Les trois autres (EDiSU Pavia, et au lot 59 Campanie
 * et Latium) passent par la page officielle, qui porte en plus la voie
 * des étudiants internationaux SANS SPID — laquelle n'est PAS
 * atteignable depuis l'écran de connexion. Pour un étudiant étranger,
 * c'est la seule porte qui s'ouvre.
 *
 * ONZE BOURSES RESTENT SANS PORTAIL, ET C'EST LA BONNE RÉPONSE
 * ------------------------------------------------------------
 *   daad-study-scholarships    le portail DAAD ne s'atteint que par
 *                              redirection depuis la fiche programme de
 *                              funding-guide.de ; aucun document DAAD
 *                              ouvert n'en donne l'URL brute. On ne
 *                              publie pas une URL qu'on n'a pas lue.
 *   mastercard-…-knust         dossier PAPIER par courrier ou EMS à
 *                              Kumasi. → `depot_par_courrier`
 *   zeno-karl-schindler-…      dépôt PAR COURRIEL à
 *                              info@zenokarlschindler-foundation.ch,
 *                              avec « Please don't send any applications »
 *                              à l'adresse postale de Genève.
 *                              → `depot_par_courriel`
 *   bourse-gouvernement-maroc  formulaire PDF à télécharger sur
 *                              amci.ma/publications — et l'AMCI ne publie
 *                              NULLE PART où le remettre. Je ne devine pas
 *                              le canal : `nomination_autorite_nationale`
 *                              est déjà posé, et c'est tout ce qui est sûr.
 *   adisu-puglia               tout le domaine adisupuglia.it est
 *                              injoignable depuis ici. Aucune page du
 *                              bailleur n'a pu être lue : le champ reste
 *                              vide plutôt que de porter une URL devinée.
 *                              À ROUVRIR depuis une connexion qui y accède.
 *   france-excellence-major    saisie sur l'application AEFE « Cascade »,
 *                              ouverte à l'élève par le PROVISEUR de son
 *                              lycée français après présélection. L'AEFE
 *                              ne publie pas l'URL, et un portail qu'on ne
 *                              peut pas atteindre sans être présélectionné
 *                              n'est pas une porte : `nomination_par_ecole`
 *                              est déjà posé, et il dit l'essentiel.
 *   bolsas-cooperacao-camoes   « A apresentação das candidaturas decorre,
 *                              unicamente, no país de origem junto das
 *                              competentes autoridades locais. »
 *   jj-wbgsp                   « The link to the JJ/WBGSP application form
 *                              will only be communicated to candidates
 *                              admitted unconditionally […] and shortlisted
 *                              […] by the participating university. »
 *                              → `candidature_via_etablissement`
 *   mext-scholarship           ambassade du Japon, ou université d'accueil
 *                              sur son quota. Aucun portail MEXT.
 *   swiss-government-…         « Applications are submitted to Swiss
 *                              diplomatic representations. » ET son
 *                              `officialWebsite` actuel est en 404 : ce lot
 *                              le corrige, c'est le seul patch de ce lot qui
 *                              ne touche pas un portail.
 *   bourses-cooperation-tunisie  dossier remis au ministère de
 *                              l'enseignement supérieur du PAYS D'ORIGINE,
 *                              qui transmet à la coopération tunisienne.
 *                              Le lien mesrisenegal.sn du catalogue n'est
 *                              donc pas un repli erroné : c'est le canal
 *                              réel pour un Sénégalais.
 *
 * POURQUOI CERTAINES URL SONT IDENTIQUES À `officialWebsite`
 * -----------------------------------------------------------
 * Deux cas : `pan-african-university-pausti` et
 * `king-abdulaziz-scholarship`. Même raison qu'au lot 59 — le champ
 * neuf répond à « ce lien est-il un lieu de dépôt ? », et laisser vide
 * répondrait « on ne sait pas », ce qui est faux. La fiche n'affiche
 * qu'UN bouton bailleur : aucune page ne montre deux fois le même lien.
 *
 * TROIS BOURSES TURQUES PARTAGENT UN SEUL PORTAIL
 * ------------------------------------------------
 * `tbbs.turkiyeburslari.gov.tr` sert la bourse de recherche, la Success
 * Scholarship ET le programme conjoint avec la Banque islamique de
 * développement — le lot 59 l'avait déjà posé sur `turkiye-burslari`.
 * Ce n'est pas une duplication à corriger : c'est le même guichet, et
 * chaque fiche doit pouvoir le donner sans dépendre d'une autre.
 * Idem pour les trois Commonwealth sur CSC Central, et pour les deux
 * instituts de la Pan African University sur au-pau.org/submission.
 *
 * LES TROIS PORTAILS COMMONWEALTH NE DISPENSENT PAS DU NOMINATEUR
 * ----------------------------------------------------------------
 * « The CSC does not accept direct applications for these
 * scholarships » : le formulaire se remplit bien sur CSC Central, mais
 * il faut EN PLUS être présenté par une agence nationale de nomination
 * (ou, pour les Shared Scholarships, par l'université britannique).
 * Les exigences `nomination_autorite_nationale` et
 * `candidature_via_etablissement` sont déjà posées sur les trois
 * fiches : le portail ne les contredit pas, il s'ajoute.
 *
 * PAS DE CHAMP `attendu` SUR LES PATCHES D'URL — même raison qu'au lot
 * 59 : `applicationPortalUrl` est soit absent, soit une chaîne vide, et
 * `diffChamps` ne peut pas satisfaire les deux. Lire la colonne
 * « avant -> » qu'imprime `analyser` : elle doit être vide partout.
 * Les patches d'`exigences` et celui d'`officialWebsite`, eux, portent
 * leur `attendu`.
 *
 * APRÈS L'ÉCRITURE : `node scripts/lot.mjs export`, puis
 * `firebase deploy --only functions` pour la carte des portails ET
 * `firebase deploy --only hosting` pour le catalogue public (ce lot
 * corrige un `officialWebsite`, qui est public).
 * ============================================================
 */

const PORTAILS = [

  // ---------------- Afrique / Pan African University ----------------
  ["pan-african-university-pauwes",
   "https://www.au-pau.org/submission/",
   "Portail unique de la Pan African University, commun aux quatre instituts : \"Applications should be completed online at https://www.au-pau.org/submission/\", boutons Register / Login, contact scholarships.support@au-pau.org. Cite sur pau-au.africa/admissions/how-to-apply (\"APPLY NOW ONLINE... PAU Scholarships application platform\"). L'ancien lien, pau-au.africa/institutes/pauwes/, ne donne aucun lien de depot."],

  ["pan-african-university-pausti",
   "https://www.au-pau.org/submission/",
   "Meme portail que PAUWES, processus en 7 etapes (inscription, confirmation par courriel, mot de passe, connexion, formulaire, diplomes, CV, lettres). Meme URL que officialWebsite : ce lien EST le lieu de depot, et c'est ce fait que le champ enregistre."],

  // ---------------- Allemagne — les trois fondations politiques ----------------
  ["friedrich-ebert-stiftung",
   "https://www.fes.de/studienfoerderung/bewerbung",
   "Page d'acces officielle de la FES, ouverte et verifiee : \"Jetzt online bewerben!\". Le formulaire lui-meme (fes.de/oas/portal/pls/portal/bewsti2014...) porte un millesime dans son chemin : regle du lot 33, on retient le point d'entree stable. En-tete du formulaire : \"Bewerbungsformular Grundforderung fur Auslander_innen\", environ 45 minutes. Contacts FES : elisabeth.schulzehorn@fes.de (A-N), rebecca.schmitz@fes.de (O-Z)."],

  ["heinrich-boell-stiftung",
   "https://stipendium.boell.de/",
   "Portail de candidature du Studienwerk de la Heinrich-Boll-Stiftung, ouvert et verifie (navigation Informationen / FAQ zur Bewerbung / Datenschutz). On retient la RACINE : le lien parametre donne par boell.de/en/application (Default.aspx?lg=ENU&tp=3...) rend une erreur NavNotSupportedLanguageException. Fenetre annoncee : 15 janvier au 1er mars 2027. studienwerk@boell.de"],

  ["konrad-adenauer-stiftung",
   "https://campus.kas.de",
   "Portail \"Campus\" de la Begabtenforderung KAS, ouvert et verifie : inscription et connexion par mot de passe a usage unique envoye par courriel. La page officielle demande de \"upload all required documents\" sur ce portail. Date limite du programme international : 15 juillet, 12h00 CET (l'autre session, 15 janvier, concerne les Allemands). stipendium-if@kas.de ; campus.fachadmin@kas.de pour les problemes techniques."],

  // ---------------- Arabie Saoudite ----------------
  ["king-abdulaziz-scholarship",
   "https://studyinsaudi.sa/en/Auth/Login",
   "Plateforme d'Etat \"Study in Saudi Arabia\", ouverte et verifiee : \"Sign in to Study in Saudi Arabia\", champs courriel et mot de passe, lien \"Create Your Account\". La FAQ officielle dit \"You can apply through the Study in Saudi Arabia platform at: https://studyinsaudi.sa\". IMPORTANT : il n'y a pas de formulaire \"bourse\" separe — on cree un compte puis on depose une DEMANDE D'ADMISSION a l'etablissement choisi, qui la transmet au ministere (exigence admission_prealable deja posee). Rappel memoire portails_universites_defaut : studyinsaudi EST la plateforme d'Etat, pas un tiers."],

  // ---------------- Belgique ----------------
  ["bourses-formations-internationales-ares",
   "https://www.giraf.ares-ac.be",
   "Plateforme GIRAF de l'ARES. URL LUE, NON OUVERTE (le domaine refuse les requetes automatiques) : elle est imprimee au caractere pres dans le document d'appel officiel de l'ARES, \"Votre dossier de candidature devra etre soumis a l'ARES via la plateforme GIRAF (www.giraf.ares-ac.be)\" — verifie moi-meme dans le PDF. Parcours : \"Une fois connecte a GIRAF, allez dans Appels concurrentiels > cliquez le bouton Candidature - Formation internationale 2027-2028\". Echeances 2027-2028 : creation du compte 04/09/2026 16h, depot 18/09/2026 12h (heure belge). Guide candidat et contact bourses-cooperation@ares-ac.be sur la page d'appel."],

  // ---------------- Italie — cinq regions ----------------
  ["ardis-friuli-venezia-giulia",
   "https://ardiss-sol.dirittoallostudio.it/apps/V3.1/sol/public/",
   "Sportello Studente d'ARDIS FVG (noter le double s de \"ardiss\"), ouvert : le titre de page est bien \"Sportello Studente\", le corps est en JavaScript. URL verifiee moi-meme, au caractere pres, sur la page ARDIS du bando : \"La presentazione della domanda avviene esclusivamente online\", compilation ouverte a partir du 15 juillet 2026 10h00. VOIE POUR LES ETRANGERS : \"Gli studenti extracomunitari e gli studenti minorenni devono consultare le istruzioni dedicate\" — identifiants de l'etablissement (Esse3 pour Trieste) ou enregistrement ARDIS, actifs sous 24 h, a la place de SPID. Le chemin porte un numero de version : a reverifier au prochain bando."],

  ["dsu-lombardia-milano-statale",
   "https://studente.unimi.it/dirittoallostudio/",
   "En Lombardie, la bourse regionale se demande a l'UNIVERSITE et non a un organisme regional. Le bando officiel de l'Universita degli Studi di Milano le dit mot pour mot : \"The application is submitted by completing the online form available on the university website at https://studente.unimi.it/dirittoallostudio/\". Pas de SPID exige : \"Students who are not enrolled yet can access the procedure after registering to www.unimi.it\". Depot du 10 juillet au 30 septembre 2026."],

  ["edisu-pavia",
   "https://www.edisu.pv.it/en/services/call-for-ordinary-scholarship/",
   "Page officielle du bando d'EDiSU Pavia, ouverte et verifiee moi-meme : \"The application for admission to the competition must be submitted ONLY ONLINE\", \"With ONE online APPLICATION, students apply to EDiSU for ALL BENEFITS\", echeance 15 septembre 2026 15h00. On retient cette page plutot que le guichet (edisupv-sol.dirittoallostudio.it/apps/V3.1/...), dont le chemin porte un numero de version — et cette page porte en plus les echeances et la regle de la demande unique. Aucune voie \"sans SPID\" publiee : contact presidenza@edisu.pv.it, 0382 305011."],

  ["aliseo-liguria",
   "https://aliseo-sol.dirittoallostudio.it/apps/V3.1/sol/public/",
   "Sportello Universitario d'ALiSEO, ouvert (titre \"Sportello Studente\"), lien porte par la page d'accueil aliseo.liguria.it. VOIE POUR LES ETRANGERS, explicite dans le bando : \"lo studente che al momento della presentazione della domanda non e in possesso della cittadinanza italiana e di un documento di identita italiano valido e dispensato dal possesso delle credenziali SPID... o della CIE\", avec une procedure d'accreditamento (nom, date et pays de naissance, genre, codice fiscale identiques a la pre-immatriculation). NE PAS CONFONDRE avec le guichet SCOLAIRE, aliseo-asol... (un a de plus). Chemin versionne : a reverifier au prochain bando."],

  ["edisu-piemonte-scholarship",
   "https://clio.edisu-piemonte.it/login.aspx",
   "Sportello studente online d'EDISU Piemonte, ouvert et verifie : \"Access to apply for the scholarship or other grants and manage your applications\", avec SPID, CIE ou \"Codice Temporaneo d'accesso\". VOIE POUR LES ETRANGERS : ce code temporaire est reserve aux etudiants etrangers sans residence en Italie, valable une seule annee academique (expire le 30 juin), a remplacer par SPID des l'obtention de la residence. URL stable, sans numero de version — c'est la seule des cinq regions dans ce cas."],

  ["opera-universitaria-scholarship",
   "https://www.operauni.tn.it/en/domanda-online-en/",
   "Page \"Online application\" officielle de l'Opera Universitaria di Trento, qui porte le lien du service de depot et son simulateur. On retient cette page parce que le service lui-meme (distu.operauni.tn.it) repond par une coquille JavaScript en erreur (\"An error has occured\") : publier une URL qui s'ouvre sur une erreur serait pire que rien. Aucune voie \"sans SPID\" documentee ; contacts borse@operauni.tn.it, 0461 217455."],

  ["invest-your-talent-italy",
   "https://investyourtalentapplication.esteri.it/SitoIYT/EN/registration-my-app",
   "Espace candidat du programme MAECI \"Invest Your Talent in Italy\", ouvert et verifie : \"From this page you can register and access your IYT personal account\", liste des six documents requis, compteurs \"Submitted applications / Admitted applications\". Echeance annoncee pour 2026-2027 : 11 mai, 18h (heure italienne). L'appel en cours est sur /SitoIYT/EN/current-call."],

  // ---------------- Royaume-Uni ----------------
  ["chevening-scholarships",
   "https://www.chevening.org/apply/",
   "Page de candidature officielle de Chevening, ouverte et verifiee moi-meme : elle liste les bourses par PAYS (le candidat doit d'abord choisir le sien) et affiche l'echeance, 6 octobre 2026 11h00 UTC. On retient cette page plutot que le systeme ASAMS : asams.chevening.org ne rend qu'un titre (application JavaScript), et la seule URL ASAMS citee sur les pages officielles ouvertes est un chemin de RECUPERATION de lien (/application/request-link), pas une entree de candidature. La page officielle est la porte sure."],

  ["commonwealth-masters-scholarships",
   "https://portal.csccentralonline.org.uk/application",
   "CSC Central, systeme de candidature de la Commonwealth Scholarship Commission, cite au caractere pres sur la page officielle verifiee moi-meme : \"Applications to the CSC are made using the application system, CSC Central\", et \"The CSC is unable to accept any applications or documentation not submitted via CSC Central\". MAIS : \"The CSC does not accept direct applications for these scholarships\" — il faut EN PLUS etre presente par une agence nationale de nomination ou une ONG agreee (exigence nomination_autorite_nationale deja posee). Le portail ne remplace pas le nominateur."],

  ["commonwealth-phd-scholarships",
   "https://portal.csccentralonline.org.uk/application",
   "Meme systeme CSC Central, meme contrainte de nominateur (agence nationale ou ONG agreee), aucune candidature directe acceptee. Cite sur la page officielle du programme."],

  ["commonwealth-shared-scholarships",
   "https://portal.csccentralonline.org.uk/application",
   "Meme systeme CSC Central, mais la preselection est faite par l'UNIVERSITE britannique partenaire : \"Applications are made via successful universities, which make the initial selection of candidates, who are subsequently approved by the CSC\" — il faut donc avoir postule au master chez elle (exigence candidature_via_etablissement deja posee)."],

  ["rhodes-scholarships-west-africa",
   "https://rhodes.embark.com/login/apply",
   "Portail Embark du Rhodes Trust, ouvert (titre \"The Rhodes Trust\") et decrit dans la guidance officielle : \"When the candidate starts their application in the online application portal (Embark)...\". On retient ce chemin plutot que rhodes.embark.com/apply/2026, qui porte un millesime. Le formulaire n'est accessible que pendant la fenetre : la page West Africa dit \"the form won't be available outside of these dates\" (1er juin au 27 aout 2026 pour la cohorte 2027)."],

  // ---------------- Suede ----------------
  ["swedish-institute-scholarships-global-professionals",
   "https://apply-scholarships.si.se/",
   "Portail de candidature du Swedish Institute, ouvert et verifie moi-meme : \"This is where you create and submit your application for the SI Scholarships\", couvrant \"SI Scholarships for Global Professionals\" et \"Pioneering Women in STEM\". DEUX ETAPES : candidater d'abord aux masters sur universityadmissions.se, puis a la bourse ici — le portail demande d'ajouter \"all the eligible master's programmes you have applied for at universityadmissions.se\". La page descriptive si.se renvoie 403 aux requetes automatiques ; la confirmation vient du portail lui-meme, sur le domaine officiel si.se."],

  // ---------------- Roumanie ----------------
  ["auf-petrache-poenaru",
   "https://mobility.upb.ro/",
   "Plateforme de depot nommee par l'AUF elle-meme, verifie moi-meme sur sa page d'appel : \"Soumission des candidatures sur la plateforme dediee (https://mobility.upb.ro/) : avant le 15 avril 2026\". Plateforme ouverte : \"POLI Mobility Platform\", menus Study Programs / Timeline / Login. RESERVE A LEVER AU PROCHAIN APPEL : l'edition 2025 se deposait par courriel a international@upb.ro, et la page d'accueil de la plateforme ne nomme pas Petrache Poenaru (appel 2026 clos)."],

  ["auf-eugen-ionescu",
   "https://appels-propositions.auf.org/",
   "Plateforme d'appels de l'AUF, ouverte : \"Se connecter / creer un compte\", \"Candidater\". Les fiches des deux volets (/doctorat-eugen-ionescu et /postdoctorat-eugen-ionescu) disent \"Le depot de la candidature aupres de l'AUF doit etre complete imperativement et exclusivement en ligne\". On retient la racine, stable : les fiches portent un millesime et affichent aujourd'hui \"La campagne est cloturee\" (echeance 30/11/2025). La page projet auf.org ne donne aucun lien, seulement bourses-ei@auf.org."],

  ["romanian-government-scholarship",
   "https://scholarships.studyinromania.gov.ro/",
   "Plateforme officielle des bourses du gouvernement roumain, ouverte et verifiee : \"Create an account\", bouton \"APPLY NOW\", et le programme \"Ministry of Foreign Affairs Scholarships for non-EU citizens\" (HG 288/1993) y figure. La page officielle dit \"The application process takes place exclusively online, via the dedicated Scholarships platform!\". URL sans millesime, donc stable."],

  // ---------------- Turquie — un seul guichet pour trois bourses ----------------
  ["diyanet-tdv-international",
   "https://dbys.tdv.org",
   "DBYS (Diyanet Burslari Yonetim Sistemi), ouvert et verifie : \"Diyanet Burslari Yonetim Sistemi'ne (DBYS) uye olmaniz ve bu uyeligi aktif hale getirmeniz gerekmektedir\". Cite sur la page officielle : \"DBYS Sayfasina Gitmek Icin TIKLAYINIZ -> https://dbys.tdv.org\". ATTENTION : l'ancien lien du catalogue est desormais une page de maintenance (\"Web sayfamiz bakimdadir\") et ne decrit plus le programme. Le bouton de creation de compte n'est actif que pendant les periodes de candidature."],

  ["ytb-isdb-joint-scholarship",
   "https://tbbs.turkiyeburslari.gov.tr",
   "Le programme conjoint YTB / Banque islamique de developpement n'a PAS de portail propre : la candidature passe par le systeme general Turkiye Burslari, et la page des programmes partenaires n'offre qu'un lien \"Application/Log in\" vers ce portail. Portail ouvert et verifie : \"You need to register before initiating an application\". Meme guichet que la fiche turkiye-burslari (lot 59)."],

  ["turkiye-burslari-research",
   "https://tbbs.turkiyeburslari.gov.tr",
   "Meme portail Turkiye Burslari. La page officielle des programmes courts precise : \"Applications for the Research Scholarship Program are open throughout the year. Assessment and admissions are made in four different periods.\" — c'est une des rares bourses ouvertes en permanence, et l'etudiant doit le savoir."],

  ["turkiye-burslari-success",
   "https://tbbs.turkiyeburslari.gov.tr",
   "Meme portail Turkiye Burslari. Calendrier propre a cette bourse, sur la page officielle : \"Applications are received on the dates announced in October and November, results are announced in December.\""],

  // ---------------- Egypte ----------------
  ["al-azhar-bourses-etudiants-etrangers",
   "https://service.azhar.eg/Services/ForeignStudentRegistration",
   "URL LUE, NON OUVERTE (le sous-domaine service.azhar.eg refuse les requetes automatiques) : elle est portee par la page officielle azhar.eg/foreignstudent/Scholarship, que j'ai ouverte moi-meme, sous le lien \"رابط التقديم\" (lien de candidature) et le titre \"التقديم للحصول على المنح\" (candidater aux bourses). C'est le SEUL mode de depot indique : aucune ambassade, aucun bureau. ATTENTION : l'ancien lien du catalogue, azhar.eg/foreignstudent/, ne contient plus aucune information de candidature (seul un numero de telephone, 19493) — la page utile est /foreignstudent/Scholarship."],

  ["universite-senghor-master-developpement",
   "https://candidature.usenghor.org/",
   "Plateforme de candidature de l'Universite Senghor, ouverte et verifiee : \"Creer son compte\", \"Se connecter\", \"Cliquez sur une campagne pour candidater\". L'appel officiel dit \"Le dossier de candidature doit etre rempli obligatoirement en ligne avant le 15 mars 2026 minuit GMT\". URL sans millesime, donc stable ; la plateforme affiche d'autres campagnes ouvertes quand celle du master est close. Contact concours@usenghor.org."],

  // ---------------- Japon ----------------
  ["rotary-yoneyama-overseas",
   "https://www.rotary-yoneyama.jp/login",
   "URL LUE, NON OUVERTE (robots.txt) : elle est imprimee dans le guide de candidature officiel 2027 de la fondation, que j'ai ouvert moi-meme. LE PIEGE, VERIFIE : le portail est sur rotary-yoneyama.JP quand le site de la fondation est sur rotary-yoneyama.OR.JP — le guide distingue explicitement les deux, .or.jp/overseas pour telecharger le formulaire, .jp/login pour deposer. Depot 100 % en ligne chez le bailleur, du 1er octobre 2026 13h00 JST au 31 octobre 2026 13h00 JST (portail ferme hors periode) ; un numero de reception est renvoye par courriel."]

];

// Les codes que le vocabulaire elargi du 2026-09-14 rend enfin dicibles,
// plus deux ajouts sur des codes existants. Sans eux, ces candidats
// n'avaient AUCUNE indication du lieu de depot : ni portail, ni phrase.
const EXIGENCES = [

  ["mastercard-foundation-scholars-knust",
   ["diplome_recent"],
   ["diplome_recent", "depot_par_courrier"],
   "Le dossier ne se depose pas en ligne : \"Submit the completed application form THROUGH EMS or any other courier mail to: The Program Manager, Mastercard Foundation Scholars Program at KNUST, No. 1 Africa Hall Road Impact Building, PMB, UPO, KNUST, Kumasi, AK 315 4897, Ghana\". Le code neuf depot_par_courrier rappelle que c'est la date de RECEPTION qui compte. Reserve : la page officielle est perimee (formulaire 2025/2026) ; recruitment.mcf@knust.edu.gh."],

  ["zeno-karl-schindler-master-thesis",
   ["projet_recherche", "admission_prealable"],
   ["projet_recherche", "admission_prealable", "depot_par_courriel"],
   "Depot par courriel a info@zenokarlschindler-foundation.ch : \"Before the relevant application deadline, applicants must send an email to the ZKS Foundation's email address\", avec trois pieces jointes exactement (formulaire PDF rempli, affidavit signe, et UN SEUL PDF regroupant CV, description du projet, releves de notes et lettre du professeur d'accueil). La page precise meme, pour son adresse postale de Geneve : \"Please don't send any applications to this address!\". Echeances : 1er mai et 1er novembre, 23h59 heure suisse."],

  ["fao-hungarian-government-scholarship",
   [],
   ["depot_par_courriel"],
   "Aucune exigence n'etait posee, et il n'y a aucun formulaire en ligne : \"Applications should be submitted via email\" a REU-Scholarship@fao.org (bureau regional de la FAO pour l'Europe), du 21 janvier au 28 fevrier 2026. Cette bourse etait reperee au lot 59 comme sans portail, mais le vocabulaire des exigences n'avait pas de code pour le dire : la fiche se taisait sur la seule chose qui comptait."],

  ["jj-wbgsp",
   ["experience_pro_2ans", "admission_prealable"],
   ["experience_pro_2ans", "admission_prealable", "candidature_via_etablissement"],
   "Le formulaire n'est pas public : \"The link to the JJ/WBGSP application form will only be communicated to candidates admitted unconditionally (except for finance) to one of the JJ/WBGSP participating master's programs, and shortlisted as eligible JJ/WBGSP applicants by the participating university.\" C'est l'universite partenaire qui preselectionne et qui ouvre l'acces : candidature_via_etablissement le dit, et previent que sa date limite interne arrive plus tot. Contact : scholarshipapplicants@worldbank.org"],

  ["swedish-institute-scholarships-global-professionals",
   undefined,
   ["admission_prealable"],
   "Aucune exigence n'etait posee alors que l'ordre des demarches est eliminatoire : il faut d'abord candidater aux masters sur universityadmissions.se, ensuite seulement a la bourse — le portail SI demande d'ajouter \"all the eligible master's programmes you have applied for at universityadmissions.se\". Un candidat qui commence par la bourse n'a rien a y declarer."]

];

// UN SEUL PATCH PAR DOCUMENT.
//
// `swedish-institute-...` figure dans les deux tables : elle gagne un
// portail ET une exigence. Deux patches sur le meme document
// fonctionneraient — le runner les applique en `update`, dans l'ordre,
// et leurs champs ne se recouvrent pas — mais le compte annonce
// deviendrait faux (36 patches pour 35 fiches), et c'est justement ce
// compte qui sert de garde-fou avant l'ecriture. On fusionne.
function fusionner(liste) {

  const parId = new Map();

  for (const patch of liste) {

    const deja = parId.get(patch.id);

    if (!deja) { parId.set(patch.id, patch); continue; }

    deja.champs = { ...deja.champs, ...patch.champs };
    deja.attendu = { ...(deja.attendu || {}), ...(patch.attendu || {}) };
    deja.motif = `${deja.motif} | ${patch.motif}`;

  }

  return [...parId.values()];

}

export const PATCHES = fusionner([

  ...PORTAILS.map(([id, url, motif]) => ({
    collection: "scholarships",
    id,
    champs: { applicationPortalUrl: url },
    motif: `Lot 60 : ${motif}`
  })),

  ...EXIGENCES.map(([id, avant, apres, motif]) => ({
    collection: "scholarships",
    id,
    attendu: { exigences: avant },
    champs: { exigences: apres },
    motif: `Lot 60 : ${motif}`
  })),

  // LE SEUL PATCH DE CE LOT QUI NE TOUCHE PAS UN PORTAIL.
  // `officialWebsite` renvoie un 404 : le lien public de la fiche est
  // mort. La page valide du SEFRI a ete ouverte et verifiee, et elle
  // porte la phrase qui explique pourquoi cette bourse n'aura jamais de
  // portail : « Applications are submitted to Swiss diplomatic
  // representations. »
  {
    collection: "scholarships",
    id: "swiss-government-excellence-scholarships",
    attendu: { officialWebsite: "https://www.sbfi.admin.ch/eskas" },
    champs: { officialWebsite: "https://www.sbfi.admin.ch/en/swiss-government-excellence-scholarships" },
    motif: "Lot 60 : sbfi.admin.ch/eskas renvoie un 404 — le seul lien public de cette fiche etait mort. La page valide du SEFRI, ouverte et verifiee, dit \"Applications are submitted to Swiss diplomatic representations\" et annonce les echeances par pays d'origine en aout, candidatures ouvertes a partir du 20 aout 2026 ; elle porte aussi l'avertissement anti-arnaque du SEFRI (la candidature est gratuite). Aucun portail : l'exigence candidature_via_ambassade est deja posee."
  }

]);
