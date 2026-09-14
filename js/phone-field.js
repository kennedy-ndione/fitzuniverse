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

/**
* UNE VALEUR ENREGISTRÉE PEUT PORTER UN INDICATIF QU'ON NE CONNAÎT PAS,
* ET LA LONGUEUR NE SUFFIT PAS À LE DIRE.
* ---------------------------------------------------------------------
* `verifier` ne sait vérifier qu'une longueur. « +675123456 »
* (Papouasie-Nouvelle-Guinée, hors des 88 pays de la liste) fait neuf
* chiffres ; le Sénégal en attend neuf ; `verifier` répond donc
* « valide » et Fitz enregistre « +221675123456 » — un numéro
* parfaitement composable qui n'est pas celui de l'étudiant.
*
* `depuisE164` sait, elle, que l'indicatif ne lui dit rien. Ce drapeau
* retient cette information entre le chargement du profil et
* l'enregistrement, et il ne tombe qu'à la première correction :
* l'étudiant tape, ou change de pays, et le champ redevient un champ
* ordinaire dont seule la longueur décide.
*/
let indicatifInconnu = false;

const PHRASE_INDICATIF_INCONNU = "Nous ne reconnaissons pas l'indicatif de ce numéro. Choisissez votre pays dans la liste, puis saisissez votre numéro sans l'indicatif.";

/** Le verdict du champ, tel que l'affichage ET `valider()` le lisent. */
function verdict() {

if (indicatifInconnu) return { valide: false, message: PHRASE_INDICATIF_INCONNU };

return verifier(select.value, national.value);

}

// La validation ne s'affiche PAS à chaque frappe : signaler « 7
// chiffres au lieu de 9 » à quelqu'un qui en a tapé sept et
// s'apprête à taper le huitième est une réprimande, pas une aide.
// On efface l'erreur pendant la saisie, on la pose à la sortie du
// champ.
national.addEventListener("input", () => {
indicatifInconnu = false;   // il corrige : le champ repart à neuf
afficherErreur("");
synchroniser();
});

national.addEventListener("blur", () => {
afficherErreur(verdict().message);
synchroniser();
});

select.addEventListener("change", () => {
indicatifInconnu = false;
majPlaceholder();
afficherErreur("");
synchroniser();
});

const api = {

/**
* Remplit le champ depuis une valeur enregistrée (E.164 ou non).
*
* L'ORDRE DES DEUX DÉCISIONS A ÉTÉ INVERSÉ (2026-09-14)
* ------------------------------------------------------
* On lisait d'abord la valeur, on choisissait le pays ensuite. Pour un
* numéro sans indicatif — tous ceux enregistrés avant ce champ — la
* lecture se faisait donc SANS pays, et le zéro de tête des pays qui
* le comptent (Côte d'Ivoire, Gabon, Congo, Italie) disparaissait
* avant même que le pays soit connu. Le pays présumé se décide
* maintenant en premier, et sert à la lecture.
*
* ET L'ERREUR N'EST PLUS EFFACÉE D'OFFICE
* ----------------------------------------
* `afficherErreur("")` partait du principe qu'une valeur enregistrée
* est une valeur valide. Un profil ancien contient des numéros écrits
* n'importe comment : le champ s'ouvrait muet, et l'étudiant
* découvrait le problème au moment où « Enregistrer » refusait de
* partir. On pose le message tout de suite — il dit combien de
* chiffres sont attendus, ce qui est exactement ce qu'il faut savoir
* pour corriger.
*/
definir(valeur, isoSuggere) {

const prealable = (isoSuggere && paysParIso(isoSuggere))
? isoSuggere
: (select.value || PAYS_PAR_DEFAUT);

const lu = depuisE164(valeur, prealable);
const choisi = lu.iso || prealable;

if (paysParIso(choisi)) select.value = choisi;

national.value = lu.national;
indicatifInconnu = lu.indicatifInconnu === true;

majPlaceholder();

// Un champ vide n'est pas une erreur : `verdict()` rend
// `{valide:true, message:""}` dans ce cas, et n'affiche donc rien sur
// un profil neuf.
afficherErreur(verdict().message);

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

/**
* @returns {boolean} true si le champ est valide (vide compris)
*
* Le même juge que l'affichage : `verifier` seule répondait
* « valide » à un numéro dont l'indicatif est inconnu mais dont la
* longueur tombait juste — le message s'affichait, et
* l'enregistrement partait quand même.
*/
valider() {

const { valide, message } = verdict();

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
