# Journée du 2026-09-01 — travail complet

Trois blocs, dans cet ordre. Le bloc A d'abord parce qu'il attend depuis deux jours ;
les blocs B et C ne lisent rien et peuvent suivre sans contrainte.

## Budget de lectures Firestore

Le quota vient de se réinitialiser : 50 000 lectures pour la journée. Coûts mesurés :

| | |
|---|---|
| Bloc A — lot 32 (`analyser` + `verifier` + `export`) | **~1 240** |
| Bloc B — construction | **0** |
| Bloc C — construction | **0** |
| Vérifications à l'écran | ~591 par chargement de catalogue, ~591 par chargement d'accueil |

**Un seul `export`, à la toute fin du bloc A.** Si tu as besoin de l'état de la base
ailleurs, réutilise `scripts/export-catalog.json` déjà sur le disque.

**Ferme les onglets du site pendant que tu écris des fichiers.** Live Server les recharge
à chaque enregistrement : c'est ce qui a vidé le quota deux jours de suite, à zéro
visiteur. Rouvre-les seulement pour les vérifications.

---

# BLOC A — Lot 32 (à faire en premier)

```
node scripts/lot.mjs analyser 32
node scripts/lot.mjs ecrire 32
node scripts/lot.mjs verifier 32
```

Attendu : **11 universités, 0 bourse, 11 liens → 19 programmes**, soit 30 documents.
Garde-fou pays annoncé dans l'en-tête du fichier de données : Italie 6, Suisse 4, Russie 1.

Deux blancs sont **volontaires** et ne doivent pas être « corrigés » :

- `iheid-geneve` : `applicationPortalUrl` vide — il n'existe pas de portail à URL stable ;
  le champ vide est la bonne valeur, comme pour les trois universités marocaines du lot 33.
- `scuola-normale-superiore-phd` : `language` vide — langue non vérifiée à la source.

Si `analyser` signale un écart inattendu, **arrête-toi avant `ecrire`** et décris-le.
Ne modifie pas `scripts/data/lot32.mjs` pour faire passer l'analyse.

---

# BLOC B — Les deux pages de catalogue

Pas de refonte : la structure est saine et les deux bannières partagent déjà une seule
règle (`css/catalog.css:52` — `.catalog-hero, .bourses-hero, .uni-hero`). Cinq
corrections ciblées.

## B1. La photo de la page Bourses

`scholarships.html:214-224` sert `assets/images/cities/riyadh.jpg`. Trois problèmes qui
se cumulent, tous vérifiables :

1. **Elle choisit un pays sur 28.** Le catalogue est mondial, sa bannière montre l'Arabie
   saoudite. Choix par défaut de l'audit du 2026-08-14 devenu permanent.
2. **C'est le même fichier que des cartes de la grille en dessous.**
   `js/scholarship-image.js:33` en fait le repli pays de l'Arabie saoudite, et
   `CREDITS.md:95` confirme qu'il sert aussi à King Saud University.
3. **Une skyline ne dit pas « bourse ».** Elle dit voyage.

Le commentaire de `scholarships.html:196` justifie de ne pas mettre un **bâtiment** — « une
bourse est rattachée à un pays, pas à un établissement précis ». Ce raisonnement reste
valable, conserve-le. Il n'a simplement jamais justifié de choisir *un* pays.

