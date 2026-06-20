"use client";

import { useState } from "react";
import { useVestingsReceived } from "@/hooks/queries";
import { VestingComponent, VestingClaimModal } from "@/components/app/modules/vesting/received";
import { TokLoading } from "@/components/ui";
import { useClaimVesting } from "@/hooks/modules/vesting";

export default function ReceivedVestingPage() {
  const { data: vestings, isLoading, isFetching, status } = useVestingsReceived();
  const { claimVesting } = useClaimVesting();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVesting, setSelectedVesting] = useState<{ id: string; coinType: string } | null>(null);

  // Helper to extract T from Vesting<T>
  const extractCoinType = (typeString: string) => {
    const match = typeString.match(/Vesting<(.+)>/);
    return match ? match[1] : typeString;
  };

  const handleOpenClaimModal = (vestingId: string, coinType: string) => {
    setSelectedVesting({ id: vestingId, coinType });
    setIsModalOpen(true);
  };

  const handleConfirmClaim = async () => {
    if (!selectedVesting) return;

    console.log(selectedVesting.id, selectedVesting.coinType);
    
    await claimVesting(selectedVesting.id, selectedVesting.coinType);
    
    setIsModalOpen(false);
    setSelectedVesting(null);
  };

  if (isLoading || (isFetching && status === "pending")) {
    return (
      <div className="flex items-center justify-center h-64">
        <TokLoading />
      </div>
    );
  }

  if (!vestings || vestings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-500 text-sm">No vesting schedules received yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto px-4">
      <div className="text-left sm:text-center md:text-left">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Received Vestings</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Track and claim your allocated tokens.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 justify-items-center">
        {vestings.map((vesting: any) => {
          // Robust ID extraction from various possible response structures
          const vestingId = 
            vesting.data?.objectId || 
            vesting.objectId || 
            vesting.id || 
            (vesting.data?.fields?.id as any)?.id;
            
          const rawType = vesting.type || vesting.content?.type || vesting.data?.type || "";
          const coinType = extractCoinType(rawType);

          return (
            <VestingComponent 
              key={vestingId || Math.random().toString()} 
              vesting={vesting}
              onClaim={() => handleOpenClaimModal(vestingId, coinType)}
            />
          );
        })}
      </div>

      <VestingClaimModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmClaim}
      />
    </div>
  );
}