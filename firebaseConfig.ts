// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// En tu firebaseConfig.ts
import { initializeFirestore, persistentLocalCache } from "firebase/firestore";



// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDYLZLEaMjJQeZvRpGbBtLHOaa_WRiKyC4",
    authDomain: "auth-b767e.firebaseapp.com",
    projectId: "auth-b767e",
    storageBucket: "auth-b767e.firebasestorage.app",
    messagingSenderId: "487541695940",
    appId: "1:487541695940:web:3f92ff0c0c43b36eb37091"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = initializeFirestore(app, {
    localCache: persistentLocalCache(),
    experimentalForceLongPolling: true // Necesario para React Native
});