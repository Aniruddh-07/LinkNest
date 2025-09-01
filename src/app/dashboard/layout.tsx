
"use client";

import { Sidebar } from "@/components/sidebar";
import { RoomProvider } from "@/context/RoomContext";
import { useAuth } from "@/context/AuthContext";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  // In our new "developer mode", user should always exist.
  // This is a failsafe in case the context hasn't loaded yet,
  // or if we revert to real auth later.
  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);
  
  if (!user) {
      return null;
  }

  return (
      <RoomProvider>
        <div className="flex min-h-screen w-full bg-muted/40">
          <Sidebar />
          <main className="flex flex-1 flex-col p-4 sm:p-6 overflow-hidden">{children}</main>
        </div>
      </RoomProvider>
  );
}
