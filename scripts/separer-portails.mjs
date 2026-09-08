/**
* ============================================================
* scripts/separer-portails.mjs — scinder l'instantané déjà écrit
* ============================================================
*
* `node scripts/separer-portails.mjs`
*
* Lit assets/data/catalogue.json, en retire les champs de portail et
* écrit les deux fichiers :
*
*   assets/data/catalogue.json               — le public, amputé
*   functions/data/catalogue-portails.json   — la carte des portails
*
* POURQUOI CE SCRIPT EXISTE À CÔTÉ DE `lot.mjs export`. L'export lit
* Firestore : il demande un `firebase login` et il est la dernière
* étape d'un lot de données. Ce script-ci ne lit RIEN d'autre que le
* fichier déjà publié — il sert à faire la bascule aujourd'hui, et à la
* refaire si un instantané arrive d'ailleurs (une restauration, un
* export d'une autre machine) sans que les portails repartent en clair.
* Les deux passent par le même module pur, scripts/instantane-portails.mjs :
* il n'y a qu'une définition de « ce qui est un portail ».
*
* IDEMPOTENT : relancé sur un instantané déjà scindé, il ne trouve
* aucun champ à retirer et n'écrase pas la carte existante par une
* carte vide — il s'arrête en le disant.
* ============================================================
*/

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { separerPortails, fuitesDePortail } from "./instantane-portails.mjs";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC_PATH = join(racine, "assets", "data", "catalogue.json");
const PRIVE_PATH = join(racine, "functions", "data", "catalogue-portails.json");

const instantane = JSON.parse(await readFile(PUBLIC_PATH, "utf8"));
const fuites = fuitesDePortail(instantane);

if (!fuites.length) {
console.log("assets/data/catalogue.json ne porte déjà aucun champ de portail — rien à faire.");
console.log("(Pour reconstruire les deux fichiers depuis la base : node scripts/lot.mjs export)");
process.exit(0);
}

const { public: publique, portails, comptes } = separerPortails(instantane);

await mkdir(dirname(PRIVE_PATH), { recursive: true });
await writeFile(PRIVE_PATH, JSON.stringify(portails, null, 2), "utf8");

const texte = JSON.stringify(publique);
await writeFile(PUBLIC_PATH, texte, "utf8");

console.log(`assets/data/catalogue.json réécrit (${Math.round(texte.length / 1024)} Ko) — ${fuites.length} champ(s) de portail retiré(s).`);
console.log(`functions/data/catalogue-portails.json écrit : ${comptes.universites} université(s), ${comptes.programmes} programme(s), ${comptes.bourses} bourse(s).`);
console.log("Ce second fichier NE DOIT PAS être servi par Hosting : firebase.json ignore functions/**.");
