// ============================================
// ScholarBridge Admin - Firestore
// ============================================

import { db } from "../firebase-config.js";

import {
collection,
getDocs,
getDoc,
getCountFromServer,
addDoc,
setDoc,
updateDoc,
deleteDoc,
doc,
query,
where,
orderBy,
limit,
Timestamp,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// ============================================
// UNIVERSITÉS
// ============================================

const universitiesCollection = collection(db, "universities");

// Récupérer toutes les universités
export async function getUniversities() {

const snapshot = await getDocs(universitiesCollection);

return snapshot.docs.map(doc => ({

firestoreId: doc.id,

...doc.data()

}));

}

/* ==========================================
RÉCUPÉRER UN PROGRAMME
========================================== */

export async function getProgram(programId) {

const programRef = doc(db, "universities", programId);

const snapshot = await getDoc(programRef);

if (!snapshot.exists()) {

return null;

}

return {

firestoreId: snapshot.id,

...snapshot.data()

};

}

/* ==========================================
AJOUTER UN PROGRAMME
========================================== */

export async function addProgram(programData) {

const docRef = await addDoc(

universitiesCollection,

programData

);

return docRef.id;

}

/* ==========================================
AJOUTER UN PROGRAMME À UNE UNIVERSITÉ EXISTANTE
Les documents "universities" utilisent un identifiant en
préfixe partagé (ex. "zju-bachelor", "zju-master", "zju-phd")
pour être regroupés par université ailleurs dans l'admin et sur
le site public. On respecte cette convention en construisant un
identifiant explicite plutôt qu'un identifiant aléatoire, qui
casserait ce regroupement pour tout nouveau programme.
========================================== */

function slugify(value) {

// "level" ne prend que des valeurs simples (Licence/Master/Doctorat),
// un nettoyage basique suffit donc, sans dépendance à une éventuelle
// bibliothèque de translittération.
return String(value || "programme")
.toLowerCase()
.replace(/[^a-z0-9]+/g, "-")
.replace(/^-+|-+$/g, "") || "programme";

}

export async function addProgramForUniversity(universityIdPrefix, programData) {

const levelSlug = slugify(programData.level);

let candidateId = `${universityIdPrefix}-${levelSlug}`;

const existing = await getProgram(candidateId);

if (existing) {
candidateId = `${candidateId}-${Date.now().toString(36)}`;
}

await setDoc(doc(universitiesCollection, candidateId), programData);

return candidateId;

}

/* ==========================================
MODIFIER UN PROGRAMME
========================================== */

export async function updateProgram(programId, programData) {

const programRef = doc(

db,

"universities",

programId

);

await updateDoc(

programRef,

programData

);

}
/* ==========================================
SUPPRIMER UN PROGRAMME
========================================== */

export async function deleteProgram(programId) {

const programRef = doc(

db,

"universities",

programId

);

await deleteDoc(programRef);

}

export async function updateUniversity(firestoreId, data) {

const universityRef = doc(db, "universities", firestoreId);

await updateDoc(universityRef, data);

}

// ============================================
// ARCHITECTURE RELATIONNELLE (2026-07-30) — remplace le champ texte
// libre "university" sur les bourses, qui obligeait à recréer une
// bourse par université partenaire.
//
// Trois collections désormais distinctes :
//  - "universities"    : UN document par université réelle (profil
//                        pur — nom, photo, pays, ville, classement...).
//                        Tant que la migration (admin/migrate.js) n'a
//                        pas tourné, cette collection contient encore
//                        l'ancien format (une offre par document) —
//                        les fonctions ci-dessous ne doivent être
//                        utilisées qu'après la migration.
//  - "scholarships"     : UN document par bourse réelle (déjà le cas
//                        pour cette collection, seul le champ
//                        "university" disparaît et les niveaux
//                        deviennent un tableau `levels`).
//  - "programs"          : la relation many-to-many réelle — un
//                        document par offre (université × bourse ×
//                        niveau), avec ses données propres (deadline,
//                        portail, langue). Remplace l'ancien usage de
//                        "universities" comme table d'offres.
//
// Les anciennes fonctions getProgram/addProgram/updateProgram/
// deleteProgram ci-dessus continuent d'exister le temps de la
// transition (pages pas encore migrées) ; ne pas les faire pointer
// vers "programs" tant que tous les appelants n'ont pas basculé.
// ============================================

// --------------------------------------------
// Universités — profils propres (collection "universities" APRÈS
// migration ; un document par université, jamais dupliqué).
// --------------------------------------------

export async function getUniversityProfiles() {

const snapshot = await getDocs(collection(db, "universities"));

return snapshot.docs.map((docSnap) => ({ firestoreId: docSnap.id, ...docSnap.data() }));

}

export async function getUniversityProfile(universityId) {

const snapshot = await getDoc(doc(db, "universities", universityId));

if (!snapshot.exists()) return null;

return { firestoreId: snapshot.id, ...snapshot.data() };

}

export async function addUniversityProfile(profileId, profileData) {

await setDoc(doc(db, "universities", profileId), profileData);

return profileId;

}

export async function updateUniversityProfile(universityId, profileData) {

await updateDoc(doc(db, "universities", universityId), profileData);

}

export async function deleteUniversityProfile(universityId) {

await deleteDoc(doc(db, "universities", universityId));

}

// --------------------------------------------
// Bourses — CRUD inchangé dans sa forme (voir getScholarships/
// getScholarship/addScholarship/updateScholarship/deleteScholarship
// plus haut), mais les documents qu'il manipule n'ont plus de champ
// "university" ni de "level" isolé après migration (remplacés par
// `levels` et la relation "programs").
// --------------------------------------------

// --------------------------------------------
// Programmes — la relation many-to-many (collection "programs").
// Une entrée = une bourse proposée par une université à un niveau
// donné, avec ses propres deadline/portail/langue.
// --------------------------------------------

const programsCollection = collection(db, "programs");

export async function getPrograms() {

const snapshot = await getDocs(programsCollection);

return snapshot.docs.map((docSnap) => ({ firestoreId: docSnap.id, ...docSnap.data() }));

}

export async function getProgramsByScholarship(scholarshipId) {

const q = query(programsCollection, where("scholarshipId", "==", scholarshipId));

const snapshot = await getDocs(q);

return snapshot.docs.map((docSnap) => ({ firestoreId: docSnap.id, ...docSnap.data() }));

}

export async function getProgramsByUniversity(universityId) {

const q = query(programsCollection, where("universityId", "==", universityId));

const snapshot = await getDocs(q);

return snapshot.docs.map((docSnap) => ({ firestoreId: docSnap.id, ...docSnap.data() }));

}

export async function addProgramEntry(programId, programData) {

await setDoc(doc(db, "programs", programId), programData);

return programId;

}

export async function updateProgramEntry(programId, programData) {

await updateDoc(doc(db, "programs", programId), programData);

}

export async function deleteProgramEntry(programId) {

await deleteDoc(doc(db, "programs", programId));

}

// Crée l'entrée programs pour une paire (université, bourse) si elle
// n'existe pas déjà — utilisé par la case à cocher "Universités
// partenaires" du formulaire de bourse (admin/scholarships.js) :
// cocher une université ne doit jamais créer deux fois la même offre.
export async function ensureProgramForPair(universityId, scholarshipId, defaults) {

const q = query(
programsCollection,
where("universityId", "==", universityId),
where("scholarshipId", "==", scholarshipId)
);

const existing = await getDocs(q);

if (!existing.empty) return existing.docs[0].id;

const programId = `${universityId}__${scholarshipId}`;

await setDoc(doc(db, "programs", programId), {
universityId,
scholarshipId,
...defaults
});

return programId;

}

// Supprime toutes les entrées programs pour une paire — utilisé
// quand on décoche une université sur le formulaire de bourse.
export async function deleteProgramsForPair(universityId, scholarshipId) {

const q = query(
programsCollection,
where("universityId", "==", universityId),
where("scholarshipId", "==", scholarshipId)
);

const snapshot = await getDocs(q);

await Promise.all(snapshot.docs.map((docSnap) => deleteDoc(docSnap.ref)));

}

// ============================================
// BOURSES
// ============================================

const scholarshipsCollection = collection(db, "scholarships");

export async function getScholarships() {

const snapshot = await getDocs(scholarshipsCollection);

return snapshot.docs.map(doc => ({

firestoreId: doc.id,

...doc.data()

}));

}

export async function getScholarship(scholarshipId) {

const scholarshipRef = doc(db, "scholarships", scholarshipId);

const snapshot = await getDoc(scholarshipRef);

if (!snapshot.exists()) {

return null;

}

return {

firestoreId: snapshot.id,

...snapshot.data()

};

}

export async function addScholarship(scholarshipData) {

const docRef = await addDoc(scholarshipsCollection, scholarshipData);

return docRef.id;

}

export async function updateScholarship(scholarshipId, scholarshipData) {

const scholarshipRef = doc(db, "scholarships", scholarshipId);

await updateDoc(scholarshipRef, scholarshipData);

}

export async function deleteScholarship(scholarshipId) {

const scholarshipRef = doc(db, "scholarships", scholarshipId);

await deleteDoc(scholarshipRef);

}

// Comptages légers (getCountFromServer évite de télécharger tous
// les documents juste pour connaître leur nombre — important pour
// tenir à l'échelle visée par le Control Center).
export async function getUniversitiesCount() {
const snapshot = await getCountFromServer(universitiesCollection);
return snapshot.data().count;
}

export async function getScholarshipsCount() {
const snapshot = await getCountFromServer(scholarshipsCollection);
return snapshot.data().count;
}

// ============================================
// ANALYTICS — lecture des compteurs écrits par js/analytics.js
// (Module 1 du ScholarBridge Control Center). Séparation volontaire
// des responsabilités : js/analytics.js (racine du site) est la
// SEULE partie qui écrit ces compteurs ; ce fichier ne fait que les
// lire pour le tableau de bord admin. Les règles Firestore
// réservent la lecture de "analyticsCounters" aux administrateurs.
// ============================================

function todayKey() {
return new Date().toISOString().slice(0, 10);
}

// Total d'étudiants inscrits + nouveaux inscrits aujourd'hui, à
// partir de la collection "users" (createdAt écrit par payment.js,
// seul point de création de compte depuis le retrait de signup.html).
export async function getUserStats() {

const usersCollection = collection(db, "users");

const startOfToday = Timestamp.fromDate(
new Date(new Date().setHours(0, 0, 0, 0))
);

const [totalSnapshot, newTodaySnapshot] = await Promise.all([
getCountFromServer(usersCollection),
getCountFromServer(query(usersCollection, where("createdAt", ">=", startOfToday)))
]);

return {
total: totalSnapshot.data().count,
newToday: newTodaySnapshot.data().count
};

}

// Compteurs globaux, un champ par type d'événement (voir EVENT_CONFIG
// dans js/analytics.js pour la liste des types existants).
export async function getAnalyticsTotals() {

const snapshot = await getDoc(doc(db, "analyticsCounters", "totals"));

return snapshot.exists() ? snapshot.data() : {};

}

// Mêmes compteurs, mais uniquement pour la journée en cours.
export async function getTodayCounters() {

const snapshot = await getDoc(doc(db, "analyticsDailyCounters", todayKey()));

return snapshot.exists() ? snapshot.data() : {};

}

// Répartition des tentatives de paiement par formule.
export async function getPlanBreakdown() {

const snapshot = await getDocs(collection(db, "analyticsPlanCounters"));

const breakdown = {};

snapshot.docs.forEach((docSnap) => {
breakdown[docSnap.id] = docSnap.data().count || 0;
});

return breakdown;

}

async function getTopDimension(collectionName, topN) {

const dimensionQuery = query(
collection(db, collectionName),
orderBy("count", "desc"),
limit(topN)
);

const snapshot = await getDocs(dimensionQuery);

return snapshot.docs.map((docSnap) => ({
label: docSnap.data().label || docSnap.id,
count: docSnap.data().count || 0
}));

}

export function getTopCountries(topN = 10) {
return getTopDimension("analyticsCountryCounters", topN);
}

export function getTopUniversities(topN = 10) {
return getTopDimension("analyticsUniversityCounters", topN);
}

export function getTopFields(topN = 10) {
return getTopDimension("analyticsFieldCounters", topN);
}

// ============================================
// ÉTUDIANTS (Module 3 — CRM) : lecture/écriture de "users" pour le
// Control Center. Les règles Firestore n'autorisent un administrateur
// à écrire que les champs "plan" et "disabled" sur un document
// utilisateur — jamais le reste (profil, nom, email), qui reste la
// propriété exclusive de l'étudiant (voir firestore.rules).
// ============================================

export async function getAllUsers() {

const snapshot = await getDocs(collection(db, "users"));

return snapshot.docs.map((docSnap) => ({
uid: docSnap.id,
...docSnap.data()
}));

}

export async function getUser(uid) {

const snapshot = await getDoc(doc(db, "users", uid));

if (!snapshot.exists()) return null;

return { uid: snapshot.id, ...snapshot.data() };

}

export async function updateUserPlan(uid, plan) {
await updateDoc(doc(db, "users", uid), { plan });
}

// Accès test complet (users/{uid}.testerAccess) — voir firestore.rules
// et js/access-guard.js. Réservé à l'admin dans les deux sens, comme
// "plan"/"disabled".
export async function updateUserTesterAccess(uid, enabled) {
await updateDoc(doc(db, "users", uid), { testerAccess: enabled });
}

export async function setUserDisabled(uid, disabled) {
await updateDoc(doc(db, "users", uid), { disabled });
}

// planExpiresAt/fitzExpressExpiresAt (pricing pivot 2026-07-30) — mêmes
// champs que firestore.rules protège désormais aux côtés de "plan" :
// seul un admin peut les poser. Valeurs attendues : chaîne ISO
// ("2026-09-15") ou null pour effacer.
export async function updateUserPlanExpiry(uid, isoDateOrNull) {
await updateDoc(doc(db, "users", uid), { planExpiresAt: isoDateOrNull || null });
}

export async function updateUserFitzExpressExpiry(uid, isoDateOrNull) {
await updateDoc(doc(db, "users", uid), { fitzExpressExpiresAt: isoDateOrNull || null });
}

// Candidatures suivies par l'étudiant (users/{uid}/applications, voir
// applications.js) — lecture seule ici, l'admin ne modifie jamais le
// suivi personnel de l'étudiant (voir firestore.rules).
export async function getUserApplications(uid) {

const snapshot = await getDocs(collection(db, "users", uid, "applications"));

return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));

}

