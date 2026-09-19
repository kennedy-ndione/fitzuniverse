/**
 * ============================================================
 * test/verification-bourse.test.mjs — proposer, jamais affirmer
 * ============================================================
 *
 * LOT P5b (2026-09-19). L'outil qui va lire les pages officielles.
 *
 * LA DOCTRINE QU'IL DOIT RESPECTER EXISTAIT AVANT LUI. admin/radar.js
 * porte, depuis sa création, l'avertissement qui explique pourquoi ce
 * projet avait refusé un tel outil :
 *
 *   « Un robot qui visiterait les 156 sites officiels pour réécrire
 *     les dates ferait exactement ce que ce projet s'interdit depuis
 *     le début : transformer "on ne sait pas" en une date affirmée.
 *     […] Aucune extraction automatique ne rend cette phrase ; elle
 *     en tirerait "janvier 2027" et l'afficherait comme certaine. »
 *
 * Ces tests tiennent les trois garde-fous qui font que cet outil n'est
 * PAS ce robot : il n'écrit rien, il refuse toute date que la phrase
 * citée ne porte pas, et « je ne sais pas » est sa réponse par défaut.
 *
 * Fins de ligne : tout fichier lu ici passe par .replace(/\r\n/g,"\n").
 * ============================================================
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");
const codeSeul = (f) => lire(f).replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/[^\n]*$/gm, "");

const requis = createRequire(import.meta.url);
const { texteDePage, dateCitee, lireProposition, lienVersLEcheance, CONSIGNE_VERIFICATION, MAX_CARACTERES_TEXTE } =
  requis(path.join(RACINE, "functions/lib/verification-bourse.js"));

/* ---------------------------------------------------------------
   1. Lire une page — sans dépendance, et sans se laisser piéger
   --------------------------------------------------------------- */

test("page 1 — le texte lisible, sans script ni style ni balise", () => {

  const html = `<html><head><style>b{color:red}</style></head>
    <body><h1>Bourse X</h1><script>var a=1;</script>
    <p>Date limite&nbsp;: <b>15&nbsp;mars&nbsp;2027</b></p>
    <!-- commentaire --></body></html>`;

  const texte = texteDePage(html);

  assert.match(texte, /Bourse X/);
  assert.match(texte, /Date limite : 15 mars 2027/);
  assert.ok(!/var a=1/.test(texte), "le JavaScript de la page n'est pas du texte");
  assert.ok(!/color:red/.test(texte), "les styles non plus");
  assert.ok(!/commentaire/.test(texte));
  assert.ok(!/<[a-z]/i.test(texte), "aucune balise ne doit survivre");

});

test("page 2 — les blocs deviennent des lignes, pas une bouillie", () => {

  const texte = texteDePage("<li>15 mars 2027</li><li>30 juin 2027</li>");

  assert.ok(texte.includes("\n"), "deux dates collées se lisent comme une seule");
  assert.match(texte, /15 mars 2027/);
  assert.match(texte, /30 juin 2027/);

});

test("page 3 — une page énorme est coupée, et le dit", () => {

  const texte = texteDePage(`<p>${"a".repeat(MAX_CARACTERES_TEXTE * 2)}</p>`);

  assert.ok(texte.length < MAX_CARACTERES_TEXTE + 100,
    "chaque millier de caractères envoyé au modèle se paie");
  assert.match(texte, /page tronquée/, "le modèle doit savoir qu'il ne voit pas tout");

});

/* ---------------------------------------------------------------
   2. LA GARDE — une date non citée n'existe pas
   --------------------------------------------------------------- */

test("citée 1 — la date doit être dans la phrase, en toutes lettres ou en chiffres", () => {

  assert.equal(dateCitee("2027-03-15", "Date limite : 15 mars 2027"), true);
  assert.equal(dateCitee("2027-03-15", "Deadline: 15 March 2027"), true, "les pages officielles sont souvent en anglais");
  assert.equal(dateCitee("2027-03-15", "Clôture le 15/03/2027"), true);
  assert.equal(dateCitee("2027-03-15", "Applications close on 2027-03-15"), true);

});

