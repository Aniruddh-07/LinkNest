
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp, type FirebaseOptions } from "firebase/app";

// This function checks if the required environment variables are set.
// It's a function so it can be called at the right time, not just on module load.
export function checkFirebaseConfiguration() {
  return (
    !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
    !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  );
};

let app: FirebaseApp | null = null;

// This function initializes and returns the Firebase app instance.
// It ensures that initialization only happens once and only if the config is valid.
function getFirebaseApp() {
    if (app) {
        return app;
    }

    if (!checkFirebaseConfiguration()) {
        console.error("Firebase configuration is missing or incomplete. Please check your .env file.");
        return null;
    }

    // The config object is created here, inside the function,
    // ensuring process.env has been loaded.
    const firebaseConfig: FirebaseOptions = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };
    
    if (getApps().length > 0) {
        app = getApp();
    } else {
        app = initializeApp(firebaseConfig);
    }
    return app;
}

export { getFirebaseApp };
