/**
* ============================================================
* FitzUniverse — COMMENT ON ENTRE, QUAND IL N'Y A PAS DE PORTAIL
* ============================================================
*
* CE QUE CE FICHIER RÉPARE (lot PORTAILS, 2026-09-14)
* ----------------------------------------------------
* 147 universités sur 155 portent un portail d'admission. Les 8 autres
* n'en ont pas, et ce n'est pas un trou de catalogue : c'est un fait
* vérifié à la source, université par université.
*
*   Maroc (3)      « Les étudiants étrangers présenteront nécessairement
*                  leur candidature par voie diplomatique » — et, en
*                  toutes lettres sur le site de Cadi Ayyad : « Tout
*                  dossier non transmis par l'AMCI ne sera pas pris en
*                  considération ». Il n'existe AUCUN dépôt direct.
*   Tunisie (4)    aucune des quatre n'a de rubrique de candidature pour
*                  un étranger ; l'entrée est la procédure nationale du
*                  ministère de l'enseignement supérieur, et l'une des
*                  universités publiques du pays (UVT) le dit
*                  explicitement : « Si c'est votre première
*                  inscription… déposez votre candidature au niveau du
*                  ministère ».
*
* Jusqu'ici, l'étudiant ne lisait RIEN de tout cela. Le hub affichait le
* site de l'université et se taisait ; `liensDOpportunite` n'émet même
* pas de phrase d'orientation quand le portail d'admission manque — par
* prudence, parce qu'« on n'annonce jamais une porte qu'on ne montre
* pas ». La prudence était juste et le résultat était le pire possible :
* un étudiant accompagné vers le Maroc pouvait attendre des mois
* l'ouverture d'un portail qui n'existe pas, et manquer la seule date
* qui comptait — celle de l'ambassade.
*
* Un champ vide est une réponse. Encore faut-il qu'elle soit DITE.
*
* LA MÊME FORME QUE `exigences`, ET POUR LA MÊME RAISON
* -----------------------------------------------------
* Vocabulaire FERMÉ, un code par voie, un libellé et une explication à
* la deuxième personne. Un code inconnu — ajouté un jour à la main dans
* l'admin — est IGNORÉ, jamais affiché brut. Et la règle des trois
* valeurs vaut ici comme partout : champ absent = INCONNU, jamais
* « dépôt normal ». Une université dont personne n'a encore relevé la
* voie n'est pas une université sans voie particulière.
*
* CE CHAMP EST PUBLIC, CONTRAIREMENT AU PORTAIL
* ----------------------------------------------
* `applicationPortalUrl` est réservé aux abonnés (lot S3) : c'est une
* adresse qu'on paie. « Le dossier passe par l'ambassade » n'est pas une
* adresse, c'est un fait de procédure, et le cacher ne protégerait rien
* — il ferait juste perdre un an à un visiteur. Le champ vit donc dans
* le catalogue public, comme `exigences`.
*
* Aucun DOM, aucun Firestore : testable sous Node.
* ============================================================
*/

