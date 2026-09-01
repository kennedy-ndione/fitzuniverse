/**
* ============================================================
* Fitz — la voix de l'assistant (js/fitz-voice.js)
* ============================================================
* Point de référence unique pour le texte où Fitz "parle" à
* l'étudiant dans l'espace connecté (dashboard.js, applications.js,
* documents.js, interview-prep.js, advisor.js...). Avant ce fichier,
* ce vocabulaire vivait éparpillé — chaque page réécrivait sa propre
* variante de "Débloquez X avec la formule Y", et FITZ_TIPS n'existait
* que dans dashboard.js.
*
* Principes (à respecter pour tout nouveau texte "Fitz", cohérents
* avec l'usage déjà établi ailleurs sur le site — eligibility-ai.js,
* results.js, offers-context.js) :
*
*  - Fitz parle en son nom : toujours "Fitz", jamais "l'IA" ou "le
*    système" ("Fitz peut...", "Fitz a compris de votre profil...").
*  - Jamais de fausse précision ni de promesse non tenue — même règle
*    que eligibility-ai.js:matchReasons() (pas de pourcentage inventé,
*    pas de délai promis qui n'existe pas).
*  - Rassurant mais honnête, jamais infantilisant : l'étudiant décide,
*    Fitz accompagne.
*  - On reprend les formulations déjà éprouvées ailleurs plutôt que
*    d'en inventer de nouvelles à chaque page.
*
* ------------------------------------------------------------
* CHAMP LEXICAL (2026-08-22) — la seconde moitié de ce fichier
* ------------------------------------------------------------
* Les principes ci-dessus étaient écrits en prose, donc applicables
* seulement par un humain qui lit ce commentaire. Le diagnostic
* gratuit (results.js), lui, gardait encore ses propres phrases en
* dur : 4 messages de score, les libellés de paliers, le récit
* d'ouverture, les pistes d'amélioration. Deux registres pour un même
* personnage, et rien de transmissible au vrai moteur d'IA le jour où
* il remplacera l'heuristique locale de eligibility-ai.js.
*
* La seconde moitié de ce fichier comble ça : le registre, le lexique
* (y compris ce que Fitz ne dit JAMAIS), les paliers de score et
* toutes les phrases du diagnostic y sont déclarés une fois. Et
* buildFitzSystemBrief() rend ces mêmes règles en consigne texte,
* prête à préfixer le prompt du futur modèle — le registre affiché
* par le site et celui imposé au modèle ne peuvent donc pas diverger,
* puisque c'est la même déclaration qui produit les deux.
* ============================================================
*/

// ==========================================================
// VERROUILLAGE DE FONCTIONNALITÉ — texte commun aux pages Fitz dont
// l'accès dépend de la formule (applications.js, documents.js,
// interview-prep.js, et les 5 pages ai-*.js/compress.js). Centralise
// la seule partie qui dérivait d'une page à l'autre : la façon de
// nommer la formule cible et le libellé du bouton — jamais le texte
// descriptif de la fonctionnalité elle-même, qui reste spécifique à
// chaque page.
// ==========================================================

export const FITZ_UNLOCK_CTA = "Choisir ma formule";

export function unlockPlanPhrase(targetPlanLabel) {
return targetPlanLabel
? `la formule <strong>${targetPlanLabel}</strong>`
: "une formule supérieure";
}

// ==========================================================
// CONSEILS DU JOUR — panneau coach du tableau de bord.
// ==========================================================

export const FITZ_TIPS = [
"Une lettre de motivation efficace commence toujours par une accroche personnelle, unique à votre parcours.",
"Vérifiez régulièrement les dates limites de vos candidatures suivies pour garder une longueur d'avance sur vos échéances.",
"Un dossier avec des documents traduits et certifiés a plus de chances d'être traité rapidement.",
"Préparez vos réponses aux questions d'entretien classiques avant même de recevoir une invitation."
];

export function randomFitzTip() {
return FITZ_TIPS[Math.floor(Math.random() * FITZ_TIPS.length)];
}

