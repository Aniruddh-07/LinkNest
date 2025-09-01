
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatedLogoLoader } from '@/components/loaders';

// --- Auth Context ---
interface AuthContextType {
  user: User | null;
  loading: boolean;
  isFirebaseConfigured: boolean; // Kept for potential future use
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
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
  return <AnimatedLogoLoader message="Loading..." />;
};

// This is our hardcoded mock user for testing purposes
const mockUser = {
  uid: 'test-user-123',
  email: 'test@example.com',
  displayName: 'Test User',
  emailVerified: true,
  photoURL: null,
  providerId: 'password',
  metadata: {},
  providerData: [],
  refreshToken: '',
  tenantId: null,
  delete: () => Promise.resolve(),
  getIdToken: () => Promise.resolve('mock-token'),
  getIdTokenResult: () => Promise.resolve({ token: 'mock-token', claims: {}, authTime: '', expirationTime: '', issuedAtTime: '', signInProvider: null, signInSecondFactor: null}),
  reload: () => Promise.resolve(),
  toJSON: () => ({}),
} as User;


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // On initial load, simulate checking for an existing session and set the mock user
  useEffect(() => {
    // In a real app, you'd check localStorage or an API. Here, we just set the mock user.
    setTimeout(() => {
      setUser(mockUser);
      setLoading(false);
    }, 500); // A small delay to simulate network latency
  }, []);

  // This effect handles routing logic AFTER the initial loading is complete
  useEffect(() => {
    if (loading) return; // Don't do anything while loading

    const isAuthRoute = ['/login', '/signup', '/forgot-password', '/reset-password'].includes(pathname);
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
            setUser(mockUser);
            setLoading(false);
            resolve({ success: true });
        }, 500)
    });
  };

  const signup = async (email: string, password: string, name: string) => {
      // For mock purposes, signup also just logs the user in.
      return login(email, password);
  };
  
  const socialSignIn = async (provider: 'google' | 'github') => {
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
        setUser(null);
        setLoading(false);
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
  
  // While loading, show a full-screen loader to prevent content flash
  if (loading) {
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

// These components are not used in the mock flow but kept for structure
export const FirebaseWarning = () => null;
export const AuthFormSkeleton = () => null;
