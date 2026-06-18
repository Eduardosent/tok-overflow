"use client";

import { TokLoading } from "@/components/ui";
import { useCreatedCoins } from "@/hooks/queries";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Importa el router

export function MyTokens({ onSwitchToNew }: { onSwitchToNew: () => void }) {
  const { data: tokens, isPending } = useCreatedCoins();
  const router = useRouter(); // Inicializa el router

  if (isPending) {
    return (
      <TokLoading message="Loading your tokens..." />
    );
  }

  if (!tokens || tokens.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center gap-4">
        <p className="text-gray-500 font-medium">No tokens found.</p>
        <button 
          onClick={onSwitchToNew}
          className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-semibold hover:opacity-90"
        >
          Create your first token
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {tokens.map((token) => (
          <div 
            key={token.fullType} 
            className="aspect-square bg-white border border-gray-200 rounded-2xl p-3 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="relative w-full h-2/3 flex items-center justify-center">
              <Image 
                src="/logo1.png" 
                alt={token.symbol} 
                width={80} 
                height={80}
                className="object-contain"
              />
            </div>
            
            <div className="flex items-center justify-between gap-2 mt-2">
              <div className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold text-gray-700 uppercase truncate">
                {token.symbol}
              </div>
              <button 
                onClick={() => router.push(`/app/factory/${encodeURIComponent(token.fullType)}`)}
                className="px-3 py-1 text-[10px] font-bold border border-primary text-primary rounded-full hover:bg-primary hover:text-white transition-colors"
              >
                MANAGE
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}