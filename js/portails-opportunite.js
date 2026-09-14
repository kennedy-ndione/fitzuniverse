/**
* ============================================================
* FitzUniverse — LES PORTAILS D'UNE OPPORTUNITÉ
* ============================================================
*
* CE QUE CE FICHIER RÉPARE (lot PORTAILS, 2026-09-14)
* ---------------------------------------------------
* Charles, le 2026-09-14 : « on lui proposera juste ces 4 ou 6
* opportunités compatibles à son profil AVEC TOUS LES PORTAILS
* NÉCESSAIRES (portail de l'université, de candidature pour
* l'université et de candidature pour la bourse) et uniquement dans
* l'espace étudiant [...] l'espace public ne montre aux visiteurs que le
* site des universités uniquement ».
*
* Cette architecture existait DÉJÀ : les portails ont quitté le
* catalogue public au lot S3 et sont servis par la Cloud Function
* `portails`, qui vérifie l'abonnement (js/portails.js). Ce qui manquait,
* c'est que le HUB n'en affichait AUCUN. Les 147 portails d'université
* déjà renseignés étaient invisibles pour l'étudiant qui les avait payés :
* sa carte d'opportunité ne portait qu'un titre, un nom et un bouton.
*
* POURQUOI UN MODULE, ET PAS TROIS LIGNES DANS dashboard.js
* ---------------------------------------------------------
* details.js (la fiche bourse) décide déjà de ces liens, et sa décision
* est chargée de doctrine : l'ordre dépend de `entryPoint`, la phrase
* d'orientation change selon ce qui est RÉELLEMENT à l'écran, et un
* non-abonné ne voit qu'un seul lien — sans cadenas. Recopier ce
* raisonnement en ligne dans le hub en aurait fait deux versions, qui
* auraient divergé au premier correctif. Il vit donc ici, pur et testé.
*
* ⚠️ CE MODULE N'EST PAS ENCORE LA SOURCE UNIQUE, ET IL FAUT LE DIRE.
* details.js garde son propre `ordonnerPortails`, qui déplace des nœuds
* du DOM de scholarship-details.html. Les PHRASES sont partagées (un
* test d'anti-divergence les vérifie mot pour mot), l'ORDRE ne l'est pas
* encore :
*   fiche bourse  entryPoint=bourse : bourse, site, admission
*   hub           entryPoint=bourse : bourse, admission, site
* Le site de l'université passe avant l'admission sur la fiche, en
* dernier dans le hub. Un test PIN cette différence pour qu'elle reste
* un choix constaté et non une surprise ; l'unifier demande de toucher
* l'ordre du DOM de la fiche, et c'est un lot à soi.
*
* LA RÈGLE DES TROIS PORTES
* -------------------------
*   site        le site de l'établissement. PUBLIC : c'est le seul lien
*               qu'un visiteur voit, et c'est la doctrine du 2026-08-31.
*   admission   le portail où l'on dépose son dossier d'ADMISSION
*               (celui du programme s'il en a un, sinon celui de
*               l'université). RÉSERVÉ aux abonnés.
*   bourse      le portail où l'on dépose son dossier de BOURSE, quand
*               il ne se dépose pas auprès de l'université. RÉSERVÉ.
*
* `entryPoint` dit laquelle vient EN PREMIER dans le parcours réel :
*   "bourse"     -> chez le bailleur (État, ambassade, fondation) ;
*                   l'université vient après.
*   "universite" -> auprès de l'établissement ; la bourse est souvent
*                   une case du dossier d'admission.
*   absent       -> INCONNU. Jamais une valeur par défaut : on n'ordonne
*                   rien et on n'oriente pas (même règle des trois
*                   valeurs que estEligible).
*
* ON N'AFFICHE JAMAIS UNE PORTE FERMÉE. Ni cadenas, ni « réservé aux
* abonnés », ni lien mort : un lien absent est absent. C'est la doctrine
* du verrou abonné (doctrine_verrou_abonne_2026-08-31) et celle du lot S4
* (« on ne montre pas une porte fermée, on fait qu'il n'y ait pas de
* porte »).
*
* Aucun DOM, aucun Firestore, aucun réseau : testable sous Node.
* ============================================================
*/

