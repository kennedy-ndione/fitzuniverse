/**
 * ============================================================
 * LOT 58-FRAIS-CORRECTIF — Grenoble (13 septembre 2026)
 * ============================================================
 *
 * UNE SEULE FICHE, ET UNE RÈGLE QUE LE LOT 57 A RENDUE EXPLICITE.
 *
 * Le montant retenu doit être celui que l'étudiant PAIE PAR DÉFAUT :
 *   - exonération `systematique`, accordée d'office → retenir le montant
 *     APRÈS exonération (Toulouse et Paris-Saclay 178/255 €, Rennes
 *     650/950 €, Namur 1 194 €, Pise 720 € : tous corrects) ;
 *   - exonération `possible_plafonnee`, à DEMANDER → retenir le TARIF
 *     PLEIN, et mettre le montant réduit dans la note.
 *
 * L'Université Grenoble Alpes violait cette règle : sa fiche affichait
 * 178 € en licence et 254 € en master — les montants APRÈS exonération —
 * alors que son propre communiqué du 29 mai 2026 exige une DEMANDE
 * assortie d'une déclaration de ressources, dans la limite de 30 % des
 * inscrits hors UE. Un étudiant qui aurait budgété 178 € et n'aurait pas
 * obtenu l'exonération se serait vu facturer 2 902 €, soit seize fois
 * plus. C'est précisément le préjudice que la doctrine des frais existe
 * pour empêcher.
 *
 * Détecté par `test/frais.test.mjs` (« aucune université française en
 * bande gratuit »), qui a tenu bon : le test disait vrai sur le fond,
 * la donnée avait tort. Un test verrouille désormais la règle elle-même,
 * et pas un décompte.
 *
 * PREMIÈRE TENTATIVE REFUSÉE, ET LE RUNNER AVAIT RAISON. Le champ
 * `attendu` ne contenait que `licence` et `master` ; or le runner compare
 * l'objet `fraisScolarite` ENTIER, et voyait donc un écart sur `source`,
 * `note` et `doctorat`. Il a bloqué l'écriture. `attendu` porte
 * maintenant l'objet complet tel qu'il est en base — si quelqu'un touche
 * à cette fiche entre-temps, le lot refusera encore, et ce sera juste.
 *
 * Le doctorat ne bouge pas : 398 €, les doctorants ne sont jamais
 * assujettis aux droits différenciés.
 * ============================================================
 */

export const PATCHES = [
  {
    "collection": "universities",
    "id": "universite-grenoble-alpes-grenoble",
    "attendu": {
      "fraisScolarite": {
        "source": "https://www.univ-grenoble-alpes.fr/etudiants-internationaux-ce-que-change-le-nouveau-decret-sur-les-droits-d-inscription-a-l-uga-1775870.kjsp",
        "verifieLe": "2026-09-13",
        "note": "Annee 2026-2027, communique de l'UGA du 29 mai 2026 mis a jour le 11 septembre 2026. Annee de transition : l'etudiant hors UE DOIT demander l'exoneration et declarer ses ressources ; s'il l'obtient il ne paie que les droits nationaux, chiffres par l'UGA a 178 EUR en licence et 254 EUR en master. Sans exoneration : 2 902 EUR et 3 950 EUR. Doctorat non assujetti : 398 EUR. S'ajoute la CVEC. Non lus : le formulaire de demande et les regles propres aux etablissements-composantes (Polytech, IAE, Grenoble INP), exclus du dispositif central.",
        "licence": {
          "montant": 178,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 254,
          "devise": "EUR",
          "periode": "an"
        },
        "doctorat": {
          "montant": 398,
          "devise": "EUR",
          "periode": "an"
        }
      }
    },
    "champs": {
      "fraisScolarite": {
        "source": "https://www.univ-grenoble-alpes.fr/etudiants-internationaux-ce-que-change-le-nouveau-decret-sur-les-droits-d-inscription-a-l-uga-1775870.kjsp",
        "verifieLe": "2026-09-13",
        "note": "Annee 2026-2027, communique de l'UGA du 29 mai 2026 mis a jour le 11 septembre 2026. MONTANTS RETENUS : le TARIF PLEIN des droits differencies, 2 902 EUR en licence et 3 950 EUR en master, parce que l'exoneration n'est PAS automatique a Grenoble — contrairement a Toulouse et Paris-Saclay. L'etudiant hors UE doit la DEMANDER et declarer ses ressources ; s'il l'obtient, il ne paie plus que les droits nationaux, que l'UGA chiffre a 178 EUR en licence et 254 EUR en master. L'universite annonce vouloir l'appliquer largement en 2026-2027, mais le decret n° 2026-385 du 19 mai 2026 la plafonne a 30 % des inscrits hors UE, puis 25 % et 20 %. Budgeter 2 902 EUR et considerer les 178 EUR comme un gain possible, jamais l'inverse. Doctorat non assujetti : 398 EUR. S'ajoute la CVEC. Non lus : le formulaire de demande et les regles propres aux etablissements-composantes (Polytech, IAE, Grenoble INP), exclus du dispositif central.",
        "licence": {
          "montant": 2902,
          "devise": "EUR",
          "periode": "an"
        },
        "master": {
          "montant": 3950,
          "devise": "EUR",
          "periode": "an"
        },
        "doctorat": {
          "montant": 398,
          "devise": "EUR",
          "periode": "an"
        }
      }
    },
    "motif": "Lot 58 : le montant retenu doit etre celui paye par defaut ; l'exoneration de Grenoble est sur demande, pas d'office."
  }
];