**Sujet à trouver : une grande salle de lecture ou une bibliothèque, en intérieur.**
C'est la seule image universelle de l'étude qui ne soit ni une remise de diplôme
(l'accueil possède déjà cette image) ni une ville (les cartes les possèdent toutes). Elle
porte aussi le positionnement « vérifié à la main » : une salle de lecture dit institution
sérieuse.

Critères impératifs — ce sont eux qui font échouer les lots photo :

- **ratio ≥ 2:1.** La bannière est une bande large (`min-height:300px`, pleine largeur) :
  tout portrait y perd son sujet.
- aucun monument, drapeau, blason, enseigne ou skyline identifiable ;
- lisible sous le voile sombre **et** l'éclat ambré de `.bourses-hero::after`
  (`css/catalog.css:116`) — vérifie-le sur le rendu réel, pas sur la photo nue ;
- ne duplique **aucun** fichier de `assets/images/cities/` ni `assets/images/scholarships/` ;
- **tu regardes l'image** avant de la retenir, et encore après génération. C'est exactement
  ce contrôle qui a manqué à `milan.jpg`, qui montrait Vernazza.

Jeu complet 400/800/1200/1600w en JPEG q92 + WebP + AVIF, crédit dans `CREDITS.md`.

**Ne touche pas à `riyadh.jpg`** : elle reste le repli pays de l'Arabie saoudite et la
photo de King Saud University. Tu **ajoutes** un fichier, tu n'en remplaces aucun.

## B2. La photo de la page Universités — à vérifier, pas forcément à changer

`universities.html:206-216` sert `assets/images/university-hall.jpg`. La **logique** est
bonne — un bâtiment pour un catalogue d'établissements — et elle se garde.

Deux réserves à lever :

1. Le bâtiment est-il une université **identifiable** ? Si oui, la bannière laisse entendre
   que cet établissement cautionne FitzUniverse — même famille de problème que
   « universités partenaires » (B5).
2. Je n'ai trouvé aucune entrée à son nom dans `CREDITS.md`. Vérifie et complète.

Si elle est identifiable : remplace-la par une architecture **anonyme** — cloître,
colonnade, cour intérieure — sans blason ni enseigne lisible, mêmes critères qu'en B1.
Sinon, garde-la et ajoute son crédit.

**Dans les deux cas** : les deux bannières côte à côte doivent se distinguer d'un coup
d'œil — intérieur pour Bourses, extérieur pour Universités. Compare-les réellement, l'une
à côté de l'autre, comme pour les villes doublées du lot 32.

## B3. Raccourcir la bannière — sortir les chiffres

Aujourd'hui : `padding:124px 48px 44px` + `min-height:300px` (`css/catalog.css:52-80`),
plus la pastille, le titre, le sous-titre **et** trois chiffres. Résultat mesuré à
l'écran : les filtres arrivent au bas du cadre et **la première bourse est sous la ligne
de flottaison**. Sur une page de catalogue, le contenu c'est le catalogue.

Déplace le bloc `.uni-hero-stats` **hors** de la bannière, dans `.catalog-body`, sous les
filtres et au-dessus de la grille :

- `scholarships.html:244-261` — 3 chiffres (`statScholarships`, `statCountries`, `statPartners`)
- `universities.html:233-245` — 2 chiffres (`statTotal`, `statCountries`)

Les identifiants ne changent pas : `scholarships.js` et `universities-page.js` continuent
de les remplir sans modification. Adapte seulement l'habillage — hors de la bannière, ils
ne sont plus sur fond sombre.

Bénéfice attendu : bannière raccourcie d'environ 90 px, et les chiffres retrouvent leur
sens — « 145 bourses » lu juste au-dessus de la grille se comprend comme un décompte de
résultats, plus comme un argument marketing.

Garde le tiret cadratin « — » comme état d'attente : le commentaire de
`scholarships.html:242` explique pourquoi, et il a raison — jamais de zéro trompeur.

## B4. Les deux pages se contredisent : 110 contre 111

L'accueil affiche **111** universités, le catalogue des bourses **110**. Ce n'est pas un
bug : `scholarships.js:366` fait `elPartenaires.textContent = universitesLiees.size` — les
universités **rattachées** à au moins une bourse — alors que l'accueil et
`universities.html` (`statTotal`) les comptent **toutes**.

Le calcul est juste ; c'est le libellé qui ment par omission. Les deux se lisent pareil
pour un visiteur, et un chiffre qui bouge d'une page à l'autre abîme exactement ce que ce
site vend : la rigueur.

- `scholarships.html` (110) → **« Universités concernées »**
- `universities.html` (111) et l'accueil → **« Établissements vérifiés »**

**Ne change aucun calcul.** Seuls les libellés bougent.

## B5. La copie de ces deux pages

### « Universités partenaires » est faux

Aucune université du catalogue n'a de relation avec FitzUniverse. Le dépôt le dit lui-même,
dans le commentaire d'`index.html` qui avait fait retirer « Ils nous font confiance » :

> « aucune d'elles n'a de relation avec FitzUniverse […] La phrase affirmait donc à des
> étudiants qui vont payer une chose qui n'est pas vraie. »

La correction s'était arrêtée au bandeau. Le mot est resté ici :

| Fichier | |
|---|---|
| `universities.html:9` | `<title>` → **Universités et programmes financés \| FitzUniverse** |
| `universities.html:11,23,24,29,30` | meta description, og:title, og:description, twitter:* → « Le catalogue FitzUniverse : des établissements vérifiés un par un, leurs programmes financés et leurs critères d'admission. » |
| `universities.html:148` | H1 → **Les universités du catalogue** |
| `universities.html:219` | pastille « Catalogue partenaire Fitz » → **Catalogue Fitz** |
| `universities.html:231` | sous-titre → retirer « partenaires » **et** « campus prestigieux » (invérifiable, et inutile à côté de « vérifié établissement par établissement ») |
| `scholarships.js:494` | « 3 universités partenaires » → **« 3 universités concernées »** |
| `scholarships.js:547` | « Voir les universités partenaires » → **« Voir les universités concernées »** |
| `universities-page.js:384` | → **« Les universités du catalogue »** |
| `js/homepage-teaser.js:153`, `js/recommend-programs.js:324` | repli « Université partenaire » → **« Établissement »** |

### « Entièrement financées » est contredit par les données

Compté sur `scripts/export-catalog.json`, **sans lire Firestore** :

- **124 programmes sur 335 (37 %)** ont un `coverage` **vide**, touchant 36 bourses ;
- au moins **42** des 211 renseignés sont explicitement partiels — `bilkent` « exonération
  de 20 à 100 % », `bocconi-merit-award` « totale ou partielle », `corvinus` « exonération
  totale des frais **de scolarité** » seulement.

- H1 de `scholarships.html` → **« Bourses d'études vérifiées une par une »**
- `universities.html:231` : « Programmes entièrement financés » → **« Programmes financés »**

Le sous-titre de `scholarships.html` — « Programmes officiels, critères vérifiés, portail
de candidature inclus — parcourez le catalogue complet, en accès libre » — est bon.
**Ne pas y toucher.**

### Ajouter au compteur d'export

Dans `totaux`, sur le modèle de `boursesSansProgramme` : **`programmesSansCoverage`** avec
la liste des identifiants. Ce qui n'est pas compté n'est pas corrigé.

---

# BLOC C — Le reste de la copie (0 lecture)

## C1. Premier Dossier — décision prise : **on le remet en vente**

`offers.html:198` affiche un bouton actif `data-plan="premier-dossier"` (15 000 F) et le
nomme dans sa meta description, mais `pricing-plans.js:137` porte `deprecated: true` et
`payment.js:59` refuse toute offre dépréciée : **un étudiant qui clique est envoyé vers un
mur.**

Les deux commentaires du fichier se contredisent à un jour d'écart — « RESSUSCITÉE le
2026-08-29 (décision utilisateur) » puis « Retirée de la vente ». Une passe de nettoyage a
re-tué une offre rétablie la veille en se fiant à un commentaire périmé.

**Charles a tranché : l'offre est vendue.**

- retirer `deprecated: true` de `premier-dossier` dans `pricing-plans.js` ;
- **réécrire le commentaire intérieur** qui affirme le contraire — c'est lui qui a induit
  l'erreur, le laisser la reproduirait ;
- ne pas toucher à `premium`, qui porte `deprecated: true` **et** n'est plus affichée :
  celle-là est cohérente.

## C2. Les moyens de paiement — trois versions de la même phrase

| Où | Ce qui est écrit |
|---|---|
| `offers.html`, bas de grille | « Wave, Orange Money et **MTN MoMo** » |
| `offers.html`, FAQ | « PayDunya (Wave, Orange Money ou **carte bancaire**) » |
| `payment.js:429-431` — le sélecteur réel | `wave` · `orange-money` · `card` |

**Le code tranche : Wave, Orange Money, carte bancaire.** MTN MoMo n'est proposé nulle
part dans le produit. Aligne la phrase du bas de grille sur cette liste.

`payment.js:105-106` mentionne MTN MoMo dans un commentaire sur les rails en FCFA :
laisse-le, mais ajoute une ligne précisant qu'il n'est pas dans les moyens proposés.

**À ne pas corriger aujourd'hui, mais à retenir** : `payment.js:480` annonce que le
paiement « sera activé très prochainement », alors que la FAQ décrit un parcours qui
fonctionne. Tant que le site n'est pas public, c'est inoffensif. **C'est la phrase à
vérifier en dernier avant la mise en ligne.**

## C3. « 100 % des outils Fitz » est faux pour le Pass Découverte

`offers.html` annonce « Toutes les formules donnent accès à 100 % des outils Fitz », et le
Pass Découverte est listé juste en dessous. Or `pricing-plans.js:86` dit lui-même :
« `fitzExpress` n'est **PAS** une formule d'accompagnement — c'est un pass d'assistance
ponctuelle », et ses `highlights` ne parlent que de questions, jamais d'outils.

Le code distingue « formule » et « pass ». **Le lecteur ne voit pas cette différence.**

→ « **Tous les forfaits d'accompagnement** donnent accès à 100 % des outils Fitz. Le Pass
Découverte, lui, donne accès à Fitz pour vos questions — pas aux outils de dossier. »

## C4. La page de connexion

`login.html` affiche « Vous n'avez pas encore de compte ? » suivi de **« Choisir ma
formule »** : on demande de payer pour créer un compte.

Vérifié : `createUserWithEmailAndPassword` n'apparaît que dans `payment.js:358`. **Il
n'existe aucune voie d'inscription gratuite** — la phrase est donc exacte, seulement
brutale.

→ « **Votre compte se crée avec votre première formule.** » Le bouton reste.

## C5. Un seul libellé pour le même geste

L'accueil propose aujourd'hui deux formulations pour la même destination
(`eligibility-test.html`) : « Découvrir mes opportunités » dans le hero, « Commencer mon
diagnostic gratuit » dans la section « Comment ça fonctionne » (`index.html:702-704`).

Aligne la seconde sur **« Découvrir mes opportunités »**. La gratuité est déjà portée par
la ligne « Commencez gratuitement • Sans carte bancaire » du hero et par
« 5 minutes • 14 questions • 100 % gratuit » de la page de diagnostic — elle n'a pas
besoin de vivre dans le libellé du bouton.

---

# GARDES (tests)

Dans l'esprit de `test/logo-lockup.test.mjs`, avec un garde-fou anti-régression du
balayage lui-même (le test qui ne matche plus rien et passe au vert) :

1. Aucun `.html` ni `.js` du site (hors `admin/`) ne contient « partenaire » dans du texte
   visible — `<title>`, `<meta>`, `og:`, `twitter:` et chaînes JS de repli incluses.
2. `offers.html` n'affiche de bouton `data-plan` que pour des offres **sans**
   `deprecated: true` dans `pricing-plans.js`. **Cette garde aurait attrapé Premier
   Dossier**, et elle vaut indépendamment de la décision commerciale : elle empêche qu'une
   offre redevienne invendable sans que la page s'en aperçoive.
3. La liste des moyens de paiement affichée dans `offers.html` correspond aux clés du
   sélecteur de `payment.js`.

---

# VÉRIFICATION FINALE

## Bloc A

```
node scripts/lot.mjs export      ← LE SEUL de la journée
```

Rapporter, chiffres à l'appui :

1. totaux : bourses / universités / programmes / pays ;
2. `boursesSansProgramme` + la liste. **Attendu : 2**, exactement `vanier` et `al-azhar`.
   Tout autre id est un défaut du lot 32 ;
3. `boursesSansFunder` (0), `boursesSansEntryPoint` (2 : `knight-hennessy-scholars`,
   `fao-hungarian-government-scholarship`), `programmesAvecPortailPropre` (0),
   `programmesSansCoverage` (nouveau) ;
4. la suite de tests complète, verte.

**Contrôles à l'œil du lot 32** — non automatisables, c'est ce qui a manqué au lot 31 :

- **les quatre villes doublées, côte à côte sur la grille** : Milan, Pise, Lausanne,
  Genève. Deux cartes de la même ville ne doivent pas se lire comme un doublon. **C'est le
  point le plus important.**
- les 11 nouvelles universités sur leur fiche : photo bien cadrée, sujet non coupé ;
- une fiche du lot 32 **en non connecté** : un seul bouton, « Accéder au site de
  l'université ». Ni cadenas, ni mention qu'une information est bloquée, ni trace des
  autres portails ;
- la fiche **IHEID** : `applicationPortalUrl` est vide — vérifier qu'il n'y a ni bouton
  mort ni message d'attente.

## Blocs B et C

- les **deux bannières ouvertes côte à côte** : sujets nettement différents, aucune ne
  duplique une image de la grille en dessous ;
- le titre reste lisible sur chaque photo, sous le voile et l'ambre ;
- **la première carte du catalogue est visible sans défiler** sur un écran 1366×768 —
  c'est le point de B3. Donne la mesure avant/après ;
- sur mobile (375 px) : bannière, filtres et chiffres tiennent sans débordement horizontal ;
- `grep -rn partenaire` sur le dépôt hors `admin/` et hors commentaires : plus rien ;
- `offers.html` : le bouton « Choisir Premier Dossier » mène désormais à la page de
  paiement **sans être refusé** ;
- `login.html` : la nouvelle phrase s'affiche et le bouton fonctionne toujours.
