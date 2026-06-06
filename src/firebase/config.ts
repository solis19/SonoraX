import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Crea .env.local con estos valores:
// VITE_FIREBASE_API_KEY=tu_api_key
// VITE_FIREBASE_AUTH_DOMAIN=sonorax-5165e.firebaseapp.com
// VITE_FIREBASE_PROJECT_ID=sonorax-5165e
// VITE_FIREBASE_STORAGE_BUCKET=sonorax-5165e.firebasestorage.app
// VITE_FIREBASE_MESSAGING_SENDER_ID=542554450747
// VITE_FIREBASE_APP_ID=1:542554450747:web:ba6b8e8011742a4474a51e

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
