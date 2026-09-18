/**
* ============================================================
* FitzUniverse — couche de résidence : France × Sénégal (lot S1b)
* ============================================================
*
* Ce que la procédure Études en France doit AU SÉNÉGAL, et rien d'autre.
* Le tronc (js/procedures/france.js) porte les onze étapes de la
* plateforme ; ce fichier porte les montants, les dates, les lieux et
* les pièces locales, et composerProcedure() les réunit.
*
* Une couche a deux tiroirs :
*
*   faits   — ce qui est vrai du PAYS, pas d'une étape : le montant des
*             frais de dossier de l'espace Campus France, le calendrier
*             de la campagne. Le diagnostic (js/diagnostic-france.js) lit
*             ce tiroir-là, et le lot S2 n'aura qu'à en écrire un par
*             pays pour que le diagnostic suive, sans une ligne de code.
*
*   etapes  — un FRAGMENT par étape du tronc, qui AJOUTE (`consigneSup`,
*             `piecesSup`) ou REMPLACE (`titre`, `consigne`, `pieces`).
*             Tout fragment porte sa propre `source` et son `verifieLe` :
*             defautsDeProcedure() refuse le contraire, et c'est LA
*             garantie qu'aucun pays du lot S2 ne pourra glisser un fait
*             non sourcé dans une étape déjà vérifiée.
*
* DEUX SOURCES QUI NE SONT PAS ICI, ET POURQUOI.
*
*   fraisDossier vient de js/pays-preinscription.js (faitFrance) : ce
*   fait s'affiche AUSSI sur la page publique Préinscriptions, dans
*   « Ce que ça coûte vraiment ». L'écrire ici en plus, c'est deux
*   chiffres à corriger le jour où Campus France Sénégal change son
*   tarif — et un jour où l'on n'en corrigera qu'un. Les couches du lot
*   S2 porteront le leur en propre : leur pays n'a pas de fiche publique
*   où le fait vivrait déjà.
*
*   calendrier vient de CAMPAGNE_FRANCE, pour la même raison : ses
*   jalons servent déjà au radar d'échéances et à la borne commerciale
*   du 31 juillet. On les DÉSIGNE, on ne les recopie pas.
*
* Aucun DOM, aucun Firestore : testable sous Node.
* ============================================================
*/

import { SOURCES } from "../france.js";
import { CAMPAGNE_FRANCE, faitFrance } from "../../pays-preinscription.js";

const VERIFIE = "2026-09-08";

