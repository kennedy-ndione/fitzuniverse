// -------- js/documents-data.js --------
// Catalogue des documents généralement demandés pour une candidature
// internationale. Données pures, aucune logique d'affichage ici —
// consommées par documents.js.
//
// Refonte du 2026-08-01 : la bibliothèque est passée de 10 à 45
// documents, avec un schéma enrichi par fiche (context, requestedBy,
// level, issuedBy, howToObtain, averageTime, validity, priority) en
// plus des champs déjà existants (icon/category/title/description/
// importance/scan/tips/mistakes/scholarBridgeTip). Objectif : couvrir
// la quasi-totalité des documents réellement demandés par les grands
// programmes de bourses et universités internationales (Erasmus+,
// Fulbright, Chevening, DAAD, MEXT, Türkiye Scholarships, CSC,
// Commonwealth, Eiffel...), organisés par priorité (essentiel/
// fréquent/spécifique, voir PRIORITY_LEVELS) pour ne pas noyer
// l'étudiant sous 45 fiches d'un coup.
//
// Au passage : les 3 anciennes fiches (CV, lettre de motivation,
// lettres de recommandation) vivaient sous `category: "candidature"`,
// une clé qui n'existait plus dans DOCUMENT_CATEGORIES — elles ont
// été réaffectées à leurs vraies catégories ("personnel"/
// "recommandation") et les lettres de recommandation ont été
// scindées en deux fiches distinctes (académiques / professionnelles).

export const DOCUMENT_CATEGORIES = [
{ key: "identite", label: "Identité", icon: "user" },
{ key: "academique", label: "Académique", icon: "graduation-cap" },
{ key: "personnel", label: "Personnel", icon: "file-text" },
{ key: "recommandation", label: "Recommandation", icon: "message-square-quote" },
{ key: "linguistique", label: "Linguistique", icon: "languages" },
{ key: "recherche", label: "Recherche", icon: "flask-conical" },
{ key: "experience", label: "Expérience", icon: "briefcase" },
{ key: "financier", label: "Financier", icon: "wallet" },
{ key: "administratif", label: "Administratif", icon: "stamp" },
{ key: "sante", label: "Santé", icon: "stethoscope" },
{ key: "specifique", label: "Spécifique", icon: "layers" }
];

// Trois niveaux de priorité, affichés comme 3 sections distinctes sur
// documents.html (voir documents.js) : cela évite de noyer l'étudiant
// sous 45 documents d'un coup — il se concentre d'abord sur
// "essentiel", puis explore le reste à son rythme.
export const PRIORITY_LEVELS = [
{ key: "essentiel", label: "Essentiels", description: "Demandés dans la quasi-totalité des candidatures internationales — à préparer en premier." },
{ key: "frequent", label: "Fréquents", description: "Souvent exigés, selon le programme ou le pays visé." },
{ key: "specifique", label: "Spécifiques", description: "Selon le pays, le programme, le niveau d'études ou le domaine." }
];

