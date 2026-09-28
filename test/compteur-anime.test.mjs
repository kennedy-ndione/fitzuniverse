/**
* ============================================================
* test/compteur-anime.test.mjs — un compteur du hero ne dit jamais « -6 »
* ============================================================
*
* Le 2026-09-28, le harnais (scripts/verifier/pages.mjs, note
* « LANGAGE accueil : N bourses lues dans le hero ») a lu « -6 », puis
* « -4 » selon les passages, dans #heroScholarshipCount. Cause :
* animateCountTo (js/homepage-teaser.js) prenait `start` avec
* performance.now(), puis recevait de requestAnimationFrame l'horodatage
* du DÉBUT de l'image, qui peut le précéder. Progression négative,
* easing négatif : un nombre négatif pendant une image.
*
* Le calcul vit désormais dans js/compteur-anime.js, pur, et la
* progression y est bornée à [0, 1]. Ce fichier vérifie :
*   1. une image datée d'avant le départ affiche « 0 » ;
*   2. sur toute l'animation, le texte est un entier entre 0 et la
*      cible, qui ne recule jamais et finit exactement sur la cible ;
*   3. animateCountTo passe bien par ce calcul, sans copie à côté ;
*   4. le contrôle 1 voit la faute du 2026-09-28 sur l'ancien calcul.
*
* Lancer : npm test   (ou : node --test test/compteur-anime.test.mjs)
* ============================================================
*/

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { imageDuCompteur } from "../js/compteur-anime.js";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lire = (f) => readFileSync(path.join(RACINE, f), "utf8").replace(/\r\n/g, "\n");
const sansCommentairesJs = (js) => js.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

// La durée d'animateCountTo, et le nombre de bourses du hero le jour du
// défaut (assets/data/catalogue.json : 164 bourses le 2026-09-28).
const DUREE = 1400;
const BOURSES = 164;
const DEBUT = 50000;

// Des avances réalistes : une fraction de milliseconde, une demi-image à
// 120 Hz, une image à 60 Hz, deux images, une image très en retard.
const AVANCES_MS = [0.1, 1, 4, 8.3, 11, 16.7, 33.3, 100];
const CIBLES = [1, 30, BOURSES, 253, 1000];

/** Ce qu'affiche `calcul` pour des images datées d'avant le départ. */
function imagesAvantLeDepart(calcul) {
const sortie = [];
for (const avance of AVANCES_MS) {
for (const cible of CIBLES) {
sortie.push({ avance, cible, ...calcul(DEBUT - avance, DEBUT, DUREE, cible) });
}
}
return sortie;
}

test("compteur 1 — une image datée d'avant le départ affiche 0, jamais un nombre négatif", () => {
// Toutes les images fautives d'un coup : le message dit lesquelles, et
// avec quel nombre. Le comptage n'a pas commencé : « 0 » affiché, et
// l'image suivante demandée.
const fautes = imagesAvantLeDepart(imageDuCompteur)
.filter((i) => i.texte !== "0" || i.enCours !== true)
.map((i) => `${i.avance} ms d'avance, cible ${i.cible} : « ${i.texte} »${i.enCours ? "" : ", animation arrêtée"}`);
assert.deepEqual(fautes, [], "une image datée d'avant le départ doit afficher « 0 »");
});

test("compteur 2 — de la première à la dernière image, un entier entre 0 et la cible qui ne recule jamais et finit sur la cible", () => {
for (const cible of [0, ...CIBLES]) {
let precedent = 0;
// Une image toutes les 4 ms, de 20 ms avant le départ à 20 ms après la
// fin ; la grille passe par le départ (0) et par la fin (1400) exacts.
for (let ecart = -20; ecart <= DUREE + 20; ecart += 4) {
const { texte, enCours } = imageDuCompteur(DEBUT + ecart, DEBUT, DUREE, cible);
const ou = `cible ${cible}, ${ecart} ms après le départ`;
assert.match(texte, /^\d+$/, `${ou} : « ${texte} » affiché`);
const n = Number(texte);
assert.ok(n <= cible, `${ou} : ${n} dépasse la cible`);
assert.ok(n >= precedent, `${ou} : le compteur recule de ${precedent} à ${n}`);
precedent = n;
if (ecart >= DUREE) {
// La fin : la vraie valeur, et plus aucune image demandée — c'est ce
// qui retire le filet setTimeout d'animateCountTo.
assert.equal(texte, String(cible), ou);
assert.equal(enCours, false, ou);
} else {
assert.equal(enCours, true, ou);
}
}
}
});

test("compteur 3 — animateCountTo passe par ce calcul, sans copie à côté", () => {
const teaser = sansCommentairesJs(lire("js/homepage-teaser.js"));
assert.ok(/^import \{ imageDuCompteur \} from "\.\/compteur-anime\.js";$/m.test(teaser),
"js/homepage-teaser.js n'importe pas imageDuCompteur de ./compteur-anime.js");
const debut = teaser.indexOf("function animateCountTo(");
const fin = teaser.indexOf("function setCount(");
assert.ok(debut > -1 && fin > debut, "animateCountTo introuvable dans js/homepage-teaser.js");
const fonction = teaser.slice(debut, fin);
assert.ok(/const image = imageDuCompteur\(now, start, duration, target\);/.test(fonction),
"animateCountTo ne calcule plus son image avec imageDuCompteur");
assert.ok(/el\.textContent = image\.texte;/.test(fonction),
"animateCountTo n'affiche pas le texte calculé par imageDuCompteur");
// Plus aucune progression calculée à la main dans la page : une copie
// non bornée ferait revenir le défaut sans que le contrôle 1 le voie.
assert.ok(!/now - start/.test(teaser), "js/homepage-teaser.js recalcule la progression à côté de js/compteur-anime.js");
});

// L'ancien calcul d'animateCountTo, recopié tel qu'il était jusqu'au
// 2026-09-28. Il ne sert qu'à la contre-épreuve : un contrôle qui
// passerait aussi sur l'ancien code ne garantirait rien.
function ancienCalcul(now, start, duration, target) {
const progress = Math.min((now - start) / duration, 1);
const eased = 1 - Math.pow(1 - progress, 3);
return { texte: `${Math.round(eased * target)}`, enCours: progress < 1 };
}

test("compteur 4 — le contrôle 1 voit la faute du 2026-09-28 sur l'ancien calcul", () => {
const images = imagesAvantLeDepart(ancienCalcul);
assert.ok(images.some((i) => i.texte.startsWith("-")), "le contrôle 1 ne présente plus aucune image capable de révéler la faute");
// Les deux valeurs lues par le harnais, avec les 164 bourses du hero :
// une image de 60 Hz d'avance donnait « -6 », 11 ms « -4 ».
const lu = (avance) => images.find((i) => i.avance === avance && i.cible === BOURSES).texte;
assert.equal(lu(16.7), "-6");
assert.equal(lu(11), "-4");
});
