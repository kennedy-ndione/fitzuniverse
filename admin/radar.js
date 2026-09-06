/**
 * ============================================================
 * admin/radar.js — le radar des échéances, à l'écran
 * ============================================================
 *
 * LECTURE SEULE, et ZÉRO lecture Firestore : la page passe par
 * chargerCatalogue() (js/catalog-data.js), donc par l'instantané
 * statique assets/data/catalogue.json — le fichier même que servent
 * les visiteurs. Ouvrir cette page ne coûte rien au quota.
 *
 * POURQUOI UNE PAGE PLUTÔT QU'UN ROBOT QUI CORRIGE TOUT SEUL
 * ----------------------------------------------------------
 * Un robot qui visiterait les 156 sites officiels pour réécrire les
 * dates ferait exactement ce que ce projet s'interdit depuis le début
 * (voir l'en-tête de js/echeance.js) : transformer « on ne sait pas »
 * en une date affirmée. Les champs `deadline` sont de la prose écrite
 * à la main parce qu'un humain a LU la page et jugé — « cycle annuel,
 * prochaine fenêtre estimée janvier-février 2027, dates officielles
 * non publiées ». Aucune extraction automatique ne rend cette phrase ;
 * elle en tirerait « janvier 2027 » et l'afficherait comme certaine.
 *
 * Ce qui EST automatisable, c'est le constat. Tout ce que montre cette
 * page est une fonction pure du catalogue et de la date du jour : elle
 * est donc juste à chaque ouverture, sans stockage, sans planification,
 * sans réseau vers l'extérieur. La décision d'aller vérifier reste
 * humaine — c'est la seule partie qui exige de lire une page officielle
 * et de juger.
 * ============================================================
 */

import { chargerCatalogue, genereLeCatalogue } from "../js/catalog-data.js";
import { construireRadar, bascules, RISQUES } from "../js/radar.js";

const bouton = document.getElementById("radarBtn");
const journal = document.getElementById("radarLog");
const resultat = document.getElementById("radarResult");

function log(texte, classe = "") {
  journal.classList.add("is-visible");
  journal.innerHTML += classe ? `<span class="${classe}">${texte}</span>\n` : `${texte}\n`;
  journal.scrollTop = journal.scrollHeight;
}

function echapper(texte) {
  const div = document.createElement("div");
  div.textContent = texte == null ? "" : String(texte);
  return div.innerHTML;
}

function lienBourse(ligne) {
  return ligne.site
    ? `<a href="${echapper(ligne.site)}" target="_blank" rel="noopener noreferrer">site officiel</a>`
    : `<span class="radar-muet">pas de site enregistré</span>`;
}

function tableauMouvements(titre, entrees, vide, colonne) {

  if (!entrees.length) return `<h3 class="audit-section-title">${titre}</h3><p class="audit-note">${vide}</p>`;

  const lignes = entrees.map((e) => `
<tr>
<td><strong>${echapper(e.titre)}</strong><br><span class="radar-muet">${echapper(e.pays)}${e.programmes > 1 ? ` — ${e.programmes} programmes` : ""}</span></td>
<td>${echapper(e.deadline)}</td>
<td class="audit-count">${colonne(e)}</td>
<td>${/^ouverte/i.test(e.statut || "") && e.jours < 0 ? `<span class="audit-mismatch">statut encore « Ouverte »</span>` : echapper(e.statut || "—")}</td>
<td>${e.site ? `<a href="${echapper(e.site)}" target="_blank" rel="noopener noreferrer">vérifier</a>` : "—"}</td>
</tr>`).join("");

  return `
<h3 class="audit-section-title">${titre}</h3>
<table class="audit-table">
<thead><tr><th>Bourse</th><th>Échéance en base</th><th></th><th>Statut</th><th></th></tr></thead>
<tbody>${lignes}</tbody>
</table>`;

}

