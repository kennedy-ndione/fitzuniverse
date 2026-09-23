/**
* ============================================================
* FitzUniverse — le TRONC de la procédure Chine (2026-09-23)
* ============================================================
*
* DEUX VOIES, COMME LA TURQUIE (décision de Charles, 2026-09-23). La
* bourse du gouvernement chinois se demande en ligne sur le système du
* China Scholarship Council (CSC), soit en TYPE A (par l'ambassade de
* Chine du pays d'origine, qui présélectionne ; au Sénégal, avec un
* dossier papier à la Direction des Bourses), soit en TYPE B (par une
* université chinoise, avec le numéro d'agence de cette université).
* L'autofinancement passe par une candidature directe sur le système de
* CHAQUE université. Les deux voies se rejoignent sur l'avis d'admission
* et le formulaire JW201 (boursiers) ou JW202 (les autres), puis visa X1,
* arrivée, permis de résidence dans les 30 jours, assurance.
*
* LE PIÈGE DE LA LICENCE : depuis 2026-2027, l'examen CSCA est exigé
* pour entrer en licence, bourse ou autofinancement. Et la bourse exige
* un avis de PRÉ-ADMISSION d'une université avant le dépôt.
*
* LUS LE 2026-09-23 : l'avis 2026-2027 de l'ambassade de Chine au
* Sénégal (texte servi en JavaScript, lu dans un navigateur) et ses deux
* pièces jointes (instructions du système, exigences et pièces). Ils ont
* levé les deux étapes « à confirmer » de la recherche : le numéro
* d'agence 6861 est celui de 2026-2027, et l'évaluation préliminaire au
* Sénégal se fait sur dossier, sans entretien annoncé.
*
* CE QU'ON N'A PAS PU LIRE : campuschina.org et studyinchina.csc.edu.cn
* refusent la lecture automatique ; la liste de pièces du centre de visas
* de Dakar est générée en JavaScript. C'est dit dans les consignes et
* dans les absences du diagnostic (js/destinations-preinscription.js).
*
* AUCUNE COUCHE DE RÉSIDENCE : `residenceRequise: false`. Ce que
* l'ambassade de Chine au Sénégal publie est écrit, nommé comme tel, dans
* les consignes.
* ============================================================
*/

const VERIFIE = "2026-09-23";

