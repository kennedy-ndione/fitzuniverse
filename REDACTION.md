# Rédaction FitzUniverse — relecture et réécriture

Relecture complète de la copie visible du site, faite le 2026-08-31 sur le dépôt réel :
accueil, bourses, universités, fiche de bourse, offres, connexion, questionnaire,
diagnostic. Zéro lecture Firestore.

**Le constat d'ensemble, d'abord, parce qu'il change ce qu'il faut faire :
ce site est déjà bien écrit.** Le ton est juste, les phrases sont courtes, les sections
disent ce qu'elles font. « Ce que nous garantissons : un accompagnement sérieux à chaque
étape… La décision d'admission relève, elle, des établissements » est de la très bonne
copie commerciale : elle vend sans promettre l'impossible.

Le problème n'est donc **pas le style**. Il est ailleurs, en trois endroits :

1. **une affirmation fausse**, répétée quinze fois, dans le titre de page et la navigation ;
2. **une offre en vente qui ne peut pas être achetée** ;
3. **un vocabulaire qui dérive** — le même objet porte trois noms selon la page ;
4. **un titre que les données contredisent** — « entièrement financées », alors qu'un
   programme sur trois ne dit pas ce qu'il couvre.

Les quatre se corrigent. Aucun ne demande de réécrire le site.

---

## 1. « Universités partenaires » — à supprimer partout

### Le fait

Aucune des universités du catalogue n'a de relation avec FitzUniverse. Ce n'est pas une
supposition : c'est écrit dans le dépôt, dans le commentaire d'`index.html` qui a fait
retirer l'ancien libellé « Ils nous font confiance » :

> « Le bandeau est rempli avec les universités du CATALOGUE : aucune d'elles n'a de
> relation avec FitzUniverse, et aucune ne nous a accordé sa confiance. La phrase
> affirmait donc à des étudiants qui vont payer une chose qui n'est pas vraie. »

Le raisonnement était juste. Mais la correction s'est arrêtée au bandeau. **Le mot
« partenaire » est resté à quinze endroits**, dont les plus visibles de tout le site :

| Où | Ce qui s'affiche aujourd'hui |
|---|---|
| `universities.html` — `<title>` | Universités partenaires \| FitzUniverse |
| `universities.html` — `<meta description>` | « Découvrez les universités **partenaires** de FitzUniverse » |
| `og:title`, `og:description`, `twitter:*` | idem — c'est ce qui s'affiche quand on partage le lien sur WhatsApp |
| `universities.html:148` — le H1 | Universités partenaires |
| `universities.html:219` — la pastille | Catalogue **partenaire** Fitz |
| `universities.html:231` — le sous-titre | « …le catalogue complet des universités **partenaires** » |
| `index.html:257`, `scholarships.html:258` | Universités **partenaires** (le chiffre du bandeau de statistiques) |
| `index.html:740` | « Universités **partenaires**, bourses actives… » |
| `scholarships.js:494` | « 3 universités **partenaires** » sur chaque carte de bourse |
| `scholarships.js:547` | « Voir les universités **partenaires** » |
| `js/homepage-teaser.js:153`, `js/recommend-programs.js:324` | « Université **partenaire** » (texte de repli) |

### Pourquoi c'est grave, et pas seulement inexact

Un étudiant à Dakar qui lit « universités partenaires de FitzUniverse » avant de payer
75 000 F comprend qu'il existe un accord, donc un avantage à passer par vous. C'est faux,
et c'est exactement la croyance qui fait payer. Le jour où il découvre qu'il aurait pu
candidater directement, ce n'est plus une maladresse de rédaction, c'est un litige.

Le mot n'apporte d'ailleurs rien : ce que vous avez à vendre est plus difficile et plus
crédible qu'un partenariat. **Vous avez vérifié 111 établissements à la main.** Aucun
concurrent ne peut le dire.

### La correction

