/**
* ============================================================
* Fitz — champ téléphone international (interface)
* ============================================================
*
* Transforme un `<input type="tel">` déjà présent dans le HTML en
* couple « sélecteur de pays + numéro national », sans que la page
* ait à changer sa structure.
*
* L'input d'origine n'est pas remplacé : il est CONSERVÉ, masqué, et
* continue de porter la valeur — au format E.164 cette fois. Tout ce
* qui le lisait déjà (profile.js fait `val("phone")`) continue donc de
* fonctionner sans modification, et lit désormais un numéro
* utilisable plutôt qu'une chaîne saisie au hasard.
*
*     <input type="tel" id="phone">        ← reste la source de vérité
*         └── caché, valeur = "+221771234567"
*     <select> +221 Sénégal </select>      ← ajoutés à côté
*     <input inputmode="tel">  77 123 45 67
*
* Ce choix a une raison précise : la migration. Les profils déjà
* enregistrés contiennent des numéros écrits n'importe comment. À
* l'ouverture, depuisE164() essaie de les relire ; ce qu'il ne
* reconnaît pas reste affiché tel quel dans le champ national, avec
* le pays du profil présélectionné. L'étudiant voit son numéro, le
* corrige s'il le souhaite, et rien n'est perdu en silence.
* ============================================================
*/

import {
PAYS_TELEPHONE,
PAYS_PAR_DEFAUT,
paysParIso,
isoDepuisNom,
versE164,
depuisE164,
verifier
} from "./phone-international.js";

/** Champs montés, pour que synchroniserPays() les retrouve. */
const CHAMPS = new Map();

function construireSelecteur(champId) {

const select = document.createElement("select");

select.className = "tel-pays";
select.id = `${champId}Pays`;
select.setAttribute("aria-label", "Indicatif du pays");

for (const pays of PAYS_TELEPHONE) {

const option = document.createElement("option");

option.value = pays.iso;

// L'indicatif EN PREMIER, le nom ensuite. L'ordre inverse semblait
// plus naturel — on cherche son pays par son nom — mais il ignore
// que le sélecteur a deux états, qui ne servent pas à la même chose :
//
//   ouvert  : on CHOISIT. La liste déroulante native s'ajuste à son
//             contenu, rien n'y est tronqué, les 88 noms sont lisibles.
//   fermé   : on VÉRIFIE. La colonne fait 148px, soit 109px de texte —
//             mesuré : « Cameroun +237 » en réclame 112, « Côte
//             d'Ivoire +225 » 128. Quelque chose sera donc coupé.
//
// Ce qui doit survivre à la coupe, c'est l'indicatif : c'est lui que
// l'étudiant compare à ce qu'il sait de son propre numéro. Un nom de
// pays tronqué reste reconnaissable ; un indicatif absent ne se
// vérifie pas.
option.textContent = `+${pays.indicatif} ${pays.nom}`;

select.appendChild(option);

}

return select;

}

