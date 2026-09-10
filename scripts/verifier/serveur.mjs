/**
 * ============================================================
 * scripts/verifier/serveur.mjs — le site, servi en local
 * ============================================================
 *
 * Le harnais a besoin d'une VRAIE origine http:// : les modules ES
 * (`<script type="module">`) sont refusés par le navigateur sur
 * file://, et sessionStorage n'existe pas non plus sur ce protocole.
 * Un `file://results.html` ne prouverait donc rien du tout.
 *
 * C'est le même serveur que .claude/static-server.js, en module et
 * paramétrable (port 0 = le système choisit un port libre, donc deux
 * exécutions simultanées ne se marchent pas dessus).
 *
 * `Cache-Control: no-store` est volontaire : entre deux scénarios on
 * veut relire le fichier sur le disque, jamais une version gardée par
 * le navigateur. C'est exactement le piège qui nous a fait croire, le
 * 2026-09-05, qu'un correctif déployé ne marchait pas.
 * ============================================================
 */

import http from "node:http";
import zlib from "node:zlib";
import fs from "node:fs";
import path from "node:path";

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".woff2": "font/woff2"
};

export async function demarrerServeur({ racine, port = 0 } = {}) {

  const root = path.resolve(racine);

  const serveur = http.createServer((req, res) => {

    let chemin = decodeURIComponent(req.url.split("?")[0]);
    if (chemin === "/") chemin = "/index.html";

    const fichier = path.join(root, chemin);

    // Un chemin qui remonte au-dessus de la racine n'est jamais servi.
    if (!fichier.startsWith(root)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    fs.readFile(fichier, (err, data) => {

      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Not found");
        return;
      }

      // Lot PEIGNE-FIN (2026-09-10) : Firebase Hosting sert le texte (js,
      // css, json, html, svg) compressé — le harnais aussi, sinon la mesure
      // sur réseau lent compte catalogue.json à 734 Ko quand la production
      // en envoie 152.
      const type = TYPES[path.extname(fichier).toLowerCase()] || "application/octet-stream";
      const compressible = /^(text\/|application\/(javascript|json|xml))/.test(type) && /\bgzip\b/.test(req.headers["accept-encoding"] || "");
      const corps = compressible ? zlib.gzipSync(data) : data;

      res.writeHead(200, {
        "Content-Type": type,
        "Cache-Control": "no-store",
        ...(compressible ? { "Content-Encoding": "gzip" } : {})
      });

      res.end(corps);

    });

  });

  await new Promise((resolve) => serveur.listen(port, "127.0.0.1", resolve));

  const { port: portReel } = serveur.address();

  return {
    url: `http://127.0.0.1:${portReel}`,
    async arreter() {
      await new Promise((resolve) => serveur.close(resolve));
    }
  };

}
