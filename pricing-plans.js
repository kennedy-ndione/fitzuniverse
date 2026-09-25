// -------- pricing-plans.js --------
// Source unique des offres Fitz.
// Utilisé par offers.html et payment.html. Ce fichier ne contient
// volontairement aucune logique d'affichage ni de paiement : uniquement
// les données des offres et la construction du payload transmis à la
// future intégration PayDunya (Wave, Orange Money, carte bancaire).
//
// Le prix affiché sur payment.html est TOUJOURS relu depuis cet objet à
// partir du seul identifiant d'offre (jamais depuis une valeur stockée
// côté client) : le navigateur ne doit jamais pouvoir faire dire à la
// page un prix différent de celui défini ici. La vérification réelle et
// définitive reste néanmoins la responsabilité du futur backend.
//
// Aucun prix n'est exprimé en euros. Le champ `priceEUR` (supprimé le
// 2026-08-02) n'était plus lu que par payment.js pour afficher un
// "≈ N €" à côté du montant en F CFA — la grille est désormais 100%
// F CFA, seule devise réellement utilisée par les étudiants concernés.
//
// ==========================================================
// LES FORMULES EN VENTE — ET SEULEMENT ELLES (2026-09-24)
// ==========================================================
// Deux familles, et rien d'autre dans cet objet :
//
//  - BOURSES (`parcours: "bourse"`, champ `plan` du compte) :
//      fitzExpress      Pass Découverte, 10 000 F, 14 jours — le chat
//                       avec Fitz seul ; ce n'est pas une formule (il
//                       ne touche jamais `plan`) ;
//      premier-dossier  Forfait Premier Dossier, 25 000 F, 1 candidature ;
//      essentiel-4      Forfait Essentiel, 45 000 F, 4 candidatures ;
//      conseiller-6     Forfait Conseiller, 150 000 F, 6 candidatures,
//                       chacune relue par un conseiller.
//
//  - PRÉINSCRIPTIONS (`parcours: "preinscription"`) : Diagnostic
//    (10 000 F), Dossier (75 000 F), Dossier + Conseiller (150 000 F),
//    les MÊMES trois offres et les mêmes prix pour les neuf pays
//    (décision de Charles, 2026-09-24). La France s'écrit dans
//    `planPreinscription`, les huit autres dans `preinscriptionsPays`.
//
// LES ANCIENNES FORMULES ONT ÉTÉ SUPPRIMÉES LE 2026-09-24 (décision de
// Charles : « éradiquer toutes les anciennes formules du site qui ne sont
// plus utilisées »). `essentiel`, `accompagnement` (Ambition), `premium`,
// `signature-focus` et `signature` n'existent plus nulle part : ni ici, ni
// dans js/plan-features.js, ni dans functions/lib/achat.js, ni dans
// firestore.rules. Vérifié en base le jour même : aucun des 25 comptes ne
// les portait, aucun paiement ne les nommait. Un identifiant inconnu
// retombe sur « gratuit » (resolvePlan) : c'est le filet, pas un cas
// prévu.
//
// La règle qui reste : un NOUVEAU quota est un NOUVEL identifiant
// (`essentiel-4`, `conseiller-6`), jamais la modification d'un identifiant
// détenu par des comptes.
//
// Le diagnostic d'éligibilité bourses RESTE GRATUIT (décision explicite,
// grille A) : seule porte d'entrée gratuite du site, démonstration
// personnalisée que le catalogue fonctionne. Ne jamais le rattacher à
// une offre, Pass Découverte compris.
//
// ============================================================
// LOT PROMESSES (2026-09-20) — ON N'ÉCRIT PAS « SANS RESTRICTION »
// QUAND LE SERVEUR COMPTE.
//
// Chaque formule annonce son volume Fitz réel, lu dans
// functions/lib/fitz-acces.js (PLAFONDS) et converti avec les poids de
// functions/fitz.js (TACHES) : chat, e-mail, diagnostic et
// vérification 1 point ; traduction 3 ; lettre 4 ; analyse de dossier 7.
//
//   Pass Découverte 40/jour · Premier Dossier 50 · Essentiel 40
//   Conseiller 70 · Dossier 40 · Dossier + Conseiller 70
//
// SI UN PLAFOND CHANGE DANS functions/lib/fitz-acces.js, CES PHRASES
// DOIVENT CHANGER AVEC LUI. Un chiffre faux ici coûte plus cher qu'un
// chiffre absent : il se vérifie.
// ============================================================

