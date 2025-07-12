
"use client";

import { LinkNestIcon } from "./icons";

export function AnimatedLogoLoader({ message }: { message?: string }) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background gap-6">
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
        }
        
        @keyframes draw-in {
            from {
                stroke-dashoffset: 252;
            }
            to {
                stroke-dashoffset: 0;
            }
        }

        .logo-container {
            animation: pulse 2.5s ease-in-out infinite;
        }

        .logo-svg-path {
          stroke-dasharray: 252;
          stroke-dashoffset: 252;
          animation: draw-in 2s ease-in-out forwards;
        }

        .text-container {
            opacity: 0;
            animation: fade-in-up 1s ease-out 1.5s forwards;
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <div className="logo-container">
         <LinkNestIcon className="h-20 w-20 text-primary logo-svg-path" />
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
