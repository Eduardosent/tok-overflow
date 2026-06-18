"use client";

import { use, useState, useMemo } from "react";
import { useTokenManager } from "@/hooks/modules/factory";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { TokLoading } from "@/components/ui";

// --- Internal Components ---

interface ActionSectionProps {
  title: string;
  amount: string;
  setAmount: (val: string) => void;
  actionFn: (amount: string) => void;
  symbol?: string;
  variant?: "primary" | "secondary";
}

function ActionSection({
  title,
  amount,
  setAmount,
  actionFn,
  symbol,
  variant = "primary",
}: ActionSectionProps) {
  // Disable if amount is 0 or less
  const isDisabled = Number(amount) <= 0;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
      <h2 className="font-bold text-gray-800">{title}</h2>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary"
      />
      <button
        onClick={() => actionFn(amount)}
        disabled={isDisabled}
        className={`w-full font-bold py-3 rounded-xl transition-all ${
          isDisabled
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : variant === "primary"
            ? "bg-primary text-white hover:opacity-90"
            : "bg-white border border-primary text-primary hover:bg-gray-50"
        }`}
      >
        {title} {symbol}
      </button>
    </div>
  );
}

// --- Main Page ---

export default function TokenManagementPage({
  params,
}: {
  params: Promise<{ fulltype: string }>;
}) {
  const { fulltype } = use(params);
  const decodedFullType = decodeURIComponent(fulltype);

  const { metadata, token, isLoading, mint, burn } = useTokenManager(decodedFullType);

  const [mintAmount, setMintAmount] = useState("1");
  const [burnAmount, setBurnAmount] = useState("1");
  const [imageError, setImageError] = useState(false);

  // Format supply based on token decimals
  const formattedSupply = useMemo(() => {
    if (!token?.totalSupply || metadata?.decimals === undefined) return "0";

    try {
      const supply = BigInt(token.totalSupply);
      const divisor = BigInt(10 ** metadata.decimals);

      return (Number(supply) / Number(divisor)).toLocaleString(undefined, {
        maximumFractionDigits: metadata.decimals,
      });
    } catch {
      return token.totalSupply;
    }
  }, [token?.totalSupply, metadata?.decimals]);

  if (isLoading) {
    return (
      <div className="flex justify-center p-10">
        <TokLoading message="Loading token details..." />
      </div>
    );
  }

  if (!token) {
    return <div className="p-8 text-center text-red-500">Token not found.</div>;
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
        <div className="flex justify-end">
          <a
            href={`https://testnet.suivision.xyz/coin/${decodedFullType}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-gray-500 hover:text-primary flex items-center gap-1"
          >
            View on Explorer <ExternalLink size={12} />
          </a>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center border border-gray-200">
            {!imageError && metadata?.iconUrl ? (
              <Image
                src={metadata.iconUrl}
                alt={metadata?.symbol || "token"}
                width={80}
                height={80}
                className="object-contain"
                onError={() => setImageError(true)}
              />
            ) : (
              <span className="text-[10px] text-gray-400 font-medium uppercase">
                Not Found
              </span>
            )}
          </div>

          <div className="flex-1 space-y-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 break-words">
              {metadata?.name}
            </h1>
            <p className="text-primary font-bold uppercase">{metadata?.symbol}</p>

            <div className="grid grid-cols-2 gap-4 text-sm mt-2">
              <div>
                <p className="text-gray-500">Decimals</p>
                <p className="font-bold">{metadata?.decimals}</p>
              </div>
              <div>
                <p className="text-gray-500">Supply</p>
                <p className="font-bold font-mono">{formattedSupply}</p>
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-2 italic break-words">
              {metadata?.description}
            </p>
          </div>
        </div>
      </div>

      {/* Mint Section */}
      <ActionSection
        title="Mint tokens"
        amount={mintAmount}
        setAmount={setMintAmount}
        actionFn={mint}
        symbol={metadata?.symbol}
        variant="primary"
      />

      {/* Burn Section */}
      <ActionSection
        title="Burn tokens"
        amount={burnAmount}
        setAmount={setBurnAmount}
        actionFn={burn}
        symbol={metadata?.symbol}
        variant="secondary"
      />
    </div>
  );
}