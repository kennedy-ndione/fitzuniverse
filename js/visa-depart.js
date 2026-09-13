/**
* ============================================================
* FitzUniverse — le guide VISA & DÉPART (phase 06) — lot S3
* ============================================================
*
* CE QUE CE FICHIER RÉPARE. La phase 06 était six cases à cocher avec
* une phrase chacune, écrites en dur dans espace-bourse.html ET dans
* espace-preinscription.html — donc deux fois, donc divergentes au
* premier correctif. Six phrases, c'est un aide-mémoire ; ce n'est pas
* un accompagnement. Un étudiant admis qui ouvre cette phase cherche à
* savoir QUOI FAIRE, DANS QUEL ORDRE, et CE QUI LE FERA ÉCHOUER.
*
* DEUX ÉTAGES, COMME LES PROCÉDURES.
*
*   LE SOCLE, ici : ce qui est vrai partout. Un consulat demande
*   toujours une pièce d'admission, une preuve de ressources, une
*   assurance, un logement. Les pièges sont aussi les mêmes partout :
*   le rendez-vous pris trop tard, le relevé bancaire alimenté la
*   veille, l'assurance qui exclut l'hospitalisation, le passeport qui
*   expire trop tôt, le diplôme original resté au pays.
*
*   LA DESTINATION, ailleurs : les montants, les délais et les guichets
*   vivent dans js/procedures/<pays>.js, chacun avec sa source et sa
*   date. `etapesDeDestination()` va les y chercher. AUCUN chiffre de
*   pays n'est écrit dans ce fichier — ni un montant de ressources, ni
*   un délai de séjour, ni un tarif. C'est la règle, et c'est elle qui
*   empêche ce guide de vieillir en silence.
*
* POURQUOI LE SOCLE N'A PAS DE `source`. Les étapes des procédures en
* ont une parce qu'elles affirment des FAITS d'un organisme — un
* montant, une date, un délai. Le socle, lui, n'affirme aucun fait
* vérifiable auprès de qui que ce soit : il dit quoi faire et dans quel
* ordre. Lui coller une URL serait donner à un conseil l'apparence
* d'une citation. Ce qui est vérifiable est dans les procédures, et
* c'est de là que ça vient.
*
* DEUX PARCOURS, UN SEUL SOCLE. Le boursier et l'autofinancé font les
* mêmes six étapes, mais deux d'entre elles changent de nature : la
* pièce maîtresse (attestation de bourse contre preuve de paiement des
* frais) et la preuve financière (la bourse la fournit, ou presque ;
* l'autofinancé doit la construire). `variantes` porte cette
* différence, et rien d'autre — dédoubler tout le guide ramènerait
* exactement le problème qu'on répare.
*
* Aucun DOM, aucun Firestore : testable sous Node.
* ============================================================
*/

import { VISA_ETAPES } from "./journey-map.js";

/**
* L'APPARTENANCE À LA PHASE 06 SE DÉCLARE, ELLE NE SE DEVINE PAS.
*
* On a essayé les deux raccourcis, et ils sont faux tous les deux.
*
* PAR TYPE : le rendez-vous consulaire italien et le rendez-vous
* consulaire allemand sont de type « entretien », exactement comme
* l'entretien Campus France qui, lui, précède l'admission. Et le
* Studienkolleg allemand est de type « complement », exactement comme le
* permesso di soggiorno italien. Filtrer par type faisait donc entrer
* dans le guide de départ une étape qu'on fait un an plus tôt.
*
* PAR POSITION, après la dernière étape de type « reponse » : ça marche
* pour cinq pays sur sept, et ça casse sur les deux qui ont une VOIE
* PARALLÈLE écrite en fin de tronc — la bourse du MAE roumain, et les
* candidatures directes à l'UM6P et à Al Akhawayn. Un étudiant admis en
* Italie aurait lu, dans son guide de départ, comment candidater au
* Maroc.
*
* Chaque tronc marque donc ses étapes de départ avec `phaseDepart:
* true`. C'est une ligne par étape, écrite une fois, et elle dit ce
* qu'aucune heuristique ne devinait.
*/
export function estEtapeDeDepart(etape) {
return !!etape && etape.phaseDepart === true;
}

