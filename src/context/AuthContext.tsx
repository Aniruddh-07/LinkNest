
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
  verifyPasswordResetCode as verifyFirebaseCode,
  confirmPasswordReset as confirmFirebaseReset,
  updateProfile as updateFirebaseProfile,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  type User,
  type Auth
} from 'firebase/auth';
import { usePathname, useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AnimatedLogoLoader } from '@/components/loaders';
import { Skeleton } from '@/components/ui/skeleton';

// --- Firebase Initialization ---
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";

let app: FirebaseApp | null = null;

const checkFirebaseConfiguration = (): boolean => {
    return true; // Mocked for now
};

const getFirebaseApp = (): FirebaseApp | null => {
    if (app) return app;

    // Mock config to prevent errors
    const firebaseConfig = {
        apiKey: "test",
        authDomain: "test.firebaseapp.com",
        projectId: "test",
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
  sendPasswordReset: (email: string) => Promise<{ success: boolean, error?: string }>;
  verifyPasswordResetCode: (code: string) => Promise<{ success: boolean, error?: string }>;
  confirmPasswordReset: (code: string, newPassword: string) => Promise<{ success: boolean, error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthLoader = () => {
  return <AnimatedLogoLoader />;
};

const mockUser = {
  uid: 'test-user-123',
  email: 'test@example.com',
  displayName: 'Test User',
  emailVerified: true,
  // Add other properties as needed by your app, matching the Firebase User type
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
  const [isFirebaseConfigured, setIsFirebaseConfigured] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Mocking the auth state
    setUser(mockUser);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (loading) return;

    const isAuthRoute = pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password' || pathname === '/reset-password';
    const isProtectedRoute = pathname.startsWith('/dashboard');

    if (user && isAuthRoute) {
        router.push('/dashboard');
    }
    if (!user && isProtectedRoute) {
        router.push('/login');
    }

  }, [user, loading, pathname, router]);
  
  
  // Mocked functions
  const signup = async (email: string, password: string, name: string) => {
    console.log("Signup called (mocked)", { email, name });
    setUser(mockUser);
    return { success: true };
  };

  const login = async (email: string, password: string) => {
    console.log("Login called (mocked)", { email });
    setUser(mockUser);
    return { success: true };
  };

  const socialSignIn = async (provider: 'google' | 'github') => {
    console.log(`Social sign-in with ${provider} (mocked)`);
    setUser(mockUser);
    return { success: true };
  }

  const signInWithGoogle = async () => socialSignIn('google');
  const signInWithGitHub = async () => socialSignIn('github');
  
  const sendPasswordReset = async (email: string) => {
    console.log("Password reset sent (mocked)", { email });
    return { success: true };
  }

  const verifyPasswordResetCode = async (code: string) => {
      return { success: true };
  };
  
  const confirmPasswordReset = async (code: string, newPassword: string) => {
      return { success: true };
  };

  const logout = async () => {
    console.log("Logout called (mocked)");
    setUser(null);
  };
  
  const updateProfile = async (profileData: { displayName?: string; photoURL?: string }) => {
    console.log("Profile updated (mocked)", profileData);
    if(user) {
      setUser({ ...user, ...profileData });
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
    sendPasswordReset,
    verifyPasswordResetCode,
    confirmPasswordReset,
  };

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

export const AuthFormSkeleton = () => {
    return (
       <AnimatedLogoLoader message="Authenticating..."/>
    )
};
