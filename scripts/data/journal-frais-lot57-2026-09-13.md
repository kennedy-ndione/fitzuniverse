# Journal des frais — lot 57 : les 84 dernieres universites (13 septembre 2026)

Le chantier des frais se termine. **74 universites renseignees, 10 documentees
comme non publiees** plutot que devinees.

## Methode

Huit lecteurs en parallele, un par bloc de pays, chacun dans son propre onglet,
avec la meme consigne : sources officielles uniquement (domaine de l'etablissement
ou domaine gouvernemental), agregateurs interdits nommement (collegedunia, unipage,
studypath, mastersportal, cucas, edarabia et les autres), et « NON_TROUVE » plutot
qu'une estimation. Dix fiches sont revenues sans prix : c'est ce qui garantit que
les 74 autres ne sont pas inventees.

Tous les montants sont ramenes a l'ANNEE : les tarifs par semestre (Suisse,
Hongrie, Coree, USIU, JNU, UKM) sont doubles, ceux au programme (Universiti Malaya,
KTH, Goteborg) divises par la duree officielle. Chaque note le precise.

## Ce que ce lot change dans le conseil

**La question ARES est tranchee.** La circulaire n° 2026-001 du 12 fevrier 2026 a
ete lue : le Senegal figure a l'**annexe 1**, position 33. Un etudiant senegalais
paie 1 194 EUR a l'ULB, a l'ULiege et a Namur, pas 5 369 EUR. Question ouverte
depuis le lot 54, elle valait un facteur 4,5.

**La France n'a pas un prix, elle en a cinq.** Le meme arrete national donne, selon
la politique de chaque etablissement : 178/255 EUR a Toulouse, Paris-Saclay et
Grenoble ; 650/950 EUR a Rennes ; le plein tarif (2 902/3 950 EUR) a Lille, en
Lorraine et a Sorbonne Paris Nord. Le doctorat n'est jamais assujetti : 398 EUR
partout. Nouveau plafond : le decret n° 2026-385 du 19 mai 2026 limite les
exonerations a 30 % des inscrits hors UE en 2026-2027, 25 % en 2027-2028, 20 % ensuite.

**Naples exonere totalement les hors UE** par la seule nationalite : 184 EUR/an de
taxe regionale et de timbre. Sixieme dispositif italien rencontre, et le plus
genereux. Mais Genes, juste a cote, n'a rien de tel : 3 025 EUR sans ISEE parificato.

**Trois etablissements d'elite sont gratuits pour qui est admis** : la Scuola Normale
Superiore (scolarite, pension complete, logement et bourse), POSTECH (bourse complete
automatique en licence, revenu mensuel en master et doctorat), et les masters
recherche et doctorats de Koc et Sabanci.

**L'Arabie Saoudite prend tout en charge** : les 27 universites publiques accueillent
les internationaux admis sans frais, avec logement, allocation et billet d'avion — le
visa d'etudes n'est delivre qu'a un candidat deja boursier.

**JNU Delhi est la moins chere du catalogue** : 800 USD/an, avec un bareme officiel
dont la colonne « Afrique et Amerique latine » est explicitement moins chere que
celle des autres pays.

**Trois etablissements majorent les Africains** : Wits double le tarif local hors
Afrique australe, l'USIU du Kenya ajoute 30 %, Zurich et Fribourg appliquent un
supplement etranger. Ce sont des informations, pas des oublis.

**CMU-Africa a deux tarifs** : 16 000 USD/an pour un Africain, 60 300 pour un
non-Africain.

## Devises

Quatre seuils de plus dans `js/frais.js` : SEK, MYR, INR et SAR, convertis aux cours
de reference de la BCE du 11 septembre 2026 (1 EUR = 11,2373 SEK ; 4,7185 MYR ;
110,7675 INR), le riyal saoudien au cours de la Banque centrale de Russie du 12
septembre (4,3559 SAR) faute de cotation BCE.

