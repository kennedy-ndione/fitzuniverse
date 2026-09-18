/**
* ============================================================
* FitzUniverse — configuration de Fitz
* ============================================================
*
* LE SEUL FICHIER À MODIFIER POUR BRANCHER UNE VRAIE IA.
*
* Passer MODE de "simule" à "passerelle" suffit : js/ai/ai-client.js
* changera d'adaptateur, et aucune page n'aura à bouger. C'est tout
* l'objet de la « couture » : le jour du branchement doit être un
* changement de configuration, pas une réécriture.
*
* ⚠️  AUCUNE CLÉ D'API DANS CE FICHIER. JAMAIS.
* ------------------------------------------------------------
* Tout ce qui vit dans js/ est téléchargé par le navigateur de chaque
* visiteur et lisible par n'importe qui via « Afficher la source ».
* Une clé OpenAI ou Anthropic écrite ici serait publique en quelques
* minutes et facturée à FitzUniverse jusqu'à sa révocation.
*
* C'est pourquoi le navigateur ne parle jamais au modèle : il appelle
* NOTRE passerelle, la Cloud Function `fitzGenerate` (europe-west1),
* qui vérifie l'identité de l'étudiant, sa formule et son plafond
* d'usage avant d'appeler le modèle.
*
*     navigateur → passerelle FitzUniverse → modèle
*                  (vérifie l'identité,
*                   la formule et le plafond)
*
* Depuis le 2026-09-18 le modèle est appelé via l'API Anthropic
* directe : une clé existe bel et bien, mais elle vit dans Secret
* Manager (Google Cloud), attachée à la seule fonction qui la lit
* (functions/fitz.js) — jamais transmise au navigateur, jamais
* journalisée.
*
* Ce détour n'est pas seulement une précaution : c'est aussi le seul
* endroit où le quota par offre peut être appliqué de façon fiable.
* Une vérification faite dans le navigateur se contourne avec la
* console du navigateur.
* ============================================================
*/

/**
* "simule"     — js/ai/simulated-responses.js répond localement.
*                Aucun réseau, aucun coût, réponses déterministes.
* "passerelle" — appel du callable fitzGenerate (js/ai/ai-gateway.js),
*                qui appelle désormais l'API Anthropic directe (lot
*                FITZ-RÉEL, 2026-09-18) — voir functions/fitz.js.
*
* HISTORIQUE — ⛔ REPASSÉ EN "simule" LE 2026-09-05, RÉPARÉ LE 2026-09-18.
*
* Le 2026-09-05 : le crédit d'essai Google de 300 $ NE COUVRAIT PAS les
* modèles d'IA générative de partenaires (Vertex AI) proposés en API
* gérée, et l'essai sans frais les BLOQUAIT purement et simplement.
* Preuves relevées ce jour-là : crédit intact à 300,00 $ sur 300,00 $,
* aucun SKU Vertex AI en 30 jours, et surtout
* `PredictionService.StreamRawPredict` à 100 % d'erreurs avec des 429.
* La fonction `fitzGenerate` répondait donc, mais aucun modèle
* derrière : chat, lettre, e-mail, traduction, analyse de dossier et
* diagnostic étaient tous hors service en production.
*
* Le 2026-09-18 : bascule sur l'API Anthropic directe, payée par carte
* (lot FITZ-RÉEL, functions/fitz.js) — plus de dépendance à un compte
* Google Cloud converti en payant. test/fitz-reel.test.mjs
* (« passerelle 1 ») vire au rouge si ce mode est un jour remis actif
* sans qu'aucun SDK ne soit réellement chargé côté serveur : le
* 2026-09-05 ne peut plus se reproduire en silence.
*
* @type {"simule"|"passerelle"}
*/
export const MODE = "passerelle";

/** Raccourci de lecture, conservé pour le code déjà écrit. */
export const IS_SIMULATED = MODE === "simule";

/**
* PLUS UTILISÉ depuis le 2026-09-04 — conservé vide à dessein.
*
* La passerelle n'est pas un endpoint HTTP mais un CALLABLE Firebase
* (`fitzGenerate`, europe-west1). Le SDK connaît son adresse à partir
* du projet et de la région : il n'y a pas d'URL à écrire, donc pas
* d'URL à laisser périmer. Voir js/ai/ai-gateway.js.
*
* Ne pas supprimer cette constante sans vérifier qui l'importe encore.
*/
export const ENDPOINT = "";

