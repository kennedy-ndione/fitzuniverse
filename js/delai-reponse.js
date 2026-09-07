/**
* ============================================================
* FitzUniverse — LE délai de réponse annoncé (grille A, 2026-09-07)
* ============================================================
*
* Une seule valeur, importée partout où le délai est annoncé :
* la notice de messages.html, le service après-vente, et (par un test
* qui compare, faute d'import possible dans un script classique) les
* puces de pricing-plans.js. Avant ce fichier, « sous 24 h ouvrées »
* vivait à plusieurs endroits, comme les libellés de statut — et
* changeait dans l'un sans changer dans les autres.
*
* 48 h OUVRÉES : le délai que l'équipe tient réellement.
* ============================================================
*/

export const DELAI_REPONSE_HEURES = 48;

export const DELAI_REPONSE = `${DELAI_REPONSE_HEURES} h ouvrées`;