/**
* LE SOCLE — six étapes, les mêmes ids que VISA_ETAPES.
*
* `pourquoi`   ce qui échoue quand on saute l'étape. Pas un slogan :
*              la conséquence concrète.
* `actions`    ce qu'on fait, dans l'ordre. Impératif, court.
* `vigilance`  les pièges qui coûtent le plus cher, dits crûment.
* `quand`      le repère de calendrier, relatif — jamais une date.
* `variantes`  ce qui change entre bourse et préinscription.
*/
export const SOCLE_VISA = [

{
id: "pieces",
titre: "Les pièces qui prouvent votre admission",
icone: "file-badge",
quand: "Dès la réception de votre réponse positive, sans attendre.",
pourquoi: "Un consulat ne juge pas votre dossier académique : il vérifie que vous êtes réellement attendu quelque part. Une pièce manquante ou non conforme fait reporter le rendez-vous, et un rendez-vous reporté en pleine saison se reprend des semaines plus tard.",
actions: [
"Rassemblez la pièce maîtresse de votre admission et vérifiez qu'elle porte votre nom exactement comme sur votre passeport, la date, le programme et l'année académique.",
"Demandez à votre établissement s'il délivre un ORIGINAL papier signé : plusieurs consulats refusent une impression de courriel.",
"Reprenez vos diplômes et relevés originaux, et faites-en des copies certifiées AVANT de les remettre à qui que ce soit — vous les redemanderez à l'inscription sur place.",
"Vérifiez la date d'expiration de votre passeport : la plupart des pays exigent qu'il reste valable plusieurs mois au-delà de la fin du séjour, et un renouvellement prend des semaines.",
"Scannez tout en PDF lisible, et rangez les fichiers dans un dossier unique, nommé, que vous emporterez sur votre téléphone."
],
vigilance: [
"Un passeport qui expire pendant l'année universitaire fait raccourcir le titre de séjour d'autant : renouvelez-le avant de déposer, pas après.",
"Ne confiez jamais vos diplômes ORIGINAUX à un intermédiaire. Ils vous seront réclamés à l'inscription, et personne ne les remplace.",
"Une différence d'orthographe entre votre passeport et votre lettre d'admission bloque le guichet : faites corriger par l'établissement, pas au consulat."
],
variantes: {
bourse: "Votre pièce maîtresse est double : la lettre d'admission ET l'attestation de bourse. Demandez la seconde par écrit, avec le montant et la durée — une annonce de résultats sur un site ne vaut pas attestation.",
preinscription: "Votre pièce maîtresse est la lettre d'admission ou d'acceptation, et dans plusieurs pays elle ne suffit pas seule : il faut y joindre la preuve que vous avez déjà payé tout ou partie des frais. Vérifiez ce point avant de prendre rendez-vous."
}
},

{
id: "finances",
titre: "La preuve que vous pouvez vivre sur place",
icone: "banknote",
quand: "Trois mois avant le dépôt, parce qu'un compte doit avoir une histoire.",
pourquoi: "C'est le premier motif de refus, et le plus évitable. Le consulat ne regarde pas seulement un solde : il regarde d'où vient l'argent, depuis quand il est là, et qui le garantit. Un compte alimenté d'un coup la semaine d'avant se voit, et se retourne contre vous.",
actions: [
"Découvrez le montant EXACT exigé par votre destination — il figure dans les étapes de votre procédure, avec sa source et sa date — et notez s'il couvre l'année ou le mois.",
"Vérifiez ce que ce montant ne comprend PAS : dans plusieurs pays, ni les frais de scolarité ni le billet retour n'y sont inclus, et il faut les prouver en plus.",
"Alimentez le compte régulièrement pendant plusieurs mois, avec des versements que vous pouvez expliquer, plutôt qu'un virement unique juste avant le dépôt.",
"Réunissez les pièces qui EXPLIQUENT l'argent : bulletins ou attestation d'emploi du garant, acte de propriété, relevés sur six mois, et le lien de parenté si c'est un proche qui finance.",
"Si votre destination impose un compte bloqué ou un dépôt auprès d'un établissement précis, vérifiez quelles banques sont acceptées AVANT d'ouvrir quoi que ce soit."
],
vigilance: [
"Les espèces, les attestations de tiers non apparentés et les cautions verbales ne comptent nulle part. Ce qui compte, c'est ce qui est traçable.",
"Un compte ouvert au nom d'un tiers sans lien de parenté documenté est presque toujours écarté.",
"Certains pays refusent les banques hors de leur zone pour un compte bloqué : ouvrir dans la mauvaise banque coûte des frais et des semaines.",
"Une candidature à une bourse n'est pas une ressource. Seule une attestation d'attribution compte."
],
variantes: {
bourse: "Votre attestation de bourse sert de justificatif de ressources dans la plupart des cas — mais seulement si son montant atteint le seuil exigé. S'il est inférieur, vous devez compléter la différence par vos propres relevés : comparez les deux chiffres tout de suite, pas au guichet.",
preinscription: "Vous construisez seul la totalité de la preuve. Commencez par le seuil de votre destination, ajoutez les frais de scolarité et le voyage, et donnez-vous trois mois pour que le compte ait une histoire lisible."
}
},

{
id: "rdv_visa",
titre: "Le rendez-vous au consulat",
icone: "building-2",
quand: "Le jour où votre dossier est complet — et les créneaux d'été partent des semaines à l'avance.",
pourquoi: "Le dossier parfait ne sert à rien si le premier créneau disponible tombe après la rentrée. Dans beaucoup de postes, c'est le rendez-vous, et non l'instruction, qui décide si vous partirez cette année.",
actions: [
"Identifiez le poste consulaire TERRITORIALEMENT compétent pour votre lieu de résidence : ce n'est pas forcément le plus proche, et un dossier déposé au mauvais poste est refusé sans être lu.",
"Ouvrez le système de prise de rendez-vous officiel dès que votre dossier est complet, et regardez le premier créneau réel avant de fixer quoi que ce soit d'autre.",
"Relisez la liste de pièces du poste lui-même, pas une liste générale : chaque consulat publie la sienne, et c'est elle qui fait foi au guichet.",
"Préparez-vous à expliquer, en deux minutes, pourquoi ce pays, pourquoi ce programme, et ce que vous ferez ensuite. Cette cohérence est évaluée.",
"Prévoyez la biométrie : empreintes et photo se donnent en personne, et elles conditionnent le début de l'instruction."
],
vigilance: [
"Les rendez-vous consulaires sont GRATUITS. Plusieurs ambassades écrivent noir sur blanc qu'elles ne travaillent avec aucun agent ni intermédiaire : payer quelqu'un pour un créneau, c'est se faire escroquer, et parfois se faire bloquer.",
"Se présenter avec un dossier incomplet peut entraîner, dans certains postes, un refus ET un blocage de toute nouvelle réservation.",
"L'instruction peut prendre de quelques jours à plusieurs mois, et beaucoup de postes ne répondent à aucune question pendant les premières semaines. Comptez le pire, pas le meilleur.",
"Une admission validée ne garantit ni le rendez-vous ni le visa : la décision appartient au seul consulat."
],
variantes: {
bourse: "Signalez votre bourse dès la prise de rendez-vous : certains postes ont une file ou une liste de pièces distincte pour les boursiers, et votre bailleur a parfois déjà notifié votre nom au consulat.",
preinscription: "Vous êtes dans la file générale, la plus chargée. C'est la raison pour laquelle il faut viser le créneau dès que le dossier est prêt, quitte à compléter une pièce entre-temps."
}
},

{
id: "assurance",
titre: "L'assurance santé",
icone: "heart-pulse",
quand: "Avant le rendez-vous visa — c'est une pièce du dossier, pas une formalité d'arrivée.",
pourquoi: "L'assurance est exigée deux fois, et pas pour la même chose : une première fois par le consulat, pour la durée du visa, et une seconde fois sur place, pour le titre de séjour et l'inscription. Beaucoup d'étudiants achètent la première et découvrent trop tard qu'elle ne vaut pas pour la seconde.",
actions: [
"Vérifiez le niveau de couverture exigé par votre destination : plusieurs pays imposent un plancher chiffré et exigent que l'hospitalisation d'urgence et le rapatriement soient couverts SANS exclusion.",
"Prenez une police qui couvre la totalité de la période inscrite sur le visa, pas seulement les premiers mois.",
"Renseignez-vous sur le régime public étudiant du pays : il est souvent bien meilleur et bien moins cher que l'assurance privée, mais il s'ouvre parfois par une démarche à délai court après l'inscription.",
"Notez dès maintenant, dans votre calendrier, la date limite de cette démarche locale : c'est un droit qui se perd et ne se rattrape pas.",
"Gardez l'attestation en français ou dans la langue acceptée par le consulat, et emportez-en une copie papier."
],
vigilance: [
"Une assurance voyage classique exclut presque toujours les affections préexistantes et parfois l'hospitalisation : lisez les exclusions, c'est là que les dossiers tombent.",
"Le régime public local a souvent un délai d'inscription strict après l'immatriculation. Passé ce délai, le droit est perdu pour toute la durée des études.",
"Une assurance qui s'arrête avant la fin du visa fait raccourcir le titre de séjour d'autant.",
"L'assurance est aussi une condition de RENOUVELLEMENT du séjour : gardez la preuve de chaque année."
],
variantes: {
bourse: "Beaucoup de bourses incluent l'assurance maladie. Faites-le confirmer PAR ÉCRIT avant d'en payer une, et demandez à partir de quelle date exactement la couverture commence : entre l'arrivée et le début de la prise en charge, il y a parfois un trou.",
preinscription: "Vous payez l'assurance vous-même. Comparez le coût annuel du régime public étudiant local avec celui d'une police privée : l'écart est souvent considérable, et c'est l'un des rares postes où l'on peut vraiment économiser."
}
},

{
id: "logement",
titre: "Le logement",
icone: "home",
quand: "En parallèle du dossier visa — beaucoup de consulats exigent une adresse.",
pourquoi: "Le logement n'est pas seulement un confort : c'est souvent une pièce du dossier de visa, puis une pièce du dossier de titre de séjour, et enfin la condition de la déclaration de domicile qui ouvre le reste. Arriver sans adresse stable bloque une chaîne entière de démarches administratives.",
actions: [
"Demandez à votre établissement, dès l'admission, s'il réserve des places en résidence aux étudiants internationaux, et quelle est la date limite de la demande.",
"Si le parc privé est nécessaire, prévoyez ce que le bailleur exigera : caution, garant local, premiers mois d'avance — et le fait que vous n'avez encore ni compte bancaire ni numéro d'identification locale.",
"Réservez, en dernier recours, un hébergement temporaire couvrant la période que votre consulat exige, pour ne pas bloquer le dépôt du visa.",
"Faites-vous remettre le justificatif que l'administration reconnaît — bail, attestation de résidence, attestation d'hébergement — et non une simple réservation.",
"Repérez, avant de signer, le trajet réel jusqu'à votre campus : un loyer moins cher à une heure de transport se paie autrement."
],
vigilance: [
"Ne versez jamais de caution à un particulier avant d'avoir vérifié le bien autrement que par des photos. L'arnaque au logement étudiant à distance est massive et vise précisément les nouveaux arrivants.",
"Beaucoup de pays imposent une déclaration de domicile dans les jours ou semaines suivant l'emménagement : votre bailleur doit vous fournir l'attestation qui va avec. Demandez-la AVANT de signer.",
"Une adresse de complaisance chez un tiers peut suffire au consulat et bloquer ensuite le titre de séjour, qui exige souvent une détention légale du logement.",
"Un logement pris pour trois mois quand le visa en couvre douze oblige à tout refaire au pire moment, juste après l'arrivée."
],
variantes: {
bourse: "Les boursiers sont souvent logés, ou prioritaires en résidence. Faites confirmer par écrit ce qui est pris en charge, à partir de quelle date, et ce qui se passe pendant les vacances universitaires — c'est le trou classique.",
preinscription: "Vous cherchez seul, et depuis l'étranger. Visez la résidence universitaire en premier même si elle paraît improbable : c'est le seul canal où l'on ne vous demandera ni garant local ni historique bancaire."
}
},

{
id: "depart",
titre: "Le départ et les premiers jours",
icone: "plane",
quand: "Les deux semaines avant le vol — et les délais les plus courts de tout le parcours sont APRÈS l'atterrissage.",
pourquoi: "Le visa n'est pas la fin : dans la plupart des pays, les démarches les plus urgentes commencent à l'arrivée, et leurs délais se comptent en jours. Un étudiant qui se repose une semaine après le vol peut avoir déjà perdu un droit.",
actions: [
"Relisez les étapes d'après-arrivée de votre destination et notez CHAQUE délai dans votre calendrier, à partir de la date de votre vol : ce sont les plus courts du parcours.",
"Emportez en bagage à main, jamais en soute : passeport, lettre d'admission, preuve de ressources, assurance, justificatif de logement, et vos diplômes originaux. La police des frontières peut les exiger à l'entrée.",
"Faites une copie numérique de tout, dans un espace accessible hors ligne, et une copie papier laissée à un proche dans votre pays.",
"Prévoyez de quoi vivre les premières semaines sans compte bancaire local : l'ouverture d'un compte dépend souvent de la déclaration de domicile, elle-même conditionnée par le bail.",
"Notez hors ligne l'adresse de votre premier logement, le nom et le numéro du bureau international de votre établissement, et le contact de votre ambassade sur place."
],
vigilance: [
"Voyagez avec LE passeport qui a servi à la demande, même si vous en avez un autre valide : un passeport différent peut faire refuser l'entrée.",
"Les délais d'après-arrivée ne se négocient pas et ne se rattrapent pas. Selon les pays, ils vont de quelques jours à quelques semaines, et ils courent à partir de l'entrée sur le territoire.",
"Ne quittez pas la zone d'arrivée sans le document ou le tampon que votre établissement exigera comme preuve d'entrée : après, c'est trop tard.",
"Le droit de travailler ne commence presque jamais le jour de l'arrivée. Vérifiez à partir de quand, et dans quelle limite, avant de compter sur un revenu local."
],
variantes: {
bourse: "Vérifiez la date exacte du premier versement de votre allocation : entre l'arrivée et ce versement, il y a souvent plusieurs semaines qu'il faut financer soi-même. Et confirmez ce que couvre le billet pris en charge, notamment le bagage.",
preinscription: "Prévoyez la trésorerie des deux premiers mois en entier : dépôt de garantie, premier loyer, assurance, frais d'inscription restants et titre de séjour tombent tous dans les premières semaines, avant le moindre revenu."
}
}

];

