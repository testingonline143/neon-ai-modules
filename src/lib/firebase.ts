import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDknAXqgLOWPtwFfGEb4-75a3mjaVxXRlI",
  authDomain: "aicourse-de82b.firebaseapp.com",
  projectId: "aicourse-de82b",
  storageBucket: "aicourse-de82b.firebasestorage.app",
  messagingSenderId: "509504005289",
  appId: "1:509504005289:web:d2cb1e7bea11c3b88775b8",
  measurementId: "G-9GDBW9MME8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;