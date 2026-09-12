/**
 * ============================================================
 * LOT 47 — LES DEUX CORRECTIFS DU LOT 46 (12 septembre 2026)
 * ============================================================
 *
 * POURQUOI CE LOT EXISTE, ET CE QU'IL FAUT EN RETENIR
 * ---------------------------------------------------
 * Le lot 46 a été exécuté avec une version PÉRIMÉE de son propre
 * fichier : les deux corrections validées par Charles le matin même —
 * sources à l'appui — n'y étaient pas. Le fichier corrigé avait bien
 * été écrit sur le disque, puis il a été remplacé par sa version
 * précédente avant que `ecrire` ne tourne (même incident que sur
 * index.html le matin : un éditeur ouvert sur le fichier réenregistre
 * sa copie en mémoire par-dessus). `analyser`, `ecrire` et `verifier`
 * ont donc tous trois dit « 28 conformes » — ils comparent la base au
 * FICHIER, pas au fichier que l'on croit avoir.
 *
 * Le lot 46 n'est pas réécrit : il reste le récit exact de ce qui a
 * été mis en base ce jour-là. Ce lot-ci porte la correction, et la
 * preuve que Charles a rapportée.
 *
 * `attendu` EST PRÉSENT ICI, ET C'EST LE POINT
 * --------------------------------------------
 * Contrairement au lot 46, on CONNAÎT la valeur en base : elle a été
 * lue dans assets/data/catalogue.json après l'export du 2026-09-12.
 * `attendu` garantit donc qu'on corrige bien la valeur fautive, et non
 * une valeur qui aurait changé entre-temps. Si le runner refuse, c'est
 * que la base a bougé : on relit, on ne force pas.
 * ============================================================
 */

export const PATCHES = [
  {
    "collection": "universities",
    "id": "korea-national-university-of-arts-seoul",
    "attendu": {
      "fields": ["Architecture"]
    },
    "champs": {
      "fields": ["Sciences sociales", "Lettres"]
    },
    "motif": "Correction du relevé écrit par le lot 46. Vérifié par Charles le 2026-09-12 sur https://www.karts.ac.kr/ : il n'existe AUCUNE école d'architecture indépendante à K-Arts — « Architecture » était une erreur de relevé. Dans le catalogue de l'établissement, les arts (musique, théâtre, danse, cinéma, arts visuels et arts traditionnels coréens) entrent entièrement dans la famille Lettres ; les études et la théorie des arts relèvent des Sciences sociales. Conséquence évitée : avec la seule Architecture, l'université des arts de Corée n'était proposée à AUCUN étudiant en arts."
  },
  {
    "collection": "universities",
    "id": "usiu-africa-nairobi",
    "attendu": {
      "fields": ["Sciences", "Médecine", "Sciences sociales", "Commerce", "Lettres", "Informatique"]
    },
    "champs": {
      "fields": ["Sciences", "Sciences sociales", "Commerce", "Lettres", "Informatique"]
    },
    "motif": "Correction du relevé écrit par le lot 46. Vérifié par Charles le 2026-09-12 sur https://www.usiu.ac.ke/about-us/ : l'établissement a une école de pharmacie et sciences de la santé, mais PAS de faculté de médecine au sens strict — « Médecine » est donc retirée. Restent le Commerce, les Sciences, l'Informatique, les Sciences sociales et les Lettres. Une famille en trop enverrait un étudiant candidater dans une discipline qui n'existe pas sur place : c'est la faute que la doctrine du lot 42 nomme explicitement."
  }
];
