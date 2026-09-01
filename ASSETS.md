# Les images du dépôt — et la dette qui empêche de l'alléger

Constaté le 2026-09-01, au moment où `assets/` est entré au dépôt.

## Ce qui est versionné, et pourquoi tout l'est

`assets/` pèse **477 Mo pour 1571 fichiers** : les originaux **et** toutes les
variantes générées (largeurs `-400w`/`-800w`/`-1200w`/`-1600w`, en JPEG, WebP
et AVIF).

Les variantes ont été committées **volontairement**, après vérification script
par script. Le réflexe « c'est généré, donc régénérable, donc inutile à
versionner » est **faux ici** :

| Script | Ce qu'il couvre | Formats produits |
|---|---|---|
| `scripts/regenerate-city-images.mjs` | toutes les références de `assets/images/cities/` | **JPEG seulement** |
| `scripts/generate-city-srcset.mjs` | toutes les références de `assets/images/cities/` | **JPEG seulement** |
| `scripts/regenerate-homepage-images.mjs` | **9 fichiers codés en dur** | **JPEG seulement** |
| `scripts/add-lot31-photos.mjs`, `add-lot32-photos.mjs`, `add-hero-catalog-photos.mjs` | **leur lot uniquement** | JPEG + WebP + AVIF |

**Aucun script ne produit de WebP ni d'AVIF à partir des originaux présents sur
le disque.** Les seuls qui en produisent sont ceux des *lots* : ils ne relisent
rien en local, ils **re-téléchargent depuis Unsplash** une liste d'identifiants
CDN codée en dur, et ne couvrent que leur propre lot.

Conséquence chiffrée : **~200 variantes WebP/AVIF de villes** (100 + 100), plus
celles des images d'accueil, **n'ont aucun chemin de reconstruction**. Les
supprimer du dépôt en les disant « régénérables » aurait donné des images
cassées sur tout clone frais, et une dépendance silencieuse à la disponibilité
de photos Unsplash tierces.

## La dette

> Il manque un `scripts/regenerate-all-variants.mjs` qui reconstruise **toutes**
> les variantes, dans **tous** les formats, à partir des seuls originaux locaux.

Ce qu'il devrait faire, pour être réellement suffisant :

1. balayer **tous** les dossiers concernés — `assets/images/`,
   `assets/images/cities/`, `assets/images/scholarships/` — au lieu d'une liste
   codée en dur ;
2. repérer les originaux (les fichiers **sans** suffixe `-<N>w`) et n'en
   dépendre que d'eux, jamais du réseau ;
3. produire les 4 largeurs en **JPEG q92 mozjpeg, WebP q92 et AVIF q62** —
   c'est-à-dire couvrir enfin les trois formats, pas seulement le JPEG ;
4. respecter les particularités déjà en place : `withoutEnlargement` (un
   `-<N>w.jpg` doit toujours exister, sinon un candidat `srcset` tombe en 404
   silencieux au lieu de se replier proprement), et les largeurs `1920w` propres
   aux images d'accueil ;
5. être **idempotent** et ne réécrire que ce qui manque ou a changé — le piège
   connu de `generate-city-srcset.mjs`, qui ré-encode tout le catalogue à chaque
   exécution et pollue `git status` de centaines de fichiers.

## Ce que ça débloquerait

Tant que ce script n'existe pas, les variantes sont des **sources** : elles
doivent rester versionnées.

Le jour où il existe, elles redeviennent de vrais artefacts, et le dépôt peut
être allégé pour de bon. L'ordre de grandeur est déjà mesuré (2026-09-01) :

- objets atteignables : **883 Mo**
- instantané actuel (`HEAD`) : **481 Mo**
- **anciennes versions d'images, présentes dans l'historique mais plus dans
  `HEAD` : 395 Mo sur 343 blobs** — dont 318 dans `assets/images/cities/`

Autrement dit, **près de la moitié du dépôt est constituée de photos périmées**,
remplacées au fil des lots (les plus lourdes : `naples.jpg` 9,2 Mo,
`japon (5).jpg` 8,7 Mo, `hefei.jpg` 8,4 Mo, `tianjin.jpg` 7,9 Mo).

Deux chantiers distincts, à ne pas confondre :

- **purger l'historique** (`git filter-repo`) des 395 Mo d'anciennes versions —
  gain immédiat, mais **réécriture d'historique**, donc à faire avant tout
  premier `push`, jamais après, et jamais sans copie hors machine ;
- **cesser de versionner les variantes**, ce qui suppose d'abord le script
  ci-dessus.

Le premier est possible tout de suite. Le second ne l'est pas encore : c'est la
dette décrite ici.

## Sauvegarde

Un `git bundle --all` restaure l'intégralité du dépôt, historique compris, à
partir d'un seul fichier — utile là où pousser 870 Mo n'est pas réaliste :

```bash
git bundle create fitz-<date>.bundle --all
git bundle verify fitz-<date>.bundle
git clone fitz-<date>.bundle fitz-restaure
```

Le fabriquer **en dehors** de l'arbre de travail : `*.bundle` n'est pas dans
`.gitignore`, un bundle posé à la racine se retrouverait à salir `git status`
(voire à se versionner lui-même).
