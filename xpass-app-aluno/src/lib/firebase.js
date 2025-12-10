import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "xpass-student.web.app",
    projectId: "tranquil-door-479317",
    storageBucket: "tranquil-door-479317.firebasestorage.app",
    messagingSenderId: "367303728669",
    appId: "1:367303728669:web:STUDENT_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