export const SOURCES = {
CSC_SYSTEME: "https://studyinchina.csc.edu.cn/#/login",
CAMPUS_CHINA: "https://www.campuschina.org/",
AMB_SN_BOURSE_2026: "https://sn.china-embassy.gov.cn/fra/sgdt/202510/t20251028_11742627.htm",
AMB_SN_CENTRE_VISA: "https://sn.china-embassy.gov.cn/fra/lsfw/gyqz/201809/t20180925_7648369.htm",
AMB_KM_BOURSE: "https://km.china-embassy.gov.cn/fra/zxdt/202511/t20251120_11756439.htm",
AMB_IE_BOURSE: "https://ie.china-embassy.gov.cn/eng/tz/202511/t20251121_11757227.htm",
AMB_TN_BOURSE: "https://tn.china-embassy.gov.cn/fra/zytz/202511/t20251115_11753763.htm",
AMB_BF_CSCA: "https://bf.china-embassy.gov.cn/fra/sbjw_1/202604/t20260402_11885350.htm",
AMB_MN_CSCA: "https://mn.china-embassy.gov.cn/eng/zytz/202510/t20251030_11743700.htm",
CONSULAT_SAINT_DENIS_X1: "https://saintdenis.china-consulate.gov.cn/fra/lsfw/Visas/201805/t20180504_4209845.htm",
CENTRE_VISA_DKR_FRAIS: "https://www.visaforchina.cn/DKR3_FR/qianzhengyewu/jichuzhishi/feiyongbiaozhunjishixian",
SHANGHAI_CSCA: "https://edu.sh.gov.cn/study_en_news/20251114/d4ca5e9d388546f4adc0f356d3354d59.html",
PEKIN_GUIDE_X1: "https://french.beijing.gov.cn/studyinginbeijing/visaapplications/202306/t20230626_3146191.html",
NIA_PERMIS: "https://s.nia.gov.cn/mps/bszy/wgrcrjEn/e-sqwgrjlzj/202201/index.html",
NIA_SEJOUR: "https://en.nia.gov.cn/n147423/n147478/n147715/c158270/content.html",
NIA_HEBERGEMENT: "https://en.nia.gov.cn/n147418/n147463/c197328/content.html",
CSCA_PORTAIL: "https://www.csca.cn/home",
SYSU_LICENCE_2026: "https://iso.sysu.edu.cn/en/application/guide/1420575.htm",
SYSU_MASTER_2026: "https://iso.sysu.edu.cn/en/application/guide/1420582.htm",
SYSU_BOURSE_A: "https://iso.sysu.edu.cn/en/application/scholarship/1417807.htm",
SYSU_BOURSE_B_2026: "https://iso.sysu.edu.cn/en/application/scholarship/1420667.htm",
SYSU_BAREME_2022: "https://iso.sysu.edu.cn/en/application/scholarship/1398979.htm",
ZJU_BOURSE_B: "https://iczu.zju.edu.cn/admissionsen/2022/0530/c68995a2590720/page.htm",
TSINGHUA_LICENCE_FRAIS: "https://international.join-tsinghua.edu.cn/Admission1/Fees.htm",
TSINGHUA_LICENCE_CALENDRIER: "https://international.join-tsinghua.edu.cn/Admission1/Schedule.htm",
TSINGHUA_MASTER_2027: "https://yz.tsinghua.edu.cn/en/info/1035/1581.htm",
TSINGHUA_RAPPELS_2027: "https://yz.tsinghua.edu.cn/en/info/1035/1583.htm",
TSINGHUA_DROITS_2027: "https://yzbm.tsinghua.edu.cn/publish/s05/s0501/detail/bb745c8c-e817-4532-8cc1-70fa21bae1b5",
TSINGHUA_FRAIS_DOSSIER: "https://yz.tsinghua.edu.cn/en/Costs/Application_Fee.htm",
TSINGHUA_MEDICAL: "https://is.tsinghua.edu.cn/GettingStarted/PrArrival/PhysicaExamination.htm",
WHU_VISA: "https://admission.whu.edu.cn/FRESHMEN_RELATED/VISA.htm",
HIT_BOURSE_2026: "https://studyathit.hit.edu.cn/18366/list.htm",
NJAU_JW: "https://coieen.njau.edu.cn/info/1157/5387.htm",
XJTLU_JW202: "https://www.xjtlu.edu.cn/en/admissions/ug/global/jw202-dq-forms-and-visa-application",
AMB_SN_INSTRUCTIONS_2026: "https://sn.china-embassy.gov.cn/fra/sgdt/202510/P020251028737917096552.pdf",
AMB_SN_EXIGENCES_2026: "https://sn.china-embassy.gov.cn/fra/sgdt/202510/P020251028737917409967.pdf"
};

