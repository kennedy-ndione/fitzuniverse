/**
 * ============================================================
 * admin/verification.js — vérifier une bourse à sa source
 * ============================================================
 *
 * LOT P5b (2026-09-19). L'écran qui rafraîchit le catalogue.
 *
 * LA LIGNE QU'IL NE FRANCHIT PAS
 * -------------------------------
 * admin/radar.js explique pourquoi ce projet a refusé, jusqu'ici, un
 * robot qui réécrirait les dates : « il transformerait "on ne sait
 * pas" en une date affirmée ». Cet écran garde cette règle et déplace
 * seulement le travail pénible :
 *
 *   la MACHINE lit la page officielle et rapporte ce qu'elle y a lu,
 *   avec la phrase exacte et le lien ;
 *   L'HUMAIN décide d'écrire, ou non.
 *
 * Rien n'est écrit sans un clic, aucune date n'est proposée si la
 * phrase citée ne la porte pas (functions/lib/verification-bourse.js),
 * et le statut n'est JAMAIS modifié par défaut — fermer une bourse
 * retire des propositions à des étudiants, ça se décide à la main.
 *
 * L'ORDRE DE TRAVAIL VIENT DU RADAR, pas d'un second classement :
 * js/radar.js sait déjà quelles bourses sont les plus risquées et les
 * plus exposées. Une seconde façon de trier, c'est une seconde vérité.
 * ============================================================
 */

