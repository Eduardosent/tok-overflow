"use client";

import { useVestingsReceived } from "@/hooks/queries";
import { VestingComponent } from "@/components/app/modules/vesting/received";
import { TokLoading } from "@/components/ui";

export default function ReceivedVestingPage() {
  // Destructure status and isFetching to prevent empty array race conditions during async looping
  const { data: vestings, isLoading, isFetching, status } = useVestingsReceived();

  // Show the loader while initially loading or during background data processing tasks
  if (isLoading || (isFetching && status === "pending")) {
    return (
      <div className="flex items-center justify-center h-64">
        <TokLoading />
      </div>
    );
  }

  // Double check that the query is completely settled before displaying the fallback view
  if (!vestings || vestings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-500 text-sm">No vesting schedules received yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto px-4">
      {/* Header section aligned with the centered layout bounds */}
      <div className="text-left sm:text-center md:text-left">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Received Vestings</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Track and claim your allocated tokens.
        </p>
      </div>

      {/* Balanced, tightly-spaced grid centered horizontally on all screen sizes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 justify-items-center">
        {vestings.map((vesting: any) => (
          <VestingComponent 
            key={vesting.data?.objectId || vesting.id || Math.random().toString()} 
            vesting={vesting} 
          />
        ))}
      </div>
    </div>
  );
}
