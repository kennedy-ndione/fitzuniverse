/**
* ============================================================
* test/_pays-temoin.mjs — le témoin « pays non documenté »
* ============================================================
*
* Plusieurs tests ont besoin d'un pays de résidence que le registre des
* couches NE connaît pas : c'est ainsi qu'on prouve qu'une résidence
* inconnue reçoit toujours les onze étapes du tronc, sans date, sans
* montant.
*
* Ce témoin a été la Côte d'Ivoire, puis le Cameroun, puis le Maroc,
* puis le Rwanda — chaque fois périmé par le lot suivant, qui
* documentait justement ce pays-là. Il se CHOISIT désormais tout seul :
* le premier pays du référentiel (js/countries.js) qui n'a pas de
* couche. Il ne se périmera plus, et le jour où les 195 pays seront
* documentés, l'erreur sera parlante plutôt que silencieuse.
*
* Pas un fichier `.test.mjs` : `npm test` ne balaye que ce motif, ce
* module n'est donc jamais exécuté comme une suite.
* ============================================================
*/

import { COUNTRIES } from "../js/countries.js";
import { coucheDeResidence } from "../js/procedures/index.js";

/**
* Le premier pays sans couche pour une destination — le témoin « non
* documenté » de tous les tests qui en ont besoin.
*/
export function paysNonDocumente(destination = "France", rang = 0) {
const candidats = COUNTRIES.filter((c) => !coucheDeResidence(destination, c.name));
if (candidats.length <= rang) {
throw new Error(`Aucun pays non documenté au rang ${rang} pour « ${destination} » — tous les pays ont une couche, ou presque : ce témoin doit être repensé.`);
}
return candidats[rang].name;
}

/** Deux témoins distincts, quand un test en compare deux. */
export const TEMOIN = paysNonDocumente();
export const TEMOIN_2 = paysNonDocumente("France", 1);
