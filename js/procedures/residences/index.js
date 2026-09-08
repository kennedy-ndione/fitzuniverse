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
* LOT S2-PAYS (2026-09-08) : sept pays enregistrés d'un coup, et la
* promesse de S1b a tenu — aucun module n'a été rouvert, aucune ligne
* de code n'a changé ailleurs que dans ce fichier et dans la phrase de
* la page publique qui compte les pays. Les sept fichiers passent
* defautsDeCouche() sans un défaut, tels qu'ils ont été livrés : le
* modèle du lot S2-MODÈLE (absences, decomposition, avertissement) leur
* allait sans retouche.
*
* L'ORDRE EST ALPHABÉTIQUE, par nom de pays. C'est celui dans lequel
* residencesDocumentees() les rend, donc celui que le visiteur lit sur
* preinscriptions.html. Alphabétique parce qu'aucun autre ordre ne se
* défend : par date d'ajout, la liste raconterait notre historique
* plutôt que sa géographie ; par « importance », il faudrait expliquer
* pourquoi un pays passe devant un autre.
*
* Ce fichier ne contient AUCUN fait : que des imports et une liste.
* ============================================================
*/

import { COUCHE_FRANCE_BENIN } from "./france-benin.js";
import { COUCHE_FRANCE_BURKINA_FASO } from "./france-burkina-faso.js";
import { COUCHE_FRANCE_CAMEROUN } from "./france-cameroun.js";
import { COUCHE_FRANCE_COTE_DIVOIRE } from "./france-cote-divoire.js";
import { COUCHE_FRANCE_GUINEE } from "./france-guinee.js";
import { COUCHE_FRANCE_MAROC } from "./france-maroc.js";
import { COUCHE_FRANCE_SENEGAL } from "./france-senegal.js";
import { COUCHE_FRANCE_TOGO } from "./france-togo.js";

export const COUCHES = [
COUCHE_FRANCE_BENIN,
COUCHE_FRANCE_BURKINA_FASO,
COUCHE_FRANCE_CAMEROUN,
COUCHE_FRANCE_COTE_DIVOIRE,
COUCHE_FRANCE_GUINEE,
COUCHE_FRANCE_MAROC,
COUCHE_FRANCE_SENEGAL,
COUCHE_FRANCE_TOGO
];
