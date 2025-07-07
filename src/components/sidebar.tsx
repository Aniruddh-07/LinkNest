
"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LinkNestIcon } from "./icons";
import { LogOut, Moon, Settings, Sun, Users, MoreHorizontal, Trash2, Compass, MinusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRooms } from "@/context/RoomContext";

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { rooms, leaveRoom, deleteRoom } = useRooms();
  const { setTheme } = useTheme();

  const handleLogout = () => {
    // Mock logout logic
    router.push("/");
  };

  return (
    <aside className="hidden w-64 flex-col border-r bg-background sm:flex">
      <div className="flex h-[60px] items-center border-b px-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold"
        >
          <LinkNestIcon className="h-6 w-6 text-primary" />
          <span>LinkNest</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-4 text-sm font-medium">
          <Button variant="outline" className="mb-4" onClick={() => router.push('/dashboard/browse')}>
            <Compass className="mr-2 h-4 w-4" />
            Browse Public Rooms
          </Button>
          <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">
            Joined Rooms
          </div>
          {rooms.map((room) => {
            const isActive = pathname === `/dashboard/rooms/${room.id}`;
            return (
              <div key={room.id} className="flex items-center group">
                 <Link
                    href={`/dashboard/rooms/${room.id}`}
                    className={cn(
                      "flex-1 flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                      isActive && "bg-muted text-primary"
                    )}
                  >
                  <Users className="h-4 w-4" />
                  <span className="truncate">{room.name}</span>
                </Link>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 ml-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {room.isHost ? (
                        <DropdownMenuItem onClick={() => deleteRoom(room.id)} className="cursor-pointer text-destructive focus:text-destructive">
                           <Trash2 className="mr-2 h-4 w-4" />
                           <span>Delete Room</span>
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => leaveRoom(room.id)} className="cursor-pointer">
                          <MinusCircle className="mr-2 h-4 w-4" />
                          <span>Remove from list</span>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                </DropdownMenu>
              </div>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto flex flex-col gap-2 p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center justify-start gap-2"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src="https://placehold.co/40x40.png"
                  alt="@user"
                  data-ai-hint="user avatar"
                />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="text-sm font-medium">User</p>
                <p className="text-xs text-muted-foreground">
                  user@example.com
                </p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 mr-2" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 mr-2" />
                <span>Toggle theme</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
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