/** Le socle, par id. */
export function socleDe(id) {
return SOCLE_VISA.find((e) => e.id === id) || null;
}

/**
* Les étapes de la PROCÉDURE de destination qui relèvent de la phase
* « Visa & départ » : celles dont le type est dans TYPES_PHASE_DEPART.
*
* C'est par là que le guide cesse d'être générique. Elles portent leurs
* montants, leurs délais, leur source et leur date — on ne les recopie
* pas, on les sert telles quelles.
*
* Rend toujours un tableau : sans procédure, il est vide et l'appelant
* n'a rien à tester.
*/
export function etapesDeDestination(procedure) {
const etapes = (procedure && Array.isArray(procedure.etapes) && procedure.etapes) || [];
return etapes.filter(estEtapeDeDepart);
}

/**
* Le guide complet pour un étudiant : le socle, la variante de son
* parcours, et — quand sa destination est documentée — les étapes
* réelles de cette destination.
*
* @param {{espace?:string, procedure?:Object}} ctx
* @returns {{etapes:Array, destination:{pays:string, etapes:Array, documentee:boolean}}}
*/
export function guideVisaPour({ espace = "bourse", procedure = null } = {}) {

const variante = espace === "preinscription" ? "preinscription" : "bourse";
const deDestination = etapesDeDestination(procedure);

return {
espace: variante,
etapes: SOCLE_VISA.map((e) => ({
id: e.id,
titre: e.titre,
icone: e.icone,
quand: e.quand,
pourquoi: e.pourquoi,
actions: e.actions,
vigilance: e.vigilance,
// La phrase qui ne vaut que pour CE parcours. Jamais les deux.
variante: e.variantes[variante]
})),
destination: {
pays: (procedure && procedure.paysDestination) || "",
// Vrai seulement si la destination apporte réellement des étapes :
// une procédure qui n'en a aucune pour cette phase ne doit pas
// afficher un bloc vide sous un titre prometteur.
documentee: deDestination.length > 0,
etapes: deDestination
}
};

}