const SCHOLARBRIDGE_PLANS = {

// ==========================================================
// POUR DÉMARRER
// ==========================================================

// `fitzExpress` n'est PAS une formule d'accompagnement — c'est un pass
// d'assistance ponctuelle, volontairement séparé des formules complètes :
// il ne doit jamais apparaître comme une colonne du tableau comparatif.
fitzExpress: {
id: "fitzExpress",
parcours: "bourse",
type: "pass",
label: "Pass Découverte",
icon: "zap",
tagline: "Des réponses immédiates de Fitz, sans engagement.",
badge: "Pass rapide",
// Lot VITRINE-COMMERCIALE (2026-09-11) : `niveau` place la carte dans
// l'un des trois rangs du composant unique (css/formule.css) —
// « entree », « recommande », « humain » — et `cta` est le libellé de
// son bouton, à la première personne. Lus par preinscription-
// destination.js et payment.js ; offers.html les recopie tels quels.
niveau: "entree",
cta: "Activer mon Pass Découverte",
priceFCFA: 10000,
duration: "14 jours",
fitzAccess: "Jusqu'à 40 questions à Fitz par jour, réponses instantanées",
// La déduction du pass sur une formule complète souscrite sous 30 jours
// a été supprimée le 2026-08-22 (décision commerciale : elle compliquait
// le calcul du montant à facturer). Le champ `note` qui la portait est
// retiré et non vidé — il n'était lu par aucun fichier, c'était une
// donnée morte. Si une condition commerciale doit réapparaître un jour,
// la rétablir ici ET la brancher quelque part, sinon elle ne s'affichera
// nulle part.
// Lot VITRINE-COMMERCIALE (2026-09-11) : chaque puce est un bénéfice
// concret, et chacune correspond à ce que le Pass ouvre vraiment —
// le chat avec Fitz, rien d'autre (hasFitzExpressAccess). Le texte
// des cartes d'offers.html est le même, mot pour mot :
// test/vitrine-commerciale.test.mjs les compare.
highlights: [
"Toutes vos questions à Fitz, pendant 14 jours",
"Vos critères et vos procédures expliqués, bourse par bourse",
"Une orientation vers les programmes faits pour votre profil",
"Sans engagement : le Pass s'arrête tout seul au bout de 14 jours"
]
},

// Une candidature, accompagnée de bout en bout — sans abonnement.
// RESSUSCITÉE le 2026-08-29 (décision utilisateur, chantier grille
// tarifaire) après sa dépréciation du 2026-08-15 : il manquait une
// marche entre Découverte (parler à Fitz, 10 000 F) et Standard
// (5 candidatures, 29 000 F) — la porte d'entrée vers le produit
// cœur, LA candidature de l'étudiant. Prix relevé de 12 000 à
// 15 000 F le 2026-08-29, puis de 15 000 à 25 000 F le 2026-09-11
// (décision de Charles, lot VITRINE-COMMERCIALE — seul prix de la
// grille à bouger ce jour-là) : un pas net au-dessus de Découverte, et
// un prix PAR candidature volontairement ~2,2× celui d'Essentiel
// (45 000 F / 4 = 11 250 F ; garde-fou anti-cannibalisation : Solo
// n'est jamais la bonne affaire pour qui veut plusieurs dossiers).
// Miroir serveur : functions/lib/achat.js (GRILLE) — le prix facturé
// est calculé là-bas, celui-ci n'est qu'affiché. Pas de déduction sur les formules
// supérieures (décision utilisateur du 2026-08-29, cohérente avec la
// suppression des déductions du 2026-08-22). Même identifiant
// qu'avant la dépréciation : quota, accès outils et redirection
// post-achat (payment.js: applications.html?action=new) étaient
// restés câblés — les comptes de l'époque (achetés 12 000 F)
// continuent de fonctionner à l'identique.
"premier-dossier": {
id: "premier-dossier",
parcours: "bourse",
type: "unit",
// EN VENTE — ne pas remettre `deprecated: true` ici.
// Ce commentaire affirmait l'inverse jusqu'au 2026-09-01 : une passe
// de nettoyage avait lu la dépréciation du 2026-08-15 dans l'en-tête
// sans voir la RÉSURRECTION du 2026-08-29 documentée juste au-dessus,
// et avait « restauré » un drapeau qui n'avait pas été perdu mais
// délibérément retiré. Effet réel : offers.html affichait un bouton
// d'achat actif que payment.js refusait ensuite — le clic menait à un
// mur. Le commentaire ayant lui-même causé l'erreur, il est réécrit
// plutôt que supprimé.
// L'offre est vendue (décision utilisateur du 2026-09-01). Sa mise
// hors vente, si elle revient un jour, se décide en même temps que le
// retrait de son bouton dans offers.html : test/offers-plans.test.mjs
// interdit désormais qu'une offre dépréciée garde un bouton d'achat.
label: "Forfait Premier Dossier",
icon: "file-text",
tagline: "Votre candidature, accompagnée de bout en bout — sans abonnement.",
badge: "Pour démarrer",
niveau: "entree",
cta: "Commencer mon premier dossier",
priceFCFA: 25000,
maxAccompaniedApplications: 1,
extendsPendingApplications: true,
fitzAccess: "Tous les outils Fitz — jusqu'à 50 questions ou 7 analyses de dossier par jour",
highlights: [
"Votre première candidature, accompagnée de bout en bout",
"Votre lettre de motivation et vos e-mails rédigés avec Fitz",
"Votre dossier vérifié pièce par pièce avant le dépôt",
"Un suivi maintenu jusqu'à la réponse de l'université",
"Un paiement unique, sans abonnement"
]
},

// ==========================================================
// GRILLE A (2026-09-07) — LES DEUX OFFRES BOURSES RÉVISÉES.
// Quatre offres en vente côté bourses : fitzExpress, premier-dossier,
// et ces deux-ci. La promesse est la PROFONDEUR (« 4 candidatures
// accompagnées à fond »), jamais le volume ni un prix par candidature.
// La messagerie FitzUniverse était réservée, côté bourses, au Forfait
// Conseiller ; elle est OUVERTE À TOUS LES COMPTES depuis le 2026-09-23
// (DROITS_UNIVERSELS, js/plan-features.js). Ce qui reste propre au
// Conseiller : le conseiller dédié et la relecture. Toute formule payante
// garde une voie de service après-vente séparée (« Signaler un
// problème », support_ticket). Aucune offre en vente ne porte WhatsApp.
// ==========================================================

"essentiel-4": {
id: "essentiel-4",
parcours: "bourse",
type: "plan",
label: "Forfait Essentiel",
icon: "compass",
tagline: "4 candidatures accompagnées à fond, avec Fitz.",
badge: "4 candidatures à fond",
niveau: "recommande",
cta: "Commencer avec Essentiel",
priceFCFA: 45000,
// Lot ACCEPTATION (2026-09-11), décision 7 de Charles : PLUS DE DURÉE EN
// MOIS. Une formule bourses se définit par son nombre de candidatures,
// chacune suivie jusqu'à la décision de l'université ; la suite, c'est
// l'équipe qui la décide. `duration` retirée (elle valait « 6 mois »).
// Exception assumée à la règle « un objet existant ne se modifie pas » :
// aucun client payant ne détenait cette formule, et le changement ne
// retire rien — il enlève une limite.
maxAccompaniedApplications: 4,
extendsPendingApplications: true,
fitzAccess: "Tous les outils Fitz — jusqu'à 40 questions ou 5 analyses de dossier par jour",
highlights: [
"4 candidatures accompagnées à fond, en même temps",
"Votre lettre de motivation rédigée avec Fitz pour chaque université",
"100 % des outils Fitz : e-mails, vérification du dossier, traduction, compression",
"Discuter avec Fitz au fil de la journée, et l'entraînement aux tests calé sur vos échéances",
"Préparation aux entretiens, et chaque candidature suivie jusqu'à la décision de l'université",
"Service après-vente : signaler un problème, réponse généralement sous 48 h ouvrées"
]
},

"conseiller-6": {
id: "conseiller-6",
parcours: "bourse",
type: "human",
label: "Forfait Conseiller",
icon: "user-check",
tagline: "6 candidatures, chacune relue par un conseiller avant l'envoi.",
badge: "Accompagnement humain",
niveau: "humain",
cta: "Être accompagné par un conseiller",
priceFCFA: 150000,
// Lot ACCEPTATION (2026-09-11) : plus de durée en mois — voir la note
// d'essentiel-4 ci-dessus (même exception assumée, même raison).
// `duration` retirée (elle valait « 9 mois »).
maxAccompaniedApplications: 6,
extendsPendingApplications: true,
fitzAccess: "Tous les outils Fitz — jusqu'à 70 questions ou 10 analyses de dossier par jour",
highlights: [
"6 candidatures accompagnées à fond, chacune relue par un conseiller",
"Un humain vérifie chaque dossier avant l'envoi",
"Demandes de revue tracées : faites relire lettre ou dossier avant chaque dépôt",
"Messagerie FitzUniverse : échanges directs avec votre conseiller, réponse généralement sous 48 h ouvrées",
"Tout le contenu du Forfait Essentiel, Fitz en renfort",
"Chaque candidature suivie jusqu'à la décision de l'université"
]
},

// ==========================================================
// GRILLE B — PRÉINSCRIPTIONS (2026-09-07). Un SECOND forfait, qui
// coexiste avec le forfait bourse : `users.planPreinscription` (France)
// et `users.preinscriptionsPays` (les huit autres pays, depuis le
// 2026-09-23), écrits par le webhook seul, jamais `plan`. Trois offres
// décidées, ne pas rouvrir ; les mêmes, au même prix, dans les neuf pays
// (voir DESTINATIONS_OFFRE plus bas). Paiement en une fois, jamais de
// remboursement, jamais de mensualité. `maxPreinscriptions` = les 7
// vœux d'un dossier Études en France — dupliqué dans firestore.rules
// (pre-[1-7]) et functions/lib/achat.js, test/grille-b.test.mjs
// échoue si l'un des trois diverge.
// ==========================================================

"diagnostic-france": {
id: "diagnostic-france",
parcours: "preinscription",
// RETIRÉ DE LA VENTE le 2026-09-25 (lot 97, décision de Charles : « tout
// gratuit, argent compris »). Le diagnostic de chaque pays est ouvert à
// tout compte, gratuit compris ; le serveur (functions/lib/achat.js)
// refuse tout nouvel achat et honore un paiement lancé avant. Les comptes
// qui l'ont acheté gardent leur identifiant et leurs droits.
deprecated: true,
type: "pass",
label: "Diagnostic France",
icon: "calculator",
tagline: "Une réponse honnête avant de payer Campus France.",
badge: "Avant de payer",
niveau: "entree",
cta: "Faire mon Diagnostic France",
priceFCFA: 10000,
duration: "14 jours",
fitzAccess: "Aucun outil Fitz : de l'arithmétique sur des seuils publiés, avec leurs sources",
maxPreinscriptions: 0,
// Lot DIAGNOSTIC-2 (2026-09-09) : la promesse suit ce que la page rend
// vraiment. Elle ne rendait qu'un total ; elle rend maintenant un
// verdict, les points de vigilance du pays, le calendrier en jours, les
// leviers et les étapes — et la dernière ligne dit ce que devient le
// prix si l'accompagnement suit.
highlights: [
"Un verdict en une phrase : votre projet tient, ou il manque X € — au mois ou sur l'année",
"Chaque montant avec sa source officielle et sa date de vérification",
"Les points de vigilance de votre pays, avant qu'ils ne coûtent une année",
"Votre calendrier en jours, et les étapes de votre procédure, en entier",
"Ce qui peut faire baisser le total : niveau, exonération, université, bourses ouvertes",
"Les 10 000 F se déduisent d'un Dossier France acheté dans les 30 jours"
]
},

"dossier-france": {
id: "dossier-france",
parcours: "preinscription",
type: "campagne",
label: "Dossier France",
icon: "file-check",
tagline: "Un dossier Études en France, jusqu'à 7 vœux, accompagné jusqu'au dépôt.",
badge: "Une campagne",
niveau: "recommande",
cta: "Préparer mon dossier France",
priceFCFA: 75000,
duration: "une campagne, jusqu'au 31 juillet",
fitzAccess: "Documents, traductions et légalisations, preuve de ressources, préparation à l'entretien, messagerie FitzUniverse",
maxPreinscriptions: 7,
highlights: [
"Jusqu'à 7 vœux suivis, du profil au dépôt : pièces, traductions et légalisations, preuve de ressources",
"Votre diagnostic gratuit repris dans votre dossier",
"Vos lettres de vœu et vos e-mails rédigés avec Fitz, votre dossier vérifié avant l'envoi",
"Préparation à l'entretien Campus France",
"Messagerie FitzUniverse pour vos questions, réponse généralement sous 48 h ouvrées",
"Vous gardez la main : un dossier complet et vérifié, que vous déposez vous-même sur Études en France"
]
},

"dossier-france-conseiller": {
id: "dossier-france-conseiller",
parcours: "preinscription",
type: "campagne",
label: "Dossier France + Conseiller",
icon: "user-check",
// Lot PRÉINSCRIPTIONS-VITRINE (2026-09-09) : le montant est PARTI de
// cette phrase, et pour deux raisons qui se renforcent. Il était faux
// hors du Sénégal — 80 000 F en Côte d'Ivoire, 101 000 au Cameroun,
// 1 500 000 GNF en Guinée — et il publiait sur offers.html, page
// publique, un chiffre que le Diagnostic vend. La phrase garde toute sa
// force sans lui : ce qui fait peur, ce n'est pas le montant, c'est
// « non remboursables ».
tagline: "Le même dossier, plus une relecture humaine avant des frais de dossier non remboursables.",
badge: "Relecture humaine",
niveau: "humain",
cta: "Préparer mon dossier avec un conseiller",
priceFCFA: 150000,
duration: "une campagne, jusqu'au 31 juillet",
fitzAccess: "Tout Dossier France, plus la relecture de votre conseiller",
maxPreinscriptions: 7,
highlights: [
"Tout le contenu de Dossier France",
"Une relecture humaine de votre dossier AVANT le paiement des frais de dossier Campus France, non remboursables",
"Un conseiller joignable pendant toute la campagne",
"Vous gardez la main : un dossier complet et vérifié, que vous déposez vous-même sur Études en France"
]
}

};

