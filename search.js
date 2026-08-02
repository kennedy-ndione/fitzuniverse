const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const suggestions = document.querySelector("#suggestions");

const mots = [
"Chine",
"Chinese Government Scholarship",
"Canada",
"Vanier Canada Graduate Scholarship",
"Hongrie",
"Stipendium Hungaricum",
"Arabie Saoudite",
"King Abdulaziz University",
"Licence",
"Master",
"Doctorat",
"Informatique",
"Ingénierie",
"Médecine",
"Business",
"Bourse 100 %",
"Université"
];

if (searchInput && searchBtn) {
searchBtn.addEventListener("click", function () {
const value = searchInput.value.toLowerCase();

if (value.trim() === "") {
alert("Veuillez saisir une recherche.");
return;
}

window.location.href =
"scholarships.html?search=" + encodeURIComponent(value);

});

searchInput.addEventListener("keydown", function (event) {

if (event.key === "Enter") {
searchBtn.click();
}

});
}

if (searchInput && suggestions) {
searchInput.addEventListener("input", function () {

const valeur = this.value.toLowerCase();

suggestions.innerHTML = "";

if (valeur === "") {
suggestions.style.display = "none";
return;
}

const resultat = mots.filter(mot =>
mot.toLowerCase().includes(valeur)
);

if (resultat.length > 0) {
suggestions.style.display = "block";
} else {
suggestions.style.display = "none";
}

resultat.slice(0,5).forEach(mot => {

const div = document.createElement("div");

div.className = "suggestion-item";

div.innerHTML = `<i data-lucide="search"></i>${mot}`;

div.addEventListener("click", function () {

searchInput.value = mot;

suggestions.innerHTML = "";

suggestions.style.display = "none";

});

suggestions.appendChild(div);

});

});
}
