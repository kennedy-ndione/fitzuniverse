/**
* ============================================================
* FitzUniverse — la lecture du diagnostic par Fitz
* ============================================================
*
* CE QUE CE BLOC DOIT PRODUIRE
*
* Un étudiant vient de donner cinq minutes de son temps. Il a vu un
* score, des barres et des listes. Ce qu'il n'a pas encore, c'est la
* conviction que quelqu'un a REGARDÉ son dossier.
*
* C'est le seul objectif de ce module : qu'à la lecture de ces quelques
* lignes, l'étudiant se dise « ils ont compris ma situation, et ils
* connaissent ce domaine ». Le reste de la page prouve le sérieux du
* calcul ; ce bloc-ci prouve le sérieux de l'accompagnement.
*
* AUCUNE INSCRIPTION N'EST DEMANDÉE (décision de Charles, 2026-09-04).
* Une version antérieure exigeait un compte gratuit pour lire
* l'analyse. C'était une erreur de séquence : on ne fait pas payer —
* même en adresse e-mail — le moment où l'on doit convaincre. L'analyse
* s'affiche pour tout le monde, immédiatement.
*
* COMMENT LE COÛT RESTE BORNÉ SANS RIEN DEMANDER
* -----------------------------------------------
*  1. **Connexion anonyme Firebase.** Le visiteur reçoit un identifiant
*     technique sans rien remplir et sans rien voir. Le serveur garde
*     donc son contrôle d'identité et son plafond par utilisateur
*     (functions/fitz.js), et nous gardons un moyen d'arrêter un abus.
*  2. **Mémoire de session.** L'analyse est conservée pour CES
*     réponses-là : recharger la page ou revenir en arrière ne relance
*     aucune génération.
*  3. **Enregistrement durable** si — et seulement si — l'étudiant a un
*     vrai compte : il retrouvera son analyse à sa prochaine visite.
*
* ⚠️ PRÉREQUIS FIREBASE : la méthode « Anonyme » doit être ACTIVÉE dans
* Authentication > Sign-in method. Sans elle, `signInAnonymously` échoue
* et le bloc disparaît — la page reste entière, mais l'analyse ne
* s'affiche jamais.
* ============================================================
*/

import { generate, messageErreurFitz, estArret } from "./ai-client.js";
import { renderMarkdownLite } from "./format.js";

const CHAMP = "diagnosticFitz";
const CLE_SESSION = "fitzDiagnostic";

// Version de la lecture, mêlée à l'empreinte. Passée à 2 le 2026-09-21 :
// avant cette date, la réflexion par défaut du modèle coupait des
// lectures en plein mot, et ces lectures tronquées ont été ENREGISTRÉES
// sur les comptes. Changer la version les rend caduques : chaque
// étudiant concerné reçoit, une fois, une lecture complète.
// Passée à 3 le même jour (lot FINITIONS) : les raisons données à Fitz
// nommaient la famille du catalogue (« votre domaine (Commerce) ») au
// lieu du domaine de l'étudiant (« Économie »), et Fitz le répétait
// dans sa lecture. Les lectures écrites avant la correction sont
// régénérées une fois.
const VERSION_LECTURE = 3;

/**
* Empreinte stable des réponses.
*
* Elle répond à une seule question : l'analyse que j'ai sous la main
* correspond-elle ENCORE à ces réponses ? Sans elle, un étudiant qui
* refait le test avec de meilleures notes relirait l'ancienne analyse —
* la pire trahison possible sur cette page.
*/
function empreinte(valeur) {

const texte = JSON.stringify(valeur, Object.keys(valeur || {}).sort());

let h = 5381;

for (let i = 0; i < texte.length; i++) {
h = ((h << 5) + h + texte.charCodeAt(i)) | 0;
}

return String(h >>> 0);

}

function lireCache(signature) {

try {

const brut = sessionStorage.getItem(`${CLE_SESSION}:${signature}`);

return brut ? JSON.parse(brut).texte : null;

} catch (e) {

return null;

}

}

function ecrireCache(signature, texte) {

try {

sessionStorage.setItem(`${CLE_SESSION}:${signature}`, JSON.stringify({ texte }));

} catch (e) {

// Stockage plein ou navigation privée stricte : sans conséquence,
// l'analyse sera simplement régénérée au prochain chargement.

}

}

