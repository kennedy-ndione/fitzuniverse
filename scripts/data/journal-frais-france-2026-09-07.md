# Journal de lecture — frais réels des 26 universités françaises (lot D2, 7 septembre 2026)

Méthode du lot 40 : on LIT et on CONSIGNE, l'écriture vient après, par
script, depuis ce journal (`node scripts/generer-lot-frais.mjs`). Chaque
entrée porte l'URL exacte de la page officielle consultée, ce qui y a été
lu par niveau, la politique d'exonération lue, la date visible, et un
verdict :

- **LU** : le montant ou la politique est écrit noir sur blanc sur la page
  officielle, pour 2026-2027 → écrit en base.
- **DÉDUIT** : la page existe mais ne dit pas ce qu'on voudrait lui faire
  dire (année absente, état d'avant le décret n° 2026-385 du 19 mai 2026,
  montant contradictoire) → PAS écrit, listé dans `a-consulter-toi-meme`.
- **ILLISIBLE** : page introuvable, site qui refuse la lecture, PDF image,
  montants « à venir » → PAS écrit, listé dans `a-consulter-toi-meme`.

Le bloc ` ```json frais ` de chaque entrée est la SEULE chose que le
générateur lit. `null` = rien à écrire pour ce champ. `verifieLe` est la
date de lecture (aujourd'hui), pas la date de la page : la fraîcheur se
compte à partir du jour où quelqu'un a regardé.

Montants nationaux 2026-2027 (décret n° 2026-385) : 2 902 € licence,
3 950 € master, 398 € doctorat (non soumis aux droits différenciés). Ils ne
dispensent d'aucune lecture : c'est la politique d'exonération de chaque
établissement qui décide de ce que paie réellement l'étudiant.

Plafond réglementaire d'exonération 2026-2027 : 30 % des inscrits soumis
(25 % en 2027-2028, 20 % ensuite). Une page qui annonce une exonération
générale sans mentionner ce plafond décrit probablement l'état d'avant →
DÉDUIT.

---

## PASSE 1 (13 universités)

### 1. Aix-Marseille Université — `aix-marseille-universite-marseille`
- Page consultée : https://www.univ-amu.fr/en/international-students/international-students-degree-programs/differential-tuition-fees-for-european-union-students
- Montants lus (hors UE, 2026-2027) : licence 2 902 € ; master 3 950 € ; doctorat non trouvé.
- Exonération lue : « First-time non-EU students must pay the full amount of the differentiated tuition fees upon enrollment » ; exonération partielle de 75 % possible ensuite, « subject to regulatory quota » ; exonération totale d'office pour boursiers du gouvernement français et accords de coopération.
- Date visible : « updated on July 8, 2026 » — postérieure au décret.
- Verdict : **LU**
```json frais
{ "id": "aix-marseille-universite-marseille",
  "fraisScolarite": { "licence": { "montant": 2902, "devise": "EUR", "periode": "an" }, "master": { "montant": 3950, "devise": "EUR", "periode": "an" },
    "note": "Droits différenciés hors UE, payés en totalité à l'inscription pour un nouvel entrant.",
    "source": "https://www.univ-amu.fr/en/international-students/international-students-degree-programs/differential-tuition-fees-for-european-union-students", "verifieLe": "2026-09-07" },
  "exoneration": { "politique": "possible_plafonnee", "detail": "Nouvel entrant : droits différenciés payés en totalité, puis exonération partielle de 75 % possible sur dossier, dans la limite du quota réglementaire.",
    "source": "https://www.univ-amu.fr/en/international-students/international-students-degree-programs/differential-tuition-fees-for-european-union-students", "verifieLe": "2026-09-07" } }
```

### 2. École normale supérieure de Lyon — `ecole-normale-superieure-de-lyon-lyon`
- Page consultée : https://www.ens-lyon.fr/formation/inscription-scolarite/inscription-et-reinscription-lens-de-lyon/droits-dinscription
- Montants lus (2026-2027) : master 255 € (UE) / 3 950 € (internationaux hors situations listées) ; diplôme ENS (normaliens) entre 800 € et 1 500 € selon le revenu fiscal — ce n'est pas une licence ; doctorat non trouvé.
- Exonération lue : boursiers CROUS exonérés ; commission d'exonération pour situations financières difficiles (première commission le 1er octobre 2026). Aucune politique propre aux extracommunautaires, aucune mention du plafond.
- Date visible : grille votée au « Conseil d'administration du 12 mars 2026 », page « 2026-2027 ».
- Verdict : **LU** (master) ; exonération hors UE **non trouvée** → « inconnue ».
```json frais
{ "id": "ecole-normale-superieure-de-lyon-lyon",
  "fraisScolarite": { "master": { "montant": 3950, "devise": "EUR", "periode": "an" },
    "note": "Master, étudiant international hors situations d'exonération. Le diplôme de l'ENS (normaliens) va de 800 à 1 500 €/an selon les revenus.",
    "source": "https://www.ens-lyon.fr/formation/inscription-scolarite/inscription-et-reinscription-lens-de-lyon/droits-dinscription", "verifieLe": "2026-09-07" },
  "exoneration": { "politique": "inconnue", "detail": "Boursiers CROUS exonérés ; commission pour situations financières difficiles. Aucune politique propre aux extracommunautaires lue sur la page.",
    "source": "https://www.ens-lyon.fr/formation/inscription-scolarite/inscription-et-reinscription-lens-de-lyon/droits-dinscription", "verifieLe": "2026-09-07" } }
