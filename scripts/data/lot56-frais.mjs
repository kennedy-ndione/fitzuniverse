/**
 * ============================================================
 * LOT 56-FRAIS — Algérie et Tunisie, par grille nationale (13 sept. 2026)
 * ============================================================
 *
 * Neuf universités d'un coup, et pas par acharnement : les deux pays
 * publient une GRILLE NATIONALE qui s'applique à tous leurs
 * établissements publics. Une lecture, cinq universités algériennes ;
 * une autre, quatre tunisiennes. C'est le pari annoncé au lot 55 — le
 * meilleur rendement par heure de lecture — et il est tenu.
 *
 * ALGÉRIE. Le ministère (MESRS) publie sur la plateforme officielle
 * « Study in Algeria » un barème EN DOLLARS pour les étudiants
 * internationaux inscrits hors quota, c'est-à-dire autofinancés :
 * licence 1 000 USD en sciences et technologie et 800 USD en sciences
 * sociales, master 2 000 / 1 500, doctorat 3 000 / 2 500, diplôme
 * d'ingénieur 2 500, études médicales 3 000 et résidanat 4 500. Les
 * grandes écoles (ENS, polytechniques, ESI) sont à 3 000 ou 3 500 USD
 * et ne sont pas au catalogue.
 * Le vrai choc est ailleurs : le logement en résidence universitaire
 * coûte 15 USD PAR MOIS, la restauration 1,20 DZD le repas, et le
 * transport est au tarif des étudiants algériens. Le coût de la vie,
 * qui écrase les droits partout ailleurs, est ici négligeable.
 * PIÈGE RELEVÉ : le PDF porte en titre « 2025-2026 » alors que la page
 * qui le publie l'annonce comme la grille 2026-2027. C'est écrit dans
 * la note de chaque fiche, à recouper avant qu'un étudiant budgète.
 *
 * TUNISIE. Affiche officielle du MESRS, frais d'inscription ANNUELS en
 * dinars, fixés par l'arrêté du 16 octobre 2019 : licence 5 000 DT,
 * master 6 000 DT, doctorat 7 000 DT, diplôme d'ingénieur ou
 * d'architecte 9 000 DT, études médicales 15 000 DT. Ce barème vise le
 * candidat qui postule INDIVIDUELLEMENT — hors convention d'échange,
 * hors nomination par son pays.
 *
 * DANS LES DEUX CAS, LA MÊME STRUCTURE, ET C'EST ELLE QU'IL FAUT DIRE À
 * L'ÉTUDIANT : il existe une voie payante publiée, et une voie gratuite
 * par QUOTA BILATÉRAL où le candidat est présenté par son propre pays.
 * La seconde ne se demande pas à l'université mais au ministère de son
 * pays d'origine. C'est la même mécanique que la circulaire ARES en
 * Belgique (lot 54) : ce n'est pas l'établissement qui décide, c'est
 * une liste ou un quota négocié entre États.
 *
 * Nouvelle devise : TND. Seuil posé dans js/frais.js au cours moyen de
 * la Banque Centrale de Tunisie du 10/09/2026 (1 EUR = 3,3824 TND) — la
 * BCE ne cote pas le dinar tunisien.
 *
 * PAS FAIT : le Rwanda. ALU ne publie aucun tarif hors de son portail
 * de candidature ; AIMS, CMU-Africa et l'Université du Rwanda n'ont pas
 * été ouvertes. À reprendre.
 * ============================================================
 */

