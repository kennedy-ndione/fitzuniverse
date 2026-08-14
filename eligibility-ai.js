// ============================================================
// EligibilityAI — calcule le score de diagnostic (points forts/
// faibles/recommandations) à partir des réponses de
// eligibility-questions.html.
//
// Reconnexion aux données réelles (audit du 2026-08-14) : cette classe
// ne détermine plus elle-même "quelles bourses/universités" — c'était
// jusqu'ici calculateDestination() + matchScholarships(), qui ne
// reconnaissaient que 4 pays codés en dur (Canada/Chine/Hongrie/
// Turquie) par mot-clé, tous les autres pays du vrai catalogue
// retombant sur "Analyse personnalisée nécessaire". Cette
// responsabilité est déplacée vers results.js, qui appelle
// recommendPrograms() (js/recommend-programs.js) sur le catalogue
// Firestore réel — la même jointure programs/universities/scholarships
// déjà utilisée par applications.js, jamais une 4e implémentation.
// EligibilityAI garde uniquement le score global (académique, langue,
// documents...) et matchReasons(), qui explique honnêtement — à partir
// des réponses réelles, jamais d'un pourcentage de compatibilité
// inventé par bourse — pourquoi une opportunité correspond.
// ============================================================

// Table de conversion vers un pourcentage 0-100 commun, pour comparer
// équitablement des moyennes saisies dans des systèmes différents avant
// d'appliquer les mêmes seuils de score. Approximations documentées,
// pas des équivalences officielles (aucune table universelle n'existe) :
// - "20" (système francophone, /20) : pourcentage = (valeur/20)*100
// - "100" (/100) ou "other" (autre système, déjà exprimé en %) : valeur
//   inchangée
// - "gpa4" (GPA nord-américain /4) : conversion linéaire, pourcentage =
//   (valeur/4)*100 — la correspondance réelle GPA↔% varie selon les
//   établissements, cette conversion reste une approximation simple
// - "letters" (lettres A-F) : mapping fixe par lettre, valeur médiane
//   indicative de la plage que chaque lettre couvre habituellement
//   (A=95, B=85, C=75, D=65, F=40)
// Par défaut (scale absent ou inconnu) : traité comme /20, pour rester
// compatible avec les réponses enregistrées avant l'ajout du sélecteur
// d'échelle.
const LETTER_GRADE_PERCENT = { A: 95, B: 85, C: 75, D: 65, F: 40 };

export function normalizeAverageToPercent(rawValue, scale) {

if (scale === "letters") {
const letter = String(rawValue || "").trim().toUpperCase();
return Object.prototype.hasOwnProperty.call(LETTER_GRADE_PERCENT, letter) ? LETTER_GRADE_PERCENT[letter] : null;
}

const value = parseFloat(String(rawValue || "").replace(",", "."));

if (isNaN(value)) return null;

switch (scale) {

case "100":
case "other":
return Math.max(0, Math.min(100, value));

case "gpa4":
return Math.max(0, Math.min(100, (value / 4) * 100));

case "20":
default:
return Math.max(0, Math.min(100, (value / 20) * 100));

}

}

export class EligibilityAI {

constructor(responses) {
this.responses = responses;
}

analyze() {

const result = {
score: 0,
strengths: [],
weaknesses: [],
recommendations: []
};

result.score += this.calculateStudyLevel(result);
result.score += this.calculateAverage(result);
result.score += this.calculateEnglish(result);
result.score += this.calculatePassport(result);
result.score += this.calculateStudyField(result);
result.score += this.calculateDestination(result);
result.score += this.calculateGoal(result);

return result;

}

calculateStudyLevel(result) {

if (this.responses.studyLevel) {
result.strengths.push(`Niveau d'études renseigné : ${this.responses.studyLevel}`);
}

return 10;
}

calculateAverage(result) {

const percent = normalizeAverageToPercent(this.responses.average, this.responses.averageScale);

if (percent === null) {
result.weaknesses.push("Votre moyenne n'a pas pu être analysée.");
return 0;
}

// Seuils identiques à l'ancienne échelle /20 (18, 16, 14, 12, 10),
// exprimés ici en % — pour une réponse saisie en /20, le résultat est
// rigoureusement inchangé ; les autres systèmes sont désormais évalués
// avec la même exigence relative plutôt que d'être mal interprétés
// comme des valeurs /20.
if (percent >= 90) {
result.strengths.push("Excellent dossier académique.");
return 30;
}

if (percent >= 80) {
result.strengths.push("Très bonne moyenne générale.");
return 27;
}

if (percent >= 70) {
result.strengths.push("Bon niveau académique.");
return 24;
}

if (percent >= 60) {
result.weaknesses.push("Une meilleure moyenne augmentera vos chances.");
return 18;
}

if (percent >= 50) {
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

// Ne détermine plus quelles bourses/universités correspondent (voir
// results.js/recommendPrograms) — se contente de noter le fait d'avoir,
// ou non, déjà une préférence de destination.
calculateDestination(result) {

const country = this.responses.destinationCountry;

if (country && country !== "Je ne sais pas encore") {
result.strengths.push(`Destination déjà identifiée : ${country}`);
return 10;
}

result.recommendations.push("Fitz peut vous proposer plusieurs destinations compatibles avec votre profil.");

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

// Explique, pour une opportunité réelle trouvée par recommendPrograms()
// (results.js), pourquoi elle correspond — uniquement à partir des
// réponses effectivement données par l'étudiant. Aucun critère
// d'éligibilité par bourse n'est inventé ici : ScholarBridge ne dispose
// pas encore d'une base fiable de critères par programme, donc on ne
// fabrique pas de faux pourcentage de compatibilité par bourse. Les
// mêmes raisons s'appliquent à chaque opportunité affichée : ce sont
// des faits sur le profil de l'étudiant, pas un score propre au
// programme.
matchReasons() {

const reasons = [];

if (this.responses.studyLevel) {
reasons.push(`Niveau d'études compatible : ${this.responses.studyLevel}`);
}

const percent = normalizeAverageToPercent(this.responses.average, this.responses.averageScale);

if (percent !== null && percent >= 60) {
reasons.push("Moyenne académique suffisante pour la majorité des programmes");
}

const english = (this.responses.english || "").toLowerCase();

if (english.includes("courant") || english.includes("bilingue") || english.includes("bon")) {
reasons.push("Niveau d'anglais compatible avec un enseignement en anglais");
}

if (!reasons.length) {
reasons.push("Profil compatible avec les critères généraux de ce programme.");
}

return reasons;

}

}
