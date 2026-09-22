/**
 * ============================================================
 * LOT 73 — LES PREUVES DES PROGRAMMES (22 septembre 2026, nuit)
 * ============================================================
 *
 * Dernier volet du chantier de consolidation (lots 67 à 73).
 *
 * LE DÉFAUT. 165 programmes (37 bourses) portaient une
 * `sourceVerification` à citation VIDE, écrite par les campagnes
 * automatiques du 19 et du 20 septembre : « vérifié le… » sans aucune
 * phrase source. Le lot 72 a fermé la porte (garde de lot-validate et
 * de l'écran d'admin) ; ce lot vide la pièce.
 *
 * LA MÉTHODE. Les 37 sources relues une à une le 2026-09-22 (pages,
 * PDF par pdf.js, communiqués en image lus à l'écran). Pour chaque
 * programme :
 *   - une phrase officielle qui fonde le texte → citée mot pour mot ;
 *   - rien de citable (Algérie : page vide ; UGA : page derrière
 *     authentification) → preuve RETIRÉE (null), jamais maquillée ;
 *   - ouverteVerifieeLe = 2026-09-22 partout (lecture de ce jour).
 *
 * CE QUE LA RELECTURE A CHANGÉ (au-delà de la preuve)
 *   - FERMÉS alors qu'affichés « Ouverte » : Maroc/AMCI (Sénégal :
 *     clos le 14 juillet 2026), Camões (31 juillet), Campania
 *     (10 septembre), Deutschlandstipendium Hambourg et Humboldt.
 *   - OUVERTS : Imperial President's PhD (calendrier 2027-28 publié,
 *     tours jusqu'au 1er mars 2027) ; Deutschlandstipendium Hanovre
 *     (jusqu'au 30 septembre 2026) ; Open Doors confirmé (1er nov.).
 *   - Dates trouvées là où la fiche les disait absentes : YTB-IsDB
 *     (10 janvier – 20 février 2026), NAWA Banach (8 mai 2026),
 *     Mastercard Rwanda (22 août 2026), Bocconi PhD (appel le 3 nov.).
 *   - Deux erreurs d'éligibilité : Camões disait « le Sénégal n'est
 *     pas concerné » (il l'est) ; NAWA Banach, inactive sans motif,
 *     est ouverte aux Sénégalais → réactivée, éligibilité en liste.
 *   - JICA SDGs : la page source (Philippines) n'existe plus.
 *
 * Rejeu analyserEcheance + etatCandidature au 22/09 avant livraison ;
 * `attendu` généré depuis l'export du 2026-09-22T22:04 (lot 72 compris).
 * ============================================================
 */