// Exception unique au principe ci-dessus (voir firestore.rules pour la
// même exception côté sécurité) : marquer une lettre de recommandation
// comme reçue quand elle arrive par un canal externe (e-mail) qu'aucun
// backend ne surveille encore. Écrase tout le champ "checklist" (même
// approche que applications.js côté étudiant) — jamais les autres
// champs de la candidature (status, deadline...), qui restent
// strictement réservés à l'étudiant.
export async function updateApplicationChecklistItem(uid, applicationId, checklist) {
await updateDoc(doc(db, "users", uid, "applications", applicationId), {
checklist,
updatedAt: serverTimestamp()
});
}

// Historique d'activité d'un étudiant, à partir du journal
// analyticsEvents (Module 1). Nécessite l'index composite
// (uid ASC, createdAt DESC) déclaré dans firestore.indexes.json.
export async function getUserEvents(uid, max = 50) {

const eventsQuery = query(
collection(db, "analyticsEvents"),
where("uid", "==", uid),
orderBy("createdAt", "desc"),
limit(max)
);

const snapshot = await getDocs(eventsQuery);

return snapshot.docs.map((docSnap) => ({
id: docSnap.id,
...docSnap.data()
}));

}

// ============================================
// NOTES INTERNES — jamais visibles côté étudiant (voir firestore.rules).
// ============================================

