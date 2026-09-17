// ============================================================
// Lot CACHE-JS (2026-09-17) — LE HTML ET SON SCRIPT NE PEUVENT PLUS
// DATER DE DEUX DÉPLOIEMENTS DIFFÉRENTS.
//
// (En-tête en commentaires de LIGNE, et non en bloc : il cite des
// motifs glob de firebase.json, et « deux étoiles suivies d'une barre »
// referme un commentaire de bloc au milieu d'une phrase — le piège que
// scripts/hosting-publie.mjs documente déjà.)
//
// CE QUI S'EST PASSÉ, mesuré dans le navigateur sur le site en
// production, pendant la recette du lot R2 : la page servait le HTML du
// jour (il est en no-cache depuis le lot PEIGNE-FIN) et LES 64 FICHIERS
// .js/.css DE LA VEILLE, tous marqués transferSize: 0 — lus dans le
// cache du navigateur, jamais redemandés. Le lien de retour d'un outil
// gardait donc l'ancien comportement alors que le code déployé était le
// bon, et personne n'aurait pu le deviner depuis le dépôt.
//
// L'en-tête fautif valait « public, max-age=3600 » plus une tolérance
// de sept jours de contenu périmé, posée sur les scripts et les
// feuilles. Deux effets, tous deux graves ici :
//   - pendant une heure, le navigateur ne redemande RIEN ;
//   - pendant une semaine, il peut servir la version périmée pendant
//     qu'il la revalide en arrière-plan.
//
// Le site n'a aucune étape de compilation : les URL des scripts ne
// portent pas d'empreinte, donc un cache long n'a aucun moyen de savoir
// qu'un fichier a changé. Les deux seules issues correctes sont
// l'empreinte dans l'URL (un lot à part entière, 49 pages) ou la
// revalidation à chaque chargement. On prend la seconde : un 304 coûte
// quelques centaines d'octets, un script périmé coûte une page cassée
// chez un étudiant.
//
// Les images et les polices gardent leur cache long : leur contenu ne
// change pas sous le même nom.
// ============================================================
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const config = JSON.parse(readFileSync(path.join(RACINE, "firebase.json"), "utf8"));

function entete(source) {
  const bloc = (config.hosting.headers || []).find((h) => h.source === source);
  assert.ok(bloc, `aucun en-tête déclaré pour ${source}`);
  const cc = bloc.headers.find((h) => h.key === "Cache-Control");
  assert.ok(cc, `${source} : pas de Cache-Control`);
  return cc.value;
}

test("cache 1 — le HTML n'est jamais gardé (déjà acquis, on le garde)", () => {
  for (const source of ["**/*.html", "/"]) {
    const v = entete(source);
    assert.match(v, /no-cache/, source);
    assert.match(v, /must-revalidate/, source);
  }
});

test("cache 2 — un script ou une feuille se revalide à CHAQUE chargement", () => {
  const v = entete("**/*.@(css|js|mjs)");
  assert.match(v, /no-cache/, "un max-age sur du JS non versionné laisse tourner l'ancien code");
  assert.match(v, /must-revalidate/);
  // Les deux formes qui ont produit le défaut, nommément interdites.
  assert.ok(!/max-age=[1-9]/.test(v), `un max-age non nul est revenu : ${v}`);
  assert.ok(!/stale-while-revalidate/.test(v), "servir du périmé pendant la revalidation, c'est le défaut lui-même");
});

test("cache 3 — les images et les polices gardent leur cache long", () => {
  const v = entete("**/*.@(avif|webp|jpg|jpeg|png|svg|ico|woff2|woff)");
  assert.match(v, /max-age=(\d{5,})/, "une photo ne change pas sous le même nom : elle doit se garder");
});

test("cache 4 — aucune page ne contredit l'en-tête en versionnant ses scripts à la main", () => {
  // Si un jour on passe à l'empreinte dans l'URL, ce test doit être
  // réécrit EN MÊME TEMPS que l'en-tête : les deux stratégies ne se
  // mélangent pas à moitié, c'est ainsi qu'on obtient un fichier
  // versionné et dix autres périmés.
  const pages = ["index.html", "espace-preinscription.html", "profile.html", "applications.html"];
  for (const page of pages) {
    const html = readFileSync(path.join(RACINE, page), "utf8").replace(/<!--[\s\S]*?-->/g, "");
    for (const m of html.matchAll(/<script[^>]*src="([^"]+)"/g)) {
      if (/^https?:/.test(m[1])) continue;
      assert.ok(!/\?v=|\?ver=|\?[0-9a-f]{6,}/.test(m[1]), `${page} : ${m[1]} porte une version à la main`);
    }
  }
});