export const PATCHES = [
  {
    "collection": "programs",
    "id": "aix-marseille-universite-marseille__eiffel-excellence-scholarship__doctorat",
    "attendu": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié au 5 septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié à la lecture de septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "sourceVerification": {
        "url": "https://www.campusfrance.org/en/the-france-excellence-eiffel-scholarship-program",
        "citation": "To learn about the procedures and deadlines for submitting an application, contact the international relations department of a French institution via its website, by e-mail or by telephone.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de Campus France (mise à jour de décembre 2025) confirme que seuls les établissements français déposent et que la date se demande à leur service des relations internationales ; aucun appel 2027-2028 n'y figure. La date de lecture « 5 septembre 2026 », écrite en toutes lettres dans le texte, est remplacée : une date complète décorative se lit comme une échéance."
  },
  {
    "collection": "programs",
    "id": "aix-marseille-universite-marseille__eiffel-excellence-scholarship__master",
    "attendu": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié au 5 septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié à la lecture de septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "sourceVerification": {
        "url": "https://www.campusfrance.org/en/the-france-excellence-eiffel-scholarship-program",
        "citation": "To learn about the procedures and deadlines for submitting an application, contact the international relations department of a French institution via its website, by e-mail or by telephone.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de Campus France (mise à jour de décembre 2025) confirme que seuls les établissements français déposent et que la date se demande à leur service des relations internationales ; aucun appel 2027-2028 n'y figure. La date de lecture « 5 septembre 2026 », écrite en toutes lettres dans le texte, est remplacée : une date complète décorative se lit comme une échéance."
  },
  {
    "collection": "programs",
    "id": "ecole-normale-superieure-de-lyon-lyon__eiffel-excellence-scholarship__doctorat",
    "attendu": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié au 5 septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié à la lecture de septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "sourceVerification": {
        "url": "https://www.campusfrance.org/en/the-france-excellence-eiffel-scholarship-program",
        "citation": "To learn about the procedures and deadlines for submitting an application, contact the international relations department of a French institution via its website, by e-mail or by telephone.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de Campus France (mise à jour de décembre 2025) confirme que seuls les établissements français déposent et que la date se demande à leur service des relations internationales ; aucun appel 2027-2028 n'y figure. La date de lecture « 5 septembre 2026 », écrite en toutes lettres dans le texte, est remplacée : une date complète décorative se lit comme une échéance."
  },
  {
    "collection": "programs",
    "id": "ecole-normale-superieure-de-lyon-lyon__eiffel-excellence-scholarship__master",
    "attendu": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié au 5 septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié à la lecture de septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "sourceVerification": {
        "url": "https://www.campusfrance.org/en/the-france-excellence-eiffel-scholarship-program",
        "citation": "To learn about the procedures and deadlines for submitting an application, contact the international relations department of a French institution via its website, by e-mail or by telephone.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de Campus France (mise à jour de décembre 2025) confirme que seuls les établissements français déposent et que la date se demande à leur service des relations internationales ; aucun appel 2027-2028 n'y figure. La date de lecture « 5 septembre 2026 », écrite en toutes lettres dans le texte, est remplacée : une date complète décorative se lit comme une échéance."
  },
  {
    "collection": "programs",
    "id": "ecole-polytechnique-palaiseau__eiffel-excellence-scholarship__doctorat",
    "attendu": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié au 5 septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié à la lecture de septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "sourceVerification": {
        "url": "https://www.campusfrance.org/en/the-france-excellence-eiffel-scholarship-program",
        "citation": "To learn about the procedures and deadlines for submitting an application, contact the international relations department of a French institution via its website, by e-mail or by telephone.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de Campus France (mise à jour de décembre 2025) confirme que seuls les établissements français déposent et que la date se demande à leur service des relations internationales ; aucun appel 2027-2028 n'y figure. La date de lecture « 5 septembre 2026 », écrite en toutes lettres dans le texte, est remplacée : une date complète décorative se lit comme une échéance."
  },
  {
    "collection": "programs",
    "id": "ecole-polytechnique-palaiseau__eiffel-excellence-scholarship__master",
    "attendu": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié au 5 septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié à la lecture de septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "sourceVerification": {
        "url": "https://www.campusfrance.org/en/the-france-excellence-eiffel-scholarship-program",
        "citation": "To learn about the procedures and deadlines for submitting an application, contact the international relations department of a French institution via its website, by e-mail or by telephone.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de Campus France (mise à jour de décembre 2025) confirme que seuls les établissements français déposent et que la date se demande à leur service des relations internationales ; aucun appel 2027-2028 n'y figure. La date de lecture « 5 septembre 2026 », écrite en toutes lettres dans le texte, est remplacée : une date complète décorative se lit comme une échéance."
  },
  {
    "collection": "programs",
    "id": "essec-business-school-cergy__eiffel-excellence-scholarship__doctorat",
    "attendu": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié au 5 septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié à la lecture de septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "sourceVerification": {
        "url": "https://www.campusfrance.org/en/the-france-excellence-eiffel-scholarship-program",
        "citation": "To learn about the procedures and deadlines for submitting an application, contact the international relations department of a French institution via its website, by e-mail or by telephone.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de Campus France (mise à jour de décembre 2025) confirme que seuls les établissements français déposent et que la date se demande à leur service des relations internationales ; aucun appel 2027-2028 n'y figure. La date de lecture « 5 septembre 2026 », écrite en toutes lettres dans le texte, est remplacée : une date complète décorative se lit comme une échéance."
  },
  {
    "collection": "programs",
    "id": "essec-business-school-cergy__eiffel-excellence-scholarship__master",
    "attendu": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié au 5 septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié à la lecture de septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "sourceVerification": {
        "url": "https://www.campusfrance.org/en/the-france-excellence-eiffel-scholarship-program",
        "citation": "To learn about the procedures and deadlines for submitting an application, contact the international relations department of a French institution via its website, by e-mail or by telephone.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de Campus France (mise à jour de décembre 2025) confirme que seuls les établissements français déposent et que la date se demande à leur service des relations internationales ; aucun appel 2027-2028 n'y figure. La date de lecture « 5 septembre 2026 », écrite en toutes lettres dans le texte, est remplacée : une date complète décorative se lit comme une échéance."
  },
  {
    "collection": "programs",
    "id": "hec-paris-jouy-en-josas__eiffel-excellence-scholarship__doctorat",
    "attendu": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié au 5 septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié à la lecture de septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "sourceVerification": {
        "url": "https://www.campusfrance.org/en/the-france-excellence-eiffel-scholarship-program",
        "citation": "To learn about the procedures and deadlines for submitting an application, contact the international relations department of a French institution via its website, by e-mail or by telephone.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de Campus France (mise à jour de décembre 2025) confirme que seuls les établissements français déposent et que la date se demande à leur service des relations internationales ; aucun appel 2027-2028 n'y figure. La date de lecture « 5 septembre 2026 », écrite en toutes lettres dans le texte, est remplacée : une date complète décorative se lit comme une échéance."
  },
  {
    "collection": "programs",
    "id": "hec-paris-jouy-en-josas__eiffel-excellence-scholarship__master",
    "attendu": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié au 5 septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié à la lecture de septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "sourceVerification": {
        "url": "https://www.campusfrance.org/en/the-france-excellence-eiffel-scholarship-program",
        "citation": "To learn about the procedures and deadlines for submitting an application, contact the international relations department of a French institution via its website, by e-mail or by telephone.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de Campus France (mise à jour de décembre 2025) confirme que seuls les établissements français déposent et que la date se demande à leur service des relations internationales ; aucun appel 2027-2028 n'y figure. La date de lecture « 5 septembre 2026 », écrite en toutes lettres dans le texte, est remplacée : une date complète décorative se lit comme une échéance."
  },
  {
    "collection": "programs",
    "id": "insa-lyon-villeurbanne__eiffel-excellence-scholarship__doctorat",
    "attendu": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié au 5 septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié à la lecture de septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "sourceVerification": {
        "url": "https://www.campusfrance.org/en/the-france-excellence-eiffel-scholarship-program",
        "citation": "To learn about the procedures and deadlines for submitting an application, contact the international relations department of a French institution via its website, by e-mail or by telephone.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de Campus France (mise à jour de décembre 2025) confirme que seuls les établissements français déposent et que la date se demande à leur service des relations internationales ; aucun appel 2027-2028 n'y figure. La date de lecture « 5 septembre 2026 », écrite en toutes lettres dans le texte, est remplacée : une date complète décorative se lit comme une échéance."
  },
  {
    "collection": "programs",
    "id": "insa-lyon-villeurbanne__eiffel-excellence-scholarship__master",
    "attendu": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié au 5 septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié à la lecture de septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "sourceVerification": {
        "url": "https://www.campusfrance.org/en/the-france-excellence-eiffel-scholarship-program",
        "citation": "To learn about the procedures and deadlines for submitting an application, contact the international relations department of a French institution via its website, by e-mail or by telephone.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de Campus France (mise à jour de décembre 2025) confirme que seuls les établissements français déposent et que la date se demande à leur service des relations internationales ; aucun appel 2027-2028 n'y figure. La date de lecture « 5 septembre 2026 », écrite en toutes lettres dans le texte, est remplacée : une date complète décorative se lit comme une échéance."
  },
  {
    "collection": "programs",
    "id": "mines-paris-psl-paris__eiffel-excellence-scholarship__doctorat",
    "attendu": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié au 5 septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié à la lecture de septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "sourceVerification": {
        "url": "https://www.campusfrance.org/en/the-france-excellence-eiffel-scholarship-program",
        "citation": "To learn about the procedures and deadlines for submitting an application, contact the international relations department of a French institution via its website, by e-mail or by telephone.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de Campus France (mise à jour de décembre 2025) confirme que seuls les établissements français déposent et que la date se demande à leur service des relations internationales ; aucun appel 2027-2028 n'y figure. La date de lecture « 5 septembre 2026 », écrite en toutes lettres dans le texte, est remplacée : une date complète décorative se lit comme une échéance."
  },
  {
    "collection": "programs",
    "id": "mines-paris-psl-paris__eiffel-excellence-scholarship__master",
    "attendu": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié au 5 septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié à la lecture de septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "sourceVerification": {
        "url": "https://www.campusfrance.org/en/the-france-excellence-eiffel-scholarship-program",
        "citation": "To learn about the procedures and deadlines for submitting an application, contact the international relations department of a French institution via its website, by e-mail or by telephone.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de Campus France (mise à jour de décembre 2025) confirme que seuls les établissements français déposent et que la date se demande à leur service des relations internationales ; aucun appel 2027-2028 n'y figure. La date de lecture « 5 septembre 2026 », écrite en toutes lettres dans le texte, est remplacée : une date complète décorative se lit comme une échéance."
  },
  {
    "collection": "programs",
    "id": "nantes-universite-nantes__eiffel-excellence-scholarship__doctorat",
    "attendu": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié au 5 septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié à la lecture de septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "sourceVerification": {
        "url": "https://www.campusfrance.org/en/the-france-excellence-eiffel-scholarship-program",
        "citation": "To learn about the procedures and deadlines for submitting an application, contact the international relations department of a French institution via its website, by e-mail or by telephone.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de Campus France (mise à jour de décembre 2025) confirme que seuls les établissements français déposent et que la date se demande à leur service des relations internationales ; aucun appel 2027-2028 n'y figure. La date de lecture « 5 septembre 2026 », écrite en toutes lettres dans le texte, est remplacée : une date complète décorative se lit comme une échéance."
  },
  {
    "collection": "programs",
    "id": "nantes-universite-nantes__eiffel-excellence-scholarship__master",
    "attendu": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié au 5 septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié à la lecture de septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "sourceVerification": {
        "url": "https://www.campusfrance.org/en/the-france-excellence-eiffel-scholarship-program",
        "citation": "To learn about the procedures and deadlines for submitting an application, contact the international relations department of a French institution via its website, by e-mail or by telephone.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de Campus France (mise à jour de décembre 2025) confirme que seuls les établissements français déposent et que la date se demande à leur service des relations internationales ; aucun appel 2027-2028 n'y figure. La date de lecture « 5 septembre 2026 », écrite en toutes lettres dans le texte, est remplacée : une date complète décorative se lit comme une échéance."
  },
  {
    "collection": "programs",
    "id": "sciences-po-paris__eiffel-excellence-scholarship",
    "attendu": {
      "deadline": "Campagne 2026-2027 CLOSE (dépôt clos le 29 octobre 2025). Le calendrier 2027-2028 n'est pas publié au 5 septembre 2026. Comme partout pour l'Eiffel, la date est fixée par l'établissement et non par Campus France.",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Campagne 2026-2027 CLOSE (dépôt clos le 29 octobre 2025). Le calendrier 2027-2028 n'est pas publié à la lecture de septembre 2026. Comme partout pour l'Eiffel, la date est fixée par l'établissement et non par Campus France.",
      "sourceVerification": {
        "url": "https://www.campusfrance.org/en/the-france-excellence-eiffel-scholarship-program",
        "citation": "To learn about the procedures and deadlines for submitting an application, contact the international relations department of a French institution via its website, by e-mail or by telephone.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de Campus France (mise à jour de décembre 2025) confirme que seuls les établissements français déposent et que la date se demande à leur service des relations internationales ; aucun appel 2027-2028 n'y figure. La date de lecture « 5 septembre 2026 », écrite en toutes lettres dans le texte, est remplacée : une date complète décorative se lit comme une échéance."
  },
  {
    "collection": "programs",
    "id": "sorbonne-universite-paris__eiffel-excellence-scholarship",
    "attendu": {
      "deadline": "Campagne 2026-2027 CLOSE : Sorbonne Université demandait les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master), et précise de ne PAS tenir compte de la date affichée par Campus France. Le calendrier 2027-2028 n'est pas publié au 5 septembre 2026.",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Campagne 2026-2027 CLOSE : Sorbonne Université demandait les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master), et précise de ne PAS tenir compte de la date affichée par Campus France. Le calendrier 2027-2028 n'est pas publié à la lecture de septembre 2026.",
      "sourceVerification": {
        "url": "https://www.campusfrance.org/en/the-france-excellence-eiffel-scholarship-program",
        "citation": "To learn about the procedures and deadlines for submitting an application, contact the international relations department of a French institution via its website, by e-mail or by telephone.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de Campus France (mise à jour de décembre 2025) confirme que seuls les établissements français déposent et que la date se demande à leur service des relations internationales ; aucun appel 2027-2028 n'y figure. La date de lecture « 5 septembre 2026 », écrite en toutes lettres dans le texte, est remplacée : une date complète décorative se lit comme une échéance."
  },
  {
    "collection": "programs",
    "id": "universite-claude-bernard-lyon-1-villeurbanne__eiffel-excellence-scholarship__doctorat",
    "attendu": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié au 5 septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié à la lecture de septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "sourceVerification": {
        "url": "https://www.campusfrance.org/en/the-france-excellence-eiffel-scholarship-program",
        "citation": "To learn about the procedures and deadlines for submitting an application, contact the international relations department of a French institution via its website, by e-mail or by telephone.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de Campus France (mise à jour de décembre 2025) confirme que seuls les établissements français déposent et que la date se demande à leur service des relations internationales ; aucun appel 2027-2028 n'y figure. La date de lecture « 5 septembre 2026 », écrite en toutes lettres dans le texte, est remplacée : une date complète décorative se lit comme une échéance."
  },
  {
    "collection": "programs",
    "id": "universite-claude-bernard-lyon-1-villeurbanne__eiffel-excellence-scholarship__master",
    "attendu": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié au 5 septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié à la lecture de septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "sourceVerification": {
        "url": "https://www.campusfrance.org/en/the-france-excellence-eiffel-scholarship-program",
        "citation": "To learn about the procedures and deadlines for submitting an application, contact the international relations department of a French institution via its website, by e-mail or by telephone.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de Campus France (mise à jour de décembre 2025) confirme que seuls les établissements français déposent et que la date se demande à leur service des relations internationales ; aucun appel 2027-2028 n'y figure. La date de lecture « 5 septembre 2026 », écrite en toutes lettres dans le texte, est remplacée : une date complète décorative se lit comme une échéance."
  },
  {
    "collection": "programs",
    "id": "universite-cote-d-azur-nice__eiffel-excellence-scholarship__doctorat",
    "attendu": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié au 5 septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié à la lecture de septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "sourceVerification": {
        "url": "https://www.campusfrance.org/en/the-france-excellence-eiffel-scholarship-program",
        "citation": "To learn about the procedures and deadlines for submitting an application, contact the international relations department of a French institution via its website, by e-mail or by telephone.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de Campus France (mise à jour de décembre 2025) confirme que seuls les établissements français déposent et que la date se demande à leur service des relations internationales ; aucun appel 2027-2028 n'y figure. La date de lecture « 5 septembre 2026 », écrite en toutes lettres dans le texte, est remplacée : une date complète décorative se lit comme une échéance."
  },
  {
    "collection": "programs",
    "id": "universite-cote-d-azur-nice__eiffel-excellence-scholarship__master",
    "attendu": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié au 5 septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié à la lecture de septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "sourceVerification": {
        "url": "https://www.campusfrance.org/en/the-france-excellence-eiffel-scholarship-program",
        "citation": "To learn about the procedures and deadlines for submitting an application, contact the international relations department of a French institution via its website, by e-mail or by telephone.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de Campus France (mise à jour de décembre 2025) confirme que seuls les établissements français déposent et que la date se demande à leur service des relations internationales ; aucun appel 2027-2028 n'y figure. La date de lecture « 5 septembre 2026 », écrite en toutes lettres dans le texte, est remplacée : une date complète décorative se lit comme une échéance."
  },
  {
    "collection": "programs",
    "id": "universite-de-bordeaux-bordeaux__eiffel-excellence-scholarship__doctorat",
    "attendu": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié au 5 septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié à la lecture de septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "sourceVerification": {
        "url": "https://www.campusfrance.org/en/the-france-excellence-eiffel-scholarship-program",
        "citation": "To learn about the procedures and deadlines for submitting an application, contact the international relations department of a French institution via its website, by e-mail or by telephone.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de Campus France (mise à jour de décembre 2025) confirme que seuls les établissements français déposent et que la date se demande à leur service des relations internationales ; aucun appel 2027-2028 n'y figure. La date de lecture « 5 septembre 2026 », écrite en toutes lettres dans le texte, est remplacée : une date complète décorative se lit comme une échéance."
  },
  {
    "collection": "programs",
    "id": "universite-de-bordeaux-bordeaux__eiffel-excellence-scholarship__master",
    "attendu": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié au 5 septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié à la lecture de septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "sourceVerification": {
        "url": "https://www.campusfrance.org/en/the-france-excellence-eiffel-scholarship-program",
        "citation": "To learn about the procedures and deadlines for submitting an application, contact the international relations department of a French institution via its website, by e-mail or by telephone.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de Campus France (mise à jour de décembre 2025) confirme que seuls les établissements français déposent et que la date se demande à leur service des relations internationales ; aucun appel 2027-2028 n'y figure. La date de lecture « 5 septembre 2026 », écrite en toutes lettres dans le texte, est remplacée : une date complète décorative se lit comme une échéance."
  },
  {
    "collection": "programs",
    "id": "universite-de-lille-lille__eiffel-excellence-scholarship__doctorat",
    "attendu": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié au 5 septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié à la lecture de septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "sourceVerification": {
        "url": "https://www.campusfrance.org/en/the-france-excellence-eiffel-scholarship-program",
        "citation": "To learn about the procedures and deadlines for submitting an application, contact the international relations department of a French institution via its website, by e-mail or by telephone.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de Campus France (mise à jour de décembre 2025) confirme que seuls les établissements français déposent et que la date se demande à leur service des relations internationales ; aucun appel 2027-2028 n'y figure. La date de lecture « 5 septembre 2026 », écrite en toutes lettres dans le texte, est remplacée : une date complète décorative se lit comme une échéance."
  },
  {
    "collection": "programs",
    "id": "universite-de-lille-lille__eiffel-excellence-scholarship__master",
    "attendu": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié au 5 septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié à la lecture de septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "sourceVerification": {
        "url": "https://www.campusfrance.org/en/the-france-excellence-eiffel-scholarship-program",
        "citation": "To learn about the procedures and deadlines for submitting an application, contact the international relations department of a French institution via its website, by e-mail or by telephone.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de Campus France (mise à jour de décembre 2025) confirme que seuls les établissements français déposent et que la date se demande à leur service des relations internationales ; aucun appel 2027-2028 n'y figure. La date de lecture « 5 septembre 2026 », écrite en toutes lettres dans le texte, est remplacée : une date complète décorative se lit comme une échéance."
  },
  {
    "collection": "programs",
    "id": "universite-de-lorraine-nancy__eiffel-excellence-scholarship__doctorat",
    "attendu": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié au 5 septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié à la lecture de septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "sourceVerification": {
        "url": "https://www.campusfrance.org/en/the-france-excellence-eiffel-scholarship-program",
        "citation": "To learn about the procedures and deadlines for submitting an application, contact the international relations department of a French institution via its website, by e-mail or by telephone.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de Campus France (mise à jour de décembre 2025) confirme que seuls les établissements français déposent et que la date se demande à leur service des relations internationales ; aucun appel 2027-2028 n'y figure. La date de lecture « 5 septembre 2026 », écrite en toutes lettres dans le texte, est remplacée : une date complète décorative se lit comme une échéance."
  },
  {
    "collection": "programs",
    "id": "universite-de-lorraine-nancy__eiffel-excellence-scholarship__master",
    "attendu": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié au 5 septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié à la lecture de septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "sourceVerification": {
        "url": "https://www.campusfrance.org/en/the-france-excellence-eiffel-scholarship-program",
        "citation": "To learn about the procedures and deadlines for submitting an application, contact the international relations department of a French institution via its website, by e-mail or by telephone.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de Campus France (mise à jour de décembre 2025) confirme que seuls les établissements français déposent et que la date se demande à leur service des relations internationales ; aucun appel 2027-2028 n'y figure. La date de lecture « 5 septembre 2026 », écrite en toutes lettres dans le texte, est remplacée : une date complète décorative se lit comme une échéance."
  },
  {
    "collection": "programs",
    "id": "universite-de-rennes-rennes__eiffel-excellence-scholarship__doctorat",
    "attendu": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié au 5 septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié à la lecture de septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "sourceVerification": {
        "url": "https://www.campusfrance.org/en/the-france-excellence-eiffel-scholarship-program",
        "citation": "To learn about the procedures and deadlines for submitting an application, contact the international relations department of a French institution via its website, by e-mail or by telephone.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de Campus France (mise à jour de décembre 2025) confirme que seuls les établissements français déposent et que la date se demande à leur service des relations internationales ; aucun appel 2027-2028 n'y figure. La date de lecture « 5 septembre 2026 », écrite en toutes lettres dans le texte, est remplacée : une date complète décorative se lit comme une échéance."
  },
  {
    "collection": "programs",
    "id": "universite-de-rennes-rennes__eiffel-excellence-scholarship__master",
    "attendu": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié au 5 septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié à la lecture de septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "sourceVerification": {
        "url": "https://www.campusfrance.org/en/the-france-excellence-eiffel-scholarship-program",
        "citation": "To learn about the procedures and deadlines for submitting an application, contact the international relations department of a French institution via its website, by e-mail or by telephone.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de Campus France (mise à jour de décembre 2025) confirme que seuls les établissements français déposent et que la date se demande à leur service des relations internationales ; aucun appel 2027-2028 n'y figure. La date de lecture « 5 septembre 2026 », écrite en toutes lettres dans le texte, est remplacée : une date complète décorative se lit comme une échéance."
  },
  {
    "collection": "programs",
    "id": "universite-de-strasbourg-strasbourg__eiffel-excellence-scholarship__doctorat",
    "attendu": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié au 5 septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié à la lecture de septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "sourceVerification": {
        "url": "https://www.campusfrance.org/en/the-france-excellence-eiffel-scholarship-program",
        "citation": "To learn about the procedures and deadlines for submitting an application, contact the international relations department of a French institution via its website, by e-mail or by telephone.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de Campus France (mise à jour de décembre 2025) confirme que seuls les établissements français déposent et que la date se demande à leur service des relations internationales ; aucun appel 2027-2028 n'y figure. La date de lecture « 5 septembre 2026 », écrite en toutes lettres dans le texte, est remplacée : une date complète décorative se lit comme une échéance."
  },
  {
    "collection": "programs",
    "id": "universite-de-strasbourg-strasbourg__eiffel-excellence-scholarship__master",
    "attendu": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié au 5 septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié à la lecture de septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "sourceVerification": {
        "url": "https://www.campusfrance.org/en/the-france-excellence-eiffel-scholarship-program",
        "citation": "To learn about the procedures and deadlines for submitting an application, contact the international relations department of a French institution via its website, by e-mail or by telephone.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de Campus France (mise à jour de décembre 2025) confirme que seuls les établissements français déposent et que la date se demande à leur service des relations internationales ; aucun appel 2027-2028 n'y figure. La date de lecture « 5 septembre 2026 », écrite en toutes lettres dans le texte, est remplacée : une date complète décorative se lit comme une échéance."
  },
  {
    "collection": "programs",
    "id": "universite-de-toulouse-toulouse__eiffel-excellence-scholarship__doctorat",
    "attendu": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié au 5 septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié à la lecture de septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "sourceVerification": {
        "url": "https://www.campusfrance.org/en/the-france-excellence-eiffel-scholarship-program",
        "citation": "To learn about the procedures and deadlines for submitting an application, contact the international relations department of a French institution via its website, by e-mail or by telephone.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de Campus France (mise à jour de décembre 2025) confirme que seuls les établissements français déposent et que la date se demande à leur service des relations internationales ; aucun appel 2027-2028 n'y figure. La date de lecture « 5 septembre 2026 », écrite en toutes lettres dans le texte, est remplacée : une date complète décorative se lit comme une échéance."
  },
  {
    "collection": "programs",
    "id": "universite-de-toulouse-toulouse__eiffel-excellence-scholarship__master",
    "attendu": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié au 5 septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié à la lecture de septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "sourceVerification": {
        "url": "https://www.campusfrance.org/en/the-france-excellence-eiffel-scholarship-program",
        "citation": "To learn about the procedures and deadlines for submitting an application, contact the international relations department of a French institution via its website, by e-mail or by telephone.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de Campus France (mise à jour de décembre 2025) confirme que seuls les établissements français déposent et que la date se demande à leur service des relations internationales ; aucun appel 2027-2028 n'y figure. La date de lecture « 5 septembre 2026 », écrite en toutes lettres dans le texte, est remplacée : une date complète décorative se lit comme une échéance."
  },
  {
    "collection": "programs",
    "id": "universite-grenoble-alpes-grenoble__eiffel-excellence-scholarship__doctorat",
    "attendu": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié au 5 septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié à la lecture de septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "sourceVerification": {
        "url": "https://www.campusfrance.org/en/the-france-excellence-eiffel-scholarship-program",
        "citation": "To learn about the procedures and deadlines for submitting an application, contact the international relations department of a French institution via its website, by e-mail or by telephone.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de Campus France (mise à jour de décembre 2025) confirme que seuls les établissements français déposent et que la date se demande à leur service des relations internationales ; aucun appel 2027-2028 n'y figure. La date de lecture « 5 septembre 2026 », écrite en toutes lettres dans le texte, est remplacée : une date complète décorative se lit comme une échéance."
  },
  {
    "collection": "programs",
    "id": "universite-grenoble-alpes-grenoble__eiffel-excellence-scholarship__master",
    "attendu": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié au 5 septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié à la lecture de septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "sourceVerification": {
        "url": "https://www.campusfrance.org/en/the-france-excellence-eiffel-scholarship-program",
        "citation": "To learn about the procedures and deadlines for submitting an application, contact the international relations department of a French institution via its website, by e-mail or by telephone.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de Campus France (mise à jour de décembre 2025) confirme que seuls les établissements français déposent et que la date se demande à leur service des relations internationales ; aucun appel 2027-2028 n'y figure. La date de lecture « 5 septembre 2026 », écrite en toutes lettres dans le texte, est remplacée : une date complète décorative se lit comme une échéance."
  },
  {
    "collection": "programs",
    "id": "universite-paris-1-pantheon-sorbonne-paris__eiffel-excellence-scholarship__doctorat",
    "attendu": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié au 5 septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié à la lecture de septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "sourceVerification": {
        "url": "https://www.campusfrance.org/en/the-france-excellence-eiffel-scholarship-program",
        "citation": "To learn about the procedures and deadlines for submitting an application, contact the international relations department of a French institution via its website, by e-mail or by telephone.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de Campus France (mise à jour de décembre 2025) confirme que seuls les établissements français déposent et que la date se demande à leur service des relations internationales ; aucun appel 2027-2028 n'y figure. La date de lecture « 5 septembre 2026 », écrite en toutes lettres dans le texte, est remplacée : une date complète décorative se lit comme une échéance."
  },
  {
    "collection": "programs",
    "id": "universite-paris-1-pantheon-sorbonne-paris__eiffel-excellence-scholarship__master",
    "attendu": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié au 5 septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié à la lecture de septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "sourceVerification": {
        "url": "https://www.campusfrance.org/en/the-france-excellence-eiffel-scholarship-program",
        "citation": "To learn about the procedures and deadlines for submitting an application, contact the international relations department of a French institution via its website, by e-mail or by telephone.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de Campus France (mise à jour de décembre 2025) confirme que seuls les établissements français déposent et que la date se demande à leur service des relations internationales ; aucun appel 2027-2028 n'y figure. La date de lecture « 5 septembre 2026 », écrite en toutes lettres dans le texte, est remplacée : une date complète décorative se lit comme une échéance."
  },
  {
    "collection": "programs",
    "id": "universite-paris-cite-paris__eiffel-excellence-scholarship__doctorat",
    "attendu": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié au 5 septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié à la lecture de septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "sourceVerification": {
        "url": "https://www.campusfrance.org/en/the-france-excellence-eiffel-scholarship-program",
        "citation": "To learn about the procedures and deadlines for submitting an application, contact the international relations department of a French institution via its website, by e-mail or by telephone.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de Campus France (mise à jour de décembre 2025) confirme que seuls les établissements français déposent et que la date se demande à leur service des relations internationales ; aucun appel 2027-2028 n'y figure. La date de lecture « 5 septembre 2026 », écrite en toutes lettres dans le texte, est remplacée : une date complète décorative se lit comme une échéance."
  },
  {
    "collection": "programs",
    "id": "universite-paris-cite-paris__eiffel-excellence-scholarship__master",
    "attendu": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié au 5 septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié à la lecture de septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "sourceVerification": {
        "url": "https://www.campusfrance.org/en/the-france-excellence-eiffel-scholarship-program",
        "citation": "To learn about the procedures and deadlines for submitting an application, contact the international relations department of a French institution via its website, by e-mail or by telephone.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de Campus France (mise à jour de décembre 2025) confirme que seuls les établissements français déposent et que la date se demande à leur service des relations internationales ; aucun appel 2027-2028 n'y figure. La date de lecture « 5 septembre 2026 », écrite en toutes lettres dans le texte, est remplacée : une date complète décorative se lit comme une échéance."
  },
  {
    "collection": "programs",
    "id": "universite-paris-dauphine-psl-paris__eiffel-excellence-scholarship__doctorat",
    "attendu": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié au 5 septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié à la lecture de septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "sourceVerification": {
        "url": "https://www.campusfrance.org/en/the-france-excellence-eiffel-scholarship-program",
        "citation": "To learn about the procedures and deadlines for submitting an application, contact the international relations department of a French institution via its website, by e-mail or by telephone.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de Campus France (mise à jour de décembre 2025) confirme que seuls les établissements français déposent et que la date se demande à leur service des relations internationales ; aucun appel 2027-2028 n'y figure. La date de lecture « 5 septembre 2026 », écrite en toutes lettres dans le texte, est remplacée : une date complète décorative se lit comme une échéance."
  },
  {
    "collection": "programs",
    "id": "universite-paris-dauphine-psl-paris__eiffel-excellence-scholarship__master",
    "attendu": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié au 5 septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié à la lecture de septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "sourceVerification": {
        "url": "https://www.campusfrance.org/en/the-france-excellence-eiffel-scholarship-program",
        "citation": "To learn about the procedures and deadlines for submitting an application, contact the international relations department of a French institution via its website, by e-mail or by telephone.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de Campus France (mise à jour de décembre 2025) confirme que seuls les établissements français déposent et que la date se demande à leur service des relations internationales ; aucun appel 2027-2028 n'y figure. La date de lecture « 5 septembre 2026 », écrite en toutes lettres dans le texte, est remplacée : une date complète décorative se lit comme une échéance."
  },
  {
    "collection": "programs",
    "id": "universite-paris-saclay-orsay__eiffel-excellence-scholarship__doctorat",
    "attendu": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié au 5 septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié à la lecture de septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "sourceVerification": {
        "url": "https://www.campusfrance.org/en/the-france-excellence-eiffel-scholarship-program",
        "citation": "To learn about the procedures and deadlines for submitting an application, contact the international relations department of a French institution via its website, by e-mail or by telephone.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de Campus France (mise à jour de décembre 2025) confirme que seuls les établissements français déposent et que la date se demande à leur service des relations internationales ; aucun appel 2027-2028 n'y figure. La date de lecture « 5 septembre 2026 », écrite en toutes lettres dans le texte, est remplacée : une date complète décorative se lit comme une échéance."
  },
  {
    "collection": "programs",
    "id": "universite-paris-saclay-orsay__eiffel-excellence-scholarship__master",
    "attendu": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié au 5 septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié à la lecture de septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "sourceVerification": {
        "url": "https://www.campusfrance.org/en/the-france-excellence-eiffel-scholarship-program",
        "citation": "To learn about the procedures and deadlines for submitting an application, contact the international relations department of a French institution via its website, by e-mail or by telephone.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de Campus France (mise à jour de décembre 2025) confirme que seuls les établissements français déposent et que la date se demande à leur service des relations internationales ; aucun appel 2027-2028 n'y figure. La date de lecture « 5 septembre 2026 », écrite en toutes lettres dans le texte, est remplacée : une date complète décorative se lit comme une échéance."
  },
  {
    "collection": "programs",
    "id": "universite-sorbonne-paris-nord-villetaneuse__eiffel-excellence-scholarship__doctorat",
    "attendu": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié au 5 septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié à la lecture de septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "sourceVerification": {
        "url": "https://www.campusfrance.org/en/the-france-excellence-eiffel-scholarship-program",
        "citation": "To learn about the procedures and deadlines for submitting an application, contact the international relations department of a French institution via its website, by e-mail or by telephone.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de Campus France (mise à jour de décembre 2025) confirme que seuls les établissements français déposent et que la date se demande à leur service des relations internationales ; aucun appel 2027-2028 n'y figure. La date de lecture « 5 septembre 2026 », écrite en toutes lettres dans le texte, est remplacée : une date complète décorative se lit comme une échéance."
  },
  {
    "collection": "programs",
    "id": "universite-sorbonne-paris-nord-villetaneuse__eiffel-excellence-scholarship__master",
    "attendu": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié au 5 septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Le dossier est déposé par l'ÉTABLISSEMENT FRANÇAIS, jamais par l'étudiant, et chaque établissement fixe sa propre date limite interne — généralement en octobre-novembre, environ un an avant la rentrée. Sorbonne Université demandait ainsi les dossiers avant le 24 novembre 2025 (doctorat) et le 28 novembre 2025 (master) pour la campagne 2026-2027, en précisant de NE PAS se fier à la date affichée par Campus France. Campagne 2026-2027 close ; calendrier 2027-2028 non publié à la lecture de septembre 2026. Contacter le service des relations internationales de l'établissement visé.",
      "sourceVerification": {
        "url": "https://www.campusfrance.org/en/the-france-excellence-eiffel-scholarship-program",
        "citation": "To learn about the procedures and deadlines for submitting an application, contact the international relations department of a French institution via its website, by e-mail or by telephone.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de Campus France (mise à jour de décembre 2025) confirme que seuls les établissements français déposent et que la date se demande à leur service des relations internationales ; aucun appel 2027-2028 n'y figure. La date de lecture « 5 septembre 2026 », écrite en toutes lettres dans le texte, est remplacée : une date complète décorative se lit comme une échéance."
  },
  {
    "collection": "scholarships",
    "id": "eiffel-excellence-scholarship",
    "attendu": {
      "verifieLe": "2026-09-05"
    },
    "champs": {
      "verifieLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). Montants confirmés sur la page de Campus France : 1 200 € par mois en master, 2 100 € en doctorat, depuis janvier 2026."
  },
  {
    "collection": "programs",
    "id": "aix-marseille-universite-marseille__france-excellence-major__licence",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://aefe.gouv.fr/fr/enseignement-francais/poursuite-des-etudes-dans-le-superieur/devenir-boursier-france-excellence-major",
        "citation": "La commission de sélection des bourses France Excellence Major est organisée par l'AEFE chaque année, courant mai.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de l'AEFE porte la phrase qui fonde le texte (commission annuelle en mai, présélection par le proviseur)."
  },
  {
    "collection": "programs",
    "id": "aix-marseille-universite-marseille__france-excellence-major__master",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://aefe.gouv.fr/fr/enseignement-francais/poursuite-des-etudes-dans-le-superieur/devenir-boursier-france-excellence-major",
        "citation": "La commission de sélection des bourses France Excellence Major est organisée par l'AEFE chaque année, courant mai.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de l'AEFE porte la phrase qui fonde le texte (commission annuelle en mai, présélection par le proviseur)."
  },
  {
    "collection": "programs",
    "id": "insa-lyon-villeurbanne__france-excellence-major__licence",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://aefe.gouv.fr/fr/enseignement-francais/poursuite-des-etudes-dans-le-superieur/devenir-boursier-france-excellence-major",
        "citation": "La commission de sélection des bourses France Excellence Major est organisée par l'AEFE chaque année, courant mai.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de l'AEFE porte la phrase qui fonde le texte (commission annuelle en mai, présélection par le proviseur)."
  },
  {
    "collection": "programs",
    "id": "insa-lyon-villeurbanne__france-excellence-major__master",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://aefe.gouv.fr/fr/enseignement-francais/poursuite-des-etudes-dans-le-superieur/devenir-boursier-france-excellence-major",
        "citation": "La commission de sélection des bourses France Excellence Major est organisée par l'AEFE chaque année, courant mai.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de l'AEFE porte la phrase qui fonde le texte (commission annuelle en mai, présélection par le proviseur)."
  },
  {
    "collection": "programs",
    "id": "nantes-universite-nantes__france-excellence-major__licence",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://aefe.gouv.fr/fr/enseignement-francais/poursuite-des-etudes-dans-le-superieur/devenir-boursier-france-excellence-major",
        "citation": "La commission de sélection des bourses France Excellence Major est organisée par l'AEFE chaque année, courant mai.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de l'AEFE porte la phrase qui fonde le texte (commission annuelle en mai, présélection par le proviseur)."
  },
  {
    "collection": "programs",
    "id": "nantes-universite-nantes__france-excellence-major__master",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://aefe.gouv.fr/fr/enseignement-francais/poursuite-des-etudes-dans-le-superieur/devenir-boursier-france-excellence-major",
        "citation": "La commission de sélection des bourses France Excellence Major est organisée par l'AEFE chaque année, courant mai.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de l'AEFE porte la phrase qui fonde le texte (commission annuelle en mai, présélection par le proviseur)."
  },
  {
    "collection": "programs",
    "id": "universite-claude-bernard-lyon-1-villeurbanne__france-excellence-major__licence",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://aefe.gouv.fr/fr/enseignement-francais/poursuite-des-etudes-dans-le-superieur/devenir-boursier-france-excellence-major",
        "citation": "La commission de sélection des bourses France Excellence Major est organisée par l'AEFE chaque année, courant mai.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de l'AEFE porte la phrase qui fonde le texte (commission annuelle en mai, présélection par le proviseur)."
  },
  {
    "collection": "programs",
    "id": "universite-claude-bernard-lyon-1-villeurbanne__france-excellence-major__master",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://aefe.gouv.fr/fr/enseignement-francais/poursuite-des-etudes-dans-le-superieur/devenir-boursier-france-excellence-major",
        "citation": "La commission de sélection des bourses France Excellence Major est organisée par l'AEFE chaque année, courant mai.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de l'AEFE porte la phrase qui fonde le texte (commission annuelle en mai, présélection par le proviseur)."
  },
  {
    "collection": "programs",
    "id": "universite-cote-d-azur-nice__france-excellence-major__licence",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://aefe.gouv.fr/fr/enseignement-francais/poursuite-des-etudes-dans-le-superieur/devenir-boursier-france-excellence-major",
        "citation": "La commission de sélection des bourses France Excellence Major est organisée par l'AEFE chaque année, courant mai.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de l'AEFE porte la phrase qui fonde le texte (commission annuelle en mai, présélection par le proviseur)."
  },
  {
    "collection": "programs",
    "id": "universite-cote-d-azur-nice__france-excellence-major__master",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://aefe.gouv.fr/fr/enseignement-francais/poursuite-des-etudes-dans-le-superieur/devenir-boursier-france-excellence-major",
        "citation": "La commission de sélection des bourses France Excellence Major est organisée par l'AEFE chaque année, courant mai.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de l'AEFE porte la phrase qui fonde le texte (commission annuelle en mai, présélection par le proviseur)."
  },
  {
    "collection": "programs",
    "id": "universite-de-bordeaux-bordeaux__france-excellence-major__licence",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://aefe.gouv.fr/fr/enseignement-francais/poursuite-des-etudes-dans-le-superieur/devenir-boursier-france-excellence-major",
        "citation": "La commission de sélection des bourses France Excellence Major est organisée par l'AEFE chaque année, courant mai.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de l'AEFE porte la phrase qui fonde le texte (commission annuelle en mai, présélection par le proviseur)."
  },
  {
    "collection": "programs",
    "id": "universite-de-bordeaux-bordeaux__france-excellence-major__master",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://aefe.gouv.fr/fr/enseignement-francais/poursuite-des-etudes-dans-le-superieur/devenir-boursier-france-excellence-major",
        "citation": "La commission de sélection des bourses France Excellence Major est organisée par l'AEFE chaque année, courant mai.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de l'AEFE porte la phrase qui fonde le texte (commission annuelle en mai, présélection par le proviseur)."
  },
  {
    "collection": "programs",
    "id": "universite-de-lille-lille__france-excellence-major__licence",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://aefe.gouv.fr/fr/enseignement-francais/poursuite-des-etudes-dans-le-superieur/devenir-boursier-france-excellence-major",
        "citation": "La commission de sélection des bourses France Excellence Major est organisée par l'AEFE chaque année, courant mai.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de l'AEFE porte la phrase qui fonde le texte (commission annuelle en mai, présélection par le proviseur)."
  },
  {
    "collection": "programs",
    "id": "universite-de-lille-lille__france-excellence-major__master",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://aefe.gouv.fr/fr/enseignement-francais/poursuite-des-etudes-dans-le-superieur/devenir-boursier-france-excellence-major",
        "citation": "La commission de sélection des bourses France Excellence Major est organisée par l'AEFE chaque année, courant mai.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de l'AEFE porte la phrase qui fonde le texte (commission annuelle en mai, présélection par le proviseur)."
  },
  {
    "collection": "programs",
    "id": "universite-de-lorraine-nancy__france-excellence-major__licence",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://aefe.gouv.fr/fr/enseignement-francais/poursuite-des-etudes-dans-le-superieur/devenir-boursier-france-excellence-major",
        "citation": "La commission de sélection des bourses France Excellence Major est organisée par l'AEFE chaque année, courant mai.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de l'AEFE porte la phrase qui fonde le texte (commission annuelle en mai, présélection par le proviseur)."
  },
  {
    "collection": "programs",
    "id": "universite-de-lorraine-nancy__france-excellence-major__master",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://aefe.gouv.fr/fr/enseignement-francais/poursuite-des-etudes-dans-le-superieur/devenir-boursier-france-excellence-major",
        "citation": "La commission de sélection des bourses France Excellence Major est organisée par l'AEFE chaque année, courant mai.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de l'AEFE porte la phrase qui fonde le texte (commission annuelle en mai, présélection par le proviseur)."
  },
  {
    "collection": "programs",
    "id": "universite-de-montpellier-montpellier__france-excellence-major__licence",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://aefe.gouv.fr/fr/enseignement-francais/poursuite-des-etudes-dans-le-superieur/devenir-boursier-france-excellence-major",
        "citation": "La commission de sélection des bourses France Excellence Major est organisée par l'AEFE chaque année, courant mai.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de l'AEFE porte la phrase qui fonde le texte (commission annuelle en mai, présélection par le proviseur)."
  },
  {
    "collection": "programs",
    "id": "universite-de-montpellier-montpellier__france-excellence-major__master",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://aefe.gouv.fr/fr/enseignement-francais/poursuite-des-etudes-dans-le-superieur/devenir-boursier-france-excellence-major",
        "citation": "La commission de sélection des bourses France Excellence Major est organisée par l'AEFE chaque année, courant mai.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de l'AEFE porte la phrase qui fonde le texte (commission annuelle en mai, présélection par le proviseur)."
  },
  {
    "collection": "programs",
    "id": "universite-de-rennes-rennes__france-excellence-major__licence",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://aefe.gouv.fr/fr/enseignement-francais/poursuite-des-etudes-dans-le-superieur/devenir-boursier-france-excellence-major",
        "citation": "La commission de sélection des bourses France Excellence Major est organisée par l'AEFE chaque année, courant mai.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de l'AEFE porte la phrase qui fonde le texte (commission annuelle en mai, présélection par le proviseur)."
  },
  {
    "collection": "programs",
    "id": "universite-de-rennes-rennes__france-excellence-major__master",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://aefe.gouv.fr/fr/enseignement-francais/poursuite-des-etudes-dans-le-superieur/devenir-boursier-france-excellence-major",
        "citation": "La commission de sélection des bourses France Excellence Major est organisée par l'AEFE chaque année, courant mai.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de l'AEFE porte la phrase qui fonde le texte (commission annuelle en mai, présélection par le proviseur)."
  },
  {
    "collection": "programs",
    "id": "universite-de-strasbourg-strasbourg__france-excellence-major__licence",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://aefe.gouv.fr/fr/enseignement-francais/poursuite-des-etudes-dans-le-superieur/devenir-boursier-france-excellence-major",
        "citation": "La commission de sélection des bourses France Excellence Major est organisée par l'AEFE chaque année, courant mai.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de l'AEFE porte la phrase qui fonde le texte (commission annuelle en mai, présélection par le proviseur)."
  },
  {
    "collection": "programs",
    "id": "universite-de-strasbourg-strasbourg__france-excellence-major__master",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://aefe.gouv.fr/fr/enseignement-francais/poursuite-des-etudes-dans-le-superieur/devenir-boursier-france-excellence-major",
        "citation": "La commission de sélection des bourses France Excellence Major est organisée par l'AEFE chaque année, courant mai.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de l'AEFE porte la phrase qui fonde le texte (commission annuelle en mai, présélection par le proviseur)."
  },
  {
    "collection": "programs",
    "id": "universite-de-toulouse-toulouse__france-excellence-major__licence",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://aefe.gouv.fr/fr/enseignement-francais/poursuite-des-etudes-dans-le-superieur/devenir-boursier-france-excellence-major",
        "citation": "La commission de sélection des bourses France Excellence Major est organisée par l'AEFE chaque année, courant mai.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de l'AEFE porte la phrase qui fonde le texte (commission annuelle en mai, présélection par le proviseur)."
  },
  {
    "collection": "programs",
    "id": "universite-de-toulouse-toulouse__france-excellence-major__master",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://aefe.gouv.fr/fr/enseignement-francais/poursuite-des-etudes-dans-le-superieur/devenir-boursier-france-excellence-major",
        "citation": "La commission de sélection des bourses France Excellence Major est organisée par l'AEFE chaque année, courant mai.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de l'AEFE porte la phrase qui fonde le texte (commission annuelle en mai, présélection par le proviseur)."
  },
  {
    "collection": "programs",
    "id": "universite-grenoble-alpes-grenoble__france-excellence-major__licence",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://aefe.gouv.fr/fr/enseignement-francais/poursuite-des-etudes-dans-le-superieur/devenir-boursier-france-excellence-major",
        "citation": "La commission de sélection des bourses France Excellence Major est organisée par l'AEFE chaque année, courant mai.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de l'AEFE porte la phrase qui fonde le texte (commission annuelle en mai, présélection par le proviseur)."
  },
  {
    "collection": "programs",
    "id": "universite-grenoble-alpes-grenoble__france-excellence-major__master",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://aefe.gouv.fr/fr/enseignement-francais/poursuite-des-etudes-dans-le-superieur/devenir-boursier-france-excellence-major",
        "citation": "La commission de sélection des bourses France Excellence Major est organisée par l'AEFE chaque année, courant mai.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de l'AEFE porte la phrase qui fonde le texte (commission annuelle en mai, présélection par le proviseur)."
  },
  {
    "collection": "programs",
    "id": "universite-paris-1-pantheon-sorbonne-paris__france-excellence-major__licence",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://aefe.gouv.fr/fr/enseignement-francais/poursuite-des-etudes-dans-le-superieur/devenir-boursier-france-excellence-major",
        "citation": "La commission de sélection des bourses France Excellence Major est organisée par l'AEFE chaque année, courant mai.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de l'AEFE porte la phrase qui fonde le texte (commission annuelle en mai, présélection par le proviseur)."
  },
  {
    "collection": "programs",
    "id": "universite-paris-1-pantheon-sorbonne-paris__france-excellence-major__master",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://aefe.gouv.fr/fr/enseignement-francais/poursuite-des-etudes-dans-le-superieur/devenir-boursier-france-excellence-major",
        "citation": "La commission de sélection des bourses France Excellence Major est organisée par l'AEFE chaque année, courant mai.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de l'AEFE porte la phrase qui fonde le texte (commission annuelle en mai, présélection par le proviseur)."
  },
  {
    "collection": "programs",
    "id": "universite-paris-cite-paris__france-excellence-major__licence",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://aefe.gouv.fr/fr/enseignement-francais/poursuite-des-etudes-dans-le-superieur/devenir-boursier-france-excellence-major",
        "citation": "La commission de sélection des bourses France Excellence Major est organisée par l'AEFE chaque année, courant mai.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de l'AEFE porte la phrase qui fonde le texte (commission annuelle en mai, présélection par le proviseur)."
  },
  {
    "collection": "programs",
    "id": "universite-paris-cite-paris__france-excellence-major__master",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://aefe.gouv.fr/fr/enseignement-francais/poursuite-des-etudes-dans-le-superieur/devenir-boursier-france-excellence-major",
        "citation": "La commission de sélection des bourses France Excellence Major est organisée par l'AEFE chaque année, courant mai.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de l'AEFE porte la phrase qui fonde le texte (commission annuelle en mai, présélection par le proviseur)."
  },
  {
    "collection": "programs",
    "id": "universite-paris-dauphine-psl-paris__france-excellence-major__licence",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://aefe.gouv.fr/fr/enseignement-francais/poursuite-des-etudes-dans-le-superieur/devenir-boursier-france-excellence-major",
        "citation": "La commission de sélection des bourses France Excellence Major est organisée par l'AEFE chaque année, courant mai.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de l'AEFE porte la phrase qui fonde le texte (commission annuelle en mai, présélection par le proviseur)."
  },
  {
    "collection": "programs",
    "id": "universite-paris-dauphine-psl-paris__france-excellence-major__master",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://aefe.gouv.fr/fr/enseignement-francais/poursuite-des-etudes-dans-le-superieur/devenir-boursier-france-excellence-major",
        "citation": "La commission de sélection des bourses France Excellence Major est organisée par l'AEFE chaque année, courant mai.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de l'AEFE porte la phrase qui fonde le texte (commission annuelle en mai, présélection par le proviseur)."
  },
  {
    "collection": "programs",
    "id": "universite-paris-saclay-orsay__france-excellence-major__licence",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://aefe.gouv.fr/fr/enseignement-francais/poursuite-des-etudes-dans-le-superieur/devenir-boursier-france-excellence-major",
        "citation": "La commission de sélection des bourses France Excellence Major est organisée par l'AEFE chaque année, courant mai.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de l'AEFE porte la phrase qui fonde le texte (commission annuelle en mai, présélection par le proviseur)."
  },
  {
    "collection": "programs",
    "id": "universite-paris-saclay-orsay__france-excellence-major__master",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://aefe.gouv.fr/fr/enseignement-francais/poursuite-des-etudes-dans-le-superieur/devenir-boursier-france-excellence-major",
        "citation": "La commission de sélection des bourses France Excellence Major est organisée par l'AEFE chaque année, courant mai.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de l'AEFE porte la phrase qui fonde le texte (commission annuelle en mai, présélection par le proviseur)."
  },
  {
    "collection": "programs",
    "id": "universite-sorbonne-paris-nord-villetaneuse__france-excellence-major__licence",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://aefe.gouv.fr/fr/enseignement-francais/poursuite-des-etudes-dans-le-superieur/devenir-boursier-france-excellence-major",
        "citation": "La commission de sélection des bourses France Excellence Major est organisée par l'AEFE chaque année, courant mai.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de l'AEFE porte la phrase qui fonde le texte (commission annuelle en mai, présélection par le proviseur)."
  },
  {
    "collection": "programs",
    "id": "universite-sorbonne-paris-nord-villetaneuse__france-excellence-major__master",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://aefe.gouv.fr/fr/enseignement-francais/poursuite-des-etudes-dans-le-superieur/devenir-boursier-france-excellence-major",
        "citation": "La commission de sélection des bourses France Excellence Major est organisée par l'AEFE chaque année, courant mai.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de l'AEFE porte la phrase qui fonde le texte (commission annuelle en mai, présélection par le proviseur)."
  },
  {
    "collection": "programs",
    "id": "universite-abou-bekr-belkaid-tlemcen__bourses-cooperation-algerie__doctorat",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": null,
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La page du ministère algérien ne porte plus qu'un titre et une phrase historique (« plus de 57.000 étudiants étrangers » depuis 1962) : aucune phrase ne fonde un calendrier ou un statut. La preuve à citation vide est donc RETIRÉE (null) plutôt que maquillée ; le texte, qui dit déjà qu'aucune date n'est publiée, reste juste."
  },
  {
    "collection": "programs",
    "id": "universite-abou-bekr-belkaid-tlemcen__bourses-cooperation-algerie__licence",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": null,
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La page du ministère algérien ne porte plus qu'un titre et une phrase historique (« plus de 57.000 étudiants étrangers » depuis 1962) : aucune phrase ne fonde un calendrier ou un statut. La preuve à citation vide est donc RETIRÉE (null) plutôt que maquillée ; le texte, qui dit déjà qu'aucune date n'est publiée, reste juste."
  },
  {
    "collection": "programs",
    "id": "universite-abou-bekr-belkaid-tlemcen__bourses-cooperation-algerie__master",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": null,
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La page du ministère algérien ne porte plus qu'un titre et une phrase historique (« plus de 57.000 étudiants étrangers » depuis 1962) : aucune phrase ne fonde un calendrier ou un statut. La preuve à citation vide est donc RETIRÉE (null) plutôt que maquillée ; le texte, qui dit déjà qu'aucune date n'est publiée, reste juste."
  },
  {
    "collection": "programs",
    "id": "universite-alger-1-benyoucef-benkhedda-alger__bourses-cooperation-algerie__doctorat",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": null,
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La page du ministère algérien ne porte plus qu'un titre et une phrase historique (« plus de 57.000 étudiants étrangers » depuis 1962) : aucune phrase ne fonde un calendrier ou un statut. La preuve à citation vide est donc RETIRÉE (null) plutôt que maquillée ; le texte, qui dit déjà qu'aucune date n'est publiée, reste juste."
  },
  {
    "collection": "programs",
    "id": "universite-alger-1-benyoucef-benkhedda-alger__bourses-cooperation-algerie__licence",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": null,
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La page du ministère algérien ne porte plus qu'un titre et une phrase historique (« plus de 57.000 étudiants étrangers » depuis 1962) : aucune phrase ne fonde un calendrier ou un statut. La preuve à citation vide est donc RETIRÉE (null) plutôt que maquillée ; le texte, qui dit déjà qu'aucune date n'est publiée, reste juste."
  },
  {
    "collection": "programs",
    "id": "universite-alger-1-benyoucef-benkhedda-alger__bourses-cooperation-algerie__master",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": null,
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La page du ministère algérien ne porte plus qu'un titre et une phrase historique (« plus de 57.000 étudiants étrangers » depuis 1962) : aucune phrase ne fonde un calendrier ou un statut. La preuve à citation vide est donc RETIRÉE (null) plutôt que maquillée ; le texte, qui dit déjà qu'aucune date n'est publiée, reste juste."
  },
  {
    "collection": "programs",
    "id": "universite-constantine-1-freres-mentouri-constantine__bourses-cooperation-algerie__doctorat",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": null,
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La page du ministère algérien ne porte plus qu'un titre et une phrase historique (« plus de 57.000 étudiants étrangers » depuis 1962) : aucune phrase ne fonde un calendrier ou un statut. La preuve à citation vide est donc RETIRÉE (null) plutôt que maquillée ; le texte, qui dit déjà qu'aucune date n'est publiée, reste juste."
  },
  {
    "collection": "programs",
    "id": "universite-constantine-1-freres-mentouri-constantine__bourses-cooperation-algerie__licence",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": null,
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La page du ministère algérien ne porte plus qu'un titre et une phrase historique (« plus de 57.000 étudiants étrangers » depuis 1962) : aucune phrase ne fonde un calendrier ou un statut. La preuve à citation vide est donc RETIRÉE (null) plutôt que maquillée ; le texte, qui dit déjà qu'aucune date n'est publiée, reste juste."
  },
  {
    "collection": "programs",
    "id": "universite-constantine-1-freres-mentouri-constantine__bourses-cooperation-algerie__master",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": null,
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La page du ministère algérien ne porte plus qu'un titre et une phrase historique (« plus de 57.000 étudiants étrangers » depuis 1962) : aucune phrase ne fonde un calendrier ou un statut. La preuve à citation vide est donc RETIRÉE (null) plutôt que maquillée ; le texte, qui dit déjà qu'aucune date n'est publiée, reste juste."
  },
  {
    "collection": "programs",
    "id": "universite-oran-1-ahmed-ben-bella-oran__bourses-cooperation-algerie__doctorat",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": null,
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La page du ministère algérien ne porte plus qu'un titre et une phrase historique (« plus de 57.000 étudiants étrangers » depuis 1962) : aucune phrase ne fonde un calendrier ou un statut. La preuve à citation vide est donc RETIRÉE (null) plutôt que maquillée ; le texte, qui dit déjà qu'aucune date n'est publiée, reste juste."
  },
  {
    "collection": "programs",
    "id": "universite-oran-1-ahmed-ben-bella-oran__bourses-cooperation-algerie__licence",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": null,
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La page du ministère algérien ne porte plus qu'un titre et une phrase historique (« plus de 57.000 étudiants étrangers » depuis 1962) : aucune phrase ne fonde un calendrier ou un statut. La preuve à citation vide est donc RETIRÉE (null) plutôt que maquillée ; le texte, qui dit déjà qu'aucune date n'est publiée, reste juste."
  },
  {
    "collection": "programs",
    "id": "universite-oran-1-ahmed-ben-bella-oran__bourses-cooperation-algerie__master",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": null,
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La page du ministère algérien ne porte plus qu'un titre et une phrase historique (« plus de 57.000 étudiants étrangers » depuis 1962) : aucune phrase ne fonde un calendrier ou un statut. La preuve à citation vide est donc RETIRÉE (null) plutôt que maquillée ; le texte, qui dit déjà qu'aucune date n'est publiée, reste juste."
  },
  {
    "collection": "programs",
    "id": "usthb-alger__bourses-cooperation-algerie__doctorat",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": null,
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La page du ministère algérien ne porte plus qu'un titre et une phrase historique (« plus de 57.000 étudiants étrangers » depuis 1962) : aucune phrase ne fonde un calendrier ou un statut. La preuve à citation vide est donc RETIRÉE (null) plutôt que maquillée ; le texte, qui dit déjà qu'aucune date n'est publiée, reste juste."
  },
  {
    "collection": "programs",
    "id": "usthb-alger__bourses-cooperation-algerie__licence",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": null,
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La page du ministère algérien ne porte plus qu'un titre et une phrase historique (« plus de 57.000 étudiants étrangers » depuis 1962) : aucune phrase ne fonde un calendrier ou un statut. La preuve à citation vide est donc RETIRÉE (null) plutôt que maquillée ; le texte, qui dit déjà qu'aucune date n'est publiée, reste juste."
  },
  {
    "collection": "programs",
    "id": "usthb-alger__bourses-cooperation-algerie__master",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": null,
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La page du ministère algérien ne porte plus qu'un titre et une phrase historique (« plus de 57.000 étudiants étrangers » depuis 1962) : aucune phrase ne fonde un calendrier ou un statut. La preuve à citation vide est donc RETIRÉE (null) plutôt que maquillée ; le texte, qui dit déjà qu'aucune date n'est publiée, reste juste."
  },
  {
    "collection": "programs",
    "id": "bogazici-university-istanbul__ytb-isdb-joint-scholarship__doctorat",
    "attendu": {
      "deadline": "La page annonce une période de candidature 2026 (annonce de fin janvier) sans en donner les dates ; le programme suit en pratique le calendrier général Türkiye Bursları (janvier-février). Réservé aux étudiants des pays membres de la BID et des communautés musulmanes ; en licence, la bourse est un prêt remboursable après l'emploi.",
      "deadlineISO": undefined,
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Cycle 2026 terminé : candidatures du 10 janvier jusqu'au 20 février 2026, uniquement sur le site officiel de Türkiye Bursları, en répondant « Yes » à la rubrique « Joint Scholarship Programs » du formulaire. Le cycle 2027 devrait suivre le calendrier général de Türkiye Bursları (janvier-février). Réservé aux étudiants des pays membres de la BID et des communautés musulmanes ; en licence, la bourse est un prêt remboursable après l'emploi.",
      "deadlineISO": "2026-02-20",
      "sourceVerification": {
        "url": "https://turkiyeburslari.gov.tr/announcements/ytb-islamic-development-bank-isdb-joint-scholarship-program-2026-applicaiton-period-122",
        "citation": "Application Dates: 10 January – 20 February 2026",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). L'annonce officielle du 29 janvier 2026 donne les dates que la fiche disait absentes (« sans en donner les dates ») : candidatures du 10 janvier au 20 février 2026, sur le site de Türkiye Bursları, en cochant « Yes » à la rubrique « Joint Scholarship Programs »."
  },
  {
    "collection": "programs",
    "id": "bogazici-university-istanbul__ytb-isdb-joint-scholarship__licence",
    "attendu": {
      "deadline": "La page annonce une période de candidature 2026 (annonce de fin janvier) sans en donner les dates ; le programme suit en pratique le calendrier général Türkiye Bursları (janvier-février). Réservé aux étudiants des pays membres de la BID et des communautés musulmanes ; en licence, la bourse est un prêt remboursable après l'emploi.",
      "deadlineISO": undefined,
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Cycle 2026 terminé : candidatures du 10 janvier jusqu'au 20 février 2026, uniquement sur le site officiel de Türkiye Bursları, en répondant « Yes » à la rubrique « Joint Scholarship Programs » du formulaire. Le cycle 2027 devrait suivre le calendrier général de Türkiye Bursları (janvier-février). Réservé aux étudiants des pays membres de la BID et des communautés musulmanes ; en licence, la bourse est un prêt remboursable après l'emploi.",
      "deadlineISO": "2026-02-20",
      "sourceVerification": {
        "url": "https://turkiyeburslari.gov.tr/announcements/ytb-islamic-development-bank-isdb-joint-scholarship-program-2026-applicaiton-period-122",
        "citation": "Application Dates: 10 January – 20 February 2026",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). L'annonce officielle du 29 janvier 2026 donne les dates que la fiche disait absentes (« sans en donner les dates ») : candidatures du 10 janvier au 20 février 2026, sur le site de Türkiye Bursları, en cochant « Yes » à la rubrique « Joint Scholarship Programs »."
  },
  {
    "collection": "programs",
    "id": "bogazici-university-istanbul__ytb-isdb-joint-scholarship__master",
    "attendu": {
      "deadline": "La page annonce une période de candidature 2026 (annonce de fin janvier) sans en donner les dates ; le programme suit en pratique le calendrier général Türkiye Bursları (janvier-février). Réservé aux étudiants des pays membres de la BID et des communautés musulmanes ; en licence, la bourse est un prêt remboursable après l'emploi.",
      "deadlineISO": undefined,
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Cycle 2026 terminé : candidatures du 10 janvier jusqu'au 20 février 2026, uniquement sur le site officiel de Türkiye Bursları, en répondant « Yes » à la rubrique « Joint Scholarship Programs » du formulaire. Le cycle 2027 devrait suivre le calendrier général de Türkiye Bursları (janvier-février). Réservé aux étudiants des pays membres de la BID et des communautés musulmanes ; en licence, la bourse est un prêt remboursable après l'emploi.",
      "deadlineISO": "2026-02-20",
      "sourceVerification": {
        "url": "https://turkiyeburslari.gov.tr/announcements/ytb-islamic-development-bank-isdb-joint-scholarship-program-2026-applicaiton-period-122",
        "citation": "Application Dates: 10 January – 20 February 2026",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). L'annonce officielle du 29 janvier 2026 donne les dates que la fiche disait absentes (« sans en donner les dates ») : candidatures du 10 janvier au 20 février 2026, sur le site de Türkiye Bursları, en cochant « Yes » à la rubrique « Joint Scholarship Programs »."
  },
  {
    "collection": "programs",
    "id": "istanbul-technical-university-istanbul__ytb-isdb-joint-scholarship__doctorat",
    "attendu": {
      "deadline": "La page annonce une période de candidature 2026 (annonce de fin janvier) sans en donner les dates ; le programme suit en pratique le calendrier général Türkiye Bursları (janvier-février). Réservé aux étudiants des pays membres de la BID et des communautés musulmanes ; en licence, la bourse est un prêt remboursable après l'emploi.",
      "deadlineISO": undefined,
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Cycle 2026 terminé : candidatures du 10 janvier jusqu'au 20 février 2026, uniquement sur le site officiel de Türkiye Bursları, en répondant « Yes » à la rubrique « Joint Scholarship Programs » du formulaire. Le cycle 2027 devrait suivre le calendrier général de Türkiye Bursları (janvier-février). Réservé aux étudiants des pays membres de la BID et des communautés musulmanes ; en licence, la bourse est un prêt remboursable après l'emploi.",
      "deadlineISO": "2026-02-20",
      "sourceVerification": {
        "url": "https://turkiyeburslari.gov.tr/announcements/ytb-islamic-development-bank-isdb-joint-scholarship-program-2026-applicaiton-period-122",
        "citation": "Application Dates: 10 January – 20 February 2026",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). L'annonce officielle du 29 janvier 2026 donne les dates que la fiche disait absentes (« sans en donner les dates ») : candidatures du 10 janvier au 20 février 2026, sur le site de Türkiye Bursları, en cochant « Yes » à la rubrique « Joint Scholarship Programs »."
  },
  {
    "collection": "programs",
    "id": "istanbul-technical-university-istanbul__ytb-isdb-joint-scholarship__licence",
    "attendu": {
      "deadline": "La page annonce une période de candidature 2026 (annonce de fin janvier) sans en donner les dates ; le programme suit en pratique le calendrier général Türkiye Bursları (janvier-février). Réservé aux étudiants des pays membres de la BID et des communautés musulmanes ; en licence, la bourse est un prêt remboursable après l'emploi.",
      "deadlineISO": undefined,
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Cycle 2026 terminé : candidatures du 10 janvier jusqu'au 20 février 2026, uniquement sur le site officiel de Türkiye Bursları, en répondant « Yes » à la rubrique « Joint Scholarship Programs » du formulaire. Le cycle 2027 devrait suivre le calendrier général de Türkiye Bursları (janvier-février). Réservé aux étudiants des pays membres de la BID et des communautés musulmanes ; en licence, la bourse est un prêt remboursable après l'emploi.",
      "deadlineISO": "2026-02-20",
      "sourceVerification": {
        "url": "https://turkiyeburslari.gov.tr/announcements/ytb-islamic-development-bank-isdb-joint-scholarship-program-2026-applicaiton-period-122",
        "citation": "Application Dates: 10 January – 20 February 2026",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). L'annonce officielle du 29 janvier 2026 donne les dates que la fiche disait absentes (« sans en donner les dates ») : candidatures du 10 janvier au 20 février 2026, sur le site de Türkiye Bursları, en cochant « Yes » à la rubrique « Joint Scholarship Programs »."
  },
  {
    "collection": "programs",
    "id": "istanbul-technical-university-istanbul__ytb-isdb-joint-scholarship__master",
    "attendu": {
      "deadline": "La page annonce une période de candidature 2026 (annonce de fin janvier) sans en donner les dates ; le programme suit en pratique le calendrier général Türkiye Bursları (janvier-février). Réservé aux étudiants des pays membres de la BID et des communautés musulmanes ; en licence, la bourse est un prêt remboursable après l'emploi.",
      "deadlineISO": undefined,
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Cycle 2026 terminé : candidatures du 10 janvier jusqu'au 20 février 2026, uniquement sur le site officiel de Türkiye Bursları, en répondant « Yes » à la rubrique « Joint Scholarship Programs » du formulaire. Le cycle 2027 devrait suivre le calendrier général de Türkiye Bursları (janvier-février). Réservé aux étudiants des pays membres de la BID et des communautés musulmanes ; en licence, la bourse est un prêt remboursable après l'emploi.",
      "deadlineISO": "2026-02-20",
      "sourceVerification": {
        "url": "https://turkiyeburslari.gov.tr/announcements/ytb-islamic-development-bank-isdb-joint-scholarship-program-2026-applicaiton-period-122",
        "citation": "Application Dates: 10 January – 20 February 2026",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). L'annonce officielle du 29 janvier 2026 donne les dates que la fiche disait absentes (« sans en donner les dates ») : candidatures du 10 janvier au 20 février 2026, sur le site de Türkiye Bursları, en cochant « Yes » à la rubrique « Joint Scholarship Programs »."
  },
  {
    "collection": "programs",
    "id": "istanbul-university-istanbul__ytb-isdb-joint-scholarship__doctorat",
    "attendu": {
      "deadline": "La page annonce une période de candidature 2026 (annonce de fin janvier) sans en donner les dates ; le programme suit en pratique le calendrier général Türkiye Bursları (janvier-février). Réservé aux étudiants des pays membres de la BID et des communautés musulmanes ; en licence, la bourse est un prêt remboursable après l'emploi.",
      "deadlineISO": undefined,
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Cycle 2026 terminé : candidatures du 10 janvier jusqu'au 20 février 2026, uniquement sur le site officiel de Türkiye Bursları, en répondant « Yes » à la rubrique « Joint Scholarship Programs » du formulaire. Le cycle 2027 devrait suivre le calendrier général de Türkiye Bursları (janvier-février). Réservé aux étudiants des pays membres de la BID et des communautés musulmanes ; en licence, la bourse est un prêt remboursable après l'emploi.",
      "deadlineISO": "2026-02-20",
      "sourceVerification": {
        "url": "https://turkiyeburslari.gov.tr/announcements/ytb-islamic-development-bank-isdb-joint-scholarship-program-2026-applicaiton-period-122",
        "citation": "Application Dates: 10 January – 20 February 2026",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). L'annonce officielle du 29 janvier 2026 donne les dates que la fiche disait absentes (« sans en donner les dates ») : candidatures du 10 janvier au 20 février 2026, sur le site de Türkiye Bursları, en cochant « Yes » à la rubrique « Joint Scholarship Programs »."
  },
  {
    "collection": "programs",
    "id": "istanbul-university-istanbul__ytb-isdb-joint-scholarship__licence",
    "attendu": {
      "deadline": "La page annonce une période de candidature 2026 (annonce de fin janvier) sans en donner les dates ; le programme suit en pratique le calendrier général Türkiye Bursları (janvier-février). Réservé aux étudiants des pays membres de la BID et des communautés musulmanes ; en licence, la bourse est un prêt remboursable après l'emploi.",
      "deadlineISO": undefined,
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Cycle 2026 terminé : candidatures du 10 janvier jusqu'au 20 février 2026, uniquement sur le site officiel de Türkiye Bursları, en répondant « Yes » à la rubrique « Joint Scholarship Programs » du formulaire. Le cycle 2027 devrait suivre le calendrier général de Türkiye Bursları (janvier-février). Réservé aux étudiants des pays membres de la BID et des communautés musulmanes ; en licence, la bourse est un prêt remboursable après l'emploi.",
      "deadlineISO": "2026-02-20",
      "sourceVerification": {
        "url": "https://turkiyeburslari.gov.tr/announcements/ytb-islamic-development-bank-isdb-joint-scholarship-program-2026-applicaiton-period-122",
        "citation": "Application Dates: 10 January – 20 February 2026",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). L'annonce officielle du 29 janvier 2026 donne les dates que la fiche disait absentes (« sans en donner les dates ») : candidatures du 10 janvier au 20 février 2026, sur le site de Türkiye Bursları, en cochant « Yes » à la rubrique « Joint Scholarship Programs »."
  },
  {
    "collection": "programs",
    "id": "istanbul-university-istanbul__ytb-isdb-joint-scholarship__master",
    "attendu": {
      "deadline": "La page annonce une période de candidature 2026 (annonce de fin janvier) sans en donner les dates ; le programme suit en pratique le calendrier général Türkiye Bursları (janvier-février). Réservé aux étudiants des pays membres de la BID et des communautés musulmanes ; en licence, la bourse est un prêt remboursable après l'emploi.",
      "deadlineISO": undefined,
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Cycle 2026 terminé : candidatures du 10 janvier jusqu'au 20 février 2026, uniquement sur le site officiel de Türkiye Bursları, en répondant « Yes » à la rubrique « Joint Scholarship Programs » du formulaire. Le cycle 2027 devrait suivre le calendrier général de Türkiye Bursları (janvier-février). Réservé aux étudiants des pays membres de la BID et des communautés musulmanes ; en licence, la bourse est un prêt remboursable après l'emploi.",
      "deadlineISO": "2026-02-20",
      "sourceVerification": {
        "url": "https://turkiyeburslari.gov.tr/announcements/ytb-islamic-development-bank-isdb-joint-scholarship-program-2026-applicaiton-period-122",
        "citation": "Application Dates: 10 January – 20 February 2026",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). L'annonce officielle du 29 janvier 2026 donne les dates que la fiche disait absentes (« sans en donner les dates ») : candidatures du 10 janvier au 20 février 2026, sur le site de Türkiye Bursları, en cochant « Yes » à la rubrique « Joint Scholarship Programs »."
  },
  {
    "collection": "scholarships",
    "id": "ytb-isdb-joint-scholarship",
    "attendu": {
      "generalCriteria": "Réservée aux ressortissants des États membres de la Banque islamique de développement — LE SÉNÉGAL EN FAIT PARTIE, ainsi que le Mali, le Burkina Faso, le Niger, la Guinée, la Gambie, la Côte d'Ivoire, le Bénin, le Togo, la Mauritanie et le Nigeria. Vérifier la liste officielle de la BID avant de candidater. Sélection sur l'excellence académique et parascolaire. ATTENTION : la page d'accueil de turkiyeburslari.gov.tr signalait un cycle 2026 actif au 30/08/2026, mais AUCUNE DATE n'était diffusée — re-vérifier avant de se fier au calendrier.",
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://turkiyeburslari.gov.tr/partneredprograms"
    },
    "champs": {
      "generalCriteria": "Réservée aux ressortissants des États membres de la Banque islamique de développement — LE SÉNÉGAL EN FAIT PARTIE, ainsi que le Mali, le Burkina Faso, le Niger, la Guinée, la Gambie, la Côte d'Ivoire, le Bénin, le Togo, la Mauritanie et le Nigeria. Vérifier la liste officielle de la BID avant de candidater. Sélection sur l'excellence académique et parascolaire. Cycle 2026 : candidatures du 10 janvier au 20 février 2026, sur le site de Türkiye Bursları (annonce officielle du 29 janvier 2026) ; associate, licence, master et doctorat.",
      "verifieLe": "2026-09-22",
      "sourceEcheance": "https://turkiyeburslari.gov.tr/announcements/ytb-islamic-development-bank-isdb-joint-scholarship-program-2026-applicaiton-period-122"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). L'annonce officielle du 29 janvier 2026 donne les dates que la fiche disait absentes (« sans en donner les dates ») : candidatures du 10 janvier au 20 février 2026, sur le site de Türkiye Bursları, en cochant « Yes » à la rubrique « Joint Scholarship Programs »."
  },
  {
    "collection": "programs",
    "id": "kaist-daejeon__global-korea-scholarship__doctorat",
    "attendu": {
      "deadline": "L'appel 2027 du GKS pour le master et le doctorat (GKS-G) n'est pas encore publié : seul celui de la licence est paru, début septembre 2026. Dépôt, le moment venu, par l'ambassade de Corée du pays ou directement auprès d'une université désignée.",
      "ouverteVerifieeLe": "2026-09-22"
    },
    "champs": {
      "deadline": "L'appel 2027 du GKS pour le master et le doctorat (GKS-G) n'est pas encore publié : d'après le calendrier officiel de Study in Korea, il paraît en février, et le dépôt court de février à mars, par l'ambassade de Corée du pays ou directement auprès d'une université désignée. Seul l'appel de la licence est paru, début septembre 2026.",
      "sourceVerification": {
        "url": "https://www.studyinkorea.go.kr/en/plan/scholarship.do?tab=gks-tab1",
        "citation": "1 Announcement NIIED Application Period : February 2 Application Submission Embassy University Application Period : February - March",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : le calendrier du GKS pour les études supérieures (Study in Korea, NIIED) dit quand l'appel paraît : annonce en février, dépôt de février à mars. Le texte le dit désormais au lieu de laisser l'étudiant deviner."
  },
  {
    "collection": "programs",
    "id": "kaist-daejeon__global-korea-scholarship__master",
    "attendu": {
      "deadline": "L'appel 2027 du GKS pour le master et le doctorat (GKS-G) n'est pas encore publié : seul celui de la licence est paru, début septembre 2026. Dépôt, le moment venu, par l'ambassade de Corée du pays ou directement auprès d'une université désignée.",
      "ouverteVerifieeLe": "2026-09-22"
    },
    "champs": {
      "deadline": "L'appel 2027 du GKS pour le master et le doctorat (GKS-G) n'est pas encore publié : d'après le calendrier officiel de Study in Korea, il paraît en février, et le dépôt court de février à mars, par l'ambassade de Corée du pays ou directement auprès d'une université désignée. Seul l'appel de la licence est paru, début septembre 2026.",
      "sourceVerification": {
        "url": "https://www.studyinkorea.go.kr/en/plan/scholarship.do?tab=gks-tab1",
        "citation": "1 Announcement NIIED Application Period : February 2 Application Submission Embassy University Application Period : February - March",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : le calendrier du GKS pour les études supérieures (Study in Korea, NIIED) dit quand l'appel paraît : annonce en février, dépôt de février à mars. Le texte le dit désormais au lieu de laisser l'étudiant deviner."
  },
  {
    "collection": "programs",
    "id": "postech-pohang__global-korea-scholarship__doctorat",
    "attendu": {
      "deadline": "L'appel 2027 du GKS pour le master et le doctorat (GKS-G) n'est pas encore publié : seul celui de la licence est paru, début septembre 2026. Dépôt, le moment venu, par l'ambassade de Corée du pays ou directement auprès d'une université désignée.",
      "ouverteVerifieeLe": "2026-09-22"
    },
    "champs": {
      "deadline": "L'appel 2027 du GKS pour le master et le doctorat (GKS-G) n'est pas encore publié : d'après le calendrier officiel de Study in Korea, il paraît en février, et le dépôt court de février à mars, par l'ambassade de Corée du pays ou directement auprès d'une université désignée. Seul l'appel de la licence est paru, début septembre 2026.",
      "sourceVerification": {
        "url": "https://www.studyinkorea.go.kr/en/plan/scholarship.do?tab=gks-tab1",
        "citation": "1 Announcement NIIED Application Period : February 2 Application Submission Embassy University Application Period : February - March",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : le calendrier du GKS pour les études supérieures (Study in Korea, NIIED) dit quand l'appel paraît : annonce en février, dépôt de février à mars. Le texte le dit désormais au lieu de laisser l'étudiant deviner."
  },
  {
    "collection": "programs",
    "id": "postech-pohang__global-korea-scholarship__master",
    "attendu": {
      "deadline": "L'appel 2027 du GKS pour le master et le doctorat (GKS-G) n'est pas encore publié : seul celui de la licence est paru, début septembre 2026. Dépôt, le moment venu, par l'ambassade de Corée du pays ou directement auprès d'une université désignée.",
      "ouverteVerifieeLe": "2026-09-22"
    },
    "champs": {
      "deadline": "L'appel 2027 du GKS pour le master et le doctorat (GKS-G) n'est pas encore publié : d'après le calendrier officiel de Study in Korea, il paraît en février, et le dépôt court de février à mars, par l'ambassade de Corée du pays ou directement auprès d'une université désignée. Seul l'appel de la licence est paru, début septembre 2026.",
      "sourceVerification": {
        "url": "https://www.studyinkorea.go.kr/en/plan/scholarship.do?tab=gks-tab1",
        "citation": "1 Announcement NIIED Application Period : February 2 Application Submission Embassy University Application Period : February - March",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : le calendrier du GKS pour les études supérieures (Study in Korea, NIIED) dit quand l'appel paraît : annonce en février, dépôt de février à mars. Le texte le dit désormais au lieu de laisser l'étudiant deviner."
  },
  {
    "collection": "programs",
    "id": "seoul-national-university-seoul__global-korea-scholarship__doctorat",
    "attendu": {
      "deadline": "L'appel 2027 du GKS pour le master et le doctorat (GKS-G) n'est pas encore publié : seul celui de la licence est paru, début septembre 2026. Dépôt, le moment venu, par l'ambassade de Corée du pays ou directement auprès d'une université désignée.",
      "ouverteVerifieeLe": "2026-09-22"
    },
    "champs": {
      "deadline": "L'appel 2027 du GKS pour le master et le doctorat (GKS-G) n'est pas encore publié : d'après le calendrier officiel de Study in Korea, il paraît en février, et le dépôt court de février à mars, par l'ambassade de Corée du pays ou directement auprès d'une université désignée. Seul l'appel de la licence est paru, début septembre 2026.",
      "sourceVerification": {
        "url": "https://www.studyinkorea.go.kr/en/plan/scholarship.do?tab=gks-tab1",
        "citation": "1 Announcement NIIED Application Period : February 2 Application Submission Embassy University Application Period : February - March",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : le calendrier du GKS pour les études supérieures (Study in Korea, NIIED) dit quand l'appel paraît : annonce en février, dépôt de février à mars. Le texte le dit désormais au lieu de laisser l'étudiant deviner."
  },
  {
    "collection": "programs",
    "id": "seoul-national-university-seoul__global-korea-scholarship__master",
    "attendu": {
      "deadline": "L'appel 2027 du GKS pour le master et le doctorat (GKS-G) n'est pas encore publié : seul celui de la licence est paru, début septembre 2026. Dépôt, le moment venu, par l'ambassade de Corée du pays ou directement auprès d'une université désignée.",
      "ouverteVerifieeLe": "2026-09-22"
    },
    "champs": {
      "deadline": "L'appel 2027 du GKS pour le master et le doctorat (GKS-G) n'est pas encore publié : d'après le calendrier officiel de Study in Korea, il paraît en février, et le dépôt court de février à mars, par l'ambassade de Corée du pays ou directement auprès d'une université désignée. Seul l'appel de la licence est paru, début septembre 2026.",
      "sourceVerification": {
        "url": "https://www.studyinkorea.go.kr/en/plan/scholarship.do?tab=gks-tab1",
        "citation": "1 Announcement NIIED Application Period : February 2 Application Submission Embassy University Application Period : February - March",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : le calendrier du GKS pour les études supérieures (Study in Korea, NIIED) dit quand l'appel paraît : annonce en février, dépôt de février à mars. Le texte le dit désormais au lieu de laisser l'étudiant deviner."
  },
  {
    "collection": "scholarships",
    "id": "global-korea-scholarship",
    "attendu": {
      "generalCriteria": "DEUX PROGRAMMES, DEUX CALENDRIERS. Licence (GKS-U) 2027 : voie ambassade en ligne du 15 au 30 septembre 2026 (18h, heure de Corée), réservée à 74 pays — le Sénégal n'y figure PAS ; voie université de septembre à novembre 2026, dont le programme UIC (100 places dans 13 établissements, sciences et ingénierie) ouvert à tous les pays. Master et doctorat (GKS-G) : l'appel 2027 n'est pas encore publié. Choix de trois universités au plus dans la voie ambassade, dont au moins une de type B. « KGSP » est l'ancien nom du GKS."
    },
    "champs": {
      "generalCriteria": "DEUX PROGRAMMES, DEUX CALENDRIERS. Licence (GKS-U) 2027 : voie ambassade en ligne du 15 au 30 septembre 2026 (18h, heure de Corée), réservée à 74 pays — le Sénégal n'y figure PAS ; voie université de septembre à novembre 2026, dont le programme UIC (100 places dans 13 établissements, sciences et ingénierie) ouvert à tous les pays. Master et doctorat (GKS-G) : l'appel 2027 n'est pas encore publié ; il paraît en février, et le dépôt court de février à mars. Choix de trois universités au plus dans la voie ambassade, dont au moins une de type B. « KGSP » est l'ancien nom du GKS."
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : le calendrier du GKS pour les études supérieures (Study in Korea, NIIED) dit quand l'appel paraît : annonce en février, dépôt de février à mars. Le texte le dit désormais au lieu de laisser l'étudiant deviner."
  },
  {
    "collection": "programs",
    "id": "university-of-tokyo-tokyo__jasso-monbukagakusho-honors__doctorat",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://www.studyinjapan.go.jp/en/planning/scholarships/jasso-scholarships/",
        "citation": "Confirm with the person in charge at your university, etc.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de JASSO renvoie la demande à l'établissement (et, avant l'arrivée, à la réservation lors de l'EJU) : c'est la phrase qui fonde le texte."
  },
  {
    "collection": "programs",
    "id": "university-of-tokyo-tokyo__jasso-monbukagakusho-honors__licence",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://www.studyinjapan.go.jp/en/planning/scholarships/jasso-scholarships/",
        "citation": "Confirm with the person in charge at your university, etc.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de JASSO renvoie la demande à l'établissement (et, avant l'arrivée, à la réservation lors de l'EJU) : c'est la phrase qui fonde le texte."
  },
  {
    "collection": "programs",
    "id": "university-of-tokyo-tokyo__jasso-monbukagakusho-honors__master",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://www.studyinjapan.go.jp/en/planning/scholarships/jasso-scholarships/",
        "citation": "Confirm with the person in charge at your university, etc.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de JASSO renvoie la demande à l'établissement (et, avant l'arrivée, à la réservation lors de l'EJU) : c'est la phrase qui fonde le texte."
  },
  {
    "collection": "programs",
    "id": "waseda-university-tokyo__jasso-monbukagakusho-honors__doctorat",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://www.studyinjapan.go.jp/en/planning/scholarships/jasso-scholarships/",
        "citation": "Confirm with the person in charge at your university, etc.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de JASSO renvoie la demande à l'établissement (et, avant l'arrivée, à la réservation lors de l'EJU) : c'est la phrase qui fonde le texte."
  },
  {
    "collection": "programs",
    "id": "waseda-university-tokyo__jasso-monbukagakusho-honors__licence",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://www.studyinjapan.go.jp/en/planning/scholarships/jasso-scholarships/",
        "citation": "Confirm with the person in charge at your university, etc.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de JASSO renvoie la demande à l'établissement (et, avant l'arrivée, à la réservation lors de l'EJU) : c'est la phrase qui fonde le texte."
  },
  {
    "collection": "programs",
    "id": "waseda-university-tokyo__jasso-monbukagakusho-honors__master",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://www.studyinjapan.go.jp/en/planning/scholarships/jasso-scholarships/",
        "citation": "Confirm with the person in charge at your university, etc.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page de JASSO renvoie la demande à l'établissement (et, avant l'arrivée, à la réservation lors de l'EJU) : c'est la phrase qui fonde le texte."
  },
  {
    "collection": "programs",
    "id": "university-of-tokyo-tokyo__jica-sdgs-global-leader__doctorat",
    "attendu": {
      "deadline": "La page enregistrée est celle du bureau JICA des Philippines et affiche le calendrier 2025 : nomination par le gouvernement avant le 24 octobre 2025, départ en septembre 2026. Chaque bureau JICA national publie son propre appel, en général entre septembre et novembre, pour un départ l'année suivante.",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Aucun appel en cours publié : la page du bureau JICA des Philippines qui portait le calendrier 2025 n'existe plus. Au Sénégal, le dernier appel affiché par le bureau JICA de Dakar (ABE Initiative et SDGs Global Leadership Program, promotion 2021) courait de septembre à la mi-octobre, pour un départ au Japon en septembre de l'année suivante. Réservé aux fonctionnaires et universitaires nommés par leur gouvernement : demander le calendrier au bureau JICA du pays.",
      "sourceVerification": {
        "url": "https://www.jica.go.jp/english/overseas/senegal/others/abe.html",
        "citation": "The application will be open from September to 16 October 2020; and the participants will be leaving for Japan in September 2021.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La page du bureau JICA des Philippines qui portait le calendrier 2025 (source de la fiche) renvoie désormais une erreur « Not Found ». La seule page officielle lisible qui décrit ce programme pour l'Afrique de l'Ouest est celle du bureau JICA du Sénégal (ABE Initiative et SDGs Global Leadership Program, promotion 2021) : elle devient la source, et le texte dit son âge."
  },
  {
    "collection": "programs",
    "id": "university-of-tokyo-tokyo__jica-sdgs-global-leader__master",
    "attendu": {
      "deadline": "La page enregistrée est celle du bureau JICA des Philippines et affiche le calendrier 2025 : nomination par le gouvernement avant le 24 octobre 2025, départ en septembre 2026. Chaque bureau JICA national publie son propre appel, en général entre septembre et novembre, pour un départ l'année suivante.",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Aucun appel en cours publié : la page du bureau JICA des Philippines qui portait le calendrier 2025 n'existe plus. Au Sénégal, le dernier appel affiché par le bureau JICA de Dakar (ABE Initiative et SDGs Global Leadership Program, promotion 2021) courait de septembre à la mi-octobre, pour un départ au Japon en septembre de l'année suivante. Réservé aux fonctionnaires et universitaires nommés par leur gouvernement : demander le calendrier au bureau JICA du pays.",
      "sourceVerification": {
        "url": "https://www.jica.go.jp/english/overseas/senegal/others/abe.html",
        "citation": "The application will be open from September to 16 October 2020; and the participants will be leaving for Japan in September 2021.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La page du bureau JICA des Philippines qui portait le calendrier 2025 (source de la fiche) renvoie désormais une erreur « Not Found ». La seule page officielle lisible qui décrit ce programme pour l'Afrique de l'Ouest est celle du bureau JICA du Sénégal (ABE Initiative et SDGs Global Leadership Program, promotion 2021) : elle devient la source, et le texte dit son âge."
  },
  {
    "collection": "programs",
    "id": "waseda-university-tokyo__jica-sdgs-global-leader__doctorat",
    "attendu": {
      "deadline": "La page enregistrée est celle du bureau JICA des Philippines et affiche le calendrier 2025 : nomination par le gouvernement avant le 24 octobre 2025, départ en septembre 2026. Chaque bureau JICA national publie son propre appel, en général entre septembre et novembre, pour un départ l'année suivante.",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Aucun appel en cours publié : la page du bureau JICA des Philippines qui portait le calendrier 2025 n'existe plus. Au Sénégal, le dernier appel affiché par le bureau JICA de Dakar (ABE Initiative et SDGs Global Leadership Program, promotion 2021) courait de septembre à la mi-octobre, pour un départ au Japon en septembre de l'année suivante. Réservé aux fonctionnaires et universitaires nommés par leur gouvernement : demander le calendrier au bureau JICA du pays.",
      "sourceVerification": {
        "url": "https://www.jica.go.jp/english/overseas/senegal/others/abe.html",
        "citation": "The application will be open from September to 16 October 2020; and the participants will be leaving for Japan in September 2021.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La page du bureau JICA des Philippines qui portait le calendrier 2025 (source de la fiche) renvoie désormais une erreur « Not Found ». La seule page officielle lisible qui décrit ce programme pour l'Afrique de l'Ouest est celle du bureau JICA du Sénégal (ABE Initiative et SDGs Global Leadership Program, promotion 2021) : elle devient la source, et le texte dit son âge."
  },
  {
    "collection": "programs",
    "id": "waseda-university-tokyo__jica-sdgs-global-leader__master",
    "attendu": {
      "deadline": "La page enregistrée est celle du bureau JICA des Philippines et affiche le calendrier 2025 : nomination par le gouvernement avant le 24 octobre 2025, départ en septembre 2026. Chaque bureau JICA national publie son propre appel, en général entre septembre et novembre, pour un départ l'année suivante.",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Aucun appel en cours publié : la page du bureau JICA des Philippines qui portait le calendrier 2025 n'existe plus. Au Sénégal, le dernier appel affiché par le bureau JICA de Dakar (ABE Initiative et SDGs Global Leadership Program, promotion 2021) courait de septembre à la mi-octobre, pour un départ au Japon en septembre de l'année suivante. Réservé aux fonctionnaires et universitaires nommés par leur gouvernement : demander le calendrier au bureau JICA du pays.",
      "sourceVerification": {
        "url": "https://www.jica.go.jp/english/overseas/senegal/others/abe.html",
        "citation": "The application will be open from September to 16 October 2020; and the participants will be leaving for Japan in September 2021.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La page du bureau JICA des Philippines qui portait le calendrier 2025 (source de la fiche) renvoie désormais une erreur « Not Found ». La seule page officielle lisible qui décrit ce programme pour l'Afrique de l'Ouest est celle du bureau JICA du Sénégal (ABE Initiative et SDGs Global Leadership Program, promotion 2021) : elle devient la source, et le texte dit son âge."
  },
  {
    "collection": "scholarships",
    "id": "jica-sdgs-global-leader",
    "attendu": {
      "generalCriteria": "Ouvert à l'Afrique subsaharienne, administré par les bureaux JICA de chaque pays. NOMINATION OBLIGATOIRE PAR LE GOUVERNEMENT : le dossier se dépose via la DRH de l'organisme employeur, qui le transmet pour nomination officielle. Pour le cycle 2026 : dépôts en septembre-octobre 2025, date limite de nomination gouvernementale le 24 octobre 2025, présélection JICA en novembre-décembre, examens universitaires de février à juin 2026, départ pour le Japon en septembre 2026. Le cycle 2027 n'est pas publié au 30/08/2026.",
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.jica.go.jp/english/overseas/philippine/activities/assistance_schemes/training_and_scholarship_programs/long_term_programs/sdgs_glp/index.html"
    },
    "champs": {
      "generalCriteria": "Ouvert à l'Afrique subsaharienne, administré par les bureaux JICA de chaque pays. NOMINATION OBLIGATOIRE PAR LE GOUVERNEMENT : le dossier se dépose via la DRH de l'organisme employeur, qui le transmet pour nomination officielle. Pour le cycle 2026 : dépôts en septembre-octobre 2025, date limite de nomination gouvernementale le 24 octobre 2025, présélection JICA en novembre-décembre, examens universitaires de février à juin 2026, départ pour le Japon en septembre 2026. Ce calendrier était celui du bureau des Philippines, dont la page n'existe plus ; le cycle 2027 n'est pas publié à la lecture de septembre 2026.",
      "verifieLe": "2026-09-22",
      "sourceEcheance": "https://www.jica.go.jp/english/overseas/senegal/others/abe.html"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La page du bureau JICA des Philippines qui portait le calendrier 2025 (source de la fiche) renvoie désormais une erreur « Not Found ». La seule page officielle lisible qui décrit ce programme pour l'Afrique de l'Ouest est celle du bureau JICA du Sénégal (ABE Initiative et SDGs Global Leadership Program, promotion 2021) : elle devient la source, et le texte dit son âge."
  },
  {
    "collection": "programs",
    "id": "leibniz-universitat-hannover-hannover__deutschlandstipendium",
    "attendu": {
      "status": "Ouverte",
      "deadline": "Cycle 2026/27 : candidatures du 10 août au 30 septembre 2026",
      "deadlineISO": undefined,
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "status": "Ouverte",
      "deadline": "Cycle 2026/27 : candidatures du 10 août jusqu'au 30 septembre 2026, uniquement sur le portail de candidature de la Leibniz Universität Hannover. Ouvert aux étudiants allemands et internationaux, dès la première année comme aux semestres avancés.",
      "deadlineISO": "2026-09-30",
      "sourceVerification": {
        "url": "https://www.uni-hannover.de/studium/finanzierung-foerderung/deutschlandstipendium",
        "citation": "Der Bewerbungszeitraum endet am 30. September 2026.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la bourse n'a pas de calendrier national ; la preuve se lit sur la page de CHAQUE université, lue une par une. Hanovre : ouvert jusqu'au 30 septembre 2026."
  },
  {
    "collection": "programs",
    "id": "universitat-hamburg-hamburg__deutschlandstipendium",
    "attendu": {
      "status": "Ouverte",
      "deadline": "Aucune date nationale : la candidature se fait directement auprès de l'université fréquentée, qui fixe son propre calendrier et ses propres critères. Ouverte aux étudiants de toute nationalité, dès le premier semestre. Consulter la page Deutschlandstipendium de l'université visée.",
      "deadlineISO": undefined,
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "status": "Fermée — ouverture en octobre 2026",
      "deadline": "Bourse 2027 (versée de janvier à décembre 2027) : candidatures du 5 octobre jusqu'au 25 octobre 2026, réservées aux étudiants déjà inscrits à l'Université de Hambourg.",
      "deadlineISO": "2026-10-25",
      "sourceVerification": {
        "url": "https://www.uni-hamburg.de/en/deutschlandstipendium/bewerber.html",
        "citation": "Applications for the Deutschlandstipendium grant (payable from January to December 2027) open on October 5, 2026 and close on October 25, 2026. Only University of Hamburg students can apply.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la bourse n'a pas de calendrier national ; la preuve se lit sur la page de CHAQUE université, lue une par une. Hambourg : fenêtre du 5 au 25 octobre 2026, réservée aux inscrits ; la fiche disait « Ouverte »."
  },
  {
    "collection": "programs",
    "id": "humboldt-universitat-zu-berlin-berlin__deutschlandstipendium",
    "attendu": {
      "status": "Ouverte",
      "deadline": "Aucune date nationale : la candidature se fait directement auprès de l'université fréquentée, qui fixe son propre calendrier et ses propres critères. Ouverte aux étudiants de toute nationalité, dès le premier semestre. Consulter la page Deutschlandstipendium de l'université visée.",
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "status": "Fermée — appel annoncé en octobre 2026",
      "deadline": "Attribuées une fois par an, au début du semestre d'été : la période de candidature pour 2027/28 sera annoncée en octobre 2026 sur le site Deutschlandstipendium de la Humboldt-Universität. Il faut être inscrit ou admis à la Humboldt-Universität pour postuler.",
      "sourceVerification": {
        "url": "https://deutschlandstipendium.hu-berlin.de/en/receive-funding/bewerbungsverfahren",
        "citation": "The Deutschlandstipendien at the Humboldt-Universität are awarded once a year, at the beginning of the summer semester. The application phase for the funding period 2027/28 will be announced on this website in October 2026.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la bourse n'a pas de calendrier national ; la preuve se lit sur la page de CHAQUE université, lue une par une. Humboldt : appel 2027/28 annoncé pour octobre 2026 ; la fiche disait « Ouverte »."
  },
  {
    "collection": "programs",
    "id": "istanbul-university-istanbul__diyanet-tdv-international__doctorat",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-22"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://diyanetburslari.tdv.org/en/uluslararasi-ilahiyat-lisans-programi/",
        "citation": "Üniversite Burs Başvuruları henüz aktif değildir. İlerleyen günlerde başvurular açılacaktır.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : le portail, toujours en maintenance, porte la phrase que le lot 70 avait résumée (« dans les prochains jours ») : elle est citée mot pour mot."
  },
  {
    "collection": "programs",
    "id": "istanbul-university-istanbul__diyanet-tdv-international__licence",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-22"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://diyanetburslari.tdv.org/en/uluslararasi-ilahiyat-lisans-programi/",
        "citation": "Üniversite Burs Başvuruları henüz aktif değildir. İlerleyen günlerde başvurular açılacaktır.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : le portail, toujours en maintenance, porte la phrase que le lot 70 avait résumée (« dans les prochains jours ») : elle est citée mot pour mot."
  },
  {
    "collection": "programs",
    "id": "istanbul-university-istanbul__diyanet-tdv-international__master",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-22"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://diyanetburslari.tdv.org/en/uluslararasi-ilahiyat-lisans-programi/",
        "citation": "Üniversite Burs Başvuruları henüz aktif değildir. İlerleyen günlerde başvurular açılacaktır.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : le portail, toujours en maintenance, porte la phrase que le lot 70 avait résumée (« dans les prochains jours ») : elle est citée mot pour mot."
  },
  {
    "collection": "programs",
    "id": "universite-cadi-ayyad-marrakech__bourse-gouvernement-maroc-amci",
    "attendu": {
      "status": "Ouverte",
      "deadline": "Aucune date publiée par l'AMCI : les bourses du Royaume du Maroc sont attribuées par quotas aux pays partenaires et la candidature se dépose auprès de l'autorité nationale du candidat (ministère ou direction des bourses), qui fixe son calendrier, en général entre juin et août pour la rentrée de septembre.",
      "deadlineISO": undefined,
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "status": "Fermée",
      "deadline": "Au Sénégal, l'appel 2026-2027 est terminé : 260 bourses (surtout en licence, avec 5 places de master et 2 de doctorat), dossiers papier et PDF sur clé USB reçus à la Direction des bourses, à Dakar, jusqu'au 14 juillet 2026. Dans les autres pays partenaires, l'appel est publié par l'autorité nationale, en général entre juin et août pour la rentrée de septembre ; le formulaire se télécharge sur amci.ma.",
      "deadlineISO": "2026-07-14",
      "sourceVerification": {
        "url": "https://mesrisenegal.sn/2026/07/07/260-bourses-detudes-du-royaume-du-maroc-offertes-aux-etudiants-senegalais-pour-2026-2027/",
        "citation": "Les dossiers de candidature en version papier et en version numérique PDF sous clé usb sont reçus à la Direction des Bourses, 52 rue Saint Michel (Ex Docteur Thèse) – Face Immeuble Centre Commercial la Rotonde, jusqu'au mardi 14 juillet 2026, délai de rigueur.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La page de l'AMCI ne publie aucun calendrier ; le communiqué du ministère sénégalais de l'Enseignement supérieur (publié le 7 juillet 2026, en images — lu à l'écran) le donne : 260 bourses du Royaume du Maroc pour 2026-2027, dossiers reçus à la Direction des bourses jusqu'au 14 juillet 2026. Les trois programmes affichaient « Ouverte » : ils sont FERMÉS. Citation recopiée de la troisième page du communiqué."
  },
  {
    "collection": "programs",
    "id": "universite-hassan-ii-casablanca__bourse-gouvernement-maroc-amci",
    "attendu": {
      "status": "Ouverte",
      "deadline": "Aucune date publiée par l'AMCI : les bourses du Royaume du Maroc sont attribuées par quotas aux pays partenaires et la candidature se dépose auprès de l'autorité nationale du candidat (ministère ou direction des bourses), qui fixe son calendrier, en général entre juin et août pour la rentrée de septembre.",
      "deadlineISO": undefined,
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "status": "Fermée",
      "deadline": "Au Sénégal, l'appel 2026-2027 est terminé : 260 bourses (surtout en licence, avec 5 places de master et 2 de doctorat), dossiers papier et PDF sur clé USB reçus à la Direction des bourses, à Dakar, jusqu'au 14 juillet 2026. Dans les autres pays partenaires, l'appel est publié par l'autorité nationale, en général entre juin et août pour la rentrée de septembre ; le formulaire se télécharge sur amci.ma.",
      "deadlineISO": "2026-07-14",
      "sourceVerification": {
        "url": "https://mesrisenegal.sn/2026/07/07/260-bourses-detudes-du-royaume-du-maroc-offertes-aux-etudiants-senegalais-pour-2026-2027/",
        "citation": "Les dossiers de candidature en version papier et en version numérique PDF sous clé usb sont reçus à la Direction des Bourses, 52 rue Saint Michel (Ex Docteur Thèse) – Face Immeuble Centre Commercial la Rotonde, jusqu'au mardi 14 juillet 2026, délai de rigueur.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La page de l'AMCI ne publie aucun calendrier ; le communiqué du ministère sénégalais de l'Enseignement supérieur (publié le 7 juillet 2026, en images — lu à l'écran) le donne : 260 bourses du Royaume du Maroc pour 2026-2027, dossiers reçus à la Direction des bourses jusqu'au 14 juillet 2026. Les trois programmes affichaient « Ouverte » : ils sont FERMÉS. Citation recopiée de la troisième page du communiqué."
  },
  {
    "collection": "programs",
    "id": "universite-mohammed-v-rabat__bourse-gouvernement-maroc-amci",
    "attendu": {
      "status": "Ouverte",
      "deadline": "Aucune date publiée par l'AMCI : les bourses du Royaume du Maroc sont attribuées par quotas aux pays partenaires et la candidature se dépose auprès de l'autorité nationale du candidat (ministère ou direction des bourses), qui fixe son calendrier, en général entre juin et août pour la rentrée de septembre.",
      "deadlineISO": undefined,
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "status": "Fermée",
      "deadline": "Au Sénégal, l'appel 2026-2027 est terminé : 260 bourses (surtout en licence, avec 5 places de master et 2 de doctorat), dossiers papier et PDF sur clé USB reçus à la Direction des bourses, à Dakar, jusqu'au 14 juillet 2026. Dans les autres pays partenaires, l'appel est publié par l'autorité nationale, en général entre juin et août pour la rentrée de septembre ; le formulaire se télécharge sur amci.ma.",
      "deadlineISO": "2026-07-14",
      "sourceVerification": {
        "url": "https://mesrisenegal.sn/2026/07/07/260-bourses-detudes-du-royaume-du-maroc-offertes-aux-etudiants-senegalais-pour-2026-2027/",
        "citation": "Les dossiers de candidature en version papier et en version numérique PDF sous clé usb sont reçus à la Direction des Bourses, 52 rue Saint Michel (Ex Docteur Thèse) – Face Immeuble Centre Commercial la Rotonde, jusqu'au mardi 14 juillet 2026, délai de rigueur.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La page de l'AMCI ne publie aucun calendrier ; le communiqué du ministère sénégalais de l'Enseignement supérieur (publié le 7 juillet 2026, en images — lu à l'écran) le donne : 260 bourses du Royaume du Maroc pour 2026-2027, dossiers reçus à la Direction des bourses jusqu'au 14 juillet 2026. Les trois programmes affichaient « Ouverte » : ils sont FERMÉS. Citation recopiée de la troisième page du communiqué."
  },
  {
    "collection": "scholarships",
    "id": "bourse-gouvernement-maroc-amci",
    "attendu": {
      "status": "Ouverte",
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.amci.ma/cooperation-academique"
    },
    "champs": {
      "status": "Fermée — appel 2026-2027 terminé au Sénégal",
      "verifieLe": "2026-09-22",
      "sourceEcheance": "https://mesrisenegal.sn/2026/07/07/260-bourses-detudes-du-royaume-du-maroc-offertes-aux-etudiants-senegalais-pour-2026-2027/"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La page de l'AMCI ne publie aucun calendrier ; le communiqué du ministère sénégalais de l'Enseignement supérieur (publié le 7 juillet 2026, en images — lu à l'écran) le donne : 260 bourses du Royaume du Maroc pour 2026-2027, dossiers reçus à la Direction des bourses jusqu'au 14 juillet 2026. Les trois programmes affichaient « Ouverte » : ils sont FERMÉS. Citation recopiée de la troisième page du communiqué."
  },
  {
    "collection": "programs",
    "id": "hse-university-moscow__open-doors-scholarship",
    "attendu": {
      "deadlineISO": undefined,
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "deadlineISO": "2026-11-01",
      "sourceVerification": {
        "url": "https://od.globaluni.ru/",
        "citation": "1 November 2026 Open Doors registration deadline",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : le calendrier du site officiel confirme l'échéance déjà écrite : inscriptions jusqu'au 1er novembre 2026. La date devient une date VÉRIFIÉE (deadlineISO), que le moteur peut proposer avec certitude."
  },
  {
    "collection": "programs",
    "id": "rudn-university-moscow__open-doors-scholarship",
    "attendu": {
      "deadlineISO": undefined,
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "deadlineISO": "2026-11-01",
      "sourceVerification": {
        "url": "https://od.globaluni.ru/",
        "citation": "1 November 2026 Open Doors registration deadline",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : le calendrier du site officiel confirme l'échéance déjà écrite : inscriptions jusqu'au 1er novembre 2026. La date devient une date VÉRIFIÉE (deadlineISO), que le moteur peut proposer avec certitude."
  },
  {
    "collection": "programs",
    "id": "jagiellonian-university-cracovie__nawa-banach-scholarship",
    "attendu": {
      "status": "Fermée",
      "deadline": "Aucun appel en cours sur la page NAWA (seuls des appels terminé, de 2018 à 2025). Le programme ouvre d'habitude au printemps, avec une clôture vers avril-mai, pour les ressortissants des 36 pays de l'aide polonaise (Europe de l'Est, Asie, Afrique, Amérique latine).",
      "deadlineISO": undefined,
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "status": "Fermée",
      "deadline": "Appel 2026 (n° 16/2026) terminé : dépôt en ligne jusqu'au 8 mai 2026 à 15h (heure de Varsovie), ou plus tôt pour un groupe de pays dont le quota de dossiers était atteint. Ouvert aux ressortissants de 36 pays de l'aide polonaise au développement, dont le Sénégal, titulaires d'une licence récente (obtenue en 2024 ou après pour l'appel 2026) et d'un niveau B2 en anglais ou en polonais. Le prochain appel est attendu au printemps 2027.",
      "deadlineISO": "2026-05-08",
      "sourceVerification": {
        "url": "https://nawa.gov.pl/images/Banach/2026/Banach-2026---Call-for-applications-EN.pdf",
        "citation": "The call for applications will continue until May 8, 2026, 3:00:00 p.m. local time (Warsaw) or until 300 applications are submitted in each of country groups no. 1-3 and 200 applications in the group no. 4",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). Le texte des programmes disait « aucun appel en cours, seuls des appels terminés de 2018 à 2025 » : FAUX. L'appel n° 16/2026 du 13 avril 2026 (PDF lu par pdf.js ; « 202 6 » et « 3 :00:00 » recollés) courait jusqu'au 8 mai 2026, et le SÉNÉGAL figure parmi les 36 pays éligibles. La bourse était inactive sans motif écrit dans aucun lot ; réactivée (réversible) : c'est une bourse de master complète (2 500 PLN par mois, frais exonérés) ouverte aux Sénégalais, dont l'appel revient chaque printemps."
  },
  {
    "collection": "programs",
    "id": "university-of-warsaw-varsovie__nawa-banach-scholarship",
    "attendu": {
      "status": "Fermée",
      "deadline": "Aucun appel en cours sur la page NAWA (seuls des appels terminé, de 2018 à 2025). Le programme ouvre d'habitude au printemps, avec une clôture vers avril-mai, pour les ressortissants des 36 pays de l'aide polonaise (Europe de l'Est, Asie, Afrique, Amérique latine).",
      "deadlineISO": undefined,
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "status": "Fermée",
      "deadline": "Appel 2026 (n° 16/2026) terminé : dépôt en ligne jusqu'au 8 mai 2026 à 15h (heure de Varsovie), ou plus tôt pour un groupe de pays dont le quota de dossiers était atteint. Ouvert aux ressortissants de 36 pays de l'aide polonaise au développement, dont le Sénégal, titulaires d'une licence récente (obtenue en 2024 ou après pour l'appel 2026) et d'un niveau B2 en anglais ou en polonais. Le prochain appel est attendu au printemps 2027.",
      "deadlineISO": "2026-05-08",
      "sourceVerification": {
        "url": "https://nawa.gov.pl/images/Banach/2026/Banach-2026---Call-for-applications-EN.pdf",
        "citation": "The call for applications will continue until May 8, 2026, 3:00:00 p.m. local time (Warsaw) or until 300 applications are submitted in each of country groups no. 1-3 and 200 applications in the group no. 4",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). Le texte des programmes disait « aucun appel en cours, seuls des appels terminés de 2018 à 2025 » : FAUX. L'appel n° 16/2026 du 13 avril 2026 (PDF lu par pdf.js ; « 202 6 » et « 3 :00:00 » recollés) courait jusqu'au 8 mai 2026, et le SÉNÉGAL figure parmi les 36 pays éligibles. La bourse était inactive sans motif écrit dans aucun lot ; réactivée (réversible) : c'est une bourse de master complète (2 500 PLN par mois, frais exonérés) ouverte aux Sénégalais, dont l'appel revient chaque printemps."
  },
  {
    "collection": "scholarships",
    "id": "nawa-banach-scholarship",
    "attendu": {
      "isActive": false,
      "eligibility": {
        "note": "Ouverte aux ressortissants de 36 pays couverts par l'aide polonaise au développement (Europe de l'Est, Asie, Afrique, Amérique latine) ; la liste exacte figure dans l'appel de l'année et doit être vérifiée avant de candidater."
      },
      "exigences": [],
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://nawa.gov.pl/en/students/foreign-students/the-banach-scholarship-programme/"
    },
    "champs": {
      "isActive": true,
      "eligibility": {
        "scope": "liste",
        "include": [
          "AL",
          "AO",
          "AR",
          "AM",
          "AZ",
          "BY",
          "BA",
          "BR",
          "GE",
          "IN",
          "ID",
          "IQ",
          "IR",
          "JO",
          "KZ",
          "KE",
          "XK",
          "LB",
          "MX",
          "MD",
          "MN",
          "ME",
          "NG",
          "MK",
          "PS",
          "PG",
          "PE",
          "PH",
          "RW",
          "SN",
          "RS",
          "TZ",
          "TN",
          "UA",
          "UZ",
          "VN"
        ],
        "note": "Appel 2026 : ressortissants de 36 pays de l'aide polonaise au développement, dont le Sénégal, le Kenya, le Nigeria, le Rwanda, la Tanzanie, la Tunisie et l'Angola en Afrique. La liste est revue à chaque appel."
      },
      "exigences": [
        "diplome_recent",
        "certification_langue_requise"
      ],
      "verifieLe": "2026-09-22",
      "sourceEcheance": "https://nawa.gov.pl/en/students/foreign-students/the-banach-scholarship-programme/call-for-proposals"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). Le texte des programmes disait « aucun appel en cours, seuls des appels terminés de 2018 à 2025 » : FAUX. L'appel n° 16/2026 du 13 avril 2026 (PDF lu par pdf.js ; « 202 6 » et « 3 :00:00 » recollés) courait jusqu'au 8 mai 2026, et le SÉNÉGAL figure parmi les 36 pays éligibles. La bourse était inactive sans motif écrit dans aucun lot ; réactivée (réversible) : c'est une bourse de master complète (2 500 PLN par mois, frais exonérés) ouverte aux Sénégalais, dont l'appel revient chaque printemps."
  },
  {
    "collection": "programs",
    "id": "unina-bachelor",
    "attendu": {
      "status": "Ouverte",
      "deadline": "Bando 2026-2027 approuvé fin juillet ; la date limite de dépôt n'apparaît pas sur la page d'accueil, elle est dans le bando (espace réservé ADISURC). Bourse régionale de droit à l'étude pour « studenti capaci e meritevoli anche se privi di mezzi », sur revenus (ISEE) et mérite.",
      "deadlineISO": undefined,
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "status": "Fermée",
      "deadline": "Bando 2026-2027 terminé : demande en ligne jusqu'au 10 septembre 2026 à midi, dans l'espace réservé du site d'ADISURC (étudiants étrangers : identifiants obtenus lors de l'accréditation). L'ISEE parificato s'obtient auprès d'un centre d'assistance fiscale (CAF) conventionné. Bourse régionale de droit à l'étude pour « studenti capaci e meritevoli anche se privi di mezzi », sur revenus (ISEE) et mérite.",
      "deadlineISO": "2026-09-10",
      "sourceVerification": {
        "url": "https://www.adisurcampania.it/notizie/approvazione-bando-di-concorso-20262027",
        "citation": "La scadenza del concorso è fissata alle ore 12:00 del giorno 10 settembre 2026.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). L'annonce du bando 2026-2027 (24 juillet 2026) fixe la clôture au 10 septembre 2026 à midi. La bourse et ses deux programmes affichaient « Ouverte » : ils sont FERMÉS."
  },
  {
    "collection": "programs",
    "id": "unina-master",
    "attendu": {
      "status": "Ouverte",
      "deadline": "Bando 2026-2027 approuvé fin juillet ; la date limite de dépôt n'apparaît pas sur la page d'accueil, elle est dans le bando (espace réservé ADISURC). Bourse régionale de droit à l'étude pour « studenti capaci e meritevoli anche se privi di mezzi », sur revenus (ISEE) et mérite.",
      "deadlineISO": undefined,
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "status": "Fermée",
      "deadline": "Bando 2026-2027 terminé : demande en ligne jusqu'au 10 septembre 2026 à midi, dans l'espace réservé du site d'ADISURC (étudiants étrangers : identifiants obtenus lors de l'accréditation). L'ISEE parificato s'obtient auprès d'un centre d'assistance fiscale (CAF) conventionné. Bourse régionale de droit à l'étude pour « studenti capaci e meritevoli anche se privi di mezzi », sur revenus (ISEE) et mérite.",
      "deadlineISO": "2026-09-10",
      "sourceVerification": {
        "url": "https://www.adisurcampania.it/notizie/approvazione-bando-di-concorso-20262027",
        "citation": "La scadenza del concorso è fissata alle ore 12:00 del giorno 10 settembre 2026.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). L'annonce du bando 2026-2027 (24 juillet 2026) fixe la clôture au 10 septembre 2026 à midi. La bourse et ses deux programmes affichaient « Ouverte » : ils sont FERMÉS."
  },
  {
    "collection": "scholarships",
    "id": "campania-regional-scholarship",
    "attendu": {
      "status": "Ouverte",
      "periodeOuverture": "bando annuel publié en juillet, clôture généralement en septembre (à recouper sur la page officielle sur le bando)",
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.adisurcampania.it/"
    },
    "champs": {
      "status": "Fermée — bando 2026-2027 terminé",
      "periodeOuverture": "bando annuel publié entre juillet et août, clôture début septembre",
      "verifieLe": "2026-09-22",
      "sourceEcheance": "https://www.adisurcampania.it/notizie/approvazione-bando-di-concorso-20262027"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). L'annonce du bando 2026-2027 (24 juillet 2026) fixe la clôture au 10 septembre 2026 à midi. La bourse et ses deux programmes affichaient « Ouverte » : ils sont FERMÉS."
  },
  {
    "collection": "programs",
    "id": "university-of-lisbon-lisbonne__bolsas-cooperacao-camoes",
    "attendu": {
      "status": "Ouverte",
      "deadline": "La date limite DÉPEND DU PAYS : la candidature se dépose exclusivement dans le pays d'origine auprès de l'autorité nationale compétente, en lien avec l'ambassade du Portugal. Réservé aux ressortissants de neuf pays : Angola, Cap-Vert, Colombie, Éthiopie, Guinée-Bissau, Mozambique, São Tomé-et-Príncipe, Sénégal et Timor-Leste.",
      "deadlineISO": undefined,
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "status": "Fermée",
      "deadline": "La candidature se dépose uniquement dans le pays d'origine, auprès de l'autorité nationale compétente, en lien avec l'ambassade du Portugal. Au Sénégal, l'appel 2026-2027 (deux bourses de master seulement) est terminé : dossiers déposés à l'ambassade du Portugal à Dakar au plus tard le 31 juillet 2026. Réservé aux ressortissants de neuf pays : Angola, Cap-Vert, Colombie, Éthiopie, Guinée-Bissau, Mozambique, São Tomé-et-Príncipe, Sénégal et Timor-Leste.",
      "deadlineISO": "2026-07-31",
      "sourceVerification": {
        "url": "https://mesrisenegal.sn/2026/07/08/deux-bourses-de-master-au-portugal-ouvertes-aux-etudiants-senegalais-pour-2026-2027/",
        "citation": "Les dossiers de candidatures doivent être déposés auprès de l'Ambassade du Portugal à Dakar, au plus tard le 31 juillet 2026.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). Deux corrections. (1) L'éligibilité de la BOURSE disait « Le Sénégal n'est pas concerné » : FAUX — la page officielle de Camões, I.P. liste neuf pays, Sénégal compris, et le texte des programmes le disait déjà. L'éligibilité devient une liste. (2) Au Sénégal, le communiqué du ministère du 7 juillet 2026 (en image, lu à l'écran) annonçait deux bourses de master, dossiers à l'ambassade du Portugal au plus tard le 31 juillet 2026 : les programmes affichaient « Ouverte », ils sont FERMÉS."
  },
  {
    "collection": "programs",
    "id": "university-of-porto-porto__bolsas-cooperacao-camoes",
    "attendu": {
      "status": "Ouverte",
      "deadline": "La date limite DÉPEND DU PAYS : la candidature se dépose exclusivement dans le pays d'origine auprès de l'autorité nationale compétente, en lien avec l'ambassade du Portugal. Réservé aux ressortissants de neuf pays : Angola, Cap-Vert, Colombie, Éthiopie, Guinée-Bissau, Mozambique, São Tomé-et-Príncipe, Sénégal et Timor-Leste.",
      "deadlineISO": undefined,
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "status": "Fermée",
      "deadline": "La candidature se dépose uniquement dans le pays d'origine, auprès de l'autorité nationale compétente, en lien avec l'ambassade du Portugal. Au Sénégal, l'appel 2026-2027 (deux bourses de master seulement) est terminé : dossiers déposés à l'ambassade du Portugal à Dakar au plus tard le 31 juillet 2026. Réservé aux ressortissants de neuf pays : Angola, Cap-Vert, Colombie, Éthiopie, Guinée-Bissau, Mozambique, São Tomé-et-Príncipe, Sénégal et Timor-Leste.",
      "deadlineISO": "2026-07-31",
      "sourceVerification": {
        "url": "https://mesrisenegal.sn/2026/07/08/deux-bourses-de-master-au-portugal-ouvertes-aux-etudiants-senegalais-pour-2026-2027/",
        "citation": "Les dossiers de candidatures doivent être déposés auprès de l'Ambassade du Portugal à Dakar, au plus tard le 31 juillet 2026.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). Deux corrections. (1) L'éligibilité de la BOURSE disait « Le Sénégal n'est pas concerné » : FAUX — la page officielle de Camões, I.P. liste neuf pays, Sénégal compris, et le texte des programmes le disait déjà. L'éligibilité devient une liste. (2) Au Sénégal, le communiqué du ministère du 7 juillet 2026 (en image, lu à l'écran) annonçait deux bourses de master, dossiers à l'ambassade du Portugal au plus tard le 31 juillet 2026 : les programmes affichaient « Ouverte », ils sont FERMÉS."
  },
  {
    "collection": "scholarships",
    "id": "bolsas-cooperacao-camoes",
    "attendu": {
      "status": "Ouverte",
      "eligibility": {
        "note": "Bourses de la coopération portugaise, destinées aux pays africains de langue officielle portugaise — Angola, Cap-Vert, Guinée-Bissau, Mozambique, São Tomé-et-Príncipe — et au Timor-Leste. Le Sénégal n'est pas concerné."
      },
      "verifieLe": "2026-09-05"
    },
    "champs": {
      "status": "Fermée — appel 2026-2027 terminé au Sénégal",
      "eligibility": {
        "scope": "liste",
        "include": [
          "AO",
          "CV",
          "CO",
          "ET",
          "GW",
          "MZ",
          "ST",
          "SN",
          "TL"
        ],
        "note": "Ressortissants des neuf pays avec lesquels le Portugal mène un programme de coopération : Angola, Cap-Vert, Colombie, Éthiopie, Guinée-Bissau, Mozambique, São Tomé-et-Príncipe, Sénégal et Timor-Leste (liste officielle de Camões, I.P.)."
      },
      "verifieLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). Deux corrections. (1) L'éligibilité de la BOURSE disait « Le Sénégal n'est pas concerné » : FAUX — la page officielle de Camões, I.P. liste neuf pays, Sénégal compris, et le texte des programmes le disait déjà. L'éligibilité devient une liste. (2) Au Sénégal, le communiqué du ministère du 7 juillet 2026 (en image, lu à l'écran) annonçait deux bourses de master, dossiers à l'ambassade du Portugal au plus tard le 31 juillet 2026 : les programmes affichaient « Ouverte », ils sont FERMÉS."
  },
  {
    "collection": "programs",
    "id": "university-of-rwanda-kigali__mastercard-foundation-scholars-university-of-rwanda__master",
    "attendu": {
      "deadline": "Aucune date sur le portail : les candidatures se déposent via le portail en ligne du programme à l'Université du Rwanda, ouvert aux Rwandais, aux citoyens de tout pays africain, aux réfugiés et jeunes déplacés.",
      "deadlineISO": undefined,
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Recrutement 2026-2027 terminé : le portail de candidature du programme était ouvert du 23 juillet jusqu'au 22 août 2026, pour l'intake de master de l'Université du Rwanda. Réservé aux nouveaux admis, citoyens de tout pays africain, réfugiés ou jeunes déplacés en Afrique ; tout diplôme étranger doit être reconnu par le HEC et la NESA rwandais.",
      "deadlineISO": "2026-08-22",
      "sourceVerification": {
        "url": "https://mcfsprecruitment.ur.ac.rw/",
        "citation": "Scholarship Intake Applications Currently Closed Start Date 7/23/2026 End Date 8/22/2026 Status Closed",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : le portail de recrutement du programme affiche l'intake 2026-2027 de MASTER (postgraduate), ouvert du 23 juillet au 22 août 2026, clos. Aucun recrutement de licence n'y figure."
  },
  {
    "collection": "programs",
    "id": "university-of-rwanda-kigali__mastercard-foundation-scholars-university-of-rwanda__licence",
    "attendu": {
      "deadline": "Aucune date sur le portail : les candidatures se déposent via le portail en ligne du programme à l'Université du Rwanda, ouvert aux Rwandais, aux citoyens de tout pays africain, aux réfugiés et jeunes déplacés.",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "Aucun recrutement de licence affiché : à la lecture de septembre 2026, le portail du programme ne présente que l'intake de master 2026-2027, clos fin août. Candidatures, le moment venu, par ce portail en ligne ; ouvert aux citoyens de tout pays africain, aux réfugiés et aux jeunes déplacés.",
      "sourceVerification": {
        "url": "https://mcfsprecruitment.ur.ac.rw/",
        "citation": "Scholarship Intake Applications Currently Closed Start Date 7/23/2026 End Date 8/22/2026 Status Closed",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : le portail de recrutement du programme affiche l'intake 2026-2027 de MASTER (postgraduate), ouvert du 23 juillet au 22 août 2026, clos. Aucun recrutement de licence n'y figure."
  },
  {
    "collection": "programs",
    "id": "university-of-tokyo-tokyo__abe-initiative-jica__master",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-22"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://www.jica.go.jp/english/overseas/senegal/others/abe.html",
        "citation": "The application will be open from September to 16 October 2020; and the participants will be leaving for Japan in September 2021.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page du bureau JICA de Dakar (source de la fiche depuis le lot 70) porte le dernier calendrier publié, celui de la promotion 2021 : cité tel quel, le texte dit déjà son âge."
  },
  {
    "collection": "programs",
    "id": "waseda-university-tokyo__abe-initiative-jica__master",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-22"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://www.jica.go.jp/english/overseas/senegal/others/abe.html",
        "citation": "The application will be open from September to 16 October 2020; and the participants will be leaving for Japan in September 2021.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page du bureau JICA de Dakar (source de la fiche depuis le lot 70) porte le dernier calendrier publié, celui de la promotion 2021 : cité tel quel, le texte dit déjà son âge."
  },
  {
    "collection": "programs",
    "id": "university-of-tokyo-tokyo__mext-scholarship",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://www.studyinjapan.go.jp/en/planning/scholarships/mext-scholarships/",
        "citation": "There are two ways to apply for a Japanese Government Scholarship: by applying to the Ministry of Education, Culture, Sports, Science and Technology (MEXT) with a recommendation from a Japanese embassy or other Japanese diplomatic mission in your country, or by applying to the MEXT with a recommendation from a Japanese university.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page officielle fonde le texte (deux voies, ambassade ou université, sans date commune)."
  },
  {
    "collection": "programs",
    "id": "waseda-university-tokyo__mext-scholarship",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://www.studyinjapan.go.jp/en/planning/scholarships/mext-scholarships/",
        "citation": "There are two ways to apply for a Japanese Government Scholarship: by applying to the Ministry of Education, Culture, Sports, Science and Technology (MEXT) with a recommendation from a Japanese embassy or other Japanese diplomatic mission in your country, or by applying to the MEXT with a recommendation from a Japanese university.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page officielle fonde le texte (deux voies, ambassade ou université, sans date commune)."
  },
  {
    "collection": "programs",
    "id": "african-leadership-university-kigali__mastercard-foundation-scholars-alu__licence",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://www.alueducation.com/mastercard-foundation-scholars-program-at-alu/",
        "citation": "Aimed at enabling the most promising young leaders from across Africa to access an ALU education, despite financial adversity or economic hardship. The program implements a full scholarship programme and places particular emphasis on young women, refugees, and differently-abled young Africans.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page officielle porte la phrase qui fonde le texte du programme (aucune date propre : la bourse suit l'admission ou une procédure interne). Texte inchangé."
  },
  {
    "collection": "programs",
    "id": "ashesi-university-berekuso__ashesi-mastercard-foundation-scholars__licence",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://ashesi.edu.gh/the-mastercard-foundation-scholars-programme/",
        "citation": "Applicants do not choose which scholarship they may receive at Ashesi. Based on information in your general scholarship application, the Admissions and Financial Aid Office determines which award – including the Mastercard Foundation Scholars Program award – you may receive.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page officielle porte la phrase qui fonde le texte du programme (aucune date propre : la bourse suit l'admission ou une procédure interne). Texte inchangé."
  },
  {
    "collection": "programs",
    "id": "bocconi-master",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://www.unibocconi.it/en/applying-bocconi/master-science-and-ma-programs/funding/bocconi-graduate-merit-awards-ay-2026-27",
        "citation": "Academic profiles considered to be amongst the top applicants (International, Italian and Bocconi) will be considered for a Merit Award based on the admission's application submitted to Bocconi University. A separate application will not be required.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page officielle porte la phrase qui fonde le texte du programme (aucune date propre : la bourse suit l'admission ou une procédure interne). Texte inchangé."
  },
  {
    "collection": "programs",
    "id": "carnegie-mellon-university-africa-kigali__mastercard-foundation-scholars-cmu-africa__master",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://www.africa.engineering.cmu.edu/impact/mastercard-foundation-scholars.html",
        "citation": "In order to be considered for the Mastercard Foundation Scholars Program, students must first be admitted to one of CMU-Africa's degree programs.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page officielle porte la phrase qui fonde le texte du programme (aucune date propre : la bourse suit l'admission ou une procédure interne). Texte inchangé."
  },
  {
    "collection": "programs",
    "id": "corvinus-university-of-budapest-budapest__corvinus-scholarship",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://www.uni-corvinus.hu/main-page/life-at-corvinus/scholarship/corvinus-scholarship-2/?lang=en",
        "citation": "The University may award Corvinus Scholarships to students admitted to self-funded programmes, subject to their performance, as a cash benefit in order to take over all or part of their tuition fees payable for a semester (partial) scholarship).",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page officielle porte la phrase qui fonde le texte du programme (aucune date propre : la bourse suit l'admission ou une procédure interne). Texte inchangé."
  },
  {
    "collection": "programs",
    "id": "hse-university-moscow__hse-merit-scholarships",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://www.hse.ru/en/news/admission/229679392.html",
        "citation": "Scholarships are offered as a tuition discount for international students and take effect at the time of their enrolment in HSE.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page officielle porte la phrase qui fonde le texte du programme (aucune date propre : la bourse suit l'admission ou une procédure interne). Texte inchangé."
  },
  {
    "collection": "programs",
    "id": "korea-university-seoul__ku-global-leader-scholarship",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://graduate2.korea.ac.kr/scholarship/scholarships.html",
        "citation": "Both admission evaluation and scholarship award evaluation will be conducted automatically and simultaneously.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page officielle porte la phrase qui fonde le texte du programme (aucune date propre : la bourse suit l'admission ou une procédure interne). Texte inchangé."
  },
  {
    "collection": "programs",
    "id": "nanjing-university-nanjing__nanjing-government-scholarship",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-22"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://hwxy.nju.edu.cn/English/StudyatNJU/Scholarships/NanjingMunicipalScholarship/index.html",
        "citation": "Application Time 2024.07.01—2024.07.31",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page officielle porte la phrase qui fonde le texte du programme (aucune date propre : la bourse suit l'admission ou une procédure interne). Texte inchangé."
  },
  {
    "collection": "programs",
    "id": "politehnica-bucuresti-bucarest__politehnica-excellence-scholarship",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://international.upb.ro/education/learning-opportunities/scholarships-programs/politehnica-excellence-scholarship",
        "citation": "Applicants must be officially nominated through diplomatic channels by our authorized partners",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page officielle porte la phrase qui fonde le texte du programme (aucune date propre : la bourse suit l'admission ou une procédure interne). Texte inchangé."
  },
  {
    "collection": "programs",
    "id": "sabanci-university-istanbul__sabanci-graduate-scholarships",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://www.sabanciuniv.edu/en/graduate-scholarships",
        "citation": "Admission and scholarship decisions, which are based on academic merit, for applicants are made during the evaluation process.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page officielle porte la phrase qui fonde le texte du programme (aucune date propre : la bourse suit l'admission ou une procédure interne). Texte inchangé."
  },
  {
    "collection": "programs",
    "id": "seoul-national-university-seoul__snu-global-scholarship",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://en.snu.ac.kr/admission/graduate/scholarships/after_admission",
        "citation": "SNU Global Scholarship Application Period Upon receiving admissions from SNU",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page officielle porte la phrase qui fonde le texte du programme (aucune date propre : la bourse suit l'admission ou une procédure interne). Texte inchangé."
  },
  {
    "collection": "programs",
    "id": "universite-de-bucarest-bucarest__unibuc-international-scholarships",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://unibuc.ro/international/scholarships-and-financial-aid-offered-by-the-university-of-bucharest/?lang=en",
        "citation": "The submission of the application files for the financial support takes place in July of the academic year preceding the one for which the application is made, at the Office for International Cooperation and Foreign Students (BCISS), according to an established calendar.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page officielle porte la phrase qui fonde le texte du programme (aucune date propre : la bourse suit l'admission ou une procédure interne). Texte inchangé."
  },
  {
    "collection": "programs",
    "id": "university-of-tokyo-tokyo__utokyo-fellowship",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://www.u-tokyo.ac.jp/en/prospective-students/fellowship.html",
        "citation": "Applications must be submitted through the applicant's affiliated or prospective Graduate School.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page officielle porte la phrase qui fonde le texte du programme (aucune date propre : la bourse suit l'admission ou une procédure interne). Texte inchangé."
  },
  {
    "collection": "programs",
    "id": "waseda-university-tokyo__waseda-partial-tuition-waiver",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://www.waseda.jp/inst/scholarship/en/for-international-students/",
        "citation": "For (1) and (2), Students cannot apply on their own initiative. You will receive announcements from your department if you are eligible, but we cannot tell you exactly when, as the timing will vary depending on scholarships.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page officielle porte la phrase qui fonde le texte du programme (aucune date propre : la bourse suit l'admission ou une procédure interne). Texte inchangé."
  },
  {
    "collection": "programs",
    "id": "american-university-in-cairo-le-caire__auc-african-graduate-fellowship__master",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://www.aucegypt.edu/admissions/fellowships/deadlines",
        "citation": "Fellowship Application Cycle for Spring 2027 7 Oct Application Start Date 2 Nov Application Deadline",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page des échéances des fellowships (mise à jour le 23 août 2026) confirme le texte : cycle du printemps 2027 du 7 octobre au 2 novembre. La page n'écrit pas l'année à côté du jour : aucune deadlineISO n'est posée, la prose suffit."
  },
  {
    "collection": "programs",
    "id": "american-university-in-cairo-le-caire__auc-international-graduate-fellowship__master",
    "attendu": {
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "sourceVerification": {
        "url": "https://www.aucegypt.edu/admissions/fellowships/deadlines",
        "citation": "Fellowship Application Cycle for Spring 2027 7 Oct Application Start Date 2 Nov Application Deadline",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page des échéances des fellowships (mise à jour le 23 août 2026) confirme le texte : cycle du printemps 2027 du 7 octobre au 2 novembre. La page n'écrit pas l'année à côté du jour : aucune deadlineISO n'est posée, la prose suffit."
  },
  {
    "collection": "programs",
    "id": "bocconi-phd",
    "attendu": {
      "status": "Fermée — cycle 42 (2026-2027) achevé",
      "deadline": "Cycle 42 (rentrée 2026) : l'appel ordinaire est achevé ; un appel complémentaire FIS (Statistics and Computer Science) s'est achevé le 18 mai 2026 à 23h59 CET, après un mois d'ouverture depuis la mi-avril. L'appel du cycle 43 (rentrée 2027) n'est pas publié au 5 septembre 2026.",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "status": "Fermée — appel du cycle 43 attendu début novembre 2026",
      "deadline": "L'appel du cycle 43 (rentrée 2027-2028) ouvre début novembre 2026 ; sa date de clôture n'est pas encore publiée. Le cycle 42 (rentrée 2026) est achevé.",
      "sourceVerification": {
        "url": "https://www.unibocconi.it/en/programs/phd/admissions",
        "citation": "The Call for Application to the PhD Programs of the the 43rd cycle (a.y. 2027/2028) will open on November 3rd, 2026.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page des admissions PhD annonce l'ouverture de l'appel du cycle 43 (rentrée 2027-2028) le 3 novembre 2026 ; la fiche disait l'appel « non publié »."
  },
  {
    "collection": "scholarships",
    "id": "bocconi-phd-scholarship",
    "attendu": {
      "status": "Fermée — cycle 2026-2027 achevé, appel 2027-2028 non publié",
      "verifieLe": "2026-09-05",
      "sourceEcheance": "https://www.unibocconi.it/en/programs/phd/admissions"
    },
    "champs": {
      "status": "Fermée — appel 2027-2028 attendu début novembre 2026",
      "verifieLe": "2026-09-22",
      "sourceEcheance": "https://www.unibocconi.it/en/programs/phd/admissions"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page des admissions PhD annonce l'ouverture de l'appel du cycle 43 (rentrée 2027-2028) le 3 novembre 2026 ; la fiche disait l'appel « non publié »."
  },
  {
    "collection": "programs",
    "id": "imperial-college-london-london__imperial-presidents-phd-scholarships",
    "attendu": {
      "status": "Fermée",
      "deadline": "La page officielle affiche encore le calendrier 2026-27 : trois tours terminé le 3 novembre 2025, le 12 janvier 2026 et le 2 mars 2026. Le calendrier 2027-28 devrait suivre le même rythme (premier tour début novembre 2026) ; à recouper sur la page officielle. Il faut d'abord obtenir l'accord d'un directeur de thèse à Imperial.",
      "deadlineISO": undefined,
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "status": "Ouverte",
      "deadline": "Calendrier 2027-28 publié, en trois tours : le 2 novembre 2026, le 11 janvier 2027, ou jusqu'au 1er mars 2027 (23h59, heure britannique), avec une réponse fin janvier, mi-avril ou fin mai 2027. Il faut d'abord l'accord d'un directeur de thèse à Imperial, puis déposer la candidature d'admission ; rentrée entre août et novembre 2027.",
      "deadlineISO": "2027-03-01",
      "sourceVerification": {
        "url": "https://www.imperial.ac.uk/study/fees-and-funding/postgraduate-doctoral/grants-scholarships/presidents-phd/",
        "citation": "Applicants who apply by 23:59 (UK time) 2 November 2026 and are awarded a scholarship will be notified by 31 January 2027. Applicants who apply by 23:59 (UK time) 11 January 2027 and are awarded a scholarship will be notified by 15 April 2027. Applicants who apply by 23:59 (UK time) 1 March 2027 and are awarded a scholarship will be notified by 31 May 2027.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). Le calendrier 2027-28 est PUBLIÉ : trois tours (2 novembre 2026, 11 janvier 2027, 1er mars 2027, 23h59 heure britannique), allocation 2027-28 de 27 036 £. La fiche disait « Fermée » et « vagues 2027-28 attendues à l'automne 2026 » : la bourse est OUVERTE."
  },
  {
    "collection": "scholarships",
    "id": "imperial-presidents-phd-scholarships",
    "attendu": {
      "status": "Fermée",
      "funding": "Frais de scolarité intégraux ; allocation de 26 500 £ par an (taux 2026-27) pendant 3,5 ans ; 2 000 £ par an de budget consommables pendant les trois premières années ; accès aux programmes de l'Early Career Researcher Institute.",
      "generalCriteria": "Ouverte à TOUS les pays africains, Sénégal compris — aucune restriction de nationalité. Licence ou master intégré mention First Class, ou master autonome mention Distinction ; les parcours atypiques à fort potentiel de recherche sont également considérés. Le cycle se déroule en TROIS VAGUES : pour 2026-27, échéances du 3 novembre 2025, du 12 janvier 2026 et du 2 mars 2026 — toutes dépassées. Les vagues 2027-28 sont attendues à l'automne 2026.",
      "verifieLe": "2026-09-05"
    },
    "champs": {
      "status": "Ouverte — calendrier 2027-28",
      "funding": "Frais de scolarité intégraux ; allocation de 27 036 £ par an (taux 2027-28) pendant 3,5 ans ; 2 000 £ par an de budget consommables pendant les trois premières années ; accès aux programmes de l'Early Career Researcher Institute.",
      "generalCriteria": "Ouverte à TOUS les pays africains, Sénégal compris — aucune restriction de nationalité. Licence ou master intégré mention First Class, ou master autonome mention Distinction ; les parcours atypiques à fort potentiel de recherche sont également considérés. Le cycle se déroule en TROIS VAGUES : pour 2027-28, dépôt au plus tard le 2 novembre 2026, le 11 janvier 2027 ou le 1er mars 2027 (23h59, heure britannique) ; rentrée entre août et novembre 2027.",
      "verifieLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). Le calendrier 2027-28 est PUBLIÉ : trois tours (2 novembre 2026, 11 janvier 2027, 1er mars 2027, 23h59 heure britannique), allocation 2027-28 de 27 036 £. La fiche disait « Fermée » et « vagues 2027-28 attendues à l'automne 2026 » : la bourse est OUVERTE."
  },
  {
    "collection": "programs",
    "id": "university-of-california-berkeley-berkeley__mastercard-foundation-scholars-program",
    "attendu": {
      "deadline": "Programme de MASTER uniquement (201 étudiants de pays africains sur la durée du programme), avec une attention particulière aux femmes, aux personnes en situation de handicap et aux réfugiés ou déplacés. La page d'accueil ne publie aucune date limite ni aucun état des candidatures au 5 septembre : consulter la rubrique « Apply » du site.",
      "ouverteVerifieeLe": "2026-09-19"
    },
    "champs": {
      "deadline": "Programme de MASTER uniquement (201 étudiants de pays africains sur la durée du partenariat), avec une attention particulière aux femmes, aux personnes en situation de handicap et aux réfugiés ou déplacés. Il faut d'abord candidater à un master éligible de Berkeley, qui fixe sa propre date limite ; quand ce master a plusieurs tours d'admission, seuls les dossiers déposés au premier tour peuvent être présentés au programme. Recrutement prévu jusqu'à l'automne 2028.",
      "sourceVerification": {
        "url": "https://mcfscholarsprogram.berkeley.edu/apply-be-mastercard-foundation-scholar-uc-berkeley",
        "citation": "Master's degree applicants must first apply to an eligible master's degree program before they can be nominated for the Mastercard Foundations Scholars Program. If a graduate program has multilple admission rounds with staggered deadlines, only those who submit applications in the first round can be considered for the Scholars Program.",
        "le": "2026-09-22T22:30:00.000Z",
        "parUid": "IlXJmAScj2U5ucV2ctUgeJjadNd2"
      },
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La preuve posée par la campagne du 19-20 septembre n'avait AUCUNE phrase source (citation vide) : la page « Apply » (et non la page d'accueil, sans date) donne la règle qui compte : candidater à un master éligible, au PREMIER tour d'admission. Le texte disait « consulter la rubrique Apply » : il dit maintenant ce qu'elle contient. Fautes de frappe de la page conservées dans la citation."
  },
  {
    "collection": "programs",
    "id": "universite-grenoble-alpes-grenoble__uga-idex-master-scholarships__master",
    "attendu": {
      "deadline": "L'appel 2026-2027 est terminé (versements en octobre 2026 et février 2027). La page indique que les calendriers de candidature varient selon le master ; l'appel 2027-2028 n'est pas encore publié.",
      "ouverteVerifieeLe": "2026-09-20"
    },
    "champs": {
      "deadline": "L'appel 2026-2027 est terminé (versements en octobre 2026 et février 2027) ; sa page officielle n'est plus publique, et l'appel 2027-2028 n'est pas publié à la lecture de septembre 2026. Les calendriers de candidature varient selon le master.",
      "sourceVerification": null,
      "ouverteVerifieeLe": "2026-09-22"
    },
    "motif": "Relu à la source le 2026-09-22 (navigateur intégré). La page de l'appel 2026-2027 renvoie désormais vers le service d'authentification de l'université : plus rien de public à citer. La preuve à citation vide est RETIRÉE (null) ; le texte dit ce qui a été constaté."
  }
];
