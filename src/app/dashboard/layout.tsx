import { Sidebar } from "@/components/sidebar";
import { AuthProvider } from "@/context/AuthContext";
import { RoomProvider } from "@/context/RoomContext";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <RoomProvider>
        <div className="flex min-h-screen w-full bg-muted/40">
          <Sidebar />
          <main className="flex flex-1 flex-col p-4 sm:p-6 overflow-hidden">{children}</main>
        </div>
      </RoomProvider>
    </AuthProvider>
  );
}
