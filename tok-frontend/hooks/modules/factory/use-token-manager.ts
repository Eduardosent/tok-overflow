import { calculateTotal, FEES } from "@/constants";
import { useBalances, useCreatedCoins } from "@/hooks/queries";
import {
  useSuiClient,
  useSuiClientQuery,
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useTokenManager = (fullType: string) => {
  const queryClient = useQueryClient();
  const client = useSuiClient();
  const account = useCurrentAccount();
  const { mist } = useBalances();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const { data: allTokens, isLoading: isLoadingTokens } = useCreatedCoins();
  const token = allTokens?.find((t) => t.fullType === fullType);

  const { data: metadata, isLoading: isLoadingMetadata } = useSuiClientQuery(
    "getCoinMetadata",
    {
      coinType: fullType,
    }
  );

  const getRawAmount = (amount: string) => {
    const decimals = metadata?.decimals || 0;
    return BigInt(amount) * BigInt(10 ** decimals);
  };

  const refreshData = async (digest: string) => {
    toast.loading("Esperando confirmación de la red...");

    try {
      await client.waitForTransaction({
        digest,
        timeout: 10000,
      });

      await queryClient.invalidateQueries({ queryKey: ["created-coins"] });
      toast.dismiss();
    } catch (e) {
      console.error("Error esperando transacción:", e);
      toast.dismiss();
    }
  };

  const mint = (amount: string) => {
    if (!account || !token?.treasuryCap) {
      toast.error("Wallet not connected or TreasuryCap not found");
      return;
    }

    if (BigInt(mist) < calculateTotal(FEES.FACTORY.TOKEN_MINT)) {
      throw new Error("Insufficient balance for the transaction");
    }

    const tx = new Transaction();
    const amountBigInt = getRawAmount(amount);

    tx.moveCall({
      target: "0x2::coin::mint_and_transfer",
      typeArguments: [fullType],
      arguments: [
        tx.object(token.treasuryCap),
        tx.pure.u64(amountBigInt),
        tx.pure.address(account.address),
      ],
    });

    toast.loading("Minting tokens...");
    console.log(tx)

    signAndExecute(
      { transaction: tx },
      {
        onSuccess: async (result) => {
          await refreshData(result.digest);

          toast.success("Mint successful!", {
            action: {
              label: "Explorer",
              onClick: () =>
                window.open(
                  `https://suivision.xyz/txblock/${result.digest}`,
                  "_blank"
                ),
            },
          });
        },
        onError: (err) => {
          toast.dismiss();
          toast.error("Mint failed: " + err.message);
        },
      }
    );
  };

  const burn = async (amount: string) => {
    if (!account || !token?.treasuryCap) {
      toast.error("Wallet not connected or TreasuryCap not found");
      return;
    }
    
    if (BigInt(mist) < calculateTotal(FEES.FACTORY.TOKEN_BURN)) {
      throw new Error("Insufficient balance for the transaction");
    }

    const amountBigInt = getRawAmount(amount);

    const coins = await client.getCoins({
      owner: account.address,
      coinType: fullType,
    });

    const coin = coins.data.find((c) => BigInt(c.balance) >= amountBigInt);

    if (!coin) {
      toast.error("Not enough token balance to burn");
      return;
    }

    const tx = new Transaction();

    const [coinToBurn] = tx.splitCoins(tx.object(coin.coinObjectId), [
      tx.pure.u64(amountBigInt),
    ]);

    tx.moveCall({
      target: "0x2::coin::burn",
      typeArguments: [fullType],
      arguments: [tx.object(token.treasuryCap), coinToBurn],
    });

    toast.loading("Burning tokens...");

    signAndExecute(
      { transaction: tx },
      {
        onSuccess: async (result) => {
          console.log(result.digest)
          await refreshData(result.digest);

          toast.success("Burn successful!", {
            action: {
              label: "Explorer",
              onClick: () =>
                window.open(
                  `https://suivision.xyz/txblock/${result.digest}`,
                  "_blank"
                ),
            },
          });
        },
        onError: (err) => {
          console.log(err)
          toast.dismiss();
          toast.error("Burn failed: " + err.message);
        },
      }
    );
  };

  return {
    metadata,
    token,
    isLoading: isLoadingTokens || isLoadingMetadata,
    mint,
    burn,
  };
};