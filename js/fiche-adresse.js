/**
* L'adresse de la fiche d'un établissement (universite.html, lot 76-77,
* 2026-09-24). Un seul endroit l'écrit ; module minuscule à dessein :
* universities-page.js l'importe sans charger le calcul de la fiche.
*/
export function adresseFiche(id) {
return `universite.html?id=${encodeURIComponent(String(id || ""))}`;
}
