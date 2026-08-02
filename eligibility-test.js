// Bouton d'entrée du tunnel d'éligibilité : jusqu'ici sans effet,
// il redirige maintenant vers le questionnaire.
const startButton = document.getElementById("startButton");

if (startButton) {
startButton.addEventListener("click", () => {
window.location.href = "eligibility-questions.html";
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
