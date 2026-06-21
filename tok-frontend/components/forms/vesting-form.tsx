"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, CoinSelector } from "@/components/forms/inputs"; 
import { createVestingSchema, type VestingValues } from "@/types/forms/vesting";
import { useCreateVesting } from "@/hooks/modules/vesting";
import { VestingCreationModal } from "@/components/app/modules/vesting/sent";

interface CoinBalance {
  coinType: string;
  coinObjectCount: number;
  totalBalance: string;
  lockedBalance: { epochId?: number; number?: number };
}

interface VestingFormProps {
  walletBalances: CoinBalance[];
}

const formatTicker = (type: string) => {
  if (type && type.includes("::")) {
    const parts = type.split("::");
    return parts[parts.length - 1].toUpperCase();
  }
  return "UNKNOWN";
};

const formatMsToReadable = (ms: number | undefined) => {
  if (ms === undefined || ms === null || isNaN(ms) || ms <= 0) return "";
  
  const seconds = ms / 1000;
  if (seconds < 60) return `(${Number(seconds.toFixed(2))}s)`;
  
  const minutes = seconds / 60;
  if (minutes < 60) return `(${Number(minutes.toFixed(2))}m)`;
  
  const hours = minutes / 60;
  if (hours < 24) return `(${Number(hours.toFixed(2))}h)`;
  
  const days = hours / 24;
  return `(${Number(days.toFixed(2))}d)`;
};

const formatMsToShortText = (ms: number | undefined) => {
  if (ms === undefined || ms === null || isNaN(ms) || ms <= 0) return "0s";
  const seconds = ms / 1000;
  if (seconds < 60) return `${Number(seconds.toFixed(1))}s`;
  const minutes = seconds / 60;
  if (minutes < 60) return `${Number(seconds.toFixed(1))}m`;
  const hours = minutes / 60;
  if (hours < 24) return `${Number(seconds.toFixed(1))}h`;
  const days = hours / 24;
  return `${Number(days.toFixed(1))} days`;
};

