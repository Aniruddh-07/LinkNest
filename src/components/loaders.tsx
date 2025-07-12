
"use client";

import { LinkNestIcon } from "./icons";
import { Skeleton } from "./ui/skeleton";
import { Card, CardContent, CardHeader } from "./ui/card";

export function AnimatedLogoLoader({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <style jsx>{`
        .icon-container {
          animation: pop-in 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .text-container {
            opacity: 0;
            animation: fade-in-up 0.8s ease-out 0.5s forwards;
        }
        @keyframes pop-in {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <div className="icon-container">
        <LinkNestIcon className="h-16 w-16 text-primary" />
      </div>
      <div className="text-container text-center">
        <h1 className="text-2xl font-bold tracking-widest">
            LinkNest
        </h1>
        {message && <p className="text-muted-foreground mt-2">{message}</p>}
      </div>
    </div>
  );
}


export function DashboardSkeleton() {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-muted/40">
            <AnimatedLogoLoader message="Loading your dashboard..." />
        </div>
    );
}