```

### 3. École normale supérieure — PSL — `ecole-normale-superieure-psl-paris`
- Pages consultées : https://www.ens.psl.eu/decisions-reglementaires ; délibération n° 2026-17 du 1er juillet 2026 (PDF, lue via pdftotext) : https://www.ens.psl.eu/sites/default/files/deliberation_ndeg2026-17_portant_approbation_des_criteres_et_de_la_procedure_dexoneration_des_droits_dinscription_pour_2026-2027_2.pdf ; https://pginfo.ens.psl.eu/last/call_phd_fr.html
- Montants lus : la délibération ne porte AUCUN montant. La page d'appel doctoral dit « 397 € par an en 2026 » — contradictoire avec le montant national de 398 € : non écrit.
- Exonération lue : « le régime spécifique d'exonération applicable aux étudiantes et étudiants extracommunautaires assujettis aux droits différenciés est supprimé. Le dispositif d'exonération est unifié » ; demandes examinées par le Directeur sur avis de commission ; « le taux applicable est porté à 30 % pour les exonérations attribuées au titre de l'année universitaire 2026-2027 ».
- Date visible : « Fait à Paris, le 1er juillet 2026 ».
- Verdict : frais **ILLISIBLE** (à consulter) ; exonération **LU**.
```json frais
{ "id": "ecole-normale-superieure-psl-paris",
  "fraisScolarite": null,
  "exoneration": { "politique": "possible_plafonnee", "detail": "Régime unifié 2026-2027 : exonération sur demande, avis d'une commission, décision du directeur, plafond de 30 % des inscrits (délibération n° 2026-17 du 1er juillet 2026).",
    "source": "https://www.ens.psl.eu/sites/default/files/deliberation_ndeg2026-17_portant_approbation_des_criteres_et_de_la_procedure_dexoneration_des_droits_dinscription_pour_2026-2027_2.pdf", "verifieLe": "2026-09-07" } }
```

### 4. École polytechnique — `ecole-polytechnique-palaiseau`
- Pages consultées : https://programmes.polytechnique.edu/en/master/admissions-msct/tuition-fees ; https://programmes.polytechnique.edu/en/bachelor/costs-and-funding/tuition-fees
- Montants lus : master « for students enrolled in the 2026-2027 academic year » : « €15,400 annually » (12 350 €/an pour les diplômés IP Paris et du Bachelor ; DSAIB 28 950 €). Bachelor : « €19,600 / year » hors UE, « €15,900 / year » UE — mais AUCUNE année indiquée, « Rates are subject to change ».
- Exonération lue : « scholarships and financial aid. This aid is limited and generally does not cover the entire cost of tuition » ; pas de politique d'exonération au sens du décret (établissement à frais propres).
- Date visible : non trouvée (année 2026-2027 écrite en tête de la page master).
- Verdict : master **LU** ; bachelor **DÉDUIT** (non daté) → à consulter ; exonération → « inconnue ».
```json frais
{ "id": "ecole-polytechnique-palaiseau",
  "fraisScolarite": { "master": { "montant": 15400, "devise": "EUR", "periode": "an" },
    "note": "Master of Science and Technology, tarif plein 2026-2027 (12 350 €/an pour les diplômés IP Paris ou du Bachelor ; certains programmes plus chers). Bachelor non daté sur la page, non repris.",
    "source": "https://programmes.polytechnique.edu/en/master/admissions-msct/tuition-fees", "verifieLe": "2026-09-07" },
  "exoneration": { "politique": "inconnue", "detail": "Établissement à frais propres : bourses limitées qui « ne couvrent généralement pas l'intégralité des frais ». Aucune exonération au sens du décret lue.",
    "source": "https://programmes.polytechnique.edu/en/master/admissions-msct/tuition-fees", "verifieLe": "2026-09-07" } }
```

### 5. ESSEC Business School — `essec-business-school-cergy`
- Pages consultées : https://ernest.essec.edu/support/solutions/articles/7000012624-frais-de-scolarit%C3%A9-programme-grande-%C3%A9cole-et-global-bba-tuition-fees-grande-%C3%A9cole-global-bba ; https://www.essec.edu/fr/actualites/essec-exoneration-frais-scolarite-programme-grande-ecole-boursiers-echelons/
- Montants lus : non trouvés — « Le montant du forfait qui s'applique à vous est indiqué dans les conditions particulières du contrat d'enseignement ». Le chiffre de 19 100 € cité par le moteur de recherche n'apparaît sur aucune page lue.
- Exonération lue : exonération totale pour boursiers CROUS échelons 4 à 7 dès la rentrée 2026 (article du 10.10.2025) — concerne les boursiers français, rien sur les extracommunautaires.
- Date visible : article « Modifié le Mer, 19 Août » (année absente).
- Verdict : **ILLISIBLE** → à consulter.
```json frais
{ "id": "essec-business-school-cergy", "fraisScolarite": null, "exoneration": null }
```

### 6. HEC Paris — `hec-paris-jouy-en-josas`
- Pages consultées : https://www.hec.edu/en/master-s-programs/master-management/fees-and-financing ; https://www.hec.edu/en/bachelor-programs/fees-and-financing
- Montants lus : MiM Grande École, entrée 2026 : 58 900 € pour les deux années facturées, soit M1 29 450 € et M2 29 450 € ; « An additional € 2,000 is applicable to the tuition fees for international students » (UE et pays Erasmus+ associés exemptés) ; « Indicatives fees. May be subject to change. » Bachelor Data, Society & Organizations : année 1 à Bocconi (2026/2027) 23 000 €, années 2 et 3 (HEC) 26 500 € chacune ; pas de distinction UE / hors UE.
- Exonération lue : bourses au mérite et sur critères sociaux, « case-by-case ». Pas d'exonération au sens du décret.
- Date visible : années d'entrée 2026 / 2026-2027 sur les pages, pas de date de mise à jour.
- Verdict : **LU** (tarifs annoncés « indicatifs », dit dans la note) ; exonération → « inconnue ».
```json frais
{ "id": "hec-paris-jouy-en-josas",
  "fraisScolarite": { "licence": { "montant": 26500, "devise": "EUR", "periode": "an" }, "master": { "montant": 29450, "devise": "EUR", "periode": "an" },
    "note": "Tarifs indicatifs entrée 2026. Bachelor : 23 000 € la 1re année (à Bocconi), 26 500 € les années à HEC. Master in Management : 58 900 € sur deux ans, plus 2 000 € pour les étudiants hors UE.",
    "source": "https://www.hec.edu/en/master-s-programs/master-management/fees-and-financing", "verifieLe": "2026-09-07" },
  "exoneration": { "politique": "inconnue", "detail": "Établissement à frais propres : bourses au mérite et sur critères sociaux, au cas par cas. Aucune exonération au sens du décret lue.",
    "source": "https://www.hec.edu/en/master-s-programs/master-management/fees-and-financing", "verifieLe": "2026-09-07" } }
