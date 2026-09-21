/**
* ============================================================
* LOT 66 — PEARSON : LES DEUX PORTES AVANT LA DATE LIMITE
* (21 septembre 2026)
* ============================================================
*
* Vu en ligne : la carte Pearson annonçait « Date limite vérifiée —
* 46 jours pour déposer » (6 novembre 2026). Vrai pour le dossier de
* bourse, faux pour ce qui décide de tout : sans nomination par le lycée
* au plus tard le 9 octobre, il n'y a plus de candidature possible. La
* prose de la fiche le disait ; le moteur ne lisait que la date limite.
*
* Champ de programme `portesAvant` (js/recommend-programs.js,
* lirePortes) : les étapes obligatoires datées AVANT la date limite.
* La prochaine devient le décompte affiché et celui du plancher de
* proposition ; une porte passée ferme la candidature.
*
* Source : https://future.utoronto.ca/pearson-scholarships, lue le
* 21 septembre 2026 :
*   « The deadline to nominate a student is October 9, 2026. »
*   « The deadline to apply for admission to U of T and be considered
*     for the Pearson Scholarship is October 16, 2026. »
*   « The deadline to complete the Pearson International Scholarship
*     application […] is November 6, 2026. »
* ============================================================
*/

export const PATCHES = [
  {
    "collection": "programs",
    "id": "university-of-toronto-toronto__lester-b-pearson-international-scholarship",
    "champs": {
      "portesAvant": [
        { "dateISO": "2026-10-09", "quoi": "la nomination par votre lycée" },
        { "dateISO": "2026-10-16", "quoi": "la candidature d'admission à l'université (OUAC)" }
      ]
    },
    "motif": "FINITIONS — vu en ligne le 21 septembre 2026. La carte annonçait 46 jours (date limite du 6 novembre) alors que la nomination par le lycée ferme le 9 octobre 2026 et l'admission OUAC le 16 octobre 2026 (source officielle lue le 21/09). portesAvant rend ces deux étapes lisibles par le moteur : décompte, plancher de proposition, fermeture si une porte est passée."
  }
];
