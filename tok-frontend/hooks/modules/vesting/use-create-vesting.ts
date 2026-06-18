import { useSuiClient, useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { TokSDK } from "@/sdk";
import { toast } from "sonner";
import { calculateTotal, FEES } from "@/constants";
import { useBalances } from "@/hooks/queries";

export function useCreateVesting() {
    const client = useSuiClient();
    const account = useCurrentAccount();
    const { mist } = useBalances();
    const { mutate: signTransaction } = useSignAndExecuteTransaction();

    const createVesting = async (
        coinType: string,
        formData: {
            depositAmount: number;
            releaseAmount: number;
            cliffTime: number;
            releasePeriod: number;
            recipient: string;
        }
    ) => {
        if (!account) throw new Error("Connect your wallet");

        if (BigInt(mist) < calculateTotal(FEES.VESTING.CREATE)) {
          throw new Error("Insufficient balance for the transaction");
        }

        const sdk = new TokSDK();

        // El form ya convirtió a RAW. Yo no toco nada.
        const tx = await sdk.vesting.createVesting(client, {
            sender: account.address,
            coinType: coinType,
            amount: formData.depositAmount,
            cliffTime: formData.cliffTime,
            releaseAmount: formData.releaseAmount,
            releasePeriod: formData.releasePeriod,
            recipient: formData.recipient,
        });

        signTransaction({ transaction: tx }, {
            onSuccess: (result) => {
                const explorerUrl = `https://testnet.suivision.xyz/txblock/${result.digest}`;
                toast.success("Vesting created successfully", {
                    description: "The vesting schedule has been deployed.",
                    action: {
                        label: "View on Explorer",
                        onClick: () => window.open(explorerUrl, "_blank"),
                    },
                });
            },
            onError: (err) => {
                toast.error("Failed to create vesting: " + err.message);
            }
        });
    };

    return { createVesting };
}