import { chargerCatalogue, genereLeCatalogue } from "../js/catalog-data.js";
import { construireRadar } from "../js/radar.js";
import { app, db } from "../firebase-config.js";
import { doc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

const REGION = "europe-west1";

const bouton = document.getElementById("verifBtn");
const journal = document.getElementById("verifLog");
const resultat = document.getElementById("verifResult");
const panneau = document.getElementById("verifPanneau");

let catalogue = null;
let programmesParBourse = new Map();

function log(texte, classe = "") {
  journal.classList.add("is-visible");
  journal.innerHTML += classe ? `<span class="${classe}">${ech(texte)}</span>\n` : `${ech(texte)}\n`;
  journal.scrollTop = journal.scrollHeight;
}

function ech(texte) {
  const div = document.createElement("div");
  div.textContent = String(texte ?? "");
  return div.innerHTML;
}

/** Ce que le catalogue sait DÉJÀ de la fraîcheur d'une bourse. */
function fraicheurDe(bourseId) {
  const programmes = programmesParBourse.get(bourseId) || [];
  const verifies = programmes.filter((p) => p.ouverteVerifieeLe);
  if (!verifies.length) return { texte: "jamais vérifiée", classe: "is-jamais" };
  const derniere = verifies.map((p) => p.ouverteVerifieeLe).sort().pop();
  return { texte: `vérifiée le ${derniere}`, classe: "" };
}

async function appelerVerification(scholarshipId) {
  const { getFunctions, httpsCallable } = await import(
    "https://www.gstatic.com/firebasejs/11.10.0/firebase-functions.js"
  );
  const appeler = httpsCallable(getFunctions(app, REGION), "verifierBourse");
  const reponse = await appeler({ scholarshipId });
  return reponse.data;
}

/* ------------------------------------------------------------------
   L'ÉCRITURE — le seul endroit de cet écran qui touche au catalogue
   ------------------------------------------------------------------ */
async function ecrire(proposition, choixStatut, epingler = false) {

  const programmes = programmesParBourse.get(proposition.scholarshipId) || [];

  if (!programmes.length) {
    log("Aucun programme rattaché à cette bourse : rien à écrire.", "warn");
    return;
  }

  const champs = {
    ouverteVerifieeLe: proposition.lueLe,
    sourceVerification: {
      url: proposition.url,
      citation: proposition.citation,
      // L'IDENTIFIANT DE COMPTE, JAMAIS L'ADRESSE.
      //
      // FUITE TROUVÉE À LA PREMIÈRE ÉCRITURE RÉELLE, le 2026-09-19 :
      // cette ligne écrivait `currentUser.email`. Or firestore.rules
      // dit `match /programs/{programId} { allow read: if true; }` —
      // LECTURE PUBLIQUE. L'adresse personnelle de Charles devenait
      // lisible par n'importe qui, sans compte, et partait en plus
      // dans assets/data/catalogue.json que sert Hosting.
      //
      // J'ai écrit « traçabilité » sans relire les règles de la
      // collection dans laquelle j'écrivais. L'uid trace aussi bien —
      // admins/{uid} dit qui c'est, et lui n'est pas public.
      parUid: getAuth(app).currentUser?.uid || "",
      le: serverTimestamp()
    }
  };

  // La date : seulement si elle a survécu à la garde « citée »…
  if (proposition.deadlineISO) champs.deadlineISO = proposition.deadlineISO;

  // …ou si un humain a coché la case de l'échéance récurrente. Jamais
  // d'office : la case est décochée au chargement, et elle n'existe
  // que quand la page énonce une règle annuelle sans écrire d'année.
  else if (proposition.recurrente && document.getElementById("verifRecurrente")?.checked) {
    champs.deadlineISO = proposition.recurrente.deadlineISO;
  }

  // Le portail : seulement s'il y en a un.
  if (proposition.portail) champs.portailVerifie = proposition.portail;

  // LE STATUT NE BOUGE QUE SUR DÉCISION EXPLICITE. Le défaut est
  // « ne pas toucher » : fermer une bourse la retire des propositions
  // de tous les étudiants concernés.
  if (choixStatut === "Ouverte" || choixStatut === "Fermée") champs.status = choixStatut;

  let ecrits = 0;

  for (const programme of programmes) {
    try {
      await updateDoc(doc(db, "programs", programme.id), champs);
      ecrits += 1;
    } catch (erreur) {
      log(`Échec sur ${programme.id} : ${erreur.message}`, "err");
    }
  }

  /* LOT P5c : ÉPINGLER LA PAGE QUI A RÉELLEMENT PORTÉ LA DATE.
     Quand Fitz a dû suivre un lien pour la trouver, l'adresse du
     catalogue n'est pas la bonne. On l'enregistre sur la BOURSE (pas
     sur les programmes : c'est une propriété de la bourse), et la
     vérification suivante partira directement du bon endroit — sans
     redépenser un aller-retour pour redeviner le même lien.
     `officialWebsite` n'est PAS touché : il reste la page de
     présentation, celle qu'on montre à l'étudiant. */
  if (epingler && proposition.url) {
    try {
      await updateDoc(doc(db, "scholarships", proposition.scholarshipId), { pageEcheance: proposition.url });
      log(`Page d'échéance épinglée : ${proposition.url}`, "ok");
    } catch (erreur) {
      log(`Impossible d'épingler la page : ${erreur.message}`, "err");
    }
  }

  log(`${ecrits} programme(s) mis à jour pour « ${proposition.titre} ».`, "ok");
  if (choixStatut === "Ouverte" || choixStatut === "Fermée") log(`Statut écrit : ${choixStatut}`, "ok");
  log("L'instantané public (assets/data/catalogue.json) doit être régénéré pour que le site le voie.", "warn");

  // La mémoire locale suit, pour que la ligne se mette à jour sans
  // recharger toute la page.
  for (const programme of programmes) {
    programme.ouverteVerifieeLe = champs.ouverteVerifieeLe;
    if (champs.deadlineISO) programme.deadlineISO = champs.deadlineISO;
  }
  rendreTable();

}

/* ------------------------------------------------------------------
   LE PANNEAU DE DÉCISION
   ------------------------------------------------------------------ */
/* CE QUE FITZ A VU QUAND IL N'A RIEN TROUVÉ.

   Le 2026-09-19, quatre bourses n'ont rendu aucune date et aucune n'a
   suivi de lien. Comprendre pourquoi a demandé d'ouvrir chaque page à
   la main dans un navigateur : une demi-heure, pour trois causes
   différentes — un domaine voisin, un vocabulaire italien manquant, et
   une troisième toujours inexpliquée. Un outil qui ne dit pas ce qu'il
   a vu fait payer chaque échec en enquête.

   LES PISTES HORS DOMAINE NE SONT JAMAIS SUIVIES AUTOMATIQUEMENT, et
   c'est un choix : sortir du site du catalogue sans surveillance est
   le seul endroit où cet outil pourrait se mettre à lire n'importe
   quoi. On les montre, vous cliquez. */
function rendreDiagnostic(p) {

  const d = p.diagnostic;
  if (!d || p.deadlineISO) return "";

  /* ÉPINGLER DEPUIS LE DIAGNOSTIC — le bout qui manquait.

     LazioDisco, 2026-09-19 : Fitz ne trouve aucune date sur
     laziodisco.it, mais il DÉSIGNE la bonne page, « Diritto allo
     studio — bando 2026/2027 », au meilleur score. Et l'écran ne
     proposait rien : la case d'épinglage n'apparaissait que quand
     une date avait déjà été trouvée. Le cas qui a le plus besoin
     d'être épinglé était précisément celui qu'on ne pouvait pas
     épingler.

     Chaque piste du MÊME SITE porte donc son bouton : il enregistre
     la page sur la bourse et relance aussitôt la lecture. Rien
     d'autre n'est écrit — ni date, ni statut. Les pistes hors
     domaine n'en ont pas : sortir du domaine du catalogue est une
     décision qui se prend en ouvrant la page, pas en cliquant. */
  const liste = (titre, entrees, note, epinglable = false) => !entrees.length ? "" : `
    <h4>${ech(titre)}</h4>
    ${note ? `<p class="verif-prose">${ech(note)}</p>` : ""}
    <ul class="verif-pistes">${entrees.map((e) => `
      <li><a href="${ech(e.url)}" target="_blank" rel="noopener noreferrer">${ech(e.libelle || e.url)}</a>
      <span class="verif-muet">${ech(e.url)}</span>
      ${epinglable ? `<button type="button" class="verif-epingler-piste" data-url="${ech(e.url)}">Épingler et relire</button>` : ""}</li>`).join("")}</ul>`;

  return `
    <div class="verif-diagnostic">
      <h4>Aucune date trouvée — ce que Fitz a vu</h4>
      <p class="verif-prose">${d.format === "pdf"
        ? "Ce lien sert un document PDF. Fitz l'a lu, mais un PDF ne porte pas de liens à suivre : s'il ne dit pas la date, il n'y a pas de page suivante."
        : `${d.liensExamines} lien(s) examiné(s) sur la page.${d.candidats.length ? "" : " Aucun ne ressemblait à une page de candidature."}`}</p>
      ${d.lu ? `
        <h4>Ce que Fitz a lu (${d.lu.caracteres} caractères)</h4>
        <p class="verif-prose verif-muet">Si ce texte n'est pas celui du document, l'extraction a échoué — c'est le lien du catalogue qu'il faut changer. S'il est correct mais ne porte pas de date, la page n'en donne pas.</p>
        <blockquote class="verif-extrait">${ech(d.lu.extrait)}${d.lu.caracteres > 700 ? " […]" : ""}</blockquote>` : ""}
      ${liste("Pistes sur le même site", d.candidats, "", true)}
      ${liste("Pistes sur un AUTRE site officiel", d.horsDomaine, "Fitz ne les suit pas tout seul : quitter le domaine du catalogue sans surveillance est le seul endroit où il pourrait lire n'importe quoi. Ouvrez-les vous-même.")}
    </div>`;

}

function rendrePanneau(p) {

  const programmes = programmesParBourse.get(p.scholarshipId) || [];
  const actuelle = programmes.find((x) => x.deadline)?.deadline || "(aucune)";

  panneau.innerHTML = `
    <div class="verif-fiche">

      <h3>${ech(p.titre)}</h3>
      <p class="verif-source">Page lue : <a href="${ech(p.url)}" target="_blank" rel="noopener noreferrer">${ech(p.url)}</a></p>
      ${p.viaLien ? `<p class="verif-chemin">La page du catalogue ne portait aucune date. Fitz a suivi un lien depuis <a href="${ech(p.urlDepart)}" target="_blank" rel="noopener noreferrer">${ech(p.urlDepart)}</a> — vérifiez que la page ci-dessus est bien la bonne.</p>` : ""}
      ${p.epinglee ? `<p class="verif-chemin">Page épinglée : la vérification est partie directement d'ici.</p>` : ""}

      <div class="verif-colonnes">
        <div>
          <h4>Ce que le catalogue dit</h4>
          <p class="verif-prose">${ech(String(actuelle).slice(0, 400))}</p>
        </div>
        <div>
          <h4>Ce que la page dit</h4>
          <p><strong>Date limite :</strong> ${p.deadlineISO ? ech(p.deadlineISO) : "<em>aucune date citée</em>"}</p>
          <p><strong>Statut lu :</strong> ${ech(p.statut)}</p>
          <p><strong>Portail :</strong> ${p.portail ? `<a href="${ech(p.portail)}" target="_blank" rel="noopener noreferrer">${ech(p.portail)}</a>` : "<em>aucun</em>"}</p>
        </div>
      </div>

      <div class="verif-citation">
        <h4>La phrase de la page, mot pour mot</h4>
        <blockquote>${p.citation ? ech(p.citation) : "<em>Le modèle n'a rapporté aucune phrase. Ne validez rien : allez lire la page.</em>"}</blockquote>
      </div>

      ${p.refus && p.refus.length ? `<div class="verif-refus"><h4>Écarté automatiquement</h4><ul>${p.refus.map((r) => `<li>${ech(r)}</li>`).join("")}</ul></div>` : ""}

      ${p.recurrente ? `
      <div class="verif-recurrente">
        <h4>Une échéance qui revient chaque année</h4>
        <p class="verif-prose">La page n'écrit aucune année — Fitz a donc refusé d'en déduire une date, et c'est la règle. Mais elle énonce une échéance annuelle, et la prochaine est&nbsp;: <strong>${ech(p.recurrente.deadlineISO)}</strong>.</p>
        <p class="verif-prose verif-muet">${ech(p.recurrente.regle)}</p>
        <label class="verif-epingle"><input type="checkbox" id="verifRecurrente"> Écrire ${ech(p.recurrente.deadlineISO)} comme date limite</label>
        <p class="verif-avertissement">Relisez la phrase citée ci-dessus avant de cocher. Vous validez une lecture, pas une mesure.</p>
      </div>` : ""}

      ${rendreDiagnostic(p)}

      <div class="verif-decision">
        <label>Statut à écrire
          <select id="verifStatut">
            <option value="">Ne pas toucher au statut (recommandé)</option>
            <option value="Ouverte">Ouverte</option>
            <option value="Fermée">Fermée</option>
          </select>
        </label>
        ${(p.viaLien && p.deadlineISO) ? `<label class="verif-epingle"><input type="checkbox" id="verifEpingler" checked> Épingler cette page comme page d'échéance</label>` : ""}
        <button type="button" id="verifValider">Écrire sur ${programmes.length} programme(s)</button>
        <button type="button" id="verifAnnuler" class="verif-secondaire">Ne rien écrire</button>
      </div>

      <p class="verif-avertissement">Vous écrivez ce que <strong>vous</strong> avez jugé, pas ce que la machine a proposé. Si la phrase ci-dessus ne porte pas la date, ouvrez la page et décidez vous-même.</p>

    </div>`;

  panneau.classList.add("is-visible");
  // Le panneau s'ouvre soixante lignes sous la table : sans ce
  // défilement, le clic sur « Vérifier » semble ne rien faire
  // (vu en guidant Charles le 2026-09-19).
  panneau.scrollIntoView({ behavior: "smooth", block: "start" });

  document.getElementById("verifValider").addEventListener("click", async () => {
    const choix = document.getElementById("verifStatut").value;
    const epingler = document.getElementById("verifEpingler")?.checked === true;
    panneau.classList.remove("is-visible");
    await ecrire(p, choix, epingler);
  });

  panneau.querySelectorAll(".verif-epingler-piste").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const url = btn.dataset.url;
      btn.disabled = true;
      btn.textContent = "Lecture…";
      try {
        await updateDoc(doc(db, "scholarships", p.scholarshipId), { pageEcheance: url });
        log(`Page d'échéance épinglée : ${url}`, "ok");
        const relu = await appelerVerification(p.scholarshipId);
        log(`Relecture (${relu.deadlineISO || "aucune date"} · ${relu.statut}).`, "ok");
        rendrePanneau(relu);
      } catch (erreur) {
        log(`Échec : ${erreur.message}`, "err");
        btn.disabled = false;
        btn.textContent = "Épingler et relire";
      }
    });
  });

  document.getElementById("verifAnnuler").addEventListener("click", () => {
    panneau.classList.remove("is-visible");
    log(`« ${p.titre} » : rien écrit.`);
  });

}

