"use client";

import { useBalances } from "@/hooks/queries";
import { VestingForm } from "@/components/forms/vesting-form";

interface CoinBalance {
  coinType: string;
  coinObjectCount: number;
  totalBalance: string;
  lockedBalance: { epochId?: number; number?: number };
}

export default function NewVestingPage() {
  const { data: rawBalances, isLoading } = useBalances();
  const walletBalances = rawBalances as CoinBalance[] | undefined;

  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-12 text-sm font-medium text-text-secondary">
        Fetching token asset dimensions...
      </div>
    );
  }

  return (
    <div className="w-full">
        {/* Inyección del formulario modularizado */}
        <VestingForm walletBalances={walletBalances ?? []} />
    </div>
  );
}