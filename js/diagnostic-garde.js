/**
 * ============================================================
 * js/diagnostic-garde.js — le diagnostic ne se perd plus
 * ============================================================
 *
 * CE QUE inscription.html PROMET, EN TITRE :
 *   « Conservez votre diagnostic, remplissez votre profil et soyez
 *     alerté quand une bourse ouvre ses candidatures. »
 *
 * CE QUI SE PASSAIT (mesuré en production le 2026-09-20 sur un compte
 * réel). Les dix-sept réponses vivent dans
 * `sessionStorage.eligibilityResponses` — un stockage PAR ONGLET, effacé
 * à sa fermeture. Rien n'était écrit dans le compte. Le report vers le
 * profil (js/diagnostic-vers-profil.js) existait bel et bien, mais il
 * n'était appelé qu'à UN instant : la création du compte
 * (js/creer-compte.js et payment.js, via js/compte-par-defaut.js).
 *
 * Conséquence : l'étudiant qui crée son compte PUIS fait le diagnostic —
 * l'ordre que le site lui propose lui-même depuis l'espace étudiant —
 * retrouvait un profil à 0/6, et devait ressaisir à la main le niveau,
 * la nationalité, le diplôme visé, le domaine, les langues et la
 * destination qu'il venait de donner. Et s'il fermait l'onglet, tout
 * était perdu.
 *
 * CE MODULE COMBLE LES DEUX TROUS, ET RIEN D'AUTRE :
 *
 *   1. UNE MÉMOIRE QUI SURVIT À L'ONGLET. `memoriser()` recopie les
 *      réponses dans localStorage avec leur date. lireMemoire() les rend
 *      tant qu'elles ont moins de JOURS_VALIDITE jours — au-delà, un
 *      diagnostic n'est plus le portrait de personne, et pré-remplir un
 *      compte avec les réponses d'il y a un an serait pire que de ne
 *      rien pré-remplir.
 *
 *   2. UNE ÉCRITURE DANS LE COMPTE. `miseAJourDuCompte()` rend ce qu'il
 *      faut fusionner dans `users/{uid}` — ou null quand il n'y a rien à
 *      écrire, pour ne pas facturer une écriture à chaque ouverture de
 *      la page de résultats.
 *
 * DEUX RÈGLES QUI NE SE NÉGOCIENT PAS
 * -----------------------------------
 * - ON N'ÉCRASE JAMAIS UNE RÉPONSE DÉJÀ DONNÉE. La fusion passe par
 *   `appliquerDiagnostic` → `fusionnerSansEcraser` : seules les cases
 *   VIDES du profil reçoivent une valeur. Un étudiant qui a corrigé sa
 *   nationalité dans son profil ne se la verra jamais réécrire par un
 *   diagnostic plus ancien.
 * - CE FICHIER EST PUR. Aucun DOM, aucun Firebase, aucun import du SDK :
 *   le stockage et l'horodatage sont PASSÉS par l'appelant. C'est ce qui
 *   le rend vérifiable sous Node, comme js/compte-par-defaut.js.
 * ============================================================
 */

import { appliquerDiagnostic } from "./diagnostic-vers-profil.js";

/** La clé de la mémoire locale. Préfixe `fitz_` comme le reste du site. */
export const CLE_MEMOIRE = "fitz_diagnostic";

/** Au-delà, les réponses ne décrivent plus l'étudiant d'aujourd'hui. */
export const JOURS_VALIDITE = 90;

const JOUR_MS = 86400000;

/** Le stockage à utiliser : celui qu'on passe, sinon celui du navigateur,
 *  sinon rien du tout (Node, mode privé, stockage bloqué). Ne lève
 *  jamais : une mémoire indisponible n'est pas une panne, c'est
 *  simplement une mémoire vide. */
function stockageDefaut(stockage) {
if (stockage) return stockage;
try {
return typeof localStorage === "undefined" ? null : localStorage;
} catch {
return null;
}
}

