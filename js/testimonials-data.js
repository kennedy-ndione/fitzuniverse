/**
 * Témoignages réels d'étudiants accompagnés par FitzUniverse.
 *
 * Vide au 2026-08-13 : aucun étudiant payant à ce jour, donc aucune
 * citation réelle disponible. NE JAMAIS ajouter d'entrée inventée ici,
 * même à titre d'exemple visuel.
 *
 * PLUS AUCUN FICHIER NE L'IMPORTE depuis le 2026-09-08. Le conteneur
 * #trustTestimonials a quitté index.html avec le reste de l'aperçu du
 * catalogue, et js/homepage-teaser.js ne rend plus de témoignages. Ce
 * fichier est gardé pour la règle qu'il porte et pour la forme
 * ci-dessous, pas parce qu'il sert. Conséquence à connaître : ajouter
 * une entrée ici n'affiche plus rien — il faudra aussi remettre la
 * section et son rendu. Ce n'est plus « une seule opération ».
 *
 * Forme attendue d'une entrée réelle :
 *
 * {
 *   id: "awa-2026",          // identifiant stable, pas d'espace
 *   firstName: "Awa",        // prénom seul (vie privée — pas de nom de famille)
 *   country: "Sénégal",      // pays d'origine de l'étudiant·e
 *   university: "Sciences Po", // université visée ou obtenue
 *   status: "obtenue",       // "obtenue" | "en cours"
 *   quote: "Citation courte, telle quelle, avec l'accord explicite de l'étudiant·e."
 * }
 */
export const TESTIMONIALS = [];
