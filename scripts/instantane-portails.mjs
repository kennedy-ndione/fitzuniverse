/**
* ============================================================
* scripts/instantane-portails.mjs — séparer le public du payant
* ============================================================
*
* LE DÉFAUT (lot S3, 2026-09-08). Depuis la bascule « zéro lecture
* Firestore », le catalogue est servi en fichier STATIQUE par Hosting :
* assets/data/catalogue.json, public par construction. Il portait
* `applicationPortalUrl` en clair pour 147 universités sur 155. Le
* verrou de details.js (isPaidUser) masquait donc un BOUTON, pas une
* DONNÉE : n'importe qui ouvrait l'URL du JSON et lisait tous les
* portails, sans compte et sans payer. « Portail réservé aux clients »
* était une phrase, pas un fait.
*
* CE MODULE EST PUR. Il ne lit ni Firestore, ni le disque : il reçoit
* un instantané (la forme de assets/data/catalogue.json) et rend DEUX
* objets — le public, amputé des seuls champs de portail, et la carte
* des portails. Deux appelants s'en servent : `scripts/lot.mjs export`
* (à la fin de chaque lot) et `scripts/separer-portails.mjs` (pour
* re-scinder un instantané déjà écrit, sans toucher à Firestore).
*
* CE QU'IL NE FAIT PAS. Il ne touche à rien d'autre. Un document du
* fichier public sort avec exactement ses champs d'entrée, moins un —
* même ordre, même valeurs. C'est ce qui permet à js/catalog-snapshot.js
* de le lire sans une ligne de changement, et à un diff git de rester
* lisible.
*
* LA PORTE QUI RESTE OUVERTE, dite ici pour qu'on ne la découvre pas
* par surprise : Firestore répond toujours `allow read: if true` sur
* `universities` (firestore.rules). Quelqu'un qui interroge la base
* directement, avec la clé publique du site, lit encore les portails.
* Fermer cette porte demande de DÉPLACER le champ dans une collection
* à part (lecture interdite, écriture admin) — une migration de
* données, donc un lot à elle seule. Ce lot-ci ferme la porte grande
* ouverte, pas la fenêtre entrebâillée.
* ============================================================
*/

/**
* Les trois champs de portail, par collection. Ce sont les SEULS
* champs que le fichier public perd.
*
* `scholarships.applicationPortalUrl` est NEUF (lot S3). Il n'existe
* encore sur aucun document : c'est voulu. `officialWebsite` faisait
* jusqu'ici le travail de deux champs — tantôt la page d'information du
* bailleur (jica.go.jp/…/internship.html), tantôt le vrai portail de
* dépôt (aims.edu.gh/application/masters-…) — et personne ne pouvait
* dire lequel sans ouvrir le lien. Le champ neuf porte le SENS
* « l'endroit où l'on dépose », aligné sur le vocabulaire université ;
* `officialWebsite` reprend son sens littéral, la page du bailleur, qui
* est une source et non un privilège. Le remplissage des 156 bourses
* est un lot de DONNÉES (voir scripts/data/triage-portails-bourses.mjs).
*/
export const CHAMPS_PORTAIL = {
universities: "applicationPortalUrl",
programs: "applicationUrl",
scholarships: "applicationPortalUrl"
};

/** Le nom de la carte, dans le fichier privé, pour chaque collection. */
const CARTE = {
universities: "universites",
programs: "programmes",
scholarships: "bourses"
};

function sansChamp(document, champ) {
if (!document || !(champ in document)) return document;
const copie = { ...document };
delete copie[champ];
return copie;
}

/**
* Sépare un instantané en deux.
*
* @param {{genereLe?:string, programs?:Array, universities?:Array, scholarships?:Array}} instantane
* @returns {{public: Object, portails: Object, comptes: Object}}
*   public   — la même forme, sans les champs de portail ;
*   portails — { genereLe, universites:{id:url}, programmes:{id:url}, bourses:{id:url} } ;
*   comptes  — combien d'URL par carte, pour que l'appelant le dise à voix haute.
*/
export function separerPortails(instantane) {

const source = instantane && typeof instantane === "object" ? instantane : {};
const publique = { genereLe: source.genereLe };
const portails = { genereLe: source.genereLe, universites: {}, programmes: {}, bourses: {} };
const comptes = {};

for (const collection of ["programs", "universities", "scholarships"]) {

const champ = CHAMPS_PORTAIL[collection];
const carte = CARTE[collection];
const documents = Array.isArray(source[collection]) ? source[collection] : [];

publique[collection] = documents.map((d) => {
const url = d && typeof d[champ] === "string" ? d[champ].trim() : "";
// Une URL vide n'entre pas dans la carte : un champ vide est une
// RÉPONSE (les universités marocaines publiques n'ont aucun portail
// ouvert aux étrangers), pas un trou à transporter.
if (url && d.id) portails[carte][d.id] = url;
return sansChamp(d, champ);
});

comptes[carte] = Object.keys(portails[carte]).length;

}

return { public: publique, portails, comptes };

}

/**
* Les champs de portail encore présents dans un objet quelconque —
* le contrôle que le fichier public n'en porte plus aucun. Rend la
* liste des chemins fautifs (vide = propre).
*/
export function fuitesDePortail(instantane) {

const fuites = [];
const source = instantane && typeof instantane === "object" ? instantane : {};

for (const collection of ["programs", "universities", "scholarships"]) {
const champ = CHAMPS_PORTAIL[collection];
for (const d of Array.isArray(source[collection]) ? source[collection] : []) {
if (d && champ in d) fuites.push(`${collection}/${d.id} : ${champ}`);
}
}

return fuites;

}
