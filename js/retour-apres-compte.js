/**
* ============================================================
* js/retour-apres-compte.js — revenir à sa formule après le compte
* ============================================================
*
* LOT COMPTE-D'ABORD (2026-09-21, décision de Charles). La page de
* paiement ne crée plus de compte : c'était le seul endroit du site où
* l'on tapait un mot de passe à côté d'un prix, avec une copie de la
* validation de l'inscription. Depuis que le compte est GRATUIT
* (2026-09-20), il se crée à un seul endroit — inscription.html — et
* l'on paie depuis un compte déjà ouvert.
*
* Ce module porte le seul fil entre les deux : un visiteur qui choisit
* une formule part créer son compte (ou se connecter) avec
* `?retour=payment.html?plan=…`, et y revient ensuite.
*
* LA DESTINATION EST FERMÉE. `retour` vient de l'URL : n'importe qui
* peut en fabriquer un. On n'accepte QUE la page de paiement avec un
* identifiant de formule — jamais une autre page, jamais une URL
* absolue, jamais un chemin « //hote ». Tout le reste est ignoré, et la
* page suit son chemin habituel.
*
* LA DESTINATION D'UN DOSSIER (2026-09-23). Un Dossier Italie s'achète
* sur `payment.html?plan=dossier-france&destination=italie` : le pays
* fait partie de l'achat, il doit survivre à la création du compte. Il
* est accepté, mais pris dans la liste FERMÉE des destinations vendues
* (miroir de DESTINATIONS_VENDUES, js/destinations-preinscription.js —
* test/destinations-preinscription.test.mjs compare les deux) ; aucun
* autre paramètre.
*
* LE DIAGNOSTIC GRATUIT (2026-09-26, constat de Charles : « le diagnostic
* gratuit côté préinscription mène à une création de compte ou une
* connexion et après on ne le voit même pas »). Les pages
* diagnostic-pays.html et diagnostic-france.html demandent un compte ;
* sans session, le visiteur partait vers login.html SANS retour, et
* arrivait après coup sur son accueil, où rien ne parlait de ce
* diagnostic. Deux retours de plus sont donc acceptés, toujours dans une
* liste fermée : `diagnostic-pays.html?d=<destination vendue>` et
* `diagnostic-france.html`, rien d'autre.
* ============================================================
*/

export const DESTINATIONS_RETOUR = ["france", "roumanie", "turquie", "maroc", "italie", "allemagne", "canada", "chine", "malaisie"];

const RETOUR_VALIDE = new RegExp(`^payment\\.html\\?plan=[A-Za-z0-9_-]{1,40}(?:&destination=(?:${DESTINATIONS_RETOUR.join("|")}))?$`);

const RETOUR_DIAGNOSTIC = new RegExp(`^(?:diagnostic-pays\\.html\\?d=(?:${DESTINATIONS_RETOUR.join("|")})|diagnostic-france\\.html)$`);

/** Le nom de chaque destination, pour dire au visiteur ce qui l'attend. */
export const NOMS_DESTINATIONS = {
france: "France",
roumanie: "Roumanie",
turquie: "Turquie",
maroc: "Maroc",
italie: "Italie",
allemagne: "Allemagne",
canada: "Canada",
chine: "Chine",
malaisie: "Malaisie"
};

/** La destination de retour, si elle est sûre ; sinon "". */
export function retourSur(search) {
let valeur = "";
try {
valeur = new URLSearchParams(search || "").get("retour") || "";
} catch {
return "";
}
return RETOUR_VALIDE.test(valeur) || RETOUR_DIAGNOSTIC.test(valeur) ? valeur : "";
}

/**
* La page où revenir quand une page de l'espace est ouverte SANS session :
* seulement les deux pages de diagnostic, et seulement sous leur forme
* permise. "" pour toute autre page (elle garde son renvoi habituel).
*/
export function retourDepuisPage(pathname, search) {
const page = String(pathname || "").split("/").pop().toLowerCase();
if (page === "diagnostic-france.html") return "diagnostic-france.html";
if (page !== "diagnostic-pays.html") return "";
let d = "";
try {
d = String(new URLSearchParams(search || "").get("d") || "").toLowerCase();
} catch {
return "";
}
const retour = `diagnostic-pays.html?d=${d}`;
return RETOUR_DIAGNOSTIC.test(retour) ? retour : "";
}

/**
* Ce que la page de compte dit au visiteur qui vient d'un diagnostic, ou
* "" s'il vient d'ailleurs (le texte habituel reste).
* @param {string} retour - la sortie de retourSur()
* @param {"inscription"|"connexion"} page
*/
export function phraseDeRetour(retour, page) {
if (!RETOUR_DIAGNOSTIC.test(String(retour || ""))) return "";
const id = retour === "diagnostic-france.html" ? "france" : retour.split("=")[1];
const nom = NOMS_DESTINATIONS[id] || "";
const quoi = nom ? `Votre diagnostic ${nom}` : "Votre diagnostic";
return page === "connexion"
? `${quoi} s'ouvre dès la connexion. Il reste ensuite dans votre espace.`
: `${quoi} est gratuit. Créez votre compte : le diagnostic s'ouvre aussitôt, et il reste ensuite dans votre espace.`;
}

/**
* Où envoyer un visiteur sans session qui ouvrait `retour` : la connexion
* s'il est déjà venu (login.js retient son prénom), l'inscription sinon.
* Les deux pages portent le retour, et chacune mène à l'autre avec lui.
*/
export function pageDeCompte(retour, visiteurConnu) {
return avecRetour(visiteurConnu ? "login.html" : "inscription.html", retour);
}

/** Le lien vers `page` qui emporte le retour, ou `page` seule. */
export function avecRetour(page, retour) {
return retour ? `${page}?retour=${encodeURIComponent(retour)}` : page;
}
