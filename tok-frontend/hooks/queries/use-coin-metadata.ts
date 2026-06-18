import { useSuiClient } from "@mysten/dapp-kit";
import { useQuery } from "@tanstack/react-query";

export async function fetchCoinMetadata(client: any, coinType: string) {
  const metadata = await client.getCoinMetadata({ coinType });
  return metadata;
}

export function useCoinMetadata(coinType: string | undefined) {
  const client = useSuiClient();

  return useQuery({
    queryKey: ["coin-metadata", coinType],
    queryFn: () => {
      if (!coinType) throw new Error("Coin type is required");
      return fetchCoinMetadata(client, coinType);
    },
    enabled: !!coinType,
    staleTime: Infinity,
  });
}