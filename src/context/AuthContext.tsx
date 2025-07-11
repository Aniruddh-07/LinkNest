
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
  type User 
} from 'firebase/auth';
import { getFirebaseApp, checkFirebaseConfiguration } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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

const isFirebaseConfigured = checkFirebaseConfiguration();

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isFirebaseConfigured) {
        setLoading(false);
        return;
    }
    const app = getFirebaseApp();
    // This should not happen if isFirebaseConfigured is true, but it's a safe guard.
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

  const signup = async (email: string, password: string, name: string) => {
    const app = getFirebaseApp();
    if (!app) return { success: false, error: "Firebase is not configured."};
    const auth = getAuth(app);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateFirebaseProfile(userCredential.user, { displayName: name });
      await sendEmailVerification(userCredential.user);
      // Update local user state immediately
      setUser({ ...userCredential.user, displayName: name });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const login = async (email: string, password: string) => {
     const app = getFirebaseApp();
     if (!app) return { success: false, error: "Firebase is not configured."};
     const auth = getAuth(app);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (!userCredential.user.emailVerified) {
        return { success: false, error: "Please verify your email before logging in. Check your inbox for a verification link." };
      }
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    const app = getFirebaseApp();
    if (!app) return;
    const auth = getAuth(app);
    await signOut(auth);
    router.push('/');
  };

  const sendPasswordReset = async (email: string) => {
    const app = getFirebaseApp();
    if (!app) throw new Error("Firebase is not configured.");
    const auth = getAuth(app);
    await sendPasswordResetEmail(auth, email);
  };
  
  const updateProfile = async (profileData: { displayName?: string; photoURL?: string }) => {
    const app = getFirebaseApp();
    if (!app) throw new Error("Firebase is not properly configured.");
    
    const auth = getAuth(app);
    if (auth.currentUser) {
      await updateFirebaseProfile(auth.currentUser, profileData);
      // Force a refresh of the user object to get the latest profile data
      const refreshedUser = { ...auth.currentUser };
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
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
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
)