// Exposition explicite sur `window` — NE PAS SUPPRIMER.
// Ce fichier est chargé comme script classique : un `const` de premier
// niveau entre dans l'environnement lexical global mais ne devient PAS
// une propriété de `window`. Or applications.js et
// admin/student-detail.js lisent `window.SCHOLARBRIDGE_PLANS` — sans
// cette ligne ils recevaient `undefined`, donc le quota de candidatures
// n'était jamais appliqué et le panneau admin affichait toujours
// "formule Gratuit". Corrigé le 2026-08-02.
window.SCHOLARBRIDGE_PLANS = SCHOLARBRIDGE_PLANS;

// Construit l'objet transmis à payment.html (URL + sessionStorage) et,
// plus tard, à la passerelle PayDunya. Ne déclenche aucun paiement ici.
function buildCheckoutPayload(planId, destination) {

const plan = typeof offrePourDestination === "function" ? offrePourDestination(planId, destination) : SCHOLARBRIDGE_PLANS[planId];

if (!plan) return null;

return {
plan: plan.id,
destination: plan.destination || "france",
label: plan.label,
priceFCFA: plan.priceFCFA,
currency: "XOF",
selectedAt: new Date().toISOString()
};

}

// ==========================================================
// LES 10 000 F DU DIAGNOSTIC SE DÉDUISENT (lot DIAGNOSTIC-2, 2026-09-09)
// ==========================================================
//
// MIROIR de functions/lib/achat.js (DEDUCTION_DIAGNOSTIC, diagnosticPayeLe,
// prixAvecDeduction). Dupliqué volontairement, comme les prix et les
// quotas : une Cloud Function ne peut pas importer un module du site.
// test/grille-b.test.mjs échoue si les deux divergent.
//
// CE CALCUL NE FAIT PAS FOI. Il décide de ce qui est AFFICHÉ ; le
// montant facturé est recalculé côté serveur, à partir du seul
// identifiant de formule que le navigateur envoie. Un prix affiché faux
// serait une erreur d'affichage, jamais une remise obtenue.

