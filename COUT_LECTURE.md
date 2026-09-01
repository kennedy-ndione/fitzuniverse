# Coût de lecture Firestore

Le catalogue public vit dans trois collections Firestore : `programs`,
`universities`, `scholarships`. **Chaque document lu est facturé une
lecture.** Le forfait Spark en offre 50 000 par jour ; au 2026-08-31 le
catalogue en compte 591 (335 + 111 + 145), et il grossit à chaque lot.

## Ce qui s'est passé (2026-08-31)

Le quota a été épuisé plusieurs jours de suite, sans qu'aucune commande
d'administration ne soit en cause. La mesure a montré deux défauts, tous
deux invisibles depuis l'interface :

- **`index.html` lisait le catalogue DEUX FOIS.** `js/homepage-teaser.js`
  et `js/opportunites-bandeau.js` faisaient chacun leur propre
  `Promise.all` sur les trois collections entières : **~1 182 lectures
  par affichage de l'accueil**, soit environ 42 chargements avant
  épuisement du quota.
- **`applications.js` faisait de même**, deux fois dans sa propre page.

L'amplificateur : en développement, **Live Server recharge tous les
onglets ouverts à chaque fichier enregistré**. Un lot de 132 photos, avec
un onglet d'accueil ouvert, épuise la journée à lui seul.

## La règle

**Aucun module du site ne lit `programs`, `universities` ou
`scholarships` en direct.** Tout passe par `js/catalog-data.js`, qui
mémoïse **par collection** pour la durée du chargement de page :

| Fonction | Lit | Pour |
|---|---|---|
| `chargerCatalogue()` | les 3 collections | accueil, catalogues, résultats, tableau de bord, candidatures |
| `chargerProgrammesEtUniversites()` | 2 collections | `test-prep.js` |
| `chargerUniversites()` | 1 collection | `profile.js`, `eligibility-questions.js` |

La mémoïsation est **par collection et non « tout ou rien »** : deux
pages n'ont besoin que des universités, et un chargeur monolithique les
aurait fait passer de ~111 à ~591 lectures — on aurait corrigé l'accueil
en dégradant deux autres pages.

Une garde automatique le vérifie : `test/catalog-cache.test.mjs` échoue
si un fichier hors `js/catalog-data.js` (et hors `admin/`, `scripts/`)
contient un `getDocs(collection(db, "…"))` sur ces trois collections.

`admin/` en est exempt à dessein : ce sont des outils ponctuels, lancés à
la main, jamais chargés par une page publique.

## Coût par page, après correction

| Page | Collections lues | Lectures |
|---|---|---|
| `index.html` | 3 (partagées par 2 modules) | ~591 — **était ~1 182** |
| `scholarships.html`, `universities.html` | 3 | ~591 |
| `results.html`, `dashboard.html` | 3 | ~591 |
| `applications.html` | 3 (partagées par 2 appels) | ~591 — **était ~1 182** |
| `test-prep.html` | 2 | ~446 |
| `profile.html`, `eligibility-questions.html` | 1 | ~111 |
| `scholarship-details.html` | 2 documents ciblés | 2 |

## Règles de travail

1. **Aucun onglet du site ouvert pendant qu'on écrit des fichiers.**
   Live Server recharge tout à chaque sauvegarde.
2. **Tout nouveau module qui a besoin du catalogue appelle
   `chargerCatalogue()`** — jamais un `getDocs` de collection en direct.
   S'il ne lui faut qu'une collection, il demande celle-là.
3. **Le coût est annoncé en développement** : la console affiche
   `[Fitz] catalogue chargé — N lectures Firestore` à chaque lecture
   réelle, et reste muette sur un appel mémoïsé. Un coût qu'on ne voit
   pas est un coût que personne ne surveille — c'est ce qui a permis à
   l'accueil de coûter le double pendant des semaines.

## Ce qui reste à faire

La mémoïsation vaut pour **un chargement de page**. Deux visites
successives relisent tout. Le correctif de fond est un **instantané JSON
statique** du catalogue, régénéré à chaque lot : une visite passerait
alors de ~591 lectures à zéro. C'est un chantier distinct, qui suppose
une décision sur le forfait Firebase (Blaze) et une stratégie
d'invalidation — il n'est pas engagé.