/**
 * Recopie les réponses dans la mémoire locale, avec leur date.
 * @returns {boolean} vrai si l'écriture a eu lieu.
 */
export function memoriser(reponses, { maintenant = new Date(), stockage } = {}) {
const s = stockageDefaut(stockage);
if (!s || !reponses || typeof reponses !== "object") return false;
try {
s.setItem(CLE_MEMOIRE, JSON.stringify({ le: new Date(maintenant).toISOString(), reponses }));
return true;
} catch {
// Quota dépassé, navigation privée, stockage refusé : on continue.
return false;
}
}

/**
 * Les réponses mémorisées, ou null si elles sont absentes, illisibles ou
 * trop vieilles.
 */
export function lireMemoire({ maintenant = new Date(), stockage, joursMax = JOURS_VALIDITE } = {}) {
const s = stockageDefaut(stockage);
if (!s) return null;
try {
const brut = s.getItem(CLE_MEMOIRE);
if (!brut) return null;
const paquet = JSON.parse(brut);
if (!paquet || typeof paquet !== "object" || !paquet.reponses) return null;
const le = new Date(paquet.le).getTime();
if (!Number.isFinite(le)) return null;
const age = (new Date(maintenant).getTime() - le) / JOUR_MS;
if (age < 0 || age > joursMax) return null;
return typeof paquet.reponses === "object" ? paquet.reponses : null;
} catch {
return null;
}
}

/** Efface la mémoire locale (suppression de compte, déconnexion voulue). */
export function oublier({ stockage } = {}) {
const s = stockageDefaut(stockage);
if (!s) return false;
try { s.removeItem(CLE_MEMOIRE); return true; } catch { return false; }
}

/**
 * Ce qu'il faut fusionner dans `users/{uid}` pour que le compte garde ce
 * diagnostic — ou null quand il n'y a rien à écrire.
 *
 * @param {Object|null} donneesUtilisateur  le document users/{uid} tel qu'il est
 * @param {Object|null} reponses            les réponses du diagnostic
 * @param {Object} [options]
 * @param {Date}   [options.aujourdhui]
 * @param {Function} [options.serverTimestamp] serverTimestamp du SDK, sinon une Date
 * @returns {{profile: Object, diagnostic: Object, diagnosticLe: any}|null}
 */
export function miseAJourDuCompte(donneesUtilisateur, reponses, { aujourdhui = new Date(), serverTimestamp } = {}) {

if (!reponses || typeof reponses !== "object" || !Object.keys(reponses).length) return null;

const compte = donneesUtilisateur && typeof donneesUtilisateur === "object" ? donneesUtilisateur : {};
const profilExistant = compte.profile && typeof compte.profile === "object" ? compte.profile : {};

const { profil, repris } = appliquerDiagnostic(profilExistant, reponses, { aujourdhui });

// Les alias historiques du schéma plat, recalculés comme le fait
// js/compte-par-defaut.js à la création. Sans eux, profile.js et le
// score liraient des cases vides à côté des cases remplies.
if (profil.country && !profil.originCountry) profil.originCountry = profil.country;
if (Array.isArray(profil.preferredCountries) && profil.preferredCountries.length && !profil.desiredCountry) profil.desiredCountry = profil.preferredCountries[0];
if (profil.lastDegree && !profil.currentDegree) profil.currentDegree = profil.lastDegree;

// RIEN À ÉCRIRE : le compte porte déjà ce même diagnostic ET la fusion
// ne reprend aucune case. Sans cette sortie, chaque ouverture de la
// page de résultats coûterait une écriture Firestore pour rien.
const dejaLeMeme = JSON.stringify(compte.diagnostic || null) === JSON.stringify(reponses);
if (dejaLeMeme && !repris.length) return null;

const horodatage = typeof serverTimestamp === "function" ? serverTimestamp : () => new Date(aujourdhui);

return { profile: profil, diagnostic: reponses, diagnosticLe: horodatage() };

}