const DEDUCTION_DIAGNOSTIC = {
offre: "diagnostic-france",
montant: 10000,
jours: 30,
plans: ["dossier-france", "dossier-france-conseiller"],
mention: "vos 10 000 F de diagnostic sont déduits",
// La durée du diagnostic (14 j) ne sert QUE au filet ci-dessous, pour
// les comptes payés avant ce lot. Elle est ici en clair plutôt que lue
// dans le champ duration, qui vaut la chaîne « 14 jours » : analyser
// une phrase pour en tirer un nombre est le genre de fragilité qui
// casse le jour où quelqu'un écrit « deux semaines ».
dureeDiagnosticJours: 14
};

window.SCHOLARBRIDGE_DEDUCTION = DEDUCTION_DIAGNOSTIC;

function dateDeDiagnostic(user, destination) {

const u = user || {};

// Hors France (2026-09-23) : la date du diagnostic DU MÊME PAYS, posée
// par le webhook dans preinscriptionsPays.<pays>.diagnosticPayeLe.
if (destination && destination !== "france") {
const entree = u.preinscriptionsPays && u.preinscriptionsPays[destination];
const d = entree && entree.diagnosticPayeLe ? new Date(entree.diagnosticPayeLe) : null;
return d && !isNaN(d.getTime()) ? d : null;
}

const explicite = u.diagnosticPayeLe ? new Date(u.diagnosticPayeLe) : null;
if (explicite && !isNaN(explicite.getTime())) return explicite;

// Filet pour les comptes qui ont payé AVANT ce lot : l'échéance du
// diagnostic en cours, moins sa durée. Il s'éteint tout seul, puisque
// tout nouvel achat pose `diagnosticPayeLe`.
if (String(u.planPreinscription || "") !== DEDUCTION_DIAGNOSTIC.offre) return null;

const expiration = u.planPreinscriptionExpiresAt ? new Date(u.planPreinscriptionExpiresAt) : null;
if (!expiration || isNaN(expiration.getTime())) return null;

const duree = DEDUCTION_DIAGNOSTIC.dureeDiagnosticJours;
return new Date(expiration.getTime() - duree * 86400000);

}

