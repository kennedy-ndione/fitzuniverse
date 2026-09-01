/**
* ============================================================
* Fitz — mémoïsation des lectures de catalogue (logique pure)
* ============================================================
*
* Module PUR : aucune dépendance Firebase, aucun DOM. Il ne sait pas
* LIRE, il sait seulement ne pas lire deux fois. C'est ce qui le rend
* vérifiable sans réseau (test/catalog-cache.test.mjs) — et c'est
* js/catalog-data.js qui le branche sur Firestore.
*
* POURQUOI IL EXISTE (mesuré le 2026-08-31)
* index.html chargeait DEUX modules qui lisaient chacun les trois
* collections entières, dans deux Promise.all indépendants :
* js/homepage-teaser.js et js/opportunites-bandeau.js. Un seul
* chargement de la page d'accueil coûtait donc ~1 182 lectures
* Firestore au lieu de ~591 — soit environ 42 chargements par jour
* avant d'épuiser le quota de 50 000 du plan gratuit. Le catalogue ne
* change qu'aux lots : le relire deux fois dans la même page ne pouvait
* rien apporter.
*
* MÉMOÏSATION PAR COLLECTION, ET NON PAR « CATALOGUE COMPLET ».
* C'est le choix qui compte ici : deux pages (profile.html,
* eligibility-questions.html) n'ont besoin que de `universities`.
* Un chargeur « tout ou rien » les aurait fait passer de ~111 à ~591
* lectures — on aurait corrigé l'accueil en dégradant deux autres
* pages. Avec une promesse par collection, chaque appelant ne paie que
* ce qu'il demande, et toute combinaison est dédoublonnée : les deux
* modules de l'accueil demandent les trois mêmes collections et se
* partagent les trois mêmes promesses.
*
* La promesse est mémorisée, pas le résultat : deux appels lancés en
* parallèle AVANT la première réponse partagent le même aller-retour.
* C'est exactement le cas de l'accueil, où les deux modules démarrent
* dans le même tick.
*
* Portée : le chargement de page. Aucune persistance entre navigations
* — ce serait l'instantané statique, un chantier distinct.
* ============================================================
*/

/**
* @param {(nom: string) => Promise<Array>} lireCollection - lecture réelle d'une collection
* @returns {{charger: (noms: string[]) => Promise<Object>, lectures: () => number, oublier: () => void}}
*/
export function creerCacheCatalogue(lireCollection) {

// Une promesse par nom de collection. Jamais réinitialisée d'elle-même :
// le catalogue ne bouge pas pendant qu'une page est ouverte.
const promesses = new Map();

// Compteur de DOCUMENTS réellement lus — ce qui est facturé par
// Firestore, et ce que le journal de développement annonce.
let lectures = 0;

function collection(nom) {

if (!promesses.has(nom)) {

const promesse = lireCollection(nom).then((docs) => {
lectures += docs.length;
return docs;
});

// ÉVICTION EN CAS DE REJET. Sans elle, une lecture ratée resterait
// mémorisée pour toute la vie de la page : plus personne ne
// réessaierait, et la seule issue serait un rechargement complet.
// Avant le dédoublonnage, un échec dans js/homepage-teaser.js
// laissait js/opportunites-bandeau.js réussir de son côté ; depuis
// qu'ils partagent la même promesse, ils tombent ensemble. Sur les
// connexions que Fitz vise (voir l'en-tête de js/catalog-watchdog.js),
// ce n'est pas un cas théorique.
//
// L'erreur n'est PAS avalée : ce `catch` est branché sur une chaîne
// dérivée qu'on jette, et c'est `promesse` elle-même — encore
// rejetée — qui est stockée puis renvoyée à l'appelant. La garde
// d'identité évite d'évincer une tentative plus récente déjà lancée.
//
// COMPROMIS ASSUMÉ : une page réellement hors ligne émettra
// plusieurs tentatives au lieu d'une. Une requête qui échoue n'est
// pas une lecture facturée, et la page échoue de toute façon —
// mieux vaut réessayable que figé.
promesse.catch(() => {
if (promesses.get(nom) === promesse) promesses.delete(nom);
});

promesses.set(nom, promesse);

}

return promesses.get(nom);

}

return {

/**
* Charge les collections demandées et les renvoie indexées par nom.
* Un nom déjà demandé ne déclenche aucune nouvelle requête.
*/
async charger(noms) {
const resultats = await Promise.all(noms.map(collection));
return Object.fromEntries(noms.map((nom, i) => [nom, resultats[i]]));
},

/** Nombre de documents réellement lus depuis le chargement de la page. */
lectures() {
return lectures;
},

/** Vide le cache — réservé aux tests, jamais appelé par le site. */
oublier() {
promesses.clear();
lectures = 0;
}

};

}