export const DOCUMENTS = [

// ==========================================================
// IDENTITÉ
// ==========================================================

{
icon: "book-user",
category: "identite",
priority: "essentiel",
title: "Passeport",
description: "Document d'identité indispensable pour toute candidature et démarche de visa internationale.",
importance: "C'est le document le plus universellement exigé : sans passeport valide, aucune université ne peut instruire un dossier international, et aucun visa étudiant ne peut être délivré. Sa date de validité est vérifiée à trois moments distincts — la candidature, l'admission, puis la demande de visa — souvent plusieurs mois après le dépôt initial.",
context: "Demandé dès le dépôt de candidature pour vérifier votre identité, puis re-vérifié à l'admission et de nouveau, plus strictement, lors de la demande de visa étudiant.",
requestedBy: "Absolument tous les programmes et bourses internationales : Erasmus+, Fulbright, Chevening, DAAD, MEXT, Türkiye Scholarships, CSC, Commonwealth, Eiffel, ainsi que toutes les universités nord-américaines, européennes, asiatiques et australiennes.",
level: "Tous niveaux",
issuedBy: "Les services d'immigration ou la direction générale de la police/des affaires étrangères de votre pays.",
howToObtain: "Se rendre au service national compétent (police nationale, préfecture, ou ministère dédié selon le pays) avec une pièce d'identité, un acte de naissance et des photos d'identité. Remplir le formulaire de demande, payer les frais de timbre fiscal, puis attendre la fabrication du document. Un passeport biométrique est aujourd'hui exigé par la majorité des pays de destination.",
averageTime: "2 à 8 semaines selon le pays.",
validity: "5 à 10 ans selon le pays émetteur.",
scan: [
"Scanner la page contenant votre photo et vos informations personnelles.",
"Scanner les autres pages uniquement si l'université le demande explicitement.",
"Regrouper plusieurs pages dans un seul fichier PDF si nécessaire."
],
tips: [
"Scanner en couleur, jamais en noir et blanc.",
"Les quatre coins du passeport doivent être visibles.",
"Vérifier que le passeport reste valide au moins 6 mois après la date de fin d'études visée — une règle courante pour les visas.",
"Utiliser une résolution suffisante pour que le texte soit net."
],
mistakes: [
"Passeport expiré ou expirant trop tôt.",
"Document flou ou mal cadré.",
"Scan en noir et blanc lorsque la couleur est demandée.",
"Informations partiellement masquées par un reflet ou une ombre."
],
scholarBridgeTip: "Si votre passeport expire dans moins d'un an, entamez son renouvellement avant même de finaliser votre dossier — un passeport qui expire pendant l'instruction de la demande de visa peut retarder tout votre départ."
},

{
icon: "id-card",
category: "identite",
priority: "frequent",
title: "Carte nationale d'identité",
description: "Document officiel complémentaire au passeport, parfois exigé pour confirmer votre identité.",
importance: "Certaines universités et certains organismes de bourses la demandent en complément du passeport, notamment pour les démarches administratives locales avant le départ. Elle n'est pas systématiquement exigée — son utilité dépend entièrement du pays et du programme visé.",
context: "Rarement exigée pour la candidature académique elle-même, mais souvent demandée pour des démarches administratives locales avant le départ ou par certains organismes de bourse comme pièce d'identité complémentaire.",
requestedBy: "Certaines bourses gouvernementales et administrations consulaires ; peu d'universités étrangères l'exigent directement, le passeport suffisant généralement pour elles.",
level: "Tous niveaux",
issuedBy: "La mairie, la préfecture ou le ministère de l'Intérieur de votre pays de résidence.",
howToObtain: "Déposer une demande auprès de la mairie ou du commissariat compétent avec un acte de naissance, des photos d'identité et un justificatif de domicile.",
averageTime: "1 à 4 semaines selon le pays.",
validity: "5 à 10 ans selon le pays émetteur.",
scan: [
"Scanner le recto de la carte.",
"Scanner le verso de la carte.",
"Vérifier que les quatre coins de la carte apparaissent sur le scan."
],
tips: [
"Utiliser un scanner ou une application de numérisation de bonne qualité.",
"Nettoyer la carte avant la numérisation pour éviter les traces.",
"Enregistrer le document en PDF ou en image de haute qualité."
],
mistakes: [
"Scanner uniquement le recto et oublier le verso.",
"Envoyer une image floue.",
"Couper une partie de la carte."
],
scholarBridgeTip: "Toutes les universités ne demandent pas une carte nationale d'identité. Consultez toujours les exigences officielles de l'établissement avant de la préparer inutilement."
},

{
icon: "camera",
category: "identite",
priority: "essentiel",
title: "Photo d'identité",
description: "Photo récente aux normes internationales, souvent demandée séparément du passeport.",
importance: "De nombreux portails de candidature et la plupart des demandes de visa exigent une photo d'identité numérique distincte, avec des normes précises — un document simple, mais très souvent source de rejet de dossier quand ses normes ne sont pas respectées à la lettre.",
context: "Demandée dès la création du compte de candidature en ligne, puis de nouveau pour la carte d'étudiant et, avec des normes différentes, pour la demande de visa.",
requestedBy: "Tous les portails de candidature en ligne (universités, plateformes de bourses comme Erasmus+, DAAD, CSC) et tous les services consulaires pour le visa.",
level: "Tous niveaux",
issuedBy: "Un photographe professionnel, un photomaton agréé, ou une prise soi-même respectant strictement les normes.",
howToObtain: "Se rendre chez un photographe ou dans un photomaton en précisant l'usage (photo d'identité biométrique), ou la faire soi-même avec un smartphone contre un fond uni en respectant scrupuleusement les normes du pays visé.",
averageTime: "Immédiat à quelques heures.",
validity: "3 à 6 mois recommandés.",
scan: [
"Préparer une photo récente (moins de 6 mois).",
"Respecter le format demandé (généralement 35×45 mm ou une taille en pixels précisée par le portail).",
"Fond uni, clair, sans ombre portée."
],
tips: [
"Visage entièrement dégagé, expression neutre, bouche fermée.",
"Éviter les lunettes teintées ou les couvre-chefs, sauf motif religieux justifié.",
"Vérifier les normes spécifiques du pays de destination — elles varient d'un pays à l'autre."
],
mistakes: [
"Photo trop ancienne.",
"Fond coloré ou avec motifs alors qu'un fond uni est exigé.",
"Format ou dimensions non conformes aux exigences du portail.",
"Photo recadrée à partir d'une photo de groupe."
],
scholarBridgeTip: "Gardez toujours le fichier source en haute résolution : la plupart des portails demandent la même photo à plusieurs étapes, avec des formats différents à chaque fois."
},

{
icon: "scroll-text",
category: "identite",
priority: "frequent",
title: "Acte de naissance",
description: "Document officiel de l'état civil attestant de votre identité, de votre date et de votre lieu de naissance.",
importance: "Il sert de pièce justificative pour vérifier la cohérence de votre identité entre vos différents documents, et il est fréquemment exigé pour certaines démarches de visa ou d'inscription administrative. Certains pays exigent qu'il soit légalisé ou apostillé avant d'être accepté à l'étranger.",
context: "Rarement demandé au moment de la candidature académique elle-même, mais fréquemment exigé après l'admission — pour la demande de visa étudiant ou l'inscription consulaire.",
requestedBy: "Plusieurs bourses gouvernementales et administrations consulaires, notamment pour les dossiers de visa long séjour ; certains programmes exigent une version traduite et légalisée.",
level: "Tous niveaux",
issuedBy: "La mairie ou le service d'état civil de votre commune de naissance.",
howToObtain: "Se présenter au service d'état civil de la mairie de votre lieu de naissance avec une pièce d'identité. Pour un usage international, demander ensuite la légalisation ou l'apostille auprès du ministère des Affaires étrangères, puis une traduction certifiée si nécessaire.",
averageTime: "Quelques jours pour l'acte lui-même ; 1 à 4 semaines de plus pour la légalisation/apostille/traduction.",
validity: "3 à 6 mois pour un usage administratif à l'étranger.",
scan: [
"Scanner le document en entier, recto et verso si des mentions figurent au dos.",
"Scanner séparément le tampon d'apostille ou de légalisation s'il figure sur un feuillet distinct.",
"Joindre la traduction certifiée dans un fichier séparé si elle est exigée."
],
tips: [
"Demander une copie intégrale plutôt qu'un simple extrait si le programme ne précise pas.",
"Anticiper le délai d'apostille ou de légalisation, souvent sous-estimé.",
"Vérifier si une traduction certifiée est exigée avant même de la faire réaliser."
],
mistakes: [
"Attendre la dernière minute pour l'apostille alors que les délais consulaires sont longs.",
"Fournir un acte trop ancien sans vérifier la durée de validité tolérée.",
"Oublier la traduction certifiée quand elle est explicitement exigée."
],
scholarBridgeTip: "Ne demandez la légalisation ou l'apostille qu'une fois votre admission confirmée : ce sont des démarches qui prennent du temps, mais rarement utiles avant ce stade."
},

// ==========================================================
// ACADÉMIQUE
// ==========================================================

{
icon: "graduation-cap",
category: "academique",
priority: "essentiel",
title: "Diplôme",
description: "Document officiel attestant que vous avez validé un niveau d'études.",
importance: "Les universités demandent le diplôme correspondant au niveau immédiatement inférieur à celui visé : un baccalauréat pour une Licence, une Licence pour un Master, un Master pour un Doctorat. Sans lui, un dossier est rejeté d'office avant même l'examen du reste de la candidature.",
context: "Demandé dès la candidature comme preuve du niveau académique déjà validé ; une version certifiée ou légalisée est parfois redemandée après l'admission.",
requestedBy: "Toutes les universités et bourses académiques : Erasmus+, Fulbright, Chevening, DAAD, MEXT, Türkiye Scholarships, CSC, Commonwealth, Eiffel.",
level: "Licence, Master, Doctorat",
issuedBy: "L'établissement d'enseignement supérieur ou secondaire ayant délivré le diplôme.",
howToObtain: "Retirer le diplôme original auprès du service de scolarité une fois disponible. Faire réaliser copies certifiées, traduction certifiée et, pour certains pays, une légalisation ou apostille.",
averageTime: "Immédiat si déjà en votre possession ; plusieurs mois d'attente si le diplôme officiel n'est pas encore imprimé.",
validity: "Pas de limite de validité.",
scan: [
"Scanner le diplôme dans son intégralité.",
"Scanner le recto et le verso si des informations figurent au dos.",
"S'assurer que le cachet officiel, les signatures et les mentions sont bien visibles.",
"Si une traduction certifiée est exigée par l'université, la préparer également."
],
tips: [
"Scanner en couleur et en bonne résolution.",
"Vérifier que le nom figurant sur le diplôme correspond exactement à celui du passeport.",
"Si vous n'avez pas encore reçu votre diplôme final, une attestation de réussite provisoire est généralement acceptée en remplacement temporaire."
],
mistakes: [
"Diplôme incomplet ou pages manquantes.",
"Cachet ou signature illisible.",
"Envoyer un diplôme qui ne correspond pas au niveau demandé par le programme.",
"Nom différent de celui du passeport sans document justificatif."
],
scholarBridgeTip: "Si votre diplôme n'est pas encore délivré au moment de la candidature, contactez votre établissement pour une attestation provisoire — la plupart des universités l'acceptent en pièce d'attente."
},

{
icon: "clipboard-list",
category: "academique",
priority: "essentiel",
title: "Relevés de notes",
description: "Document officiel présentant vos résultats académiques obtenus au cours de vos études.",
importance: "C'est le document sur lequel repose l'essentiel de l'évaluation académique de votre dossier. Beaucoup de bourses fixent un seuil minimum de moyenne — vos relevés sont la preuve directe que vous l'atteignez.",
context: "Demandés dès la candidature, pour toutes les années du niveau concerné ; parfois redemandés en version originale scellée après l'admission.",
requestedBy: "Toutes les universités et bourses : Erasmus+, Fulbright, Chevening, DAAD, MEXT, Türkiye Scholarships, CSC, Commonwealth, Eiffel.",
level: "Licence, Master, Doctorat",
issuedBy: "Le service de la scolarité de chaque établissement fréquenté.",
howToObtain: "S'adresser au service de la scolarité ou des examens, qui délivre les relevés officiels avec cachet. Pour un envoi 'sous pli confidentiel' (fréquent en Amérique du Nord), demander explicitement ce format.",
averageTime: "Quelques jours à 3 semaines selon l'établissement.",
validity: "Pas de limite de validité.",
scan: [
"Scanner tous les relevés de notes demandés, année par année.",
"Ne pas oublier les deux faces si des informations figurent au verso.",
"Regrouper les pages dans un seul fichier PDF lorsque cela est demandé.",
"Vérifier que toutes les notes, signatures et cachets sont parfaitement lisibles."
],
tips: [
"Conserver les relevés dans leur ordre chronologique.",
"Nommer clairement le fichier (exemple : Releves_de_notes_Licence.pdf).",
"Préparer une traduction certifiée si l'université l'exige — c'est très fréquent pour les relevés."
],
mistakes: [
"Oublier un semestre ou une année dans l'envoi.",
"Envoyer un relevé incomplet ou une capture d'écran au lieu du document officiel.",
"Fusionner des relevés de différents niveaux dans un fichier désorganisé."
],
scholarBridgeTip: "Une seule page manquante peut suffire à faire classer un dossier comme incomplet. Vérifiez le nombre total de pages attendu avant l'envoi."
},

{
icon: "school",
category: "academique",
priority: "frequent",
title: "Certificat de scolarité",
description: "Attestation officielle confirmant que vous êtes actuellement inscrit et en cours de scolarité dans un établissement.",
importance: "Il permet de vérifier que vous êtes bien étudiant au moment de la candidature, particulièrement important si vous postulez avant d'avoir obtenu votre diplôme actuel. Il rassure le comité sur la cohérence de votre calendrier académique.",
context: "Principalement demandé lorsque vous candidatez en dernière année de Licence ou de Master, comme preuve que vous serez diplômé avant le début du programme visé.",
requestedBy: "La plupart des universités qui acceptent les candidatures de dernière année avant l'obtention du diplôme ; toujours vérifier les instructions précises du portail.",
level: "Licence, Master, Doctorat",
issuedBy: "Le service de la scolarité de votre établissement actuel.",
howToObtain: "Faire une demande simple auprès du service de scolarité, souvent via un formulaire standard.",
averageTime: "Quelques jours, parfois immédiat.",
validity: "3 mois en général.",
scan: [
"Scanner le document complet avec le cachet et la signature de l'établissement bien visibles.",
"Vérifier que l'année académique et le niveau exact d'inscription y figurent clairement.",
"Convertir en PDF plutôt qu'en photo si le portail le permet."
],
tips: [
"Demander le certificat peu de temps avant la date limite de dépôt, car sa durée de validité est courte.",
"Vérifier qu'il mentionne bien le niveau et l'année précis attendus par le programme.",
"Anticiper si votre établissement met du temps à délivrer ce document."
],
mistakes: [
"Fournir un certificat trop ancien, dépassant la durée de validité tolérée.",
"Confondre certificat de scolarité et attestation de réussite — ce sont deux documents différents.",
"Oublier de le fournir alors que le programme l'exige explicitement."
],
scholarBridgeTip: "Si vous postulez avant la fin de votre année en cours, ce document est souvent ce qui rassure le comité sur votre calendrier — ne le négligez pas au profit du seul relevé de notes."
},

{
icon: "award",
category: "academique",
priority: "frequent",
title: "Attestation de réussite",
description: "Document provisoire attestant que vous avez validé et réussi un niveau d'études, en attendant l'édition officielle du diplôme.",
importance: "Dans de nombreux systèmes éducatifs africains et francophones, l'impression du diplôme officiel peut prendre plusieurs mois après la proclamation des résultats. L'attestation de réussite comble cet écart : elle a la même valeur probante que le diplôme pour la plupart des candidatures.",
context: "Utilisée à la place du diplôme lorsque celui-ci n'est pas encore délivré au moment de la candidature ou même de l'admission.",
requestedBy: "Acceptée en remplacement temporaire par la grande majorité des universités et bourses internationales ; certaines administrations de visa demandent ensuite le diplôme original avant le départ.",
level: "Licence, Master, Doctorat",
issuedBy: "Le service de la scolarité ou des examens de votre établissement, parfois le ministère de l'Éducation.",
howToObtain: "Faire une demande auprès du service des examens une fois les résultats proclamés officiellement.",
averageTime: "1 à 3 semaines après la proclamation officielle des résultats.",
validity: "Généralement valable jusqu'à la délivrance du diplôme définitif.",
scan: [
"Scanner le document complet avec le cachet et la signature visibles.",
"Vérifier que la mention et la date de proclamation des résultats sont lisibles.",
"Conserver une copie à jour à envoyer dès que le diplôme officiel est disponible."
],
tips: [
"La demander dès la publication officielle des résultats.",
"Prévenir l'université dès le dépôt de candidature que le diplôme final suivra.",
"Conserver précieusement ce document jusqu'à obtention du diplôme officiel."
],
mistakes: [
"Attendre le diplôme final avant de candidater, alors que l'attestation suffit dans la plupart des cas.",
"Fournir une attestation sans cachet officiel.",
"Oublier d'envoyer le diplôme définitif une fois disponible."
],
scholarBridgeTip: "Ne laissez jamais un diplôme non encore imprimé retarder votre candidature — l'attestation de réussite est faite exactement pour cette situation, très courante dans les systèmes francophones."
},

{
icon: "list-ordered",
category: "academique",
priority: "specifique",
title: "Classement (rang dans la promotion)",
description: "Document indiquant votre position académique par rapport aux autres étudiants de votre promotion ou de votre classe.",
importance: "Certains comités de sélection, notamment anglo-saxons, l'utilisent comme indicateur complémentaire à la moyenne pour situer votre niveau réel par rapport aux autres étudiants d'un même établissement.",
context: "N'est absolument pas universel : jamais un standard. Il n'existe même pas dans de nombreux établissements francophones — dans ce cas, il suffit d'indiquer que l'établissement ne délivre pas ce type de document.",
requestedBy: "Plus fréquent pour les universités nord-américaines et certains programmes Commonwealth ; rare dans le système français et pour la plupart des bourses gouvernementales (Erasmus+, DAAD, CSC, Türkiye Scholarships ne l'exigent généralement pas).",
level: "Master, Doctorat",
issuedBy: "Le service de la scolarité de votre établissement, lorsque celui-ci calcule et publie ce type de classement.",
howToObtain: "Demander au service de la scolarité si un classement officiel existe. S'il n'existe pas, demander une lettre confirmant qu'aucun classement n'est établi.",
averageTime: "1 à 3 semaines si le classement existe déjà.",
validity: "Pas de limite de validité pour la période académique concernée.",
scan: [
"Scanner l'attestation avec le cachet officiel de l'établissement.",
"Vérifier que l'effectif total de la promotion est lisible pour donner du contexte au rang.",
"Conserver aussi la lettre justifiant l'absence de classement si applicable."
],
tips: [
"Ne pas paniquer si votre établissement ne fournit pas ce document.",
"Si un classement existe mais n'est pas flatteur, se concentrer sur les autres preuves de qualité du dossier.",
"Toujours vérifier si le programme le demande explicitement avant de le réclamer inutilement."
],
mistakes: [
"Croire à tort que ce document est obligatoire partout.",
"Fournir un classement informel, non signé par l'établissement.",
"Oublier de préciser l'effectif total de la promotion."
],
scholarBridgeTip: "Si votre établissement ne produit pas de classement, ne bloquez jamais votre dossier pour ce document — une simple mention 'non applicable' accompagnée d'une lettre de l'établissement suffit dans l'immense majorité des cas."
},

// ==========================================================
// PERSONNEL
// ==========================================================

{
icon: "file-text",
category: "personnel",
priority: "essentiel",
title: "Curriculum Vitae (CV)",
description: "Document présentant votre parcours académique, vos expériences, vos compétences et vos réalisations.",
importance: "Le CV permet aux universités et aux organismes de bourses d'évaluer rapidement la cohérence globale de votre profil. C'est souvent le premier document parcouru par un comité de sélection, avant même la lettre de motivation.",
context: "Quasiment systématique dans toute candidature universitaire ou de bourse internationale, dès la Licence, avec des attentes qui se complexifient au Master et au Doctorat (publications, expérience de recherche).",
requestedBy: "Demandé par la quasi-totalité des programmes — Erasmus+, Fulbright, Chevening, DAAD, MEXT, Türkiye Scholarships, CSC, Commonwealth, Eiffel — parfois sous un format imposé (Europass pour de nombreux programmes européens).",
level: "Licence, Master, Doctorat",
issuedBy: "Vous-même.",
howToObtain: "Listez d'abord tout votre parcours sans filtrer, puis sélectionnez et reformulez ce qui est pertinent pour le programme précis visé. Utilisez un format reconnu si le programme l'impose.",
averageTime: "2 à 4 heures pour une première version solide.",
validity: "Pas de limite de validité, mais à actualiser avant chaque candidature.",
scan: [
"Préparer un CV clair, bien organisé et à jour.",
"Enregistrer le CV au format PDF.",
"Utiliser un nom de fichier professionnel (exemple : CV_Prénom_Nom.pdf)."
],
tips: [
"Limiter le CV à une ou deux pages selon votre expérience (davantage pour un CV académique doctoral avec publications).",
"Mettre en avant votre parcours académique et les expériences liées au domaine visé.",
"Présenter vos compétences linguistiques, informatiques et techniques avec un niveau précis.",
"Utiliser le format Europass si le programme européen le recommande."
],
mistakes: [
"Informations non mises à jour ou dates incohérentes.",
"CV trop long ou mal organisé.",
"Photo de mauvaise qualité lorsqu'une photo est demandée (à éviter dans les CV nord-américains).",
"Format autre que le PDF lorsque l'université demande spécifiquement un PDF."
],
scholarBridgeTip: "Adaptez toujours votre CV au programme auquel vous postulez — mettez en avant les expériences et compétences les plus pertinentes pour ce programme précis, pas un CV générique envoyé partout."
},

{
icon: "pen-line",
category: "personnel",
priority: "essentiel",
title: "Lettre de motivation",
description: "Document expliquant pourquoi vous souhaitez intégrer une université précise et pourquoi vous êtes un bon candidat.",
importance: "C'est le document où le comité de sélection évalue votre motivation réelle et la cohérence de votre projet. Une lettre visiblement générique, envoyée identique à plusieurs universités, est l'un des signaux les plus négatifs pour un comité de sélection.",
context: "Demandée pour la quasi-totalité des candidatures francophones et européennes classiques, généralement sous forme d'une lettre libre d'une à deux pages.",
requestedBy: "Terme standard du système francophone et européen continental (France, Belgique, Suisse, Erasmus+, DAAD). Les systèmes anglo-saxons emploient des équivalents : voir Statement of Purpose et Personal Statement.",
level: "Licence, Master, Doctorat",
issuedBy: "Vous-même.",
howToObtain: "Structurez la lettre en trois temps : qui vous êtes, pourquoi ce programme et cette université précisément, où vous voulez aller ensuite. Personnalisez systématiquement pour chaque établissement.",
averageTime: "3 à 6 heures pour une première version, puis 30 à 60 minutes d'adaptation par université.",
validity: "Pas de limite de validité, mais à réécrire pour chaque établissement.",
scan: [
"Rédiger une lettre claire et personnalisée pour chaque université.",
"L'enregistrer au format PDF.",
"Adapter systématiquement le contenu à l'université et au programme visés."
],
tips: [
"Présentez-vous brièvement puis expliquez pourquoi cette université et ce programme précisément.",
"Parlez de vos objectifs professionnels et du lien avec le programme.",
"Concluez avec une formule de politesse adaptée au ton académique du pays visé.",
"Évitez les formules toutes faites que les comités lisent des dizaines de fois."
],
mistakes: [
"Utiliser la même lettre pour toutes les universités.",
"Lettre trop longue ou trop générale.",
"Copier une lettre trouvée sur Internet — les comités de sélection les repèrent facilement.",
"Confondre lettre de motivation et CV en liste."
],
scholarBridgeTip: "Une bonne lettre de motivation doit être personnelle, sincère et adaptée à l'université dans laquelle vous postulez — si elle peut se relire mot pour mot pour une autre université, elle n'est pas encore prête."
},

{
icon: "target",
category: "personnel",
priority: "frequent",
title: "Statement of Purpose (SOP)",
description: "L'équivalent nord-américain de la lettre de motivation, centré sur vos objectifs académiques et de recherche plutôt que sur un récit personnel.",
importance: "Dans le système universitaire américain, le SOP est le document central de toute candidature de troisième cycle : il expose précisément vos objectifs, votre préparation académique et pourquoi le programme visé est le bon cadre. Jugé sur la clarté du raisonnement plus que sur la qualité littéraire.",
context: "Central pour les candidatures en Master et Doctorat aux États-Unis, de plus en plus demandé aussi par des programmes canadiens.",
requestedBy: "Quasi universel dans les admissions américaines, pièce centrale des candidatures Fulbright (sous forme de 'Statement of Grant Purpose'). Certains programmes Erasmus Mundus utilisent aussi ce terme.",
level: "Master, Doctorat",
issuedBy: "Vous-même.",
howToObtain: "Restez factuel et structuré : parcours pertinent, projets qui démontrent vos compétences, objectifs de recherche précis, pourquoi ce département et ces professeurs précisément. Évitez le ton narratif et les anecdotes personnelles.",
averageTime: "4 à 8 heures pour une première version.",
validity: "Pas de limite de validité, mais à réécrire pour chaque université.",
scan: [
"Enregistrer au format PDF selon les consignes du portail.",
"Respecter strictement la limite de mots.",
"Vérifier que le nom de l'université et des professeurs cités correspond bien à la candidature en cours."
],
tips: [
"Restez concret : des exemples précis valent mieux qu'une déclaration d'intention générale.",
"Nommez explicitement un ou deux professeurs du département dont les travaux recoupent votre projet.",
"Gardez un ton mesuré, l'auto-promotion excessive est souvent perçue négativement.",
"Ne recyclez pas telle quelle une lettre de motivation française — la structure et le ton diffèrent réellement."
],
mistakes: [
"Confondre avec une lettre de motivation classique et adopter un ton trop littéraire.",
"Rester vague sur les objectifs de recherche.",
"Ne citer aucun professeur ni élément concret du département visé.",
"Dépasser la limite de mots imposée."
],
scholarBridgeTip: "Pensez le SOP comme un dossier de preuve, pas comme une déclaration d'amour au programme : chaque phrase doit démontrer une compétence ou justifier un choix."
},

{
icon: "user-pen",
category: "personnel",
priority: "frequent",
title: "Personal Statement",
description: "L'équivalent britannique et du Commonwealth de la lettre de motivation, centré sur votre parcours personnel et vos qualités humaines.",
importance: "Utilisé par les universités britanniques via UCAS et repris en esprit par Chevening ou les Commonwealth Scholarships, le Personal Statement met l'accent sur qui vous êtes et vos qualités de leadership — un registre plus narratif que le SOP américain.",
context: "Central pour les candidatures de Licence via UCAS, présent sous forme de questions guidées dans Chevening et Commonwealth Scholarships.",
requestedBy: "UCAS (Licence au Royaume-Uni), Commonwealth Scholarships, Chevening à travers ses essais guidés.",
level: "Licence, Master, Doctorat",
issuedBy: "Vous-même.",
howToObtain: "Partez d'un fil narratif personnel : ce qui vous a conduit vers ce domaine, les expériences qui illustrent votre engagement et votre potentiel de leadership. Contrairement au SOP, une dimension humaine et réflexive est attendue.",
averageTime: "4 à 6 heures, davantage si plusieurs essais guidés sont imposés.",
validity: "Pas de limite de validité, mais à adapter aux questions précises de chaque programme.",
scan: [
"Respecter scrupuleusement la limite de caractères ou de mots.",
"Rédiger directement dans le champ du portail si aucun upload n'est prévu, en gardant une copie de secours.",
"Vérifier l'orthographe britannique si le programme est britannique."
],
tips: [
"Ancrez le texte dans des exemples concrets de leadership ou d'engagement communautaire.",
"Pour Chevening et Commonwealth, répondez précisément à la question posée.",
"Montrez en quoi votre retour dans votre pays aura un impact concret.",
"Le ton peut être plus personnel et chaleureux qu'un SOP américain."
],
mistakes: [
"Traduire littéralement une lettre de motivation française sans adapter le ton.",
"Dépasser la limite de caractères imposée.",
"Rester vague sur l'impact futur.",
"Réutiliser un texte identique pour plusieurs essais qui posent des questions différentes."
],
scholarBridgeTip: "Ne confondez pas ce document avec le Statement of Purpose américain : ici, on veut voir la personne derrière le projet, pas seulement le projet."
},

{
icon: "calendar-check",
category: "personnel",
priority: "specifique",
title: "Study Plan",
description: "Plan d'études détaillé, souvent semestre par semestre, exigé notamment par la bourse japonaise MEXT et plusieurs programmes asiatiques.",
importance: "Il demande de détailler concrètement le déroulement prévu des études : cours envisagés, jalons de recherche, calendrier réaliste. Il vérifie que le candidat a une compréhension fine du système académique visé et un plan réalisable.",
context: "Central dans le dossier MEXT (Japon) à tous les niveaux, fréquemment demandé par la Chinese Government Scholarship (CSC).",
requestedBy: "MEXT (Japon), Chinese Government Scholarship (CSC).",
level: "Master, Doctorat",
issuedBy: "Vous-même.",
howToObtain: "Découpez le document par grandes périodes (par année ou semestre) : adaptation linguistique, cours à suivre, étapes de recherche. Restez réaliste sur le rythme.",
averageTime: "5 à 8 heures.",
validity: "Pas de limite de validité, mais à réécrire si la structure du programme change.",
scan: [
"Suivre le format ou le gabarit officiel si le programme MEXT ou l'ambassade en fournit un.",
"Enregistrer en PDF avec une mise en page claire.",
"Vérifier que la langue demandée correspond aux consignes de l'ambassade."
],
tips: [
"Renseignez-vous sur la structure exacte du programme avant de rédiger.",
"Prévoyez une phase réaliste d'adaptation linguistique si nécessaire.",
"Restez cohérent avec votre projet de recherche énoncé ailleurs dans le dossier.",
"Utilisez le gabarit fourni par l'ambassade quand il existe."
],
mistakes: [
"Plan trop vague, sans étapes ni calendrier réel.",
"Ignorer la structure réelle du programme et proposer un déroulement irréaliste.",
"Ne pas suivre le gabarit officiel quand un format précis est imposé.",
"Incohérence avec le projet de recherche présenté par ailleurs."
],
scholarBridgeTip: "Ne confondez pas ce document avec un projet d'études général : le Study Plan attend un calendrier concret — soyez aussi précis qu'un emploi du temps."
},

{
icon: "compass",
category: "personnel",
priority: "frequent",
title: "Projet d'études",
description: "Terme francophone désignant la description de votre parcours académique envisagé — l'équivalent du SOP et du Personal Statement dans les systèmes français, belge et suisse.",
importance: "C'est le terme que rencontreront la plupart des étudiants francophones : Études en France (Campus France), universités belges et suisses, Eiffel, certains Erasmus+. Contenu proche du SOP mais avec les codes du système francophone.",
context: "Demandé systématiquement dans la procédure Études en France, sur de nombreux portails belges et suisses, dans le dossier Eiffel.",
requestedBy: "Campus France, universités belges et suisses, programme Eiffel, masters Erasmus+ francophones.",
level: "Licence, Master, Doctorat",
issuedBy: "Vous-même.",
howToObtain: "Expliquez la logique de votre parcours, pourquoi ce diplôme et cette université sont la suite cohérente, ce que vous comptez en faire ensuite. Restez factuel, évitez les formulations génériques.",
averageTime: "3 à 5 heures.",
validity: "Pas de limite de validité, mais à adapter à chaque portail.",
scan: [
"Respecter le format et la limite de caractères imposés par le formulaire.",
"Rédiger directement dans le champ en ligne quand aucun upload n'est prévu, en gardant une copie de secours.",
"Vérifier l'orthographe et la cohérence des dates avec le reste du dossier."
],
tips: [
"Montrez une progression logique : pourquoi ce niveau, ce domaine, cette université, dans cet ordre.",
"Sur Campus France, évitez les formulations passe-partout trouvées en ligne.",
"Reliez le projet d'études à un objectif professionnel clair.",
"Adaptez le registre à l'institution."
],
mistakes: [
"Recycler un texte trouvé en ligne ou un modèle générique.",
"Rester flou sur le choix précis de l'université.",
"Dépasser la limite de caractères imposée par certains portails.",
"Ne pas relier le projet d'études au reste du dossier."
],
scholarBridgeTip: "Sur Campus France en particulier, la cohérence compte plus que le style : un projet d'études simple mais logique bat toujours un texte brillant mais confus."
},

{
icon: "trending-up",
category: "personnel",
priority: "specifique",
title: "Projet professionnel",
description: "Document distinct du projet d'études, centré sur votre trajectoire de carrière après les études financées.",
importance: "Certaines bourses veulent s'assurer que le financement sert un objectif professionnel précis et un retour utile dans le pays d'origine — pas seulement une envie d'étudier à l'étranger.",
context: "Demandé en complément du projet d'études par des bourses qui financent des trajectoires au service d'un pays ou d'un secteur précis.",
requestedBy: "Le programme Eiffel, qui vise à former de futurs décideurs et évalue la cohérence avec un projet de retour ; plusieurs bourses gouvernementales à vocation similaire.",
level: "Master, Doctorat",
issuedBy: "Vous-même.",
howToObtain: "Décrivez le poste ou le secteur visé après les études, pourquoi la formation choisie est une étape nécessaire, et en quoi ce parcours servira votre pays ou secteur d'origine.",
averageTime: "3 à 5 heures.",
validity: "Pas de limite de validité, mais à réviser si votre projet évolue.",
scan: [
"Respecter le format et la longueur imposés par le formulaire.",
"Vérifier la cohérence des dates et objectifs avec le reste du dossier.",
"Enregistrer en PDF si un document séparé est demandé."
],
tips: [
"Articulez clairement le lien de cause à effet entre la formation et l'objectif professionnel.",
"Mentionnez explicitement l'impact attendu dans votre pays d'origine si le programme le valorise.",
"Restez cohérent avec le projet d'études.",
"Évitez les objectifs de carrière trop vagues."
],
mistakes: [
"Confondre ce document avec le projet d'études et répéter le même contenu.",
"Décrire un objectif professionnel déconnecté de la formation demandée.",
"Ignorer l'attente de retour dans le pays d'origine pour les bourses qui la valorisent.",
"Rester trop vague pour paraître crédible."
],
scholarBridgeTip: "Ne réutilisez jamais votre projet d'études tel quel en changeant juste le titre : un comité qui lit les deux documents veut voir deux angles complémentaires, pas un copier-coller."
},

// ==========================================================
// RECOMMANDATION
// ==========================================================

{
icon: "message-square-quote",
category: "recommandation",
priority: "essentiel",
title: "Lettres de recommandation académiques",
description: "Lettres rédigées par un enseignant, un directeur de mémoire ou un encadrant de recherche attestant de votre sérieux et de vos capacités académiques.",
importance: "La quasi-totalité des bourses de Master et de Doctorat en exigent au moins deux. Elles apportent un regard extérieur crédible sur votre travail académique — un comité de sélection accorde souvent plus de poids à ce que dit un enseignant qu'à ce que vous dites de vous-même.",
context: "Exigées pour la quasi-totalité des candidatures de Master et de Doctorat.",
requestedBy: "Quasiment tous les programmes de Master et Doctorat — Erasmus+, DAAD, MEXT, Türkiye Scholarships, CSC, Eiffel — en demandent généralement deux à trois.",
level: "Licence, Master, Doctorat",
issuedBy: "Un enseignant, un directeur de mémoire ou de thèse, ou un encadrant de stage académique qui vous connaît directement.",
howToObtain: "Sollicitez un enseignant qui vous a réellement évalué. Fournissez-lui votre CV et une note sur le programme visé. Certains portails demandent un envoi direct par le recommandateur via un lien sécurisé.",
averageTime: "2 à 4 semaines de délai avec le recommandateur.",
validity: "Généralement acceptées plusieurs mois après leur rédaction.",
scan: [
"Vérifier le nombre exact de lettres demandées par le programme (souvent 2 à 3).",
"S'assurer que chaque lettre est signée, datée et si possible sur papier à en-tête de l'institution.",
"Certains portails demandent un envoi direct par le recommandateur — vérifier ce point en priorité.",
"Regrouper les lettres scannées par vous-même dans des fichiers PDF nommés clairement."
],
tips: [
"Solliciter vos recommandateurs plusieurs semaines à l'avance.",
"Choisir des personnes qui vous connaissent réellement, pas seulement les plus hauts gradés.",
"Fournir à votre recommandateur votre CV et une note sur le programme visé.",
"Relancer poliment si le délai approche."
],
mistakes: [
"Lettres non signées ou non datées.",
"Solliciter les recommandateurs trop tard, ce qui produit des lettres bâclées.",
"Demander une lettre à un enseignant qui ne vous connaît que de nom.",
"Fournir le minimum demandé alors qu'un maximum plus élevé était accepté."
],
scholarBridgeTip: "Relancez poliment vos recommandateurs si le délai approche — ce sont eux qui déterminent le rythme, anticipez toujours plus que nécessaire."
},

{
icon: "handshake",
category: "recommandation",
priority: "frequent",
title: "Lettres de recommandation professionnelles",
description: "Lettres rédigées par un employeur ou un supérieur hiérarchique attestant de vos compétences en contexte de travail, distinctes des lettres académiques.",
importance: "Pour les candidats ayant une expérience professionnelle significative, un comité valorise autant, sinon plus, un regard d'employeur qu'un regard académique parfois ancien. Elle démontre fiabilité, travail en équipe, leadership.",
context: "Pertinente lorsque le candidat a quitté le milieu académique depuis un moment ou postule à un programme qui valorise l'expérience professionnelle.",
requestedBy: "Chevening, qui accepte explicitement des référents professionnels ; les programmes de type MBA ou Master professionnel/exécutif.",
level: "Master, Doctorat",
issuedBy: "Un employeur, un supérieur hiérarchique direct, ou un responsable de stage.",
howToObtain: "Sollicitez votre supérieur hiérarchique direct plutôt qu'un dirigeant plus haut placé qui vous connaît moins bien. Demandez-lui de mettre l'accent sur des réalisations concrètes et mesurables.",
averageTime: "1 à 3 semaines de délai.",
validity: "Généralement acceptées plusieurs mois après leur rédaction.",
scan: [
"Demander une lettre sur papier à en-tête de l'entreprise, signée et datée.",
"Vérifier si le portail exige un envoi direct par le référent.",
"Scanner en couleur avec le cachet de l'entreprise bien visible."
],
tips: [
"Privilégier un supérieur hiérarchique direct plutôt qu'un dirigeant distant.",
"Orienter la lettre vers des résultats mesurables et des responsabilités précises.",
"Pour Chevening, une référence professionnelle qui parle de leadership est très valorisée.",
"Combiner idéalement une référence académique et une référence professionnelle quand le programme accepte les deux."
],
mistakes: [
"Solliciter un dirigeant prestigieux mais distant plutôt qu'un supérieur direct.",
"Fournir une lettre qui reste vague sans réalisation concrète.",
"Ignorer que certains programmes attendent explicitement ce type de référence.",
"Ne pas préciser le contexte du programme visé au référent."
],
scholarBridgeTip: "Si vous travaillez depuis plusieurs années, une lettre de votre manager direct racontant un résultat concret pèsera souvent plus lourd qu'une lettre académique d'un professeur qui ne vous a pas vu depuis longtemps."
},

// ==========================================================
// LINGUISTIQUE
// ==========================================================

{
icon: "languages",
category: "linguistique",
priority: "essentiel",
title: "IELTS",
description: "Test international de compétence en anglais, évaluant compréhension écrite, compréhension orale, expression écrite et expression orale.",
importance: "L'IELTS est l'un des deux tests d'anglais les plus universellement reconnus pour les candidatures internationales, avec le TOEFL. Il conditionne directement l'éligibilité : un score sous le seuil minimum entraîne un rejet automatique.",
context: "Demandé dès la candidature par les universités anglophones du Royaume-Uni, d'Australie, du Canada, puis souvent revérifié lors de la demande de visa.",
requestedBy: "Universités du Royaume-Uni, d'Australie, du Canada, de Nouvelle-Zélande et d'Irlande. Explicitement listé par Chevening et les Commonwealth Scholarships.",
level: "Licence, Master, Doctorat",
issuedBy: "British Council, IDP: IELTS Australia et Cambridge University Press & Assessment.",
howToObtain: "S'inscrire en ligne sur les sites du British Council ou d'IDP, en choisissant impérativement le module « Academic » pour une candidature universitaire.",
averageTime: "2 à 4 semaines entre l'inscription et la session ; résultats sous 3 à 13 jours selon le format.",
validity: "2 ans à partir de la date du test.",
scan: [
"Télécharger le Test Report Form (TRF) officiel, jamais une capture d'écran.",
"Vérifier que le numéro de certificat (TRF number) reste lisible.",
"Conserver le PDF fourni sans le recompresser ni le modifier."
],
tips: [
"Choisir systématiquement le module Academic, jamais General Training.",
"Vérifier le score minimum exigé par compétence avant de vous inscrire.",
"La version IELTS on Computer donne des résultats plus rapidement.",
"Passer le test plusieurs mois avant la date limite pour garder une marge."
],
mistakes: [
"Passer le module General Training au lieu du module Academic exigé.",
"Envoyer un score sous le seuil minimum en espérant une exception.",
"Attendre la dernière minute alors que les centres affichent complet en haute saison."
],
scholarBridgeTip: "Certains centres proposent l'IELTS One Skill Retake, permettant de repasser une seule compétence — mais toutes les universités ne l'acceptent pas encore, à vérifier avant d'y recourir."
},

{
icon: "monitor",
category: "linguistique",
priority: "essentiel",
title: "TOEFL",
description: "Test international de compétence en anglais académique (TOEFL iBT), principalement utilisé pour les candidatures aux États-Unis.",
importance: "Le TOEFL iBT est le test de référence historique des universités américaines et reste largement accepté ailleurs. Un score sous le seuil minimum entraîne un rejet d'office.",
context: "Demandé par la quasi-totalité des universités américaines et de nombreux programmes nord-américains et asiatiques dispensés en anglais.",
requestedBy: "Le test de référence pour les universités des États-Unis ; accepté par le programme Fulbright parmi les preuves de niveau d'anglais admises.",
level: "Licence, Master, Doctorat",
issuedBy: "ETS (Educational Testing Service).",
howToObtain: "S'inscrire sur ets.org/toefl, en choisissant un centre agréé ou la version « TOEFL iBT Home Edition » à domicile.",
averageTime: "Le test dure un peu moins de 2 heures ; résultats sous 4 à 8 jours.",
validity: "2 ans à partir de la date du test.",
scan: [
"Télécharger le score report officiel PDF depuis votre compte ETS.",
"Vérifier que votre nom correspond exactement à celui figurant sur votre passeport.",
"Envoyer directement le score via ETS aux universités qui l'exigent, en plus du PDF conservé."
],
tips: [
"Vérifier si l'université accepte la TOEFL iBT Home Edition.",
"Utiliser les codes destinataires ETS pour envoyer gratuitement vos scores.",
"Vérifier la date des ressources de préparation utilisées, le format ayant changé en 2023."
],
mistakes: [
"Confondre le TOEFL iBT et le TOEFL ITP, non accepté pour les candidatures directes.",
"Se contenter d'un scan personnel alors qu'un envoi officiel direct via ETS est exigé.",
"Attendre les derniers jours sans marge en cas de score insuffisant."
],
scholarBridgeTip: "Vérifiez toujours au cas par cas si votre programme préfère le TOEFL ou l'IELTS : passer le bon test du premier coup vous évite un second examen."
},

{
icon: "smartphone",
category: "linguistique",
priority: "frequent",
title: "Duolingo English Test",
description: "Test d'anglais entièrement en ligne, passé à domicile, de plus en plus accepté en alternative au TOEFL et à l'IELTS.",
importance: "Sa rapidité et son coût nettement inférieur en font une option attractive. Son acceptation progresse rapidement mais reste encore inégale selon les universités et surtout les organismes de bourses.",
context: "Utile en alternative lorsque l'université cible le mentionne explicitement parmi les tests acceptés ; à éviter comme seul test pour une bourse gouvernementale.",
requestedBy: "Accepté par un nombre croissant d'universités aux États-Unis, au Royaume-Uni et au Canada, mais pas encore par la majorité des grandes bourses gouvernementales (Chevening, Fulbright, Commonwealth).",
level: "Licence, Master, Doctorat",
issuedBy: "Duolingo, Inc.",
howToObtain: "S'inscrire directement sur englishtest.duolingo.com : le test se passe à domicile sous surveillance automatisée et humaine à distance, sans réservation à l'avance.",
averageTime: "Le test dure environ 1 heure ; résultats sous 1 à 2 jours.",
validity: "2 ans à partir de la date du test.",
scan: [
"Télécharger le certificat officiel PDF envoyé par email, incluant le lien vers la vidéo de passation.",
"Vérifier que le lien de vérification en ligne reste actif.",
"Ne pas renommer ni modifier le fichier PDF original."
],
tips: [
"Vérifier explicitement si le test figure dans la liste des tests acceptés avant de l'utiliser comme seule preuve.",
"Tester connexion, webcam et environnement calme avant la session.",
"Profiter des certificats envoyés gratuitement à plusieurs destinataires."
],
mistakes: [
"Utiliser uniquement ce test pour une bourse gouvernementale sans avoir vérifié qu'elle l'accepte.",
"Passer le test dans un environnement bruyant ou avec une connexion instable.",
"Croire le test accepté partout parce qu'il l'est par certaines universités prestigieuses."
],
scholarBridgeTip: "En cas de doute sur l'acceptation du Duolingo English Test, contactez directement le service des admissions avant de le passer — un mail de confirmation écrit vous évite une mauvaise surprise."
},

{
icon: "book-open",
category: "linguistique",
priority: "frequent",
title: "DELF / DALF",
description: "Diplômes officiels français attestant du niveau de compétence en langue française, du niveau A1 (DELF) au niveau C2 (DALF).",
importance: "Preuve de référence du niveau de français pour les candidatures aux programmes francophones, notamment via Campus France. Ce sont des diplômes officiels reconnus à vie, sans date d'expiration.",
context: "Demandés pour les candidatures aux programmes dispensés en français hors pays francophones, dans le cadre de Campus France.",
requestedBy: "De nombreuses universités françaises pour les candidats non francophones ; le programme Eiffel lorsque le cursus se déroule en français.",
level: "Licence, Master, Doctorat",
issuedBy: "France Éducation internationale, sous l'autorité du ministère français de l'Éducation nationale.",
howToObtain: "S'inscrire auprès d'un centre agréé (Alliance française, Institut français) dans votre pays. Choisir directement le niveau adapté selon les exigences du programme.",
averageTime: "Résultats communiqués 4 à 8 semaines après la session.",
validity: "Diplôme à vie, sans date d'expiration.",
scan: [
"Scanner le diplôme officiel recto-verso, cachets et signatures inclus.",
"Conserver le relevé de résultats détaillé par compétence.",
"Vérifier que le niveau indiqué correspond bien à celui exigé par le programme."
],
tips: [
"Choisir directement le niveau visé par le programme plutôt qu'un niveau inférieur.",
"Vérifier les dates de sessions disponibles plusieurs mois à l'avance.",
"Sa validité à vie en fait un bon investissement pour plusieurs candidatures francophones futures."
],
mistakes: [
"Présenter un niveau DELF B1 ou B2 alors qu'un DALF C1 est explicitement exigé.",
"Attendre la dernière minute alors que les sessions sont rares dans certains pays.",
"Confondre le DELF/DALF avec le TCF ou le TEF."
],
scholarBridgeTip: "Comme le DELF/DALF ne périme jamais, passez-le dès que votre niveau de français est stabilisé, même avant d'avoir choisi vos universités précises — vous ne le repasserez jamais."
},

{
icon: "scroll-text",
category: "linguistique",
priority: "frequent",
title: "TCF / TEF",
description: "Tests de connaissance du français à score chiffré, distincts du DELF/DALF, principalement utilisés pour les démarches d'immigration et d'études au Canada et au Québec.",
importance: "Mesurent votre niveau de français sur une échelle continue avec un score chiffré. Ce sont les preuves de référence exigées par les autorités canadiennes et québécoises pour les démarches de permis d'études.",
context: "Demandés en particulier pour les démarches liées au Canada et au Québec, parfois pour des démarches administratives françaises préférant un score chiffré récent.",
requestedBy: "IRCC (Canada/Québec) via les versions TCF Canada et TEF Canada ; certains établissements français en alternative au DELF/DALF.",
level: "Licence, Master, Doctorat",
issuedBy: "Le TCF est délivré par France Éducation internationale ; le TEF par la CCI Paris Île-de-France.",
howToObtain: "S'inscrire auprès d'un centre agréé en précisant bien la version demandée (TCF Canada, TEF Canada, ou version standard).",
averageTime: "Résultats sous 2 à 3 semaines après la session.",
validity: "2 ans à partir de la date du test.",
scan: [
"Scanner l'attestation officielle indiquant le score par compétence et le niveau CECRL correspondant.",
"Vérifier que la version exacte du test est bien celle demandée par votre destination.",
"Conserver le document dans son format original."
],
tips: [
"Confirmer précisément quelle version du test votre démarche exige.",
"Anticiper le renouvellement si votre démarche s'étale sur plus de 2 ans.",
"Vérifier le score minimum exigé, les grilles de conversion différant légèrement entre TCF et TEF."
],
mistakes: [
"Passer la version standard alors que la version Canada est exigée.",
"Présenter un score expiré en pensant à tort qu'il a une validité à vie.",
"Confondre ce test avec le DELF/DALF dans un dossier universitaire classique."
],
scholarBridgeTip: "Si votre projet vise à la fois une candidature universitaire française et une démarche d'immigration canadienne, clarifiez lequel des deux tests répond à quelle démarche avant de vous inscrire."
},

{
icon: "badge-check",
category: "linguistique",
priority: "specifique",
title: "Autres certifications linguistiques",
description: "Autres tests et diplômes de langue reconnus internationalement (Cambridge English, PTE Academic, TestDaF...), utiles lorsque le test demandé n'est ni l'IELTS, ni le TOEFL, ni une certification francophone.",
importance: "Certains programmes acceptent ou exigent spécifiquement des certifications alternatives : Cambridge English pour de nombreuses universités britanniques, PTE Academic de plus en plus répandu, TestDaF pour les cursus germanophones.",
context: "Pertinent lorsque l'université liste explicitement l'un de ces tests parmi les preuves de langue acceptées, en alternative à l'IELTS ou au TOEFL.",
requestedBy: "Cambridge English (C1 Advanced, C2 Proficiency) accepté par la majorité des universités britanniques ; PTE Academic reconnu au Royaume-Uni, en Australie et en Nouvelle-Zélande ; TestDaF pour les cursus en allemand.",
level: "Licence, Master, Doctorat",
issuedBy: "Cambridge University Press & Assessment ; Pearson (PTE Academic) ; TestDaF-Institut.",
howToObtain: "S'inscrire directement auprès de l'organisme concerné. Vérifier au préalable, sur le site du programme visé, lequel de ces tests est reconnu.",
averageTime: "Environ 2 semaines pour le PTE Academic ; plusieurs semaines pour Cambridge English et TestDaF selon la session.",
validity: "Cambridge English n'expire pas ; PTE Academic valable 2 ans ; TestDaF sans expiration officielle mais un résultat récent est préféré.",
scan: [
"Scanner le certificat officiel complet, jamais une capture d'écran du résultat en ligne.",
"Vérifier que le score correspond au seuil minimum exigé.",
"Conserver le numéro de vérification ou le lien de contrôle en ligne du certificat."
],
tips: [
"Vérifier précisément quel test est accepté par le programme visé avant de s'inscrire.",
"Les qualifications Cambridge English n'expirant jamais, il peut être avantageux de les passer tôt.",
"Certains programmes acceptent une attestation de scolarité antérieure en anglais/français comme alternative."
],
mistakes: [
"Passer un test non reconnu par le programme visé.",
"Confondre les différentes qualifications Cambridge English et envoyer un niveau inférieur à celui exigé.",
"Envoyer un score PTE Academic périmé au moment du dépôt."
],
scholarBridgeTip: "Avant de passer un test alternatif à l'IELTS ou au TOEFL, confirmez son acceptation par écrit auprès du service des admissions si la liste des tests acceptés n'est pas explicite."
},

// ==========================================================
// RECHERCHE
// ==========================================================

{
icon: "flask-conical",
category: "recherche",
priority: "essentiel",
title: "Projet de recherche / Lettre d'intention",
description: "Document décrivant précisément le sujet ou l'axe de recherche envisagé, exigé principalement pour les candidatures en Master recherche et en Doctorat.",
importance: "Pour les programmes de recherche, ce document remplace ou complète la lettre de motivation classique : il prouve que vous avez déjà réfléchi à une problématique précise et compris les enjeux scientifiques du domaine — souvent le critère le plus déterminant pour un Doctorat.",
context: "Généralement demandé dès le dossier de candidature pour les programmes doctoraux et les Masters recherche.",
requestedBy: "Central dans les candidatures en Doctorat (y compris CSC, Eiffel Doctorat) ; également exigé par la plupart des Masters recherche, rarement par les Masters professionnels.",
level: "Master, Doctorat",
issuedBy: "Rédigé par le candidat ; parfois cosigné par un encadrant pressenti.",
howToObtain: "Rédiger le document en s'appuyant sur une lecture préalable des travaux du laboratoire visé, en construisant une problématique originale mais réaliste.",
averageTime: "Plusieurs semaines à quelques mois de rédaction.",
validity: "Aucune date d'expiration formelle, mais à ajuster si votre projet évolue.",
scan: [
"Rédiger un document structuré : contexte, problématique, méthodologie envisagée, objectifs.",
"Respecter la limite de pages imposée par le programme si elle existe.",
"Citer les travaux ou encadrants du laboratoire d'accueil visé lorsque c'est pertinent."
],
tips: [
"Adapter précisément le projet aux thématiques de recherche réellement actives dans l'université visée.",
"Rester réaliste sur l'ampleur du projet compte tenu de la durée du programme.",
"Faire relire le document par un enseignant ou un chercheur du domaine si possible."
],
mistakes: [
"Projet trop vague ou déconnecté des thématiques réelles du laboratoire visé.",
"Document identique envoyé à plusieurs universités sans adaptation.",
"Ambition disproportionnée par rapport à la durée réelle du programme."
],
scholarBridgeTip: "Ce document n'est pas demandé pour toutes les candidatures — il est central en recherche (Master recherche, Doctorat), rarement exigé pour une Licence ou un Master professionnel."
},

{
icon: "newspaper",
category: "recherche",
priority: "specifique",
title: "Publications",
description: "Articles scientifiques, actes de conférence ou chapitres d'ouvrage déjà publiés par le candidat, listés dans le dossier de candidature.",
importance: "Démontrent une expérience de recherche déjà validée par des pairs. Ce n'est pas un prérequis pour la grande majorité des candidats : la plupart des étudiants africains admis en Doctorat financé n'arrivent pas avec des publications.",
context: "À inclure si vous en possédez, sous forme de liste bibliographique jointe au CV ; pertinent surtout pour les candidatures en Doctorat.",
requestedBy: "Valorisé par les comités de sélection en Doctorat, jamais exigé comme condition d'éligibilité, y compris pour Commonwealth Scholarships ou Eiffel Doctorat.",
level: "Doctorat",
issuedBy: "Le candidat en est l'auteur ; la publication est validée par la revue, la conférence ou l'éditeur.",
howToObtain: "Ne se demande pas à proprement parler : lister ce que vous avez déjà publié, en indiquant la référence complète. Un travail en cours peut être mentionné comme 'en préparation' ou 'soumis'.",
averageTime: "Non applicable — il s'agit de recenser des publications existantes.",
validity: "Aucune expiration.",
scan: [
"Joindre la liste bibliographique complète au format standard.",
"Scanner ou joindre en PDF les publications elles-mêmes si le programme le demande.",
"Indiquer clairement le statut de chaque travail non encore publié."
],
tips: [
"Ne pas vous sentir désavantagé si vous n'avez aucune publication au moment de candidater.",
"Si vous avez un mémoire solide, envisager d'en tirer un article avec votre encadrant.",
"Classer vos publications par ordre de pertinence pour le projet visé."
],
mistakes: [
"Présenter comme 'publication' un simple rapport de stage ou un mémoire non publié.",
"Se décourager de candidater faute de publications.",
"Oublier de préciser le statut réel d'un travail non encore publié."
],
scholarBridgeTip: "L'absence de publications ne bloque presque jamais un dossier de Doctorat solide — misez votre énergie sur un projet de recherche précis et des lettres de recommandation fortes."
},

{
icon: "book-copy",
category: "recherche",
priority: "frequent",
title: "Mémoire",
description: "Document académique de fin de Master présentant un travail de recherche ou d'étude approfondi, propre au système universitaire francophone.",
importance: "Souvent la pièce la plus révélatrice du niveau de rigueur académique d'un candidat au Master ou en transition vers le Doctorat : il montre votre capacité à mener un travail long et argumenté de façon autonome.",
context: "Demandé pour les candidatures faisant suite à un Master recherche, en particulier pour un passage direct au Doctorat ; certains programmes ne demandent qu'un résumé.",
requestedBy: "De nombreux programmes doctoraux et Masters recherche, notamment lorsque directement lié à la thématique présentée ; CSC et Eiffel l'acceptent souvent en pièce complémentaire.",
level: "Master, Doctorat",
issuedBy: "Rédigé par le candidat, validé par un jury universitaire lors de la soutenance.",
howToObtain: "Récupérer la version finale déposée après soutenance auprès de la bibliothèque ou du secrétariat pédagogique. Si seul un résumé est demandé, en rédiger une synthèse de quelques pages.",
averageTime: "Rédaction sur toute la dernière année de Master ; obtention de la version finale : quelques jours à quelques semaines.",
validity: "Aucune date d'expiration, mais un mémoire trop ancien peut être moins représentatif de votre niveau actuel.",
scan: [
"Scanner ou exporter le mémoire complet en PDF, page de garde et validation du jury incluses.",
"Vérifier si le programme demande le document intégral ou seulement un résumé.",
"Joindre la note obtenue et la mention du jury si disponibles séparément."
],
tips: [
"Préparer si possible une version résumée en anglais, même si l'original est en français.",
"Mettre en avant le lien direct entre votre mémoire et le sujet à approfondir.",
"Demander tôt la version finale validée, les délais administratifs pouvant être longs."
],
mistakes: [
"Envoyer une version provisoire non corrigée après les remarques du jury.",
"Fournir le document intégral alors que seul un résumé était demandé.",
"Oublier de faire le lien explicite entre le mémoire et le projet de recherche présenté."
],
scholarBridgeTip: "Si votre mémoire est directement dans la continuité du projet de recherche que vous présentez pour un Doctorat, dites-le explicitement — un comité valorise la cohérence d'un parcours."
},

{
icon: "library",
category: "recherche",
priority: "specifique",
title: "Thèse",
description: "Document académique complet de Doctorat, exigé principalement pour les candidatures postdoctorales ou pour un second Doctorat.",
importance: "Rarement demandée pour une première candidature de Doctorat, mais centrale dès qu'un candidat titulaire d'un premier Doctorat postule à un poste postdoctoral ou à un second programme doctoral.",
context: "Pertinent essentiellement pour les candidats déjà titulaires d'un Doctorat souhaitant poursuivre en postdoctorat ou se réorienter.",
requestedBy: "Établissements et laboratoires d'accueil pour les candidatures postdoctorales ; certains programmes doctoraux examinant un dossier de candidat déjà docteur.",
level: "Doctorat",
issuedBy: "Rédigée par le candidat, validée par un jury de soutenance.",
howToObtain: "Récupérer l'exemplaire final déposé après soutenance auprès de la bibliothèque universitaire ou de l'école doctorale.",
averageTime: "Rédaction sur 3 à 5 ans (durée du Doctorat) ; obtention de l'exemplaire final : quelques semaines.",
validity: "Aucune date d'expiration, mais une thèse ancienne sans activité récente peut affaiblir la perception de dynamisme scientifique.",
scan: [
"Fournir le PDF de la version finale déposée et validée.",
"Joindre séparément le rapport de soutenance si demandé.",
"Vérifier si un résumé étendu en anglais est accepté à la place du document intégral."
],
tips: [
"Préparer un résumé exécutif de quelques pages en anglais.",
"Mettre en avant les publications et communications issues de la thèse.",
"Vérifier le format d'archivage exigé plutôt que d'envoyer un fichier volumineux par email."
],
mistakes: [
"Envoyer l'intégralité de la thèse alors qu'un résumé était suffisant.",
"Oublier de mentionner les publications tirées de la thèse.",
"Fournir une version non corrigée après la soutenance."
],
scholarBridgeTip: "Pour une candidature postdoctorale, une thèse ne remplace jamais un projet de recherche précis pour le poste visé — présentez toujours les deux ensemble."
},

// ==========================================================
// EXPÉRIENCE
// ==========================================================

{
icon: "clipboard-check",
category: "experience",
priority: "frequent",
title: "Attestation de stage",
description: "Document officiel confirmant qu'un stage a été effectué, avec ses dates, sa durée et les missions réalisées.",
importance: "Transforme une ligne de CV en preuve vérifiable : montre que vous avez déjà mis en pratique des connaissances théoriques. Pour les Masters professionnels, c'est souvent ce qui distingue un dossier purement académique d'un dossier montrant une vraie capacité d'adaptation au monde du travail.",
context: "Demandée surtout pour les candidatures en Master professionnel et pour toute bourse dont le formulaire comporte une section 'expérience professionnelle'.",
requestedBy: "Fréquente pour les Masters professionnels ; appréciée par certains programmes Erasmus Mundus à forte orientation professionnelle et des bourses gouvernementales africaines.",
level: "Licence professionnelle, Master professionnel",
issuedBy: "L'entreprise, l'administration ou l'organisation qui vous a accueilli en stage.",
howToObtain: "Demandez-la dès la fin du stage, pendant que le service RH ou votre encadrant a encore le dossier en tête. Elle doit être rédigée sur papier à en-tête, avec dates exactes et missions réalisées.",
averageTime: "Quelques jours à deux semaines après la fin du stage.",
validity: "Pas de limite de validité.",
scan: [
"Scanner le document en entier, y compris l'en-tête et le cachet de l'entreprise.",
"Vérifier que les dates et le nom du poste sont parfaitement lisibles.",
"Nommer le fichier clairement (exemple : Attestation_Stage_NomEntreprise.pdf).",
"Regrouper plusieurs attestations dans un seul PDF si nécessaire."
],
tips: [
"Demandez l'attestation immédiatement après le stage.",
"Vérifiez qu'elle décrit vos missions réelles, pas seulement votre titre.",
"Sélectionnez les stages les plus pertinents plutôt que d'envoyer un dossier trop volumineux.",
"Gardez toujours une copie numérique et une copie papier de l'original."
],
mistakes: [
"Attendre trop longtemps après le stage pour la demander.",
"Envoyer une simple attestation de présence sans description des missions.",
"Document non signé ou sans en-tête officiel.",
"Oublier de la traduire si nécessaire."
],
scholarBridgeTip: "Ne quittez jamais un stage sans réclamer votre attestation le jour même — c'est le document que les anciens stagiaires ont le plus de mal à récupérer une fois partis."
},

{
icon: "briefcase",
category: "experience",
priority: "frequent",
title: "Attestation d'emploi",
description: "Document officiel de votre employeur confirmant votre poste, la durée de votre emploi et vos fonctions.",
importance: "Pour un candidat ayant déjà une expérience professionnelle, prouve la maturité recherchée par certains programmes — Masters exécutifs, MBA, bourses gouvernementales valorisant les candidats déjà entrés dans la vie active.",
context: "Demandée pour les candidatures Executive ou professionnelles exigeant une expérience minimale, et pour des bourses ciblant des profils en reprise d'études.",
requestedBy: "De nombreux Executive Master et MBA l'exigent ; plusieurs bourses gouvernementales africaines et Chevening (potentiel de leadership) l'examinent avec attention.",
level: "Master professionnel, Executive Master, MBA, Doctorat en reprise d'études",
issuedBy: "Votre employeur actuel ou passé, via le service RH.",
howToObtain: "Adressez une demande écrite au service RH en précisant qu'elle est destinée à une candidature académique à l'étranger. Le document doit indiquer poste, dates et responsabilités.",
averageTime: "1 à 2 semaines selon la réactivité du service RH.",
validity: "Plusieurs mois, mais certains programmes demandent une version récente (moins de 3 mois).",
scan: [
"Scanner le document complet avec en-tête, cachet et signature visibles.",
"Vérifier que le poste et les dates correspondent exactement au CV.",
"Préparer une traduction certifiée si nécessaire."
],
tips: [
"Demandez une version récente si votre candidature s'étale sur plusieurs mois.",
"Faites préciser vos responsabilités concrètes plutôt qu'un intitulé générique.",
"Rassemblez une attestation par poste pertinent si vous avez changé plusieurs fois d'employeur."
],
mistakes: [
"Incohérence entre les dates de l'attestation et celles du CV.",
"Document non daté.",
"Demander l'attestation au dernier moment."
],
scholarBridgeTip: "Si votre programme cible valorise l'expérience professionnelle (Executive Master, MBA, bourses orientées leadership), demandez à votre employeur d'ajouter une ou deux phrases sur vos responsabilités réelles — cela pèse plus qu'un intitulé de poste seul."
},

{
icon: "heart-handshake",
category: "experience",
priority: "specifique",
title: "Certificats de bénévolat",
description: "Attestations délivrées par des associations ou organisations confirmant un engagement bénévole régulier.",
importance: "Son poids varie énormément selon le système académique visé : décisif dans les admissions anglo-saxonnes (États-Unis, Royaume-Uni, Commonwealth), presque anecdotique dans le système français.",
context: "Particulièrement pertinent pour les universités américaines/britanniques à admission holistique, et pour les bourses Commonwealth qui valorisent l'engagement civique.",
requestedBy: "Universités américaines/britanniques holistiques, Commonwealth Scholarships. Les grandes écoles françaises et bourses académiques classiques n'en tiennent généralement pas compte.",
level: "Licence, Master",
issuedBy: "L'association, l'ONG ou l'organisation communautaire concernée.",
howToObtain: "Demandez une attestation écrite au responsable de l'association précisant la nature et la durée de votre engagement.",
averageTime: "Quelques jours si l'association est facilement joignable.",
validity: "Pas de limite de validité.",
scan: [
"Scanner l'attestation avec le cachet ou la signature du responsable bien visibles.",
"Regrouper plusieurs attestations dans un seul PDF si nécessaire.",
"Vérifier que les dates et la fréquence de l'engagement sont bien précisées."
],
tips: [
"Ne cherchez pas à en obtenir uniquement pour 'remplir' un dossier destiné à une université française.",
"Pour une candidature américaine/britannique, privilégiez la régularité plutôt que le nombre d'associations.",
"Racontez dans votre essai personnel ce que cet engagement vous a appris.",
"Un engagement informel mais régulier peut souvent être attesté par un responsable local."
],
mistakes: [
"Multiplier les attestations ponctuelles au lieu de valoriser un engagement long.",
"Ignorer cette pièce pour une candidature américaine/britannique.",
"Joindre ce document à une candidature où il n'apporte aucune valeur."
],
scholarBridgeTip: "Avant de courir après des certificats de bénévolat, vérifiez d'abord le style d'admission de votre programme cible — décisif pour un dossier américain, quasiment ignoré pour une grande école française."
},

{
icon: "medal",
category: "experience",
priority: "specifique",
title: "Leadership et activités extrascolaires",
description: "Preuves de participation à des clubs étudiants, associations, activités sportives, artistiques ou à des rôles de responsabilité collective.",
importance: "Comme pour le bénévolat, son importance dépend du système académique visé. Les admissions anglo-saxonnes évaluent le 'profil complet' d'un candidat ; le style français juge presque exclusivement le dossier scolaire.",
context: "Utile pour les candidatures nord-américaines, les bourses valorisant le leadership, ou les essais personnels qui demandent de décrire un rôle de responsabilité.",
requestedBy: "Universités américaines, Chevening (potentiel de leadership explicite). Les grandes écoles françaises n'attendent pas ce type de preuve.",
level: "Licence, Master",
issuedBy: "Le club étudiant, l'association ou l'établissement scolaire concerné.",
howToObtain: "Demandez une attestation au responsable de la structure précisant votre rôle exact et sa durée. Pour un rôle informel, une lettre de soutien peut jouer un rôle équivalent.",
averageTime: "Quelques jours à deux semaines.",
validity: "Pas de limite de validité.",
scan: [
"Scanner chaque attestation séparément puis les regrouper en un seul PDF clairement nommé.",
"Vérifier que le rôle exact est mentionné, pas seulement le nom du club.",
"Préparer une brève lettre de soutien si aucune attestation formelle n'existe."
],
tips: [
"Concentrez-vous sur un ou deux engagements réels plutôt qu'une longue liste superficielle.",
"Reliez toujours l'activité à une compétence transférable dans votre essai personnel.",
"Décrivez honnêtement une activité locale sans la traduire artificiellement.",
"Ne consacrez pas un temps disproportionné à cela pour un programme de style français."
],
mistakes: [
"Gonfler artificiellement un rôle mineur en 'leadership'.",
"Envoyer ce document à une admission académique classique où il n'a aucun poids.",
"Décrire l'activité sans expliquer la compétence développée.",
"Oublier de faire confirmer par un tiers un rôle sans preuve."
],
scholarBridgeTip: "Renseignez-vous d'abord sur le style d'admission de votre destination : un comité américain ou une bourse Chevening lira attentivement cette rubrique, un jury de grande école française passera probablement dessus en quelques secondes."
},

// ==========================================================
// FINANCIER
// ==========================================================

{
icon: "banknote",
category: "financier",
priority: "frequent",
title: "Justificatifs de ressources",
description: "Ensemble de documents prouvant que vous (ou votre famille) disposez de moyens financiers suffisants pour vivre et étudier à l'étranger.",
importance: "Répond à une question concrète des services de visa : aurez-vous de quoi couvrir vos dépenses une fois sur place ? À ne pas confondre avec la preuve de financement de la bourse elle-même — c'est presque toujours une exigence de visa, indépendante de la sélection académique.",
context: "Presque systématiquement demandé lors de la constitution du dossier de visa étudiant, y compris pour des boursiers pleinement financés.",
requestedBy: "Exigé par la quasi-totalité des services consulaires, y compris pour des lauréats Fulbright, DAAD ou Eiffel à qui l'ambassade demande malgré tout une preuve de ressources de secours.",
level: "Tous niveaux",
issuedBy: "Votre banque, votre employeur, ou l'administration fiscale.",
howToObtain: "Rassemblez relevés bancaires, attestation de solde récente, bulletins de salaire ou avis d'imposition. Le service des visas précise la liste exacte des pièces acceptées.",
averageTime: "Quelques jours pour rassembler les documents existants.",
validity: "Quelques semaines à quelques mois — documents récents exigés.",
scan: [
"Scanner chaque document séparément puis les regrouper si le portail le demande.",
"Vérifier que le nom du titulaire du compte correspond à celui indiqué dans le dossier.",
"S'assurer que les montants et les dates sont parfaitement lisibles."
],
tips: [
"Vérifiez précisément la liste des pièces acceptées avant de rassembler des documents inutiles.",
"Ne préparez pas ces documents trop tôt, leur validité étant courte.",
"Associez toujours une lettre de sponsor si le financement vient d'un tiers.",
"Gardez une cohérence entre tous les documents financiers du dossier."
],
mistakes: [
"Confondre cette pièce avec la preuve de financement de la bourse elle-même.",
"Fournir des documents trop anciens.",
"Montants incohérents entre les différentes pièces du dossier.",
"Oublier ces documents en pensant qu'une bourse complète en dispense."
],
scholarBridgeTip: "Même en tant que boursier pleinement financé, ne soyez pas surpris qu'on vous demande ces justificatifs pour le visa — c'est une exigence quasi universelle, indépendante de votre bourse."
},

{
icon: "handshake",
category: "financier",
priority: "frequent",
title: "Lettre de sponsor",
description: "Lettre officielle d'une personne ou d'une organisation s'engageant formellement à financer vos études.",
importance: "Formalise un engagement financier précis là où un relevé bancaire ne montre qu'une situation ponctuelle. Décisive pour les candidatures non entièrement financées, et sert aussi de pièce de secours pour les boursiers.",
context: "Demandée lorsque le programme n'est pas intégralement financé, ou en appui d'un dossier de visa lorsque le financement vient d'un proche.",
requestedBy: "Très fréquente pour les candidatures autofinancées ou partiellement financées ; rarement exigée par les organismes de bourse entièrement financés (Eiffel, CSC) pour la sélection elle-même.",
level: "Tous niveaux",
issuedBy: "Le sponsor : un parent, un employeur, ou une administration.",
howToObtain: "Rédigez ou faites rédiger par le sponsor une lettre indiquant son identité, sa relation avec vous, le montant de l'engagement et sa durée, accompagnée de justificatifs financiers du sponsor.",
averageTime: "Quelques jours.",
validity: "Généralement pour la durée des études annoncée.",
scan: [
"Scanner la lettre signée en entier, avec les coordonnées complètes du sponsor.",
"Joindre les justificatifs financiers du sponsor dans le même envoi si demandé.",
"Vérifier que le montant mentionné correspond aux frais réels du programme."
],
tips: [
"Faites préciser la durée exacte de l'engagement.",
"Associez systématiquement cette lettre à une preuve concrète de la capacité financière du sponsor.",
"Expliquez clairement le lien si le sponsor n'est pas un parent direct.",
"Vérifiez si un format spécifique est exigé par l'ambassade."
],
mistakes: [
"Lettre sans montant précis ni durée d'engagement.",
"Absence de justificatifs financiers du sponsor.",
"Lien avec le sponsor mal expliqué.",
"Lettre non signée ou sans coordonnées vérifiables."
],
scholarBridgeTip: "Une lettre de sponsor convainc rarement seule : associez-la toujours à une preuve concrète de la capacité réelle du sponsor à tenir son engagement."
},

{
icon: "landmark",
category: "financier",
priority: "frequent",
title: "Attestation bancaire",
description: "Document officiel délivré par une banque certifiant le solde et la bonne tenue d'un compte, distinct d'un simple relevé de compte.",
importance: "Contrairement à un relevé ordinaire, c'est un document engageant émis directement par la banque — l'une des pièces financières les plus universellement reconnues, quel que soit le pays de destination.",
context: "Presque systématiquement demandée dans les dossiers de visa étudiant, en complément ou à la place des justificatifs de ressources classiques.",
requestedBy: "Quasi-totalité des services de visa étudiant dans le monde, y compris pour des candidats bénéficiant d'une bourse complète.",
level: "Tous niveaux",
issuedBy: "Votre banque (ou celle de votre sponsor).",
howToObtain: "Demandez une attestation officielle de solde à votre agence bancaire, sur papier à en-tête, avec cachet et signature.",
averageTime: "Quelques jours ouvrés, parfois le jour même en agence.",
validity: "Très courte — quelques semaines à un mois avant le dépôt du dossier de visa.",
scan: [
"Scanner l'attestation avec le cachet et la signature de la banque parfaitement lisibles.",
"Vérifier que le nom du titulaire correspond exactement à celui du dossier.",
"S'assurer que la date d'émission est bien visible."
],
tips: [
"Ne la demandez qu'au moment de constituer le dossier de visa.",
"Renseignez-vous sur le montant généralement attendu par le consulat de votre destination.",
"Associez-la à une lettre de sponsor si le compte n'est pas à votre nom.",
"Anticipez les délais bancaires."
],
mistakes: [
"Document trop ancien au moment du dépôt.",
"Confondre un relevé de compte avec l'attestation bancaire officielle.",
"Montant affiché insuffisant.",
"Nom du titulaire ne correspondant pas au candidat sans lettre de sponsor."
],
scholarBridgeTip: "Vérifiez toujours le montant minimum attendu sur le site officiel du consulat de votre destination avant de demander cette attestation — les exigences varient d'un pays à l'autre."
},

{
icon: "award",
category: "financier",
priority: "essentiel",
title: "Preuve de financement / bourse",
description: "Lettre officielle de l'organisme de bourse confirmant que vous avez été sélectionné et que votre financement est accordé.",
importance: "Une fois la bourse obtenue, c'est l'une des pièces les plus importantes du dossier : elle convainc un service de visa et une université que vos frais sont réellement couverts. Sans elle, même une admission confirmée peut rester bloquée au stade du visa.",
context: "Exigée après l'annonce des résultats, pour finaliser l'inscription et constituer le dossier de visa — jamais au moment de la candidature initiale.",
requestedBy: "Émise par l'organisme lui-même : la lettre d'attribution Fulbright, la confirmation DAAD, la lettre Eiffel, la notification Chevening, l'attestation CSC.",
level: "Tous niveaux",
issuedBy: "L'organisme ou le programme de bourse qui vous a sélectionné.",
howToObtain: "Transmise automatiquement après l'annonce des résultats. Conservez cette communication et demandez un duplicata officiel si un original est exigé.",
averageTime: "Délivrée automatiquement peu après l'annonce des résultats.",
validity: "Toute la durée du financement annoncé.",
scan: [
"Scanner la lettre officielle en entier, avec l'en-tête, le cachet et la signature de l'organisme.",
"Conserver une version numérique haute qualité, redemandée à plusieurs étapes.",
"Vérifier que le montant, la durée et le type de couverture sont bien précisés."
],
tips: [
"Demandez immédiatement une copie certifiée ou un duplicata en cas de perte.",
"Vérifiez que la lettre précise bien tout ce qui est couvert.",
"Gardez ce document accessible en permanence pendant toute la durée de vos études.",
"Contactez directement l'organisme si la lettre tarde à arriver."
],
mistakes: [
"Perdre l'unique exemplaire sans en avoir fait de copie numérique.",
"Se présenter au visa avec une simple confirmation par courriel alors qu'un original était exigé.",
"Attendre cette lettre avant de préparer le reste du dossier de visa.",
"Ne pas vérifier que tous les frais annoncés apparaissent bien dans la lettre."
],
scholarBridgeTip: "Cette lettre est probablement le document le plus précieux de tout votre parcours de boursier — numérisez-la en haute qualité dès sa réception et gardez-en plusieurs copies."
},

// ==========================================================
// ADMINISTRATIF
// ==========================================================

{
icon: "file-signature",
category: "administratif",
priority: "frequent",
title: "Traductions certifiées",
description: "Traduction officielle de vos diplômes, relevés ou actes dans la langue d'enseignement du programme visé.",
importance: "Une université ne peut évaluer un document qu'elle ne comprend pas. Dès que vos originaux ne sont pas dans la langue d'enseignement, une traduction officielle devient indispensable — c'est aussi une garantie juridique de fidélité au document source.",
context: "Demandée dès que vos documents sont rédigés dans une langue différente de celle du programme.",
requestedBy: "De nombreux systèmes européens (Allemagne, Belgique, France — DAAD, Erasmus+) demandent une traduction par un traducteur assermenté ; d'autres, notamment anglo-saxons, acceptent une traduction certifiée plus simple.",
level: "Licence, Master, Doctorat",
issuedBy: "Un traducteur assermenté inscrit auprès d'un tribunal, ou une agence de traduction certifiée reconnue.",
howToObtain: "Identifiez d'abord si le programme exige une traduction jurée ou une simple traduction certifiée. Contactez un traducteur inscrit sur la liste officielle des tribunaux ou une agence professionnelle.",
averageTime: "1 à 3 semaines selon le nombre de documents.",
validity: "Pas de limite de validité tant que le document source reste inchangé.",
scan: [
"Scanner le document original et sa traduction ensemble, dans l'ordre demandé.",
"Vérifier que le cachet, la signature et le numéro d'agrément du traducteur apparaissent clairement.",
"Regrouper original et traduction dans un seul fichier PDF si demandé."
],
tips: [
"Commencez cette démarche tôt : trouver un traducteur assermenté disponible peut prendre du temps.",
"Faites traduire tous vos documents académiques d'un coup.",
"Demandez toujours plusieurs exemplaires originaux signés.",
"Ne confondez jamais traduction et copie certifiée conforme."
],
mistakes: [
"Faire traduire un document par un proche bilingue au lieu d'un traducteur reconnu.",
"Envoyer une traduction assermentée alors qu'une certification simple suffisait, ou l'inverse.",
"Traduction incomplète, omettant une mention ou un cachet.",
"Attendre la dernière minute."
],
scholarBridgeTip: "Ne devinez jamais le format attendu : une traduction jurée acceptée par une université allemande peut être insuffisante pour une université américaine, vérifiez toujours l'exigence exacte."
},

{
icon: "copy-check",
category: "administratif",
priority: "frequent",
title: "Copies certifiées conformes",
description: "Copie d'un document original authentifiée par une autorité compétente comme étant fidèle à l'original.",
importance: "Démarche distincte d'une simple photocopie ou traduction : une autorité atteste formellement que la copie correspond à l'original, ce qui rassure les universités qui ne peuvent pas vérifier vos originaux à distance.",
context: "Demandée par certaines universités et administrations pour les diplômes, relevés ou pièces d'identité.",
requestedBy: "Certaines universités européennes et certains dossiers de visa ; la tendance générale va vers l'acceptation d'un simple scan couleur de l'original.",
level: "Licence, Master, Doctorat",
issuedBy: "La mairie, un notaire, ou parfois l'établissement émetteur du document original.",
howToObtain: "Présentez le document original à la mairie ou à un notaire, qui appose un cachet certifiant la conformité de la copie.",
averageTime: "Souvent le jour même en mairie.",
validity: "Généralement 3 à 6 mois.",
scan: [
"Scanner la copie certifiée dans son intégralité, cachet et mention de certification inclus.",
"Vérifier que la date de certification reste dans la période de validité acceptée.",
"Ne pas scanner le document original séparément si seule la copie certifiée est demandée."
],
tips: [
"Vérifiez d'abord si cette étape est réellement exigée — de nombreux programmes s'en passent désormais.",
"Faites certifier plusieurs copies en une seule visite si vous candidatez à plusieurs universités.",
"Demandez la date exacte de validité reconnue.",
"Ne confondez pas cette démarche avec une traduction certifiée."
],
mistakes: [
"Faire certifier une copie trop tôt, expirée avant la date limite.",
"Confondre photocopie simple et copie certifiée conforme.",
"Se déplacer inutilement alors que le programme accepte un simple scan.",
"Oublier de certifier la traduction en plus de l'original."
],
scholarBridgeTip: "Avant toute démarche en mairie, relisez précisément les instructions du programme : cette étape autrefois systématique disparaît progressivement de nombreux dossiers."
},

{
icon: "shield-check",
category: "administratif",
priority: "specifique",
title: "Casier judiciaire",
description: "Document officiel attestant l'absence — ou la présence — de condamnations pénales à votre nom.",
importance: "Une étape administrative standard, pas un signe de suspicion : de nombreux pays demandent cet extrait à tous les candidats à un visa de long séjour, sans distinction.",
context: "Demandé pour certaines démarches de visa de long séjour, des programmes impliquant un contact avec des mineurs, et certaines bourses gouvernementales — généralement après l'admission, pas au moment de la candidature académique.",
requestedBy: "Certains processus de visa étudiant de longue durée, certains programmes d'échange ou de bourse gouvernementale.",
level: "Licence, Master, Doctorat",
issuedBy: "Le tribunal de première instance, la police nationale, ou le ministère de la justice.",
howToObtain: "Faites la demande au tribunal, au commissariat ou via le service en ligne du ministère de la justice, muni d'une pièce d'identité.",
averageTime: "Souvent plusieurs semaines dans de nombreux systèmes administratifs africains.",
validity: "Généralement 3 mois.",
scan: [
"Scanner le document en entier, cachet officiel et signature bien visibles.",
"Vérifier que la date d'émission reste dans la période de validité acceptée.",
"Prévoir une traduction certifiée si nécessaire."
],
tips: [
"Faites cette demande dès que vous savez qu'elle sera nécessaire.",
"Ne le faites pas établir trop en avance, sa validité étant courte.",
"Vérifiez si le programme demande un document local, du pays de destination, ou les deux.",
"Contactez le service concerné pour connaître le délai réel dans votre région."
],
mistakes: [
"Attendre le dernier moment pour une démarche qui peut prendre plusieurs semaines.",
"Document trop ancien au moment du dépôt.",
"Croire ce document universellement exigé.",
"Oublier la traduction certifiée lorsque le pays de destination l'exige."
],
scholarBridgeTip: "Ce document peut sembler intimidant, mais c'est une formalité administrative ordinaire — la seule chose à anticiper vraiment, c'est le délai d'obtention, pas son contenu."
},

// ==========================================================
// SANTÉ
// ==========================================================

{
icon: "stethoscope",
category: "sante",
priority: "frequent",
title: "Certificat médical",
description: "Bilan de santé officiel, souvent exigé avant le départ pour confirmer votre aptitude à étudier à l'étranger.",
importance: "De nombreux pays et programmes de bourses (notamment les bourses gouvernementales chinoises) exigent un examen médical standardisé avant la délivrance du visa. Ce n'est généralement pas un critère de sélection de la bourse elle-même, mais une condition administrative avant le départ.",
context: "Généralement exigé après l'admission, pour la délivrance du visa — rarement une condition de sélection de la bourse elle-même.",
requestedBy: "La Chinese Government Scholarship (CSC), qui impose un examen standardisé ; également exigé par plusieurs ambassades pour le visa étudiant long séjour.",
level: "Tous niveaux",
issuedBy: "Un centre médical agréé par l'ambassade ou l'université de destination.",
howToObtain: "Identifier le centre médical agréé exigé par le pays ou l'université. Prendre rendez-vous, réaliser les examens demandés et récupérer le rapport sur le formulaire officiel.",
averageTime: "Quelques jours à 2 semaines.",
validity: "3 à 6 mois.",
scan: [
"Utiliser le formulaire officiel fourni par l'université ou l'ambassade, si un modèle précis est imposé.",
"Faire réaliser l'examen dans un centre médical agréé si la destination l'exige.",
"Scanner l'intégralité du rapport, y compris les résultats d'analyses demandés."
],
tips: [
"Vérifier tôt si votre destination impose un centre médical agréé spécifique.",
"Ce document a souvent une durée de validité courte : ne le faites pas établir trop en avance.",
"Certains programmes ne le demandent qu'après l'admission — vérifiez le calendrier exact."
],
mistakes: [
"Document établi trop tôt et expiré au moment du départ.",
"Examen réalisé dans un centre non agréé.",
"Formulaire incomplet, sans les analyses spécifiquement demandées."
],
scholarBridgeTip: "Ne préparez ce document qu'une fois votre admission confirmée, sauf si le programme l'exige explicitement dès la candidature — sa durée de validité courte le rend inutile s'il est fait trop tôt."
},

{
icon: "syringe",
category: "sante",
priority: "specifique",
title: "Carnet de vaccination",
description: "Document listant les vaccins reçus, parfois exigé comme condition d'entrée ou d'inscription dans certains pays.",
importance: "Distinct du certificat médical général, il prouve que vous êtes à jour de vaccins précis exigés par le pays de destination pour l'entrée sur le territoire ou l'inscription universitaire.",
context: "Demandé principalement après l'admission, au moment de l'inscription administrative ou de la demande de visa.",
requestedBy: "Certains pays imposant des conditions sanitaires d'entrée précises, ainsi que certaines universités pour l'inscription aux services de santé étudiants.",
level: "Tous niveaux",
issuedBy: "Un centre de vaccination agréé, un hôpital, ou votre médecin traitant.",
howToObtain: "Consulter un centre de vaccination international muni de votre carnet existant. Faire réaliser les vaccins ou rappels manquants selon les exigences du pays de destination.",
averageTime: "Immédiat si déjà à jour ; plusieurs semaines si des rappels doivent être administrés.",
validity: "Variable selon le vaccin.",
scan: [
"Scanner toutes les pages du carnet mentionnant les vaccins pertinents pour la destination.",
"Vérifier que les dates, le nom du vaccin et le cachet du centre sont lisibles.",
"Ajouter un certificat international de vaccination séparé si le pays en exige un."
],
tips: [
"Vérifier les exigences sanitaires spécifiques du pays de destination bien avant le départ.",
"Anticiper les protocoles à doses multiples, qui peuvent prendre plusieurs mois.",
"Conserver l'original en plus de la copie numérique."
],
mistakes: [
"S'y prendre trop tard pour un vaccin nécessitant plusieurs injections espacées.",
"Ignorer une exigence sanitaire spécifique du pays de destination.",
"Confondre ce document avec le certificat médical général."
],
scholarBridgeTip: "Vérifiez les exigences vaccinales de votre pays de destination dès l'admission confirmée, pas au dernier moment — certains protocoles prennent plusieurs semaines à compléter."
},

// ==========================================================
// SPÉCIFIQUE
// ==========================================================

{
icon: "palette",
category: "specifique",
priority: "specifique",
title: "Portfolio",
description: "Sélection organisée de vos travaux (œuvres, projets, dessins, maquettes) démontrant votre pratique dans un domaine artistique ou créatif.",
importance: "Pour les écoles d'art, de design et d'architecture, le portfolio est souvent plus déterminant que les relevés de notes eux-mêmes : il montre directement votre pratique et votre sensibilité.",
context: "Demandé pour toute candidature dans les filières artistiques, de design ou d'architecture, aux niveaux Licence, Master et Doctorat en pratique artistique.",
requestedBy: "Quasiment toutes les écoles d'art, de design et d'architecture dans le monde, indépendamment du financement (bourse ou inscription classique).",
level: "Licence, Master, Doctorat (pratique artistique)",
issuedBy: "Vous-même, avec éventuellement les conseils d'un enseignant.",
howToObtain: "Rassemblez vos meilleures réalisations et organisez-les selon le format demandé par l'école — PDF, plateforme en ligne, ou envoi physique.",
averageTime: "Plusieurs semaines à plusieurs mois de préparation.",
validity: "Pas de limite fixe, mais à actualiser avec vos travaux récents.",
scan: [
"Photographier ou scanner chaque œuvre dans de bonnes conditions de lumière, sans reflet ni déformation.",
"Respecter strictement le format et le nombre de pièces demandés par l'école.",
"Organiser les pièces dans un ordre cohérent, en commençant par vos travaux les plus forts.",
"Ajouter de courtes légendes pour chaque pièce si le format le permet."
],
tips: [
"Choisissez la qualité plutôt que la quantité.",
"Adaptez la sélection à l'esprit de l'école visée.",
"Faites relire l'ensemble par un enseignant ou un professionnel avant l'envoi final.",
"Prévoyez large sur le temps de préparation."
],
mistakes: [
"Portfolio trop long, qui dilue vos meilleurs travaux.",
"Photos de mauvaise qualité qui ne rendent pas justice au travail réel.",
"Ne pas respecter le format ou le nombre de pièces imposé.",
"Envoyer un portfolio générique, non adapté au programme visé."
],
scholarBridgeTip: "Un portfolio se construit dans la durée, pas dans les deux semaines précédant la date limite — commencez à photographier et archiver vos travaux dès maintenant."
},

{
icon: "code",
category: "specifique",
priority: "specifique",
title: "Portfolio GitHub",
description: "Profil en ligne rassemblant vos projets de programmation réels, utilisé pour démontrer concrètement vos compétences techniques.",
importance: "Ce n'est presque jamais une pièce officiellement exigée, mais un véritable élément différenciant pour les filières informatiques : un comité qui consulte un profil actif obtient une preuve concrète que les relevés de notes seuls ne montrent pas.",
context: "Pertinent pour toute candidature en informatique, génie logiciel ou science des données, en particulier pour des Masters compétitifs.",
requestedBy: "Rarement demandé formellement, mais fréquemment consulté de façon informelle par les comités d'admission ou les futurs encadrants.",
level: "Licence, Master, Doctorat",
issuedBy: "Vous-même — profil hébergé sur GitHub ou une alternative équivalente.",
howToObtain: "Créez un compte GitHub, publiez vos projets les plus aboutis avec un code propre et un README expliquant l'objectif de chaque projet.",
averageTime: "Quelques heures pour documenter un projet existant ; un entretien continu pour un profil convaincant.",
validity: "Pas de limite de validité — un profil vivant à tenir à jour.",
scan: [
"Aucun scan nécessaire : il s'agit d'un lien à inclure dans votre CV ou votre lettre de motivation.",
"Vérifier que le lien du profil est correctement orthographié et accessible publiquement.",
"S'assurer qu'aucune information sensible n'est publiée par erreur."
],
tips: [
"Privilégiez quelques projets aboutis et bien documentés.",
"Rédigez chaque README en anglais si vous visez des programmes internationaux.",
"Ajoutez le lien directement dans votre CV.",
"Mettez en avant les projets en lien direct avec le domaine du programme visé."
],
mistakes: [
"Profil vide ou contenant uniquement des projets de cours non modifiés.",
"Code sans aucune documentation.",
"Publier des informations sensibles dans un dépôt public.",
"Présenter ce profil comme une pièce officielle du dossier."
],
scholarBridgeTip: "Un profil GitHub soigné ne remplace aucune pièce officielle, mais il peut faire la différence entre deux candidats aux dossiers académiques similaires."
},

{
icon: "video",
category: "specifique",
priority: "specifique",
title: "Audition / vidéo de présentation",
description: "Prestation artistique filmée ou en direct, ou courte vidéo de présentation personnelle, selon le type de programme visé.",
importance: "Recouvre deux réalités distinctes : l'audition artistique (musique, théâtre, danse), exigée par la quasi-totalité des conservatoires, et la vidéo de présentation, format complémentaire utilisé par certains programmes de bourses pour évaluer votre motivation à l'oral.",
context: "L'audition est demandée pour toute candidature en école de musique, théâtre ou danse. La vidéo de présentation est demandée par certains programmes à forte composante d'entretien (Chevening, certains circuits MEXT).",
requestedBy: "Conservatoires et écoles de musique/théâtre/danse pour l'audition ; certains programmes de bourses à entretien pour la vidéo de présentation.",
level: "Licence, Master, Doctorat",
issuedBy: "Vous-même.",
howToObtain: "Pour une audition, préparez le programme imposé ou libre selon les consignes. Pour une vidéo, filmez-vous dans un cadre calme et bien éclairé, en respectant la durée maximale imposée.",
averageTime: "Plusieurs semaines de préparation pour une audition ; quelques jours pour une vidéo de présentation.",
validity: "Pas de limite de validité — à refaire si votre niveau évolue significativement.",
scan: [
"Vérifier le format technique exact demandé (durée, résolution, format de fichier) avant l'enregistrement.",
"Filmer dans un environnement calme, bien éclairé, avec un son clair.",
"Faire un test d'envoi à l'avance pour vérifier que le fichier n'est pas trop lourd."
],
tips: [
"Respectez scrupuleusement la durée imposée.",
"Pour une vidéo de présentation, préparez un plan clair plutôt que d'improviser.",
"Pour une audition, entraînez-vous plusieurs fois dans les conditions réelles.",
"Ne confondez jamais les deux formats."
],
mistakes: [
"Dépasser la durée maximale imposée par le programme.",
"Son ou image de mauvaise qualité.",
"Réciter un texte de façon visiblement mémorisée.",
"Ignorer les consignes techniques précises."
],
scholarBridgeTip: "Vérifiez toujours si le programme distingue une audition artistique d'une simple vidéo de motivation — les préparer de la même façon serait une erreur."
},

{
icon: "file-pen-line",
category: "specifique",
priority: "specifique",
title: "Échantillons d'écriture",
description: "Texte académique déjà rédigé (mémoire, dissertation, article) démontrant votre capacité d'analyse et de rédaction scientifique.",
importance: "Souvent confondu à tort avec la lettre de motivation, il s'agit en réalité d'un écrit académique déjà existant et déjà noté, qui permet de juger directement votre niveau réel de rédaction.",
context: "Demandé principalement pour les candidatures en Master ou Doctorat dans les filières de sciences humaines, sciences sociales et droit, surtout dans le système américain.",
requestedBy: "De nombreux programmes de Master et Doctorat en sciences humaines et droit du système universitaire américain ; un candidat visant ce type de programme via Fulbright doit se renseigner directement auprès de l'université d'accueil.",
level: "Master, Doctorat",
issuedBy: "Vous-même — un travail déjà réalisé et noté durant vos études.",
howToObtain: "Sélectionnez parmi vos travaux déjà rédigés celui qui démontre le mieux votre capacité d'analyse dans le domaine visé. Faites-le traduire et relire si nécessaire.",
averageTime: "Peu de temps si un travail approprié existe déjà ; plusieurs semaines s'il faut le traduire.",
validity: "Pas de limite de validité — réutilisable pour plusieurs candidatures.",
scan: [
"Enregistrer le texte au format PDF, avec une mise en page propre et lisible.",
"Ajouter une courte note préliminaire précisant le contexte du texte si le portail le permet.",
"Vérifier que la limite de pages ou de mots imposée est respectée."
],
tips: [
"Choisissez un texte en lien direct avec le domaine du programme visé.",
"Privilégiez celui qui démontre le mieux une réflexion personnelle et une structure argumentative claire.",
"Faites relire et, si besoin, retraduire le texte.",
"Ne réécrivez pas entièrement le texte pour la candidature."
],
mistakes: [
"Confondre cet échantillon avec la lettre de motivation ou le projet de recherche.",
"Envoyer un texte trop long.",
"Choisir un texte sans lien avec le domaine du programme visé.",
"Oublier de faire relire une traduction."
],
scholarBridgeTip: "Ne rédigez jamais un nouveau texte spécialement pour cette pièce : son intérêt tient justement au fait qu'elle montre votre travail réel, déjà évalué dans un cadre académique normal."
}

];
