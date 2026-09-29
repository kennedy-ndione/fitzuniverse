# Le harnais — un navigateur qui fait le parcours à votre place

`npm test` vérifie des **fonctions**. Il ne charge aucune page, ne construit
aucun DOM, n'exécute aucun module dans un navigateur.

Le 2026-09-05, deux pannes sont passées avec **377 tests au vert** :

1. `main()` appelé en tête de `results.js` — zone morte temporelle sur
   `PALIER_MS` : la page restait bloquée sur l'écran de chargement ;
2. `eligibleCountries` calculé mais absent de l'objet rendu — même symptôme,
   autre cause.

Les deux étaient invisibles pour `node --test` et évidentes pour un
navigateur. Ce harnais est ce navigateur.

## Ce qu'il fait

Pour chaque profil d'étudiant (`profils.mjs`), il :

1. ouvre `eligibility-questions.html` sur un vrai serveur local ;
2. **répond au questionnaire clic par clic**, question après question, comme
   un étudiant sur un téléphone (viewport 390 × 844) ;
3. arrive sur `results.html`, attend que l'écran de réflexion cède la place ;
4. vérifie ce qui s'affiche vraiment :
   - le profil transmis contient bien `targetLevel` et `piste` ;
   - le temps de réflexion tient l'engagement produit (6–8 s depuis le
     2026-09-23) ;
   - le score est dans ses bornes et porte un palier ;
   - le titre du verdict annonce un nombre d'opportunités **retenues** non nul ;
   - il y a exactement `min(3, retenues)` cartes, chacune avec sa raison visible ;
   - la décomposition du score n'est pas vide et chaque axe a son pourcentage ;
   - les pays, la phrase du verdict et les cinq étapes de réflexion sont là, cochées ;
   - l'analyse de Fitz, lancée sans `await` après le rendu, est attendue
     jusqu'à sa **fin** ; la lecture doublée doit s'afficher en quatre
     cartes (« En bref », « Votre atout », « Votre frein », « Par où
     commencer ») ;
   - **aucune** exception JavaScript, **aucune** erreur de console, **aucun**
     fichier `.js` / `.css` / `.json` manquant. La console n'est relevée
     qu'**après** la fin de l'analyse de Fitz.

Une fois par moteur, le premier profil est rejoué avec **Fitz refusé**
(contrôle « analyse Fitz refusée »), comme le refuse le vrai serveur au
plafond des sessions anonymes. L'échec doit s'afficher avec le message du
serveur et un bouton « Réessayer », le reste de la page doit rester entier,
et l'échec doit être signalé en console : cette ligne-là est attendue, une
fois, par son texte exact, et toute autre erreur compte.

Pourquoi attendre la fin (lot FITZ-CONSOLE, 2026-09-28) : `verifier.mjs
--moteur=webkit licence-obtenue` échouait une passe sur trois. L'ancienne
doublure faisait échouer l'analyse, et l'erreur console de cet échec
arrivait entre −19 et +187 ms autour du relevé. Elle a été comptée 6 fois
sur 32 passes chronométrées, sous les deux moteurs, alors que la page
finissait chaque fois dans le même état : le verdict dépendait du
chronométrage, pas du site.

Puis, une fois pour toutes (ces pages ne dépendent d'aucun profil), il ouvre
**la liste des bourses et deux fiches** — une à cycle clos, une à cycle ouvert,
choisies dans le catalogue réel à chaque exécution :

- il RECOMPTE en Node ce que chaque pastille devrait dire et compare au DOM.
  Une page qui cesserait d'appeler `etatCandidature()` ferait immédiatement
  diverger les deux chiffres ;
- sur la fiche close, il vérifie que la date dépassée n'est plus étiquetée
  « Date limite » et que le statut dit « Candidatures closes » ;
- sur la fiche ouverte, qu'une vraie date s'affiche avec son décompte.

Ce contrôle existe à cause d'un défaut qu'aucun test unitaire ne pouvait voir :
le calcul n'était pas faux, c'est qu'on ne l'appelait pas. La pastille du
catalogue lisait `isActive`, un drapeau éditorial — 45 cartes sur 156
annonçaient l'inverse des échéances.

Il tourne **hors ligne** : Firebase et les polices sont remplacés par des
doublures (`hors-ligne.mjs`). Le catalogue doit donc arriver par
`assets/data/catalogue.json`, l'instantané statique. Si un module se remettait
à lire Firestore, le harnais le verrait sous la forme d'un catalogue vide —
pas sous la forme d'une facture.

Lucide, lui, n'est pas doublé : c'est le vrai paquet installé, trouvé là où
Node le trouve (un worktree compris), pour que le peigne voie les icônes
rendues. S'il manque, la coquille servie à sa place est annoncée et fait
échouer le rapport (témoin lucide, plus bas).

## Deux moteurs (lot DEUX-MOTEURS, 2026-09-11)

Sur iPhone, **tous** les navigateurs sont WebKit — Chrome iOS compris, et
les navigateurs intégrés de WhatsApp, Instagram et Facebook. Deux défauts
vus sur l'iPhone de Charles (un carré noir en haut d'`offers.html`, deux
messages superposés dans la carte « Analyse en direct ») n'avaient jamais
été vus ici, parce que le harnais ne lançait que Chromium.