/* ------------------------------------------------------------------
   LA TABLE — l'ordre vient du radar
   ------------------------------------------------------------------ */
let lignesRadar = [];

function rendreTable() {

  resultat.innerHTML = `
    <table class="audit-table">
      <thead><tr>
        <th>Bourse</th><th>Risque</th><th class="audit-count">Profils</th>
        <th>Fraîcheur</th><th></th>
      </tr></thead>
      <tbody>
        ${lignesRadar.map((l) => {
          const f = fraicheurDe(l.id);
          return `<tr class="${ech(f.classe)}">
            <td>${ech(l.titre)}</td>
            <td class="verif-ton-${ech(l.ton)}">${ech(l.risqueLibelle)}</td>
            <td class="audit-count">${ech(l.vuePar)}</td>
            <td>${ech(f.texte)}</td>
            <td><button type="button" class="verif-ligne-btn" data-id="${ech(l.id)}">Vérifier</button></td>
          </tr>`;
        }).join("")}
      </tbody>
    </table>`;

  resultat.querySelectorAll(".verif-ligne-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      btn.disabled = true;
      btn.textContent = "Lecture…";
      log(`Lecture de la page officielle de « ${id} »…`);
      try {
        const proposition = await appelerVerification(id);
        log(`Réponse reçue (${proposition.deadlineISO || "aucune date"} · ${proposition.statut}).`, "ok");
        rendrePanneau(proposition);
      } catch (erreur) {
        log(`Échec : ${erreur.message}`, "err");
      } finally {
        btn.disabled = false;
        btn.textContent = "Vérifier";
      }
    });
  });

}

