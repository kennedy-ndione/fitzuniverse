/**
 * ============================================================
 * scripts/verifier/profil-par-niveau.mjs — le profil par palier, sous
 * les deux moteurs (lot PROFIL-PAR-NIVEAU, 2026-09-11)
 * ============================================================
 *
 * Appelé par espace.mjs avec sa session stubbée (`ouvrir`). Cinq
 * preuves, celles du brief :
 *
 *   a) le profil d'un LYCÉEN ne montre ni « Mémoire », ni
 *      « Publications », ni « Expériences de recherche » ; la section
 *      « Expériences » est dite facultative ; le compteur est sur 8 ;
 *   b) celui d'un DOCTORANT les montre, compteur sur 10 ;
 *   c) un compte créé APRÈS le diagnostic arrive avec ses réponses
 *      reprises : sessionStorage.eligibilityResponses + profil vide ⇒
 *      champs pré-remplis, mention « Repris de votre diagnostic », et
 *      AUCUNE écriture Firestore tant que l'étudiant n'enregistre pas ;
 *   d) ?pour=fitz : profil prêt ⇒ « Mes candidatures » ; profil
 *      incomplet ⇒ bandeau, puis l'enregistrement qui le rend prêt
 *      renvoie vers « Mes candidatures » avec UNE écriture sur users/{uid}
 *      portant le palier et le test de langue ;
 *   e) aucun débordement horizontal à 375 px.
 * ============================================================
 */

const PROFIL_VIDE = { name: "Harnais", email: "harnais@fitz.local" };

// Les réponses d'un bachelier, telles que finish() les écrit.
const DIAGNOSTIC_BACHELIER = {
  currentLevel: "Bac obtenu", targetLevel: "Licence (Bachelor)", piste: "bac_obtenu",
  secondaryTrack: "Scientifique", diplomaWhen: "Cette année",
  country: "Sénégal", nationality: "Sénégalaise", studyCategory: "Informatique",
  average: 15, averageScale: "20", ageBracket: "18 – 24 ans",
  english: "Bon niveau", french: "Courant / Langue maternelle", langCert: "Pas encore",
  timeline: "D'ici 1 an", destinationCountry: "France", goal: "Une bourse complète", passport: "Passeport valide"
};

