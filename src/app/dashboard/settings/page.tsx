
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, FileText, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRooms } from "@/context/RoomContext";

export default function SettingsPage() {
  const { toast } = useToast();
  const { userProfile, updateUserProfile } = useRooms();

  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);

  useEffect(() => {
    setName(userProfile.name);
    setEmail(userProfile.email);
  }, [userProfile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name, email });
    toast({
      title: "Profile Saved",
      description: "Your profile information has been updated.",
    });
  };

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
            <form onSubmit={handleSubmit} className="space-y-4">
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
          <CardContent>
            <p className="text-muted-foreground">
              Manage data shared across your rooms. This feature is coming soon!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users /> Friends List
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Manage your connections. This feature is coming soon!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
