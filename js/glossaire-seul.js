/**
* FitzUniverse — le glossaire sans le pied de page (lot PIED-DE-PAGE,
* 2026-09-10). Les pages qui n'ont qu'une tâche (questionnaire,
* diagnostic, résultats, connexion) ne reçoivent pas le pied de page
* partagé, mais gardent l'explication des termes techniques à leur
* première apparition — même module, même table (js/glossaire.js).
* Script classique : un échec de chargement laisse la page intacte.
*/
(() => {
"use strict";
function lancer() {
import("./glossaire.js")
.then((g) => g.surveillerTermes(document.querySelector("main") || document.body))
.catch((e) => console.warn("Glossaire indisponible :", e));
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", lancer);
else lancer();
})();
