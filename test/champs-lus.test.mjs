/**
 * ============================================================
 * Lot R19 (2026-09-18) — ON NE DEMANDE QUE CE QU'ON LIT
 * ============================================================
 *
 * Charles, le 2026-09-18 : « cette partie ne doit pas être difficile à
 * remplir pour un lycéen, un nouveau bachelier, etc., et certains
 * champs qui ne sont pas importants peuvent ne plus apparaître ».
 *
 * Inventaire fait au banc d'essai, palier par palier : un lycéen voyait
 * TRENTE-TROIS champs. Puis la question qui tranche, posée à chacun des
 * cinquante-sept champs que profile.js enregistre — QUI LE LIT ?
 *
 * Trois n'étaient lus par RIEN. Ni le moteur de recommandation, ni les
 * prompts de Fitz, ni la fiche du Control Center, ni un test :
 *
 *   technicalSkills       « Compétences techniques »
 *   computerSkills        « Compétences informatiques »
 *   preferredContinents   « Continents préférés »
 *
 * Trois questions posées pour personne, dont deux dans une section
 * qu'un lycéen voit. Elles sont parties.
 *
 * LA RÈGLE QUE CE FICHIER INSTALLE, et qui vaut pour la suite : TOUT
 * CHAMP ÉCRIT PAR profile.js EST LU PAR AU MOINS UN FICHIER HORS DE
 * profile.*. Un champ n'a pas besoin d'être lu par Fitz — la fiche du
 * conseiller (admin/student-detail.js) est un lecteur légitime, un
 * conseiller humain lit le dossier. Mais un champ que personne n'ouvre
 * jamais est du temps pris à un étudiant contre rien.
 *
 * Le test refusera donc la PROCHAINE question inutile, pas seulement
 * celles d'aujourd'hui. C'est là tout son intérêt : le nettoyage d'un
 * jour se refait ; une règle tient.
 *
 * Preuves par mutation faites le 2026-09-18 :
 *   une clé « hobbies » ajoutée à buildUpdatedProfile → test 1 rouge ;
 *   la case « même numéro » retirée de profile.html → test 2 rouge ;
 *   le second sélecteur retiré de .checkbox-row → test 3 rouge ;
 *   `data-palier-champ` retiré de la spécialisation → test 4 rouge ;
 *   `isFilled(p.universityType)` remis dans la règle du score → test 5 rouge.
 *
 * Fins de ligne : tout fichier lu ici passe par .replace(/\r\n/g,"\n").
 * ============================================================
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");
const codeSeul = (f) => lire(f)
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/^\s*\/\/.*$/gm, "")
  .replace(/<!--[\s\S]*?-->/g, "");

/** Les dossiers qu'on ne parcourt pas : ni sortie, ni copie, ni dépendance. */
const IGNORES = new Set(["node_modules", ".git", ".firebase", "sauvegardes", "design-previews", "Claude outputs", "test", "scripts", "functions", "assets", ".planche-saint-denis", ".claude"]);
const EXTENSIONS = new Set([".js", ".mjs", ".html"]);
/** Les fichiers de la page elle-même : s'y lire n'est pas être lu. */
const LA_PAGE = new Set(["profile.js", "profile.html", "profile.css", "_banc-profil.html", "_banc.html"]);

function fichiersDuSite(dossier = RACINE, sortie = []) {
  for (const nom of readdirSync(dossier)) {
    if (IGNORES.has(nom) || nom.startsWith("_banc")) continue;
    const chemin = path.join(dossier, nom);
    if (statSync(chemin).isDirectory()) { fichiersDuSite(chemin, sortie); continue; }
    if (!EXTENSIONS.has(path.extname(nom)) || LA_PAGE.has(nom)) continue;
    sortie.push(chemin);
  }
  return sortie;
}