Il lance désormais **les deux moteurs** sur le même serveur local. Chaque
ligne du rapport est préfixée de son moteur (`[chromium]`, `[webkit]`), et
une section **« Écarts entre moteurs »** clôt le rapport : les anomalies
présentes sous un moteur et absentes de l'autre, comparées par
« page @vue + catégorie » (exception, console, fichier absent, débordement,
sans nom, rendu vide, contrôle système, chevauchement) et jamais par texte
exact — WebKit et Chromium ne formulent pas leurs exceptions pareil.

- `--moteur=chromium|webkit|tous` — défaut `tous`. `--moteur=chromium` pour
  itérer vite (une passe à deux moteurs dure environ le double).
- **Témoin d'émulation** : sous chaque moteur, à 375 px, le harnais exige
  `innerWidth === 375` et `clientWidth === 375`, sinon ÉCHEC explicite
  (« émulation mobile inopérante sous <moteur> »). Un défaut de ce type a
  existé dans WebKit sous Windows (playwright#33702).
- **Témoin lucide** (2026-09-28) : sous chaque moteur, le harnais exige que le
  vrai lucide soit servi et dessine (`login.html` : chaque `<i data-lucide>`
  devient un `<svg>`), et donne sa version ; sinon ÉCHEC explicite. Sous la
  coquille, le contrôle « contenu rendu vide » du peigne accuse chaque bouton
  à icône : sur `ai-chat.html`, la même liste de huit boutons sortait avec ou
  sans défaut réel. C'était le cas dans un worktree, où le paquet était
  cherché à un chemin fixe (`../../node_modules`), sans que rien ne le dise.
- `mesure` repose sur le protocole Chrome (CDP) : **Chromium seulement**. Sous
  WebKit, le rapport le dit en clair ; ce n'est jamais une erreur.
- `npm run verifier -- iphone` : captures ciblées 375 × 812, dpr 3, avec les
  VRAIES polices (`captures-iphone.mjs`) — la carte « Analyse en direct »
  image par image pendant deux cycles, et le coin haut-gauche d'`offers.html`
  (trois états) et de `payment.html`, dont la part de pixels noirs est
  mesurée (seuil 5 %, contrôle prouvé par mutation). Sortie dans
  `scripts/verifier/sortie/<date>/<moteur>/` (ignoré par git).

**Ce que le WebKit de Playwright sous Windows ne reproduit PAS** : le moteur
de composition de l'iPhone (la façon dont le GPU peint et empile les
calques). Les deux défauts de Charles sont des défauts de composition ; il
est possible que WebKit-Windows n'en reproduise aucun. « Non reproduit ici »
ne veut jamais dire « inexistant » : les captures de l'iPhone sont la preuve.
Le gardien contre la cause probable (les flous décoratifs sur calque négatif)
est `test/flou.test.mjs`, qui ne dépend d'aucun navigateur.

## Lancer

```
npx playwright install chromium webkit   # une seule fois, ~250 Mo — TOUJOURS avec les noms (sans argument : Firefox aussi)
npm run verifier                         # tout, sous les deux moteurs
npm run verifier -- --moteur=chromium    # un seul moteur
npm run verifier -- licence-obtenue      # un seul profil (saute les pages)
npm run verifier -- --montrer            # fenêtre visible, pour regarder
npm run verifier -- iphone               # captures ciblées iPhone, deux moteurs
```

Code de sortie 0 = tout va bien, 1 = au moins un contrôle en échec sous un
moteur.

## Les fichiers