/**
* Le prix à AFFICHER pour une formule, déduction faite.
* @returns {{prix:number, base:number, deduction:number, mention:string}|null}
*/
function prixAvecDeduction(planId, user, maintenant, destination) {

const plan = SCHOLARBRIDGE_PLANS[planId];
if (!plan) return null;

const base = plan.priceFCFA;
const rien = { prix: base, base, deduction: 0, mention: "" };

if (!DEDUCTION_DIAGNOSTIC.plans.includes(planId)) return rien;

const paye = dateDeDiagnostic(user, destination);
if (!paye) return rien;

const jours = Math.floor(((maintenant || new Date()).getTime() - paye.getTime()) / 86400000);
if (jours < 0 || jours > DEDUCTION_DIAGNOSTIC.jours) return rien;

return { prix: base - DEDUCTION_DIAGNOSTIC.montant, base, deduction: DEDUCTION_DIAGNOSTIC.montant, mention: DEDUCTION_DIAGNOSTIC.mention };

}

window.prixAvecDeduction = prixAvecDeduction;

// ==========================================================
// LES HUIT AUTRES DESTINATIONS (2026-09-23, décision de Charles)
// ==========================================================
//
// La même grille que la France — 10 000 / 75 000 / 150 000 F — et les
// MÊMES identifiants d'offre. La destination voyage avec l'achat
// (payment.html?plan=dossier-france&destination=italie) jusqu'au
// serveur, qui la vérifie et ouvre users/{uid}.preinscriptionsPays.<pays>.
//
// Ce tableau ne dit que ce qu'une CARTE d'offre doit dire autrement :
// le nom du pays, la bonne préposition, le portail où l'étudiant déposera
// lui-même, et le nombre de vœux suivis. MIROIR de
// js/destinations-preinscription.js (plafondVoeux) et des motifs de
// firestore.rules (pre-<code>-N) : test/destinations-preinscription.test.mjs
// échoue si l'un diverge.