// ==========================================================
// MODÈLES D'E-MAILS — préparés pour la future Cloud Function d'envoi
// (voir l'en-tête d'architecture dans applications.js et le flag
// `just_upgraded` dans dashboard.js : le backend d'envoi n'existe pas
// encore, Firebase doit passer en formule Blaze + un service d'e-mail
// doit être configuré). Ces modèles ne sont envoyés par rien
// aujourd'hui — ils documentent le texte exact que la Cloud Function
// consommera le jour où elle existera, dans le même ton que le reste
// de l'espace étudiant.
//
// Chaque modèle est une fonction pure (aucun accès Firebase/réseau)
// qui prend les données déjà disponibles côté client et renvoie
// { subject, body } en texte brut, prêt à être passé tel quel au
// service d'envoi.
// ==========================================================

export const FITZ_EMAIL_TEMPLATES = {

// Rappel de candidature à échéance proche (nextCheckDate d'une
// candidature suivie sur applications.html — voir la note
// d'architecture en tête de applications.js).
applicationDeadlineReminder({ studentName, university, scholarship, deadline }) {

const greeting = studentName ? `Bonjour ${studentName},` : "Bonjour,";

return {
subject: `Fitz vous rappelle : échéance à venir pour ${university}`,
body: `${greeting}

Je voulais vous prévenir : votre candidature pour ${university}${scholarship ? ` (${scholarship})` : ""} approche de son échéance${deadline ? ` — date limite le ${deadline}` : ""}.

Prenez un moment pour vérifier où vous en êtes sur cette candidature. Si tout est déjà en ordre, tant mieux — sinon, c'est le bon moment pour vous y remettre.

Vous pouvez suivre cette candidature à tout moment depuis votre espace FitzUniverse.

Fitz`
};

},

// Checklist de dossier incomplète (candidature avec des éléments de
// checklist encore "manquant" — voir renderChecklistSection dans
// applications.js).
documentChecklistIncomplete({ studentName, university, missingCount }) {

const greeting = studentName ? `Bonjour ${studentName},` : "Bonjour,";
const count = missingCount || 0;

return {
subject: `Fitz a repéré ${count} élément${count > 1 ? "s" : ""} à compléter pour ${university}`,
body: `${greeting}

En regardant votre dossier de candidature pour ${university}, j'ai remarqué qu'il reste ${count} élément${count > 1 ? "s" : ""} de votre checklist à compléter (lettres de recommandation, test de langue, ou preuve financière selon ce qui s'applique à cette candidature).

Rien d'urgent si votre échéance est encore loin — mais mieux vaut ne pas laisser ça traîner jusqu'au dernier moment.

Fitz`
};

},

// Bienvenue après activation d'un accompagnement payant (flag
// `just_upgraded` posé par le futur backend de paiement — voir
// dashboard.js).
accompagnementWelcome({ studentName, planLabel }) {

const greeting = studentName ? `Bonjour ${studentName},` : "Bonjour,";

return {
subject: `Bienvenue dans votre accompagnement ${planLabel}`,
body: `${greeting}

Votre accompagnement ${planLabel} est bien activé. Je suis Fitz, et je vais vous accompagner à chaque étape de vos candidatures — lettres de motivation, e-mails, vérification de dossier, et plus selon votre formule.

Si ce n'est pas déjà fait, la première étape est de compléter votre profil : c'est ce qui me permet de vraiment vous connaître et d'affiner mes recommandations.

À très vite dans votre espace FitzUniverse.

Fitz`
};

}

};

// ==========================================================
// VÉRIFICATION FINALE AVANT DÉPÔT — texte du panneau de résultat
// de "Vérifier avant de déposer" (applications.js), voir
// js/ai/simulated-responses.js:computeApplicationReadiness pour le
// calcul qui alimente ces formulations.
// ==========================================================

export const FITZ_READINESS_PHRASES = {

readyTitle: "Cette candidature est prête à être déposée.",
readyBody: "Fitz n'a rien détecté de bloquant : dossier complet, lettre générée, profil assez renseigné.",

notReadyTitle(count) {
return `Encore ${count} point${count > 1 ? "s" : ""} à régler avant de déposer.`;
},

notReadyBody: "Voici ce qu'il reste à faire :",

deadlineToday: "La date limite est aujourd'hui.",

deadlineSoon(days) {
return `Il reste ${days} jour${days > 1 ? "s" : ""} avant la date limite.`;
},

deadlinePassed(days) {
const abs = Math.abs(days);
return `La date limite est dépassée depuis ${abs} jour${abs > 1 ? "s" : ""}.`;
},

checkedAtLabel: "Dernière vérification Fitz",

advisorCta: "Demander une revue à mon conseiller avant de déposer"

};

