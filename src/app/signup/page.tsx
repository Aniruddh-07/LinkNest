import { AuthProvider } from "@/context/AuthContext";
import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <AuthProvider>
      <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <SignupForm />
      </main>
    </AuthProvider>
  );
}
