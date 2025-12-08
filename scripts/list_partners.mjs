import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

// Config from firebase.js
const firebaseConfig = {
    apiKey: "AIzaSyD4tZgHwe40MlQb9hjhNwAh_AYjzjKMUa8",
    authDomain: "tranquil-door-479317-a2.firebaseapp.com",
    projectId: "tranquil-door-479317-a2",
    storageBucket: "tranquil-door-479317-a2.firebasestorage.app",
    messagingSenderId: "927065188656",
    appId: "1:927065188656:web:b936f4a262095aac5200f5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Lists all partners with 'PENDING' status from Firestore.
 *
 * Queries the 'partners' collection and prints the ID, name, and email
 * of each partner found with status 'PENDING'.
 *
 * @returns {Promise<void>} Resolves when the list is complete.
 */
async function listPending() {
    console.log("Searching for PENDING partners...");
    try {
        const q = query(collection(db, "partners"), where("status", "==", "PENDING"));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            console.log("No pending partners found.");
        } else {
            snapshot.forEach(doc => {
                console.log(`[FOUND] ID: ${doc.id} | Name: ${doc.data().name} | Email: ${doc.data().email}`);
            });
        }
    } catch (error) {
        console.error("Error listing partners:", error);
    }
    process.exit(0);
}

listPending();