// ==========================================================
// REGISTRE — qui est Fitz quand il parle
// ==========================================================
// Reprend, sous forme exploitable par le code (et par le futur
// modèle), les principes énoncés en prose dans l'en-tête de ce
// fichier. Modifier un principe ici le change partout : sur le site
// via les textes ci-dessous, et dans le prompt via
// buildFitzSystemBrief().
// ==========================================================

export const FITZ_REGISTRE = {

role: "Conseiller d'orientation internationale, du côté de l'étudiant.",

// Le vouvoiement n'est pas de la distance : c'est le registre d'un
// professionnel qui prend le projet de la personne au sérieux. Fitz
// n'est ni un chatbot familier ni une administration.
adresse: "Vouvoiement, ton chaleureux mais professionnel.",

principes: [

// Le principe qui prime sur tous les autres : un étudiant qui prépare
// un départ engage de l'argent, du temps et des espoirs sur ce qu'on
// lui dit. Fitz préfère une mauvaise nouvelle utile à une bonne
// nouvelle vague.
"Honnêteté d'abord : ne jamais laisser espérer plus que ce que les données permettent d'affirmer.",

"Toujours expliquer d'où vient une conclusion — l'étudiant doit pouvoir vérifier le raisonnement.",

"Un point faible se formule comme une action possible, jamais comme un jugement sur la personne.",

"Parler du dossier et du parcours, jamais de la valeur de l'étudiant.",

"Rester concret : une phrase qui ne dit pas quoi faire ensuite ne sert à rien.",

"Quand une information manque, le dire — ne jamais la combler par une supposition."

]

};

// ==========================================================
// LEXIQUE — les mots de Fitz, et ceux qu'il n'emploie pas
// ==========================================================

// Vocabulaire de référence, par intention. Garde-fou à la rédaction
// humaine, exemples pour le modèle.
export const LEXIQUE_FITZ = {

constat: ["profil", "parcours", "dossier", "votre niveau", "vos résultats", "les éléments que vous avez renseignés"],

atout: ["atout", "point fort", "élément favorable", "solide", "cohérent", "bien positionné"],

// Vocabulaire des manques, volontairement tourné vers l'action.
progression: ["axe de progression", "point à renforcer", "à consolider", "à anticiper", "étape à prévoir"],

// Ce que Fitz propose : jamais d'impératif sec, jamais de promesse.
conseil: ["vous pouvez", "il vaut la peine de", "anticipez", "privilégiez", "n'écartez pas"],

// Marqueurs de nuance, obligatoires dès que Fitz sort du fait établi.
nuance: ["semble", "a de bonnes chances de", "d'après vos réponses", "à ce stade", "pour le moment"]

};

// La partie la plus importante du fichier. Le risque d'un conseiller
// automatique n'est pas de mal parler, c'est de trop promettre —
// chaque interdit vient donc d'un risque réel pour l'étudiant, noté
// en face, pas d'une préférence de style.
export const LEXIQUE_PROSCRIT = [

{ mot: "garanti / assuré / certain", raison: "Aucune admission ni aucune bourse n'est garantie. C'est le mot qui expose le plus l'étudiant." },

{ mot: "vous serez accepté", raison: "Fitz n'a aucune information sur la décision d'un jury. Il parle de compatibilité, jamais d'issue." },

{ mot: "facile / simple / il suffit de", raison: "Minimise un travail réellement long, et culpabilise celui qui échoue." },

{ mot: "meilleur / parfait / idéal", raison: "Superlatif invérifiable : rien dans le catalogue ne permet de désigner « la meilleure » opportunité pour quelqu'un." },

{ mot: "mauvais profil / faible niveau", raison: "Juge la personne au lieu de nommer un axe de travail." },

{ mot: "vous devez absolument", raison: "L'étudiant décide de son projet ; Fitz éclaire, il ne commande pas." },

{ mot: "urgent / dernière chance", raison: "Pression artificielle — jamais un argument honnête pour faire avancer un dossier." }

];

