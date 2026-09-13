/**
 * ============================================================
 * LOT 54-FRAIS-SUITE — dix universités de plus (13 septembre 2026)
 * ============================================================
 *
 * Troisième tranche par EXPOSITION mesurée sur les 360 profils du radar,
 * après les 25 les plus montrées (lots 48-50) et le lot 53. Charles a
 * demandé que TOUTES les universités soient faites ; celle-ci n'est pas
 * la dernière.
 *
 * CE QUE CETTE TRANCHE APPREND
 * ----------------------------
 * - PISE A LE DISPOSITIF LE PLUS FAVORABLE LU JUSQU'ICI, et il est
 *   AUTOMATIQUE : la contribution annuelle est multipliée par un
 *   coefficient tiré de la catégorie de revenu du pays d'origine, sans
 *   aucune demande à déposer. 290 € pour un pays à faible revenu,
 *   580 € pour un pays à revenu intermédiaire inférieur, contre 2 900 €
 *   pour un pays à haut revenu. Bari va dans le même sens (forfait de
 *   200 € pour les pays du décret n°464), Bologne, Padoue et Trieste
 *   aussi (lot 53). Cinq universités italiennes publiques, cinq
 *   dispositifs différents, une même logique — mais TOUJOURS à vérifier
 *   une par une : Turin n'a rien de tel (lot 53).
 * - NAMUR DÉPEND D'UNE LISTE, PAS D'UN BARÈME : 1 194 €/an si le pays
 *   figure aux annexes 1, 2 et 3 de la circulaire ARES, 5 369 € sinon.
 *   Un facteur 4,5 qui se joue sur une seule ligne d'annexe. C'est
 *   exactement la question restée ouverte pour l'UCLouvain — même
 *   circulaire, même enjeu : il faut lire les annexes.
 * - LA CHINE EST LISIBLE ET BON MARCHÉ EN APPARENCE, mais chaque grille
 *   a son piège. Zhejiang ajoute 8 000 CNY/an aux cursus enseignés en
 *   ANGLAIS. Pékin renvoie les masters anglophones à la brochure du
 *   programme, sans plafond annoncé. Tianjin affiche deux prix selon la
 *   langue. Le tarif « affiché » n'est jamais celui que paie un
 *   francophone qui ne lit pas le chinois.
 * - NE PAS CONFONDRE DEUX GRILLES QUI PORTENT LE MÊME NOM : à Nankin,
 *   les 8 000 à 10 000 CNY/an sont le tarif des étudiants CHINOIS du
 *   plan national ; les internationaux paient 19 000 à 40 000 CNY. À
 *   Zhejiang, le campus international de Haining (120 000 CNY/an) est un
 *   établissement distinct du campus principal de Hangzhou.
 * - HSE RAPPELLE QU'UNE UNIVERSITÉ N'A PAS UN PRIX MAIS UNE GRILLE :
 *   de 200 000 RUB (licence à Perm) à 1 000 000 RUB (International
 *   Business à Moscou), soit du simple au quintuple dans le même
 *   établissement. Le montant retenu est la valeur la plus fréquente à
 *   Moscou ; la note dit l'écart, parce que le cacher tromperait.
 * - TU DELFT EST L'INVERSE DE L'ITALIE : aucun aménagement pour les
 *   hors UE/EEE, 25 633 €/an en master, et le tarif transitoire plus bas
 *   ne concerne QUE les étudiants déjà inscrits — jamais un entrant.
 *
 * Correction d'identifiant : « universita-di-pisa-pisa » n'existe pas,
 * le catalogue écrit la ville en français — « universita-di-pisa-pise ».
 * Même classe d'erreur que Bari au lot précédent.
 *
 * Nouvelle devise : RUB. Son seuil est posé dans js/frais.js à partir du
 * cours de la Banque centrale de Russie du 12.09.2026 (1 EUR = 97,8728
 * RUB), la BCE ne cotant plus le rouble depuis 2022.
 *
 * ATTENTION, INCIDENT : les seuils ZAR, MAD et TRY posés au lot 53
 * avaient DISPARU de js/frais.js (fichier réécrit par l'éditeur après
 * coup). Ils sont réappliqués ici. Toujours relire assets/data/catalogue.json
 * ET js/frais.js après export, jamais se fier à ce qui a été écrit.
 *
 * Restent à ouvrir avec Charles : Humboldt (252 vues, la plus montrée),
 * Waseda (67), Istanbul University (24), Firenze (Cloudflare), RUDN.
 * ============================================================
 */