test("citée 2 — une date DÉDUITE tombe, et c'est tout l'intérêt de l'outil", () => {

  // Le cas exact décrit par admin/radar.js.
  assert.equal(dateCitee("2027-01-15", "Les candidatures ouvrent généralement à l'automne."), false);
  assert.equal(dateCitee("2027-03-15", "Clôture en mars 2027"), false,
    "un mois sans jour ne fait pas une date : le jour serait inventé");
  assert.equal(dateCitee("2027-03-15", "Date limite : 15 mars 2026"), false, "la mauvaise année");
  assert.equal(dateCitee("2027-03-15", ""), false);
  assert.equal(dateCitee("", "15 mars 2027"), false);
  assert.equal(dateCitee("15 mars 2027", "15 mars 2027"), false, "le format ISO est exigé");

});

test("citée 3 — un mois voisin ne passe pas pour le bon", () => {

  // « mai » est inclus dans « maintenant » ; « mar » dans « mardi ».
  // Si la comparaison était naïve, ces phrases valideraient une date.
  assert.equal(dateCitee("2027-05-15", "Réponse attendue maintenant, avant le 15 de 2027"), false);

});

/* ---------------------------------------------------------------
   3. La proposition — et ce qu'elle refuse, dit à voix haute
   --------------------------------------------------------------- */

test("proposition 1 — une page claire produit une proposition complète", () => {

  const p = lireProposition({
    statut: "ouverte",
    deadlineISO: "2027-03-15",
    portail: "https://exemple.org/apply",
    citation: "Applications close on 15 March 2027."
  });

  assert.deepEqual(p, {
    statut: "ouverte",
    deadlineISO: "2027-03-15",
    portail: "https://exemple.org/apply",
    citation: "Applications close on 15 March 2027.",
    refus: []
  });

});

test("proposition 2 — une date non citée est écartée, ET l'outil dit pourquoi", () => {

  const p = lireProposition({
    statut: "ouverte",
    deadlineISO: "2027-03-15",
    citation: "Les candidatures ouvrent à l'automne."
  });

  assert.equal(p.deadlineISO, "");
  assert.equal(p.refus.length, 1);
  assert.match(p.refus[0], /n'apparaît pas dans la phrase citée/,
    "sans explication, l'administrateur croira que la page ne disait rien");

});

test("proposition 3 — une date sans citation du tout est écartée aussi", () => {

  const p = lireProposition({ statut: "ouverte", deadlineISO: "2027-03-15" });

  assert.equal(p.deadlineISO, "");
  assert.match(p.refus[0], /aucune phrase source/);

});

test("proposition 4 — « je ne sais pas » est la réponse par défaut", () => {

  for (const cas of [null, undefined, {}, "texte", 42]) {
    const p = lireProposition(cas);
    assert.equal(p.statut, "inconnu");
    assert.equal(p.deadlineISO, "");
    assert.equal(p.portail, "");
  }

});

test("proposition 5 — un statut inventé ne devient pas la quinzième orthographe", () => {

  // Le champ `status` du catalogue porte déjà quatorze façons d'écrire
  // « fermée ». L'outil n'en ajoute pas.
  const p = lireProposition({ statut: "probablement ouverte", citation: "x" });

  assert.equal(p.statut, "inconnu");
  assert.match(p.refus[0], /statut .* inconnu/);

});

