import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase defensively
let app;
let auth;
let db;
let storage;

try {
    if (!firebaseConfig.apiKey) {
        throw new Error("Missing Firebase Configuration keys");
    }
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    console.log("Firebase initialized successfully");
} catch (error) {
    console.warn("Firebase initialization skipped (missing keys):", error);

    // Create dummy objects to prevent app crash on import
    // These specific properties are needed by AuthContext and other components
    auth = {
        currentUser: null,
        onAuthStateChanged: (cb) => { cb(null); return () => { }; },
        signInWithEmailAndPassword: () => Promise.reject("Firebase not configured"),
        createUserWithEmailAndPassword: () => Promise.reject("Firebase not configured"),
        signOut: () => Promise.resolve(),
        configMissing: true,
        initError: error.message
    };

    // Dummy DB that allows method chaining but does nothing
    db = {
        type: 'dummy',
        configMissing: true
    };

    storage = {
        configMissing: true
    };

    app = null;
}

export { auth, db, storage };
export default app;
