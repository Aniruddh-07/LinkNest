
"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useMemo, useState } from "react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LinkNestIcon } from "./icons";
import { LogOut, Moon, Settings, Sun, Users, MoreHorizontal, Trash2, Compass, MinusCircle, PlusCircle, Folder, Tag, Loader2, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRooms, type Label as RoomLabel } from "@/context/RoomContext";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "./ui/skeleton";


const SidebarSkeleton = () => {
    return (
       <aside className="hidden w-64 flex-col border-r bg-background sm:flex p-4">
            <div className="flex h-[60px] items-center border-b px-2">
                <Skeleton className="h-8 w-8 rounded-full mr-2" />
                <Skeleton className="h-6 w-24" />
            </div>
            <div className="flex-1 space-y-2 py-2 px-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-20 mt-4 mb-2" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
            </div>
             <div className="mt-auto p-2">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                </div>
            </div>
       </aside>
    )
}

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { rooms, removeFromJoined, deleteRoom, labels, addLabel, assignLabelToRoom, roomLabelAssignments } = useRooms();
  const { setTheme } = useTheme();
  const { user, logout, loading } = useAuth();

  const [isLabelDialogOpen, setIsLabelDialogOpen] = useState(false);
  const [newLabelName, setNewLabelName] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed", error);
      // Handle logout error, maybe show a toast
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  const handleCreateLabel = () => {
    if (newLabelName.trim()) {
        addLabel(newLabelName.trim());
        setNewLabelName("");
        setIsLabelDialogOpen(false);
    }
  }

  const categorizedRooms = useMemo(() => {
    const labeled: Record<string, { label: RoomLabel; rooms: typeof rooms }> = {};
    const unlabeled: typeof rooms = [];

    labels.forEach(label => {
        labeled[label.id] = { label, rooms: [] };
    });

    rooms.forEach(room => {
        const labelId = roomLabelAssignments[room.id];
        if (labelId && labeled[labelId]) {
            labeled[labelId].rooms.push(room);
        } else {
            unlabeled.push(room);
        }
    });

    const labeledRoomsArray = Object.values(labeled).filter(l => l.rooms.length > 0);

    return { labeled: labeledRoomsArray, unlabeled };
  }, [rooms, labels, roomLabelAssignments]);


  const RoomItem = ({ room }: { room: typeof rooms[0] }) => {
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
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        <Tag className="mr-2 h-4 w-4" />
                        <span>Assign Label</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            {labels.map(label => (
                                <DropdownMenuItem key={label.id} onClick={() => assignLabelToRoom(room.id, label.id)}>
                                    <span>{label.name}</span>
                                </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator />
                             <DropdownMenuItem onClick={() => assignLabelToRoom(room.id, null)}>
                                <span>(Unassign)</span>
                            </DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                {room.isHost ? (
                    <DropdownMenuItem onClick={() => deleteRoom(room.id)} className="cursor-pointer text-destructive focus:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete Room</span>
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem onClick={() => removeFromJoined(room.id)} className="cursor-pointer">
                    <MinusCircle className="mr-2 h-4 w-4" />
                    <span>Remove from list</span>
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  if (loading || !user) {
    return <SidebarSkeleton />
  }

  return (
    <>
    <aside className="bg-background flex flex-col h-full">
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
            <Link
                href="/dashboard/browse"
                className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                pathname === "/dashboard/browse" && "bg-muted text-primary"
                )}
            >
                <Compass className="h-4 w-4" />
                Browse
            </Link>
            <Link
                href="/dashboard/friends"
                className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                pathname === "/dashboard/friends" && "bg-muted text-primary"
                )}
            >
                <User className="h-4 w-4" />
                Friends
            </Link>
          <div className="px-3 py-2 flex items-center justify-between mt-4">
            <h3 className="text-xs font-semibold text-muted-foreground">MY ROOMS</h3>
            <Dialog open={isLabelDialogOpen} onOpenChange={setIsLabelDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                        <PlusCircle className="h-4 w-4 text-muted-foreground" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[325px]">
                    <DialogHeader>
                        <DialogTitle>Create New Label</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Label htmlFor="label-name">Label Name</Label>
                        <Input id="label-name" value={newLabelName} onChange={(e) => setNewLabelName(e.target.value)} />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                        <Button onClick={handleCreateLabel}>Create</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
          </div>

          <Accordion type="multiple" defaultValue={["unlabeled", ...labels.map(l => l.id)]} className="w-full">
            {categorizedRooms.labeled.map(({ label, rooms }) => (
              <AccordionItem value={label.id} key={label.id} className="border-b-0">
                <AccordionTrigger className="py-1 hover:no-underline text-muted-foreground hover:text-primary [&[data-state=open]]:text-primary">
                  <div className="flex items-center gap-2">
                    <Folder className="h-4 w-4" />
                    <span>{label.name}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-2 pt-1 pb-0">
                  {rooms.map(room => <RoomItem key={room.id} room={room} />)}
                </AccordionContent>
              </AccordionItem>
            ))}
            
            {categorizedRooms.unlabeled.length > 0 && (
                <AccordionItem value="unlabeled" className="border-b-0">
                    <AccordionTrigger className="py-1 hover:no-underline text-muted-foreground hover:text-primary [&[data-state=open]]:text-primary">
                        <div className="flex items-center gap-2">
                        <Folder className="h-4 w-4" />
                        <span>Uncategorized</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-2 pt-1 pb-0">
                        {categorizedRooms.unlabeled.map(room => <RoomItem key={room.id} room={room} />)}
                    </AccordionContent>
                </AccordionItem>
            )}
          </Accordion>

        </nav>
      </div>
      <div className="mt-auto flex flex-col gap-2 p-4 border-t">
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
                />
                <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="text-left overflow-hidden">
                <p className="text-sm font-medium truncate">{user.displayName || 'User'}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
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
            <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
              {isLoggingOut ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
    </>
  );
}
