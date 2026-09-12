/**
 * ============================================================
 * js/radar.js — quelles bourses revérifier, et dans quel ordre
 * ============================================================
 *
 * MODULE PUR, partagé par deux appelants :
 *   - `scripts/radar-echeances.mjs`, en ligne de commande (npm run radar) ;
 *   - `admin/radar.html`, dans le Control Center.
 *
 * Il vit dans js/ et non dans scripts/ pour cette raison précise : un
 * radar en double, un pour le terminal et un pour l'écran, finirait
 * par donner deux chiffres différents le jour où l'un des deux serait
 * corrigé seul. Ici les deux surfaces lisent la MÊME fonction, les
 * mêmes poids et la même grille de profils.
 *
 * LE PROBLÈME QU'IL RÉSOUT
 * ------------------------
 * Une date de clôture se périme toute seule : personne ne la modifie,
 * elle devient simplement fausse. 156 bourses et 211 programmes datés
 * ne peuvent pas être revérifiés chaque semaine — il faut un ORDRE.
 *
 * L'ordre repose sur deux grandeurs MESURÉES, jamais estimées :
 *
 *   1. LE RISQUE — l'échéance lue avec le même module que le site
 *      (js/echeance.js), donc les mêmes seuils. Le pire cas est la
 *      CONTRADICTION : une bourse annoncée ouverte dont l'état lu est
 *      « close ». Le site s'y contredit lui-même, à l'écran.
 *
 *   2. L'EXPOSITION — combien de profils d'étudiants voient réellement
 *      cette bourse, obtenu en rejouant retenirOpportunites() (le
 *      moteur de la page de résultats) sur une grille de profils qui
 *      couvre les cycles, les continents et les domaines. Une bourse
 *      montrée à un profil sur deux mérite d'être vérifiée avant une
 *      bourse que personne ne voit.
 *
 * CE MODULE N'ÉCRIT RIEN et ne lit aucun réseau : on lui passe le
 * catalogue, il rend un rapport.
 * ============================================================
 */

import { analyserEcheance, etatAffichable, joursAvant, etatCandidature } from "./echeance.js";
import { retenirOpportunites } from "./recommend-programs.js";

/* ------------------------------------------------------------------
 * 1. La grille de profils
 * ------------------------------------------------------------------
 * « Ce site doit s'ouvrir à tout étudiant où qu'il soit » (doctrine du
 * 2026-09-04) : la grille n'est donc pas sénégalaise. Trois cycles,
 * douze nationalités sur cinq continents, dix domaines — les familles
 * reconnues par js/eligibility-pistes.js. 360 profils.
 */

export const CYCLES = ["Licence (Bachelor)", "Master", "Doctorat (PhD)"];

// NOMS DE PAYS, PAS ADJECTIFS DE NATIONALITÉ (corrigé le 2026-09-05).
//
// La question « nationality » du questionnaire enregistrait « Sénégal »,
// et results.js le transmet tel quel à scoreProgram(). Or
// isoDeNationalite() ne reconnaissait alors que les NOMS de pays et les
// codes ISO : « Sénégalaise » lui renvoyait null, donc estEligible()
// renvoyait null pour toutes les bourses à restriction, et le filtre de
// nationalité était DÉSACTIVÉ dans toute la grille. Mesuré ce jour-là :
// 0 exclusion au lieu de 33 pour un profil français, 5 pour un profil
// sénégalais.
//
// MISE À JOUR DU 2026-09-12 (lot NATIONALITÉS) : la question enregistre
// désormais le GENTILÉ — « Sénégalais(e) » — et non plus le nom du pays.
// isoDeNationalite() résout maintenant les deux formes
// (js/nationalites.js), donc cette grille reste juste telle quelle et
// mesure bien ce que vit un étudiant réel. Les noms de pays sont
// conservés ici À DESSEIN : ils sont la forme commune aux réponses
// d'avant et d'après le lot, et la plus lisible dans un rapport.
//
// Conséquence : l'exposition du radar surestimait la portée des bourses
// réservées (Commonwealth, listes fermées, programmes réservés à
// l'Afrique). Un instrument de mesure qui neutralise le filtre qu'il est
// censé mesurer donne des chiffres rassurants et faux.
export const ORIGINES = [
  "Sénégal", "Côte d'Ivoire", "Cameroun", "Maroc", "Nigeria",
  "Kenya", "France", "Roumanie", "Inde", "Brésil",
  "Vietnam", "Haïti"
];

