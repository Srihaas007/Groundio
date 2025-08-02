// firebase-web-config.js - Web-specific Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRHBnbO7-Mmc3eyGZ6pXvMvTQSTf8YQ-w",
  authDomain: "groundio-79307.firebaseapp.com",
  databaseURL: "https://groundio-79307-default-rtdb.firebaseio.com",
  projectId: "groundio-79307",
  storageBucket: "groundio-79307.appspot.com",
  messagingSenderId: "220145387035",
  appId: "1:220145387035:web:70890ee940e9495c639abe",
  measurementId: "G-KDMJXN6RMB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage, app };
