# Tester avec l'émulateur Firebase local

Permet de tester le site en conditions quasi réelles (vraie authentification,
vrai Firestore, vrai flux d'ajout de candidature, etc.) **sans jamais toucher
le Firestore/Auth de production** et sans dépendre d'un accès internet vers
Firebase.

## Prérequis (une fois)

1. **Un JDK** — l'émulateur Firestore tourne sur une JVM. Si `java -version`
   échoue :
   ```
   winget install --id EclipseAdoptium.Temurin.21.JDK -e
   ```
   Le PATH mis à jour par l'installeur ne s'applique qu'aux **nouveaux**
   terminaux — ferme et rouvre le tien après l'install.

2. **Les dépendances npm** (`firebase-tools`, `firebase-admin`, `cross-env`) :
   ```
   npm install
   ```

## Lancer un test

Trois terminaux (ou un seul enchaînant les étapes) :

**1. Démarrer les émulateurs** (reste ouvert, sert Auth :9099, Firestore :8080,
UI :4000) :
```
npm run emulators
```
Vérifie sur http://localhost:4000 que les deux émulateurs sont listés comme
actifs.

**2. Créer/réinitialiser le compte de test** (peut être relancé à tout
moment — vide aussi `applications` pour repartir propre) :
```
npm run seed:emulator
```
Affiche les identifiants à la fin :
```
email    : test.essentiel@scholarbridge.local
password : TestEssentiel123!
```
Ce compte a la formule `essentiel` (quota : 3 candidatures accompagnées).
Pour tester une autre formule, modifie `TEST_USER.plan` dans
`scripts/seed-emulator.mjs` (valeurs possibles : voir `PLAN_ORDER` dans
`js/plan-features.js`).

**3. Servir le site** (n'importe quel serveur statique servant la racine du
dépôt sur `localhost`, ex. le serveur de preview déjà utilisé pendant le
développement) et ouvrir une page avec `?useEmulator=1` dans l'URL, par
exemple :
```
http://localhost:5173/login.html?useEmulator=1
```
Se connecter avec les identifiants ci-dessus.

## Comment ça reste étanche à la production

`firebase-config.js` ne se connecte aux émulateurs que si **les deux**
conditions suivantes sont vraies :
- `location.hostname === "localhost"`
- le paramètre d'URL `useEmulator=1` est présent

Le domaine réel du site ne correspond jamais à `localhost`, donc cette
branche est **structurellement inatteignable** en production, quelle que
soit l'URL. Un avertissement console (`[Fitz] Connecté aux
émulateurs Firebase locaux...`) confirme quand c'est actif.

`scripts/seed-emulator.mjs` refuse de s'exécuter si les variables
`FIRESTORE_EMULATOR_HOST` / `FIREBASE_AUTH_EMULATOR_HOST` ne sont pas
définies (raison pour laquelle il faut toujours passer par
`npm run seed:emulator`, jamais lancer le fichier directement) — ces
variables sont ce qui redirige réellement le SDK Admin vers l'émulateur.

Les émulateurs sont des processus 100% locaux et éphémères : sans export
explicite (`firebase emulators:export`), toutes les données créées pendant
un test disparaissent à l'arrêt du process `npm run emulators`.

## Limite connue du harnais de test

La persistance de session Firebase Auth ne survit pas de façon fiable à une
navigation complète vers une page qui ne porte pas `?useEmulator=1` (ex. le
`window.location.href = "dashboard.html"` codé en dur dans `login.js` après
connexion). Pour un test scripté fiable, se (re)connecter via le SDK
directement sur la page cible plutôt que de suivre la redirection du
formulaire — voir l'historique de session du 2026-08-07 pour un exemple. Ce
n'est une limite que du harnais de test, pas du comportement réel de
l'application pour un utilisateur qui clique normalement d'une page à
l'autre en production.

## Exemple observé (4e candidature bloquée, formule Essentiel)

Testé le 2026-08-07 : 3 candidatures ajoutées via le vrai formulaire
(`applications.html`, bouton "Nouvelle candidature"), la 4e a déclenché
l'alerte réelle du code (`applications.js`) :

> Votre formule Essentiel permet d'accompagner 3 candidatures à la fois.
> Terminez-en une, ou passez à une formule supérieure pour en suivre
> davantage.

Confirmé côté Firestore (émulateur) : exactement 3 documents sous
`users/{uid}/applications` après la tentative — la 4e n'a jamais été écrite.

## Créer un compte de test manuellement (depuis le retrait de signup.html)

Le seed (`npm run seed:emulator`) reste le moyen le plus rapide de créer un
compte de test AVEC une formule déjà active (`plan` posé directement via le
SDK Admin, qui contourne les rules — impossible à faire depuis le
navigateur, voir plus bas). Mais pour tester le vrai parcours d'inscription
tel qu'un visiteur le vit désormais (uniquement via `payment.html`) :

1. Émulateurs démarrés (`npm run emulators`).
2. Ouvrir `http://localhost:5173/payment.html?plan=essentiel&useEmulator=1`
   (ou tout autre id de `SCHOLARBRIDGE_PLANS`, voir `pricing-plans.js`).
3. Remplir la section "Votre compte" (visible car aucune session n'est
   active) puis choisir un moyen de paiement et valider.
4. Le compte créé n'a **jamais** de champ `plan` — seulement `pendingPlan`
   (voir payment.js/ensureAccount()). C'est intentionnel : tant que le vrai
   backend de paiement n'existe pas, aucun flux ne doit accorder un accès
   payant réel. Pour activer manuellement ce compte de test après coup
   (simuler ce que fera un jour le backend, ou ce que fait déjà un admin
   via le Control Center) :
   ```
   FIRESTORE_EMULATOR_HOST=localhost:8080 node -e "
   const { initializeApp } = require('firebase-admin/app');
   const { getFirestore } = require('firebase-admin/firestore');
   initializeApp({ projectId: 'scholarbridge-e0d84' });
   getFirestore().collection('users').doc('UID_ICI').update({ plan: 'essentiel' });
   "
   ```
   (Le SDK Admin contourne firestore.rules — c'est la seule façon légitime
   de poser `plan`, que ce soit dans l'émulateur ou en production, tant
   qu'aucune Cloud Function de paiement n'existe.)

**Tester l'exception propriétaire** (accès complet sans payer, voir
`js/access-guard.js`) — marquer un compte comme admin, toujours via le SDK
Admin (jamais possible depuis le client, `firestore.rules` l'interdit
explicitement) :
```
FIRESTORE_EMULATOR_HOST=localhost:8080 node -e "
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
initializeApp({ projectId: 'scholarbridge-e0d84' });
getFirestore().collection('admins').doc('UID_ICI').set({ isActive: true });
"
```
Un compte ainsi marqué résout toujours sur la formule la plus complète
(`resolveSession()`), sans jamais avoir de champ `plan` posé sur son propre
document.

**Vérifier que la faille refermée le 2026-08-07 reste fermée** (un visiteur
ne peut plus s'auto-attribuer une formule à la création de son compte) :
depuis la console du navigateur, sur une page connectée à l'émulateur,
`createUserWithEmailAndPassword` puis `setDoc(doc(db,"users",uid), {..., plan:"signature"})`
doit échouer avec `permission-denied`. La même écriture sans le champ
`plan` (ex. avec `pendingPlan` à la place) doit réussir.
