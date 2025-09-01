
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LinkNestIcon } from "@/components/icons";
import { useAuth, FirebaseWarning, AuthFormSkeleton } from "@/context/AuthContext";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { GithubIcon } from "../icons";

function GoogleIcon() {
    return (
        <svg viewBox="0 0 48 48" className="h-5 w-5">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.022,35.244,44,30.036,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
        </svg>
    )
}

export function LoginForm() {
  const { login, signInWithGoogle, signInWithGitHub, isFirebaseConfigured, loading: authLoading, user } = useAuth();
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState<false | 'google' | 'github'>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.error || "An unknown error occurred.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to log in.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSocialLogin = async (provider: 'google' | 'github') => {
      if (isSocialLoading) return;
      setError(null);
      setIsSocialLoading(provider);
      try {
          const result = provider === 'google' ? await signInWithGoogle() : await signInWithGitHub();
          if (!result.success) {
              setError(result.error || `Failed to sign in with ${provider}.`);
          }
      } catch (err: any) {
          setError(err.message || `An error occurred during sign in with ${provider}.`);
      } finally {
          setIsSocialLoading(false);
      }
  };
  
  const totalLoading = authLoading || isLoading;
  const isFormDisabled = totalLoading || isSocialLoading || !isFirebaseConfigured;

  if (authLoading && !user) {
    return <AuthFormSkeleton />;
  }
  
  if (user) {
      return (
        <Card className="mx-auto max-w-sm w-full">
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-bold">Already Logged In</CardTitle>
                <CardDescription>You are already logged in. Redirecting you...</CardDescription>
            </CardHeader>
             <CardContent className="flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </CardContent>
        </Card>
      )
  }

  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center items-center gap-2">
            <LinkNestIcon className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl font-bold">Login</CardTitle>
        </div>
        <CardDescription>Enter your email below to login to your account</CardDescription>
      </CardHeader>
      <CardContent>
        {!isFirebaseConfigured && <FirebaseWarning />}
        {error && (
            <Alert variant="destructive" className="mb-4">
                <AlertTitle>Login Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        <div className="grid grid-cols-2 gap-4 mb-4">
            <Button variant="outline" onClick={() => handleSocialLogin('google')} disabled={isFormDisabled}>
                {isSocialLoading === 'google' ? <Loader2 className="animate-spin" /> : <GoogleIcon />}
                Google
            </Button>
             <Button variant="outline" onClick={() => handleSocialLogin('github')} disabled={isFormDisabled}>
                {isSocialLoading === 'github' ? <Loader2 className="animate-spin" /> : <GithubIcon />}
                GitHub
            </Button>
        </div>

        <div className="relative mb-4">
            <Separator />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className="bg-background px-2 text-xs uppercase text-muted-foreground">OR</span>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isFormDisabled} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link href="/forgot-password" className="ml-auto inline-block text-sm underline h-auto p-0">
                Forgot your password?
              </Link>
            </div>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={isFormDisabled} />
          </div>
          <Button type="submit" className="w-full" disabled={isFormDisabled}>
            {totalLoading && <Loader2 className="animate-spin" />}
            Login
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className={cn(isFormDisabled && "pointer-events-none opacity-50", "underline")}>
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
