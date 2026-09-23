/**
* L'ALERTE « NOUVEAU MESSAGE » (2026-09-23, demande de Charles).
*
* Constaté en vrai : une étudiante a reçu un message de l'équipe et ne
* savait pas où le trouver — le seul signal était un point de 8 px sur la
* cloche. Ces tests gardent les trois signaux (carte, compteur, onglet)
* et l'accusé de lecture côté admin.
*/

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(join(racine, f), "utf8");

test("alerte 1 — une carte « Nouveau message de l'équipe FitzUniverse » avec l'extrait et « Lire le message »", () => {
const js = lire("js/student-messages.js");
assert.match(js, /"Nouveau message de l'équipe FitzUniverse"/);
assert.match(js, /nouveaux messages de l'équipe FitzUniverse/);
assert.match(js, /<a href="messages\.html" class="messages-alerte-lire">Lire le message<\/a>/);
assert.match(js, /setAttribute\("aria-live", "polite"\)/, "annoncée aux lecteurs d'écran");
// Jamais sur la page Messages : elle EST la conversation.
assert.match(js, /if \(!surLaPageMessages\(\) && !panelOuvert && lireRangee\(\) !== dernier\.id\)/);
// Ouvrir la cloche la retire.
assert.match(js, /markTeamMessagesRead\(uid, messages\);\s*retirerAlerte\(\);/);
});

test("alerte 2 — la cloche porte un COMPTEUR, l'onglet affiche (N), et l'extrait passe par textContent", () => {
const js = lire("js/student-messages.js");
assert.match(js, /bellDot\.textContent = n > 9 \? "9\+" : String\(n\);/);
// 2026-09-23 : le titre se relit à chaque mise à jour (la page peut l'avoir changé).
assert.match(js, /const titre = titreSansCompteur\(\);\s*document\.title = n \? `\(\$\{n\}\) \$\{titre\}` : titre;/);
assert.match(js, /const COMPTEUR_DU_TITRE = \/\^\\\(\\d\+\\\+\?\\\) \/;/);
// Le texte du message vient de l'admin : jamais d'innerHTML avec lui.
assert.match(js, /querySelector\("\.messages-alerte-extrait"\)\.textContent = /);
assert.ok(!/innerHTML[^;]*dernier\.text/.test(js), "le texte du message ne passe jamais par innerHTML");
const css = lire("css/journey-shell.css");
assert.match(css, /\.messages-alerte\{/);
assert.match(css, /\.messages-bell-btn \.messages-bell-dot\.is-compteur\{/);
assert.match(css, /@media \(prefers-reduced-motion: no-preference\)\{[\s\S]*messages-cloche-sonne/, "la cloche ne s'agite pas pour qui a demandé moins de mouvement");
});

test("alerte 3 — l'admin voit « Lu » ou « Pas encore lu » sous chaque message de l'équipe", () => {
const js = lire("admin/messages.js");
assert.match(js, /lu\.textContent = message\.read \? "Lu" : "Pas encore lu";/);
assert.match(lire("admin/control-center.css"), /\.msg-bubble-lu\.is-lu\{/);
});
