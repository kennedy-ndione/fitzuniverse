/**
* ============================================================
* Tests unitaires — téléphone international
* ============================================================
*
* Lancer : npm test   (ou : node --test test/)
*
* Ces tests n'ouvrent aucun navigateur et ne touchent pas au DOM :
* ils portent sur js/phone-international.js, qui est de la décision
* pure — reconnaître un pays, normaliser une saisie, produire du
* E.164, dire pourquoi un numéro ne va pas.
*
* Ce qui est vérifié ici correspond aux erreurs qu'un étudiant fait
* RÉELLEMENT : garder le zéro initial de son numéro national, coller
* l'indicatif alors qu'il est déjà sélectionné, écrire son pays sans
* accent ou en majuscules.
* ============================================================
*/

import test from "node:test";
import assert from "node:assert/strict";

import {
PAYS_TELEPHONE,
PAYS_PAR_DEFAUT,
paysParIso,
isoDepuisNom,
chiffresNationaux,
versE164,
depuisE164,
verifier,
pourWhatsApp
} from "../js/phone-international.js";

// ==========================================================
// COHÉRENCE DE LA LISTE
// ==========================================================

test("chaque pays est complet et sans doublon", () => {

const vus = new Set();

for (const p of PAYS_TELEPHONE) {

assert.match(p.iso, /^[A-Z]{2}$/, `code ISO invalide : ${p.iso}`);
assert.ok(p.nom.length > 2, `nom trop court : ${p.iso}`);
assert.match(p.indicatif, /^\d{1,4}$/, `indicatif invalide : ${p.iso}`);
assert.ok(p.longueurs.length > 0, `aucune longueur : ${p.iso}`);
assert.ok(p.longueurs.every((n) => n >= 6 && n <= 12), `longueur aberrante : ${p.iso}`);
assert.ok(p.exemple, `aucun exemple : ${p.iso}`);

assert.ok(!vus.has(p.iso), `ISO en double : ${p.iso}`);
vus.add(p.iso);

}

});

test("l'exemple de chaque pays respecte sa propre règle de longueur", () => {

// Sinon le placeholder montre à l'étudiant un numéro que le champ
// refuserait — la pire consigne possible.
for (const p of PAYS_TELEPHONE) {

const { valide } = verifier(p.iso, p.exemple);

assert.ok(valide, `l'exemple de ${p.nom} ("${p.exemple}") est refusé par sa propre validation`);

}

});

test("le public prioritaire est bien couvert", () => {

// La liste peut grandir ; ces pays-là ne doivent jamais en sortir.
for (const iso of ["SN", "CI", "ML", "BF", "CM", "CD", "MA", "GN", "TG", "BJ", "NE", "GA"]) {
assert.ok(paysParIso(iso), `${iso} manque à la liste`);
}

assert.ok(paysParIso(PAYS_PAR_DEFAUT), "le pays par défaut n'est pas dans la liste");

});

test("les pays d'accueil les plus visés sont présents", () => {

for (const iso of ["FR", "CA", "BE", "DE", "US", "GB", "MA", "TR", "CN"]) {
assert.ok(paysParIso(iso), `${iso} manque à la liste`);
}

});

// ==========================================================
// RECONNAISSANCE DU PAYS
// ==========================================================

test("le pays est reconnu quelle que soit la façon de l'écrire", () => {

assert.equal(isoDepuisNom("Sénégal"), "SN");
assert.equal(isoDepuisNom("senegal"), "SN");
assert.equal(isoDepuisNom("SENEGAL"), "SN");
assert.equal(isoDepuisNom("  Sénégal  "), "SN");
assert.equal(isoDepuisNom("Côte d'Ivoire"), "CI");
assert.equal(isoDepuisNom("cote d ivoire"), "CI");
assert.equal(isoDepuisNom("COTE-D'IVOIRE"), "CI");

});

test("les noms usuels sont reconnus, pas seulement les noms officiels", () => {

assert.equal(isoDepuisNom("RDC"), "CD");
assert.equal(isoDepuisNom("Congo-Kinshasa"), "CD");
assert.equal(isoDepuisNom("USA"), "US");
assert.equal(isoDepuisNom("UK"), "GB");
assert.equal(isoDepuisNom("Angleterre"), "GB");
assert.equal(isoDepuisNom("Hollande"), "NL");

});

