# ScholarBridge / Fitz — Design System

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
| Texte principal / secondaire / discret | `--text-color` / `--text-light` / `--text-muted` | `#0F172A` / `#475569` / `#626E83` |
| Fonds | `--background` / `--background-soft` / `--background-alt` | `#FFFFFF` / `#F8FAFC` / `#F1F5F9` |
| Bordure | `--border-color` | `#E2E8F0` |

**Règle** : un état sémantique (succès/erreur/avertissement) n'a **qu'une seule teinte** dans tout le site. Ne pas introduire de vert/rouge/violet "un peu différent" pour une carte spécifique — utiliser le token à une opacité différente (`rgba(34,197,94,.12)` etc., déjà fait dans `.badge-success`/`.alert-success`) plutôt qu'une nouvelle valeur hex.

**`--accent-*` est rare par nature** : réservé aux éléments qui signalent vraiment quelque chose d'important (badge "nouveau", highlight ponctuel, `.card--featured`). Jamais utilisé comme couleur d'icône par défaut sur une carte générique, une stat, ou un élément de navigation neutre — ceux-là restent en gris (`--text-muted`/`--background-alt`).

**Exceptions documentées (pas des violations)** : logos de marques tierces dans des contextes très ciblés — WhatsApp `#25D366` (lien CTA), Visa `#1A1F71` (logo carte de paiement). Ces couleurs appartiennent à l'identité visuelle de tiers, pas à la palette ScholarBridge ; elles restent scoped à leur icône/logo uniquement. Fitz (ci-dessous) est aussi une exception volontaire et documentée, pas une dérive.

**Thème app shell (dashboard/admin, fond sombre)** : deux jeux de tokens `--shell-*` distincts, tous deux nommés pareil mais définis à des endroits différents :
- `css/base.css` définit les valeurs neutres d'origine (slate), consommées par `admin/control-center.css` et `admin/login.css` — **l'admin n'est volontairement pas concerné par la refonte bleu/violet**, il garde son thème actuel.
- `dashboard.css` **redéclare localement** ces mêmes noms de tokens avec la nouvelle teinte froide bleu-violet (`--shell-bg:#171B34` etc.) — cette redéclaration ne s'applique qu'aux pages qui chargent `dashboard.css` (tout le shell étudiant : dashboard, profil, compte, documents, candidatures, pages Fitz, universités, bourses).

Une nouvelle page à fond sombre du shell étudiant surcharge les tokens standards avec ceux de `dashboard.css` dans son propre scope ; elle n'invente pas de nouvelles valeurs et ne touche pas à `css/base.css`.

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

Sora (titres, `--font-display`) + Inter (texte, `--font-body`). Échelle à 14 rôles déjà en place dans `base.css` (hero, h1-h5, lead, body, small, caption, button, label, page-title, subtitle, card-title, badge, nav, footer, meta, stat). Consommer le rôle existant le plus proche plutôt qu'introduire une nouvelle taille locale.

## Composants

- **`.btn`** — `.btn-primary` / `.btn-secondary` / `.btn-ghost` / `.btn-danger`, tailles `.btn-sm` / (défaut) / `.btn-lg`. Hover sobre (fond + léger lift). **Pas d'effet de sweep/brillance animée** — retiré volontairement.
- **`.card`** — `.card--featured` (bordure d'accent + shadow-md/lg), `.card--subtle` (secondaire/désactivé). Toute "carte" spécifique à une page (carte université, carte bourse, carte outil Fitz...) doit étendre `.card`, pas réinventer sa structure.
- **`.field`** — le seul système de champ de formulaire du site : `<div class="field"><label>…</label><div class="field-control"><i data-lucide="…"></i><input/></div><p class="field-hint">…</p></div>`. `.field-control` est optionnel si pas d'icône. `.field.has-error` pour l'état d'erreur.
- **`.badge`** — `.badge-success` / `.badge-warning` / `.badge-danger` / `.badge-neutral`.
- **`.alert`** — `.alert-success` / `.alert-warning` / `.alert-danger`.
- **`.table`** — bordures, en-tête en majuscule discret, survol de ligne.
- **`.modal-base`** — structure de modale (`.modal-card`, `.modal-header`, `.modal-close`).
- **`.glass-panel`** / **`.glass-panel--dark`** — seule recette de verre dépoli, à utiliser avec parcimonie.

## Identité Fitz — la marque dans la marque

Depuis la refonte 2026-08, Fitz n'est plus une simple teinte empruntée à `--accent-*` : c'est un système de couleur **découplé** et propre à Fitz, pensé pour que l'utilisateur reconnaisse instantanément "ceci, c'est Fitz" partout où l'assistant apparaît (nav, badges, CTA vers le chat, avatar dans les autres outils IA, bulles de réponse) — sans casser l'harmonie bleu/violet/gris du reste du produit.

- **`--gradient-fitz`** : dégradé "aurore" propre à Fitz, violet → indigo → cyan (`#8B7CF6 → #6459B8 → #3E4FA8 → #22A8C9`) — n'est réutilisé nulle part ailleurs sur le site, y compris pour un `.card--featured` ou tout autre highlight générique (qui utilisent `--accent-*`, le violet générique, pas le dégradé Fitz).
- **`--fitz-color`** (`#8B7CF6`) : couleur à plat (premier arrêt du dégradé) pour les cas où un dégradé ne s'applique pas (texte, icône, bordure fine) — ex. `.sidebar-nav-fitz` (groupe de nav Fitz, seul endroit de la nav où une couleur autre que le bleu primaire/l'état actif apparaît).
- **`--glow-fitz`** : halo/ombre teintée Fitz, utilisée avec l'avatar et les éléments à mettre en valeur comme "venant de Fitz".
- **Halo conique animé** (`.fitz-avatar::before`, `prefers-reduced-motion`-safe) : seul élément du site animé en continu — recoloré sur le nouveau dégradé, reste le mécanisme qui rend Fitz "vivant".
- **Bulles de réponse** (`.ai-msg-bot .ai-msg-bubble`) : bordure/accent gauche sur `--gradient-fitz`, distinct des bulles utilisateur (`--gradient-primary`, bleu).
- **Cohérence transverse obligatoire** : toute nouvelle surface où Fitz est l'acteur visible (badge, CTA "Discuter avec Fitz", indicateur de saisie/réflexion, avatar dans ai-letter/ai-email/ai-check/ai-translate) doit consommer `--gradient-fitz`/`--fitz-color`/`--glow-fitz` — jamais `--accent-*` directement, pour que la distinction Fitz/reste-du-site ne se dilue pas au fil des pages.

