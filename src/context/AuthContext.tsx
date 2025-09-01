
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatedLogoLoader } from '@/components/loaders';
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

const AuthLoader = () => {
  return <AnimatedLogoLoader message="Authenticating..." />;
};

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


// This is our hardcoded mock user for testing purposes
const mockUser: User = {
  uid: 'test-user-123',
  email: 'test@example.com',
  displayName: 'Test User',
  emailVerified: true,
  photoURL: null,
  providerData: [],
  // Cast to any to satisfy the complex User type from Firebase
  // We don't need these methods for the mock.
} as any;


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // On initial load, simulate checking for an existing session.
  useEffect(() => {
    const session = sessionStorage.getItem("mock-auth-session");
    if (session) {
      setUser(mockUser);
    }
    setLoading(false);
  }, []);

  // This effect handles routing logic AFTER the initial loading is complete
  useEffect(() => {
    if (loading) return; // Don't do anything while loading

    const isAuthRoute = ['/login', '/signup', '/forgot-password', '/reset-password'].some(p => pathname.startsWith(p));
    const isProtectedRoute = pathname.startsWith('/dashboard');

    // If user is logged in and tries to access an auth page, redirect to dashboard
    if (user && isAuthRoute) {
        router.push('/dashboard');
    }
    
    // If user is not logged in and tries to access a protected page, redirect to login
    if (!user && isProtectedRoute) {
        router.push('/login');
    }

  }, [user, loading, pathname, router]);
  
  
  // --- Mocked Auth Functions ---
  const login = async (email: string, password: string) => {
    setLoading(true);
    // In the mock, we just pretend the login is successful
    return new Promise<{ success: boolean; }>(resolve => {
        setTimeout(() => {
            sessionStorage.setItem("mock-auth-session", "true");
            setUser(mockUser);
            setLoading(false);
            resolve({ success: true });
        }, 500)
    });
  };

  const signup = async (email: string, password: string, name: string) => {
    const shouldSendVerification = !email.endsWith('@example.com');
    // For mock purposes, signup also just logs the user in.
    const result = await login(email, password);
    return { ...result, verificationSent: shouldSendVerification };
  };
  
  const socialSignIn = async (provider: 'google' | 'github') => {
      // Don't send verification for social sign-ins
      return login("social@example.com", "password");
  }

  const signInWithGoogle = () => socialSignIn('google');
  const signInWithGitHub = () => socialSignIn('github');
  
  const sendPasswordReset = async (email: string) => ({ success: true });
  const verifyPasswordResetCode = async (code: string) => ({ success: true });
  const confirmPasswordReset = async (code: string, newPassword: string) => ({ success: true });

  const logout = async () => {
    setLoading(true);
    setTimeout(() => {
        sessionStorage.removeItem("mock-auth-session");
        setUser(null);
        setLoading(false);
        router.push('/login');
    }, 500);
  };
  
  const updateProfile = async (profileData: { displayName?: string; photoURL?: string }) => {
    if(user) {
      setUser({ ...user, ...profileData });
    }
  };

  const value = {
    user,
    loading,
    isFirebaseConfigured: true, // Mocked as true
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
  
  const isAuthRoute = ['/login', '/signup', '/forgot-password', '/reset-password'].some(p => pathname.startsWith(p));

  // While loading, show a full-screen loader or a form skeleton on auth pages
  if (loading) {
    return isAuthRoute ? <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4"><AuthFormSkeleton /></div> : <AuthLoader />;
  }

  // If we are on a protected route but have no user, render nothing (the effect will redirect)
  if (!user && pathname.startsWith('/dashboard')) {
      return null;
  }
  
  // If we are on an auth route with a user, render nothing (the effect will redirect)
  if (user && isAuthRoute) {
      return null;
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

// This component is not used in the mock flow but kept for structure
export const FirebaseWarning = () => null;