| Avant | Après |
|---|---|
| `<title>` Universités partenaires | **Universités et programmes financés** |
| meta / og / twitter description | « Le catalogue FitzUniverse : des établissements vérifiés un par un, leurs programmes financés et leurs critères d'admission. » |
| H1 « Universités partenaires » | **Les universités du catalogue** |
| Pastille « Catalogue partenaire Fitz » | **Catalogue Fitz** |
| Sous-titre « …des universités partenaires » | « …le catalogue complet, en accès libre. » |
| Statistique « Universités partenaires » | **Établissements vérifiés** |
| Carte de bourse « 3 universités partenaires » | **3 universités concernées** |
| « Voir les universités partenaires » | **Voir les universités concernées** |
| Repli « Université partenaire » | **Établissement** |

Le mot « partenaire » ne doit plus apparaître nulle part dans la copie visible. Une garde
de test le vérifie (voir §8).

---

## 2. Une offre en vente qui refuse d'être achetée

`offers.html` affiche le **Forfait Premier Dossier — 15 000 FCFA**, avec un bouton actif
« Choisir Premier Dossier » (`offers.html:198`), et le nomme dans sa meta description —
c'est donc ce que Google affichera.

Mais `pricing-plans.js:137` porte `deprecated: true`, et `payment.js:59` refuse toute
offre dépréciée :

```js
return !!plan && plan.deprecated !== true;
```

**Un étudiant qui clique sur « Choisir Premier Dossier » est envoyé vers un mur.**

Les deux commentaires du fichier se contredisent, à un jour d'intervalle :

- au-dessus du bloc : « **RESSUSCITÉE le 2026-08-29** (décision utilisateur) […] Prix relevé
  de 12 000 à 15 000 F » ;
- à l'intérieur : « **Retirée de la vente** — le drapeau avait été perdu lors d'une refonte ».

La deuxième passe a probablement re-tué une offre que tu avais volontairement rétablie la
veille, en se fiant à un commentaire périmé.

**Ce n'est pas à moi de trancher : c'est une décision commerciale.** Mais l'état actuel est
le pire des deux — l'offre est visible, désirable, et inachetable.

- Si Premier Dossier doit être vendue : retirer `deprecated: true` et corriger le
  commentaire intérieur.
- Si elle ne doit pas l'être : retirer la carte d'`offers.html` **et** son nom des
  meta descriptions.

À vérifier en même temps : `premium` porte aussi `deprecated: true` et n'est plus affichée —
celle-là est cohérente.

---

## 3. Le paiement : trois versions de la même phrase

Sur la seule page des offres, les moyens de paiement changent d'un paragraphe à l'autre :

| Où | Ce qui est écrit |
|---|---|
| Bas de la grille | « Wave, Orange Money et **MTN MoMo** » |
| FAQ « Que se passe-t-il après mon choix ? » | « PayDunya (Wave, Orange Money ou **carte bancaire**) » |
| `payment.js:480` (page de paiement) | « le paiement sécurisé PayDunya **sera activé très prochainement** » |

Trois messages différents, dont un qui dit que rien ne fonctionne encore.

**À faire maintenant :** aligner les deux listes sur ce que PayDunya traitera réellement.
Une seule formulation, réutilisée aux deux endroits.

**À faire avant la mise en ligne :** la phrase « vous réglez via PayDunya » décrit un
parcours qui n'existe pas encore. Tant que la caisse n'est pas branchée, elle est
inoffensive — le site n'est pas public. Le jour de l'ouverture, elle devient un mensonge.
**C'est la phrase à vérifier en dernier avant de publier.**

---

## 4. « Entièrement financées » — le titre que le catalogue contredit

`scholarships.html` titre **« Bourses d'études entièrement financées »**, et
`universities.html` annonce **« Programmes entièrement financés »**. Compté sur
`scripts/export-catalog.json`, l'export réel du catalogue :

| | |
|---|---|
| Programmes au catalogue | **335** |
| Programmes dont le champ `coverage` est **vide** | **124 — soit 37 %** |
| Bourses touchées par au moins un programme sans couverture | **36** |
| Programmes dont la couverture est explicitement **partielle** | **au moins 42** |

Quelques-uns, tels qu'ils sont écrits en base :

- `bilkent-international-scholarships` — « Exonération de **20 à 100 %** des frais »
- `bocconi-merit-award` — « Exonération **totale ou partielle** des frais de scolarité »
- `corvinus-scholarship` — « Exonération totale des frais **de scolarité** » (ni logement, ni allocation)

