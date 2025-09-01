
import { CreateRoom } from "@/components/dashboard/create-room";
import { JoinRoom } from "@/components/dashboard/join-room";

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome to your Dashboard</h2>
          <p className="text-muted-foreground">
            Create a new room or join an existing one to start collaborating.
          </p>
        </div>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <CreateRoom />
        <JoinRoom />
      </div>
    </div>
  );
}
