/**
* ============================================================
* js/retour-apres-compte.js — revenir à sa formule après le compte
* ============================================================
*
* LOT COMPTE-D'ABORD (2026-09-21, décision de Charles). La page de
* paiement ne crée plus de compte : c'était le seul endroit du site où
* l'on tapait un mot de passe à côté d'un prix, avec une copie de la
* validation de l'inscription. Depuis que le compte est GRATUIT
* (2026-09-20), il se crée à un seul endroit — inscription.html — et
* l'on paie depuis un compte déjà ouvert.
*
* Ce module porte le seul fil entre les deux : un visiteur qui choisit
* une formule part créer son compte (ou se connecter) avec
* `?retour=payment.html?plan=…`, et y revient ensuite.
*
* LA DESTINATION EST FERMÉE. `retour` vient de l'URL : n'importe qui
* peut en fabriquer un. On n'accepte QUE la page de paiement avec un
* identifiant de formule — jamais une autre page, jamais une URL
* absolue, jamais un chemin « //hote ». Tout le reste est ignoré, et la
* page suit son chemin habituel.
*
* LA DESTINATION D'UN DOSSIER (2026-09-23). Un Dossier Italie s'achète
* sur `payment.html?plan=dossier-france&destination=italie` : le pays
* fait partie de l'achat, il doit survivre à la création du compte. Il
* est accepté, mais pris dans la liste FERMÉE des destinations vendues
* (miroir de DESTINATIONS_VENDUES, js/destinations-preinscription.js —
* test/destinations-preinscription.test.mjs compare les deux) ; aucun
* autre paramètre.
* ============================================================
*/

export const DESTINATIONS_RETOUR = ["france", "roumanie", "turquie", "maroc", "italie", "allemagne", "canada"];

const RETOUR_VALIDE = new RegExp(`^payment\\.html\\?plan=[A-Za-z0-9_-]{1,40}(?:&destination=(?:${DESTINATIONS_RETOUR.join("|")}))?$`);

/** La destination de retour, si elle est sûre ; sinon "". */
export function retourSur(search) {
let valeur = "";
try {
valeur = new URLSearchParams(search || "").get("retour") || "";
} catch {
return "";
}
return RETOUR_VALIDE.test(valeur) ? valeur : "";
}

/** Le lien vers `page` qui emporte le retour, ou `page` seule. */
export function avecRetour(page, retour) {
return retour ? `${page}?retour=${encodeURIComponent(retour)}` : page;
}
