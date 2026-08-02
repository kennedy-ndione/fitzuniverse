export const documents = [

{
id: "passport",

name: "Passeport",

category: "Identité",

description: "Passeport valide pendant toute la durée des études.",

requiredFor: [
"Licence",
"Master",
"Doctorat"
],

aiSupported: false,

downloadableTemplate: false
},

{
id: "cv",

name: "Curriculum Vitae",

category: "Académique",

description: "CV académique adapté aux candidatures internationales.",

requiredFor: [
"Licence",
"Master",
"Doctorat"
],

aiSupported: true,

downloadableTemplate: true
},

{
id: "motivation-letter",

name: "Lettre de motivation",

category: "Académique",

description: "Lettre expliquant votre projet d'études et vos motivations.",

requiredFor: [
"Licence",
"Master",
"Doctorat"
],

aiSupported: true,

downloadableTemplate: true
},

{
id: "transcripts",

name: "Relevés de notes",

category: "Académique",

description: "Relevés officiels des études précédentes.",

requiredFor: [
"Licence",
"Master",
"Doctorat"
],

aiSupported: false,

downloadableTemplate: false
},

{
id: "degree",

name: "Diplôme",

category: "Académique",

description: "Diplôme ou attestation de réussite.",

requiredFor: [
"Licence",
"Master",
"Doctorat"
],

aiSupported: false,

downloadableTemplate: false
}

];
