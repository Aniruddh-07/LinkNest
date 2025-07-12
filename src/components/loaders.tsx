
"use client";

import { LinkNestIcon } from "./icons";
import { Skeleton } from "./ui/skeleton";
import { Card, CardContent, CardHeader } from "./ui/card";

export function AnimatedLogoLoader({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <style jsx>{`
        .logo-container {
          position: relative;
          width: 80px;
          height: 80px;
          transform-style: preserve-3d;
          animation: spin-base 8s linear infinite;
        }
        
        .logo-part {
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .base-ring, .outer-ring {
          stroke: hsl(var(--primary));
          stroke-width: 1.5;
          fill: none;
        }
        
        .outer-ring {
          animation: scale-pulse 4s ease-in-out infinite;
        }

        .inner-arrow {
            fill: hsl(var(--primary));
            animation: bounce 2s ease-in-out infinite;
        }

        .center-dot {
            fill: hsl(var(--primary));
            animation: dot-pulse 2s ease-in-out infinite;
        }
        
        @keyframes spin-base {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes scale-pulse {
          0%, 100% { transform: scale(0.95); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
        }

        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
        }
        
        @keyframes dot-pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.3); }
        }

        .text-container {
            opacity: 0;
            animation: fade-in-up 1s ease-out 0.2s forwards;
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
          <div className="logo-part">
               <svg viewBox="0 0 24 24" width="80" height="80" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 11.5a10 10 0 1 0 20 0 10 10 0 1 0-20 0" className="outer-ring" />
                  <path d="M5 11.5a7 7 0 1 0 14 0 7 7 0 1 0-14 0" className="base-ring" />
                  <path d="M8.5 12.5l3-3 3 3" className="inner-arrow" />
                  <circle cx="12" cy="15.5" r="1" className="center-dot" />
               </svg>
          </div>
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
