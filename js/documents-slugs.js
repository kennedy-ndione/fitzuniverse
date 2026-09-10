/**
* FitzUniverse — les clés des documents (lot PEIGNE-FIN, 2026-09-10)
*
* Sorties de js/documents-data.js (114 Ko) : le parcours d'une candidature
* (application-journey.js) et le recours Fitz (fitz-recours.js) n'avaient
* besoin que de ces quelques lignes, et tiraient la fiche complète des 46
* documents sur CHAQUE page de l'espace — mesuré sur 3G rapide : le fichier
* le plus lent de applications.html (3,2 s). documents-data.js les
* réexporte : rien ne change pour documents.html.
*/

// Ne jamais modifier ce corps : les clés déjà écrites en base en
// dépendent.
export function slugDocument(title) {
return title
.toLowerCase()
.normalize("NFD").replace(/[̀-ͯ]/g, "")
.replace(/[^a-z0-9]+/g, "-")
.replace(/^-+|-+$/g, "");
}

// Les slugs que le code lit ailleurs que sur documents.html (étapes du
// parcours préinscription). Dérivés des TITRES, jamais recopiés à la
// main — test/documents-data.test.mjs vérifie que chaque titre existe
// toujours : renommer une fiche casse le test, pas l'étudiant.
export const SLUGS = {
traductions: slugDocument("Traductions certifiées"),
copies: slugDocument("Copies certifiées conformes"),
legalisation: slugDocument("Légalisation / apostille"),
ressources: slugDocument("Justificatifs de ressources"),
bancaire: slugDocument("Attestation bancaire")
};
