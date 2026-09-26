/**
* ============================================================
* LOT 115 — LE PORTAIL DE DÉPÔT DES BOURSES SUISSES (2026-09-26)
* ============================================================
*
* Suite du lot 114. La bourse d'excellence de la Confédération suisse se
* dépose chez le bailleur (`entryPoint: "bourse"`), uniquement sur la
* plateforme GO ESKAS, mais elle n'avait pas de portail de dépôt : la
* fiche disait « le dossier se dépose auprès du bailleur », puis son
* bouton menait au site de l'université.
*
* Source relue le 2026-09-26 : sbfi.admin.ch, page « at a glance ». Le
* lien de la phrase « Scholarship applications only via this link
* (access available from 20 August 2026) » est celui posé ici, tel quel.
*
* Le champ est PRIVÉ : `node scripts\lot.mjs export` le range dans
* functions/data/catalogue-portails.json, pas dans l'instantané public.
* Il faut donc déployer AUSSI la fonction `portails`.
*
* Pas de garde `attendu` : le champ n'existe pas encore sur la bourse, et
* un « attendu » ne peut pas décrire un champ absent.
*
* EXÉCUTION (sur l'ordinateur de Charles, après la sauvegarde) :
*   node scripts\lot.mjs analyser 115-portail-eskas
*   node scripts\lot.mjs ecrire 115-portail-eskas
*   node scripts\lot.mjs verifier 115-portail-eskas
* ============================================================
*/

export const PORTAIL_ESKAS = "https://www.go.eskas.ch/BewerbungServlet?identifier=SBFI&kz_bew_pers=S&kz_bew_art=IN&aust_prog=CHECK&sprache=en&onlyEligibilityCheck=ELIG_CHECK_SUCCESS";

export const PATCHES = [
{
collection: "scholarships",
id: "swiss-government-excellence-scholarships",
champs: {
applicationPortalUrl: PORTAIL_ESKAS
},
motif: "Portail de dépôt GO ESKAS, lien officiel de la page « at a glance » du SEFRI (lue le 2026-09-26) : "
+ "« Scholarship applications only via this link ». La fiche renvoyait au site de l'université."
}
];
