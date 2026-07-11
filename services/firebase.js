// services/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD1qQGIUCcly5t-fV33gM_TBARL8LYcd28",
  authDomain: "ecotrail-app.firebaseapp.com",
  projectId: "ecotrail-app",
  storageBucket: "ecotrail-app.firebasestorage.app",
  messagingSenderId: "645590301341",
  appId: "1:645590301341:web:b4066cf8b5b99fdc2bf274",
  measurementId: "G-PDF6864YYB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };