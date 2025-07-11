
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
import { useAuth, FirebaseWarning } from "@/context/AuthContext";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function LoginForm() {
  const router = useRouter();
  const { login, sendPasswordReset, isFirebaseConfigured } = useAuth();
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        router.push("/dashboard");
      } else {
        setError(result.error || "An unknown error occurred.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to log in.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address to reset your password.");
      return;
    }
    setError(null);
    setMessage(null);
    setIsLoading(true);
    try {
      await sendPasswordReset(email);
      setMessage("Password reset email sent. Please check your inbox.");
    } catch (err: any) {
      setError(err.message || "Failed to send password reset email.");
    } finally {
      setIsLoading(false);
    }
  }

  const isFormDisabled = isLoading || !isFirebaseConfigured;

  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center items-center gap-2">
            <LinkNestIcon className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl font-bold">LinkNest</CardTitle>
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
        {message && (
            <Alert className="mb-4">
                <AlertDescription>{message}</AlertDescription>
            </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isFormDisabled} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Button type="button" variant="link" className="ml-auto inline-block text-sm underline h-auto p-0" onClick={handleForgotPassword} disabled={isFormDisabled}>
                Forgot your password?
              </Button>
            </div>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={isFormDisabled} />
          </div>
          <Button type="submit" className="w-full" disabled={isFormDisabled}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