export const PATCHES = [
  {
    "collection": "universities",
    "id": "usthb-alger",
    "champs": {
      "fraisScolarite": {
        "source": "https://studyinalgeria.mesrs.dz//storage/Uploads/pages/22090/_full_curriculum_1744462721.pdf",
        "verifieLe": "2026-09-13",
        "note": "Grille NATIONALE du ministere algerien (MESRS), publiee sur la plateforme officielle « Study in Algeria » et libellee en DOLLARS. Elle s'applique aux etudiants internationaux inscrits « hors quota » (open enrollment), c'est-a-dire autofinances. Pour les universites : licence 1 000 USD en sciences et technologie, 800 USD en sciences sociales et humaines ; master 2 000 / 1 500 USD ; doctorat 3 000 / 2 500 USD ; diplome d'ingenieur 2 500 USD. Medecine a part : cycle preclinique et clinique 3 000 USD, residanat 4 500 USD. Les grandes ecoles (ENS, ecoles polytechniques, ESI) sont a 3 000 ou 3 500 USD, pas concernees ici. Le PDF porte en titre « 2025-2026 » alors que la page qui le publie l'annonce comme la grille 2026-2027 : recouper avant de budgeter. Les services universitaires sont d'un autre ordre de grandeur : logement en residence 15 USD PAR MOIS, restauration 1,20 DZD le repas, transport au tarif des etudiants algeriens. Un appartement de trois pieces en ville coute de 112 a 450 USD par mois selon la ville. Le paiement se fait a la Banque d'Algerie APRES obtention du visa. Montants retenus : la colonne sciences et technologie.",
        "licence": {
          "montant": 1000,
          "devise": "USD",
          "periode": "an"
        },
        "master": {
          "montant": 2000,
          "devise": "USD",
          "periode": "an"
        },
        "doctorat": {
          "montant": 3000,
          "devise": "USD",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Aucune exoneration pour un candidat autofinance : la grille « hors quota » est le tarif. La voie gratuite est celle de la BOURSE DU GOUVERNEMENT ALGERIEN, attribuee par quota bilateral via l'autorite nationale ou l'ambassade d'Algerie du pays du candidat — le boursier ne paie pas de droits et percoit une allocation mensuelle (1 350 DA en graduation, 1 650 DA en post-graduation). Les candidatures « hors quota » passent par la plateforme Study in Algeria, du 13 janvier au 30 juin, pour une rentree en octobre.",
        "source": "https://studyinalgeria.dz/pages/17157",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 56 (frais reels, Maghreb par grille nationale) — lu sur les documents officiels des ministeres le 2026-09-13 ; voir scripts/data/journal-frais-lot56-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "universite-abou-bekr-belkaid-tlemcen",
    "champs": {
      "fraisScolarite": {
        "source": "https://studyinalgeria.mesrs.dz//storage/Uploads/pages/22090/_full_curriculum_1744462721.pdf",
        "verifieLe": "2026-09-13",
        "note": "Grille NATIONALE du ministere algerien (MESRS), publiee sur la plateforme officielle « Study in Algeria » et libellee en DOLLARS. Elle s'applique aux etudiants internationaux inscrits « hors quota » (open enrollment), c'est-a-dire autofinances. Pour les universites : licence 1 000 USD en sciences et technologie, 800 USD en sciences sociales et humaines ; master 2 000 / 1 500 USD ; doctorat 3 000 / 2 500 USD ; diplome d'ingenieur 2 500 USD. Medecine a part : cycle preclinique et clinique 3 000 USD, residanat 4 500 USD. Les grandes ecoles (ENS, ecoles polytechniques, ESI) sont a 3 000 ou 3 500 USD, pas concernees ici. Le PDF porte en titre « 2025-2026 » alors que la page qui le publie l'annonce comme la grille 2026-2027 : recouper avant de budgeter. Les services universitaires sont d'un autre ordre de grandeur : logement en residence 15 USD PAR MOIS, restauration 1,20 DZD le repas, transport au tarif des etudiants algeriens. Un appartement de trois pieces en ville coute de 112 a 450 USD par mois selon la ville. Le paiement se fait a la Banque d'Algerie APRES obtention du visa. Montants retenus : la colonne sciences et technologie.",
        "licence": {
          "montant": 1000,
          "devise": "USD",
          "periode": "an"
        },
        "master": {
          "montant": 2000,
          "devise": "USD",
          "periode": "an"
        },
        "doctorat": {
          "montant": 3000,
          "devise": "USD",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Aucune exoneration pour un candidat autofinance : la grille « hors quota » est le tarif. La voie gratuite est celle de la BOURSE DU GOUVERNEMENT ALGERIEN, attribuee par quota bilateral via l'autorite nationale ou l'ambassade d'Algerie du pays du candidat — le boursier ne paie pas de droits et percoit une allocation mensuelle (1 350 DA en graduation, 1 650 DA en post-graduation). Les candidatures « hors quota » passent par la plateforme Study in Algeria, du 13 janvier au 30 juin, pour une rentree en octobre.",
        "source": "https://studyinalgeria.dz/pages/17157",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 56 (frais reels, Maghreb par grille nationale) — lu sur les documents officiels des ministeres le 2026-09-13 ; voir scripts/data/journal-frais-lot56-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "universite-alger-1-benyoucef-benkhedda-alger",
    "champs": {
      "fraisScolarite": {
        "source": "https://studyinalgeria.mesrs.dz//storage/Uploads/pages/22090/_full_curriculum_1744462721.pdf",
        "verifieLe": "2026-09-13",
        "note": "Grille NATIONALE du ministere algerien (MESRS), publiee sur la plateforme officielle « Study in Algeria » et libellee en DOLLARS. Elle s'applique aux etudiants internationaux inscrits « hors quota » (open enrollment), c'est-a-dire autofinances. Pour les universites : licence 1 000 USD en sciences et technologie, 800 USD en sciences sociales et humaines ; master 2 000 / 1 500 USD ; doctorat 3 000 / 2 500 USD ; diplome d'ingenieur 2 500 USD. Medecine a part : cycle preclinique et clinique 3 000 USD, residanat 4 500 USD. Les grandes ecoles (ENS, ecoles polytechniques, ESI) sont a 3 000 ou 3 500 USD, pas concernees ici. Le PDF porte en titre « 2025-2026 » alors que la page qui le publie l'annonce comme la grille 2026-2027 : recouper avant de budgeter. Les services universitaires sont d'un autre ordre de grandeur : logement en residence 15 USD PAR MOIS, restauration 1,20 DZD le repas, transport au tarif des etudiants algeriens. Un appartement de trois pieces en ville coute de 112 a 450 USD par mois selon la ville. Le paiement se fait a la Banque d'Algerie APRES obtention du visa. Montants retenus : la colonne sciences et technologie.",
        "licence": {
          "montant": 1000,
          "devise": "USD",
          "periode": "an"
        },
        "master": {
          "montant": 2000,
          "devise": "USD",
          "periode": "an"
        },
        "doctorat": {
          "montant": 3000,
          "devise": "USD",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Aucune exoneration pour un candidat autofinance : la grille « hors quota » est le tarif. La voie gratuite est celle de la BOURSE DU GOUVERNEMENT ALGERIEN, attribuee par quota bilateral via l'autorite nationale ou l'ambassade d'Algerie du pays du candidat — le boursier ne paie pas de droits et percoit une allocation mensuelle (1 350 DA en graduation, 1 650 DA en post-graduation). Les candidatures « hors quota » passent par la plateforme Study in Algeria, du 13 janvier au 30 juin, pour une rentree en octobre.",
        "source": "https://studyinalgeria.dz/pages/17157",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 56 (frais reels, Maghreb par grille nationale) — lu sur les documents officiels des ministeres le 2026-09-13 ; voir scripts/data/journal-frais-lot56-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "universite-constantine-1-freres-mentouri-constantine",
    "champs": {
      "fraisScolarite": {
        "source": "https://studyinalgeria.mesrs.dz//storage/Uploads/pages/22090/_full_curriculum_1744462721.pdf",
        "verifieLe": "2026-09-13",
        "note": "Grille NATIONALE du ministere algerien (MESRS), publiee sur la plateforme officielle « Study in Algeria » et libellee en DOLLARS. Elle s'applique aux etudiants internationaux inscrits « hors quota » (open enrollment), c'est-a-dire autofinances. Pour les universites : licence 1 000 USD en sciences et technologie, 800 USD en sciences sociales et humaines ; master 2 000 / 1 500 USD ; doctorat 3 000 / 2 500 USD ; diplome d'ingenieur 2 500 USD. Medecine a part : cycle preclinique et clinique 3 000 USD, residanat 4 500 USD. Les grandes ecoles (ENS, ecoles polytechniques, ESI) sont a 3 000 ou 3 500 USD, pas concernees ici. Le PDF porte en titre « 2025-2026 » alors que la page qui le publie l'annonce comme la grille 2026-2027 : recouper avant de budgeter. Les services universitaires sont d'un autre ordre de grandeur : logement en residence 15 USD PAR MOIS, restauration 1,20 DZD le repas, transport au tarif des etudiants algeriens. Un appartement de trois pieces en ville coute de 112 a 450 USD par mois selon la ville. Le paiement se fait a la Banque d'Algerie APRES obtention du visa. Montants retenus : la colonne sciences et technologie.",
        "licence": {
          "montant": 1000,
          "devise": "USD",
          "periode": "an"
        },
        "master": {
          "montant": 2000,
          "devise": "USD",
          "periode": "an"
        },
        "doctorat": {
          "montant": 3000,
          "devise": "USD",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Aucune exoneration pour un candidat autofinance : la grille « hors quota » est le tarif. La voie gratuite est celle de la BOURSE DU GOUVERNEMENT ALGERIEN, attribuee par quota bilateral via l'autorite nationale ou l'ambassade d'Algerie du pays du candidat — le boursier ne paie pas de droits et percoit une allocation mensuelle (1 350 DA en graduation, 1 650 DA en post-graduation). Les candidatures « hors quota » passent par la plateforme Study in Algeria, du 13 janvier au 30 juin, pour une rentree en octobre.",
        "source": "https://studyinalgeria.dz/pages/17157",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 56 (frais reels, Maghreb par grille nationale) — lu sur les documents officiels des ministeres le 2026-09-13 ; voir scripts/data/journal-frais-lot56-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "universite-oran-1-ahmed-ben-bella-oran",
    "champs": {
      "fraisScolarite": {
        "source": "https://studyinalgeria.mesrs.dz//storage/Uploads/pages/22090/_full_curriculum_1744462721.pdf",
        "verifieLe": "2026-09-13",
        "note": "Grille NATIONALE du ministere algerien (MESRS), publiee sur la plateforme officielle « Study in Algeria » et libellee en DOLLARS. Elle s'applique aux etudiants internationaux inscrits « hors quota » (open enrollment), c'est-a-dire autofinances. Pour les universites : licence 1 000 USD en sciences et technologie, 800 USD en sciences sociales et humaines ; master 2 000 / 1 500 USD ; doctorat 3 000 / 2 500 USD ; diplome d'ingenieur 2 500 USD. Medecine a part : cycle preclinique et clinique 3 000 USD, residanat 4 500 USD. Les grandes ecoles (ENS, ecoles polytechniques, ESI) sont a 3 000 ou 3 500 USD, pas concernees ici. Le PDF porte en titre « 2025-2026 » alors que la page qui le publie l'annonce comme la grille 2026-2027 : recouper avant de budgeter. Les services universitaires sont d'un autre ordre de grandeur : logement en residence 15 USD PAR MOIS, restauration 1,20 DZD le repas, transport au tarif des etudiants algeriens. Un appartement de trois pieces en ville coute de 112 a 450 USD par mois selon la ville. Le paiement se fait a la Banque d'Algerie APRES obtention du visa. Montants retenus : la colonne sciences et technologie.",
        "licence": {
          "montant": 1000,
          "devise": "USD",
          "periode": "an"
        },
        "master": {
          "montant": 2000,
          "devise": "USD",
          "periode": "an"
        },
        "doctorat": {
          "montant": 3000,
          "devise": "USD",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Aucune exoneration pour un candidat autofinance : la grille « hors quota » est le tarif. La voie gratuite est celle de la BOURSE DU GOUVERNEMENT ALGERIEN, attribuee par quota bilateral via l'autorite nationale ou l'ambassade d'Algerie du pays du candidat — le boursier ne paie pas de droits et percoit une allocation mensuelle (1 350 DA en graduation, 1 650 DA en post-graduation). Les candidatures « hors quota » passent par la plateforme Study in Algeria, du 13 janvier au 30 juin, pour une rentree en octobre.",
        "source": "https://studyinalgeria.dz/pages/17157",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 56 (frais reels, Maghreb par grille nationale) — lu sur les documents officiels des ministeres le 2026-09-13 ; voir scripts/data/journal-frais-lot56-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "universite-de-carthage-tunis",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.medecinesfax.org/useruploads/files/affiche%20Programme%20Payant.pdf",
        "verifieLe": "2026-09-13",
        "note": "Grille NATIONALE du ministere tunisien (MESRS), affiche officielle « Programme d'inscription des etudiants internationaux aux universites publiques », frais d'inscription ANNUELS en dinars : licence et bachelor (bac+3 et bac+4) 5 000 DT ; master (bac+5) 6 000 DT ; doctorat (bac+8) 7 000 DT ; diplome d'ingenieur et d'architecte 9 000 DT ; etudes medicales (medecine generale, dentaire, pharmacie) 15 000 DT. Le montant est fixe par l'arrete du ministre de l'enseignement superieur du 16 octobre 2019 et paye en dinars au debut de chaque annee universitaire. Il s'applique aux candidats qui postulent INDIVIDUELLEMENT, hors conventions d'echange et hors nomination par leur pays. Contact du ministere : international@mesrs.state.tn. Montants retenus : les lignes generales licence, master et doctorat — un cursus d'ingenieur ou d'architecte coute 9 000 DT et un cursus medical 15 000 DT dans le meme etablissement.",
        "licence": {
          "montant": 5000,
          "devise": "TND",
          "periode": "an"
        },
        "master": {
          "montant": 6000,
          "devise": "TND",
          "periode": "an"
        },
        "doctorat": {
          "montant": 7000,
          "devise": "TND",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Aucune reduction pour un candidat individuel : la grille nationale est le tarif. La voie exoneree est celle des CONVENTIONS DE COOPERATION bilaterale — le candidat est presente par son pays (quota), et il est alors dispense des frais d'inscription, parfois avec une bourse. Se renseigner aupres du ministere de l'enseignement superieur de son pays, pas aupres de l'universite tunisienne.",
        "source": "https://www.medecinesfax.org/useruploads/files/affiche%20Programme%20Payant.pdf",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 56 (frais reels, Maghreb par grille nationale) — lu sur les documents officiels des ministeres le 2026-09-13 ; voir scripts/data/journal-frais-lot56-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "universite-de-sfax-sfax",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.medecinesfax.org/useruploads/files/affiche%20Programme%20Payant.pdf",
        "verifieLe": "2026-09-13",
        "note": "Grille NATIONALE du ministere tunisien (MESRS), affiche officielle « Programme d'inscription des etudiants internationaux aux universites publiques », frais d'inscription ANNUELS en dinars : licence et bachelor (bac+3 et bac+4) 5 000 DT ; master (bac+5) 6 000 DT ; doctorat (bac+8) 7 000 DT ; diplome d'ingenieur et d'architecte 9 000 DT ; etudes medicales (medecine generale, dentaire, pharmacie) 15 000 DT. Le montant est fixe par l'arrete du ministre de l'enseignement superieur du 16 octobre 2019 et paye en dinars au debut de chaque annee universitaire. Il s'applique aux candidats qui postulent INDIVIDUELLEMENT, hors conventions d'echange et hors nomination par leur pays. Contact du ministere : international@mesrs.state.tn. Montants retenus : les lignes generales licence, master et doctorat — un cursus d'ingenieur ou d'architecte coute 9 000 DT et un cursus medical 15 000 DT dans le meme etablissement.",
        "licence": {
          "montant": 5000,
          "devise": "TND",
          "periode": "an"
        },
        "master": {
          "montant": 6000,
          "devise": "TND",
          "periode": "an"
        },
        "doctorat": {
          "montant": 7000,
          "devise": "TND",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Aucune reduction pour un candidat individuel : la grille nationale est le tarif. La voie exoneree est celle des CONVENTIONS DE COOPERATION bilaterale — le candidat est presente par son pays (quota), et il est alors dispense des frais d'inscription, parfois avec une bourse. Se renseigner aupres du ministere de l'enseignement superieur de son pays, pas aupres de l'universite tunisienne.",
        "source": "https://www.medecinesfax.org/useruploads/files/affiche%20Programme%20Payant.pdf",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 56 (frais reels, Maghreb par grille nationale) — lu sur les documents officiels des ministeres le 2026-09-13 ; voir scripts/data/journal-frais-lot56-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "universite-de-sousse-sousse",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.medecinesfax.org/useruploads/files/affiche%20Programme%20Payant.pdf",
        "verifieLe": "2026-09-13",
        "note": "Grille NATIONALE du ministere tunisien (MESRS), affiche officielle « Programme d'inscription des etudiants internationaux aux universites publiques », frais d'inscription ANNUELS en dinars : licence et bachelor (bac+3 et bac+4) 5 000 DT ; master (bac+5) 6 000 DT ; doctorat (bac+8) 7 000 DT ; diplome d'ingenieur et d'architecte 9 000 DT ; etudes medicales (medecine generale, dentaire, pharmacie) 15 000 DT. Le montant est fixe par l'arrete du ministre de l'enseignement superieur du 16 octobre 2019 et paye en dinars au debut de chaque annee universitaire. Il s'applique aux candidats qui postulent INDIVIDUELLEMENT, hors conventions d'echange et hors nomination par leur pays. Contact du ministere : international@mesrs.state.tn. Montants retenus : les lignes generales licence, master et doctorat — un cursus d'ingenieur ou d'architecte coute 9 000 DT et un cursus medical 15 000 DT dans le meme etablissement.",
        "licence": {
          "montant": 5000,
          "devise": "TND",
          "periode": "an"
        },
        "master": {
          "montant": 6000,
          "devise": "TND",
          "periode": "an"
        },
        "doctorat": {
          "montant": 7000,
          "devise": "TND",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Aucune reduction pour un candidat individuel : la grille nationale est le tarif. La voie exoneree est celle des CONVENTIONS DE COOPERATION bilaterale — le candidat est presente par son pays (quota), et il est alors dispense des frais d'inscription, parfois avec une bourse. Se renseigner aupres du ministere de l'enseignement superieur de son pays, pas aupres de l'universite tunisienne.",
        "source": "https://www.medecinesfax.org/useruploads/files/affiche%20Programme%20Payant.pdf",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 56 (frais reels, Maghreb par grille nationale) — lu sur les documents officiels des ministeres le 2026-09-13 ; voir scripts/data/journal-frais-lot56-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "universite-de-tunis-el-manar-tunis",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.medecinesfax.org/useruploads/files/affiche%20Programme%20Payant.pdf",
        "verifieLe": "2026-09-13",
        "note": "Grille NATIONALE du ministere tunisien (MESRS), affiche officielle « Programme d'inscription des etudiants internationaux aux universites publiques », frais d'inscription ANNUELS en dinars : licence et bachelor (bac+3 et bac+4) 5 000 DT ; master (bac+5) 6 000 DT ; doctorat (bac+8) 7 000 DT ; diplome d'ingenieur et d'architecte 9 000 DT ; etudes medicales (medecine generale, dentaire, pharmacie) 15 000 DT. Le montant est fixe par l'arrete du ministre de l'enseignement superieur du 16 octobre 2019 et paye en dinars au debut de chaque annee universitaire. Il s'applique aux candidats qui postulent INDIVIDUELLEMENT, hors conventions d'echange et hors nomination par leur pays. Contact du ministere : international@mesrs.state.tn. Montants retenus : les lignes generales licence, master et doctorat — un cursus d'ingenieur ou d'architecte coute 9 000 DT et un cursus medical 15 000 DT dans le meme etablissement.",
        "licence": {
          "montant": 5000,
          "devise": "TND",
          "periode": "an"
        },
        "master": {
          "montant": 6000,
          "devise": "TND",
          "periode": "an"
        },
        "doctorat": {
          "montant": 7000,
          "devise": "TND",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Aucune reduction pour un candidat individuel : la grille nationale est le tarif. La voie exoneree est celle des CONVENTIONS DE COOPERATION bilaterale — le candidat est presente par son pays (quota), et il est alors dispense des frais d'inscription, parfois avec une bourse. Se renseigner aupres du ministere de l'enseignement superieur de son pays, pas aupres de l'universite tunisienne.",
        "source": "https://www.medecinesfax.org/useruploads/files/affiche%20Programme%20Payant.pdf",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 56 (frais reels, Maghreb par grille nationale) — lu sur les documents officiels des ministeres le 2026-09-13 ; voir scripts/data/journal-frais-lot56-2026-09-13.md."
  }
];
