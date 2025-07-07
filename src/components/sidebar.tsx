"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LinkNestIcon } from "./icons";
import { LogOut, PlusCircle, Settings, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const rooms = [
  { id: "a1b2c3", name: "Design Team" },
  { id: "d4e5f6", name: "Dev Sync" },
  { id: "g7h8i9", name: "Project Phoenix" },
];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    // Mock logout logic
    router.push("/");
  };

  const createNewRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 8);
    router.push(`/dashboard/rooms/${newRoomId}`);
  };

  return (
    <aside className="hidden w-64 flex-col border-r bg-background sm:flex">
      <div className="flex h-[60px] items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <LinkNestIcon className="h-6 w-6 text-primary" />
          <span>LinkNest</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-4 text-sm font-medium">
          <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">
            Joined Rooms
          </div>
          {rooms.map((room) => {
            const isActive = pathname === `/dashboard/rooms/${room.id}`;
            return (
              <Link
                key={room.id}
                href={`/dashboard/rooms/${room.id}`}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  isActive && "bg-muted text-primary"
                )}
              >
                <Users className="h-4 w-4" />
                {room.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto flex flex-col gap-2 p-4">
        <Button onClick={createNewRoom}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Room
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center justify-start gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://placehold.co/40x40.png" alt="@user" data-ai-hint="user avatar" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="text-sm font-medium">User</p>
                <p className="text-xs text-muted-foreground">user@example.com</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
