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
//
// LOT 125 (2026-09-26) — LE 304 N'EXISTAIT PAS. Mesuré en production
// dans le navigateur : avec « no-cache », Firebase Hosting ne garde pas
// le fichier sur son CDN (x-cache: MISS) et répond 200 AVEC LE FICHIER
// ENTIER même quand l'étiquette (If-None-Match) correspond — seul
// catalogue.json, marqué « public », répondait 304. Chaque visite
// retéléchargeait donc tout : 510 Ko pour espace-bourse.html, 386 à
// 447 Ko par page du Control Center, 206 Ko pour l'accueil. C'est la
// lenteur que Charles ressentait sur tout le site.
//
// LA RÈGLE DEVIENT : « public, max-age=0, s-maxage=86400,
// must-revalidate ».
//   - Le navigateur : max-age=0 + must-revalidate — il redemande À
//     CHAQUE chargement, exactement comme avant ; aucun fichier périmé.
//   - Le CDN : public + s-maxage — il garde le fichier et répond 304
//     (quelques centaines d'octets) quand rien n'a changé. Firebase
//     vide tout le cache du CDN à chaque déploiement (documentation
//     « Manage cache behavior ») : un fichier neuf est servi dès le
//     déploiement suivant.
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

// Le navigateur revalide à chaque chargement : max-age=0 (et aucun
// autre max-age navigateur), must-revalidate, jamais de contenu périmé.
function revalideAChaqueChargement(v, source) {
  assert.match(v, /(^|[\s,])max-age=0(,|$)/, `${source} : max-age=0 pour le navigateur`);
  assert.ok(!/(^|[\s,])max-age=[1-9]/.test(v), `${source} : un max-age navigateur non nul laisse tourner l'ancien code (${v})`);
  assert.match(v, /must-revalidate/, source);
  assert.ok(!/stale-while-revalidate/.test(v), `${source} : servir du périmé pendant la revalidation, c'est le défaut de septembre`);
}

// Le CDN garde le fichier pour répondre 304 (lot 125) : sans « public »,
// Firebase renvoie le fichier entier à chaque visite.
function gardeParLeCdn(v, source) {
  assert.match(v, /(^|[\s,])public(,|$)/, `${source} : « public », sinon le CDN ne répond jamais 304`);
  assert.match(v, /s-maxage=\d+/, `${source} : s-maxage pour le CDN`);
  assert.ok(!/no-cache|no-store|private/.test(v), `${source} : ${v} empêche le 304 (mesuré le 2026-09-26)`);
}

test("cache 1 — le HTML se revalide à chaque chargement, et le CDN répond 304", () => {
  for (const source of ["**/*.html", "/"]) {
    const v = entete(source);
    revalideAChaqueChargement(v, source);
    gardeParLeCdn(v, source);
  }
});

test("cache 2 — un script ou une feuille se revalide à CHAQUE chargement", () => {
  const v = entete("**/*.@(css|js|mjs)");
  revalideAChaqueChargement(v, "scripts et feuilles");
  gardeParLeCdn(v, "scripts et feuilles");
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
