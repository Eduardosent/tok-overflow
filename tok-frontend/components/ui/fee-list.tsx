"use client";

interface FeeItem {
  label: string;
  amount: bigint;
}

interface FeeListProps {
  feeList: FeeItem[];
}

export function FeeList({ feeList }: FeeListProps) {
  // Converts native BigInt MIST blockchain units safely to a human-readable SUI string
  const formatMistToSui = (mistAmount: bigint) => {
    const suiValue = Number(mistAmount) / 1_000_000_000;
    return suiValue.toLocaleString("en-US", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 9,
    });
  };

  return (
    <div className="space-y-3">
      {feeList.map((fee, index) => (
        <div key={`${fee.label}-${index}`} className="flex justify-between items-center text-sm">
          <span className="text-gray-600">{fee.label}</span>
          <div className="flex items-center gap-2 font-bold text-gray-900">
            <img src="/coins/sui-logo.svg" alt="SUI" className="w-4 h-4" />
            <span>{formatMistToSui(fee.amount)} SUI</span>
          </div>
        </div>
      ))}
    </div>
  );
}