test("un pays inconnu ne renvoie rien plutôt qu'un pays au hasard", () => {

// Suggérer le mauvais indicatif est pire que n'en suggérer aucun :
// l'étudiant ne vérifie pas un champ déjà rempli.
assert.equal(isoDepuisNom(""), null);
assert.equal(isoDepuisNom("   "), null);
assert.equal(isoDepuisNom("Wakanda"), null);
assert.equal(isoDepuisNom(null), null);
assert.equal(isoDepuisNom(undefined), null);

});

test("un fragment trop court ne s'apparie à aucun pays", () => {

// « ma » ne doit pas devenir le Mali, le Maroc ou Maurice.
assert.equal(isoDepuisNom("ma"), null);
assert.equal(isoDepuisNom("co"), null);

});

// ==========================================================
// NORMALISATION
// ==========================================================

test("le zéro initial du format national est retiré", () => {

// L'erreur numéro un : recopier son numéro tel qu'il s'affiche sur
// le téléphone. « 06 12 34 56 78 » s'appelle « +33 6 12 34 56 78 ».
assert.equal(chiffresNationaux("06 12 34 56 78"), "612345678");
assert.equal(chiffresNationaux("0612345678"), "612345678");
assert.equal(chiffresNationaux("612345678"), "612345678");

});

test("le zéro initial est CONSERVÉ là où il fait partie du numéro", () => {

// Le défaut trouvé par le test « l'exemple respecte sa propre règle » :
// la règle française du zéro d'acheminement ne vaut pas partout. En
// Côte d'Ivoire (depuis 2021), au Gabon et au Congo-Brazzaville, ce
// zéro est un chiffre du numéro. Le retirer produit un E.164 amputé
// d'un chiffre : enregistré sans erreur, et injoignable.
assert.equal(chiffresNationaux("07 12 34 56 78", "CI"), "0712345678");
assert.equal(chiffresNationaux("06 12 34 56", "GA"), "06123456");
assert.equal(chiffresNationaux("06 123 4567", "CG"), "061234567");

assert.equal(versE164("CI", "07 12 34 56 78"), "+2250712345678");
assert.equal(versE164("CG", "06 123 4567"), "+242061234567");

// Et il reste retiré partout ailleurs.
assert.equal(chiffresNationaux("06 12 34 56 78", "FR"), "612345678");
assert.equal(chiffresNationaux("06 12 34 56 78", "MA"), "612345678");

});

test("un zéro conservé n'autorise pas pour autant les zéros en rafale", () => {

// « 0006... » reste une faute de frappe, y compris en Côte d'Ivoire.
assert.equal(chiffresNationaux("0007 12 34 56 78", "CI"), "0712345678");

});

test("un aller-retour E.164 rend exactement le numéro saisi", () => {

// C'est ce que voit l'étudiant qui rouvre son profil : si l'aller-
// retour perd un chiffre, il ne le remarquera pas.
for (const [iso, saisie] of [
["SN", "77 123 45 67"], ["CI", "07 12 34 56 78"], ["FR", "06 12 34 56 78"],
["GA", "06 12 34 56"], ["CG", "06 123 4567"], ["CA", "(514) 555-0123"],
["MA", "06 12 34 56 78"], ["CM", "6 71 23 45 67"]
]) {

const e164 = versE164(iso, saisie);
const relu = depuisE164(e164);

assert.equal(relu.iso, iso, `pays perdu pour ${iso}`);
assert.equal(versE164(relu.iso, relu.national), e164, `aller-retour instable pour ${iso}`);
assert.equal(verifier(relu.iso, relu.national).valide, true, `numéro relu invalide pour ${iso}`);

}

});

test("espaces, tirets, points et parenthèses sont ignorés", () => {

assert.equal(chiffresNationaux("77 123 45 67"), "771234567");
assert.equal(chiffresNationaux("77-123-45-67"), "771234567");
assert.equal(chiffresNationaux("77.123.45.67"), "771234567");
assert.equal(chiffresNationaux("(514) 555-0123"), "5145550123");

});

test("une saisie vide ou absurde ne fait pas planter la normalisation", () => {

assert.equal(chiffresNationaux(""), "");
assert.equal(chiffresNationaux(null), "");
assert.equal(chiffresNationaux(undefined), "");
assert.equal(chiffresNationaux("aucun"), "");
assert.equal(chiffresNationaux("0000"), "");

});

// ==========================================================
// E.164
// ==========================================================

