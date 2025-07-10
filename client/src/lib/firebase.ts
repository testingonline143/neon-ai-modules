import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDknAXqgLOWPtwFfGEb4-75a3mjaVxXRlI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "aicourse-de82b.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "aicourse-de82b",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "aicourse-de82b.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "509504005289",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:509504005289:web:d2cb1e7bea11c3b88775b8",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-9GDBW9MME8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;