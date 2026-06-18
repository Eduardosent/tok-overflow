import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";

export function useCreatedCoins() {
  const account = useCurrentAccount();
  const client = useSuiClient();

  const query = useQuery({
    queryKey: ["created-coins", account?.address],
    enabled: Boolean(account?.address),
    queryFn: async () => {
      const result = await client.getOwnedObjects({
        owner: account!.address,
        filter: {
          MatchAny: [
            { StructType: "0x2::coin::TreasuryCap" },
            { StructType: "0x2::coin_registry::MetadataCap" },
          ],
        },
        options: {
          showType: true,
          showContent: true,
        },
      });
      return result;
    },
  });

  const groupedCoins = useMemo(() => {
    if (!query.data?.data) return [];

    const map = new Map();

    query.data.data.forEach((item) => {
      const type = item.data?.type || "";
      const match = type.match(/<(.+)>/);
      if (!match) return;

      const fullType = match[1];
      const parts = fullType.split("::");
      const symbol = parts[parts.length - 1].toLowerCase();

      if (!map.has(fullType)) {
        map.set(fullType, {
          fullType,
          symbol,
          treasuryCap: null,
          metadataCap: null,
          totalSupply: null, // Inicializamos aquí
          hasTreasury: false,
          hasMetadata: false,
        });
      }

      const entry = map.get(fullType);

      if (type.includes("TreasuryCap")) {
        entry.treasuryCap = item.data?.objectId;
        entry.hasTreasury = true;
        
        // Extracción del total_supply desde el content fields
        const content = item.data?.content as any;
        if (content?.fields?.total_supply?.fields?.value) {
          entry.totalSupply = content.fields.total_supply.fields.value;
        }
      } else if (type.includes("MetadataCap")) {
        entry.metadataCap = item.data?.objectId;
        entry.hasMetadata = true;
      }
    });

    return Array.from(map.values());
  }, [query.data]);

  return { 
    ...query, 
    data: groupedCoins 
  };
}