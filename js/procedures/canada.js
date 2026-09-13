/**
* ============================================================
* FitzUniverse — le TRONC de la procédure Canada (lot S3)
* ============================================================
*
* CE QUI A CHANGÉ, ET QU'IL FAUT DIRE EN PREMIER. Le Volet direct pour
* les études (VDE / SDS) et le Nigeria Student Express ont été
* SUPPRIMÉS le 8 novembre 2024 à 14 h HE. Le Sénégal et le Maroc en
* faisaient partie. Il n'existe donc plus aujourd'hui de voie accélérée
* par pays, plus d'obligation de CPG ni de test de langue à ce titre ;
* toutes les demandes passent par le volet régulier. Depuis la même
* date, on ne peut plus changer d'école sur le même permis d'études.
* Un étudiant qui lit encore « VDE » quelque part lit une page périmée,
* et c'est précisément le genre d'erreur qui coûte une année.
*
* DEUX RÉGIMES, PAS UN. Hors Québec, c'est la lettre d'attestation
* provinciale ou territoriale (LAP/LAT). Au Québec, c'est le CAQ,
* demandé sur Arrima AVANT le permis d'études. Les deux branches sont
* dans ce tronc, et l'étape ca_lap_lat dit qui est exempté.
*
* AUCUNE COUCHE DE RÉSIDENCE : tous les montants sont fédéraux ou
* québécois, aucun ne dépend du pays de départ. `residenceRequise:
* false`.
*
* CE QU'ON N'A PAS TROUVÉ, et qu'on n'estime pas : le coût de l'examen
* médical d'immigration (IRCC ne publie aucun barème, on paie le
* médecin désigné directement), les frais de service des centres de
* réception des demandes de visa, et le délai de traitement du permis
* d'études par pays — la page officielle n'affiche que « varie selon le
* pays ».
* ============================================================
*/

const VERIFIE = "2026-09-13";

export const SOURCES = {
PERMIS: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit.html",
EED: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/prepare/designated-learning-institutions-list.html",
DOCUMENTS: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/get-documents.html",
LAP: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/get-documents/provincial-attestation-letter.html",
FONDS: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/get-documents/financial-support.html",
DEMANDE: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/apply.html",
APRES: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/after-apply-next-steps.html",
ARRIVEE: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/prepare-arrival.html",
COMPTES: "https://www.canada.ca/en/immigration-refugees-citizenship/services/application/ircc-accounts.html",
BIOMETRIE: "https://www.canada.ca/en/immigration-refugees-citizenship/campaigns/biometrics.html",
MEDICAL: "https://www.canada.ca/en/immigration-refugees-citizenship/services/application/medical-police/medical-exams/requirements-temporary-residents.html",
FIN_VDE: "https://www.canada.ca/en/immigration-refugees-citizenship/news/notices/end-student-direct-stream-nigeria-student-express.html",
PLAFOND_2026: "https://www.canada.ca/en/immigration-refugees-citizenship/news/notices/2026-provincial-territorial-allocations-under-international-student-cap.html",
QUEBEC_AUTORISATIONS: "https://www.quebec.ca/en/education/study-quebec/obtaining-authorizations/authorizations",
QUEBEC_SELECTION: "https://www.quebec.ca/en/education/study-quebec/temporary-selection-studies"
};

