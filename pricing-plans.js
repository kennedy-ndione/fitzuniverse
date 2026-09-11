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
// "≈ N €" à côté du montant en FCFA — la grille est désormais 100%
// FCFA, seule devise réellement utilisée par les étudiants concernés.
//
// ==========================================================
// STRUCTURE DE L'OFFRE (révisée 2026-08-15)
// ==========================================================
// Deux familles, distinguées par `type` :
//
//  - "pass" / "plan"  → AUTONOME. Découverte (pass ponctuel, sans
//    abonnement) puis Standard / Avancé (abonnements, 100% outils Fitz).
//    Standard et Avancé se différencient par le nombre de candidatures
//    accompagnées (`maxAccompaniedApplications`), la durée et le niveau
//    de service humain (relecture, prépa entretien, alertes).
//
//  - "human"          → ACCOMPAGNÉ. Renforcé et Signature : un
//    conseiller réel, Fitz venant en renfort plutôt que seul.
//
// CHANGEMENT DE POSITIONNEMENT (2026-08-02, toujours valable) : Avancé
// ajoute de vrais services humains par rapport à Standard (relecture,
// prépa entretien) — la règle "seule différence = le quota" est
// abandonnée depuis cette date. Les OUTILS FITZ, eux, restent inclus à
// 100% dans toutes les offres payantes (y compris les offres
// dépréciées, tant qu'un compte existant les détient) — aucun outil
// n'est réservé à une offre supérieure. C'est pourquoi
// js/plan-features.js (qui ne pilote que les outils Fitz) reste
// inchangé par la grille du 2026-08-15 ci-dessous.
//
// ==========================================================
// CONVENTION "deprecated" (introduite 2026-08-15)
// ==========================================================
// `deprecated: true` sur une offre signifie : retirée de la VENTE
// PUBLIQUE (grille de offers.html, tout futur tableau comparatif,
// suggestions d'upsell côté dashboard — voir nextPlanId()/
// unlockingPlans() dans js/access-guard.js, qui l'excluent désormais),
// mais JAMAIS supprimée de cet objet. Un compte existant déjà sur cette
// offre continue de fonctionner exactement comme avant : quota, accès
// aux outils Fitz, résolution par identifiant (admin, applications.js,
// dashboard.js) — tout code qui lit SCHOLARBRIDGE_PLANS[planId] par
// identifiant plutôt que d'en parcourir toutes les clés n'a rien à
// changer. Supprimer une entrée casserait ces comptes ; forcer une
// migration vers une autre offre supposerait une équivalence qui
// n'existe pas toujours (ex. `premier-dossier` était un achat unique
// sans durée, `essentiel`/Standard est un abonnement).
// `premium` est dépréciée depuis la grille du 2026-08-15 (remplacée
// par Avancé, dont le quota est désormais identique — 12
// candidatures). `premier-dossier` l'a été aussi ce jour-là, puis a
// été RESSUSCITÉE le 2026-08-29 — voir le commentaire sur son entrée.
//
// GRILLE A (2026-09-07) — LA PROFONDEUR REMPLACE LE COMPTAGE.
// Mesuré sur l'export réel : 156 bourses, 72 ouvertes, 27 déposées par
// un tiers, 60 déposables soi-même et non exclues pour le Sénégal
// (Licence 30, Master 42, Doctorat 28) ; le harnais retient 8 à 12
// opportunités par profil réel. Au-dessus de 9, un quota ne
// différencie plus rien, et « illimité » est faux par construction.
// D'où : `essentiel` (5) → `essentiel-4` (4, 6 mois, 45 000 F) ;
// `signature-focus` (12) → `conseiller-6` (6, 9 mois, 150 000 F) ;
// `accompagnement` (Ambition, 9) et `signature` (illimité) sortent de
// la vente. RÈGLE D'OR : aucun objet existant n'a été modifié (prix,
// quota, durée, fonctionnalités) — un client Essentiel garde ses 5
// candidatures et sa messagerie ; les anciens identifiants restent
// dans firestore.rules avec leurs droits d'origine. Les NOUVEAUX
// identifiants portent le quota dans leur nom : un nouveau quota sera
// un nouvel identifiant, jamais une modification.
//
// Le diagnostic d'éligibilité bourses RESTE GRATUIT (décision explicite,
// grille A) : seule porte d'entrée gratuite du site, démonstration
// personnalisée que le catalogue fonctionne. Ne jamais le rattacher à
// une offre, Pass Découverte compris.
//
// ==========================================================
// IDENTIFIANTS — ne pas renommer à la légère
// ==========================================================
// `fitzExpress` et `accompagnement` gardent leur identifiant historique
// alors que la grille commerciale les nomme "Découverte" et "Avancé".
// Ce n'est pas un oubli : `accompagnement` est l'une des valeurs de
// PLAN_ORDER (js/plan-features.js), la clé du document Firestore
// `config/planFeatures`, ET la valeur écrite dans `users/{uid}.plan`
// des comptes existants. Le renommer demanderait une migration de
// données, pas seulement une mise à jour des points d'appel.
// Depuis la grille du 2026-08-15, `signature-focus` porte lui aussi un
// nom commercial ("Renforcé") différent de son identifiant interne — même
// raisonnement : il reste la clé PLAN_ORDER/Firestore d'origine, seul
// `label` change. Un identifiant interne et un nom commercial peuvent
// donc légitimement diverger ; ne jamais déduire l'un de l'autre.

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
priceFCFA: 10000,
duration: "14 jours",
fitzAccess: "Questions illimitées, réponses instantanées",
// La déduction du pass sur une formule complète souscrite sous 30 jours
// a été supprimée le 2026-08-22 (décision commerciale : elle compliquait
// le calcul du montant à facturer). Le champ `note` qui la portait est
// retiré et non vidé — il n'était lu par aucun fichier, c'était une
// donnée morte. Si une condition commerciale doit réapparaître un jour,
// la rétablir ici ET la brancher quelque part, sinon elle ne s'affichera
// nulle part.
highlights: [
"Questions illimitées à Fitz pendant 14 jours",
"Explication des critères et des procédures de candidature",
"Orientation vers les programmes adaptés à votre profil"
]
},

