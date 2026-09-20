/**
 * ============================================================
 * js/champs-guides.js — un champ vide ne doit jamais faire douter
 * ============================================================
 *
 * Lot R3 (2026-09-17), demande de Charles : « pas de question complexe,
 * chaque case doit guider l'étudiant ou lui donner un exemple ».
 *
 * DEUX COMPOSANTS, UN SEUL ENDROIT
 * --------------------------------
 *  1. LES EXEMPLES (`.fitz-chips`) — deux à huit réponses courantes,
 *     posées sous le champ. Un clic les écrit dans le champ ; le texte
 *     libre reste toujours possible. Ce sont des EXEMPLES, jamais une
 *     liste fermée : on n'enferme pas un étudiant dont le diplôme ne
 *     figure pas dans notre table.
 *  2. LE CHAMP À SUGGESTIONS (`.fitz-suggest`) — un input et une liste
 *     crème qui se filtre en tapant, au clavier comme au doigt. Il
 *     remplace le `<datalist>` du navigateur, dont le panneau noir du
 *     système n'a ni la police ni les couleurs du site (règle du lot
 *     CONTRÔLES-UNIFIÉS, 2026-09-11).
 *
 * POURQUOI ICI, ET PAS DANS CHAQUE PAGE
 * -------------------------------------
 * La route (espace-preinscription.js) et le profil (profile.js) posent
 * la même question — « dans quel domaine ? », « quel dernier diplôme ? »
 * — et doivent proposer les mêmes exemples. Deux tables auraient
 * divergé au premier ajout. Les libellés vivent donc ici, avec les
 * deux composants qui les affichent, et `css/guide.css` les habille.
 *
 * MARQUAGE MINIMAL. Une page déclare `data-exemples="domaine"` sur un
 * input, appelle `brancherChampsGuides(racine)` une fois, et c'est
 * tout : les pastilles sont créées, branchées, et ne se dupliquent pas
 * si la fonction est rappelée (rendu dynamique, changement de palier).
 * ============================================================
 */

/**
 * LES PASTILLES SONT COURTES — HUIT AU PLUS.
 *
 * Constaté à l'écran le 2026-09-17 : dix-huit pastilles sous un champ
 * placé dans une colonne de grille tombaient sur douze rangées et
 * poussaient la question suivante hors de l'écran. Une pastille est un
 * RACCOURCI ; au-delà de huit propositions, c'est une liste, et une
 * liste se cherche en tapant — voir LISTES ci-dessous.
 */
export const EXEMPLES = {
  specialisation: ["Cybersécurité", "Développement web", "Finance d'entreprise", "Droit des affaires", "Santé publique", "Énergies renouvelables", "Logistique", "Ressources humaines"],
  diplome: ["Baccalauréat (en cours)", "Baccalauréat (obtenu)", "Licence 1", "Licence 2", "Licence 3", "BTS", "DUT / BUT", "Master"],
  budget: ["300 000 F CFA", "450 000 F CFA", "600 000 F CFA", "800 000 F CFA", "600 €", "900 €", "1 200 €"],
  etablissement: ["Lycée public", "Lycée privé", "Université publique", "Université privée", "École d'ingénieurs", "Institut supérieur"],
  serieBac: ["S1", "S2", "S3", "L1", "L2", "G (gestion)", "F (technique)", "Série C"],
  mention: ["Passable", "Assez bien", "Bien", "Très bien"],
  matieres: ["Mathématiques", "Physique-Chimie", "Français", "Anglais", "Philosophie", "Histoire-Géo", "SVT / Biologie", "Informatique"],
  langueTest: ["B2", "C1", "TCF 450", "DELF B2", "IELTS 6.5", "TOEFL 90"]
};

/**
 * LES LISTES LONGUES — cherchées en tapant, jamais posées en pastilles.
 * Le champ garde sa saisie libre : la liste propose, elle n'impose pas.
 *
 * `formation` COUVRE CHAQUE DOMAINE DE `domaine` (2026-09-17). Constaté
 * pendant la recette de la route, à l'étape 3 : « licence psy » ne
 * proposait RIEN. La liste, écrite d'un trait, n'avait que de
 * l'informatique, du droit, de l'économie et du génie — alors que
 * `domaine` proposait déjà Psychologie, Communication, Journalisme,
 * Agronomie, Tourisme. Un étudiant qui ne trouve pas son mot croit que
 * sa formation n'existe pas ici ; c'est exactement la confusion que
 * cette refonte doit supprimer.
 *
 * La règle, gardée par un test : tout domaine de `domaine` a au moins
 * une formation dont le libellé le nomme. Ajouter un domaine oblige
 * donc à lui donner une formation — pas de domaine muet.
 */
