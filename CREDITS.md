# Crédits photo

Les photos de villes utilisées dans le catalogue d'universités (`assets/images/cities/`) proviennent en grande majorité de sources en licence libre sans obligation d'attribution. Les exceptions ci-dessous sont sous licence Creative Commons avec attribution obligatoire (CC BY-SA) et doivent rester créditées tant que ces fichiers sont utilisés.

## Photos de contenu (`assets/images/`)

### `reading-room.jpg` (déclinaisons `-400w`/`-800w`/`-1200w`/`-1600w`, en JPEG + WebP + AVIF)

Ajoutée le 2026-09-01 comme bannière de `scholarships.html`, en remplacement de `assets/images/cities/riyadh.jpg` — qui choisissait un pays sur 28 pour un catalogue mondial, servait déjà dans la grille en dessous (repli pays de l'Arabie saoudite, et photo de King Saud University ci-dessous), et disait « voyage » plutôt que « bourse ». **`riyadh.jpg` n'a pas été touchée** : elle garde ses deux usages.

- **Photographe** : Zoshua Colah ([@zoshuacolah](https://unsplash.com/@zoshuacolah))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/JcPr4irSk34` (identifiant CDN `photo-1741707596397-efaae09503b5`) — salle de lecture universitaire, tables en enfilade sous leurs lampes.
- **Déclinaisons** : générées localement avec `sharp` (JPEG q92 mozjpeg, WebP q92, AVIF q62) par `scripts/add-hero-bourses-photo.mjs`, à partir d'un recadrage 2:1 de la source 2400×1603.
- **Contrôles faits avant de la retenir** (le fichier a été REGARDÉ, y compris au zoom) : aucun blason, aucune enseigne, aucun texte lisible — les vitraux sont géométriques, et les petits motifs des baies hautes sont des marques d'imprimeurs, hors recadrage. L'établissement (University of Washington) **n'est pas au catalogue** : les deux seules universités américaines en base sont Stanford et Berkeley.

### `campus-courtyard.jpg` (déclinaisons `-400w`/`-800w`/`-1200w`/`-1600w`, en JPEG + WebP + AVIF)

Ajoutée le 2026-09-01 comme bannière de `universities.html`, en remplacement de `university-hall.jpg` (voir l'entrée suivante : sa provenance n'a pas pu être établie, et elle servait déjà de hero à la page d'accueil).

- **Photographe** : Tristan Bowersox ([@tbmcqueen](https://unsplash.com/@tbmcqueen))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/JunZiFy0ER0` (identifiant CDN `photo-1730145268935-34c1d833bb98`) — cour à arcades, vue symétrique depuis le pavé.
- **Déclinaisons** : générées localement avec `sharp` (JPEG q92 mozjpeg, WebP q92, AVIF q62) par `scripts/add-hero-catalog-photos.mjs`, à partir d'un recadrage 2:1 de la source 2400×1616.
- **Contrôles faits avant de la retenir** (le fichier a été REGARDÉ, y compris au zoom sur l'arcade centrale) : aucune plaque, aucun blason, aucune enseigne, aucun drapeau, aucune ligne d'horizon urbaine. Ce n'est **pas un établissement d'enseignement** — aucune université du catalogue ne peut donc sembler cautionner FitzUniverse. Palette pierre grise et ciel bleu, **froide**, choisie pour trancher d'un coup d'œil avec la salle de lecture chaude de `scholarships.html`.

### `university-hall.jpg` — retirée du site, provenance NON ÉTABLIE

N'est plus affichée nulle part : bannière de `universities.html` jusqu'au 2026-09-01, puis retirée du haut de l'accueil lors de sa refonte (2026-09-08). Le fichier n'est plus dans le dossier des images publiées.

- **Licence** : **inconnue.** Recherchée le 2026-09-01 sans résultat : aucune entrée d'origine dans ce fichier, aucun auteur en EXIF/IPTC (le XMP ne porte que la signature de pipeline « Go XMP SDK », compatible avec un passage par Unsplash mais qui ne prouve rien), message de commit muet (`16b22a7`, 2026-08-14), et une recherche par comparaison perceptuelle sur les résultats Unsplash correspondants n'a produit aucune correspondance (meilleur écart 36/255, très au-dessus d'un seuil d'identité).
- **Contenu** : bâtiment collégial de style gothique anglais, sur pelouse. Aucun blason, aucune enseigne, aucun texte identifiant sur ce cadrage — mais l'architecture reste assez distinctive pour qu'un visiteur connaissant ce campus le reconnaisse.
- **Ce qu'il reste à faire** : rien, la photo n'étant plus publiée. Entrée volontairement conservée ici, vide de crédit : **un trou documenté vaut mieux qu'une attribution inventée**, et mieux qu'un silence qui ferait reposer la question à zéro à la prochaine passe.

### `student-preparing.jpg` (déclinaisons `-400w`/`-800w`/`-1200w`/`-1600w`)

Ajoutée le 2026-08-28 pour la section « Comment ça fonctionne » de la page d'accueil.

- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/6e319464b810` (identifiant CDN `photo-1622295023825-6e319464b810`)
- **Déclinaisons** : téléchargées directement aux largeurs voulues depuis le CDN Unsplash (`?w=…&q=80&fm=jpg`), et non générées localement — le projet n'embarque pas `sharp`. C'est aussi pourquoi ce fichier n'a pas de variantes `avif`/`webp`, contrairement aux photos plus anciennes.

### `hero-bg3.jpg` — diplômés lançant leurs toques devant un bâtiment blanc (photo du haut de l'accueil)

Source retrouvée le 2026-09-24 par empreinte visuelle et par les dimensions exactes de l'original (5040x3360). Sert aussi de fond générique aux cartes sans photo propre.

- **Photographe** : RDNE Stock project ([@rdne](https://www.pexels.com/@rdne/))
- **Licence** : [Licence Pexels](https://www.pexels.com/license/) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://www.pexels.com/photo/people-wearing-graduation-gowns-tossing-their-graduation-caps-in-the-air-7713548/`

### `hero-bg5.jpg` — diplômés en toge posant sur la pelouse, même bâtiment blanc (fond générique)

Même série et même photographe que la photo du haut de l'accueil ; dimensions exactes de l'original (6720x4480).

- **Photographe** : RDNE Stock project ([@rdne](https://www.pexels.com/@rdne/))
- **Licence** : [Licence Pexels](https://www.pexels.com/license/) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://www.pexels.com/photo/people-wearing-graduation-gowns-7713171/`

### `hero-bg4.jpg` — diplômés en toge devant la façade d'une université (pied de page, fond générique)

- **Photographe** : RUT MIIT ([@rutmiit](https://unsplash.com/@rutmiit))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/YIdkWynJdSk` (identifiant CDN `photo-1627556704243-5f0771d90783`)

### `amphitheatre.jpg` — un amphithéâtre vide, rangées de sièges en bois (accueil, connexion, inscription)

- **Photographe** : Nathan Dumlao ([@nate_dumlao](https://unsplash.com/@nate_dumlao))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/ewGMqs2tmJI` (identifiant CDN `photo-1519452575417-564c1401ecc0`)

### `graduation.jpg` — des toques de diplômés vues d'en haut (page des offres, espace étudiant)

- **Photographe** : Joshua Hoehne ([@joshua_hoehne](https://unsplash.com/@joshua_hoehne))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/iggWDxHTAUQ` (identifiant CDN `photo-1590012314607-cda9d9b699ae`)

### `og-image.jpg` — l'image de partage sur les réseaux sociaux

- **Contenu** : visuel réalisé pour FitzUniverse (logo, titre et fond uni), sans photographie.

## Amsterdam (`amsterdam.jpg` et déclinaisons `-400w`/`-800w`/`-1200w`)

- **Photographe** : Jorge Royan
- **Licence** : [CC BY-SA 3.0 Unported](https://creativecommons.org/licenses/by-sa/3.0/deed.en)
- **Source** : [File:Amsterdam - Canal - 0603.jpg — Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Amsterdam_-_Canal_-_0603.jpg)
- **Site du photographe** : http://www.royan.com.ar

## Delft (`delft.jpg` et déclinaisons `-400w`/`-800w`/`-1200w`)

- **Photographe** : W. Bulach
- **Licence** : [CC BY-SA 4.0 International](https://creativecommons.org/licenses/by-sa/4.0/deed.en)
- **Source** : [File:00 0781 Canal in Delft (NL).jpg — Wikimedia Commons](https://commons.wikimedia.org/wiki/File:00_0781_Canal_in_Delft_(NL).jpg)

## Benguerir (`benguerir.jpg` et déclinaisons `-400w`/`-800w`/`-1200w`/`-1600w`)

Ajoutée au lot 6 d'élargissement du catalogue (2026-08-28), pour l'Université Mohammed VI Polytechnique.

- **Photographe** : Aminezr23
- **Licence** : [CC BY-SA 4.0 International](https://creativecommons.org/licenses/by-sa/4.0/deed.en)
- **Source** : [File:Vue campus UM6P.jpg — Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Vue_campus_UM6P.jpg)

Vue aérienne du campus principal de l'UM6P à Benguerir. Le fichier ne porte pas de coordonnées ; le campus a été identifié visuellement — implantation ocre en bordure semi-désertique avec la ville en arrière-plan, sans rapport avec le campus de Salé (côtier, urbain), auquel se rapportent la plupart des autres photos UM6P de Commons.

## Louvain-la-Neuve (`louvainlaneuve.jpg` et déclinaisons `-400w`/`-800w`/`-1200w`/`-1600w`)

Ajoutée au lot 6 d'élargissement du catalogue (2026-08-28), pour l'UCLouvain.

- **Photographe** : Gargarapalvin
- **Licence** : [CC BY-SA 4.0 International](https://creativecommons.org/licenses/by-sa/4.0/deed.en)
- **Source** : [File:Louvain-la-Neuve (14.05.2026) 05.jpg — Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Louvain-la-Neuve_(14.05.2026)_05.jpg)

Le Musée L (musée universitaire de Louvain), bâtiment brutaliste d'André Jacqmain. Retenu après examen des autres candidats de la catégorie Commons : la Grand-Place montre un multiplexe de verre, l'« Esplanade » est un centre commercial, et la Place des Wallons un immeuble couvert de graffitis — aucun ne représente la ville universitaire. Louvain-la-Neuve étant une ville moderniste construite ex nihilo dans les années 1970, elle n'offre pas d'équivalent aux canaux d'Amsterdam ou de Delft.

## Lausanne (`lausanne.jpg` et déclinaisons `-400w`/`-800w`/`-1200w`/`-1600w`)

Ajoutée en vue du lot 9 d'élargissement du catalogue (candidat EPFL, écarté du lot 7 faute de photo — voir `admin/expand-catalog-batch7.js`).

- **Photographe** : Nolan Krattinger ([@odes](https://unsplash.com/@odes))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/dQTNnp1Jb8E` (identifiant CDN `photo-1603646049799-736bb072cec5`) — vue depuis la cathédrale de Lausanne.
- **Déclinaisons** : téléchargées directement aux largeurs voulues depuis le CDN Unsplash (`?w=…&q=80&fm=jpg`), comme `student-preparing.jpg` — pas de variantes `avif`/`webp`.

## Jeddah (`jeddah.jpg` et déclinaisons `-400w`/`-800w`/`-1200w`/`-1600w`)

Ajoutée en vue du lot 9 d'élargissement du catalogue (candidat King Abdulaziz University, écarté du lot 7 faute de photo — voir `admin/expand-catalog-batch7.js`).

- **Photographe** : Datingscout ([@datingscout](https://unsplash.com/@datingscout))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix.
- **Source** : `https://unsplash.com/photos/a-large-sign-that-says-jeddah-in-front-of-palm-trees-dBgLXxob7NQ` (identifiant CDN `photo-1674979724572-c0a0579bc9d0`) — le panneau "Jeddah" en bord de mer.
- **Déclinaisons** : téléchargées directement aux largeurs voulues depuis le CDN Unsplash (`?w=…&q=80&fm=jpg`), même méthode que Lausanne ci-dessus.

## Photos uniques par université (lot 11, 2026-08-28)

Ajoutées pour que plus aucune université ne partage sa photo avec une autre (audit demandé par l'utilisateur, 2026-08-28). Chacune remplace le champ `image` d'UNE seule université qui partageait jusque-là une photo de ville avec une autre — voir `admin/expand-catalog-batch11.js` pour le détail des 9 documents corrigés et `scripts/add-lot11-unique-photos.ps1` pour le téléchargement. Toutes en [Unsplash License](https://unsplash.com/license) (usage commercial libre, attribution non obligatoire, créditées ici par choix), toutes téléchargées directement aux largeurs voulues depuis le CDN Unsplash comme Lausanne/Jeddah/`student-preparing.jpg` ci-dessus — pas de variantes `avif`/`webp`.

### `stanford.jpg` — Stanford University (remplace `newyork.jpg`, erroné : ni Stanford ni Berkeley ne sont à New York)

- **Photographe** : Jorge Fernández Salas
- **Source** : `https://unsplash.com/photos/f5OO7rL6OD8` (identifiant CDN `photo-1566549720649-01b61516861b`) — la Hoover Tower, repère emblématique du campus.

### `berkeley.jpg` — University of California, Berkeley (remplace `newyork.jpg`)

- **Photographe** : Jeremy Huang (`@plover37`)
- **Source** : `https://unsplash.com/photos/zn7eped3vn0` (identifiant CDN `photo-1638909374742-8c8364010106`) — le Campanile (Sather Tower).

### `sorbonne.jpg` — Sorbonne Université (remplace `paris.jpg`, gardée par Sciences Po)

- **Photographe** : Slavan (`@slavan_art`)
- **Source** : `https://unsplash.com/photos/0uWpkH81fTA` (identifiant CDN `photo-1774526993562-abc3f2afac0f`) — façade historique de la Sorbonne, drapeaux français.

### `istanbul-university.jpg` — Istanbul University (remplace `istanbul.jpg`, gardée par Boğaziçi University)

- **Photographe** : Spenser Sembrat
- **Source** : `https://unsplash.com/photos/UM_YUJUGK6g` (identifiant CDN `photo-1763965367191-6455ef032c79`) — skyline d'Istanbul, mosquées et détroit du Bosphore.

### `istanbul-technical.jpg` — Istanbul Technical University (remplace `istanbul.jpg`)

- **Photographe** : Meriç Dağlı (`@meric`)
- **Source** : `https://unsplash.com/photos/-HxENS1GYSA` (identifiant CDN `photo-1564428366891-dc20b1edf33b`) — la tour de Léandre (Maiden's Tower), vue de la rive asiatique.

### `princess-nourah.jpg` — Princess Nourah bint Abdulrahman University (remplace `riyadh.jpg`, gardée par King Saud University)

- **Photographe** : Mohammed Alqarni (`@mhmdqrni`)
- **Source** : `https://unsplash.com/photos/XBRJXgXYJY4` (identifiant CDN `photo-1674822858255-fcc093a1ef43`) — skyline de Riyad, tours et palmiers.

### `politehnica-bucuresti.jpg` — Politehnica Bucuresti / UNSTPB (remplace `bucharest.jpg`, gardée par l'Université de Bucarest)

- **Photographe** : Árpád Czapp (`@czapp_arpad`)
- **Source** : `https://unsplash.com/photos/s0OkTmN8B-s` (identifiant CDN `photo-1639631684488-19a2b0fa456c`) — vue aérienne de Bucarest.

### `zurich-grossmunster.jpg` — University of Zurich / UZH (remplace `zurich.jpg`, gardée par ETH Zurich)

- **Photographe** : Rico Reutimann (`@ricoreu`)
- **Source** : `https://unsplash.com/photos/XxAR3uzYiZY` (identifiant CDN `photo-1573137785546-9d19e4f33f87`) — le Grossmünster de Zurich.

### `rudn.jpg` — RUDN University (remplace `moscow.jpg`, gardée par HSE University)

- **Photographe** : Alexandr Bormotin (`@bormot`)
- **Source** : `https://unsplash.com/photos/jj3PpeBIlLA` (identifiant CDN `photo-1541447271487-09612b3f49f7`) — tours modernes du centre de Moscou.

## Photos uniques par université (lot 13, 2026-08-28)

Suite du lot 11 : l'audit étendu (`admin/audit-catalog.html`) a révélé 9 groupes de photos partagées supplémentaires, tous antérieurs à cette session (universités importées avant les lots 1-9, catalogue chinois/hongrois/indien/malaisien/italien/coréen/japonais). Chacune des photos ci-dessous remplace le champ `image` d'UNE seule université d'un groupe qui en partageait une — voir `admin/expand-catalog-batch13.js` et `scripts/add-lot13-more-unique-photos.ps1`. Toutes en [Unsplash License](https://unsplash.com/license), même méthode de téléchargement direct que les lots précédents.

### `corvinus.jpg` — Corvinus University of Budapest (remplace `budapest.jpg`, gardée par Eötvös Loránd University)

- **Photographe** : Ervin Lukacs (`@lukerv4`)
- **Source** : `https://unsplash.com/photos/sMyQb3i9bNA` (identifiant CDN `photo-1616432902940-b7a1acbc60b3`) — le Parlement hongrois sur les rives du Danube.

### `bme-budapest.jpg` — Budapest University of Technology and Economics (remplace `budapest.jpg`)

- **Photographe** : Florian van Duyn
- **Source** : `https://unsplash.com/photos/-ZktwJWN_24` (identifiant CDN `photo-1518471152222-d42e38ce6873`) — l'église Matthias et la statue équestre du roi Étienne.

### `obuda.jpg` — Óbuda University (remplace `budapest.jpg`)

- **Photographe** : Emma Fabbri (`@fabevent`)
- **Source** : `https://unsplash.com/photos/2TmsyZXMNTE` (identifiant CDN `photo-1549877452-9c387954fbc2`) — le bastion des Pêcheurs de jour.

### `semmelweis.jpg` — Semmelweis University (remplace `budapest.jpg`)

- **Photographe** : Dan Freeman (`@danfreemanphoto`)
- **Source** : `https://unsplash.com/photos/kDP_lvDzh2c` (identifiant CDN `photo-1507622560124-621e26755fb8`) — un pont illuminé sur le Danube au crépuscule.

### `shanghai-jiaotong.jpg` — Shanghai Jiao Tong University (remplace `shanghai.jpg`, gardée par Fudan University)

- **Photographe** : Edward He (`@bingham008`)
- **Source** : `https://unsplash.com/photos/uKyzXEc2k_s` (identifiant CDN `photo-1538428494232-9c0d8a3ab403`) — l'Oriental Pearl Tower sur le Bund.

### `shanghai-maritime.jpg` — Shanghai Maritime University (remplace `shanghai.jpg`)

- **Photographe** : Henry Chen (`@chentianlu`)
- **Source** : `https://unsplash.com/photos/hyR7y7iAPmI` (identifiant CDN `photo-1614221330834-9399e5631af3`) — skyline de nuit depuis le fleuve Huangpu.

### `tongji.jpg` — Tongji University (remplace `shanghai.jpg`)

- **Photographe** : Zhou Xian (`@zhou_xian`)
- **Source** : `https://unsplash.com/photos/7tFFO6Mq5L4` (identifiant CDN `photo-1627484986972-e544190b8abb`) — vue aérienne nocturne du skyline.

### `beihang.jpg` — Beihang University (remplace `beijing.jpg`, gardée par Peking University)

- **Photographe** : Hanson Lu (`@hansonluu`)
- **Source** : `https://unsplash.com/photos/_8EFj6ISA08` (identifiant CDN `photo-1508804185872-d7badad00f7d`) — la Grande Muraille de Chine.

### `tsinghua.jpg` — Tsinghua University (remplace `beijing.jpg`)

- **Photographe** : Ling Tang (`@linglivestolaugh`)
- **Source** : `https://unsplash.com/photos/yBroAF1cN3I` (identifiant CDN `photo-1547981609-4b6bfe67ca0b`) — la Cité interdite.

### `university-of-delhi.jpg` — University of Delhi / DU (remplace `delhi.jpg`, gardée par Jawaharlal Nehru University)

- **Photographe** : Shalender Kumar
- **Source** : `https://unsplash.com/photos/XjKaPInYVCM` (identifiant CDN `photo-1587474260584-136574528ed5`) — la porte de l'Inde (India Gate) au crépuscule.

### `universiti-malaya.jpg` — Universiti Malaya / UM (remplace `kualalumpur.jpg`, gardée par Universiti Kebangsaan Malaysia)

- **Photographe** : Esmonde Yong
- **Source** : `https://unsplash.com/photos/-9B08uduMyY` (identifiant CDN `photo-1596422846543-75c6fc197f07`) — les tours Petronas illuminées de nuit.

### `bocconi.jpg` — Università Bocconi (remplace `milan.jpg`, gardée par Politecnico di Milano)

- **Photographe** : Ouael Ben Salah (`@benwkski`)
- **Source** : `https://unsplash.com/photos/0xe2FGo7Vc0` (identifiant CDN `photo-1610016302534-6f67f1c968d8`) — le Duomo di Milano.

### `yonsei.jpg` — Yonsei University (remplace `seoul.jpg`, gardée par Korea University)

- **Photographe** : Robson Hatsukami Morgan
- **Source** : `https://unsplash.com/photos/ku9Ftte6Ymo` (identifiant CDN `photo-1570191913384-7b4ff11716e7`) — la tour Namsan au-dessus des remparts anciens.

### `waseda.jpg` — Waseda University (remplace `tokyo.jpg`, gardée par University of Tokyo)

- **Photographe** : Erik Eastman (`@erikeae`)
- **Source** : `https://unsplash.com/photos/4HG5hlhmZg8` (identifiant CDN `photo-1503899036084-c55cdd92da26`) — la traversée de Shibuya de nuit.

`nanjing.jpg` (Nanjing University en double) ne nécessite aucune nouvelle photo : le doublon est résolu par fusion des deux fiches université (lot 12), pas par une nouvelle photo.

## Photos des bourses (lot 14, 2026-08-28) — assets/images/scholarships/

Décision de l'utilisateur le 2026-08-28 : les bourses ne doivent plus jamais réutiliser une photo de ville partagée avec une université (l'ancien repli via `js/scholarship-image.js`), ni un visuel généré (une proposition en ce sens a été présentée puis refusée). Chaque bourse doit avoir sa propre photo, un monument distinct représentant la ville ou le pays de la bourse. Nouveau dossier dédié `assets/images/scholarships/`, séparé de `assets/images/cities/` (aucun fichier partagé entre les deux). Voir `admin/expand-catalog-batch14.js` et `scripts/add-lot14-scholarship-photos.ps1`.

Lot 14 = première vague : les 17 pays qui n'ont qu'une seule bourse dans le catalogue (pas de risque de doublon interne à gérer). Les pays à plusieurs bourses (Belgique, Canada, Chine, États-Unis, France) et l'Italie (21 bourses) suivent dans de prochains lots.

Toutes en [Unsplash License](https://unsplash.com/license) (usage commercial libre, attribution non obligatoire, créditées ici par choix), toutes téléchargées directement aux largeurs voulues depuis le CDN Unsplash comme les lots précédents — pas de variantes `avif`/`webp`. Nom de fichier = id Firestore exact de la bourse, pour une correspondance sans ambiguïté.

### `mastercard-foundation-scholars-uct.jpg` — Mastercard Foundation Scholars Program (UCT), Afrique du Sud

- **Photographe** : Vimal Joseph (`@dr_vimaljv`)
- **Source** : `https://unsplash.com/photos/tRPvXfu5Xf0` (identifiant CDN `photo-1744604030401-b24c5975a574`) — Table Mountain dominant Le Cap.

### `daad-study-scholarships.jpg` — DAAD Study Scholarships, Allemagne

- **Photographe** : Andrés Dallimonti (`@dallimonti`)
- **Source** : `https://unsplash.com/photos/znYiS85WVxI` (identifiant CDN `photo-1574861501474-e2f098969b0e`) — château de Neuschwanstein, Bavière.

### `king-abdulaziz-scholarship.jpg` — Bourses du gouvernement saoudien, Arabie Saoudite

- **Photographe** : Safaa Almohandis (`@safaaalmohandis`)
- **Source** : `https://unsplash.com/photos/HKWbVK1AQys` (identifiant CDN `photo-1543282649-6d12df6b5fc2`) — tour Al Faisaliyah, Riyad.

### `global-korea-scholarship.jpg` — Global Korea Scholarship, Corée du Sud

- **Photographe** : Adish (AJ) (`@adish24`)
- **Source** : `https://unsplash.com/photos/T5NIVYYfynY` (identifiant CDN `photo-1566800890932-e89159daf3dc`) — palais Gyeongbokgung, Séoul.

### `stipendium-hungaricum.jpg` — Stipendium Hungaricum, Hongrie

- **Photographe** : Aurora Song (`@auroras13`)
- **Source** : `https://unsplash.com/photos/h8AlaGhk9oo` (identifiant CDN `photo-1779617164984-0bec21771748`) — pont des Chaînes et basilique Saint-Étienne, Budapest.

### `iccr-africa-scholarship-scheme.jpg` — ICCR Scholarship Scheme (India-Africa Maitri), Inde

- **Photographe** : Jovyn Chamb (`@jovynchamb`)
- **Source** : `https://unsplash.com/photos/iWMfiInivp4` (identifiant CDN `photo-1564507592333-c60657eea523`) — Taj Mahal, Agra.

### `mext-scholarship.jpg` — MEXT Scholarship, Japon

- **Photographe** : Kumiko Shimizu (`@shimikumi32`)
- **Source** : `https://unsplash.com/photos/uBOCEV5RGzY` (identifiant CDN `photo-1528884089-4582fe06c516`) — mont Fuji.

### `malaysia-international-scholarship.jpg` — Malaysia International Scholarship (MIS), Malaisie

- **Photographe** : Laurentiu Morariu (`@travelphotographer`)
- **Source** : `https://unsplash.com/photos/iTmhaDyV28A` (identifiant CDN `photo-1552353290-f2a1ff0b5009`) — grottes de Batu, Kuala Lumpur (statue dorée).

### `nl-scholarship.jpg` — NL Scholarship, Pays-Bas

- **Photographe** : Fabian Kleiser (`@fabiankleiser`)
- **Source** : `https://unsplash.com/photos/6PoH7N5Z0Nc` (identifiant CDN `photo-1774645456173-0fc2588ccfc3`) — champs de tulipes du Keukenhof.

### `nawa-banach-scholarship.jpg` — Banach NAWA Scholarship Programme, Pologne

- **Photographe** : Sebastian Kurpiel (`@sebbykurps`)
- **Source** : `https://unsplash.com/photos/qJZ0_8j6Kes` (identifiant CDN `photo-1573424659379-f5d699f4845a`) — cathédrale du Wawel, Cracovie.

### `bolsas-cooperacao-camoes.jpg` — Bolsas de Cooperação (Camões, I.P.), Portugal

- **Photographe** : Regös Környei (`@kornyeir`)
- **Source** : `https://unsplash.com/photos/RxVCWvDvfs4` (identifiant CDN `photo-1741034256927-3fde0ced8903`) — tour de Belém, Lisbonne.

### `romanian-government-scholarship.jpg` — Romanian Government Scholarship, Roumanie

- **Photographe** : Jorge Fernández Salas
- **Source** : `https://unsplash.com/photos/G4qT6vfnPcM` (identifiant CDN `photo-1544169086-da2d0dc39330`) — château de Bran.

### `chevening-scholarships.jpg` — Chevening Scholarships, Royaume-Uni

- **Photographe** : MJ Tangonan (`@mjtangonan`)
- **Source** : `https://unsplash.com/photos/LxintNXCGKQ` (identifiant CDN `photo-1523435324848-a7a613898152`) — Tower Bridge, Londres, de nuit.

### `open-doors-scholarship.jpg` — Open Doors: Russian Scholarship Project, Russie

- **Photographe** : Nikolay Vorobyev (`@nikolayv`)
- **Source** : `https://unsplash.com/photos/jaH3QF46gAY` (identifiant CDN `photo-1513326738677-b964603b136d`) — cathédrale Saint-Basile, Moscou.

### `swedish-institute-scholarships-global-professionals.jpg` — Swedish Institute Scholarships for Global Professionals, Suède

- **Photographe** : Siegfried Poepperl (`@siegfriedpoepperl`)
- **Source** : `https://unsplash.com/photos/1EFHk6vDGeY` (identifiant CDN `photo-1752906038204-5030008d5db0`) — hôtel de ville de Stockholm.

### `swiss-government-excellence-scholarships.jpg` — Swiss Government Excellence Scholarships, Suisse

- **Photographe** : Fabrice Villard (`@fabulu75`)
- **Source** : `https://unsplash.com/photos/JSeROcGUxkY` (identifiant CDN `photo-1531743579253-fa8d52993ba5`) — le Cervin (Matterhorn), lever de soleil.

### `turkiye-burslari.jpg` — Türkiye Bursları, Turquie

- **Photographe** : Igor Sporynin (`@igorharrier`)
- **Source** : `https://unsplash.com/photos/SagXn7H6HFg` (identifiant CDN `photo-1669111957528-6d4e78328692`) — montgolfières au-dessus de Cappadoce.

## Photos des bourses (lot 15, 2026-08-28) — assets/images/scholarships/

Suite du lot 14 : les pays à plusieurs bourses, hors Italie (qui suit dans un lot dédié) — Belgique (3), Canada (4), Chine (4), États-Unis (2), France (2). Attention particulière aux doublons internes à un même pays et à l'existant : les 4 bourses chinoises ont chacune un monument chinois distinct, différent aussi des photos déjà utilisées par les universités (`beijing.jpg`, `beihang.jpg` = Grande Muraille, `tsinghua.jpg` = Cité interdite, `shanghai.jpg`/`shanghai-jiaotong.jpg`/`shanghai-maritime.jpg`/`tongji.jpg`, `nanjing.jpg`). Voir `admin/expand-catalog-batch15.js` et `scripts/add-lot15-scholarship-photos.ps1`.

Toutes en [Unsplash License](https://unsplash.com/license), même méthode de téléchargement que les lots précédents.

### `bourse-master-in-wbi.jpg` — Bourse Master IN (WBI), Belgique

- **Photographe** : Cosmin Serban (`@cosminserban`)
- **Source** : `https://unsplash.com/photos/JAEog_jEAo0` (identifiant CDN `photo-1573995890753-a4f23342db17`) — l'Atomium, Bruxelles.

### `bourses-formations-internationales-ares.jpg` — Bourses de formations internationales (ARES), Belgique

- **Photographe** : Dana Andreea Gheorghe (`@dana_andreea`)
- **Source** : `https://unsplash.com/photos/4tFx38GfmDQ` (identifiant CDN `photo-1657571575815-5487216793e3`) — le beffroi de Bruges.

### `icp-connect-scholarships-vlir-uos.jpg` — ICP Connect Scholarships (VLIR-UOS), Belgique

- **Photographe** : Jahanzeb Ahsan (`@jahan_photobox`)
- **Source** : `https://unsplash.com/photos/RTO2KLNVHh0` (identifiant CDN `photo-1718553781481-504e2f2fbc1d`) — la gare centrale d'Anvers, verrière et dorures Belle Époque.

### `lester-b-pearson-international-scholarship.jpg` — Lester B. Pearson International Scholarship, Canada

- **Photographe** : Rohit Tandon (`@sepoys`)
- **Source** : `https://unsplash.com/photos/RsdE5eQKpjo` (identifiant CDN `photo-1753321178036-4a8b870a6435`) — la CN Tower vue de Kensington Market, Toronto.

### `mcgill-major-entrance-scholarships.jpg` — McGill Major Entrance Scholarships, Canada

- **Photographe** : Nadine Primeau (`@nadineprimeau`)
- **Source** : `https://unsplash.com/photos/XN8N_jybN3w` (identifiant CDN `photo-1537809804348-84588c9d988e`) — mur de pierre de la basilique Notre-Dame, Montréal.

### `ubc-international-scholars-program.jpg` — UBC International Scholars Program (IMES), Canada

- **Photographe** : Filipe Freitas (`@filipephotographs`)
- **Source** : `https://unsplash.com/photos/oetz65e6Otc` (identifiant CDN `photo-1658714772930-1af6d2012114`) — le pont suspendu de Capilano, Vancouver Nord.

### `vanier-canada-graduate-scholarship.jpg` — Vanier Canada Graduate Scholarship, Canada

- **Photographe** : Jason Hafso (`@jasonhafso`)
- **Source** : `https://unsplash.com/photos/C2keINMOhIE` (identifiant CDN `photo-1578973615934-8d9cdb0792b4`) — drapeau canadien devant la tour de la Paix, colline du Parlement, Ottawa.

### `beijing-government-scholarship.jpg` — Beijing Government Scholarship, Chine

- **Photographe** : Arthur Tseng (`@arthur3607`)
- **Source** : `https://unsplash.com/photos/xv53O3UJPhw` (identifiant CDN `photo-1754258987839-60f8aeab8664`) — le Temple du Ciel, Pékin.

### `chinese-government-scholarship.jpg` — Chinese Government Scholarship, Chine

- **Photographe** : Aaron Greenwood (`@onevibe`)
- **Source** : `https://unsplash.com/photos/UqSNn_KoDA4` (identifiant CDN `photo-1528163186890-de9b86b54b51`) — l'armée de terre cuite, Xi'an. Choisi comme symbole national plutôt que pékinois : c'est la bourse d'État chinoise la plus large, pas une bourse propre à Pékin.

### `nanjing-government-scholarship.jpg` — Nanjing Government Scholarship, Chine

- **Photographe** : Kenneth Yang (`@kennth1982`)
- **Source** : `https://unsplash.com/photos/lJWJLkwIsng` (identifiant CDN `photo-1517454376155-60f890ea84be`) — le temple Jiming sous la neige, Nankin.

### `shanghai-government-scholarship.jpg` — Shanghai Government Scholarship, Chine

- **Photographe** : Denys Nevozhai (`@dnevozhai`)
- **Source** : `https://unsplash.com/photos/D8iZPlX-2fs` (identifiant CDN `photo-1548919973-5cef591cdbc9`) — Shanghai vue depuis le sommet de la Jin Mao Tower à l'heure dorée — distinct des vues nocturnes déjà utilisées pour Shanghai Maritime University et Tongji University.

### `knight-hennessy-scholars.jpg` — Knight-Hennessy Scholars, États-Unis

- **Photographe** : Leo Bayard (`@leob_photography`)
- **Source** : `https://unsplash.com/photos/YnBhdD1DTzQ` (identifiant CDN `photo-1717652480757-555af691acbb`) — le Golden Gate Bridge, San Francisco — programme hébergé à Stanford, mais distinct de la Hoover Tower déjà utilisée pour l'université.

### `mastercard-foundation-scholars-program.jpg` — Mastercard Foundation Scholars Program, États-Unis

- **Photographe** : Vincent Y (`@vincentyuan87`)
- **Source** : `https://unsplash.com/photos/aAYQetRDMcQ` (identifiant CDN `photo-1703693219517-e5693e7873bd`) — la statue de la Liberté, New York.

### `eiffel-excellence-scholarship.jpg` — Eiffel Excellence Scholarship, France

- **Photographe** : Jad Limcaco (`@jadlimcaco`)
- **Source** : `https://unsplash.com/photos/NT1mJPgni6A` (identifiant CDN `photo-1492136344046-866c85e0bf04`) — la tour Eiffel, à l'heure dorée — cohérent avec le nom de la bourse.

### `bourse-emile-boutmy.jpg` — Bourse Émile Boutmy, France — **REMPLACÉE le 2026-09-03** (lot 35 bis : musée d'Orsay ; l'entrée ci-dessous est caduque, la pyramide du Louvre doublait `paris.jpg` de Sciences Po)

- **Photographe** : Tomáš Nožina (`@tomasnozina`)
- **Source** : `https://unsplash.com/photos/nwT0Y-NaQ4Y` (identifiant CDN `photo-1564557823522-1319c627a1e3`) — la pyramide du Louvre — bourse Sciences Po, distincte de `paris.jpg` (déjà utilisée par Sciences Po comme photo d'université) et de la tour Eiffel ci-dessus.

## Photos des bourses (lot 16, 2026-08-28) — assets/images/scholarships/

Dernier lot du remplacement des photos de bourse : les 21 bourses italiennes (lots 14 et 15 pour tous les autres pays). Après ce lot, les 56 bourses du catalogue ont chacune leur propre photo de monument, plus aucune ne retombe sur une photo de ville partagée. Attention particulière aux doublons internes et à l'existant : `bocconi.jpg` (photo d'université) utilise déjà le Duomo de Milan, donc les 5 bourses de Milan ci-dessous utilisent 5 autres monuments milanais. Voir `admin/expand-catalog-batch16.js` et `scripts/add-lot16-scholarship-photos.ps1`.

Toutes en [Unsplash License](https://unsplash.com/license), même méthode de téléchargement que les lots précédents.

### `bocconi-merit-award.jpg` — Bocconi Merit Award, Italie

- **Photographe** : Egemen Şahin (`@egemensahiin`)
- **Source** : `https://unsplash.com/photos/dTewr3XGixw` (identifiant CDN `photo-1740946065212-6f6c6dd1655b`) — la tour du Filarete, château des Sforza, Milan.

### `bocconi-graduate-merit-award.jpg` — Bocconi Graduate Merit Award, Italie

- **Photographe** : Emmanuel Cassar (`@emmanuelcassar`)
- **Source** : `https://unsplash.com/photos/cgoqWEEINXE` (identifiant CDN `photo-1716793165476-37ad6394472e`) — verrière intérieure de la Galleria Vittorio Emanuele II, Milan.

### `bocconi-phd-scholarship.jpg` — Bocconi PhD Scholarship, Italie

- **Photographe** : Benjamin Istanbuli (`@benjamin_istanbuli`)
- **Source** : `https://unsplash.com/photos/aF9MChz_Z68` (identifiant CDN `photo-1785961400969-033870e250e5`) — les Navigli, canaux de Milan.

### `politecnico-di-milano-merit-based-scholarship.jpg` — Politecnico di Milano Merit-Based Scholarship, Italie

- **Photographe** : Francesco Liotti (`@francesco_liotti`)
- **Source** : `https://unsplash.com/photos/u4qMZzgStFM` (identifiant CDN `photo-1690489964962-dcaaf37b22c0`) — le Bosco Verticale, quartier Porta Nuova, Milan.

### `politecnico-di-milano-phd-scholarship.jpg` — Politecnico di Milano PhD Scholarship, Italie

- **Photographe** : Claudia Salini (`@_cblue`)
- **Source** : `https://unsplash.com/photos/RmEtZzdcXwg` (identifiant CDN `photo-1635255440966-335b08f2b49f`) — l'Arco della Pace, Milan — distinct des quatre autres monuments milanais ci-dessus.

### `edisu-piemonte-scholarship.jpg` — EDISU Piemonte Scholarship, Italie

- **Photographe** : Julio Hernández (`@juliofhernandez`)
- **Source** : `https://unsplash.com/photos/2NoIbEvppHA` (identifiant CDN `photo-1664151235184-da7c79fb7049`) — la basilique de Superga, colline de Turin.

### `polito-phd-scholarship.jpg` — Polito PhD Scholarship, Italie

- **Photographe** : Davide Aracri (`@davieees`)
- **Source** : `https://unsplash.com/photos/1lfIXBR6NB0` (identifiant CDN `photo-1651453796204-5a9e98744dd3`) — la Mole Antonelliana, Turin — distincte de la basilique de Superga ci-dessus.

### `international-talents-unibo.jpg` — International Talents @Unibo, Italie

- **Photographe** : Michael Shtern (`@mic222`)
- **Source** : `https://unsplash.com/photos/A3zfPHoiJw4` (identifiant CDN `photo-1786347583011-c5902e885aba`) — le Palazzo d'Accursio illuminé, Piazza Maggiore, Bologne.

### `unibo-phd-scholarship.jpg` — Unibo PhD Scholarship, Italie

- **Photographe** : Lukas Kienzler (`@beamehr`)
- **Source** : `https://unsplash.com/photos/B9QjERkQTQw` (identifiant CDN `photo-1740046305708-f5f4137061fd`) — les portiques de Bologne — distincts de la Piazza Maggiore ci-dessus, symbole propre à l'université la plus ancienne d'Europe.

### `italian-government-scholarship.jpg` — Italian Government Scholarship, Italie

- **Photographe** : Daniel Zbroja (`@danzbroja`)
- **Source** : `https://unsplash.com/photos/xvBRZB4ejuc` (identifiant CDN `photo-1693824112057-4004bf54d328`) — Piazza Navona, Rome — bourse nationale, symbole de la capitale plutôt que d'une université précise.

### `laziodisco-scholarship.jpg` — LazioDisco Scholarship, Italie

- **Photographe** : Sergei Wing (`@sergeiwing`)
- **Source** : `https://unsplash.com/photos/LfvMS4zG1Do` (identifiant CDN `photo-1565854713475-6e297773a53f`) — la fontaine de Trevi, Rome.

### `sapienza-phd-scholarship.jpg` — Sapienza PhD Scholarship, Italie

- **Photographe** : Federico Di Dio photography (`@didiofederico_photographer`)
- **Source** : `https://unsplash.com/photos/-pNR_o7mpOY` (identifiant CDN `photo-1632660355458-aad5ca27d138`) — le Panthéon, Rome — distinct de Piazza Navona et de la fontaine de Trevi ci-dessus.

### `campania-regional-scholarship.jpg` — Campania Regional Scholarship, Italie

- **Photographe** : Europeana (`@europeana`)
- **Source** : `https://unsplash.com/photos/ZCD5DLkygkc` (identifiant CDN `photo-1717446871120-7a50254df895`) — ruines antiques et le Vésuve en arrière-plan — bourse régionale de Campanie.

### `university-of-naples-federico-ii-phd-scholarship.jpg` — University of Naples Federico II PhD Scholarship, Italie

- **Photographe** : Tom Podmore (`@tompodmore86`)
- **Source** : `https://unsplash.com/photos/1zkHXas1GIo` (identifiant CDN `photo-1612698093158-e07ac200d44e`) — la côte amalfitaine — distincte du Vésuve ci-dessus, même région (Campanie), deux vues différentes.

### `dsu-toscana-scholarship.jpg` — DSU Toscana Scholarship, Italie

- **Photographe** : Bogdan Nanescu (`@nanebbb`)
- **Source** : `https://unsplash.com/photos/JluhtRK6nMg` (identifiant CDN `photo-1665053855050-87b69803f863`) — la Torre del Mangia, Piazza del Campo, Sienne — bourse régionale de Toscane, distincte de Florence et Pise ci-dessous (Sienne plutôt que ces deux villes qui ont chacune leur propre bourse universitaire).

### `university-of-florence-phd-scholarship.jpg` — University of Florence PhD Scholarship, Italie

- **Photographe** : Jeff Ackley (`@ackley5`)
- **Source** : `https://unsplash.com/photos/CaKLDwDyWK8` (identifiant CDN `photo-1533071334820-b6b3248c34e9`) — le Ponte Vecchio, Florence.

### `university-of-pisa-phd-scholarship.jpg` — University of Pisa PhD Scholarship, Italie

- **Photographe** : Ludovic Delot (`@delot`)
- **Source** : `https://unsplash.com/photos/VRutk4PINsM` (identifiant CDN `photo-1780054349104-3938b54929cc`) — le Duomo et le baptistère, Piazza dei Miracoli, Pise.

### `university-of-padua-phd-scholarship.jpg` — University of Padua PhD Scholarship, Italie

- **Photographe** : Clovis Wood (`@clo_wd`)
- **Source** : `https://unsplash.com/photos/AB7nfA6aGJ8` (identifiant CDN `photo-1652987362463-78f66c9b175b`) — la basilique Saint-Antoine, Padoue.

### `veneto-regional-scholarship.jpg` — Veneto Regional Scholarship, Italie

- **Photographe** : Francesco La Corte (`@lordfre`)
- **Source** : `https://unsplash.com/photos/7fUY8ByOHZQ` (identifiant CDN `photo-1574795559465-7d953f8874d9`) — Piazza San Marco, Venise — bourse régionale de Vénétie.

### `opera-universitaria-scholarship.jpg` — Opera Universitaria Scholarship, Italie

- **Photographe** : Joshua Kettle (`@joshuakettle`)
- **Source** : `https://unsplash.com/photos/7Sh84H2sJhE` (identifiant CDN `photo-1681477421173-804e57cda0e5`) — la fontaine de la Piazza Duomo, Trente. Opera Universitaria (operauni.tn.it) est l'organisme régional du droit aux études de Trente, un organisme distinct de l'université elle-même — d'où un monument différent de celui ci-dessous.

### `university-of-trento-phd-scholarship.jpg` — University of Trento PhD Scholarship, Italie

- **Photographe** : Joshua Kettle (`@joshuakettle`)
- **Source** : `https://unsplash.com/photos/PJDwyJa0EQI` (identifiant CDN `photo-1681381690171-53b11200fb42`) — vue depuis le château du Buonconsiglio, Trente — distincte de la Piazza Duomo ci-dessus.

## Photos des bourses (lot 17, 2026-08-28) — assets/images/scholarships/

Dernier lot du remplacement des photos de bourse : 3 bourses marocaines retrouvées dans le diagnostic initial (`admin/diag-scholarships.js`) mais absentes du découpage par pays suivi pour les lots 14/15/16 — un oubli signalé et corrigé à la volée. Après ce lot, les 56 bourses du catalogue ont chacune leur propre photo de monument, plus aucune ne retombe sur une photo de ville partagée. Attention à l'existant : `ifrane.jpg` et `benguerir.jpg` (photos d'université) sont déjà utilisées par Al Akhawayn University et UM6P — les 2 bourses concernées ci-dessous utilisent donc d'autres lieux marocains. Voir `admin/expand-catalog-batch17.js` et `scripts/add-lot17-scholarship-photos.ps1`.

Toutes en [Unsplash License](https://unsplash.com/license), même méthode de téléchargement que les lots précédents.

### `bourse-gouvernement-maroc-amci.jpg` — Bourse du Gouvernement du Maroc (AMCI), Maroc

- **Photographe** : Xhiliana (`@xhiliana7`)
- **Source** : `https://unsplash.com/photos/ePPkzDnExt0` (identifiant CDN `photo-1763838546127-f44013ba35a4`) — la tour Hassan, Rabat — bourse gouvernementale, l'AMCI (Agence Marocaine de Coopération Internationale) étant basée dans la capitale.

### `bourses-master-aui.jpg` — Bourses de Master AUI (international), Maroc

- **Photographe** : Zak Ch (`@zack_jones01`)
- **Source** : `https://unsplash.com/photos/JaGoAn1tJ-E` (identifiant CDN `photo-1654442003199-a00a92b11cc7`) — singes magots dans la forêt de cèdres d'Azrou, à côté d'Ifrane — distinct de `ifrane.jpg`, déjà utilisée comme photo de l'Al Akhawayn University.

### `mastercard-foundation-scholars-um6p.jpg` — Programme Mastercard Foundation Scholars (UM6P), Maroc

- **Photographe** : Paul Macallan (`@pemacallan`)
- **Source** : `https://unsplash.com/photos/CFKksjYRSQ8` (identifiant CDN `photo-1597212618440-806262de4f6b`) — le minaret de la Koutoubia, Marrakech, montagnes de l'Atlas enneigées en arrière-plan — distinct de `benguerir.jpg`, déjà utilisée comme photo de l'UM6P (Ben Guerir est à environ 70 km de Marrakech).

## Photos des bourses (lot 25, 2026-08-30) — assets/images/scholarships/

Trente photos ajoutées (déclinaisons `-400w`/`-800w`/`-1200w`/`-1600w`) pour les bourses qui retombaient jusqu'ici sur la photo de la capitale de leur pays. Voir `admin/expand-catalog-batch25.js` et `scripts/add-lot25-scholarship-photos.ps1`.

Toutes en [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditées ici par choix, pour garder la traçabilité de toutes les sources du projet.

**Réserve levée le 2026-09-24** : les photographes et les pages manquaient à ce lot. Ils ont été retrouvés par la recherche du site Unsplash, en retenant seulement le résultat dont l'identifiant CDN est EXACTEMENT celui du fichier.

### `adisu-puglia.jpg` — les trulli d'Alberobello, Italie

- **Photographe** : reisetopia ([@reisetopia](https://unsplash.com/@reisetopia))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/T0H3DS-0BiA` (identifiant CDN `photo-1609948368716-254e2501d243`)

### `aliseo-liguria.jpg` — Manarola, Cinque Terre, Italie

- **Photographe** : Jack Ward ([@jackward](https://unsplash.com/@jackward))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/rknrvCrfS1k` (identifiant CDN `photo-1516483638261-f4dbaf036963`)

### `ardis-friuli-venezia-giulia.jpg` — le front de mer de Trieste, Italie

- **Photographe** : Arno Senoner ([@arnosenoner](https://unsplash.com/@arnosenoner))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/DVsizqdN0Ls` (identifiant CDN `photo-1623878991610-7416bc4e8c6f`)

### `dsu-lombardia-milano-statale.jpg` — la cour de Brera et sa statue de Napoléon, Milan, Italie

- **Photographe** : Alex varela ([@alexvarelo](https://unsplash.com/@alexvarelo))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/qTJOc8lDRg0` (identifiant CDN `photo-1739826084732-1436a8908f20`)

### `edisu-pavia.jpg` — le Ponte Coperto sur le Tessin, Pavie, Italie

- **Photographe** : emanuele piantadosi ([@samuelep90](https://unsplash.com/@samuelep90))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/EvPrXb36xwc` (identifiant CDN `photo-1679098284781-1a211e7636a2`)

### `ergo-emilia-romagna.jpg` — le campanile de Parme, Italie

- **Photographe** : Dima DallAcqua ([@dimadallacqua](https://unsplash.com/@dimadallacqua))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/mXZce6MiExM` (identifiant CDN `photo-1749680195704-f504f55054f9`)

### `invest-your-talent-italy.jpg` — Vérone et l'Adige, Italie

- **Photographe** : Joshua Kettle ([@joshuakettle](https://unsplash.com/@joshuakettle))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/J3aCPmA1adM` (identifiant CDN `photo-1681477443350-45cfe74916e3`)

### `scuola-normale-superiore-phd.jpg` — la tour Guinigi, Lucques, Italie

- **Photographe** : Tom Podmore ([@tompodmore86](https://unsplash.com/@tompodmore86))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/PFQxF5re1_Q` (identifiant CDN `photo-1747593467598-9cf0a9e46f02`)

### `daad-epos.jpg` — les tours de Francfort, Allemagne

- **Photographe** : Matthias Münning ([@muenningmedia](https://unsplash.com/@muenningmedia))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/1xMO86Kejmg` (identifiant CDN `photo-1626447637943-4c9d412fa8cf`)

### `daad-helmut-schmidt-programme.jpg` — l'Elbphilharmonie, Hambourg, Allemagne

- **Photographe** : Jonas Tebbe ([@jonastebbe](https://unsplash.com/@jonastebbe))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/j22K61_1peg` (identifiant CDN `photo-1553547274-0df401ae03c9`)

### `friedrich-ebert-stiftung.jpg` — Heidelberg, son pont et le Neckar, Allemagne

- **Photographe** : Khaled Ali ([@khkar](https://unsplash.com/@khkar))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/YOQyzHQOzRw` (identifiant CDN `photo-1632660609710-ca2ee0c3425b`)

### `heinrich-boell-stiftung.jpg` — la cathedrale de Cologne, Allemagne

- **Photographe** : Andreas Weilguny ([@aweilguny](https://unsplash.com/@aweilguny))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/dvNhfTLVWYs` (identifiant CDN `photo-1608322460360-009ddc765b99`)

### `konrad-adenauer-stiftung.jpg` — Bonn, Allemagne

- **Photographe** : Martti Salmi ([@marttisalmi](https://unsplash.com/@marttisalmi))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/IzWWLp_Q2Rc` (identifiant CDN `photo-1715281762727-daf602648ea4`)

### `rosa-luxemburg-stiftung.jpg` — Leipzig et son beffroi, Allemagne

- **Photographe** : Siegfried Poepperl ([@siegfriedpoepperl](https://unsplash.com/@siegfriedpoepperl))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/wTM38ZnMqjk` (identifiant CDN `photo-1694098141071-8e1322860773`)

### `abe-initiative-jica.jpg` — Yokohama de nuit, Japon

- **Photographe** : Roberto Jr Saldana ([@roberto_j_saldana](https://unsplash.com/@roberto_j_saldana))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/6abEDi5YszQ` (identifiant CDN `photo-1587474064565-922e1178ec8f`)

### `honjo-international-scholarship.jpg` — une pagode de Kyoto, Japon

- **Photographe** : Cosmin Georgian ([@cosmingeorgian](https://unsplash.com/@cosmingeorgian))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/gd3ysFyrsTQ` (identifiant CDN `photo-1578469645742-46cae010e5d4`)

### `jasso-monbukagakusho-honors.jpg` — le chateau d'Osaka, Japon

- **Photographe** : Fahrul Azmi ([@fahrulazmi](https://unsplash.com/@fahrulazmi))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/chTe2CU58L0` (identifiant CDN `photo-1575489129683-4f7d23379975`)

### `jica-sdgs-global-leader.jpg` — le mont Fuji, Japon

- **Photographe** : David Edelstein ([@jlhopes](https://unsplash.com/@jlhopes))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/N4DbvTUDikw` (identifiant CDN `photo-1526481280693-3bfa7568e0f3`)

### `rotary-yoneyama-overseas.jpg` — les daims de Nara, Japon

- **Photographe** : Timo Volz ([@magict1911](https://unsplash.com/@magict1911))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/tEOhkLuqmUI` (identifiant CDN `photo-1550303435-1703d8811aaa`)

### `iheid-scholarships.jpg` — le Palais des Nations, Geneve, Suisse

- **Photographe** : Salya T ([@salyastone](https://unsplash.com/@salyastone))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/VJ6uNHuEnqk` (identifiant CDN `photo-1679589164488-ca6dc6746af9`)

### `unifr-research-scholarships.jpg` — la vieille ville de Fribourg et la Sarine, Suisse

- **Photographe** : Patrick Robert Doyle ([@teapowered](https://unsplash.com/@teapowered))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/j6CsdJ7LIcc` (identifiant CDN `photo-1609770264759-fd0f26b0de92`)

### `unige-excellence-master-fellowships.jpg` — le Jet d'eau de Geneve, Suisse

- **Photographe** : Devam Jhabak ([@devam](https://unsplash.com/@devam))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/PZMNQ7ZlkAw` (identifiant CDN `photo-1633022326182-1b36700bc49a`)

### `unil-master-grants.jpg` — la cathedrale de Lausanne, Suisse

- **Photographe** : katia cuervo ([@studio_drom](https://unsplash.com/@studio_drom))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/gVvF0YAFL9U` (identifiant CDN `photo-1584469728290-46e7760c2d78`)

### `zeno-karl-schindler-master-thesis.jpg` — Berne et les ponts de l'Aar, Suisse

- **Photographe** : Tobias Reich ([@electerious](https://unsplash.com/@electerious))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/HaSP_2rSh_Y` (identifiant CDN `photo-1664459937096-d395cd77f8b8`)

### `diyanet-tdv-international.jpg` — une mosquee ottomane, Turquie

- **Photographe** : Daniel Burka ([@dburka](https://unsplash.com/@dburka))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/oR9ZisoF_NE` (identifiant CDN `photo-1466442929976-97f336a657be`)

### `tubitak-2216-research-fellowship.jpg` — Anitkabir, Ankara, Turquie

- **Photographe** : Thomas George ([@staticxg7](https://unsplash.com/@staticxg7))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/YFZwrwyLBzU` (identifiant CDN `photo-1650802315195-f58a8663c9be`)

### `turkiye-burslari-research.jpg` — les montgolfieres de Cappadoce, Turquie

- **Photographe** : Timur Garifov ([@timgarifov](https://unsplash.com/@timgarifov))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/p2RbLnqWPVY` (identifiant CDN `photo-1604156789095-3348604c0f43`)

### `turkiye-burslari-success.jpg` — la tour de l'Horloge d'Izmir, Turquie

- **Photographe** : Mehmet Korkmaz ([@thewood_man](https://unsplash.com/@thewood_man))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/4T9AXWrh8q8` (identifiant CDN `photo-1701428588034-5893b2512a68`)

### `ytb-isdb-joint-scholarship.jpg` — le dome turquoise du mausolee de Mevlana, Konya, Turquie

- **Photographe** : Hamza Şamil Yavuz ([@hmzsamil](https://unsplash.com/@hmzsamil))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/Y9eVFEELqio` (identifiant CDN `photo-1698852785755-8fa52e11479a`)

### `koica-ciat-scholarship.jpg` — le village de Gamcheon, Busan, Corée du Sud

- **Photographe** : Luke Ow ([@luke_ow](https://unsplash.com/@luke_ow))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/mLKkqlqFiZ4` (identifiant CDN `photo-1672671187899-a10f547341f1`)

#### Substitutions assumées

- **`scuola-normale-superiore-phd`** reçoit **Lucques**, et non Pise. La
  Scuola Normale Superiore est pisane, mais Pise est déjà prise deux fois
  (`pisa.jpg` côté université, et le sujet du lot 16 pour
  `university-of-pisa-phd-scholarship`), et la recherche « Piazza dei
  Cavalieri » n'a rien donné d'exploitable sur Unsplash le 30/08/2026.
- **`ergo-emilia-romagna`** reçoit **Parme**, et non Bologne, déjà prise
  deux fois par le lot 16 pour l'Université de Bologne. Parme est dans la
  même région, ce que la bourse couvre.
- **`diyanet-tdv-international`** reçoit une **mosquée ottomane non
  localisée** : c'est le sujet le moins précis des trente, retenu faute de
  photo exploitable de la mosquée de Bursa. À remplacer si une meilleure
  source apparaît.

## Photos des bourses (lot 26, 2026-08-30) — assets/images/scholarships/

Dix-neuf photos ajoutées (déclinaisons `-400w`/`-800w`/`-1200w`/`-1600w`) pour les bourses qui partageaient la photo de leur université liée avec une autre bourse du même pays. Voir `admin/expand-catalog-batch26.js` et `scripts/add-lot26-scholarship-photos.ps1`.

Toutes en [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Photographes et pages retrouvés le 2026-09-24 comme au lot 25, par l'identifiant CDN exact. Les deux dernières, `reach-oxford-scholarship.jpg` et `hse-into-olympiad.jpg`, ont été retrouvées le même soir par des recherches plus larges (« college », « subway station russia »).

**Correctif lot 27 (2026-08-30)** : trois des dix-neuf identifiants de ce lot reprenaient une photo déjà utilisée ailleurs dans le dépôt (`hse-into-olympiad` ← la Saint-Basile d'`open-doors-scholarship.jpg`, `jads-japan-africa-dream` ← la Shibuya de `waseda.jpg`, `fao-hungarian-government-scholarship` ← le Parlement hongrois de `corvinus.jpg`) — le lot recréait, dans trois pays, exactement le défaut qu'il devait supprimer. Les trois fichiers ont été réécrits avec des photos inédites (`scripts/add-lot27-photo-fixes.ps1`) ; le champ `image` en base n'a pas changé — même nom de fichier — donc aucun lot Firestore n'accompagne ce correctif. Les trois entrées ci-dessous sont celles du lot 27.

**Pourquoi le contrôle du lot 26 ne l'avait pas vu, et le garde-fou à reprendre dans tout futur lot de photos** : le script du lot 26 comparait les tailles des fichiers *du lot* entre eux — deux fichiers de noms différents portant la même photo sont invisibles à ce test dès lors que l'un des deux vient d'un lot antérieur. Le contrôle mesurait un indice (le nom de fichier) et non la chose (l'identifiant de la photo). `scripts/add-lot27-photo-fixes.ps1` ajoute le contrôle qui manquait : avant tout téléchargement, chaque identifiant CDN est cherché dans CE fichier, où toutes les photos du dépôt sont créditées avec le leur ; une occurrence sur une autre bourse arrête le script sans rien écrire. C'est le seul garde-fou qui attrape ce défaut.

### `clarendon-fund-scholarships.jpg` — les toits gothiques d'Oxford vus d'en haut, Royaume-Uni

- **Photographe** : Sidharth Bhatia ([@sidharthbhatia](https://unsplash.com/@sidharthbhatia))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/_QstzxTWnXY` (identifiant CDN `photo-1472121779802-43c68a9f405f`)

### `reach-oxford-scholarship.jpg` — une facade de college d'Oxford, Royaume-Uni

- **Photographe** : Darya Tryfanava ([@darya_tryfanava](https://unsplash.com/@darya_tryfanava))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/d55fhArDES0` (identifiant CDN `photo-1568792923760-d70635a89fdc`)

### `rhodes-scholarships-west-africa.jpg` — un quadrangle d'Oxford et sa pelouse, Royaume-Uni

- **Photographe** : Ray Harrington ([@raymondo600](https://unsplash.com/@raymondo600))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/ZacBgK8SJd8` (identifiant CDN `photo-1642612460433-a5d935c08d73`)

### `weidenfeld-hoffmann-scholarships.jpg` — la pierre blonde d'Oxford sous un ciel bleu, Royaume-Uni

- **Photographe** : Ben Seymour ([@benseymour](https://unsplash.com/@benseymour))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/nqBUTBsDQNM` (identifiant CDN `photo-1612563958093-2c3bcfbd8760`)

### `commonwealth-masters-scholarships.jpg` — Big Ben et le Parlement au couchant, Royaume-Uni

- **Photographe** : Muuw ([@muuw_5272](https://unsplash.com/@muuw_5272))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/4cGMhhONVn8` (identifiant CDN `photo-1745016176874-cd3ed3f5bfc6`)

### `commonwealth-phd-scholarships.jpg` — le London Eye, Royaume-Uni

- **Photographe** : Xavier Coiffic ([@xaviercoiffic](https://unsplash.com/@xaviercoiffic))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/Yh6kKxGyf_A` (identifiant CDN `photo-1546533658-8f1f550b9a4e`)

### `commonwealth-shared-scholarships.jpg` — un pont sur la Tamise, Royaume-Uni

- **Photographe** : Gregoire Jeanneau ([@gregjeanneau](https://unsplash.com/@gregjeanneau))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/kZF170iTgv8` (identifiant CDN `photo-1560709889-eec6771309ff`)

### `imperial-presidents-phd-scholarships.jpg` — une cabine telephonique rouge devant un batiment londonien, Royaume-Uni

- **Photographe** : Stefan K ([@stefankst](https://unsplash.com/@stefankst))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/BDopH1gn4VU` (identifiant CDN `photo-1619447093155-3d646f597c91`)

### `spbu-open-olympiad.jpg` — les fontaines de Peterhof, Saint-Petersbourg, Russie

- **Photographe** : Dimitry B ([@dimitry_b](https://unsplash.com/@dimitry_b))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/pX43I7JF3kI` (identifiant CDN `photo-1610197361600-33a3a5073cad`)

### `hse-into-olympiad.jpg` — une station ornée du métro de Moscou, Russie

- **Photographe** : M IVANOVSKI ([@mw](https://unsplash.com/@mw))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/jdFxOrCS4ac` (identifiant CDN `photo-1741171469811-553adc364411`)
- **Remplacement** : photo posée par le correctif du lot 27 (2026-08-30).

### `hse-merit-scholarships.jpg` — un batiment moscovite reflete dans l'eau, Russie

- **Photographe** : Nikita Tikhomirov ([@niki_mir](https://unsplash.com/@niki_mir))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/H56Byq5KoBE` (identifiant CDN `photo-1561117937-45681fb935ad`)

### `auf-eugen-ionescu.jpg` — la statue equestre de Matthias Corvin, Cluj-Napoca, Roumanie

- **Photographe** : Biro Zoltan ([@zoltanbiro1988](https://unsplash.com/@zoltanbiro1988))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/Pt1a4mFBOOA` (identifiant CDN `photo-1678736680989-195226823176`)

### `auf-petrache-poenaru.jpg` — le palais de la Culture et son horloge, Iasi, Roumanie

- **Photographe** : Andrew Movia ([@movia](https://unsplash.com/@movia))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/Q4H12FybRHs` (identifiant CDN `photo-1710877669376-7633d6f64678`)

### `bourse-george-darie.jpg` — les maisons colorees du centre de Cluj-Napoca, Roumanie

- **Photographe** : Tamas Pap ([@tamasp](https://unsplash.com/@tamasp))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/LC54UhNn95M` (identifiant CDN `photo-1583751636643-94790958040a`)

### `jads-japan-africa-dream.jpg` — un torii rouge sur un chemin forestier, Japon

- **Photographe** : Syuhei Inoue ([@_______life_](https://unsplash.com/@_______life_))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/kaoHI0iHJPM` (identifiant CDN `photo-1601823984263-b87b59798b70`)
- **Remplacement** : photo posée par le correctif du lot 27 (2026-08-30).

### `jj-wbgsp.jpg` — Tokyo vue du ciel, Japon

- **Photographe** : Denys Nevozhai ([@dnevozhai](https://unsplash.com/@dnevozhai))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/6ULy3pxuxL8` (identifiant CDN `photo-1573456373835-579c408de263`)

### `snu-glo-harmony-scholarship.jpg` — un pavillon de palais seoulien, Corée du Sud

- **Photographe** : Brady Bellini ([@brady_bellini](https://unsplash.com/@brady_bellini))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/t5dGNNQVwg8` (identifiant CDN `photo-1448523183439-d2ac62aca997`)

### `fao-hungarian-government-scholarship.jpg` — champs et lac vus du ciel, région du Balaton, Hongrie

- **Photographe** : Balint Miko ([@balint_miko](https://unsplash.com/@balint_miko))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/QaqcmGOr6kE` (identifiant CDN `photo-1725801719382-1e9db44b0066`)
- **Remplacement** : photo posée par le correctif du lot 27 (2026-08-30).

### `epfl-edic-doctoral.jpg` — le campus de l'EPFL et les Alpes, Suisse

- **Photographe** : T Fang ([@tqfang](https://unsplash.com/@tqfang))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/V2jajmreOA4` (identifiant CDN `photo-1699470762437-bd145c9042ee`)

#### Bourses qui conservent leur image partagée

Une par groupe, pour éviter un téléchargement inutile : `mastercard-foundation-afox-oxford` garde `oxford.jpg`, `great-scholarships` garde `london.jpg`, `quota-gouvernement-russe` garde `moscow.jpg`, `politehnica-excellence-scholarship` garde `politehnica-bucuresti.jpg`, `utokyo-fellowship` garde `tokyo.jpg`, `snu-global-scholarship` garde `snu-seoul.jpg`, `ud-international-scholarship` garde `debrecen.jpg`, `epfl-master-excellence-fellowships` garde `lausanne.jpg`.

---

Recadrées et redimensionnées (`scripts/generate-city-srcset.mjs`) à partir des fichiers originaux ci-dessus — le contenu visuel est inchangé, seuls le cadrage (portrait 3:4) et la résolution diffèrent des fichiers sources.

Benguerir et Louvain-la-Neuve ne sont pas recadrées, seulement redimensionnées (2000px pour le fichier de référence, puis 400/800/1200/1600px), avec les mêmes réglages que le script ci-dessus (qualité 92, mozjpeg). Elles ont été générées à part plutôt qu'en le lançant, car il réencode l'intégralité du dossier `cities/` à chaque exécution et aurait touché les quarante autres villes sans raison.

Lausanne et Jeddah ne passent pas non plus par `generate-city-srcset.mjs` : comme `student-preparing.jpg`, leurs déclinaisons sont téléchargées directement aux largeurs voulues depuis le CDN Unsplash (`scripts/add-lot9-city-photos.ps1`), sans recadrage ni passage par `sharp`. Même chose pour les photos des lots 11 (`scripts/add-lot11-unique-photos.ps1`), 13 (`scripts/add-lot13-more-unique-photos.ps1`), 14 (`scripts/add-lot14-scholarship-photos.ps1`), 15 (`scripts/add-lot15-scholarship-photos.ps1`), 16 (`scripts/add-lot16-scholarship-photos.ps1`), 17 (`scripts/add-lot17-scholarship-photos.ps1`), 25 (`scripts/add-lot25-scholarship-photos.ps1`), 26 (`scripts/add-lot26-scholarship-photos.ps1`) et 27 (`scripts/add-lot27-photo-fixes.ps1`) ci-dessus — les lots 14 à 17 et 25 à 27 dans leur propre dossier `assets/images/scholarships/`, distinct de `assets/images/cities/`.

---

## Drapeaux du Rwanda, du Ghana, du Kenya et de l'Égypte (`assets/flags/`, lot 31, 2026-08-30)

`rw.svg` (Rwanda), `gh.svg` (Ghana), `ke.svg` (Kenya) et `eg.svg` (Egypte) proviennent du projet **flag-icons** (Panayiotis Lipiridis), recuperes via jsDelivr (`flag-icons@7.5.0`, dossier `flags/4x3/`).

- **Contenu** : drapeaux du projet flag-icons, de Panayiotis Lipiridis
- **Source** : https://github.com/lipis/flag-icons

- **Licence** : [MIT](https://github.com/lipis/flag-icons/blob/main/LICENSE) — usage commercial autorise.
- **Optimisation** : attribut `id` retire et indentation supprimee, dessin inchange. Le bouclier massai du Kenya et l'aigle de Saladin egyptien sont les traces officiels du projet source, volontairement non redessines — c'est pourquoi `eg.svg` (8,5 Ko) depasse la taille des drapeaux a bandes simples, comme `us.svg` (9,3 Ko) avant lui.

---

## Lot 31 — Afrique (2026-08-30) : Rwanda, Ghana, Kenya, Egypte

Treize photos DISTINCTES (quatre universites a Kigali, deux a Nairobi : chacune la sienne), chaque image regardee avant d'etre retenue et chaque identifiant verifie absent de ce fichier avant telechargement. References plafonnees a 2000px puis declinees en 400/800/1200/1600w (JPEG q92 mozjpeg + WebP + AVIF) par `scripts/add-lot31-photos.mjs` — jamais la taille d'origine servie. Les bourses du lot n'ont pas de photo propre (cascade : photo de l'universite rattachee), sauf Al-Azhar, orpheline volontaire.

### `university-of-rwanda-kigali.jpg` — la skyline du centre de Kigali au couchant

- **Photographe** : Jean Claude Akarikumutima
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/b-HnOOPRfTI` (identifiant CDN `photo-1687986261123-b17f08f2796c`)

### `aims-kigali.jpg` — panorama des collines habitees de Kigali

- **Photographe** : Protais Benjamin MUGENZI
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/K15V22xU1zs` (identifiant CDN `photo-1708772565599-2c4e4b3ed9db`)

### `aims-accra.jpg` — la Black Star Gate (« Freedom and Justice »), place de l'Independance, Accra

- **Photographe** : Ifeoluwa B.
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/-CgUhaShACE` (identifiant CDN `photo-1630386226447-af0a955c1009`)

### `usiu-nairobi.jpg` — les tours du quartier de Westlands, Nairobi, dans la lumiere doree

- **Photographe** : Amani Nation
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/LTh5pGyvKAM` (identifiant CDN `photo-1611348524140-53c9a25263d6`)

### `icipe-nairobi.jpg` — girafe massai devant la skyline de Nairobi (parc national de Nairobi)

- **Photographe** : Grace Nandi
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/7XA8SJ5ODq4` (identifiant CDN `photo-1634662101368-fa8021773862`)

### `auc-cairo.jpg` — felouque sur le Nil, la tour du Caire et la skyline, en paysage

- **Photographe** : Alex Kotomanov
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/987Ds8mF3JM` (identifiant CDN `photo-1720400995876-506098f4c238`)

### `senghor-alexandrie.jpg` — la citadelle de Qaitbay, Alexandrie

- **Photographe** : Juan Nino
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/rdvqTZLaE-k` (identifiant CDN `photo-1633624646814-3a61ed3e2847`)

### `al-azhar-cairo.jpg` — les minarets et le dome de la mosquee Al-Azhar au-dessus des toits, Le Caire, en paysage

- **Photographe** : Yousef Salhamoud
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/1INRvy-Qg5s` (identifiant CDN `photo-1646763143121-1bbf5aaf2f2d`)

Revision du 2026-08-31, apres relecture : quatre photos remplacees. `cmu-africa-kigali` (feu d'artifice, format carre), `auc-cairo` et `al-azhar-cairo` (formats portrait, sujets coupes par le cadre 2:1 des cartes) et `alu-kigali` (meme scene de colline que `aims-kigali` — fichiers distincts n'est pas images distinctes). Les anciennes variantes ont ete supprimees ; regle appliquee aux 13 : ratio vise 3:2 ou plus large, refus sous 1,3.

### `cmu-africa-kigali.jpg` — le dome du Kigali Convention Centre en vue aerienne de jour, quartier mitoyen du campus CMU-Africa

- **Auteur** : Emmanuel Kwizera (Emmanuelkwizera)
- **Licence** : [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.en) — attribution obligatoire, à conserver tant que ce fichier est utilisé.
- **Source** : [File:An aerial of Kigali Convention Center on June 19, 2019. Photo by Emmanuel Kwizera.jpg — Wikimedia Commons](https://commons.wikimedia.org/wiki/File:An_aerial_of_Kigali_Convention_Center_on_June_19,_2019._Photo_by_Emmanuel_Kwizera.jpg)

### `alu-kigali.jpg` — Kigali de nuit sous la lune, skyline eclairee

- **Auteur** : Adrien K
- **Licence** : [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/deed.en) — attribution obligatoire, à conserver tant que ce fichier est utilisé.
- **Source** : [File:Kigali2018.jpg — Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Kigali2018.jpg)

### `ashesi-berekuso.jpg` — la cour Archer Cornfield du campus d'Ashesi University, Berekuso, a l'heure bleue

- **Auteur** : Gwumah
- **Licence** : [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.en) — attribution obligatoire, à conserver tant que ce fichier est utilisé.
- **Source** : [File:Ashesi's Archer Cornfield Courtyard.jpg — Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Ashesi%27s_Archer_Cornfield_Courtyard.jpg)

### `knust-kumasi.jpg` — allee commercante arboree du campus de KNUST, Kumasi

- **Auteur** : Jude Hammond
- **Licence** : [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.en) — attribution obligatoire, à conserver tant que ce fichier est utilisé.
- **Source** : [File:Knust campus- Commercial area.jpg — Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Knust_campus-_Commercial_area.jpg)

### `jkuat-juja.jpg` — le batiment PAUSTI (Block B) sur le campus de la JKUAT, Juja — le sujet exact de la bourse de l'Universite panafricaine

- **Auteur** : Gedankenstuecke
- **Licence** : [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.en) — attribution obligatoire, à conserver tant que ce fichier est utilisé.
- **Source** : [File:JKUAT - PAUSTI.jpg — Wikimedia Commons](https://commons.wikimedia.org/wiki/File:JKUAT_-_PAUSTI.jpg)

---

## Lot 32 — Italie, Suisse, Russie (2026-08-31)

Onze photos de ville, une par universite du lot. Declinees par `scripts/add-lot32-photos.mjs` (reference 2000px + 400/800/1200/1600w en JPEG q92 mozjpeg, WebP et AVIF) — la taille d'origine n'est jamais servie. Chaque image regardee avant d'etre retenue, chaque identifiant verifie absent de ce fichier, chaque ratio mesure (1,33 minimum : la carte est une fente d'environ 2:1 en object-fit:cover).

QUATRE VILLES ETAIENT DEJA OCCUPEES, et c'est le point de vigilance de ce lot — l'echec du lot 31 etait deux fichiers distincts montrant la meme scene :

- **Milan** : `milan.jpg` (Politecnico) et `bocconi.jpg` (le Duomo) existaient deja -> ici les Navigli, de nuit.
- **Pise** : `pisa.jpg` (Piazza dei Miracoli vue d'en haut) -> ici les quais de l'Arno, sans la tour.
- **Lausanne** : `lausanne.jpg` (toits et lac en automne) -> ici le chateau d'Ouchy.
- **Geneve** recoit DEUX etablissements du lot : le jet d'eau vu du lac (IHEID) et le pont du Mont-Blanc vu d'en haut (UNIGE) — deux cadrages sans rapport.

La garde anti-doublon a ecarte trois candidates deja utilisees, dont le front de mer de Trieste, qui sert deja a `ardis-friuli-venezia-giulia.jpg`.

### `unimi-milan.jpg` — le canal des Navigli a la tombee du jour, Milan

- **Photographe** : Daniel Kirby
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/smCqxgrMeNY` (identifiant CDN `photo-1668784290849-aa5acd24edcd`)

### `pavia.jpg` — le Ponte Coperto sur le Tessin au coucher du soleil, Pavie

- **Photographe** : Isaac Maffeis
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/ZlhTV3OgAG0` (identifiant CDN `photo-1751098663661-da1b55e7e91f`)

### `genes.jpg` — les toits de la vieille ville de Genes et le port au fond

- **Photographe** : Ollie Tulett
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/7Xz2eY-Frg4` (identifiant CDN `photo-1693067038040-044640fad0f7`)

### `bari.jpg` — le Teatro Margherita sur le vieux port de Bari, barques bleues au premier plan

- **Photographe** : Maria Bobrova
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/wNxEJbExriM` (identifiant CDN `photo-1564863756233-e90e6d2f264b`)

### `trieste.jpg` — le Canal Grande de Trieste au crepuscule

- **Photographe** : Alain ROUILLER
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/DeLPPZ4VgNY` (identifiant CDN `photo-1718553124786-473af4238076`)

### `scuola-normale-pise.jpg` — les quais de l'Arno a Pise, lumiere du soir

- **Photographe** : alexey turenkov
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/nYxfMY49PHg` (identifiant CDN `photo-1540685889031-268df9f16803`)

### `iheid-geneve.jpg` — le jet d'eau de Geneve vu du lac, le Saleve en arriere-plan

- **Photographe** : Meizhi Lang
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/kk1ZpooGZqk` (identifiant CDN `photo-1667758682790-c58fa23dc76f`)

### `fribourg.jpg` — la tour de la cathedrale et l'horloge de l'hotel de ville, vieille ville de Fribourg

- **Photographe** : Artan
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/IZtimgrQlHY` (identifiant CDN `photo-1782564173527-0f435c646e72`)

### `unige-geneve.jpg` — le pont du Mont-Blanc et le Rhone vus d'en haut, Geneve

- **Photographe** : Xavier von Erlach
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/yEsQzAhDKQs` (identifiant CDN `photo-1584200463394-bba4b2117e4d`)

### `unil-lausanne.jpg` — le chateau d'Ouchy au bord du Leman, Lausanne

- **Photographe** : Alin Andersen
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/2JyQzpydsV8` (identifiant CDN `photo-1657557494887-59caee68dae8`)

### `saint-petersbourg.jpg` — le palais d'Hiver et la Neva gelee, Saint-Petersbourg

- **Photographe** : Evgenii Zolotarev
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/pj01T3IV_pM` (identifiant CDN `photo-1691583224443-1fefd0afaa51`)

---

## Correctif `milan.jpg` (2026-08-31) — le nom de fichier n'est pas une preuve du sujet

`milan.jpg`, servie pour le Politecnico di Milano, montrait en realite **Vernazza, dans les Cinque Terre**, a 200 km de Milan et sur la cote ligure. Le fichier etait bien nomme, unique, au bon ratio et correctement servi : toutes les gardes automatiques etaient au vert, et l'image etait fausse. Seul un regard sur l'image pouvait l'attraper — c'est exactement le controle qui avait manque.

Remplacee par une vraie vue de Milan, distincte a l'oeil des deux autres images milanaises du catalogue (le Duomo pour Bocconi, les Navigli de nuit pour l'Universita degli Studi au lot 32) : une troisieme scene, donc.

### `milan.jpg` — le Castello Sforzesco et la fontaine de la piazza Castello, Milan

- **Photographe** : Maria Cappelli
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/XsXqM4HmYxc` (identifiant CDN `photo-1602059201105-276c01c1b657`)

Verifiees a la meme occasion, et CORRECTES : `bocconi.jpg` (le Duomo), `pisa.jpg` (la Piazza dei Miracoli et sa tour), `lausanne.jpg` (ville en terrasses au-dessus du Leman, Alpes de Savoie en face).

L'ancienne photo de Vernazza n'est plus referencee nulle part.

---

## Lot 35 — France (2026-09-03)

Cinq photos de ville pour cinq des six etablissements du lot (l'Ecole polytechnique n'en a pas encore : aucune photo libre du campus de Palaiseau trouvee sur Unsplash, piste Wikimedia Commons a suivre — champ `image` vide, repli generique). Declinees par `scripts/add-lot35-photos.mjs` (reference 2000px + 400/800/1200/1600w en JPEG q92 mozjpeg, WebP et AVIF). Chaque image regardee APRES telechargement (le sandbox qui a prepare le lot n'atteint pas le CDN Unsplash), chaque ratio mesure (1,33 minimum).

INCIDENT du premier passage : la candidate initiale pour l'ENS (place du Pantheon, page `3UrP2tmccEc`) etait en PORTRAIT (0,75) ; la garde de ratio a interrompu le script et trois villes n'ont pas ete telechargees, alors que les fiches avaient deja leur champ `image`. Le script a ete repris pour signaler et sauter un refus au lieu de s'arreter, et la candidate remplacee.

PARIS ETAIT DEJA OCCUPEE DEUX FOIS (`paris.jpg` pour Sciences Po, `sorbonne.jpg`) : les deux parisiennes du lot prennent des sujets distincts, le Pantheon (l'ENS est rue d'Ulm, juste derriere) et les tours de la BnF (face au campus des Grands Moulins de Paris Cite).

### `paris-saclay-gif.jpg` — les batiments Gustave-Eiffel et Francis-Bouygues de CentraleSupelec sur le campus de Paris-Saclay, Gif-sur-Yvette

- **Photographe** : Philippe Gras
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/WIHa4vSUKow` (identifiant CDN `photo-1617182926345-205718965035`)

### `ens-ulm-paris.jpg` — la facade et le dome du Pantheon sous un ciel de nuages, Paris

- **Photographe** : Kreshen
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/pF7MZSCYsN4` (identifiant CDN `photo-1565200380227-ede88b62b5a0`)

### `lyon.jpg` — Lyon en vue aerienne : la Saone, le Vieux-Lyon et la colline de Fourviere

- **Photographe** : Willian Justen de Vasconcellos
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/Q8W2RhZgO6U` (identifiant CDN `photo-1682249301492-c117bddca579`)

### `grenoble.jpg` — les « bulles » du telepherique de la Bastille au-dessus de la ville, montagnes enneigees au fond, Grenoble

- **Photographe** : Fabe collage
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/diqJhQtHHNk` (identifiant CDN `photo-1580920950500-597f23bd6f72`)

### `paris-cite-bnf.jpg` — les quatre tours de la BnF Francois-Mitterrand vues du pont de Bercy, en noir et blanc

- **Photographe** : FELIXFELIX FELIX
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/nNqG3PewSGc` (identifiant CDN `photo-1768913124310-d53597c80ea3`)

---

## Lot 35 bis — photos propres des bourses francaises + campus de Polytechnique (2026-09-03)

Rattrapage de la regle du catalogue : chaque bourse porte SA photo (un monument de la ville), chaque universite SA photo de ville, aucune image partagee. Le lot 35 avait laisse huit bourses sur la cascade de repli (photo de l'universite rattachee) — cartes jumelles. Dix images produites par `scripts/add-lot35-photos-bourses.mjs`, chacune regardee apres telechargement (planche des dix, cote a cote), ratios 1,33 a 1,60. Sujets choisis pour ne doubler ni les photos d'universites (Louvre, Sorbonne, Pantheon, BnF, CentraleSupelec, Lyon aerien, bulles de Grenoble) ni la tour Eiffel.

`bourse-emile-boutmy.jpg` est REMPLACEE (elle montrait la pyramide du Louvre, comme `paris.jpg` de Sciences Po : meme monument, deux fichiers) — l'entree precedente de ce fichier pour cette image est caduque.

### `bourse-emile-boutmy.jpg` — le musee d'Orsay vu de la Seine au couchant, Paris

- **Photographe** : T (@t0nn)
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/pYVT_YWvj3Y` (identifiant CDN `photo-1764929316321-a920a59306df`)

### `ens-psl-selection-internationale.jpg` — la facade du palais du Luxembourg et son jardin, Paris

- **Photographe** : Mikael Padeiro
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/s7oVdTjjKhs` (identifiant CDN `photo-1778397277715-5587af2a38a7`)

### `smarts-up-universite-paris-cite.jpg` — la facade de Notre-Dame de Paris sous un ciel charge

- **Photographe** : Marcel Strauß
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/t9yW6tegIRU` (identifiant CDN `photo-1574870310056-79c4b3c7d449`)

### `france-excellence-major.jpg` — l'Arc de Triomphe en contre-plongee, ciel bleu, Paris

- **Photographe** : ian kelsall
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/KX5ZQkluQ9U` (identifiant CDN `photo-1595540089942-545def48cf3e`)

### `programme-bourses-france-senegal.jpg` — les pylones dores du pont Alexandre-III et la verriere du Grand Palais, Paris

- **Photographe** : Sinisa Lekovic
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/arPLE2yYHRU` (identifiant CDN `photo-1747464362908-8bc10e50ca3f`)

### `polytechnique-concours-international-fui.jpg` — le dome dore des Invalides au-dessus des toits, Paris

- **Photographe** : Mikael Padeiro
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/-1v5OV58dm0` (identifiant CDN `photo-1773671334580-5b61c34a7b56`)

### `ens-lyon-ampere-scholarships.jpg` — la basilique de Fourviere sur sa colline boisee, Lyon

- **Photographe** : Salya T
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/zNnpb7NjPBs` (identifiant CDN `photo-1677389931416-9832636048ff`)

### `uga-idex-master-scholarships.jpg` — les facades colorees des quais de l'Isere, Grenoble

- **Photographe** : Christian Attard
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/mKCXxdlAl1A` (identifiant CDN `photo-1720717374256-cb67e1dae73b`)

### `paris-saclay-international-masters-scholarship.jpg` — la cour de Marbre du chateau de Versailles

- **Photographe** : Louis Paulin
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/FUxXFfgbyOU` (identifiant CDN `photo-1667752920461-a5ea0883f438`)

### `polytechnique-palaiseau.jpg` (+ 400/800/1200/1600w en JPEG, WebP et AVIF) — le campus de l'Ecole polytechnique vu du lac, Palaiseau

- **Auteur** : David Monniaux
- **Licence** : [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/deed.en) — attribution obligatoire, à conserver tant que ce fichier est utilisé.
- **Source** : [File:Ecole Polytechnique France seen from lake DSC03389.JPG — Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Ecole_Polytechnique_France_seen_from_lake_DSC03389.JPG)
- **Déclinaisons** : Original 2592x1944 (ratio 1,33), redimensionne a 2000px.

---

## Lot 36 — France, consolidation : 18 photos de ville (2026-09-03)

Dix-huit etablissements, dix-huit photos de ville, aucune image partagee. Sujets choisis pour ne doubler aucun sujet deja en place (Paris : Louvre, Sorbonne, Pantheon, BnF, tour Eiffel, Orsay, Luxembourg, Notre-Dame, Arc de Triomphe, pont Alexandre-III, Invalides ; Lyon : vue aerienne, Fourviere ; Grenoble ; Versailles ; Gif). Produites par `scripts/add-lot36-photos.mjs` (reference 2000px + 400/800/1200/1600w en JPEG q92 mozjpeg, WebP et AVIF), chaque image regardee apres telechargement (planche des dix-huit), ratios 1,46 a 1,78.

### `strasbourg.jpg` — maisons a colombages de la Petite France au bord de l'Ill, Strasbourg

- **Photographe** : Lucile Noiriel
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/Cq4BqP4IYN4` (identifiant CDN `photo-1596036986070-e84592a19917`)

### `marseille.jpg` — le Vieux-Port et ses mats, Marseille

- **Photographe** : Sebastien Devocelle
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/qetNTyxJRcs` (identifiant CDN `photo-1759244569310-0c4fa51434ff`)

### `toulouse.jpg` — la facade du Capitole sur sa place, Toulouse

- **Photographe** : Korng Sok
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/vNyGKzCUfAU` (identifiant CDN `photo-1650707199496-b02442055332`)

### `bordeaux.jpg` — la place de la Bourse reflechie dans le miroir d'eau, Bordeaux

- **Photographe** : Wojciech Rzepka
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/ZtrpZX8ZGx8` (identifiant CDN `photo-1698608216843-67ae1151b2b8`)

### `lille.jpg` — la Vieille Bourse et le beffroi de la chambre de commerce, Grand-Place de Lille

- **Photographe** : Martin Robac
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/riAzFTGPCGc` (identifiant CDN `photo-1764671708519-447591cd8179`)

### `montpellier.jpg` — la place de la Comedie et son opera, Montpellier

- **Photographe** : Hector J. Rivas
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/2DxcRRxedUQ` (identifiant CDN `photo-1666886677737-2cd1f108e080`)

### `nantes.jpg` — le Grand Elephant des Machines de l'ile, Nantes

- **Photographe** : Pascal Bernardon
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/LxJ5FHD495Y` (identifiant CDN `photo-1676283898167-addc4238bee8`)

### `rennes.jpg` — la place du Parlement de Bretagne, Rennes

- **Photographe** : Thanh Ly
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/t3LUVgkXnCg` (identifiant CDN `photo-1724516042952-63ee061f6980`)

### `nancy.jpg` — la place Stanislas et ses grilles dorees, Nancy

- **Photographe** : Gerard GRIFFAY
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/s2bAvgNZ6vI` (identifiant CDN `photo-1614891202431-e4ba6b3d9edb`)

### `nice.jpg` — la baie des Anges et la promenade des Anglais vues de la colline du Chateau, Nice

- **Photographe** : Pierre Goiffon
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/aCkb4PPolGI` (identifiant CDN `photo-1784840232787-74d27de8557c`)

### `lyon-tete-d-or.jpg` (Universite Claude Bernard Lyon 1) — allee de platanes du parc de la Tete d'Or en automne, Lyon

- **Photographe** : Thomas K
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/uvCaQjAPx60` (identifiant CDN `photo-1761144459402-80182d476772`)

### `lyon-bellecour.jpg` (INSA Lyon) — la place Bellecour, la statue de Louis XIV et Fourviere a l'horizon, Lyon

- **Photographe** : Tuan P.
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/3v_bZOM_XTs` (identifiant CDN `photo-1775359226314-d74827afffcb`)

### `paris-sacre-coeur.jpg` (Paris 1 Pantheon-Sorbonne) — la basilique du Sacre-Coeur entre les arbres, Montmartre

- **Photographe** : DAVID TAPIA SAN MARTIN
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/NgiEm-SbXZg` (identifiant CDN `photo-1561370665-7e266065fce1`)

### `paris-fondation-louis-vuitton.jpg` (Dauphine-PSL) — les voiles de verre de la Fondation Louis Vuitton, bois de Boulogne

- **Photographe** : Louis Colbee
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/N_2OP0Ul7us` (identifiant CDN `photo-1597041151430-e11bed3c1973`)

### `paris-pont-neuf.jpg` (Mines Paris-PSL) — le Pont-Neuf et la pointe de l'ile de la Cite au couchant, Paris

- **Photographe** : Bastien Nvs
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/SkgPTTk_eXE` (identifiant CDN `photo-1624209060513-2b1b76ed0caa`)

### `hec-jouy-en-josas.jpg` — le chateau du campus HEC Paris, facade sud, Jouy-en-Josas

- **Auteur** : DXR
- **Licence** : [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.en) — attribution obligatoire, à conserver tant que ce fichier est utilisé.
- **Source** : [File:Chateau, HEC Paris, Jouy-en-Josas, South view 20160501 1.jpg — Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Chateau,_HEC_Paris,_Jouy-en-Josas,_South_view_20160501_1.jpg)
- **Déclinaisons** : Original 7184x4908 (ratio 1,46), redimensionne a 2000px.

### `essec-cergy.jpg` — le batiment principal du campus ESSEC, Cergy

- **Auteur** : Rdavout (attribution presumee d'apres la mention de copyright du fichier, aucun auteur lisible par machine)
- **Licence** : [CC BY-SA 2.5](https://creativecommons.org/licenses/by-sa/2.5/deed.en) — attribution obligatoire, à conserver tant que ce fichier est utilisé.
- **Source** : [File:ESSEC campus cergy.jpg — Wikimedia Commons](https://commons.wikimedia.org/wiki/File:ESSEC_campus_cergy.jpg)
- **Déclinaisons** : Original 2560x1704 (ratio 1,50), redimensionne a 2000px.

### `saint-denis-basilique.jpg` (Sorbonne Paris Nord) — l'abbaye de Saint-Denis, son jardin a la francaise et le transept sud de la basilique, Saint-Denis

- **Auteur** : MOSSOT
- **Licence** : [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.en) — attribution obligatoire, à conserver tant que ce fichier est utilisé.
- **Source** : [File:Saint-Denis - Basilique Saint-Denis et l'abbaye -2.JPG — Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Saint-Denis_-_Basilique_Saint-Denis_et_l%27abbaye_-2.JPG)
- **Déclinaisons** : Original 4896x3672 (ratio 1,33), redimensionne a 2000px. Remplace `saint-denis-stade-de-france.jpg` (interieur du stade, refuse le 2026-09-03) — les fichiers `saint-denis-stade-de-france*` ne sont plus references : a supprimer du depot.

---

## Drapeaux de la Tunisie et de l'Algérie (`assets/flags/`, lot 37, 2026-09-03)

`tn.svg` (Tunisie) et `dz.svg` (Algerie) proviennent du projet **flag-icons** (Panayiotis Lipiridis), tarball npm `flag-icons@7.5.0`, dossier `flags/4x3/`. Licence [MIT](https://github.com/lipis/flag-icons/blob/main/LICENSE). Attribut `id` retire et indentation supprimee, dessin inchange (meme traitement que rw/gh/ke/eg au lot 31).

- **Contenu** : drapeaux du projet flag-icons, de Panayiotis Lipiridis
- **Licence** : [MIT](https://github.com/lipis/flag-icons/blob/main/LICENSE) — usage commercial autorisé.
- **Source** : https://github.com/lipis/flag-icons

---

## Lot 37 — Tunisie, Algerie, PAUWES (2026-09-03) : 9 photos de ville + 3 monuments

Regle du catalogue appliquee des le lot : une photo de ville par universite (`assets/images/cities/`, JPEG + WebP + AVIF), un monument par bourse (`assets/images/scholarships/`, JPEG seul), aucune image partagee. Produites par `scripts/add-lot37-photos.mjs` (listes de candidats Unsplash puis Commons, garde de ratio 1,3), chaque image regardee apres telechargement. Deux candidates Unsplash ECARTEES apres examen : Tlemcen `FlRrOkGxAck` (mur de maison anonyme) et Oran `vEob3rMRUcQ` (cour a arcades non identifiable) ; trois fichiers Commons de Tlemcen ecartes par la garde de ratio (portraits).

### `tunis.jpg` — facade pavoisee de Bab Bhar, centre de Tunis

- **Photographe** : Hammami Ghazi
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/6XuI9V3C51I` (identifiant CDN `photo-1674764186749-ad9beea35e85`)

### `carthage.jpg` (Universite de Carthage) — les ruines romaines de Carthage face a la mer

- **Photographe** : Martin Casagrand
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/5jaj-mU6VW0` (identifiant CDN `photo-1728361328876-74e396d3defc`)

### `sousse.jpg` — la medina et le ribat de Sousse en vue aerienne

- **Photographe** : Amal Bourkhis
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/V87fJdumBY0` (identifiant CDN `photo-1624921768886-5d12e2cdc584`)

### `sfax.jpg` — les toits de la medina de Sfax

- **Photographe** : Taha Loukil
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/WFhrK6g1DKA` (identifiant CDN `photo-1594424015009-59bef65fa9ec`)

### `alger-baie.jpg` (USTHB) — la baie d'Alger vue des hauteurs

- **Photographe** : Sid Ahmed SAOUD
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/RCsOlTBX5Tw` (identifiant CDN `photo-1652614706616-a49396a2ee29`)

### `alger-centre.jpg` (Universite d'Alger 1) — place et escaliers d'Alger-Centre

- **Photographe** : Ondrej Bocek
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/YcJjjAv1TA0` (identifiant CDN `photo-1751788109158-a46f8fbacc08`)

### `constantine.jpg` — pont suspendu et gorges du Rhummel, Constantine

- **Photographe** : zenad nabil
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/fvqCkzsWv-4` (identifiant CDN `photo-1664403775784-8a0b32536a0c`)

### `oran.jpg` — Oran, son port et le clocher de Santa Cruz

- **Photographe** : Brahim Abderrahman
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/jGlnjl6fHhQ` (identifiant CDN `photo-1653815129496-445487ae0479`)

### `bourses-cooperation-tunisie.jpg` — Sidi Bou Said, blanc et bleu au-dessus de la mer

- **Photographe** : Noelle Guirola
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/5NqUXa6pZDM` (identifiant CDN `photo-1607869861980-da5f9b8b4969`)

### `bourses-cooperation-algerie.jpg` — le Maqam Echahid (memorial du Martyr), Alger

- **Photographe** : Halima Bouchouicha
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/ESkI6T_Ef5A` (identifiant CDN `photo-1658996403259-5a2dd3efc6fa`)

### `pan-african-university-pauwes.jpg` — le minaret de Mansourah, Tlemcen

- **Photographe** : Halima Bouchouicha
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/ysL_MNXjJ_4` (identifiant CDN `photo-1669097564242-3c6c75aea9a0`)

### `tlemcen.jpg` (Universite Abou Bekr Belkaid) — la muraille crenelee de Mansourah, Tlemcen

- **Auteur** : Sambott27
- **Licence** : [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/deed.en) — attribution obligatoire, à conserver tant que ce fichier est utilisé.
- **Source** : [File:Muraille de mansourah,Tlemcen..jpg — Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Muraille_de_mansourah,Tlemcen..jpg)
- **Déclinaisons** : Original 3615x1930 (ratio 1,87), redimensionne a 2000px.

## Lot 76-77 — Maroc et Canada (2026-09-24) : 31 photos de ville

Une photo par ville (`assets/images/cities/`, JPEG + WebP + AVIF, déclinaisons `-400w`/`-800w`/`-1200w`/`-1600w`), produites par `scripts/add-lot76-photos.mjs`. Chaque image regardée après téléchargement. Deux fichiers proviennent de Wikimedia Commons (licence CC à attribution obligatoire) ; les vingt-neuf autres, d'Unsplash.

### `fes-medina-vue-d-en-haut.jpg` — les toits de la médina de Fès vus d'en haut

- **Photographe** : Selina Bubendorfer
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/e-6LEkIUvAw` (identifiant CDN `photo-1585213303814-2ca9c6bcb400`)

### `fes-tanneries-chouara.jpg` — les cuves de teinture des tanneries de Fès

- **Photographe** : Nichika Sakurai
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/ZQaEb6kbMhk` (identifiant CDN `photo-1767936925033-9a5b59925613`)

### `kenitra-avenue-mohammed-v.jpg` — l'avenue Mohammed-V, centre de Kénitra

- **Photographe** : Katantuk
- **Licence** : [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/deed.en)
- **Source** : [File:Kenitra Avenue Mohamed V.JPG — Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Kenitra_Avenue_Mohamed_V.JPG)

### `oujda-bab-el-gharbi.jpg` — la place Bab el Gharbi, Oujda

- **Photographe** : Iznassen
- **Licence** : [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/deed.en)
- **Source** : [File:Oujda. place de bab al gharbi.jpg — Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Oujda._place_de_bab_al_gharbi.jpg)

### `tetouan-ville-blanche.jpg` — maisons blanches et coupole, Tétouan

- **Photographe** : Maddie Leopardo
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/egd0IU4wVy0` (identifiant CDN `photo-1579894461465-e8cdbe670cd1`)

### `agadir-plage-et-baie.jpg` — la plage d'Agadir et sa colline

- **Photographe** : SnapSaga
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/7MzuWztc8kY` (identifiant CDN `photo-1710092538995-4af0c11a3f3c`)

### `el-jadida-theatre-mohamed-afifi.jpg` — le théâtre Mohamed Afifi, El Jadida

- **Photographe** : AYOUB OUAZIZI
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/hOUO9K73kjw` (identifiant CDN `photo-1652336019253-249003bf441f`)

### `meknes-remparts.jpg` — les remparts de Meknès

- **Photographe** : Tomasz Anusiewicz
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/EK4gB5I6HWU` (identifiant CDN `photo-1706793989006-f0238c69f4a2`)

### `settat-monument-du-cheval.jpg` — le monument du cheval, Settat

- **Photographe** : oussama laabidate
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/e6OvVi1vzkI` (identifiant CDN `photo-1704129656777-91194f1ddf40`)

### `beni-mellal-vue-des-hauteurs.jpg` — Béni Mellal vue d'une colline

- **Photographe** : Oussama Abouchatir
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/e-z4GQpC43k` (identifiant CDN `photo-1652720187538-b1894af2dc35`)

### `rabat-kasbah-des-oudayas.jpg` — la plage de Rabat au pied de la kasbah des Oudayas

- **Photographe** : Sheila C
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/rOlf7H5kALM` (identifiant CDN `photo-1758441011898-4e0e93c1942f`)

### `rabat-sale-marina-du-bouregreg.jpg` — la marina du Bouregreg, côté Salé

- **Photographe** : Souhail BIDA
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/Y-yQ5pEoP6o` (identifiant CDN `photo-1634324708844-7dd4b01b9191`)

### `casablanca-centre-ville-vu-d-en-haut.jpg` — les toits et immeubles de Casablanca

- **Photographe** : Barry Talley
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/hr31kfHe0Ao` (identifiant CDN `photo-1693532088390-d278b7cefed0`)

### `casablanca-quartier-des-habous.jpg` — une rue du quartier des Habous, Casablanca

- **Photographe** : Thales Botelho de Sousa
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/9JwZJD2-eew` (identifiant CDN `photo-1710211653847-d9a1657b0044`)

### `quebec-chateau-frontenac.jpg` — le Château Frontenac, Québec

- **Photographe** : Robert Macleod
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/w3xwKSSsFh4` (identifiant CDN `photo-1691516094855-809c50352aad`)

### `montreal-oratoire-saint-joseph.jpg` — l'oratoire Saint-Joseph, Montréal

- **Photographe** : Ahmed Neji
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/vmff7d4g578` (identifiant CDN `photo-1592927857753-74e95148e02e`)

### `montreal-quartier-des-spectacles.jpg` — le Quartier des spectacles, Montréal

- **Photographe** : Dmitri M
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/GItUM-nHVpw` (identifiant CDN `photo-1713274843857-84ac856d8471`)

### `montreal-pont-jacques-cartier.jpg` — le pont Jacques-Cartier, Montréal

- **Photographe** : Pascal Bernardon
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/ni1ZCLFrcoY` (identifiant CDN `photo-1573492614524-e526f7f14b92`)

### `montreal-stade-olympique.jpg` — la tour du Stade olympique, Montréal

- **Photographe** : Jonathan Gagnon
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/X2OWQ3_pijc` (identifiant CDN `photo-1741924831592-64c4c907122d`)

### `montreal-canal-de-lachine.jpg` — le canal de Lachine et le marché Atwater, Montréal

- **Photographe** : Pascal Bernardon
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/gu3jDlYzh4E` (identifiant CDN `photo-1699719506497-e941ad8f9701`)

### `montreal-habitat-67.jpg` — Habitat 67, Montréal

- **Photographe** : philippe collard
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/gSF2C2cuI34` (identifiant CDN `photo-1576443730831-02377debbff3`)

### `sherbrooke-vue-panoramique.jpg` — Sherbrooke dans sa vallée

- **Photographe** : Adrien (add_rien_20)
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/BWImWnGf40M` (identifiant CDN `photo-1652152026826-f7ceb8618422`)

### `trois-rivieres-pont-laviolette.jpg` — le pont Laviolette, Trois-Rivières

- **Photographe** : Patrice S Dorsainville
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/sUZ8XIruxnw` (identifiant CDN `photo-1778693640973-9b44990875dd`)

### `saguenay-chicoutimi-riviere-saguenay.jpg` — Chicoutimi reflété dans la rivière Saguenay

- **Photographe** : Andre Ouellet
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/0FMvE6nO34o` (identifiant CDN `photo-1607122997098-5315d01e15b3`)

### `rimouski-parc-du-bic.jpg` — le parc du Bic au bord du Saint-Laurent, Rimouski

- **Photographe** : Eric Parenteau
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/THhNS4SRJxI` (identifiant CDN `photo-1731780029485-a1ed06d4f732`)

### `gatineau-musee-canadien-histoire.jpg` — le Musée canadien de l'histoire, Gatineau

- **Photographe** : snap shoot (s_napshoot)
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/tscxlKO4so0` (identifiant CDN `photo-1687710413165-090b41377237`)

### `ottawa-canal-rideau.jpg` — le canal Rideau gelé, Ottawa

- **Photographe** : Caio Fernandes
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/mlLoSetZABg` (identifiant CDN `photo-1727529802175-318920001940`)

### `moncton-centre-ville.jpg` — le centre-ville de Moncton et sa tour de l'horloge

- **Photographe** : Dat Tran
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/rw9I-b2o6bQ` (identifiant CDN `photo-1716668295838-a56cff6c641b`)

### `winnipeg-la-fourche-riviere-rouge.jpg` — la rivière Rouge et le centre de Winnipeg

- **Photographe** : Cohen Berg
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/uzp3jisBY7Y` (identifiant CDN `photo-1764276128259-15b02d37c3d8`)

### `edmonton-vallee-saskatchewan-nord.jpg` — la vallée de la Saskatchewan Nord et Edmonton

- **Photographe** : Derek Otway
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/PrmS75_I2QI` (identifiant CDN `photo-1656638706997-11ec84e134d9`) — photo très panoramique (ratio 2,76) : plus de ciel sur les bords qu'une photo de ville habituelle du catalogue, à surveiller au premier regard sur la carte.

### `toronto-hotel-de-ville-nathan-phillips.jpg` — le Nathan Phillips Square et l'hôtel de ville, Toronto

- **Photographe** : Photostore HK
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/NdTG0o-uZ5M` (identifiant CDN `photo-1573452996379-d0e623356520`)

## Photos de ville les plus anciennes : crédits retrouvés le 2026-09-24

Quarante et une photos de ville du catalogue, posées avant le lot 11, n'avaient AUCUNE entrée dans ce fichier. Aucune métadonnée dans les fichiers (seulement des profils de couleur), aucun historique lisible : leur source a été recherchée image par image sur Unsplash, le 2026-09-24. Méthode : pour chaque ville, les résultats de la recherche du site sont comparés au fichier par une empreinte visuelle (hachage de différences 8x8, puis 16x16) et par le rapport largeur/hauteur de l'original. Une photo n'est retenue que si les deux empreintes coïncident à quelques bits près, là où deux images sans rapport diffèrent de la moitié des bits. Vingt-trois sont retrouvées ci-dessous. Les seize autres n'ont pas été retrouvées : plutôt qu'un crédit inventé, elles ont été remplacées par des photos sourcées, créditées plus bas.

### `ankara.jpg` (Bilkent University) — la citadelle d'Ankara et son drapeau

- **Photographe** : Cengiz Özarpat ([@cengizozarpat](https://unsplash.com/@cengizozarpat))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/ozW-I1FsDxc` (identifiant CDN `photo-1728113278031-30d24597673d`)

### `berlin.jpg` (Humboldt-Universität zu Berlin) — une rue de Berlin et son tramway

- **Photographe** : Birk Enwald ([@birkenwald](https://unsplash.com/@birkenwald))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/Uyc-eSjCVF8` (identifiant CDN `photo-1657709890753-e389c0700265`)

### `bologna.jpg` (Università di Bologna) — les toits de Bologne vus d'en haut

- **Photographe** : Felix M. Dorn ([@allaperto](https://unsplash.com/@allaperto))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/9ndxwqoZNj4` (identifiant CDN `photo-1558477280-b16731651f21`)

### `brussels.jpg` (Université Libre de Bruxelles) — les façades de la Grand-Place, Bruxelles

- **Photographe** : Alex Vasey ([@alexrvasey](https://unsplash.com/@alexrvasey))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/v5j_fxYUwaI` (identifiant CDN `photo-1572886071978-7c60b5b3e506`)

### `daejeon.jpg` (KAIST) — la tour Hanbit du parc de l'Expo, Daejeon

- **Photographe** : Juwhan Yu ([@yoofan](https://unsplash.com/@yoofan))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/8AaYqXalJqs` (identifiant CDN `photo-1663038509302-a20dc8a24ad8`)

### `edinburgh.jpg` (University of Edinburgh) — le monument Dugald Stewart sur Calton Hill, Édimbourg

- **Photographe** : Julia Solonina ([@julie_soul](https://unsplash.com/@julie_soul))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/NSFoU92bD_Y` (identifiant CDN `photo-1571044880241-95d4c9aa06f5`)

### `ghent.jpg` (Ghent University) — les tours de Gand

- **Photographe** : Christian Lue ([@christianlue](https://unsplash.com/@christianlue))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/k1E6994P3t8` (identifiant CDN `photo-1606755767976-498efc6c5a4e`)

### `guangzhou.jpg` (Sun Yat-sen University) — les tours de Guangzhou

- **Photographe** : Loeng Lig ([@loenglig](https://unsplash.com/@loenglig))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/v5TwMWDaHDI` (identifiant CDN `photo-1583996829982-823143cc975a`)

### `gyor.jpg` (Széchenyi István University) — l'hôtel de ville de Győr

- **Photographe** : Aleksei Tertychnyi ([@pinelab](https://unsplash.com/@pinelab))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/T-959bcmKL4` (identifiant CDN `photo-1694357463215-90f275631997`)

### `hamburg.jpg` (Universität Hamburg) — un clocher de Hambourg vu par une fenêtre

- **Photographe** : Julia Solonina ([@julie_soul](https://unsplash.com/@julie_soul))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/LACHGS9fKmc` (identifiant CDN `photo-1552325476-5df397d5b547`)

### `hangzhou.jpg` (Zhejiang University) — le lac de l'Ouest et les tours de Hangzhou

- **Photographe** : 一只猫的橘 ([@seelean](https://unsplash.com/@seelean))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/bF2WOPepves` (identifiant CDN `photo-1696162605544-9ff69aef6c35`)

### `hannover.jpg` (Leibniz Universität Hannover) — le Welfenschloss, bâtiment principal de l'université, Hanovre

- **Photographe** : Lu Moreno ([@lumrn](https://unsplash.com/@lumrn))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/Ny2mrBjwROI` (identifiant CDN `photo-1662555500038-3d9ed651fc06`)

### `harbin.jpg` (Harbin Institute of Technology) — le parc de glace et de neige de Harbin

- **Photographe** : lin zhaohai ([@haydenlllam](https://unsplash.com/@haydenlllam))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/HjnrjKUUhlY` (identifiant CDN `photo-1716308352490-271359910f14`)

### `koc-istanbul.jpg` (Koç University) — la forteresse de Rumeli Hisarı sur le Bosphore, Istanbul

- **Photographe** : Seval Torun ([@sevaltorun](https://unsplash.com/@sevaltorun))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/hlyhoh9aZFk` (identifiant CDN `photo-1713124725466-7f23dca6d725`)

### `liege.jpg` (Université de Liège) — la tour des Finances, Liège

- **Photographe** : Henri Viatour ([@henriskk](https://unsplash.com/@henriskk))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/of2gRDyEBwA` (identifiant CDN `photo-1631553071797-19d0bdefe519`)

### `miskolc.jpg` (University of Miskolc) — le palais de Lillafüred dans la brume, Miskolc

- **Photographe** : Ádám Berkecz ([@aberkecz](https://unsplash.com/@aberkecz))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/c_275koBV-4` (identifiant CDN `photo-1579988936083-16d8215bb12e`)

### `padova.jpg` (Università di Padova) — le Prato della Valle, Padoue

- **Photographe** : Clovis Wood ([@clo_wd](https://unsplash.com/@clo_wd))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/Jxgo97_mWPg` (identifiant CDN `photo-1652987363943-5c7a2e6e18ae`)

### `pecs.jpg` (University of Pécs) — la cathédrale de Pécs et ses quatre tours

- **Photographe** : Anna Spoljar ([@annaspoljar](https://unsplash.com/@annaspoljar))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/gcdL8avuyaY` (identifiant CDN `photo-1661975782597-6fc5aafce028`)

### `sabanci-istanbul.jpg` (Sabancı University) — le Bosphore et la mosquée de Çamlıca, Istanbul

- **Photographe** : Dmitry Fomin ([@dafomin](https://unsplash.com/@dafomin))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/TSMVU9lQXp4` (identifiant CDN `photo-1787159757933-f42553258cb2`)

### `tianjin.jpg` (Tianjin University) — les tours de Tianjin au crépuscule

- **Photographe** : Julius Carmine ([@juliuscarmine](https://unsplash.com/@juliuscarmine))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/o_fSNj4IAMI` (identifiant CDN `photo-1706498133899-f1cf5a6af53e`)

### `turin.jpg` (Politecnico di Torino) — la Mole Antonelliana et les Alpes, Turin

- **Photographe** : Fabio Fistarol ([@fabiofistarol](https://unsplash.com/@fabiofistarol))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/VjA_PSSsOHI` (identifiant CDN `photo-1610651219730-6b580d616e72`)

### `vancouver.jpg` (University of British Columbia) — Coal Harbour et les tours de Vancouver dans l'eau

- **Photographe** : Mike Benna ([@mbenna](https://unsplash.com/@mbenna))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/WHHY-iBp3aI` (identifiant CDN `photo-1559511260-66a654ae982a`)

### `xiamen.jpg` (Xiamen University) — les tours de Xiamen et la mer

- **Photographe** : Woo Winter ([@yunyingwin](https://unsplash.com/@yunyingwin))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/T_e8pMv8vsQ` (identifiant CDN `photo-1683967494331-bd98da74fc50`)

### Seize photos sans source, remplacées le 2026-09-24 (lot 81)

Seize fichiers restaient sans source après cette recherche. Ils ont été remplacés, sous le même nom, par des photos dont la fiche Unsplash donne l'auteur et le lieu, chacune regardée avant et après téléchargement par `scripts/add-lot81-photos.mjs`. Deux d'entre elles avaient en plus un sujet faible : `porto.jpg` (un immeuble vu d'un parking) et `wuhan.jpg` (des pagodes jumelles qu'on ne pouvait pas rattacher à Wuhan). Deux autres fichiers montraient une AUTRE ville et ont été remplacés par le lot 80, crédité plus bas : `godollo.jpg` (Esztergom) et `szeged.jpg` (Budapest).

### `capetown.jpg` (University of Cape Town) — Le Cap, la montagne de la Table et le stade vus du ciel

- **Photographe** : Tobias Reich
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/1GgWbP74phY` (identifiant CDN `photo-1580060839134-75a5edca2e99`)

### `chengdu.jpg` (Sichuan University) — le pont Anshun et les tours de Chengdu

- **Photographe** : pengfei Jin
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/NumSJRpNUc8` (identifiant CDN `photo-1725076021478-173130f22f06`)

### `gothenburg.jpg` (University of Gothenburg) — le Stora Hamnkanalen et ses façades, Göteborg

- **Photographe** : Hans Ott
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/TqeGF4M-Jqk` (identifiant CDN `photo-1662067164467-4a3f303f4824`)

### `hefei.jpg` (University of Science and Technology of China) — les tours de Hefei

- **Photographe** : Francisco Kemeny
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/imYKxcVODCc` (identifiant CDN `photo-1597006419785-f77591f53d75`)

### `johannesburg.jpg` (University of the Witwatersrand) — les tours du centre de Johannesburg

- **Photographe** : Simon Hurry
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/_h-L45TSmGM` (identifiant CDN `photo-1636706519609-988babca3dd5`)

### `karts-seoul.jpg` (K-Arts) — une ruelle de maisons traditionnelles à Anguk, Séoul

- **Photographe** : Elliot Gouy
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/cv3rLk4aNvc` (identifiant CDN `photo-1703825864792-5880081beaaf`)

### `krakow.jpg` (Jagiellonian University) — la place du Marché et la halle aux draps, Cracovie

- **Photographe** : Tomasz Zielonka
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/Uuhv9tA9eOI` (identifiant CDN `photo-1699791915109-c227726d2457`)

### `leuven.jpg` (KU Leuven) — l'hôtel de ville de Louvain

- **Photographe** : Winston Tjia
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/YXnXW6qTqgg` (identifiant CDN `photo-1684698769392-c6404a6427cb`)

### `lisbon.jpg` (University of Lisbon) — la place du Commerce, Lisbonne

- **Photographe** : Claudio Schwarz
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/K3XGEoZgA0s` (identifiant CDN `photo-1548707309-dcebeab9ea9b`)

### `marrakech.jpg` (Université Cadi Ayyad) — la place Jemaa el-Fna, Marrakech

- **Photographe** : CALIN STAN
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/7a_PHX91su8` (identifiant CDN `photo-1587974928442-77dc3e0dba72`)

### `namur.jpg` (Université de Namur) — Namur vue d'en haut

- **Photographe** : Alex Vasey
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/f5Y3y1d_lic` (identifiant CDN `photo-1604413287507-b74b4e05cbad`)

### `pohang.jpg` (POSTECH) — la main de bronze de Homigot sortant de la mer, Pohang

- **Photographe** : Drew Bae
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/GW6t6MKqbiM` (identifiant CDN `photo-1634805249588-48152bc9f729`)

### `porto.jpg` (University of Porto) — le pont Dom-Luís-Ier et les barques du Douro, Porto

- **Photographe** : Nick Karvounis
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/6ckFibuzLAU` (identifiant CDN `photo-1555881400-89d5a9c86668`)

### `stockholm.jpg` (KTH Royal Institute of Technology) — Riddarholmen et ses reflets, Stockholm

- **Photographe** : Ana Bórquez
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/uF4PfwZPOR8` (identifiant CDN `photo-1588653818221-2651ec1a6423`)

### `warsaw.jpg` (University of Warsaw) — la place du Château et la colonne de Sigismond, Varsovie

- **Photographe** : Lāsma Artmane
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/p6gxHYb43v0` (identifiant CDN `photo-1577133192629-5140c5371590`)

### `wuhan.jpg` (Wuhan University) — la tour de la Grue jaune, Wuhan

- **Photographe** : Bo Zhang
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/C2z6-TWsooU` (identifiant CDN `photo-1682082286090-0c8651b52004`)

## Lot 80 : deux photos de ville remplacées (2026-09-24)

`godollo.jpg` montrait Esztergom et `szeged.jpg` montrait Budapest. Les deux fichiers sont réécrits sous le même nom par `scripts/add-lot80-photos.mjs`, puis regardés avant d'être crédités.

### `godollo.jpg` (Hungarian University of Agriculture and Life Sciences) — le palais royal de Gödöllő, vu de sa cour arrière

- **Photographe** : Linda Gerbec ([@lsgerbec](https://unsplash.com/@lsgerbec))
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/J8z_McvlZEQ` (identifiant CDN `photo-1660987286221-6e74fd13d731`)

### `szeged.jpg` (University of Szeged) — l'église votive et la place du Dôme, Szeged

- **Auteur** : Pasztilla aka Attila Terbócs
- **Licence** : [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.en) — attribution obligatoire, à conserver tant que ce fichier est utilisé.
- **Source** : [File:Szeged, Dóm tér 2021 01.jpg — Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Szeged,_D%C3%B3m_t%C3%A9r_2021_01.jpg)
- **Déclinaisons** : original 2400x1600 (ratio 1,50), redimensionné à 2000px.

## Lot 84 — Roumanie (2026-09-24) : 18 photos de ville

Une photo par établissement (`assets/images/cities/`, JPEG + WebP + AVIF, déclinaisons `-400w`/`-800w`/`-1200w`/`-1600w`), produites par `scripts/add-lot84-photos.mjs`. Candidates regardées avant le choix ; une photo provient de Wikimedia Commons (licence CC à attribution obligatoire), les dix-sept autres d'Unsplash.

### `cluj-napoca-theatre-national.jpg` — le Théâtre national de Cluj-Napoca

- **Photographe** : Lucut Razvan
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/1Sm2b6K85ZE` (identifiant CDN `photo-1622569061848-8be92da6fde2`)

### `cluj-napoca-vue-sur-les-toits.jpg` — les toits de Cluj-Napoca sous un ciel nuageux

- **Photographe** : Tamas Pap
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/LC54UhNn95M` (identifiant CDN `photo-1583751636643-94790958040a`)

### `cluj-napoca-reflets-au-bord-de-l-eau.jpg` — des immeubles de Cluj-Napoca reflétés dans l'eau

- **Photographe** : Sinziana Susa
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/SzWrRCo7_0E` (identifiant CDN `photo-1514489793613-577418d65ae1`)

### `iasi-ensemble-palas-de-nuit.jpg` — le quartier Palas de Iași, de nuit

- **Photographe** : Tudor Baciu
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/6mTQUk3RHjo` (identifiant CDN `photo-1570771696100-83d4df94f09b`)

### `iasi-vue-nocturne-des-collines.jpg` — Iași au crépuscule, vue des collines

- **Photographe** : Tudor Baciu
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/sXkVCq3MzX4` (identifiant CDN `photo-1553960346-80863a247704`)

### `iasi-tramway-du-centre.jpg` — un tramway sur un boulevard de Iași

- **Photographe** : David Stroia
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/MCWeK5YtC3c` (identifiant CDN `photo-1784393222467-24d393535366`)

### `timisoara-immeubles-du-centre.jpg` — immeubles du début du XXe siècle au centre de Timișoara

- **Photographe** : Bogdan Vlad
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/vF3cl3QsnTM` (identifiant CDN `photo-1687696162212-73aed15d7e6b`)

### `timisoara-cathedrale-metropolitaine.jpg` — la cathédrale métropolitaine de Timișoara, de nuit

- **Photographe** : Cristian Coaja
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/2GfqKcZZGpo` (identifiant CDN `photo-1693074893993-aeb2339d00c3`)

### `timisoara-piata-unirii.jpg` — la place de l'Union, Timișoara

- **Photographe** : Bogdan Vlad
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/4cajbfV-QqM` (identifiant CDN `photo-1687696162729-a75f9ddc004d`)

### `bucarest-athenee-roumain.jpg` — l'Athénée roumain, Bucarest

- **Photographe** : Aidan Joyce
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/lwqOS1Lkyhc` (identifiant CDN `photo-1586808538936-5b921bbe92d9`)

### `bucarest-palais-du-parlement.jpg` — le palais du Parlement, Bucarest

- **Photographe** : Winston Tjia
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/2D9qjPHazVk` (identifiant CDN `photo-1730120257566-9f4b7f37f20d`)

### `craiova-parc-nicolae-romanescu.jpg` — le parc Nicolae-Romanescu, Craiova

- **Photographe** : Cimpueru Filip
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/O_CmbSd84Io` (identifiant CDN `photo-1644920367938-ed407e658794`)

### `craiova-place-mihai-viteazul.jpg` — la place Mihai-Viteazul et le palais administratif, Craiova

- **Photographe** : Emilian1
- **Licence** : [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/deed.en) — attribution obligatoire, à conserver tant que ce fichier est utilisé.
- **Source** : [File:Plaza Craiova.JPG — Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Plaza_Craiova.JPG)

### `brasov-vieille-ville-et-eglise-noire.jpg` — la vieille ville de Brașov et l'Église noire

- **Photographe** : Daniela Turcanu
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/v_0Nj6vdq4o` (identifiant CDN `photo-1636288087131-7e912d7d37cf`)

### `sibiu-grande-place.jpg` — la Grande Place de Sibiu

- **Photographe** : Alisa Anton
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/pkUsKFmAQIM` (identifiant CDN `photo-1456491882918-2bc1929963f6`)

### `constanta-casino.jpg` — le casino de Constanța

- **Photographe** : Ruxandra Gogea
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/Cjyv6Lcc6Ac` (identifiant CDN `photo-1582122149104-548d9ead3ff1`)

### `targu-mures-citadelle.jpg` — la citadelle de Târgu Mureș en automne

- **Photographe** : M. X.
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/UxOaJoyjI4s` (identifiant CDN `photo-1635182508069-73a718391c42`)

### `galati-promenade-du-danube.jpg` — Galați et la promenade du Danube, vue du ciel

- **Photographe** : Paladuta Stefan
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/8HuFkoTQItQ` (identifiant CDN `photo-1664912879009-fcf1fb932009`)

## Lot 88 — Allemagne (2026-09-24) : 19 photos de ville

Une photo par établissement (`assets/images/cities/`, JPEG + WebP + AVIF, déclinaisons `-400w`/`-800w`/`-1200w`/`-1600w`), produites par `scripts/add-lot88-photos.mjs`. Candidates regardées avant le choix ; une photo provient de Wikimedia Commons (licence CC à attribution obligatoire), les dix-huit autres d'Unsplash. Le premier candidat de chaque liste est crédité ici ; si le script a dû passer au second, `scripts/data/journal-photos-lot88.json` le dit et ce crédit est à corriger.

### `munich-frauenkirche.jpg` — les deux tours de la Frauenkirche au-dessus des toits de Munich

- **Photographe** : Daniel Schmidt
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/6lwB0GejTDY` (identifiant CDN `photo-1692726781304-fa1d2f1cc4c5`)

### `munich-marienplatz.jpg` — le nouvel hôtel de ville sur la Marienplatz, Munich

- **Photographe** : Anastasiya Dalenka
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/H-7zZBodgpM` (identifiant CDN `photo-1649609766229-a6c0811161a5`)

### `heidelberg-chateau.jpg` — le château de Heidelberg au coucher du soleil

- **Photographe** : Eli Omen
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/E-Igyj-W7ck` (identifiant CDN `photo-1748198162816-93dd425137f6`)

### `karlsruhe-chateau.jpg` — le château de Karlsruhe et ses pelouses

- **Photographe** : Marc Rentschler
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/y05Z-XD0Frs` (identifiant CDN `photo-1744761402617-d34192e39434`)

### `stuttgart-schlossplatz.jpg` — la Schlossplatz et le Nouveau Château, Stuttgart

- **Photographe** : Margo Evardson
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/bvwiunL3iyI` (identifiant CDN `photo-1778574744503-9c7772f3b9b1`)

### `fribourg-en-brisgau-cathedrale.jpg` — Fribourg-en-Brisgau et la flèche de sa cathédrale

- **Photographe** : David Hertle
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/4RAyNOpulFk` (identifiant CDN `photo-1639910269924-e6229de33e95`)

### `aix-la-chapelle-hotel-de-ville.jpg` — l'hôtel de ville d'Aix-la-Chapelle pendant le marché de Noël

- **Photographe** : Alexander Schimmeck
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/hw0ZD2JJqPc` (identifiant CDN `photo-1606819788285-5e709f0c798f`)

### `bonn-cerisiers-en-fleurs.jpg` — les cerisiers en fleurs de la Heerstraße, Bonn

- **Photographe** : Stephan Widua
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/ae4VmMbhanQ` (identifiant CDN `photo-1586789821310-3c0941c56a4f`)

### `cologne-grue-du-rheinauhafen.jpg` — une ancienne grue du port du Rheinauhafen, Cologne

- **Photographe** : Chris Hoppe
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/s4m74kabDXM` (identifiant CDN `photo-1571423401107-99e9c7977250`)

### `munster-arcades-de-nuit.jpg` — les arcades du centre historique de Münster, de nuit

- **Photographe** : Nico Brüggemann
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/_5BkX50vkOM` (identifiant CDN `photo-1610893876081-1e7c076a30c3`)

### `darmstadt-karolinenplatz.jpg` — la Karolinenplatz de Darmstadt, de nuit

- **Photographe** : Abhinav Das
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/sbdwwoT_rcw` (identifiant CDN `photo-1702307383737-5c6c30a2c650`)

### `francfort-romerberg.jpg` — la place de la vieille ville de Francfort, le Römerberg

- **Photographe** : Lāsma Artmane
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/yatyW_GSvBI` (identifiant CDN `photo-1638648152833-90ee0114f084`)

### `berlin-porte-de-brandebourg.jpg` — la porte de Brandebourg éclairée la nuit, Berlin

- **Photographe** : Florian Wehde
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/uFGi0_YciE0` (identifiant CDN `photo-1587330979470-3595ac045ab0`)

### `berlin-cathedrale.jpg` — la cathédrale de Berlin

- **Photographe** : Christian Ladewig
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/Zr-ZnTNekEY` (identifiant CDN `photo-1569404225992-9ac478f3c14e`)

### `dresde-vieille-ville-et-elbe.jpg` — la vieille ville de Dresde et ses bateaux à vapeur sur l'Elbe

- **Photographe** : Oliver Guhr
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/9YUsgVnnsTk` (identifiant CDN `photo-1619120810930-6ca5048deee1`)

### `leipzig-monument-bataille-des-nations.jpg` — le monument de la Bataille des Nations, Leipzig

- **Photographe** : Chris
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/XCTL1dnDRP4` (identifiant CDN `photo-1583602690006-31db03a8b86f`)

### `sarrebruck-bord-de-la-sarre.jpg` — un édifice blanc au bord de la Sarre, Sarrebruck

- **Photographe** : Mariia Yesionova
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/ntHtKyKLDWE` (identifiant CDN `photo-1706112790751-994699168f4f`)

### `gottingen-ancien-hotel-de-ville.jpg` — l'ancien hôtel de ville et la fontaine de la Gänseliesel, Göttingen

- **Photographe** : Dewi König
- **Licence** : [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/deed.en) — attribution obligatoire, à conserver tant que ce fichier est utilisé.
- **Source** : [File:Blick auf das alte Rathaus aus südöstlicher Richtung. Im Vordergrund ist der Marktplatz mit dem Gänseliesel zu sehen. - panoramio.jpg — Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Blick_auf_das_alte_Rathaus_aus_südöstlicher_Richtung._Im_Vordergrund_ist_der_Marktplatz_mit_dem_Gänseliesel_zu_sehen._-_panoramio.jpg)

### `mayence-cathedrale.jpg` — la cathédrale de Mayence

- **Photographe** : Markus Winkler
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/9c9ES3pmI00` (identifiant CDN `photo-1636381310700-d6931fc00bce`)

## Lot 89 — Turquie (2026-09-25) : 16 photos de ville

Une photo par établissement (`assets/images/cities/`, JPEG + WebP + AVIF, déclinaisons `-400w`/`-800w`/`-1200w`/`-1600w`), produites par `scripts/add-lot89-photos.mjs`. Candidates regardées sur planche avant le choix ; trois photos proviennent de Wikimedia Commons (licence CC à attribution obligatoire), les treize autres d'Unsplash. Le premier candidat de chaque liste est crédité ici ; si le script a dû passer au second, `scripts/data/journal-photos-lot89.json` le dit et ce crédit est à corriger. Substitutions assumées : Karabük reçoit Safranbolu, où se trouvent plusieurs de ses facultés ; Yıldız reçoit Dolmabahçe, la tour de Galata étant déjà la photo de Boğaziçi.

### `ankara-atakule.jpg` — la tour Atakule et son dôme de verre, Ankara

- **Photographe** : Cengiz Özarpat
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/xYM7T6l9M0g` (identifiant CDN `photo-1787255700155-2d3dcfd3be3a`)

### `ankara-grande-mosquee.jpg` — une grande mosquée d'Ankara et ses quatre minarets

- **Photographe** : ekrem osmanoglu
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/c9cYtNCXzRs` (identifiant CDN `photo-1771738841091-49dda284e8fe`)

### `ankara-vue-aerienne.jpg` — Ankara vue d'en haut

- **Photographe** : ekrem osmanoglu
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/S9ULqp6XWps` (identifiant CDN `photo-1584816152587-382580af2d85`)

### `istanbul-dolmabahce.jpg` — le palais de Dolmabahçe vu du Bosphore, Istanbul

- **Photographe** : Berkin Üregen
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/G4E_ZfGhaGg` (identifiant CDN `photo-1601565465051-67971a2d838c`)

### `istanbul-ortakoy.jpg` — la mosquée d'Ortaköy et le pont du Bosphore au coucher du soleil, Istanbul

- **Photographe** : Spenser Sembrat
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/O1n-f15L668` (identifiant CDN `photo-1763965368246-5e89755e4455`)

### `istanbul-mosquee-bleue.jpg` — la mosquée Bleue et son parc, Istanbul

- **Photographe** : Lewis J Goetz
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/QLXwWbismFA` (identifiant CDN `photo-1593544648982-cf4bbfb8fc38`)

### `istanbul-sainte-sophie.jpg` — Sainte-Sophie et ses minarets, Istanbul

- **Photographe** : Husien Bisky
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/34PWUSxBNiU` (identifiant CDN `photo-1777985329764-f19172bc9aa7`)

### `gebze-centre.jpg` — le centre de Gebze

- **Photographe** : Kadı
- **Licence** : [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/deed.en) — attribution obligatoire, à conserver tant que ce fichier est utilisé.
- **Source** : [File:Gebze Merkez (20221116).jpg — Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Gebze_Merkez_(20221116).jpg)

### `serdivan-sakarya.jpg` — Serdivan et la plaine de Sakarya vues d'en haut

- **Photographe** : Acar54
- **Licence** : [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.en) — attribution obligatoire, à conserver tant que ce fichier est utilisé.
- **Source** : [File:Serdivan, Sakarya.jpg — Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Serdivan,_Sakarya.jpg)

### `izmir-baie.jpg` — la baie d'Izmir vue des hauteurs

- **Photographe** : Mert Kahveci
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/wQLJSvJd6nw` (identifiant CDN `photo-1676845720871-493d7d821481`)

### `izmir-tramway.jpg` — le tramway d'Izmir entre les immeubles

- **Photographe** : Parastoo Maleki
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/j49sLH08tM0` (identifiant CDN `photo-1719688550738-c7186f2494b8`)

### `urla-port.jpg` — le port d'Urla et ses bateaux de pêche

- **Photographe** : Raicem
- **Licence** : [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.en) — attribution obligatoire, à conserver tant que ce fichier est utilisé.
- **Source** : [File:İzmir Urla İskele.jpg — Wikimedia Commons](https://commons.wikimedia.org/wiki/File:İzmir_Urla_İskele.jpg)

### `konya-mosquee.jpg` — une grande mosquée à coupoles de Konya

- **Photographe** : ekrem osmanoglu
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/WU87q6Rkzm8` (identifiant CDN `photo-1759930019002-1361e69bf74e`)

### `kayseri-mont-erciyes.jpg` — Kayseri et le mont Erciyes enneigé

- **Photographe** : Ömer Haktan Bulut
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/mKsW6suT6yc` (identifiant CDN `photo-1654004669656-0c2408ccdb95`)

### `erzurum-hiver.jpg` — Erzurum sous la neige et sa tour de l'horloge

- **Photographe** : Alperen Tosun
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/6tH3ikiuTjg` (identifiant CDN `photo-1635433084393-c569daa8b0d5`)

### `safranbolu-vue.jpg` — Safranbolu, ville des facultés de l'université de Karabük, vue d'en haut

- **Photographe** : ekrem osmanoglu
- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/lf_3JfVcEno` (identifiant CDN `photo-1578999305993-6a63f621cca6`)
