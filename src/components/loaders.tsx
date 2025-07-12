
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
        }
        
        .logo-svg {
          width: 100%;
          height: 100%;
          stroke: hsl(var(--primary));
          stroke-width: 1.5;
          fill: none;
        }

        .outer-ring, .inner-ring {
            stroke-dasharray: 252; /* Approximate circumference */
            stroke-dashoffset: 252;
            animation: draw-in 2s ease-in-out forwards;
        }
        
        .inner-ring {
            stroke-dasharray: 176; /* Approximate circumference */
            stroke-dashoffset: 176;
            animation-delay: 0.5s;
        }

        .arrow {
            fill: hsl(var(--primary));
            opacity: 0;
            animation: fade-and-pulse 2s ease-in-out 1.5s infinite;
        }

        @keyframes draw-in {
            to {
                stroke-dashoffset: 0;
            }
        }
        
        @keyframes fade-and-pulse {
            0%, 100% {
                opacity: 0.5;
                transform: scale(0.95);
            }
            50% {
                opacity: 1;
                transform: scale(1.05);
            }
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
         <svg className="logo-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="11.5" r="10" className="outer-ring" />
            <circle cx="12" cy="11.5" r="7" className="inner-ring" />
            <g className="arrow">
                <path d="M8.5 12.5l3-3 3 3" strokeWidth="0" />
                <path d="M11.5 15.5v-9" strokeWidth="0" />
            </g>
         </svg>
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