export const PROCEDURE_CANADA = {

id: "canada",
paysDestination: "Canada",
portail: {
nom: "Compte IRCC",
url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/application/ircc-accounts.html",
motif: "(ircc|cic)\\.(canada\\.)?gc\\.ca|canada\\.ca/en/immigration"
},
sources: SOURCES,
residenceRequise: false,

etapes: [

{
id: "ca_eed",
type: "voeux",
titre: "Choisir un établissement d'enseignement désigné (EED)",
consigne: "Tout part de là. Choisissez votre école dans la liste officielle des établissements d'enseignement désignés publiée par IRCC : une lettre d'acceptation n'ouvre droit à un permis d'études QUE si elle vient d'un EED. La liste vous dit trois choses décisives : si l'établissement est public ou privé, s'il offre des programmes admissibles au permis de travail postdiplôme (PTPD/PGWP), et s'il offre des programmes de cycles supérieurs en EED public. Cette dernière ligne change tout : depuis le 1er janvier 2026, les étudiants de maîtrise et de doctorat inscrits dans un EED PUBLIC n'ont plus besoin de lettre d'attestation provinciale. Vérifiez aussi l'admissibilité au PTPD MAINTENANT, avant de candidater : elle dépend de la date de dépôt de votre demande et du programme.",
prerequis: [],
preuve: "capture",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.EED,
verifieLe: VERIFIE
},

{
id: "ca_candidature",
type: "soumission",
titre: "Candidater auprès de l'établissement",
consigne: "Déposez votre candidature DIRECTEMENT auprès de l'EED choisi, selon sa procédure et son calendrier : il n'existe aucun portail fédéral centralisé de candidature universitaire au Canada, contrairement à la France ou à l'Italie. IRCC ne publie ni dates limites d'admission ni frais de dossier — ils varient d'une école à l'autre, et c'est sur le site de l'établissement que vous les lisez. Sortez de cette étape avec un numéro de dossier d'admission.",
prerequis: ["ca_eed"],
preuve: "numero_dossier",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.EED,
verifieLe: VERIFIE
},

{
id: "ca_lettre_acceptation",
type: "reponse",
titre: "Obtenir ma lettre d'acceptation",
consigne: "L'établissement vous remet sa lettre d'acceptation (letter of acceptance). IRCC la qualifie de document « toujours exigé » et elle doit être téléversée dans votre demande en ligne : une demande sans lettre d'acceptation valide peut être refusée. Conservez le PDF original transmis par l'école, tel quel, sans le réimprimer ni le modifier.",
prerequis: ["ca_candidature"],
preuve: "aucune",
pieces: [
{ nom: "Lettre d'acceptation de l'EED", format: "PDF", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.DOCUMENTS,
verifieLe: VERIFIE
},

{
id: "ca_lap_lat",
phaseDepart: true,
type: "pieces",
titre: "Obtenir ma lettre d'attestation provinciale (hors Québec)",
consigne: "Pour étudier hors Québec, il vous faut la lettre d'attestation provinciale ou territoriale (LAP/PAL, LAT/TAL) : elle est délivrée par la province et remise par votre école, et confirme qu'une place vous est réservée dans le quota provincial. Dans la plupart des cas, il faut d'abord ACCEPTER l'offre d'admission et payer tout ou partie des droits de scolarité pour l'obtenir — demandez à votre école la marche à suivre. Une LAP/LAT du millésime 2026 est délivrée entre le 1er janvier et le 31 décembre 2026 et vaut jusqu'au 31 décembre 2026, sauf date d'expiration antérieure inscrite dessus ; une LAP/LAT d'une année de plafond antérieure n'est plus utilisable. Elle doit être jointe AVEC la demande de permis, jamais après, et il en faut une par demandeur. Sont exemptés : préscolaire, primaire et secondaire jusqu'à la 12e année ; les programmes de maîtrise et de doctorat menant à un diplôme dans un EED PUBLIC, depuis le 1er janvier 2026 ; le Volet des étudiants des communautés francophones en situation minoritaire ; les collèges militaires désignés par le fédéral ; la formation professionnelle au Québec (DEP, ASP, AEP) ; les étudiants d'échange ; et les boursiers d'Affaires mondiales Canada. Même exempté, vous devez fournir la preuve de votre exemption dans le champ « Client information ».",
prerequis: ["ca_lettre_acceptation"],
preuve: "aucune",
pieces: [
{ nom: "Lettre d'attestation provinciale ou territoriale (LAP/LAT)", format: "PDF", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.LAP,
verifieLe: VERIFIE
},

{
id: "ca_caq_compte",
phaseDepart: true,
type: "compte",
titre: "Ouvrir mon dossier Arrima pour le CAQ (Québec)",
consigne: "Pour le Québec, la LAP/LAT est remplacée par le Certificat d'acceptation du Québec (CAQ) pour études, obligatoire pour tout programme de plus de six mois. L'ORDRE COMPTE : d'abord la lettre d'admission, puis IMMÉDIATEMENT la demande de sélection temporaire pour études, puis seulement la demande de permis d'études. L'inverse ne fonctionne pas. Créez votre compte sur Arrima en inscrivant exactement les nom et prénom de votre passeport, puis remplissez le formulaire EN UNE SEULE FOIS : il ne peut pas être sauvegardé en cours de route. Ayez sous la main votre passeport, votre lettre d'admission, l'information sur les droits de scolarité et une carte de crédit valide (Visa, Mastercard ou American Express). Deux exclusions à connaître : aucun CAQ pour un programme suivi entièrement en ligne, ni pour les cours de français offerts par le gouvernement du Québec.",
prerequis: ["ca_lettre_acceptation"],
preuve: "numero_dossier",
pieces: [
{ nom: "Passeport", format: "PDF", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Lettre d'admission de l'établissement québécois", format: "PDF", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.QUEBEC_SELECTION,
verifieLe: VERIFIE
},

{
id: "ca_caq_paiement",
phaseDepart: true,
type: "paiement",
titre: "Payer les frais du CAQ et téléverser mes pièces",
consigne: "Payez les frais d'examen de la demande de sélection temporaire pour études : 135 $ CA pour un étudiant étranger depuis le 1er janvier 2026, indexés chaque 1er janvier, par carte de crédit uniquement. ATTENTION AU MINUTEUR : le paiement doit être fait DANS L'HEURE qui suit l'envoi de la demande, sinon elle n'est pas considérée comme déposée. Les frais ne sont pas remboursés, même en cas de refus, sauf demande jugée non recevable. Un numéro de dossier apparaît dans Arrima dans les 48 heures suivant le paiement, et vous avez alors 15 JOURS pour téléverser les pièces demandées. Le ministère rend sa décision dans les 25 jours ouvrables suivant la réception d'un dossier complet, dans 80 % des cas. Vous recevez la lettre confirmant la délivrance de votre CAQ : c'est elle qui tient lieu de lettre d'attestation provinciale pour la demande de permis d'études.",
prerequis: ["ca_caq_compte"],
preuve: "recu",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.QUEBEC_SELECTION,
verifieLe: VERIFIE
},

{
id: "ca_fonds",
phaseDepart: true,
type: "pieces",
titre: "Constituer ma preuve de capacité financière",
consigne: "Vous devez prouver que vous pouvez, SANS travailler au Canada, payer vos droits de scolarité, vos frais de subsistance et votre transport aller-retour, pour vous et les personnes qui vous accompagnent. HORS QUÉBEC, pour toute demande déposée le 1er septembre 2026 ou après, le montant de subsistance de la première année — hors scolarité et hors transport — est de 23 448 $ CA pour une personne seule ; 29 192 $ pour 2 ; 35 888 $ pour 3 ; 43 572 $ pour 4 ; 49 419 $ pour 5 ; 55 736 $ pour 6 ; 62 054 $ pour 7 ; puis 6 318 $ par personne en plus. Le barème précédent, pour les demandes du 1er janvier 2025 au 31 août 2026, était de 22 895 $ pour une personne : si vous lisez ce chiffre quelque part, c'est une page périmée. AU QUÉBEC, ce sont les montants du ministère québécois, pour une demande déposée à compter du 1er janvier 2026 : 24 617 $ CA pour 1 personne ; 34 814 $ pour 2 ; 42 638 $ pour 3 ; 49 234 $ pour 4 ; 55 045 $ pour 5 ; 60 299 $ pour 6 ; puis 5 254 $ par personne supplémentaire. Vous prouvez les fonds de la PREMIÈRE année, et vous expliquez comment le reste sera financé si le programme dure plus longtemps. Depuis la fin du VDE, le CPG n'est plus obligatoire mais reste accepté. Si vous résidez au Sénégal, au Maroc, en Côte d'Ivoire ou dans un territoire non listé par le ministère québécois, votre preuve financière liée au CAQ ne se dépose pas dans Arrima : elle est présentée au bureau des visas canadien qui traite votre permis d'études.",
prerequis: ["ca_lettre_acceptation"],
preuve: "aucune",
pieces: [
{ nom: "Preuve de fonds : relevés bancaires, CPG, preuve de bourse, preuve d'emploi et de revenus des parents", format: "PDF", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.FONDS,
verifieLe: VERIFIE
},

{
id: "ca_compte_ircc",
phaseDepart: true,
type: "compte",
titre: "Créer mon compte IRCC",
consigne: "Créez votre compte IRCC pour déposer la demande de permis d'études : IRCC vous dirige vers le compte sécurisé IRCC — ouvert avec une CléGC/GCKey, ou par le service « Sign-In Partner » qui passe par votre banque — ou vers l'IRCC portal. C'est de là que vous payez, soumettez et suivez votre dossier. Il vous faut un scanner ou un appareil photo, et une carte de crédit ou de débit valide. Notez et conservez votre identificateur unique de client (IUC/UCI) et votre numéro de demande : sans eux, aucun suivi n'est possible.",
prerequis: ["ca_lettre_acceptation"],
preuve: "numero_dossier",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.COMPTES,
verifieLe: VERIFIE
},

{
id: "ca_demande_permis",
phaseDepart: true,
type: "soumission",
titre: "Déposer ma demande de permis d'études",
consigne: "Depuis votre compte, sélectionnez votre pays de résidence pour obtenir les instructions de votre bureau des visas local, lisez le guide, répondez au questionnaire qui génère votre liste de documents personnalisée, puis téléversez. Joignez : la lettre d'acceptation de l'EED ; la LAP/LAT dans le champ « Provincial attestation letter (required) » — ou, si ce champ est absent, dans « Client information » — ou, pour le Québec, la lettre de délivrance du CAQ ; la copie de la page d'identification de votre passeport ; deux photos format passeport portant au dos vos nom et date de naissance ; votre preuve de fonds ; et une lettre d'explication, vivement recommandée, qui dit pourquoi vous voulez étudier au Canada, pourquoi ce programme, et ce que vous ferez après. IRCC prévient : une demande incomplète peut être RENVOYÉE SANS TRAITEMENT. Le dépôt en ligne est obligatoire ; le papier n'est possible qu'en cas de handicap empêchant la demande en ligne, ou de titre de voyage pour apatride ou réfugié.",
// LES DEUX BRANCHES SONT EXCLUSIVES : hors Québec c'est la LAP/LAT,
// au Québec c'est le CAQ. Les exiger toutes les deux en prérequis
// rendrait cette étape éternellement infaisable pour tout le monde —
// la dépendance est donc DITE dans la consigne, pas imposée par le
// moteur.
prerequis: ["ca_compte_ircc", "ca_fonds"],
preuve: "numero_dossier",
apresConnexion: true,
pieces: [
{ nom: "Copie de la page d'identification du passeport", format: "PDF", tailleMax: null, traduction: false, legalisation: false },
{ nom: "2 photos format passeport récentes, nom et date de naissance au dos", format: "PDF", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Lettre d'explication", format: "PDF", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Certificat de police, si demandé", format: "PDF", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.DEMANDE,
verifieLe: VERIFIE
},

{
id: "ca_paiement_ircc",
phaseDepart: true,
type: "paiement",
titre: "Payer les frais fédéraux",
consigne: "À la fin de la demande en ligne, payez dans votre compte IRCC : 150 $ CA pour le permis d'études, plus 85 $ CA de frais de biométrie par demandeur — plafonnés à 170 $ CA pour une famille qui dépose en même temps. IRCC accepte Visa, Mastercard, American Express, JCB, les cartes prépayées et les cartes Visa Débit, et la carte N'A PAS besoin d'être à votre nom : un proche peut payer pour vous. Payez les frais de biométrie AU MOMENT DU DÉPÔT, sinon votre dossier prend du retard. Bonne nouvelle : si vous avez besoin d'une AVE ou d'un visa de résident temporaire, IRCC le délivre automatiquement avec le permis d'études, sans demande ni frais supplémentaires. Conservez le reçu électronique.",
prerequis: ["ca_demande_permis"],
preuve: "recu",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.DEMANDE,
verifieLe: VERIFIE
},

{
id: "ca_biometrie",
phaseDepart: true,
type: "complement",
titre: "Donner mes empreintes et ma photo",
consigne: "Après le dépôt, IRCC vous envoie une lettre de convocation à la biométrie. Si vous avez entre 14 et 79 ans, vous devez vous présenter à un point de collecte dans les 30 JOURS suivant la date de cette lettre. Prenez rendez-vous IMMÉDIATEMENT : IRCC ne commence à traiter votre dossier qu'après réception de la biométrie, donc chaque jour d'attente est un jour perdu. Bonne nouvelle : pour les demandes de résidence temporaire, la biométrie ne se redonne qu'une fois tous les 10 ans. Les éventuels frais de service d'un centre de réception des demandes de visa se paient directement au prestataire, hors du compte IRCC.",
prerequis: ["ca_paiement_ircc"],
preuve: "convocation",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.BIOMETRIE,
verifieLe: VERIFIE
},

{
id: "ca_medical",
phaseDepart: true,
type: "complement",
titre: "Passer l'examen médical d'immigration, s'il est requis",
consigne: "Vérifiez si vous devez passer un examen médical : c'est le cas, notamment, si vous séjournez plus de six mois ET que vous avez vécu ou voyagé six mois consécutifs ou plus, dans l'année précédant votre arrivée, dans un pays figurant sur la liste d'IRCC — ce qui concerne la plupart des candidats africains — ou si vous occuperez un emploi où la santé publique doit être protégée. L'examen ne peut être fait QUE par un médecin désigné (panel physician), jamais par votre médecin traitant. Faites-le en amont, en examen médical préalable, et joignez à votre demande le document que le médecin vous remet. IRCC ne publie aucun tarif : vous payez sur place, directement au médecin, ses honoraires et ceux du radiologiste, les examens spéciaux et les consultations de spécialistes, et ces frais ne sont pas remboursés en cas de refus. Les résultats sont valides 12 mois et doivent l'être encore LE JOUR de votre entrée au Canada.",
prerequis: ["ca_demande_permis"],
preuve: "aucune",
pieces: [
{ nom: "Attestation de passage de l'examen médical remise par le médecin désigné", format: "PDF", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.MEDICAL,
verifieLe: VERIFIE
},

{
id: "ca_lettre_introduction",
phaseDepart: true,
type: "visa",
titre: "Recevoir ma lettre d'introduction et mon visa ou AVE",
consigne: "Si votre demande est approuvée, IRCC vous envoie une lettre d'introduction au point d'entrée. ATTENTION, ce n'est PAS le permis d'études : c'est une attestation que vous êtes autorisé à étudier au Canada, portant le numéro de référence du permis qui sera délivré. Selon votre nationalité, IRCC y joint une AVE liée électroniquement à votre passeport (valide 5 ans ou jusqu'à l'expiration du passeport) ou un visa de résident temporaire apposé dans le passeport, à utiliser avant son expiration. Règle absolue : voyagez avec LE passeport utilisé pour la demande, pas un autre, même valide. Une lettre d'approbation est aussi déposée dans votre compte en ligne.",
prerequis: ["ca_biometrie"],
preuve: "aucune",
pieces: [
{ nom: "Lettre d'introduction au point d'entrée", format: "PDF", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.APRES,
verifieLe: VERIFIE
},

{
id: "ca_arrivee",
phaseDepart: true,
type: "confirmation",
titre: "Arriver au point d'entrée et recevoir mon permis",
consigne: "C'est à l'arrivée, et pas avant, que votre permis d'études vous est délivré. Présentez-vous à l'agent des services frontaliers avec, EN MAIN et non en soute : un titre de voyage valide, la lettre d'introduction, une copie de votre lettre d'acceptation valide, les lettres de référence ou autres documents réclamés par le bureau des visas, votre AVE ou votre visa valide, la preuve de résultats médicaux valides le jour même si un examen était requis, et de quoi subvenir à vos besoins. L'agent vérifie votre identité, éventuellement par votre biométrie, et votre admissibilité, puis délivre le permis. Aucun délai minimal n'est imposé avant le début des cours, mais vous n'avez PAS le droit de travailler, sur ou hors campus, avant le début effectif de vos études. Si votre établissement exige une preuve d'entrée au Canada, demandez à l'agent de tamponner votre passeport AVANT de quitter la zone douanière : après, c'est trop tard.",
prerequis: ["ca_lettre_introduction"],
preuve: "aucune",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.ARRIVEE,
verifieLe: VERIFIE
}

]
};
