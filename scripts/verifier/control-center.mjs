/**
 * ============================================================
 * scripts/verifier/control-center.mjs — la fiche étudiant, vue par
 * chaque niveau d'administrateur
 * ============================================================
 *
 * POURQUOI CE CONTRÔLE EXISTE
 *
 * Le 2026-09-09, la fiche étudiant est morte pour TOUT administrateur
 * qui n'était pas le propriétaire. Une seule ligne :
 *
 *     document.getElementById("planSelect").value = userData.plan || "";
 *
 * `appliquerRole()` venait de RETIRER ce sélecteur du DOM. Un `.value`
 * sur null, et la page entière basculait sur un écran qui parlait de
 * connexion Internet — sur une TypeError.
 *
 * Rien ne l'a vu venir. `npm test` ne construit aucun DOM, et le
 * harnais navigateur ne savait jouer qu'un seul administrateur : celui
 * dont le document `admins` n'a pas de champ `role`, donc le
 * propriétaire — le seul pour qui la page marchait.
 *
 * Ce fichier joue les autres. Quatre sessions, et chacune correspond à
 * un état RÉEL de la base :
 *
 *   ordinaire      un collègue (`role: "admin"`). La fiche doit
 *                  s'ouvrir ENTIÈREMENT, sans les blocs réservés.
 *   herite         le propriétaire réel, dont le document porte
 *                  « super-admin » avec un trait d'union. Il doit
 *                  retrouver ses commandes, et le défaut doit être DIT.
 *   inconnu        un `role` que personne ne reconnaît. La fiche
 *                  s'ouvre, les droits sont refusés, et la console le
 *                  nomme — jamais de dégradation muette.
 *   lecture ratée  admins/{uid} refuse. On ne déconnecte pas : « on n'a
 *                  pas pu savoir » n'est pas « vous n'avez pas ce droit ».
 * ============================================================
 */

import { couperLeReseau, estBruitConsole } from "./hors-ligne.mjs";

const ADMIN_UID = "harnais-admin";
const ETUDIANT_UID = "harnais-etudiant-fiche";

// Un étudiant plausible : une formule active, une échéance, un profil
// assez rempli pour que chaque onglet ait quelque chose à rendre.
const ETUDIANT = {
  name: "Awa Diallo",
  email: "awa.diallo@example.org",
  plan: "conseiller-6",
  planExpiresAt: "2027-03-31",
  planPreinscription: "dossier-france",
  planPreinscriptionExpiresAt: "2027-01-15",
  createdAt: "2026-02-10",
  firstName: "Awa",
  lastName: "Diallo",
  nationality: "Sénégal",
  country: "Sénégal",
  city: "Dakar",
  lastDegree: "Licence",
  desiredField: "Informatique",
  desiredDegree: "Master",
  disabled: false,
  testerAccess: false
};

const SESSIONS = [

  {
    cle: "ordinaire",
    libelle: "administrateur ordinaire",
    adminDoc: { email: "collegue@fitz.local", nom: "Collègue", isActive: true, role: "admin" },
    reserveVisible: false,
    defautAttendu: null
  },

  {
    cle: "herite",
    libelle: "propriétaire, graphie héritée « super-admin »",
    adminDoc: { email: "proprietaire@fitz.local", isActive: true, role: "super-admin" },
    reserveVisible: true,
    defautAttendu: /graphie héritée/
  },

  {
    cle: "inconnu",
    libelle: "rôle inconnu « root »",
    adminDoc: { email: "inconnu@fitz.local", isActive: true, role: "root" },
    reserveVisible: false,
    defautAttendu: /rôle non reconnu/
  }

];

// Les phrases des trois écrans d'échec de la fiche. Aucune ne doit
// apparaître quand la fiche s'ouvre normalement.
const ECRANS_D_ECHEC = [
  "Cette fiche a rencontré une erreur interne",
  "Le serveur a refusé cette lecture",
  "Cette fiche n'a pas pu être chargée",
  "Impossible de charger cette fiche"
];