```

### 7. INSA Lyon — `insa-lyon-villeurbanne`
- Page consultée : https://www.insa-lyon.fr/fr/cout-etudes (lue via le navigateur intégré, le site coupe les lectures automatiques ; la notice PDF 2026 se télécharge sans s'afficher)
- Montants lus (2026-2027) : « Diplôme d'ingénieur pour les étudiants français ou de la communauté européenne : 630 € ». Hors UE : « soumis aux droits d'inscription différenciés. Pour en savoir plus : Campus France » — aucun montant sur la page.
- Exonération lue : non trouvée.
- Date visible : « Année universitaire 2026-2027 ».
- Verdict : **ILLISIBLE** pour l'étudiant hors UE → à consulter.
```json frais
{ "id": "insa-lyon-villeurbanne", "fraisScolarite": null, "exoneration": null }
```

### 8. Mines Paris – PSL — `mines-paris-psl-paris`
- Pages consultées : https://www.minesparis.psl.eu/en/education/civil-engineering-cycle/admission/ ; https://www.minesparis.psl.eu/en/education/civil-engineering-cycle/admitted-2026-applications-to-mines-paris-psl/
- Montants lus : seuls des montants 2023/2024 (« €3,850 … For all other students, tuition is €6,050 »). Rien pour 2026-2027.
- Exonération lue : « Scholarship recipients from Mines Paris–PSL, the Fondation Mines Paris, Campus France (BGF, Eiffel), a foreign government, other foundations, or those enrolled in an international dual-degree program are not required to pay tuition. »
- Date visible : non trouvée.
- Verdict : **ILLISIBLE** (montants périmés) → à consulter.
```json frais
{ "id": "mines-paris-psl-paris", "fraisScolarite": null, "exoneration": null }
```

### 9. Nantes Université — `nantes-universite-nantes`
- Page consultée : https://www.univ-nantes.fr/formation/scolarite-inscriptions/droits-universitaires-situation
- Montants lus (hors UE, 2026-2027) : « 2 902 € pour une inscription en licence, à 3 950 € pour une inscription en master, 398 € pour une inscription en doctorat et 630 € pour une inscription en formation d'un diplôme d'ingénieur ».
- Exonération lue : « Le taux maximal d'exonérations individuelles pour l'année universitaire 2026-2027 est de 30 % » ; « Après votre inscription administrative, vous pouvez déposer une demande d'exonération individuelle » ; mesures transitoires pour les inscrits 2025-2026.
- Date visible : « Mis à jour le 08 juillet 2026 ».
- Verdict : **LU**
```json frais
{ "id": "nantes-universite-nantes",
  "fraisScolarite": { "licence": { "montant": 2902, "devise": "EUR", "periode": "an" }, "master": { "montant": 3950, "devise": "EUR", "periode": "an" }, "doctorat": { "montant": 398, "devise": "EUR", "periode": "an" },
    "note": "Droits différenciés hors UE ; doctorat au tarif national (non soumis).",
    "source": "https://www.univ-nantes.fr/formation/scolarite-inscriptions/droits-universitaires-situation", "verifieLe": "2026-09-07" },
  "exoneration": { "politique": "possible_plafonnee", "detail": "Exonération individuelle sur demande après l'inscription, dans la limite de 30 % des inscrits en 2026-2027 ; mesures transitoires pour les étudiants déjà exonérés en 2025-2026.",
    "source": "https://www.univ-nantes.fr/formation/scolarite-inscriptions/droits-universitaires-situation", "verifieLe": "2026-09-07" } }