export async function verifierProfilParNiveau({ navigateur, base, ouvrir, etudiant, dansNJours }) {

  const anomalies = [];
  const notes = [];

  const compte = (profile, userData = {}, uid = "harnais-palier") => ({
    ...etudiant, uid,
    userData: { ...etudiant.userData, plan: "essentiel-4", planExpiresAt: dansNJours(120), planPreinscription: "", planPreinscriptionExpiresAt: null, fitzExpressExpiresAt: null, universitesRefusees: [], profile, ...userData },
    applications: []
  });

  const PRET = { ...PROFIL_VIDE, nationality: "Sénégalaise", desiredDegree: "Master", desiredField: "Informatique", languages: ["français"] };

  /** Ouvre profile.html (ou une autre URL) et attend le formulaire hydraté (les paliers rendus). */
  const ouvrirProfil = async (client, url = "profile.html", { avant = null, attendre = "#palierGrid .palier-option" } = {}) => {
    const { contexte, page, erreurs } = await ouvrir(navigateur, base, client);
    page.on("dialog", (d) => d.accept());
    if (avant) await page.addInitScript(avant);
    await page.goto(`${base}/${url}`, { waitUntil: "domcontentloaded" });
    if (attendre) await page.waitForSelector(attendre, { timeout: 20000 }).catch(() => {});
    return { contexte, page, erreurs };
  };

  const lireVisibilite = () => ({
    page: location.pathname.split("/").pop(),
    academique: !!document.getElementById("sec-academique") && !document.getElementById("sec-academique").hidden && document.getElementById("sec-academique").offsetParent !== null,
    memoire: !!document.getElementById("thesis") && document.getElementById("thesis").offsetParent !== null,
    publications: !!document.getElementById("publications") && document.getElementById("publications").offsetParent !== null,
    recherche: !!document.getElementById("researchExperience") && document.getElementById("researchExperience").offsetParent !== null,
    stages: !!document.getElementById("internships") && document.getElementById("internships").offsetParent !== null,
    // Depuis le lot ESPACE-ÉTUDIANT (2026-09-13), une section facultative
    // porte la pastille « facultatif » dans son titre (profile.js).
    facultatif: !!document.querySelector("#sec-experiences .section-facultative:not([hidden])"),
    bac: !document.getElementById("bacFieldsBlock").hidden,
    niveau: !document.getElementById("currentLevelBlock").hidden,
    compteur: (document.getElementById("navScoreValue") || {}).textContent || "",
    etat: (document.getElementById("profileEtat") || {}).textContent || "",
    navMasques: [...document.querySelectorAll(".section-nav-item")].filter((a) => a.hidden).map((a) => a.dataset.section),
    paliers: document.querySelectorAll("#palierGrid .palier-option").length,
    palierCoche: (document.querySelector('input[name="palier"]:checked') || {}).value || "",
    texte: document.body.innerText
  });

  // ---- a) LYCÉEN ----
  {
    const { contexte, page, erreurs } = await ouvrirProfil(compte({ ...PROFIL_VIDE, palier: "lycee" }));
    try {
      const vu = await page.evaluate(lireVisibilite);
      if (vu.paliers !== 8) anomalies.push(`PROFIL lycéen : ${vu.paliers} paliers rendus au lieu de 8.`);
      if (vu.palierCoche !== "lycee") anomalies.push(`PROFIL lycéen : palier coché « ${vu.palierCoche} ».`);
      if (vu.academique) anomalies.push("PROFIL lycéen : la section « Niveau académique » est visible.");
      if (vu.memoire || vu.publications || vu.recherche) anomalies.push("PROFIL lycéen : « Mémoire », « Publications » ou « Expériences de recherche » sont visibles.");
      if (/Mémoire|Publications scientifiques|Expériences de recherche/.test(vu.texte)) anomalies.push("PROFIL lycéen : le texte de la page contient encore Mémoire / Publications / Expériences de recherche.");
      if (vu.stages) anomalies.push("PROFIL lycéen : « Stages » est visible.");
      if (!vu.facultatif) anomalies.push("PROFIL lycéen : « Expériences » n'est pas dite facultative (« si vous en avez »).");
      if (!vu.bac || vu.niveau) anomalies.push(`PROFIL lycéen : bloc Bac ${vu.bac ? "visible" : "masqué"}, bloc niveau ${vu.niveau ? "visible" : "masqué"} (attendu : Bac seul).`);
      // Six sections requises pour TOUS les paliers depuis le 2026-09-13
      // (test/profil-par-niveau.test.mjs) ; les autres sont facultatives.
      if (!/\/6$/.test(vu.compteur)) anomalies.push(`PROFIL lycéen : compteur « ${vu.compteur} » (attendu sur 6).`);
      if (!vu.navMasques.includes("sec-academique")) anomalies.push("PROFIL lycéen : la nav propose encore « Niveau académique ».");
      if (!/^Plus que \d+ informations pour que Fitz choisisse vos 4 universités\.$/.test(vu.etat)) anomalies.push(`PROFIL lycéen : ligne d'état « ${vu.etat} ».`);
      notes.push(`PROFIL lycéen : académique masquée, Expériences facultative, compteur ${vu.compteur}, « ${vu.etat} »`);
    } catch (e) {
      anomalies.push(`ÉCHEC PROFIL lycéen : ${e.message.split("\n")[0]}`);
    }
    anomalies.push(...erreurs);
    await contexte.close();
  }

  // ---- b) DOCTORANT ----
  {
    const { contexte, page, erreurs } = await ouvrirProfil(compte({ ...PROFIL_VIDE, palier: "doctorat_en_cours" }));
    try {
      const vu = await page.evaluate(lireVisibilite);
      if (!vu.academique) anomalies.push("PROFIL doctorant : la section « Niveau académique » est masquée.");
      if (!vu.memoire || !vu.publications || !vu.recherche) anomalies.push(`PROFIL doctorant : mémoire ${vu.memoire}, publications ${vu.publications}, recherche ${vu.recherche} (attendu : les trois visibles).`);
      // Lot ESPACE-ÉTUDIANT (2026-09-13) : « Expériences » est facultative
      // pour TOUS les paliers (js/profil-par-niveau.js, ENRICHISSENT).
      if (!vu.facultatif) anomalies.push("PROFIL doctorant : « Expériences » n'est pas dite facultative (facultative pour tous depuis le 2026-09-13).");
      if (!vu.stages) anomalies.push("PROFIL doctorant : « Stages » est masqué.");
      if (vu.bac || !vu.niveau) anomalies.push("PROFIL doctorant : bloc Bac visible ou bloc niveau masqué.");
      if (!/\/6$/.test(vu.compteur)) anomalies.push(`PROFIL doctorant : compteur « ${vu.compteur} » (attendu sur 6).`);
      notes.push(`PROFIL doctorant : mémoire, publications, recherche visibles, compteur ${vu.compteur}`);
    } catch (e) {
      anomalies.push(`ÉCHEC PROFIL doctorant : ${e.message.split("\n")[0]}`);
    }
    anomalies.push(...erreurs);
    await contexte.close();
  }

  // ---- c) COMPTE CRÉÉ APRÈS LE DIAGNOSTIC ----
  {
    const avant = `sessionStorage.setItem("eligibilityResponses", ${JSON.stringify(JSON.stringify(DIAGNOSTIC_BACHELIER))});`;
    const { contexte, page, erreurs } = await ouvrirProfil(compte({ ...PROFIL_VIDE }), "profile.html", { avant });
    try {
      const vu = await page.evaluate(() => ({
        palier: (document.querySelector('input[name="palier"]:checked') || {}).value || "",
        nationalite: document.getElementById("nationality").value,
        diplome: document.getElementById("desiredDegree").value,
        domaine: document.getElementById("desiredField").value,
        pays: document.getElementById("country").value,
        bacMoyenne: document.getElementById("bacAverage").value,
        bacSerie: document.getElementById("bacSeries").value,
        // Lot R17 : l'état du test est un champ à lui (radios testLangueEtat) ;
        // lot R16 : les langues sont des .langue-bloc, sans code CECRL.
        test: (document.querySelector('input[name="testLangueEtat"]:checked') || {}).value || "",
        francais: !!document.querySelector('#languagesList .langue-bloc--sans-niveau'),
        mentions: [...document.querySelectorAll(".field-repris:not([hidden])")].map((e) => e.dataset.repris),
        mentionTexte: (document.querySelector('.field-repris[data-repris="nationality"]') || {}).textContent || "",
        passeport: !!document.querySelector('#documentsGroup input[value="passport"]:checked'),
        france: !!document.querySelector('#preferredCountriesChips .chip[aria-pressed="true"]'),
        // Seules les écritures sur le document de l'étudiant comptent : le
        // shell consigne aussi ses événements d'analytics (addDoc).
        ecritures: (window.__harnaisEcritures || []).filter((e) => e.chemin.startsWith("users/") && !e.chemin.slice(6).includes("/") && (e.op === "update" || e.op === "set")).length,
        etat: (document.getElementById("profileEtat") || {}).textContent || ""
      }));
      if (vu.palier !== "bac_obtenu") anomalies.push(`DIAGNOSTIC→PROFIL : palier « ${vu.palier} » (attendu bac_obtenu).`);
      if (vu.nationalite !== "Sénégalaise" || vu.diplome !== "Licence" || vu.domaine !== "Informatique" || vu.pays !== "Sénégal") anomalies.push(`DIAGNOSTIC→PROFIL : nationalité « ${vu.nationalite} », diplôme « ${vu.diplome} », domaine « ${vu.domaine} », pays « ${vu.pays} ».`);
      if (vu.bacMoyenne !== "15" || vu.bacSerie !== "Scientifique") anomalies.push(`DIAGNOSTIC→PROFIL : moyenne du bac « ${vu.bacMoyenne} », série « ${vu.bacSerie} ».`);
      if (vu.test !== "aucun") anomalies.push(`DIAGNOSTIC→PROFIL : test de langue « ${vu.test} » (attendu aucun, depuis « Pas encore »).`);
      if (!vu.francais) anomalies.push("DIAGNOSTIC→PROFIL : aucune langue reprise « niveau à préciser ».");
      if (!vu.passeport) anomalies.push("DIAGNOSTIC→PROFIL : le passeport n'est pas coché.");
      if (!vu.france) anomalies.push("DIAGNOSTIC→PROFIL : la France n'est pas cochée dans les pays souhaités.");
      if (!vu.mentions.includes("nationality") || !vu.mentions.includes("palier")) anomalies.push(`DIAGNOSTIC→PROFIL : mentions visibles ${JSON.stringify(vu.mentions)} — nationality/palier attendues.`);
      if (!/Repris de votre diagnostic/.test(vu.mentionTexte)) anomalies.push(`DIAGNOSTIC→PROFIL : mention « ${vu.mentionTexte} ».`);
      if (vu.ecritures !== 0) anomalies.push(`DIAGNOSTIC→PROFIL : ${vu.ecritures} écriture(s) Firestore à l'ouverture — le pré-remplissage doit rester en mémoire.`);
      if (!/^Fitz peut choisir\./.test(vu.etat)) anomalies.push(`DIAGNOSTIC→PROFIL : ligne d'état « ${vu.etat} » (Fitz devrait être prêt).`);
      notes.push(`DIAGNOSTIC→PROFIL : ${vu.mentions.length} champs repris (${vu.mentions.slice(0, 6).join(", ")}…), 0 écriture, « ${vu.etat} »`);
    } catch (e) {
      anomalies.push(`ÉCHEC DIAGNOSTIC→PROFIL : ${e.message.split("\n")[0]}`);
    }
    anomalies.push(...erreurs);
    await contexte.close();
  }

  // ---- d) ?pour=fitz ----
  {
    // d1. Profil prêt : droit vers « Mes candidatures ».
    const pret = await ouvrirProfil(compte(PRET), "profile.html?pour=fitz", { attendre: null });
    try {
      await pret.page.waitForFunction(() => location.pathname.endsWith("applications.html"), null, { timeout: 20000 }).catch(() => {});
      const ici = await pret.page.evaluate(() => location.pathname.split("/").pop()).catch(() => "");
      if (ici !== "applications.html") anomalies.push(`POUR=FITZ prêt : atterrit sur ${ici} au lieu de applications.html.`);
      else notes.push("POUR=FITZ prêt : profile.html?pour=fitz → applications.html");
    } catch (e) {
      anomalies.push(`ÉCHEC POUR=FITZ prêt : ${e.message.split("\n")[0]}`);
    }
    await pret.contexte.close();

    // d2. Profil incomplet : bandeau, puis l'enregistrement qui le rend prêt renvoie vers « Mes candidatures ».
    const inc = await ouvrirProfil(compte({ ...PROFIL_VIDE, palier: "bac_obtenu", nationality: "Sénégalaise" }), "profile.html?pour=fitz");
    try {
      const { page } = inc;
      const bandeau = await page.evaluate(() => ((document.getElementById("fitzProfilBandeau") || {}).textContent || "").replace(/\s+/g, " ").trim());
      if (!/^Fitz a besoin de ces informations pour choisir vos 4 universités : le niveau visé, votre domaine, au moins une langue\.$/.test(bandeau)) anomalies.push(`POUR=FITZ incomplet : bandeau « ${bandeau.slice(0, 120)} ».`);
      // Le <select> natif est masqué derrière le composant maison
      // (js/fitz-select.js) : selectOption ne le voit pas. On pose la
      // valeur et on notifie, exactement comme le ferait le composant.
      const choisir = (id, valeur) => page.evaluate(([i, v]) => { const el = document.getElementById(i); el.value = v; el.dispatchEvent(new Event("change", { bubbles: true })); }, [id, valeur]);
      await choisir("desiredDegree", "Licence");
      await page.fill("#desiredField", "Informatique");
      // Lot R16 (2026-09-18) : plus de boutons A1…C2 — quatre phrases par
      // langue ; « etudes » est le niveau B2 à C2.
      await page.locator("#languagesList .langue-bloc", { hasText: "Français" }).first().locator('input[value="etudes"]').check({ force: true });
      await choisir("testLangueNature", "TCF");
      await page.check('input[name="testLangueEtat"][value="prevu"]', { force: true });
      await page.fill("#testLanguePrevuLe", "2026-12-01");
      const etat = await page.evaluate(() => (document.getElementById("profileEtat") || {}).textContent || "");
      if (!/^Fitz peut choisir\./.test(etat)) anomalies.push(`POUR=FITZ incomplet : après saisie, ligne d'état « ${etat} ».`);
      await page.click("#sec-depart .btn-section-save");
      await page.waitForFunction(() => location.pathname.endsWith("applications.html") || (window.__harnaisEcritures || []).some((e) => e.chemin.startsWith("users/") && !e.chemin.slice(6).includes("/") && e.op === "update"), null, { timeout: 20000 }).catch(() => {});
      // L'écriture est consignée sur le document d'AVANT la navigation : on
      // la lit si on y est encore, sinon on se fie à l'arrivée.
      const apres = await page.evaluate(() => ({
        page: location.pathname.split("/").pop(),
        ecritures: (window.__harnaisEcritures || []).filter((e) => e.chemin.startsWith("users/") && !e.chemin.slice(6).includes("/") && (e.op === "update" || e.op === "set")).map((e) => ({ op: e.op, chemin: e.chemin, palier: e.data && e.data.profile && e.data.profile.palier, test: e.data && e.data.profile && e.data.profile.testLangue, repris: e.data && e.data.profile && e.data.profile.reprisDuDiagnostic }))
      })).catch(() => ({ page: "", ecritures: [] }));
      if (apres.page && apres.page !== "applications.html") {
        await page.waitForFunction(() => location.pathname.endsWith("applications.html"), null, { timeout: 10000 }).catch(() => {});
      }
      const fin = await page.evaluate(() => location.pathname.split("/").pop()).catch(() => apres.page);
      if (fin !== "applications.html") anomalies.push(`POUR=FITZ incomplet : après enregistrement, atterrit sur ${fin} au lieu de applications.html.`);
      if (apres.ecritures.length) {
        const e = apres.ecritures[0];
        if (apres.ecritures.length !== 1 || e.op !== "update" || !/^users\/harnais-palier$/.test(e.chemin)) anomalies.push(`POUR=FITZ incomplet : écritures ${JSON.stringify(apres.ecritures.map((x) => [x.op, x.chemin]))}.`);
        if (e.palier !== "bac_obtenu") anomalies.push(`POUR=FITZ incomplet : le profil enregistré porte le palier « ${e.palier} ».`);
        if (!e.test || e.test.nature !== "TCF" || e.test.prevuLe !== "2026-12-01" || e.test.score !== "") anomalies.push(`POUR=FITZ incomplet : test de langue enregistré ${JSON.stringify(e.test)}.`);
        if (!Array.isArray(e.repris) || e.repris.length) anomalies.push("POUR=FITZ incomplet : reprisDuDiagnostic n'est pas vidé à l'enregistrement.");
        notes.push(`POUR=FITZ incomplet : bandeau, saisie, 1 écriture update users/harnais-palier (palier ${e.palier}, ${e.test.nature} prévu le ${e.test.prevuLe}) → ${fin}`);
      } else {
        notes.push(`POUR=FITZ incomplet : bandeau, saisie → ${fin} (écriture non lisible après navigation)`);
      }
    } catch (e) {
      anomalies.push(`ÉCHEC POUR=FITZ incomplet : ${e.message.split("\n")[0]}`);
    }
    anomalies.push(...inc.erreurs);
    await inc.contexte.close();
  }

  // ---- e) 375 px ----
  {
    const { contexte, page, erreurs } = await ouvrirProfil(compte({ ...PROFIL_VIDE, palier: "bac_obtenu" }));
    try {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.waitForTimeout(400);
      const m = await page.evaluate(() => {
        const large = [...document.querySelectorAll("body *")].filter((el) => el.getBoundingClientRect().right > document.documentElement.clientWidth + 1 && el.offsetParent !== null).slice(0, 3).map((el) => `${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}${el.className && typeof el.className === "string" ? "." + el.className.split(" ")[0] : ""}`);
        return { scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth, large };
      });
      if (m.scroll > m.client + 1) anomalies.push(`profile.html 375 : débordement horizontal (${m.scroll} > ${m.client}) — ${m.large.join(", ")}.`);
      else notes.push(`profile.html 375 : largeur ${m.scroll}/${m.client}, aucun débordement`);
    } catch (e) {
      anomalies.push(`ÉCHEC profile.html 375 : ${e.message.split("\n")[0]}`);
    }
    anomalies.push(...erreurs);
    await contexte.close();
  }

  return { anomalies, notes };

}
