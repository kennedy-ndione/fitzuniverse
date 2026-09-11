/**
* ============================================================
* FitzUniverse — création d'un compte gratuit, en place
* ============================================================
*
* POURQUOI CE MODULE EXISTE
*
* Jusqu'au 2026-09-04, le SEUL endroit du site où un compte pouvait
* naître était payment.html, APRÈS le choix d'une formule payante
* (signup.html avait été retiré, et login.js ne crée rien malgré des
* champs nommés `signupEmail`/`signupPassword`).
*
* Conséquence : impossible d'avoir un compte gratuit. Or FitzUniverse
* en a besoin — l'analyse du diagnostic est offerte, mais réservée aux
* comptes, pour que chaque visiteur anonyme ne coûte pas un appel de
* modèle.
*
* Ce module crée un compte LÀ OÙ L'ÉTUDIANT SE TROUVE, sans le sortir
* de sa page. C'est délibéré, et c'est le meilleur moment du parcours
* pour demander une inscription : il vient de voir son score, il veut
* savoir ce qu'il signifie. L'envoyer sur une autre page pour revenir
* ensuite, c'est perdre la moitié des gens en chemin.
*
* CE QU'IL N'ÉCRIT PAS
* --------------------
* Aucun champ `plan`, `planExpiresAt`, `disabled` ni `testerAccess` :
* firestore.rules les réserve à l'administrateur, et une écriture qui
* les contiendrait serait refusée en bloc. Un compte créé ici est
* gratuit, point.
*
* DUPLICATION SOLDÉE (lot PROFIL-PAR-NIVEAU, 2026-09-11)
* payment.js (buildDefaultUserDoc) et ce module construisaient chacun
* leur copie du document utilisateur. Les deux passent désormais par
* js/compte-par-defaut.js — un test de forme vérifie que les deux
* fichiers l'importent (test/diagnostic-vers-profil.test.mjs).
* ============================================================
*/

import { escapeHtml } from "./ai/format.js";
import { documentUtilisateurParDefaut } from "./compte-par-defaut.js";
import { lireReponsesDiagnostic } from "./diagnostic-vers-profil.js";

const MESSAGES = {
nom: "Indiquez votre nom complet.",
email: "Vérifiez le format de votre adresse e-mail.",
court: "Votre mot de passe a besoin d'au moins 8 caractères.",
majuscule: "Votre mot de passe a besoin d'au moins une majuscule.",
chiffre: "Votre mot de passe a besoin d'au moins un chiffre."
};

// Mêmes règles que payment.js — un étudiant qui s'inscrit ici et un
// étudiant qui achète ne doivent pas rencontrer deux exigences
// différentes pour le même mot de passe.
function valider({ nom, email, motDePasse }) {

if (!nom || nom.length < 2) return MESSAGES.nom;
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return MESSAGES.email;
if (motDePasse.length < 8) return MESSAGES.court;
if (!/[A-Z]/.test(motDePasse)) return MESSAGES.majuscule;
if (!/[0-9]/.test(motDePasse)) return MESSAGES.chiffre;

return null;

}

/**
* Messages d'erreur Firebase traduits. Un étudiant ne doit jamais lire
* « auth/email-already-in-use » — et surtout, celui qui a déjà un
* compte doit comprendre qu'il n'a rien fait de mal.
*/
function messageFirebase(code) {

if (code === "auth/email-already-in-use") {
return "Cette adresse a déjà un compte. Connectez-vous pour retrouver votre diagnostic.";
}

if (code === "auth/invalid-email") return MESSAGES.email;
if (code === "auth/weak-password") return MESSAGES.court;

if (code === "auth/network-request-failed") {
return "Connexion interrompue. Vérifiez votre réseau, puis réessayez.";
}

if (code === "auth/too-many-requests") {
return "Trop de tentatives. Patientez quelques minutes avant de réessayer.";
}

return "La création du compte n'a pas abouti. Réessayez dans un instant.";

}