/**
* Ce que Fitz reçoit.
*
* On envoie le résultat CALCULÉ, jamais les réponses brutes : c'est plus
* court, et surtout ça interdit à Fitz de refaire le raisonnement à sa
* façon. Il commente un verdict établi, il ne le rejuge pas.
*
* On lui donne en revanche TOUT ce qui rend une lecture crédible : les
* sous-scores chiffrés, les échéances réelles, et TOUTES les raisons de
* correspondance de chaque opportunité — pas seulement la première. Une
* analyse convaincante se reconnaît à ce qu'elle cite des détails que
* l'étudiant n'aurait pas pensé à relier lui-même.
*/
// « Je ne sais pas encore » est une réponse VALIDE du questionnaire,
// pas une valeur à recopier. Laissée telle quelle, elle produisait la
// phrase « vous visez Licence en Psychologie, avec Je ne sais pas
// encore en tête » — vue sur capture le 2026-09-05. Un champ qu'on ne
// sait pas remplir doit être ABSENT, jamais rempli d'un aveu
// d'ignorance.
function valeurUtile(reponse) {

const t = String(reponse || "").trim();

if (!t) return "";
if (t.toLowerCase().startsWith("je ne sais pas")) return "";

return t;

}

function construireEntree({ responses, result, score, breakdown }) {

const r = responses || {};

const opportunites = (result.scholarshipDetails || []).slice(0, 3).map((s) => ({
nom: s.name,
pays: s.country,
universite: s.university,
echeance: s.deadline || "",
joursRestants: typeof s.jours === "number" ? s.jours : null,
candidaturesOuvertes: s.echeanceOuverte === true,
raisons: Array.isArray(s.reasons) ? s.reasons : []
}));

// Les réponses PROPRES AU CYCLE (refonte du questionnaire par niveau,
// 2026-09-05). Elles ne servent pas à choisir les bourses — le
// catalogue ne porte pas encore ces exigences — mais elles changent
// tout à la LECTURE : un titulaire de licence sans expérience
// professionnelle et un cadre avec quatre ans ne doivent pas recevoir
// le même conseil sur les mêmes bourses.
const parcours = {
niveauActuel: valeurUtile(r.currentLevel),
filiereSecondaire: valeurUtile(r.secondaryTrackOther || r.secondaryTrack),
diplomeObtenuQuand: valeurUtile(r.diplomaWhen),
diplomeAttenduQuand: valeurUtile(r.secondaryExpected || r.licenceExpected || r.masterExpected),
anneeEnCours: valeurUtile(r.licenceYear || r.phdYear),
theseSoutenue: valeurUtile(r.thesisWhen),
experienceProfessionnelle: valeurUtile(r.workExperience),
candidaturesUniversitaires: valeurUtile(r.admissionStatus),
projetDeRecherche: valeurUtile(r.researchProject),
directeurOuLaboratoire: valeurUtile(r.supervisorContact),
publications: valeurUtile(r.publications),
certificationLangue: valeurUtile(r.langCert),
calendrier: valeurUtile(r.timeline),
passeport: valeurUtile(r.passport)
};

return {
score,
// Ce que Fitz a RETENU, pas « ce qui est compatible » : voir
// retenirOpportunites() (js/recommend-programs.js) et l'histoire du
// « 154 opportunités ».
nombreRetenu: result.nombreRetenu || 0,
echeancesOuvertes: result.echeancesOuvertes || 0,
paysCouverts: result.paysCouverts || 0,
totalCompatible: result.nombreRetenu || 0,
niveauVise: valeurUtile(r.targetLevel || r.studyLevel),
sousScores: (breakdown || []).map((b) => ({ libelle: b.label, valeur: b.value })),
profile: {
nationality: valeurUtile(r.nationality),
country: valeurUtile(r.country),
desiredField: valeurUtile(r.studyCategory),
desiredCountry: valeurUtile(r.destinationCountry)
},
parcours,
strengths: result.strengths || [],
weaknesses: result.weaknesses || [],
recommendations: result.recommendations || [],
opportunites
};

}

// ============================================================
// AFFICHAGE
// ============================================================

function etat(conteneur, classe, contenuHTML) {
conteneur.className = `fitz-analysis ${classe}`;
conteneur.innerHTML = contenuHTML;
if (window.lucide) window.lucide.createIcons();
}

function enCours(conteneur) {

etat(
conteneur,
"is-loading",
`<div class="fitz-analysis-head">
<i data-lucide="loader"></i>
<h3>Fitz analyse votre profil…</h3>
</div>
<div class="fitz-analysis-body" id="fitzAnalysisBody"></div>`
);

return conteneur.querySelector("#fitzAnalysisBody");

}

function termine(conteneur, texte) {

etat(
conteneur,
"is-ready",
`<div class="fitz-analysis-head">
<i data-lucide="brain"></i>
<h3>L'analyse de Fitz</h3>
</div>
<div class="fitz-analysis-body">${renderMarkdownLite(texte)}</div>`
);

}

