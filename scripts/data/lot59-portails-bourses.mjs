/**
 * ============================================================
 * LOT 59-PORTAILS-BOURSES — les 30 liens que le triage classait
 * « page d'information » (données du 14 septembre 2026)
 * ============================================================
 *
 * CE QUE CE LOT REMPLIT, ET POURQUOI CE CHAMP EXISTE
 * --------------------------------------------------
 * `scholarships.applicationPortalUrl` a été créé au lot S3 (2026-09-08)
 * et laissé VIDE sur les 156 bourses, à dessein : `officialWebsite`
 * faisait le travail de deux champs — tantôt la page qui DÉCRIT la
 * bourse, tantôt le formulaire où l'on DÉPOSE — et rien ne disait
 * lequel des deux on tenait.
 *
 * Conséquence mesurée le 2026-09-14 : l'abonné lisait « Accéder au
 * portail officiel de la bourse » sur les 51 liens que
 * `scripts/data/triage-portails-bourses.csv` classe comme pages
 * d'information, et la fiche affirmait au-dessus « le dossier se dépose
 * auprès du bailleur, PAS auprès de l'université » — sur une page qui ne
 * reçoit aucun dossier. Le code a été réparé le même jour (le libellé et
 * la phrase suivent maintenant la NATURE du lien, pas sa présence) ;
 * ce lot-ci apporte la donnée qui permet au bon libellé de s'afficher.
 *
 * CE LOT NE TRAITE QUE 30 BOURSES SUR 71
 * ---------------------------------------
 * 71 bourses portent `entryPoint: "bourse"` — le dossier se dépose chez
 * le bailleur, leur portail n'est donc PAS celui de l'université. Parmi
 * elles, 30 ont un lien classé « information » : ce sont les plus
 * nuisibles, et ce sont celles-ci. Les 41 autres (verdicts « a_ouvrir »
 * et « portail_probable ») suivront dans un lot séparé, une fois
 * ouvertes une par une.
 *
 * MÉTHODE — CHAQUE URL A ÉTÉ OUVERTE
 * -----------------------------------
 * Pour chaque bourse : la page officielle du BAILLEUR d'abord (jamais un
 * agrégateur de bourses), le lien de candidature lu dessus, puis ce lien
 * ouvert pour vérifier qu'on y crée un compte ou qu'on y dépose un
 * dossier. Les 21 URL ci-dessous ont toutes été ouvertes, ou lues
 * textuellement sur une page officielle ouverte quand le portail lui-même
 * refuse les requêtes automatiques (deux cas, signalés dans leur motif :
 * Rosa-Luxemburg et DSU Toscana).
 *
 * NEUF BOURSES RESTENT SANS PORTAIL, ET C'EST LA BONNE RÉPONSE
 * -------------------------------------------------------------
 * Un champ vide est une RÉPONSE, pas un trou (même doctrine que les 8
 * universités sans portail d'admission). Pour ces neuf-là, il n'existe
 * aucun lieu de dépôt en ligne chez le bailleur :
 *
 *   daad-helmut-schmidt-programme   le dossier part dans le portail
 *                                   d'admission du master partenaire
 *                                   (Passau, Osnabrück, Erfurt…), qui
 *                                   le transmet au DAAD. Pas de portail
 *                                   DAAD central.
 *   bourse-master-in-wbi            formulaire + 4 annexes envoyés à
 *                                   l'établissement belge visé (guide
 *                                   officiel WBI).
 *   fao-hungarian-…-scholarship     dépôt PAR COURRIEL
 *                                   (REU-Scholarship@fao.org). Aucun
 *                                   formulaire en ligne.
 *   koica-ciat-scholarship          dossier remis au ministère national
 *                                   désigné, puis entretien au bureau
 *                                   KOICA ou à l'ambassade de Corée.
 *   abe-initiative-jica             dossier PAPIER au point focal
 *                                   national + copie scannée au bureau
 *                                   JICA du pays.
 *   jads-japan-africa-dream         « no separate application to the
 *                                   African Development Bank is
 *                                   necessary » : tout passe par
 *                                   l'université partenaire.
 *   jica-sdgs-global-leader         nomination par l'agence
 *                                   gouvernementale, qui transmet à
 *                                   JICA.
 *   global-korea-scholarship        DÉLIBÉRÉMENT LAISSÉE VIDE. Il existe
 *                                   bien un parcours en ligne, mais il
 *                                   est propre au 1er cycle (GKS-U), et
 *                                   cette fiche couvre Licence, Master
 *                                   ET Doctorat avec deux calendriers
 *                                   distincts. Envoyer un candidat en
 *                                   master sur le formulaire du premier
 *                                   cycle serait pire que le repli
 *                                   actuel. La première sélection passe
 *                                   de toute façon par l'ambassade de
 *                                   Corée ou par l'université
 *                                   (`candidature_via_ambassade`, déjà
 *                                   posé).
 *   veneto-regional-scholarship     DOUTE ASSUMÉ. myesupd… est bien le
 *                                   Sportello Studente d'ESU Padova,
 *                                   mais les bandi « borsa di studio »
 *                                   qu'on y lit visent les
 *                                   conservatoires, SSML et SID ; pour
 *                                   les inscrits de l'Università di
 *                                   Padova — que la fiche mentionne — la
 *                                   bourse régionale se demande via
 *                                   l'université, ce que je n'ai pas pu
 *                                   confirmer. On ne confirme pas une
 *                                   porte à moitié vraie : le repli
 *                                   affiche le même lien sous le libellé
 *                                   honnête « Site du bailleur ». À
 *                                   rouvrir.
 *
 * POURQUOI CERTAINES URL SONT IDENTIQUES À `officialWebsite`
 * -----------------------------------------------------------
 * Sept d'entre elles (France-Sénégal, Smarts-Up, ICCR, icipe, Malaisie,
 * Open Doors, quota russe) sont le MÊME lien que le champ public. Ce
 * n'est pas une redondance : le triage les avait classées « information »
 * à tort, et le champ neuf répond précisément à la question « ce lien
 * est-il un lieu de dépôt ? ». Laisser vide répondrait « on ne sait
 * pas », ce qui est faux, et l'étudiant continuerait de lire « Site du
 * bailleur — vérifiez-y les modalités » sur un portail où il peut
 * déposer tout de suite. La fiche n'affiche qu'UN bouton bailleur
 * (`configurerPortailBailleur`) : aucune page ne montre deux fois le
 * même lien.
 *
 * Ce n'est pas le défaut du lot 33, qui était d'autre nature : là, le
 * portail d'ADMISSION d'une université avait été rempli avec l'URL d'un
 * programme de BOURSES — deux choses différentes confondues.
 *
 * RÈGLE DE CHOIX D'URL — la même qu'au lot 33
 * --------------------------------------------
 * Retenir le portail lui-même quand son URL est propre et stable ;
 * retenir la page d'accès officielle de l'organisme quand l'URL du
 * portail porte un numéro de version ou de session. D'où :
 *   - Campanie  → adisurcampania.it/area-riservata-0 et non
 *                 adisurc-ol…/apps/V3.1/sol/public/ (le « V3.1 »
 *                 périmera) ;
 *   - Latium    → laziodisco.it/area-riservata/ et non
 *                 login.laziodisco.it/access/borse, parce que la page
 *                 d'accès porte LES DEUX portes, dont la seule qui
 *                 serve à un étudiant étranger : « Prima registrazione
 *                 solo per studenti internazionali ».
 *
 * POURQUOI IL N'Y A PAS DE CHAMP `attendu` SUR LES 21 PATCHES D'URL
 * -----------------------------------------------------------------
 * `applicationPortalUrl` n'existe sur AUCUNE bourse : la carte
 * `bourses` de functions/data/catalogue-portails.json compte 0 entrée,
 * et `separerPortails` n'en écarte que les valeurs vides. Le champ est
 * donc soit absent, soit une chaîne vide — et `diffChamps` compare des
 * `JSON.stringify`, où `undefined` et `""` ne peuvent pas être satisfaits
 * par une même valeur attendue. Plutôt qu'un garde qui bloquerait sur le
 * mauvais des deux cas, `analyser` imprime pour chaque patch son
 * « avant -> », et c'est LÀ qu'il faut regarder : si l'un d'eux montre
 * déjà une URL, quelqu'un est passé avant et il faut s'arrêter.
 * Les trois patches d'`exigences`, eux, portent leur `attendu` : leur
 * valeur actuelle est connue et lisible dans l'instantané public.
 *
 * TROIS `exigences` AJOUTÉES, AVEC DU VOCABULAIRE EXISTANT
 * --------------------------------------------------------
 * Le champ `exigences` (js/exigences.js) porte déjà le sens « voici par
 * quelle voie ce dossier se dépose », et il s'affiche sur la fiche
 * publique comme dans l'espace connecté. Trois bourses sans portail
 * n'avaient aucun code, et l'étudiant n'avait donc AUCUN moyen de savoir
 * où déposer :
 *   koica-ciat-scholarship        → nomination_autorite_nationale
 *   abe-initiative-jica           → nomination_autorite_nationale
 *   daad-helmut-schmidt-programme → admission_prealable (« la bourse se
 *                                   demande en même temps que
 *                                   l'admission ») — c'est exactement la
 *                                   procédure Helmut-Schmidt.
 *
 * IL MANQUE DEUX CODES, ET CE LOT NE LES INVENTE PAS. « Dépôt par
 * courriel » (FAO-Hongrie) et « dépôt auprès de l'établissement d'accueil
 * qui transmet » (WBI) n'ont pas de code : les cinq codes de forme
 * « voie » disent tous « vous ne déposez PAS vous-même », ce qui est faux
 * dans ces deux cas. Les ajouter est un changement de VOCABULAIRE, donc
 * de code et de tests ; il sera fait une seule fois, dimensionné sur les
 * 41 bourses qui restent à ouvrir, et pas au coup par coup.
 *
 * APRÈS L'ÉCRITURE : `node scripts/lot.mjs export`, puis
 * `firebase deploy --only functions` — la carte des portails est
 * embarquée avec les Cloud Functions, PAS servie par Hosting. Sans ce
 * déploiement, le remplissage reste invisible.
 * Penser aussi à cocher `dejaRempli` sur ces 30 lignes du CSV de triage.
 * ============================================================
 */

