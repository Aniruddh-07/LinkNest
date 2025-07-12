
import { AuthProvider } from "@/context/AuthContext";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <AuthProvider>
      <main className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
        <ForgotPasswordForm />
      </main>
    </AuthProvider>
  );
}