// Une candidature, accompagnée de bout en bout — sans abonnement.
// RESSUSCITÉE le 2026-08-29 (décision utilisateur, chantier grille
// tarifaire) après sa dépréciation du 2026-08-15 : il manquait une
// marche entre Découverte (parler à Fitz, 10 000 F) et Standard
// (5 candidatures, 29 000 F) — la porte d'entrée vers le produit
// cœur, LA candidature de l'étudiant. Prix relevé de 12 000 à
// 15 000 F : un pas net au-dessus de Découverte, et un prix PAR
// candidature volontairement ~1,67× celui de Standard (garde-fou
// anti-cannibalisation : Solo n'est jamais la bonne affaire pour qui
// veut plusieurs dossiers). Pas de déduction sur les formules
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
priceFCFA: 15000,
maxAccompaniedApplications: 1,
extendsPendingApplications: true,
fitzAccess: "100% des outils Fitz, sans restriction",
highlights: [
"1 candidature accompagnée de bout en bout",
"100% des outils Fitz : lettre, CV, e-mails, traduction",
"Vérification complète du dossier avant dépôt",
"Suivi maintenu jusqu'à la réponse de l'université",
"Paiement unique, sans abonnement"
]
},

// ==========================================================
// AUTONOME — Standard / Avancé
// Durées et quotas propres à chaque offre : ne plus supposer une durée
// commune. Échelle du 2026-08-29, calée sur le rythme réel d'une
// campagne de bourses (fenêtres ouvertes 8-12 mois avant la rentrée,
// cycle complet en 6-9 mois) : Standard 6 mois (une vraie saison),
// Avancé et Renforcé 9 mois (12 dossiers chevauchent souvent deux
// fenêtres ; durées IDENTIQUES pour que l'écart de prix reste
// uniquement l'humain), Signature 12 mois. La durée n'achète que la
// fenêtre d'ouverture de NOUVEAUX dossiers — les candidatures déposées
// restent suivies jusqu'à la décision (extendsPendingApplications).
// ==========================================================