const DESTINATIONS_OFFRE = {
roumanie: { nom: "Roumanie", dans: "en Roumanie", pour: "pour la Roumanie", portail: "le portail de votre université", voeux: 7 },
turquie: { nom: "Turquie", dans: "en Turquie", pour: "pour la Turquie", portail: "Türkiye Bursları ou le site de chaque université", voeux: 12 },
maroc: { nom: "Maroc", dans: "au Maroc", pour: "pour le Maroc", portail: "le service national de votre pays (voie AMCI) ou le site de l'université privée", voeux: 7 },
italie: { nom: "Italie", dans: "en Italie", pour: "pour l'Italie", portail: "Universitaly", voeux: 1 },
allemagne: { nom: "Allemagne", dans: "en Allemagne", pour: "pour l'Allemagne", portail: "uni-assist ou le site de l'université", voeux: 7 },
canada: { nom: "Canada", dans: "au Canada", pour: "pour le Canada", portail: "le site de chaque université, puis votre compte IRCC", voeux: 7 },
chine: { nom: "Chine", dans: "en Chine", pour: "pour la Chine", portail: "le site de chaque université, ou le système de bourses du CSC", voeux: 7 },
malaisie: { nom: "Malaisie", dans: "en Malaisie", pour: "pour la Malaisie", portail: "le site de chaque université, puis la plateforme EMGS pour le visa", voeux: 7 }
};

