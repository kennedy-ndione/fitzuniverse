/**
* ============================================================
* js/session-memorisee.js — une session Firebase existe-t-elle ?
* ============================================================
*
* LOT 126 (2026-09-26). Le même test que celui de l'accueil (lot A
* « vitesse sur téléphone », index.html), mis en commun pour les pages
* publiques du catalogue : scholarships.html, universities.html,
* universite.html, scholarship-details.html, preinscriptions.html.
*
* Pourquoi : sur ces pages, un visiteur JAMAIS connecté téléchargeait
* quand même les SDK Firebase (app, auth, firestore, storage — 775 Ko
* bruts chez gstatic) et toute la coquille de l'espace étudiant
* (js/dual-shell.js → app-shell.js → fitz-recours.js → les neuf
* procédures pays…), en concurrence avec le catalogue qu'il était venu
* lire. La plupart des visiteurs ne se sont jamais connectés.
*
* Une session Firebase laisse une trace dans le navigateur : la clé
* « firebase:authUser:… » dans IndexedDB (base firebaseLocalStorageDb),
* localStorage ou sessionStorage. On la cherche sans Firebase :
* - trace trouvée → comportement d'avant ;
* - aucune trace → rien n'est chargé ;
* - impossible de savoir (stockage bloqué, base au format inattendu,
*   IndexedDB muet plus de 1,5 s) → comportement d'avant, par prudence.
* La base n'est JAMAIS créée par cette lecture (onupgradeneeded → abort).
*
* Le corps de sessionMemorisee() est IDENTIQUE à celui d'index.html :
* test/lot126.test.mjs les compare. Corriger l'un, c'est corriger
* l'autre.
* ============================================================
*/

const CLE_SESSION = "firebase:authUser:";

let enCours = null;

/** @returns {Promise<boolean>} vrai si une session a pu être mémorisée (ou si on ne peut pas savoir). */
export function sessionMemorisee() {
  if (!enCours) enCours = lireLaTrace();
  return enCours;
}

function lireLaTrace() {
  return new Promise((conclure) => {
    let fini = false;
    const reponse = (valeur) => { if (!fini) { fini = true; conclure(valeur); } };
    setTimeout(() => reponse(true), 1500);
    try {
      const cles = [...Object.keys(localStorage), ...Object.keys(sessionStorage)];
      if (cles.some((cle) => cle.startsWith(CLE_SESSION))) return reponse(true);
    } catch (erreur) {
      return reponse(true);
    }
    let demande;
    try {
      demande = indexedDB.open("firebaseLocalStorageDb");
    } catch (erreur) {
      return reponse(true);
    }
    demande.onupgradeneeded = () => demande.transaction.abort();
    demande.onerror = () => reponse(!(demande.error && demande.error.name === "AbortError"));
    demande.onblocked = () => reponse(true);
    demande.onsuccess = () => {
      const base = demande.result;
      try {
        if (!base.objectStoreNames.contains("firebaseLocalStorage")) {
          base.close();
          return reponse(true);
        }
        const lecture = base.transaction("firebaseLocalStorage", "readonly")
          .objectStore("firebaseLocalStorage").getAllKeys();
        lecture.onsuccess = () => {
          base.close();
          reponse(lecture.result.some((cle) => String(cle).startsWith(CLE_SESSION)));
        };
        lecture.onerror = () => { base.close(); reponse(true); };
      } catch (erreur) {
        base.close();
        reponse(true);
      }
    };
  });
}