test("proposition 6 — un portail qui n'est pas une adresse est écarté", () => {

  // Ce champ devient un LIEN sur la carte de l'étudiant.
  const p = lireProposition({ statut: "ouverte", portail: "voir le site officiel", citation: "x" });

  assert.equal(p.portail, "");
  assert.match(p.refus[0], /ce n'est pas une adresse/);

  assert.equal(lireProposition({ portail: "https://ok.org/a", citation: "x" }).portail, "https://ok.org/a");

});

/* ---------------------------------------------------------------
   3 bis. Aller chercher la page qui porte la date (lot P5c)
   --------------------------------------------------------------- */

test("lien 1 — « How to apply » l'emporte sur « À propos »", () => {

  // MESURÉ sur les dix premières bourses : quatre n'ont rendu aucune
  // date, et TROIS pointaient vers une page profonde du site officiel
  // (JASSO à 4 niveaux, Global Korea à 3, POSTECH à 2). Ce n'étaient
  // pas des accueils mal renseignés : c'étaient des pages de
  // PRÉSENTATION. L'échéance vit un clic plus loin.
  const html = `
    <a href="/en/about">About the programme</a>
    <a href="/en/how-to-apply">How to apply</a>
    <a href="/en/news">News</a>`;

  assert.equal(lienVersLEcheance(html, "https://site.org/en/programme"),
    "https://site.org/en/how-to-apply");

});

test("lien 1 bis — le LIBELLÉ du lien pèse plus que son adresse", () => {

  // « Deadlines and dates » écrit dans le lien est un signal bien plus
  // sûr que le mot « apply » perdu dans une adresse : beaucoup de
  // sites mettent /apply/ en préfixe de tout leur espace candidat,
  // y compris des pages qui ne portent aucune date.
  // Le cas est construit pour que SEULE la pondération tranche :
  //   /z            libellé « How to apply » → 2 mots × 2 = 4
  //   /apply/…      chemin apply + application + dates → 3 × 1 = 3
  // À poids égal (1 chacun), le second gagnerait avec 3 contre 2.
  const html = `
    <a href="/z">How to apply</a>
    <a href="/apply/application/dates">Informations</a>`;

  assert.equal(lienVersLEcheance(html, "https://site.org/p"), "https://site.org/z",
    "le mot dans le libellé doit peser plus que le mot dans le chemin");

});

test("lien 2 — on ne quitte jamais le site officiel", () => {

  // L'officiel est TOUT ce qui fait la valeur de cette vérification.
  const html = `<a href="https://autre-site.org/apply">Apply now</a>`;

  assert.equal(lienVersLEcheance(html, "https://site.org/p"), "",
    "suivre un lien hors du domaine officiel ferait lire n'importe quoi");

});

test("lien 3 — la page de connexion et les mentions légales sont fuies", () => {

  // Un score naïf choisirait « Login » (le portail de candidature
  // s'appelle souvent « application login ») et lirait un formulaire
  // vide.
  for (const piege of ["/application-login", "/apply/privacy", "/apply/contact"]) {
    assert.equal(lienVersLEcheance(`<a href="${piege}">Application</a>`, "https://site.org/p"), "",
      `${piege} ne porte jamais d'échéance`);
  }

});

test("lien 4 — rien de prometteur, rien de suivi", () => {

  assert.equal(lienVersLEcheance(`<a href="/about">About</a><a href="/news">News</a>`, "https://site.org/p"), "",
    "suivre un lien au hasard coûterait un appel de modèle pour rien");
  assert.equal(lienVersLEcheance("", "https://site.org/p"), "");
  assert.equal(lienVersLEcheance("<a href='/apply'>Apply</a>", "pas une url"), "");

});

test("lien 5 — on ne retourne pas sur la page qu'on vient de lire", () => {

  const html = `<a href="/en/apply">Apply</a><a href="/en/apply/">Apply</a>`;

  assert.equal(lienVersLEcheance(html, "https://site.org/en/apply"), "",
    "la relire coûterait un second appel pour le même résultat");

});

test("lien 6 — à égalité, la page la plus courte gagne", () => {

  const html = `<a href="/apply/step-3/documents">Candidater</a><a href="/apply">Candidater</a>`;

  assert.equal(lienVersLEcheance(html, "https://site.org/p"), "https://site.org/apply",
    "« /apply » porte le calendrier, « /apply/step-3/documents » porte une liste de pièces");

});

test("lien 7 — la Cloud Function ne suit QU'UN pas, et le dit", () => {

  const js = codeSeul("functions/verification.js");

  assert.match(js, /if \(!proposition\.deadlineISO\) \{/,
    "on ne suit un lien que si la première page n'a rien donné");
  assert.match(js, /lienVersLEcheance\(html, contexte\.url\)/);

  // UN SEUL PAS. Au-delà on ne sait plus quelle page on a lue, et le
  // coût double à chaque cran.
  assert.equal((js.match(/lienVersLEcheance\(/g) || []).length, 1);

  // La page réellement lue remonte À DEUX ENDROITS, et les deux
  // comptent : le journal Cloud Functions (pour compter combien de
  // vérifications ont eu besoin d'un second saut) ET la réponse
  // rendue à l'écran (pour que l'administrateur le VOIE avant de
  // valider). En retirer un seul ne doit pas passer inaperçu.
  assert.equal((js.match(/viaLien: urlLue !== contexte\.url/g) || []).length, 2,
    "le journal ET la réponse doivent dire si un lien a été suivi");
  assert.match(js, /urlDepart: contexte\.url/);

  // Et la seconde lecture ne remplace la première que si elle APPORTE
  // quelque chose.
  assert.match(js, /if \(p2\.deadlineISO \|\| \(!proposition\.citation && p2\.citation\)\)/);

});

test("lien 8 — une page épinglée par l'administrateur prime sur le catalogue", () => {

  const js = codeSeul("functions/verification.js");

  assert.match(js, /bourse\.pageEcheance/);
  assert.match(js, /\/\^https\?:\\\/\\\/\\S\+\$\/i\.test\(epinglee\) \? epinglee : site/,
    "la page épinglée gagne, mais seulement si c'est une vraie adresse");

  const admin = codeSeul("admin/verification.js");
  assert.match(admin, /pageEcheance: proposition\.url/,
    "on épingle la page qui a VRAIMENT porté la date");
  assert.match(admin, /doc\(db, "scholarships", proposition\.scholarshipId\)/,
    "c'est une propriété de la BOURSE, pas de chacun de ses programmes");
  assert.ok(!/officialWebsite:/.test(admin),
    "officialWebsite reste la page de présentation qu'on montre à l'étudiant");

});

/* ---------------------------------------------------------------
   4. La consigne, et le branchement
   --------------------------------------------------------------- */

test("consigne 1 — le modèle reçoit l'interdiction d'estimer", () => {

  assert.match(CONSIGNE_VERIFICATION, /N'ESTIME JAMAIS/);
  assert.match(CONSIGNE_VERIFICATION, /LA CITATION DOIT CONTENIR LA DATE/);
  assert.match(CONSIGNE_VERIFICATION, /« JE NE SAIS PAS » EST UNE BONNE RÉPONSE/);
  assert.match(CONSIGNE_VERIFICATION, /coûterait une année à un étudiant/);

});

test("fonction 1 — elle est réservée aux administrateurs, et n'écrit RIEN", () => {

  const js = codeSeul("functions/verification.js");

  // Le verrou est côté serveur : une page admin ne protège pas une
  // fonction appelable depuis une console de navigateur.
  assert.match(js, /admins\/\$\{request\.auth\.uid\}/);
  assert.match(js, /isActive !== true/);

  // AUCUNE ÉCRITURE. C'est la promesse de l'outil.
  for (const interdit of ["\\.set\\(", "\\.update\\(", "\\.add\\(", "\\.delete\\("]) {
    assert.ok(!new RegExp(interdit).test(js),
      `functions/verification.js ne doit rien écrire (${interdit})`);
  }

  assert.match(js, /lireProposition/, "la garde du module pur doit être appliquée AVANT de rendre la réponse");

});

test("réseau 1 — un site qui nous refuse n'est PAS un lien mort", () => {

  // PREMIER ESSAI RÉEL, 2026-09-19 : la Chinese Government Scholarship
  // — la bourse la plus exposée du catalogue, 360 profils sur 360 — a
  // répondu 412. Le message disait « le lien du catalogue est
  // peut-être mort ». Il ne l'est pas : le site refuse les lecteurs
  // automatiques, et un humain l'ouvre très bien. Envoyer corriger un
  // lien valide est pire que ne rien dire.
  const js = codeSeul("functions/verification.js");

  assert.match(js, /code === 403 \|\| code === 412 \|\| code === 429/);
  assert.match(js, /refuse les lecteurs automatiques/);
  assert.match(js, /lisez la date à la main/,
    "un refus doit dire à l'administrateur ce qu'il lui reste à faire");

  assert.match(js, /code === 404 \|\| code === 410/);
  assert.match(js, /C'est le lien du catalogue qu'il faut corriger/);

  // L'ancien message, qui confondait les deux, ne doit plus exister.
  assert.ok(!/Le lien du catalogue est peut-être mort/.test(js));

});

test("branchement 1 — la fonction est exportée, et la page existe", () => {

  const index = codeSeul("functions/index.js");
  assert.match(index, /exports\.verifierBourse = require\("\.\/verification"\)\.verifierBourse;/,
    "LE BOUT QUI MANQUE TOUJOURS : une fonction non exportée n'est pas déployée");

  const outils = lire("admin/tools.html");
  assert.match(outils, /href="verification\.html"/,
    "un outil qu'aucun écran n'ouvre est un outil qui n'existe pas");

  const page = lire("admin/verification.html");
  assert.match(page, /src="verification\.js"/);
  assert.match(page, /src="admin-auth\.js"/, "la page doit refuser un visiteur non administrateur");

});

test("écran 0 — le catalogue est TRADUIT avant d'entrer dans le radar", () => {

  // DÉFAUT TROUVÉ EN DIRECT, à l'écran, au premier clic :
  // « catalogue.programs is not iterable ».
  // chargerCatalogue() rend des clés FRANÇAISES (programmes /
  // universites / bourses) ; js/radar.js travaille sur la forme de
  // l'instantané, en anglais. admin/radar.js fait déjà cette
  // traduction, avec un commentaire qui l'explique — je ne l'avais pas
  // lu avant d'écrire la page jumelle.
  const js = codeSeul("admin/verification.js");

  assert.match(js, /programs: brut\.programmes/);
  assert.match(js, /universities: brut\.universites/);
  assert.match(js, /scholarships: brut\.bourses/);

  assert.ok(!/await chargerCatalogue\(\);\s*\n\s*programmesParBourse/.test(js),
    "passer le retour de chargerCatalogue() tel quel au radar rejoue exactement le défaut");

  // Et le même contrat côté voisin, pour que les deux pages ne
  // divergent pas en silence.
  const radar = codeSeul("admin/radar.js");
  assert.match(radar, /programs: c\.programmes/);

});

test("fuite 1 — rien de personnel n'entre dans une collection publique", () => {

  // FUITE TROUVÉE À LA PREMIÈRE ÉCRITURE RÉELLE, le 2026-09-19.
  // sourceVerification.par portait `currentUser.email`. Or
  // firestore.rules dit, pour cette collection :
  //     match /programs/{programId} { allow read: if true; }
  // Lecture PUBLIQUE. L'adresse personnelle devenait lisible par
  // n'importe qui, et partait en plus dans assets/data/catalogue.json
  // que sert Hosting. J'avais écrit « traçabilité » sans relire les
  // règles de la collection dans laquelle j'écrivais.
  const js = codeSeul("admin/verification.js");

  assert.ok(!/currentUser\?\.email/.test(js),
    "une adresse e-mail n'a rien à faire dans une collection en lecture publique");
  assert.match(js, /parUid: getAuth\(app\)\.currentUser\?\.uid/,
    "l'uid trace aussi bien, et admins/{uid} dit qui c'est — lui n'est pas public");

  // Et la règle qui rend ce test nécessaire, pour qu'on la relise si
  // elle change un jour.
  const regles = lire("firestore.rules");
  const bloc = regles.slice(regles.indexOf("match /programs/{programId}"));
  assert.match(bloc.slice(0, 200), /allow read: if true;/,
    "si cette collection devenait privée, ce test pourrait se relâcher — pas avant");

});

test("écran 1 — le statut n'est JAMAIS écrit par défaut", () => {

  const js = codeSeul("admin/verification.js");

  // Fermer une bourse la retire des propositions de tous les étudiants
  // concernés : ça ne se fait pas par défaut.
  assert.match(js, /<option value="">Ne pas toucher au statut/);
  assert.match(js, /if \(choixStatut === "Ouverte" \|\| choixStatut === "Fermée"\) champs\.status = choixStatut;/);

  // Et la phrase source est TOUJOURS montrée : c'est ce qui permet de
  // juger sans faire confiance.
  assert.match(js, /verif-citation/);
  assert.match(js, /mot pour mot/);

});
