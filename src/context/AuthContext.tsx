
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  getAuth, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile as updateFirebaseProfile,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  type User,
  type Auth
} from 'firebase/auth';
import { usePathname, useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { DashboardSkeleton, AnimatedLogoLoader } from '@/components/loaders';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// --- Firebase Initialization ---
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";

let app: FirebaseApp | null = null;

const checkFirebaseConfiguration = (): boolean => {
    return (
      !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
      !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
      !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    );
};

const getFirebaseApp = (): FirebaseApp | null => {
    if (app) return app;

    if (!checkFirebaseConfiguration()) {
        console.error("Firebase configuration is missing or incomplete.");
        return null;
    }

    const firebaseConfig = {
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


// --- Auth Context ---
interface AuthContextType {
  user: User | null;
  loading: boolean;
  isFirebaseConfigured: boolean;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (profileData: { displayName?: string; photoURL?: string }) => Promise<void>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signInWithGitHub: () => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthLoader = () => {
  const pathname = usePathname();
  if (pathname.startsWith('/dashboard')) return <DashboardSkeleton />;
  if (pathname.startsWith('/login') || pathname.startsWith('/signup')) return <AuthFormSkeleton />;
  
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background">
      <AnimatedLogoLoader />
    </div>
  );
};


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFirebaseConfigured, setIsFirebaseConfigured] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    const configured = checkFirebaseConfiguration();
    setIsFirebaseConfigured(configured);

    if (!configured) {
        setLoading(false);
        return;
    }

    const app = getFirebaseApp();
    if (!app) {
        setLoading(false);
        return;
    }
    
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const ensureAuthInitialized = (): Auth => {
    const app = getFirebaseApp();
    if (!app) {
        throw new Error("Firebase App is not initialized. Check your .env file.");
    }
    return getAuth(app);
  }

  const signup = async (email: string, password: string, name: string) => {
    if (!isFirebaseConfigured) return { success: false, error: "Firebase is not configured." };
    try {
      const authInstance = ensureAuthInitialized();
      const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);
      await updateFirebaseProfile(userCredential.user, { displayName: name });
      await sendEmailVerification(userCredential.user);
      setUser({ ...userCredential.user, displayName: name });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const login = async (email: string, password: string) => {
    if (!isFirebaseConfigured) return { success: false, error: "Firebase is not configured." };
    try {
     const authInstance = ensureAuthInitialized();
      const userCredential = await signInWithEmailAndPassword(authInstance, email, password);
      if (!userCredential.user.emailVerified) {
        // Allow login but maybe show a banner in-app later. For now, let's let them in.
        // return { success: false, error: "Please verify your email before logging in. Check your inbox for a verification link." };
      }
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const socialSignIn = async (provider: GoogleAuthProvider | GithubAuthProvider) => {
    if (!isFirebaseConfigured) return { success: false, error: "Firebase is not configured." };
    try {
        const authInstance = ensureAuthInitialized();
        await signInWithPopup(authInstance, provider);
        return { success: true };
    } catch (error: any) {
         if (error.code === 'auth/account-exists-with-different-credential') {
            return { success: false, error: "An account already exists with the same email address but different sign-in credentials." };
         }
        return { success: false, error: error.message };
    }
  }

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    return socialSignIn(provider);
  }

  const signInWithGitHub = async () => {
    const provider = new GithubAuthProvider();
    return socialSignIn(provider);
  }

  const logout = async () => {
    const authInstance = ensureAuthInitialized();
    await signOut(authInstance);
    router.push("/");
  };
  
  const updateProfile = async (profileData: { displayName?: string; photoURL?: string }) => {
    const authInstance = ensureAuthInitialized();
    if (authInstance.currentUser) {
      await updateFirebaseProfile(authInstance.currentUser, profileData);
      const refreshedUser = { ...authInstance.currentUser };
      setUser(refreshedUser);
    } else {
      throw new Error("No user is currently signed in.");
    }
  };

  const value = {
    user,
    loading,
    isFirebaseConfigured,
    signup,
    login,
    logout,
    updateProfile,
    signInWithGoogle,
    signInWithGitHub,
  };

  if (loading || !isClient) {
    return <AuthLoader />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


export const FirebaseWarning = () => (
    <Alert variant="destructive" className="mb-4">
        <AlertTitle>Firebase Not Configured</AlertTitle>
        <AlertDescription>
            Your Firebase environment variables are missing or incorrect. Please add your project credentials to the 
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold mx-1">.env</code> 
            file and ensure the application has been restarted.
        </AlertDescription>
    </Alert>
);

export const AuthFormSkeleton = () => (
  <Card className="mx-auto max-w-sm w-full">
    <CardHeader className="space-y-2 text-center">
      <div className="flex justify-center mb-2">
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <Skeleton className="h-6 w-32 mx-auto" />
      <Skeleton className="h-4 w-48 mx-auto" />
    </CardHeader>
    <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
        <div className="h-5 flex items-center">
            <Skeleton className="h-px w-full" />
        </div>
        <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
        </div>
         <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-4 w-40 mx-auto" />
    </CardContent>
  </Card>
)
