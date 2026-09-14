/**
 * ============================================================
 * LOT 61-PORTAILS-UNIVERSITES — les 8 dernières universités
 * (données du 14 septembre 2026)
 * ============================================================
 *
 * 147 universités sur 155 portaient un portail d'admission. Ce lot
 * solde les 8 autres — et pour SEPT d'entre elles, la bonne réponse
 * n'est pas une URL.
 *
 * CE QUE LA RECHERCHE À LA SOURCE A DONNÉ
 * ----------------------------------------
 * MAROC — les trois universités publiques de la liste disent la même
 * chose, dans les mêmes termes, chacune sur son propre site :
 *   Cadi Ayyad   « Les étudiants étrangers présenteront nécessairement
 *                leur candidature par voie diplomatique » et, sans
 *                ambiguïté : « Tout dossier non transmis par l'AMCI ne
 *                sera pas pris en considération ».
 *   Hassan II    « Applications are submitted through diplomatic
 *                channels to the AMCI » ; seuls les candidats
 *                « officially proposed to the AMCI » peuvent s'inscrire.
 *   Mohammed V   « Les candidatures des étudiants internationaux [...]
 *                sont soumises par voie diplomatique à l'AMCI », qui
 *                les transmet ensuite via une plateforme de GESTION —
 *                un outil administratif AMCI/ministère vers les
 *                universités, sans URL publique, et surtout pas un
 *                portail de candidature. Ne pas le confondre.
 * Il n'existe donc AUCUN dépôt direct, et aucune plateforme marocaine
 * ouverte au candidat. Le circuit est : ambassade → AMCI → ministère,
 * qui délivre une autorisation d'inscription ; l'inscription se fait
 * ensuite sur place.
 *
 * TUNISIE — aucune des quatre n'a de rubrique de candidature pour un
 * étranger. Vérifié page par page : Sfax n'a qu'une page de MOBILITÉ
 * Erasmus+ (le piège à éviter — ce n'est pas de l'admission) et une
 * liste de formulaires VIDE ; Sousse n'a aucune rubrique d'admission au
 * niveau université (les mastères se déposent établissement par
 * établissement) ; El Manar renvoie au « Guide des Étudiants
 * Internationaux en Tunisie » du ministère ; Carthage n'a qu'une
 * plateforme de préinscription en MASTÈRE qui ne dit nulle part si les
 * étrangers y sont admis — on ne l'affirme donc pas. L'entrée est la
 * procédure nationale du ministère de l'enseignement supérieur, et une
 * université publique tunisienne (l'UVT) le dit en toutes lettres à ses
 * candidats étrangers : « Si c'est votre première inscription… déposez
 * votre candidature au niveau du ministère ».
 *
 * Ce lot confirme donc la note de mémoire `research_lot37_maghreb` :
 * « 4 unis tunisiennes sans portail ». Ce n'était pas un trou de
 * catalogue, c'était la réalité.
 *
 * SUISSE — l'IHEID est la seule des huit à avoir un portail, et il
 * n'était simplement pas renseigné.
 *
 * POURQUOI UN CHAMP VIDE NE SUFFISAIT PAS
 * ----------------------------------------
 * Un champ vide est une réponse — c'est la doctrine du lot 33 et elle
 * ne change pas. Mais une réponse MUETTE. `liensDOpportunite` n'émet
 * aucune phrase d'orientation quand le portail d'admission manque, par
 * prudence (« on n'annonce jamais une porte qu'on ne montre pas »). La
 * prudence était juste et le résultat le pire possible : un étudiant
 * accompagné vers le Maroc pouvait guetter des mois l'ouverture d'un
 * portail qui n'existe pas, et manquer la seule date qui comptait,
 * celle de l'ambassade.
 *
 * D'où le champ neuf `universities.voieAdmission`, avec un vocabulaire
 * FERMÉ de trois codes (js/voie-admission.js) :
 *   voie_diplomatique_amci          les trois marocaines
 *   procedure_nationale_ministere   les quatre tunisiennes
 *   depot_sur_place                 aucune des huit aujourd'hui — le
 *                                   code existe parce que le cas se
 *                                   présentera, pas pour être deviné ici
 *
 * CE CHAMP EST PUBLIC, CONTRAIREMENT AU PORTAIL. `applicationPortalUrl`
 * est réservé aux abonnés depuis le lot S3 : c'est une adresse qu'on
 * paie. « Le dossier passe par l'ambassade » n'est pas une adresse,
 * c'est un fait de procédure, et le cacher ne protégerait rien — ça
 * ferait perdre une année à un visiteur. Il reste donc dans
 * assets/data/catalogue.json, et `separerPortails` n'y touche pas
 * (un test le verrouille).
 *
 * La phrase s'éteint TOUTE SEULE le jour où l'une de ces universités
 * ouvrira un portail : `phraseVoieAdmission` est conditionnée à
 * l'absence de portail. Il n'y aura pas de code à retirer, et jamais de
 * phrase qui fasse douter d'un portail qui existe.
 *
 * PAS DE CHAMP `attendu` SUR LE PATCH DE L'IHEID — même raison qu'aux
 * lots 59 et 60 : `applicationPortalUrl` est absent ou vide sur ces
 * huit fiches (la carte des portails en compte 147, ces huit n'y sont
 * pas), et `diffChamps` ne peut pas satisfaire les deux cas. Lire la
 * colonne « avant -> » qu'imprime `analyser`. Les sept patches de
 * `voieAdmission` portent leur `attendu` : le champ est neuf, donc
 * `undefined` partout, et le garde bloquera si quelqu'un est passé
 * avant.
 *
 * APRÈS L'ÉCRITURE : `node scripts/lot.mjs export`, puis
 * `firebase deploy --only hosting` (le champ `voieAdmission` est
 * public) ET `firebase deploy --only functions` (le portail de l'IHEID
 * entre dans la carte privée).
 * ============================================================
 */

