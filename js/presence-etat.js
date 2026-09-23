/**
* ============================================================
* FitzUniverse — « En ligne » : la règle, en un seul endroit
* (2026-09-23, demande de Charles)
* ============================================================
*
* Module PUR (aucun DOM, aucun Firebase) : il décide, à partir du
* document presence/{uid}, si un étudiant est en ligne et ce que
* l'admin lit à côté de son nom. Lu par js/presence.js (l'espace
* étudiant) et admin/presence-admin.js (le Control Center).
*
* LE PRINCIPE — UN BATTEMENT, PAS UN INTERRUPTEUR. Tant qu'une page de
* l'espace est affichée, elle écrit `vuLe` toutes les BATTEMENT_MS. On
* est « en ligne » si le dernier battement a moins de SEUIL_EN_LIGNE_MS.
* On n'écrit JAMAIS « hors ligne » en quittant une page : passer d'une
* page à l'autre de l'espace ferait clignoter l'étudiant hors ligne
* puis en ligne dans l'admin, et un onglet fermé brutalement (batterie,
* réseau coupé) n'écrirait de toute façon rien. Le silence suffit : au
* bout de deux minutes sans battement, l'étudiant n'est plus en ligne.
* Seule exception : la déconnexion volontaire écrit enLigne:false, pour
* que l'admin le voie tout de suite.
* ============================================================
*/

/** Une page affichée écrit un battement toutes les 45 secondes. */
export const BATTEMENT_MS = 45_000;

/** Sans battement depuis 2 minutes, on n'est plus en ligne. */
export const SEUIL_EN_LIGNE_MS = 120_000;

/** Un horodatage Firestore, une Date ou un nombre → millisecondes (ou 0). */
export function enMillis(valeur) {
if (!valeur) return 0;
if (typeof valeur.toMillis === "function") return valeur.toMillis();
if (valeur instanceof Date) return valeur.getTime();
if (typeof valeur === "number" && Number.isFinite(valeur)) return valeur;
return 0;
}

const MOIS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];

/** « Vu il y a 5 min », « Vu il y a 3 h », « Vu le 21 sept. ». */
export function libelleDerniereVisite(vuLe, maintenant = Date.now()) {
const age = Math.max(0, maintenant - vuLe);
const minutes = Math.floor(age / 60_000);
if (minutes < 1) return "Vu à l'instant";
if (minutes < 60) return `Vu il y a ${minutes} min`;
const heures = Math.floor(minutes / 60);
if (heures < 24) return `Vu il y a ${heures} h`;
const d = new Date(vuLe);
return `Vu le ${d.getDate()} ${MOIS[d.getMonth()]}`;
}

/**
* L'état de présence d'un étudiant.
*
* @param {{enLigne?:boolean, vuLe?:any}|null|undefined} presence  le document presence/{uid}
* @param {number} [maintenant]
* @returns {{enLigne:boolean, libelle:string, vuLe:number}}
*/
export function etatPresence(presence, maintenant = Date.now()) {
const vuLe = enMillis(presence && presence.vuLe);
if (!vuLe) return { enLigne: false, libelle: "Pas encore vu", vuLe: 0 };
// Une horloge d'appareil en avance peut donner un âge négatif : on le
// ramène à zéro plutôt que de déclarer « en ligne » pour toujours.
const age = Math.max(0, maintenant - vuLe);
const enLigne = presence.enLigne !== false && age < SEUIL_EN_LIGNE_MS;
return { enLigne, libelle: enLigne ? "En ligne" : libelleDerniereVisite(vuLe, maintenant), vuLe };
}
