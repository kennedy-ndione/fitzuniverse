# FitzUniverse / Fitz — Design System

Source unique de vérité : [`css/base.css`](css/base.css). Toute page consomme ces tokens et composants ; aucune page ne redéfinit sa propre couleur, son propre rayon, sa propre ombre ou son propre bouton/carte/champ/badge.

## Principe directeur

Simple, élégant, extrêmement cohérent — plutôt que spectaculaire. Chaque effet visuel doit avoir une raison fonctionnelle (hiérarchie, lisibilité, feedback d'interaction). Si un effet est purement décoratif et qu'on peut l'enlever sans rien perdre, on l'enlève.

**Refonte 2026-08 — palette bleu profond / violet discret / gris modernes** (remplace l'ancien marron/or) : élégante, premium, minimaliste, intemporelle. La couleur ne sert plus qu'à signaler une action ou un état vraiment important — par défaut, icônes/cartes/stats passent en gris neutre.

Piliers à ne jamais réintroduire sans raison :
- **Glassmorphism léger** (`.glass-panel`) — désormais le traitement par défaut de la sidebar, du topbar et des modales du shell authentifié (voir `dashboard.css`), mais toujours avec parcimonie ailleurs (jamais comme décor par défaut sur une carte de contenu classique).
- **Trois dégradés, pas plus** (`--gradient-primary`, `--gradient-hero`, `--gradient-fitz`) — jamais de nouveau blob radial ou de copie approximative d'un dégradé existant.
- **Pas d'animation continue sauf le halo Fitz** — c'est la seule signature animée en boucle du site.

## Couleurs

| Rôle | Token | Valeur |
|---|---|---|
| Primaire (bleu profond) | `--primary-600` | `#33418C` |
| Primaire hover | `--primary-700` | `#262F6B` |
| Primaire foncé | `--primary-900` | `#12162E` |
| Primaire très clair (fond de badge/tag) | `--primary-50` | `#EEF0FB` |
| Accent (violet discret) | `--accent-500` | `#7E71D8` |
| Accent foncé (texte sur fond clair) | `--accent-600` | `#6459B8` |
| Accent très clair | `--accent-100` | `#EEEAFB` |
| Succès / Avertissement / Danger | `--success` / `--warning` / `--danger` | `#22C55E` / `#EAA83D` / `#EF4444` |
| Texte principal / secondaire / discret | `--text-color` / `--text-light` / `--text-muted` | `#1A1714` / `#57514A` / `#6E6760` |
| Fonds | `--background` / `--background-soft` / `--background-alt` | `#FDFCFA` / `#F8F6F2` / `#F1EEE8` |
| Bordure | `--border-color` | `#E5E1D9` |

**Neutres PAPIER CHAUD depuis le 2026-08-28.** Toute l'échelle neutre est passée du slate froid (bleuté : `#0F172A`, `#FFFFFF`, `#E2E8F0`…) à un papier chaud, à luminosité constante — les rapports de contraste validés à l'audit AA du 2026-08-02 sont conservés. Deux conséquences à connaître :

- `--gradient-hero` (le fond de `body`) posait **deux voiles radiaux bleu/violet** (`#E9EBFA`, `#F0EDFB`) sur blanc pur : c'est ce qui donnait sa dominante froide au « fond blanc » du site. Recoloré en papier.
- Les ombres portent désormais `rgba(26,23,20,…)` et non `rgba(15,23,42,…)` : une ombre bleue sur un fond chaud se lit comme une salissure, pas comme un relief.
- `dashboard.css` **redéclare** ces tokens et a été aligné en même temps ; sans quoi le site public serait chaud et l'espace étudiant froid, avec la bascule visible à la connexion. **Non vérifié visuellement** (mur d'authentification) — à contrôler à la prochaine session connectée.

Le bleu `--primary-*` et le violet `--accent-*` restent définis et consommés par des composants (boutons, badges), mais **aucune grande surface du site n'est plus bleue** : voir `--gradient-deep` (graphite) et le sur-titre `.kicker` (or).

**Règle** : un état sémantique (succès/erreur/avertissement) n'a **qu'une seule teinte** dans tout le site. Ne pas introduire de vert/rouge/violet "un peu différent" pour une carte spécifique — utiliser le token à une opacité différente (`rgba(34,197,94,.12)` etc., déjà fait dans `.badge-success`/`.alert-success`) plutôt qu'une nouvelle valeur hex.

**`--accent-*` est rare par nature** : réservé aux éléments qui signalent vraiment quelque chose d'important (badge "nouveau", highlight ponctuel, `.card--featured`). Jamais utilisé comme couleur d'icône par défaut sur une carte générique, une stat, ou un élément de navigation neutre — ceux-là restent en gris (`--text-muted`/`--background-alt`).

**Exceptions documentées (pas des violations)** : logos de marques tierces dans des contextes très ciblés — WhatsApp `#25D366` (lien CTA), Visa `#1A1F71` (logo carte de paiement). Ces couleurs appartiennent à l'identité visuelle de tiers, pas à la palette FitzUniverse ; elles restent scoped à leur icône/logo uniquement. Fitz (ci-dessous) est aussi une exception volontaire et documentée, pas une dérive.

**Thème app shell (dashboard/admin)** : deux jeux de tokens `--shell-*` distincts, tous deux nommés pareil mais définis à des endroits différents :
- `css/base.css` définit les valeurs neutres d'origine (slate, fond sombre), consommées par `admin/control-center.css` et `admin/login.css` — **l'admin n'est volontairement pas concerné par la refonte claire/glass du shell étudiant**, il garde son thème sombre actuel.
- `dashboard.css` **redéclare localement** ces mêmes noms de tokens — depuis la refonte 2026-08-20, avec la palette claire de `css/base.css` (`--shell-bg:#FFFFFF` etc.) plutôt qu'un thème sombre dédié, pour rester cohérent avec le reste du site (hero, catalogue). Cette redéclaration ne s'applique qu'aux pages qui chargent `dashboard.css` (tout le shell étudiant : dashboard, profil, compte, documents, candidatures, pages Fitz, universités, bourses). Sidebar et topbar utilisent en plus `--glass`/`backdrop-filter` pour l'effet verre dépoli.

Une nouvelle page du shell étudiant surcharge les tokens standards avec ceux de `dashboard.css` dans son propre scope ; elle n'invente pas de nouvelles valeurs et ne touche pas à `css/base.css`.

## Espacement — grille 8pt

`--space-2xs` (4px) · `--space-xs` (8px) · `--space-sm` (16px) · `--space-md` (24px) · `--space-lg` (40px) · `--space-xl` (72px) · `--space-2xl` (120px)

Les petits tokens (2xs/xs/sm) servent à l'intérieur des composants (gaps d'icône, padding de bouton/champ) ; les grands (lg/xl/2xl) servent à la mise en page (marges de section). Un composant ne doit jamais hardcoder un padding/gap en dur quand un de ces tokens correspond.