export const PROCEDURE_CHINE = {

id: "chine",
paysDestination: "Chine",
portail: {
nom: "Campus China",
url: "https://www.campuschina.org/",
motif: "campuschina\\.org|studyinchina\\.csc\\.edu\\.cn|csca\\.cn|\\.edu\\.cn"
},
sources: SOURCES,
residenceRequise: false,

etapes: [

{
id: "cn_langue",
type: "pieces",
titre: "Prouver mon niveau de chinois (HSK) ou d'anglais",
consigne: "En Chine, la langue décide de tout. À l'université Sun Yat-sen, pour 2026 : toute candidature en licence exige le HSK de niveau 5 avec au moins 180 points (niveau 4, 180 points, pour la licence de langue chinoise) ; un master enseigné en chinois exige aussi le HSK 5 à 180 points (210 points et le HSKK intermédiaire à 60 points pour le master d'enseignement du chinois langue étrangère). Pour un programme enseigné en ANGLAIS, Sun Yat-sen demande le TOEFL iBT à 79 (15 par section) ou l'IELTS à 6,5 (5,5 par épreuve). À Tsinghua, le niveau exigé varie d'un programme à l'autre et se lit dans le catalogue des programmes. Vérifiez le niveau de CHAQUE programme visé avant de payer un test : un score insuffisant rend le dossier irrecevable. Pour la BOURSE du gouvernement chinois, l'ambassade de Chine au Sénégal (avis 2026-2027) précise que la licence ne se suit qu'en chinois, et qu'un master ou un doctorat en chinois exige au moins le HSK de niveau 4.",
prerequis: [],
preuve: "capture",
pieces: [
{ nom: "Certificat HSK (programmes enseignés en chinois)", format: "scan", tailleMax: null, traduction: false, legalisation: false, precision: "HSK 5, 180 points au moins à Sun Yat-sen ; niveau propre à chaque université" },
{ nom: "Test d'anglais IELTS ou TOEFL (programmes enseignés en anglais)", format: "scan", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.SYSU_MASTER_2026,
verifieLe: VERIFIE
},

{
id: "cn_csca",
type: "compte",
titre: "Licence : m'inscrire à l'examen CSCA",
consigne: "NOUVEAU DEPUIS 2026 : le CSCA (China Scholastic Competency Assessment), examen standardisé organisé par le China Scholarship Council, est exigé des candidats à une LICENCE dans les universités chinoises participantes, qu'ils demandent la bourse du gouvernement chinois ou qu'ils financent eux-mêmes leurs études. Les ambassades de Chine l'imposent pour la bourse en licence (au Sénégal, dès l'avis 2026-2027, avec les sessions du 21 décembre 2025 et du 25 janvier 2026), et Sun Yat-sen l'exige pour toute candidature en licence 2026. Épreuves : chinois de spécialité (lettres ou sciences, en chinois uniquement, 90 minutes) ; mathématiques, physique, chimie (en chinois OU en anglais, 60 minutes chacune). Les mathématiques sont obligatoires pour tous ; le chinois de spécialité l'est pour les programmes enseignés en chinois ; la physique et la chimie dépendent de l'université et de la filière. L'ambassade de Chine au Burkina Faso exige de ses candidats boursiers les mathématiques et le chinois, la physique et la chimie selon le département visé. Depuis 2026, cinq sessions par an : janvier, mars, avril, juin et décembre ; l'examen a d'abord eu lieu à distance, puis dans des centres ouverts pays par pays. Inscription sur le site officiel csca.cn ; frais : 450 CNY pour une matière, 700 CNY pour plusieurs. Résultats sous 7 jours ouvrables en ligne, 14 jours pour l'épreuve papier. L'ambassade de Chine au Burkina Faso précise que les scores des sessions de 2026 servent à la sélection des boursiers 2027-2028 : passez-le TÔT. Master ou doctorat : cette étape ne vous concerne pas.",
prerequis: [],
preuve: "numero_dossier",
pieces: [
{ nom: "Passeport", format: "scan", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.SHANGHAI_CSCA,
verifieLe: VERIFIE
},

{
id: "cn_sante_casier",
type: "pieces",
titre: "Faire mon examen médical (Foreigner Physical Examination Form) et mon casier judiciaire",
consigne: "Deux pièces sont réclamées DÈS LA CANDIDATURE, dans les deux voies : le « Foreigner Physical Examination Form » (formulaire officiel chinois d'examen médical des étrangers) et un certificat de non-condamnation (casier judiciaire). À Sun Yat-sen, l'un et l'autre doivent dater de MOINS DE SIX MOIS, et l'examen médical comprend une radiographie du thorax, un électrocardiogramme et des analyses de laboratoire ; Zhejiang exige les deux pièces pour sa bourse de type B. Le formulaire doit être rempli, signé et TAMPONNÉ par le médecin qui vous examine ; gardez l'ORIGINAL et les résultats d'analyses sanguines originaux : Tsinghua et Wuhan le font vérifier à l'arrivée par le centre de santé des voyageurs international de leur ville, et s'il n'est pas conforme, l'examen est à refaire sur place. Faites-les donc dans les six mois qui précèdent votre dépôt, pas avant : ils doivent encore être valables au moment de la candidature, et un nouvel examen sur place reste possible. Le coût de l'examen au Sénégal n'est publié nulle part.",
prerequis: [],
preuve: "capture",
pieces: [
{ nom: "Foreigner Physical Examination Form, signé et tamponné par le médecin", format: "original papier", tailleMax: null, traduction: false, legalisation: false, precision: "moins de six mois ; radio du thorax, ECG et analyses, originaux joints" },
{ nom: "Certificat de non-condamnation (casier judiciaire)", format: "original papier", tailleMax: null, traduction: false, legalisation: false, precision: "moins de six mois" }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.SYSU_MASTER_2026,
verifieLe: VERIFIE
},

{
id: "cn_choix_voie",
type: "saisie",
titre: "Choisir ma voie : bourse du gouvernement chinois ou autofinancement",
consigne: "Deux voies mènent à une université chinoise. La BOURSE du gouvernement chinois (CSC) se demande en ligne sur le système du China Scholarship Council, en type A (par l'ambassade de Chine de votre pays) ou en type B (par une université chinoise) ; ses dates limites tombent tôt, le plus souvent entre décembre et février pour une rentrée en septembre. L'AUTOFINANCEMENT passe par une candidature directe sur le système en ligne de CHAQUE université, avec des frais de dossier et des droits de scolarité à votre charge ; les universités ont souvent deux sessions (Sun Yat-sen en 2026 : licence du 1er janvier au 28 février puis du 1er mars au 30 avril ; master du 1er janvier au 15 février puis du 16 février au 30 avril). Une même université, comme Sun Yat-sen, propose les bourses de type A et B à côté de l'admission autofinancée : choisissez ici la voie que vous suivez, vous pourrez en changer plus tard. Et décidez dès la rentrée qui précède : c'est la bourse qui ferme la première.",
prerequis: [],
preuve: "aucune",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.SYSU_MASTER_2026,
verifieLe: VERIFIE
},

{
id: "cn_bourse_type",
type: "saisie",
titre: "Bourse : choisir le type A (ambassade) ou le type B (université)",
consigne: "TYPE A (programme bilatéral) : vous candidatez auprès de l'« autorité d'envoi » de votre pays, en pratique l'ambassade de Chine, qui présélectionne et recommande les candidats ; c'est elle qui vous donne le numéro d'agence à saisir. TYPE B (programme des universités chinoises) : vous candidatez directement auprès d'une université chinoise habilitée, avec le numéro d'agence de CETTE université (Zhejiang : 10335 ; Sun Yat-sen : 10558), et le plus souvent aussi sur le système propre de l'université. Âges maximum publiés par Sun Yat-sen pour le type A : moins de 25 ans en licence, 35 en master, 40 en doctorat ; pour son type B 2026 : 35 ans en master et 40 en doctorat, « en général ». L'ambassade de Chine au Sénégal applique ces mêmes limites pour 2026-2027 (moins de 25, 35 et 40 ans) et ouvre le type A en licence, en master et en doctorat, dans toutes les filières des universités habilitées à recevoir des boursiers. Toutes les universités ne proposent pas toutes les bourses : l'Institut de technologie de Harbin, par exemple, ne finance pas la licence dans son programme CSC 2026.",
prerequis: ["cn_choix_voie"],
preuve: "aucune",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.SYSU_BOURSE_A,
verifieLe: VERIFIE
},

{
id: "cn_bourse_compte",
type: "compte",
titre: "Bourse : créer mon compte sur le système du CSC",
consigne: "La candidature se fait en ligne sur le « Chinese Government Scholarship Information System » du China Scholarship Council, accessible depuis campuschina.org. Les instructions 2026-2027 de l'ambassade de Chine au Sénégal en décrivent les écrans : créer son compte, saisir ses informations personnelles, choisir la catégorie de programme « Type A », saisir le numéro d'agence (6861 pour le Sénégal), remplir la demande, la soumettre, puis imprimer le formulaire. Dans la demande, vous choisissez une spécialité, selon votre formation antérieure, et TROIS universités parmi celles qui reçoivent des boursiers. En type B, c'est le numéro d'agence de l'université qui se saisit (Zhejiang : 10335 ; Sun Yat-sen : 10558). Recopiez le numéro depuis l'avis officiel de l'année, jamais depuis un site privé.",
prerequis: ["cn_bourse_type"],
preuve: "capture",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.AMB_SN_INSTRUCTIONS_2026,
verifieLe: VERIFIE
},

{
id: "cn_bourse_pieces",
type: "pieces",
titre: "Bourse : téléverser mes pièces dans le système du CSC",
consigne: "Toutes les pièces se téléversent dans le système en ligne. Liste de l'ambassade de Chine au Sénégal pour 2026-2027 : formulaire de demande, passeport, diplôme le plus élevé NOTARIÉ, relevés de notes, justificatif de langue (HSK, ou IELTS ou TOEFL selon l'université), projet d'études d'au moins 200 mots en licence et 800 mots en master ou doctorat, deux lettres de recommandation en chinois ou en anglais (master, doctorat), Foreigner Physical Examination Form, valable six mois seulement, et certificat de non-condamnation, le plus souvent de moins de six mois. En LICENCE, ajoutez le relevé de score CSCA. Toute pièce qui n'est ni en chinois ni en anglais doit être accompagnée d'une traduction certifiée dans l'une de ces deux langues. SURTOUT : l'ambassade exige, AVANT le dépôt, au moins un AVIS DE PRÉ-ADMISSION de l'une des trois universités choisies ; écrivez-leur directement, et tôt. Les formats et tailles de fichiers ne sont pas publiés : préparez des PDF lisibles et légers.",
prerequis: ["cn_bourse_compte", "cn_langue", "cn_sante_casier"],
preuve: "capture",
pieces: [
{ nom: "Formulaire de demande de bourse du gouvernement chinois", format: "PDF", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Passeport", format: "scan", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Diplôme le plus élevé, notarié, et relevés de notes", format: "scan", tailleMax: null, traduction: true, legalisation: true, precision: "traduction certifiée en chinois ou en anglais s'ils ne sont dans aucune des deux langues" },
{ nom: "Avis de pré-admission d'une des trois universités choisies", format: "scan", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Projet d'études ou de recherche", format: "PDF", tailleMax: null, traduction: false, legalisation: false, precision: "200 mots au moins en licence, 800 en master ou doctorat" },
{ nom: "Deux lettres de recommandation (master, doctorat)", format: "scan", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Justificatif de langue (HSK, IELTS, TOEFL)", format: "scan", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Foreigner Physical Examination Form", format: "scan", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Certificat de non-condamnation", format: "scan", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Licence : relevé de score CSCA", format: "scan", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.AMB_SN_EXIGENCES_2026,
verifieLe: VERIFIE
},

{
id: "cn_bourse_soumission",
type: "soumission",
titre: "Bourse : soumettre ma candidature avant la date limite",
consigne: "Soumettez dans le système du CSC AVANT la date limite de votre autorité d'envoi. Il n'y a pas de date unique : pour 2026-2027, les ambassades de Chine ont fermé le 30 janvier 2026 (Comores), le 15 février (Sénégal, Irlande) ou le 18 février (Tunisie) ; les universités de type B, le 31 décembre 2025 (Zhejiang) ou le 15 février 2026 (Sun Yat-sen). Pour 2027-2028, Tsinghua annonce déjà une première date limite à MI-DÉCEMBRE 2026 pour ses candidats boursiers en master et doctorat. En type B, la soumission au CSC NE SUFFIT PAS : il faut aussi candidater sur le système de l'université, avec ses propres frais. Au SÉNÉGAL, pour 2026-2027 : dépôt ouvert jusqu'au 15 février 2026, et le dossier PAPIER se remet EN MÊME TEMPS à la Direction des Bourses du ministère sénégalais de l'Enseignement supérieur, pour une évaluation préliminaire (service courrier, 52 rue Saint Michel, face au centre commercial Rotonde). Gardez une capture de la soumission.",
prerequis: ["cn_bourse_pieces"],
preuve: "numero_dossier",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.AMB_SN_BOURSE_2026,
verifieLe: VERIFIE
},

{
id: "cn_bourse_universite",
type: "complement",
titre: "Bourse de type B : candidater aussi sur le système de l'université",
consigne: "En TYPE B, la soumission au CSC ne suffit pas : il faut aussi candidater sur le système en ligne de l'université qui vous présente, avec ses frais, non remboursables. Zhejiang : isinfosys.zju.edu.cn, 800 CNY ; Sun Yat-sen : apply.sysu.edu.cn, 400 CNY. La bourse ne rembourse pas ces frais (Tsinghua le précise). Gardez le numéro de candidature et le reçu. En TYPE A, par l'ambassade, cette étape ne vous concerne pas : c'est l'avis de pré-admission, joint à vos pièces, qui vous lie à une université.",
prerequis: ["cn_bourse_soumission"],
preuve: "numero_dossier",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.ZJU_BOURSE_B,
verifieLe: VERIFIE
},

{
id: "cn_bourse_entretien",
type: "entretien",
titre: "Bourse : l'évaluation de mon dossier, et l'entretien éventuel",
consigne: "Après la soumission vient une évaluation, en deux temps. D'abord dans votre pays, ou par l'université. Au Sénégal, c'est la Direction des Bourses qui fait l'évaluation préliminaire, sur le dossier papier ; l'avis 2026-2027 de l'ambassade de Chine ne mentionne aucun entretien. Ailleurs, l'ambassade peut convoquer : celle des Comores a fait passer ses entretiens du 1er au 10 février 2026. En type B, Sun Yat-sen fait une revue de dossier puis un entretien, et publie ses résultats préliminaires environ 15 jours après. Ensuite, la décision FINALE revient au China Scholarship Council, qui peut encore refuser. Pour le Sénégal, l'ambassade annonçait les résultats de la bourse et de l'admission pour juillet 2026, et le départ des lauréats pour la fin août ou le début septembre.",
prerequis: ["cn_bourse_soumission"],
preuve: "aucune",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.AMB_SN_BOURSE_2026,
verifieLe: VERIFIE
},

{
id: "cn_bourse_resultat",
type: "reponse",
titre: "Bourse : recevoir le résultat et savoir ce que la bourse couvre",
consigne: "La bourse complète couvre les frais de scolarité, une chambre sur le campus ou une aide au logement, une allocation mensuelle et l'assurance maladie complète ; Tsinghua signale aussi des bourses PARTIELLES, qui ne couvrent qu'une partie de ces postes : lisez votre lettre. Montants publiés pour 2026 par l'Institut de technologie de Harbin : 3 000 CNY par mois en master, 3 500 CNY en doctorat, assurance de 800 CNY par an, et RIEN n'est versé avant l'arrivée en Chine. Pour la licence, le seul montant officiel trouvé est ancien : 2 500 CNY par mois, sur une page de Sun Yat-sen de 2022 renvoyant au barème du CSC de 2020. Les montants de l'année sont fixés par le CSC. L'avis 2026-2027 de l'ambassade de Chine au Sénégal y ajoute le voyage vers la Chine et le retour définitif à la fin des études, et, pour une formation en chinois sans le niveau exigé, une année préparatoire de chinois dans une université désignée par le CSC, elle aussi couverte. Un boursier ne peut pas cumuler une autre bourse chinoise.",
prerequis: ["cn_bourse_entretien"],
preuve: "capture",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.HIT_BOURSE_2026,
verifieLe: VERIFIE
},

{
id: "cn_uni_choix",
type: "voeux",
titre: "Autofinancement : choisir mes universités et mes programmes",
consigne: "Il n'existe pas de plateforme nationale en autofinancement : chaque université a son propre système de candidature, ses dates et ses conditions. Et les règles changent d'une université à l'autre. Tsinghua (master et doctorat 2027) : le système a ouvert à la mi-septembre 2026 et reste ouvert jusqu'en février 2027, mais les dates limites et les sessions DIFFÈRENT selon le département et le programme (rubrique « Remarks of Application » du catalogue) ; vous ne pouvez indiquer que DEUX programmes, et le second n'est examiné qu'après le refus du premier. Seuls 28 masters et 9 doctorats y sont enseignés en anglais. Tsinghua (licence 2025-2026) : première session du 30 septembre au 28 novembre 2025, seconde du 29 novembre 2025 au 28 février 2026, les formations de design et beaux-arts n'étant ouvertes qu'en première session. Pour chaque programme, notez la langue, le niveau exigé, les droits annuels et la date limite.",
prerequis: ["cn_choix_voie"],
preuve: "aucune",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.TSINGHUA_RAPPELS_2027,
verifieLe: VERIFIE
},

{
id: "cn_uni_candidature",
type: "soumission",
titre: "Autofinancement : candidater sur le système de chaque université",
consigne: "Créez un compte sur le système officiel de chaque université (Tsinghua master et doctorat : yzbm.tsinghua.edu.cn ; Tsinghua licence : apply.join-tsinghua.edu.cn ; Sun Yat-sen : apply.sysu.edu.cn) et déposez-y un dossier complet. Pièces demandées par Sun Yat-sen en master 2026 : passeport et photo, attestation de vérification du diplôme de licence, relevés de notes, certificats de langue, deux lettres de recommandation, projet d'études d'au moins 3 000 mots, examen médical et casier judiciaire de moins de six mois ; en licence : relevés de toute la scolarité, acte de naissance, score CSCA, certificat HSK. Tsinghua demande en master une lettre de motivation (projet de recherche en doctorat), les diplômes avec leur authentification, relevés, tests de langue, deux recommandations, passeport et justificatifs de nationalité ; une évaluation, le plus souvent un entretien, suit l'examen du dossier. Un dossier incomplet n'est pas traité.",
prerequis: ["cn_uni_choix", "cn_langue", "cn_sante_casier"],
preuve: "numero_dossier",
pieces: [
{ nom: "Passeport et photo d'identité", format: "scan", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Diplômes et relevés de notes, avec leur authentification", format: "scan", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Certificats de langue (HSK, IELTS ou TOEFL)", format: "scan", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Deux lettres de recommandation (master, doctorat)", format: "scan", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Lettre de motivation ou projet d'études", format: "PDF", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Examen médical et casier judiciaire de moins de six mois", format: "scan", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Licence : score CSCA et acte de naissance", format: "scan", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.SYSU_MASTER_2026,
verifieLe: VERIFIE
},

{
id: "cn_uni_frais",
type: "paiement",
titre: "Autofinancement : payer les frais de dossier",
consigne: "Chaque université fait payer sa candidature, en ligne, au moment de la soumission : 800 CNY à Tsinghua (licence comme master et doctorat), 400 CNY à Sun Yat-sen. Ces frais ne sont JAMAIS remboursés, que vous soyez admis ou non, et Tsinghua précise qu'un dossier non payé n'est pas étudié. Comptez-les par université visée, gardez chaque reçu, et ne payez que sur le système officiel de l'université.",
prerequis: ["cn_uni_candidature"],
preuve: "recu",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.TSINGHUA_FRAIS_DOSSIER,
verifieLe: VERIFIE
},

{
id: "cn_admission",
type: "reponse",
titre: "Recevoir mon avis d'admission et mon formulaire JW201 ou JW202",
consigne: "Admis, vous recevez de l'université un avis d'admission (Admission Notice) et un formulaire de demande de visa pour études en Chine, délivré par le MINISTÈRE DE L'ÉDUCATION par l'intermédiaire de l'université : le JW201 si vous êtes admis au titre de la bourse du CSC, le JW202 pour les programmes de licence, master et doctorat hors bourse. Ce sont les deux pièces du visa X1. Certaines universités ne demandent le JW202 qu'après paiement d'un acompte ou des droits (c'est le cas de XJTLU). Gardez les ORIGINAUX : ils servent au centre de visas, puis à l'inscription et au permis de résidence en Chine.",
prerequis: ["cn_choix_voie"],
preuve: "capture",
pieces: [
{ nom: "Avis d'admission de l'université (Admission Notice)", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Formulaire JW201 (boursier CSC) ou JW202 (autres étudiants)", format: "original papier", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.NJAU_JW,
verifieLe: VERIFIE
},

{
id: "cn_visa",
phaseDepart: true,
type: "visa",
titre: "Demander mon visa d'études X1",
consigne: "Pour des études de PLUS DE 180 JOURS, c'est le visa X1 (le X2 est réservé aux séjours d'études plus courts). AU SÉNÉGAL : depuis le 24 septembre 2018, les titulaires d'un passeport ordinaire déposent leur demande au Centre de service des visas chinois de Dakar, et non plus à l'ambassade (immeuble ATRYUM, km 8 avenue Cheikh Anta Diop, du lundi au vendredi de 9 h à 16 h), sur rendez-vous. Les droits de visa sont GRATUITS pour les ressortissants sénégalais ; seuls les frais de service du centre sont dus : 21 500 XOF en service standard (5 jours) ; en express (3 jours), 32 300 XOF de frais de service, la page affichant en outre des « frais de visa express » de 14 500 XOF. Pièces du X1 : ORIGINAL ET COPIE de l'avis d'admission et du formulaire JW201 ou JW202, plus passeport, formulaire de demande et photo. Le consulat de Chine à Saint-Denis précise : passeport valable au moins six mois avec deux pages vierges, photo couleur récente sur fond clair de 48 mm × 33 mm. La liste de pièces du centre de Dakar n'a pas pu être lue en ligne : vérifiez-la au moment du rendez-vous.",
prerequis: ["cn_admission"],
preuve: "recu",
pieces: [
{ nom: "Passeport valable au moins six mois, avec deux pages vierges, et copie des pages d'identité", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Formulaire de demande de visa, signé, avec photo couleur 48 × 33 mm", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Avis d'admission, original et copie", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Formulaire JW201 ou JW202, original et copie", format: "original papier", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.CENTRE_VISA_DKR_FRAIS,
verifieLe: VERIFIE
},

{
id: "cn_arrivee",
phaseDepart: true,
type: "confirmation",
titre: "Arriver : déclarer mon hébergement, m'inscrire, faire vérifier mon examen médical",
consigne: "Trois démarches dès l'arrivée. 1) HÉBERGEMENT : la loi sur l'entrée et la sortie (article 39) impose à l'étranger logé hors hôtel de se déclarer à la sécurité publique de son lieu de résidence DANS LES 24 HEURES ; depuis le 20 mars 2026, cette déclaration peut se faire en ligne (application et mini-programme « NIA 12367 ») dans sept régions pilotes : Hebei, Liaoning, Zhejiang, Hubei, Guangxi, Chongqing et Sichuan ; ailleurs, elle se fait auprès de la sécurité publique. Le manquement est sanctionné (avertissement, amende). 2) INSCRIPTION : présentez-vous à l'université à la date fixée, fin août ou début septembre à Tsinghua et Sun Yat-sen, avec vos diplômes ORIGINAUX et leur authentification ; un étudiant sans visa d'études ne peut pas s'inscrire. 3) EXAMEN MÉDICAL : faites vérifier votre formulaire et vos analyses originales au centre de santé des voyageurs international de la ville (à Pékin, antenne de Haidian ; à Wuhan, centre du Hubei), sinon l'examen est à refaire sur place.",
prerequis: ["cn_visa"],
preuve: "capture",
pieces: [
{ nom: "Diplômes originaux et leur authentification", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Foreigner Physical Examination Form original et analyses sanguines originales", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Passeport avec visa X1, avis d'admission et JW201 ou JW202", format: "original papier", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.NIA_HEBERGEMENT,
verifieLe: VERIFIE
},

{
id: "cn_permis_sejour",
phaseDepart: true,
type: "complement",
titre: "Demander mon permis de résidence dans les 30 jours",
consigne: "Le visa X1 porte la mention qu'un permis de résidence doit être demandé après l'entrée : la demande se dépose, EN PERSONNE, au service des entrées et sorties de la sécurité publique du lieu de résidence, DANS LES 30 JOURS suivant l'entrée en Chine (Wuhan rappelle que le X1 n'est valable que 30 jours après l'arrivée). Pièces : passeport valide, formulaire de demande avec photo conforme, lettre de l'université indiquant la durée des études et avis d'admission ; pour un permis de plus d'un an, un certificat de santé délivré par un établissement médical de niveau district ou supérieur ; originaux à présenter, copies à remettre. Wuhan ajoute le formulaire JW201 ou JW202, le formulaire d'enregistrement de résidence, le rapport médical du centre du Hubei et deux photos de 3,5 × 4,5 cm. Décision sous 15 jours ouvrables au plus. Le permis peut couvrir la durée des études. Tarifs de l'Administration nationale de l'immigration : 400 CNY jusqu'à un an, 800 CNY de un à trois ans, 1 000 CNY de trois à cinq ans.",
prerequis: ["cn_arrivee"],
preuve: "numero_dossier",
pieces: [
{ nom: "Passeport avec visa X1, original et copies", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Formulaire de demande de permis de résidence avec photo", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Lettre de l'université indiquant la durée des études, et avis d'admission", format: "original papier", tailleMax: null, traduction: false, legalisation: false },
{ nom: "Certificat de santé (permis de plus d'un an)", format: "original papier", tailleMax: null, traduction: false, legalisation: false }
],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.NIA_PERMIS,
verifieLe: VERIFIE
},

{
id: "cn_assurance",
phaseDepart: true,
type: "complement",
titre: "Payer mon assurance étudiante",
consigne: "L'assurance est OBLIGATOIRE pour les étudiants internationaux : 800 CNY par an à Sun Yat-sen (licence et master 2026) et 800 CNY par an à Tsinghua, où elle couvre les accidents et l'hospitalisation. Elle se paie à l'université, chaque année. Les boursiers du gouvernement chinois ont l'assurance maladie complète comprise dans leur bourse (800 CNY par an selon l'Institut de technologie de Harbin). Nous n'avons trouvé aucun tarif national unique : chaque université publie le sien.",
prerequis: ["cn_arrivee"],
preuve: "recu",
pieces: [],
echeance: null,
fiabilite: "verifie_source_officielle",
source: SOURCES.SYSU_LICENCE_2026,
verifieLe: VERIFIE
}

]
};
