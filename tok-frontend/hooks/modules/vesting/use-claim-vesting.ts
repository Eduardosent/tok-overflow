import { useSuiClient, useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { TokSDK } from "@/sdk";
import { toast } from "sonner";
import { calculateTotal, FEES } from "@/constants";
import { useBalances } from "@/hooks/queries";
import { useQueryClient } from "@tanstack/react-query";

export function useClaimVesting() {
  const account = useCurrentAccount();
  const queryClient = useQueryClient();
  const { mist } = useBalances();
  const { mutate: signTransaction } = useSignAndExecuteTransaction();

  const claimVesting = async (vestingId: string, coinType: string = "0x2::sui::SUI") => {
    if (!account) throw new Error("Connect your wallet");

    // Check if user has enough balance to cover the claim fee
    if (BigInt(mist) < calculateTotal(FEES.VESTING.CLAIM)) {
      throw new Error("Insufficient balance for the transaction");
    }

    const sdk = new TokSDK();

    // Prepare the claim transaction via the SDK
    const tx = await sdk.vesting.claim({
      sender: account.address,
      coinType: coinType,
      vestingId: vestingId,
    });

    signTransaction(
      { transaction: tx },
      {
        onSuccess: (result) => {
            // Invalidate queries to update the created/received lists
            queryClient.invalidateQueries({ queryKey: ["received-vestings"] });
          const explorerUrl = `https://testnet.suivision.xyz/txblock/${result.digest}`;
          toast.success("Claim successful", {
            description: "The vested tokens have been claimed to your wallet.",
            action: {
              label: "View on Explorer",
              onClick: () => window.open(explorerUrl, "_blank"),
            },
          });
        },
        onError: (err) => {
          toast.error("Failed to claim tokens: " + err.message);
        },
      }
    );
  };

  return { claimVesting };
}