## Rayons de bordure

`--radius-xs` 6px (puces/tags) · `--radius-sm` 10px (champs, petits boutons) · `--radius-md` 14px (boutons, cartes par défaut) · `--radius-lg` 20px (grandes cartes, modales) · `--radius-full` 999px (pastilles/avatars)

## Ombres (élévation)

`--shadow-xs` → `--shadow-lg`, du plus discret au plus marqué, toujours sobres (flou et opacité réduits par rapport à l'ancien système). Une carte "mise en avant" (`.card--featured`) se distingue par une **bordure d'accent**, pas par une ombre plus grosse.

## Transitions

`--ease-standard` (`cubic-bezier(.4,0,.2,1)`) est l'easing par défaut de `--transition` et de tous les composants. `--ease-premium` (plus "rebondi") est réservé au halo Fitz et aux quelques moments de signature déjà en place — ne pas l'utiliser comme easing par défaut d'un nouveau bouton/carte.

## Typographie

Le site a **deux régimes typographiques**, et c'est délibéré.

**Site public** — Sora (titres, `--font-display`) + Inter (texte, `--font-body`), définis dans `base.css`. C'est la voix qui convainc : titres larges, contrastes forts.

**Espace étudiant** — Plus Jakarta Sans (`--font-product`) pour tout, Space Grotesk (`--font-affirmation`) pour les seuls titres de page. Défini dans `css/app-typography.css`, chargé **en dernier** sur les treize pages de l'espace connecté. C'est la voix qui accompagne : plus étroite, plus dense, faite pour être lue longtemps plutôt que parcourue.

Le titre de page vit dans **`.topbar-title h1`**, sur les treize pages sans exception. La première version de cette règle visait `.dashboard-greeting h1` et `.page-title` — deux sélecteurs qui n'existent nulle part — et n'atteignait donc Space Grotesk que sur quatre en-têtes internes (`.ai-page-header h1`). Corrigé le 2026-08-23. Un sélecteur qui ne correspond à rien ne se voit pas en relisant le CSS : il faut mesurer la police calculée, page par page.

L'espace étudiant était resté sur Inter jusqu'au 2026-08-23 — d'où l'écart de rendu visible entre le fil de discussion de Fitz et le reste de l'interface.

Échelle à 14 rôles déjà en place dans `base.css` (hero, h1-h5, lead, body, small, caption, button, label, page-title, subtitle, card-title, badge, nav, footer, meta, stat). Consommer le rôle existant le plus proche plutôt qu'introduire une nouvelle taille locale.

## Composants

- **`.btn`** — `.btn-primary` / `.btn-secondary` / `.btn-ghost` / `.btn-danger`, tailles `.btn-sm` / (défaut) / `.btn-lg`. Hover sobre (fond + léger lift). **Pas d'effet de sweep/brillance animée** — retiré volontairement.
- **`.card`** — `.card--featured` (bordure d'accent + shadow-md/lg), `.card--subtle` (secondaire/désactivé). Toute "carte" spécifique à une page (carte université, carte bourse, carte outil Fitz...) doit étendre `.card`, pas réinventer sa structure.
- **`.field`** — le seul système de champ de formulaire du site : `<div class="field"><label>…</label><div class="field-control"><i data-lucide="…"></i><input/></div><p class="field-hint">…</p></div>`. `.field-control` est optionnel si pas d'icône. `.field.has-error` pour l'état d'erreur.
- **`.badge`** — `.badge-success` / `.badge-warning` / `.badge-danger` / `.badge-neutral`.
- **`.alert`** — `.alert-success` / `.alert-warning` / `.alert-danger`.
- **`.table`** — bordures, en-tête en majuscule discret, survol de ligne.
- **`.modal-base`** — structure de modale (`.modal-card`, `.modal-header`, `.modal-close`).
- **`.glass-panel`** / **`.glass-panel--dark`** — seule recette de verre dépoli, à utiliser avec parcimonie.

## Catalogue (bourses & universités)

`css/catalog.css` est la source unique des composants partagés par `scholarships.html` et `universities.html` : bannière, barre de filtres, raccourcis pays, groupes par pays, grille, puces, squelettes, états vides. Ces deux pages s'enchaînent (une bourse mène à ses universités partenaires) : elles doivent se ressembler au pixel, et une correction sur l'une doit valoir pour l'autre.

Avant l'extraction (2026-08-22), le bloc `.catalog-*` était recopié dans les deux feuilles — 349 lignes identiques à deux marges près — et les mêmes composants existaient en double sous deux noms (`.bourses-results-count`/`.uni-results-count`, `.scholarship-card-chip`/`.uni-card-chip`, `.bourses-empty-state`/`.uni-empty-state`…). Les anciens noms sont conservés en **alias** dans les listes de sélecteurs : le JS des deux pages n'a rien eu à changer. Toute nouvelle règle s'écrit sous `.catalog-*`.

**Ne jamais redéfinir un de ces composants dans `scholarships.css` ou `universities.css`.** Ces feuilles sont chargées après `catalog.css` : une règle réintroduite chez elles écrase silencieusement le système commun sur une seule des deux pages — exactement la dérive que l'extraction a corrigée. Il ne reste dans chacune que **sa carte**.

Trois pièges rencontrés, à ne pas réintroduire :

- **`section { padding:110px 0; overflow:hidden }`** (css/base.css) s'applique à tout élément `section`, y compris ceux que le JS crée. Les groupes pays héritaient de 220 px de rembourrage chacun — près de deux écrans de blanc sur dix pays — et l'`overflow:hidden` d'une `<section>` englobante empêchait la barre de filtres collante de s'accrocher à la fenêtre. `.catalog-country-group` remet le rembourrage à zéro, `.catalog-body` remet l'overflow à `visible`.
- **La classe de grille sur le conteneur de résultats.** Le JS n'y insère pas des cartes mais des `<section>` pays, chacune avec sa propre grille : chaque groupe devenait une case d'une grille à 3 colonnes. Sur universities.html, trois pays s'affichaient côte à côte comme des colonnes de journal ; sur scholarships.html, la hauteur de rangée s'alignait sur le groupe le plus fourni. `:has(> .catalog-country-group)` remet le conteneur en bloc.
- **`--accent-color` sur fond sombre** — mesuré à ~3,16:1 sur le voile des bannières et ~1,8:1 sur les badges de photo une fois l'alpha pris en compte. Les chiffres de bannière et les icônes de badge sont en `--amber-500` (6,8:1 à 8,2:1), le texte en blanc.

## Palette de l'espace étudiant (2026-08-23)

L'espace connecté ne contient plus **ni bleu vif ni violet**. Trois valeurs produisaient toute cette impression, mesurées à l'écran :

| Ce qui a disparu | Où | Surface mesurée |
|---|---|---|
| `#7E71D8` (`--accent-500`), le violet | **tous** les liens de l'espace, la pastille de formule, les compteurs, les puces actives | 117 000 px² sur la seule page Documents |
| `--gradient-primary` (`#4A5BC4 → #33418C`), le bleu vif | bandeau d'abonnement, élément actif de la barre latérale, bouton d'enregistrement, anneau de score | 342 000 px² sur le tableau de bord |
| `rgba(51,65,140,.08)` (`--background-light`) | fond doux de tout l'espace — une seule ligne dans `dashboard.css` | 90 000 px² sur Candidatures |

Ce qui les remplace : **encre, blanc, ambre** — le système déjà validé sur les pages publiques. L'encre (`#161B33`) n'est pas « du bleu plus foncé » : à cette valeur l'œil lit du noir bleuté, pas une couleur.

Les redéfinitions vivent dans **`css/app-shell.css` (section 11)**, chargée par les treize pages connectées et par elles seules — les pages publiques gardent leur palette. C'est `--primary-600` qu'il faut redéfinir, pas `--primary-color` : `.btn-primary` lit l'échelle directement.

**Conséquence assumée sur l'identité de Fitz.** La règle « ambre = ce que fait Fitz, et rien d'autre » ne tient plus : l'ambre est désormais la couleur de **tout ce qui répond** — liens, actions, accents. Ce que Fitz garde en propre, et qui le distingue mieux qu'une teinte partagée : son **halo en dégradé aurore** et la forme de son badge. Dans un espace plat et encre, un dégradé qui pulse est le seul élément vivant de l'écran.

**L'étincelle (`sparkles`) a été retirée du site — 50 occurrences.** Elle ne disait jamais rien que le libellé à côté ne dise déjà. Seul `payment.html` la garde, parce que l'icône y **est** l'élément et change selon la formule.

### Deux pièges de couleur, tous deux trouvés en mesurant

**`p{ color:var(--text-light) }` dans `base.css` bat l'héritage.** Un conteneur sombre qui déclare `color:#fff` le transmet à ses enfants — mais pas à un `<p>`, où la règle d'élément l'emporte. Le bandeau d'abonnement affichait ses deux premières lignes à **1,94:1**. Le défaut existait déjà à 2,4:1 sur l'ancien bleu : assombrir le panneau ne l'a pas créé, il l'a rendu impossible à ignorer. Correctif : `color:inherit` sur les textes des surfaces sombres.

**Changer de teinte à opacité égale ne préserve pas la lisibilité.** L'état actif du sommaire de profil passait d'un bleu à 22 % (sombre, portait du blanc) à un lavis ambre à 20 % (clair) : le blanc y tombait à **1,17:1**. Toute bascule de teinte demande de re-mesurer le texte posé dessus.

Un lien à **1,18:1** dormait par ailleurs dans `profile.css` depuis longtemps, justifié par un commentaire décrivant un « panneau verre sombre » devenu clair entre-temps. Un raisonnement écrit dans le code vieillit comme le code.

## Parcours de candidature — la prochaine action

`js/next-action.js` (décision pure, testée) répond à la question que l'espace ne savait pas traiter : **quoi faire ensuite**. Il savait déjà dire *où en est* une candidature (`js/application-journey.js`), pas *par quoi commencer*.

**Les cinq étapes ont des prérequis, et rien ne les disait.** Fitz écrit la lettre de motivation à partir du profil — c'est littéralement ce que fait `describeProfile()` dans `js/ai/prompts.js`. Générée avec un profil à 3/10, la lettre est creuse, et elle s'affiche pourtant du **même vert** qu'une lettre excellente. La vérification avant dépôt lit la checklist et la lettre : la lancer avant produit un feu vert qui ne vaut rien.

Un étudiant pouvait donc franchir les cinq étapes dans un ordre garantissant un dossier faible, avec un parcours entièrement vert.

| Étape | Prérequis | Pourquoi |
|---|---|---|
| `profile` | — | |
| `checklist` | — | |
| `letter` | `profile` | `describeProfile()` construit la lettre depuis le profil |
| `readiness` | `checklist` + `letter` | `computeApplicationReadiness()` lit les deux |
| `advisor` | `readiness` | la revue humaine est la ressource la plus rare : ne pas la dépenser à relever ce que Fitz trouve en trois secondes |

**Trois états au stepper**, plus deux : `faite`, `à faire`, `prématurée`. L'étape prématurée est en pointillé, atténuée — **jamais désactivée, jamais rouge, jamais de cadenas**. L'étudiant garde la main sur l'ordre de son travail ; on lui dit ce qu'il obtiendrait, pas ce qu'il n'a pas le droit de faire. Un avertissement sous le stepper énonce la conséquence.

**Une seule action principale** en tête du panneau « Aujourd'hui », classée par conséquence et non par ordre de page : échéance dépassée ou à 3 jours → à 14 jours → profil sous le seuil avec une candidature en cours → étape faisable la plus pressée → profil sans candidature → explorer. L'action proposée est **toujours une étape réalisable** : sous la pression d'une échéance à 2 jours avec un profil à 3/10, elle pointe le profil, pas la lettre.

**L'avertissement suit jusqu'à l'outil.** `ai-letter.html` et `ai-email.html` affichent le même message que le parcours quand le profil est sous le seuil — Fitz y puise la matière des deux. C'est le seul endroit qui compte pour un étudiant arrivé directement par le menu, sans passer ni par le tableau de bord ni par ses candidatures. Le formulaire reste utilisable et le bouton actif : on informe, on n'empêche pas.

Un avertissement n'apparaît que s'il ne manque **qu'un** prérequis : signaler d'un coup les trois étapes bloquées d'un compte vide serait du bruit, et le bruit fait ignorer les avertissements qui comptent.

## Téléphone international

`js/phone-international.js` (la décision, testée) + `js/phone-field.js` (le montage). Le profil enregistre désormais du **E.164** (`+221771234567`) — le seul format qu'un opérateur, une passerelle SMS ou `wa.me` acceptent. Avant, deux `<input type="tel">` nus enregistraient ce que l'étudiant tapait, sans indicatif ni validation.

L'`<input>` d'origine n'est pas remplacé : il est masqué et porte la valeur. `profile.js` fait toujours `val("phone")` — le chemin d'enregistrement n'a pas changé d'une ligne.

**Le piège : « retirer le zéro initial » n'est pas une règle universelle.** Elle vaut en France, au Maroc, en Algérie, au Royaume-Uni, où ce zéro est un préfixe d'acheminement. Elle ne vaut PAS en **Côte d'Ivoire** (renumérotation 2021), au **Gabon**, au **Congo-Brazzaville** ni pour les fixes **italiens**, où ce zéro est un chiffre du numéro. L'appliquer partout produit un E.164 amputé d'un chiffre : enregistré sans erreur, et injoignable. D'où le drapeau `zeroSignificatif` sur ces quatre pays.

Ce défaut a été trouvé par un test, pas à la lecture : *« l'exemple de chaque pays respecte sa propre règle de longueur »*. Il a révélé trois pays du public prioritaire d'un coup. Ne pas retirer ce test en ajoutant un pays.

**Le sélecteur affiche l'indicatif EN PREMIER** (`+237 Cameroun`). Il a deux états qui ne servent pas à la même chose : ouvert on **choisit** (la liste native ne tronque rien), fermé on **vérifie** (148px, soit 109px de texte — mesuré, `Cameroun +237` en réclame 112). Ce qui doit survivre à la coupe est l'indicatif.

**Pas de drapeaux dans le sélecteur** : les emoji drapeaux ne s'affichent pas sous Windows (rendus « SN »), et il faudrait 88 SVG là où `assets/flags/` en compte 17.

## Espace étudiant (13 pages connectées)

`css/app-shell.css` est la source unique des composants partagés par `dashboard`, `profile`, `account`, `applications`, `documents` et les sept outils Fitz. Ordre de chargement :

```
css/base.css → css/app-shell.css → dashboard.css → css/ai-suite.css → <page>.css → css/app-typography.css
```

Ce qu'il contient : la surface de carte et son survol, les deux variantes de glyphe, l'intro de page, le titre de carte, **le parcours de candidature** (`.application-journey` / `.journey-*`), l'état de survol des zones de dépôt, le fond de modale et le squelette de chargement.

Avant l'extraction (2026-08-23) :

- le **parcours** existait deux fois — dans `dashboard.css` et `applications.css` — parce que `dashboard.html` ne charge pas `applications.css`. Les deux copies divergeaient déjà d'une déclaration (une marge basse), écart que personne n'avait décidé ;
- la **pastille d'icône** était écrite huit fois sous huit noms pour deux variantes réelles ;
- le **squelette** l'était deux fois **avec ses `@keyframes`** : deux animations homonymes en concurrence dans le même document, la dernière feuille chargée l'emportant.

Les anciens noms sont conservés en **alias** dans les listes de sélecteurs — le HTML et le JS n'ont rien eu à changer. Toute nouvelle règle s'écrit sous `.app-*`.

**Les deux seules variantes de glyphe, et pourquoi.** `.app-glyph` est neutre (`--text-muted`) : tout ce que fait le site lui-même. `.app-glyph--fitz` est ambre (`--amber-700`) : ce que fait Fitz, et rien d'autre. L'ambre est la couleur d'identité de Fitz — un glyphe ambre sur une carte qui n'est pas la sienne dilue le repère. Aucun fond, aucun cadre, aucune pastille pleine (voir « Aucune pastille dans l'espace étudiant » plus bas).

**Ne jamais redéfinir un de ces composants dans une feuille de page.** Les feuilles de page sont chargées après : une règle réintroduite chez elles écrase silencieusement le système commun sur une seule page. Ce qui est légitimement propre à une page s'écrit en surcharge explicite et commentée — c'est le cas de `.application-journey{margin-bottom:14px}` dans `applications.css`, où le parcours est suivi de la checklist alors qu'il termine sa carte sur le tableau de bord.

## Icônes

Règle arrêtée au fil des retours utilisateur d'août 2026 (pastilles rondes → carrées → arrondies → supprimées, puis remplacement de l'étincelle). Elle s'applique à **toute** icône ajoutée ou modifiée, sans avoir à redemander.

- **Aucun conteneur.** Pas de cercle, de carré, de "squircle" ni de pastille en dégradé derrière une icône. L'icône est posée nue sur le fond. Un conteneur ajoute une forme de plus à lire pour zéro information — c'est ce qui faisait paraître les anciennes icônes datées.
- **L'icône porte elle-même la couleur**, et cette couleur veut dire quelque chose : `--tone-text` pour un état (vert/ambre/rouge, voir *Couleurs*), `--fitz-color`/`--accent-600` quand Fitz est l'acteur, gris neutre (`--text-muted`) partout ailleurs. Jamais du bleu de marque "par défaut" appliqué sans raison.
- **Géométrique et minimal.** Traits nets, formes simples, lecture immédiate à 24 px. On évite les glyphes décoratifs et les clichés visuels — l'étincelle (`sparkles`) en particulier : c'est l'icône générique de l'IA depuis 2023, elle date une interface instantanément.
- **Métrique Lucide obligatoire** : `viewBox="0 0 24 24"`, `stroke-width="2"`, bouts et jonctions arrondis, `currentColor`. Vaut aussi pour un SVG tracé à la main — sans ça il jure à côté de ses voisines.
- **Une icône doit signifier quelque chose.** Si elle ne fait que décorer, on la retire (cf. l'étincelle supprimée du CTA "Choisir ma formule"). Deux icônes différentes ne doivent pas non plus se ressembler sur une même page si elles disent des choses différentes.
- **Ciblage CSS par la structure**, pas par la classe : `.parent > i, .parent > svg`. Lucide remplace le `<i data-lucide>` par un `<svg>` à l'exécution et ne garantit pas de reporter les classes — une mise en forme accrochée à la classe seule casse silencieusement.
- **SVG intégré quand la certitude prime.** Un nom d'icône absent du jeu Lucide ne lève aucune erreur : il n'affiche rien. Pour une marque à laquelle on tient (ex. l'onde du récit dans `results.html`), tracer le SVG en dur garantit l'affichage même CDN injoignable.

## La marque FitzUniverse

### FitzUniverse et Fitz — deux niveaux, une règle (2026-08-30)

- **FitzUniverse** = la plateforme, l'entité, l'équipe, le service, le contrat, le catalogue.
- **Fitz** = l'assistant IA, et lui seul.
- **Test de substitution** : la phrase marche avec « le site / le service / l'équipe » → FitzUniverse. Elle marche avec « il vous répond / il analyse » → Fitz.

**Pourquoi ce sens-là** : « Fitz » portait déjà toute l'identité de l'assistant (badge, halo, avatar, FAB, les 7 pages d'outils, `fitz-voice.js`), et trois fichiers écrivaient déjà spontanément « FitzUniverse » là où le sujet était l'organisation — le partage était déjà en train de se faire tout seul, il ne restait qu'à le graver.

**Liaison avec le visuel** : le partage des noms recouvre exactement le partage visuel déjà en place — **le symbole (deux arcs) est FitzUniverse, le halo aurore est Fitz**. C'est pourquoi `--gradient-fitz` n'a rien à faire sur le symbole, et pourquoi le halo n'apparaît que là où l'assistant agit.

**Les identifiants techniques ne suivent pas la règle** : `fitz*` (`.fitz-fab`, `.fitz-badge`, `.fitz-mark`, `--fitz-color`, `hasFitzExpress`, `js/fitz-voice.js`, `functions/fitz.js`…) et `scholarbridge*` (Firebase, localStorage, `SCHOLARBRIDGE_PLANS` — décision du 2026-08-29) restent tels quels. Renommer un identifiant casse des données et des références pour un bénéfice nul : la règle porte sur ce que l'utilisateur **lit**, pas sur ce que le code **nomme**.

Conséquences appliquées le 2026-08-30 : le lockup n'écrit plus « Fitz » deux fois (sous-titre → « UNIVERSE »), les `<title>` suivent `<Page> | FitzUniverse` (l'accueil garde la marque en tête), et le forfait « Fitz Signature » devient « **Signature** » — c'est le seul forfait avec conseiller humain, le nommer d'après l'IA contredisait ce qu'il vend. Fitz ne s'auto-désigne jamais comme la plateforme (« votre espace FitzUniverse », mais « Fitz analyse votre profil »).

### Le logo — symbole et lockup (2026-08-30, lockup unifié le 2026-08-31)

Un logo dont l'accent change de teinte n'est plus reconnu comme le même logo. Le constat qui a imposé cette règle : le symbole était peint de **6 façons** parce que les couleurs étaient écrites en dur dans le HTML et le JS — tant que le balisage porte la couleur, la dérive recommence à chaque nouvelle page.

| Où | Structure | Accent | Problème |
|---|---|---|---|
| Topbar espace étudiant (17 pages) | `var(--primary-color)` (bleu) | `--amber-500` | bleu hérité de l'ancienne palette |
| login/suspended (inline) | `var(--primary-color)` | `--amber-700` | accent bruni |
| Carte sombre de login (CSS) | `#FDF9EF` | `#FDF9EF` | monochrome — l'accent disparaissait |
| 8 pages admin | `#FDFCFA` | `--amber-500` | couleur en dur dans le HTML |
| FAB Fitz (`js/app-shell.js`) | `#FDF9EF` | `#D9805A` | accent **terracotta** |
| Pages publiques + pied de page | `#fff` → `--primary-dark` au scroll | `--amber-500` → `--amber-700` au scroll ; pied de page : 2 arcs papier | l'accent changeait au scroll et par surface |

**La règle, gravée dans `css/base.css` (source unique, ne jamais redéfinir ailleurs) :**

- **L'arc ambre est invariant** : `--logo-accent:#E9A319`, sur tous les fonds, sans exception. C'est LE signe de reconnaissance. Il ne devient jamais brun (`--amber-700`), jamais terracotta, jamais blanc — même sur le pied de page terracotta (l'or est chromatiquement distinct, l'ancienne exception « deux arcs papier » datait de l'accent terracotta `#D9805A`).
  - ⚠️ **`#E9A319` est écrit en littéral à dessein — ne JAMAIS le remplacer par `var(--amber-500)`** : **onze feuilles** redéfinissent l'échelle ambre en terracotta (recompté le 2026-08-31) : catalog-redesign, details-redesign, eligibility-questions-redesign, eligibility-test-redesign, homepage-redesign, journey-shell, login-redesign, offers-redesign, payment-redesign, results-redesign — plus base.css qui la définit. La substitution ramènerait instantanément les habillages multiples.
- **Le grand arc et le texte du lockup sont neutres**, avec exactement **deux états** via `--logo-structure` : encre (`--ink-surface`, `#211D18`) sur fond clair, papier (`#FDFCFA`) sur fond sombre. **Aucun bleu.** Les surfaces sombres sont listées une seule fois dans base.css (`.on-dark`, `.header:not(.is-scrolled)`, `.footer`, `.fitz-fab`, `.sidebar-brand`, `.admin-logo-wrap`) ; `.on-dark` est le crochet à poser sur un conteneur sombre ponctuel.
- **Trois tokens, et trois seulement**, tous déclarés une seule fois dans `css/base.css` :

| Token | Fond clair | Fond sombre (`.on-dark`) | Rôle |
|---|---|---|---|
| `--logo-accent` | `#E9A319` | `#E9A319` (invariant) | la pièce ambre du symbole |
| `--logo-structure` | `--ink-surface` (`#211D18`) | `#FDFCFA` | le grand arc et « Fitz » |
| `--logo-descriptor` | `#8A5D00` (5,76:1) | `#E9A319` (7,75:1) | « UNIVERSE » |

  Avant `--logo-descriptor`, le descripteur était soit la structure à 72 % d'opacité (illisible sur fond sombre), soit du terracotta selon la page.

**Balisage canonique** — identique dans tous les fichiers, aucun attribut `stroke=` dans le HTML/JS, la classe de dimensionnement existante reste à côté (`fitz-mark logo-mark`, `fitz-mark logo-icon`) :

```html
<svg class="fitz-mark" viewBox="0 0 100 100" fill="none" aria-hidden="true" focusable="false"
     xmlns="http://www.w3.org/2000/svg">
  <circle class="mark-structure" cx="50" cy="50" r="34" stroke-width="11" stroke-linecap="round"
          stroke-dasharray="130 83.6" transform="rotate(-90 50 50)"/>
  <circle class="mark-accent" cx="50" cy="50" r="34" stroke-width="11" stroke-linecap="round"
          stroke-dasharray="42 171.6" stroke-dashoffset="-150" transform="rotate(-90 50 50)"/>
</svg>
```

**Le lockup — symbole + nom, un seul composant (`.fitz-lockup`, css/base.css).** Il remplace les trois balisages qui coexistaient (public `.logo-text` avec styles inline, `.journey-brand-text`, `.sidebar-brand-text`). Balisage canonique, identique partout — le seul `style=` toléré porte la taille :

```html
<a href="…" class="fitz-lockup" style="--lockup-size:48px" aria-label="FitzUniverse — accueil">
  <svg class="fitz-mark" viewBox="0 0 100 100" fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
    <circle class="mark-structure" cx="50" cy="50" r="34" stroke-width="11" stroke-linecap="round" stroke-dasharray="130 83.6" transform="rotate(-90 50 50)"/>
    <circle class="mark-accent" cx="50" cy="50" r="34" stroke-width="11" stroke-linecap="round" stroke-dasharray="42 171.6" stroke-dashoffset="-150" transform="rotate(-90 50 50)"/>
  </svg>
  <span class="fitz-lockup-text">
    <span class="fitz-lockup-name">Fitz</span>
    <span class="fitz-lockup-sub">Universe</span>
  </span>
</a>
```

- **« Universe » s'écrit en minuscules dans le HTML** : les capitales viennent du CSS, pour que les lecteurs d'écran ne l'épellent pas lettre par lettre.
- **Trois tailles en service** : `48px` (en-tête et pied de page publics), `30px` (espace étudiant, sidebar admin, barres de marque), `24px` (compact). Tout se dimensionne par `--lockup-size` — symbole, corps, espacements suivent en `calc()`.
- **Les polices du lockup sont EN LITTÉRAL** (`"Newsreader",Georgia,serif` et `"Public Sans",system-ui,sans-serif`), jamais `var(--font-display)` : **dix-sept feuilles** redéfinissent ce token en trois systèmes typographiques, et le nom de la marque changeait de caractère selon la page. Un logo ne suit pas la typographie de la page qui l'accueille.
- **Réglage optique** : « UNIVERSE » épouse la largeur de « Fitz » (letter-spacing `.295em` + marge droite négative de même valeur). Mesuré à 44px : 70,70 px vs 70,69 px peints.
- Survol : `opacity:.85` au plus. **Jamais de rotation** — un logo d'entreprise ne bascule pas.
- Spécimen et options de couleur : `design-previews/logo-lockup.html`. Gardes automatiques : `test/logo-lockup.test.mjs`.

**Interdits :**

- Jamais de dégradé sur le symbole. `--gradient-fitz` appartient au **halo de l'assistant**, pas à la marque — c'est précisément la distinction Fitz / FitzUniverse.
- Jamais de fond, de pastille, de cercle ou de cadre derrière le symbole.
- Jamais de troisième couleur, jamais de recoloration par page ou par section.
- Le **favicon** est la seule exception au « jamais de fond » (une tuile est nécessaire à 16 px) : il garde son tracé optiquement corrigé (r=33, bouts droits) mais utilise exactement la tuile `#211D18`, la structure `#FDFCFA` et l'accent `#E9A319` (régénéré le 2026-08-30 — l'ancien était sur tuile marine `#12162E`).

**Vérification** : `grep -rn 'stroke="' --include=*.html --include=*.js .` ne doit trouver aucune couleur sur un `<circle>` du symbole (les icônes Lucide ne sont pas concernées).

## Identité Fitz — la marque dans la marque

Depuis la refonte 2026-08, Fitz n'est plus une simple teinte empruntée à `--accent-*` : c'est un système de couleur **découplé** et propre à Fitz, pensé pour que l'utilisateur reconnaisse instantanément "ceci, c'est Fitz" partout où l'assistant apparaît (nav, badges, CTA vers le chat, avatar dans les autres outils IA, bulles de réponse) — sans casser l'harmonie bleu/violet/gris du reste du produit.

- **`--gradient-fitz`** : dégradé "aurore" propre à Fitz, violet → indigo → cyan (`#8B7CF6 → #6459B8 → #3E4FA8 → #22A8C9`) — n'est réutilisé nulle part ailleurs sur le site, y compris pour un `.card--featured` ou tout autre highlight générique (qui utilisent `--accent-*`, le violet générique, pas le dégradé Fitz).
- **`--fitz-color`** (`#8B7CF6`) : couleur à plat (premier arrêt du dégradé) pour une **surface**, un halo ou une bordure fine — ex. `.sidebar-nav-fitz` (groupe de nav Fitz, seul endroit de la nav où une couleur autre que le bleu primaire/l'état actif apparaît). **Ne fait que 3,33:1 sur blanc** : jamais en couleur de texte sur fond clair. Si un libellé doit un jour être violet Fitz plutôt qu'ambre, prendre `#6459B8` (deuxième arrêt du même dégradé, 5,73:1 sur blanc).
- **`--glow-fitz`** : halo/ombre teintée Fitz, utilisée avec l'avatar et les éléments à mettre en valeur comme "venant de Fitz".
- **Halo conique animé** (`.fitz-avatar::before`, `prefers-reduced-motion`-safe) : seul élément du site animé en continu — recoloré sur le nouveau dégradé, reste le mécanisme qui rend Fitz "vivant".
- **Bulles de réponse** (`.ai-msg-bot .ai-msg-bubble`) : bordure/accent gauche sur `--gradient-fitz`, distinct des bulles utilisateur (`--gradient-primary`, bleu).
- **Cohérence transverse obligatoire** : toute nouvelle surface où Fitz est l'acteur visible (badge, CTA "Discuter avec Fitz", indicateur de saisie/réflexion, avatar dans ai-letter/ai-email/ai-check/ai-translate) doit consommer `--gradient-fitz`/`--fitz-color`/`--glow-fitz` — jamais `--accent-*` directement, pour que la distinction Fitz/reste-du-site ne se dilue pas au fil des pages. **Seule exception, documentée juste en dessous : le badge Fitz, qui est ambre parce que le mot « Fitz » l'est déjà partout ailleurs.**

### Le halo — Fitz n'a pas d'icône (2026-08-22)

Fitz était représenté par un carré arrondi de 44 px en `--gradient-fitz`, avec une **étincelle** dedans. Trois problèmes : c'est un conteneur d'icône (proscrit) ; l'étincelle est le cliché de l'IA depuis 2023, donc le symbole qui n'appartient à personne ; et un assistant n'est pas un bouton — lui donner la forme d'une tuile d'application le range du côté des outils alors qu'il est une présence.

`.fitz-avatar` est désormais **un halo radial flou qui respire** : pas de fond, pas de contour, pas de rayon, pas de glyphe. Le traitement existait déjà sur `eligibility-questions.html` ; il a été remonté dans `css/ai-suite.css` pour valoir sur toutes les pages Fitz — en-têtes d'outils, fil de discussion, états vides.

- Le glyphe éventuellement présent dans le HTML est **masqué par `.fitz-avatar > i`** plutôt que retiré de chaque page : sept pages en portaient un, et la règle empêche surtout qu'une future page réintroduise l'étincelle sans qu'on le voie.
- L'avatar du fil de discussion (`.ai-msg-bot .ai-msg-avatar`) reçoit le **même halo en réduction** : c'est la même présence, pas une déclinaison. L'utilisateur, lui, garde son initiale — une lettre identifie une personne réelle, ce n'est pas une icône.
- Le halo **respire** (`fitzPulse`) au lieu de tourner : une rotation suppose un contour, et il n'y en a plus. `@keyframes fitzHalo` a été retiré.

**Ce n'est pas un logo, c'est un signal de présence** : on ne le lit pas, on le remarque. Et il ne peut ressembler à aucun autre service, parce qu'il n'emprunte aucun symbole.

### Aucune pastille dans l'espace étudiant (2026-08-22)

Les 17 conteneurs d'icône de l'espace authentifié ont été supprimés en une passe : `.ai-page-header-icon`, `.ai-locked-icon`, `.ai-style-card-icon`, `.ai-attachment-chip-icon`, `.ai-file-row-icon`, `.coach-card-icon`, `.stat-card-icon`, `.upgrade-nudge-icon`, `.tool-card-icon`, `.profile-section-icon`, `.apps-stat-icon`, `.apps-empty-icon`, `.generated-doc-icon`, `.doc-card-icon`, `.docs-empty-state-icon`, `.docs-modal-icon`, `.ivp-practice-icon`.

Dans chaque cas : `background`, `width`, `height`, `border-radius` retirés, mise en page conservée, et l'icône reçoit une **couleur porteuse de sens** — ambre quand elle signale quelque chose à faire, gris neutre quand elle sert de repère. Vérifié page par page dans un navigateur : aucun élément dont le nom contient `icon` ou `avatar` ne porte plus de fond carré.

Piège rencontré : `.apps-stat-urgent .apps-stat-icon` posait un `background:var(--warning)` **dans une règle séparée**, qui survivait à la suppression de la pastille. Une pastille peut être peinte ailleurs que dans sa règle principale — chercher toutes les occurrences du sélecteur, pas seulement sa déclaration.

### Le badge Fitz — une seule définition (2026-08-22)

Le badge qui annonce « c'est Fitz qui vous parle » est **un composant unique**, défini une seule fois dans `css/base.css` sous `.fitz-badge, .ai-badge`. Il apparaît sur eligibility-test, eligibility-questions, results (deux fois), offers et payment.

- **Le mot « Fitz », rien d'autre** : pas d'icône. Le robot `bot` qu'il portait a été retiré du HTML des cinq pages — il ne disait rien que le libellé juste à côté ne disait déjà (règle « Icônes » : une icône décorative se retire). Retiré du HTML, pas masqué en CSS : une icône masquée reste dans le DOM et continue d'être rechargée par Lucide.
- **Couleur : ambre**, pas violet Fitz. Ce n'est pas une entorse à la règle « Fitz a sa propre couleur » — le mot « Fitz » est déjà ambre partout ailleurs (`.fitz-name`, écho du « Bridge » doré du logo). C'était la pilule violette qui était l'exception : une même page pouvait écrire « Fitz » en ambre dans une phrase et en violet dans le badge. Le violet Fitz reste la couleur de l'**avatar**, du halo et des bulles de réponse — la distinction Fitz/marque se déplace du libellé vers l'assistant lui-même.
  - libellé : `--amber-700` (5,76:1 sur le blanc de la pilule) — la seule valeur ambre admise pour du texte sur fond clair.
  - contour : `--amber-500` en 1,5 px — l'ambre franc, celui qui fait lire le badge comme orange. Il ne peut pas porter le texte (2,16:1) mais il porte parfaitement le contour.
- **Pourquoi pas une pilule ambre pleine** (plus franchement orange, libellé marine à 8,24:1) : `--amber-500` en aplat est la surface du **CTA principal** du site. Un badge non cliquable habillé comme le bouton d'action principal se fait prendre pour un bouton — et il y en a un vrai plus bas sur offers et payment. Le contour donne l'orange sans le malentendu.
- **Fond blanc opaque**, jamais translucide. Une pilule translucide prend la teinte de ce qu'il y a derrière et change donc d'aspect d'une page à l'autre : c'est exactement ce qui avait forcé une variante blanche sur le hero photographique d'offers.html. Le blanc plein tient sur la photo sombre comme sur le crème de `.fitz-surface`.
- **Aucune marge dans le composant** : l'espacement dépend de la page, chaque feuille pose la sienne (`.ai-badge{margin:0 auto 20px}`).
- `display:flex` et non `inline-flex` — combiné à `width:max-content`, c'est ce qui permet à `margin:0 auto` de centrer le badge.
- **Ne jamais redéfinir l'apparence du badge dans une feuille de page.** C'est précisément cette dérive — quatre définitions séparées — qui avait produit quatre Fitz différents dans un même parcours. Le badge est ce qui rend l'assistant reconnaissable d'un écran à l'autre ; s'il change de tête à chaque page, il ne sert plus à rien.



---

## Coût de lecture Firestore

Le catalogue public (`programs`, `universities`, `scholarships`) ne se lit **jamais** en direct depuis une page : tout passe par `js/catalog-data.js`, mémoïsé par collection pour la durée du chargement. La règle, les coûts mesurés page par page et l'incident qui l'a imposée (l'accueil lisait le catalogue deux fois, ~1 182 lectures par affichage) sont documentés dans **[COUT_LECTURE.md](COUT_LECTURE.md)**.

Deux réflexes qui en découlent : **aucun onglet du site ouvert pendant qu'on écrit des fichiers** (Live Server recharge tout à chaque sauvegarde), et tout nouveau module qui a besoin du catalogue appelle `chargerCatalogue()`.
