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

### `university-hall.jpg` — provenance NON ÉTABLIE

Photo du hero de la page d'accueil (`index.html`), et bannière de `universities.html` jusqu'au 2026-09-01.

- **Licence** : **inconnue.** Recherchée le 2026-09-01 sans résultat : aucune entrée d'origine dans ce fichier, aucun auteur en EXIF/IPTC (le XMP ne porte que la signature de pipeline « Go XMP SDK », compatible avec un passage par Unsplash mais qui ne prouve rien), message de commit muet (`16b22a7`, 2026-08-14), et une recherche par comparaison perceptuelle sur les résultats Unsplash correspondants n'a produit aucune correspondance (meilleur écart 36/255, très au-dessus d'un seuil d'identité).
- **Contenu** : bâtiment collégial de style gothique anglais, sur pelouse. Aucun blason, aucune enseigne, aucun texte identifiant sur ce cadrage — mais l'architecture reste assez distinctive pour qu'un visiteur connaissant ce campus le reconnaisse.
- **Ce qu'il reste à faire** : retrouver la source, ou remplacer le fichier sur la page d'accueil comme cela a été fait sur `universities.html`. Entrée volontairement conservée ici, vide de crédit : **un trou documenté vaut mieux qu'une attribution inventée**, et mieux qu'un silence qui ferait reposer la question à zéro à la prochaine passe.

### `student-preparing.jpg` (déclinaisons `-400w`/`-800w`/`-1200w`/`-1600w`)

Ajoutée le 2026-08-28 pour la section « Comment ça fonctionne » de la page d'accueil.

