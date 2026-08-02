class EligibilityAI {

constructor(responses) {
this.responses = responses;
}

analyze() {

const result = {
score: 0,
strengths: [],
weaknesses: [],
recommendations: [],
eligibleCountries: [],
eligibleScholarships: [],
scholarshipDetails: []
};

result.score += this.calculateStudyLevel(result);
result.score += this.calculateAverage(result);
result.score += this.calculateEnglish(result);
result.score += this.calculatePassport(result);
result.score += this.calculateStudyField(result);
result.score += this.calculateDestination(result);
result.score += this.calculateGoal(result);

this.matchScholarships(result);

return result;
}

calculateStudyLevel(result) {

if (this.responses.studyLevel) {
result.strengths.push(`Niveau d'études renseigné : ${this.responses.studyLevel}`);
}

return 10;
}

calculateAverage(result) {

const average = parseFloat(
String(this.responses.average || "").replace(",", ".")
);

if (isNaN(average)) {
result.weaknesses.push("Votre moyenne n'a pas pu être analysée.");
return 0;
}

if (average >= 18) {
result.strengths.push("Excellent dossier académique.");
return 30;
}

if (average >= 16) {
result.strengths.push("Très bonne moyenne générale.");
return 27;
}

if (average >= 14) {
result.strengths.push("Bon niveau académique.");
return 24;
}

if (average >= 12) {
result.weaknesses.push("Une meilleure moyenne augmentera vos chances.");
return 18;
}

if (average >= 10) {
result.weaknesses.push("Essayez d'améliorer vos résultats scolaires.");
return 12;
}

result.weaknesses.push("Votre moyenne est actuellement un point faible.");
return 5;
}

calculateEnglish(result) {

const english = (this.responses.english || "").toLowerCase();

if (english.includes("courant") || english.includes("bilingue")) {
result.strengths.push("Excellent niveau d'anglais.");
return 20;
}

if (english.includes("bon")) {
result.strengths.push("Bon niveau d'anglais.");
return 16;
}

if (english.includes("intermédiaire")) {
result.weaknesses.push("Renforcez votre anglais pour accéder à plus de bourses.");
return 10;
}

if (english.includes("débutant")) {
result.weaknesses.push("L'anglais est votre principal axe d'amélioration.");
return 4;
}

return 0;
}

calculatePassport(result) {

const passport = (this.responses.passport || "").toLowerCase();

if (passport.includes("valide")) {
result.strengths.push("Vous possédez déjà un passeport valide.");
return 10;
}

if (passport.includes("cours")) {
result.weaknesses.push("Terminez rapidement votre demande de passeport.");
return 7;
}

if (passport.includes("expir")) {
result.weaknesses.push("Renouvelez votre passeport.");
return 4;
}

if (passport.includes("pas encore") || passport.includes("aucun")) {
result.weaknesses.push("Obtenir un passeport sera une étape indispensable.");
return 2;
}

return 0;
}

calculateStudyField(result) {

if (this.responses.studyCategory) {
result.strengths.push(`Domaine d'études identifié : ${this.responses.studyCategory}`);
}

return 10;
}

calculateDestination(result) {

const country = (this.responses.destinationCountry || "").toLowerCase();

if (country.includes("canada")) {

result.eligibleCountries.push("Canada");
result.eligibleScholarships.push("Bourses du gouvernement canadien");
return 10;

}

if (country.includes("chine")) {

result.eligibleCountries.push("Chine");
result.eligibleScholarships.push("Chinese Government Scholarship (CSC)");
return 10;

}

if (country.includes("hongrie")) {

result.eligibleCountries.push("Hongrie");
result.eligibleScholarships.push("Stipendium Hungaricum");
return 10;

}

if (country.includes("turquie")) {

result.eligibleCountries.push("Turquie");
result.eligibleScholarships.push("Türkiye Bursları");
return 10;

}

result.eligibleCountries.push("Plusieurs destinations possibles");
result.eligibleScholarships.push("Analyse personnalisée nécessaire");

return 8;

}


calculateGoal(result) {

const goal = (this.responses.goal || "").toLowerCase();

if (goal.includes("complète")) {

result.recommendations.push(
"Privilégiez les bourses entièrement financées."
);

} else {

result.recommendations.push(
"N'écartez pas les bourses partiellement financées."
);

}

return 10;

}

// Construit, pour chaque programme déjà identifié par calculateDestination()
// (les seules bourses réelles connues à ce stade), une explication basée
// uniquement sur les réponses effectivement données par l'étudiant.
// Aucun critère d'éligibilité par bourse n'est inventé ici : ScholarBridge
// ne dispose pas encore d'une base fiable de critères par programme, donc
// on ne fabrique pas de faux pourcentage de compatibilité par bourse.
matchScholarships(result) {

const reasons = [];

if (this.responses.studyLevel) {
reasons.push(`Niveau d'études compatible : ${this.responses.studyLevel}`);
}

const average = parseFloat(
String(this.responses.average || "").replace(",", ".")
);

if (!isNaN(average) && average >= 12) {
reasons.push("Moyenne académique suffisante pour la majorité des programmes");
}

const english = (this.responses.english || "").toLowerCase();

if (english.includes("courant") || english.includes("bilingue") || english.includes("bon")) {
reasons.push("Niveau d'anglais compatible avec un enseignement en anglais");
}

if (!reasons.length) {
reasons.push("Profil compatible avec les critères généraux de ce programme.");
}

result.eligibleScholarships.forEach((name, index) => {

result.scholarshipDetails.push({
name,
country: result.eligibleCountries[index] || result.eligibleCountries[0] || "",
reasons
});

});

}

}
