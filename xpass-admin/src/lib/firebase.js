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
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);

export default app;
