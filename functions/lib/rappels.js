/**
 * ============================================================
 * FitzUniverse — rappels d'échéance : la logique PURE (lot 111)
 * ============================================================
 *
 * LOT 111 (2026-09-26). Audit du 26/09 : aucun rappel ne partait par
 * e-mail. Un étudiant accompagné qui ne revenait pas sur le site pouvait
 * laisser passer la date limite d'une candidature qu'il avait acceptée.
 * Décision de Charles : « on y va avec ce lot ».
 *
 * Ce module ne parle ni à Firestore ni à Brevo : il décide QUI reçoit
 * QUOI un jour donné, pour être vérifiable sous Node
 * (test/lot111-rappels.test.mjs). functions/emails.js fait le reste.
 *
 * LA RÈGLE
 *  - Seulement les candidatures DATÉES (deadline « AAAA-MM-JJ ») : une
 *    date inconnue ne se rappelle pas, elle se vérifie dans l'espace.
 *  - Seulement celles que l'étudiant porte : une carte proposée par Fitz
 *    et pas encore acceptée ne lui appartient pas encore.
 *  - Jamais une candidature déjà déposée ou qui a sa réponse.
 *  - Aux paliers J-30, J-14, J-7, J-3, J-1 et le jour même : assez tôt
 *    pour réunir une pièce ou une traduction, jamais tous les jours.
 *  - UN e-mail par étudiant et par jour, qui regroupe ses échéances.
 * ============================================================
 */

const PALIERS = [30, 14, 7, 3, 1, 0];

// Les statuts qui disent que le dossier est parti (js/journey-map.js,
// STATUTS_DEPOSES) : plus rien à rappeler.
const STATUTS_DEPOSES = ["deposee", "en_attente", "reponse_recue", "admise", "refusee", "liste_attente"];

const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

function dateISOValide(v) {
  if (typeof v !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const d = new Date(`${v}T00:00:00Z`);
  return !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
}

/** Jours entiers entre aujourd'hui et la date limite (0 = aujourd'hui). */
function joursRestants(deadlineISO, aujourdhuiISO) {
  if (!dateISOValide(deadlineISO) || !dateISOValide(aujourdhuiISO)) return null;
  return Math.round((Date.parse(`${deadlineISO}T00:00:00Z`) - Date.parse(`${aujourdhuiISO}T00:00:00Z`)) / 86400000);
}

/** La carte appartient-elle à l'étudiant ? (acceptée, ou créée par lui) */
function carteDeLEtudiant(app) {
  if (!app) return false;
  if (app.accepteeLe) return true;
  return app.isRecommendation !== true;
}

/**
 * Les rappels à envoyer aujourd'hui pour UN étudiant.
 * @param {Array<Object>} applications - documents users/{uid}/applications, avec `id`
 * @param {string} aujourdhuiISO
 * @returns {Array<{id: string, jours: number, deadline: string, universite: string, bourse: string, statut: string, piecesRestantes: number}>}
 */
function rappelsDuJour(applications, aujourdhuiISO) {
  const sortie = [];
  for (const app of Array.isArray(applications) ? applications : []) {
    if (!carteDeLEtudiant(app)) continue;
    if (STATUTS_DEPOSES.includes(app.status)) continue;
    const jours = joursRestants(app.deadline, aujourdhuiISO);
    if (jours === null || !PALIERS.includes(jours)) continue;
    const checklist = Array.isArray(app.checklist) ? app.checklist : [];
    sortie.push({
      id: String(app.id || ""),
      jours,
      deadline: app.deadline,
      universite: String(app.university || "").trim(),
      bourse: String(app.scholarship || "").trim(),
      statut: String(app.status || ""),
      piecesRestantes: checklist.filter((i) => i && i.status !== "complete").length
    });
  }
  return sortie.sort((a, b) => a.jours - b.jours);
}

/** La clé du registre : une échéance, un palier, un seul envoi. */
function cleRappel(uid, r) {
  return `${uid}_${r.id}_${r.deadline}_J${r.jours}`.replace(/[^A-Za-z0-9_-]/g, "-");
}

function dateLongue(iso) {
  const [a, m, j] = iso.split("-").map(Number);
  return `${j === 1 ? "1er" : j} ${MOIS[m - 1]} ${a}`;
}

function quand(jours) {
  if (jours === 0) return "aujourd'hui";
  if (jours === 1) return "demain";
  return `dans ${jours} jours`;
}

/** L'objet de l'e-mail : l'échéance la plus proche d'abord. */
function sujetRappel(rappels) {
  const r = rappels[0];
  const nom = r.universite || r.bourse || "votre candidature";
  if (rappels.length === 1) return r.jours === 0 ? `Date limite aujourd'hui : ${nom}` : `Date limite ${quand(r.jours)} : ${nom}`;
  return `${rappels.length} dates limites approchent, la première ${quand(r.jours)}`;
}

function echapper(s) {
  return String(s || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/** Le corps HTML (sans le gabarit, posé par functions/emails.js). */
function corpsRappel(rappels, { prenom = "", site = "https://fitzuniverse.com" } = {}) {
  const lignes = rappels.map((r) => {
    const titre = [r.universite, r.bourse].filter(Boolean).map(echapper).join(" · ") || "Votre candidature";
    const pieces = r.piecesRestantes > 0
      ? ` Il reste ${r.piecesRestantes} élément${r.piecesRestantes > 1 ? "s" : ""} à terminer dans votre dossier.`
      : "";
    return `<li style="margin:0 0 12px;"><strong>${titre}</strong><br>Date limite le ${dateLongue(r.deadline)}, ${quand(r.jours)}.${pieces}</li>`;
  }).join("");
  return `
<p style="margin:0 0 16px;">Bonjour${prenom ? " " + echapper(prenom) : ""},</p>
<p style="margin:0 0 16px;">${rappels.length > 1 ? "Des dates limites approchent" : "Une date limite approche"} pour ${rappels.length > 1 ? "des candidatures que vous suivez" : "une candidature que vous suivez"} :</p>
<ul style="margin:0 0 16px;padding-left:20px;">${lignes}</ul>
<p style="margin:0 0 16px;">Vérifiez la date sur le portail officiel : c'est elle qui fait foi. Votre dossier, vos pièces et la vérification de Fitz vous attendent dans votre espace :</p>
<p style="margin:0 0 16px;"><a href="${site}/applications.html" style="color:#8a5a00;">Ouvrir mes candidatures</a></p>
<p style="margin:0;">L'équipe FitzUniverse</p>`;
}

module.exports = { PALIERS, STATUTS_DEPOSES, dateISOValide, joursRestants, carteDeLEtudiant, rappelsDuJour, cleRappel, sujetRappel, corpsRappel, dateLongue };