/**
* LES PHRASES D'ORIENTATION — MOT POUR MOT CELLES DE details.js.
*
* Un test lit `phraseOrientationPortails` dans details.js et vérifie que
* ces trois littéraux y sont encore. Si quelqu'un réécrit la phrase d'un
* côté, le test tombe : c'est le seul moyen d'éviter que la fiche bourse
* et le hub ne disent deux choses différentes du même dossier.
*/
export const ORIENTATION = {
bourse_avec_portail: "Le dossier se dépose auprès du bailleur, pas auprès de l'université.",
bourse_sans_portail: "Le dossier de cette bourse se dépose auprès du bailleur. Le lien ci-dessous mène à l'établissement d'accueil.",
universite: "Le dossier se dépose auprès de l'université ; la bourse s'attribue dans le cadre de l'admission."
};

/** Une URL exploitable : http(s) seulement. Ce champ finit dans un href. */
export function lienValide(url) {
return typeof url === "string" && /^https?:\/\/[^\s]+$/i.test(url.trim());
}

const nettoyer = (url) => (lienValide(url) ? url.trim() : "");

/**
* Les liens d'une opportunité, dans l'ordre où l'étudiant doit les
* emprunter.
*
* @param {Object} ctx
* @param {string}  ctx.site              universities.officialWebsite (public)
* @param {string}  ctx.portailAdmission  portailUniversite({universityId, programId})
* @param {string}  ctx.portailBourse     portailBourse(scholarshipId), ou le
*                                        site officiel de la bourse en repli
*                                        — même repli que details.js.
* @param {string}  ctx.entryPoint        "bourse" | "universite" | ""
* @param {string}  ctx.funderName        le bailleur, pour l'infobulle
* @param {boolean} ctx.abonne            l'accès aux portails est-il ouvert
* @returns {{liens:Array, orientation:string, manquants:Array<string>}}
*/
export function liensDOpportunite(ctx) {

// `= {}` ne couvre que `undefined` : un `null` explicite jetait un
// TypeError, et une exception ici ne tue pas la phase 02 — elle tue
// tout ce que dashboard.js rend APRÈS (dossiers, dépôt, réponse,
// verrous de formule, guide visa).
const {
site = "",
portailAdmission = "",
portailBourse = "",
entryPoint = "",
funderName = "",
abonne = false,
bourseConfirmee = false
} = (ctx && typeof ctx === "object") ? ctx : {};

// LE DROIT D'ACCÈS SE COMPARE À `true`, IL NE SE DEVINE PAS.
// `abonne ? … : ""` ouvrait la donnée payante sur n'importe quelle
// valeur vraie : un futur appelant qui passerait `abonne: session` ou
// `abonne: planId` aurait servi les portails réservés sans qu'aucun
// test ne tombe. Aujourd'hui la seule source est portailsDisponibles(),
// qui rend un vrai booléen — c'est la prochaine ligne qui le garantit.
const ouvert = abonne === true;

// `entryPoint` vient d'un <select> de l'espace d'administration, donc
// propre aujourd'hui. Un « Bourse » ou un « bourse » à espaces suffirait
// pourtant à faire disparaître l'orientation en silence.
const ep = String(entryPoint || "").trim().toLowerCase();

const urlSite = nettoyer(site);
const urlAdmission = ouvert ? nettoyer(portailAdmission) : "";
const urlBourse = ouvert ? nettoyer(portailBourse) : "";

// Le repli (le site du bailleur au lieu de son portail de dépôt) ne
// s'annonce PAS comme un portail. Voir portailDeBourseOuRepli.
const bourseSure = urlBourse !== "" && bourseConfirmee === true;

const lienSite = urlSite ? {
cle: "site",
libelle: "Site de l'université",
titre: "Le site officiel de l'établissement",
url: urlSite,
icone: "landmark",
reserve: false
} : null;

const lienAdmission = urlAdmission ? {
cle: "admission",
libelle: "Portail de candidature",
titre: "Le portail où se dépose le dossier d'admission",
url: urlAdmission,
icone: "send",
reserve: true
} : null;

// ON N'APPELLE PAS « PORTAIL » CE QUI N'EN EST PEUT-ÊTRE PAS UN.
// Le champ confirmé du lot S3 est vide sur les 156 bourses : sans cette
// distinction, 100 % des cartes étiquetaient le site du bailleur « le
// portail où se dépose le dossier de bourse » — et le triage du dépôt
// (scripts/data/triage-portails-bourses.csv) classe 51 de ces liens
// comme de simples pages d'information. L'étudiant cliquait et
// n'arrivait pas là où l'on candidate.
const bailleurNomme = typeof funderName === "string" && funderName.trim() ? funderName.trim() : "";

const lienBourse = urlBourse ? {
cle: "bourse",
libelle: bourseSure ? "Portail de la bourse" : "Site du bailleur",
titre: bourseSure
? (bailleurNomme ? `Le portail où se dépose le dossier de bourse — ${bailleurNomme}` : "Le portail où se dépose le dossier de bourse")
: (bailleurNomme ? `Le site de ${bailleurNomme} — vérifiez-y les modalités de dépôt` : "Le site du bailleur — vérifiez-y les modalités de dépôt"),
url: urlBourse,
icone: bourseSure ? "award" : "info",
reserve: true,
confirme: bourseSure
} : null;

// LA PORTE DE DÉPÔT EST MARQUÉE, PAS DÉDUITE DE SA POSITION.
// Le CSS peignait `:first-child` comme « la porte où l'on dépose ».
// Deux cas le démentaient : une université sans portail d'admission
// (8 sur 155) mettait « Portail de la bourse » en premier sous une
// orientation qui dit de déposer à l'université ; et pour un NON-abonné
// le seul lien restant — le site de l'université — héritait du repère,
// alors que 71 bourses sur 156 se déposent chez le bailleur. Le module
// sait laquelle c'est : il le dit.
const porteDeDepot = ep === "bourse" ? lienBourse : (ep === "universite" ? lienAdmission : null);
if (porteDeDepot) porteDeDepot.depot = true;

// L'ORDRE SUIT LE PARCOURS RÉEL, PAS LA COMMODITÉ DU RENDU.
// « bourse » : on dépose chez le bailleur d'abord. Sinon : l'admission
// d'abord, et le portail du bailleur en dernier. Absent : l'ordre
// neutre, celui de l'admission — on ne devine pas.
const liens = (ep === "bourse"
? [lienBourse, lienAdmission, lienSite]
: [lienAdmission, lienBourse, lienSite]
).filter(Boolean);

// CE QU'ON DIT, ET CE QU'ON NE DIT PAS.
// Un non-abonné ne lit aucune orientation : elle parlerait de portes
// qu'il ne voit pas. Un entryPoint absent n'oriente pas non plus.
//
// Et surtout : ON N'ANNONCE JAMAIS UNE PORTE QU'ON NE MONTRE PAS.
// C'est la faute que details.js dit avoir corrigée le 2026-08-31 — « on
// annonçait une porte, et la seule visible était l'autre ». Elle valait
// pour la branche « bourse » ; elle vaut aussi pour « universite », dont
// le portail d'admission manque sur 8 établissements.
let orientation = "";

if (ouvert && ep === "bourse") {
// Un site de bailleur non confirmé n'est pas un portail de dépôt : la
// phrase qui dit « pas auprès de l'université » n'est vraie que quand
// on tient réellement la porte du bailleur.
orientation = bourseSure ? ORIENTATION.bourse_avec_portail : ORIENTATION.bourse_sans_portail;
} else if (ouvert && ep === "universite" && urlAdmission) {
orientation = ORIENTATION.universite;
}

// Ce qui manque VRAIMENT, pour le mesurer — jamais pour l'afficher.
// Un abonné ne doit pas lire « portail de bourse manquant » : ce n'est
// pas son problème, c'est le nôtre.
const manquants = [];
if (!urlSite) manquants.push("site");
if (ouvert && !urlAdmission) manquants.push("admission");
if (ouvert && ep === "bourse" && !bourseSure) manquants.push("bourse");

return { liens, orientation, manquants, porteDeDepot: porteDeDepot ? porteDeDepot.cle : "" };

}

