"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

// ==========================================
// TYPES
// ==========================================
export interface CoinBalance {
  coinType: string;
  coinObjectCount: number;
  totalBalance: string;
  decimals?: number; // Accept asynchronously injected decimals from useBalances hook
  lockedBalance: { 
    epochId?: number; 
    number?: number; 
  };
}

interface CoinSelectorProps {
  balances: CoinBalance[];
  selectedCoinType: string;
  onSelectCoin: (coinType: string, totalBalanceRaw: number, decimals: number) => void;
}

// ==========================================
// UTILS
// ==========================================
const formatTicker = (type: string) => {
  if (type && type.includes("::")) {
    const parts = type.split("::");
    const rawSymbol = parts[parts.length - 1];
    return rawSymbol.toUpperCase().replace(/[>)]/g, "");
  }
  return "UNKNOWN";
};

// ==========================================
// COMPONENT
// ==========================================
export function CoinSelector({ balances, selectedCoinType, onSelectCoin }: CoinSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedCoin = balances.find((b) => b.coinType === selectedCoinType);
  const currentTicker = selectedCoin ? formatTicker(selectedCoin.coinType) : "Select Asset to Vest";

  return (
    <div className="flex flex-col gap-1.5 w-full relative">
      <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
        Asset
      </label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white border border-border text-foreground px-4 py-3 rounded-xl text-sm font-medium hover:border-primary/50 transition-all cursor-pointer shadow-sm"
      >
        <span>{currentTicker}</span>
        <ChevronDown className={`w-4 h-4 text-text-secondary transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+6px)] left-0 w-full bg-white border border-border rounded-xl shadow-xl z-50 overflow-hidden max-h-60 overflow-y-auto">
          {balances.length === 0 ? (
            <div className="px-4 py-3 text-xs text-text-secondary">
              No assets available in wallet
            </div>
          ) : (
            balances.map((coin) => {
              const ticker = formatTicker(coin.coinType);
              
              // Fallback directly to 0 if the query metadata is not yet resolved, preventing arbitrary data corruption
              const decimals = coin.decimals ?? 0;
              
              const humanBalance = (Number(coin.totalBalance) / Math.pow(10, decimals)).toLocaleString('en-US', {
                maximumFractionDigits: decimals,
              });

              return (
                <button
                  key={coin.coinType}
                  type="button"
                  onClick={() => {
                    onSelectCoin(coin.coinType, Number(coin.totalBalance), decimals);
                    setIsOpen(false);
                  }}
                  className={`w-full flex justify-between items-center px-4 py-3 text-sm text-left transition-colors cursor-pointer hover:bg-neutral-50 ${
                    selectedCoinType === coin.coinType ? "bg-neutral-50 font-semibold text-primary" : "text-foreground"
                  }`}
                >
                  <span className="font-medium">{ticker}</span>
                  <span className="text-xs text-text-secondary">
                    Available: {humanBalance}
                  </span>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
