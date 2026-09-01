/**
 * Témoignages réels d'étudiants accompagnés par FitzUniverse.
 *
 * Vide au 2026-08-13 : aucun étudiant payant à ce jour, donc aucune
 * citation réelle disponible. NE JAMAIS ajouter d'entrée inventée ici,
 * même à titre d'exemple visuel — la section confiance de la home
 * (index.html #trustTestimonials, rendue par
 * js/homepage-teaser.js/renderTestimonials) est conçue pour rester
 * masquée tant que ce tableau est vide, et pour afficher uniquement de
 * vraies entrées dès qu'il ne l'est plus.
 *
 * Forme attendue d'une entrée réelle, à ajouter ici le jour venu (une
 * seule opération, aucun autre fichier à toucher) :
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