**KES et RWF restent sans seuil, volontairement** : aucun cours officiel lisible ce
jour-la — la table de la Banque centrale du Kenya ne sert qu'un historique de 2024,
celle du Rwanda renvoie une erreur. Les montants s'affichent, la bande reste
« inconnu ». Deux tests verrouillent ce choix pour qu'un ajout futur soit conscient.

## Les dix sans prix

| etablissement | pourquoi |
|---|---|
| **ESSEC Business School** | Aucun montant chiffre n'est publie sur essec.edu. L'article officiel du Registrar confirme la structure (forfait pluriannuel = droits d'inscription + cotisations + frais de scolarite propres au programme, CVEC en plus, montant individuel indique dans le contrat d'enseignement signe a l'admission) ma |
| **Università di Firenze** | unifi.it sert une verification de securite Cloudflare qui ne se resout jamais dans le navigateur, meme apres plusieurs attentes et rechargements. Aucune page officielle n'a pu etre lue, a deux reprises et par deux lecteurs differents. |
| **Università di Trento** | www.unitn.it est bloque par une verification Cloudflare qui ne se resout pas, et corsi.unitn.it affiche une page de verification humaine de type CAPTCHA, qui n'est jamais contournee. Aucune page officielle n'a pu etre lue. |
| **Université Cadi Ayyad** | Aucun montant de droits d'inscription n'est publie sur uca.ma. La page officielle AMCI de l'universite et la liste des pieces a fournir decrivent la procedure et les documents exiges, dont l'autorisation d'inscription pour etudiants etrangers delivree par le ministere de tutelle, mais n'affichent au |
| **Université Hassan II de Casablanca** | La page officielle « Etudiant international » de l'universite, lue integralement, decrit la procedure AMCI et le Bureau de l'etudiant international mais n'affiche aucun montant de droits d'inscription ni de frais de scolarite, a aucun niveau. |
| **Université Mohammed V de Rabat** | La page officielle dediee a l'inscription des etudiants internationaux detaille toute la chaine AMCI mais ne publie aucun montant ; les seuls documents joints sont un guide de procedures en arabe et une video. Un montant de 300 dirhams de frais d'inscription apparait sur le site d'une ecole d'ingeni |
| **AIMS Rwanda** | AIMS Rwanda ne publie aucune grille tarifaire, et pour cause : le master structure est integralement finance. Le texte officiel dit « All selected candidates benefit from full scholarships ». Il n'y a donc pas de montant a payer par un etudiant autofinance et aucun chiffre a retenir. AIMS Rwanda ne  |
| **AIMS Ghana** | AIMS Ghana ne publie aucune grille tarifaire et n'en a pas besoin : le texte officiel du master indique que la scolarite, les supports de cours et le logement sont finances par des bourses totales ou partielles attribuees a tous les etudiants admis. La nuance « totales ou partielles » signifie qu'un |
| **Jomo Kenyatta University of Agriculture and Technology** | Aucune grille tarifaire internationale chiffree n'est publiee sur jkuat.ac.ke, et la page du bureau des etudiants internationaux ne donne aucun montant. La seule information officielle chiffrable se trouve sur la page d'admission de l'ecole de commerce : « en moyenne un etudiant de licence autofinan |
| **icipe — International Centre of Insect Physiology and Ecology** | icipe n'est pas une universite et ne publie aucune grille de frais : c'est un centre de recherche qui ne recrute ses doctorants et ses masterants QUE sur bourse, via le programme regional africain de troisieme cycle en sciences de l'insecte et les bourses ARPPIS-DAAD. Les annonces officielles precis |

Huit d'entre elles portent quand meme une **exoneration renseignee** : pour les
trois marocaines, la voie AMCI par ambassade ; pour AIMS Rwanda, AIMS Ghana et
icipe, la bourse integrale qui EST leur modele de recrutement.

## Les 74 fiches ecrites

| universite | licence | master | doctorat | exoneration |
|---|---|---|---|---|
| African Leadership University (ALU) | 3 000 USD | — | — | `possible_plafonnee` |
| Budapest University of Technology and Economics | 6 400 EUR | 7 000 EUR | 9 000 EUR | `possible_plafonnee` |
| Carnegie Mellon University Africa (CMU-Africa) | — | 16 000 USD | — | `possible_plafonnee` |
| Corvinus University of Budapest | 6 600 EUR | 10 800 EUR | 8 000 EUR | `possible_plafonnee` |
| Eötvös Loránd University | 6 400 EUR | 8 400 EUR | 6 000 EUR | `inconnue` |
| Ghent University | 7 079 EUR | 7 079 EUR | 1 182 EUR | `systematique` |
| Harbin Institute of Technology | 26 000 CNY | 34 000 CNY | 42 000 CNY | `possible_plafonnee` |
| Hungarian University of Agriculture and Life Sciences | 4 400 EUR | 6 000 EUR | — | `possible_plafonnee` |
| INSA Lyon | 2 902 EUR | 3 950 EUR | 398 EUR | `inconnue` |
| Istanbul University | 3 000 USD | 2 000 USD | 2 000 USD | `inconnue` |
| Jagiellonian University | 4 400 EUR | 4 500 EUR | — | `aucune` |
| Jawaharlal Nehru University (JNU) | 800 USD | 800 USD | 800 USD | `inconnue` |
| KTH Royal Institute of Technology | — | 192 500 SEK | — | `possible_plafonnee` |
| KU Leuven | 9 494 EUR | 9 494 EUR | 591 EUR | `possible_plafonnee` |
| King Abdulaziz University | Gratuit | Gratuit | Gratuit | `systematique` |
| King Saud University | Gratuit | Gratuit | Gratuit | `systematique` |
| Korea National University of Arts (K-Arts) | 4 800 000 KRW | — | — | `possible_plafonnee` |
| Koç University | 38 000 USD | 30 800 USD | 30 800 USD | `systematique` |
| Kwame Nkrumah University of Science and Technology (KNUST) | 5 043 USD | 6 221 USD | 6 221 USD | `possible_plafonnee` |
| Mines Paris – PSL | — | 6 440 EUR | — | `possible_plafonnee` |
| POSTECH (Pohang University of Science and Technology) | Gratuit | Gratuit | Gratuit | `systematique` |
| Princess Nourah bint Abdulrahman University | Gratuit | — | — | `systematique` |
| RUDN University | 5 100 USD | 5 550 USD | 6 450 USD | `inconnue` |
| Sabancı University | 36 500 USD | Gratuit | Gratuit | `systematique` |
| Scuola Normale Superiore | Gratuit | Gratuit | Gratuit | `systematique` |
| Shanghai Jiao Tong University | 24 800 CNY | 28 900 CNY | 45 500 CNY | `inconnue` |
| Shanghai Maritime University | 20 000 CNY | 23 000 CNY | 29 000 CNY | `possible_plafonnee` |
| Sichuan University | 22 000 CNY | 25 000 CNY | 37 000 CNY | `inconnue` |
| Sun Yat-sen University | 33 800 CNY | 39 000 CNY | 44 200 CNY | `possible_plafonnee` |
| Széchenyi István University | — | — | 2 400 EUR | `possible_plafonnee` |
| The American University in Cairo (AUC) | 17 640 USD | 13 230 USD | — | `possible_plafonnee` |
| Tongji University | 24 600 CNY | 28 700 CNY | 41 000 CNY | `inconnue` |
| Tsinghua University | 30 000 CNY | 33 000 CNY | 40 000 CNY | `possible_plafonnee` |
| United States International University-Africa | 343 200 KES | 374 400 KES | 468 000 KES | `aucune` |
| Universitatea Națională de Știință și Tehnologie Politehnica București | 2 600 EUR | 2 700 EUR | 3 800 EUR | `aucune` |
| Universiti Kebangsaan Malaysia | 17 600 MYR | 15 200 MYR | 20 700 MYR | `inconnue` |
| Universiti Malaya | 33 025 MYR | 21 600 MYR | 28 867 MYR | `inconnue` |
| University of Amsterdam | 17 500 EUR | 25 900 EUR | — | `aucune` |
| University of Delhi | 234 740 INR | 129 000 INR | — | `possible_plafonnee` |
| University of Gothenburg | — | 145 000 SEK | — | `possible_plafonnee` |
| University of Lisbon | 3 500 EUR | 3 500 EUR | — | `inconnue` |
| University of Miskolc | 6 000 EUR | 7 000 EUR | 7 000 EUR | `possible_plafonnee` |
| University of Porto | 3 500 EUR | 4 000 EUR | 6 000 EUR | `possible_plafonnee` |
| University of Pécs | 5 500 EUR | 6 300 EUR | 7 000 EUR | `possible_plafonnee` |
| University of Rwanda | 1 600 000 RWF | 4 800 USD | 13 500 USD | `inconnue` |
| University of Science and Technology of China | 26 000 CNY | 30 000 CNY | 35 000 CNY | `possible_plafonnee` |
| University of Szeged | 5 400 EUR | 6 000 EUR | 10 000 EUR | `possible_plafonnee` |
| University of Warsaw | 4 300 EUR | 4 300 EUR | — | `inconnue` |
| University of Zurich | 2 440 CHF | 1 640 CHF | 500 CHF | `possible_plafonnee` |
| University of the Witwatersrand | 125 660 ZAR | 89 720 ZAR | — | `aucune` |
| Università degli Studi di Napoli Federico II | 184 EUR | 184 EUR | — | `systematique` |
| Università di Genova | 3 025 EUR | 3 025 EUR | — | `possible_plafonnee` |
| Université Grenoble Alpes | 178 EUR | 254 EUR | 398 EUR | `possible_plafonnee` |
| Université Libre de Bruxelles | 1 194 EUR | 1 194 EUR | 1 194 EUR | `systematique` |
| Université Mohammed VI Polytechnique (UM6P) | 65 000 MAD | 72 500 MAD | Gratuit | `possible_plafonnee` |
| Université Paris-Saclay | 178 EUR | 255 EUR | 398 EUR | `systematique` |
| Université Senghor d'Alexandrie | — | 3 700 EUR | — | `possible_plafonnee` |
| Université Sorbonne Paris Nord | 2 902 EUR | 3 950 EUR | 398 EUR | `inconnue` |
| Université d'État de Saint-Pétersbourg (SPbU) | 383 800 RUB | 407 400 RUB | 407 100 RUB | `possible_plafonnee` |
| Université de Bucarest | 1 980 EUR | 1 980 EUR | 3 900 EUR | `aucune` |
| Université de Fribourg | 1 970 CHF | 1 970 CHF | 590 CHF | `aucune` |
| Université de Genève | 1 000 CHF | 1 000 CHF | 1 000 CHF | `possible_plafonnee` |
| Université de Lausanne | 1 160 CHF | 1 160 CHF | 160 CHF | `possible_plafonnee` |
| Université de Lille | 2 902 EUR | 3 950 EUR | 398 EUR | `possible_plafonnee` |
| Université de Liège | 1 194 EUR | 1 194 EUR | 1 194 EUR | `systematique` |
| Université de Lorraine | 2 902 EUR | 3 950 EUR | 398 EUR | `possible_plafonnee` |
| Université de Rennes | 650 EUR | 950 EUR | 398 EUR | `systematique` |
| Université de Toulouse | 178 EUR | 255 EUR | 398 EUR | `systematique` |
| Waseda University | 1 490 000 JPY | — | — | `possible_plafonnee` |
| Wuhan University | 28 000 CNY | 38 000 CNY | 46 000 CNY | `inconnue` |
| Xiamen University | 26 000 CNY | 45 000 CNY | 55 000 CNY | `possible_plafonnee` |
| Yonsei University | 9 112 000 KRW | 10 958 000 KRW | 10 958 000 KRW | `inconnue` |
| École normale supérieure — PSL | — | 255 EUR | 398 EUR | `systematique` |
| Óbuda University | 5 800 EUR | 6 400 EUR | — | `inconnue` |
