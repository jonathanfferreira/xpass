import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
    apiKey: "AIzaSyD4tZgHwe40MlQb9hjhNwAh_AYjzjKMUa8",
    authDomain: "tranquil-door-479317-a2.firebaseapp.com",
    projectId: "tranquil-door-479317-a2",
    storageBucket: "tranquil-door-479317-a2.firebasestorage.app",
    messagingSenderId: "927065188656",
    appId: "1:927065188656:web:b936f4a262095aac5200f5"
};

// Initialize Firebase
/**
 * The initialized Firebase application instance.
 * @type {import('firebase/app').FirebaseApp}
 */
const app = initializeApp(firebaseConfig);

// Export services
/**
 * Firebase Authentication service instance.
 * @type {import('firebase/auth').Auth}
 */
export const auth = getAuth(app);

/**
 * Firestore Database service instance.
 * @type {import('firebase/firestore').Firestore}
 */
export const db = getFirestore(app);

/**
 * Firebase Cloud Functions service instance.
 * @type {import('firebase/functions').Functions}
 */
export const functions = getFunctions(app);

export default app;
