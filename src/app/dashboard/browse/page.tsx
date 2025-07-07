
"use client";

import { useState } from "react";
import { useRooms } from "@/context/RoomContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Compass, Search, Users, LogIn, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import type { Room } from "@/context/RoomContext";
import { cn } from "@/lib/utils";

const popularTags = ["gaming", "work", "study", "fun", "design", "dev"];

export default function BrowsePublicRoomsPage() {
    const { allRooms, rooms: joinedRooms, joinRoom } = useRooms();
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTag, setActiveTag] = useState<string | null>(null);
    const router = useRouter();

    const publicRooms = allRooms.filter(room => room.type === 'public');

    const filteredRooms = publicRooms.filter(room => {
        const term = searchTerm.toLowerCase();
        const searchMatch = room.name.toLowerCase().includes(term) || room.tags?.some(t => t.toLowerCase().includes(term));
        const tagMatch = activeTag ? room.tags?.includes(activeTag) : true;
        return searchMatch && tagMatch;
    });

    const handleJoin = (room: Room) => {
        // If already joined, just navigate. Otherwise use the joinRoom flow (which handles adding to list)
        if (joinedRooms.some(r => r.id === room.id)) {
            router.push(`/dashboard/rooms/${room.id}`);
        } else {
            joinRoom(room);
        }
    }
    
    const toggleTag = (tag: string) => {
        setActiveTag(prev => prev === tag ? null : tag);
    }

    return (
        <div className="flex-1 space-y-8">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Compass className="h-8 w-8" />
                        Browse Public Rooms
                    </h2>
                    <p className="text-muted-foreground">
                        Discover and join public rooms.
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search by room name or tag..." 
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    {popularTags.map(tag => (
                        <Button 
                            key={tag} 
                            variant="outline" 
                            size="sm"
                            onClick={() => toggleTag(tag)}
                            className={cn(activeTag === tag && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground")}
                        >
                           <Tag className="mr-2 h-3 w-3" /> {tag}
                        </Button>
                    ))}
                </div>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredRooms.length > 0 ? filteredRooms.map(room => (
                    <Card key={room.id} className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="truncate">{room.name}</CardTitle>
                            <CardDescription className="flex items-center gap-2">
                                <Users className="h-4 w-4" /> 5 Members {/* Mock data */}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-2">
                            <Badge variant="secondary">Public</Badge>
                             {room.tags && room.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 pt-2">
                                    {room.tags.map(tag => (
                                        <Badge key={tag} variant="outline" className="font-normal">{tag}</Badge>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" onClick={() => handleJoin(room)}>
                                <LogIn className="mr-2 h-4 w-4" />
                                { joinedRooms.some(r => r.id === room.id) ? 'Enter Room' : 'Join Room' }
                            </Button>
                        </CardFooter>
                    </Card>
                )) : (
                    <p className="text-muted-foreground md:col-span-3 text-center">No public rooms found.</p>
                )}
            </div>
        </div>
    )
}