function echec(conteneur, message, onRetry) {

etat(
conteneur,
"is-error",
`<div class="fitz-analysis-head">
<i data-lucide="alert-triangle"></i>
<h3>L'analyse de Fitz</h3>
</div>
<p>${message}</p>
<button type="button" class="btn btn-secondary" id="fitzAnalysisRetry">
<span>Réessayer</span>
</button>`
);

const bouton = conteneur.querySelector("#fitzAnalysisRetry");

if (bouton && onRetry) bouton.addEventListener("click", onRetry, { once: true });

}

// ============================================================
// IDENTITÉ
// ============================================================

/**
* Un identifiant, sans jamais rien demander.
*
* ⚠️ NE JAMAIS LIRE `auth.currentUser` DIRECTEMENT AU CHARGEMENT :
* Firebase restaure la session de façon ASYNCHRONE, et pendant les
* premières centaines de millisecondes `currentUser` vaut null même
* pour quelqu'un de parfaitement connecté. Constaté en production le
* 2026-09-04 — le bloc traitait des connectés comme des visiteurs.
*/
async function identifier(auth, authModule) {

const existant = await new Promise((resolve) => {

const stop = authModule.onAuthStateChanged(
auth,
(u) => { stop(); resolve(u || null); },
() => { stop(); resolve(null); }
);

});

if (existant) return existant;

// Personne : on ouvre une session anonyme. L'étudiant ne voit rien,
// ne remplit rien, et le serveur garde son plafond par identifiant.
const { user } = await authModule.signInAnonymously(auth);

return user;

}

// ============================================================
// POINT D'ENTRÉE
// ============================================================

/**
* @param {Object} params
* @param {HTMLElement} params.conteneur - le bloc #fitzAnalysis
* @param {Object} params.responses - réponses du test (sessionStorage)
* @param {Object} params.result - sortie d'EligibilityAI.analyze()
* @param {number} params.score
* @param {Array} [params.breakdown] - sous-scores affichés à l'écran
*/
export async function afficherAnalyseFitz({ conteneur, responses, result, score, breakdown }) {

if (!conteneur) return;

const signature = `v${VERSION_LECTURE}-${empreinte(responses)}`;
const enCache = lireCache(signature);

// Déjà écrite pendant cette visite : on la réaffiche, sans réseau.
if (enCache) {
termine(conteneur, enCache);
return;
}

let auth;
let db;
let firestore;
let authModule;

try {

({ auth, db } = await import("../../firebase-config.js"));

firestore = await import(
"https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js"
);

authModule = await import(
"https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js"
);

} catch (error) {

console.error("[Fitz] analyse du diagnostic indisponible :", error);
conteneur.hidden = true;
return;

}

let utilisateur;

try {

utilisateur = await identifier(auth, authModule);

} catch (error) {

// Cause la plus probable : la connexion anonyme n'est pas activée
// dans la console Firebase (Authentication > Sign-in method).
console.error("[Fitz] identification impossible :", error);
conteneur.hidden = true;
return;

}

const estAnonyme = !!utilisateur?.isAnonymous;
const refCompte = utilisateur ? firestore.doc(db, "users", utilisateur.uid) : null;

// Un vrai compte peut avoir gardé son analyse d'une visite précédente.
if (!estAnonyme && refCompte) {

try {

const snap = await firestore.getDoc(refCompte);
const enregistree = snap.data()?.[CHAMP];

if (enregistree?.empreinte === signature && enregistree.texte) {
ecrireCache(signature, enregistree.texte);
termine(conteneur, enregistree.texte);
return;
}

} catch (error) {

console.warn("[Fitz] diagnostic enregistré illisible :", error);

}

}

const corps = enCours(conteneur);

try {

const { text } = await generate({
task: "diagnostic",
input: construireEntree({ responses, result, score, breakdown }),
onToken: (texteComplet) => {
if (corps) corps.innerHTML = renderMarkdownLite(texteComplet);
}
});

termine(conteneur, text);
ecrireCache(signature, text);

// Enregistrement durable réservé aux vrais comptes : écrire un
// document utilisateur pour chaque session anonyme laisserait
// derrière nous un compte fantôme par visiteur.
if (!estAnonyme && refCompte) {

try {

await firestore.updateDoc(refCompte, {
[CHAMP]: {
empreinte: signature,
texte: text,
score,
genereLe: new Date().toISOString()
}
});

} catch (error) {

console.warn("[Fitz] analyse non enregistrée :", error);

}

}

} catch (error) {

if (estArret(error)) return;

console.error("[Fitz] analyse du diagnostic :", error);

echec(conteneur, messageErreurFitz(error), () =>
afficherAnalyseFitz({ conteneur, responses, result, score, breakdown })
);

}

}
