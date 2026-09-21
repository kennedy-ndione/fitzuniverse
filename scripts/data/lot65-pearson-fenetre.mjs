/**
* ============================================================
* LOT 65 — PEARSON : LA DATE DE VÉRIFICATION ET LA FENÊTRE DU BAC
* (21 septembre 2026)
* ============================================================
*
* Deux défauts vus EN LIGNE sur une carte réelle, pendant le test du
* parcours bourse complet (compte Essentiel, bachelière de 2022) :
*
*  1. « Vérifié le undefined undefined NaN ». Le champ `verifieLe` de la
*     bourse portait « 6 novembre 2026 » — la date LIMITE, tombée dans le
*     champ de la date de VÉRIFICATION, et au futur. Le champ attend une
*     date ISO : la vérification réelle date du 19 septembre 2026 (voir
*     sourceVerification.le du programme Toronto × Pearson).
*
*  2. Pearson proposée à qui n'y a pas droit. La fiche le dit : « en
*     dernière année de secondaire en 2026-2027 ou diplômés au plus tôt
*     en juin 2026 ; les étudiants déjà inscrits dans le supérieur ne sont
*     pas admissibles ». Le champ `anneeBacMin` le rend lisible par le
*     moteur (js/recommend-programs.js, fenetreBacMatch) : un bac plus
*     ancien, ou un cursus supérieur commencé, écarte la bourse.
*
* Source : https://future.utoronto.ca/pearson-scholarships (lue le
* 19 septembre 2026).
* ============================================================
*/

export const PATCHES = [
  {
    "collection": "scholarships",
    "id": "lester-b-pearson-international-scholarship",
    "attendu": {
      "verifieLe": "6 novembre 2026"
    },
    "champs": {
      "verifieLe": "2026-09-19",
      "anneeBacMin": 2026
    },
    "motif": "LOT DÉPART — vu en ligne le 21 septembre 2026. (1) verifieLe portait la date limite (« 6 novembre 2026 ») au lieu de la date ISO de vérification : la carte affichait « Vérifié le undefined undefined NaN ». Remis à 2026-09-19, jour de la lecture de la source. (2) anneeBacMin = 2026 : la source réserve la bourse aux élèves de terminale 2026-2027 ou diplômés au plus tôt en juin 2026, et exclut les étudiants déjà dans le supérieur ; le moteur l'écarte désormais pour une bachelière de 2022 à qui elle était proposée."
  }
];