| fichier | rôle |
|---|---|
| `verifier.mjs` | l'entrée : lance le serveur, le navigateur, les assertions |
| `questionnaire.mjs` | joue le questionnaire ; pilote par `#question[data-question]`, et attend après chaque clic *soit* la question suivante *soit* l'arrivée sur `results.html` (la dernière réponse peut finir pendant l'attente) |
| `profils.mjs` | les six étudiants joués — un par piste d'études |
| `pages.mjs` | la liste des bourses et deux fiches, recomptées contre le catalogue |
| `hors-ligne.mjs` | les doublures Firebase / polices (option `polices: true` : les polices Google passent, et elles seules) ; le vrai Lucide, résolu par Node (`LUCIDE_SERVI` dit ce qui est servi ; coquille annoncée si le paquet manque) ; pour un visiteur, une session anonyme et la lecture du diagnostic écrite comme par le vrai serveur (option `fitz: "refus"` : le refus du plafond des sessions anonymes) ; la liste du bruit de console commune à tous les modules |
| `captures-iphone.mjs` | les captures ciblées 375 × 812 sous chaque moteur (`iphone`) |
| `captures-avant-apres.mjs` | captures Chromium 375/1280 des pages touchées par un lot visuel, couleurs de la surface Fitz, comparaison pixel à pixel (`node scripts/verifier/captures-avant-apres.mjs avant\|apres`) |
| `serveur.mjs` | le site servi en local (`Cache-Control: no-store`) |

## Le garde-fou rapide

`test/verifier-profils.test.mjs` rejoue les mêmes profils **sans navigateur**,
avec la vraie classe `ParcoursEligibilite`. Ajouter une question à une piste
sans compléter `profils.mjs` casse `npm test` immédiatement, au lieu de casser
le harnais deux minutes plus tard — ou, pire, le jour où quelqu'un pense à le
lancer.

## Ajouter un profil

Une entrée dans `PROFILS` : une clé, un titre, et **une réponse par
identifiant de question**. Les identifiants sont ceux de
`js/eligibility-pistes.js`, donc aussi ceux écrits dans `sessionStorage` à la
fin du questionnaire. Pour les questions à cartes, la valeur doit être le
libellé exact de la carte — le test le vérifie.

## finitions (lot FINITIONS-VISUELLES, 2026-09-11)

`npm run verifier -- finitions` — sous les deux moteurs, ce que le peigne ne
voyait pas : l'écart logo / premier contenu (≥ 24 px) sur toute page publique
à en-tête fixe, à sept tailles (dont le zoom 125 %) ; le profil sans barre
flottante, sans icône interdite, sans rond système, sans chevauchement
icône/texte sur les cartes de niveau ; la messagerie sur téléphone (saisie et
envoi dans l'écran, clavier fermé et simulé ouvert ; message et signalement
envoyés en session doublée ; feuille « Signaler un problème ») ; le pied de
page sur l'accueil seul, sans page collée au bas ni finissant sur un vide.

`node scripts/verifier/captures-finitions.mjs avant|apres` — les captures des
écrans de Charles (accueil 1366 × 768, profil 1440, messages 390 × 844, fiche
admin liste ouverte, bas de page), dans sortie/<date>/finitions/.

## Chevauchements (2026-09-28)

Le peigne signale deux **contrôles dessinés qui se chevauchent** : liens,
boutons ou étiquettes à fond ou à bordure, en flux (ni fixes, ni collants,
ni posés en absolu), dont les boîtes se recouvrent de plus d'un pixel. La
boîte mesurée est celle qu'on VOIT, rognée par les conteneurs qui coupent
ce qui dépasse : une pastille qui déborde d'une rangée à défilement
(`.fitz-chips` de profile.html) n'est pas dessinée sur la colonne voisine.
Avant de lire une page de l'espace, il ouvre les phases scellées (« Jeter un
œil ») : leur contenu est à un clic de l'étudiant.

Le défaut qui l'a fait naître : sur téléphone, la « zone tactile » de
`css/mobile-nav.css` (rembourrage + marge négative), posée sur `.jy-tool`
qui avait déjà son rembourrage, retirait 16 px à chaque outil. Deux lignes
d'outils qui passent à la ligne se chevauchaient de 8 px (test-prep.html,
espace-bourse.html), du 2026-09-06 au 2026-09-28. Le peigne ne le voyait
pas : il ne mesurait pas les chevauchements, et les outils dormaient dans
des phases scellées. La règle CSS elle-même est gardée sans navigateur par
`test/zone-tactile.test.mjs`.
