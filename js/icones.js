/**
* ==========================================================
* FitzUniverse — les icônes ne restent jamais vides (lot PEIGNE-FIN,
* 2026-09-10)
* ==========================================================
* Photo de Charles : un bouton rond VIDE dans la liste des conversations
* de ai-chat.html. Deux causes connues, ici traitées à la racine :
*
*  1. Lucide (unpkg, `defer`) arrive APRÈS le rendu d'un module : le
*     `if (window.lucide) lucide.createIcons()` du module ne tourne pas,
*     et rien ne repasse. → Dès que lucide est là, on convertit tout le
*     document, une fois.
*  2. Un rendu dynamique (liste, message, carte) injecte des
*     <i data-lucide> et oublie l'appel. → Un MutationObserver convertit
*     ce qui arrive, avec un léger regroupement.
*
* Script classique, exécuté juste après lucide sur chaque page : aucun
* module à modifier, et une page qui n'en a pas besoin ne paie qu'un
* observateur inactif. Depuis le lot PERF 3G (2026-09-28), il n'est plus
* chargé à part : scripts/icones.mjs le recopie à la fin de
* js/lucide-icones.js (une requête de moins par page). Le modifier ICI,
* puis relancer node scripts/icones.mjs.
* Ne fait rien si lucide ne charge jamais (réseau filtrant) : les pages
* gardent leurs <i> vides, comme avant — le harnais hors ligne double
* lucide par une coquille et n'attend rien.
* ==========================================================
*/

(() => {

"use strict";

function pret() {
return !!(window.lucide && typeof window.lucide.createIcons === "function");
}

function convertir(racine) {
if (!pret()) return;
try { window.lucide.createIcons(racine ? { root: racine } : undefined); }
catch (e) { try { window.lucide.createIcons(); } catch (_) { /* rien */ } }
}

let prevu = 0;

function observer() {
if (!("MutationObserver" in window) || !document.body) return;
const obs = new MutationObserver((mutations) => {
if (prevu) return;
let utile = false;
for (const m of mutations) {
for (const n of m.addedNodes) {
if (n.nodeType !== 1) continue;
if ((n.matches && n.matches("i[data-lucide]")) || (n.querySelector && n.querySelector("i[data-lucide]"))) { utile = true; break; }
}
if (utile) break;
}
if (!utile) return;
prevu = setTimeout(() => { prevu = 0; convertir(); }, 40);
});
obs.observe(document.body, { childList: true, subtree: true });
}

function demarrer() {
// Lucide est `defer` lui aussi, chargé juste avant : il peut être là,
// ou arriver quelques instants plus tard (réseau lent). On attend
// jusqu'à 20 s, puis on cesse d'insister.
let essais = 0;
const t = setInterval(() => {
essais += 1;
if (pret()) { clearInterval(t); convertir(); observer(); }
else if (essais > 200) clearInterval(t);
}, 100);
if (pret()) { clearInterval(t); convertir(); observer(); }
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", demarrer);
else demarrer();

})();
