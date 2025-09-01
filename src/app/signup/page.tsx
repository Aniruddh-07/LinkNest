
// import { SignupForm } from "@/components/auth/signup-form";
import Link from "next/link";
import { LinkNestIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
        {/*
        <div className="absolute top-6 left-6">
            <Link
              href="/"
              className="flex items-center gap-2 font-semibold text-foreground"
            >
              <LinkNestIcon className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">LinkNest</span>
            </Link>
          </div>
        <SignupForm />
        */}
        <div className="text-center">
          <h1 className="text-2xl font-bold">Signup Disabled</h1>
          <p className="text-muted-foreground">Authentication is temporarily disabled.</p>
          <Button asChild variant="link">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </main>
  );
}
