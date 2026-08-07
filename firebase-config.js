// Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

// Authentication
import { getAuth, connectAuthEmulator } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

// Firestore
import { getFirestore, connectFirestoreEmulator } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Storage (pour les documents plus tard)
import { getStorage } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-storage.js";

const firebaseConfig = {
apiKey: "AIzaSyCzPnF_Vd3sKD5ShwnBTi1V_pvtErUfFyM",
authDomain: "scholarbridge-e0d84.firebaseapp.com",
projectId: "scholarbridge-e0d84",
storageBucket: "scholarbridge-e0d84.firebasestorage.app",
messagingSenderId: "226568659919",
appId: "1:226568659919:web:f390e4da7346b2f556e8ba"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);

// Services Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Émulateurs locaux (test uniquement — voir TESTING.md) — double
// verrou volontairement redondant : hostname localhost ET paramètre
// explicite ?useEmulator=1, pour qu'aucune combinaison d'URL ne
// puisse jamais faire pointer un vrai utilisateur en production vers
// ces émulateurs. Le domaine réel du site ne correspond jamais à
// location.hostname === "localhost", donc cette branche est
// structurellement inatteignable en production, quel que soit ce que
// contient la query string.
if (location.hostname === "localhost" && new URLSearchParams(location.search).get("useEmulator") === "1") {
connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
connectFirestoreEmulator(db, "localhost", 8080);
console.warn("[ScholarBridge] Connecté aux émulateurs Firebase locaux (Auth :9099, Firestore :8080) — voir TESTING.md.");
}
