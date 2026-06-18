"use client";

import { useSuiClient, useCurrentAccount } from "@mysten/dapp-kit";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCoinDecimals } from "./use-coin-decimals";

export function useBalances() {
  const suiClient = useSuiClient();
  const account = useCurrentAccount();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["balances", account?.address],
    queryFn: async () => {
      if (!account) return [];
      
      // Fetch raw balances from RPC instantly without blocking metadata resolution
      const balances = await suiClient.getAllBalances({ owner: account.address });

      // Append decimals asynchronously using the global TanStack Query cache
      const balancesWithDecimals = await Promise.all(
        balances.map(async (coin) => {
          // Hardcode SUI decimals to prevent redundant RPC roundtrips
          if (coin.coinType === "0x2::sui::SUI") {
            return { ...coin, decimals: 9 };
          }

          try {
            const decimals = await queryClient.fetchQuery({
              queryKey: ["coin-decimals", coin.coinType],
              queryFn: () => fetchCoinDecimals(suiClient, coin.coinType),
              staleTime: Infinity,
            });
            // Fallback to 0 if RPC metadata resolution returns null to prevent form data corruption
            return { ...coin, decimals: decimals ?? 0 };
          } catch (error) {
            console.error(`Error resolving decimals for ${coin.coinType}:`, error);
            return { ...coin, decimals: 0 };
          }
        })
      );

      return balancesWithDecimals;
    },
    enabled: !!account,
  });

  const suiBalance = query.data?.find((c) => c.coinType === "0x2::sui::SUI")?.totalBalance ?? "0";
  const mist = Number(suiBalance);

  return {
    ...query,
    mist,
    sui: mist / 1_000_000_000,
  };
}
