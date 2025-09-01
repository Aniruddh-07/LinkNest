
"use client";

import { Sidebar } from "@/components/sidebar";
import { RoomProvider } from "@/context/RoomContext";
import { useAuth } from "@/context/AuthContext";
import { DashboardSkeleton } from "@/components/loaders";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!user) {
    // AuthProvider will handle the redirect.
    // Returning null prevents a flash of incorrect content.
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