test("le E.164 produit est celui qu'un opérateur accepte", () => {

assert.equal(versE164("SN", "77 123 45 67"), "+221771234567");
assert.equal(versE164("FR", "06 12 34 56 78"), "+33612345678");
assert.equal(versE164("CI", "07 12 34 56 78"), "+2250712345678");
assert.equal(versE164("CA", "(514) 555-0123"), "+15145550123");

});

test("un champ vide donne une valeur vide, jamais un indicatif seul", () => {

// Enregistrer « +221 » ferait croire à un numéro renseigné.
assert.equal(versE164("SN", ""), "");
assert.equal(versE164("SN", "   "), "");
assert.equal(versE164("", "771234567"), "");

});

test("un E.164 enregistré se relit correctement", () => {

assert.deepEqual(depuisE164("+221771234567"), { iso: "SN", national: "771234567" });
assert.deepEqual(depuisE164("+33612345678"), { iso: "FR", national: "612345678" });

});

test("l'indicatif le plus long gagne — sinon +221 serait lu comme +2", () => {

// Le Sénégal (221) commence par les mêmes chiffres que d'autres
// plans : une lecture naïve de gauche à droite se tromperait.
assert.equal(depuisE164("+221771234567").iso, "SN");
assert.equal(depuisE164("+237671234567").iso, "CM");
assert.equal(depuisE164("+212612345678").iso, "MA");

});

test("un numéro enregistré avant le champ international n'est pas perdu", () => {

// Ces valeurs existent déjà dans Firestore : elles n'ont ni « + »
// ni indicatif. Elles doivent revenir dans le champ national, à
// l'étudiant de confirmer son pays.
assert.deepEqual(depuisE164("77 123 45 67"), { iso: "", national: "771234567" });
assert.deepEqual(depuisE164("0612345678"), { iso: "", national: "612345678" });
assert.deepEqual(depuisE164(""), { iso: "", national: "" });

});

// ==========================================================
// VALIDATION
// ==========================================================

test("un champ vide est valide — le téléphone n'est pas obligatoire", () => {

assert.equal(verifier("SN", "").valide, true);
assert.equal(verifier("SN", "   ").valide, true);

});

test("un numéro de la bonne longueur passe", () => {

assert.equal(verifier("SN", "771234567").valide, true);
assert.equal(verifier("FR", "0612345678").valide, true);
assert.equal(verifier("CA", "5145550123").valide, true);

});

test("un chiffre manquant est signalé avec le compte attendu", () => {

const r = verifier("SN", "7712345");

assert.equal(r.valide, false);
assert.match(r.message, /9 chiffres/);
assert.match(r.message, /7/);

});

test("l'indicatif recopié à tort a son propre message", () => {

// Cas très fréquent : l'étudiant tape « 221771234567 » alors que
// le sélecteur porte déjà +221. Lui répondre « ce numéro fait 12
// chiffres au lieu de 9 » ne lui dit pas quoi enlever.
const r = verifier("SN", "221 77 123 45 67");

assert.equal(r.valide, false);
assert.match(r.message, /sans le \+221/);

});

test("un pays admettant plusieurs longueurs les accepte toutes", () => {

const benin = paysParIso("BJ");

assert.ok(benin.longueurs.length > 1, "le Bénin doit admettre plusieurs longueurs");

for (const n of benin.longueurs) {
assert.equal(verifier("BJ", "9".repeat(n)).valide, true, `${n} chiffres refusés au Bénin`);
}

});

test("sans pays sélectionné, le message le dit au lieu d'accuser le numéro", () => {

const r = verifier("", "771234567");

assert.equal(r.valide, false);
assert.match(r.message, /pays/i);

});

test("aucun message de validation ne contient de jargon technique", () => {

for (const saisie of ["7712345", "221771234567", "1"]) {

const r = verifier("SN", saisie);

if (r.valide) continue;

assert.ok(!/E\.?164|ISO|regex|null|undefined/i.test(r.message),
`message technique : ${r.message}`);

}

});

// ==========================================================
// WHATSAPP
// ==========================================================

test("le numéro WhatsApp est prêt pour un lien wa.me", () => {

// wa.me veut les chiffres seuls, sans « + » ni espace.
assert.equal(pourWhatsApp("SN", "77 123 45 67"), "221771234567");
assert.equal(pourWhatsApp("FR", "06 12 34 56 78"), "33612345678");
assert.equal(pourWhatsApp("SN", ""), "");

});