/**
* Le formulaire, en HTML. Rendu par l'appelant dans son propre bloc :
* ce module ne décide pas de l'endroit, seulement du contenu.
*
* @param {Object} [options]
* @param {string} [options.titre]
* @param {string} [options.intro]
* @param {string} [options.bouton]
*/
export function formulaireCompteHTML({
titre = "Créez votre compte gratuit",
intro = "",
bouton = "Créer mon compte"
} = {}) {

return `<form class="compte-inline" id="compteInline" novalidate>
<h4 class="compte-inline-titre">${escapeHtml(titre)}</h4>
${intro ? `<p class="compte-inline-intro">${escapeHtml(intro)}</p>` : ""}
<label class="compte-inline-field">
<span>Nom complet</span>
<input type="text" name="nom" autocomplete="name" required>
</label>
<label class="compte-inline-field">
<span>Adresse e-mail</span>
<input type="email" name="email" autocomplete="email" required>
</label>
<label class="compte-inline-field">
<span>Mot de passe</span>
<input type="password" name="motDePasse" autocomplete="new-password" required>
<small>8 caractères minimum, une majuscule et un chiffre.</small>
</label>
<p class="compte-inline-error" id="compteInlineError" role="alert" hidden></p>
<button type="submit" class="btn btn-primary" id="compteInlineSubmit">
<span>${escapeHtml(bouton)}</span>
</button>
<p class="compte-inline-note">Gratuit, sans engagement. Vous pourrez choisir une formule plus tard.</p>
</form>`;

}

/**
* Branche le formulaire rendu et crée le compte à la soumission.
*
* @param {HTMLElement} racine - l'élément qui contient le formulaire
* @param {(utilisateur: Object) => void} auSucces
*/
export function brancherFormulaireCompte(racine, auSucces) {

const form = racine.querySelector("#compteInline");

if (!form) return;

const erreur = racine.querySelector("#compteInlineError");
const bouton = racine.querySelector("#compteInlineSubmit");

const afficherErreur = (message) => {
erreur.textContent = message;
erreur.hidden = false;
};

form.addEventListener("submit", async (evenement) => {

evenement.preventDefault();
erreur.hidden = true;

const nom = form.elements.nom.value.trim();
const email = form.elements.email.value.trim();
const motDePasse = form.elements.motDePasse.value;

const probleme = valider({ nom, email, motDePasse });

if (probleme) {
afficherErreur(probleme);
return;
}

bouton.disabled = true;
bouton.querySelector("span").textContent = "Création du compte...";

try {

const utilisateur = await creerCompteGratuit({ nom, email, motDePasse });

auSucces(utilisateur);

} catch (error) {

console.error("[Fitz] création de compte :", error);

bouton.disabled = false;
bouton.querySelector("span").textContent = "Créer mon compte";

afficherErreur(messageFirebase(error?.code));

}

});

}

/**
* Crée le compte Auth ET son document Firestore.
*
* Les deux vont ensemble : un compte Auth sans document utilisateur
* casse le tableau de bord, le profil et le contrôle de formule. En cas
* d'échec de la seconde écriture on ne laisse donc pas la situation en
* l'état — on prévient, plutôt que de laisser l'étudiant découvrir un
* espace vide.
*
* @returns {Promise<Object>} l'utilisateur Firebase
*/
export async function creerCompteGratuit({ nom, email, motDePasse }) {

const { auth, db } = await import("../firebase-config.js");

const { createUserWithEmailAndPassword, updateProfile } = await import(
"https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js"
);

const { doc, setDoc, serverTimestamp } = await import(
"https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js"
);

const credential = await createUserWithEmailAndPassword(auth, email, motDePasse);

await updateProfile(credential.user, { displayName: nom });

// Le MÊME document que payment.js (js/compte-par-defaut.js), SANS
// pendingPlan : personne n'a choisi de formule ici. Aucun champ réservé
// à l'administrateur — firestore.rules refuserait toute la création.
// Le profil reprend les réponses du diagnostic de la session.
await setDoc(doc(db, "users", credential.user.uid), documentUtilisateurParDefaut({
uid: credential.user.uid,
name: nom,
email,
reponsesDiagnostic: lireReponsesDiagnostic(),
serverTimestamp
}));

return credential.user;

}
