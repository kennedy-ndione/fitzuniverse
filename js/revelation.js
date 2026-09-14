/**
* ============================================================
* FitzUniverse — LA RÉVÉLATION PROGRESSIVE DU PARCOURS
* ============================================================
*
* CE QUE CE FICHIER RÉPARE (lot ESPACE-ÉTUDIANT, 2026-09-13)
* ----------------------------------------------------------
* Les six phases étaient dépliées EN ENTIER, tout le temps. Un étudiant
* qui ouvrait son espace le jour de son inscription lisait, d'un seul
* écran : son profil vide, des opportunités qu'il n'a pas encore
* choisies, des dossiers qui n'existent pas, des conseils de dépôt, des
* conseils de réponse, et six cartes de visa pour un pays où il n'est
* pas admis. Neuf écrans de texte, dont huit ne le concernaient pas.
*
* Deux conséquences, et la seconde est la pire :
*   - la page ne se lit plus : ce qui compte AUJOURD'HUI est noyé ;
*   - il n'y a plus rien à découvrir. Un parcours dont on a tout vu
*     d'avance n'est plus un parcours, c'est un sommaire.
*
* LA RÈGLE, ET SA LIMITE
* -----------------------
* On cache le DÉTAIL, jamais la ROUTE. Le rail des six phases reste
* entier, nommé, daté : un étudiant qui paie doit savoir où il va. Ce
* qui se dévoile au fil de l'eau, c'est le contenu — les outils, les
* listes, les cartes, les guides.
*
* Et RIEN N'EST VERROUILLÉ. `etatDesPhases` (js/journey-map.js) le dit
* déjà en toutes lettres : « les phases après la courante ne sont pas
* verrouillées, l'étudiant reste libre ». Une phase scellée s'ouvre d'un
* clic. Ce n'est pas une porte fermée, c'est une enveloppe cachetée :
* la différence est que l'étudiant décide, et qu'il sait ce qu'il fait.
*
* QUATRE ÉTATS, DANS L'ORDRE DU VOYAGE
* -------------------------------------
*   faite        elle est derrière : repliée, résumée en une ligne.
*   ouverte      c'est maintenant : dépliée, entière.
*   entrouverte  c'est la suivante : son titre, ce qui vous y attend,
*                et ce qui l'ouvrira. Pas son contenu.
*   scellee      c'est plus loin : son titre et une seule phrase.
*
* Aucun DOM, aucun Firestore : testable sous Node.
* ============================================================
*/

import { motDeLaPlace } from "./parcours-quota.js";

export const ETATS = ["faite", "ouverte", "entrouverte", "scellee"];

/**
* L'état de révélation de chaque phase, à partir des phases déjà
* mesurées par etatDesPhases() — on ne recalcule RIEN ici : `faite` et
* `courante` viennent des données réelles, ce module ne fait que décider
* ce qui se montre.
*
* @param {Array<{id:string, faite:boolean, courante:boolean}>} phases
* @returns {Array} les mêmes phases, chacune avec `revelation` et `rang`
*/
export function revelerPhases(phases = []) {

const rangCourante = phases.findIndex((p) => p.courante && !p.faite);

return phases.map((phase, index) => {

let revelation;

if (phase.faite) revelation = "faite";
else if (rangCourante === -1) revelation = "scellee";
else if (index === rangCourante) revelation = "ouverte";
else if (index === rangCourante + 1) revelation = "entrouverte";
else if (index < rangCourante) revelation = "ouverte";
else revelation = "scellee";

return { ...phase, revelation, rang: index + 1 };

});

}

