/**
* ============================================================
* LOT 120 — LE SITE OFFICIEL DE BEIHANG (2026-09-26)
* ============================================================
*
* Trouvé par l'audit des liens externes (lot 119), puis vérifié à la main
* dans le navigateur, avec l'accord de Charles :
*   - https://en.buaa.edu.cn/ ne répond plus (navigation échouée deux fois) ;
*   - https://www.buaa.edu.cn/, le site chinois, répond ;
*   - https://ev.buaa.edu.cn/ répond : c'est le site anglais de
*     l'université, titré « Beihang University », lu le 2026-09-26.
*
* Seul lien des 30 suspects à corriger dans les données. Les autres sont
* vivants, protégés par une vérification anti-robot (non franchie), ou
* injoignables depuis cet ordinateur alors que le lien est bien le lien
* officiel (le site de KNUST renvoie lui-même à mcf.knust.edu.gh).
*
* EXÉCUTION (sur l'ordinateur de Charles, APRÈS la sauvegarde) :
*   node scripts\lot.mjs analyser 120-beihang-site
*   node scripts\lot.mjs ecrire 120-beihang-site
*   node scripts\lot.mjs verifier 120-beihang-site
*   node scripts\lot.mjs export
* ============================================================
*/

export const PATCHES = [
{
collection: "universities",
id: "beihang-university-pekin",
attendu: { officialWebsite: "https://en.buaa.edu.cn/" },
champs: { officialWebsite: "https://ev.buaa.edu.cn/" },
motif: "en.buaa.edu.cn ne répond plus (2026-09-26) ; ev.buaa.edu.cn est le site anglais officiel de Beihang, lu le même jour."
}
];
