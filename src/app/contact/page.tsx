
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LinkNestIcon } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Send } from "lucide-react";

export default function ContactPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !email || !message) {
            toast({
                variant: "destructive",
                title: "Incomplete Form",
                description: "Please fill out all fields before sending.",
            });
            return;
        }

        const subject = encodeURIComponent(`Message from ${name} via LinkNest Contact Form`);
        const body = encodeURIComponent(message + `\n\nFrom: ${name} (${email})`);
        const mailtoLink = `mailto:your-email@example.com?subject=${subject}&body=${body}`;

        // This will attempt to open the user's default email client
        window.location.href = mailtoLink;

        toast({
            title: "Email Client Opened",
            description: "Your message is ready to be sent from your default email app.",
        });

        // Clear the form
        setName("");
        setEmail("");
        setMessage("");
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
            <div className="absolute top-6 left-6">
                <Button asChild variant="ghost">
                    <Link href="/" className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Home
                    </Link>
                </Button>
            </div>
            <Card className="w-full max-w-lg">
                <CardHeader className="text-center">
                    <div className="flex justify-center items-center gap-2 mb-2">
                        <LinkNestIcon className="h-8 w-8 text-primary" />
                        <CardTitle className="text-2xl font-bold">Contact Us</CardTitle>
                    </div>
                    <CardDescription>
                        Have a question, a bug report, or feedback? We'd love to hear from you.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input 
                                    id="name" 
                                    placeholder="Your Name" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input 
                                    id="email" 
                                    type="email" 
                                    placeholder="your.email@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required 
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea 
                                id="message" 
                                placeholder="Describe your issue or feedback here..." 
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                                rows={6}
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            <Send className="mr-2 h-4 w-4" />
                            Send Message
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </main>
    );
}