/**
* CE QUI ATTEND L'ÉTUDIANT, PHASE PAR PHASE.
*
* `attend`  la promesse — ce qu'il trouvera, dit comme une découverte
*           et jamais comme une liste de fonctionnalités.
* `ouvrePar` ce qui, concrètement, fait basculer la phase. Une condition
*           vérifiable, jamais un « bientôt ». Un étudiant qui lit ça
*           doit savoir quoi faire pour y arriver.
*
* Deux vocabulaires, comme PHASES_PAR_ESPACE : le boursier cherche un
* financement, l'autofinancé cherche une place. Les `id` ne changent pas.
*/
const PROMESSES_BOURSE = {
profil: {
attend: "Ce que Fitz sait de vous : votre niveau, vos langues, votre projet. C'est ce qui rend tout le reste précis.",
ouvrePar: "elle est ouverte dès maintenant"
},
opportunites: {
attend: "Les bourses et les universités où votre dossier pèse vraiment — choisies pour vous, une par une, avec la raison de chaque choix.",
ouvrePar: "un profil assez complet pour que Fitz sache où chercher"
},
dossiers: {
attend: "Vos dossiers, étape par étape, dans l'ordre où ils se gagnent — et la boîte à outils qui les écrit avec vous.",
ouvrePar: "votre première candidature suivie"
},
depot: {
attend: "Le jour où le dossier part. Ce qui se vérifie avant, et ce qui ne se rattrape plus après.",
ouvrePar: "un dossier dont toutes les étapes de préparation sont faites"
},
reponse: {
attend: "Les réponses arrivent. Admission, liste d'attente, refus : il reste, à chaque fois, plus de cartes à jouer qu'on ne croit.",
ouvrePar: "votre premier dépôt sur un portail officiel"
},
depart: {
attend: "Le dernier kilomètre : le consulat, la preuve de ressources, l'assurance, le logement, l'avion — et les délais réels de votre pays de destination.",
ouvrePar: "votre première réponse d'université"
}
};

const PROMESSES_PREINSCRIPTION = {
profil: {
attend: "Ce que Fitz sait de vous : votre niveau, vos langues, votre projet. C'est lui qui décide des établissements qui vous correspondent.",
ouvrePar: "elle est ouverte dès maintenant"
},
opportunites: {
attend: "Les établissements où vous pouvez déposer, avec les frais réels de l'année, la langue d'enseignement et le portail officiel de chacun.",
ouvrePar: "un profil assez complet pour que Fitz sache où chercher"
},
dossiers: {
attend: "Vos dossiers, sur les étapes réelles de la procédure de votre pays — celles du portail, avec leurs pièces et leurs dates.",
ouvrePar: "votre premier vœu suivi"
},
depot: {
attend: "Le dépôt sur le portail officiel, depuis votre compte. Ce qui se vérifie avant, et ce qui ne se rattrape plus après.",
ouvrePar: "un dossier dont toutes les étapes de préparation sont faites"
},
reponse: {
attend: "Les établissements répondent, chacun selon son calendrier. Ce que vous faites d'une admission, et ce que vous faites d'un refus.",
ouvrePar: "votre premier dépôt sur le portail officiel"
},
depart: {
attend: "Le dernier kilomètre : le consulat, la preuve de ressources, l'assurance, le logement, l'avion — et les délais réels de votre pays de destination.",
ouvrePar: "votre première admission"
}
};

/** La promesse d'une phase, dans le vocabulaire de son espace. */
export function promesseDePhase(id, espace = "bourse") {
const table = espace === "preinscription" ? PROMESSES_PREINSCRIPTION : PROMESSES_BOURSE;
return table[id] || null;
}

/** Toutes les promesses d'un espace — c'est ce que le test parcourt. */
export function promessesDe(espace = "bourse") {
return espace === "preinscription" ? PROMESSES_PREINSCRIPTION : PROMESSES_BOURSE;
}