export const DOMAINES = [
  "Informatique", "Ingénierie", "Sciences", "Médecine", "Commerce",
  "Droit", "Sciences sociales", "Lettres", "Agriculture", "Architecture"
];

export function grilleDeProfils() {

  const profils = [];

  for (const targetLevel of CYCLES) {
    for (const nationality of ORIGINES) {
      for (const desiredField of DOMAINES) {

        profils.push({
          targetLevel,
          nationality,
          desiredField,
          lastDegree: "",
          preferredCountries: [],
          languages: ["Anglais", "Français"],
          fundingGoal: "Les deux m'intéressent",
          // La tranche la plus permissive : le radar mesure ce que le
          // catalogue PEUT montrer, pas ce qu'une limite d'âge écarte.
          ageBracket: "18 – 24 ans"
        });

      }
    }
  }

  return profils;

}

/* ------------------------------------------------------------------
 * 2. Les poids du risque
 * ------------------------------------------------------------------ */

export const RISQUES = {
  contradiction: { poids: 100, libelle: "CONTRADICTION — annoncée ouverte, échéance dépassée", ton: "danger" },
  depassee: { poids: 60, libelle: "Échéance dépassée", ton: "danger" },
  critique: { poids: 45, libelle: "Ferme dans moins de 15 jours", ton: "warning" },
  // Cycle clos, mais la clôture du SUIVANT est déjà datée (ex.
  // Stipendium Hungaricum au 15 janvier 2027). Il ne manque qu'une
  // chose, et c'est la plus utile de toutes : le mois d'OUVERTURE.
  // Sans lui, l'étudiant ne sait pas quand revenir, et la fenêtre peut
  // s'ouvrir puis se refermer sans que personne l'ait vue. Pesée
  // au-dessus de « proche » parce qu'une échéance datée et lointaine
  // se surveille toute seule, alors qu'une ouverture non annoncée, non.
  pasEncoreOuverte: { poids: 35, libelle: "Pas encore ouverte — ouverture à documenter", ton: "warning" },
  proche: { poids: 30, libelle: "Ferme dans moins de 2 mois", ton: "warning" },
  sansDate: { poids: 25, libelle: "Ouverte, sans date exploitable", ton: "warning" },
  fermee: { poids: 10, libelle: "Fermée — réouverture à documenter", ton: "neutre" },
  ouverte: { poids: 5, libelle: "Ouverte, échéance lointaine", ton: "ok" }
};

/**
 * Au-delà de cette ancienneté, une vérification ne protège plus : la
 * plupart des appels annuels s'annoncent deux à trois mois avant leur
 * ouverture, et une lecture plus vieille qu'un trimestre peut avoir
 * manqué l'annonce.
 */
export const JOURS_VERIFICATION_FRAICHE = 90;

export function verificationFraiche(verifieLe, aujourdhui = new Date()) {
  if (!verifieLe || !/^\d{4}-\d{2}-\d{2}$/.test(verifieLe)) return false;
  const jours = Math.floor((aujourdhui.getTime() - new Date(`${verifieLe}T00:00:00Z`).getTime()) / 86400000);
  return jours >= 0 && jours <= JOURS_VERIFICATION_FRAICHE;
}

export function risqueDUnProgramme(program, statutBourse, aujourdhui = new Date()) {

  const echeance = analyserEcheance(program.deadline);
  const etat = etatAffichable(echeance, aujourdhui);
  const jours = joursAvant(echeance, aujourdhui);

  const annonceOuverte = (program.status || statutBourse || "").toLowerCase().startsWith("ouverte");

  // La contradiction ne tient pas à la présence d'une date : « clos le
  // 29/10/2025 » n'en produit aucune et se contredit tout autant avec
  // un statut « Ouverte ». Le critère est l'ÉTAT lu, pas le calendrier.
  if (etat === "close" && annonceOuverte) return { cle: "contradiction", jours, etat };
  if (etat === "close" && jours !== null && jours < 0) return { cle: "depassee", jours, etat };
  if (etat === "close") return { cle: "fermee", jours, etat };
  if (etat === "critique") return { cle: "critique", jours, etat };
  if (etat === "proche") return { cle: "proche", jours, etat };
  if (etat === "ouverte") return { cle: "ouverte", jours, etat };

  // « continue » et « inconnue » : pas de date exploitable.
  if (annonceOuverte) return { cle: "sansDate", jours: null, etat };

  return { cle: "fermee", jours: null, etat };

}

