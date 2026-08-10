// -------- offers-context.js --------
// Bandeau contextuel affiché uniquement si offers.html est atteint
// depuis scholarship-details.html avec ?program=<id>[&score=<percent>]
// (sidebar, résultat du diagnostic ou nudge de retour portail — voir
// details.js/buildOffersUrl). Module séparé plutôt que fusionné dans
// offers.js (script classique, non-module) : évite de convertir tout
// offers.js pour un besoin isolé qui ne concerne que ce bandeau.
// Sans "program" dans l'URL, ce fichier ne fait rien — la page se
// comporte exactement comme avant.

import { db } from "./firebase-config.js";

import {
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

async function initOffersContext() {

const params = new URLSearchParams(window.location.search);
const programId = params.get("program");

if (!programId) return;

const banner = document.getElementById("offersContextBanner");
const text = document.getElementById("offersContextText");

if (!banner || !text) return;

try {

const programSnap = await getDoc(doc(db, "programs", programId));

if (!programSnap.exists()) return;

const program = programSnap.data();

const [universitySnap, scholarshipSnap] = await Promise.all([
program.universityId ? getDoc(doc(db, "universities", program.universityId)) : null,
program.scholarshipId ? getDoc(doc(db, "scholarships", program.scholarshipId)) : null
]);

const universityName = universitySnap && universitySnap.exists() ? universitySnap.data().name : "";
const scholarshipTitle = scholarshipSnap && scholarshipSnap.exists() ? scholarshipSnap.data().title : "";

const programLabel = universityName
? (scholarshipTitle ? `${universityName} (${scholarshipTitle})` : universityName)
: scholarshipTitle;

// Ni université ni bourse identifiable (id périmé, doc supprimé
// entretemps...) : rien d'utile à afficher, on reste sur le
// comportement par défaut plutôt que d'inventer un libellé vide.
if (!programLabel) return;

const scoreParam = params.get("score");
const score = scoreParam !== null && !Number.isNaN(Number(scoreParam)) ? Math.round(Number(scoreParam)) : null;

text.innerHTML = score !== null
? `Vous avez <strong>${score}% de compatibilité</strong> avec <strong>${programLabel}</strong> — voici comment Fitz peut vous accompagner.`
: `Vous vous intéressez à <strong>${programLabel}</strong> — voici comment Fitz peut vous accompagner.`;

banner.hidden = false;

if (window.lucide) lucide.createIcons();

} catch (error) {

// Échec silencieux (réseau, doc manquant...) : la page se comporte
// comme si aucun contexte n'avait été transmis, jamais d'erreur
// visible pour l'étudiant sur une page de choix de formule.
console.error("Bandeau contextuel offers.html : échec du chargement", error);

}

}

initOffersContext();
