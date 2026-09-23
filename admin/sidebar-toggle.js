/**
* ============================================================
* Fitz Admin — bascule de la sidebar mobile
* ============================================================
*
* Partagé par toutes les pages du Control Center (dashboard, étudiants,
* bourses, universités, formules...) : sous 1024px la sidebar est
* glissée hors écran (voir control-center.css), ce bouton + ce fond
* assombri sont l'unique moyen de la révéler. Sans ce module, la
* sidebar reste invisible et inatteignable sur petit écran.
* ============================================================
*/

// L'ÉQUIPE NE COMPTE PAS DANS LES VISITEURS (lot ADMIN-SAIT-TOUT,
// 2026-09-23) : tout navigateur qui ouvre une page de l'admin est
// marqué, et js/analytics.js ne le compte plus jamais comme visiteur
// du site. Chaque page de l'admin importe ce module.
try {
localStorage.setItem("fitzEquipe", "1");
} catch (e) {
// localStorage indisponible : rien à marquer.
}

export function initSidebarToggle() {

const openBtn = document.getElementById("sidebarOpenBtn");
const backdrop = document.getElementById("sidebarBackdrop");

function closeSidebar() {
document.body.classList.remove("sidebar-open");
}

if (openBtn) {
openBtn.addEventListener("click", () => {
document.body.classList.add("sidebar-open");
});
}

if (backdrop) {
backdrop.addEventListener("click", closeSidebar);
}

document.addEventListener("keydown", (event) => {
if (event.key === "Escape") closeSidebar();
});

document.querySelectorAll(".sidebar .nav-link, .sidebar-logout").forEach((el) => {
el.addEventListener("click", closeSidebar);
});

}
