
import { Button } from "@/components/ui/button";
import { LinkNestIcon } from "@/components/icons";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Link as LinkIcon, Users, Video, File, Mic } from "lucide-react";

function LandingNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 px-6 bg-background/80 backdrop-blur-sm">
      <Link href="/" className="flex items-center gap-2 font-semibold">
        <LinkNestIcon className="h-8 w-8 text-primary" />
        <span className="text-xl font-bold">LinkNest</span>
      </Link>
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost">
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild>
          <Link href="/signup">Sign Up</Link>
        </Button>
      </div>
    </nav>
  );
}

function LandingFooter() {
  return (
    <footer className="w-full bg-muted border-t">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between p-6 text-center sm:text-left">
        <div className="flex items-center gap-2 font-semibold mb-4 sm:mb-0">
            <LinkNestIcon className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">LinkNest</span>
        </div>
        <p className="text-muted-foreground text-sm">© {new Date().getFullYear()} LinkNest. All rights reserved.</p>
      </div>
    </footer>
  )
}

const features = [
    {
        icon: Users,
        title: "Seamless Room Creation",
        description: "Instantly create public or private rooms with unique codes. Gather your team, friends, or study group in seconds."
    },
    {
        icon: Video,
        title: "Synchronized Media Playback",
        description: "Watch YouTube videos together in perfect sync. The host controls playback for a shared viewing experience."
    },
    {
        icon: File,
        title: "Versatile File Sharing",
        description: "Share files of any size with options for both local (fast) and remote (torrent-based) transfers."
    },
    {
        icon: Mic,
        title: "Voice & Video Comms",
        description: "Use the walkie-talkie for quick push-to-talk voice messages or enable your camera for face-to-face interaction."
    }
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LandingNavbar />
      <main className="flex-1">
        <section className="container mx-auto flex flex-col items-center justify-center px-6 pt-32 pb-24 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
            Your Space. Your Sync.
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-muted-foreground md:text-xl">
            LinkNest is an all-in-one collaboration hub where you can create private rooms to share content, sync media, and communicate in real-time.
          </p>
          <div className="mt-8 flex gap-4">
            <Button asChild size="lg">
              <Link href="/signup">Get Started for Free</Link>
            </Button>
          </div>
        </section>

        <section id="features" className="container mx-auto px-6 py-24 bg-muted/50 rounded-t-3xl">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold tracking-tight">Everything You Need to Collaborate</h2>
                    <p className="mt-4 text-lg text-muted-foreground">All the tools you need to connect and share, in one place.</p>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                    {features.map((feature, index) => (
                        <Card key={index} className="bg-background/50">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <feature.icon className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-xl">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>

         <section className="container mx-auto px-6 py-24">
          <div className="text-center">
            <h2 className="text-4xl font-bold tracking-tight">Ready to Get Started?</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Create your first room in seconds. No credit card required.
            </p>
            <div className="mt-8">
              <Button asChild size="lg">
                <Link href="/signup">Sign Up Now</Link>
              </Button>
            </div>
          </div>
        </section>

      </main>
      <LandingFooter />
    </div>
  );
}
