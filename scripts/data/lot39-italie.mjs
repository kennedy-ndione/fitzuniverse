/**
 * ============================================================
 * LOT 39 — BLOC ITALIEN, première moitié (5 septembre 2026)
 * ============================================================
 *
 * Deuxième lot du chantier de fraîcheur. PATCHES uniquement.
 *
 * PÉRIMÈTRE — les cinq bourses italiennes exposées (60 à 96 profils)
 * dont la page officielle a pu être lue le 2026-09-05. Six autres du
 * même bloc sont remises à Charles pour lecture manuelle : leurs
 * sites refusent la consultation automatisée (LazioDisco, Politecnico
 * di Milano ×2) ou la page enregistrée est périmée / n'est pas la
 * bonne (Polito PhD, Sapienza PhD, Bocconi Merit Award licence).
 *
 * CE QUE CES CINQ ONT EN COMMUN, ET QUI N'ÉTAIT DIT NULLE PART :
 * leurs fiches portaient toutes « À confirmer selon l'année
 * académique » et AUCUN critère. Pour 60 à 96 profils d'étudiants,
 * le site ne disait rien.
 *
 * LA FAMILLE « DSU » (droit à l'étude régional) — EDISU Piemonte, DSU
 * Toscana : un bando annuel publié en été, clôture début septembre,
 * attribution sur conditions de REVENUS (ISEE) et de mérite, ouvert à
 * toute nationalité. C'est un mécanisme unique pour toute l'Italie ;
 * LazioDisco (remise à Charles) obéit à la même règle.
 *
 * Mêmes règles d'écriture que le lot 38 (voir son en-tête) :
 * `verifieLe` seulement sur lecture réelle ; UNE seule date complète
 * par champ `deadline`, celle qui fait foi, en premier ; les dates de
 * contexte en mois nu ; éviter « clos » quand une échéance future doit
 * primer.
 * ============================================================
 */

const LE_JOUR = "2026-09-05";

