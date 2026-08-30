import { db } from "./firebase-config.js";

import {
collection,
doc,
setDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

console.log("Connexion à Firebase réussie.");

// ===============================
// COLLE TON TABLEAU ICI
// ===============================

const scholarships = [

 {
code: "CN",
nom: "Chinese Government Scholarship",
pays: "Chine",
niveau: "Licence",
financement: "100 %"
},
{
code: "CN",
nom: "Chinese Government Scholarship",
pays: "Chine",
niveau: "Master",
financement: "100 %"
},
{
code: "CN",
nom: "Chinese Government Scholarship",
pays: "Chine",
niveau: "Doctorat",
financement: "100 %"
},
   
{
code: "JP",
nom: "MEXT Scholarship",
pays: "Japon",
niveau: "Licence",
financement: "100 %"
},
{
code: "JP",
nom: "MEXT Scholarship",
pays: "Japon",
niveau: "Master",
financement: "100 %"
},
{
code: "JP",
nom: "MEXT Scholarship",
pays: "Japon",
niveau: "Doctorat",
financement: "100 %"
},

{
code: "KR",
nom: "Global Korea Scholarship",
pays: "Corée du Sud",
niveau: "Licence",
financement: "100 %"
},
{
code: "KR",
nom: "Global Korea Scholarship",
pays: "Corée du Sud",
niveau: "Master",
financement: "100 %"
},
{
code: "KR",
nom: "Global Korea Scholarship",
pays: "Corée du Sud",
niveau: "Doctorat",
financement: "100 %"
},

{
code: "HU",
nom: "Stipendium Hungaricum",
pays: "Hongrie",
niveau: "Licence",
financement: "100 %"
},
{
code: "HU",
nom: "Stipendium Hungaricum",
pays: "Hongrie",
niveau: "Master",
financement: "100 %"
},
{
code: "HU",
nom: "Stipendium Hungaricum",
pays: "Hongrie",
niveau: "Doctorat",
financement: "100 %"
},

{
code: "SA",
nom: "King Abdulaziz Scholarship",
pays: "Arabie Saoudite",
niveau: "Licence",
financement: "100 %"
},
{
code: "SA",
nom: "King Abdulaziz Scholarship",
pays: "Arabie Saoudite",
niveau: "Master",
financement: "100 %"
},
{
code: "SA",
nom: "King Abdulaziz Scholarship",
pays: "Arabie Saoudite",
niveau: "Doctorat",
financement: "100 %"
},

{
code: "TR",
nom: "Türkiye Burslari",
pays: "Turquie",
niveau: "Licence",
financement: "100 %"
},
{
code: "TR",
nom: "Türkiye Burslari",
pays: "Turquie",
niveau: "Master",
financement: "100 %"
},
{
code: "TR",
nom: "Türkiye Burslari",
pays: "Turquie",
niveau: "Doctorat",
financement: "100 %"
},

{
code: "RO",
nom: "Romanian Government Scholarship",
pays: "Roumanie",
niveau: "Licence",
financement: "100 %"
},
{
code: "RO",
nom: "Romanian Government Scholarship",
pays: "Roumanie",
niveau: "Master",
financement: "100 %"
},
{
code: "RO",
nom: "Romanian Government Scholarship",
pays: "Roumanie",
niveau: "Doctorat",
financement: "100 %"
},

{
code: "RU",
nom: "Open Doors Scholarship",
pays: "Russie",
niveau: "Licence",
financement: "100 %"
},
{
code: "RU",
nom: "Open Doors Scholarship",
pays: "Russie",
niveau: "Master",
financement: "100 %"
},
{
code: "RU",
nom: "Open Doors Scholarship",
pays: "Russie",
niveau: "Doctorat",
financement: "100 %"
},

{
code: "IT",
nom: "Italian Government Scholarship",
pays: "Italie",
niveau: "Licence",
financement: "100 %"
},
{
code: "IT",
nom: "Italian Government Scholarship",
pays: "Italie",
niveau: "Master",
financement: "100 %"
},
{
code: "IT",
nom: "Italian Government Scholarship",
pays: "Italie",
niveau: "Doctorat",
financement: "100 %"
},

{
code: "FR",
nom: "Eiffel Excellence Scholarship",
pays: "France",
niveau: "Licence",
financement: "100 %"
},
{
code: "FR",
nom: "Eiffel Excellence Scholarship",
pays: "France",
niveau: "Master",
financement: "100 %"
},
{
code: "FR",
nom: "Eiffel Excellence Scholarship",
pays: "France",
niveau: "Doctorat",
financement: "100 %"
},

{
code: "CA-L",
nom: "Lester B. Pearson International Scholarship",
pays: "Canada",
niveau: "Licence",
financement: "100 %"
},
{
code: "CA-M",
nom: "Vanier Canada Graduate Scholarship",
pays: "Canada",
niveau: "Master",
financement: "100 %"
},
{
code: "CA-D",
nom: "Vanier Canada Graduate Scholarship",
pays: "Canada",
niveau: "Doctorat",
financement: "100 %"
},

];

// ===============================

async function importer() {

for (const scholarship of scholarships) {

const id =
scholarship.nom
.toLowerCase()
.replace(/[^a-z0-9]+/g, "-")
.replace(/^-|-$/g, "")
+
"-" +
scholarship.niveau.toLowerCase();


await setDoc(

doc(db, "scholarships", id),

{

title: scholarship.nom,

country: scholarship.pays,

level: scholarship.niveau,

funding: scholarship.financement,

isActive: true

}

);

console.log("Importé :", scholarship.nom, scholarship.niveau);

}

alert("Import terminé !");
}

importer();