// Le champ est neuf sur cette collection : voir la note ci-dessus sur
// l'absence de `attendu` pour ces 21 patches.
const PORTAILS = [
  ["bourses-cooperation-algerie",
   "https://international-students.mesrs.dz/",
   "Plateforme d'inscriptions du MESRS pour les etudiants etrangers : \"Procedures\", \"Inscription\", \"Notice d'information destinee a l'etudiant etranger boursier du gouvernement\". La racine est retenue plutot que le formulaire /pages/inscription/formulaireInscrip.xhtml, qui est une etape. L'attribution reste pilotee par l'ambassade d'Algerie (exigence candidature_via_ambassade deja posee)."],

  ["rosa-luxemburg-stiftung",
   "https://bewerbung-rls.stipendium-online.de/sign-in",
   "Bewerbungsportal cite textuellement sur rosalux.de/stipendienbewerbung (\"Zum Bewerbungsportal\"), avec la fenetre 20 aout - 1er octobre 2026 23:59. LU, NON OUVERT : le portail refuse les requetes automatiques (robots.txt). L'ancien lien etait la FAQ etudiants."],

  ["chinese-government-scholarship",
   "https://studyinchina.csc.edu.cn/",
   "Le systeme en ligne du CSC lui-meme, identifie comme tel par les ambassades de Chine (\"The link of online system is studyinchina.csc.edu.cn\"). Meme URL que officialWebsite : ce lien EST le lieu de depot, et c'est ce fait que le champ enregistre. Le depot est double : saisie en ligne + dossier a l'ambassade avec son numero d'agence (candidature_via_ambassade deja pose)."],

  ["knight-hennessy-scholars",
   "https://apply.knight-hennessy.stanford.edu/apply/",
   "Ouvert et verifie : \"Returning users: Log in to continue an application\" / \"First-time users: Create an account to start a new application\". Lien lu sur knight-hennessy.stanford.edu/admission. Rappel utile : une candidature separee au programme de Stanford reste necessaire."],

  ["programme-bourses-france-senegal",
   "https://bourses.franceausenegal.com/",
   "Ouvert et verifie : la plateforme permet \"de deposer leurs candidatures de maniere dematerialisee\", bouton \"Candidater en ligne !\", route /register. Meme URL que officialWebsite : le triage l'avait classee information a tort."],

  ["smarts-up-universite-paris-cite",
   "https://mobility.smarts-up.fr/",
   "Ouvert et verifie : bloc Connexion, \"Pas encore inscrit? Inscrivez-vous ici\", \"Deposez votre candidature au plus tard le 16 janvier 2026 a 12h\". Meme URL que officialWebsite : c'est la plateforme de depot elle-meme."],

  ["stipendium-hungaricum",
   "https://apply.stipendiumhungaricum.hu",
   "Ouvert et verifie : \"Apply online! - Stipendium Hungaricum\", \"Start your journey, send your online application easily\", Sign in / register (DreamApply). L'ancien lien etait la page de presentation. La nomination par l'autorite nationale reste requise (exigence deja posee)."],

  ["iccr-africa-scholarship-scheme",
   "https://a2ascholarships.iccr.gov.in/",
   "Ouvert et verifie : \"ICCR SCHOLARSHIP PORTAL LOGIN\", annee 2026-27, et \"The India-Africa Maitri Scholarship Scheme (Formerly Africa Scholarship Scheme)\" dans la liste des schemes ouverts. Meme adresse que officialWebsite, en https et avec la barre finale. La verification passe par la mission indienne (candidature_via_ambassade deja pose)."],

  ["ergo-emilia-romagna",
   "https://servizionline.er-go.it/domande2/login/",
   "Ouvert et verifie, et c'est le seul portail italien dont le corps de page a pu etre lu en entier : \"ACCESSO CON SPID - CIE - CNS - eIDAS\" ET, ce qui compte ici, \"Accesso per studenti residenti all'estero senza CIE - SPID - CNS - eIDAS\". Bando DSU 2026/2027 : depot du 23 juin au 24 aout 2026 16h00, sur UN seul siege (Bologna, Ferrara, Modena/Reggio, Parma)."],

  ["campania-regional-scholarship",
   "https://www.adisurcampania.it/area-riservata-0",
   "Page d'acces officielle d'ADISURC, ouverte et verifiee : \"Accesso area riservata\" et \"Accedendo a questa sezione puoi: presentare la domanda per i servizi di Borse di studio, Mensa e Residenze\". Le portail brut (adisurc-ol.dirittoallostudio.it/apps/V3.1/sol/public/) porte un numero de version : regle du lot 33, on retient le point d'entree stable. Bando 2026/27 : 10 septembre 2026 12h00, ISEE Parificato exige."],

  ["dsu-toscana-scholarship",
   "https://sportellostudente.dsu.toscana.it",
   "Sportello Studente, cite comme plateforme de depot dans le bando 2026-27 et sur dsu.toscana.it/servizi-online (\"Tutti i servizi on line disponibili per gli studenti universitari\"). LU, NON OUVERT : le domaine refuse les requetes automatiques. Le bando avertit : \"L'Azienda non ha autorizzato agenzie o intermediari alla raccolta e/o trasmissione delle domande\"."],

  ["italian-government-scholarship",
   "https://studyinitaly.esteri.it/Auth/Login",
   "Ouvert et verifie : page de connexion de la plateforme du MAECI, qui mentionne les boursiers MAECI et renvoie a /Auth/Register (formulaire complet : donnees personnelles, documents PDF, identifiants). L'ancien lien etait la racine du site."],

  ["laziodisco-scholarship",
   "https://laziodisco.it/area-riservata/",
   "Page d'acces officielle de DiSCo Lazio, ouverte et verifiee : elle porte LES DEUX portes, \"Accedi con SPID, CIE o CREDENZIALI\" (login.laziodisco.it/access/borse) ET \"Prima registrazione solo per studenti internazionali\" (dirstudio.laziodisco.it/registrazione/index). C'est la seconde qui sert a un etudiant etranger, et elle ne serait pas atteignable depuis la premiere : on retient donc la page qui donne les deux."],

  ["honjo-international-scholarship",
   "https://entry.hisf.or.jp",
   "Ouvert et verifie : \"In order for you to apply online, you must signup first\", \"From the second time, please log in below\", cycle 2027. La page officielle precise \"Applicants may directly apply to the foundation without pre-selection by the university\"."],

  ["arppis-daad-icipe",
   "https://scholarships.icipe.org/",
   "Portail de candidature de l'icipe, ouvert et verifie sur l'appel en cours : champs Surname / Nationality, televersements (diplomes, lettre de motivation), bouton \"Submit application\", et l'appel precise \"Applicants must submit the following documents online (email applications will not be accepted)\". On retient la racine : l'URL /apply/NN change a chaque appel. Meme adresse que officialWebsite."],

  ["malaysia-international-scholarship",
   "https://biasiswa.mohe.gov.my/INTER/index.php",
   "Systeme MIS du ministere malaisien de l'enseignement superieur, ouvert et verifie : lien \"Click Here to MIS Online Application System\" et, dans les Guidelines MIS 2026 hebergees sur le meme domaine, un depot \"online only\" avec televersement PDF. Meme adresse que officialWebsite : le triage l'avait classee information a tort."],

  ["nawa-banach-scholarship",
   "https://programs.nawa.gov.pl/login",
   "Ouvert et verifie : \"Login - National Agency For Academic Exchange\", \"Don't have an account? Register new account\", et les pages NAWA du programme Banach disent \"Applications must be submitted online via the NAWA application system\" puis \"select the Banach NAWA Programme and submit your application electronically\"."],

  ["open-doors-scholarship",
   "https://od.globaluni.ru/",
   "Portail du projet Open Doors, ouvert et verifie : \"Registration for the Open Doors Russian Scholarship Project\" sur /register, et le site invite a \"create an account\" puis \"start working on the completion of the competition requirements\". Meme adresse que officialWebsite."],

  ["quota-gouvernement-russe",
   "https://education-in-russia.com/",
   "Plateforme officielle du quota, ouverte et verifiee ; elle se declare \"This official website allows international students to apply for studies in Russia and check the status of admissions online\", et deux universites d'Etat la citent comme le lieu du depot (MISiS : \"Register on the website education-in-russia.com, go to the My Applications section, and click Create a new application\" ; HSE : \"The application is submitted in your country at: https://education-in-russia.com/\"). Meme adresse que officialWebsite. La premiere selection (entretiens, examens) a lieu a la Maison russe ou a l'ambassade du pays de residence."],

  ["tubitak-2216-research-fellowship",
   "https://ebideb.tubitak.gov.tr/giris.htm",
   "e-BIDEB, systeme de candidature de la direction BIDEB de TUBITAK, ouvert et verifie : \"Bilim Insani Destek Programlari Baskanligi\", menus \"Basvuruya Acik Programlar\" et \"Sisteme Giris\". La page officielle du 2216 indique un enregistrement prealable dans ARBIS puis le depot sur e-BIDEB. L'ancien lien etait la page descriptive du programme."],

  ["turkiye-burslari",
   "https://tbbs.turkiyeburslari.gov.tr",
   "TBBS, systeme d'information de Turkiye Burslari, ouvert et verifie : connexion \"Email / YU / TCKN / scholarship Number\", \"You need to register before initiating an application\", \"Signing up is free of charge\". Le site officiel dit \"Applications are received online through the online application system, free of charge\". L'ancien lien etait la vitrine du programme."]
];

