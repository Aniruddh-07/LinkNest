import { AuthProvider } from "@/context/AuthContext";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <AuthProvider>
      <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <LoginForm />
      </main>
    </AuthProvider>
  );
}
