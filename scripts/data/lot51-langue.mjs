/**
 * ============================================================
 * LOT 51-LANGUE — la langue d'enseignement des programmes (12 sept. 2026)
 * ============================================================
 *
 * 161 programmes sur 507 n'avaient pas de `language`. Ce champ est LU
 * PAR LE MOTEUR : recommend-programs.js donne un bonus quand la langue
 * du programme est une langue de l'étudiant, et explainMatch() l'écrit
 * en raison (« Enseigné en français — une langue que vous maîtrisez »).
 * Un champ vide, c'est un bonus jamais donné et une raison jamais dite.
 *
 * CE QUE CE LOT ÉCRIT, ET D'OÙ
 * ----------------------------
 * La langue est fixée PAR LA BOURSE quand la bourse elle-même la fixe ou
 * la conditionne — et seulement dans ce cas :
 *   - Eiffel : formations en français OU en anglais admises (FAQ Campus
 *     France) → « Français / Anglais selon la formation » ;
 *   - Türkiye Bursları (3 bourses) : catalogue officiel en turc, anglais
 *     ou mixte, cours de turc compris → « Turc / Anglais selon le programme » ;
 *   - fondations allemandes (KAS, FES, Böll, RLS) : B2 d'allemand EXIGÉ
 *     même pour un cursus en anglais — chacune le dit sur sa page ;
 *   - Commonwealth (3 bourses) : Royaume-Uni, anglais.
 * Chaque patch porte la citation et l'URL lues le 2026-09-12. Le
 * vocabulaire suit celui déjà en base (« X / Y selon le cursus »).
 *
 * CE QUE CE LOT N'ÉCRIT PAS, et pourquoi
 * --------------------------------------
 * Japon (22 : JASSO, Rotary Yoneyama, Honjo, JICA, ABE), KOICA (6), DAAD
 * EPOS (6), ER.GO/IYT Italie (5), Rwanda/Ghana/Suisse (6) : pages
 * injoignables ou sans phrase sur la langue ce jour-là. Rien d'écrit
 * plutôt qu'une langue supposée — 57 programmes restent à lire.
 * ============================================================
 */

