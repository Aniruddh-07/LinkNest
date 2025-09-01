
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { usePathname, useRouter } from 'next/navigation';
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
  const [user, setUser] = useState<User | null>(mockUser); // Always logged in with mock user
  const [loading, setLoading] = useState(false); // Set loading to false as we are not fetching anything
  const router = useRouter();
  const pathname = usePathname();
  
  // No need for effects to check auth status, as we are always logged in.

  // --- Mocked Auth Functions ---
  const login = async (email: string, password: string) => {
    console.log("Mock login called, but user is already authenticated.");
    return { success: true };
  };

  const signup = async (email: string, password: string, name: string) => {
    console.log("Mock signup called, but user is already authenticated.");
    return { success: true };
  };
  
  const socialSignIn = async (provider: 'google' | 'github') => {
    console.log(`Mock social sign-in with ${provider} called.`);
    return { success: true };
  }

  const signInWithGoogle = () => socialSignIn('google');
  const signInWithGitHub = () => socialSignIn('github');
  
  const sendPasswordReset = async (email: string) => ({ success: true });
  const verifyPasswordResetCode = async (code: string) => ({ success: true });
  const confirmPasswordReset = async (code: string, newPassword: string) => ({ success: true });

  const logout = async () => {
    console.log("Mock logout called.");
    // In a real app, this would clear the user state.
    // For now, we'll keep the user logged in to avoid breaking the flow.
    router.push('/');
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
