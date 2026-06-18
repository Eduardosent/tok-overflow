import { useSuiClient } from "@mysten/dapp-kit";
import { useQuery } from "@tanstack/react-query";

export async function fetchCoinDecimals(client: any, coinType: string): Promise<number | null> {
  const normalized = coinType.startsWith("0x") ? coinType : `0x${coinType}`;

  try {
    const metadata = await client.getCoinMetadata({ coinType: normalized });
    return metadata?.decimals ?? null;
  } catch (err) {
    console.error(`Error obteniendo decimals para ${normalized}:`, err);
    return null;
  }
}

export function useCoinDecimals(coinType: string | undefined) {
  const client = useSuiClient();

  return useQuery({
    queryKey: ["coin-decimals", coinType],
    queryFn: () => fetchCoinDecimals(client, coinType as string),
    enabled: !!coinType,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}