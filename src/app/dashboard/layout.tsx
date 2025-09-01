
"use client";

import Link from "next/link";
import { Sidebar } from "@/components/sidebar";
import { RoomProvider } from "@/context/RoomContext";
import { useAuth } from "@/context/AuthContext";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SoloChatManager } from "@/components/chat/solo-chat-manager";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PanelLeft } from "lucide-react";
import { LinkNestIcon } from "@/components/icons";

function DashboardHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
           <SheetHeader className="sr-only">
            <SheetTitle>Sidebar Menu</SheetTitle>
          </SheetHeader>
           <Sidebar />
        </SheetContent>
      </Sheet>
    </header>
  );
}


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
          <div className="hidden w-64 flex-col sm:flex">
            <Sidebar />
          </div>
          <div className="flex flex-1 flex-col">
            <DashboardHeader />
            <main className="flex flex-1 flex-col p-4 sm:p-6 overflow-hidden">
                {children}
            </main>
          </div>
          <SoloChatManager />
        </div>
      </RoomProvider>
  );
}