export const COUCHE_FRANCE_SENEGAL = {

id: "france-senegal",
destination: "France",
pays: "Sénégal",
verifieLe: VERIFIE,

faits: {
// Les 85 000 F CFA, non remboursables, en agence SUNU BANK.
fraisDossier: faitFrance("fraisDossier"),
// Les jalons publiés de la campagne (calendrier Campus France Sénégal
// 2026 + PDF Calendrier2026VF_0), désignés et non recopiés.
calendrier: {
jalons: CAMPAGNE_FRANCE.jalons,
source: CAMPAGNE_FRANCE.sourceJalons,
verifieLe: CAMPAGNE_FRANCE.jalonsVerifiesLe
}
},

// LES POINTS DE VIGILANCE (lot DIAGNOSTIC-2, 2026-09-09).
// Aucun fait neuf : ces phrases sont la partie des consignes ci-dessous
// qui coûte cher quand on ne la lit pas, remontée en tête du Diagnostic
// France. Même source, même date que la consigne dont elles sortent.
pointsDeVigilance: [
{
texte: "Ne payez jamais avant d'avoir reçu la demande de paiement sur votre compte. La demande de paiement ne signifie pas non plus que le dossier est éligible.",
source: "https://www.senegal.campusfrance.org/les-questions-frequemment-posees",
verifieLe: VERIFIE
}
],

etapes: {

// AJOUT — le tronc demande une pièce d'identité ; le Sénégal demande en
// plus, à qui n'est pas sénégalais, un titre de séjour ET la preuve
// d'une activité sur place. La réserve de la source (« à la date de
// rédaction de cette page ») se garde mot pour mot : l'exemption CEDEAO
// est un état du droit, pas une loi de la nature.
//
// La phrase sur l'antenne est un CONSEIL, pas un fait de la source, et
// elle le dit. Elle affirmait autrefois que « l'adresse indiquée
// détermine l'antenne où se tiendra votre entretien » : la page DOSSIER
// ne dit rien de tel — elle demande une adresse, point. Un conseil
// présenté comme une règle de Campus France est un mensonge utile, et
// c'est encore un mensonge.
ef_saisie: {
consigneSup: "Si vous n'êtes pas sénégalais, joignez en plus une carte de séjour en cours de validité ou un récépissé obtenu auprès des autorités sénégalaises — sauf pour les ressortissants de la zone CEDEAO, exemptés de titre de séjour au Sénégal à la date de rédaction de cette page — ainsi que les justificatifs d'une activité au Sénégal, travail ou études, depuis au moins un an. Nous vous conseillons de déclarer une adresse proche de l'antenne Campus France où vous souhaitez passer votre entretien, le lieu de résidence déclaré déterminant l'antenne : c'est notre conseil, cette page ne le formule pas.",
// DEUX PIÈCES, PAS UNE — ET LA PREMIÈRE DISAIT FAUX (lot R24, 2026-09-18).
//
// L'unique ligne d'avant réunissait deux documents et deux conditions :
//   « Carte de séjour en cours de validité ou récépissé, ET justificatifs
//     d'une activité au Sénégal depuis au moins un an
//     (candidats non sénégalais, HORS ZONE CEDEAO) »
//
// La consigne officielle, relue mot pour mot, ne dit pas cela. Elle dit :
// « Si vous n'êtes pas sénégalais, joignez en plus une carte de séjour
// […] ou un récépissé […] — SAUF pour les ressortissants de la zone
// CEDEAO, EXEMPTÉS DE TITRE DE SÉJOUR au Sénégal […] — AINSI QUE les
// justificatifs d'une activité au Sénégal, travail ou études, depuis au
// moins un an. »
//
// L'exemption CEDEAO porte sur le TITRE DE SÉJOUR, et sur lui seul. Les
// justificatifs d'activité sont dus par TOUT candidat non sénégalais.
// La mention « hors zone CEDEAO » placée à la fin d'une ligne unique
// couvrait les deux documents : un étudiant malien, ivoirien, béninois,
// togolais ou guinéen résidant au Sénégal lisait qu'il n'était concerné
// par RIEN, et déposait un dossier incomplet. Ce n'était pas un défaut
// de vocabulaire, c'était une pièce manquante.
//
// Le slug de la carte de séjour est celui que slugPiece() produisait sur
// l'ancien nom — d'où sa longueur et sa troncature : toute coche déjà
// posée reste posée. Les justificatifs, eux, n'étaient jamais suivis
// séparément ; leur pièce est neuve, et décochée, ce qui est la vérité.
piecesSup: [
{ slug: "carte-de-sejour-en-cours-de-validite-ou-recepisse-et-justificatifs-d-une-activit", nom: "Carte de séjour en cours de validité, ou récépissé", aide: "Seulement si vous n'êtes pas sénégalais. Les ressortissants d'un pays de la CEDEAO en sont dispensés, selon la page officielle citée plus bas.", format: "scan", tailleMax: "500 Ko", traduction: false, legalisation: false },
{ slug: "justificatifs-activite-senegal", nom: "Justificatifs d'une activité au Sénégal depuis au moins un an", aide: "Seulement si vous n'êtes pas sénégalais — y compris si vous venez d'un pays de la CEDEAO. Un travail ou des études sur place, depuis un an au moins.", format: "scan", tailleMax: "500 Ko", traduction: false, legalisation: false }
],
source: SOURCES.DOSSIER,
verifieLe: VERIFIE
},

// AJOUT — le test de français avant dépôt tient à une mention du
// baccalauréat sénégalais (« Arabe L-AR ») : il n'a de sens que pour un
// candidat qui a passé ce bac-là.
ef_pieces: {
consigneSup: "Si votre baccalauréat porte la mention Arabe L-AR, vous devez obligatoirement passer un test de français AVANT de déposer votre dossier sur la plateforme : ne le laissez pas pour la fin, il conditionne le dépôt.",
// « B2 » EST DIT EN FRANÇAIS ORDINAIRE (lot R24).
//
// Charles, le 2026-09-18 : « la plupart des étudiants ou ressortissants
// africains ne maîtrisent pas les C1 ou A1 ou B2 […] donc je sais même
// pas quoi cocher ». Le lot R16 a chassé ces codes du profil ; celui-ci
// était resté, dans un nom de pièce. Le nom garde « Certification B2 »
// — c'est le titre du papier qu'on lui demandera — et l'aide dit ce que
// B2 veut dire, avec les mots exacts que R16 a retenus pour ce niveau.
piecesSup: [
{ slug: "certification-b2-de-francais-bac-arabe-l-ar-uniquement", nom: "Certification B2 de français (bac Arabe L-AR uniquement)", aide: "Seulement si votre baccalauréat porte la mention Arabe L-AR. Le niveau B2, c'est « je suis à l'aise, je pourrais étudier en français » : passez le test AVANT de déposer votre dossier.", format: "scan", tailleMax: "500 Ko", traduction: false, legalisation: false }
],
source: SOURCES.DOSSIER,
verifieLe: VERIFIE
},

// AJOUT — le préfixe du numéro de dossier est celui de l'espace du pays.
ef_soumission: {
consigneSup: "Depuis le Sénégal, ce numéro commence par « SN ».",
source: SOURCES.FAQ,
verifieLe: VERIFIE
},

// REMPLACEMENT — montant, banque, délai de relance : tout est local, et
// le titre lui-même porte le montant, parce qu'un étudiant qui découvre
// 85 000 F au moment de payer a déjà organisé son budget sans eux.
ef_paiement: {
titre: "Payer les frais de dossier — 85 000 F, non remboursables",
consigne: "Attendez le courriel de demande de paiement, envoyé après la soumission et le traitement de votre dossier : ne payez JAMAIS avant. Réglez en agence SUNU BANK (ex-BICIS) avec la demande de paiement, une pièce d'identité et votre numéro de dossier. Si le paiement n'est pas validé après 7 jours, présentez le reçu à l'espace Campus France le plus proche ou écrivez depuis votre compte. La demande de paiement ne signifie pas que le dossier est éligible.",
montant: 85000,
devise: "XOF",
source: SOURCES.FAQ,
verifieLe: VERIFIE
},

// REMPLACEMENT — le délai de sept jours et l'antenne sont du calendrier
// et du réseau sénégalais.
ef_entretien: {
consigne: "Dès réception du courriel d'autorisation, prenez rendez-vous sur la plateforme dans les 7 jours. L'entretien a lieu à l'antenne déterminée par l'adresse de votre dossier. Si aucun créneau n'apparaît, Campus France en ouvre régulièrement : consultez le planning souvent.",
source: SOURCES.CAL,
verifieLe: VERIFIE
},

// REMPLACEMENT — le guichet national est au tronc ; le centre où l'on
// dépose réellement son dossier de visa est ici.
ef_visa: {
consigne: "Dès réception du courriel de fin de procédure, déposez votre demande de visa sur france-visas.gouv.fr (rendez-vous VFS Global à Dakar), et avant la clôture de la campagne visas : n'attendez pas le dernier moment.",
source: SOURCES.CAL,
verifieLe: VERIFIE
}

}

};