// DÉPRÉCIÉE (grille A, 2026-09-07) : remplacée par `essentiel-4`
// (même prix, même durée, quota 4 — la profondeur plutôt que le
// comptage). Honorée telle quelle pour qui la détient : 5 candidatures
// ET la messagerie FitzUniverse restent acquises (firestore.rules,
// js/plan-features.js). Ne rien modifier ici.
essentiel: {
id: "essentiel",
parcours: "bourse",
type: "plan",
deprecated: true,
label: "Forfait Essentiel",
icon: "compass",
tagline: "Jusqu'à 5 candidatures accompagnées de bout en bout, avec Fitz.",
badge: "Jusqu'à 5 candidatures",
// 29 000 → 45 000 le 2026-08-29 (décision utilisateur, voir le chantier
// grille) : à 29 000 F, 5 candidatures coûtaient à peine 2× l'unité
// (Premier Dossier 15 000 F) — le volume écrasait la valeur du travail.
// À 45 000 F : 9 000 F/candidature, toujours 1,67× moins cher que
// l'unité — l'upgrade reste évident sans devenir insultant.
priceFCFA: 45000,
duration: "6 mois",
maxAccompaniedApplications: 5,
extendsPendingApplications: true,
fitzAccess: "100% des outils Fitz, sans restriction",
// Restructurés le 2026-09-02 : chaque ligne correspond à une
// capacité RÉELLE de l'espace étudiant (parcours, outils, chat +
// entraînement aux tests, entretiens, suivi, messagerie FitzUniverse).
highlights: [
"Jusqu'à 5 candidatures accompagnées de bout en bout",
"100 % des outils Fitz : lettre, e-mails, vérification, traduction, compression",
"Discuter avec Fitz : questions illimitées et entraînement aux tests calé sur vos échéances",
"Préparation aux entretiens et suivi complet des candidatures",
"Messagerie FitzUniverse : l'équipe vous répond dans votre espace",
"2 révisions par dossier",
"Candidatures en attente suivies jusqu'à la décision de l'université"
]
},

// DÉPRÉCIÉE (grille A, 2026-09-07) : retirée de la vente parce que son
// quota de 9 dépasse ce qu'un étudiant peut réellement viser — le
// catalogue retient 8 à 12 opportunités par profil, toutes bourses
// confondues, et une candidature ne se mène pas à fond à ce rythme.
// Honorée telle quelle pour qui la détient (9 candidatures, messagerie).
accompagnement: {
id: "accompagnement",
parcours: "bourse",
type: "plan",
deprecated: true,
label: "Forfait Ambition",
// "rocket" depuis le 2026-08-29 : sparkles est le cliché visuel de
// l'IA — banni du design system (voir DESIGN_SYSTEM.md, règle
// "Icônes") ; la fusée dit ce que la formule vend : aller plus loin.
icon: "rocket",
tagline: "Jusqu'à 9 candidatures accompagnées de bout en bout, avec Fitz.",
badge: "Le plus populaire",
// 75 000 F / 9 candidatures (décision utilisateur du 2026-08-29,
// arrêtée après deux allers-retours le même jour : 75 000/12 puis
// 80 000/9) : ~8 300 F/candidature, et 10 000 F sous les 85 000 F de
// frais de dossier Campus France pour une seule destination — l'ancre
// de marché affichée sur offers.html garde une marge nette. Ne jamais
// dépasser ce seuil sans retirer l'encadré. Le Forfait Conseiller
// (150 000 F, 12 candidatures) vaut exactement 2× Ambition ET ajoute
// 3 candidatures : la marche vend l'humain et le volume.
priceFCFA: 75000,
duration: "9 mois",
maxAccompaniedApplications: 9,
extendsPendingApplications: true,
fitzAccess: "100% des outils Fitz, sans restriction",
// "Relecture humaine de la lettre de motivation" retirée le 2026-08-22 :
// AUCUN humain n'intervient sur Découverte, Standard ni Avancé — ces
// trois offres sont assurées par Fitz seul. La ligne promettait donc un
// service qui n'était pas rendu.
//
// Elle n'est pas remplacée par un équivalent Fitz : Essentiel inclut
// déjà tous les outils. Ce qui distingue RÉELLEMENT Ambition, c'est le
// volume et la durée — les anciennes lignes « Préparation à
// l'entretien » et « Alertes » (disponibles dès Essentiel) laissaient
// croire le contraire et ont été retirées le 2026-09-02.
highlights: [
"Jusqu'à 9 candidatures accompagnées de bout en bout",
"Tout le contenu du Forfait Essentiel",
"4 candidatures et 3 mois d'accompagnement de plus qu'Essentiel",
"Le meilleur prix par candidature des formules autonomes (≈ 8 300 F)",
"Candidatures en attente suivies jusqu'à la décision de l'université"
]
},