export async function getAdminNotes(uid) {

const notesQuery = query(
collection(db, "users", uid, "adminNotes"),
orderBy("createdAt", "desc")
);

const snapshot = await getDocs(notesQuery);

return snapshot.docs.map((docSnap) => ({
id: docSnap.id,
...docSnap.data()
}));

}

export async function addAdminNote(uid, authorUid, authorEmail, text) {

await addDoc(collection(db, "users", uid, "adminNotes"), {
authorUid,
authorEmail,
text,
createdAt: serverTimestamp()
});

}

// ============================================
// MESSAGES — écrits par un administrateur, lus par l'étudiant
// (voir js/student-messages.js côté étudiant).
// ============================================

export async function getSentMessages(uid) {

const messagesQuery = query(
collection(db, "users", uid, "messages"),
orderBy("createdAt", "desc")
);

const snapshot = await getDocs(messagesQuery);

return snapshot.docs.map((docSnap) => ({
id: docSnap.id,
...docSnap.data()
}));

}

export async function sendMessageToUser(uid, authorUid, authorEmail, text) {

await addDoc(collection(db, "users", uid, "messages"), {
fromAdminUid: authorUid,
fromAdminEmail: authorEmail,
text,
createdAt: serverTimestamp(),
read: false
});

}

// ============================================
// FORMULES (Module 4) — configuration des fonctionnalités activées
// par formule, lue/écrite via js/plan-features.js (source unique des
// clés de fonctionnalités et des valeurs par défaut). Ce fichier ne
// fait que lire/écrire le document Firestore ; toute la logique de
// fusion avec les valeurs par défaut vit dans js/plan-features.js
// pour rester identique côté étudiant et côté admin.
// ============================================

export async function getPlanFeatureConfig() {

const snapshot = await getDoc(doc(db, "config", "planFeatures"));

return snapshot.exists() ? snapshot.data() : null;

}

export async function savePlanFeatureConfig(features) {

await setDoc(doc(db, "config", "planFeatures"), {
features,
updatedAt: serverTimestamp()
});

}
