
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile as firebaseUpdateProfile,
  sendEmailVerification,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  verifyPasswordResetCode as firebaseVerifyPasswordResetCode,
  confirmPasswordReset as firebaseConfirmPasswordReset,
  type User
} from 'firebase/auth';
import { auth, isFirebaseConfigured, firebaseConfig } from '@/lib/firebase';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { AnimatedLogoLoader, DashboardSkeleton } from '@/components/loaders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// --- Auth Context ---
interface AuthContextType {
  user: User | null;
  loading: boolean;
  isFirebaseConfigured: boolean;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string; verificationSent?: boolean }>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (profileData: { displayName?: string; photoURL?: string }) => Promise<void>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signInWithGitHub: () => Promise<{ success: boolean; error?: string }>;
  sendPasswordReset: (email: string) => Promise<{ success: boolean, error?: string }>;
  verifyPasswordResetCode: (code: string) => Promise<{ success: boolean, error?: string }>;
  confirmPasswordReset: (code: string, newPassword: string) => Promise<{ success: boolean, error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- Auth Provider Component ---
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const token = await user.getIdToken();
        Cookies.set('firebaseIdToken', token, { secure: true, sameSite: 'strict' });

        if (pathname === '/login' || pathname === '/signup' || pathname === '/') {
          router.replace('/dashboard');
        }
      } else {
        setUser(null);
        Cookies.remove('firebaseIdToken');
        if (pathname.startsWith('/dashboard')) {
          router.replace('/login');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, pathname]);


  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await firebaseUpdateProfile(userCredential.user, { displayName: name });
      await sendEmailVerification(userCredential.user);
      return { success: true, verificationSent: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };
  
  const socialSignIn = async (provider: GoogleAuthProvider | GithubAuthProvider) => {
    try {
      await signInWithPopup(auth, provider);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  const signInWithGoogle = () => socialSignIn(new GoogleAuthProvider());
  const signInWithGitHub = () => socialSignIn(new GithubAuthProvider());
  
  const sendPasswordReset = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };
  
  const verifyPasswordResetCode = async (code: string) => {
    try {
      await firebaseVerifyPasswordResetCode(auth, code);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const confirmPasswordReset = async (code: string, newPassword: string) => {
    try {
      await firebaseConfirmPasswordReset(auth, code, newPassword);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    await signOut(auth);
    router.push('/login');
  };
  
  const updateProfile = async (profileData: { displayName?: string; photoURL?: string }) => {
    if(auth.currentUser) {
      await firebaseUpdateProfile(auth.currentUser, profileData);
      setUser(auth.currentUser); // Force re-render with updated info
    }
  };

  const value = {
    user,
    loading,
    isFirebaseConfigured: isFirebaseConfigured(),
    signup,
    login,
    logout,
    updateProfile,
    signInWithGoogle,
    signInWithGitHub,
    sendPasswordReset,
    verifyPasswordResetCode,
    confirmPasswordReset,
  };
  
  // Conditionally render skeleton loaders
  const isAuthPage = ['/login', '/signup', '/forgot-password', '/reset-password'].includes(pathname);
  
  if (loading && !isAuthPage && pathname !== '/') {
    return <DashboardSkeleton />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// --- Custom Hook ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


// --- Helper Components ---
export function FirebaseWarning() {
    return (
        <div className="mb-4 rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-800">
            <h3 className="font-bold">Firebase Not Configured</h3>
            <p className="mt-1">
                This feature requires Firebase. Please create an `.env` file with your Firebase project's configuration keys to proceed.
            </p>
            <pre className="mt-2 text-xs overflow-auto rounded bg-yellow-100 p-2">
{`NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...`}
            </pre>
        </div>
    )
}

export const AuthFormSkeleton = () => {
    return (
        <Card className="mx-auto max-w-sm w-full">
            <CardHeader className="space-y-2 text-center">
                <div className="flex justify-center mb-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>
                <Skeleton className="h-6 w-3/5 mx-auto" />
                <Skeleton className="h-4 w-4/5 mx-auto" />
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
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
            </CardContent>
        </Card>
    );
};
