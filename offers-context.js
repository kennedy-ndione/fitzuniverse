// -------- offers-context.js --------
// Bandeau contextuel affiché uniquement si offers.html est atteint
// depuis scholarship-details.html avec ?program=<id>[&score=<percent>]
// (sidebar, résultat du diagnostic ou nudge de retour portail — voir
// details.js/buildOffersUrl). Module séparé plutôt que fusionné dans
// offers.js (script classique, non-module) : évite de convertir tout
// offers.js pour un besoin isolé qui ne concerne que ce bandeau.
// Sans "program" dans l'URL, ce fichier ne fait rien — la page se
// comporte exactement comme avant.

// Le catalogue se lit dans l'instantané publié (js/catalog-data.js), plus
// dans Firestore : depuis le 2026-09-26, les trois collections du
// catalogue ne sont lisibles que par l'administration (firestore.rules).
import { documentDuCatalogue } from "./js/catalog-data.js";

async function initOffersContext() {

const params = new URLSearchParams(window.location.search);
const programId = params.get("program");

if (!programId) return;

const banner = document.getElementById("offersContextBanner");
const text = document.getElementById("offersContextText");

if (!banner || !text) return;

try {

const program = await documentDuCatalogue("programs", programId);

if (!program) return;

const [university, scholarship] = await Promise.all([
program.universityId ? documentDuCatalogue("universities", program.universityId) : null,
program.scholarshipId ? documentDuCatalogue("scholarships", program.scholarshipId) : null
]);

const universityName = university ? university.name || "" : "";
const scholarshipTitle = scholarship ? scholarship.title || "" : "";

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