export const LISTES = {
  domaine: ["Informatique", "Droit", "Économie / Gestion", "Médecine / Santé", "Ingénierie", "Mathématiques", "Physique / Chimie", "Biologie", "Lettres / Langues", "Sciences politiques", "Architecture", "Commerce / Marketing", "Comptabilité / Finance", "Psychologie", "Communication", "Agronomie", "Génie civil", "Data / Intelligence artificielle", "Statistiques", "Journalisme", "Tourisme / Hôtellerie", "Mines / Pétrole"],
  formation: [
    "Licence Informatique", "Licence Droit", "Licence Économie et gestion", "Licence Mathématiques",
    "Licence Physique / Chimie", "Licence Biologie", "Licence Sciences de la vie", "Licence Psychologie",
    "Licence Sociologie", "Licence LEA (langues)", "Licence Lettres modernes", "Licence Histoire / Géographie",
    "Licence Sciences politiques", "Licence Sciences de l'éducation", "Licence Information et communication",
    "Licence Comptabilité et finance", "Licence Statistiques", "Licence Sciences de la Terre (mines, pétrole)",
    "Licence STAPS (sport)", "Licence Arts",
    "BUT Informatique", "BUT Génie civil", "BUT Génie électrique", "BUT Techniques de commercialisation",
    "BUT Gestion des entreprises", "BUT Information-communication", "BUT Génie biologique", "BUT Réseaux et télécommunications",
    "Master Informatique", "Master Data science / Intelligence artificielle", "Master Droit des affaires", "Master Finance",
    "Master Marketing", "Master Management", "Master Économie", "Master Génie civil",
    "Master Santé publique", "Master Psychologie", "Master Journalisme", "Master Communication",
    "Master Agronomie", "Master Tourisme et hôtellerie", "Master Architecture", "Master Statistiques",
    "Diplôme d'ingénieur", "Diplôme d'architecte", "Études de médecine (PASS / L.AS)", "Études de pharmacie"
  ]
};

/** Les sources d'un champ à suggestions, par clé de `data-suggest`. */
export const SOURCES = {
  formation: () => LISTES.formation,
  domaine: () => LISTES.domaine
};