/**
* Le vocabulaire fermé des voies d'admission SANS portail en ligne.
*
* `explication` dit ce que l'étudiant doit FAIRE, et surtout ce qu'il ne
* doit PAS attendre. C'est la moitié qui compte : le défaut réparé ici
* n'est pas un manque d'information, c'est une attente vaine.
*
* DEUX LONGUEURS, PARCE QU'IL Y A DEUX ENDROITS (mesuré le 2026-09-14).
* ---------------------------------------------------------------------
* La première version n'avait que `explication` : 467 signes, posés sur
* la carte d'opportunité du hub, là où les trois phrases d'orientation
* existantes en font 68, 96 et 109. Sur quatre à six cartes, cela
* faisait une dizaine de lignes chacune — le hub n'aurait plus rien
* montré que ça, et la carte perd sa raison d'être quand son texte
* déborde son titre.
*
* `resume` est donc la version de la CARTE : le fait essentiel (pas de
* portail) et la direction, en une clause. `explication` reste la
* version de la FICHE, où il y a la place, et où l'étudiant vient
* justement chercher le détail.
*
* LA MESURE QUI FIXE LA LONGUEUR DU RÉSUMÉ. Une première version en
* faisait 175 signes : seule sur la carte elle tenait en cinq lignes,
* mais elle S'AJOUTE à l'orientation de la bourse — et sur une bourse
* tunisienne déposée chez le bailleur (109 signes) l'ensemble montait à
* 269 signes, huit lignes, mesuré au navigateur. La carte devenait un
* paragraphe. Le résumé fait donc moins de 100 signes : la pire
* combinaison (109 + 90) tient en six lignes, et le test du banc
* d'essai le vérifie sur cinq cartes côte à côte.
*
* Les deux longueurs disent la même chose — un test vérifie qu'aucune
* n'oublie qu'il n'y a PAS de portail, et que le résumé est bien plus
* court.
*/
export const VOIES_ADMISSION = {

voie_diplomatique_amci: {
libelle: "Candidature par voie diplomatique (AMCI)",
resume: "Pas de portail d'admission ici : le dossier passe par l'ambassade du Maroc, puis par l'AMCI.",
explication: "Cette université n'a pas de portail de candidature en ligne, et n'accepte aucun dépôt direct : le dossier passe par l'ambassade ou la représentation diplomatique du Maroc dans votre pays, qui le transmet à l'AMCI puis au ministère. C'est donc le calendrier de l'ambassade qu'il faut suivre, pas celui de l'université — n'attendez pas l'ouverture d'un portail, il n'y en aura pas. L'inscription se fait ensuite sur place, avec l'autorisation délivrée par le ministère."
},

procedure_nationale_ministere: {
libelle: "Procédure nationale du ministère",
resume: "Pas de portail d'admission ici : l'entrée est la procédure nationale du ministère.",
explication: "Cette université n'a pas de portail de candidature propre ouvert aux étudiants étrangers : la première inscription passe par la procédure nationale du ministère de l'enseignement supérieur du pays d'accueil. Commencez par elle — c'est là que se dépose le dossier et que se joue l'orientation vers un établissement. Le service de scolarité de l'université n'intervient qu'après, pour l'inscription elle-même."
},

depot_sur_place: {
libelle: "Dépôt du dossier sur place",
resume: "Pas de portail d'admission ici : le dossier se remet au service des admissions, sur place ou par la poste.",
explication: "Cette université ne reçoit pas les candidatures en ligne : le dossier se remet à son service des admissions, sur place ou par la poste. Comptez les délais d'acheminement, gardez une preuve de dépôt, et confirmez la liste des pièces par téléphone avant d'envoyer — elle change d'une année à l'autre et n'est pas toujours publiée."
}

};

/**
* La voie d'admission exploitable d'une université.
*
* @param {Object} universite - document `universities`
* @returns {string} "" quand le champ est absent, vide, ou porte un code
*          inconnu. Une chaîne vide veut dire « rien à afficher » —
*          JAMAIS « dépôt normal ».
*/
export function lireVoieAdmission(universite) {

const brut = universite && universite.voieAdmission;

if (typeof brut !== "string") return "";

const code = brut.trim();

// Un code inconnu disparaît ici, une fois pour toutes : aucun appelant
// n'a à se demander s'il peut afficher ce qu'il reçoit.
return VOIES_ADMISSION[code] ? code : "";

}

