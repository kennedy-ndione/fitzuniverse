# Brancher une vraie IA sur Fitz

*Dernière mise à jour : 2026-08-23*

Ce document décrit ce qu'il reste à faire pour remplacer le simulateur par un vrai fournisseur (OpenAI, Anthropic, Gemini…), et — surtout — ce qui est **déjà fait** pour que ce jour-là ne soit pas une réécriture.

---

## En une phrase

Passer `MODE` de `"simule"` à `"passerelle"` dans `js/ai/ai-config.js`, renseigner `ENDPOINT`, déployer la Cloud Function. **Aucune page n'a à bouger.**

---

## La couture

Six pages appellent Fitz : `ai-chat.js`, `ai-letter.js`, `ai-email.js`, `ai-translate.js`, `ai-check.js`, `applications.js`. Toutes passent par la **seule** fonction `generate()` de `js/ai/ai-client.js` et ne savent rien de ce qui se trouve derrière.

```
                     ┌─ ai-simulateur.js  → simulated-responses.js   (aujourd'hui)
page → generate() ───┤
                     └─ ai-gateway.js     → passerelle → fournisseur  (demain)
```

| Fichier | Rôle |
|---|---|
| `js/ai/ai-config.js` | **Le seul fichier à modifier.** Mode, endpoint, délais, réessais, limites. |
| `js/ai/ai-client.js` | Le contrat. Délai, réessai, validation, normalisation des erreurs. |
| `js/ai/ai-errors.js` | Les onze façons dont Fitz peut échouer, et le message français de chacune. |
| `js/ai/ai-simulateur.js` | L'adaptateur d'aujourd'hui. |
| `js/ai/ai-gateway.js` | L'adaptateur de demain. Écrit, testé sur sa forme, inactif. |
| `js/ai/prompts.js` | `buildPrompt(task, input) → {system, user}`. Déjà à la forme attendue par les API de chat. |

---

## Ce que `generate()` garantit, quel que soit l'adaptateur

1. **La forme du retour** — `{text}` pour les tâches de rédaction, `{data}` pour `check` et `readiness`. Jamais l'une pour l'autre.
2. **Les erreurs** — toujours une `FitzError` avec un code stable. Jamais un message technique en anglais devant l'étudiant.
3. **L'arrêt** — `signal` interrompt la génération ; l'erreur levée est reconnaissable par `estArret()`.
4. **Le délai** — aucune génération ne laisse attendre indéfiniment, même si le fournisseur ne répond plus jamais. Le délai est **par tâche** : 30 s pour le chat, 120 s pour l'analyse de dossier.
5. **Le réessai** — deux tentatives sur les échecs passagers (réseau, 5xx, surcharge), aucune sur les autres.
6. **La progression** — `onToken(texteComplet, delta)` et `onEtat("envoi" | "reflexion" | "redaction" | "reessai")`.

---

## ⚠️ La clé d'API ne va jamais dans le navigateur

Tout ce qui vit dans `js/` est téléchargé par chaque visiteur et lisible via « Afficher la source ». Une clé écrite là serait publique en quelques minutes et facturée à FitzUniverse jusqu'à sa révocation.

D'où la passerelle :

```
navigateur → passerelle FitzUniverse → fournisseur
             (détient la clé,
              vérifie le jeton Firebase,
              contrôle l'offre et le quota)
```

Ce détour n'est pas qu'une précaution. C'est aussi le **seul** endroit où le quota par offre peut être appliqué de façon fiable : une vérification faite dans le navigateur se contourne en une ligne depuis la console. Le contrôle qui vit dans `ai-client.js` est un confort d'affichage — il évite une requête inutile et affiche le bon message ; il ne protège rien.

Un test automatique (`test/ai-client.test.mjs`) refuse toute clé `sk-…`, `sk-ant-…` ou `AIza…` collée dans ces fichiers.

---

## Ce que la passerelle doit renvoyer

Un flux **Server-Sent Events**, un événement par ligne :

```
data: {"delta":"Bonjour"}
data: {"delta":" Aminata"}
data: {"usage":{"entree":812,"sortie":465}}
data: [DONE]
```

Pour une tâche structurée (`check`, `readiness`), un seul événement portant l'objet complet :

