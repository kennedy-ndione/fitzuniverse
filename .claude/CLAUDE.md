# FitzUniverse : consignes pour toute session Claude

Ce fichier est lu automatiquement au démarrage d'une session Claude Code (sur le PC de Charles ou dans le cloud). Il contient les règles du projet que le code ne dit pas. **En cas de doute, s'arrêter et demander plutôt que deviner.**

Écrit le 24/09/2026. Si une règle ci-dessous contredit une consigne explicite de Charles dans la session, c'est Charles qui a raison. Signale alors la contradiction pour qu'on mette ce fichier à jour.

---

## 1. Le projet en bref

- **FitzUniverse** : la plateforme (entreprise, catalogue, service, équipe). **Fitz** : l'assistant IA, et lui seul. Test : « le site / l'équipe » → FitzUniverse ; « il vous répond / il analyse » → Fitz.
- Site statique servi par Firebase Hosting, données dans Firestore. Projet Firebase : `scholarbridge-e0d84` (ancien nom, ne pas renommer les identifiants `scholarbridge*`).
- Domaine : fitzuniverse.com. Dépôt privé : github.com/kennedy-ndione/fitzuniverse, branche `main`.
- Public : tout étudiant, où qu'il soit dans le monde (pas seulement le Sénégal). Beaucoup lisent sur téléphone, avec un réseau d'Afrique de l'Ouest.
- Tout le texte visible est **en français**.

## 2. Interdits absolus

1. **Jamais de `firebase deploy`** depuis une session cloud. Le déploiement se fait uniquement sur le PC de Charles.
2. **Jamais de `node scripts/lot.mjs ecrire`** (ni `analyser`, `verifier`, `export`) depuis le cloud. Ces commandes utilisent la session `firebase login` du PC. **Aucun fichier de clé de compte de service, jamais**, nulle part.
3. **Jamais de modification des dépendances dans le cloud** (`npm install <paquet>`, `npm audit fix`, `npm update`). Le npm du cloud réécrit `package-lock.json` autrement que celui du PC. Si une dépendance pose problème : le signaler, ne pas corriger.
4. **Aucune donnée d'étudiant dans git** : `sauvegardes/` reste ignoré. Ne jamais committer d'export de `users`, `messages`, `payments` ou `admins`.
5. **Tout nouveau fichier ou dossier à la racine est publié en ligne par défaut** (`firebase.json` : `"public": "."`, liste noire). `test/hosting-publie.test.mjs` échoue si un fichier inattendu part en ligne. Ne jamais élargir la liste blanche de `scripts/hosting-publie.mjs` pour faire passer ce test : ajouter plutôt l'exclusion dans `hosting.ignore`.
6. **Ne jamais fusionner une pull request soi-même.** Charles la montre d'abord à Claude (session Cowork du projet) pour relecture.
7. Ne pas lancer `git add -A` pendant qu'un autre agent édite le dossier.

## 3. Ce qu'une session cloud fait bien, et comment livrer

