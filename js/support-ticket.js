/**
* ============================================================
* FitzUniverse — « Signaler un problème » (grille A, 2026-09-07)
* ============================================================
*
* Le service après-vente, ouvert à TOUTE formule payante (Pass
* Découverte et offres préinscription compris), jamais au gratuit :
* un problème technique, un paiement, une erreur du site. Voie
* SÉPARÉE de la messagerie FitzUniverse — ce n'est pas un
* accompagnement : aucune question de dossier, aucune relecture n'y
* est traitée, et le libellé le dit. Fonctionnalité "support_ticket"
* (js/plan-features.js), jamais "student_messaging".
*
* Lot FINITIONS-VISUELLES (2026-09-11) : le formulaire n'est plus une
* carte sous la conversation (sur téléphone, la page est un cadre plein
* écran qui ne défile pas : les deux cartes se partageaient l'écran et
* la conversation était écrasée). Il vit dans une FEUILLE
* (#supportSheet, role="dialog") ouverte par le bouton #supportOpenBtn
* de l'en-tête de la conversation. La feuille se ferme par la croix,
* par Échap et en touchant l'extérieur ; le focus revient au bouton.
*
* Écrit dans la collection de premier niveau `supportTickets`, avec la
* forme imposée par firestore.rules ; atterrit dans le centre de
* messages de l'administration (admin/messages.html).
* ============================================================
*/

import { db } from "../firebase-config.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { DELAI_REPONSE } from "./delai-reponse.js";

export const SUJETS_SUPPORT = {
paiement: "Paiement",
technique: "Problème technique",
site: "Erreur sur le site"
};

// Après un envoi réussi, la feuille dit « envoyé » puis se ferme seule.
const FERMETURE_APRES_ENVOI_MS = 1400;

/**
* @param {{user:{uid:string,email?:string}, userData?:Object, profile?:Object}} ctx - résultat de bootstrapShell()
*/
export function initSupportForm(ctx) {

const sheet = document.getElementById("supportSheet");
const form = document.getElementById("supportForm");
const ouvrirBtn = document.getElementById("supportOpenBtn");
if (!sheet || !form || !ouvrirBtn) return;

document.querySelectorAll("[data-delai-reponse]").forEach((el) => { el.textContent = DELAI_REPONSE; });

// Le droit est vérifié par l'appelant (js/messages-page.js) : ici, on
// montre le bouton.
ouvrirBtn.hidden = false;

const fermerBtn = document.getElementById("supportCloseBtn");
const sujet = document.getElementById("supportSujet");
const texte = document.getElementById("supportTexte");
const bouton = document.getElementById("supportSend");
const fait = document.getElementById("supportDone");

let minuterie = null;

function ouvrir() {
clearTimeout(minuterie);
fait.hidden = true;
sheet.hidden = false;
ouvrirBtn.setAttribute("aria-expanded", "true");
document.addEventListener("keydown", surTouche);
// Le champ de texte reçoit le focus : sur téléphone le clavier s'ouvre
// et la feuille suit le viewport visible (--vvh, css).
setTimeout(() => texte.focus(), 30);
}

function fermer() {
clearTimeout(minuterie);
sheet.hidden = true;
ouvrirBtn.setAttribute("aria-expanded", "false");
document.removeEventListener("keydown", surTouche);
ouvrirBtn.focus();
}

function surTouche(event) {
if (event.key === "Escape") { event.preventDefault(); fermer(); }
}

ouvrirBtn.addEventListener("click", ouvrir);
if (fermerBtn) fermerBtn.addEventListener("click", fermer);

// Toucher l'extérieur de la carte ferme la feuille — le voile est la
// feuille elle-même, la carte est son seul enfant.
sheet.addEventListener("click", (event) => {
if (event.target === sheet) fermer();
});

// LOT 119 (2026-09-26) : « Signaler un problème » ailleurs dans l'espace
// (js/fitz-recours.js) mène à messages.html#signaler. L'ancre n'existait
// pas : l'étudiant arrivait sur la conversation, sans la feuille, et
// devait trouver le bouton lui-même. La feuille s'ouvre désormais seule.
if (window.location.hash === "#signaler") ouvrir();

form.addEventListener("submit", async (event) => {

event.preventDefault();

const description = texte.value.trim();
if (!description || bouton.disabled) return;

bouton.disabled = true;

try {

// Forme imposée par firestore.rules (supportTickets) — ne rien
// ajouter ici sans mettre à jour la règle.
await addDoc(collection(db, "supportTickets"), {
uid: ctx.user.uid,
email: ctx.user.email || (ctx.userData && ctx.userData.email) || "",
name: (ctx.profile && ctx.profile.name) || (ctx.userData && ctx.userData.name) || "",
sujet: SUJETS_SUPPORT[sujet.value] ? sujet.value : "technique",
texte: description,
page: window.location.pathname,
status: "nouveau",
createdAt: serverTimestamp()
});

texte.value = "";
fait.hidden = false;
minuterie = setTimeout(fermer, FERMETURE_APRES_ENVOI_MS);

} catch (error) {

console.error("Signalement non envoyé :", error);
alert("Votre signalement n'est pas parti. Vérifiez votre connexion, puis réessayez.");

} finally {

bouton.disabled = false;

}

});

if (window.lucide) lucide.createIcons();

}
