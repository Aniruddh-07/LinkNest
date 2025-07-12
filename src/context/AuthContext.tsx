
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
  type User,
  type Auth
} from 'firebase/auth';
import { getFirebaseApp, checkFirebaseConfiguration } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { DashboardSkeleton } from '@/components/loaders';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// --- Auth Context ---
interface AuthContextType {
  user: User | null;
  loading: boolean;
  isFirebaseConfigured: boolean;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  updateProfile: (profileData: { displayName?: string; photoURL?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFirebaseConfigured, setIsFirebaseConfigured] = useState(false);
  const router = useRouter();

  useEffect(() => {
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
  
  const ensureAuthInitialized = () => {
    const app = getFirebaseApp();
    if (!app) {
        throw new Error("Firebase App is not initialized.");
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
        return { success: false, error: "Please verify your email before logging in. Check your inbox for a verification link." };
      }
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    const authInstance = ensureAuthInitialized();
    await signOut(authInstance);
    router.push('/');
  };

  const sendPasswordReset = async (email: string) => {
    const authInstance = ensureAuthInitialized();
    await sendPasswordResetEmail(authInstance, email);
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
    sendPasswordReset,
    updateProfile,
  };

  if (loading) {
    // Determine which loader to show based on the current path
    if (typeof window !== "undefined") {
      const pathname = window.location.pathname;
      if (pathname === '/login' || pathname === '/signup') {
        return <AuthFormSkeleton />;
      }
      if (pathname.startsWith('/dashboard')) {
        return <DashboardSkeleton />;
      }
    }
    // Default to the main logo loader for the landing page
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
          <AnimatedLogoLoader />
      </div>
    );
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
      <div className="flex justify-center">
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <Skeleton className="h-6 w-32 mx-auto" />
      <Skeleton className="h-4 w-48 mx-auto" />
    </CardHeader>
    <CardContent className="space-y-4">
        <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
        </div>
         <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-4 w-full" />
    </CardContent>
  </Card>
)

export function AnimatedLogoLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <style jsx>{`
        .icon-container {
          animation: bounce 2s infinite ease-in-out;
        }
        .text-container span {
          opacity: 0;
          animation: fadeIn 1s forwards;
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-20px);
          }
          60% {
            transform: translateY(-10px);
          }
        }
        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }
      `}</style>
      <div className="icon-container">
        <Skeleton className="h-16 w-16 rounded-full" />
      </div>
       <Skeleton className="h-8 w-40" />
    </div>
  );
}