- Bon usage : les chantiers de **code pur** qui touchent beaucoup de fichiers (tests transverses, nettoyage de code mort, audits de performance ou d'accessibilité), et les **brouillons de recherche** marqués « à vérifier ».
- Livraison : une branche + une pull request, avec en description ce qui a changé, pourquoi, et le résultat de `npm test`.
- Après fusion, Charles fait `git pull` sur son PC avant tout lot suivant.

## 4. Tests

- `npm test` doit rester **entièrement vert** (1521 tests au 24/09/2026, 0 échec). Un changement qui casse un test n'est pas fini.
- Ne jamais affaiblir un test pour le faire passer (plancher abaissé, assertion retirée, liste blanche élargie). Si un test semble faux, l'expliquer dans la PR.
- Les avertissements `MODULE_TYPELESS_PACKAGE_JSON` sont du bruit. Ne pas ajouter `"type": "module"` à `package.json` : certains scripts sont peut-être en CommonJS.

## 5. Voix et rédaction

- **Voix d'entreprise** : le site parle au nom de FitzUniverse, **jamais « je »**, y compris dans les données du catalogue (descriptions, notes, procédures).
- **Vouvoiement** de l'étudiant, partout.
- Charte complète : `REDACTION.md`. Système visuel : `DESIGN_SYSTEM.md`.

## 6. Doctrines produit (ne pas les défaire en « simplifiant »)

- **Aucun cadenas pour le visiteur non abonné** : pas de mention d'une porte fermée, pas d'aperçu grisé. Il voit le site public, point.
- **Aucun lien WhatsApp** sur le site. La messagerie FitzUniverse (temps réel) est ouverte à **tous les comptes**, gratuits compris.
- Le compte se crée **gratuitement**, pas seulement au paiement.
- **Fitz choisit** les universités ; l'étudiant accepte ou refuse (2 refus maximum par place). Il ne choisit pas lui-même dans une liste.
- Logo : l'accent du symbole est le **littéral `#E9A319`**. Ne jamais le remplacer par `var(--amber-500)` : trois feuilles redéfinissent cette variable en terracotta.
- Piège CSS : `css/base.css` donne `padding: 110px 0` et `overflow: hidden` à **tout** élément `<section>`. Ne pas utiliser `<section>` comme simple conteneur.

## 7. Données du catalogue (bourses, universités, programmes)

### Sources
- **Sources officielles uniquement** : site de l'établissement, ministère, agence nationale. **Agrégateurs interdits** (unipage, mastersportal, studyportals, etc.). Pour le rang mondial : topuniversities.com, **QS 2027**.
- Une source doit **s'ouvrir depuis l'Afrique de l'Ouest**. Une session cloud lit internet depuis l'étranger et **ne peut pas le garantir** : toute donnée qu'elle trouve est un **brouillon**, marqué « à vérifier au navigateur ». Elle n'entre dans un lot qu'après relecture depuis le réseau de Charles.
- Si une page officielle ne répond pas, sa copie web.archive.org peut servir, en le disant.
- Un outil de lecture automatique a déjà **inventé des faits** : chaque citation qui entre dans un lot doit avoir été relue sur la page elle-même.
- Chaque fait porte sa source et sa date de vérification (`source`, `verifieLe`).

### Prix
- Le **montant retenu** est celui que l'étudiant paie **par défaut** :
  - exonération systématique → montant après exonération ;
  - exonération à demander → tarif plein, le montant réduit va dans la note.
- Pas trouvé → `NON_TROUVE`. **Jamais d'estimation.**
- Une grille de plus de deux ans ne va pas dans `fraisScolarite` (au besoin, dans `admission.coutIndicatif`).
- Une devise nouvelle exige un seuil dans `js/frais.js` **et** dans `test/frais.test.mjs` (taux BCE daté).
- **Langue d'enseignement** : écrite seulement si une page officielle la donne.

### Fiche d'université complète
Champs lus par `universite.html` et `js/fiche-universite.js` :
- `name`, `city`, `country`, `province`, `flag`, `image`, `officialWebsite`, `description`, `fields`, `ranking`, `reconnaissance`, `langueEnseignement` ;
- `fraisScolarite { source, verifieLe, note, licence/master/doctorat { montant, devise, periode } }` ;
- `exoneration { politique: systematique | possible_plafonnee | aucune | inconnue, detail (≤ 450 caractères), source, verifieLe }` ;
- `admission { procedure, conditions, calendrier, langue, fraisDossier, coutIndicatif?, sources[], verifieLe }` ;
- selon le pays : `voieAdmission` (Maroc), `numeroEED` (Canada).

La qualité passe avant le nombre : on écarte un établissement dont on ne sait pas dire comment un étudiant étranger y entre. Modèles de référence : les lots Maroc et Canada (76-77, 82-83).

### Photos (règle permanente de Charles)
- Chaque université a **sa** photo : **la ville**, vue de l'**extérieur**. Chaque bourse a **sa** photo : **un monument** de la ville.
- **Jamais deux cartes avec la même image**, ni le même sujet (Louvre de jour et Louvre de nuit = doublon).
- Un intérieur (nef, salle, crypte…) n'est jamais une photo de ville. Licence, ratio et nom de fichier ne disent rien du sujet : **il faut regarder la photo**.
- Sources : Unsplash ou Wikimedia Commons (CC BY / CC BY-SA). Largeur ≥ 1600 px.
- Chaque photo est créditée dans `CREDITS.md` (format `- **Photographe** :`), puis `node scripts/credits-html.mjs` régénère `credits.html`.
- Le choix final des photos se fait avec Charles, jamais seul.

### Écrire un lot (`scripts/data/lotNN-nom.mjs`)
- Exports : `UNIVERSITIES`, `SCHOLARSHIPS`, `LINKS`, `PATCHES`.
- **Piège `attendu`** : il doit porter l'objet **complet**. Un champ absent de la base vaut `undefined`, pas `""`.
- Tout champ nouveau doit apparaître dans `lot.mjs export` (sérialisé avec `?? null`), sinon personne ne peut l'auditer.
- Relever le plancher du pays dans `test/pays-preinscription.test.mjs`. Ce test échoue tant que l'export n'a pas été refait sur le PC : c'est normal.
- `index.html` : le bloc de préchargement est généré par `node scripts/precharger.mjs`, jamais à la main.

## 8. Fichiers à fins de ligne Windows (CRLF)

Conserver les fins de ligne d'origine de chaque fichier. Sont en CRLF, entre autres : `css/opportunites.css`, `js/opportunites-bandeau.js`, `test/lot-patches.test.mjs` (en partie), `TESTING.md`. Vérifier avant d'écrire.

## 9. Mobile

Chaque changement visible doit tenir sur téléphone (iOS et Android) : clavier qui s'ouvre, largeur étroite, réseau lent. Le harnais `npm run verifier` mesure le rendu sur deux moteurs (Chromium et WebKit).

## 10. Exécution sur le PC de Charles (pour mémoire, jamais depuis le cloud)

Rappeler la sauvegarde avant chaque lot qui écrit dans la base :
1. `npx firebase firestore:backups:list` : la sauvegarde du jour doit être là.
2. `node scripts\add-lotNN-photos.mjs` s'il y a des photos.
3. `node scripts\lot.mjs analyser NN-nom 2>&1` (nom sans le préfixe « lot » ; `2>&1` indispensable sous Windows).
4. `… ecrire NN-nom 2>&1`, puis `… verifier NN-nom 2>&1` : N OK, 0 écart.
5. `node scripts\lot.mjs export`, `node scripts\sitemap.mjs`, `npm test`.
6. `git add -A`, `git commit`, `npx firebase deploy --only <cibles exactes>`, `git push`.
   Les cibles se déduisent des fichiers touchés : `hosting` pour le site, `functions:<nom>` pour une fonction, `firestore:rules` pour les règles.
7. Vérifier l'effet **à l'écran**, en ligne. Un lot n'est vérifié que quand on voit le changement sur le site.
