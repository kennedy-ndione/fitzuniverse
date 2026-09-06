/**
* ============================================================
* FitzUniverse — accès rapide au Control Center (2026-09-02)
* ============================================================
*
* Injecte une pastille discrète « Control Center » sur la page,
* UNIQUEMENT si le compte connecté est un administrateur actif
* (document admins/{uid}, isActive:true). Pour tout autre visiteur
* ou étudiant, ce module ne rend RIEN — pas de bouton caché dans le
* HTML, pas de classe à masquer : l'élément n'existe tout simplement
* pas dans leur page.
*
* SÉCURITÉ — à ne jamais oublier : ce bouton est un CONFORT, pas la
* protection. La vraie barrière reste la même avec ou sans lui :
* Firebase Auth + le document admins/{uid} + firestore.rules
* (admin-auth.js renvoie quiconque tape l'URL /admin/ sans y avoir
* droit). Les règles n'autorisent chacun à lire QUE son propre
* document admins/{uid} (allow read: if isOwner(uid)) : pour un
* étudiant, la lecture ci-dessous renvoie simplement « n'existe
* pas », sans erreur ni fuite d'information.
*
* Usage : <script type="module" src="js/admin-access.js"></script>
* (chemin relatif à la racine ; le lien vers l'admin est calculé
* pour une page à la racine du site).
* ============================================================
*/

import { auth, db } from "../firebase-config.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

function injectAdminShortcut() {

if (document.getElementById("fitzAdminShortcut")) return;

const style = document.createElement("style");
style.textContent = `
.fitz-admin-shortcut{
position:fixed;
left:18px;
bottom:18px;
z-index:900;
display:inline-flex;
align-items:center;
gap:8px;
padding:10px 16px;
min-height:44px;
border-radius:999px;
background:linear-gradient(140deg,#342D24 0%,#211D18 60%,#191512 100%);
border:1px solid rgba(233,163,25,.35);
box-shadow:0 10px 26px rgba(26,23,20,.28);
color:#F5F0E7;
font-family:"Inter",sans-serif;
font-weight:700;
font-size:.82rem;
text-decoration:none;
transition:transform .2s ease, box-shadow .2s ease, border-color .2s ease;
}
.fitz-admin-shortcut svg{
width:15px;
height:15px;
flex-shrink:0;
color:#E9A319;
}
.fitz-admin-shortcut:hover{
transform:translateY(-2px);
border-color:#E9A319;
box-shadow:0 14px 30px rgba(233,163,25,.25);
}
@media(max-width:576px){
.fitz-admin-shortcut span{ display:none; }
.fitz-admin-shortcut{ padding:0; width:44px; justify-content:center; }
}
`;

const link = document.createElement("a");
link.id = "fitzAdminShortcut";
link.className = "fitz-admin-shortcut";
link.href = "admin/dashboard.html";
link.setAttribute("aria-label", "Ouvrir le Control Center");

// Icône bouclier en SVG intégré (métrique Lucide : viewBox 24,
// stroke 2, bouts arrondis) — aucune dépendance au chargement de la
// bibliothèque d'icônes de la page hôte.
link.innerHTML = `
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>
<span>Control Center</span>
`;

document.head.appendChild(style);
document.body.appendChild(link);

}

onAuthStateChanged(auth, async (user) => {

if (!user) return;

try {

const adminSnap = await getDoc(doc(db, "admins", user.uid));

if (adminSnap.exists() && adminSnap.data().isActive === true) {
injectAdminShortcut();
}

} catch (error) {

// Jamais bloquant, jamais bavard : un échec de lecture laisse
// simplement la page telle quelle.
console.warn("Vérification d'accès admin ignorée :", error);

}

});