// `undefined` et `[]` ne sont pas la même chose ici, et c'est voulu :
// KOICA et ABE n'ont AUCUN champ `exigences` en base (clé absente),
// Helmut-Schmidt en a un, vide. `diffChamps` compare des
// `JSON.stringify` : `undefined` des deux côtés passe, `[]` contre
// absent bloquerait — et c'est ce garde-là qui dira si quelqu'un a
// touché à ces fiches entre-temps.
const EXIGENCES = [
  ["koica-ciat-scholarship", undefined, ["nomination_autorite_nationale"],
   "Aucune exigence n'etait posee, et il n'existe aucun portail KOICA : le dossier se remet au ministere national designe, puis entretien au bureau-pays KOICA ou a l'ambassade de Coree (guideline KOICA officiel). Sans ce code, l'etudiant n'avait aucun moyen de savoir ou deposer."],

  ["abe-initiative-jica", undefined, ["nomination_autorite_nationale"],
   "Aucune exigence n'etait posee. Depot PAPIER au point focal national (ministere de tutelle pour les agents publics, bureau JICA du pays pour le prive) plus une copie scannee par courriel au bureau JICA : \"Each applicant is required to submit the Application Documents to JICA overseas office in charge of the applicants' country\". Aucun formulaire en ligne."],

  ["daad-helmut-schmidt-programme", [], ["admission_prealable"],
   "Aucune exigence n'etait posee, et le DAAD n'a pas de portail central pour ce programme : on candidate dans le portail d'admission du master partenaire, qui transmet. Passau : \"Please apply via our application portal\" ; Osnabruck : on postule \"simultaneously... for the DAAD scholarship (Helmut-Schmidt-Programme) and for admission to the Master's degree programme\". C'est la definition meme de admission_prealable : la bourse se demande en meme temps que l'admission, jamais avant."]
];

export const PATCHES = [

  ...PORTAILS.map(([id, url, motif]) => ({
    collection: "scholarships",
    id,
    champs: { applicationPortalUrl: url },
    motif: `Lot 59 : ${motif}`
  })),

  ...EXIGENCES.map(([id, avant, apres, motif]) => ({
    collection: "scholarships",
    id,
    attendu: { exigences: avant },
    champs: { exigences: apres },
    motif: `Lot 59 : ${motif}`
  }))

];