/** Les clés que buildUpdatedProfile enregistre, telles qu'elles partent en base. */
function clesEnregistrees() {
  const src = lire("profile.js");
  const i = src.indexOf("const updated = {");
  const j = src.indexOf("\n};", i);
  assert.ok(i > -1 && j > i, "buildUpdatedProfile a changé de forme : ce test ne sait plus lire les clés");
  const bloc = src.slice(i, j);
  const cles = new Set();
  for (const m of bloc.matchAll(/(?:^|[,{]\s*|\n)([A-Za-z_][A-Za-z0-9_]*)\s*:/g)) cles.add(m[1]);
  for (const m of bloc.matchAll(/\n([A-Za-z_][A-Za-z0-9_]*),/g)) cles.add(m[1]);
  for (const m of src.matchAll(/updated\.([A-Za-z_][A-Za-z0-9_]*)\s*=/g)) cles.add(m[1]);
  cles.delete("name");   // le nom du compte, pas un champ du profil
  return [...cles].sort();
}

// ------------------------------------------------------------------

test("champs 1 — tout champ enregistré par « Mon profil » est lu quelque part", () => {

  const cles = clesEnregistrees();
  assert.ok(cles.length > 40, `seulement ${cles.length} clés trouvées : la lecture de buildUpdatedProfile a dérivé`);

  const textes = fichiersDuSite().map((f) => readFileSync(f, "utf8"));

  const orphelins = cles.filter((cle) => {
    const mot = new RegExp(`\\b${cle}\\b`);
    return !textes.some((t) => mot.test(t));
  });

  assert.deepEqual(orphelins, [],
    `ces champs sont demandés à l'étudiant et lus par personne : ${orphelins.join(", ")}. ` +
    "Soit un lecteur les utilise (Fitz, le moteur de recommandation, la fiche du conseiller), soit ils quittent la page.");

  // Les trois de ce lot ne doivent pas revenir par une autre porte.
  const page = codeSeul("profile.js") + codeSeul("profile.html");
  for (const parti of ["technicalSkills", "computerSkills", "preferredContinents"]) {
    assert.ok(!new RegExp(`\\b${parti}\\b`).test(page), `${parti} est revenu dans « Mon profil » sans lecteur`);
  }

});

test("champs 2 — le site recopie le numéro, il ne le demande plus deux fois", () => {

  const html = codeSeul("profile.html");
  const js = codeSeul("profile.js");

  assert.ok(/id="whatsappMeme"/.test(html), "la case « même numéro » a disparu");
  assert.ok(/id="whatsappChamp"/.test(html), "le champ WhatsApp n'a plus d'enveloppe à masquer");

  // L'ancienne consigne — « Recopiez-le » — n'a plus lieu d'être : c'est
  // le travail que la case fait.
  assert.ok(!/Recopiez-le/i.test(html), "la page demande encore à l'étudiant de recopier son numéro");

  // Cochée, elle masque le champ ET le tient à jour : sans le second
  // branchement, changer d'indicatif après avoir coché laisserait un
  // WhatsApp faux en base.
  assert.ok(/bloc\.hidden = case_\.checked;/.test(js), "la case ne masque pas le champ");
  assert.ok(/tel\.elements\.national\.addEventListener\("input", recopier\)/.test(js),
    "le numéro WhatsApp ne suit pas les corrections du téléphone");
  assert.ok(/tel\.elements\.select\.addEventListener\("change", recopier\)/.test(js),
    "le numéro WhatsApp ne suit pas un changement d'indicatif");

  // Un champ masqué ne se valide pas : on ne peut pas mettre le curseur
  // dans un champ qu'on ne voit pas.
  assert.ok(/if \(id === "whatsapp" && document\.getElementById\("whatsappChamp"\)\?\.hidden\) continue;/.test(js),
    "l'enregistrement valide encore un champ masqué");

});

test("champs 3 — les cases à cocher de la page gagnent leur mise en page", () => {

  // MESURÉ AU BANC D'ESSAI, pas lu : toutes les cases de « Mon profil »
  // s'affichaient en display:block avec un écart RÉEL de 0 px entre la
  // case et son libellé — « ☑Bourse complète » — alors que `gap:10px`
  // était bien déclaré. « .input-group label » (0,1,1) l'emportait sur
  // « .checkbox-row » (0,1,0). Même piège que .fitz-choice, et que la
  // largeur du sélecteur au lot B5 : une règle qui perd en spécificité
  // ne s'applique à rien et ne proteste jamais.
  const css = lire("profile.css");
  assert.match(css, /\.checkbox-row,\s*\n\.input-group \.checkbox-row\{/,
    "la règle des cases à cocher n'a pas de sélecteur qui l'emporte sur « .input-group label »");

  // Et la règle qu'elle doit battre est bien là : si elle disparaissait,
  // le second sélecteur deviendrait inutile — mais la garder sans le
  // second sélecteur est le défaut qu'on répare.
  assert.match(css, /\.input-group label\{[^}]*display:block/,
    "« .input-group label » ne pose plus display:block : cette garde peut être relue");

});

test("champs 5 — aucune section n'exige une réponse que le catalogue ne peut honorer", () => {

  // LOT R20 (2026-09-18). « Type d'université » (publique / privée / les
  // deux) était EXIGÉ par la règle de la section « Préférences de
  // destination » — un étudiant restait sous les 100 % sans y répondre.
  // Or les 155 universités du catalogue n'ont AUCUN champ de statut :
  // ni dans assets/data/catalogue.json, ni dans le formulaire de
  // admin/universities.html. La préférence ne pouvait être honorée par
  // aucune version du moteur.
  //
  // Et la renseigner ne vaudrait pas la peine : public/privé est un
  // raccourci pour parler du COÛT, et le coût exact est déjà là —
  // fraisScolarite sur 145 des 155, avec source et date, exoneration
  // sur 153. Une information grossière à côté d'une information exacte
  // est une seconde version de la même règle.
  const score = codeSeul("js/profile-score.js");
  assert.ok(!/universityType/.test(score),
    "le score exige encore un type d'université que le catalogue ne connaît pas");

  const page = codeSeul("profile.html") + codeSeul("profile.js");
  assert.ok(!/universityType/.test(page), "la question du type d'université est revenue");

  // La section garde sa règle, débarrassée de cette exigence.
  assert.match(score, /Array\.isArray\(p\.preferredCountries\) && p\.preferredCountries\.length > 0,/,
    "la section « Préférences de destination » ne repose plus sur les pays souhaités");

});

test("champs 4 — le premier écran d'un lycéen ne porte plus de question de spécialiste", () => {

  const html = codeSeul("profile.html");

  // « Spécialisation » vit dans la section « Pour commencer » et suit
  // désormais le palier, comme les champs du parcours et des expériences.
  const groupe = html.slice(html.lastIndexOf("<div", html.indexOf('for="specialization"')), html.indexOf('for="specialization"'));
  assert.match(groupe, /data-palier-champ="specialization"/,
    "la spécialisation est posée à tous les paliers, y compris à un lycéen");

  // Et la règle est appliquée : sans cette ligne, l'attribut ne décide rien.
  assert.ok(/document\.querySelectorAll\('#sec-depart \[data-palier-champ\]'\)\.forEach\(\(el\) => \{ el\.hidden = secondaire; \}\);/.test(codeSeul("profile.js")),
    "l'attribut de palier n'est pas appliqué à la section « Pour commencer »");

});
