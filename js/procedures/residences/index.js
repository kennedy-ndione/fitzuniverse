/**
* ============================================================
* FitzUniverse — le registre des couches de résidence (lot S1b)
* ============================================================
*
* UNE SEULE LISTE, et c'est le seul endroit du dépôt où l'on déclare
* qu'un pays de résidence est documenté. Le diagnostic la lit (par
* coucheDeResidence), la composition la lit, la page publique la lit
* pour dire quels pays sont couverts. Le lot S2 ajoute un fichier de
* données et une ligne ici — rien d'autre. Si S2 doit rouvrir un autre
* module, c'est que S1b a raté.
*
* Ce fichier ne contient AUCUN fait : que des imports et une liste.
* ============================================================
*/

import { COUCHE_FRANCE_SENEGAL } from "./france-senegal.js";

export const COUCHES = [COUCHE_FRANCE_SENEGAL];