```

### 10. Sciences Po — `sciences-po-paris`
- Pages consultées : https://www.sciencespo.fr/students/fr/financer/droits-scolarite/ ; https://www.sciencespo.fr/ecole-recherche/fr/formations/doctorats/droits-scolarite-aides-financieres/
- Montants lus (2026-2027, foyer fiscal hors UE = taux maximal, pas de barème progressif) : Collège universitaire « 14 900 € par année universitaire » ; master « 20 640 € par année universitaire ». Doctorat : exonération de tous les doctorants votée le 21 mai 2025 pour 2025-2026 — page non mise à jour pour 2026-2027 → non écrit.
- Exonération lue : les masters en un an « ne sont pas éligibles au barème progressif … ni à une exonération de droits » ; les autres programmes exonèrent les boursiers CROUS / Bourse Émile Boutmy sous conditions.
- Date visible : non trouvée (titre « pour l'année universitaire 2026-2027 »).
- Verdict : licence / master **LU** ; doctorat **DÉDUIT** ; exonération → « inconnue » (bourse Boutmy, pas une exonération au sens du décret).
```json frais
{ "id": "sciences-po-paris",
  "fraisScolarite": { "licence": { "montant": 14900, "devise": "EUR", "periode": "an" }, "master": { "montant": 20640, "devise": "EUR", "periode": "an" },
    "note": "Foyer fiscal hors UE : taux maximal du barème (le barème progressif est réservé aux foyers fiscaux de l'UE). Doctorat non repris : la page ne couvre que 2025-2026.",
    "source": "https://www.sciencespo.fr/students/fr/financer/droits-scolarite/", "verifieLe": "2026-09-07" },
  "exoneration": { "politique": "inconnue", "detail": "Établissement à frais propres. Boursiers CROUS et Bourse Émile Boutmy exonérés sous conditions, sauf masters en un an. Aucune exonération au sens du décret.",
    "source": "https://www.sciencespo.fr/students/fr/financer/droits-scolarite/", "verifieLe": "2026-09-07" } }
```

### 11. Sorbonne Université — `sorbonne-universite-paris`
- Pages consultées : https://www.sorbonne-universite.fr/en/education/study-sorbonne-university/enrolment-procedures-and-tuition-fees ; https://lettres.sorbonne-universite.fr/formation/inscription/etudiants-non-europeens (mise à jour 27/02/2025, ignorée) ; https://sciences.sorbonne-universite.fr/en/apply/enrollement-fees (2024-2025, ignorée)
- Montants lus (2026/2027) : « Bachelor's degree programmes: €178 », « Master's degree programmes: €255 », « Doctoral programmes: €398 » — tarifs nationaux. La page dit que des droits différenciés existent pour les non-UE sans en donner le montant. Les doctorants sont exonérés des droits différenciés (catégorie citée) → 398 € LU pour le doctorat seulement.
- Exonération lue : « Non-EU students who are subject to differentiated tuition fees but are not automatically exempt may apply for an exemption » sur une plateforme dédiée en septembre ; exonérés d'office : boursiers d'État, accords internationaux, échanges.
- Date visible : « Published on 21/07/2026 - Updated on 22/07/2026 ».
- Verdict : doctorat **LU** ; licence / master **ILLISIBLE** (montant différencié non publié) → à consulter ; exonération **LU**.
```json frais
{ "id": "sorbonne-universite-paris",
  "fraisScolarite": { "doctorat": { "montant": 398, "devise": "EUR", "periode": "an" },
    "note": "Doctorat au tarif national (doctorants exonérés des droits différenciés). Les montants différenciés de licence et master ne sont pas publiés sur la page.",
    "source": "https://www.sorbonne-universite.fr/en/education/study-sorbonne-university/enrolment-procedures-and-tuition-fees", "verifieLe": "2026-09-07" },
  "exoneration": { "politique": "possible_plafonnee", "detail": "Exonération sur demande, dossier déposé sur une plateforme dédiée en septembre ; exonérés d'office : boursiers d'État, accords internationaux, programmes d'échange.",
    "source": "https://www.sorbonne-universite.fr/en/education/study-sorbonne-university/enrolment-procedures-and-tuition-fees", "verifieLe": "2026-09-07" } }
```

### 12. Université Claude Bernard Lyon 1 — `universite-claude-bernard-lyon-1-villeurbanne`
- Page consultée : https://www.univ-lyon1.fr/formation/inscription-et-scolarite/etudiantes-et-etudiants-internationaux-droits-dinscription-differencies-et-exonerations
- Montants lus (2026/2027) : « Inscription en licence : 2 902 € ; Inscription en master : 3 950 € » ; doctorat non trouvé.
- Exonération lue : « l'Université peut accorder des exonérations totales ou partielles des droits d'inscription différenciés dans la limite du quota de 30% fixé par la réglementation pour l'année universitaire 2026-2027 » ; « Tout étudiant extracommunautaire arrivant pour la première fois … est soumis aux droits d'inscription différenciés, sauf s'il relève de l'une des situations d'exonération ».
- Date visible : « 24/07/26 ».
- Verdict : **LU**
```json frais
{ "id": "universite-claude-bernard-lyon-1-villeurbanne",
  "fraisScolarite": { "licence": { "montant": 2902, "devise": "EUR", "periode": "an" }, "master": { "montant": 3950, "devise": "EUR", "periode": "an" },
    "note": "Droits différenciés hors UE, nouvel entrant.",
    "source": "https://www.univ-lyon1.fr/formation/inscription-et-scolarite/etudiantes-et-etudiants-internationaux-droits-dinscription-differencies-et-exonerations", "verifieLe": "2026-09-07" },
  "exoneration": { "politique": "possible_plafonnee", "detail": "Exonérations totales ou partielles sur demande, dans la limite du quota de 30 % en 2026-2027.",
    "source": "https://www.univ-lyon1.fr/formation/inscription-et-scolarite/etudiantes-et-etudiants-internationaux-droits-dinscription-differencies-et-exonerations", "verifieLe": "2026-09-07" } }