function rendre(radar, mouvements) {

  const parRisque = new Map();
  for (const l of radar.lignes) parRisque.set(l.risque, (parRisque.get(l.risque) || 0) + 1);

  const resume = Object.entries(RISQUES)
    .filter(([cle]) => parRisque.get(cle))
    .map(([cle, def]) => `<li class="radar-ton-${def.ton}"><strong>${parRisque.get(cle)}</strong> — ${def.libelle}</li>`)
    .join("");

  const jamais = radar.lignes.filter((l) => !l.verifieLe).length;

  const priorites = radar.lignes.slice(0, 40).map((ligne, i) => `
<tr class="${ligne.risque === "contradiction" ? "is-empty" : ligne.ton === "warning" ? "is-thin" : ""}">
<td class="audit-count">${i + 1}</td>
<td class="audit-count">${ligne.priorite}</td>
<td><strong>${echapper(ligne.titre)}</strong><br><span class="radar-muet">${echapper(ligne.pays)}</span></td>
<td>${echapper(ligne.risqueLibelle)}${ligne.jours === null ? "" : `<br><span class="radar-muet">${ligne.jours >= 0 ? `J-${ligne.jours}` : `${-ligne.jours} jours de retard`}</span>`}</td>
<td class="audit-count">${ligne.vuePar}</td>
<td>${ligne.verifieLe ? echapper(ligne.verifieLe) : `<span class="radar-muet">jamais</span>`}</td>
<td>${lienBourse(ligne)}</td>
</tr>`).join("");

  resultat.innerHTML = `
<div class="audit-summary">
${radar.genereLe
  ? `Instantané du <strong>${echapper(radar.genereLe.slice(0, 10))}</strong>`
  : `<span class="audit-mismatch">Données lues depuis Firestore, pas depuis l'instantané</span>`} — ${radar.lignes.length} bourses.
Exposition mesurée sur ${radar.profils} profils d'étudiants (3 cycles × 12 nationalités × 10 domaines).
</div>

<ul class="radar-resume">${resume}
<li class="radar-ton-neutre"><strong>${jamais}</strong> — sans date de vérification (<code>verifieLe</code> absent)</li>
</ul>

${tableauMouvements(
  "Vient de fermer (30 derniers jours)",
  mouvements.vientDeFermer,
  "Aucune échéance n'est passée dans les trente derniers jours.",
  (e) => `${-e.jours} j`
)}

${tableauMouvements(
  "Ferme dans les 14 jours",
  mouvements.fermeBientot,
  "Aucune échéance ne tombe dans les quatorze prochains jours.",
  (e) => `J-${e.jours}`
)}

<h3 class="audit-section-title">À revérifier en priorité (40 premières sur ${radar.lignes.length})</h3>
<p class="audit-note">
Priorité = poids du risque × exposition. Une bourse vue par beaucoup de profils
et dont l'échéance se contredit passe devant une bourse que personne ne voit.
Une même visite du site officiel doit servir à TOUT relever : l'échéance, sa
source, la période d'ouverture habituelle et les exigences. C'est la même page,
autant ne l'ouvrir qu'une fois.
</p>
<table class="audit-table">
<thead><tr><th>#</th><th>Prio</th><th>Bourse</th><th>Risque</th><th>Vue par</th><th>Vérifiée le</th><th></th></tr></thead>
<tbody>${priorites}</tbody>
</table>`;

}

bouton.addEventListener("click", async () => {

  bouton.disabled = true;
  journal.innerHTML = "";
  resultat.innerHTML = "";

  try {

    log("Chargement du catalogue (instantané statique, 0 lecture Firestore)…");

    const c = await chargerCatalogue();

    // chargerCatalogue() rend des clés françaises ; js/radar.js
    // travaille sur la forme de l'instantané. On traduit ici plutôt que
    // de dupliquer le module pour deux vocabulaires.
    const catalogue = {
      genereLe: genereLeCatalogue() || "",
      programs: c.programmes,
      universities: c.universites,
      scholarships: c.bourses
    };

    log(`${catalogue.scholarships.length} bourses, ${catalogue.programs.length} programmes, ${catalogue.universities.length} universités.`, "ok");

    log("Mesure de l'exposition sur 360 profils d'étudiants… (quelques secondes)");

    // Laisse le navigateur peindre la ligne ci-dessus avant de bloquer
    // le fil pour le calcul.
    await new Promise((r) => setTimeout(r, 50));

    const debut = performance.now();
    const aujourdhui = new Date();

    const radar = construireRadar(catalogue, aujourdhui);
    const mouvements = bascules(catalogue, aujourdhui);

    log(`Radar construit en ${Math.round(performance.now() - debut)} ms.`, "ok");

    if (mouvements.vientDeFermer.length) {
      log(`${mouvements.vientDeFermer.length} échéance(s) passée(s) dans les 30 derniers jours.`, "warn");
    }

    rendre(radar, mouvements);

  } catch (erreur) {

    console.error(erreur);
    log(`Échec : ${erreur.message}`, "err");

  } finally {

    bouton.disabled = false;

  }

});
