import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TokSDK } from "@/sdk";
import { fetchCoinDecimals } from "./use-coin-decimals";

export function useVestingsReceived() {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const queryClient = useQueryClient();
  const sdk = new TokSDK();

  const ownerAddress = account?.address;

  return useQuery({
    queryKey: ["received-vestings", ownerAddress],
    queryFn: async () => {
      if (!ownerAddress) {
        return [];
      }

      const vestings = await sdk.vesting.getVestingsByOwner(client, ownerAddress);

      for (const vesting of vestings) {
        const coinType = vesting.content?.fields?.balance?.type;
        if (coinType) {
          const decimals = await queryClient.fetchQuery({
            queryKey: ["coin-decimals", coinType],
            queryFn: () => fetchCoinDecimals(client, coinType),
            staleTime: Infinity,
          });
          vesting.decimals = decimals ?? 0;
        }
      }

      return vestings;
    },
    enabled: !!ownerAddress,
  });
}