```
data: {"data":{"overallScore":78,"categories":{...}}}
data: [DONE]
```

**En cas d'échec : un statut HTTP parlant**, pas un `200` contenant un message d'erreur. Le navigateur doit distinguer « quota épuisé » de « panne » sans lire le corps.

| Statut | Code Fitz | Ce que voit l'étudiant |
|---|---|---|
| 401 / 403 | `AUTH` | « Fitz est momentanément indisponible. Notre équipe est prévenue. » |
| 402 | `QUOTA_PLAN` | « Votre formule ne couvre plus cette demande ce mois-ci. » |
| 408 / 504 | `DELAI` | « Fitz a mis trop de temps à répondre. Relancez. » |
| 413 | `ENTREE_TROP_LONGUE` | « Découpez-le en deux parties, puis relancez. » |
| 422 | `CONTENU_REFUSE` | « Reformulez votre demande, ou retirez la pièce jointe. » |
| 429 | `QUOTA_FOURNISSEUR` | « Fitz est très sollicité. Le problème est de notre côté. » |
| ≥ 500 | `FOURNISSEUR_INDISPONIBLE` | « Fitz ne répond pas pour l'instant. » |

Le `402` et le `429` disent tous deux « quota », mais l'un est celui de l'étudiant et l'autre le nôtre. Les confondre donnerait le mauvais conseil dans les deux sens — c'est vérifié par un test.

---

## Pourquoi ces onze erreurs existent déjà

Avant, chaque page affichait le même message : *« la génération n'a pas abouti cette fois — réessayez »*.

Ce message est **faux** dans la majorité des cas dès qu'un vrai fournisseur répond. Un étudiant à qui l'on dit « réessayez » alors que son quota est épuisé réessaiera — dix fois — puis conclura que le site est cassé. Celui dont le texte dépasse la limite du modèle doit le raccourcir, pas réessayer. Seul celui dont la connexion a lâché doit réessayer.

Chaque code porte donc aussi `reessayable` (le client relance-t-il tout seul ?) et `signalable` (faut-il prévenir l'équipe ?). Un quota atteint est un fonctionnement normal de l'offre gratuite : le remonter comme une panne noierait les vraies pannes.

---

## Étapes du branchement

1. **Choisir le fournisseur et le modèle.** Renseigner `MODELE.nom` dans `ai-config.js`.
2. **Écrire la Cloud Function** dans le projet Firebase existant : vérifie le jeton `Authorization`, lit l'offre de l'étudiant dans Firestore, contrôle le quota, appelle le fournisseur, renvoie le flux SSE ci-dessus. La clé vit dans la configuration de la fonction, jamais dans le dépôt.
3. **Renseigner `ENDPOINT`** avec l'URL de la fonction déployée.
4. **Vérifier les réponses structurées.** `CHAMPS_REQUIS` dans `ai-client.js` liste ce sans quoi l'affichage casse (`overallScore` + `categories` pour `check`, `ready` + `missingItems` pour `readiness`). Un modèle qui renvoie du JSON entouré de prose doit produire `REPONSE_INVALIDE`, pas une page affichant « undefined ». Demander au fournisseur une sortie JSON stricte (`response_format` / *tool use*) plutôt que d'espérer.
5. **Passer `MODE` à `"passerelle"`.**
6. **Lancer `npm test`.** Les tests de forme, d'erreurs et de garde-fous ne dépendent pas de l'adaptateur.

---

## Ce qui reste ouvert

- **Le quota au nombre d'appels.** Le contrôle d'accès d'aujourd'hui est binaire (« lettres : oui / non »). Le crochet `verifierAcces()` dans `ai-client.js` est vide et attend le jour où l'offre dira « dix lettres par mois ». Le remplir ne touchera aucune page.
- **La comptabilisation des jetons.** `generate()` renvoie déjà `usage` quand l'adaptateur le fournit ; personne ne le lit encore. C'est ce qui permettra de facturer et de mesurer.
- **`onEtat("reflexion")`** est prévu dans le contrat mais jamais émis : le simulateur n'a pas de phase de réflexion distincte. Un modèle avec raisonnement en aura une.
