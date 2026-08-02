import { auth, db } from "../firebase-config.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {

if (!user) {

window.location.href = "login.html";
return;

}

try {

const adminRef = doc(db, "admins", user.uid);

const adminSnap = await getDoc(adminRef);

if (!adminSnap.exists()) {

await auth.signOut();

window.location.href = "login.html";

return;

}

const adminData = adminSnap.data();

if (adminData.isActive !== true) {

await auth.signOut();

window.location.href = "login.html";

return;

}

console.log("Administrateur connecté :", adminData.email);

} catch (error) {

console.error(error);

window.location.href = "login.html";

}

});
