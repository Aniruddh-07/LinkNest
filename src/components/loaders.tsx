import { LinkNestIcon } from "./icons";
import { Skeleton } from "./ui/skeleton";
import { Card, CardContent, CardHeader } from "./ui/card";

export function AnimatedLogoLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <style jsx>{`
        .icon-container {
          animation: bounce 2s infinite ease-in-out;
        }
        .text-container span {
          opacity: 0;
          animation: fadeIn 1s forwards;
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-20px);
          }
          60% {
            transform: translateY(-10px);
          }
        }
        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }
      `}</style>
      <div className="icon-container">
        <LinkNestIcon className="h-16 w-16 text-primary" />
      </div>
      <h1 className="text-2xl font-bold text-container tracking-widest">
        {"LinkNest".split("").map((char, index) => (
          <span key={index} style={{ animationDelay: `${0.1 * index}s` }}>{char}</span>
        ))}
      </h1>
    </div>
  );
}

export function DashboardSkeleton() {
    return (
        <div className="flex min-h-screen w-full bg-muted/40">
            {/* Sidebar Skeleton */}
            <aside className="hidden w-64 flex-col border-r bg-background sm:flex p-4 space-y-4">
                <div className="flex h-[60px] items-center border-b px-2">
                    <Skeleton className="h-8 w-8 rounded-full mr-2" />
                    <Skeleton className="h-6 w-24" />
                </div>
                <div className="flex-1 space-y-2 px-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-4 w-20 mt-4 mb-2" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </div>
                 <div className="mt-auto p-2">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-1">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-32" />
                        </div>
                    </div>
                </div>
            </aside>
            {/* Main Content Skeleton */}
            <main className="flex flex-1 flex-col p-4 sm:p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-4 w-80 mt-2" />
                    </div>
                    <Skeleton className="h-10 w-24" />
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 flex-1">
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-3/4" />
                             <Skeleton className="h-4 w-1/2 mt-2" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-10 w-full" />
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-3/4" />
                             <Skeleton className="h-4 w-1/2 mt-2" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-10 w-full" />
                        </CardContent>
                    </Card>
                    <div className="lg:col-span-3">
                         <Skeleton className="h-48 w-full" />
                    </div>
                </div>
            </main>
        </div>
    );
}