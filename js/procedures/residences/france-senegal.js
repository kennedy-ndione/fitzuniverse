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
piecesSup: [
{ nom: "Carte de séjour en cours de validité ou récépissé, et justificatifs d'une activité au Sénégal depuis au moins un an (candidats non sénégalais, hors zone CEDEAO)", format: "scan", tailleMax: "500 Ko", traduction: false, legalisation: false }
],
source: SOURCES.DOSSIER,
verifieLe: VERIFIE
},

// AJOUT — le test de français avant dépôt tient à une mention du
// baccalauréat sénégalais (« Arabe L-AR ») : il n'a de sens que pour un
// candidat qui a passé ce bac-là.
ef_pieces: {
consigneSup: "Si votre baccalauréat porte la mention Arabe L-AR, vous devez obligatoirement passer un test de français AVANT de déposer votre dossier sur la plateforme : ne le laissez pas pour la fin, il conditionne le dépôt.",
piecesSup: [
{ nom: "Certification B2 de français (bac Arabe L-AR uniquement)", format: "scan", tailleMax: "500 Ko", traduction: false, legalisation: false }
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
