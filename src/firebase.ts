import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC_gGOw-AisKaWQ6-gkgB5eyH3ndX-Lp50",
  authDomain: "kittyforge-358b3.firebaseapp.com",
  projectId: "kittyforge-358b3",
  storageBucket: "kittyforge-358b3.firebasestorage.app",
  messagingSenderId: "612008553283",
  appId: "1:612008553283:web:9ce03d1aa92b3c5b1a5df6",
  measurementId: "G-HLRKRN2SXG"
};

const app = initializeApp(firebaseConfig);

// ✅ Export auth
export const auth = getAuth(app);

// ✅ Export Google Provider (THIS FIXES YOUR ERROR)
export const googleProvider = new GoogleAuthProvider();