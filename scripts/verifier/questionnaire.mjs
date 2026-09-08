/**
 * ============================================================
 * scripts/verifier/questionnaire.mjs — jouer le questionnaire
 * ============================================================
 *
 * Ce module clique VRAIMENT dans la page, question après question,
 * comme un étudiant. Il ne pré-remplit pas sessionStorage : un
 * sessionStorage écrit à la main prouverait que results.html sait lire
 * un objet, pas que le questionnaire sait le produire. Or c'est
 * exactement là qu'étaient les deux pannes du 2026-09-05.
 *
 * Le pilotage se fait par `#question[data-question]` — l'identifiant
 * de la question, pas son libellé, qui se reformule d'une piste à
 * l'autre.
 * ============================================================
 */

const MAX_ETAPES = 40;

async function elementVisible(page, selecteur) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return false;
    return el.offsetParent !== null || getComputedStyle(el).display !== "none";
  }, selecteur);
}

/**
 * Joue le questionnaire complet et rend le journal des questions
 * effectivement posées, dans l'ordre.
 */
export async function jouerQuestionnaire(page, profil) {

  const posees = [];
  let precedente = null;

  for (let etape = 0; etape < MAX_ETAPES; etape += 1) {

    // Arrivé sur les résultats : le questionnaire est fini.
    if (!page.url().includes("eligibility-questions.html")) return posees;

    await attendreQuestionOuResultats(page, precedente);

    // La dernière réponse peut avoir déclenché la navigation vers
    // results.html ENTRE le test d'URL ci-dessus et l'attente : on
    // re-teste avant de lire une question qui n'existe plus.
    if (!page.url().includes("eligibility-questions.html")) return posees;

    const id = await page.getAttribute("#question", "data-question");
    const libelle = (await page.textContent("#question"))?.trim();

    posees.push({ id, libelle });
    precedente = id;

    if (!(id in profil.reponses)) {
      throw new Error(
        `Le profil « ${profil.cle} » ne répond pas à la question « ${id} » (« ${libelle} »). ` +
        `Ajouter la réponse dans scripts/verifier/profils.mjs.`
      );
    }

    const valeur = profil.reponses[id];

    if (await elementVisible(page, "#cardsContainer")) {

      const carte = page.locator("#cardsContainer .option-card", { hasText: valeur }).first();

      // Comparaison EXACTE : « Master » est contenu dans « Master en
      // cours », un `hasText` seul choisirait la mauvaise carte.
      const exacte = page.locator("#cardsContainer .option-card").filter({
        has: page.locator(`span:text-is(${JSON.stringify(valeur)})`)
      }).first();

      const cible = (await exacte.count()) ? exacte : carte;

      if (!(await cible.count())) {
        const dispo = await page.locator("#cardsContainer .option-card span").allTextContents();
        throw new Error(
          `Question « ${id} » : aucune carte « ${valeur} ». Cartes proposées : ${dispo.join(" | ")}`
        );
      }

      // Le clic sélectionne ET avance (setTimeout 250 ms dans
      // eligibility-questions.js) : on ne clique pas « Continuer ».
      await cible.click();
      await page.waitForTimeout(400);
      continue;

    }

    if (await elementVisible(page, "#scaleSelector")) {

      const echelle = profil.reponses.averageScale;

      if (echelle) {
        const etiquettes = { "20": "/20", "100": "/100", gpa4: "GPA /4", letters: "Lettres (A-F)", other: "Autre système (%)" };
        const puce = page.locator("#scaleSelector .scale-chip", { hasText: etiquettes[echelle] || etiquettes["20"] }).first();
        if (await puce.count()) await puce.click();
      }

      if (await elementVisible(page, "#lettersContainer")) {
        await page.locator("#lettersContainer .letter-chip", { hasText: String(valeur) }).first().click();
      } else {
        await reglerCurseur(page, valeur);
      }

      await page.click("#nextButton");
      await page.waitForTimeout(250);
      continue;

    }

    if (await elementVisible(page, "#sliderContainer")) {
      await reglerCurseur(page, valeur);
      await page.click("#nextButton");
      await page.waitForTimeout(250);
      continue;
    }

    if (await elementVisible(page, "#textContainer")) {

      // On tape lettre à lettre : `fill()` pose la valeur d'un coup et
      // n'émet qu'un seul évènement `input`, ce qui ne reproduit pas
      // la liste de suggestions telle que l'étudiant la voit.
      await page.click("#answer");
      await page.fill("#answer", "");
      await page.type("#answer", String(valeur), { delay: 15 });

      // Si une suggestion correspond, on la CLIQUE — c'est ce que fait
      // un étudiant, et c'est aussi ce qui referme la liste. Sans ce
      // clic, la liste recouvre le bouton « Continuer » : le harnais
      // s'est bloqué là au premier essai, exactement comme un pouce
      // sur un téléphone.
      const suggestion = page.locator(`#suggestions .suggestion:text-is(${JSON.stringify(String(valeur))})`).first();

      if (await suggestion.count()) {
        await suggestion.click();
      } else {
        await page.keyboard.press("Escape").catch(() => {});
        await page.locator("#question").click();
      }

      await page.click("#nextButton");
      await page.waitForTimeout(250);
      continue;

    }

    throw new Error(`Question « ${id} » : aucun mode de saisie visible (ni cartes, ni curseur, ni texte).`);

  }

  throw new Error(`Le questionnaire n'a pas abouti en ${MAX_ETAPES} étapes — boucle probable.`);

}

// Après une réponse, la page fait l'une de deux choses (setTimeout
// 250 ms dans eligibility-questions.js) : afficher la question suivante,
// ou naviguer vers results.html. Deux courses guettent le harnais, toutes
// deux vues le 2026-09-08 (« lycee » à une passe, « licence-en-cours » à
// la suivante, chacun passant seul) :
//
// 1. `waitForSelector("#question[data-question]")` survit à la
//    navigation, cherche la question dans results.html, où elle n'existe
//    pas, et expire après 10 s. On attend donc la PREMIÈRE des deux
//    issues : la question suivante OU l'URL des résultats.
//
// 2. `data-question` reste posé avec l'ANCIEN identifiant jusqu'au
//    render() suivant. Si le setTimeout de la page prend du retard sous
//    charge, un simple « la question existe » est vrai immédiatement :
//    le harnais relirait la même question et recliquerait la même
//    carte, sautant une question. On attend donc que l'identifiant
//    CHANGE par rapport à la question précédente.
//
// Sans allonger les délais : les 10 s sont celles d'avant.
async function attendreQuestionOuResultats(page, precedente) {
  const question = page.waitForFunction(
    (prev) => {
      const el = document.querySelector("#question[data-question]");
      return !!el && el.dataset.question !== prev;
    },
    precedente,
    { timeout: 10000 }
  );
  const resultats = page.waitForURL(/results\.html/, { timeout: 10000 });

  // Le perdant de la course rejette plus tard, à son propre timeout :
  // on le neutralise pour ne pas lever un « unhandled rejection ».
  question.catch(() => {});
  resultats.catch(() => {});

  await Promise.race([question, resultats]);
}

// Un <input type=range> ne réagit pas à `fill()` : la valeur doit être
// posée puis l'évènement `input` émis à la main, sinon l'affichage et
// la réponse enregistrée restent sur la valeur par défaut.
async function reglerCurseur(page, valeur) {
  await page.evaluate((v) => {
    const curseur = document.getElementById("sliderInput");
    curseur.value = String(v);
    curseur.dispatchEvent(new Event("input", { bubbles: true }));
  }, valeur);
}