// DÉPRÉCIÉE (grille 2026-08-15, voir la convention en tête de fichier).
// Son quota (12 candidatures) correspond aujourd'hui à celui du Forfait
// Conseiller — Ambition est repassée à 9 candidatures le 2026-08-29.
premium: {
id: "premium",
parcours: "bourse",
type: "plan",
label: "Premium",
icon: "crown",
tagline: "Jusqu'à 12 candidatures accompagnées de bout en bout, avec Fitz.",
badge: "Jusqu'à 12 candidatures",
priceFCFA: 80000,
duration: "6 mois",
maxAccompaniedApplications: 12,
extendsPendingApplications: true,
fitzAccess: "100% des outils Fitz, sans restriction",
deprecated: true,
highlights: [
"Jusqu'à 12 candidatures accompagnées de bout en bout",
"Tout le contenu du Forfait Ambition",
"Révisions illimitées",
"Aide à la préparation du visa",
// Le délai annoncé est passé à 48 h ouvrées (grille A, 2026-09-07) : il
// vit dans js/delai-reponse.js, il est le même partout.
"Réponse prioritaire sous 48 h ouvrées"
]
},

// ==========================================================
// ACCOMPAGNÉ — Renforcé / Signature
// Un conseiller réel, Fitz venant en renfort — et non l'inverse.
// ==========================================================

// DÉPRÉCIÉE (grille A, 2026-09-07) : remplacée par `conseiller-6`
// (même prix, même durée, quota 6). Honorée telle quelle pour qui la
// détient : 12 candidatures, conseiller, messagerie.
"signature-focus": {
id: "signature-focus",
parcours: "bourse",
type: "human",
deprecated: true,
label: "Forfait Conseiller",
icon: "user-check",
tagline: "Un conseiller humain vérifie chaque dossier avant l'envoi, sur 12 candidatures.",
badge: "Accompagnement humain",
// 120 000 → 150 000 le 2026-08-29 (même décision) : exactement 2×
// Avancé — tout l'écart achète l'humain, la marche se lit d'un coup
// d'œil. Paiement en une fois (décision du 2026-08-29 : aucun fractionné).
priceFCFA: 150000,
duration: "9 mois",
maxAccompaniedApplications: 12,
extendsPendingApplications: true,
fitzAccess: "100% des outils Fitz, sans restriction",
// Réécrit le 2026-08-22. L'ancienne liste ne justifiait pas l'écart de
// prix avec Avancé : quota et durée identiques (12 candidatures, 6 mois),
// prix doublé, et deux puces sur quatre répétaient ce qu'Avancé offre
// déjà. Tout l'écart tient à l'humain — la liste dit donc désormais ce
// qu'il fait, concrètement.
//
// La marche par rapport à Avancé est nette et facile à défendre :
// Découverte, Standard et Avancé sont assurées par Fitz SEUL — aucun
// humain n'y intervient. Renforcé est le premier palier où un conseiller
// entre en jeu. Tout l'écart de prix achète donc exactement une chose,
// l'humain — et, depuis le passage d'Ambition à 9 candidatures
// (2026-08-29), 3 candidatures accompagnées de plus (12 contre 9).
//
// Ne jamais réintroduire de mention d'intervention humaine sur les trois
// offres du dessous : ce serait une promesse non tenue, et ça effacerait
// du même coup la seule justification du prix de Renforcé.
highlights: [
"Vérification humaine de chaque dossier avant l'envoi",
"Demandes de revue tracées : faites relire lettre ou dossier avant chaque dépôt",
"Échanges directs avec votre conseiller via la messagerie FitzUniverse",
"L'assistance continue de Fitz en renfort",
"Candidatures en attente suivies jusqu'à la décision de l'université"
]
},