/**
* LE REPLI DU PORTAIL DE BOURSE — la même règle que details.js.
*
* `portailBourse()` (champ neuf du lot S3) est vide sur les 156 bourses
* tant que le lot de données n'a pas eu lieu. En attendant, le site
* officiel du bailleur fait le travail des deux — et se trompe donc une
* fois sur deux : jica.go.jp/…/internship.html est une page
* d'information, aims.edu.gh/application/… un vrai portail.
*
* On sert donc le repli, parce qu'un lien vers la bonne organisation vaut
* mieux que rien, ET on le signale comme non confirmé pour que le lot de
* données sache quoi corriger. `triage-portails-bourses.csv` classe déjà
* les 156 : 51 « information », 16 « portail_probable », 89 « a_ouvrir ».
*/
export function portailDeBourseOuRepli(ctx) {
// `= {}` ne couvre que `undefined` : un `null` explicite jetait un
// TypeError, et ce jet-là remonte jusqu'au rendu du hub.
const { portailConfirme = "", siteDeLaBourse = "" } = (ctx && typeof ctx === "object") ? ctx : {};
const confirme = nettoyer(portailConfirme);
if (confirme) return { url: confirme, confirme: true };
const repli = nettoyer(siteDeLaBourse);
return { url: repli, confirme: false };
}
