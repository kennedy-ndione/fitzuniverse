/**
* ============================================================
* Control Center — les administrateurs (lot ADMIN, 2026-09-09)
* ============================================================
*
* `admins/{uid}` était en `allow write: if false` : nommer quelqu'un
* exigeait d'ouvrir la console Firebase. Le propriétaire délègue
* désormais d'ici.
*
* CE QUE CETTE PAGE NE FAIT PAS, et ne fera jamais : créer un compte.
* Le collègue s'inscrit normalement sur le site, puis on le PROMEUT
* depuis sa fiche étudiant. Aucun mot de passe ne transite par le
* Control Center, et aucune page n'en demande.
*
* Le PROPRIÉTAIRE apparaît ici comme tel : son document n'a pas de champ
* `role`, et c'est ce qui le distingue (voir estSuperAdminDoc, miroir de
* firestore.rules). On ne le révoque pas depuis l'interface — les règles
* le refusent, et le bouton n'existe pas.
*
* Aucune action ne finit en silence : chaque clic dit ce qui s'est
* passé, et la liste est RELUE ensuite, pour qu'on voie l'état réel et
* qu'on ne le suppose pas.
* ============================================================
*/

import { initSidebarToggle } from "./sidebar-toggle.js";
import { hidePageLoader } from "../js/app-shell.js";
import { chargerAdmin, estSuperAdminDoc } from "./admin-role.js";
import { listerAdmins, changerActivationAdmin } from "./firebase-admin.js";
import { succes, echec, notifier } from "./notifier.js";

initSidebarToggle();

const corps = document.getElementById("adminsTable");

let moi = null;

function dateLisible(iso) {
if (!iso) return "—";
const d = new Date(iso);
return isNaN(d) ? iso : d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function echapper(texte) {
return String(texte == null ? "" : texte).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function ligne(a) {

const proprietaire = estSuperAdminDoc(a) || a.role === "superAdmin";
const actif = a.isActive === true;
const cestMoi = moi && a.uid === moi.uid;

// Trois raisons de n'offrir aucun bouton, et chacune est dite dans la
// cellule plutôt que par un bouton grisé :
//   le propriétaire ne se révoque pas depuis l'interface (les règles
//   le refusent) ; personne ne se révoque soi-même ; le reste se
//   révoque et se réactive.
let action = "";

if (proprietaire) action = `<span class="detail-field-value" style="font-weight:400;">Compte propriétaire — non modifiable ici.</span>`;
else if (cestMoi) action = `<span class="detail-field-value" style="font-weight:400;">C'est vous.</span>`;
else if (actif) action = `<button type="button" class="btn-detail-action is-danger" data-revoquer="${echapper(a.uid)}">Révoquer</button>`;
else action = `<button type="button" class="btn-detail-action" data-reactiver="${echapper(a.uid)}">Réactiver</button>`;

return `<tr>
<td>${echapper(a.nom || "—")}</td>
<td>${echapper(a.email || "—")}</td>
<td><span class="admins-role ${proprietaire ? "is-proprietaire" : "is-admin"}">${proprietaire ? "Propriétaire" : "Administrateur"}</span></td>
<td class="admins-etat ${actif ? "" : "is-revoque"}">${actif ? "Actif" : "Révoqué"}</td>
<td>${dateLisible(a.nommeLe)}</td>
<td>${echapper(a.nommePar || "—")}</td>
<td>${action}</td>
</tr>`;

}

async function charger() {

try {

const admins = await listerAdmins();

// Le propriétaire d'abord, puis les actifs, puis les révoqués : la
// liste raconte l'état, pas l'ordre d'insertion de Firestore.
admins.sort((a, b) => {
const rang = (x) => (estSuperAdminDoc(x) ? 0 : x.isActive === true ? 1 : 2);
return rang(a) - rang(b) || String(a.nom || a.email || "").localeCompare(String(b.nom || b.email || ""), "fr");
});

corps.innerHTML = admins.length
? admins.map(ligne).join("")
: `<tr><td colspan="7"><div class="admin-table-empty">Aucun administrateur enregistré.</div></td></tr>`;

} catch (error) {

console.error(error);
corps.innerHTML = `<tr><td colspan="7"><div class="admin-table-empty">Liste non lisible avec ce compte.</div></td></tr>`;
echec("La liste des administrateurs n'a pas pu être chargée", error);

}

}

corps.addEventListener("click", async (e) => {

const revoquer = e.target.closest("[data-revoquer]");
const reactiver = e.target.closest("[data-reactiver]");
const bouton = revoquer || reactiver;
if (!bouton) return;

const cible = revoquer ? revoquer.dataset.revoquer : reactiver.dataset.reactiver;

if (moi && cible === moi.uid) {
echec("Vous ne pouvez pas vous révoquer vous-même.");
return;
}

const question = revoquer
? "Révoquer cet administrateur ?\n\nIl perdra l'accès au Control Center à sa prochaine visite. Son document est conservé : la révocation se défait, l'historique reste."
: "Réactiver cet administrateur ?\n\nIl retrouvera l'accès au Control Center.";

if (!window.confirm(question)) return;

bouton.disabled = true;
notifier(revoquer ? "Révocation en cours…" : "Réactivation en cours…");

try {

await changerActivationAdmin(cible, !revoquer);
// On RELIT la liste : c'est l'état enregistré qu'on affiche, jamais
// celui qu'on espérait.
await charger();
succes(revoquer ? "Administrateur révoqué. Son historique est conservé." : "Administrateur réactivé.");

} catch (error) {

console.error(error);
bouton.disabled = false;
echec(revoquer ? "La révocation a échoué" : "La réactivation a échoué", error);

}

});

(async () => {

moi = await chargerAdmin();

// La page entière est réservée au propriétaire. admin-auth.js retire
// déjà son lien de la barre latérale ; ici on ferme la porte, parce
// qu'une URL se tape à la main.
if (!moi || !moi.superAdmin) {
document.querySelector(".content").style.display = "";
document.querySelector(".content").innerHTML = `
<div style="padding:40px;text-align:center;">
<h2>Réservé au propriétaire</h2>
<p>La gestion des administrateurs n'est pas accessible avec ce compte.</p>
<a href="dashboard.html">Retour au tableau de bord</a>
</div>`;
hidePageLoader();
return;
}

await charger();

document.querySelector(".content").style.display = "";
hidePageLoader();

if (window.lucide) lucide.createIcons();

})();