// DÉPRÉCIÉE (grille A, 2026-09-07) : retirée de la vente parce que
// « illimité » est faux — le plafond réel est de 8 à 12 opportunités
// par profil, et une promesse qu'aucun catalogue ne peut tenir n'a pas
// sa place sur une grille. Honorée telle quelle pour qui la détient :
// quota Infinity, conseiller dédié, messagerie ET WhatsApp direct
// (whatsapp_direct n'est plus attachée à aucune offre en vente).
signature: {
id: "signature",
parcours: "bourse",
type: "human",
deprecated: true,
label: "Signature",
// « medal » et non « star » : sparkles / star / wand sont interdites sur
// tout le site (2026-09-02 ; test/icones.test.mjs). Formule retirée.
icon: "medal",
tagline: "Conseiller dédié, candidatures illimitées.",
badge: "Notre formule la plus complète",
// 199 000 → 250 000 le 2026-08-29 (même décision) : offre rare (20
// places/promotion, demande via WhatsApp avant paiement), conseiller
// dédié 12 mois — et toujours sous les ~310 000 F de la seule
// attestation bancaire Studely. Paiement en une fois (aucun fractionné).
priceFCFA: 250000,
duration: "12 mois",
// CONVENTION "ILLIMITÉ" (arrêtée 2026-08-02) : `Infinity`, jamais une
// valeur absente ni `null`. Les deux lecteurs du champ
// (applications.js, admin/student-detail.js) le testent par sa
// véracité — `undefined`/`null` y sont donc indiscernables de
// "aucune candidature incluse", ce qui faisait afficher "formule
// Gratuit" à un client Signature. `Infinity` est truthy, et
// `applications.length >= Infinity` est toujours faux : le plafond ne
// se déclenche jamais sans qu'aucun cas particulier soit nécessaire
// dans la vérification de quota. Seul l'affichage doit le traduire en
// "illimité". Ne jamais écrire cette valeur telle quelle dans
// Firestore ou un JSON (Infinity n'est pas sérialisable) — elle vit
// uniquement dans ce fichier.
maxAccompaniedApplications: Infinity,
extendsPendingApplications: true,
fitzAccess: "100% des outils Fitz, sans restriction",
highlights: [
"Un conseiller dédié",
"Candidatures illimitées",
"Points d'étape en visioconférence",
"Accompagnement jusqu'à la préparation du visa",
"Des échanges personnalisés (WhatsApp)",
"L'assistance continue de Fitz tout au long du processus",
"Candidatures en attente suivies jusqu'à la décision de l'université"
]
},

// ==========================================================
// GRILLE A (2026-09-07) — LES DEUX OFFRES BOURSES RÉVISÉES.
// Quatre offres en vente côté bourses : fitzExpress, premier-dossier,
// et ces deux-ci. La promesse est la PROFONDEUR (« 4 candidatures
// accompagnées à fond »), jamais le volume ni un prix par candidature.
// La messagerie FitzUniverse est réservée, côté bourses, au Forfait
// Conseiller : une bourse se décide par un jury, l'échange n'y a pas
// la valeur directe qu'il a en préinscription. Toute formule payante
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
priceFCFA: 45000,
// Lot ACCEPTATION (2026-09-11), décision 7 de Charles : PLUS DE DURÉE EN
// MOIS. Une formule bourses se définit par son nombre de candidatures,
// chacune suivie jusqu'à la décision de l'université ; la suite, c'est
// l'équipe qui la décide. `duration` retirée (elle valait « 6 mois »).
// Exception assumée à la règle « un objet existant ne se modifie pas » :
// aucun client payant ne détient cette formule (le paiement réel n'est
// pas ouvert, le KYC PayDunya est en attente), et le changement ne
// retire rien — il enlève une limite. Les formules retirées de la vente
// gardent leur durée.
maxAccompaniedApplications: 4,
extendsPendingApplications: true,
fitzAccess: "100% des outils Fitz, sans restriction",
highlights: [
"4 candidatures accompagnées à fond, à la fois",
"100 % des outils Fitz : lettre, e-mails, vérification, traduction, compression",
"Discuter avec Fitz autant que nécessaire, et l'entraînement aux tests calé sur vos échéances",
"Préparation aux entretiens et suivi complet des candidatures",
"2 révisions par dossier",
"Candidatures en attente suivies jusqu'à la décision de l'université",
"Service après-vente : signaler un problème, réponse sous 48 h ouvrées"
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
priceFCFA: 150000,
// Lot ACCEPTATION (2026-09-11) : plus de durée en mois — voir la note
// d'essentiel-4 ci-dessus (même exception assumée, même raison).
// `duration` retirée (elle valait « 9 mois »).
maxAccompaniedApplications: 6,
extendsPendingApplications: true,
fitzAccess: "100% des outils Fitz, sans restriction",
highlights: [
"6 candidatures accompagnées à fond, chacune relue par un conseiller",
"Vérification humaine de chaque dossier avant l'envoi",
"Demandes de revue tracées : faites relire lettre ou dossier avant chaque dépôt",
"Messagerie FitzUniverse : échanges directs avec votre conseiller, réponse sous 48 h ouvrées",
"Tout le contenu du Forfait Essentiel, Fitz en renfort",
"Candidatures en attente suivies jusqu'à la décision de l'université"
]
},