**Un étudiant sur trois qui ouvre une fiche ne trouvera pas ce que la bourse couvre**,
après avoir lu en gros titre qu'elles sont entièrement financées. C'est le pire endroit
pour une promesse trop large : c'est l'information qui décide si le projet est finançable.

### La correction, en deux temps

**Le titre, tout de suite :**

| Avant | Après |
|---|---|
| Bourses d'études **entièrement financées** | Bourses d'études **vérifiées une par une** |
| Programmes **entièrement financés**, campus prestigieux… | Programmes financés, admissions ouvertes aux étudiants internationaux… |

**La donnée, ensuite** — c'est un lot de catalogue, pas de la rédaction : renseigner les
124 couvertures manquantes, ou afficher explicitement « Couverture non communiquée » sur
la fiche plutôt que de laisser un blanc. Un blanc laisse l'étudiant supposer que tout est
payé ; « non communiquée » lui dit d'aller vérifier à la source. Le second est vrai, le
premier ne l'est pas.

---

## 5. La charte — le vocabulaire arrêté

Le même objet porte aujourd'hui plusieurs noms. Ci-dessous, un seul mot par chose. Toute
page future s'écrit avec ce tableau.

### Les noms propres

| Terme | Ce qu'il désigne | Ne jamais écrire |
|---|---|---|
| **FitzUniverse** | la plateforme, le site, l'entreprise | « Fitz » pour parler du site |
| **Fitz** | l'assistant, et lui seul | « FitzUniverse analyse votre profil » |

Règle simple : si la phrase pourrait être suivie de « …vous répond », c'est **Fitz**. Si
elle pourrait être suivie de « …a été fondée », c'est **FitzUniverse**.

### Les objets du catalogue

| Terme | Définition | À la place de |
|---|---|---|
| **une bourse** | le programme de financement (Eiffel, MEXT, Türkiye Bursları) | « opportunité », quand on parle du financement |
| **une université** / **un établissement** | l'école d'accueil | « partenaire », « université partenaire » |
| **un programme** | une bourse × une université × un niveau — ce que l'étudiant vise vraiment | « offre », « cursus » |
| **une opportunité** | réservé au croisement *profil × programme* affiché dans le diagnostic | usage générique |
| **une candidature** | un dossier que l'étudiant dépose | « dossier » seul, ambigu |
| **le bailleur** | qui finance : gouvernement, université, région, organisation, entreprise | « organisme », « sponsor » |

### Ce qui est gratuit, ce qui est payant — une seule phrase

C'est la distinction la plus importante du site, et elle est déjà bien dite sur la fiche :

> « Lien officiel, en accès libre : les informations de cette fiche restent gratuites.
> Seul l'accompagnement de Fitz est payant. »

**Cette phrase est la référence. Partout ailleurs, la même idée s'écrit :**

> **Chercher est gratuit. Candidater reste gratuit. Ce qui est payant, c'est l'aide de Fitz
> pour bâtir un dossier qui tienne.**

Ne jamais laisser entendre que l'accès aux bourses, aux critères ou aux portails officiels
s'achète. Il ne s'achète pas, et le dire abîmerait la seule chose qui vous distingue.

### Le ton