/**
* Monte le champ international sur un input existant.
*
* @param {string} champId - id de l'`<input type="tel">` du HTML
* @param {Object} [options]
* @param {string} [options.paysParDefaut] - code ISO de repli
* @returns {Object|null} l'API du champ, ou null si l'input est absent
*/
export function monterChampTelephone(champId, options = {}) {

const original = document.getElementById(champId);

if (!original || CHAMPS.has(champId)) {
return CHAMPS.get(champId) || null;
}

const enveloppe = original.parentElement;

// L'input d'origine devient le porteur silencieux de la valeur
// E.164. `hidden` seul ne suffirait pas : .input-wrap input pose un
// display explicite, qui l'emporte sur la règle d'agent utilisateur
// [hidden]{display:none} (piège déjà rencontré cinq fois sur ce
// projet — voir css/ai-suite.css).
original.hidden = true;
original.style.display = "none";
original.setAttribute("aria-hidden", "true");
original.tabIndex = -1;

const rangee = document.createElement("div");
rangee.className = "tel-rangee";

const select = construireSelecteur(champId);

const national = document.createElement("input");
national.type = "tel";
national.inputMode = "tel";
national.autocomplete = "tel-national";
national.className = "tel-national";
national.id = `${champId}National`;

const etiquette = document.querySelector(`label[for="${champId}"]`);
if (etiquette) etiquette.setAttribute("for", national.id);

const erreur = document.createElement("p");
erreur.className = "tel-erreur";
erreur.id = `${champId}Erreur`;
erreur.hidden = true;
erreur.setAttribute("role", "status");

rangee.append(select, national);
enveloppe.append(rangee, erreur);

function majPlaceholder() {

const pays = paysParIso(select.value);

national.placeholder = pays ? pays.exemple : "";

}

function afficherErreur(message) {

erreur.textContent = message;
erreur.hidden = !message;

national.classList.toggle("is-invalide", !!message);
national.setAttribute("aria-invalid", message ? "true" : "false");
national.setAttribute("aria-describedby", message ? erreur.id : "");

}

/** Écrit la valeur E.164 dans l'input d'origine. */
function synchroniser() {

original.value = versE164(select.value, national.value);

}

// La validation ne s'affiche PAS à chaque frappe : signaler « 7
// chiffres au lieu de 9 » à quelqu'un qui en a tapé sept et
// s'apprête à taper le huitième est une réprimande, pas une aide.
// On efface l'erreur pendant la saisie, on la pose à la sortie du
// champ.
national.addEventListener("input", () => {
afficherErreur("");
synchroniser();
});

national.addEventListener("blur", () => {
const { message } = verifier(select.value, national.value);
afficherErreur(message);
synchroniser();
});

select.addEventListener("change", () => {
majPlaceholder();
afficherErreur("");
synchroniser();
});

const api = {

/** Remplit le champ depuis une valeur enregistrée (E.164 ou non). */
definir(valeur, isoSuggere) {

const { iso, national: numero } = depuisE164(valeur);
const choisi = iso || isoSuggere || select.value || PAYS_PAR_DEFAUT;

if (paysParIso(choisi)) select.value = choisi;

national.value = numero;

majPlaceholder();
afficherErreur("");
synchroniser();

},

/** Présélectionne un pays tant que l'étudiant n'a rien saisi. */
suggererPays(iso) {

if (!iso || !paysParIso(iso)) return;
if (national.value.trim()) return;   // ne jamais déplacer un choix fait

select.value = iso;
majPlaceholder();
synchroniser();

},

/** @returns {boolean} true si le champ est valide (vide compris) */
valider() {

const { valide, message } = verifier(select.value, national.value);

afficherErreur(message);

return valide;

},

get valeur() { return original.value; },
get iso() { return select.value; },
elements: { original, select, national, erreur }

};

select.value = options.paysParDefaut && paysParIso(options.paysParDefaut)
? options.paysParDefaut
: PAYS_PAR_DEFAUT;

majPlaceholder();

CHAMPS.set(champId, api);

return api;

}

/**
* Aligne les champs téléphone sur le pays de résidence saisi dans le
* profil.
*
* C'est ce qui fait qu'un étudiant sénégalais n'a, en pratique, aucun
* sélecteur à toucher : il a déjà écrit « Sénégal » deux champs plus
* haut. La suggestion ne s'applique QUE si le champ est encore vide —
* corriger un pays que l'étudiant a délibérément choisi serait pire
* que de ne rien suggérer du tout (un étudiant sénégalais installé au
* Canada a un numéro canadien).
*
* @param {string} nomPaysLibre - contenu du champ « Pays »
* @param {string[]} [champs] - ids des champs à aligner
*/
export function synchroniserPays(nomPaysLibre, champs = ["phone", "whatsapp"]) {

const iso = isoDepuisNom(nomPaysLibre);

if (!iso) return;

for (const id of champs) {
CHAMPS.get(id)?.suggererPays(iso);
}

}

/** @returns {Object|null} le champ monté sous cet id */
export function champTelephone(champId) {
return CHAMPS.get(champId) || null;
}