async function ouvrirLaFiche({ navigateur, base, session }) {

  const anomalies = [];
  const notes = [];

  const contexte = await navigateur.newContext({ viewport: { width: 1280, height: 900 }, locale: "fr-FR" });

  await couperLeReseau(contexte, {
    admin: {
      uid: ADMIN_UID,
      email: session.adminDoc.email,
      adminDoc: session.adminDoc,
      etudiantUid: ETUDIANT_UID,
      etudiantDoc: ETUDIANT,
      echecAdmins: session.echecAdmins === true
    }
  });

  const page = await contexte.newPage();

  const erreursPage = [];
  const messages = [];

  page.on("pageerror", (e) => erreursPage.push(e.message));
  page.on("console", (msg) => {
    if (estBruitConsole(msg.text())) return;
    if (msg.type() === "error" || msg.type() === "warning") messages.push(`${msg.type()}: ${msg.text()}`);
  });

  await page.goto(`${base}/admin/student-detail.html?uid=${ETUDIANT_UID}`, { waitUntil: "domcontentloaded" });

  // La fiche est asynchrone de bout en bout : on attend qu'elle ait
  // décidé quelque chose plutôt qu'un délai arbitraire.
  await page.waitForFunction(() => {
    const nom = document.getElementById("detailName");
    return (nom && nom.textContent.trim() && nom.textContent.trim() !== "—")
      || /erreur|refusé|pas pu|Impossible|vérifiés/i.test(document.body.innerText);
  }, { timeout: 15000 }).catch(() => {});

  const vu = await page.evaluate(() => ({
    url: window.location.pathname,
    nom: (document.getElementById("detailName")?.textContent || "").trim(),
    courriel: (document.getElementById("detailEmail")?.textContent || "").trim(),
    pastilles: (document.getElementById("detailPills")?.textContent || "").trim(),
    onglets: document.querySelectorAll(".tab-btn").length,
    reserves: document.querySelectorAll("[data-super-admin]").length,
    planSelect: document.getElementById("planSelect") ? document.getElementById("planSelect").value : null,
    statut: (document.getElementById("statusLabel")?.textContent || "").trim(),
    expiration: (document.getElementById("planExpiryStatus")?.textContent || "").trim(),
    corps: document.body.innerText
  }));

  await contexte.close();

  return { anomalies, notes, vu, erreursPage, messages };

}