/**
* Le résumé d'une phase FAITE, replié sur une ligne.
*
* Il dit ce qui a été accompli, avec le chiffre réel quand il y en a un.
* Jamais « Terminé ✓ » tout seul : une phase repliée doit rappeler
* pourquoi elle l'est, sinon l'étudiant la rouvre pour vérifier.
*/
export function resumeDePhase(id, { profileScore = 0, candidatures = 0, deposees = 0, reponses = 0, visaFaites = 0, visaTotal = 6, espace = "bourse" } = {}) {

// « vœu » ne prend pas un s, il prend un x : `${mot}s` rendait
// « 4 vœus ». Le pluriel du parcours vit dans js/parcours-quota.js, qui
// connaît les deux mots — on ne le réinvente pas ici.
const pluriel = (n, s) => `${n} ${s}${n > 1 ? "s" : ""}`;
const place = (n) => `${n} ${motDeLaPlace(espace, n > 1)}`;

switch (id) {
case "profil":
return `Profil à ${profileScore}/10 — Fitz travaille avec précision.`;
case "opportunites":
return candidatures > 0
? `${place(candidatures)} en cours de suivi.`
: "Vos choix sont faits.";
case "dossiers":
return "Au moins un dossier est prêt à partir.";
case "depot":
return `${pluriel(deposees, "dossier")} déposé${deposees > 1 ? "s" : ""} sur un portail officiel.`;
case "reponse":
return `${pluriel(reponses, "réponse")} reçue${reponses > 1 ? "s" : ""}.`;
case "depart":
return `${visaFaites} démarche${visaFaites > 1 ? "s" : ""} sur ${visaTotal} accomplie${visaFaites > 1 ? "s" : ""} — vous êtes prêt(e).`;
default:
return "";
}

}

/**
* LA RÉVÉLATION DU GUIDE VISA (phase 06).
*
* Six cartes dépliées d'un coup, chacune avec un « quand », un
* « pourquoi », une variante et un dépliant, c'est neuf paragraphes
* avant la première action. La phase 06 suit donc la même règle que le
* parcours lui-même : l'étape EN COURS est la première non cochée ;
* celles d'avant sont repliées ; celles d'après restent scellées,
* ouvrables d'un clic.
*
* @param {Array<{id:string}>} etapes  le socle, dans l'ordre
* @param {Object} coche               map id → bool (champ visaChecklist)
*/
export function revelerEtapesVisa(etapes = [], coche = {}) {

const faite = (e) => coche && coche[e.id] === true;
const rangCourante = etapes.findIndex((e) => !faite(e));

return etapes.map((etape, index) => {

let revelation;

if (faite(etape)) revelation = "faite";
else if (rangCourante === -1) revelation = "faite";
else if (index === rangCourante) revelation = "ouverte";
else if (index === rangCourante + 1) revelation = "entrouverte";
else revelation = "scellee";

return { ...etape, revelation, rang: index + 1 };

});

}

/**
* Les défauts de forme des promesses — ce que le test appelle.
*
* La garde la plus utile est la dernière : une promesse qui ne dit pas
* ce qui ouvre la phase est un « bientôt », et un « bientôt » n'aide
* personne à avancer.
*/
export function defautsDesPromesses(ids = []) {

const defauts = [];

for (const espace of ["bourse", "preinscription"]) {

const table = promessesDe(espace);

for (const id of ids) {
const p = table[id];
if (!p) { defauts.push(`${espace}/${id} : promesse absente`); continue; }
if (!p.attend || p.attend.length < 60) defauts.push(`${espace}/${id} : « attend » trop court pour donner envie`);
if (!p.ouvrePar || !p.ouvrePar.trim()) defauts.push(`${espace}/${id} : on ne dit pas ce qui l'ouvre`);
if (/bientôt|prochainement|à venir/i.test(p.ouvrePar || "")) defauts.push(`${espace}/${id} : « ${p.ouvrePar} » n'est pas une condition vérifiable`);
}

for (const id of Object.keys(table)) {
if (!ids.includes(id)) defauts.push(`${espace}/${id} : promesse d'une phase qui n'existe pas`);
}

}

return defauts;

}
