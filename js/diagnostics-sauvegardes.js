/**
* ============================================================
* js/diagnostics-sauvegardes.js — les diagnostics de préinscription
* qu'un compte a déjà faits, pour les lui montrer
* ============================================================
*
* Constat de Charles (2026-09-26) : « le diagnostic gratuit côté
* préinscription mène à une création de compte ou une connexion et après
* on ne le voit même pas ». L'accueil d'un compte gratuit (dashboard.html,
* js/aiguillage.js) ne parlait que du diagnostic des bourses : un
* diagnostic « Puis-je me lancer ? » enregistré sur le compte n'y
* apparaissait nulle part.
*
* Module PUR : il lit le document users/{uid} tel quel et rend une liste
* prête à afficher. Aucun DOM, aucun Firestore (test/diagnostic-retour.test.mjs).
*
*   users/{uid}.diagnosticFrance          écrit par diagnostic-france.html
*   users/{uid}.diagnosticsPays.<pays>    écrit par diagnostic-pays.html
* ============================================================
*/

import { NOMS_DESTINATIONS } from "./retour-apres-compte.js";

/** Le verdict « Puis-je me lancer ? » en quelques mots. */
export const LIBELLES_VERDICT = {
lancer: "Vous pouvez vous lancer",
"lancer-si": "Vous pouvez vous lancer, avec des points à régler",
"pas-encore": "Pas encore : ce qui vous manque est dit dans le diagnostic"
};

const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

/** « 26 septembre 2026 », ou "" si la date n'est pas lisible. */
function dateLisible(valeur) {
const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(valeur || ""));
if (!m) return "";
const [a, mo, j] = [Number(m[1]), Number(m[2]), Number(m[3])];
if (mo < 1 || mo > 12 || j < 1 || j > 31) return "";
return `${j === 1 ? "1er" : j} ${MOIS[mo - 1]} ${a}`;
}

function entree(id, d) {
if (!d || typeof d !== "object") return null;
const etat = d.recevabilite && typeof d.recevabilite.etat === "string" ? d.recevabilite.etat : "";
return {
id,
nom: NOMS_DESTINATIONS[id] || id,
etat,
libelle: LIBELLES_VERDICT[etat] || "Diagnostic enregistré",
calculeLe: typeof d.calculeLe === "string" ? d.calculeLe : "",
date: dateLisible(d.calculeLe),
href: id === "france" ? "diagnostic-france.html" : `diagnostic-pays.html?d=${encodeURIComponent(id)}`
};
}

/**
* @param {Object} userData - le document users/{uid}
* @returns {Array<{id,nom,etat,libelle,calculeLe,date,href}>} du plus
* récent au plus ancien ; seulement les destinations connues du site.
*/
export function diagnosticsPreinscription(userData) {
const u = userData && typeof userData === "object" ? userData : {};
const liste = [];
const france = entree("france", u.diagnosticFrance);
if (france) liste.push(france);
const pays = u.diagnosticsPays && typeof u.diagnosticsPays === "object" ? u.diagnosticsPays : {};
for (const [id, d] of Object.entries(pays)) {
if (id === "france" || !Object.prototype.hasOwnProperty.call(NOMS_DESTINATIONS, id)) continue;
const e = entree(id, d);
if (e) liste.push(e);
}
return liste.sort((a, b) => b.calculeLe.localeCompare(a.calculeLe));
}
