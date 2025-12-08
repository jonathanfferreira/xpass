import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, updateDoc, doc, serverTimestamp } from 'firebase/firestore';

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

async function approvePartner() {
    console.log("Searching for 'Alceu'...");
    try {
        // Find Alceu
        const q = query(collection(db, "partners"), where("email", "==", "alceu@xpacecompany.com"));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            console.log("Partner 'Alceu' not found.");
            process.exit(1);
        }

        const partnerDoc = snapshot.docs[0];
        console.log(`Found Alceu (ID: ${partnerDoc.id}). Current Status: ${partnerDoc.data().status}`);

        // Update to ACTIVE
        await updateDoc(doc(db, "partners", partnerDoc.id), {
            status: 'ACTIVE',
            approvedAt: serverTimestamp(),
            approvedBy: 'SYSTEM_ADMIN_SCRIPT'
        });

        console.log("SUCCESS: Alceu is now ACTIVE.");

    } catch (error) {
        console.error("Error approving partner:", error);
    }
    process.exit(0);
}

approvePartner();
