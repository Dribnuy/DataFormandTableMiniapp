// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Assuming you'll use Firestore
import { getAuth } from "firebase/auth"; // Assuming you'll use Authentication

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_h453XuDdcsgId2z5MCofkhd-3MKWaUY",
  authDomain: "reactformandtablespa.firebaseapp.com",
  projectId: "reactformandtablespa",
  storageBucket: "reactformandtablespa.firebasestorage.app",
  messagingSenderId: "607895908071",
  appId: "1:607895908071:web:3d320e96caa02d7754bc42",
  measurementId: "G-7GHJ8WKRYR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services you'll use
export const analytics = getAnalytics(app);
export const db = getFirestore(app); // For Cloud Firestore
export const auth = getAuth(app); // For Firebase Authentication

export default app; // Export the initialized app instance
