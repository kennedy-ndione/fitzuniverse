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

## Les polices de l'accueil (`assets/fonts/`) — ajoutées le 2026-09-24

Lot A-bis « vitesse sur téléphone » : l'accueil n'appelle plus Google Fonts,
il sert lui-même ses deux familles. Neuf fichiers woff2, un par famille/style
et par alphabet (latin, latin étendu, vietnamien), déclarés dans le `<style>`
d'`index.html` avec les mêmes `unicode-range` que Google.

| Fichiers | Provenance | Identique à Google ? |
|---|---|---|
| `newsreader-*-wght-normal.woff2` | paquet npm `@fontsource-variable/newsreader` 5.3.0 | **oui, octet pour octet** (SHA-256 comparés le 2026-09-24) |
| `public-sans-*-wght-normal.woff2` | paquet npm `@fontsource-variable/public-sans` 5.3.0 | **oui, octet pour octet** |
| `newsreader-*-italic-500.woff2` | italique variable du même paquet, **figée à la graisse 500** (fontTools `varLib.instancer`) | même dessin ; Google sert lui aussi un fichier réduit à 500 (26 Kio contre 25,6) |

Pourquoi figer l'italique : la page ne demande l'italique qu'en 500 (les deux
mots ambrés du titre). La police variable complète pèse 64 Kio en latin ; la
version figée, 26 Kio. Rendu comparé au pixel près à 64 px : identique à
l'anticrénelage près.

Pour régénérer un jour (nouvelle version des polices) : `npm pack` des deux
paquets, copier les fichiers `-wght-normal`, et pour l'italique :

```
python -m fontTools.varLib.instancer newsreader-latin-wght-italic.woff2 wght=500 -o newsreader-latin-italic-500.woff2
```

(idem pour `latin-ext` et `vietnamese`). Puis vérifier `npm test`
(test/vitesse-accueil.test.mjs, n° 8 et 9).

### Licence

Les deux familles sont sous **SIL Open Font License 1.1**, qui en permet
l'hébergement et la redistribution. Chaque fichier porte son copyright et
l'adresse de la licence dans ses métadonnées (table `name`, comme les fichiers
de Google) ; le texte complet est reproduit ci-dessous. Il vit ici, dans un
document du dépôt, et non à côté des fichiers : `assets/` ne publie aucun
`.txt` (voir `scripts/hosting-publie.mjs`, liste blanche des extensions).

- **Newsreader** — Copyright 2020 The Newsreader Project Authors
  (http://github.com/productiontype/Newsreader)
- **Public Sans** — Copyright 2015 The Public Sans Project Authors
  (https://github.com/uswds/public-sans)

```
-----------------------------------------------------------
SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007
-----------------------------------------------------------

PREAMBLE
The goals of the Open Font License (OFL) are to stimulate worldwide
development of collaborative font projects, to support the font creation
efforts of academic and linguistic communities, and to provide a free and
open framework in which fonts may be shared and improved in partnership
with others.

The OFL allows the licensed fonts to be used, studied, modified and
redistributed freely as long as they are not sold by themselves. The
fonts, including any derivative works, can be bundled, embedded,
redistributed and/or sold with any software provided that any reserved
names are not used by derivative works. The fonts and derivatives,
however, cannot be released under any other type of license. The
requirement for fonts to remain under this license does not apply
to any document created using the fonts or their derivatives.

DEFINITIONS
"Font Software" refers to the set of files released by the Copyright
Holder(s) under this license and clearly marked as such. This may
include source files, build scripts and documentation.

"Reserved Font Name" refers to any names specified as such after the
copyright statement(s).

"Original Version" refers to the collection of Font Software components as
distributed by the Copyright Holder(s).

"Modified Version" refers to any derivative made by adding to, deleting,
or substituting -- in part or in whole -- any of the components of the
Original Version, by changing formats or by porting the Font Software to a
new environment.

"Author" refers to any designer, engineer, programmer, technical
writer or other person who contributed to the Font Software.

PERMISSION & CONDITIONS
Permission is hereby granted, free of charge, to any person obtaining
a copy of the Font Software, to use, study, copy, merge, embed, modify,
redistribute, and sell modified and unmodified copies of the Font
Software, subject to the following conditions:

1) Neither the Font Software nor any of its individual components,
in Original or Modified Versions, may be sold by itself.

2) Original or Modified Versions of the Font Software may be bundled,
redistributed and/or sold with any software, provided that each copy
contains the above copyright notice and this license. These can be
included either as stand-alone text files, human-readable headers or
in the appropriate machine-readable metadata fields within text or
binary files as long as those fields can be easily viewed by the user.

3) No Modified Version of the Font Software may use the Reserved Font
Name(s) unless explicit written permission is granted by the corresponding
Copyright Holder. This restriction only applies to the primary font name as
presented to the users.

4) The name(s) of the Copyright Holder(s) or the Author(s) of the Font
Software shall not be used to promote, endorse or advertise any
Modified Version, except to acknowledge the contribution(s) of the
Copyright Holder(s) and the Author(s) or with their explicit written
permission.

5) The Font Software, modified or unmodified, in part or in whole,
must be distributed entirely under this license, and must not be
distributed under any other license. The requirement for fonts to
remain under this license does not apply to any document created
using the Font Software.

TERMINATION
This license becomes null and void if any of the above conditions are
not met.

DISCLAIMER
THE FONT SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT
OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL THE
COPYRIGHT HOLDER BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL
DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM
OTHER DEALINGS IN THE FONT SOFTWARE.
```
