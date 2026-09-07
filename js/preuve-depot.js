/**
* ============================================================
* Fitz — la preuve de dépôt d'une candidature (lot E1, 2026-09-07)
* ============================================================
*
* LE PROBLÈME
* -----------
* Un étudiant passait sa candidature en « déposée » en changeant un
* menu déroulant. Rien ne l'en empêchait, rien n'en restait : la phase
* 04 « Dépôt » du parcours (js/journey-map.js, STATUTS_DEPOSES) pouvait
* s'afficher faite sans qu'aucun dossier n'ait été déposé. FitzUniverse
* n'avait ni suivi réel ni statistique défendable.
*
* CE QUE C'EST — ET CE QUE CE N'EST PAS
* --------------------------------------
* Une DÉCLARATION STRUCTURÉE, pas une vérification. FitzUniverse ne
* peut pas prouver qu'une capture est vraie, et n'essaie pas (aucun
* OCR, aucune IA). Le but est triple : forcer l'étudiant à réellement
* déposer, récupérer sa référence, avoir des statistiques.
*
* LE MODÈLE — sur la candidature, nulle part ailleurs
* ----------------------------------------------------
*   users/{uid}/applications/{id}.preuveDepot = {
*     mode: "numero" | "capture" | "transmis",
*     numeroDossier: "<texte>" | absent,
*     fichier: "<chemin Storage>" | absent,
*     deposeLe: "AAAA-MM-JJ",        // déclaré par l'étudiant
*     declareLe: <serverTimestamp>
*   }
*   "numero"   : au moins numeroDossier (non vide, ≤ 64 caractères)
*   "capture"  : au moins fichier
*   "transmis" : la bourse est déposée par un TIERS (js/exigences.js,
*                deposeParUnTiers) — l'étudiant ne dépose pas, il
*                transmet ; fichier OU numeroDossier, au choix
*   Les deux preuves (numéro ET capture) peuvent coexister.
*
* LE VERROU vit en deux endroits qui disent la même chose : ici (le
* client) et firestore.rules (le serveur, qui fait foi) — un statut
* déposé ne s'écrit qu'avec une preuve valide. Jamais de dégradation :
* une candidature DÉJÀ déposée sans preuve reste lisible et modifiable
* sur ses autres champs.
*
* Aucun DOM, aucun Firestore, jamais de mutation de l'argument : même
* forme que js/parcours.js.
* ============================================================
*/

import { formaterDate } from "./echeance.js";

/** Le vocabulaire fermé, à UN SEUL endroit (miroir dans firestore.rules). */
export const MODES = ["numero", "capture", "transmis"];

export const LIBELLES_MODES = {
numero: "Numéro de dossier",
capture: "Capture de confirmation",
transmis: "Dossier transmis"
};

/** Miroir de firestore.rules (numeroDossier.size() <= 64). */
export const LONGUEUR_MAX_NUMERO = 64;

/** Miroir de storage.rules : image ou PDF, 5 Mo au plus. */
export const TAILLE_MAX_FICHIER = 5 * 1024 * 1024;
export const TYPES_FICHIER = ["image/", "application/pdf"];

/** Le chemin Storage d'une capture — le seul endroit qui le construit. */
export function cheminCapture(uid, applicationId, extension) {
const ext = String(extension || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
return `users/${uid}/applications/${applicationId}/preuve-depot.${ext}`;
}

const DATE_ISO = /^\d{4}-\d{2}-\d{2}$/;

function texteNonVide(v) {
return typeof v === "string" && v.trim() !== "";
}

function dateDuJour(aujourdhui) {
const d = aujourdhui instanceof Date ? aujourdhui : new Date(aujourdhui || Date.now());
return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
* Lit la preuve d'une candidature : un objet NORMALISÉ (copie, jamais
* l'original), ou null si aucune preuve n'est portée. Ne juge pas la
* validité — c'est preuveValide().
*/
export function lirePreuve(app) {
const p = app && typeof app === "object" ? app.preuveDepot : undefined;
if (!p || typeof p !== "object") return null;
const preuve = { mode: typeof p.mode === "string" ? p.mode : "" };
if (texteNonVide(p.numeroDossier)) preuve.numeroDossier = p.numeroDossier.trim();
if (texteNonVide(p.fichier)) preuve.fichier = p.fichier.trim();
preuve.deposeLe = typeof p.deposeLe === "string" ? p.deposeLe : "";
if (p.declareLe !== undefined && p.declareLe !== null) preuve.declareLe = p.declareLe;
return preuve;
}

/**
* La règle de validité, la même que firestore.rules — plus une chose
* que le serveur ne sait pas : `parTiers` (la bourse est déposée par un
* tiers, js/exigences.js) impose le mode "transmis", et l'interdit sinon.
* `deposeLe` ne peut pas être dans le futur.
*/
export function preuveValide(preuve, { parTiers = false, aujourdhui = new Date() } = {}) {
if (!preuve || typeof preuve !== "object") return false;
if (!MODES.includes(preuve.mode)) return false;
if (parTiers && preuve.mode !== "transmis") return false;
if (!parTiers && preuve.mode === "transmis") return false;

const numero = texteNonVide(preuve.numeroDossier) && preuve.numeroDossier.trim().length <= LONGUEUR_MAX_NUMERO;
const fichier = texteNonVide(preuve.fichier);

if (preuve.mode === "numero" && !numero) return false;
if (preuve.mode === "capture" && !fichier) return false;
if (preuve.mode === "transmis" && !numero && !fichier) return false;
if (texteNonVide(preuve.numeroDossier) && preuve.numeroDossier.trim().length > LONGUEUR_MAX_NUMERO) return false;

if (typeof preuve.deposeLe !== "string" || !DATE_ISO.test(preuve.deposeLe)) return false;
const [a, m, j] = preuve.deposeLe.split("-").map(Number);
const d = new Date(a, m - 1, j);
if (d.getFullYear() !== a || d.getMonth() !== m - 1 || d.getDate() !== j) return false;
if (preuve.deposeLe > dateDuJour(aujourdhui)) return false;

return true;
}

/**
* La phrase qui explique ce qu'on attend de l'étudiant — jamais un
* blocage muet. `destinataire` (optionnel) : à qui le dossier est
* transmis, quand on le sait.
*/
export function libelleDemande(app, { parTiers = false, destinataire = "" } = {}) {
if (parTiers) {
const a = destinataire ? ` à ${destinataire}` : " à l'organisme qui dépose pour vous";
return `Vous avez transmis votre dossier${a} ; indiquez ce que vous avez reçu en retour : une référence, ou la capture de l'accusé de réception.`;
}
return "Indiquez votre numéro de dossier ou ajoutez la capture de confirmation du portail.";
}

/**
* « Déposée le 7 septembre 2026 · dossier n° 12345 » — ou « · capture
* jointe ». Pour la carte. Une preuve invalide ou absente rend "".
*/
export function resumePreuve(preuve) {
if (!preuve || !DATE_ISO.test(String(preuve.deposeLe || ""))) return "";
const verbe = preuve.mode === "transmis" ? "Transmise" : "Déposée";
const parts = [`${verbe} le ${formaterDate(preuve.deposeLe)}`];
if (texteNonVide(preuve.numeroDossier)) parts.push(`dossier n° ${preuve.numeroDossier.trim()}`);
if (texteNonVide(preuve.fichier)) parts.push("capture jointe");
return parts.join(" · ");
}
