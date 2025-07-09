
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, FileText, Users, Download, Trash2, UserPlus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRooms } from "@/context/RoomContext";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Friend {
  name: string;
  email: string;
  avatar: string;
  hint: string;
}

const initialFriends: Friend[] = [
  { name: "Alice", email: "alice@example.com", avatar: "https://placehold.co/40x40.png", hint: "woman smiling" },
  { name: "Bob", email: "bob@example.com", avatar: "https://placehold.co/40x40.png", hint: "man portrait" },
];

export default function SettingsPage() {
  const { toast } = useToast();
  const { userProfile, updateUserProfile } = useRooms();

  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [friends, setFriends] = useState<Friend[]>(initialFriends);
  const [friendEmail, setFriendEmail] = useState("");


  useEffect(() => {
    setName(userProfile.name);
    setEmail(userProfile.email);
  }, [userProfile]);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name, email });
    toast({
      title: "Profile Saved",
      description: "Your profile information has been updated.",
    });
  };

  const handleExport = () => {
    toast({
        title: "Exporting Data",
        description: "Your data export has started and will be emailed to you."
    });
  }

  const handleDeleteData = () => {
    toast({
        variant: "destructive",
        title: "Data Deletion",
        description: "Your shared data has been scheduled for deletion."
    });
  }

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
    setFriends(prev => [...prev, newFriend]);
    setFriendEmail("");
    toast({
        title: "Friend Added",
        description: `${newFriend.name} has been added to your friends list.`
    });
  }

  const handleRemoveFriend = (emailToRemove: string) => {
    setFriends(prev => prev.filter(f => f.email !== emailToRemove));
    toast({
        title: "Friend Removed",
        description: "The user has been removed from your friends list."
    });
  }

  return (
    <div className="flex-1 space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account, data, and connections.
        </p>
      </div>

      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User /> Profile Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button type="submit">Save Changes</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText /> Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Export or delete your data shared within rooms. These actions are irreversible.
            </p>
            <div className="flex flex-wrap gap-4">
                <Button variant="outline" onClick={handleExport}>
                    <Download className="mr-2 h-4 w-4" />
                    Export Chat History
                </Button>
                <Button variant="destructive" onClick={handleDeleteData}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete All Shared Data
                </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users /> Friends List
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddFriend} className="flex gap-2 mb-6">
                <Input 
                    type="email" 
                    placeholder="friend@example.com"
                    value={friendEmail}
                    onChange={(e) => setFriendEmail(e.target.value)}
                    required
                />
                <Button type="submit">
                    <UserPlus className="mr-2 h-4 w-4"/>
                    Add Friend
                </Button>
            </form>

            <Separator />

            <div className="space-y-4 pt-6">
                <h4 className="text-sm font-medium text-muted-foreground">Your Friends ({friends.length})</h4>
                {friends.length > 0 ? (
                    friends.map(friend => (
                        <div key={friend.email} className="flex items-center gap-4 group">
                            <Avatar>
                                <AvatarImage src={friend.avatar} data-ai-hint={friend.hint} />
                                <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className="font-medium">{friend.name}</p>
                                <p className="text-xs text-muted-foreground">{friend.email}</p>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100" onClick={() => handleRemoveFriend(friend.email)}>
                                <X className="h-4 w-4" />
                                <span className="sr-only">Remove Friend</span>
                            </Button>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground text-center pt-4">You haven't added any friends yet.</p>
                )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
