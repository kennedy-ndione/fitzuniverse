/**
 * ============================================================
 * scripts/sitemap.mjs — le sitemap dit tout le site, et dit vrai
 * ============================================================
 *
 * LOT FINITION (2026-09-20). L'ancien sitemap.xml était écrit à la
 * main et listait SEPT adresses. Il manquait donc :
 *
 *   - `inscription.html`, la page de conversion du site ;
 *   - les quatre pages légales, `contact.html` compris ;
 *   - `eligibility-questions.html` ;
 *   - et surtout les 507 FICHES DU CATALOGUE, c'est-à-dire le
 *     principal actif de FitzUniverse. Aucune n'était déclarée.
 *
 * Aucune n'avait de `<lastmod>` : un moteur ne pouvait pas savoir ce
 * qui avait bougé, et devait tout revisiter au hasard.
 *
 * DEUX DATES, DEUX ORIGINES — ET AUCUNE INVENTÉE
 * ----------------------------------------------
 * Un `<lastmod>` faux est pire que pas de `<lastmod>` : il apprend au
 * moteur à ne plus croire le fichier. D'où deux sources, toutes deux
 * vérifiables :
 *
 *   pages statiques  la date du dernier commit qui a touché le
 *                    fichier (`git log -1 --format=%cI`). Si git n'est
 *                    pas disponible, la ligne sort SANS `<lastmod>`.
 *   fiches           `ouverteVerifieeLe` du programme quand il en
 *                    porte un — c'est le jour où un humain a relu la
 *                    page officielle — sinon la date de génération de
 *                    l'instantané.
 *
 * LES FICHES SONT PARAMÉTRÉES (`?id=…`), ET C'EST ASSUMÉ
 * ------------------------------------------------------
 * Le site est statique : il n'existe pas 507 fichiers HTML, il existe
 * une page et un instantané JSON. details.js pose le titre, la
 * description et la canonique propres à chaque fiche au chargement.
 * Google exécute le script et lit ces balises ; il faut encore qu'il
 * connaisse les adresses, et c'est le rôle de ce fichier.
 *
 * LES FICHES FERMÉES SONT DÉCLARÉES, ELLES AUSSI
 * ----------------------------------------------
 * Une première version les écartait, pour ne pas envoyer un étudiant
 * sur une porte close. Mesure faite avant d'y croire : 325 des 507
 * programmes relèvent d'une bourse fermée, et la plupart de ces fiches
 * annoncent la RÉOUVERTURE (« campagne 2027 attendue en février-mars
 * 2027 »). Les taire, c'est cacher les deux tiers du catalogue à
 * quelqu'un qui prépare l'année prochaine — précisément le public de
 * ce site. Elles sont donc déclarées, avec une priorité plus basse :
 * 0,6 pour une échéance vérifiée, 0,5 pour une fiche ouverte sans
 * vérification récente, 0,4 pour un cycle clos.
 *
 *   node scripts/sitemap.mjs
 * ============================================================
 */

import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const RACINE = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://fitzuniverse.com";

// Les pages publiques indexables, dans l'ordre d'importance. Toute
// page portant `noindex` en est absente à dessein : l'espace étudiant,
// les outils Fitz, le paiement, la page de compte suspendu.
export const PAGES = [
["", 1.0, "index.html"],
["scholarships.html", 0.9, "scholarships.html"],
["universities.html", 0.9, "universities.html"],
["preinscriptions.html", 0.9, "preinscriptions.html"],
["preinscription-france.html", 0.9, "preinscription-france.html"],
["eligibility-test.html", 0.8, "eligibility-test.html"],
["eligibility-questions.html", 0.7, "eligibility-questions.html"],
["offers.html", 0.7, "offers.html"],
["inscription.html", 0.7, "inscription.html"],
["contact.html", 0.4, "contact.html"],
["mentions-legales.html", 0.3, "mentions-legales.html"],
["cgv.html", 0.3, "cgv.html"],
["confidentialite.html", 0.3, "confidentialite.html"],
["credits.html", 0.2, "credits.html"]
];

/** La date du dernier commit qui a touché ce fichier, en AAAA-MM-JJ.
 *  Chaîne vide si git ne répond pas : mieux vaut pas de date qu'une
 *  date d'aujourd'hui posée sur une page qui n'a pas bougé depuis
 *  trois semaines. */
export function dateDuDernierCommit(fichier, racine = RACINE) {
try {
const sortie = execFileSync("git", ["log", "-1", "--format=%cI", "--", fichier],
{ cwd: racine, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
return (sortie || "").trim().slice(0, 10);
} catch {
return "";
}
}

const jourISO = (valeur) => {
const texte = String(valeur || "").trim();
return /^\d{4}-\d{2}-\d{2}/.test(texte) ? texte.slice(0, 10) : "";
};

/** Les fiches à déclarer : un programme du catalogue par ligne, sauf
 *  celles dont le cycle est clos. */
export function fichesDuCatalogue(catalogue) {

const jourInstantane = jourISO(catalogue.genereLe);
const bourses = new Map((catalogue.scholarships || []).map((b) => [b.id, b]));

return (catalogue.programs || [])
.map((p) => {
const bourse = bourses.get(p.scholarshipId);
const close = /ferm/i.test(String((bourse && bourse.status) || ""));
return {
url: `${SITE}/scholarship-details.html?id=${encodeURIComponent(p.id)}`,
lastmod: jourISO(p.ouverteVerifieeLe) || jourInstantane,
priority: close ? 0.4 : (p.ouverteVerifieeLe ? 0.6 : 0.5)
};
})
.sort((a, b) => a.url.localeCompare(b.url));

}

export function construire(catalogue, racine = RACINE) {

const lignes = [];

for (const [chemin, priorite, fichier] of PAGES) {
const lastmod = dateDuDernierCommit(fichier, racine);
lignes.push({ url: `${SITE}/${chemin}`, lastmod, priority: priorite });
}

lignes.push(...fichesDuCatalogue(catalogue));

const xml = lignes.map(({ url, lastmod, priority }) =>
`<url><loc>${url.replace(/&/g, "&amp;")}</loc>`
+ (lastmod ? `<lastmod>${lastmod}</lastmod>` : "")
+ `<priority>${priority.toFixed(1)}</priority></url>`).join("\n");

return `<?xml version="1.0" encoding="UTF-8"?>
<!-- FICHIER GÉNÉRÉ — ne pas modifier à la main.
Générateur : scripts/sitemap.mjs · Source : assets/data/catalogue.json
À relancer après chaque « node scripts/lot.mjs export ». -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xml}
</urlset>
`;

}

if (process.argv[1] && process.argv[1].endsWith("sitemap.mjs")) {
const catalogue = JSON.parse(readFileSync(join(RACINE, "assets/data/catalogue.json"), "utf8"));
const xml = construire(catalogue);
writeFileSync(join(RACINE, "sitemap.xml"), xml, "utf8");
const total = (xml.match(/<url>/g) || []).length;
const dates = (xml.match(/<lastmod>/g) || []).length;
console.log(`sitemap.xml — ${total} adresses (${PAGES.length} pages + ${total - PAGES.length} fiches), ${dates} avec une date`);
}
