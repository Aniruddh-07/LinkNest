
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
import { Loader2, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function ForgotPasswordForm() {
  const { sendPasswordReset, isFirebaseConfigured, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    setError(null);
    setMessage(null);
    setIsLoading(true);
    try {
      const result = await sendPasswordReset(email);
      if (result.success) {
        setMessage("Password reset email sent. Please check your inbox (and spam folder).");
      } else {
        setError(result.error || "An unknown error occurred.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to send password reset email.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const isFormDisabled = authLoading || isLoading || !isFirebaseConfigured;

  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center items-center gap-2">
            <LinkNestIcon className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
        </div>
        <CardDescription>Enter your email to receive a password reset link.</CardDescription>
      </CardHeader>
      <CardContent>
        {!isFirebaseConfigured && <FirebaseWarning />}
        {error && (
            <Alert variant="destructive" className="mb-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        {message && (
            <Alert className="mb-4">
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
            </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
                id="email" 
                type="email" 
                placeholder="m@example.com" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                disabled={isFormDisabled} 
            />
          </div>
          <Button type="submit" className="w-full" disabled={isFormDisabled}>
            {isLoading && <Loader2 className="animate-spin" />}
            Send Reset Link
          </Button>
        </form>
        <Button variant="link" asChild className="w-full mt-4">
            <Link href="/login" className={cn(isFormDisabled && "pointer-events-none opacity-50")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
            </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