window.SCHOLARBRIDGE_DESTINATIONS = DESTINATIONS_OFFRE;

/**
* L'offre préinscription telle qu'elle se vend POUR UNE DESTINATION.
* La France (ou une destination absente) rend l'offre telle quelle ; une
* autre destination rend une COPIE aux textes du pays, au même prix.
* Jamais de mutation de SCHOLARBRIDGE_PLANS.
*/
function offrePourDestination(planId, destination) {

const plan = SCHOLARBRIDGE_PLANS[planId];
if (!plan) return null;
const d = Object.prototype.hasOwnProperty.call(DESTINATIONS_OFFRE, destination) ? DESTINATIONS_OFFRE[destination] : null;
if (plan.parcours !== "preinscription" || !d) return plan;

const unVoeu = d.voeux === 1;
const voeux = unVoeu ? "Votre cours suivi" : `Jusqu'à ${d.voeux} vœux suivis`;

if (planId === "diagnostic-france") {
return Object.assign({}, plan, {
destination: destination,
label: `Diagnostic ${d.nom}`,
tagline: `Une réponse honnête avant d'engager des frais ${d.dans}.`,
cta: `Faire mon Diagnostic ${d.nom}`,
fitzAccess: "Aucun outil Fitz : de l'arithmétique sur des montants publiés, avec leurs sources",
highlights: [
"Un verdict en une phrase : vos ressources face au seuil exigé pour le visa, quand le pays en fixe un",
"Chaque montant avec sa source officielle et sa date de vérification",
`Le coût de l'année ${d.dans} : droits d'inscription, frais de dossier, visa, titre de séjour`,
"Le calendrier publié et les étapes de la procédure, en entier",
`Les 10 000 F se déduisent d'un Dossier ${d.nom} acheté dans les 30 jours`
]
});
}

const conseiller = planId === "dossier-france-conseiller";
return Object.assign({}, plan, {
destination: destination,
label: conseiller ? `Dossier ${d.nom} + Conseiller` : `Dossier ${d.nom}`,
tagline: conseiller
? "Le même dossier, plus une relecture humaine avant de déposer ou de payer des frais non remboursables."
: `Votre dossier ${d.pour}, accompagné étape par étape, du premier papier au départ.`,
cta: conseiller ? "Préparer mon dossier avec un conseiller" : `Préparer mon dossier ${d.nom}`,
duration: "12 mois",
maxPreinscriptions: d.voeux,
fitzAccess: conseiller
? `Tout le Dossier ${d.nom}, plus la relecture de votre conseiller`
: "Documents, traductions, lettres et e-mails avec Fitz, vérification avant dépôt, préparation aux entretiens, messagerie FitzUniverse",
highlights: conseiller ? [
`Tout le contenu du Dossier ${d.nom}`,
"Une relecture humaine de votre dossier AVANT le dépôt et avant tout frais non remboursable",
"Un conseiller joignable pendant les douze mois de votre accompagnement",
`Vous gardez la main : vous déposez vous-même sur ${d.portail}`
] : [
unVoeu ? `${voeux} de la préinscription au départ — ${d.dans}, la règle est d'un seul cours` : `${voeux}, de la première pièce au visa`,
"Votre diagnostic gratuit repris dans votre dossier",
"La procédure officielle expliquée étape par étape, en français simple, avec ses sources",
"Vos lettres et vos e-mails rédigés avec Fitz, votre dossier vérifié avant l'envoi",
"Messagerie FitzUniverse pour vos questions, réponse généralement sous 48 h ouvrées",
`Vous gardez la main : vous déposez vous-même sur ${d.portail}`
]
});

}

window.offrePourDestination = offrePourDestination;
