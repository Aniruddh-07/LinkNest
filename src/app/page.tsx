import { Button } from "@/components/ui/button";
import { LinkNestIcon } from "@/components/icons";
import Link from "next/link";
import Image from "next/image";

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
    <footer className="w-full bg-muted p-6 text-center">
      <div className="container mx-auto">
        <p className="text-muted-foreground">© {new Date().getFullYear()} LinkNest. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LandingNavbar />
      <main className="flex-1">
        <section className="container mx-auto flex flex-col items-center justify-center px-6 pt-32 pb-16 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
            Connect. Collaborate. Create.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            LinkNest is your all-in-one collaboration hub. Create rooms, share content, and work together in real-time, seamlessly.
          </p>
          <div className="mt-8 flex gap-4">
            <Button asChild size="lg">
              <Link href="/signup">Get Started for Free</Link>
            </Button>
          </div>
        </section>
        <section className="container mx-auto px-6 py-16">
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border bg-muted shadow-lg">
             <Image 
                src="https://placehold.co/1280x720.png" 
                alt="LinkNest app screenshot"
                layout="fill"
                objectFit="cover"
                className="brightness-90"
                data-ai-hint="collaboration software dashboard"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