/* ------------------------------------------------------------------
 * 3. L'exposition
 * ------------------------------------------------------------------ */

export function mesurerExposition(catalogue, aujourdhui = new Date()) {

  const universitiesById = new Map(catalogue.universities.map((u) => [u.id, u]));
  const scholarshipsById = new Map(catalogue.scholarships.map((s) => [s.id, s]));

  const retenues = new Map();
  const detaillees = new Map();

  const profils = grilleDeProfils();

  for (const profile of profils) {

    const { retenues: selection } = retenirOpportunites({
      profile,
      programs: catalogue.programs,
      universitiesById,
      scholarshipsById,
      aujourdhui
    });

    selection.forEach((opp, rang) => {
      if (!opp.scholarshipId) return;
      retenues.set(opp.scholarshipId, (retenues.get(opp.scholarshipId) || 0) + 1);
      if (rang < 3) detaillees.set(opp.scholarshipId, (detaillees.get(opp.scholarshipId) || 0) + 1);
    });

  }

  return { retenues, detaillees, total: profils.length };

}

/* ------------------------------------------------------------------
 * 4. Le rapport
 * ------------------------------------------------------------------ */

/**
 * @param {Object} catalogue - { genereLe, programs, universities, scholarships }
 * @param {Date} [aujourdhui]
 * @returns {{genereLe:string, profils:number, lignes:Array}}
 */
export function construireRadar(catalogue, aujourdhui = new Date()) {

  const exposition = mesurerExposition(catalogue, aujourdhui);

  const programmesParBourse = new Map();

  for (const program of catalogue.programs) {
    if (!program.scholarshipId) continue;
    if (!programmesParBourse.has(program.scholarshipId)) programmesParBourse.set(program.scholarshipId, []);
    programmesParBourse.get(program.scholarshipId).push(program);
  }

  const lignes = catalogue.scholarships.map((bourse) => {

    const programmes = programmesParBourse.get(bourse.id) || [];
    const dates = programmes.filter((p) => p.deadline);

    const risques = dates.length
      ? dates.map((p) => risqueDUnProgramme(p, bourse.status, aujourdhui))
      : [risqueDUnProgramme({ deadline: "", status: bourse.status }, bourse.status, aujourdhui)];

    // Le pire cas commande : une bourse dont UN programme se contredit
    // se contredit à l'écran.
    let pire = risques.reduce((a, b) => (RISQUES[b.cle].poids > RISQUES[a.cle].poids ? b : a));

    // L'état RÉELLEMENT AFFICHÉ prime, quand il dit quelque chose que
    // la lecture programme par programme ne peut pas voir : « pas
    // encore ouverte » se déduit du couple (statut de la bourse, date
    // future), pas d'un programme isolé. Sans cette passe, le radar et
    // la carte du catalogue se contredisaient sur la bourse la plus
    // exposée du catalogue — vu à l'écran par Charles le 2026-09-05.
    const affiche = etatCandidature({
      statut: bourse.status,
      actif: bourse.isActive,
      echeances: dates.map((p) => p.deadline),
      periodeOuverture: bourse.periodeOuverture,
      verifieLe: bourse.verifieLe
    }, aujourdhui);

    if (affiche.ton === "attente" && RISQUES[pire.cle].poids < RISQUES.pasEncoreOuverte.poids) {
      pire = { cle: "pasEncoreOuverte", jours: null, etat: "attente" };
    }

    // « Échéance dépassée » veut dire : quelqu'un doit aller voir si le
    // cycle suivant est annoncé. Quand la page a été LUE il y a moins
    // de JOURS_VERIFICATION_FRAICHE jours, c'est fait : la date passée
    // reste affichée sur la fiche (c'est une information), mais elle ne
    // remonte plus en tête du radar. Sans cette passe, le lot 40 (115
    // pages lues le 2026-09-05, dont 31 cycles clos datés) aurait
    // rempli la liste de priorités avec des bourses vérifiées le jour
    // même — et le radar hebdomadaire n'aurait plus rien dit d'utile.
    if (pire.cle === "depassee" && verificationFraiche(bourse.verifieLe, aujourdhui)) {
      pire = { cle: "fermee", jours: pire.jours, etat: pire.etat };
    }

    const vue = exposition.retenues.get(bourse.id) || 0;
    const analysee = exposition.detaillees.get(bourse.id) || 0;

    // L'exposition compte double quand la bourse arrive dans les trois
    // dossiers analysés en profondeur : c'est là que l'étudiant lit la
    // date, s'y fie, et commence à travailler.
    const poidsVue = (vue + analysee) / exposition.total;

    return {
      id: bourse.id,
      titre: bourse.title,
      pays: bourse.country,
      statut: bourse.status,
      site: bourse.officialWebsite || "",
      programmes: programmes.length,
      programmesDates: dates.length,
      risque: pire.cle,
      risqueLibelle: RISQUES[pire.cle].libelle,
      // Ce que la carte du catalogue affiche vraiment pour cette
      // bourse — le radar et le site doivent toujours pouvoir être
      // confrontés ligne à ligne.
      badgeAffiche: affiche.badge,
      ton: RISQUES[pire.cle].ton,
      jours: pire.jours,
      // verifieLe reste null tant que le lot C2 ne l'a pas rempli —
      // jamais une date inventée.
      verifieLe: bourse.verifieLe || null,
      periodeOuverture: bourse.periodeOuverture || "",
      vuePar: vue,
      analyseePar: analysee,
      priorite: Math.round(RISQUES[pire.cle].poids * (1 + poidsVue * 4))
    };

  });

  lignes.sort((a, b) => (b.priorite - a.priorite) || (b.vuePar - a.vuePar) || a.titre.localeCompare(b.titre, "fr"));

  return { genereLe: catalogue.genereLe || "", profils: exposition.total, lignes };

}