async function verifierUneSession({ navigateur, base, session }) {

  const { anomalies, notes, vu, erreursPage, messages } = await ouvrirLaFiche({ navigateur, base, session });

  if (vu.url.includes("login")) {
    anomalies.push(`${session.libelle} : renvoyé à la connexion.`);
    return { anomalies, notes };
  }

  // 1. LA FICHE S'OUVRE ENTIÈREMENT. C'est le contrôle qui manquait.
  for (const phrase of ECRANS_D_ECHEC) {
    if (vu.corps.includes(phrase)) anomalies.push(`${session.libelle} : écran d'échec affiché — « ${phrase} »`);
  }

  if (vu.nom !== ETUDIANT.name) anomalies.push(`${session.libelle} : nom affiché « ${vu.nom} », attendu « ${ETUDIANT.name} ».`);
  if (vu.courriel !== ETUDIANT.email) anomalies.push(`${session.libelle} : e-mail affiché « ${vu.courriel} ».`);
  if (vu.onglets < 4) anomalies.push(`${session.libelle} : ${vu.onglets} onglet(s) rendus.`);
  if (!vu.statut) anomalies.push(`${session.libelle} : l'onglet abonnement n'a rien écrit (statut du compte vide).`);
  if (!vu.expiration) anomalies.push(`${session.libelle} : l'expiration de formule n'est pas rendue.`);

  // 2. LE RÉSERVÉ EST RETIRÉ, PAS MASQUÉ — et il est bien là pour qui y
  //    a droit, y compris avec la graphie héritée.
  if (session.reserveVisible && vu.reserves === 0) {
    anomalies.push(`${session.libelle} : aucun bloc réservé rendu — le propriétaire a perdu ses commandes.`);
  }
  if (!session.reserveVisible && vu.reserves > 0) {
    anomalies.push(`${session.libelle} : ${vu.reserves} bloc(s) réservé(s) laissés dans le DOM.`);
  }

  if (session.reserveVisible) {
    if (vu.planSelect !== ETUDIANT.plan) anomalies.push(`${session.libelle} : le sélecteur de formule vaut « ${vu.planSelect} », attendu « ${ETUDIANT.plan} ».`);
  } else if (vu.planSelect !== null) {
    anomalies.push(`${session.libelle} : le sélecteur de formule est encore dans le DOM.`);
  }

  // 3. AUCUNE DÉGRADATION MUETTE.
  const defauts = messages.filter((m) => m.includes("Document admins/"));

  if (session.defautAttendu) {
    if (!defauts.some((m) => session.defautAttendu.test(m))) {
      anomalies.push(`${session.libelle} : le défaut de rôle n'est pas signalé en console (${defauts.length} message(s) vus).`);
    }
  } else if (defauts.length) {
    anomalies.push(`${session.libelle} : un défaut de rôle est signalé alors que le document est sain — ${defauts[0]}`);
  }

  // 4. RIEN N'A CASSÉ EN SILENCE.
  for (const m of erreursPage) anomalies.push(`${session.libelle} : exception JavaScript — ${m}`);
  for (const m of messages.filter((x) => x.startsWith("error:"))) {
    anomalies.push(`${session.libelle} : erreur console — ${m}`);
  }

  notes.push(`${session.cle} : fiche ouverte (« ${vu.nom} », ${vu.onglets} onglets, ${vu.reserves} bloc(s) réservé(s)) — ${vu.pastilles.replace(/\s+/g, " ").slice(0, 60)}`);

  return { anomalies, notes };

}

/**
 * Le quatrième cas n'a pas la même forme : la lecture de admins/{uid}
 * ÉCHOUE. La page ne doit pas déconnecter — elle doit dire qu'elle n'a
 * pas pu savoir, et nommer le code.
 */
async function verifierLectureRatee({ navigateur, base }) {

  const anomalies = [];
  const notes = [];

  const session = {
    cle: "lecture-ratee",
    libelle: "lecture de admins refusée",
    adminDoc: { email: "proprietaire@fitz.local", isActive: true },
    echecAdmins: true
  };

  const { vu, messages } = await ouvrirLaFiche({ navigateur, base, session });

  if (vu.url.includes("login")) {
    anomalies.push("lecture ratée : l'administrateur a été renvoyé à la connexion — « on n'a pas pu savoir » a été rendu comme « vous n'avez pas ce droit ».");
  }

  if (!/n'ont pas pu être vérifiés/.test(vu.corps)) {
    anomalies.push("lecture ratée : l'écran ne dit pas que les droits n'ont pas pu être vérifiés.");
  }

  if (!vu.corps.includes("permission-denied")) {
    anomalies.push("lecture ratée : le code de l'erreur n'est pas nommé à l'écran.");
  }

  if (/Vérifiez votre connexion Internet/.test(vu.corps)) {
    anomalies.push("lecture ratée : l'écran parle de connexion Internet sur un refus du serveur.");
  }

  if (!messages.some((m) => m.includes("permission-denied"))) {
    anomalies.push("lecture ratée : rien dans la console ne nomme l'erreur.");
  }

  notes.push(`lecture-ratee : ni déconnexion ni silence — « ${(vu.corps.match(/[^\n]*n'ont pas pu être vérifiés[^\n]*/) || [""])[0].trim().slice(0, 110)} »`);

  return { anomalies, notes };

}

export async function verifierControlCenter({ navigateur, base }) {

  const anomalies = [];
  const notes = [];

  for (const session of SESSIONS) {
    const r = await verifierUneSession({ navigateur, base, session });
    anomalies.push(...r.anomalies);
    notes.push(...r.notes);
  }

  const r = await verifierLectureRatee({ navigateur, base });
  anomalies.push(...r.anomalies);
  notes.push(...r.notes);

  return { anomalies, notes };

}
