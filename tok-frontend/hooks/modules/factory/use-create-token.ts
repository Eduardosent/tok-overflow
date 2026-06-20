import { useSuiClient, useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { calculateTotal, FEES } from "@/constants";
import { TokFactory } from "@/sdk";
import { useBalances } from "@/hooks/queries";
import { toast } from "sonner";

export function useCreateToken() {
    const client = useSuiClient();
    const account = useCurrentAccount();
    const { mist } = useBalances();
    const { mutate: signTransaction } = useSignAndExecuteTransaction();

    const createToken = async (tokenData: {
        symbol: string;
        name: string;
        description: string;
        iconUrl: string;
        decimals: number;
    }) => {
        if (!account) throw new Error("Connect your wallet");

        if (BigInt(mist) < calculateTotal(FEES.FACTORY.TOKEN_CREATION)) {
            throw new Error("Insufficient balance for the transaction");
        }

        const sdk = new TokFactory();

        // 1. Initiate contract creation
        const tx = await sdk.createToken({
            network: "testnet",
            senderAddress: account.address,
            token: tokenData
        });

        await tx.build({ client });

        // 2. Execute the first transaction block
        signTransaction({ transaction: tx }, {
            onSuccess: async (result) => {
                let txDetails;
                let retries = 0;
                const maxRetries = 5;

                // Polling to ensure the indexer has processed the transaction
                while (retries < maxRetries) {
                    try {
                        txDetails = await client.getTransactionBlock({
                            digest: result.digest,
                            options: {
                                showObjectChanges: true,
                                showEffects: true,
                            },
                        });
                        break;
                    } catch (e) {
                        retries++;
                        if (retries >= maxRetries) {
                            throw new Error("Timeout: Failed to index the transaction after multiple attempts.");
                        }
                        await new Promise((resolve) => setTimeout(resolve, 1500));
                    }
                }
                
                // 3. Prepare the finalization transaction
                try {
                    const finalizeTx = await sdk.finalizeToken(account.address, txDetails);
                    await finalizeTx.build({ client });

                    // 4. Sign and execute the finalization transaction
                    signTransaction({ transaction: finalizeTx }, {
                        onSuccess: (finalResult) => {
                            const digest = finalResult.digest;
                            const explorerUrl = `https://testnet.suivision.xyz/txblock/${digest}`;

                            toast.success("Token successfully created", {
                                description: "The transaction has been confirmed on-chain.",
                                action: {
                                    label: "View on Explorer",
                                    onClick: () => window.open(explorerUrl, "_blank"),
                                },
                            });
                        },
                        onError: (err) => {
                            toast.error("Finalization failed: " + err.message);
                        }
                    });
                } catch (finalizeError: any) {
                    toast.error("Error preparing finalization: " + finalizeError.message);
                }
            },
            onError: (err) => {
                toast.error("First transaction failed: " + err.message);
            }
        });
    };

    return { createToken };
}