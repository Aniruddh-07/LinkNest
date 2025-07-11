
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
import { LinkNestIcon } from "../icons";
import { useAuth, FirebaseWarning } from "@/context/AuthContext";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function SignupForm() {
  const router = useRouter();
  const { signup, isFirebaseConfigured } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);
    try {
      const result = await signup(email, password, name);
      if (result.success) {
        setMessage("Account created! Please check your email to verify your account before logging in.");
        // Optionally redirect to a "check your email" page or the login page
        // router.push("/"); 
      } else {
        setError(result.error || "An unknown error occurred.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create account.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const isFormDisabled = isLoading || !isFirebaseConfigured;

  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader className="space-y-1 text-center">
      <div className="flex justify-center items-center gap-2">
            <LinkNestIcon className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl font-bold">LinkNest</CardTitle>
        </div>
        <CardDescription>Enter your information to create an account</CardDescription>
      </CardHeader>
      <CardContent>
        {!isFirebaseConfigured && <FirebaseWarning />}
        {error && (
            <Alert variant="destructive" className="mb-4">
                <AlertTitle>Signup Failed</AlertTitle>
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
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="John Doe" required value={name} onChange={e => setName(e.target.value)} disabled={isFormDisabled} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={e => setEmail(e.target.value)} disabled={isFormDisabled} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} disabled={isFormDisabled} />
          </div>
          <Button type="submit" className="w-full" disabled={isFormDisabled}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create an account
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/" className={cn(isFormDisabled && "pointer-events-none opacity-50", "underline")}>
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
