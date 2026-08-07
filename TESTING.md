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
soit l'URL. Un avertissement console (`[ScholarBridge] Connecté aux
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
