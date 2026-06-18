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

        // 1. Crear el contrato
        const tx = await sdk.createToken({
            network: "testnet",
            senderAddress: account.address,
            token: tokenData
        });

        await tx.build({ client });

        // 2. Ejecutar primera transacción
        signTransaction({ transaction: tx }, {
            onSuccess: async (result) => {
                const txDetails = await client.getTransactionBlock({
                    digest: result.digest,
                    options: {
                        showObjectChanges: true,
                        showEffects: true,
                    },
                });
                
                // 3. Preparar la segunda transacción de finalización
                const finalizeTx = await sdk.finalizeToken(account.address, txDetails);
                await finalizeTx.build({ client });

                // 4. Firmar y ejecutar la segunda transacción
                signTransaction({ transaction: finalizeTx }, {
                    onSuccess: (finalResult) => {
                        const digest = finalResult.digest;
                        const explorerUrl = `https://testnet.suivision.xyz/txblock/${digest}`;

                        toast.success("Token creado con éxito", {
                            description: "La transacción ha sido confirmada.",
                            action: {
                                label: "Ver en Explorer",
                                onClick: () => window.open(explorerUrl, "_blank"),
                            },
                        });
                    },
                    onError: (err) => {
                        toast.error("Error al finalizar: " + err.message);
                    }
                });
            },
            onError: (err) => {
                throw err;
            }
        });
    };

    return { createToken };
}