/**
 * Les deux listes qui font l'intérêt d'un passage HEBDOMADAIRE : ce
 * qui vient de basculer, et ce qui va basculer. Le reste du rapport ne
 * bouge qu'au rythme des exports ; ces deux-là bougent tout seuls, avec
 * le calendrier — c'est la seule raison de repasser chaque semaine.
 */
export function bascules(catalogue, aujourdhui = new Date(), { recemment = 30, bientot = 14 } = {}) {

  const jour = 86400000;
  const passe = new Date(aujourdhui.getTime() - recemment * jour);
  const futur = new Date(aujourdhui.getTime() + bientot * jour);

  const boursesById = new Map(catalogue.scholarships.map((s) => [s.id, s]));

  const vientDeFermer = [];
  const fermeBientot = [];

  for (const program of catalogue.programs) {

    if (!program.deadline || !program.scholarshipId) continue;

    const bourse = boursesById.get(program.scholarshipId);
    if (!bourse) continue;

    const echeance = analyserEcheance(program.deadline);
    if (echeance.etat !== "datee") continue;

    const jours = joursAvant(echeance, aujourdhui);
    if (jours === null) continue;

    const entree = {
      id: bourse.id,
      titre: bourse.title,
      pays: bourse.country,
      statut: bourse.status,
      site: bourse.officialWebsite || "",
      programmeId: program.id,
      deadline: program.deadline,
      date: echeance.date,
      jours
    };

    if (jours < 0 && new Date(`${echeance.date}T00:00:00Z`) >= passe) vientDeFermer.push(entree);
    else if (jours >= 0 && new Date(`${echeance.date}T00:00:00Z`) <= futur) fermeBientot.push(entree);

  }

  // Une bourse est souvent portée par plusieurs programmes qui partagent
  // la même date (une par université partenaire). Sans ce
  // dédoublonnage, « ARES » apparaissait quatre fois de suite dans une
  // liste censée tenir en un coup d'oeil — et une liste qu'on ne lit
  // plus ne sert à rien. On garde le couple (bourse, date) et on dit
  // combien de programmes il concerne.
  const dedoublonner = (liste) => {

    const vus = new Map();

    for (const e of liste) {
      const cle = `${e.id}|${e.date}`;
      if (vus.has(cle)) vus.get(cle).programmes += 1;
      else vus.set(cle, { ...e, programmes: 1 });
    }

    return [...vus.values()];

  };

  return {
    vientDeFermer: dedoublonner(vientDeFermer).sort((a, b) => b.jours - a.jours),
    fermeBientot: dedoublonner(fermeBientot).sort((a, b) => a.jours - b.jours)
  };

}