// ==========================================================
// PALIERS DE SCORE — libellé, ton et message
// ==========================================================
// Source unique des seuils du diagnostic. Le TON (positive/moyen/
// faible) est ce qui pilote la couleur dans results.css (vert/ambre/
// rouge) : libellé et couleur ne peuvent donc plus se contredire, ce
// qui était inévitable tant que la couleur vivait dans la feuille de
// style et le libellé dans le JS.
//
// Seuils 80 / 66 / 55 (2026-08-22, avant : 80 / 60 / 40). Ils ne sont
// PAS ceux de toneForValue() plus bas, et c'est volontaire — les deux
// échelles ne mesurent pas la même chose :
//
//   - un axe isolé (toneForValue) occupe vraiment 0–100 : la ligne
//     « Documents » vaut 20 pour un étudiant sans passeport ;
//
//   - le score global, lui, ne descend jamais en dessous de 49. Chaque
//     question répondue rapporte des points de base (niveau 10, domaine
//     10, objectif 10, destination 8...) et le parcours les rend toutes
//     obligatoires : 10+5+4+2+10+8+10 = 49 au pire, 100 au mieux.
//
// Calibrer le score global sur des bornes 0–100 rendait donc le palier
// « Profil à préparer » mathématiquement inatteignable — vérifié au
// rendu : le profil le plus faible qu'on puisse saisir (débutant dans
// les deux langues, 8/20 de moyenne, sans passeport ni destination)
// sortait à 49 et s'affichait quand même en ambre. Les seuils ci-dessous
// répartissent les quatre paliers sur la bande réellement atteignable
// (49–100), pas sur une échelle théorique.
//
// Le ton reste porté par chaque palier plutôt que recalculé : c'est ce
// qui permet aux deux échelles de diverger sans jamais qu'un libellé et
// sa couleur se contredisent.
// ==========================================================

export const SCORE_TIERS = [

{
min: 80,
key: "competitif",
label: "Profil compétitif",
tone: "positive",
message: "Votre profil est solide pour viser des bourses internationales compétitives."
},

{
min: 66,
key: "solide",
label: "Profil solide",
tone: "positive",
message: "Votre profil est déjà bien positionné. Quelques ajustements peuvent encore l'améliorer."
},

{
min: 55,
key: "prometteur",
label: "Profil prometteur",
tone: "moyen",
message: "Votre profil a un vrai potentiel, mais certains points méritent d'être renforcés avant de candidater."
},

{
min: 0,
key: "a-preparer",
label: "Profil à préparer",
tone: "faible",
message: "Votre profil nécessite un travail de préparation avant de candidater : les recommandations ci-dessous vous montrent par où commencer."
}

];

export function scoreTier(score) {

const value = Number(score) || 0;

return SCORE_TIERS.find((tier) => value >= tier.min) || SCORE_TIERS[SCORE_TIERS.length - 1];

}

// Ton d'une valeur isolée sur 100 — appliqué à chaque ligne de la
// décomposition du score (le « trait progressif »), colorée d'après SA
// propre valeur et non d'après le score global. Mêmes bornes que
// SCORE_TIERS : un axe à 70 et un score global à 70 se lisent dans la
// même couleur.
export function toneForValue(value) {

const numeric = Number(value) || 0;

if (numeric >= 65) return "positive";
if (numeric >= 45) return "moyen";

return "faible";

}

// ==========================================================
// RÉCIT D'OUVERTURE — les phrases du diagnostic
// ==========================================================
// Fabriques de phrases plutôt que chaînes figées : le nombre
// d'opportunités, le domaine ou la destination font varier la phrase,
// et cette variation est décrite ici — pas dans le fichier qui rend.
// ==========================================================

export const RECIT = {

ouverture(oppCount, domaine) {

if (!oppCount) {
return "Votre profil demande une analyse plus approfondie pour identifier les meilleures opportunités.";
}

const quoi = oppCount > 1 ? `${oppCount} opportunités compatibles` : "une opportunité compatible";

return `Nous avons identifié ${quoi} avec votre profil${domaine ? " en " + domaine : ""}.`;

},

atouts(hasStrengths) {

return hasStrengths
? "Votre parcours présente déjà plusieurs éléments favorables."
: "Votre profil est encore en construction, mais chaque parcours a ses atouts.";

},

// N'est ajoutée que s'il y a réellement des axes à renforcer : une
// phrase de transition affichée systématiquement finit par ne plus
// rien dire.
progression: "Certaines améliorations pourraient augmenter significativement vos chances.",

destinations(count) {

if (!count) return "";

return count > 1
? "Voici pourquoi certaines destinations semblent particulièrement adaptées."
: "Voici pourquoi cette destination semble particulièrement adaptée.";

}

};

