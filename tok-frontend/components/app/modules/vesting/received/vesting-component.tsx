"use client";

import { useState, useEffect } from "react";

interface VestingComponentProps {
  vesting: any;
}

const formatAmount = (amount: string, decimals: number) => {
  const num = Number(amount) / Math.pow(10, decimals);
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
};

const formatTimeLeft = (ms: number) => {
  if (ms <= 0) return "Now";
  const seconds = Math.floor(ms / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remSeconds = seconds % 60;

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${remSeconds}s`;
  return `${remSeconds}s`;
};

const getSymbol = (typeString: string) => {
  if (!typeString || typeof typeString !== "string") return "COIN";
  const match = typeString.match(/<([^>]+)>/);
  const targetPath = match ? match[1] : typeString;
  const parts = targetPath.split("::");
  const rawSymbol = parts[parts.length - 1];
  return rawSymbol.replace(/[>)]/g, "").toUpperCase();
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Available":
      return "text-green-600 bg-green-50 border-green-200";
    case "In Cliff":
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    default:
      return "text-gray-500 bg-gray-50 border-gray-200";
  }
};

export function VestingComponent({ vesting }: VestingComponentProps) {
  // Local ticker state to manage live clock ticks independently per card
  const [timeNow, setTimeNow] = useState<number>(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeNow(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fields = vesting.content?.fields || vesting.data?.content?.fields;
  if (!fields) return null;

  const rawBalance = fields.balance?.fields?.value || fields.balance?.fields?.balance || fields.balance || 0;
  const balance = Number(rawBalance);
  
  const total = Number(fields.total_amount); 
  const startTime = Number(fields.start_time); 
  const cliffTime = Number(fields.cliff_time || 0);
  const releaseAmount = Number(fields.release_amount);
  const releasePeriod = Number(fields.release_period); 
  
  const objectType = vesting.type || vesting.content?.type || vesting.data?.type || "";
  const decimals = vesting.decimals || 9;
  const symbol = getSymbol(objectType);

  const cliffEnd = startTime + cliffTime;
  const totalClaimed = Math.max(0, total - balance); 

  let status: string;
  let actionText: string = "";
  let availableToClaim = 0;

  if (timeNow < cliffEnd) {
    status = "In Cliff";
    const timeLeft = cliffEnd - timeNow;
    actionText = `Unlocks in ${formatTimeLeft(timeLeft)}`;
  } else {
    const timeSinceCliff = Math.max(0, timeNow - cliffEnd);
    const completedPeriods = releasePeriod > 0 ? Math.floor(timeSinceCliff / releasePeriod) : 0;
    const totalPeriodsUnlocked = completedPeriods + 1; 
    
    const totalUnlockedAmount = Math.min(totalPeriodsUnlocked * releaseAmount, total);
    availableToClaim = Math.max(0, totalUnlockedAmount - totalClaimed);
    availableToClaim = Math.min(availableToClaim, balance);

    if (availableToClaim > 0) {
      status = "Available";
    } else {
      status = "Waiting";
      const nextReleaseTime = cliffEnd + (totalPeriodsUnlocked * releasePeriod);
      const timeLeft = nextReleaseTime - timeNow;

      actionText = timeLeft > 0 
        ? `Next unlock in ${formatTimeLeft(timeLeft)}` 
        : "Awaiting next period";
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm w-full max-w-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div>
          <h3 className="text-sm font-bold text-gray-900">{symbol} Vesting</h3>
          <p className="text-[10px] text-gray-400 font-mono mt-0.5 truncate max-w-[160px]">
            {vesting.data?.objectId || fields.id?.id}
          </p>
        </div>
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${getStatusColor(status)}`}>
          {status}
        </span>
      </div>

      <div className="py-3 border-b border-gray-50 text-xs">
        <p className="text-gray-400 text-[11px]">Total Claimed</p>
        <p className="font-semibold text-gray-800 mt-0.5 text-sm">
          {formatAmount(String(totalClaimed), decimals)} <span className="text-gray-400 font-normal">/</span> {formatAmount(String(total), decimals)} <span className="text-gray-500 font-medium text-xs">{symbol}</span>
        </p>
      </div>

      <div className="pt-3 flex items-center justify-between gap-2 min-h-[36px]">
        {status === "Available" ? (
          <>
            <span className="text-[11px] text-green-600 font-medium">
              {formatAmount(String(availableToClaim), decimals)} {symbol} ready
            </span>
            <button className="text-xs font-semibold px-4 py-2 rounded-lg bg-primary text-white hover:opacity-90 transition-opacity shadow-sm">
              Claim {formatAmount(String(availableToClaim), decimals)} {symbol}
            </button>
          </>
        ) : (
          <>
            <span className="text-[11px] text-gray-500 font-medium font-mono">
              {actionText}
            </span>
            <button
              disabled
              className="text-xs font-semibold px-4 py-2 rounded-lg bg-gray-50 text-gray-400 border border-gray-100 cursor-not-allowed"
            >
              Locked
            </button>
          </>
        )}
      </div>
    </div>
  );
}