/**
* LA PHRASE À AFFICHER, ET LA CONDITION QUI LA DÉCLENCHE.
*
* Elle ne s'affiche QUE s'il n'y a pas de portail d'admission. Une
* université qui en a un n'a pas de voie particulière à expliquer : lui
* poser cette phrase à côté de son portail ferait douter du portail.
*
* @param {Object} ctx
* @param {string} ctx.portailAdmission  le portail résolu, ou ""
* @param {Object|string} ctx.universite  le document, ou le code seul
* @returns {string} la phrase, ou "" — et "" signifie « ne rien
*          afficher », pas « tout va bien ».
*/
function texteVoieAdmission(ctx, champ) {

const { portailAdmission = "", universite = null } = (ctx && typeof ctx === "object") ? ctx : {};

// Le portail passe devant. C'est l'ordre naturel et c'est aussi la
// garde : le jour où une de ces huit universités ouvrira un portail,
// la phrase s'éteindra toute seule, sans qu'on ait à retirer le code.
if (typeof portailAdmission === "string" && portailAdmission.trim()) return "";

const code = typeof universite === "string"
? (VOIES_ADMISSION[universite.trim()] ? universite.trim() : "")
: lireVoieAdmission(universite);

if (!code) return "";

return VOIES_ADMISSION[code][champ] || "";

}

/** La version LONGUE, pour la fiche — là où il y a la place. */
export function phraseVoieAdmission(ctx) {
return texteVoieAdmission(ctx, "explication");
}

/** La version COURTE, pour la carte du hub — à la longueur des autres orientations. */
export function resumeVoieAdmission(ctx) {
return texteVoieAdmission(ctx, "resume");
}

/** Le libellé court d'une voie — pour une pastille, jamais seul. */
export function libelleVoieAdmission(code) {
const meta = VOIES_ADMISSION[String(code || "").trim()];
return meta ? meta.libelle : "";
}

/**
* Les défauts de forme du vocabulaire — ce que le test appelle.
*
* La garde la plus utile est la dernière : une explication qui ne dit
* pas ce qu'il ne faut PAS attendre laisse l'étudiant guetter un portail
* qui n'existera jamais, et c'est exactement le défaut que ce fichier
* répare.
*/
export function defautsDesVoies() {

const defauts = [];

for (const [code, meta] of Object.entries(VOIES_ADMISSION)) {

if (!meta.libelle || !meta.libelle.trim()) defauts.push(`${code} : libellé absent`);
if (!meta.explication || meta.explication.length < 120) defauts.push(`${code} : explication trop courte pour dire quoi faire`);
if (/bientôt|prochainement|à venir|contactez-nous/i.test(meta.explication || "")) defauts.push(`${code} : « ${meta.explication.slice(0, 40)}… » renvoie la balle au lieu de répondre`);

// LES DEUX LONGUEURS DOIVENT DIRE LA MÊME CHOSE. Le résumé est celui
// que 95 % des étudiants liront (il est sur la carte) : s'il oublie
// qu'il n'y a pas de portail, le défaut réparé revient par la petite
// porte.
for (const [nom, texte] of [["explication", meta.explication], ["résumé", meta.resume]]) {
if (!texte || !texte.trim()) { defauts.push(`${code} : ${nom} absent`); continue; }
if (!/pas de portail|ne reçoit pas|aucun dépôt/i.test(texte)) defauts.push(`${code} : le ${nom} ne dit pas qu'il n'y a PAS de portail — c'est l'attente vaine qu'on répare`);
}

// LE RÉSUMÉ S'AJOUTE À L'ORIENTATION, IL N'EST PAS SEUL SUR LA CARTE.
// La plus longue des trois orientations existantes fait 109 signes ;
// mesuré au navigateur, 109 + 90 tient en six lignes et 109 + 159 en
// huit — c'est-à-dire un paragraphe. Le plafond est donc 110, pas 200.
if (meta.resume && meta.resume.length > 110) defauts.push(`${code} : résumé de ${meta.resume.length} signes — il s'ajoute à l'orientation de la bourse (jusqu'à 109 signes) et la carte devient un paragraphe`);
if (meta.resume && meta.explication && meta.resume.length >= meta.explication.length) defauts.push(`${code} : le résumé n'est pas plus court que l'explication`);

}

return defauts;

}
