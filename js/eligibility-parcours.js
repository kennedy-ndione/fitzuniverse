/**
* ============================================================
* FitzUniverse — le moteur du questionnaire de diagnostic
* ============================================================
*
* Remplace eligibility.engine.js (script classique, liste FIGÉE de
* questions, invérifiable par `npm test`).
*
* La différence tient en une phrase : la liste des questions n'est
* plus une donnée, c'est une FONCTION des réponses déjà données. Elle
* est recalculée après chaque réponse, parce qu'une réponse peut en
* ouvrir ou en fermer d'autres — se déclarer doctorant supprime la
* question sur la filière du baccalauréat, viser un master en ajoute
* une sur l'état des candidatures.
*
* Deux pièges que cette classe doit tenir, et qu'une simple liste ne
* tenait pas :
*
*  1. LE RETOUR EN ARRIÈRE. L'étudiant peut revenir sur son niveau
*     d'études au milieu du parcours. La position ne peut donc pas
*     être un simple index : on repère la question COURANTE par son
*     identifiant, on recalcule la liste, puis on retrouve sa place.
*     Un index nu aurait fait sauter l'étudiant à une question sans
*     rapport.
*  2. LES RÉPONSES ORPHELINES. Les réponses aux questions disparues
*     sont effacées (purgerHorsPiste) : sans cela, Fitz commenterait
*     la série de baccalauréat d'un doctorant.
* ============================================================
*/

import { questionsPour, purgerHorsPiste } from "./eligibility-pistes.js";

export class ParcoursEligibilite {

constructor(reponsesInitiales) {

this.reponses = reponsesInitiales ? { ...reponsesInitiales } : {};
this.index = 0;

}

/** Les questions du parcours ACTUEL, recalculées à chaque lecture. */
get questions() {
return questionsPour(this.reponses);
}

courante() {

const liste = this.questions;

if (!liste.length) return null;

// Filet : une purge peut avoir raccourci la liste sous l'index.
if (this.index > liste.length - 1) this.index = liste.length - 1;

return liste[this.index];

}

/**
* Enregistre une réponse, puis remet la liste et la position d'accord
* entre elles. Renvoie l'identifiant de la question sur laquelle on
* se trouve après recalcul.
*/
enregistrer(id, valeur) {

const idCourant = (this.courante() || {}).id;

this.reponses[id] = valeur;

// Les clés techniques (`averageScale`) ne changent jamais le
// parcours : inutile de tout recalculer pour elles.
if (!id.endsWith("Scale")) purgerHorsPiste(this.reponses);

const liste = this.questions;
const position = liste.findIndex((q) => q.id === idCourant);

this.index = position >= 0 ? position : Math.min(this.index, Math.max(0, liste.length - 1));

return (this.courante() || {}).id;

}

/** Avance d'une question. Renvoie false quand le parcours est fini. */
suivante() {

const liste = this.questions;

if (this.index < liste.length - 1) {
this.index += 1;
return true;
}

return false;

}

precedente() {

if (this.index > 0) this.index -= 1;

}

/**
* Le nombre total de questions — ou null tant que le niveau d'études
* n'est pas connu, car il commande la longueur du parcours.
*
* Renvoyer un total inventé (« 14 ») avant de le savoir aurait été un
* mensonge inutile : on préfère n'afficher aucun total pendant la
* première question.
*/
total() {

const liste = this.questions;

return liste.length > 1 ? liste.length : null;

}

/** Progression en pourcentage, bornée à 4 % tant que le total est inconnu. */
progression() {

const total = this.total();

if (!total) return 4;

return Math.round(((this.index + 1) / total) * 100);

}

}