const HTML_ECHAPPE = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };
function ech(v) {
  return String(v == null ? "" : v).replace(/[&<>"]/g, (c) => HTML_ECHAPPE[c]);
}

/** Le texte sans accent ni casse — pour filtrer « senegal » sur « Sénégal ». */
export function sansAccent(t) {
  return String(t || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

/**
 * LA VALEUR TAPÉE REVIENT À SA FORME DU RÉFÉRENTIEL — à l'enregistrement.
 *
 * Constaté en ligne le 2026-09-18, étape 1 de la route : « senegal »
 * tapé sans cliquer la suggestion est parti en base tel quel, minuscule
 * et sans accent, avec le message « Votre situation est enregistrée ».
 * Le clic sur la suggestion canonise bien (la liste écoute `mousedown`,
 * voir plus bas) — le chemin qui blesse est celui du téléphone, où le
 * clavier cache la liste et où l'étudiant enregistre directement.
 *
 * En aval, trouverProcedure() tolère les trois graphies (vérifié), mais
 * les prompts recevaient « Cet étudiant vient de : senegal », et tout
 * consommateur à correspondance exacte restait exposé.
 *
 * La règle est STRICTE : seule une égalité complète, accents et casse
 * mis à part, ramène à l'entrée du référentiel. Pas de préfixe unique —
 * « guine » ne doit pas choisir entre la Guinée, la Guinée-Bissau et la
 * Guinée équatoriale à la place de l'étudiant. Une valeur qui ne
 * correspond à rien reste telle que tapée : la liste propose, elle
 * n'impose pas (règle des composants de ce fichier), et refuser
 * d'enregistrer bloquerait un étudiant pour une faute de frappe.
 *
 * @param {string} valeur - ce que le champ contient à l'enregistrement
 * @param {string[]} liste - le référentiel (COUNTRY_NAMES, LISTES...)
 * @returns {string} l'entrée du référentiel, ou la valeur épurée telle quelle
 */
export function canoniser(valeur, liste) {
  const propre = String(valeur || "").trim();
  if (!propre) return propre;
  const cible = sansAccent(propre);
  const exacte = (Array.isArray(liste) ? liste : []).find((c) => sansAccent(c) === cible);
  return exacte || propre;
}

/**
 * Les pastilles d'exemples d'un champ, en HTML.
 * @param {string} cle - le nom du champ visé (attribut `name`, ou un id)
 * @param {string[]} liste - les exemples ; vide ou absent ⇒ chaîne vide
 */
/**
 * LA RANGÉE DIT CE QU'ELLE EST (lot R18, 2026-09-18).
 *
 * Charles, le 2026-09-18, devant « Mon profil » : sous « Série /
 * filière » il avait tapé « serie littéraire », et lisait dessous
 * « S1 S2 S3 L1 L2 » — deux façons de répondre à une seule question.
 * Sous « Votre établissement », où il avait écrit le nom de son lycée,
 * la rangée proposait « Lycée public · Lycée privé ». Rien ne disait
 * que ces pastilles sont des EXEMPLES à recopier ou à modifier, pas la
 * liste des réponses admises.
 *
 * Le mot « Exemples » ouvre donc la rangée, à l'intérieur du bloc et
 * hors des boutons : il n'est pas cliquable, le gestionnaire ne réagit
 * qu'à `.fitz-chip`, et rien d'autre ne change.
 */
export const MOT_EXEMPLES = "Exemples";

export function htmlChips(cle, liste) {
  if (!Array.isArray(liste) || !liste.length) return "";
  const lead = `<span class="fitz-chips-lead" aria-hidden="true">${ech(MOT_EXEMPLES)}</span>`;
  return `<div class="fitz-chips" data-chips-pour="${ech(cle)}">${lead}${liste.map((v) => `<button type="button" class="fitz-chip">${ech(v)}</button>`).join("")}</div>`;
}

/** Un champ à suggestions, en HTML. `source` est une clé de SOURCES. */
export function htmlSuggest(nom, valeur, placeholder, source, extra = "") {
  return `<div class="fitz-suggest" data-suggest="${ech(source)}">
    <input type="text" name="${ech(nom)}" value="${ech(valeur)}" placeholder="${ech(placeholder)}" autocomplete="off" role="combobox" aria-expanded="false" aria-autocomplete="list"${extra ? ` ${extra}` : ""}>
    <ul class="fitz-suggest-liste" hidden></ul>
  </div>`;
}

/** Le champ que des pastilles remplissent : par `name`, sinon par id. */
function champDe(racine, cle) {
  return racine.querySelector(`[name="${cle}"]`) || racine.querySelector(`#${cle}`);
}

/**
 * Branche tout ce qui est guidé sous `racine` :
 *   - `[data-exemples="cle"]` → les pastilles de EXEMPLES[cle], créées
 *     juste après le champ (ou après son enveloppe `.input-wrap`) ;
 *   - `.fitz-suggest` → la liste filtrée, clavier et souris.
 *
 * Idempotent : un second appel ne double rien.
 *
 * @param {ParentNode} racine
 * @param {Object} [sources] - sources supplémentaires, par clé
 *   (`{ pays: () => [...] }`) ; elles complètent SOURCES sans la muter.
 */
export function brancherChampsGuides(racine = document, sources = {}) {

  const toutes = { ...SOURCES, ...sources };

  // ---- 1. Les pastilles d'exemples ----
  racine.querySelectorAll("[data-exemples]").forEach((champ) => {

    const cle = champ.getAttribute("data-exemples");
    const liste = EXEMPLES[cle];
    if (!liste || champ.dataset.exemplesPretes === "1") return;

    const nom = champ.getAttribute("name") || champ.id || cle;
    const ancre = champ.closest(".input-wrap") || champ;
    ancre.insertAdjacentHTML("afterend", htmlChips(nom, liste));
    champ.dataset.exemplesPretes = "1";

  });

  racine.querySelectorAll(".fitz-chips").forEach((bloc) => {

    if (bloc.dataset.branche === "1") return;
    bloc.dataset.branche = "1";

    const cible = champDe(racine, bloc.getAttribute("data-chips-pour"));
    if (!cible) return;

    bloc.addEventListener("click", (ev) => {
      const chip = ev.target.closest(".fitz-chip");
      if (!chip) return;
      cible.value = chip.textContent;
      // Les pages qui recalculent sur `input` (score du profil, état de
      // la route) doivent apprendre le changement : un clic n'émet rien.
      cible.dispatchEvent(new Event("input", { bubbles: true }));
      cible.dispatchEvent(new Event("change", { bubbles: true }));
      marquerChoisie(bloc, chip);
      cible.focus();
    });

    // Une valeur déjà saisie allume sa pastille.
    const deja = [...bloc.querySelectorAll(".fitz-chip")].find((c) => c.textContent === String(cible.value || "").trim());
    if (deja) marquerChoisie(bloc, deja);

  });

  // ---- 2. Les champs à suggestions ----
  racine.querySelectorAll(".fitz-suggest").forEach((bloc) => {

    if (bloc.dataset.branche === "1") return;
    bloc.dataset.branche = "1";

    const input = bloc.querySelector("input");
    const liste = bloc.querySelector(".fitz-suggest-liste");
    if (!input || !liste) return;

    const source = toutes[bloc.getAttribute("data-suggest")] || (() => []);
    let actif = -1;

    function fermer() {
      liste.hidden = true;
      liste.innerHTML = "";
      input.setAttribute("aria-expanded", "false");
      actif = -1;
    }

    function ouvrir() {
      const q = sansAccent(input.value.trim());
      const tout = source() || [];
      const trouves = (q ? tout.filter((v) => sansAccent(v).includes(q)) : tout).slice(0, 8);
      if (!trouves.length) { fermer(); return; }
      liste.innerHTML = trouves.map((v) => `<li role="option">${ech(v)}</li>`).join("");
      liste.hidden = false;
      input.setAttribute("aria-expanded", "true");
      actif = -1;
    }

    function choisir(texte) {
      input.value = texte;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
      fermer();
    }

    input.addEventListener("input", ouvrir);
    input.addEventListener("focus", ouvrir);

    input.addEventListener("keydown", (ev) => {
      const items = [...liste.querySelectorAll("li")];
      if (!items.length) return;
      if (ev.key === "ArrowDown" || ev.key === "ArrowUp") {
        ev.preventDefault();
        actif = ev.key === "ArrowDown" ? Math.min(actif + 1, items.length - 1) : Math.max(actif - 1, 0);
        items.forEach((li, i) => li.classList.toggle("is-actif", i === actif));
        items[actif].scrollIntoView({ block: "nearest" });
      } else if (ev.key === "Enter" && actif >= 0) {
        ev.preventDefault();
        choisir(items[actif].textContent);
      } else if (ev.key === "Escape") {
        fermer();
      }
    });

    // `mousedown` et non `click` : le `blur` du champ arrive avant le
    // `click` et fermerait la liste sous le doigt.
    liste.addEventListener("mousedown", (ev) => {
      const li = ev.target.closest("li");
      if (!li) return;
      ev.preventDefault();
      choisir(li.textContent);
    });

    input.addEventListener("blur", () => setTimeout(fermer, 120));

  });

}

function marquerChoisie(bloc, chip) {
  bloc.querySelectorAll(".fitz-chip").forEach((c) => c.classList.toggle("is-choisie", c === chip));
}

/**
 * Ce qui cloche dans les tables d'exemples — utilisé par le test.
 * Un exemple doit être COURT (il tient dans une pastille) et unique.
 */
export function defautsDesExemples(tables = EXEMPLES) {
  const defauts = [];
  for (const [cle, liste] of Object.entries(tables)) {
    if (!Array.isArray(liste) || liste.length < 2) { defauts.push(`${cle} : moins de deux exemples`); continue; }
    if (liste.length > 8) defauts.push(`${cle} : ${liste.length} pastilles — au-delà de huit, c'est une liste (LISTES + data-suggest)`);
    if (new Set(liste).size !== liste.length) defauts.push(`${cle} : un exemple en double`);
    for (const v of liste) {
      if (typeof v !== "string" || !v.trim()) defauts.push(`${cle} : un exemple vide`);
      else if (v.length > 34) defauts.push(`${cle} : « ${v} » est trop long pour une pastille`);
    }
  }
  return defauts;
}
