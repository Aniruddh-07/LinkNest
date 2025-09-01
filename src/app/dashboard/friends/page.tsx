
"use client";

import { useState } from "react";
import { useRooms, type Friend } from "@/context/RoomContext";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Users, UserPlus, X, MessageSquare, Phone, Users2 } from "lucide-react";

export default function FriendsPage() {
    const { friends, addFriend, removeFriend, addRoom } = useRooms();
    const { toast } = useToast();
    const router = useRouter();

    const [friendEmail, setFriendEmail] = useState("");
    const [selectedFriends, setSelectedFriends] = useState<Friend[]>([]);

    const handleAddFriend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!friendEmail.trim() || !friendEmail.includes('@') || friends.some(f => f.email === friendEmail)) {
            toast({
                variant: "destructive",
                title: "Invalid Email",
                description: "Please enter a valid email that isn't already on your friends list."
            });
            return;
        }
        const newFriend: Friend = {
            name: friendEmail.split('@')[0], // Mock name
            email: friendEmail,
            avatar: "https://placehold.co/40x40.png",
            hint: "person avatar"
        }
        addFriend(newFriend);
        setFriendEmail("");
        toast({
            title: "Friend Added",
            description: `${newFriend.name} has been added to your friends list.`
        });
    }

    const handleRemoveFriend = (emailToRemove: string) => {
        removeFriend(emailToRemove);
        setSelectedFriends(prev => prev.filter(f => f.email !== emailToRemove));
        toast({
            title: "Friend Removed",
            description: "The user has been removed from your friends list."
        });
    }

    const handleSelectFriend = (friend: Friend, isSelected: boolean) => {
        if (isSelected) {
            setSelectedFriends(prev => [...prev, friend]);
        } else {
            setSelectedFriends(prev => prev.filter(f => f.email !== friend.email));
        }
    }
    
    const handleCreateGroupRoom = () => {
        if (selectedFriends.length < 2) return;

        const roomName = selectedFriends.map(f => f.name).join(', ') + "'s Group";
        const newRoom = addRoom({
            name: roomName,
            type: 'private',
            password: Math.random().toString(36).substring(2, 8), // random password
        });

        toast({
            title: "Group Room Created!",
            description: `A new private room "${roomName}" has been created for you and your friends.`,
        });

        router.push(`/dashboard/rooms/${newRoom.id}`);
    }

    const handleStartChat = () => {
        if (selectedFriends.length !== 1) return;
        toast({ title: `Starting chat with ${selectedFriends[0].name}...` });
        // In a real app, this would navigate to a 1-on-1 chat page.
        // For now, we'll just show a toast.
    }
    
    const handleStartCall = () => {
        if (selectedFriends.length !== 1) return;
        toast({ title: `Starting call with ${selectedFriends[0].name}...` });
        // In a real app, this would initiate a WebRTC call.
        // For now, we'll just show a toast.
    }

    return (
        <div className="flex-1 space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <Users className="h-8 w-8" />
                    Friends
                </h2>
                <p className="text-muted-foreground">
                    Connect with your friends one-on-one or create group rooms.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Your Friends ({friends.length})</CardTitle>
                                <CardDescription>Select friends to start a conversation or create a group.</CardDescription>
                            </div>
                            {selectedFriends.length > 0 && (
                                <div className="flex gap-2">
                                     {selectedFriends.length === 1 && (
                                        <>
                                            <Button variant="outline" size="sm" onClick={handleStartChat}>
                                                <MessageSquare className="mr-2 h-4 w-4"/>
                                                Start Chat
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={handleStartCall}>
                                                <Phone className="mr-2 h-4 w-4"/>
                                                Start Call
                                            </Button>
                                        </>
                                    )}
                                    {selectedFriends.length > 1 && (
                                        <Button size="sm" onClick={handleCreateGroupRoom}>
                                            <Users2 className="mr-2 h-4 w-4" />
                                            Create Group Room ({selectedFriends.length})
                                        </Button>
                                    )}
                                </div>
                            )}
                        </CardHeader>
                        <CardContent>
                             <div className="space-y-4">
                                {friends.length > 0 ? (
                                    friends.map(friend => (
                                        <div key={friend.email} className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                             <Checkbox 
                                                id={`friend-${friend.email}`}
                                                onCheckedChange={(checked) => handleSelectFriend(friend, !!checked)}
                                                checked={selectedFriends.some(f => f.email === friend.email)}
                                            />
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={friend.avatar} data-ai-hint={friend.hint} />
                                                <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <p className="font-medium">{friend.name}</p>
                                                <p className="text-xs text-muted-foreground">{friend.email}</p>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => handleRemoveFriend(friend.email)}>
                                                <X className="h-4 w-4" />
                                                <span className="sr-only">Remove Friend</span>
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-10">You haven't added any friends yet.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="md:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Add a Friend</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleAddFriend} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="friend-email">Friend's Email</Label>
                                    <Input 
                                        id="friend-email"
                                        type="email" 
                                        placeholder="friend@example.com"
                                        value={friendEmail}
                                        onChange={(e) => setFriendEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full">
                                    <UserPlus className="mr-2 h-4 w-4"/>
                                    Add Friend
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
