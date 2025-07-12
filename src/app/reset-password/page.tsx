
import { AuthProvider } from "@/context/AuthContext";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { Suspense } from "react";
import { AnimatedLogoLoader } from "@/components/loaders";

function ResetPasswordContent() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
            <ResetPasswordForm />
        </main>
    )
}

export default function ResetPasswordPage() {
  return (
    <AuthProvider>
        <Suspense fallback={<AnimatedLogoLoader message="Loading form..." />}>
            <ResetPasswordContent />
        </Suspense>
    </AuthProvider>
  );
}
