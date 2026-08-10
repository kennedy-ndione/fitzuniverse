// Bouton d'entrée du tunnel d'éligibilité : jusqu'ici sans effet,
// il redirige maintenant vers le questionnaire.
const startButton = document.getElementById("startButton");

// returnTo (voir scholarship-details.html/details.js) : transmis tel
// quel au questionnaire, qui le relaiera à son tour à la fin du test
// (eligibility-questions.js/finish()) pour ramener l'étudiant sur la
// fiche précise qui l'a envoyé ici, plutôt que sur results.html par
// défaut.
const returnTo = new URLSearchParams(window.location.search).get("returnTo");

if (startButton) {
startButton.addEventListener("click", () => {
window.location.href = returnTo
? `eligibility-questions.html?returnTo=${encodeURIComponent(returnTo)}`
: "eligibility-questions.html";
});
}

const messages = [
"Analyse de votre parcours scolaire...",
"Vérification de vos informations...",
"Recherche des pays compatibles...",
"Analyse des universités adaptées...",
"Comparaison avec les critères des bourses...",
"Calcul de votre Score ScholarBridge...",
"Génération de vos recommandations...",
"Analyse prête."
];

const aiStatus = document.getElementById("aiStatus");

const progressBar = document.querySelector(".progress-bar");

let currentMessage = 0;

let progress = 0;

setInterval(() => {

currentMessage++;

if(currentMessage >= messages.length){
currentMessage = 0;
}

progress += 100 / messages.length;

if(progress > 100){
progress = 100;
}

progressBar.style.width = progress + "%";

aiStatus.style.opacity = 0;

setTimeout(() => {

aiStatus.textContent = messages[currentMessage];
aiStatus.style.opacity = 1;

},300);

},2500);
