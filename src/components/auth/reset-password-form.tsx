
"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
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
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, ArrowLeft } from "lucide-react";

export function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { verifyPasswordResetCode, confirmPasswordReset, loading: authLoading } = useAuth();
    
    const [oobCode, setOobCode] = useState<string | null>(null);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const code = searchParams.get('oobCode');
        if (!code) {
            setError("Invalid password reset link. The code is missing.");
            setIsLoading(false);
            return;
        }

        const verifyCode = async () => {
            const result = await verifyPasswordResetCode(code);
            if (result.success) {
                setOobCode(code);
            } else {
                setError(result.error || "The password reset link is invalid or has expired. Please request a new one.");
            }
            setIsLoading(false);
        };
        
        verifyCode();

    }, [searchParams, verifyPasswordResetCode]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }
        if (!oobCode) {
            setError("Invalid state. Reset code is missing.");
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await confirmPasswordReset(oobCode, password);
            if (result.success) {
                setMessage("Your password has been reset successfully! You can now log in with your new password.");
                setTimeout(() => router.push('/login'), 3000);
            } else {
                setError(result.error || "An unexpected error occurred.");
            }
        } catch (err: any) {
            setError(err.message || "Failed to reset password.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const isFormDisabled = authLoading || isLoading || isSubmitting || !!message;

    if (isLoading) {
        return (
             <Card className="mx-auto max-w-sm w-full">
                <CardHeader>
                    <CardTitle className="text-center">Verifying Link...</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </CardContent>
             </Card>
        )
    }

  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center items-center gap-2">
            <LinkNestIcon className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl font-bold">Reset Your Password</CardTitle>
        </div>
        <CardDescription>Enter your new password below.</CardDescription>
      </CardHeader>
      <CardContent>
        {error && !message && (
            <Alert variant="destructive" className="mb-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
                <Button variant="link" asChild className="w-full mt-2">
                    <Link href="/forgot-password">Request a new link</Link>
                </Button>
            </Alert>
        )}
        {message && (
            <Alert className="mb-4">
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
            </Alert>
        )}
        {!error && !message && (
             <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input 
                        id="password" 
                        type="password" 
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isFormDisabled} 
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input 
                        id="confirm-password" 
                        type="password" 
                        required 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isFormDisabled} 
                    />
                </div>
                <Button type="submit" className="w-full" disabled={isFormDisabled}>
                    {isSubmitting && <Loader2 className="animate-spin" />}
                    Reset Password
                </Button>
            </form>
        )}

        {(!!error || !!message) && (
             <Button variant="link" asChild className="w-full mt-4">
                <Link href="/login">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Login
                </Link>
            </Button>
        )}
      </CardContent>
    </Card>
  );
}