export const PATCHES = [

  // ---------- 1. DSU Toscana — OUVERTE, ferme dans deux jours ----------
  ...["unifi-bachelor", "unifi-master", "unipi-bachelor", "unipi-master"].map((id) => ({
    collection: "programs",
    id,
    attendu: { deadline: "À confirmer selon l'année académique" },
    champs: {
      deadline: "7 septembre 2026 à 13h00 (heure italienne) pour l'année 2026-2027. Le bando est disponible en français, anglais, arabe et chinois. Bourse régionale de droit à l'étude : attribuée sur conditions de revenus (attestation ISEE, « ISEE parificato » pour les étudiants non européens) et de mérite, sans condition de nationalité."
    },
    motif: "Lu sur dsu.toscana.it le 2026-09-05 : « Scadenza presentazione domanda alle ore 13:00 del 7 settembre 2026 ». La fiche disait « à confirmer » à deux jours de la clôture, pour 96 profils d'étudiants."
  })),

  {
    collection: "scholarships",
    id: "dsu-toscana-scholarship",
    champs: {
      verifieLe: LE_JOUR,
      sourceEcheance: "https://www.dsu.toscana.it/",
      periodeOuverture: "bando annuel publié en été, clôture début septembre pour l'année académique qui commence",
      exigences: []
    },
    motif: "Vérifiée le 2026-09-05. Aucune exigence du vocabulaire fermé ne s'applique : ni admission préalable, ni expérience, ni lettres — c'est une bourse sociale sur revenus et mérite."
  },

  // ---------- 2. EDISU Piemonte — clôturée hier ----------
  ...["polito-bachelor", "polito-master"].map((id) => ({
    collection: "programs",
    id,
    attendu: { deadline: "À confirmer selon l'année académique", status: "Ouverte" },
    champs: {
      status: "Fermée — bando 2026-2027 achevé",
      deadline: "Bando 2026-2027 : dépôt achevé le 4 septembre 2026 à 12h00. Le bando est publié chaque été sur clio.edisu-piemonte.it, avec une section dédiée aux étudiants internationaux. Bourse régionale de droit à l'étude, sur conditions de revenus (ISEE) et de mérite, sans condition de nationalité."
    },
    motif: "Lu sur edisu.piemonte.it le 2026-09-05 : date limite « 4 septembre 2026 à 12h00 » pour 2026/27, appel déjà publié. La fiche disait « à confirmer » et « Ouverte » le lendemain de la clôture."
  })),

  {
    collection: "scholarships",
    id: "edisu-piemonte-scholarship",
    attendu: { status: "Ouverte" },
    champs: {
      status: "Fermée — bando 2026-2027 achevé, prochain bando à l'été 2027",
      verifieLe: LE_JOUR,
      sourceEcheance: "https://www.edisu.piemonte.it/en/",
      periodeOuverture: "bando annuel publié en été, clôture début septembre (4 septembre en 2026)",
      exigences: []
    },
    motif: "Vérifiée le 2026-09-05. Même famille que DSU Toscana."
  },

  // ---------- 3. International Talents @Unibo ----------
  ...["unibo-bachelor", "unibo-master"].map((id) => ({
    collection: "programs",
    id,
    attendu: { deadline: "À confirmer selon l'année académique", status: "Ouverte" },
    champs: {
      status: "Fermée — dernier appel publié : 2025-2026",
      deadline: "Dernier appel publié sur la page officielle : année 2025-2026, dépôt achevé le 30 mai 2025 à 12h00 CEST. Aucun appel 2026-2027 n'y figure au 5 septembre. Rythme : appel au printemps, clôture fin mai. Candidature SÉPARÉE de l'admission, exclusivement via Studenti Online. Réservée aux programmes de second cycle (master) et aux titres obtenus hors du système italien ; résultat GRE exigé ; ISEE du foyer entre 16 000 et 35 000 € ; 30 ans au plus à la clôture. 6 500 € bruts par an et exonération totale des frais, pour deux ans."
    },
    motif: "Lu sur unibo.it le 2026-09-05. La page n'affiche que l'appel 2025/26 ; on le dit tel quel plutôt que de supposer un appel 2026/27. Les conditions (GRE, ISEE, âge, second cycle seulement) n'étaient nulle part — et elles excluent le programme de licence, que la base rattache pourtant à cette bourse : à trancher."
  })),

  {
    collection: "scholarships",
    id: "international-talents-unibo",
    attendu: { status: "Ouverte" },
    champs: {
      status: "Fermée — dernier appel publié 2025-2026, appel 2026-2027 non paru",
      verifieLe: LE_JOUR,
      sourceEcheance: "https://www.unibo.it/en/study/study-grants-and-subsidies/international-talents-unibo-scholarships-for-international-students/",
      periodeOuverture: "appel annuel au printemps, clôture fin mai (30 mai en 2025)",
      exigences: ["certification_langue_requise"],
      ageMax: 30,
      ageMaxNote: "30 ans au plus à la date de clôture de l'appel (page officielle Unibo, vérifiée le 5 septembre 2026)."
    },
    motif: "Vérifiée le 2026-09-05. `certification_langue_requise` faute de terme plus précis : c'est le GRE qui est exigé, un test standardisé. Limite d'âge relevée, absente de la base."
  },

  // ---------- 4. Bocconi Graduate Merit Awards ----------
  {
    collection: "programs",
    id: "bocconi-master",
    attendu: { deadline: "À confirmer selon l'année académique" },
    champs: {
      deadline: "Aucune date propre : la bourse est attribuée AUTOMATIQUEMENT à l'admission au Master of Science, sans formulaire séparé, et l'essentiel des bourses part dans les premiers rounds d'admission — candidater tôt. Exonération de 100 % des frais de scolarité, première année de MSc. Année 2026-2027 en cours."
    },
    motif: "Lu sur unibocconi.it le 2026-09-05 : « A separate application will not be required », « the majority of awards will be allocated in the first relevant rounds ». La date qui compte est celle des rounds d'admission au MSc, pas une date de bourse."
  },

  {
    collection: "scholarships",
    id: "bocconi-graduate-merit-award",
    champs: {
      verifieLe: LE_JOUR,
      sourceEcheance: "https://www.unibocconi.it/en/applying-bocconi/master-science-and-ma-programs/funding/bocconi-graduate-merit-awards-ay-2026-27",
      periodeOuverture: "suit les rounds d'admission au MSc, qui s'échelonnent d'octobre à l'été pour la rentrée suivante ; les premiers rounds concentrent les bourses",
      exigences: ["admission_prealable"]
    },
    motif: "Vérifiée le 2026-09-05. `admission_prealable` : la bourse n'existe qu'à travers l'admission."
  },

  // ---------- 5. Bocconi PhD ----------
  {
    collection: "programs",
    id: "bocconi-phd",
    attendu: { deadline: "À confirmer selon l'appel à candidatures", status: "Ouverte" },
    champs: {
      status: "Fermée — cycle 42 (2026-2027) achevé",
      deadline: "Cycle 42 (rentrée 2026) : l'appel ordinaire est achevé ; un appel complémentaire FIS (Statistics and Computer Science) s'est achevé le 18 mai 2026 à 23h59 CET, après un mois d'ouverture depuis la mi-avril. L'appel du cycle 43 (rentrée 2027) n'est pas publié au 5 septembre 2026."
    },
    motif: "Lu sur unibocconi.it/en/programs/phd/admissions le 2026-09-05. La seule date complète du texte est la CLÔTURE du dernier appel (18 mai) : écrite la première, c'est elle que la fiche affiche en « dernière échéance connue ». L'ouverture est en mois nu pour ne pas être lue à sa place — le premier jet affichait « 17 avril », la date d'ouverture, comme échéance."
  },

  {
    collection: "scholarships",
    id: "bocconi-phd-scholarship",
    attendu: { status: "Ouverte" },
    champs: {
      status: "Fermée — cycle 2026-2027 achevé, appel 2027-2028 non publié",
      verifieLe: LE_JOUR,
      sourceEcheance: "https://www.unibocconi.it/en/programs/phd/admissions",
      periodeOuverture: "appel annuel pour une rentrée en septembre ; consulter la page des admissions PhD pour le cycle suivant"
    },
    motif: "Vérifiée le 2026-09-05. Le rythme exact d'ouverture n'est pas écrit sur la page lue : la période reste volontairement vague plutôt qu'inventée."
  }

];
