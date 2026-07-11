// services/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';

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

// Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Firestore Database
const db = getFirestore(app);

// Storage
const storage = getStorage(app);

export { auth, db, storage };