import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

// TO DO: Replace with real env vars or config
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "xpass-partner.web.app",
    projectId: "tranquil-door-479317",
    storageBucket: "tranquil-door-479317.firebasestorage.app",
    messagingSenderId: "367303728669",
    appId: "1:367303728669:web:968840e61180436822c954"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
