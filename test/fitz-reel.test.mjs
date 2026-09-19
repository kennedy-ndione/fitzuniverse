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