```

### 13. Université Côte d'Azur — `universite-cote-d-azur-nice`
- Page consultée : https://univ-cotedazur.fr/formation/candidater-et-s-inscrire/droits-dinscription
- Montants lus (2026-2027, extracommunautaires) : licence « 2 902€ » ; master « 3 950€ » ; doctorat / HDR « 398€ ».
- Exonération lue : néo-entrants « exonérés partiellement, au vu de leur situation personnelle étudiée en commission d'exonération » ; maintien au tarif national pour les exonérés 2025/2026 (délibération n° 2025-015).
- Date visible : non trouvée (« l'année universitaire 2026-2027 » écrite).
- Verdict : **LU**
```json frais
{ "id": "universite-cote-d-azur-nice",
  "fraisScolarite": { "licence": { "montant": 2902, "devise": "EUR", "periode": "an" }, "master": { "montant": 3950, "devise": "EUR", "periode": "an" }, "doctorat": { "montant": 398, "devise": "EUR", "periode": "an" },
    "note": "Droits différenciés hors UE ; doctorat au tarif national.",
    "source": "https://univ-cotedazur.fr/formation/candidater-et-s-inscrire/droits-dinscription", "verifieLe": "2026-09-07" },
  "exoneration": { "politique": "possible_plafonnee", "detail": "Nouvel entrant : exonération partielle possible au vu de la situation personnelle, examinée en commission d'exonération.",
    "source": "https://univ-cotedazur.fr/formation/candidater-et-s-inscrire/droits-dinscription", "verifieLe": "2026-09-07" } }
```

### Rapport intermédiaire après la passe 1

Effectif annoncé avant constat : 13 universités. Lues : 9 avec au moins un montant écrit (AMU, ENS Lyon, Polytechnique, HEC, Nantes, Sciences Po, Sorbonne — doctorat seul, Lyon 1, Côte d'Azur), 1 avec l'exonération seule (ENS PSL), 3 sans rien (ESSEC, INSA, Mines).

Ce que la passe 1 a appris, appliqué à la passe 2 :
1. Chercher DIRECTEMENT la page « droits d'inscription différenciés » de l'établissement plutôt que « frais de scolarité » : les universités publiques ont presque toutes une page dédiée, datée après le décret.
2. Les délibérations en PDF sont lisibles avec `pdftotext` (présent dans Git Bash) quand le fetch les rend en binaire — sauf les PDF image (SPN).
3. Les grandes écoles à frais propres (Polytechnique, HEC, Sciences Po) n'ont pas de « politique d'exonération » au sens du décret : « inconnue » est la valeur honnête, avec le détail des bourses en clair.
4. Deux lectures par établissement suffisent ; au-delà, c'est « à consulter ».

---

## PASSE 2 (13 universités)

### 14. Université de Bordeaux — `universite-de-bordeaux-bordeaux`
- Page consultée : https://www.u-bordeaux.fr/formation/candidatures-et-inscriptions/cout-des-etudes/etudiants-extra-communautaires
- Montants lus (2026-2027) : « Licence, licence pro, BUT, DAEU, MNESS, PASS: 2 902 €; Master: 3 950 €; Doctorat et HDR: 398 € ».
- Exonération lue : « exonération partielle » sur demande permettant de payer les droits nationaux ; procédures accélérées pour certaines situations ; commission « au mois de novembre », décision en décembre.
- Date visible : « Mise à jour le : 03/09/2026 ».
- Verdict : **LU**
```json frais
{ "id": "universite-de-bordeaux-bordeaux",
  "fraisScolarite": { "licence": { "montant": 2902, "devise": "EUR", "periode": "an" }, "master": { "montant": 3950, "devise": "EUR", "periode": "an" }, "doctorat": { "montant": 398, "devise": "EUR", "periode": "an" },
    "note": "Droits différenciés hors UE ; doctorat au tarif national.",
    "source": "https://www.u-bordeaux.fr/formation/candidatures-et-inscriptions/cout-des-etudes/etudiants-extra-communautaires", "verifieLe": "2026-09-07" },
  "exoneration": { "politique": "possible_plafonnee", "detail": "Exonération partielle sur demande (paiement au tarif national si accordée), commission en novembre, décision en décembre ; procédures accélérées pour boursiers, réfugiés, conventions, domicile fiscal en France.",
    "source": "https://www.u-bordeaux.fr/formation/candidatures-et-inscriptions/cout-des-etudes/etudiants-extra-communautaires", "verifieLe": "2026-09-07" } }
