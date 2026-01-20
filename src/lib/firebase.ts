// Import the functions you need from the SDKs you need
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth, onAuthStateChanged, User } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCgl7sKLYqZYKYF1AK-Pl5ArnqdT8Gp738",
  authDomain: "adfelt.firebaseapp.com",
  projectId: "adfelt",
  storageBucket: "adfelt.firebasestorage.app",
  messagingSenderId: "519443601698",
  appId: "1:519443601698:web:7934fc708855f26dc9ed7b",
  measurementId: "G-Q8MK09RDV5"
};

// Initialize Firebase
let app: FirebaseApp;
let analytics: Analytics | null = null;
let db: Firestore;
let auth: Auth;

if (typeof window !== "undefined") {
  // Only initialize if not already initialized
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    analytics = getAnalytics(app);
  } else {
    app = getApps()[0];
    analytics = getAnalytics(app);
  }
  db = getFirestore(app);
  auth = getAuth(app);
} else {
  // Server-side initialization
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  db = getFirestore(app);
  auth = getAuth(app);
}

export { app, analytics, db, auth };
