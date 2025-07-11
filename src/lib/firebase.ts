
import { initializeApp, getApps, getApp, type FirebaseApp, type FirebaseOptions } from "firebase/app";

let app: FirebaseApp | null = null;

export const checkFirebaseConfiguration = (): boolean => {
    return (
      !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
      !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
      !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    );
};

export const getFirebaseApp = (): FirebaseApp | null => {
    if (app) {
        return app;
    }

    if (!checkFirebaseConfiguration()) {
        console.error("Firebase configuration is missing or incomplete. Cannot initialize Firebase.");
        return null;
    }

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