- **Vouvoiement**, toujours. Déjà respecté partout.
- **Phrases courtes.** La copie actuelle en fait de longues à deux ou trois endroits
  (le paragraphe de trois lignes sous le titre de l'accueil) : à couper.
- **Aucun superlatif invérifiable.** « Le meilleur », « des milliers d'étudiants nous font
  confiance », « leader » : interdits tant que ce n'est pas mesuré. Le site s'en passe déjà,
  et c'est sa force.
- **Un chiffre s'affiche, il ne se raconte pas.** Les compteurs de l'accueil sont remplis
  depuis la base : ne jamais écrire un nombre en dur dans une phrase.
- **Nommer le doute.** « Ce score est un point de départ pour comprendre votre profil — pas
  un verdict » : c'est ce genre de phrase qui fait qu'on vous croit sur le reste.

### Les titres et les boutons

- **Un titre dit ce que la page contient**, pas ce qu'elle veut vous faire ressentir.
- **Un bouton commence par un verbe et dit ce qui va se passer.** « Choisir ma formule »
  est bon. « Découvrir » (bouton du hero) ne dit rien : à remplacer.
- **Un seul bouton principal par écran.** L'accueil en a actuellement trois avec le même
  sens (« Découvrir mes opportunités », « Commencer mon diagnostic gratuit », « Commencer
  gratuitement ») : garder une seule formulation, répétée à l'identique.

---

## 6. Page par page

### Accueil — le hero

**Aujourd'hui**

> Trouvez les **bourses d'études** qui correspondent à votre profil.
> Conçu d'abord pour les étudiants africains — grand ouvert à tout étudiant, où qu'il soit.
> Répondez à quelques questions, Fitz analyse votre parcours, sélectionne les bourses et
> universités adaptées à votre profil et vous accompagne jusqu'au dépôt de votre candidature.

Le titre est clair. Le reste dit trois fois la même chose, et la troisième phrase raconte
déjà les trois étapes que la section « Comment ça fonctionne » développe plus bas.

**Proposition**

> # Les bourses pour lesquelles vous êtes **réellement** éligible.
>
> Conçu d'abord pour les étudiants africains — ouvert à tout étudiant, où qu'il soit.
>
> Fitz écarte les bourses fermées à votre nationalité ou à votre âge, et vous montre
> celles qui restent. Gratuitement.

**Pourquoi.** « Réellement éligible » est la seule promesse que vos concurrents ne peuvent
pas faire, et elle est vraie : le site connaît le Commonwealth, la BID, les 54 pays
d'Afrique, les limites d'âge par niveau. C'est aussi ce que vit un étudiant sénégalais —
découvrir après trois heures qu'une bourse britannique lui était fermée depuis le début.
La troisième phrase remplace un résumé du site par la chose que le site fait de mieux.

### Accueil — le bouton du hero

« Découvrir » ne dit pas ce qui se passe ensuite. → **« Voir mes bourses compatibles »**,
ou reprendre à l'identique « Commencer mon diagnostic gratuit », qui a l'avantage de dire
à la fois l'action et le prix.

### Accueil — le bandeau de chiffres

« Bourses référencées · Pays de destination · **Universités partenaires** »
→ « Bourses vérifiées · Pays de destination · **Établissements vérifiés** »

« Référencées » est tiède : n'importe quel agrégateur référence. « Vérifiées » dit le
travail réel, et c'est exact — chaque fiche a été confirmée à la source.

### Accueil — « Pourquoi tant d'étudiants abandonnent ? »

**Rien à changer.** C'est la meilleure section du site : elle nomme le problème avant de
vendre la solution, en trois temps courts, sans exagérer. Les titres « Vous cherchez
partout / Vous perdez un temps précieux / Vous passez à côté d'opportunités » sont justes.

### Accueil — « Un aperçu, pas le catalogue entier »

**Aujourd'hui** : « Universités partenaires, bourses actives, programmes compatibles —
voici ce que Fitz pourra analyser pour votre profil. »

**Proposition** : « Établissements vérifiés, bourses ouvertes, programmes compatibles —
voilà ce que Fitz croisera avec votre parcours. »

« Pourra analyser » est au conditionnel : il fait douter. « Croisera » dit l'opération
réelle, celle que fait `recommend-programs.js`.

### Accueil — la vision

**Rien à changer.** « Nous voulons que le lieu de naissance d'un étudiant ne détermine
plus la qualité de son avenir » est la phrase la plus forte du site. Ne pas y toucher.

### Bourses (`scholarships.html`)

Deux corrections, toutes deux traitées plus haut : le titre « entièrement financées »
(§4) et « Universités partenaires » dans le bandeau de statistiques (§1).

Le sous-titre — « Programmes officiels, critères vérifiés, portail de candidature inclus —
parcourez le catalogue complet, en accès libre » — est bon : il énumère du vérifiable et
finit sur la gratuité. À garder.

### Universités (`universities.html`)

Toutes les corrections du §1 s'appliquent ici : c'est la page la plus touchée.

Le titre « Un catalogue vérifié **établissement par établissement** » est excellent et se
suffit — c'est le H1 « Universités partenaires » au-dessus qui doit changer.

Le sous-titre annonce « campus prestigieux » : invérifiable, et inutile à côté de
« vérifié établissement par établissement ». À supprimer. « Programmes entièrement
financés » dans la même phrase relève du §4.

### Fiche de bourse (`scholarship-details.html`)

**La meilleure page du site du point de vue de la rédaction.** « Lien officiel, en accès
libre : les informations de cette fiche restent gratuites. Seul l'accompagnement de Fitz
est payant » fait exactement ce qu'il faut : elle lève le soupçon au moment où il naît.

Une seule chose à revoir : **« Chances de compléter votre dossier »** est ambigu. On ne
sait pas s'il s'agit des chances d'obtenir la bourse ou de la capacité à réunir les pièces.
→ **« Ce qu'il vous manque pour ce dossier »**, qui dit l'utile et ne promet rien.

Et « Vous voulez avancer par vous-même ? » au-dessus du lien université est bien tourné :
il ne culpabilise pas, il n'insinue pas que c'est un mauvais choix.

### Offres (`offers.html`)

Page solide. Trois corrections :

1. **Les moyens de paiement** (§3) — une seule liste, aux deux endroits.
2. **« Toutes les formules donnent accès à 100 % des outils Fitz »** est faux pour le Pass
   Découverte, qui donne des réponses à des questions et pas les outils. Le code le sait
   (« `fitzExpress` n'est PAS une formule d'accompagnement ») mais le lecteur ne voit pas la
   différence entre « formule » et « pass ».
   → **« Tous les forfaits d'accompagnement donnent accès à 100 % des outils Fitz. Le Pass
   Découverte, lui, donne accès à Fitz pour vos questions — pas aux outils de dossier. »**
3. **Premier Dossier** (§2) — décision à prendre.

Le paragraphe « Ce que nous garantissons » : à ne surtout pas toucher.

### Connexion (`login.html`)

Courte et juste. Une remarque : « Vous n'avez pas encore de compte ? » est suivi de
**« Choisir ma formule »** — on demande de payer pour créer un compte. Si un compte gratuit
existe, le bouton doit dire « Créer mon compte ». S'il n'existe pas, la phrase doit le dire :
**« Votre compte se crée avec votre première formule. »** À trancher selon ce que fait
réellement l'inscription.

### Diagnostic (`results.html`)

Bien écrit. « Ce score est un point de départ — pas un verdict » est à garder mot pour mot.

Un point : **« Indicateur Fitz »** ne veut rien dire pour un étudiant. Le bloc affiche un
score sur 100 de compatibilité.
→ **« Votre compatibilité »**, avec le sous-titre existant qui l'explique déjà.

---

## 7. Ce que je n'ai pas encore relu

Pour être exact sur ce qui est couvert : cette passe porte sur l'accueil, les deux
catalogues, la fiche, les offres, la connexion, le questionnaire et le diagnostic.

Restent à relire, dans une seconde passe :

- **l'espace étudiant** (`dashboard.html`, `applications.html`, `profile.html`, les pages
  outils) — c'est ce que voit l'étudiant qui a payé, donc ce qui décide s'il recommande ;
- **les micro-textes** : états vides, messages d'erreur, textes de chargement, libellés de
  formulaire. Ce sont les moins relus de tout site et ceux qu'on lit dans les pires moments ;
- **les e-mails** envoyés par `functions/`, s'il y en a.

---

## 8. Garde-fou

Un test qui échoue si le mot revient, dans l'esprit de `test/logo-lockup.test.mjs` :

- aucun fichier `.html` ni `.js` du site (hors `admin/`) ne contient « partenaire » dans du
  texte visible — ni dans un `<title>`, un `<meta>`, un `og:`, ou une chaîne de repli ;
- `offers.html` n'affiche de bouton `data-plan` que pour des offres dont
  `pricing-plans.js` ne porte pas `deprecated: true`. **Cette garde-là aurait attrapé
  Premier Dossier.**

La seconde vaut d'être écrite indépendamment de la décision commerciale : elle empêche
qu'une offre redevienne invendable sans que la page s'en aperçoive.

À ajouter aussi à l'export, dans `totaux`, sur le modèle de `boursesSansProgramme` :
**`programmesSansCoverage`**, avec la liste des identifiants. Ce qui n'est pas compté
n'est pas corrigé — c'est la leçon qui a déjà servi deux fois sur ce projet.