export const PATCHES = [
  {
    "collection": "programs",
    "id": "aix-marseille-universite-marseille__eiffel-excellence-scholarship__doctorat",
    "champs": {
      "language": "Français / Anglais selon la formation"
    },
    "motif": "FAQ officielle du programme Eiffel (Campus France), lue le 2026-09-12 : « Si la formation est enseignée en anglais, le candidat doit avoir le niveau requis en anglais. Si un étudiant est francophone, aucun certificat de langue n'est exigé pour une formation enseignée en français. » Les formations en anglais sont éligibles ; la langue est celle du master ou du doctorat choisi. Source : https://www.campusfrance.org/fr/faq-appel-a-candidature-a-la-bourse-eiffel"
  },
  {
    "collection": "programs",
    "id": "aix-marseille-universite-marseille__eiffel-excellence-scholarship__master",
    "champs": {
      "language": "Français / Anglais selon la formation"
    },
    "motif": "FAQ officielle du programme Eiffel (Campus France), lue le 2026-09-12 : « Si la formation est enseignée en anglais, le candidat doit avoir le niveau requis en anglais. Si un étudiant est francophone, aucun certificat de langue n'est exigé pour une formation enseignée en français. » Les formations en anglais sont éligibles ; la langue est celle du master ou du doctorat choisi. Source : https://www.campusfrance.org/fr/faq-appel-a-candidature-a-la-bourse-eiffel"
  },
  {
    "collection": "programs",
    "id": "ecole-normale-superieure-de-lyon-lyon__eiffel-excellence-scholarship__doctorat",
    "champs": {
      "language": "Français / Anglais selon la formation"
    },
    "motif": "FAQ officielle du programme Eiffel (Campus France), lue le 2026-09-12 : « Si la formation est enseignée en anglais, le candidat doit avoir le niveau requis en anglais. Si un étudiant est francophone, aucun certificat de langue n'est exigé pour une formation enseignée en français. » Les formations en anglais sont éligibles ; la langue est celle du master ou du doctorat choisi. Source : https://www.campusfrance.org/fr/faq-appel-a-candidature-a-la-bourse-eiffel"
  },
  {
    "collection": "programs",
    "id": "ecole-normale-superieure-de-lyon-lyon__eiffel-excellence-scholarship__master",
    "champs": {
      "language": "Français / Anglais selon la formation"
    },
    "motif": "FAQ officielle du programme Eiffel (Campus France), lue le 2026-09-12 : « Si la formation est enseignée en anglais, le candidat doit avoir le niveau requis en anglais. Si un étudiant est francophone, aucun certificat de langue n'est exigé pour une formation enseignée en français. » Les formations en anglais sont éligibles ; la langue est celle du master ou du doctorat choisi. Source : https://www.campusfrance.org/fr/faq-appel-a-candidature-a-la-bourse-eiffel"
  },
  {
    "collection": "programs",
    "id": "ecole-polytechnique-palaiseau__eiffel-excellence-scholarship__doctorat",
    "champs": {
      "language": "Français / Anglais selon la formation"
    },
    "motif": "FAQ officielle du programme Eiffel (Campus France), lue le 2026-09-12 : « Si la formation est enseignée en anglais, le candidat doit avoir le niveau requis en anglais. Si un étudiant est francophone, aucun certificat de langue n'est exigé pour une formation enseignée en français. » Les formations en anglais sont éligibles ; la langue est celle du master ou du doctorat choisi. Source : https://www.campusfrance.org/fr/faq-appel-a-candidature-a-la-bourse-eiffel"
  },
  {
    "collection": "programs",
    "id": "ecole-polytechnique-palaiseau__eiffel-excellence-scholarship__master",
    "champs": {
      "language": "Français / Anglais selon la formation"
    },
    "motif": "FAQ officielle du programme Eiffel (Campus France), lue le 2026-09-12 : « Si la formation est enseignée en anglais, le candidat doit avoir le niveau requis en anglais. Si un étudiant est francophone, aucun certificat de langue n'est exigé pour une formation enseignée en français. » Les formations en anglais sont éligibles ; la langue est celle du master ou du doctorat choisi. Source : https://www.campusfrance.org/fr/faq-appel-a-candidature-a-la-bourse-eiffel"
  },
  {
    "collection": "programs",
    "id": "essec-business-school-cergy__eiffel-excellence-scholarship__doctorat",
    "champs": {
      "language": "Français / Anglais selon la formation"
    },
    "motif": "FAQ officielle du programme Eiffel (Campus France), lue le 2026-09-12 : « Si la formation est enseignée en anglais, le candidat doit avoir le niveau requis en anglais. Si un étudiant est francophone, aucun certificat de langue n'est exigé pour une formation enseignée en français. » Les formations en anglais sont éligibles ; la langue est celle du master ou du doctorat choisi. Source : https://www.campusfrance.org/fr/faq-appel-a-candidature-a-la-bourse-eiffel"
  },
  {
    "collection": "programs",
    "id": "essec-business-school-cergy__eiffel-excellence-scholarship__master",
    "champs": {
      "language": "Français / Anglais selon la formation"
    },
    "motif": "FAQ officielle du programme Eiffel (Campus France), lue le 2026-09-12 : « Si la formation est enseignée en anglais, le candidat doit avoir le niveau requis en anglais. Si un étudiant est francophone, aucun certificat de langue n'est exigé pour une formation enseignée en français. » Les formations en anglais sont éligibles ; la langue est celle du master ou du doctorat choisi. Source : https://www.campusfrance.org/fr/faq-appel-a-candidature-a-la-bourse-eiffel"
  },
  {
    "collection": "programs",
    "id": "hec-paris-jouy-en-josas__eiffel-excellence-scholarship__doctorat",
    "champs": {
      "language": "Français / Anglais selon la formation"
    },
    "motif": "FAQ officielle du programme Eiffel (Campus France), lue le 2026-09-12 : « Si la formation est enseignée en anglais, le candidat doit avoir le niveau requis en anglais. Si un étudiant est francophone, aucun certificat de langue n'est exigé pour une formation enseignée en français. » Les formations en anglais sont éligibles ; la langue est celle du master ou du doctorat choisi. Source : https://www.campusfrance.org/fr/faq-appel-a-candidature-a-la-bourse-eiffel"
  },
  {
    "collection": "programs",
    "id": "hec-paris-jouy-en-josas__eiffel-excellence-scholarship__master",
    "champs": {
      "language": "Français / Anglais selon la formation"
    },
    "motif": "FAQ officielle du programme Eiffel (Campus France), lue le 2026-09-12 : « Si la formation est enseignée en anglais, le candidat doit avoir le niveau requis en anglais. Si un étudiant est francophone, aucun certificat de langue n'est exigé pour une formation enseignée en français. » Les formations en anglais sont éligibles ; la langue est celle du master ou du doctorat choisi. Source : https://www.campusfrance.org/fr/faq-appel-a-candidature-a-la-bourse-eiffel"
  },
  {
    "collection": "programs",
    "id": "insa-lyon-villeurbanne__eiffel-excellence-scholarship__doctorat",
    "champs": {
      "language": "Français / Anglais selon la formation"
    },
    "motif": "FAQ officielle du programme Eiffel (Campus France), lue le 2026-09-12 : « Si la formation est enseignée en anglais, le candidat doit avoir le niveau requis en anglais. Si un étudiant est francophone, aucun certificat de langue n'est exigé pour une formation enseignée en français. » Les formations en anglais sont éligibles ; la langue est celle du master ou du doctorat choisi. Source : https://www.campusfrance.org/fr/faq-appel-a-candidature-a-la-bourse-eiffel"
  },
  {
    "collection": "programs",
    "id": "insa-lyon-villeurbanne__eiffel-excellence-scholarship__master",
    "champs": {
      "language": "Français / Anglais selon la formation"
    },
    "motif": "FAQ officielle du programme Eiffel (Campus France), lue le 2026-09-12 : « Si la formation est enseignée en anglais, le candidat doit avoir le niveau requis en anglais. Si un étudiant est francophone, aucun certificat de langue n'est exigé pour une formation enseignée en français. » Les formations en anglais sont éligibles ; la langue est celle du master ou du doctorat choisi. Source : https://www.campusfrance.org/fr/faq-appel-a-candidature-a-la-bourse-eiffel"
  },
  {
    "collection": "programs",
    "id": "mines-paris-psl-paris__eiffel-excellence-scholarship__doctorat",
    "champs": {
      "language": "Français / Anglais selon la formation"
    },
    "motif": "FAQ officielle du programme Eiffel (Campus France), lue le 2026-09-12 : « Si la formation est enseignée en anglais, le candidat doit avoir le niveau requis en anglais. Si un étudiant est francophone, aucun certificat de langue n'est exigé pour une formation enseignée en français. » Les formations en anglais sont éligibles ; la langue est celle du master ou du doctorat choisi. Source : https://www.campusfrance.org/fr/faq-appel-a-candidature-a-la-bourse-eiffel"
  },
  {
    "collection": "programs",
    "id": "mines-paris-psl-paris__eiffel-excellence-scholarship__master",
    "champs": {
      "language": "Français / Anglais selon la formation"
    },
    "motif": "FAQ officielle du programme Eiffel (Campus France), lue le 2026-09-12 : « Si la formation est enseignée en anglais, le candidat doit avoir le niveau requis en anglais. Si un étudiant est francophone, aucun certificat de langue n'est exigé pour une formation enseignée en français. » Les formations en anglais sont éligibles ; la langue est celle du master ou du doctorat choisi. Source : https://www.campusfrance.org/fr/faq-appel-a-candidature-a-la-bourse-eiffel"
  },
  {
    "collection": "programs",
    "id": "nantes-universite-nantes__eiffel-excellence-scholarship__doctorat",
    "champs": {
      "language": "Français / Anglais selon la formation"
    },
    "motif": "FAQ officielle du programme Eiffel (Campus France), lue le 2026-09-12 : « Si la formation est enseignée en anglais, le candidat doit avoir le niveau requis en anglais. Si un étudiant est francophone, aucun certificat de langue n'est exigé pour une formation enseignée en français. » Les formations en anglais sont éligibles ; la langue est celle du master ou du doctorat choisi. Source : https://www.campusfrance.org/fr/faq-appel-a-candidature-a-la-bourse-eiffel"
  },
  {
    "collection": "programs",
    "id": "nantes-universite-nantes__eiffel-excellence-scholarship__master",
    "champs": {
      "language": "Français / Anglais selon la formation"
    },
    "motif": "FAQ officielle du programme Eiffel (Campus France), lue le 2026-09-12 : « Si la formation est enseignée en anglais, le candidat doit avoir le niveau requis en anglais. Si un étudiant est francophone, aucun certificat de langue n'est exigé pour une formation enseignée en français. » Les formations en anglais sont éligibles ; la langue est celle du master ou du doctorat choisi. Source : https://www.campusfrance.org/fr/faq-appel-a-candidature-a-la-bourse-eiffel"
  },
  {
    "collection": "programs",
    "id": "universite-claude-bernard-lyon-1-villeurbanne__eiffel-excellence-scholarship__doctorat",
    "champs": {
      "language": "Français / Anglais selon la formation"
    },
    "motif": "FAQ officielle du programme Eiffel (Campus France), lue le 2026-09-12 : « Si la formation est enseignée en anglais, le candidat doit avoir le niveau requis en anglais. Si un étudiant est francophone, aucun certificat de langue n'est exigé pour une formation enseignée en français. » Les formations en anglais sont éligibles ; la langue est celle du master ou du doctorat choisi. Source : https://www.campusfrance.org/fr/faq-appel-a-candidature-a-la-bourse-eiffel"
  },
  {
    "collection": "programs",
    "id": "universite-claude-bernard-lyon-1-villeurbanne__eiffel-excellence-scholarship__master",
    "champs": {
      "language": "Français / Anglais selon la formation"
    },
    "motif": "FAQ officielle du programme Eiffel (Campus France), lue le 2026-09-12 : « Si la formation est enseignée en anglais, le candidat doit avoir le niveau requis en anglais. Si un étudiant est francophone, aucun certificat de langue n'est exigé pour une formation enseignée en français. » Les formations en anglais sont éligibles ; la langue est celle du master ou du doctorat choisi. Source : https://www.campusfrance.org/fr/faq-appel-a-candidature-a-la-bourse-eiffel"
  },
  {
    "collection": "programs",
    "id": "universite-cote-d-azur-nice__eiffel-excellence-scholarship__doctorat",
    "champs": {
      "language": "Français / Anglais selon la formation"
    },
    "motif": "FAQ officielle du programme Eiffel (Campus France), lue le 2026-09-12 : « Si la formation est enseignée en anglais, le candidat doit avoir le niveau requis en anglais. Si un étudiant est francophone, aucun certificat de langue n'est exigé pour une formation enseignée en français. » Les formations en anglais sont éligibles ; la langue est celle du master ou du doctorat choisi. Source : https://www.campusfrance.org/fr/faq-appel-a-candidature-a-la-bourse-eiffel"
  },
  {
    "collection": "programs",
    "id": "universite-cote-d-azur-nice__eiffel-excellence-scholarship__master",
    "champs": {
      "language": "Français / Anglais selon la formation"
    },
    "motif": "FAQ officielle du programme Eiffel (Campus France), lue le 2026-09-12 : « Si la formation est enseignée en anglais, le candidat doit avoir le niveau requis en anglais. Si un étudiant est francophone, aucun certificat de langue n'est exigé pour une formation enseignée en français. » Les formations en anglais sont éligibles ; la langue est celle du master ou du doctorat choisi. Source : https://www.campusfrance.org/fr/faq-appel-a-candidature-a-la-bourse-eiffel"
  },
  {
    "collection": "programs",
    "id": "universite-de-bordeaux-bordeaux__eiffel-excellence-scholarship__doctorat",
    "champs": {
      "language": "Français / Anglais selon la formation"
    },
    "motif": "FAQ officielle du programme Eiffel (Campus France), lue le 2026-09-12 : « Si la formation est enseignée en anglais, le candidat doit avoir le niveau requis en anglais. Si un étudiant est francophone, aucun certificat de langue n'est exigé pour une formation enseignée en français. » Les formations en anglais sont éligibles ; la langue est celle du master ou du doctorat choisi. Source : https://www.campusfrance.org/fr/faq-appel-a-candidature-a-la-bourse-eiffel"
  },
  {
    "collection": "programs",
    "id": "universite-de-bordeaux-bordeaux__eiffel-excellence-scholarship__master",
    "champs": {
      "language": "Français / Anglais selon la formation"
    },
    "motif": "FAQ officielle du programme Eiffel (Campus France), lue le 2026-09-12 : « Si la formation est enseignée en anglais, le candidat doit avoir le niveau requis en anglais. Si un étudiant est francophone, aucun certificat de langue n'est exigé pour une formation enseignée en français. » Les formations en anglais sont éligibles ; la langue est celle du master ou du doctorat choisi. Source : https://www.campusfrance.org/fr/faq-appel-a-candidature-a-la-bourse-eiffel"
  },
  {
    "collection": "programs",
    "id": "universite-de-lille-lille__eiffel-excellence-scholarship__doctorat",
    "champs": {
      "language": "Français / Anglais selon la formation"
    },
    "motif": "FAQ officielle du programme Eiffel (Campus France), lue le 2026-09-12 : « Si la formation est enseignée en anglais, le candidat doit avoir le niveau requis en anglais. Si un étudiant est francophone, aucun certificat de langue n'est exigé pour une formation enseignée en français. » Les formations en anglais sont éligibles ; la langue est celle du master ou du doctorat choisi. Source : https://www.campusfrance.org/fr/faq-appel-a-candidature-a-la-bourse-eiffel"
  },
  {
    "collection": "programs",
    "id": "universite-de-lille-lille__eiffel-excellence-scholarship__master",
    "champs": {
      "language": "Français / Anglais selon la formation"
    },
    "motif": "FAQ officielle du programme Eiffel (Campus France), lue le 2026-09-12 : « Si la formation est enseignée en anglais, le candidat doit avoir le niveau requis en anglais. Si un étudiant est francophone, aucun certificat de langue n'est exigé pour une formation enseignée en français. » Les formations en anglais sont éligibles ; la langue est celle du master ou du doctorat choisi. Source : https://www.campusfrance.org/fr/faq-appel-a-candidature-a-la-bourse-eiffel"
  },
  {
    "collection": "programs",
    "id": "universite-de-lorraine-nancy__eiffel-excellence-scholarship__doctorat",
    "champs": {
      "language": "Français / Anglais selon la formation"
    },
    "motif": "FAQ officielle du programme Eiffel (Campus France), lue le 2026-09-12 : « Si la formation est enseignée en anglais, le candidat doit avoir le niveau requis en anglais. Si un étudiant est francophone, aucun certificat de langue n'est exigé pour une formation enseignée en français. » Les formations en anglais sont éligibles ; la langue est celle du master ou du doctorat choisi. Source : https://www.campusfrance.org/fr/faq-appel-a-candidature-a-la-bourse-eiffel"
  },
  {
    "collection": "programs",
    "id": "universite-de-lorraine-nancy__eiffel-excellence-scholarship__master",
    "champs": {
      "language": "Français / Anglais selon la formation"
    },
    "motif": "FAQ officielle du programme Eiffel (Campus France), lue le 2026-09-12 : « Si la formation est enseignée en anglais, le candidat doit avoir le niveau requis en anglais. Si un étudiant est francophone, aucun certificat de langue n'est exigé pour une formation enseignée en français. » Les formations en anglais sont éligibles ; la langue est celle du master ou du doctorat choisi. Source : https://www.campusfrance.org/fr/faq-appel-a-candidature-a-la-bourse-eiffel"
  },
  {
    "collection": "programs",
    "id": "universite-de-rennes-rennes__eiffel-excellence-scholarship__doctorat",
    "champs": {
      "language": "Français / Anglais selon la formation"
    },
    "motif": "FAQ officielle du programme Eiffel (Campus France), lue le 2026-09-12 : « Si la formation est enseignée en anglais, le candidat doit avoir le niveau requis en anglais. Si un étudiant est francophone, aucun certificat de langue n'est exigé pour une formation enseignée en français. » Les formations en anglais sont éligibles ; la langue est celle du master ou du doctorat choisi. Source : https://www.campusfrance.org/fr/faq-appel-a-candidature-a-la-bourse-eiffel"
  },
  {
    "collection": "programs",
    "id": "universite-de-rennes-rennes__eiffel-excellence-scholarship__master",
    "champs": {
      "language": "Français / Anglais selon la formation"
    },
    "motif": "FAQ officielle du programme Eiffel (Campus France), lue le 2026-09-12 : « Si la formation est enseignée en anglais, le candidat doit avoir le niveau requis en anglais. Si un étudiant est francophone, aucun certificat de langue n'est exigé pour une formation enseignée en français. » Les formations en anglais sont éligibles ; la langue est celle du master ou du doctorat choisi. Source : https://www.campusfrance.org/fr/faq-appel-a-candidature-a-la-bourse-eiffel"
  },
  {
    "collection": "programs",
    "id": "universite-de-strasbourg-strasbourg__eiffel-excellence-scholarship__doctorat",
    "champs": {
      "language": "Français / Anglais selon la formation"
    },
    "motif": "FAQ officielle du programme Eiffel (Campus France), lue le 2026-09-12 : « Si la formation est enseignée en anglais, le candidat doit avoir le niveau requis en anglais. Si un étudiant est francophone, aucun certificat de langue n'est exigé pour une formation enseignée en français. » Les formations en anglais sont éligibles ; la langue est celle du master ou du doctorat choisi. Source : https://www.campusfrance.org/fr/faq-appel-a-candidature-a-la-bourse-eiffel"
  },
  {
    "collection": "programs",
    "id": "universite-de-strasbourg-strasbourg__eiffel-excellence-scholarship__master",
    "champs": {
      "language": "Français / Anglais selon la formation"
    },
    "motif": "FAQ officielle du programme Eiffel (Campus France), lue le 2026-09-12 : « Si la formation est enseignée en anglais, le candidat doit avoir le niveau requis en anglais. Si un étudiant est francophone, aucun certificat de langue n'est exigé pour une formation enseignée en français. » Les formations en anglais sont éligibles ; la langue est celle du master ou du doctorat choisi. Source : https://www.campusfrance.org/fr/faq-appel-a-candidature-a-la-bourse-eiffel"
  },
  {
    "collection": "programs",
    "id": "universite-de-toulouse-toulouse__eiffel-excellence-scholarship__doctorat",
    "champs": {
      "language": "Français / Anglais selon la formation"
    },
    "motif": "FAQ officielle du programme Eiffel (Campus France), lue le 2026-09-12 : « Si la formation est enseignée en anglais, le candidat doit avoir le niveau requis en anglais. Si un étudiant est francophone, aucun certificat de langue n'est exigé pour une formation enseignée en français. » Les formations en anglais sont éligibles ; la langue est celle du master ou du doctorat choisi. Source : https://www.campusfrance.org/fr/faq-appel-a-candidature-a-la-bourse-eiffel"
  },
  {
    "collection": "programs",
    "id": "universite-de-toulouse-toulouse__eiffel-excellence-scholarship__master",
    "champs": {
      "language": "Français / Anglais selon la formation"
    },
    "motif": "FAQ officielle du programme Eiffel (Campus France), lue le 2026-09-12 : « Si la formation est enseignée en anglais, le candidat doit avoir le niveau requis en anglais. Si un étudiant est francophone, aucun certificat de langue n'est exigé pour une formation enseignée en français. » Les formations en anglais sont éligibles ; la langue est celle du master ou du doctorat choisi. Source : https://www.campusfrance.org/fr/faq-appel-a-candidature-a-la-bourse-eiffel"
  },
  {
    "collection": "programs",
    "id": "universite-grenoble-alpes-grenoble__eiffel-excellence-scholarship__doctorat",
    "champs": {
      "language": "Français / Anglais selon la formation"
    },
    "motif": "FAQ officielle du programme Eiffel (Campus France), lue le 2026-09-12 : « Si la formation est enseignée en anglais, le candidat doit avoir le niveau requis en anglais. Si un étudiant est francophone, aucun certificat de langue n'est exigé pour une formation enseignée en français. » Les formations en anglais sont éligibles ; la langue est celle du master ou du doctorat choisi. Source : https://www.campusfrance.org/fr/faq-appel-a-candidature-a-la-bourse-eiffel"
  },
  {
    "collection": "programs",
    "id": "universite-grenoble-alpes-grenoble__eiffel-excellence-scholarship__master",
    "champs": {
      "language": "Français / Anglais selon la formation"
    },
    "motif": "FAQ officielle du programme Eiffel (Campus France), lue le 2026-09-12 : « Si la formation est enseignée en anglais, le candidat doit avoir le niveau requis en anglais. Si un étudiant est francophone, aucun certificat de langue n'est exigé pour une formation enseignée en français. » Les formations en anglais sont éligibles ; la langue est celle du master ou du doctorat choisi. Source : https://www.campusfrance.org/fr/faq-appel-a-candidature-a-la-bourse-eiffel"
  },
  {
    "collection": "programs",
    "id": "universite-paris-1-pantheon-sorbonne-paris__eiffel-excellence-scholarship__doctorat",
    "champs": {
      "language": "Français / Anglais selon la formation"
    },
    "motif": "FAQ officielle du programme Eiffel (Campus France), lue le 2026-09-12 : « Si la formation est enseignée en anglais, le candidat doit avoir le niveau requis en anglais. Si un étudiant est francophone, aucun certificat de langue n'est exigé pour une formation enseignée en français. » Les formations en anglais sont éligibles ; la langue est celle du master ou du doctorat choisi. Source : https://www.campusfrance.org/fr/faq-appel-a-candidature-a-la-bourse-eiffel"
  },
  {
    "collection": "programs",
    "id": "universite-paris-1-pantheon-sorbonne-paris__eiffel-excellence-scholarship__master",
    "champs": {
      "language": "Français / Anglais selon la formation"
    },
    "motif": "FAQ officielle du programme Eiffel (Campus France), lue le 2026-09-12 : « Si la formation est enseignée en anglais, le candidat doit avoir le niveau requis en anglais. Si un étudiant est francophone, aucun certificat de langue n'est exigé pour une formation enseignée en français. » Les formations en anglais sont éligibles ; la langue est celle du master ou du doctorat choisi. Source : https://www.campusfrance.org/fr/faq-appel-a-candidature-a-la-bourse-eiffel"
  },
  {
    "collection": "programs",
    "id": "universite-paris-cite-paris__eiffel-excellence-scholarship__doctorat",
    "champs": {
      "language": "Français / Anglais selon la formation"
    },
    "motif": "FAQ officielle du programme Eiffel (Campus France), lue le 2026-09-12 : « Si la formation est enseignée en anglais, le candidat doit avoir le niveau requis en anglais. Si un étudiant est francophone, aucun certificat de langue n'est exigé pour une formation enseignée en français. » Les formations en anglais sont éligibles ; la langue est celle du master ou du doctorat choisi. Source : https://www.campusfrance.org/fr/faq-appel-a-candidature-a-la-bourse-eiffel"
  },
  {
    "collection": "programs",
    "id": "universite-paris-cite-paris__eiffel-excellence-scholarship__master",
    "champs": {
      "language": "Français / Anglais selon la formation"
    },
    "motif": "FAQ officielle du programme Eiffel (Campus France), lue le 2026-09-12 : « Si la formation est enseignée en anglais, le candidat doit avoir le niveau requis en anglais. Si un étudiant est francophone, aucun certificat de langue n'est exigé pour une formation enseignée en français. » Les formations en anglais sont éligibles ; la langue est celle du master ou du doctorat choisi. Source : https://www.campusfrance.org/fr/faq-appel-a-candidature-a-la-bourse-eiffel"
  },
  {
    "collection": "programs",
    "id": "universite-paris-dauphine-psl-paris__eiffel-excellence-scholarship__doctorat",
    "champs": {
      "language": "Français / Anglais selon la formation"
    },
    "motif": "FAQ officielle du programme Eiffel (Campus France), lue le 2026-09-12 : « Si la formation est enseignée en anglais, le candidat doit avoir le niveau requis en anglais. Si un étudiant est francophone, aucun certificat de langue n'est exigé pour une formation enseignée en français. » Les formations en anglais sont éligibles ; la langue est celle du master ou du doctorat choisi. Source : https://www.campusfrance.org/fr/faq-appel-a-candidature-a-la-bourse-eiffel"
  },
  {
    "collection": "programs",
    "id": "universite-paris-dauphine-psl-paris__eiffel-excellence-scholarship__master",
    "champs": {
      "language": "Français / Anglais selon la formation"
    },
    "motif": "FAQ officielle du programme Eiffel (Campus France), lue le 2026-09-12 : « Si la formation est enseignée en anglais, le candidat doit avoir le niveau requis en anglais. Si un étudiant est francophone, aucun certificat de langue n'est exigé pour une formation enseignée en français. » Les formations en anglais sont éligibles ; la langue est celle du master ou du doctorat choisi. Source : https://www.campusfrance.org/fr/faq-appel-a-candidature-a-la-bourse-eiffel"
  },
  {
    "collection": "programs",
    "id": "universite-paris-saclay-orsay__eiffel-excellence-scholarship__doctorat",
    "champs": {
      "language": "Français / Anglais selon la formation"
    },
    "motif": "FAQ officielle du programme Eiffel (Campus France), lue le 2026-09-12 : « Si la formation est enseignée en anglais, le candidat doit avoir le niveau requis en anglais. Si un étudiant est francophone, aucun certificat de langue n'est exigé pour une formation enseignée en français. » Les formations en anglais sont éligibles ; la langue est celle du master ou du doctorat choisi. Source : https://www.campusfrance.org/fr/faq-appel-a-candidature-a-la-bourse-eiffel"
  },
  {
    "collection": "programs",
    "id": "universite-paris-saclay-orsay__eiffel-excellence-scholarship__master",
    "champs": {
      "language": "Français / Anglais selon la formation"
    },
    "motif": "FAQ officielle du programme Eiffel (Campus France), lue le 2026-09-12 : « Si la formation est enseignée en anglais, le candidat doit avoir le niveau requis en anglais. Si un étudiant est francophone, aucun certificat de langue n'est exigé pour une formation enseignée en français. » Les formations en anglais sont éligibles ; la langue est celle du master ou du doctorat choisi. Source : https://www.campusfrance.org/fr/faq-appel-a-candidature-a-la-bourse-eiffel"
  },
  {
    "collection": "programs",
    "id": "universite-sorbonne-paris-nord-villetaneuse__eiffel-excellence-scholarship__doctorat",
    "champs": {
      "language": "Français / Anglais selon la formation"
    },
    "motif": "FAQ officielle du programme Eiffel (Campus France), lue le 2026-09-12 : « Si la formation est enseignée en anglais, le candidat doit avoir le niveau requis en anglais. Si un étudiant est francophone, aucun certificat de langue n'est exigé pour une formation enseignée en français. » Les formations en anglais sont éligibles ; la langue est celle du master ou du doctorat choisi. Source : https://www.campusfrance.org/fr/faq-appel-a-candidature-a-la-bourse-eiffel"
  },
  {
    "collection": "programs",
    "id": "universite-sorbonne-paris-nord-villetaneuse__eiffel-excellence-scholarship__master",
    "champs": {
      "language": "Français / Anglais selon la formation"
    },
    "motif": "FAQ officielle du programme Eiffel (Campus France), lue le 2026-09-12 : « Si la formation est enseignée en anglais, le candidat doit avoir le niveau requis en anglais. Si un étudiant est francophone, aucun certificat de langue n'est exigé pour une formation enseignée en français. » Les formations en anglais sont éligibles ; la langue est celle du master ou du doctorat choisi. Source : https://www.campusfrance.org/fr/faq-appel-a-candidature-a-la-bourse-eiffel"
  },
  {
    "collection": "programs",
    "id": "bogazici-university-istanbul__turkiye-burslari-research__doctorat",
    "champs": {
      "language": "Turc / Anglais selon le programme (cours de turc inclus)"
    },
    "motif": "Site officiel Türkiye Bursları (page du programme, lue le 2026-09-12) : le moteur de recherche des formations liste les langues « Türkçe, İngilizce, İngilizce (%30), Fransızca, Arapça » — la majorité en turc, une partie en anglais ou mixte ; un « Turkish language course » est compris dans la bourse. Source : https://www.turkiyeburslari.gov.tr/en/page/prospective-students/scholarship-program"
  },
  {
    "collection": "programs",
    "id": "bogazici-university-istanbul__turkiye-burslari-success__doctorat",
    "champs": {
      "language": "Turc / Anglais selon le programme (cours de turc inclus)"
    },
    "motif": "Site officiel Türkiye Bursları (page du programme, lue le 2026-09-12) : le moteur de recherche des formations liste les langues « Türkçe, İngilizce, İngilizce (%30), Fransızca, Arapça » — la majorité en turc, une partie en anglais ou mixte ; un « Turkish language course » est compris dans la bourse. Source : https://www.turkiyeburslari.gov.tr/en/page/prospective-students/scholarship-program"
  },
  {
    "collection": "programs",
    "id": "bogazici-university-istanbul__turkiye-burslari-success__licence",
    "champs": {
      "language": "Turc / Anglais selon le programme (cours de turc inclus)"
    },
    "motif": "Site officiel Türkiye Bursları (page du programme, lue le 2026-09-12) : le moteur de recherche des formations liste les langues « Türkçe, İngilizce, İngilizce (%30), Fransızca, Arapça » — la majorité en turc, une partie en anglais ou mixte ; un « Turkish language course » est compris dans la bourse. Source : https://www.turkiyeburslari.gov.tr/en/page/prospective-students/scholarship-program"
  },
  {
    "collection": "programs",
    "id": "bogazici-university-istanbul__turkiye-burslari-success__master",
    "champs": {
      "language": "Turc / Anglais selon le programme (cours de turc inclus)"
    },
    "motif": "Site officiel Türkiye Bursları (page du programme, lue le 2026-09-12) : le moteur de recherche des formations liste les langues « Türkçe, İngilizce, İngilizce (%30), Fransızca, Arapça » — la majorité en turc, une partie en anglais ou mixte ; un « Turkish language course » est compris dans la bourse. Source : https://www.turkiyeburslari.gov.tr/en/page/prospective-students/scholarship-program"
  },
  {
    "collection": "programs",
    "id": "bogazici-university-istanbul__ytb-isdb-joint-scholarship__doctorat",
    "champs": {
      "language": "Turc / Anglais selon le programme (cours de turc inclus)"
    },
    "motif": "Site officiel Türkiye Bursları (page du programme, lue le 2026-09-12) : le moteur de recherche des formations liste les langues « Türkçe, İngilizce, İngilizce (%30), Fransızca, Arapça » — la majorité en turc, une partie en anglais ou mixte ; un « Turkish language course » est compris dans la bourse. Source : https://www.turkiyeburslari.gov.tr/en/page/prospective-students/scholarship-program"
  },
  {
    "collection": "programs",
    "id": "bogazici-university-istanbul__ytb-isdb-joint-scholarship__licence",
    "champs": {
      "language": "Turc / Anglais selon le programme (cours de turc inclus)"
    },
    "motif": "Site officiel Türkiye Bursları (page du programme, lue le 2026-09-12) : le moteur de recherche des formations liste les langues « Türkçe, İngilizce, İngilizce (%30), Fransızca, Arapça » — la majorité en turc, une partie en anglais ou mixte ; un « Turkish language course » est compris dans la bourse. Source : https://www.turkiyeburslari.gov.tr/en/page/prospective-students/scholarship-program"
  },
  {
    "collection": "programs",
    "id": "bogazici-university-istanbul__ytb-isdb-joint-scholarship__master",
    "champs": {
      "language": "Turc / Anglais selon le programme (cours de turc inclus)"
    },
    "motif": "Site officiel Türkiye Bursları (page du programme, lue le 2026-09-12) : le moteur de recherche des formations liste les langues « Türkçe, İngilizce, İngilizce (%30), Fransızca, Arapça » — la majorité en turc, une partie en anglais ou mixte ; un « Turkish language course » est compris dans la bourse. Source : https://www.turkiyeburslari.gov.tr/en/page/prospective-students/scholarship-program"
  },
  {
    "collection": "programs",
    "id": "istanbul-technical-university-istanbul__turkiye-burslari-research__doctorat",
    "champs": {
      "language": "Turc / Anglais selon le programme (cours de turc inclus)"
    },
    "motif": "Site officiel Türkiye Bursları (page du programme, lue le 2026-09-12) : le moteur de recherche des formations liste les langues « Türkçe, İngilizce, İngilizce (%30), Fransızca, Arapça » — la majorité en turc, une partie en anglais ou mixte ; un « Turkish language course » est compris dans la bourse. Source : https://www.turkiyeburslari.gov.tr/en/page/prospective-students/scholarship-program"
  },
  {
    "collection": "programs",
    "id": "istanbul-technical-university-istanbul__turkiye-burslari-success__doctorat",
    "champs": {
      "language": "Turc / Anglais selon le programme (cours de turc inclus)"
    },
    "motif": "Site officiel Türkiye Bursları (page du programme, lue le 2026-09-12) : le moteur de recherche des formations liste les langues « Türkçe, İngilizce, İngilizce (%30), Fransızca, Arapça » — la majorité en turc, une partie en anglais ou mixte ; un « Turkish language course » est compris dans la bourse. Source : https://www.turkiyeburslari.gov.tr/en/page/prospective-students/scholarship-program"
  },
  {
    "collection": "programs",
    "id": "istanbul-technical-university-istanbul__turkiye-burslari-success__licence",
    "champs": {
      "language": "Turc / Anglais selon le programme (cours de turc inclus)"
    },
    "motif": "Site officiel Türkiye Bursları (page du programme, lue le 2026-09-12) : le moteur de recherche des formations liste les langues « Türkçe, İngilizce, İngilizce (%30), Fransızca, Arapça » — la majorité en turc, une partie en anglais ou mixte ; un « Turkish language course » est compris dans la bourse. Source : https://www.turkiyeburslari.gov.tr/en/page/prospective-students/scholarship-program"
  },
  {
    "collection": "programs",
    "id": "istanbul-technical-university-istanbul__turkiye-burslari-success__master",
    "champs": {
      "language": "Turc / Anglais selon le programme (cours de turc inclus)"
    },
    "motif": "Site officiel Türkiye Bursları (page du programme, lue le 2026-09-12) : le moteur de recherche des formations liste les langues « Türkçe, İngilizce, İngilizce (%30), Fransızca, Arapça » — la majorité en turc, une partie en anglais ou mixte ; un « Turkish language course » est compris dans la bourse. Source : https://www.turkiyeburslari.gov.tr/en/page/prospective-students/scholarship-program"
  },
  {
    "collection": "programs",
    "id": "istanbul-technical-university-istanbul__ytb-isdb-joint-scholarship__doctorat",
    "champs": {
      "language": "Turc / Anglais selon le programme (cours de turc inclus)"
    },
    "motif": "Site officiel Türkiye Bursları (page du programme, lue le 2026-09-12) : le moteur de recherche des formations liste les langues « Türkçe, İngilizce, İngilizce (%30), Fransızca, Arapça » — la majorité en turc, une partie en anglais ou mixte ; un « Turkish language course » est compris dans la bourse. Source : https://www.turkiyeburslari.gov.tr/en/page/prospective-students/scholarship-program"
  },
  {
    "collection": "programs",
    "id": "istanbul-technical-university-istanbul__ytb-isdb-joint-scholarship__licence",
    "champs": {
      "language": "Turc / Anglais selon le programme (cours de turc inclus)"
    },
    "motif": "Site officiel Türkiye Bursları (page du programme, lue le 2026-09-12) : le moteur de recherche des formations liste les langues « Türkçe, İngilizce, İngilizce (%30), Fransızca, Arapça » — la majorité en turc, une partie en anglais ou mixte ; un « Turkish language course » est compris dans la bourse. Source : https://www.turkiyeburslari.gov.tr/en/page/prospective-students/scholarship-program"
  },
  {
    "collection": "programs",
    "id": "istanbul-technical-university-istanbul__ytb-isdb-joint-scholarship__master",
    "champs": {
      "language": "Turc / Anglais selon le programme (cours de turc inclus)"
    },
    "motif": "Site officiel Türkiye Bursları (page du programme, lue le 2026-09-12) : le moteur de recherche des formations liste les langues « Türkçe, İngilizce, İngilizce (%30), Fransızca, Arapça » — la majorité en turc, une partie en anglais ou mixte ; un « Turkish language course » est compris dans la bourse. Source : https://www.turkiyeburslari.gov.tr/en/page/prospective-students/scholarship-program"
  },
  {
    "collection": "programs",
    "id": "istanbul-university-istanbul__turkiye-burslari-research__doctorat",
    "champs": {
      "language": "Turc / Anglais selon le programme (cours de turc inclus)"
    },
    "motif": "Site officiel Türkiye Bursları (page du programme, lue le 2026-09-12) : le moteur de recherche des formations liste les langues « Türkçe, İngilizce, İngilizce (%30), Fransızca, Arapça » — la majorité en turc, une partie en anglais ou mixte ; un « Turkish language course » est compris dans la bourse. Source : https://www.turkiyeburslari.gov.tr/en/page/prospective-students/scholarship-program"
  },
  {
    "collection": "programs",
    "id": "istanbul-university-istanbul__turkiye-burslari-success__doctorat",
    "champs": {
      "language": "Turc / Anglais selon le programme (cours de turc inclus)"
    },
    "motif": "Site officiel Türkiye Bursları (page du programme, lue le 2026-09-12) : le moteur de recherche des formations liste les langues « Türkçe, İngilizce, İngilizce (%30), Fransızca, Arapça » — la majorité en turc, une partie en anglais ou mixte ; un « Turkish language course » est compris dans la bourse. Source : https://www.turkiyeburslari.gov.tr/en/page/prospective-students/scholarship-program"
  },
  {
    "collection": "programs",
    "id": "istanbul-university-istanbul__turkiye-burslari-success__licence",
    "champs": {
      "language": "Turc / Anglais selon le programme (cours de turc inclus)"
    },
    "motif": "Site officiel Türkiye Bursları (page du programme, lue le 2026-09-12) : le moteur de recherche des formations liste les langues « Türkçe, İngilizce, İngilizce (%30), Fransızca, Arapça » — la majorité en turc, une partie en anglais ou mixte ; un « Turkish language course » est compris dans la bourse. Source : https://www.turkiyeburslari.gov.tr/en/page/prospective-students/scholarship-program"
  },
  {
    "collection": "programs",
    "id": "istanbul-university-istanbul__turkiye-burslari-success__master",
    "champs": {
      "language": "Turc / Anglais selon le programme (cours de turc inclus)"
    },
    "motif": "Site officiel Türkiye Bursları (page du programme, lue le 2026-09-12) : le moteur de recherche des formations liste les langues « Türkçe, İngilizce, İngilizce (%30), Fransızca, Arapça » — la majorité en turc, une partie en anglais ou mixte ; un « Turkish language course » est compris dans la bourse. Source : https://www.turkiyeburslari.gov.tr/en/page/prospective-students/scholarship-program"
  },
  {
    "collection": "programs",
    "id": "istanbul-university-istanbul__ytb-isdb-joint-scholarship__doctorat",
    "champs": {
      "language": "Turc / Anglais selon le programme (cours de turc inclus)"
    },
    "motif": "Site officiel Türkiye Bursları (page du programme, lue le 2026-09-12) : le moteur de recherche des formations liste les langues « Türkçe, İngilizce, İngilizce (%30), Fransızca, Arapça » — la majorité en turc, une partie en anglais ou mixte ; un « Turkish language course » est compris dans la bourse. Source : https://www.turkiyeburslari.gov.tr/en/page/prospective-students/scholarship-program"
  },
  {
    "collection": "programs",
    "id": "istanbul-university-istanbul__ytb-isdb-joint-scholarship__licence",
    "champs": {
      "language": "Turc / Anglais selon le programme (cours de turc inclus)"
    },
    "motif": "Site officiel Türkiye Bursları (page du programme, lue le 2026-09-12) : le moteur de recherche des formations liste les langues « Türkçe, İngilizce, İngilizce (%30), Fransızca, Arapça » — la majorité en turc, une partie en anglais ou mixte ; un « Turkish language course » est compris dans la bourse. Source : https://www.turkiyeburslari.gov.tr/en/page/prospective-students/scholarship-program"
  },
  {
    "collection": "programs",
    "id": "istanbul-university-istanbul__ytb-isdb-joint-scholarship__master",
    "champs": {
      "language": "Turc / Anglais selon le programme (cours de turc inclus)"
    },
    "motif": "Site officiel Türkiye Bursları (page du programme, lue le 2026-09-12) : le moteur de recherche des formations liste les langues « Türkçe, İngilizce, İngilizce (%30), Fransızca, Arapça » — la majorité en turc, une partie en anglais ou mixte ; un « Turkish language course » est compris dans la bourse. Source : https://www.turkiyeburslari.gov.tr/en/page/prospective-students/scholarship-program"
  },
  {
    "collection": "programs",
    "id": "humboldt-universitat-zu-berlin-berlin__konrad-adenauer-stiftung__doctorat",
    "champs": {
      "language": "Allemand (B2 exigé) / Anglais selon le cursus"
    },
    "motif": "Konrad-Adenauer-Stiftung, page du programme pour master/doctorat en Allemagne, lue le 2026-09-12 : « Deutschkenntnisse auf dem Niveau B1/B2 des Europäischen Referenzrahmens » à la candidature, B2 atteint au début des études (cours préparatoire finançable). Source : https://www.kas.de/de/web/mexiko/statische-inhalte-detail/-/content/stipendien-fuer-ein-masterstudium-oder-eine-promotion-in-deutschland-19"
  },
  {
    "collection": "programs",
    "id": "humboldt-universitat-zu-berlin-berlin__konrad-adenauer-stiftung__licence",
    "champs": {
      "language": "Allemand (B2 exigé) / Anglais selon le cursus"
    },
    "motif": "Konrad-Adenauer-Stiftung, page du programme pour master/doctorat en Allemagne, lue le 2026-09-12 : « Deutschkenntnisse auf dem Niveau B1/B2 des Europäischen Referenzrahmens » à la candidature, B2 atteint au début des études (cours préparatoire finançable). Source : https://www.kas.de/de/web/mexiko/statische-inhalte-detail/-/content/stipendien-fuer-ein-masterstudium-oder-eine-promotion-in-deutschland-19"
  },
  {
    "collection": "programs",
    "id": "humboldt-universitat-zu-berlin-berlin__konrad-adenauer-stiftung__master",
    "champs": {
      "language": "Allemand (B2 exigé) / Anglais selon le cursus"
    },
    "motif": "Konrad-Adenauer-Stiftung, page du programme pour master/doctorat en Allemagne, lue le 2026-09-12 : « Deutschkenntnisse auf dem Niveau B1/B2 des Europäischen Referenzrahmens » à la candidature, B2 atteint au début des études (cours préparatoire finançable). Source : https://www.kas.de/de/web/mexiko/statische-inhalte-detail/-/content/stipendien-fuer-ein-masterstudium-oder-eine-promotion-in-deutschland-19"
  },
  {
    "collection": "programs",
    "id": "leibniz-universitat-hannover-hannover__konrad-adenauer-stiftung__doctorat",
    "champs": {
      "language": "Allemand (B2 exigé) / Anglais selon le cursus"
    },
    "motif": "Konrad-Adenauer-Stiftung, page du programme pour master/doctorat en Allemagne, lue le 2026-09-12 : « Deutschkenntnisse auf dem Niveau B1/B2 des Europäischen Referenzrahmens » à la candidature, B2 atteint au début des études (cours préparatoire finançable). Source : https://www.kas.de/de/web/mexiko/statische-inhalte-detail/-/content/stipendien-fuer-ein-masterstudium-oder-eine-promotion-in-deutschland-19"
  },
  {
    "collection": "programs",
    "id": "leibniz-universitat-hannover-hannover__konrad-adenauer-stiftung__licence",
    "champs": {
      "language": "Allemand (B2 exigé) / Anglais selon le cursus"
    },
    "motif": "Konrad-Adenauer-Stiftung, page du programme pour master/doctorat en Allemagne, lue le 2026-09-12 : « Deutschkenntnisse auf dem Niveau B1/B2 des Europäischen Referenzrahmens » à la candidature, B2 atteint au début des études (cours préparatoire finançable). Source : https://www.kas.de/de/web/mexiko/statische-inhalte-detail/-/content/stipendien-fuer-ein-masterstudium-oder-eine-promotion-in-deutschland-19"
  },
  {
    "collection": "programs",
    "id": "leibniz-universitat-hannover-hannover__konrad-adenauer-stiftung__master",
    "champs": {
      "language": "Allemand (B2 exigé) / Anglais selon le cursus"
    },
    "motif": "Konrad-Adenauer-Stiftung, page du programme pour master/doctorat en Allemagne, lue le 2026-09-12 : « Deutschkenntnisse auf dem Niveau B1/B2 des Europäischen Referenzrahmens » à la candidature, B2 atteint au début des études (cours préparatoire finançable). Source : https://www.kas.de/de/web/mexiko/statische-inhalte-detail/-/content/stipendien-fuer-ein-masterstudium-oder-eine-promotion-in-deutschland-19"
  },
  {
    "collection": "programs",
    "id": "universitat-hamburg-hamburg__konrad-adenauer-stiftung__doctorat",
    "champs": {
      "language": "Allemand (B2 exigé) / Anglais selon le cursus"
    },
    "motif": "Konrad-Adenauer-Stiftung, page du programme pour master/doctorat en Allemagne, lue le 2026-09-12 : « Deutschkenntnisse auf dem Niveau B1/B2 des Europäischen Referenzrahmens » à la candidature, B2 atteint au début des études (cours préparatoire finançable). Source : https://www.kas.de/de/web/mexiko/statische-inhalte-detail/-/content/stipendien-fuer-ein-masterstudium-oder-eine-promotion-in-deutschland-19"
  },
  {
    "collection": "programs",
    "id": "universitat-hamburg-hamburg__konrad-adenauer-stiftung__licence",
    "champs": {
      "language": "Allemand (B2 exigé) / Anglais selon le cursus"
    },
    "motif": "Konrad-Adenauer-Stiftung, page du programme pour master/doctorat en Allemagne, lue le 2026-09-12 : « Deutschkenntnisse auf dem Niveau B1/B2 des Europäischen Referenzrahmens » à la candidature, B2 atteint au début des études (cours préparatoire finançable). Source : https://www.kas.de/de/web/mexiko/statische-inhalte-detail/-/content/stipendien-fuer-ein-masterstudium-oder-eine-promotion-in-deutschland-19"
  },
  {
    "collection": "programs",
    "id": "universitat-hamburg-hamburg__konrad-adenauer-stiftung__master",
    "champs": {
      "language": "Allemand (B2 exigé) / Anglais selon le cursus"
    },
    "motif": "Konrad-Adenauer-Stiftung, page du programme pour master/doctorat en Allemagne, lue le 2026-09-12 : « Deutschkenntnisse auf dem Niveau B1/B2 des Europäischen Referenzrahmens » à la candidature, B2 atteint au début des études (cours préparatoire finançable). Source : https://www.kas.de/de/web/mexiko/statische-inhalte-detail/-/content/stipendien-fuer-ein-masterstudium-oder-eine-promotion-in-deutschland-19"
  },
  {
    "collection": "programs",
    "id": "humboldt-universitat-zu-berlin-berlin__friedrich-ebert-stiftung__doctorat",
    "champs": {
      "language": "Allemand (B2 exigé) / Anglais selon le cursus"
    },
    "motif": "Friedrich-Ebert-Stiftung, Grundförderung für Ausländer:innen, lue le 2026-09-12 : « Wir akzeptieren ein Sprachniveau von B2, auch ohne Zertifikat » ; « Selbst wenn Sie ein Studium in englischer Sprache absolvieren, müssen Sie mit Ihrer Bewerbung ausreichende deutsche Sprachkenntnisse nachweisen » — un cursus en anglais est possible, l'allemand reste exigé. Source : https://www.fes.de/studienfoerderung/stipendium/grundfoerderung-fuer-auslaender-innen"
  },
  {
    "collection": "programs",
    "id": "humboldt-universitat-zu-berlin-berlin__friedrich-ebert-stiftung__licence",
    "champs": {
      "language": "Allemand (B2 exigé) / Anglais selon le cursus"
    },
    "motif": "Friedrich-Ebert-Stiftung, Grundförderung für Ausländer:innen, lue le 2026-09-12 : « Wir akzeptieren ein Sprachniveau von B2, auch ohne Zertifikat » ; « Selbst wenn Sie ein Studium in englischer Sprache absolvieren, müssen Sie mit Ihrer Bewerbung ausreichende deutsche Sprachkenntnisse nachweisen » — un cursus en anglais est possible, l'allemand reste exigé. Source : https://www.fes.de/studienfoerderung/stipendium/grundfoerderung-fuer-auslaender-innen"
  },
  {
    "collection": "programs",
    "id": "humboldt-universitat-zu-berlin-berlin__friedrich-ebert-stiftung__master",
    "champs": {
      "language": "Allemand (B2 exigé) / Anglais selon le cursus"
    },
    "motif": "Friedrich-Ebert-Stiftung, Grundförderung für Ausländer:innen, lue le 2026-09-12 : « Wir akzeptieren ein Sprachniveau von B2, auch ohne Zertifikat » ; « Selbst wenn Sie ein Studium in englischer Sprache absolvieren, müssen Sie mit Ihrer Bewerbung ausreichende deutsche Sprachkenntnisse nachweisen » — un cursus en anglais est possible, l'allemand reste exigé. Source : https://www.fes.de/studienfoerderung/stipendium/grundfoerderung-fuer-auslaender-innen"
  },
  {
    "collection": "programs",
    "id": "leibniz-universitat-hannover-hannover__friedrich-ebert-stiftung__doctorat",
    "champs": {
      "language": "Allemand (B2 exigé) / Anglais selon le cursus"
    },
    "motif": "Friedrich-Ebert-Stiftung, Grundförderung für Ausländer:innen, lue le 2026-09-12 : « Wir akzeptieren ein Sprachniveau von B2, auch ohne Zertifikat » ; « Selbst wenn Sie ein Studium in englischer Sprache absolvieren, müssen Sie mit Ihrer Bewerbung ausreichende deutsche Sprachkenntnisse nachweisen » — un cursus en anglais est possible, l'allemand reste exigé. Source : https://www.fes.de/studienfoerderung/stipendium/grundfoerderung-fuer-auslaender-innen"
  },
  {
    "collection": "programs",
    "id": "leibniz-universitat-hannover-hannover__friedrich-ebert-stiftung__licence",
    "champs": {
      "language": "Allemand (B2 exigé) / Anglais selon le cursus"
    },
    "motif": "Friedrich-Ebert-Stiftung, Grundförderung für Ausländer:innen, lue le 2026-09-12 : « Wir akzeptieren ein Sprachniveau von B2, auch ohne Zertifikat » ; « Selbst wenn Sie ein Studium in englischer Sprache absolvieren, müssen Sie mit Ihrer Bewerbung ausreichende deutsche Sprachkenntnisse nachweisen » — un cursus en anglais est possible, l'allemand reste exigé. Source : https://www.fes.de/studienfoerderung/stipendium/grundfoerderung-fuer-auslaender-innen"
  },
  {
    "collection": "programs",
    "id": "leibniz-universitat-hannover-hannover__friedrich-ebert-stiftung__master",
    "champs": {
      "language": "Allemand (B2 exigé) / Anglais selon le cursus"
    },
    "motif": "Friedrich-Ebert-Stiftung, Grundförderung für Ausländer:innen, lue le 2026-09-12 : « Wir akzeptieren ein Sprachniveau von B2, auch ohne Zertifikat » ; « Selbst wenn Sie ein Studium in englischer Sprache absolvieren, müssen Sie mit Ihrer Bewerbung ausreichende deutsche Sprachkenntnisse nachweisen » — un cursus en anglais est possible, l'allemand reste exigé. Source : https://www.fes.de/studienfoerderung/stipendium/grundfoerderung-fuer-auslaender-innen"
  },
  {
    "collection": "programs",
    "id": "universitat-hamburg-hamburg__friedrich-ebert-stiftung__doctorat",
    "champs": {
      "language": "Allemand (B2 exigé) / Anglais selon le cursus"
    },
    "motif": "Friedrich-Ebert-Stiftung, Grundförderung für Ausländer:innen, lue le 2026-09-12 : « Wir akzeptieren ein Sprachniveau von B2, auch ohne Zertifikat » ; « Selbst wenn Sie ein Studium in englischer Sprache absolvieren, müssen Sie mit Ihrer Bewerbung ausreichende deutsche Sprachkenntnisse nachweisen » — un cursus en anglais est possible, l'allemand reste exigé. Source : https://www.fes.de/studienfoerderung/stipendium/grundfoerderung-fuer-auslaender-innen"
  },
  {
    "collection": "programs",
    "id": "universitat-hamburg-hamburg__friedrich-ebert-stiftung__licence",
    "champs": {
      "language": "Allemand (B2 exigé) / Anglais selon le cursus"
    },
    "motif": "Friedrich-Ebert-Stiftung, Grundförderung für Ausländer:innen, lue le 2026-09-12 : « Wir akzeptieren ein Sprachniveau von B2, auch ohne Zertifikat » ; « Selbst wenn Sie ein Studium in englischer Sprache absolvieren, müssen Sie mit Ihrer Bewerbung ausreichende deutsche Sprachkenntnisse nachweisen » — un cursus en anglais est possible, l'allemand reste exigé. Source : https://www.fes.de/studienfoerderung/stipendium/grundfoerderung-fuer-auslaender-innen"
  },
  {
    "collection": "programs",
    "id": "universitat-hamburg-hamburg__friedrich-ebert-stiftung__master",
    "champs": {
      "language": "Allemand (B2 exigé) / Anglais selon le cursus"
    },
    "motif": "Friedrich-Ebert-Stiftung, Grundförderung für Ausländer:innen, lue le 2026-09-12 : « Wir akzeptieren ein Sprachniveau von B2, auch ohne Zertifikat » ; « Selbst wenn Sie ein Studium in englischer Sprache absolvieren, müssen Sie mit Ihrer Bewerbung ausreichende deutsche Sprachkenntnisse nachweisen » — un cursus en anglais est possible, l'allemand reste exigé. Source : https://www.fes.de/studienfoerderung/stipendium/grundfoerderung-fuer-auslaender-innen"
  },
  {
    "collection": "programs",
    "id": "humboldt-universitat-zu-berlin-berlin__heinrich-boell-stiftung__doctorat",
    "champs": {
      "language": "Allemand (B2 exigé) / Anglais selon le cursus"
    },
    "motif": "Heinrich-Böll-Stiftung, conditions de candidature lues le 2026-09-12 : « Gute Deutschkenntnisse (DSH I oder B2) werden vorausgesetzt und müssen nachgewiesen werden » ; pour un cursus en anglais : « alle unsere Stipendiat*innen müssen über ausreichende Kenntnisse der deutschen Sprache verfügen ». Entretien de sélection en allemand. Source : https://www.boell.de/de/2024/03/04/bewerbungsvoraussetzungen"
  },
  {
    "collection": "programs",
    "id": "humboldt-universitat-zu-berlin-berlin__heinrich-boell-stiftung__master",
    "champs": {
      "language": "Allemand (B2 exigé) / Anglais selon le cursus"
    },
    "motif": "Heinrich-Böll-Stiftung, conditions de candidature lues le 2026-09-12 : « Gute Deutschkenntnisse (DSH I oder B2) werden vorausgesetzt und müssen nachgewiesen werden » ; pour un cursus en anglais : « alle unsere Stipendiat*innen müssen über ausreichende Kenntnisse der deutschen Sprache verfügen ». Entretien de sélection en allemand. Source : https://www.boell.de/de/2024/03/04/bewerbungsvoraussetzungen"
  },
  {
    "collection": "programs",
    "id": "leibniz-universitat-hannover-hannover__heinrich-boell-stiftung__doctorat",
    "champs": {
      "language": "Allemand (B2 exigé) / Anglais selon le cursus"
    },
    "motif": "Heinrich-Böll-Stiftung, conditions de candidature lues le 2026-09-12 : « Gute Deutschkenntnisse (DSH I oder B2) werden vorausgesetzt und müssen nachgewiesen werden » ; pour un cursus en anglais : « alle unsere Stipendiat*innen müssen über ausreichende Kenntnisse der deutschen Sprache verfügen ». Entretien de sélection en allemand. Source : https://www.boell.de/de/2024/03/04/bewerbungsvoraussetzungen"
  },
  {
    "collection": "programs",
    "id": "leibniz-universitat-hannover-hannover__heinrich-boell-stiftung__master",
    "champs": {
      "language": "Allemand (B2 exigé) / Anglais selon le cursus"
    },
    "motif": "Heinrich-Böll-Stiftung, conditions de candidature lues le 2026-09-12 : « Gute Deutschkenntnisse (DSH I oder B2) werden vorausgesetzt und müssen nachgewiesen werden » ; pour un cursus en anglais : « alle unsere Stipendiat*innen müssen über ausreichende Kenntnisse der deutschen Sprache verfügen ». Entretien de sélection en allemand. Source : https://www.boell.de/de/2024/03/04/bewerbungsvoraussetzungen"
  },
  {
    "collection": "programs",
    "id": "universitat-hamburg-hamburg__heinrich-boell-stiftung__doctorat",
    "champs": {
      "language": "Allemand (B2 exigé) / Anglais selon le cursus"
    },
    "motif": "Heinrich-Böll-Stiftung, conditions de candidature lues le 2026-09-12 : « Gute Deutschkenntnisse (DSH I oder B2) werden vorausgesetzt und müssen nachgewiesen werden » ; pour un cursus en anglais : « alle unsere Stipendiat*innen müssen über ausreichende Kenntnisse der deutschen Sprache verfügen ». Entretien de sélection en allemand. Source : https://www.boell.de/de/2024/03/04/bewerbungsvoraussetzungen"
  },
  {
    "collection": "programs",
    "id": "universitat-hamburg-hamburg__heinrich-boell-stiftung__master",
    "champs": {
      "language": "Allemand (B2 exigé) / Anglais selon le cursus"
    },
    "motif": "Heinrich-Böll-Stiftung, conditions de candidature lues le 2026-09-12 : « Gute Deutschkenntnisse (DSH I oder B2) werden vorausgesetzt und müssen nachgewiesen werden » ; pour un cursus en anglais : « alle unsere Stipendiat*innen müssen über ausreichende Kenntnisse der deutschen Sprache verfügen ». Entretien de sélection en allemand. Source : https://www.boell.de/de/2024/03/04/bewerbungsvoraussetzungen"
  },
  {
    "collection": "programs",
    "id": "humboldt-universitat-zu-berlin-berlin__rosa-luxemburg-stiftung__doctorat",
    "champs": {
      "language": "Allemand (B2 exigé) / Anglais selon le cursus"
    },
    "motif": "Rosa-Luxemburg-Stiftung, pièces de candidature pour étudiants internationaux, lues le 2026-09-12 : « Proof of German language skills at least at B2 level » et « Even if you complete your studies in English, proof of German language skills is required » (B1 accepté à la date limite avec inscription à un cours B2). Source : https://www.rosalux.de/stipendienbewerbung/bewerbungsunterlagen-fuer-internationale-studierende"
  },
  {
    "collection": "programs",
    "id": "humboldt-universitat-zu-berlin-berlin__rosa-luxemburg-stiftung__master",
    "champs": {
      "language": "Allemand (B2 exigé) / Anglais selon le cursus"
    },
    "motif": "Rosa-Luxemburg-Stiftung, pièces de candidature pour étudiants internationaux, lues le 2026-09-12 : « Proof of German language skills at least at B2 level » et « Even if you complete your studies in English, proof of German language skills is required » (B1 accepté à la date limite avec inscription à un cours B2). Source : https://www.rosalux.de/stipendienbewerbung/bewerbungsunterlagen-fuer-internationale-studierende"
  },
  {
    "collection": "programs",
    "id": "leibniz-universitat-hannover-hannover__rosa-luxemburg-stiftung__doctorat",
    "champs": {
      "language": "Allemand (B2 exigé) / Anglais selon le cursus"
    },
    "motif": "Rosa-Luxemburg-Stiftung, pièces de candidature pour étudiants internationaux, lues le 2026-09-12 : « Proof of German language skills at least at B2 level » et « Even if you complete your studies in English, proof of German language skills is required » (B1 accepté à la date limite avec inscription à un cours B2). Source : https://www.rosalux.de/stipendienbewerbung/bewerbungsunterlagen-fuer-internationale-studierende"
  },
  {
    "collection": "programs",
    "id": "leibniz-universitat-hannover-hannover__rosa-luxemburg-stiftung__master",
    "champs": {
      "language": "Allemand (B2 exigé) / Anglais selon le cursus"
    },
    "motif": "Rosa-Luxemburg-Stiftung, pièces de candidature pour étudiants internationaux, lues le 2026-09-12 : « Proof of German language skills at least at B2 level » et « Even if you complete your studies in English, proof of German language skills is required » (B1 accepté à la date limite avec inscription à un cours B2). Source : https://www.rosalux.de/stipendienbewerbung/bewerbungsunterlagen-fuer-internationale-studierende"
  },
  {
    "collection": "programs",
    "id": "universitat-hamburg-hamburg__rosa-luxemburg-stiftung__doctorat",
    "champs": {
      "language": "Allemand (B2 exigé) / Anglais selon le cursus"
    },
    "motif": "Rosa-Luxemburg-Stiftung, pièces de candidature pour étudiants internationaux, lues le 2026-09-12 : « Proof of German language skills at least at B2 level » et « Even if you complete your studies in English, proof of German language skills is required » (B1 accepté à la date limite avec inscription à un cours B2). Source : https://www.rosalux.de/stipendienbewerbung/bewerbungsunterlagen-fuer-internationale-studierende"
  },
  {
    "collection": "programs",
    "id": "universitat-hamburg-hamburg__rosa-luxemburg-stiftung__master",
    "champs": {
      "language": "Allemand (B2 exigé) / Anglais selon le cursus"
    },
    "motif": "Rosa-Luxemburg-Stiftung, pièces de candidature pour étudiants internationaux, lues le 2026-09-12 : « Proof of German language skills at least at B2 level » et « Even if you complete your studies in English, proof of German language skills is required » (B1 accepté à la date limite avec inscription à un cours B2). Source : https://www.rosalux.de/stipendienbewerbung/bewerbungsunterlagen-fuer-internationale-studierende"
  },
  {
    "collection": "programs",
    "id": "imperial-college-london-london__commonwealth-masters-scholarships__master",
    "champs": {
      "language": "Anglais"
    },
    "motif": "Commonwealth Scholarship Commission (CSC UK), guide de candidature lu le 2026-09-12 : études au Royaume-Uni, en anglais ; « The CSC does not require any candidates to take an IELTS (English language) test » — pas de test exigé, mais le niveau doit permettre de suivre un master en anglais. Source : https://cscuk.fcdo.gov.uk/scholarships/commonwealth-masters-scholarships/"
  },
  {
    "collection": "programs",
    "id": "imperial-college-london-london__commonwealth-phd-scholarships__doctorat",
    "champs": {
      "language": "Anglais"
    },
    "motif": "Commonwealth Scholarship Commission (CSC UK), guide de candidature lu le 2026-09-12 : études au Royaume-Uni, en anglais ; « The CSC does not require any candidates to take an IELTS (English language) test » — pas de test exigé, mais le niveau doit permettre de suivre un master en anglais. Source : https://cscuk.fcdo.gov.uk/scholarships/commonwealth-masters-scholarships/"
  },
  {
    "collection": "programs",
    "id": "imperial-college-london-london__commonwealth-shared-scholarships__master",
    "champs": {
      "language": "Anglais"
    },
    "motif": "Commonwealth Scholarship Commission (CSC UK), guide de candidature lu le 2026-09-12 : études au Royaume-Uni, en anglais ; « The CSC does not require any candidates to take an IELTS (English language) test » — pas de test exigé, mais le niveau doit permettre de suivre un master en anglais. Source : https://cscuk.fcdo.gov.uk/scholarships/commonwealth-masters-scholarships/"
  },
  {
    "collection": "programs",
    "id": "university-of-edinburgh-edinburgh__commonwealth-masters-scholarships__master",
    "champs": {
      "language": "Anglais"
    },
    "motif": "Commonwealth Scholarship Commission (CSC UK), guide de candidature lu le 2026-09-12 : études au Royaume-Uni, en anglais ; « The CSC does not require any candidates to take an IELTS (English language) test » — pas de test exigé, mais le niveau doit permettre de suivre un master en anglais. Source : https://cscuk.fcdo.gov.uk/scholarships/commonwealth-masters-scholarships/"
  },
  {
    "collection": "programs",
    "id": "university-of-edinburgh-edinburgh__commonwealth-phd-scholarships__doctorat",
    "champs": {
      "language": "Anglais"
    },
    "motif": "Commonwealth Scholarship Commission (CSC UK), guide de candidature lu le 2026-09-12 : études au Royaume-Uni, en anglais ; « The CSC does not require any candidates to take an IELTS (English language) test » — pas de test exigé, mais le niveau doit permettre de suivre un master en anglais. Source : https://cscuk.fcdo.gov.uk/scholarships/commonwealth-masters-scholarships/"
  },
  {
    "collection": "programs",
    "id": "university-of-edinburgh-edinburgh__commonwealth-shared-scholarships__master",
    "champs": {
      "language": "Anglais"
    },
    "motif": "Commonwealth Scholarship Commission (CSC UK), guide de candidature lu le 2026-09-12 : études au Royaume-Uni, en anglais ; « The CSC does not require any candidates to take an IELTS (English language) test » — pas de test exigé, mais le niveau doit permettre de suivre un master en anglais. Source : https://cscuk.fcdo.gov.uk/scholarships/commonwealth-masters-scholarships/"
  },
  {
    "collection": "programs",
    "id": "university-of-oxford-oxford__commonwealth-masters-scholarships__master",
    "champs": {
      "language": "Anglais"
    },
    "motif": "Commonwealth Scholarship Commission (CSC UK), guide de candidature lu le 2026-09-12 : études au Royaume-Uni, en anglais ; « The CSC does not require any candidates to take an IELTS (English language) test » — pas de test exigé, mais le niveau doit permettre de suivre un master en anglais. Source : https://cscuk.fcdo.gov.uk/scholarships/commonwealth-masters-scholarships/"
  },
  {
    "collection": "programs",
    "id": "university-of-oxford-oxford__commonwealth-phd-scholarships__doctorat",
    "champs": {
      "language": "Anglais"
    },
    "motif": "Commonwealth Scholarship Commission (CSC UK), guide de candidature lu le 2026-09-12 : études au Royaume-Uni, en anglais ; « The CSC does not require any candidates to take an IELTS (English language) test » — pas de test exigé, mais le niveau doit permettre de suivre un master en anglais. Source : https://cscuk.fcdo.gov.uk/scholarships/commonwealth-masters-scholarships/"
  },
  {
    "collection": "programs",
    "id": "university-of-oxford-oxford__commonwealth-shared-scholarships__master",
    "champs": {
      "language": "Anglais"
    },
    "motif": "Commonwealth Scholarship Commission (CSC UK), guide de candidature lu le 2026-09-12 : études au Royaume-Uni, en anglais ; « The CSC does not require any candidates to take an IELTS (English language) test » — pas de test exigé, mais le niveau doit permettre de suivre un master en anglais. Source : https://cscuk.fcdo.gov.uk/scholarships/commonwealth-masters-scholarships/"
  }
];