/**
* Les défauts de forme du socle — c'est ce que le test appelle.
*
* La règle la plus importante est la dernière : AUCUN chiffre de pays
* dans le socle. Un montant ou un délai écrit ici échapperait à la
* discipline « source + date » des procédures et vieillirait sans que
* personne ne s'en aperçoive.
*/
export function defautsDuSocle(socle = SOCLE_VISA) {

const defauts = [];
const ids = socle.map((e) => e.id);

for (const id of VISA_ETAPES) {
if (!ids.includes(id)) defauts.push(`étape « ${id} » de VISA_ETAPES absente du socle`);
}
for (const id of ids) {
if (!VISA_ETAPES.includes(id)) defauts.push(`étape « ${id} » inconnue de VISA_ETAPES`);
}
if (ids.length !== new Set(ids).size) defauts.push("ids en double");

for (const e of socle) {
if (!e.titre || !e.titre.trim()) defauts.push(`${e.id} : titre vide`);
if (!e.icone || !e.icone.trim()) defauts.push(`${e.id} : icône vide`);
if (!e.quand || !e.quand.trim()) defauts.push(`${e.id} : « quand » vide`);
if (!e.pourquoi || e.pourquoi.length < 80) defauts.push(`${e.id} : « pourquoi » trop court pour dire une conséquence`);
if (!Array.isArray(e.actions) || e.actions.length < 3) defauts.push(`${e.id} : moins de trois actions`);
if (!Array.isArray(e.vigilance) || e.vigilance.length < 2) defauts.push(`${e.id} : moins de deux points de vigilance`);
if (!e.variantes || !e.variantes.bourse || !e.variantes.preinscription) defauts.push(`${e.id} : variante manquante`);

// AUCUN CHIFFRE DE PAYS. On tolère les nombres écrits en lettres et
// les repères de durée relatifs (« trois mois », « deux semaines ») ;
// on refuse les montants, les devises et les dates.
const textes = [e.quand, e.pourquoi, ...(e.actions || []), ...(e.vigilance || []), ...Object.values(e.variantes || {})].join("  ");
if (/[€$£]|\bEUR\b|\bUSD\b|\bXOF\b|\bCAD\b|\bMAD\b|\bTRY\b|\bTL\b|\blei\b|F CFA/i.test(textes)) defauts.push(`${e.id} : un montant ou une devise dans le socle — il doit vivre dans la procédure du pays`);
if (/\d{4}-\d{2}-\d{2}|\b\d{1,3}\s?(€|\$|jours|euros)\b/i.test(textes)) defauts.push(`${e.id} : un chiffre de pays dans le socle`);
}

return defauts;

}