- **Licence** : [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Créditée ici par choix, pour garder la traçabilité de toutes les sources du projet.
- **Source** : `https://unsplash.com/photos/6e319464b810` (identifiant CDN `photo-1622295023825-6e319464b810`)
- **Déclinaisons** : téléchargées directement aux largeurs voulues depuis le CDN Unsplash (`?w=…&q=80&fm=jpg`), et non générées localement — le projet n'embarque pas `sharp`. C'est aussi pourquoi ce fichier n'a pas de variantes `avif`/`webp`, contrairement aux photos plus anciennes.

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

**Réserve à lever** : les noms de photographes ne figurent pas ci-dessous, contrairement aux lots 14 à 17. Les identifiants ont été relevés depuis les pages de recherche Unsplash, qui n'exposent que l'identifiant CDN ; retrouver l'auteur demande d'ouvrir la fiche de chaque photo une par une. L'attribution n'étant pas obligatoire sous cette licence, c'est une dette de traçabilité, pas une dette légale.

### Italie

- `adisu-puglia.jpg` — les trulli d'Alberobello (identifiant CDN `photo-1609948368716-254e2501d243`)
- `aliseo-liguria.jpg` — Manarola, Cinque Terre (identifiant CDN `photo-1516483638261-f4dbaf036963`)
- `ardis-friuli-venezia-giulia.jpg` — le front de mer de Trieste (identifiant CDN `photo-1623878991610-7416bc4e8c6f`)
- `dsu-lombardia-milano-statale.jpg` — la cour de Brera et sa statue de Napoléon, Milan (identifiant CDN `photo-1739826084732-1436a8908f20`)
- `edisu-pavia.jpg` — le Ponte Coperto sur le Tessin, Pavie (identifiant CDN `photo-1679098284781-1a211e7636a2`)
- `ergo-emilia-romagna.jpg` — le campanile de Parme (identifiant CDN `photo-1749680195704-f504f55054f9`)
- `invest-your-talent-italy.jpg` — Vérone et l'Adige (identifiant CDN `photo-1681477443350-45cfe74916e3`)
- `scuola-normale-superiore-phd.jpg` — la tour Guinigi, Lucques (identifiant CDN `photo-1747593467598-9cf0a9e46f02`)

### Allemagne

- `daad-epos.jpg` — les tours de Francfort (identifiant CDN `photo-1626447637943-4c9d412fa8cf`)
- `daad-helmut-schmidt-programme.jpg` — l'Elbphilharmonie, Hambourg (identifiant CDN `photo-1553547274-0df401ae03c9`)
- `friedrich-ebert-stiftung.jpg` — Heidelberg, son pont et le Neckar (identifiant CDN `photo-1632660609710-ca2ee0c3425b`)
- `heinrich-boell-stiftung.jpg` — la cathedrale de Cologne (identifiant CDN `photo-1608322460360-009ddc765b99`)
- `konrad-adenauer-stiftung.jpg` — Bonn (identifiant CDN `photo-1715281762727-daf602648ea4`)
- `rosa-luxemburg-stiftung.jpg` — Leipzig et son beffroi (identifiant CDN `photo-1694098141071-8e1322860773`)

### Japon

- `abe-initiative-jica.jpg` — Yokohama de nuit (identifiant CDN `photo-1587474064565-922e1178ec8f`)
- `honjo-international-scholarship.jpg` — une pagode de Kyoto (identifiant CDN `photo-1578469645742-46cae010e5d4`)
- `jasso-monbukagakusho-honors.jpg` — le chateau d'Osaka (identifiant CDN `photo-1575489129683-4f7d23379975`)
- `jica-sdgs-global-leader.jpg` — le mont Fuji (identifiant CDN `photo-1526481280693-3bfa7568e0f3`)
- `rotary-yoneyama-overseas.jpg` — les daims de Nara (identifiant CDN `photo-1550303435-1703d8811aaa`)

### Suisse

- `iheid-scholarships.jpg` — le Palais des Nations, Geneve (identifiant CDN `photo-1679589164488-ca6dc6746af9`)
- `unifr-research-scholarships.jpg` — la vieille ville de Fribourg et la Sarine (identifiant CDN `photo-1609770264759-fd0f26b0de92`)
- `unige-excellence-master-fellowships.jpg` — le Jet d'eau de Geneve (identifiant CDN `photo-1633022326182-1b36700bc49a`)
- `unil-master-grants.jpg` — la cathedrale de Lausanne (identifiant CDN `photo-1584469728290-46e7760c2d78`)
- `zeno-karl-schindler-master-thesis.jpg` — Berne et les ponts de l'Aar (identifiant CDN `photo-1664459937096-d395cd77f8b8`)

### Turquie

- `diyanet-tdv-international.jpg` — une mosquee ottomane (identifiant CDN `photo-1466442929976-97f336a657be`)
- `tubitak-2216-research-fellowship.jpg` — Anitkabir, Ankara (identifiant CDN `photo-1650802315195-f58a8663c9be`)
- `turkiye-burslari-research.jpg` — les montgolfieres de Cappadoce (identifiant CDN `photo-1604156789095-3348604c0f43`)
- `turkiye-burslari-success.jpg` — la tour de l'Horloge d'Izmir (identifiant CDN `photo-1701428588034-5893b2512a68`)
- `ytb-isdb-joint-scholarship.jpg` — le dome turquoise du mausolee de Mevlana, Konya (identifiant CDN `photo-1698852785755-8fa52e11479a`)

### Corée du Sud

- `koica-ciat-scholarship.jpg` — le village de Gamcheon, Busan (identifiant CDN `photo-1672671187899-a10f547341f1`)

### Substitutions assumées

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

Toutes en [Unsplash License](https://unsplash.com/license) — usage commercial autorisé, attribution non obligatoire. Comme au lot 25, les noms de photographes ne figurent pas (même réserve de traçabilité) : les pages de recherche n'exposent que l'identifiant CDN.

**Correctif lot 27 (2026-08-30)** : trois des dix-neuf identifiants de ce lot reprenaient une photo déjà utilisée ailleurs dans le dépôt (`hse-into-olympiad` ← la Saint-Basile d'`open-doors-scholarship.jpg`, `jads-japan-africa-dream` ← la Shibuya de `waseda.jpg`, `fao-hungarian-government-scholarship` ← le Parlement hongrois de `corvinus.jpg`) — le lot recréait, dans trois pays, exactement le défaut qu'il devait supprimer. Les trois fichiers ont été réécrits avec des photos inédites (`scripts/add-lot27-photo-fixes.ps1`) ; le champ `image` en base n'a pas changé — même nom de fichier — donc aucun lot Firestore n'accompagne ce correctif. Les trois entrées ci-dessous sont celles du lot 27.

**Pourquoi le contrôle du lot 26 ne l'avait pas vu, et le garde-fou à reprendre dans tout futur lot de photos** : le script du lot 26 comparait les tailles des fichiers *du lot* entre eux — deux fichiers de noms différents portant la même photo sont invisibles à ce test dès lors que l'un des deux vient d'un lot antérieur. Le contrôle mesurait un indice (le nom de fichier) et non la chose (l'identifiant de la photo). `scripts/add-lot27-photo-fixes.ps1` ajoute le contrôle qui manquait : avant tout téléchargement, chaque identifiant CDN est cherché dans CE fichier, où toutes les photos du dépôt sont créditées avec le leur ; une occurrence sur une autre bourse arrête le script sans rien écrire. C'est le seul garde-fou qui attrape ce défaut.

### Royaume-Uni

- `clarendon-fund-scholarships.jpg` — les toits gothiques d'Oxford vus d'en haut (identifiant CDN `photo-1472121779802-43c68a9f405f`)
- `reach-oxford-scholarship.jpg` — une facade de college d'Oxford (identifiant CDN `photo-1568792923760-d70635a89fdc`)
- `rhodes-scholarships-west-africa.jpg` — un quadrangle d'Oxford et sa pelouse (identifiant CDN `photo-1642612460433-a5d935c08d73`)
- `weidenfeld-hoffmann-scholarships.jpg` — la pierre blonde d'Oxford sous un ciel bleu (identifiant CDN `photo-1612563958093-2c3bcfbd8760`)
- `commonwealth-masters-scholarships.jpg` — Big Ben et le Parlement au couchant (identifiant CDN `photo-1745016176874-cd3ed3f5bfc6`)
- `commonwealth-phd-scholarships.jpg` — le London Eye (identifiant CDN `photo-1546533658-8f1f550b9a4e`)
- `commonwealth-shared-scholarships.jpg` — un pont sur la Tamise (identifiant CDN `photo-1560709889-eec6771309ff`)
- `imperial-presidents-phd-scholarships.jpg` — une cabine telephonique rouge devant un batiment londonien (identifiant CDN `photo-1619447093155-3d646f597c91`)

### Russie

- `spbu-open-olympiad.jpg` — les fontaines de Peterhof, Saint-Petersbourg (identifiant CDN `photo-1610197361600-33a3a5073cad`)
- `hse-into-olympiad.jpg` — une station ornée du métro de Moscou (identifiant CDN `photo-1741171469811-553adc364411`, lot 27)
- `hse-merit-scholarships.jpg` — un batiment moscovite reflete dans l'eau (identifiant CDN `photo-1561117937-45681fb935ad`)

### Roumanie

- `auf-eugen-ionescu.jpg` — la statue equestre de Matthias Corvin, Cluj-Napoca (identifiant CDN `photo-1678736680989-195226823176`)
- `auf-petrache-poenaru.jpg` — le palais de la Culture et son horloge, Iasi (identifiant CDN `photo-1710877669376-7633d6f64678`)
- `bourse-george-darie.jpg` — les maisons colorees du centre de Cluj-Napoca (identifiant CDN `photo-1583751636643-94790958040a`)

### Japon

- `jads-japan-africa-dream.jpg` — un torii rouge sur un chemin forestier (identifiant CDN `photo-1601823984263-b87b59798b70`, lot 27)
- `jj-wbgsp.jpg` — Tokyo vue du ciel (identifiant CDN `photo-1573456373835-579c408de263`)

### Corée du Sud

- `snu-glo-harmony-scholarship.jpg` — un pavillon de palais seoulien (identifiant CDN `photo-1448523183439-d2ac62aca997`)

### Hongrie

- `fao-hungarian-government-scholarship.jpg` — champs et lac vus du ciel, région du Balaton (identifiant CDN `photo-1725801719382-1e9db44b0066`, lot 27)

### Suisse

- `epfl-edic-doctoral.jpg` — le campus de l'EPFL et les Alpes (identifiant CDN `photo-1699470762437-bd145c9042ee`)

### Bourses qui conservent leur image partagée

Une par groupe, pour éviter un téléchargement inutile : `mastercard-foundation-afox-oxford` garde `oxford.jpg`, `great-scholarships` garde `london.jpg`, `quota-gouvernement-russe` garde `moscow.jpg`, `politehnica-excellence-scholarship` garde `politehnica-bucuresti.jpg`, `utokyo-fellowship` garde `tokyo.jpg`, `snu-global-scholarship` garde `snu-seoul.jpg`, `ud-international-scholarship` garde `debrecen.jpg`, `epfl-master-excellence-fellowships` garde `lausanne.jpg`.

---

Recadrées et redimensionnées (`scripts/generate-city-srcset.mjs`) à partir des fichiers originaux ci-dessus — le contenu visuel est inchangé, seuls le cadrage (portrait 3:4) et la résolution diffèrent des fichiers sources.

Benguerir et Louvain-la-Neuve ne sont pas recadrées, seulement redimensionnées (2000px pour le fichier de référence, puis 400/800/1200/1600px), avec les mêmes réglages que le script ci-dessus (qualité 92, mozjpeg). Elles ont été générées à part plutôt qu'en le lançant, car il réencode l'intégralité du dossier `cities/` à chaque exécution et aurait touché les quarante autres villes sans raison.

Lausanne et Jeddah ne passent pas non plus par `generate-city-srcset.mjs` : comme `student-preparing.jpg`, leurs déclinaisons sont téléchargées directement aux largeurs voulues depuis le CDN Unsplash (`scripts/add-lot9-city-photos.ps1`), sans recadrage ni passage par `sharp`. Même chose pour les photos des lots 11 (`scripts/add-lot11-unique-photos.ps1`), 13 (`scripts/add-lot13-more-unique-photos.ps1`), 14 (`scripts/add-lot14-scholarship-photos.ps1`), 15 (`scripts/add-lot15-scholarship-photos.ps1`), 16 (`scripts/add-lot16-scholarship-photos.ps1`), 17 (`scripts/add-lot17-scholarship-photos.ps1`), 25 (`scripts/add-lot25-scholarship-photos.ps1`), 26 (`scripts/add-lot26-scholarship-photos.ps1`) et 27 (`scripts/add-lot27-photo-fixes.ps1`) ci-dessus — les lots 14 à 17 et 25 à 27 dans leur propre dossier `assets/images/scholarships/`, distinct de `assets/images/cities/`.

---

## Drapeaux (`assets/flags/`) — lot 31 (2026-08-30)

`rw.svg` (Rwanda), `gh.svg` (Ghana), `ke.svg` (Kenya) et `eg.svg` (Egypte) proviennent du projet **flag-icons** (Panayiotis Lipiridis), recuperes via jsDelivr (`flag-icons@7.5.0`, dossier `flags/4x3/`).

- **Licence** : [MIT](https://github.com/lipis/flag-icons/blob/main/LICENSE) — usage commercial autorise.
- **Optimisation** : attribut `id` retire et indentation supprimee, dessin inchange. Le bouclier massai du Kenya et l'aigle de Saladin egyptien sont les traces officiels du projet source, volontairement non redessines — c'est pourquoi `eg.svg` (8,5 Ko) depasse la taille des drapeaux a bandes simples, comme `us.svg` (9,3 Ko) avant lui.

---

## Lot 31 — Afrique (2026-08-30) : Rwanda, Ghana, Kenya, Egypte

Treize photos DISTINCTES (quatre universites a Kigali, deux a Nairobi : chacune la sienne), chaque image regardee avant d'etre retenue et chaque identifiant verifie absent de ce fichier avant telechargement. References plafonnees a 2000px puis declinees en 400/800/1200/1600w (JPEG q92 mozjpeg + WebP + AVIF) par `scripts/add-lot31-photos.mjs` — jamais la taille d'origine servie. Les bourses du lot n'ont pas de photo propre (cascade : photo de l'universite rattachee), sauf Al-Azhar, orpheline volontaire.

### Unsplash ([Unsplash License](https://unsplash.com/license))

- `university-of-rwanda-kigali.jpg` — la skyline du centre de Kigali au couchant. Photographe : Jean Claude Akarikumutima (identifiant CDN `photo-1687986261123-b17f08f2796c`, page `b-HnOOPRfTI`)
- `aims-kigali.jpg` — panorama des collines habitees de Kigali. Photographe : Protais Benjamin MUGENZI (identifiant CDN `photo-1708772565599-2c4e4b3ed9db`, page `K15V22xU1zs`)
- `aims-accra.jpg` — la Black Star Gate (« Freedom and Justice »), place de l'Independance, Accra. Photographe : Ifeoluwa B. (identifiant CDN `photo-1630386226447-af0a955c1009`, page `-CgUhaShACE`)
- `usiu-nairobi.jpg` — les tours du quartier de Westlands, Nairobi, dans la lumiere doree. Photographe : Amani Nation (identifiant CDN `photo-1611348524140-53c9a25263d6`, page `LTh5pGyvKAM`)
- `icipe-nairobi.jpg` — girafe massai devant la skyline de Nairobi (parc national de Nairobi). Photographe : Grace Nandi (identifiant CDN `photo-1634662101368-fa8021773862`, page `7XA8SJ5ODq4`)
- `auc-cairo.jpg` — felouque sur le Nil, la tour du Caire et la skyline, en paysage. Photographe : Alex Kotomanov (identifiant CDN `photo-1720400995876-506098f4c238`, page `987Ds8mF3JM`)
- `senghor-alexandrie.jpg` — la citadelle de Qaitbay, Alexandrie. Photographe : Juan Nino (identifiant CDN `photo-1633624646814-3a61ed3e2847`, page `rdvqTZLaE-k`)
- `al-azhar-cairo.jpg` (dossier `assets/images/scholarships/`) — les minarets et le dome de la mosquee Al-Azhar au-dessus des toits, Le Caire, en paysage. Photographe : Yousef Salhamoud (identifiant CDN `photo-1646763143121-1bbf5aaf2f2d`, page `1INRvy-Qg5s`)

### Wikimedia Commons (licences CC a attribution obligatoire, a conserver tant que ces fichiers sont utilises)

Revision du 2026-08-31, apres relecture : quatre photos remplacees. `cmu-africa-kigali` (feu d'artifice, format carre), `auc-cairo` et `al-azhar-cairo` (formats portrait, sujets coupes par le cadre 2:1 des cartes) et `alu-kigali` (meme scene de colline que `aims-kigali` — fichiers distincts n'est pas images distinctes). Les anciennes variantes ont ete supprimees ; regle appliquee aux 13 : ratio vise 3:2 ou plus large, refus sous 1,3.

- `cmu-africa-kigali.jpg` — le dome du Kigali Convention Centre en vue aerienne de jour, quartier mitoyen du campus CMU-Africa. Auteur : Emmanuel Kwizera (Emmanuelkwizera), [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.en). Source : [File:An aerial of Kigali Convention Center on June 19, 2019. Photo by Emmanuel Kwizera.jpg](https://commons.wikimedia.org/wiki/File:An_aerial_of_Kigali_Convention_Center_on_June_19,_2019._Photo_by_Emmanuel_Kwizera.jpg)
- `alu-kigali.jpg` — Kigali de nuit sous la lune, skyline eclairee. Auteur : Adrien K, [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/deed.en). Source : [File:Kigali2018.jpg](https://commons.wikimedia.org/wiki/File:Kigali2018.jpg)
- `ashesi-berekuso.jpg` — la cour Archer Cornfield du campus d'Ashesi University, Berekuso, a l'heure bleue. Auteur : Gwumah, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.en). Source : [File:Ashesi's Archer Cornfield Courtyard.jpg](https://commons.wikimedia.org/wiki/File:Ashesi%27s_Archer_Cornfield_Courtyard.jpg)
- `knust-kumasi.jpg` — allee commercante arboree du campus de KNUST, Kumasi. Auteur : Jude Hammond, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.en). Source : [File:Knust campus- Commercial area.jpg](https://commons.wikimedia.org/wiki/File:Knust_campus-_Commercial_area.jpg)
- `jkuat-juja.jpg` — le batiment PAUSTI (Block B) sur le campus de la JKUAT, Juja — le sujet exact de la bourse de l'Universite panafricaine. Auteur : Gedankenstuecke, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.en). Source : [File:JKUAT - PAUSTI.jpg](https://commons.wikimedia.org/wiki/File:JKUAT_-_PAUSTI.jpg)

---

## Lot 32 — Italie, Suisse, Russie (2026-08-31)

Onze photos de ville, une par universite du lot. Declinees par `scripts/add-lot32-photos.mjs` (reference 2000px + 400/800/1200/1600w en JPEG q92 mozjpeg, WebP et AVIF) — la taille d'origine n'est jamais servie. Chaque image regardee avant d'etre retenue, chaque identifiant verifie absent de ce fichier, chaque ratio mesure (1,33 minimum : la carte est une fente d'environ 2:1 en object-fit:cover).

QUATRE VILLES ETAIENT DEJA OCCUPEES, et c'est le point de vigilance de ce lot — l'echec du lot 31 etait deux fichiers distincts montrant la meme scene :

- **Milan** : `milan.jpg` (Politecnico) et `bocconi.jpg` (le Duomo) existaient deja -> ici les Navigli, de nuit.
- **Pise** : `pisa.jpg` (Piazza dei Miracoli vue d'en haut) -> ici les quais de l'Arno, sans la tour.
- **Lausanne** : `lausanne.jpg` (toits et lac en automne) -> ici le chateau d'Ouchy.
- **Geneve** recoit DEUX etablissements du lot : le jet d'eau vu du lac (IHEID) et le pont du Mont-Blanc vu d'en haut (UNIGE) — deux cadrages sans rapport.

La garde anti-doublon a ecarte trois candidates deja utilisees, dont le front de mer de Trieste, qui sert deja a `ardis-friuli-venezia-giulia.jpg`.

### Unsplash ([Unsplash License](https://unsplash.com/license))

- `unimi-milan.jpg` — le canal des Navigli a la tombee du jour, Milan. Photographe : Daniel Kirby (identifiant CDN `photo-1668784290849-aa5acd24edcd`, page `smCqxgrMeNY`)
- `pavia.jpg` — le Ponte Coperto sur le Tessin au coucher du soleil, Pavie. Photographe : Isaac Maffeis (identifiant CDN `photo-1751098663661-da1b55e7e91f`, page `ZlhTV3OgAG0`)
- `genes.jpg` — les toits de la vieille ville de Genes et le port au fond. Photographe : Ollie Tulett (identifiant CDN `photo-1693067038040-044640fad0f7`, page `7Xz2eY-Frg4`)
- `bari.jpg` — le Teatro Margherita sur le vieux port de Bari, barques bleues au premier plan. Photographe : Maria Bobrova (identifiant CDN `photo-1564863756233-e90e6d2f264b`, page `wNxEJbExriM`)
- `trieste.jpg` — le Canal Grande de Trieste au crepuscule. Photographe : Alain ROUILLER (identifiant CDN `photo-1718553124786-473af4238076`, page `DeLPPZ4VgNY`)
- `scuola-normale-pise.jpg` — les quais de l'Arno a Pise, lumiere du soir. Photographe : alexey turenkov (identifiant CDN `photo-1540685889031-268df9f16803`, page `nYxfMY49PHg`)
- `iheid-geneve.jpg` — le jet d'eau de Geneve vu du lac, le Saleve en arriere-plan. Photographe : Meizhi Lang (identifiant CDN `photo-1667758682790-c58fa23dc76f`, page `kk1ZpooGZqk`)
- `fribourg.jpg` — la tour de la cathedrale et l'horloge de l'hotel de ville, vieille ville de Fribourg. Photographe : Artan (identifiant CDN `photo-1782564173527-0f435c646e72`, page `IZtimgrQlHY`)
- `unige-geneve.jpg` — le pont du Mont-Blanc et le Rhone vus d'en haut, Geneve. Photographe : Xavier von Erlach (identifiant CDN `photo-1584200463394-bba4b2117e4d`, page `yEsQzAhDKQs`)
- `unil-lausanne.jpg` — le chateau d'Ouchy au bord du Leman, Lausanne. Photographe : Alin Andersen (identifiant CDN `photo-1657557494887-59caee68dae8`, page `2JyQzpydsV8`)
- `saint-petersbourg.jpg` — le palais d'Hiver et la Neva gelee, Saint-Petersbourg. Photographe : Evgenii Zolotarev (identifiant CDN `photo-1691583224443-1fefd0afaa51`, page `pj01T3IV_pM`)

---

## Correctif `milan.jpg` (2026-08-31) — le nom de fichier n'est pas une preuve du sujet

`milan.jpg`, servie pour le Politecnico di Milano, montrait en realite **Vernazza, dans les Cinque Terre**, a 200 km de Milan et sur la cote ligure. Le fichier etait bien nomme, unique, au bon ratio et correctement servi : toutes les gardes automatiques etaient au vert, et l'image etait fausse. Seul un regard sur l'image pouvait l'attraper — c'est exactement le controle qui avait manque.

Remplacee par une vraie vue de Milan, distincte a l'oeil des deux autres images milanaises du catalogue (le Duomo pour Bocconi, les Navigli de nuit pour l'Universita degli Studi au lot 32) : une troisieme scene, donc.

- `milan.jpg` — le Castello Sforzesco et la fontaine de la piazza Castello, Milan. Photographe : Maria Cappelli, [Unsplash License](https://unsplash.com/license) (identifiant CDN `photo-1602059201105-276c01c1b657`, page `XsXqM4HmYxc`)

Verifiees a la meme occasion, et CORRECTES : `bocconi.jpg` (le Duomo), `pisa.jpg` (la Piazza dei Miracoli et sa tour), `lausanne.jpg` (ville en terrasses au-dessus du Leman, Alpes de Savoie en face).

L'ancienne photo de Vernazza n'est plus referencee nulle part.

---

## Lot 35 — France (2026-09-03)

Cinq photos de ville pour cinq des six etablissements du lot (l'Ecole polytechnique n'en a pas encore : aucune photo libre du campus de Palaiseau trouvee sur Unsplash, piste Wikimedia Commons a suivre — champ `image` vide, repli generique). Declinees par `scripts/add-lot35-photos.mjs` (reference 2000px + 400/800/1200/1600w en JPEG q92 mozjpeg, WebP et AVIF). Chaque image regardee APRES telechargement (le sandbox qui a prepare le lot n'atteint pas le CDN Unsplash), chaque ratio mesure (1,33 minimum).

INCIDENT du premier passage : la candidate initiale pour l'ENS (place du Pantheon, page `3UrP2tmccEc`) etait en PORTRAIT (0,75) ; la garde de ratio a interrompu le script et trois villes n'ont pas ete telechargees, alors que les fiches avaient deja leur champ `image`. Le script a ete repris pour signaler et sauter un refus au lieu de s'arreter, et la candidate remplacee.

PARIS ETAIT DEJA OCCUPEE DEUX FOIS (`paris.jpg` pour Sciences Po, `sorbonne.jpg`) : les deux parisiennes du lot prennent des sujets distincts, le Pantheon (l'ENS est rue d'Ulm, juste derriere) et les tours de la BnF (face au campus des Grands Moulins de Paris Cite).

### Unsplash ([Unsplash License](https://unsplash.com/license))

- `paris-saclay-gif.jpg` — les batiments Gustave-Eiffel et Francis-Bouygues de CentraleSupelec sur le campus de Paris-Saclay, Gif-sur-Yvette. Photographe : Philippe Gras (identifiant CDN `photo-1617182926345-205718965035`, page `WIHa4vSUKow`)
- `ens-ulm-paris.jpg` — la facade et le dome du Pantheon sous un ciel de nuages, Paris. Photographe : Kreshen (identifiant CDN `photo-1565200380227-ede88b62b5a0`, page `pF7MZSCYsN4`)
- `lyon.jpg` — Lyon en vue aerienne : la Saone, le Vieux-Lyon et la colline de Fourviere. Photographe : Willian Justen de Vasconcellos (identifiant CDN `photo-1682249301492-c117bddca579`, page `Q8W2RhZgO6U`)
- `grenoble.jpg` — les « bulles » du telepherique de la Bastille au-dessus de la ville, montagnes enneigees au fond, Grenoble. Photographe : Fabe collage (identifiant CDN `photo-1580920950500-597f23bd6f72`, page `diqJhQtHHNk`)
- `paris-cite-bnf.jpg` — les quatre tours de la BnF Francois-Mitterrand vues du pont de Bercy, en noir et blanc. Photographe : FELIXFELIX FELIX (identifiant CDN `photo-1768913124310-d53597c80ea3`, page `nNqG3PewSGc`)

---

## Lot 35 bis — photos propres des bourses francaises + campus de Polytechnique (2026-09-03)

Rattrapage de la regle du catalogue : chaque bourse porte SA photo (un monument de la ville), chaque universite SA photo de ville, aucune image partagee. Le lot 35 avait laisse huit bourses sur la cascade de repli (photo de l'universite rattachee) — cartes jumelles. Dix images produites par `scripts/add-lot35-photos-bourses.mjs`, chacune regardee apres telechargement (planche des dix, cote a cote), ratios 1,33 a 1,60. Sujets choisis pour ne doubler ni les photos d'universites (Louvre, Sorbonne, Pantheon, BnF, CentraleSupelec, Lyon aerien, bulles de Grenoble) ni la tour Eiffel.

`bourse-emile-boutmy.jpg` est REMPLACEE (elle montrait la pyramide du Louvre, comme `paris.jpg` de Sciences Po : meme monument, deux fichiers) — l'entree precedente de ce fichier pour cette image est caduque.

### Unsplash ([Unsplash License](https://unsplash.com/license)) — dossier `assets/images/scholarships/`, JPEG 2000 + 400/800/1200/1600w

- `bourse-emile-boutmy.jpg` — le musee d'Orsay vu de la Seine au couchant, Paris. Photographe : T (@t0nn) (identifiant CDN `photo-1764929316321-a920a59306df`, page `pYVT_YWvj3Y`)
- `ens-psl-selection-internationale.jpg` — la facade du palais du Luxembourg et son jardin, Paris. Photographe : Mikael Padeiro (identifiant CDN `photo-1778397277715-5587af2a38a7`, page `s7oVdTjjKhs`)
- `smarts-up-universite-paris-cite.jpg` — la facade de Notre-Dame de Paris sous un ciel charge. Photographe : Marcel Strauß (identifiant CDN `photo-1574870310056-79c4b3c7d449`, page `t9yW6tegIRU`)
- `france-excellence-major.jpg` — l'Arc de Triomphe en contre-plongee, ciel bleu, Paris. Photographe : ian kelsall (identifiant CDN `photo-1595540089942-545def48cf3e`, page `KX5ZQkluQ9U`)
- `programme-bourses-france-senegal.jpg` — les pylones dores du pont Alexandre-III et la verriere du Grand Palais, Paris. Photographe : Sinisa Lekovic (identifiant CDN `photo-1747464362908-8bc10e50ca3f`, page `arPLE2yYHRU`)
- `polytechnique-concours-international-fui.jpg` — le dome dore des Invalides au-dessus des toits, Paris. Photographe : Mikael Padeiro (identifiant CDN `photo-1773671334580-5b61c34a7b56`, page `-1v5OV58dm0`)
- `ens-lyon-ampere-scholarships.jpg` — la basilique de Fourviere sur sa colline boisee, Lyon. Photographe : Salya T (identifiant CDN `photo-1677389931416-9832636048ff`, page `zNnpb7NjPBs`)
- `uga-idex-master-scholarships.jpg` — les facades colorees des quais de l'Isere, Grenoble. Photographe : Christian Attard (identifiant CDN `photo-1720717374256-cb67e1dae73b`, page `mKCXxdlAl1A`)
- `paris-saclay-international-masters-scholarship.jpg` — la cour de Marbre du chateau de Versailles. Photographe : Louis Paulin (identifiant CDN `photo-1667752920461-a5ea0883f438`, page `FUxXFfgbyOU`)

### Wikimedia Commons (licence CC a attribution obligatoire, a conserver tant que ce fichier est utilise) — dossier `assets/images/cities/`

- `polytechnique-palaiseau.jpg` (+ 400/800/1200/1600w en JPEG, WebP et AVIF) — le campus de l'Ecole polytechnique vu du lac, Palaiseau. Auteur : David Monniaux, [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/deed.en). Source : [File:Ecole Polytechnique France seen from lake DSC03389.JPG](https://commons.wikimedia.org/wiki/File:Ecole_Polytechnique_France_seen_from_lake_DSC03389.JPG). Original 2592x1944 (ratio 1,33), redimensionne a 2000px.

---

## Lot 36 — France, consolidation : 18 photos de ville (2026-09-03)

Dix-huit etablissements, dix-huit photos de ville, aucune image partagee. Sujets choisis pour ne doubler aucun sujet deja en place (Paris : Louvre, Sorbonne, Pantheon, BnF, tour Eiffel, Orsay, Luxembourg, Notre-Dame, Arc de Triomphe, pont Alexandre-III, Invalides ; Lyon : vue aerienne, Fourviere ; Grenoble ; Versailles ; Gif). Produites par `scripts/add-lot36-photos.mjs` (reference 2000px + 400/800/1200/1600w en JPEG q92 mozjpeg, WebP et AVIF), chaque image regardee apres telechargement (planche des dix-huit), ratios 1,46 a 1,78.

### Unsplash ([Unsplash License](https://unsplash.com/license))

- `strasbourg.jpg` — maisons a colombages de la Petite France au bord de l'Ill, Strasbourg. Photographe : Lucile Noiriel (identifiant CDN `photo-1596036986070-e84592a19917`, page `Cq4BqP4IYN4`)
- `marseille.jpg` — le Vieux-Port et ses mats, Marseille. Photographe : Sebastien Devocelle (identifiant CDN `photo-1759244569310-0c4fa51434ff`, page `qetNTyxJRcs`)
- `toulouse.jpg` — la facade du Capitole sur sa place, Toulouse. Photographe : Korng Sok (identifiant CDN `photo-1650707199496-b02442055332`, page `vNyGKzCUfAU`)
- `bordeaux.jpg` — la place de la Bourse reflechie dans le miroir d'eau, Bordeaux. Photographe : Wojciech Rzepka (identifiant CDN `photo-1698608216843-67ae1151b2b8`, page `ZtrpZX8ZGx8`)
- `lille.jpg` — la Vieille Bourse et le beffroi de la chambre de commerce, Grand-Place de Lille. Photographe : Martin Robac (identifiant CDN `photo-1764671708519-447591cd8179`, page `riAzFTGPCGc`)
- `montpellier.jpg` — la place de la Comedie et son opera, Montpellier. Photographe : Hector J. Rivas (identifiant CDN `photo-1666886677737-2cd1f108e080`, page `2DxcRRxedUQ`)
- `nantes.jpg` — le Grand Elephant des Machines de l'ile, Nantes. Photographe : Pascal Bernardon (identifiant CDN `photo-1676283898167-addc4238bee8`, page `LxJ5FHD495Y`)
- `rennes.jpg` — la place du Parlement de Bretagne, Rennes. Photographe : Thanh Ly (identifiant CDN `photo-1724516042952-63ee061f6980`, page `t3LUVgkXnCg`)
- `nancy.jpg` — la place Stanislas et ses grilles dorees, Nancy. Photographe : Gerard GRIFFAY (identifiant CDN `photo-1614891202431-e4ba6b3d9edb`, page `s2bAvgNZ6vI`)
- `nice.jpg` — la baie des Anges et la promenade des Anglais vues de la colline du Chateau, Nice. Photographe : Pierre Goiffon (identifiant CDN `photo-1784840232787-74d27de8557c`, page `aCkb4PPolGI`)
- `lyon-tete-d-or.jpg` (Universite Claude Bernard Lyon 1) — allee de platanes du parc de la Tete d'Or en automne, Lyon. Photographe : Thomas K (identifiant CDN `photo-1761144459402-80182d476772`, page `uvCaQjAPx60`)
- `lyon-bellecour.jpg` (INSA Lyon) — la place Bellecour, la statue de Louis XIV et Fourviere a l'horizon, Lyon. Photographe : Tuan P. (identifiant CDN `photo-1775359226314-d74827afffcb`, page `3v_bZOM_XTs`)
- `paris-sacre-coeur.jpg` (Paris 1 Pantheon-Sorbonne) — la basilique du Sacre-Coeur entre les arbres, Montmartre. Photographe : DAVID TAPIA SAN MARTIN (identifiant CDN `photo-1561370665-7e266065fce1`, page `NgiEm-SbXZg`)
- `paris-fondation-louis-vuitton.jpg` (Dauphine-PSL) — les voiles de verre de la Fondation Louis Vuitton, bois de Boulogne. Photographe : Louis Colbee (identifiant CDN `photo-1597041151430-e11bed3c1973`, page `N_2OP0Ul7us`)
- `paris-pont-neuf.jpg` (Mines Paris-PSL) — le Pont-Neuf et la pointe de l'ile de la Cite au couchant, Paris. Photographe : Bastien Nvs (identifiant CDN `photo-1624209060513-2b1b76ed0caa`, page `SkgPTTk_eXE`)

### Wikimedia Commons (licences CC a attribution obligatoire, a conserver tant que ces fichiers sont utilises)

- `hec-jouy-en-josas.jpg` — le chateau du campus HEC Paris, facade sud, Jouy-en-Josas. Auteur : DXR, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.en). Source : [File:Chateau, HEC Paris, Jouy-en-Josas, South view 20160501 1.jpg](https://commons.wikimedia.org/wiki/File:Chateau,_HEC_Paris,_Jouy-en-Josas,_South_view_20160501_1.jpg). Original 7184x4908 (ratio 1,46), redimensionne a 2000px.
- `essec-cergy.jpg` — le batiment principal du campus ESSEC, Cergy. Auteur : Rdavout (attribution presumee d'apres la mention de copyright du fichier, aucun auteur lisible par machine), [CC BY-SA 2.5](https://creativecommons.org/licenses/by-sa/2.5/deed.en). Source : [File:ESSEC campus cergy.jpg](https://commons.wikimedia.org/wiki/File:ESSEC_campus_cergy.jpg). Original 2560x1704 (ratio 1,50), redimensionne a 2000px.
- `saint-denis-basilique.jpg` (Sorbonne Paris Nord) — l'abbaye de Saint-Denis, son jardin a la francaise et le transept sud de la basilique, Saint-Denis. Auteur : MOSSOT, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.en). Source : [File:Saint-Denis - Basilique Saint-Denis et l'abbaye -2.JPG](https://commons.wikimedia.org/wiki/File:Saint-Denis_-_Basilique_Saint-Denis_et_l%27abbaye_-2.JPG). Original 4896x3672 (ratio 1,33), redimensionne a 2000px. Remplace `saint-denis-stade-de-france.jpg` (interieur du stade, refuse le 2026-09-03) — les fichiers `saint-denis-stade-de-france*` ne sont plus references : a supprimer du depot.

---

## Drapeaux (`assets/flags/`) — lot 37 (2026-09-03)

`tn.svg` (Tunisie) et `dz.svg` (Algerie) proviennent du projet **flag-icons** (Panayiotis Lipiridis), tarball npm `flag-icons@7.5.0`, dossier `flags/4x3/`. Licence [MIT](https://github.com/lipis/flag-icons/blob/main/LICENSE). Attribut `id` retire et indentation supprimee, dessin inchange (meme traitement que rw/gh/ke/eg au lot 31).

---

## Lot 37 — Tunisie, Algerie, PAUWES (2026-09-03) : 9 photos de ville + 3 monuments

Regle du catalogue appliquee des le lot : une photo de ville par universite (`assets/images/cities/`, JPEG + WebP + AVIF), un monument par bourse (`assets/images/scholarships/`, JPEG seul), aucune image partagee. Produites par `scripts/add-lot37-photos.mjs` (listes de candidats Unsplash puis Commons, garde de ratio 1,3), chaque image regardee apres telechargement. Deux candidates Unsplash ECARTEES apres examen : Tlemcen `FlRrOkGxAck` (mur de maison anonyme) et Oran `vEob3rMRUcQ` (cour a arcades non identifiable) ; trois fichiers Commons de Tlemcen ecartes par la garde de ratio (portraits).

### Unsplash ([Unsplash License](https://unsplash.com/license))

- `tunis.jpg` — facade pavoisee de Bab Bhar, centre de Tunis. Photographe : Hammami Ghazi (identifiant CDN `photo-1674764186749-ad9beea35e85`, page `6XuI9V3C51I`)
- `carthage.jpg` (Universite de Carthage) — les ruines romaines de Carthage face a la mer. Photographe : Martin Casagrand (identifiant CDN `photo-1728361328876-74e396d3defc`, page `5jaj-mU6VW0`)
- `sousse.jpg` — la medina et le ribat de Sousse en vue aerienne. Photographe : Amal Bourkhis (identifiant CDN `photo-1624921768886-5d12e2cdc584`, page `V87fJdumBY0`)
- `sfax.jpg` — les toits de la medina de Sfax. Photographe : Taha Loukil (identifiant CDN `photo-1594424015009-59bef65fa9ec`, page `WFhrK6g1DKA`)
- `alger-baie.jpg` (USTHB) — la baie d'Alger vue des hauteurs. Photographe : Sid Ahmed SAOUD (identifiant CDN `photo-1652614706616-a49396a2ee29`, page `RCsOlTBX5Tw`)
- `alger-centre.jpg` (Universite d'Alger 1) — place et escaliers d'Alger-Centre. Photographe : Ondrej Bocek (identifiant CDN `photo-1751788109158-a46f8fbacc08`, page `YcJjjAv1TA0`)
- `constantine.jpg` — pont suspendu et gorges du Rhummel, Constantine. Photographe : zenad nabil (identifiant CDN `photo-1664403775784-8a0b32536a0c`, page `fvqCkzsWv-4`)
- `oran.jpg` — Oran, son port et le clocher de Santa Cruz. Photographe : Brahim Abderrahman (identifiant CDN `photo-1653815129496-445487ae0479`, page `jGlnjl6fHhQ`)
- `bourses-cooperation-tunisie.jpg` (dossier `scholarships/`) — Sidi Bou Said, blanc et bleu au-dessus de la mer. Photographe : Noelle Guirola (identifiant CDN `photo-1607869861980-da5f9b8b4969`, page `5NqUXa6pZDM`)
- `bourses-cooperation-algerie.jpg` (dossier `scholarships/`) — le Maqam Echahid (memorial du Martyr), Alger. Photographe : Halima Bouchouicha (identifiant CDN `photo-1658996403259-5a2dd3efc6fa`, page `ESkI6T_Ef5A`)
- `pan-african-university-pauwes.jpg` (dossier `scholarships/`) — le minaret de Mansourah, Tlemcen. Photographe : Halima Bouchouicha (identifiant CDN `photo-1669097564242-3c6c75aea9a0`, page `ysL_MNXjJ_4`)

### Wikimedia Commons (licence CC a attribution obligatoire, a conserver tant que ce fichier est utilise)

- `tlemcen.jpg` (Universite Abou Bekr Belkaid) — la muraille crenelee de Mansourah, Tlemcen. Auteur : Sambott27, [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/deed.en). Source : [File:Muraille de mansourah,Tlemcen..jpg](https://commons.wikimedia.org/wiki/File:Muraille_de_mansourah,Tlemcen..jpg). Original 3615x1930 (ratio 1,87), redimensionne a 2000px.