export const PATCHES = [
  {
    "collection": "universities",
    "id": "korea-university-seoul",
    "champs": {
      "fraisScolarite": {
        "source": "https://graduate2.korea.ac.kr/admission/tuition.html",
        "verifieLe": "2026-09-13",
        "note": "Grille de l'école doctorale (master et doctorat), PAR SEMESTRE, année 2026 : humanités et sciences sociales 5 237 000 ₩ ; sciences naturelles 6 339 000 ₩ ; ingénierie et arts 7 392 000 ₩ ; santé 6 866 000 ₩ ; médecine 9 267 000 ₩. Plus un droit d'entrée unique de 1 142 000 ₩. Montant retenu pour le master : humanités et sciences sociales sur deux semestres. Tarifs identiques pour les internationaux. Licence : grille séparée, non lue (page du bureau international inaccessible).",
        "master": {
          "montant": 10474000,
          "devise": "KRW",
          "periode": "an"
        },
        "doctorat": {
          "montant": 10474000,
          "devise": "KRW",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Korea University attribue des bourses d'établissement aux internationaux (réductions partielles ou totales selon les résultats) ; le GKS et les bourses KOICA couvrent la totalité pour leurs boursiers. Critères non lus sur la page des frais.",
        "source": "https://graduate2.korea.ac.kr/admission/tuition.html",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 54 (frais réels, troisième tranche par exposition) — lu sur les pages officielles le 2026-09-13 ; voir scripts/data/journal-frais-suite-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "tianjin-university-tianjin",
    "champs": {
      "fraisScolarite": {
        "source": "https://sie.tju.edu.cn/en/xwxm/MASTERPROGRAMS/202510/t20251013_324447.html",
        "verifieLe": "2026-09-13",
        "note": "Master international : 24 900 ¥/an en chinois, 30 000 ¥/an en anglais ; architecture 31 000 / 39 000 ¥ ; MBA 39 000 ¥. Plus 420 ¥ de frais de dossier (offerts aux boursiers CSC), 800 ¥/an d'assurance, 15 à 60 ¥/jour de logement. Sur 104 masters, 29 sont enseignés en anglais (IELTS 6.0 ou TOEFL 80 ; HSK-5 pour le chinois). Montant retenu : le cursus en anglais, plus probable pour un étudiant francophone. Licence : non lue.",
        "master": {
          "montant": 30000,
          "devise": "CNY",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Bourse du gouvernement chinois (CSC) et bourses de l'université pour internationaux, sur dossier ; les boursiers CSC sont exonérés des frais de dossier et de scolarité.",
        "source": "https://sie.tju.edu.cn/en/jxj/tjdxjxj/202410/t20241015_323982.html",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 54 (frais réels, troisième tranche par exposition) — lu sur les pages officielles le 2026-09-13 ; voir scripts/data/journal-frais-suite-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "universita-di-bari-aldo-moro-bari",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.uniba.it/it/studenti/segreterie-studenti/studenti-stranieri/studenti-internazionali-tasse-contributi-ed-esoneri",
        "verifieLe": "2026-09-13",
        "note": "Un étudiant hors UE ressortissant d'un pays en développement (liste du décret ministériel du 11 juin 2019 n°464) en situation de précarité économique paie une contribution forfaitaire de 200 €, plus la taxe régionale du droit aux études et le timbre — soit environ 360 €/an, à régler en une seule fois à la première échéance. Les autres étudiants demandent une réduction sur ISEE parificato ; dépôt après le 30 septembre 2026 : pénalité de 50 € et tranche maximale.",
        "licence": {
          "montant": 360,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 360,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "systematique",
        "detail": "Forfait de 200 € pour les ressortissants des pays en développement de la liste ministérielle. Exonération TOTALE de la contribution pour les étudiants réfugiés ou sous protection subsidiaire (restent taxe régionale et timbre).",
        "source": "https://www.uniba.it/it/studenti/segreterie-studenti/studenti-stranieri/studenti-internazionali-tasse-contributi-ed-esoneri",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 54 (frais réels, troisième tranche par exposition) — lu sur les pages officielles le 2026-09-13 ; voir scripts/data/journal-frais-suite-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "delft-university-of-technology-delft",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.tudelft.nl/en/education/study-programme-orientation/practical-matters/tuition-fee-finances",
        "verifieLe": "2026-09-13",
        "note": "Tarif institutionnel 2026-2027, applique a tout etudiant qui n'est ni neerlandais, ni ressortissant UE/EEE, ni suisse, ni surinamien : licence 19 906 EUR/an, master 25 633 EUR/an (contre 17 310 et 22 290 en 2025-2026). Un tarif transitoire plus bas (18 175 / 23 404 EUR) est reserve aux etudiants deja inscrits en 2025-2026 dans le meme programme, sans interruption : il ne concerne pas un nouvel entrant. Frais supplementaires possibles a la premiere inscription avec un diplome non neerlandais, variables selon la nationalite.",
        "licence": {
          "montant": 19906,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 25633,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Aucune exoneration de droit pour les hors UE/EEE : le tarif institutionnel est la regle. TU Delft propose des bourses d'excellence sur dossier (Justus & Louise van Effen) et les etudiants peuvent postuler au programme Holland Scholarship ; rien d'automatique.",
        "source": "https://www.tudelft.nl/en/education/study-programme-orientation/practical-matters/tuition-fee-finances",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 54 (frais réels, troisième tranche par exposition) — lu sur les pages officielles le 2026-09-13 ; voir scripts/data/journal-frais-suite-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "zhejiang-university-hangzhou",
    "champs": {
      "fraisScolarite": {
        "source": "https://iczu.zju.edu.cn/admissionsen/weeswwwwankwwccountwwnfo/list.htm",
        "verifieLe": "2026-09-13",
        "note": "Grille du College international (campus principal de Hangzhou), par annee et par discipline. Licence : philosophie/lettres/histoire 19 800 CNY ; economie, commerce, droit, education, sciences, ingenierie, agriculture 24 800 CNY ; medecine et arts 29 800 CNY ; medecine clinique (MBBS) 42 800 CNY. Master : 22 800 / 28 800 / 32 800 CNY selon les memes groupes. Doctorat : 29 800 / 34 800 / 39 800 CNY. Frais de dossier 800 CNY (400 CNY pour le chinois langue). Les programmes enseignes EN ANGLAIS (master, doctorat, sejours de recherche) supportent 8 000 CNY/an en plus : un master d'ingenierie en anglais revient donc a environ 36 800 CNY/an. Montants retenus : le groupe le plus large (economie, commerce, droit, sciences, ingenierie, agriculture), hors supplement anglais. Attention : le campus international de Haining (intl.zju.edu.cn, 120 000 CNY/an) est un etablissement distinct, ses tarifs ne s'appliquent pas ici.",
        "licence": {
          "montant": 24800,
          "devise": "CNY",
          "periode": "an"
        },
        "master": {
          "montant": 28800,
          "devise": "CNY",
          "periode": "an"
        },
        "doctorat": {
          "montant": 34800,
          "devise": "CNY",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Bourse du gouvernement chinois (CSC) et bourses de l'universite pour internationaux, attribuees sur dossier et couvrant tout ou partie des droits ; rien d'automatique pour un candidat autofinance.",
        "source": "https://iczu.zju.edu.cn/admissionsen/weeswwwwankwwccountwwnfo/list.htm",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 54 (frais réels, troisième tranche par exposition) — lu sur les pages officielles le 2026-09-13 ; voir scripts/data/journal-frais-suite-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "universita-di-pisa-pise",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.unipi.it/index.php/english/tuition-fees",
        "verifieLe": "2026-09-13",
        "note": "Pise applique AUTOMATIQUEMENT aux etudiants dont les revenus et le patrimoine sont a l'etranger un forfait indexe sur la categorie de revenu de leur pays d'origine (Banque mondiale), sans demande a deposer. Contribution annuelle 2026-2027 : pays a faible revenu 290 EUR ; pays a revenu intermediaire tranche inferieure 580 EUR ; tranche superieure 1 160 EUR ; pays a haut revenu 2 900 EUR. S'y ajoutent 140 EUR de taxe regionale chaque annee et 16 EUR de timbre a la premiere inscription. Montant retenu : la tranche inferieure des revenus intermediaires (Senegal, Cote d'Ivoire, Cameroun, Maroc, Tunisie, Nigeria, Kenya...), soit 580 + 140 = 720 EUR/an ; un etudiant d'un pays a faible revenu (Mali, Niger, Burkina, RDC, Madagascar...) paie 430 EUR/an. Une reduction supplementaire reste possible sur ISEE parificato. Paiement en cinq echeances entre septembre et mai.",
        "licence": {
          "montant": 720,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 720,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "systematique",
        "detail": "Le bareme par pays d'origine est applique d'office : un etudiant d'un pays a faible revenu ou a revenu intermediaire paie de 10 a 20 % du tarif plein, sans demarche. Les etudiants dont l'ISEE est inferieur a 26 000 EUR ne paient que la taxe regionale de 140 EUR ; une reduction sur ISEEU parificato peut se cumuler.",
        "source": "https://www.unipi.it/index.php/english/tuition-fees",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 54 (frais réels, troisième tranche par exposition) — lu sur les pages officielles le 2026-09-13 ; voir scripts/data/journal-frais-suite-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "universite-de-namur-namur",
    "champs": {
      "fraisScolarite": {
        "source": "https://www.unamur.be/fr/inscription/international/droits",
        "verifieLe": "2026-09-13",
        "note": "Montants en vigueur des 2026-2027. Un etudiant hors Union europeenne ressortissant d'un pays cite aux annexes 1, 2 et 3 de la circulaire ARES n'est PAS soumis a la contribution supplementaire : il paie le minerval plein de 1 194 EUR/an en bachelier comme en master. Un ressortissant d'un pays absent de ces annexes paie 5 369 EUR/an (1 194 EUR de minerval + 4 175 EUR de contribution supplementaire). Doctorat : 1 194 EUR la premiere annee puis 50 EUR. Autre finalite dans le meme master : 372 EUR. A cela s'ajoutent 200 EUR de frais de dossier non remboursables, payables AVANT l'examen du dossier par la commission d'admission, et la garantie bancaire exigee pour le visa long sejour. Montant retenu : le cas des pays des annexes ARES, qui couvre l'essentiel de l'Afrique subsaharienne et du Maghreb.",
        "licence": {
          "montant": 1194,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 1194,
          "devise": "EUR",
          "periode": "an"
        },
        "doctorat": {
          "montant": 1194,
          "devise": "EUR",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "systematique",
        "detail": "Exoneration de droit de la contribution supplementaire de 4 175 EUR pour les ressortissants des pays listes aux annexes 1, 2 et 3 de la circulaire ARES : aucune demande a deposer, la nationalite suffit. Verifier son pays dans les annexes avant de budgeter. La Cellule sociale des etudiants peut en outre accorder une intervention sur le minerval, un etalement du paiement ou une bourse UNamur, sur criteres.",
        "source": "https://www.unamur.be/fr/inscription/international/droits",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 54 (frais réels, troisième tranche par exposition) — lu sur les pages officielles le 2026-09-13 ; voir scripts/data/journal-frais-suite-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "nanjing-university-nanjing",
    "champs": {
      "fraisScolarite": {
        "source": "https://njunju.nju.edu.cn/EN/wpplicationwwnstructions_7082/list.htm",
        "verifieLe": "2026-09-13",
        "note": "Grille des etudiants internationaux en master : lettres et sciences humaines 19 000 CNY/an ; sciences et commerce 23 000 CNY/an ; Institut du logiciel 30 000 CNY/an ; faculte de medecine 40 000 CNY/an. Plus 400 CNY de frais d'inscription et 400 CNY d'assurance par semestre (800 CNY/an). Candidature du 1er mars au 20 mai, dossier a envoyer par courrier postal apres la saisie en ligne. HSK-5 exige en lettres et commerce, HSK-4 en sciences ; aucune exigence de chinois pour les programmes enseignes en anglais. Montant retenu : sciences et commerce. Ne pas confondre avec la grille des etudiants chinois du plan national (8 000 a 10 000 CNY/an), qui ne s'applique pas aux internationaux. Licence : grille non lue.",
        "master": {
          "montant": 23000,
          "devise": "CNY",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Bourse du gouvernement chinois (CSC) et bourses de l'universite pour internationaux, sur dossier. La visite medicale (Physical Examination Record) n'est exigee au depot que des candidats boursiers.",
        "source": "https://njunju.nju.edu.cn/EN/wpplicationwwnstructions_7082/list.htm",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 54 (frais réels, troisième tranche par exposition) — lu sur les pages officielles le 2026-09-13 ; voir scripts/data/journal-frais-suite-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "hse-university-moscow",
    "champs": {
      "fraisScolarite": {
        "source": "https://admissions.hse.ru/en/graduate-apply/fees/",
        "verifieLe": "2026-09-13",
        "note": "Tarifs 2025-2026, payables en roubles, identiques pour les internationaux et les Russes en filiere payante. Campus de Moscou : la tres grande majorite des masters est a 490 000 RUB/an (economie, droit, sociologie, informatique, sciences politiques, relations internationales) ; de 390 000 RUB (Economic Analysis) a 950 000 RUB (Film Production). Licence a Moscou : de 460 000 a 1 000 000 RUB/an, le gros des programmes entre 500 000 et 700 000. Les autres campus sont nettement moins chers : Perm de 200 000 a 420 000 RUB, Nijni Novgorod de 360 000 a 550 000, Saint-Petersbourg de 420 000 a 640 000. Montants retenus : campus de Moscou, valeur la plus frequente en master, mediane en licence. Verifier le tarif du programme vise, l'ecart va du simple au triple.",
        "licence": {
          "montant": 600000,
          "devise": "RUB",
          "periode": "an"
        },
        "master": {
          "montant": 490000,
          "devise": "RUB",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Places financees par l'Etat russe via le quota gouvernemental (Open Doors, Rossotroudnitchestvo) : scolarite entierement prise en charge, sur concours. HSE accorde aussi des reductions de 25, 50 ou 70 % sur les droits aux candidats internationaux les mieux classes. Rien d'automatique pour un candidat autofinance.",
        "source": "https://admissions.hse.ru/en/graduate-apply/fees/",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 54 (frais réels, troisième tranche par exposition) — lu sur les pages officielles le 2026-09-13 ; voir scripts/data/journal-frais-suite-2026-09-13.md."
  },
  {
    "collection": "universities",
    "id": "peking-university-beijing",
    "champs": {
      "fraisScolarite": {
        "source": "https://isd.pku.edu.cn/en/campus_detail.php?id=700",
        "verifieLe": "2026-09-13",
        "note": "Grille annuelle des etudiants internationaux a temps plein, en deux colonnes : lettres et sciences humaines / sciences. Licence 26 000 ou 30 000 CNY ; master 29 000 ou 33 000 CNY ; doctorat 32 000 ou 40 000 CNY. Les masters ENSEIGNES EN ANGLAIS et les programmes speciaux ont leur propre tarif, publie dans la brochure du programme : il est souvent tres superieur (jusqu'a plusieurs centaines de milliers de CNY pour les MBA). Montants retenus : la colonne sciences, la plus courante pour les candidats africains. Paiement integral exige le jour de l'inscription ; a defaut de reglement complet sous 30 jours, l'inscription est annulee d'office. Un semestre ou moins se paie une demi-annee ; plus d'un semestre se paie une annee pleine.",
        "licence": {
          "montant": 30000,
          "devise": "CNY",
          "periode": "an"
        },
        "master": {
          "montant": 33000,
          "devise": "CNY",
          "periode": "an"
        },
        "doctorat": {
          "montant": 40000,
          "devise": "CNY",
          "periode": "an"
        }
      },
      "exoneration": {
        "politique": "possible_plafonnee",
        "detail": "Bourse du gouvernement chinois (CSC) : exoneration totale des droits, plus logement et allocation. Bourses de l'universite pour internationaux sur dossier. Aucune exoneration de droit pour un candidat autofinance ; la politique de remboursement est restrictive (10 % retenus en cas d'abandon, plus aucun remboursement passe deux mois de semestre).",
        "source": "https://isd.pku.edu.cn/en/campus_detail.php?id=700",
        "verifieLe": "2026-09-13"
      }
    },
    "motif": "Lot 54 (frais réels, troisième tranche par exposition) — lu sur les pages officielles le 2026-09-13 ; voir scripts/data/journal-frais-suite-2026-09-13.md."
  }
];