// ==========================================================
// GRILLE B — PRÉINSCRIPTIONS (2026-09-07). Un SECOND forfait, qui
// coexiste avec le forfait bourse : `users.planPreinscription`, écrit
// par le webhook seul, jamais `plan`. Trois offres décidées, ne pas
// rouvrir. France uniquement. Paiement en une fois, jamais de
// remboursement, jamais de mensualité. `maxPreinscriptions` = les 7
// vœux d'un dossier Études en France — dupliqué dans firestore.rules
// (pre-[1-7]) et functions/lib/achat.js, test/grille-b.test.mjs
// échoue si l'un des trois diverge.
// ==========================================================

"diagnostic-france": {
id: "diagnostic-france",
parcours: "preinscription",
type: "pass",
label: "Diagnostic France",
icon: "calculator",
tagline: "Une réponse honnête avant de payer Campus France.",
badge: "Avant de payer",
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
"Un verdict en une phrase : votre projet tient, ou il manque X € — au mois ou sur l'année",
"Chaque montant avec sa source officielle et sa date de vérification",
"Les points de vigilance de votre pays : les règles éliminatoires, avant qu'elles ne coûtent une année",
"Votre calendrier en jours, ou la raison pour laquelle aucune date n'est encore publiée",
"Ce qui peut faire baisser le total : niveau, exonération, université, bourses ouvertes",
"Les étapes de votre procédure, en entier — rien n'est masqué pour faire payer la suite",
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
priceFCFA: 75000,
duration: "une campagne, jusqu'au 31 juillet",
fitzAccess: "Documents, traductions et légalisations, preuve de ressources, préparation à l'entretien, messagerie FitzUniverse",
maxPreinscriptions: 7,
highlights: [
"Jusqu'à 7 vœux suivis, du profil au dépôt : pièces, traductions et légalisations, preuve de ressources",
"Le Diagnostic France inclus",
"Préparation à l'entretien Campus France",
"Messagerie FitzUniverse pour vos questions",
"Vous déposez vous-même sur Études en France — jusqu'au dépôt, jamais jusqu'à l'admission"
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
priceFCFA: 150000,
duration: "une campagne, jusqu'au 31 juillet",
fitzAccess: "Tout Dossier France, plus la relecture de votre conseiller",
maxPreinscriptions: 7,
highlights: [
"Tout le contenu de Dossier France",
"Une relecture humaine de votre dossier AVANT le paiement des frais de dossier Campus France, non remboursables",
"Un conseiller joignable pendant toute la campagne",
"Vous déposez vous-même sur Études en France — jusqu'au dépôt, jamais jusqu'à l'admission"
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
function buildCheckoutPayload(planId) {

const plan = SCHOLARBRIDGE_PLANS[planId];

if (!plan) return null;

return {
plan: plan.id,
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

function dateDeDiagnostic(user) {

const u = user || {};

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
function prixAvecDeduction(planId, user, maintenant) {

const plan = SCHOLARBRIDGE_PLANS[planId];
if (!plan) return null;

const base = plan.priceFCFA;
const rien = { prix: base, base, deduction: 0, mention: "" };

if (!DEDUCTION_DIAGNOSTIC.plans.includes(planId)) return rien;

const paye = dateDeDiagnostic(user);
if (!paye) return rien;

const jours = Math.floor(((maintenant || new Date()).getTime() - paye.getTime()) / 86400000);
if (jours < 0 || jours > DEDUCTION_DIAGNOSTIC.jours) return rien;

return { prix: base - DEDUCTION_DIAGNOSTIC.montant, base, deduction: DEDUCTION_DIAGNOSTIC.montant, mention: DEDUCTION_DIAGNOSTIC.mention };

}

window.prixAvecDeduction = prixAvecDeduction;
