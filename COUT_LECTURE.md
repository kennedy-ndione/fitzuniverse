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

## L'instantané statique (fait le 2026-09-03)

Le correctif de fond est en place. `scripts/lot.mjs export` écrit
désormais **deux** fichiers :

| Fichier | Forme | Pour qui | Versionné |
|---|---|---|---|
| `scripts/export-catalog.json` | résumé d'audit, clés françaises | l'audit des lots | non (gitignoré) |
| `assets/data/catalogue.json` | les documents TELS QUELS, sous `programs` / `universities` / `scholarships` | **le site public** | oui |

`js/catalog-data.js` lit d'abord `assets/data/catalogue.json` (servi par
Firebase Hosting comme un fichier — **zéro lecture Firestore**), et ne
retombe sur Firestore que si le fichier manque ou n'est pas exploitable
(`js/catalog-snapshot.js`, testé par `test/catalog-snapshot.test.mjs`).
La fiche (`details.js`) y lit aussi son programme, son université et sa
bourse. Le quota ne sert plus qu'aux commandes d'administration et à
l'espace étudiant connecté.

Vérifié en harnais (Playwright, SDK Firebase stubbé) : instantané présent
→ 0 `getDocs`, catalogue affiché ; instantané absent → 3 `getDocs`, comme
avant ; **quota épuisé + instantané présent → catalogue affiché** ; quota
épuisé sans instantané → grille vide (la situation du 3 septembre au soir).

### Coût par page, depuis l'instantané

| Page | Lectures Firestore |
|---|---|
| `index.html`, `scholarships.html`, `universities.html`, `results.html`, `test-prep.html`, `profile.html`, `eligibility-questions.html` | **0** |
| `scholarship-details.html` | **0** (était 2-3) |
| `dashboard.html`, `applications.html` | 0 pour le catalogue ; les documents de l'utilisateur restent lus |

### La règle de publication

**Le catalogue public affiche l'état du dernier `export` déployé.**
Un lot = `analyser` → `ecrire` → `verifier` → `export` →
`firebase deploy --only hosting`. Sans le déploiement, les visiteurs
voient l'export précédent ; en développement (Live Server), le fichier
local est servi tel quel dès l'export.

`firebase.json` sert le fichier avec `Cache-Control: max-age=300` : un
nouvel export est vu au plus tard cinq minutes après le déploiement, et
le navigateur revalide à chaque page (`fetch` en `no-cache`).

### Ce qui reste hors instantané

L'espace étudiant connecté (candidatures, profil, messages) lit ses
propres documents : quelques lectures par page, sans rapport avec la
taille du catalogue. `admin/` continue de lire Firestore en direct, à
dessein.
