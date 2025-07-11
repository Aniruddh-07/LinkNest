
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
import { app } from '@/lib/firebase'; // Ensure you have this file set up
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Check if the necessary Firebase environment variables are set
const isFirebaseConfigured = !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
                             !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
                             !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;


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
  const auth = getAuth(app);
  const router = useRouter();

  useEffect(() => {
    if (!isFirebaseConfigured) {
        setLoading(false);
        return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  const signup = async (email: string, password: string, name: string) => {
    if (!isFirebaseConfigured) return { success: false, error: "Firebase is not configured."};
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
     if (!isFirebaseConfigured) return { success: false, error: "Firebase is not configured."};
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
    await signOut(auth);
    router.push('/');
  };

  const sendPasswordReset = async (email: string) => {
    if (!isFirebaseConfigured) throw new Error("Firebase is not configured.");
    await sendPasswordResetEmail(auth, email);
  };
  
  const updateProfile = async (profileData: { displayName?: string; photoURL?: string }) => {
    if (auth.currentUser) {
      await updateFirebaseProfile(auth.currentUser, profileData);
      // Force a refresh of the user object to get the latest profile data
      setUser(auth.currentUser ? { ...auth.currentUser } : null);
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
            Your Firebase environment variables are missing. Please add your project credentials to the 
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold mx-1">.env</code> 
            file and restart the development server.
        </AlertDescription>
    </Alert>
)