export function VestingForm({ walletBalances }: VestingFormProps) {
  const { createVesting } = useCreateVesting();
  const [selectedCoin, setSelectedCoin] = useState<string>("");
  const [currentMaxBalance, setCurrentMaxBalance] = useState<number>(0);
  const [currentDecimals, setCurrentDecimals] = useState<number>(9);
  
  // State for modal visibility and form data persistence
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingData, setPendingData] = useState<VestingValues | null>(null);

  useEffect(() => {
    if (walletBalances.length > 0 && !selectedCoin) {
      const suiMatch = walletBalances.find((b) => b.coinType === "0x2::sui::SUI");
      const fallback = suiMatch || walletBalances[0];
      
      setSelectedCoin(fallback.coinType);
      setCurrentMaxBalance(Number(fallback.totalBalance));
      setCurrentDecimals(fallback.coinType === "0x2::sui::SUI" ? 9 : 6);
    }
  }, [walletBalances, selectedCoin]);

  const currentSchema = createVestingSchema({
    maxBalanceRaw: currentMaxBalance,
    decimals: currentDecimals,
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VestingValues>({
    resolver: zodResolver(currentSchema) as any,
    defaultValues: {
      cliffTime: 0,
      releasePeriod: 1000,
    },
  });

  const watchDeposit = watch("depositAmount");
  const watchRelease = watch("releaseAmount");
  const watchCliffTime = watch("cliffTime");
  const watchReleasePeriod = watch("releasePeriod");
  const watchRecipient = watch("recipient");

  const isReleaseDisabled = !watchDeposit || watchDeposit <= 0;

  const handleCoinSelection = (type: string, maxBalance: number, decs: number) => {
    setSelectedCoin(type);
    setCurrentMaxBalance(maxBalance);
    setCurrentDecimals(decs);
    reset({
      depositAmount: undefined,
      releaseAmount: undefined,
      cliffTime: 0,
      releasePeriod: 1000,
      recipient: "",
    });
  };

  const currentTicker = formatTicker(selectedCoin);

  const renderRawIntegerEquivalent = (humanValue: number | undefined) => {
    if (!humanValue || isNaN(humanValue)) return null;
    const tokenEquivalent = humanValue / Math.pow(10, currentDecimals);
    
    return (
      <span className="text-[11px] text-[#00aeef] font-mono block mt-1">
        = {tokenEquivalent.toLocaleString('en-US', { minimumFractionDigits: currentDecimals, maximumFractionDigits: currentDecimals })} {currentTicker}
      </span>
    );
  };

  // Intercept submission to open modal instead of executing transaction directly
  const onFormSubmit = (data: VestingValues) => {
    setPendingData(data);
    setIsModalOpen(true);
  };

  // Transaction execution triggered from the modal
  const handleConfirmVesting = async () => {
    if (!pendingData) return;
    
    await createVesting(
      selectedCoin,
      {
        depositAmount: pendingData.depositAmount,
        releaseAmount: pendingData.releaseAmount,
        cliffTime: pendingData.cliffTime,
        releasePeriod: pendingData.releasePeriod,
        recipient: pendingData.recipient,
      }
    );
    
    setIsModalOpen(false);
    setPendingData(null);
  };

  return (
    <>
      <form 
        onSubmit={handleSubmit(onFormSubmit)} 
        className="flex flex-col gap-6 w-full max-w-xl mx-auto p-8 bg-white rounded-2xl border border-gray-100 shadow-sm"
      >
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-gray-900">Create Vesting Account</h2>
          <p className="text-sm text-gray-500">Configure the linear streaming and lockups parameters for your asset.</p>
        </div>

        {/* Custom Coin Selector component */}
        <CoinSelector
          balances={walletBalances}
          selectedCoinType={selectedCoin}
          onSelectCoin={handleCoinSelection}
        />

        {/* Deposit amount input field */}
        <div className="relative w-full">
          <div className="relative flex flex-col">
            <Input
              label="Amount to Deposit"
              type="number"
              step="any"
              placeholder="0.00"
              {...register("depositAmount", { valueAsNumber: true })}
              error={errors.depositAmount?.message}
            />
            {selectedCoin && (
              <span className="absolute right-4 bottom-[12px] text-xs font-bold text-gray-500 bg-white pl-2">
                {currentTicker}
              </span>
            )}
          </div>
          {renderRawIntegerEquivalent(watchDeposit)}
        </div>

        {/* Cliff Duration input configuration */}
        <div className="relative w-full">
          <div className="relative flex flex-col">
            <Input
              label="Cliff Duration (ms)"
              type="number"
              placeholder="0 for instant streaming unlock parameters"
              {...register("cliffTime", { valueAsNumber: true })}
              error={errors.cliffTime?.message}
            />
            {watchCliffTime > 0 && (
              <span className="absolute right-4 bottom-[12px] text-xs font-mono text-[#00aeef] bg-white pl-2">
                {formatMsToReadable(watchCliffTime)}
              </span>
            )}
          </div>
        </div>

        {/* Responsive distribution block */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col relative">
            <div className="relative flex items-end w-full">
              <Input
                label={`Tokens per Release (${currentTicker})`}
                type="number"
                step="any"
                placeholder={isReleaseDisabled ? "Set deposit first" : "0.00"}
                disabled={isReleaseDisabled}
                {...register("releaseAmount", { valueAsNumber: true })}
                error={errors.releaseAmount?.message}
              />
            </div>
            {!isReleaseDisabled && renderRawIntegerEquivalent(watchRelease)}
          </div>

          <div className="relative w-full">
            <div className="relative flex flex-col">
              <Input
                label="Period Interval (ms)"
                type="number"
                placeholder="e.g. 1000 for 1 second"
                {...register("releasePeriod", { valueAsNumber: true })}
                error={errors.releasePeriod?.message}
              />
              {watchReleasePeriod > 0 && (
                <span className="absolute right-4 bottom-[12px] text-xs font-mono text-[#00aeef] bg-white pl-2">
                  {formatMsToReadable(watchReleasePeriod)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Recipient address input */}
        <Input
          label="Recipient Address"
          placeholder="0x..."
          {...register("recipient")}
          error={errors.recipient?.message}
        />

        {/* Strategy summary block */}
        {watchDeposit > 0 && (
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5 flex flex-col gap-2 text-[11px] font-mono text-gray-600 shadow-sm">
            <div className="flex justify-between items-center border-b border-gray-200/50 pb-1.5 mb-1">
              <span className="font-bold text-gray-400 uppercase tracking-wider text-[9px]">Vesting Strategy Overview</span>
              <span className="text-[#00aeef] font-bold">
                {(watchDeposit / Math.pow(10, currentDecimals)).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: currentDecimals })} {currentTicker}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              <div>
                <span className="text-gray-400 block text-[9px] uppercase tracking-tight">Start Date</span>
                <span className="text-gray-800 font-medium">Now (Deployment Epoch)</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[9px] uppercase tracking-tight">Cliff Duration</span>
                <span className="text-gray-800 font-medium">{watchCliffTime > 0 ? formatMsToShortText(watchCliffTime) : "None (Instant)"}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[9px] uppercase tracking-tight">Release Distribution</span>
                <span className="text-gray-800 font-medium">
                  {watchRelease > 0 ? `${(watchRelease / Math.pow(10, currentDecimals)).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: currentDecimals })} ${currentTicker}` : "0.00"} / {formatMsToShortText(watchReleasePeriod)}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block text-[9px] uppercase tracking-tight">Recipient</span>
                <span className="text-gray-800 font-medium block truncate max-w-[140px]" title={watchRecipient || "Not defined"}>
                  {watchRecipient ? `${watchRecipient.slice(0, 6)}...${watchRecipient.slice(-4)}` : "—"}
                </span>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="cursor-pointer w-full bg-[#00aeef] text-white py-4 rounded-xl font-bold hover:opacity-90 transition-all mt-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
        >
          {isSubmitting ? "Deploying Logics..." : "Deploy Vesting Account"}
        </button>
      </form>

      {/* Confirmation modal component */}
      <VestingCreationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmVesting}
      />
    </>
  );
}