```

### 15. Université de Lille — `universite-de-lille-lille`
- Pages consultées : https://www.univ-lille.fr/formation/droits-dinscription ; https://www.univ-lille.fr/formation/exoneration ; PDF « DROITS - Etudiants internationaux extra-communautaires » (ged.univ-lille.fr) — inaccessible (réponse vide, aussi avec curl).
- Montants lus : tarifs nationaux 2026-2027 seulement (178 / 255 / 398 / 630 €) ; les droits différenciés sont dans le PDF inaccessible.
- Exonération lue : exonération partielle « d'office » pour les primo-inscrits en master, cycle ingénieur, à distance, doctorat ; sur critères sociaux pour le 1er cycle ; demandes avant le 31 octobre 2026. Aucune mention du plafond de 30 % pour une exonération annoncée d'office → suspect.
- Date visible : non trouvée.
- Verdict : frais **ILLISIBLE**, exonération **DÉDUIT** → à consulter.
```json frais
{ "id": "universite-de-lille-lille", "fraisScolarite": null, "exoneration": null }
```

### 16. Université de Lorraine — `universite-de-lorraine-nancy`
- Pages consultées : https://www.univ-lorraine.fr/welcome/en/tuition-fees/ ; https://www.univ-lorraine.fr/en/education/enrolment-at-universite-de-lorraine/
- Montants lus : 2024-2025 seulement (« €2,850 » licence, « €3,879 » master). Rien pour 2026-2027.
- Exonération lue : politique du 07/11/2023, exonération partielle sur demande pour certains M1 (pays OIF ou défavorisés) — antérieure au décret.
- Date visible : documents 2024-02.
- Verdict : **ILLISIBLE** (périmé) → à consulter.
```json frais
{ "id": "universite-de-lorraine-nancy", "fraisScolarite": null, "exoneration": null }
```

### 17. Université de Montpellier — `universite-de-montpellier-montpellier`
- Pages consultées : https://www.umontpellier.fr/international/etudier-a-letranger/etudiants-internationaux-annee-universitaire-2026-2027 (publiée le 1er juillet 2026) ; schéma PDF https://www.umontpellier.fr/wp-content/uploads/2026/07/droits-differencies.pdf (lu via pdftotext, créé le 26 août 2026)
- Montants lus (« DROITS D'INSCRIPTION DIFFÉRENCIÉS 2026-2027 ») : assujetti → « Licence : 2 902 € ; Master : 3 950 € » ; non assujetti (dont doctorat) → « Doctorat et HDR : 398 € ».
- Exonération lue : « Suite à mon inscription, en raison de ma situation personnelle, je peux demander une exonération des droits d'inscription » ; de plein droit : boursiers, pupilles, Libanais domiciliés au Liban ; l'article dit que le décret « limite fortement les possibilités d'exonération accordées ».
- Date visible : « Publié le 1 juillet 2026 » ; PDF daté 2026-08-26.
- Verdict : **LU**
```json frais
{ "id": "universite-de-montpellier-montpellier",
  "fraisScolarite": { "licence": { "montant": 2902, "devise": "EUR", "periode": "an" }, "master": { "montant": 3950, "devise": "EUR", "periode": "an" }, "doctorat": { "montant": 398, "devise": "EUR", "periode": "an" },
    "note": "Droits différenciés hors UE ; doctorat au tarif national.",
    "source": "https://www.umontpellier.fr/wp-content/uploads/2026/07/droits-differencies.pdf", "verifieLe": "2026-09-07" },
  "exoneration": { "politique": "possible_plafonnee", "detail": "Exonération sur demande après l'inscription, au vu de la situation personnelle ; de plein droit pour boursiers, pupilles et Libanais domiciliés au Liban. L'université dit que le décret limite fortement ses possibilités d'exonération.",
    "source": "https://www.umontpellier.fr/international/etudier-a-letranger/etudiants-internationaux-annee-universitaire-2026-2027", "verifieLe": "2026-09-07" } }
```

### 18. Université de Rennes — `universite-de-rennes-rennes`
- Pages consultées : https://etudiant.univ-rennes.fr/sinscrire-luniversite ; recherches sur univ-rennes.fr (deux formulations) — seules des pages d'IUT et un formulaire d'exonération 2023-2024 remontent.
- Montants lus : non trouvés (la page d'inscription ne parle que de la CVEC).
- Exonération lue : non trouvée.
- Verdict : **ILLISIBLE** → à consulter.
```json frais
{ "id": "universite-de-rennes-rennes", "fraisScolarite": null, "exoneration": null }
```

### 19. Université de Strasbourg — `universite-de-strasbourg-strasbourg`
- Pages consultées : https://en.unistra.fr/fr/droits-dinscription (2026-2027) ; https://www.unistra.fr/fr/node/8168 (17 avril 2026, décrit 2025-2026 — ignorée)
- Montants lus (2026-2027, extracommunautaires) : « 2902 € » licence ; « 3950 € » master ; doctorat non trouvé en montant (doctorants exonérés automatiquement des droits différenciés).
- Exonération lue : exonérations automatiques (doctorants, réfugiés, résidents longue durée, domicile fiscal en France, CPGE) ; « demande individuelle auprès de la Présidence » instruite par une commission ; mesures transitoires pour les inscrits 2025-2026.
- Date visible : non trouvée (année 2026-2027 écrite).
- Verdict : **LU**
```json frais
{ "id": "universite-de-strasbourg-strasbourg",
  "fraisScolarite": { "licence": { "montant": 2902, "devise": "EUR", "periode": "an" }, "master": { "montant": 3950, "devise": "EUR", "periode": "an" },
    "note": "Droits différenciés hors UE, nouvel entrant.",
    "source": "https://en.unistra.fr/fr/droits-dinscription", "verifieLe": "2026-09-07" },
  "exoneration": { "politique": "possible_plafonnee", "detail": "Demande individuelle auprès de la Présidence, instruite par une commission ; exonérations automatiques pour doctorants, réfugiés, résidents longue durée, domicile fiscal en France ; transitoires pour les inscrits 2025-2026.",
    "source": "https://en.unistra.fr/fr/droits-dinscription", "verifieLe": "2026-09-07" } }
