/**
* ============================================================
* ScholarBridge — voix de Fitz (js/fitz-voice.js)
* ============================================================
* Point de référence unique pour le texte où Fitz "parle" à
* l'étudiant dans l'espace connecté (dashboard.js, applications.js,
* documents.js, interview-prep.js, advisor.js...). Avant ce fichier,
* ce vocabulaire vivait éparpillé — chaque page réécrivait sa propre
* variante de "Débloquez X avec la formule Y", et FITZ_TIPS n'existait
* que dans dashboard.js.
*
* Principes (à respecter pour tout nouveau texte "Fitz", cohérents
* avec l'usage déjà établi ailleurs sur le site — eligibility-ai.js,
* results.js, offers-context.js) :
*
*  - Fitz parle en son nom : toujours "Fitz", jamais "l'IA" ou "le
*    système" ("Fitz peut...", "Fitz a compris de votre profil...").
*  - Jamais de fausse précision ni de promesse non tenue — même règle
*    que eligibility-ai.js:matchReasons() (pas de pourcentage inventé,
*    pas de délai promis qui n'existe pas).
*  - Rassurant mais honnête, jamais infantilisant : l'étudiant décide,
*    Fitz accompagne.
*  - On reprend les formulations déjà éprouvées ailleurs plutôt que
*    d'en inventer de nouvelles à chaque page.
* ============================================================
*/

// ==========================================================
// VERROUILLAGE DE FONCTIONNALITÉ — texte commun aux pages Fitz dont
// l'accès dépend de la formule (applications.js, documents.js,
// interview-prep.js, et les 5 pages ai-*.js/compress.js). Centralise
// la seule partie qui dérivait d'une page à l'autre : la façon de
// nommer la formule cible et le libellé du bouton — jamais le texte
// descriptif de la fonctionnalité elle-même, qui reste spécifique à
// chaque page.
// ==========================================================

export const FITZ_UNLOCK_CTA = "Choisir ma formule";

export function unlockPlanPhrase(targetPlanLabel) {
return targetPlanLabel
? `la formule <strong>${targetPlanLabel}</strong>`
: "une formule supérieure";
}

// ==========================================================
// CONSEILS DU JOUR — panneau coach du tableau de bord.
// ==========================================================

export const FITZ_TIPS = [
"Une lettre de motivation efficace commence toujours par une accroche personnelle, unique à votre parcours.",
"Vérifiez régulièrement les dates limites de vos candidatures suivies pour garder une longueur d'avance sur vos échéances.",
"Un dossier avec des documents traduits et certifiés a plus de chances d'être traité rapidement.",
"Préparez vos réponses aux questions d'entretien classiques avant même de recevoir une invitation."
];

export function randomFitzTip() {
return FITZ_TIPS[Math.floor(Math.random() * FITZ_TIPS.length)];
}

// ==========================================================
// MODÈLES D'E-MAILS — préparés pour la future Cloud Function d'envoi
// (voir l'en-tête d'architecture dans applications.js et le flag
// `just_upgraded` dans dashboard.js : le backend d'envoi n'existe pas
// encore, Firebase doit passer en formule Blaze + un service d'e-mail
// doit être configuré). Ces modèles ne sont envoyés par rien
// aujourd'hui — ils documentent le texte exact que la Cloud Function
// consommera le jour où elle existera, dans le même ton que le reste
// de l'espace étudiant.
//
// Chaque modèle est une fonction pure (aucun accès Firebase/réseau)
// qui prend les données déjà disponibles côté client et renvoie
// { subject, body } en texte brut, prêt à être passé tel quel au
// service d'envoi.
// ==========================================================

export const FITZ_EMAIL_TEMPLATES = {

// Rappel de candidature à échéance proche (nextCheckDate d'une
// candidature suivie sur applications.html — voir la note
// d'architecture en tête de applications.js).
applicationDeadlineReminder({ studentName, university, scholarship, deadline }) {

const greeting = studentName ? `Bonjour ${studentName},` : "Bonjour,";

return {
subject: `Fitz vous rappelle : échéance à venir pour ${university}`,
body: `${greeting}

Je voulais vous prévenir : votre candidature pour ${university}${scholarship ? ` (${scholarship})` : ""} approche de son échéance${deadline ? ` — date limite le ${deadline}` : ""}.

Prenez un moment pour vérifier où vous en êtes sur cette candidature. Si tout est déjà en ordre, tant mieux — sinon, c'est le bon moment pour vous y remettre.

Vous pouvez suivre cette candidature à tout moment depuis votre espace ScholarBridge.

Fitz`
};

},

// Checklist de dossier incomplète (candidature avec des éléments de
// checklist encore "manquant" — voir renderChecklistSection dans
// applications.js).
documentChecklistIncomplete({ studentName, university, missingCount }) {

const greeting = studentName ? `Bonjour ${studentName},` : "Bonjour,";
const count = missingCount || 0;

return {
subject: `Fitz a repéré ${count} élément${count > 1 ? "s" : ""} à compléter pour ${university}`,
body: `${greeting}

En regardant votre dossier de candidature pour ${university}, j'ai remarqué qu'il reste ${count} élément${count > 1 ? "s" : ""} de votre checklist à compléter (lettres de recommandation, test de langue, ou preuve financière selon ce qui s'applique à cette candidature).

Rien d'urgent si votre échéance est encore loin — mais mieux vaut ne pas laisser ça traîner jusqu'au dernier moment.

Fitz`
};

},

// Bienvenue après activation d'un accompagnement payant (flag
// `just_upgraded` posé par le futur backend de paiement — voir
// dashboard.js).
accompagnementWelcome({ studentName, planLabel }) {

const greeting = studentName ? `Bonjour ${studentName},` : "Bonjour,";

return {
subject: `Bienvenue dans votre accompagnement ${planLabel}`,
body: `${greeting}

Votre accompagnement ${planLabel} est bien activé. Je suis Fitz, et je vais vous accompagner à chaque étape de vos candidatures — lettres de motivation, e-mails, vérification de dossier, et plus selon votre formule.

Si ce n'est pas déjà fait, la première étape est de compléter votre profil : c'est ce qui me permet de vraiment vous connaître et d'affiner mes recommandations.

À très vite dans votre espace ScholarBridge.

Fitz`
};

}

};
