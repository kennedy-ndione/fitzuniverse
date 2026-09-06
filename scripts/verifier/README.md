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
   - le temps de réflexion tient l'engagement produit (12–18 s) ;
   - le score est dans ses bornes et porte un palier ;
   - la légende annonce un nombre d'opportunités **retenues** non nul ;
   - il y a exactement `min(3, retenues)` cartes, chacune avec ses raisons ;
   - la décomposition du score n'est pas vide et chaque axe a son pourcentage ;
   - les pays, l'introduction et les six étapes de réflexion sont là, cochées ;
   - **aucune** exception JavaScript, **aucune** erreur de console, **aucun**
     fichier `.js` / `.css` / `.json` manquant.

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

Il tourne **hors ligne** : Firebase, Lucide et les polices sont remplacés par
des doublures (`hors-ligne.mjs`). Le catalogue doit donc arriver par
`assets/data/catalogue.json`, l'instantané statique. Si un module se remettait
à lire Firestore, le harnais le verrait sous la forme d'un catalogue vide —
pas sous la forme d'une facture.

## Lancer

```
npx playwright install chromium     # une seule fois, ~150 Mo
npm run verifier                    # les 6 profils (~2 min)
npm run verifier -- licence-obtenue # un seul profil (saute les pages)
npm run verifier -- --montrer       # fenêtre visible, pour regarder
```

Code de sortie 0 = tout va bien, 1 = au moins un profil en échec.

## Les fichiers

| fichier | rôle |
|---|---|
| `verifier.mjs` | l'entrée : lance le serveur, le navigateur, les assertions |
| `questionnaire.mjs` | joue le questionnaire ; pilote par `#question[data-question]` |
| `profils.mjs` | les six étudiants joués — un par piste d'études |
| `pages.mjs` | la liste des bourses et deux fiches, recomptées contre le catalogue |
| `hors-ligne.mjs` | les doublures Firebase / Lucide / polices |
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