```

### 20. Université de Toulouse — `universite-de-toulouse-toulouse`
- Page consultée : https://www.utoulouse.fr/inscriptions/montants-des-droits-d-inscription
- Montants lus : la page référence 2025-2026 et affiche « exonération partielle pour les étudiants extra-communautaires rentrée 2026 (à venir) ».
- Verdict : **ILLISIBLE** (à venir) → à consulter.
```json frais
{ "id": "universite-de-toulouse-toulouse", "fraisScolarite": null, "exoneration": null }
```

### 21. Université Grenoble Alpes — `universite-grenoble-alpes-grenoble`
- Pages consultées : https://www.univ-grenoble-alpes.fr/actualites/a-la-une/actualites-universite/etudiants-internationaux-ce-que-change-le-nouveau-decret-sur-les-droits-d-inscription-a-l-uga-1775870.kjsp (publié le 29 mai 2026) ; page internationale d'exonération (mise à jour 8 décembre 2023, ignorée)
- Montants lus : seuls les tarifs nationaux « en cas d'exonération » (178 € licence, 254 € master). Les montants différenciés pleins ne sont pas écrits.
- Exonération lue : 2026-2027 « année de transition » ; exonération sur demande avec déclaration de ressources, « que l'UGA entend appliquer largement, dans le respect des plafonds réglementaires ».
- Date visible : « Publié le 29 mai 2026 ».
- Verdict : frais **ILLISIBLE** → à consulter ; exonération **LU**.
```json frais
{ "id": "universite-grenoble-alpes-grenoble",
  "fraisScolarite": null,
  "exoneration": { "politique": "possible_plafonnee", "detail": "2026-2027 = année de transition : exonération sur demande avec déclaration de ressources, que l'UGA entend appliquer largement dans le respect des plafonds réglementaires ; en cas d'exonération, seuls les droits nationaux sont dus.",
    "source": "https://www.univ-grenoble-alpes.fr/actualites/a-la-une/actualites-universite/etudiants-internationaux-ce-que-change-le-nouveau-decret-sur-les-droits-d-inscription-a-l-uga-1775870.kjsp", "verifieLe": "2026-09-07" } }
```

### 22. Université Paris 1 Panthéon-Sorbonne — `universite-paris-1-pantheon-sorbonne-paris`
- Pages consultées : https://www.pantheonsorbonne.fr/inscription/frais-dinscription (« Mis à jour le 23 juin 2026 ») ; https://international.pantheonsorbonne.fr/en/differentiated-tuition-fees (« Last update: June 2026 ») ; schéma PDF https://international.pantheonsorbonne.fr/sites/default/files/2026-03/Schema_DIF_26-27_03-26_FR_0.pdf (lu via pdftotext, « Mise à jour : mars 2026 »)
- Montants lus (« Montants des droits universitaires 2026-2027 ») : nationaux 178 / 255 / 398 € ; différenciés « 2902 € » licence, « 3950 € » master ; doctorat non soumis (398 €).
- Exonération lue : « appliquera partiellement » les droits différenciés ; paient les droits nationaux (exonération partielle) : ressortissants des 44 pays les moins avancés (ONU), inscrits 2025-2026 se réinscrivant dans le même cycle, doubles diplômes, réfugiés, demandeurs d'asile, BGF, échanges, domicile fiscal en France… ; les autres extracommunautaires paient les droits différenciés.
- Verdict : **LU**
```json frais
{ "id": "universite-paris-1-pantheon-sorbonne-paris",
  "fraisScolarite": { "licence": { "montant": 2902, "devise": "EUR", "periode": "an" }, "master": { "montant": 3950, "devise": "EUR", "periode": "an" }, "doctorat": { "montant": 398, "devise": "EUR", "periode": "an" },
    "note": "Droits différenciés hors UE ; doctorat au tarif national. Les ressortissants des 44 pays les moins avancés (liste ONU) paient les droits nationaux.",
    "source": "https://www.pantheonsorbonne.fr/inscription/frais-dinscription", "verifieLe": "2026-09-07" },
  "exoneration": { "politique": "possible_plafonnee", "detail": "Application partielle : paient les droits nationaux les ressortissants des 44 pays les moins avancés (ONU), les réinscrits 2025-2026 dans le même cycle, les doubles diplômes, réfugiés, demandeurs d'asile, boursiers BGF ; les autres extracommunautaires paient les droits différenciés (schéma de mars 2026).",
    "source": "https://international.pantheonsorbonne.fr/sites/default/files/2026-03/Schema_DIF_26-27_03-26_FR_0.pdf", "verifieLe": "2026-09-07" } }
```

### 23. Université Paris Cité — `universite-paris-cite-paris`
- Page consultée : https://u-paris.fr/droits-dinscription-tarifs-exonerations/
- Montants lus : « Les étudiantes et étudiants extra-communautaires s'inscrivant en Licence sont redevables des droits d'inscription de licence applicables aux étudiants européens » (178 €), idem master (255 €) ; doctorat « montant unique pour tous les doctorants UPCité 2026/27 : 398,00 € ».
- Exonération lue : « reconduit le moratoire sur les droits d'inscriptions différenciés pour l'année universitaire 2026-2027 » — délibération du CA du **17 octobre 2025**, ANTÉRIEURE au décret du 19 mai 2026, sans mention du plafond de 30 %. Une exonération générale pré-décret décrit probablement l'état d'avant.
- Verdict : licence / master **DÉDUIT** → à consulter ; doctorat **LU** (non soumis) ; exonération → « inconnue », le détail dit pourquoi.
```json frais
{ "id": "universite-paris-cite-paris",
  "fraisScolarite": { "doctorat": { "montant": 398, "devise": "EUR", "periode": "an" },
    "note": "Doctorat au tarif national. Licence et master non repris : la page annonce un moratoire voté le 17 octobre 2025, avant le décret du 19 mai 2026, sans mention du plafond de 30 %.",
    "source": "https://u-paris.fr/droits-dinscription-tarifs-exonerations/", "verifieLe": "2026-09-07" },
  "exoneration": { "politique": "inconnue", "detail": "La page annonce un moratoire (droits nationaux pour tous) reconduit pour 2026-2027 par le CA du 17 octobre 2025 — antérieur au décret du 19 mai 2026 qui plafonne les exonérations à 30 %. À recouper auprès de l'université.",
    "source": "https://u-paris.fr/droits-dinscription-tarifs-exonerations/", "verifieLe": "2026-09-07" } }
