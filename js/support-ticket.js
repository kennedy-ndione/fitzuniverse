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

/**
* @param {{user:{uid:string,email?:string}, userData?:Object, profile?:Object}} ctx - résultat de bootstrapShell()
*/
export function initSupportForm(ctx) {

const card = document.getElementById("supportCard");
const form = document.getElementById("supportForm");
if (!card || !form) return;

document.querySelectorAll("[data-delai-reponse]").forEach((el) => { el.textContent = DELAI_REPONSE; });

card.hidden = false;

const sujet = document.getElementById("supportSujet");
const texte = document.getElementById("supportTexte");
const bouton = document.getElementById("supportSend");
const fait = document.getElementById("supportDone");

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

} catch (error) {

console.error("Signalement non envoyé :", error);
alert("Votre signalement n'est pas parti. Vérifiez votre connexion, puis réessayez.");

} finally {

bouton.disabled = false;

}

});

if (window.lucide) lucide.createIcons();

}