bouton.addEventListener("click", async () => {

  bouton.disabled = true;
  journal.innerHTML = "";
  log("Chargement de l'instantané du catalogue…");

  try {

    // chargerCatalogue() rend des clés FRANÇAISES (programmes /
    // universites / bourses) ; js/radar.js travaille sur la forme de
    // l'instantané, en anglais. admin/radar.js traduit déjà ici, avec
    // le même commentaire — je ne l'avais pas fait, et la page est
    // tombée sur « catalogue.programs is not iterable » au premier
    // clic, devant Charles. Lire le voisin qui fait la même chose
    // AVANT d'écrire : c'est moins cher qu'un déploiement.
    const brut = await chargerCatalogue();

    catalogue = {
      genereLe: genereLeCatalogue() || "",
      programs: brut.programmes,
      universities: brut.universites,
      scholarships: brut.bourses
    };

    programmesParBourse = new Map();
    for (const programme of catalogue.programs) {
      if (!programme.scholarshipId) continue;
      if (!programmesParBourse.has(programme.scholarshipId)) programmesParBourse.set(programme.scholarshipId, []);
      programmesParBourse.get(programme.scholarshipId).push(programme);
    }

    log(`Instantané du ${genereLeCatalogue() || "?"} — ${catalogue.scholarships.length} bourses.`);

    const radar = construireRadar(catalogue);
    lignesRadar = (radar.lignes || []).slice(0, 60);

    log(`${lignesRadar.length} bourses à l'écran, dans l'ordre du radar.`, "ok");
    rendreTable();

  } catch (erreur) {
    log(`Impossible de charger le catalogue : ${erreur.message}`, "err");
  } finally {
    bouton.disabled = false;
  }

});