```

### 24. Université Paris Dauphine-PSL — `universite-paris-dauphine-psl-paris`
- Page consultée : https://dauphine.psl.eu/formations/scolarite/droits-et-tarifs (« Droits de scolarité 2026-2027 »)
- Montants lus (résidence fiscale hors UE) : Licence Sciences des Organisations « 2 349 € » (Licence Mathématiques Informatique : 582 €) ; Masters DGE « 6 831 € » ; masters diplômes nationaux : 3 950 € sans demande d'exonération, « exonération partielle équivalent droits nationaux de master soit 255 € » sur demande motivée ; doctorat « 398 € pour l'année universitaire 2026-2027 ».
- Exonération lue : boursiers CROUS / gouvernement français, réfugiés, handicap, pupilles exonérés ; extracommunautaires en master diplôme national : exonération partielle sur demande.
- Date visible : non trouvée (« 2026-2027 » dans le titre ; note « certains tarifs … susceptibles d'évoluer pour 2027-2028 »).
- Verdict : **LU**
```json frais
{ "id": "universite-paris-dauphine-psl-paris",
  "fraisScolarite": { "licence": { "montant": 2349, "devise": "EUR", "periode": "an" }, "master": { "montant": 6831, "devise": "EUR", "periode": "an" }, "doctorat": { "montant": 398, "devise": "EUR", "periode": "an" },
    "note": "Droits modulés, résidence fiscale hors UE : Licence Sciences des Organisations 2 349 € (Licence Mathématiques-Informatique : 582 €) ; masters de grand établissement 6 831 €. Masters diplômes nationaux : 3 950 €, ramenés à 255 € sur exonération partielle.",
    "source": "https://dauphine.psl.eu/formations/scolarite/droits-et-tarifs", "verifieLe": "2026-09-07" },
  "exoneration": { "politique": "possible_plafonnee", "detail": "Boursiers CROUS ou du gouvernement français, réfugiés, handicap, pupilles : exonérés. Extracommunautaires en master diplôme national : exonération partielle (255 €) sur demande motivée.",
    "source": "https://dauphine.psl.eu/formations/scolarite/droits-et-tarifs", "verifieLe": "2026-09-07" } }
```

### 25. Université Paris-Saclay — `universite-paris-saclay-orsay`
- Page consultée : https://www.universite-paris-saclay.fr/en/admission/tuition-fees
- Montants lus : « 2025-2026 fees » ; « Information regarding the 2026–2027 procedure will be published shortly ». Délibération CA-2026-013 du 3 février 2026 citée sans montants.
- Verdict : **ILLISIBLE** (à venir) → à consulter.
```json frais
{ "id": "universite-paris-saclay-orsay", "fraisScolarite": null, "exoneration": null }
```

### 26. Université Sorbonne Paris Nord — `universite-sorbonne-paris-nord-villetaneuse`
- Pages consultées : https://inscriptions.univ-spn.fr/exoneration/ ; https://inscriptions.univ-spn.fr/tarifs/ ; PDF http://inscriptions.univ-spn.fr/wp-content/uploads/Tarifs-droits-dinscriptions-2026-2027.pdf (PDF image, aucun texte extractible)
- Montants lus : page d'exonération : droits nationaux « Licence 178 € ; Master 255 € » si exonéré ; les droits différenciés pleins sont dans le PDF image.
- Exonération lue : « Plafond global d'exonérations individuelles : 20 %, porté transitoirement à 30 % en 2026-2027 et 25 % en 2027-2028 » ; exonération partielle sur demande, critères d'éligibilité (demandeurs d'asile, accords internationaux, ressortissants des 44 pays les moins avancés, situations sociales).
- Date visible : non trouvée (« 2026-2027 » écrit).
- Verdict : frais **ILLISIBLE** → à consulter ; exonération **LU**.
```json frais
{ "id": "universite-sorbonne-paris-nord-villetaneuse",
  "fraisScolarite": null,
  "exoneration": { "politique": "possible_plafonnee", "detail": "Exonération partielle sur demande, plafond de 30 % des inscrits en 2026-2027 (25 % en 2027-2028, 20 % ensuite) ; critères : demandeurs d'asile, accords internationaux, ressortissants des 44 pays les moins avancés, situations sociales.",
    "source": "https://inscriptions.univ-spn.fr/exoneration/", "verifieLe": "2026-09-07" } }
```

---

## Bilan des deux passes

Effectif annoncé : 26 universités françaises. Résultat :

| | Effectif |
|---|---|
| Au moins un montant écrit | 15 |
| — dont licence ET master vérifiés | 11 (AMU, HEC, Nantes, Sciences Po, Lyon 1, Côte d'Azur, Bordeaux, Montpellier, Strasbourg, Paris 1, Dauphine) |
| — master seul | 2 (ENS Lyon, Polytechnique) |
| — doctorat seul | 2 (Sorbonne Université, Paris Cité) |
| Exonération seule, sans montant | 3 (ENS PSL, UGA, Sorbonne Paris Nord) |
| Rien d'écrit → à consulter | 8 (ESSEC, INSA, Mines, Lille, Lorraine, Rennes, Toulouse, Paris-Saclay) |

Restent « Frais non vérifiés » à l'écran : 11 universités (les 8 + les 3 à exonération seule). C'est correct.
