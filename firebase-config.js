// Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

// Authentication
import { getAuth } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

// Firestore
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

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
