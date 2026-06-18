import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TokSDK } from "@/sdk";
import { VestingCreatedEvent } from "@/types/events";
import { fetchCoinDecimals } from "./use-coin-decimals";

export function useVestingsCreated() {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const queryClient = useQueryClient();
  const sdk = new TokSDK();

  const recipientAddress = account?.address;

  return useQuery({
    queryKey: ["vestings-created", recipientAddress],
    queryFn: async (): Promise<VestingCreatedEvent[]> => {
      if (!recipientAddress) {
        return [];
      }

      const events = await sdk.vesting.getVestingsByRecipient(client, recipientAddress);

      for (const event of events) {
        const coinType = event.coin_type.name;

        const decimals = await queryClient.fetchQuery({
          queryKey: ["coin-decimals", coinType],
          queryFn: () => fetchCoinDecimals(client, coinType),
          staleTime: Infinity,
        });

        event.decimals = decimals ?? 0;
      }

      return events;
    },
    enabled: !!recipientAddress,
  });
}