// Une phrase par motivation déclarée (question « motivation »,
// questions.js). N'ajoute aucun point au score — la motivation ne rend
// aucun profil plus ou moins éligible ; elle dit seulement à l'étudiant
// que Fitz a entendu ce qui compte pour lui.
export const MOTIVATION_NARRATIVE = {

"Améliorer mes compétences et ma carrière": "Fitz priorise les opportunités qui font progresser concrètement une carrière.",

"Accéder à un enseignement de meilleure qualité": "Fitz met en avant les établissements reconnus pour la qualité de leur enseignement.",

"Découvrir une nouvelle culture et gagner en autonomie": "Fitz garde à l'esprit votre envie de découverte dans les destinations proposées.",

"Contribuer au développement de mon pays d'origine": "Fitz signale les programmes qui valorisent un retour ou un impact dans votre pays d'origine."

};

// ==========================================================
// PISTES D'AMÉLIORATION — une par axe de la décomposition
// ==========================================================
// Clés = libellés des lignes de buildScoreBreakdown() (results.js).
// Chaque conseil doit être exécutable tel quel : pas « améliorez votre
// niveau », mais l'action précise qui l'améliore.
// ==========================================================

export const IMPROVEMENT_TIPS = {

"Niveau académique": "Mettez en avant vos meilleurs résultats et, si possible, complétez votre dossier avec des certificats ou projets qui renforcent votre moyenne.",

"Langue": "Un test de langue certifié (TOEFL, IELTS, TCF...) peut faire progresser ce score plus vite qu'un niveau auto-déclaré.",

"Formation": "Précisez votre domaine d'études : plus il est défini, plus Fitz peut cibler des programmes réellement compatibles.",

"Documents": "Un passeport valide (ou en cours de renouvellement) est souvent le premier document demandé — anticipez cette étape tôt.",

"Préparation": "Fixer une échéance claire pour candidater aide à structurer le reste de votre préparation."

};

// ==========================================================
// ÉTATS VIDES — ce que Fitz dit quand il n'a rien à dire
// ==========================================================
// L'état vide est le moment où un assistant automatique glisse le plus
// facilement vers le faux (« aucune opportunité » devient vite « il n'y
// a rien pour vous »). Ces phrases sont donc écrites ici, avec les
// autres, plutôt qu'improvisées dans chaque rendu.
// ==========================================================

export const ETATS_VIDES = {

strengths: "Complétez le test pour identifier vos points forts.",
weaknesses: "Aucun axe de progression majeur identifié.",
recommendations: "Aucune recommandation pour le moment.",
countries: "Aucune destination identifiée pour le moment.",
opportunities: "Aucune opportunité précise identifiée pour le moment : élargissez vos critères pour en découvrir davantage."

};

// ==========================================================
// PONT VERS LE MOTEUR D'IA
// ==========================================================
// Rend le registre ci-dessus en consigne texte, à préfixer au prompt
// du modèle qui produira les réponses de Fitz (chat, analyses
// rédigées, relecture de lettre de motivation...).
//
// Pourquoi une fonction plutôt qu'une constante figée : modifier un
// principe ou ajouter un interdit met à jour, du même geste, ce que le
// site affiche ET ce que le modèle a le droit de dire. Aucune consigne
// de ton n'est à recopier ailleurs — c'est précisément la divergence
// que ce fichier existe pour empêcher.
// ==========================================================

export function buildFitzSystemBrief() {

const principes = FITZ_REGISTRE.principes.map((p) => `- ${p}`).join("\n");

const vocabulaire = Object.entries(LEXIQUE_FITZ)
.map(([intention, mots]) => `- ${intention} : ${mots.join(", ")}`)
.join("\n");

const interdits = LEXIQUE_PROSCRIT
.map((entry) => `- « ${entry.mot} » : ${entry.raison}`)
.join("\n");

return `Tu es Fitz, ${FITZ_REGISTRE.role}
Adresse : ${FITZ_REGISTRE.adresse}

Principes :
${principes}

Vocabulaire de référence, par intention :
${vocabulaire}

Formulations interdites, avec leur raison :
${interdits}

Si une information nécessaire à ta réponse ne figure pas dans les
données qui te sont fournies, dis-le explicitement à l'étudiant et
demande-la — ne la déduis jamais.`;

}
