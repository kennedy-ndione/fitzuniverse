/**
 * ============================================================
 * test/fitz-reel.test.mjs — la bascule de Fitz vers un vrai modèle
 * ============================================================
 *
 * LOT FITZ-RÉEL (2026-09-18). Depuis le 2026-09-04, les six outils de
 * Fitz — chat, lettre de motivation, e-mails, traduction, vérification
 * de dossier, préparation d'entretien — étaient des SIMULATEURS
 * (`MODE = "simule"` dans js/ai/ai-config.js). Un étudiant qui payait
 * 10 000 F et ouvrait un outil trouvait une imitation.
 *
 * Ce qui bloquait n'était pas du code : functions/fitz.js était écrit
 * pour Vertex AI, et Vertex demande une facturation Google active. Le
 * commentaire de ai-config.js le disait : « remettre "passerelle" ne
 * fait que rendre le site cassé à nouveau ». C'est arrivé une fois.
 *
 * CES TESTS EXISTENT POUR QUE ÇA N'ARRIVE PAS DEUX FOIS. La règle
 * centrale est celle de `passerelle 1` : le client ne peut pas passer en
 * "passerelle" si la fonction n'a pas de quoi appeler un modèle. L'état
 * dangereux devient rouge au lieu d'être vert.
 *
 * Fins de ligne : tout fichier lu ici passe par .replace(/\r\n/g,"\n").
 * ============================================================
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");
// Le code sans ses commentaires : ces modules RACONTENT la voie qu'ils
// ont quittée, et une assertion sur « Vertex » tomberait sur la prose.
const codeSeul = (f) => lire(f).replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/[^\n]*$/gm, "");

test("passerelle 1 — le client ne passe en « passerelle » que si la fonction peut appeler un modèle", () => {

  const config = lire("js/ai/ai-config.js");
  const m = /export const MODE = "(simule|passerelle)"/.exec(config);
  assert.ok(m, "js/ai/ai-config.js ne déclare plus MODE, ou plus avec ces deux valeurs");
  const mode = m[1];

  const fitz = codeSeul("functions/fitz.js");
  const paquet = JSON.parse(lire("functions/package.json"));
  const deps = paquet.dependencies || {};

  // DE QUOI LA FONCTION A BESOIN POUR APPELER UN MODÈLE, quelle que
  // soit la voie : un SDK déclaré, et un client qui le charge.
  const sdkDirect = !!deps["@anthropic-ai/sdk"];
  const sdkVertex = !!deps["@anthropic-ai/vertex-sdk"];
  const clientDirect = /require\("@anthropic-ai\/sdk"\)/.test(fitz);
  const clientVertex = /require\("@anthropic-ai\/vertex-sdk"\)/.test(fitz);

  // UNE SEULE VOIE À LA FOIS. Les deux SDK ensemble, c'est deux
  // factures et deux comportements d'erreur pour une seule fonction.
  assert.ok(!(sdkDirect && sdkVertex), "functions/package.json déclare les DEUX SDK : une voie, pas deux");
  assert.ok(!(clientDirect && clientVertex), "functions/fitz.js charge les DEUX SDK");

  // LE SDK CHARGÉ EST CELUI QUI EST DÉCLARÉ. Sans ça, le déploiement
  // part et la fonction tombe au premier appel sur un module absent.
  if (clientDirect) assert.ok(sdkDirect, "functions/fitz.js charge @anthropic-ai/sdk, que package.json ne déclare pas");
  if (clientVertex) assert.ok(sdkVertex, "functions/fitz.js charge @anthropic-ai/vertex-sdk, que package.json ne déclare pas");

  // LA VOIE DIRECTE EXIGE SA CLÉ, déclarée ET attachée à la fonction.
  // Un secret déclaré mais absent de `secrets:` n'est pas injecté : la
  // fonction part et refuse tous les appels.
  if (clientDirect) {
    assert.match(fitz, /defineSecret\("ANTHROPIC_API_KEY"\)/, "la clé n'est plus déclarée");
    assert.match(fitz, /secrets:\s*\[\s*cleAnthropic\s*\]/, "la clé n'est plus attachée à fitzGenerate : elle ne sera pas injectée");
  }

  // ET LA RÈGLE QUI COMPTE : pas de mode « passerelle » sans voie.
  if (mode === "passerelle") {
    assert.ok(clientDirect || clientVertex,
      "MODE = \"passerelle\" alors que functions/fitz.js ne charge aucun SDK : les six outils seraient cassés en production, comme le 2026-09-04");
  }

});

test("passerelle 2 — la clé ne sort jamais de construireClient()", () => {

  const fitz = lire("functions/fitz.js");

  // ELLE EST LUE UNE FOIS, ET UNE SEULE. Chaque lecture de plus est un
  // endroit de plus où elle peut finir dans un journal ou une réponse.
  const lectures = (fitz.match(/cleAnthropic\.value\(\)/g) || []).length;
  assert.equal(lectures, 1, `la clé est lue ${lectures} fois : une seule lecture, dans construireClient()`);

  // AUCUN JOURNAL NE LA PREND, même tronquée. On regarde le texte de
  // chaque appel à logger.* : aucun ne doit nommer la clé.
  for (const appel of fitz.match(/logger\.\w+\([\s\S]{0,400}?\n\s*\}?\);/g) || []) {
    assert.ok(!/cleAnthropic|apiKey|ANTHROPIC_API_KEY/.test(appel),
      `un appel à logger nomme la clé :\n${appel.slice(0, 200)}`);
  }

  // ELLE NE PART PAS AU CLIENT, ni dans la réponse ni dans un refus.
  assert.ok(!/return\s*\{[^}]*cleAnthropic/.test(fitz), "la clé est renvoyée au client");
  assert.ok(!/refus\([^)]*cleAnthropic/.test(fitz), "la clé est glissée dans un message d'erreur");

  // ET ELLE N'EST PAS ÉCRITE EN DUR. Une clé Anthropic commence par
  // « sk-ant- » : ce motif ne doit apparaître dans AUCUN fichier du lot.
  for (const f of ["functions/fitz.js", "functions/package.json", "js/ai/ai-config.js"]) {
    assert.ok(!/sk-ant-/.test(lire(f)), `une clé en clair est écrite dans ${f}`);
  }

});

test("passerelle 3 — chaque tâche du client a son modèle côté serveur, et les deux listes ne dérivent pas", () => {

  const fitz = lire("functions/fitz.js");
  const config = lire("js/ai/ai-config.js");

  // LES TÂCHES DU CLIENT sont celles que le serveur accepte. Une tâche
  // connue du client et inconnue du serveur est une page qui échoue à
  // l'usage, jamais au déploiement.
  const taches = [...config.matchAll(/^\s*(\w+):\s*"ai_\w+",?\s*$/gm)].map((x) => x[1]);
  assert.ok(taches.length >= 6, `${taches.length} tâches lues dans FONCTIONNALITE_PAR_TACHE : la lecture a cassé`);

  for (const t of taches) {
    assert.match(fitz, new RegExp(`^\\s*${t}:\\s*\\{`, "m"),
      `la tâche « ${t} » est connue du client mais absente de TACHES dans functions/fitz.js`);
  }

  // LES DEUX TÂCHES QUI SONT LE PRODUIT PAYÉ gardent le modèle le plus
  // capable. Décision de Charles du 2026-09-04 : « une lettre médiocre
  // coûte une admission, pas quelques francs d'écart de modèle. »
  for (const t of ["letter", "check"]) {
    const bloc = new RegExp(`${t}:\\s*\\{[^}]*modele:\\s*"([^"]+)"`).exec(fitz);
    assert.ok(bloc, `la tâche « ${t} » n'a plus de modèle`);
    assert.match(bloc[1], /opus/, `« ${t} » est passée à ${bloc[1]} : c'est la sortie que l'étudiant a payée`);
  }

  // ET LE PLAFOND DE DÉPENSE RESTE PONDÉRÉ. Sans poids, « 40 appels par
  // jour » ne protège rien : une analyse de dossier coûte douze fois un
  // message de chat.
  for (const t of taches) {
    assert.match(fitz, new RegExp(`${t}:\\s*\\{[^}]*poids:\\s*\\d+`),
      `la tâche « ${t} » n'a plus de poids : le plafond ne la voit plus`);
  }

});

test("accès 1 — FITZ-ACCÈS : le serveur honore les deux contournements que le client accorde", async () => {

  // MÊME FAMILLE que defaut_formules_fitz du 10/09 : un droit accordé
  // par js/access-guard.js (propriétaire via admins/{uid}, testeur via
  // users/{uid}.testerAccess) et ignoré par le serveur donne des outils
  // OUVERTS qui refusent chaque appel avec un message de vente adressé
  // au propriétaire.
  const { createRequire } = await import("node:module");
  const require = createRequire(import.meta.url);
  const { formuleDeDerogation, formuleActive, PLAFONDS, plafondsDe } = require(path.join(RACINE, "functions/lib/fitz-acces.js"));

  // La fonction pure : le propriétaire gagne, le testeur suit, sinon rien.
  assert.equal(formuleDeDerogation({ adminActif: true, testerAccess: true }), "proprietaire");
  assert.equal(formuleDeDerogation({ adminActif: true }), "proprietaire");
  assert.equal(formuleDeDerogation({ testerAccess: true }), "testeur");
  assert.equal(formuleDeDerogation({}), null);
  assert.equal(formuleDeDerogation(), null);

  // Les dérogations ont un PLAFOND À ELLES : comptes internes, pas
  // illimités — et jamais le plafond par défaut en silence.
  assert.ok(PLAFONDS.proprietaire && PLAFONDS.proprietaire.mois >= 400, "le propriétaire n'a plus de plafond nommé");
  assert.ok(PLAFONDS.testeur && PLAFONDS.testeur.mois >= 300, "le testeur n'a plus de plafond nommé");
  assert.deepEqual(plafondsDe("proprietaire"), PLAFONDS.proprietaire);

  // Une dérogation n'est pas une formule : formuleActive() ne les rend
  // jamais d'elle-même (elles ne s'achètent pas).
  assert.equal(formuleActive({ plan: "proprietaire" }), null);
  assert.equal(formuleActive({ plan: "testeur" }), null);

  // ET LE SERVEUR S'EN SERT : functions/fitz.js lit admins/{uid}
  // (uniquement pour un compte sans formule) et testerAccess, puis
  // passe par formuleDeDerogation — AVANT le refus QUOTA_PLAN.
  const fitz = codeSeul("functions/fitz.js");
  assert.match(fitz, /formuleDeDerogation/, "functions/fitz.js n'appelle plus formuleDeDerogation");
  assert.match(fitz, /admins\/\$\{uid\}/, "functions/fitz.js ne lit plus admins/{uid}");
  assert.match(fitz, /testerAccess/, "functions/fitz.js ignore testerAccess");
  const iDerog = fitz.indexOf("formuleDeDerogation(");
  const iRefus = fitz.indexOf("QUOTA_PLAN");
  assert.ok(iDerog !== -1 && iRefus !== -1 && iDerog < iRefus,
    "la dérogation arrive APRÈS le refus : les comptes internes sont encore refusés");

  // LE MIROIR CLIENT EXISTE TOUJOURS : si access-guard perd un des deux
  // contournements, la contrepartie serveur devient du code mort — et
  // inversement ce test dit où est l'autre moitié.
  const garde = lire("js/access-guard.js");
  assert.match(garde, /doc\(db, "admins", firebaseUser\.uid\)/, "le client ne lit plus admins/{uid}");
  assert.match(garde, /testerAccess: userData\.testerAccess === true/, "le client ne lit plus testerAccess");

});

test("vide 1 — une réponse vide se journalise (sa forme, jamais son contenu) avant d'être refusée", () => {

  // VU EN PRODUCTION le 2026-09-19 : « Fitz n'a rien renvoyé » sur le
  // premier appel du diagnostic, reprise réussie au second. Sans
  // journal de forme, la cause reste inconnue et le point réservé est
  // perdu en silence.
  const fitz = codeSeul("functions/fitz.js");
  const iJournal = fitz.indexOf('logger.warn("Réponse vide"');
  const iRefus = fitz.indexOf('"Fitz n\'a rien renvoyé."');
  assert.ok(iJournal !== -1, "la réponse vide n'est plus journalisée");
  assert.ok(iRefus !== -1 && iJournal < iRefus, "le journal doit précéder le refus");
  const bloc = fitz.slice(iJournal, iRefus);
  assert.match(bloc, /stopReason:\s*message\.stop_reason/, "le journal ne dit plus pourquoi le modèle s'est arrêté");
  assert.match(bloc, /blocs:\s*message\.content\.map\(\(bloc\) => bloc\.type\)/, "le journal ne dit plus quels types de blocs sont arrivés");
  assert.ok(!/bloc\.text|texte\b/.test(bloc), "le journal d'une réponse vide ne doit jamais porter de contenu");

});


test("barème 1 — les poids suivent le coût typique, et le plafond borne le cas lourd", async () => {

  // LOT BARÈME (2026-09-19). Les poids du 2026-09-04 étaient des
  // estimations d'avant tout appel réel. Mesure : 0,74 $US pour 61,7 k
  // jetons sur les deux jours de recette. Aux tarifs du 2026-09-18, la
  // traduction (Sonnet) et l'analyse de dossier (Opus) étaient pesées
  // sur leur cas LOURD alors que les cinq autres tâches l'étaient sur
  // leur cas typique — l'étudiant ordinaire payait le cas extrême d'un
  // autre. Ce test tient la règle, pas les chiffres pour eux-mêmes.
  const fitz = codeSeul("functions/fitz.js");

  const poidsDe = (tache) => {
    const trouve = new RegExp(`\\b${tache}:\\s*\\{[^}]*poids:\\s*(\\d+)`).exec(fitz);
    assert.ok(trouve, `la tâche « ${tache} » n'a plus de poids : le plafond ne la voit plus`);
    return Number(trouve[1]);
  };

  // Les cinq tâches légères tournent sur Sonnet avec une sortie courte :
  // 5 à 11 F CFA, donc un point. Elles n'ont jamais bougé.
  for (const tache of ["chat", "email", "readiness", "diagnostic"]) {
    assert.equal(poidsDe(tache), 1, `${tache} ne coûte pas un point`);
  }

  // Les deux corrigées. Tout retour au-dessus signifie qu'on a repesé le
  // cas lourd une deuxième fois, par-dessus le plafond qui le borne déjà.
  assert.equal(poidsDe("translate"), 3, "la traduction est repassée au-dessus de son coût typique (~29 F)");
  assert.equal(poidsDe("check"), 7, "l'analyse de dossier est repassée au-dessus de son coût typique (~69 F)");

  // La lettre reste sur Opus ET garde son poids : elle est à un point de
  // son coût typique, on ne corrige que ce qui est faux.
  assert.equal(poidsDe("letter"), 4, "la lettre a changé de poids sans raison mesurée");

  // LA CONSÉQUENCE VENDUE, écrite en clair : un Essentiel (40/jour) doit
  // pouvoir faire CINQ analyses de dossier dans sa journée. C'est ce
  // chiffre-là que l'étudiant vit, et il tombe si un poids remonte.
  const { createRequire } = await import("node:module");
  const require = createRequire(import.meta.url);
  const { PLAFONDS } = require(path.join(RACINE, "functions/lib/fitz-acces.js"));
  assert.ok(Math.floor(PLAFONDS["essentiel-4"].jour / poidsDe("check")) >= 5,
    "un Essentiel ne peut plus faire cinq analyses de dossier par jour");

  // LE PLAFOND GRATUIT — la première impression. À 3 points par MOIS, un
  // visiteur avait droit à un seul diagnostic (deux quand le défaut de
  // réponse vide en faisait coûter deux), puis lisait un refus. Il lui
  // en faut deux complets, défaut compris.
  assert.ok(PLAFONDS.gratuit.mois >= 2 * 2, "le gratuit ne laisse plus deux diagnostics dans le mois");
  assert.ok(PLAFONDS.gratuit.jour >= 2 * 1, "le gratuit ne laisse plus une reprise le jour même");

});

test("global 1 — un plafond pour TOUT le site, et un robinet qui ne ment pas", async () => {

  // Avant ce lot, tous les plafonds étaient par compte : additionnés, ils
  // ne bornaient rien. Cent comptes gratuits valent cent fois le plafond
  // gratuit, et rien ne disait « stop » avant que le crédit ne soit vide.
  const { createRequire } = await import("node:module");
  const require = createRequire(import.meta.url);
  const { verdictSysteme, PLAFOND_GLOBAL_JOUR } = require(path.join(RACINE, "functions/lib/fitz-acces.js"));

  assert.equal(typeof verdictSysteme, "function", "verdictSysteme a disparu : le site n'a plus de plafond");
  assert.ok(PLAFOND_GLOBAL_JOUR > 0, "le repli du plafond global ne vaut plus rien");

  // LE ROBINET : actif:false arrête tout le monde, avant tout calcul.
  assert.deepEqual(verdictSysteme({ systeme: { actif: false }, jourCourant: "2026-09-19", points: 1 }),
    { ok: false, portee: "robinet" });

  // LE PLAFOND GLOBAL, avec le repli quand le document ne le déclare pas.
  const auBord = { jour: "2026-09-19", pointsJour: PLAFOND_GLOBAL_JOUR - 1 };
  assert.equal(verdictSysteme({ systeme: auBord, jourCourant: "2026-09-19", points: 1 }).ok, true);
  assert.equal(verdictSysteme({ systeme: auBord, jourCourant: "2026-09-19", points: 2 }).ok, false);
  assert.equal(verdictSysteme({ systeme: auBord, jourCourant: "2026-09-19", points: 2 }).portee, "global");

  // IL SE RÈGLE SANS DÉPLOIEMENT : la valeur du document gagne sur le repli.
  assert.equal(verdictSysteme({ systeme: { jour: "2026-09-19", pointsJour: 40, plafondJour: 50 }, jourCourant: "2026-09-19", points: 7 }).plafond, 50);
  assert.equal(verdictSysteme({ systeme: { jour: "2026-09-19", pointsJour: 45, plafondJour: 50 }, jourCourant: "2026-09-19", points: 7 }).ok, false);

  // LE JOUR TOURNE TOUT SEUL : un compteur daté d'hier vaut zéro.
  assert.equal(verdictSysteme({ systeme: { jour: "2026-09-18", pointsJour: 9999 }, jourCourant: "2026-09-19", points: 7 }).ok, true);

  // UN DOCUMENT ABSENT NE FERME PAS FITZ : le robinet se ferme sur une
  // décision écrite (actif:false), jamais sur une absence.
  assert.equal(verdictSysteme({ systeme: {}, jourCourant: "2026-09-19", points: 12 }).ok, true);
  assert.equal(verdictSysteme().ok, true);

  // ET LE SERVEUR S'EN SERT VRAIMENT, dans la transaction de réservation.
  const fitz = codeSeul("functions/fitz.js");
  assert.match(fitz, /const REF_SYSTEME = "systeme\/fitz"/, "le document du site n'est plus nommé");
  assert.match(fitz, /verdictSysteme\(/, "functions/fitz.js n'appelle plus verdictSysteme");

  // Les deux lectures AVANT la première écriture : une transaction
  // Firestore ne lit plus rien après avoir écrit.
  const iLecture = fitz.indexOf("tx.get(refSysteme)");
  const iEcriture = fitz.indexOf("tx.set(");
  assert.ok(iLecture !== -1, "le document du site n'est plus lu dans la transaction");
  assert.ok(iEcriture !== -1 && iLecture < iEcriture, "la lecture du document du site passe après une écriture");

  // Le compteur du site s'écrit dans la MÊME transaction que celui de
  // l'étudiant : sans ça, deux appels simultanés passent tous les deux.
  assert.match(fitz, /tx\.set\(\s*refSysteme/, "le compteur du site n'est plus écrit dans la transaction");

  // ET LE REFUS NE MENT PAS. Un plafond du SITE n'est pas un défaut de
  // formule : le dire avec QUOTA_PLAN afficherait un message de vente à
  // un étudiant qui a payé et qui n'y peut rien.
  const iGlobal = fitz.indexOf('reservation.portee === "robinet"');
  assert.ok(iGlobal !== -1, "le refus du site n'est plus distingué du refus de formule");
  // La fenêtre s'arrête au refus de formule qui suit : au-delà, on lirait
  // le QUOTA_PLAN de l'autre branche et l'assertion ne dirait plus rien.
  const iFormule = fitz.indexOf('logger.info("Plafond Fitz atteint"', iGlobal);
  assert.ok(iFormule > iGlobal, "le refus du site ne précède plus le refus de formule");
  const blocGlobal = fitz.slice(iGlobal, iFormule);
  assert.match(blocGlobal, /QUOTA_FOURNISSEUR/, "le refus du site emprunte encore le code d'un refus de formule");
  assert.ok(!/QUOTA_PLAN/.test(blocGlobal), "le refus du site porte encore QUOTA_PLAN");
  assert.match(blocGlobal, /logger\.error/, "un arrêt de facturation doit se voir dans la console, pas se noyer en info");

  // Le code employé doit exister côté client, sinon l'étudiant tombe sur
  // le message générique de CODES.INCONNU — qui, lui, est réessayable.
  assert.match(lire("js/ai/ai-errors.js"), /QUOTA_FOURNISSEUR:\s*"QUOTA_FOURNISSEUR"/,
    "QUOTA_FOURNISSEUR n'existe plus dans le vocabulaire du client");

});