export const PATCHES = [

  // ---------------- Suisse — la seule des huit qui a un portail ----------------
  {
    collection: "universities",
    id: "iheid-geneve",
    champs: { applicationPortalUrl: "https://www.graduateinstitute.ch/application" },
    motif: "Lot 61 : page de candidature officielle du Graduate Institute, ouverte et verifiee : \"Complete the online application form\" en premiere etape d'un parcours en sept etapes, avec la checklist officielle (\"create your application account\"). \"Applications for our next intake (September 2027) will open in October 2026\" : le lien direct du formulaire n'est PAS publie hors campagne, c'est cette page qui l'heberge a l'ouverture — d'ou le choix de la page plutot qu'un sous-domaine. Verifie : aucun sous-domaine de candidature n'existe (intranet. et erecruit. sont l'intranet et les emplois, /admitted concerne les etudiants deja admis). Aucune URL devinee."
  },

  // ---------------- Maroc — voie diplomatique, AUCUN depot direct ----------------
  {
    collection: "universities",
    id: "universite-cadi-ayyad-marrakech",
    attendu: { voieAdmission: undefined },
    champs: { voieAdmission: "voie_diplomatique_amci" },
    motif: "Lot 61 : sa propre page AMCI le dit sans ambiguite — \"Les etudiants etrangers presenteront necessairement leur candidature par voie diplomatique\", \"L'inscription aupres d'un etablissement universitaire se fait sur presentation de l'autorisation d'inscription delivree par le Ministere\", et surtout \"Tout dossier non transmis par l'AMCI ne sera pas pris en consideration\". Aucun portail, aucun depot direct : le champ applicationPortalUrl reste vide, et c'est cette voie qui parle a sa place."
  },
  {
    collection: "universities",
    id: "universite-hassan-ii-casablanca",
    attendu: { voieAdmission: undefined },
    champs: { voieAdmission: "voie_diplomatique_amci" },
    motif: "Lot 61 : page \"International student\" de l'UH2C — \"Applications are submitted through diplomatic channels to the AMCI, according to the procedures and deadlines communicated each academic year to the Moroccan diplomatic representations abroad\" ; seuls les candidats \"officially proposed to the AMCI\" peuvent s'inscrire. A noter : l'ancienne URL /etudiant-international/ renvoie un 404, la page vivante est /en/page/international-student."
  },
  {
    collection: "universities",
    id: "universite-mohammed-v-rabat",
    attendu: { voieAdmission: undefined },
    champs: { voieAdmission: "voie_diplomatique_amci" },
    motif: "Lot 61 : page d'inscription des etudiants internationaux de l'UM5 — \"Les candidatures des etudiants internationaux a une inscription a l'Universite sont soumises par voie diplomatique a l'Agence Marocaine de Cooperation Internationale (AMCI)\", qui transmet ensuite \"via la plateforme de gestion des demandes d'inscription des etudiants internationaux\". ATTENTION, PIEGE ECARTE : cette plateforme est un outil ADMINISTRATIF entre l'AMCI, le ministere et les universites — aucune URL publique, et ce n'est PAS un portail de candidature ; la prendre pour tel aurait produit un lien inutilisable. Exception notee sur la page : les laureats d'un etablissement marocain et les changements d'inscription postulent directement aupres de l'universite."
  },

  // ---------------- Tunisie — procedure nationale du ministere ----------------
  {
    collection: "universities",
    id: "universite-de-carthage-tunis",
    attendu: { voieAdmission: undefined },
    champs: { voieAdmission: "procedure_nationale_ministere" },
    motif: "Lot 61 : le site institutionnel n'a AUCUNE rubrique de candidature pour etudiants etrangers, et son seul lien \"Admission\" pointe vers concours.ucar.rnu.tn (injoignable). PIEGE ECARTE : master.ucar.rnu.tn existe et est bien une \"Plateforme de gestion de preinscription en ligne en mastere\" (creation de compte, depot de CV et diplomes en PDF), mais elle ne dit NULLE PART si les etrangers y sont admis — on ne l'ecrit donc pas comme portail etranger. Pour une premiere inscription, l'entree reste la procedure nationale du ministere."
  },
  {
    collection: "universities",
    id: "universite-de-sfax-sfax",
    attendu: { voieAdmission: undefined },
    champs: { voieAdmission: "procedure_nationale_ministere" },
    motif: "Lot 61 : PIEGE ECARTE — la page \"Etudiants internationaux\" de l'USS ne traite que de la MOBILITE Erasmus+ et des echanges, pas de l'admission ; la prendre pour une page de candidature etait l'erreur facile. Et la page \"Liste des Formulaires en ligne\" est VIDE (no_data). Aucun portail : procedure nationale du ministere, puis dossier au service de scolarite de l'etablissement (universite.sfax@usf.tn, +216 74 244 423)."
  },
  {
    collection: "universities",
    id: "universite-de-sousse-sousse",
    attendu: { voieAdmission: undefined },
    champs: { voieAdmission: "procedure_nationale_ministere" },
    motif: "Lot 61 : la page d'accueil de l'Universite de Sousse n'a aucune rubrique d'admission ou de candidature pour etrangers (uniquement classements, Erasmus+, et des portails internes salaires/stages). Les candidatures en mastere se font etablissement par etablissement (ihecso, ismso, fsegso, isetso...rnu.tn), et l'eligibilite des etrangers n'y est pas verifiable : on ne retient donc aucune de ces URL. Entree : procedure nationale du ministere, puis depot au service des affaires estudiantines."
  },
  {
    collection: "universities",
    id: "universite-de-tunis-el-manar-tunis",
    attendu: { voieAdmission: undefined },
    champs: { voieAdmission: "procedure_nationale_ministere" },
    motif: "Lot 61 : la page \"Etudiants etrangers\" de l'UTM ne contient aucune procedure ni portail — elle renvoie uniquement au \"Guide des Etudiants Internationaux en Tunisie\" du ministere. Aucun depot en ligne cote universite : procedure nationale, puis inscription aupres de l'etablissement (utm@utm.tn, +216 71 873 366)."
  }

];
