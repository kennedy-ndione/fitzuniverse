/**
 * ============================================================
 * Control Center — le bouton Déconnexion, à UN SEUL endroit
 * ============================================================
 *
 * Lot ADMIN-PAIEMENTS (2026-09-20). Chaque page admin recopiait le même
 * bloc logoutBtn (~20 lignes) depuis la refonte du 2026-09-02 — une
 * garde qu'il faut recopier est une garde qu'on oubliera (la leçon
 * d'admin-auth.js). Les NOUVELLES pages passent par ici ; les pages
 * existantes gardent leur bloc historique, qui fait la même chose —
 * les migrer une à une n'apporterait que du churn.
 * ============================================================
 */

import { auth } from "../firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

export function initLogout() {

const bouton = document.getElementById("logoutBtn");
if (!bouton) return;

bouton.addEventListener("click", async () => {

if (bouton.dataset.busy === "true") return;
bouton.dataset.busy = "true";

try {
await signOut(auth);
window.location.href = "login.html";
} catch (erreur) {
console.error(erreur);
// Pas de alert() : le bandeau notifier existe, mais une déconnexion
// qui échoue se retente — on rend simplement le bouton.
bouton.dataset.busy = "false";
}

});

}