/**
* Délais maximum par tâche, en millisecondes.
*
* Ils ne sont pas identiques, et c'est délibéré : une réponse de chat
* qui met 30 secondes est déjà perdue pour l'étudiant, alors qu'une
* lettre de motivation complète mérite d'attendre. Un délai unique
* aurait forcé à choisir entre couper les lettres et faire patienter
* le chat sans raison.
*/
export const DELAIS_MS = {
chat: 30000,
letter: 90000,
email: 60000,
translate: 90000,
check: 120000,
readiness: 45000,

// Le diagnostic est court (quelques centaines de mots) et arrive à
// l'écran juste après cinq minutes de questions : au-delà de 45 s
// d'attente supplémentaire, l'étudiant a déjà décroché.
diagnostic: 45000
};

export const DELAI_PAR_DEFAUT_MS = 60000;

/**
* Réessais automatiques sur les seules erreurs réessayables (réseau,
* 5xx, surcharge). Deux, pas plus : au troisième échec le problème
* n'est plus passager, et faire patienter l'étudiant sans le lui dire
* est pire que lui rendre la main.
*
* L'attente double à chaque fois (500ms puis 1000ms) pour ne pas
* aggraver une surcharge que l'on est en train de subir.
*/
export const REESSAIS_MAX = 2;
export const ATTENTE_REESSAI_MS = 500;

/**
* Garde-fou de taille, appliqué AVANT l'envoi.
*
* Sans lui, un étudiant qui colle un mémoire de 200 pages dans l'outil
* de traduction déclenche une requête que le fournisseur refusera —
* après l'avoir facturée, et après trente secondes d'attente. Le
* refuser tout de suite, avec un message qui dit quoi faire, coûte
* zéro et informe mieux.
*
* La valeur est en caractères, pas en tokens : le navigateur ne sait
* pas compter les tokens, et un ordre de grandeur suffit ici. Compter
* environ 4 caractères par token pour un texte français.
*/
export const TAILLE_ENTREE_MAX = 120000;

/**
* Vrai fournisseur : modèle et paramètres. Lus par la passerelle, pas
* par le navigateur — ils vivent ici pour que le choix soit versionné
* et relisible avec le reste du code, plutôt que dissimulé dans la
* configuration d'un service.
*/
export const MODELE = {
nom: "",
temperature: 0.7,
maxTokensSortie: 2000
};

/**
* Tâches dont la réponse est une STRUCTURE (score, listes, verdict) et
* non du texte à composer. Elles ne se diffusent pas mot à mot et leur
* réponse doit être validée avant d'atteindre la page — un modèle qui
* renvoie du JSON entouré de prose ne doit pas casser l'affichage.
*/
export const TACHES_STRUCTUREES = ["check", "readiness"];

/** Toutes les tâches que Fitz sait faire. */
export const TACHES = ["letter", "email", "translate", "check", "readiness", "chat", "diagnostic"];

/**
* Correspondance tâche → clé de fonctionnalité de js/plan-features.js.
* Sert au contrôle d'offre côté client (confort d'affichage) ; la
* passerelle refait le même contrôle côté serveur, qui lui fait foi.
*/
export const FONCTIONNALITE_PAR_TACHE = {
letter: "ai_letter",
email: "ai_email",
translate: "ai_translate",
check: "ai_check",
readiness: "ai_check",
chat: "ai_chat",

// `diagnostic` est la SEULE tâche ouverte aux comptes gratuits : elle
// écrit la lecture personnalisée du test d'éligibilité, à partir d'un
// score et d'opportunités déjà calculés sans IA. Elle porte quand
// même une clé ici parce que verifierAcces() (js/ai/ai-client.js)
// refuse toute tâche absente de cette table — mais aucune page
// n'appelle requireFeature() dessus, et c'est délibéré : la bloquer
// derrière une formule payante viderait de son sens le moment où
// l'étudiant décide de faire confiance à FitzUniverse.
diagnostic: "ai_diagnostic"
};
